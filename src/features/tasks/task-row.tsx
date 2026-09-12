"use client";

import { useState, useTransition } from "react";
import { completeTask, deleteTask, updateTaskTitle } from "./actions";
import { ProcessSheet } from "./process-sheet";
import { pillarBySlug } from "@/features/pillars/pillars";
import type { Task } from "./types";

export function TaskRow({
  task,
  canProcess = false,
}: {
  task: Task;
  canProcess?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const capturada = new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(task.created_at));

  const pillar = pillarBySlug(task.pillar);
  const deadline = task.deadline_at
    ? new Intl.DateTimeFormat("es-DO", {
        day: "numeric",
        month: "short",
      }).format(new Date(task.deadline_at + "T12:00:00"))
    : null;

  function onComplete() {
    setDone(true);
    startTransition(() => completeTask(task.id));
  }

  function onDelete() {
    setMenuOpen(false);
    if (!confirm("¿Eliminar esta tarea?")) return;
    startTransition(() => deleteTask(task.id));
  }

  function startEdit() {
    setMenuOpen(false);
    setDraft(task.title);
    setEditing(true);
  }

  function saveEdit() {
    const t = draft.trim();
    setEditing(false);
    if (t && t !== task.title) {
      startTransition(() => updateTaskTitle(task.id, t));
    }
  }

  if (editing) {
    return (
      <li className="border-moss-200 bg-paper-2 flex flex-col gap-3 rounded-lg border px-4 py-3 shadow-[var(--shadow-sm)]">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="border-line-2 bg-paper text-ink focus:border-moss-500 min-h-[44px] rounded-md border px-3 text-base outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-ink-mute hover:bg-paper rounded-full px-4 py-2 text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveEdit}
            className="bg-moss-700 text-paper hover:bg-moss-800 rounded-full px-4 py-2 text-sm font-medium"
          >
            Guardar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`border-line bg-paper-2 relative flex items-center gap-3 rounded-lg border px-4 py-3 shadow-[var(--shadow-sm)] transition-opacity ${
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
        <div className="flex items-center gap-2">
          {pillar ? (
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: pillar.color }}
              title={pillar.name}
            />
          ) : null}
          <p className="text-ink truncate text-base">{task.title}</p>
        </div>
        <p suppressHydrationWarning className="text-ink-mute text-xs">
          {capturada}
          {deadline ? ` · vence ${deadline}` : ""}
        </p>
      </div>

      {canProcess ? (
        <button
          type="button"
          onClick={() => setProcessOpen(true)}
          disabled={pending}
          className="bg-moss-700 text-paper hover:bg-moss-800 shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
        >
          Procesar
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Más opciones"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="text-ink-mute hover:bg-paper hover:text-ink-soft flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            className="border-line bg-paper absolute top-12 right-3 z-20 w-36 overflow-hidden rounded-lg border shadow-[var(--shadow-md)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={startEdit}
              className="text-ink hover:bg-paper-2 block w-full px-4 py-2.5 text-left text-sm"
            >
              Editar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={onDelete}
              className="text-ink-soft hover:bg-clay-50 block w-full px-4 py-2.5 text-left text-sm"
            >
              Eliminar
            </button>
          </div>
        </>
      ) : null}

      {canProcess ? (
        <ProcessSheet
          task={task}
          open={processOpen}
          onClose={() => setProcessOpen(false)}
        />
      ) : null}
    </li>
  );
}
