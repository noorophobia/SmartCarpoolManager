const express = require("express");
const router = express.Router();
const adminService = require("../services/adminService");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await adminService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }
  try {
    const result = await adminService.updatePassword(email, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    const result = await adminService.resetPassword(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
