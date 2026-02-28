import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiX, FiCheck } from "react-icons/fi";
import { uploadProfilePic } from "../supabase";
import { updateProfile } from "../api/services/userServices";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 40,
        transition: { duration: 0.2 },
    },
};

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
    const [form, setForm] = useState({
        name: profile?.name || "",
        bio: profile?.bio || "",
        phone: profile?.phone || "",
        profile_pic: profile?.profile_pic || "",
    });
    const [previewUrl, setPreviewUrl] = useState(profile?.profile_pic || "");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImagePick = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        setError("");
        setUploading(true);

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

        try {
            const userId = localStorage.getItem("id");
            const publicUrl = await uploadProfilePic(file, userId);
            setForm((prev) => ({ ...prev, profile_pic: publicUrl }));
            setPreviewUrl(publicUrl);
        } catch (err) {
            console.error("Upload failed:", err);
            setError("Failed to upload image. Please try again.");
            setPreviewUrl(profile?.profile_pic || "");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setError("Name is required");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const res = await updateProfile(form);
            onSave(res.data);
            onClose();
        } catch (err) {
            console.error("Save failed:", err);
            setError("Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const initials = (profile?.name || "A").charAt(0).toUpperCase();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
                            >
                                <FiX size={18} />
                            </motion.button>
                        </div>

                        {/* Profile Picture */}
                        <div className="flex justify-center -mt-12 relative z-10">
                            <div className="relative">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="profile"
                                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                                        {initials}
                                    </div>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => fileRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg border-2 border-white"
                                >
                                    {uploading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <FiCamera size={14} />
                                    )}
                                </motion.button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImagePick}
                                />
                            </div>
                        </div>

                        {/* Form */}
                        <div className="px-6 pt-4 pb-6 space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                                    placeholder="Tell something about yourself..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Phone
                                </label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            {/* Save Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                disabled={saving || uploading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck size={18} />
                                        Save Changes
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
