import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from './Toast';

export default function Layout({ children, title, fullScreen = false }) {
  return (
    <div className="app-layout">
      {!fullScreen && <Sidebar />}
      <div className="main-content" style={fullScreen ? { marginLeft: 0 } : {}}>
        {!fullScreen && <Topbar title={title} />}
        <main className="page-content animate-fadeIn" style={fullScreen ? { padding: 0 } : {}}>
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
}
