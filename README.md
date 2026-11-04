# ferraz-core

Núcleo técnico FERRAZ: domínio geométrico, medições, validações e regras de fabricação.

## Implementado nesta branch

- Primeira biblioteca TypeScript de geometria canônica 2D em milímetros, com versão de schema e coordenadas locais.
- Área poligonal com subtração de furos.
- Validação inicial de coordenadas, vértices, auto-interseções, área, espessura e posição de furos.
- Proveniência e estado das medidas, incluindo confirmação humana.
- Gate de domínio que bloqueia fabricação quando geometria, medidas, material ou aprovação não estão confirmados.
- Nesting retangular determinístico inicial, com margens, kerf, material/espessura, rotação condicionada ao veio e rastreio das peças alocadas. O resultado declara `estimate-only`, informa a base do aproveitamento e mantém a origem do template de chapa.
- Editor 2D interativo inicial conectado ao contrato de geometria canônica: seleção, arraste com encaixe em grade de 10 mm, posicionamento numérico, redimensionamento proporcional, rotação de 90°, duplicação, exclusão, zoom e desfazer/refazer.\n- Testes Vitest e workflow de CI com testes e build.

## Limites atuais

O editor 2D ainda é uma primeira etapa: trabalha com peças poligonais já existentes e primitivas retangulares; não possui desenho livre, edição de vértices, cotas técnicas completas, camadas, persistência, vínculo a projeto ou revisão no backend. Não há editor 3D, modelagem sólida, cortes/seções, renderização 3D, pós-processador CNC ou integração operacional com máquinas. A biblioteca e a interface não devem ser usadas como única validação para liberar fabricação industrial.

## Executar

```bash
npm install
npm test
npm run build
```

A especificação completa está em docs/CAD-CAM/00-ESPECIFICACAO-MESTRE-CAD-CAM.md.


### Nesting poligonal (incremento em desenvolvimento)
Foi adicionado um motor heurístico inicial para contornos poligonais côncavos, furos e defeitos de chapa em `src/domain/nesting/polygon-bottom-left.ts`. O resultado é explicitamente estimativo; não é um otimizador global nem gera plano CNC ou liberação de fabricação. Consulte a especificação CAD/CAM para limites e critérios de validação.
\n\n### Editor 2D interativo (incremento inicial)\nO módulo `src/Editor2DPanel.tsx` foi integrado à navegação como **Editor 2D** e consome o tipo `CanonicalPieceGeometry` de `src/domain/geometry/canonical.ts`. Inclui seleção e arraste de peças em uma área SVG, encaixe opcional em grade de 10 mm, zoom, posição X/Y, redimensionamento proporcional, rotação em passos de 90°, duplicação, exclusão e histórico local de desfazer/refazer. As dimensões são exibidas em milímetros e a geometria selecionada passa pela validação canônica.\n\n**Limites:** peças e alterações permanecem apenas no estado da sessão; não há gravação, projetos/ambientes, histórico persistente, edição de vértices, desenho de polígonos livres, cotas, camadas, ferramentas de CAD avançadas ou viewport 3D. O editor não substitui revisão técnica e não libera fabricação.\n