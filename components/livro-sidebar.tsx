"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LivroChapter } from "@/lib/livro";

export function LivroSidebar({ chapters }: { chapters: LivroChapter[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="btn !py-1.5 !px-3 !text-xs md:hidden mb-3"
        onClick={() => setOpen((o) => !o)}
      >
        ☰ Capítulos
      </button>
      <nav
        className={`${open ? "block" : "hidden"} md:block text-sm`}
        aria-label="Sumário do livro"
      >
        <Link
          href="/livro"
          className={`block cond uppercase tracking-wide text-xs px-2 py-1.5 rounded ${
            pathname === "/livro" ? "text-dourado" : "text-txt-dim hover:text-creme"
          }`}
        >
          ◆ Início
        </Link>
        {chapters.map((ch) => (
          <div key={ch.id} className="mt-3">
            <div className="cond uppercase tracking-wide text-[0.68rem] text-vermelho-claro px-2">
              {ch.id}. {ch.title}
            </div>
            <ul className="mt-1">
              {ch.docs.map((d) => {
                const href = `/livro/${d.slug}`;
                const active = pathname === href;
                return (
                  <li key={d.slug}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`block px-2 py-1 rounded text-[0.86rem] leading-snug ${
                        active
                          ? "bg-[rgba(201,162,39,.12)] text-dourado-claro"
                          : "text-txt-dim hover:text-creme hover:bg-[rgba(201,162,39,.06)]"
                      }`}
                    >
                      <span className="mono text-[0.7rem] opacity-70 mr-1.5">{d.id}</span>
                      {d.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
