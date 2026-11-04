export type CamOperationType = "contour-cut" | "pocket" | "drill" | "edge-polish";
export type MachineValidationState = "draft" | "bench-tested" | "validated";
export type PostProcessorState = "missing" | "draft" | "validated";
export type CamJobState = "draft" | "simulated" | "validated" | "released";

export interface MachineDefinition {
  id: string;
  name: string;
  controller: string;
  axes: Array<"X" | "Y" | "Z">;
  workEnvelopeMm: { x: number; y: number; z: number };
  origin: "lower-left-front" | "lower-left-back" | "center" | "machine-defined";
  maxSpindleRpm: number;
  maxFeedMmMin: number;
  validationState: MachineValidationState;
  postProcessor: { id: string; version: string; state: PostProcessorState; checksum?: string };
}

export interface ToolDefinition {
  id: string;
  name: string;
  type: "saw-blade" | "router-bit" | "drill-bit" | "polishing-head";
  diameterMm: number;
  maxRpm: number;
  maxFeedMmMin: number;
  maxDepthPerPassMm: number;
  compatibleMachineIds: string[];
  approved: boolean;
}

export interface CamOperation {
  id: string;
  sequence: number;
  type: CamOperationType;
  geometryRef: string;
  toolId: string;
  depthMm: number;
  safeZMm: number;
  feedMmMin: number;
  plungeMmMin: number;
  spindleRpm: number;
  stepDownMm: number;
}

export interface CamJob {
  id: string;
  projectId: string;
  pieceRevisionId: string;
  machineId: string;
  materialId: string;
  state: CamJobState;
  operations: CamOperation[];
  approvedBy?: string;
  approvedAt?: string;
}

export interface CamValidationResult {
  validForSimulation: boolean;
  validForMachineRelease: boolean;
  blockers: string[];
  warnings: string[];
}

