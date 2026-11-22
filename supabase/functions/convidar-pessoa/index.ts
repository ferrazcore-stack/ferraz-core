import { createClient } from "npm:@supabase/supabase-js@2";

const FUNCOES = ["gestor", "vendedor", "tecnico", "financeiro"];

function resposta(status: number, corpo: unknown) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return resposta(405, { erro: "Método não permitido." });

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth) return resposta(401, { erro: "Entre no sistema para convidar pessoas." });

  let corpo: { empresa_id?: string; email?: string; funcao?: string };
  try {
    corpo = await req.json();
  } catch {
    return resposta(400, { erro: "Dados inválidos." });
  }
  const empresaId = corpo.empresa_id ?? "";
  const email = (corpo.email ?? "").trim();
  const funcao = corpo.funcao ?? "";

  if (!/^[0-9a-f-]{36}$/i.test(empresaId)) return resposta(400, { erro: "Empresa inválida." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return resposta(400, { erro: "E-mail inválido." });
  if (!FUNCOES.includes(funcao)) return resposta(400, { erro: "Função inválida." });

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Quem chama precisa ser mestre desta empresa (checado pelo banco, com o token dela).
  const quemChama = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: ehMestre, error: erroMestre } = await quemChama.rpc("e_mestre", { eid: empresaId });
  if (erroMestre) return resposta(401, { erro: "Entre no sistema para convidar pessoas." });
  if (!ehMestre) return resposta(403, { erro: "Só o mestre da empresa pode convidar pessoas." });

  const admin = createClient(url, service);
  const { data: convite, error: erroConvite } = await admin.auth.admin.inviteUserByEmail(email);
  if (erroConvite || !convite?.user) {
    const jaTem = /already|registered|exists/i.test(erroConvite?.message ?? "");
    return resposta(jaTem ? 409 : 500, {
      erro: jaTem
        ? "Esse e-mail já tem conta. Peça para a pessoa entrar e avise o suporte para vincular."
        : "Não foi possível enviar o convite.",
    });
  }

  const { error: erroVinculo } = await admin
    .from("membros")
    .insert({ user_id: convite.user.id, empresa_id: empresaId, funcao, mestre: false });
  if (erroVinculo) return resposta(500, { erro: "Convite enviado, mas o vínculo falhou. Tente de novo." });

  return resposta(200, { ok: true });
});
