import Icon from './Icon';
import { useApp } from '../context/AppContext';

const icons = {
  success: <Icon name="check" size={18} ariaLabel="success" />,
  error: <Icon name="x" size={18} ariaLabel="error" />,
  warning: <Icon name="warning" size={18} ariaLabel="warning" />,
  default: <Icon name="info" size={18} ariaLabel="info" />,
};

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {icons[t.type] || icons.default}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '2px' }}
          >
            <Icon name="x" size={14} ariaLabel="close" />
          </button>
        </div>
      ))}
    </div>
  );
}
