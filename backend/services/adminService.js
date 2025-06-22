const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Admin = require("../models/Admin");

const generateSecurePassword = () => {
  return Math.random().toString(36).slice(-8);
};

const login = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { message: "Login successful", token };
};

const updatePassword = async (email, newPassword) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("Admin not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  admin.password = hashedPassword;
  await admin.save();

  return { message: "Password updated successfully" };
};

const resetPassword = async (email) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("Admin not found");
  }

  const newPassword = generateSecurePassword();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  admin.password = hashedPassword;
  await admin.save();

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

  return { message: "Password reset successfully and sent to email." };
};

module.exports = {
  login,
  updatePassword,
  resetPassword,
};
