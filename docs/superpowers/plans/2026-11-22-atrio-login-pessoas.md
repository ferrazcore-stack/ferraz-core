# Átrio: login e tela Pessoas — Plano de implementação

> **Para execução:** implementar tarefa por tarefa, na ordem. Passos com checkbox.

**Objetivo:** entrar com e-mail e senha; o mestre convida pessoas, define a função e altera acessos da própria empresa.

**Spec:** `docs/ATRIO-SPEC-V1.md` e `ATRIO-CENTRAL.md` (seções 19 e 20, acessos).

**Arquitetura:** tela própria em `/atrio`, separada do painel Ferraz (`App.tsx` não muda). Acesso real vem do banco (tabela `membros` e RLS já aplicados). Convite roda numa função de servidor, pois precisa de chave administrativa que não pode ir ao navegador.

**Stack:** React + TypeScript + Vite + Supabase (Auth, PostgREST, Edge Function em Deno).

## Restrições globais
- Função de acesso válida: `gestor`, `vendedor`, `tecnico`, `financeiro`. (Decisão minha; o mestre é um campo à parte.)
- Senha mínima de 8 caracteres.
- Nenhum dado de outra empresa pode aparecer na tela (o banco garante; a tela não depende disso).

## Revisão de foco
1. E-mail mal formado no convite → mensagem clara, sem chamada ao servidor.
2. Convite para e-mail que já tem conta → erro explicado, não cria vínculo duplicado.
3. Usuário sem vínculo entra → tela "Sem acesso a nenhuma empresa", sem dados.
4. Não-mestre tenta convidar → servidor recusa (403).
5. Função inválida enviada ao servidor → recusada.

## Tarefa 1: regras puras de acesso
**Arquivos:** Criar `src/lib/atrio/acesso.ts`, `src/lib/atrio/acesso.test.ts`
**Interfaces:** Produz `FUNCOES`, `validarEmail(s): boolean`, `validarSenha(s): boolean`, `rotuloFuncao(f): string`, `funcaoValida(f): boolean`.

- [ ] Teste: `validarEmail("ana@x.com") === true`; `"ana@"` e `""` → false. `validarSenha("1234567") === false`, `"12345678"` → true. `funcaoValida("gestor")` true, `"dono"` false.
- [ ] Rodar: `node --experimental-strip-types --test src/lib/atrio/acesso.test.ts` → falha.
- [ ] Implementar as funções acima.
- [ ] Rodar de novo → passa.

## Tarefa 2: camada de acesso ao Supabase
**Arquivos:** Criar `src/lib/atrio/acessoApi.ts`
**Interfaces:** Produz `entrar(email, senha)`, `sair()`, `sessaoAtual()`, `meusVinculos()` → `{empresa_id, nome, mestre, funcao}[]`, `listarPessoas(empresaId)`, `mudarFuncao(empresaId, userId, funcao)`, `convidarPessoa(empresaId, email, funcao)`.

- [ ] Implementar usando `supabase` de `src/lib/supabase.ts`. `meusVinculos` lê `membros` com join em `empresas(nome)`. `convidarPessoa` chama `supabase.functions.invoke("convidar-pessoa", {body})`.
- [ ] Verificação: `npx tsc --noEmit -p tsconfig.app.json` sem erro nesse arquivo.

## Tarefa 3: função de convite (servidor)
**Arquivos:** Criar `supabase/functions/convidar-pessoa/index.ts`

- [ ] Recebe `{empresa_id, email, funcao}`. Valida campos (recusa com 400).
- [ ] Verifica com o token do chamador: `rpc("e_mestre", {eid})`. Se falso → 403.
- [ ] Com chave de serviço: `auth.admin.inviteUserByEmail(email)`; insere em `membros` com `mestre=false`, `funcao`.
- [ ] Erro "já registrado" → 409 com mensagem em português.
- [ ] Publicar com a ferramenta de Supabase. Testar: chamada sem token → 401/403; função inválida → 400.

## Tarefa 4: tela de login e gate
**Arquivos:** Criar `src/atrio/AtrioApp.tsx`, `src/atrio/atrio.css`; Modificar `src/main.tsx` (rota `/atrio`).

- [ ] Tela de login: e-mail, senha, botão Entrar, mensagem de erro.
- [ ] Sem sessão → login. Com sessão sem vínculo → "Sem acesso a nenhuma empresa" + Sair.
- [ ] Verificação: `npm run build` sem erro.

## Tarefa 5: tela Pessoas
**Arquivos:** Criar `src/atrio/PessoasPanel.tsx`

- [ ] Lista pessoas da empresa (nome do usuário não existe no banco; mostrar e-mail não é possível sem admin — mostrar "Pessoa" + função + mestre). Decisão: sem e-mail na lista; o convite guarda só o vínculo.
- [ ] Mestre: formulário convidar (e-mail + função) e troca de função. Não-mestre: vê a lista, sem botões.
- [ ] Erros do servidor aparecem na tela.
- [ ] Verificação: `npm run build`.

## Tarefa 6: testes e verificação final
- [ ] `node --experimental-strip-types --test src/lib/atrio/*.test.ts` → todos passam.
- [ ] `npm run build` → sem erro.
- [ ] Testar com dois usuários temporários no banco (criados e apagados ao final) que o convite recusa não-mestre e que a lista não mostra outra empresa.
- [ ] Commit na branch `atrio`.
