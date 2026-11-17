import { useEffect,useState } from "react";
import { CreditCard, Wallet, Smartphone, Landmark } from "lucide-react";
import { api } from "../api";
import DataTable from "../components/DataTable";
export default function Payments(){
 const [orders,setOrders]=useState([]);
 useEffect(()=>{api("/orders").then(setOrders).catch(()=>{})},[]);
 const methods=[{name:"Card",icon:CreditCard,color:"purple"},{name:"UPI",icon:Smartphone,color:"mint"},{name:"Wallet",icon:Wallet,color:"amber"},{name:"Bank transfer",icon:Landmark,color:"blue"}];
 return <div className="page-stack"><div className="page-title-row"><div><h1>Payments</h1><p>Review payment methods and the transaction sample from recent orders.</p></div></div>
 <div className="mini-stats-grid">{methods.map(m=><div className="mini-stat" key={m.name}><div className={`mini-stat-icon ${m.color}`}><m.icon size={20}/></div><div><p>{m.name}</p><h2>{orders.filter(o=>o.payment_method===m.name).length} txns</h2></div></div>)}</div>
 <div className="panel table-panel"><div className="table-toolbar"><div><h3>Payment activity</h3><p>Transactions are represented by order payment details.</p></div></div><DataTable columns={[{key:"order_code",label:"Reference"},{key:"customer_name",label:"Customer"},{key:"payment_method",label:"Method"},{key:"amount",label:"Amount",render:v=>`$${Number(v).toFixed(2)}`},{key:"status",label:"Order status"}]} rows={orders}/></div></div>;
}
