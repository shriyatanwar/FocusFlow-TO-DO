import React from 'react';
import { NavLink } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import './Sidebar.css';

/**
 * Sidebar Navigation Component
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { toggleTheme, isDark } = useTheme();

  const navItems = [
    { path: '/today', icon: '📅', label: 'Today', shortcut: '4' },
    { path: '/', icon: '📝', label: 'All Tasks', shortcut: '1' },
    { path: '/kanban', icon: '📊', label: 'Kanban', shortcut: '2' },
    { path: '/calendar', icon: '📆', label: 'Calendar', shortcut: '3' },
    { path: '/analytics', icon: '📈', label: 'Analytics', shortcut: '5' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <h1 className="logo-text">FocusFlow</h1>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.shortcut && <span className="nav-shortcut">{item.shortcut}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          <div className="keyboard-hints">
            <p className="hint-title">Keyboard Shortcuts</p>
            <div className="hint-item">
              <span>N</span> New Task
            </div>
            <div className="hint-item">
              <span>/</span> Search
            </div>
            <div className="hint-item">
              <span>Ctrl+Z</span> Undo
            </div>
            <div className="hint-item">
              <span>Ctrl+Y</span> Redo
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
