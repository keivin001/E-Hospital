import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
<<<<<<< HEAD
<<<<<<< HEAD
import loginHero from '../assets/login_hero_placeholder.png';
import api, { backendEnabled } from '../api';
import { PATIENTS, DOCTORS } from '../data/mockData';

const DEMO_ACCOUNTS = [
  { role: 'patient', email: 'paul@example.com', password: 'password123', name: 'Patient Paul', initials: 'PP', id: 'p1' },
  { role: 'doctor', email: 'bob@example.com', password: 'password123', name: 'Dr. Bob', initials: 'DB', id: 'd1' },
  { role: 'admin', email: 'alice@example.com', password: 'password123', name: 'Alice Admin', initials: 'AA', id: 'admin' },
=======

const DEMO_ACCOUNTS = [
  { role: 'patient', email: 'patient@ehospital.com', password: 'demo123', name: 'Eric Johnson', initials: 'EJ' },
  { role: 'doctor', email: 'doctor@ehospital.com', password: 'demo123', name: 'Dr. Sarah Mitchell', initials: 'SM' },
  { role: 'admin', email: 'admin@ehospital.com', password: 'demo123', name: 'Admin User', initials: 'AU' },
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
=======
import { PATIENTS, DOCTORS } from '../data/mockData';

const DEMO_ACCOUNTS = [
  { role: 'patient', email: 'patient@ehospital.com', password: 'demo123', name: 'Eric Johnson', initials: 'EJ', id: 'p1' },
  { role: 'doctor', email: 'doctor@ehospital.com', password: 'demo123', name: 'Dr. Sarah Mitchell', initials: 'SM', id: 'd1' },
  { role: 'admin', email: 'admin@ehospital.com', password: 'demo123', name: 'Admin User', initials: 'AU', id: 'admin' },
>>>>>>> ccd1a4e (update)
];

export default function Login() {
  const navigate = useNavigate();
  const { login, addToast } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState('email');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotEmailError, setForgotEmailError] = useState('');
  const emailRef = useRef(null);
  const forgotRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);
  useEffect(() => {
    if (showForgotModal && forgotStep === 'email') setTimeout(() => forgotRef.current?.focus(), 100);
  }, [showForgotModal, forgotStep]);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email address is required';
    else if (!validateEmail(form.email)) e.email = 'Please enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
<<<<<<< HEAD
    setLoading(true);
<<<<<<< HEAD
    setErrors({});

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let account = null;
      let authToken = null;

      if (backendEnabled()) {
        const response = await api.post('/auth/login', form);
        account = response.data.user;
        authToken = response.data.token;
      } else {
        account = DEMO_ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
        if (!account) {
          const patient = PATIENTS.find(p => p.email === form.email);
          const doctor = DOCTORS.find(d => d.email === form.email);
          if (patient) {
            account = { ...patient, role: 'patient' };
          } else if (doctor) {
            account = { ...doctor, role: 'doctor' };
          }
        }
      }

      if (account) {
        if (rememberMe) {
          localStorage.setItem('ehospital_remember', 'true');
          localStorage.setItem('ehospital_remember_email', form.email);
        } else {
          localStorage.removeItem('ehospital_remember');
          localStorage.removeItem('ehospital_remember_email');
        }

        login(account, authToken);
=======
    setTimeout(() => {
      const account = DEMO_ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
      if (account) {
        login(account);
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
        addToast(`Welcome back, ${account.name.split(' ')[0]}!`, 'success');
        navigate(account.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password. Try a demo account below.' });
        setLoading(false);
      }
    }, 800);
=======
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
>>>>>>> ccd1a4e (update)
  };

  const quickLogin = async (acc) => {
    setLoading(true);
<<<<<<< HEAD
<<<<<<< HEAD
    try {
      if (backendEnabled()) {
        const response = await api.post('/auth/login', { email: account.email, password: account.password });
        login(response.data.user, response.data.token);
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        login(account);
      }
=======
    setTimeout(() => {
      login(account);
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
      addToast(`Welcome, ${account.name.split(' ')[0]}!`, 'success');
      navigate(account.role === 'admin' ? '/admin' : '/dashboard');
    }, 500);
=======
    await new Promise(r => setTimeout(r, 500));
    login(acc);
    addToast(`Welcome, ${acc.name.split(' ')[0]}!`, 'success');
    navigate(acc.role === 'admin' ? '/admin' : '/dashboard');
>>>>>>> ccd1a4e (update)
  };

  const handleForgot = async (e) => {
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
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="login-container">
      {/* Left panel - Branding */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-image-scroller">
            <div className="scroller">
              <img src={loginHero} alt="Login illustration" className="login-hero" />
              <img src={loginHero} alt="Login illustration" className="login-hero" />
              <img src={loginHero} alt="Login illustration" className="login-hero" />
            </div>
          </div>
          <div className="login-logo">
            <div className="login-logo-icon">
              <Heart size={28} />
=======
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #fef3c7 100%)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', background: 'linear-gradient(135deg, var(--primary-dark) 0%, #0369a1 100%)',
        color: 'white', position: 'relative', overflow: 'hidden',
      }} className="login-left">
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={26} />
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
            </div>
=======
    <div className="lx-root">
      {/* ── Left Branding ── */}
      <div className="lx-left">
        <div className="lx-left-inner">
          <div className="lx-logo">
            <div className="lx-logo-icon"><Heart size={26} /></div>
>>>>>>> ccd1a4e (update)
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
          {/* Header */}
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
            {/* Email */}
            <div className="lx-field">
              <label className="lx-label">Email Address</label>
              <div className="lx-input-wrap">
                <Mail size={16} className="lx-input-icon" />
                <input
                  ref={emailRef}
                  type="email"
                  className={`lx-input${errors.email ? ' lx-input-err' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  autoComplete="email"
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                />
              </div>
<<<<<<< HEAD
            ))}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Right panel - Form */}
      <div className="login-right">
        <div className="login-form-container animate-fadeIn">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="login-link">Create one free</Link>
            </p>
=======
      {/* Right panel */}
      <div style={{
        width: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 40px', background: 'white', overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>
            Sign in to your account
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>

        {errors.general && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid #fca5a5', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '20px', color: '#b91c1c', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '38px', borderColor: errors.email ? 'var(--danger)' : undefined }}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
          </div>
=======
              {errors.email && <span className="lx-field-err">{errors.email}</span>}
            </div>
>>>>>>> ccd1a4e (update)

            {/* Password */}
            <div className="lx-field">
              <label className="lx-label">Password</label>
              <div className="lx-input-wrap">
                <Lock size={16} className="lx-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`lx-input lx-input-padright${errors.password ? ' lx-input-err' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  autoComplete="current-password"
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                />
                <button type="button" className="lx-eye" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="lx-field-err">{errors.password}</span>}
            </div>

            {/* Remember + Forgot */}
            <div className="lx-options">
              <label className="lx-remember">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                <span className="lx-checkbox-box" />
                <span>Remember me</span>
              </label>
              <button type="button" className="lx-forgot" onClick={() => setShowForgotModal(true)}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="lx-submit" disabled={loading}>
              {loading ? (
                <span className="lx-spinner-row"><span className="lx-spinner" /> Signing in...</span>
              ) : (
                <span className="lx-submit-row">Sign In <ArrowRight size={18} /></span>
              )}
            </button>
          </form>

          {/* Demo Quick Login */}
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

          <div className="lx-ssl">
            <Shield size={13} />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
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
                      <input
                        ref={forgotRef}
                        type="email"
                        className={`lx-input${forgotEmailError ? ' lx-input-err' : ''}`}
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={e => { setForgotEmail(e.target.value); setForgotEmailError(''); }}
                      />
                    </div>
                    {forgotEmailError && <span className="lx-field-err">{forgotEmailError}</span>}
                  </div>
                  <button type="submit" className="lx-submit" style={{ marginTop: '8px' }} disabled={forgotLoading}>
                    {forgotLoading ? (
                      <span className="lx-spinner-row"><span className="lx-spinner" /> Sending...</span>
                    ) : 'Send Reset Link'}
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
<<<<<<< HEAD
<<<<<<< HEAD
        /* Login Container */
          .login-container {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 45% 55%;
            background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #fef3c7 100%);
          }
          @media (max-width: 1024px) {
            .login-container {
              grid-template-columns: 1fr;
            }
          }

        /* Left Panel - Branding */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%);
=======
        /* ─── Root ─────────────────────────────── */
        .lx-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', -apple-system, sans-serif;
          background: #f0f9ff;
        }

        /* ─── Left Panel ────────────────────────── */
        .lx-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 56px;
          background: linear-gradient(145deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%);
>>>>>>> ccd1a4e (update)
          color: white;
          position: relative;
          overflow: hidden;
        }
<<<<<<< HEAD

        .login-hero {
          width: 100%;
          max-width: 400px;
          margin-bottom: 40px;
        }

        .login-left::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: rgba(255,255,255,0.03);
          border-radius: 50%;
        }

        .login-left::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 300px;
          height: 300px;
          background: rgba(255,255,255,0.03);
          border-radius: 50%;
        }

        .login-left-content {
          position: relative;
          z-index: 1;
          max-width: 480px;
          margin: 0 auto;
          width: 100%;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 52px;
        }

        .login-logo-icon {
          width: 52px;
          height: 52px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-logo-text {
          display: flex;
          flex-direction: column;
        }

        .login-logo-text span {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .login-logo-text small {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .login-title {
          font-size: var(--heading-1);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 22px;
        }

        .login-subtitle {
          opacity: 0.85;
          font-size: var(--text-base);
          line-height: 1.7;
          margin-bottom: 44px;
        }

        .login-features {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .login-feature {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-feature-icon {
          width: 22px;
          height: 22px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }

        /* Right Panel - Form */
        .login-right {
          width: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 52px 48px;
          background: white;
          overflow-y: auto;
        }

        .login-form-container {
          max-width: 400px;
          margin: 0 auto;
          width: 100%;
        }

        .login-form-header {
          margin-bottom: 36px;
        }

        .login-form-header h2 {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--gray-900);
          margin-bottom: 10px;
        }

        .login-form-header p {
          color: var(--gray-500);
          font-size: 0.95rem;
        }

        .login-link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }

        .login-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 22px;
          color: #b91c1c;
          font-size: 0.9rem;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray-700);
        }

        .form-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input-icon {
          position: absolute;
          left: 14px;
          color: var(--gray-400);
        }

        .form-input {
          width: 100%;
          height: 48px;
          padding: 0 14px 0 44px;
          border: 1px solid var(--gray-300);
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
        }

        .form-input.has-error {
          border-color: var(--danger);
        }

        .form-input-action {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: var(--gray-400);
          cursor: pointer;
          padding: 4px;
        }

        .form-error {
          font-size: 0.8rem;
          color: var(--danger);
        }

        .login-form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--gray-600);
        }

        .login-checkbox input {
          display: none;
        }

        .login-checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid var(--gray-300);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .login-checkbox input:checked + .login-checkbox-custom {
          background: var(--primary);
          border-color: var(--primary);
        }

        .login-checkbox input:checked + .login-checkbox-custom::after {
          content: '✓';
          color: white;
          font-size: 0.7rem;
        }

        .login-forgot-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        .login-submit-btn {
          width: 100%;
          height: 52px;
          margin-top: 6px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background: #0369a1;
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-lg {
          padding: 14px 28px;
          font-size: 1rem;
        }

        .btn-ghost {
          background: none;
          color: var(--gray-600);
        }

        .btn-ghost:hover {
          background: var(--gray-100);
        }

        .btn-loading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Demo Accounts */
        .login-demo {
          margin-top: 36px;
        }

        .login-demo-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .login-demo-divider::before,
        .login-demo-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--gray-200);
        }

        .login-demo-divider span {
          font-size: 0.8rem;
          color: var(--gray-400);
          font-weight: 500;
        }

        .login-demo-accounts {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .login-demo-account {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border: 1.5px solid var(--gray-200);
          border-radius: 10px;
          background: var(--gray-50);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }

        .login-demo-account:hover {
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .login-demo-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .login-demo-avatar.patient {
          background: #e0f2fe;
          color: #0369a1;
        }

        .login-demo-avatar.doctor {
          background: #dcfce7;
          color: #16a34a;
        }

        .login-demo-avatar.admin {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .login-demo-info {
          flex: 1;
        }

        .login-demo-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--gray-800);
        }

        .login-demo-role {
          font-size: 0.75rem;
          color: var(--gray-400);
          text-transform: capitalize;
        }

        .login-demo-arrow {
          color: var(--gray-400);
        }

        .login-security {
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          color: var(--gray-400);
        }

        .login-security span {
          font-size: 0.75rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 24px 0;
        }

        .modal-header h2 {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--gray-900);
          margin-bottom: 4px;
        }

        .modal-header p {
          font-size: 0.85rem;
          color: var(--gray-500);
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          padding: 4px;
          border-radius: 6px;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-success {
          text-align: center;
          padding: 10px 0;
        }

        .modal-success-icon {
          width: 72px;
          height: 72px;
          background: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #16a34a;
        }

        .modal-success h3 {
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 10px;
          font-size: 1.1rem;
        }

        .modal-success p {
          font-size: 0.9rem;
          color: var(--gray-500);
          margin-bottom: 8px;
        }

        .modal-success-email {
          font-size: 0.9rem;
          color: var(--gray-800);
          font-weight: 600;
          margin-bottom: 20px !important;
        }

        .modal-success-note {
          font-size: 0.8rem;
          color: var(--gray-400);
        }

        .modal-footer {
          padding: 0 24px 24px;
          display: flex;
          justify-content: center;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .login-left {
            padding: 48px;
          }

          .login-title {
            font-size: 2.2rem;
          }

          .login-right {
            width: 480px;
            padding: 44px 40px;
          }
        }

=======
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
        @media (max-width: 900px) {
          .login-left { display: none !important; }
=======
        .lx-left::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 420px; height: 420px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .lx-left::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -80px;
          width: 340px; height: 340px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .lx-left-inner {
          position: relative;
          z-index: 1;
          max-width: 460px;
          width: 100%;
        }
        .lx-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 44px;
        }
        .lx-logo-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.18);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .lx-logo-name { font-size: 1.45rem; font-weight: 800; letter-spacing: -0.02em; }
        .lx-logo-sub  { font-size: 0.75rem; opacity: 0.65; margin-top: 1px; }
        .lx-hero {
          font-size: 2.7rem; font-weight: 800;
          line-height: 1.15; margin-bottom: 18px; letter-spacing: -0.03em;
        }
        .lx-subtext {
          font-size: 1rem; opacity: 0.82; line-height: 1.72;
          margin-bottom: 36px; max-width: 400px;
        }
        .lx-features { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 40px; }
        .lx-feature-item { display: flex; align-items: center; gap: 12px; font-size: 0.92rem; opacity: 0.9; }
        .lx-check {
          width: 22px; height: 22px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.68rem; font-weight: 700; flex-shrink: 0;
        }
        .lx-trust {
          display: flex; align-items: center;
          gap: 0;
          padding: 16px 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .lx-trust-stat { flex: 1; text-align: center; }
        .lx-trust-num   { display: block; font-size: 1.2rem; font-weight: 800; }
        .lx-trust-label { display: block; font-size: 0.7rem; opacity: 0.7; margin-top: 2px; }
        .lx-trust-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.2); }

        /* ─── Right Panel ───────────────────────── */
        .lx-right {
          width: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 36px;
          background: white;
          overflow-y: auto;
        }
        .lx-form-box { width: 100%; max-width: 420px; }
        .lx-form-header { margin-bottom: 28px; }
        .lx-form-title {
          font-size: 1.9rem; font-weight: 800;
          color: var(--gray-900); margin-bottom: 8px; letter-spacing: -0.02em;
        }
        .lx-form-sub { font-size: 0.9rem; color: var(--gray-500); }
        .lx-link { color: var(--primary); font-weight: 600; text-decoration: none; }
        .lx-link:hover { text-decoration: underline; }

        /* Error Banner */
        .lx-error-banner {
          display: flex; align-items: flex-start; gap: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 10px; padding: 12px 14px;
          color: #b91c1c; font-size: 0.875rem; margin-bottom: 20px;
        }

        /* Form */
        .lx-form  { display: flex; flex-direction: column; gap: 18px; }
        .lx-field { display: flex; flex-direction: column; gap: 5px; }
        .lx-label { font-size: 0.875rem; font-weight: 600; color: var(--gray-700); }
        .lx-input-wrap { position: relative; }
        .lx-input-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: var(--gray-400); pointer-events: none;
        }
        .lx-input {
          width: 100%; height: 46px;
          padding: 0 14px 0 40px;
          border: 1.5px solid var(--gray-200);
          border-radius: 9px;
          font-size: 0.925rem;
          color: var(--gray-800);
          background: white;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .lx-input::placeholder { color: var(--gray-400); }
        .lx-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
        .lx-input-padright { padding-right: 42px; }
        .lx-input-err { border-color: var(--danger); }
        .lx-input-err:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .lx-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--gray-400);
          cursor: pointer; padding: 4px; display: flex; align-items: center;
        }
        .lx-eye:hover { color: var(--gray-600); }
        .lx-field-err { font-size: 0.78rem; color: var(--danger); }

        /* Options */
        .lx-options { display: flex; justify-content: space-between; align-items: center; }
        .lx-remember {
          display: flex; align-items: center; gap: 9px;
          cursor: pointer; font-size: 0.875rem; color: var(--gray-600);
          user-select: none;
        }
        .lx-remember input { display: none; }
        .lx-checkbox-box {
          width: 17px; height: 17px;
          border: 2px solid var(--gray-300); border-radius: 4px;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .lx-remember input:checked + .lx-checkbox-box {
          background: var(--primary); border-color: var(--primary);
        }
        .lx-remember input:checked + .lx-checkbox-box::after {
          content: '✓'; display: block; text-align: center;
          color: white; font-size: 0.68rem; line-height: 13px; font-weight: 700;
        }
        .lx-forgot {
          background: none; border: none;
          color: var(--primary); font-size: 0.875rem; font-weight: 600;
          cursor: pointer; padding: 0;
        }
        .lx-forgot:hover { text-decoration: underline; }

        /* Submit */
        .lx-submit {
          width: 100%; height: 48px;
          background: var(--primary); color: white;
          border: none; border-radius: 10px;
          font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .lx-submit:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(14,165,233,0.35);
        }
        .lx-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .lx-submit-row { display: flex; align-items: center; gap: 8px; }
        .lx-submit-ghost {
          background: transparent; color: var(--gray-700);
          border: 1.5px solid var(--gray-200); margin-top: 12px;
        }
        .lx-submit-ghost:hover:not(:disabled) {
          background: var(--gray-50); transform: none; box-shadow: none;
        }
        .lx-spinner-row { display: flex; align-items: center; gap: 10px; }
        .lx-spinner {
          width: 17px; height: 17px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%;
          animation: lx-spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes lx-spin { to { transform: rotate(360deg); } }

        /* Demo */
        .lx-demo { margin-top: 28px; }
        .lx-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 14px;
        }
        .lx-divider::before, .lx-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--gray-200);
        }
        .lx-divider span { font-size: 0.78rem; color: var(--gray-400); font-weight: 500; white-space: nowrap; }
        .lx-demo-list { display: flex; flex-direction: column; gap: 8px; }
        .lx-demo-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px;
          border: 1.5px solid var(--gray-200);
          border-radius: 10px;
          background: var(--gray-50);
          cursor: pointer; transition: all 0.18s;
          text-align: left; width: 100%;
        }
        .lx-demo-btn:hover:not(:disabled) {
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .lx-demo-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .lx-demo-avatar {
          width: 38px; height: 38px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 700; flex-shrink: 0;
        }
        .lx-demo-patient { background: #e0f2fe; color: #0369a1; }
        .lx-demo-doctor  { background: #dcfce7; color: #16a34a; }
        .lx-demo-admin   { background: #f3e8ff; color: #7c3aed; }
        .lx-demo-info { flex: 1; }
        .lx-demo-name { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); }
        .lx-demo-role { font-size: 0.72rem; color: var(--gray-400); text-transform: capitalize; margin-top: 1px; }
        .lx-demo-arrow { color: var(--gray-400); flex-shrink: 0; }

        /* SSL */
        .lx-ssl {
          margin-top: 20px;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          color: var(--gray-400); font-size: 0.72rem;
        }

        /* ─── Modal ─────────────────────────────── */
        .lx-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.48);
          backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .lx-modal {
          background: white; border-radius: 18px;
          width: 100%; max-width: 420px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.22);
          overflow: hidden;
        }
        .lx-modal-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 22px 22px 0;
        }
        .lx-modal-head h3 { font-size: 1.15rem; font-weight: 800; color: var(--gray-900); margin-bottom: 4px; }
        .lx-modal-head p  { font-size: 0.82rem; color: var(--gray-500); }
        .lx-modal-close {
          background: none; border: none; cursor: pointer;
          color: var(--gray-400); padding: 4px;
          border-radius: 6px; line-height: 1;
        }
        .lx-modal-close:hover { background: var(--gray-100); }
        .lx-modal-body { padding: 20px 22px 22px; }

        /* Sent success */
        .lx-sent-success { text-align: center; padding: 8px 0; }
        .lx-sent-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: #dcfce7; color: #16a34a;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .lx-sent-success h4 { font-size: 1.1rem; font-weight: 700; color: var(--gray-900); margin-bottom: 8px; }
        .lx-sent-success p  { font-size: 0.875rem; color: var(--gray-500); margin-bottom: 4px; }
        .lx-sent-success strong { font-size: 0.9rem; color: var(--gray-800); display: block; margin-bottom: 12px; }
        .lx-sent-note { font-size: 0.8rem !important; color: var(--gray-400) !important; }

        /* ─── Responsive ─────────────────────────── */
        @media (max-width: 1024px) {
          .lx-left { padding: 40px 44px; }
          .lx-hero { font-size: 2.3rem; }
          .lx-right { width: 460px; padding: 36px 28px; }
        }
        @media (max-width: 860px) {
          .lx-root { flex-direction: column; }
          .lx-left {
            padding: 36px 28px;
            min-height: auto;
          }
          .lx-left-inner { max-width: 100%; }
          .lx-logo { margin-bottom: 28px; }
          .lx-hero { font-size: 2rem; }
          .lx-subtext { margin-bottom: 24px; font-size: 0.95rem; }
          .lx-features { margin-bottom: 24px; }
          .lx-right { width: 100%; padding: 36px 28px; }
          .lx-form-box { max-width: 100%; }
        }
        @media (max-width: 540px) {
          .lx-left { padding: 28px 20px; }
          .lx-hero { font-size: 1.7rem; }
          .lx-trust { padding: 12px 14px; }
          .lx-trust-num { font-size: 1rem; }
          .lx-right { padding: 28px 20px; }
          .lx-form-title { font-size: 1.6rem; }
          .lx-input { height: 44px; font-size: 0.9rem; }
          .lx-submit { height: 46px; font-size: 0.95rem; }
          .lx-options { flex-direction: column; gap: 10px; align-items: flex-start; }
        }
        @media (max-width: 380px) {
          .lx-left { padding: 22px 16px; }
          .lx-hero { font-size: 1.5rem; }
          .lx-right { padding: 22px 16px; }
          .lx-form-title { font-size: 1.4rem; }
          .lx-demo-btn { padding: 9px 12px; gap: 10px; }
          .lx-demo-avatar { width: 34px; height: 34px; }
>>>>>>> ccd1a4e (update)
        }
      `}</style>
    </div>
  );
}
