import { describe, expect, it } from "vitest";
import { validateCamJob, type CamJob, type MachineDefinition, type ToolDefinition } from "./cam";

const machine: MachineDefinition = {
  id: "cnc-demo-01", name: "CNC bancada de teste", controller: "controlador cadastrado",
  axes: ["X", "Y", "Z"], workEnvelopeMm: { x: 3000, y: 1800, z: 250 },
  origin: "machine-defined", maxSpindleRpm: 12000, maxFeedMmMin: 8000,
  validationState: "validated",
  postProcessor: { id: "post-demo", version: "0.1", state: "validated", checksum: "sha256:fixture" },
};
const tool: ToolDefinition = {
  id: "router-01", name: "Fresa de teste", type: "router-bit", diameterMm: 12,
  maxRpm: 10000, maxFeedMmMin: 5000, maxDepthPerPassMm: 5,
  compatibleMachineIds: ["cnc-demo-01"], approved: true,
};
const job: CamJob = {
  id: "cam-01", projectId: "project-01", pieceRevisionId: "piece-rev-01",
  machineId: "cnc-demo-01", materialId: "stone-01", state: "draft",
  operations: [{
    id: "op-01", sequence: 1, type: "contour-cut", geometryRef: "geometry-rev-01",
    toolId: "router-01", depthMm: 20, safeZMm: 30, feedMmMin: 1500,
    plungeMmMin: 500, spindleRpm: 6000, stepDownMm: 4,
  }],
};

describe("CAM safety validation", () => {
  it("accepts bounded parameters for review without authorizing machine release", () => {
    const result = validateCamJob(job, machine, [tool]);
    expect(result.validForParameterReview).toBe(true);
    expect(result.validForMachineRelease).toBe(false);
    expect(result.releaseBlockers.some(item => item.includes("estado formal"))).toBe(true);
    expect(result.warnings.some(item => item.includes("não simula trajetórias"))).toBe(true);
  });

  it("allows parameter review but blocks release when the post processor is not validated", () => {
    const result = validateCamJob(job, { ...machine, postProcessor: { ...machine.postProcessor, state: "draft", checksum: undefined } }, [tool]);
    expect(result.validForParameterReview).toBe(true);
    expect(result.validForMachineRelease).toBe(false);
    expect(result.releaseBlockers.some(item => item.includes("Pós-processador"))).toBe(true);
  });

  it("allows parameter review but blocks release for an unvalidated machine", () => {
    const result = validateCamJob(job, { ...machine, validationState: "bench-tested" }, [tool]);
    expect(result.validForParameterReview).toBe(true);
    expect(result.validForMachineRelease).toBe(false);
    expect(result.releaseBlockers.some(item => item.includes("Máquina ainda não"))).toBe(true);
  });

  it("blocks feed, spindle, depth-per-pass and safe Z beyond declared limits", () => {
    const unsafe = { ...job, operations: [{ ...job.operations[0], feedMmMin: 9000, spindleRpm: 13000, stepDownMm: 8, safeZMm: 300 }] };
    const result = validateCamJob(unsafe, machine, [tool]);
    expect(result.validForParameterReview).toBe(false);
    expect(result.blockers.some(item => item.includes("avanço excede"))).toBe(true);
    expect(result.blockers.some(item => item.includes("rotação excede"))).toBe(true);
    expect(result.blockers.some(item => item.includes("profundidade por passe"))).toBe(true);
    expect(result.blockers.some(item => item.includes("safe Z"))).toBe(true);
  });

  it("blocks an incompatible tool type and excessive plunge feed", () => {
    const drillOperation = { ...job, operations: [{ ...job.operations[0], type: "drill" as const, plungeMmMin: 9000 }] };
    const result = validateCamJob(drillOperation, machine, [tool]);
    expect(result.validForParameterReview).toBe(false);
    expect(result.blockers.some(item => item.includes("incompatível com a operação"))).toBe(true);
    expect(result.blockers.some(item => item.includes("mergulho excede"))).toBe(true);
  });

  it("requires a named human approval for released jobs", () => {
    const released = { ...job, state: "released" as const };
    const result = validateCamJob(released, machine, [tool]);
    expect(result.validForParameterReview).toBe(true);
    expect(result.validForMachineRelease).toBe(false);
    expect(result.releaseBlockers.some(item => item.includes("responsável técnico"))).toBe(true);
  });

  it("never permits machine release from a draft state", () => {
    const result = validateCamJob(job, machine, [tool]);
    expect(result.validForMachineRelease).toBe(false);
  });

  
  it("never authorizes machine release even when all legacy flags and approval fields are populated", () => {
    const fullyMarked = { ...job, state: "released" as const, approvedBy: "operator-01", approvedAt: "2026-11-04T12:00:00Z" };
    const result = validateCamJob(fullyMarked, machine, [tool]);
    expect(result.validForParameterReview).toBe(true);
    expect(result.validForMachineRelease).toBe(false);
    expect(result.releaseBlockers.some(item => item.includes("geração NC"))).toBe(true);
  });
});

  
  
