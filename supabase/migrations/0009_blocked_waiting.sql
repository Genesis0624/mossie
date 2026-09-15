-- Mossie — Fase 1: separar "En espera" y "Bloqueadas" (Flujo v2.0 §17-§18).
--
-- El doc divide un mismo gesto ("pausar una tarea") en dos bandejas distintas:
--   · Bloqueadas (blocked): "no puedo hacerla". Requisito de desbloqueo
--     OBLIGATORIO (block_requirement). No se puede completar mientras siga
--     bloqueada; al desbloquear vuelve a "Por planificar".
--   · En espera (waiting): "podría, pero decidí pausarla". Motivo OPCIONAL
--     (waiting_reason, ya existe en 0008) y fecha de revisión (review_at) que
--     indica cuándo volver a decidir. No es una fecha de ejecución.
--
-- Ambas limpian execution_date para no aparecer como vencidas en "Hoy".

-- 1. Habilitar el estado 'blocked' (el CHECK en 0002 no lo contemplaba).
alter table public.tasks drop constraint if exists tasks_status_check;
alter table public.tasks add constraint tasks_status_check
  check (status in (
    'inbox', 'express', 'to_plan', 'planned', 'in_progress',
    'waiting', 'blocked', 'someday', 'delegated', 'completed', 'canceled'
  ));

-- 2. Campos nuevos.
alter table public.tasks
  add column if not exists review_at date,          -- En espera: cuándo revisar.
  add column if not exists block_requirement text;  -- Bloqueadas: qué falta.
