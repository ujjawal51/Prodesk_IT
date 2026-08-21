/**
 * Helper to encode standard base64url string
 */
function base64url(source) {
  let encoded = Buffer.from(JSON.stringify(source)).toString('base64');
  return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Generate a standard mock JWT token structure (Header.Payload.Signature)
 */
function generateMockJWT(user) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const payload = {
    sub: user.id || "usr_90210",
    name: user.name || "Engineering Specialist",
    email: user.email,
    role: user.role || "developer",
    track: "Track B: Fullstack Developer",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };

  const encodedHeader = base64url(header);
  const encodedPayload = base64url(payload);
  const mockSignature = Buffer.from(`${encodedHeader}.${encodedPayload}.sprint09_datahub_hmac_secret`).toString('base64').substring(0, 32);

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
}

/**
 * POST /login - Authenticate credentials and issue mock JWT token
 */
exports.login = (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: Identifier (email or username) and password are required."
      });
    }

    // Mock verification (accepts any valid structured login or predefined demo user)
    const user = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: identifier.includes('@') ? identifier : `${identifier}@datahub.io`,
      name: identifier.split('@')[0],
      role: "admin",
      department: "Fullstack Engineering"
    };

    const token = generateMockJWT(user);

    return res.status(200).json({
      success: true,
      message: "Authentication successful. Mock JWT issued.",
      token_type: "Bearer",
      expires_in: 86400,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Authentication service failure",
      details: error.message
    });
  }
};
