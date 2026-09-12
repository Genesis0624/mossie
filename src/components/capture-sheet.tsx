"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTask, type CaptureState } from "@/features/tasks/actions";

const initialState: CaptureState = { ok: false, message: null, savedAt: null };

export function CaptureSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(createTask, initialState);
  const titleRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Al abrir, enfocar el título.
  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);

  // Tras guardar con éxito: limpiar y reenfocar (captura consecutiva sin cerrar).
  useEffect(() => {
    if (state.savedAt) {
      formRef.current?.reset();
      titleRef.current?.focus();
    }
  }, [state.savedAt]);

  if (!open) return null;

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
        onClick={onClose}
        className="bg-ink/20 absolute inset-0"
      />

      <div className="bg-paper relative mx-auto w-full max-w-md rounded-t-[var(--radius-xl)] p-6 pb-8 shadow-[var(--shadow-lg)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-editorial text-moss-800 text-2xl">Capturar</h2>
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

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <input
            ref={titleRef}
            type="text"
            name="title"
            required
            maxLength={500}
            autoComplete="off"
            placeholder="¿Qué tienes en mente?"
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[48px] rounded-md border px-4 text-base outline-none"
          />

          <label className="text-ink-soft flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="is_express"
              className="accent-moss-700 size-5"
            />
            Tarea exprés (atender ahora, sin procesar)
          </label>

          {state.message ? (
            <p
              aria-live="polite"
              className={`rounded-md px-3 py-2 text-sm ${
                state.ok
                  ? "bg-moss-50 text-moss-800"
                  : "bg-clay-50 text-ink-soft"
              }`}
            >
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="bg-moss-700 text-paper hover:bg-moss-800 min-h-[48px] rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
          <p className="text-ink-mute text-center text-xs">
            Se queda abierto para que sigas vaciando la mente. Cierra con la X
            cuando termines.
          </p>
        </form>
      </div>
    </div>
  );
}
