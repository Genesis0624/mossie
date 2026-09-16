import type { DelegationStatus } from "./delegations";

export type TaskStatus =
  | "inbox"
  | "express"
  | "to_plan"
  | "planned"
  | "in_progress"
  | "waiting"
  | "blocked"
  | "someday"
  | "delegated"
  | "completed"
  | "canceled";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  inbox: "Inbox",
  express: "Exprés",
  to_plan: "Por planificar",
  planned: "Planificada",
  in_progress: "En progreso",
  waiting: "En espera",
  blocked: "Bloqueada",
  someday: "Algún día",
  delegated: "Delegada",
  completed: "Completada",
  canceled: "Cancelada",
};

export type TaskType = "operativa" | "estrategica";

export type ChecklistItem = { text: string; done: boolean };

// Planificación (Flujo v2.0 §12). Todos opcionales.
export type EnergyRequired = "baja" | "media" | "alta";
export type EnergyEffect = "da" | "neutral" | "quita";
export type Priority = "alta" | "media" | "baja";

export const ENERGY_REQUIRED_LABEL: Record<EnergyRequired, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const ENERGY_EFFECT_LABEL: Record<EnergyEffect, string> = {
  da: "Me da energía",
  neutral: "Neutral",
  quita: "Me quita energía",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

// Botones rápidos de duración (§12.3). El valor es minutos; 3 activa la regla
// de tres minutos. `null` = "Personalizada".
export const DURATION_PRESETS: { minutes: number; label: string }[] = [
  { minutes: 3, label: "≤3 min" },
  { minutes: 15, label: "15 min" },
  { minutes: 30, label: "30 min" },
  { minutes: 60, label: "1 h" },
];

// Formatea una duración en minutos a un texto compacto ("30 min", "1 h 30 min").
export function formatDuration(minutes: number | null): string | null {
  if (!minutes || minutes < 1) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export type Task = {
  id: string;
  title: string;
  type: TaskType;
  is_express: boolean;
  status: TaskStatus;
  urgent: boolean | null;
  important: boolean | null;
  pillar: string | null;
  deadline_at: string | null;
  execution_date: string | null;
  attend_today: boolean;
  is_recurring: boolean;
  checklist: ChecklistItem[];
  waiting_reason: string | null;
  review_at: string | null;
  block_requirement: string | null;
  scheduled_time: string | null;
  estimated_duration_minutes: number | null;
  energy_required: EnergyRequired | null;
  energy_effect: EnergyEffect | null;
  priority: Priority | null;
  contexts: string[];
  recurrence_rule_id: string | null;
  recurrence: TaskRecurrence | null;
  delegation: TaskDelegation | null;
  reschedule_count: number;
  completed_at: string | null;
  created_at: string;
};

// Detalle de delegación enlazado (§14). Para mostrar y prellenar el panel.
export type TaskDelegation = {
  assignee_name: string | null;
  delegation_status: DelegationStatus;
  notify_at: string | null;
  instructions: string | null;
  delivery_deadline: string | null;
  follow_up_at: string | null;
  expected_evidence: string | null;
  notes: string | null;
};

// Resumen de la regla de recurrencia enlazada (para mostrarla; el cálculo vive
// en recurrence.ts).
export type TaskRecurrence = {
  frequency_type: "daily" | "weekly" | "monthly" | "yearly";
  interval_value: number;
  calculation_mode: "fixed_calendar" | "after_completion";
  ends_at: string | null;
  max_occurrences: number | null;
};

// Campos que se leen de tasks en las vistas (mantener en un solo lugar).
// task_contexts(context) trae los contextos como relación anidada; se aplana
// con rowToTask. recurrence:recurrence_rules(...) trae la regla enlazada.
export const TASK_SELECT =
  "id, title, type, is_express, status, urgent, important, pillar, deadline_at, execution_date, attend_today, is_recurring, checklist, waiting_reason, review_at, block_requirement, scheduled_time, estimated_duration_minutes, energy_required, energy_effect, priority, recurrence_rule_id, reschedule_count, completed_at, created_at, task_contexts(context), recurrence:recurrence_rules(frequency_type, interval_value, calculation_mode, ends_at, max_occurrences), delegation:task_delegations(assignee_name, delegation_status, notify_at, instructions, delivery_deadline, follow_up_at, expected_evidence, notes)";

// Fila cruda de Supabase (con relaciones anidadas) → Task aplanado.
type RawTaskRow = Omit<Task, "contexts" | "recurrence" | "delegation"> & {
  task_contexts?: { context: string }[] | null;
  recurrence?: TaskRecurrence | TaskRecurrence[] | null;
  delegation?: TaskDelegation | TaskDelegation[] | null;
};

export function rowToTask(row: RawTaskRow): Task {
  const { task_contexts, recurrence, delegation, ...rest } = row;
  const rec = Array.isArray(recurrence) ? (recurrence[0] ?? null) : recurrence;
  const del = Array.isArray(delegation) ? (delegation[0] ?? null) : delegation;
  return {
    ...rest,
    contexts: (task_contexts ?? []).map((c) => c.context),
    recurrence: rec ?? null,
    delegation: del ?? null,
  };
}

export function rowsToTasks(rows: RawTaskRow[] | null | undefined): Task[] {
  return (rows ?? []).map(rowToTask);
}

// Rutas de la matriz de Eisenhower (Doc GTD §11.4-11.5).
export type Route = "atender" | "planificar" | "delegar" | "algun_dia";

// "Atender ahora" también va a Por planificar (to_plan), pero marcada
// attend_today para planificarla hoy mismo.
export const ROUTE_TO_STATUS: Record<Route, TaskStatus> = {
  atender: "to_plan",
  planificar: "to_plan",
  delegar: "delegated",
  algun_dia: "someday",
};

export const ROUTE_LABEL: Record<Route, string> = {
  atender: "Atender ahora",
  planificar: "Planificar",
  delegar: "Delegar",
  algun_dia: "Algún día",
};

// Recomendación inicial según urgente/importante.
export function recommendRoute(urgent: boolean, important: boolean): Route {
  if (urgent && important) return "atender";
  if (!urgent && important) return "planificar";
  if (urgent && !important) return "delegar";
  return "algun_dia";
}

export const ROUTE_WHY: Record<Route, string> = {
  atender:
    "Urgente e importante: irá a Por planificar marcada para planificarla HOY, no la dejes para mañana.",
  planificar:
    "Importante pero no urgente: se hará, pero hay que colocarla conscientemente.",
  delegar:
    "Urgente pero no tan importante para ti: conviene ponerla en manos de alguien.",
  algun_dia:
    "Ni urgente ni importante ahora: guárdala sin presión para más adelante.",
};
