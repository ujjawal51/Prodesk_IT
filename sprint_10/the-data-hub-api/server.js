require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const requestLogger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');
const postRoutes = require('./src/routes/postRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const seedDatabase = require('./src/utils/seedDb');
const Post = require('./src/models/Post');
const User = require('./src/models/User');

const app = express();
const PORT = parseInt(process.env.PORT || 5000, 10);

// 1. Global Middleware
app.use(cors());
app.use(express.json()); // Strict requirement: parse incoming JSON bodies

// 2. Custom Request Logger Middleware
app.use(requestLogger);

// 3. API Root Status Endpoint
app.get('/', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  let postsCount = 0;
  let usersCount = 0;
  try {
    if (dbState === 1) {
      postsCount = await Post.countDocuments();
      usersCount = await User.countDocuments();
    }
  } catch (e) {
    // Ignore error for status page
  }

  res.status(200).json({
    status: "online",
    system: "The Data Hub RESTful API Server",
    sprint: "Sprint 10 - Fullstack Track B (Persistent Cloud Storage & Relational ODM)",
    database: {
      status: states[dbState] || 'unknown',
      host: mongoose.connection.host || 'none',
      name: mongoose.connection.name || 'the_data_hub_sprint10',
      entities: {
        users: usersCount,
        posts: postsCount
      }
    },
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "POST /login",
      users: {
        listAll: "GET /users",
        getById: "GET /users/:id",
        create: "POST /users"
      },
      posts: {
        listAll: "GET /posts (supports .populate('authorId'))",
        topRecentAggregation: "GET /posts/top-recent (MongoDB Aggregation Pipeline: Top 3 Most Recent)",
        getById: "GET /posts/:id (with hydrated author)",
        create: "POST /posts (Post.create())",
        update: "PUT /posts/:id (Post.findByIdAndUpdate())",
        delete: "DELETE /posts/:id (Post.findByIdAndDelete())"
      },
      seeder: "POST /seed (resets & seeds rich relational data)"
    }
  });
});

// 4. Seeder Endpoint for Postman / QA evaluation
app.post('/seed', async (req, res, next) => {
  try {
    const result = await seedDatabase();
    return res.status(200).json({
      success: true,
      message: "Database successfully seeded with Authors and Posts!",
      usersCount: result.users.length,
      postsCount: result.posts.length
    });
  } catch (error) {
    next(error);
  }
});

// 5. Mount Domain Routes
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/', authRoutes);

// 6. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found on this server.`
  });
});

// 7. Centralized Error Handler Middleware
app.use(errorHandler);

// 8. Server Boot & Database Connection
let server;

const startServer = async () => {
  try {
    // Connect to MongoDB (Atlas or configured URI)
    await connectDB();

    // Auto-seed if database is empty
    try {
      const existingPostsCount = await Post.countDocuments();
      if (existingPostsCount === 0) {
        console.log('🌱 Database is empty. Auto-seeding initial users and posts...');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('⚠️ Seeding check skipped:', seedErr.message);
    }

    server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 The Data Hub API Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`📚 Health Check: http://localhost:${PORT}/`);
      console.log(`📊 Aggregation Pipeline: http://localhost:${PORT}/posts/top-recent`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
  }
};

// Start when executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
