# Átrio — Documento central

Versão: 2.0 · Atualizado: 21/11/2026 · Este é o único documento de referência. Os demais arquivos da pasta são históricos e podem ser descartados.

Legenda: CONFIRMADO = decidido pela usuária · PROPOSTO = a validar · PENDENTE = falta decidir

---

## 0. Como o trabalho é dividido

- **Empresa (gestor):** define todos os valores, percentuais, taxas, datas de pagamento e fórmulas, na aba de configuração dela. Nada vem preenchido de fábrica. CONFIRMADO.
- **Usuária (processo):** define como o processo e o fluxo funcionam, do ponto de vista da marmoraria. CONFIRMADO.
- **Claude (construção):** cria o cadastro, a automação entre as partes, as telas, o banco de dados e a forma de recebimento. Não define valores. Avisa antes de decisões que afetem custo, segurança ou que não podem ser desfeitas. CONFIRMADO.
- **Produto:** um ERP em formato SaaS, com cada empresa tendo seus próprios dados. CONFIRMADO.
- **Não afirmar** que outras empresas ou sistemas funcionam de um jeito sem verificação. CONFIRMADO.

---

## 1. Visão e princípios

- O Átrio é um ERP para marmorarias, feito para qualquer empresa do segmento e depois de outros segmentos. A Porcelane é a empresa piloto e o primeiro preset. CONFIRMADO.
- Motor completo por dentro, tela limpa por fora. Poucos campos por tela. CONFIRMADO.
- Complexidade do motor e dos agentes nunca aparece para o usuário comum. CONFIRMADO.
- Tema claro e escuro obrigatórios. CONFIRMADO.
- Idioma: a tela segue o funcionário; o documento comercial segue o cliente, se a empresa permitir. CONFIRMADO.
- Cores sugeridas a partir do logo, confirmadas pela empresa. Alertas usam cores fixas. CONFIRMADO.
- Celular primeiro. CONFIRMADO.
- Nome Átrio aparece na tela interna. Documentos saem com o logo da empresa. CONFIRMADO.
- Átrio é o motor; Ferraz é o nome do SaaS dela. CONFIRMADO.
- Nome provisório: Átrio. Registro no INPI pendente. PENDENTE.
- Acesso restrito: configuração e inspeção só para quem tem autorização. CONFIRMADO.
- Uma ação principal por tela, verbos curtos, erros claros. PROPOSTO.

---

## 2. Escopo da versão 1

Dentro: configuração da empresa; orçamento e proposta comercial; aprovação pelo cliente; pedido e liberação técnica; cadastros de materiais, fornecedores, insumos e cubas; comissão e produção; formas de pagamento.

Fora (fases seguintes): visualização 3D; plano de corte para CNC; financeiro completo; logística; administração; agentes de IA em produção.

---

## 3. Configuração da empresa (aba por área)

Regra geral: campos vazios não entram nos cálculos. Se faltar um campo para um cálculo, o resultado não aparece e a tela mostra qual campo falta. CONFIRMADO.

### 3.1 Dados da empresa
- Nome, CNPJ, endereço (CEP preenche estado, cidade, bairro). CONFIRMADO.
- Logo, cores, idioma padrão da tela e do documento. CONFIRMADO.
- Unidades (matriz e filiais): CEP, estado, cidade, bairro, regra de feriados e dias úteis. Cada unidade tem sua origem para frete. CONFIRMADO.
- Galpão ou depósito de saída: endereço interno, separado da unidade. CONFIRMADO.
- Calendário da empresa: local vem do CEP (estado, cidade, bairro), que puxa os feriados desse local. CONFIRMADO.
- Horário de funcionamento: dias da semana e horário em que a empresa trabalha. Dias sem funcionamento não contam no prazo. CONFIRMADO.

### 3.2 Preço e custo
- Perda da chapa: um único percentual para todos os materiais. O sistema calcula sozinho. CONFIRMADO.
- Mão de obra, insumos, instalação: R$/m². CONFIRMADO.
- Frete: escolha entre por m² (valor fixo) ou por km. CONFIRMADO.
- Frete por km: valor por km, ida e volta (sim ou não), distância livre. PROPOSTO.
- Frete fixo por faixa de distância. PROPOSTO.
- Impostos, comissão sobre o preço, margem desejada (%). CONFIRMADO.
- Política de preço: fixo, por marcos, ou tempo e material. PROPOSTO.
- Desconto máximo do vendedor (%). CONFIRMADO.
- Quem aprova desconto acima do limite: a empresa define na configuração (quem aprova, por função). CONFIRMADO em 22/11.
- Margem máxima que o vendedor pode alterar no preço (%). CONFIRMADO.

### 3.3 Serviços e acabamentos
- Lista editável de serviços (15 itens, da planilha): Cuba, Cooktop, Furo de torneira, Calha úmida, Lixeira, Torre de tomada, Cuba esculpida, Nicho simples, Nicho com moldura, Rebaixo italiano, Pingadeira, Bipolimento, Boleado/Chanfrado, Rodabanca, Saia. CONFIRMADO.
- Por serviço: cobra ou não; valor; critério (unidade, m², metro linear, percentual ou total); onde é feito (empresa ou obra); aparece no PDF (sim ou não). CONFIRMADO.
- Bipolimento e boleado: percentual sobre a peça, com caixa de seleção. CONFIRMADO.
- Acabamentos de aresta (reto, meia-esquadria, boleado, chanfrado e outros): preço por metro linear. CONFIRMADO.

### 3.4 Cubas, acessórios e insumos
- Cubas e acessórios: nome, dimensão completa, marca, material, preço. CONFIRMADO.
- Insumos: nome, unidade de venda, embalagem, marca, preço. CONFIRMADO.

