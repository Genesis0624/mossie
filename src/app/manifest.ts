import type { MetadataRoute } from "next";

// PWA mínima instalable (Fase 0). Iconos SVG por ahora; PNG 192/512 cuando se
// pula la instalación.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mossie",
    short_name: "Mossie",
    description:
      "Tu sistema personal, sereno y sin prisa. El musgo no compite, cubre.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbfbf7",
    theme_color: "#3f5e3a",
    lang: "es",
    dir: "ltr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
