const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// GET all experiences
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const experiences = await Experience.find(query).select('-slots');
    res.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// GET single experience by ID with slots
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// POST create new experience (for admin/seeding)
router.post('/', async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    
    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create experience',
      error: error.message
    });
  }
});

// PUT update slot availability (for internal use)
router.put('/:id/slots/update', async (req, res) => {
  try {
    const { date, time, quantity } = req.body;
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    const slot = experience.slots.find(s => s.date === date);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot date not found'
      });
    }

    const timeSlot = slot.times.find(t => t.time === time);
    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    if (timeSlot.availableSlots < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough available slots'
      });
    }

    timeSlot.availableSlots -= quantity;
    if (timeSlot.availableSlots === 0) {
      timeSlot.status = 'soldout';
    }

    await experience.save();

    res.json({
      success: true,
      data: experience
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