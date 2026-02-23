import React, { use, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../slices/notificationSlice";
// import {notificationaudio} from "WaveChat/wavechat/public/notification.wav"
import { notifications } from "../api/services/userServices";
import { useState } from "react";

const NotificationPage = () => {

  // const { notifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const [notificationsList,setNotificationsList] = useState([]);

  const audioRef = useRef(null);
  
  const fetchNotifications = async () => {
    try {
      const response = await notifications();
      setNotificationsList(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  useEffect(() => {
    fetchNotifications();
  },[]);


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <audio ref={audioRef} src="/notification.wav" />

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">Notifications</h2>

        {notificationsList.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notificationsList.map((n, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow mb-3"
            >
              <h4 className="font-semibold">New Message</h4>
              <p>{n.message}</p>
              <span className="text-xs text-gray-400">{n.created_at}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
