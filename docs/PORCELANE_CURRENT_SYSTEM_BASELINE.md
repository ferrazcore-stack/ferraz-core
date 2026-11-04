# PORCELANE — baseline funcional do sistema atual

Data de referência: 04/11/2026  
Versão recebida: 1  
Status: requisitos recebidos; documentação de referência para implementação.

Este documento registra o funcionamento atual informado pela empresa. Deve orientar a evolução do PORCELANE como primeira empresa funcional do ecossistema FERRAZ + TEC. Não significa que todas as telas ou integrações já estejam implementadas.

## 1. Princípios de preservação

- Manter quatro Hubs principais: Vendas, Produção, Financeiro e Sistemas e Ajustes, além do Painel inicial.
- Usar abas internas em cada Hub, evitando um menu lateral excessivamente fragmentado.
- Preservar regras comerciais, cálculos, permissões, documentos e rotinas que já atendem à operação.
- Separar dados comerciais aprovados de dados técnicos medidos e liberados.
- Manter histórico, autoria, datas, revisões e trilha de auditoria.
- Parceiros e funcionários devem visualizar somente os dados necessários às suas funções.
- As regras de autorização devem ser impostas no backend, não apenas ocultadas na interface.
- Supabase permanece como última etapa de integração e persistência. A planilha-fonte não deve ser enviada ao GitHub.

## 2. Perfis e permissões

| Perfil | Áreas padrão |
|---|---|
| Administrativo | Todas |
| Vendas | Orçamentos, Pedidos, Medições, Clientes, Romaneios, Comissões, Relatórios, Marketing, Atendimento |
| Supervisor | Orçamentos, Pedidos, Medições, Clientes, Romaneios, Produção, Relatórios, Atendimento |
| Produção | Pedidos, Romaneios, Produção |
| Cortador / Acabador | Produção |
| Parceiro | Orçamentos, Pedidos e Comissões próprias, sem dados financeiros |

O administrador pode conceder ou bloquear módulos por usuário em Configurações > Usuários. A autorização efetiva deverá considerar usuário, empresa/organização, perfil, módulo, ação e escopo do registro. O perfil Parceiro exige isolamento por titularidade e remoção de valores financeiros não autorizados.

## 3. Painel inicial

Rota: `/`

- Indicadores de vendas.
- Pedidos recentes.
- Alertas de produção.
- Busca geral em clientes, orçamentos, pedidos e materiais.

## 4. Hub Vendas

### 4.1 Orçamentos

Rotas: `/orcamentos`, `/orcamentos/importar`, `/orcamentos/:id`, `/enviar-orcamento`

Lista: número, cliente, vendedor, valor, situação (rascunho/aprovado) e data. Deve permitir criação, busca, filtros por vendedor/período, importação assistida de PDF e envio.

Editor:
- Cabeçalho: cliente, vendedor interno, vendedor externo, arquiteto, data e validade.
- Ambientes: peças com comprimento, largura e quantidade; material e valor por m²; serviços (cubas, nichos, cooktop e outros); aditivos e observações internas ou visíveis ao cliente.
- Insumos do ambiente servem para controle de quantidade e não integram o valor do ambiente.
- Resumo separado: ambientes (pedras + serviços), insumos, frete (quantidade × valor), frete de rodapé, instalação (percentual sobre ambientes, com mínimo configurável), instalação de rodapé, desconto e total.
- Pagamento padrão informado: entrada de 40% via PIX e saldo no cartão; desconto aparece na área de pagamento.
- Ferramentas: calculadora, duplicação/movimentação de itens e quantidade inicial zero.
- PDF timbrado: desconto não deve aparecer na versão entregue ao cliente.
- Aprovação gera exatamente um pedido. A operação deve ser idempotente para impedir pedidos duplicados por duplo clique, repetição de requisição ou falha de rede.

### 4.2 Pedidos

Rotas: `/pedidos`, `/pedidos/:id`

Lista: número, cliente, vendedor, valor aprovado, etapa de produção e prazo.

Detalhe:
- Comercial: cópia fiel e imutável do orçamento aprovado; medição técnica não altera dimensões nem valores comerciais.
- Técnica: data de medição e liberação por ambiente, área liberada para corte e equipes de corte, acabamento e montagem.
- Prazo de referência: “30 dias úteis após medição e liberação técnica”, considerando feriados de Pernambuco/Recife. Calendário, regra de contagem e marco inicial devem ser configuráveis e auditáveis.
- Financeiro: parcelas, baixas e recibos.
- Saídas: PDF do pedido, ordens de corte/acabamento, romaneio, pasta Google Drive e cartão Trello.

