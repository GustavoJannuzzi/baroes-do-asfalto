import { notFound } from "next/navigation";
import { getDoc } from "@/lib/livro";
import { Markdown } from "@/components/markdown";

export default async function LivroDocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const found = getDoc(slug?.[0] ?? "");
  if (!found) notFound();
  const { doc, content } = found;

  return (
    <article>
      <div className="cond uppercase tracking-wide text-vermelho-claro text-xs">
        Capítulo {doc.chapterId} · {doc.chapterTitle}
      </div>
      <div className="mono text-txt-dim text-xs mt-1">Seção {doc.id}</div>
      <Markdown content={content} />
    </article>
  );
}
