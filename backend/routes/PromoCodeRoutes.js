const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');

// POST validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
    }

    // Find promo code
    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code'
      });
    }

    // Check expiry
    if (new Date() > new Date(promo.expiryDate)) {
      return res.status(400).json({
        success: false,
        message: 'Promo code has expired'
      });
    }

    // Check minimum order value
    if (subtotal < promo.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${promo.minOrderValue} required`
      });
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === 'percentage') {
      discount = Math.round((subtotal * promo.value) / 100);
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else if (promo.type === 'flat') {
      discount = promo.value;
    }

    res.json({
      success: true,
      message: 'Promo code applied successfully',
      data: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
        discount,
        description: promo.description
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// POST create promo code (for admin/seeding)
router.post('/', async (req, res) => {
  try {
    const promo = new PromoCode(req.body);
    await promo.save();
    
    res.status(201).json({
      success: true,
      data: promo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create promo code',
      error: error.message
    });
  }
});

// GET all promo codes (for admin)
router.get('/', async (req, res) => {
  try {
    const promos = await PromoCode.find();
    
    res.json({
      success: true,
      count: promos.length,
      data: promos
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