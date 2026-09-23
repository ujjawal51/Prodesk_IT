/**
 * Sprint 10 Track B - Authentication Middleware
 * Validates Bearer token in Authorization header.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please provide 'Authorization: Bearer <token>' header."
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: "Malformed authorization header. Expected format: 'Bearer <token>'"
    });
  }

  const token = parts[1];

  try {
    // Decode mock or standard JWT
    const tokenParts = token.split('.');
    if (tokenParts.length >= 2) {
      const payloadDecoded = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
      
      // Check expiration if present
      if (payloadDecoded.exp && Date.now() >= payloadDecoded.exp * 1000) {
        return res.status(403).json({
          success: false,
          error: "Token expired. Please re-authenticate."
        });
      }

      req.user = payloadDecoded;
      return next();
    } else {
      return res.status(403).json({
        success: false,
        error: "Invalid token signature format."
      });
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: "Invalid token or signature verification failed."
    });
  }
}

module.exports = authenticateToken;
