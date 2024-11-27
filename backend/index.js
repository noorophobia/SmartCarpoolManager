// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const itemRoutes = require('./routes/userRoutes'); // Importing route file

const app = express();
const PORT = process.env.PORT || 5000;

// Set the Content Security Policy header using helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "maps.googleapis.com"], // Add this to allow Google Maps
      styleSrc: ["'self'", "'unsafe-inline'"], // Add this for inline styles
      imgSrc: ["'self'", "data:", "maps.gstatic.com", "*.googleusercontent.com"], // Allow images from specific sources
      connectSrc: ["'self'", "maps.googleapis.com", "*.firebaseio.com"], // Allow connections to Firebase and Google Maps
      fontSrc: ["'self'", "fonts.gstatic.com"], // Allow fonts from Google Fonts
    }
  }
}));

app.use(cors()); // Enable CORS for all origins (you can specify origins here)
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

// Use user routes
app.use('/api/users', itemRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
