import { porcelaneKitchenScenario, simulatePorcelaneGates, validatePorcelaneScenario } from "./scenario";
import { canApproveCutPlan, canInstallPiece, canLoadPiece, canReleasePiece, canStartCut, validateOrderConsistency } from "./domain";
import { porcelaneIntegratedOrder } from "./fixtures";

export type AcceptanceResult = Readonly<{
  passed: boolean;
  checks: readonly Readonly<{ id: string; passed: boolean; detail: string }>[];
}>;

/** Executa testes de aceitação determinísticos, sem acessar banco ou dados de clientes. */
export function runPorcelaneAcceptance(): AcceptanceResult {
  const geometry = validatePorcelaneScenario(porcelaneKitchenScenario);
  const gates = simulatePorcelaneGates();
  const order = porcelaneIntegratedOrder;
  const orderIssues = validateOrderConsistency(order);
  const pieces = order.environments.flatMap(environment => environment.pieces);
  const released = canReleasePiece(pieces[0]);
  const partialReleaseBlocked = !canReleasePiece(pieces[2]).allowed;
  const plan = order.cutPlans[0];
  const planGate = canApproveCutPlan(order, plan);
  const cutGate = canStartCut(order, plan.id);
  const loadingGate = canLoadPiece(pieces[0]);
  const installationGate = canInstallPiece(pieces[0]);

  const checks = [
    { id: "geometry.fixture", passed: geometry.valid && geometry.pieceCount === 3 && geometry.totalNetAreaM2 > 0,
      detail: geometry.valid ? `${geometry.pieceCount} peças geométricas válidas; área líquida ${geometry.totalNetAreaM2.toFixed(4)} m².` : geometry.issues.join(" ") },
    { id: "order.integrity", passed: orderIssues.length === 0, detail: orderIssues.length ? orderIssues.join(" ") : "Pedido, ambientes, peças, revisões e vínculos consistentes." },
    { id: "measurement.technical.partial-release", passed: released.allowed && partialReleaseBlocked,
      detail: "Liberação aprovada para peças prontas e bloqueada para peça com liberação técnica pendente." },
    { id: "cut-plan.approval", passed: planGate.allowed, detail: planGate.allowed ? "Plano aprovado referencia peças liberadas, desenhos aprovados e chapa reservada." : planGate.blockers.join(" ") },
    { id: "cut.block-without-plan", passed: gates.blockedCut, detail: gates.blockedCut ? "Corte bloqueado quando plano não está aprovado." : "Falha: corte sem plano aprovado." },
    { id: "cut.allowed-with-reservation", passed: cutGate.allowed && gates.allowedCut, detail: cutGate.allowed ? "Corte liberado somente com plano aprovado e chapa reservada." : cutGate.blockers.join(" ") },
    { id: "loading.requires-inspection", passed: !loadingGate.allowed, detail: "Carregamento bloqueado porque a peça ainda não passou pela inspeção." },
    { id: "installation.requires-delivery", passed: !installationGate.allowed, detail: "Instalação bloqueada antes da confirmação de entrega." },
  ];
  return { passed: checks.every(check => check.passed), checks };
}
