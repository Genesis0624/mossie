import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TareasTabs } from "@/features/tasks/tareas-tabs";
import { TASK_SELECT, type Task } from "@/features/tasks/types";

export const metadata: Metadata = { title: "Tareas" };

export default async function TareasPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const tasks = (data ?? []) as Task[];

  return (
    <main className="px-6 pt-12">
      <h1 className="font-editorial text-moss-800 text-3xl">Tareas</h1>
      <TareasTabs tasks={tasks} />
    </main>
  );
}
