require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, isConnected } = require('./src/config/db');
const postRoutes = require('./src/routes/postRoutes');

const app = express();
let PORT = parseInt(process.env.PORT || 5000, 10);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// 1. CORS Configuration (Phase 1 Resolution)
// Authorizes the React/Vite client origin and enables credentials and required HTTP methods
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching client
    if (!origin || origin === CLIENT_ORIGIN || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Origin ${origin} not authorized by server policy.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// 2. Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// 4. API Root Status Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Sprint 11 Fullstack RESTful API Server',
    track: 'Track B: Fullstack Developers',
    database: isConnected() ? 'MongoDB (Connected)' : 'Resilient In-Memory Engine',
    corsOrigin: CLIENT_ORIGIN,
    endpoints: {
      getAllPosts: 'GET /api/posts',
      getPostById: 'GET /api/posts/:id',
      createPost: 'POST /api/posts (multipart/form-data: title, content, author, category, thumbnail)',
      updatePost: 'PUT /api/posts/:id (multipart/form-data)',
      deletePost: 'DELETE /api/posts/:id',
      likePost: 'PATCH /api/posts/:id/like'
    }
  });
});

// 5. Mount REST API Routes
app.use('/api/posts', postRoutes);

// 6. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found on this server.`
  });
});

// 7. Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Application Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// 8. Server Initialization & Dynamic Port Fallback
async function start() {
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 Sprint 11 Track B API Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌐 Authorized CORS Client: ${CLIENT_ORIGIN}`);
    console.log(`📝 Posts Endpoint: http://localhost:${PORT}/api/posts`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} already in use. Retrying on port ${PORT + 1}...`);
      PORT += 1;
      server.listen(PORT);
    } else {
      console.error('Server error:', err);
    }
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = app;
