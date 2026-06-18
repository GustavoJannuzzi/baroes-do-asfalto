import Link from "next/link";
import { getAllMapPoints } from "@/lib/points";
import { TerritoryMap } from "@/components/dashboard/territory-map";
import { brl } from "@/lib/game/rules";

export default async function MapaPage() {
  const { points, isSample } = await getAllMapPoints();
  const meus = points.filter((p) => p.mine);
  const outros = points.filter((p) => !p.mine);
  const rendaMinha = meus.reduce((s, p) => s + p.rendaLiquida, 0);

  return (
    <main className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="kicker text-[0.7rem]">Dashboard · Território</span>
          <h1 className="brand-title text-4xl text-creme mt-1">O Mapa do Império</h1>
          <p className="text-txt-dim text-sm">
            Seus pontos e os dos outros jogadores nas 12 regiões do Rio.
          </p>
        </div>
        <Link href="/dashboard" className="btn !py-1.5 !px-4 !text-xs">
          ← Voltar ao painel
        </Link>
      </div>

      {isSample && (
        <div className="panel mt-4 p-3 border-l-4 border-l-[color:var(--dourado)] text-sm text-txt-dim">
          🧪 <strong className="text-creme">Modo demonstração</strong> — pontos de exemplo.
          Com o Supabase conectado, mostra os pontos reais de todos os jogadores.
        </div>
      )}

      {/* legenda + resumo */}
      <div className="flex flex-wrap items-center gap-4 mt-5 mb-3 text-sm">
        <span className="flex items-center gap-2">
          <i className="inline-block w-4 h-4 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%,#f0d27a,#bf9a23)" }} />
          <span className="text-creme">Seus pontos</span>
          <span className="text-txt-dim">({meus.length})</span>
        </span>
        <span className="flex items-center gap-2">
          <i className="inline-block w-4 h-4 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%,#9a9a9a,#555)" }} />
          <span className="text-creme">Outros jogadores</span>
          <span className="text-txt-dim">({outros.length})</span>
        </span>
        <span className="ml-auto text-txt-dim">
          Sua renda mapeada: <span className="text-dourado-claro">{brl(rendaMinha)}/mês</span>
        </span>
      </div>

      <TerritoryMap points={points} />

      <p className="mono text-txt-dim text-xs mt-4 opacity-70">
        Passe o mouse para o nome e o dono; clique no ponto para os detalhes. Use a roda do mouse para
        dar zoom — as fronteiras (Lagos, Costa Verde) aparecem ao afastar.
      </p>
    </main>
  );
}
