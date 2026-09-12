export const fieldClass =
  "min-h-[48px] rounded-md border border-line-2 bg-paper-2 px-4 text-base text-ink outline-none focus:border-moss-500";

export const labelClass = "flex flex-col gap-1.5 text-sm text-ink-soft";

export function Toast({
  state,
}: {
  state: { ok: boolean; message: string | null };
}) {
  if (!state.message) return null;
  return (
    <p
      aria-live="polite"
      className={`rounded-md px-3 py-2 text-sm ${
        state.ok ? "bg-moss-50 text-moss-800" : "bg-clay-50 text-ink-soft"
      }`}
    >
      {state.message}
    </p>
  );
}

export const primaryBtn =
  "min-h-[48px] rounded-full bg-moss-700 px-6 text-base font-medium text-paper transition-colors hover:bg-moss-800 disabled:opacity-60";
