"use server";

import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

function toInt(v: FormDataEntryValue | null, max?: number): number {
  let n = Math.round(Number(v) || 0);
  if (n < 0) n = 0;
  if (max != null && n > max) n = max;
  return n;
}

/** Atualização rápida de dinheiro e métricas do personagem do usuário logado. */
export async function updateQuick(formData: FormData) {
  if (!supabaseConfigured()) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const patch = {
    dinheiro_limpo: toInt(formData.get("limpo")),
    dinheiro_sujo: toInt(formData.get("sujo")),
    dinheiro_transito: toInt(formData.get("transito")),
    heat: toInt(formData.get("heat"), 10),
    exposicao: toInt(formData.get("exposicao"), 10),
    capital_rua: toInt(formData.get("capital"), 10),
    pressao: toInt(formData.get("pressao"), 10),
  };

  await supabase.from("characters").update(patch).eq("owner_user_id", user.id);
  revalidatePath("/dashboard");
}
