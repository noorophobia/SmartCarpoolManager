const SingleRide = require("../models/single-rides");
const CarpoolRide = require("../models/CarpoolRide");
const CompositeId = require("../models/CompositeIds");
const RateSettings = require("../models/RateSetting");
const Driver = require("../models/Driver");
const Counter = require("../models/Counter");

const generateCompositeId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "rideCounter" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `RIDE-${String(counter.value).padStart(3, "0")}`;
};

const processRide = async (ride, mode, commissionRate) => {
  const existing = await CompositeId.findOne({ rideID: ride._id });
  if (existing) return null;

  const date = ride.completedAt || ride.updatedAt || ride.createdAt || new Date();
  const status = ride.status || "N/A";

  const driver = await Driver.findById(ride.driverID);
  const driverCompositeId = driver?.compositeId || null;

  const newCompositeId = await generateCompositeId();
  const fare = ride.requestFare || 0;
  const revenue = fare * (commissionRate / 100);

  const newEntry = new CompositeId({
    rideID: ride._id,
    mode,
    status,
    compositeId: newCompositeId,
    fare,
    revenue,
    passengerId: ride.passengerId,
    driverCompositeId,
    driverID: ride.driverID,
    date,
  });

  await newEntry.save();
  return newEntry;
};

const generateCompositeIdsForRides = async () => {
  const singleRides = await SingleRide.find();
  const carpoolRides = await CarpoolRide.find();

  const rateSettings = await RateSettings.findOne();
  const commissionRate = rateSettings ? rateSettings.commission : 10;

  let createdMappings = [];

  for (const ride of singleRides) {
    const created = await processRide(ride, "single", commissionRate);
    if (created) createdMappings.push(created);
  }

  for (const ride of carpoolRides) {
    const created = await processRide(ride, "carpool", commissionRate);
    if (created) createdMappings.push(created);
  }

  const allMappings = await CompositeId.find();
  return { createdMappings, allMappings };
};

const getCompositeByRideID = async (rideID) => {
  return await CompositeId.findOne({ rideID });
};

const getRidesByDriverCompositeId = async (driverCompositeId) => {
  return await CompositeId.find({ driverCompositeId });
};

const getRidesByPassengerId = async (passengerId) => {
  return await CompositeId.find({ passengerId });
};

module.exports = {
  generateCompositeIdsForRides,
  getCompositeByRideID,
  getRidesByDriverCompositeId,
  getRidesByPassengerId,
};
