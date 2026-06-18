import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "content", "livro");

export type LivroDoc = {
  id: string; // "1.1"
  slug: string; // "1-1"
  title: string; // "Regras Fundamentais"
  chapterId: string; // "1"
  chapterTitle: string; // "Documento Base do Sistema"
  file: string; // caminho relativo a ROOT
};
export type LivroChapter = { id: string; title: string; docs: LivroDoc[] };

function parseFolder(name: string) {
  const m = name.match(/^(\d+)\.\s*(.+)$/);
  return { id: m?.[1] ?? name, title: m?.[2] ?? name };
}
function parseFile(name: string) {
  const base = name.replace(/\.md$/i, "");
  const m = base.match(/^(\d+\.\d+)\.\s*(.+)$/);
  return { id: m?.[1] ?? base, title: m?.[2] ?? base };
}

export function getChapters(): LivroChapter[] {
  if (!fs.existsSync(ROOT)) return [];
  const folders = fs
    .readdirSync(ROOT)
    .filter((f) => fs.statSync(path.join(ROOT, f)).isDirectory());

  const chapters = folders.map((folder) => {
    const fp = parseFolder(folder);
    const docs = fs
      .readdirSync(path.join(ROOT, folder))
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .map((file) => {
        const pf = parseFile(file);
        return {
          id: pf.id,
          slug: pf.id.replace(/\./g, "-"),
          title: pf.title,
          chapterId: fp.id,
          chapterTitle: fp.title,
          file: path.join(folder, file),
        } as LivroDoc;
      })
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    return { id: fp.id, title: fp.title, docs } as LivroChapter;
  });

  return chapters.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true })
  );
}

export function getDoc(slug: string): { doc: LivroDoc; content: string } | null {
  for (const ch of getChapters()) {
    for (const d of ch.docs) {
      if (d.slug === slug) {
        const content = fs.readFileSync(path.join(ROOT, d.file), "utf8");
        return { doc: d, content };
      }
    }
  }
  return null;
}

export function allDocs(): LivroDoc[] {
  return getChapters().flatMap((c) => c.docs);
}
