import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications, markNotificationAsRead, removeNotification } from "../slices/notificationSlice";
import { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead } from "../api/services/userServices";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "./PageLoader";
import { FiBell, FiRefreshCw, FiCheck, FiCheckCircle } from "react-icons/fi";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Helper: relative time string
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

// Notification type icon & color based on message content
const getNotifStyle = (message) => {
  const msg = (message || "").toLowerCase();
  if (msg.includes("accepted"))
    return { emoji: "✅", bg: "bg-green-50", border: "border-green-100", accent: "text-green-600" };
  if (msg.includes("rejected"))
    return { emoji: "❌", bg: "bg-red-50", border: "border-red-100", accent: "text-red-500" };
  if (msg.includes("request"))
    return { emoji: "👋", bg: "bg-blue-50", border: "border-blue-100", accent: "text-blue-600" };
  return { emoji: "💬", bg: "bg-purple-50", border: "border-purple-100", accent: "text-purple-600" };
};

const NotificationPage = () => {
  const notificationsList = useSelector((state) => state.notification.notifications);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(notificationsList.length === 0);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Audio is now globally managed by AudioContext in App.js

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (notificationsList.length === 0) setLoading(true);
      setError(null);

      const response = await notifications();
      dispatch(setNotifications(response.data));
      
      // Fetch unread count
      const countResponse = await unreadNotificationCount();
      setUnreadCount(countResponse.data.unread_count);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Only fetch if Redux list is empty, otherwise background fetch is fine but we don't strictly need to force update here
    if (notificationsList.length === 0) {
      fetchNotifications();
    }
  }, []);

  // Mark single notification as read
  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await markNotificationRead(notificationId);
      dispatch(markNotificationAsRead(notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      dispatch(removeNotification()); // This will mark all as read in the slice
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Loading state
  if (loading && notificationsList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <PageLoader message="Loading notifications..." />
      </div>
    );
  }

  // Error state
  if (error && notificationsList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-gray-600 font-medium">Something went wrong</p>
          <p className="text-sm text-gray-400">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchNotifications()}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium shadow-md"
          >
            <FiRefreshCw size={14} />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-6">

      <div className="w-full max-w-2xl">
        {/* Header with refresh */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center relative">
              <FiBell className="text-purple-600 text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
              <p className="text-xs text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : `${notificationsList.length} total`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition"
              >
                <FiCheckCircle size={14} />
                Mark all read
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
              className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-purple-600 transition"
            >
              <FiRefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </motion.div>

        {/* Inline refresh banner */}
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center py-2 mb-3 bg-purple-50 rounded-xl border border-purple-100"
          >
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
            <span className="text-xs text-purple-600 font-medium">Refreshing...</span>
          </motion.div>
        )}

        {/* Empty state */}
        {notificationsList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
              <FiBell className="text-2xl text-purple-300" />
            </div>
            <p className="text-gray-600 font-medium">All caught up!</p>
            <p className="text-sm text-gray-400">No notifications yet</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {notificationsList.map((n, index) => {
              const style = getNotifStyle(n.message);
              return (
                <motion.div
                  key={n.id || index}
                  variants={itemVariants}
                  whileHover={{ x: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                    n.is_read 
                      ? `${style.bg} ${style.border}` 
                      : "bg-white border-purple-200 shadow-sm"
                  }`}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 text-lg">
                    {n.sender?.name?.[0]?.toUpperCase() || style.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${style.accent}`}>
                          {n.sender?.name || "WaveChat"}
                        </p>
                        {!n.is_read && (
                          <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {/* Mark as read button */}
                  {!n.is_read && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition"
                      title="Mark as read"
                    >
                      <FiCheck size={16} />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
