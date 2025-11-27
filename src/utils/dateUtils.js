import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  isFuture,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, 'h:mm a')}`;
  }

  if (isTomorrow(dateObj)) {
    return `Tomorrow, ${format(dateObj, 'h:mm a')}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, 'h:mm a')}`;
  }

  return format(dateObj, 'MMM d, yyyy h:mm a');
};

/**
 * Format date for display (short version)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  return format(dateObj, 'MMM d');
};

/**
 * Get relative time string
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  const daysDiff = differenceInDays(dateObj, now);
  const hoursDiff = differenceInHours(dateObj, now);
  const minutesDiff = differenceInMinutes(dateObj, now);

  if (Math.abs(minutesDiff) < 1) {
    return 'now';
  }

  if (Math.abs(minutesDiff) < 60) {
    return isPast(dateObj)
      ? `${Math.abs(minutesDiff)} minutes ago`
      : `in ${minutesDiff} minutes`;
  }

  if (Math.abs(hoursDiff) < 24) {
    return isPast(dateObj)
      ? `${Math.abs(hoursDiff)} hours ago`
      : `in ${hoursDiff} hours`;
  }

  if (Math.abs(daysDiff) < 7) {
    return isPast(dateObj)
      ? `${Math.abs(daysDiff)} days ago`
      : `in ${daysDiff} days`;
  }

  return formatDateShort(dateObj);
};

/**
 * Check if date is overdue
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isPast(dateObj) && !isToday(dateObj);
};

/**
 * Get tasks for today
 * @param {Array} tasks - All tasks
 * @returns {Array} Tasks for today
 */
export const getTodayTasks = (tasks) => {
  const today = new Date();
  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return isToday(dueDate) || (isPast(dueDate) && task.status !== 'done');
  });
};

/**
 * Get tasks for a specific date range
 * @param {Array} tasks - All tasks
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Array} Tasks in range
 */
export const getTasksInRange = (tasks, start, end) => {
  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= start && dueDate <= end;
  });
};

/**
 * Group tasks by date
 * @param {Array} tasks - All tasks
 * @returns {Object} Tasks grouped by date
 */
export const groupTasksByDate = (tasks) => {
  const grouped = {};

  tasks.forEach((task) => {
    if (!task.dueDate) {
      if (!grouped['No Date']) {
        grouped['No Date'] = [];
      }
      grouped['No Date'].push(task);
      return;
    }

    const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(task);
  });

  return grouped;
};

/**
 * Get calendar events from tasks
 * @param {Array} tasks - All tasks
 * @returns {Array} Calendar events
 */
export const getCalendarEvents = (tasks) => {
  return tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task.id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: false,
      resource: task,
    }));
};
