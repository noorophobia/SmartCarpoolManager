const bcrypt = require('bcrypt');
const Driver = require('../models/Driver');
const Counter = require('../models/Counter');

const saltRounds = 10;

const generateCompositeId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "driverCounter" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `DR-${String(counter.value).padStart(3, '0')}`;
};

const getAllDrivers = async () => {
  return await Driver.find();
};

const getApprovedDrivers = async () => {
  // Ensure missing isApproved is set to false
  await Driver.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: false } });
  return await Driver.find({ isApproved: true });
};

const getNotApprovedDriversWithCompositeIds = async () => {
  const drivers = await Driver.find({ isApproved: false });
  const missingCompositeIdDrivers = drivers.filter(driver => !driver.compositeId);

  if (missingCompositeIdDrivers.length > 0) {
    const bulkUpdates = await Promise.all(
      missingCompositeIdDrivers.map(async (driver) => ({
        updateOne: {
          filter: { _id: driver._id },
          update: { $set: { compositeId: await generateCompositeId() } },
        },
      }))
    );

    await Driver.bulkWrite(bulkUpdates);
  }

  return await Driver.find({ isApproved: false });
};

const getDriverById = async (id) => {
  return await Driver.findById(id);
};

const getDriverByCompositeId = async (compositeId) => {
  return await Driver.findOne({ compositeId });
};

const addDriver = async (driverData) => {
  if (!driverData.driverDOB) {
    throw new Error('Date of Birth is required.');
  }
  if (!driverData.driverPassword) {
    throw new Error('Password is required.');
  }

  const compositeId = await generateCompositeId();
  const hashedPassword = await bcrypt.hash(driverData.driverPassword, saltRounds);

  const newDriver = new Driver({
    ...driverData,
    driverPassword: hashedPassword,
    compositeId,
    isApproved: false,
    createdAt: new Date(),
  });

  return await newDriver.save();
};

const updateDriver = async (id, updateFields) => {
  return await Driver.findByIdAndUpdate(id, updateFields, { new: true });
};

const deleteDriver = async (id) => {
  return await Driver.findByIdAndDelete(id);
};

const updateDriverApproval = async (id, isApproved) => {
  if (typeof isApproved !== 'boolean') throw new Error('Invalid approval status');
  return await Driver.findByIdAndUpdate(id, { isApproved }, { new: true });
};

const countDrivers = async () => {
  return await Driver.countDocuments();
};

const countPendingApplications = async () => {
  return await Driver.countDocuments({ isApproved: false });
};

const countApprovedDrivers = async () => {
  return await Driver.countDocuments({ isApproved: true });
};

const blockUnblockDriver = async (id, isBlocked) => {
  if (typeof isBlocked !== 'boolean') throw new Error('isBlocked must be a boolean.');
  return await Driver.findByIdAndUpdate(id, { isBlocked }, { new: true });
};

module.exports = {
  getAllDrivers,
  getApprovedDrivers,
  getNotApprovedDriversWithCompositeIds,
  getDriverById,
  getDriverByCompositeId,
  addDriver,
  updateDriver,
  deleteDriver,
  updateDriverApproval,
  countDrivers,
  countPendingApplications,
  countApprovedDrivers,
  blockUnblockDriver,
};
