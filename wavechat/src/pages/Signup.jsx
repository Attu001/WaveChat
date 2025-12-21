import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { handleSignup } from "../supabase";  // using your function
import Error from "../components/Error";
import { setError } from "../slices/errorSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSuccess } from "../slices/successSlice";
import Success from "../components/Success";
import { registerUser } from "../api";


const Signup = () => {
  const [loader, setLoader] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.error);
  const successMessage = useSelector((state) => state.Success.message);



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
    setLoader(true);


    // EMPTY FIELDS
    if (user.name.trim() === "" || user.email.trim() === "" || user.password.trim() === "") {
      setErrorForm(false);
      dispatch(setError("All fields are required!"));

      setTimeout(() => {
        setErrorForm(true);
      }, 20);

      setLoader(false);
      return;
    }else{

      
      try {
        const response = await registerUser(user.name, user.email, user.password);
        setLoader(false);
        console.log(response)
        return response;
      } catch (e) {
        
        console.log(e)
        setLoader(false)
        setErrorForm(false);
        let errMsg = "Something went wrong";
        
        if (e?.response?.data?.error) {
          errMsg = e.response.data.error;
        } else if (e?.response?.data?.email?.[0]) {
          errMsg = e.response.data.email[0];
        }
        
        dispatch(setError(errMsg));
        setLoader(false)
        
        setTimeout(() => {
          setErrorForm(true);
        }, 20);
        
      }
      
      // SUCCESS CASE
      setErrorForm(false);
      dispatch(setSuccess("Signup successful! Verify your email."));
      setTimeout(() => {
        setErrorForm(true);
      }, 20);
    };
    
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 flex items-center justify-center p-4">
      {errorForm && <Error message={message} />}
      {loader && <Loading />}
      {successMessage && <Success message={successMessage} />}

      <div className=" bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:p-4 md:flex-row w-full max-w-5xl h-auto md:h-4/5 overflow-hidden border border-white/30">

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center ">

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 text-center md:text-left drop-shadow-lg">
            Create Account
          </h1>

          <p className="text-white/80 mb-6 md:mb-8 text-center md:text-left text-lg">
            Sign up to start chatting with your friends
          </p>

          {/* FULL NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={user.name}
            className="mb-4 p-4 rounded-xl border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 backdrop-blur-sm transition-all duration-300 w-full"
            required
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

          {/* SIGNUP BUTTON */}
          <button
            onClick={onSignup}
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
