# Auditoria cruzada PORCELANE — evidências disponíveis

Data: 04/11/2026  
Escopo: cruzamento entre o baseline funcional informado pelo usuário, o código PORCELANE na branch `feature/integracao-porcelane`, o núcleo FERRAZ Core e o protótipo FERRAZ Platform.  
Limitação: a planilha Excel de 85 abas não está disponível nos repositórios consultados. Portanto, este relatório não afirma ter conferido suas fórmulas ou registros. Os dados de demonstração encontrados no FERRAZ Platform são sintéticos e não devem ser tratados como dados reais da PORCELANE.

## 1. Resumo executivo

A documentação funcional descreve uma operação de marmoraria significativamente mais completa que o código atualmente presente no Core e no Platform. Há ativos reaproveitáveis, mas ainda não existe evidência de integração ponta a ponta.

- **Aproveitável no FERRAZ Platform:** cadastro demonstrativo de clientes, projetos, materiais e fornecedores; comparação de cotações; cálculo de custo completo, desperdício, margem e preço; geração de documentos imprimíveis; histórico e clonagem de versões.
- **Aproveitável no FERRAZ Core:** contexto de organização/usuário, cadastros comerciais, orçamentos, pedidos, medições, tarefas de produção e entregas via adaptador Supabase; núcleo geométrico 2D; gates iniciais PORCELANE.
- **Implementação PORCELANE atual:** domínio, fixture e oito verificações de aceitação declaradas em código. Ainda são modelos e funções isolados, não uma operação conectada às telas e ao backend.
- **Risco principal:** os três modelos de dados não estão unificados. A Platform usa estado local e entidades próprias; Core usa tabelas Supabase; PORCELANE usa tipos e fixtures próprios.

## 2. Matriz cruzada de capacidades

Legenda: **Parcial** = há estrutura ou função relacionada, mas não satisfaz integralmente o requisito. **Ausente** = não foi encontrada evidência nos arquivos consultados. **Não validado** = requer dados/execução adicional.

