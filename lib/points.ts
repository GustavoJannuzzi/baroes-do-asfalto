import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { SAMPLE_CHARACTER } from "@/lib/characters";

export type MapPoint = {
  id: string;
  nome: string;
  tipo: string;
  local: string;
  lat: number;
  lng: number;
  rendaLiquida: number;
  exposicao: number;
  ownerName: string;
  mine: boolean;
};

/** Pontos de exemplo de "outros jogadores" (modo preview). */
const SAMPLE_OTHERS: MapPoint[] = [
  {
    id: "o1",
    nome: "Bar do Neguinho",
    tipo: "Bar parceiro",
    local: "Méier",
    lat: -22.902,
    lng: -43.281,
    rendaLiquida: 14_850,
    exposicao: 3,
    ownerName: "Dona Regina",
    mine: false,
  },
  {
    id: "o2",
    nome: "Casa da Tia Marta",
    tipo: "Ponto em comunidade",
    local: "Complexo do Alemão",
    lat: -22.866,
    lng: -43.273,
    rendaLiquida: 11_100,
    exposicao: 2,
    ownerName: "Articulador Cobra",
    mine: false,
  },
  {
    id: "o3",
    nome: "Banca da Glória",
    tipo: "Banca parceira",
    local: "Glória",
    lat: -22.92,
    lng: -43.175,
    rendaLiquida: 15_000,
    exposicao: 4,
    ownerName: "Dona Regina",
    mine: false,
  },
  {
    id: "o4",
    nome: "Oficina Ramos",
    tipo: "Comércio parceiro",
    local: "Ramos",
    lat: -22.852,
    lng: -43.262,
    rendaLiquida: 7_800,
    exposicao: 3,
    ownerName: "Seu Manoel",
    mine: false,
  },
];

function sampleMine(): MapPoint[] {
  return SAMPLE_CHARACTER.points
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      id: p.id,
      nome: p.nome,
      tipo: p.tipo,
      local: p.local,
      lat: p.lat as number,
      lng: p.lng as number,
      rendaLiquida: p.rendaLiquida,
      exposicao: p.exposicao,
      ownerName: SAMPLE_CHARACTER.nome,
      mine: true,
    }));
}

export type MapResult = { points: MapPoint[]; isSample: boolean };

/** Todos os pontos com endereço, marcados por dono (meu × dos outros). */
export async function getAllMapPoints(): Promise<MapResult> {
  if (!supabaseConfigured()) {
    return { points: [...sampleMine(), ...SAMPLE_OTHERS], isSample: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // pontos com endereço + dono (nome do personagem + owner_user_id)
  const { data } = await supabase
    .from("points")
    .select("id,nome,tipo,local,lat,lng,renda_liquida,exposicao,characters(nome,owner_user_id)")
    .not("lat", "is", null)
    .not("lng", "is", null);

  type Row = {
    id: string;
    nome: string;
    tipo: string;
    local: string;
    lat: number;
    lng: number;
    renda_liquida: number;
    exposicao: number;
    characters: { nome: string; owner_user_id: string } | null;
  };

  const points: MapPoint[] = ((data as unknown as Row[]) ?? []).map((r) => ({
    id: r.id,
    nome: r.nome,
    tipo: r.tipo,
    local: r.local,
    lat: r.lat,
    lng: r.lng,
    rendaLiquida: r.renda_liquida,
    exposicao: r.exposicao,
    ownerName: r.characters?.nome ?? "—",
    mine: !!user && r.characters?.owner_user_id === user.id,
  }));

  return { points, isSample: false };
}
