import { supabase } from "../supabase";
import { proximoStatus, voltarStatus, STATUS_PEDIDO, type StatusPedido } from "./pedido.ts";

function cliente() {
  if (!supabase) throw new Error("Supabase não configurado.");
  return supabase;
}

async function quemSou(): Promise<string | null> {
  const { data } = await cliente().auth.getUser();
  return data.user?.id ?? null;
}

// Orçamento aprovado vira pedido. É o mesmo trabalho com outro nome: o pedido guarda o orçamento de origem.
export async function virarPedido(orcamentoId: string): Promise<string> {
  const db = cliente();
  const { data: orc, error: erroOrc } = await db
    .from("orcamentos")
    .select("id, empresa_id, codigo, cliente, obra, situacao")
    .eq("id", orcamentoId)
    .single();
  if (erroOrc || !orc) throw new Error("Orçamento não encontrado.");
  if (orc.situacao === "aguardando_aprovacao") throw new Error("Este orçamento ainda precisa de aprovação.");

  const { data: ped, error: erroPed } = await db
    .from("pedidos")
    .insert({
      empresa_id: orc.empresa_id,
      codigo: orc.codigo,
      cliente: orc.cliente,
      obra: orc.obra,
      tipo: "obra",
      status: "pedido_fechado",
      orcamento_id: orc.id,
    })
    .select("id")
    .single();
  if (erroPed || !ped) throw new Error("Não foi possível criar o pedido.");

  await db.from("orcamentos").update({ situacao: "aprovado" }).eq("id", orc.id);
  await db.from("pedido_historico").insert({
    pedido_id: ped.id,
    evento: "criado",
    para_status: "pedido_fechado",
    feito_por: await quemSou(),
  });
  return ped.id as string;
}

export async function listarPedidos(empresaId: string) {
  const { data, error } = await cliente()
    .from("pedidos")
    .select("id, codigo, cliente, obra, status, instalacao_concluida, criado_em")
    .eq("empresa_id", empresaId)
    .order("criado_em", { ascending: false });
  if (error) throw new Error("Não foi possível carregar os pedidos.");
  return data ?? [];
}

// Avança para o próximo status. Voltar exige justificativa e permissão (pedido.ts).
export async function avancarStatus(pedido: { id: string; status: StatusPedido }): Promise<void> {
  const prox = proximoStatus(pedido.status);
  if (!prox) throw new Error("Este pedido já está na última etapa.");
  const db = cliente();
  const { error } = await db.from("pedidos").update({ status: prox }).eq("id", pedido.id);
  if (error) throw new Error("Não foi possível mudar o status.");
  await db.from("pedido_historico").insert({
    pedido_id: pedido.id,
    evento: "status",
    de_status: pedido.status,
    para_status: prox,
    feito_por: await quemSou(),
  });
}

export async function voltarPedido(
  pedido: { id: string; status: StatusPedido },
  alvo: StatusPedido,
  justificativa: string,
  podeVoltar: boolean,
): Promise<void> {
  const r = voltarStatus(pedido.status, alvo, justificativa, podeVoltar);
  if (!r.ok) {
    const msgs = {
      sem_permissao: "Você não tem permissão para voltar o pedido.",
      sem_justificativa: "Escreva o motivo para voltar o pedido.",
      nao_e_anterior: "Só é possível voltar para uma etapa anterior.",
    } as const;
    throw new Error(msgs[r.motivo]);
  }
  const db = cliente();
  const { error } = await db.from("pedidos").update({ status: alvo }).eq("id", pedido.id);
  if (error) throw new Error("Não foi possível voltar o status.");
  await db.from("pedido_historico").insert({
    pedido_id: pedido.id,
    evento: "voltar",
    de_status: pedido.status,
    para_status: alvo,
    justificativa: justificativa.trim(),
    feito_por: await quemSou(),
  });
}

export { STATUS_PEDIDO };
