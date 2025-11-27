/**
 * Application constants
 */

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
};

export const STATUSES = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

export const STATUS_LABELS = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export const VIEW_MODES = {
  LIST: 'list',
  KANBAN: 'kanban',
  CALENDAR: 'calendar',
  TODAY: 'today',
};

export const RECURRING_OPTIONS = {
  NONE: null,
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
};

export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: 'n',
  SEARCH: '/',
  TOGGLE_THEME: 't',
  UNDO: 'z',
  REDO: 'y',
  VIEW_LIST: '1',
  VIEW_KANBAN: '2',
  VIEW_CALENDAR: '3',
  VIEW_TODAY: '4',
  VIEW_ANALYTICS: '5',
};

export const POMODORO_DEFAULTS = {
  WORK_DURATION: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
  LONG_BREAK_INTERVAL: 4,
};
