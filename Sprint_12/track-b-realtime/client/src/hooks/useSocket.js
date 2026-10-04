/**
 * Custom React Hook: useSocket
 * Strict adherence to Sprint 12 FAQ Q8:
 * "React 18 StrictMode double-invokes effects in development, causing dual socket connections.
 *  Implement a strict useEffect cleanup function: return () => socket.disconnect();"
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useSocket(initialUsername = '', initialRoom = 'general') {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionTransport, setConnectionTransport] = useState('connecting');
  const [latencyMs, setLatencyMs] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(initialRoom);
  const [username, setUsername] = useState(initialUsername || `Engineer_${Math.floor(1000 + Math.random() * 9000)}`);
  
  const [messages, setMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [activeStats, setActiveStats] = useState({ totalOnline: 0, rooms: [] });
  const [typingUsers, setTypingUsers] = useState([]);
  const [systemAlert, setSystemAlert] = useState(null);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket lifecycle
  useEffect(() => {
    console.log(`[useSocket] Initializing Socket connection to ${SOCKET_SERVER_URL}...`);

    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log(`[useSocket] Connected successfully with ID: ${socketInstance.id}`);
      setIsConnected(true);
      setConnectionTransport(socketInstance.io.engine.transport.name);

      // Register user and join initial room
      socketInstance.emit('user_join', {
        username: username,
        room: currentRoom
      });

      // Listen for transport upgrade (e.g. polling -> websocket)
      socketInstance.io.engine.on('upgrade', () => {
        setConnectionTransport(socketInstance.io.engine.transport.name);
      });
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`[useSocket] Disconnected: ${reason}`);
      setIsConnected(false);
      setConnectionTransport('disconnected');
    });

    // Room history synchronization
    socketInstance.on('room_history', (data) => {
      if (data.room === currentRoom) {
        setMessages(data.messages || []);
      }
    });

    // Chat message arrival (io.emit global broadcast)
    socketInstance.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Room active users update
    socketInstance.on('room_users', (data) => {
      if (data.room === currentRoom) {
        setRoomUsers(data.users || []);
      }
    });

    // Global stats update
    socketInstance.on('active_stats', (stats) => {
      setActiveStats(stats);
    });

    // Typing notifications from peers (socket.broadcast.emit)
    socketInstance.on('user_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          return prev;
        });
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== data.username));
      }
    });

    // System wide alert banner
    socketInstance.on('system_alert', (alertData) => {
      setSystemAlert(alertData);
      setTimeout(() => setSystemAlert(null), 6000);
    });

    // Latency Ping-Pong calculation
    const pingInterval = setInterval(() => {
      if (socketInstance.connected) {
        const start = Date.now();
        socketInstance.emit('client_ping', start);
      }
    }, 4000);

    socketInstance.on('server_pong', (sentTime) => {
      const ping = Date.now() - sentTime;
      setLatencyMs(ping);
    });

    /**
     * CRITICAL REQUIREMENT (FAQ Q8):
     * React 18 StrictMode double-invokes effects in development.
     * Strict cleanup function disconnects socket to prevent duplicate connections and duplicate payloads.
     */
    return () => {
      console.log('[useSocket] Clean-up invoked: Disconnecting socket to eliminate ghost listeners.');
      clearInterval(pingInterval);
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('chat_message');
      socketInstance.off('room_history');
      socketInstance.off('room_users');
      socketInstance.off('active_stats');
      socketInstance.off('user_typing');
      socketInstance.off('system_alert');
      socketInstance.off('server_pong');
      socketInstance.disconnect();
    };
  }, []); // Run on mount

  // Switch Room action
  const switchRoom = useCallback((newRoom) => {
    if (!socketRef.current || !isConnected || newRoom === currentRoom) return;

    setCurrentRoom(newRoom);
    setMessages([]);
    setTypingUsers([]);
    socketRef.current.emit('switch_room', { newRoom });
  }, [currentRoom, isConnected]);

  // Send Message action
  const sendMessage = useCallback((text) => {
    if (!socketRef.current || !isConnected || !text.trim()) return;

    socketRef.current.emit('send_message', {
      text,
      room: currentRoom
    });
    // Immediately stop typing indicator on send
    stopTyping();
  }, [currentRoom, isConnected]);

  // Start Typing notification (debounced stop)
  const startTyping = useCallback(() => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('typing_start', { room: currentRoom });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [currentRoom, isConnected]);

  // Stop Typing notification
  const stopTyping = useCallback(() => {
    if (!socketRef.current || !isConnected) return;
    socketRef.current.emit('typing_stop', { room: currentRoom });
  }, [currentRoom, isConnected]);

  // Broadcast System Alert
  const broadcastAlert = useCallback((alertText, globalScope = false) => {
    if (!socketRef.current || !isConnected) return;
    socketRef.current.emit('broadcast_alert', { alertText, globalScope });
  }, [isConnected]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionTransport,
    latencyMs,
    username,
    setUsername,
    currentRoom,
    messages,
    roomUsers,
    activeStats,
    typingUsers,
    systemAlert,
    switchRoom,
    sendMessage,
    startTyping,
    stopTyping,
    broadcastAlert
  };
}
