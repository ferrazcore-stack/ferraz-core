-- Átrio v1: acessos por empresa. Aplicado no Supabase em 21/11/2026.
-- Cada usuário pertence a uma ou mais empresas (tabela membros).
-- O mestre da empresa é quem gerencia os membros e seus acessos.
-- Testado: usuário A vê só a empresa A, usuário B só a B, sem vínculo não vê nada.
create table if not exists public.membros (
  user_id uuid not null,
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  funcao text not null default 'vendedor',
  mestre boolean not null default false,
  criado_em timestamptz not null default now(),
  primary key (user_id, empresa_id)
);
alter table public.membros enable row level security;
create or replace function public.e_membro(eid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.membros m where m.user_id = auth.uid() and m.empresa_id = eid);
$$;
create or replace function public.e_mestre(eid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.membros m where m.user_id = auth.uid() and m.empresa_id = eid and m.mestre);
$$;
create policy membros_ver_proprios on public.membros for select to authenticated
  using (user_id = auth.uid() or public.e_mestre(empresa_id));
create policy membros_mestre_gerencia on public.membros for all to authenticated
  using (public.e_mestre(empresa_id)) with check (public.e_mestre(empresa_id));
create policy empresas_membro on public.empresas for select to authenticated
  using (public.e_membro(id));
create policy config_membro on public.configuracao for all to authenticated
  using (public.e_membro(empresa_id)) with check (public.e_membro(empresa_id));
create policy pedidos_membro on public.pedidos for all to authenticated
  using (public.e_membro(empresa_id)) with check (public.e_membro(empresa_id));
create policy historico_membro_ver on public.pedido_historico for select to authenticated
  using (exists (select 1 from public.pedidos p where p.id = pedido_id and public.e_membro(p.empresa_id)));
create policy historico_membro_inserir on public.pedido_historico for insert to authenticated
  with check (exists (select 1 from public.pedidos p where p.id = pedido_id and public.e_membro(p.empresa_id)));
