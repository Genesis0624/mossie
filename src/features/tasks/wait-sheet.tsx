"use client";

import { useState, useTransition } from "react";
import { waitTask } from "./actions";
import { sdDateString, addDays } from "./dates";
import type { Task } from "./types";

// Drawer para poner una tarea "En espera" (Flujo v2.0 §18): la pausas a
// propósito. La fecha de revisión es obligatoria (cuándo volver a decidir);
// el motivo es opcional. Al guardar se limpia la fecha de ejecución.
export function WaitSheet({
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const today = sdDateString();
  const in3 = addDays(today, 3);
  const in7 = addDays(today, 7);
  const [reviewAt, setReviewAt] = useState(task.review_at ?? in7);
  const [reason, setReason] = useState(task.waiting_reason ?? "");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!reviewAt) {
      setError("Elige cuándo quieres revisarla.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await waitTask(task.id, reviewAt, reason.trim() || undefined);
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
      aria-label="Poner en espera"
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
            Poner en espera
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

        <p className="text-ink-soft text-sm">¿Cuándo la revisas de nuevo?</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setReviewAt(in3)}
            className={`flex-1 rounded-lg border px-3 py-3 text-sm transition-colors ${
              reviewAt === in3
                ? "border-moss-500 bg-moss-50 text-moss-800"
                : "border-line-2 bg-paper-2 text-ink-soft hover:border-line"
            }`}
          >
            En 3 días
            <span className="text-ink-mute mt-0.5 block text-xs">
              {fmt(in3)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setReviewAt(in7)}
            className={`flex-1 rounded-lg border px-3 py-3 text-sm transition-colors ${
              reviewAt === in7
                ? "border-moss-500 bg-moss-50 text-moss-800"
                : "border-line-2 bg-paper-2 text-ink-soft hover:border-line"
            }`}
          >
            En 1 semana
            <span className="text-ink-mute mt-0.5 block text-xs">
              {fmt(in7)}
            </span>
          </button>
        </div>

        <label className="mt-3 flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">Otra fecha de revisión</span>
          <input
            type="date"
            value={reviewAt}
            min={today}
            onChange={(e) => setReviewAt(e.target.value)}
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
          />
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">
            Motivo <span className="text-ink-mute">(opcional)</span>
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Ej.: primero debo terminar el informe…"
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 resize-none rounded-md border px-4 py-3 text-base outline-none"
          />
        </label>

        {error ? (
          <p className="bg-clay-50 text-ink-soft mt-3 rounded-md px-3 py-2 text-sm">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={pending || !reviewAt}
          onClick={submit}
          className="bg-moss-700 text-paper hover:bg-moss-800 mt-5 min-h-[48px] w-full rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Poner en espera"}
        </button>
      </div>
    </div>
  );
}
