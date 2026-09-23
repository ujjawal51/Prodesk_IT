const mongoose = require('mongoose');

/**
 * Sprint 10 Track B - Relational Schema: User Model
 * Represents the author/user entity referenced by posts.
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    role: {
      type: String,
      enum: ['author', 'editor', 'admin', 'user'],
      default: 'author'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    bio: {
      type: String,
      default: 'Tech contributor at The Data Hub',
      trim: true,
      maxlength: [300, 'Bio cannot exceed 300 characters']
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);

// Virtual for author's display badge
UserSchema.virtual('displayName').get(function () {
  return `${this.name} (${this.role})`;
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