| Área / regra PORCELANE | Evidência no FERRAZ Platform | Evidência no FERRAZ Core / PORCELANE | Resultado |
|---|---|---|---|
| Clientes e obras | `storage.js`: clients/projects de demonstração | `commercial.ts`: Customer/Project e CRUD Supabase | Parcial; campos e IDs precisam de contrato comum |
| Materiais e fornecedores | catálogo e fornecedores em estado local; comparação por fornecedor | não foi localizada integração equivalente no domínio PORCELANE | Parcial |
| Orçamento por ambiente/peça | `proposalDocument` usa itens, ambiente, peça, quantidade, material e serviços do projeto | `Budget` e `OrderItem` no Core, mas sem editor PORCELANE completo | Parcial; faltam componentes de cálculo específicos |
| Insumos fora do subtotal do ambiente | Platform inclui `inputs` dentro de `completeCost` da cotação e pode compor custo/preço do item | baseline PORCELANE determina insumo em linha própria, sem somar no valor do ambiente | Divergência de semântica; separar insumo operacional do custo/preço comercial antes de reutilizar |
| Frete, instalação, rodapé e mínimos | custo completo possui freight/installation genéricos | baseline lista componentes separados; Core não implementa esse detalhamento | Ausente/parcial |
| Desconto interno e PDF sem desconto | `proposalDocument` calcula desconto e `proposalPrintHtml` o imprime explicitamente | baseline exige desconto oculto no PDF ao cliente | **Conflito direto**: não reutilizar o template de proposta sem adaptar a política de apresentação |
| Aprovação cria pedido único | Platform congela versão, mas não cria pedido idempotente | Core cria orçamento; transição de pedido genérica; fixture tem pedido sintético | Ausente; requer operação transacional/idempotente |
| Snapshot comercial imutável | `freezeVersion` marca frozen/status, mas não impede mutações posteriores por si só | tipos PORCELANE são Readonly em compile-time, não garantem imutabilidade persistida | Parcial; precisa de regra de domínio e backend |
| Medição separada do comercial | desenhos técnicos Platform usam dimensões do item da versão | Core Measurement existe; PORCELANE Piece tem dimensões e aprovações | Parcial; falta vínculo de medição/revisão sem alterar snapshot comercial |
| Liberação parcial por ambiente/peça | não encontrada | `canReleasePiece` verifica aprovações por peça; fixture contém 2 liberadas e 1 pendente | Parcial; ainda não há transição persistida nem liberação por lote de ambiente |
| Geometria em mm | TechnicalDrawings formata medidas em mm; origem dos campos inclui width/depth etc. | kernel geométrico 2D em mm e fixture sintética | Parcial; mapear unidades e conversões explicitamente |
| Desenhos, cortes e anexos 2D/3D | impressão A4 e lista de corte simples | TEC/Core geométrico inicial; sem prova de 3D ou nesting industrial | Parcial; nesting/3D ainda não demonstrados |
| Paginação e plano de corte | não foi encontrada otimização geométrica de nesting | fixture contém plano e chapa reservada; não calcula posicionamento/otimização | Ausente como algoritmo real |
| Chapas e retalhos | não encontrado no estado local consultado | PORCELANE domain tem slab/offcut e origem do retalho | Parcial; falta consumo, reserva atômica, perdas e reconciliação de estoque |
| Produção e gates | não encontrado como fluxo PORCELANE no Platform | Core tem ProductionTask e Delivery; PORCELANE gates de corte/carregamento/instalação | Parcial; status ainda não é máquina de estados completa |
| Inspeção antes do carregamento | não encontrado | `canLoadPiece` exige status inspected | Regra codificada no domínio, sem evidência de execução em backend |
| Entrega antes da instalação | não encontrado | `canInstallPiece` exige delivered | Regra codificada no domínio, sem persistência |
| Comissões | não foi localizada regra PORCELANE no Platform | baseline descreve regras e pendências; Core não mostra motor de comissões nos arquivos consultados | Ausente; não automatizar antes de confirmar bases |
| Contas a receber/pagar e baixas | não encontradas no Platform consultado | Core tem Order, sem módulo financeiro demonstrado nos arquivos consultados | Ausente/parcial |
| PDFs e relatórios | Platform tem HTML imprimível, proposta e documentos | Core sem evidência de relatórios PORCELANE equivalentes | Reaproveitável com revisão de conteúdo e segurança |
| Perfis e permissões | arquitetura documenta cliente público e administração; app local não prova RBAC seguro | Core obtém usuário e organização; escopo de leitura depende em parte de RLS | Parcial; permissões por módulo/registro não comprovadas |
| Parceiro sem dados financeiros | docs Platform afirmam ocultar custo/margem, mas token público é derivado de ID com Base64 truncado | baseline exige escopo próprio; não há autorização PORCELANE demonstrada | Risco alto; token não é segredo e precisa ser substituído por token aleatório/servidor |
| Portal funcionário CPF + PIN | não encontrado | não encontrado | Ausente |
| Drive/Trello/BotConversa/Amanda | não demonstrado no código consultado | não demonstrado nos arquivos consultados | Ausente/não validado |
| Auditoria e histórico | Platform `appendHistory` salva no localStorage; histórico não é imutável | Core insere evento em transição, mas não verifica erro do insert | Parcial; falta trilha confiável no servidor |

## 3. Divergências e riscos concretos

### D1 — Desconto no documento do cliente
O baseline PORCELANE determina que o desconto não apareça no PDF entregue ao cliente. O `proposalPrintHtml` atual do Platform renderiza a linha de desconto quando maior que zero. É necessário criar um modelo de documento específico para PORCELANE com política de campos permitidos, sem remover o desconto do registro interno.

### D2 — Insumos têm significados diferentes
No Platform, `inputs` é um componente do custo completo da cotação (`completeCost`). No PORCELANE, insumos são controlados em linha própria e não somam ao valor do ambiente. Não mapear diretamente o campo Platform `inputs` para o total comercial PORCELANE. Separar pelo menos:
- custo interno de insumos;
- quantidade/controle de insumos;
- valor comercial cobrado do cliente, se houver regra específica.

### D3 — Quantidade zero versus fallback para 1
O baseline permite quantidade inicial zero no editor. Em `proposalDocument`, `Math.max(1, Number(i.quantity||1))` converte zero, vazio ou inválido em 1. Isso pode gerar cobrança indevida. A função de proposta não deve ser reutilizada sem validação explícita e preservação de zero em rascunhos.

