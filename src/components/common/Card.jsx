import React from 'react';
import './Card.css';

/**
 * Reusable Card component
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
const Card = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
