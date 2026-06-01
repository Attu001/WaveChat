import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchallRequests, acceptFriendRequest, rejectFriendRequest } from "../api/services/userServices";

export default function ChatRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetchallRequests()
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Chat Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req, index) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-lg">{req.sender.name}</p>
                <p className="text-sm text-gray-500">{req.sender.email}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(req.id)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
