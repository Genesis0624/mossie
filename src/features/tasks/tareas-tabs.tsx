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

export function TareasTabs({ tasks }: { tasks: Task[] }) {
  const [active, setActive] = useState("inbox");
  const tab = TABS.find((t) => t.key === active)!;

  let list = tasks.filter((t) => t.status === tab.status);
  if (tab.key === "completed") {
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

      {list.length === 0 ? (
        <p className="text-ink-mute mt-10 text-center text-sm">{tab.empty}</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {list.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              canProcess={tab.key === "inbox"}
            />
          ))}
        </ul>
      )}
    </>
  );
}
