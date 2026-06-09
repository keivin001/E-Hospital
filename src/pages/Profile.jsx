import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Calendar, Heart, Shield, Edit2, Save, X, Camera, Activity, FileText, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { APPOINTMENTS, PRESCRIPTIONS } from '../data/mockData';

export default function Profile() {
  const { user, updateUser, addToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [notifSettings, setNotifSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('ehospital_user_notification_settings');
      return stored ? JSON.parse(stored) : {
        emailApts: true,
        emailRx: true,
        emailChat: true,
        smsReminders: true,
        smsSecurity: false,
        pushChat: true,
        pushSystem: false
      };
    } catch {
      return {
        emailApts: true,
        emailRx: true,
        emailChat: true,
        smsReminders: true,
        smsSecurity: false,
        pushChat: true,
        pushSystem: false
      };
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['overview', 'medical', 'security', 'notifications'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [window.location.search]);

  const handleSaveNotifSettings = () => {
    try {
      localStorage.setItem('ehospital_user_notification_settings', JSON.stringify(notifSettings));
      addToast('Notification preferences saved successfully!', 'success');
    } catch {
      addToast('Failed to save notification preferences.', 'error');
    }
  };
  const [form, setForm] = useState({
    name: user?.name || 'Eric Johnson',
    email: user?.email || 'eric.johnson@email.com',
    phone: user?.phone || '+1 (555) 234-5678',
    dob: user?.dob || '1990-03-15',
    gender: user?.gender || 'Male',
    bloodGroup: user?.bloodGroup || 'O+',
    conditions: user?.conditions || 'Mild Hypertension',
    emergencyContact: user?.emergencyContact || '+1 (555) 987-6543',
    address: user?.address || '456 Oak Street, New York, NY 10002',
    weight: user?.weight || '78 kg',
    height: user?.height || '175 cm',
  });
  const [profileImage, setProfileImage] = useState(user?.image || null);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [devices, setDevices] = useState([
    { id: 'd1', name: 'Windows Laptop — Chrome', lastUsed: 'Today, 10:14 AM' },
    { id: 'd2', name: 'iPhone 14 — Safari', lastUsed: 'Yesterday, 4:33 PM' },
    { id: 'd3', name: 'iPad Pro — Safari', lastUsed: 'Mar 12, 2025' },
  ]);
  const loginHistory = [
    { id: 'h1', location: 'New York, USA', device: 'Chrome on Windows', time: 'Today, 10:14 AM' },
    { id: 'h2', location: 'Brooklyn, USA', device: 'Safari on iPhone', time: 'Yesterday, 4:33 PM' },
    { id: 'h3', location: 'Manhattan, USA', device: 'Safari on iPad', time: 'Mar 12, 2025' },
  ];

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...form,
      image: profileImage,
      initials: form.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    };
    updateUser(updatedUser);
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || 'Eric Johnson',
      email: user.email || 'eric.johnson@email.com',
      phone: user.phone || '+1 (555) 234-5678',
      dob: user.dob || '1990-03-15',
      gender: user.gender || 'Male',
      bloodGroup: user.bloodGroup || 'O+',
      conditions: user.conditions || 'Mild Hypertension',
      emergencyContact: user.emergencyContact || '+1 (555) 987-6543',
      address: user.address || '456 Oak Street, New York, NY 10002',
      weight: user.weight || '78 kg',
      height: user.height || '175 cm',
    });
    setProfileImage(user.image || null);
  }, [user]);

  const openPasswordModal = () => {
    setPasswordError('');
    setPasswordForm({ current: '', newPassword: '', confirmPassword: '' });
    setModalType('password');
  };

  const handlePasswordSubmit = () => {
    if (!passwordForm.current || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please complete all password fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setModalType(null);
    addToast('Password changed successfully.', 'success');
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(prev => !prev);
    addToast(`${twoFactorEnabled ? 'Two-factor authentication disabled.' : 'Two-factor authentication enabled.'}`, 'success');
  };

  const openLoginHistory = () => setModalType('history');
  const openDeviceManager = () => setModalType('devices');
  const removeDevice = (id) => {
    setDevices(prev => prev.filter(device => device.id !== id));
    addToast('Device disconnected successfully.', 'warning');
  };

  const completedApts = APPOINTMENTS.filter(a => a.status === 'completed').length;
  const totalApts = APPOINTMENTS.length;

  return (
    <Layout title="My Profile">
      <style>{`
        .profile-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .profile-overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .profile-overview-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        @media (max-width: 640px) {
          .profile-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 4px' }}>
        {/* Profile header */}
        <div className="card profile-card" style={{ marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', height: '140px', position: 'relative', overflow: 'hidden' }}>
            {/* Profile image overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
              <div className="avatar" style={{ width: '120px', height: '120px', fontSize: '3rem', background: 'white', color: 'var(--primary)' }}>
                {profileImage ? (
                  <img src={profileImage} alt={form.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{user?.initials || 'EJ'}</span>
                )}
              </div>
            </div>
            <div style={{ position: 'absolute', right: '20px', bottom: '-40px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {editing ? (
                <>
                  <button className="btn btn-ghost btn-sm" style={{ background: 'white' }} onClick={() => setEditing(false)}>
                    <X size={14} /> Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave}>
                    <Save size={14} /> Save Changes
                  </button>
                </>
              ) : (
                <button className="btn btn-ghost btn-sm" style={{ background: 'white' }} onClick={() => setEditing(true)}>
                  <Edit2 size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>
          <div style={{ padding: '0 20px 20px', marginTop: '-44px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div className="avatar" style={{ width: '88px', height: '88px', fontSize: '2rem', border: '4px solid white', boxShadow: 'var(--shadow-md)', background: 'var(--primary-light)', color: 'var(--primary)', overflow: 'hidden' }}>
                  {profileImage ? (
                    <img src={profileImage} alt={form.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{user?.initials || 'EJ'}</span>
                  )}
                </div>
                <button style={{ position: 'absolute', bottom: '4px', right: '4px', width: '26px', height: '26px', background: 'var(--primary)', border: '2px solid white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                  <Camera size={12} color="white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
                {imageError && <div style={{ marginTop: '8px', color: 'var(--danger)', fontSize: '0.8rem' }}>{imageError}</div>}
                {editing && profileImage && (
                  <button className="btn btn-outline btn-sm" style={{ marginTop: '10px' }} type="button" onClick={handleRemoveImage}>
                    Remove photo
                  </button>
                )}
              </div>
              <div style={{ paddingBottom: '4px', flex: 1, minWidth: '150px' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--gray-900)' }}>{form.name}</h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Patient · Member since 2024</p>
              </div>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              {[
                { label: 'Total Visits', value: totalApts, icon: Calendar, color: 'var(--primary)' },
                { label: 'Completed', value: completedApts, icon: Activity, color: 'var(--secondary)' },
                { label: 'Prescriptions', value: PRESCRIPTIONS.length, icon: FileText, color: 'var(--purple)' },
                { label: 'Years Active', value: 2, icon: Clock, color: 'var(--accent)' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                  <s.icon size={20} color={s.color} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gray-900)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
          {[
            { value: 'overview', label: 'Overview' },
            { value: 'medical', label: 'Medical Info' },
            { value: 'security', label: 'Security' },
            { value: 'notifications', label: 'Notification Settings' },
          ].map(t => (
            <button key={t.value} className={`tab${activeTab === t.value ? ' active' : ''}`} onClick={() => setActiveTab(t.value)} style={{ flexShrink: 0 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="animate-fadeIn profile-overview-grid">
            <div className="card profile-card" style={{ padding: '20px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="var(--primary)" /> Personal Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Full Name', field: 'name', icon: User },
                  { label: 'Email', field: 'email', icon: Mail, type: 'email' },
                  { label: 'Phone', field: 'phone', icon: Phone, type: 'tel' },
                  { label: 'Date of Birth', field: 'dob', icon: Calendar, type: 'date' },
                  { label: 'Address', field: 'address', icon: null },
                ].map(item => (
                  <div key={item.field} className="form-group">
                    <label className="form-label">{item.label}</label>
                    {editing ? (
                      <input type={item.type || 'text'} className="form-input" value={form[item.field]} onChange={e => setForm({ ...form, [item.field]: e.target.value })} />
                    ) : (
                      <div style={{ padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '0.875rem', color: 'var(--gray-700)', border: '1px solid var(--gray-200)' }}>
                        {form[item.field] || '—'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card profile-card" style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--danger)" /> Health Summary
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Blood Group', field: 'bloodGroup', icon: '🩸' },
                    { label: 'Gender', field: 'gender', icon: '👤' },
                    { label: 'Weight', field: 'weight', icon: '⚖️' },
                    { label: 'Height', field: 'height', icon: '📏' },
                  ].map(item => (
                    <div key={item.field} style={{ padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{item.icon}</div>
                      {editing ? (
                        <input type="text" className="form-input" value={form[item.field]} onChange={e => setForm({ ...form, [item.field]: e.target.value })} style={{ textAlign: 'center', padding: '4px 8px', fontSize: '0.8rem' }} />
                      ) : (
                        <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.9rem' }}>{form[item.field]}</div>
                      )}
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '2px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card profile-card" style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '14px', color: 'var(--gray-900)' }}>Medical Conditions</h3>
                {editing ? (
                  <textarea className="form-textarea" value={form.conditions} onChange={e => setForm({ ...form, conditions: e.target.value })} style={{ minHeight: '80px' }} />
                ) : (
                  <div style={{ padding: '12px', background: 'var(--warning-light)', borderRadius: 'var(--radius)', fontSize: '0.875rem', color: '#92400e', border: '1px solid #fcd34d' }}>
                    {form.conditions || 'No conditions recorded'}
                  </div>
                )}
                <div style={{ marginTop: '14px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '0.875rem', color: 'var(--gray-700)' }}>Emergency Contact</h4>
                  {editing ? (
                    <input type="tel" className="form-input" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                  ) : (
                    <div style={{ padding: '10px 14px', background: 'var(--danger-light)', borderRadius: 'var(--radius)', fontSize: '0.875rem', color: '#b91c1c', fontWeight: 600, border: '1px solid #fca5a5' }}>
                      🚨 {form.emergencyContact}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical tab */}
        {activeTab === 'medical' && (
          <div className="animate-fadeIn">
            <div className="card profile-card" style={{ padding: '20px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>Medical History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {APPOINTMENTS.filter(a => a.status === 'completed').map(apt => (
                  <div key={apt.id} style={{ display: 'flex', gap: '14px', padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', flexWrap: 'wrap' }}>
                    <div className="avatar avatar-md">{apt.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{apt.doctorName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{apt.doctorSpecialty} · {apt.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '4px' }}>{apt.reason}</div>
                    </div>
                    <span className="badge badge-gray">Completed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security tab */}
        {activeTab === 'security' && (
          <div className="animate-fadeIn">
            <div className="card profile-card" style={{ padding: '20px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="var(--primary)" /> Security Settings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: 'Change Password', desc: 'Update your account password', action: 'Update', onClick: openPasswordModal },
                  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', action: twoFactorEnabled ? 'Disable' : 'Enable', onClick: handleToggleTwoFactor },
                  { title: 'Login History', desc: 'View recent login activity', action: 'View', onClick: openLoginHistory },
                  { title: 'Connected Devices', desc: 'Manage devices with access', action: 'Manage', onClick: openDeviceManager },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={item.onClick} style={{ flexShrink: 0 }}>
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings tab */}
        {activeTab === 'notifications' && (
          <div className="animate-fadeIn">
            <div className="card profile-card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>Notification Preferences</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '24px' }}>Choose how and when you want to receive alerts and notifications.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Email Section */}
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-800)', borderBottom: '1px solid var(--gray-100)', paddingBottom: '8px', marginBottom: '14px' }}>✉️ Email Notifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { key: 'emailApts', label: 'Appointment Confirmations', desc: 'Receive email alerts for confirmations, cancellations, and timing changes.' },
                      { key: 'emailRx', label: 'Prescription Updates', desc: 'Get notified as soon as a new digital prescription is issued by a practitioner.' },
                      { key: 'emailChat', label: 'Direct Messages', desc: 'Get email alerts for unread patient or doctor chat consultations.' },
                    ].map(item => (
                      <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{item.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>{item.desc}</div>
                        </div>
                        <button
                          onClick={() => setNotifSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                          style={{
                            width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: notifSettings[item.key] ? 'var(--secondary)' : 'var(--gray-300)',
                            position: 'relative', transition: 'background 0.2s', flexShrink: 0
                          }}
                        >
                          <div style={{
                            width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                            position: 'absolute', top: '3px', left: notifSettings[item.key] ? '23px' : '3px',
                            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS Section */}
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-800)', borderBottom: '1px solid var(--gray-100)', paddingBottom: '8px', marginBottom: '14px' }}>📱 SMS Notifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { key: 'smsReminders', label: 'Consultation Reminders', desc: 'Receive a text reminder on your phone 1 hour before scheduled video call sessions.' },
                      { key: 'smsSecurity', label: 'Security & Verification', desc: 'Get SMS codes for security changes and high-profile logins.' },
                    ].map(item => (
                      <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{item.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>{item.desc}</div>
                        </div>
                        <button
                          onClick={() => setNotifSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                          style={{
                            width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: notifSettings[item.key] ? 'var(--secondary)' : 'var(--gray-300)',
                            position: 'relative', transition: 'background 0.2s', flexShrink: 0
                          }}
                        >
                          <div style={{
                            width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                            position: 'absolute', top: '3px', left: notifSettings[item.key] ? '23px' : '3px',
                            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Section */}
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-800)', borderBottom: '1px solid var(--gray-100)', paddingBottom: '8px', marginBottom: '14px' }}>🔔 Push Notifications (Browser)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { key: 'pushChat', label: 'Live Consultation Chat Alerts', desc: 'Receive instant desktop browser overlays when doctors send you messages.' },
                      { key: 'pushSystem', label: 'System & Maintenance Alerts', desc: 'Receive brief updates about platform downtime or feature releases.' },
                    ].map(item => (
                      <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{item.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>{item.desc}</div>
                        </div>
                        <button
                          onClick={() => setNotifSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                          style={{
                            width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: notifSettings[item.key] ? 'var(--secondary)' : 'var(--gray-300)',
                            position: 'relative', transition: 'background 0.2s', flexShrink: 0
                          }}
                        >
                          <div style={{
                            width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                            position: 'absolute', top: '3px', left: notifSettings[item.key] ? '23px' : '3px',
                            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '28px', borderTop: '1px solid var(--gray-100)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleSaveNotifSettings}>
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {modalType === 'password' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 50 }}>
            <div style={{ width: '100%', maxWidth: '520px', background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--gray-900)' }}>Change Password</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setModalType(null)}><X size={14} /></button>
              </div>
              <div style={{ display: 'grid', gap: '14px' }}>
                <input type="password" placeholder="Current password" className="form-input" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} />
                <input type="password" placeholder="New password" className="form-input" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                <input type="password" placeholder="Confirm new password" className="form-input" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                {passwordError && <div style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{passwordError}</div>}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setModalType(null)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handlePasswordSubmit}>Save Password</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalType === 'history' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 50 }}>
            <div style={{ width: '100%', maxWidth: '520px', background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--gray-900)' }}>Recent Login Activity</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setModalType(null)}><X size={14} /></button>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {loginHistory.map(entry => (
                  <div key={entry.id} style={{ padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{entry.device}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{entry.location}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>{entry.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {modalType === 'devices' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 50 }}>
            <div style={{ width: '100%', maxWidth: '520px', background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--gray-900)' }}>Connected Devices</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setModalType(null)}><X size={14} /></button>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {devices.map(device => (
                  <div key={device.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{device.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Last used {device.lastUsed}</div>
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={() => removeDevice(device.id)}>Disconnect</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
