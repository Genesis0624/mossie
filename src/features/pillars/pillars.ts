// Pilares de MOSS (Doc 24 §3). Por ahora una lista fija en código; más
// adelante podrán promoverse a una tabla si se necesita editarlos.

export type Pillar = { slug: string; name: string; color: string };

export const PILLARS: Pillar[] = [
  { slug: "fe", name: "Fe", color: "#cf9a7d" },
  { slug: "familia_nuclear", name: "Familia nuclear", color: "#e3a7b1" },
  { slug: "familia_amigos", name: "Familia y amigos", color: "#e4cd86" },
  { slug: "salud", name: "Salud", color: "#a3c8a0" },
  { slug: "finanzas", name: "Finanzas", color: "#b3a4d6" },
  { slug: "hogar", name: "Hogar", color: "#9fb9d6" },
  { slug: "estudios", name: "Estudios", color: "#c2a58a" },
  { slug: "negocio", name: "Negocio", color: "#b9bdc2" },
  { slug: "trabajo", name: "Trabajo", color: "#e5a08d" },
  { slug: "imagen", name: "Imagen", color: "#92ccc6" },
];

export const PILLAR_SLUGS = PILLARS.map((p) => p.slug);

const bySlug = new Map(PILLARS.map((p) => [p.slug, p]));

export function pillarBySlug(slug: string | null | undefined): Pillar | null {
  if (!slug) return null;
  return bySlug.get(slug) ?? null;
}
