import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expertAPI, timeSlotsAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import socketService from '../services/socketService';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { slotBookedData, slotReleasedData } = useSocket();
  const [expert, setExpert] = useState(null);
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpertDetails = async () => {
    try {
      const response = await expertAPI.getExpertById(id);
      setExpert(response.data.expert);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expert details');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchExpertDetails();
    socketService.joinExpertRoom(id);

    return () => {
      socketService.leaveExpertRoom(id);
    };
  }, [id]);

  const fetchTimeSlots = async () => {
    try {
      const response = await timeSlotsAPI.getTimeSlots(id);
      setSlots(response.data.slots);
    } catch (err) {
      console.error('Failed to fetch time slots:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (expert) {
      fetchTimeSlots();
    }
  }, [expert, id]);

  // Update slots when another user books
  useEffect(() => {
    if (slotBookedData && slotBookedData.expertId === id) {
      // Remove the booked slot from state
      setSlots((prevSlots) => {
        const updated = { ...prevSlots };
        Object.keys(updated).forEach((date) => {
          updated[date] = updated[date].filter(
            (slot) => slot._id !== slotBookedData.timeSlotId
          );
        });
        return updated;
      });
    }
  }, [slotBookedData, id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (slotReleasedData && slotReleasedData.expertId === id) {
      // Refresh slots to show the released slot
      fetchTimeSlots();
    }
  }, [slotReleasedData, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin" style={{borderTopColor: 'transparent', borderRightColor: 'transparent'}}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
        Expert not found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate('/')}
        className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 transition-colors"
      >
        ← Back to Experts
      </button>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="md:col-span-1">
            <img
              src={expert.profileImage}
              alt={expert.name}
              className="w-full h-64 rounded-lg object-cover border-2 border-slate-700"
            />
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-white">{expert.name}</h1>
              <p className="text-blue-400 text-lg mt-2">{expert.category}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-700">
              <div className="text-center">
                <p className="text-yellow-400 text-2xl font-bold">⭐ {expert.rating}</p>
                <p className="text-slate-400 text-sm">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400 text-2xl font-bold">{expert.experience}</p>
                <p className="text-slate-400 text-sm">Years Exp</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 text-2xl font-bold">${expert.hourlyRate}</p>
                <p className="text-slate-400 text-sm">Per Hour</p>
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed">{expert.bio}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Available Time Slots</h2>

        {Object.keys(slots).length === 0 && !loading ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-slate-400 text-lg">No available slots at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(slots).map((dateKey) => (
              <div key={dateKey} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white">
                  {new Date(dateKey).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-6">
                  {slots[dateKey].map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => !slot.isBooked && navigate(`/expert/${id}/booking/${slot._id}`)}
                      disabled={slot.isBooked}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        slot.isBooked
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/30'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDetail;
