export interface PolygonPoint {
  x: number;
  y: number;
}

export interface PolygonDefect {
  id: string;
  outer: PolygonPoint[];
}

export interface PolygonNestingSheet {
  id: string;
  widthMm: number;
  heightMm: number;
  marginMm: number;
  kerfMm: number;
  materialId: string;
  thicknessMm: number;
  /** Number of physical slabs available from this stock template. Defaults to one. */
  quantity?: number;
  /** When true, only the unrotated part orientation is considered until a grain map is supplied. */
  grainDirection?: "none" | "x" | "y";
  defects?: PolygonDefect[];
}

export interface PolygonNestingPart {
  id: string;
  outer: PolygonPoint[];
  holes?: PolygonPoint[][];
  quantity?: number;
  materialId: string;
  thicknessMm: number;
  /** Explicitly permitted quarter-turn rotations. Defaults to [0]. */
  allowedRotationsDeg?: Array<0 | 90 | 180 | 270>;
}

export interface PolygonPlacement {
  partId: string;
  instance: number;
  sheetId: string;
  xMm: number;
  yMm: number;
  rotationDeg: 0 | 90 | 180 | 270;
  outer: PolygonPoint[];
  holes: PolygonPoint[][];
  areaMm2: number;
}

export type PolygonNestingStrategy = "area-desc" | "max-side-desc" | "perimeter-desc";

export interface PolygonNestingResult {
  algorithm: "deterministic-polygon-bottom-left-v1" | "deterministic-polygon-multi-start-v1";
  strategy: PolygonNestingStrategy;
  status: "estimate-only";
  placements: PolygonPlacement[];
  unplaced: Array<{ partId: string; instance: number; reason: string }>;
  sheetsUsed: Array<{
    id: string;
    templateId: string;
    widthMm: number;
    heightMm: number;
    marginMm: number;
    defects: PolygonDefect[];
  }>;
  placedAreaMm2: number;
  grossSheetAreaMm2: number;
  utilizationPercent: number;
  warnings: string[];
}

interface ExpandedPart extends PolygonNestingPart {
  instance: number;
}

interface Obstacle {
  outer: PolygonPoint[];
  holes?: PolygonPoint[][];
}

const EPS = 1e-7;
const ROTATIONS = [0, 90, 180, 270] as const;

function signedArea(ring: PolygonPoint[]): number {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

function areaOf(outer: PolygonPoint[], holes: PolygonPoint[][] = []): number {
  return Math.max(0, Math.abs(signedArea(outer)) -
    holes.reduce((sum, hole) => sum + Math.abs(signedArea(hole)), 0));
}

function boundingWidth(ring: PolygonPoint[]): number {
  return Math.max(...ring.map(point => point.x)) - Math.min(...ring.map(point => point.x));
}

function boundingHeight(ring: PolygonPoint[]): number {
  return Math.max(...ring.map(point => point.y)) - Math.min(...ring.map(point => point.y));
}

function ringPerimeter(ring: PolygonPoint[]): number {
  return ring.reduce((sum, point, index) => {
    const next = ring[(index + 1) % ring.length];
    return sum + Math.hypot(next.x - point.x, next.y - point.y);
  }, 0);
}

function cross(a: PolygonPoint, b: PolygonPoint, c: PolygonPoint): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function onSegment(a: PolygonPoint, b: PolygonPoint, p: PolygonPoint): boolean {
  return Math.abs(cross(a, b, p)) <= EPS &&
    p.x >= Math.min(a.x, b.x) - EPS && p.x <= Math.max(a.x, b.x) + EPS &&
    p.y >= Math.min(a.y, b.y) - EPS && p.y <= Math.max(a.y, b.y) + EPS;
}

function segmentsIntersect(a: PolygonPoint, b: PolygonPoint, c: PolygonPoint, d: PolygonPoint): boolean {
  const abC = cross(a, b, c), abD = cross(a, b, d);
  const cdA = cross(c, d, a), cdB = cross(c, d, b);
  if (((abC > EPS && abD < -EPS) || (abC < -EPS && abD > EPS)) &&
      ((cdA > EPS && cdB < -EPS) || (cdA < -EPS && cdB > EPS))) return true;
  return onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b);
}

