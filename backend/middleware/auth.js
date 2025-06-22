 const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  // Extract the token from the 'Authorization' header in the request
  // The header is expected to be in the format: 'Bearer <token>'
  const token = req.header("Authorization")?.split(" ")[1];

  // If no token is provided, return a 403 (Forbidden) response
  if (!token) {
    return res.status(403).json({ error: "Access denied, no token provided" });
  }

  try {
    // Verify the token using the secret key
    // If verification is successful, decode the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    
    );

    // Attach the decoded admin/user data to the request object
    req.admin = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    // If the token is invalid or verification fails, return a 400 response
    return res.status(400).json({ error: "Invalid token" });
  }
};

// Export the middleware so it can be used in other files
module.exports = verifyToken;
