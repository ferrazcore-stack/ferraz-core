# Auditoria técnica inicial — ferraz-core

**Data da inspeção:** 2026-11-06  
**Escopo:** leitura estática dos arquivos disponíveis na branch `main`.  
**Status:** diagnóstico preliminar; não é pentest, não é execução de build e não é homologação.

## 1. Repositório e escopo
- Repositório público: `ferrazcore-stack/ferraz-core`.
- Branch padrão: `main`.
- Aplicação identificada: React + TypeScript + Vite.
- Integração de dados: Supabase JS.
- A inspeção foi somente de leitura; nenhum arquivo da branch principal foi alterado.

## 2. Achados prioritários

### A-01 — Roteamento de módulos inconsistente
**Evidência:** `src/App.tsx` importa `OperationsPanel`, mas o fluxo de renderização mostrado encaminha todos os módulos diferentes de Dashboard para `CommercialPanel`.  
**Risco:** telas de medição, produção e expedição podem não ser exibidas pelo painel esperado.  
**Prioridade:** alta.  
**Próxima ação:** corrigir o roteamento por módulo e criar testes de navegação.

### A-02 — Dados demonstrativos no dashboard
**Evidência:** `src/App.tsx` define `demoOrders` fixos e os utiliza como estado inicial; se Supabase não estiver configurado, esses dados aparecem no painel. Há prazos demonstrativos fixos no componente.  
**Risco:** uma pessoa pode confundir registros fictícios com dados reais.  
**Prioridade:** alta.  
**Próxima ação:** identificar visualmente o modo demonstração, remover datas/valores fictícios de telas de produção e impedir que demonstrações sejam interpretadas como dados oficiais.

### A-03 — Isolamento multiempresa ainda não comprovado
**Evidência:** funções em `src/lib/commercial.ts` e `src/lib/operations.ts` fazem consultas a tabelas e views sem filtro explícito de `organization_id`; algumas inserções incluem `organization_id`.  
**Risco:** a segurança depende de políticas RLS e de como views/functions foram configuradas no banco. O frontend, por si só, não comprova isolamento.  
**Prioridade:** crítica até verificação.  
**Próxima ação:** auditar migrations, policies RLS, views, grants, funções SQL e testes cruzados entre tenants. Não liberar dados reais antes disso.

### A-04 — Testes automatizados não configurados no manifesto
**Evidência:** `package.json` apresenta scripts `dev`, `build` e `preview`; não declara script de testes ou lint.  
**Risco:** não há comando documentado de regressão automatizada neste manifesto.  
**Prioridade:** alta.  
**Próxima ação:** definir estratégia de testes e adicionar scripts/dependências após confirmar compatibilidade e lockfile.

### A-05 — Dependências declaradas como latest
**Evidência:** `package.json` usa `latest` para React, Vite, TypeScript, Supabase e outras dependências.  
**Risco:** builds futuros podem mudar sem alteração explícita do projeto; reprodutibilidade reduzida.  
**Prioridade:** média/alta.  
**Próxima ação:** verificar lockfile e versões efetivamente instaladas; fixar versões compatíveis e revisar atualizações controladamente.

### A-06 — Workflow SLSA não valida o produto
**Evidência:** `.github/workflows/generator-generic-ossf-slsa3-publish.yml` gera arquivos de exemplo chamados `artifact1` e `artifact2`.  
**Risco:** sua presença pode ser confundida com pipeline de build, testes ou auditoria de segurança da aplicação.  
**Prioridade:** alta para clareza de governança.  
**Próxima ação:** documentar o propósito real e criar workflows separados para build, testes, análise estática e verificação de dependências. Não declarar certificação ou segurança aprovada com base neste workflow.

### A-07 — Transição de pedido sem validação de estado visível
**Evidência:** `transitionOrder` em `src/lib/operations.ts` atualiza status diretamente e depois tenta inserir evento; não foi identificada nesta leitura uma máquina de estados ou transação atômica.  
**Risco:** transições inválidas e histórico incompleto se a segunda operação falhar.  
**Prioridade:** alta.  
**Próxima ação:** centralizar transições no backend com validação, autorização, transação e trilha de auditoria.

### A-08 — Fluxo de cadastro e telas incompletos
**Evidência:** alguns módulos exibem mensagens de preparação ou textos de próxima etapa, em vez de fluxo funcional completo.  
**Risco:** aparência de funcionalidade pode exceder o que está implementado.  
**Prioridade:** média/alta.  
**Próxima ação:** inventariar cada módulo como funcional, parcial, demonstrativo ou ausente; criar critérios de aceite.

## 3. O que ainda não foi verificado
- Build real e instalação limpa.
- Conteúdo do lockfile e vulnerabilidades das dependências.
- Schema completo do Supabase.
- Policies RLS, views, funções SQL, triggers e grants.
- Autenticação, recuperação de senha e ciclo de sessão.
- Regras de autorização por papel.
- Storage e exposição de arquivos.
- Logs, backups e recuperação.
- Deploy, variáveis de ambiente e configuração de produção.
- Testes funcionais, acessibilidade, desempenho e segurança dinâmica.

## 4. Ordem recomendada de trabalho
1. Auditar banco, migrations e RLS; bloquear teste com dados reais até confirmar isolamento.
2. Corrigir roteamento e estado demonstrativo.
3. Verificar instalação limpa, lockfile e build.
4. Criar testes unitários, integração e end-to-end.
5. Validar transições e histórico no backend.
6. Adicionar CI de build, testes, análise estática e dependências.
7. Executar homologação isolada com dados sintéticos.
8. Fazer revisão independente e registrar aprovação antes de qualquer release.

## 5. Regras de comunicação
- "Encontrado no código" não significa "testado".
- "Documentado" não significa "implementado".
- "Build passou" não significa "seguro".
- "RLS configurado" só pode ser declarado após inspecionar policies e testar acesso cruzado.
- Nenhum dado real ou ambiente de produção deve ser usado em teste destrutivo.
- Cada correção deve ter responsável, evidência, teste, revisão e rollback quando aplicável.

**Conclusão:** o repositório contém uma aplicação inicial e documentação de domínio aproveitáveis. Há achados concretos que precisam ser tratados, especialmente roteamento, dados de demonstração e comprovação do isolamento multiempresa. A aplicação permanece **não homologada para produção** até concluir as verificações pendentes.
