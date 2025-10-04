// middlewares/authenticateToken.js
const jwt = require("jsonwebtoken");

// (dotenv should already be loaded once in app.js/server.js)

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Allow 'Bearer <token>' or just token
    const token = authHeader && authHeader.startsWith('Bearer ')? authHeader.split(' ')[1] : authHeader;
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded info to request
    req.user = decoded;

    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

module.exports = authenticateToken;
