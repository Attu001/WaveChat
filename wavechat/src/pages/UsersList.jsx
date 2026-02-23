import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../components/ProfileCard";
import { FaSpinner } from "react-icons/fa";
import { fetchUsers } from "../slices/userSlice";

const UsersList = () => {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((s) => s.users);

  // ⭐ fetch only first time (when users === null)
  useEffect(() => {
    if (users === null || users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [users, dispatch]);

  // loading
  if (loading && users === null) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-xl text-gray-600" />
      </div>
    );
  }

  // error
  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  const acceptedUsers = (users || []).filter((u) => u.status === "ACCEPTED");

  if (acceptedUsers.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No friends yet. Start sending requests 👋
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-10">
      {acceptedUsers.map((user, index) => (
        <ProfileCard key={user.id} profile={user} index={index} send />
      ))}
    </div>
  );
};

export default UsersList;
