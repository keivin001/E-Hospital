import React from 'react';
import { Clock } from 'lucide-react';
import './CallStatus.css';

export default function CallStatus({ status, duration }) {
  const getText = () => {
    switch (status) {
      case 'calling':
        return 'Calling';
      case 'connecting':
        return 'Connecting';
      case 'connected':
        return `In Call • ${duration}`;
      case 'disconnecting':
        return 'Ending...';
      default:
        return '';
    }
  };

  if (status === 'idle') return null;
  const text = getText();
  return (
    <div className="call-status text-center text-sm font-medium mt-2 animate-pulse">
      {text}
      <span className="dots" style={{ display: 'inline-block', marginLeft: '4px' }}></span>
    </div>
  );
}
