const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.firstName
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// Verify JWT middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = decoded; // Attach user payload to request
    next();
  });
};

module.exports = { generateToken, verifyToken };