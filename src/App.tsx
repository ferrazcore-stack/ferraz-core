import { useMemo, useState } from "react";
import {
  Bell, ChevronDown, ClipboardList, Factory, FileText, LayoutDashboard,
  Plus, Search, Settings, Truck, Users, WalletCards, X, ArrowUpRight
} from "lucide-react";
import "./index.css";

type NavItem = { label: string; icon: typeof LayoutDashboard; section: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, section: "Geral" },
  { label: "Clientes e obras", icon: Users, section: "Geral" },
  { label: "Orçamentos", icon: FileText, section: "Geral" },
  { label: "Pedidos", icon: ClipboardList, section: "Geral" },
  { label: "Medição técnica", icon: Search, section: "Operação" },
  { label: "Produção", icon: Factory, section: "Operação" },
  { label: "Expedição", icon: Truck, section: "Operação" },
  { label: "Financeiro", icon: WalletCards, section: "Gestão" },
  { label: "Configurações", icon: Settings, section: "Gestão" },
];

const pipeline = [
  { label: "Orçamentos", value: "18", meta: "6 aguardando retorno", icon: FileText },
  { label: "Pedidos ativos", value: "12", meta: "4 em produção", icon: ClipboardList },
  { label: "Em produção", value: "07", meta: "2 com prazo hoje", icon: Factory },
  { label: "Entregas", value: "05", meta: "3 esta semana", icon: Truck },
];

const orders = [
  { id: "#1048", client: "Residencial Beira Mar", detail: "Cozinha + ilha", status: "Produção", total: "R$ 18.420" },
  { id: "#1047", client: "Casa Almeida", detail: "Bancadas", status: "Acabamento", total: "R$ 9.860" },
  { id: "#1046", client: "Apartamento 302", detail: "Banheiros", status: "Medição", total: "R$ 14.250" },
];

