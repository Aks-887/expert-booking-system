import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { expertAPI } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [expertId, setExpertId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExpertLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!expertId.trim() || !name.trim() || !password.trim()) {
      setError('Please enter expert ID, expert name, and password.');
      return;
    }

    setLoading(true);
    try {
      await expertAPI.login({
        expertId: expertId.trim(),
        name: name.trim(),
        password: password.trim(),
      });

      // Persist so ExpertBookings can auto-fill and load bookings.
      localStorage.setItem(
        'expertLogin',
        JSON.stringify({
          expertId: expertId.trim(),
          name: name.trim(),
          loggedInAt: Date.now(),
        })
      );

      setOpen(false);
      navigate(`/expert-bookings/${expertId.trim()}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="bg-slate-950 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex-shrink-0 font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-600 transition-all duration-300"
              >
                ✨ ExpertBooking
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Experts
              </Link>
              <Link
                to="/my-bookings"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating corner button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600
                   text-white font-semibold shadow-lg shadow-blue-500/20
                   transition-all duration-200
                   hover:from-blue-600 hover:to-purple-700 hover:scale-[1.04] hover:shadow-blue-500/40
                   focus:outline-none focus:ring-2 focus:ring-blue-400/60
                   animate-pulse"
      >
        Expert Login
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <div
            className="w-full sm:w-[460px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl
                       transform transition-all duration-200 opacity-100 scale-100
                       animate-[fadeIn_180ms_ease-out]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
              <div>
                <div className="text-white font-bold text-lg">Expert Login</div>
                <div className="text-slate-400 text-sm">Login using MongoDB ID + name (password default: 123)</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white text-2xl leading-none transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleExpertLogin} className="px-5 py-4 space-y-3">
              <input
                type="text"
                placeholder="Expert MongoDB ID"
                value={expertId}
                onChange={(e) => setExpertId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <input
                type="text"
                placeholder="Expert Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <input
                type="password"
                placeholder="Password (default 123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />

              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
