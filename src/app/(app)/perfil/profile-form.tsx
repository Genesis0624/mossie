"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";

const initialState: ProfileState = { ok: false, message: null };

export function ProfileForm({ initialName }: { initialName: string }) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-ink-soft text-sm">Tu nombre</span>
        <input
          type="text"
          name="full_name"
          defaultValue={initialName}
          maxLength={80}
          placeholder="¿Cómo quieres que te llame?"
          className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[44px] rounded-md border px-4 text-base outline-none"
        />
      </label>

      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            state.ok ? "bg-moss-50 text-moss-800" : "bg-clay-50 text-ink-soft"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-moss-700 text-paper hover:bg-moss-800 min-h-[44px] rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
