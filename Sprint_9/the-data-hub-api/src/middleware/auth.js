/**
 * Mock JWT Token Verification Middleware
 * Validates 'Authorization: Bearer <token>' header
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access Denied: Missing Authorization Header. Expected format: 'Authorization: Bearer <token>'"
    });
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: Invalid JWT structure format"
      });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    
    // Attach decoded user context to request
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Corrupted or unparseable JWT signature",
      details: err.message
    });
  }
}

module.exports = authenticateToken;
