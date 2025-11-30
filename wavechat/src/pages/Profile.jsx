import React from "react";
import { getProfileByEmail, getSession } from "../supabase";
import { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import {useNavigate} from "react-router";


const Profile = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const data = await getProfileByEmail(user.email);
        localStorage.setItem("profile", JSON.stringify(data));
        // console.log(data);
      } catch (err) {
        console.log("Error getting profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const getSessionData = async () => {
    try {
      const session = await getSession();
      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log("Error getting session:", err);
    }
  };

  useEffect(() => {
    getSessionData();
  }, []);

  const profile = JSON.parse(localStorage?.getItem("profile"))
  console.log(localStorage.getItem("profile"));
  const convertedDate = profile?.created_at ? new Date(profile.created_at) : null;



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center py-16 px-6">
      <div className="absolute top-8 left-8 z-50" onClick={() => navigate("/home")}>
        <button
          
          className="mb-8 text-black text-xl hover:text-purple-800 font-semibold flex items-center gap-2 p-4"
        ><IoMdArrowBack />

           Back
        </button>

      </div>

      <div className="bg-white/40 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-3xl border border-white/30 relative">

        {/* Floating Glow Effect */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/30 blur-3xl rounded-full"></div>

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center relative">

          {profile?.img_url ? (
            <imgx
              src={profile?.img_url}
              alt="profile"
              className="w-32 h-32 rounded-full shadow-lg border-4 border-white object-cover animate-[pulse_3s_infinite]"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-6xl font-bold shadow-lg border-4 border-white">
              {profile?.fullname ? profile.fullname.charAt(0).toUpperCase() : "A"}
            </div>
          )}


          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-wide drop-shadow-sm">
            {profile?.fullname || "Anonymous"}
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            {profile?.email}
          </p>
        </div>

        {/* PERSONAL INFO */}
        <div className="mt-10 space-y-6">

          <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h2 className="text-gray-800 font-semibold text-xl border-b pb-2">Personal Information</h2>

            <div className="mt-4 space-y-3 text-gray-700 leading-relaxed">
              <p><span className="font-semibold">Email:</span> {profile?.email}</p>
              <p><span className="font-semibold">Phone:</span> {profile?.number || "Not available"}</p>
              <p>
                <span className="font-semibold">Date Joined:</span>{" "}
                {convertedDate ? convertedDate.toLocaleDateString() : "Not available"}
              </p>
            </div>
          </div>


        </div>

      </div>
    </div>
  );

};

export default Profile;