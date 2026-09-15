-- Mossie — Fase 1: recurrencia (Flujo v2.0 §13, §23.4).
--  La regla es una plantilla; cada ocurrencia es una tarea independiente
--  vinculada a la regla (tasks.recurrence_rule_id). La siguiente ocurrencia se
--  genera al completar la actual, así no se crean instancias infinitas.
--
--  Primer alcance de frecuencias: daily/weekly/monthly/yearly con interval_value
--  ("cada N"). Modo de cálculo: fixed_calendar (según el calendario) o
--  after_completion (contando desde que se completa).

create table if not exists public.recurrence_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  frequency_type text not null
    check (frequency_type in ('daily', 'weekly', 'monthly', 'yearly')),
  interval_value int not null default 1
    check (interval_value between 1 and 365),
  calculation_mode text not null default 'fixed_calendar'
    check (calculation_mode in ('fixed_calendar', 'after_completion')),
  starts_at date not null,
  ends_at date,
  max_occurrences int check (max_occurrences is null or max_occurrences between 1 and 1000),
  occurrences_count int not null default 1,
  next_occurrence_at date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists recurrence_rules_user_idx
  on public.recurrence_rules (user_id);

alter table public.recurrence_rules enable row level security;

drop policy if exists recurrence_rules_select_own on public.recurrence_rules;
create policy recurrence_rules_select_own on public.recurrence_rules for select
  using ((select auth.uid()) = user_id);

drop policy if exists recurrence_rules_insert_own on public.recurrence_rules;
create policy recurrence_rules_insert_own on public.recurrence_rules for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists recurrence_rules_update_own on public.recurrence_rules;
create policy recurrence_rules_update_own on public.recurrence_rules for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Enlace de la tarea (ocurrencia) con su regla.
alter table public.tasks
  add column if not exists recurrence_rule_id uuid
    references public.recurrence_rules (id) on delete set null;

create index if not exists tasks_recurrence_rule_idx
  on public.tasks (recurrence_rule_id)
  where recurrence_rule_id is not null;
