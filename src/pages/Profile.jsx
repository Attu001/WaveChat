import React, { useEffect, useRef, useState } from "react";
import { FiLogOut, FiEdit, FiMoon, FiSun, FiSettings, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router";
import { getProfileByUserId } from "../api/services/userServices";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { ProfileSkeleton } from "../components/SkeletonLoader";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const hasfetched = useRef(false);

  useEffect(() => {
    if (hasfetched.current) return;
    hasfetched.current = true;

    const loadProfile = async () => {
      try {
        const data = await getProfileByUserId();
        setProfile(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleProfileSaved = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 overflow-y-auto pb-24"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        className="relative px-6 pt-10 pb-16"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="flex items-center gap-5">
          {profile?.profile_pic ? (
            <img
              src={profile.profile_pic}
              alt="profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold shadow-lg"
              style={{ color: 'var(--color-primary)' }}
            >
              {profile?.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}

          <div className="text-white">
            <h2 className="text-2xl font-semibold capitalize">
              {profile?.name}
            </h2>
            <p className="text-sm opacity-90">{profile?.email}</p>
            {profile?.bio && (
              <p className="text-sm opacity-80 mt-1 line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        variants={itemVariants}
        className="mx-4 mt-4 rounded-2xl shadow-sm divide-y"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEditOpen(true)}
          className="w-full flex items-center gap-3 px-5 py-4 transition rounded-t-2xl"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <FiEdit style={{ color: 'var(--color-primary)' }} />
          <span className="font-medium">Edit Profile</span>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-5 py-4 transition"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {isDark ? <FiSun style={{ color: 'var(--color-accent)' }} /> : <FiMoon style={{ color: 'var(--color-primary)' }} />}
          <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-5 py-4 transition"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <FiSettings style={{ color: 'var(--color-text-tertiary)' }} />
          <span className="font-medium">Settings</span>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-5 py-4 transition rounded-b-2xl"
          style={{ color: '#ef4444' }}
        >
          <FiLogOut />
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>

      {/* Personal Info */}
      <motion.div
        variants={itemVariants}
        className="mx-4 mt-4 rounded-2xl shadow-sm px-5 py-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h4 className="text-xs font-semibold uppercase mb-3"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Personal Information
        </h4>

        <InfoRow label="Email" value={profile?.email} />
        <InfoRow label="Phone" value={profile?.phone || "Not available"} />
        <InfoRow label="Bio" value={profile?.bio || "No bio yet"} />
      </motion.div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfileModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          profile={profile}
          onSave={handleProfileSaved}
        />
      )}
    </motion.div>
  );
};

export default Profile;

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-none"
    style={{ borderColor: 'var(--color-border)' }}
  >
    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
  </div>
);