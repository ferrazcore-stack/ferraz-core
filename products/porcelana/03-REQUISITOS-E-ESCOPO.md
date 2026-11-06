# 03 — Requisitos e escopo funcional

**Estado:** estrutura de requisitos; funcionalidades específicas aguardam descoberta.  
**Regra:** não transformar ideias em requisitos aprovados sem evidência e priorização.

## 1. Módulos de trabalho do piloto
Os módulos abaixo são áreas de capacidade para organizar a descoberta. Sua ativação depende da necessidade real identificada.

| Área | Resultado esperado | Estado |
|---|---|---|
| Diagnóstico empresarial | visão estruturada da empresa, objetivos e gargalos | A validar |
| Pesquisa de mercado e público | evidências de demanda, concorrência e comportamento | A validar |
| Estratégia e posicionamento | proposta de valor e posicionamento testáveis | A validar |
| Marca e identidade | sistema visual/verbal aprovado e documentado | A validar |
| Design System e experiência | padrões de interface e jornadas consistentes | A validar |
| Conteúdo e materiais comerciais | materiais úteis aos canais e objetivos confirmados | A validar |
| Marketing e crescimento | experimentos e indicadores de aquisição/conversão | A validar |
| Produto digital | fluxo mínimo que resolve problema prioritário | Condicional |
| Operação e gestão | processos, responsáveis, indicadores e controles | A validar |

## 2. Modelo obrigatório de requisito
Cada requisito deve conter:
- ID único (POR-REQ-###);
- problema e evidência de origem;
- ator/usuário;
- resultado esperado;
- fluxo principal e exceções;
- dados de entrada e saída;
- regras de negócio;
- permissões e classificação de dados;
- dependências e integrações;
- prioridade e justificativa;
- critérios de aceite testáveis;
- métricas;
- responsável e revisor;
- estado e histórico de alteração.

## 3. Priorização
- **P0 — bloqueador:** segurança, integridade, acesso ou requisito essencial para validar o fluxo.
- **P1 — essencial:** necessário para o MVP e para o resultado principal.
- **P2 — importante:** melhora operação ou experiência, mas pode vir depois.
- **P3 — futuro:** oportunidade sem necessidade imediata comprovada.

## 4. Critérios para escolher o MVP
Pontuar cada oportunidade por impacto no problema, frequência, urgência, número de usuários afetados, risco, custo, tempo de validação e dependências. Não escolher por preferência tecnológica ou facilidade de demonstração.

## 5. Requisitos transversais
- interface responsiva e acessível;
- linguagem pt-BR quando aplicável ao público confirmado;
- estados claros de carregamento, sucesso, vazio e erro;
- rastreabilidade de alterações importantes;
- autorização no servidor, não apenas na interface;
- isolamento de dados por organização;
- minimização e proteção de dados pessoais;
- exportação/portabilidade de dados relevantes;
- tratamento de falhas e recuperação;
- testes automatizados para regras críticas;
- documentação operacional;
- custos e limites observáveis.

## 6. Regra de liberação
Nenhum módulo vai para produção apenas porque funciona em demonstração. Deve passar por revisão funcional, técnica, segurança, privacidade, acessibilidade e homologação com usuários, conforme risco.
