import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <main className="px-6 pt-12">
      <h1 className="font-editorial text-moss-800 text-3xl">Perfil</h1>
      <p className="text-ink-mute mt-1 text-sm">{user!.email}</p>

      <div className="mt-8">
        <ProfileForm initialName={profile?.full_name ?? ""} />
      </div>

      <form action={logout} className="mt-12">
        <button
          type="submit"
          className="text-ink-mute hover:text-ink-soft min-h-[44px] text-sm underline underline-offset-4"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