### 3.5 Proposta e PDF
- Mostrar valor por item; m² por item; resumo do ambiente com total e m²; valor do m² do material (sim ou não cada). CONFIRMADO.
- Validade da proposta (dias). PROPOSTO.
- Contrato junto com a proposta. PROPOSTO.
- Idiomas permitidos para o documento. CONFIRMADO.
- PDF com cor e logo da empresa. CONFIRMADO.

### 3.6 Equipe e comissão
- Setores, cargos e funções: a empresa cria. CONFIRMADO.
- Responsável por setor: a empresa escolhe o nome. Uma mesma pessoa pode responder por mais de um setor. CONFIRMADO.
- Logística e administração: controladas pela empresa, com responsável e campos definidos por ela. Não são decisões da usuária. CONFIRMADO.
- Permissões por função: o que cada função acessa e libera. CONFIRMADO.
- Comissão do vendedor por faixa mensal (faixa e percentual). CONFIRMADO.
- Comissão de medição técnica e de produção, no mesmo modelo de faixas. CONFIRMADO.
- Comissão de liberação: quem recebe, como e quanto. CONFIRMADO.
- Percentual do acabador sobre o valor do ambiente. CONFIRMADO.
- Padrão de comissão por função (percentual ou valor fixo para arquiteto, vendedor, técnico de liberação, produção e outros). CONFIRMADO.
- Dia do pagamento mensal (ex.: dia 10 ou 15), definido por cada empresa. CONFIRMADO.
- Comissão por produto, tabela ou cliente. PROPOSTO.
- Meta mínima para começar a contar comissão. PROPOSTO.

### 3.7 Produção
- Base de produção: m² ou valor do ambiente. CONFIRMADO.
- Serviços que contam para o acabador. CONFIRMADO.
- Serviços feitos na obra, que saem da base do acabador. CONFIRMADO.

### 3.8 Liberação técnica
- Quem pode liberar (cadastro de pessoas). CONFIRMADO.
- Liberação pelo vendedor em retirada e peça sem medição. CONFIRMADO.
- Desbaste, disco, transpasse, acabamento por aresta e desenho/SketchUp. CONFIRMADO.
- Plano de corte e exportação para CNC (DXF). PROPOSTO.

### 3.9 Ponto e atestado
- Ponto por geolocalização: obrigatório, funciona sem internet e sincroniza depois. CONFIRMADO.
- Localização só no ponto, ou durante o dia com aviso visível. CONFIRMADO.
- Atestado com foto no portal; original entregue depois. CONFIRMADO.
- Validade legal do ponto por geolocalização, com contador. PENDENTE.

### 3.10 Atendimento
- Chave da API do WhatsApp: a empresa cola a chave, sem QR code. CONFIRMADO.
- Se a empresa usa o serviço de WhatsApp (sim ou não). CONFIRMADO.
- Para cada função: o que o chat pode responder. A empresa define, sem valores de fábrica. CONFIRMADO.

### 3.11 Formas de pagamento (aba Financeiro)
Ver seção 7 deste documento. CONFIRMADO (desenho).

### 3.12 Logística e administração
- O que cada área controla. PENDENTE.

---

## 4. Regras de cálculo

**4.1 Preço de venda por material** (CONFIRMADO)
1. Preço do material: menor cotação mais recente entre fornecedores, em R$/m².
2. Custo com perda: custo ÷ (1 − perda). Ex.: R$ 500/m², perda 15% → R$ 588,24/m².
3. Custo total: custo com perda + mão de obra + insumos + instalação + frete.
4. Preço de venda: custo total ÷ (1 − impostos − comissão − margem).

**4.2 Acabador** (CONFIRMADO)
- 5% do valor do ambiente acabado, na base do valor do ambiente menos os serviços feitos na obra.
- Ex.: ambiente R$ 10.000, cooktop na obra R$ 190 → base R$ 9.810 → acabador R$ 490,50.

**4.3 Comissão do vendedor** (CONFIRMADO)
- Sobre o total acumulado do vendedor no mês, não por proposta.
- Zera dia 1. Ao cruzar uma faixa, o percentual novo vale para o mês inteiro.
- Fechamento do mês: do dia 1 ao último dia. Pagamento sai no mês seguinte, na data configurada pela empresa.

**4.4 Comissão de liberação** (CONFIRMADO)
- Recebe quem faz a liberação técnica da mão de obra.
- Vendedor autorizado a liberar não recebe por liberação.

**4.5 Serviços** (CONFIRMADO)
- Cada serviço cobra pelo critério configurado.
- Serviço feito na obra entra no orçamento, mas sai da base do acabador.

**4.6 Frete**
- Por m²: valor × m² da obra. CONFIRMADO.
- Por km: distância pela estrada, do galpão de saída até a obra, × valor por km. Ida e volta dobra a distância. Km livres não são cobrados. CONFIRMADO no cálculo.
- Distância automática precisa de serviço de mapas. PENDENTE (chave de acesso).

**4.7 Desconto**
- Vendedor pode dar até o limite configurado. CONFIRMADO.
- Acima do limite, precisa de aprovação. Quem aprova: a empresa define na configuração. CONFIRMADO em 22/11.

**4.8 Alteração de preço pelo vendedor**
- Só dentro da margem configurada. Toda alteração fica registrada no relatório. CONFIRMADO.

**4.9 Prazos e feriados**
- Alerta padrão de 3 dias antes da entrega. CONFIRMADO.
- Três camadas de feriado: nacional, estadual e municipal, conforme UF e cidade da unidade. Regra da empresa: dias úteis ou corridos. CONFIRMADO na regra.
- Tabela de feriados precisa de decreto oficial (PE e Recife). PENDENTE.
- Prazo de instalação: a empresa define a partir de quando conta (depois da medição ou depois da liberação técnica). CONFIRMADO.
- Quantidade de dias e tipo (úteis ou corridos): escolhidos no orçamento, por quem o monta, conforme a necessidade do caso. Não ficam na configuração da empresa. CONFIRMADO.
- O pedido herda o prazo definido no orçamento. CONFIRMADO.

