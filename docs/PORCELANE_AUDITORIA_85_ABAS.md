# Auditoria integral de requisitos — PORCELANE + FERRAZ + TEC

Data da revisão: 04/11/2026
Branch: `feature/integracao-porcelane`
Fonte operacional: `Planilha_Mestra_Integrada_Gestao_Marmoraria.xlsx` (85 abas; analisada localmente; não versionada)
Status: auditoria documental concluída em nível de estrutura e requisitos; validação de fórmulas/casos e execução de software permanecem em andamento.

## 1. Fontes e método

Foram cruzados: a planilha de 85 abas, `PORCELANE_CURRENT_SYSTEM_BASELINE.md`, `domain.ts`, `fixtures.ts`, `acceptance.ts` e documentação de cenário. A planilha não foi enviada ao GitHub. A leitura considerou nomes/estrutura das abas, instruções, matrizes, especificações e fórmulas/observações encontradas. Nenhuma regra marcada como "a validar" foi promovida a regra automática.

## 2. Arquitetura confirmada pela planilha

- **Base44** é indicada como fonte oficial dos dados operacionais; Excel é apoio para organização, auditoria, importação e exportação.
- PORCELANE é a primeira implantação funcional do ecossistema FERRAZ.
- TEC é motor técnico independente, com contrato/API/SDK versionado, reutilizável por outras empresas e aplicações.
- Estoque é completo e individualizado; produção é própria; acesso é por equipe e identidade individual.
- Documentos originais devem permanecer imutáveis, com metadados, versão, origem, autor, data e vínculos com pedido/ambiente/peça.
- Supabase é uma etapa posterior e não deve ser iniciado antes de domínio, telas, fluxos, contratos e testes aprovados.

## 3. Inventário das 85 abas

1. 00_Visao_Integrada
2. Importação Relatório 2026
3. Fluxos Atualizados
4. Resumo Importação 2026
5. Auditoria de Conclusão
6. Revisão Geral
7. Projetista 2D3D
8. Fluxo OC OA Liberação
9. Biblioteca Técnica
10. Validações do Usuário
11. Conciliação Revisada
12. Plano_Profissional
13. Fluxo Comercial
14. Documentos do Pedido
15. Auditoria_PED_000107
16. Menu
17. Como usar
18. Fluxo
19. Painel
20. Verificação
21. Pendências
22. Atendimento
23. Propostas
24. Comparar versões
25. Mensagens
26. Itens
27. Pedidos
28. Prazos
29. Ambientes
30. Liberações
31. Corte por material
32. Produção
33. Estoque
34. Chapas
35. Retalhos
36. Produtividade
37. Expedição
38. Ocorrências
39. Compras
40. Fornecedores
41. Cotações
42. Materiais
43. Serviços
44. Custos fixos
45. Parâmetros
46. Listas
47. Auditoria
48. _aux_corte
49. Painel_Auditoria_107
50. Pedido_Itens
51. Liberacao_Itens
52. Comparativo_Ambientes
53. Cozinha
54. Varanda
55. BWC_Master
56. BWC_Filhas
57. Area_Servico
58. Servicos_Insumos
59. Financeiro
60. Prazos_Alertas
61. Mensagem_Cliente
62. Pendencias
63. Croquis_Referencias
64. Fontes_Criterios
65. Revisao_Planilha_Anterior
66. Cadastro_Ambientes
67. Feriados
68. Detalhe Fonte 2026
69. Decisões Confirmadas
70. ESP - LEIA-ME
71. ESP - Módulos
72. ESP - Fluxos_Automacao
73. ESP - Modelo_Dados
74. ESP - Catalogo_Documentos
75. ESP - Matriz_Permissoes
76. ESP - Testes_Aceite
77. AUD - LEIA-ME
78. AUD - Registro_Auditoria
79. AUD - Decisoes_Confirmadas
80. AUD - Checklist_Seguranca
81. AUD - Painel_Status
82. TEC - LEIA-ME
83. TEC - Compatibilidade
84. TEC - Arquitetura_Referencia
85. TEC - Plano_Migracao

## 4. Requisitos novos ou confirmados

