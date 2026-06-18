# Setup do Supabase — passo a passo

Siga na ordem. No fim, me avise que eu valido o login e a persistência.

---

## 1) Criar conta e projeto
1. Acesse **https://supabase.com** → **Start your project** (login com GitHub ou email).
2. **New project**:
   - **Name:** `baroes-do-asfalto`
   - **Database Password:** gere uma forte e **guarde** (você raramente usa, mas precisa para o banco).
   - **Region:** `South America (São Paulo)` (mais perto = mais rápido).
   - **Plan:** Free.
3. Clique **Create new project** e espere ~2 min provisionar.

---

## 2) Pegar as chaves de API
1. No menu lateral, ícone de engrenagem **⚙ Project Settings** → **API** (ou **API Keys**).
2. Anote três coisas:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **Project API keys → `anon` `public`** → chave longa (pode ser pública).
   - **Project API keys → `service_role` `secret`** → chave longa **SECRETA** (nunca exponha no navegador/Git).

---

## 3) Preencher o `.env.local`
No projeto, copie `webapp/.env.local.example` para `webapp/.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co        # ← Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...                      # ← anon public
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...                          # ← service_role secret
ADMIN_EMAIL=gustavo.j.siebel@accenture.com
```

> Me mande **só** a Project URL e a `anon` key se quiser que eu confira a config — **a `service_role` NÃO** (é secreta; guarde no `.env.local`).

---

## 4) Criar as tabelas (rodar o SQL)
1. Menu lateral → **SQL Editor** → **New query**.
2. Abra o arquivo `webapp/supabase/migrations/0001_init.sql`, **copie tudo** e cole no editor.
3. Clique **Run** (canto inferior direito). Deve aparecer **Success. No rows returned**.
   - Isso cria as tabelas (`profiles`, `characters`, `points`, `favors`, `security_team`,
     `contacts`, `fachadas`), as políticas de segurança (RLS) e os gatilhos.

---

## 5) Desligar a confirmação de email (admin cria as contas)
Como **você** cria as contas, é mais simples não exigir confirmação por email:
1. Menu lateral → **Authentication** → **Sign In / Providers** (ou **Providers**) → **Email**.
2. Desligue **Confirm email** (toggle) → **Save**.

---

## 6) Criar o usuário admin (você)
1. Menu lateral → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Preencha:
   - **Email:** `gustavo.j.siebel@accenture.com`
   - **Password:** a senha que você vai usar para entrar no app.
   - Marque **Auto Confirm User** (se aparecer).
3. **Create user**.

---

## 7) Promover você a admin (rodar o 2º SQL)
1. **SQL Editor** → **New query**.
2. Cole o conteúdo de `webapp/supabase/migrations/0002_seed_admin.sql` → **Run**.
   - Isso marca o seu usuário como `role = 'admin'` na tabela `profiles`.
3. Confira: **Table Editor** → tabela **profiles** → sua linha deve estar com `role = admin`.

---

## 8) (Opcional, para já ver dados reais) criar sua ficha
Enquanto o "criar ficha" pelo painel não existe (vem na Fase 3), dá para criar 1 ficha na mão:
1. **Authentication → Users**: copie o **UID** do seu usuário (campo `User UID`).
2. **Table Editor → characters → Insert → Insert row**:
   - `owner_user_id` = **cole o seu UID**
   - `nome` = seu nome de personagem · `apelido`, `arquetipo` à vontade
   - `dinheiro_sujo` = `240000` (ex.: para ver o alerta de lavar)
   - `heat` = `6`, `exposicao` = `8`, `pressao` = `7` (para ver os alertas)
   - **Save**.
3. (Se quiser pontos/favores no mapa e nas listas, dá para inserir linhas em `points` e
   `favors` com `character_id` = o `id` dessa ficha — mas isso é opcional agora.)

---

## 9) Criar os outros jogadores (quando quiser)
- **Authentication → Users → Add user** para cada jogador (email + senha).
- Depois, uma ficha em `characters` com `owner_user_id` = o UID dele.
- (Na Fase 3 eu monto o painel admin para isso ser feito por tela, sem SQL.)

---

## 10) Rodar e testar
```
cd webapp
npm run dev
```
Abra `http://localhost:3000`, clique **Entrar**, use o email/senha do admin.
- O **Dashboard** deve sair do "modo demonstração" e mostrar a sua ficha real.
- O **Livro** e a **Apresentação** continuam funcionando.

**Me avise quando terminar** que eu valido o login/persistência de ponta a ponta e sigo para a
Fase 3 (mapa por dono + painel admin).

---

### Deploy na Vercel (depois, quando você quiser)
As mesmas variáveis vão em **Vercel → Project → Settings → Environment Variables**
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, e `SUPABASE_SERVICE_ROLE_KEY`).
Em Authentication → URL Configuration, adicione a URL da Vercel em **Site URL** / **Redirect URLs**.
