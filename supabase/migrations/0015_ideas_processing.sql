-- Mossie — Fase 1: procesamiento de ideas (Flujo v2.0 §22).
--  La idea puede convertirse en otra entidad (para el MVP: Tarea) o archivarse.
--  Al convertirla se marca 'processed', se guarda el tipo y el id de destino, y
--  se conserva la relación con la idea de origen.

alter table public.ideas
  drop constraint if exists ideas_status_check;
alter table public.ideas
  add constraint ideas_status_check
  check (status in ('inbox', 'processed', 'archived'));

alter table public.ideas
  add column if not exists processed_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists converted_to_type text
    check (converted_to_type is null or converted_to_type in ('task', 'resource')),
  add column if not exists converted_to_task_id uuid;
