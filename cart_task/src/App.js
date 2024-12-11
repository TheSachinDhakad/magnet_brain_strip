import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import Checkout from "./pages/Checkout";
import Check_Out from "./pages/Check_Out";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add/product" element={<AddProduct />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pay/checkout" element={<Check_Out />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
