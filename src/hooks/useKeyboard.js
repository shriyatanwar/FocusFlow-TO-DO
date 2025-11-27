import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param {object} shortcuts - Object mapping keys to handler functions
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
const useKeyboard = (shortcuts, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Ignore if user is typing in an input or textarea
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const isCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;

      // Check for Ctrl+key combinations
      if (isCtrl && shortcuts[`ctrl+${key}`]) {
        event.preventDefault();
        shortcuts[`ctrl+${key}`]();
        return;
      }

      // Check for Shift+key combinations
      if (isShift && shortcuts[`shift+${key}`]) {
        event.preventDefault();
        shortcuts[`shift+${key}`]();
        return;
      }

      // Check for single key shortcuts
      if (shortcuts[key] && !isCtrl && !isShift) {
        event.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
};

export default useKeyboard;
