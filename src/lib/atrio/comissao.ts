// Comissão do Átrio (v1).
// Faixas mensais: o percentual da faixa em que o acumulado do mês cai vale para o mês inteiro.
// O acumulado zera no dia 1. Pagamento sai no mês seguinte, na data da empresa.

export interface Faixa {
  ate: number | null;     // limite inclusivo; null = sem limite (última faixa)
  percentual: number;     // fração (0.02 = 2%)
}

export const percentualDaFaixa = (acumulado: number, faixas: Faixa[]): number | null => {
  if (!faixas.length) return null;
  for (const f of faixas) {
    if (f.ate === null || acumulado <= f.ate) return f.percentual;
  }
  return null;
};

export const comissaoDoMes = (acumulado: number | null, faixas: Faixa[]): number | null => {
  if (acumulado == null) return null;
  const p = percentualDaFaixa(acumulado, faixas);
  return p == null ? null : acumulado * p;
};

// Liberação técnica: quem libera recebe. Vendedor autorizado a liberar não recebe.
export const recebeComissaoDeLiberacao = (
  funcao: "vendedor" | "tecnico" | "proprietaria" | "outra",
  _vendedorAutorizadoALiberar: boolean,
  proprietariaAtuaComoTecnica: boolean,
): boolean => {
  if (funcao === "vendedor") return false;
  if (funcao === "proprietaria") return proprietariaAtuaComoTecnica;
  if (funcao === "tecnico") return true;
  // outras funções não recebem por liberação (configurável pela empresa depois)
  return false;
};
