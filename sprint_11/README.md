# 🏆 Sprint 11: The Professional Standard — Advanced Integration & QA Automation

Welcome to **Sprint 11**, the capstone integration milestone of the Engineering Residency. This repository delivers production-grade architectures bridging the gap between isolated modules and professional enterprise software across both tracks:

- **🧪 Track A: Frontend Specialists** — Automated Testing Suite utilizing **Jest**, **React Testing Library (RTL)**, and **jsdom** in Next.js.
- **🌐 Track B: Fullstack Developers** — Unified **MERN System Integration** connecting a React/Vite SPA with an Express/MongoDB REST API, CORS authorization, optimistic UI CRUD, and Multipart asset management streaming to Cloudinary CDN.

---

## 📂 Project Architecture

```
sprint_11/
├── README.md                          # Master Sprint 11 documentation & execution guide
├── Prompts.md                         # Corporate AI residency policy & prompt log
│
├── track-a-testing/                   # 🧪 TRACK A: Next.js + Jest + RTL Testing Suite
│   ├── package.json                   # Dependencies, Jest, RTL, jsdom
│   ├── jest.config.js                 # Jest config with jsdom & coverage reporters
│   ├── jest.setup.js                  # @testing-library/jest-dom setup & mock setup
│   ├── .babelrc                       # Babel JSX & ES module presets
│   ├── next.config.mjs                # Next.js 14 runtime configuration
│   └── src/
│       ├── app/
│       │   ├── layout.jsx             # Next.js root layout
│       │   ├── page.jsx               # Interactive test component showcase
│       │   └── globals.css            # Global CSS design tokens
│       ├── components/
│       │   ├── Button.jsx             # Unit tested button (props, variants, disabled)
│       │   ├── Card.jsx               # Unit tested card (props hydration, action)
│       │   ├── Input.jsx              # Keystroke tested input (simulated change)
│       │   ├── Counter.jsx            # Event tested counter (mutated integer in DOM)
│       │   └── AsyncDataList.jsx      # Asynchronous feed with mocked network layer
│       └── __tests__/
│           ├── Button.test.jsx        # Phase 1: Mount & prop payload tests
│           ├── Card.test.jsx          # Phase 1: Prop rendering & action tests
│           ├── Input.test.jsx         # Phase 2: Simulated keystroke updates
│           ├── Counter.test.jsx       # Phase 2: User click "Increment" & DOM mutated integer
│           └── AsyncDataList.test.jsx # Phase 3: Explicit network mocking & offline test
│
└── track-b-fullstack/                 # 🌐 TRACK B: Fullstack MERN System Integration
    │
    ├── client/                        # ⚡ React + Vite Single Page Application
    │   ├── package.json               # React 18, Vite 5, Axios, Lucide
    │   ├── vite.config.js             # Vite development server & API proxy
    │   ├── index.html                 # HTML shell with Google Fonts
    │   └── src/
    │       ├── index.css              # Cyberpunk dark mode design system & shimmer tokens
    │       ├── main.jsx               # React DOM root entry
    │       ├── App.jsx                # Full CRUD master orchestrator + optimistic UI
    │       ├── services/
    │       │   └── api.js             # Axios client (GET, POST FormData, PUT, DELETE, PATCH)
    │       └── components/
    │           ├── Navbar.jsx         # Header, live API health indicator, search & filter
    │           ├── PostCard.jsx       # Card displaying Cloudinary thumbnail & delete trigger
    │           ├── CreatePostModal.jsx# Form dispatching Multipart FormData payload
    │           ├── EditPostModal.jsx  # PUT edit form with optional thumbnail replacement
    │           ├── LoadingSkeleton.jsx# Phase 2: Dynamic "Loading..." animated shimmer cards
    │           └── ErrorBoundary.jsx  # Phase 2: Clean error boundary on backend disconnection
    │
    └── server/                        # 🚀 Node.js + Express + MongoDB REST API
        ├── package.json               # Express, CORS, Mongoose, Multer, Cloudinary SDK
        ├── server.js                  # Express setup, CORS authorization, routes & port fallback
        ├── .env.example               # Environment variables template
        ├── .env                       # Local environment configuration
        └── src/
            ├── config/
            │   ├── db.js              # MongoDB Mongoose connection + In-memory fallback
            │   └── cloudinary.js      # Multer memory buffer streaming to Cloudinary CDN
            ├── models/
            │   └── Post.js            # Mongoose schema with strict URL string constraint
            ├── middleware/
            │   └── upload.js          # Multer memoryStorage with image MIME validation
            ├── controllers/
            │   └── postController.js  # CRUD logic (GET, POST multipart, PUT, DELETE, PATCH)
            └── routes/
                └── postRoutes.js      # REST API route declarations
```

---

## 🧪 Track A: Frontend Specialists (QA Automation & Testing)

### Phase 1: Environment Configuration & Unit Testing (P0 - Mandatory)
- **Environment Setup**: Configured **Jest 29** with **jsdom** test environment and `@testing-library/jest-dom` matchers to simulate a browser DOM environment within Next.js.
- **Unit Tests**: Architected isolated unit tests for `Button`, `Card`, and `Input`.
- **Execution Criteria**:
  - Verified each component mounts without crashing.
  - Verified accurate text payload rendering passed via props.

