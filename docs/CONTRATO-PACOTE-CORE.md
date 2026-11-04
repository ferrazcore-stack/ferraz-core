# FERRAZ Core — contrato de integração

Status: proposta de contrato para auditoria e evolução; não representa pacote publicado.

## Responsabilidade
Concentrar regras de domínio puras e testáveis, sem dependência de React, Lovable, navegador, banco de dados ou equipamento CNC.

## Módulos previstos
- geometry: unidades, retângulos, polígonos, interseções e tolerâncias.
- nesting: paginação 2D, rotação permitida, margens, kerf e aproveitamento.
- drawings: entidades de desenho, cotas, cortes, camadas e anotações (após especificação).
- validation: validação de dimensões, colisões e restrições de fabricação.

## Convenções
- Unidade interna de comprimento: milímetro.
- Conversões explícitas na fronteira de entrada/saída.
- Funções determinísticas sempre que possível.
- Erros tipados e resultados explicáveis; nunca ocultar peça não alocada.
- Não arredondar coordenadas internamente sem regra documentada.
- Rotação deve respeitar veio, acabamento e restrições definidas por peça.

## Contrato inicial do nesting retangular
Entrada: peças com ID, largura, altura, quantidade e política de rotação; chapas com ID, dimensões e margem; opções de kerf e limite de chapas.
Saída: posicionamento por chapa, orientação, área ocupada, aproveitamento e lista explícita de peças não alocadas.
Validação obrigatória: limites da chapa, margem, colisões e folga de corte.

## Critérios mínimos de qualidade
- Testes unitários para rotação, margem, kerf, quantidades, peça impossível e múltiplas chapas.
- Testes de propriedade para ausência de sobreposição e permanência dentro da chapa.
- Fixtures reais anonimizadas aprovadas pela equipe técnica.
- Benchmark com instâncias representativas.
- Revisão humana do plano antes de corte.

## Limitações conhecidas a resolver antes de produção
A versão inicial MaxRects retangular é heurística. Não resolve contornos poligonais, vazios de cuba/cooktop, peças com recortes internos, veio angular, defeitos de chapa, otimização de retalhos ou geração CNC. A validação atual precisa ser auditada para folgas entre peças e bordas. Não usar como autorização automática de corte.

## Publicação
Somente publicar pacote depois de confirmar package.json, exports, build, typecheck, testes, licença e política de versionamento semântico. Fixar versão exata no aplicativo consumidor.
