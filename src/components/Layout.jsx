import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Download, RefreshCw } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { clearSession, getUser } from "../api";

const titleMap = {
  "/":"Dashboard Overview", "/products":"Products", "/orders":"Orders",
  "/customers":"Customers", "/payments":"Payments", "/analytics":"Analytics", "/dataset":"Dataset Upload",
  "/forecast":"Sales Forecast", "/discounts":"Discounts & Coupons",
  "/reviews":"Reviews", "/settings":"Settings"
};
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const exportPage = () => window.dispatchEvent(new CustomEvent("glassadmin:export"));
  const refreshPage = () => window.dispatchEvent(new CustomEvent("glassadmin:refresh"));
  function logout() { clearSession(); navigate("/login"); }
  const title = titleMap[location.pathname] || "Dashboard";
  return <div className="app-shell">
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout}/>
    <main className="main-area">
      <Topbar user={user} title={title} onRefresh={refreshPage} onExport={exportPage}/>
      <div className="page-content">
        <div className="breadcrumb"><span>Home</span><b>›</b><strong>{title.replace(" Overview","")}</strong></div>
        <Outlet context={{ user, title, exportPage, refreshPage }}/>
      </div>
    </main>
  </div>;
}
