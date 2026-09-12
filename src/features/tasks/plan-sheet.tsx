"use client";

import { useState, useTransition } from "react";
import { planTask } from "./actions";
import { sdDateString, addDays } from "./dates";
import type { Task } from "./types";

// Drawer para fijar la fecha de ejecución de una tarea de "Por planificar"
// (o reprogramar una ya planificada). Hoy / Mañana son un toque; "Otra fecha"
// abre el selector. Con fecha, la tarea queda planificada.
export function PlanSheet({
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const today = sdDateString();
  const tomorrow = addDays(today, 1);
  const [custom, setCustom] = useState(
    task.execution_date && task.execution_date > tomorrow
      ? task.execution_date
      : "",
  );

  const plan = (date: string) => {
    setError(null);
    startTransition(async () => {
      const res = await planTask(task.id, date);
      if (res.ok) onClose();
      else setError(res.message);
    });
  };

  if (!open) return null;

  const fmt = (d: string) =>
    new Intl.DateTimeFormat("es-DO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(d + "T12:00:00"));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Planificar tarea"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="bg-ink/20 absolute inset-0"
      />

      <div className="bg-paper relative mx-auto w-full max-w-md rounded-t-[var(--radius-xl)] p-6 pb-8 shadow-[var(--shadow-lg)]">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-editorial text-moss-800 text-2xl">
            {task.status === "planned" ? "Reprogramar" : "Planificar"}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="text-ink-mute hover:bg-paper-2 flex size-9 items-center justify-center rounded-full"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="text-ink-soft mb-5 line-clamp-2 text-sm">{task.title}</p>

        <p className="text-ink-soft text-sm">¿Cuándo la ejecutas?</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => plan(today)}
            className={`flex-1 rounded-lg border px-3 py-3 text-sm transition-colors disabled:opacity-60 ${
              task.execution_date === today
                ? "border-moss-500 bg-moss-50 text-moss-800"
                : "border-line-2 bg-paper-2 text-ink-soft hover:border-line"
            }`}
          >
            Hoy
            <span className="text-ink-mute mt-0.5 block text-xs">
              {fmt(today)}
            </span>
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => plan(tomorrow)}
            className={`flex-1 rounded-lg border px-3 py-3 text-sm transition-colors disabled:opacity-60 ${
              task.execution_date === tomorrow
                ? "border-moss-500 bg-moss-50 text-moss-800"
                : "border-line-2 bg-paper-2 text-ink-soft hover:border-line"
            }`}
          >
            Mañana
            <span className="text-ink-mute mt-0.5 block text-xs">
              {fmt(tomorrow)}
            </span>
          </button>
        </div>

        <div className="mt-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-ink-soft text-sm">Otra fecha</span>
            <input
              type="date"
              value={custom}
              min={today}
              onChange={(e) => setCustom(e.target.value)}
              className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
            />
          </label>
          <button
            type="button"
            disabled={pending || !custom}
            onClick={() => custom && plan(custom)}
            className="bg-moss-700 text-paper hover:bg-moss-800 mt-3 min-h-[48px] w-full rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Planificar en esa fecha"}
          </button>
        </div>

        {error ? (
          <p className="bg-clay-50 text-ink-soft mt-4 rounded-md px-3 py-2 text-sm">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