**4.10 Proposta**
- Total = área × preço de venda + frete. CONFIRMADO.

---

## 4b. Dicionário da planilha (campos, fórmulas e exemplos)

Fonte: planilha orcamento-atrio-v4.xlsx. Cada item abaixo é uma regra que o programador deve implementar. Símbolos: % são frações (0,15 = 15%).

**Configuração (campos da empresa)**

| Campo | Tipo | Usado em | Regra |
|---|---|---|---|
| Perda da chapa | % | Preço: custo com perda | Ex.: 0,15 = 15% |
| Mão de obra | R$/m² | Preço: custo total | Valor fixo por m² |
| Insumos | R$/m² | Preço: custo total | Valor fixo por m² |
| Frete (R$/m²) | R$/m² | Frete por m² | Área × valor |
| Instalação | R$/m² | Preço: custo total | Valor fixo por m² |
| Impostos | % do preço | Preço: divisor | Fração |
| Comissão | % do preço | Preço: divisor | Fração |
| Margem desejada | % do preço | Preço: divisor | Fração |
| Desconto máximo | % | Desconto do vendedor | Limite (aprovação acima, PENDENTE) |
| Endereço da empresa | texto | Origem do frete por km | Uma vez só |
| Percentual do acabador | % do ambiente | Acabador | Ex.: 0,05 = 5% |
| Modo do frete | Km ou Fixo por m² | Frete a cobrar | Escolha da empresa |
| Frete por km | R$/km | Frete por km | Valor por km rodado |
| Ida e volta | Sim ou Não | Km cobrados | Se Sim, dobra a distância |
| Km livres | km | Km cobrados | Primeiros km sem cobrança |
| Galpão de saída | texto (interno) | Origem do km | Nunca aparece no PDF |
| PDF: valor por item | Sim ou Não | Proposta | — |
| PDF: m² por item | Sim ou Não | Proposta | — |
| PDF: valor do m² | Sim ou Não | Proposta | — |

**Bloqueio:** se qualquer campo acima estiver vazio, o preço de venda e a margem não aparecem, e a tela mostra quantos campos faltam. CONFIRMADO (planilha).

**Preço de venda, por material (planilha: aba Preço de venda)**
- Menor custo do material: vem da aba Comparativo (menor cotação mais recente).
- Custo com perda = menor custo ÷ (1 − perda).
- Custos de execução = mão de obra + insumos + frete (R$/m²) + instalação.
- Custo total = custo com perda + custos de execução.
- Preço sugerido = custo total ÷ (1 − impostos − comissão − margem).
- Se impostos + comissão + margem ≥ 100%, mostra erro e não calcula. CONFIRMADO (planilha).
- ATENÇÃO (inconsistência encontrada): na planilha, o frete R$/m² entra no preço por m² E de novo no total da proposta, quando o modo é Fixo por m². Decisão minha, a validar: o frete entra só uma vez, na proposta, e sai do preço por m².
- Preço que a empresa cobra hoje: campo livre, para comparação.
- Diferença = preço sugerido − preço cobrado hoje.
- Margem líquida hoje = 1 − impostos − comissão − custo total ÷ preço cobrado hoje.
- Exemplo T3: custo R$ 500, perda 15%, mão de obra 120, insumos 40, frete 30, instalação 60, impostos 6%, comissão 5%, margem 25% → R$ 1.309,74/m².

**Frete (planilha: aba Frete)**
- Km cobrados = MÁXIMO(0; distância × (2 se ida e volta, senão 1) − km livres).
- Frete por km = km cobrados × R$/km.
- Frete por m² = área da obra × R$/m².
- Frete de entrega (obra) = o modo escolhido pela empresa (Km, Fixo por m² ou faixa de distância).
- Frete de coleta: valor configurável pela empresa, com opção sim ou não. Pode ser incluído junto com o frete de entrega.
- Frete total na proposta = frete de entrega + frete de coleta (se houver). Entra uma vez só, na proposta. CONFIRMADO pela usuária.
- Distância digitada à mão. Distância automática: PENDENTE (chave de mapas).
- Exemplo: 60 km, ida e volta, 10 km livres, R$ 2,00/km → 110 km cobrados → R$ 220.

**Acabador (planilha: aba Acabador)**
- Base = valor do ambiente − serviços feitos na obra.
- Pagamento = base × percentual do acabador.
- Exemplo T4: ambiente R$ 10.000, cooktop na obra R$ 190 → base R$ 9.810 → R$ 490,50 (com 5%).

**Proposta (planilha: aba Proposta)**
- Por ambiente: valor = m² × preço de venda do material.
- Frete = valor de Frete a cobrar.
- Total = soma dos valores dos ambientes + frete.
- Mostrar valor do m² e valor por item conforme as opções de PDF.
- Validade: 10 dias na planilha; a empresa define o número (PROPOSTO). A planilha tem um ambiente de exemplo: a v1 do sistema precisa de vários ambientes.
- Teste T12: 2 m² × R$ 1.309,74 + R$ 220 = R$ 2.839,49.

---

## 5. Pessoas que recebem (cadastro e comissão)

**5.1 Cadastro de quem recebe** (CONFIRMADO)
- Nome, sobrenome, CPF, chave Pix (tipo e chave).
- Para arquiteto ou outros externos: o que mais for necessário. Para o resto, nada além disso.
- CPF e chave Pix: criptografados, acesso só do financeiro.

