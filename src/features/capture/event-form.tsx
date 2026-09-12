"use client";

import { useActionState, useEffect, useRef } from "react";
import { createEvent, type EventState } from "@/features/events/actions";
import { fieldClass, labelClass, primaryBtn, Toast } from "./ui";

const initial: EventState = { ok: false, message: null, savedAt: null };

export function EventForm() {
  const [state, action, pending] = useActionState(createEvent, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state.savedAt) {
      formRef.current?.reset();
      nameRef.current?.focus();
    }
  }, [state.savedAt]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <label className={labelClass}>
        Nombre del evento
        <input
          ref={nameRef}
          type="text"
          name="name"
          required
          maxLength={300}
          className={fieldClass}
        />
      </label>

      <div className="flex gap-3">
        <label className={`${labelClass} flex-1`}>
          Fecha
          <input type="date" name="date" className={fieldClass} />
        </label>
        <label className={`${labelClass} flex-1`}>
          Hora (opcional)
          <input type="time" name="time" className={fieldClass} />
        </label>
      </div>
      <p className="text-ink-mute -mt-2 text-xs">
        Sin fecha, lo guardo en tu Inbox para definirla luego.
      </p>

      <label className={labelClass}>
        Lugar o enlace (opcional)
        <input
          type="text"
          name="location"
          maxLength={500}
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Modalidad
        <select
          name="modality"
          defaultValue="por_confirmar"
          className={fieldClass}
        >
          <option value="presencial">Presencial</option>
          <option value="virtual">Virtual</option>
          <option value="por_confirmar">Por confirmar</option>
        </select>
      </label>

      <label className={labelClass}>
        Preparación (opcional, una por línea)
        <textarea
          name="checklist"
          rows={2}
          className={`${fieldClass} min-h-[64px] py-2`}
          placeholder={"Confirmar asistencia\nLlevar documentos"}
        />
      </label>

      <Toast state={state} />

      <button type="submit" disabled={pending} className={primaryBtn}>
        {pending ? "Guardando…" : "Guardar evento"}
      </button>
    </form>
  );
}
