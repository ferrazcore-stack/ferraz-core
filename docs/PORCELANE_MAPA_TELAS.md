# Mapa de telas e experiência — PORCELANE

Este documento transforma a especificação funcional e a planilha mestra em mapa navegável. É especificação de implementação; não declara que todas as telas já existem.

## Navegação global
- Painel inicial: `/`.
- Quatro Hubs no menu lateral: Vendas, Produção, Financeiro, Sistemas e Ajustes.
- Abas no topo do Hub; menus contextuais por registro.
- Busca global: clientes, propostas, pedidos, materiais e documentos.
- Contexto persistente: organização ativa, usuário, obra/pedido e alertas.
- Cada tela deve ter estados loading, vazio, erro, sem permissão, bloqueado por regra, sucesso e histórico.

## Hub Vendas
| Tela/rota | Abas e conteúdo | Ações e bloqueios |
|---|---|---|
| `/orcamentos` | Lista, filtros, versões, status | Criar, duplicar, comparar, importar PDF assistido; não aprovar versão sem evidência |
| `/orcamentos/:id` | Cabeçalho, ambientes, peças, serviços, insumos, frete, instalação, desconto, pagamento, documentos | Salvar rascunho, versionar, enviar, aprovar; aprovação idempotente |
| `/orcamentos/importar` | Arquivo original, extrações, confiança, divergências | Confirmar manualmente; nunca autoaceitar material/medida incerta |
| `/pedidos` | Lista, prazo, valor contratado, progresso agregado | Busca e filtros por situação/cliente/vendedor |
| `/pedidos/:id` | Resumo, Comercial congelado, Ambientes, Técnica, Documentos, Financeiro, Aditivos, Auditoria | Medição não altera snapshot comercial |
| `/medicoes` | Calendário, técnico, ambiente, status | Reagendar/cancelar com validação 08h–18h e fuso |
| `/clientes` | Cadastro, endereços, histórico | Validar CPF/CNPJ; escopo por organização |
| `/catalogo` | Materiais, fotos, preços, biblioteca 3D | Versionar material e preço; anexos com origem |

## Hub Produção
| Tela/rota | Abas e conteúdo | Ações e bloqueios |
|---|---|---|
| `/producao` | Quadro por etapa, pedido/ambiente/peça, atrasos | Transição somente por gate e papel autorizado |
| `/producao/:pedidoId` | Ambientes, peças, revisões, liberações e operações | Exibir bloqueadores específicos |
| `/documentos` | Ordens de corte, ordens de acabamento, romaneios | Reimpressão não duplica documento; `/romaneios` redireciona |
| `/estoque` | Chapas, lotes, reservas, movimentos, defeitos | Sem baixa sem ordem e ator |
| `/estoque/retalhos` | Retalhos, origem, dimensões, inspeção, status | Retorno ao estoque após QC |
| `/projetos/:ambienteId` | Planta 2D, elevações, cortes, detalhes, 3D, revisões | Geometria 1:1; revisão aprovada imutável |
| `/projetos/:ambienteId/prancha` | Folhas A4/A3/A2, escala de impressão, cotas | Escala de prancha não altera geometria |
| `/nesting/:liberacaoId` | Peças elegíveis, chapas/retalhos, veio, defeitos, kerf, margens, rendimento | Aprovação explícita antes de OC/corte |
| `/producao/relatorio/:funcionario` | Produção, tempo, perda, retrabalho e QC | Escopo individual conforme perfil |

## Hub Financeiro
| Tela/rota | Abas e conteúdo | Ações e bloqueios |
|---|---|---|
| `/financeiro` | Resumo contratado, aprovado, recebido, custos | Métricas não misturam conceitos |
| `/financeiro/receber` | Parcelas, comprovantes, conciliação, recibos | Anexo não baixa parcela automaticamente |
| `/financeiro/pagar` | Despesas, fornecedores, comprovantes | Aprovação e auditoria |
| `/financeiro/comissoes` | Regras versionadas, competência, base, estorno | Não calcular regra pendente |
| `/financeiro/insights` | Faturamento, recebimentos, projeções e margem | Identificar realizado vs projetado |
| `/rh` | Colaboradores, setores, produtividade e pagamentos | Restrição por função |
| `/relatorios/diario` | A4 paisagem, documento, pagamento e equipe comercial | Exportação reprodutível |
| `/relatorios/obras` | Centro de custo por obra/ambiente/peça | Comercial e liberado separados |
| `/relatorios/vendas` | Desempenho por vendedor/período | Escopo por organização |
| `/documentos-financeiros` | Recibos e documentos somente leitura | Nunca criar lançamento |

## Hub Sistemas e Ajustes
| Tela/rota | Conteúdo |
|---|---|
| `/configuracoes` | Organização, dados fiscais, PIX, parâmetros e calendário |
| `/configuracoes/usuarios` | Usuários, convites, papéis, módulos, ações e escopos |
| `/configuracoes/emails-autorizados` | Lista de acesso e convites |
| `/configuracoes/trello` | Mapeamento de pedidos/cartões e status da integração |
| `/configuracoes/biblioteca-3d` | Componentes, texturas, acabamentos e origem/licença |
| `/configuracoes/backups` | Estado, histórico e restauração testada |
| `/configuracoes/aparencia` | Tema e preferências |
| `/minha-conta` | Perfil, sessão e segurança |
| `/assistente` | Assistente opcional; nenhuma automação crítica depende de IA |
| `/marketing` | Campanhas e materiais |
| `/atendimento` | Consulta de medições futuras; leitura restrita |

## Portais e APIs
- `/funcionario`: identidade individual, tarefas próprias, apontamentos e produtividade; nunca valores empresariais.
- `/api/public/amanda/dados`: token no servidor, escopo mínimo, rate limit e logs sem segredo.
- `/api/public/botconversa/consulta`: leitura limitada a pedidos/medições autorizados.

## Padrões de tela
1. Cabeçalho com breadcrumb, título, status e ações permitidas.
2. Abas por contexto; evitar duplicar a mesma informação em hubs diferentes.
3. Tabelas com busca, filtro, paginação e exportação autorizada.
4. Timeline de eventos com ator, data, motivo e documento de evidência.
5. Painel lateral de bloqueadores, com regra e ação necessária.
6. Documentos sempre mostram tipo, versão, origem, autor, data e vínculos.
7. Acessibilidade: cotas e medidas legíveis, contraste, foco por teclado, labels e alvos de toque.
8. Componentes técnicos devem ser consumidos do TEC via contrato versionado; telas não implementam geometria/nesting por conta própria.
