"use client";

import { useState, useTransition } from "react";
import { delegateTask } from "./actions";
import {
  DELEGATION_STATUSES,
  DELEGATION_STATUS_LABEL,
  requiresAssignee,
  type DelegationStatus,
} from "./delegations";
import type { Task } from "./types";

// Panel de delegación (Flujo v2.0 §14). Responsable de texto libre (CRM
// futuro). "Delegada" en adelante exige responsable. Al fijar fecha de
// seguimiento se crea/actualiza una tarea vinculada "Dar seguimiento a: …".
export function DelegateSheet({
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const del = task.delegation;
  const [assignee, setAssignee] = useState(del?.assignee_name ?? "");
  const [status, setStatus] = useState<DelegationStatus>(
    del?.delegation_status ?? "por_delegar",
  );
  const [instructions, setInstructions] = useState(del?.instructions ?? "");
  const [notifyAt, setNotifyAt] = useState(del?.notify_at ?? "");
  const [deliveryDeadline, setDeliveryDeadline] = useState(
    del?.delivery_deadline ?? "",
  );
  const [followUpAt, setFollowUpAt] = useState(del?.follow_up_at ?? "");
  const [evidence, setEvidence] = useState(del?.expected_evidence ?? "");
  const [notes, setNotes] = useState(del?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const needsAssignee = requiresAssignee(status) && !assignee.trim();

  const submit = () => {
    if (needsAssignee) {
      setError("Para marcarla como delegada necesitas un responsable.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await delegateTask(task.id, {
        assignee_name: assignee.trim() || null,
        delegation_status: status,
        notify_at: notifyAt || null,
        instructions: instructions.trim() || null,
        delivery_deadline: deliveryDeadline || null,
        follow_up_at: followUpAt || null,
        expected_evidence: evidence.trim() || null,
        notes: notes.trim() || null,
      });
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
      aria-label="Delegar tarea"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="bg-ink/20 absolute inset-0"
      />

      <div className="bg-paper relative mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-xl)] p-6 pb-8 shadow-[var(--shadow-lg)]">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-editorial text-moss-800 text-2xl">Delegar</h2>
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
          <span className="text-ink-soft text-sm">Responsable</span>
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            maxLength={200}
            placeholder="¿Quién se encarga?"
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
          />
        </label>

        <p className="text-ink-soft mt-4 text-sm">Estado</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DELEGATION_STATUSES.map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
              {DELEGATION_STATUS_LABEL[s]}
            </Chip>
          ))}
        </div>
        {needsAssignee ? (
          <p className="text-ink-mute mt-1 text-xs">
            Este estado necesita un responsable.
          </p>
        ) : null}

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">
            Instrucciones <span className="text-ink-mute">(opcional)</span>
          </span>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            maxLength={2000}
            rows={2}
            placeholder="Qué esperas que haga…"
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 resize-none rounded-md border px-4 py-3 text-base outline-none"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-ink-soft text-sm">Notificar el</span>
            <input
              type="date"
              value={notifyAt}
              onChange={(e) => setNotifyAt(e.target.value)}
              className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-3 text-base outline-none"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-ink-soft text-sm">Entrega límite</span>
            <input
              type="date"
              value={deliveryDeadline}
              onChange={(e) => setDeliveryDeadline(e.target.value)}
              className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-3 text-base outline-none"
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">Fecha de seguimiento</span>
          <input
            type="date"
            value={followUpAt}
            onChange={(e) => setFollowUpAt(e.target.value)}
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-3 text-base outline-none"
          />
          <span className="text-ink-mute text-xs">
            Crea una tarea “Dar seguimiento a: …” planificada para ese día.
          </span>
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">
            Evidencia esperada <span className="text-ink-mute">(opcional)</span>
          </span>
          <input
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            maxLength={500}
            placeholder="Foto, documento, confirmación…"
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
          />
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">
            Notas <span className="text-ink-mute">(opcional)</span>
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
            rows={2}
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 resize-none rounded-md border px-4 py-3 text-base outline-none"
          />
        </label>

        {error ? (
          <p className="bg-clay-50 text-ink-soft mt-4 rounded-md px-3 py-2 text-sm">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="bg-moss-700 text-paper hover:bg-moss-800 mt-5 min-h-[48px] w-full rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar delegación"}
        </button>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[40px] rounded-full border px-4 text-sm transition-colors ${
        active
          ? "border-moss-500 bg-moss-100 text-moss-800"
          : "border-line-2 bg-paper-2 text-ink-soft hover:border-line"
      }`}
    >
      {children}
    </button>
  );
}
