import { describe, expect, it } from "vitest";
import { nestRectangularParts, type NestingSheetSpec, type RectangularNestingPart } from "./rectangular-shelf";

const sheet: NestingSheetSpec = {
  id: "sheet-01",
  widthMm: 3000,
  heightMm: 1500,
  marginMm: 20,
  kerfMm: 4,
  materialId: "quartzite-a",
  thicknessMm: 20,
  grainDirection: "none",
};

describe("deterministic rectangular nesting v1", () => {
  it("places compatible rectangles within the usable sheet bounds", () => {
    const parts: RectangularNestingPart[] = [
      { id: "p1", widthMm: 1200, heightMm: 600, materialId: "quartzite-a", thicknessMm: 20 },
      { id: "p2", widthMm: 900, heightMm: 500, materialId: "quartzite-a", thicknessMm: 20 },
      { id: "p3", widthMm: 700, heightMm: 400, materialId: "quartzite-a", thicknessMm: 20 },
    ];
    const result = nestRectangularParts([sheet], parts);
    expect(result.placements).toHaveLength(3);
    expect(result.unplaced).toHaveLength(0);
    for (const placement of result.placements) {
      expect(placement.xMm).toBeGreaterThanOrEqual(sheet.marginMm);
      expect(placement.yMm).toBeGreaterThanOrEqual(sheet.marginMm);
      expect(placement.xMm + placement.widthMm + sheet.kerfMm).toBeLessThanOrEqual(sheet.widthMm - sheet.marginMm);
      expect(placement.yMm + placement.heightMm + sheet.kerfMm).toBeLessThanOrEqual(sheet.heightMm - sheet.marginMm);
    }
  });

  it("rotates only when the part allows it and the sheet has no grain direction", () => {
    const narrow: NestingSheetSpec = { ...sheet, id: "narrow", widthMm: 100, heightMm: 200, marginMm: 0, kerfMm: 0 };
    const part: RectangularNestingPart = { id: "long-part", widthMm: 180, heightMm: 80, materialId: "quartzite-a", thicknessMm: 20, allowRotation: true };
    const rotated = nestRectangularParts([narrow], [part]);
    expect(rotated.placements[0].rotated).toBe(true);

    const grained = nestRectangularParts([{ ...narrow, id: "grained", grainDirection: "x" }], [part]);
    expect(grained.placements).toHaveLength(0);
    expect(grained.unplaced).toHaveLength(1);
  });

  it("separates incompatible material or thickness instead of mixing stock", () => {
    const result = nestRectangularParts([sheet], [
      { id: "wrong-material", widthMm: 100, heightMm: 100, materialId: "granite-b", thicknessMm: 20 },
    ]);
    expect(result.placements).toHaveLength(0);
    expect(result.unplaced[0].reason).toMatch(/material e espessura/);
  });

  it("expands quantity into individual traceable placements", () => {
    const result = nestRectangularParts([sheet], [
      { id: "repeat", widthMm: 300, heightMm: 200, quantity: 3, materialId: "quartzite-a", thicknessMm: 20 },
    ]);
    expect(result.placements.map(p => p.instance)).toEqual([1, 2, 3]);
  });

  it("is deterministic for identical inputs", () => {
    const parts = [
      { id: "b", widthMm: 900, heightMm: 600, materialId: "quartzite-a", thicknessMm: 20 },
      { id: "a", widthMm: 700, heightMm: 500, materialId: "quartzite-a", thicknessMm: 20 },
    ];
    expect(nestRectangularParts([sheet], parts)).toEqual(nestRectangularParts([sheet], parts));
  });

  it("returns an explicit estimate-only status, calculation basis and source sheet template", () => {
    const result = nestRectangularParts([sheet], [
      { id: "traceable", widthMm: 300, heightMm: 200, materialId: "quartzite-a", thicknessMm: 20 },
    ]);
    expect(result.status).toBe("estimate-only");
    expect(result.utilizationBasis).toBe("gross-sheet-area");
    expect(result.sheetsUsed[0].templateId).toBe("sheet-01");
    expect(result.sheetsUsed[0].marginMm).toBe(sheet.marginMm);
    expect(result.sheetsUsed[0].kerfMm).toBe(sheet.kerfMm);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("rejects duplicate sheet template IDs and duplicate part IDs", () => {
    expect(() => nestRectangularParts([sheet, sheet], [])).toThrow(/ID duplicado/);
    expect(() => nestRectangularParts([sheet], [
      { id: "duplicate", widthMm: 100, heightMm: 100, materialId: "quartzite-a", thicknessMm: 20 },
      { id: "duplicate", widthMm: 200, heightMm: 100, materialId: "quartzite-a", thicknessMm: 20 },
    ])).toThrow(/ID de peça duplicado/);
  });

  it("reports pieces that cannot fit any compatible sheet", () => {
    const result = nestRectangularParts([sheet], [
      { id: "oversize", widthMm: 4000, heightMm: 500, materialId: "quartzite-a", thicknessMm: 20 },
    ]);
    expect(result.unplaced).toHaveLength(1);
    expect(result.unplaced[0].reason).toMatch(/não cabe/);
  });
});
