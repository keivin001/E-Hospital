import { useState } from 'react';
import { FileText, Download, Send, CheckCircle, Clock, Pill, X, ShoppingCart, Package } from 'lucide-react';
import Layout from '../components/Layout';

import { useApp } from '../context/AppContext';

function downloadPrescriptionFile(prescription) {
  const content = [
    `Prescription for: ${prescription.doctorName}`,
    `Date: ${prescription.date}`,
    `Diagnosis: ${prescription.diagnosis}`,
    '',
    'Medications:',
    ...prescription.medicines.map(m => `- ${m.name}: ${m.dosage}, ${m.frequency}, ${m.duration} (${m.instructions})`),
    '',
    `Notes: ${prescription.notes || 'No notes provided.'}`,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${prescription.id}-prescription.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const PHARMACIES = [
  { id: 'ph1', name: 'MediCare Pharmacy', distance: '0.8 km', delivery: '2-3 hours', rating: 4.8 },
  { id: 'ph2', name: 'HealthPlus Drugstore', distance: '1.2 km', delivery: '1-2 hours', rating: 4.6 },
  { id: 'ph3', name: 'QuickMeds Online', distance: 'Online', delivery: 'Same day', rating: 4.9 },
];

export default function Prescriptions() {
  const { addToast, prescriptions } = useApp();
  const [selected, setSelected] = useState(null);
  const [showPharmacy, setShowPharmacy] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleOrder = () => {
    if (!selectedPharmacy) { addToast('Please select a pharmacy', 'error'); return; }
    setOrderPlaced(true);
    addToast('Order placed successfully! Delivery in 2-3 hours.', 'success');
    setTimeout(() => {
      setShowPharmacy(false);
      setOrderPlaced(false);
      setSelectedPharmacy(null);
    }, 2000);
  };

  return (
    <Layout title="Prescriptions">
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Prescriptions list */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>My Prescriptions</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{prescriptions.length} total prescriptions</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {prescriptions.map(rx => (
              <div key={rx.id} className={`card card-hover`} style={{ padding: '20px', cursor: 'pointer', border: selected?.id === rx.id ? '2px solid var(--primary)' : '1px solid var(--gray-200)' }}
                onClick={() => setSelected(rx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '2px' }}>{rx.diagnosis}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{rx.doctorName} · {rx.date}</p>
                  </div>
                  <span className={`badge ${rx.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>
                    {rx.status === 'active' ? '✓ Active' : 'Completed'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                  {rx.medicines.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '0.8rem' }}>
                      <Pill size={14} color="var(--primary)" />
                      <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{m.name}</span>
                      <span style={{ color: 'var(--gray-400)' }}>·</span>
                      <span style={{ color: 'var(--gray-500)' }}>{m.frequency}</span>
                      <span style={{ color: 'var(--gray-400)' }}>·</span>
                      <span style={{ color: 'var(--gray-500)' }}>{m.duration}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); downloadPrescriptionFile(rx); addToast('Prescription downloaded', 'success'); }}>
                    <Download size={13} /> Download
                  </button>
                  {rx.status === 'active' && (
                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); setSelected(rx); setShowPharmacy(true); }}>
                      <ShoppingCart size={13} /> Order Medicine
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription detail */}
        {selected && (
          <div className="animate-fadeIn">
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--gray-900)' }}>Prescription Details</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Rx header */}
              <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', borderRadius: 'var(--radius-lg)', padding: '20px', color: 'white', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Prescription</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selected.diagnosis}</div>
                    <div style={{ opacity: 0.8, fontSize: '0.8rem', marginTop: '4px' }}>{selected.doctorName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Date</div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selected.date}</div>
                  </div>
                </div>
              </div>

              {/* Medicines */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--gray-900)', fontSize: '0.9rem' }}>Medications</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selected.medicines.map((m, i) => (
                    <div key={i} style={{ padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', background: 'var(--primary-light)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Pill size={14} color="var(--primary)" />
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{m.name}</span>
                        </div>
                        <span className="badge badge-primary">{m.dosage}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
                        <div style={{ color: 'var(--gray-500)' }}>
                          <span style={{ fontWeight: 600 }}>Frequency: </span>{m.frequency}
                        </div>
                        <div style={{ color: 'var(--gray-500)' }}>
                          <span style={{ fontWeight: 600 }}>Duration: </span>{m.duration}
                        </div>
                        <div style={{ color: 'var(--gray-500)', gridColumn: '1 / -1' }}>
                          <span style={{ fontWeight: 600 }}>Instructions: </span>{m.instructions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div style={{ padding: '14px', background: 'var(--warning-light)', borderRadius: 'var(--radius-lg)', border: '1px solid #fcd34d', marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#92400e', marginBottom: '4px' }}>📋 Doctor's Notes</div>
                  <p style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.6 }}>{selected.notes}</p>
                </div>
              )}

              {/* Medication reminders */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--gray-900)', fontSize: '0.9rem' }}>Medication Schedule</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((time, i) => (
                    <div key={time} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: i < 2 ? 'var(--success-light)' : 'var(--gray-100)', borderRadius: 'var(--radius)', border: `1px solid ${i < 2 ? '#a7f3d0' : 'var(--gray-200)'}` }}>
                      <div style={{ fontSize: '1rem', marginBottom: '2px' }}>{['🌅', '☀️', '🌆', '🌙'][i]}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: i < 2 ? 'var(--secondary-dark)' : 'var(--gray-400)' }}>{time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => { downloadPrescriptionFile(selected); addToast('Prescription downloaded', 'success'); }}>
                  <Download size={14} /> Download PDF
                </button>
                {selected.status === 'active' && (
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setShowPharmacy(true)}>
                    <ShoppingCart size={14} /> Order Medicine
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pharmacy modal */}
      {showPharmacy && (
        <div className="modal-overlay" onClick={() => setShowPharmacy(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gray-900)' }}>Order Medicine</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>Select a partner pharmacy</p>
              </div>
              <button onClick={() => setShowPharmacy(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {orderPlaced ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{ width: '64px', height: '64px', background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={32} color="var(--secondary)" />
                  </div>
                  <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px' }}>Order Placed!</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Your medicine will be delivered soon.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {PHARMACIES.map(ph => (
                      <button key={ph.id} onClick={() => setSelectedPharmacy(ph)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
                          border: `2px solid ${selectedPharmacy?.id === ph.id ? 'var(--primary)' : 'var(--gray-200)'}`,
                          borderRadius: 'var(--radius-lg)', background: selectedPharmacy?.id === ph.id ? 'var(--primary-light)' : 'white',
                          cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                        }}>
                        <div style={{ width: '44px', height: '44px', background: 'var(--success-light)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} color="var(--secondary)" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{ph.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>
                            📍 {ph.distance} · 🚚 {ph.delivery} · ⭐ {ph.rating}
                          </div>
                        </div>
                        {selectedPharmacy?.id === ph.id && <CheckCircle size={18} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {!orderPlaced && (
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowPharmacy(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleOrder}>
                  <ShoppingCart size={16} /> Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
