# ferraz-core

Núcleo tecnológico, governança e arquitetura compartilhada do ecossistema FERRAZ.

## Arquitetura-mestre

A arquitetura do ecossistema está documentada em [docs/00-ARQUITETURA-MESTRE.md](docs/00-ARQUITETURA-MESTRE.md).

### Documentos oficiais desta versão

1. [Arquitetura-mestre do ecossistema](docs/00-ARQUITETURA-MESTRE.md)
2. [Governança e decisões](docs/01-GOVERNANCA-E-DECISOES.md)
3. [Agentes, DOTS e orquestração](docs/02-AGENTES-E-ORQUESTRACAO.md)
4. [Segurança, dados e isolamento](docs/03-SEGURANCA-DADOS-E-ISOLAMENTO.md)
5. [Inteligência de Experiência e Design System](docs/04-INTELIGENCIA-DE-EXPERIENCIA-E-DESIGN-SYSTEM.md)
6. [Arquitetura de produtos e integração](docs/05-ARQUITETURA-DE-PRODUTOS-E-INTEGRACAO.md)
7. [Operação, qualidade e custos](docs/06-OPERACAO-QUALIDADE-E-CUSTOS.md)
8. [Roadmap e critérios de aceite](docs/07-ROADMAP-E-CRITERIOS-DE-ACEITE.md)

## Princípios

- Núcleo compartilhado, produtos especializados e dados isolados.
- Auditar e aproveitar ativos existentes antes de reconstruir.
- Agentes com permissões limitadas, autonomia proporcional ao risco e revisão independente.
- Decisões críticas sob aprovação humana.
- Design System compartilhado como padrão técnico, sem impor a mesma identidade visual a todos os produtos.
- Nenhuma funcionalidade é considerada implementada apenas por estar documentada.

## Estado desta entrega

**Documentação arquitetural inicial em revisão.** Os arquivos desta entrega foram organizados em uma branch específica para revisão. Não houve alteração do código de aplicação, da branch principal ou dos ambientes de produção. A arquitetura descrita é uma referência-alvo; a implementação real deverá ser auditada e homologada por etapas.

## Processo de mudança

Mudanças estruturais devem ser feitas em branch, revisadas por pull request, testadas e aprovadas antes de integrar à branch principal. Toda alteração deve indicar motivo, impacto, evidências e plano de reversão quando aplicável.


## Produto-piloto: Porcelana

A especificação do primeiro produto-piloto está em [products/porcelana/README.md](products/porcelana/README.md). Ela contém carta do produto, protocolo de descoberta, requisitos, experiência e marca, fluxo de agentes, plano de entrega, homologação e registro de decisões.

**Importante:** o segmento e o escopo funcional da Porcelana permanecem em descoberta. A documentação não declara funcionalidades implementadas nem autoriza publicação ou produção.
