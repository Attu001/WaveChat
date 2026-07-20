import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ws_url } from "./api";
import { addNotification, setNotifications } from "./slices/notificationSlice";
import { notifications } from "./api/services/userServices";
import { AnimatePresence, motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatScreen from "./pages/ChatScreen";
import Profilelist from "./pages/Profilelist";
import Profile from "./pages/Profile";
import VerifyUser from "./pages/VerifyUser";
import NotificationPage from "./components/NotificationPage";
import MainLayout from "./MainLayout";
import PageTransition from "./components/PageTransition";
import { useTheme } from "./context/ThemeContext";

function App() {
  const userId = localStorage.getItem("id");
  const dispatch = useDispatch();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [toast, setToast] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Show toast notification
  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Play notification sound robustly
  const playNotificationSound = useCallback(() => {
    const audioEl = document.getElementById("notification-sound");
    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play().catch(err => console.log("Autoplay blocked:", err));
    }
  }, []);

  // 🌐 Network status detection
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => {
      setIsOffline(false);
      showToast("Back online ✅");
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [showToast]);

  // WebSocket connection
  useEffect(() => {
    if (!userId) return;

    let socket;

    const connectSocket = () => {
      socket = new WebSocket(
        `${ws_url}ws/notifications/${userId}/`
      );

      socket.onopen = () => {
        console.log("🟢 WebSocket Connected");
      };

      socket.onerror = (err) => {
        console.log("🔴 WebSocket Error", err);
      };

      socket.onclose = () => {
        console.log("⚠️ WebSocket Closed");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 🔊 Play sound
        playNotificationSound();

        // 💬 Show toast
        showToast(data.message);

        // 🔔 Add notification to Redux if it's a real DB notification
        if (data.is_notification && data.notification) {
          dispatch(addNotification(data.notification));
        }
      };
    };

    const timeout = setTimeout(connectSocket, 1500);

    return () => {
      clearTimeout(timeout);
      socket?.close();
    };
  }, [userId, dispatch, playNotificationSound, showToast]);

  // Fetch initial notifications
  useEffect(() => {
    if (!userId) return;
    const loadNotifications = async () => {
      try {
        const response = await notifications();
        dispatch(setNotifications(response.data));
      } catch (err) {
        console.error("Failed to fetch initial notifications:", err);
      }
    };
    loadNotifications();
  }, [userId, dispatch]);

  return (
    <>
      <audio id="notification-sound" src="/notification.wav" preload="auto" />

      {/* Dark mode toggle - floating button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 25 }}
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-[150] w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)',
          color: isDark ? '#f1f5f9' : '#6d28d9',
        }}
        whileTap={{ scale: 0.85 }}
      >
        {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </motion.button>

      {/* Offline banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-red-500 to-rose-500 text-white text-center py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-medium">You are not connected to the internet</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification - theme aware */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-16 left-1/2 z-[100] max-w-sm w-[90%] rounded-2xl shadow-xl border px-4 py-3 flex items-center gap-3 cursor-pointer"
            style={{
              backgroundColor: isDark ? 'var(--color-surface-secondary)' : '#ffffff',
              borderColor: isDark ? 'var(--color-border)' : 'var(--color-primary-bg)',
            }}
            onClick={() => setToast(null)}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'var(--color-primary-bg)' }}
            >
              <span className="text-lg">🔔</span>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: 'var(--color-primary)' }} className="text-xs font-semibold">New Notification</p>
              <p style={{ color: isDark ? 'var(--color-text-secondary)' : '#374151' }} className="text-sm truncate">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/home" element={<PageTransition><MainLayout /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/chat-screen" element={<PageTransition><ChatScreen /></PageTransition>} />
          <Route path="/list" element={<PageTransition><Profilelist /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/verify" element={<PageTransition><VerifyUser /></PageTransition>} />
          <Route path="/notifications" element={<PageTransition><NotificationPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;