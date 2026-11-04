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

const unique = (values: readonly string[]) => new Set(values).size === values.length;
const positive = (value: number) => Number.isFinite(value) && value > 0;
const nonNegative = (value: number) => Number.isFinite(value) && value >= 0;

export function validatePieceRecord(piece: PorcelanePiece): string[] {
  const issues: string[] = [];
  if (!piece.id.trim() || !piece.code.trim()) issues.push("Peça sem identificador ou código.");
  if (!piece.environmentId.trim()) issues.push("Peça sem ambiente vinculado.");
  if (!Number.isInteger(piece.revision) || piece.revision < 1) issues.push("Revisão da peça inválida.");
  if (![piece.widthMm, piece.depthMm, piece.thicknessMm, piece.quantity].every(Number.isFinite)
    || !positive(piece.widthMm) || !positive(piece.depthMm) || !positive(piece.thicknessMm)
    || !Number.isInteger(piece.quantity) || piece.quantity < 1)
    issues.push("Dimensões devem ser positivas e quantidade deve ser inteiro positivo.");
  if (piece.measurementApproval === "approved" && piece.status === "draft")
    issues.push("Peça com medição aprovada não deve permanecer em rascunho.");
  if (piece.status !== "draft" && piece.measurementApproval !== "approved")
    issues.push("Peça fora de rascunho exige medição aprovada.");
  if (piece.status === "released" || ["drawn","nested","cut","finished","inspected","loaded","delivered","installed"].includes(piece.status)) {
    if (piece.technicalApproval !== "approved") issues.push("Peça liberada/avançada exige aprovação técnica.");
  }
  if (["drawn","nested","cut","finished","inspected","loaded","delivered","installed"].includes(piece.status)
    && piece.drawingApproval !== "approved") issues.push("Peça avançada exige desenho aprovado.");
  if (!unique(piece.reservedSlabIds) || piece.reservedSlabIds.some(id => !id.trim()))
    issues.push("Vínculos de chapa da peça estão duplicados ou vazios.");
  return issues;
}

export function canReleasePiece(piece: PorcelanePiece): GateDecision {
  const blockers: string[] = [];
  if (piece.measurementApproval !== "approved") blockers.push("Medição da peça não aprovada.");
  if (piece.technicalApproval !== "approved") blockers.push("Liberação técnica da peça não aprovada.");
  if (piece.status === "draft") blockers.push("Peça ainda está em rascunho.");
  return { allowed: blockers.length === 0, blockers };
}

export function canApproveCutPlan(order: PorcelaneOrder, plan: PorcelaneCutPlan): GateDecision {
  const blockers: string[] = [];
  const pieces = order.environments.flatMap(environment => environment.pieces);
  if (!plan.id.trim()) blockers.push("Plano sem identificador.");
  if (!Number.isInteger(plan.revision) || plan.revision < 1) blockers.push("Revisão do plano inválida.");
  if (plan.status === "rejected") blockers.push("Plano de corte rejeitado.");
  if (plan.pieceIds.length === 0) blockers.push("Plano sem peças.");
  if (!unique(plan.pieceIds)) blockers.push("Plano contém peças duplicadas.");
  if (!unique(plan.slabIds)) blockers.push("Plano contém chapas duplicadas.");
  const selected = plan.pieceIds.map(id => pieces.find(piece => piece.id === id));
  if (selected.some(piece => !piece)) blockers.push("Plano referencia peça inexistente.");
  for (const piece of selected) {
    if (!piece) continue;
    if (!canReleasePiece(piece).allowed) blockers.push(piece.code + ": peça não está tecnicamente liberada.");
    if (piece.drawingApproval !== "approved") blockers.push(piece.code + ": desenho não aprovado.");
    if (piece.revision !== plan.revision) blockers.push(piece.code + ": revisão da peça diverge da revisão do plano.");
    if (piece.cutPlanId !== null && piece.cutPlanId !== plan.id)
      blockers.push(piece.code + ": peça já está vinculada a outro plano.");
  }
  if (plan.slabIds.length === 0) blockers.push("Plano sem chapas reservadas.");
  for (const slabId of plan.slabIds) {
    const slab = order.slabs.find(item => item.id === slabId);
    if (!slab) blockers.push("Chapa " + slabId + " não encontrada.");
    else {
      if (slab.status !== "reserved") blockers.push("Chapa " + slabId + " não está reservada.");
      if (selected.some(piece => piece && piece.thicknessMm !== slab.thicknessMm))
        blockers.push("Chapa " + slabId + " possui espessura incompatível com as peças.");
    }
  }
  if (!nonNegative(plan.kerfMm)) blockers.push("Kerf inválido.");
  if (!nonNegative(plan.edgeMarginMm)) blockers.push("Margem de borda inválida.");
  return { allowed: blockers.length === 0, blockers: [...new Set(blockers)] };
}

export function canStartCut(order: PorcelaneOrder, planId: string): GateDecision {
  const plan = order.cutPlans.find(item => item.id === planId);
  if (!plan) return { allowed: false, blockers: ["Plano de corte não encontrado."] };
  if (plan.status !== "approved") return { allowed: false, blockers: ["Plano de corte ainda não foi aprovado."] };
  if (!plan.approvedBy?.trim()) return { allowed: false, blockers: ["Plano aprovado sem responsável registrado."] };
  return canApproveCutPlan(order, plan);
}

