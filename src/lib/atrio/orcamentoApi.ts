import { supabase } from "../supabase";
import { totalOrcamento, type Ambiente, type Condicao, condicaoDoCliente } from "./orcamento";
import { calcularDesconto } from "./desconto";

export type Config = { impostos: number | null; comissao: number | null; margem: number | null; descontoMaximo: number | null };

function cliente() {
  if (!supabase) throw new Error("Supabase não configurado.");
  return supabase;
}

// Lê impostos, comissão e margem da configuração da empresa. Ausente = null (bloqueia o cálculo).
export async function lerConfig(empresaId: string): Promise<Config> {
  const { data, error } = await cliente()
    .from("configuracao")
    .select("chave, valor")
    .eq("empresa_id", empresaId)
    .in("chave", ["impostos", "comissao", "margem", "desconto_maximo"]);
  if (error) throw new Error("Não foi possível ler a configuração da empresa.");
  const mapa = new Map((data ?? []).map((r: any) => [r.chave, r.valor]));
  const num = (k: string) => {
    const v = mapa.get(k);
    return v == null || v === "" ? null : Number(v);
  };
  // Percentual aceito como 10 (= 10%) ou 0,10.
  const dm = num("desconto_maximo");
  return {
    impostos: num("impostos"),
    comissao: num("comissao"),
    margem: num("margem"),
    descontoMaximo: dm == null ? null : dm > 1 ? dm / 100 : dm,
  };
}

export type DadosOrcamento = {
  empresaId: string;
  codigo: string;
  cliente: string;
  obra: string;
  prazoQuantidade: number;
  prazoTipo: "uteis" | "corridos";
  ambientes: Ambiente[];
  frete: number | null;
  descontoRs: number;
  condicao: Condicao;
  formas: { entrada: string | null; saldo: string | null };
};

// Calcula o total e grava: total e condição (do cliente) em orcamentos; custos e margem em orcamento_internos.
export async function salvarOrcamento(d: DadosOrcamento, config: Config): Promise<string> {
  const precoCheio = totalOrcamento(d.ambientes, d.frete, config);
  if (precoCheio == null) throw new Error("Preencha a configuração da empresa e os valores do orçamento antes de salvar.");
  const folga = calcularDesconto(precoCheio, d.descontoRs, config.descontoMaximo);
  if (folga.situacao === "indisponivel") throw new Error("Configure o desconto máximo da empresa antes de salvar.");
  const situacao = folga.situacao === "acima" ? "aguardando_aprovacao" : "rascunho";
  const total = precoCheio - d.descontoRs;
  const cond = condicaoDoCliente(total, d.condicao);
  if (!cond) throw new Error("Condição de pagamento incompleta.");

  const { data, error } = await cliente()
    .from("orcamentos")
    .insert({
      empresa_id: d.empresaId,
      codigo: d.codigo,
      cliente: d.cliente,
      obra: d.obra,
      prazo_quantidade: d.prazoQuantidade,
      prazo_tipo: d.prazoTipo,
      total,
      preco_cheio: precoCheio,
      desconto_aplicado: d.descontoRs,
      situacao,
      condicao: { ...cond, formas: d.formas },
    })
    .select("id")
    .single();
  if (error || !data) throw new Error("Não foi possível gravar o orçamento.");

  const { error: erroInternos } = await cliente().from("orcamento_internos").insert({
    orcamento_id: data.id,
    empresa_id: d.empresaId,
    dados: { config, ambientes: d.ambientes, frete: d.frete },
  });
  if (erroInternos) throw new Error("Orçamento gravado, mas os dados internos não foram salvos. Avise o gestor.");

  return data.id as string;
}

export async function listarOrcamentos(empresaId: string) {
  const { data, error } = await cliente()
    .from("orcamentos")
    .select("id, codigo, cliente, obra, total, situacao, prazo_quantidade, prazo_tipo, criado_em")
    .eq("empresa_id", empresaId)
    .order("criado_em", { ascending: false });
  if (error) throw new Error("Não foi possível carregar os orçamentos.");
  return data ?? [];
}
