# Arquitetura de produtos e integração

## 1. Regra geral
Cada produto é uma unidade de negócio e software com domínio, identidade, público, UX, roadmap, dados, integrações, modelo comercial e responsabilidade operacional próprios. O CORE fornece serviços compartilhados por contratos estáveis; não absorve indiscriminadamente regras de domínio.

## 2. Produto-piloto
Porcelana foi indicada como primeiro produto-piloto para validar o processo de concepção, experiência, construção, operação e comercialização. Antes de alterar ou integrar, auditar o repositório e confirmar escopo, estágio, tecnologia, dependências e ativos existentes. Não presumir segmento, usuários ou funcionalidades que não estejam documentados.

## 3. Produtos existentes e futuros
- FERRAZ: domínio especializado em consultoria/gestão de projetos com rochas e ferramentas operacionais relacionadas, conforme escopo aprovado.
- My House: produto futuro, com domínio e público a confirmar.
- Novos produtos: passam por pesquisa de mercado, validação de problema, viabilidade técnica, jurídica e financeira.

## 4. Contrato de integração
Cada integração deve especificar:
- produto consumidor e serviço provedor;
- proprietário funcional e técnico;
- versão do contrato;
- autenticação e autorização;
- tenant e contexto de execução;
- esquema de entrada/saída;
- erros, timeouts, limites e retentativas;
- idempotência e consistência;
- eventos e ordem de processamento;
- classificação de dados;
- logs, métricas e custos;
- compatibilidade e política de descontinuação.

## 5. Dados
Preferir APIs e eventos com contratos versionados. Evitar que produtos acessem tabelas internas de outros produtos. Compartilhar somente entidades e atributos necessários. Não criar banco central único para todos os produtos como atalho que comprometa isolamento e autonomia.

## 6. Eventos
Eventos devem ter nome, versão, produtor, instante, identificador, tenant, correlação e payload mínimo. Consumidores devem ser idempotentes e tratar duplicidade, atraso e falha. Eventos não devem conter segredos nem dados pessoais desnecessários.

## 7. Reutilização
Antes de extrair uma capacidade para o CORE, comprovar:
1. uso por mais de um contexto ou benefício estratégico claro;
2. semântica realmente comum;
3. contrato estável;
4. isolamento e autorização adequados;
5. testes independentes;
6. responsável por manutenção;
7. custo total inferior ao benefício.

## 8. Independência e portabilidade
Produtos devem poder evoluir sem depender de detalhes internos não documentados do CORE. Planejar exportação de dados, substituição de fornecedores e migração de integrações. Evitar acoplamento a construtores visuais específicos.

## 9. Critérios de integração
- autenticação e tenant validados;
- contrato e versão documentados;
- testes de autorização e isolamento;
- tratamento de falhas;
- logs e métricas sem vazamento;
- custo e limites conhecidos;
- rollback/desativação definidos;
- aprovação do responsável técnico e de segurança conforme risco.
