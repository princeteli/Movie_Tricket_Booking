import React, { useState } from 'react'
import api from '../api'
import Admin from './Admin'

const AdminLogin = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password")
      return
    }

    setLoading(true)
    setError("")

    try {
      await api.post('/admin/login', {
        username: username.trim(),
        password: password.trim()
      })
      setIsLoggedIn(true)
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Enter key support
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  if (isLoggedIn) return <Admin onLogout={() => setIsLoggedIn(false)} />

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm text-gray-100">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-gray-400 text-sm mt-1">MovieApp Dashboard</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              id="admin-username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
              className="w-full border border-gray-600 bg-gray-700 px-4 py-2.5 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full border border-gray-600 bg-gray-700 px-4 py-2.5 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            id="admin-login-btn"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-2.5 rounded-lg transition mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Hint */}
        <p className="text-gray-500 text-xs text-center mt-6">
          Default: admin / admin@123
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
