import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from "lucide-react";
import { api, saveSession } from "../api";
export default function Register() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [show,setShow] = useState(false);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError("");
    if (password.length < 8) { setError("Use a password with at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try { const result = await api("/auth/register",{method:"POST",body:JSON.stringify({name,email,password})}); saveSession(result); navigate("/",{replace:true}); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  return <div className="login-screen"><div className="login-glow glow-one"/><div className="login-glow glow-two"/>
    <div className="login-card"><div className="login-brand"><div className="brand-mark">G</div><span>GlassAdmin</span></div>
      <div className="login-eyebrow"><Sparkles size={14}/> COMMERCE INTELLIGENCE</div><h1>Create account</h1><p className="login-subtitle">Create your workspace account to explore store performance.</p>
      <form onSubmit={submit} className="login-form register-form">
        <label>Full name</label><div className="field-wrap"><UserRound size={17}/><input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} autoComplete="name" maxLength={120} required /></div>
        <label>Email address</label><div className="field-wrap"><Mail size={17}/><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" maxLength={190} required /></div>
        <label>Password <span className="field-hint">(at least 8 characters)</span></label><div className="field-wrap"><LockKeyhole size={17}/><input type={show?"text":"password"} placeholder="Create a password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" minLength={8} required/><button type="button" aria-label={show?"Hide password":"Show password"} onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
        <label>Confirm password</label><div className="field-wrap"><LockKeyhole size={17}/><input type={show?"text":"password"} placeholder="Enter password again" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" minLength={8} required/></div>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-btn login-submit" disabled={loading}>{loading?"Creating account…":"Create account"}<ArrowRight size={17}/></button>
      </form>
      <div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div>
      <p className="login-footer"><Activity size={14}/> Your password is securely hashed before storage</p>
    </div>
  </div>;
}
