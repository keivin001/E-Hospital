import { useState } from 'react';
import { Bell, Calendar, FileText, Clock, MessageSquare, RefreshCw, CheckCheck, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

const typeConfig = {
  appointment: { icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-light)', label: 'Appointment' },
  prescription: { icon: FileText, color: 'var(--secondary)', bg: 'var(--success-light)', label: 'Prescription' },
  reminder: { icon: Clock, color: 'var(--accent)', bg: 'var(--warning-light)', label: 'Reminder' },
  message: { icon: MessageSquare, color: 'var(--purple)', bg: 'var(--purple-light)', label: 'Message' },
  followup: { icon: RefreshCw, color: 'var(--primary)', bg: 'var(--primary-light)', label: 'Follow-up' },
};

export default function Notifications() {
  const { addToast, notifications, markNotificationRead, markNotificationUnread, markAllNotificationsRead, deleteNotification } = useApp();
  const [filter, setFilter] = useState('all');

  const markAllRead = () => {
    markAllNotificationsRead();
    addToast('All notifications marked as read', 'success');
  };

  const markRead = (id) => {
    markNotificationRead(id);
  };

  const toggleRead = (id, read) => {
    if (read) {
      markNotificationUnread(id);
      addToast('Notification marked unread', 'default');
    } else {
      markNotificationRead(id);
      addToast('Notification marked read', 'success');
    }
  };

  const deleteNotif = (id) => {
    deleteNotification(id);
    addToast('Notification deleted', 'warning');
  };

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout title="Notifications">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>All Notifications</h2>
            {unreadCount > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'unread', label: `Unread (${unreadCount})` },
            { value: 'appointment', label: 'Appointments' },
            { value: 'prescription', label: 'Prescriptions' },
            { value: 'reminder', label: 'Reminders' },
            { value: 'message', label: 'Messages' },
            { value: 'followup', label: 'Follow-ups' },
          ].map(f => (
            <button key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                border: `1.5px solid ${filter === f.value ? 'var(--primary)' : 'var(--gray-200)'}`,
                background: filter === f.value ? 'var(--primary)' : 'white',
                color: filter === f.value ? 'white' : 'var(--gray-600)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(notif => {
            const config = typeConfig[notif.type] || typeConfig.appointment;
            const Icon = config.icon;
            return (
              <div key={notif.id}
                className="card"
                style={{
                  padding: '16px 20px',
                  background: notif.read ? 'white' : 'var(--primary-light)',
                  border: notif.read ? '1px solid var(--gray-200)' : '1px solid #bae6fd',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onClick={() => markRead(notif.id)}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', background: config.bg, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={config.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: notif.read ? 600 : 700, fontSize: '0.9rem', color: 'var(--gray-900)', marginBottom: '3px' }}>{notif.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{notif.message}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                        {!notif.read && <div className="status-dot status-online" />}
                        <button
                          onClick={e => { e.stopPropagation(); toggleRead(notif.id, notif.read); }}
                          style={{ background: 'none', border: '1px solid var(--gray-200)', cursor: 'pointer', color: notif.read ? 'var(--gray-600)' : 'var(--primary)', padding: '6px 10px', borderRadius: 'var(--radius)', fontSize: '0.75rem' }}
                        >
                          {notif.read ? 'Mark unread' : 'Mark read'}
                        </button>
                        <button onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-300)', padding: '4px', borderRadius: 'var(--radius-sm)', transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-300)'}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span className={`badge badge-${notif.type === 'appointment' ? 'primary' : notif.type === 'prescription' ? 'success' : notif.type === 'reminder' ? 'warning' : 'purple'}`} style={{ fontSize: '0.65rem' }}>
                        {config.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{notif.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-400)' }}>
            <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3 style={{ fontWeight: 700, color: 'var(--gray-600)', marginBottom: '8px' }}>No notifications</h3>
            <p style={{ fontSize: '0.875rem' }}>You're all caught up!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
