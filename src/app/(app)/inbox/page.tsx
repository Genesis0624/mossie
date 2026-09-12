import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TaskRow } from "@/features/tasks/task-row";
import type { Task } from "@/features/tasks/types";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tasks")
    .select("id, title, type, is_express, status, completed_at, created_at")
    .eq("status", "inbox")
    .is("deleted_at", null)
    .order("created_at", { ascending: true }); // más antigua → más reciente

  const tasks = (data ?? []) as Task[];

  return (
    <main className="px-6 pt-12">
      <h1 className="font-editorial text-moss-800 text-3xl">Inbox</h1>
      <p className="text-ink-mute mt-1 text-sm">
        Lo que capturaste y aún espera una decisión.
      </p>

      {tasks.length === 0 ? (
        <div className="border-line-2 bg-paper-2 mt-12 rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="font-editorial text-ink-soft text-lg">
            Tu Inbox está vacío.
          </p>
          <p className="text-ink-mute mt-2 text-sm">
            Toca el botón + para capturar lo que tengas en mente.
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ul>
      )}
    </main>
  );
}
