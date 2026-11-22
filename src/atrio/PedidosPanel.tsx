import { useEffect, useState } from "react";
import { listarPedidos, avancarStatus } from "../lib/atrio/pedidoApi";
import { proximoStatus, type StatusPedido } from "../lib/atrio/pedido";
import Dica from "./Dica";

const ROTULO: Record<StatusPedido, string> = {
  pedido_fechado: "Pedido fechado",
  aguardando_medicao: "Aguardando medição",
  aguardando_liberacao_tecnica: "Aguardando liberação técnica",
  corte: "Corte",
  acabamento: "Acabamento",
  entrega: "Entrega",
  instalacao: "Instalação",
};

type Props = { empresaId: string; podeGravarInternos: boolean };

export default function PedidosPanel({ empresaId, podeGravarInternos }: Props) {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setPedidos(await listarPedidos(empresaId));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar.");
    }
  }
  useEffect(() => { carregar(); }, [empresaId]);

  async function avancar(p: any) {
    setErro("");
    try {
      await avancarStatus({ id: p.id, status: p.status });
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível avançar.");
    }
  }

  return (
    <section className="atrio-panel">
      <Dica tela="pedidos" texto="Aqui ficam os pedidos. Cada pedido vem de um orçamento aprovado. Use o botão Avançar para mudar a etapa." />
      {erro && <p className="atrio-erro" role="alert">{erro}</p>}
      <div className="atrio-card">
        <h2>Pedidos</h2>
        {pedidos.length === 0 ? <p>Nenhum pedido ainda.</p> : (
          <ul className="atrio-lista">
            {pedidos.map((p) => {
              const prox = proximoStatus(p.status as StatusPedido);
              return (
                <li key={p.id}>
                  <span>{p.codigo} · {p.cliente} · {p.obra ?? ""}</span>
                  <span>
                    <strong>{ROTULO[p.status as StatusPedido]}</strong>
                    {podeGravarInternos && prox && (
                      <button className="atrio-btn secundario" onClick={() => avancar(p)}>Avançar</button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
