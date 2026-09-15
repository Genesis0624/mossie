"use client";

import { useState, useTransition } from "react";
import { planTask, completeTask } from "./actions";
import { sdDateString, addDays } from "./dates";
import { CONTEXTS } from "./contexts";
import {
  DURATION_PRESETS,
  ENERGY_REQUIRED_LABEL,
  ENERGY_EFFECT_LABEL,
  PRIORITY_LABEL,
  type EnergyRequired,
  type EnergyEffect,
  type Priority,
  type Task,
} from "./types";

// Drawer de planificación (Flujo v2.0 §12). La fecha de ejecución es
// obligatoria; hora, duración, energía, efecto y prioridad son opcionales. Al
// elegir "≤3 min" aparece la regla de tres minutos (hacerla ya o planificarla).
export function PlanSheet({
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const today = sdDateString();
  const tomorrow = addDays(today, 1);

  const presetMinutes = DURATION_PRESETS.map((p) => p.minutes);
  const [date, setDate] = useState(task.execution_date ?? "");
  const [time, setTime] = useState(task.scheduled_time?.slice(0, 5) ?? "");
  const [duration, setDuration] = useState<number | null>(
    task.estimated_duration_minutes,
  );
  // Si la duración guardada no coincide con un preset, se edita como libre.
  const [customMode, setCustomMode] = useState(
    task.estimated_duration_minutes != null &&
      !presetMinutes.includes(task.estimated_duration_minutes),
  );
  const [energyReq, setEnergyReq] = useState<EnergyRequired | null>(
    task.energy_required,
  );
  const [energyEff, setEnergyEff] = useState<EnergyEffect | null>(
    task.energy_effect,
  );
  const [priority, setPriority] = useState<Priority | null>(task.priority);
  const [contexts, setContexts] = useState<string[]>(task.contexts ?? []);

  const toggleContext = (slug: string) =>
    setContexts((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );

  if (!open) return null;

  const fmt = (d: string) =>
    new Intl.DateTimeFormat("es-DO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(d + "T12:00:00"));

  const isThreeMin = !customMode && duration === 3;

  const submit = () => {
    if (!date) {
      setError("Elige el día en que la ejecutas.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await planTask(task.id, date, {
        scheduled_time: time || null,
        estimated_duration_minutes: duration,
        energy_required: energyReq,
        energy_effect: energyEff,
        priority,
        contexts,
      });
      if (res.ok) onClose();
      else setError(res.message);
    });
  };

  const doNow = () => {
    setError(null);
    startTransition(async () => {
      await completeTask(task.id);
      onClose();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Planificar tarea"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="bg-ink/20 absolute inset-0"
      />

      <div className="bg-paper relative mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-xl)] p-6 pb-8 shadow-[var(--shadow-lg)]">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-editorial text-moss-800 text-2xl">
            {task.status === "planned" ? "Reprogramar" : "Planificar"}
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

        {/* Fecha (obligatoria) */}
        <p className="text-ink-soft text-sm font-medium">
          ¿Cuándo la ejecutas?
        </p>
        <div className="mt-2 flex gap-2">
          <DateChip
            label="Hoy"
            hint={fmt(today)}
            active={date === today}
            onClick={() => setDate(today)}
          />
          <DateChip
            label="Mañana"
            hint={fmt(tomorrow)}
            active={date === tomorrow}
            onClick={() => setDate(tomorrow)}
          />
        </div>
        <label className="mt-2 flex flex-col gap-1.5">
          <span className="text-ink-mute text-xs">Otra fecha</span>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
          />
        </label>

        {/* Hora (opcional) */}
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">
            Hora <span className="text-ink-mute">(opcional)</span>
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] w-40 rounded-md border px-4 text-base outline-none"
          />
        </label>

        {/* Duración + regla de 3 minutos */}
        <p className="text-ink-soft mt-4 text-sm">
          Duración <span className="text-ink-mute">(opcional)</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DURATION_PRESETS.map((p) => (
            <Chip
              key={p.minutes}
              active={!customMode && duration === p.minutes}
              onClick={() => {
                setCustomMode(false);
                setDuration(duration === p.minutes ? null : p.minutes);
              }}
            >
              {p.label}
            </Chip>
          ))}
          <Chip
            active={customMode}
            onClick={() => {
              setCustomMode(true);
              setDuration(null);
            }}
          >
            Personalizada
          </Chip>
        </div>
        {customMode ? (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={1440}
              value={duration ?? ""}
              onChange={(e) =>
                setDuration(e.target.value ? Number(e.target.value) : null)
              }
              placeholder="Minutos"
              className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[44px] w-32 rounded-md border px-3 text-base outline-none"
            />
            <span className="text-ink-mute text-sm">minutos</span>
          </div>
        ) : null}
        {isThreeMin ? (
          <div className="border-moss-200 bg-moss-50 mt-3 rounded-lg border p-3">
            <p className="text-ink-soft text-sm">
              Regla de 3 minutos: si toma tan poco, quizá conviene hacerla ya.
            </p>
            <button
              type="button"
              disabled={pending}
              onClick={doNow}
              className="border-moss-600 text-moss-800 hover:bg-moss-100 mt-2 min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-60"
            >
              Hacer ahora y completar
            </button>
            <p className="text-ink-mute mt-1.5 text-xs">
              O planifícala de todas formas con el botón de abajo.
            </p>
          </div>
        ) : null}

        {/* Energía requerida */}
        <p className="text-ink-soft mt-4 text-sm">
          Energía necesaria <span className="text-ink-mute">(opcional)</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(ENERGY_REQUIRED_LABEL) as EnergyRequired[]).map((k) => (
            <Chip
              key={k}
              active={energyReq === k}
              onClick={() => setEnergyReq(energyReq === k ? null : k)}
            >
              {ENERGY_REQUIRED_LABEL[k]}
            </Chip>
          ))}
        </div>

        {/* Efecto energético */}
        <p className="text-ink-soft mt-4 text-sm">
          Efecto energético <span className="text-ink-mute">(opcional)</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(ENERGY_EFFECT_LABEL) as EnergyEffect[]).map((k) => (
            <Chip
              key={k}
              active={energyEff === k}
              onClick={() => setEnergyEff(energyEff === k ? null : k)}
            >
              {ENERGY_EFFECT_LABEL[k]}
            </Chip>
          ))}
        </div>

        {/* Prioridad */}
        <p className="text-ink-soft mt-4 text-sm">
          Prioridad <span className="text-ink-mute">(opcional)</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(PRIORITY_LABEL) as Priority[]).map((k) => (
            <Chip
              key={k}
              active={priority === k}
              onClick={() => setPriority(priority === k ? null : k)}
            >
              {PRIORITY_LABEL[k]}
            </Chip>
          ))}
        </div>

        {/* Contexto (selección múltiple) */}
        <p className="text-ink-soft mt-4 text-sm">
          Contexto <span className="text-ink-mute">(opcional, varios)</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONTEXTS.map((c) => (
            <Chip
              key={c.slug}
              active={contexts.includes(c.slug)}
              onClick={() => toggleContext(c.slug)}
            >
              {c.name}
            </Chip>
          ))}
        </div>

        {error ? (
          <p className="bg-clay-50 text-ink-soft mt-4 rounded-md px-3 py-2 text-sm">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={pending || !date}
          onClick={submit}
          className="bg-moss-700 text-paper hover:bg-moss-800 mt-5 min-h-[48px] w-full rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
        >
          {pending
            ? "Guardando…"
            : task.status === "planned"
              ? "Guardar cambios"
              : "Planificar"}
        </button>
      </div>
    </div>
  );
}

function DateChip({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg border px-3 py-3 text-sm transition-colors ${
        active
          ? "border-moss-500 bg-moss-50 text-moss-800"
          : "border-line-2 bg-paper-2 text-ink-soft hover:border-line"
      }`}
    >
      {label}
      <span className="text-ink-mute mt-0.5 block text-xs">{hint}</span>
    </button>
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
