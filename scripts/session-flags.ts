#!/usr/bin/env tsx
/**
 * session-flags — lê um characters.json exportado do webapp e imprime os alertas
 * pré-sessão de cada personagem, reusando o motor de regras canônico.
 *
 * Uso:
 *   npx tsx scripts/session-flags.ts <caminho/para/characters.json>
 *   npx tsx scripts/session-flags.ts characters.json
 */

import { readFileSync } from "fs";
import { computeFlags, monthlyBalance } from "../lib/rules/flags";
import { brl } from "../lib/game/rules";
import type { Character, Point, Favor, SecurityUnit, Contact, Fachada } from "../lib/game/types";

// ── Mapeamento DB (snake_case) → Character (camelCase) ───────────────────────

type Row = Record<string, unknown>;

function n(v: unknown): number { return Number(v ?? 0); }
function s(v: unknown): string { return String(v ?? ""); }

function mapCharacter(row: Row): Character {
  const points = ((row.points as Row[]) ?? []).map((p): Point => ({
    id: s(p.id),
    nome: s(p.nome),
    local: s(p.local),
    regiaoId: p.regiao_id == null ? null : n(p.regiao_id),
    tipo: s(p.tipo),
    rendaLiquida: n(p.renda_liquida),
    protecaoPagaA: s(p.protecao_paga_a),
    protecaoCusto: n(p.protecao_custo),
    exposicao: n(p.exposicao),
    lat: p.lat == null ? null : n(p.lat),
    lng: p.lng == null ? null : n(p.lng),
    status: s(p.status) || "consolidado",
  }));

  const favors = ((row.favors as Row[]) ?? []).map((f): Favor => ({
    id: s(f.id),
    direcao: (s(f.direcao) as "devido" | "a_receber") || "devido",
    contraparte: s(f.contraparte),
    descricao: s(f.descricao),
    grau: (f.grau ?? null) as Favor["grau"],
    juros: n(f.juros),
    status: s(f.status) || "aberto",
  }));

  const security = ((row.security as Row[]) ?? []).map((u): SecurityUnit => ({
    id: s(u.id),
    tipo: s(u.tipo),
    qtd: n(u.qtd) || 1,
    lealdade: n(u.lealdade),
    custoMensal: n(u.custo_mensal),
  }));

  const contacts = ((row.contacts as Row[]) ?? []).map((c): Contact => ({
    id: s(c.id),
    nome: s(c.nome),
    funcao: s(c.funcao),
    lealdade: n(c.lealdade),
    servico: s(c.servico),
    custoMensal: n(c.custo_mensal),
  }));

  const fachadas = ((row.fachadas as Row[]) ?? []).map((fa): Fachada => ({
    id: s(fa.id),
    nome: s(fa.nome),
    tipo: s(fa.tipo),
    capacidade: n(fa.capacidade),
    taxa: n(fa.taxa),
    custoMensal: n(fa.custo_mensal),
  }));

  return {
    id: s(row.id),
    nome: s(row.nome),
    apelido: s(row.apelido),
    arquetipo: s(row.arquetipo),
    idade: row.idade == null ? null : n(row.idade),
    origem: s(row.origem),
    residencia: s(row.residencia),
    historico: s(row.historico),
    ambicao: s(row.ambicao),
    trauma: s(row.trauma),
    codigo: s(row.codigo),
    vicio: s(row.vicio),
    vantagem: s(row.vantagem),
    desvantagem: s(row.desvantagem),
    xp: n(row.xp),
    attrs: {
      mente: n(row.mente),
      labia: n(row.labia),
      sangueFrio: n(row.sangue_frio),
      operacao: n(row.operacao),
      contatos: n(row.contatos),
      instinto: n(row.instinto),
    },
    metrics: {
      heat: n(row.heat),
      exposicao: n(row.exposicao),
      capitalRua: n(row.capital_rua),
      pressao: n(row.pressao),
    },
    money: {
      limpo: n(row.dinheiro_limpo),
      sujo: n(row.dinheiro_sujo),
      transito: n(row.dinheiro_transito),
    },
    pericias: (row.pericias as Record<string, number>) ?? {},
    points,
    favors,
    security,
    contacts,
    fachadas,
  };
}

// ── Formatação de saída ───────────────────────────────────────────────────────

const LEVEL_PREFIX: Record<string, string> = {
  danger: "🔴 PERIGO",
  warn:   "🟡 ATENÇÃO",
  info:   "🔵 INFO",
};

