const Package = require('../models/Packages');

async function createPackage({ name, duration, discount, fee }) {
  const newPackage = new Package({ name, duration, discount, fee });
  return await newPackage.save();
}

async function getAllPackages() {
  return await Package.find();
}

async function getPackageById(id) {
  return await Package.findById(id);
}

async function updatePackage(id, { name, duration, discount, fee }) {
  const pkg = await Package.findById(id);
  if (!pkg) return null;

  pkg.name = name;
  pkg.duration = duration;
  pkg.discount = discount;
  pkg.fee = fee;
  pkg.updatedAt = Date.now();

  return await pkg.save();
}

async function deletePackage(id) {
  return await Package.findByIdAndDelete(id);
}

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