**5.2 Pedido e arquiteto** (CONFIRMADO)
- Ao transformar o orçamento em pedido, registra-se o nome do arquiteto. Aparece no relatório financeiro, ligado ao pedido.

**5.3 Comissão por função** (CONFIRMADO)
- A empresa configura o padrão de cada função (arquiteto, vendedor, técnico de liberação, produção e outros), em percentual ou valor fixo.
- No pedido, é possível combinar um valor diferente para cada pessoa envolvida.
- Toda mudança em relação ao padrão fica registrada no pedido e no relatório financeiro. Mesma regra da alteração de preço do vendedor.
- Todo envolvido recebe algo, e cada um tem o que foi combinado registrado.

**5.4 Ciclo de pagamento** (CONFIRMADO)
- Fechamento do acumulado: dia 1 ao último dia do mês.
- Pagamento no mês seguinte, na data definida pela empresa.
- Pagamento de parcela que cai depois do fechamento: entra no mês em que foi confirmado. Padrão, configurável pela empresa.

**5.5 Ideias não confirmadas** (PROPOSTO)
- Comissão liberada só depois que o pagamento do cliente é confirmado, na mesma proporção do que entrou.
- Teto de comissão por pedido.
- Parte da comissão retida até a entrega ou a liberação técnica.
- Relatório mensal por pessoa, com data de pagamento.

---

## 6. Clientes, obras e pedidos

- Cliente: código CLI-0001. Recorrente: cadastro completo (nome, telefone, CPF ou CNPJ, observação). Avulso: só nome e telefone, completa se voltar. CONFIRMADO.
- Obra: vinculada ao cliente. Endereço e responsáveis (papel, nome, contato). Vários do mesmo papel são permitidos. CONFIRMADO.
- Um cliente pode ter várias obras. Pedidos extras da mesma obra ficam no histórico do cliente. CONFIRMADO.
- Proposta comercial: várias versões. Status: enviada ou aprovada. CONFIRMADO.
- Pedido: PED-000001, gerado pela proposta aprovada, geralmente único. Tipo: obra (com dados da obra e responsáveis) ou retirada. Prazo, alerta e status ficam no pedido. CONFIRMADO.
- Pedido pode ser obra completa ou peça avulsa. CONFIRMADO.
- Agenda de medição e entrega ligada ao pedido. PROPOSTO.
- Contrato gerado a partir do orçamento. PROPOSTO.

**Fluxo comercial**
1. Vendedor monta a proposta (cliente, obra, ambientes, material, medidas, serviços).
2. Vê o preço; ajusta só dentro da margem.
3. Escolhe a forma de pagamento e a simulação (seção 7).
4. Gera o PDF e envia por WhatsApp ou link.
5. Cliente abre o link no celular, vê, informa o nome, aprova ou pede alteração com observação.
6. Aprovação gera o pedido.
7. Liberação técnica entra só depois da aprovação.

---

## 7. Formas de pagamento (APROVADO em 21/11)

**Intenção:** vender com parcelas claras e dar ao financeiro o valor real que entra, com a data de recebimento.

**Escopo**
- Simulação de parcelas dentro da proposta.
- Dois canais: maquininha (cartão, por banco) e link de pagamento (por provedor).
- Pix gerado pelo link, com baixa automática quando o cliente paga.
- Fora: emissão de nota fiscal e conciliação bancária completa (financeiro).

**Separação**
- Interno (nunca aparece no PDF nem para o cliente): taxas da maquininha e do link por modalidade e parcela; prazo de recebimento; taxa de antecipação; percentual de juros que a empresa absorve; custo e margem; chave Pix e dados bancários.
- Vai ao cliente (na proposta): forma de pagamento; número de parcelas; valor de cada parcela; valor total; juros assumidos pelo cliente e seu valor.
- O PDF é montado só com dados do cliente. CONFIRMADO.

**Configuração (aba Financeiro)**
- Canais ativos: maquininha, link, Pix (sim ou não cada um).
- Tabela da maquininha: banco, parcelas, taxa, prazo, antecipação.
- Tabela do link: provedor, parcelas, taxa, prazo.
- Máximo de parcelas sem juros para a empresa, e a partir de qual parcela o cliente pode assumir juros.
- Campos vazios: a simulação não aparece até a tabela estar preenchida.

**Formas de pagamento disponíveis (a empresa escolhe quais oferece)**
- Pix
- Cartão (maquininha ou link)
- Boleto (gerado pelo provedor da empresa, baixa automática quando pago)
- Transferência (baixa manual, feita pelo financeiro)
- Faturado (venda a prazo, vira conta a receber com vencimento)
- Outras formas que a empresa cadastrar

**Estrutura do pagamento (configurada pela empresa, por condição)**
- Entrada: valor fixo ou percentual do total, em qualquer forma da lista.
- Saldo: restante em uma ou mais parcelas, em qualquer forma da lista.
- Exemplos possíveis: entrada no Pix e saldo no cartão; entrada no cartão e saldo no boleto; valor total pago à vista.
- Quantidade de parcelas: definida na condição do orçamento. O sistema calcula e mostra o valor de cada parcela e a quantidade. CONFIRMADO.
- Tudo acima é configurável pela empresa, inclusive a lista de formas de pagamento, que pode crescer.
- A condição escolhida no orçamento fica registrada no pedido. CONFIRMADO.

**Fluxo**
1. Vendedor escolhe o canal.
2. Sistema mostra a simulação com a taxa daquele canal (não uma média).
3. Condição escolhida fica escrita na proposta, mesmo que o acordo tenha sido verbal.
4. Cliente paga (link, Pix ou maquininha).
5. Provedor avisa o sistema (webhook). O sistema valida a assinatura, marca como pago e dispara alerta. Sem comprovante.
6. Aviso duplicado não gera baixa em dobro.

