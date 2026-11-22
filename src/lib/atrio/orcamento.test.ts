import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularAmbiente, totalOrcamento, condicaoDoCliente, visaoDoCliente, type Ambiente } from "./orcamento.ts";

const cfg = { impostos: 0.1, comissao: 0.05, margem: 0.2 };
const base: Ambiente = {
  nome: "Cozinha",
  custo: 100, perda: 0.1, maoDeObra: 50, insumos: 0, instalacao: 0, frete: 0,
  impostos: null, comissao: null, margem: null,
  valorAmbiente: 1000, servicosNaObra: 200, percentualAcabador: 0.05,
};

test("preço de venda do ambiente segue a fórmula: (custo com perda + mão + insumos + instalação) ÷ (1 − impostos − comissão − margem)", () => {
  const r = calcularAmbiente(base, cfg);
  // custo com perda 111,11 + mão 50 = 161,11; divisor 0,65 → 247,86
  assert.ok(Math.abs((r.precoVenda as number) - 247.86) < 0.01);
});

test("acabador: (valor do ambiente − serviços na obra) × percentual", () => {
  const r = calcularAmbiente(base, cfg);
  assert.equal(r.acabador, (1000 - 200) * 0.05);
});

test("campo vazio na configuração devolve null, nunca preço inventado", () => {
  assert.equal(calcularAmbiente(base, { ...cfg, margem: null }).precoVenda, null);
});

test("frete entra uma vez só, grossed up pelo mesmo divisor", () => {
  const total = totalOrcamento([base], 65, cfg); // divisor 0,65 → frete 65 vira 100
  const sem = totalOrcamento([base], 0, cfg) as number;
  assert.ok(Math.abs((total as number) - (sem + 100)) < 0.01);
});

test("condição: entrada de 30% e saldo em 3 parcelas, centavos fecham o total", () => {
  const c = condicaoDoCliente(1000, { entradaValor: null, entradaPercentual: 0.3, parcelas: 3, formaEntrada: "pix", formaSaldo: "cartao" });
  assert.ok(c);
  assert.equal(c.entrada, 300);
  assert.deepEqual(c.parcelas.map((p) => p.valor), [233.33, 233.33, 233.34]);
  assert.equal(c.parcelas.reduce((s, p) => s + p.valor, 0) + c.entrada, 1000);
});

test("visão do cliente não traz custo, margem nem comissão", () => {
  const c = condicaoDoCliente(1000, { entradaValor: 300, entradaPercentual: null, parcelas: 2, formaEntrada: "pix", formaSaldo: "boleto" })!;
  const v = visaoDoCliente(1000, c, { entrada: "pix", saldo: "boleto" });
  const texto = JSON.stringify(v);
  for (const proibido of ["custo", "margem", "comissao", "impostos", "taxa"]) {
    assert.equal(texto.includes(proibido), false, proibido);
  }
});
