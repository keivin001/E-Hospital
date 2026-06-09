import React from "react";

// Simple reusable button component used in VideoCall page.
// Props:
// - icon: optional React element (e.g., from lucide-react)
// - onClick: click handler
// - className: additional CSS classes
// - children: button label
export default function ControlButton({ icon, onClick, className = "", children }) {
  return (
    <button
      className={`${"btn btn-primary btn-sm"} ${className}`}
      onClick={onClick}
    >
      {icon && <span style={{ marginRight: "4px", verticalAlign: "middle" }}>{icon}</span>}
      {children}
    </button>
  );
}
