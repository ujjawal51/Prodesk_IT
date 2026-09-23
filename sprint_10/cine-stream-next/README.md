# 🎬 Cine-Stream (Sprint 10 Track A: Frontend Specialists)

Enterprise-grade streaming discovery application built with **Next.js 15 App Router** and powered by an **Advanced State Architecture using Redux Toolkit (RTK)**.

---

## 🎯 Engineering Objectives Achieved

### Phase 1: Global Store Initialization (P0 - Mandatory)
- **RTK Setup**: Integrated `@reduxjs/toolkit` and `react-redux` into Next.js 15 App Router.
- **Store Architecture**: Instantiated global store via `configureStore` with Redux DevTools extension enabled.
- **Slice Migration**: Completely refactored favorites out of legacy Context API into dedicated `favoritesSlice.js` with actions (`addFavorite`, `removeFavorite`, `toggleFavorite`, `clearFavorites`, `hydrateFavorites`).
- **RAM State Persistence (FAQ 4)**: Synced global store with `localStorage` via custom middleware and client hydrator so saved titles survive hard page refreshes (F5).

### Phase 2: Complex Filtering & State Sync (P1 - Priority)
- **UI Architecture**: Implemented a multifaceted sidebar filter (`SidebarFilter.jsx`) featuring:
  - Real-time text search
  - Category / Genre pills selection
  - Dynamic Minimum Rating Range Slider (0.0 to 9.5 stars)
  - Release Year / Era filtering (2024, 2023, 2020s, Classics)
  - Sort By selector (Most Popular, Highest Rated, Newest, Title A-Z)
  - Active filters badge counter and instant Reset button
- **Global Filter State**: Active filter parameters mapped to global `filterSlice.js`. When any filter is mutated, the main UI grid reflects the state change instantaneously.

### Phase 3: Render Optimization & Theming (P2 - Advanced)
- **Re-render Mitigation**: Implemented `useMemo` in `MovieExplorerClient.jsx` to memoize the computationally expensive multi-criteria filtering and sorting pipeline. Handlers wrapped in `useCallback` to guarantee smooth 60fps frame rates during user interactions.
- **Global Theming**: Architected a global Theme Manager (`themeSlice.js`) controlling Dark and Light modes entirely through Redux. Synchronizes `data-theme` and theme classes to the document root with smooth transitions.

---

## 📂 Project Architecture

```
sprint_10/cine-stream-next/
├── README.md                  # This file
├── package.json               # Next.js 15, React 19, @reduxjs/toolkit, react-redux
├── next.config.mjs            # TMDB remote image whitelist
├── .env.example               # Keys template
├── .env.local                 # Local environment keys
└── src/
    ├── app/
    │   ├── layout.jsx         # Root layout with fonts & ClientShell
    │   ├── page.jsx           # Server Component: Direct TMDB SSR fetch
    │   ├── loading.jsx        # Suspense skeleton loader
    │   ├── not-found.jsx      # Custom 404 page
    │   ├── error.jsx          # Error boundary
    │   ├── globals.css        # Dark & Light theme tokens and sidebar styling
    │   ├── favorites/
    │   │   └── page.jsx       # Redux-powered favorites view
    │   └── movie/[id]/
    │       ├── page.jsx       # Dynamic route with generateMetadata
    │       └── MovieDetailActions.jsx # Redux favorite toggle & actions
    ├── redux/
    │   ├── store.js           # configureStore with DevTools & localStorage middleware
    │   ├── hooks.js           # useAppDispatch & useAppSelector
    │   └── slices/
    │       ├── favoritesSlice.js # Favorites/Cart migration slice
    │       ├── filterSlice.js    # Complex multifaceted filter slice
    │       └── themeSlice.js     # Dark/Light mode theme manager slice
    ├── components/
    │   ├── ReduxProvider.jsx     # Store wrapper & client-side hydration
    │   ├── ClientShell.jsx       # Shell syncing DOM theme attribute
    │   ├── Navbar.jsx            # Redux badge counter, theme toggle, DevTools guide
    │   ├── SidebarFilter.jsx     # Multifaceted sidebar filter
    │   ├── MovieExplorerClient.jsx # useMemo/useCallback filtered grid
    │   ├── MovieCard.jsx         # Card with Redux favorite toggle
    │   ├── ReduxDevToolsGuideModal.jsx # In-app QA demo verification guide
    │   ├── HeroBanner.jsx        # Featured movie spotlight
    │   ├── MoodMatcher.jsx       # AI emotion movie finder modal
    │   └── SkeletonGrid.jsx      # Shimmer skeleton loader
    ├── hooks/
    │   ├── useFavorites.js       # Refactored Redux consumer hook
    │   ├── useDebounce.js        # Throttling hook
    │   └── useInfiniteScroll.js  # Sentinel intersection observer
    ├── services/
    │   ├── tmdbServer.js         # Direct SSR fetcher
    │   └── tmdbClient.js         # Client-side search & pagination
    └── utils/
        ├── constants.js          # Curated genres & fallback catalog
        └── helpers.js            # Formatters
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
cd sprint_10/cine-stream-next
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```
Add your TMDB API Key if desired (a built-in high-quality offline catalog fallback is also provided).

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Redux DevTools QA Verification (3 Min Demo Protocol)

As required by Sprint 10 Submission Guidelines:
1. Open **Chrome / Edge Developer Tools** (`F12` or Right Click &rarr; Inspect).
2. Select the **Redux** tab.
3. **Verify Slice 1 (Favorites)**:
   - Click the **Heart Icon** on any movie card.
   - Observe `favorites/toggleFavorite` or `favorites/addFavorite` action dispatched in Redux DevTools inspector tree.
   - Observe state mutate under `state.favorites.items`.
4. **Verify Slice 2 (Multifaceted Filters)**:
   - Move the **Minimum Rating Slider** to `7.5+`.
   - Observe `filter/setMinRating` dispatched with payload `7.5`.
   - Select a Genre pill (e.g., *Action*).
   - Observe `filter/setCategory` dispatched and main grid instantly reflects only 7.5+ Action movies.
5. **Verify Slice 3 (Global Theming)**:
   - Click the **Sun / Moon** button in the Navbar.
   - Observe `theme/toggleTheme` dispatched and theme smoothly toggles between Dark and Light mode.
6. **Verify State Persistence (FAQ 4)**:
   - Press **F5 (Hard Reload)**.
   - Observe that saved favorites and selected theme persist without resetting to defaults.
