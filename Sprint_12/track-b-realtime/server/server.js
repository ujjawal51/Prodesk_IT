/**
 * Sprint 12 Track B: Real-Time WebSocket & Socket.IO Gateway Server
 * Author: Ujjawal Tiwari (Prodesk IT Engineering Residency)
 */

require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { corsOptions } = require('./src/config/cors');
const setupSocketServer = require('./src/socket/socketHandler');
const chatStore = require('./src/store/chatStore');

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// System Health & Diagnostics REST endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Sprint 12 Track B: Real-Time WebSocket & Socket.IO Pipeline',
    intern: 'Ujjawal Tiwari',
    protocol: 'WebSockets (RFC 6455) & Socket.IO 4.x Engine.IO',
    endpoints: {
      health: '/health',
      stats: '/api/stats',
      rooms: '/api/rooms'
    },
    corsConfig: {
      explicitWebSocketCORS: true,
      allowedClientOrigins: ['http://localhost:3000', 'http://localhost:5173']
    },
    postmanAudit: {
      transport: 'WebSocket',
      connectionUrl: `ws://localhost:${PORT}/socket.io/?EIO=4&transport=websocket`
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024)
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalOnlineUsers: chatStore.getAllUsers().length,
    activeRooms: chatStore.getRooms(),
    users: chatStore.getAllUsers().map(u => ({
      username: u.username,
      room: u.room,
      joinedAt: u.joinedAt
    }))
  });
});

app.get('/api/rooms', (req, res) => {
  const roomsData = chatStore.getRooms().map(room => ({
    name: room,
    activeUsersCount: chatStore.getUsersInRoom(room).length,
    messageCount: chatStore.getRoomHistory(room).length
  }));
  res.json({ rooms: roomsData });
});

// Create HTTP server & bind Socket.IO
const httpServer = http.createServer(app);
const io = setupSocketServer(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Sprint 12 Track B Real-Time Server running on port ${PORT}`);
  console.log(`🌐 HTTP API: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket / Socket.IO Gateway active on port ${PORT}`);
  console.log(`🛡️ CORS Origins Authorized: http://localhost:3000, http://localhost:5173`);
  console.log('====================================================');
});

// Export server for integration testing
module.exports = { app, httpServer, io };
