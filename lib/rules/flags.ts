import type { Character } from "@/lib/game/types";
import {
  DIRTY_INFORMAL_LIMIT,
  brl,
  exposicaoStatus,
  heatStatus,
  pressaoStatus,
} from "@/lib/game/rules";

export type FlagLevel = "info" | "warn" | "danger";
export type Flag = {
  id: string;
  level: FlagLevel;
  icon: string;
  title: string;
  detail: string;
};

/** Renda mensal dos pontos. */
export function monthlyIncome(c: Character): number {
  return c.points.reduce((s, p) => s + (p.rendaLiquida || 0), 0);
}

/** Obrigações mensais: proteção dos pontos + equipe de segurança + contatos + fachadas. */
export function monthlyObligations(c: Character) {
  const protecao = c.points.reduce((s, p) => s + (p.protecaoCusto || 0), 0);
  const seguranca = c.security.reduce((s, u) => s + (u.custoMensal || 0) * (u.qtd || 1), 0);
  const contatos = c.contacts.reduce((s, u) => s + (u.custoMensal || 0), 0);
  const fachadas = c.fachadas.reduce((s, u) => s + (u.custoMensal || 0), 0);
  return {
    protecao,
    seguranca,
    contatos,
    fachadas,
    total: protecao + seguranca + contatos + fachadas,
  };
}

export function monthlyBalance(c: Character) {
  const income = monthlyIncome(c);
  const obrig = monthlyObligations(c);
  return { income, obrig, net: income - obrig.total };
}

/** Calcula os alertas (flags) do personagem segundo as regras do livro. */
export function computeFlags(c: Character): Flag[] {
  const flags: Flag[] = [];

  // 1) Lavagem de dinheiro sujo
  if (c.money.sujo > DIRTY_INFORMAL_LIMIT) {
    const excesso = c.money.sujo - DIRTY_INFORMAL_LIMIT;
    flags.push({
      id: "lavar",
      level: c.money.sujo > DIRTY_INFORMAL_LIMIT * 5 ? "danger" : "warn",
      icon: "💴",
      title: "Precisa lavar dinheiro",
      detail: `Você tem ${brl(c.money.sujo)} sujo. Acima de ${brl(
        DIRTY_INFORMAL_LIMIT
      )} não dá para gastar sem chamar a Receita — lave ${brl(excesso)}.`,
    });
  }

  // 2) Exposição
  if (c.metrics.exposicao >= 7) {
    flags.push({
      id: "exposicao",
      level: c.metrics.exposicao >= 8 ? "danger" : "warn",
      icon: "👁️",
      title: `Exposição ${c.metrics.exposicao}/10`,
      detail: exposicaoStatus(c.metrics.exposicao) + ".",
    });
  }

  // 3) Heat
  if (c.metrics.heat >= 3) {
    flags.push({
      id: "heat",
      level: c.metrics.heat >= 7 ? "danger" : "warn",
      icon: "🔥",
      title: `Heat ${c.metrics.heat}/10`,
      detail: heatStatus(c.metrics.heat) + ".",
    });
  }

  // 4) Pressão / Colapso
  if (c.metrics.pressao >= 7) {
    flags.push({
      id: "pressao",
      level: c.metrics.pressao >= 10 ? "danger" : "warn",
      icon: "💀",
      title: `Pressão ${c.metrics.pressao}/10`,
      detail: pressaoStatus(c.metrics.pressao) + ".",
    });
  }

  // 5) Favores devidos (e juros)
  const devidos = c.favors.filter((f) => f.direcao === "devido" && f.status !== "pago");
  if (devidos.length) {
    const comJuros = devidos.filter((f) => f.juros > 0);
    flags.push({
      id: "favores",
      level: comJuros.length ? "danger" : "warn",
      icon: "🤝",
      title: `${devidos.length} favor(es) em aberto`,
      detail: comJuros.length
        ? `${comJuros.length} já acumulando juros — pague antes que o credor cobre do jeito dele.`
        : `Você deve: ${devidos.map((f) => f.contraparte || "?").join(", ")}.`,
    });
  }

  // 6) Pagamentos do mês vs caixa
  const { income, obrig, net } = monthlyBalance(c);
  if (obrig.total > 0) {
    const semCaixa = c.money.limpo + c.money.sujo < obrig.total;
    flags.push({
      id: "pagamentos",
      level: semCaixa ? "danger" : "info",
      icon: "📅",
      title: `Pagamentos do mês: ${brl(obrig.total)}`,
      detail: semCaixa
        ? `Caixa insuficiente para cobrir proteção, equipe e contatos. Risco de calote — e calote se paga caro.`
        : `Proteção ${brl(obrig.protecao)} · equipe ${brl(obrig.seguranca)} · contatos ${brl(
            obrig.contatos
          )}.`,
    });
  }

  // 7) Balanço negativo
  if (income > 0 && net < 0) {
    flags.push({
      id: "balanco",
      level: "warn",
      icon: "📉",
      title: "Mês no vermelho",
      detail: `Renda ${brl(income)} − despesas ${brl(obrig.total)} = ${brl(
        net
      )}. Volume passando pela peneira não é lucro.`,
    });
  }

  // 8) Lealdade baixa (traição)
  const traidores = [
    ...c.security.filter((u) => u.lealdade <= 2).map((u) => u.tipo || "segurança"),
    ...c.contacts.filter((u) => u.lealdade <= 2).map((u) => u.nome || "contato"),
  ];
  if (traidores.length) {
    flags.push({
      id: "lealdade",
      level: "danger",
      icon: "🐍",
      title: "Risco de traição",
      detail: `Lealdade baixa: ${traidores.join(", ")}. Lealdade 0–2 trai na primeira oportunidade.`,
    });
  }

  // 9) Pontos muito expostos
  const expostos = c.points.filter((p) => p.exposicao >= 7);
  if (expostos.length) {
    flags.push({
      id: "pontos-expostos",
      level: "warn",
      icon: "🚨",
      title: `${expostos.length} ponto(s) muito exposto(s)`,
      detail: `${expostos
        .map((p) => p.nome)
        .join(", ")} — exposição 7+ atrai operação policial.`,
    });
  }

  return flags;
}
