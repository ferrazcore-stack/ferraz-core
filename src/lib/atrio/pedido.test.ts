import { test } from "node:test";
import assert from "node:assert/strict";
import { proximoStatus, aoMarcarMedicao, voltarStatus, cartoesDoKanban } from "./pedido.ts";

test("proximoStatus segue a sequência e para em instalação", () => {
  assert.equal(proximoStatus("pedido_fechado"), "aguardando_medicao");
  assert.equal(proximoStatus("instalacao"), null);
});

test("marcar a caixinha de medição move para liberação técnica", () => {
  assert.equal(aoMarcarMedicao("aguardando_medicao"), "aguardando_liberacao_tecnica");
  assert.equal(aoMarcarMedicao("corte"), "corte");
});

test("voltar exige permissão, justificativa e status anterior", () => {
  assert.deepEqual(voltarStatus("corte", "aguardando_liberacao_tecnica", "erro de medida", true), {
    ok: true,
    novo: "aguardando_liberacao_tecnica",
  });
  assert.deepEqual(voltarStatus("corte", "aguardando_liberacao_tecnica", "x", false), { ok: false, motivo: "sem_permissao" });
  assert.deepEqual(voltarStatus("corte", "aguardando_liberacao_tecnica", "   ", true), { ok: false, motivo: "sem_justificativa" });
  assert.deepEqual(voltarStatus("corte", "entrega", "x", true), { ok: false, motivo: "nao_e_anterior" });
});

test("Kanban mostra só pedidos a partir da liberação técnica", () => {
  const colunas = cartoesDoKanban([
    { id: 1, status: "pedido_fechado" as const },
    { id: 2, status: "corte" as const },
    { id: 3, status: "aguardando_liberacao_tecnica" as const },
  ]);
  assert.equal(colunas["corte"].length, 1);
  assert.equal(colunas["aguardando_liberacao_tecnica"].length, 1);
  assert.equal(Object.keys(colunas).includes("pedido_fechado"), false);
});
