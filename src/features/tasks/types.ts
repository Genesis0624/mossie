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

export type Task = {
  id: string;
  title: string;
  type: "operativa" | "estrategica";
  is_express: boolean;
  status: TaskStatus;
  urgent: boolean | null;
  important: boolean | null;
  completed_at: string | null;
  created_at: string;
};

// Rutas de la matriz de Eisenhower (Doc GTD §11.4-11.5).
export type Route = "atender" | "planificar" | "delegar" | "algun_dia";

export const ROUTE_TO_STATUS: Record<Route, TaskStatus> = {
  atender: "planned",
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
    "Urgente e importante: pide una decisión de agenda para hoy o mañana.",
  planificar:
    "Importante pero no urgente: se hará, pero hay que colocarla conscientemente.",
  delegar:
    "Urgente pero no tan importante para ti: conviene ponerla en manos de alguien.",
  algun_dia:
    "Ni urgente ni importante ahora: guárdala sin presión para más adelante.",
};
