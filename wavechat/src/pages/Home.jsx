import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileByEmail, getSession } from "../supabase";
import { FaRegCircleUser } from "react-icons/fa6";

const Home = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = React.useState(null);


    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                navigate("/login");
            }
        });

    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;

            try {
                const data = await getProfileByEmail(user.email);

                if (data) {
                    localStorage.setItem("profile", JSON.stringify(data));
                    setProfile(data);
                }
            } catch (err) {
                console.log("Error getting profile:", err);
            }
        };
        fetchProfile();
    }, []);


    const user = JSON.parse(localStorage.getItem("profile"))
    const firstname = profile?.fullname;
    // console.log(user);



    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 flex flex-col items-center justify-start p-6 md:p-12">

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mb-12">


                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                    <div className="flex items-center justify-center md:justify-start mb-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                            Welcome to WaveChat
                        </h1>

                        <div className=" items-center flex p-4 h-max rounded-full flex-col " onClick={() => navigate("/profile")}>
                            <FaRegCircleUser className="w-20 h-20 " />
                            {firstname}
                        </div>

                    </div>

                    <p className="text-white/90 text-lg md:text-xl mb-6">
                        The fastest and most secure chat application to stay connected with your friends and family. Share messages, images, and emojis in real time.
                    </p>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <button onClick={() => navigate("/list")} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg">
                            Start Chatting
                        </button>
                        <button className="bg-white/30 hover:bg-white/50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="md:w-1/2 flex justify-center">
                    <div className="w-72 h-72 md:w-96 md:h-96 bg-white/20 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden transform hover:scale-105 transition-transform duration-500">
                        <img
                            src="https://srbpwyxjbrbxzlerdust.supabase.co/storage/v1/object/public/portfolio-images/3Dmodels/7495-removebg-preview.png"
                            alt="3D model"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">Fast Messaging</h3>
                    <p className="text-white/80">Send and receive messages instantly with zero delay.</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
                    <p className="text-white/80">Your conversations are protected with end-to-end encryption.</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">(Incoming)3D Experience</h3>
                    <p className="text-white/80">Enjoy immersive 3D visuals while chatting and sharing media.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
