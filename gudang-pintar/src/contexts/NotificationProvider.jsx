import { useCallback, useMemo, useState } from "react";
import NotificationContext from "./NotificationContext";
import NotificationToast from "../components/common/NotificationToast";

let nextNotificationId = 1;

const NOTIFICATION_TYPES = new Set(["success", "danger", "warning", "info"]);

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const dismiss = useCallback((id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  const notify = useCallback(({ type = "info", message, duration = 5000, title } = {}) => {
    if (!message) return;
    const id = nextNotificationId++;
    const notification = {
      id,
      type: NOTIFICATION_TYPES.has(type) ? type : "info",
      message,
      title,
      duration,
    };
    setNotifications((current) => [...current, notification]);
    return id;
  }, []);

  const contextValue = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="gp-notification-stack" role="region" aria-label="Notifikasi">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
