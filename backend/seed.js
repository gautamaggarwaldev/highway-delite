const mongoose = require('mongoose');
const Experience = require('./models/Experience');
const PromoCode = require('./models/PromoCode');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Generate date strings for next 5 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    dates.push(`${month} ${day}`);
  }
  return dates;
};

// Generate time slots
const generateTimeSlots = () => {
  return [
    { time: '07:00 am', totalSlots: 10, availableSlots: 4, status: 'available' },
    { time: '09:00 am', totalSlots: 10, availableSlots: 2, status: 'available' },
    { time: '11:00 am', totalSlots: 10, availableSlots: 5, status: 'available' },
    { time: '01:00 pm', totalSlots: 10, availableSlots: 0, status: 'soldout' },
    { time: '03:00 pm', totalSlots: 10, availableSlots: 8, status: 'available' },
    { time: '05:00 pm', totalSlots: 10, availableSlots: 6, status: 'available' }
  ];
};

const experiences = [
  {
    title: 'Kayaking',
    location: 'Udupi',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    about: 'Scenic routes, trained guides, and safety briefing. Minimum age 10.',
    minimumAge: 10,
    duration: '2-3 hours',
    included: ['Certified guide', 'Safety gear', 'Kayak equipment', 'Life jackets', 'Safety briefing'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  },
  {
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    price: 899,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    about: 'Early morning trek to witness breathtaking sunrise views. Includes transportation and breakfast.',
    minimumAge: 8,
    duration: '4-5 hours',
    included: ['Certified guide', 'Transportation', 'Breakfast', 'Photography spots'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  },
  {
    title: 'Coffee Trail',
    location: 'Coorg',
    price: 1299,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    about: 'Explore coffee plantations, learn about coffee making process. Includes coffee tasting session.',
    minimumAge: 12,
    duration: '3-4 hours',
    included: ['Expert guide', 'Plantation tour', 'Coffee tasting', 'Refreshments'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  },
  {
    title: 'Kayaking',
    location: 'Udupi, Karnataka',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800',
    about: 'Paddle through serene backwaters with experienced guides. Perfect for beginners.',
    minimumAge: 10,
    duration: '2-3 hours',
    included: ['Professional guide', 'All equipment', 'Safety gear', 'Basic training'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  },
  {
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    price: 899,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800',
    about: 'Witness the magical sunrise from 1478m altitude. Includes guided trek and breakfast.',
    minimumAge: 8,
    duration: '4-5 hours',
    included: ['Experienced guide', 'Round trip transport', 'Light breakfast', 'First aid kit'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  },
  {
    title: 'Boat Cruise',
    location: 'Sunderban',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1544551763-92990d835876?w=800',
    about: 'Enjoy a relaxing boat cruise through the mangrove forests. Wildlife spotting opportunities.',
    minimumAge: 5,
    duration: '3-4 hours',
    included: ['Licensed captain', 'Life jackets', 'Refreshments', 'Wildlife guide'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  },
  {
    title: 'Bunjee Jumping',
    location: 'Manali',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?w=800',
    about: 'Experience the ultimate adrenaline rush with our certified instructors and top safety equipment.',
    minimumAge: 18,
    duration: '1-2 hours',
    included: ['Certified instructor', 'Safety harness', 'Insurance', 'Video recording'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  },
  {
    title: 'Coffee Trail',
    location: 'Coorg',
    price: 1299,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    about: 'Walk through lush coffee estates, learn about cultivation, and enjoy fresh brew.',
    minimumAge: 10,
    duration: '3-4 hours',
    included: ['Local expert', 'Estate tour', 'Coffee samples', 'Traditional lunch'],
    slots: generateDates().map(date => ({ date, times: generateTimeSlots() })),
    taxes: 59
  }
];

const promoCodes = [
  {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    description: 'Get 10% off on your booking',
    isActive: true,
    expiryDate: new Date('2025-12-31'),
    minOrderValue: 500,
    maxDiscount: 200
  },
  {
    code: 'FLAT100',
    type: 'flat',
    value: 100,
    description: 'Flat ₹100 off on bookings',
    isActive: true,
    expiryDate: new Date('2025-12-31'),
    minOrderValue: 800,
    maxDiscount: null
  },
  {
    code: 'FIRSTBOOK',
    type: 'percentage',
    value: 15,
    description: 'First booking special - 15% off',
    isActive: true,
    expiryDate: new Date('2025-12-31'),
    minOrderValue: 1000,
    maxDiscount: 300
  },
  {
    code: 'WEEKEND50',
    type: 'flat',
    value: 50,
    description: 'Weekend special offer',
    isActive: true,
    expiryDate: new Date('2025-12-31'),
    minOrderValue: 500,
    maxDiscount: null
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Experience.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('Cleared existing data');

    // Insert experiences
    const createdExperiences = await Experience.insertMany(experiences);
    console.log(`${createdExperiences.length} experiences created`);

    // Insert promo codes
    const createdPromos = await PromoCode.insertMany(promoCodes);
    console.log(`${createdPromos.length} promo codes created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();