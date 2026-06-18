import { updateQuick } from "@/app/(protected)/dashboard/actions";
import type { Character } from "@/lib/game/types";

export function QuickEditor({ c, isSample }: { c: Character; isSample: boolean }) {
  return (
    <details className="panel p-5 mt-5">
      <summary className="cursor-pointer brand-title text-creme text-base uppercase tracking-wide flex items-center gap-2">
        ✏️ Atualização rápida
        <span className="mono text-txt-dim text-[0.62rem] font-normal">dinheiro & métricas</span>
      </summary>

      {isSample && (
        <p className="text-txt-dim text-sm mt-3 border-l-2 border-l-[color:var(--dourado)] pl-3">
          No modo demonstração isto não salva. Com o Supabase conectado e sua ficha criada, a edição
          grava de verdade.
        </p>
      )}

      <form action={updateQuick} className="mt-4 grid sm:grid-cols-3 gap-4">
        <Num name="limpo" label="Dinheiro limpo" value={c.money.limpo} />
        <Num name="sujo" label="Dinheiro sujo" value={c.money.sujo} />
        <Num name="transito" label="Em trânsito" value={c.money.transito} />
        <Num name="heat" label="Heat (0–10)" value={c.metrics.heat} max={10} />
        <Num name="exposicao" label="Exposição (0–10)" value={c.metrics.exposicao} max={10} />
        <Num name="capital" label="Capital de Rua (0–10)" value={c.metrics.capitalRua} max={10} />
        <Num name="pressao" label="Pressão (0–10)" value={c.metrics.pressao} max={10} />
        <div className="sm:col-span-3">
          <button type="submit" className="btn primary" disabled={isSample}>
            Salvar
          </button>
        </div>
      </form>
    </details>
  );
}

function Num({
  name,
  label,
  value,
  max,
}: {
  name: string;
  label: string;
  value: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        type="number"
        name={name}
        defaultValue={value}
        min={0}
        max={max}
        className="field-input mt-1"
      />
    </label>
  );
}
