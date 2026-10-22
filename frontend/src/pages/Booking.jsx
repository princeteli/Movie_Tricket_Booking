import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const Booking = () => {
  const { id } = useParams(); // Movie ID from route
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notFound, setNotFound] = useState(false);

  // Fetch movie by ID
  useEffect(() => {
    let isMounted = true;

    api.get("/movies")
      .then(res => {
        if (!isMounted) return;
        const selected = res.data.find(m => m.id === id);
        if (selected) {
          setMovie(selected);
        } else {
          setNotFound(true);
        }
      })
      .catch(err => {
        console.log(err);
        if (isMounted) setNotFound(true);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-center text-gray-100">
        <p className="text-xl mb-4">Movie not found.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 flex items-center justify-center text-gray-100">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  const totalPrice = movie.price * quantity;

  const handleBooking = () => {
    navigate('/payment', { state: { movie, quantity, totalPrice } });
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl w-full flex flex-col items-center">

        <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">
          Booking: {movie.movie_name}
        </h2>

        {movie.movie_image ? (
          <img
            src={movie.movie_image}
            alt={movie.movie_name}
            className="w-full h-64 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-full h-64 bg-gray-700 rounded mb-4 flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}

        <p className="text-gray-300 mb-4 text-center">{movie.description}</p>

        <h3 className="text-lg font-semibold mb-2">Price per Ticket: <span className="text-yellow-400">₹{movie.price}</span></h3>
        <p className="text-sm text-gray-400 mb-4">Available Tickets: {movie.total_tickets}</p>

        {/* Quantity Input */}
        <div className="mb-4 flex items-center space-x-3">
          <label htmlFor="tickets" className="text-gray-200 font-medium">Tickets:</label>
          <input
            id="tickets"
            type="number"
            min="1"
            max={movie.total_tickets}
            value={quantity}
            onChange={e => {
              const val = Number(e.target.value);
              if (val >= 1 && val <= movie.total_tickets) setQuantity(val);
            }}
            className="w-20 px-2 py-1 rounded bg-gray-700 text-white font-semibold text-center border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <h3 className="text-lg font-semibold mb-6">
          Total Price: <span className="text-yellow-400">₹{totalPrice}</span>
        </h3>

        {/* Proceed Button */}
        <button
          onClick={handleBooking}
          disabled={movie.total_tickets === 0}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-2 px-6 rounded transition-colors"
        >
          {movie.total_tickets === 0 ? 'Sold Out' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default Booking;
