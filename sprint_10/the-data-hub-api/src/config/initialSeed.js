/**
 * Sprint 10 Track B - Initial Relational Seed Data
 * Contains Authors (Users) and Posts linked via authorId
 */
const initialUsers = [
  {
    name: "Alex Rivers",
    email: "alex.rivers@cinestream.io",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    bio: "Lead Frontend Architect specializing in React, Next.js 15, and Redux Toolkit state design."
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@cinestream.io",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    bio: "Principal Backend Engineer focusing on distributed Node.js microservices and NoSQL schemas."
  },
  {
    name: "Marcus Chen",
    email: "marcus.chen@cinestream.io",
    role: "editor",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
    bio: "Cloud Architect and Streaming Engineer specializing in real-time media ingestion."
  },
  {
    name: "Sarah Connor",
    email: "sarah.connor@cinestream.io",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    bio: "Performance Evangelist researching browser render loops, DOM virtualization, and high frame rates."
  }
];

const initialPostsData = [
  {
    title: "Mastering Next.js 15 App Router & Server Components",
    content: "Next.js 15 revolutionizes modern web development by introducing default Server Components, asynchronous request lifecycle, and granular caching control. Learn how to isolate client components and optimize your SEO.",
    authorEmail: "alex.rivers@cinestream.io",
    category: "Web Development",
    tags: ["nextjs", "react", "ssr", "fullstack"],
    readTime: "6 min read",
    likes: 42,
    createdAt: new Date(Date.now() - 86400000 * 5)
  },
  {
    title: "Building Resilient RESTful APIs with Node.js & Express",
    content: "Architecting enterprise REST endpoints requires strict HTTP status code adherence, structured validation, custom middleware interceptors, and robust mock token auth flows.",
    authorEmail: "elena.rostova@cinestream.io",
    category: "Backend Architecture",
    tags: ["nodejs", "express", "api", "backend"],
    readTime: "8 min read",
    likes: 35,
    createdAt: new Date(Date.now() - 86400000 * 3)
  },
  {
    title: "The Architecture of Modern Streaming Engines (Cine-Stream)",
    content: "How Cine-Stream delivers sub-second movie discovery using TMDB REST APIs, dynamic metadata injection, AI mood heuristics, and optimized WebP image streaming.",
    authorEmail: "marcus.chen@cinestream.io",
    category: "System Design",
    tags: ["architecture", "streaming", "media", "ai"],
    readTime: "5 min read",
    likes: 89,
    createdAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    title: "Zero-Latency UI: Debouncing, Virtualization & Sentinels",
    content: "Deep dive into frontend performance patterns: 500ms input throttling, native browser IntersectionObserver sentinels, and eliminating unnecessary re-renders.",
    authorEmail: "sarah.connor@cinestream.io",
    category: "Performance",
    tags: ["performance", "javascript", "dom", "optimization"],
    readTime: "7 min read",
    likes: 54,
    createdAt: new Date(Date.now() - 86400000 * 1)
  },
  {
    title: "Enterprise Global State Management with Redux Toolkit",
    content: "Transitioning complex application architectures from Context API to Redux Toolkit. Exploring slice creation, immutable state updates, DevTools inspection, and hydration persistence.",
    authorEmail: "alex.rivers@cinestream.io",
    category: "State Management",
    tags: ["redux", "rtk", "react", "architecture"],
    readTime: "9 min read",
    likes: 120,
    createdAt: new Date(Date.now() - 3600000 * 4) // Most recent #2
  },
  {
    title: "NoSQL Cloud Databases: Mongoose ODM & Aggregation Pipelines",
    content: "Deep dive into MongoDB Atlas clustering, strict schema typing with Mongoose, relational data hydration with .populate(), and constructing multi-stage aggregation pipelines for high throughput.",
    authorEmail: "elena.rostova@cinestream.io",
    category: "Databases",
    tags: ["mongodb", "mongoose", "nosql", "cloud"],
    readTime: "10 min read",
    likes: 145,
    createdAt: new Date(Date.now() - 3600000 * 1) // Most recent #1
  }
];

module.exports = { initialUsers, initialPostsData };
