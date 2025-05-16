const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();

const {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerCount,
} = require("../controllers/passengerController");

router.get("/passengers", verifyToken, getAllPassengers);
router.get("/passengers/:id", verifyToken, getPassengerById);
router.post("/passengers", verifyToken, createPassenger);
router.put("/passengers/:id", verifyToken, updatePassenger);
router.delete("/passengers/:id", verifyToken, deletePassenger);
router.get("/passengers/api/count", verifyToken, getPassengerCount);

module.exports = router;
