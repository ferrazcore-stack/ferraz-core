# FERRAZ — Especificação Mestre CAD/CAM para Marmoraria
**Versão:** 1.0  
**Status:** Requisitos consolidados; geometria canônica, gates de domínio, nesting poligonal heurístico e primeira etapa de editor 2D interativo implementados na branch de desenvolvimento. Editor 3D, cortes, edição vetorial avançada, persistência operacional, CAM/CNC e integração com máquinas continuam pendentes e não validados.  
**Produto:** FERRAZ — plataforma integrada de gestão, projetos e fabricação de marmoraria  
**Módulo:** Editor Técnico CAD/CAM, Modelagem 3D, Paginação e Documentação

## 1. Visão e princípios
Construir uma ferramenta própria, simplificada e especializada em marmoraria, combinando desenho técnico, modelagem 3D, aproveitamento de chapas e preparação para fabricação. Não reproduzir integralmente AutoCAD ou SketchUp: priorizar tarefas reais de marmoraria e uma interface guiada.

**Princípio central:** desenho 2D, modelo 3D, cortes, cotas, paginação e fabricação derivam da mesma base geométrica canônica e das mesmas revisões. É proibido manter medidas independentes que possam divergir entre apresentação e produção.

Princípios obrigatórios:
1. Precisão dimensional acima da aparência visual.
2. Unidade padrão em milímetros; tolerâncias e precisão explicitamente definidas.
3. Geometria única compartilhada entre 2D, 3D, seções e fabricação.
4. Revisões rastreáveis, sem sobrescrita destrutiva.
5. Aprovação técnica antes da fabricação.
6. Paginação de chapas independente da plotagem de pranchas.
7. Retalhos identificados e rastreáveis, distintos de perdas e descartes.
8. Texturas não alteram dimensões reais; fotos não substituem medições validadas.
9. Interface simples, com ferramentas por tarefa e padrões prontos.
10. Testes reais antes de declarar qualquer etapa concluída.

## 2. Escopo funcional e interface
Ferramentas organizadas por tarefas: Projeto, Planta, Desenho 2D, Modelagem 3D, Cortes e vistas, Detalhes, Cotas, Materiais e texturas, Paginação, Plotagem, Exportação e Liberação para fabricação.

Configuração inicial: milímetros; escala e precisão configuráveis; estilos de cotas; templates A4/A3/A2; camadas; estilos de linha e preenchimento; biblioteca de materiais/acabamentos; carimbo técnico e revisão.

## 3. Desenho técnico 2D
Suportar linhas, polilinhas, retângulos, polígonos, arcos, círculos, curvas Bézier, contornos irregulares, peças sob medida, edição de vértices, mover, copiar, espelhar, alinhar, distribuir, agrupar, desfazer/refazer, medir distâncias/ângulos, cotas automáticas/manuais, camadas e estilos. Todas as coordenadas são reais em milímetros, independentes do zoom.

## 4. Cortes, vistas e detalhes vinculados
Na planta, o usuário traça linha de corte, define sentido por seta e confirma; o sistema identifica A–A, B–B etc. e gera seção geométrica correspondente. Exibir quando aplicável espessura, altura, profundidade, saia, frontão, rodabanca, meia-esquadria, emendas, recortes, furos, cuba, cooktop, suporte, acabamento, cotas e níveis.

Gerar planta superior, elevações frontal/lateral, cortes longitudinais/transversais, seções parciais, vistas auxiliares, isométricas e detalhes ampliados. Detalhes podem ser vinculados à origem ou explicitamente manuais. Mudança na geometria de origem marca vistas derivadas como desatualizadas; atualização é controlada e registrada.

## 5. Modelagem 3D orientada a marmoraria
Peças: bancadas, tampos, ilhas, lavatórios, cubas esculpidas, soleiras, peitoris, rodabancas, frontões, nichos, escadas, degraus, revestimentos, painéis, mesas, peças curvas e especiais.

Propriedades editáveis: comprimento, largura, altura, espessura, ângulos, raios, curvas, chanfros, recortes, furos, rebaixos, emendas, saia, bordas, acabamentos, material e orientação do veio. Montagem virtual deve mostrar encaixes, junções, bordas, acessórios e relação com paredes, armários e estruturas. O 3D deriva da geometria canônica.

## 6. Curvas, moldes e extração assistida
Suportar desenho manual, pontos/raios, arcos, Bézier, contornos livres, importação vetorial, extração assistida de plantas/PDFs/imagens, fotos de moldes e medições, pontos de referência e calibração de escala. Imagem/PDF sem escala conhecida não fornece medida real. Exigir validação humana, fechamento de contorno, dimensões, tolerâncias e consistência antes da fabricação.

