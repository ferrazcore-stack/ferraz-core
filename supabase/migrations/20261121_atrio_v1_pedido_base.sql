-- Átrio v1: tabelas base do pedido. Aplicado no projeto Supabase em 21/11/2026.
-- RLS ligado e sem políticas: nada é lido pelo app até o login e as políticas serem criados.
create table if not exists public.empresas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  cep text,
  criado_em timestamptz not null default now()
);
create table if not exists public.configuracao (
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  chave text not null,
  valor text,
  primary key (empresa_id, chave)
);
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  codigo text not null,
  cliente text not null,
  obra text,
  tipo text not null check (tipo in ('obra','retirada')),
  status text not null default 'pedido_fechado' check (status in (
    'pedido_fechado','aguardando_medicao','aguardando_liberacao_tecnica',
    'corte','acabamento','entrega','instalacao')),
  instalacao_concluida boolean not null default false,
  criado_em timestamptz not null default now(),
  unique (empresa_id, codigo)
);
create table if not exists public.pedido_historico (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  evento text not null,
  de_status text,
  para_status text,
  justificativa text,
  feito_por text,
  feito_em timestamptz not null default now()
);
alter table public.empresas enable row level security;
alter table public.configuracao enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_historico enable row level security;
