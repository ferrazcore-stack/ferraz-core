import { test } from "node:test";
import assert from "node:assert/strict";
import { validarEmail, validarSenha, funcaoValida, rotuloFuncao } from "./acesso.ts";

test("validarEmail aceita e-mail comum e recusa o incompleto", () => {
  assert.equal(validarEmail("ana@x.com"), true);
  assert.equal(validarEmail("ana@"), false);
  assert.equal(validarEmail(""), false);
});

test("validarSenha exige 8 caracteres", () => {
  assert.equal(validarSenha("1234567"), false);
  assert.equal(validarSenha("12345678"), true);
});

test("funcaoValida aceita só as funções aprovadas", () => {
  assert.equal(funcaoValida("gestor"), true);
  assert.equal(funcaoValida("dono"), false);
});

test("rotuloFuncao devolve o nome em português", () => {
  assert.equal(rotuloFuncao("financeiro"), "Financeiro");
});
