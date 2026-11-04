export type LocalState = {
  customers: Customer[];
  projects: Project[];
  budgets: Budget[];
  orders: OrderRow[];
  measurements: Measurement[];
  tasks: ProductionTask[];
  deliveries: Delivery[];
  events: { id: string; order_id: string; from_status: string; to_status: string; created_at: string }[];
};
export type Customer = { id:string; name:string; trade_name:string|null; document:string|null; email:string|null; phone:string|null; whatsapp:string|null; active:boolean };
export type Project = { id:string; customer_id:string; name:string; project_type:string|null; status:string; city:string|null; state:string|null; postal_code:string|null; notes:string|null };
export type Budget = { id:string; customer_id:string; project_id:string; code:string; version:number; status:string; valid_until:string|null; subtotal:number; discount_amount:number; surcharge_amount:number; total_amount:number; customer_name:string|null; project_name:string|null };
export type OrderRow={id:string;order_number:string;status:string;project_id:string;budget_id:string|null;customer_name:string|null;project_name:string|null;total_amount:number};
export type OrderItem={id:string;order_id:string;description:string;material:string|null;quantity:number;length_cm:number|null;width_cm:number|null;area_m2:number|null;unit_price:number;total_price:number;status:string};
export type Measurement={id:string;order_id:string;project_id:string;scope:string;status:string;measured_at:string;notes:string|null};
export type ProductionTask={id:string;order_id:string;order_item_id:string|null;task_type:string;status:string;priority:number;assigned_to:string|null;started_at:string|null;completed_at:string|null;notes:string|null};
export type Delivery={id:string;order_id:string;type:string;scheduled_date:string|null;status:string;notes:string|null};
const KEY="ferraz-core.local.v1";
function empty():LocalState{return {customers:[],projects:[],budgets:[],orders:[],measurements:[],tasks:[],deliveries:[],events:[]};}
export function readLocalState():LocalState {
  if(typeof window==="undefined") return empty();
  try { const raw=window.localStorage.getItem(KEY); if(!raw)return empty(); const parsed=JSON.parse(raw) as Partial<LocalState>; return {...empty(),...parsed}; }
  catch { return empty(); }
}
export function writeLocalState(state:LocalState):void {
  if(typeof window==="undefined") throw new Error("Armazenamento local indisponível neste ambiente.");
  window.localStorage.setItem(KEY,JSON.stringify(state));
}
export function makeId(prefix:string):string{return prefix+"-"+globalThis.crypto.randomUUID();}
export function resetLocalState():void{writeLocalState(empty());}