export function validateCamJob(
  job: CamJob,
  machine: MachineDefinition | undefined,
  tools: ToolDefinition[],
): CamValidationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  if (!job.projectId.trim()) blockers.push("O trabalho CAM precisa estar vinculado a um projeto.");
  if (!job.pieceRevisionId.trim()) blockers.push("O trabalho CAM precisa apontar para uma revisão geométrica imutável.");
  if (!job.materialId.trim()) blockers.push("O material precisa estar identificado.");
  if (!machine) {
    blockers.push("Máquina CNC não cadastrada.");
    return { validForSimulation: false, validForMachineRelease: false, blockers, warnings };
  }
  if (job.machineId !== machine.id) blockers.push("A máquina vinculada ao trabalho não corresponde à máquina recebida para validação.");
  if (!machine.axes.includes("X") || !machine.axes.includes("Y") || !machine.axes.includes("Z")) {
    blockers.push("A máquina precisa declarar os eixos X, Y e Z.");
  }
  if (![machine.workEnvelopeMm.x, machine.workEnvelopeMm.y, machine.workEnvelopeMm.z].every(value => Number.isFinite(value) && value > 0)) {
    blockers.push("Envelope útil da máquina inválido.");
  }
  if (!Number.isFinite(machine.maxSpindleRpm) || machine.maxSpindleRpm <= 0 || !Number.isFinite(machine.maxFeedMmMin) || machine.maxFeedMmMin <= 0) {
    blockers.push("Limites de rotação e avanço da máquina precisam ser válidos.");
  }
  if (!job.operations.length) blockers.push("O trabalho CAM não possui operações.");
  const sequences = new Set<number>();
  const operationIds = new Set<string>();
  for (const operation of job.operations) {
    if (!operation.id.trim() || operationIds.has(operation.id)) blockers.push("Identificador de operação ausente ou duplicado.");
    operationIds.add(operation.id);
    if (!Number.isInteger(operation.sequence) || operation.sequence < 1 || sequences.has(operation.sequence)) blockers.push("Sequência de operações ausente, inválida ou duplicada.");
    sequences.add(operation.sequence);
    if (!operation.geometryRef.trim()) blockers.push(`Operação ${operation.id}: referência geométrica ausente.`);
    const tool = tools.find(candidate => candidate.id === operation.toolId);
    if (!tool) {
      blockers.push(`Operação ${operation.id}: ferramenta não cadastrada.`);
      continue;
    }
    if (![tool.diameterMm, tool.maxRpm, tool.maxFeedMmMin, tool.maxDepthPerPassMm].every(value => Number.isFinite(value) && value > 0)) blockers.push(`Ferramenta ${tool.name} possui parâmetros físicos inválidos.`);
    if (!tool.approved) blockers.push(`Ferramenta ${tool.name} ainda não foi aprovada.`);
    const allowedTools: Record<CamOperationType, ToolDefinition["type"][]> = { "contour-cut": ["saw-blade", "router-bit"], pocket: ["router-bit"], drill: ["drill-bit"], "edge-polish": ["polishing-head"] };
    if (!allowedTools[operation.type].includes(tool.type)) blockers.push(`Ferramenta ${tool.name} incompatível com a operação ${operation.type}.`);
    if (!tool.compatibleMachineIds.includes(machine.id)) blockers.push(`Ferramenta ${tool.name} não está liberada para a máquina ${machine.name}.`);
    const positive = [operation.depthMm, operation.safeZMm, operation.feedMmMin, operation.plungeMmMin, operation.spindleRpm, operation.stepDownMm];
    if (!positive.every(value => Number.isFinite(value) && value > 0)) blockers.push(`Operação ${operation.id}: profundidades, avanço, rotação e passes devem ser positivos e finitos.`);
    if (operation.safeZMm > machine.workEnvelopeMm.z) blockers.push(`Operação ${operation.id}: safe Z excede o envelope útil da máquina.`);
    if (operation.depthMm > machine.workEnvelopeMm.z) blockers.push(`Operação ${operation.id}: profundidade excede o eixo Z útil.`);
    if (operation.feedMmMin > Math.min(machine.maxFeedMmMin, tool.maxFeedMmMin)) blockers.push(`Operação ${operation.id}: avanço excede o limite da máquina ou ferramenta.`);
    if (operation.plungeMmMin > Math.min(machine.maxFeedMmMin, tool.maxFeedMmMin)) blockers.push(`Operação ${operation.id}: avanço de mergulho excede o limite da máquina ou ferramenta.`);
    if (operation.spindleRpm > Math.min(machine.maxSpindleRpm, tool.maxRpm)) blockers.push(`Operação ${operation.id}: rotação excede o limite da máquina ou ferramenta.`);
    if (operation.stepDownMm > tool.maxDepthPerPassMm) blockers.push(`Operação ${operation.id}: profundidade por passe excede o limite da ferramenta.`);
    if (operation.plungeMmMin > operation.feedMmMin) warnings.push(`Operação ${operation.id}: avanço de mergulho maior que o avanço de corte; revisar.`);
  }
  if (machine.postProcessor.state !== "validated" || !machine.postProcessor.checksum) {
    blockers.push("Pós-processador específico da máquina não está validado e identificado por checksum.");
  }
  if (machine.validationState !== "validated") blockers.push("Máquina ainda não passou por validação técnica específica.");
  if (job.state === "released" && (!job.approvedBy || !job.approvedAt)) blockers.push("Liberação exige responsável técnico e data de aprovação.");
  const validForSimulation = blockers.length === 0;
  const validForMachineRelease = validForSimulation && job.state === "released" && Boolean(job.approvedBy && job.approvedAt);
  if (validForSimulation) warnings.push("Validação de parâmetros não substitui simulação de trajetória, verificação de colisões, teste do pós-processador e ensaio seguro na máquina.");
  return { validForSimulation, validForMachineRelease, blockers, warnings };
}
