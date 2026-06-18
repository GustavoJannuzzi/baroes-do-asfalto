# Barões do Asfalto — App (Next.js)

App multi-portal com login: **Apresentação** (pública), **Livro digital** (wiki, login) e
**Dashboard de Gameplay** (login). Stack: Next.js 16 (App Router) + Tailwind 4 + Supabase.

## Rodar local

```bash
npm install
cp .env.local.example .env.local   # preencha com as chaves do Supabase
npm run dev                         # http://localhost:3000
```

Sem `.env.local`, o app roda em modo "preview" (sem login/dados) para visualização.

## Configurar o Supabase (uma vez)

1. Crie um projeto grátis em supabase.com.
2. Em **Project Settings → API**, copie `Project URL` e `anon key` para `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. No **SQL Editor**, rode `supabase/migrations/0001_init.sql` (schema + RLS).
4. **Crie o usuário admin:** Authentication → Users → Add user (email do admin),
   _ou_ faça login pela tela `/login` uma vez. Depois rode
   `supabase/migrations/0002_seed_admin.sql` para promover esse email a `admin`.
5. Admin cria as contas dos jogadores (Authentication → Add user) e as fichas
   (no Dashboard, Fase 2).

## Deploy (Vercel)

- Framework: **Next.js** (auto-detectado).
- Env vars na Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (e `SUPABASE_SERVICE_ROLE_KEY` se usar o export do agente).

## Estrutura

```
app/
  page.tsx                  # hub dos 3 portais (público)
  login/                    # login (Supabase)
  (protected)/              # exige login quando Supabase configurado
    livro/                  # Livro digital (wiki dos markdowns)
    dashboard/              # Dashboard (Fase 2)
content/livro/              # markdown do livro (fonte do Livro digital)
public/apresentacao/        # a Apresentação estática (portal público)
lib/supabase/               # clients (client/server) + sessão
lib/auth.ts                 # usuário/perfil/papel
proxy.ts                    # renova sessão (convenção Next 16)
supabase/migrations/        # schema + RLS + seed admin
```
