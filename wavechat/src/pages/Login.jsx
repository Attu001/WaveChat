import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { FaGoogle, FaApple } from "react-icons/fa";
import Success from "../components/Success";
import Error from "../components/Error";
import { loginUser } from "../api";
import Loading from "../components/Loading";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("id");
  }, []);

  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setActivePopup("loader");

      const res = await loginUser(user.email, user.password);

      if (res?.access) {
        localStorage.setItem("access", res.access);
        localStorage.setItem("id", res.user_id);
        setActivePopup("success");

        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        const errData = res?.response?.data;
        let errorMsg = "Invalid email or password.";

        if (typeof errData === "string" && !errData.includes("<")) {
          errorMsg = errData;
        } else if (typeof errData === "object" && errData !== null) {
          errorMsg = errData.detail || errData.error || errData.message || errorMsg;
        }

        setMessage(errorMsg);
        setActivePopup("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
      setActivePopup("error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
    },
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f172a, #1e1b4b, #1e293b)'
          : 'linear-gradient(135deg, #6d28d9, #7c3aed, #4f46e5)',
      }}
    >
      {activePopup == "loader" && <Loading />}
      {activePopup == "success" && <Success message="Login Successful! Redirecting..." />}
      {activePopup == "error" && <Error message={message ? message : "Invalid email or password."} />}

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ backgroundColor: isDark ? '#4f46e5' : '#a78bfa' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: isDark ? '#6366f1' : '#c4b5fd' }}
        />
      </div>

      {/* Glassmorphic Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-5xl h-auto md:h-4/5 overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row"
        style={{
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.3)'}`,
        }}
      >
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-extrabold mb-2 text-center md:text-left"
            style={{ color: isDark ? '#f1f5f9' : '#ffffff' }}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mb-8 text-center md:text-left text-base"
            style={{ color: isDark ? 'rgba(148, 163, 184, 0.8)' : 'rgba(255, 255, 255, 0.7)' }}
          >
            Log in to continue chatting with your friends
          </motion.p>

          {/* Social Login Buttons */}
          <motion.div variants={itemVariants} className="flex gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                color: isDark ? '#f1f5f9' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
              }}
            >
              <FaGoogle size={16} />
              Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                color: isDark ? '#f1f5f9' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
              }}
            >
              <FaApple size={16} />
              Apple
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)' }} />
            <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.5)' }}>
              OR CONTINUE WITH EMAIL
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)' }} />
          </motion.div>

          {/* Email Input */}
          <motion.div
            variants={itemVariants}
            className="relative mb-4"
          >
            <FiMail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}
            />
            <input
              name="email"
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.15)',
                color: isDark ? '#f1f5f9' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                '--tw-ring-color': isDark ? '#8b5cf6' : '#a78bfa',
              }}
              onChange={(e) => handleChange(e)}
              value={user.email}
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            variants={itemVariants}
            className="relative mb-2"
          >
            <FiLock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}
            />
            <input
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => handleChange(e)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.15)',
                color: isDark ? '#f1f5f9' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                '--tw-ring-color': isDark ? '#8b5cf6' : '#a78bfa',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </motion.div>

          {/* Remember Me + Forgot Password */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-6"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded"
                style={{ accentColor: isDark ? '#8b5cf6' : '#7c3aed' }}
              />
              <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(148, 163, 184, 0.8)' : 'rgba(255, 255, 255, 0.7)' }}>
                Remember me
              </span>
            </label>
            <button className="text-xs font-semibold hover:underline" style={{ color: isDark ? '#a78bfa' : '#fbbf24' }}>
              Forgot password?
            </button>
          </motion.div>

          {/* Login Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLogin(user)}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #7c3aed, #6366f1)'
                : 'linear-gradient(135deg, #7c3aed, #a21caf)',
              color: '#ffffff',
            }}
          >
            Sign In
          </motion.button>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-sm"
            style={{ color: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}
          >
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="font-semibold hover:underline"
              style={{ color: isDark ? '#a78bfa' : '#fbbf24' }}
            >
              Sign up
            </Link>
          </motion.p>
        </div>

        {/* Right Side - WaveChat Logo */}
        <motion.div
          variants={imageVariants}
          className="w-full md:w-1/2 flex-col items-center justify-center relative p-6 gap-4 hidden md:flex"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-56 h-56 md:w-72 md:h-72"
          >
            <img
              src="/wavechat-logo.png"
              alt="WaveChat"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg"
            style={{ color: isDark ? '#f1f5f9' : '#ffffff' }}
          >
            WaveChat
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.7 }}
            className="text-sm"
            style={{ color: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}
          >
            Connect. Chat. Wave.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;