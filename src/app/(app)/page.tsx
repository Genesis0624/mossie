import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .maybeSingle();

  const nombre = profile?.full_name?.trim();

  const fecha = new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Santo_Domingo",
  }).format(new Date());

  return (
    <main className="px-6 pt-12">
      <p className="text-ink-mute text-xs tracking-[0.2em] uppercase">
        {fecha}
      </p>
      <h1 className="font-editorial text-moss-800 mt-2 text-3xl">
        {nombre ? `Hola, ${nombre}` : "Hola"}
      </h1>
      <p className="font-editorial text-ink-soft mt-3 text-lg italic">
        La cotidianidad no puede seguir ahogando el futuro.
      </p>

      <section className="border-line bg-paper-2 mt-10 rounded-lg border p-6 shadow-[var(--shadow-sm)]">
        <h2 className="text-ink text-base font-medium">Tu Centro de Mando</h2>
        <p className="text-ink-soft mt-2 text-sm leading-relaxed">
          Aquí vivirá lo que te toca hoy: captura rápida, tareas exprés,
          vencidas y preparar mañana. Por ahora los cimientos están listos —
          construimos el resto paso a paso, sin prisa.
        </p>
      </section>
    </main>
  );
}
