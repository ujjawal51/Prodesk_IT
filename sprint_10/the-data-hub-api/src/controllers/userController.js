const User = require('../models/User');
const Post = require('../models/Post');

/**
 * SPRINT 10 TRACK B - USER CONTROLLER (Relational Entity Management)
 */

// GET /users - Get all authors/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// GET /users/:id - Get user with their authored posts
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User with ID '${id}' not found.`
      });
    }

    // Relational reverse lookup: fetch posts authored by this user
    const posts = await Post.find({ authorId: id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        postsCount: posts.length,
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /users - Create new author/user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, avatar, bio } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'name' and 'email' are required fields."
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `A user with email '${email}' already exists.`
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role || 'author',
      avatar,
      bio
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully in MongoDB.",
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};
