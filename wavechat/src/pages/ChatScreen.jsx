import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { getProfileOnChat, fetchChatHistory } from "../api/services/userServices";
import { ws_url } from "../api";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiWifi, FiWifiOff } from "react-icons/fi";

const ChatScreen = () => {
    const navigate = useNavigate();

    const searchparams = new URLSearchParams(window.location.search);
    const id = searchparams.get("id");
    const socketRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting | connected | disconnected
    const [profileLoading, setProfileLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { state } = useLocation();

    // The other user's ID can come from state (navigated) or URL (refreshed)
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

        const currentToken = localStorage.getItem("access_token");
        if (!currentToken) {
            console.error("No access token found");
            navigate("/login");
            return;
        }

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
                // Use server timestamp (created_at) if available
                setMessages((prev) => [...prev, {
                    ...data,
                    timestamp: data.created_at || new Date().toISOString()
                }]);
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

        socketRef.current.send(JSON.stringify({ message: newMessage }));
        setNewMessage("");
        inputRef.current?.focus();
    }, [newMessage]);

    // Format time
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Check if message is from the logged-in user
    const isMine = (msg) => msg.sender === loggedInUserId;

    // Connection status badge (this is YOUR connection, not the other user's status)
    const statusConfig = {
        connecting: { color: "bg-yellow-400", text: "Connecting...", icon: null },
        connected: { color: "bg-green-400", text: "Connected", icon: <FiWifi size={12} /> },
        disconnected: { color: "bg-red-400", text: "Reconnecting...", icon: <FiWifiOff size={12} /> },
    };

    const currentStatus = statusConfig[connectionStatus];

    return (
        <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
            {/* ─── Header ─── */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur-xl border-b border-purple-100 shadow-sm"
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate("/home")}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                >
                    <IoIosArrowBack size={20} />
                </motion.button>

                {/* Avatar */}
                {profileLoading ? (
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                    <div>
                        {profile?.profile_pic ? (
                            <img
                                src={profile.profile_pic}
                                alt={profile?.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )}

                {/* Name + Status */}
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-[15px]">
                        {profile?.name || "Loading..."}
                    </p>
                    <div className="flex items-center gap-1.5">
                        {currentStatus.icon}
                        <span className="text-[11px] text-gray-400">{currentStatus.text}</span>
                    </div>
                </div>
            </motion.div>

            {/* ─── Messages Area ─── */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {/* History loading state */}
                {historyLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full gap-2"
                    >
                        <div className="w-8 h-8 border-3 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                        <p className="text-xs text-gray-400 font-medium">Loading messages...</p>
                    </motion.div>
                )}

                {/* Empty state */}
                {!historyLoading && messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full gap-2 opacity-60"
                    >
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                            💬
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            No messages yet
                        </p>
                        <p className="text-xs text-gray-400">
                            Say hello to {profile?.name || "your friend"}!
                        </p>
                    </motion.div>
                )}

                <AnimatePresence>
                    {messages.map((msg, idx) => {
                        const mine = isMine(msg);
                        const showTail =
                            idx === messages.length - 1 ||
                            isMine(messages[idx + 1]) !== mine;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 28,
                                }}
                                className={`flex ${mine ? "justify-end" : "justify-start"} mb-1.5`}
                            >
                                <div
                                    className={`relative max-w-[75%] md:max-w-md px-4 py-2.5 shadow-sm
                                        ${mine
                                            ? `bg-gradient-to-br from-purple-500 to-indigo-500 text-white ${showTail ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                                            : `bg-white text-gray-800 ${showTail ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                                        }
                                    `}
                                >
                                    <p className="text-[14.5px] leading-relaxed break-words">
                                        {msg.message}
                                    </p>
                                    <p
                                        className={`text-[10px] mt-1 text-right ${mine ? "text-white/60" : "text-gray-400"
                                            }`}
                                    >
                                        {formatTime(msg.timestamp)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
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
                        className="flex items-center justify-center gap-2 py-2 bg-red-50 border-t border-red-100 text-red-500 text-xs font-medium"
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
                className="px-4 py-3 flex gap-2 bg-white/70 backdrop-blur-xl border-t border-purple-100"
            >
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={connectionStatus === "disconnected"}
                />
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all ${newMessage.trim() && connectionStatus === "connected"
                        ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
                        : "bg-gray-100 text-gray-400"
                        }`}
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
