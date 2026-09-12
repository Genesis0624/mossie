"use client";

import { useActionState, useEffect, useState } from "react";
import { processTask, type ProcessState } from "./actions";
import {
  recommendRoute,
  ROUTE_LABEL,
  ROUTE_WHY,
  type ChecklistItem,
  type Route,
  type Task,
} from "./types";
import { PILLARS } from "@/features/pillars/pillars";

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
  const [taskType, setTaskType] = useState<"operativa" | "estrategica">(
    task.type ?? "operativa",
  );
  const [pillar, setPillar] = useState<string | null>(task.pillar ?? null);
  const [isRecurring, setIsRecurring] = useState(task.is_recurring ?? false);
  const [hasSteps, setHasSteps] = useState((task.checklist?.length ?? 0) > 0);
  const [steps, setSteps] = useState<ChecklistItem[]>(task.checklist ?? []);
  const [urgent, setUrgent] = useState(task.urgent ?? false);
  const [important, setImportant] = useState(task.important ?? false);

  const addStep = () => setSteps((s) => [...s, { text: "", done: false }]);
  const removeStep = (i: number) =>
    setSteps((s) => s.filter((_, idx) => idx !== i));
  const updateStep = (i: number, text: string) =>
    setSteps((s) => s.map((it, idx) => (idx === i ? { ...it, text } : it)));
  const toggleSteps = () => {
    const next = !hasSteps;
    setHasSteps(next);
    if (next && steps.length === 0) setSteps([{ text: "", done: false }]);
  };
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
          <input type="hidden" name="type" value={taskType} />
          <input type="hidden" name="pillar" value={pillar ?? ""} />
          <input type="hidden" name="urgent" value={urgent ? "on" : ""} />
          <input type="hidden" name="important" value={important ? "on" : ""} />
          <input type="hidden" name="route" value={effectiveRoute} />
          <input
            type="hidden"
            name="is_recurring"
            value={isRecurring ? "on" : ""}
          />
          <input
            type="hidden"
            name="checklist"
            value={JSON.stringify(
              hasSteps ? steps.filter((s) => s.text.trim() !== "") : [],
            )}
          />

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

          <div>
            <p className="text-ink-soft text-sm">Tipo de tarea</p>
            <div className="mt-2 flex gap-2">
              {(["operativa", "estrategica"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTaskType(t)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    taskType === t
                      ? "border-moss-500 bg-moss-50 text-moss-800"
                      : "border-line-2 bg-paper-2 text-ink-soft"
                  }`}
                >
                  {t === "operativa" ? "Operativa" : "Estratégica"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-ink-soft text-sm">Pilar</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPillar(null)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  pillar === null
                    ? "border-moss-500 bg-moss-50 text-moss-800"
                    : "border-line-2 text-ink-soft"
                }`}
              >
                Sin pilar
              </button>
              {PILLARS.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setPillar(p.slug)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    pillar === p.slug
                      ? "border-moss-500 bg-moss-50 text-moss-800"
                      : "border-line-2 text-ink-soft"
                  }`}
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: p.color }}
                  />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-ink-soft text-sm">
              Fecha límite (opcional)
            </span>
            <input
              type="date"
              name="deadline_at"
              defaultValue={task.deadline_at ?? ""}
              className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
            />
          </label>

          <div>
            <Toggle
              label="¿Tiene varios pasos?"
              on={hasSteps}
              onToggle={toggleSteps}
            />
            {hasSteps ? (
              <div className="mt-3 flex flex-col gap-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="border-line-2 size-5 shrink-0 rounded border" />
                    <input
                      type="text"
                      value={s.text}
                      onChange={(e) => updateStep(i, e.target.value)}
                      placeholder={`Paso ${i + 1}`}
                      maxLength={200}
                      className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[40px] flex-1 rounded-md border px-3 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      aria-label="Eliminar paso"
                      className="text-ink-mute hover:text-ink-soft flex size-8 shrink-0 items-center justify-center rounded-full"
                    >
                      <svg
                        width="16"
                        height="16"
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
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="text-moss-700 hover:text-moss-800 flex items-center gap-1.5 self-start rounded-full px-2 py-1 text-sm"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Añadir paso
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <Toggle
              label="¿Es recurrente?"
              on={isRecurring}
              onToggle={() => setIsRecurring((v) => !v)}
            />
            <p className="text-ink-mute mt-1 text-xs">
              {isRecurring
                ? "Se repetirá; la frecuencia se define al planificar."
                : "Tarea única."}
            </p>
          </div>

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
