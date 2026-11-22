import { useEffect, useState, type FormEvent } from "react";
import { FUNCOES, rotuloFuncao, funcaoValida, validarEmail, type Funcao } from "../lib/atrio/acesso";
import { listarPessoas, mudarFuncao, convidarPessoa, type Pessoa } from "../lib/atrio/acessoApi";
import Dica from "./Dica";

type Props = { empresaId: string; mestre: boolean };

export default function PessoasPanel({ empresaId, mestre }: Props) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [email, setEmail] = useState("");
  const [funcao, setFuncao] = useState<Funcao>("vendedor");
  const [enviando, setEnviando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      setPessoas(await listarPessoas(empresaId));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [empresaId]);

  async function convidar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setAviso("");
    if (!validarEmail(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }
    setEnviando(true);
    try {
      await convidarPessoa(empresaId, email, funcao);
      setAviso("Convite enviado. A pessoa aparece na lista quando aceitar.");
      setEmail("");
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar o convite.");
    } finally {
      setEnviando(false);
    }
  }

  async function alterar(userId: string, nova: string) {
    if (!funcaoValida(nova)) return;
    setErro("");
    setAviso("");
    try {
      await mudarFuncao(empresaId, userId, nova);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível alterar a função.");
    }
  }

  return (
    <section className="atrio-panel">
      <Dica tela="pessoas" texto="Aqui ficam as pessoas da empresa. Só o mestre convida e muda a função de cada um." />
      {mestre && (
        <form className="atrio-card" onSubmit={convidar}>
          <h2>Convidar pessoa</h2>
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@empresa.com" />
          </label>
          <label>
            Função
            <select value={funcao} onChange={(e) => setFuncao(e.target.value as Funcao)}>
              {FUNCOES.map((f) => (
                <option key={f} value={f}>{rotuloFuncao(f)}</option>
              ))}
            </select>
          </label>
          <button className="atrio-btn" disabled={enviando}>{enviando ? "Enviando..." : "Enviar convite"}</button>
        </form>
      )}

      {erro && <p className="atrio-erro" role="alert">{erro}</p>}
      {aviso && <p className="atrio-aviso" role="status">{aviso}</p>}

      <div className="atrio-card">
        <h2>Pessoas da empresa</h2>
        {carregando ? (
          <p>Carregando...</p>
        ) : pessoas.length === 0 ? (
          <p>Nenhuma pessoa cadastrada.</p>
        ) : (
          <ul className="atrio-lista">
            {pessoas.map((p) => (
              <li key={p.user_id}>
                <span>{p.mestre ? "Mestre" : "Pessoa"}</span>
                {mestre && !p.mestre ? (
                  <select value={p.funcao} onChange={(e) => alterar(p.user_id, e.target.value)}>
                    {FUNCOES.map((f) => (
                      <option key={f} value={f}>{rotuloFuncao(f)}</option>
                    ))}
                  </select>
                ) : (
                  <strong>{rotuloFuncao(p.funcao)}</strong>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
