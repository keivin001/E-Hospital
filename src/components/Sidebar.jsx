import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import {
  RiDashboardLine, RiGroupLine, RiBuildingLine, RiCalendarLine, RiMessage2Line,
  RiVideoLine, RiFileTextLine, RiUserLine, RiSettings3Line, RiHeartLine,
  RiShieldCheckLine, RiBarChart2Line, RiFileList3Line, RiHospitalLine, RiNotificationLine,
} from 'react-icons/ri';
import { useApp } from '../context/AppContext';
import { PENDING_APPROVALS } from '../data/mockData';

// Nav groups are built dynamically inside the component so badges reflect live data

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, sidebarOpen, setSidebarOpen, notifications, appointments, conversations } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Compute dynamic badges
  const appointmentCount = appointments.filter(a => {
    if (isDoctor) {
      return a.doctorName === user?.name && (a.status === 'confirmed' || a.status === 'pending');
    } else {
      return a.patientName === user?.name && (a.status === 'confirmed' || a.status === 'pending');
    }
  }).length;
  const chatUnread = conversations.reduce((acc, conv) => acc + (conv.unread || 0), 0);
  const pendingApprovalsCount = PENDING_APPROVALS.length;

  const patientNav = [
    { label: 'Overview', items: [
      { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
      { path: '/doctors', icon: RiGroupLine, label: 'Find Doctors' },
      { path: '/hospitals', icon: RiBuildingLine, label: 'Hospitals' },
    ]},
    { label: 'Healthcare', items: [
      { path: '/appointments', icon: RiCalendarLine, label: 'Appointments', badge: appointmentCount },
      { path: '/chat', icon: RiMessage2Line, label: 'Consultation Chat', badge: chatUnread },
      { path: '/video', icon: RiVideoLine, label: 'Video Call' },
      { path: '/prescriptions', icon: RiFileTextLine, label: 'Prescriptions' },
    ]},
    { label: 'Account', items: [
      { path: '/profile', icon: RiUserLine, label: 'My Profile' },
      { path: '/notifications', icon: RiNotificationLine, label: 'Notifications' },
    ]},
  ];

  const doctorNav = [
    { label: 'Overview', items: [
      { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    ]},
    { label: 'Practice', items: [
      { path: '/appointments', icon: RiCalendarLine, label: 'Appointments', badge: appointmentCount },
      { path: '/chat', icon: RiMessage2Line, label: 'Patient Chat', badge: chatUnread },
      { path: '/video', icon: RiVideoLine, label: 'Video Consultation' },
      { path: '/prescriptions', icon: RiFileList3Line, label: 'Prescriptions' },
    ]},
    { label: 'Account', items: [
      { path: '/profile', icon: RiUserLine, label: 'My Profile' },
      { path: '/notifications', icon: RiNotificationLine, label: 'Notifications' },
    ]},
  ];

  const adminNav = [
    { label: 'Management', items: [
      { path: '/admin', icon: RiDashboardLine, label: 'Dashboard' },
      { path: '/admin/doctors', icon: RiGroupLine, label: 'Doctors' },
      { path: '/admin/hospitals', icon: RiBuildingLine, label: 'Hospitals' },
      { path: '/admin/patients', icon: RiHeartLine, label: 'Patients' },
      { path: '/admin/approvals', icon: RiShieldCheckLine, label: 'Approvals', badge: pendingApprovalsCount },
    ]},
    { label: 'Analytics & Config', items: [
      { path: '/admin/analytics', icon: RiBarChart2Line, label: 'Analytics' },
      { path: '/admin/settings', icon: RiSettings3Line, label: 'Settings' },
    ]},
  ];

  const navGroups = isAdmin ? adminNav : isDoctor ? doctorNav : patientNav;

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <RiHospitalLine size={20} />
          </div>
          <div>
            <div className="sidebar-logo-text">E-<span>Hospital</span></div>
            <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginTop: '-2px' }}>Digital Healthcare</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--gray-500)', padding: '4px', cursor: 'pointer' }}
            className="mobile-close-btn"
            aria-label="Close menu"
          >
            <Icon name="x" size={18} ariaLabel="close menu" />
          </button>
        </div>

        {/* User info */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar avatar-md" style={{
              background: isAdmin ? 'var(--purple-light)' : isDoctor ? 'var(--success-light)' : 'var(--primary-light)',
              color: isAdmin ? 'var(--purple)' : isDoctor ? 'var(--secondary-dark)' : 'var(--primary)',
            }}>
              {user?.initials || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Guest User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'capitalize' }}>
                {user?.role || 'patient'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="sidebar-section-title">{group.label}</div>
              {group.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    className={`sidebar-item${active ? ' active' : ''}`}
                    onClick={() => handleNav(item.path)}
                  >
                    {typeof item.icon === 'function' ? <item.icon size={18} /> : <Icon name={item.icon} size={18} ariaLabel={item.label} />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="sidebar-item-badge">{item.badge}</span>
                    )}
                    {item.path === '/notifications' && !item.badge && unreadNotifications > 0 && (
                      <span className="sidebar-item-badge">{unreadNotifications}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
            <button
            className="sidebar-item"
            onClick={logout}
            style={{ color: 'var(--danger)', width: '100%' }}
          >
            <Icon name="logout" size={18} ariaLabel="Sign Out" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
 
