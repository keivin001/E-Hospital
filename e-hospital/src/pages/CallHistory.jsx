import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PhoneOutgoing, Calendar, Clock, Video, MessageSquare } from 'lucide-react';

// Mock call history data
const CALLS = [
  { id: 'c1', with: 'Dr. Emily Carter', type: 'video', date: '2024-09-12', time: '14:30', duration: 15 },
  { id: 'c2', with: 'Dr. Michael Lee', type: 'audio', date: '2024-09-10', time: '09:00', duration: 30 },
  { id: 'c3', with: 'Dr. Sarah Patel', type: 'video', date: '2024-09-05', time: '16:45', duration: 20 },
];

export default function CallHistory() {
  const { user } = useApp();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout title="Call History">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {CALLS.map(call => (
          <div key={call.id} className="card" style={{ padding: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              {call.type === 'video' ? <Video size={20} /> : <PhoneOutgoing size={20} />}
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--gray-900)' }}>{call.with}</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              <div><Calendar size={14} /> {call.date}</div>
              <div><Clock size={14} /> {call.time}</div>
              <div><MessageSquare size={14} /> {call.duration} min</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
