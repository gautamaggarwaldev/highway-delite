const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DataBase Connected Successfully...'))
  .catch(err => console.error('MongoDB Connection Error:', err));


// Import Routes
const experiencesRoutes = require('./routes/ExperienceRoutes.js');
const bookingsRoutes = require('./routes/BookingRoutes.js');
const promoRoutes = require('./routes/PromoCodeRoutes.js');

// Use Routes
app.use('/api/experiences', experiencesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/promo', promoRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});