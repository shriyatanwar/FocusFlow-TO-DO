import React from 'react';
import useStore from '../../store/useStore';
import Button from '../common/Button';
import './Header.css';

/**
 * Header Component
 * Shows on mobile/tablet to toggle sidebar and display quick actions
 */
const Header = ({ onMenuClick }) => {
  const { undo, redo, history, historyIndex } = useStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <header className="app-header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        ☰
      </button>

      <div className="header-title">
        <span className="logo-icon">🎯</span>
        <h1>FocusFlow</h1>
      </div>

      <div className="header-actions">
        <Button
          variant="ghost"
          size="small"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </Button>
      </div>
    </header>
  );
};

export default Header;
