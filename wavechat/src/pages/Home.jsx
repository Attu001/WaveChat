import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getProfileByEmail } from "../supabase";
import { FaRegCircleUser } from "react-icons/fa6";
import axios from "axios";
import { base_url,getProfileByUserId } from "../api";

const Home = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")
    const token = searchParams.get("token")
    const [profile, setProfile] = useState(null);

    // -----------------------------
    // EMAIL VERIFICATION
    // -----------------------------
    useEffect(() => {
        if (!token) return;

        const verifyEmail = async () => {
            try {
                const res = await axios.get(`${base_url}verify-email/${id}/${token}/`);
                console.log("Email Verified:", res.data);
            } catch (e) {
                console.log("Verification Error:", e);
            }
        };

        verifyEmail();
    }, [token, id]);

    // -----------------------------
    // FETCH PROFILE DATA
    // -----------------------------
    useEffect(() => {
        const fetchProfile = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;

            try {
                const data = await getProfileByUserId(id);
                if (data) {
                    localStorage.setItem("profile", JSON.stringify(data));
                    setProfile(data);
                }
            } catch (err) {
                console.log("Error:", err);
            }
        };
        fetchProfile();
    }, []);

    const firstname = profile?.fullname;

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-[#6a11cb] via-[#b83af3] to-[#2575fc] flex flex-col items-center p-6 md:p-10">

            {/* Top User Box */}
            <div
                className="absolute top-6 right-6 flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-xl p-3 hover:bg-white/30 transition cursor-pointer shadow-lg"
                onClick={() => navigate("/profile")}
            >
                <FaRegCircleUser className="w-10 h-10 text-white" />
                <span className="text-white font-semibold">{firstname ?? "Profile"}</span>
            </div>

            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-10 md:mt-16">

                {/* LEFT TEXT SIDE */}
                <div className="md:w-1/2 text-center md:text-left space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg animate-fade-in">
                        Welcome to <span className="text-yellow-300">WaveChat</span>
                    </h1>

                    <p className="text-white/90 text-lg md:text-xl">
                        A modern, fast, and secure way to stay connected.  
                        Chat in real-time with beautiful UI and smooth experience.
                    </p>

                    <div className="flex justify-center md:justify-start gap-4 mt-4">
                        <button
                            onClick={() => navigate("/list")}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
                        >
                            Start Chatting
                        </button>

                        <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE SIDE */}
                <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
                    <div className="w-72 h-72 md:w-96 md:h-96 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden flex items-center justify-center transition transform hover:scale-105">
                        <img
                            src="https://srbpwyxjbrbxzlerdust.supabase.co/storage/v1/object/public/portfolio-images/3Dmodels/7495-removebg-preview.png"
                            alt="Hero 3D Model"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* FEATURES */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                
                <div className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition">
                    <h3 className="text-xl font-bold text-white mb-2">⚡ Fast Messaging</h3>
                    <p className="text-white/80">Instant delivery with ultra low latency.</p>
                </div>

                <div className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition">
                    <h3 className="text-xl font-bold text-white mb-2">🔐 Secure</h3>
                    <p className="text-white/80">Your conversations stay private.</p>
                </div>

                <div className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition">
                    <h3 className="text-xl font-bold text-white mb-2">🌀 3D Experience</h3>
                   <div className="text-white/80 flex gap-2 animate-bounce"> (Coming Soon)</div> Interact with 3D visuals.
                </div>

            </div>
        </div>
    );
};

export default Home;
