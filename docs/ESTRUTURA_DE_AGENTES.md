# Estrutura de Agentes — SaaS para Marmorarias

**Data:** 07/11/2026
**Estado:** proposta para aprovação da fundadora. Ainda não está implementada.
**Base:** governança do `ferraz-company-system` + skills Projetista de Orçamento e Comparador de Fornecedores + fluxo da empresa piloto.

---

## 1. Os papéis

| Papel | O que faz | Pode | Não pode |
|---|---|---|---|
| **Operador** | Recebe o pedido, descobre o setor certo, divide em tarefas, distribui e junta o resultado | Distribuir, cobrar prazo, juntar entregas | Executar, revisar ou aprovar a própria tarefa |
| **Agente** | Especialista de um tipo de tarefa | Executar dentro do seu tema | Sair do seu tema |
| **Subagente** | Faz uma parte pequena da tarefa do agente | Executar a parte dele | Entregar direto ao cliente |
| **Executor** | Faz o trabalho | Criar rascunho | Aprovar o que fez |
| **Revisor** | Confere de forma independente e pode **reprovar** | Aprovar, aprovar com ressalva, reprovar | Revisar o próprio trabalho |
| **Supervisor** | Gerente do setor: libera, decide conflitos, chama a pessoa responsável | Liberar, devolver, escalar para humano | Pular o revisor |

**Ciclo de toda tarefa:**

```
Operador → Executor → Revisor → Supervisor → (Pessoa aprova, quando exigido) → Entrega
                ↑          │
                └── reprovado: volta com o motivo
```

---

## 2. Organograma

```
                         OPERADOR (central)
                               │
 ┌──────────┬──────────┬───────┴────┬───────────┬───────────┬──────────┐
COMERCIAL  TÉCNICO   COMPRAS E    PRODUÇÃO    FINANCEIRO     RH      QUALIDADE
                     ESTOQUE                                       (todos os setores)
```

Cada setor tem **1 Supervisor** (Gerente do setor) e uma **pessoa responsável** na empresa.

---

## 3. Setores, agentes e subagentes

### 3.1 Comercial — Supervisor: Gerente Comercial
| Agente | Subagentes | Revisor |
|---|---|---|
| Atendente | Guia de conversa · Qualificador do cliente | Revisor Comercial |
| Orçamentista | Leitor de projeto (PDF/foto) · Calculador (em código) · Montador do PDF | Revisor de Orçamento |
| Comparador de Propostas | Montador de opções (material A × B × C) · Calculador de diferença | Revisor de Orçamento |
| Catálogo | Fotos e preços por m² · Biblioteca de acabamentos | Revisor Comercial |

### 3.2 Técnico — Supervisor: Gerente Técnico
| Agente | Subagentes | Revisor |
|---|---|---|
| Projetista de Orçamento *(skill existente)* | Levantamento de material · Levantamento de serviços · Insumos · Pendências | Revisor Técnico |
| Medição e Liberação | Agenda · Registro por ambiente · Liberação técnica | Revisor Técnico |
| Plano de Corte | Paginação na chapa (em código) · Aviso de emenda | Revisor Técnico |
| Projeto 2D/3D *(futuro)* | Leitor de arquivo · Visualizador | Revisor Técnico |

### 3.3 Compras e Estoque — Supervisor: Gerente Administrativo
| Agente | Subagentes | Revisor |
|---|---|---|
| Comparador de Fornecedores *(skill existente)* | Leitor de documentos · Casamento de itens · Custo real | Revisor de Compras |
| Estoque de Chapas | Entrada de chapa (medida, lote, foto) · Reserva por pedido · Sobras | Revisor de Compras |
| Estoque de Insumos | Consumo por obra · Alerta de reposição | Revisor de Compras |
| Conferência de Recebimento | Orçado × nota × recebido | Revisor de Compras |

### 3.4 Produção — Supervisor: Gerente de Produção
| Agente | Subagentes | Revisor |
|---|---|---|
| Fila de Produção | Etapas · Alerta de atraso (15 dias) · Responsáveis | Revisor de Produção |
| Expedição | Romaneio · Frete · Agenda de instalação | Revisor de Produção |
| Produtividade | Cálculo do cortador · Cálculo do acabador | Revisor Financeiro |

### 3.5 Financeiro — Supervisor: Gerente Financeiro
| Agente | Subagentes | Revisor |
|---|---|---|
| Contas | A receber · A pagar · Fluxo de caixa · Recibos | Revisor Financeiro |
| Comissões | Vendedores · Medição · Parceiros | Revisor Financeiro |
| Custos e Precificação | Custo real · Margem · Tabela de preço | Revisor Financeiro |
| Relatórios | Diário · Obra · Indicadores | Revisor Financeiro |

### 3.6 RH — Supervisor: Gerente de RH
| Agente | Subagentes | Revisor |
|---|---|---|
| Pessoas | Cadastro · Funções · Portal do funcionário | Revisor de RH |
| Ponto e Folha *(futuro)* | Ponto · Férias · Folha | Revisor de RH |

### 3.7 Qualidade — atende todos os setores
| Agente | O que faz |
|---|---|
| Auditor | Compara pedido × levantamento × medição; diferença vira aditivo |
| Guardião de Dados | Garante que uma empresa nunca vê dados de outra |
| Testador | Testa cálculos e regras antes de liberar mudanças |

---

## 4. Regras que valem para todos

1. **Conta é feita em código, nunca de cabeça.** A IA lê, organiza e confere. A conta é sempre do sistema.
2. **Ninguém revisa o próprio trabalho.**
3. **Reprovado volta ao executor**, com o motivo escrito.
4. **Sem revisor disponível = "aguardando revisão"**, nunca "pronto".
5. **A pessoa responsável aprova** antes de: enviar preço ao cliente, comprar, pagar, mudar pedido fechado, mandar WhatsApp, publicar.
6. **Cada empresa tem seus dados separados.** Agente de uma marmoraria nunca usa dados de outra.
7. **Nada é inventado.** O que falta vira pendência, e a pergunta é feita uma por vez.
8. **Tudo fica registrado:** quem pediu, quem fez, quem revisou, quem aprovou e quando.

---

## 5. Exemplo: orçamento do começo ao fim

```
1. Vendedor envia o PDF do projeto
2. OPERADOR → Setor Técnico
3. Projetista (executor) faz o levantamento das peças e serviços
4. Revisor Técnico confere as medidas × planta × detalhe → aprovado
5. Gerente Técnico libera → Setor Comercial
6. Orçamentista calcula; Comparador monta 3 opções de material
7. Revisor de Orçamento confere preços, descontos e fórmulas → aprovado
8. Gerente Comercial libera
9. VENDEDOR (pessoa) aprova → envia ao cliente
```

---

## 6. Ordem para construir

1. Operador + ciclo executor → revisor → supervisor (a base)
2. Setor Técnico: Projetista de Orçamento
3. Setor Comercial: Orçamentista + Comparador de Propostas
4. Compras e Estoque
5. Produção, Financeiro, RH
