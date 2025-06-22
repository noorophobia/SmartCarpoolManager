const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function insertAdmin(email = "smartcarpool1@gmail.com", password = "1234") {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
     // console.log('Admin already exists!');
      return false;  // Or return something meaningful if you want
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin document
    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();
    console.log('Admin credentials inserted successfully!');
    return true;
  } catch (err) {
    console.error('Error inserting admin:', err);
    throw err;  // Let caller handle if needed
  }
}

module.exports = {
  insertAdmin,
};
