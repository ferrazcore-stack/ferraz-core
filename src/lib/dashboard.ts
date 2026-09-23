import { supabase } from "./supabase";

export type DashboardOrder = {
  id: string;
  order_number: string;
  status: string;
  customer_name: string | null;
  project_name: string | null;
  total_amount: number;
};

export async function loadDashboardOrders(): Promise<DashboardOrder[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("dashboard_order_summary")
    .select("id,order_number,status,customer_name,project_name,total_amount")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    total_amount: Number(row.total_amount ?? 0),
  }));
}
