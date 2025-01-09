const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// Admin login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;  // Should now work after express.json() middleware

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, "e1b1b62209daa1df2e6988d76f03c66c79fc2e1307b502f166f3a60ba45a9b1c5161358c8dcdef7a4bd8411498f7e0a40ee3f8b78f247fbfd105cb395e5a6d9a04c6adf1c90ba063eb9599a5cec594e6997f700d7b77e3470b13b2149e186509443c69019e34fb76d2631f71ce87d9d630ad1a98f4a6658ca707e581fe2d80f7fd516054eb6580f3e578ea0f3d8220b520f851ca0a2006566b237495d6aa4296542abdc7b48327b426530f8622d09bb831ed76dfca91a771b4e89fc415a75ea394324c20cd21c8d971cb0cbe3dc6aff0a50341061bcc8cb666605ccca46d24e0c704723d7d3c462499e12930f704b1efa2407289ab5bdb3c7b7d158684a45041d8d7278ed6d4c3a9132dbafa57e7f0de8708e5660e76ba0cacc437b83230316407d5ef342802a0a18fbbab064f4d50f2fe6561c39050bec9f48f753eff506b8764e72c783022f043ecb7fb767cd955e855ee63bcd6bc067bfe7c0f5f3f465e52e35b7bd7f1f0768da00ca8285490f601c845f7dabef237cdf81632ce572a0dc71f62e06f012b029a93cfdfbe21ae6ff004b2fb237ecc489854600742599cdc6efe186967e606f2fb9d7b03f6378d05318cb8411883b53cef44b4c2886b4fc63f4f0a6fc1712c6898198d3e0ccf75439d98503cf2c418330e605b6b861a3083cd5cfdc41a05467ba6e95e2d730fbfed7a50ff64aabd9035da65d74219abc7a682", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});
// Admin update password route
router.put("/update-password", async (req, res) => {
  const { email, newPassword } = req.body; // Extract email and new password from request body

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    const admin = await Admin.findOne({ email }); // Check if admin with the given email exists
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
