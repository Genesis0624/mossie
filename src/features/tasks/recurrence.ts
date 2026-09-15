// Motor de recurrencia (Flujo v2.0 §13). Puro, sin UI ni acceso a datos.
// Primer alcance: frecuencias Diaria/Semanal/Mensual/Anual con intervalo
// ("cada N"). Días específicos, ordinal del mes y personalizada quedan para un
// corte posterior.

import { addDays, addMonths } from "./dates";

export type FrequencyType = "daily" | "weekly" | "monthly" | "yearly";
export type CalculationMode = "fixed_calendar" | "after_completion";

export const FREQUENCY_TYPES: FrequencyType[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

// [singular, plural] de la unidad para armar "Cada 2 semanas", etc.
const UNIT: Record<FrequencyType, [string, string]> = {
  daily: ["día", "días"],
  weekly: ["semana", "semanas"],
  monthly: ["mes", "meses"],
  yearly: ["año", "años"],
};

export const FREQUENCY_LABEL: Record<FrequencyType, string> = {
  daily: "Diaria",
  weekly: "Semanal",
  monthly: "Mensual",
  yearly: "Anual",
};

export const CALCULATION_MODE_LABEL: Record<CalculationMode, string> = {
  fixed_calendar: "Calendario fijo",
  after_completion: "Desde que la completo",
};

export type RecurrenceConfig = {
  frequency_type: FrequencyType;
  interval_value: number;
  calculation_mode: CalculationMode;
  ends_at: string | null;
  max_occurrences: number | null;
};

// Próxima ocurrencia estricta después de `from` (yyyy-mm-dd) según la regla.
export function nextOccurrence(
  freq: FrequencyType,
  interval: number,
  from: string,
): string {
  const n = Math.max(1, Math.floor(interval));
  switch (freq) {
    case "daily":
      return addDays(from, n);
    case "weekly":
      return addDays(from, n * 7);
    case "monthly":
      return addMonths(from, n);
    case "yearly":
      return addMonths(from, n * 12);
  }
}

// Texto legible: "Cada semana", "Cada 2 meses".
export function recurrenceSummary(
  freq: FrequencyType,
  interval: number,
): string {
  const [sing, plur] = UNIT[freq];
  return interval <= 1 ? `Cada ${sing}` : `Cada ${interval} ${plur}`;
}
