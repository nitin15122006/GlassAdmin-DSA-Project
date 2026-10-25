import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Activity, Box, DollarSign, ShoppingBag, Users, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { api } from "../api";
import StatCard from "../components/StatCard";
import ChartPanel from "../components/ChartPanel";
import DataTable from "../components/DataTable";
import StatusPill from "../components/StatusPill";

const money = v => "$" + Number(v || 0).toLocaleString("en-US",{maximumFractionDigits:0});
export default function Dashboard() {
  const { refreshPage, exportPage } = useOutletContext();
  const [data,setData] = useState(null);
  const [error,setError] = useState("");
  async function load() { try { setData(await api("/dashboard")); setError(""); } catch(e) { setError(e.message); } }
  useEffect(()=>{ load(); const r=()=>load(); const x=()=>downloadCsv(data?.orders || [],"recent-orders.csv"); window.addEventListener("glassadmin:refresh",r); window.addEventListener("glassadmin:export",x); return ()=>{window.removeEventListener("glassadmin:refresh",r);window.removeEventListener("glassadmin:export",x)}; },[]);
  const kpis = data?.kpis || [
    {label:"Total Revenue",value:"$124,563.00",change:"+12.5%",tone:"positive"},
    {label:"Total Orders",value:"3,842",change:"+8.2%",tone:"positive"},
    {label:"New Customers",value:"1,257",change:"+15.3%",tone:"positive"},
    {label:"Products Sold",value:"8,492",change:"-2.4%",tone:"negative"}
  ];
  const icons = [DollarSign,ShoppingBag,Users,Box];
  const sales = data?.monthlySales || [];
  const categories = data?.categories || [];
  const orders = data?.orders || [];
  return <div className="page-stack">
    <div className="page-title-row"><div><h1>Dashboard Overview</h1><p>{data?.source === "uploaded" ? `Live metrics from ${data.filename}.` : "Welcome back! Here's what's happening with your store."}</p></div><div className="title-actions"><button className="secondary-btn" onClick={()=>downloadCsv(orders,"orders.csv")}>Export</button><button className="secondary-btn" onClick={load}><Activity size={15}/> Refresh</button></div></div>
    {error && <div className="error-box">{error}</div>}
    <div className="stats-grid">{kpis.map((k,i)=><StatCard key={k.label} {...k} icon={icons[i]} index={i}/>)}</div>
    <div className="dashboard-grid">
      <ChartPanel title="Sales Overview" subtitle="Monthly sales performance" className="sales-panel"><div className="chart-legend"><span><i className="legend-dot purple"/> Revenue</span><span className="chart-period">Jan — Dec</span></div>
        <ResponsiveContainer width="100%" height={285}><AreaChart data={sales} margin={{top:16,right:10,left:0,bottom:0}}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a56aff" stopOpacity={.38}/><stop offset="100%" stopColor="#a56aff" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" stroke="rgba(190,190,220,.09)" vertical={true}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:"#9399b4",fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:"#9399b4",fontSize:11}} tickFormatter={v=>`${v/1000}k`} width={38}/><Tooltip contentStyle={{background:"#191d32",border:"1px solid #383653",borderRadius:12,color:"#fff"}} formatter={v=>money(v)}/><Area type="monotone" dataKey="revenue" stroke="#a56aff" strokeWidth={3} fill="url(#salesFill)" activeDot={{r:5,fill:"#c5a0ff"}}/></AreaChart></ResponsiveContainer>
      </ChartPanel>
      <ChartPanel title="Revenue by Category" subtitle="Best performing categories"><ResponsiveContainer width="100%" height={285}><BarChart data={categories.slice(0,5).map(c=>({name:c.name,value:c.sales}))} layout="vertical" margin={{left:4,right:8}}><CartesianGrid strokeDasharray="3 5" stroke="rgba(190,190,220,.08)" horizontal={false}/><XAxis type="number" hide/><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill:"#a5abc3",fontSize:11}} width={82}/><Tooltip contentStyle={{background:"#191d32",border:"1px solid #383653",borderRadius:12}}/><Bar dataKey="value" fill="#8f62e9" radius={[0,7,7,0]} barSize={18}/></BarChart></ResponsiveContainer></ChartPanel>
      <ChartPanel title="Recent Orders" subtitle="Latest activity" className="recent-orders"><DataTable columns={[{key:"order_code",label:"Order ID"},{key:"customer_name",label:"Customer"},{key:"amount",label:"Amount",render:v=>money(v)},{key:"status",label:"Status",render:v=><StatusPill value={v}/>}]} rows={orders.slice(0,5)}/></ChartPanel>
      <section className="panel insights-panel"><div className="panel-heading"><div><h3>Quick insights</h3><p>Signals worth your attention</p></div><MoreHorizontal size={20}/></div><div className="insight-item"><div className="insight-icon mint"><ArrowUpRight size={17}/></div><div><b>Revenue is trending up</b><p>Monthly revenue has risen across the latest periods.</p></div></div><div className="insight-item"><div className="insight-icon violet"><Users size={17}/></div><div><b>Returning customers matter</b><p>Review repeat purchase behaviour to improve retention.</p></div></div><div className="insight-item"><div className="insight-icon amber"><Box size={17}/></div><div><b>Check low inventory</b><p>Keep popular products in stock before demand peaks.</p></div></div></section>
    </div>
  </div>;
}
function downloadCsv(rows, name) {
  if (!rows?.length) return;
  const keys = Object.keys(rows[0]); const esc = value => `"${String(value ?? "").replace(/"/g,'""')}"`;
  const csv = [keys.join(","), ...rows.map(r=>keys.map(k=>esc(r[k])).join(","))].join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=name;a.click();URL.revokeObjectURL(a.href);
}
