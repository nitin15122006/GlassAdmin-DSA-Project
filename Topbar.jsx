import { Bell, Search, Sun, Moon, Download, RefreshCw, ChevronDown } from "lucide-react";
import { useState } from "react";
export default function Topbar({ user, title, onRefresh, onExport }) {
  const [dark, setDark] = useState(true);
  return <header className="topbar">
    <div className="search-wrap"><Search size={17}/><input placeholder="Search..." aria-label="Search dashboard" /></div>
    <div className="topbar-actions">
      {onExport && <button className="icon-btn optional-action" onClick={onExport} title="Export CSV"><Download size={17}/></button>}
      {onRefresh && <button className="icon-btn optional-action" onClick={onRefresh} title="Refresh data"><RefreshCw size={17}/></button>}
      <button className="icon-btn" onClick={() => { setDark(!dark); document.body.classList.toggle("light-mode"); }} title="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
      <button className="icon-btn notification" title="Notifications"><Bell size={18}/><i/></button>
      <div className="profile-chip"><div className="avatar">{(user?.name || "JD").split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div className="profile-text"><b>{user?.name || "John Doe"}</b><span>{user?.role || "Admin"}</span></div><ChevronDown size={14}/></div>
    </div>
  </header>;
}
