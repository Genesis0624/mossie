"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  title: z.string().trim().min(1, "Escribe la idea o asunto.").max(1000),
  link: z.string().trim().max(1000).optional(),
});

export type IdeaState = {
  ok: boolean;
  message: string | null;
  savedAt: number | null;
};

export async function createIdea(
  _prev: IdeaState,
  formData: FormData,
): Promise<IdeaState> {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    link: formData.get("link"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los datos.",
      savedAt: null,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Tu sesión expiró.", savedAt: null };

  const { error } = await supabase.from("ideas").insert({
    user_id: user.id,
    title: parsed.data.title,
    link: parsed.data.link?.trim() || null,
    status: "inbox",
  });

  if (error) {
    return {
      ok: false,
      message: "No se pudo guardar. Reintenta.",
      savedAt: null,
    };
  }

  revalidatePath("/ideas");
  return {
    ok: true,
    message: "Guardada en tu Inbox de ideas.",
    savedAt: Date.now(),
  };
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// Convertir una idea en tarea (Flujo v2.0 §22.2): crea la tarea en el Inbox,
// marca la idea como procesada y conserva el enlace de origen. No duplica: solo
// procesa ideas que siguen en el inbox de ideas.
export async function convertIdeaToTask(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;

  const { data: idea } = await supabase
    .from("ideas")
    .select("title, status")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!idea || idea.status !== "inbox") return;

  const { data: task } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: idea.title,
      type: "operativa",
      status: "inbox",
      is_express: false,
    })
    .select("id")
    .maybeSingle();

  await supabase
    .from("ideas")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
      converted_to_type: "task",
      converted_to_task_id: task?.id ?? null,
    })
    .eq("id", id)
    .eq("status", "inbox");

  revalidatePath("/ideas");
  revalidatePath("/tareas");
  revalidatePath("/");
}

export async function archiveIdea(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;
  await supabase
    .from("ideas")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);
  revalidatePath("/ideas");
}

export async function updateIdea(
  id: string,
  title: string,
  link: string,
): Promise<void> {
  const clean = title.trim();
  if (clean.length < 1 || clean.length > 1000) return;
  const { supabase, user } = await requireUser();
  if (!user) return;
  await supabase
    .from("ideas")
    .update({ title: clean, link: link.trim() || null })
    .eq("id", id)
    .is("deleted_at", null);
  revalidatePath("/ideas");
}

export async function deleteIdea(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;
  await supabase
    .from("ideas")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/ideas");
}
