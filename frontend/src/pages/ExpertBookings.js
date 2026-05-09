import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { expertAPI, bookingsAPI } from '../services/api';

const DEFAULT_PASSWORD = '123';

const STATUS_META = {
  pending: {
    label: 'Pending',
    bg: 'bg-yellow-900/60',
    text: 'text-yellow-200',
    border: 'border-yellow-400/20',
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-900/60',
    text: 'text-emerald-200',
    border: 'border-emerald-400/20',
  },
};

const ExpertBookings = () => {
  const { expertId: routeExpertId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [confirmingId, setConfirmingId] = useState(null);

  // Full-page transition
  const [pageEnter, setPageEnter] = useState(false);
  const [lastConfirmedId, setLastConfirmedId] = useState(null);

  // Expert login (expertId + name + default password)
  const [loginName, setLoginName] = useState('');
  const [loginExpertId, setLoginExpertId] = useState(routeExpertId || '');
  const [loginPassword, setLoginPassword] = useState(DEFAULT_PASSWORD);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (routeExpertId) {
      setLoginExpertId(routeExpertId);

      // Full page enter animation on route change
      setPageEnter(false);
      setTimeout(() => setPageEnter(true), 40);
    }
  }, [routeExpertId]);

  // Auto-fill from navbar login (no extra work for expert)
  useEffect(() => {
    const raw = localStorage.getItem('expertLogin');
    if (!raw || !routeExpertId) return;

    try {
      const parsed = JSON.parse(raw);
      if (String(parsed?.expertId || '') === String(routeExpertId)) {
        setLoginName(String(parsed?.name || ''));
        setLoggedIn(true);

        // Load pending bookings
        setLoading(true);
        bookingsAPI
          .getBookingsByExpertId(String(routeExpertId))
          .then((r) => setBookings(r.data.bookings || []))
          .catch(() => setError('Failed to load bookings. Please login again.'))
          .finally(() => setLoading(false));
      }
    } catch {
      // ignore
    }
  }, [routeExpertId]);

  const pendingBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b?.status === 'pending' &&
          String(b?.expertId?._id || b?.expertId) === String(routeExpertId)
      ),
    [bookings, routeExpertId]
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!loginExpertId.trim() || !loginName.trim() || !loginPassword.trim()) {
      setError('Please enter expert ID, expert name, and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await expertAPI.login({
        expertId: loginExpertId.trim(),
        name: loginName.trim(),
        password: loginPassword.trim(),
      });

      setLoggedIn(true);

      // Optional: persist for convenience
      localStorage.setItem(
        'expertLogin',
        JSON.stringify({
          expertId: res.data?.expert?._id || loginExpertId.trim(),
          name: res.data?.expert?.name || loginName.trim(),
          loggedInAt: Date.now(),
        })
      );

      // Load pending bookings for this expertId
      const bookingsRes = await bookingsAPI.getBookingsByExpertId(loginExpertId.trim());
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      setLoggedIn(false);
      setBookings([]);
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    setConfirmingId(bookingId);
    setError(null);

    try {
      await bookingsAPI.updateBookingStatus(bookingId, { status: 'confirmed' });

      // Optimistic UI update
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'confirmed' } : b))
      );

      setLastConfirmedId(bookingId);
      // Clear after animation
      setTimeout(() => setLastConfirmedId((id) => (id === bookingId ? null : id)), 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    } finally {
      setConfirmingId(null);
    }
  };

  const SkeletonCard = ({ idx }) => (
    <div
      key={`sk-${idx}`}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="h-5 w-44 bg-slate-700/60 rounded animate-pulse" />
          <div className="mt-2 h-4 w-56 bg-slate-700/60 rounded animate-pulse" />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-16 bg-slate-700/40 rounded animate-pulse" />
            <div className="h-16 bg-slate-700/40 rounded animate-pulse" />
          </div>
          <div className="mt-4 h-10 bg-slate-700/35 rounded animate-pulse" />
        </div>
        <div className="w-32 h-10 bg-slate-700/50 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <div
      className={`space-y-8 transition-all duration-500 ease-out ${
        pageEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 p-8">
        <div
          className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative text-center">
          <h1 className="text-4xl font-bold text-white">
            Expert <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Dashboard</span>
          </h1>
          <p className="text-slate-300 mt-2">
            Login and confirm your <span className="text-white font-semibold">pending</span> bookings
          </p>
        </div>
      </div>

      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700 p-6 sm:p-8">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <label className="text-xs text-slate-400 block mb-1">Expert MongoDB ID</label>
              <input
                type="text"
                placeholder="ObjectId (e.g. 65f...)"
                value={loginExpertId}
                onChange={(e) => setLoginExpertId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="text-xs text-slate-400 block mb-1">Expert Name</label>
              <input
                type="text"
                placeholder="Your expert name"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="text-xs text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                placeholder="Password (default 123)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
            <div className="text-xs text-slate-400">
              Default password is <span className="text-white font-semibold">123</span>. Wrong details will fail login.
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoginName('');
                setLoginPassword(DEFAULT_PASSWORD);
                setLoginExpertId(routeExpertId || '');
              }}
              className="text-xs text-slate-300 hover:text-white transition-colors"
            >
              Use different expert
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/60 border border-red-700/70 text-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          <SkeletonCard idx={1} />
          <SkeletonCard idx={2} />
        </div>
      ) : (
        <div className="space-y-4">
          {!loggedIn ? (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 text-center">
              <p className="text-slate-300 text-lg">Please login to view and confirm bookings.</p>
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 text-center">
              <p className="text-slate-300 text-lg">No pending bookings found for your expert.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingBookings.map((booking, idx) => {
                const status = STATUS_META[booking.status] || STATUS_META.pending;
                const isPopped = lastConfirmedId === booking._id;
                return (
                  <div
                    key={booking._id}
                    style={{ transitionDelay: `${Math.min(idx * 60, 420)}ms` }}
                    className={`bg-slate-800/60 border border-slate-700 rounded-2xl p-6
                      hover:border-blue-400/40
                      transition-all duration-300
                      shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
                      ${pageEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {booking.clientName || 'Client'}
                            </h3>
                            <p className="text-blue-300 text-sm">{booking.clientEmail}</p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                          <div className="rounded-xl bg-slate-900/30 border border-slate-700/60 px-4 py-3">
                            <p className="text-slate-400 text-xs">Date</p>
                            <p className="text-white font-semibold mt-1">
                              {booking.timeSlotId?.date
                                ? new Date(booking.timeSlotId?.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-900/30 border border-slate-700/60 px-4 py-3">
                            <p className="text-slate-400 text-xs">Time</p>
                            <p className="text-white font-semibold mt-1">
                              {booking.timeSlotId?.startTime ? booking.timeSlotId?.startTime : '-'} -{' '}
                              {booking.timeSlotId?.endTime ? booking.timeSlotId?.endTime : '-'}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-900/30 border border-slate-700/60 px-4 py-3">
                            <p className="text-slate-400 text-xs">Rate</p>
                            <p className="text-green-300 font-semibold mt-1">
                              ${booking.expertId?.hourlyRate}/hour
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-900/30 border border-slate-700/60 px-4 py-3">
                            <p className="text-slate-400 text-xs">Session</p>
                            <p className="text-white font-semibold mt-1">
                              {booking.timeSlotId?._id ? booking.timeSlotId?._id.toString().slice(-6) : '—'}
                            </p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/60">
                            <p className="text-slate-400 text-xs">Client Notes</p>
                            <p className="text-slate-200 mt-1">{booking.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="w-full md:w-auto flex items-start">
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          disabled={confirmingId === booking._id}
                          className={`w-full md:w-auto px-6 py-2
                            bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                            disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed
                            text-white font-semibold rounded-xl transition-all duration-200 h-fit whitespace-nowrap shadow-lg shadow-blue-500/10
                            ${isPopped ? 'scale-[1.06] ring-2 ring-emerald-300/60' : 'hover:scale-[1.01]'}`}
                        >
                          {confirmingId === booking._id ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertBookings;

