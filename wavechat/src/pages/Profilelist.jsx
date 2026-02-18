import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import ProfileCard from "../components/ProfileCard";
import { fetchUsers } from "../slices/userSlice";

const Profilelist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: profiles, loading } = useSelector((state) => state.users);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (profiles.length === 0 && !loading || profiles === null) {
      // only fetch if empty
      dispatch(fetchUsers());
    }
  }, [dispatch, profiles.length]);

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <div className="w-full h-full">
        {loading ? (
          <div className="w-full h-full  flex items-center justify-center">
            <FiLoader className="animate-spin text-3xl text-slate-500" />
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid gap-4">
            {profiles.map((p, index) => (
              <ProfileCard key={p.id} profile={p} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-28">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Profilelist;
