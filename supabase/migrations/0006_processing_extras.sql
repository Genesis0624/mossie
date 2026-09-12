-- Mossie — extras de procesamiento:
--  - attend_today: la ruta "Atender ahora" manda la tarea a Por planificar
--    pero marcada para planificarla HOY (indicador, sin rojos de ansiedad).
--  - is_recurring: en el procesamiento solo se marca única/recurrente; el
--    detalle de la frecuencia se define en la planificación.
--  - checklist: subtareas (varios pasos) como jsonb [{text, done}].

alter table public.tasks
  add column if not exists attend_today boolean not null default false,
  add column if not exists is_recurring boolean not null default false,
  add column if not exists checklist jsonb not null default '[]'::jsonb;
