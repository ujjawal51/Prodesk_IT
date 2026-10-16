const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// ─── @route   POST /api/auth/register ─────────────────────────────────────────
// @desc    Register a new user
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // ── Check for existing user ──────────────────────────────────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // ── Create User ──────────────────────────────────────────────────────────
    // Password hashing happens automatically via pre-save hook in User model
    const user = await User.create({ name, email, password });

    // ── Generate JWT ──────────────────────────────────────────────────────────
    const token = generateToken(user._id, user.role);

    // ── Update last login ────────────────────────────────────────────────────
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // ── Send Response ────────────────────────────────────────────────────────
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    // Mongoose duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use',
      });
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// ─── @route   POST /api/auth/login ────────────────────────────────────────────
// @desc    Authenticate user & return JWT
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // ── Find user (explicitly include password for comparison) ───────────────
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      // Use generic error to prevent user enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ── Check if account is active ───────────────────────────────────────────
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Contact support.',
      });
    }

    // ── Compare hashed password ──────────────────────────────────────────────
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ── Generate JWT ──────────────────────────────────────────────────────────
    const token = generateToken(user._id, user.role);

    // ── Update last login timestamp ───────────────────────────────────────────
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // ── Send Response ────────────────────────────────────────────────────────
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// ─── @route   GET /api/auth/me ────────────────────────────────────────────────
// @desc    Get current logged-in user profile
// @access  Private (requires valid JWT)
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware after JWT verification
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
    });
  }
};

// ─── @route   POST /api/auth/logout ───────────────────────────────────────────
// @desc    Logout user (client should delete token from localStorage)
// @access  Private
const logoutUser = async (req, res) => {
  // JWT is stateless — server cannot invalidate it directly
  // The client MUST delete the token from localStorage
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please delete the token on the client side.',
    token: null,
  });
};

module.exports = { registerUser, loginUser, getMe, logoutUser };
