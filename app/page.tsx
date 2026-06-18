import Link from "next/link";
import { getProfile, getSessionUser } from "@/lib/auth";

const PORTALS = [
  {
    href: "/apresentacao/index.html",
    tag: "Pública",
    icon: "★",
    title: "Apresentação",
    desc: "A proposta do jogo: conceitos, mecânicas, território, favores e combate. A porta de entrada para novos jogadores.",
  },
  {
    href: "/livro",
    tag: "Login",
    icon: "📖",
    title: "Livro Digital",
    desc: "O livro completo do sistema em formato wiki — regras, economia, geografia, facções e o livro do mestre.",
  },
  {
    href: "/dashboard",
    tag: "Login",
    icon: "🎲",
    title: "Dashboard de Gameplay",
    desc: "Sua ficha viva: atributos, dinheiro, pontos, favores e segurança — com alertas das regras e o mapa do território.",
  },
];

export default async function Home() {
  const user = await getSessionUser();
  const profile = user ? await getProfile() : null;

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center px-5 py-16">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <span className="kicker text-[0.72rem]">RPG de mesa · Rio de Janeiro · Sistema d6</span>
          {user ? (
            <form action="/auth/signout" method="post" className="flex items-center gap-3 text-sm">
              <span className="text-txt-dim cond">
                {profile?.display_name || user.email}
                {profile?.role === "admin" && (
                  <span className="ml-1.5 text-[0.6rem] uppercase tracking-wide text-dourado border border-[color:var(--line)] rounded px-1.5 py-0.5">
                    admin
                  </span>
                )}
              </span>
              <button className="btn !py-1.5 !px-3 !text-xs">Sair</button>
            </form>
          ) : (
            <Link href="/login" className="btn primary !py-1.5 !px-4 !text-xs">
              Entrar
            </Link>
          )}
        </div>

        <h1 className="brand-title text-5xl md:text-7xl mt-6 text-creme">
          Barões <span className="text-dourado">do Asfalto</span>
        </h1>
        <p className="eleg text-txt-dim text-lg mt-3 max-w-2xl">
          Jogo do bicho, dinheiro sujo e poder no Rio de Janeiro. Escolha um portal.
        </p>

        <div className="grid gap-5 md:grid-cols-3 mt-10">
          {PORTALS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="panel p-6 group hover:border-[color:var(--dourado)] transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{p.icon}</span>
                <span className="text-[0.6rem] uppercase tracking-wider cond text-txt-dim border border-[color:var(--line-soft)] rounded-full px-2 py-0.5">
                  {p.tag}
                </span>
              </div>
              <h2 className="brand-title text-xl text-creme mt-4 group-hover:text-dourado-claro">
                {p.title}
              </h2>
              <p className="text-txt-dim text-sm mt-2 leading-relaxed flex-1">{p.desc}</p>
              <span className="cond uppercase tracking-wide text-dourado-claro text-sm mt-4">
                Entrar ▸
              </span>
            </Link>
          ))}
        </div>

        <p className="mono text-txt-dim text-xs mt-12 opacity-70">
          Nº 041892 · Série VB · Q.G. dos Barões
        </p>
      </div>
    </main>
  );
}
