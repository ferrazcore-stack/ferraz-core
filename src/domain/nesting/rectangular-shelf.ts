export interface NestingSheetSpec {
  id: string;
  widthMm: number;
  heightMm: number;
  marginMm: number;
  kerfMm: number;
  materialId: string;
  thicknessMm: number;
  grainDirection?: "none" | "x" | "y";
}

export interface RectangularNestingPart {
  id: string;
  widthMm: number;
  heightMm: number;
  quantity?: number;
  materialId: string;
  thicknessMm: number;
  allowRotation?: boolean;
}

export interface NestingPlacement {
  partId: string;
  instance: number;
  sheetId: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  rotated: boolean;
}

export interface NestingResult {
  placements: NestingPlacement[];
  unplaced: Array<{ partId: string; instance: number; reason: string }>;
  sheetsUsed: Array<{ id: string; materialId: string; thicknessMm: number; widthMm: number; heightMm: number }>;
  usedAreaMm2: number;
  totalSheetAreaMm2: number;
  utilizationPercent: number;
  algorithm: "deterministic-shelf-v1";
}

interface Shelf {
  yMm: number;
  heightMm: number;
  nextXmm: number;
}

interface WorkingSheet {
  spec: NestingSheetSpec;
  shelves: Shelf[];
  nextYmm: number;
}

interface ExpandedPart {
  id: string;
  instance: number;
  widthMm: number;
  heightMm: number;
  materialId: string;
  thicknessMm: number;
  allowRotation: boolean;
}

function validPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function fitsOrientation(part: ExpandedPart, sheet: NestingSheetSpec, rotated: boolean) {
  const width = rotated ? part.heightMm : part.widthMm;
  const height = rotated ? part.widthMm : part.heightMm;
  const packedWidth = width + sheet.kerfMm;
  const packedHeight = height + sheet.kerfMm;
  return {
    width,
    height,
    packedWidth,
    packedHeight,
    fitsEmpty: packedWidth <= sheet.widthMm - 2 * sheet.marginMm &&
      packedHeight <= sheet.heightMm - 2 * sheet.marginMm,
  };
}

/**
 * Deterministic shelf-based rectangular nesting for an initial feasibility pass.
 * It does not handle arbitrary polygons, internal cutouts, defects, CNC lead-ins or toolpaths.
 */
