import './App.css';
import { Routes,Route} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ChatScreen from './pages/ChatScreen';
import Profilelist from './pages/Profilelist';


function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>}  />
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/chat-screen/:id" element={<ChatScreen/>}/>
      <Route path="/list" element={<Profilelist/>}/>  
    </Routes>
    </>
  );
}

export default App;
