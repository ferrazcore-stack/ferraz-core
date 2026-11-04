# Plano de execução e aceite — PORCELANE / FERRAZ / TEC

## Princípio
Executar em camadas, com entregas pequenas, commits auditáveis e testes sintéticos. A planilha aponta Base44 como fonte oficial; não conectar Base44 ou Supabase até validar contratos, UX, regras e segurança. Supabase é a última etapa e não está autorizada nesta fase.

## Fases
1. **Fundação do domínio:** IDs estáveis, organização, proposta/versão, snapshot, aditivo, pedido, ambiente, desenho/revisão, peça, liberação, OC/OA, estoque, operação, QC, expedição, financeiro e auditoria.
2. **Regras puras:** unidades mm, geometria, área e arredondamento, calendário, cálculo comercial, comissões versionadas, idempotência e gates.
3. **TEC independente:** pacote sem dependência de UI ou persistência; desenho 2D/3D, cotas, vistas, cortes, biblioteca, import/export e nesting.
4. **Telas PORCELANE:** implementar mapa de telas com dados locais sintéticos e adaptadores; estados vazios/erro/bloqueio/permissão.
5. **Documentos:** dossiê imutável, PDF técnico/comercial, OC, OA, romaneio, recibo e termo final.
6. **Segurança:** multi-organização, RBAC/ABAC, isolamento, sessão, auditoria, rate limits e testes negativos.
7. **Validação:** unit, integração, e2e, typecheck, build, acessibilidade, regressão e reconciliação das fórmulas da planilha.
8. **Auditoria final:** matriz requisito→tela→domínio→teste→evidência, riscos residuais e aprovação explícita.
9. **Supabase por último:** somente após aprovação da auditoria; primeiro inspeção de schema/RLS existente, depois proposta de migração e revisão antes de qualquer execução.

## Critérios de aceite bloqueantes
- Aprovação de proposta cria um único pedido, preservando a versão exata.
- Aditivo não sobrescreve contrato original.
- Medição e liberação não alteram preço/medidas comerciais.
- Liberação parcial preserva histórico e revisão.
- OC/OA apontam às mesmas peças/revisão.
- Não há corte sem plano aprovado, reserva e compatibilidade material.
- Estoque reconcilia físico, reservado e disponível; retalho só após inspeção.
- Peça não avança sem operação concluída ou exceção auditada.
- Entrega parcial não fecha obra; termo final único.
- Anexo de comprovante não equivale a baixa conciliada.
- Usuário não acessa organização/obra fora de escopo.
- Exportações/documentos não geram efeitos financeiros duplicados.
- Testes automatizados e build executados com resultados registrados.

## Pendências que permanecem configuráveis
Percentuais/bases de comissões, valores especiais de corte, método de rebaixo, tolerâncias, calendário e marco inicial de prazo, máquinas/CNC e formatos CAD não homologados. Não automatizar sem validação documentada.
