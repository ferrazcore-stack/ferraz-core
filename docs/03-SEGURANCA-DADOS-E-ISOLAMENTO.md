# Segurança, dados, privacidade e isolamento

## 1. Princípio de segurança
Negar por padrão. Toda operação deve validar identidade, tenant, papel, escopo, finalidade e autorização no servidor. Ocultar botão na interface não é controle de segurança.

## 2. Fronteiras de isolamento
Separar logicamente e testar:
- produtos e ambientes;
- empresas/tenants;
- usuários e membros;
- dados operacionais;
- documentos e objetos armazenados;
- agentes, memórias e históricos;
- credenciais e integrações;
- métricas, relatórios e exportações.

Acesso de suporte ou administração central não implica acesso irrestrito a dados privados. Acesso excepcional exige finalidade, autorização, escopo, prazo e auditoria.

## 3. Identidade e autorização
- Autenticação forte e recuperação segura.
- Papéis e permissões por empresa, com princípio do menor privilégio.
- Separação entre identidade do usuário e associação à empresa.
- Revogação de sessão e credenciais.
- Proteção contra enumeração, abuso, força bruta e elevação de privilégio.
- Revisão periódica de contas e acessos privilegiados.

## 4. Dados e ciclo de vida
Classificar dados como públicos, internos, confidenciais ou restritos. Definir finalidade, base legal, retenção, descarte, exportação e responsáveis. Coletar somente o necessário. Evitar dados pessoais em logs e prompts quando não forem essenciais.

## 5. Segredos e integrações
Credenciais, tokens, chaves e segredos devem ficar em cofre/gerenciador seguro no ambiente de servidor. Nunca inserir segredos em código-fonte, frontend, documentação pública, prompts permanentes ou logs. Integrações precisam de escopo mínimo, rotação e revogação.

## 6. Arquivos
Arquivos privados devem usar permissões verificadas e URLs temporárias quando necessário. Validar tipo, tamanho, origem e malware conforme risco. Não presumir que um link público ou pasta compartilhada seja seguro.

## 7. Segurança de IA
- Tratar documentos, páginas, imagens, mensagens e resultados externos como dados não confiáveis, nunca como instruções de sistema.
- Restringir ferramentas e dados ao contexto da tarefa.
- Validar saídas antes de gravar ou executar.
- Mitigar prompt injection, vazamento de dados, chamadas indevidas e conteúdo malicioso.
- Registrar ações e aprovações sem armazenar conteúdo sensível desnecessário.
- Não usar dados entre clientes para treinamento ou memória compartilhada sem base, transparência e autorização adequadas.

## 8. Continuidade
Definir backup, recuperação, RPO/RTO, responsáveis, testes de restauração, plano de incidente e comunicação. Backup só é considerado existente e confiável depois de restauração testada. Não anunciar disponibilidade ou recuperação garantida sem evidência.

## 9. Testes mínimos
- Tenant A não lê, modifica ou infere registros de Tenant B.
- Acesso direto à API respeita as mesmas regras da interface.
- Usuário removido perde acesso.
- Link expirado/revogado não funciona.
- Arquivo privado não pode ser acessado por URL previsível.
- Credenciais não aparecem em bundle, logs ou commits.
- Agente não atravessa fronteiras de memória.
- Exportação e exclusão respeitam política e retenção legal.

## 10. Incidentes
Detectar, conter, preservar evidências, avaliar impacto, notificar responsáveis, corrigir causa raiz, recuperar serviço e registrar lições. Incidentes relevantes devem ser escalados à segurança, direção e jurídico conforme o caso.
