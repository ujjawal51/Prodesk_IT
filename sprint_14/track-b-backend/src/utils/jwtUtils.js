const jwt = require('jsonwebtoken');

// ─── Generate JWT Token ────────────────────────────────────────────────────────
// Creates a signed JWT with user payload
// JWT is a cryptographically signed string → acts as session identifier
const generateToken = (userId, role = 'user') => {
  const payload = {
    id: userId,
    role: role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
    issuer: 'sprint14-auth-api',
    audience: 'sprint14-client',
  });

  return token;
};

// ─── Verify JWT Token ──────────────────────────────────────────────────────────
// Decodes and validates the token signature + expiry
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'sprint14-auth-api',
    audience: 'sprint14-client',
  });
};

// ─── Decode Token Without Verification ────────────────────────────────────────
// Use only for debugging (NOT for authentication logic)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = { generateToken, verifyToken, decodeToken };
