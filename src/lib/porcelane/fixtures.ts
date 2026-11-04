import type { PorcelaneOrder } from "./domain";

/** Dados integralmente fictícios para teste; não reproduzem clientes nem obras reais. */
export const porcelaneIntegratedOrder: PorcelaneOrder = {
  id: "DEMO-ORDER-0001",
  code: "PED-DEMO-0001",
  customerName: "Cliente demonstração",
  projectName: "Residência modelo",
  budgetApproval: "approved",
  closed: true,
  revision: 1,
  environments: [
    {
      id: "ENV-COZ-01",
      name: "Cozinha",
      revision: 1,
      pieces: [
        {
          id: "PIECE-BANC-01", environmentId: "ENV-COZ-01", code: "COZ-BANC-01",
          description: "Bancada principal com recorte de cuba", revision: 1,
          widthMm: 2400, depthMm: 650, thicknessMm: 20, quantity: 1,
          status: "drawn", measurementApproval: "approved", technicalApproval: "approved",
          drawingApproval: "approved", cutPlanId: "CUTPLAN-DEMO-01", reservedSlabIds: ["SLAB-DEMO-01"],
        },
        {
          id: "PIECE-RODA-01", environmentId: "ENV-COZ-01", code: "COZ-RODA-01",
          description: "Rodabanca", revision: 1,
          widthMm: 2400, depthMm: 100, thicknessMm: 20, quantity: 1,
          status: "drawn", measurementApproval: "approved", technicalApproval: "approved",
          drawingApproval: "approved", cutPlanId: "CUTPLAN-DEMO-01", reservedSlabIds: ["SLAB-DEMO-01"],
        },
      ],
    },
    {
      id: "ENV-BANHO-01",
      name: "Banheiro",
      revision: 1,
      pieces: [
        {
          id: "PIECE-LAV-01", environmentId: "ENV-BANHO-01", code: "BAN-LAV-01",
          description: "Tampo de lavatório", revision: 1,
          widthMm: 900, depthMm: 550, thicknessMm: 20, quantity: 1,
          status: "measured", measurementApproval: "approved", technicalApproval: "pending",
          drawingApproval: "pending", cutPlanId: null, reservedSlabIds: [],
        },
      ],
    },
  ],
  slabs: [
    { id: "SLAB-DEMO-01", materialCode: "QZ-DEMO-20", thicknessMm: 20, widthMm: 1600, lengthMm: 3200, status: "reserved" },
  ],
  offcuts: [
    { id: "OFFCUT-DEMO-01", sourceSlabId: "SLAB-DEMO-01", materialCode: "QZ-DEMO-20", thicknessMm: 20, widthMm: 420, lengthMm: 1100, status: "available" },
  ],
  cutPlans: [
    { id: "CUTPLAN-DEMO-01", revision: 1, status: "approved", pieceIds: ["PIECE-BANC-01", "PIECE-RODA-01"], slabIds: ["SLAB-DEMO-01"], kerfMm: 4, edgeMarginMm: 10, approvedBy: "Aprovador demonstração" },
  ],
};
