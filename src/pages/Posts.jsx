import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiHeart3Line, RiHeart3Fill,
  RiShareForwardLine,
  RiDeleteBinLine,
  RiAddLine,
} from "react-icons/ri";
import { fetchPosts, toggleLike, deletePost } from "../api/services/userServices";
import CreatePostModal from "../components/CreatePostModal";
import PageLoader from "../components/PageLoader";
import { FiRefreshCw } from "react-icons/fi";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Helper: relative time
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const loggedInUserId = Number(localStorage.getItem("id"));

  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetchPosts();
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Handle like toggle
  const handleLike = async (postId) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          is_liked: !p.is_liked,
          like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1,
        };
      })
    );

    try {
      await toggleLike(postId);
    } catch {
      // Revert on error
      loadPosts();
    }
  };

  // Handle delete
  const handleDelete = async (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await deletePost(postId);
    } catch {
      loadPosts();
    }
  };

  // Handle share
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.name}`,
        text: post.content,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(post.content);
    }
  };

  // New post added
  const handlePosted = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Loading
  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageLoader message="Loading posts..." />
      </div>
    );
  }

  // Error
  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <span className="text-3xl">⚠️</span>
          <p className="text-gray-600 font-medium">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadPosts}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium shadow-md"
          >
            <FiRefreshCw size={14} />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/wavechat-logo.png" alt="WaveChat" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-800">Feed</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadPosts}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-purple-600"
          >
            <FiRefreshCw size={16} />
          </motion.button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Create post prompt */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          onClick={() => setCreateOpen(true)}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 text-left"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {localStorage.getItem("name")?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-gray-400 text-sm flex-1">What's on your mind? ✨</span>
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <RiAddLine size={18} />
          </div>
        </motion.button>

        {/* Empty state */}
        {posts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <span className="text-4xl">📝</span>
            <p className="text-gray-600 font-medium">No posts yet</p>
            <p className="text-sm text-gray-400">Be the first to share something!</p>
          </motion.div>
        )}

        {/* Posts feed */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Post header */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                {post.author.profile_pic ? (
                  <img
                    src={post.author.profile_pic}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                    {post.author.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{post.author.name}</p>
                  <p className="text-[11px] text-gray-400">{timeAgo(post.created_at)}</p>
                </div>
                {post.author.id === loggedInUserId && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(post.id)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 transition"
                  >
                    <RiDeleteBinLine size={16} />
                  </motion.button>
                )}
              </div>

              {/* Content */}
              <p className="px-4 py-2 text-gray-700 text-[14.5px] leading-relaxed">
                {post.content}
              </p>

              {/* Image */}
              {post.image_url && (
                <div className="px-4 pb-2">
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full rounded-xl object-cover max-h-72"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 px-3 py-2 border-t border-gray-50">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${post.is_liked
                      ? "text-red-500 bg-red-50"
                      : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {post.is_liked ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <RiHeart3Fill size={18} />
                    </motion.div>
                  ) : (
                    <RiHeart3Line size={18} />
                  )}
                  {post.like_count > 0 && post.like_count}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                >
                  <RiShareForwardLine size={18} />
                  Share
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FAB - Create Post */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200 flex items-center justify-center z-30"
      >
        <RiAddLine size={26} />
      </motion.button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onPosted={handlePosted}
      />
    </div>
  );
};

export default Posts;
