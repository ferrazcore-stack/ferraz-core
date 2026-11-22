export const STATUS_PEDIDO = [
  "pedido_fechado",
  "aguardando_medicao",
  "aguardando_liberacao_tecnica",
  "corte",
  "acabamento",
  "entrega",
  "instalacao",
] as const;
export type StatusPedido = (typeof STATUS_PEDIDO)[number];

// Colunas do Kanban: só a partir da liberação técnica (spec 20c).
export const COLUNAS_KANBAN: StatusPedido[] = [
  "aguardando_liberacao_tecnica",
  "corte",
  "acabamento",
  "entrega",
  "instalacao",
];

export function proximoStatus(s: StatusPedido): StatusPedido | null {
  const i = STATUS_PEDIDO.indexOf(s);
  return i < STATUS_PEDIDO.length - 1 ? STATUS_PEDIDO[i + 1] : null;
}

// Marcar a caixinha de medição move o pedido para a liberação técnica (spec 20b).
export function aoMarcarMedicao(s: StatusPedido): StatusPedido {
  return s === "aguardando_medicao" ? "aguardando_liberacao_tecnica" : s;
}

export type ResultadoVoltar =
  | { ok: true; novo: StatusPedido }
  | { ok: false; motivo: "sem_justificativa" | "nao_e_anterior" | "sem_permissao" };

// Voltar exige justificativa escrita e quem a empresa autorizou (spec 20b).
export function voltarStatus(
  atual: StatusPedido,
  alvo: StatusPedido,
  justificativa: string,
  podeVoltar: boolean,
): ResultadoVoltar {
  if (!podeVoltar) return { ok: false, motivo: "sem_permissao" };
  if (justificativa.trim().length === 0) return { ok: false, motivo: "sem_justificativa" };
  if (STATUS_PEDIDO.indexOf(alvo) >= STATUS_PEDIDO.indexOf(atual)) return { ok: false, motivo: "nao_e_anterior" };
  return { ok: true, novo: alvo };
}

export function cartoesDoKanban<T extends { status: StatusPedido }>(pedidos: T[]): Record<string, T[]> {
  const colunas: Record<string, T[]> = {};
  for (const c of COLUNAS_KANBAN) colunas[c] = [];
  for (const p of pedidos) if (colunas[p.status]) colunas[p.status].push(p);
  return colunas;
}
