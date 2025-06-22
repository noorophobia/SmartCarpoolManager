const complaintService = require("../services/complaintService");

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await complaintService.getAllComplaints();

    if (complaints.length === 0) {
      return res.status(200).json({ message: "No complaints found." });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Failed to fetch complaints:", error.message);
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

const addComplaint = async (req, res) => {
  try {
    const savedComplaint = await complaintService.addComplaint(req.body);
    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: savedComplaint,
    });
  } catch (error) {
    console.error("Error adding complaint:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllComplaints,
  addComplaint,
};
