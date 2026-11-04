# ferraz-core

Núcleo técnico FERRAZ: domínio geométrico, medições, validações e regras de fabricação.

## Implementado nesta branch

- Primeira biblioteca TypeScript de geometria canônica 2D em milímetros, com versão de schema e coordenadas locais.
- Área poligonal com subtração de furos.
- Validação inicial de coordenadas, vértices, auto-interseções, área, espessura e posição de furos.
- Proveniência e estado das medidas, incluindo confirmação humana.
- Gate de domínio que bloqueia fabricação quando geometria, medidas, material ou aprovação não estão confirmados.
- Nesting retangular determinístico inicial, com margens, kerf, material/espessura, rotação condicionada ao veio e rastreio das peças alocadas. O resultado declara `estimate-only`, informa a base do aproveitamento e mantém a origem do template de chapa.
- Testes Vitest e workflow de CI com testes e build.

## Limites atuais

Ainda não há editor 2D/3D, curvas, modelagem sólida, cortes/seções, renderização, nesting de geometrias irregulares, tratamento de defeitos/áreas proibidas, pós-processador CNC ou integração operacional com interface/banco. A biblioteca inicial não deve ser usada como única validação para liberar fabricação industrial.

## Executar

```bash
npm install
npm test
npm run build
```

A especificação completa está em docs/CAD-CAM/00-ESPECIFICACAO-MESTRE-CAD-CAM.md.


### Nesting poligonal (incremento em desenvolvimento)
Foi adicionado um motor heurístico inicial para contornos poligonais côncavos, furos e defeitos de chapa em `src/domain/nesting/polygon-bottom-left.ts`. O resultado é explicitamente estimativo; não é um otimizador global nem gera plano CNC ou liberação de fabricação. Consulte a especificação CAD/CAM para limites e critérios de validação.