export function canStartProduction(piece: PorcelanePiece, order?: PorcelaneOrder): GateDecision {
  const blockers: string[] = [];
  if (piece.status !== "cut") blockers.push("Peça ainda não foi cortada.");
  if (piece.cutPlanId === null) blockers.push("Peça sem vínculo com plano de corte.");
  if (order) {
    const orderPiece = order.environments.flatMap(environment => environment.pieces).find(item => item.id === piece.id);
    if (!orderPiece) blockers.push("Peça não pertence ao pedido informado.");
    else if (orderPiece.environmentId !== piece.environmentId || orderPiece.revision !== piece.revision)
      blockers.push("Dados da peça divergem do registro vinculado ao pedido.");
  }
  if (order && piece.cutPlanId) {
    const plan = order.cutPlans.find(item => item.id === piece.cutPlanId);
    if (!plan || plan.status !== "approved" || !canStartCut(order, plan.id).allowed)
      blockers.push("Plano vinculado não existe, não está aprovado ou perdeu validade.");
    else if (!plan.pieceIds.includes(piece.id)) blockers.push("Plano não contém esta peça.");
  }
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

  const environmentIds = new Set<string>();
  const pieceIds = new Set<string>();
  for (const environment of order.environments) {
    if (!environment.id.trim() || !environment.name.trim()) issues.push("Ambiente sem identificador ou nome.");
    if (environmentIds.has(environment.id)) issues.push("Identificador de ambiente duplicado: " + environment.id);
    environmentIds.add(environment.id);
    if (!Number.isInteger(environment.revision) || environment.revision < 1) issues.push(environment.name + ": revisão inválida.");
    for (const piece of environment.pieces) {
      if (pieceIds.has(piece.id)) issues.push("Identificador de peça duplicado: " + piece.id);
      pieceIds.add(piece.id);
      if (piece.environmentId !== environment.id) issues.push(piece.code + ": vínculo de ambiente inconsistente.");
      issues.push(...validatePieceRecord(piece).map(issue => piece.code + ": " + issue));
    }
  }

  const slabIds = new Set<string>();
  for (const slab of order.slabs) {
    if (!slab.id.trim() || !slab.materialCode.trim()) issues.push("Chapa sem identificador ou material.");
    if (slabIds.has(slab.id)) issues.push("Identificador de chapa duplicado: " + slab.id);
    slabIds.add(slab.id);
    if (!positive(slab.widthMm) || !positive(slab.lengthMm) || !positive(slab.thicknessMm))
      issues.push("Chapa " + slab.id + " possui dimensões inválidas.");
  }

  const offcutIds = new Set<string>();
  for (const offcut of order.offcuts) {
    if (!offcut.id.trim()) issues.push("Retalho sem identificador.");
    if (offcutIds.has(offcut.id)) issues.push("Identificador de retalho duplicado: " + offcut.id);
    offcutIds.add(offcut.id);
    const source = order.slabs.find(slab => slab.id === offcut.sourceSlabId);
    if (!source) issues.push("Retalho " + offcut.id + " sem chapa de origem.");
    else {
      if (source.materialCode !== offcut.materialCode || source.thicknessMm !== offcut.thicknessMm)
        issues.push("Retalho " + offcut.id + " incompatível com material/espessura da chapa de origem.");
      if (offcut.widthMm > source.widthMm || offcut.lengthMm > source.lengthMm)
        issues.push("Retalho " + offcut.id + " excede as dimensões da chapa de origem.");
    }
    if (!positive(offcut.widthMm) || !positive(offcut.lengthMm) || !positive(offcut.thicknessMm))
      issues.push("Retalho " + offcut.id + " possui dimensões inválidas.");
  }

  const planIds = new Set<string>();
  for (const plan of order.cutPlans) {
    if (!plan.id.trim()) issues.push("Plano sem identificador.");
    if (planIds.has(plan.id)) issues.push("Identificador de plano duplicado: " + plan.id);
    planIds.add(plan.id);
    for (const pieceId of plan.pieceIds) if (!pieceIds.has(pieceId))
      issues.push("Plano " + plan.id + " referencia peça inexistente: " + pieceId);
    for (const slabId of plan.slabIds) if (!slabIds.has(slabId))
      issues.push("Plano " + plan.id + " referencia chapa inexistente: " + slabId);
  }
  for (const environment of order.environments) for (const piece of environment.pieces) {
    if (piece.cutPlanId && !planIds.has(piece.cutPlanId))
      issues.push(piece.code + ": referencia plano de corte inexistente.");
    for (const slabId of piece.reservedSlabIds) if (!slabIds.has(slabId))
      issues.push(piece.code + ": referencia chapa inexistente: " + slabId);
    if (piece.cutPlanId) {
      const linkedPlan = order.cutPlans.find(plan => plan.id === piece.cutPlanId);
      if (linkedPlan && (!piece.reservedSlabIds.every(id => linkedPlan.slabIds.includes(id))
        || !linkedPlan.slabIds.every(id => piece.reservedSlabIds.includes(id))))
        issues.push(piece.code + ": reserva individual de chapas diverge das chapas do plano.");
    }
  }
  return [...new Set(issues)];
}
