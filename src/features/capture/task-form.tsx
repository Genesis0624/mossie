"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTask, type CaptureState } from "@/features/tasks/actions";
import { fieldClass, Toast } from "./ui";

const initial: CaptureState = { ok: false, message: null, savedAt: null };

export function TaskForm({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(createTask, initial);
  const titleRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeAfter = useRef(false);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!state.savedAt) return;
    if (closeAfter.current) {
      onClose();
      return;
    }
    formRef.current?.reset();
    titleRef.current?.focus();
  }, [state.savedAt, onClose]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <input
        ref={titleRef}
        type="text"
        name="title"
        required
        maxLength={500}
        autoComplete="off"
        placeholder="¿Qué tienes en mente?"
        className={fieldClass}
      />

      <label className="text-ink-soft flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="is_express"
          className="accent-moss-700 size-5"
        />
        Es exprés (atender ahora, sin procesar)
      </label>

      <Toast state={state} />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          onClick={() => (closeAfter.current = false)}
          className="bg-moss-700 text-paper hover:bg-moss-800 min-h-[48px] flex-1 rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="submit"
          disabled={pending}
          onClick={() => (closeAfter.current = true)}
          className="border-line-2 text-ink-soft hover:bg-paper-2 min-h-[48px] rounded-full border px-5 text-base transition-colors disabled:opacity-60"
        >
          y cerrar
        </button>
      </div>
      <p className="text-ink-mute text-center text-xs">
        Guardar deja el modal abierto para seguir vaciando la mente.
      </p>
    </form>
  );
}
