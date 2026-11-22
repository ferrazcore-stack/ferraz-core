// Frete do Átrio (v1). Modo e valores vêm da configuração da empresa.
// Entra uma vez só, na proposta.

export type ModoFrete = "Km" | "FixoM2";

export interface EntradaFrete {
  modo: ModoFrete | null;
  distanciaKm: number | null;      // digitada até existir mapa
  idaEVolta: boolean | null;
  kmLivres: number | null;
  valorKm: number | null;
  area: number | null;
  valorM2: number | null;
  coleta: boolean | null;          // empresa liga ou desliga
  valorColeta: number | null;
}

export const kmCobrados = (distancia: number | null, idaEVolta: boolean | null, kmLivres: number | null): number | null => {
  if (distancia == null || idaEVolta == null || kmLivres == null) return null;
  return Math.max(0, distancia * (idaEVolta ? 2 : 1) - kmLivres);
};

export const freteTotal = (e: EntradaFrete): number | null => {
  if (e.modo == null || e.coleta == null) return null;
  let entrega: number | null;
  if (e.modo === "Km") {
    const km = kmCobrados(e.distanciaKm, e.idaEVolta, e.kmLivres);
    entrega = km == null || e.valorKm == null ? null : km * e.valorKm;
  } else {
    entrega = e.area == null || e.valorM2 == null ? null : e.area * e.valorM2;
  }
  if (entrega == null) return null;
  if (!e.coleta) return entrega;
  if (e.valorColeta == null) return null;
  return entrega + e.valorColeta;
};
