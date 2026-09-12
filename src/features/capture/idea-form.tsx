"use client";

import { useActionState, useEffect, useRef } from "react";
import { createIdea, type IdeaState } from "@/features/ideas/actions";
import { fieldClass, labelClass, primaryBtn, Toast } from "./ui";

const initial: IdeaState = { ok: false, message: null, savedAt: null };

export function IdeaForm() {
  const [state, action, pending] = useActionState(createIdea, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state.savedAt) {
      formRef.current?.reset();
      titleRef.current?.focus();
    }
  }, [state.savedAt]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <label className={labelClass}>
        Idea o asunto
        <textarea
          ref={titleRef}
          name="title"
          required
          maxLength={1000}
          rows={3}
          placeholder="Algo que investigar, decidir, desear, un recurso…"
          className={`${fieldClass} min-h-[88px] py-2`}
        />
      </label>

      <label className={labelClass}>
        Enlace o recurso (opcional)
        <input
          type="text"
          name="link"
          maxLength={1000}
          placeholder="https://…"
          className={fieldClass}
        />
      </label>

      <Toast state={state} />

      <button type="submit" disabled={pending} className={primaryBtn}>
        {pending ? "Guardando…" : "Guardar idea"}
      </button>
      <p className="text-ink-mute text-center text-xs">
        No decides qué es todavía; solo la sacas de tu cabeza.
      </p>
    </form>
  );
}
