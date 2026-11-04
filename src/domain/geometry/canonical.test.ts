import { describe, expect, it } from "vitest";
import {
  evaluateFabricationGate,
  polygonAreaMm2,
  validateGeometry,
  type CanonicalPieceGeometry,
  type Measurement,
  type PieceRevision,
} from "./canonical";

const square: CanonicalPieceGeometry = {
  schemaVersion: 1,
  units: "mm",
  coordinateSystem: "piece-local",
  toleranceMm: 0.01,
  outer: { points: [{ x: 0, y: 0 }, { x: 1000, y: 0 }, { x: 1000, y: 600 }, { x: 0, y: 600 }] },
  holes: [],
  thicknessMm: 20,
};

const confirmedMeasurements: Measurement[] = [
  { name: "length", value: 1000, unit: "mm", state: "confirmed", source: "medição em obra", method: "manual", confirmedBy: "responsavel-tecnico", confirmedAt: "2026-11-04T12:00:00Z" },
  { name: "width", value: 600, unit: "mm", state: "confirmed", source: "medição em obra", method: "manual", confirmedBy: "responsavel-tecnico", confirmedAt: "2026-11-04T12:00:00Z" },
];

const approvedRevision: PieceRevision = {
  revision: 1,
  geometry: square,
  measurements: confirmedMeasurements,
  materialId: "material-01",
  materialName: "Granito de referência",
  approval: { state: "approved", approvedBy: "responsavel-tecnico", approvedAt: "2026-11-04T12:05:00Z" },
};

describe("canonical geometry", () => {
  it("calculates area in square millimeters", () => {
    expect(polygonAreaMm2(square)).toBe(600000);
  });

  it("accepts a valid closed-by-interpretation polygon", () => {
    expect(validateGeometry(square).valid).toBe(true);
  });

  it("rejects self-intersecting outlines", () => {
    const bowTie = { ...square, outer: { points: [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }, { x: 100, y: 0 }] } };
    expect(validateGeometry(bowTie).issues.some(issue => issue.code === "SELF_INTERSECTION")).toBe(true);
  });

  it("rejects a hole outside the outer contour", () => {
    const withOutsideHole = { ...square, holes: [{ points: [{ x: 1200, y: 1200 }, { x: 1300, y: 1200 }, { x: 1300, y: 1300 }, { x: 1200, y: 1300 }] }] };
    expect(validateGeometry(withOutsideHole).issues.some(issue => issue.code === "HOLE_OUTSIDE_OUTER")).toBe(true);
  });

  it("rejects a hole that starts inside but crosses the outer boundary", () => {
    const crossingHole = { ...square, holes: [{ points: [{ x: 800, y: 200 }, { x: 1200, y: 200 }, { x: 1200, y: 400 }, { x: 800, y: 400 }] }] };
    expect(validateGeometry(crossingHole).issues.some(issue => issue.code === "HOLE_OUTSIDE_OUTER")).toBe(true);
  });

  it("rejects overlapping internal contours", () => {
    const overlapping = { ...square, holes: [
      { points: [{ x: 100, y: 100 }, { x: 400, y: 100 }, { x: 400, y: 400 }, { x: 100, y: 400 }] },
      { points: [{ x: 300, y: 200 }, { x: 600, y: 200 }, { x: 600, y: 500 }, { x: 300, y: 500 }] },
    ] };
    expect(validateGeometry(overlapping).issues.some(issue => issue.code === "HOLES_OVERLAP")).toBe(true);
  });

  it("blocks fabrication while a measurement is inferred", () => {
    const revision = { ...approvedRevision, measurements: [{ ...confirmedMeasurements[0], state: "inferred" as const }] };
    const result = evaluateFabricationGate(revision);
    expect(result.allowed).toBe(false);
    expect(result.blockers.some(item => item.includes("não foi confirmada"))).toBe(true);
  });

  it("allows the domain gate only when geometry, measurements, material and approval are valid", () => {
    expect(evaluateFabricationGate(approvedRevision)).toEqual({ allowed: true, blockers: [] });
  });

  it("blocks release when the approval has no accountable person", () => {
    const revision = { ...approvedRevision, approval: { state: "approved" as const } };
    expect(evaluateFabricationGate(revision).allowed).toBe(false);
  });
});
