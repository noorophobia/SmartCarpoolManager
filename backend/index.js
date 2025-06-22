const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const helmet = require('helmet');

 const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });


// Import routes
const passengerRatings = require("./routes/passenger-review");
const compositeIDRoutes = require("./routes/allRides");
const notificationRoutes = require("./routes/notification");
 const driversRoutes = require('./routes/driver');  
 const adminRoutes = require('./routes/admin');   
const packagesRoutes = require('./routes/packages');
const passengerRoutes = require('./routes/passengers');
const complaintRoutes = require('./routes/complaints');
 const singlerideRoutes = require("./routes/single-rides");
const carpoolrideRoutes = require("./routes/carpoolRide");
const paymentRoutes = require("./routes/payment");
const rateSettingsRoute = require('./routes/rate-setting');  

// Admin insertion function
const { insertAdmin } = require('./routes/insertAdmin');   

const app = express();
const PORT = process.env.PORT || 5000;

// Set security policies
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "maps.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "maps.gstatic.com", "*.googleusercontent.com"],
      connectSrc: ["'self'", "maps.googleapis.com", "*.firebaseio.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
    }
  }
}));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT','OPTIONS'],  
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use(compositeIDRoutes);
app.use(driversRoutes);
app.use(singlerideRoutes);
app.use(carpoolrideRoutes);
app.use(packagesRoutes);
app.use(notificationRoutes);
app.use(passengerRatings);
app.use(passengerRoutes);
app.use('/api', complaintRoutes);
  app.use("/api/admin", adminRoutes);
 app.use(paymentRoutes);
app.use('/api', rateSettingsRoute);

// MongoDB connection
console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
   // insertAdmin();
  })
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// Start the server only if NOT in test mode
let server;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export both app & server
module.exports = { app, server };
