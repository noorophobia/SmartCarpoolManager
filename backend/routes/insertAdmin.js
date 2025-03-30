const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');  // Path to your Admin model

const insertAdmin = async () => {
  try {
    const email = "smartcarpool1@gmail.com";
    const password = "1234";  // Plain password for now

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists!');
      return; // Skip insertion if admin already exists
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin document
    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    await admin.save();
    console.log('Admin credentials inserted successfully!');
  } catch (err) {
    console.error('Error inserting admin:', err);
  }
};

module.exports = { insertAdmin };
