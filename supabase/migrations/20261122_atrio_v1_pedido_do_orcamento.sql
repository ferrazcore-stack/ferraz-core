-- Átrio v1: pedido nasce de um orçamento aprovado. Aplicado no Supabase em 22/11/2026.
-- Testado: um pedido por orçamento (o banco recusa o segundo).
alter table public.pedidos
  add column if not exists orcamento_id uuid unique references public.orcamentos(id) on delete set null;
