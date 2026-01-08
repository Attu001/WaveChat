import React, { useEffect, useRef, useState } from "react";
import { FiLogOut, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router";
import { getProfileByUserId } from "../api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasfetched=useRef(false)


  useEffect(() => {
    if(hasfetched.current) return;
    hasfetched.current=true;

    const loadProfile = async () => {
      try {
        const id = localStorage.getItem("id");
        const data = await getProfileByUserId(id);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
  <div className="flex-1 overflow-y-auto bg-gray-100 pb-24">

    {/* Header */}
    <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-6 pt-10 pb-16">
      <div className="flex items-center gap-5">
        {profile?.img_url ? (
          <img
            src={profile.img_url}
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white text-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg">
            {profile?.name?.[0]?.toUpperCase() || "A"}
          </div>
        )}

        <div className="text-white">
          <h2 className="text-2xl font-semibold capitalize">
            {profile?.name}
          </h2>
          <p className="text-sm opacity-90">{profile?.email}</p>
        </div>
      </div>
    </div>

    {/* Stats
    <div className="-mt-10 mx-4 bg-white rounded-2xl shadow-md px-6 py-4 flex justify-between">
      <Stat label="Posts" value="12" />
      <Stat label="Chats" value="5" />
      <Stat label="Alerts" value="3" />
    </div> */}

    {/* Actions */}
    <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm divide-y">
      <button className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50 transition">
        <FiEdit className="text-purple-600" />
        <span className="font-medium">Edit Profile</span>
      </button>

      <button
        onClick={() => navigate("/login")}
        className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition"
      >
        <FiLogOut />
        <span className="font-medium">Logout</span>
      </button>
    </div>

    {/* Personal Info */}
    <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm px-5 py-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
        Personal Information
      </h4>

      <InfoRow label="Email" value={profile?.email} />
      <InfoRow label="Phone" value={profile?.number || "Not available"} />
    </div>
  </div>
);
};

export default Profile;

const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-none">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);
