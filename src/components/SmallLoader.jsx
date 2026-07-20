import React from "react";

const SmallLoader = ({ size = 24, className = "" }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative ${className}`}
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-purple-500 animate-spin blur-[1px]" />

      {/* Inner Core Glow */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 opacity-20 blur-sm" />
    </div>
  );
};

export default SmallLoader;