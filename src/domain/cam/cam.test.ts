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
  it("accepts a bounded draft for parameter simulation only", () => {
    const result = validateCamJob(job, machine, [tool]);
    expect(result.validForSimulation).toBe(true);
    expect(result.validForMachineRelease).toBe(false);
    expect(result.warnings.some(item => item.includes("não substitui simulação"))).toBe(true);
  });

  it("blocks machine release when the post processor is not validated", () => {
    const result = validateCamJob(job, { ...machine, postProcessor: { ...machine.postProcessor, state: "draft", checksum: undefined } }, [tool]);
    expect(result.validForSimulation).toBe(false);
    expect(result.blockers.some(item => item.includes("Pós-processador"))).toBe(true);
  });

  it("blocks an unvalidated machine and incompatible tools", () => {
    const result = validateCamJob(job, { ...machine, validationState: "bench-tested" }, [{ ...tool, compatibleMachineIds: ["other-machine"] }]);
    expect(result.validForSimulation).toBe(false);
    expect(result.blockers.some(item => item.includes("Máquina ainda não"))).toBe(true);
    expect(result.blockers.some(item => item.includes("não está liberada"))).toBe(true);
  });

  it("blocks feed, spindle, depth-per-pass and safe Z beyond declared limits", () => {
    const unsafe = { ...job, operations: [{ ...job.operations[0], feedMmMin: 9000, spindleRpm: 13000, stepDownMm: 8, safeZMm: 300 }] };
    const result = validateCamJob(unsafe, machine, [tool]);
    expect(result.validForSimulation).toBe(false);
    expect(result.blockers.some(item => item.includes("avanço excede"))).toBe(true);
    expect(result.blockers.some(item => item.includes("rotação excede"))).toBe(true);
    expect(result.blockers.some(item => item.includes("profundidade por passe"))).toBe(true);
    expect(result.blockers.some(item => item.includes("safe Z"))).toBe(true);
  });

  it("requires a named human approval for released jobs", () => {
    const released = { ...job, state: "released" as const };
    const result = validateCamJob(released, machine, [tool]);
    expect(result.validForSimulation).toBe(false);
    expect(result.blockers.some(item => item.includes("responsável técnico"))).toBe(true);
  });

  it("never permits machine release from a draft state", () => {
    const result = validateCamJob(job, machine, [tool]);
    expect(result.validForMachineRelease).toBe(false);
  });
});
