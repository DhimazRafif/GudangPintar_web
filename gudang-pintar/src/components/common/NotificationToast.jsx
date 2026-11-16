import { useEffect } from "react";
import Button from "./Button";
import "./Notification.css";

export default function NotificationToast({ notification, onDismiss }) {
  const { id, type, message, title, duration } = notification;

  useEffect(() => {
    if (duration <= 0) return undefined;
    const timeoutId = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, id, onDismiss]);

  const isError = type === "danger";

  return (
    <section
      className={`gp-notification gp-notification--${type}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className="gp-notification-content">
        <strong className="gp-notification-title">{title || notificationLabel(type)}</strong>
        <p className="gp-notification-message">{message}</p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="gp-notification-close"
        ariaLabel="Tutup notifikasi"
        onClick={() => onDismiss(id)}
      >
        Tutup
      </Button>
    </section>
  );
}

function notificationLabel(type) {
  return {
    success: "Berhasil",
    danger: "Terjadi kesalahan",
    warning: "Perhatian",
    info: "Informasi",
  }[type];
}
