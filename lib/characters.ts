import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Character } from "@/lib/game/types";

/** Personagem de exemplo — usado no modo preview (sem Supabase). Dispara vários alertas de propósito. */
export const SAMPLE_CHARACTER: Character = {
  id: "sample",
  nome: "Marcão da Central",
  apelido: "O Contador",
  arquetipo: "O Contador Sujo",
  idade: 44,
  origem: "Madureira",
  residencia: "Tijuca",
  historico: "Sumiu com a contabilidade de meio bicheiro do subúrbio.",
  ambicao: "Virar banqueiro de uma rede própria.",
  trauma: "Viu o sócio ser entregue por uma planilha.",
  codigo: "Nunca deixa rastro no papel.",
  vicio: "Cigarro de palha e café forte.",
  vantagem: "Alquimista Financeiro",
  desvantagem: "Papel Rastreável",
  xp: 24,
  attrs: { mente: 4, labia: 3, sangueFrio: 2, operacao: 1, contatos: 3, instinto: 2 },
  metrics: { heat: 6, exposicao: 8, capitalRua: 5, pressao: 7 },
  money: { limpo: 18_000, sujo: 240_000, transito: 80_000 },
  pericias: {
    negociacao: 2,
    economia_ilegal: 3,
    lavagem: 3,
    planejamento: 2,
    direito: 1,
    submundo_carioca: 2,
  },
  points: [
    {
      id: "p1",
      nome: "Barraca da Central",
      local: "Centro",
      regiaoId: 1,
      tipo: "Barraca de rua",
      rendaLiquida: 22_350,
      protecaoPagaA: "Milícia + PM",
      protecaoCusto: 6_000,
      exposicao: 5,
      lat: -22.903,
      lng: -43.191,
      status: "consolidado",
    },
    {
      id: "p2",
      nome: "Lotérica do Carvalho",
      local: "Campo Grande",
      regiaoId: 4,
      tipo: "Lotérica associada",
      rendaLiquida: 39_000,
      protecaoPagaA: "Milícia",
      protecaoCusto: 9_000,
      exposicao: 6,
      lat: -22.905,
      lng: -43.56,
      status: "consolidado",
    },
    {
      id: "p3",
      nome: "App Resultado Fácil",
      local: "—",
      regiaoId: null,
      tipo: "Plataforma online",
      rendaLiquida: 100_500,
      protecaoPagaA: "Offshore + hacker",
      protecaoCusto: 12_000,
      exposicao: 9,
      lat: null,
      lng: null,
      status: "consolidado",
    },
  ],
  favors: [
    {
      id: "f1",
      direcao: "devido",
      contraparte: "Delegado Pires",
      descricao: "Arquivar um inquérito",
      grau: "grande",
      juros: 2,
      status: "aberto",
    },
    {
      id: "f2",
      direcao: "devido",
      contraparte: "Dona Magnólia",
      descricao: "Lavagem emergencial",
      grau: "medio",
      juros: 0,
      status: "aberto",
    },
    {
      id: "f3",
      direcao: "a_receber",
      contraparte: "Seu Milton",
      descricao: "Indicação de pontos",
      grau: "pequeno",
      juros: 0,
      status: "aberto",
    },
  ],
  security: [
    { id: "s1", tipo: "Segurança experiente", qtd: 2, lealdade: 6, custoMensal: 7_000 },
    { id: "s2", tipo: 'Moleque da boca ("o Rala")', qtd: 1, lealdade: 2, custoMensal: 3_000 },
  ],
  contacts: [
    { id: "c1", nome: "Bug", funcao: "Hacker", lealdade: 3, servico: "Plataforma online", custoMensal: 4_000 },
    { id: "c2", nome: "Dr. Said", funcao: "Advogado", lealdade: 6, servico: "Defesa", custoMensal: 8_000 },
  ],
  fachadas: [
    { id: "fa1", nome: "Lava-rápido Jet", tipo: "Lava-rápido", capacidade: 80_000, taxa: 25, custoMensal: 2_500 },
  ],
};

type Row = Record<string, unknown>;

function mapCharacter(row: Row, children: {
  points: Row[];
  favors: Row[];
  security: Row[];
  contacts: Row[];
  fachadas: Row[];
}): Character {
  const n = (v: unknown) => Number(v ?? 0);
  const s = (v: unknown) => String(v ?? "");
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
    points: children.points.map((p) => ({
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
      status: s(p.status),
    })),
    favors: children.favors.map((f) => ({
      id: s(f.id),
      direcao: (s(f.direcao) as "devido" | "a_receber") || "devido",
      contraparte: s(f.contraparte),
      descricao: s(f.descricao),
      grau: (f.grau as Character["favors"][number]["grau"]) ?? null,
      juros: n(f.juros),
      status: s(f.status),
    })),
    security: children.security.map((u) => ({
      id: s(u.id),
      tipo: s(u.tipo),
      qtd: n(u.qtd),
      lealdade: n(u.lealdade),
      custoMensal: n(u.custo_mensal),
    })),
    contacts: children.contacts.map((u) => ({
      id: s(u.id),
      nome: s(u.nome),
      funcao: s(u.funcao),
      lealdade: n(u.lealdade),
      servico: s(u.servico),
      custoMensal: n(u.custo_mensal),
    })),
    fachadas: children.fachadas.map((u) => ({
      id: s(u.id),
      nome: s(u.nome),
      tipo: s(u.tipo),
      capacidade: n(u.capacidade),
      taxa: n(u.taxa),
      custoMensal: n(u.custo_mensal),
    })),
  };
}

export type CharacterResult = { character: Character; isSample: boolean };

/** Personagem do usuário logado (ou exemplo, em modo preview). */
export async function getCharacterForCurrentUser(): Promise<CharacterResult> {
  if (!supabaseConfigured()) return { character: SAMPLE_CHARACTER, isSample: true };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { character: SAMPLE_CHARACTER, isSample: true };

  const { data: char } = await supabase
    .from("characters")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (!char) return { character: SAMPLE_CHARACTER, isSample: true };

  const cid = (char as Row).id;
  const [points, favors, security, contacts, fachadas] = await Promise.all([
    supabase.from("points").select("*").eq("character_id", cid),
    supabase.from("favors").select("*").eq("character_id", cid),
    supabase.from("security_team").select("*").eq("character_id", cid),
    supabase.from("contacts").select("*").eq("character_id", cid),
    supabase.from("fachadas").select("*").eq("character_id", cid),
  ]);

  return {
    character: mapCharacter(char as Row, {
      points: (points.data as Row[]) ?? [],
      favors: (favors.data as Row[]) ?? [],
      security: (security.data as Row[]) ?? [],
      contacts: (contacts.data as Row[]) ?? [],
      fachadas: (fachadas.data as Row[]) ?? [],
    }),
    isSample: false,
  };
}
