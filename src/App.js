import Register from "./pages/Register";
import EmailVerify from "./pages/EmailVerify";
import { Routes, Route } from "react-router-dom";
import Sell from "./pages/Sell";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:id/verify/:token/" element={<EmailVerify />} />
        <Route path="/sell" element={<Sell />} />
      </Routes>
    </>
  );
}

export default App;
