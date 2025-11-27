import { useEffect, useState } from 'react';
import {
  requestNotificationPermission,
  showNotification,
  areNotificationsAvailable,
} from '../utils/notificationUtils';

/**
 * Custom hook for managing notifications
 * @returns {object} Notification utilities
 */
const useNotification = () => {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  };

  const notify = (title, options) => {
    if (areNotificationsAvailable()) {
      return showNotification(title, options);
    }
  };

  return {
    permission,
    requestPermission,
    notify,
    isAvailable: areNotificationsAvailable(),
  };
};

export default useNotification;
