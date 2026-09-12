export type TaskStatus =
  | "inbox"
  | "express"
  | "to_plan"
  | "planned"
  | "in_progress"
  | "waiting"
  | "someday"
  | "delegated"
  | "completed"
  | "canceled";

export type TaskType = "operativa" | "estrategica";

export type ChecklistItem = { text: string; done: boolean };

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
  attend_today: boolean;
  is_recurring: boolean;
  checklist: ChecklistItem[];
  completed_at: string | null;
  created_at: string;
};

// Campos que se leen de tasks en las vistas (mantener en un solo lugar).
export const TASK_SELECT =
  "id, title, type, is_express, status, urgent, important, pillar, deadline_at, attend_today, is_recurring, checklist, completed_at, created_at";

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
