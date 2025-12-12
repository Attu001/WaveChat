import React, { useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios"
import {useState} from "react";
// import { loginUser } from "../supabase";
import Success from "../components/Success";
import Error from "../components/Error";
import { loginUser } from "../api";


const Login = () => {

  const [success,setSuccess]=useState(false)
  const [showError,setShowError]=useState(false)

  useEffect(()=>{
    localStorage.clear();
  },[])
      

    const navigate=useNavigate()
    const [user,setUser]=useState({
      email:"",
      password:""
    })

    const handleChange =(e)=>{
      e.preventDefault()
      setUser({
        ...user,
        [e.target.name]: e.target.value
    });
    }

    
  const handleLogin = async () => {
    const res = await loginUser(user.email, user.password);
    console.log(res)

    // if (res) {
    //   console.log("Login successful:", res);
    //   localStorage.setItem("user", JSON.stringify(res));
    //  setSuccess(true);
    //  setTimeout(() => {
    //   navigate("/home")
    //  }, 3000);
    // } 
    // else {
    //   setShowError(true);

    // }
  };

       
    

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 flex items-center justify-center p-4">
    
       {
        success && <Success message="Login Successful! Redirecting..." />
       }
       {
        showError && <Error message="Invalid email or password." />
       }
    
      {/* Glassmorphic Container */}
      <div className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-4/5 overflow-hidden border border-white/30">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 text-center md:text-left drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-white/80 mb-6 md:mb-8 text-center md:text-left text-lg">
            Log in to continue chatting with your friends
          </p>
          
          <input
            name="email"
            placeholder="email"

            className="mb-4 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
            onChange={(e)=>handleChange(e)}
            value={user.email}
          />
          
          <input
            name="password"
            placeholder="password"
            value={user.password}
             onChange={(e)=>handleChange(e)}
            className="mb-6 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
          />
          
          <button onClick={()=>handleLogin(user)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all duration-300 w-full shadow-lg hover:scale-105">
            Login
          </button>
          
          <p className="mt-6 text-white/80 text-center md:text-left">
            Don't have an account?{" "}
            <span className="text-pink-400 font-semibold cursor-pointer hover:underline">
              <Link to={"/signup"}>
              Sign up
              </Link>
              
            </span>
          </p>
        </div>
        
        {/* Right Side - 3D Image / Placeholder */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative p-6">
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
            <img
              src="https://srbpwyxjbrbxzlerdust.supabase.co/storage/v1/object/public/portfolio-images/3Dmodels/20944201.jpg"
              alt="3D model"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
