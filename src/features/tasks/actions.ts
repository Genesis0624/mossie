"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ROUTE_TO_STATUS, type ChecklistItem } from "./types";
import { PILLAR_SLUGS } from "@/features/pillars/pillars";
import { CONTEXT_SLUGS } from "./contexts";
import { nextOccurrence, type FrequencyType } from "./recurrence";
import { sdDateString } from "./dates";
import {
  DELEGATION_STATUSES,
  requiresAssignee,
  type DelegationStatus,
} from "./delegations";

type Supabase = Awaited<ReturnType<typeof createClient>>;

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

// Registro de historial (§23). Best-effort: no debe romper la operación
// principal si falla.
async function logHistory(
  supabase: Supabase,
  userId: string,
  taskId: string,
  eventType: string,
  opts: {
    previous?: string | null;
    next?: string | null;
    metadata?: Record<string, unknown>;
  } = {},
): Promise<void> {
  await supabase.from("task_history").insert({
    user_id: userId,
    task_id: taskId,
    event_type: eventType,
    previous_value: opts.previous ?? null,
    new_value: opts.next ?? null,
    metadata: opts.metadata ?? null,
  });
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

// Datos de la tarea que se completa, necesarios para no completar bloqueadas y
// para copiar la siguiente ocurrencia si es recurrente.
type CompletingTask = {
  id: string;
  status: string;
  title: string;
  type: string;
  urgent: boolean | null;
  important: boolean | null;
  pillar: string | null;
  checklist: ChecklistItem[] | null;
  execution_date: string | null;
  scheduled_time: string | null;
  estimated_duration_minutes: number | null;
  energy_required: string | null;
  energy_effect: string | null;
  priority: string | null;
  recurrence_rule_id: string | null;
};

export async function completeTask(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;

  const { data: task } = await supabase
    .from("tasks")
    .select(
      "id, status, title, type, urgent, important, pillar, checklist, execution_date, scheduled_time, estimated_duration_minutes, energy_required, energy_effect, priority, recurrence_rule_id",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle<CompletingTask>();

  // Bloqueadas no se pueden completar hasta desbloquear (Flujo v2.0 §17.3).
  if (!task || task.status === "blocked") return;

  const { error } = await supabase
    .from("tasks")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)
    .neq("status", "blocked")
    .is("deleted_at", null);
  if (error) return;

  await logHistory(supabase, user.id, id, "completed");

  // Recurrencia (§13.3): al completar una ocurrencia se genera la siguiente.
  if (task.recurrence_rule_id) {
    await generateNextOccurrence(supabase, user.id, task);
  }

  revalidatePath("/");
  revalidatePath("/tareas");
}

// Crea la siguiente ocurrencia de una tarea recurrente completada, respetando
// fin/ocurrencias máximas y evitando duplicados. Cada ocurrencia es una tarea
// independiente vinculada a la misma regla.
async function generateNextOccurrence(
  supabase: Supabase,
  userId: string,
  task: CompletingTask,
): Promise<void> {
  if (!task.recurrence_rule_id) return;

  const { data: rule } = await supabase
    .from("recurrence_rules")
    .select(
      "id, frequency_type, interval_value, calculation_mode, ends_at, max_occurrences, occurrences_count, is_active",
    )
    .eq("id", task.recurrence_rule_id)
    .maybeSingle();
  if (!rule || !rule.is_active) return;

  const deactivate = () =>
    supabase
      .from("recurrence_rules")
      .update({ is_active: false })
      .eq("id", rule.id);

  if (rule.max_occurrences && rule.occurrences_count >= rule.max_occurrences) {
    await deactivate();
    return;
  }

  // fixed_calendar: se cuenta desde la fecha planificada; after_completion:
  // desde hoy (la fecha real de completado).
  const base =
    rule.calculation_mode === "after_completion"
      ? sdDateString()
      : (task.execution_date ?? sdDateString());
  const next = nextOccurrence(
    rule.frequency_type as FrequencyType,
    rule.interval_value,
    base,
  );

  if (rule.ends_at && next > rule.ends_at) {
    await deactivate();
    return;
  }

  // Evitar duplicados (p. ej. doble clic): no crear si ya existe una ocurrencia
  // activa en esa fecha para la misma regla.
  const { data: existing } = await supabase
    .from("tasks")
    .select("id")
    .eq("recurrence_rule_id", rule.id)
    .eq("execution_date", next)
    .is("deleted_at", null)
    .not("status", "in", "(completed,canceled)")
    .limit(1);
  if (existing && existing.length > 0) return;

  const checklist = Array.isArray(task.checklist)
    ? task.checklist.map((c) => ({ text: c.text, done: false }))
    : [];

  const { data: inserted } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: task.title,
      type: task.type,
      is_express: false,
      status: "planned",
      urgent: task.urgent,
      important: task.important,
      pillar: task.pillar,
      execution_date: next,
      attend_today: false,
      is_recurring: true,
      checklist,
      scheduled_time: task.scheduled_time,
      estimated_duration_minutes: task.estimated_duration_minutes,
      energy_required: task.energy_required,
      energy_effect: task.energy_effect,
      priority: task.priority,
      recurrence_rule_id: rule.id,
    })
    .select("id")
    .maybeSingle();

  // Copiar los contextos a la nueva ocurrencia.
  if (inserted) {
    const { data: ctxs } = await supabase
      .from("task_contexts")
      .select("context")
      .eq("task_id", task.id);
    if (ctxs && ctxs.length > 0) {
      await supabase
        .from("task_contexts")
        .insert(
          ctxs.map((c) => ({ task_id: inserted.id, context: c.context })),
        );
    }
  }

  await supabase
    .from("recurrence_rules")
    .update({
      next_occurrence_at: next,
      occurrences_count: rule.occurrences_count + 1,
    })
    .eq("id", rule.id);
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

  await logHistory(supabase, user.id, parsed.data.id, "processed", {
    next: ROUTE_TO_STATUS[parsed.data.route],
    metadata: { route: parsed.data.route },
  });

  // Ruta Delegar (§14.1): entra en Delegadas con estado inicial "Por delegar",
  // aún sin responsable. No pisa una delegación existente.
  if (parsed.data.route === "delegar") {
    await supabase.from("task_delegations").upsert(
      {
        task_id: parsed.data.id,
        user_id: user.id,
        delegation_status: "por_delegar",
      },
      { onConflict: "task_id", ignoreDuplicates: true },
    );
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

// Regla de recurrencia enviada desde el panel (solo si la tarea es recurrente).
const recurrenceSchema = z.object({
  frequency_type: z.enum(["daily", "weekly", "monthly", "yearly"]),
  interval_value: z.number().int().min(1).max(365),
  calculation_mode: z.enum(["fixed_calendar", "after_completion"]),
  ends_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  max_occurrences: z.number().int().min(1).max(1000).nullable().optional(),
});

export type RecurrenceInput = z.infer<typeof recurrenceSchema>;

export type PlanInput = {
  scheduled_time?: string | null;
  estimated_duration_minutes?: number | null;
  energy_required?: "baja" | "media" | "alta" | null;
  energy_effect?: "da" | "neutral" | "quita" | null;
  priority?: "alta" | "media" | "baja" | null;
  contexts?: string[];
  recurrence?: RecurrenceInput | null;
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

  // Estado previo: para detectar reprogramación (§16.3) y reutilizar en la
  // recurrencia.
  const { data: prev } = await supabase
    .from("tasks")
    .select(
      "execution_date, reschedule_count, is_recurring, recurrence_rule_id",
    )
    .eq("id", parsed.data.id)
    .maybeSingle();
  const prevDate = prev?.execution_date ?? null;
  const isReschedule = !!prevDate && prevDate !== parsed.data.execution_date;

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
      reschedule_count: (prev?.reschedule_count ?? 0) + (isReschedule ? 1 : 0),
    })
    .eq("id", parsed.data.id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, message: "No se pudo planificar. Reintenta." };
  }

  // Historial (§23): reprogramar conserva la fecha anterior; la primera
  // planificación registra 'planned'.
  await logHistory(
    supabase,
    user.id,
    parsed.data.id,
    isReschedule ? "rescheduled" : "planned",
    { previous: prevDate, next: parsed.data.execution_date },
  );

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

  // Recurrencia (§13): solo si la tarea está marcada como recurrente. Se crea o
  // actualiza su regla; la primera ocurrencia es esta tarea.
  if (input.recurrence) {
    const rc = recurrenceSchema.safeParse(input.recurrence);
    if (rc.success && prev?.is_recurring) {
      const ruleFields = {
        frequency_type: rc.data.frequency_type,
        interval_value: rc.data.interval_value,
        calculation_mode: rc.data.calculation_mode,
        starts_at: parsed.data.execution_date,
        ends_at: rc.data.ends_at ?? null,
        max_occurrences: rc.data.max_occurrences ?? null,
        is_active: true,
      };
      if (prev.recurrence_rule_id) {
        await supabase
          .from("recurrence_rules")
          .update(ruleFields)
          .eq("id", prev.recurrence_rule_id);
      } else {
        const nextAt =
          rc.data.calculation_mode === "fixed_calendar"
            ? nextOccurrence(
                rc.data.frequency_type,
                rc.data.interval_value,
                parsed.data.execution_date,
              )
            : null;
        const { data: rule } = await supabase
          .from("recurrence_rules")
          .insert({
            user_id: user.id,
            ...ruleFields,
            occurrences_count: 1,
            next_occurrence_at: nextAt,
          })
          .select("id")
          .maybeSingle();
        if (rule) {
          await supabase
            .from("tasks")
            .update({ recurrence_rule_id: rule.id })
            .eq("id", parsed.data.id);
        }
      }
    }
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

  // §18.3: se guarda la fecha de ejecución anterior en el historial.
  const { data: prev } = await supabase
    .from("tasks")
    .select("execution_date")
    .eq("id", parsed.data.id)
    .maybeSingle();

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

  await logHistory(supabase, user.id, parsed.data.id, "paused", {
    previous: prev?.execution_date ?? null,
    metadata: { review_at: parsed.data.review_at },
  });

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

  const { data: prev } = await supabase
    .from("tasks")
    .select("execution_date")
    .eq("id", parsed.data.id)
    .maybeSingle();

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

  await logHistory(supabase, user.id, parsed.data.id, "blocked", {
    previous: prev?.execution_date ?? null,
    metadata: { requirement: parsed.data.requirement },
  });

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

  const { data: prev } = await supabase
    .from("tasks")
    .select("status")
    .eq("id", id)
    .maybeSingle();

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

  // 'unblocked' si venía de Bloqueadas; 'resumed' si venía de En espera.
  await logHistory(
    supabase,
    user.id,
    id,
    prev?.status === "blocked" ? "unblocked" : "resumed",
  );

  revalidatePath("/");
  revalidatePath("/tareas");
}

