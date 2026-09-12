"use client";

import { useState } from "react";
import { TaskRow } from "./task-row";
import { ProcessSheet } from "./process-sheet";
import type { Task, TaskStatus } from "./types";
import { PILLARS } from "@/features/pillars/pillars";

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
  const [withDeadline, setWithDeadline] = useState(false);
  const [pillarFilter, setPillarFilter] = useState("");
  // Procesamiento en orden: cola de ids capturada al iniciar.
  const [queue, setQueue] = useState<string[] | null>(null);
  const [qIndex, setQIndex] = useState(0);

  const tab = TABS.find((t) => t.key === active)!;
  const isInbox = tab.key === "inbox";

  let list = tasks.filter((t) => t.status === tab.status);

  if (isInbox) {
    if (hoyOnly) {
      const today = sdDate(new Date().toISOString());
      list = list.filter((t) => sdDate(t.created_at) === today);
    }
    if (withDeadline) list = list.filter((t) => t.deadline_at);
    if (pillarFilter) list = list.filter((t) => t.pillar === pillarFilter);
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

  const tasksById = new Map(tasks.map((t) => [t.id, t]));
  const seqTask =
    queue && qIndex < queue.length ? tasksById.get(queue[qIndex]) : undefined;

  const startSequential = () => {
    setQueue(list.map((t) => t.id));
    setQIndex(0);
  };
  const stopSequential = () => {
    setQueue(null);
    setQIndex(0);
  };
  const advance = () => {
    if (!queue || qIndex + 1 >= queue.length) stopSequential();
    else setQIndex(qIndex + 1);
  };

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
          <FilterChip
            active={withDeadline}
            onClick={() => setWithDeadline((v) => !v)}
          >
            Con fecha límite
          </FilterChip>
          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            aria-label="Filtrar por pilar"
            className="border-line-2 bg-paper-2 text-ink-soft rounded-full border px-3 py-1.5 text-xs"
          >
            <option value="">Todos los pilares</option>
            {PILLARS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {isInbox && list.length > 0 ? (
        <button
          type="button"
          onClick={startSequential}
          className="bg-moss-700 text-paper hover:bg-moss-800 mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          Procesar en orden ({list.length})
        </button>
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

      {seqTask ? (
        <ProcessSheet
          key={seqTask.id}
          task={seqTask}
          open
          onClose={stopSequential}
          onProcessed={advance}
          progress={queue ? `${qIndex + 1} de ${queue.length}` : undefined}
        />
      ) : null}
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
