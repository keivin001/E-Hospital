import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MessageSquare, FileText, Activity, Clock, ArrowRight,
  Search, Zap, AlertCircle, CheckCircle, Video,
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { PRESCRIPTIONS, DOCTORS, SYMPTOM_SUGGESTIONS } from '../data/mockData';

const statusColors = {
  confirmed: 'badge-success',
  pending: 'badge-warning',
  completed: 'badge-gray',
  cancelled: 'badge-danger',
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, appointments, notifications, profile } = useApp();
  const [symptom, setSymptom] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const assignedDoctor = profile?.doctor || null;

  const patientApts = appointments.filter(a => a.patientName === user?.name);
  const upcoming = patientApts.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const activePrescriptions = PRESCRIPTIONS.filter(p => p.status === 'active');
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleSymptomSearch = () => {
    if (!symptom.trim()) return;
    const lower = symptom.toLowerCase();
    const depts = Object.entries(SYMPTOM_SUGGESTIONS)
      .filter(([key]) => lower.includes(key))
      .flatMap(([, v]) => v);
    const uniqueDepts = [...new Set(depts)];
    const suggestedDoctors = DOCTORS.filter(d => uniqueDepts.includes(d.specialty) || d.online).slice(0, 3);
    setSuggestions({ departments: uniqueDepts.length ? uniqueDepts : ['General Medicine'], doctors: suggestedDoctors });
  };

  const stats = [
    { label: 'Upcoming Appointments', value: upcoming.length, icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-light)', action: () => navigate('/appointments') },
    { label: 'Active Prescriptions', value: activePrescriptions.length, icon: FileText, color: 'var(--secondary)', bg: 'var(--success-light)', action: () => navigate('/prescriptions') },
    { label: 'Unread Notifications', value: unreadNotifs, icon: AlertCircle, color: 'var(--accent)', bg: 'var(--warning-light)', action: () => navigate('/notifications') },
    { label: 'Total Consultations', value: patientApts.length, icon: Activity, color: 'var(--purple)', bg: 'var(--purple-light)', action: () => navigate('/appointments') },
  ];

  return (
    <Layout title="Dashboard">
      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, #0369a1 100%)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '60px', bottom: '-40px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>Good morning, {user?.name?.split(' ')[0]} 👋</h2>
              <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                You have <strong>{upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}</strong> and <strong>{activePrescriptions.length} active prescription{activePrescriptions.length !== 1 ? 's' : ''}</strong>.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" onClick={() => navigate('/doctors')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
                <Search size={16} /> Find Doctor
              </button>
              <button className="btn" onClick={() => navigate('/appointments')} style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 700 }}>
                <Calendar size={16} /> Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card card-hover" style={{ cursor: 'pointer' }} onClick={s.action}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', background: s.bg, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={22} color={s.color} />
              </div>
              <ArrowRight size={16} color="var(--gray-300)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

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
        {/* AI Symptom Checker */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--purple-light)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="var(--purple)" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>AI Symptom Assistant</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Describe your symptoms to get suggestions</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <input className="form-input" placeholder="e.g., headache, fever, chest pain..." value={symptom}
              onChange={e => { setSymptom(e.target.value); setSuggestions(null); }}
              onKeyDown={e => e.key === 'Enter' && handleSymptomSearch()} style={{ flex: 1, minWidth: 0 }} />
            <button className="btn btn-primary btn-sm" onClick={handleSymptomSearch} style={{ flexShrink: 0 }}><Search size={14} /></button>
          </div>
          {suggestions ? (
            <div className="animate-fadeIn">
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>Suggested Departments</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {suggestions.departments.map(d => <span key={d} className="badge badge-primary">{d}</span>)}
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>Available Doctors</div>
              {suggestions.doctors.map(doc => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: 'var(--radius)', background: 'var(--gray-50)', marginBottom: '6px', cursor: 'pointer' }}
                  onClick={() => navigate('/doctors')}>
                  <div className="avatar avatar-sm call-effect">{doc.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{doc.specialty}</div>
                  </div>
                  <div className={`status-dot ${doc.online ? 'status-online' : 'status-offline'}`} />
                </div>
              ))}
              <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '8px' }} onClick={() => navigate('/doctors')}>
                View All Doctors <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Headache', 'Fever', 'Chest Pain', 'Skin Rash', 'Joint Pain'].map(s => (
                <button key={s} onClick={() => setSymptom(s)}
                  style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', fontSize: '0.75rem', color: 'var(--gray-600)', cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { icon: Calendar, label: 'Book Appointment', color: 'var(--primary)', bg: 'var(--primary-light)', path: '/appointments' },
              { icon: MessageSquare, label: 'Start Chat', color: 'var(--secondary)', bg: 'var(--success-light)', path: '/chat' },
              { icon: Video, label: 'Video Call', color: 'var(--purple)', bg: 'var(--purple-light)', path: '/video' },
              { icon: FileText, label: 'Prescriptions', color: 'var(--accent)', bg: 'var(--warning-light)', path: '/prescriptions' },
            ].map(action => (
              <button key={action.label} onClick={() => navigate(action.path)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = action.bg; e.currentTarget.style.borderColor = action.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}>
                <div style={{ width: '40px', height: '40px', background: action.bg, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <action.icon size={20} color={action.color} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Upcoming Appointments */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>Upcoming Appointments</h3>
            <button onClick={() => navigate('/appointments')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-400)' }}>
              <Calendar size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No upcoming appointments</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcoming.map(apt => (
                <div key={apt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius)', background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                  <div className="avatar avatar-md">{apt.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.doctorName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{apt.doctorSpecialty}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock size={11} color="var(--gray-400)" />
                      <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{apt.date} · {apt.time}</span>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Prescriptions */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>Active Prescriptions</h3>
            <button onClick={() => navigate('/prescriptions')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          {activePrescriptions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-400)' }}>
              <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No active prescriptions</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activePrescriptions.map(rx => (
                <div key={rx.id} style={{ padding: '14px', borderRadius: 'var(--radius)', background: 'var(--success-light)', border: '1px solid #a7f3d0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-900)' }}>{rx.diagnosis}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{rx.doctorName} · {rx.date}</div>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {rx.medicines.slice(0, 2).map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                        <CheckCircle size={12} color="var(--secondary)" />
                        <span>{m.name} — {m.frequency}</span>
                      </div>
                    ))}
                    {rx.medicines.length > 2 && <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>+{rx.medicines.length - 2} more</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
