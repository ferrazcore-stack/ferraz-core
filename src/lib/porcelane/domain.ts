export type RecordId = string;
export type Revision = number;

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type PieceStatus =
  | "draft" | "measured" | "released" | "drawn" | "nested"
  | "cut" | "finished" | "inspected" | "loaded" | "delivered" | "installed";

export type PorcelanePiece = Readonly<{
  id: RecordId;
  environmentId: RecordId;
  code: string;
  description: string;
  revision: Revision;
  widthMm: number;
  depthMm: number;
  thicknessMm: number;
  quantity: number;
  status: PieceStatus;
  measurementApproval: ApprovalStatus;
  technicalApproval: ApprovalStatus;
  drawingApproval: ApprovalStatus;
  cutPlanId: RecordId | null;
  reservedSlabIds: readonly RecordId[];
}>;

export type PorcelaneEnvironment = Readonly<{
  id: RecordId;
  name: string;
  revision: Revision;
  pieces: readonly PorcelanePiece[];
}>;

export type PorcelaneSlab = Readonly<{
  id: RecordId;
  materialCode: string;
  thicknessMm: number;
  widthMm: number;
  lengthMm: number;
  status: "available" | "reserved" | "consumed";
}>;

export type PorcelaneOffcut = Readonly<{
  id: RecordId;
  sourceSlabId: RecordId;
  materialCode: string;
  thicknessMm: number;
  widthMm: number;
  lengthMm: number;
  status: "available" | "reserved" | "consumed";
}>;

export type PorcelaneCutPlan = Readonly<{
  id: RecordId;
  revision: Revision;
  status: ApprovalStatus;
  pieceIds: readonly RecordId[];
  slabIds: readonly RecordId[];
  kerfMm: number;
  edgeMarginMm: number;
  approvedBy: string | null;
}>;

export type PorcelaneOrder = Readonly<{
  id: RecordId;
  code: string;
  customerName: string;
  projectName: string;
  budgetApproval: ApprovalStatus;
  closed: boolean;
  revision: Revision;
  environments: readonly PorcelaneEnvironment[];
  slabs: readonly PorcelaneSlab[];
  offcuts: readonly PorcelaneOffcut[];
  cutPlans: readonly PorcelaneCutPlan[];
}>;

export type GateDecision = Readonly<{ allowed: boolean; blockers: readonly string[] }>;

export function validatePieceRecord(piece: PorcelanePiece): string[] {
  const issues: string[] = [];
  if (!piece.id.trim() || !piece.code.trim()) issues.push("Peça sem identificador ou código.");
  if (!Number.isInteger(piece.revision) || piece.revision < 1) issues.push("Revisão da peça inválida.");
  if (![piece.widthMm, piece.depthMm, piece.thicknessMm, piece.quantity].every(Number.isFinite)
    || piece.widthMm <= 0 || piece.depthMm <= 0 || piece.thicknessMm <= 0 || piece.quantity <= 0)
    issues.push("Dimensões e quantidade devem ser positivas.");
  if (piece.measurementApproval === "approved" && piece.status === "draft")
    issues.push("Peça medida aprovada não deve permanecer em rascunho.");
  return issues;
}

export function canReleasePiece(piece: PorcelanePiece): GateDecision {
  const blockers: string[] = [];
  if (piece.measurementApproval !== "approved") blockers.push("Medição da peça não aprovada.");
  if (piece.technicalApproval !== "approved") blockers.push("Liberação técnica da peça não aprovada.");
  return { allowed: blockers.length === 0, blockers };
}

