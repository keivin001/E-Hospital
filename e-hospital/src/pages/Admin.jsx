import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users, Building2, Calendar, DollarSign, Activity, ShieldCheck,
  CheckCircle, XCircle, ArrowUp, ArrowDown, Heart, Stethoscope,
  Plus, Search, Edit2, Trash2, Eye, X, Save, Phone, Mail,
  MapPin, Star, Settings, AlertTriangle, RefreshCw,
} from 'lucide-react';
import Layout from '../components/Layout';
import { ADMIN_STATS, PENDING_APPROVALS, DOCTORS, HOSPITALS, APPOINTMENTS, PATIENTS } from '../data/mockData';
import { useApp } from '../context/AppContext';

/* ─── Modal Shell ─────────────────────────────── */
function Modal({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal adm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="adm-modal-title">{title}</h2>
            {subtitle && <p className="adm-modal-sub">{subtitle}</p>}
          </div>
          <button className="adm-icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer adm-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Confirm Dialog ──────────────────────────── */
function ConfirmModal({ message, onConfirm, onClose, danger }) {
  return (
    <Modal title="Confirm Action" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => { onConfirm(); onClose(); }}>
          {danger ? <><Trash2 size={14} /> Delete</> : <><CheckCircle size={14} /> Confirm</>}
        </button>
      </>
    }>
      <p className="adm-confirm-msg">{message}</p>
    </Modal>
  );
}

/* ─── View Docs Modal ─────────────────────────── */
function ViewDocsModal({ app, onClose }) {
  return (
    <Modal title="Application Details" subtitle={`Submitted ${app.submitted}`} onClose={onClose}
      footer={<button className="btn btn-ghost" onClick={onClose}>Close</button>}>
      <div className="adm-detail-body">
        <div className="adm-detail-hero">
          <div className={`avatar avatar-lg ${app.role === 'Doctor' ? 'adm-av-doc' : 'adm-av-nurse'}`}>
            {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="adm-detail-name">{app.name}</div>
            <div className="adm-badge-row">
              <span className={`badge ${app.role === 'Doctor' ? 'badge-success' : 'badge-purple'}`}>{app.role}</span>
              <span className="badge badge-primary">{app.specialty}</span>
            </div>
          </div>
        </div>
        {[
          { label: 'Email',      value: app.email,                   Icon: Mail },
          { label: 'Phone',      value: app.phone,                   Icon: Phone },
          { label: 'Hospital',   value: app.hospital,                Icon: Building2 },
          { label: 'License No.',value: app.license,                 Icon: ShieldCheck },
          { label: 'Experience', value: `${app.experience} years`,   Icon: Star },
        ].map(row => (
          <div key={row.label} className="adm-detail-row">
            <row.Icon size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span className="adm-detail-label">{row.label}:</span>
            <span className="adm-detail-val">{row.value}</span>
          </div>
        ))}
        <div className="adm-doc-note">📎 Credential documents uploaded — PDF verified (simulated)</div>
      </div>
    </Modal>
  );
}

/* ─── Doctor Modal ────────────────────────────── */
const SPECIALTIES = ['Cardiology','Neurology','Pediatrics','Orthopedics','Dermatology','General Medicine','Gynecology','ENT','Psychiatry','Oncology'];
const HOSPITAL_NAMES = ['City General Hospital','Sunrise Medical Center',"Children's Health Institute",'NeuroHealth Clinic','BoneJoint Medical Center','SkinCare Specialists'];

function DoctorModal({ doctor, onSave, onClose }) {
  const [form, setForm] = useState(doctor || { name:'', specialty:'', hospital:'', experience:'', fee:'', email:'', phone:'', available:true });
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const valid = form.name && form.specialty && form.hospital && form.fee;
  return (
    <Modal title={doctor ? 'Edit Doctor' : 'Add New Doctor'} subtitle="Fill in the doctor's details" onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} onClick={() => { onSave(form); onClose(); }}>
            <Save size={14} /> {doctor ? 'Save Changes' : 'Add Doctor'}
          </button>
        </>
      }>
      <div className="adm-form-grid">
        <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Dr. John Doe" value={form.name} onChange={e => u('name', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Specialty *</label><select className="form-select" value={form.specialty} onChange={e => u('specialty', e.target.value)}><option value="">Select specialty</option>{SPECIALTIES.map(s => <option key={s}>{s}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Hospital *</label><select className="form-select" value={form.hospital} onChange={e => u('hospital', e.target.value)}><option value="">Select hospital</option>{HOSPITAL_NAMES.map(h => <option key={h}>{h}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Consultation Fee ($) *</label><input className="form-input" type="number" placeholder="80" value={form.fee} onChange={e => u('fee', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Experience (years)</label><input className="form-input" type="number" placeholder="5" value={form.experience} onChange={e => u('experience', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.available ? 'active' : 'inactive'} onChange={e => u('available', e.target.value === 'active')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="doctor@email.com" value={form.email || ''} onChange={e => u('email', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone || ''} onChange={e => u('phone', e.target.value)} /></div>
      </div>
    </Modal>
  );
}

