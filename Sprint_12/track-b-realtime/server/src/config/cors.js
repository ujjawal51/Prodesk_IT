/**
 * Sprint 12 Track B: WebSocket & HTTP CORS Configuration
 * Adheres strictly to Sprint 12 FAQ Q7:
 * "WebSocket CORS policies are distinct from Express HTTP policies.
 *  You must pass an explicit CORS configuration object during the Socket server instantiation"
 */

const allowedOrigins = [
  'http://localhost:3000', // Next.js default client
  'http://localhost:5173', // Vite default client
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL || 'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman WebSocket audit)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev for Postman & multi-port testing
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

const socketCorsConfig = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', '*'],
  methods: ['GET', 'POST'],
  credentials: true
};

module.exports = {
  allowedOrigins,
  corsOptions,
  socketCorsConfig
};
