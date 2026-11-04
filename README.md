# ferraz-core

Núcleo técnico FERRAZ: domínio geométrico, medições, validações e regras de fabricação.

## Implementado nesta branch

- Primeira biblioteca TypeScript de geometria canônica 2D em milímetros, com versão de schema e coordenadas locais.
- Área poligonal com subtração de furos.
- Validação inicial de coordenadas, vértices, auto-interseções, área, espessura e posição de furos.
- Proveniência e estado das medidas, incluindo confirmação humana.
- Gate de domínio que bloqueia fabricação quando geometria, medidas, material ou aprovação não estão confirmados.
- Nesting retangular determinístico inicial, com margens, kerf, material/espessura, rotação condicionada ao veio e rastreio das peças alocadas. O resultado declara `estimate-only`, informa a base do aproveitamento e mantém a origem do template de chapa.
- Editor 2D interativo conectado à geometria canônica: seleção, arraste, grade de 10 mm, posicionamento numérico, redimensionamento, edição de vértices, desenho livre de contornos, cotas gerais, rotação, duplicação, exclusão, zoom e desfazer/refazer. Rascunhos e revisões são armazenados localmente no navegador.
- Prévia 3D isométrica extrudada da geometria selecionada, com órbita de câmera e zoom; é uma visualização aproximada, não um modelador sólido.
- Contratos iniciais de CAM para cadastro de máquinas, ferramentas, operações e trabalhos, com validação de limites, compatibilidade, pós-processador e aprovação humana. A validação não gera G-code nem libera máquina.
- Testes Vitest e workflow de CI com testes e build.

## Limites atuais

O editor 2D ainda é uma primeira etapa: trabalha com peças poligonais já existentes e primitivas retangulares; não possui edição de furos, cotas de fabricação completas, camadas, sincronização com servidor ou vínculo ao cadastro oficial de projeto/cliente. Ainda não há modelador 3D sólido/editável, modelagem de superfícies, cortes/seções, simulação de trajetória, detecção de colisões, geração de G-code, pós-processador executável ou integração operacional com máquinas. A biblioteca e a interface não devem ser usadas como única validação para liberar fabricação industrial.

## Executar

```bash
npm install
npm test
npm run build
```

A especificação completa está em docs/CAD-CAM/00-ESPECIFICACAO-MESTRE-CAD-CAM.md.


### Nesting poligonal (incremento em desenvolvimento)
Foi adicionado um motor heurístico inicial para contornos poligonais côncavos, furos e defeitos de chapa em `src/domain/nesting/polygon-bottom-left.ts`. O resultado é explicitamente estimativo; não é um otimizador global nem gera plano CNC ou liberação de fabricação. Consulte a especificação CAD/CAM para limites e critérios de validação.


### Editor 2D interativo (incremento inicial)
O módulo `src/Editor2DPanel.tsx` foi integrado à navegação como **Editor 2D** e consome o tipo `CanonicalPieceGeometry` de `src/domain/geometry/canonical.ts`. Inclui seleção e arraste de peças em uma área SVG, edição direta de vértices do contorno externo, criação de peças retangulares e em L, encaixe opcional em grade de 10 mm, zoom, posição X/Y, redimensionamento proporcional, rotação em passos de 90°, duplicação, exclusão e histórico local de desfazer/refazer. As dimensões são exibidas em milímetros e a geometria selecionada passa pela validação canônica.

**Limites:** peças e alterações permanecem apenas no estado da sessão; o armazenamento é local ao navegador e não sincroniza com servidor nem cadastro oficial de projetos; não há edição de furos, cotas de fabricação completas, camadas, ferramentas avançadas de CAD ou viewport 3D. O editor não substitui revisão técnica e não libera fabricação.


### Persistência local e desenho livre
O editor salva automaticamente o rascunho e até 30 snapshots de revisão em `localStorage`, com nome de projeto local, nome/data da revisão e restauração manual das últimas cinco revisões na interface. Inclui modo de desenho de contorno poligonal por cliques no fundo da área, valida o contorno antes de criar a peça e exibe cotas gerais de largura/altura do retângulo envolvente da peça selecionada. Isso não é persistência em nuvem nem vínculo com projeto real multiusuário; os dados permanecem no navegador e podem ser perdidos se o armazenamento local for limpo.


### Base CAM/CNC — contratos e gates iniciais
O módulo `src/domain/cam/cam.ts` define contratos de máquina, envelope/eixos, ferramenta, operação e trabalho CAM, com validações de compatibilidade, limites de rotação/avanço/profundidade, safe Z, sequência e estado do pós-processador. Os testes cobrem bloqueios de segurança. Esta camada é somente validação de dados: não calcula trajetória, não simula colisão, não gera código de máquina e não libera fabricação. Um pós-processador só poderá ser marcado validado após implementação e ensaio específico no controlador e máquina correspondentes.


### Prévia 3D inicial
`src/Preview3DPanel.tsx` projeta o contorno canônico selecionado como uma extrusão ortográfica simplificada, com rotação da câmera por arraste e zoom. Não é um editor 3D completo, não permite editar vértices no espaço, não modela superfícies curvas e não executa física, colisões ou CAM.
