import { useNavigate } from 'react-router-dom';
import {
  Calendar, MessageSquare, Clock, ArrowRight, Video, Users, ClipboardList,
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { PRESCRIPTIONS } from '../data/mockData';
import PatientDashboard from './DashboardPatient';

const statusColors = {
  confirmed: 'badge-success',
  pending: 'badge-warning',
  completed: 'badge-gray',
  cancelled: 'badge-danger',
};

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────
function DoctorDashboard({ user }) {
  const navigate = useNavigate();
  const { appointments, conversations } = useApp();
<<<<<<< HEAD
  const doctorApts = appointments.filter(a => a.doctorName === user?.name);
  const todayApts = doctorApts.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedApts = doctorApts.filter(a => a.status === 'completed');
  const unreadChats = conversations.reduce((acc, conv) => acc + (conv.unread || 0), 0);
=======
  
  // Calculate doctor's appointments dynamically
  const doctorApts = appointments.filter(a => a.doctorName.includes(user?.name || ''));
  const todayApts = doctorApts.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedApts = doctorApts.filter(a => a.status === 'completed');
  
  // Calculate unread messages
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
>>>>>>> ccd1a4e (update)

  const doctorStats = [
    { label: "Today's Appointments", value: todayApts.length, icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-light)', path: '/appointments' },
    { label: 'Patients Seen', value: completedApts.length, icon: Users, color: 'var(--secondary)', bg: 'var(--success-light)', path: '/appointments' },
    { label: 'Prescriptions Issued', value: PRESCRIPTIONS.length, icon: ClipboardList, color: 'var(--purple)', bg: 'var(--purple-light)', path: '/prescriptions' },
<<<<<<< HEAD
    { label: 'Unread Messages', value: unreadChats, icon: MessageSquare, color: 'var(--accent)', bg: 'var(--warning-light)', path: '/chat' },
=======
    { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, color: 'var(--accent)', bg: 'var(--warning-light)', path: '/chat' },
>>>>>>> ccd1a4e (update)
  ];

  return (
    <Layout title="Doctor Dashboard">
      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>Good morning, {user?.name?.split(' ')[0]} 👨‍⚕️</h2>
              <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>You have <strong>{todayApts.length} appointment{todayApts.length !== 1 ? 's' : ''}</strong> scheduled today.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" onClick={() => navigate('/chat')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                <MessageSquare size={16} /> Messages
              </button>
              <button className="btn" onClick={() => navigate('/video')} style={{ background: 'white', color: '#047857', fontWeight: 700 }}>
                <Video size={16} /> Start Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {doctorStats.map(s => (
          <div key={s.label} className="stat-card card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate(s.path)}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Today's schedule */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>Today's Schedule</h3>
            <button onClick={() => navigate('/appointments')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todayApts.map(apt => (
              <div key={apt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius)', background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                <div className="avatar avatar-md" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {apt.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)' }}>{apt.patientName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{apt.reason}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Clock size={11} color="var(--gray-400)" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{apt.date} · {apt.time}</span>
                  </div>
                </div>
                <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { icon: Video, label: 'Start Video Call', color: 'var(--primary)', bg: 'var(--primary-light)', path: '/video' },
              { icon: MessageSquare, label: 'Patient Chat', color: 'var(--secondary)', bg: 'var(--success-light)', path: '/chat' },
              { icon: ClipboardList, label: 'Write Prescription', color: 'var(--purple)', bg: 'var(--purple-light)', path: '/prescriptions' },
              { icon: Calendar, label: 'View Schedule', color: 'var(--accent)', bg: 'var(--warning-light)', path: '/appointments' },
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
    </Layout>
  );
}

// ─── Root export — picks the right dashboard by role ─────────────────────────
export default function Dashboard() {
  const { user } = useApp();
  if (user?.role === 'doctor' || user?.role === 'nurse') return <DoctorDashboard user={user} />;
  return <PatientDashboard />;
}
