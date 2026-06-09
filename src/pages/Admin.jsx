import { useState, useEffect } from 'react';
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
import api from '../api';

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ─── Reusable Modal Shell ─────────────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal admin-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--gray-900)' }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose, danger }) {
  return (
    <Modal title="Confirm Action" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { onConfirm(); onClose(); }}>
          {danger ? <><Trash2 size={14} /> Delete</> : <><CheckCircle size={14} /> Confirm</>}
        </button>
      </>
    }>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{message}</p>
    </Modal>
  );
}

// ─── View Docs Modal ──────────────────────────────────────────────────────────
function ViewDocsModal({ app, onClose }) {
  return (
    <Modal title="Application Details" subtitle={`Submitted ${app.submitted}`} onClose={onClose}
      footer={<button className="btn btn-ghost" onClick={onClose}>Close</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
          <div className="avatar avatar-lg" style={{ background: app.role === 'Doctor' ? 'var(--success-light)' : 'var(--purple-light)', color: app.role === 'Doctor' ? 'var(--secondary-dark)' : 'var(--purple)' }}>
            {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{app.name}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <span className={`badge ${app.role === 'Doctor' ? 'badge-success' : 'badge-purple'}`}>{app.role}</span>
              <span className="badge badge-primary">{app.specialty}</span>
            </div>
          </div>
        </div>
        {[
          { label: 'Email', value: app.email, icon: Mail },
          { label: 'Phone', value: app.phone, icon: Phone },
          { label: 'Hospital', value: app.hospital, icon: Building2 },
          { label: 'License No.', value: app.license, icon: ShieldCheck },
          { label: 'Experience', value: `${app.experience} years`, icon: Star },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
            <row.icon size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span style={{ color: 'var(--gray-500)', minWidth: '90px' }}>{row.label}:</span>
            <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{row.value}</span>
          </div>
        ))}
        <div style={{ padding: '12px', background: 'var(--warning-light)', borderRadius: 'var(--radius)', border: '1px solid #fcd34d', fontSize: '0.8rem', color: '#92400e' }}>
          📎 Credential documents uploaded — PDF verified (simulated)
        </div>
      </div>
    </Modal>
  );
}

// ─── Add / Edit Doctor Modal ──────────────────────────────────────────────────
const SPECIALTIES = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine', 'Gynecology', 'ENT', 'Psychiatry', 'Oncology'];
const HOSPITAL_NAMES = ['City General Hospital', 'Sunrise Medical Center', "Children's Health Institute", 'NeuroHealth Clinic', 'BoneJoint Medical Center', 'SkinCare Specialists'];

function DoctorModal({ doctor, onSave, onClose }) {
  const [form, setForm] = useState(doctor || { name: '', specialty: '', hospital: '', experience: '', fee: '', email: '', phone: '', available: true });
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const valid = form.name && form.specialty && form.hospital && form.fee;
  return (
    <Modal title={doctor ? 'Edit Doctor' : 'Add New Doctor'} subtitle="Fill in the doctor's details" onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!valid} onClick={() => { onSave(form); onClose(); }}><Save size={14} /> {doctor ? 'Save Changes' : 'Add Doctor'}</button></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="admin-form-grid">
          <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Dr. John Doe" value={form.name} onChange={e => u('name', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Specialty *</label><select className="form-select" value={form.specialty} onChange={e => u('specialty', e.target.value)}><option value="">Select</option>{SPECIALTIES.map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Hospital *</label><select className="form-select" value={form.hospital} onChange={e => u('hospital', e.target.value)}><option value="">Select</option>{HOSPITAL_NAMES.map(h => <option key={h}>{h}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Consultation Fee ($) *</label><input className="form-input" type="number" placeholder="80" value={form.fee} onChange={e => u('fee', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Experience (years)</label><input className="form-input" type="number" placeholder="5" value={form.experience} onChange={e => u('experience', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.available ? 'active' : 'inactive'} onChange={e => u('available', e.target.value === 'active')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="doctor@email.com" value={form.email || ''} onChange={e => u('email', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone || ''} onChange={e => u('phone', e.target.value)} /></div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add / Edit Hospital Modal ────────────────────────────────────────────────
function HospitalModal({ hospital, onSave, onClose }) {
  const [form, setForm] = useState(hospital || { name: '', city: '', type: 'General', beds: '', doctors: '', phone: '', email: '', address: '', emergency: false });
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const valid = form.name && form.city && form.beds;
  return (
    <Modal title={hospital ? 'Edit Hospital' : 'Add New Hospital'} subtitle="Fill in the hospital details" onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!valid} onClick={() => { onSave(form); onClose(); }}><Save size={14} /> {hospital ? 'Save Changes' : 'Add Hospital'}</button></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="admin-form-grid">
          <div className="form-group admin-form-full"><label className="form-label">Hospital Name *</label><input className="form-input" placeholder="City General Hospital" value={form.name} onChange={e => u('name', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">City *</label><input className="form-input" placeholder="New York" value={form.city} onChange={e => u('city', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e => u('type', e.target.value)}><option>General</option><option>Specialty</option><option>Multi-Specialty</option><option>Clinic</option></select></div>
          <div className="form-group"><label className="form-label">Total Beds *</label><input className="form-input" type="number" placeholder="200" value={form.beds} onChange={e => u('beds', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Doctors Count</label><input className="form-input" type="number" placeholder="50" value={form.doctors} onChange={e => u('doctors', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+1 (212) 555-0100" value={form.phone} onChange={e => u('phone', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="info@hospital.com" value={form.email} onChange={e => u('email', e.target.value)} /></div>
          <div className="form-group admin-form-full"><label className="form-label">Address</label><input className="form-input" placeholder="123 Medical Ave, New York, NY" value={form.address} onChange={e => u('address', e.target.value)} /></div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)' }}>
          <input type="checkbox" checked={form.emergency} onChange={e => u('emergency', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--danger)' }} />
          24/7 Emergency Services Available
        </label>
      </div>
    </Modal>
  );
}

// ─── View Patient Modal ───────────────────────────────────────────────────────
function PatientModal({ patient, onClose }) {
  return (
    <Modal title="Patient Details" subtitle={`Member since ${patient.joined}`} onClose={onClose}
      footer={<button className="btn btn-ghost" onClick={onClose}>Close</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
          <div className="avatar avatar-lg" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{patient.initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{patient.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{patient.gender} · {patient.bloodGroup} · DOB: {patient.dob}</div>
            <span className={`badge ${patient.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ marginTop: '6px' }}>{patient.status}</span>
          </div>
        </div>
        {[
          { label: 'Email', value: patient.email, icon: Mail },
          { label: 'Phone', value: patient.phone, icon: Phone },
          { label: 'Appointments', value: `${patient.appointments} total`, icon: Calendar },
          { label: 'Conditions', value: patient.conditions || 'None recorded', icon: Heart },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
            <row.icon size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span style={{ color: 'var(--gray-500)', minWidth: '100px' }}>{row.label}:</span>
            <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const {
    doctors, setDoctors,
    hospitals, setHospitals,
    patients, setPatients,
    appointments, setAppointments,
    addToast, addNotification
  } = useApp();

  const handleExportData = () => {
    downloadJSON('ehospital-backup.json', {
      stats: ADMIN_STATS,
      doctors: doctors,
      hospitals: hospitals,
      appointments: appointments,
      patients: patients,
    });
    addToast('Backup file downloaded successfully', 'success');
  };
  const location = useLocation();

  // Derive active tab from URL path — no useState needed
  const pathToTab = {
    '/admin': 'overview',
    '/admin/doctors': 'doctors',
    '/admin/hospitals': 'hospitals',
    '/admin/patients': 'patients',
    '/admin/approvals': 'approvals',
    '/admin/analytics': 'analytics',
    '/admin/settings': 'settings',
  };
  const activeTab = pathToTab[location.pathname] || 'overview';

  // Approvals state
  const [approvals, setApprovals] = useState(PENDING_APPROVALS);
  const [viewDocsApp, setViewDocsApp] = useState(null);
  const [confirmApprove, setConfirmApprove] = useState(null);
  const [confirmReject, setConfirmReject] = useState(null);

  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorModal, setDoctorModal] = useState(null); // null | 'add' | doctor object
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState(null);

  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitalModal, setHospitalModal] = useState(null);
  const [confirmDeleteHosp, setConfirmDeleteHosp] = useState(null);

  const [patientSearch, setPatientSearch] = useState('');
  const [viewPatient, setViewPatient] = useState(null);
  const [confirmDeletePatient, setConfirmDeletePatient] = useState(null);

  // Settings state (persisted)
  const getStoredSettings = () => {
    try {
      const s = localStorage.getItem('ehospital_settings');
      return s ? JSON.parse(s) : { siteName: 'E-Hospital', supportEmail: 'support@ehospital.com', maxAppointments: 20, autoApprove: false, maintenanceMode: false, emailNotifications: true };
    } catch {
      return { siteName: 'E-Hospital', supportEmail: 'support@ehospital.com', maxAppointments: 20, autoApprove: false, maintenanceMode: false, emailNotifications: true };
    }
  };
  const [settings, setSettings] = useState(getStoredSettings);

  // persist settings
  useEffect(() => {
    try { localStorage.setItem('ehospital_settings', JSON.stringify(settings)); } catch {}
  }, [settings]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const doApprove = (id) => {
    const app = approvals.find(a => a.id === id);
    if (app) {
      if (app.role === 'Doctor') {
        const newDoc = {
          id: `d_app_${id}`,
          name: app.name,
          specialty: app.specialty,
          hospital: app.hospital,
          experience: Number(app.experience) || 5,
          fee: 80,
          available: true,
          online: false,
          languages: ['English'],
          initials: app.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(),
          nextSlot: 'TBD',
          patients: 0,
          rating: 5.0,
          reviews: 0,
          education: 'Verified Medical Degree',
          about: `Verified specialist in ${app.specialty} at ${app.hospital}.`,
          tags: [app.specialty]
        };
        setDoctors(p => [newDoc, ...p]);
        addToast(`Doctor ${app.name} approved and added to active registry!`, 'success');
      } else {
        addToast(`${app.role} ${app.name} approved successfully!`, 'success');
      }
    }
    setApprovals(p => p.filter(a => a.id !== id));
  };
  const doReject = (id) => { setApprovals(p => p.filter(a => a.id !== id)); addToast('Application rejected', 'warning'); };

  const saveDoctor = async (form) => {
    const targetId = form._id || form.id;
    if (targetId) {
      try {
        const response = await api.put(`/doctors/${targetId}`, form);
        setDoctors(p => p.map(d => (d._id === targetId || d.id === targetId) ? { ...d, ...response.data } : d));
        addToast('Doctor updated successfully', 'success');
      } catch (err) {
        setDoctors(p => p.map(d => (d._id === targetId || d.id === targetId) ? { ...d, ...form } : d));
        addToast('Doctor updated locally', 'success');
      }
    } else {
      try {
        const response = await api.post('/doctors', form);
        setDoctors(p => [response.data, ...p]);
        addToast('Doctor added successfully', 'success');
      } catch (err) {
        const newDoc = { ...form, id: `d${Date.now()}`, initials: form.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(), rating: 4.5, reviews: 0, patients: 0, online: false, languages: ['English'], tags: [], about: '', education: '', nextSlot: 'TBD', fee: Number(form.fee), experience: Number(form.experience) };
        setDoctors(p => [newDoc, ...p]);
        addToast('Doctor added locally', 'success');
      }
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await api.delete(`/doctors/${id}`);
      setDoctors(p => p.filter(d => d._id !== id && d.id !== id));
      addToast('Doctor removed', 'warning');
    } catch (err) {
      setDoctors(p => p.filter(d => d._id !== id && d.id !== id));
      addToast('Doctor removed locally', 'warning');
    }
  };

  const saveHospital = async (form) => {
    const targetId = form._id || form.id;
    if (targetId) {
      try {
        const response = await api.put(`/hospitals/${targetId}`, form);
        setHospitals(p => p.map(h => (h._id === targetId || h.id === targetId) ? { ...h, ...response.data } : h));
        addToast('Hospital updated successfully', 'success');
      } catch (err) {
        setHospitals(p => p.map(h => (h._id === targetId || h.id === targetId) ? { ...h, ...form } : h));
        addToast('Hospital updated locally', 'success');
      }
    } else {
      try {
        const response = await api.post('/hospitals', form);
        setHospitals(p => [response.data, ...p]);
        addToast('Hospital added successfully', 'success');
      } catch (err) {
        const newH = { ...form, id: `h${Date.now()}`, initials: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(), rating: 4.5, departments: [], waitTime: 'N/A', about: '', beds: Number(form.beds), doctors: Number(form.doctors) };
        setHospitals(p => [newH, ...p]);
        addToast('Hospital added locally', 'success');
      }
    }
  };

  const deleteHospital = async (id) => {
    try {
      await api.delete(`/hospitals/${id}`);
      setHospitals(p => p.filter(h => h._id !== id && h.id !== id));
      addToast('Hospital removed', 'warning');
    } catch (err) {
      setHospitals(p => p.filter(h => h._id !== id && h.id !== id));
      addToast('Hospital removed locally', 'warning');
    }
  };

  const deletePatient = async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      setPatients(p => p.filter(pt => pt._id !== id && pt.id !== id));
      addToast('Patient record removed', 'warning');
    } catch (err) {
      setPatients(p => p.filter(pt => pt._id !== id && pt.id !== id));
      addToast('Patient record removed locally', 'warning');
    }
  };

  const togglePatientStatus = (id) => {
    setPatients(p => p.map(pt => (pt._id === id || pt.id === id) ? { ...pt, status: pt.status === 'active' ? 'inactive' : 'active' } : pt));
    addToast('Patient status updated', 'success');
  };

  const clearAllAppointments = () => {
    setAppointments([]);
    addToast('All appointment records cleared', 'warning');
    try { addNotification({ title: 'Appointments cleared', body: 'All appointment records were cleared by an admin.' }); } catch {}
  };

  const resetPlatformData = () => {
    setDoctors(DOCTORS);
    setHospitals(HOSPITALS);
    setAppointments(APPOINTMENTS);
    setPatients(PATIENTS);
    setApprovals(PENDING_APPROVALS);
    setSettings({ siteName: 'E-Hospital', supportEmail: 'support@ehospital.com', maxAppointments: 20, autoApprove: false, maintenanceMode: false, emailNotifications: true });
    addToast('Platform data reset to defaults', 'success');
    try { addNotification({ title: 'Platform reset', body: 'Platform data was reset to defaults by an admin.' }); } catch {}
  };

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const filteredDoctors = doctors.filter(d => !doctorSearch || d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialty.toLowerCase().includes(doctorSearch.toLowerCase()));
  const filteredHospitals = hospitals.filter(h => !hospitalSearch || h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || h.city.toLowerCase().includes(hospitalSearch.toLowerCase()));
  const filteredPatients = patients.filter(p => !patientSearch || p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.email.toLowerCase().includes(patientSearch.toLowerCase()));

  // ── Chart data ─────────────────────────────────────────────────────────────
  const weeklyData = [
    { day: 'Mon', apts: 42, rev: 3200 }, { day: 'Tue', apts: 58, rev: 4100 },
    { day: 'Wed', apts: 51, rev: 3800 }, { day: 'Thu', apts: 67, rev: 5200 },
    { day: 'Fri', apts: 73, rev: 5800 }, { day: 'Sat', apts: 38, rev: 2900 },
    { day: 'Sun', apts: 13, rev: 1100 },
  ];
  const maxApts = Math.max(...weeklyData.map(d => d.apts));
  const maxRev = Math.max(...weeklyData.map(d => d.rev));
  const deptData = [
    { name: 'General Medicine', pct: 32, color: 'var(--primary)' },
    { name: 'Cardiology', pct: 18, color: 'var(--danger)' },
    { name: 'Pediatrics', pct: 15, color: 'var(--secondary)' },
    { name: 'Neurology', pct: 12, color: 'var(--purple)' },
    { name: 'Dermatology', pct: 10, color: 'var(--accent)' },
    { name: 'Others', pct: 13, color: 'var(--gray-400)' },
  ];

  // Chart state for interactivity
  const [chartView, setChartView] = useState('apts'); // 'apts' or 'rev'
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);

  const statCards = [
    { label: 'Total Patients', value: ADMIN_STATS.totalPatients.toLocaleString(), icon: Heart, color: 'var(--primary)', bg: 'var(--primary-light)', trend: '+12%', up: true },
    { label: 'Active Doctors', value: doctors.filter(d => d.available).length, icon: Stethoscope, color: 'var(--secondary)', bg: 'var(--success-light)', trend: '+5%', up: true },
    { label: 'Partner Hospitals', value: hospitals.length, icon: Building2, color: 'var(--accent)', bg: 'var(--warning-light)', trend: '+2', up: true },
    { label: 'Appointments Today', value: ADMIN_STATS.appointmentsToday, icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-light)', trend: '+18%', up: true },
    { label: 'Pending Approvals', value: approvals.length, icon: ShieldCheck, color: 'var(--danger)', bg: 'var(--danger-light)', trend: `${approvals.length} pending`, up: false },
    { label: 'Monthly Revenue', value: `$${(ADMIN_STATS.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'var(--secondary)', bg: 'var(--success-light)', trend: '+22%', up: true },
    { label: 'Consultations', value: ADMIN_STATS.consultationsThisMonth.toLocaleString(), icon: Activity, color: 'var(--purple)', bg: 'var(--purple-light)', trend: '+15%', up: true },
    { label: 'Nurses', value: ADMIN_STATS.totalNurses, icon: Users, color: 'var(--purple)', bg: 'var(--purple-light)', trend: '+8%', up: true },
  ];

  const navigate = useNavigate();

  const TABS = [
    { value: 'overview',   label: '📊 Overview',                path: '/admin' },
    { value: 'approvals',  label: `✅ Approvals${approvals.length ? ` (${approvals.length})` : ''}`, path: '/admin/approvals' },
    { value: 'doctors',    label: '👨‍⚕️ Doctors',               path: '/admin/doctors' },
    { value: 'hospitals',  label: '🏥 Hospitals',               path: '/admin/hospitals' },
    { value: 'patients',   label: '🧑 Patients',                path: '/admin/patients' },
    { value: 'analytics',  label: '📈 Analytics',               path: '/admin/analytics' },
    { value: 'settings',   label: '⚙️ Settings',                path: '/admin/settings' },
  ];

  return (
    <Layout title="Admin Dashboard">
      {/* Tabs */}
      <div className="admin-tabs-bar">
        {TABS.map(t => (
          <button key={t.value} onClick={() => navigate(t.path)}
            className={`admin-tab-btn${activeTab === t.value ? ' active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="animate-fadeIn">
          <div className="admin-stats-grid">
            {statCards.map(s => (
              <div key={s.label} className="stat-card card-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', background: s.bg, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={20} color={s.color} /></div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', fontWeight: 600, color: s.up ? 'var(--secondary)' : 'var(--danger)' }}>
                    {s.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{s.trend}
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="admin-chart-grid">
            {/* Weekly Appointments & Revenue Chart */}
            <div className="card admin-chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Weekly Performance</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>Appointments & Revenue overview</p>
                </div>
                <div style={{ display: 'flex', gap: '4px', background: 'var(--gray-100)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                  <button
                    onClick={() => setChartView('apts')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: chartView === 'apts' ? 'white' : 'transparent',
                      color: chartView === 'apts' ? 'var(--gray-900)' : 'var(--gray-500)',
                      boxShadow: chartView === 'apts' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    Appointments
                  </button>
                  <button
                    onClick={() => setChartView('rev')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: chartView === 'rev' ? 'white' : 'transparent',
                      color: chartView === 'rev' ? 'var(--gray-900)' : 'var(--gray-500)',
                      boxShadow: chartView === 'rev' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    Revenue
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', position: 'relative' }}>
                {weeklyData.map(d => {
                  const value = chartView === 'apts' ? d.apts : d.rev;
                  const max = chartView === 'apts' ? maxApts : maxRev;
                  const isHovered = hoveredDay === d.day;
                  return (
                    <div
                      key={d.day}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        height: '100%',
                        justifyContent: 'flex-end',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setHoveredDay(d.day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {isHovered && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--gray-900)',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            marginBottom: '8px',
                            zIndex: 10,
                          }}
                        >
                          {chartView === 'apts' ? `${d.apts} appointments` : `$${d.rev.toLocaleString()}`}
                        </div>
                      )}
                      <div
                        style={{
                          width: '100%',
                          background: isHovered
                            ? 'linear-gradient(180deg, var(--primary-dark) 0%, #0369a1 100%)'
                            : 'linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)',
                          borderRadius: '6px 6px 0 0',
                          height: `${(value / max) * 140}px`,
                          minHeight: '8px',
                          transition: 'all 0.3s ease',
                          transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                          transformOrigin: 'bottom',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: isHovered ? 'var(--gray-900)' : 'var(--gray-400)',
                          fontWeight: 600,
                        }}
                      >
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                    {weeklyData.reduce((sum, d) => sum + d.apts, 0)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Total Appointments</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                    ${weeklyData.reduce((sum, d) => sum + d.rev, 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Total Revenue</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    +18%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>vs Last Week</div>
                </div>
              </div>
            </div>

            {/* Department Distribution Chart */}
            <div className="card admin-chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Department Distribution</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>Appointments by specialty</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {deptData.map(d => {
                  const isHovered = hoveredDept === d.name;
                  return (
                    <div
                      key={d.name}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredDept(d.name)}
                      onMouseLeave={() => setHoveredDept(null)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: isHovered ? 'var(--gray-900)' : 'var(--gray-600)',
                            fontWeight: 500,
                            transition: 'color 0.2s',
                          }}
                        >
                          {d.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: isHovered ? d.color : 'var(--gray-900)',
                            transition: 'color 0.2s',
                          }}
                        >
                          {d.pct}%
                        </span>
                      </div>
                      <div
                        className="progress-bar"
                        style={{
                          height: '10px',
                          background: 'var(--gray-100)',
                          borderRadius: '5px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          className="progress-fill"
                          style={{
                            width: `${d.pct}%`,
                            background: d.color,
                            height: '100%',
                            borderRadius: '5px',
                            transition: 'all 0.3s ease',
                            transform: isHovered ? 'scaleX(1.02)' : 'scaleX(1)',
                            transformOrigin: 'left',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--gray-100)',
                  flexWrap: 'wrap',
                }}
              >
                {deptData.slice(0, 4).map(d => (
                  <div
                    key={d.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.7rem',
                      color: 'var(--gray-500)',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        background: d.color,
                      }}
                    />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '16px' }}>Recent Appointments</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Patient</th><th>Doctor</th><th>Specialty</th><th>Date</th><th>Type</th><th>Status</th><th>Fee</th></tr></thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td style={{ fontWeight: 600 }}>{apt.patientName}</td>
                      <td>{apt.doctorName}</td>
                      <td><span className="badge badge-primary">{apt.doctorSpecialty}</span></td>
                      <td style={{ color: 'var(--gray-500)' }}>{apt.date}</td>
                      <td><span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>{apt.type}</span></td>
                      <td><span className={`badge ${apt.status === 'confirmed' ? 'badge-success' : apt.status === 'pending' ? 'badge-warning' : apt.status === 'cancelled' ? 'badge-danger' : 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>{apt.status}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${apt.fee}</td>
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
          <div style={{ marginBottom: '20px' }}><h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Pending Approvals</h3><p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>Review and approve doctor/nurse registrations</p></div>
          {approvals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-400)' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <h3 style={{ fontWeight: 700, color: 'var(--gray-600)', marginBottom: '8px' }}>All caught up!</h3>
              <p style={{ fontSize: '0.875rem' }}>No pending approvals at this time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {approvals.map(app => (
                <div key={app.id} className="card admin-approval-card">
                  <div className="admin-approval-inner">
                    <div className="avatar avatar-lg" style={{ background: app.role === 'Doctor' ? 'var(--success-light)' : 'var(--purple-light)', color: app.role === 'Doctor' ? 'var(--secondary-dark)' : 'var(--purple)', flexShrink: 0 }}>
                      {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="admin-approval-info">
                      <div className="admin-approval-header">
                        <div>
                          <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.95rem', marginBottom: '4px' }}>{app.name}</h3>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <span className={`badge ${app.role === 'Doctor' ? 'badge-success' : 'badge-purple'}`}>{app.role}</span>
                            <span className="badge badge-primary">{app.specialty}</span>
                          </div>
                        </div>
                        <span className="badge badge-warning" style={{ flexShrink: 0 }}>Pending Review</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        <span>🏥 {app.hospital}</span>
                        <span>📅 {app.submitted}</span>
                        <span>📧 {app.email}</span>
                      </div>
                    </div>
                    <div className="admin-approval-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewDocsApp(app)}><Eye size={13} /> View</button>
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
          <div className="admin-section-toolbar">
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Registered Doctors</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{filteredDoctors.length} of {doctors.length} doctors</p>
            </div>
            <div className="admin-toolbar-right">
              <div className="search-bar" style={{ padding: '6px 14px' }}>
                <Search size={14} color="var(--gray-400)" />
                <input placeholder="Search doctors..." value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setDoctorModal('add')}><Plus size={14} /> Add Doctor</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Doctor</th><th>Specialty</th><th>Hospital</th><th>Rating</th><th>Patients</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredDoctors.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm">{doc.initials}</div>
                        <div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{doc.name}</div><div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{doc.experience}y exp</div></div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{doc.specialty}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.hospital}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ color: 'var(--accent)' }}>★</span><span style={{ fontWeight: 600 }}>{doc.rating}</span></div></td>
                    <td style={{ fontWeight: 600 }}>{doc.patients.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${doc.fee}</td>
                    <td><span className={`badge ${doc.available ? 'badge-success' : 'badge-gray'}`}>{doc.available ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDoctorModal(doc)}><Edit2 size={12} /> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteDoc(doc)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDoctors.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}><Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} /><p>No doctors found</p></div>}
        </div>
      )}

      {/* ── HOSPITALS ── */}
      {activeTab === 'hospitals' && (
        <div className="animate-fadeIn">
          <div className="admin-section-toolbar">
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Partner Hospitals</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{filteredHospitals.length} hospitals registered</p>
            </div>
            <div className="admin-toolbar-right">
              <div className="search-bar" style={{ padding: '6px 14px' }}>
                <Search size={14} color="var(--gray-400)" />
                <input placeholder="Search hospitals..." value={hospitalSearch} onChange={e => setHospitalSearch(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setHospitalModal('add')}><Plus size={14} /> Add Hospital</button>
            </div>
          </div>
          <div className="admin-hospital-grid">
            {filteredHospitals.map(h => (
              <div key={h.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>{h.initials}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} />{h.city} · {h.type}</div>
                  </div>
                  {h.emergency && <span style={{ background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--radius-full)' }}>🚨 24/7</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                  {[{ label: 'Beds', value: h.beds }, { label: 'Doctors', value: h.doctors }, { label: 'Rating', value: h.rating }].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', padding: '8px', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.9rem' }}>{s.value}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {h.departments && h.departments.length > 0 && (
                  <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {h.departments.slice(0, 3).map(d => <span key={d} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{d}</span>)}
                    {h.departments.length > 3 && <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>+{h.departments.length - 3}</span>}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setHospitalModal(h)}><Edit2 size={12} /> Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteHosp(h)}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
          {filteredHospitals.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}><Building2 size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} /><p>No hospitals found</p></div>}
        </div>
      )}

      {/* ── PATIENTS ── */}
      {activeTab === 'patients' && (
        <div className="animate-fadeIn">
          <div className="admin-section-toolbar">
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Registered Patients</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{filteredPatients.length} patients</p>
            </div>
            <div className="search-bar" style={{ padding: '6px 14px' }}>
              <Search size={14} color="var(--gray-400)" />
              <input placeholder="Search patients..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Patient</th><th>Contact</th><th>Blood Group</th><th>Appointments</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredPatients.map(pt => (
                  <tr key={pt.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{pt.initials}</div>
                        <div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pt.name}</div><div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{pt.gender} · {pt.dob}</div></div>
                      </div>
                    </td>
                    <td><div style={{ fontSize: '0.8rem' }}>{pt.email}</div><div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{pt.phone}</div></td>
                    <td><span className="badge badge-danger">{pt.bloodGroup}</span></td>
                    <td style={{ fontWeight: 600, textAlign: 'center' }}>{pt.appointments}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{pt.joined}</td>
                    <td><span className={`badge ${pt.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>{pt.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewPatient(pt)}><Eye size={12} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => togglePatientStatus(pt.id)}><RefreshCw size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeletePatient(pt)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPatients.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}><Heart size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} /><p>No patients found</p></div>}
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {activeTab === 'analytics' && (
        <div className="animate-fadeIn">
          <div className="admin-analytics-stats">
            {[
              { label: 'Total Revenue', value: `$${(ADMIN_STATS.revenue / 1000).toFixed(1)}K`, sub: 'This month', color: 'var(--secondary)', bg: 'var(--success-light)', icon: DollarSign },
              { label: 'Consultations', value: ADMIN_STATS.consultationsThisMonth.toLocaleString(), sub: 'This month', color: 'var(--primary)', bg: 'var(--primary-light)', icon: Activity },
              { label: 'Avg. Rating', value: '4.8 ★', sub: 'Platform-wide', color: 'var(--accent)', bg: 'var(--warning-light)', icon: Star },
              { label: 'Satisfaction', value: '96%', sub: 'Patient feedback', color: 'var(--purple)', bg: 'var(--purple-light)', icon: Heart },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ width: '40px', height: '40px', background: s.bg, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><s.icon size={20} color={s.color} /></div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '2px' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="admin-chart-grid">
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '6px' }}>Revenue This Week</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '20px' }}>Daily revenue breakdown</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
                {weeklyData.map(d => (
                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--gray-600)' }}>${(d.rev / 1000).toFixed(1)}k</span>
                    <div style={{ width: '100%', background: 'linear-gradient(180deg, var(--secondary) 0%, var(--secondary-dark) 100%)', borderRadius: '5px 5px 0 0', height: `${(d.rev / maxRev) * 110}px`, minHeight: '4px' }} />
                    <span style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 600 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '16px' }}>Consultation Types</h3>
              {[{ label: 'Online Consultations', pct: 68, color: 'var(--primary)' }, { label: 'Physical Visits', pct: 32, color: 'var(--secondary)' }].map(d => (
                <div key={d.label} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)', fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{d.pct}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '10px' }}><div className="progress-fill" style={{ width: `${d.pct}%`, background: d.color }} /></div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '20px' }}>
                {[
                  { label: 'New Patients', value: '1,240', trend: '+8%', color: 'var(--primary)', bg: 'var(--primary-light)' },
                  { label: 'Returning', value: '3,580', trend: '+12%', color: 'var(--secondary)', bg: 'var(--success-light)' },
                  { label: 'Avg. Session', value: '24 min', trend: '+2min', color: 'var(--purple)', bg: 'var(--purple-light)' },
                  { label: 'Cancellations', value: '3.2%', trend: '-0.5%', color: 'var(--danger)', bg: 'var(--danger-light)' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px', background: s.bg, borderRadius: 'var(--radius-lg)', textAlign: 'center', border: `1px solid ${s.color}20` }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: '0.7rem', color: s.trend.startsWith('+') ? 'var(--secondary)' : 'var(--danger)', fontWeight: 600, marginTop: '4px' }}>{s.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '16px' }}>Top Performing Doctors</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Doctor</th><th>Specialty</th><th>Consultations</th><th>Rating</th><th>Revenue</th><th>Satisfaction</th></tr></thead>
                <tbody>
                  {doctors.slice(0, 5).map((doc, i) => (
                    <tr key={doc.id}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div className="avatar avatar-sm">{doc.initials}</div><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{doc.name}</span></div></td>
                      <td><span className="badge badge-primary">{doc.specialty}</span></td>
                      <td style={{ fontWeight: 600 }}>{(doc.patients / 10).toFixed(0)}</td>
                      <td><span style={{ color: 'var(--accent)' }}>★</span> {doc.rating}</td>
                      <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>${((doc.patients * doc.fee) / 1000).toFixed(1)}K</td>
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
        <div className="animate-fadeIn admin-settings-wrap">
          <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '20px' }}>Platform Settings</h3>

          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={16} color="var(--primary)" /> General</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group"><label className="form-label">Platform Name</label><input className="form-input" value={settings.siteName} onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Support Email</label><input className="form-input" type="email" value={settings.supportEmail} onChange={e => setSettings(p => ({ ...p, supportEmail: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Max Appointments Per Doctor / Day</label><input className="form-input" type="number" value={settings.maxAppointments} onChange={e => setSettings(p => ({ ...p, maxAppointments: Number(e.target.value) }))} /></div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} color="var(--primary)" /> Access & Approvals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'autoApprove', label: 'Auto-approve doctor registrations', desc: 'Skip manual review for new doctor sign-ups', danger: true },
                { key: 'emailNotifications', label: 'Email notifications', desc: 'Send email alerts for appointments and approvals' },
                { key: 'maintenanceMode', label: 'Maintenance mode', desc: 'Temporarily disable patient access to the platform', danger: true },
              ].map(item => (
                <div key={item.key} className="admin-toggle-row" style={{ background: item.danger && settings[item.key] ? 'var(--danger-light)' : 'var(--gray-50)', border: `1px solid ${item.danger && settings[item.key] ? '#fca5a5' : 'var(--gray-200)'}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  <button onClick={() => setSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                    style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: settings[item.key] ? (item.danger ? 'var(--danger)' : 'var(--secondary)') : 'var(--gray-300)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: settings[item.key] ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} color="var(--danger)" /> Danger Zone</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Clear All Appointments', desc: 'Permanently delete all appointment records', btn: 'Clear' },
                { label: 'Reset Platform Data', desc: 'Reset all data to factory defaults', btn: 'Reset' },
                { label: 'Export All Data', desc: 'Download a full backup of platform data', btn: 'Export' },
              ].map(item => (
                <div key={item.label} className="admin-danger-row">
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{item.label}</div><div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>{item.desc}</div></div>
                  <button className={`btn btn-sm ${item.btn === 'Export' ? 'btn-outline' : item.btn === 'Clear' ? 'btn-danger' : 'btn-warning'}`}
                    onClick={() => {
                      if (item.btn === 'Export') handleExportData();
                      else if (item.btn === 'Clear') clearAllAppointments();
                      else if (item.btn === 'Reset') resetPlatformData();
                    }}>
                    {item.btn}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => addToast('Settings saved successfully!', 'success')}><Save size={15} /> Save All Settings</button>
        </div>
      )}

      {/* ── MODALS ── */}
      {viewDocsApp && <ViewDocsModal app={viewDocsApp} onClose={() => setViewDocsApp(null)} />}
      {confirmApprove && <ConfirmModal message={`Approve ${confirmApprove.name} as a ${confirmApprove.role}?`} onConfirm={() => doApprove(confirmApprove.id)} onClose={() => setConfirmApprove(null)} />}
      {confirmReject && <ConfirmModal message={`Reject ${confirmReject.name}'s application? This cannot be undone.`} onConfirm={() => doReject(confirmReject.id)} onClose={() => setConfirmReject(null)} danger />}
      {doctorModal && <DoctorModal doctor={doctorModal === 'add' ? null : doctorModal} onSave={saveDoctor} onClose={() => setDoctorModal(null)} />}
      {confirmDeleteDoc && <ConfirmModal message={`Remove ${confirmDeleteDoc.name} from the platform?`} onConfirm={() => deleteDoctor(confirmDeleteDoc.id)} onClose={() => setConfirmDeleteDoc(null)} danger />}
      {hospitalModal && <HospitalModal hospital={hospitalModal === 'add' ? null : hospitalModal} onSave={saveHospital} onClose={() => setHospitalModal(null)} />}
      {confirmDeleteHosp && <ConfirmModal message={`Remove ${confirmDeleteHosp.name} from the platform?`} onConfirm={() => deleteHospital(confirmDeleteHosp.id)} onClose={() => setConfirmDeleteHosp(null)} danger />}
      {viewPatient && <PatientModal patient={viewPatient} onClose={() => setViewPatient(null)} />}
      {confirmDeletePatient && <ConfirmModal message={`Remove patient ${confirmDeletePatient.name}? This will delete all their records.`} onConfirm={() => deletePatient(confirmDeletePatient.id)} onClose={() => setConfirmDeletePatient(null)} danger />}
    </Layout>
  );
}
