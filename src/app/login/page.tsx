"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <p className="text-ink-mute text-xs tracking-[0.2em] uppercase">
          My Own Simple System
        </p>
        <h1 className="font-editorial text-moss-800 mt-2 text-4xl">Mossie</h1>
        <p className="font-editorial text-ink-soft mt-3 text-lg italic">
          El musgo no compite, cubre.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">Correo</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[44px] rounded-md border px-4 text-base outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-ink-soft text-sm">Contraseña</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="border-line-2 bg-paper-2 text-ink focus:border-moss-500 min-h-[44px] rounded-md border px-4 text-base outline-none"
          />
        </label>

        {state.error ? (
          <p className="bg-clay-50 text-ink-soft rounded-md px-3 py-2 text-sm">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="bg-moss-700 text-paper hover:bg-moss-800 mt-2 min-h-[44px] rounded-full px-6 text-base font-medium transition-colors disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
