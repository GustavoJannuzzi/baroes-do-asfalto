"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

async function requireAdmin() {
  if (!supabaseConfigured()) throw new Error("Supabase não configurado");
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") throw new Error("Acesso negado");
  return await createClient();
}

function toInt(v: FormDataEntryValue | null, max?: number): number {
  let n = Math.round(Number(v) || 0);
  if (n < 0) n = 0;
  if (max != null && n > max) n = max;
  return n;
}

function toFloat(v: FormDataEntryValue | null): number {
  return Math.max(0, parseFloat(String(v ?? "0")) || 0);
}

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

// ── Characters ──────────────────────────────────────────────────────────────

export async function createCharacter(formData: FormData) {
  const supabase = await requireAdmin();
  const nome = str(formData.get("nome"));
  if (!nome) return;
  const ownerRaw = str(formData.get("owner_user_id"));
  const { data, error } = await supabase
    .from("characters")
    .insert({
      nome,
      apelido: str(formData.get("apelido")),
      arquetipo: str(formData.get("arquetipo")),
      owner_user_id: ownerRaw || null,
    })
    .select("id")
    .single();
  if (error || !data) return;
  revalidatePath("/admin");
  redirect(`/admin/${(data as { id: string }).id}`);
}

export async function updateCharacterMain(charId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const idadeRaw = toInt(formData.get("idade"));
  await supabase
    .from("characters")
    .update({
      nome: str(formData.get("nome")),
      apelido: str(formData.get("apelido")),
      arquetipo: str(formData.get("arquetipo")),
      idade: idadeRaw || null,
      origem: str(formData.get("origem")),
      residencia: str(formData.get("residencia")),
      historico: str(formData.get("historico")),
      ambicao: str(formData.get("ambicao")),
      trauma: str(formData.get("trauma")),
      codigo: str(formData.get("codigo")),
      vicio: str(formData.get("vicio")),
      vantagem: str(formData.get("vantagem")),
      desvantagem: str(formData.get("desvantagem")),
      xp: toInt(formData.get("xp")),
      mente: toInt(formData.get("mente"), 5),
      labia: toInt(formData.get("labia"), 5),
      sangue_frio: toInt(formData.get("sangue_frio"), 5),
      operacao: toInt(formData.get("operacao"), 5),
      contatos: toInt(formData.get("contatos"), 5),
      instinto: toInt(formData.get("instinto"), 5),
      heat: toInt(formData.get("heat"), 10),
      exposicao: toInt(formData.get("exposicao"), 10),
      capital_rua: toInt(formData.get("capital_rua"), 10),
      pressao: toInt(formData.get("pressao"), 10),
      dinheiro_limpo: toInt(formData.get("dinheiro_limpo")),
      dinheiro_sujo: toInt(formData.get("dinheiro_sujo")),
      dinheiro_transito: toInt(formData.get("dinheiro_transito")),
    })
    .eq("id", charId);
  revalidatePath(`/admin/${charId}`);
  revalidatePath("/dashboard");
}

export async function deleteCharacter(charId: string) {
  const supabase = await requireAdmin();
  await supabase.from("characters").delete().eq("id", charId);
  revalidatePath("/admin");
  redirect("/admin");
}

// ── Points ───────────────────────────────────────────────────────────────────

export async function addPoint(charId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const latRaw = str(formData.get("lat"));
  const lngRaw = str(formData.get("lng"));
  const regRaw = str(formData.get("regiao_id"));
  await supabase.from("points").insert({
    character_id: charId,
    nome: str(formData.get("nome")),
    local: str(formData.get("local")),
    regiao_id: regRaw ? toInt(formData.get("regiao_id")) : null,
    tipo: str(formData.get("tipo")),
    renda_liquida: toInt(formData.get("renda_liquida")),
    protecao_paga_a: str(formData.get("protecao_paga_a")),
    protecao_custo: toInt(formData.get("protecao_custo")),
    exposicao: toInt(formData.get("exposicao"), 10),
    lat: latRaw ? toFloat(formData.get("lat")) : null,
    lng: lngRaw ? toFloat(formData.get("lng")) : null,
    status: str(formData.get("status")) || "consolidado",
  });
  revalidatePath(`/admin/${charId}`);
}

export async function deletePoint(pointId: string, charId: string) {
  const supabase = await requireAdmin();
  await supabase.from("points").delete().eq("id", pointId);
  revalidatePath(`/admin/${charId}`);
}

// ── Favors ───────────────────────────────────────────────────────────────────

export async function addFavor(charId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const grauRaw = str(formData.get("grau"));
  await supabase.from("favors").insert({
    character_id: charId,
    direcao: str(formData.get("direcao")) || "devido",
    contraparte: str(formData.get("contraparte")),
    descricao: str(formData.get("descricao")),
    grau: grauRaw || null,
    juros: toInt(formData.get("juros")),
    status: "aberto",
  });
  revalidatePath(`/admin/${charId}`);
}

export async function deleteFavor(favorId: string, charId: string) {
  const supabase = await requireAdmin();
  await supabase.from("favors").delete().eq("id", favorId);
  revalidatePath(`/admin/${charId}`);
}

// ── Security ─────────────────────────────────────────────────────────────────

export async function addSecurity(charId: string, formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("security_team").insert({
    character_id: charId,
    tipo: str(formData.get("tipo")),
    qtd: toInt(formData.get("qtd")) || 1,
    lealdade: toInt(formData.get("lealdade"), 10),
    custo_mensal: toInt(formData.get("custo_mensal")),
  });
  revalidatePath(`/admin/${charId}`);
}

export async function deleteSecurity(secId: string, charId: string) {
  const supabase = await requireAdmin();
  await supabase.from("security_team").delete().eq("id", secId);
  revalidatePath(`/admin/${charId}`);
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export async function addContact(charId: string, formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("contacts").insert({
    character_id: charId,
    nome: str(formData.get("nome")),
    funcao: str(formData.get("funcao")),
    lealdade: toInt(formData.get("lealdade"), 10),
    servico: str(formData.get("servico")),
    custo_mensal: toInt(formData.get("custo_mensal")),
  });
  revalidatePath(`/admin/${charId}`);
}

export async function deleteContact(contactId: string, charId: string) {
  const supabase = await requireAdmin();
  await supabase.from("contacts").delete().eq("id", contactId);
  revalidatePath(`/admin/${charId}`);
}

// ── Fachadas ──────────────────────────────────────────────────────────────────

export async function addFachada(charId: string, formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("fachadas").insert({
    character_id: charId,
    nome: str(formData.get("nome")),
    tipo: str(formData.get("tipo")),
    capacidade: toInt(formData.get("capacidade")),
    taxa: toFloat(formData.get("taxa")),
    custo_mensal: toInt(formData.get("custo_mensal")),
  });
  revalidatePath(`/admin/${charId}`);
}

export async function deleteFachada(fachadaId: string, charId: string) {
  const supabase = await requireAdmin();
  await supabase.from("fachadas").delete().eq("id", fachadaId);
  revalidatePath(`/admin/${charId}`);
}
