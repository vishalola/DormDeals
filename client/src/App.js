import Register from "./pages/Register";
import EmailVerify from "./pages/EmailVerify";
import { Routes, Route } from "react-router-dom";
import Sell from "./pages/Sell";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:prod" element={<Product />} />
        <Route path="/checkout" element={<Checkout/>} />
      </Routes>
    </>
  );
}

export default App;
