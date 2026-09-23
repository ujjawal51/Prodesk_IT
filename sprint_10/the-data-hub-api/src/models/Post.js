const mongoose = require('mongoose');

/**
 * Sprint 10 Track B - Schema Design: Post Model
 * Defines strict types, validations, and relational authorId referencing User.
 */
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Post content is required']
    },
    // Sprint 10 Phase 3: Relational Reference to User Schema
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'authorId referencing a valid User is required']
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    tags: {
      type: [String],
      default: ['technology']
    },
    readTime: {
      type: String,
      default: '3 min read'
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes count cannot be negative']
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// Indexes for high-performance querying and aggregation
PostSchema.index({ createdAt: -1 });
PostSchema.index({ category: 1 });
PostSchema.index({ authorId: 1 });

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
