import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ChatScreen from './pages/ChatScreen';
import Profilelist from './pages/Profilelist';
import Profile from './pages/Profile';
import VerifyUser from './pages/VerifyUser';


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat-screen/:id" element={<ChatScreen />} />
        <Route path="/list" element={<Profilelist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<VerifyUser />} />
      </Routes>
    </>
  );
}

export default App;
