import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ListView from './views/ListView';
import KanbanView from './views/KanbanView';
import CalendarView from './views/CalendarView';
import TodayView from './views/TodayView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import useStore from './store/useStore';
import useTheme from './hooks/useTheme';
import useKeyboard from './hooks/useKeyboard';
import './App.css';

/**
 * Main App Component with Routing and Keyboard Shortcuts
 */
function AppContent() {
  const navigate = useNavigate();
  const { initializeTasks, undo, redo, toggleTheme } = useStore();

  // Initialize tasks from localStorage on mount
  useEffect(() => {
    initializeTasks();
  }, [initializeTasks]);

  // Initialize theme
  useTheme();

  // Keyboard shortcuts
  useKeyboard({
    // Navigation
    '1': () => navigate('/'),
    '2': () => navigate('/kanban'),
    '3': () => navigate('/calendar'),
    '4': () => navigate('/today'),
    '5': () => navigate('/analytics'),

    // Actions
    't': () => toggleTheme(),
    'ctrl+z': () => undo(),
    'ctrl+y': () => redo(),

    // Search (focus search input)
    '/': () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      if (searchInput) {
        searchInput.focus();
      }
    },
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ListView />} />
        <Route path="kanban" element={<KanbanView />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="today" element={<TodayView />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
