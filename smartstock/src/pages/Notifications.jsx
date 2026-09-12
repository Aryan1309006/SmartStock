import React from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  Clock,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dummyItems } from "../assets/dummydata/item";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const parseDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (dateValue) => {
  const date = parseDate(dateValue);

  return date
    ? date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "an unknown date";
};

const getRelativeTime = (dateValue) => {
  const date = new Date(dateValue);
  const daysAgo = Math.floor((Date.now() - date.getTime()) / MS_PER_DAY);

  if (daysAgo <= 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return `${daysAgo} days ago`;
};

const createNotifications = (items) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return items
    .flatMap((item) => {
      const expiryDate = parseDate(item.expiryDate);
      const daysUntilExpiry = expiryDate
        ? Math.ceil((expiryDate - today) / MS_PER_DAY)
        : null;
      const notifications = [];

      if (item.consumedAt) {
        notifications.push({
          id: `${item._id}-consumed`,
          itemId: item._id,
          type: "consumed",
          title: `${item.name} was consumed`,
          message: `${item.quantity} ${item.quantity === 1 ? "unit" : "units"} marked as consumed.`,
          time: getRelativeTime(item.consumedAt),
          unread: false,
          date: new Date(item.consumedAt),
        });
      } else if (daysUntilExpiry !== null && daysUntilExpiry < 0) {
        notifications.push({
          id: `${item._id}-expired`,
          itemId: item._id,
          type: "expired",
          title: `${item.name} has expired`,
          message: `This item expired on ${formatDate(item.expiryDate)}.`,
          time: `${Math.abs(daysUntilExpiry)} ${Math.abs(daysUntilExpiry) === 1 ? "day" : "days"} ago`,
          unread: true,
          date: expiryDate,
        });
      } else if (daysUntilExpiry !== null && daysUntilExpiry <= 3) {
        notifications.push({
          id: `${item._id}-expiring`,
          itemId: item._id,
          type: "expiring",
          title: `${item.name} is expiring soon`,
          message:
            daysUntilExpiry === 0
              ? "This item expires today."
              : `This item will expire in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? "day" : "days"}.`,
          time: formatDate(item.expiryDate),
          unread: true,
          date: expiryDate,
        });
      }

      const createdDate = new Date(item.createdAt);
      if (!Number.isNaN(createdDate.getTime())) {
        notifications.push({
          id: `${item._id}-added`,
          itemId: item._id,
          type: "added",
          title: "New item added",
          message: `${item.name} was added to your inventory.`,
          time: getRelativeTime(item.createdAt),
          unread: false,
          date: createdDate,
        });
      }

      return notifications;
    })
    .sort((a, b) => b.date - a.date)
    .slice(0, 10);
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState(() =>
    createNotifications(dummyItems?.data?.items || []),
  );

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const viewItem = (notification) => {
    markAsRead(notification.id);
    navigate(`/inventory/${notification.itemId}`);
  };

  const getIcon = (type) => {
    switch (type) {
      case "expired":
        return (
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        );

      case "expiring":
        return (
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
        );

      case "added":
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-emerald-500" />
          </div>
        );

      case "consumed":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Check className="w-5 h-5 text-blue-500" />
          </div>
        );

      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-500" />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Stay updated with your inventory
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center justify-center gap-2 px-4 py-2.5 
                     bg-white border border-gray-200 rounded-lg
                     text-sm font-medium text-gray-600
                     hover:bg-gray-100 transition"
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      {/* Notification Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Card Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Recent Notifications
          </h2>
        </div>

        {/* Notifications */}
        <div>
          {notifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="text-gray-400" />
              </div>

              <h3 className="font-semibold text-gray-700">
                No notifications
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex items-start gap-4 px-5 py-4
                  border-b border-gray-100 last:border-b-0
                  transition
                  ${
                    notification.unread
                      ? "bg-emerald-50/40"
                      : "bg-white hover:bg-gray-50"
                  }`}
              >

                {/* Icon */}
                {getIcon(notification.type)}

                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {notification.title}
                        </h3>

                        {notification.unread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                      className="opacity-0 group-hover:opacity-100
                                 p-2 rounded-lg text-gray-400
                                 hover:text-red-500 hover:bg-red-50
                                 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3">

                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs font-medium text-emerald-600
                                 hover:text-emerald-700"
                    >
                      {notification.unread
                        ? "Mark as read"
                        : "Read"}
                    </button>

                    {(notification.type === "expired" ||
                      notification.type === "expiring") && (
                      <button
                        onClick={() => viewItem(notification)}
                        className="text-xs font-medium text-gray-600
                                   hover:text-gray-900"
                      >
                        View Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;