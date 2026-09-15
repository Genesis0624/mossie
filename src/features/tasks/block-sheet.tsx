"use client";

import { useState, useTransition } from "react";
import { blockTask } from "./actions";
import type { Task } from "./types";

// Drawer para "Bloquear" una tarea (Flujo v2.0 §17): no puedes hacerla porque
// falta un requisito verificable. El requisito de desbloqueo es OBLIGATORIO.
// Mientras esté bloqueada no se puede completar; al desbloquear vuelve a
// "Por planificar".
export function BlockSheet({
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [requirement, setRequirement] = useState(task.block_requirement ?? "");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const clean = requirement.trim();
    if (!clean) {
      setError("Escribe qué falta para poder hacerla.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await blockTask(task.id, clean);
      if (res.ok) onClose();
      else setError(res.message);
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Bloquear tarea"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="bg-ink/20 absolute inset-0"
      />

      <div className="bg-paper relative mx-auto w-full max-w-md rounded-t-[var(--radius-xl)] p-6 pb-8 shadow-[var(--shadow-lg)]">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-editorial text-moss-800 text-2xl">Bloquear</h2>
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

        <label className="flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">
            ¿Qué falta para poder hacerla?
          </span>
          <textarea
            autoFocus
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Ej.: falta la autorización, esperar el documento, que se libere el presupuesto…"
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 resize-none rounded-md border px-4 py-3 text-base outline-none"
          />
        </label>

        <p className="text-ink-mute mt-2 text-xs">
          Mientras esté bloqueada no podrás completarla. Al desbloquearla vuelve
          a Por planificar.
        </p>

        {error ? (
          <p className="bg-clay-50 text-ink-soft mt-3 rounded-md px-3 py-2 text-sm">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={pending || !requirement.trim()}
          onClick={submit}
          className="bg-moss-700 text-paper hover:bg-moss-800 mt-5 min-h-[48px] w-full rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Bloquear"}
        </button>
      </div>
    </div>
  );
}
