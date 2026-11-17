import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Activity, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { api, saveSession } from "../api";
export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [show,setShow] = useState(false);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try { const result = await api("/auth/login",{method:"POST",body:JSON.stringify({email,password})}); saveSession(result); navigate(location.state?.from?.pathname || "/", {replace:true}); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  return <div className="login-screen"><div className="login-glow glow-one"/><div className="login-glow glow-two"/>
    <div className="login-card"><div className="login-brand"><div className="brand-mark">G</div><span>GlassAdmin</span></div>
      <div className="login-eyebrow"><Sparkles size={14}/> COMMERCE INTELLIGENCE</div><h1>Welcome back</h1><p className="login-subtitle">Sign in to explore your store's performance.</p>
      <form onSubmit={submit} className="login-form">
        <label>Email address</label><div className="field-wrap"><Mail size={17}/><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required /></div>
        <label>Password</label><div className="field-wrap"><LockKeyhole size={17}/><input type={show?"text":"password"} placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/><button type="button" aria-label={show?"Hide password":"Show password"} onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
        <div className="login-meta"><label className="remember"><input type="checkbox"/> Remember me</label><span>Secure workspace</span></div>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-btn login-submit" disabled={loading}>{loading?"Signing in…":"Sign in"}<ArrowRight size={17}/></button>
      </form>
      <div className="auth-switch">New to GlassAdmin? <Link to="/register">Create an account</Link></div>
      <p className="login-footer"><Activity size={14}/> E-commerce forecasting & customer insights</p>
    </div>
  </div>;
}