### D4 — Margem de 100% ou superior
`salePriceFromMargin` retorna o custo quando margem >= 100; `proposalDocument` define unitPrice = 0 quando margin >= 100. As duas funções divergem entre si e não representam uma regra comercial segura. Bloquear margem inválida ou definir formalmente o comportamento antes de reaproveitar.

### D5 — Congelamento não equivale a imutabilidade
`freezeVersion` altera flags e registra histórico, mas os objetos permanecem editáveis pelo código cliente e no localStorage. É necessário snapshot persistido e protegido no servidor, com nova revisão para alterações.

### D6 — Link público não tem segredo forte
`publicToken` deriva token de Base64 do ID, truncado a 12 caracteres. Base64 é reversível e não constitui autorização. Não usar para dados de orçamento/pedido. Criar token aleatório de alta entropia, armazenar hash no servidor, expiração/revogação e escopo mínimo.

### D7 — Escopo multiempresa e autorização
Core descobre a primeira associação ativa em `organization_members`, com `limit(1)`, mas os loaders consultados não adicionam filtro explícito de organização. Isso pode depender de RLS. Antes de ampliar, validar policies reais e permitir seleção inequívoca de organização. Não presumir isolamento apenas pelo frontend.

### D8 — Transição de pedido e evento não são atômicos
`transitionOrder` atualiza `orders` e depois insere `order_events`; o erro do segundo insert não é verificado. Pode existir mudança de status sem trilha de auditoria. Além disso, recebe status genérico, sem validar transição/gates. Deve virar comando transacional no backend com máquina de estados e auditoria obrigatória.

### D9 — Plano de corte não valida toda a consistência
`canApproveCutPlan` valida aprovação das peças, desenho e reserva de chapas, mas não valida:
- que cada peça do plano esteja vinculada àquele plano;
- que `reservedSlabIds` das peças coincidam com `slabIds` do plano;
- material e espessura compatíveis entre peça e chapa;
- disponibilidade e dimensões/área útil da chapa;
- sobreposição/kerf/contorno e posicionamento;
- retalhos consumidos/reservados e concorrência de reserva.
O fixture é cenário de gate, não prova de nesting.

### D10 — Critério de aprovação do plano é permissivo
`canApproveCutPlan` rejeita explicitamente plano com status rejected, mas não exige que esteja pending. Assim, plano já aprovado pode continuar elegível para “aprovação”. Separar validação de elegibilidade para aprovação de validação de execução de um plano aprovado.

### D11 — Validação de ambiente contém condição inócua
Em `validateOrderConsistency`, o Set é criado a partir dos IDs de ambientes e, em seguida, verifica-se se cada ambiente do mesmo array pertence ao Set. Essa condição nunca será falsa. Deve validar ID vazio/duplicado e vínculo das peças, não testar pertinência ao próprio conjunto.

### D12 — Prazo, comissões e arredondamentos sem especificação executável
As regras fornecidas incluem 30 dias úteis após medição/liberação, feriados PE/Recife, faixas de comissão, valores por m² e serviços. Há bases ainda não definidas. Não codificar números fixos sem vigência, base de cálculo, regra de arredondamento, estorno e exceções formalizados.

## 4. Ativos a reaproveitar

1. **Platform — catálogo e comparação de fornecedores:** aproveitar estrutura conceitual de materiais, fornecedores e comparação de cotações; migrar do localStorage para contratos de domínio depois de estabilizar regras.
2. **Platform — documentos HTML imprimíveis:** reaproveitar infraestrutura de layout A4, escape de conteúdo e impressão; revisar rigorosamente campos permitidos, desconto, dados internos e dados pessoais.
3. **Platform — histórico e versionamento:** aproveitar o conceito de clonar revisão e registrar evento, mas substituir persistência local e congelamento por operações server-side.
4. **Core — contexto de organização e CRUD comercial:** aproveitar Customer, Project, Budget, Order e adaptador Supabase como ponto de partida, após revisão de RLS/schema.
5. **Core — geometria em mm:** aproveitar o kernel geométrico inicial como base do TEC, expandindo com testes de propriedades, curvas, polígonos, unidades e exportação.
6. **PORCELANE — domínio e fixture:** aproveitar tipos de peça, ambiente, chapa, retalho, plano e gates como protótipo de regras; endurecer validações antes de conectar às telas.

