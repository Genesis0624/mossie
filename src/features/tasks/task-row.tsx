"use client";

import { useState, useTransition } from "react";
import {
  completeTask,
  deleteTask,
  updateTaskChecklist,
  updateTaskTitle,
} from "./actions";
import { ProcessSheet } from "./process-sheet";
import { PlanSheet } from "./plan-sheet";
import { pillarBySlug } from "@/features/pillars/pillars";
import { sdDateString, addDays, planBucket, BUCKET_LABEL } from "./dates";
import type { ChecklistItem, Task } from "./types";

export function TaskRow({
  task,
  canProcess = false,
  canPlan = false,
}: {
  task: Task;
  canProcess?: boolean;
  canPlan?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [steps, setSteps] = useState<ChecklistItem[]>(task.checklist ?? []);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

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
  const doneCount = steps.filter((s) => s.done).length;
  const showSteps = hovered || open;

  // Fecha de ejecución y su estado derivado (En progreso / Próxima acción / …).
  const execDate = task.execution_date
    ? new Intl.DateTimeFormat("es-DO", {
        day: "numeric",
        month: "short",
      }).format(new Date(task.execution_date + "T12:00:00"))
    : null;
  const today = sdDateString();
  const bucket = planBucket(task.execution_date, today, addDays(today, 1));
  const isOverdue = bucket === "vencida";

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

  function toggleStep(i: number) {
    const next = steps.map((s, idx) =>
      idx === i ? { ...s, done: !s.done } : s,
    );
    setSteps(next);
    startTransition(() => updateTaskChecklist(task.id, next));
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
      className={`border-line bg-paper-2 relative flex flex-col gap-2 rounded-lg border px-4 py-3 shadow-[var(--shadow-sm)] transition-opacity ${
        pending || done ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
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
            {task.is_recurring ? (
              <span title="Recurrente" className="text-ink-mute shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5v5h5M20 19v-5h-5" />
                  <path d="M5.5 9A7 7 0 0 1 17 6.5L20 10M18.5 15A7 7 0 0 1 7 17.5L4 14" />
                </svg>
              </span>
            ) : null}
          </div>
          <p suppressHydrationWarning className="text-ink-mute text-xs">
            {capturada}
            {deadline ? ` · vence ${deadline}` : ""}
          </p>
          {task.attend_today ? (
            <span className="bg-clay-50 text-ink-soft mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
              <span
                className="size-1.5 rounded-full"
                style={{ background: "var(--color-clay)" }}
              />
              Atender hoy
            </span>
          ) : null}
          {execDate ? (
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                isOverdue
                  ? "bg-clay-50 text-ink-soft"
                  : "bg-moss-50 text-moss-800"
              }`}
            >
              <span
                className="size-1.5 rounded-full"
                style={{
                  background: isOverdue
                    ? "var(--color-clay)"
                    : "var(--color-moss-600)",
                }}
              />
              {BUCKET_LABEL[bucket]} · {execDate}
            </span>
          ) : null}
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

        {canPlan ? (
          <button
            type="button"
            onClick={() => setPlanOpen(true)}
            disabled={pending}
            className="bg-moss-700 text-paper hover:bg-moss-800 shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
          >
            {task.status === "planned" ? "Reprogramar" : "Planificar"}
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
      </div>

      {steps.length > 0 ? (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="pl-9"
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-ink-mute text-xs"
          >
            {doneCount}/{steps.length} pasos {showSteps ? "▾" : "▸"}
          </button>
          {showSteps ? (
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => toggleStep(i)}
                    aria-label={s.done ? "Desmarcar paso" : "Completar paso"}
                    className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      s.done
                        ? "border-moss-600 bg-moss-600 text-paper"
                        : "border-line-2 text-transparent"
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </button>
                  <span
                    className={
                      s.done ? "text-ink-mute line-through" : "text-ink-soft"
                    }
                  >
                    {s.text}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

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

      {canPlan ? (
        <PlanSheet
          task={task}
          open={planOpen}
          onClose={() => setPlanOpen(false)}
        />
      ) : null}
    </li>
  );
}
