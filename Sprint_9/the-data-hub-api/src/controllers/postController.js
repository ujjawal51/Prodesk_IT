const initialBlogPosts = require('../config/initialData');

// In-Memory Database Store (as required by Sprint 09: let blogPosts = [])
let blogPosts = JSON.parse(JSON.stringify(initialBlogPosts));

/**
 * GET /posts - Serve all blog posts (supports optional query filtering)
 */
exports.getAllPosts = (req, res) => {
  try {
    const { category, tag, search, author } = req.query;
    let results = [...blogPosts];

    if (category) {
      results = results.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (tag) {
      results = results.filter(
        (p) => p.tags && p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
    }

    if (author) {
      results = results.filter(
        (p) => p.author && p.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.content && p.content.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error fetching posts",
      details: error.message
    });
  }
};

/**
 * GET /posts/:id - Fetch single post by ID
 */
exports.getPostById = (req, res) => {
  try {
    const { id } = req.params;
    const post = blogPosts.find((p) => String(p.id) === String(id));

    if (!post) {
      return res.status(404).json({
        success: false,
        error: `Post with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error fetching post",
      details: error.message
    });
  }
};

/**
 * POST /posts - Create a new post and append to in-memory array
 */
exports.createPost = (req, res) => {
  try {
    const { title, content, author, category, tags } = req.body;

    // Strict validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'title' is required"
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'content' is required"
      });
    }

    if (!author || !author.trim()) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'author' is required"
      });
    }

    // Auto-generate numeric ID or UUID
    const nextId = blogPosts.length > 0 ? String(Math.max(...blogPosts.map((p) => parseInt(p.id) || 0)) + 1) : "1";
    
    // Calculate reading time estimate
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const newPost = {
      id: nextId,
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category ? category.trim() : "General",
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ["general"]),
      readTime,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    blogPosts.push(newPost);

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error creating post",
      details: error.message
    });
  }
};

/**
 * PUT /posts/:id - Update existing post
 */
exports.updatePost = (req, res) => {
  try {
    const { id } = req.params;
    const postIndex = blogPosts.findIndex((p) => String(p.id) === String(id));

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Post with ID '${id}' not found for update`
      });
    }

    const existingPost = blogPosts[postIndex];
    const { title, content, author, category, tags, likes } = req.body;

    const updatedPost = {
      ...existingPost,
      title: title !== undefined ? title.trim() : existingPost.title,
      content: content !== undefined ? content.trim() : existingPost.content,
      author: author !== undefined ? author.trim() : existingPost.author,
      category: category !== undefined ? category.trim() : existingPost.category,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : existingPost.tags,
      likes: likes !== undefined ? Number(likes) : existingPost.likes,
      updatedAt: new Date().toISOString()
    };

    blogPosts[postIndex] = updatedPost;

    return res.status(200).json({
      success: true,
      message: `Post with ID '${id}' updated successfully`,
      data: updatedPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error updating post",
      details: error.message
    });
  }
};

/**
 * DELETE /posts/:id - Remove post from array matching ID
 */
exports.deletePost = (req, res) => {
  try {
    const { id } = req.params;
    const postIndex = blogPosts.findIndex((p) => String(p.id) === String(id));

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Post with ID '${id}' not found for deletion`
      });
    }

    const [deletedPost] = blogPosts.splice(postIndex, 1);

    return res.status(200).json({
      success: true,
      message: `Post with ID '${id}' deleted successfully`,
      deletedItem: deletedPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error deleting post",
      details: error.message
    });
  }
};

/**
 * Helper to reset in-memory DB for tests
 */
exports.resetDatabase = () => {
  blogPosts = JSON.parse(JSON.stringify(initialBlogPosts));
};
