import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MessageSquare, FileText, Activity, Clock, ArrowRight,
  Search, Zap, AlertCircle, CheckCircle, Video, Bell,
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
<<<<<<< HEAD
import { PRESCRIPTIONS, DOCTORS, SYMPTOM_SUGGESTIONS } from '../data/mockData';
=======
import { PRESCRIPTIONS, NOTIFICATIONS, DOCTORS, SYMPTOM_SUGGESTIONS } from '../data/mockData';
>>>>>>> ccd1a4e (update)

const statusColors = {
  confirmed: 'badge-success',
  pending:   'badge-warning',
  completed: 'badge-gray',
  cancelled: 'badge-danger',
};

export default function PatientDashboard() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { user, appointments, notifications, profile } = useApp();
=======
  const { user, appointments } = useApp();
>>>>>>> ccd1a4e (update)
  const [symptom, setSymptom] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const assignedDoctor = profile?.doctor || null;

<<<<<<< HEAD
  const patientApts = appointments.filter(a => a.patientName === user?.name);
  const upcoming = patientApts.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const activePrescriptions = PRESCRIPTIONS.filter(p => p.status === 'active');
  const unreadNotifs = notifications.filter(n => !n.read).length;
=======
  const patientApts       = appointments.filter(a => a.patientName === user?.name || a.patientName === 'Eric Johnson');
  const upcoming          = patientApts.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const activePrescriptions = PRESCRIPTIONS.filter(p => p.status === 'active');
  const unreadNotifs      = NOTIFICATIONS.filter(n => !n.read).length;
