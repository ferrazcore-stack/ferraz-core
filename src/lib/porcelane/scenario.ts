import { areaM2, validatePiece, type PieceProfile } from "../cad/geometry";
import { canAdvance, type WorkflowEvidence, type WorkflowStage } from "../operations/workflow";

export type PorcelaneEnvironment = Readonly<{
  id: string;
  name: string;
  pieces: readonly PieceProfile[];
}>;

export type PorcelaneScenario = Readonly<{
  id: string;
  customer: string;
  project: string;
  revision: number;
  material: Readonly<{ code: string; name: string; thicknessMm: number }>;
  environments: readonly PorcelaneEnvironment[];
}>;

/**
 * Fixture sintética para validar o fluxo PORCELANE sem copiar dados reais
 * da planilha para o GitHub. Todas as dimensões estão normalizadas em mm.
 */
export const porcelaneKitchenScenario: PorcelaneScenario = {
  id: "PORC-DEMO-001",
  customer: "Cliente demonstração",
  project: "Cozinha modelo integrada",
  revision: 1,
  material: { code: "QZ-DEMO-20", name: "Quartzo claro (material fictício)", thicknessMm: 20 },
  environments: [{
    id: "ENV-COZ-001",
    name: "Cozinha",
    pieces: [
      {
        id: "PC-BANC-001", name: "Bancada principal",
        widthMm: 2400, depthMm: 650, thicknessMm: 20,
        rectCutouts: [{ x: 900, y: 180, width: 560, height: 400 }],
      },
      {
        id: "PC-ILHA-001", name: "Tampo da ilha",
        widthMm: 1800, depthMm: 900, thicknessMm: 20,
        circleCutouts: [{ x: 900, y: 450, diameter: 120 }],
      },
      {
        id: "PC-RODA-001", name: "Rodabanca",
        widthMm: 2400, depthMm: 100, thicknessMm: 20,
      },
    ],
  }],
};

export type ScenarioCheck = Readonly<{
  valid: boolean;
  pieceCount: number;
  totalNetAreaM2: number;
  issues: readonly string[];
}>;

export function validatePorcelaneScenario(scenario: PorcelaneScenario): ScenarioCheck {
  const issues: string[] = [];
  if (!scenario.id.trim()) issues.push("Identificador do cenário obrigatório.");
  if (!scenario.customer.trim()) issues.push("Cliente obrigatório.");
  if (!scenario.project.trim()) issues.push("Projeto obrigatório.");
  if (!Number.isInteger(scenario.revision) || scenario.revision < 1) issues.push("Revisão deve ser um inteiro positivo.");
  if (!Number.isFinite(scenario.material.thicknessMm) || scenario.material.thicknessMm <= 0)
    issues.push("Espessura do material deve ser positiva.");

  const pieces = scenario.environments.flatMap(environment => environment.pieces);
  if (scenario.environments.length === 0) issues.push("O cenário precisa conter ao menos um ambiente.");
  if (pieces.length === 0) issues.push("O cenário precisa conter ao menos uma peça.");

  let totalNetAreaM2 = 0;
  for (const piece of pieces) {
    const geometryIssues = validatePiece(piece);
    issues.push(...geometryIssues.map(issue => piece.id + ": " + issue.message));
    if (geometryIssues.length === 0) {
      try { totalNetAreaM2 += areaM2(piece); }
      catch (error) { issues.push(piece.id + ": " + (error instanceof Error ? error.message : "Geometria inválida.")); }
    }
  }
  return { valid: issues.length === 0, pieceCount: pieces.length, totalNetAreaM2, issues };
}

export type WorkflowSimulationStep = Readonly<{
  from: WorkflowStage;
  to: WorkflowStage;
  evidence: WorkflowEvidence;
}>;

/** Simula as etapas críticas, incluindo bloqueio deliberado antes do corte. */
export function simulatePorcelaneGates() {
  const approved: WorkflowEvidence = {
    budgetApproved: true,
    orderClosed: true,
    measurementValidated: true,
    technicalReleaseApproved: true,
    drawingApproved: true,
    cutPlanApproved: true,
    materialReserved: true,
    inspectionApproved: true,
    deliveryConfirmed: true,
    installationAccepted: true,
  };
  const blockedCut = canAdvance("cut_plan", "cut", { cutPlanApproved: false, materialReserved: true });
  const allowedCut = canAdvance("cut_plan", "cut", approved);
  const allowedInstallation = canAdvance("delivery", "installation", approved);
  return {
    blockedCut: !blockedCut.allowed && blockedCut.missing.length > 0,
    allowedCut: allowedCut.allowed,
    allowedInstallation: allowedInstallation.allowed,
    issues: blockedCut.missing,
  };
}
