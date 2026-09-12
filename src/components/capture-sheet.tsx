"use client";

import { useState } from "react";
import { TaskForm } from "@/features/capture/task-form";
import { EventForm } from "@/features/capture/event-form";
import { ExpenseForm } from "@/features/capture/expense-form";
import { IdeaForm } from "@/features/capture/idea-form";

type Kind = "tarea" | "evento" | "gasto" | "idea";

const KINDS: { key: Kind; label: string }[] = [
  { key: "tarea", label: "Tarea" },
  { key: "evento", label: "Evento" },
  { key: "gasto", label: "Gasto" },
  { key: "idea", label: "Idea" },
];

export function CaptureSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<Kind>("tarea");

  if (!open) return null;

  // Al cerrar, volver a Tarea (opción predeterminada) para la próxima apertura.
  const close = () => {
    setKind("tarea");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Captura rápida"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={close}
        className="bg-ink/20 absolute inset-0"
      />

      <div className="bg-paper relative mx-auto max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-xl)] p-6 pb-8 shadow-[var(--shadow-lg)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-editorial text-moss-800 text-2xl">Capturar</h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={close}
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

        {/* Selector de tipo */}
        <div className="mb-5 flex gap-2">
          {KINDS.map((k) => (
            <button
              key={k.key}
              type="button"
              onClick={() => setKind(k.key)}
              aria-pressed={kind === k.key}
              className={`flex-1 rounded-full px-2 py-2 text-sm transition-colors ${
                kind === k.key
                  ? "bg-moss-700 text-paper"
                  : "bg-paper-2 text-ink-soft hover:bg-moss-50"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {kind === "tarea" ? <TaskForm onClose={close} /> : null}
        {kind === "evento" ? <EventForm /> : null}
        {kind === "gasto" ? <ExpenseForm /> : null}
        {kind === "idea" ? <IdeaForm /> : null}
      </div>
    </div>
  );
}
