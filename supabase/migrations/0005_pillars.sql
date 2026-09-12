-- Mossie — tipo/pilar/fecha límite en tareas.
-- Los pilares se manejan por ahora como una lista fija en el código
-- (src/features/pillars/pillars.ts); aquí solo guardamos el identificador
-- elegido (slug) y la fecha límite. Se promoverán a tabla si hace falta.

alter table public.tasks
  add column if not exists deadline_at date,
  add column if not exists pillar text;
