import { useEffect, useMemo, useState } from "react";
import { Bell, ChevronDown, ClipboardList, Factory, FileText, LayoutDashboard, Plus, Search, Settings, Truck, Users, WalletCards, X, ArrowUpRight } from "lucide-react";
import "./index.css";
import { loadDashboardOrders, type DashboardOrder } from "./lib/dashboard";
import { supabaseConfigured } from "./lib/supabase";
import CommercialPanel from "./CommercialPanel";

type NavItem={label:string;icon:typeof LayoutDashboard;section:string};
const navItems:NavItem[]=[
 {label:"Dashboard",icon:LayoutDashboard,section:"Geral"},{label:"Clientes e obras",icon:Users,section:"Geral"},
 {label:"Orçamentos",icon:FileText,section:"Geral"},{label:"Pedidos",icon:ClipboardList,section:"Geral"},
 {label:"Medição técnica",icon:Search,section:"Operação"},{label:"Produção",icon:Factory,section:"Operação"},
 {label:"Expedição",icon:Truck,section:"Operação"},{label:"Financeiro",icon:WalletCards,section:"Gestão"},
 {label:"Configurações",icon:Settings,section:"Gestão"}];

const demoOrders:DashboardOrder[]=[
 {id:"demo-1048",order_number:"#1048",customer_name:"Residencial Beira Mar",project_name:"Cozinha + ilha",status:"Produção",total_amount:18420},
 {id:"demo-1047",order_number:"#1047",customer_name:"Casa Almeida",project_name:"Bancadas",status:"Acabamento",total_amount:9860},
 {id:"demo-1046",order_number:"#1046",customer_name:"Apartamento 302",project_name:"Banheiros",status:"Medição",total_amount:14250}
];

function money(value:number){return value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}

