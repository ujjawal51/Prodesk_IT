const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users - Fetch all users
router.get('/', userController.getAllUsers);

// GET /users/:id - Fetch user with authored posts
router.get('/:id', userController.getUserById);

// POST /users - Create new author
router.post('/', userController.createUser);

module.exports = router;
