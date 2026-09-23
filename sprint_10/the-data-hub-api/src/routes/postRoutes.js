const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

/**
 * SPRINT 10 TRACK B - POST ROUTES
 */

// SPRINT 10 Phase 3: Aggregation Route (Declared before /:id to prevent route clash)
// Architect a custom route that queries and sorts the database to return the "Top 3 Most Recent Posts."
router.get('/top-recent', postController.getTopRecentPosts);
router.get('/aggregation/top-recent', postController.getTopRecentPosts);

// SPRINT 10 Phase 2: Live Database CRUD Logic
// GET /posts - Execute Post.find() to query payloads with .populate('authorId')
router.get('/', postController.getAllPosts);

// GET /posts/:id - Execute Post.findById() with .populate('authorId')
router.get('/:id', postController.getPostById);

// POST /posts - Execute Post.create() to inject data into MongoDB
router.post('/', postController.createPost);

// PUT /posts/:id - Execute Post.findByIdAndUpdate()
router.put('/:id', postController.updatePost);

// DELETE /posts/:id - Execute Post.findByIdAndDelete()
router.delete('/:id', postController.deletePost);

module.exports = router;
