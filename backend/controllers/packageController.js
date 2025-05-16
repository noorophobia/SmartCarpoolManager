const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require('../services/packageService');

const createNewPackage = async (req, res) => {
  const { name, duration, discount, fee } = req.body;
  if (!name || !duration || !discount || !fee) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const savedPackage = await createPackage({ name, duration, discount, fee });
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPackages = async (req, res) => {
  try {
    const packages = await getAllPackages();
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPackage = async (req, res) => {
  const { id } = req.params;
  try {
    const pkg = await getPackageById(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateExistingPackage = async (req, res) => {
  const { id } = req.params;
  const { name, duration, discount, fee } = req.body;

  if (!name || !duration || !discount || !fee) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedPackage = await updatePackage(id, { name, duration, discount, fee });
    if (!updatedPackage) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExistingPackage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPackage = await deletePackage(id);
    if (!deletedPackage) return res.status(404).json({ message: "Package not found" });
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNewPackage,
  getPackages,
  getPackage,
  updateExistingPackage,
  deleteExistingPackage,
};
