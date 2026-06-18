import Link from "next/link";
import { getChapters } from "@/lib/livro";

export default function LivroHome() {
  const chapters = getChapters();
  return (
    <article>
      <span className="kicker text-[0.7rem]">Livro Digital</span>
      <h1 className="brand-title text-4xl text-creme mt-2">O Sistema, na íntegra</h1>
      <p className="eleg text-txt-dim text-lg mt-2 max-w-2xl">
        Todo o livro de Barões do Asfalto — regras, economia, geografia, favores,
        combate e o livro do mestre. Navegue pelo sumário.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {chapters.map((ch) => (
          <div key={ch.id} className="panel p-5">
            <div className="cond uppercase tracking-wide text-vermelho-claro text-xs">
              Capítulo {ch.id}
            </div>
            <h2 className="brand-title text-lg text-creme mt-1">{ch.title}</h2>
            <ul className="mt-3 space-y-1">
              {ch.docs.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/livro/${d.slug}`}
                    className="text-sm text-txt-dim hover:text-dourado-claro"
                  >
                    <span className="mono text-xs opacity-70 mr-1.5">{d.id}</span>
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
