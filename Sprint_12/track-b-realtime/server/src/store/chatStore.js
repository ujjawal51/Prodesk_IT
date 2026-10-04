/**
 * In-memory state store for active WebSocket connections, users, and rooms
 */

class ChatStore {
  constructor() {
    this.users = new Map(); // socketId -> { id, username, room, joinedAt, avatar }
    this.rooms = new Set(['general', 'dev-ops', 'engineering-leads', 'random']);
    this.messageHistory = new Map(); // room -> Array<Message>
    this.maxHistoryPerRoom = 100;

    // Initialize default rooms
    for (const room of this.rooms) {
      this.messageHistory.set(room, []);
    }
  }

  addUser(socketId, username, room = 'general') {
    const avatarIndex = Math.abs(this.hashCode(username || socketId)) % 10;
    const user = {
      socketId,
      username: username || `Engineer_${socketId.substring(0, 4)}`,
      room: room.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username || socketId)}`,
      joinedAt: new Date().toISOString()
    };
    this.users.set(socketId, user);
    return user;
  }

  getUser(socketId) {
    return this.users.get(socketId);
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      this.users.delete(socketId);
    }
    return user;
  }

  updateUserRoom(socketId, newRoom) {
    const user = this.users.get(socketId);
    if (user) {
      user.room = newRoom.toLowerCase();
      this.users.set(socketId, user);
      if (!this.rooms.has(user.room)) {
        this.rooms.add(user.room);
        this.messageHistory.set(user.room, []);
      }
    }
    return user;
  }

  getUsersInRoom(room) {
    const roomLower = room.toLowerCase();
    const result = [];
    for (const user of this.users.values()) {
      if (user.room === roomLower) {
        result.push(user);
      }
    }
    return result;
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  getRooms() {
    return Array.from(this.rooms);
  }

  addMessage(room, message) {
    const roomLower = room.toLowerCase();
    if (!this.messageHistory.has(roomLower)) {
      this.messageHistory.set(roomLower, []);
    }
    const history = this.messageHistory.get(roomLower);
    history.push(message);
    if (history.length > this.maxHistoryPerRoom) {
      history.shift();
    }
    return message;
  }

  getRoomHistory(room) {
    const roomLower = room.toLowerCase();
    return this.messageHistory.get(roomLower) || [];
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}

const chatStore = new ChatStore();
module.exports = chatStore;
