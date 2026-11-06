# 07 — Qualidade, auditoria e homologação

## 1. Revisões obrigatórias
- **Funcional:** resolve o problema e atende aos critérios?
- **Produto/UX:** a jornada é compreensível e adequada ao usuário?
- **Técnica:** arquitetura, código, dados e integrações são sustentáveis?
- **Segurança/SEAL:** há controle de acesso, isolamento, privacidade e trilha?
- **Qualidade/QA:** testes cobrem caminhos felizes, erros e limites?
- **Operação:** há suporte, monitoramento, recuperação e responsável?
- **Financeira:** custos, limites e benefício esperado são conhecidos?

## 2. Pirâmide de testes
- unidade para regras e cálculos;
- integração para banco, APIs, permissões e eventos;
- ponta a ponta para fluxos prioritários;
- regressão para correções;
- acessibilidade e responsividade;
- segurança e isolamento entre organizações;
- testes de carga conforme necessidade e risco.

## 3. Evidências
Cada execução registra versão/commit, ambiente, data, responsável, caso de teste, resultado, evidência e defeitos. Dados sintéticos devem ser identificados como sintéticos. Não usar dados reais em ambientes de teste sem autorização e proteção apropriadas.

## 4. Bloqueadores de liberação
- acesso indevido ou falha de isolamento;
- perda ou corrupção de dados;
- exposição de segredos ou dados pessoais;
- ausência de autenticação/autorização adequada;
- falha em fluxo essencial;
- vulnerabilidade crítica/alta sem tratamento ou aceite formal cabível;
- backup/recuperação insuficientes para a criticidade;
- custo operacional sem limite ou responsável.

## 5. Decisão final
QA e SEAL recomendam; a direção decide conforme alçada. A liberação exige registro explícito, versão identificada, escopo, riscos residuais, responsáveis, monitoramento e rollback.
