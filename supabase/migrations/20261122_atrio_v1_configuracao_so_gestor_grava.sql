-- Átrio v1: todos os membros leem a configuração; só mestre e gestor gravam.
-- Aplicado no Supabase em 22/11/2026.
-- Testado: vendedor recebe erro de permissão ao gravar; gestor grava.
drop policy if exists config_membro on public.configuracao;
create policy config_ler on public.configuracao for select to authenticated
  using (public.e_membro(empresa_id));
create policy config_gravar on public.configuracao for all to authenticated
  using (public.e_mestre(empresa_id) or public.e_funcao(empresa_id, array['gestor']))
  with check (public.e_mestre(empresa_id) or public.e_funcao(empresa_id, array['gestor']));
