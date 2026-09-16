-- Mossie — Fase 1: Delegadas (Flujo v2.0 §14, §23.4).
--  Detalle de delegación 1:1 con la tarea. El responsable es texto libre por
--  ahora (assignee_name); la integración con el CRM queda para más adelante.
--  follow_up_task_id es un uuid simple (sin FK) para no ambiguar el embed de
--  PostgREST (task_delegations ya referencia tasks por task_id).

create table if not exists public.task_delegations (
  task_id uuid primary key references public.tasks (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  assignee_name text,
  delegation_status text not null default 'por_delegar'
    check (delegation_status in (
      'por_delegar', 'delegada', 'confirmada',
      'en_seguimiento', 'completada', 'devuelta'
    )),
  notify_at date,
  instructions text,
  delivery_deadline date,
  follow_up_at date,
  follow_up_task_id uuid,
  expected_evidence text,
  notes text,
  updated_at timestamptz not null default now()
);

create index if not exists task_delegations_user_idx
  on public.task_delegations (user_id);

alter table public.task_delegations enable row level security;

drop policy if exists task_delegations_select_own on public.task_delegations;
create policy task_delegations_select_own on public.task_delegations for select
  using ((select auth.uid()) = user_id);

drop policy if exists task_delegations_insert_own on public.task_delegations;
create policy task_delegations_insert_own on public.task_delegations for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists task_delegations_update_own on public.task_delegations;
create policy task_delegations_update_own on public.task_delegations for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
