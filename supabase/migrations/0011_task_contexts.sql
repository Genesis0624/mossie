-- Mossie — Fase 1: contexto de planificación (Flujo v2.0 §12.5, §23.4).
--  Relación muchos-a-muchos: una tarea puede tener varios contextos
--  (Casa + Computadora, etc.). El contexto se guarda como slug de una lista
--  fija (ver src/features/tasks/contexts.ts). La propiedad se hereda de la
--  tarea: no hay user_id propio, la RLS se apoya en tasks.

create table if not exists public.task_contexts (
  task_id uuid not null references public.tasks (id) on delete cascade,
  context text not null check (context in (
    'casa', 'trabajo', 'iglesia', 'fuera', 'computadora',
    'telefono', 'tablet', 'con_persona', 'cualquiera'
  )),
  primary key (task_id, context)
);

create index if not exists task_contexts_task_idx
  on public.task_contexts (task_id);

alter table public.task_contexts enable row level security;

-- Cada fila pertenece al dueño de la tarea referida.
drop policy if exists task_contexts_select_own on public.task_contexts;
create policy task_contexts_select_own on public.task_contexts for select
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.user_id = (select auth.uid())
    )
  );

drop policy if exists task_contexts_insert_own on public.task_contexts;
create policy task_contexts_insert_own on public.task_contexts for insert
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.user_id = (select auth.uid())
    )
  );

drop policy if exists task_contexts_delete_own on public.task_contexts;
create policy task_contexts_delete_own on public.task_contexts for delete
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.user_id = (select auth.uid())
    )
  );
