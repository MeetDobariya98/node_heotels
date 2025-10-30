const mongoose = require('mongoose');
require('dotenv').config();


// Define the MongoDB connection URL
//const mongoURL = 'mongodb://localhost:27017/hotels';
const mongoURL=process.env.MONGODB_URL;
// Set up MongoDB connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Default event listeners for database connection
db.on('connected', () => {
  console.log('✅ Connected to MongoDB server');
});

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Export the database connection
module.exports = db;
