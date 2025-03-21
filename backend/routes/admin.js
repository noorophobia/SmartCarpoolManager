const express = require("express");
const bcrypt = require("bcrypt"); // to hash and compare passwords
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();
const router = express.Router();

// Admin login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET);


    const token = jwt.sign({ id: admin._id, email: admin.email }, 
      process.env.JWT_SECRET,
      {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Admin update password route
router.put("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Admin password reset route
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Admin not found." });

    // Generate new password
    const newPassword = generateSecurePassword();

    // Hash it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    admin.password = hashedPassword;
    await admin.save();

    // Send email
    await axios.post("http://localhost:5000/send-notification", {
      recipientType: "specificEmail",
      email,
      subject: "Smart Carpool Admin Password Reset",
      message: `
        <h2>Hello Admin,</h2>
        <p>Your password has been successfully reset.</p>
        <p><strong>New Password:</strong> <code>${newPassword}</code></p>
        <p>Please log in and change this password as soon as possible.</p>
        <hr/>
        <p>Smart Carpool Team 🚗</p>
      `,
    });

    res.status(200).json({ message: "Password reset successfully and sent to email." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Function to generate a secure password
function generateSecurePassword() {
  return Math.random().toString(36).slice(-8); // Generates an 8-character alphanumeric password
}

module.exports = router;
