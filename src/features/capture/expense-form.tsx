"use client";

import { useActionState, useEffect, useRef } from "react";
import { createExpense, type ExpenseState } from "@/features/expenses/actions";
import { fieldClass, labelClass, primaryBtn, Toast } from "./ui";

const initial: ExpenseState = { ok: false, message: null, savedAt: null };

// Fecha de hoy en formato yyyy-mm-dd (zona local del navegador).
function today() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function ExpenseForm() {
  const [state, action, pending] = useActionState(createExpense, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const conceptRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    conceptRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state.savedAt) {
      formRef.current?.reset();
      conceptRef.current?.focus();
    }
  }, [state.savedAt]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <label className={labelClass}>
        Concepto
        <input
          ref={conceptRef}
          type="text"
          name="concept"
          required
          maxLength={300}
          className={fieldClass}
        />
      </label>

      <div className="flex gap-3">
        <label className={`${labelClass} flex-1`}>
          Monto (DOP)
          <input
            type="number"
            name="amount"
            required
            min="0"
            step="0.01"
            inputMode="decimal"
            className={fieldClass}
          />
        </label>
        <label className={`${labelClass} flex-1`}>
          Cuenta
          <select name="account" defaultValue="efectivo" className={fieldClass}>
            <option value="efectivo">Efectivo</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
            <option value="otra">Otra</option>
          </select>
        </label>
      </div>

      <label className={labelClass}>
        Fecha
        <input
          type="date"
          name="date"
          defaultValue={today()}
          className={fieldClass}
        />
      </label>

      <Toast state={state} />

      <button type="submit" disabled={pending} className={primaryBtn}>
        {pending ? "Guardando…" : "Registrar gasto"}
      </button>
    </form>
  );
}
