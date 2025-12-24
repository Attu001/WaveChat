import React, { useState } from "react";
// import { getProfileByEmail, getSession } from "../supabase";
import { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import {getProfileByUserId} from '../api'

const Profile = () => {

  const [profile,setProfile]=useState()

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const access = localStorage.getItem("access")
      if (!access) return;

      try {
        const id=localStorage.getItem("id")
        const data = await getProfileByUserId(id);
        setProfile(data)
        localStorage.setItem("User_id", data.id);
      } catch (err) {
        console.log("Error getting profile:", err);
      }
    };
    fetchProfile();
  },[]);




  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500 flex items-center justify-center py-14 px-6 relative overflow-hidden">



      {/* BACKGROUND GLOW ELEMENTS */}
      <div className="absolute top-10 right-20 w-56 h-56 bg-purple-400/30 blur-[90px] rounded-full"></div>
      <div className="absolute bottom-20 left-24 w-72 h-72 bg-blue-400/30 blur-[100px] rounded-full"></div>

      {/* CARD */}
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-12 w-full max-w-3xl relative 
                    transform hover:scale-[1.01] transition-all duration-500">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/home")}
          className="absolute top-8 left-8 z-50 flex items-center gap-2 px-5 py-2.5 
                  bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg 
                  rounded-xl border border-white/20 transition-all duration-300 
                  shadow-md hover:shadow-2xl hover:scale-105" 
        >
          <IoMdArrowBack className="text-2xl" />
          <span className="font-medium">Back</span>
        </button>

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center relative">

          {/* ANIMATED PROFILE RING */}
          <div className="absolute -top-16 w-48 h-48 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 blur-3xl opacity-40 animate-pulse"></div>

          {profile?.img_url ? (
            <img
              src={profile.img_url}
              alt="profile"
              className="w-36 h-36 rounded-full ring-4 ring-white shadow-xl object-cover 
                      hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 
                          flex items-center justify-center text-white text-6xl font-bold shadow-xl 
                          ring-4 ring-white hover:scale-105 transition-all duration-300">
              {profile?.name ? profile.name[0].toUpperCase():"a"}
            </div>
          )}

          <h1 className="mt-6 text-4xl font-extrabold text-white tracking-wide drop-shadow-md capitalize">
            {profile?.name || "Anonymous"}
          </h1>

          <p className="text-white/80 text-sm mt-1 tracking-wide">
            {profile?.email}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 h-[1px] w-full bg-white/30"></div>

        {/* PERSONAL INFORMATION */}
        <div className="mt-10 space-y-6">

          <div className="bg-white/30 backdrop-blur-xl p-7 rounded-2xl shadow-lg border border-white/40 
                        hover:shadow-2xl hover:bg-white/40 transition-all duration-300">

            <h2 className="text-xl font-bold text-white tracking-wider border-b border-white/40 pb-3">
              {/* Personal Information */}
            </h2>

            <div className="mt-5 space-y-4 text-white/90 leading-relaxed">
              <p> 
                <span className="font-semibold text-white">Email:</span> {profile?.email}
              </p>
              <p>
                <span className="font-semibold text-white">Phone:</span>{" "}
                {profile?.number || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-white">Date Joined:</span>{" "}
                {/* {convertedDate ? convertedDate.toLocaleDateString() : "Not available"} */}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

};

export default Profile;