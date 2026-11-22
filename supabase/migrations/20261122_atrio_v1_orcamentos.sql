-- Átrio v1: orçamentos. Aplicado no Supabase em 22/11/2026.
-- Acesso só para membros da empresa (mesma regra de acessos).
-- Testado: membro vê, pessoa de outra empresa não vê; dados de teste apagados.
create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  codigo text not null,
  cliente text not null,
  obra text not null,
  prazo_quantidade integer not null check (prazo_quantidade > 0),
  prazo_tipo text not null check (prazo_tipo in ('uteis','corridos')),
  total numeric(14,2),
  condicao jsonb not null default '{}'::jsonb,
  dados_internos jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);
alter table public.orcamentos enable row level security;
create policy orcamentos_membro on public.orcamentos for all to authenticated
  using (public.e_membro(empresa_id)) with check (public.e_membro(empresa_id));
