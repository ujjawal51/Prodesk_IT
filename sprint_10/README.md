# 🚀 Sprint 10: Enterprise Data Management Master Portfolio

Welcome to the complete engineering deliverables for **Sprint 10**. This sprint resolves the most complex challenge in enterprise software engineering: **Data Management**.

- **Track A (Frontend Specialists)**: Architected an **Advanced Global State Architecture** using **Redux Toolkit (RTK)** and **React-Redux**, migrating out of legacy Context API into dedicated slices, building a multifaceted sidebar filter synced to global state, optimizing DOM re-renders with `useMemo`/`useCallback`, creating a global Dark/Light Theme Manager, and persisting RAM state across browser refreshes via `localStorage`.
- **Track B (Fullstack Developers)**: Engineered **Persistent Cloud Storage** with **MongoDB Atlas** and **Mongoose ODM**, migrating away from volatile in-memory arrays to strict schemas, executing live CRUD operations (`Post.create()`, `Post.find()`, `Post.findByIdAndDelete()`), building relational references with `.populate('authorId')`, and designing multi-stage Aggregation Pipelines to return the "Top 3 Most Recent Posts".

---

## 📂 Project Structure

```
sprint_10/
├── README.md                      # Master Sprint 10 documentation
├── Prompts.md                     # Mandatory Corporate AI Policy prompt log
│
├── cine-stream-next/              # 🎬 TRACK A: Next.js 15 + Redux Toolkit
│   ├── package.json               # Next.js 15, React 19, @reduxjs/toolkit, react-redux
│   ├── next.config.mjs            # Remote image security whitelisting
│   ├── .env.example               # Configuration keys template
│   ├── .env.local                 # Local environment keys
│   ├── README.md                  # Track A dedicated technical guide
│   └── src/
│       ├── app/
│       │   ├── layout.jsx         # Root layout with fonts & ClientShell
│       │   ├── page.jsx           # Server Component: TMDB SSR fetch
│       │   ├── loading.jsx        # Suspense skeleton loader
│       │   ├── not-found.jsx      # Custom 404 page
│       │   ├── error.jsx          # Error boundary
│       │   ├── globals.css        # Dark & Light theme tokens and sidebar layout
│       │   ├── favorites/
│       │   │   └── page.jsx       # Redux-powered favorites view
│       │   └── movie/[id]/
│       │       ├── page.jsx       # Dynamic route with generateMetadata SEO
│       │       └── MovieDetailActions.jsx # Redux favorite toggle & actions
│       ├── redux/
│       │   ├── store.js           # configureStore with DevTools & localStorage middleware
│       │   ├── hooks.js           # Typed useAppDispatch & useAppSelector
│       │   └── slices/
│       │       ├── favoritesSlice.js # Migrated Cart/Favorites Redux Slice
│       │       ├── filterSlice.js    # Complex multifaceted filter Redux Slice
│       │       └── themeSlice.js     # Dark/Light mode Theme Manager Redux Slice
│       ├── components/
│       │   ├── ReduxProvider.jsx     # Client store wrapper & hydration
│       │   ├── ClientShell.jsx       # Shell syncing root DOM data-theme attribute
│       │   ├── Navbar.jsx            # Redux badge counter, theme toggle, DevTools guide
│       │   ├── SidebarFilter.jsx     # Multifaceted sidebar filter (Search, Genre, Rating, Year, Sort)
│       │   ├── MovieExplorerClient.jsx # useMemo/useCallback render-optimized grid
│       │   ├── MovieCard.jsx         # Card with Redux favorite toggle
│       │   ├── ReduxDevToolsGuideModal.jsx # In-app QA demo verification guide
│       │   ├── HeroBanner.jsx        # Featured movie banner
│       │   ├── MoodMatcher.jsx       # Gemini AI emotion movie finder modal
│       │   └── SkeletonGrid.jsx      # Shimmer loading skeleton
│       ├── hooks/
│       │   ├── useFavorites.js       # Refactored Redux consumer hook
│       │   ├── useDebounce.js        # 500ms input throttling hook
│       │   └── useInfiniteScroll.js  # IntersectionObserver sentinel hook
│       ├── services/
│       │   ├── tmdbServer.js         # Direct SSR fetcher
│       │   └── tmdbClient.js         # Client-side search & pagination
│       └── utils/
│           ├── constants.js          # Curated genres & fallback catalog
│           └── helpers.js            # Formatting helpers
│
└── the-data-hub-api/              # ⚡ TRACK B: Express + MongoDB Atlas (Mongoose ODM)
    ├── package.json               # Express, Mongoose, Dotenv, Cors
    ├── server.js                  # Express app entry & Mongoose connection
    ├── .env                       # Local secrets (strictly excluded from Git)
    ├── .env.example               # Safe environment template
    ├── .gitignore                 # CRITICAL: Excludes .env to protect credentials
    ├── README.md                  # Track B dedicated technical guide
    ├── thunder-tests/
    │   └── sprint10_collection.json # Ready-to-import Postman / Thunder Client collection
    ├── test/
    │   └── api.test.js            # Automated integration test suite (9/9 Passed)
    └── src/
        ├── config/
        │   ├── db.js              # Mongoose connection manager with Atlas diagnostics
        │   └── initialSeed.js     # Relational seed dataset (Users + Posts)
        ├── controllers/
        │   ├── authController.js  # RFC 7519 JWT Bearer token generation
        │   ├── postController.js  # Live Mongoose CRUD & Aggregation pipeline
        │   └── userController.js  # Relational Author entity management
        ├── middleware/
        │   ├── auth.js            # JWT Bearer verification
        │   ├── errorHandler.js    # Mongoose error interceptor
        │   └── logger.js          # Timestamped request logger
        ├── models/
        │   ├── Post.js            # Strict Post schema with authorId ref User
        │   └── User.js            # Relational User author schema
        ├── routes/
        │   ├── authRoutes.js      # /login
        │   ├── postRoutes.js      # /posts CRUD & /posts/top-recent
        │   └── userRoutes.js      # /users
        └── utils/
            └── seedDb.js          # Relational database seeder
```

