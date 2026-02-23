import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendFriendRequest, acceptFriendRequest } from "../api/services/userServices";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../slices/userSlice";
import SmallLoader from "../components/SmallLoader"

const ProfileCard = ({ profile, send }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ✅ local status state (important)
  const [status, setStatus] = useState(profile.status);
  const [loader, setLoader] = useState(false);

  const handleNavigate = () => {
    navigate(`/chat-screen?id=${profile.id}`, {
      state: { userId: profile.id },
    });
  };

  // SEND REQUEST
  const sendRequest = async (e) => {
    e.stopPropagation();
    try {
      setLoader(true);
      const res = await sendFriendRequest(profile.id);
      // ✅ instantly change UI → Pending
      setStatus("PENDING_SENT");
      dispatch(fetchUsers()); // refresh list to update request_id for receiver`
      setLoader(false);
    } catch (err) {
      alert("Failed to send request");
      setLoader(false);
    }
  };

  // ACCEPT REQUEST
  const acceptRequest = async (e) => {
    e.stopPropagation();
    try {
      setLoader(true);
      await acceptFriendRequest(profile.request_id);


      // ✅ instantly change UI → Accepted
      setStatus("ACCEPTED");
      setLoader(false);
      dispatch(fetchUsers()); // refresh list to update request_id for sender
    } catch (err) {
      alert("Failed to accept request");
    }
  };

  // BUTTON RENDER LOGIC
  const renderButton = () => {
   

    switch (status) {
      case "NONE":
        return (
          <button
            onClick={sendRequest}
            className="px-4 py-2 bg-blue-500 text-nowrap text-white rounded hover:bg-blue-600 transition"
          >
            {loader ? 
            
            <SmallLoader size={16} className="ml-2" />
             :
             "Send Request"}
          </button>
        );

      case "PENDING_SENT":
        return (
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Pending
          </button>
        );

      case "PENDING_RECEIVED":
        return (
          <button
            onClick={acceptRequest}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
           {loader ? "Accepting..." : "Accept"}
          </button>
        );

      case "ACCEPTED":
        return (
          <button
            onClick={handleNavigate}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Chat
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={!send ? handleNavigate : undefined}
      className="group flex w-full items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md cursor-pointer transition-all border border-slate-200"
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

  
      <div className="flex-1">
        <p className="font-medium text-slate-900">{profile.name}</p>
        <p className="text-sm text-slate-500 truncate">
          {profile.name.toLowerCase().replace(/\s/g, "")}@wavechat.com
        </p>
      </div>

      {/* Action Button */}
      {renderButton()}
    </div>
  );
};

export default ProfileCard;
