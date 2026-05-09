const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Expert = require('../models/Expert');
const mongoose = require('mongoose');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { expertId, timeSlotId, clientName, clientEmail, clientPhone, notes } = req.body;

    // Validate required fields
    if (!expertId || !timeSlotId || !clientName || !clientEmail || !clientPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if time slot exists and is not booked
    const timeSlot = await TimeSlot.findById(timeSlotId);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    if (timeSlot.isBooked) {
      return res.status(409).json({
        success: false,
        message: 'This time slot has already been booked',
      });
    }

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    // Create booking
    const booking = new Booking({
      expertId,
      timeSlotId,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      status: 'pending',
    });

    await booking.save();

    // Update time slot to mark as booked
    await TimeSlot.findByIdAndUpdate(
      timeSlotId,
      { isBooked: true, bookedBy: booking._id }
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

/**
 * Get bookings for an expert by expertId (used by expert login).
 * Only returns pending bookings by default.
 */
exports.getBookingsByExpertId = async (req, res) => {
  try {
    const { expertId } = req.query;

    if (!expertId) {
      return res.status(400).json({
        success: false,
        message: 'expertId is required',
      });
    }

    const bookings = await Booking.find({ expertId, status: 'pending' })
      .populate('expertId', 'name category hourlyRate profileImage')
      .populate('timeSlotId', 'date startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

// Get bookings by email
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const bookings = await Booking.find({ clientEmail: email.toLowerCase() })
      .populate('expertId', 'name category hourlyRate profileImage')
      .populate('timeSlotId', 'date startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('expertId')
      .populate('timeSlotId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetingLink } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status, ...(meetingLink && { meetingLink }) },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message,
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Free up the time slot
    await TimeSlot.findByIdAndUpdate(
      booking.timeSlotId,
      { isBooked: false, bookedBy: null }
    );

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message,
    });
  }
};