export function canApproveCutPlan(order: PorcelaneOrder, plan: PorcelaneCutPlan): GateDecision {
  const blockers: string[] = [];
  const pieces = order.environments.flatMap(environment => environment.pieces);
  const selected = plan.pieceIds.map(id => pieces.find(piece => piece.id === id));
  if (plan.status === "rejected") blockers.push("Plano de corte rejeitado.");
  if (plan.pieceIds.length === 0) blockers.push("Plano sem peças.");
  if (selected.some(piece => !piece)) blockers.push("Plano referencia peça inexistente.");
  for (const piece of selected) {
    if (!piece) continue;
    const release = canReleasePiece(piece);
    blockers.push(...release.blockers.map(reason => piece.code + ": " + reason));
    if (piece.drawingApproval !== "approved") blockers.push(piece.code + ": desenho não aprovado.");
  }
  if (plan.slabIds.length === 0) blockers.push("Plano sem chapas reservadas.");
  for (const slabId of plan.slabIds) {
    const slab = order.slabs.find(item => item.id === slabId);
    if (!slab) blockers.push("Chapa " + slabId + " não encontrada.");
    else if (slab.status !== "reserved") blockers.push("Chapa " + slabId + " não está reservada.");
  }
  if (!Number.isFinite(plan.kerfMm) || plan.kerfMm < 0) blockers.push("Kerf inválido.");
  if (!Number.isFinite(plan.edgeMarginMm) || plan.edgeMarginMm < 0) blockers.push("Margem de borda inválida.");
  return { allowed: blockers.length === 0, blockers };
}

export function canStartCut(order: PorcelaneOrder, planId: string): GateDecision {
  const plan = order.cutPlans.find(item => item.id === planId);
  if (!plan) return { allowed: false, blockers: ["Plano de corte não encontrado."] };
  if (plan.status !== "approved") return { allowed: false, blockers: ["Plano de corte ainda não foi aprovado."] };
  return canApproveCutPlan(order, plan);
}

export function canStartProduction(piece: PorcelanePiece): GateDecision {
  const blockers: string[] = [];
  if (piece.status !== "cut") blockers.push("Peça ainda não foi cortada.");
  if (piece.cutPlanId === null) blockers.push("Peça sem vínculo com plano de corte.");
  return { allowed: blockers.length === 0, blockers };
}

export function canLoadPiece(piece: PorcelanePiece): GateDecision {
  return piece.status === "inspected"
    ? { allowed: true, blockers: [] }
    : { allowed: false, blockers: ["Somente peças inspecionadas podem ser carregadas."] };
}

export function canInstallPiece(piece: PorcelanePiece): GateDecision {
  return piece.status === "delivered"
    ? { allowed: true, blockers: [] }
    : { allowed: false, blockers: ["Instalação depende da confirmação de entrega."] };
}

export function validateOrderConsistency(order: PorcelaneOrder): string[] {
  const issues: string[] = [];
  if (!order.id.trim() || !order.code.trim()) issues.push("Pedido sem identificador ou código.");
  if (!Number.isInteger(order.revision) || order.revision < 1) issues.push("Revisão do pedido inválida.");
  if (order.closed && order.budgetApproval !== "approved") issues.push("Pedido fechado sem orçamento aprovado.");
  const environmentIds = new Set(order.environments.map(environment => environment.id));
  const pieceIds = new Set<string>();
  for (const environment of order.environments) {
    if (!environmentIds.has(environment.id)) issues.push("Ambiente sem identificador.");
    for (const piece of environment.pieces) {
      if (pieceIds.has(piece.id)) issues.push("Identificador de peça duplicado: " + piece.id);
      pieceIds.add(piece.id);
      if (piece.environmentId !== environment.id) issues.push(piece.code + ": vínculo de ambiente inconsistente.");
      issues.push(...validatePieceRecord(piece).map(issue => piece.code + ": " + issue));
    }
  }
  for (const plan of order.cutPlans) {
    for (const pieceId of plan.pieceIds) if (!pieceIds.has(pieceId)) issues.push("Plano " + plan.id + " referencia peça inexistente: " + pieceId);
  }
  for (const offcut of order.offcuts) {
    if (!order.slabs.some(slab => slab.id === offcut.sourceSlabId))
      issues.push("Retalho " + offcut.id + " sem chapa de origem.");
    if (offcut.widthMm <= 0 || offcut.lengthMm <= 0 || offcut.thicknessMm <= 0)
      issues.push("Retalho " + offcut.id + " possui dimensões inválidas.");
  }
  return issues;
}