export function nestRectangularParts(
  sheetTemplates: NestingSheetSpec[],
  parts: RectangularNestingPart[],
): NestingResult {
  const placements: NestingPlacement[] = [];
  const unplaced: NestingResult["unplaced"] = [];
  const workingSheets: WorkingSheet[] = [];
  const expanded: ExpandedPart[] = [];

  for (const sheet of sheetTemplates) {
    if (!sheet.id || !validPositive(sheet.widthMm) || !validPositive(sheet.heightMm) ||
        !Number.isFinite(sheet.marginMm) || sheet.marginMm < 0 ||
        !Number.isFinite(sheet.kerfMm) || sheet.kerfMm < 0 ||
        !validPositive(sheet.thicknessMm) || !sheet.materialId ||
        sheet.widthMm <= 2 * sheet.marginMm || sheet.heightMm <= 2 * sheet.marginMm) {
      throw new Error("Parâmetros de chapa inválidos: " + (sheet.id || "sem ID"));
    }
  }

  for (const part of parts) {
    if (!part.id || !validPositive(part.widthMm) || !validPositive(part.heightMm) ||
        !validPositive(part.thicknessMm) || !part.materialId ||
        !Number.isInteger(part.quantity ?? 1) || (part.quantity ?? 1) < 1) {
      throw new Error("Parâmetros de peça retangular inválidos: " + (part.id || "sem ID"));
    }
    for (let instance = 1; instance <= (part.quantity ?? 1); instance += 1) {
      expanded.push({
        id: part.id,
        instance,
        widthMm: part.widthMm,
        heightMm: part.heightMm,
        materialId: part.materialId,
        thicknessMm: part.thicknessMm,
        allowRotation: part.allowRotation ?? false,
      });
    }
  }

  expanded.sort((a, b) =>
    Math.max(b.widthMm, b.heightMm) - Math.max(a.widthMm, a.heightMm) ||
    b.widthMm * b.heightMm - a.widthMm * a.heightMm ||
    a.id.localeCompare(b.id) || a.instance - b.instance
  );

  for (const part of expanded) {
    const compatibleTemplates = sheetTemplates.filter(sheet =>
      sheet.materialId === part.materialId && Math.abs(sheet.thicknessMm - part.thicknessMm) <= 0.01
    );
    if (!compatibleTemplates.length) {
      unplaced.push({ partId: part.id, instance: part.instance, reason: "Não existe chapa cadastrada para o material e espessura da peça." });
      continue;
    }

    const matchingSheets = workingSheets
      .map((sheet, index) => ({ sheet, index }))
      .filter(({ sheet }) => sheet.spec.materialId === part.materialId &&
        Math.abs(sheet.spec.thicknessMm - part.thicknessMm) <= 0.01);

    const shelfCandidates: Array<{
      sheet: WorkingSheet; sheetIndex: number; shelf: Shelf; rotated: boolean;
      width: number; height: number; packedWidth: number; remainingWidth: number; remainingHeight: number;
    }> = [];

    for (const { sheet, index } of matchingSheets) {
      const orientations = [false, ...(part.allowRotation && (sheet.spec.grainDirection ?? "none") === "none" ? [true] : [])];
      for (const rotated of orientations) {
        const size = fitsOrientation(part, sheet.spec, rotated);
        if (!size.fitsEmpty) continue;
        for (const shelf of sheet.shelves) {
          if (size.packedHeight <= shelf.heightMm && shelf.nextXmm + size.packedWidth <= sheet.spec.widthMm - sheet.spec.marginMm) {
            shelfCandidates.push({
              sheet, sheetIndex: index, shelf, rotated, width: size.width, height: size.height,
              packedWidth: size.packedWidth,
              remainingWidth: sheet.spec.widthMm - sheet.spec.marginMm - shelf.nextXmm - size.packedWidth,
              remainingHeight: shelf.heightMm - size.packedHeight,
            });
          }
        }
      }
    }

    shelfCandidates.sort((a, b) =>
      a.remainingWidth - b.remainingWidth ||
      a.remainingHeight - b.remainingHeight ||
      a.sheetIndex - b.sheetIndex ||
      Number(a.rotated) - Number(b.rotated)
    );

    if (shelfCandidates.length) {
      const chosen = shelfCandidates[0];
      placements.push({
        partId: part.id, instance: part.instance, sheetId: chosen.sheet.spec.id,
        xMm: chosen.shelf.nextXmm, yMm: chosen.shelf.yMm,
        widthMm: chosen.width, heightMm: chosen.height, rotated: chosen.rotated,
      });
      chosen.shelf.nextXmm += chosen.packedWidth;
      continue;
    }

    const newShelfCandidates: Array<{
      sheet: WorkingSheet; sheetIndex: number; rotated: boolean;
      width: number; height: number; packedWidth: number; packedHeight: number; remainingHeight: number;
    }> = [];

    for (const { sheet, index } of matchingSheets) {
      const orientations = [false, ...(part.allowRotation && (sheet.spec.grainDirection ?? "none") === "none" ? [true] : [])];
      for (const rotated of orientations) {
        const size = fitsOrientation(part, sheet.spec, rotated);
        if (!size.fitsEmpty) continue;
        const y = sheet.nextYmm;
        if (y + size.packedHeight <= sheet.spec.heightMm - sheet.spec.marginMm) {
          newShelfCandidates.push({
            sheet, sheetIndex: index, rotated, width: size.width, height: size.height,
            packedWidth: size.packedWidth, packedHeight: size.packedHeight,
            remainingHeight: sheet.spec.heightMm - sheet.spec.marginMm - y - size.packedHeight,
          });
        }
      }
    }

    newShelfCandidates.sort((a, b) =>
      a.remainingHeight - b.remainingHeight ||
      a.sheetIndex - b.sheetIndex ||
      Number(a.rotated) - Number(b.rotated)
    );

    let target: WorkingSheet;
    let targetIndex: number;
    let chosenRotation: boolean;
    let chosenWidth: number;
    let chosenHeight: number;
    let packedWidth: number;
    let packedHeight: number;

    if (newShelfCandidates.length) {
      const chosen = newShelfCandidates[0];
      target = chosen.sheet;
      targetIndex = chosen.sheetIndex;
      chosenRotation = chosen.rotated;
      chosenWidth = chosen.width;
      chosenHeight = chosen.height;
      packedWidth = chosen.packedWidth;
      packedHeight = chosen.packedHeight;
    } else {
      const template = compatibleTemplates[0];
      const orientations = [false, ...(part.allowRotation && (template.grainDirection ?? "none") === "none" ? [true] : [])];
      const valid = orientations.map(rotated => ({ rotated, size: fitsOrientation(part, template, rotated) }))
        .filter(item => item.size.fitsEmpty)
        .sort((a, b) => a.size.packedHeight - b.size.packedHeight || Number(a.rotated) - Number(b.rotated));
      if (!valid.length) {
        unplaced.push({ partId: part.id, instance: part.instance, reason: "Peça não cabe na área útil da chapa, mesmo sem outras peças." });
        continue;
      }
      const chosen = valid[0];
      const suffix = workingSheets.filter(sheet => sheet.spec.id.startsWith(template.id + "-auto-")).length + 1;
      const newSheet: WorkingSheet = {
        spec: { ...template, id: template.id + "-auto-" + suffix },
        shelves: [],
        nextYmm: template.marginMm,
      };
      workingSheets.push(newSheet);
      target = newSheet;
      targetIndex = workingSheets.length - 1;
      chosenRotation = chosen.rotated;
      chosenWidth = chosen.size.width;
      chosenHeight = chosen.size.height;
      packedWidth = chosen.size.packedWidth;
      packedHeight = chosen.size.packedHeight;
    }

    const shelf: Shelf = { yMm: target.nextYmm, heightMm: packedHeight, nextXmm: target.spec.marginMm + packedWidth };
    target.shelves.push(shelf);
    target.nextYmm += packedHeight;
    placements.push({
      partId: part.id, instance: part.instance, sheetId: target.spec.id,
      xMm: target.spec.marginMm, yMm: shelf.yMm,
      widthMm: chosenWidth, heightMm: chosenHeight, rotated: chosenRotation,
    });
  }

  const usedSheetSpecs = workingSheets.map(sheet => sheet.spec);
  const usedAreaMm2 = placements.reduce((sum, item) => sum + item.widthMm * item.heightMm, 0);
  const totalSheetAreaMm2 = usedSheetSpecs.reduce((sum, sheet) => sum + sheet.widthMm * sheet.heightMm, 0);
  return {
    placements,
    unplaced,
    sheetsUsed: usedSheetSpecs.map(({ id, materialId, thicknessMm, widthMm, heightMm }) => ({ id, materialId, thicknessMm, widthMm, heightMm })),
    usedAreaMm2,
    totalSheetAreaMm2,
    utilizationPercent: totalSheetAreaMm2 ? Number((usedAreaMm2 / totalSheetAreaMm2 * 100).toFixed(2)) : 0,
    algorithm: "deterministic-shelf-v1",
  };
}
