import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Phone, Mail, Star, Users, Building2, X, CheckCircle, Clock } from 'lucide-react';
import Layout from '../components/Layout';

export default function Hospitals() {
  const { hospitals } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const filtered = hospitals.filter(h => {
    const q = search.toLowerCase();
    const matchSearch = !q || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'emergency' && h.emergency) || h.type.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Layout title="Hospitals">
      {/* Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--gray-400)" />
          <input placeholder="Search hospitals by name or city..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><X size={14} /></button>}
        </div>
        <div className="tabs">
          {[
            { value: 'all', label: 'All' },
            { value: 'general', label: 'General' },
            { value: 'specialty', label: 'Specialty' },
            { value: 'emergency', label: '🚨 Emergency' },
          ].map(t => (
            <button key={t.value} className={`tab${filter === t.value ? ' active' : ''}`} onClick={() => setFilter(t.value)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '20px' }}>
        Showing <strong style={{ color: 'var(--gray-900)' }}>{filtered.length}</strong> hospital{filtered.length !== 1 ? 's' : ''}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map(h => (
          <div key={h.id} className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => setSelected(h)}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {h.initials}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {h.emergency && <span style={{ background: 'rgba(239,68,68,0.9)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>🚨 24/7</span>}
                  <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>{h.type}</span>
                </div>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '12px', marginBottom: '4px' }}>{h.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.85 }}>
                <MapPin size={13} />
                <span style={{ fontSize: '0.8rem' }}>{h.city}</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Beds', value: h.beds, icon: '🛏️' },
                  { label: 'Doctors', value: h.doctors, icon: '👨‍⚕️' },
                  { label: 'Rating', value: h.rating, icon: '⭐' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '2px' }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>Departments</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {h.departments.slice(0, 3).map(d => <span key={d} className="badge badge-primary">{d}</span>)}
                  {h.departments.length > 3 && <span className="badge badge-gray">+{h.departments.length - 3} more</span>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <Clock size={13} color="var(--secondary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>Avg wait: {h.waitTime}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`tel:${h.phone}`} className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={e => e.stopPropagation()}>
                  <Phone size={14} /> Call
                </a>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); setSelected(h); }}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', padding: '28px', color: 'white', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', position: 'relative' }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 'var(--radius)', padding: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={18} />
              </button>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem' }}>
                  {selected.initials}
                </div>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '4px' }}>{selected.name}</h2>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <MapPin size={14} /><span style={{ fontSize: '0.875rem', opacity: 0.9 }}>{selected.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Beds', value: selected.beds, icon: '🛏️' },
                  { label: 'Doctors', value: selected.doctors, icon: '👨‍⚕️' },
                  { label: 'Rating', value: selected.rating, icon: '⭐' },
                  { label: 'Wait Time', value: selected.waitTime, icon: '⏱️' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>About</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>{selected.about}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Departments</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selected.departments.map(d => <span key={d} className="badge badge-primary">{d}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <Phone size={16} color="var(--primary)" /> {selected.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <Mail size={16} color="var(--primary)" /> {selected.email}
                </div>
                {selected.emergency && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--danger)', fontWeight: 600 }}>
                    <CheckCircle size={16} /> 24/7 Emergency Services Available
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <a href={`tel:${selected.phone}`} className="btn btn-ghost"><Phone size={16} /> Call Hospital</a>
              <button className="btn btn-primary" onClick={() => setSelected(null)}>Book Appointment</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