**Pendências deste módulo**
- Contador: confirmar a regra de juros repassados ao cliente e como mostrar na proposta. PENDENTE.
- Empresa: escolher banco da maquininha e provedor do link, com conta própria em cada um. PENDENTE (decisão da empresa).
- Servidor para receber o aviso do Pix depende das contas Vercel e Supabase. PENDENTE.

---

## 8. Cadastros e estoque

- Materiais: código (ex.: GR-001), tipo, categoria, material, acabamento, espessura, tamanho da chapa. CONFIRMADO.
- Biblioteca de materiais e acabamentos. PROPOSTO.
- Fornecedores e apelidos (ex.: "Cj"). CONFIRMADO.
- Cotações: histórico, nunca apagado. Preço por m² calculado. CONFIRMADO.
- Nome da nota fiscal → nome interno do material. CONFIRMADO.
- Notas fiscais: financeiro recebe, o sistema extrai valores, vencimento e forma de pagamento. CONFIRMADO.
- Contas a pagar por fornecedor, por mês. CONFIRMADO.
- Estoque real: quantidade por material, a partir da nota. Chapa bruta e retalho separados. CONFIRMADO.
- Pedido de material ao fornecedor com foto, valor do fornecedor e valor da empresa (margem). CONFIRMADO.
- Catálogo de fotos por origem (granito, mármore, quartzito, insumos). CONFIRMADO.
- Forma de pagamento padrão e prazos por fornecedor. PROPOSTO.
- Paginação de chapas: aproveitamento (opção A ou B) e sobra mínima, com foto e agente de leitura. CONFIRMADO.

---

## 9. Produção e RH

- Portal do funcionário: registra o próprio serviço (início, fim, pausa, ambiente ou peça), em tempo real. CONFIRMADO.
- Produção pode ser registrada pela equipe da empresa ou pelo próprio funcionário, sempre com quem registrou. CONFIRMADO.
- Cadastro do funcionário: nome, função, data de entrada, situação (ativo ou desligado), contato. CONFIRMADO.
- Comissão e produção calculadas no RH pelas faixas mensais; pagamento feito pelo financeiro a partir do total do RH. CONFIRMADO.
- Atestado e declaração: foto no portal; original entregue depois; registro pendente até a entrega. CONFIRMADO.
- Ponto por geolocalização: regra confirmada; validação legal pendente. CONFIRMADO / PENDENTE.
- RH genérico: setores, cargos e funções são criados por cada empresa. Cortador e acabador são só o exemplo da Porcelane. CONFIRMADO.
- Equipe da Porcelane registrada: vendedores internos Amanda Ferraz e Cristiano Nascimento; liberação e medição Bhenda Aragão; vendedor externo e arquiteto sem nome; administrativo não registrado. CONFIRMADO.
- Acabamento e serviços em produção: o que conta para o acabador e o que é feito na obra é configurado pela empresa. CONFIRMADO.
- Base de produção na Porcelane: 5% do valor do ambiente (não m²). CONFIRMADO.

---

## 10. Telas (resumo)

- **Gestor:** uma aba por área (empresa, preço, serviços, cubas, insumos, proposta, equipe, produção, liberação, ponto, atendimento, financeiro). Campo vazio aparece em destaque. CONFIRMADO.
- **Vendedor:** proposta, com PDF e envio por WhatsApp ou link. CONFIRMADO.
- **Cliente:** aprovação pelo link no celular. CONFIRMADO.
- **Funcionário:** portal do funcionário, ponto e atestado. CONFIRMADO.
- **Atendimento:** chat que responde só o que foi liberado, por função. CONFIRMADO.

---

## 11. Atendimento e comunicação

- WhatsApp: a empresa cola a chave da API. CONFIRMADO.
- O chat roteia por função e responde só o liberado. CONFIRMADO.

---

## 12. Plataforma e agentes (não são configuração da empresa)

- Cada agente tem executor, revisor e supervisor. CONFIRMADO.
- Um agente coordenador (diretor) organiza os demais. CONFIRMADO.
- Inspeção acima de todos, restrita a quem tem autorização. CONFIRMADO.
- Complexidade sempre escondida. CONFIRMADO.
- Agentes: leitura técnica, paginação, orçamento e comparativo de fornecedores. PROPOSTO.

---

## 13. Concorrência: o que foi extraído (fontes lidas)

Lidas nas páginas públicas: Grancut, Marmu, MarmoDraw, Stonify. Só resumos: HEROGRAN, Sergio Miranda. Bloqueado: Marmocalc.

- Cadastro único de preços e revisão antes do PDF (Grancut). Átrio acrescenta: revisão mostra frete por km e perda aplicada.
- Biblioteca de acabamentos por aresta (MarmoDraw). Átrio acrescenta: perfil personalizado pela empresa.
- Ajuste no momento da venda (MarmoDraw). Átrio acrescenta: desconto respeita limite; acima dele pede aprovação.
- Ordem de produção sem preço e agenda (Marmu). Átrio acrescenta: registro de produção por funcionário.
- Estoque de chapa bruta e retalho (Marmu). Átrio acrescenta: nota fiscal dá entrada pelo nome configurado.
- Plano de corte e CNC (MarmoDraw). Fase seguinte.
- Aprovação pelo link no celular (Stonify). Átrio acrescenta: aprovação gera pedido.
- Visualização 3D (Stonify, Marmu). Fase seguinte.
- Política de preço e comissão por produto (Odoo, Ohub). PROPOSTO.
- Diferenciais só do Átrio: comissão em faixas mensais zerando no dia 1; liberação com comissão própria; ponto offline com registro; atestado com foto; configuração completa sem regra fixa; idioma por tela e documento; agentes com inspeção acima de todos.

