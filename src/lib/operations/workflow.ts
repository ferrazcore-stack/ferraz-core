export type WorkflowStage = "budget"|"approved"|"ordered"|"measured"|"technical_release"|"drawing"|"cut_plan"|"cut"|"finishing"|"production"|"inspection"|"loading"|"delivery"|"installation"|"completed";
export type WorkflowEvidence = Readonly<{budgetApproved?:boolean;orderClosed?:boolean;measurementValidated?:boolean;technicalReleaseApproved?:boolean;drawingApproved?:boolean;cutPlanApproved?:boolean;materialReserved?:boolean;inspectionApproved?:boolean;deliveryConfirmed?:boolean;installationAccepted?:boolean}>;
export type GateResult = Readonly<{allowed:boolean;missing:readonly string[]}>;
const requirements: Partial<Record<WorkflowStage, readonly [keyof WorkflowEvidence,string][]>> = {
 ordered:[["budgetApproved","Orçamento precisa estar aprovado."]],
 measured:[["orderClosed","Pedido precisa estar fechado."]],
 technical_release:[["measurementValidated","Medição precisa estar validada."]],
 drawing:[["technicalReleaseApproved","Liberação técnica aprovada é obrigatória."]],
 cut_plan:[["drawingApproved","Desenho técnico aprovado é obrigatório."]],
 cut:[["cutPlanApproved","Plano de corte aprovado é obrigatório."],["materialReserved","Material precisa estar reservado."]],
 production:[["cutPlanApproved","Plano de corte aprovado é obrigatório."]],
 loading:[["inspectionApproved","Inspeção aprovada é obrigatória antes do carregamento."]],
 delivery:[["inspectionApproved","Inspeção aprovada é obrigatória antes da entrega."]],
 installation:[["deliveryConfirmed","Entrega precisa estar confirmada."]],
 completed:[["installationAccepted","Aceite da instalação é obrigatório."]]
};
const stages: readonly WorkflowStage[]=["budget","approved","ordered","measured","technical_release","drawing","cut_plan","cut","finishing","production","inspection","loading","delivery","installation","completed"];
export function checkStageGate(stage:WorkflowStage,evidence:WorkflowEvidence):GateResult {
 const missing=(requirements[stage]??[]).filter(([key])=>evidence[key]!==true).map(([,message])=>message);
 return {allowed:missing.length===0,missing};
}
export function canAdvance(current:WorkflowStage,next:WorkflowStage,evidence:WorkflowEvidence):GateResult {
 const a=stages.indexOf(current),b=stages.indexOf(next);
 if(a<0||b!==a+1)return {allowed:false,missing:["Transição inválida: avance somente para a etapa seguinte."]};
 return checkStageGate(next,evidence);
}
export const workflowStages=()=>stages;
