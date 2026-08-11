# 🍿 Cine-Stream Media Explorer | Sprint 08

Cine-Stream is an enterprise-optimized, high-fidelity Netflix-lite Single Page Application (SPA) built with **React 18**, **Vite**, **React Router DOM**, and native browser web APIs (**IntersectionObserver**). It consumes the **TMDB (The Movie Database) REST API** and incorporates performance throttling, state persistence, native asset lazy loading, and an AI-powered **Mood Matcher**.

---

## 🌟 Key Features

### Phase 1: Base Architecture & API Consumption (P0)
- **TMDB API Integration**: Consumes popular (`/movie/popular`) and search (`/search/movie`) endpoints.
- **High-Fidelity Netflix Theme**: Custom dark mode UI built with glassmorphic cards, Google Fonts (Outfit & Inter), smooth keyframe animations, and Netflix-neon accents.
- **Responsive Media Grid**: Renders poster image, title, release year, and star rating badge (`★ 8.5/10`).

### Phase 2: Performance Mastery & Persistence (P1)
- **Input Debouncing (500ms)**: Throttles search input with custom `useDebounce` hook to eliminate keystroke network spam.
- **Native Infinite Scroll**: Built using native browser `IntersectionObserver` attached to an invisible sentinel `<div>` at the bottom of the DOM grid. Automatically fetches and appends `Page N+1` on scroll intersection.
- **State Persistence (Favorites)**: Heart toggle button on cards & detail modals synced with browser `localStorage`. Dedicated `/favorites` page with live filtering and badge counters.

### Phase 3: AI Architecture & Asset Optimization (P2)
- **Native Asset Lazy Loading**: All poster `<img>` nodes use `loading="lazy"` to ensure media downloads only when intersecting the viewport.
- **AI "Mood Matcher" Integration**: Contextual search modal powered by **Google Gemini API** (with local NLP fallback heuristic). Translates natural language emotions (e.g. *"I am feeling stressed and want an inspiring space movie"*) into search targets.

---

## 📁 Directory Structure

```
Sprint_8/
├── .env.example              # Environment variables template
├── Prompts.md                # Corporate AI Policy debugging & prompt log
├── README.md                 # Project documentation
├── index.html                # Main HTML layout
├── package.json              # Project dependencies & scripts
├── vite.config.js            # Vite build configuration
└── src/
    ├── App.jsx               # Router & Context Providers
    ├── index.css             # Netflix design system & CSS variables
    ├── main.jsx              # Application entry point
    ├── components/
    │   ├── ApiKeyModal.jsx   # Settings modal for dynamic API key input
    │   ├── MoodMatcher.jsx   # AI prompt input modal
    │   ├── MovieCard.jsx     # Media card with lazy loading & heart action
    │   ├── MovieGrid.jsx     # CSS Grid & IntersectionObserver sentinel
    │   ├── MovieModal.jsx    # Movie details modal with hero backdrop
    │   ├── Navbar.jsx        # Navigation bar with badges & links
    │   ├── SearchBar.jsx     # 500ms debounced search input
    │   └── SkeletonCard.jsx  # Shimmer placeholder
    ├── context/
    │   └── FavoritesContext.jsx # LocalStorage synced Context API
    ├── hooks/
    │   ├── useDebounce.js    # 500ms throttling hook
    │   ├── useInfiniteScroll.js # IntersectionObserver hook
    │   └── useMovies.js      # Data fetching & state manager
    ├── pages/
    │   ├── FavoritesPage.jsx # Saved favorites view
    │   ├── HomePage.jsx      # Hero section & trending grid
    │   └── NotFoundPage.jsx  # Custom 404 page
    ├── services/
    │   ├── geminiAi.js       # Gemini API client
    │   └── tmdbApi.js        # TMDB & fallback API client
    └── utils/
        ├── constants.js      # Base CDN URLs & genre mappings
        └── helpers.js        # Data formatters & poster URL concater
```

---

## 🛠️ Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   cd Sprint_8
   npm install
   ```

2. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env`:
   ```env
   VITE_TMDB_KEY=your_tmdb_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   *Note: If no API key is provided, Cine-Stream operates using a built-in high-fidelity fallback dataset.*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🎥 QA Demo & Verification Checklist
- [x] **Debounced Search**: Typing delays network request by 500ms.
- [x] **Infinite Scroll**: Scrolling to the bottom automatically triggers `Page N+1` fetch and appends items.
- [x] **Favorites Persistence**: Favoriting items persists in `localStorage` across browser refreshes.
- [x] **AI Mood Matcher**: Translates contextual mood strings into active TMDB query results.
