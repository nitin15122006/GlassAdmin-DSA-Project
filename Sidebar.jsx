import { NavLink } from "react-router-dom";
import { Activity, BarChart3, Box, ChevronLeft, CircleHelp, CreditCard, LayoutDashboard, LogOut, MessageSquare, Package, Settings, ShoppingCart, Sparkles, Tag, Users, TrendingUp, Database } from "lucide-react";

const primary = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Box },
  { to: "/orders", label: "Orders", icon: ShoppingCart, count: "12" },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dataset", label: "Dataset Upload", icon: Database },
  { to: "/forecast", label: "Sales Forecast", icon: TrendingUp },
  { to: "/discounts", label: "Discounts & Coupons", icon: Tag },
  { to: "/reviews", label: "Reviews", icon: MessageSquare }
];
export default function Sidebar({ collapsed, setCollapsed, onLogout }) {
  return <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
    <div className="brand-row"><div className="brand-mark">G</div>{!collapsed && <span className="brand-name">GlassAdmin</span>}<button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} title="Collapse sidebar"><ChevronLeft size={17}/></button></div>
    <div className="nav-group">
      {primary.map(item => <NavLink key={item.to} to={item.to} end={item.end} className={({isActive}) => `nav-item ${isActive ? "active" : ""}`} title={collapsed ? item.label : undefined}>
        <item.icon size={19}/>{!collapsed && <><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}</>}
      </NavLink>)}
    </div>
    <div className="sidebar-bottom">
      <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}><Settings size={19}/>{!collapsed && <span>Settings</span>}</NavLink>
      <button className="nav-item logout-item" onClick={onLogout}><LogOut size={19}/>{!collapsed && <span>Logout</span>}</button>
      {!collapsed && <div className="sidebar-help"><Sparkles size={16}/><div><b>Need a hand?</b><span>Explore your insights</span></div><CircleHelp size={16}/></div>}
      <div className="sidebar-foot"><Activity size={14}/>{!collapsed && <span>Commerce intelligence</span>}</div>
    </div>
  </aside>;
}
