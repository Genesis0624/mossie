"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ROUTE_TO_STATUS, type ChecklistItem } from "./types";
import { PILLAR_SLUGS } from "@/features/pillars/pillars";
import { CONTEXT_SLUGS } from "./contexts";

function cleanChecklist(input: unknown): ChecklistItem[] {
  const arr = Array.isArray(input) ? input : [];
  return arr
    .map((it) => ({
      text: String((it as ChecklistItem)?.text ?? "").trim(),
      done: Boolean((it as ChecklistItem)?.done),
    }))
    .filter((it) => it.text.length > 0)
    .slice(0, 50);
}

function parseChecklistField(raw: FormDataEntryValue | null): ChecklistItem[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    return cleanChecklist(JSON.parse(raw));
  } catch {
    return [];
  }
}

const createSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Escribe algo para capturar.")
    .max(500, "Demasiado largo."),
  is_express: z.boolean().default(false),
});

export type CaptureState = {
  ok: boolean;
  message: string | null;
  // token que cambia en cada guardado exitoso, para que el cliente limpie y reenfoque
  savedAt: number | null;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createTask(
  _prev: CaptureState,
  formData: FormData,
): Promise<CaptureState> {
  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    is_express: formData.get("is_express") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa lo que escribiste.",
      savedAt: null,
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, message: "Tu sesión expiró.", savedAt: null };
  }

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: parsed.data.title,
    is_express: parsed.data.is_express,
    status: parsed.data.is_express ? "express" : "inbox",
    type: "operativa",
  });

  if (error) {
    return {
      ok: false,
      message: "No se pudo guardar. Reintenta.",
      savedAt: null,
    };
  }

  revalidatePath("/");
  revalidatePath("/tareas");
  return {
    ok: true,
    message: parsed.data.is_express
      ? "Guardada en exprés."
      : "Guardada en Inbox.",
    savedAt: Date.now(),
  };
}

export async function completeTask(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;

  // Bloqueadas no se pueden completar hasta desbloquear (Flujo v2.0 §17.3).
  // El filtro por estado hace que la operación sea un no-op si está bloqueada.
  await supabase
    .from("tasks")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)
    .neq("status", "blocked")
    .is("deleted_at", null);

  revalidatePath("/");
  revalidatePath("/tareas");
}

export async function updateTaskTitle(
  id: string,
  title: string,
): Promise<void> {
  const clean = title.trim();
  if (clean.length < 1 || clean.length > 500) return;

  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase
    .from("tasks")
    .update({ title: clean })
    .eq("id", id)
    .is("deleted_at", null);

  revalidatePath("/");
  revalidatePath("/tareas");
}

const processSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, "El título no puede quedar vacío.").max(500),
  type: z.enum(["operativa", "estrategica"]).default("operativa"),
  urgent: z.boolean(),
  important: z.boolean(),
  route: z.enum(["atender", "planificar", "delegar", "algun_dia"]),
});

export type ProcessState = { ok: boolean; message: string | null };

export async function processTask(
  _prev: ProcessState,
  formData: FormData,
): Promise<ProcessState> {
  const parsed = processSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    type: formData.get("type") ?? "operativa",
    urgent: formData.get("urgent") === "on",
    important: formData.get("important") === "on",
    route: formData.get("route"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa la decisión.",
    };
  }

  // Pilar (slug de la lista fija) y fecha límite: opcionales.
  const pillarRaw = formData.get("pillar");
  const pillar =
    typeof pillarRaw === "string" && PILLAR_SLUGS.includes(pillarRaw)
      ? pillarRaw
      : null;
  const deadlineRaw = formData.get("deadline_at");
  const deadline_at =
    typeof deadlineRaw === "string" && deadlineRaw.trim()
      ? deadlineRaw.trim()
      : null;

  const isRecurring = formData.get("is_recurring") === "on";
  const checklist = parseChecklistField(formData.get("checklist"));
  const attendToday = parsed.data.route === "atender";

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, message: "Tu sesión expiró." };

  const { error } = await supabase
    .from("tasks")
    .update({
      title: parsed.data.title,
      type: parsed.data.type,
      urgent: parsed.data.urgent,
      important: parsed.data.important,
      pillar,
      deadline_at,
      is_recurring: isRecurring,
      checklist,
      attend_today: attendToday,
      status: ROUTE_TO_STATUS[parsed.data.route],
    })
    .eq("id", parsed.data.id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, message: "No se pudo procesar. Reintenta." };
  }

  revalidatePath("/");
  revalidatePath("/tareas");
  return { ok: true, message: null };
}

// Planificación (Flujo v2.0 §12): la fecha de ejecución es obligatoria; el
// resto de condiciones (hora, duración, energía, efecto y prioridad) son
// opcionales. Se guardan junto con la fecha al confirmar.
const planSchema = z.object({
  id: z.string().uuid(),
  execution_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida."),
  scheduled_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  estimated_duration_minutes: z
    .number()
    .int()
    .min(1)
    .max(1440)
    .nullable()
    .optional(),
  energy_required: z.enum(["baja", "media", "alta"]).nullable().optional(),
  energy_effect: z.enum(["da", "neutral", "quita"]).nullable().optional(),
  priority: z.enum(["alta", "media", "baja"]).nullable().optional(),
});