function pointInRing(point: PolygonPoint, ring: PolygonPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if (onSegment(a, b, point)) return true;
    if ((a.y > point.y) !== (b.y > point.y) &&
        point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function pointInSolid(point: PolygonPoint, obstacle: Obstacle): boolean {
  return pointInRing(point, obstacle.outer) &&
    !(obstacle.holes ?? []).some(hole => pointInRing(point, hole));
}

function ringsIntersect(a: PolygonPoint[], b: PolygonPoint[]): boolean {
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      if (segmentsIntersect(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true;
    }
  }
  return false;
}

function boundaries(obstacle: Obstacle): PolygonPoint[][] {
  return [obstacle.outer, ...(obstacle.holes ?? [])];
}

function regionsOverlap(a: Obstacle, b: Obstacle): boolean {
  for (const ringA of boundaries(a)) {
    for (const ringB of boundaries(b)) if (ringsIntersect(ringA, ringB)) return true;
  }
  if (a.outer.some(point => pointInSolid(point, b))) return true;
  if (b.outer.some(point => pointInSolid(point, a))) return true;
  return false;
}

function pointSegmentDistance(p: PolygonPoint, a: PolygonPoint, b: PolygonPoint): number {
  const dx = b.x - a.x, dy = b.y - a.y;
  const length2 = dx * dx + dy * dy;
  if (length2 <= EPS) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / length2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function segmentDistance(a: PolygonPoint, b: PolygonPoint, c: PolygonPoint, d: PolygonPoint): number {
  if (segmentsIntersect(a, b, c, d)) return 0;
  return Math.min(
    pointSegmentDistance(a, c, d), pointSegmentDistance(b, c, d),
    pointSegmentDistance(c, a, b), pointSegmentDistance(d, a, b),
  );
}

function boundaryDistance(a: Obstacle, b: Obstacle): number {
  let minimum = Number.POSITIVE_INFINITY;
  for (const ringA of boundaries(a)) {
    for (const ringB of boundaries(b)) {
      for (let i = 0; i < ringA.length; i += 1) {
        for (let j = 0; j < ringB.length; j += 1) {
          minimum = Math.min(minimum, segmentDistance(
            ringA[i], ringA[(i + 1) % ringA.length],
            ringB[j], ringB[(j + 1) % ringB.length],
          ));
          if (minimum <= EPS) return 0;
        }
      }
    }
  }
  return minimum;
}

function validRing(ring: PolygonPoint[]): boolean {
  if (!Array.isArray(ring) || ring.length < 3 ||
      ring.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y)) ||
      Math.abs(signedArea(ring)) <= EPS) return false;
  for (let i = 0; i < ring.length; i += 1) {
    for (let j = i + 1; j < ring.length; j += 1) {
      if (j === i + 1 || (i === 0 && j === ring.length - 1)) continue;
      if (segmentsIntersect(ring[i], ring[(i + 1) % ring.length], ring[j], ring[(j + 1) % ring.length])) return false;
    }
  }
  return true;
}

function rotate(point: PolygonPoint, degrees: number): PolygonPoint {
  if (degrees === 0) return { ...point };
  if (degrees === 90) return { x: -point.y, y: point.x };
  if (degrees === 180) return { x: -point.x, y: -point.y };
  return { x: point.y, y: -point.x };
}

function normalizeRings(part: PolygonNestingPart, degrees: number) {
  const outer = part.outer.map(point => rotate(point, degrees));
  const holes = (part.holes ?? []).map(ring => ring.map(point => rotate(point, degrees)));
  const minX = Math.min(...outer.map(p => p.x));
  const minY = Math.min(...outer.map(p => p.y));
  const shift = (ring: PolygonPoint[]) => ring.map(p => ({ x: p.x - minX, y: p.y - minY }));
  return { outer: shift(outer), holes: holes.map(shift) };
}

function translate(ring: PolygonPoint[], x: number, y: number): PolygonPoint[] {
  return ring.map(point => ({ x: point.x + x, y: point.y + y }));
}

function obstaclePoints(obstacle: Obstacle): PolygonPoint[] {
  return boundaries(obstacle).flat();
}

function fitsSheet(candidate: Obstacle, sheet: PolygonNestingSheet): boolean {
  return candidate.outer.every(point =>
    point.x >= sheet.marginMm - EPS && point.y >= sheet.marginMm - EPS &&
    point.x <= sheet.widthMm - sheet.marginMm + EPS &&
    point.y <= sheet.heightMm - sheet.marginMm + EPS
  );
}

function collides(candidate: Obstacle, obstacles: Obstacle[], kerf: number): boolean {
  return obstacles.some(obstacle =>
    regionsOverlap(candidate, obstacle) || boundaryDistance(candidate, obstacle) + EPS < kerf
  );
}

function candidateOffsets(
  rings: PolygonPoint[][],
  obstacles: Obstacle[],
  margin: number,
  kerf: number,
): { xs: number[]; ys: number[] } {
  const xs = new Set<number>([margin - Math.min(...rings[0].map(p => p.x))]);
  const ys = new Set<number>([margin - Math.min(...rings[0].map(p => p.y))]);
  const partPoints = rings.flat();
  for (const obstacle of obstacles) {
    for (const obstaclePoint of obstaclePoints(obstacle)) {
      for (const partPoint of partPoints) {
        for (const gap of [-kerf, 0, kerf]) {
          xs.add(obstaclePoint.x - partPoint.x + gap);
          ys.add(obstaclePoint.y - partPoint.y + gap);
        }
      }
    }
  }
  return {
    xs: [...xs].filter(Number.isFinite).sort((a, b) => a - b),
    ys: [...ys].filter(Number.isFinite).sort((a, b) => a - b),
  };
}

/**
 * Deterministic bottom-left heuristic for polygonal parts with holes and sheet defects.
 * Candidate coordinates come from vertex alignments; this is not a global optimum proof.
 */
export function nestPolygonParts(
  sheetTemplates: PolygonNestingSheet[],
  parts: PolygonNestingPart[],
  options: { strategy?: PolygonNestingStrategy } = {},
): PolygonNestingResult {
  const strategy = options.strategy ?? "area-desc";
  const placements: PolygonPlacement[] = [];
  const unplaced: PolygonNestingResult["unplaced"] = [];
  const sheets: Array<{ spec: PolygonNestingSheet; templateId: string; obstacles: Obstacle[] }> = [];
  const templateIds = new Set<string>();
  const partIds = new Set<string>();

  for (const sheet of sheetTemplates) {
    if (!sheet.id || templateIds.has(sheet.id) ||
        !Number.isFinite(sheet.widthMm) || sheet.widthMm <= 0 ||
        !Number.isFinite(sheet.heightMm) || sheet.heightMm <= 0 ||
        !Number.isFinite(sheet.marginMm) || sheet.marginMm < 0 ||
        !Number.isFinite(sheet.kerfMm) || sheet.kerfMm < 0 ||
        !Number.isFinite(sheet.thicknessMm) || sheet.thicknessMm <= 0 ||
        !Number.isInteger(sheet.quantity ?? 1) || (sheet.quantity ?? 1) < 1 ||
        !sheet.materialId || sheet.widthMm <= 2 * sheet.marginMm ||
        sheet.heightMm <= 2 * sheet.marginMm ||
        !["none", "x", "y"].includes(sheet.grainDirection ?? "none")) {
      throw new Error("Parâmetros inválidos ou ID duplicado de chapa: " + (sheet.id || "sem ID"));
    }
    templateIds.add(sheet.id);
    const defectIds = new Set<string>();
    for (const defect of sheet.defects ?? []) {
      if (!defect.id || defectIds.has(defect.id) || !validRing(defect.outer) ||
          defect.outer.some(point => point.x < 0 || point.y < 0 || point.x > sheet.widthMm || point.y > sheet.heightMm)) {
        throw new Error("Defeito inválido, fora da chapa ou com ID duplicado: " + sheet.id);
      }
      defectIds.add(defect.id);
    }
    for (let instance = 1; instance <= (sheet.quantity ?? 1); instance += 1) {
      const instanceId = (sheet.quantity ?? 1) > 1 ? sheet.id + "-" + instance : sheet.id;
      sheets.push({
        spec: { ...sheet, id: instanceId },
        templateId: sheet.id,
        obstacles: (sheet.defects ?? []).map(defect => ({ outer: defect.outer })),
      });
    }
  }

  const expanded: ExpandedPart[] = [];
  for (const part of parts) {
    if (!part.id || partIds.has(part.id) || !validRing(part.outer) ||
        !Number.isFinite(part.thicknessMm) || part.thicknessMm <= 0 || !part.materialId ||
        !Number.isInteger(part.quantity ?? 1) || (part.quantity ?? 1) < 1) {
      throw new Error("Peça poligonal inválida ou ID duplicado: " + (part.id || "sem ID"));
    }
    partIds.add(part.id);
    const partHoles = part.holes ?? [];
    for (let holeIndex = 0; holeIndex < partHoles.length; holeIndex += 1) {
      const hole = partHoles[holeIndex];
      if (!validRing(hole) || !hole.every(point => pointInRing(point, part.outer)) ||
          ringsIntersect(hole, part.outer)) {
        throw new Error("Furo inválido ou fora do contorno externo da peça: " + part.id);
      }
      for (let otherIndex = holeIndex + 1; otherIndex < partHoles.length; otherIndex += 1) {
        const other = partHoles[otherIndex];
        if (ringsIntersect(hole, other) || hole.some(point => pointInRing(point, other)) ||
            other.some(point => pointInRing(point, hole))) {
          throw new Error("Furos sobrepostos ou aninhados não são aceitos: " + part.id);
        }
      }
    }
    for (let instance = 1; instance <= (part.quantity ?? 1); instance += 1) expanded.push({ ...part, instance });
  }

  expanded.sort((a, b) => {
    const areaOrder = areaOf(b.outer, b.holes) - areaOf(a.outer, a.holes);
    const maxSideOrder = Math.max(boundingWidth(b.outer), boundingHeight(b.outer)) -
      Math.max(boundingWidth(a.outer), boundingHeight(a.outer));
    const perimeterOrder = ringPerimeter(b.outer) - ringPerimeter(a.outer);
    const primary = strategy === "max-side-desc" ? maxSideOrder
      : strategy === "perimeter-desc" ? perimeterOrder
      : areaOrder;
    return primary || areaOrder || a.id.localeCompare(b.id) || a.instance - b.instance;
  });

  for (const part of expanded) {
    const compatible = sheets.filter(entry => entry.spec.materialId === part.materialId &&
      Math.abs(entry.spec.thicknessMm - part.thicknessMm) <= 0.01);
    if (!compatible.length) {
      unplaced.push({ partId: part.id, instance: part.instance, reason: "Não existe chapa compatível com material e espessura." });
      continue;
    }

    let chosen: { sheet: typeof sheets[number]; x: number; y: number; rotation: typeof ROTATIONS[number]; outer: PolygonPoint[]; holes: PolygonPoint[][] } | undefined;
    const candidateSheets = compatible;
    for (const entry of candidateSheets) {
      const rotations: Array<typeof ROTATIONS[number]> = entry.spec.grainDirection && entry.spec.grainDirection !== "none"
        ? [0]
        : [...new Set(part.allowedRotationsDeg ?? [0])].sort((a, b) => a - b) as Array<typeof ROTATIONS[number]>;
      if (rotations.some(rotation => !ROTATIONS.includes(rotation))) throw new Error("Rotação não suportada: " + part.id);
      for (const rotation of rotations) {
        const normalized = normalizeRings(part, rotation);
        const rings = [normalized.outer, ...normalized.holes];
        const offsets = candidateOffsets(rings, entry.obstacles, entry.spec.marginMm, entry.spec.kerfMm);
        const candidates: Array<{ x: number; y: number }> = [];
        for (const y of offsets.ys) {
          for (const x of offsets.xs) {
            candidates.push({ x, y });
            if (candidates.length >= 25000) break;
          }
          if (candidates.length >= 25000) break;
        }
        for (const offset of candidates) {
          const candidate: Obstacle = {
            outer: translate(normalized.outer, offset.x, offset.y),
            holes: normalized.holes.map(hole => translate(hole, offset.x, offset.y)),
          };
          if (!fitsSheet(candidate, entry.spec) || collides(candidate, entry.obstacles, entry.spec.kerfMm)) continue;
          chosen = { sheet: entry, x: offset.x, y: offset.y, rotation, outer: candidate.outer, holes: candidate.holes ?? [] };
          break;
        }
        if (chosen) break;
      }
      if (chosen) break;
    }

    if (!chosen) {
      unplaced.push({ partId: part.id, instance: part.instance, reason: "Não foi encontrada posição viável pela heurística de alinhamento de vértices." });
      continue;
    }

    const areaMm2 = areaOf(chosen.outer, chosen.holes);
    placements.push({
      partId: part.id, instance: part.instance, sheetId: chosen.sheet.spec.id,
      xMm: chosen.x, yMm: chosen.y, rotationDeg: chosen.rotation,
      outer: chosen.outer, holes: chosen.holes, areaMm2,
    });
    chosen.sheet.obstacles.push({ outer: chosen.outer, holes: chosen.holes });
  }

  const usedSheetIds = [...new Set(placements.map(placement => placement.sheetId))];
  const usedSheets = sheets.filter(entry => usedSheetIds.includes(entry.spec.id));
  const grossSheetAreaMm2 = usedSheets.reduce((sum, entry) => sum +
    entry.spec.widthMm * entry.spec.heightMm, 0);
  const placedAreaMm2 = placements.reduce((sum, placement) => sum + placement.areaMm2, 0);

  return {
    algorithm: "deterministic-polygon-bottom-left-v1",
    strategy,
    status: "estimate-only",
    placements,
    unplaced,
    sheetsUsed: usedSheets.map(entry => ({
      id: entry.spec.id,
      templateId: entry.templateId,
      widthMm: entry.spec.widthMm,
      heightMm: entry.spec.heightMm,
      marginMm: entry.spec.marginMm,
      defects: entry.spec.defects ?? [],
    })),
    placedAreaMm2,
    grossSheetAreaMm2,
    utilizationPercent: grossSheetAreaMm2 ? Number((placedAreaMm2 / grossSheetAreaMm2 * 100).toFixed(2)) : 0,
    warnings: [
      "Heurística determinística por alinhamento de vértices; não garante ótimo global.",
      "Cada orientação avalia no máximo 25.000 posições candidatas; geometrias muito complexas podem exigir busca adicional.",
      "Rotação limitada a 0/90/180/270 graus; com veio declarado, somente orientação 0 é considerada.",
      "Kerf é tratado como distância mínima entre contornos, não como trajetória real de ferramenta.",
      "Defeitos são áreas poligonais proibidas; classificação e medição dos defeitos exigem validação humana.",
      "Não calcula sequência de corte, estabilidade, fixação, lead-in/lead-out ou código CNC.",
      "Resultado estimativo: não libera fabricação.",
    ],
  };
}


/**
 * Runs three deterministic part-ordering heuristics and keeps the best feasible result.
 * The score prioritizes placed piece count, then placed area, then fewer sheets and utilization.
 */
export function optimizePolygonNesting(
  sheetTemplates: PolygonNestingSheet[],
  parts: PolygonNestingPart[],
): PolygonNestingResult {
  const strategies: PolygonNestingStrategy[] = ["area-desc", "max-side-desc", "perimeter-desc"];
  const candidates = strategies.map(strategy => nestPolygonParts(sheetTemplates, parts, { strategy }));
  candidates.sort((a, b) =>
    b.placements.length - a.placements.length ||
    b.placedAreaMm2 - a.placedAreaMm2 ||
    a.sheetsUsed.length - b.sheetsUsed.length ||
    b.utilizationPercent - a.utilizationPercent ||
    strategies.indexOf(a.strategy) - strategies.indexOf(b.strategy)
  );
  const best = candidates[0];
  return {
    ...best,
    algorithm: "deterministic-polygon-multi-start-v1",
    warnings: [
      ...best.warnings,
      "Foram comparadas três ordens determinísticas; a seleção é heurística e não prova ótimo global.",
    ],
  };
}
