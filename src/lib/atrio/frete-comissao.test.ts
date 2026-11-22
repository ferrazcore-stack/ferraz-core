import { test } from "node:test";
import assert from "node:assert/strict";
import { kmCobrados, freteTotal } from "./frete.ts";
import { percentualDaFaixa, comissaoDoMes, recebeComissaoDeLiberacao, type Faixa } from "./comissao.ts";

const faixas: Faixa[] = [{ ate: 100000, percentual: 0.02 }, { ate: null, percentual: 0.03 }];

test("frete por km: 60 km, ida e volta, 10 km livres = 110 km cobrados", () => {
  assert.equal(kmCobrados(60, true, 10), 110);
});
test("frete por km: 110 km × R$ 2,00 = R$ 220", () => {
  const f = freteTotal({ modo: "Km", distanciaKm: 60, idaEVolta: true, kmLivres: 10, valorKm: 2, area: null, valorM2: null, coleta: false, valorColeta: null });
  assert.equal(f, 220);
});
test("frete por m²: 2 m² × R$ 30 = R$ 60", () => {
  const f = freteTotal({ modo: "FixoM2", distanciaKm: null, idaEVolta: null, kmLivres: null, valorKm: null, area: 2, valorM2: 30, coleta: false, valorColeta: null });
  assert.equal(f, 60);
});
test("frete com coleta soma uma vez", () => {
  const f = freteTotal({ modo: "FixoM2", distanciaKm: null, idaEVolta: null, kmLivres: null, valorKm: null, area: 2, valorM2: 30, coleta: true, valorColeta: 50 });
  assert.equal(f, 110);
});
test("frete sem modo não calcula", () => {
  assert.equal(freteTotal({ modo: null, distanciaKm: 1, idaEVolta: false, kmLivres: 0, valorKm: 1, area: 1, valorM2: 1, coleta: false, valorColeta: null }), null);
});

test("T5 faixa muda ao cruzar R$ 100 mil e vale o mês inteiro", () => {
  assert.equal(percentualDaFaixa(90000, faixas), 0.02);
  assert.equal(percentualDaFaixa(110000, faixas), 0.03);
  assert.equal(comissaoDoMes(110000, faixas), 3300);
});
test("limite de R$ 100 mil exato fica na faixa de 2%", () => {
  assert.equal(percentualDaFaixa(100000, faixas), 0.02);
});
test("sem faixas não calcula", () => {
  assert.equal(comissaoDoMes(90000, []), null);
});
test("T7 vendedor não recebe comissão de liberação", () => {
  assert.equal(recebeComissaoDeLiberacao("vendedor", true, false), false);
});
test("técnico recebe comissão de liberação", () => {
  assert.equal(recebeComissaoDeLiberacao("tecnico", false, false), true);
});
