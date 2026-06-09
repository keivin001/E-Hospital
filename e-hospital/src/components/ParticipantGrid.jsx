import React from 'react';

// participants: array of {id, name, initials, videoPlaceholder?}
export default function ParticipantGrid({ participants, onSelect, selectedId }) {
  return (
    <div
      className="participant-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '8px',
        padding: '8px',
        background: 'rgba(var(--gray-100-rgb), 0.6)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {participants.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          style={{
            border: p.id === selectedId ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
            borderRadius: 'var(--radius)',
            background: 'var(--gray-50)',
            padding: '8px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
          aria-label={`Switch to ${p.name}`}
        >
          <div
            className="avatar avatar-sm"
            style={{
              margin: '0 auto 4px',
              background: 'rgba(255,255,255,0.2)',
              color: 'var(--gray-800)',
              width: '48px',
              height: '48px',
              fontSize: '1.2rem',
              lineHeight: '48px',
              borderRadius: '50%',
            }}
          >
            {p.initials}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-700)' }}>{p.name}</div>
        </button>
      ))}
    </div>
  );
}
