"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(1, "Ponle un nombre al evento.").max(300),
  date: z.string().trim().optional(),
  time: z.string().trim().optional(),
  location: z.string().trim().max(500).optional(),
  modality: z
    .enum(["presencial", "virtual", "por_confirmar"])
    .default("por_confirmar"),
  checklist: z.string().optional(),
});

export type EventState = {
  ok: boolean;
  message: string | null;
  savedAt: number | null;
};

export async function createEvent(
  _prev: EventState,
  formData: FormData,
): Promise<EventState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    date: formData.get("date"),
    time: formData.get("time"),
    location: formData.get("location"),
    modality: formData.get("modality") ?? "por_confirmar",
    checklist: formData.get("checklist"),
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

  const name = parsed.data.name;
  const date = parsed.data.date?.trim();

  // Sin fecha no es un evento ejecutable: se guarda como tarea en el Inbox.
  if (!date) {
    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: `Definir fecha del evento: ${name}`,
      status: "inbox",
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
      message: "Sin fecha aún: lo dejé en tu Inbox para definirla.",
      savedAt: Date.now(),
    };
  }

  const time = parsed.data.time?.trim() || null;
  const checklist = (parsed.data.checklist ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from("events").insert({
    user_id: user.id,
    name,
    event_date: date,
    event_time: time,
    all_day: !time,
    location: parsed.data.location?.trim() || null,
    modality: parsed.data.modality,
    prep_checklist: checklist,
  });

  if (error) {
    return {
      ok: false,
      message: "No se pudo guardar el evento.",
      savedAt: null,
    };
  }

  revalidatePath("/");
  return {
    ok: true,
    message: "Evento guardado en tu calendario.",
    savedAt: Date.now(),
  };
}
