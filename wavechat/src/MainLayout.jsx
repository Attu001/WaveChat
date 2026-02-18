import React, { useState } from "react";
import { FaHome, FaComments, FaBell, FaUser, FaCheckDouble } from "react-icons/fa";
import BottomItem from "./components/BottomItem"
import Profile from "./pages/Profile";
import Profilelist from "./pages/Profilelist";
import NotificationPage from "./components/NotificationPage"
import Posts from "./pages/Posts";
import UsersList from "./pages/UsersList";
import { FaRegSquare } from "react-icons/fa6";
import ChatRequestsPage from "./pages/ChatRequestsPage";

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="h-screen flex flex-col bg-gray-100 ">

      {/* 🔝 Navbar */}
      <div className="h-14 bg-purple-600 text-white flex items-center py-4 shadow">
        <h1 className="text-lg font-semibold">{activeTab}</h1>
      </div>

      {/* 🧱 Main Content */}
      <div className="w-screen h-screen overflow-y-auto">
        {activeTab === "posts" && <Posts />}
        {activeTab === "notifications" && <NotificationPage />}
        {activeTab === "chat" && <Profilelist />}
        {activeTab === "profile" && <Profile />}
        {activeTab === "send_Request" && <UsersList/>}
         {activeTab === "received_Request" && <ChatRequestsPage />}

      </div>

      {/* 🔽 Bottom Bar */}
      <div className="h-16 bg-white border-t flex justify-around items-center">
        <BottomItem
          icon={<FaHome />}
          label="Posts"
          active={activeTab === "posts"}
          onClick={() => setActiveTab("posts")}
        />
        <BottomItem
          icon={<FaComments />}
          label="Chat"
          active={activeTab === "chat"}
          onClick={() => setActiveTab("chat")}
        />
        <BottomItem
          icon={<FaBell />}
          label="Alerts"
          active={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
        />
        <BottomItem
          icon={<FaUser />}
          label="Profile"
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />
        <BottomItem
          icon={<FaRegSquare/>}
          label="Request"
          active={activeTab === "send_Request"}
          onClick={() => setActiveTab("send_Request")}
        />
        <BottomItem
          icon={<FaCheckDouble/>}
          label="Received Requests"
          active={activeTab === "received_Request"}
          onClick={() => setActiveTab("received_Request")}
        />
      </div>
    </div>
  );
};

export default MainLayout;