## 7. Materiais, texturas e acabamentos
Biblioteca de mármores, granitos, quartzitos, travertinos, ônix, industrializados, sinterizados, porcelanatos e materiais personalizados. Registrar textura, escala real, orientação, rotação, repetição, posicionamento, veio, fornecedor, nome, código, lote, espessura e acabamento. Textura é visual e nunca modifica geometria.

Galeria de acabamentos: polido, levigado, escovado, flameado, apicoado, jateado e cadastráveis. Usar códigos, cores, símbolos e padrões, sem depender apenas da cor.

## 8. Arestas e detalhes construtivos
Cada aresta da peça tem propriedades independentes: perfil reto, boleado, chanfrado, meia-esquadria, colagem, espessura aparente, saia, rebaixo e perfil personalizado. Identificação individual deve aparecer no desenho e na ordem de acabamento.

## 9. Cotas, linhas e acessibilidade
Cotas horizontais, verticais, alinhadas, angulares, radiais, diâmetro, nível e profundidade. Configurar texto, peso, linha, cor, posição, precisão, unidade, setas e espaçamento. Linhas contínuas, tracejadas, pontilhadas, corte, centro, ocultas e auxiliares. Alto contraste, símbolos/padrões alternativos e impressão em escala de cinza.

## 10. Motor de paginação / nesting
Motor independente da plotagem. Considerar dimensões úteis e geometria real da chapa, material, espessura, veio e orientação, defeitos/áreas proibidas, margens, kerf, espaçamento, rotação permitida, prioridade, restrições de fabricação, recortes internos, curvas e retalhos.

Resultados: chapas necessárias, distribuição, aproveitamento percentual, áreas utilizada/perdida, retalhos, quantidade de cortes, restrições não atendidas e consumo estimado. Edição manual: mover, rotacionar quando permitido, travar, priorizar, comparar alternativas e aprovar. Preservar resultado original e registrar intervenções.

O algoritmo deve ser determinístico: mesmos dados, parâmetros e versão do motor devem reproduzir o resultado. Retalhos recebem ID, dimensões, material, espessura, origem e localização de estoque; não confundir retalho aproveitável com descarte.

## 11. Plotagem e documentação
Plotagem não é nesting. Pranchas A4/A3/A2 e formatos configuráveis podem conter planta, elevações, cortes, detalhes, cotas, legenda, material, escala, carimbo, responsável, projeto, peça, revisão e data. PDF técnico deve respeitar escala e espessura de linha. Avaliar exportação vetorial e interoperabilidade.

## 12. Importação, exportação e anexos
Avaliar PDF, SVG, DXF, imagens, vetoriais e formatos 3D interoperáveis. Preservar origem, arquivo e revisão; pedir calibração quando escala desconhecida. Anexos por projeto, ambiente, peça e revisão: fotos de medição/ambiente/amostra/chapa/defeito/molde/instalação, referências e documentos. Registrar ID, data, responsável, origem, descrição e vínculo.

## 13. Integração operacional
Fluxo: Cliente → Proposta → Aprovação → Pedido → Ambientes → Medição → Geometria → Liberação Técnica → Desenhos/cortes/vistas → Paginação → Plano de corte → Produção → Acabamento → Inspeção → Entrega → Instalação → Conclusão.

Peças vinculadas a cliente, projeto, ambiente, pedido, revisão, material, medição, desenhos, plano de corte e ordem de produção. Ordem de corte usa exatamente a revisão aprovada. Mudanças criam novas revisões, sem apagar histórico.

## 14. Gates de fabricação
Bloquear liberação se faltarem medidas validadas, geometria consistente, revisão aprovada, liberação técnica, material definido, paginação aprovada, restrições atendidas ou documentação exigida. Registrar usuário, data, revisão e evidências. Garantir gates no backend/domínio, não somente na interface.

## 15. Arquitetura dos motores
1. Geometria 2D.
2. Modelagem 3D.
3. Cortes e seções.
4. Cotas e documentação.
5. Materiais e texturas.
6. Extração assistida de geometrias.
7. Paginação/nesting.
8. Aproveitamento e retalhos.
9. Plotagem.
10. Validação e liberação técnica.

Escolher bibliotecas após avaliar compatibilidade, desempenho, licença, manutenção e integração. Não depender de motores proprietários do AutoCAD/SketchUp sem análise de licença.

A geometria canônica deve definir unidades, coordenadas, tolerâncias, precisão e serialização versionada. Projeções 2D/3D, cortes, cotas e nesting derivam dela.

