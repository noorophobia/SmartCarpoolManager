// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
   require('dotenv').config();

 const rateSettingsRoute = require('./routes/rate-settings');  
const driversRoutes = require('./routes/driver');  
const vehiclesRoutes=require('./routes/vehicle')
const adminRoutes = require('./routes/admin');  // Import the admin routes
 
const { insertAdmin } = require('./routes/insertAdmin');  // Import the insertAdmin function

const app = express();
const PORT = process.env.PORT || 5000;
 

// Set the Content Security Policy header using helmet
app.use(helmet({
  crossOriginResourcePolicy: false, // fixed getting image from backend server

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

app.use(cors({
  origin: 'http://localhost:5173' , // Allow only frontend domain
  methods: ['GET', 'POST', 'DELETE', 'PUT','OPTIONS'], // Allow DELETE method
//y methods
  allowedHeaders: ['Content-Type', 'Authorization']

}));

// Then your static routes
app.use('/uploads', express.static('uploads'));

app.use(express.json()); // Parse JSON request bodies
// Use the drivers route
app.use(driversRoutes);
app.use('/api', rateSettingsRoute);
app.use(vehiclesRoutes);
app.use("/api/admin", adminRoutes);

app.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  res.sendFile(imagePath);
});
// MongoDB connection
console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  //insertAdmin();  // Call insertAdmin 
})  .catch((err) => console.log('Failed to connect to MongoDB:', err));
  
// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
