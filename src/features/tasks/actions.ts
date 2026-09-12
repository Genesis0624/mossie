"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ROUTE_TO_STATUS } from "./types";
import { PILLAR_SLUGS } from "@/features/pillars/pillars";

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

  await supabase
    .from("tasks")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)
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
