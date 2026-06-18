import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/game/rules";
import { createCharacter } from "./actions";

export default async function AdminPage() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data: characters } = await supabase
    .from("characters")
    .select("id, nome, apelido, arquetipo, heat, exposicao, pressao, dinheiro_sujo")
    .order("created_at");

  return (
    <main className="max-w-5xl mx-auto px-5 py-8">
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <span className="kicker text-[0.7rem]">Painel de controle</span>
          <h1 className="brand-title text-4xl text-creme mt-1">Admin</h1>
        </div>
        <a href="/api/export" className="btn !py-2 !px-4 !text-xs">
          ⬇️ Exportar JSON
        </a>
      </div>

      {/* Lista de personagens */}
      <section className="panel mb-8">
        <h2 className="cond uppercase text-xs text-txt-dim mb-4">
          Personagens ({characters?.length ?? 0})
        </h2>
        {characters && characters.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full cond text-sm">
              <thead>
                <tr className="text-left text-txt-dim uppercase text-xs">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Arquétipo</th>
                  <th className="py-2 pr-4 text-center">Heat</th>
                  <th className="py-2 pr-4 text-center">Expo.</th>
                  <th className="py-2 pr-4 text-right">$ Sujo</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {characters.map((c) => (
                  <tr key={c.id} className="border-t border-[color:var(--line-soft)]">
                    <td className="py-2 pr-4">
                      <span className="text-creme">{c.nome || "Sem nome"}</span>
                      {c.apelido && (
                        <span className="text-txt-dim ml-2">· {c.apelido}</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-txt-dim">{c.arquetipo || "—"}</td>
                    <td className="py-2 pr-4 text-center">
                      <span className={c.heat >= 7 ? "text-vermelho-claro" : "text-txt-dim"}>
                        {c.heat}/10
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-center">
                      <span className={c.exposicao >= 8 ? "text-vermelho-claro" : "text-txt-dim"}>
                        {c.exposicao}/10
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-right text-dourado-claro">
                      {brl(c.dinheiro_sujo)}
                    </td>
                    <td className="py-2">
                      <Link href={`/admin/${c.id}`} className="btn !py-1 !px-3 !text-xs">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-txt-dim text-sm">Nenhum personagem cadastrado.</p>
        )}
      </section>

      {/* Criar novo personagem */}
      <section className="panel">
        <h2 className="cond uppercase text-xs text-txt-dim mb-4">Nova ficha</h2>
        <form action={createCharacter} className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block cond uppercase text-xs text-txt-dim mb-1">
              Nome *
            </label>
            <input
              name="nome"
              required
              className="field-input w-full"
              placeholder="Nome do personagem"
            />
          </div>
          <div>
            <label className="block cond uppercase text-xs text-txt-dim mb-1">
              Apelido
            </label>
            <input name="apelido" className="field-input w-full" placeholder="Apelido" />
          </div>
          <div>
            <label className="block cond uppercase text-xs text-txt-dim mb-1">
              Arquétipo
            </label>
            <input
              name="arquetipo"
              className="field-input w-full"
              placeholder="Ex: O Contador Sujo"
            />
          </div>
          <div>
            <label className="block cond uppercase text-xs text-txt-dim mb-1">
              UID do usuário (opcional)
            </label>
            <input
              name="owner_user_id"
              className="field-input w-full font-mono text-xs"
              placeholder="UUID do usuário no Supabase Auth"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn primary !py-2 !px-5">
              Criar Ficha →
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
