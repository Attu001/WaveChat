import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendFriendRequest, acceptFriendRequest } from "../api/services/userServices";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../slices/userSlice";
import SmallLoader from "../components/SmallLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiSend, FiMessageCircle } from "react-icons/fi";

const ProfileCard = ({ profile, send }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ✅ local status state (important)
  const [status, setStatus] = useState(profile.status);
  const [loader, setLoader] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

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
      await sendFriendRequest(profile.id);
      setStatus("PENDING_SENT");
      showToast("success", "Request sent! 🎉");
      dispatch(fetchUsers());
    } catch (err) {
      // If request already exists, just flip to pending
      if (err?.response?.status === 400) {
        setStatus("PENDING_SENT");
        showToast("info", "Request already sent");
      } else {
        showToast("error", "Couldn't send request");
      }
    } finally {
      setLoader(false);
    }
  };

  // ACCEPT REQUEST
  const acceptRequest = async (e) => {
    e.stopPropagation();
    try {
      setLoader(true);
      await acceptFriendRequest(profile.request_id);
      setStatus("ACCEPTED");
      showToast("success", "Friend added! 🤝");
      dispatch(fetchUsers());
    } catch (err) {
      showToast("error", "Couldn't accept request");
    } finally {
      setLoader(false);
    }
  };

  // Toast color mapping
  const toastStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-purple-500",
  };

  const toastIcons = {
    success: <FiCheck size={14} />,
    error: <FiX size={14} />,
    info: <FiSend size={14} />,
  };

  // BUTTON RENDER LOGIC
  const renderButton = () => {
    switch (status) {
      case "NONE":
        return (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendRequest}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-nowrap text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
          >
            {loader ? (
              <SmallLoader size={16} />
            ) : (
              <>
                <FiSend size={14} />
                Add Friend
              </>
            )}
          </motion.button>
        );

      case "PENDING_SENT":
        return (
          <button
            disabled
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-xl cursor-not-allowed border border-gray-200"
          >
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            Pending
          </button>
        );

      case "PENDING_RECEIVED":
        return (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={acceptRequest}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all"
          >
            {loader ? (
              <SmallLoader size={16} />
            ) : (
              <>
                <FiCheck size={14} strokeWidth={2.5} />
                Accept
              </>
            )}
          </motion.button>
        );

      case "ACCEPTED":
        return (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigate}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
          >
            <FiMessageCircle size={14} />
            Chat
          </motion.button>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={status === "ACCEPTED" ? handleNavigate : undefined}
      className={`group relative flex w-full items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all border border-slate-200 ${status === "ACCEPTED" ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Inline Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute -top-3 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-lg ${toastStyles[toast.type]}`}
          >
            {toastIcons[toast.type]}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar */}
      {profile.profile_pic ? (
        <img
          src={profile.profile_pic}
          className="w-12 h-12 rounded-full object-cover"
          alt=""
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
          {profile.name?.[0]?.toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
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
