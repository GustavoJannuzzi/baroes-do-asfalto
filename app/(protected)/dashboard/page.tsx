import Link from "next/link";
import { getCharacterForCurrentUser } from "@/lib/characters";
import { computeFlags, monthlyBalance } from "@/lib/rules/flags";
import { ATTR_LABELS, FAVOR_LABEL, brl, exposicaoStatus, heatStatus, pressaoStatus } from "@/lib/game/rules";
import { Card, FlagList, MetricBar, Pips } from "@/components/dashboard/ui";
import { QuickEditor } from "@/components/dashboard/quick-editor";

export default async function DashboardPage() {
  const { character: c, isSample } = await getCharacterForCurrentUser();
  const flags = computeFlags(c);
  const bal = monthlyBalance(c);

  const devidos = c.favors.filter((f) => f.direcao === "devido");
  const aReceber = c.favors.filter((f) => f.direcao === "a_receber");

  return (
    <main className="max-w-6xl mx-auto px-5 py-8">
      {/* cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="kicker text-[0.7rem]">Dashboard de Gameplay</span>
          <h1 className="brand-title text-4xl text-creme mt-1">
            {c.nome || "Sem nome"}{" "}
            {c.apelido && <span className="text-dourado text-2xl">· {c.apelido}</span>}
          </h1>
          <p className="text-txt-dim text-sm">{c.arquetipo}</p>
        </div>
        <Link href="/dashboard/mapa" className="btn !py-2 !px-4 !text-xs">
          🗺️ Ver mapa do território
        </Link>
      </div>

      {isSample && (
        <div className="panel mt-4 p-3 border-l-4 border-l-[color:var(--dourado)] text-sm text-txt-dim">
          🧪 <strong className="text-creme">Modo demonstração</strong> — exibindo um personagem de
          exemplo. Conecte o Supabase e crie sua ficha para ver os seus dados reais.
        </div>
      )}

      {/* alertas */}
      <h2 className="brand-title text-creme text-lg mt-7 mb-3 flex items-center gap-2">
        🚩 Alertas das regras
        <span className="mono text-txt-dim text-xs font-normal">({flags.length})</span>
      </h2>
      <FlagList flags={flags} />

      <QuickEditor c={c} isSample={isSample} />

      {/* grid principal */}
      <div className="grid lg:grid-cols-3 gap-5 mt-7">
        {/* métricas */}
        <Card title="As 5 métricas" hint="escala 0–10">
          <MetricBar metric="heat" label="Heat" value={c.metrics.heat} status={heatStatus(c.metrics.heat)} />
          <MetricBar
            metric="exposicao"
            label="Exposição"
            value={c.metrics.exposicao}
            status={exposicaoStatus(c.metrics.exposicao)}
          />
          <MetricBar
            metric="capital_rua"
            label="Capital de Rua"
            value={c.metrics.capitalRua}
            status={`+${Math.floor(c.metrics.capitalRua / 2)} dado(s) sociais no submundo`}
          />
          <MetricBar
            metric="pressao"
            label="Pressão"
            value={c.metrics.pressao}
            status={pressaoStatus(c.metrics.pressao)}
          />
        </Card>

        {/* dinheiro */}
        <Card title="Dinheiro" hint="R$">
          <div className="space-y-2">
            <Money label="Limpo" value={c.money.limpo} accent="var(--verde)" />
            <Money label="Sujo" value={c.money.sujo} accent="var(--vermelho-claro)" />
            <Money label="Em trânsito (lavando)" value={c.money.transito} accent="var(--azul)" />
          </div>
          <div className="border-t border-[color:var(--line-soft)] mt-3 pt-3 flex items-baseline justify-between">
            <span className="cond uppercase text-xs text-txt-dim">Total</span>
            <span className="brand-title text-dourado-claro text-xl">
              {brl(c.money.limpo + c.money.sujo + c.money.transito)}
            </span>
          </div>
        </Card>

        {/* balanço mensal */}
        <Card title="Balanço do mês" hint="fase econômica">
          <Line label="Renda dos pontos" value={bal.income} />
          <div className="text-txt-dim text-xs mt-2 mb-1 cond uppercase">Obrigações</div>
          <Line label="Proteção" value={-bal.obrig.protecao} small />
          <Line label="Equipe de segurança" value={-bal.obrig.seguranca} small />
          <Line label="Contatos" value={-bal.obrig.contatos} small />
          <Line label="Fachadas" value={-bal.obrig.fachadas} small />
          <div className="border-t border-[color:var(--line-soft)] mt-3 pt-3">
            <Line label="Lucro líquido" value={bal.net} bold />
          </div>
        </Card>

        {/* atributos */}
        <Card title="Atributos" hint="1–5">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {ATTR_LABELS.map((a) => (
              <div key={a.key} className="flex items-center justify-between">
                <span className="cond uppercase text-xs text-txt-dim">{a.label}</span>
                <Pips value={c.attrs[a.key]} />
              </div>
            ))}
          </div>
          <div className="border-t border-[color:var(--line-soft)] mt-3 pt-3 text-xs text-txt-dim">
            <span className="cond uppercase">XP</span>{" "}
            <span className="text-creme">{c.xp}</span>
          </div>
        </Card>

        {/* favores */}
        <Card title="Favores" className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <div className="cond uppercase text-xs text-vermelho-claro mb-2">Você deve</div>
              {devidos.length ? (
                <ul className="space-y-2">
                  {devidos.map((f) => (
                    <li key={f.id} className="text-sm">
                      <span className="text-creme">{f.contraparte}</span>{" "}
                      <span className="text-txt-dim">— {f.descricao}</span>
                      <span className="ml-2 text-[0.66rem] uppercase cond border border-[color:var(--line)] rounded px-1.5 py-0.5 text-dourado-claro">
                        {f.grau ? FAVOR_LABEL[f.grau] : "?"}
                      </span>
                      {f.juros > 0 && (
                        <span className="ml-1.5 text-[0.66rem] uppercase cond text-vermelho-claro">
                          +{f.juros} juros
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-txt-dim text-sm">Nada em aberto.</p>
              )}
            </div>
            <div>
              <div className="cond uppercase text-xs text-dourado mb-2">A receber</div>
              {aReceber.length ? (
                <ul className="space-y-2">
                  {aReceber.map((f) => (
                    <li key={f.id} className="text-sm">
                      <span className="text-creme">{f.contraparte}</span>{" "}
                      <span className="text-txt-dim">— {f.descricao}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-txt-dim text-sm">Ninguém te deve (por enquanto).</p>
              )}
            </div>
          </div>
        </Card>

        {/* segurança + contatos */}
        <Card title="Equipe & contatos">
          <div className="cond uppercase text-xs text-txt-dim mb-1">Segurança</div>
          <ul className="space-y-1.5 mb-3">
            {c.security.map((u) => (
              <li key={u.id} className="text-sm flex items-center justify-between gap-2">
                <span className="text-creme">
                  {u.tipo} {u.qtd > 1 && <span className="text-txt-dim">×{u.qtd}</span>}
                </span>
                <span className={`text-xs ${u.lealdade <= 2 ? "text-vermelho-claro" : "text-txt-dim"}`}>
                  leal. {u.lealdade}/10
                </span>
              </li>
            ))}
          </ul>
          <div className="cond uppercase text-xs text-txt-dim mb-1">Contatos</div>
          <ul className="space-y-1.5">
            {c.contacts.map((u) => (
              <li key={u.id} className="text-sm flex items-center justify-between gap-2">
                <span className="text-creme">
                  {u.nome} <span className="text-txt-dim">· {u.funcao}</span>
                </span>
                <span className={`text-xs ${u.lealdade <= 2 ? "text-vermelho-claro" : "text-txt-dim"}`}>
                  leal. {u.lealdade}/10
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* pontos */}
      <Card title="Pontos de jogo do bicho" hint={`${c.points.length} ponto(s)`} className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full cond text-sm">
            <thead>
              <tr className="text-left text-txt-dim uppercase text-xs">
                <th className="py-2 pr-3">Ponto</th>
                <th className="py-2 pr-3">Local</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3 text-right">Renda</th>
                <th className="py-2 pr-3 text-right">Proteção</th>
                <th className="py-2 pr-3 text-center">Expo.</th>
              </tr>
            </thead>
            <tbody>
              {c.points.map((p) => (
                <tr key={p.id} className="border-t border-[color:var(--line-soft)]">
                  <td className="py-2 pr-3 text-creme">{p.nome}</td>
                  <td className="py-2 pr-3 text-txt-dim">{p.local}</td>
                  <td className="py-2 pr-3 text-txt-dim">{p.tipo}</td>
                  <td className="py-2 pr-3 text-right text-dourado-claro">{brl(p.rendaLiquida)}</td>
                  <td className="py-2 pr-3 text-right text-txt-dim">{brl(p.protecaoCusto)}</td>
                  <td className="py-2 pr-3 text-center">
                    <span className={p.exposicao >= 7 ? "text-vermelho-claro" : "text-txt-dim"}>
                      {p.exposicao}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}

function Money({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex items-center justify-between border-l-2 pl-3" style={{ borderColor: accent }}>
      <span className="cond uppercase text-xs text-txt-dim">{label}</span>
      <span className="brand-title text-creme">{brl(value)}</span>
    </div>
  );
}

function Line({
  label,
  value,
  small,
  bold,
}: {
  label: string;
  value: number;
  small?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={`cond ${small ? "text-xs text-txt-dim" : "text-sm text-txt-dim"}`}>{label}</span>
      <span
        className={`${bold ? "brand-title text-lg" : small ? "text-xs" : "text-sm"} ${
          value < 0 ? "text-vermelho-claro" : "text-dourado-claro"
        }`}
      >
        {brl(value)}
      </span>
    </div>
  );
}
