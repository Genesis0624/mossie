"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaptureSheet } from "./capture-sheet";

type NavItem = { href: string; label: string; icon: React.ReactNode };

// Iconos lineales, trazo 1.6, sin relleno (Documento 24, §5).
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const items: NavItem[] = [
  {
    href: "/",
    label: "Inicio",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6 9.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />
      </svg>
    ),
  },
  {
    href: "/tareas",
    label: "Tareas",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
        <path d="M4 13h4l1.5 3h5L16 13h4" />
        <path d="M4 13 6.5 5h11L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    href: "/ideas",
    label: "Ideas",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8.9.9 1.6l.1.5h5l.1-.5c.1-.7.4-1.2.9-1.6A6 6 0 0 0 12 3z" />
      </svg>
    ),
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      </svg>
    ),
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [captureOpen, setCaptureOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  // Barra inferior (móvil): acceso vertical compacto.
  const tabFor = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={isActive(item) ? "page" : undefined}
      className={`flex min-h-[44px] flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
        isActive(item) ? "text-moss-700" : "text-ink-mute hover:text-ink-soft"
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );

  // Barra lateral (escritorio): fila con icono + etiqueta, activo moss-50 (Doc 24).
  const sideLinkFor = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={isActive(item) ? "page" : undefined}
      className={`flex min-h-[44px] items-center gap-3 rounded-md px-3 text-sm transition-colors ${
        isActive(item)
          ? "bg-moss-50 text-moss-700 font-medium"
          : "text-ink-soft hover:bg-paper hover:text-ink"
      }`}
    >
      <span aria-hidden="true">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );

  const [inicio, inbox, ideas, perfil] = items;

  return (
    <div className="flex min-h-full w-full flex-col lg:flex-row">
      {/* Barra lateral — solo escritorio (Doc 24 §8: sidebar + FAB) */}
      <aside className="border-line bg-paper-2 sticky top-0 z-20 hidden h-screen w-60 shrink-0 flex-col border-r px-4 py-6 lg:flex">
        <Link href="/" className="px-3">
          <span className="font-editorial text-moss-800 block text-xl">
            Mossie
          </span>
          <span className="font-editorial text-ink-mute mt-0.5 block text-xs italic">
            El musgo no compite, cubre.
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setCaptureOpen(true)}
          className="bg-moss-700 text-paper mt-6 flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 text-sm font-medium shadow-[var(--shadow-sm)] transition-transform active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Capturar
        </button>

        <nav className="mt-6 flex flex-col gap-1">{items.map(sideLinkFor)}</nav>
      </aside>

      {/* Contenido — columna centrada en móvil, centro dominante en escritorio */}
      <div className="flex w-full flex-1 flex-col">
        <div className="mx-auto w-full max-w-md flex-1 pb-24 lg:max-w-5xl lg:pb-12">
          {children}
        </div>
      </div>

      {/* Barra inferior — solo móvil */}
      <nav className="border-line bg-paper-2/95 fixed inset-x-0 bottom-0 z-10 border-t backdrop-blur lg:hidden">
        <div
          className="mx-auto flex w-full max-w-md items-center justify-around px-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {tabFor(inicio)}
          {tabFor(inbox)}

          <button
            type="button"
            onClick={() => setCaptureOpen(true)}
            aria-label="Captura rápida"
            className="bg-moss-700 text-paper -mt-6 flex size-14 items-center justify-center rounded-full shadow-[var(--shadow-lg)] transition-transform active:scale-95"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>

          {tabFor(ideas)}
          {tabFor(perfil)}
        </div>
      </nav>

      <CaptureSheet open={captureOpen} onClose={() => setCaptureOpen(false)} />
    </div>
  );
}
