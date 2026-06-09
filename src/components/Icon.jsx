import React from 'react';

const map = {
  bell: '🔔', menu: '☰', chevrondown: '▾', settings: '⚙️', user: '👤', logout: '↩️',
  check: '✅', x: '❌', warning: '⚠️', info: 'ℹ️',
  layout: '📊', users: '👥', building: '🏥', calendar: '📅', message: '💬',
  video: '🎥', file: '📄', heart: '❤️', shield: '🛡️', activity: '📈', clipboard: '📋',
  search: '🔍', phone: '📞', map: '📍', star: '⭐', clock: '⏰', plus: '+',
};

export default function Icon({ name, size = 16, ariaLabel }) {
  const key = (name || '').toLowerCase();
  const glyph = map[key] || '◻️';
  const fontSize = typeof size === 'number' ? `${Math.max(12, size)}px` : size;
  return (
    <span role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel} style={{ fontSize, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}>
      {glyph}
    </span>
  );
}
