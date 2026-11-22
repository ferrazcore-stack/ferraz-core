import { precoDeVenda, acabador, type EntradaPreco } from "./calculo.ts";

// Orçamento do Átrio (v1). Campo vazio não entra no cálculo: devolve null.
// Frete entra uma vez só, no total do orçamento (spec 6 e 7).

export interface Ambiente extends EntradaPreco {
  nome: string;
  valorAmbiente: number | null;
  servicosNaObra: number | null;
  percentualAcabador: number | null;
}

export interface Configuracao {
  impostos: number | null;
  comissao: number | null;
  margem: number | null;
}

export interface Condicao {
  entradaValor: number | null;     // valor fixo, ou
  entradaPercentual: number | null; // percentual do total (0,30 = 30%)
  parcelas: number | null;         // quantidade de parcelas do saldo
  formaEntrada: string | null;
  formaSaldo: string | null;
}

export interface ResultadoAmbiente {
  nome: string;
  precoVenda: number | null;
  acabador: number | null;
}

export function precoAmbiente(a: Ambiente, c: Configuracao, freteZero = true): number | null {
  return precoDeVenda({
    custo: a.custo,
    perda: a.perda,
    maoDeObra: a.maoDeObra,
    insumos: a.insumos,
    instalacao: a.instalacao,
    frete: freteZero ? 0 : a.frete,
    impostos: c.impostos,
    comissao: c.comissao,
    margem: c.margem,
  });
}

export function calcularAmbiente(a: Ambiente, c: Configuracao): ResultadoAmbiente {
  return {
    nome: a.nome,
    precoVenda: precoAmbiente(a, c),
    acabador: acabador(a.valorAmbiente, a.servicosNaObra, a.percentualAcabador),
  };
}

// Total = soma dos ambientes + frete uma vez, grossed up pelo mesmo divisor do preço.
export function totalOrcamento(ambientes: Ambiente[], frete: number | null, c: Configuracao): number | null {
  const precos = ambientes.map((a) => precoAmbiente(a, c));
  const validos = precos.filter((p): p is number => p != null);
  if (validos.length !== precos.length || frete == null) return null;
  if (c.impostos == null || c.comissao == null || c.margem == null) return null;
  const divisor = 1 - c.impostos - c.comissao - c.margem;
  if (!(divisor > 0)) return null;
  const soma = validos.reduce((s, p) => s + p, 0);
  return soma + frete / divisor;
}

export interface Parcela {
  numero: number;
  valor: number;
}

export interface CondicaoCliente {
  total: number;
  entrada: number;
  parcelas: Parcela[];
}

// Valores em centavos para não somar erro de arredondamento; a última parcela absorve a diferença.
export function condicaoDoCliente(total: number, cond: Condicao): CondicaoCliente | null {
  const entrada =
    cond.entradaValor != null ? cond.entradaValor : cond.entradaPercentual != null ? total * cond.entradaPercentual : null;
  if (entrada == null || cond.parcelas == null || cond.parcelas < 1) return null;
  const saldoCent = Math.round((total - entrada) * 100);
  const base = Math.floor(saldoCent / cond.parcelas);
  const parcelas: Parcela[] = [];
  let acumulado = 0;
  for (let i = 1; i <= cond.parcelas; i++) {
    const cent = i === cond.parcelas ? saldoCent - acumulado : base;
    acumulado += cent;
    parcelas.push({ numero: i, valor: cent / 100 });
  }
  return { total, entrada, parcelas };
}

// O que vai ao cliente: só forma, parcelas e valores. Nada de custo, margem, taxa ou comissão.
export function visaoDoCliente(total: number, cond: CondicaoCliente, formas: { entrada: string | null; saldo: string | null }) {
  return {
    total,
    entrada: { valor: cond.entrada, forma: formas.entrada },
    saldo: { forma: formas.saldo, parcelas: cond.parcelas },
  };
}
