import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { getProfileByUserId } from "../supabase";
import { useParams, useNavigate } from "react-router-dom";

const ChatScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [profile, setProfile] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    // Load Profile
    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getProfileByUserId(id);
            setProfile(data);
        };
        fetchProfile();
    }, [id]);

    // WebSocket Connection
    useEffect(() => {
        if (!id) return;

        ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${id}/`);

        ws.current.onopen = () => console.log("WebSocket Connected");

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received:", data);

            if (data.message) {
                setMessages((prev) => [...prev, data]);
            }
        };

        ws.current.onerror = (error) => console.log("WebSocket Error:", error);

        ws.current.onclose = () => console.log("WebSocket Closed");

        return () => ws.current.close();
    }, [id]);

    // Send Message
    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const msgObj = {
            username: profile[0]?.fullname || "Me",
            message: newMessage,
        };

        ws.current.send(JSON.stringify(msgObj));

        setMessages((prev) => [...prev, msgObj]);
        setNewMessage("");
    };

    // Auto Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200">
            <div className="flex items-center p-4 bg-purple-200/60 backdrop-blur-md">
                <IoIosArrowBack
                    className="text-[40px] cursor-pointer"
                    onClick={() => navigate(`/list`)}
                />
                <div className="ml-3 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    {profile[0]?.fullname?.charAt(0)}
                </div>
                <span className="ml-3 font-semibold">{profile[0]?.fullname}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md mb-2 shadow
                          ${msg.username === profile[0]?.fullname
                              ? "bg-purple-500 text-white ml-auto"
                              : "bg-white text-gray-800"
                          }
                        `}
                    >
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 flex gap-3 bg-purple-100/60 backdrop-blur-md">
                <input
                    type="text"
                    placeholder="Type a message…"
                    className="flex-1 p-3 rounded-full border border-purple-300 bg-white"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    className="bg-purple-500 text-white px-6 py-3 rounded-full"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatScreen;
