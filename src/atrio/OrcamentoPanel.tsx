import { useEffect, useState, type FormEvent } from "react";
import type { Ambiente, Condicao } from "../lib/atrio/orcamento";
import { totalOrcamento, condicaoDoCliente } from "../lib/atrio/orcamento";
import { lerConfig, salvarOrcamento, listarOrcamentos, type Config } from "../lib/atrio/orcamentoApi";

type Props = { empresaId: string; podeGravarInternos: boolean };

const vazio = (): Ambiente => ({
  nome: "", custo: null, perda: null, maoDeObra: null, insumos: null, instalacao: null, frete: 0,
  impostos: null, comissao: null, margem: null, valorAmbiente: null, servicosNaObra: null, percentualAcabador: null,
});

const n = (v: string): number | null => (v.trim() === "" ? null : Number(v.replace(",", ".")));

export default function OrcamentoPanel({ empresaId, podeGravarInternos }: Props) {
  const [config, setConfig] = useState<Config | null>(null);
  const [lista, setLista] = useState<any[]>([]);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [cliente, setCliente] = useState("");
  const [obra, setObra] = useState("");
  const [prazoQtd, setPrazoQtd] = useState("");
  const [prazoTipo, setPrazoTipo] = useState<"uteis" | "corridos">("uteis");
  const [frete, setFrete] = useState("0");
  const [entradaPct, setEntradaPct] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [formaEntrada, setFormaEntrada] = useState("pix");
  const [formaSaldo, setFormaSaldo] = useState("cartao");
  const [ambientes, setAmbientes] = useState<Ambiente[]>([vazio()]);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    try {
      setConfig(await lerConfig(empresaId));
      setLista(await listarOrcamentos(empresaId));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar.");
    }
  }
  useEffect(() => { carregar(); }, [empresaId]);

  const condicao: Condicao = {
    entradaValor: null,
    entradaPercentual: entradaPct.trim() === "" ? null : Number(entradaPct) / 100,
    parcelas: n(parcelas),
    formaEntrada,
    formaSaldo,
  };
  const total = config ? totalOrcamento(ambientes, n(frete), config) : null;
  const cond = total != null ? condicaoDoCliente(total, condicao) : null;

  function atualizar(i: number, campo: keyof Ambiente, valor: string) {
    setAmbientes((lista) => lista.map((a, idx) => (idx === i ? { ...a, [campo]: campo === "nome" ? valor : n(valor) } : a)));
  }

  async function onSalvar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setAviso("");
    if (!config) return setErro("Configuração da empresa ainda não carregou.");
    if (!cliente.trim() || !obra.trim()) return setErro("Preencha cliente e obra.");
    if (!n(prazoQtd) || (n(prazoQtd) ?? 0) < 1) return setErro("Informe a quantidade de dias do prazo.");
    setSalvando(true);
    try {
      await salvarOrcamento(
        {
          empresaId,
          codigo: `OR-${Date.now().toString().slice(-6)}`,
          cliente: cliente.trim(),
          obra: obra.trim(),
          prazoQuantidade: n(prazoQtd) as number,
          prazoTipo,
          ambientes: ambientes.map((a) => ({ ...a, nome: a.nome || "Ambiente" })),
          frete: n(frete),
          condicao,
          formas: { entrada: formaEntrada, saldo: formaSaldo },
        },
        config,
      );
      setAviso("Orçamento salvo.");
      setCliente(""); setObra(""); setAmbientes([vazio()]);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="atrio-panel">
      {!podeGravarInternos && (
        <p className="atrio-aviso">Você pode consultar os orçamentos. Quem grava orçamento completo é o gestor ou o financeiro.</p>
      )}

      {podeGravarInternos && (
        <form className="atrio-card" onSubmit={onSalvar}>
          <h2>Novo orçamento</h2>
          <label>Cliente<input value={cliente} onChange={(e) => setCliente(e.target.value)} /></label>
          <label>Obra<input value={obra} onChange={(e) => setObra(e.target.value)} /></label>
          <label>Prazo (dias)<input inputMode="numeric" value={prazoQtd} onChange={(e) => setPrazoQtd(e.target.value)} /></label>
          <label>Tipo de prazo
            <select value={prazoTipo} onChange={(e) => setPrazoTipo(e.target.value as any)}>
              <option value="uteis">Úteis</option>
              <option value="corridos">Corridos</option>
            </select>
          </label>
          <label>Frete (R$)<input inputMode="decimal" value={frete} onChange={(e) => setFrete(e.target.value)} /></label>

          <h2>Ambientes</h2>
          {ambientes.map((a, i) => (
            <fieldset key={i} className="atrio-card">
              <label>Nome<input value={a.nome} onChange={(e) => atualizar(i, "nome", e.target.value)} /></label>
              <label>Custo (R$)<input inputMode="decimal" onChange={(e) => atualizar(i, "custo", e.target.value)} /></label>
              <label>Perda (0,10 = 10%)<input inputMode="decimal" onChange={(e) => atualizar(i, "perda", e.target.value)} /></label>
              <label>Mão de obra (R$)<input inputMode="decimal" onChange={(e) => atualizar(i, "maoDeObra", e.target.value)} /></label>
              <label>Insumos (R$)<input inputMode="decimal" onChange={(e) => atualizar(i, "insumos", e.target.value)} /></label>
              <label>Instalação (R$)<input inputMode="decimal" onChange={(e) => atualizar(i, "instalacao", e.target.value)} /></label>
            </fieldset>
          ))}
          <button type="button" className="atrio-btn secundario" onClick={() => setAmbientes((l) => [...l, vazio()])}>Adicionar ambiente</button>

          <h2>Pagamento</h2>
          <label>Entrada (%)<input inputMode="decimal" value={entradaPct} onChange={(e) => setEntradaPct(e.target.value)} /></label>
          <label>Parcelas do saldo<input inputMode="numeric" value={parcelas} onChange={(e) => setParcelas(e.target.value)} /></label>
          <label>Forma da entrada<input value={formaEntrada} onChange={(e) => setFormaEntrada(e.target.value)} /></label>
          <label>Forma do saldo<input value={formaSaldo} onChange={(e) => setFormaSaldo(e.target.value)} /></label>

          <div className="atrio-card">
            <strong>Total: {total == null ? "preencha a configuração e os valores" : total.toFixed(2)}</strong>
            {cond && <span>Entrada {cond.entrada.toFixed(2)} · {cond.parcelas.length}x de {cond.parcelas[0].valor.toFixed(2)}</span>}
          </div>

          {erro && <p className="atrio-erro" role="alert">{erro}</p>}
          <button className="atrio-btn" disabled={salvando}>{salvando ? "Salvando..." : "Salvar orçamento"}</button>
        </form>
      )}

      {aviso && <p className="atrio-aviso" role="status">{aviso}</p>}
      {!podeGravarInternos && erro && <p className="atrio-erro" role="alert">{erro}</p>}

      <div className="atrio-card">
        <h2>Orçamentos</h2>
        {lista.length === 0 ? <p>Nenhum orçamento ainda.</p> : (
          <ul className="atrio-lista">
            {lista.map((o) => (
              <li key={o.id}><span>{o.codigo} · {o.cliente} · {o.obra}</span><strong>{o.total == null ? "—" : Number(o.total).toFixed(2)}</strong></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