## 16. Integração entre repositórios
- `ferraz-core`: domínio geométrico, peças/revisões, medições, validações, paginação, fabricação e contratos técnicos.
- `ferraz-platform`: experiência comercial, projetos/ambientes, propostas, apresentação e documentos comerciais; consome dados técnicos autorizados.
- `ferraz-connect`: adaptadores de importação/exportação, armazenamento e integrações externas.
- `ferraz-company-system`: permanece reservado até definição explícita de finalidade; não duplicar responsabilidades.

Proposta e módulo técnico compartilham IDs oficiais de projeto, ambiente e peça. Contratos de dados devem ser claros, versionados e testados. Evitar cópia de regras de negócio entre repositórios.

## 17. Testes e aceite
Testar precisão geométrica, unidades, áreas/volumes, curvas, contornos, recortes/furos, geração e direção de cortes, atualização de vistas, cotas/escalas, texturas, nesting, restrições, kerf, aproveitamento, retalhos, exportação, revisões, permissões, gates, persistência e recuperação. Testes de integração devem percorrer proposta → projeto → peça → desenho → paginação → produção.

Não considerar pronto por telas ou demonstrações. Exigir fixtures dimensionais conhecidas, tolerâncias documentadas, testes automatizados e validação com casos reais de fabricação.

## 18. Pendências de engenharia
Antes de implementar o núcleo geométrico, decidir e documentar: sistema de coordenadas e orientação; tolerâncias lineares/angulares; unidades e arredondamento; representação de curvas e polígonos; tratamento de furos e contornos internos; formatos de intercâmbio; estratégia de renderização 2D/3D; limites do nesting; regras de veio; defeitos e áreas proibidas; máquinas e pós-processadores eventualmente necessários. Não presumir compatibilidade CNC sem validar máquina, controlador, ferramenta e formato.

## 19. Sequência de entrega sugerida
Fase A: contratos, geometria canônica, unidades, tolerâncias, peças e revisões.  
Fase B: editor 2D e cotas.  
Fase C: modelo 3D derivado e materiais.  
Fase D: cortes, seções e detalhes vinculados.  
Fase E: nesting retangular inicial com restrições e casos de teste.  
Fase F: nesting avançado, defeitos, veios, curvas e retalhos.  
Fase G: plotagem, importação/exportação e documentação.  
Fase H: gates, ordem de produção e integração operacional.

Cada fase exige critérios de aceite, testes e demonstração com dados de referência antes de avançar.

---
Este documento consolida os requisitos recebidos da responsável pelo produto. Ele define intenção e escopo; não declara que qualquer funcionalidade esteja implementada ou validada.


## 20. Estado incremental do núcleo geométrico (04/11/2026)

Foi adicionada uma primeira biblioteca TypeScript independente da interface, com:
- Modelo canônico versionado de contorno externo, furos, espessura, unidade em milímetros e sistema de coordenadas local à peça.
- Cálculo de área 2D.
- Validação inicial de coordenadas finitas, vértices duplicados, auto-interseção, área, espessura e posição de furos.
- Modelo de medidas com unidade, origem, método, estado, tolerância e responsável/data de confirmação.
- Gate de domínio que bloqueia liberação quando geometria, medidas, material ou aprovação humana não atendem aos requisitos.
- Testes automatizados para geometria válida/inválida e bloqueios de fabricação.

**Limites conhecidos:** a biblioteca ainda não foi conectada à interface, banco ou pipeline de importação; não representa B-rep/solid modeling; não valida interseção entre todos os furos, espessuras por aresta, curvas, sólidos, tolerâncias de máquina ou nesting. A implementação é um primeiro contrato de domínio, não um motor CAD/CAM pronto para produção.


## 21. Nesting retangular inicial (deterministic-shelf-v1)

Foi adicionado um algoritmo determinístico inicial para peças retangulares em chapas retangulares:
- Ordena peças por maior dimensão e área, com desempate estável por ID/instância.
- Considera material, espessura, margens, kerf e rotação permitida.
- Bloqueia rotação quando a chapa declara direção de veio.
- Gera posições por prateleiras, identifica peças não alocadas e calcula aproveitamento bruto por área.
- Expande quantidade em instâncias rastreáveis e usa IDs derivados para chapas adicionais.
- Inclui testes para limites da chapa, rotação, veio, incompatibilidade de material/espessura, quantidade, determinismo e peças grandes demais.

**Limites obrigatórios:** somente retângulos axis-aligned; não considera contornos irregulares, furos, recortes, defeitos, zonas proibidas, rotação angular livre, encaixe de curvas, otimização MaxRects/guillotine, corte CNC, sequência de corte, estabilidade/manuseio ou validação de máquina. Kerf é aplicado como folga conservadora no empacotamento. Percentual de aproveitamento usa área bruta da chapa, não uma simulação real de perda. Resultado é estimativa preliminar e não libera fabricação.


