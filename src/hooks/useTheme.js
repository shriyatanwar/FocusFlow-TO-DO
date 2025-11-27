import { useEffect } from 'react';
import useStore from '../store/useStore';

/**
 * Custom hook for managing theme
 * Applies theme class to document root element
 */
const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useStore();

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);

    // Add or remove dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };
};

export default useTheme;
