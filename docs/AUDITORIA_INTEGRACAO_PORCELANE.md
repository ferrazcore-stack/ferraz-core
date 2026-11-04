# Auditoria e integração PORCELANE

## Fonte de requisitos
A planilha de referência possui 85 abas. Ela permanece fora do repositório; este documento registra decisões técnicas e rastreabilidade sem copiar o arquivo-fonte.

## Fluxo operacional de referência
Atendimento → proposta → comparação de versões → aprovação → pedido fechado → ambientes/peças → medição → liberação técnica → desenho revisado/aprovado → plano de corte aprovado → reserva de chapa/material → corte → acabamento → produção → inspeção → carregamento/romaneio → entrega → instalação → aceite/conclusão → histórico.

## Regras de integridade a preservar
- Aprovação comercial deve ser evidenciada antes de criar pedido.
- Pedido fechado preserva sua versão comercial; mudanças comerciais usam aditivo.
- Medições, desenhos e liberações são versionados; não sobrescrever revisão aprovada.
- A liberação pode ser parcial por ambiente/peça, desde que a unidade liberada esteja identificada.
- Ordem de corte requer plano aprovado e material reservado.
- Chapa, retalho, perda, qualidade e retrabalho precisam de rastreabilidade.
- Inspeção precede carregamento/entrega; aceite documenta conclusão.
- Documentos são gerados a partir dos registros oficiais, não de cópias paralelas.

## Incremento implementado nesta branch
- `src/lib/cad/geometry.ts`: núcleo 2D determinístico em milímetros, validação de dimensões/recortes/furos, área líquida, volume, projeção de viewport e escala de papel.
- `src/lib/operations/workflow.ts`: gates puros para transições operacionais.

## Limites conhecidos e trabalho pendente
O núcleo atual não é um CAD 3D completo. Não há ainda persistência CAD no Supabase, versionamento de desenhos no banco, motor booleano geral, nesting/otimização de chapas, DXF/SVG/PDF técnico gerado pelo kernel, CAM ou integração de máquina. Os gates no cliente não substituem validação no backend/RLS/RPC. O schema remoto precisa ser inspecionado antes de migrations e integração persistente.

## Auditoria de arquitetura já identificada
- `ferraz-core` usa Supabase; algumas consultas dependem de RLS e não incluem filtro explícito por organização. Validar policies no banco.
- `transitionOrder` atualiza status e tenta inserir evento em operação separada; não é transação atômica nem máquina de estados.
- `ferraz-platform` mantém estado em localStorage; não deve ser mesclado diretamente ao Supabase sem migração controlada.
- `ferraz-platform` possui prancha 2D/lista de corte para impressão, não engine paramétrico 3D.
- Documentos A4/A3/A2, permissões por função, backup, trilha de auditoria e testes de aceite precisam de validação integrada antes de produção.

## Critério de conclusão
Só marcar um fluxo como concluído após testes automatizados, validação de persistência/isolamento multiempresa, auditoria de permissões, evidência documental e build reproduzível. Nenhum merge ou deploy é autorizado por este trabalho.
