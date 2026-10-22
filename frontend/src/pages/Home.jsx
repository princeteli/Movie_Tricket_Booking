import React, { useEffect, useState } from 'react';
import api from '../api';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // For mobile menu toggle

  useEffect(() => {
    api.get("/movies")
      .then(res => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-gray-100">

      {/* Navbar */}
      <nav className="bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Title */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
                🎬 MovieApp
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
              <Link to="/admin" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-1.5 rounded transition-colors text-sm">
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-gray-700">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-600">Home</Link>
            <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-600 text-yellow-400 font-semibold">Admin Panel</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Now Showing 🎥</h2>

        {loading ? (
          <div className="text-center text-xl mt-10 animate-pulse text-gray-400">Loading movies...</div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-16">
            <p className="text-5xl mb-4">🎭</p>
            <h2 className="text-xl text-gray-400">No Movies Found</h2>
            <p className="text-gray-500 mt-2">Check back later or contact the admin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
