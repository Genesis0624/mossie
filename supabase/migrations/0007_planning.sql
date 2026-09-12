-- Mossie — Fase 1: planificación.
--  - execution_date: fecha en que la tarea se va a ejecutar. Una tarea de
--    "Por planificar" (to_plan) pasa a "planificada" (status='planned') SOLO
--    cuando se le fija esta fecha. El estado interno (en progreso / próxima
--    acción / vencida / planificada a futuro) NO se guarda: se deriva
--    comparando execution_date con el día actual en zona America/Santo_Domingo,
--    así el corte a medianoche ocurre solo, sin cron.
--
-- Nota: no se agregan valores de status; 'planned' ya existe en 0002.

alter table public.tasks
  add column if not exists execution_date date;

-- El Centro de Mando lee las planificadas por fecha (hoy / vencidas / mañana).
create index if not exists tasks_user_execution_idx
  on public.tasks (user_id, execution_date)
  where deleted_at is null and status = 'planned';
