import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PATIENTS, DOCTORS } from '../data/mockData';

const DEMO_ACCOUNTS = [
  { role: 'patient', email: 'patient@ehospital.com', password: 'demo123', name: 'Eric Johnson',      initials: 'EJ', id: 'p1'    },
  { role: 'doctor',  email: 'doctor@ehospital.com',  password: 'demo123', name: 'Dr. Sarah Mitchell', initials: 'SM', id: 'd1'    },
  { role: 'admin',   email: 'admin@ehospital.com',   password: 'demo123', name: 'Admin User',         initials: 'AU', id: 'admin' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, addToast } = useApp();
  const [form,            setForm]           = useState({ email: '', password: '' });
  const [showPass,        setShowPass]       = useState(false);
  const [rememberMe,      setRememberMe]     = useState(false);
  const [loading,         setLoading]        = useState(false);
  const [errors,          setErrors]         = useState({});
  const [showForgotModal, setShowForgotModal]= useState(false);
  const [forgotEmail,     setForgotEmail]    = useState('');
  const [forgotStep,      setForgotStep]     = useState('email');
  const [forgotLoading,   setForgotLoading]  = useState(false);
  const [forgotEmailError,setForgotEmailError]= useState('');
  const emailRef  = useRef(null);
  const forgotRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);
  useEffect(() => {
    if (showForgotModal && forgotStep === 'email') setTimeout(() => forgotRef.current?.focus(), 100);
  }, [showForgotModal, forgotStep]);

  const validateEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email address is required';
    else if (!validateEmail(form.email)) e.email = 'Please enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setErrors({});
    await new Promise(r => setTimeout(r, 900));
    let account = DEMO_ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
    if (!account) {
      const pt = PATIENTS.find(p => p.email === form.email);
      const dr = DOCTORS.find(d => d.email === form.email);
      if (pt) account = { ...pt, role: 'patient' };
      else if (dr) account = { ...dr, role: 'doctor' };
    }
    if (account) {
      if (rememberMe) { localStorage.setItem('ehospital_remember', 'true'); localStorage.setItem('ehospital_remember_email', form.email); }
      else { localStorage.removeItem('ehospital_remember'); localStorage.removeItem('ehospital_remember_email'); }
      login(account);
      addToast(`Welcome back, ${account.name.split(' ')[0]}!`, 'success');
      navigate(account.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setErrors({ general: 'Invalid email or password. Use a demo account below.' });
      addToast('Login failed. Check your credentials.', 'error');
      setLoading(false);
    }
  };

  const quickLogin = async acc => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    login(acc);
    addToast(`Welcome, ${acc.name.split(' ')[0]}!`, 'success');
    navigate(acc.role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleForgot = async e => {
    e.preventDefault();
    setForgotEmailError('');
    if (!forgotEmail) { setForgotEmailError('Email is required'); return; }
    if (!validateEmail(forgotEmail)) { setForgotEmailError('Enter a valid email address'); return; }
    setForgotLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setForgotLoading(false);
    setForgotStep('sent');
    addToast('Password reset link sent!', 'success');
  };

  const closeForgot = () => { setShowForgotModal(false); setForgotStep('email'); setForgotEmail(''); setForgotEmailError(''); };

  return (
    <div className="lx-root">
      {/* ── Left Branding ── */}
      <div className="lx-left">
        <div className="lx-left-inner">
          <div className="lx-logo">
            <div className="lx-logo-icon"><Heart size={26} /></div>
            <div>
              <div className="lx-logo-name">E-Hospital</div>
              <div className="lx-logo-sub">Digital Healthcare Platform</div>
            </div>
          </div>
          <h1 className="lx-hero">Healthcare at<br />Your Fingertips</h1>
          <p className="lx-subtext">
            Connect with certified doctors, book appointments, get prescriptions, and manage your health — all from one secure platform.
          </p>
          <ul className="lx-features">
            {['500+ Certified Doctors Online', '18 Partner Hospitals', 'Digital Prescriptions & Pharmacy', 'HIPAA-Compliant & Secure'].map(t => (
              <li key={t} className="lx-feature-item">
                <span className="lx-check">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="lx-trust">
            <div className="lx-trust-stat"><span className="lx-trust-num">4.9★</span><span className="lx-trust-label">App Rating</span></div>
            <div className="lx-trust-divider" />
            <div className="lx-trust-stat"><span className="lx-trust-num">50K+</span><span className="lx-trust-label">Patients Served</span></div>
            <div className="lx-trust-divider" />
            <div className="lx-trust-stat"><span className="lx-trust-num">99.9%</span><span className="lx-trust-label">Uptime</span></div>
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="lx-right">
        <div className="lx-form-box">
          <div className="lx-form-header">
            <h2 className="lx-form-title">Welcome back</h2>
            <p className="lx-form-sub">
              Don't have an account?{' '}
              <Link to="/register" className="lx-link">Create one free</Link>
            </p>
          </div>

          {errors.general && (
            <div className="lx-error-banner">
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="lx-form" noValidate>
            <div className="lx-field">
              <label className="lx-label">Email Address</label>
              <div className="lx-input-wrap">
                <Mail size={16} className="lx-input-icon" />
                <input ref={emailRef} type="email"
                  className={`lx-input${errors.email ? ' lx-input-err' : ''}`}
                  placeholder="you@example.com" value={form.email} autoComplete="email"
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }} />
              </div>
              {errors.email && <span className="lx-field-err">{errors.email}</span>}
            </div>

            <div className="lx-field">
              <label className="lx-label">Password</label>
              <div className="lx-input-wrap">
                <Lock size={16} className="lx-input-icon" />
                <input type={showPass ? 'text' : 'password'}
                  className={`lx-input lx-input-padright${errors.password ? ' lx-input-err' : ''}`}
                  placeholder="Enter your password" value={form.password} autoComplete="current-password"
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }} />
                <button type="button" className="lx-eye" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="lx-field-err">{errors.password}</span>}
            </div>

            <div className="lx-options">
              <label className="lx-remember">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                <span className="lx-checkbox-box" />
                <span>Remember me</span>
              </label>
              <button type="button" className="lx-forgot" onClick={() => setShowForgotModal(true)}>Forgot password?</button>
            </div>

            <button type="submit" className="lx-submit" disabled={loading}>
              {loading
                ? <span className="lx-spinner-row"><span className="lx-spinner" /> Signing in...</span>
                : <span className="lx-submit-row">Sign In <ArrowRight size={18} /></span>}
            </button>
          </form>

          <div className="lx-demo">
            <div className="lx-divider"><span>Quick Demo Access</span></div>
            <div className="lx-demo-list">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.role} className="lx-demo-btn" onClick={() => quickLogin(acc)} disabled={loading}>
                  <div className={`lx-demo-avatar lx-demo-${acc.role}`}>{acc.initials}</div>
                  <div className="lx-demo-info">
                    <div className="lx-demo-name">{acc.name}</div>
                    <div className="lx-demo-role">{acc.role} account</div>
                  </div>
                  <ArrowRight size={14} className="lx-demo-arrow" />
                </button>
              ))}
            </div>
          </div>

          <div className="lx-ssl"><Shield size={13} /><span>Secured with 256-bit SSL encryption</span></div>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showForgotModal && (
        <div className="lx-modal-overlay" onClick={closeForgot}>
          <div className="lx-modal" onClick={e => e.stopPropagation()}>
            <div className="lx-modal-head">
              <div>
                <h3>{forgotStep === 'email' ? 'Reset Password' : 'Check Your Email'}</h3>
                {forgotStep === 'email' && <p>Enter your email to receive a reset link</p>}
              </div>
              <button className="lx-modal-close" onClick={closeForgot}><X size={18} /></button>
            </div>
            <div className="lx-modal-body">
              {forgotStep === 'email' ? (
                <form onSubmit={handleForgot}>
                  <div className="lx-field">
                    <label className="lx-label">Email Address</label>
                    <div className="lx-input-wrap">
                      <Mail size={16} className="lx-input-icon" />
                      <input ref={forgotRef} type="email"
                        className={`lx-input${forgotEmailError ? ' lx-input-err' : ''}`}
                        placeholder="Enter your email" value={forgotEmail}
                        onChange={e => { setForgotEmail(e.target.value); setForgotEmailError(''); }} />
                    </div>
                    {forgotEmailError && <span className="lx-field-err">{forgotEmailError}</span>}
                  </div>
                  <button type="submit" className="lx-submit" style={{ marginTop: '8px' }} disabled={forgotLoading}>
                    {forgotLoading ? <span className="lx-spinner-row"><span className="lx-spinner" /> Sending...</span> : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                <div className="lx-sent-success">
                  <div className="lx-sent-icon"><Mail size={30} /></div>
                  <h4>Reset Link Sent!</h4>
                  <p>We've sent a reset link to</p>
                  <strong>{forgotEmail}</strong>
                  <p className="lx-sent-note">Check your spam folder if you don't see it.</p>
                  <button className="lx-submit lx-submit-ghost" onClick={closeForgot}>Back to Login</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .lx-root { min-height:100vh; display:flex; font-family:'Inter',-apple-system,sans-serif; background:#f0f9ff; }
        .lx-left { flex:1; display:flex; align-items:center; justify-content:center; padding:48px 56px; background:linear-gradient(145deg,#0c4a6e 0%,#0369a1 55%,#0ea5e9 100%); color:white; position:relative; overflow:hidden; }
        .lx-left::before { content:''; position:absolute; top:-120px; right:-120px; width:420px; height:420px; background:rgba(255,255,255,0.04); border-radius:50%; }
        .lx-left::after  { content:''; position:absolute; bottom:-100px; left:-80px; width:340px; height:340px; background:rgba(255,255,255,0.04); border-radius:50%; }
        .lx-left-inner { position:relative; z-index:1; max-width:460px; width:100%; }
        .lx-logo { display:flex; align-items:center; gap:14px; margin-bottom:44px; }
        .lx-logo-icon { width:50px; height:50px; background:rgba(255,255,255,0.18); border-radius:14px; display:flex; align-items:center; justify-content:center; }
        .lx-logo-name { font-size:1.45rem; font-weight:800; letter-spacing:-0.02em; }
        .lx-logo-sub  { font-size:0.75rem; opacity:0.65; margin-top:1px; }
        .lx-hero { font-size:2.7rem; font-weight:800; line-height:1.15; margin-bottom:18px; letter-spacing:-0.03em; }
        .lx-subtext { font-size:1rem; opacity:0.82; line-height:1.72; margin-bottom:36px; max-width:400px; }
        .lx-features { list-style:none; display:flex; flex-direction:column; gap:14px; margin-bottom:40px; padding:0; }
        .lx-feature-item { display:flex; align-items:center; gap:12px; font-size:0.92rem; opacity:0.9; }
        .lx-check { width:22px; height:22px; background:rgba(255,255,255,0.18); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:700; flex-shrink:0; }
        .lx-trust { display:flex; align-items:center; padding:16px 20px; background:rgba(255,255,255,0.1); border-radius:14px; border:1px solid rgba(255,255,255,0.15); }
        .lx-trust-stat { flex:1; text-align:center; }
        .lx-trust-num   { display:block; font-size:1.2rem; font-weight:800; }
        .lx-trust-label { display:block; font-size:0.7rem; opacity:0.7; margin-top:2px; }
        .lx-trust-divider { width:1px; height:36px; background:rgba(255,255,255,0.2); }
        .lx-right { width:520px; display:flex; align-items:center; justify-content:center; padding:40px 36px; background:white; overflow-y:auto; }
        .lx-form-box { width:100%; max-width:420px; }
        .lx-form-header { margin-bottom:28px; }
        .lx-form-title { font-size:1.9rem; font-weight:800; color:var(--gray-900); margin-bottom:8px; letter-spacing:-0.02em; }
        .lx-form-sub { font-size:0.9rem; color:var(--gray-500); }
        .lx-link { color:var(--primary); font-weight:600; text-decoration:none; }
        .lx-link:hover { text-decoration:underline; }
        .lx-error-banner { display:flex; align-items:flex-start; gap:10px; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:12px 14px; color:#b91c1c; font-size:0.875rem; margin-bottom:20px; }
        .lx-form { display:flex; flex-direction:column; gap:18px; }
        .lx-field { display:flex; flex-direction:column; gap:5px; }
        .lx-label { font-size:0.875rem; font-weight:600; color:var(--gray-700); }
        .lx-input-wrap { position:relative; }
        .lx-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--gray-400); pointer-events:none; }
        .lx-input { width:100%; height:46px; padding:0 14px 0 40px; border:1.5px solid var(--gray-200); border-radius:9px; font-size:0.925rem; color:var(--gray-800); background:white; outline:none; transition:border-color 0.18s,box-shadow 0.18s; font-family:inherit; }
        .lx-input::placeholder { color:var(--gray-400); }
        .lx-input:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(14,165,233,0.12); }
        .lx-input-padright { padding-right:42px; }
        .lx-input-err { border-color:var(--danger); }
        .lx-input-err:focus { box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
        .lx-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--gray-400); cursor:pointer; padding:4px; display:flex; align-items:center; }
        .lx-eye:hover { color:var(--gray-600); }
        .lx-field-err { font-size:0.78rem; color:var(--danger); }
        .lx-options { display:flex; justify-content:space-between; align-items:center; }
        .lx-remember { display:flex; align-items:center; gap:9px; cursor:pointer; font-size:0.875rem; color:var(--gray-600); user-select:none; }
        .lx-remember input { display:none; }
        .lx-checkbox-box { width:17px; height:17px; border:2px solid var(--gray-300); border-radius:4px; transition:all 0.15s; flex-shrink:0; }
        .lx-remember input:checked + .lx-checkbox-box { background:var(--primary); border-color:var(--primary); }
        .lx-remember input:checked + .lx-checkbox-box::after { content:'✓'; display:block; text-align:center; color:white; font-size:0.68rem; line-height:13px; font-weight:700; }
        .lx-forgot { background:none; border:none; color:var(--primary); font-size:0.875rem; font-weight:600; cursor:pointer; padding:0; }
        .lx-forgot:hover { text-decoration:underline; }
        .lx-submit { width:100%; height:48px; background:var(--primary); color:white; border:none; border-radius:10px; font-size:1rem; font-weight:700; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; font-family:inherit; }
        .lx-submit:hover:not(:disabled) { background:var(--primary-dark); transform:translateY(-1px); box-shadow:0 6px 16px rgba(14,165,233,0.35); }
        .lx-submit:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
        .lx-submit-row { display:flex; align-items:center; gap:8px; }
        .lx-submit-ghost { background:transparent; color:var(--gray-700); border:1.5px solid var(--gray-200); margin-top:12px; }
        .lx-submit-ghost:hover:not(:disabled) { background:var(--gray-50); transform:none; box-shadow:none; }
        .lx-spinner-row { display:flex; align-items:center; gap:10px; }
        .lx-spinner { width:17px; height:17px; border:2px solid rgba(255,255,255,0.35); border-top-color:white; border-radius:50%; animation:lx-spin 0.8s linear infinite; display:inline-block; }
        @keyframes lx-spin { to { transform:rotate(360deg); } }
        .lx-demo { margin-top:28px; }
        .lx-divider { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .lx-divider::before,.lx-divider::after { content:''; flex:1; height:1px; background:var(--gray-200); }
        .lx-divider span { font-size:0.78rem; color:var(--gray-400); font-weight:500; white-space:nowrap; }
        .lx-demo-list { display:flex; flex-direction:column; gap:8px; }
        .lx-demo-btn { display:flex; align-items:center; gap:12px; padding:11px 14px; border:1.5px solid var(--gray-200); border-radius:10px; background:var(--gray-50); cursor:pointer; transition:all 0.18s; text-align:left; width:100%; font-family:inherit; }
        .lx-demo-btn:hover:not(:disabled) { border-color:var(--primary); background:var(--primary-light); }
        .lx-demo-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .lx-demo-avatar { width:38px; height:38px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; flex-shrink:0; }
        .lx-demo-patient { background:#e0f2fe; color:#0369a1; }
        .lx-demo-doctor  { background:#dcfce7; color:#16a34a; }
        .lx-demo-admin   { background:#f3e8ff; color:#7c3aed; }
        .lx-demo-info { flex:1; }
        .lx-demo-name { font-size:0.875rem; font-weight:600; color:var(--gray-800); }
        .lx-demo-role { font-size:0.72rem; color:var(--gray-400); text-transform:capitalize; margin-top:1px; }
        .lx-demo-arrow { color:var(--gray-400); flex-shrink:0; }
        .lx-ssl { margin-top:20px; display:flex; align-items:center; justify-content:center; gap:7px; color:var(--gray-400); font-size:0.72rem; }
        .lx-modal-overlay { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.48); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; padding:20px; }
        .lx-modal { background:white; border-radius:18px; width:100%; max-width:420px; box-shadow:0 24px 60px rgba(0,0,0,0.22); overflow:hidden; }
        .lx-modal-head { display:flex; justify-content:space-between; align-items:flex-start; padding:22px 22px 0; }
        .lx-modal-head h3 { font-size:1.15rem; font-weight:800; color:var(--gray-900); margin-bottom:4px; }
        .lx-modal-head p  { font-size:0.82rem; color:var(--gray-500); }
        .lx-modal-close { background:none; border:none; cursor:pointer; color:var(--gray-400); padding:4px; border-radius:6px; line-height:1; }
        .lx-modal-close:hover { background:var(--gray-100); }
        .lx-modal-body { padding:20px 22px 22px; }
        .lx-sent-success { text-align:center; padding:8px 0; }
        .lx-sent-icon { width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .lx-sent-success h4 { font-size:1.1rem; font-weight:700; color:var(--gray-900); margin-bottom:8px; }
        .lx-sent-success p  { font-size:0.875rem; color:var(--gray-500); margin-bottom:4px; }
        .lx-sent-success strong { font-size:0.9rem; color:var(--gray-800); display:block; margin-bottom:12px; }
        .lx-sent-note { font-size:0.8rem !important; color:var(--gray-400) !important; }
        @media (max-width:860px) { .lx-root { flex-direction:column; } .lx-left { padding:36px 28px; min-height:auto; } .lx-left-inner { max-width:100%; } .lx-logo { margin-bottom:28px; } .lx-hero { font-size:2rem; } .lx-subtext { margin-bottom:24px; font-size:0.95rem; } .lx-features { margin-bottom:24px; } .lx-right { width:100%; padding:36px 28px; } .lx-form-box { max-width:100%; } }
        @media (max-width:540px) { .lx-left { padding:28px 20px; } .lx-hero { font-size:1.7rem; } .lx-trust { padding:12px 14px; } .lx-right { padding:28px 20px; } .lx-form-title { font-size:1.6rem; } .lx-input { height:44px; font-size:0.9rem; } .lx-submit { height:46px; font-size:0.95rem; } .lx-options { flex-direction:column; gap:10px; align-items:flex-start; } }
        @media (max-width:380px) { .lx-left { padding:22px 16px; } .lx-hero { font-size:1.5rem; } .lx-right { padding:22px 16px; } .lx-form-title { font-size:1.4rem; } }
      `}</style>
    </div>
  );
}
