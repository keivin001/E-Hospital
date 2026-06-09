import { useState } from 'react';
import {
  Calendar, Clock, Video, MapPin, Plus, X,
  CheckCircle, ChevronLeft, ChevronRight, Star,
  Building2, Activity,
} from 'lucide-react';
import Layout from '../components/Layout';
import { DOCTORS, TIME_SLOTS } from '../data/mockData';
import { useApp } from '../context/AppContext';

/* ── Status config ───────────────────────────── */
const STATUS_CFG = {
  confirmed: { badge: 'apt-s-confirmed', dot: '#10b981', label: 'Confirmed', icon: '✅' },
  pending:   { badge: 'apt-s-pending',   dot: '#f59e0b', label: 'Pending',   icon: '⏳' },
  completed: { badge: 'apt-s-completed', dot: '#94a3b8', label: 'Completed', icon: '✓'  },
  cancelled: { badge: 'apt-s-cancelled', dot: '#ef4444', label: 'Cancelled', icon: '✗'  },
};

export default function Appointments() {
  const { user, addToast, appointments, setAppointments } = useApp();
  const [activeTab,  setActiveTab]  = useState('all');
  const [showModal,  setShowModal]  = useState(false);
  const [step,       setStep]       = useState(1);
  const [booking,    setBooking]    = useState({ doctor: null, date: '', time: '', type: 'online', reason: '' });
  const [expandedId, setExpandedId] = useState(null);

  /* ── Filter user's appointments ── */
  const userApts = (appointments || []).filter(apt => {
    if (!user) return false;
    return user.role === 'doctor'
      ? apt.doctorName?.includes(user.name)
      : apt.patientName === user.name || apt.patientName === 'Eric Johnson';
  });

  const TABS = [
    { value: 'all',       label: 'All' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending',   label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = activeTab === 'all' ? userApts : userApts.filter(a => a.status === activeTab);
  const countOf  = v => v === 'all' ? userApts.length : userApts.filter(a => a.status === v).length;

  /* ── Summary stats ── */
  const stats = [
    { label: 'Total',     value: userApts.length,                                icon: Activity, color: '#0ea5e9', bg: '#e0f2fe' },
    { label: 'Confirmed', value: countOf('confirmed'),                           icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    { label: 'Pending',   value: countOf('pending'),                             icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Completed', value: countOf('completed'),                           icon: Star, color: '#8b5cf6', bg: '#ede9fe' },
  ];

  /* ── Modal helpers ── */
  const resetModal = () => { setShowModal(false); setStep(1); setBooking({ doctor: null, date: '', time: '', type: 'online', reason: '' }); };

  const handleBook = () => {
    if (!booking.doctor || !booking.date || !booking.time) { addToast('Please fill all required fields', 'error'); return; }
    setAppointments(prev => [{
      id: `a${Date.now()}`, patientName: user?.name || 'Eric Johnson',
      doctorName: booking.doctor.name, doctorSpecialty: booking.doctor.specialty,
      date: booking.date, time: booking.time, status: 'pending', type: booking.type,
      fee: booking.doctor.fee, reason: booking.reason || 'General consultation', hospital: booking.doctor.hospital,
    }, ...prev]);
    resetModal();
    addToast('Appointment booked successfully!', 'success');
  };

  const nextStep = () => {
    if (step === 1 && !booking.doctor) { addToast('Please select a doctor', 'error'); return; }
    if (step === 2 && (!booking.date || !booking.time)) { addToast('Please select date and time', 'error'); return; }
    setStep(s => s + 1);
  };

  const cancelApt   = id => { setAppointments(p => p.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)); addToast('Appointment cancelled', 'warning'); };
  const joinCall    = apt => addToast(`Joining call with ${apt.doctorName}...`, 'success');
  const viewSummary = apt => addToast(`Loading summary for ${apt.doctorName}`, 'default');
  const ini = name  => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <Layout title="Appointments">

      {/* ── Stats row ── */}
      <div className="ap-stats">
        {stats.map(s => (
          <div key={s.label} className="ap-stat-card">
            <div className="ap-stat-icon" style={{ background: s.bg, color: s.color }}>
              <s.icon size={18} />
            </div>
            <div>
              <div className="ap-stat-val">{s.value}</div>
              <div className="ap-stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="ap-toolbar">
        <div className="ap-tabs-scroll">
          <div className="ap-tabs">
            {TABS.map(t => (
              <button key={t.value}
                className={`ap-tab ${activeTab === t.value ? 'ap-tab-on' : ''}`}
                onClick={() => setActiveTab(t.value)}>
                {t.label}
                <span className={`ap-tab-pill ${activeTab === t.value ? 'ap-tab-pill-on' : ''}`}>
                  {countOf(t.value)}
                </span>
              </button>
            ))}
          </div>
        </div>
        <button className="ap-book-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="ap-empty">
          <div className="ap-empty-icon"><Calendar size={44} /></div>
          <h3>No {activeTab === 'all' ? '' : activeTab} appointments</h3>
          <p>{activeTab === 'all' ? "You haven't booked any appointments yet." : `No ${activeTab} appointments found.`}</p>
          {activeTab === 'all' && (
            <button className="ap-book-btn ap-empty-btn" onClick={() => setShowModal(true)}>
              <Plus size={15} /> Book Your First Appointment
            </button>
          )}
        </div>
      )}

      {/* ── Appointment cards ── */}
      <div className="ap-list">
        {filtered.map(apt => {
          const cfg      = STATUS_CFG[apt.status] || STATUS_CFG.pending;
          const expanded = expandedId === apt.id;
          return (
            <div key={apt.id} className={`ap-card ${expanded ? 'ap-card-open' : ''}`}>

              {/* Status left bar */}
              <div className="ap-card-bar" style={{ background: cfg.dot }} />

              {/* Main clickable area */}
              <div className="ap-card-body" onClick={() => setExpandedId(expanded ? null : apt.id)}>

                {/* Left: avatar */}
                <div className="ap-card-avatar-wrap">
                  <div className="ap-card-avatar">{ini(apt.doctorName)}</div>
                  <span className="ap-card-online-dot" style={{ background: apt.status === 'confirmed' ? '#10b981' : cfg.dot }} />
                </div>

                {/* Center: info */}
                <div className="ap-card-info">
                  <div className="ap-card-top">
                    <div>
                      <div className="ap-card-name">{apt.doctorName}</div>
                      <div className="ap-card-spec">{apt.doctorSpecialty}</div>
                    </div>
                    <span className={`ap-status-badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                  </div>

                  <div className="ap-card-meta">
                    <span className="ap-meta-chip"><Calendar size={12} />{apt.date}</span>
                    <span className="ap-meta-chip"><Clock size={12} />{apt.time}</span>
                    <span className="ap-meta-chip">
                      {apt.type === 'online' ? <Video size={12} /> : <MapPin size={12} />}
                      {apt.type === 'online' ? 'Online' : 'Physical'}
                    </span>
                    {apt.hospital && (
                      <span className="ap-meta-chip ap-meta-hosp"><Building2 size={12} />{apt.hospital}</span>
                    )}
                  </div>

                  {apt.reason && (
                    <div className="ap-card-reason">
                      <span className="ap-reason-label">Reason:</span> {apt.reason}
                    </div>
                  )}
                </div>

                {/* Right: fee + expand */}
                <div className="ap-card-right">
                  <div className="ap-card-fee">${apt.fee}</div>
                  <div className="ap-card-expand-hint">{expanded ? '▲' : '▼'}</div>
                </div>
              </div>

              {/* Expanded panel */}
              {expanded && (
                <div className="ap-card-expanded animate-fadeIn">
                  <div className="ap-exp-grid">
                    <div className="ap-exp-item"><span className="ap-exp-lbl">Patient</span><span className="ap-exp-val">{apt.patientName}</span></div>
                    <div className="ap-exp-item"><span className="ap-exp-lbl">Hospital</span><span className="ap-exp-val">{apt.hospital || '—'}</span></div>
                    <div className="ap-exp-item"><span className="ap-exp-lbl">Type</span><span className="ap-exp-val" style={{ textTransform: 'capitalize' }}>{apt.type}</span></div>
                    <div className="ap-exp-item"><span className="ap-exp-lbl">Fee</span><span className="ap-exp-val ap-exp-fee">${apt.fee}</span></div>
                  </div>
                  <div className="ap-exp-actions">
                    {apt.status === 'confirmed' && (
                      <>
                        <button className="ap-action-btn ap-action-primary" onClick={() => joinCall(apt)}>
                          <Video size={14} /> Join Video Call
                        </button>
                        <button className="ap-action-btn ap-action-danger" onClick={() => cancelApt(apt.id)}>
                          <X size={14} /> Cancel
                        </button>
                      </>
                    )}
                    {apt.status === 'pending' && (
                      <button className="ap-action-btn ap-action-danger" onClick={() => cancelApt(apt.id)}>
                        <X size={14} /> Cancel Appointment
                      </button>
                    )}
                    {apt.status === 'completed' && (
                      <button className="ap-action-btn ap-action-ghost" onClick={() => viewSummary(apt)}>
                        <Activity size={14} /> View Summary
                      </button>
                    )}
                    {apt.status === 'cancelled' && (
                      <button className="ap-action-btn ap-action-primary" onClick={() => { resetModal(); setShowModal(true); }}>
                        <Plus size={14} /> Rebook
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════ BOOKING MODAL ══════════ */}
      {showModal && (
        <div className="bm-overlay" onClick={resetModal}>
          <div className="bm-modal" onClick={e => e.stopPropagation()}>

            {/* Head */}
            <div className="bm-head">
              <div className="bm-head-left">
                <div className="bm-head-icon"><Calendar size={20} /></div>
                <div>
                  <h2 className="bm-title">Book Appointment</h2>
                  <p className="bm-subtitle">{step === 1 ? 'Choose your doctor' : step === 2 ? 'Pick a date & time' : 'Review & confirm'}</p>
                </div>
              </div>
              <button className="bm-close" onClick={resetModal}><X size={18} /></button>
            </div>

            {/* Step indicator */}
            <div className="bm-steps">
              {[{ n:1, label:'Doctor' }, { n:2, label:'Schedule' }, { n:3, label:'Confirm' }].map(({ n, label }, i) => (
                <div key={n} className="bm-step-item">
                  <div className={`bm-step-circle ${step > n ? 'bm-step-done' : step === n ? 'bm-step-active' : 'bm-step-idle'}`}>
                    {step > n ? <CheckCircle size={14} /> : n}
                  </div>
                  <span className={`bm-step-label ${step === n ? 'bm-step-label-on' : ''}`}>{label}</span>
                  {i < 2 && <div className={`bm-step-line ${step > n ? 'bm-line-done' : ''}`} />}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="bm-body">
              {/* Step 1: Doctor */}
              {step === 1 && (
                <div className="animate-fadeIn">
                  <div className="bm-sec-head"><span className="bm-sec-num">01</span><h3 className="bm-sec-title">Select a Doctor</h3></div>
                  <div className="bm-doc-list">
                    {DOCTORS.filter(d => d.available).map(doc => {
                      const sel = booking.doctor?.id === doc.id;
                      return (
                        <button key={doc.id} className={`bm-doc-card ${sel ? 'bm-doc-sel' : ''}`}
                          onClick={() => setBooking(b => ({ ...b, doctor: doc }))}>
                          <div className={`bm-doc-av ${sel ? 'bm-doc-av-sel' : ''}`}>{doc.initials}</div>
                          <div className="bm-doc-info">
                            <div className="bm-doc-name">{doc.name}</div>
                            <div className="bm-doc-spec">{doc.specialty}</div>
                            <div className="bm-doc-hosp">🏥 {doc.hospital}</div>
                          </div>
                          <div className="bm-doc-right">
                            <div className="bm-doc-fee">${doc.fee}</div>
                            <div className="bm-doc-fee-lbl">per visit</div>
                            {sel && <div className="bm-doc-check"><CheckCircle size={15} /></div>}
                          </div>
                          {doc.online && <span className="bm-online-dot" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div className="animate-fadeIn">
                  <div className="bm-sec-head"><span className="bm-sec-num">02</span><h3 className="bm-sec-title">Date & Time</h3></div>
                  {booking.doctor && (
                    <div className="bm-sel-doc">
                      <div className="bm-sel-av">{booking.doctor.initials}</div>
                      <div><div className="bm-sel-name">{booking.doctor.name}</div><div className="bm-sel-spec">{booking.doctor.specialty}</div></div>
                    </div>
                  )}
                  <div className="bm-field-section">
                    <label className="bm-field-lbl"><Calendar size={13} /> Appointment Date</label>
                    <input type="date" className="bm-date-input" value={booking.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setBooking(b => ({ ...b, date: e.target.value }))} />
                  </div>
                  <div className="bm-field-section">
                    <label className="bm-field-lbl"><Clock size={13} /> Available Time Slots</label>
                    <div className="bm-slots-grid">
                      {TIME_SLOTS.map(slot => (
                        <button key={slot} className={`bm-slot ${booking.time === slot ? 'bm-slot-on' : ''}`}
                          onClick={() => setBooking(b => ({ ...b, time: slot }))}>{slot}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bm-field-section">
                    <label className="bm-field-lbl">Consultation Type</label>
                    <div className="bm-type-grid">
                      {[['online','💻','Online','Video consultation'],['physical','🏥','Physical','In-person visit']].map(([t, em, nm, desc]) => (
                        <button key={t} className={`bm-type-card ${booking.type === t ? 'bm-type-on' : ''}`}
                          onClick={() => setBooking(b => ({ ...b, type: t }))}>
                          <span className="bm-type-em">{em}</span>
                          <span className="bm-type-nm">{nm}</span>
                          <span className="bm-type-desc">{desc}</span>
                          {booking.type === t && <CheckCircle size={13} className="bm-type-chk" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="animate-fadeIn">
                  <div className="bm-sec-head"><span className="bm-sec-num">03</span><h3 className="bm-sec-title">Review & Confirm</h3></div>
                  <div className="bm-summary">
                    <div className="bm-sum-doc">
                      <div className="bm-sum-av">{booking.doctor?.initials}</div>
                      <div className="bm-sum-doc-info">
                        <div className="bm-sum-doc-name">{booking.doctor?.name}</div>
                        <div className="bm-sum-doc-spec">{booking.doctor?.specialty}</div>
                        <div className="bm-sum-doc-hosp">{booking.doctor?.hospital}</div>
                      </div>
                      <div className="bm-sum-fee-wrap">
                        <span className="bm-sum-fee">${booking.doctor?.fee}</span>
                        <span className="bm-sum-fee-lbl">Total</span>
                      </div>
                    </div>
                    <div className="bm-sum-rows">
                      {[['📅','Date',booking.date],['🕐','Time',booking.time],['📍','Type',booking.type === 'online' ? '💻 Online' : '🏥 Physical'],['🏥','Hospital',booking.doctor?.hospital]].map(([ic, lbl, val]) => (
                        <div key={lbl} className="bm-sum-row">
                          <span className="bm-sum-row-left"><span className="bm-sum-ic">{ic}</span>{lbl}</span>
                          <span className="bm-sum-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bm-field-section">
                    <label className="bm-field-lbl">Reason for Visit <span className="bm-optional">(optional)</span></label>
                    <textarea className="bm-textarea" placeholder="Describe your symptoms or reason..."
                      value={booking.reason} onChange={e => setBooking(b => ({ ...b, reason: e.target.value }))} />
                  </div>
                  <div className="bm-disclaimer">🔒 Your information is protected with end-to-end encryption.</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bm-footer">
              {step > 1
                ? <button className="bm-btn-back" onClick={() => setStep(s => s - 1)}><ChevronLeft size={15} /> Back</button>
                : <button className="bm-btn-back" onClick={resetModal}>Cancel</button>}
              <div className="bm-dots">{[1,2,3].map(n => <span key={n} className={`bm-dot ${step === n ? 'bm-dot-on' : ''}`} />)}</div>
              {step < 3
                ? <button className="bm-btn-next" onClick={nextStep}>Continue <ChevronRight size={15} /></button>
                : <button className="bm-btn-confirm" onClick={handleBook}><CheckCircle size={15} /> Confirm</button>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Stats ─────────────────────────────── */
        .ap-stats {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 12px; margin-bottom: 22px;
        }
        .ap-stat-card {
          background: white; border-radius: 14px;
          border: 1px solid var(--gray-200);
          padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s;
        }
        .ap-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .ap-stat-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ap-stat-val  { font-size: 1.4rem; font-weight: 800; color: var(--gray-900); line-height: 1; }
        .ap-stat-lbl  { font-size: 0.72rem; color: var(--gray-500); margin-top: 2px; font-weight: 500; }

        /* ── Toolbar ───────────────────────────── */
        .ap-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 18px; flex-wrap: wrap;
        }
        .ap-tabs-scroll {
          flex: 1; overflow-x: auto; min-width: 0;
          scrollbar-width: none;
        }
        .ap-tabs-scroll::-webkit-scrollbar { display: none; }
        .ap-tabs {
          display: flex; gap: 3px; padding: 4px;
          background: var(--gray-100); border-radius: 10px;
          width: max-content; min-width: 100%;
        }
        .ap-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 7px;
          font-size: 0.82rem; font-weight: 600;
          border: none; cursor: pointer; background: none;
          color: var(--gray-500); white-space: nowrap;
          transition: all 0.15s;
        }
        .ap-tab:hover { color: var(--gray-800); }
        .ap-tab-on    { background: white; color: var(--gray-900); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .ap-tab-pill  {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 18px; height: 18px; padding: 0 5px;
          border-radius: 9px; font-size: 0.65rem; font-weight: 700;
          background: var(--gray-300); color: white; transition: background 0.15s;
        }
        .ap-tab-pill-on { background: var(--primary); }
        .ap-book-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 10px;
          background: var(--primary); color: white;
          border: none; font-size: 0.875rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          font-family: inherit; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(14,165,233,0.3);
        }
        .ap-book-btn:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(14,165,233,0.4); }

        /* ── Empty ─────────────────────────────── */
        .ap-empty {
          text-align: center; padding: 64px 20px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .ap-empty-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: var(--primary-light); color: var(--primary);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 6px;
        }
        .ap-empty h3 { font-size: 1.1rem; font-weight: 700; color: var(--gray-700); margin: 0; }
        .ap-empty p  { font-size: 0.875rem; color: var(--gray-400); margin: 0; }
        .ap-empty-btn { margin-top: 8px; }

        /* ── Cards ─────────────────────────────── */
        .ap-list { display: flex; flex-direction: column; gap: 10px; }
        .ap-card {
          background: white; border-radius: 16px;
          border: 1px solid var(--gray-200);
          overflow: hidden; transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          display: flex; flex-direction: column;
        }
        .ap-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-color: var(--gray-300); }
        .ap-card-open  { border-color: var(--primary); box-shadow: 0 4px 24px rgba(14,165,233,0.12); }

        /* Status left bar */
        .ap-card-bar { height: 3px; flex-shrink: 0; }

        /* Card body */
        .ap-card-body {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 18px; cursor: pointer;
        }

        /* Avatar */
        .ap-card-avatar-wrap { position: relative; flex-shrink: 0; }
        .ap-card-avatar {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-light), #bae6fd);
          color: var(--primary); font-size: 0.85rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .ap-card-online-dot {
          width: 12px; height: 12px; border-radius: 50%;
          border: 2px solid white;
          position: absolute; bottom: 1px; right: 1px;
        }

        /* Info */
        .ap-card-info { flex: 1; min-width: 0; }
        .ap-card-top  {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 8px; flex-wrap: wrap; margin-bottom: 8px;
        }
        .ap-card-name { font-size: 0.95rem; font-weight: 700; color: var(--gray-900); margin-bottom: 2px; }
        .ap-card-spec { font-size: 0.78rem; color: var(--primary); font-weight: 600; }

        /* Status badges */
        .ap-status-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
          white-space: nowrap;
        }
        .ap-s-confirmed { background: #dcfce7; color: #15803d; }
        .ap-s-pending   { background: #fef9c3; color: #a16207; }
        .ap-s-completed { background: #f1f5f9; color: #475569; }
        .ap-s-cancelled { background: #fee2e2; color: #b91c1c; }

        /* Meta chips */
        .ap-card-meta { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 6px; }
        .ap-meta-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 20px;
          background: var(--gray-100); color: var(--gray-600);
          font-size: 0.73rem; font-weight: 500; white-space: nowrap;
        }
        .ap-meta-hosp { max-width: 160px; overflow: hidden; text-overflow: ellipsis; }

        /* Reason */
        .ap-card-reason {
          font-size: 0.78rem; color: var(--gray-500);
          padding: 5px 10px; background: var(--gray-50);
          border-radius: 7px; border: 1px solid var(--gray-100);
          margin-top: 4px; line-height: 1.5;
        }
        .ap-reason-label { font-weight: 700; color: var(--gray-600); }

        /* Right */
        .ap-card-right {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 4px; flex-shrink: 0;
        }
        .ap-card-fee { font-size: 1.1rem; font-weight: 800; color: var(--primary); }
        .ap-card-expand-hint { font-size: 0.65rem; color: var(--gray-300); }

        /* Expanded */
        .ap-card-expanded {
          border-top: 1px solid var(--gray-100);
          padding: 14px 18px 16px;
          background: #f8fafc;
        }
        .ap-exp-grid {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 10px; margin-bottom: 14px;
        }
        .ap-exp-item  { display: flex; flex-direction: column; gap: 2px; }
        .ap-exp-lbl   { font-size: 0.67rem; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.05em; }
        .ap-exp-val   { font-size: 0.83rem; font-weight: 600; color: var(--gray-800); }
        .ap-exp-fee   { color: var(--primary); }
        .ap-exp-actions { display: flex; gap: 8px; flex-wrap: wrap; }

        /* Action buttons */
        .ap-action-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 9px;
          font-size: 0.82rem; font-weight: 700;
          border: none; cursor: pointer; font-family: inherit;
          transition: all 0.15s;
        }
        .ap-action-primary { background: var(--primary); color: white; }
        .ap-action-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }
        .ap-action-danger  { background: var(--danger); color: white; }
        .ap-action-danger:hover  { background: #dc2626; }
        .ap-action-ghost   { background: white; color: var(--gray-700); border: 1.5px solid var(--gray-200); }
        .ap-action-ghost:hover   { background: var(--gray-50); }

        /* ── Booking Modal ── */
        .bm-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(15,23,42,0.55); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .bm-modal {
          background: white; border-radius: 24px;
          width: 100%; max-width: 520px; max-height: 92vh;
          display: flex; flex-direction: column;
          box-shadow: 0 32px 80px rgba(0,0,0,0.22);
          overflow: hidden;
          animation: bm-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes bm-in { from { opacity:0; transform:scale(0.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .bm-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 22px 16px;
          background: linear-gradient(135deg, #0c4a6e, #0ea5e9);
          color: white; flex-shrink: 0;
        }
        .bm-head-left { display: flex; align-items: center; gap: 12px; }
        .bm-head-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 11px; display: flex; align-items: center; justify-content: center; }
        .bm-title    { font-size: 1.15rem; font-weight: 800; margin: 0 0 2px; }
        .bm-subtitle { font-size: 0.78rem; opacity: 0.8; margin: 0; }
        .bm-close    { width: 32px; height: 32px; background: rgba(255,255,255,0.18); border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .bm-close:hover { background: rgba(255,255,255,0.3); }
        .bm-steps    { display: flex; align-items: center; justify-content: center; gap: 0; padding: 16px 22px 12px; flex-shrink: 0; }
        .bm-step-item { display: flex; align-items: center; gap: 0; }
        .bm-step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; transition: all 0.2s; z-index: 1; position: relative; }
        .bm-step-idle   { background: var(--gray-100); color: var(--gray-400); }
        .bm-step-active { background: var(--primary); color: white; box-shadow: 0 0 0 5px rgba(14,165,233,0.18); }
        .bm-step-done   { background: var(--secondary); color: white; }
        .bm-step-label  { font-size: 0.7rem; font-weight: 600; color: var(--gray-400); margin: 0 6px; white-space: nowrap; }
        .bm-step-label-on { color: var(--primary); }
        .bm-step-line { width: 36px; height: 2px; background: var(--gray-200); border-radius: 2px; transition: background 0.3s; }
        .bm-line-done { background: var(--secondary); }
        .bm-body { flex: 1; overflow-y: auto; padding: 6px 22px 18px; scrollbar-width: thin; scrollbar-color: var(--gray-200) transparent; }
        .bm-body::-webkit-scrollbar { width: 4px; }
        .bm-body::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 2px; }
        .bm-sec-head { display: flex; align-items: center; gap: 8px; margin: 10px 0 14px; }
        .bm-sec-num  { font-size: 0.64rem; font-weight: 800; color: var(--primary); background: var(--primary-light); padding: 2px 7px; border-radius: 20px; letter-spacing: 0.04em; }
        .bm-sec-title{ font-size: 0.95rem; font-weight: 700; color: var(--gray-900); margin: 0; }
        .bm-doc-list { display: flex; flex-direction: column; gap: 7px; }
        .bm-doc-card {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 13px;
          border: 2px solid var(--gray-200); background: white;
          cursor: pointer; transition: all 0.15s; text-align: left;
          width: 100%; font-family: inherit; position: relative; overflow: hidden;
        }
        .bm-doc-card:hover { border-color: var(--primary); background: var(--primary-light); }
        .bm-doc-sel  { border-color: var(--primary) !important; background: linear-gradient(135deg,#e0f2fe,#f0f9ff) !important; }
        .bm-doc-av   { width: 44px; height: 44px; border-radius: 11px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 800; flex-shrink: 0; transition: all 0.15s; }
        .bm-doc-av-sel { background: var(--primary); color: white; }
        .bm-doc-info { flex: 1; overflow: hidden; }
        .bm-doc-name { font-size: 0.875rem; font-weight: 700; color: var(--gray-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bm-doc-spec { font-size: 0.74rem; color: var(--primary); font-weight: 600; margin: 1px 0; }
        .bm-doc-hosp { font-size: 0.68rem; color: var(--gray-400); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bm-doc-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; gap: 2px; }
        .bm-doc-fee   { font-size: 1rem; font-weight: 800; color: var(--gray-900); }
        .bm-doc-fee-lbl { font-size: 0.64rem; color: var(--gray-400); }
        .bm-doc-check { color: var(--primary); margin-top: 3px; }
        .bm-online-dot { position: absolute; top: 9px; right: 9px; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; border: 2px solid white; }
        .bm-field-section { margin-bottom: 18px; }
        .bm-field-lbl { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: var(--gray-700); margin-bottom: 9px; }
        .bm-sel-doc  { display: flex; align-items: center; gap: 10px; padding: 10px 13px; background: var(--primary-light); border-radius: 11px; margin-bottom: 16px; border: 1px solid rgba(14,165,233,0.2); }
        .bm-sel-av   { width: 34px; height: 34px; border-radius: 9px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; flex-shrink: 0; }
        .bm-sel-name { font-size: 0.875rem; font-weight: 700; color: var(--gray-900); }
        .bm-sel-spec { font-size: 0.72rem; color: var(--primary); font-weight: 600; }
        .bm-date-input { width: 100%; height: 42px; padding: 0 13px; border: 1.5px solid var(--gray-200); border-radius: 9px; font-size: 0.875rem; color: var(--gray-800); outline: none; transition: border-color 0.15s; font-family: inherit; background: white; }
        .bm-date-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
        .bm-slots-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 7px; }
        .bm-slot { padding: 8px 4px; border-radius: 8px; font-size: 0.72rem; font-weight: 600; border: 1.5px solid var(--gray-200); background: white; color: var(--gray-700); cursor: pointer; transition: all 0.15s; font-family: inherit; text-align: center; }
        .bm-slot:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .bm-slot-on   { border-color: var(--primary) !important; background: var(--primary) !important; color: white !important; font-weight: 700; box-shadow: 0 3px 10px rgba(14,165,233,0.3); }
        .bm-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .bm-type-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 15px 10px; border-radius: 13px; border: 2px solid var(--gray-200); background: white; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .bm-type-card:hover { border-color: var(--primary); background: var(--primary-light); }
        .bm-type-on  { border-color: var(--primary) !important; background: linear-gradient(135deg,#e0f2fe,#f0f9ff) !important; }
        .bm-type-em  { font-size: 1.4rem; }
        .bm-type-nm  { font-size: 0.875rem; font-weight: 700; color: var(--gray-900); }
        .bm-type-desc{ font-size: 0.68rem; color: var(--gray-400); }
        .bm-type-chk { position: absolute; top: 7px; right: 7px; color: var(--primary); }
        .bm-summary  { border-radius: 14px; overflow: hidden; border: 1.5px solid var(--gray-200); margin-bottom: 16px; }
        .bm-sum-doc  { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: linear-gradient(135deg,#0c4a6e,#0369a1); color: white; }
        .bm-sum-av   { width: 46px; height: 46px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 800; flex-shrink: 0; }
        .bm-sum-doc-info { flex: 1; }
        .bm-sum-doc-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; }
        .bm-sum-doc-spec { font-size: 0.75rem; opacity: 0.78; margin-bottom: 1px; }
        .bm-sum-doc-hosp { font-size: 0.68rem; opacity: 0.6; }
        .bm-sum-fee-wrap { text-align: right; flex-shrink: 0; }
        .bm-sum-fee  { display: block; font-size: 1.35rem; font-weight: 800; line-height: 1; }
        .bm-sum-fee-lbl { display: block; font-size: 0.68rem; opacity: 0.7; margin-top: 2px; }
        .bm-sum-rows { background: white; }
        .bm-sum-row  { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid var(--gray-100); }
        .bm-sum-row:last-child { border-bottom: none; }
        .bm-sum-row-left { display: flex; align-items: center; gap: 7px; font-size: 0.8rem; color: var(--gray-500); font-weight: 500; }
        .bm-sum-ic   { font-size: 0.88rem; }
        .bm-sum-val  { font-size: 0.83rem; font-weight: 700; color: var(--gray-900); }
        .bm-textarea { width: 100%; min-height: 76px; max-height: 120px; padding: 10px 13px; border: 1.5px solid var(--gray-200); border-radius: 9px; font-size: 0.875rem; color: var(--gray-800); resize: vertical; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .bm-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
        .bm-textarea::placeholder { color: var(--gray-400); }
        .bm-optional { font-size: 0.72rem; color: var(--gray-400); font-weight: 400; margin-left: 4px; }
        .bm-disclaimer { padding: 9px 13px; background: #f0fdf4; border-radius: 9px; border: 1px solid #a7f3d0; font-size: 0.74rem; color: #166534; font-weight: 500; }
        .bm-footer { display: flex; align-items: center; justify-content: space-between; padding: 13px 22px; border-top: 1px solid var(--gray-100); background: var(--gray-50); flex-shrink: 0; gap: 10px; }
        .bm-btn-back { display: flex; align-items: center; gap: 5px; padding: 8px 16px; border-radius: 9px; border: 1.5px solid var(--gray-200); background: white; font-size: 0.85rem; font-weight: 600; color: var(--gray-600); cursor: pointer; font-family: inherit; }
        .bm-btn-back:hover { background: var(--gray-100); }
        .bm-dots { display: flex; gap: 5px; }
        .bm-dot  { width: 7px; height: 7px; border-radius: 50%; background: var(--gray-300); transition: all 0.2s; }
        .bm-dot-on { background: var(--primary); width: 18px; border-radius: 4px; }
        .bm-btn-next { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 9px; background: var(--primary); color: white; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .bm-btn-next:hover { background: var(--primary-dark); transform: translateY(-1px); }
        .bm-btn-confirm { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 9px; background: linear-gradient(135deg,var(--secondary),#059669); color: white; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .bm-btn-confirm:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(16,185,129,0.4); }

        /* ── Responsive ─────────────────────────── */
        @media (max-width: 900px) {
          .ap-stats { grid-template-columns: repeat(2,1fr); }
          .ap-exp-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 640px) {
          .ap-stats { grid-template-columns: repeat(2,1fr); gap: 8px; }
          .ap-stat-card { padding: 12px; }
          .ap-stat-val  { font-size: 1.2rem; }
          .ap-toolbar   { flex-direction: column; align-items: stretch; }
          .ap-book-btn  { width: 100%; justify-content: center; }
          .ap-card-body { padding: 13px 14px; gap: 10px; }
          .ap-card-avatar { width: 42px; height: 42px; font-size: 0.8rem; }
          .ap-card-fee  { font-size: 1rem; }
          .ap-card-expanded { padding: 12px 14px 14px; }
          .ap-exp-grid  { grid-template-columns: repeat(2,1fr); gap: 8px; }
          .bm-slots-grid { grid-template-columns: repeat(3,1fr); }
          .bm-overlay   { padding: 0; align-items: flex-end; }
          .bm-modal     { border-radius: 24px 24px 0 0; max-height: 94vh; }
        }
        @media (max-width: 420px) {
          .ap-stats { grid-template-columns: 1fr 1fr; }
          .ap-card-name { font-size: 0.88rem; }
          .ap-meta-chip { font-size: 0.68rem; padding: 3px 7px; }
          .ap-exp-grid  { grid-template-columns: 1fr 1fr; }
          .bm-slots-grid { grid-template-columns: repeat(3,1fr); gap: 5px; }
          .bm-slot      { font-size: 0.68rem; padding: 7px 2px; }
          .bm-type-grid { gap: 7px; }
          .bm-type-card { padding: 12px 8px; }
        }
      `}</style>
    </Layout>
  );
}
