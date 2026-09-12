-- Mossie — Fase 1: procesamiento GTD
-- Guarda la decisión de la matriz (urgente / importante) al procesar una tarea.

alter table public.tasks
  add column if not exists urgent boolean,
  add column if not exists important boolean;
