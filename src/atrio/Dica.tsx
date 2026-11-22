import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";

type Props = { tela: string; texto: string };

// Dica curta. Aparece só na primeira vez que a pessoa abre a tela.
// Depois, só aparece se ela clicar no "?".
export default function Dica({ tela, texto }: Props) {
  const [mostrar, setMostrar] = useState(false);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    let vivo = true;
    async function verificar() {
      if (!supabase || !supabaseConfigured) return setPronta(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setPronta(true);
      const { data } = await supabase
        .from("usuario_dicas_vistas")
        .select("tela")
        .eq("user_id", user.id)
        .eq("tela", tela)
        .maybeSingle();
      if (!vivo) return;
      setMostrar(!data);
      setPronta(true);
    }
    verificar();
    return () => {
      vivo = false;
    };
  }, [tela]);

  async function entendi() {
    setMostrar(false);
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("usuario_dicas_vistas").upsert({ user_id: user.id, tela });
  }

  if (!pronta) return null;

  return (
    <div className="atrio-dica-wrap">
      <button type="button" className="atrio-ajuda" aria-label="Ajuda desta tela" onClick={() => setMostrar((v) => !v)}>?</button>
      {mostrar && (
        <div className="atrio-dica" role="note">
          <p>{texto}</p>
          <button type="button" className="atrio-btn secundario" onClick={entendi}>Entendi</button>
        </div>
      )}
    </div>
  );
}
