import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../components/ProfileCard";
import { fetchUsers } from "../slices/userSlice";
import { fetchallRequests, acceptFriendRequest, rejectFriendRequest } from "../api/services/userServices";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "../components/PageLoader";
import { FiMessageCircle, FiRefreshCw, FiChevronDown, FiCheck, FiX } from "react-icons/fi";
import SmallLoader from "../components/SmallLoader";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const UsersList = () => {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((s) => s.users);

  // Pending requests state
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsExpanded, setRequestsExpanded] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // tracks which request is loading

  // ⭐ always fetch fresh data on mount
  useEffect(() => {
    dispatch(fetchUsers());
    loadPendingRequests();
  }, [dispatch]);

  const loadPendingRequests = async () => {
    try {
      const res = await fetchallRequests();
      setPendingRequests(res.data);
    } catch (err) {
      console.error("Error fetching pending requests", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      await acceptFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
      dispatch(fetchUsers()); // refresh friends list
    } catch (err) {
      console.error("Accept failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await rejectFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Reject failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  const acceptedUsers = (users || []).filter((u) => u.status === "ACCEPTED");

  // Loading state
  if (loading && users.length === 0) {
    return <PageLoader message="Loading your chats..." />;
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-gray-600 font-medium">Couldn't load your chats</p>
        <p className="text-sm text-gray-400">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(fetchUsers())}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium shadow-md"
        >
          <FiRefreshCw size={14} />
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Inline refresh indicator */}
      {loading && users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="sticky top-0 z-10 flex items-center justify-center py-2 bg-purple-50 border-b border-purple-100"
        >
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-xs text-purple-600 font-medium">Refreshing...</span>
        </motion.div>
      )}

      {/* ======= Pending Requests Banner ======= */}
      <AnimatePresence>
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-3 mt-4 rounded-2xl overflow-hidden"
          >
            {/* Banner header */}
            <motion.button
              onClick={() => setRequestsExpanded(!requestsExpanded)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm">👋</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Friend Requests</p>
                  <p className="text-xs text-white/70">
                    {pendingRequests.length} pending {pendingRequests.length === 1 ? "request" : "requests"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-purple-600 text-xs font-bold flex items-center justify-center">
                  {pendingRequests.length}
                </span>
                <motion.div
                  animate={{ rotate: requestsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown size={18} />
                </motion.div>
              </div>
            </motion.button>

            {/* Expanded request cards */}
            <AnimatePresence>
              {requestsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-2">
                    {pendingRequests.map((req, index) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100"
                      >
                        {/* Avatar */}
                        {req.sender.profile_pic ? (
                          <img
                            src={req.sender.profile_pic}
                            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                            alt=""
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {req.sender.name?.[0]?.toUpperCase()}
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">
                            {req.sender.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {req.sender.email}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {actionLoading === req.id ? (
                            <SmallLoader size={18} />
                          ) : (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAccept(req.id)}
                                className="w-9 h-9 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition"
                                title="Accept"
                              >
                                <FiCheck size={18} strokeWidth={2.5} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleReject(req.id)}
                                className="w-9 h-9 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
                                title="Reject"
                              >
                                <FiX size={18} strokeWidth={2.5} />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======= Accepted Friends List ======= */}
      {acceptedUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-3"
        >
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
            <FiMessageCircle className="text-2xl text-purple-400" />
          </div>
          <p className="text-gray-600 font-medium">No friends yet</p>
          <p className="text-sm text-gray-400">Start sending requests to connect! 👋</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(fetchUsers())}
            className="flex items-center gap-2 px-5 py-2.5 mt-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"
          >
            <FiRefreshCw size={14} />
            Refresh
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 p-3 mt-4"
        >
          {acceptedUsers.map((user, index) => (
            <motion.div key={user.id} variants={itemVariants}>
              <ProfileCard profile={user} index={index} send />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UsersList;
