import Link from "next/link";
import { PortalHeader } from "@/components/portal-header";
import { KIT_RESOURCES } from "@/lib/kit-resources";

const SIZE_COLORS: Record<string, string> = {
  A3: "text-[#e06c3a] border-[#e06c3a]/40",
  A4: "text-dourado border-[color:var(--dourado)]/40",
  A4L: "text-[#7ec8a4] border-[#7ec8a4]/40",
  A5: "text-[#9b8ecf] border-[#9b8ecf]/40",
};

export const metadata = { title: "Kit Físico — Barões do Asfalto" };

export default function KitPage() {
  return (
    <>
      <PortalHeader />
      <main className="relative z-10 min-h-screen px-5 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="kicker text-[0.7rem]">Impressão · PDF · Mesa</span>
            <h1 className="brand-title text-4xl md:text-5xl text-creme mt-1">
              Kit <span className="text-dourado">Físico</span>
            </h1>
            <p className="text-txt-dim text-sm mt-2 max-w-xl">
              Todos os componentes de mesa prontos para imprimir. Clique em qualquer
              peça para visualizar; use o botão de impressão para gerar o PDF no
              tamanho correto.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KIT_RESOURCES.map((r) => {
              const sizeColor = SIZE_COLORS[r.size] ?? SIZE_COLORS.A4;
              return (
                <div
                  key={r.slug}
                  className="panel p-5 flex flex-col gap-3 group hover:border-[color:var(--dourado)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{r.icon}</span>
                    <span
                      className={`text-[0.6rem] uppercase tracking-wider cond border rounded-full px-2 py-0.5 mt-0.5 ${sizeColor}`}
                    >
                      {r.sizeLabel}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="brand-title text-base text-creme group-hover:text-dourado-claro">
                      {r.name}
                    </h2>
                    <p className="text-txt-dim text-xs mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-[color:var(--line)]">
                    <Link
                      href={`/kit/${r.slug}`}
                      className="flex-1 btn !py-1.5 !text-xs text-center"
                    >
                      Visualizar
                    </Link>
                    <a
                      href={`/kit-fisico/${encodeURIComponent(r.printFile ?? r.file)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn primary !py-1.5 !text-xs text-center"
                    >
                      🖨️ Imprimir
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mono text-txt-dim text-xs mt-10 opacity-60">
            {KIT_RESOURCES.length} peças · Abra "Imprimir" e selecione "Salvar como PDF" para exportar
          </p>
        </div>
      </main>
    </>
  );
}
