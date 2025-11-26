import React, { useEffect, useState } from "react";
import { LuCircleCheck } from "react-icons/lu";

const Success = ({ message = "Action completed successfully!" }) => {
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
        <div className="text-green-400 mb-6 animate-bounce">
          <LuCircleCheck size={60} />
        </div>

        {/* Text */}
        <h1 className="text-white text-3xl font-bold mb-2 animate-pulse">Success!</h1>
        <p className="text-white/90 text-lg text-center">{message}</p>
        
      </div>
    </div>
  );
};

export default Success;
