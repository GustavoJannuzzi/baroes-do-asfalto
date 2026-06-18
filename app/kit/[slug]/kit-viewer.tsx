"use client";

import { useRef } from "react";
import Link from "next/link";
import type { KitResource } from "@/lib/kit-resources";

const SIZE_COLORS: Record<string, string> = {
  A3: "text-[#e06c3a] border-[#e06c3a]/40 bg-[#e06c3a]/5",
  A4: "text-dourado border-[color:var(--dourado)]/40 bg-[rgba(201,162,39,.06)]",
  A4L: "text-[#7ec8a4] border-[#7ec8a4]/40 bg-[#7ec8a4]/5",
  A5: "text-[#9b8ecf] border-[#9b8ecf]/40 bg-[#9b8ecf]/5",
};

export function KitViewer({ resource }: { resource: KitResource }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sizeColor = SIZE_COLORS[resource.size] ?? SIZE_COLORS.A4;
  const fileUrl = `/kit-fisico/${encodeURIComponent(resource.printFile ?? resource.file)}`;
  const previewUrl = `/kit-fisico/${encodeURIComponent(resource.file)}`;

  function handlePrint() {
    iframeRef.current?.contentWindow?.print();
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[color:var(--line)] bg-[rgba(10,26,18,.97)] flex-shrink-0">
        <Link
          href="/kit"
          className="cond text-xs uppercase tracking-wide text-txt-dim hover:text-creme flex items-center gap-1"
        >
          ← Kit
        </Link>
        <span className="text-[color:var(--line)] select-none">|</span>
        <span className="brand-title text-sm text-creme flex-1 truncate">{resource.name}</span>
        <span
          className={`text-[0.6rem] uppercase tracking-wider cond border rounded-full px-2 py-0.5 hidden sm:inline ${sizeColor}`}
        >
          {resource.sizeLabel}
        </span>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn !py-1 !px-3 !text-xs hidden sm:inline-flex"
          title="Abrir em nova aba"
        >
          ↗ Nova aba
        </a>
        <button
          onClick={handlePrint}
          className="btn primary !py-1 !px-3 !text-xs"
        >
          🖨️ Imprimir / PDF
        </button>
      </div>

      {/* Preview iframe */}
      <iframe
        ref={iframeRef}
        src={previewUrl}
        title={resource.name}
        className="flex-1 w-full border-0 bg-neutral-900"
        sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
      />
    </div>
  );
}
