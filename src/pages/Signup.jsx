import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaApple } from "react-icons/fa";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useDispatch, useSelector } from "react-redux";
import Success from "../components/Success";
import { registerUser } from "../api";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// ─── Password Strength ───
const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return { score: 0, label: "", color: "", width: "0%" };

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score, label: "Weak", color: "#ef4444", width: "20%" };
  if (score <= 2) return { score, label: "Fair", color: "#f59e0b", width: "40%" };
  if (score <= 3) return { score, label: "Good", color: "#10b981", width: "60%" };
  if (score <= 4) return { score, label: "Strong", color: "#059669", width: "80%" };
  return { score, label: "Very Strong", color: "#059669", width: "100%" };
};

const Signup = () => {
  const [loader, setLoader] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { message } = useSelector((state) => state.error);
  const successMessage = useSelector((state) => state.success?.message);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const passwordStrength = useMemo(() => getPasswordStrength(user.password), [user.password]);

  const onSignup = async () => {
    if (
      user.name.trim() === "" ||
      user.email.trim() === "" ||
      user.password.trim() === ""
    ) {
      dispatch({ type: "error/setError", payload: "All fields are required!" });
      setActiveForm("error");
      setTimeout(() => setActiveForm(null), 2000);
      return;
    }

    if (!acceptTerms) {
      dispatch({ type: "error/setError", payload: "Please accept the terms & conditions" });
      setActiveForm("error");
      setTimeout(() => setActiveForm(null), 2000);
      return;
    }

    try {
      setActiveForm("loading");
      const response = await registerUser(user.name, user.email, user.password);
      dispatch({ type: "success/setSuccess", payload: response?.data?.message || "Account created! Check your email to verify." });
      setActiveForm("success");
      setTimeout(() => {
        setActiveForm(null);
        navigate("/login");
      }, 3000);
    } catch (e) {
      console.log(e);
      let errMsg = "Something went wrong";
      if (e?.response?.data?.error) errMsg = e.response.data.error;
      else if (e?.response?.data?.email?.[0]) errMsg = e.response.data.email[0];
      dispatch({ type: "error/setError", payload: errMsg });
      setActiveForm("error");
      setTimeout(() => setActiveForm(null), 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.08 },
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
      className="w-screen min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f172a, #1e1b4b, #1e293b)'
          : 'linear-gradient(135deg, #6d28d9, #7c3aed, #4f46e5)',
      }}
    >
      {activeForm === "error" && <Error message={message} />}
      {activeForm === "loading" && <Loading />}
      {activeForm === "success" && <Success message={successMessage} />}

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
            Create Account
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mb-8 text-center md:text-left text-base"
            style={{ color: isDark ? 'rgba(148, 163, 184, 0.8)' : 'rgba(255, 255, 255, 0.7)' }}
          >
            Sign up to start chatting with your friends
          </motion.p>

          {/* Social Signup Buttons */}
          {/* <motion.div variants={itemVariants} className="flex gap-3 mb-6">
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
          </motion.div> */}

          {/* Divider */}
          {/* <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)' }} />
            <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.5)' }}>
              OR SIGN UP WITH EMAIL
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)' }} />
          </motion.div> */}

          {/* Full Name */}
          <motion.div variants={itemVariants} className="relative mb-4">
            <FiUser
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={user.name}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.15)',
                color: isDark ? '#f1f5f9' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                '--tw-ring-color': isDark ? '#8b5cf6' : '#a78bfa',
              }}
              required
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="relative mb-4">
            <FiMail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              value={user.email}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.15)',
                color: isDark ? '#f1f5f9' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                '--tw-ring-color': isDark ? '#8b5cf6' : '#a78bfa',
              }}
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="relative mb-2">
            <FiLock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              value={user.password}
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

          {/* Password Strength Bar */}
          {user.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.15)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: passwordStrength.width }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: passwordStrength.color }}
                  />
                </div>
                <span className="text-[10px] font-semibold" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            </motion.div>
          )}

          {/* Terms */}
          <motion.div variants={itemVariants} className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="w-4 h-4 rounded mt-0.5"
              style={{ accentColor: isDark ? '#8b5cf6' : '#7c3aed' }}
            />
            <span className="text-xs leading-relaxed" style={{ color: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}>
              I agree to the{" "}
              <button className="font-semibold hover:underline" style={{ color: isDark ? '#a78bfa' : '#fbbf24' }}>
                Terms of Service
              </button>{" "}
              &{" "}
              <button className="font-semibold hover:underline" style={{ color: isDark ? '#a78bfa' : '#fbbf24' }}>
                Privacy Policy
              </button>
            </span>
          </motion.div>

          {/* Signup Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSignup}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #7c3aed, #6366f1)'
                : 'linear-gradient(135deg, #7c3aed, #a21caf)',
              color: '#ffffff',
            }}
          >
            Create Account
          </motion.button>

          {/* Login Link */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-sm"
            style={{ color: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}
          >
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold hover:underline"
              style={{ color: isDark ? '#a78bfa' : '#fbbf24' }}
            >
              Login
            </Link>
          </motion.p>
        </div>

        {/* Right Side - Visual */}
        <motion.div
          variants={imageVariants}
          className="w-full md:w-1/2 flex-col items-center justify-center relative p-6 gap-4 hidden md:flex"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-80 h-80 md:w-96 md:h-96 rounded-3xl shadow-2xl overflow-hidden"
          >
            <img
              src="https://srbpwyxjbrbxzlerdust.supabase.co/storage/v1/object/public/portfolio-images/3Dmodels/19199299.jpg"
              alt="3D model"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;