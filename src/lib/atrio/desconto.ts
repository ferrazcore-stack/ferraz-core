// Folga de desconto do vendedor (spec 4.7 e 19, ajustada em 22/11 pela usuária).
// O vendedor vê só quanto ainda pode dar de desconto. Não vê custo, margem nem taxas.
// Campo vazio (percentual não configurado) devolve null e bloqueia a folga.

export type SituacaoDesconto = "dentro" | "acima" | "indisponivel";

export interface ResultadoDesconto {
  situacao: SituacaoDesconto;
  limiteRs: number | null;      // quanto o vendedor pode dar, no máximo
  aplicadoRs: number | null;    // quanto já deu
  disponivelRs: number | null;  // quanto ainda pode dar (pode ser negativo se passou)
}

export function calcularDesconto(
  precoCheio: number | null,
  descontoAplicado: number | null,
  maximoPercentual: number | null,
): ResultadoDesconto {
  if (precoCheio == null || maximoPercentual == null) {
    return { situacao: "indisponivel", limiteRs: null, aplicadoRs: null, disponivelRs: null };
  }
  const aplicado = descontoAplicado ?? 0;
  const limite = precoCheio * maximoPercentual;
  const disponivel = limite - aplicado;
  return {
    situacao: disponivel >= 0 ? "dentro" : "acima",
    limiteRs: limite,
    aplicadoRs: aplicado,
    disponivelRs: disponivel,
  };
}
