# FERRAZ — Contrato de integração CORE ↔ CONNECT ↔ Empresa

## Arquitetura

O FERRAZ é multiempresa. O CORE é compartilhado; os dados de cada empresa são isolados por organization_id.

- FERRAZ CORE: regras, identidade, permissões, auditoria, histórico, operações e experiência.
- FERRAZ CONNECT: camada de integração por empresa.
- Sistema da empresa: fonte operacional existente quando a empresa já possui um sistema próprio.

## Regra de isolamento

Toda operação deve carregar o contexto da empresa:
- organization_id
- usuário autenticado
- permissões
- sistema de origem/destino

Nenhuma integração pode aceitar uma organização implícita.

## Operações do CONNECT

O contrato deve permitir, quando autorizado:
- consultar cliente/obra/pedido;
- consultar orçamento e opções;
- criar/atualizar registros;
- consultar e transportar documentos;
- registrar eventos;
- sincronizar status;
- encaminhar mensagens para o contexto correto;
- abrir/atualizar projeto técnico;
- consultar arquivos 2D/3D.

## Arquivos

Arquivo não é informação solta. Todo arquivo operacional deve poder ser relacionado a:
Empresa → Cliente → Obra → Pedido → Ambiente → Item/Projeto.

O arquivo original deve ser preservado. O FERRAZ organiza a referência e a visualização sem substituir a fonte original.

## Projeto técnico

O projeto carregado deve manter vínculo com seu arquivo original e seus metadados. A visualização técnica deve funcionar em computador e celular e permitir acesso coerente ao projeto 2D/3D, medidas e peças.

## Segurança

O CONNECT deve operar por credenciais/token próprios da empresa, com escopo mínimo necessário. O CORE nunca deve expor credenciais internas da empresa ao frontend.

## Estado atual

O repositório FERRAZ CORE está acessível nesta conexão GitHub. A implementação do CONNECT e a conexão com o repositório do sistema da empresa dependem do acesso ao respectivo projeto/repositório e das credenciais de integração autorizadas.
