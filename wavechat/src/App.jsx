import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ws_url } from "./api";
import { addNotification, setNotifications } from "./slices/notificationSlice";
import { notifications } from "./api/services/userServices";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatScreen from "./pages/ChatScreen";
import Profilelist from "./pages/Profilelist";
import Profile from "./pages/Profile";
import VerifyUser from "./pages/VerifyUser";
import NotificationPage from "./components/NotificationPage";
import MainLayout from "./MainLayout";
import PageTransition from "./components/PageTransition";

function App() {
  const userId = localStorage.getItem("id");
  const dispatch = useDispatch();
  const location = useLocation();

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
      // Get JWT token from localStorage
      const token = localStorage.getItem("access_token");
      
      socket = new WebSocket(
        `${ws_url}ws/notifications/${userId}/?token=${token}`
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

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-4 left-1/2 z-[100] max-w-sm w-[90%] bg-white rounded-2xl shadow-xl border border-purple-100 px-4 py-3 flex items-center gap-3"
            onClick={() => setToast(null)}
          >
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔔</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-purple-600">New Notification</p>
              <p className="text-sm text-gray-700 truncate">{toast}</p>
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