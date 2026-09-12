-- Mossie — Fase 1: entidades de captura del botón "+"
-- Eventos, gastos e ideas son entidades separadas de las tareas (Doc GTD §8).
-- Aquí solo la persistencia maestra; los módulos (Calendario, Finanzas,
-- Inbox de ideas) se construyen después.

-- ── Eventos ──────────────────────────────────────────────────────────────
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  event_date date not null,
  event_time time,                 -- null = hora pendiente / día completo
  all_day boolean not null default false,
  location text,
  modality text not null default 'por_confirmar'
    check (modality in ('presencial', 'virtual', 'por_confirmar')),
  prep_checklist text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint events_name_not_blank check (char_length(btrim(name)) between 1 and 300)
);

create index if not exists events_user_date_idx
  on public.events (user_id, event_date) where deleted_at is null;

alter table public.events enable row level security;

drop policy if exists events_select_own on public.events;
create policy events_select_own on public.events for select
  using ((select auth.uid()) = user_id);
drop policy if exists events_insert_own on public.events;
create policy events_insert_own on public.events for insert
  with check ((select auth.uid()) = user_id);
drop policy if exists events_update_own on public.events;
create policy events_update_own on public.events for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

-- ── Gastos (persistencia provisional para el futuro módulo de Finanzas) ────
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  concept text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  account text not null default 'efectivo'
    check (account in ('efectivo', 'debito', 'credito', 'otra')),
  spent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint expenses_concept_not_blank check (char_length(btrim(concept)) between 1 and 300)
);

create index if not exists expenses_user_date_idx
  on public.expenses (user_id, spent_at) where deleted_at is null;

alter table public.expenses enable row level security;

drop policy if exists expenses_select_own on public.expenses;
create policy expenses_select_own on public.expenses for select
  using ((select auth.uid()) = user_id);
drop policy if exists expenses_insert_own on public.expenses;
create policy expenses_insert_own on public.expenses for insert
  with check ((select auth.uid()) = user_id);
drop policy if exists expenses_update_own on public.expenses;
create policy expenses_update_own on public.expenses for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at before update on public.expenses
  for each row execute function public.set_updated_at();

-- ── Ideas y asuntos (Inbox propio, se transforman más adelante) ────────────
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  link text,
  status text not null default 'inbox'
    check (status in ('inbox', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint ideas_title_not_blank check (char_length(btrim(title)) between 1 and 1000)
);

create index if not exists ideas_user_status_idx
  on public.ideas (user_id, status, created_at) where deleted_at is null;

alter table public.ideas enable row level security;

drop policy if exists ideas_select_own on public.ideas;
create policy ideas_select_own on public.ideas for select
  using ((select auth.uid()) = user_id);
drop policy if exists ideas_insert_own on public.ideas;
create policy ideas_insert_own on public.ideas for insert
  with check ((select auth.uid()) = user_id);
drop policy if exists ideas_update_own on public.ideas;
create policy ideas_update_own on public.ideas for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop trigger if exists ideas_set_updated_at on public.ideas;
create trigger ideas_set_updated_at before update on public.ideas
  for each row execute function public.set_updated_at();
