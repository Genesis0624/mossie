"use client";

import { useActionState, useEffect, useState } from "react";
import { processTask, type ProcessState } from "./actions";
import {
  recommendRoute,
  ROUTE_LABEL,
  ROUTE_WHY,
  type Route,
  type Task,
} from "./types";

const initialState: ProcessState = { ok: false, message: null };
const ROUTES: Route[] = ["atender", "planificar", "delegar", "algun_dia"];

export function ProcessSheet({
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    processTask,
    initialState,
  );
  const [title, setTitle] = useState(task.title);
  const [urgent, setUrgent] = useState(task.urgent ?? false);
  const [important, setImportant] = useState(task.important ?? false);
  const recommended = recommendRoute(urgent, important);
  const [route, setRoute] = useState<Route>(recommended);
  // Si la usuaria no ha tocado la ruta manualmente, seguir la recomendación.
  const [touched, setTouched] = useState(false);
  const effectiveRoute = touched ? route : recommended;

  useEffect(() => {
    if (state.ok) onClose();
  }, [state, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Procesar tarea"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="bg-ink/20 absolute inset-0"
      />

      <div className="bg-paper relative mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-xl)] p-6 pb-8 shadow-[var(--shadow-lg)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-editorial text-moss-800 text-2xl">Procesar</h2>
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

        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="urgent" value={urgent ? "on" : ""} />
          <input type="hidden" name="important" value={important ? "on" : ""} />
          <input type="hidden" name="route" value={effectiveRoute} />

          <label className="flex flex-col gap-1.5">
            <span className="text-ink-soft text-sm">Título</span>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={500}
              className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
            />
          </label>

          <div className="flex gap-3">
            <Toggle
              label="Urgente"
              on={urgent}
              onToggle={() => {
                setUrgent(!urgent);
                setTouched(false);
              }}
            />
            <Toggle
              label="Importante"
              on={important}
              onToggle={() => {
                setImportant(!important);
                setTouched(false);
              }}
            />
          </div>

          <div>
            <p className="text-ink-soft text-sm">Ruta sugerida</p>
            <p className="text-ink-mute mt-1 text-xs">
              {ROUTE_WHY[effectiveRoute]}
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {ROUTES.map((r) => {
                const active = r === effectiveRoute;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRoute(r);
                      setTouched(true);
                    }}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-base transition-colors ${
                      active
                        ? "border-moss-500 bg-moss-50 text-moss-800"
                        : "border-line-2 bg-paper-2 text-ink-soft hover:border-line"
                    }`}
                  >
                    <span>{ROUTE_LABEL[r]}</span>
                    {r === recommended ? (
                      <span className="text-moss-600 text-xs">Sugerida</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {state.message ? (
            <p className="bg-clay-50 text-ink-soft rounded-md px-3 py-2 text-sm">
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="bg-moss-700 text-paper hover:bg-moss-800 min-h-[48px] rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Confirmar decisión"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`flex flex-1 items-center justify-between rounded-lg border px-4 py-3 text-base transition-colors ${
        on
          ? "border-moss-500 bg-moss-50 text-moss-800"
          : "border-line-2 bg-paper-2 text-ink-soft"
      }`}
    >
      <span>{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          on ? "bg-moss-600" : "bg-line-2"
        }`}
      >
        <span
          className={`bg-paper absolute top-0.5 size-4 rounded-full transition-all ${
            on ? "left-4" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
