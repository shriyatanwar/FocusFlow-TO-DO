import React from 'react';
import './Badge.css';

/**
 * Reusable Badge component for tags, priorities, etc.
 * @param {string} variant - Badge variant (priority-low, priority-medium, priority-high, tag, status)
 * @param {ReactNode} children - Badge content
 * @param {function} onRemove - Remove handler (shows X button)
 */
const Badge = ({ variant = 'default', children, onRemove, className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
      {onRemove && (
        <button className="badge-remove" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      )}
    </span>
  );
};

export default Badge;
