import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Card click handler
  const goToBooking = () => {
    navigate(`/booking/${movie.id}`);
  };

  return (
    <div
      onClick={goToBooking}
      className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg shadow-md cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Movie Image */}
      {movie.movie_image && !imgError ? (
        <img
          src={movie.movie_image}
          alt={movie.movie_name}
          className="w-full h-56 object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback poster when image missing or broken */
        <div className="w-full h-56 flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-center px-3">
          <span className="text-5xl mb-2">🎬</span>
          <span className="text-yellow-400 font-bold text-sm leading-tight">{movie.movie_name}</span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-100">{movie.movie_name}</h3>
        <p className="text-gray-300 text-sm flex-grow line-clamp-2">{movie.description}</p>
        <div className="mt-4">
          <h4 className="text-lg font-bold text-yellow-400">₹ {movie.price}</h4>
          <p className="text-gray-400 text-sm">
            {movie.total_tickets > 0
              ? `${movie.total_tickets} Tickets Available`
              : <span className="text-red-400">Sold Out</span>
            }
          </p>
        </div>

        {/* Book Now Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToBooking();
          }}
          disabled={movie.total_tickets === 0}
          className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-semibold py-2 rounded transition-colors"
        >
          {movie.total_tickets === 0 ? 'Sold Out' : 'Book Now'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