### 4.3 Medições

Rota: `/medicoes`

Agenda/calendário, técnico responsável e estados agendada, realizada ou cancelada. Edição permitida no horário comercial informado (08h–18h), com fuso horário explícito e validação também no servidor.

### 4.4 Clientes

Rota: `/clientes`

Cadastro de nome, CPF/CNPJ, telefone/WhatsApp, endereços de obra e cobrança; histórico de orçamentos e pedidos.

### 4.5 Fotos e Catálogo

Rota: `/catalogo`

Materiais com fotos, valores por m², catálogo PDF e biblioteca 3D.

## 5. Hub Produção

### 5.1 Fila de produção

Rota: `/producao`

Etapas informadas: Aguardando projeto → Liberação técnica → Corte → Romaneio → Em produção → Instalação → Entrega → Finalizado.

- Alertar pedidos parados há mais de 15 dias em “Aguardando projeto”.
- Relatório de produtividade por colaborador: `/producao/relatorio/:funcionario`.
- Transições devem ser controladas por gates no backend, com ator, horário, motivo e evidência. Liberação parcial por ambiente/peça deve ser suportada.

### 5.2 Documentos técnicos

Rota: `/documentos`; `/romaneios` redireciona para a aba Romaneios.

Abas: Ordens de corte, Ordens de acabamento e Romaneios. Inclui lista manual de embalagem, anexos 2D/3D, impressão e download.

## 6. Hub Financeiro

### 6.1 Financeiro

Rotas: `/financeiro`, `/financeiro/receber`, `/financeiro/pagar`, `/financeiro/comissoes`, `/financeiro/insights`

- Contas a receber: parcelas por pedido, baixa via PIX/cartão/boleto e recibo com logo.
- Contas a pagar: despesas e fornecedores.
- Comissões e remunerações informadas:
  - Vendedor interno: 2% até R$ 100.000/mês; 3% acima, aplicado sobre o mês todo.
  - Vendedor externo e arquiteto: regras ainda precisam ser detalhadas.
  - Medição/liberação: 2%.
  - Cortador: R$ 16/m²; nicho/divibox: R$ 15 (unidade/base de cálculo precisa ser confirmada).
  - Acabador: 5% do valor do ambiente com desconto; cuba R$ 60, nicho R$ 40, divibox R$ 15.
- Insights: faturamento, recebimentos e projeções.

As regras de comissão devem ser versionadas por vigência e configuráveis; não codificar percentuais e valores como constantes imutáveis. Definir base de cálculo, competência, estornos, rateios e arredondamento antes de automatizar pagamentos.

### 6.2 RH e Folha

Rota: `/rh`

Cadastro de colaboradores, setores, produtividade mensal e pagamentos.

### 6.3 Relatórios

- Diário: `/relatorios/diario`, A4 paisagem; Documento, Valor, Pagamento, vendedor interno, vendedor externo e arquiteto; resumo com ambientes, m², material, medição e prazo.
- Obras: `/relatorios/obras`, centro de custo por obra; ambiente, material, m² comercial e liberado, serviços separados, insumos totalizados, fretes e instalações separados, pagamento, prazo e totais gerais.
- Vendas: `/relatorios/vendas`, desempenho por vendedor e período.

### 6.4 Documentos financeiros

Rota: `/documentos-financeiros`

Impressão de recibos e documentos financeiros timbrados, em modo somente leitura, sem criar lançamentos duplicados.

## 7. Hub Sistemas e Ajustes

| Tela | Rota | Função |
|---|---|---|
| Configurações | `/configuracoes` | Dados da empresa, PIX, regras de cálculo e prazos |
| Usuários | `/configuracoes/usuarios` | Perfis e permissões por módulo |
| E-mails autorizados | `/configuracoes/emails-autorizados` | Controle de entrada |
| Trello | `/configuracoes/trello` | Cartões por pedido |
| Biblioteca 3D | `/configuracoes/biblioteca-3d` | Modelos e texturas |
| Backups | `/configuracoes/backups` | Cópias diárias |
| Aparência | `/configuracoes/aparencia` | Tema |
| Minha conta | `/minha-conta` | Dados e senha |
| Assistente Pedra | `/assistente` | IA com conversas salvas |
| Marketing | `/marketing` | Campanhas |
| Atendimento | `/atendimento` | Consulta BotConversa, somente leitura |

## 8. Portal do funcionário

Rota: `/funcionario`

