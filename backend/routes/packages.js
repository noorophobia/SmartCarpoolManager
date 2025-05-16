const express = require("express");
const verifyToken = require('../middleware/auth');
const {
  createNewPackage,
  getPackages,
  getPackage,
  updateExistingPackage,
  deleteExistingPackage,
} = require('../controllers/packageController');

const router = express.Router();

router.post("/packages", verifyToken, createNewPackage);
router.get("/packages", verifyToken, getPackages);
router.get("/packages/:id", verifyToken, getPackage);
router.put("/packages/:id", verifyToken, updateExistingPackage);
router.delete("/packages/:id", verifyToken, deleteExistingPackage);

module.exports = router;