function printCharacter(c: Character): void {
  const sep = "─".repeat(60);
  console.log(`\n${sep}`);
  console.log(`PERSONAGEM: ${c.nome}${c.apelido ? ` ("${c.apelido}")` : ""}`);
  console.log(`Arquétipo: ${c.arquetipo || "—"}  |  XP: ${c.xp}`);
  console.log(sep);

  // Métricas rápidas
  console.log(
    `  Heat ${c.metrics.heat}/10  ·  Exposição ${c.metrics.exposicao}/10  ·  ` +
    `Pressão ${c.metrics.pressao}/10  ·  Cap.Rua ${c.metrics.capitalRua}/10`
  );
  console.log(
    `  $ Limpo: ${brl(c.money.limpo)}  ·  $ Sujo: ${brl(c.money.sujo)}  ·  ` +
    `$ Trânsito: ${brl(c.money.transito)}`
  );

  // Balanço
  const bal = monthlyBalance(c);
  console.log(`\n  BALANÇO DO MÊS`);
  console.log(`    Renda dos pontos:  ${brl(bal.income)}`);
  console.log(`    Obrigações totais: ${brl(bal.obrig.total)}`);
  console.log(`      Proteção:  ${brl(bal.obrig.protecao)}`);
  console.log(`      Segurança: ${brl(bal.obrig.seguranca)}`);
  console.log(`      Contatos:  ${brl(bal.obrig.contatos)}`);
  console.log(`      Fachadas:  ${brl(bal.obrig.fachadas)}`);
  console.log(`    LÍQUIDO:           ${bal.net >= 0 ? "+" : ""}${brl(bal.net)}`);

  // Alertas
  const flags = computeFlags(c);
  console.log(`\n  ALERTAS (${flags.length})`);
  if (flags.length === 0) {
    console.log("    ✅ Tudo limpo — sem alertas ativos.");
  } else {
    for (const f of flags) {
      console.log(`    ${LEVEL_PREFIX[f.level] ?? f.level}  ${f.icon} ${f.title}`);
      console.log(`      ${f.detail}`);
    }
  }

  // Favores em aberto
  const devidos = c.favors.filter((f) => f.direcao === "devido" && f.status !== "pago");
  const aReceber = c.favors.filter((f) => f.direcao === "a_receber" && f.status !== "pago");
  if (devidos.length || aReceber.length) {
    console.log(`\n  FAVORES`);
    for (const f of devidos) {
      console.log(`    → DEVE a ${f.contraparte}: ${f.descricao} [${f.grau ?? "?"}]${f.juros > 0 ? ` +${f.juros} juros` : ""}`);
    }
    for (const f of aReceber) {
      console.log(`    ← A RECEBER de ${f.contraparte}: ${f.descricao}`);
    }
  }

  // Pontos
  if (c.points.length) {
    console.log(`\n  PONTOS (${c.points.length})`);
    for (const p of c.points) {
      const status = p.status === "disputa" ? " ⚔️ DISPUTA" : "";
      console.log(`    • ${p.nome} (${p.local}) — renda ${brl(p.rendaLiquida)}, expo ${p.exposicao}/10${status}`);
    }
  }

  // Lealdades em risco
  const emRisco = [
    ...c.security.filter((u) => u.lealdade <= 3).map((u) => `${u.tipo} leal.${u.lealdade}`),
    ...c.contacts.filter((u) => u.lealdade <= 3).map((u) => `${u.nome} leal.${u.lealdade}`),
  ];
  if (emRisco.length) {
    console.log(`\n  LEALDADES EM RISCO: ${emRisco.join(" | ")}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const filePath = process.argv[2];
if (!filePath) {
  console.error("Uso: npx tsx scripts/session-flags.ts <characters.json>");
  process.exit(1);
}

let raw: Row[];
try {
  const content = readFileSync(filePath, "utf-8").replace(/^﻿/, "");
  raw = JSON.parse(content) as Row[];
} catch (err) {
  console.error(`Erro ao ler ${filePath}:`, err);
  process.exit(1);
}

if (!Array.isArray(raw) || raw.length === 0) {
  console.error("characters.json vazio ou formato inválido.");
  process.exit(1);
}

const date = new Date().toLocaleDateString("pt-BR", { dateStyle: "full" });
console.log(`\n${"═".repeat(60)}`);
console.log(`  BARÕES DO ASFALTO — ALERTAS PRÉ-SESSÃO`);
console.log(`  ${date}`);
console.log(`  ${raw.length} personagem(ns) carregado(s)`);
console.log(`${"═".repeat(60)}`);

for (const row of raw) {
  const character = mapCharacter(row);
  printCharacter(character);
}

console.log(`\n${"═".repeat(60)}\n`);
