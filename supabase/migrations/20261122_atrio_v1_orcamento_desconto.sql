-- Átrio v1: folga de desconto no orçamento. Aplicado no Supabase em 22/11/2026.
-- Testado: situação válida é aceita; situação inventada é recusada.
alter table public.orcamentos
  add column if not exists preco_cheio numeric(14,2),
  add column if not exists desconto_aplicado numeric(14,2) not null default 0,
  add column if not exists situacao text not null default 'rascunho'
    check (situacao in ('rascunho','aguardando_aprovacao','aprovado'));
