import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export type Role = "admin" | "player";

export type Profile = {
  id: string;
  display_name: string | null;
  role: Role;
  character_id: string | null;
};

/** Usuário autenticado (ou null se não logado / Supabase não configurado). */
export async function getSessionUser() {
  if (!supabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/** Perfil (papel admin/player) do usuário logado. */
export async function getProfile(): Promise<Profile | null> {
  if (!supabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, role, character_id")
    .eq("id", user.id)
    .single();
  return (data as Profile) ?? null;
}