### Phase 2: Interaction & Event Testing (P1 - Priority)
- **Event Simulation**: Implemented interaction tests using `fireEvent` / `userEvent`.
- **Execution Criteria**:
  - **Counter State Mutation**: Verified that when a simulated user clicks the **"Increment"** action, the DOM correctly renders the mutated integer (`0` ➔ `1` ➔ `2`).
  - **Input Keystroke Updates**: Verified that when simulated keystrokes are entered into the input field, the component state and onChange handler update accurately.

### Phase 3: Network Mocking & Coverage Reports (P2 - Advanced)
- **API Mocking**: Audited `AsyncDataList`, which executes an asynchronous network call via `fetch`. Explicitly mocked the global network layer (`global.fetch = jest.fn(...)`) to guarantee that the test suite executes offline with zero internet dependency.
- **Coverage Threshold**: Configured Jest coverage reporter. Executing `npm test -- --coverage` generates text, lcov, and HTML coverage reports.

#### Running Track A Tests:
```bash
cd sprint_11/track-a-testing
npm test -- --coverage
```

---

## 🌐 Track B: Fullstack Developers (MERN System Integration)

### Phase 1: Network Connection & CORS Configuration (P0 - Mandatory)
- **API Hydration**: Deprecated all dummy/mock API URIs inside the React SPA. Substituted with local Node.js endpoint (`http://localhost:5000/api/posts`).
- **Data Fetching**: Implemented `useEffect` hook in `App.jsx` to execute asynchronous `GET` requests to MongoDB and render data payloads.
- **CORS Resolution**: Installed and configured the `cors` package within Express (`server.js`) authorizing requests originating from `http://localhost:5173`.

### Phase 2: Full CRUD UI Pipeline (P1 - Priority)
- **Data Injection (POST)**: Built `CreatePostModal` that constructs a `FormData` object and dispatches a `POST` request to `/api/posts`, injecting new documents into MongoDB.
- **Data Deletion (DELETE)**: Implemented a "Delete" button on each card dispatching `DELETE /api/posts/:id` to the server and immediately mutating the local React state/DOM to reflect the removed object without full page reloads.
- **Dynamic State Management**:
  - Architected `LoadingSkeleton.jsx` rendering animated pulse/shimmer placeholders during asynchronous delays.
  - Implemented `ErrorBoundary.jsx` displaying clean diagnostics, retry actions, and server health status when backend connectivity fails.

### Phase 3: Multipart Form Data & Asset Management (P2 - Advanced)
- **Multipart Architecture**:
  - **Frontend**: Form payload dispatched using native browser `FormData` containing text fields and the binary image file (`thumbnail`).
  - **Backend**: Configured `multer` with `memoryStorage()` to parse incoming file buffers directly in memory.
  - **Storage**: Streamed the file buffer to Cloudinary CDN using `cloudinary.uploader.upload_stream`.
  - **Strict Constraint Adherence**: **Do not save Base64 strings or binary files directly into MongoDB.** The Mongoose schema enforces this constraint via custom validation, strictly persisting only the HTTPS Cloudinary CDN URL string (`thumbnailUrl`).

---

## 🚀 Running Track B (Fullstack Integration)

### 1. Launch Backend API Server
```bash
cd sprint_11/track-b-fullstack/server
npm start
# Server binds to http://localhost:5000
# REST Endpoints: http://localhost:5000/api/posts
```

### 2. Launch Frontend React/Vite Client
```bash
cd sprint_11/track-b-fullstack/client
npm run dev
# SPA opens at http://localhost:5173
```

---

## 📡 REST API Specifications

| Method | Endpoint | Description | Payload Format |
|---|---|---|---|
| `GET` | `/` | System status & endpoints directory | None |
| `GET` | `/api/posts` | Hydrate all posts (with search & category filters) | Query Params |
| `GET` | `/api/posts/:id` | Fetch single post by ID | None |
| `POST` | `/api/posts` | Inject new document + upload thumbnail to Cloudinary | `multipart/form-data` |
| `PUT` | `/api/posts/:id` | Update post document fields or thumbnail | `multipart/form-data` or JSON |
| `DELETE` | `/api/posts/:id` | Remove document from MongoDB | None |
| `PATCH` | `/api/posts/:id/like` | Increment like counter integer | None |

---

## ✅ Quality Checklist
- [x] Jest & RTL configured with jsdom
- [x] Unit tests for Button, Card, Input passing (Mounting & Prop payloads)
- [x] Interaction & event tests passing (Increment mutated integer, Input keystrokes)
- [x] Network mocking configured for offline test execution
- [x] Code coverage reporting generated (`--coverage`)
- [x] React SPA hydrated via `http://localhost:5000/api/posts`
- [x] CORS middleware configured on Express server
- [x] Full CRUD UI pipeline (GET, POST, PUT, DELETE)
- [x] Optimistic DOM mutation upon deletion
- [x] Dynamic loading skeleton UI states
- [x] Clean error boundary on backend failure
- [x] Multipart FormData dispatch on frontend
- [x] Multer memory buffer streaming on backend
- [x] Strict constraint: Cloudinary URL string stored in MongoDB (no Base64/binary blobs)
