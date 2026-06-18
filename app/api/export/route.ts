import { NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });
  }

  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const supabase = await createClient();

  const [
    { data: characters },
    { data: points },
    { data: favors },
    { data: security },
    { data: contacts },
    { data: fachadas },
  ] = await Promise.all([
    supabase.from("characters").select("*").order("created_at"),
    supabase.from("points").select("*"),
    supabase.from("favors").select("*"),
    supabase.from("security_team").select("*"),
    supabase.from("contacts").select("*"),
    supabase.from("fachadas").select("*"),
  ]);

  const result = (characters ?? []).map((c) => ({
    ...c,
    points: (points ?? []).filter((p) => p.character_id === c.id),
    favors: (favors ?? []).filter((f) => f.character_id === c.id),
    security: (security ?? []).filter((s) => s.character_id === c.id),
    contacts: (contacts ?? []).filter((ct) => ct.character_id === c.id),
    fachadas: (fachadas ?? []).filter((fa) => fa.character_id === c.id),
  }));

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(result, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="baroes-characters-${date}.json"`,
    },
  });
}
