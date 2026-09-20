# FERRAZ — Arquitetura Inicial

## Objetivo

Criar uma base segura para evolução do FERRAZ sem acoplar regras de negócio à interface.

## Camadas

1. **Interface** — telas, componentes, navegação e experiência.
2. **Aplicação** — casos de uso e orquestração.
3. **Domínio** — entidades, regras e estados do processo.
4. **Dados** — persistência, consultas e integrações.
5. **Infraestrutura** — autenticação, arquivos, PDFs, notificações e serviços externos.

## Fonte única

A entidade de domínio é a fonte oficial. Cards, dashboards, PDFs, Kanbans e agendas são projeções dos mesmos dados, nunca cadastros paralelos.

## Multiempresa

Toda entidade operacional deve possuir vínculo com a empresa/tenant quando aplicável. O isolamento entre empresas deve ser garantido no backend/banco, e não apenas pela interface.

## Histórico

Mudanças relevantes devem preservar versões ou eventos de auditoria. O histórico é parte do domínio, não apenas um log técnico.

## Estados

Estados de processo devem ser explícitos e validados por regras de transição. O usuário não deve conseguir avançar uma etapa quando os pré-requisitos obrigatórios não estiverem atendidos.

## Comercial e técnico

O domínio comercial e o domínio técnico são relacionados, mas não devem compartilhar mutações destrutivas. Pedido fechado é um marco de integridade comercial; medições posteriores devem gerar versões técnicas; mudanças financeiras devem usar aditivos.

## Estratégia de implementação

O repositório atual ainda não contém o aplicativo original. Portanto, esta fundação documenta o contrato arquitetural sem presumir framework, banco ou infraestrutura que não tenham sido confirmados.
