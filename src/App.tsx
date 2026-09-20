import { Bell, ChevronDown, ClipboardList, Factory, FileText, LayoutDashboard, Plus, Search, Settings, Truck, Users, WalletCards } from "lucide-react";
import "./index.css";

const pipeline=[
  {label:"Orçamentos",value:"18",meta:"6 aguardando retorno",icon:FileText},
  {label:"Pedidos ativos",value:"12",meta:"4 em produção",icon:ClipboardList},
  {label:"Em produção",value:"07",meta:"2 com prazo hoje",icon:Factory},
  {label:"Entregas",value:"05",meta:"3 esta semana",icon:Truck},
];

const orders=[
  ["#1048","Residencial Beira Mar","Cozinha + ilha","Produção","R$ 18.420"],
  ["#1047","Casa Almeida","Bancadas","Acabamento","R$ 9.860"],
  ["#1046","Apartamento 302","Banheiros","Medição","R$ 14.250"],
];

function App(){
  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">F</span><div><strong>FERRAZ</strong><small>Gestão para Marmorarias</small></div></div>
      <div className="company"><span className="avatar">F</span><div><strong>Ferraz Mármores</strong><small>Empresa atual</small></div><ChevronDown size={15}/></div>
      <nav>
        <span className="nav-label">GERAL</span>
        <a className="active"><LayoutDashboard size={18}/>Dashboard</a>
        <a><Users size={18}/>Clientes e obras</a>
        <a><FileText size={18}/>Orçamentos</a>
        <a><ClipboardList size={18}/>Pedidos</a>
        <span className="nav-label">OPERAÇÃO</span>
        <a><Search size={18}/>Medição técnica</a>
        <a><Factory size={18}/>Produção</a>
        <a><Truck size={18}/>Expedição</a>
        <span className="nav-label">GESTÃO</span>
        <a><WalletCards size={18}/>Financeiro</a>
        <a><Settings size={18}/>Configurações</a>
      </nav>
      <div className="sidebar-foot">FERRAZ CORE <span>v0.1</span></div>
    </aside>
    <main className="main">
      <header><div><span className="eyebrow">VISÃO GERAL</span><h1>Dashboard</h1><p>Acompanhe o que precisa de atenção hoje.</p></div><div className="header-actions"><button className="icon-btn"><Bell size={19}/><i/></button><button className="primary"><Plus size={18}/>Novo orçamento</button><div className="user">AF</div></div></header>
      <section className="cards">{pipeline.map(({label,value,meta,icon:Icon})=><article className="metric" key={label}><div className="metric-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><small>{meta}</small></article>)}</section>
      <section className="grid">
        <article className="panel large"><div className="panel-head"><div><span className="eyebrow">OPERAÇÃO</span><h2>Pedidos em andamento</h2></div><button>Ver todos →</button></div><div className="table">{orders.map(([id,client,detail,status,total])=><div className="row" key={id}><div><strong>{id}</strong><span>{client}</span></div><span>{detail}</span><span className={"status "+status.toLowerCase()}>{status}</span><strong>{total}</strong></div>)}</div></article>
        <article className="panel"><div className="panel-head"><div><span className="eyebrow">ATENÇÃO</span><h2>Próximos prazos</h2></div></div><div className="deadline"><b>Hoje</b><span>Residencial Beira Mar</span><small>Liberação para produção</small></div><div className="deadline"><b>Amanhã</b><span>Casa Almeida</span><small>Conferência final</small></div><div className="deadline"><b>24 SET</b><span>Apartamento 302</span><small>Medição técnica</small></div></article>
      </section>
      <section className="quick"><div><span className="eyebrow">ACESSO RÁPIDO</span><h2>Ações frequentes</h2></div><button><FileText/>Criar orçamento</button><button><Users/>Cadastrar cliente</button><button><ClipboardList/>Abrir pedido</button><button><Truck/>Novo romaneio</button></section>
    </main>
  </div>
}
export default App;