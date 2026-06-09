import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  DOCTORS, HOSPITALS, PATIENTS,
  APPOINTMENTS, NOTIFICATIONS,
} from '../data/mockData';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

/* ── localStorage helpers ─────────────────────── */
function getStored(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch { return fallback; }
}

function getStoredUser() {
  try { const s = localStorage.getItem('ehospital_user'); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

/* ── Chat builders ────────────────────────────── */
function buildConversations(doctors) {
  return doctors.slice(0, 4).map((doc, i) => ({
    id: doc.id, name: doc.name, specialty: doc.specialty,
    initials: doc.initials, online: doc.online,
    lastMessage: i === 0 ? 'Thank you, Doctor. I will.'
               : i === 1 ? 'Please take the medication as prescribed.'
               : 'Your test results look normal.',
    lastTime: i === 0 ? 'Just now' : i === 1 ? 'Yesterday' : '2 days ago',
    unread: i === 0 ? 1 : 0, muted: false, blocked: false,
  }));
}

function buildInitialMessages(doctors) {
  const msgs = {};
  const doc = doctors[0];
  if (!doc) return msgs;
  msgs[doc.id] = [
    { id: 'm1', sender: 'doctor',  name: doc.name,       text: 'Hello Eric, how are you feeling today?',                                                      time: '10:02 AM', read: true  },
    { id: 'm2', sender: 'patient', name: 'Eric Johnson', text: 'Hi Doctor, I still have a slight fever and headache.',                                       time: '10:04 AM', read: true  },
    { id: 'm3', sender: 'doctor',  name: doc.name,       text: 'I see. Have you been taking the Paracetamol as prescribed?',                                 time: '10:05 AM', read: true  },
    { id: 'm4', sender: 'patient', name: 'Eric Johnson', text: 'Yes, 3 times a day after meals. But the headache is still there.',                           time: '10:07 AM', read: true  },
    { id: 'm5', sender: 'doctor',  name: doc.name,       text: "That's normal for the first 2 days. Keep hydrated and rest. If it worsens, let me know.",    time: '10:08 AM', read: true  },
    { id: 'm6', sender: 'patient', name: 'Eric Johnson', text: 'Thank you, Doctor. I will.',                                                                  time: '10:10 AM', read: false },
  ];
  return msgs;
}

/* ── Provider ─────────────────────────────────── */
export function AppProvider({ children }) {
  const [user,          setUser]          = useState(getStoredUser);
  const [toasts,        setToasts]        = useState([]);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  /* Core data — all with localStorage persistence */
  const [appointments,  setAppointments]  = useState(() => getStored('ehospital_appointments',  APPOINTMENTS));
  const [notifications, setNotifications] = useState(() => getStored('ehospital_notifications', NOTIFICATIONS || []));
  const [doctors,       setDoctors]       = useState(() => getStored('ehospital_doctors',       DOCTORS));
  const [hospitals,     setHospitals]     = useState(() => getStored('ehospital_hospitals',     HOSPITALS));
  const [patients,      setPatients]      = useState(() => getStored('ehospital_patients',      PATIENTS));
  const [conversations, setConversations] = useState(() => getStored('ehospital_conversations', buildConversations(DOCTORS)));
  const [messagesByConv,setMessagesByConv]= useState(() => getStored('ehospital_messages_by_conv', buildInitialMessages(DOCTORS)));

  /* Sync to localStorage */
  useEffect(() => { try { localStorage.setItem('ehospital_appointments',      JSON.stringify(appointments));   } catch {} }, [appointments]);
  useEffect(() => { try { localStorage.setItem('ehospital_notifications',     JSON.stringify(notifications));  } catch {} }, [notifications]);
  useEffect(() => { try { localStorage.setItem('ehospital_doctors',           JSON.stringify(doctors));        } catch {} }, [doctors]);
  useEffect(() => { try { localStorage.setItem('ehospital_hospitals',         JSON.stringify(hospitals));      } catch {} }, [hospitals]);
  useEffect(() => { try { localStorage.setItem('ehospital_patients',          JSON.stringify(patients));       } catch {} }, [patients]);
  useEffect(() => { try { localStorage.setItem('ehospital_conversations',     JSON.stringify(conversations));  } catch {} }, [conversations]);
  useEffect(() => { try { localStorage.setItem('ehospital_messages_by_conv',  JSON.stringify(messagesByConv)); } catch {} }, [messagesByConv]);

  /* Auth */
  const login = useCallback((userData) => {
    setUser(userData);
    try { localStorage.setItem('ehospital_user', JSON.stringify(userData)); } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ehospital_user');
  }, []);

  /* Toasts */
  const addToast = useCallback((message, type = 'default') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  /* Notification helpers */
  const addNotification = useCallback((notif) => {
    const newN = { id: `n${Date.now()}`, read: false, time: 'Just now', type: 'info', ...notif };
    setNotifications(p => [newN, ...p]);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(p => p.filter(n => n.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      /* auth */
      user, login, logout,
      /* ui */
      toasts, addToast, removeToast,
      sidebarOpen, setSidebarOpen,
      /* data */
      appointments,   setAppointments,
      notifications,  setNotifications,
      doctors,        setDoctors,
      hospitals,      setHospitals,
      patients,       setPatients,
      conversations,  setConversations,
      messagesByConv, setMessagesByConv,
      /* notification helpers */
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}
