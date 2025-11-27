import React from 'react';
import './Button.css';

/**
 * Reusable Button component
 * @param {string} variant - Button variant (primary, secondary, danger, ghost)
 * @param {string} size - Button size (small, medium, large)
 * @param {boolean} disabled - Disabled state
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
