export const FUNCOES = ["gestor", "vendedor", "tecnico", "financeiro"] as const;
export type Funcao = (typeof FUNCOES)[number];

const ROTULOS: Record<Funcao, string> = {
  gestor: "Gestor",
  vendedor: "Vendedor",
  tecnico: "Técnico",
  financeiro: "Financeiro",
};

export function validarEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function validarSenha(s: string): boolean {
  return s.length >= 8;
}

export function funcaoValida(s: string): s is Funcao {
  return (FUNCOES as readonly string[]).includes(s);
}

export function rotuloFuncao(f: Funcao): string {
  return ROTULOS[f];
}