---

## 🎬 Track A: Frontend Specialists Deliverables

### Phase 1: Global Store Initialization (P0 - Mandatory)
1. **Redux Toolkit Integration**: Installed `@reduxjs/toolkit` and `react-redux`. Configured the global store in `src/redux/store.js` using `configureStore()`.
2. **Provider Wrapping**: Created `src/components/ReduxProvider.jsx`, wrapping the entire application inside `<Provider store={store}>`.
3. **Slice Migration**: Completely refactored the legacy Context API shopping cart/favorites into `src/redux/slices/favoritesSlice.js`. Actions include `addFavorite`, `removeFavorite`, `toggleFavorite`, `clearFavorites`, and `hydrateFavorites`.
4. **Surviving Hard Reloads (Technical FAQ 4)**: Built `localStorageMiddleware` and client-side hydration so that saved favorites and user theme persist in `localStorage` across page refreshes (`F5`).

### Phase 2: Complex Filtering & State Sync (P1 - Priority)
1. **Multifaceted Sidebar Filter (`SidebarFilter.jsx`)**:
   - **Text Search**: Real-time title/cast search.
   - **Category / Genre**: Dynamic pills cloud with count badges.
   - **Minimum Rating Slider**: Interactive slider (0.0 to 9.5 stars).
   - **Release Year / Era**: Filter by current releases (2024), 2020s, or classic cinema (< 2015).
   - **Sort By**: Most Popular, Highest Rated, Newest, Title A-Z.
   - **Active Filter Counter**: Live indicator badge and instant "Reset All Filters" trigger.
2. **Global Filter State Sync (`filterSlice.js`)**: All active parameters are held in the global Redux store. When a user mutates any filter in the sidebar, the catalog grid instantly reflects the updated state without prop drilling.

### Phase 3: Render Optimization & Theming (P2 - Advanced)
1. **Re-render Mitigation**:
   - Filtered and sorted movie arrays are computed using `useMemo()` in `src/components/MovieExplorerClient.jsx`. This prevents expensive array operations during unrelated DOM renders.
   - Input updates are throttled via `useDebounce()`, and handlers are memoized via `useCallback()`, ensuring a smooth 60fps user experience.
2. **Global Theme Manager (`themeSlice.js`)**:
   - Manages Dark and Light modes entirely through Redux.
   - `ClientShell.jsx` reacts to state changes and toggles `data-theme="dark"` / `"light"` on the document root with smooth CSS variable transitions.

---

## ⚡ Track B: Fullstack Developers Deliverables

### Phase 1: Cloud Provisioning & ODM Setup (P0 - Mandatory)
1. **MongoDB Atlas Connection Architecture**:
   - Installed `mongoose` and architected `src/config/db.js` interfacing with MongoDB Atlas via `process.env.MONGO_URI`.
   - Comprehensive connection diagnostics with auto-reconnect and graceful error handling.
