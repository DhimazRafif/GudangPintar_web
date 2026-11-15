import { useContext } from "react";
import NotificationContext from "../contexts/NotificationContext";

export default function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification harus digunakan di dalam NotificationProvider.");
  }
  return context;
}
