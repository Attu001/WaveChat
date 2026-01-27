import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ChatScreen from './pages/ChatScreen';
import Profilelist from './pages/Profilelist';
import Profile from './pages/Profile';
import VerifyUser from './pages/VerifyUser';
import NotificationPage from './components/NotificationPage';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { ws_url } from './api';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from './slices/notificationSlice';
import MainLayout from './MainLayout';
function App() {
  const userId =localStorage.getItem("id")
  // const [notification, setNotification] = useState(null);
  const {notifications}=useSelector((state)=>state.notification.notifications)
  const dispatch=useDispatch();
  
  const audioRef = useRef(null);
  
    useEffect(() => {
      if (!userId) return;
  
      const socket = new WebSocket(
        `${ws_url}ws/notifications/${userId}/`
      );
  
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
  
        dispatch(
          addNotification({
            message: data.message,
            sender_id: data.sender_id,
            time: new Date().toISOString(),
          })
        );
  
        // 🔊 Play sound
        audioRef.current?.play().catch(() => {});
      };
  
      return () => socket.close();
    }, [userId, dispatch]);
  
    const [audioUnlocked, setAudioUnlocked] = useState(false);

const unlockAudio = () => {
  if (!audioUnlocked && audioRef.current) {
    audioRef.current.play().then(() => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioUnlocked(true);
    });
  }
};






  return (
    <>
    <div onClick={unlockAudio}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainLayout/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat-screen" element={<ChatScreen />} />
        <Route path="/list" element={<Profilelist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<VerifyUser />} />
        <Route path="/notifications" element={<NotificationPage/>}/>
        
      </Routes>
</div>
      <div>
      <audio ref={audioRef} src="/notification.wav" />
      </div>
    </>
  );
}

export default App;
