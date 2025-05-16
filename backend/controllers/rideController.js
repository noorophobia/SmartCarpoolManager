const Ride = require('../models/Ride');

// Generate a composite ride ID
const generateCompositeId = async () => {
  const rideCount = await Ride.countDocuments();
  return `RIDE-${String(rideCount + 1).padStart(3, '0')}`;
};

// Get all rides
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate('paymentIds vehicleId driverId passengerIds');
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single ride by ID
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('paymentIds vehicleId driverId passengerIds');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRides,
  getRideById,
  generateCompositeId, // optional: expose this if needed elsewhere
};
