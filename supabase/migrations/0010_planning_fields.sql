-- Mossie — Fase 1: campos de planificación (Flujo v2.0 §12).
--  Durante la planificación, además de la fecha de ejecución, se registran las
--  condiciones bajo las que se ejecutará la tarea. Todos opcionales salvo la
--  fecha (que ya existe en 0007):
--   · scheduled_time: hora opcional del día de ejecución.
--   · estimated_duration_minutes: duración estimada (3, 15, 30, 60 o libre).
--   · energy_required: energía que pide la tarea (baja/media/alta).
--   · energy_effect: efecto energético (da/neutral/quita) — distinto del anterior.
--   · priority: prioridad para ordenar tareas que compiten el mismo día.
--
-- El contexto (selección múltiple) se modela aparte, como relación m2m, en una
-- migración posterior.

alter table public.tasks
  add column if not exists scheduled_time time,
  add column if not exists estimated_duration_minutes int
    check (estimated_duration_minutes is null or estimated_duration_minutes between 1 and 1440),
  add column if not exists energy_required text
    check (energy_required is null or energy_required in ('baja', 'media', 'alta')),
  add column if not exists energy_effect text
    check (energy_effect is null or energy_effect in ('da', 'neutral', 'quita')),
  add column if not exists priority text
    check (priority is null or priority in ('alta', 'media', 'baja'));
