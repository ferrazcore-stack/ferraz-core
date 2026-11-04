# Cenário de integração PORCELANE — dados sintéticos

Este diretório contém um cenário demonstrativo para validar regras do fluxo operacional.
Nenhum dado real da planilha PORCELANE é armazenado neste repositório.

## Arquivos

- `scenario.ts`: fixture geométrica simples e simulação inicial de gates.
- `domain.ts`: tipos operacionais, integridade, liberação parcial por peça, aprovação de plano e bloqueios de corte/produção/expedição/instalação.
- `fixtures.ts`: pedido sintético com cozinha e banheiro, três peças, uma chapa reservada, um retalho e plano de corte aprovado para duas peças.
- `acceptance.ts`: função `runPorcelaneAcceptance()` que retorna verificações individuais e resultado consolidado.

## Como executar a aceitação

A função é pura e não acessa Supabase:

```ts
import { runPorcelaneAcceptance } from "./src/lib/porcelane/acceptance";

const result = runPorcelaneAcceptance();
if (!result.passed) {
  console.error(result.checks.filter(check => !check.passed));
  throw new Error("Falha na aceitação PORCELANE");
}
console.table(result.checks);
```

O repositório ainda não possui runner de testes configurado. Portanto, a inclusão da função de aceitação não deve ser confundida com execução bem-sucedida de testes ou build.

## Cenário coberto

1. Pedido fechado somente com orçamento aprovado.
2. Ambientes e peças vinculados por identificadores estáveis.
3. Revisão positiva em pedido, ambiente e peça.
4. Liberação técnica parcial: cozinha liberada, lavatório bloqueado por aprovação pendente.
5. Plano de corte restrito a peças com medição, liberação técnica e desenho aprovados.
6. Chapa reservada obrigatória para aprovação/liberação do corte.
7. Retalho com vínculo à chapa de origem e dimensões positivas.
8. Carregamento condicionado à inspeção.
9. Instalação condicionada à entrega.

## Limites importantes

- As regras são validações de domínio TypeScript no cliente; ainda não são enforcement no banco/API.
- A paginação/nesting não calcula posicionamento geométrico nem otimização de chapa.
- Estoque e retalhos são fixtures, não persistência operacional.
- O cenário não cria registros no Supabase e não altera dados de produção.
- A planilha original continua fora do GitHub.
- O cenário é uma amostra inicial; as 85 abas precisam ser mapeadas requisito a requisito para cobertura completa.
