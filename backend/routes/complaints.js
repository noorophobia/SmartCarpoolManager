const express = require('express');
const router = express.Router();
const Complaints = require('../models/Complaints'); 
 // Function to generate a composite ride ID
const generateCompositeId = async (pickUpLocation, dropOffLocation, rideMode) => {
  const complaintCount = await Complaints.countDocuments();
  return `CM-${String(complaintCount + 1).padStart(3, '0')}`; // Generates IDs like PAY-001, PAY-002, etc.
};
// Route to add a new complaint
router.post('/complaints', async (req, res) => {
  try {
    const { userId, name, email, phone, complaint } = req.body;

    if (!userId || !name || !email || !phone || !complaint) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const compositeId = await generateCompositeId(); // Generate unique ID

    const newComplaint = new Complaints({
      userId,
      name,
      email,
      phone,
      complaint,
      compositeId
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
  } catch (error) {
    console.error('Error adding complaint:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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
