-- ============================================================
-- Barões do Asfalto — schema inicial (ficha de personagem + RLS)
-- Aplique no SQL Editor do Supabase (ou via CLI).
-- ============================================================

-- ---------- ENUMS ----------
do $$ begin
  create type user_role as enum ('admin', 'player');
exception when duplicate_object then null; end $$;

do $$ begin
  create type favor_dir as enum ('devido', 'a_receber');
exception when duplicate_object then null; end $$;

do $$ begin
  create type favor_grau as enum ('pequeno', 'medio', 'grande', 'critico');
exception when duplicate_object then null; end $$;

-- ---------- PROFILES ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role user_role not null default 'player',
  character_id uuid,
  created_at timestamptz not null default now()
);

-- ---------- CHARACTERS (ficha — doc 2.2) ----------
create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  nome text not null default '',
  apelido text default '',
  arquetipo text default '',
  idade int,
  origem text,
  residencia text,
  historico text,
  ambicao text,
  trauma text,
  codigo text,
  vicio text,
  vantagem text,
  desvantagem text,
  xp int not null default 0,
  -- atributos (1-5)
  mente int not null default 1,
  labia int not null default 1,
  sangue_frio int not null default 1,
  operacao int not null default 1,
  contatos int not null default 1,
  instinto int not null default 1,
  -- métricas (0-10)
  heat int not null default 0,
  exposicao int not null default 0,
  capital_rua int not null default 0,
  pressao int not null default 0,
  -- dinheiro (R$)
  dinheiro_limpo bigint not null default 0,
  dinheiro_sujo bigint not null default 0,
  dinheiro_transito bigint not null default 0,
  -- flexíveis
  pericias jsonb not null default '{}'::jsonb,            -- { "negociacao": 2, ... }
  especializacoes jsonb not null default '[]'::jsonb,
  condicoes jsonb not null default '{}'::jsonb,           -- ferimentos / complicações / dívidas
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- TABELAS-FILHAS ----------
create table if not exists points (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  nome text,
  local text,
  regiao_id int,
  tipo text,
  renda_liquida bigint not null default 0,
  protecao_paga_a text,
  protecao_custo bigint not null default 0,
  exposicao int not null default 0,
  lat double precision,
  lng double precision,
  status text not null default 'consolidado'  -- consolidado | disputa
);

create table if not exists favors (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  direcao favor_dir not null,
  contraparte text,
  descricao text,
  grau favor_grau,
  juros int not null default 0,
  status text not null default 'aberto'  -- aberto | pago
);

create table if not exists security_team (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  tipo text,
  qtd int not null default 1,
  lealdade int not null default 5,
  custo_mensal bigint not null default 0
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  nome text,
  funcao text,
  lealdade int not null default 5,
  servico text,
  custo_mensal bigint not null default 0
);

create table if not exists fachadas (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  nome text,
  tipo text,
  capacidade bigint not null default 0,
  taxa numeric not null default 0,
  custo_mensal bigint not null default 0
);

-- ---------- updated_at automático ----------
create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists characters_touch on characters;
create trigger characters_touch before update on characters
  for each row execute function touch_updated_at();

-- ---------- cria profile ao registrar usuário ----------
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- helper: é admin? ----------
create or replace function is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table characters enable row level security;
alter table points enable row level security;
alter table favors enable row level security;
alter table security_team enable row level security;
alter table contacts enable row level security;
alter table fachadas enable row level security;

-- profiles: nomes/papéis legíveis por autenticados (para o mapa/seletor); edita o próprio ou admin
drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles for select to authenticated using (true);
drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles for update to authenticated
  using (id = auth.uid() or is_admin());

-- characters: dono lê/edita o seu; admin tudo; só admin cria/apaga ficha
drop policy if exists characters_select on characters;
create policy characters_select on characters for select to authenticated
  using (owner_user_id = auth.uid() or is_admin());
drop policy if exists characters_update on characters;
create policy characters_update on characters for update to authenticated
  using (owner_user_id = auth.uid() or is_admin());
drop policy if exists characters_insert on characters;
create policy characters_insert on characters for insert to authenticated
  with check (is_admin());
drop policy if exists characters_delete on characters;
create policy characters_delete on characters for delete to authenticated
  using (is_admin());

-- pontos: legíveis por TODOS os autenticados (mapa compartilhado); escreve dono/admin
drop policy if exists points_select on points;
create policy points_select on points for select to authenticated using (true);
drop policy if exists points_write on points;
create policy points_write on points for all to authenticated
  using (exists (select 1 from characters c where c.id = points.character_id and (c.owner_user_id = auth.uid() or is_admin())))
  with check (exists (select 1 from characters c where c.id = points.character_id and (c.owner_user_id = auth.uid() or is_admin())));

-- demais tabelas-filhas: só dono/admin (helper macro via política única por tabela)
do $$
declare t text;
begin
  foreach t in array array['favors','security_team','contacts','fachadas']
  loop
    execute format('drop policy if exists %1$s_owner on %1$s', t);
    execute format($f$
      create policy %1$s_owner on %1$s for all to authenticated
      using (exists (select 1 from characters c where c.id = %1$s.character_id and (c.owner_user_id = auth.uid() or is_admin())))
      with check (exists (select 1 from characters c where c.id = %1$s.character_id and (c.owner_user_id = auth.uid() or is_admin())))
    $f$, t);
  end loop;
end $$;
