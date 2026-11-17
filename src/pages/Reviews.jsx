import { useEffect,useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { api } from "../api";
import StatusPill from "../components/StatusPill";
export default function Reviews(){
 const [rows,setRows]=useState([]);
 useEffect(()=>{api("/reviews").then(setRows).catch(()=>{})},[]);
 const avg=rows.length?rows.reduce((s,r)=>s+r.rating,0)/rows.length:0;
 return <div className="page-stack"><div className="page-title-row"><div><h1>Reviews</h1><p>Monitor product feedback and customer satisfaction.</p></div><div className="page-chip"><MessageSquare size={16}/>{rows.length} sample reviews</div></div>
 <div className="mini-stats-grid"><div className="mini-stat"><div className="mini-stat-icon amber"><Star size={20}/></div><div><p>Average rating</p><h2>{avg.toFixed(1)} / 5</h2></div></div><div className="mini-stat"><div className="mini-stat-icon mint"><MessageSquare size={20}/></div><div><p>Published reviews</p><h2>{rows.filter(r=>r.status==="Published").length}</h2></div></div><div className="mini-stat"><div className="mini-stat-icon purple"><MessageSquare size={20}/></div><div><p>Pending moderation</p><h2>{rows.filter(r=>r.status==="Pending").length}</h2></div></div></div>
 <div className="reviews-grid">{rows.map(r=><article className="panel review-card" key={r.id}><div className="review-top"><div className="avatar small-avatar">{r.customer.split(" ").map(n=>n[0]).join("")}</div><div className="review-author"><b>{r.customer}</b><small>{r.date}</small></div><StatusPill value={r.status}/></div><div className="stars">{Array.from({length:5},(_,i)=><Star key={i} size={15} fill={i<r.rating?"currentColor":"none"} />)}</div><p className="review-product">{r.product}</p><p className="review-comment">{r.comment}</p></article>)}</div>
 </div>;
}
