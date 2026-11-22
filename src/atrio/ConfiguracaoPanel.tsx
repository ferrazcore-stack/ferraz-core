import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import Dica from "./Dica";

type Props = { empresaId: string };

// Cada campo tem uma frase do que significa. A empresa pode mudar qualquer valor.
const CAMPOS = [
  {
    chave: "impostos",
    rotulo: "Impostos (%)",
    ajuda: "Quanto do preço vai para impostos. Ex.: 6 = 6% do preço.",
  },
  {
    chave: "comissao",
    rotulo: "Comissão (%)",
    ajuda: "Quanto do preço vai para comissão de venda.",
  },
  {
    chave: "margem",
    rotulo: "Margem desejada (%)",
    ajuda: "O lucro que você quer sobrar em cada venda, depois de impostos e comissão.",
  },
  {
    chave: "desconto_maximo",
    rotulo: "Desconto máximo do vendedor (%)",
    ajuda: "Quanto o vendedor pode dar de desconto sem pedir aprovação.",
  },
];

export default function ConfiguracaoPanel({ empresaId }: Props) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("configuracao")
        .select("chave, valor")
        .eq("empresa_id", empresaId);
      if (error) return setErro("Não foi possível carregar a configuração.");
      const mapa: Record<string, string> = {};
      (data ?? []).forEach((r: any) => (mapa[r.chave] = r.valor));
      setValores(mapa);
    }
    carregar();
  }, [empresaId]);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setAviso("");
    if (!supabase) return;
    setSalvando(true);
    try {
      const linhas = CAMPOS.filter((c) => (valores[c.chave] ?? "").trim() !== "").map((c) => ({
        empresa_id: empresaId,
        chave: c.chave,
        valor: valores[c.chave].trim().replace(",", "."),
      }));
      const { error } = await supabase.from("configuracao").upsert(linhas, { onConflict: "empresa_id,chave" });
      if (error) throw new Error("Não foi possível salvar. Só o gestor pode alterar a configuração.");
      setAviso("Configuração salva.");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  const faltando = CAMPOS.filter((c) => (valores[c.chave] ?? "").trim() === "");

  return (
    <section className="atrio-panel">
      <Dica tela="configuracao" texto="Aqui a empresa define os números. Campo vazio impede o cálculo do preço. Use o ? para rever esta ajuda." />
      <form className="atrio-card" onSubmit={salvar}>
        <h2>Configuração da empresa</h2>
        <p className="atrio-aviso">Sugestão inicial do Átrio, com base em boas práticas de marmoraria. Você pode alterar.</p>
        {faltando.length > 0 && (
          <p className="atrio-erro">Faltam: {faltando.map((c) => c.rotulo).join(", ")}</p>
        )}
        {CAMPOS.map((c) => (
          <label key={c.chave}>
            {c.rotulo}
            <input
              inputMode="decimal"
              value={valores[c.chave] ?? ""}
              onChange={(e) => setValores((v) => ({ ...v, [c.chave]: e.target.value }))}
            />
            <small>{c.ajuda}</small>
          </label>
        ))}
        {erro && <p className="atrio-erro" role="alert">{erro}</p>}
        {aviso && <p className="atrio-aviso" role="status">{aviso}</p>}
        <button className="atrio-btn" disabled={salvando}>{salvando ? "Salvando..." : "Salvar configuração"}</button>
      </form>
    </section>
  );
}
