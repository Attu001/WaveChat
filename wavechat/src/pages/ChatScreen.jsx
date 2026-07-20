import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { getProfileOnChat, fetchChatHistory } from "../api/services/userServices";
import { ws_url } from "../api";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiWifi, FiWifiOff, FiCheck, FiCheckCircle, FiMoreVertical } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import EmptyState from "../components/EmptyState";
import { ChatSkeleton } from "../components/SkeletonLoader";

// ─── Date Format Helpers ───
const formatDateSeparator = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const shouldShowDateSeparator = (messages, idx) => {
  if (idx === 0) return true;
  const prev = new Date(messages[idx - 1].timestamp).toDateString();
  const curr = new Date(messages[idx].timestamp).toDateString();
  return prev !== curr;
};

// ─── Message Status Icons ───
const MessageStatus = ({ status }) => {
  if (!status) return null;
  switch (status) {
    case "sending":
      return <FiCheck size={12} className="text-gray-400" />;
    case "sent":
      return <FiCheck size={12} className="text-gray-400" />;
    case "delivered":
      return (
        <div className="flex -space-x-1">
          <FiCheck size={12} className="text-gray-400" />
          <FiCheck size={12} className="text-gray-400" />
        </div>
      );
    case "read":
      return (
        <div className="flex -space-x-1">
          <FiCheckCircle size={12} className="text-blue-400" />
          <FiCheckCircle size={12} className="text-blue-400" />
        </div>
      );
    default:
      return null;
  }
};

// ─── Typing Dots Animation ───
const TypingIndicator = ({ name }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2 }}
    className="flex items-start gap-2 px-4 py-2"
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
        {name || "Someone"} is typing
      </span>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/80 dark:bg-gray-800 shadow-sm flex gap-1.5"
        style={{
          backgroundColor: 'var(--color-chat-other)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <motion.span
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-text-tertiary)' }}
        />
        <motion.span
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-text-tertiary)' }}
        />
        <motion.span
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-text-tertiary)' }}
        />
      </div>
    </div>
  </motion.div>
);

// ─── Date Separator ───
const DateDivider = ({ date }) => (
  <div className="flex items-center gap-3 py-3 px-4">
    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
    <span
      className="text-[11px] font-semibold tracking-wide uppercase flex-shrink-0"
      style={{ color: 'var(--color-text-tertiary)' }}
    >
      {date}
    </span>
    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
  </div>
);

