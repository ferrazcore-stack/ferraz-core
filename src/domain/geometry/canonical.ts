export type LengthUnit = "mm";
export type MeasurementState = "extracted" | "inferred" | "edited" | "confirmed";
export type ApprovalState = "pending" | "approved" | "rejected";

export interface Point2D {
  x: number;
  y: number;
}

export interface LinearRing {
  /** Piece-local coordinates in millimeters. The first point is not repeated at the end. */
  points: Point2D[];
}

export interface CanonicalPieceGeometry {
  schemaVersion: 1;
  units: LengthUnit;
  coordinateSystem: "piece-local";
  toleranceMm: number;
  outer: LinearRing;
  holes: LinearRing[];
  thicknessMm: number;
}

export interface Measurement {
  name: string;
  value: number;
  unit: LengthUnit;
  state: MeasurementState;
  source: string;
  method: "manual" | "drawing" | "image" | "calculation" | "import";
  toleranceMm?: number;
  confirmedBy?: string;
  confirmedAt?: string;
}

export interface PieceApproval {
  state: ApprovalState;
  approvedBy?: string;
  approvedAt?: string;
  note?: string;
}

export interface PieceRevision {
  revision: number;
  geometry: CanonicalPieceGeometry;
  measurements: Measurement[];
  materialId?: string;
  materialName?: string;
  approval: PieceApproval;
}

export interface CanonicalPiece {
  id: string;
  projectId: string;
  environmentId: string;
  name: string;
  revisions: PieceRevision[];
  currentRevision: number;
}

export interface GeometryIssue {
  code: string;
  message: string;
  path: string;
}

export interface GeometryValidation {
  valid: boolean;
  issues: GeometryIssue[];
  areaMm2: number;
}

export interface FabricationGate {
  allowed: boolean;
  blockers: string[];
}

export function signedArea(ring: LinearRing): number {
  const points = ring.points;
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    sum += current.x * next.y - next.x * current.y;
  }
  return sum / 2;
}

export function polygonAreaMm2(geometry: CanonicalPieceGeometry): number {
  const outer = Math.abs(signedArea(geometry.outer));
  const holes = geometry.holes.reduce((sum, hole) => sum + Math.abs(signedArea(hole)), 0);
  return Math.max(0, outer - holes);
}

function samePoint(a: Point2D, b: Point2D, tolerance: number): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) <= tolerance;
}

function orientation(a: Point2D, b: Point2D, c: Point2D): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function onSegment(a: Point2D, b: Point2D, p: Point2D, tolerance: number): boolean {
  return Math.abs(orientation(a, b, p)) <= tolerance &&
    p.x >= Math.min(a.x, b.x) - tolerance && p.x <= Math.max(a.x, b.x) + tolerance &&
    p.y >= Math.min(a.y, b.y) - tolerance && p.y <= Math.max(a.y, b.y) + tolerance;
}

function segmentsIntersect(a: Point2D, b: Point2D, c: Point2D, d: Point2D, tolerance: number): boolean {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  if (((o1 > tolerance && o2 < -tolerance) || (o1 < -tolerance && o2 > tolerance)) &&
      ((o3 > tolerance && o4 < -tolerance) || (o3 < -tolerance && o4 > tolerance))) return true;
  return onSegment(a, b, c, tolerance) || onSegment(a, b, d, tolerance) ||
    onSegment(c, d, a, tolerance) || onSegment(c, d, b, tolerance);
}

function ringSelfIntersects(ring: LinearRing, tolerance: number): boolean {
  const p = ring.points;
  for (let i = 0; i < p.length; i += 1) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    for (let j = i + 1; j < p.length; j += 1) {
      const adjacent = j === i || j === i + 1 || (i === 0 && j === p.length - 1);
      if (adjacent) continue;
      const c = p[j];
      const d = p[(j + 1) % p.length];
      if (segmentsIntersect(a, b, c, d, tolerance)) return true;
    }
  }
  return false;
}

function pointInRing(point: Point2D, ring: LinearRing): boolean {
  let inside = false;
  const p = ring.points;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const a = p[i];
    const b = p[j];
    const crosses = ((a.y > point.y) !== (b.y > point.y)) &&
      (point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x);
    if (crosses) inside = !inside;
  }
  return inside;
}

function validateRing(ring: LinearRing, path: string, tolerance: number, issues: GeometryIssue[]): void {
  if (!ring || !Array.isArray(ring.points) || ring.points.length < 3) {
    issues.push({ code: "RING_TOO_SMALL", message: "O contorno precisa ter pelo menos três vértices.", path });
    return;
  }
  ring.points.forEach((point, index) => {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      issues.push({ code: "NON_FINITE_COORDINATE", message: "Coordenada inválida ou não finita.", path: path + ".points[" + index + "]" });
    }
  });
  for (let i = 0; i < ring.points.length; i += 1) {
    const next = ring.points[(i + 1) % ring.points.length];
    if (samePoint(ring.points[i], next, tolerance)) {
      issues.push({ code: "DUPLICATE_VERTEX", message: "Há vértices consecutivos duplicados ou próximos demais.", path: path + ".points[" + i + "]" });
    }
  }
  if (ringSelfIntersects(ring, tolerance)) {
    issues.push({ code: "SELF_INTERSECTION", message: "O contorno possui cruzamento entre segmentos.", path });
  }
  if (Math.abs(signedArea(ring)) <= tolerance * tolerance) {
    issues.push({ code: "ZERO_AREA", message: "O contorno não possui área válida dentro da tolerância definida.", path });
  }
}

