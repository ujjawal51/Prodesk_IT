const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticateToken = require('../middleware/auth');

/**
 * 5 Standard REST Endpoints for Blog Resource (Sprint 09 Track B requirement)
 */

// GET /posts - Serve all posts (with query filters)
router.get('/', postController.getAllPosts);

// GET /posts/:id - Serve single post by ID
router.get('/:id', postController.getPostById);

// POST /posts - Create new post
router.post('/', postController.createPost);

// PUT /posts/:id - Update existing post by ID
router.put('/:id', postController.updatePost);

// DELETE /posts/:id - Remove post matching ID
router.delete('/:id', postController.deletePost);

module.exports = router;
