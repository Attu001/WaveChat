import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ws_url } from "./api";
import { addNotification } from "./slices/notificationSlice";
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

  // 🔊 Pre-load audio once and reuse
  const audioRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const [toast, setToast] = useState(null);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio("/notification.wav");
    audio.volume = 0.6;
    audio.preload = "auto";
    audioRef.current = audio;
  }, []);

  // Unlock audio on first user interaction (browser autoplay policy)
  useEffect(() => {
    const unlock = () => {
      if (!audioUnlockedRef.current && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioUnlockedRef.current = true;
          })
          .catch(() => { });
      }
    };

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.log("Sound blocked:", err));
    }
  }, []);

  // Show toast notification
  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

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

        // 🔔 Add notification to Redux
        dispatch(
          addNotification({
            message: data.message,
            sender_id: data.sender_id,
            time: new Date().toISOString(),
          })
        );

        // 🔊 Play sound
        playNotificationSound();

        // 💬 Show toast
        showToast(data.message);
      };
    };

    const timeout = setTimeout(connectSocket, 1500);

    return () => {
      clearTimeout(timeout);
      socket?.close();
    };
  }, [userId, dispatch, playNotificationSound, showToast]);

  return (
    <>
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