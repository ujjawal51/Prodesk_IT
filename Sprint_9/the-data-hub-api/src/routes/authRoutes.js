const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Authentication Endpoints
 * POST /login - Intercept credentials and return mock JWT
 */
router.post('/login', authController.login);

module.exports = router;
