const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  times: [{
    time: {
      type: String,
      required: true
    },
    totalSlots: {
      type: Number,
      required: true,
      default: 10
    },
    availableSlots: {
      type: Number,
      required: true,
      default: 10
    },
    status: {
      type: String,
      enum: ['available', 'soldout'],
      default: 'available'
    }
  }]
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  minimumAge: {
    type: Number,
    default: 10
  },
  duration: {
    type: String,
    default: '2-3 hours'
  },
  included: {
    type: [String],
    default: ['Certified guide', 'Safety gear', 'Safety briefing']
  },
  slots: [slotSchema],
  taxes: {
    type: Number,
    default: 59
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experience', experienceSchema);