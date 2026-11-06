# Governança, responsabilidades e decisões

## 1. Autoridade e prestação de contas
A fundadora exerce a direção-geral e define visão, prioridades e decisões reservadas à proprietária. A execução pode ser delegada a pessoas, fornecedores e agentes dentro de alçadas explícitas. A responsabilidade legal não é transferida para IA.

## 2. Modelo de responsabilidades
- **Diretoria/frente:** responde por um resultado amplo.
- **Departamento:** reúne uma especialidade.
- **Função:** descreve uma responsabilidade concreta.
- **Agente:** software que executa uma função delimitada.
- **Orquestrador:** seleciona capacidades, distribui tarefas e acompanha dependências.
- **Supervisor:** verifica prazo, qualidade e impedimentos.
- **Auditor independente (SEAL):** revisa evidências, controles e conformidade sem ser o executor primário.
- **Responsável humano:** responde por decisões que exigem julgamento, autorização ou responsabilidade profissional.

Uma pessoa pode acumular funções no início; uma função não precisa virar um cargo ou agente permanente.

## 3. Seis frentes
### 3.1 Direção e Estratégia
Planejamento, portfólio, metas, priorização, orçamento estratégico, parcerias e avaliação de oportunidades.

### 3.2 Tecnologia e Inovação
Arquitetura, desenvolvimento, engenharia de software, dados, IA, pesquisa, experiência digital, qualidade e gestão técnica de produto.

### 3.3 Operações e Infraestrutura
Cloud, deploy, suporte, implantação, confiabilidade, continuidade, atendimento, documentação operacional e gestão de incidentes.

### 3.4 Mercado e Crescimento
Pesquisa de mercado, concorrência, marca, conteúdo, marketing, vendas, relacionamento, sucesso do cliente e expansão.

### 3.5 Governança e Proteção
Jurídico, privacidade, segurança, auditoria, risco, conformidade, contratos e SEAL. Pareceres formais, representação e atos privativos devem ser realizados por profissional habilitado.

### 3.6 Finanças e Eficiência
Planejamento financeiro, fluxo de caixa, custos, orçamento, precificação, margem, cobrança, compras, produtividade e análise de retorno.

## 4. Protocolo universal antes de executar
Toda solicitação passa por estas etapas:
1. Identificar solicitante, empresa/produto, objetivo e resultado esperado.
2. Verificar contexto, dados, permissões, dependências e versão atual.
3. Detectar contradições, lacunas, erros, riscos e efeitos colaterais.
4. Explicar o problema e recomendar alternativa quando a instrução estiver errada ou incompleta.
5. Classificar risco e autonomia.
6. Obter aprovação exigida.
7. Executar em ambiente apropriado.
8. Testar resultado e efeitos sobre módulos dependentes.
9. Registrar evidências, decisão, responsável, aprovação, resultado e rollback.
10. Monitorar a mudança após liberação e encerrar somente com critérios de aceite.

### Classes de execução
- **R0 — leitura:** consulta sem alteração, dentro das permissões.
- **R1 — baixo risco:** ação reversível e limitada, previamente autorizada.
- **R2 — impacto moderado:** preparar mudança, testar e solicitar aprovação do responsável.
- **R3 — crítico:** parar e exigir aprovação humana expressa; pode exigir jurídico, segurança ou direção.
- **R4 — proibido:** ação ilegal, não autorizada, incompatível com política ou que viole direitos/segurança. Recusar e registrar quando apropriado.

Exemplos R3: pagamentos, alteração de conta bancária, envio de contratos, publicação externa, exclusão de dados, mudança de permissões, acesso a dados de outra empresa, alteração de infraestrutura crítica, liberação de produção, compromissos comerciais e mudanças de política.

## 5. Registro de decisão
Toda decisão relevante deve conter:
- identificador e data;
- produto/empresa/ambiente;
- problema e objetivo;
- alternativas consideradas;
- recomendação e justificativa;
- risco e impacto;
- responsável por executar;
- aprovador humano, quando exigido;
- evidências e testes;
- resultado e versão;
- plano de reversão;
- estado: proposta, aprovada, rejeitada, implementada, verificada ou substituída.

## 6. Regras de independência
- Executor não homologa sozinho mudança crítica.
- Auditor não deve alterar silenciosamente o objeto auditado.
- Agente não cria agente com autoridade superior nem concede permissões a si próprio.
- Orquestrador não ignora limites definidos por segurança.
- Direção recebe exceções, riscos e decisões que dependem de sua alçada, não cada tarefa operacional de baixo risco.
- Falhas e divergências devem ser comunicadas, nunca escondidas.

## 7. Jurídico e conformidade
A camada jurídica deve combinar triagem e organização automatizada com revisão de advogado habilitado. IA pode identificar cláusulas, comparar versões, preparar perguntas e apontar riscos; não deve se apresentar como advogado nem emitir parecer formal em substituição ao profissional responsável.

## 8. Indicadores de governança
Acompanhar mudanças sem revisão, falhas pós-release, incidentes, exceções, acessos privilegiados, tempo de aprovação, riscos vencidos, cobertura de testes e ações automatizadas bloqueadas.
