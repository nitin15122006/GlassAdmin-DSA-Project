import { useEffect, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { api } from "../api";
import DataTable from "../components/DataTable";
import StatusPill from "../components/StatusPill";
export default function Orders(){
 const [rows,setRows]=useState([]);const [query,setQuery]=useState("");const [status,setStatus]=useState("All");
 async function load(){try{setRows(await api("/orders"))}catch{}}
 useEffect(()=>{load();const r=()=>load();window.addEventListener("glassadmin:refresh",r);return()=>window.removeEventListener("glassadmin:refresh",r)},[]);
 const filtered=rows.filter(o=>`${o.order_code} ${o.customer_name}`.toLowerCase().includes(query.toLowerCase())&&(status==="All"||o.status===status));
 return <div className="page-stack"><div className="page-title-row"><div><h1>Orders</h1><p>Track order activity, payment and fulfilment status.</p></div><div className="page-chip"><ShoppingCart size={16}/>{rows.length} total orders</div></div>
 <div className="panel table-panel"><div className="table-toolbar"><div><h3>Order history</h3><p>Search and filter your orders</p></div><div className="toolbar-controls"><div className="table-search"><Search size={16}/><input placeholder="Search orders..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></div></div>
 <DataTable columns={[{key:"order_code",label:"Order ID",render:v=><b className="text-bright">{v}</b>},{key:"customer_name",label:"Customer",render:(v,r)=><div><b>{v}</b><small className="table-subline">{r.customer_email}</small></div>},{key:"order_date",label:"Date"},{key:"amount",label:"Amount",render:v=>`$${Number(v).toFixed(2)}`},{key:"payment_method",label:"Payment"},{key:"status",label:"Status",render:v=><StatusPill value={v}/>}]} rows={filtered}/></div></div>;
}
