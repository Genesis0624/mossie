"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

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
  revalidatePath("/inbox");
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
  revalidatePath("/inbox");
}

export async function deleteTask(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/inbox");
}