### 4.1 Comercial e pedido
- Propostas versionadas; comparar versões; somente a versão aprovada gera pedido.
- Registrar evidência da aprovação, autor, data e versão exata.
- Pedido preserva termos comerciais originais; mudanças posteriores são aditivos versionados, com impacto e aceite próprios.
- Não sobrescrever versões, nem alterar automaticamente preço por medição/liberação técnica.
- Importação e conciliação devem manter origem documental e estados "confirmado", "divergente", "manuscrito/hipótese" e "pendente".

### 4.2 Projeto, ambientes e peças
- Um pedido contém vários ambientes; não duplicar ambiente para liberar partes.
- Projeto arquitetônico 2D, vistas, cortes, detalhes, 3D e croquis são ligados a ambiente e revisão.
- Unidades de entrada m/cm/mm normalizadas para mm; preservar entrada e unidade de origem.
- Geometria em escala real 1:1; escala de impressão independente da geometria.
- Cotas em metros com ponto decimal; duas casas por padrão e três quando necessário para preservar milímetros.
- ID estável da peça atravessa projeto, liberação, OC, OA, apontamento e expedição.
- Mudança após aprovação cria nova revisão; revisão anterior permanece acessível.
- Biblioteca técnica deve contemplar testeiras, encabeçamentos, cubas, bordas, pingadeiras, nichos, encontros, rebaixos e superfícies, sem fixar método/medida ainda não validado.

### 4.3 Liberação, OC e OA
- Liberações sucessivas e parciais por ambiente e seleção de peças; nenhuma apaga a anterior.
- Toda liberação aponta para revisão específica e peças selecionadas.
- OC e OA são documentos distintos, mas compartilham PED, AMB, LIB, PEC e a mesma referência DES/REV.
- Corte exige paginação aprovada, chapa identificada e reserva vinculada.
- Execução registra operador, máquina, resultado, perda, quebra e retalho.
- Acabamento registra operador, perfil/serviço, controle de qualidade, defeito e retrabalho.
- O arquivo de desenho não deve ser duplicado de forma divergente entre OC e OA.

### 4.4 Estoque, paginação e produção
- Estoque por chapa e lote: fornecedor, nota fiscal, espessura, medidas reais, localização, reserva, consumo, perdas, defeitos e retalhos.
- Reserva é diferente de consumo; saldo físico, reservado e disponível devem reconciliar.
- Retalho só retorna ao estoque após inspeção, com origem e dimensões rastreáveis.
- Agrupar paginação por material entre ambientes quando tecnicamente permitido, respeitando liberações e aprovações.
- Nesting deve considerar dimensões reais, kerf, margem, rotação, veio, defeitos, recortes e retalhos; não basta validar existência de chapa.
- Produção própria: corte, acabamento, montagem, conferência, embalagem/expedição e instalação.
- Etapas exigem apontamento e motivo/evidência para exceção, conclusão, perda ou retrabalho.

### 4.5 Expedição e financeiro
- Expedição conferida por peça e ambiente; entregas parciais não encerram obra.
- Termo único de vistoria/conclusão apenas após todos os ambientes/peças e pendências resolvidos.
- Separar valor contratado, aditivos/créditos aprovados, execução aprovada, recebimento efetivo, custos e margem.
- Comprovante anexado não equivale a recebimento conciliado.
- Financeiro só registra baixa após conciliação; documentos financeiros de leitura não geram lançamentos.
- Fórmulas e comissões dependem de regras de vigência, base e arredondamento validadas; não hardcodear itens "a validar".

### 4.6 Segurança e auditoria
- Identidade individual, menor privilégio, escopo por organização/obra e revogação de sessões.
- Permissões por função, módulo, ação e registro; validar no servidor.
- Logs com ator, data/hora, ação, origem, motivo e valores anteriores/novos; nunca registrar segredos.
- Arquivos originais imutáveis; versões e evidências ligadas aos registros estáveis.

## 5. Conciliação PED-000107 — não usar como verdade automática

