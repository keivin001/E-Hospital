import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, ChevronDown, Settings, User, LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NOTIF_ICON = {
  appointment: '📅', prescription: '💊',
  reminder: '⏰', message: '💬', followup: '🔄', info: 'ℹ️',
};

export default function Topbar({ title }) {
  const { user, logout, setSidebarOpen, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [isDark,       setIsDark]       = useState(
    () => document.documentElement.classList.contains('dark-mode')
  );

  const unread = (notifications || []).filter(n => !n.read).length;

  /* ── Theme toggle ── */
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark-mode');
      html.classList.add('light-mode');
      localStorage.setItem('ehospital_theme', 'light');
      setIsDark(false);
    } else {
      html.classList.remove('light-mode');
      html.classList.add('dark-mode');
      localStorage.setItem('ehospital_theme', 'dark');
      setIsDark(true);
    }
  };

  const close = () => { setShowDropdown(false); setShowNotifs(false); };

  return (
    <header className="topbar">
      {/* ── Left ── */}
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          style={{ background:'none', border:'none', color:'var(--gray-500)', padding:'6px', borderRadius:'var(--radius)', cursor:'pointer', display:'flex', alignItems:'center' }}
          aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h2 className="topbar-title">{title}</h2>
      </div>

      {/* ── Right ── */}
      <div className="topbar-actions">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'none', border: '1.5px solid var(--gray-200)',
            borderRadius: 'var(--radius)', padding: '7px',
            color: 'var(--gray-600)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="topbar-action-group">
          <button
            onClick={() => { setShowNotifs(s => !s); setShowDropdown(false); }}
            style={{
              background: 'none', border: '1.5px solid var(--gray-200)',
              borderRadius: 'var(--radius)', padding: '7px',
              color: 'var(--gray-600)', cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Notifications">
            <Bell size={17} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-5px',
                background: 'var(--danger)', color: 'white',
                fontSize: '0.6rem', fontWeight: 700,
                width: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {showNotifs && (
            <div className="topbar-dropdown" style={{ right: 0, top: '44px', width: '340px' }}>
              <div className="topbar-dropdown-header">
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)' }}>
                  Notifications
                </span>
                <div className="topbar-dropdown-actions">
                  {unread > 0 && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => markAllNotificationsRead?.()}>
                      Mark all read
                    </button>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { navigate('/notifications'); close(); }}>
                    View all
                  </button>
                </div>
              </div>
              <div className="topbar-dropdown-body">
                {(notifications || []).length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                    No notifications
                  </div>
                ) : (
                  (notifications || []).slice(0, 8).map(n => (
                    <button
                      key={n.id}
                      className="topbar-dropdown-item"
                      style={{ background: n.read ? 'var(--white)' : 'var(--primary-light)' }}
                      onClick={() => { markNotificationRead?.(n.id); navigate('/notifications'); close(); }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                        {NOTIF_ICON[n.type] || '🔔'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '2px', lineHeight: 1.4 }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                          {n.time}
                        </div>
                      </div>
                      {!n.read && (
                        <div className="status-dot status-online" style={{ flexShrink: 0, marginTop: '4px' }} />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="topbar-action-group">
          <button
            onClick={() => { setShowDropdown(s => !s); setShowNotifs(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: '1.5px solid var(--gray-200)',
              borderRadius: 'var(--radius)', padding: '6px 12px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
            <div className="avatar avatar-sm">{user?.initials || 'U'}</div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)' }}>
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={14} color="var(--gray-400)" />
          </button>

          {showDropdown && (
            <div className="topbar-dropdown" style={{ right: 0, top: '44px', width: '210px' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'capitalize', marginTop: '2px' }}>{user?.role}</div>
              </div>

              {[
                { Icon: User,     label: 'My Profile', action: () => navigate('/profile') },
                { Icon: Settings, label: 'Settings',   action: () => navigate('/profile') },
              ].map(({ Icon, label, action }) => (
                <button key={label}
                  className="topbar-dropdown-item"
                  onClick={() => { action(); close(); }}>
                  <Icon size={15} /> {label}
                </button>
              ))}

              {/* Dark mode toggle inside menu too */}
              <button className="topbar-dropdown-item" onClick={() => { toggleTheme(); close(); }}>
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>

              <div style={{ borderTop: '1px solid var(--gray-100)' }}>
                <button
                  className="topbar-dropdown-item"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => { logout(); navigate('/login'); close(); }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop to close dropdowns */}
      {(showDropdown || showNotifs) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          onClick={close}
        />
      )}
    </header>
  );
}