2. **Strict Schema Design (`src/models/Post.js`)**:
   - Strict typing: `title: String`, `content: String`, `category: String`, `tags: [String]`, `readTime: String`, `likes: Number`, and `timestamps: true` (`createdAt: Date`, `updatedAt: Date`).
3. **Credential Security (Technical FAQ 1)**:
   - Credentials stored in `.env`.
   - `.env` explicitly declared in `.gitignore` to prevent database password exposure on GitHub.

### Phase 2: Live Database CRUD Logic (P1 - Priority)
1. **Mock Logic Deprecated**: In-memory arrays from Sprint 09 completely replaced with live Mongoose queries:
   - **`POST /posts`**: Executes `Post.create()` to inject documents into MongoDB.
   - **`GET /posts`**: Executes `Post.find()` with `.populate('authorId')` hydration.
   - **`GET /posts/:id`**: Executes `Post.findById()`.
   - **`PUT /posts/:id`**: Executes `Post.findByIdAndUpdate()`.
   - **`DELETE /posts/:id`**: Executes `Post.findByIdAndDelete()`.
2. **Automated QA Testing**:
   - 9 automated end-to-end integration tests written in `test/api.test.js` covering every CRUD operation, validation failure, hydration, and aggregation.
   - Ready-to-import Postman / Thunder Client collection in `thunder-tests/sprint10_collection.json`.

### Phase 3: Relational Modeling & Aggregation (P2 - Advanced)
1. **Relational Schema (`src/models/User.js`)**:
   - Architected author entity schema: `name`, `email` (unique), `role`, `avatar`, and `bio`.
   - Post schema mutated to reference User: `authorId: { type: ObjectId, ref: 'User' }`.
   - Querying posts utilizes `.populate('authorId', 'name email role avatar bio')` to automatically hydrate author profiles.
2. **MongoDB Aggregation Pipeline (`GET /posts/top-recent`)**:
   - Custom route executing a 5-stage aggregation pipeline:
     ```javascript
     Post.aggregate([
       { $sort: { createdAt: -1 } },
       { $limit: 3 },
       { $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'authorDetails' } },
       { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
       { $project: { title: 1, content: 1, category: 1, tags: 1, readTime: 1, likes: 1, createdAt: 1, author: '$authorDetails' } }
     ]);
     ```
   - Accurately returns the **Top 3 Most Recent Posts** with joined author information.

---

## 🧪 Verification & QA Demonstration Protocol (3 Min Max)

### 1. Frontend Demo (Redux DevTools Extension)
1. Run the frontend application:
   ```bash
   cd sprint_10/cine-stream-next
   npm run dev
   ```
2. Open `http://localhost:3000` in Google Chrome or Microsoft Edge.
3. Open Developer Tools (`F12`) and switch to the **Redux** tab.
4. **Demonstrate Favorites Mutation**: Click the Heart icon on any movie. Show `favorites/toggleFavorite` appearing in DevTools and the state tree mutating under `state.favorites.items`.
5. **Demonstrate Filter Mutation**: Move the Minimum Rating Slider to `7.5+`. Show `filter/setMinRating` dispatched with state updated in real-time.
6. **Demonstrate Theme Mutation**: Click the Sun/Moon toggle in the Navbar. Show `theme/toggleTheme` dispatched and the DOM switching between Dark and Light mode.
7. **Demonstrate State Persistence (FAQ 4)**: Hit `F5` (Hard Reload). Show that saved favorites and active theme survive page reloads via `localStorage`.

### 2. Fullstack Demo (Postman & MongoDB Atlas)
1. Run the backend server:
   ```bash
   cd sprint_10/the-data-hub-api
   npm start
   ```
2. Open **Postman** and import `sprint_10/the-data-hub-api/thunder-tests/sprint10_collection.json`.
3. Execute `7. Phase 2 CRUD Injection: Post.create()`. Verify `201 Created` status with populated author.
4. Open your **MongoDB Atlas Dashboard** &rarr; Database &rarr; Collections &rarr; `posts`. Show the newly created document persisted in the cloud.
5. In Postman, execute `6. Phase 3 Aggregation: Top 3 Most Recent Posts`. Show the 3 most recent documents sorted and joined with author information via the aggregation pipeline.
6. Run automated test suite:
   ```bash
   npm test
   ```
   Output: `🏁 TEST RESULTS: 9 PASSED | 0 FAILED`.
