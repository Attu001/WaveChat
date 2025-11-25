import React from "react";

const Loading = () => {
  return (
    <div className="absolute z-50 w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400">
      
      {/* Glass Card */}
      <div className="p-8 rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30 flex flex-col items-center">
        
        {/* Spinner */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          
          <div className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          
          <div className="absolute w-10 h-10 rounded-full bg-white/30 backdrop-blur-lg animate-ping"></div>
        </div>

        {/* Text */}
        <p className="mt-6 text-white text-xl font-semibold tracking-wide animate-pulse">
          Loading...
        </p>

      </div>
    </div>
  );
};

export default Loading;
