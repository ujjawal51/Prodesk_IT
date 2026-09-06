const Post = require('../models/Post');
const { isConnected, getMemoryStore, setMemoryStore } = require('../config/db');
const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * GET /api/posts
 * Fetch all posts with optional search and category filter.
 */
async function getPosts(req, res, next) {
  try {
    const { search, category } = req.query;

    if (isConnected()) {
      const query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ];
      }
      let posts = await Post.find(query).sort({ createdAt: -1 });

      // If database is currently completely empty, seed initial high quality articles
      if (posts.length === 0 && !search && (!category || category === 'All')) {
        const initialSeed = [
          {
            title: 'Fullstack System Integration in MERN',
            content: 'Connecting a Vite React Single Page Application with an Express and MongoDB REST API architecture with CORS authorization.',
            author: 'Resident Engineer',
            category: 'Fullstack',
            thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/sample_fullstack.jpg',
            likes: 18,
            tags: ['MERN', 'CORS', 'Express', 'React']
          },
          {
            title: 'Architecting Multipart Form Data with Multer & Cloudinary',
            content: 'Streaming multipart file buffers directly to Cloud CDN without polluting the database with heavy Base64 strings or binary blobs.',
            author: 'Staff Architect',
            category: 'Architecture',
            thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/sample_cloud.jpg',
            likes: 24,
            tags: ['Multer', 'Cloudinary', 'CDN', 'MongoDB']
          },
          {
            title: 'Quality Assurance with Jest and React Testing Library',
            content: 'Simulating user interactions, auditing mutated DOM states, and mocking the network layer for resilient offline verification.',
            author: 'QA Specialist',
            category: 'Testing',
            thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/sample_testing.jpg',
            likes: 12,
            tags: ['Jest', 'RTL', 'Testing', 'Next.js']
          }
        ];
        await Post.insertMany(initialSeed);
        posts = await Post.find(query).sort({ createdAt: -1 });
      }

      return res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
      });
    }

    // In-memory fallback
    let posts = [...getMemoryStore()];
    if (category && category !== 'All') {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const term = search.toLowerCase();
      posts = posts.filter(
        p =>
          p.title.toLowerCase().includes(term) ||
          p.content.toLowerCase().includes(term) ||
          p.author.toLowerCase().includes(term)
      );
    }

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/posts/:id
 */
async function getPostById(req, res, next) {
  try {
    const { id } = req.params;

    if (isConnected()) {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      return res.status(200).json({ success: true, data: post });
    }

    const post = getMemoryStore().find(p => p._id === id || p.id === id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/posts
 * Multipart form data injection into MongoDB.
 * Uploads thumbnail buffer to Cloudinary CDN and stores returned URL string.
 */
async function createPost(req, res, next) {
  try {
    const { title, content, author, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and Content are required fields'
      });
    }

    let thumbnailUrl = req.body.thumbnailUrl || '';

    // Handle Multipart Image Upload
    if (req.file) {
      console.log(`[POST /api/posts] Processing multipart file buffer (${req.file.size} bytes)...`);
      thumbnailUrl = await uploadToCloudinary(req.file.buffer, 'sprint_11');
      console.log(`[POST /api/posts] Cloudinary returned CDN URL: ${thumbnailUrl}`);
    } else if (!thumbnailUrl) {
      // Default placeholder thumbnail
      thumbnailUrl = 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/default_thumb.jpg';
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const newPostData = {
      title: title.trim(),
      content: content.trim(),
      author: author ? author.trim() : 'Fullstack Resident',
      category: category || 'Fullstack',
      thumbnailUrl, // Strict Constraint: Only CDN URL string stored
      likes: 0,
      tags: parsedTags
    };

    if (isConnected()) {
      const newPost = await Post.create(newPostData);
      return res.status(201).json({
        success: true,
        message: 'Post successfully created and injected into MongoDB',
        data: newPost
      });
    }

    // In-memory fallback
    const mockCreated = {
      _id: '675' + Date.now().toString(16).padEnd(21, '0').slice(0, 21),
      ...newPostData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const currentStore = getMemoryStore();
    setMemoryStore([mockCreated, ...currentStore]);

    return res.status(201).json({
      success: true,
      message: 'Post successfully created and persisted',
      data: mockCreated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/posts/:id
 * Update existing post.
 */
async function updatePost(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, author, category, tags } = req.body;

    let thumbnailUrl = req.body.thumbnailUrl;
    if (req.file) {
      thumbnailUrl = await uploadToCloudinary(req.file.buffer, 'sprint_11');
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (content !== undefined) updateFields.content = content.trim();
    if (author !== undefined) updateFields.author = author.trim();
    if (category !== undefined) updateFields.category = category;
    if (thumbnailUrl !== undefined) updateFields.thumbnailUrl = thumbnailUrl;
    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
    }

    if (isConnected()) {
      const updatedPost = await Post.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true
      });
      if (!updatedPost) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      return res.status(200).json({ success: true, data: updatedPost });
    }

    // In-memory fallback
    const store = getMemoryStore();
    const index = store.findIndex(p => p._id === id || p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const updated = {
      ...store[index],
      ...updateFields,
      updatedAt: new Date().toISOString()
    };
    store[index] = updated;
    setMemoryStore([...store]);

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/posts/:id
 * Remove document from MongoDB.
 */
async function deletePost(req, res, next) {
  try {
    const { id } = req.params;

    if (isConnected()) {
      const deleted = await Post.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Post successfully removed from MongoDB',
        deletedId: id
      });
    }

    // In-memory fallback
    const store = getMemoryStore();
    const exists = store.some(p => p._id === id || p.id === id);
    if (!exists) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const filtered = store.filter(p => p._id !== id && p.id !== id);
    setMemoryStore(filtered);

    return res.status(200).json({
      success: true,
      message: 'Post successfully removed from database',
      deletedId: id
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/posts/:id/like
 * Increment likes counter.
 */
async function likePost(req, res, next) {
  try {
    const { id } = req.params;

    if (isConnected()) {
      const post = await Post.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      return res.status(200).json({ success: true, likes: post.likes, data: post });
    }

    const store = getMemoryStore();
    const target = store.find(p => p._id === id || p.id === id);
    if (!target) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    target.likes = (target.likes || 0) + 1;
    setMemoryStore([...store]);

    return res.status(200).json({ success: true, likes: target.likes, data: target });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
};