Acesso por CPF + PIN para cortadores e acabadores. Mostra somente tarefas e produtividade próprias, sem valores da empresa. PIN deve ser armazenado com hash seguro, ter limitação de tentativas e fluxo de recuperação; CPF não deve ser tratado como segredo ou fator de autenticação suficiente.

## 9. Acessos externos

- `/api/public/amanda/dados`: dados destinados ao app FERRAZ, protegidos por token.
- `/api/public/botconversa/consulta`: consulta de pedidos/medições pelo atendimento.

As APIs devem aplicar autenticação, escopo mínimo, rate limit, validação de entrada, logs sem segredos e respostas com apenas os campos autorizados. Tokens não devem ser expostos no frontend.

## 10. Pendências herdadas do sistema atual

1. Preencher dados cadastrais da empresa (CNPJ, razão social, endereço e PIX).
2. Criar pastas no Drive para 125 pedidos antigos.
3. Corrigir carregamento contínuo da tela Assistente Pedra.
4. Restringir Atendimento a medições futuras.
5. Ajustar tolerância de correspondência de material no importador PDF (atualmente informada como 50%); substituir tolerância genérica por correspondência assistida, confiança explícita e confirmação humana.

## 11. Regras críticas de integridade a preservar

1. Aprovar orçamento cria um único pedido e mantém snapshot do orçamento aprovado.
2. Medição técnica e revisões técnicas não alteram valores ou dimensões comerciais aprovadas.
3. Liberação técnica pode ocorrer parcialmente por ambiente e peça, sempre vinculada à revisão correta.
4. Insumos são exibidos e controlados separadamente e não somam ao valor do ambiente, conforme regra atual.
5. Desconto não aparece no PDF comercial destinado ao cliente, mas deve permanecer rastreável internamente.
6. Documentos financeiros em modo leitura não podem gerar lançamentos.
7. Parceiros só acessam seus próprios registros e não veem dados financeiros restritos.
8. Funcionários acessam somente suas tarefas e produtividade.
9. Romaneios têm um único local funcional, dentro de Documentos técnicos.
10. Aprovações, baixas, transições e revisões precisam de auditoria e proteção contra duplicidade.

## 12. Relação com FERRAZ, TEC e Supabase

- PORCELANE é a primeira empresa/implantação funcional e ambiente de validação.
- FERRAZ fornece os módulos de gestão empresarial e operacional reutilizáveis.
- TEC é um motor técnico independente, com API/SDK e contratos versionados, consumido inicialmente pelo PORCELANE.
- O TEC deve tratar geometria, desenhos, vistas, cortes, materiais, paginação/nesting e intercâmbio de arquivos sem depender da interface ou do banco exclusivo do FERRAZ.
- Supabase será integrado por último, depois de validar domínio, fluxos, regras, contratos e testes. Antes de criar migrations ou importar dados, inspecionar o schema e as políticas existentes.
- A planilha PORCELANE é fonte de requisitos e dados para extração posterior; não deve ser commitada no GitHub.

## 13. Pontos que exigem confirmação antes de automatizar

- Fórmula exata de área comercial e arredondamentos por peça/ambiente.
- Base e vigência das comissões de vendedor externo, arquiteto e medição/liberação.
- Se R$ 15 de nicho/divibox para cortador é por unidade, m² ou serviço.
- Base do percentual do acabador e interação com descontos, serviços e aditivos.
- Calendário de feriados (nacional, estadual e municipal) e regra de contagem dos 30 dias úteis.
- Regras de cancelamento, estorno, aditivo, reabertura e aprovação de exceções.
- Quais dados da Amanda podem ser compartilhados com o FERRAZ e quais campos o BotConversa pode consultar.
- Política de retenção, acesso e consentimento para CPF, fotos, endereços e documentos.

## 14. Critério de aceite funcional

O PORCELANE só será considerado funcional quando um cenário ponta a ponta demonstrar, com testes e evidências:
- cadastro e acesso por perfil;
- orçamento com múltiplos ambientes, peças, serviços, insumos, fretes, instalação e desconto;
- PDF de cliente sem desconto exposto;
- aprovação idempotente e criação única do pedido;
- snapshot comercial protegido;
- medição, revisão e liberação parcial técnica;
- ordens de corte/acabamento, romaneio e gates de produção;
- contas a receber/pagar, baixas, recibos e comissões com regras vigentes;
- relatórios e portal do funcionário com escopo correto;
- integrações externas protegidas;
- histórico e auditoria verificáveis.

Este documento é a linha de base funcional recebida do usuário. A implementação deve ser comparada com ele, registrando o que já existe, o que será reaproveitado, o que será corrigido e o que ainda será construído.
