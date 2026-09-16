import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { IdeasView } from "@/features/ideas/ideas-view";
import { IDEA_SELECT, type Idea } from "@/features/ideas/types";

export const metadata: Metadata = { title: "Ideas" };

export default async function IdeasPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ideas")
    .select(IDEA_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const ideas = (data ?? []) as Idea[];

  return (
    <main className="px-6 pt-12">
      <h1 className="font-editorial text-moss-800 text-3xl">Ideas</h1>
      <p className="text-ink-soft mt-2 text-sm">
        Lo que anotas sin procesar. Conviértelo en tarea cuando toque actuar.
      </p>
      {error ? (
        <p className="bg-clay-50 text-ink-soft mt-6 rounded-lg px-4 py-3 text-sm">
          No pudimos cargar tus ideas. Recarga la página para intentarlo de
          nuevo.
        </p>
      ) : (
        <IdeasView ideas={ideas} />
      )}
    </main>
  );
}
