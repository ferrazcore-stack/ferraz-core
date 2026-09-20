# FERRAZ CORE — Fase 1

## Objetivo

A Fase 1 é exclusivamente o sistema central da FERRAZ, dona da tecnologia. Ela administra a plataforma e prepara a infraestrutura para que, posteriormente, cada marmoraria tenha seu próprio ambiente operacional.

## Responsabilidade do CORE

- Empresas/tenants cadastrados
- Usuários
- Perfis e permissões
- Planos e módulos
- Serviços e programas conectados
- Configurações globais
- Integrações
- Monitoramento
- Suporte
- Indicadores da plataforma
- Auditoria
- Saúde dos serviços
- Gestão de acesso

## Separação obrigatória

`ferraz-core` não deve misturar a operação diária de uma marmoraria com a administração da plataforma.

Arquitetura conceitual:

```text
FERRAZ CORE
├── Plataforma
├── Empresas
├── Usuários
├── Permissões
├── Planos
├── Módulos
├── Integrações
├── Serviços
├── Configurações globais
├── Monitoramento
├── Suporte
└── Auditoria

FERRAZ MARMORARIA (Fase 2)
├── Clientes
├── Obras
├── Orçamentos
├── Pedidos
├── Medição
├── Técnico
├── Produção
├── Romaneio
├── Entrega
└── Financeiro operacional
```

## Multiempresa

O CORE deve tratar empresa como tenant. Dados operacionais de uma empresa nunca podem ficar acessíveis a outra empresa.

Toda entidade operacional futura deve possuir vínculo explícito com a empresa/tenant e políticas de autorização correspondentes.

## Usuários e acesso

O modelo de autorização deve suportar:
- usuário global da plataforma;
- usuário vinculado a uma ou mais empresas quando autorizado;
- papel;
- permissões granulares;
- escopo por empresa;
- auditoria de acesso e alterações.

## Planos e módulos

A ativação de funcionalidades deve ser orientada por configuração, não por código duplicado para cada cliente.

Um plano pode definir:
- módulos disponíveis;
- limites;
- recursos habilitados;
- integrações;
- status da assinatura/licença.

## Integrações

O CORE deve manter catálogo e estado das integrações, incluindo:
- provedor;
- finalidade;
- empresa vinculada quando aplicável;
- status;
- última sincronização;
- erros;
- credenciais referenciadas de forma segura.

Segredos não devem ser armazenados em arquivos versionados.

## Monitoramento

O painel administrativo deve permitir identificar:
- serviços indisponíveis;
- integrações com erro;
- tarefas falhas;
- empresas com problemas;
- eventos relevantes;
- alterações administrativas.

## Camada de contexto e automação

Memória e recursos inteligentes devem ser isolados por empresa e contexto. O CORE pode orquestrar recursos, mas não deve vazar contexto entre tenants.

## Portabilidade

A arquitetura deve evitar dependência irreversível de um único fornecedor. Banco, autenticação, armazenamento, funções e integrações devem possuir fronteiras claras.

## Ordem de implementação

1. Contrato arquitetural
2. Modelo de dados
3. Multiempresa
4. Autenticação e autorização
5. Configurações
6. Empresas
7. Usuários e permissões
8. Planos/módulos
9. Integrações
10. Monitoramento
11. Auditoria
12. Dashboard administrativo
13. Ponte controlada para os produtos operacionais
