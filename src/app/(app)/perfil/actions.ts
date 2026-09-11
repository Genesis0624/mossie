"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  full_name: z
    .string()
    .trim()
    .max(80, "El nombre es demasiado largo.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export type ProfileState = { ok: boolean; message: string | null };

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const parsed = schema.safeParse({ full_name: formData.get("full_name") });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa el nombre.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Tu sesión expiró. Vuelve a entrar." };
  }

  // upsert por si el perfil aún no existe (RLS solo permite la fila propia).
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, full_name: parsed.data.full_name });

  if (error) {
    return { ok: false, message: "No pudimos guardar. Inténtalo de nuevo." };
  }

  revalidatePath("/perfil");
  revalidatePath("/");
  return { ok: true, message: "Guardado." };
}
