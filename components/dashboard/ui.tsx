import type { Flag } from "@/lib/rules/flags";

export function Card({
  title,
  hint,
  className = "",
  children,
}: {
  title?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`panel p-5 ${className}`}>
      {title && (
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="brand-title text-creme text-base uppercase tracking-wide">{title}</h2>
          {hint && <span className="mono text-txt-dim text-[0.62rem]">{hint}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

const METRIC_COLOR: Record<string, string> = {
  heat: "var(--vermelho-claro)",
  exposicao: "var(--azul)",
  capital_rua: "var(--dourado)",
  pressao: "#cfcfcf",
};

export function MetricBar({
  metric,
  label,
  value,
  status,
  max = 10,
}: {
  metric: keyof typeof METRIC_COLOR;
  label: string;
  value: number;
  status: string;
  max?: number;
}) {
  const color = METRIC_COLOR[metric];
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="cond uppercase tracking-wide text-sm text-creme">{label}</span>
        <span className="mono text-xs text-txt-dim">
          {value}/{max}
        </span>
      </div>
      <div className="flex gap-[3px] mt-1">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 flex-1 rounded-[2px]"
            style={{
              background: i < value ? color : "rgba(255,255,255,.1)",
            }}
          />
        ))}
      </div>
      <div className="text-txt-dim text-xs mt-1">{status}</div>
    </div>
  );
}

export function Pips({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full border"
          style={{
            borderColor: "var(--dourado)",
            background: i < value ? "var(--dourado)" : "transparent",
          }}
        />
      ))}
    </span>
  );
}

const FLAG_STYLE: Record<Flag["level"], string> = {
  danger: "border-l-[color:var(--vermelho)] bg-[rgba(164,22,26,.12)]",
  warn: "border-l-[color:var(--dourado)] bg-[rgba(201,162,39,.08)]",
  info: "border-l-[color:var(--azul)] bg-[rgba(44,95,124,.1)]",
};

export function FlagList({ flags }: { flags: Flag[] }) {
  if (!flags.length) {
    return (
      <div className="panel p-4 border-l-4 border-l-[color:var(--verde)] text-txt-dim text-sm">
        ✅ Nenhuma pendência. O império está em ordem — por enquanto.
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {flags.map((f) => (
        <div
          key={f.id}
          className={`rounded-lg border border-[color:var(--line-soft)] border-l-4 px-4 py-3 ${FLAG_STYLE[f.level]}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{f.icon}</span>
            <span className="cond uppercase tracking-wide text-sm text-creme">{f.title}</span>
          </div>
          <p className="text-txt-dim text-[0.84rem] mt-1 leading-snug">{f.detail}</p>
        </div>
      ))}
    </div>
  );
}
