const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /login - Issue JWT Bearer token
router.post('/login', authController.login);

module.exports = router;
