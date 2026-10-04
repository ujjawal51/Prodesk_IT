/**
 * Sprint 12 Track B: Socket.IO Server Pipeline & Event Handlers
 * Implements strict specifications from Sprint 12 Technical FAQ:
 * - FAQ Q7: Explicit CORS Configuration
 * - FAQ Q9: socket.broadcast.emit (exclude sender) vs io.emit (include sender)
 */

const { Server } = require('socket.io');
const { socketCorsConfig } = require('../config/cors');
const chatStore = require('../store/chatStore');
const { formatMessage, formatSystemNotification } = require('../utils/messageFormatter');

function setupSocketServer(httpServer) {
  // FAQ Q7: Pass explicit CORS configuration object during Socket server instantiation
  const io = new Server(httpServer, {
    cors: socketCorsConfig,
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Latency measurement handler (ping-pong)
    socket.on('client_ping', (timestamp) => {
      socket.emit('server_pong', timestamp);
    });

    /**
     * User registration and initial room join
     */
    socket.on('user_join', ({ username, room = 'general' }) => {
      const sanitizedRoom = (room || 'general').toLowerCase();
      const user = chatStore.addUser(socket.id, username, sanitizedRoom);
      socket.join(sanitizedRoom);

      console.log(`[Socket.IO] User "${user.username}" joined room "#${sanitizedRoom}" (${socket.id})`);

      // 1. Send recent room history to the joining client only
      const history = chatStore.getRoomHistory(sanitizedRoom);
      socket.emit('room_history', {
        room: sanitizedRoom,
        messages: history
      });

      // 2. Notify the joining client with a welcome message
      const welcomeMsg = formatSystemNotification(
        `Connected to real-time gateway. Welcome to #${sanitizedRoom}, ${user.username}!`,
        sanitizedRoom,
        'join'
      );
      socket.emit('chat_message', welcomeMsg);

      // 3. FAQ Q9: Broadcast to all clients in the room EXCEPT the sender
      // "Utilize socket.broadcast.emit('event', payload)" (or socket.to(room).emit)
      const joinNotification = formatSystemNotification(
        `${user.username} entered the channel.`,
        sanitizedRoom,
        'join'
      );
      socket.to(sanitizedRoom).emit('chat_message', joinNotification);

      // 4. FAQ Q9: Broadcast globally including sender
      // "To broadcast globally including the sender, execute io.emit('event', payload)"
      io.to(sanitizedRoom).emit('room_users', {
        room: sanitizedRoom,
        users: chatStore.getUsersInRoom(sanitizedRoom)
      });

      // Emit global stats to all connected clients
      io.emit('active_stats', {
        totalOnline: chatStore.getAllUsers().length,
        rooms: chatStore.getRooms()
      });
    });

    /**
     * Switching Rooms
     */
    socket.on('switch_room', ({ newRoom }) => {
      const user = chatStore.getUser(socket.id);
      if (!user) return;

      const oldRoom = user.room;
      const targetRoom = (newRoom || 'general').toLowerCase();

      if (oldRoom === targetRoom) return;

      // Leave old room
      socket.leave(oldRoom);
      socket.to(oldRoom).emit('chat_message', formatSystemNotification(
        `${user.username} departed for #${targetRoom}`,
        oldRoom,
        'leave'
      ));
      socket.to(oldRoom).emit('room_users', {
        room: oldRoom,
        users: chatStore.getUsersInRoom(oldRoom)
      });

      // Join new room
      chatStore.updateUserRoom(socket.id, targetRoom);
      socket.join(targetRoom);

      // Send new room history
      socket.emit('room_history', {
        room: targetRoom,
        messages: chatStore.getRoomHistory(targetRoom)
      });

      // Notify target room members except sender (FAQ Q9)
      socket.to(targetRoom).emit('chat_message', formatSystemNotification(
        `${user.username} joined #${targetRoom}`,
        targetRoom,
        'join'
      ));

      // Global broadcast to new room (including sender)
      io.to(targetRoom).emit('room_users', {
        room: targetRoom,
        users: chatStore.getUsersInRoom(targetRoom)
      });
    });

    /**
     * Chat message payload distribution
     * FAQ Q9: Global broadcast including sender -> io.to(room).emit('chat_message', message)
     */
    socket.on('send_message', ({ text, room }) => {
      const user = chatStore.getUser(socket.id);
      const targetRoom = (room || (user && user.room) || 'general').toLowerCase();
      const username = user ? user.username : 'Anonymous';

      if (!text || !text.trim()) return;

      const message = formatMessage(username, text, targetRoom, 'user');
      chatStore.addMessage(targetRoom, message);

      // Global broadcast to all clients in the room, including sender
      io.to(targetRoom).emit('chat_message', message);
    });

    /**
     * Typing indicators
     * FAQ Q9: Broadcast payloads to all clients except the sender
     * -> socket.to(room).emit('user_typing', payload)
     */
    socket.on('typing_start', ({ room }) => {
      const user = chatStore.getUser(socket.id);
      if (!user) return;
      const targetRoom = (room || user.room || 'general').toLowerCase();

      // Only notify other clients, do NOT notify sender!
      socket.to(targetRoom).emit('user_typing', {
        username: user.username,
        socketId: socket.id,
        room: targetRoom,
        isTyping: true
      });
    });

    socket.on('typing_stop', ({ room }) => {
      const user = chatStore.getUser(socket.id);
      if (!user) return;
      const targetRoom = (room || user.room || 'general').toLowerCase();

      socket.to(targetRoom).emit('user_typing', {
        username: user.username,
        socketId: socket.id,
        room: targetRoom,
        isTyping: false
      });
    });

    /**
     * Broadcast Announcement (Demonstrating io.emit vs socket.broadcast.emit explicitly)
     */
    socket.on('broadcast_alert', ({ alertText, globalScope = false }) => {
      const user = chatStore.getUser(socket.id);
      const username = user ? user.username : 'Engineer';

      if (globalScope) {
        // io.emit -> globally to EVERY connected client in all rooms
        io.emit('system_alert', {
          title: `Broadcast from ${username}`,
          text: alertText,
          timestamp: new Date().toISOString()
        });
      } else {
        // socket.broadcast.emit -> to all clients except sender
        socket.broadcast.emit('system_alert', {
          title: `Peer Alert from ${username}`,
          text: alertText,
          timestamp: new Date().toISOString()
        });
      }
    });

    /**
     * Disconnect handler
     */
    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (reason: ${reason})`);
      const user = chatStore.removeUser(socket.id);
      if (user) {
        // Notify remaining room members
        socket.to(user.room).emit('chat_message', formatSystemNotification(
          `${user.username} disconnected.`,
          user.room,
          'leave'
        ));
        socket.to(user.room).emit('room_users', {
          room: user.room,
          users: chatStore.getUsersInRoom(user.room)
        });

        // Update global online count
        io.emit('active_stats', {
          totalOnline: chatStore.getAllUsers().length,
          rooms: chatStore.getRooms()
        });
      }
    });
  });

  return io;
}

module.exports = setupSocketServer;