A aba "Conciliação Revisada" registra diferenças entre pedido, linhas impressas, totais de rodapé e manuscritos. Exemplos: cozinha com contagem de peças divergente; varanda com linhas formais de 2,41465 m² contra rodapé 2,425 m² e anotações manuscritas de 1,064 m²; BWC Master com diferença entre dimensões lidas e rodapé; BWC Filhas compatível após arredondamento; Área de Serviço compatível em área, mas com alteração de divisão de peças. O total do pedido indicado é 25,4524 m², incluindo tampo de mesa da varanda; sem esse tampo, 23,0324 m²; linhas impressas somam 18,50065 m². A própria planilha recomenda não forçar igualdade nem somar manuscritos automaticamente e manter fechamento técnico/financeiro bloqueado até resolver pendências e obter REV05 original. Esses valores são evidência de auditoria de um caso, não parâmetros gerais.

## 6. Matriz de implementação

| Domínio | Evidência na planilha | Código PORCELANE inspecionado | Situação |
|---|---|---|---|
| Propostas/versionamento/comparação | Fluxo Comercial, Propostas, Comparar versões | Ausente | Não implementado |
| Pedido/aditivos/snapshot | Fluxo Comercial, Pedidos | Ausente | Não implementado |
| Ambientes/peças/revisões | Ambientes, Pedido_Itens, Cadastro_Ambientes | Parcial | Modelo incompleto |
| Projeto 2D/3D/pranchas | Projetista 2D3D, TEC | Ausente | Especificado, não implementado |
| Liberação parcial | Liberações, Liberacao_Itens, Fluxo OC OA Liberação | Gate simples | Parcial |
| OC/OA | Fluxo OC OA Liberação, Documentos do Pedido | Ausente | Não implementado |
| Estoque/chapa/retalho | Estoque, Chapas, Retalhos | Tipos/fixtures simples | Parcial |
| Nesting | Corte por material, _aux_corte, TEC | Ausente | Não implementado |
| Produção/QC/retrabalho | Produção, Produtividade, Ocorrências | Gates simples | Parcial |
| Expedição/termo | Expedição | Gates simples | Parcial |
| Financeiro/conciliação | Financeiro, Conciliação Revisada | Ausente | Não implementado |
| Segurança/permissões | ESP - Matriz_Permissoes, AUD - Checklist_Seguranca | Ausente no módulo | Não demonstrado |
| Documentos/dossiê | Documentos do Pedido, Croquis_Referencias | Ausente | Não implementado |
| TEC independente | TEC - Arquitetura_Referencia, Compatibilidade, Plano_Migracao | Geometria básica fora do escopo | Contrato por construir |

## 7. Divergências e bloqueios

1. Base44 é fonte oficial na planilha, enquanto o baseline anterior descrevia integração futura com Supabase. Decisão: construir/testar domínio e telas com adaptadores desacoplados; validar a arquitetura Base44 e manter Supabase explicitamente adiado. Não assumir sincronização entre ambos.
2. 30 dias úteis é referência operacional anterior, mas prazo exige calendário e marco inicial por pedido/ambiente; parâmetros e exceções precisam confirmação.
3. Regras de comissões, custos fixos, método de rebaixo e compatibilidade CNC/DXF permanecem configuráveis ou pendentes até validação.
4. As diferenças PED-000107 impedem automatizar correção de medidas com base em rodapés/manuscritos.
5. Não há evidência de execução do conjunto de testes nem build nesta auditoria.

## 8. Ordem de execução

1. Corrigir invariantes de domínio e testes locais.
2. Formalizar modelo e contratos de API/SDK independentes de persistência.
3. Implementar telas e navegação com estados vazios, carregamento, erro, bloqueios e permissões simuladas.
4. Implementar fluxos comerciais, projeto/liberação, estoque/nesting, produção/expedição e financeiro.
5. Criar documentos versionados e dossiê por pedido/ambiente/peça.
6. Testar segurança, multi-organização, idempotência, auditoria e cenários de ponta a ponta com dados sintéticos.
7. Executar auditoria final de requisitos e evidências.
8. Só então decidir a persistência final (Base44 como fonte indicada na planilha; Supabase apenas se aprovado e após auditoria de schema/RLS).

## 9. Limites desta auditoria

A estrutura das 85 abas foi inventariada e os requisitos estruturais e decisões explícitas foram extraídos. Isso não significa que cada célula, fórmula, nome definido, validação e cálculo financeiro esteja homologado. A validação fórmula a fórmula e a reconciliação completa de dados devem ser executadas como testes dedicados. Nenhuma alteração foi feita no arquivo XLSX, em Base44, Supabase, produção ou deploy.
