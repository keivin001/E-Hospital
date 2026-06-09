import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          maxWidth: '90%',
          width: '400px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        {title && <h3 style={{ marginTop: 0, marginBottom: '16px' }}>{title}</h3>}
        {children}
      </div>
    </div>,
    document.body
  );
}
