import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Convenção do Next 16: "proxy" (substitui o antigo "middleware").
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Tudo, exceto estáticos do Next, favicon e a Apresentação estática (public/apresentacao).
    "/((?!_next/static|_next/image|favicon.ico|apresentacao|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
