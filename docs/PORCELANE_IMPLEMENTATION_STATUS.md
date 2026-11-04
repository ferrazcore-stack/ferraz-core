# Status real de implementação — PORCELANE / FERRAZ / TEC

Atualizado: 04/11/2026
Branch: `feature/integracao-porcelane`

## Entregas implementadas nesta rodada

- Fortalecida a validação de pedido: IDs de ambientes, peças, chapas, retalhos e planos únicos; vínculos entre peça/ambiente/plano/chapa; dimensões e revisões.
- Validação de retalho contra material, espessura e dimensões da chapa de origem.
- Plano de corte agora valida revisão compatível das peças, referências duplicadas, vínculo prévio da peça com outro plano, espessura das chapas e identidade do aprovador antes de liberar o corte.
- Gate de produção aceita contexto de pedido opcional e, quando fornecido, confirma existência, aprovação, validade e inclusão da peça no plano.
- Adicionados cenários de aceitação para ambiente duplicado, retalho incompatível, aprovação sem identidade e início de produção sem plano válido.

## O que ainda não foi demonstrado

- A função `runPorcelaneAcceptance()` foi ampliada, mas não há evidência de execução em runner.
- Build/typecheck ainda não executados.
- Não há teste E2E nem evidência de telas completas.
- As telas atuais ainda incluem conteúdo demonstrativo e mensagens que indicam operações não conectadas.
- A integração de dados permanece arquiteturalmente pendente. A planilha indica Base44 como fonte oficial; não conectar backend nesta etapa.
- Motor CAD/3D e nesting real não implementados por esta alteração.
- Fluxos comerciais, aditivos, financeiro, documentos e permissões backend continuam pendentes.

## Critério de transparência

Não declarar o produto pronto para uso real até executar build, testes e validação ponta a ponta, implementar as telas/fluxos pendentes e aprovar a auditoria de segurança. Supabase permanece por último, conforme decisão do projeto.


## Atualização — repositório-only (04/11/2026)

### Alterações concretas
- Criado `src/lib/localStore.ts`: repositório tipado com persistência no `localStorage`, IDs locais e estado isolado do backend.
- Reescritos `commercial.ts` e `operations.ts` para CRUD local de clientes, obras, orçamentos, medições, tarefas, expedições e transições de pedido.
- `dashboard.ts` passou a ler exclusivamente o repositório local.
- `App.tsx` deixou de importar/consultar Supabase e direciona Pedidos, Medição, Produção e Expedição ao painel operacional.
- A criação simulada de pedido foi removida: pedido não é criado até existir fluxo de aprovação comercial completo.
- Gate técnico reforçado para verificar pertencimento da peça ao pedido e consistência entre reserva individual e chapas do plano.

### Limites e riscos ainda abertos
- O armazenamento local é por navegador/dispositivo; não oferece sincronização multiusuário, controle de acesso real, backup central, nem fonte oficial compartilhada. É adequado apenas para desenvolvimento e testes locais.
- Orçamento local ainda é apenas cabeçalho sem itens/ambientes/precificação, portanto não pode ser aprovado nem gerar pedido.
- A interface de Financeiro e Configurações ainda não implementa os fluxos completos.
- Não há motor de nesting geométrico, CAD/3D ou exportação CNC/DXF.
- A tabela de pedidos fica vazia até existir um processo válido de aprovação de orçamento e geração de pedido.
- O módulo de expedição registra evento simples, mas não implementa romaneio por peça/ambiente, entrega parcial ou termo final.
- A integração Supabase permanece no código legado/dependências, mas não é chamada pelos novos fluxos; remoção total do pacote/arquivo legado requer auditoria de imports completa.

### Verificação
- Alterações gravadas na branch; nenhum merge ou deploy executado.
- Build e testes automatizados ainda não foram executados neste ambiente. Não declarar compilação aprovada.
- Não usar estes dados locais como operação de produção nem como substituto do backend multiusuário.
