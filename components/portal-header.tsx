import Link from "next/link";
import { getProfile, getSessionUser } from "@/lib/auth";

export async function PortalHeader() {
  const user = await getSessionUser();
  const profile = user ? await getProfile() : null;

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-5 py-3 border-b border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(10,26,18,.96),rgba(10,26,18,.82))] backdrop-blur">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-dourado text-lg">★</span>
        <span className="brand-title text-creme text-sm">Barões do Asfalto</span>
      </Link>
      <nav className="flex items-center gap-1 ml-3 cond text-sm uppercase tracking-wide">
        <Link href="/apresentacao/index.html" className="px-3 py-1.5 rounded hover:bg-[rgba(201,162,39,.1)] text-txt-dim hover:text-creme">
          Apresentação
        </Link>
        <Link href="/livro" className="px-3 py-1.5 rounded hover:bg-[rgba(201,162,39,.1)] text-txt-dim hover:text-creme">
          Livro
        </Link>
        <Link href="/dashboard" className="px-3 py-1.5 rounded hover:bg-[rgba(201,162,39,.1)] text-txt-dim hover:text-creme">
          Dashboard
        </Link>
        {profile?.role === "admin" && (
          <Link href="/admin" className="px-3 py-1.5 rounded hover:bg-[rgba(201,162,39,.1)] text-txt-dim hover:text-creme">
            Admin
          </Link>
        )}
      </nav>
      <div className="ml-auto flex items-center gap-3 text-sm">
        {user ? (
          <form action="/auth/signout" method="post" className="flex items-center gap-3">
            <span className="text-txt-dim cond">
              {profile?.display_name || user.email}
              {profile?.role === "admin" && (
                <span className="ml-1.5 text-[0.62rem] uppercase tracking-wide text-dourado border border-[color:var(--line)] rounded px-1.5 py-0.5">
                  admin
                </span>
              )}
            </span>
            <button type="submit" className="btn !py-1.5 !px-3 !text-xs">
              Sair
            </button>
          </form>
        ) : (
          <Link href="/login" className="btn primary !py-1.5 !px-4 !text-xs">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
