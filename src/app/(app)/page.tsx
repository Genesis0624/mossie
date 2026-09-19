import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TaskRow } from "@/features/tasks/task-row";
import { TASK_SELECT, rowsToTasks } from "@/features/tasks/types";
import { sdDateString, addDays } from "@/features/tasks/dates";

const FIELDS = TASK_SELECT;

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: plannedData },
    { data: expressData },
    { count: inboxCount },
  ] = await Promise.all([
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
      .order("execution_date", { ascending: true }),
    supabase
      .from("tasks")
      .select(FIELDS)
      .eq("status", "express")
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    // Indicador de Inbox (§20.2): solo el conteo de tareas sin procesar.
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("status", "inbox")
      .is("deleted_at", null),
  ]);

  const nombre = profile?.full_name?.trim();
  const planned = rowsToTasks(plannedData);
  const express = rowsToTasks(expressData);
  const inbox = inboxCount ?? 0;

  // Corte a medianoche en zona Santo Domingo: los buckets se derivan de la
  // fecha, así "mañana" pasa a "hoy" solo al cambiar el día (sin cron).
  const today = sdDateString();
  const tomorrow = addDays(today, 1);
  const hoy = planned.filter((t) => t.execution_date === today);
  const manana = planned.filter((t) => t.execution_date === tomorrow);
  const vencidas = planned.filter(
    (t) => t.execution_date != null && t.execution_date < today,
  );

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
      <h1 className="font-editorial text-moss-800 mt-2 text-3xl lg:text-4xl">
        {nombre ? `Hola, ${nombre}` : "Hola"}
      </h1>
      <p className="font-editorial text-ink-soft mt-3 text-lg italic">
        La cotidianidad no puede seguir ahogando el futuro.
      </p>

      <Link
        href="/tareas"
        aria-label={
          inbox > 0
            ? `Procesar Inbox: ${inbox} ${inbox === 1 ? "tarea" : "tareas"} por procesar`
            : "Abrir Inbox, sin pendientes"
        }
        className={`mt-8 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors lg:max-w-md ${
          inbox > 0
            ? "border-moss-300 bg-moss-50 hover:bg-moss-100"
            : "border-line bg-paper-2 hover:bg-paper"
        }`}
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
              inbox > 0 ? "bg-moss-700 text-paper" : "bg-line-2 text-ink-mute"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 13h4l2 3h4l2-3h4" />
              <path d="M5 13V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7" />
            </svg>
          </span>
          <span>
            <span className="text-ink block text-sm font-medium">Inbox</span>
            <span className="text-ink-mute block text-xs">
              {inbox > 0 ? `${inbox} por procesar` : "Todo procesado por ahora"}
            </span>
          </span>
        </span>
        {inbox > 0 ? (
          <span className="bg-moss-700 text-paper shrink-0 rounded-full px-3 py-1 text-sm font-medium">
            Procesar
          </span>
        ) : (
          <span className="text-ink-mute shrink-0" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        )}
      </Link>

      {/* Escritorio: Hoy dominante a la izquierda, lateral a la derecha.
          Móvil: columna única con el mismo orden (Hoy·Vencidas·Mañana·Exprés). */}
      <div className="mt-10 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        {/* Columna dominante */}
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-ink text-base font-medium">Hoy</h2>
            {hoy.length === 0 ? (
              <p className="text-ink-mute mt-2 text-sm">
                Nada agendado para hoy. Planifica tus tareas de Por planificar y
                las de hoy aparecerán aquí.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {hoy.map((task) => (
                  <TaskRow key={task.id} task={task} canPlan />
                ))}
              </ul>
            )}
          </section>

          {vencidas.length > 0 ? (
            <section>
              <h2 className="text-ink text-base font-medium">Vencidas</h2>
              <p className="text-ink-mute mt-1 text-sm">
                Sin culpa: decide si van para hoy, otra fecha o ya no.
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {vencidas.map((task) => (
                  <TaskRow key={task.id} task={task} canPlan />
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* Columna lateral */}
        <div className="mt-8 flex flex-col gap-8 lg:mt-0">
          <section>
            <h2 className="text-ink text-base font-medium">Preparar mañana</h2>
            {manana.length === 0 ? (
              <p className="text-ink-mute mt-2 text-sm">
                Nada para mañana todavía. Lo que planifiques para mañana
                aparecerá aquí para que prepares lo necesario.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {manana.map((task) => (
                  <TaskRow key={task.id} task={task} canPlan />
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-ink text-base font-medium">Tareas exprés</h2>
            {express.length === 0 ? (
              <p className="text-ink-mute mt-2 text-sm">
                Nada exprés por ahora. Lo que captures como exprés aparecerá
                aquí para atenderlo en el momento.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {express.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
