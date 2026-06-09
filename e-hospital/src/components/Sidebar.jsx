import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Calendar, MessageSquare,
  Video, FileText, User, Settings, LogOut, Heart, Bell,
  ShieldCheck, Activity, X, Stethoscope, ClipboardList,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
<<<<<<< HEAD
import { PENDING_APPROVALS } from '../data/mockData';
=======
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< HEAD
<<<<<<< HEAD
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

=======
  const { user, logout, sidebarOpen, setSidebarOpen } = useApp();

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
>>>>>>> b7a4371 (feat: implement core e-hospital platform pages and navigation components)
=======
  const { user, logout, sidebarOpen, setSidebarOpen, appointments, conversations } = useApp();

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';

  // Calculate dynamic badge counts
  const getAppointmentCount = () => {
    if (!user) return 0;
    if (isAdmin) return 0;
    return appointments.filter(apt => {
      if (isDoctor) {
        return apt.doctorName.includes(user.name) && 
               (apt.status === 'confirmed' || apt.status === 'pending');
      } else {
        return apt.patientName === user.name && 
               (apt.status === 'confirmed' || apt.status === 'pending');
      }
    }).length;
  };

  const getChatUnreadCount = () => {
    if (!user) return 0;
    if (isAdmin) return 0;
    return conversations
      .filter(conv => !conv.muted && !conv.blocked)
      .reduce((sum, conv) => sum + (conv.unread || 0), 0);
  };

  const getNotificationCount = () => {
    // In a real app, this would come from notifications state
    // For now, returning static for demo
    if (isAdmin) return 0;
    if (isDoctor) return 1;
    return 3;
  };

  const appointmentCount = getAppointmentCount();
  const chatUnreadCount = getChatUnreadCount();
  const notificationCount = getNotificationCount();

  // Navigation items with dynamic badges
  const patientNav = [
    {
      label: 'Overview', items: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/doctors', icon: Users, label: 'Find Doctors' },
        { path: '/hospitals', icon: Building2, label: 'Hospitals' },
      ]
    },
    {
      label: 'Healthcare', items: [
        { path: '/appointments', icon: Calendar, label: 'Appointments', badge: appointmentCount || null },
        { path: '/chat', icon: MessageSquare, label: 'Consultation Chat', badge: chatUnreadCount || null },
        { path: '/video', icon: Video, label: 'Video Call' },
        { path: '/prescriptions', icon: FileText, label: 'Prescriptions' },
      ]
    },
    {
      label: 'Account', items: [
        { path: '/profile', icon: User, label: 'My Profile' },
        { path: '/notifications', icon: Bell, label: 'Notifications', badge: notificationCount || null },
      ]
    },
  ];

  const doctorNav = [
    {
      label: 'Overview', items: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      label: 'Practice', items: [
        { path: '/appointments', icon: Calendar, label: 'Appointments', badge: appointmentCount || null },
        { path: '/chat', icon: MessageSquare, label: 'Patient Chat', badge: chatUnreadCount || null },
        { path: '/video', icon: Video, label: 'Video Consultation' },
        { path: '/prescriptions', icon: ClipboardList, label: 'Prescriptions' },
      ]
    },
    {
      label: 'Account', items: [
        { path: '/profile', icon: User, label: 'My Profile' },
        { path: '/notifications', icon: Bell, label: 'Notifications', badge: notificationCount || null },
      ]
    },
  ];

  const adminNav = [
    {
      label: 'Management', items: [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/doctors', icon: Users, label: 'Doctors' },
        { path: '/admin/hospitals', icon: Building2, label: 'Hospitals' },
        { path: '/admin/patients', icon: Heart, label: 'Patients' },
        { path: '/admin/approvals', icon: ShieldCheck, label: 'Approvals', badge: 3 },
      ]
    },
    {
      label: 'Analytics & Config', items: [
        { path: '/admin/analytics', icon: Activity, label: 'Analytics' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    },
  ];

>>>>>>> ccd1a4e (update)
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
            <Heart size={20} />
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
            <X size={18} />
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
                const Icon = item.icon;
                // For /admin exact, only match exactly. For sub-routes, match exactly too.
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    className={`sidebar-item${active ? ' active' : ''}`}
                    onClick={() => handleNav(item.path)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="sidebar-item-badge">{item.badge}</span>
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
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
