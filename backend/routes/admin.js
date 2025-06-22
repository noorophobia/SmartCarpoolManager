const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.put("/update-password", adminController.updatePassword);
router.post("/reset-password", adminController.resetPassword);

module.exports = router;
