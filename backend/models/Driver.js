const mongoose = require('mongoose');
const Counter = require('./counter'); // Import counter schema

const driverSchema = new mongoose.Schema({
  id: { 
    type: Number, 
     
    validate: {
      validator: Number.isInteger,
      message: 'ID must be an integer.',
    },
  },
  name: { 
    type: String, 
    required: [true, 'Name is required.'], 
    maxlength: [50, 'Name cannot exceed 50 characters.'], 
    trim: true // Removes leading and trailing whitespaces
  },
  email: { 
    type: String, 
    required: [true, 'Email is required.'], 
    unique: true, 
    maxlength: [50, 'Email cannot exceed 50 characters.'], 
    trim: true,
    lowercase: true, // Converts the email to lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
  },
  gender: { 
    type: String, 
    enum: {
      values: ['Male', 'Female'], 
      message: 'Gender must be either Male or Female.',
    }, 
    required: [true, 'Gender is required.']
  },
  cnic: { 
    type: String, 
    maxlength: [15, 'CNIC cannot exceed 15 characters.'], 
    required: [true, 'CNIC is required.'], 
    unique: true,
    match: [/^\d{5}-\d{7}-\d{1}$/, 'CNIC must be in the format XXXXX-XXXXXXX-X.'] // Validates standard CNIC format
  },
  phoneNumber: { 
    type: String, 
    required: [true, 'Phone number is required.'], 
    match: [
      /^((\+92)|0)(3[0-9]{2})[0-9]{7}$/, 
      'Phone number must be a valid Pakistani number in the format +92XXXXXXXXXX or 03XXXXXXXXX.'
    ] // Validates Pakistani phone number format
  },
});

// Function to get the next auto-incremented ID
const getNextSequenceValue = async (modelName) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: modelName },        // Use the model name as the _id for the counter document
    { $inc: { seq: 1 } },      // Increment the 'seq' field by 1
    { new: true, upsert: true, setDefaultsOnInsert: true } // Ensure the document is created if it doesn't exist
  );
  return counter.seq;          // Return the incremented value
};

driverSchema.pre('save', async function (next) {
  if (this.isNew) { // Only apply the ID logic if the document is new
    try {
      const nextId = await getNextSequenceValue('driver'); // Get the next ID from the counter
      if (!nextId) {
        return next(new Error('Failed to generate ID for new driver'));
      }
      console.log('Assigning new ID:', nextId);  // Debugging line
      this.id = nextId;  // Assign the new ID
      next();  // Proceed with saving the driver
    } catch (err) {
      console.error('Error getting next sequence value:', err);  // Log any errors
      next(err);  // Pass the error to next middleware
    }
  } else {
    next();  // If not a new document, continue with the save
  }
});


// Create and export the model
const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
