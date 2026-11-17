import { ArrowDownRight, ArrowUpRight } from "lucide-react";
export default function StatCard({ icon: Icon, label, value, change, tone = "positive", index = 0 }) {
  return <article className={`stat-card stat-${index}`} style={{animationDelay:`${index * 70}ms`}}>
    <div className="stat-top"><div className="stat-icon"><Icon size={23}/></div><span className={`stat-change ${tone}`}>{tone === "negative" ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} {change}</span></div>
    <p>{label}</p><h2>{value}</h2>
  </article>;
}
