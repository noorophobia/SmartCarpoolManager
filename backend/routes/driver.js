const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const driverController = require("../controllers/driverController");

router.get("/drivers", verifyToken, driverController.getAllDrivers);
router.get("/drivers/approved", verifyToken, driverController.getApprovedDrivers);
router.get("/drivers/not-approved", verifyToken, driverController.getNotApprovedDriversWithCompositeIds);
router.get("/drivers/:id", verifyToken, driverController.getDriverById);
router.get("/drivers/composite/:compositeId", verifyToken, driverController.getDriverByCompositeId);
router.post("/drivers", verifyToken, driverController.addDriver);
router.put("/drivers/:id", verifyToken, driverController.updateDriver);
router.delete("/drivers/:id", verifyToken, driverController.deleteDriver);
router.put("/drivers/application/:id", verifyToken, driverController.updateDriverApproval);
router.get("/drivers/api/count", verifyToken, driverController.countDrivers);
router.get("/drivers/api/pending-count", verifyToken, driverController.countPendingApplications);
router.get("/drivers/api/approved-count", verifyToken, driverController.countApprovedDrivers);
router.put("/drivers/block/:id", verifyToken, driverController.blockUnblockDriver);

module.exports = router;
