# FERRAZ — Gestão Inteligente para Marmorarias

## 1. Visão

O FERRAZ é uma plataforma operacional para marmorarias, desenhada para centralizar a jornada completa da obra em uma única fonte oficial de informação.

Princípio central: **uma informação → uma fonte oficial**. O sistema não deve exigir redigitação do mesmo dado em módulos diferentes.

O Pedido é a **pasta digital da obra** e concentra o vínculo entre cliente, orçamento aprovado, ambientes, peças, medidas, produção, expedição, entrega/instalação, documentos e histórico.

A arquitetura deve permitir expansão futura para outros segmentos de fabricação sob medida, sem perder o foco inicial em marmorarias.

## 2. Fluxo operacional oficial

Cliente → Orçamento → Opções → Aprovação → Pedido → Pedido fechado → Medição → Liberação Técnica → Desenho 2D → Paginação → Corte → Acabamento → Produção → Conferência → Carregamento → Romaneio → Entrega/Instalação → Termo/Recibo → Conclusão → Histórico.

### Regras de transição
- Aprovação transforma a proposta comercial em pedido.
- Depois de fechado, o pedido não deve ser silenciosamente sobrescrito.
- Alterações técnicas de medição preservam o histórico e geram nova versão técnica.
- Alterações financeiras após fechamento devem ser tratadas como **Aditivo**.
- Cada peça/ambiente deve possuir rastreabilidade de status.
- O sistema deve impedir perda de histórico por edição destrutiva.

## 3. Módulos

### Dashboard
- visão operacional da empresa;
- indicadores de vendas, pedidos, produção, entrega e financeiro;
- alertas de atrasos e pendências;
- agenda e tarefas;
- visão por status/Kanban;
- atalhos para ações recorrentes.

### Clientes e Obras
- cadastro único de cliente;
- múltiplas obras por cliente;
- contatos e profissionais vinculados;
- endereço/CEP editável;
- histórico completo;
- busca rápida.

### Orçamento
- orçamento A4 editável;
- empresa/CNPJ/logo configuráveis;
- cliente, obra e profissionais;
- múltiplos profissionais com nome e telefone;
- ambientes e itens;
- quantidade, comprimento, largura, m² e preço;
- materiais convencionais;
- MFC/NFC;
- beneficiamento;
- perda de 30% opcional;
- taxa de coleta;
- cubas, cooktop, torre, nicho e outros serviços;
- descontos;
- entrada;
- cartão com divisão de pagamentos;
- opções comerciais sem duplicar cadastro;
- aprovação do cliente;
- geração de PDF profissional.

### Pedido
- nasce do orçamento aprovado;
- preserva os dados comerciais aprovados;
- funciona como pasta digital da obra;
- ambientes, peças, medidas, documentos e andamento;
- fechamento formal;
- versões e aditivos;
- trilha de auditoria.

### Medição Técnica
- agenda de medição;
- responsável técnico;
- ambientes/peças liberados individualmente;
- medidas e observações;
- anexos e evidências;
- revisão/versionamento;
- nunca sobrescrever silenciosamente informação técnica já utilizada.

### Liberação Técnica
- validação das informações necessárias para produção;
- bloqueios explícitos para dados incompletos;
- liberação por ambiente/peça;
- histórico de quem liberou e quando.

### Desenho 2D / Paginação
- controle de documentos técnicos;
- versões;
- vínculo com peças e materiais;
- aprovação/liberação;
- preparação para integração futura com ferramentas CAD/CAM.

### Produção
Kanban operacional com etapas:
- Corte
- Acabamento
- Produção
- Conferência
- Carregamento

Cada peça deve manter responsável, prioridade, prazo, status e histórico.

### Romaneio
- geração por obra/pedido;
- organização por ambientes;
- tipo de entrega;
- conferência de peças;
- documento imprimível/PDF;
- vínculo com carregamento e entrega.

### Entrega / Instalação
- agenda;
- endereço;
- equipe/responsável;
- checklist;
- ocorrência;
- comprovação;
- termo/recibo;
- conclusão.

### Financeiro e Comissões
- valores comerciais provenientes do pedido/orçamento;
- aditivos;
- condições de pagamento;
- acompanhamento de recebimentos;
- comissão configurável;
- regras por vendedor e faixa de faturamento;
- histórico sem duplicação.

### Usuários e Permissões
Papéis devem ser configuráveis e respeitar separação comercial/técnica. A interface não deve expor linguagem técnica desnecessária para o usuário final.

## 4. Regras comerciais conhecidas

- Comissão de arquiteto: 5%.
- Vendedores Amanda/Cristiano: 2% até R$ 100.000 e 3% acima disso.
- Vendedores externos devem ser editáveis.
- Comissão deve ser parametrizável, não codificada de forma rígida.
- Taxa de coleta deve ser configurável; referência atual: R$ 300, com possibilidade de ajuste.
- Beneficiamento deve suportar referência fixa de R$ 820 e edição quando necessário.

