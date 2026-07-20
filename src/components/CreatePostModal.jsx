import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiImage, FiSend } from "react-icons/fi";
import { createPost } from "../api/services/userServices";
import { uploadProfilePic } from "../supabase";

const CreatePostModal = ({ isOpen, onClose, onPosted }) => {
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef(null);

    const userId = localStorage.getItem("id");

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImagePreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
        setImageFile(file);
        setError("");
    };

    const removeImage = () => {
        setImagePreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setImageFile(null);
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError("Write something to post!");
            return;
        }

        try {
            setUploading(true);
            setError("");

            let imageUrl = "";
            if (imageFile) {
                imageUrl = await uploadProfilePic(imageFile, `post_${userId}`);
            }

            const res = await createPost({
                content: content.trim(),
                image_url: imageUrl,
            });

            onPosted(res.data);
            setContent("");
            setImageFile(null);
            setImagePreview((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to create post. Try again.");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Create Post</h3>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
                        >
                            <FiX size={18} />
                        </motion.button>
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind? ✨"
                        rows={4}
                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                        maxLength={500}
                    />

                    {/* Character count */}
                    <p className={`text-[11px] text-right mt-1 ${content.length > 450 ? "text-red-400" : "text-gray-400"}`}>
                        {content.length}/500
                    </p>

                    {/* Image preview */}
                    {imagePreview && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative mt-3 rounded-2xl overflow-hidden"
                        >
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-h-48 object-cover rounded-2xl"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
                            >
                                <FiX size={14} />
                            </button>
                        </motion.div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fileRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium"
                        >
                            <FiImage size={16} />
                            Photo
                        </motion.button>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={uploading || !content.trim()}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all ${uploading || !content.trim()
                                ? "bg-gray-200 text-gray-400"
                                : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                }`}
                        >
                            {uploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <FiSend size={14} />
                                    Post
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreatePostModal;
