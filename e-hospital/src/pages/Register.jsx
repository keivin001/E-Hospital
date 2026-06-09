import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Upload, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import api, { backendEnabled } from '../api';

const ROLES = [
  { value: 'patient', label: 'Patient', icon: '🧑‍⚕️', desc: 'Seek medical consultations and appointments' },
  { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️', desc: 'Provide online consultations and care' },
  { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️', desc: 'Support patient care and follow-ups' },
];

const SPECIALTIES = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine', 'Gynecology', 'ENT', 'Psychiatry', 'Oncology'];
const HOSPITALS = ['City General Hospital', 'Sunrise Medical Center', 'Children\'s Health Institute', 'NeuroHealth Clinic', 'BoneJoint Medical Center'];

export default function Register() {
  const navigate = useNavigate();
  const { login, addToast } = useApp();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    dob: '', gender: '', bloodGroup: '', conditions: '', emergencyContact: '',
    specialty: '', hospital: '', licenseNumber: '', experience: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone) e.phone = 'Required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleNext = () => {
    if (step === 1) {
      const e = validateStep1();
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    setLoading(true);
<<<<<<< HEAD
    
    try {
      if (backendEnabled()) {
        const age = form.dob ? Math.max(0, new Date().getFullYear() - new Date(form.dob).getFullYear()) : undefined;
        const payload = {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
          role,
          phone: form.phone,
          age,
          gender: form.gender,
          bloodType: form.bloodGroup,
          medicalHistory: form.conditions ? [form.conditions] : [],
          allergies: [],
          chronicConditions: [],
          primaryDoctorId: null,
          specialty: form.specialty,
          hospitalId: form.hospital,
          experience: form.experience ? Number(form.experience) : undefined,
          about: form.conditions || '',
        };

        const response = await api.post('/auth/register', payload);
        login(response.data.user, response.data.token, response.data.profile);
        addToast('Account created successfully! Welcome to E-Hospital.', 'success');
        navigate('/dashboard');
        return;
      }

      // Simulate API call for local demo mode
      await new Promise(resolve => setTimeout(resolve, 1500));
      
=======
    setTimeout(() => {
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
      const userData = {
        name: `${form.firstName} ${form.lastName}`,
        initials: `${form.firstName[0]}${form.lastName[0]}`.toUpperCase(),
        email: form.email,
        role,
      };
      login(userData);
      addToast('Account created successfully! Welcome to E-Hospital.', 'success');
<<<<<<< HEAD
      navigate('/dashboard');
    } catch (error) {
      addToast(error?.response?.data?.message || 'An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
=======
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }, 1000);
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
  };

  const inputProps = (field, placeholder, type = 'text') => ({
    type,
    className: 'form-input',
    placeholder,
    value: form[field],
    onChange: e => { update(field, e.target.value); setErrors(err => ({ ...err, [field]: '' })); },
    style: errors[field] ? { borderColor: 'var(--danger)' } : {},
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Heart size={22} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gray-900)' }}>E-Hospital</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ color: 'var(--gray-500)' }}>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link></p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 3 ? 1 : 'none' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step > s ? 'var(--secondary)' : step === s ? 'var(--primary)' : 'var(--gray-200)',
                color: step >= s ? 'white' : 'var(--gray-500)', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                transition: 'all 0.3s',
              }}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && <div style={{ flex: 1, height: '2px', background: step > s ? 'var(--secondary)' : 'var(--gray-200)', margin: '0 8px', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>
          <span style={{ color: step >= 1 ? 'var(--primary)' : undefined }}>Account Type</span>
          <span style={{ color: step >= 2 ? 'var(--primary)' : undefined }}>Personal Info</span>
          <span style={{ color: step >= 3 ? 'var(--primary)' : undefined }}>Medical Profile</span>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {/* Step 1: Role selection */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)' }}>I am a...</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setRole(r.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                      border: `2px solid ${role === r.value ? 'var(--primary)' : 'var(--gray-200)'}`,
                      borderRadius: 'var(--radius-lg)', background: role === r.value ? 'var(--primary-light)' : 'white',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                    }}>
                    <span style={{ fontSize: '1.8rem' }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{r.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>{r.desc}</div>
                    </div>
                    {role === r.value && <CheckCircle size={20} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleNext}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2: Personal info */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input {...inputProps('firstName', 'John')} />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input {...inputProps('lastName', 'Doe')} />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input {...inputProps('email', 'you@example.com', 'email')} />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input {...inputProps('phone', '+1 (555) 000-0000', 'tel')} />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input {...inputProps('password', 'Min 6 characters', showPass ? 'text' : 'password')} style={{ paddingRight: '40px', ...(errors.password ? { borderColor: 'var(--danger)' } : {}) }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <span className="form-error">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input {...inputProps('confirmPassword', 'Repeat password', 'password')} />
                  {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
                <button className="btn btn-primary" onClick={handleNext} style={{ flex: 2 }}>Continue <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* Step 3: Medical profile */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)' }}>
                {role === 'patient' ? 'Medical Profile' : 'Professional Details'}
              </h3>

              {role === 'patient' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-input" value={form.dob} onChange={e => update('dob', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                        <option value="">Select</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                      <option value="">Select blood group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Existing Medical Conditions</label>
                    <textarea className="form-textarea" placeholder="e.g., Diabetes, Hypertension, Asthma..." value={form.conditions} onChange={e => update('conditions', e.target.value)} style={{ minHeight: '80px' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emergency Contact</label>
                    <input type="tel" className="form-input" placeholder="+1 (555) 000-0000" value={form.emergencyContact} onChange={e => update('emergencyContact', e.target.value)} />
                  </div>
                </div>
              )}

              {(role === 'doctor' || role === 'nurse') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {role === 'doctor' && (
                    <div className="form-group">
                      <label className="form-label">Specialty</label>
                      <select className="form-select" value={form.specialty} onChange={e => update('specialty', e.target.value)}>
                        <option value="">Select specialty</option>
                        {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Hospital Affiliation</label>
                    <select className="form-select" value={form.hospital} onChange={e => update('hospital', e.target.value)}>
                      <option value="">Select hospital</option>
                      {HOSPITALS.map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">License Number</label>
                    <input type="text" className="form-input" placeholder="e.g., MD-2024-001234" value={form.licenseNumber} onChange={e => update('licenseNumber', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input type="number" className="form-input" placeholder="e.g., 8" value={form.experience} onChange={e => update('experience', e.target.value)} />
                  </div>
                  <div style={{ background: 'var(--warning-light)', border: '1px solid #fcd34d', borderRadius: 'var(--radius)', padding: '12px 16px', fontSize: '0.875rem', color: '#92400e' }}>
                    📋 Your credentials will be reviewed by our admin team within 24–48 hours before activation.
                  </div>
                  <div style={{ border: '2px dashed var(--gray-300)', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-300)'}>
                    <Upload size={24} color="var(--gray-400)" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: '0.875rem' }}>Upload Credentials</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>PDF, JPG, PNG up to 10MB</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
