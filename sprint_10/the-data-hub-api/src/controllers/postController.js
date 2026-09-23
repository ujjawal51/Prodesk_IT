const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

/**
 * SPRINT 10 TRACK B - POST CONTROLLER (Mongoose Live ODM)
 * Deprecates Sprint 09 mock arrays and interfaces directly with MongoDB.
 */

/**
 * 1. GET /posts - Query all posts with hydrated author via .populate()
 * Supports optional search, category, tag, and sort filters.
 */
exports.getAllPosts = async (req, res, next) => {
  try {
    const { category, tag, search, authorId, sort } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (authorId) {
      query.authorId = authorId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort order
    let sortOption = { createdAt: -1 }; // Default newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'likes') sortOption = { likes: -1 };
    if (sort === 'title') sortOption = { title: 1 };

    // SPRINT 10 Phase 2 & Phase 3:
    // Execute Post.find() AND utilize .populate() to hydrate author's payload
    const posts = await Post.find(query)
      .populate('authorId', 'name email role avatar bio')
      .sort(sortOption)
      .lean();

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. GET /posts/:id - Fetch single post by ID with hydrated author via .populate()
 */
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid MongoDB ObjectId: '${id}'`
      });
    }

    const post = await Post.findById(id).populate('authorId', 'name email role avatar bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: `Post with ID '${id}' not found in database.`
      });
    }

    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. POST /posts - Execute Post.create() to inject data into MongoDB
 * Sprint 10 Requirement: Phase 2 CRUD Injection + Phase 3 Relational Reference
 */
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, readTime, likes, authorId } = req.body;

    // Strict validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'title' is required."
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'content' is required."
      });
    }

    let resolvedAuthorId = authorId;

    // If authorId not supplied, fallback to default user in DB or create one
    if (!resolvedAuthorId) {
      let defaultUser = await User.findOne();
      if (!defaultUser) {
        defaultUser = await User.create({
          name: "System Author",
          email: "author@thedatahub.io",
          role: "author",
          bio: "Default system author for newly ingested posts."
        });
      }
      resolvedAuthorId = defaultUser._id;
    } else {
      // Validate that provided authorId exists
      if (!mongoose.Types.ObjectId.isValid(resolvedAuthorId)) {
        return res.status(400).json({
          success: false,
          error: `Validation Error: Invalid authorId format '${resolvedAuthorId}'. Must be a valid ObjectId.`
        });
      }
      const existingUser = await User.findById(resolvedAuthorId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: `Author with User ID '${resolvedAuthorId}' does not exist.`
        });
      }
    }

    // Auto-calculate read time if missing
    const calculatedReadTime = readTime || `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read`;

    // SPRINT 10 Phase 2: Execute Post.create()
    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      authorId: resolvedAuthorId,
      category: category ? category.trim() : 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['general']),
      readTime: calculatedReadTime,
      likes: likes !== undefined ? Number(likes) : 0
    });

    // Hydrate author payload before returning
    const populatedPost = await Post.findById(newPost._id).populate('authorId', 'name email role avatar bio');

    return res.status(201).json({
      success: true,
      message: "Post successfully persisted to MongoDB Atlas via Post.create()",
      data: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. PUT /posts/:id - Update existing post in MongoDB
 */
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid MongoDB ObjectId: '${id}'`
      });
    }

    const { title, content, category, tags, readTime, likes, authorId } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    if (readTime !== undefined) updateData.readTime = readTime;
    if (likes !== undefined) updateData.likes = Number(likes);
    if (authorId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid authorId format."
        });
      }
      updateData.authorId = authorId;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('authorId', 'name email role avatar bio');

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        error: `Post with ID '${id}' not found for update.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Post '${id}' updated successfully in MongoDB.`,
      data: updatedPost
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. DELETE /posts/:id - Execute Post.findByIdAndDelete()
 * Sprint 10 Requirement: Phase 2 CRUD Deletion
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid MongoDB ObjectId: '${id}'`
      });
    }

    // SPRINT 10 Phase 2: Execute Post.findByIdAndDelete()
    const deletedPost = await Post.findByIdAndDelete(id).populate('authorId', 'name email role');

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        error: `Post with ID '${id}' not found for deletion.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Post with ID '${id}' deleted successfully via Post.findByIdAndDelete()`,
      deletedItem: deletedPost
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. GET /posts/top-recent (Sprint 10 Phase 3: Aggregation)
 * Architect a custom route that queries and sorts the database to return the "Top 3 Most Recent Posts."
 */
exports.getTopRecentPosts = async (req, res, next) => {
  try {
    // SPRINT 10 Phase 3: MongoDB Aggregation Pipeline
    const topPosts = await Post.aggregate([
      // Stage 1: Sort by creation date descending
      { $sort: { createdAt: -1 } },
      // Stage 2: Limit strictly to top 3 documents
      { $limit: 3 },
      // Stage 3: Relational Lookup to hydrate author payload from users collection
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorDetails'
        }
      },
      // Stage 4: Unwind authorDetails array into an object
      {
        $unwind: {
          path: '$authorDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      // Stage 5: Clean Projection
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          category: 1,
          tags: 1,
          readTime: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            _id: '$authorDetails._id',
            name: '$authorDetails.name',
            email: '$authorDetails.email',
            role: '$authorDetails.role',
            avatar: '$authorDetails.avatar'
          }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      pipeline: "MongoDB Aggregation Pipeline ($sort -> $limit: 3 -> $lookup -> $unwind -> $project)",
      count: topPosts.length,
      data: topPosts
    });
  } catch (error) {
    next(error);
  }
};
