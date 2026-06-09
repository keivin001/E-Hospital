import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Clock, Video, MapPin, Filter, X, Calendar, MessageSquare, ChevronDown, PhoneOutgoing } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

export default function Doctors() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ specialty: '', availability: '', type: '', language: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

const { doctors } = useApp();
  const specialties = [...new Set(doctors.map(d => d.specialty))];
  const languages = [...new Set(doctors.flatMap(d => d.languages))];

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q);
    const matchSpec = !filters.specialty || d.specialty === filters.specialty;
    const matchAvail = !filters.availability || (filters.availability === 'available' ? d.available : !d.available);
    const matchType = !filters.type || (filters.type === 'online' ? d.online : !d.online);
    const matchLang = !filters.language || d.languages.includes(filters.language);
    return matchSearch && matchSpec && matchAvail && matchType && matchLang;
  });

  const clearFilters = () => setFilters({ specialty: '', availability: '', type: '', language: '' });
  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <Layout title="Find Doctors">
      {/* Search & Filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--gray-400)" />
          <input
            placeholder="Search by name, specialty, or hospital..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '2px' }}><X size={14} /></button>}
        </div>
        <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)} style={{ position: 'relative' }}>
          <Filter size={16} /> Filters
          {activeFilters > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--primary)', color: 'white', fontSize: '0.65rem', fontWeight: 700, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilters}</span>}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card animate-fadeIn" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Filter Doctors</span>
            {activeFilters > 0 && <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Clear all</button>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Specialty</label>
              <select className="form-select" value={filters.specialty} onChange={e => setFilters({ ...filters, specialty: e.target.value })}>
                <option value="">All Specialties</option>
                {specialties.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Availability</label>
              <select className="form-select" value={filters.availability} onChange={e => setFilters({ ...filters, availability: e.target.value })}>
                <option value="">Any</option>
                <option value="available">Available Now</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Type</label>
              <select className="form-select" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                <option value="">All Types</option>
                <option value="online">Online</option>
                <option value="physical">Physical</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Language</label>
              <select className="form-select" value={filters.language} onChange={e => setFilters({ ...filters, language: e.target.value })}>
                <option value="">All Languages</option>
                {languages.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
          Showing <strong style={{ color: 'var(--gray-900)' }}>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Online', 'Available'].map(f => (
            <button key={f} style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--gray-200)', background: 'white', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, color: 'var(--gray-600)' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {filtered.map(doc => (
          <div key={doc.id} className="card card-hover" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setSelectedDoctor(doc)}>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div className="avatar avatar-lg" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{doc.initials}</div>
                <div className={`status-dot ${doc.online ? 'status-online' : 'status-offline'}`}
                  style={{ position: 'absolute', bottom: '2px', right: '2px', border: '2px solid white' }} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '2px' }}>{doc.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>{doc.specialty}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={12} color="var(--gray-400)" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.hospital}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={14} color="var(--accent)" fill="var(--accent)" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{doc.rating}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{doc.reviews} reviews</div>
              </div>
              <div style={{ width: '1px', background: 'var(--gray-200)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{doc.experience}y</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Experience</div>
              </div>
              <div style={{ width: '1px', background: 'var(--gray-200)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{doc.patients.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Patients</div>
              </div>
              <div style={{ width: '1px', background: 'var(--gray-200)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>${doc.fee}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Per visit</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
              {doc.tags.slice(0, 3).map(tag => (
                <span key={tag} className="badge badge-gray">{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <Clock size={13} color="var(--secondary)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 600 }}>Next: {doc.nextSlot}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }}
                onClick={e => { e.stopPropagation(); navigate('/chat'); }}>
                <MessageSquare size={14} /> Chat
              </button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
                onClick={e => { e.stopPropagation(); navigate('/appointments'); }}>
                <Calendar size={14} /> Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-400)' }}>
          <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3 style={{ fontWeight: 700, color: 'var(--gray-600)', marginBottom: '8px' }}>No doctors found</h3>
          <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters</p>
          <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => { setSearch(''); clearFilters(); }}>
            Clear all filters
          </button>
        </div>
      )}

      {/* Doctor detail modal */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <div className="avatar avatar-xl">{selectedDoctor.initials}</div>
                  <div className={`status-dot ${selectedDoctor.online ? 'status-online' : 'status-offline'}`}
                    style={{ position: 'absolute', bottom: '4px', right: '4px', border: '2px solid white', width: '14px', height: '14px' }} />
                </div>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--gray-900)' }}>{selectedDoctor.name}</h2>
                  <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedDoctor.specialty}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{selectedDoctor.hospital}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDoctor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Rating', value: selectedDoctor.rating, icon: '⭐' },
                  { label: 'Experience', value: `${selectedDoctor.experience}y`, icon: '🏆' },
                  { label: 'Patients', value: selectedDoctor.patients.toLocaleString(), icon: '👥' },
                  { label: 'Fee', value: `$${selectedDoctor.fee}`, icon: '💰' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>About</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>{selectedDoctor.about}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>Education</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{selectedDoctor.education}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>Languages</h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {selectedDoctor.languages.map(l => <span key={l} className="badge badge-primary">{l}</span>)}
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>Specializations</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedDoctor.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => { navigate('/chat'); setSelectedDoctor(null); }}>
                <MessageSquare size={16} /> Chat Now
              </button>
              <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/video/${selectedDoctor.id}`); }} style={{ marginRight: '8px' }}>
                <Video size={16} /> Video Call
              </button>
              <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); navigate('/appointments'); }}>
                <Book size={13} /> Book Appointment
              </button>
              <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); navigate('/call-history'); }}>
                <PhoneOutgoing size={13} /> Call History
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
