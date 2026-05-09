import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expertAPI, bookingsAPI, timeSlotsAPI } from "../services/api";

function Booking() {
  const params = useParams();

  // Supports both:
  // 1) /booking/:expertId/:slotId
  // 2) /expert/:id/booking/:slotId
  const expertId = params.expertId ?? params.id;
  const slotId = params.slotId ?? null;


  const [expert, setExpert] = useState(null);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!expertId || !slotId) {
        setError('Missing route parameters (expertId/slotId).');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const expertRes = await expertAPI.getExpertById(expertId);
        setExpert(expertRes.data.expert);

        const slotRes = await timeSlotsAPI.getTimeSlots(expertId);

        // Find selected slot
        const grouped = slotRes.data?.slots || {};
        const allSlots = Object.values(grouped).flat();
        const selectedSlot = allSlots.find((s) => s._id === slotId);
        setSlot(selectedSlot || null);
      } catch (e) {
        console.error("Error fetching booking data:", e);
        setError(e?.response?.data?.message || "Error fetching booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [expertId, slotId]);

  const selectedDateLabel = useMemo(() => {
    if (!slot?.date) return '';
    try {
      return new Date(slot.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }, [slot]);

  const handleBooking = async () => {
    if (!expertId || !slotId) {
      setError('Missing route parameters (expertId/slotId).');
      return;
    }
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setError("Name, email, and phone are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await bookingsAPI.createBooking({
        expertId,
        timeSlotId: slotId,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone.trim(),
        notes: notes.trim() || undefined,
      });

      // Booking success: rely on navigation to keep UX simple.
      alert("Booking Created Successfully!");
      navigate("/my-bookings");

    } catch (e) {
      console.error("Booking error:", e);
      setError(e?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "#b91c1c" }}>{error}</div>;
  if (!expert) return <div>Expert not found</div>;
  if (!slot) return <div>Slot not found</div>;

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
      >
        ← Back
      </button>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/40 to-purple-500/40 blur-lg rounded-xl" />
                <img
                  src={expert.profileImage}
                  alt={expert.name}
                  className="relative w-full h-56 object-cover rounded-xl border border-slate-700"
                />
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-white">{expert.name}</h1>
                <p className="text-blue-400 mt-1">{expert.category}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-sm">
                  Date: <span className="text-white font-semibold">{selectedDateLabel}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-sm">
                  Time: <span className="text-white font-semibold">{slot.startTime}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-sm">
                  Rate: <span className="text-green-400 font-semibold">${expert.hourlyRate}/hr</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Name *</label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Email *</label>
                  <input
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Phone *</label>
                  <input
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 min-h-[42px]"
                    placeholder="Any details you'd like to share"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-5 bg-red-900/60 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleBooking}
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.01] shadow-lg shadow-blue-500/20"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>

              <div className="mt-4 text-xs text-slate-400">
                You’ll receive real-time updates when this slot changes.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1 rounded-full bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-blue-500/60 animate-pulse" />
    </div>
  );
}

export default Booking;
