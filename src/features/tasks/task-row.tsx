"use client";

import { useState, useTransition } from "react";
import {
  completeTask,
  deleteTask,
  resumeTask,
  updateTaskChecklist,
  updateTaskTitle,
} from "./actions";
import { ProcessSheet } from "./process-sheet";
import { PlanSheet } from "./plan-sheet";
import { WaitSheet } from "./wait-sheet";
import { BlockSheet } from "./block-sheet";
import { pillarBySlug } from "@/features/pillars/pillars";
import { contextName } from "./contexts";
import { sdDateString, addDays, planBucket, BUCKET_LABEL } from "./dates";
import {
  TASK_STATUS_LABEL,
  PRIORITY_LABEL,
  ENERGY_REQUIRED_LABEL,
  ENERGY_EFFECT_LABEL,
  formatDuration,
  type ChecklistItem,
  type Task,
} from "./types";

export function TaskRow({
  task,
  canProcess = false,
  canPlan = false,
  showStatus = false,
}: {
  task: Task;
  canProcess?: boolean;
  canPlan?: boolean;
  showStatus?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [waitOpen, setWaitOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [steps, setSteps] = useState<ChecklistItem[]>(task.checklist ?? []);
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

  // Fecha de ejecución y su estado derivado (En progreso / Próxima acción / …).
  const execDate = task.execution_date
    ? new Intl.DateTimeFormat("es-DO", {
        day: "numeric",
        month: "short",
      }).format(new Date(task.execution_date + "T12:00:00"))
    : null;
  const hora = task.scheduled_time?.slice(0, 5) ?? null;
  const today = sdDateString();
  const bucket = planBucket(task.execution_date, today, addDays(today, 1));
  const isOverdue = task.status === "planned" && bucket === "vencida";
  const isClosed = task.status === "completed" || task.status === "canceled";
  const isWaiting = task.status === "waiting";
  const isBlocked = task.status === "blocked";
  // "Poner en espera" y "Bloquear" están disponibles en cualquier tarea activa
  // ya procesada (no en Inbox, que aún no se decide, ni en cerradas, en espera
  // o ya bloqueada).
  const canPause =
    !isClosed && !isWaiting && !isBlocked && task.status !== "inbox";
  const statusLabel =
    task.status === "planned"
      ? BUCKET_LABEL[bucket]
      : TASK_STATUS_LABEL[task.status];

  const effectLabel = task.energy_effect
    ? ENERGY_EFFECT_LABEL[task.energy_effect]
    : null;
  const reviewFmt = task.review_at
    ? new Intl.DateTimeFormat("es-DO", {
        day: "numeric",
        month: "short",
      }).format(new Date(task.review_at + "T12:00:00"))
    : null;

  // Portada mínima: se muestra un solo dato relevante (estado con fecha, o la
  // fecha de captura). Todo lo demás va al detalle plegable. primaryIsCapture
  // evita repetir la fecha de captura dentro cuando ya es la línea principal.
  const showsStatusChip =
    isWaiting ||
    isBlocked ||
    task.status === "planned" ||
    !!execDate ||
    task.attend_today;
  const primaryIsCapture = !showsStatusChip && !showStatus;

  const detailRows: { label: string; value: string }[] = [];
  if (!primaryIsCapture)
    detailRows.push({ label: "Capturada", value: capturada });
  if (deadline) detailRows.push({ label: "Vence", value: deadline });
  if (isWaiting && task.waiting_reason)
    detailRows.push({ label: "Motivo", value: task.waiting_reason });
  if (isWaiting && reviewFmt)
    detailRows.push({ label: "Revisar", value: reviewFmt });
  if (isBlocked && task.block_requirement)
    detailRows.push({ label: "Falta", value: task.block_requirement });
  const durLabel = formatDuration(task.estimated_duration_minutes);
  if (durLabel) detailRows.push({ label: "Duración", value: durLabel });
  if (task.priority)
    detailRows.push({
      label: "Prioridad",
      value: PRIORITY_LABEL[task.priority],
    });
  if (task.energy_required)
    detailRows.push({
      label: "Energía",
      value: ENERGY_REQUIRED_LABEL[task.energy_required],
    });
  if (effectLabel) detailRows.push({ label: "Efecto", value: effectLabel });
  if (task.contexts.length > 0)
    detailRows.push({
      label: "Contexto",
      value: task.contexts.map(contextName).join(", "),
    });
  const hasDetail = detailRows.length > 0 || steps.length > 0;

  // Reanudar (En espera) o Desbloquear (Bloqueadas): ambas vuelven a Por
  // planificar (misma acción de servidor).
  function onResume() {
    setMenuOpen(false);
    startTransition(() => resumeTask(task.id));
  }

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

  // Fila del título (con chevron si hay detalle plegable).
  const titleRow = (
    <div className="flex items-center gap-2">
      {pillar ? (
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ background: pillar.color }}
          title={pillar.name}
        />
      ) : null}
      <span className="text-ink truncate text-base">{task.title}</span>
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
      {hasDetail ? (
        <svg
          className={`text-ink-mute shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      ) : null}
    </div>
  );

  // Única línea relevante de la portada: estado con fecha, atender hoy, o la
  // fecha de captura. El resto vive en el detalle.
  const primaryLine = isWaiting ? (
    <span className="bg-clay-50 text-ink-soft inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
      <span
        className="size-1.5 rounded-full"
        style={{ background: "var(--color-clay)" }}
      />
      En espera
    </span>
  ) : isBlocked ? (
    <span className="bg-clay-50 text-ink-soft inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
      <span
        className="size-1.5 rounded-full"
        style={{ background: "var(--color-clay)" }}
      />
      Bloqueada
    </span>
  ) : task.status === "planned" || execDate ? (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
        isOverdue ? "bg-clay-50 text-ink-soft" : "bg-moss-50 text-moss-800"
      }`}
    >
      <span
        className="size-1.5 rounded-full"
        style={{
          background: isOverdue ? "var(--color-clay)" : "var(--color-moss-600)",
        }}
      />
      {statusLabel}
      {execDate ? ` · ${execDate}${hora ? `, ${hora}` : ""}` : ""}
    </span>
  ) : task.attend_today ? (
    <span className="bg-clay-50 text-ink-soft inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
      <span
        className="size-1.5 rounded-full"
        style={{ background: "var(--color-clay)" }}
      />
      Atender hoy
    </span>
  ) : showStatus ? (
    <span className="border-line-2 text-ink-mute inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
      {TASK_STATUS_LABEL[task.status]}
    </span>
  ) : (
    <span suppressHydrationWarning className="text-ink-mute text-xs">
      {capturada}
    </span>
  );

  return (
    <li
      className={`border-line bg-paper-2 relative flex flex-col gap-2 rounded-lg border px-4 py-3 shadow-[var(--shadow-sm)] transition-opacity ${
        pending || done ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {isClosed ? (
          <span
            aria-hidden="true"
            className="border-moss-300 bg-moss-50 text-moss-700 flex size-6 shrink-0 items-center justify-center rounded-full border"
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
          </span>
        ) : isBlocked ? (
          <span
            aria-hidden="true"
            title="Bloqueada: no se puede completar hasta desbloquear"
            className="border-line-2 text-ink-mute flex size-6 shrink-0 items-center justify-center rounded-full border"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
        ) : (
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
        )}

        <div className="min-w-0 flex-1">
          {hasDetail ? (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Ocultar detalle" : "Ver detalle"}
              className="block w-full text-left"
            >
              {titleRow}
              <div className="mt-1">{primaryLine}</div>
            </button>
          ) : (
            <>
              {titleRow}
              <div className="mt-1">{primaryLine}</div>
            </>
          )}
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

        {isWaiting ? (
          <button
            type="button"
            onClick={onResume}
            disabled={pending}
            className="bg-moss-700 text-paper hover:bg-moss-800 shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
          >
            Reanudar
          </button>
        ) : null}

        {isBlocked ? (
          <button
            type="button"
            onClick={onResume}
            disabled={pending}
            className="bg-moss-700 text-paper hover:bg-moss-800 shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
          >
            Desbloquear
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

      {open && hasDetail ? (
        <div className="border-line-2 mt-1 flex flex-col gap-2 border-t pt-2 pl-9">
          {detailRows.length > 0 ? (
            <dl className="flex flex-col gap-1">
              {detailRows.map((r) => (
                <div key={r.label} className="flex gap-2 text-xs">
                  <dt className="text-ink-mute w-20 shrink-0">{r.label}</dt>
                  <dd className="text-ink-soft min-w-0 flex-1 break-words">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {steps.length > 0 ? (
            <div>
              <p className="text-ink-mute text-xs">
                {doneCount}/{steps.length} pasos
              </p>
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
            </div>
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
            {canPause ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setWaitOpen(true);
                }}
                className="text-ink hover:bg-paper-2 block w-full px-4 py-2.5 text-left text-sm"
              >
                Poner en espera
              </button>
            ) : null}
            {canPause ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setBlockOpen(true);
                }}
                className="text-ink hover:bg-paper-2 block w-full px-4 py-2.5 text-left text-sm"
              >
                Bloquear
              </button>
            ) : null}
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

      {canPause ? (
        <WaitSheet
          task={task}
          open={waitOpen}
          onClose={() => setWaitOpen(false)}
        />
      ) : null}

      {canPause ? (
        <BlockSheet
          task={task}
          open={blockOpen}
          onClose={() => setBlockOpen(false)}
        />
      ) : null}
    </li>
  );
}
