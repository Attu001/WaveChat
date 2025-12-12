import React, { useEffect, useState } from "react";
import { getProfiles } from "../supabase";
import { useNavigate } from "react-router-dom";
import { getSession } from "../supabase";
import axios from "axios";
import { allUsers } from "../api";


const Profilelist = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  // console.log(JSON.parse(localStorage.getItem("user")));
  

  const getallProfiles = async () => {
    const response = await getProfiles();
    return response;
  };


  const timeConverter = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    return hours + ":" + minutes.substr(-2);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
     try{
        const users= await allUsers()
        // console.log(users)
        setProfiles(users)
      }catch(e){
      console.log(e)
     }
    };

    fetchUsers();
  }, [timeConverter]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffd1ff] via-[#ffe4f3] to-[#d3faff] p-8 relative overflow-hidden">

      {/* Floating Shapes */}
      <div className="absolute w-72 h-72 bg-pink-300 blur-3xl opacity-30 rounded-full -top-24 -left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-blue-300 blur-3xl opacity-30 rounded-full -bottom-24 -right-10 animate-pulse"></div>

      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black text-3xl font-extrabold drop-shadow-lg tracking-wide">
          Chat List
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-xl shadow-md text-black font-semibold border border-white/30 hover:bg-white/60 transition-all"
          >
            Home
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-xl shadow-md font-semibold hover:bg-gray-900 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-5">
        {profiles
          .filter(p => p.email !== JSON.parse(localStorage.getItem("user")).email)
          .sort((a, b) => a - b)
          .map((p, index) => (
            <div
              key={p.id}
              className="
              group flex items-center gap-5 p-5 rounded-3xl 
              bg-white/50 backdrop-blur-xl border border-white/30
              shadow-lg cursor-pointer
              hover:shadow-2xl hover:scale-[1.02]
              transition-all duration-300
            "
              onClick={() => navigate(`/chat-screen/${p?.id}`)}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="
                w-16 h-16 rounded-2xl 
                bg-gradient-to-br from-purple-500 to-blue-500 
                flex items-center justify-center text-xl font-bold text-white shadow-md
                group-hover:rotate-6 transition-all 
              ">
                  {p.name.charAt(0).toUpperCase()}
                </div>

                {/* Online Dot */}
                <span
                  className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ${p.online ? "bg-green-400" : "bg-gray-400"
                    } border-2 border-white`}
                ></span>
              </div>

              {/* User Text */}
              <div className="flex-1">
                <p className="text-black font-semibold text-lg">
                  {p.name}
                </p>
                <p className="text-gray-700 text-sm opacity-80">
                  Joined: {timeConverter(p?.created_at)}
                </p>
              </div>

              {/* Time */}
              <p className="text-gray-900 text-xs font-medium">
                {p.time}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profilelist;
