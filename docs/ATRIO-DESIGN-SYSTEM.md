# Átrio — Design system v1

Versão 1.0 · 22/11/2026 · Status: PROPOSTA, aguarda aprovação da usuária.

## 1. Conceito: o pátio

Átrio é um espaço central e aberto, com luz, para onde tudo converge. O sistema segue essa ideia:
- Cada tela é um espaço ao redor do centro de trabalho (o pedido ou o dia).
- O modo claro é o "pátio com luz". O modo escuro é o "pátio à noite". Os dois são obrigatórios (spec).
- O visual lembra um jogo de cartas e de níveis: cartões, faixas de progresso, cores de status. Não é um sistema de planilha.

**Regra de ouro:** o sistema nunca recompensa ação que prejudica a empresa. Não existe pontuação por desconto, por pressa ou por volume. Progresso mostra etapas do trabalho, não pontos de competição.

## 2. Cores (tokens)

Todos os pares de texto e fundo passam no padrão WCAG AA (contraste mínimo 4,5:1). Valores medidos.

### Modo escuro ("pátio à noite")
| Token | Hex | Uso |
|---|---|---|
| `fundo` | `#0E1116` | fundo da tela |
| `superficie` | `#171B22` | barras e áreas |
| `cartao` | `#1F2530` | cartões |
| `borda` | `#2C3442` | divisões |
| `texto` | `#E8ECF2` | texto principal (12,97:1 sobre cartão) |
| `texto-2` | `#9AA4B2` | texto secundário (6,10:1) |
| `destaque` | `#2BD4C3` | ação e progresso (10,18:1 sobre fundo) |
| `ok` | `#4ADE80` | dentro do esperado (8,83:1) |
| `atencao` | `#FBBF24` | perto do limite (9,21:1) |
| `erro` | `#F87171` | fora do limite (5,56:1) |

### Modo claro ("pátio com luz")
| Token | Hex | Uso |
|---|---|---|
| `fundo` | `#F4F6F8` | fundo da tela |
| `cartao` | `#FFFFFF` | cartões |
| `borda` | `#DDE2E9` | divisões |
| `texto` | `#14181F` | texto principal (17,79:1 sobre cartão) |
| `texto-2` | `#4B5563` | texto secundário (7,56:1) |
| `destaque` | `#0E7C70` | ação e progresso (5,08:1) |
| `ok` | `#15803D` | dentro do esperado (5,02:1) |
| `atencao` | `#B45309` | perto do limite (5,02:1) |
| `erro` | `#B91C1C` | fora do limite (6,47:1) |

**Regras de cor**
- Cor nunca é o único sinal. Todo status tem também texto e ícone (para quem não distingue verde de vermelho).
- Valor em dinheiro negativo sempre tem sinal "−" e texto, além da cor.
- Cor de destaque da empresa: a empresa escolhe no cadastro, a partir do logo. Se não escolher, vale `destaque`. Ela só troca `destaque`; os status (`ok`, `atencao`, `erro`) são fixos.
- **PDF não usa cor**: só preto, branco e cinza (spec).

## 3. Tipografia

- Família: **Inter** (licença livre). Números com dígitos tabulares, para alinhar valores.
- Escala (px): 14 (legenda) · 16 (corpo) · 20 (subtítulo) · 28 (título de tela) · 40 (número de destaque).
- Peso: 400 corpo, 600 títulos, 700 só para números de destaque.
- Texto mínimo: 16 px. Nunca abaixo de 14 px.

## 4. Espaço, forma e toque

- Grade de 4 px. Espaço entre cartões: 16 px.
- Raio: cartão 16 px · botão 14 px · chip 999 px (pílula).
- Alvo de toque: mínimo 48 px. Botão principal: 56 px de altura, largura total no celular.
- Uma ação principal por tela, sempre fixa na parte de baixo do celular.

## 5. Movimento

- Transição: 200 ms, curva "saída suave". Sem animação acima de 300 ms.
- Ao tocar: o cartão afunda 2% por 120 ms (confirma que o toque foi recebido).
- Se o aparelho pedir movimento reduzido, todas as animações são desligadas.

## 6. Componentes

| Componente | Forma | Regra |
|---|---|---|
| **Cartão de pedido** | cartão com faixa de cor na borda, do status | toque abre o pedido inteiro (regra 20b) |
| **Faixa de etapas** | 7 marcas em linha: pedido fechado → instalação | etapa atual em `destaque`; etapas passadas em `texto-2` |
| **Barra de folga** | barra horizontal com o limite de desconto | verde até 80% do limite; âmbar de 80% a 100%; vermelho acima |
| **Termômetro de venda** | barra com custo, preço e lucro | mostra lucro ou prejuízo em R$ e %, com sinal |
| **Dica** | balão de uma linha, com "Entendi" | aparece uma vez por tela; "?" para rever |
| **Botão principal** | 56 px, fixo embaixo | só uma por tela |
| **Número de destaque** | 40 px, tabular | usado para total e saldo |

## 7. Comportamento por função

Cada função tem uma tela com o mesmo visual, mas com prioridade diferente. Os princípios abaixo são **hipóteses de design**, não fatos comprovados. Serão testados com usuários antes de virarem regra fixa.

**Vendedor** — velocidade e clareza do limite
- Mostrar a barra de folga antes do campo de desconto.
- Número do total grande; desconto e folga embaixo, em tamanho menor.
- Ao passar do limite: aviso claro com o que acontece ("vai para aprovação"). Sem tom de culpa.

**Gestor** — visão do negócio
- Lucro ou prejuízo de cada venda visível na lista, com o termômetro.
- Alertas agrupados no topo, nunca mais de três ao mesmo tempo.
- Configuração com a explicação de cada campo ao lado do número.

**Financeiro** — precisão
- Sem animação nos números. Valores sempre alinhados, com sinal.
- Cor só para status. Dados internos com um cadeado visível, nunca escondidos sem explicação.

**Funcionário (chão de fábrica)** — toque e leitura rápida
- Alvo de toque de 56 px, com texto de 18 px ou mais.
- Uma ação por tela. A tela diz o que fazer em uma frase.
- Dica na primeira vez, depois só no "?".

**Cliente (link no celular)** — calma e confiança
- Só cores da empresa e preto/cinza. Sem barra de folga, sem custo, sem margem.
- Uma ação principal: aprovar. Pedir alteração fica como ação secundária.

## 8. O que o sistema não faz

- Não mostra pontuação por venda, por desconto ou por volume.
- Não usa vermelho para motivar. Vermelho é só para o que está fora do limite.
- Não mostra custo, margem ou taxa para quem não tem permissão.
- Não faz anúncio, notificação de vendas ou aviso sem ação.

## 9. Limites desta proposta

- Os princípios de neurociência e de psicologia das cores são **hipóteses de design**. A evidência é variável e depende do contexto. Por isso, a regra fixa só entra depois de teste com as pessoas de cada função.
- A paleta foi testada só no contraste. Ainda não foi testada na tela de um celular.
- O nome da universidade não aparece no sistema (decisão da usuária).

## 10. Próximos passos (depois de aprovado)

1. Criar os tokens no código (cores, escala, espaço) e um arquivo único de tema.
2. Montar os componentes na ordem: botão, cartão, faixa de etapas, barra de folga, termômetro, dica.
3. Publicar e testar no celular, com uma pessoa de cada função.
