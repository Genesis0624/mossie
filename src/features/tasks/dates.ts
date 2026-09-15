// Lógica de fechas de planificación (pura, sin UI ni acceso a datos).
// Regla de la usuaria: el día corta a MEDIANOCHE en zona America/Santo_Domingo.
// "hoy" = día actual allí; tras las 00:00, lo de "mañana" pasa a ser "hoy".

const SD_TZ = "America/Santo_Domingo";

// Fecha yyyy-mm-dd en zona Santo Domingo para un instante dado (por defecto ahora).
export function sdDateString(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SD_TZ }).format(d);
}

// Suma n días a un yyyy-mm-dd y devuelve otro yyyy-mm-dd.
// Se usa mediodía UTC para evitar desfases al cruzar husos; solo comparamos días.
export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Suma n meses a un yyyy-mm-dd, recortando el día al último del mes destino
// (p. ej. 31 ene + 1 mes → 28/29 feb). Mismo criterio UTC-mediodía.
export function addMonths(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d.toISOString().slice(0, 10);
}

// Estado derivado de una tarea según su execution_date. No se persiste.
export type PlanBucket = "vencida" | "hoy" | "proxima" | "futura" | "sin_fecha";

export function planBucket(
  executionDate: string | null,
  today: string,
  tomorrow: string,
): PlanBucket {
  if (!executionDate) return "sin_fecha";
  if (executionDate < today) return "vencida";
  if (executionDate === today) return "hoy";
  if (executionDate === tomorrow) return "proxima";
  return "futura";
}

// Etiqueta legible para cada estado derivado (el "identificador" de la tarea).
export const BUCKET_LABEL: Record<PlanBucket, string> = {
  vencida: "Vencida",
  hoy: "En progreso",
  proxima: "Próxima acción",
  futura: "Planificada",
  sin_fecha: "Por planificar",
};
