const express = require('express');
const router = express.Router();
const Complaints = require('../models/Complaints'); 

const Counter = require('./counter');  // Import Counter model
 const generateCompositeId = async () => {
  try {
     const counter = await Counter.findOneAndUpdate(
      { _id: 'complaintId' },
      { $inc: { seq: 1 } }, // Increment the seq field by 1
      { new: true, upsert: true } // Create the document if it doesn't exist
    );

    // Format the compositeId with zero padding
    const newCompositeId = `CM-${String(counter.seq).padStart(3, '0')}`;

    console.log(`Generated compositeId: ${newCompositeId}`);
    return newCompositeId;
  } catch (error) {
    console.error('Error generating compositeId:', error.message);
    throw error; // Rethrow error to be handled by the route
  }
};


router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaints.find();

    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found.' });
    }

  // Check for complaints missing compositeId and update them
  const updatedComplaints = await Promise.all(
    complaints.map(async (complaint) => {
      if (!complaint.compositeId) {
        const newCompositeId = await generateCompositeId();
        complaint.compositeId = newCompositeId;
        console.log(`Updating complaint ${complaint._id} with compositeId: ${newCompositeId}`);
        
        // Save the updated compositeId without triggering full validation
        try {
          await Complaints.updateOne(
            { _id: complaint._id },
            { $set: { compositeId: newCompositeId } }
          );
          console.log(`Complaint ${complaint._id} updated successfully`);
        } catch (error) {
          console.error(`Error saving complaint ${complaint._id}:`, error.message);
          throw error;
        }
      }
      return complaint;
    })
  );

  res.status(200).json(updatedComplaints);
} catch (error) {
  console.error('Failed to fetch or update complaints:', error.message);
  res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
}
}); 

module.exports = router;