---

## 14. Ordem de construção

1. Configuração da empresa e cálculo de preço (T1 a T3). Feito na planilha v1.
2. Frete por km (depende de distância de rodovia).
3. Serviços e acabador (T4).
4. Proposta em PDF com as opções da empresa. Feito na v4 (teste).
5. Aprovação pelo cliente e geração do pedido.
6. Formas de pagamento (seção 7).
7. Cadastro de beneficiários e comissão por função (seção 5).
8. Comissão e liberação (T5 a T7).
9. Portal do funcionário e ponto.
10. Compras, estoque e financeiro.
11. Visualização 3D e plano de corte.
12. Agentes de IA.

Regra: definir tudo primeiro, depois criar telas e banco, depois testar. CONFIRMADO.

---

## 15. Critérios de aceite (testes)

| # | Entrada | Resultado esperado | Status |
|---|---|---|---|
| T1 | Custo R$ 500/m², perda 15% | Custo com perda R$ 588,24/m² | Passou (planilha) |
| T2 | Perda vazia | Preço de venda não aparece | Pendente de teste no sistema |
| T3 | Config completa: custo 500, perda 15%, mão de obra 120, insumos 40, frete 30, instalação 60, impostos 6%, comissão 5%, margem 25% | Preço de venda R$ 1.309,74/m² | Passou (planilha) |
| T4 | Ambiente R$ 10.000, cooktop na obra R$ 190 | Acabador R$ 490,50 | Pendente |
| T5 | Vendedor com R$ 90 mil no mês; faixa muda acima de R$ 100 mil | Faixa nova vale o mês todo | Pendente |
| T6 | Dia 1 do mês | Acumulado zera | Pendente |
| T7 | Vendedor autorizado libera peça | Não recebe comissão de liberação | Pendente |
| T8 | Desconto acima do limite | Pede aprovação | Pendente |
| T9 | Alteração de preço dentro da margem | Permitida e registrada | Pendente |
| T10 | Alteração acima da margem | Bloqueada | Pendente |
| T11 | Frete por km: 60 km, ida e volta, 10 km livres, R$ 2,00/km | R$ 220 | Passou (planilha) |
| T12 | Proposta: 2 m² × R$ 1.309,74 + R$ 220 | R$ 2.839,49 | Passou (planilha) |
| T13 | Endereço do galpão no PDF | Não aparece | Passou (PDF) |
| T14 | Simulação sem tabela de taxa | Não aparece | Pendente |
| T15 | Aviso de pagamento duplicado | Não gera baixa em dobro | Pendente |

---

## 16. Decisões pendentes e pendências externas

**Para o gestor da empresa (ele decide):**
1. Taxas da maquininha e do link, banco e provedor.
2. Padrão de comissão por função e dia de pagamento.
3. (Resolvido em 22/11: a empresa define quem aprova na configuração.)

**Para a usuária (processo):**
1. Logística e administração: o que cada uma controla.

**Para o contador:**
1. Validade legal do ponto por geolocalização.
2. Regra de juros repassados ao cliente e como mostrar na proposta.
3. Regras de LGPD para dados de localização e dados bancários.

**Para validação externa:**
1. Registro da marca Átrio no INPI.
2. Tabela de feriados (decreto oficial de PE e Recife).
3. Chave de serviço de mapas para distância automática.
4. Ler a fundo HEROGRAN, Sergio Miranda e Marmocalc.

**Infraestrutura:**
1. Contas Vercel e Supabase da usuária (para banco, login, telas e recebimento do aviso do Pix).
2. Chave de provedor de pagamento, por empresa.

---

## 17. Modelo de dados

Regra geral: cada empresa tem seus próprios dados. Nenhuma tabela é compartilhada entre empresas. CONFIRMADO.

**Entidades principais**

| Entidade | Campos essenciais | Liga com |
|---|---|---|
| Empresa | nome, CNPJ, logo, cores, idiomas, configuração (chave e valor, vazia de fábrica) | tudo |
| Unidade | nome, CEP, estado, cidade, bairro, regra de feriados (dias úteis ou corridos) | empresa |
| Galpão de saída | endereço interno, não exibido | unidade (frete por km) |
| Pessoa | nome, sobrenome, contato, CPF, chave Pix (criptografados, só financeiro) | setores, beneficiário |
| Setor | nome, criado pela empresa | pessoas (responsável, uma pessoa pode ter vários setores) |
| Função | nome, permissões (matriz) | pessoa |
| Beneficiário | pessoa que recebe comissão ou pagamento | comissão |
| Cliente | código CLI-0001, nome, telefone, CPF ou CNPJ, observação; avulso só nome e telefone | obra, proposta |
| Obra | endereço, unidade atendente | cliente, responsáveis |
| Responsável de obra | papel (arquiteto, mestre, engenheiro), nome, contato | obra |
| Proposta | versão, status (enviada ou aprovada), validade, desconto aplicado, alterações registradas | cliente, obra, pedido |
| Ambiente | nome, material, medidas, área, serviços | proposta |
| Serviço (catálogo da empresa) | nome, cobra ou não, valor, critério, onde é feito, aparece no PDF | ambiente |
| Pedido | código PED-000001, tipo (obra ou retirada), prazo, alerta de 3 dias, arquiteto registrado | proposta aprovada |
| Participação no pedido | pessoa, função, valor combinado (padrão ou ajustado), registro da mudança | pedido, beneficiário |
| Comissão (lançamento) | pessoa, mês, base acumulada, faixa aplicada, valor, status | participação |
| Pagamento (cobrança) | canal (maquininha, link ou Pix), parcelas, valor da parcela, valor total, status, juros assumidos | pedido |
| Material | código, tipo, categoria, material, acabamento, espessura, chapa | cotação, estoque |
| Fornecedor | nome, apelido, cotações | material, nota fiscal |
| Cotação | material, fornecedor, preço, data (nunca apagada) | material |
| Nota fiscal | fornecedor, valores, vencimento, forma de pagamento, itens | estoque, contas a pagar |
| Estoque | material, quantidade, chapa bruta ou retalho | nota fiscal |
| Funcionário | nome, função, data de entrada, situação, contato | produção, ponto |
| Registro de produção | funcionário, serviço, início, fim, pausas, ambiente ou peça, quem registrou | funcionário, pedido |
| Atestado | foto, status (pendente ou entregue) | funcionário |
| Alteração | quem alterou, o que mudou, valor antes e depois | proposta, participação |

