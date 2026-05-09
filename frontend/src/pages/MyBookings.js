import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

const MyBookings = () => {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState(null);

  const handleSearchChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await bookingsAPI.getBookings(email);
      setBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancelling(bookingId);

    try {
      await bookingsAPI.cancelBooking(bookingId);
      // Refresh bookings
      const response = await bookingsAPI.getBookings(email);
      setBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    if (email) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [email]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">My Bookings</h1>
        <p className="text-slate-400 mt-2">View and manage your expert session bookings</p>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <form onSubmit={handleSearch} className="flex gap-4 flex-col sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email to view bookings"
            value={email}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
          <button 
            type="submit" 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin" style={{borderTopColor: 'transparent', borderRightColor: 'transparent'}}></div>
          </div>
        </div>
      ) : (
        <>
          {searched && bookings.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400 text-lg">No bookings found for this email.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors duration-200">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{booking.expertId?.name || 'Unknown Expert'}</h3>
                        <p className="text-blue-400 text-sm">{booking.expertId?.category}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-700">
                        <div>
                          <p className="text-slate-400 text-sm">Date</p>
                          <p className="text-white font-semibold">
                            {new Date(booking.timeSlotId?.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Time</p>
                          <p className="text-white font-semibold">{booking.timeSlotId?.startTime} - {booking.timeSlotId?.endTime}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Rate</p>
                          <p className="text-green-400 font-semibold">${booking.expertId?.hourlyRate}/hour</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === 'completed' ? 'bg-green-900 text-green-200' :
                            booking.status === 'cancelled' ? 'bg-red-900 text-red-200' :
                            booking.status === 'confirmed' ? 'bg-blue-900 text-blue-200' :
                            'bg-yellow-900 text-yellow-200'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="bg-slate-900 rounded p-3 border border-slate-700">
                          <p className="text-slate-400 text-sm">Notes</p>
                          <p className="text-slate-300">{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancelling === booking._id}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 h-fit whitespace-nowrap"
                      >
                        {cancelling === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;
