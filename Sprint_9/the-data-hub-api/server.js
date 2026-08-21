require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestLogger = require('./src/middleware/logger');
const postRoutes = require('./src/routes/postRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
let PORT = parseInt(process.env.PORT || 5000, 10);

// 1. Global Middleware
app.use(cors());
app.use(express.json()); // Strict requirement: parse incoming JSON bodies

// 2. Custom Request Logger Middleware (Logs [METHOD] /path - HH:MM:SS AM/PM)
app.use(requestLogger);

// 3. API Root Status Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: "online",
    system: "The Data Hub RESTful API Server",
    sprint: "Sprint 09 - Fullstack Track B",
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "POST /login",
      posts: {
        listAll: "GET /posts",
        getById: "GET /posts/:id",
        create: "POST /posts",
        update: "PUT /posts/:id",
        delete: "DELETE /posts/:id"
      }
    }
  });
});

// 4. Mount Domain Routes
app.use('/posts', postRoutes);
app.use('/', authRoutes); // Exposes POST /login

// 5. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found on this server.`
  });
});

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Application Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 7. Port Binding with EADDRINUSE Fallback Handling
function startServer(portToListen) {
  if (process.env.NODE_ENV === 'test') return null;

  const server = app.listen(portToListen, () => {
    PORT = portToListen;
    console.log(`====================================================`);
    console.log(`🚀 The Data Hub RESTful API Server is running!`);
    console.log(`📡 Port: http://localhost:${PORT}`);
    console.log(`📝 Blog Resource: http://localhost:${PORT}/posts`);
    console.log(`🔐 Auth Endpoint: http://localhost:${PORT}/login`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToListen} is already in use (another server instance is active).`);
      console.log(`🔄 Attempting to bind to alternate port: ${portToListen + 1}...`);
      startServer(portToListen + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  return server;
}

startServer(PORT);

module.exports = app;
