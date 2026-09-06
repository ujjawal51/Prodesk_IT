const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload');

// GET /api/posts - Hydration & list all posts
router.get('/', postController.getPosts);

// GET /api/posts/:id - Retrieve single post
router.get('/:id', postController.getPostById);

// POST /api/posts - Data injection with Multer multipart thumbnail upload
router.post('/', upload.single('thumbnail'), postController.createPost);

// PUT /api/posts/:id - Update post with optional new thumbnail
router.put('/:id', upload.single('thumbnail'), postController.updatePost);

// DELETE /api/posts/:id - Data deletion
router.delete('/:id', postController.deletePost);

// PATCH /api/posts/:id/like - Like counter increment
router.patch('/:id/like', postController.likePost);

module.exports = router;