## 5. Separação comercial x técnica

O sistema deve distinguir claramente:

**Comercial:** cliente, orçamento, preço, desconto, pagamento, aprovação, vendedor, comissão e aditivo.

**Técnico:** medição, desenho, paginação, peças, material, corte, acabamento, produção, conferência e instalação.

Uma alteração técnica não deve alterar silenciosamente o valor comercial aprovado. Uma alteração financeira não deve apagar a medição técnica anterior.

## 6. Princípios de dados

1. Uma informação → uma fonte oficial.
2. Nenhuma redigitação desnecessária.
3. Histórico preservado.
4. Versionamento quando o dado tiver impacto técnico ou comercial.
5. IDs estáveis para entidades.
6. Relacionamentos explícitos entre cliente, obra, orçamento, pedido, ambiente e peça.
7. Empresa/tenant como camada de isolamento para permitir várias marmorarias no futuro.
8. Auditoria de alterações relevantes.

## 7. Entidades de domínio iniciais

- Company
- User
- Role
- Customer
- Project/Work
- Professional
- Budget
- BudgetOption
- BudgetItem
- BudgetService
- Approval
- Order
- OrderAddendum
- Environment
- Piece
- Measurement
- TechnicalRelease
- Drawing
- Layout/CutPlan
- ProductionTask
- ProductionStage
- Inspection
- Loading
- DeliveryManifest
- Delivery
- Installation
- Receipt/Term
- PaymentCondition
- Payment
- CommissionRule
- Commission
- Attachment
- AuditEvent

## 8. Documentos

O FERRAZ deve gerar documentos profissionais e consistentes para:
- orçamento;
- pedido;
- aditivo;
- romaneio;
- protocolos;
- termo/recibo;
- documentos de entrega/instalação.

Padrão visual do orçamento: alto padrão empresarial, preto/branco/chumbo, boa hierarquia, tipografia legível, sem linhas pesadas, sem rodapé desnecessário e sem resumo artificial na primeira página.

## 9. Dashboard e operação

O dashboard deve priorizar o que exige ação, não apenas números.

Indicadores esperados:
- orçamentos em aberto;
- aprovações pendentes;
- pedidos em andamento;
- medições pendentes;
- peças bloqueadas;
- produção por etapa;
- atrasos;
- entregas/instalações próximas;
- vendas e conversão;
- valores em aberto;
- comissões.

## 10. Agenda

A agenda deve centralizar:
- medição;
- instalação;
- entrega;
- tarefas internas;
- compromissos comerciais.

Prazos devem nascer das regras do processo, evitando digitação duplicada.

## 11. Automação e agentes

A arquitetura poderá suportar agentes internos especializados, incluindo um orquestrador central e agentes por domínio. A existência desses agentes não deve ser exposta como linguagem de produto para o usuário final.

O sistema deve priorizar automações determinísticas para regras de negócio e utilizar inteligência assistiva apenas quando agregar valor real.

## 12. UX

Posicionamento: sistema empresarial, limpo, rápido e de alto padrão.

Diretrizes:
- navegação simples;
- ações principais evidentes;
- poucos cliques;
- busca global;
- estados claros;
- feedback imediato;
- responsividade;
- evitar telas carregadas;
- não duplicar informações em cards independentes;
- manter contexto da obra.

## 13. Roadmap de implementação

### Fase 0 — Fundação
- arquitetura;
- domínio;
- padrões de dados;
- autenticação/multiempresa;
- design system;
- infraestrutura.

### Fase 1 — Núcleo comercial
- dashboard;
- clientes;
- obras;
- profissionais;
- orçamento;
- opções;
- aprovação;
- PDF;
- pedido.

### Fase 2 — Núcleo técnico
- medição;
- liberação técnica;
- desenhos;
- paginação;
- peças.

### Fase 3 — Produção e logística
- Kanban de produção;
- corte;
- acabamento;
- conferência;
- carregamento;
- romaneio;
- entrega;
- instalação.

### Fase 4 — Financeiro e gestão
- pagamentos;
- aditivos;
- comissões;
- indicadores;
- relatórios.

### Fase 5 — Automação e escala
- agentes internos;
- notificações;
- integrações;
- templates;
- expansão para outros segmentos.

## 14. Regra de segurança de implementação

Nenhuma parte do sistema existente deve ser substituída ou apagada sem primeiro identificar o que ela contém e qual informação precisa ser preservada.

Enquanto o código original do aplicativo não estiver disponível neste repositório, a implementação deve se limitar à fundação e à documentação de domínio, evitando inventar uma stack ou destruir o trabalho existente.
