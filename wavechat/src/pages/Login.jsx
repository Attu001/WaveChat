import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { useState } from "react";
import Success from "../components/Success";
import Error from "../components/Error";
import { loginUser } from "../api";
import Loading from "../components/Loading";
import { motion } from "framer-motion";

const Login = () => {
  const [activePopup, setActivePopup] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("id");
  }, [])


  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }


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
        // Extract a clean error message from the response
        const errData = res?.response?.data;
        let errorMsg = "Invalid email or password.";

        if (typeof errData === "string" && !errData.includes("<")) {
          // Plain text error (not HTML)
          errorMsg = errData;
        } else if (typeof errData === "object" && errData !== null) {
          // JSON error like { detail: "..." } or { error: "..." }
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
    <div className="w-screen h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 flex items-center justify-center p-4">
      {
        activePopup == "loader" && <Loading />
      }
      {
        activePopup == "success" && <Success message="Login Successful! Redirecting..." />
      }
      {
        activePopup == "error" && <Error message={message ? message : "Invalid email or password."} />
      }

      {/* Glassmorphic Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-4/5 overflow-hidden border border-white/30"
      >

        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 text-center md:text-left drop-shadow-lg">
            Welcome Back
          </motion.h1>
          <motion.p variants={itemVariants} className="text-white/80 mb-6 md:mb-8 text-center md:text-left text-lg">
            Log in to continue chatting with your friends
          </motion.p>

          <motion.input
            variants={itemVariants}
            name="email"
            placeholder="email"

            className="mb-4 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
            onChange={(e) => handleChange(e)}
            value={user.email}
          />

          <motion.input
            variants={itemVariants}
            name="password"
            placeholder="password"
            type="password"
            value={user.password}
            onChange={(e) => handleChange(e)}
            className="mb-6 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
          />

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleLogin(user)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all duration-300 w-full shadow-lg"
          >
            Login
          </motion.button>

          <motion.p variants={itemVariants} className="mt-6 text-white/80 text-center md:text-left">
            Don't have an account?{" "}
            <span className="text-pink-400 font-semibold cursor-pointer hover:underline">
              <Link to={"/signup"}>
                Sign up
              </Link>

            </span>
          </motion.p>
        </div>

        {/* Right Side - WaveChat Logo */}
        <motion.div
          variants={imageVariants}
          className="w-full md:w-1/2 flex flex-col items-center justify-center relative p-6 gap-4"
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
            className="text-white text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg"
          >
            WaveChat
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.7 }}
            className="text-white/70 text-sm"
          >
            Connect. Chat. Wave.
          </motion.p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Login;
