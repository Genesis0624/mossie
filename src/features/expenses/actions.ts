"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  concept: z.string().trim().min(1, "Describe el gasto.").max(300),
  amount: z.coerce
    .number({ message: "Escribe un monto válido." })
    .nonnegative("El monto no puede ser negativo."),
  account: z
    .enum(["efectivo", "debito", "credito", "otra"])
    .default("efectivo"),
  date: z.string().trim().optional(),
});

export type ExpenseState = {
  ok: boolean;
  message: string | null;
  savedAt: number | null;
};

export async function createExpense(
  _prev: ExpenseState,
  formData: FormData,
): Promise<ExpenseState> {
  const parsed = schema.safeParse({
    concept: formData.get("concept"),
    amount: formData.get("amount"),
    account: formData.get("account") ?? "efectivo",
    date: formData.get("date"),
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

  const date = parsed.data.date?.trim();

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    concept: parsed.data.concept,
    amount: parsed.data.amount,
    account: parsed.data.account,
    ...(date ? { spent_at: new Date(date + "T12:00:00").toISOString() } : {}),
  });

  if (error) {
    return {
      ok: false,
      message: "No se pudo guardar el gasto.",
      savedAt: null,
    };
  }

  revalidatePath("/");
  return {
    ok: true,
    message: "Gasto registrado en Finanzas.",
    savedAt: Date.now(),
  };
}
