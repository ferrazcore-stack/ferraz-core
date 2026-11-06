# Operação, qualidade, observabilidade e eficiência

## 1. Ciclo de desenvolvimento
Descoberta → especificação → arquitetura → implementação → revisão → testes → homologação → release gradual → observação → aprendizado.

Toda entrega tem responsável, escopo, dependências, riscos, critérios de aceite, documentação e plano de reversão.

## 2. Ambientes
Separar desenvolvimento, teste/homologação e produção. Dados reais não devem ser copiados para ambientes inferiores sem base, minimização e proteção. Segredos e permissões são específicos por ambiente.

## 3. Qualidade
- testes unitários para regras;
- testes de integração para contratos;
- testes end-to-end para fluxos críticos;
- testes de autorização e isolamento;
- testes de regressão;
- testes de acessibilidade e responsividade;
- testes de desempenho e carga conforme escala;
- revisão de dependências e segurança;
- testes de restauração e continuidade.

## 4. Release
Mudanças relevantes devem passar por branch isolada e pull request. Não publicar diretamente na branch principal sem revisão quando houver impacto significativo. Usar rollout gradual, feature flags e rollback quando aplicável. Nenhuma mudança deve apagar dados ou alterar permissões sem aprovação e plano de recuperação.

## 5. Observabilidade
Registrar métricas, logs e traces com correlação. Alertar para indisponibilidade, erros, latência, falhas de integração, aumento de custo, comportamento anômalo e tarefas de agentes travadas. Monitoramento só é declarado ativo quando alertas, destinos, horários, responsáveis e testes estiverem configurados.

## 6. Eficiência e custos
Acompanhar custo por produto, cliente, ambiente e capacidade:
- computação, banco, armazenamento e tráfego;
- modelos, tokens, ferramentas e agentes;
- APIs, mensagens e integrações;
- suporte, implantação e manutenção.

Detectar loops, duplicidade, chamadas repetidas, armazenamento ocioso e recursos superdimensionados. Usar modelo mais econômico para tarefa simples e escalonar para modelo avançado quando a complexidade justificar. Cache apenas quando segurança e validade permitirem.

## 7. Limites financeiros
Cada produto/ambiente deve ter orçamento, limite, alerta e responsável. Ajustes automáticos só podem ser baixos em risco, reversíveis e testados. Aumento de orçamento, troca de fornecedor ou alteração de arquitetura de alto impacto exige aprovação.

## 8. Incidentes
Classificar severidade, conter, comunicar, preservar evidências, recuperar, corrigir causa raiz e documentar. Não esconder falhas nem declarar incidente encerrado sem validar recuperação.

## 9. Métricas operacionais
Disponibilidade, latência, taxa de erro, tempo de recuperação, frequência de deploy, falhas pós-release, cobertura de testes, custo por cliente, custo por tarefa, margem bruta, retrabalho, chamados, satisfação e adoção.
