import { readLocalState } from "./localStore";

export type DashboardOrder = {
  id: string;
  order_number: string;
  status: string;
  customer_name: string | null;
  project_name: string | null;
  total_amount: number;
};

export async function loadDashboardOrders(): Promise<DashboardOrder[]> {
  return readLocalState().orders.map(order => ({
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    customer_name: order.customer_name,
    project_name: order.project_name,
    total_amount: Number(order.total_amount ?? 0),
  }));
}
