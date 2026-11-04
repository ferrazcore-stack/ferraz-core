export type Point2D = Readonly<{ x: number; y: number }>;
export type RectCutout = Readonly<{ x: number; y: number; width: number; height: number }>;
export type CircleCutout = Readonly<{ x: number; y: number; diameter: number }>;
export type PieceProfile = Readonly<{ id: string; name: string; widthMm: number; depthMm: number; thicknessMm: number; rectCutouts?: readonly RectCutout[]; circleCutouts?: readonly CircleCutout[] }>;
export type GeometryIssue = Readonly<{ code: string; message: string }>;
const positive = (n: number) => Number.isFinite(n) && n > 0;

export function validatePiece(p: PieceProfile): GeometryIssue[] {
  const out: GeometryIssue[] = [];
  if (!p.id.trim()) out.push({ code: "piece.id", message: "Identificador obrigatório." });
  if (!p.name.trim()) out.push({ code: "piece.name", message: "Nome obrigatório." });
  for (const [key, value] of [["widthMm", p.widthMm], ["depthMm", p.depthMm], ["thicknessMm", p.thicknessMm]] as const)
    if (!positive(value)) out.push({ code: "dimension." + key, message: key + " deve ser positivo em mm." });
  if (out.length) return out;
  (p.rectCutouts ?? []).forEach((c, i) => {
    if (![c.x,c.y,c.width,c.height].every(Number.isFinite) || !positive(c.width) || !positive(c.height) || c.x < 0 || c.y < 0 || c.x+c.width > p.widthMm || c.y+c.height > p.depthMm)
      out.push({ code: "rect." + i, message: "Recorte retangular fora dos limites ou inválido." });
  });
  (p.circleCutouts ?? []).forEach((c, i) => {
    const r = c.diameter / 2;
    if (![c.x,c.y,c.diameter].every(Number.isFinite) || !positive(c.diameter) || c.x-r < 0 || c.y-r < 0 || c.x+r > p.widthMm || c.y+r > p.depthMm)
      out.push({ code: "circle." + i, message: "Furo circular fora dos limites ou inválido." });
  });
  return out;
}
export function netAreaMm2(p: PieceProfile): number {
  const issues = validatePiece(p);
  if (issues.length) throw new Error(issues.map(x => x.message).join(" "));
  const rect = (p.rectCutouts ?? []).reduce((s,c) => s+c.width*c.height,0);
  const circles = (p.circleCutouts ?? []).reduce((s,c) => s+Math.PI*(c.diameter/2)**2,0);
  const area = p.widthMm*p.depthMm-rect-circles;
  if (area <= 0) throw new Error("Área líquida deve ser positiva.");
  return area;
}
export const areaM2 = (p: PieceProfile) => netAreaMm2(p)/1_000_000;
export const volumeMm3 = (p: PieceProfile) => netAreaMm2(p)*p.thicknessMm;
export function projectToViewport(point: Point2D, pixelsPerMm: number, origin: Point2D = {x:0,y:0}): Point2D {
  if (!positive(pixelsPerMm)) throw new Error("Escala visual inválida.");
  return {x:origin.x+point.x*pixelsPerMm,y:origin.y+point.y*pixelsPerMm};
}
export function paperLengthMm(modelLengthMm: number, denominator=1): number {
  if (!positive(modelLengthMm) || !positive(denominator)) throw new Error("Medida e escala devem ser positivas.");
  return modelLengthMm/denominator;
}
