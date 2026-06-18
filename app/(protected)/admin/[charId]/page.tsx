import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/game/rules";
import {
  updateCharacterMain,
  deleteCharacter,
  addPoint,
  deletePoint,
  addFavor,
  deleteFavor,
  addSecurity,
  deleteSecurity,
  addContact,
  deleteContact,
  addFachada,
  deleteFachada,
} from "../actions";

type Row = Record<string, unknown>;

function s(v: unknown) { return String(v ?? ""); }
function n(v: unknown) { return Number(v ?? 0); }

export default async function AdminCharPage({
  params,
}: {
  params: Promise<{ charId: string }>;
}) {
  const { charId } = await params;
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data: charRaw } = await supabase
    .from("characters")
    .select("*")
    .eq("id", charId)
    .maybeSingle();
  if (!charRaw) redirect("/admin");
  const c = charRaw as Row;

  const [{ data: points }, { data: favors }, { data: security }, { data: contacts }, { data: fachadas }] =
    await Promise.all([
      supabase.from("points").select("*").eq("character_id", charId),
      supabase.from("favors").select("*").eq("character_id", charId),
      supabase.from("security_team").select("*").eq("character_id", charId),
      supabase.from("contacts").select("*").eq("character_id", charId),
      supabase.from("fachadas").select("*").eq("character_id", charId),
    ]);

  const updateMain = updateCharacterMain.bind(null, charId);
  const doDelete = deleteCharacter.bind(null, charId);

  return (
    <main className="max-w-4xl mx-auto px-5 py-8 space-y-6">
      {/* cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin" className="kicker text-[0.7rem] hover:text-creme">
            ← Voltar ao Admin
          </Link>
          <h1 className="brand-title text-3xl text-creme mt-1">
            {s(c.nome) || "Sem nome"}
            {!!c.apelido && (
              <span className="text-dourado text-xl ml-3">· {s(c.apelido)}</span>
            )}
          </h1>
          <p className="text-txt-dim text-sm">{s(c.arquetipo)}</p>
        </div>
        <a href="/api/export" className="btn !py-1.5 !px-3 !text-xs shrink-0">
          ⬇️ Export JSON
        </a>
      </div>

      {/* ── Identidade ─────────────────────────────────────────────────────── */}
      <details open className="panel">
        <summary className="cursor-pointer cond uppercase text-xs text-txt-dim select-none list-none flex items-center gap-2">
          <span className="text-dourado">▸</span> Identidade
        </summary>
        <form action={updateMain} className="mt-4 grid sm:grid-cols-2 gap-3">
          <F label="Nome" name="nome" defaultValue={s(c.nome)} required />
          <F label="Apelido" name="apelido" defaultValue={s(c.apelido)} />
          <F label="Arquétipo" name="arquetipo" defaultValue={s(c.arquetipo)} />
          <F label="Idade" name="idade" type="number" defaultValue={c.idade != null ? s(c.idade) : ""} />
          <F label="Origem" name="origem" defaultValue={s(c.origem)} />
          <F label="Residência" name="residencia" defaultValue={s(c.residencia)} />
          <div className="sm:col-span-2">
            <F label="Histórico" name="historico" defaultValue={s(c.historico)} area />
          </div>
          <F label="Ambição" name="ambicao" defaultValue={s(c.ambicao)} />
          <F label="Trauma" name="trauma" defaultValue={s(c.trauma)} />
          <F label="Código" name="codigo" defaultValue={s(c.codigo)} />
          <F label="Vício" name="vicio" defaultValue={s(c.vicio)} />
          <F label="Vantagem" name="vantagem" defaultValue={s(c.vantagem)} />
          <F label="Desvantagem" name="desvantagem" defaultValue={s(c.desvantagem)} />
          {/* hidden passthrough for all numeric fields */}
          <input type="hidden" name="xp" value={n(c.xp)} />
          <input type="hidden" name="mente" value={n(c.mente)} />
          <input type="hidden" name="labia" value={n(c.labia)} />
          <input type="hidden" name="sangue_frio" value={n(c.sangue_frio)} />
          <input type="hidden" name="operacao" value={n(c.operacao)} />
          <input type="hidden" name="contatos" value={n(c.contatos)} />
          <input type="hidden" name="instinto" value={n(c.instinto)} />
          <input type="hidden" name="heat" value={n(c.heat)} />
          <input type="hidden" name="exposicao" value={n(c.exposicao)} />
          <input type="hidden" name="capital_rua" value={n(c.capital_rua)} />
          <input type="hidden" name="pressao" value={n(c.pressao)} />
          <input type="hidden" name="dinheiro_limpo" value={n(c.dinheiro_limpo)} />
          <input type="hidden" name="dinheiro_sujo" value={n(c.dinheiro_sujo)} />
          <input type="hidden" name="dinheiro_transito" value={n(c.dinheiro_transito)} />
          <div className="sm:col-span-2">
            <button type="submit" className="btn primary !py-1.5 !px-4 !text-xs">
              Salvar Identidade
            </button>
          </div>
        </form>
      </details>

      {/* ── Atributos, Métricas & Dinheiro ─────────────────────────────────── */}
      <details open className="panel">
        <summary className="cursor-pointer cond uppercase text-xs text-txt-dim select-none list-none flex items-center gap-2">
          <span className="text-dourado">▸</span> Atributos, Métricas &amp; Dinheiro
        </summary>
        <form action={updateMain} className="mt-4 space-y-5">
          {/* hidden passthrough for text fields */}
          {(["nome","apelido","arquetipo","origem","residencia","historico","ambicao","trauma","codigo","vicio","vantagem","desvantagem"] as const).map((k) => (
            <input key={k} type="hidden" name={k} value={s(c[k])} />
          ))}
          <input type="hidden" name="idade" value={c.idade != null ? s(c.idade) : ""} />

          <div>
            <div className="cond uppercase text-xs text-txt-dim mb-2">Atributos (1–5)</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <N label="Mente" name="mente" defaultValue={n(c.mente)} min={1} max={5} />
              <N label="Lábia" name="labia" defaultValue={n(c.labia)} min={1} max={5} />
              <N label="Sangue Frio" name="sangue_frio" defaultValue={n(c.sangue_frio)} min={1} max={5} />
              <N label="Operação" name="operacao" defaultValue={n(c.operacao)} min={1} max={5} />
              <N label="Contatos" name="contatos" defaultValue={n(c.contatos)} min={1} max={5} />
              <N label="Instinto" name="instinto" defaultValue={n(c.instinto)} min={1} max={5} />
            </div>
            <div className="mt-3">
              <N label="XP" name="xp" defaultValue={n(c.xp)} min={0} />
            </div>
          </div>

          <div>
            <div className="cond uppercase text-xs text-txt-dim mb-2">Métricas (0–10)</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <N label="Heat" name="heat" defaultValue={n(c.heat)} min={0} max={10} />
              <N label="Exposição" name="exposicao" defaultValue={n(c.exposicao)} min={0} max={10} />
              <N label="Capital de Rua" name="capital_rua" defaultValue={n(c.capital_rua)} min={0} max={10} />
              <N label="Pressão" name="pressao" defaultValue={n(c.pressao)} min={0} max={10} />
            </div>
          </div>

          <div>
            <div className="cond uppercase text-xs text-txt-dim mb-2">Dinheiro (R$)</div>
            <div className="grid sm:grid-cols-3 gap-3">
              <N label="Limpo" name="dinheiro_limpo" defaultValue={n(c.dinheiro_limpo)} min={0} />
              <N label="Sujo" name="dinheiro_sujo" defaultValue={n(c.dinheiro_sujo)} min={0} />
              <N label="Em trânsito" name="dinheiro_transito" defaultValue={n(c.dinheiro_transito)} min={0} />
            </div>
          </div>

          <button type="submit" className="btn primary !py-1.5 !px-4 !text-xs">
            Salvar Stats
          </button>
        </form>
      </details>

      {/* ── Pontos ──────────────────────────────────────────────────────────── */}
      <details className="panel">
        <summary className="cursor-pointer cond uppercase text-xs text-txt-dim select-none list-none flex items-center gap-2">
          <span className="text-dourado">▸</span> Pontos de jogo ({points?.length ?? 0})
        </summary>
        <div className="mt-4 space-y-3">
          {points && points.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full cond text-xs">
                <thead>
                  <tr className="text-left text-txt-dim uppercase">
                    <th className="py-1.5 pr-3">Nome</th>
                    <th className="py-1.5 pr-3">Local</th>
                    <th className="py-1.5 pr-3">Tipo</th>
                    <th className="py-1.5 pr-3 text-right">Renda</th>
                    <th className="py-1.5 pr-3 text-center">Expo.</th>
                    <th className="py-1.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {(points as Row[]).map((p) => (
                    <tr key={s(p.id)} className="border-t border-[color:var(--line-soft)]">
                      <td className="py-1.5 pr-3 text-creme">{s(p.nome)}</td>
                      <td className="py-1.5 pr-3 text-txt-dim">{s(p.local)}</td>
                      <td className="py-1.5 pr-3 text-txt-dim">{s(p.tipo)}</td>
                      <td className="py-1.5 pr-3 text-right text-dourado-claro">{brl(n(p.renda_liquida))}</td>
                      <td className="py-1.5 pr-3 text-center text-txt-dim">{n(p.exposicao)}/10</td>
                      <td className="py-1.5">
                        <form action={deletePoint.bind(null, s(p.id), charId)}>
                          <button type="submit" className="text-vermelho-claro text-xs hover:underline">
                            Remover
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <form action={addPoint.bind(null, charId)} className="border-t border-[color:var(--line-soft)] pt-3 grid sm:grid-cols-3 gap-2">
            <F label="Nome" name="nome" />
            <F label="Local" name="local" />
            <F label="Tipo" name="tipo" />
            <N label="Renda líquida R$" name="renda_liquida" defaultValue={0} min={0} />
            <F label="Proteção paga a" name="protecao_paga_a" />
            <N label="Custo proteção R$" name="protecao_custo" defaultValue={0} min={0} />
            <N label="Exposição (0–10)" name="exposicao" defaultValue={0} min={0} max={10} />
            <F label="Região ID (1–12)" name="regiao_id" />
            <F label="Lat (ex: -22.90)" name="lat" />
            <F label="Lng (ex: -43.17)" name="lng" />
            <div>
              <label className="block cond uppercase text-xs text-txt-dim mb-1">Status</label>
              <select name="status" className="field-input w-full">
                <option value="consolidado">Consolidado</option>
                <option value="disputa">Disputa</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button type="submit" className="btn !py-1.5 !px-4 !text-xs">+ Adicionar ponto</button>
            </div>
          </form>
        </div>
      </details>

      {/* ── Favores ─────────────────────────────────────────────────────────── */}
      <details className="panel">
        <summary className="cursor-pointer cond uppercase text-xs text-txt-dim select-none list-none flex items-center gap-2">
          <span className="text-dourado">▸</span> Favores ({favors?.length ?? 0})
        </summary>
        <div className="mt-4 space-y-3">
          {favors && (favors as Row[]).length > 0 && (
            <ul className="space-y-2">
              {(favors as Row[]).map((f) => (
                <li key={s(f.id)} className="flex items-start justify-between gap-3 border-b border-[color:var(--line-soft)] pb-2 text-sm">
                  <div>
                    <span className={f.direcao === "devido" ? "text-vermelho-claro cond uppercase text-xs" : "text-dourado cond uppercase text-xs"}>
                      {f.direcao === "devido" ? "Você deve" : "A receber"}
                    </span>
                    <span className="text-creme ml-2">{s(f.contraparte)}</span>
                    <span className="text-txt-dim ml-1">— {s(f.descricao)}</span>
                    {!!f.grau && <span className="ml-2 text-xs text-dourado-claro border border-[color:var(--line)] rounded px-1">{s(f.grau)}</span>}
                    {n(f.juros) > 0 && <span className="ml-1 text-xs text-vermelho-claro">+{n(f.juros)} juros</span>}
                  </div>
                  <form action={deleteFavor.bind(null, s(f.id), charId)}>
                    <button type="submit" className="text-vermelho-claro text-xs hover:underline shrink-0">Remover</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={addFavor.bind(null, charId)} className="border-t border-[color:var(--line-soft)] pt-3 grid sm:grid-cols-2 gap-2">
            <div>
              <label className="block cond uppercase text-xs text-txt-dim mb-1">Direção</label>
              <select name="direcao" className="field-input w-full">
                <option value="devido">Você deve</option>
                <option value="a_receber">A receber</option>
              </select>
            </div>
            <F label="Contraparte" name="contraparte" />
            <F label="Descrição" name="descricao" />
            <div>
              <label className="block cond uppercase text-xs text-txt-dim mb-1">Grau</label>
              <select name="grau" className="field-input w-full">
                <option value="">—</option>
                <option value="pequeno">Pequeno</option>
                <option value="medio">Médio</option>
                <option value="grande">Grande</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
            <N label="Juros" name="juros" defaultValue={0} min={0} />
            <div className="sm:col-span-2">
              <button type="submit" className="btn !py-1.5 !px-4 !text-xs">+ Adicionar favor</button>
            </div>
          </form>
        </div>
      </details>

      {/* ── Segurança ───────────────────────────────────────────────────────── */}
      <details className="panel">
        <summary className="cursor-pointer cond uppercase text-xs text-txt-dim select-none list-none flex items-center gap-2">
          <span className="text-dourado">▸</span> Equipe de segurança ({security?.length ?? 0})
        </summary>
        <div className="mt-4 space-y-3">
          {security && (security as Row[]).length > 0 && (
            <ul className="space-y-2">
              {(security as Row[]).map((u) => (
                <li key={s(u.id)} className="flex items-center justify-between gap-3 border-b border-[color:var(--line-soft)] pb-2 text-sm">
                  <div>
                    <span className="text-creme">{s(u.tipo)}</span>
                    {n(u.qtd) > 1 && <span className="text-txt-dim ml-1">×{n(u.qtd)}</span>}
                    <span className="text-txt-dim ml-2">— Leal. {n(u.lealdade)}/10</span>
                    <span className="text-txt-dim ml-2">{brl(n(u.custo_mensal))}/mês</span>
                  </div>
                  <form action={deleteSecurity.bind(null, s(u.id), charId)}>
                    <button type="submit" className="text-vermelho-claro text-xs hover:underline">Remover</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={addSecurity.bind(null, charId)} className="border-t border-[color:var(--line-soft)] pt-3 grid sm:grid-cols-2 gap-2">
            <F label="Tipo" name="tipo" />
            <N label="Quantidade" name="qtd" defaultValue={1} min={1} />
            <N label="Lealdade (0–10)" name="lealdade" defaultValue={5} min={0} max={10} />
            <N label="Custo mensal R$" name="custo_mensal" defaultValue={0} min={0} />
            <div className="sm:col-span-2">
              <button type="submit" className="btn !py-1.5 !px-4 !text-xs">+ Adicionar segurança</button>
            </div>
          </form>
        </div>
      </details>

      {/* ── Contatos ────────────────────────────────────────────────────────── */}
      <details className="panel">
        <summary className="cursor-pointer cond uppercase text-xs text-txt-dim select-none list-none flex items-center gap-2">
          <span className="text-dourado">▸</span> Contatos ({contacts?.length ?? 0})
        </summary>
        <div className="mt-4 space-y-3">
          {contacts && (contacts as Row[]).length > 0 && (
            <ul className="space-y-2">
              {(contacts as Row[]).map((ct) => (
                <li key={s(ct.id)} className="flex items-center justify-between gap-3 border-b border-[color:var(--line-soft)] pb-2 text-sm">
                  <div>
                    <span className="text-creme">{s(ct.nome)}</span>
                    <span className="text-txt-dim ml-2">· {s(ct.funcao)}</span>
                    <span className="text-txt-dim ml-2">Leal. {n(ct.lealdade)}/10</span>
                    <span className="text-txt-dim ml-2">{brl(n(ct.custo_mensal))}/mês</span>
                  </div>
                  <form action={deleteContact.bind(null, s(ct.id), charId)}>
                    <button type="submit" className="text-vermelho-claro text-xs hover:underline">Remover</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={addContact.bind(null, charId)} className="border-t border-[color:var(--line-soft)] pt-3 grid sm:grid-cols-2 gap-2">
            <F label="Nome" name="nome" />
            <F label="Função" name="funcao" />
            <F label="Serviço" name="servico" />
            <N label="Lealdade (0–10)" name="lealdade" defaultValue={5} min={0} max={10} />
            <N label="Custo mensal R$" name="custo_mensal" defaultValue={0} min={0} />
            <div className="sm:col-span-2">
              <button type="submit" className="btn !py-1.5 !px-4 !text-xs">+ Adicionar contato</button>
            </div>
          </form>
        </div>
      </details>

      {/* ── Fachadas ─────────────────────────────────────────────────────────── */}
      <details className="panel">
        <summary className="cursor-pointer cond uppercase text-xs text-txt-dim select-none list-none flex items-center gap-2">
          <span className="text-dourado">▸</span> Fachadas ({fachadas?.length ?? 0})
        </summary>
        <div className="mt-4 space-y-3">
          {fachadas && (fachadas as Row[]).length > 0 && (
            <ul className="space-y-2">
              {(fachadas as Row[]).map((fa) => (
                <li key={s(fa.id)} className="flex items-center justify-between gap-3 border-b border-[color:var(--line-soft)] pb-2 text-sm">
                  <div>
                    <span className="text-creme">{s(fa.nome)}</span>
                    <span className="text-txt-dim ml-2">· {s(fa.tipo)}</span>
                    <span className="text-txt-dim ml-2">cap. {brl(n(fa.capacidade))}</span>
                    <span className="text-txt-dim ml-2">taxa {n(fa.taxa)}%</span>
                    <span className="text-txt-dim ml-2">{brl(n(fa.custo_mensal))}/mês</span>
                  </div>
                  <form action={deleteFachada.bind(null, s(fa.id), charId)}>
                    <button type="submit" className="text-vermelho-claro text-xs hover:underline">Remover</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={addFachada.bind(null, charId)} className="border-t border-[color:var(--line-soft)] pt-3 grid sm:grid-cols-2 gap-2">
            <F label="Nome" name="nome" />
            <F label="Tipo" name="tipo" />
            <N label="Capacidade R$" name="capacidade" defaultValue={0} min={0} />
            <F label="Taxa (%)" name="taxa" />
            <N label="Custo mensal R$" name="custo_mensal" defaultValue={0} min={0} />
            <div className="sm:col-span-2">
              <button type="submit" className="btn !py-1.5 !px-4 !text-xs">+ Adicionar fachada</button>
            </div>
          </form>
        </div>
      </details>

      {/* ── Zona de perigo ──────────────────────────────────────────────────── */}
      <section className="panel border border-[color:var(--vermelho)] border-opacity-40">
        <h2 className="cond uppercase text-xs text-vermelho-claro mb-3">Zona de perigo</h2>
        <form action={doDelete}>
          <button
            type="submit"
            className="btn !py-1.5 !px-4 !text-xs !bg-[color:var(--vermelho)] !border-[color:var(--vermelho)] text-creme"
          >
            Apagar ficha permanentemente
          </button>
        </form>
      </section>
    </main>
  );
}

// ── Componentes auxiliares ────────────────────────────────────────────────────

function F({
  label,
  name,
  defaultValue = "",
  required,
  area,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  area?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block cond uppercase text-xs text-txt-dim mb-1">{label}</label>
      {area ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className="field-input w-full resize-none" />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} required={required} className="field-input w-full" />
      )}
    </div>
  );
}

function N({
  label,
  name,
  defaultValue,
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block cond uppercase text-xs text-txt-dim mb-1">{label}</label>
      <input
        name={name}
        type="number"
        defaultValue={defaultValue}
        min={min}
        max={max}
        className="field-input w-full"
      />
    </div>
  );
}
