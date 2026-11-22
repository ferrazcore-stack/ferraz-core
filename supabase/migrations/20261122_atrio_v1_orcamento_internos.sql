-- Átrio v1: dados internos do orçamento só para gestor, financeiro e mestre.
-- Aplicado no Supabase em 22/11/2026.
-- Testado: vendedor vê 0 linhas internas; gestor vê 1.
create or replace function public.e_funcao(eid uuid, funcoes text[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.membros m where m.user_id = auth.uid() and m.empresa_id = eid and m.funcao = any(funcoes));
$$;
create table if not exists public.orcamento_internos (
  orcamento_id uuid primary key references public.orcamentos(id) on delete cascade,
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  dados jsonb not null default '{}'::jsonb
);
alter table public.orcamento_internos enable row level security;
create policy internos_gestor_financeiro on public.orcamento_internos for all to authenticated
  using (public.e_mestre(empresa_id) or public.e_funcao(empresa_id, array['gestor','financeiro']))
  with check (public.e_mestre(empresa_id) or public.e_funcao(empresa_id, array['gestor','financeiro']));
alter table public.orcamentos drop column if exists dados_internos;
