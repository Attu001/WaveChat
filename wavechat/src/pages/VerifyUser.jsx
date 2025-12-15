import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
          `http://localhost:8000/auth/verify?token=${token}`
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");

          // Redirect after 2 seconds
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyUser();
  }, [ token, navigate]);

  return (
    <div className="flex items-center  justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center w-80">
        {status === "verifying" && (
          <>
            <div className="loader border-4 w-10 h-10 mx-auto mb-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold">Verifying your email…</h2>
            <p className="text-gray-600 mt-2">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✔</div>
            <h2 className="text-xl font-semibold">Email Verified!</h2>
            <p className="text-gray-600 mt-2">Redirecting to home…</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">✖</div>
            <h2 className="text-xl font-semibold">Verification Failed</h2>
            <p className="text-gray-600 mt-2">Invalid or expired link.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyUser;
