import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import Loading from "../compoennts/Loading";

const Signup = () => {
  const [loader,setLoader]=useState(false)
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    setLoader(true)
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      display_name:user.fullname

    });

    if (error) {
      setLoader(false)
      alert(error.message);
      return;
    }
    setLoader(false)
    alert("Signup successful! Please check your email to verify.");

  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 flex items-center justify-center p-4">
      {
        loader && <Loading/>
      }
      <div className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-4/5 overflow-hidden border border-white/30">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 text-center md:text-left drop-shadow-lg">
            Create Account
          </h1>
          <p className="text-white/80 mb-6 md:mb-8 text-center md:text-left text-lg">
            Sign up to start chatting with your friends
          </p>

          {/* FULL NAME */}
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            onChange={handleChange}
            value={user.fullname}
            className="mb-4 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={user.email}
            className="mb-4 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={user.password}
            className="mb-6 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
          />

          {/* SIGN UP BUTTON */}
          <button
            onClick={handleSignup}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all duration-300 w-full shadow-lg hover:scale-105"
          >
            Sign Up
          </button>

          <p className="mt-6 text-white/80 text-center md:text-left">
            Already have an account?{" "}
            <span className="text-pink-400 font-semibold cursor-pointer hover:underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center relative p-6">
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
            <img
              src="https://srbpwyxjbrbxzlerdust.supabase.co/storage/v1/object/public/portfolio-images/3Dmodels/19199299.jpg"
              alt="3D model"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
