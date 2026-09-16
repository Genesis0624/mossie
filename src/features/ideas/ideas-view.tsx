"use client";

import { useState } from "react";
import { IdeaRow } from "./idea-row";
import type { Idea } from "./types";

// Bandeja de ideas (Flujo v2.0 §22): Inbox (sin procesar) y Archivadas (ya
// convertidas o guardadas). El flujo de ideas es separado del de tareas.
export function IdeasView({ ideas }: { ideas: Idea[] }) {
  const [tab, setTab] = useState<"inbox" | "archived">("inbox");

  const inbox = ideas.filter((i) => i.status === "inbox");
  const rest = ideas.filter((i) => i.status !== "inbox");
  const list = tab === "inbox" ? inbox : rest;

  return (
    <>
      <div className="mt-5 flex gap-2">
        <TabButton active={tab === "inbox"} onClick={() => setTab("inbox")}>
          Inbox{inbox.length > 0 ? ` ${inbox.length}` : ""}
        </TabButton>
        <TabButton
          active={tab === "archived"}
          onClick={() => setTab("archived")}
        >
          Archivadas{rest.length > 0 ? ` ${rest.length}` : ""}
        </TabButton>
      </div>

      {list.length === 0 ? (
        <p className="text-ink-mute mt-10 text-center text-sm">
          {tab === "inbox"
            ? "Sin ideas por procesar. Captura una con el botón +."
            : "Nada archivado todavía."}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {list.map((idea) => (
            <IdeaRow key={idea.id} idea={idea} />
          ))}
        </ul>
      )}
    </>
  );
}

function TabButton({
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
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
        active
          ? "bg-moss-700 text-paper"
          : "bg-paper-2 text-ink-soft hover:bg-moss-50"
      }`}
    >
      {children}
    </button>
  );
}