function App(){
 const [active,setActive]=useState("Dashboard"),[search,setSearch]=useState(""),[notice,setNotice]=useState(false),[budget,setBudget]=useState(false),[toast,setToast]=useState("");
 const [orders,setOrders]=useState<DashboardOrder[]>(demoOrders);
 const [loading,setLoading]=useState(false);
 const [dataError,setDataError]=useState("");

 useEffect(()=>{
   if(!supabaseConfigured) return;
   let mounted=true;
   setLoading(true);
   loadDashboardOrders()
     .then(rows=>{if(mounted)setOrders(rows);})
     .catch(error=>{if(mounted)setDataError(error instanceof Error?error.message:"Não foi possível carregar os pedidos.");})
     .finally(()=>{if(mounted)setLoading(false);});
   return ()=>{mounted=false;};
 },[]);

 const filtered=useMemo(()=>{
   const q=search.trim().toLowerCase();
   return q?orders.filter(r=>[r.order_number,r.customer_name??"",r.project_name??"",r.status].some(v=>v.toLowerCase().includes(q))):orders;
 },[search,orders]);

 const msg=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),2600);};
 const nav=(s:string)=>{setActive(s);};

 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><span className="brand-mark">F</span><div><strong>FERRAZ</strong><small>Gestão para Marmorarias</small></div></div>
   <button className="company" onClick={()=>msg("Seletor de empresa preparado.")}><span className="avatar">F</span><div><strong>Ferraz Mármores</strong><small>Empresa atual</small></div><ChevronDown size={15}/></button>
   <nav>{["Geral","Operação","Gestão"].map(section=><div key={section}><span className="nav-label">{section}</span>{navItems.filter(n=>n.section===section).map(({label,icon:Icon})=><button key={label} className={active===label?"nav-item active":"nav-item"} onClick={()=>nav(label)}><Icon size={18}/>{label}</button>)}</div>)}</nav>
   <div className="sidebar-foot">FERRAZ CORE <span>v0.1</span></div>
  </aside>
  <main className="main">
   <header><div><span className="eyebrow">{active==="Dashboard"?"VISÃO GERAL":"MÓDULO"}</span><h1>{active}</h1><p>{active==="Dashboard"?"Acompanhe o que precisa de atenção hoje.":"Estrutura funcional em evolução."}</p></div>
    <div className="header-actions"><label className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar" aria-label="Buscar no FERRAZ"/></label>
     <button className="icon-btn" onClick={()=>setNotice(true)} aria-label="Abrir notificações"><Bell size={19}/><i/></button><button className="primary" onClick={()=>setBudget(true)}><Plus size={18}/>Novo orçamento</button><button className="user" onClick={()=>msg("Perfil preparado.")}>AF</button>
    </div>
   </header>
   {active==="Dashboard"?<>
    <section className="cards">
      {[["Pedidos carregados",loading?"…":String(orders.length),supabaseConfigured?"Fonte Supabase":"Modo demonstração",ClipboardList],["Pedidos ativos",loading?"…":String(orders.filter(o=>o.status!=="Concluído").length),supabaseConfigured?"Dados oficiais":"Dados demonstrativos",Factory],["Valor em pedidos",loading?"…":money(orders.reduce((sum,o)=>sum+o.total_amount,0)),"Soma dos pedidos exibidos",WalletCards],["Status","Online","Núcleo FERRAZ",LayoutDashboard]].map(([label,value,meta,Icon])=><article className="metric" key={String(label)}><div className="metric-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><small>{meta}</small></article>)}
    </section>
    {dataError&&<div className="data-warning" role="alert">Não foi possível carregar os dados do Supabase. A tela está preservando o último conjunto demonstrativo para não ficar vazia.</div>}
    <section className="grid"><article className="panel large"><div className="panel-head"><div><span className="eyebrow">OPERAÇÃO</span><h2>Pedidos em andamento</h2></div><button onClick={()=>nav("Pedidos")}>Ver todos <ArrowUpRight size={13}/></button></div>
     <div className="table">{filtered.length?filtered.map(r=><button className="row" key={r.id} onClick={()=>msg(r.order_number+" — pasta digital preparada.")}><div><strong>{r.order_number}</strong><span>{r.customer_name??"Cliente não informado"}</span></div><span>{r.project_name??"Obra não informada"}</span><span className="status">{r.status}</span><strong>{money(r.total_amount)}</strong></button>):<div className="empty">Nenhum pedido encontrado.</div>}</div>
    </article><article className="panel"><div className="panel-head"><div><span className="eyebrow">ATENÇÃO</span><h2>Próximos prazos</h2></div></div>
     {[["Hoje","Residencial Beira Mar","Liberação para produção"],["Amanhã","Casa Almeida","Conferência final"],["24 SET","Apartamento 302","Medição técnica"]].map(r=><button className="deadline" key={r[0]+r[1]} onClick={()=>msg(r[1])}><b>{r[0]}</b><span>{r[1]}</span><small>{r[2]}</small></button>)}
    </article></section>
    <section className="quick"><div><span className="eyebrow">ACESSO RÁPIDO</span><h2>Ações frequentes</h2></div><button onClick={()=>setBudget(true)}><FileText/>Criar orçamento</button><button onClick={()=>nav("Clientes e obras")}><Users/>Cadastrar cliente</button><button onClick={()=>nav("Pedidos")}><ClipboardList/>Abrir pedido</button><button onClick={()=>nav("Expedição")}><Truck/>Novo romaneio</button></section>
    <p className="demo-note">{supabaseConfigured?"Dashboard conectado à fonte oficial de pedidos.":"Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar os dados oficiais."}</p>
   </>:<CommercialPanel module={active} search={search} onToast={msg}/>}
  </main>
  {notice&&<div className="overlay" onMouseDown={()=>setNotice(false)}><aside className="drawer" onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">CENTRAL</span><h2>Notificações</h2></div><button className="close" onClick={()=>setNotice(false)}><X/></button></div><div className="notification"><b>Prazo hoje</b><span>Residencial Beira Mar</span><small>Próxima etapa operacional</small></div><div className="notification"><b>Fonte de dados</b><span>{supabaseConfigured?"Supabase conectado":"Modo demonstração"}</span><small>{dataError?"Há uma falha de leitura que precisa ser corrigida.":"Status de configuração"}</small></div></aside></div>}
  {budget&&<div className="overlay" onMouseDown={()=>setBudget(false)}><form className="modal" onSubmit={e=>{e.preventDefault();setBudget(false);msg("Novo orçamento iniciado. A gravação comercial será conectada na próxima etapa.")}} onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">COMERCIAL</span><h2>Novo orçamento</h2></div><button type="button" className="close" onClick={()=>setBudget(false)}><X/></button></div><label>Cliente<input required placeholder="Nome do cliente"/></label><label>Obra<input required placeholder="Nome ou identificação da obra"/></label><div className="modal-actions"><button type="button" className="secondary" onClick={()=>setBudget(false)}>Cancelar</button><button className="primary">Continuar</button></div></form></div>}
  {toast&&<div className="toast" role="status">{toast}</div>}
 </div>
}
export default App;