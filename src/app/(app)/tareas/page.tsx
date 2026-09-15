import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TareasTabs } from "@/features/tasks/tareas-tabs";
import { TASK_SELECT, rowsToTasks } from "@/features/tasks/types";

export const metadata: Metadata = { title: "Tareas" };

export default async function TareasPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const tasks = rowsToTasks(data);

  return (
    <main className="px-6 pt-12">
      <h1 className="font-editorial text-moss-800 text-3xl">Tareas</h1>
      {error ? (
        <p className="bg-clay-50 text-ink-soft mt-6 rounded-lg px-4 py-3 text-sm">
          No pudimos cargar tus tareas. Recarga la página para intentarlo de
          nuevo.
        </p>
      ) : (
        <TareasTabs tasks={tasks} />
      )}
    </main>
  );
}
