import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { setError } from "../slices/errorSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSuccess } from "../slices/successSlice";
import Success from "../components/Success";
import { registerUser } from "../api";
import { motion } from "framer-motion";


const Signup = () => {
  const [loader, setLoader] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [activeForm, setActiveForm] = useState(null)
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.error);
  const successMessage = useSelector((state) => state.Success.message);

  const FORM_STATE = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success",
  };




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

  const onSignup = async () => {
    // EMPTY FIELDS CHECK
    if (
      user.name.trim() === "" ||
      user.email.trim() === "" ||
      user.password.trim() === ""
    ) {
      dispatch(setError("All fields are required!"));
      setActiveForm("error");

      setTimeout(() => setActiveForm(null), 2000);
      return;
    }

    try {
      setActiveForm("loading");

      const response = await registerUser(
        user.name,
        user.email,
        user.password
      );

      console.log(response);

      dispatch(setSuccess(response?.data?.message || "Signup successful!"));
      setActiveForm("success");

      setTimeout(() => setActiveForm(null), 2000);

      return response;
    } catch (e) {
      console.log(e);

      let errMsg = "Something went wrong";

      if (e?.response?.data?.error) {
        errMsg = e.response.data.error;
      } else if (e?.response?.data?.email?.[0]) {
        errMsg = e.response.data.email[0];
      }

      dispatch(setError(errMsg));
      setActiveForm("error");

      setTimeout(() => setActiveForm(null), 2000);
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
    <div className="w-screen min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 flex items-center justify-center p-4">
      {activeForm === "error" && <Error message={message} />}
      {activeForm === "loading" && <Loading />}
      {activeForm === "success" && <Success message={successMessage} />}


      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className=" bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:p-4 md:flex-row w-full max-w-5xl h-auto md:h-4/5 overflow-hidden border border-white/30"
      >

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center ">

          <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 text-center md:text-left drop-shadow-lg">
            Create Account
          </motion.h1>

          <motion.p variants={itemVariants} className="text-white/80 mb-6 md:mb-8 text-center md:text-left text-lg">
            Sign up to start chatting with your friends
          </motion.p>

          {/* FULL NAME */}
          <motion.input
            variants={itemVariants}
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={user.name}
            className="mb-4 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
            required
          />

          {/* EMAIL */}
          <motion.input
            variants={itemVariants}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={user.email}
            className="mb-4 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
          />

          {/* PASSWORD */}
          <motion.input
            variants={itemVariants}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={user.password}
            className="mb-6 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
          />

          {/* SIGNUP BUTTON */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSignup}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all duration-300 w-full shadow-lg"
          >
            Sign Up
          </motion.button>

          <motion.p variants={itemVariants} className="mt-6 text-white/80 text-center md:text-left">
            Already have an account?{" "}
            <span className="text-pink-400 font-semibold cursor-pointer hover:underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </motion.p>

        </div>

        <motion.div
          variants={imageVariants}
          className="w-full md:w-1/2 flex items-center justify-center relative p-6"
        >
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
            <img
              src="https://srbpwyxjbrbxzlerdust.supabase.co/storage/v1/object/public/portfolio-images/3Dmodels/19199299.jpg"
              alt="3D model"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Signup;
