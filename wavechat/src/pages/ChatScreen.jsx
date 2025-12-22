import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileByUserId } from "../api";

const ChatScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const socketRef = useRef(null);
    const [profile, setProfile] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    

    const loggedInUserId = localStorage.getItem("id")

    if (!loggedInUserId) {
        navigate("/login")

    }
    // console.log(loggedInUserId);

    // Load Profile
    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getProfileByUserId(id);
            setProfile(data);
        };
        fetchProfile();
    }, [id]);

    useEffect(() => {
    if (!loggedInUserId || !id) return;

    socketRef.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/${loggedInUserId}/${id}/`
    );

    socketRef.current.onopen = () => {
        console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data);

        setMessages(prev => [...prev, data]);
    };

    socketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
    };

    return () => {
        socketRef.current?.close();
    };
}, [loggedInUserId, id]);

const sendMessage = () => {
    if (!newMessage.trim()) return;

    const payload = {
        message: newMessage,
        sender: loggedInUserId,
    };

    socketRef.current.send(JSON.stringify(payload));

    setNewMessage("");
};

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
                    {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="ml-3 font-semibold">{profile?.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md mb-2 shadow
                          ${msg.sender === loggedInUserId
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