// ─── Main ChatScreen Component ───
const ChatScreen = () => {
  const navigate = useNavigate();
  const searchparams = new URLSearchParams(window.location.search);
  const id = searchparams.get("id");
  const socketRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [profileLoading, setProfileLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { state } = useLocation();
  const { isDark } = useTheme();

  const otherUserId = state?.userId || (id ? Number(id) : null);
  const loggedInUserId = Number(localStorage.getItem("id"));

  // Redirect if not logged in
  useEffect(() => {
    if (!loggedInUserId) navigate("/login");
  }, [loggedInUserId, navigate]);

  // Fetch other user's profile
  useEffect(() => {
    if (otherUserId) {
      setProfileLoading(true);
      getProfileOnChat(otherUserId)
        .then((res) => setProfile(res.data))
        .catch(console.error)
        .finally(() => setProfileLoading(false));
    }
  }, [otherUserId]);

  // Fetch chat history
  useEffect(() => {
    if (!otherUserId) {
      setHistoryLoading(false);
      return;
    }
    setHistoryLoading(true);
    fetchChatHistory(otherUserId)
      .then((res) => {
        setMessages(res.data || []);
      })
      .catch(console.error)
      .finally(() => setHistoryLoading(false));
  }, [otherUserId]);

  // WebSocket connection
  useEffect(() => {
    if (!loggedInUserId || !id) return;

    const currentToken = localStorage.getItem("access");
    setConnectionStatus("connecting");

    socketRef.current = new WebSocket(
      `${ws_url}ws/chat/${loggedInUserId}/${id}/?token=${currentToken}`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("connected");
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "chat_message") {
        setIsTyping(false);
        setMessages((prev) => [...prev, {
          ...data,
          status: "delivered",
          timestamp: data.created_at || new Date().toISOString(),
        }]);
      }
      if (data.type === "typing") {
        setIsTyping(data.is_typing);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setConnectionStatus("disconnected");
    };

    socketRef.current.onerror = () => {
      setConnectionStatus("disconnected");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [loggedInUserId, id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    // Optimistic local message
    const tempMsg = {
      message: newMessage,
      sender: loggedInUserId,
      timestamp: new Date().toISOString(),
      status: "sending",
    };
    setMessages((prev) => [...prev, tempMsg]);

    socketRef.current.send(JSON.stringify({ message: newMessage }));
    setNewMessage("");
    inputRef.current?.focus();

    // Update to "sent" after a short delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m === tempMsg ? { ...m, status: "sent" } : m
        )
      );
    }, 300);
  }, [newMessage, loggedInUserId]);

  // Typing indicator sender
  const handleTyping = useCallback(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ type: "typing", is_typing: true }));

    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      socketRef.current?.send(JSON.stringify({ type: "typing", is_typing: false }));
    }, 1500);
    setTypingTimeout(timeout);
  }, [typingTimeout]);

  const isMine = (msg) => msg.sender === loggedInUserId;

  const statusConfig = {
    connecting: { color: "bg-yellow-400", text: "Connecting...", icon: null },
    connected: { color: "bg-green-400", text: "Connected", icon: <FiWifi size={12} /> },
    disconnected: { color: "bg-red-400", text: "Reconnecting...", icon: <FiWifiOff size={12} /> },
  };
  const currentStatus = statusConfig[connectionStatus];

  return (
    <div className="w-screen h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{
          backgroundColor: isDark ? 'var(--color-surface-secondary)' : 'rgba(255,255,255,0.7)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/home")}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: isDark ? 'var(--color-surface-tertiary)' : '#f3f4f6', color: 'var(--color-text-secondary)' }}
        >
          <IoIosArrowBack size={20} />
        </motion.button>

        {/* Avatar */}
        {profileLoading ? (
          <div className="w-10 h-10 rounded-full skeleton" />
        ) : (
          <div>
            {profile?.profile_pic ? (
              <img
                src={profile.profile_pic}
                alt={profile?.name}
                className="w-10 h-10 rounded-full object-cover border-2"
                style={{ borderColor: 'var(--color-primary-bg)' }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'var(--color-chat-mine)' }}
              >
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Name + Status */}
        <div className="flex-1">
          <p className="font-semibold text-[15px]" style={{ color: 'var(--color-text-primary)' }}>
            {profile?.name || "Loading..."}
          </p>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${currentStatus.color}`} />
            <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{currentStatus.text}</span>
          </div>
        </div>

        {/* More options */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <FiMoreVertical size={18} />
        </motion.button>
      </motion.div>

      {/* ─── Messages Area ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-3"
        style={{ backgroundColor: isDark ? 'var(--color-surface)' : 'var(--color-surface-secondary)' }}
      >
        {/* History loading state */}
        {historyLoading && <ChatSkeleton count={6} />}

        {/* Empty state */}
        {!historyLoading && messages.length === 0 && (
          <EmptyState
            type="messages"
            title="No messages yet"
            description={`Say hello to ${profile?.name || "your friend"}!`}
          />
        )}

        <AnimatePresence>
          {messages.map((msg, idx) => {
            const mine = isMine(msg);
            const showTail =
              idx === messages.length - 1 ||
              isMine(messages[idx + 1]) !== mine;

            return (
              <React.Fragment key={idx}>
                {/* Date Separator */}
                {shouldShowDateSeparator(messages, idx) && (
                  <DateDivider date={formatDateSeparator(msg.timestamp)} />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className={`flex ${mine ? "justify-end" : "justify-start"} mb-1.5`}
                >
                  <div
                    className={`relative max-w-[75%] md:max-w-md px-4 py-2.5 shadow-sm ${mine ? (showTail ? "rounded-2xl rounded-br-md" : "rounded-2xl") : (showTail ? "rounded-2xl rounded-bl-md" : "rounded-2xl")}`}
                    style={{
                      background: mine ? 'var(--color-chat-mine)' : 'var(--color-chat-other)',
                      color: mine ? '#ffffff' : 'var(--color-text-primary)',
                      border: !mine ? '1px solid var(--color-border-light)' : 'none',
                    }}
                  >
                    <p className="text-[14.5px] leading-relaxed break-words">
                      {msg.message}
                    </p>
                    <div className={`flex items-center gap-1 mt-1 justify-end`}>
                      <span className="text-[10px]" style={{ color: mine ? 'rgba(255,255,255,0.6)' : 'var(--color-text-tertiary)' }}>
                        {formatTime(msg.timestamp)}
                      </span>
                      {mine && <MessageStatus status={msg.status} />}
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator name={profile?.name} />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Disconnected Banner ─── */}
      <AnimatePresence>
        {connectionStatus === "disconnected" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-2 py-2 text-xs font-medium"
            style={{
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
              borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fecaca',
              color: isDark ? '#fca5a5' : '#ef4444',
            }}
          >
            <FiWifiOff size={13} />
            Connection lost. Messages won't be sent.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Input Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        className="px-4 py-3 flex gap-2 border-t"
        style={{
          backgroundColor: isDark ? 'var(--color-surface-secondary)' : 'rgba(255,255,255,0.7)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message…"
          className="flex-1 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: isDark ? 'var(--color-surface-tertiary)' : '#ffffff',
            border: `1px solid ${isDark ? 'var(--color-border)' : '#e5e7eb'}`,
            color: 'var(--color-text-primary)',
            '--tw-ring-color': 'var(--color-primary-light)',
          }}
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={connectionStatus === "disconnected"}
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all ${newMessage.trim() && connectionStatus === "connected"
            ? "text-white"
            : "text-gray-400"
            }`}
          style={{
            background: newMessage.trim() && connectionStatus === "connected"
              ? 'var(--color-chat-mine)'
              : (isDark ? 'var(--color-surface-tertiary)' : '#f3f4f6'),
          }}
          onClick={sendMessage}
          disabled={!newMessage.trim() || connectionStatus !== "connected"}
        >
          <FiSend size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChatScreen;