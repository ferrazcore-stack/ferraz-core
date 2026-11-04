# Auditoria cruzada PORCELANE — sistema atual × planilha disponível × código

Data: 04/11/2026  
Branch auditada: `feature/integracao-porcelane`  
Repositório: `ferrazcore-stack/ferraz-core`  
Status: auditoria parcial baseada em evidência acessível; planilha original não localizada.

## 1. Escopo e limite de evidência

Fontes efetivamente consultadas:
1. `docs/PORCELANE_CURRENT_SYSTEM_BASELINE.md`: detalhamento funcional do sistema atual fornecido nesta conversa.
2. `docs/PORCELANE_TEST_SCENARIO.md`.
3. `src/lib/porcelane/domain.ts`.
4. `src/lib/porcelane/fixtures.ts`.
5. `src/lib/porcelane/acceptance.ts`.
6. `src/lib/porcelane/scenario.ts).

Busca no repositório por `Planilha_Mestra_Integrada_Gestao_Marmoraria`, `PORCELANE planilha mestra`, `85 abas porcelane` e `comissao m2 corte porcelane` não encontrou arquivo nem conteúdo da planilha. Portanto, **não foi possível inspecionar as 85 abas, fórmulas, dados históricos, listas, validações ou totais da planilha gerada anteriormente**. Esta auditoria não declara compatibilidade com a planilha; marca esse cruzamento como pendente por falta da fonte.

## 2. Resumo executivo

- O baseline funcional está documentado e cobre quatro Hubs, perfis, rotas, regras comerciais, produção, financeiro, integrações e pendências.
- O código PORCELANE atual é um protótipo de domínio/fixture, não um sistema operacional integrado às telas, APIs ou banco.
- Há cobertura parcial de geometria e gates de liberação/corte/expedição/instalação.
- Não há evidência de implementação de orçamento, cálculo comercial, pagamento, comissão, calendário de feriados, geração documental, integrações Drive/Trello/BotConversa/Amanda, autorização por perfil ou portal de funcionário no módulo PORCELANE auditado.
- Não há nesting/paginação otimizada: o código atual apenas valida e simula gates; não calcula posicionamento em chapas nem rendimento.
- Testes e build ainda não foram executados nesta auditoria; `runPorcelaneAcceptance()` é uma função de aceitação, não prova de execução.
- Supabase permanece intocado e fora desta etapa.

## 3. Matriz cruzada: requisito × código × planilha

Legenda: **Documentado** = consta do baseline; **Parcial** = há código limitado; **Ausente no escopo inspecionado** = não foi localizado nos arquivos PORCELANE consultados; **Pendente planilha** = não verificável sem a planilha.

| Domínio / regra | Sistema atual | Código PORCELANE | Planilha | Resultado |
|---|---|---|---|---|
| Quatro Hubs e rotas | Documentado | Ausente no escopo inspecionado | Pendente | Documentado, não implementado no módulo auditado |
| Perfis e permissões | Documentado | Ausente no escopo inspecionado | Pendente | Alto risco; autorização backend não demonstrada |
| Orçamento com ambientes/peças/serviços | Documentado | Ausente | Pendente | Não compatível ainda por falta de implementação |
| Insumos fora do total do ambiente | Regra documentada | Ausente | Pendente | Regra crítica sem teste |
| Fretes, instalação mínima, desconto e pagamento 40/60 | Documentado | Ausente | Pendente | Cálculo comercial não implementado no módulo |
| PDF cliente sem desconto | Documentado | Ausente | Pendente | Saída documental não implementada |
| Aprovação cria um único pedido | Documentado | Ausente | Pendente | Idempotência não implementada/demonstrada |
| Snapshot comercial imutável | Documentado | Modelo atual não contém snapshot comercial | Pendente | Lacuna estrutural |
| Medição e liberação parcial | Documentado | Parcial: status e gate por peça | Pendente | Conceito parcial, sem histórico/versionamento de medição |
| Prazo 30 dias úteis PE/Recife | Documentado | Ausente | Pendente | Calendário e cálculo não implementados |
| Geometria em mm e área líquida | Não detalhado no baseline | Parcial: reutiliza `cad/geometry` | Pendente | Validar fórmula e casos com planilha |
| Desenho 2D/3D e anexos | Documentado | Apenas aprovação booleana de desenho | Pendente | Motor CAD/3D não implementado aqui |
| Paginação/nesting e aproveitamento | Esperado no escopo técnico TEC | Ausente; sem algoritmo de layout | Pendente | Lacuna crítica |
| Chapas e reserva | Não detalhado na tela atual | Parcial: fixture e validação de status | Pendente | Sem estoque transacional |
| Retalhos e rastreabilidade | Não detalhado na tela atual | Parcial: vínculo simples à chapa | Pendente | Sem cálculo/consumo/transferência |
| Ordem de corte/acabamento/romaneio | Documentado | Parcial: plano de corte abstrato | Pendente | Documentos e execução não implementados |
| Produção e gates por etapa | Documentado | Parcial: funções de bloqueio | Pendente | Sem transições persistidas nem trilha de auditoria |
| Inspeção/entrega/instalação | Documentado | Parcial: gates simples | Pendente | Sem evidência, responsável, data ou aceite |
| Contas a receber/pagar e recibos | Documentado | Ausente | Pendente | Financeiro não implementado |
| Comissões e RH | Documentado, algumas regras incompletas | Ausente | Pendente | Regras precisam conciliação com planilha |
| Relatórios diário/obras/vendas | Documentado | Ausente | Pendente | Não implementado no módulo |
| Drive/Trello/Amanda/BotConversa | Documentado | Ausente | Pendente | Integrações não demonstradas |
| Backups, assistente e marketing | Documentado | Ausente | Pendente | Não implementado no módulo |
| Portal funcionário CPF+PIN | Documentado | Ausente | Pendente | Autenticação/autorização não implementadas |
| Importação de PDF e catálogo | Documentado | Ausente | Pendente | Não implementado no módulo |

## 4. Achados técnicos no código existente

### P0 — impedir considerar o fluxo pronto
1. **Sem enforcement no servidor:** gates em TypeScript são funções locais. Podem ser contornados se a operação real não repetir as validações no backend.
2. **Sem persistência e trilha de auditoria:** não há transações, autor, timestamps, motivo, evidências, histórico de revisão nem proteção concorrente.
3. **Sem modelo comercial:** `PorcelaneOrder` não guarda orçamento aprovado, valores, parcelas, serviços, insumos, desconto, fretes ou snapshot imutável.
4. **Sem motor de paginação:** chapa e retalho são registros sintéticos; não existe algoritmo de nesting, kerf aplicado ao layout, rotação, veio, defeitos, margens ou cálculo de rendimento.
5. **Sem autenticação/autorização:** os perfis do baseline não aparecem no módulo PORCELANE inspecionado.

### P1 — integridade do domínio
1. `validateOrderConsistency` cria `environmentIds` a partir dos próprios ambientes e depois testa cada item contra esse mesmo conjunto; a condição não detecta ambiente sem ID de forma útil e IDs duplicados de ambiente não são reportados.
2. A consistência do pedido não valida unicidade de IDs de chapa, plano ou retalho.
3. Retalhos validam dimensões positivas e chapa de origem, mas não validam material/espessura compatíveis com a chapa, limites dimensionais da chapa, disponibilidade nem consumo duplo.
4. `canApproveCutPlan` verifica que a chapa está reservada, mas não prova que a reserva pertence àquele pedido/plano ou que a capacidade da chapa comporta as peças.
5. `canStartProduction` só verifica status `cut` e presença de `cutPlanId`; não confirma que o plano existe, está aprovado ou contém a peça.
6. `canInstallPiece` verifica status entregue, mas não exige aceite, equipe, checklist ou confirmação de instalação.
7. O modelo possui `revision` numérica, mas não relaciona uma revisão de desenho/medição aprovada ao plano de corte; uma alteração posterior pode deixar referência obsoleta.
8. Quantidades e dimensões são números JS; faltam limites, precisão decimal definida e política de arredondamento.

### P1 — divergência de fluxo
O baseline lista “Aguardando projeto → Liberação técnica → Corte → Romaneio → Em produção → Instalação → Entrega → Finalizado”. O código possui estados de peça `nested/cut/finished/inspected/loaded/delivered/installed`, mas não modela a fila do pedido nem a posição do romaneio. É necessário definir se romaneio é documento logístico gerado após corte, antes de carregamento, ou etapa interna da produção; não assumir que os dois fluxos são equivalentes.

### P2 — regras de negócio que não devem ser codificadas sem conciliação
- Comissão de vendedor interno: faixa mensal e aplicação da taxa maior sobre todo o mês; definir competência, estorno, cancelamento e mudança de faixa.
- Vendedor externo/arquiteto: valores não informados.
- Medição/liberação 2%: base de cálculo e rateio não definidos.
- Cortador: R$ 16/m² e R$ 15 para nicho/divibox; unidade dos valores especiais precisa ser confirmada.
- Acabador: 5% do ambiente com desconto e valores fixos por serviço; definir sobreposição de regras e arredondamento.
- Instalação percentual e mínimo configurável; definir se a base inclui serviços/aditivos e como trata desconto.
- Insumos: controlar quantidades sem somar ao valor do ambiente; confirmar se aparecem no total geral em linha separada e se entram no custo da obra.
- Prazo de 30 dias úteis: marco inicial após liberação técnica completa ou por ambiente; definir feriados e calendário municipal/estadual.

## 5. Divergências e decisões de arquitetura

1. **Pedido versus ambiente versus peça:** manter estado técnico granular por peça e ambiente; não reduzir tudo a um único status de pedido. O pedido deve agregar progresso sem liberar peças pendentes.
2. **Comercial versus técnico:** snapshot comercial aprovado deve ser imutável; medições e revisões técnicas devem guardar dimensões medidas em entidade/versionamento separado.
3. **Área comercial versus área liberada:** são métricas distintas e precisam de campos e fórmulas separadas; não recalcular o orçamento com medidas de campo.
4. **Insumos:** item separado do subtotal do ambiente, mas classificar explicitamente sua natureza (controle, custo ou repasse) antes de somar em relatórios.
5. **TEC:** geometria/nesting deve ser serviço/motor independente com contratos versionados; FERRAZ/PORCELANE não devem duplicar algoritmos.
6. **Empresa:** todos os registros operacionais futuros devem ter escopo de empresa/tenant, mesmo que PORCELANE seja a primeira implantação.
7. **Documentos:** PDFs e ordens devem ser snapshots rastreáveis da revisão usada; reimpressão não deve gerar lançamentos ou ordens duplicadas.

## 6. Plano de correção recomendado antes do Supabase

1. Corrigir e ampliar validações de domínio (IDs únicos, revisões, vínculos, reservas, retalhos e consistência de estados).
2. Definir entidades independentes para orçamento/snapshot, pedido, ambiente, peça, medição/revisão, aprovação, desenho, plano de corte, chapa, reserva, retalho, operação, inspeção, entrega e instalação.
3. Implementar cálculo comercial puro e testável, com regras configuráveis e versões de vigência.
4. Implementar fluxo de aprovação idempotente e transições com trilha de auditoria.
5. Construir contrato do TEC e algoritmo de paginação/nesting com fixtures e casos de teste.
6. Mapear todos os documentos e integrações sem conectar serviços externos ainda.
7. Criar testes automatizados e executar build/typecheck/testes em ambiente isolado.
8. Só depois preparar modelo relacional, migrations, RLS e importação no Supabase.

## 7. Cruzamento com a planilha — pendência bloqueante

Para concluir o cruzamento de dados, ainda precisamos recuperar a planilha gerada na conversa anterior. O arquivo não foi encontrado na branch nem nos resultados de busca do GitHub. Sem o binário XLSX não é possível validar:
- nome e ordem das 85 abas;
- fórmulas, referências entre abas e células protegidas;
- tabelas, listas suspensas e validações;
- exemplos e dados reais usados como referência;
- totais, cálculos de área, comissões, preços, custos e prazos;
- divergências entre dados da planilha e regras narradas.

Não inventar valores nem reconstruir fórmulas a partir de suposições. Até recuperar a planilha, manter os itens acima como “não verificados”.

## 8. Critério de conclusão desta auditoria

Esta auditoria parcial está concluída como comparação entre baseline funcional e código PORCELANE inspecionado. A auditoria completa de três fontes continua aberta até a recuperação da planilha e execução de testes automatizados. Nenhuma migration, importação, alteração de Supabase, deploy ou mudança de produção foi feita.
