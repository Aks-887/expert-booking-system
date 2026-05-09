const TimeSlot = require('../models/TimeSlot');
const Expert = require('../models/Expert');

// Get available time slots for an expert
exports.getTimeSlots = async (req, res) => {
  try {
    const { expertId } = req.params;
    const { date } = req.query;

    let query = {
      expertId,
      isBooked: false,
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const slots = await TimeSlot.find(query).sort({ date: 1, startTime: 1 });

    // Group by date
    const groupedSlots = {};
    slots.forEach((slot) => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!groupedSlots[dateKey]) {
        groupedSlots[dateKey] = [];
      }
      groupedSlots[dateKey].push(slot);
    });

    res.status(200).json({
      success: true,
      slots: groupedSlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching time slots',
      error: error.message,
    });
  }
};

// Create time slots for expert (admin)
exports.createTimeSlots = async (req, res) => {
  try {
    const { expertId, date, slots } = req.body;

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    const createdSlots = [];

    for (const slot of slots) {
      const timeSlot = new TimeSlot({
        expertId,
        date: new Date(date),
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      await timeSlot.save();
      createdSlots.push(timeSlot);
    }

    res.status(201).json({
      success: true,
      message: 'Time slots created successfully',
      slots: createdSlots,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating time slots',
      error: error.message,
    });
  }
};

// Update time slot status (mark as booked)
exports.updateTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBooked, bookedBy } = req.body;

    const slot = await TimeSlot.findByIdAndUpdate(
      id,
      { isBooked, bookedBy },
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Time slot updated successfully',
      slot,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating time slot',
      error: error.message,
    });
  }
};
