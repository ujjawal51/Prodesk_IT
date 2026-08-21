/**
 * In-Memory Blog Posts Initial Seed Data
 * Sprint 09 strictly limits persistence to local memory variables
 */
const initialBlogPosts = [
  {
    id: "1",
    title: "Mastering Next.js 15 App Router & Server Components",
    content: "Next.js 15 revolutionizes modern web development by introducing default Server Components, asynchronous request lifecycle, and granular caching control. Learn how to isolate client components and optimize your SEO.",
    author: "Alex Rivers",
    category: "Web Development",
    tags: ["nextjs", "react", "ssr", "fullstack"],
    readTime: "6 min read",
    likes: 42,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "2",
    title: "Building Resilient RESTful APIs with Node.js & Express",
    content: "Architecting enterprise REST endpoints requires strict HTTP status code adherence, structured validation, custom middleware interceptors, and robust mock token auth flows.",
    author: "Elena Rostova",
    category: "Backend Architecture",
    tags: ["nodejs", "express", "api", "backend"],
    readTime: "8 min read",
    likes: 35,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "3",
    title: "The Architecture of Modern Streaming Engines (Cine-Stream)",
    content: "How Cine-Stream delivers sub-second movie discovery using TMDB REST APIs, dynamic metadata injection, AI mood heuristics, and optimized WebP image streaming.",
    author: "Marcus Chen",
    category: "System Design",
    tags: ["architecture", "streaming", "media", "ai"],
    readTime: "5 min read",
    likes: 89,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "4",
    title: "Zero-Latency UI: Debouncing, Virtualization & Sentinels",
    content: "Deep dive into frontend performance patterns: 500ms input throttling, native browser IntersectionObserver sentinels, and eliminating unnecessary re-renders.",
    author: "Sarah Connor",
    category: "Performance",
    tags: ["performance", "javascript", "dom", "optimization"],
    readTime: "7 min read",
    likes: 54,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

module.exports = initialBlogPosts;
