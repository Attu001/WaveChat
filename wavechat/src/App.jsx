import './App.css';
import { Routes,Route} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ChatScreen from './pages/ChatScreen';


function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>}  />
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/chat-screen" element={<ChatScreen/>}/>
    </Routes>
    </>
  );
}

export default App;
