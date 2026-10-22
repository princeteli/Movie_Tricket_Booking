import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import Booking from "./pages/Booking"
import Payment from "./pages/Payment"
import ConfirmPayment from "./pages/ConfirmPayment"
import AdminLogin from "./pages/AdminLogin"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirm" element={<ConfirmPayment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
