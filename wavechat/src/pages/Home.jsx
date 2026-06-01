import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import axios from "axios";
import { base_url } from "../api";
import { getProfileByUserId } from "../api/services/userServices";
import { FaMessage } from "react-icons/fa6";
import { motion } from "framer-motion";

const Home = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")
    const token = searchParams.get("token")
    const [profile, setProfile] = useState(null);

    // Fetch logged-in user's profile for the header badge
    useEffect(() => {
        getProfileByUserId()
            .then((res) => setProfile(res.data))
            .catch(console.error);
    }, []);

    // EMAIL VERIFICATION
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

    const firstname = profile?.name;

    const heroTextVariants = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    };

    const heroImageVariants = {
        hidden: { opacity: 0, x: 60, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 },
        },
    };

    const cardContainerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.4 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    };

    const profileBadgeVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut", delay: 0.3 },
        },
    };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-[#6a11cb] via-[#b83af3] to-[#2575fc] flex flex-col items-center p-6 md:p-10">

            {/* Top User Box */}
            <motion.div
                variants={profileBadgeVariants}
                initial="hidden"
                animate="visible"
                className="absolute top-6 right-6 flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-xl p-3 hover:bg-white/30 transition cursor-pointer shadow-lg"
                onClick={() => navigate("/profile")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaRegCircleUser className="w-10 h-10 text-white" />
                <span className="text-white font-semibold">{firstname ?? "Profile"}</span>
            </motion.div>

            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-10 md:mt-16">

                {/* LEFT TEXT SIDE */}
                <motion.div
                    variants={heroTextVariants}
                    initial="hidden"
                    animate="visible"
                    className="md:w-1/2 text-center md:text-left space-y-6"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
                        Welcome to <span className="text-yellow-300">WaveChat</span>
                    </h1>

                    <p className="text-white/90 text-lg md:text-xl">
                        A modern, fast, and secure way to stay connected.
                        Chat in real-time with beautiful UI and smooth experience.
                    </p>

                    <div className="flex justify-center md:justify-start gap-4 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate("/list")}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition"
                        >
                            Start Chatting
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate("/notifications")}
                            className="bg-white/20 flex items-center gap-2 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
                        >
                            Notifications <FaMessage />
                        </motion.button>
                    </div>
                </motion.div>

                {/* RIGHT IMAGE SIDE */}
                <motion.div
                    variants={heroImageVariants}
                    initial="hidden"
                    animate="visible"
                    className="md:w-1/2 flex justify-center mt-10 md:mt-0"
                >
                    <div className="w-72 h-72 md:w-96 md:h-96 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden flex items-center justify-center transition transform hover:scale-105">
                        <img
                            src="https://srbpwyxjbrbxzlerdust.supabase.co/storage/v1/object/public/portfolio-images/3Dmodels/7495-removebg-preview.png"
                            alt="Hero 3D Model"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            </div>

            {/* FEATURES */}
            <motion.div
                variants={cardContainerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >

                <motion.div variants={cardVariants} whileHover={{ scale: 1.05, y: -5 }} className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl text-center shadow-lg transition">
                    <h3 className="text-xl font-bold text-white mb-2">⚡ Fast Messaging</h3>
                    <p className="text-white/80">Instant delivery with ultra low latency.</p>
                </motion.div>

                <motion.div variants={cardVariants} whileHover={{ scale: 1.05, y: -5 }} className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl text-center shadow-lg transition">
                    <h3 className="text-xl font-bold text-white mb-2">🔐 Secure</h3>
                    <p className="text-white/80">Your conversations stay private.</p>
                </motion.div>

                <motion.div variants={cardVariants} whileHover={{ scale: 1.05, y: -5 }} className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl text-center shadow-lg transition">
                    <h3 className="text-xl font-bold text-white mb-2">🌀 3D Experience</h3>
                    <div className="text-white/80 flex gap-2 animate-bounce"> (Coming Soon)</div> Interact with 3D visuals.
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Home;
