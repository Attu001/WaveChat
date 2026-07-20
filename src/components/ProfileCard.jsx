import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendFriendRequest, acceptFriendRequest } from "../api/services/userServices";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../slices/userSlice";
import SmallLoader from "../components/SmallLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiSend, FiMessageCircle } from "react-icons/fi";
import { useEffect } from "react";

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Consolidated State Management
  const [localState, setLocalState] = useState({
    status: profile.status,
    requestId: profile.request_id,
    loader: false,
    toast: null
  });

  // 2. Strict Prop Synchronization
  // This ensures the card updates if the users list refreshes in the background
  useEffect(() => {
    setLocalState(prev => ({
      ...prev,
      status: profile.status,
      requestId: profile.request_id
    }));
  }, [profile.status, profile.request_id]);

  const showToast = (type, message) => {
    setLocalState(prev => ({ ...prev, toast: { type, message } }));
    setTimeout(() => setLocalState(prev => ({ ...prev, toast: null })), 2500);
  };

  const handleNavigate = () => {
    navigate(`/chat-screen?id=${profile.id}`, {
      state: { userId: profile.id },
    });
  };

  // 3. Robust Action Handlers
  const sendRequest = async (e) => {
    e.stopPropagation();
    try {
      setLocalState(prev => ({ ...prev, loader: true }));
      const res = await sendFriendRequest(profile.id);

      const newStatus = res.data?.status || "PENDING_SENT";
      const newRequestId = res.data?.request_id || null;

      setLocalState(prev => ({
        ...prev,
        status: newStatus,
        requestId: newRequestId
      }));

      showToast("success", res.data?.message || "Request sent! 🎉");
      dispatch(fetchUsers());
    } catch (err) {
      const errorData = err?.response?.data;
      if (errorData?.status) {
        // Business logic error (e.g. they already sent us a request)
        setLocalState(prev => ({
          ...prev,
          status: errorData.status,
          requestId: errorData.request_id || prev.requestId
        }));
        showToast("info", errorData.error || "Please check existing request");
      } else {
        showToast("error", "Couldn't send request");
      }
    } finally {
      setLocalState(prev => ({ ...prev, loader: false }));
    }
  };

  const acceptRequest = async (e) => {
    e.stopPropagation();
    try {
      setLocalState(prev => ({ ...prev, loader: true }));
      const rid = localState.requestId || profile.request_id;

      if (!rid) {
        showToast("error", "Request ID missing. Refreshing...");
        dispatch(fetchUsers());
        return;
      }

      await acceptFriendRequest(rid);
      setLocalState(prev => ({ ...prev, status: "ACCEPTED" }));
      showToast("success", "Friend added! 🤝");
      dispatch(fetchUsers());
    } catch (err) {
      showToast("error", "Couldn't accept request");
    } finally {
      setLocalState(prev => ({ ...prev, loader: false }));
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

  // 4. Standardized Render Mapping
  const renderButton = () => {
    const { status, loader } = localState;

    switch (status) {
      case "NONE":
        return (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendRequest}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-nowrap text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
          >
            {loader ? <SmallLoader size={16} /> : <><FiSend size={14} /> Add Friend</>}
          </motion.button>
        );

      case "PENDING_SENT":
        return (
          <button disabled className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-xl cursor-not-allowed border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-amber-400" /> Pending
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
            {loader ? <SmallLoader size={16} /> : <><FiCheck size={14} strokeWidth={2.5} /> Accept</>}
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
            <FiMessageCircle size={14} /> Chat
          </motion.button>
        );

      default: return null;
    }
  };

  const { toast } = localState;
  const status_val = localState.status;

  return (
    <div
      onClick={status_val === "ACCEPTED" ? handleNavigate : undefined}
      className={`group relative flex w-full items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all border border-slate-200 ${status_val === "ACCEPTED" ? "cursor-pointer" : "cursor-default"}`}
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
