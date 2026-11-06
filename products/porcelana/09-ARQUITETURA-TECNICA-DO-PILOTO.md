# 09 — Arquitetura técnica do piloto Porcelana

**Estado:** arquitetura de referência; stack e implementação dependem da auditoria dos ativos existentes.  
**Objetivo:** começar pequeno, funcional e independente, com interfaces claras para integração futura ao CORE.

## 1. Princípio arquitetural
A Porcelana deve nascer como produto independente, não como módulo acoplado ao código interno do CORE. A integração futura ocorrerá por contratos versionados e serviços explícitos. Não criar dependência direta de tabelas internas de outro produto.

## 2. Estrutura lógica proposta
- **Experiência:** aplicação web responsiva e acessível; interface específica da Porcelana.
- **Aplicação:** casos de uso e regras do produto, separados da apresentação.
- **Domínio:** entidades, políticas e validações próprias da Porcelana, ainda a descobrir.
- **Dados:** persistência própria, migrações versionadas e acesso encapsulado.
- **Integrações:** adaptadores para serviços externos e contratos do CORE, quando existirem e forem aprovados.
- **Observabilidade:** logs estruturados, métricas, rastreio de erros e trilha de auditoria sem dados sensíveis desnecessários.
- **Segurança:** autenticação, autorização no servidor, gestão de segredos, minimização de dados e política de backup.

## 3. Organização inicial de código
A estrutura final deve respeitar o stack auditado. Como referência, separar:
- app / rotas e composição;
- modules / funcionalidades de negócio;
- domain / entidades e regras;
- application / casos de uso;
- infrastructure / banco, arquivos e integrações;
- shared / componentes e utilitários realmente comuns;
- tests / unidade, integração e ponta a ponta;
- docs / decisões, operação e contratos.

Não criar pastas vazias ou abstrações sem uso real.

## 4. Contratos de integração com CORE
Cada integração precisa declarar:
- serviço provedor e consumidor;
- finalidade e dados mínimos;
- versão e esquema;
- autenticação, autorização e tenant;
- timeouts, limites, retentativas e idempotência;
- erros e observabilidade;
- compatibilidade e descontinuação;
- testes de isolamento;
- aprovação de segurança.

Até o CORE possuir serviços reais e homologados, usar adaptadores locais e contratos simulados claramente identificados. Não fingir que uma integração existe.

## 5. Decisões tecnológicas pendentes de auditoria
Não fixar framework, banco, hospedagem, provedor de IA ou ferramenta de deploy antes de:
1. localizar protótipos e repositórios existentes;
2. verificar stack, estado, licenças e custos;
3. comparar reutilização versus reconstrução;
4. verificar portabilidade e exportação de dados;
5. avaliar segurança, suporte e capacidade de manutenção.

## 6. Requisitos mínimos para iniciar implementação
- escopo do MVP aprovado;
- fluxo e usuário prioritários confirmados;
- modelo de dados inicial revisado;
- ambiente local e homologação separados;
- migrações e dados sintéticos;
- autenticação/autorização adequadas ao risco;
- testes automatizados para regras críticas;
- pipeline de build e validação;
- política de logs, backups e recuperação;
- responsável técnico e revisor independente.

## 7. Integração futura sem reconstrução
Manter domínio e interfaces do produto independentes. Extrair para o CORE apenas serviços comprovadamente horizontais, após testes de contrato, autorização, isolamento, regressão e plano de reversão.
