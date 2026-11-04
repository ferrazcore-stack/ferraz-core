import { describe, expect, it } from "vitest";
import { nestPolygonParts, optimizePolygonNesting, type PolygonNestingPart, type PolygonNestingSheet } from "./polygon-bottom-left";

const sheet: PolygonNestingSheet = {
  id: "slab-01", widthMm: 100, heightMm: 80, marginMm: 5, kerfMm: 2,
  materialId: "quartzite-a", thicknessMm: 20,
};

const rectangle = (id: string, width: number, height: number): PolygonNestingPart => ({
  id,
  outer: [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }],
  materialId: "quartzite-a",
  thicknessMm: 20,
});

describe("deterministic polygon nesting v1", () => {
  it("places a non-rectangular concave outline and preserves its polygon", () => {
    const lShape: PolygonNestingPart = {
      id: "l-counter",
      outer: [
        { x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: 10 },
        { x: 10, y: 10 }, { x: 10, y: 40 }, { x: 0, y: 40 },
      ],
      materialId: "quartzite-a", thicknessMm: 20,
    };
    const result = nestPolygonParts([sheet], [lShape]);
    expect(result.placements).toHaveLength(1);
    expect(result.placements[0].outer).toHaveLength(6);
    expect(result.placements[0].areaMm2).toBe(700);
    expect(result.unplaced).toHaveLength(0);
  });

  it("allows a small part inside a sufficiently large internal cutout", () => {
    const frame: PolygonNestingPart = {
      ...rectangle("frame", 40, 40),
      holes: [[
        { x: 10, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 30 }, { x: 10, y: 30 },
      ]],
    };
    const result = nestPolygonParts([sheet], [frame, rectangle("insert", 8, 8)]);
    expect(result.placements).toHaveLength(2);
    expect(result.placements.find(p => p.partId === "frame")?.areaMm2).toBe(1200);
    expect(result.placements.find(p => p.partId === "insert")?.sheetId).toBe("slab-01");
  });

  it("keeps placements clear of declared slab defects", () => {
    const defectSheet: PolygonNestingSheet = {
      ...sheet,
      defects: [{
        id: "crack-zone",
        outer: [{ x: 5, y: 5 }, { x: 95, y: 5 }, { x: 95, y: 75 }, { x: 5, y: 75 }],
      }],
    };
    const result = nestPolygonParts([defectSheet], [rectangle("piece", 20, 20)]);
    expect(result.placements).toHaveLength(0);
    expect(result.unplaced[0].reason).toContain("heurística");
  });

  it("honors permitted quarter-turn rotations when there is no declared grain", () => {
    const narrowSheet = { ...sheet, widthMm: 30, heightMm: 60, marginMm: 0, kerfMm: 0 };
    const part = { ...rectangle("rotatable", 50, 20), allowedRotationsDeg: [0, 90] as Array<0 | 90> };
    const result = nestPolygonParts([narrowSheet], [part]);
    expect(result.placements).toHaveLength(1);
    expect(result.placements[0].rotationDeg).toBe(90);
  });

  it("does not rotate a part when the sheet has a declared grain direction", () => {
    const grained = { ...sheet, widthMm: 30, heightMm: 60, marginMm: 0, kerfMm: 0, grainDirection: "x" as const };
    const part = { ...rectangle("grain-sensitive", 50, 20), allowedRotationsDeg: [0, 90] as Array<0 | 90> };
    const result = nestPolygonParts([grained], [part]);
    expect(result.placements).toHaveLength(0);
    expect(result.unplaced).toHaveLength(1);
  });

  it("keeps the required kerf clearance between separate parts", () => {
    const result = nestPolygonParts([{ ...sheet, widthMm: 43, heightMm: 20, marginMm: 0, kerfMm: 3 }], [
      rectangle("a", 20, 10), rectangle("b", 20, 10),
    ]);
    expect(result.placements).toHaveLength(2);
    const [a, b] = result.placements;
    const horizontalGap = Math.max(a.xMm - (b.xMm + 20), b.xMm - (a.xMm + 20), 0);
    const verticalGap = Math.max(a.yMm - (b.yMm + 10), b.yMm - (a.yMm + 10), 0);
    expect(Math.max(horizontalGap, verticalGap)).toBeGreaterThanOrEqual(3);
  });

  it("rejects overlapping internal holes and defects outside the stock boundary", () => {
    const overlappingHoles: PolygonNestingPart = {
      ...rectangle("bad-holes", 40, 40),
      holes: [
        [{ x: 5, y: 5 }, { x: 20, y: 5 }, { x: 20, y: 20 }, { x: 5, y: 20 }],
        [{ x: 15, y: 15 }, { x: 30, y: 15 }, { x: 30, y: 30 }, { x: 15, y: 30 }],
      ],
    };
    expect(() => nestPolygonParts([sheet], [overlappingHoles])).toThrow(/Furos sobrepostos/);
    expect(() => nestPolygonParts([{
      ...sheet,
      defects: [{ id: "outside", outer: [{ x: 90, y: 10 }, { x: 110, y: 10 }, { x: 110, y: 30 }, { x: 90, y: 30 }] }],
    }], [])).toThrow(/fora da chapa/);
  });

  it("reports material and thickness mismatches as unplaced", () => {
    const result = nestPolygonParts([sheet], [{ ...rectangle("wrong", 10, 10), materialId: "granite-b" }]);
    expect(result.unplaced[0].reason).toContain("material e espessura");
  });

  it("rejects invalid self-intersecting outlines and duplicate identifiers", () => {
    const bowTie: PolygonNestingPart = {
      ...rectangle("bow", 10, 10),
      outer: [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 10, y: 0 }],
    };
    expect(() => nestPolygonParts([sheet], [bowTie])).toThrow(/inválida/);
    expect(() => nestPolygonParts([sheet], [rectangle("same", 5, 5), rectangle("same", 6, 6)])).toThrow(/duplicado/);
  });

  it("compares three deterministic ordering strategies and returns the best feasible result", () => {
    const parts = [
      rectangle("wide", 50, 12),
      rectangle("tall", 12, 50),
      rectangle("square", 20, 20),
      rectangle("small", 8, 8),
    ];
    const result = optimizePolygonNesting([{ ...sheet, widthMm: 100, heightMm: 100 }], parts);
    expect(result.algorithm).toBe("deterministic-polygon-multi-start-v1");
    expect(["area-desc", "max-side-desc", "perimeter-desc"]).toContain(result.strategy);
    expect(result.placements.length + result.unplaced.length).toBe(4);
    expect(result.warnings.some(warning => warning.includes("três ordens"))).toBe(true);
    expect(optimizePolygonNesting([{ ...sheet, widthMm: 100, heightMm: 100 }], parts)).toEqual(result);
  });

  it("returns explicit estimate-only status and stable results", () => {
    const parts = [rectangle("b", 15, 10), rectangle("a", 10, 10)];
    const first = nestPolygonParts([sheet], parts);
    expect(first.status).toBe("estimate-only");
    expect(first.algorithm).toBe("deterministic-polygon-bottom-left-v1");
    expect(nestPolygonParts([sheet], parts)).toEqual(first);
    expect(first.warnings.length).toBeGreaterThan(0);
  });
});
