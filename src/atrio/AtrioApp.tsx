import { useEffect, useState, type FormEvent } from "react";
import { validarEmail, validarSenha } from "../lib/atrio/acesso";
import { entrar, sair, sessaoAtual, meusVinculos, type Vinculo } from "../lib/atrio/acessoApi";
import { supabaseConfigured } from "../lib/supabase";
import PessoasPanel from "./PessoasPanel";
import "./atrio.css";

export default function AtrioApp() {
  const [carregando, setCarregando] = useState(true);
  const [logado, setLogado] = useState(false);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [erro, setErro] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function carregarAcessos() {
    try {
      setVinculos(await meusVinculos());
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar acessos.");
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      setCarregando(false);
      return;
    }
    sessaoAtual()
      .then(async (s) => {
        if (s) {
          setLogado(true);
          await carregarAcessos();
        }
      })
      .finally(() => setCarregando(false));
  }, []);

  async function onEntrar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    if (!validarEmail(email)) return setErro("Digite um e-mail válido.");
    if (!validarSenha(senha)) return setErro("A senha precisa ter pelo menos 8 caracteres.");
    setEnviando(true);
    try {
      await entrar(email, senha);
      setLogado(true);
      setSenha("");
      await carregarAcessos();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setEnviando(false);
    }
  }

  async function onSair() {
    await sair();
    setLogado(false);
    setVinculos([]);
  }

  if (carregando) return <div className="atrio-tela"><p>Carregando...</p></div>;

  if (!supabaseConfigured) {
    return <div className="atrio-tela"><p className="atrio-erro">Banco não configurado neste ambiente.</p></div>;
  }

  if (!logado) {
    return (
      <div className="atrio-tela">
        <form className="atrio-card atrio-login" onSubmit={onEntrar}>
          <h1>Entrar no Átrio</h1>
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </label>
          <label>
            Senha
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />
          </label>
          {erro && <p className="atrio-erro" role="alert">{erro}</p>}
          <button className="atrio-btn" disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</button>
        </form>
      </div>
    );
  }

  if (vinculos.length === 0) {
    return (
      <div className="atrio-tela">
        <div className="atrio-card">
          <h1>Sem acesso a nenhuma empresa</h1>
          <p>Peça ao mestre da sua empresa para liberar seu acesso.</p>
          {erro && <p className="atrio-erro" role="alert">{erro}</p>}
          <button className="atrio-btn" onClick={onSair}>Sair</button>
        </div>
      </div>
    );
  }

  const atual = vinculos[0];
  return (
    <div className="atrio-tela atrio-shell">
      <header className="atrio-topo">
        <strong>{atual.nome}</strong>
        <button className="atrio-btn secundario" onClick={onSair}>Sair</button>
      </header>
      <PessoasPanel empresaId={atual.empresa_id} mestre={atual.mestre} />
    </div>
  );
}
