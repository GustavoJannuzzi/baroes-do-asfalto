export interface KitResource {
  slug: string;
  file: string;
  printFile?: string;
  name: string;
  icon: string;
  desc: string;
  size: string;
  sizeLabel: string;
}

export const KIT_RESOURCES: KitResource[] = [
  {
    slug: "tabuleiro",
    file: "Tabuleiro do Rio.html",
    printFile: "Tabuleiro do Rio-print.html",
    name: "Tabuleiro do Rio",
    icon: "🗺️",
    desc: "O mapa das 12 regiões do Rio com territórios, bocas de fumo e rotas.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
  {
    slug: "ficha-de-personagem",
    file: "Ficha de Personagem.html",
    printFile: "Ficha de Personagem-print.html",
    name: "Ficha de Personagem",
    icon: "📋",
    desc: "Ficha completa: atributos, métricas, dinheiro, pontos e favores.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
  {
    slug: "escudo-do-mestre",
    file: "Escudo do Mestre.html",
    printFile: "Escudo do Mestre-print.html",
    name: "Escudo do Mestre",
    icon: "🛡️",
    desc: "Escudo dobrável com tabelas de referência rápida para o mestre.",
    size: "A4L",
    sizeLabel: "A4 paisagem",
  },
  {
    slug: "referencia-do-jogador",
    file: "Referência Rápida do Jogador.html",
    name: "Referência do Jogador",
    icon: "📄",
    desc: "Folha de referência com atributos, testes e mecânicas essenciais.",
    size: "A5",
    sizeLabel: "A5 retrato",
  },
  {
    slug: "baralho-de-favores",
    file: "Baralho de Favores.html",
    printFile: "Baralho de Favores-print.html",
    name: "Baralho de Favores",
    icon: "🃏",
    desc: "Deck de cartas para favores — dívidas, serviços e pressão social.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
  {
    slug: "cartas-de-arquetipo",
    file: "Cartas de Arquétipo.html",
    name: "Cartas de Arquétipo",
    icon: "🎴",
    desc: "Cartas de personagem com habilidades especiais de cada arquétipo.",
    size: "A5",
    sizeLabel: "A5 retrato",
  },
  {
    slug: "cartas-de-evento",
    file: "Cartas de Evento.html",
    name: "Cartas de Evento",
    icon: "⚡",
    desc: "Deck de eventos aleatórios para o mestre introduzir durante a sessão.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
  {
    slug: "cartas-de-npc",
    file: "Cartas de NPC.html",
    name: "Cartas de NPC",
    icon: "👤",
    desc: "Fichas rápidas de NPCs com motivação, lealdade e mecânica de contato.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
  {
    slug: "fichas-de-ponto",
    file: "Fichas de Ponto.html",
    name: "Fichas de Ponto",
    icon: "📍",
    desc: "Fichas para registrar bocas de fumo, renda, proteção e exposição.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
  {
    slug: "bandejas-de-lavagem",
    file: "Bandejas de Lavagem.html",
    name: "Bandejas de Lavagem",
    icon: "💰",
    desc: "Componente de mesa para rastrear ciclos de lavagem de dinheiro.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
  {
    slug: "animais-do-bicho",
    file: "Animais do Bicho.html",
    name: "Animais do Bicho",
    icon: "🐯",
    desc: "Tabela dos 25 bichos com números, grupos e significados do jogo.",
    size: "A3",
    sizeLabel: "A3 retrato",
  },
  {
    slug: "livro-rapido-do-mestre",
    file: "Livro Rápido do Mestre.html",
    name: "Livro Rápido do Mestre",
    icon: "📚",
    desc: "Booklet de referência condensado: testes, economia, combate e lavagem.",
    size: "A4L",
    sizeLabel: "A4 paisagem",
  },
  {
    slug: "marcadores-e-tokens",
    file: "Marcadores e Tokens.html",
    name: "Marcadores e Tokens",
    icon: "🔵",
    desc: "Folha de tokens: heat, exposição, dinheiro, controle de região e mais.",
    size: "A4",
    sizeLabel: "A4 retrato",
  },
];

export function getResourceBySlug(slug: string): KitResource | undefined {
  return KIT_RESOURCES.find((r) => r.slug === slug);
}
