"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const configured = supabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="panel w-full max-w-md p-8 relative z-10">
        <Link href="/" className="kicker text-[0.7rem]">
          ← Barões do Asfalto
        </Link>
        <h1 className="brand-title text-creme text-3xl mt-2">
          Entrar no <span className="text-dourado">Q.G.</span>
        </h1>
        <p className="text-txt-dim text-sm mt-1 mb-6">
          Acesso ao Livro digital e ao painel de gameplay.
        </p>

        {!configured && (
          <div className="mb-5 rounded-lg border border-[color:var(--line)] bg-[rgba(201,162,39,.08)] px-4 py-3 text-sm text-txt-dim">
            ⚙️ Supabase ainda não configurado. Preencha <code>.env.local</code> com as
            chaves do projeto para habilitar o login.
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="field-label">Senha</label>
            <input
              type="password"
              className="field-input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-vermelho-claro text-sm">{error}</p>}

          <button type="submit" className="btn primary justify-center mt-1" disabled={loading || !configured}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-txt-dim text-xs mt-6 mono">
          As contas são criadas pelo admin. Sem acesso? Fale com o mestre.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
