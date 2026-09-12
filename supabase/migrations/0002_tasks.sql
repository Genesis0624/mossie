-- Mossie — Fase 1: base maestra de tareas (captura → Inbox / exprés)
-- Una sola tabla; las bandejas (Inbox, exprés, Hoy, …) son vistas filtradas.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  type text not null default 'operativa'
    check (type in ('operativa', 'estrategica')),
  is_express boolean not null default false,
  status text not null default 'inbox'
    check (status in (
      'inbox', 'express', 'to_plan', 'planned', 'in_progress',
      'waiting', 'someday', 'delegated', 'completed', 'canceled'
    )),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint tasks_title_not_blank check (char_length(btrim(title)) between 1 and 500)
);

-- Consultas frecuentes: por usuario + estado, excluyendo borradas, orden por captura.
create index if not exists tasks_user_status_idx
  on public.tasks (user_id, status, created_at)
  where deleted_at is null;

alter table public.tasks enable row level security;

drop policy if exists tasks_select_own on public.tasks;
create policy tasks_select_own on public.tasks for select
  using ((select auth.uid()) = user_id);

drop policy if exists tasks_insert_own on public.tasks;
create policy tasks_insert_own on public.tasks for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists tasks_update_own on public.tasks;
create policy tasks_update_own on public.tasks for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- (sin política de DELETE: se usa borrado lógico vía update de deleted_at)

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();
