import { useMemo, useState } from "react";
import { Bell, ChevronDown, ClipboardList, Factory, FileText, LayoutDashboard, Plus, Search, Settings, Truck, Users, WalletCards, X, ArrowUpRight } from "lucide-react";
import "./index.css";

type NavItem={label:string;icon:typeof LayoutDashboard;section:string};
const navItems:NavItem[]=[
 {label:"Dashboard",icon:LayoutDashboard,section:"Geral"},{label:"Clientes e obras",icon:Users,section:"Geral"},
 {label:"Orçamentos",icon:FileText,section:"Geral"},{label:"Pedidos",icon:ClipboardList,section:"Geral"},
 {label:"Medição técnica",icon:Search,section:"Operação"},{label:"Produção",icon:Factory,section:"Operação"},
 {label:"Expedição",icon:Truck,section:"Operação"},{label:"Financeiro",icon:WalletCards,section:"Gestão"},
 {label:"Configurações",icon:Settings,section:"Gestão"}];
const pipeline=[["Orçamentos","18","6 aguardando retorno",FileText],["Pedidos ativos","12","4 em produção",ClipboardList],["Em produção","07","2 com prazo hoje",Factory],["Entregas","05","3 esta semana",Truck]] as const;
const orders=[["#1048","Residencial Beira Mar","Cozinha + ilha","Produção","R$ 18.420"],["#1047","Casa Almeida","Bancadas","Acabamento","R$ 9.860"],["#1046","Apartamento 302","Banheiros","Medição","R$ 14.250"]];

function App(){
 const [active,setActive]=useState("Dashboard"),[search,setSearch]=useState(""),[notice,setNotice]=useState(false),[budget,setBudget]=useState(false),[toast,setToast]=useState("");
 const filtered=useMemo(()=>{const q=search.trim().toLowerCase();return q?orders.filter(r=>r.some(v=>v.toLowerCase().includes(q))):orders},[search]);
 const msg=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),2600)};
 const nav=(s:string)=>{setActive(s);if(s!=="Dashboard")msg(s+": módulo preparado para a próxima etapa.")};
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
   {active==="Dashboard"?<><section className="cards">{pipeline.map(([label,value,meta,Icon])=><article className="metric" key={label}><div className="metric-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><small>{meta}</small></article>)}</section>
    <section className="grid"><article className="panel large"><div className="panel-head"><div><span className="eyebrow">OPERAÇÃO</span><h2>Pedidos em andamento</h2></div><button onClick={()=>nav("Pedidos")}>Ver todos <ArrowUpRight size={13}/></button></div>
     <div className="table">{filtered.length?filtered.map(r=><button className="row" key={r[0]} onClick={()=>msg(r[0]+" — pasta digital preparada.")}><div><strong>{r[0]}</strong><span>{r[1]}</span></div><span>{r[2]}</span><span className="status">{r[3]}</span><strong>{r[4]}</strong></button>):<div className="empty">Nenhum pedido encontrado.</div>}</div>
    </article><article className="panel"><div className="panel-head"><div><span className="eyebrow">ATENÇÃO</span><h2>Próximos prazos</h2></div></div>
     {[["Hoje","Residencial Beira Mar","Liberação para produção"],["Amanhã","Casa Almeida","Conferência final"],["24 SET","Apartamento 302","Medição técnica"]].map(r=><button className="deadline" key={r[0]+r[1]} onClick={()=>msg(r[1])}><b>{r[0]}</b><span>{r[1]}</span><small>{r[2]}</small></button>)}
    </article></section>
    <section className="quick"><div><span className="eyebrow">ACESSO RÁPIDO</span><h2>Ações frequentes</h2></div><button onClick={()=>setBudget(true)}><FileText/>Criar orçamento</button><button onClick={()=>nav("Clientes e obras")}><Users/>Cadastrar cliente</button><button onClick={()=>nav("Pedidos")}><ClipboardList/>Abrir pedido</button><button onClick={()=>nav("Expedição")}><Truck/>Novo romaneio</button></section>
    <p className="demo-note">Dados desta primeira casca são demonstrativos. As ações serão conectadas às fontes oficiais do Supabase por etapa.</p>
   </>:<section className="module-placeholder panel"><div className="placeholder-icon"><LayoutDashboard size={22}/></div><span className="eyebrow">MÓDULO</span><h2>{active}</h2><p>A navegação está estruturada. Este módulo será implementado sem duplicar regras ou dados.</p><button className="primary" onClick={()=>setActive("Dashboard")}>Voltar ao Dashboard</button></section>}
  </main>
  {notice&&<div className="overlay" onMouseDown={()=>setNotice(false)}><aside className="drawer" onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">CENTRAL</span><h2>Notificações</h2></div><button className="close" onClick={()=>setNotice(false)}><X/></button></div><div className="notification"><b>Prazo hoje</b><span>Residencial Beira Mar</span><small>Liberação para produção</small></div><div className="notification"><b>Retorno pendente</b><span>6 orçamentos aguardam contato</span><small>Dados demonstrativos</small></div></aside></div>}
  {budget&&<div className="overlay" onMouseDown={()=>setBudget(false)}><form className="modal" onSubmit={e=>{e.preventDefault();setBudget(false);msg("Novo orçamento iniciado.")}} onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">COMERCIAL</span><h2>Novo orçamento</h2></div><button type="button" className="close" onClick={()=>setBudget(false)}><X/></button></div><label>Cliente<input required placeholder="Nome do cliente"/></label><label>Obra<input required placeholder="Nome ou identificação da obra"/></label><div className="modal-actions"><button type="button" className="secondary" onClick={()=>setBudget(false)}>Cancelar</button><button className="primary">Continuar</button></div></form></div>}
  {toast&&<div className="toast" role="status">{toast}</div>}
 </div>
}
export default App;