>>>>>>> ccd1a4e (update)

  const handleSymptomSearch = () => {
    if (!symptom.trim()) return;
    const lower  = symptom.toLowerCase();
    const depts  = Object.entries(SYMPTOM_SUGGESTIONS)
      .filter(([key]) => lower.includes(key))
      .flatMap(([, v]) => v);
    const uniqueDepts     = [...new Set(depts)];
    const suggestedDoctors = DOCTORS.filter(d => uniqueDepts.includes(d.specialty) || d.online).slice(0, 3);
    setSuggestions({
      departments: uniqueDepts.length ? uniqueDepts : ['General Medicine'],
      doctors:     suggestedDoctors,
    });
  };

  const stats = [
<<<<<<< HEAD
    { label: 'Upcoming Appointments', value: upcoming.length, icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-light)', action: () => navigate('/appointments') },
    { label: 'Active Prescriptions', value: activePrescriptions.length, icon: FileText, color: 'var(--secondary)', bg: 'var(--success-light)', action: () => navigate('/prescriptions') },
    { label: 'Unread Notifications', value: unreadNotifs, icon: AlertCircle, color: 'var(--accent)', bg: 'var(--warning-light)', action: () => navigate('/notifications') },
    { label: 'Total Consultations', value: patientApts.length, icon: Activity, color: 'var(--purple)', bg: 'var(--purple-light)', action: () => navigate('/appointments') },
=======
    { label: 'Upcoming Appointments', value: upcoming.length,              icon: Calendar,     color: 'var(--primary)',   bg: 'var(--primary-light)',  action: () => navigate('/appointments') },
    { label: 'Active Prescriptions',  value: activePrescriptions.length,   icon: FileText,     color: 'var(--secondary)', bg: 'var(--success-light)',  action: () => navigate('/prescriptions') },
    { label: 'Unread Notifications',  value: unreadNotifs,                  icon: Bell,         color: 'var(--accent)',    bg: 'var(--warning-light)',  action: () => navigate('/notifications') },
    { label: 'Total Consultations',   value: patientApts.length,            icon: Activity,     color: 'var(--purple)',    bg: 'var(--purple-light)',   action: () => navigate('/appointments') },
>>>>>>> ccd1a4e (update)
  ];

  const quickActions = [
    { icon: Calendar,     label: 'Book Appointment', color: 'var(--primary)',   bg: 'var(--primary-light)',  path: '/appointments' },
    { icon: MessageSquare,label: 'Start Chat',        color: 'var(--secondary)', bg: 'var(--success-light)', path: '/chat' },
    { icon: Video,        label: 'Video Call',        color: 'var(--purple)',    bg: 'var(--purple-light)',  path: '/video' },
    { icon: FileText,     label: 'Prescriptions',     color: 'var(--accent)',    bg: 'var(--warning-light)', path: '/prescriptions' },
  ];

  const symptomTags = ['Headache', 'Fever', 'Chest Pain', 'Skin Rash', 'Joint Pain'];

  return (
    <Layout title="Dashboard">

      {/* ── Welcome Banner ── */}
      <div className="pd-banner">
        <div className="pd-banner-circle pd-banner-c1" />
        <div className="pd-banner-circle pd-banner-c2" />
        <div className="pd-banner-inner">
          <div className="pd-banner-text">
            <h2 className="pd-banner-title">Good morning, {user?.name?.split(' ')[0]} 👋</h2>
            <p className="pd-banner-sub">
              You have <strong>{upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}</strong> and{' '}
              <strong>{activePrescriptions.length} active prescription{activePrescriptions.length !== 1 ? 's' : ''}</strong>.
            </p>
          </div>
          <div className="pd-banner-btns">
            <button className="pd-banner-btn-ghost" onClick={() => navigate('/doctors')}>
              <Search size={15} /> Find Doctor
            </button>
            <button className="pd-banner-btn-solid" onClick={() => navigate('/appointments')}>
              <Calendar size={15} /> Book Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="pd-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="pd-stat-card card-hover" onClick={s.action}>
            <div className="pd-stat-top">
              <div className="pd-stat-icon" style={{ background: s.bg }}>
                <s.icon size={22} color={s.color} />
              </div>
              <ArrowRight size={15} className="pd-stat-arrow" />
            </div>
            <div className="pd-stat-val">{s.value}</div>
            <div className="pd-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>Your Primary Doctor</h3>
            {assignedDoctor ? (
              <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Message <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={() => navigate('/doctors')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Find a Doctor <ArrowRight size={14} />
              </button>
            )}
          </div>
          {assignedDoctor ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px', borderRadius: 'var(--radius)', background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
              <div className="avatar avatar-lg" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                {assignedDoctor.userId?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{assignedDoctor.userId?.name || assignedDoctor.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{assignedDoctor.specialty || 'General Medicine'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{assignedDoctor.hospital || 'Assigned clinic'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '18px', borderRadius: 'var(--radius)', background: 'var(--gray-50)', border: '1px dashed var(--gray-200)', color: 'var(--gray-500)' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>No doctor assigned yet</p>
              <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>Search the doctor directory or book an appointment to connect with the right specialist.</p>
            </div>
          )}
        </div>

        {/* AI Symptom Checker */}
=======
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
=======
      {/* ── Middle row: Symptom + Quick Actions ── */}
      <div className="pd-mid-grid">

>>>>>>> ccd1a4e (update)
        {/* AI Symptom Checker */}
        <div className="card pd-card">
          <div className="pd-card-header">
            <div className="pd-card-icon" style={{ background: 'var(--purple-light)' }}>
              <Zap size={18} color="var(--purple)" />
            </div>
            <div>
              <h3 className="pd-card-title">AI Symptom Assistant</h3>
              <p className="pd-card-sub">Describe your symptoms to get suggestions</p>
            </div>
          </div>

          <div className="pd-symptom-input-row">
            <input
              className="form-input pd-symptom-input"
              placeholder="e.g., headache, fever, chest pain..."
              value={symptom}
              onChange={e => { setSymptom(e.target.value); setSuggestions(null); }}
              onKeyDown={e => e.key === 'Enter' && handleSymptomSearch()}
            />
            <button className="btn btn-primary btn-sm pd-symptom-btn" onClick={handleSymptomSearch}>
              <Search size={14} />
            </button>
          </div>

          {suggestions ? (
            <div className="animate-fadeIn pd-suggestions">
              <div className="pd-suggest-section">
                <div className="pd-suggest-heading">Suggested Departments</div>
                <div className="pd-tag-row">
                  {suggestions.departments.map(d => (
                    <span key={d} className="badge badge-primary">{d}</span>
                  ))}
                </div>
              </div>
              <div className="pd-suggest-heading" style={{ marginBottom: '8px' }}>Available Doctors</div>
              {suggestions.doctors.map(doc => (
<<<<<<< HEAD
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: 'var(--radius)', background: 'var(--gray-50)', marginBottom: '6px', cursor: 'pointer' }}
                  onClick={() => navigate('/doctors')}>
                  <div className="avatar avatar-sm call-effect">{doc.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{doc.specialty}</div>
=======
                <div key={doc.id} className="pd-doc-row" onClick={() => navigate('/doctors')}>
                  <div className="avatar avatar-sm">{doc.initials}</div>
                  <div className="pd-doc-info">
                    <div className="pd-doc-name">{doc.name}</div>
                    <div className="pd-doc-spec">{doc.specialty}</div>
>>>>>>> ccd1a4e (update)
                  </div>
                  <div className={`status-dot ${doc.online ? 'status-online' : 'status-offline'}`} />
                </div>
              ))}
              <button
                className="btn btn-outline btn-sm pd-view-btn"
                onClick={() => navigate('/doctors')}>
                View All Doctors <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="pd-tag-row">
              {symptomTags.map(s => (
                <button key={s} className="pd-tag-btn" onClick={() => setSymptom(s)}>{s}</button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card pd-card">
          <h3 className="pd-card-title" style={{ marginBottom: '16px' }}>Quick Actions</h3>
          <div className="pd-actions-grid">
            {quickActions.map(a => (
              <button key={a.label} className="pd-action-btn" onClick={() => navigate(a.path)}
                style={{ '--action-bg': a.bg, '--action-border': a.color }}>
                <div className="pd-action-icon" style={{ background: a.bg }}>
                  <a.icon size={20} color={a.color} />
                </div>
                <span className="pd-action-label">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Appointments + Prescriptions ── */}
      <div className="pd-bottom-grid">

        {/* Upcoming Appointments */}
        <div className="card pd-card">
          <div className="pd-section-head">
            <h3 className="pd-card-title">Upcoming Appointments</h3>
            <button className="pd-view-all" onClick={() => navigate('/appointments')}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="pd-empty">
              <Calendar size={32} className="pd-empty-icon" />
              <p>No upcoming appointments</p>
            </div>
          ) : (
            <div className="pd-list">
              {upcoming.slice(0, 4).map(apt => (
                <div key={apt.id} className="pd-apt-item">
                  <div className="avatar avatar-md">
                    {apt.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="pd-apt-info">
                    <div className="pd-apt-name">{apt.doctorName}</div>
                    <div className="pd-apt-spec">{apt.doctorSpecialty}</div>
                    <div className="pd-apt-time">
                      <Clock size={11} />
                      <span>{apt.date} · {apt.time}</span>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Prescriptions */}
        <div className="card pd-card">
          <div className="pd-section-head">
            <h3 className="pd-card-title">Active Prescriptions</h3>
            <button className="pd-view-all" onClick={() => navigate('/prescriptions')}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {activePrescriptions.length === 0 ? (
            <div className="pd-empty">
              <FileText size={32} className="pd-empty-icon" />
              <p>No active prescriptions</p>
            </div>
          ) : (
            <div className="pd-list">
              {activePrescriptions.slice(0, 3).map(rx => (
                <div key={rx.id} className="pd-rx-card">
                  <div className="pd-rx-top">
                    <div className="pd-rx-left">
                      <div className="pd-rx-diagnosis">{rx.diagnosis}</div>
                      <div className="pd-rx-meta">{rx.doctorName} · {rx.date}</div>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                  <div className="pd-rx-medicines">
                    {rx.medicines.slice(0, 2).map((m, i) => (
                      <div key={i} className="pd-rx-med">
                        <CheckCircle size={11} color="var(--secondary)" style={{ flexShrink: 0 }} />
                        <span>{m.name} — {m.frequency}</span>
                      </div>
                    ))}
                    {rx.medicines.length > 2 && (
                      <span className="pd-rx-more">+{rx.medicines.length - 2} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Scoped Styles ── */}
      <style>{`
        /* ── Banner ──────────────────────────────── */
        .pd-banner {
          background: linear-gradient(135deg, var(--primary-dark) 0%, #0369a1 100%);
          border-radius: var(--radius-xl);
          padding: 28px 32px;
          margin-bottom: 24px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .pd-banner-circle {
          position: absolute;
          background: rgba(255,255,255,0.07);
          border-radius: 50%;
          pointer-events: none;
        }
        .pd-banner-c1 { width: 200px; height: 200px; top: -60px; right: -40px; }
        .pd-banner-c2 { width: 130px; height: 130px; bottom: -50px; right: 80px; }
        .pd-banner-inner {
          position: relative; z-index: 1;
          display: flex; align-items: flex-start;
          justify-content: space-between; flex-wrap: wrap; gap: 16px;
        }
        .pd-banner-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 6px; }
        .pd-banner-sub   { opacity: 0.87; font-size: 0.9rem; line-height: 1.6; }
        .pd-banner-btns  { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
        .pd-banner-btn-ghost {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: var(--radius);
          font-size: 0.875rem; font-weight: 600;
          background: rgba(255,255,255,0.18);
          color: white; border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer; transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .pd-banner-btn-ghost:hover { background: rgba(255,255,255,0.26); }
        .pd-banner-btn-solid {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: var(--radius);
          font-size: 0.875rem; font-weight: 700;
          background: white; color: var(--primary-dark);
          border: none; cursor: pointer; transition: all 0.2s;
        }
        .pd-banner-btn-solid:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

        /* ── Stats ───────────────────────────────── */
        .pd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .pd-stat-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          border: 1px solid var(--gray-200);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: all 0.2s;
        }
        .pd-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .pd-stat-top   { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .pd-stat-icon  { width: 44px; height: 44px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; }
        .pd-stat-arrow { color: var(--gray-300); }
        .pd-stat-val   { font-size: 2rem; font-weight: 800; color: var(--gray-900); line-height: 1; }
        .pd-stat-label { font-size: 0.78rem; color: var(--gray-500); margin-top: 4px; font-weight: 500; }

        /* ── Card base ───────────────────────────── */
        .pd-card { padding: 22px; }
        .pd-card-header {
          display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;
        }
        .pd-card-icon  { width: 38px; height: 38px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pd-card-title { font-size: 1rem; font-weight: 700; color: var(--gray-900); margin: 0; }
        .pd-card-sub   { font-size: 0.75rem; color: var(--gray-400); margin-top: 2px; }
        .pd-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 6px; }
        .pd-view-all {
          display: flex; align-items: center; gap: 4px;
          background: none; border: none; color: var(--primary);
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          white-space: nowrap;
        }
        .pd-view-all:hover { text-decoration: underline; }

        /* ── Middle grid ─────────────────────────── */
        .pd-mid-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        /* ── Symptom ─────────────────────────────── */
        .pd-symptom-input-row { display: flex; gap: 8px; margin-bottom: 14px; }
        .pd-symptom-input     { flex: 1; }
        .pd-symptom-btn       { flex-shrink: 0; padding: 0 14px; height: 40px; }
        .pd-tag-row           { display: flex; flex-wrap: wrap; gap: 7px; }
        .pd-tag-btn {
          padding: 5px 12px; border-radius: var(--radius-full);
          border: 1.5px solid var(--gray-200); background: var(--gray-50);
          font-size: 0.78rem; color: var(--gray-600); cursor: pointer;
          transition: all 0.15s; font-family: inherit;
        }
        .pd-tag-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .pd-suggestions    { }
        .pd-suggest-section{ margin-bottom: 14px; }
        .pd-suggest-heading{ font-size: 0.72rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .pd-doc-row {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: var(--radius);
          background: var(--gray-50); margin-bottom: 6px;
          cursor: pointer; transition: background 0.15s;
        }
        .pd-doc-row:hover { background: var(--primary-light); }
        .pd-doc-info  { flex: 1; overflow: hidden; }
        .pd-doc-name  { font-weight: 600; font-size: 0.82rem; color: var(--gray-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pd-doc-spec  { font-size: 0.72rem; color: var(--gray-400); }
        .pd-view-btn  { width: 100%; margin-top: 10px; justify-content: center; }

        /* ── Quick Actions ───────────────────────── */
        .pd-actions-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .pd-action-btn {
          display: flex; flex-direction: column; align-items: center; gap: 9px;
          padding: 18px 10px; border-radius: var(--radius-lg);
          border: 1.5px solid var(--gray-200); background: white;
          cursor: pointer; transition: all 0.18s; font-family: inherit;
        }
        .pd-action-btn:hover {
          background: var(--action-bg, var(--gray-50));
          border-color: var(--action-border, var(--gray-300));
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .pd-action-icon  { width: 42px; height: 42px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; }
        .pd-action-label { font-size: 0.8rem; font-weight: 600; color: var(--gray-700); text-align: center; line-height: 1.3; }

        /* ── Bottom grid ─────────────────────────── */
        .pd-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .pd-list { display: flex; flex-direction: column; gap: 10px; }
        .pd-empty {
          text-align: center; padding: 28px 16px; color: var(--gray-400);
          display: flex; flex-direction: column; align-items: center;
        }
        .pd-empty-icon { opacity: 0.35; margin-bottom: 10px; }
        .pd-empty p    { font-size: 0.875rem; }

        /* Appointment item */
        .pd-apt-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px; border-radius: var(--radius);
          background: var(--gray-50); border: 1px solid var(--gray-100);
          transition: background 0.15s;
        }
        .pd-apt-item:hover { background: var(--primary-light); }
        .pd-apt-info  { flex: 1; overflow: hidden; }
        .pd-apt-name  { font-weight: 600; font-size: 0.875rem; color: var(--gray-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pd-apt-spec  { font-size: 0.75rem; color: var(--gray-400); }
        .pd-apt-time  { display: flex; align-items: center; gap: 4px; margin-top: 3px; color: var(--gray-400); font-size: 0.72rem; }

        /* Prescription card */
        .pd-rx-card {
          padding: 14px; border-radius: var(--radius-lg);
          background: #f0fdf4; border: 1px solid #a7f3d0;
        }
        .pd-rx-top     { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 8px; }
        .pd-rx-left    { flex: 1; overflow: hidden; }
        .pd-rx-diagnosis{ font-weight: 700; font-size: 0.875rem; color: var(--gray-900); }
        .pd-rx-meta    { font-size: 0.75rem; color: var(--gray-500); margin-top: 2px; }
        .pd-rx-medicines{ display: flex; flex-direction: column; gap: 5px; }
        .pd-rx-med     { display: flex; align-items: center; gap: 7px; font-size: 0.75rem; color: var(--gray-600); }
        .pd-rx-more    { font-size: 0.7rem; color: var(--gray-400); margin-top: 2px; }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 1100px) {
          .pd-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .pd-mid-grid    { grid-template-columns: 1fr; }
          .pd-bottom-grid { grid-template-columns: 1fr; }
          .pd-actions-grid{ grid-template-columns: repeat(4, 1fr); }
          .pd-action-btn  { padding: 14px 8px; }
        }
        @media (max-width: 768px) {
          .pd-banner       { padding: 22px 22px; }
          .pd-banner-title { font-size: 1.3rem; }
          .pd-banner-sub   { font-size: 0.85rem; }
          .pd-stats-grid   { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .pd-stat-val     { font-size: 1.6rem; }
          .pd-stat-card    { padding: 14px 16px; }
        }
        @media (max-width: 640px) {
          .pd-banner       { padding: 18px 18px; border-radius: var(--radius-lg); }
          .pd-banner-title { font-size: 1.15rem; }
          .pd-banner-sub   { font-size: 0.82rem; }
          .pd-banner-btns  { width: 100%; }
          .pd-banner-btn-ghost,
          .pd-banner-btn-solid { flex: 1; justify-content: center; font-size: 0.82rem; padding: 8px 12px; }
          .pd-stats-grid   { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 18px; }
          .pd-stat-card    { padding: 12px 14px; }
          .pd-stat-val     { font-size: 1.5rem; }
          .pd-stat-label   { font-size: 0.72rem; }
          .pd-stat-icon    { width: 38px; height: 38px; }
          .pd-mid-grid     { gap: 14px; margin-bottom: 14px; }
          .pd-bottom-grid  { gap: 14px; }
          .pd-card         { padding: 16px; }
          .pd-actions-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .pd-action-btn   { padding: 14px 8px; gap: 7px; }
          .pd-action-icon  { width: 36px; height: 36px; }
          .pd-action-label { font-size: 0.75rem; }
          .pd-apt-item     { padding: 10px; }
          .pd-apt-name     { font-size: 0.82rem; }
          .pd-rx-diagnosis { font-size: 0.82rem; }
        }
        @media (max-width: 480px) {
          .pd-banner-inner { flex-direction: column; }
          .pd-stats-grid   { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .pd-stat-val     { font-size: 1.4rem; }
          .pd-actions-grid { grid-template-columns: repeat(2, 1fr); }
          .pd-symptom-input-row { flex-direction: row; }
          .pd-apt-info     { min-width: 0; }
          .pd-rx-top       { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 380px) {
          .pd-banner       { padding: 16px; }
          .pd-banner-title { font-size: 1.05rem; }
          .pd-stat-val     { font-size: 1.25rem; }
          .pd-stat-icon    { width: 34px; height: 34px; }
          .pd-card         { padding: 14px; }
        }
      `}</style>
    </Layout>
  );
}
