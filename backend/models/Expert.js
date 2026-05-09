const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Expert name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science', 'Cloud Architecture'],
    },
    experience: {
      type: Number,
      required: [true, 'Experience in years is required'],
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    bio: {
      type: String,
      default: '',
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: 0,
    },
    profileImage: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expert', expertSchema);
