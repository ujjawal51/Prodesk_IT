const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

// ─── Phase 3: Express Middleware ──────────────────────────────────────────────
// Intercepts incoming requests, parses Authorization header,
// and cryptographically verifies the JWT signature
const protect = async (req, res, next) => {
  let token;

  // ── Step 1: Extract token from Authorization header ──────────────────────
  // Expected format: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // ── Step 2: Check if token exists ────────────────────────────────────────
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
      redirectTo: '/login', // Client should redirect to /login
    });
  }

  try {
    // ── Step 3: Cryptographically verify the JWT ──────────────────────────
    const decoded = verifyToken(token);

    // ── Step 4: Check if user still exists in database ────────────────────
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
        redirectTo: '/login',
      });
    }

    // ── Step 5: Check if account is active ───────────────────────────────
    if (!currentUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated.',
        redirectTo: '/login',
      });
    }

    // ── Step 6: Attach user to request object ─────────────────────────────
    // Now all subsequent route handlers have access to req.user
    req.user = {
      id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
    };

    next();
  } catch (error) {
    // JWT expired or invalid signature
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
        redirectTo: '/login',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
        redirectTo: '/login',
      });
    }

    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

// ─── Role-Based Access Control (RBAC) Middleware ──────────────────────────────
// Use AFTER protect middleware to restrict routes by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
