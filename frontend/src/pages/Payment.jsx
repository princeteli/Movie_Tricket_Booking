import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, quantity } = location.state || {};

  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [seconds, setSeconds] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasBookingData = Boolean(movie && quantity);

  useEffect(() => {
    if (!hasBookingData) {
      navigate('/');
      return;
    }

    if (!loading) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);

          axios.post(`http://localhost:5000/book-ticket/${movie.id}`, { quantity })
            .then(() => {
              navigate('/confirm', { state: { movie, quantity, totalPrice: movie.price * quantity } });
            })
            .catch(err => {
              alert(err.response?.data?.message || "Something went wrong");
              setLoading(false);
              setSeconds(10);
            });

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasBookingData, loading, movie, quantity, navigate]);

  if (!hasBookingData) return null;

  const handleConfirm = () => {
    // Validate fields before confirming
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!upiId.trim()) {
      setError("Please enter your UPI ID");
      return;
    }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    if (loading) return; // prevent double click
    setLoading(true);
    setSeconds(10); // reset countdown
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-900 p-4 text-gray-100">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold text-center text-yellow-400">Payment Page</h2>

        {/* Order Summary */}
        <div className="bg-gray-700 rounded-lg p-4 space-y-1">
          <p>Movie: <b className="text-yellow-400">{movie.movie_name}</b></p>
          <p>Quantity: <b>{quantity}</b></p>
          <p>Total Price: <b className="text-yellow-400">₹{movie.price * quantity}</b></p>
        </div>

        {/* Payment Fields */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="UPI ID (e.g. name@bank)"
          value={upiId}
          onChange={e => setUpiId(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="Mobile Number (10 digits)"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          disabled={loading}
          maxLength={10}
          className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
        />

        {/* Error message */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`w-full py-2 rounded font-semibold transition
            ${loading ? 'bg-gray-600 cursor-not-allowed text-gray-300' : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'}`}
        >
          {loading ? `Processing payment... ${seconds}s` : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
