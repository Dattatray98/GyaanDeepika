const jwt = require('jsonwebtoken');

// 1. Token Generation (for login/signup)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id, // Only include minimal necessary data
      role: user.role // Optional: Add role for authorization
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      algorithm: 'HS256' // Explicitly specify algorithm
    }
  );
};

// 2. Token Verification (middleware)
const verifyToken = (req, res, next) => {
  // Check both cookies and Authorization header
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  // Verify token synchronously (avoid callback hell)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    // Handle specific JWT errors
    let message = 'Invalid token';
    if (err.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Token malformed';
    }
    return res.status(403).json({ success: false, message });
  }
};

module.exports = { generateToken, verifyToken };