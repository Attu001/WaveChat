import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ profile, index }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        group flex items-center gap-5 p-5 rounded-3xl 
        bg-white/50 backdrop-blur-xl border border-white/30
        shadow-lg cursor-pointer
        hover:shadow-2xl hover:scale-[1.02]
        transition-all duration-300
      "
      onClick={() => navigate(`/chat-screen/${profile?.id}`)}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className="
            w-16 h-16 rounded-2xl 
            bg-gradient-to-br from-purple-500 to-blue-500 
            flex items-center justify-center text-xl font-bold text-white shadow-md
            group-hover:rotate-6 transition-all
          "
        >
          {profile?.name?.charAt(0).toUpperCase()}
        </div>

        {/* Online Status */}
        <span
          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ${
            profile?.online ? "bg-green-400" : "bg-gray-400"
          } border-2 border-white`}
        ></span>
      </div>

      {/* User Info */}
      <div className="flex-1">
        <p className="text-black font-semibold text-lg">
          {profile?.name}
        </p>
      </div>

      {/* Time */}
      {profile?.time && (
        <p className="text-gray-900 text-xs font-medium">
          {profile.time}
        </p>
      )}
    </div>
  );
};

export default ProfileCard;
