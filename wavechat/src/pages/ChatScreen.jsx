import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import Chats from "../compoennts/Chats";

const ChatScreen = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey there!", sender: "friend" },
        { id: 2, text: "Hello! How are you?", sender: "me" },
        { id: 3, text: "I'm good, thanks! You?", sender: "friend" },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [openChat, setOpenChat] = useState(false)
    const messagesEndRef = useRef(null);

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);
        setNewMessage("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="w-screen h-screen flex overflow-hidden">
            {/* Sidebar */}
            <div className="h-full">
                <div className="h-full px-3 text-lg" onClick={() => setOpenChat(!openChat)}>
                    {
                        openChat
                            ?
                            <div>
                                <div className="flex justify-end py-4">
                                    <IoIosArrowBack className="text-[50px]" />
                                </div>
                                <Chats />
                            </div>

                            :
                            <div className="flex justify-end  py-4">
                                <IoIosArrowForward className="text-[30px]"/>
                            </div>



                    }

                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-purple-200/60 backdrop-blur-md border-b border-purple-300">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <span className="font-semibold text-gray-800">Alice</span>
                    </div>
                    <span className="text-gray-500 text-sm">Online</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-md break-words
                ${msg.sender === "me"
                                    ? "bg-purple-500 text-white self-end rounded-br-none"
                                    : "bg-white text-gray-800 self-start rounded-bl-none"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-purple-300 flex gap-3 bg-purple-100/60 backdrop-blur-md">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/90"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;
