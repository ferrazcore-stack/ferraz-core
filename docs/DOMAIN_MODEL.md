# FERRAZ — Modelo de Domínio

## Princípio

O domínio deve refletir o processo real e manter uma fonte única para cada informação.

## Fase 1 — CORE

### Company
Representa uma empresa/tenant atendida pela plataforma.

Campos conceituais:
- id
- nome
- documento
- status
- plano
- configurações
- created_at
- updated_at

### User
Usuário autenticado.

### Role
Papel funcional.

### Permission
Permissão granular.

### Plan
Plano contratado/configurado.

### Module
Recurso funcional habilitável.

### Integration
Integração com serviço externo.

### AuditEvent
Registro imutável de evento administrativo ou operacional relevante.

## Fase 2 — Operação

### Customer
Cliente final.

### Work/Project
Obra vinculada a um cliente.

### Professional
Arquiteto, designer, engenheiro ou outro profissional relacionado à obra.

### Budget
Proposta comercial.

### BudgetOption
Alternativa comercial dentro do orçamento.

### BudgetItem
Item físico/comercial do orçamento.

### BudgetService
Serviço associado ao orçamento.

### Approval
Aprovação/reprovação e respectiva evidência.

### Order
Pedido criado a partir de orçamento aprovado.

### OrderAddendum
Alteração financeira/comercial posterior ao fechamento.

### Environment
Ambiente da obra.

### Piece
Peça física produzida para um ambiente.

### Measurement
Medição técnica versionada.

### TechnicalRelease
Liberação formal para continuidade técnica/produção.

### Drawing
Documento/desenho técnico versionado.

### CutPlan
Paginação/plano de corte.

### ProductionTask
Tarefa operacional associada à peça.

### Inspection
Conferência/controle de qualidade.

### Loading
Carregamento.

### DeliveryManifest
Romaneio.

### Delivery
Entrega.

### Installation
Instalação.

### Term/Receipt
Documento de conclusão/recebimento.

### PaymentCondition
Condição comercial de pagamento.

### Payment
Registro financeiro.

### CommissionRule
Regra parametrizável de comissão.

### Commission
Comissão calculada/registrada.

### Attachment
Arquivo/anexo associado a uma entidade.

## Relacionamentos essenciais

```text
Company
  ├── Users
  ├── Plans / Modules
  ├── Integrations
  └── Customers / Projects (Fase 2)
          └── Budgets
                └── Approval
                      └── Order
                           ├── Addenda
                           ├── Environments
                           │      └── Pieces
                           │             ├── Measurements
                           │             ├── Drawings
                           │             ├── Cut Plans
                           │             └── Production
                           ├── Loading
                           ├── Delivery Manifest
                           ├── Delivery / Installation
                           └── Term / Receipt
```

## Regras de integridade

- Uma obra pertence a uma empresa e a um cliente.
- Um orçamento pertence a uma obra.
- Um pedido nasce de um orçamento aprovado.
- Um pedido fechado mantém sua versão comercial.
- Aditivos não alteram silenciosamente o pedido fechado.
- Medições são versionadas.
- Peças pertencem a ambientes e pedidos.
- Produção opera sobre peças/etapas, não sobre cópias independentes do pedido.
- Romaneio referencia o que será carregado/entregue; não recria peças.
- Documentos devem referenciar as entidades oficiais.
- Eventos relevantes devem gerar auditoria.
