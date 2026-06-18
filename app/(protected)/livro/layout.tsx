import { getChapters } from "@/lib/livro";
import { LivroSidebar } from "@/components/livro-sidebar";

export default function LivroLayout({ children }: { children: React.ReactNode }) {
  const chapters = getChapters();
  return (
    <div className="max-w-6xl mx-auto px-5 py-8 grid md:grid-cols-[260px_1fr] gap-8">
      <aside className="md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-auto md:pr-2 md:border-r md:border-[color:var(--line-soft)]">
        <LivroSidebar chapters={chapters} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
