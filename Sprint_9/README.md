# 🚀 Sprint 09: Fullstack & Frontend Tracks Master Portfolio

This repository contains the complete engineering deliverables for **Sprint 09**, featuring both **Track A (Frontend Specialists: Next.js 15 Cine-Stream Migration)** and **Track B (Fullstack Developers: "The Data Hub" Express RESTful API Server)**.

---

## 📂 Project Structure

```
Sprint_9/
├── README.md                      # Master Sprint 09 documentation
├── Prompts.md                     # Corporate AI Policy debugging & prompt log
│
├── cine-stream-next/              # 🎬 TRACK A: Next.js 15 App Router Frontend
│   ├── package.json               # Dependencies & scripts
│   ├── next.config.mjs            # TMDB remote pattern image whitelist
│   ├── .env.example               # Keys template
│   ├── .env.local                 # Local environment keys
│   ├── README.md                  # Track A specific technical guide
│   └── src/
│       ├── app/
│       │   ├── layout.jsx         # Root layout with fonts & client shell
│       │   ├── page.jsx           # Server Component: Direct TMDB SSR fetch
│       │   ├── loading.jsx        # Suspense skeleton loader
│       │   ├── not-found.jsx      # Custom 404 page
│       │   ├── error.jsx          # Error boundary
│       │   ├── globals.css        # Netflix dark mode design system
│       │   ├── favorites/
│       │   │   └── page.jsx       # Client Component: LocalStorage favorites
│       │   └── movie/
│       │       └── [id]/
│       │           ├── page.jsx   # Server Component: Dynamic route + generateMetadata SEO
│       │           └── MovieDetailActions.jsx # Client Component: Actions & sharing
│       ├── components/
│       │   ├── Navbar.jsx         # Navigation with active state & badge counter
│       │   ├── Footer.jsx         # Global footer
│       │   ├── HeroBanner.jsx     # Featured backdrop & quick play CTA
│       │   ├── MovieExplorerClient.jsx # Debounced search, genre pills, infinite scroll
│       │   ├── MovieCard.jsx      # Next.js Image component & favorite toggle
│       │   ├── SearchBar.jsx      # 500ms debounced search input
│       │   ├── MoodMatcher.jsx    # Gemini AI emotion recommendation modal
│       │   ├── ApiKeyModal.jsx    # Runtime API credentials configuration
│       │   ├── SkeletonGrid.jsx   # Shimmer cards
│       │   └── ClientShell.jsx    # App shell wrapping modals & context
│       ├── context/
│       │   └── FavoritesContext.jsx # LocalStorage synced Context API
│       ├── hooks/
│       │   ├── useDebounce.js     # 500ms throttling hook
│       │   ├── useFavorites.js    # Context consumer
│       │   └── useInfiniteScroll.js # IntersectionObserver sentinel hook
│       ├── services/
│       │   ├── tmdbServer.js      # Server-side direct data fetching (SSR)
│       │   ├── tmdbClient.js      # Client-side search & pagination fetching
│       │   └── geminiAi.js        # Gemini AI Mood Matcher service
│       └── utils/
│           ├── constants.js       # Curated datasets, genres, CDN URLs
│           └── helpers.js         # Formatting helpers (currency, dates, ratings)
│
└── the-data-hub-api/              # ⚡ TRACK B: Express RESTful API Server
    ├── package.json               # Express, cors, dotenv, nodemon
    ├── server.js                  # Express app entry listening on Port 5000
    ├── .env                       # Server configuration
    ├── .env.example               # Config template
    ├── README.md                  # Track B API documentation
    ├── thunder-tests/
    │   └── data_hub_collection.json # Ready-to-import Postman / Thunder Client collection
    ├── test/
    │   └── api.test.js            # Automated Node.js integration test script
    └── src/
        ├── config/
        │   └── initialData.js     # Rich in-memory blog posts seed data
        ├── controllers/
        │   ├── authController.js  # POST /login mock JWT handler
        │   └── postController.js  # 5 standard CRUD handlers (GET, GET/:id, POST, PUT, DELETE)
        ├── middleware/
        │   ├── logger.js          # Custom logger `[METHOD] /path - HH:MM:SS AM/PM`
        │   ├── auth.js            # Mock JWT token verification middleware
        │   └── errorHandler.js    # Centralized HTTP error handling
        └── routes/
            ├── authRoutes.js      # Authentication endpoints
            └── postRoutes.js      # Blog CRUD REST endpoints
```

---

## 🎬 Track A: Frontend Architecture (Next.js 15 Cine-Stream)

### 1. Server vs. Client Component Delineation
| Component | Type | Rationale |
| :--- | :--- | :--- |
| `app/page.jsx` | **Server Component** | Fetches TMDB popular movies directly on the server without `useEffect`. Injects ready HTML into DOM for instant SEO indexing. |
| `app/movie/[id]/page.jsx` | **Server Component** | Fetches detailed movie metadata on the server. Exports dynamic `generateMetadata` for dynamic `<title>` and `<meta name="description">` tags. |
| `MovieExplorerClient.jsx` | **Client Component (`"use client"`)** | Handles interactive client state: 500ms debounced search, genre filtering pills, and IntersectionObserver infinite scroll. |
| `MovieCard.jsx` | **Client Component (`"use client"`)** | Handles click events, favorites state toggle, and Next.js `<Image />` optimization. |
| `MoodMatcher.jsx` | **Client Component (`"use client"`)** | Manages Gemini AI modal form state and emotion synthesis queries. |

### 2. Next.js 15 Image Optimization
Whitelisted `image.tmdb.org` within `next.config.mjs` to enable Next.js automatic image optimization and WebP delivery.

### 3. Running Track A Locally:
```bash
cd cine-stream-next
npm install
npm run dev
```
Open `http://localhost:3000`.

---

## ⚡ Track B: Fullstack Architecture ("The Data Hub" REST API)

### 1. REST Endpoints Specification
- `GET /posts`: List all blog posts (supports `?category`, `?tag`, `?search`, `?author`).
- `GET /posts/:id`: Fetch single blog post (returns `404` if not found).
- `POST /posts`: Create new post (validates `title`, `content`, `author`; returns `201`).
- `PUT /posts/:id`: Update existing post by ID.
- `DELETE /posts/:id`: Remove post by ID.
- `POST /login`: Issue mock JSON Web Token (JWT).

### 2. Custom Logging Middleware
Every incoming HTTP request prints:
```text
[METHOD] /path - HH:MM:SS AM/PM
Example: [GET] /posts - 03:47:06 PM
```

### 3. Running Track B & Tests:
```bash
cd the-data-hub-api
npm install
npm run dev        # Starts on http://localhost:5000 with nodemon
npm test           # Executes automated test suite
```

---

## 🧪 Verification & QA Summary

- ✅ **Track A (Next.js 15)**: App Router structure verified, direct server data fetch configured, dynamic SEO metadata configured for `/movie/[id]`, image domain whitelisted.
- ✅ **Track B (Express API)**: 9/9 Automated integration tests passed with 100% success rate across all CRUD endpoints, custom logger middleware, and mock JWT auth.
