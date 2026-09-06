const mongoose = require('mongoose');

/**
 * Mongoose Schema for Posts
 * Strict Architectural Constraint:
 * Do not save Base64 strings or binary files directly into MongoDB.
 * Store the returned Cloudinary URL string in your database schema.
 */
const postSchema = new mongoose.Schema(
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
    author: {
      type: String,
      default: 'Fullstack Resident',
      trim: true
    },
    category: {
      type: String,
      default: 'Fullstack',
      enum: ['Fullstack', 'Frontend', 'Backend', 'Architecture', 'Testing', 'General']
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: ''
      // Strict constraint: Validated Cloudinary CDN asset URL string
    },
    likes: {
      type: Number,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Custom validation rule: Reject any Base64 strings accidentally passed as thumbnailUrl
postSchema.path('thumbnailUrl').validate(function (value) {
  if (!value) return true;
  // If string starts with data:image or base64 pattern, reject it
  if (value.startsWith('data:') || value.includes(';base64,')) {
    return false;
  }
  return true;
}, 'Strict Constraint Violation: Direct Base64 or binary data cannot be stored in MongoDB. Use Cloudinary CDN URL string.');

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

module.exports = Post;
