import React, { useEffect, useState } from "react";
// import { getProfiles } from "../supabase";
import { useNavigate } from "react-router-dom";
// import { getSession } from "../supabase";
import axios from "axios";
// import { allUsers } from "../api";
import { allUsers } from "../api/services/userServices";
import ProfileCard from "../components/ProfileCard";
import { FiLoader } from "react-icons/fi";


const Profilelist = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  // console.log(JSON.parse(localStorage.getItem("user")));


  // const getallProfiles = async () => {
  //   const response = await getProfiles();
  //   return response;
  // };


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
    const uid=localStorage.getItem("id")
    const fetchUsers = async () => {
      try {
        const users = await allUsers()
        setProfiles(users.data.filter((item)=>item.id!=uid))
      } catch (e) {
        console.log(e)
      }
    };
    fetchUsers();
  }, []);


  return (
  <div className="min-h-screen  bg-slate-100  relative ">

    {/* Top Bar */} 
    {/* <div className=" w-screen  bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Messages
        </h1>
      </div>
    </div> */}

    {/* Content */}
    <div className="w-full h-full ">

      {profiles.length > 0 ? (
        <div className="grid gap-4">
          {profiles.map((p, index) => (
            <ProfileCard
              key={p.id}
              profile={p}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <FiLoader className="animate-spin text-5xl mb-4" />
          <p className="text-sm">Loading conversations…</p>
        </div>
      )}
    </div>
  </div>
);

};

export default Profilelist;
