import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase/server";
import { PortalHeader } from "@/components/portal-header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Com Supabase configurado, exige login. Sem configuração (dev/preview),
  // deixa navegar para o app ser visível antes de plugar as chaves.
  if (supabaseConfigured()) {
    const user = await getSessionUser();
    if (!user) redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <PortalHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
