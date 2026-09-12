import { createClient } from "@/lib/supabase/server";
import { TaskRow } from "@/features/tasks/task-row";
import type { Task } from "@/features/tasks/types";

const FIELDS =
  "id, title, type, is_express, status, urgent, important, completed_at, created_at";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: hoyData }, { data: expressData }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .maybeSingle(),
      supabase
        .from("tasks")
        .select(FIELDS)
        .eq("status", "planned")
        .is("deleted_at", null)
        .order("created_at", { ascending: true }),
      supabase
        .from("tasks")
        .select(FIELDS)
        .eq("status", "express")
        .is("deleted_at", null)
        .order("created_at", { ascending: true }),
    ]);

  const nombre = profile?.full_name?.trim();
  const hoy = (hoyData ?? []) as Task[];
  const express = (expressData ?? []) as Task[];

  const fecha = new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Santo_Domingo",
  }).format(new Date());

  return (
    <main className="px-6 pt-12">
      <p className="text-ink-mute text-xs tracking-[0.2em] uppercase">
        {fecha}
      </p>
      <h1 className="font-editorial text-moss-800 mt-2 text-3xl">
        {nombre ? `Hola, ${nombre}` : "Hola"}
      </h1>
      <p className="font-editorial text-ink-soft mt-3 text-lg italic">
        La cotidianidad no puede seguir ahogando el futuro.
      </p>

      <section className="mt-10">
        <h2 className="text-ink text-base font-medium">Hoy</h2>
        {hoy.length === 0 ? (
          <p className="text-ink-mute mt-2 text-sm">
            Nada agendado para hoy. Procesa tu Inbox y lo que sea para atender
            ahora aparecerá aquí.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {hoy.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-ink text-base font-medium">Tareas exprés</h2>
        {express.length === 0 ? (
          <p className="text-ink-mute mt-2 text-sm">
            Nada exprés por ahora. Lo que captures como exprés aparecerá aquí
            para atenderlo en el momento.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {express.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