// Delegar / gestionar delegación (Flujo v2.0 §14). El responsable es texto
// libre (CRM futuro). "Delegada" y estados posteriores exigen responsable.
// Al fijar una fecha de seguimiento se crea/actualiza una tarea vinculada.
const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const delegateSchema = z.object({
  id: z.string().uuid(),
  assignee_name: z.string().trim().max(200).nullable().optional(),
  delegation_status: z.enum(
    DELEGATION_STATUSES as [DelegationStatus, ...DelegationStatus[]],
  ),
  notify_at: z.string().regex(dateRe).nullable().optional(),
  instructions: z.string().trim().max(2000).nullable().optional(),
  delivery_deadline: z.string().regex(dateRe).nullable().optional(),
  follow_up_at: z.string().regex(dateRe).nullable().optional(),
  expected_evidence: z.string().trim().max(500).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

export type DelegateInput = {
  assignee_name?: string | null;
  delegation_status: DelegationStatus;
  notify_at?: string | null;
  instructions?: string | null;
  delivery_deadline?: string | null;
  follow_up_at?: string | null;
  expected_evidence?: string | null;
  notes?: string | null;
};

export type DelegateResult = { ok: boolean; message: string | null };

export async function delegateTask(
  id: string,
  input: DelegateInput,
): Promise<DelegateResult> {
  const parsed = delegateSchema.safeParse({ id, ...input });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los datos.",
    };
  }
  const d = parsed.data;
  const assignee = d.assignee_name?.trim() || null;
  if (requiresAssignee(d.delegation_status) && !assignee) {
    return {
      ok: false,
      message: "Para marcarla como delegada necesitas un responsable.",
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, message: "Tu sesión expiró." };

  const { data: task } = await supabase
    .from("tasks")
    .select("title, pillar, status")
    .eq("id", d.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!task) return { ok: false, message: "No se encontró la tarea." };

  const { data: existing } = await supabase
    .from("task_delegations")
    .select("follow_up_task_id")
    .eq("task_id", d.id)
    .maybeSingle();

  // La tarea principal pasa a Delegadas y deja de estar agendada para mí.
  await supabase
    .from("tasks")
    .update({ status: "delegated", execution_date: null, attend_today: false })
    .eq("id", d.id)
    .is("deleted_at", null);

  // Upsert del detalle (sin tocar follow_up_task_id, que se gestiona abajo).
  const { error: delErr } = await supabase.from("task_delegations").upsert(
    {
      task_id: d.id,
      user_id: user.id,
      assignee_name: assignee,
      delegation_status: d.delegation_status,
      notify_at: d.notify_at ?? null,
      instructions: d.instructions?.trim() || null,
      delivery_deadline: d.delivery_deadline ?? null,
      follow_up_at: d.follow_up_at ?? null,
      expected_evidence: d.expected_evidence?.trim() || null,
      notes: d.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "task_id" },
  );
  if (delErr) {
    return { ok: false, message: "No se pudo guardar la delegación." };
  }

  // Tarea de seguimiento vinculada (§14.4): crear/actualizar sin duplicar.
  const followId = existing?.follow_up_task_id ?? null;
  if (d.follow_up_at) {
    if (followId) {
      await supabase
        .from("tasks")
        .update({
          status: "planned",
          execution_date: d.follow_up_at,
          deleted_at: null,
        })
        .eq("id", followId);
    } else {
      const { data: created } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: `Dar seguimiento a: ${task.title}`,
          type: "operativa",
          status: "planned",
          pillar: task.pillar,
          execution_date: d.follow_up_at,
          is_recurring: false,
        })
        .select("id")
        .maybeSingle();
      if (created) {
        await supabase
          .from("task_delegations")
          .update({ follow_up_task_id: created.id })
          .eq("task_id", d.id);
      }
    }
  } else if (followId) {
    // Se quitó la fecha de seguimiento: se cierra la tarea vinculada.
    await supabase
      .from("tasks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", followId);
    await supabase
      .from("task_delegations")
      .update({ follow_up_task_id: null })
      .eq("task_id", d.id);
  }

  await logHistory(supabase, user.id, d.id, "delegated", {
    metadata: { status: d.delegation_status, assignee },
  });

  revalidatePath("/");
  revalidatePath("/tareas");
  return { ok: true, message: null };
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
