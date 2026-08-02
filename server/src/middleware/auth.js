const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'carequeue_secure_enterprise_jwt_secret_key_2026';

// Verify JWT Token Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Authentication token required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Require Specific Roles Middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions for this action.' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET
};
