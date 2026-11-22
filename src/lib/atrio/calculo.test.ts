import { test } from "node:test";
import assert from "node:assert/strict";
import { custoComPerda, precoDeVenda, acabador } from "./calculo.ts";

const base = { custo: 500, perda: 0.15, maoDeObra: 120, insumos: 40, instalacao: 60, frete: 30, impostos: 0.06, comissao: 0.05, margem: 0.25 };

test("T1 custo com perda", () => {
  assert.equal(Math.round((custoComPerda(500, 0.15) as number) * 100) / 100, 588.24);
});
test("T2 perda vazia não mostra preço", () => {
  assert.equal(precoDeVenda({ ...base, perda: null }), null);
});
test("T3 preço de venda", () => {
  assert.equal(Math.round((precoDeVenda(base) as number) * 100) / 100, 1309.74);
});
test("T4 acabador", () => {
  assert.equal(Math.round((acabador(10000, 190, 0.05) as number) * 100) / 100, 490.5);
});
test("divisor zero bloqueia", () => {
  assert.equal(precoDeVenda({ ...base, impostos: 0.5, comissao: 0.3, margem: 0.2 }), null);
});
