# 05 — Agentes e fluxo de trabalho da Porcelana

**Estado:** modelo operacional documentado; agentes autônomos ainda não implementados por este documento.  
**Orquestração proposta:** DOTS.

## 1. Princípio
Cada etapa tem uma função responsável, mas não é necessário criar um agente permanente para cada tarefa. Especialistas podem ser acionados sob demanda. O agente executor não aprova sozinho o próprio trabalho.

## 2. Fluxo padrão
1. **DOTS / Orquestrador:** recebe objetivo, cria tarefa, define dependências e acompanha conclusão.
2. **Investigador:** inventaria ativos e coleta fontes/evidências.
3. **Diagnosticador:** separa fatos, hipóteses, riscos e lacunas.
4. **Estrategista/Planejador:** define alternativas, prioridade, plano e critérios de aceite.
5. **Especialista de domínio:** executa pesquisa, design, engenharia, conteúdo ou operação conforme a tarefa.
6. **Executor:** produz o artefato/código aprovado no escopo.
7. **Supervisor:** acompanha dependências, qualidade intermediária e bloqueios.
8. **Revisor independente:** verifica aderência aos requisitos e clareza.
9. **SEAL / Auditor:** avalia segurança, privacidade, governança, riscos e evidências.
10. **Corretor:** resolve não conformidades e devolve para nova revisão.
11. **Homologação:** valida com usuários/representantes autorizados.
12. **Direção:** aprova decisões reservadas, publicação e liberação.

## 3. Contrato de tarefa
Toda tarefa contém:
- identificador;
- objetivo e contexto;
- responsável funcional;
- executor;
- entradas e fontes;
- escopo e exclusões;
- dependências;
- risco e alçada;
- prazo/ordem;
- entregável esperado;
- critérios de aceite;
- evidência de execução;
- revisor independente;
- estado;
- plano de correção/rollback.

## 4. Estados
Não iniciado → Em execução → Em revisão → Homologado → Concluído.

Estados alternativos: Bloqueado, Reprovado, Cancelado. Toda reprovação gera apontamentos acionáveis e retorno ao executor. Nenhuma tarefa fica silenciosamente pendente.

## 5. Regras de autonomia
- Pesquisa em fontes públicas e organização de documentos: permitida dentro do escopo.
- Rascunhos e protótipos: permitidos, claramente identificados como não aprovados.
- Alteração de dados reais, envio externo, publicação, compra, contrato, mudança de permissões ou produção: aprovação explícita conforme risco.
- Segredos e dados pessoais: nunca expor em prompts, logs ou documentos desnecessários.
- Falha de ferramenta ou falta de evidência: registrar bloqueio, não simular conclusão.
