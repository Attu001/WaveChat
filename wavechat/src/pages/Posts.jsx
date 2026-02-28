import React from "react";
import { motion } from "framer-motion";

const dummyPosts = [
  {
    id: 1,
    title: "First Dummy Post",
    author: "Admin",
    date: "5 Jan 2026",
    content:
      "This is a dummy post content. You can replace this with real data coming from your API.",
  },
  {
    id: 2,
    title: "Inspection Update",
    author: "John Doe",
    date: "3 Jan 2026",
    content:
      "Inspection has been completed successfully. All rooms are in good condition and ready for the next phase.",
  },
  {
    id: 3,
    title: "Maintenance Notice",
    author: "Property Manager",
    date: "1 Jan 2026",
    content:
      "Scheduled maintenance will take place this weekend. Please ensure personal belongings are secured.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Posts = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          Latest Posts
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dummyPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              className="bg-white rounded-xl shadow-sm p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                By {post.author} • {post.date}
              </p>

              <p className="text-gray-700 leading-relaxed">
                {post.content}
              </p>

              <div className="flex gap-3 mt-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Like
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Comment
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Posts;
