# Roadmap de implantação e critérios de aceite

## Princípio
O roadmap organiza a ordem de validação; não afirma que qualquer fase já esteja concluída. Cada etapa só avança com evidências e aprovação dos responsáveis.

## Fase 0 — Inventário e auditoria
- localizar todos os repositórios e ambientes;
- mapear responsáveis, branches, deploys, tecnologias e integrações;
- listar documentação, funcionalidades, testes e dívidas;
- identificar duplicidades e ativos reutilizáveis;
- registrar lacunas, riscos, custos e dependências;
- não modificar sistemas durante a primeira auditoria.

**Gate:** inventário revisado; estado real separado de intenção/documentação.

## Fase 1 — Arquitetura e governança
- aprovar arquitetura-mestre;
- definir catálogo de módulos e fronteiras;
- formalizar matriz de permissões e risco;
- definir contratos, versionamento e processo de mudança;
- definir padrões de segurança, dados e auditoria.

**Gate:** responsáveis, contratos e políticas documentados e revisados.

## Fase 2 — Piloto Porcelana
- auditar escopo e repositório;
- confirmar problema, público e modelo de negócio;
- pesquisar usuários e jornada;
- criar experiência e identidade próprias;
- entregar um fluxo vertical pequeno e utilizável;
- testar com usuários e medir resultado.

**Gate:** fluxo real validado, custo conhecido e hipótese comercial testada.

## Fase 3 — Consolidar CORE
- extrair apenas capacidades reutilizáveis comprovadas;
- criar serviços compartilhados com contratos;
- validar identidade, autorização, isolamento, logs e observabilidade;
- estabelecer Design System e NIE centrais versionados;
- validar integração sem acoplamento indevido.

**Gate:** pelo menos um consumidor integrado com testes de isolamento e regressão.

## Fase 4 — Produtos seguintes
Auditar e planejar FERRAZ, My House e outros produtos separadamente. Reutilizar apenas capacidades adequadas e manter UX, dados e regras próprias.

**Gate:** caso de negócio, arquitetura, orçamento, riscos e equipe aprovados por produto.

## Fase 5 — Automação e escala
- introduzir agentes primeiro em leitura e recomendação;
- testar execução em sandbox;
- habilitar ações limitadas por permissão;
- configurar monitoramento, limites, auditoria e interrupção;
- expandir apenas com evidência de qualidade.

**Gate:** autonomia demonstrada com segurança, custo e operação sustentáveis.

## Critérios transversais de aceite
1. Objetivo e escopo claros.
2. Requisitos rastreáveis.
3. Nenhum segredo no repositório.
4. Testes adequados executados e registrados.
5. Isolamento e permissões verificados.
6. Acessibilidade e responsividade verificadas.
7. Logs e alertas necessários configurados.
8. Custos e limites conhecidos.
9. Documentação e suporte atualizados.
10. Revisor independente aprovou.
11. Plano de rollback/recuperação disponível.
12. Aprovação humana obtida para decisões críticas.

## Estado e comunicação
Usar os estados: **Não iniciado**, **Em auditoria**, **Em construção**, **Em revisão**, **Bloqueado**, **Homologado**, **Em produção**, **Descontinuado**. Não usar “pronto” sem critérios de aceite e evidências.
