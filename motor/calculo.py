"""Motor de cálculo do Átrio (v1).

Regra: campo vazio não entra no cálculo. Se faltar campo obrigatório,
a função devolve None, e quem chama mostra qual campo falta.
"""


def custo_com_perda(custo, perda):
    """custo ÷ (1 − perda). Perda em fração (0.15 = 15%)."""
    if custo is None or perda is None:
        return None
    if perda >= 1:
        return None
    return custo / (1 - perda)


def preco_de_venda(custo, perda, mao_de_obra, insumos, instalacao, frete,
                   impostos, comissao, margem):
    """Preço de venda por m².

    custo total = custo com perda + mão de obra + insumos + instalação + frete
    preço = custo total ÷ (1 − impostos − comissão − margem)
    """
    campos = {
        "custo": custo, "perda": perda, "mao_de_obra": mao_de_obra,
        "insumos": insumos, "instalacao": instalacao, "frete": frete,
        "impostos": impostos, "comissao": comissao, "margem": margem,
    }
    if any(v is None for v in campos.values()):
        return None
    divisor = 1 - impostos - comissao - margem
    if divisor <= 0:
        return None
    total = custo_com_perda(custo, perda) + mao_de_obra + insumos + instalacao + frete
    return total / divisor


def acabador(valor_ambiente, servicos_na_obra, percentual):
    """Percentual sobre (valor do ambiente − serviços feitos na obra)."""
    if valor_ambiente is None or percentual is None:
        return None
    servicos_na_obra = servicos_na_obra or 0
    return (valor_ambiente - servicos_na_obra) * percentual
