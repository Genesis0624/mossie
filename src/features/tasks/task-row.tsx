"use client";

import { useState, useTransition } from "react";
import { completeTask, deleteTask } from "./actions";
import type { Task } from "./types";

export function TaskRow({ task }: { task: Task }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const capturada = new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(task.created_at));

  function onComplete() {
    setDone(true); // feedback inmediato
    startTransition(() => completeTask(task.id));
  }

  function onDelete() {
    if (!confirm("¿Eliminar esta captura?")) return;
    startTransition(() => deleteTask(task.id));
  }

  return (
    <li
      className={`border-line bg-paper-2 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-[var(--shadow-sm)] transition-opacity ${
        pending || done ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        onClick={onComplete}
        disabled={pending}
        aria-label="Completar"
        className="border-line-2 hover:border-moss-500 hover:text-moss-600 flex size-6 shrink-0 items-center justify-center rounded-full border text-transparent transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-ink truncate text-base">{task.title}</p>
        <p suppressHydrationWarning className="text-ink-mute text-xs">
          {capturada}
        </p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        aria-label="Eliminar"
        className="text-ink-mute hover:bg-paper hover:text-ink-soft flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
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
          <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
        </svg>
      </button>
    </li>
  );
}