export function validateGeometry(geometry: CanonicalPieceGeometry): GeometryValidation {
  const issues: GeometryIssue[] = [];
  if (geometry.schemaVersion !== 1) issues.push({ code: "UNSUPPORTED_SCHEMA", message: "Versão de geometria não suportada.", path: "schemaVersion" });
  if (geometry.units !== "mm") issues.push({ code: "INVALID_UNIT", message: "A unidade canônica deve ser milímetro.", path: "units" });
  if (geometry.coordinateSystem !== "piece-local") issues.push({ code: "INVALID_COORDINATE_SYSTEM", message: "O sistema de coordenadas deve ser local à peça.", path: "coordinateSystem" });
  if (!Number.isFinite(geometry.toleranceMm) || geometry.toleranceMm <= 0) issues.push({ code: "INVALID_TOLERANCE", message: "A tolerância deve ser positiva e finita.", path: "toleranceMm" });
  if (!Number.isFinite(geometry.thicknessMm) || geometry.thicknessMm <= 0) issues.push({ code: "INVALID_THICKNESS", message: "A espessura deve ser positiva e finita.", path: "thicknessMm" });
  const tolerance = Number.isFinite(geometry.toleranceMm) && geometry.toleranceMm > 0 ? geometry.toleranceMm : 0.01;
  validateRing(geometry.outer, "outer", tolerance, issues);
  geometry.holes.forEach((hole, index) => {
    validateRing(hole, "holes[" + index + "]", tolerance, issues);
    if (hole.points.length && geometry.outer.points.length >= 3) {
      const anyPointOutside = hole.points.some(point => !pointInRing(point, geometry.outer));
      const crossesOuter = hole.points.some((point, edgeIndex) => {
        const nextHolePoint = hole.points[(edgeIndex + 1) % hole.points.length];
        return geometry.outer.points.some((outerPoint, outerIndex) =>
          segmentsIntersect(point, nextHolePoint, outerPoint, geometry.outer.points[(outerIndex + 1) % geometry.outer.points.length], tolerance)
        );
      });
      if (anyPointOutside || crossesOuter) {
        issues.push({ code: "HOLE_OUTSIDE_OUTER", message: "Todo o contorno interno precisa estar dentro do contorno externo e não pode cruzar sua borda.", path: "holes[" + index + "]" });
      }
    }
  });
  for (let i = 0; i < geometry.holes.length; i += 1) {
    for (let j = i + 1; j < geometry.holes.length; j += 1) {
      const first = geometry.holes[i];
      const second = geometry.holes[j];
      const nested = first.points.some(point => pointInRing(point, second)) || second.points.some(point => pointInRing(point, first));
      const crossing = first.points.some((point, edgeIndex) => {
        const nextFirst = first.points[(edgeIndex + 1) % first.points.length];
        return second.points.some((otherPoint, otherIndex) =>
          segmentsIntersect(point, nextFirst, otherPoint, second.points[(otherIndex + 1) % second.points.length], tolerance)
        );
      });
      if (nested || crossing) {
        issues.push({ code: "HOLES_OVERLAP", message: "Contornos internos não podem se sobrepor ou cruzar.", path: "holes[" + i + "]" });
      }
    }
  }
  return { valid: issues.length === 0, issues, areaMm2: polygonAreaMm2(geometry) };
}

export function validateMeasurements(measurements: Measurement[]): string[] {
  const issues: string[] = [];
  if (!measurements.length) issues.push("Nenhuma medida foi registrada.");
  measurements.forEach((measurement, index) => {
    if (!Number.isFinite(measurement.value) || measurement.value <= 0) issues.push("Medida " + (index + 1) + " deve ser positiva e finita.");
    if (measurement.unit !== "mm") issues.push("Medida " + (index + 1) + " não está em milímetros.");
    if (!measurement.source.trim()) issues.push("Medida " + (index + 1) + " precisa registrar sua origem.");
    if (measurement.state !== "confirmed") issues.push("Medida " + (index + 1) + " ainda não foi confirmada por uma pessoa.");
    if (measurement.state === "confirmed" && (!measurement.confirmedBy || !measurement.confirmedAt)) issues.push("Medida " + (index + 1) + " confirmada precisa identificar responsável e data.");
  });
  return issues;
}

export function evaluateFabricationGate(revision: PieceRevision): FabricationGate {
  const blockers = validateGeometry(revision.geometry).issues.map(issue => issue.message);
  blockers.push(...validateMeasurements(revision.measurements));
  if (!revision.materialId || !revision.materialName) blockers.push("Material precisa estar identificado.");
  if (revision.approval.state !== "approved") blockers.push("A revisão técnica ainda não foi aprovada.");
  if (revision.approval.state === "approved" && (!revision.approval.approvedBy || !revision.approval.approvedAt)) {
    blockers.push("A aprovação precisa identificar responsável e data.");
  }
  return { allowed: blockers.length === 0, blockers };
}
