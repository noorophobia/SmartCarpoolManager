const Passenger = require('../models/Passenger');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Generate composite ID
const generateCompositeId = async () => {
  const passengerCount = await Passenger.countDocuments({ compositeId: { $exists: true } });
  return `PR-${String(passengerCount + 1).padStart(3, '0')}`;
};

async function getAllPassengersAndAssignIds() {
  const passengers = await Passenger.find();
  let counter = await Passenger.countDocuments({ compositeId: { $exists: true } });

  const updatedPassengers = await Promise.all(
    passengers.map(async (passenger) => {
      if (!passenger.compositeId) {
        counter++;
        const newCompositeId = `PR-${String(counter).padStart(3, '0')}`;
        passenger.compositeId = newCompositeId;
        await Passenger.updateOne({ _id: passenger._id }, { $set: { compositeId: newCompositeId } });
      }
      return passenger;
    })
  );

  return updatedPassengers;
}

async function getPassengerById(id) {
  return await Passenger.findById(id);
}

async function createPassenger(data) {
  const { name, email, phone, gender, password } = data;
  if (!name || !email || !phone || !gender || !password) {
    throw new Error('All fields are required');
  }

  const compositeId = await generateCompositeId();
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newPassenger = new Passenger({
    name,
    email,
    phone,
    gender,
    password: hashedPassword,
    compositeId,
  });

  return await newPassenger.save();
}

async function updatePassenger(id, updateFields) {
  return await Passenger.findByIdAndUpdate(id, updateFields, { new: true });
}

async function deletePassenger(id) {
  return await Passenger.findByIdAndDelete(id);
}

async function getPassengerCount() {
  return await Passenger.countDocuments();
}

module.exports = {
  getAllPassengersAndAssignIds,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerCount,
};