export type PlanInput = {
  scheduled_time?: string | null;
  estimated_duration_minutes?: number | null;
  energy_required?: "baja" | "media" | "alta" | null;
  energy_effect?: "da" | "neutral" | "quita" | null;
  priority?: "alta" | "media" | "baja" | null;
  contexts?: string[];
};

export type PlanResult = { ok: boolean; message: string | null };

// Fijar (o reprogramar) la fecha de ejecución. Con fecha, la tarea queda
// planificada (status='planned'); su bucket hoy/mañana/vencida/futura se deriva
// al leer. Se limpia attend_today porque la fecha ya gobierna la agenda.
export async function planTask(
  id: string,
  executionDate: string,
  input: PlanInput = {},
): Promise<PlanResult> {
  const parsed = planSchema.safeParse({
    id,
    execution_date: executionDate,
    scheduled_time: input.scheduled_time ?? null,
    estimated_duration_minutes: input.estimated_duration_minutes ?? null,
    energy_required: input.energy_required ?? null,
    energy_effect: input.energy_effect ?? null,
    priority: input.priority ?? null,
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los datos.",
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, message: "Tu sesión expiró." };

  const { error } = await supabase
    .from("tasks")
    .update({
      status: "planned",
      execution_date: parsed.data.execution_date,
      scheduled_time: parsed.data.scheduled_time,
      estimated_duration_minutes: parsed.data.estimated_duration_minutes,
      energy_required: parsed.data.energy_required,
      energy_effect: parsed.data.energy_effect,
      priority: parsed.data.priority,
      attend_today: false,
    })
    .eq("id", parsed.data.id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, message: "No se pudo planificar. Reintenta." };
  }

  // Contextos (m2m §12.5): se reemplaza el conjunto por el elegido. Solo slugs
  // válidos y sin repetir. La RLS de task_contexts limita al dueño de la tarea.
  const contexts = [...new Set(input.contexts ?? [])].filter((c) =>
    CONTEXT_SLUGS.includes(c),
  );
  await supabase.from("task_contexts").delete().eq("task_id", parsed.data.id);
  if (contexts.length > 0) {
    await supabase
      .from("task_contexts")
      .insert(
        contexts.map((context) => ({ task_id: parsed.data.id, context })),
      );
  }

  revalidatePath("/");
  revalidatePath("/tareas");
  return { ok: true, message: null };
}

// En espera (Flujo v2.0 §18): "podría, pero decidí pausarla". Fecha de revisión
// OBLIGATORIA (cuándo volver a decidir); motivo OPCIONAL. Se limpia la fecha de
// ejecución para que no aparezca como vencida en Hoy.
const waitSchema = z.object({
  id: z.string().uuid(),
  review_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha válida."),
  reason: z.string().trim().max(300, "Demasiado largo.").optional(),
});

export type WaitResult = { ok: boolean; message: string | null };

export async function waitTask(
  id: string,
  reviewAt: string,
  reason?: string,
): Promise<WaitResult> {
  const parsed = waitSchema.safeParse({ id, review_at: reviewAt, reason });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los datos.",
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, message: "Tu sesión expiró." };

  const { error } = await supabase
    .from("tasks")
    .update({
      status: "waiting",
      review_at: parsed.data.review_at,
      waiting_reason: parsed.data.reason || null,
      execution_date: null,
      attend_today: false,
    })
    .eq("id", parsed.data.id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, message: "No se pudo poner en espera. Reintenta." };
  }

  revalidatePath("/");
  revalidatePath("/tareas");
  return { ok: true, message: null };
}

// Bloquear (Flujo v2.0 §17): "no puedo hacerla". Requisito de desbloqueo
// OBLIGATORIO. Mientras esté bloqueada no se puede completar. Se limpia la
// fecha de ejecución para que no aparezca como vencida.
const blockSchema = z.object({
  id: z.string().uuid(),
  requirement: z
    .string()
    .trim()
    .min(1, "Escribe qué falta para poder hacerla.")
    .max(300, "Demasiado largo."),
});

export type BlockResult = { ok: boolean; message: string | null };

export async function blockTask(
  id: string,
  requirement: string,
): Promise<BlockResult> {
  const parsed = blockSchema.safeParse({ id, requirement });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Requisito inválido.",
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, message: "Tu sesión expiró." };

  const { error } = await supabase
    .from("tasks")
    .update({
      status: "blocked",
      block_requirement: parsed.data.requirement,
      execution_date: null,
      attend_today: false,
    })
    .eq("id", parsed.data.id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, message: "No se pudo bloquear. Reintenta." };
  }

  revalidatePath("/");
  revalidatePath("/tareas");
  return { ok: true, message: null };
}

// Reanudar (En espera) o Desbloquear (Bloqueadas): en ambos casos la tarea
// vuelve a "Por planificar" para redecidir fecha, y se limpia el estado de
// pausa/bloqueo. (§17.3 y §18.4.)
export async function resumeTask(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase
    .from("tasks")
    .update({
      status: "to_plan",
      waiting_reason: null,
      review_at: null,
      block_requirement: null,
    })
    .eq("id", id)
    .is("deleted_at", null);

  revalidatePath("/");
  revalidatePath("/tareas");
}

export async function deleteTask(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/tareas");
}

export async function updateTaskChecklist(
  id: string,
  checklist: ChecklistItem[],
): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase
    .from("tasks")
    .update({ checklist: cleanChecklist(checklist) })
    .eq("id", id)
    .is("deleted_at", null);

  revalidatePath("/");
  revalidatePath("/tareas");
}
