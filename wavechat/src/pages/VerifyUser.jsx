import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { base_url } from "../api";
import { motion, AnimatePresence } from "framer-motion";

const VerifyUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  // verifying | success | error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch(
          `${base_url}auth/verify?token=${token}`
        );

        console.log(response)

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Verification failed");
        }

        if (data.access) {
          localStorage.setItem("access", data.access);
        }

        if (data.user_id) {
          localStorage.setItem("id", data.user_id);
        }

        setStatus("success");

        // small delay for UX
        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    verifyUser();
  }, [token, navigate]);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="p-8 bg-white shadow-lg rounded-xl text-center w-80"
      >

        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div key="verifying" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
              <div className="loader border-4 w-10 h-10 mx-auto mb-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-xl font-semibold">Verifying your email…</h2>
              <p className="text-gray-600 mt-2">Please wait a moment.</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div key="success" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-green-500 text-5xl mb-4"
              >
                ✔
              </motion.div>
              <h2 className="text-xl font-semibold">Email Verified!</h2>
              <p className="text-gray-600 mt-2">Redirecting to Login…</p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div key="error" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-red-500 text-5xl mb-4"
              >
                ✖
              </motion.div>
              <h2 className="text-xl font-semibold">Verification Failed</h2>
              <p className="text-gray-600 mt-2">Invalid or expired link.</p>
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default VerifyUser;