**Regra de registro:** toda alteração de preço, desconto ou valor de comissão gera uma linha em Alteração, com quem fez e quando. CONFIRMADO.

---

## 18. Estados

| Entidade | Estados | Transições | Status |
|---|---|---|---|
| Proposta | enviada, aprovada | enviada → aprovada (pelo cliente). Nova versão não apaga a anterior | CONFIRMADO |
| Pedido | a definir (ex.: aberto, em produção, entregue) | a definir | PENDENTE |
| Pagamento | pendente, pago | pendente → pago (aviso validado do provedor). Aviso repetido não muda nada | CONFIRMADO |
| Pagamento | expirado ou cancelado | a definir | PROPOSTO |
| Comissão | lançado, fechado, pago | lançado → fechado (último dia do mês) → pago (dia configurado pela empresa, mês seguinte) | CONFIRMADO |
| Atestado | pendente, entregue | pendente → entregue (quando o papel original chega) | CONFIRMADO |
| Liberação técnica | a definir | a definir | PENDENTE |

---

## 19. Permissões

| Função | Pode | Não pode |
|---|---|---|
| Gestor | configurar tudo na aba da empresa; cadastrar funções e setores | — |
| Vendedor | montar proposta; dar desconto até o limite; ver quanto ainda pode dar de desconto (folga, em R$ e %); alterar preço dentro da margem; liberar retirada e peça sem medição (se configurado) | passar do limite sem aprovação; ver custo, margem, taxas e dados de pagamento internos |
| Acima do limite | aprovar desconto (quem, a empresa define na configuração) | — |
| RH | cadastrar pessoas; calcular comissão e produção; definir comissão de liberação | ver chave Pix e CPF |
| Financeiro | lançar pagamento; ver chave Pix e CPF; pagar comissão; receber notas fiscais | — |
| Funcionário | registrar o próprio serviço; bater ponto; enviar atestado | ver dados de outros funcionários |
| Cliente (link) | ver proposta; aprovar ou pedir alteração | ver taxas, margem, endereço do galpão |
| Inspeção (plataforma) | ver registros de agentes | acesso restrito a quem tem autorização |

Regra: dados internos da empresa nunca aparecem para o cliente. CONFIRMADO.

---

## 20. Telas por função

**Gestor (configuração)**
- Aba Empresa, Preço, Serviços, Cubas, Insumos, Proposta, Equipe, Comissão, Produção, Liberação, Ponto, Atendimento, Financeiro.
- Campo vazio aparece em destaque, com o nome do campo.

**Vendedor**
- Lista de clientes e obras.
- Proposta: ambientes, material, medidas, serviços, simulação de pagamento, PDF.
- Pedidos e status.

**Cliente (link no celular)**
- Ver proposta, informar nome, aprovar ou pedir alteração.

**Financeiro**
- Pagamentos pendentes e pagos.
- Comissões por pessoa, por mês.
- Notas fiscais e contas a pagar por fornecedor.
- Dados Pix (acesso restrito).

**Funcionário (portal)**
- Registrar serviço, bater ponto, enviar atestado.

**Atendimento (WhatsApp)**
- Conversa por função. Regras de resposta: PENDENTE (você define o que cada função pode responder).

---

## 20b. Pedido (tela central)

Regra: tudo que é do pedido fica dentro do pedido. Não existem abas separadas por processo (liberação, produção, pagamento). CONFIRMADO.

**Lista de pedidos**
- Uma única tela, com busca por código, cliente, obra ou status.
- Cada item da lista mostra código, cliente, obra, status e prazo.

**Dentro do pedido (uma página, em blocos na ordem do processo)**
1. Cabeçalho: código, cliente, obra, tipo (obra ou retirada), unidade atendente, prazo e status.
2. Proposta aprovada: ambientes, material, medidas, serviços, valor e condição de pagamento.
3. Arquivos: projeto, ordem de corte, ordem de acabamento e anexos. Ficam guardados no próprio pedido.
4. Liberação técnica: quem liberou, m² liberado e diferença com o vendido. Bloco dentro do pedido.
5. Produção: registros de serviço por funcionário (início, fim, pausa, ambiente ou peça).
6. Pagamentos: canal, parcelas, status de cada parcela.
7. Participações: arquiteto e demais envolvidos, com valor combinado e registro de ajustes.
8. Histórico: toda mudança de status, preço, desconto ou responsável, com quem fez e quando.

**Status do pedido (sequência):**
1. Pedido fechado
2. Aguardando medição
3. Aguardando liberação técnica (a caixinha de medição, quando marcada, move o pedido para cá)
4. Corte
5. Acabamento
6. Entrega (retirada usa o mesmo status)
7. Instalação (com caixinha "concluída" quando termina)

Regra: cada mudança de status entra no histórico, com quem fez e quando. CONFIRMADO.
Voltar status: a empresa configura quem pode voltar um pedido (gestor só, ou vendedores autorizados). Voltar sempre exige justificativa escrita, que fica no histórico. CONFIRMADO (regra). Quem pode: a empresa define.

