import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Admin = ({ onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    movie_image: '',
    movie_name: '',
    description: '',
    price: '',
    total_tickets: ''
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/movies');
      setMovies(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        // Update movie
        await axios.put(`http://localhost:5000/update-movie/${editId}`, form);
        setEditId(null);
        showMessage('Movie updated successfully!');
      } else {
        // Add new movie
        await axios.post('http://localhost:5000/add-movie', form);
        showMessage('Movie added successfully!');
      }

      setForm({
        movie_image: '',
        movie_name: '',
        description: '',
        price: '',
        total_tickets: ''
      });

      fetchMovies();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      showMessage(errMsg, 'error');
      console.log(err);
    }

    setLoading(false);
  };

  const handleEdit = (movie) => {
    setEditId(movie.id);
    setForm({
      movie_image: movie.movie_image,
      movie_name: movie.movie_name,
      description: movie.description,
      price: movie.price,
      total_tickets: movie.total_tickets
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(`http://localhost:5000/delete-movie/${id}`);
        showMessage('Movie deleted successfully!');
        fetchMovies();
      } catch (err) {
        showMessage(err.response?.data?.message || err.message, 'error');
        console.log(err.response?.data || err.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({
      movie_image: '',
      movie_name: '',
      description: '',
      price: '',
      total_tickets: ''
    });
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 p-6 text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Admin Dashboard</h1>
        {onLogout && (
          <button
            onClick={onLogout}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition"
          >
            🚪 Logout
          </button>
        )}
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`max-w-md mx-auto mb-4 px-4 py-3 rounded text-sm font-medium text-center
          ${message.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {message.text}
        </div>
      )}

      {/* Movie Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto mb-8 space-y-3"
      >
        <h2 className="text-xl font-bold mb-2">{editId ? 'Update Movie' : 'Add Movie'}</h2>

        <input
          type="text"
          placeholder="Movie Image URL"
          value={form.movie_image}
          onChange={(e) => setForm({ ...form, movie_image: e.target.value })}
          className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          placeholder="Movie Name *"
          value={form.movie_name}
          onChange={(e) => setForm({ ...form, movie_name: e.target.value })}
          className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="number"
          placeholder="Price (INR) *"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          min="0"
          className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />

        <input
          type="number"
          placeholder="Total Tickets *"
          value={form.total_tickets}
          onChange={(e) => setForm({ ...form, total_tickets: e.target.value })}
          min="0"
          className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 rounded font-semibold transition
              ${loading ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'}`}
          >
            {loading ? 'Processing...' : editId ? 'Update Movie' : 'Add Movie'}
          </button>

          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded font-semibold bg-gray-600 hover:bg-gray-500 text-gray-100 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Movies Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded shadow-md">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Tickets</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-100">
            {movies.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">No movies found. Add one above!</td>
              </tr>
            ) : (
              movies.map((movie) => (
                <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-2 px-4">
                    {movie.movie_image ? (
                      <img src={movie.movie_image} alt={movie.movie_name} className="w-20 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-20 h-12 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium">{movie.movie_name}</td>
                  <td className="py-2 px-4 text-gray-300 text-sm max-w-xs truncate">{movie.description || '—'}</td>
                  <td className="py-2 px-4 text-yellow-400 font-semibold">₹{movie.price}</td>
                  <td className="py-2 px-4">{movie.total_tickets}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
