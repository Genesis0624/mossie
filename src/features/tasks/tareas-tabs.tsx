"use client";

import { useState } from "react";
import { TaskRow } from "./task-row";
import type { Task, TaskStatus } from "./types";

type Tab = {
  key: string;
  label: string;
  status: TaskStatus;
  empty: string;
};

const TABS: Tab[] = [
  {
    key: "inbox",
    label: "Inbox",
    status: "inbox",
    empty: "Tu Inbox está vacío. Captura con el botón +.",
  },
  {
    key: "to_plan",
    label: "Por planificar",
    status: "to_plan",
    empty: "Nada por planificar todavía.",
  },
  {
    key: "delegated",
    label: "Delegadas",
    status: "delegated",
    empty: "No has delegado nada aún.",
  },
  {
    key: "someday",
    label: "Algún día",
    status: "someday",
    empty: "Sin ideas guardadas para algún día.",
  },
  {
    key: "completed",
    label: "Completadas",
    status: "completed",
    empty: "Aún no completas ninguna.",
  },
];

// Fecha yyyy-mm-dd en zona Santo Domingo, para el filtro "Hoy".
const sdDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
  }).format(new Date(iso));

export function TareasTabs({ tasks }: { tasks: Task[] }) {
  const [active, setActive] = useState("inbox");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [hoyOnly, setHoyOnly] = useState(false);

  const tab = TABS.find((t) => t.key === active)!;
  const isInbox = tab.key === "inbox";

  let list = tasks.filter((t) => t.status === tab.status);

  if (isInbox) {
    if (hoyOnly) {
      const today = sdDate(new Date().toISOString());
      list = list.filter((t) => sdDate(t.created_at) === today);
    }
    list = [...list].sort((a, b) =>
      order === "asc"
        ? a.created_at.localeCompare(b.created_at)
        : b.created_at.localeCompare(a.created_at),
    );
  } else if (tab.key === "completed") {
    list = [...list].sort((a, b) =>
      (b.completed_at ?? "").localeCompare(a.completed_at ?? ""),
    );
  }

  const countFor = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status).length;

  return (
    <>
      <div className="-mx-6 mt-4 overflow-x-auto px-6">
        <div className="flex gap-2">
          {TABS.map((t) => {
            const activeTab = t.key === active;
            const count = countFor(t.status);
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  activeTab
                    ? "bg-moss-700 text-paper"
                    : "bg-paper-2 text-ink-soft hover:bg-moss-50"
                }`}
              >
                {t.label}
                {count > 0 ? (
                  <span
                    className={`text-xs ${activeTab ? "text-paper/80" : "text-ink-mute"}`}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {isInbox ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterChip active={order === "asc"} onClick={() => setOrder("asc")}>
            Más antiguas
          </FilterChip>
          <FilterChip
            active={order === "desc"}
            onClick={() => setOrder("desc")}
          >
            Más recientes
          </FilterChip>
          <span className="bg-line-2 mx-1 h-4 w-px" />
          <FilterChip active={hoyOnly} onClick={() => setHoyOnly((v) => !v)}>
            Capturadas hoy
          </FilterChip>
        </div>
      ) : null}

      {list.length === 0 ? (
        <p className="text-ink-mute mt-10 text-center text-sm">
          {isInbox && hoyOnly ? "Nada capturado hoy." : tab.empty}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {list.map((task) => (
            <TaskRow key={task.id} task={task} canProcess={isInbox} />
          ))}
        </ul>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
        active ? "bg-moss-100 text-moss-800" : "text-ink-mute hover:bg-paper-2"
      }`}
    >
      {children}
    </button>
  );
}
