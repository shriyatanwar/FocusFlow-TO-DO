/**
 * Notification utilities using Browser Notification API
 */

/**
 * Request notification permission
 * @returns {Promise<string>} Permission status
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

/**
 * Show notification
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 */
export const showNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    return notification;
  }
};

/**
 * Show task notification
 * @param {object} task - Task object
 * @param {string} message - Notification message
 */
export const showTaskNotification = (task, message) => {
  showNotification('FocusFlow', {
    body: `${task.title}\n${message}`,
    tag: `task-${task.id}`,
    requireInteraction: false,
  });
};

/**
 * Show Pomodoro notification
 * @param {string} type - Notification type (work, break)
 * @param {object} task - Current task
 */
export const showPomodoroNotification = (type, task = null) => {
  const messages = {
    workComplete: {
      title: 'Work Session Complete! 🎉',
      body: task ? `Great job on "${task.title}"! Time for a break.` : 'Time for a break!',
    },
    breakComplete: {
      title: 'Break Complete! 💪',
      body: 'Ready to get back to work?',
    },
    longBreakComplete: {
      title: 'Long Break Complete! 🌟',
      body: 'Feeling refreshed? Let\'s continue!',
    },
  };

  const notification = messages[type];
  if (notification) {
    showNotification(notification.title, { body: notification.body });
  }
};

/**
 * Check if notifications are supported and enabled
 * @returns {boolean} True if notifications are available
 */
export const areNotificationsAvailable = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};
