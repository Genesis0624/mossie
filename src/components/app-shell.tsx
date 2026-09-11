"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <div className="flex-1 pb-24">{children}</div>

      <nav className="border-line bg-paper-2/95 fixed inset-x-0 bottom-0 z-10 border-t backdrop-blur">
        <div
          className="mx-auto flex w-full max-w-md items-center justify-around px-6"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {(() => {
            const [inicio, perfil] = items;
            const linkFor = (item: NavItem) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[44px] flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                    active
                      ? "text-moss-700"
                      : "text-ink-mute hover:text-ink-soft"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            };
            return (
              <>
                {linkFor(inicio)}

                {/* Captura central — llega en la Fase 1 (Vaciado Mental). */}
                <button
                  type="button"
                  aria-label="Captura rápida (próximamente)"
                  title="Captura rápida — próximamente"
                  className="bg-moss-700 text-paper -mt-6 flex size-14 items-center justify-center rounded-full shadow-[var(--shadow-lg)] transition-transform active:scale-95"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>

                {linkFor(perfil)}
              </>
            );
          })()}
        </div>
      </nav>
    </div>
  );
}
