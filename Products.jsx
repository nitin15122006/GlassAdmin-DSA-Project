import { useEffect, useState } from "react";
import { Plus, Search, Trash2, PackageOpen } from "lucide-react";
import { api } from "../api";
import DataTable from "../components/DataTable";
import StatusPill from "../components/StatusPill";
export default function Products() {
  const [rows,setRows]=useState([]); const [query,setQuery]=useState(""); const [showForm,setShowForm]=useState(false); const [error,setError]=useState("");
  const [form,setForm]=useState({name:"",category:"Electronics",price:"",stock:""});
  async function load(){try{setRows(await api("/products"));setError("")}catch(e){setError(e.message)}}
  useEffect(()=>{load();const r=()=>load();window.addEventListener("glassadmin:refresh",r);window.addEventListener("glassadmin:export",()=>{});return()=>window.removeEventListener("glassadmin:refresh",r)},[]);
  async function add(e){e.preventDefault();try{await api("/products",{method:"POST",body:JSON.stringify(form)});setForm({name:"",category:"Electronics",price:"",stock:""});setShowForm(false);load()}catch(e){setError(e.message)}}
  async function remove(id){if(!window.confirm("Delete this product?"))return;try{await api(`/products/${id}`,{method:"DELETE"});load()}catch(e){setError(e.message)}}
  const filtered=rows.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-stack"><div className="page-title-row"><div><h1>Products</h1><p>Manage your catalogue, inventory and best sellers.</p></div><button className="primary-btn" onClick={()=>setShowForm(!showForm)}><Plus size={17}/> Add product</button></div>
    {error&&<div className="error-box">{error}</div>}
    {showForm&&<form className="panel product-form" onSubmit={add}><h3>Add a product</h3><div className="form-grid"><label>Product name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Electronics</option><option>Fashion</option><option>Home & Living</option><option>Beauty</option><option>Sports</option></select></label><label>Price ($)<input required min="0" step=".01" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Stock quantity<input min="0" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></label></div><div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary-btn">Save product</button></div></form>}
    <div className="panel table-panel"><div className="table-toolbar"><div><h3>All products <span className="subtle-count">{filtered.length}</span></h3><p>Product catalogue and stock status</p></div><div className="table-search"><Search size={16}/><input placeholder="Search products..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
    <DataTable columns={[{key:"name",label:"Product",render:(v,r)=><div className="product-cell"><div className="product-mini"><PackageOpen size={17}/></div><div><b>{v}</b><small>{r.category}</small></div></div>},{key:"price",label:"Price",render:v=>`$${Number(v).toFixed(2)}`},{key:"stock",label:"Stock"},{key:"units_sold",label:"Units sold"},{key:"status",label:"Status",render:v=><StatusPill value={v}/>},{key:"id",label:"",render:(v)=><button className="table-icon danger" onClick={()=>remove(v)} title="Delete product"><Trash2 size={16}/></button>}]} rows={filtered}/></div>
  </div>;
}
