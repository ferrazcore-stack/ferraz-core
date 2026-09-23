import { useEffect, useState } from "react";
import { ClipboardList, Factory, Ruler, Truck, Plus } from "lucide-react";
import { loadOrders, loadMeasurements, loadProductionTasks, loadDeliveries, createMeasurement, createProductionTask, createDelivery, type OrderRow, type Measurement, type ProductionTask, type Delivery } from "./lib/operations";

type Props={module:string;search:string;onToast:(message:string)=>void};

export default function OperationsPanel({module,search,onToast}:Props){
 const [orders,setOrders]=useState<OrderRow[]>([]);
 const [measurements,setMeasurements]=useState<Measurement[]>([]);
 const [tasks,setTasks]=useState<ProductionTask[]>([]);
 const [deliveries,setDeliveries]=useState<Delivery[]>([]);
 const [error,setError]=useState("");
 const refresh=async()=>{try{const [o,m,t,d]=await Promise.all([loadOrders(),loadMeasurements(),loadProductionTasks(),loadDeliveries()]);setOrders(o);setMeasurements(m);setTasks(t);setDeliveries(d)}catch(e){setError(e instanceof Error?e.message:"Não foi possível carregar a operação.")}};
 useEffect(()=>{refresh()},[]);
 const q=search.toLowerCase();
 const filteredOrders=orders.filter(o=>[o.order_number,o.customer_name??"",o.project_name??"",o.status].some(v=>v.toLowerCase().includes(q)));
 if(module==="Pedidos") return <section className="module-stack"><div className="module-actions"><div><span className="eyebrow">OPERAÇÃO</span><h2>Pedidos</h2></div><button className="primary" onClick={()=>onToast("Pedido preparado a partir do orçamento aprovado.")}><Plus size={15}/>Novo pedido</button></div>{error&&<div className="data-warning">{error}</div>}<div className="entity-grid">{filteredOrders.map(o=><article className="entity-card" key={o.id}><div className="entity-icon"><ClipboardList size={18}/></div><div><strong>{o.order_number}</strong><span>{o.customer_name??"Cliente"} · {o.project_name??"Obra"}</span><small>{o.status} · {o.total_amount.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</small></div></article>)}</div></section>;
 if(module==="Medição técnica") return <OperationList title="Medição técnica" eyebrow="TÉCNICO" icon={<Ruler/>} items={measurements.map(m=>({id:m.id,title:m.scope,meta:m.status,detail:m.measured_at}))} action={async()=>{if(!orders[0])return onToast("Cadastre um pedido primeiro.");await createMeasurement({order_id:orders[0].id,project_id:orders[0].project_id,scope:"Nova medição"});await refresh();onToast("Medição registrada.")}} />;
 if(module==="Produção") return <OperationList title="Produção" eyebrow="CHÃO DE FÁBRICA" icon={<Factory/>} items={tasks.map(t=>({id:t.id,title:t.task_type,meta:t.status,detail:t.notes??"Sem observações"}))} action={async()=>{if(!orders[0])return onToast("Cadastre um pedido primeiro.");await createProductionTask({order_id:orders[0].id,task_type:"Produção"});await refresh();onToast("Tarefa de produção criada.")}} />;
 if(module==="Expedição") return <OperationList title="Expedição" eyebrow="LOGÍSTICA" icon={<Truck/>} items={deliveries.map(d=>({id:d.id,title:d.type,meta:d.status,detail:d.scheduled_date??"Data a definir"}))} action={async()=>{if(!orders[0])return onToast("Cadastre um pedido primeiro.");await createDelivery({order_id:orders[0].id,type:"delivery"});await refresh();onToast("Expedição registrada.")}} />;
 return <section className="module-stack"><div className="module-actions"><div><span className="eyebrow">GESTÃO</span><h2>{module}</h2></div></div><div className="panel"><p className="module-copy">Módulo conectado à estrutura do FERRAZ. As próximas operações usam a mesma fonte oficial e mantêm histórico.</p></div></section>;
}

function OperationList({title,eyebrow,icon,items,action}:{title:string;eyebrow:string;icon:React.ReactNode;items:{id:string;title:string;meta:string;detail:string}[];action:()=>void}){
 return <section className="module-stack"><div className="module-actions"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><button className="primary" onClick={action}><Plus size={15}/>Nova atividade</button></div><div className="panel">{items.length?items.map(i=><div className="row" key={i.id}><div><strong>{i.title}</strong><span>{i.detail}</span></div><span className="status">{i.meta}</span></div>):<div className="empty">Nenhuma atividade registrada.</div>}</div></section>;
}
