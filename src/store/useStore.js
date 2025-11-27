import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

/**
 * Main Zustand store for FocusFlow application
 * Manages tasks, theme, settings, undo/redo history, and filters
 */
const useStore = create((set, get) => ({
  // Tasks state
  tasks: [],

  // History for undo/redo functionality
  history: [],
  historyIndex: -1,

  // Theme state
  theme: localStorage.getItem('theme') || 'light',

  // View mode state
  viewMode: localStorage.getItem('viewMode') || 'list',

  // Filters and search
  searchQuery: '',
  filterPriority: 'all',
  filterStatus: 'all',
  filterTags: [],

  // Settings
  settings: {
    notifications: true,
    soundEnabled: true,
    pomodoroWorkDuration: 25,
    pomodoroShortBreak: 5,
    pomodoroLongBreak: 15,
  },

  // Current task selected for Pomodoro
  selectedTaskId: null,

  // Initialize tasks from localStorage
  initializeTasks: () => {
    const savedTasks = localStorage.getItem('focusflow_tasks');
    if (savedTasks) {
      set({ tasks: JSON.parse(savedTasks) });
    }
  },

  // Save tasks to localStorage
  saveTasks: (tasks) => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  },

  // Add task to history for undo/redo
  addToHistory: (tasks) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(tasks)));
    set({
      history: newHistory.slice(-50), // Keep last 50 states
      historyIndex: Math.min(newHistory.length - 1, 49)
    });
  },

  // Add new task
  addTask: (taskData) => {
    const newTask = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      recurring: taskData.recurring || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    };

    set((state) => {
      const newTasks = [...state.tasks, newTask];
      state.saveTasks(newTasks);
      state.addToHistory(newTasks);
      return { tasks: newTasks };
    });
  },

  // Update existing task
  updateTask: (taskId, updates) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
              completedAt: updates.status === 'done' ? new Date().toISOString() : task.completedAt
            }
          : task
      );
      state.saveTasks(newTasks);
      state.addToHistory(newTasks);
      return { tasks: newTasks };
    });
  },

  // Delete task
  deleteTask: (taskId) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== taskId);
      state.saveTasks(newTasks);
      state.addToHistory(newTasks);
      return { tasks: newTasks };
    });
  },

  // Bulk update tasks (for drag and drop)
  bulkUpdateTasks: (updatedTasks) => {
    set((state) => {
      state.saveTasks(updatedTasks);
      state.addToHistory(updatedTasks);
      return { tasks: updatedTasks };
    });
  },

  // Toggle task completion
  toggleTaskComplete: (taskId) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      const newTasks = state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              completedAt: newStatus === 'done' ? new Date().toISOString() : null
            }
          : t
      );
      state.saveTasks(newTasks);
      state.addToHistory(newTasks);
      return { tasks: newTasks };
    });
  },

  // Undo action
  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        const tasks = state.history[newIndex];
        state.saveTasks(tasks);
        return { tasks, historyIndex: newIndex };
      }
      return state;
    });
  },

  // Redo action
  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        const tasks = state.history[newIndex];
        state.saveTasks(tasks);
        return { tasks, historyIndex: newIndex };
      }
      return state;
    });
  },

  // Toggle theme
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    });
  },

  // Set theme
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  // Set view mode
  setViewMode: (mode) => {
    localStorage.setItem('viewMode', mode);
    set({ viewMode: mode });
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Set filters
  setFilterPriority: (priority) => {
    set({ filterPriority: priority });
  },

  setFilterStatus: (status) => {
    set({ filterStatus: status });
  },

  setFilterTags: (tags) => {
    set({ filterTags: tags });
  },

  // Clear all filters
  clearFilters: () => {
    set({
      searchQuery: '',
      filterPriority: 'all',
      filterStatus: 'all',
      filterTags: [],
    });
  },

  // Update settings
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  // Select task for Pomodoro
  selectTaskForPomodoro: (taskId) => {
    set({ selectedTaskId: taskId });
  },

  // Get filtered tasks
  getFilteredTasks: () => {
    const { tasks, searchQuery, filterPriority, filterStatus, filterTags } = get();

    return tasks.filter((task) => {
      // Search filter
      const matchesSearch = searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Priority filter
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      // Status filter
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

      // Tags filter
      const matchesTags = filterTags.length === 0 ||
        filterTags.some((tag) => task.tags.includes(tag));

      return matchesSearch && matchesPriority && matchesStatus && matchesTags;
    });
  },
}));

export default useStore;
