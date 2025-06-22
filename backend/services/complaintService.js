const Complaints = require("../models/Complaints");

// Function to generate a composite complaint ID
const generateCompositeId = async () => {
  const complaintCount = await Complaints.countDocuments();
  return `CM-${String(complaintCount + 1).padStart(3, "0")}`; // CM-001, CM-002, ...
};

const getAllComplaints = async () => {
  const complaints = await Complaints.find();

  // Update complaints missing compositeId
  const updatedComplaints = await Promise.all(
    complaints.map(async (complaint) => {
      if (!complaint.compositeId) {
        const newCompositeId = await generateCompositeId();
        complaint.compositeId = newCompositeId;

        await Complaints.updateOne(
          { _id: complaint._id },
          { $set: { compositeId: newCompositeId } }
        );
      }
      return complaint;
    })
  );

  return updatedComplaints;
};

const addComplaint = async ({ userId, name, email, phone, complaint }) => {
  if (!userId || !name || !email || !phone || !complaint) {
    throw new Error("All fields are required");
  }

  const compositeId = await generateCompositeId();

  const newComplaint = new Complaints({
    userId,
    name,
    email,
    phone,
    complaint,
    compositeId,
  });

  return await newComplaint.save();
};

module.exports = {
  getAllComplaints,
  addComplaint,
};
