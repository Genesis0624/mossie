-- Mossie — Fase 1: bandeja "En espera".
--  - waiting_reason: motivo OBLIGATORIO del bloqueo. Una tarea activa se pone
--    en espera (status='waiting') indicando por qué está bloqueada. No viene del
--    procesamiento: se marca desde el menú de cualquier tarea activa. Al
--    reanudar vuelve a "Por planificar" (to_plan) y se limpia el motivo.
--
-- Nota: 'waiting' ya existe como status en 0002; solo se agrega el motivo.

alter table public.tasks
  add column if not exists waiting_reason text;
