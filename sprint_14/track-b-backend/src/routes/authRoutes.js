const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// ─── Phase 2: Endpoint Engineering ────────────────────────────────────────────
// Public routes — no token required
router.post('/register', registerUser);  // POST /api/auth/register
router.post('/login', loginUser);        // POST /api/auth/login

// ─── Phase 3: Protected Routes ────────────────────────────────────────────────
// Private routes — require valid JWT via protect middleware
router.get('/me', protect, getMe);         // GET  /api/auth/me
router.post('/logout', protect, logoutUser); // POST /api/auth/logout

module.exports = router;
