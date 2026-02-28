import React, { useState } from "react";
import {
  RiHome5Line, RiHome5Fill,
  RiChat3Line, RiChat3Fill,
  RiBellLine, RiBellFill,
  RiUserLine, RiUserFill,
  RiUserAddLine, RiUserAddFill,
} from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import BottomItem from "./components/BottomItem";
import Profile from "./pages/Profile";
import Profilelist from "./pages/Profilelist";
import NotificationPage from "./components/NotificationPage";
import Posts from "./pages/Posts";
import UsersList from "./pages/UsersList";
import TabTransition from "./components/TabTransition";

const tabs = [
  {
    key: "posts",
    label: "Home",
    icon: <RiHome5Line />,
    activeIcon: <RiHome5Fill />,
  },
  {
    key: "chat",
    label: "Chats",
    icon: <RiChat3Line />,
    activeIcon: <RiChat3Fill />,
  },
  {
    key: "send_Request",
    label: "Explore",
    icon: <RiUserAddLine />,
    activeIcon: <RiUserAddFill />,
  },
  {
    key: "notifications",
    label: "Alerts",
    icon: <RiBellLine />,
    activeIcon: <RiBellFill />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <RiUserLine />,
    activeIcon: <RiUserFill />,
  },
];

const tabContent = {
  posts: <Posts />,
  chat: <UsersList />,
  send_Request: <Profilelist />,
  notifications: <NotificationPage />,
  profile: <Profile />,
};

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 🧱 Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <TabTransition tabKey={activeTab}>
            {tabContent[activeTab] || <Posts />}
          </TabTransition>
        </AnimatePresence>
      </div>

      {/* 🔽 Bottom Nav */}
      <div className="relative">
        {/* Glassmorphic bar */}
        <div className="h-[72px] bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-2 pb-1 safe-bottom">
          {tabs.map((tab) => (
            <BottomItem
              key={tab.key}
              icon={tab.icon}
              activeIcon={tab.activeIcon}
              label={tab.label}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
