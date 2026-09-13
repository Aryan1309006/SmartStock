import { createContext, useContext, useEffect, useState } from "react";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationsService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications();
      setNotifications(response.data?.notifications ?? []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = async () => {
    await markAllNotificationsRead();
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  };

  const removeNotification = async (id) => {
    await deleteNotification(id);
    setNotifications((current) =>
      current.filter((notification) => notification._id !== id),
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const value = {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return context;
};
