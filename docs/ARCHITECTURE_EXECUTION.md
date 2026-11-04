# FERRAZ — Arquitetura executável da plataforma

**Status:** decisão arquitetural de referência para implementação. Não representa funcionalidades já implantadas.

## 1. Produto e tenancy

FERRAZ é a plataforma SaaS central. Cada empresa cliente é um tenant independente. PORCELANE é o tenant-piloto de validação e a fonte de verdade operacional inicial. Seus processos, dados, exceções e necessidades reais devem orientar a especificação funcional; não é apenas um exemplo nem um conjunto de dados fictício. ÁTRIO é a vertical de marmorarias, ativável como conjunto de módulos. Novos segmentos devem reutilizar o núcleo sem herdar regras exclusivas de marmoraria.

Cada tenant recebe slug e domínio/subdomínio próprio (ex.: porcelane.<domínio-ferraz>), resolvido para tenant_id no servidor. O slug nunca é autorização. Toda operação lê tenant_id da sessão/membership validada no backend; não confiar em tenant_id enviado pelo navegador.

## 2. Contextos e módulos

- **Platform Control Plane:** cadastro de tenants, planos, módulos, domínios, estado de assinatura, suporte administrativo e auditoria de ações privilegiadas.
- **Tenant Workspace:** usuários/memberships, clientes, projetos/obras, ambientes, documentos e configurações.
- **Shared Domain:** orçamentos e versões, pedidos, medições, materiais, fornecedores, produção, qualidade, entrega/instalação e financeiro.
- **Verticals:** ÁTRIO e futuras verticais definem extensões, formulários, estados e regras específicas sem duplicar identidade, tenancy, auditoria ou autorização.
- **Integration Adapters:** armazenamento, WhatsApp, e-mail, ERP e IA. Credenciais exclusivamente server-side.

## 3. Isolamento e segurança obrigatórios

1. Toda tabela operacional tenant-owned tem tenant_id NOT NULL, FK para tenants e índices iniciados por tenant_id.
2. RLS deny-by-default; políticas SELECT/INSERT/UPDATE/DELETE verificam membership ativa e permissão específica.
3. RPCs e funções SECURITY DEFINER fixam search_path, validam tenant, papel, entidade e transição; não aceitam tenant arbitrário sem checagem.
4. Referências entre registros validam mesmo tenant; catálogos globais são explicitamente read-only.
5. Platform admin não recebe acesso implícito ao conteúdo privado do tenant. Acesso excepcional requer motivo, escopo, prazo e auditoria.
6. Links públicos usam token aleatório, escopo mínimo, expiração e revogação; nunca expõem IDs internos ou payloads completos.
7. Segredos, service-role keys e tokens não entram em frontend, commits, logs ou prompts.
8. Dados históricos sem tenant identificado permanecem em quarentena; não atribuir tenant por inferência.

## 4. Identidade e endereços

Usuário é identidade global; membership liga user_id a tenant_id com role e permissões. Um usuário pode pertencer a vários tenants. O domínio resolve contexto, mas a sessão e membership determinam acesso. Troca de empresa exige seleção explícita e revalidação server-side. Convites expiram e só podem ser aceitos pela identidade destinatária.

## 5. Modelo de domínio canônico

Tenant, User, Membership, Role/Permission, Customer, Contact, Project, Environment, Quote, QuoteVersion, QuoteItem, Measurement, Material, MaterialLot/Slab, Supplier, SupplierQuote, Order, OrderItem, ProductionTask, QualityInspection, Delivery, Installation, Document, FileObject, FinancialEntry, Commission, AuditEvent, StatusEvent, IntegrationConnection, ModuleEntitlement.

Cliente, projeto/obra e pedido são entidades distintas. QuoteVersion enviada/aprovada é imutável. Order referencia a versão aceita e preserva snapshot contratual. Valores monetários usam decimal/centavos inteiros com moeda explícita; medidas armazenam unidade e precisão. Dados ausentes permanecem nulos, nunca estimados.

## 6. Fluxo vertical inicial — PORCELANE / ÁTRIO

Tenant e equipe → cliente → obra/projeto → ambientes → orçamento e itens → revisão → versão congelada → aprovação explícita → pedido derivado → medição e validação técnica → confirmação de material → liberação de produção → corte/acabamento → inspeção/retrabalho → entrega/instalação → financeiro/encerramento.

Transições inválidas são recusadas. Exceções exigem papel autorizado, motivo e AuditEvent. Etapas parciais por ambiente/peça são entidades/eventos próprios, não um status global que apaga progresso granular.

## 7. Política de automação sem créditos de IA por padrão

Princípio: deterministic-first, local-first, AI-opt-in. Nenhum fluxo automático chama modelo pago, API generativa ou serviço com cobrança variável sem consentimento explícito e indicação de custo.

Preferir:
- parsing local de CSV/XLSX com bibliotecas determinísticas, fórmulas preservadas e validação de esquema;
- OCR local/offline e extração geométrica determinística para PDF/imagem quando viável;
- leitura de PDF/texto e metadados sem IA;
- regras explícitas, tabelas de decisão, cálculos reproduzíveis e jobs locais;
- cache, hash, deduplicação e processamento incremental;
- fila de revisão humana para baixa confiança ou campos ambíguos.

IA é fallback opcional para casos que o processamento determinístico não resolve (ex.: interpretação semântica de planta complexa). Deve ser acionada por ação consciente, mostrar estimativa/limite de custo, permitir cancelamento e registrar fornecedor, modelo, tokens/custo e consentimento. Nunca ativar leitura por IA automaticamente.

