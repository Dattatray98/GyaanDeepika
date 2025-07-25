const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }
    next();
  };
};

module.exports = authorizeRole;
