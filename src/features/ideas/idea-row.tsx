"use client";

import { useState, useTransition } from "react";
import {
  archiveIdea,
  convertIdeaToTask,
  deleteIdea,
  updateIdea,
} from "./actions";
import type { Idea } from "./types";

export function IdeaRow({ idea }: { idea: Idea }) {
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(idea.title);
  const [draftLink, setDraftLink] = useState(idea.link ?? "");

  const capturada = new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(idea.created_at));

  const isInbox = idea.status === "inbox";

  function onConvert() {
    startTransition(() => convertIdeaToTask(idea.id));
  }
  function onArchive() {
    setMenuOpen(false);
    startTransition(() => archiveIdea(idea.id));
  }
  function onDelete() {
    setMenuOpen(false);
    if (!confirm("¿Eliminar esta idea?")) return;
    startTransition(() => deleteIdea(idea.id));
  }
  function saveEdit() {
    const t = draftTitle.trim();
    setEditing(false);
    if (t && (t !== idea.title || draftLink.trim() !== (idea.link ?? ""))) {
      startTransition(() => updateIdea(idea.id, t, draftLink));
    }
  }

  if (editing) {
    return (
      <li className="border-moss-200 bg-paper-2 flex flex-col gap-3 rounded-lg border px-4 py-3 shadow-[var(--shadow-sm)]">
        <textarea
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          maxLength={1000}
          rows={2}
          className="border-line-2 bg-paper text-ink focus:border-moss-500 resize-none rounded-md border px-3 py-2 text-base outline-none"
        />
        <input
          value={draftLink}
          onChange={(e) => setDraftLink(e.target.value)}
          maxLength={1000}
          placeholder="Enlace (opcional)"
          className="border-line-2 bg-paper text-ink focus:border-moss-500 min-h-[44px] rounded-md border px-3 text-sm outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-ink-mute hover:bg-paper rounded-full px-4 py-2 text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveEdit}
            className="bg-moss-700 text-paper hover:bg-moss-800 rounded-full px-4 py-2 text-sm font-medium"
          >
            Guardar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`border-line bg-paper-2 relative flex items-start gap-3 rounded-lg border px-4 py-3 shadow-[var(--shadow-sm)] transition-opacity ${
        pending ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-ink text-base break-words">{idea.title}</p>
        {idea.link ? (
          <a
            href={idea.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-moss-700 mt-0.5 block truncate text-sm underline"
          >
            {idea.link}
          </a>
        ) : null}
        <p suppressHydrationWarning className="text-ink-mute mt-1 text-xs">
          {capturada}
        </p>
        {idea.status === "processed" ? (
          <span className="bg-moss-50 text-moss-800 mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
            Convertida en tarea
          </span>
        ) : null}
        {idea.status === "archived" ? (
          <span className="bg-paper text-ink-mute border-line-2 mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
            Archivada
          </span>
        ) : null}
      </div>

      {isInbox ? (
        <button
          type="button"
          onClick={onConvert}
          disabled={pending}
          className="bg-moss-700 text-paper hover:bg-moss-800 shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
        >
          Convertir en tarea
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Más opciones"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="text-ink-mute hover:bg-paper hover:text-ink-soft flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            className="border-line bg-paper absolute top-12 right-3 z-20 w-36 overflow-hidden rounded-lg border shadow-[var(--shadow-md)]"
          >
            {isInbox ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
                className="text-ink hover:bg-paper-2 block w-full px-4 py-2.5 text-left text-sm"
              >
                Editar
              </button>
            ) : null}
            {isInbox ? (
              <button
                type="button"
                role="menuitem"
                onClick={onArchive}
                className="text-ink hover:bg-paper-2 block w-full px-4 py-2.5 text-left text-sm"
              >
                Archivar
              </button>
            ) : null}
            <button
              type="button"
              role="menuitem"
              onClick={onDelete}
              className="text-ink-soft hover:bg-clay-50 block w-full px-4 py-2.5 text-left text-sm"
            >
              Eliminar
            </button>
          </div>
        </>
      ) : null}
    </li>
  );
}
