import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Toast from './components/Toast';

import CallHistory from './pages/CallHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Appointments from './pages/Appointments';
import Chat from './pages/Chat';
import VideoCall from './pages/VideoCall';
import Prescriptions from './pages/Prescriptions';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';

// Protected route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// Admin route wrapper
function AdminRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Patient/Doctor routes */}
      <Route path="/call-history" element={<ProtectedRoute><CallHistory /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
      <Route path="/hospitals" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/video" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/doctors" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/hospitals" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/patients" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/approvals" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><Admin /></AdminRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
