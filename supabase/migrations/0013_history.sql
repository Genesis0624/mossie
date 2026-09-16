-- Mossie — Fase 1: historial y contador de reprogramaciones (Flujo v2.0 §16.3,
-- §18.3, §23.4). Toda transición importante se registra en task_history; al
-- reprogramar se guarda la fecha anterior y se incrementa reschedule_count.

alter table public.tasks
  add column if not exists reschedule_count int not null default 0;

create table if not exists public.task_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  event_type text not null check (event_type in (
    'created', 'edited', 'processed', 'planned', 'rescheduled',
    'delegated', 'blocked', 'unblocked', 'paused', 'resumed',
    'completed', 'reopened', 'canceled'
  )),
  previous_value text,
  new_value text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists task_history_task_idx
  on public.task_history (task_id, created_at);

alter table public.task_history enable row level security;

drop policy if exists task_history_select_own on public.task_history;
create policy task_history_select_own on public.task_history for select
  using ((select auth.uid()) = user_id);

drop policy if exists task_history_insert_own on public.task_history;
create policy task_history_insert_own on public.task_history for insert
  with check ((select auth.uid()) = user_id);
