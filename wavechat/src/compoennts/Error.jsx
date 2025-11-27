import React from 'react'
import { PiWarningCircle } from "react-icons/pi";
import { useState,useEffect } from 'react';
const Error = ({message="!Something went Wrong "}) => {

      const [show, setShow] = useState(true);
    
     // Auto-hide after 3 seconds (optional)
      useEffect(() => {
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
      }, []);
    
      if (!show) return null;
  return (
   <div className="absolute w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400">
         
         {/* Glass Card */}
         <div className="p-10 rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30 flex flex-col items-center z-50">
           
           {/* Success Icon */}
           <div className="text-yellow-400 mb-6 animate-bounce">
            <PiWarningCircle  size={60} />
           </div>
   
           {/* Text */}
           <h1 className="text-yellow-200 text-3xl font-bold mb-2 animate-pulse">Error!</h1>
           <p className="text-red-500 text-lg text-center">{message}</p>
           
         </div>
       </div>
  )
}

export default Error