### Pipeline de documentos e plantas
1. Upload seguro e validação de tipo/tamanho/malware.
2. Hash SHA-256 e deduplicação.
3. Extração local de texto/camadas/metadados (PDF/DXF/SVG/CSV/XLSX).
4. OCR local quando documento rasterizado; preservar imagem original.
5. Parser de geometria/cotas e unidades com proveniência de cada campo.
6. Validação de medidas, escala e consistência; não inferir cotas ausentes.
7. Tela de conferência humana para ambiguidades.
8. Persistir dados normalizados e arquivo original com tenant scope.
9. IA somente mediante opt-in para exceções, sem substituir validação técnica.

## 8. Arquitetura de aplicação

Monólito modular inicialmente. Frontend React/Vite mantém apresentação e interação; serviços de domínio/API executam regras e autorização; Postgres/Supabase é candidato já presente no Core, sujeito a validação de schema, RLS, backup e custo. Não duplicar banco entre repositórios. Um único backend canônico atende Platform Control Plane e Tenant Workspaces.

Separar pacotes por domínio: identity-tenancy, access-control, customers-projects, commercial, orders, technical, inventory-procurement, production-quality, delivery, finance, documents, integrations, automation. Evitar microserviços prematuros.

## 9. Integração entre repositórios

- ferraz-core: núcleo técnico canônico, contratos de domínio, backend, segurança, testes e documentação arquitetural.
- ferraz-platform: especificação funcional e documentação de produto; migrar/consolidar decisões para o Core via PR, sem manter especificações contraditórias.
- Lovable app: interface e experiência; consome contratos/APIs do Core. Não é fonte independente de regras nem de dados.
- ferraz-connect: adaptadores de integrações somente quando houver implementação concreta.
- ferraz-company-system e Ferraz-Canvas: não assumir papel funcional sem código validado.

Não sincronizar repositórios por cópia manual ou banco duplicado. Usar contratos versionados, PRs rastreáveis e um único backend.

## 10. PORCELANE como especificação viva e conjunto integral de validação

A realidade operacional da PORCELANE é a referência funcional prioritária e mais atual. A especificação antiga do FERRAZ deve ser comparada e atualizada a partir dela, não o contrário. A planilha operacional vigente é uma fonte primária de requisitos e evidências: abas, colunas, fórmulas, validações, cadastros, exceções, relações, relatórios e rotinas devem ser inventariados e mapeados para o sistema. A planilha não deve permanecer como banco paralelo depois da migração.

A análise da planilha deve gerar:
- inventário completo de abas, tabelas, campos, fórmulas, validações, dependências e relatórios;
- dicionário de dados com tipo, unidade, obrigatoriedade, origem e regra;
- mapa de processos reais, estados, permissões, exceções e responsáveis;
- matriz de rastreabilidade: cada campo/regra da planilha ligado a tela, serviço, entidade, teste e relatório no FERRAZ;
- lista explícita de divergências entre planilha, documentação antiga e implementação atual;
- identificação de dados faltantes ou ambíguos sem preenchê-los por suposição.

### Testes com a realidade completa da PORCELANE

Os testes de aceitação funcional devem cobrir **todo o universo operacional da PORCELANE**, não apenas dados sintéticos ou um fluxo demonstrativo. Isso inclui todos os cadastros, registros históricos, orçamentos, versões, pedidos, ambientes, peças, desenhos/plantas, medidas, materiais, fornecedores, produção, entregas, instalações, lançamentos financeiros, comissões, documentos, fórmulas, relatórios e exceções que existirem na fonte validada.

Execução obrigatória em ambiente isolado de homologação:
1. Obter cópia íntegra e autorizada da fonte atual da PORCELANE, preservando original, fórmulas, anexos e proveniência.
2. Classificar e mapear 100% dos dados e regras; registrar contagens, totais de controle, linhas rejeitadas e campos sem correspondência.
3. Importar a cópia completa para tenant de homologação PORCELANE, com acesso restrito e trilha de auditoria. Não usar fixtures públicas nem misturar com produção.
4. Reconciliar contagens, somas, fórmulas, saldos e relações entre origem e destino; nenhuma divergência pode ser silenciosamente descartada.
5. Executar os fluxos reais de ponta a ponta com os registros e exceções da PORCELANE, incluindo desenho, catálogo, orçamento, pedido, produção, entrega e financeiro.
6. Testar regressão sobre dados históricos e cenários-limite; comparar resultados do FERRAZ com resultados conhecidos da operação atual.
7. Validar isolamento multiempresa criando ao menos outro tenant de teste separado; confirmar que usuários e operações de PORCELANE não acessam o outro tenant e vice-versa.
8. Registrar evidências, falhas, correções e aprovação funcional da PORCELANE antes de qualquer migração produtiva.

Dados reais exigem autorização, controles de acesso, minimização de cópias, criptografia, backups e política de retenção. Não enviar plantas, planilhas, documentos ou dados pessoais a serviços de IA externos por padrão. A automação determinística/local deve ser exercitada primeiro; qualquer uso de IA exige autorização específica e avaliação de custo e privacidade.

## 11. Regra de execução

Trabalhar em branches e PRs. Não alterar a operação ativa nem publicar deploy sem janela e autorização. A homologação deve usar uma cópia integral e protegida dos dados da PORCELANE, não dados inventados; preservar o original imutável. A importação para produção é etapa separada, após reconciliação e aceite. Toda regra não confirmada fica marcada como pendente, não vira default silencioso.
