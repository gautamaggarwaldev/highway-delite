const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');

// Generate unique booking reference
function generateBookingRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// POST create new booking
router.post('/', async (req, res) => {
  try {
    const {
      experienceId,
      userName,
      userEmail,
      userPhone,
      date,
      time,
      quantity,
      price,
      subtotal,
      taxes,
      discount,
      promoCode,
      total
    } = req.body;

    // Validate required fields
    if (!experienceId || !userName || !userEmail || !userPhone || !date || !time || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Find the slot
    const slot = experience.slots.find(s => s.date === date);
    if (!slot) {
      return res.status(400).json({
        success: false,
        message: 'Selected date not available'
      });
    }

    const timeSlot = slot.times.find(t => t.time === time);
    if (!timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Selected time not available'
      });
    }

    // Check availability
    if (timeSlot.availableSlots < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough available slots',
        availableSlots: timeSlot.availableSlots
      });
    }

    // Check for double booking (same email, experience, date, time)
    const existingBooking = await Booking.findOne({
      userEmail,
      experienceId,
      date,
      time,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this slot'
      });
    }

    // Update slot availability
    timeSlot.availableSlots -= quantity;
    if (timeSlot.availableSlots === 0) {
      timeSlot.status = 'soldout';
    }
    await experience.save();

    // Create booking
    const bookingRef = generateBookingRef();
    const booking = new Booking({
      experienceId,
      experienceTitle: experience.title,
      userName,
      userEmail,
      userPhone,
      date,
      time,
      quantity,
      price,
      subtotal,
      taxes,
      discount,
      promoCode,
      total,
      bookingRef,
      status: 'confirmed'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        bookingRef: booking.bookingRef,
        booking
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Booking failed',
      error: error.message
    });
  }
});

// GET booking by reference
router.get('/:bookingRef', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingRef: req.params.bookingRef })
      .populate('experienceId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// GET all bookings (for admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('experienceId').sort('-createdAt');
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;