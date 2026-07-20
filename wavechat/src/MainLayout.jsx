import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  RiHome5Line, RiHome5Fill,
  RiChat3Line, RiChat3Fill,
  RiBellLine, RiBellFill,
  RiUserLine, RiUserFill,
  RiCompass3Line, RiCompass3Fill,
  RiUserAddLine, RiUserAddFill,
} from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import BottomItem from "./components/BottomItem";
import Profile from "./pages/Profile";
import Profilelist from "./pages/Profilelist";
import NotificationPage from "./components/NotificationPage";
import Posts from "./pages/Posts";
import UsersList from "./pages/UsersList";
import ExploreFeed from "./pages/ExploreFeed";
import TabTransition from "./components/TabTransition";

const tabs = [
  {
    key: "posts",
    label: "Home",
    icon: <RiHome5Line />,
    activeIcon: <RiHome5Fill />,
  },
  {
    key: "explore",
    label: "Explore",
    icon: <RiCompass3Line />,
    activeIcon: <RiCompass3Fill />,
  },
  {
    key: "people",
    label: "People",
    icon: <RiUserAddLine />,
    activeIcon: <RiUserAddFill />,
  },
  {
    key: "chat",
    label: "Chats",
    icon: <RiChat3Line />,
    activeIcon: <RiChat3Fill />,
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
  explore: <ExploreFeed />,
  people: <Profilelist />,
  chat: <UsersList />,
  notifications: <NotificationPage />,
  profile: <Profile />,
};

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const notifications = useSelector((state) => state.notification?.notifications || []);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
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
        <div
          className="h-[72px] backdrop-blur-xl border-t flex justify-around items-center px-2 pb-1 safe-bottom"
          style={{
            backgroundColor: 'var(--gradient-glass)',
            borderColor: 'var(--color-border)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
          }}
        >
          {tabs.map((tab) => (
            <BottomItem
              key={tab.key}
              icon={tab.icon}
              activeIcon={tab.activeIcon}
              label={tab.label}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              badge={tab.key === "notifications" ? unreadCount : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;