const deadlines = [
  { date: "Hoje", title: "Residencial Beira Mar", detail: "Liberação para produção" },
  { date: "Amanhã", title: "Casa Almeida", detail: "Conferência final" },
  { date: "24 SET", title: "Apartamento 302", detail: "Medição técnica" },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [toast, setToast] = useState("");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) =>
      [order.id, order.client, order.detail, order.status].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [search]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleNav = (label: string) => {
    setActive(label);
    if (label !== "Dashboard") showToast(`${label}: módulo preparado para a próxima etapa.`);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">F</span>
          <div><strong>FERRAZ</strong><small>Gestão para Marmorarias</small></div>
        </div>

        <button className="company" onClick={() => showToast("Seletor de empresa preparado.")}>
          <span className="avatar">F</span>
          <div><strong>Ferraz Mármores</strong><small>Empresa atual</small></div>
          <ChevronDown size={15} />
        </button>

        <nav>
          {["Geral", "Operação", "Gestão"].map((section) => (
            <div key={section}>
              <span className="nav-label">{section}</span>
              {navItems.filter((item) => item.section === section).map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className={active === label ? "nav-item active" : "nav-item"}
                  onClick={() => handleNav(label)}
                >
                  <Icon size={18} />{label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">FERRAZ CORE <span>v0.1</span></div>
      </aside>

      <main className="main">
        <header>
          <div>
            <span className="eyebrow">VISÃO GERAL</span>
            <h1>{active}</h1>
            <p>{active === "Dashboard" ? "Acompanhe o que precisa de atenção hoje." : "Estrutura funcional em evolução."}</p>
          </div>
          <div className="header-actions">
            <label className="search-box">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" aria-label="Buscar no FERRAZ" />
            </label>
            <button className="icon-btn" onClick={() => setNotificationsOpen(true)} aria-label="Abrir notificações">
              <Bell size={19} /><i />
            </button>
            <button className="primary" onClick={() => setBudgetOpen(true)}>
              <Plus size={18} />Novo orçamento
            </button>
            <button className="user" onClick={() => showToast("Perfil preparado.")}>AF</button>
          </div>
        </header>

        {active === "Dashboard" ? (
          <>
            <section className="cards">
              {pipeline.map(({ label, value, meta, icon: Icon }) => (
                <article className="metric" key={label}>
                  <div className="metric-top"><span>{label}</span><Icon size={18} /></div>
                  <strong>{value}</strong><small>{meta}</small>
                </article>
              ))}
            </section>

            <section className="grid">
              <article className="panel large">
                <div className="panel-head">
                  <div><span className="eyebrow">OPERAÇÃO</span><h2>Pedidos em andamento</h2></div>
                  <button onClick={() => handleNav("Pedidos")}>Ver todos <ArrowUpRight size={13} /></button>
                </div>
                <div className="table">
                  {filteredOrders.length ? filteredOrders.map((order) => (
                    <button className="row" key={order.id} onClick={() => showToast(`${order.id} — pasta digital preparada.`)}>
                      <div><strong>{order.id}</strong><span>{order.client}</span></div>
                      <span>{order.detail}</span>
                      <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
                      <strong>{order.total}</strong>
                    </button>
                  )) : <div className="empty">Nenhum pedido encontrado.</div>}
                </div>
              </article>

              <article className="panel">
                <div className="panel-head">
                  <div><span className="eyebrow">ATENÇÃO</span><h2>Próximos prazos</h2></div>
                </div>
                {deadlines.map((item) => (
                  <button className="deadline" key={item.date + item.title} onClick={() => showToast(item.title)}>
                    <b>{item.date}</b><span>{item.title}</span><small>{item.detail}</small>
                  </button>
                ))}
              </article>
            </section>

            <section className="quick">
              <div><span className="eyebrow">ACESSO RÁPIDO</span><h2>Ações frequentes</h2></div>
              <button onClick={() => setBudgetOpen(true)}><FileText />Criar orçamento</button>
              <button onClick={() => handleNav("Clientes e obras")}><Users />Cadastrar cliente</button>
              <button onClick={() => handleNav("Pedidos")}><ClipboardList />Abrir pedido</button>
              <button onClick={() => handleNav("Expedição")}><Truck />Novo romaneio</button>
            </section>

            <p className="demo-note">Dados exibidos nesta primeira casca são demonstrativos. A próxima etapa conecta cada ação às fontes oficiais do Supabase.</p>
          </>
        ) : (
          <section className="module-placeholder panel">
            <div className="placeholder-icon"><LayoutDashboard size={22} /></div>
            <span className="eyebrow">MÓDULO</span>
            <h2>{active}</h2>
            <p>A navegação já está estruturada. Vamos implementar este módulo sem duplicar regras ou dados.</p>
            <button className="primary" onClick={() => setActive("Dashboard")}>Voltar ao Dashboard</button>
          </section>
        )}
      </main>

      {notificationsOpen && (
        <div className="overlay" onMouseDown={() => setNotificationsOpen(false)}>
          <aside className="drawer" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><span className="eyebrow">CENTRAL</span><h2>Notificações</h2></div><button className="close" onClick={() => setNotificationsOpen(false)}><X /></button></div>
            <div className="notification"><b>Prazo hoje</b><span>Residencial Beira Mar</span><small>Liberação para produção</small></div>
            <div className="notification"><b>Retorno pendente</b><span>6 orçamentos aguardam contato</span><small>Dados demonstrativos</small></div>
          </aside>
        </div>
      )}

      {budgetOpen && (
        <div className="overlay" onMouseDown={() => setBudgetOpen(false)}>
          <form className="modal" onSubmit={(event) => { event.preventDefault(); setBudgetOpen(false); showToast("Novo orçamento iniciado."); }} onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><span className="eyebrow">COMERCIAL</span><h2>Novo orçamento</h2></div><button type="button" className="close" onClick={() => setBudgetOpen(false)}><X /></button></div>
            <label>Cliente<input required placeholder="Nome do cliente" /></label>
            <label>Obra<input required placeholder="Nome ou identificação da obra" /></label>
            <div className="modal-actions"><button type="button" className="secondary" onClick={() => setBudgetOpen(false)}>Cancelar</button><button className="primary">Continuar</button></div>
          </form>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default App;
