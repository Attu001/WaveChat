import React, { useEffect } from 'react'
import { getProfiles } from '../supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Chats = () => {

  const [users,setUsers]=useState([])
  const navigate=useNavigate()

  useEffect(()=>{
    const fetchProfiles = async () => {
      const profiles = await getProfiles();
      setUsers(profiles);
    }
    fetchProfiles();
  },[])

  return (
  <div className="h-screen  md:flex md:flex-col w-64 bg-purple-100/50 backdrop-blur-md shadow-lg">
        <div className="p-4 font-bold text-lg border-b border-purple-200">Chats</div>
        <div className="flex-1 overflow-y-auto">
          { users?.map((user, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-purple-200 cursor-pointer flex items-center space-x-3"
              onClick={()=>navigate(`/chat-screen/${user.id}`)}
            >
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                {user?.fullname.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{user?.fullname}</span>
            </div>
          ))}
        </div>
      </div>
  )
}

export default Chats