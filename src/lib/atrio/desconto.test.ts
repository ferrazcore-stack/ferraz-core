import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularDesconto } from "./desconto.ts";

test("dentro do limite: mostra quanto ainda pode dar", () => {
  const r = calcularDesconto(1000, 50, 0.1); // limite 100, já deu 50
  assert.equal(r.situacao, "dentro");
  assert.equal(r.limiteRs, 100);
  assert.equal(r.disponivelRs, 50);
});

test("acima do limite: marca como acima e mostra o excesso como negativo", () => {
  const r = calcularDesconto(1000, 150, 0.1);
  assert.equal(r.situacao, "acima");
  assert.equal(r.disponivelRs, -50);
});

test("sem desconto dado: folga inteira", () => {
  assert.equal(calcularDesconto(1000, null, 0.1).disponivelRs, 100);
});

test("percentual não configurado bloqueia a folga", () => {
  assert.equal(calcularDesconto(1000, 0, null).situacao, "indisponivel");
});
