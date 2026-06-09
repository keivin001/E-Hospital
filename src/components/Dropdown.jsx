import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ buttonLabel = '⋮', children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen(!open);

  // close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', overflow: 'hidden' }}>
      <button
        onClick={toggle}
        className="btn btn-ghost"
        style={{ padding: '6px', borderRadius: '8px', background: 'var(--gray-100)', border: 'none' }}
        aria-haspopup="true"
        aria-expanded={open}
        title="More options"
      >
        {buttonLabel}
      </button>
      {open && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            background: 'white',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            minWidth: '160px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            padding: '8px 0',
            // Apply subtle hover/active styles via CSS class
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
