// Modelo de personagem normalizado (espelha a ficha — doc 2.2)

export type Point = {
  id: string;
  nome: string;
  local: string;
  regiaoId: number | null;
  tipo: string;
  rendaLiquida: number;
  protecaoPagaA: string;
  protecaoCusto: number;
  exposicao: number;
  lat: number | null;
  lng: number | null;
  status: string; // consolidado | disputa
};

export type FavorGrau = "pequeno" | "medio" | "grande" | "critico";

export type Favor = {
  id: string;
  direcao: "devido" | "a_receber";
  contraparte: string;
  descricao: string;
  grau: FavorGrau | null;
  juros: number;
  status: string; // aberto | pago
};

export type SecurityUnit = {
  id: string;
  tipo: string;
  qtd: number;
  lealdade: number;
  custoMensal: number;
};

export type Contact = {
  id: string;
  nome: string;
  funcao: string;
  lealdade: number;
  servico: string;
  custoMensal: number;
};

export type Fachada = {
  id: string;
  nome: string;
  tipo: string;
  capacidade: number;
  taxa: number;
  custoMensal: number;
};

export type Character = {
  id: string;
  nome: string;
  apelido: string;
  arquetipo: string;
  idade: number | null;
  origem: string;
  residencia: string;
  historico: string;
  ambicao: string;
  trauma: string;
  codigo: string;
  vicio: string;
  vantagem: string;
  desvantagem: string;
  xp: number;
  attrs: {
    mente: number;
    labia: number;
    sangueFrio: number;
    operacao: number;
    contatos: number;
    instinto: number;
  };
  metrics: { heat: number; exposicao: number; capitalRua: number; pressao: number };
  money: { limpo: number; sujo: number; transito: number };
  pericias: Record<string, number>;
  points: Point[];
  favors: Favor[];
  security: SecurityUnit[];
  contacts: Contact[];
  fachadas: Fachada[];
};
