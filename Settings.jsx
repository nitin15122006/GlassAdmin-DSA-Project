import { useEffect,useState } from "react";
import { Bell, ShieldCheck, SlidersHorizontal, UserRound, Database, CheckCircle2 } from "lucide-react";
import { api } from "../api";
export default function Settings(){
 const [data,setData]=useState(null);const [notifications,setNotifications]=useState(true);const [compact,setCompact]=useState(false);const [saved,setSaved]=useState(false);
 useEffect(()=>{api("/settings").then(d=>{setData(d);setNotifications(d.preferences.notifications);setCompact(d.preferences.compactMode)}).catch(()=>{})},[]);
 function save(){setSaved(true);setTimeout(()=>setSaved(false),2200)}
 return <div className="page-stack"><div className="page-title-row"><div><h1>Settings</h1><p>Manage your workspace profile and dashboard preferences.</p></div></div>
 <div className="settings-layout"><div className="settings-menu panel"><div className="settings-menu-item selected"><UserRound size={18}/> Profile</div><div className="settings-menu-item"><Bell size={18}/> Notifications</div><div className="settings-menu-item"><SlidersHorizontal size={18}/> Preferences</div><div className="settings-menu-item"><ShieldCheck size={18}/> Security</div></div>
 <div className="settings-content panel"><div className="settings-section-title"><div className="settings-section-icon"><UserRound size={19}/></div><div><h3>Profile information</h3><p>Account details for this local demo workspace.</p></div></div>
 <div className="profile-settings"><div className="avatar profile-avatar">{(data?.profile?.name||"JD").split(" ").map(x=>x[0]).join("")}</div><div><b>{data?.profile?.name||"John Doe"}</b><p>{data?.profile?.email||"admin@example.com"}</p><span className="segment-pill vip">{data?.profile?.role||"Admin"}</span></div></div>
 <div className="settings-divider"/><div className="settings-section-title"><div className="settings-section-icon"><SlidersHorizontal size={19}/></div><div><h3>Preferences</h3><p>Customize the dashboard experience.</p></div></div>
 <SettingToggle icon={Bell} title="Notifications" description="Show notifications for new orders and stock alerts." value={notifications} onChange={setNotifications}/>
 <SettingToggle icon={SlidersHorizontal} title="Compact dashboard" description="Use tighter spacing for tables and panels." value={compact} onChange={setCompact}/>
 <div className="settings-divider"/><div className="settings-section-title"><div className="settings-section-icon"><Database size={19}/></div><div><h3>Data connection</h3><p>The backend runs in demo mode unless MySQL is configured.</p></div></div><div className="connection-status"><span className="connection-dot"/><div><b>API connected through local server</b><small>Demo dataset · Change .env to configure MySQL</small></div></div>
 <div className="settings-actions"><button className="primary-btn" onClick={save}>{saved?<><CheckCircle2 size={16}/> Saved locally</>:"Save preferences"}</button></div>
 </div></div>
 </div>;
}
function SettingToggle({icon:Icon,title,description,value,onChange}){return <div className="setting-toggle-row"><div className="setting-toggle-icon"><Icon size={18}/></div><div className="setting-toggle-copy"><b>{title}</b><p>{description}</p></div><button className={`toggle ${value?"on":""}`} onClick={()=>onChange(!value)} aria-label={`Toggle ${title}`}><span/></button></div>}
