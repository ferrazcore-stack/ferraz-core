import {
  porcelaneKitchenScenario,
  simulatePorcelaneGates,
  validatePorcelaneScenario,
} from "./scenario";

export type AcceptanceResult = Readonly<{
  passed: boolean;
  checks: readonly Readonly<{ id: string; passed: boolean; detail: string }>[];
}>;

/**
 * Executa verificações determinísticas do cenário sintético PORCELANE.
 * Pode ser chamado por testes automatizados, CI ou ferramentas de diagnóstico.
 */
export function runPorcelaneAcceptance(): AcceptanceResult {
  const scenario = validatePorcelaneScenario(porcelaneKitchenScenario);
  const gates = simulatePorcelaneGates();
  const checks = [
    {
      id: "scenario.geometry",
      passed: scenario.valid && scenario.pieceCount === 3 && scenario.totalNetAreaM2 > 0,
      detail: scenario.valid
        ? `${scenario.pieceCount} peças válidas; área líquida total ${scenario.totalNetAreaM2.toFixed(4)} m².`
        : scenario.issues.join(" "),
    },
    {
      id: "gate.cut.blocked",
      passed: gates.blockedCut,
      detail: gates.blockedCut ? "Corte bloqueado sem plano aprovado." : "Falha: corte não foi bloqueado.",
    },
    {
      id: "gate.cut.allowed",
      passed: gates.allowedCut,
      detail: gates.allowedCut ? "Corte permitido com plano aprovado e material reservado." : "Falha: corte válido não foi liberado.",
    },
    {
      id: "gate.installation.allowed",
      passed: gates.allowedInstallation,
      detail: gates.allowedInstallation ? "Instalação permitida após entrega confirmada." : "Falha: instalação válida não foi liberada.",
    },
  ];
  return { passed: checks.every(check => check.passed), checks };
}
