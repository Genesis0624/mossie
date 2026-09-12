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