## 5. Modelo canônico proposto para conciliar as fontes

A modelagem futura deve separar claramente:
- Organização/empresa, usuários, perfis, permissões e vínculos.
- Cliente, obra/projeto e endereços.
- Orçamento, versão, ambiente, item comercial, serviço, insumo, frete, instalação, desconto e condição de pagamento.
- Pedido e snapshot aprovado do orçamento.
- Peça técnica, revisão, medição, aprovação, desenho e liberação.
- Material, fornecedor, lote, chapa, retalho, reserva e movimentação de estoque.
- Plano de corte, posicionamento, ordem de corte, ordem de acabamento e romaneio.
- Tarefa, colaborador, inspeção, retrabalho, carregamento, entrega e instalação.
- Parcela, recebimento, pagamento, despesa, comissão, regra de comissão versionada e recibo.
- Documento/anexo, integração externa, evento de auditoria e token de compartilhamento.

Não usar uma única tabela/objeto para representar simultaneamente item comercial e peça técnica: são entidades relacionadas, mas têm ciclo de vida e revisão diferentes.

## 6. Prioridade de correção

**P0 — antes de conectar telas ou persistência**
1. Separar documento externo e documento interno; esconder desconto no PDF cliente PORCELANE.
2. Definir semântica de insumos e estrutura de subtotal.
3. Corrigir fallback de quantidade zero e regra de margem inválida.
4. Definir snapshot comercial imutável e revisão técnica independente.
5. Formalizar transições de pedido e aprovação idempotente.
6. Definir contrato canônico entre Platform, Core e domínio PORCELANE.

**P1 — antes de operação integrada**
1. Corrigir gates de plano e integridade peça/plano/chapa/retalho.
2. Implementar calendário útil com feriados e fuso Recife.
3. Versionar regras de comissão e cálculos.
4. Implementar RBAC e escopo por organização/registro no servidor.
5. Tornar eventos de auditoria obrigatórios e atômicos.
6. Criar testes automatizados reais para cálculos e regras de domínio.

**P2 — depois da validação funcional**
1. Integrações Drive, Trello, Amanda e BotConversa.
2. Portal do funcionário.
3. RH/folha, relatórios completos e insights.
4. Importação dos dados e fórmulas da planilha, quando sua fonte puder ser recuperada.

## 7. Limites desta auditoria

- A planilha com 85 abas não foi encontrada nos repositórios consultados; nenhuma fórmula ou registro foi validado contra ela.
- O estado local do Platform é dado de demonstração; não foi tratado como cadastro real da PORCELANE.
- Não foi executado build, teste automatizado, teste E2E nem consulta ao banco remoto nesta auditoria.
- Não foram alterados Supabase, produção, branches principais, PRs ou deploys.
- Os achados refletem leitura estática dos arquivos identificados; a ausência de busca não prova inexistência em todo o sistema.

## 8. Arquivos e evidências consultados

**ferraz-core**, branch `feature/integracao-porcelane`:
- `docs/PORCELANE_CURRENT_SYSTEM_BASELINE.md`
- `src/lib/porcelane/domain.ts`
- `src/lib/porcelane/acceptance.ts`
- `src/lib/porcelane/fixtures.ts`
- `src/lib/operations.ts`
- `src/lib/commercial.ts`
- `src/lib/supabase.ts` (cliente Supabase configurado por variáveis VITE; sem acesso a dados nesta auditoria)

**ferraz-platform**, branch padrão consultada:
- `src/lib/calculations.js`
- `src/lib/actions.js`
- `src/lib/documents.js`
- `src/lib/storage.js`
- `docs/08-ARQUITETURA.md`
- `src/App.jsx` (desenhos técnicos e interface)

**Outros repositórios da organização:** buscas por PORCELANE em `ferraz-connect` e `ferraz-company-system` não retornaram evidência de implementação PORCELANE. Isso não substitui auditoria completa desses repositórios.
