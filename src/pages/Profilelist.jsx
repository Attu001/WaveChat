import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { fetchUsers } from "../slices/userSlice";
import { motion } from "framer-motion";
import PageLoader from "../components/PageLoader";
import { FiUsers, FiRefreshCw } from "react-icons/fi";

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

const Profilelist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: profiles, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredProfiles = profiles?.filter(
    (p) => p.status !== "ACCEPTED"
  );

  // Loading state
  if (loading && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100">
        <PageLoader message="Finding people for you..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-gray-600 font-medium">Something went wrong</p>
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
      </div>
    );
  }

  // Empty state
  if (filteredProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-3"
        >
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
            <FiUsers className="text-2xl text-purple-400" />
          </div>
          <p className="text-gray-600 font-medium">No new people to connect with</p>
          <p className="text-sm text-gray-400">Check back later for new users!</p>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 relative">
      {/* Inline refresh indicator */}
      {loading && profiles.length > 0 && (
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

      <div className="w-full h-full p-3">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-3"
        >
          {filteredProfiles.map((p, index) => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProfileCard profile={p} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Profilelist;
