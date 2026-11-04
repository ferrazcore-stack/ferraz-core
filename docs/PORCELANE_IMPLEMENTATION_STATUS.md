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
