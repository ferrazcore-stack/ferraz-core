-- Átrio v1: controle de dicas vistas por pessoa. Aplicado no Supabase em 22/11/2026.
-- Testado: cada pessoa só enxerga as próprias linhas.
create table if not exists public.usuario_dicas_vistas (
  user_id uuid not null,
  tela text not null,
  visto_em timestamptz not null default now(),
  primary key (user_id, tela)
);
alter table public.usuario_dicas_vistas enable row level security;
create policy dicas_proprias on public.usuario_dicas_vistas for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