---

## 20c. Quadro Kanban

- Mostra só pedidos a partir de "Aguardando liberação técnica": colunas Aguardando liberação técnica, Corte, Acabamento, Entrega e Instalação. CONFIRMADO.
- Pedido fechado e aguardando medição ficam só na lista de pedidos, fora do quadro. CONFIRMADO.
- Cada cartão abre o pedido completo. CONFIRMADO.

---

## 21. Testes adicionais

| # | Entrada | Resultado esperado |
|---|---|---|
| T16 | Desconto ou alteração de preço | Linha em Alteração com quem fez |
| T17 | Comissão por função com valor ajustado no pedido | Ajuste aparece no relatório financeiro |
| T18 | Pedido criado a partir da proposta | Arquiteto registrado no pedido |
| T19 | Fechamento do mês com pagamento depois do dia 30 | Entra no mês em que foi confirmado |
| T20 | Pix pago duas vezes (aviso repetido) | Só uma baixa |
| T21 | Usuário sem permissão de financeiro abre a tela de pagamento | Não vê chave Pix nem CPF |
| T22 | Empresa sem tabela de taxa | Simulação não aparece |
| T23 | Vendedor com desconto acima do limite | Pede aprovação |
| T24 | Cliente abre o link | Não vê taxa, margem nem galpão |

---

## 22. O que ainda impede fechar a spec

Bloqueiam (precisam de você ou da empresa):
- Status do pedido e da liberação técnica (seção 18).
- Regras de atendimento do WhatsApp por função.
- Ponto e atestado: validação legal com contador.
- Compras e estoque: detalhes do dia a dia (ex.: quem recebe a nota, quem confirma o estoque).

Não bloqueiam a construção, só a decisão final:
- INPI, feriados por decreto, chave de mapas.

---

## 22b. Fechamento da v1

Status: SPEC DA V1 FECHADA em 21/11/2026, pronta para construção.

Decisões finais:
- Voltar status: configurável pela empresa (gestor, ou vendedores autorizados), sempre com justificativa no histórico. CONFIRMADO.
- Fora da v1, para fase seguinte: WhatsApp (respostas por função), ponto e atestado, compras e estoque. DECISÃO MINHA (a validar).

Dentro da v1: configuração da empresa, proposta e aprovação, pedido com status e quadro Kanban, prazos e calendário, formas de pagamento, cadastro de quem recebe, comissão por função e fechamento mensal, permissões e testes T1 a T24.

---

## 23. Histórico de decisões

- 20–21/11: planilha de orçamento v1 a v4; perda com fórmula corrigida para custo ÷ (1 − perda).
- 21/11: configuração toda da empresa; estrutura sem valores de fábrica.
- 21/11: RH com cadastro, produção e comissão por faixa.
- 21/11: idioma e tema; marca Átrio na tela interna e logo da empresa no PDF.
- 21/11: unidades (matriz e filiais), galpão de saída interno, feriados em três camadas.
- 21/11: frete por km e proposta em PDF, com testes passados.
- 21/11: formas de pagamento (maquininha e link, simulação única, dados internos separados). Aprovado.
- 21/11: beneficiários (nome, sobrenome, CPF, chave Pix); arquiteto no pedido; comissão por função com ajuste por pedido; ciclo mensal com pagamento no mês seguinte.
- 21/11: regra de que valores e percentuais são sempre da empresa; Claude constrói estrutura, automação e forma de recebimento.
- 22/11: orçamento e pedido são o mesmo registro; o que muda é a situação (orçamento, aguardando aprovação, aprovado, pedido). Vendedor passa a ver a folga de desconto (quanto ainda pode dar), sem ver custo, margem ou taxas. Acima do limite, o orçamento vai para aprovação. CONFIRMADO pela usuária.
- 22/11: quem aprova desconto acima do limite é definido pela empresa na configuração. CONFIRMADO pela usuária.
- 22/11: margem e perda iniciais vêm como padrão do sistema, baseado no ensino da Universidade da Marmoraria, adaptado à realidade da empresa. A empresa recebe como sugestão e pode aceitar ou alterar. Os números da universidade ainda não foram informados; ficam pendentes até a usuária enviá-los. CONFIRMADO pela usuária.
- 22/11: o sistema mostra à empresa se cada venda dá lucro ou prejuízo, usando a margem líquida de hoje (seção 4). A configuração de margem e perda é editável pela empresa, e o sistema explica o que cada número significa, para a empresa aprender a ler o próprio resultado. CONFIRMADO pela usuária.
- 22/11: cada venda mostra o custo total, que inclui material com perda, insumos, montagem (mão de obra), instalação e frete. A partir dele, mostra o preço de venda e o resultado (lucro ou prejuízo). A conta já existe no motor de cálculo. CONFIRMADO pela usuária.
- 22/11: no cadastro de material, o sistema mostra se aquele material dá lucro ou prejuízo, e sugere o valor do m² de venda, conforme a forma de cobrança do material. A sugestão vem do padrão da Universidade da Marmoraria; a empresa aceita ou altera. CONFIRMADO pela usuária.
- 22/11: o sistema tem um passo a passo dentro de cada tela, de onde clicar e o que fazer, para o cliente da marmoraria aprender a usar sem treinamento. Na primeira entrada, aparece como manual. Não é para a equipe técnica da Porcelane. CONFIRMADO pela usuária.
- 22/11: nas telas, o nome da universidade não aparece. A sugestão é mostrada em cada etapa do cadastro, com o texto: "Sugestão inicial do Átrio, com base em boas práticas de marmoraria. Você pode alterar." A origem fica só na documentação interna. CONFIRMADO pela usuária.
