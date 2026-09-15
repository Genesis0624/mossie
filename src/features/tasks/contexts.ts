// Contextos de ejecución (Flujo v2.0 §12.5). Selección múltiple: dónde/con qué
// se puede hacer una tarea. Lista fija en código, como los pilares; se guardan
// como relación m2m en task_contexts (slug por fila).

export type TaskContext = { slug: string; name: string };

export const CONTEXTS: TaskContext[] = [
  { slug: "casa", name: "Casa" },
  { slug: "trabajo", name: "Trabajo" },
  { slug: "iglesia", name: "Iglesia" },
  { slug: "fuera", name: "Fuera de casa" },
  { slug: "computadora", name: "Computadora" },
  { slug: "telefono", name: "Teléfono" },
  { slug: "tablet", name: "Tablet" },
  { slug: "con_persona", name: "Con otra persona" },
  { slug: "cualquiera", name: "Cualquier lugar" },
];

export const CONTEXT_SLUGS = CONTEXTS.map((c) => c.slug);

const bySlug = new Map(CONTEXTS.map((c) => [c.slug, c]));

export function contextName(slug: string): string {
  return bySlug.get(slug)?.name ?? slug;
}
