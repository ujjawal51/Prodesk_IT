const mongoose = require('mongoose');

let isConnected = false;
let memoryStore = []; // Resilient fallback data store if external MongoDB daemon is offline

const initialSeedPosts = [
  {
    _id: '675000000000000000000001',
    title: 'Fullstack System Integration in MERN',
    content: 'Connecting a Vite React Single Page Application with an Express and MongoDB REST API architecture with CORS authorization.',
    author: 'Resident Engineer',
    category: 'Fullstack',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/sample_fullstack.jpg',
    likes: 18,
    tags: ['MERN', 'CORS', 'Express', 'React'],
    createdAt: new Date('2026-06-16T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-16T10:00:00Z').toISOString()
  },
  {
    _id: '675000000000000000000002',
    title: 'Architecting Multipart Form Data with Multer & Cloudinary',
    content: 'Streaming multipart file buffers directly to Cloud CDN without polluting the database with heavy Base64 strings or binary blobs.',
    author: 'Staff Architect',
    category: 'Architecture',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/sample_cloud.jpg',
    likes: 24,
    tags: ['Multer', 'Cloudinary', 'CDN', 'MongoDB'],
    createdAt: new Date('2026-06-16T11:30:00Z').toISOString(),
    updatedAt: new Date('2026-06-16T11:30:00Z').toISOString()
  },
  {
    _id: '675000000000000000000003',
    title: 'Quality Assurance with Jest and React Testing Library',
    content: 'Simulating user interactions, auditing mutated DOM states, and mocking the network layer for resilient offline verification.',
    author: 'QA Specialist',
    category: 'Testing',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/sample_testing.jpg',
    likes: 12,
    tags: ['Jest', 'RTL', 'Testing', 'Next.js'],
    createdAt: new Date('2026-06-16T13:45:00Z').toISOString(),
    updatedAt: new Date('2026-06-16T13:45:00Z').toISOString()
  }
];

memoryStore = [...initialSeedPosts];

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sprint11_db';

  try {
    mongoose.set('strictQuery', false);
    // 1.5-second timeout so server startup is instantaneous even if Mongo daemon is absent
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500
    });
    isConnected = true;
    console.log(`✅ [MongoDB Connected] Connected successfully to ${uri}`);
  } catch (err) {
    console.warn(`⚠️ [MongoDB Fallback Mode Active] Could not connect to local daemon (${err.message}).`);
    console.warn(`⚡ Operating in High-Resilience In-Memory Mongo Engine with Full CRUD functionality!`);
    isConnected = false;
  }
}

function getMemoryStore() {
  return memoryStore;
}

function setMemoryStore(newStore) {
  memoryStore = newStore;
}

module.exports = {
  connectDB,
  isConnected: () => isConnected,
  getMemoryStore,
  setMemoryStore
};
