# ferraz-core

Núcleo técnico FERRAZ: domínio geométrico, medições, validações e regras de fabricação.

## Implementado nesta branch

- Primeira biblioteca TypeScript de geometria canônica 2D em milímetros, com versão de schema e coordenadas locais.
- Área poligonal com subtração de furos.
- Validação inicial de coordenadas, vértices, auto-interseções, área, espessura e posição de furos.
- Proveniência e estado das medidas, incluindo confirmação humana.
- Gate de domínio que bloqueia fabricação quando geometria, medidas, material ou aprovação não estão confirmados.
- Testes Vitest e workflow de CI com testes e build.

## Limites atuais

Ainda não há editor 2D/3D, curvas, modelagem sólida, cortes/seções, renderização, nesting, pós-processador CNC ou integração com interface/banco. A biblioteca inicial não deve ser usada como única validação para liberar fabricação industrial.

## Executar

```bash
npm install
npm test
npm run build
```

A especificação completa está em docs/CAD-CAM/00-ESPECIFICACAO-MESTRE-CAD-CAM.md.
