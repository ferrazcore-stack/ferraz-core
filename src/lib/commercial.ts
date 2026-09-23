import { supabase } from "./supabase";

export type Customer = {
  id: string;
  name: string;
  trade_name: string | null;
  document: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  active: boolean;
};

export type Project = {
  id: string;
  customer_id: string;
  name: string;
  project_type: string | null;
  status: string;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  notes: string | null;
};

export type Budget = {
  id: string;
  customer_id: string;
  project_id: string;
  code: string;
  version: number;
  status: string;
  valid_until: string | null;
  subtotal: number;
  discount_amount: number;
  surcharge_amount: number;
  total_amount: number;
  customer_name: string | null;
  project_name: string | null;
};

export type CommercialContext = {
  userId: string;
  organizationId: string;
};

export async function getCommercialContext(): Promise<CommercialContext | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", auth.user.id)
    .eq("active", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.organization_id) return null;
  return { userId: auth.user.id, organizationId: data.organization_id };
}

export async function loadCustomers() {
  if (!supabase) return [] as Customer[];
  const { data, error } = await supabase
    .from("customers")
    .select("id,name,trade_name,document,email,phone,whatsapp,active")
    .eq("active", true)
    .order("name")
    .limit(200);
  if (error) throw error;
  return (data ?? []) as Customer[];
}

export async function createCustomer(input: Pick<Customer, "name" | "trade_name" | "document" | "email" | "phone" | "whatsapp">, ctx: CommercialContext) {
  if (!supabase) throw new Error("Supabase não configurado.");
  const { data, error } = await supabase
    .from("customers")
    .insert({ ...input, organization_id: ctx.organizationId, created_by: ctx.userId })
    .select("id,name,trade_name,document,email,phone,whatsapp,active")
    .single();
  if (error) throw error;
  return data as Customer;
}

export async function loadProjects() {
  if (!supabase) return [] as Project[];
  const { data, error } = await supabase
    .from("projects")
    .select("id,customer_id,name,project_type,status,city,state,postal_code,notes")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function createProject(input: Pick<Project, "customer_id" | "name" | "project_type" | "city" | "state" | "postal_code" | "notes">, ctx: CommercialContext) {
  if (!supabase) throw new Error("Supabase não configurado.");
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...input, organization_id: ctx.organizationId, created_by: ctx.userId })
    .select("id,customer_id,name,project_type,status,city,state,postal_code,notes")
    .single();
  if (error) throw error;
  return data as Project;
}

export async function loadBudgets() {
  if (!supabase) return [] as Budget[];
  const { data, error } = await supabase
    .from("dashboard_budget_summary")
    .select("id,customer_id,project_id,code,version,status,valid_until,subtotal,discount_amount,surcharge_amount,total_amount,customer_name,project_name")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, subtotal: Number(row.subtotal ?? 0), discount_amount: Number(row.discount_amount ?? 0), surcharge_amount: Number(row.surcharge_amount ?? 0), total_amount: Number(row.total_amount ?? 0) })) as Budget[];
}

export async function createBudget(input: { customer_id: string; project_id: string; code: string; valid_until?: string | null }, ctx: CommercialContext) {
  if (!supabase) throw new Error("Supabase não configurado.");
  const { data, error } = await supabase
    .from("budgets")
    .insert({ ...input, organization_id: ctx.organizationId, created_by: ctx.userId, status: "draft" })
    .select("id,customer_id,project_id,code,version,status,valid_until,subtotal,discount_amount,surcharge_amount,total_amount")
    .single();
  if (error) throw error;
  return data as Omit<Budget, "customer_name" | "project_name">;
}
