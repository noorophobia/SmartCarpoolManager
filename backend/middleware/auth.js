const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key"); // Verify the token with your secret key
    req.admin = decoded; // Attach the decoded admin data to the request
    next(); // Allow request to proceed
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
