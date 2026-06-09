import React from 'react';

export default function Button({children, className = '', variant = 'primary', size = 'md', ...props}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || '';
  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size] || '';
  const classes = `btn ${variantClass} ${sizeClass} ${className}`.trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
