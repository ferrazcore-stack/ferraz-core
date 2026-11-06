# Agentes, DOTS e orquestração

## 1. Objetivo
Usar agentes como força de trabalho digital especializada, coordenada e auditável. O sistema deve convocar capacidades sob demanda, não manter centenas de agentes ociosos ou duplicados.

## 2. Papéis funcionais
- **Investigador:** coleta informações e fontes.
- **Questionador/diagnosticador:** identifica lacunas, premissas e contradições.
- **Planejador:** transforma objetivo em plano, etapas e critérios de aceite.
- **Especialista:** aplica conhecimento de domínio.
- **Executor:** realiza tarefa autorizada.
- **Coordenador/orquestrador:** distribui trabalho e resolve dependências.
- **Supervisor:** acompanha progresso, qualidade e impedimentos.
- **Revisor:** verifica entrega independente do executor.
- **Auditor/SEAL:** avalia controles, evidências e riscos.
- **Corretor:** propõe e executa correções autorizadas após diagnóstico.

Um agente pode desempenhar mais de um papel em tarefas simples; em tarefas críticas, separar execução e revisão.

## 3. Fluxo do orquestrador
1. Receber pedido e identificar produto, empresa, usuário e objetivo.
2. Consultar apenas memória e dados autorizados daquele contexto.
3. Classificar a tarefa, risco, prazo e dependências.
4. Selecionar competências de um catálogo versionado.
5. Criar plano, responsáveis, entradas, saídas e critérios de aceite.
6. Delegar tarefas independentes em paralelo quando seguro.
7. Acompanhar andamento, custo, erros e bloqueios.
8. Consolidar resultados com fontes e nível de confiança.
9. Submeter a revisão independente.
10. Solicitar aprovação humana para ações da alçada.
11. Executar/liberar e registrar o histórico.

## 4. Memória e contexto
Separar:
- **Memória de núcleo:** políticas, padrões técnicos, catálogo de capacidades e decisões compartilháveis.
- **Memória do produto:** domínio, arquitetura, roadmap e decisões próprias.
- **Memória da empresa cliente:** dados, configurações e histórico isolados.
- **Contexto de tarefa:** informações temporárias e estritamente necessárias.

Toda memória deve indicar fonte, data, empresa/produto, finalidade, classificação e versão. Classificações mínimas: verificado, hipótese, decisão aprovada, pendência, obsoleto e rejeitado. Não usar dado de uma empresa para beneficiar ou responder a outra.

## 5. Ferramentas e permissões
Cada agente recebe:
- identidade própria;
- escopo de dados mínimo;
- ferramentas permitidas;
- operações permitidas e bloqueadas;
- limite de custo/tempo;
- exigência de aprovação;
- trilha de auditoria.

A autorização real deve ser aplicada na API/serviço e no banco, não apenas no prompt. Segredos não devem ser expostos ao modelo ou gravados em logs.

## 6. O que agentes não podem fazer
- elevar suas próprias permissões;
- criar agentes com autoridade maior;
- desligar logs, auditoria, segurança ou limites;
- acessar dados de outro tenant sem autorização;
- inventar fatos, preços, disponibilidade, pagamentos ou resultados;
- enviar comunicação externa não aprovada quando a política exigir aprovação;
- efetuar pagamento, contratar, assinar, apagar ou publicar sem autorização adequada;
- alterar políticas críticas por conta própria;
- ocultar erro, conflito de interesse ou falha;
- aprovar seu próprio trabalho crítico;
- afirmar monitoramento contínuo quando não existe mecanismo configurado.

## 7. Autonomia gradual
Fase 1: leitura e diagnóstico.  
Fase 2: recomendações e rascunhos.  
Fase 3: execução em ambiente de teste.  
Fase 4: execução limitada e reversível, com logs e limites.  
Fase 5: automação em produção por política, com monitoramento, kill switch e revisão periódica.

A progressão depende de evidência de qualidade e segurança, não apenas de demonstração bem-sucedida.

## 8. Métricas
Taxa de conclusão, retrabalho, erro factual, violações de permissão, tarefas escaladas, tempo de ciclo, custo por tarefa, chamadas repetidas, falhas de ferramenta, qualidade de revisão e impacto operacional.