/* ─── Hospital Modal ──────────────────────────── */
function HospitalModal({ hospital, onSave, onClose }) {
  const [form, setForm] = useState(hospital || { name:'', city:'', type:'General', beds:'', doctors:'', phone:'', email:'', address:'', emergency:false });
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const valid = form.name && form.city && form.beds;
  return (
    <Modal title={hospital ? 'Edit Hospital' : 'Add New Hospital'} subtitle="Fill in the hospital details" onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} onClick={() => { onSave(form); onClose(); }}>
            <Save size={14} /> {hospital ? 'Save Changes' : 'Add Hospital'}
          </button>
        </>
      }>
      <div className="adm-form-grid">
        <div className="form-group adm-col-full"><label className="form-label">Hospital Name *</label><input className="form-input" placeholder="City General Hospital" value={form.name} onChange={e => u('name', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">City *</label><input className="form-input" placeholder="New York" value={form.city} onChange={e => u('city', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e => u('type', e.target.value)}><option>General</option><option>Specialty</option><option>Multi-Specialty</option><option>Clinic</option></select></div>
        <div className="form-group"><label className="form-label">Total Beds *</label><input className="form-input" type="number" placeholder="200" value={form.beds} onChange={e => u('beds', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Doctors Count</label><input className="form-input" type="number" placeholder="50" value={form.doctors} onChange={e => u('doctors', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+1 (212) 555-0100" value={form.phone} onChange={e => u('phone', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="info@hospital.com" value={form.email} onChange={e => u('email', e.target.value)} /></div>
        <div className="form-group adm-col-full"><label className="form-label">Address</label><input className="form-input" placeholder="123 Medical Ave, New York, NY" value={form.address} onChange={e => u('address', e.target.value)} /></div>
        <label className="adm-toggle-label adm-col-full">
          <input type="checkbox" checked={form.emergency} onChange={e => u('emergency', e.target.checked)} />
          24/7 Emergency Services Available
        </label>
      </div>
    </Modal>
  );
}

/* ─── Patient View Modal ──────────────────────── */
function PatientModal({ patient, onClose }) {
  return (
    <Modal title="Patient Details" subtitle={`Member since ${patient.joined}`} onClose={onClose}
      footer={<button className="btn btn-ghost" onClick={onClose}>Close</button>}>
      <div className="adm-detail-body">
        <div className="adm-detail-hero">
          <div className="avatar avatar-lg adm-av-patient">{patient.initials}</div>
          <div>
            <div className="adm-detail-name">{patient.name}</div>
            <div className="adm-detail-meta">{patient.gender} · {patient.bloodGroup} · DOB: {patient.dob}</div>
            <span className={`badge ${patient.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{patient.status}</span>
          </div>
        </div>
        {[
          { label: 'Email',        value: patient.email,                    Icon: Mail },
          { label: 'Phone',        value: patient.phone,                    Icon: Phone },
          { label: 'Appointments', value: `${patient.appointments} total`,  Icon: Calendar },
          { label: 'Conditions',   value: patient.conditions || 'None',     Icon: Heart },
        ].map(row => (
          <div key={row.label} className="adm-detail-row">
            <row.Icon size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span className="adm-detail-label">{row.label}:</span>
            <span className="adm-detail-val">{row.value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ─── Main Admin Component ────────────────────── */
export default function Admin() {
  const { addToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const pathToTab = {
    '/admin': 'overview', '/admin/doctors': 'doctors', '/admin/hospitals': 'hospitals',
    '/admin/patients': 'patients', '/admin/approvals': 'approvals',
    '/admin/analytics': 'analytics', '/admin/settings': 'settings',
  };
  const activeTab = pathToTab[location.pathname] || 'overview';

  const [approvals, setApprovals] = useState(PENDING_APPROVALS);
  const [viewDocsApp, setViewDocsApp] = useState(null);
  const [confirmApprove, setConfirmApprove] = useState(null);
  const [confirmReject, setConfirmReject] = useState(null);

  const [doctors, setDoctors] = useState(DOCTORS);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorModal, setDoctorModal] = useState(null);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState(null);

  const [hospitals, setHospitals] = useState(HOSPITALS);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitalModal, setHospitalModal] = useState(null);
  const [confirmDeleteHosp, setConfirmDeleteHosp] = useState(null);

  const [patients, setPatients] = useState(PATIENTS);
  const [patientSearch, setPatientSearch] = useState('');
  const [viewPatient, setViewPatient] = useState(null);
  const [confirmDeletePatient, setConfirmDeletePatient] = useState(null);

  const [settings, setSettings] = useState({
    siteName: 'E-Hospital', supportEmail: 'support@ehospital.com',
    maxAppointments: 20, autoApprove: false, maintenanceMode: false, emailNotifications: true,
  });

  /* Handlers */
  const doApprove = id => { setApprovals(p => p.filter(a => a.id !== id)); addToast('Professional approved!', 'success'); };
  const doReject  = id => { setApprovals(p => p.filter(a => a.id !== id)); addToast('Application rejected', 'warning'); };

  const saveDoctor = form => {
    if (form.id) { setDoctors(p => p.map(d => d.id === form.id ? { ...d, ...form } : d)); addToast('Doctor updated', 'success'); }
    else { setDoctors(p => [{ ...form, id: `d${Date.now()}`, initials: form.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(), rating: 4.5, reviews: 0, patients: 0, online: false, languages: ['English'], tags: [], about: '', education: '', nextSlot: 'TBD', fee: Number(form.fee), experience: Number(form.experience) }, ...p]); addToast('Doctor added', 'success'); }
  };
  const deleteDoctor = id => { setDoctors(p => p.filter(d => d.id !== id)); addToast('Doctor removed', 'warning'); };

  const saveHospital = form => {
    if (form.id) { setHospitals(p => p.map(h => h.id === form.id ? { ...h, ...form } : h)); addToast('Hospital updated', 'success'); }
    else { setHospitals(p => [{ ...form, id: `h${Date.now()}`, initials: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(), rating: 4.5, departments: [], waitTime: 'N/A', about: '', beds: Number(form.beds), doctors: Number(form.doctors) }, ...p]); addToast('Hospital added', 'success'); }
  };
  const deleteHospital = id => { setHospitals(p => p.filter(h => h.id !== id)); addToast('Hospital removed', 'warning'); };

  const deletePatient = id => { setPatients(p => p.filter(pt => pt.id !== id)); addToast('Patient removed', 'warning'); };
  const togglePatientStatus = id => { setPatients(p => p.map(pt => pt.id === id ? { ...pt, status: pt.status === 'active' ? 'inactive' : 'active' } : pt)); addToast('Status updated', 'success'); };

  const filteredDoctors   = doctors.filter(d => !doctorSearch   || d.name.toLowerCase().includes(doctorSearch.toLowerCase())   || d.specialty.toLowerCase().includes(doctorSearch.toLowerCase()));
  const filteredHospitals = hospitals.filter(h => !hospitalSearch || h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || h.city.toLowerCase().includes(hospitalSearch.toLowerCase()));
  const filteredPatients  = patients.filter(p => !patientSearch  || p.name.toLowerCase().includes(patientSearch.toLowerCase())  || p.email.toLowerCase().includes(patientSearch.toLowerCase()));

  const weeklyData = [
    { day: 'Mon', apts: 42, rev: 3200 }, { day: 'Tue', apts: 58, rev: 4100 },
    { day: 'Wed', apts: 51, rev: 3800 }, { day: 'Thu', apts: 67, rev: 5200 },
    { day: 'Fri', apts: 73, rev: 5800 }, { day: 'Sat', apts: 38, rev: 2900 },
    { day: 'Sun', apts: 13, rev: 1100 },
  ];
  const maxApts = Math.max(...weeklyData.map(d => d.apts));
  const deptData = [
    { name: 'General Medicine', pct: 32, color: 'var(--primary)' },
    { name: 'Cardiology',       pct: 18, color: 'var(--danger)' },
    { name: 'Pediatrics',       pct: 15, color: 'var(--secondary)' },
    { name: 'Neurology',        pct: 12, color: 'var(--purple)' },
    { name: 'Dermatology',      pct: 10, color: 'var(--accent)' },
    { name: 'Others',           pct: 13, color: 'var(--gray-400)' },
  ];

  const statCards = [
    { label: 'Total Patients',     value: ADMIN_STATS.totalPatients.toLocaleString(), icon: Heart,       color: 'var(--primary)',   bg: 'var(--primary-light)',  trend: '+12%', up: true },
    { label: 'Active Doctors',     value: doctors.filter(d => d.available).length,    icon: Stethoscope, color: 'var(--secondary)', bg: 'var(--success-light)',  trend: '+5%',  up: true },
    { label: 'Partner Hospitals',  value: hospitals.length,                            icon: Building2,   color: 'var(--accent)',    bg: 'var(--warning-light)',  trend: '+2',   up: true },
    { label: 'Appointments Today', value: ADMIN_STATS.appointmentsToday,              icon: Calendar,    color: 'var(--primary)',   bg: 'var(--primary-light)',  trend: '+18%', up: true },
    { label: 'Pending Approvals',  value: approvals.length,                            icon: ShieldCheck, color: 'var(--danger)',    bg: 'var(--danger-light)',   trend: `${approvals.length} pending`, up: false },
    { label: 'Monthly Revenue',    value: `$${(ADMIN_STATS.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'var(--secondary)', bg: 'var(--success-light)', trend: '+22%', up: true },
    { label: 'Consultations',      value: ADMIN_STATS.consultationsThisMonth.toLocaleString(), icon: Activity, color: 'var(--purple)', bg: 'var(--purple-light)', trend: '+15%', up: true },
    { label: 'Nurses',             value: ADMIN_STATS.totalNurses,                     icon: Users,       color: 'var(--purple)',    bg: 'var(--purple-light)',   trend: '+8%',  up: true },
  ];

  const TABS = [
    { value: 'overview',  label: 'Overview',   emoji: '📊', path: '/admin' },
    { value: 'approvals', label: `Approvals${approvals.length ? ` (${approvals.length})` : ''}`, emoji: '✅', path: '/admin/approvals' },
    { value: 'doctors',   label: 'Doctors',    emoji: '👨‍⚕️', path: '/admin/doctors' },
    { value: 'hospitals', label: 'Hospitals',  emoji: '🏥', path: '/admin/hospitals' },
    { value: 'patients',  label: 'Patients',   emoji: '🧑',  path: '/admin/patients' },
    { value: 'analytics', label: 'Analytics',  emoji: '📈', path: '/admin/analytics' },
    { value: 'settings',  label: 'Settings',   emoji: '⚙️', path: '/admin/settings' },
  ];

  const Toggle = ({ checked, onChange, danger }) => (
    <button type="button" onClick={onChange} className="adm-toggle"
      style={{ background: checked ? (danger ? 'var(--danger)' : 'var(--secondary)') : 'var(--gray-300)' }}>
      <span className="adm-toggle-thumb" style={{ left: checked ? '23px' : '3px' }} />
    </button>
  );

  return (
    <Layout title="Admin Dashboard">
      {/* Tab Bar */}
      <div className="adm-tab-bar">
        {TABS.map(t => (
          <button key={t.value} onClick={() => navigate(t.path)}
            className={`adm-tab${activeTab === t.value ? ' adm-tab-active' : ''}`}>
            <span className="adm-tab-emoji">{t.emoji}</span>
            <span className="adm-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="animate-fadeIn">
          <div className="adm-stat-grid">
            {statCards.map(s => (
              <div key={s.label} className="adm-stat-card card-hover">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
                  <span className={`adm-stat-trend ${s.up ? 'adm-trend-up' : 'adm-trend-dn'}`}>
                    {s.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{s.trend}
                  </span>
                </div>
                <div className="adm-stat-val">{s.value}</div>
                <div className="adm-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="adm-charts-row">
            <div className="card adm-chart-card">
              <div className="adm-chart-head">
                <div><h3 className="adm-card-title">Weekly Appointments</h3><p className="adm-card-sub">This week's overview</p></div>
                <span className="badge badge-success">+18% vs last week</span>
              </div>
              <div className="adm-bar-chart">
                {weeklyData.map(d => (
                  <div key={d.day} className="adm-bar-col">
                    <span className="adm-bar-val">{d.apts}</span>
                    <div className="adm-bar" style={{ height: `${(d.apts / maxApts) * 110}px` }} />
                    <span className="adm-bar-day">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card adm-dept-card">
              <h3 className="adm-card-title" style={{ marginBottom: '16px' }}>By Department</h3>
              <div className="adm-dept-list">
                {deptData.map(d => (
                  <div key={d.name}>
                    <div className="adm-dept-row">
                      <span className="adm-dept-name">{d.name}</span>
                      <span className="adm-dept-pct">{d.pct}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${d.pct}%`, background: d.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 className="adm-card-title" style={{ marginBottom: '16px' }}>Recent Appointments</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Patient</th><th>Doctor</th><th>Specialty</th><th>Date</th><th>Type</th><th>Status</th><th>Fee</th></tr></thead>
                <tbody>
                  {APPOINTMENTS.map(apt => (
                    <tr key={apt.id}>
                      <td className="adm-td-bold">{apt.patientName}</td>
                      <td>{apt.doctorName}</td>
                      <td><span className="badge badge-primary">{apt.doctorSpecialty}</span></td>
                      <td className="adm-td-muted">{apt.date}</td>
                      <td><span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>{apt.type}</span></td>
                      <td><span className={`badge ${apt.status === 'confirmed' ? 'badge-success' : apt.status === 'pending' ? 'badge-warning' : apt.status === 'cancelled' ? 'badge-danger' : 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>{apt.status}</span></td>
                      <td className="adm-td-fee">${apt.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVALS ── */}
      {activeTab === 'approvals' && (
        <div className="animate-fadeIn">
          <div className="adm-section-head">
            <h3 className="adm-section-title">Pending Approvals</h3>
            <p className="adm-section-sub">Review and approve doctor/nurse registrations</p>
          </div>
          {approvals.length === 0 ? (
            <div className="adm-empty">
              <CheckCircle size={48} style={{ opacity: 0.25, marginBottom: '14px' }} />
              <h3>All caught up!</h3>
              <p>No pending approvals at this time.</p>
            </div>
          ) : (
            <div className="adm-approval-list">
              {approvals.map(app => (
                <div key={app.id} className="card adm-approval-card">
                  <div className="adm-approval-inner">
                    <div className={`avatar avatar-lg ${app.role === 'Doctor' ? 'adm-av-doc' : 'adm-av-nurse'}`}>
                      {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="adm-approval-info">
                      <div className="adm-approval-toprow">
                        <div>
                          <h3 className="adm-approval-name">{app.name}</h3>
                          <div className="adm-badge-row">
                            <span className={`badge ${app.role === 'Doctor' ? 'badge-success' : 'badge-purple'}`}>{app.role}</span>
                            <span className="badge badge-primary">{app.specialty}</span>
                          </div>
                        </div>
                        <span className="badge badge-warning">⏳ Pending</span>
                      </div>
                      <div className="adm-approval-meta">
                        <span>🏥 {app.hospital}</span>
                        <span>📅 {app.submitted}</span>
                        <span>📧 {app.email}</span>
                      </div>
                    </div>
                    <div className="adm-approval-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewDocsApp(app)}><Eye size={13} /> View Docs</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmReject(app)}><XCircle size={13} /> Reject</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setConfirmApprove(app)}><CheckCircle size={13} /> Approve</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DOCTORS ── */}
      {activeTab === 'doctors' && (
        <div className="animate-fadeIn">
          <div className="adm-list-head">
            <div><h3 className="adm-section-title">Registered Doctors</h3><p className="adm-section-sub">{filteredDoctors.length} of {doctors.length} doctors</p></div>
            <div className="adm-list-controls">
              <div className="search-bar adm-search"><Search size={14} color="var(--gray-400)" /><input placeholder="Search doctors..." value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} /></div>
              <button className="btn btn-primary btn-sm" onClick={() => setDoctorModal('add')}><Plus size={14} /> Add Doctor</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Doctor</th><th>Specialty</th><th>Hospital</th><th>Rating</th><th>Patients</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredDoctors.map(doc => (
                  <tr key={doc.id}>
                    <td><div className="adm-person-cell"><div className="avatar avatar-sm">{doc.initials}</div><div><div className="adm-td-bold" style={{ fontSize: '0.875rem' }}>{doc.name}</div><div className="adm-td-tiny">{doc.experience}y exp</div></div></div></td>
                    <td><span className="badge badge-primary">{doc.specialty}</span></td>
                    <td className="adm-td-hospital">{doc.hospital}</td>
                    <td><div className="adm-rating"><Star size={12} fill="var(--accent)" color="var(--accent)" /><span>{doc.rating}</span></div></td>
                    <td className="adm-td-bold">{doc.patients.toLocaleString()}</td>
                    <td className="adm-td-fee">${doc.fee}</td>
                    <td><span className={`badge ${doc.available ? 'badge-success' : 'badge-gray'}`}>{doc.available ? 'Active' : 'Inactive'}</span></td>
                    <td><div className="adm-row-actions"><button className="btn btn-ghost btn-sm" onClick={() => setDoctorModal(doc)}><Edit2 size={12} /> Edit</button><button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteDoc(doc)}><Trash2 size={12} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDoctors.length === 0 && <div className="adm-empty"><Users size={40} style={{ opacity: 0.25, marginBottom: '12px' }} /><p>No doctors found</p></div>}
        </div>
      )}

      {/* ── HOSPITALS ── */}
      {activeTab === 'hospitals' && (
        <div className="animate-fadeIn">
          <div className="adm-list-head">
            <div><h3 className="adm-section-title">Partner Hospitals</h3><p className="adm-section-sub">{filteredHospitals.length} hospitals</p></div>
            <div className="adm-list-controls">
              <div className="search-bar adm-search"><Search size={14} color="var(--gray-400)" /><input placeholder="Search hospitals..." value={hospitalSearch} onChange={e => setHospitalSearch(e.target.value)} /></div>
              <button className="btn btn-primary btn-sm" onClick={() => setHospitalModal('add')}><Plus size={14} /> Add Hospital</button>
            </div>
          </div>
          <div className="adm-hosp-grid">
            {filteredHospitals.map(h => (
              <div key={h.id} className="card adm-hosp-card">
                <div className="adm-hosp-top">
                  <div className="adm-hosp-icon">{h.initials}</div>
                  <div className="adm-hosp-info"><div className="adm-hosp-name">{h.name}</div><div className="adm-hosp-meta"><MapPin size={11} />{h.city} · {h.type}</div></div>
                  {h.emergency && <span className="adm-emergency-badge">🚨 24/7</span>}
                </div>
                <div className="adm-hosp-stats">
                  {[{ label: 'Beds', value: h.beds }, { label: 'Doctors', value: h.doctors }, { label: 'Rating', value: h.rating }].map(s => (
                    <div key={s.label} className="adm-hosp-stat"><div className="adm-hosp-stat-val">{s.value}</div><div className="adm-hosp-stat-lbl">{s.label}</div></div>
                  ))}
                </div>
                {h.departments && h.departments.length > 0 && (
                  <div className="adm-hosp-depts">
                    {h.departments.slice(0, 3).map(d => <span key={d} className="badge badge-primary adm-dept-badge">{d}</span>)}
                    {h.departments.length > 3 && <span className="badge badge-gray adm-dept-badge">+{h.departments.length - 3}</span>}
                  </div>
                )}
                <div className="adm-hosp-actions">
                  <button className="btn btn-ghost btn-sm adm-btn-flex" onClick={() => setHospitalModal(h)}><Edit2 size={12} /> Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteHosp(h)}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
          {filteredHospitals.length === 0 && <div className="adm-empty"><Building2 size={40} style={{ opacity: 0.25, marginBottom: '12px' }} /><p>No hospitals found</p></div>}
        </div>
      )}

      {/* ── PATIENTS ── */}
      {activeTab === 'patients' && (
        <div className="animate-fadeIn">
          <div className="adm-list-head">
            <div><h3 className="adm-section-title">Registered Patients</h3><p className="adm-section-sub">{filteredPatients.length} patients</p></div>
            <div className="search-bar adm-search"><Search size={14} color="var(--gray-400)" /><input placeholder="Search patients..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} /></div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Patient</th><th>Contact</th><th>Blood</th><th>Apts</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredPatients.map(pt => (
                  <tr key={pt.id}>
                    <td><div className="adm-person-cell"><div className="avatar avatar-sm adm-av-patient">{pt.initials}</div><div><div className="adm-td-bold" style={{ fontSize: '0.875rem' }}>{pt.name}</div><div className="adm-td-tiny">{pt.gender} · {pt.dob}</div></div></div></td>
                    <td><div style={{ fontSize: '0.8rem' }}>{pt.email}</div><div className="adm-td-tiny">{pt.phone}</div></td>
                    <td><span className="badge badge-danger">{pt.bloodGroup}</span></td>
                    <td className="adm-td-bold" style={{ textAlign: 'center' }}>{pt.appointments}</td>
                    <td className="adm-td-muted">{pt.joined}</td>
                    <td><span className={`badge ${pt.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>{pt.status}</span></td>
                    <td><div className="adm-row-actions"><button className="btn btn-ghost btn-sm" onClick={() => setViewPatient(pt)}><Eye size={12} /></button><button className="btn btn-ghost btn-sm" onClick={() => togglePatientStatus(pt.id)} title="Toggle status"><RefreshCw size={12} /></button><button className="btn btn-danger btn-sm" onClick={() => setConfirmDeletePatient(pt)}><Trash2 size={12} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPatients.length === 0 && <div className="adm-empty"><Heart size={40} style={{ opacity: 0.25, marginBottom: '12px' }} /><p>No patients found</p></div>}
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {activeTab === 'analytics' && (
        <div className="animate-fadeIn">
          <div className="adm-stat-grid adm-stat-grid-4">
            {[
              { label: 'Total Revenue',  value: `$${(ADMIN_STATS.revenue/1000).toFixed(1)}K`, sub: 'This month',     color: 'var(--secondary)', bg: 'var(--success-light)', icon: DollarSign },
              { label: 'Consultations',  value: ADMIN_STATS.consultationsThisMonth.toLocaleString(), sub: 'This month', color: 'var(--primary)',   bg: 'var(--primary-light)', icon: Activity },
              { label: 'Avg. Rating',    value: '4.8 ★', sub: 'Platform-wide',   color: 'var(--accent)',    bg: 'var(--warning-light)', icon: Star },
              { label: 'Satisfaction',   value: '96%',   sub: 'Patient feedback', color: 'var(--purple)',    bg: 'var(--purple-light)',  icon: Heart },
            ].map(s => (
              <div key={s.label} className="adm-stat-card">
                <div className="adm-stat-icon" style={{ background: s.bg, marginBottom: '12px' }}><s.icon size={20} color={s.color} /></div>
                <div className="adm-stat-val">{s.value}</div>
                <div className="adm-stat-label">{s.label}</div>
                <div className="adm-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="adm-charts-row" style={{ marginBottom: '24px' }}>
            <div className="card adm-chart-card">
              <h3 className="adm-card-title">Revenue This Week</h3>
              <p className="adm-card-sub" style={{ marginBottom: '20px' }}>Daily revenue breakdown</p>
              <div className="adm-bar-chart">
                {weeklyData.map(d => (
                  <div key={d.day} className="adm-bar-col">
                    <span className="adm-bar-val" style={{ fontSize: '0.62rem' }}>${(d.rev/1000).toFixed(1)}k</span>
                    <div className="adm-bar adm-bar-green" style={{ height: `${(d.rev/5800)*110}px` }} />
                    <span className="adm-bar-day">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card adm-dept-card">
              <h3 className="adm-card-title" style={{ marginBottom: '16px' }}>Consultation Types</h3>
              {[{ label: 'Online Consultations', pct: 68, color: 'var(--primary)' }, { label: 'Physical Visits', pct: 32, color: 'var(--secondary)' }].map(d => (
                <div key={d.label} style={{ marginBottom: '16px' }}>
                  <div className="adm-dept-row"><span className="adm-dept-name" style={{ fontSize: '0.875rem' }}>{d.label}</span><span className="adm-dept-pct" style={{ fontSize: '0.875rem' }}>{d.pct}%</span></div>
                  <div className="progress-bar" style={{ height: '10px' }}><div className="progress-fill" style={{ width: `${d.pct}%`, background: d.color }} /></div>
                </div>
              ))}
              <div className="adm-mini-stats">
                {[{ label:'New Patients', value:'1,240', trend:'+8%' }, { label:'Returning', value:'3,580', trend:'+12%' }, { label:'Avg. Session', value:'24 min', trend:'+2min' }, { label:'Cancellations', value:'3.2%', trend:'-0.5%' }].map(s => (
                  <div key={s.label} className="adm-mini-stat"><div className="adm-mini-val">{s.value}</div><div className="adm-mini-lbl">{s.label}</div><div className="adm-mini-trend">{s.trend}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 className="adm-card-title" style={{ marginBottom: '16px' }}>Top Performing Doctors</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Doctor</th><th>Specialty</th><th>Consultations</th><th>Rating</th><th>Revenue</th><th>Satisfaction</th></tr></thead>
                <tbody>
                  {doctors.slice(0, 5).map(doc => (
                    <tr key={doc.id}>
                      <td><div className="adm-person-cell"><div className="avatar avatar-sm">{doc.initials}</div><span className="adm-td-bold" style={{ fontSize: '0.875rem' }}>{doc.name}</span></div></td>
                      <td><span className="badge badge-primary">{doc.specialty}</span></td>
                      <td className="adm-td-bold">{(doc.patients / 10).toFixed(0)}</td>
                      <td><Star size={12} fill="var(--accent)" color="var(--accent)" /> {doc.rating}</td>
                      <td className="adm-td-fee">${((doc.patients * doc.fee) / 1000).toFixed(1)}K</td>
                      <td><div className="progress-bar" style={{ width: '80px' }}><div className="progress-fill" style={{ width: `${doc.rating * 20}%` }} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS ── */}
      {activeTab === 'settings' && (
        <div className="animate-fadeIn adm-settings">
          <h3 className="adm-section-title" style={{ marginBottom: '20px' }}>Platform Settings</h3>
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h4 className="adm-settings-section-title"><Settings size={15} color="var(--primary)" /> General</h4>
            <div className="adm-settings-fields">
              <div className="form-group"><label className="form-label">Platform Name</label><input className="form-input" value={settings.siteName} onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Support Email</label><input className="form-input" type="email" value={settings.supportEmail} onChange={e => setSettings(p => ({ ...p, supportEmail: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Max Appointments Per Doctor / Day</label><input className="form-input" type="number" value={settings.maxAppointments} onChange={e => setSettings(p => ({ ...p, maxAppointments: Number(e.target.value) }))} /></div>
            </div>
          </div>
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h4 className="adm-settings-section-title"><ShieldCheck size={15} color="var(--primary)" /> Access & Approvals</h4>
            <div className="adm-toggle-list">
              {[
                { key: 'autoApprove',        label: 'Auto-approve doctor registrations', desc: 'Skip manual review for new doctor sign-ups', danger: true },
                { key: 'emailNotifications', label: 'Email notifications',               desc: 'Send email alerts for appointments and approvals' },
                { key: 'maintenanceMode',    label: 'Maintenance mode',                  desc: 'Temporarily disable patient access', danger: true },
              ].map(item => (
                <div key={item.key} className={`adm-toggle-row${item.danger && settings[item.key] ? ' adm-toggle-danger' : ''}`}>
                  <div><div className="adm-toggle-row-title">{item.label}</div><div className="adm-toggle-row-desc">{item.desc}</div></div>
                  <Toggle checked={settings[item.key]} onChange={() => setSettings(p => ({ ...p, [item.key]: !p[item.key] }))} danger={item.danger} />
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h4 className="adm-settings-section-title"><AlertTriangle size={15} color="var(--danger)" /> Danger Zone</h4>
            <div className="adm-danger-list">
              {[
                { label: 'Clear All Appointments', desc: 'Permanently delete all appointment records', btn: 'Clear',  type: 'danger' },
                { label: 'Reset Platform Data',    desc: 'Reset all data to factory defaults',        btn: 'Reset',  type: 'danger' },
                { label: 'Export All Data',        desc: 'Download a full backup of platform data',   btn: 'Export', type: 'outline' },
              ].map(item => (
                <div key={item.label} className="adm-danger-row">
                  <div><div className="adm-toggle-row-title">{item.label}</div><div className="adm-toggle-row-desc">{item.desc}</div></div>
                  <button className={`btn btn-sm ${item.type === 'outline' ? 'btn-outline' : 'btn-danger'}`}
                    onClick={() => addToast(`${item.label} — simulated`, item.type === 'outline' ? 'success' : 'warning')}>{item.btn}</button>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => addToast('Settings saved successfully!', 'success')}><Save size={15} /> Save All Settings</button>
        </div>
      )}

      {/* Modals */}
      {viewDocsApp        && <ViewDocsModal app={viewDocsApp} onClose={() => setViewDocsApp(null)} />}
      {confirmApprove     && <ConfirmModal message={`Approve ${confirmApprove.name} as a ${confirmApprove.role}?`} onConfirm={() => doApprove(confirmApprove.id)} onClose={() => setConfirmApprove(null)} />}
      {confirmReject      && <ConfirmModal message={`Reject ${confirmReject.name}'s application?`} onConfirm={() => doReject(confirmReject.id)} onClose={() => setConfirmReject(null)} danger />}
      {doctorModal        && <DoctorModal doctor={doctorModal === 'add' ? null : doctorModal} onSave={saveDoctor} onClose={() => setDoctorModal(null)} />}
      {confirmDeleteDoc   && <ConfirmModal message={`Remove ${confirmDeleteDoc.name}?`} onConfirm={() => deleteDoctor(confirmDeleteDoc.id)} onClose={() => setConfirmDeleteDoc(null)} danger />}
      {hospitalModal      && <HospitalModal hospital={hospitalModal === 'add' ? null : hospitalModal} onSave={saveHospital} onClose={() => setHospitalModal(null)} />}
      {confirmDeleteHosp  && <ConfirmModal message={`Remove ${confirmDeleteHosp.name}?`} onConfirm={() => deleteHospital(confirmDeleteHosp.id)} onClose={() => setConfirmDeleteHosp(null)} danger />}
      {viewPatient        && <PatientModal patient={viewPatient} onClose={() => setViewPatient(null)} />}
      {confirmDeletePatient && <ConfirmModal message={`Remove patient ${confirmDeletePatient.name}?`} onConfirm={() => deletePatient(confirmDeletePatient.id)} onClose={() => setConfirmDeletePatient(null)} danger />}

      <style>{`
        .adm-tab-bar { display:flex; gap:4px; flex-wrap:wrap; background:var(--gray-100); padding:5px; border-radius:var(--radius); margin-bottom:24px; width:100%; }
        .adm-tab { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:var(--radius-sm); font-size:0.83rem; font-weight:600; border:none; cursor:pointer; transition:all 0.18s; background:none; color:var(--gray-500); white-space:nowrap; }
        .adm-tab:hover { color:var(--gray-800); background:rgba(255,255,255,0.6); }
        .adm-tab-active { background:white; color:var(--gray-900); box-shadow:var(--shadow-sm); }
        .adm-tab-emoji { font-size:0.9rem; }
        .adm-stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:14px; margin-bottom:28px; }
        .adm-stat-grid-4 { grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); }
        .adm-stat-card { background:white; border-radius:var(--radius-lg); padding:20px; border:1px solid var(--gray-200); box-shadow:var(--shadow-sm); }
        .adm-stat-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
        .adm-stat-icon { width:42px; height:42px; border-radius:var(--radius); display:flex; align-items:center; justify-content:center; }
        .adm-stat-trend { display:flex; align-items:center; gap:2px; font-size:0.72rem; font-weight:700; }
        .adm-trend-up { color:var(--secondary); }
        .adm-trend-dn { color:var(--danger); }
        .adm-stat-val { font-size:1.75rem; font-weight:800; color:var(--gray-900); line-height:1; }
        .adm-stat-label { font-size:0.78rem; color:var(--gray-500); margin-top:4px; font-weight:500; }
        .adm-stat-sub { font-size:0.7rem; color:var(--gray-400); margin-top:2px; }
        .adm-charts-row { display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-bottom:24px; }
        .adm-chart-card,.adm-dept-card { padding:24px; }
        .adm-chart-head { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
        .adm-card-title { font-size:1rem; font-weight:700; color:var(--gray-900); margin:0; }
        .adm-card-sub { font-size:0.78rem; color:var(--gray-400); margin-top:3px; }
        .adm-bar-chart { display:flex; align-items:flex-end; gap:8px; height:150px; padding-top:20px; }
        .adm-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; height:100%; justify-content:flex-end; }
        .adm-bar-val { font-size:0.68rem; font-weight:700; color:var(--gray-600); }
        .adm-bar { width:100%; min-height:4px; border-radius:5px 5px 0 0; background:linear-gradient(180deg,var(--primary) 0%,var(--primary-dark) 100%); transition:height 0.5s ease; }
        .adm-bar-green { background:linear-gradient(180deg,var(--secondary) 0%,var(--secondary-dark) 100%); }
        .adm-bar-day { font-size:0.68rem; color:var(--gray-400); font-weight:600; }
        .adm-dept-list { display:flex; flex-direction:column; gap:10px; }
        .adm-dept-row { display:flex; justify-content:space-between; margin-bottom:4px; }
        .adm-dept-name { font-size:0.78rem; color:var(--gray-600); font-weight:500; }
        .adm-dept-pct { font-size:0.78rem; font-weight:700; color:var(--gray-900); }
        .adm-td-bold { font-weight:600; }
        .adm-td-muted { color:var(--gray-500); font-size:0.8rem; }
        .adm-td-tiny { font-size:0.72rem; color:var(--gray-400); margin-top:1px; }
        .adm-td-fee { font-weight:700; color:var(--primary); }
        .adm-td-hospital { font-size:0.8rem; color:var(--gray-500); max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .adm-person-cell { display:flex; align-items:center; gap:10px; }
        .adm-row-actions { display:flex; gap:6px; flex-wrap:nowrap; }
        .adm-rating { display:flex; align-items:center; gap:4px; font-weight:600; }
        .adm-section-head { margin-bottom:20px; }
        .adm-section-title { font-size:1.1rem; font-weight:700; color:var(--gray-900); margin:0 0 4px; }
        .adm-section-sub { font-size:0.875rem; color:var(--gray-400); }
        .adm-list-head { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
        .adm-list-controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        .adm-search { padding:6px 14px !important; }
        .adm-approval-list { display:flex; flex-direction:column; gap:14px; }
        .adm-approval-card { padding:20px !important; }
        .adm-approval-inner { display:flex; gap:16px; align-items:flex-start; flex-wrap:wrap; }
        .adm-approval-info { flex:1; min-width:200px; }
        .adm-approval-toprow { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:10px; }
        .adm-approval-name { font-size:1rem; font-weight:700; color:var(--gray-900); margin:0 0 6px; }
        .adm-approval-meta { display:flex; gap:14px; flex-wrap:wrap; }
        .adm-approval-meta span { font-size:0.8rem; color:var(--gray-500); }
        .adm-approval-actions { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
        .adm-badge-row { display:flex; gap:6px; flex-wrap:wrap; }
        .adm-hosp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
        .adm-hosp-card { padding:20px; }
        .adm-hosp-top { display:flex; gap:12px; align-items:center; margin-bottom:14px; }
        .adm-hosp-icon { width:48px; height:48px; background:var(--primary-light); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; font-weight:800; color:var(--primary); font-size:1rem; flex-shrink:0; }
        .adm-hosp-info { flex:1; overflow:hidden; }
        .adm-hosp-name { font-weight:700; color:var(--gray-900); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .adm-hosp-meta { font-size:0.75rem; color:var(--gray-400); display:flex; align-items:center; gap:4px; margin-top:2px; }
        .adm-emergency-badge { background:var(--danger-light); color:var(--danger); font-size:0.65rem; font-weight:700; padding:2px 7px; border-radius:var(--radius-full); white-space:nowrap; flex-shrink:0; }
        .adm-hosp-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px; }
        .adm-hosp-stat { text-align:center; padding:8px; background:var(--gray-50); border-radius:var(--radius); }
        .adm-hosp-stat-val { font-weight:700; color:var(--gray-900); font-size:0.9rem; }
        .adm-hosp-stat-lbl { font-size:0.65rem; color:var(--gray-400); margin-top:2px; }
        .adm-hosp-depts { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px; }
        .adm-dept-badge { font-size:0.65rem !important; }
        .adm-hosp-actions { display:flex; gap:6px; }
        .adm-btn-flex { flex:1; }
        .adm-settings { max-width:720px; }
        .adm-settings-section-title { font-size:0.95rem; font-weight:700; color:var(--gray-900); margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .adm-settings-fields { display:flex; flex-direction:column; gap:14px; }
        .adm-toggle-list { display:flex; flex-direction:column; gap:10px; }
        .adm-toggle-row { display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:var(--gray-50); border-radius:var(--radius-lg); border:1px solid var(--gray-200); transition:all 0.2s; gap:16px; }
        .adm-toggle-danger { background:var(--danger-light); border-color:#fca5a5; }
        .adm-toggle-row-title { font-weight:600; color:var(--gray-900); font-size:0.875rem; }
        .adm-toggle-row-desc { font-size:0.75rem; color:var(--gray-400); margin-top:2px; }
        .adm-toggle { width:44px; height:24px; border-radius:12px; border:none; cursor:pointer; position:relative; transition:background 0.2s; flex-shrink:0; }
        .adm-toggle-thumb { width:18px; height:18px; background:white; border-radius:50%; position:absolute; top:3px; transition:left 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
        .adm-toggle-label { display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.875rem; font-weight:600; color:var(--gray-700); }
        .adm-toggle-label input { width:16px; height:16px; accent-color:var(--danger); }
        .adm-danger-list { display:flex; flex-direction:column; gap:10px; }
        .adm-danger-row { display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:var(--gray-50); border-radius:var(--radius-lg); border:1px solid var(--gray-200); gap:16px; }
        .adm-mini-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:20px; padding:14px; background:var(--gray-50); border-radius:var(--radius-lg); border:1px solid var(--gray-200); }
        .adm-mini-stat { text-align:center; }
        .adm-mini-val { font-weight:700; font-size:0.95rem; color:var(--gray-900); }
        .adm-mini-lbl { font-size:0.7rem; color:var(--gray-400); }
        .adm-mini-trend { font-size:0.7rem; color:var(--secondary); font-weight:600; }
        .adm-modal { max-width:560px; }
        .adm-modal-title { font-weight:800; font-size:1.1rem; color:var(--gray-900); }
        .adm-modal-sub { font-size:0.8rem; color:var(--gray-400); margin-top:2px; }
        .adm-modal-footer { gap:10px; }
        .adm-icon-btn { background:none; border:none; cursor:pointer; color:var(--gray-400); padding:4px; border-radius:6px; }
        .adm-icon-btn:hover { background:var(--gray-100); }
        .adm-confirm-msg { color:var(--gray-600); font-size:0.9rem; line-height:1.6; }
        .adm-detail-body { display:flex; flex-direction:column; gap:14px; }
        .adm-detail-hero { display:flex; gap:14px; align-items:center; padding:16px; background:var(--gray-50); border-radius:var(--radius-lg); }
        .adm-detail-name { font-weight:700; font-size:1rem; color:var(--gray-900); margin-bottom:6px; }
        .adm-detail-meta { font-size:0.8rem; color:var(--gray-400); margin-bottom:6px; }
        .adm-detail-row { display:flex; align-items:center; gap:10px; font-size:0.875rem; }
        .adm-detail-label { color:var(--gray-500); min-width:90px; }
        .adm-detail-val { font-weight:600; color:var(--gray-800); }
        .adm-doc-note { padding:12px; background:var(--warning-light); border-radius:var(--radius); border:1px solid #fcd34d; font-size:0.8rem; color:#92400e; }
        .adm-av-doc { background:var(--success-light) !important; color:var(--secondary-dark) !important; }
        .adm-av-nurse { background:var(--purple-light) !important; color:var(--purple) !important; }
        .adm-av-patient { background:var(--primary-light) !important; color:var(--primary) !important; }
        .adm-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .adm-col-full { grid-column:1/-1; }
        .adm-empty { text-align:center; padding:60px 20px; color:var(--gray-400); display:flex; flex-direction:column; align-items:center; }
        .adm-empty h3 { font-weight:700; color:var(--gray-600); margin-bottom:8px; }
        .adm-empty p { font-size:0.875rem; }
        @media (max-width:1024px) { .adm-charts-row { grid-template-columns:1fr; } }
        @media (max-width:768px) {
          .adm-tab { padding:7px 10px; font-size:0.78rem; gap:4px; }
          .adm-tab-emoji { display:none; }
          .adm-stat-grid { grid-template-columns:repeat(2,1fr); gap:10px; }
          .adm-hosp-grid { grid-template-columns:1fr 1fr; }
          .adm-list-head { flex-direction:column; align-items:stretch; }
          .adm-list-controls { flex-direction:column; align-items:stretch; }
          .adm-mini-stats { grid-template-columns:repeat(2,1fr); }
          .adm-approval-inner { flex-direction:column; }
          .adm-approval-actions { width:100%; justify-content:flex-start; }
          .adm-form-grid { grid-template-columns:1fr; }
          .adm-settings { max-width:100%; }
        }
        @media (max-width:540px) {
          .adm-tab-label { display:none; }
          .adm-tab-emoji { display:block; font-size:1.1rem; }
          .adm-tab { padding:8px 10px; }
          .adm-stat-grid { grid-template-columns:repeat(2,1fr); gap:8px; }
          .adm-stat-val { font-size:1.4rem; }
          .adm-stat-card { padding:14px; }
          .adm-hosp-grid { grid-template-columns:1fr; }
          .adm-approval-meta { flex-direction:column; gap:4px; }
          .adm-danger-row,.adm-toggle-row { flex-direction:column; align-items:flex-start; }
        }
        @media (max-width:400px) {
          .adm-stat-grid { grid-template-columns:1fr 1fr; gap:6px; }
          .adm-stat-val { font-size:1.25rem; }
          .adm-stat-icon { width:34px; height:34px; }
        }
      `}</style>
    </Layout>
  );
}
