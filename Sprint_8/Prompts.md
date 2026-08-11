# Corporate AI Policy & Debugging Session Log - Sprint 08

## Overview & Mandate Compliance
In compliance with the **"Learn, Don't Copy" Mandate**, this document records the pair-programming prompts, architectural trade-offs, debugging iterations, and technical validations for **Cine-Stream Media Explorer (Sprint 08)**.

---

## 1. Architectural Decisions & AI Session Prompts

### Session 1: State Management & Debouncing Architecture
- **Objective**: Implement single-source-of-truth state for movies, search query, debouncing, and infinite scroll pagination without introducing race conditions or infinite HTTP fetch loops.
- **Prompt Used**:
  > *"How do we design a React custom hook `useMovies` that integrates a 500ms debounced search query, handles infinite pagination appending (`page N+1`) with an IntersectionObserver sentinel, and gracefully handles network failure/API key absence?"*
- **Solution & Implementation**:
  - Created `useDebounce` hook wrapping `useEffect` + `setTimeout(500ms)`.
  - Structured `useMovies` state: reset items list to page 1 whenever `debouncedQuery` or `selectedGenre` changes; append items when `page` increments via `IntersectionObserver`.
  - Added strict initial mount dependency `useEffect(() => { fetchMovies() }, [debouncedQuery, selectedGenre, page])` to guarantee no infinite HTTP loops.

### Session 2: Native Infinite Scroll with `IntersectionObserver`
- **Objective**: Replace standard pagination with native browser `IntersectionObserver` attached to an invisible bottom target DOM element.
- **Prompt Used**:
  > *"Architect a lightweight `useInfiniteScroll` custom hook in React using `IntersectionObserver` API. Ensure the observer detaches cleanly on component unmount and doesn't re-trigger while fetching is active."*
- **Solution & Implementation**:
  - Created `useInfiniteScroll(callback, isLoading, hasMore)` which observes a sentinel element ref.
  - Added guard clauses: `if (isLoading || !hasMore) return`.
  - Attached observer root margin `200px` to trigger data prefetching slightly before the user reaches the absolute bottom.

### Session 3: State Persistence for Favorites (`localStorage`)
- **Objective**: Implement a global React Context `FavoritesContext` that syncs an array of movie payloads with browser `localStorage`.
- **Prompt Used**:
  > *"Design a robust context provider for saving/removing favorited movies in localStorage with instantaneous UI feedback and deduplication."*
- **Solution & Implementation**:
  - Used `useState` initialized with lazy JSON parsing from `localStorage.getItem('cine_favorites')`.
  - Added a `useEffect` observer syncing changes back to `localStorage`.
  - Implemented utility functions `addFavorite`, `removeFavorite`, `isFavorite(id)`.

### Session 4: AI "Mood Matcher" Integration
- **Objective**: Translate unstructured user emotion strings (e.g. *"I am feeling down but want an energetic superhero movie"*) into search keywords/genres using Gemini API with fallback NLP parsing.
- **Prompt Used**:
  > *"Implement a service module `geminiAi.js` that calls Google Gemini API to extract target movie titles or genres from natural language input. Provide a fallback heuristic when API key is unconfigured."*
- **Solution & Implementation**:
  - Created prompt engineer wrapper sending clear system instructions to Gemini: *"Return only comma-separated movie title suggestions for this mood string: ..."*.
  - Added local fallback key-word extractor mapping mood terms (sad, happy, action, sci-fi, dark) to relevant popular movie titles.

---

## 2. Technical FAQ Resolution Log

1. **TMDB Base CDN URL Concatenation**:
   - Concatenated relative poster paths (e.g. `/poster123.jpg`) with `https://image.tmdb.org/t/p/w500/poster123.jpg`.
   - Created safe fallback graphics for items missing poster images.

2. **Infinite HTTP Loop Prevention**:
   - Verified that all `useEffect` state triggers rely strictly on primitive values (`page`, `debouncedQuery`, `genreId`) rather than volatile object references.

3. **ISP Blockade & API Key Fallback**:
   - Built dual-tier fetching architecture: Live TMDB API -> Dynamic user API key override -> High-fidelity fallback movie dataset.

---

## 3. Verification & Self-Audit Checklist

- [x] **Debounced Search**: Verified 500ms delay before network dispatch.
- [x] **Infinite Scroll**: `IntersectionObserver` sentinel auto-appends `Page N+1`.
- [x] **Favorites State Persistence**: Persists in `localStorage` across refreshes.
- [x] **Native Asset Lazy Loading**: Image tags specify `loading="lazy"`.
- [x] **AI Mood Matcher**: Translates contextual mood inputs into rendered DOM grid results.
- [x] **Clean Architecture**: Modular React code, custom hooks, reusable context, high-fidelity dark UI.
