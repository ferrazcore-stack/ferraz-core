import { supabase } from "../supabase";
import { totalOrcamento, type Ambiente, type Condicao, condicaoDoCliente } from "./orcamento";

export type Config = { impostos: number | null; comissao: number | null; margem: number | null };

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
    .in("chave", ["impostos", "comissao", "margem"]);
  if (error) throw new Error("Não foi possível ler a configuração da empresa.");
  const mapa = new Map((data ?? []).map((r: any) => [r.chave, r.valor]));
  const num = (k: string) => {
    const v = mapa.get(k);
    return v == null || v === "" ? null : Number(v);
  };
  return { impostos: num("impostos"), comissao: num("comissao"), margem: num("margem") };
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
  condicao: Condicao;
  formas: { entrada: string | null; saldo: string | null };
};

// Calcula o total e grava: total e condição (do cliente) em orcamentos; custos e margem em orcamento_internos.
export async function salvarOrcamento(d: DadosOrcamento, config: Config): Promise<string> {
  const total = totalOrcamento(d.ambientes, d.frete, config);
  if (total == null) throw new Error("Preencha a configuração da empresa e os valores do orçamento antes de salvar.");
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
    .select("id, codigo, cliente, obra, total, prazo_quantidade, prazo_tipo, criado_em")
    .eq("empresa_id", empresaId)
    .order("criado_em", { ascending: false });
  if (error) throw new Error("Não foi possível carregar os orçamentos.");
  return data ?? [];
}
