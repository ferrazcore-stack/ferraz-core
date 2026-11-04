import { readLocalState, writeLocalState, makeId, type Customer, type Project, type Budget } from "./localStore";
export type { Customer, Project, Budget } from "./localStore";
export type CommercialContext={userId:string;organizationId:string};
const localContext:CommercialContext={userId:"local-user",organizationId:"porcelane-local"};
export async function getCommercialContext(){return localContext;}
export async function loadCustomers():Promise<Customer[]>{return readLocalState().customers.filter(c=>c.active).sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));}
export async function createCustomer(input:Pick<Customer,"name"|"trade_name"|"document"|"email"|"phone"|"whatsapp">,_ctx:CommercialContext){
 const state=readLocalState(); const name=input.name.trim(); if(!name)throw new Error("Informe o nome do cliente.");
 const row:Customer={...input,name,id:makeId("cus"),active:true}; state.customers.push(row); writeLocalState(state); return row;
}
export async function loadProjects():Promise<Project[]>{return readLocalState().projects.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));}
export async function createProject(input:Pick<Project,"customer_id"|"name"|"project_type"|"city"|"state"|"postal_code"|"notes">,_ctx:CommercialContext){
 const state=readLocalState(); if(!state.customers.some(c=>c.id===input.customer_id))throw new Error("Selecione um cliente cadastrado.");
 const name=input.name.trim(); if(!name)throw new Error("Informe o nome da obra.");
 const row:Project={...input,name,id:makeId("prj"),status:"active"};state.projects.push(row);writeLocalState(state);return row;
}
export async function loadBudgets():Promise<Budget[]>{const s=readLocalState();return s.budgets.map(b=>({...b,customer_name:s.customers.find(c=>c.id===b.customer_id)?.name??null,project_name:s.projects.find(p=>p.id===b.project_id)?.name??null})).sort((a,b)=>b.code.localeCompare(a.code));}
export async function createBudget(input:{customer_id:string;project_id:string;code:string;valid_until?:string|null},_ctx:CommercialContext){
 const s=readLocalState(); if(!s.customers.some(c=>c.id===input.customer_id))throw new Error("Cliente inválido."); if(!s.projects.some(p=>p.id===input.project_id&&p.customer_id===input.customer_id))throw new Error("A obra não pertence ao cliente selecionado.");
 const code=input.code.trim();if(!code)throw new Error("Informe o código do orçamento.");if(s.budgets.some(b=>b.code.toLowerCase()===code.toLowerCase()))throw new Error("Já existe orçamento com esse código.");
 const row:Budget={id:makeId("bud"),customer_id:input.customer_id,project_id:input.project_id,code,version:1,status:"draft",valid_until:input.valid_until??null,subtotal:0,discount_amount:0,surcharge_amount:0,total_amount:0,customer_name:null,project_name:null};s.budgets.push(row);writeLocalState(s);return row;
}
