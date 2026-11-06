# 10 — Painel de execução da Porcelana

**Atualizado em:** 2026-11-06  
**Regra:** o estado só muda com evidência registrada. Datas de conclusão não são inventadas.

## Visão geral
| Fase | Responsável funcional | Estado | Critério para encerrar |
|---|---|---|---|
| 0. Inventário de ativos e repositórios | Investigador + Supervisor | Em auditoria documental | Lista de ativos, donos, tecnologia, estado e evidências |
| 1. Diagnóstico e descoberta da empresa | Produto + Estratégia | Não iniciado | Setor, oferta, público, problema e fluxo prioritário comprovados |
| 2. Estratégia e posicionamento | Estratégia + Mercado | Bloqueado pela fase 1 | Alternativas testadas e decisão aprovada |
| 3. Marca e experiência | Marca + UX/NIE | Bloqueado pela fase 1 | Identidade e jornada aprovadas |
| 4. MVP digital | Arquitetura + Engenharia | Bloqueado pelas fases 1 e 2 | Fluxo ponta a ponta utilizável em homologação |
| 5. QA e auditoria SEAL | QA independente + SEAL | Não iniciado | Evidências de teste e nenhum bloqueador aberto |
| 6. Liberação controlada | Operações + Direção | Não iniciado | Aprovação expressa, monitoramento e rollback |
| 7. Extração de padrões para CORE | Arquitetura + Auditoria | Não iniciado | Reutilização demonstrada e contrato validado |

## Tarefas ativas
| ID | Tarefa | Responsável | Entrega | Estado |
|---|---|---|---|---|
| POR-INV-001 | Auditar repositórios conectados e localizar implementação existente da Porcelana | Investigador | Inventário com links, tecnologia, estado e riscos | Em auditoria |
| POR-INV-002 | Inventariar marca, canais, materiais, documentos e sistemas existentes | Investigador + Estratégia | Catálogo de ativos com origem e data | Pendente de fontes |
| POR-DIS-001 | Confirmar segmento, oferta, público e geografia por evidências | Produto/Descoberta | Ficha empresarial validada | Pendente de evidências |
| POR-DIS-002 | Mapear jornada atual, gargalos e indicadores | Produto + Operações | Mapa de processo e oportunidades | Bloqueado por POR-DIS-001 |
| POR-TEC-001 | Auditar stack e escolher estratégia de implementação/reuso | Arquitetura | ADR técnico e plano de ambiente | Bloqueado por POR-INV-001 |

## Registro da execução já realizada
- Criada a especificação documental inicial da Porcelana dentro do repositório CORE.
- Registrado que a Porcelana deve começar pequena e funcional e manter interfaces para integração futura.
- Consultada a organização conectada no GitHub: não foi localizado repositório com nome Porcelana na busca executada.
- A ausência de resultado nessa busca não prova que não existam arquivos, sistemas ou repositórios em outras contas/serviços.
- Nenhuma aplicação, banco, agente autônomo ou integração foi criada nesta etapa.

## Próximo bloco de trabalho
Concluir o inventário de repositórios e ativos acessíveis, verificar se há protótipos fora da organização conectada e consolidar a ficha empresarial da Porcelana antes de escolher stack ou iniciar código específico.

## Regra de encerramento
Toda tarefa deve terminar em Concluído, Reprovado com correção aberta, ou Bloqueado com motivo, responsável e próxima ação. Não manter tarefas indefinidamente em andamento sem atualização.
