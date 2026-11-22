import { supabase } from "../supabase";
import type { Funcao } from "./acesso";

export type Vinculo = { empresa_id: string; nome: string; mestre: boolean; funcao: Funcao };
export type Pessoa = { user_id: string; funcao: Funcao; mestre: boolean };

function cliente() {
  if (!supabase) throw new Error("Supabase não configurado (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
  return supabase;
}

export async function entrar(email: string, senha: string): Promise<void> {
  const { error } = await cliente().auth.signInWithPassword({ email: email.trim(), password: senha });
  if (error) throw new Error("E-mail ou senha incorretos.");
}

export async function sair(): Promise<void> {
  await cliente().auth.signOut();
}

export async function sessaoAtual() {
  const { data } = await cliente().auth.getSession();
  return data.session;
}

export async function meusVinculos(): Promise<Vinculo[]> {
  const { data, error } = await cliente()
    .from("membros")
    .select("empresa_id, mestre, funcao, empresas(nome)");
  if (error) throw new Error("Não foi possível carregar seus acessos.");
  return (data ?? []).map((r: any) => ({
    empresa_id: r.empresa_id,
    nome: r.empresas?.nome ?? "Empresa",
    mestre: r.mestre,
    funcao: r.funcao,
  }));
}

export async function listarPessoas(empresaId: string): Promise<Pessoa[]> {
  const { data, error } = await cliente()
    .from("membros")
    .select("user_id, funcao, mestre")
    .eq("empresa_id", empresaId)
    .order("criado_em", { ascending: true });
  if (error) throw new Error("Não foi possível carregar as pessoas.");
  return (data ?? []) as Pessoa[];
}

export async function mudarFuncao(empresaId: string, userId: string, funcao: Funcao): Promise<void> {
  const { error } = await cliente()
    .from("membros")
    .update({ funcao })
    .eq("empresa_id", empresaId)
    .eq("user_id", userId);
  if (error) throw new Error("Não foi possível alterar a função.");
}

export async function convidarPessoa(empresaId: string, email: string, funcao: Funcao): Promise<void> {
  const { data, error } = await cliente().functions.invoke("convidar-pessoa", {
    body: { empresa_id: empresaId, email: email.trim(), funcao },
  });
  if (error) {
    const msg = (data as any)?.erro ?? "Não foi possível enviar o convite.";
    throw new Error(msg);
  }
}
