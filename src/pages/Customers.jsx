import { useEffect,useState } from "react";
import { Users, Search, Crown, UserRound, Repeat2 } from "lucide-react";
import { api } from "../api";
import DataTable from "../components/DataTable";
export default function Customers(){
 const [rows,setRows]=useState([]);const [query,setQuery]=useState("");
 useEffect(()=>{api("/customers").then(setRows).catch(()=>{});const r=()=>api("/customers").then(setRows).catch(()=>{});window.addEventListener("glassadmin:refresh",r);return()=>window.removeEventListener("glassadmin:refresh",r)},[]);
 const filtered=rows.filter(c=>`${c.name} ${c.email} ${c.region}`.toLowerCase().includes(query.toLowerCase()));
 const vip=rows.filter(c=>c.segment==="VIP").length, returning=rows.filter(c=>c.segment==="Returning").length;
 return <div className="page-stack"><div className="page-title-row"><div><h1>Customer Insights</h1><p>Understand customer value, segments and repeat behaviour.</p></div><div className="page-chip"><Users size={16}/>{rows.length} sample customers</div></div>
 <div className="mini-stats-grid"><Mini icon={Crown} label="VIP customers" value={vip} tone="purple"/><Mini icon={Repeat2} label="Returning" value={returning} tone="mint"/><Mini icon={UserRound} label="New customers" value={rows.filter(c=>c.segment==="New").length} tone="blue"/></div>
 <div className="panel table-panel"><div className="table-toolbar"><div><h3>Customer directory</h3><p>Customer lifetime value and purchase frequency</p></div><div className="table-search"><Search size={16}/><input placeholder="Search customers..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><DataTable columns={[{key:"name",label:"Customer",render:(v,r)=><div className="customer-cell"><div className="avatar small-avatar">{v.split(" ").map(n=>n[0]).join("")}</div><div><b>{v}</b><small>{r.email}</small></div></div>},{key:"segment",label:"Segment",render:v=><span className={`segment-pill ${v.toLowerCase()}`}>{v}</span>},{key:"orders_count",label:"Orders"},{key:"lifetime_value",label:"Lifetime value",render:v=><b className="text-bright">${Number(v).toLocaleString("en-US",{minimumFractionDigits:2})}</b>},{key:"region",label:"Region"}]} rows={filtered}/></div>
 </div>;
}
function Mini({icon:Icon,label,value,tone}){return <div className="mini-stat"><div className={`mini-stat-icon ${tone}`}><Icon size={20}/></div><div><p>{label}</p><h2>{value}</h2></div></div>}
