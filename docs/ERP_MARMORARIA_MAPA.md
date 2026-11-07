# ERP Marmoraria — Mapa do que já existe

**Data:** 07/11/2026
**Estado deste documento:** inventário + proposta de estrutura. Nada foi construído ou alterado.
**Cliente real:** Porcelane (marmoraria onde a fundadora trabalha).

---

## 1. O que foi encontrado

| Onde | O que é | Estado |
|---|---|---|
| GitHub `ferraz-core` | Especificação completa do ERP de marmoraria, modelo de dados, backlog, início de código (clientes, obras, orçamentos, pedidos, medição, produção, entrega) | Documentado + código inicial (sem testes) |
| GitHub `ferraz-company-system` | Regras da plataforma multiempresa, governança de agentes (executor → editor → revisor), plano de entrega | Só documentação |
| GitHub `ferraz-connect` | Vazio (só README) | Vazio |
| GitHub `Ferraz-Canvas-` | Vazio (só README) | Vazio |
| Lovable **Porcelane** | App em uso: orçamentos, pedidos, romaneio, PDFs, comissões, prazos, cortador/instalador | **Publicado e editado hoje** |
| Lovable **Porcelane V2** | Orçamento convencional e MFC, PDF A4, orçamento → pedido | Publicado |
| Lovable **Clarity Vision** | Produção e pagamento de cortador/acabador por m² | Não publicado |
| Lovable **Pedra Assistente** | Atendimento com IA para clientes | Não publicado |
| Skill **Projetista de Orçamento (Pedra)** | Lê projeto/PDF e faz levantamento de peças e serviços, item por item | Regras prontas |
| Skill **Comparador de Fornecedores** | Compara chapas e insumos pelo custo real (frete, impostos, perda, pagamento) | Regras prontas |
| Supabase | 1 projeto (`ferrazcore-stack's Project`) | **Pausado (INACTIVE)** |

---

## 2. Estrutura do ERP (módulos) e o que aproveitar

Legenda: ✅ já existe e funciona · 📄 está documentado · 🧩 existe parcial · ❌ falta

### Base (serve para qualquer ofício no futuro)
| Módulo | Aproveitar de | Estado |
|---|---|---|
| Empresas, usuários, permissões, auditoria | `ferraz-core` (DOMAIN_MODEL, PHASE_1_CORE) + `ferraz-company-system` | 📄 🧩 |
| Clientes, obras, arquitetos | `ferraz-core/src/lib/commercial.ts` + Porcelane | 🧩 ✅ |
| Documentos e PDFs | Porcelane / Porcelane V2 | ✅ |
| Agentes com editor e revisor | `ferraz-company-system/docs/02` e `04` | 📄 |

### Comercial
| Módulo | Aproveitar de | Estado |
|---|---|---|
| **Orçamentista com IA** (lê projeto → levantamento) | Skill Projetista de Orçamento (Pedra) | 📄 regras prontas |
| Cálculo do orçamento (m², perda 30%, coleta R$ 300, beneficiamento R$ 820, MFC) | `FERRAZ_MASTER_SPEC.md` + Porcelane V2 | ✅ 📄 |
| **Comparar propostas e materiais** (opção A × B × C) | Entidade `BudgetOption` no modelo | 📄 lógica ❌ |
| Aprovação → Pedido → Aditivo | `ferraz-core` + Porcelane | 🧩 ✅ |
| Comissões (arquiteto 5%, vendedor 2%/3%) | `FERRAZ_MASTER_SPEC.md` + Porcelane | ✅ |
| Atendimento com IA | Pedra Assistente | 🧩 |

### Compras e Estoque
| Módulo | Aproveitar de | Estado |
|---|---|---|
| **Comparador de fornecedores** | Skill Comparador de Fornecedores | 📄 regras prontas |
| Conferência orçado × nota × recebido | Skill Comparador de Fornecedores | 📄 |
| **Estoque de chapas** (medida, lote, espessura, custo real, foto) | Citado nas skills | ❌ **não está no modelo de dados** |
| Estoque de insumos e consumíveis | — | ❌ |

### Técnico e Produção
| Módulo | Aproveitar de | Estado |
|---|---|---|
| Medição, liberação técnica | `ferraz-core/src/lib/operations.ts` | 🧩 |
| Plano de corte / paginação | Entidade `CutPlan` + regras na skill | 📄 cálculo ❌ |
| Projeto 2D/3D (estilo SketchUp) | `INTEGRATION_CONTRACT.md` (visualização 2D/3D) | ❌ fase futura |
| Produção (Kanban corte → acabamento → conferência) | `operations.ts` + Clarity Vision | 🧩 |
| Romaneio, entrega, instalação, termo | Porcelane + `operations.ts` | ✅ 🧩 |

### Gestão
| Módulo | Aproveitar de | Estado |
|---|---|---|
| Financeiro (recebimentos, condições de pagamento) | `FERRAZ_MASTER_SPEC.md` + Porcelane | 🧩 |
| RH — pagamento de produção por m² | Clarity Vision | 🧩 |
| RH — ponto, férias, folha, controle por IA | — | ❌ |
| Dashboard com alertas | `ferraz-core/src/lib/dashboard.ts` | 🧩 |

---

## 3. Problemas encontrados (antes de construir)

1. **Decisões em conflito.** `ferraz-core/BUILD_STATUS.md` diz "começar do zero, Lovable é só referência". `ferraz-company-system` diz "auditar e preservar o sistema existente". Precisa de uma decisão só.
2. **O Porcelane está em uso pelo cliente real.** Nada pode ser alterado nele sem plano e autorização.
3. **4 apps separados no Lovable.** Provavelmente cada um tem seu próprio banco. Dados podem estar duplicados.
4. **Estoque de chapas não existe no modelo de dados**, mas o comparador e o plano de corte dependem dele.
5. **Supabase está pausado.** O código do `ferraz-core` não roda até reativar.
6. **`ferraz-core/package.json` usa versão "latest" em tudo.** Pode quebrar sozinho no futuro. Corrigir ao retomar o código.
7. **Faltam dados reais da Porcelane:** tabela de preços aprovada, regras de insumos, como cobra borda 45° (pendência já registrada na skill).

---

## 4. Ordem sugerida (uma coisa por vez)

1. Decidir: o ERP novo **substitui** ou **conecta** o Porcelane atual?
2. Auditar o Porcelane (só ler, sem alterar).
3. Coletar a tabela de preços e as regras de orçamento da Porcelane.
4. Construir o **Orçamentista com IA** + comparação de opções/materiais.
5. Estoque de chapas → Comparador de fornecedores → Plano de corte.
6. Depois: produção, financeiro, RH, projeto 3D.

---

## 5. Decisões aprovadas

- Começar pela marmoraria, com base preparada para virar construção civil depois.
- **07/11/2026 — O produto é um SaaS** (um sistema vendido por assinatura para várias marmorarias), que controla toda a estrutura.
- **07/11/2026 — A Porcelane é o projeto piloto** (primeira empresa a usar). O fluxo do SaaS segue a documentação da Porcelane, com ajustes.
- Pendente: o app Porcelane atual (Lovable) será substituído ou conectado? Decidir depois de ler a documentação da Porcelane.
