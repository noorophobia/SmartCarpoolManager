const driverService = require("../services/driverService");

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.status(200).json(drivers);
  } catch {
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

const getApprovedDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getApprovedDrivers();
    res.status(200).json(drivers);
  } catch {
    res.status(500).json({ message: "Failed to fetch approved drivers" });
  }
};

const getNotApprovedDriversWithCompositeIds = async (req, res) => {
  try {
    const drivers = await driverService.getNotApprovedDriversWithCompositeIds();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch not approved drivers", error: error.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch driver details", error: error.message });
  }
};

const getDriverByCompositeId = async (req, res) => {
  try {
    const driver = await driverService.getDriverByCompositeId(req.params.compositeId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch driver details", error: error.message });
  }
};

const addDriver = async (req, res) => {
  try {
    const savedDriver = await driverService.addDriver(req.body);
    res.status(201).json({
      id: savedDriver._id,
      compositeId: savedDriver.compositeId,
      ...savedDriver.toObject(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Error adding driver" });
  }
};

const updateDriver = async (req, res) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Failed to update driver", error: error.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    await driverService.deleteDriver(req.params.id);
    res.status(200).json({ message: "Driver deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete driver" });
  }
};

const updateDriverApproval = async (req, res) => {
  try {
    const driver = await driverService.updateDriverApproval(req.params.id, req.body.isApproved);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json({ message: "Driver updated successfully", driver });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update driver" });
  }
};

const countDrivers = async (req, res) => {
  try {
    const count = await driverService.countDrivers();
    res.status(200).json({ totalDrivers: count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get driver count", error: error.message });
  }
};

const countPendingApplications = async (req, res) => {
  try {
    const count = await driverService.countPendingApplications();
    res.status(200).json({ pendingApplications: count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get pending applications count", error: error.message });
  }
};

const countApprovedDrivers = async (req, res) => {
  try {
    const count = await driverService.countApprovedDrivers();
    res.status(200).json({ approvedApplications: count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get approved drivers count", error: error.message });
  }
};

const blockUnblockDriver = async (req, res) => {
  try {
    const updatedDriver = await driverService.blockUnblockDriver(req.params.id, req.body.isBlocked);
    if (!updatedDriver) return res.status(404).json({ message: "Driver not found." });

    res.status(200).json({
      message: `Driver has been ${req.body.isBlocked ? "blocked" : "unblocked"}.`,
      driver: updatedDriver,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
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