## 22. Contrato explícito do resultado de nesting (incremento inicial)

O resultado do algoritmo `deterministic-shelf-v1` agora identifica:
- A chapa gerada e o template de estoque que lhe deu origem.
- Material, espessura, dimensões, margem, kerf e direção de veio declarada.
- Base do percentual de aproveitamento (`gross-sheet-area`), calculado sobre a área bruta das chapas utilizadas.
- Estado `estimate-only` e avisos de limitações diretamente no payload, para reduzir o risco de uma estimativa ser interpretada como plano de fabricação.

A entrada também rejeita IDs duplicados de chapas/peças e direções de veio fora do contrato. Isso melhora rastreabilidade e evita ambiguidade de identificação, mas não amplia o domínio geométrico suportado: o algoritmo continua limitado a retângulos alinhados aos eixos. Os testes novos verificam o estado estimativo, a origem do template e a rejeição de identificadores duplicados.


## 23. Nesting poligonal heurístico inicial (04/11/2026)

Foi acrescentado `src/domain/nesting/polygon-bottom-left.ts`, separado do algoritmo retangular, para iniciar a paginação com contornos poligonais:
- Contornos externos côncavos e furos poligonais.
- Adaptador que consome a geometria canônica compartilhada e valida a peça antes de convertê-la para a entrada do nesting.
- Defeitos de chapa representados como regiões poligonais proibidas.
- Restrições de material e espessura, com quantidade de chapas físicas disponível por modelo de estoque.
- Margem da chapa e distância mínima entre contornos tratada como kerf conservador.
- Rotações explicitamente permitidas em passos de 90 graus; quando há direção de veio declarada, a versão inicial bloqueia rotação por segurança.
- Instâncias de peças e coordenadas finais rastreáveis.
- Rejeição de contornos auto-intersectantes, furos fora do contorno e furos sobrepostos/aninhados.

O método é uma heurística determinística por alinhamento de vértices e ordenação bottom-left. A função de otimização compara três ordens de entrada (área, maior dimensão e perímetro) e escolhe o melhor resultado por quantidade de peças alocadas, área alocada, número de chapas e aproveitamento. **Não garante ótimo global** e pode deixar de encontrar encaixes existentes. A taxa de aproveitamento usa área líquida das peças sobre área bruta das chapas utilizadas; não desconta área de defeitos/margens nem representa perda real de corte. Não calcula trajetória, ordem de corte, fixação, segurança de máquina, lead-in/lead-out ou código CNC. Defeitos precisam ser classificados e aprovados por uma pessoa. O resultado permanece `estimate-only` e não libera fabricação.

Critério de validação desta etapa: CI com testes automatizados de concavidade, furos, defeitos, rotação, veio, kerf, incompatibilidade de material/espessura e determinismo. A validação industrial ainda depende de geometrias de referência e chapas reais medidas.


## 24. Editor 2D interativo — primeira entrega incremental (04/11/2026)

Foi integrado à aplicação o módulo `src/Editor2DPanel.tsx`, acessível pela navegação **Editor 2D**. A interface usa SVG e o contrato `CanonicalPieceGeometry` da biblioteca de domínio, com dimensões em milímetros.

**Implementado nesta etapa:**
- Seleção e arraste de peças no viewport.
- Encaixe opcional em grade de 10 mm.
- Zoom de viewport.
- Propriedades numéricas de posição X/Y, largura, altura e espessura.
- Redimensionamento proporcional da geometria e dos furos.
- Rotação em passos de 90 graus.
- Duplicação e exclusão de peças.
- Desfazer/refazer local.
- Validação da geometria selecionada usando `validateGeometry` e cálculo de área canônica.
- Layout responsivo inicial para o painel e viewport.

**Limites e segurança:** o estado ainda é mantido somente em memória durante a sessão. O editor não grava revisões, não está ligado a projeto/ambiente, não possui edição de vértices, desenho livre de polígonos, cotas completas, camadas, biblioteca de componentes, viewport 3D, modelagem sólida ou ferramentas de colaboração. A criação de peças nesta etapa usa geometria retangular inicial. Não há aprovação de fabricação, exportação CAM ou geração de código de máquina. A movimentação no viewport é uma ferramenta de layout 2D, não uma confirmação de medida em obra. Nenhum resultado desta tela pode ser tratado como liberado para produção.

**Critério para a próxima etapa:** separar o estado de edição em um modelo de documento versionado, implementar edição direta de vértices e criação de contornos, adicionar cotas e ferramentas de desenho, cobrir interações com testes automatizados e então conectar peças a projetos/revisões persistentes. A camada 3D e os módulos CAM/CNC permanecem fases subsequentes, com validação específica por máquina antes de qualquer programa ser liberado.
