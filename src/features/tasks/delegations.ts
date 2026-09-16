// Estados internos de una delegación (Flujo v2.0 §14.2). El responsable
// (assignee_name) es texto libre por ahora; el CRM llega después.

export type DelegationStatus =
  | "por_delegar"
  | "delegada"
  | "confirmada"
  | "en_seguimiento"
  | "completada"
  | "devuelta";

export const DELEGATION_STATUSES: DelegationStatus[] = [
  "por_delegar",
  "delegada",
  "confirmada",
  "en_seguimiento",
  "completada",
  "devuelta",
];

export const DELEGATION_STATUS_LABEL: Record<DelegationStatus, string> = {
  por_delegar: "Por delegar",
  delegada: "Delegada",
  confirmada: "Confirmada",
  en_seguimiento: "En seguimiento",
  completada: "Completada",
  devuelta: "Requiere intervención",
};

// Estados que exigen responsable (§14.3: para marcarla "Delegada" en adelante,
// el responsable es obligatorio). Solo "por_delegar" puede quedar sin uno.
export function requiresAssignee(status: DelegationStatus): boolean {
  return status !== "por_delegar";
}
