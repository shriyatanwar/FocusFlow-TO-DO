import { addDays, addWeeks, addMonths, setHours, setMinutes, parseISO } from 'date-fns';

/**
 * Natural Language Parser for FocusFlow
 * Parses task input like "Submit report tomorrow at 5pm !high @work"
 * and extracts title, date, priority, and tags
 */

/**
 * Parse natural language input into task object
 * @param {string} input - The natural language input
 * @returns {object} Parsed task object
 */
export const parseNaturalLanguage = (input) => {
  let remaining = input;
  const task = {
    title: '',
    dueDate: null,
    priority: 'medium',
    tags: [],
  };

  // Extract priority (!high, !medium, !low)
  const priorityMatch = remaining.match(/!(high|medium|low)/i);
  if (priorityMatch) {
    task.priority = priorityMatch[1].toLowerCase();
    remaining = remaining.replace(priorityMatch[0], '').trim();
  }

  // Extract tags (@tag)
  const tagMatches = remaining.match(/@(\w+)/g);
  if (tagMatches) {
    task.tags = tagMatches.map((tag) => tag.substring(1));
    remaining = remaining.replace(/@(\w+)/g, '').trim();
  }

  // Extract time (at 5pm, at 17:00, etc.)
  let timeHour = null;
  let timeMinute = 0;
  const timeMatch = remaining.match(/at (\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);
  if (timeMatch) {
    timeHour = parseInt(timeMatch[1]);
    timeMinute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;

    if (timeMatch[3]) {
      const period = timeMatch[3].toLowerCase();
      if (period === 'pm' && timeHour !== 12) {
        timeHour += 12;
      } else if (period === 'am' && timeHour === 12) {
        timeHour = 0;
      }
    }

    remaining = remaining.replace(timeMatch[0], '').trim();
  }

  // Extract date keywords
  const dateKeywords = {
    'today': () => new Date(),
    'tomorrow': () => addDays(new Date(), 1),
    'next week': () => addWeeks(new Date(), 1),
    'next month': () => addMonths(new Date(), 1),
  };

  let dueDate = null;
  for (const [keyword, dateFunc] of Object.entries(dateKeywords)) {
    if (remaining.toLowerCase().includes(keyword)) {
      dueDate = dateFunc();
      remaining = remaining.replace(new RegExp(keyword, 'gi'), '').trim();
      break;
    }
  }

  // Extract specific date formats (YYYY-MM-DD, MM/DD/YYYY, etc.)
  const dateFormats = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
  ];

  for (const format of dateFormats) {
    const dateMatch = remaining.match(format);
    if (dateMatch) {
      try {
        if (format === dateFormats[0]) {
          // YYYY-MM-DD
          dueDate = parseISO(dateMatch[0]);
        } else {
          // MM/DD/YYYY
          dueDate = new Date(dateMatch[3], dateMatch[1] - 1, dateMatch[2]);
        }
        remaining = remaining.replace(dateMatch[0], '').trim();
        break;
      } catch (e) {
        // Invalid date, continue
      }
    }
  }

  // Apply time to date if both exist
  if (dueDate && timeHour !== null) {
    dueDate = setHours(dueDate, timeHour);
    dueDate = setMinutes(dueDate, timeMinute);
  }

  task.dueDate = dueDate ? dueDate.toISOString() : null;
  task.title = remaining.trim() || 'Untitled Task';

  return task;
};

/**
 * Suggest tasks based on patterns
 * @param {Array} tasks - Existing tasks
 * @returns {Array} Suggested task titles
 */
export const suggestTasks = (tasks) => {
  const suggestions = [];

  // Find overdue tasks
  const now = new Date();
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
  );

  if (overdueTasks.length > 0) {
    suggestions.push({
      type: 'overdue',
      message: `You have ${overdueTasks.length} overdue task(s)`,
      tasks: overdueTasks,
    });
  }

  // Find high priority incomplete tasks
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === 'high' && task.status !== 'done'
  );

  if (highPriorityTasks.length > 0) {
    suggestions.push({
      type: 'high-priority',
      message: `${highPriorityTasks.length} high priority task(s) pending`,
      tasks: highPriorityTasks,
    });
  }

  return suggestions;
};

/**
 * Generate task title suggestions based on input
 * @param {string} input - Current input
 * @param {Array} tasks - Existing tasks
 * @returns {Array} Suggested titles
 */
export const getTaskSuggestions = (input, tasks) => {
  if (!input || input.length < 2) return [];

  const lowerInput = input.toLowerCase();
  const suggestions = new Set();

  // Get unique task titles that match
  tasks.forEach((task) => {
    if (task.title.toLowerCase().includes(lowerInput)) {
      suggestions.add(task.title);
    }
  });

  return Array.from(suggestions).slice(0, 5);
};
