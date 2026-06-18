// Constantes do sistema (limiares e custos do livro: 1.1, 4.1, 5.1, 6.2)

/** Dinheiro sujo só circula informalmente até este teto; acima, precisa lavar (4.1). */
export const DIRTY_INFORMAL_LIMIT = 10_000;

/** Pontos de débito por grau de favor (5.1). */
export const FAVOR_DEBITO: Record<string, number> = {
  pequeno: 1,
  medio: 3,
  grande: 6,
  critico: 10,
};

/** Bônus em dados ao gastar um favor (5.1). */
export const FAVOR_BONUS: Record<string, number> = {
  pequeno: 1,
  medio: 2,
  grande: 3,
  critico: 4,
};

export const FAVOR_LABEL: Record<string, string> = {
  pequeno: "Pequeno",
  medio: "Médio",
  grande: "Grande",
  critico: "Crítico",
};

/** Faixas de Heat (1.1). */
export function heatStatus(v: number) {
  if (v >= 9) return "força-tarefa montada";
  if (v >= 7) return "procurado — operações ativas (−3)";
  if (v >= 5) return "investigação ativa (−2)";
  if (v >= 3) return "fichado (−1 social)";
  return "fora do radar";
}

/** Faixas de Pressão (1.1). */
export function pressaoStatus(v: number) {
  if (v >= 10) return "COLAPSO — role 1d6";
  if (v >= 7) return "abalado (−2 mentais)";
  if (v >= 5) return "estressado (−1 SF e Instinto)";
  if (v >= 3) return "tenso (−1 SF)";
  return "estável";
}

/** Faixas de Exposição (1.1 / 7.1). */
export function exposicaoStatus(v: number) {
  if (v >= 8) return "Receita entra automático";
  if (v >= 7) return "não consegue mais usar bancos";
  return "rastro sob controle";
}

export const ATTR_LABELS: { key: keyof CharacterAttrs; label: string }[] = [
  { key: "mente", label: "Mente" },
  { key: "labia", label: "Lábia" },
  { key: "sangueFrio", label: "Sangue Frio" },
  { key: "operacao", label: "Operação" },
  { key: "contatos", label: "Contatos" },
  { key: "instinto", label: "Instinto" },
];

type CharacterAttrs = {
  mente: number;
  labia: number;
  sangueFrio: number;
  operacao: number;
  contatos: number;
  instinto: number;
};

export function brl(n: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n || 0);
}
