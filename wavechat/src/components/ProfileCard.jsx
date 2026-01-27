import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ profile, index }) => {
  const navigate = useNavigate();

  const handleNavigate=()=>{
    navigate(`/chat-screen?id=${profile.id}`, {state: {userId: profile.id,},});}

  return (
    <div
      onClick={() => handleNavigate()}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md cursor-pointer transition-all border border-slate-200"
    >
      {/* Avatar */}
      {profile.img_url ? (
        <img
          src={profile.img_url}
          className="w-12 h-12 rounded-full object-cover"
          alt=""
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
          {profile.name?.[0]?.toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="flex-1">
        <p className="font-medium text-slate-900">
          {profile.name}
        </p>
        <p className="text-sm text-slate-500 truncate">
          Tap to start conversation
        </p>
      </div>

      {/* Status Dot */}
      <div className="w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition" />
    </div>
  );
};



export default ProfileCard;
