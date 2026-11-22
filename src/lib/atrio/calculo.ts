// Motor de cálculo do Átrio (v1). Campo vazio não entra no cálculo: devolve null.

export const custoComPerda = (custo: number | null, perda: number | null): number | null => {
  if (custo == null || perda == null || perda >= 1) return null;
  return custo / (1 - perda);
};

export interface EntradaPreco {
  custo: number | null;
  perda: number | null;
  maoDeObra: number | null;
  insumos: number | null;
  instalacao: number | null;
  frete: number | null;
  impostos: number | null;
  comissao: number | null;
  margem: number | null;
}

export const precoDeVenda = (e: EntradaPreco): number | null => {
  const campos = Object.values(e);
  if (campos.some((v) => v == null)) return null;
  const divisor = 1 - (e.impostos as number) - (e.comissao as number) - (e.margem as number);
  if (divisor <= 0) return null;
  const total =
    (custoComPerda(e.custo, e.perda) as number) +
    (e.maoDeObra as number) +
    (e.insumos as number) +
    (e.instalacao as number) +
    (e.frete as number);
  return total / divisor;
};

export const acabador = (
  valorAmbiente: number | null,
  servicosNaObra: number | null,
  percentual: number | null,
): number | null => {
  if (valorAmbiente == null || percentual == null) return null;
  return (valorAmbiente - (servicosNaObra ?? 0)) * percentual;
};
