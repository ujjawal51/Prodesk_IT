# 🤖 Sprint 10 AI Prompt & Engineering Protocol Log

As mandated by corporate engineering policy, all LLM interactions, architectural validations, and debugging queries for **Sprint 10** are cataloged below.

---

## 📋 Session 1: Redux Toolkit (RTK) Store Architecture & Slice Migration (Track A)

### Prompt 1.1: Refactoring Context API to Redux Toolkit Slice
> **User/Dev**: "How do we refactor an existing Context API shopping cart / favorites state manager into a dedicated Redux Toolkit (RTK) Slice without causing prop drilling or breaking client components?"
> **LLM Response & Architecture Decision**:
> In modern React applications, Redux Toolkit (`@reduxjs/toolkit`) replaces verbose boilerplate with `createSlice()`. We define an initial state containing `items: []` and actions (`addFavorite`, `removeFavorite`, `toggleFavorite`, `clearFavorites`). State mutations inside reducers use Immer under the hood for immutable transitions. A unified custom hook `useFavorites()` interfaces with `useAppDispatch()` and `useAppSelector()`, ensuring all existing components continue to function seamlessly while routing all actions through the Redux dispatcher.
> **Implementation**: `src/redux/slices/favoritesSlice.js`, `src/redux/store.js`, and `src/hooks/useFavorites.js`.

### Prompt 1.2: State Persistence Across Browser Refreshes (Technical FAQ 4)
> **User/Dev**: "Why does Redux global state disappear when the user refreshes the browser (F5), and how do we persist it without crashing SSR in Next.js 15 App Router?"
> **LLM Response & Architecture Decision**:
> Redux state resides in JavaScript memory (RAM), which is cleared whenever the browser reloads the page. To survive hard refreshes, we intercept state mutations via custom Redux middleware (`localStorageMiddleware`) that serializes active slices to `localStorage`. A client-side hydrator component (`ReduxStateHydrator`) dispatches `hydrateFavorites` upon mounting, avoiding Server-Side Rendering (SSR) hydration mismatch warnings in Next.js 15.
> **Implementation**: `src/redux/store.js` and `src/components/ReduxProvider.jsx`.

### Prompt 1.3: Redux DevTools Extension Integration & Verification
> **User/Dev**: "How do we guarantee that Redux DevTools extension can monitor state mutations in development and QA demo environments?"
> **LLM Response & Architecture Decision**:
> In RTK's `configureStore()`, `devTools: true` enables the browser extension bridge. Whenever actions like `favorites/toggleFavorite` or `filter/setMinRating` are dispatched, DevTools displays the action payload, state diff, and time-travel debugging slider.
> **Implementation**: Configured in `src/redux/store.js` and documented in `src/components/ReduxDevToolsGuideModal.jsx`.

---

## 📋 Session 2: Multifaceted Sidebar Filtering & Render Optimization (Track A)

### Prompt 2.1: Mapping Multifaceted Sidebar Filters to Global Redux State
> **User/Dev**: "How should multifaceted filters (Search, Genre pills, Rating range slider, Sort dropdown, and Year) be mapped into Redux to ensure immediate UI synchronization?"
> **LLM Response & Architecture Decision**:
> We architect a dedicated `filterSlice.js` with individual reducers for each parameter (`setSearchQuery`, `setCategory`, `setMinRating`, `setSortBy`, `setReleaseYear`, `resetFilters`). The multifaceted sidebar filter dispatches these actions, and the catalog feed consumes the unified filter selector. Because the filter state is global, other components (such as Navbar or AI Mood Matcher) can mutate filter parameters without prop drilling.
> **Implementation**: `src/redux/slices/filterSlice.js` and `src/components/SidebarFilter.jsx`.

### Prompt 2.2: Re-render Mitigation with `useMemo` and `useCallback`
> **User/Dev**: "Filtering large arrays of movies on every input stroke can trigger expensive DOM repaints. How do we guarantee high frame rates (60fps) during interactive filter adjustments?"
> **LLM Response & Architecture Decision**:
> We decouple filter text input using a 500ms debounce hook (`useDebounce`) and wrap the multi-stage filter and sort pipeline in `useMemo()`. This ensures the array filtering algorithm runs only when raw movies or filter criteria change, rather than on every parent component render. Furthermore, event handlers like `loadMore` and reset triggers are wrapped in `useCallback()` to maintain stable function references.
> **Implementation**: `src/components/MovieExplorerClient.jsx`.

### Prompt 2.3: Global Theme Manager (Dark / Light Mode)
> **User/Dev**: "How do we architect a Dark/Light mode theme manager controlled entirely by Redux state instead of ad-hoc CSS classes?"
> **LLM Response & Architecture Decision**:
> We create a `themeSlice.js` holding `mode: 'dark' | 'light'`. In `ClientShell.jsx`, a `useEffect` observer synchronizes `state.theme.mode` to `document.documentElement` (`data-theme="dark"` / `data-theme="light"`). CSS custom properties in `globals.css` smoothly adjust colors for both modes with a 0.25s ease transition.
> **Implementation**: `src/redux/slices/themeSlice.js`, `src/components/ClientShell.jsx`, and `src/app/globals.css`.

---

## 📋 Session 3: Mongoose ODM & MongoDB Atlas Provisioning (Track B)

### Prompt 3.1: Securing MongoDB Atlas Credentials (Technical FAQ 1 & 3)
> **User/Dev**: "How do we interface our Express server with MongoDB Atlas securely and prevent exposing credentials on GitHub?"
> **LLM Response & Architecture Decision**:
> Database connection strings containing passwords must never be committed. We define `MONGO_URI` in a local `.env` file, supply `.env.example` with placeholder credentials, and explicitly declare `.env` in `.gitignore`. For network access, Atlas must whitelist `0.0.0.0/0` (Allow Access from Anywhere) to avoid connection refused / timeout errors.
> **Implementation**: `src/config/db.js`, `.gitignore`, `.env.example`, and `.env`.

### Prompt 3.2: Strict Schema Typing for Post Model
> **User/Dev**: "How do we architect the Post model using Mongoose to enforce strict data types and automatic timestamps?"
> **LLM Response & Architecture Decision**:
> We define a Mongoose `Schema` with strict types: `title: String`, `content: String`, `category: String`, `tags: [String]`, `readTime: String`, `likes: Number`, and `isPublished: Boolean`. Passing `{ timestamps: true }` automatically generates `createdAt: Date` and `updatedAt: Date`.
> **Implementation**: `src/models/Post.js`.

### Prompt 3.3: Deprecating Mock Array Logic for Live Database CRUD
> **User/Dev**: "How do we refactor the Sprint 09 controllers from in-memory arrays to persistent Mongoose queries?"
> **LLM Response & Architecture Decision**:
> Replace array methods (`.push()`, `.find()`, `.splice()`) with native Mongoose ODM promises:
> - `POST /posts` executes `await Post.create(payload)`
> - `GET /posts` executes `await Post.find(query).sort(...)`
> - `GET /posts/:id` executes `await Post.findById(id)`
> - `PUT /posts/:id` executes `await Post.findByIdAndUpdate(id, update, { new: true, runValidators: true })`
> - `DELETE /posts/:id` executes `await Post.findByIdAndDelete(id)`
> **Implementation**: `src/controllers/postController.js`.

---

## 📋 Session 4: Relational Modeling & Aggregation Pipelines (Track B)

### Prompt 4.1: Relational Schema Architecture with `.populate()`
> **User/Dev**: "How do we establish a relational link between Posts and Authors, and how do we hydrate the author's payload upon querying?"
> **LLM Response & Architecture Decision**:
> We architect a `User` schema (`name`, `email`, `role`, `avatar`, `bio`). In the `Post` schema, we declare `authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }`. When querying posts, chaining `.populate('authorId', 'name email role avatar bio')` performs an automatic cross-collection join and replaces the raw ObjectId with the full author object.
> **Implementation**: `src/models/User.js`, `src/models/Post.js`, and `src/controllers/postController.js`.

### Prompt 4.2: MongoDB Multi-Stage Aggregation Pipeline for "Top 3 Most Recent Posts"
> **User/Dev**: "How do we implement a custom route that queries, sorts, and limits the database to return the 'Top 3 Most Recent Posts' using MongoDB Aggregation?"
> **LLM Response & Architecture Decision**:
> We construct a 5-stage MongoDB Aggregation Pipeline using `Post.aggregate()`:
> 1. `$sort: { createdAt: -1 }` (orders posts by newest first)
> 2. `$limit: 3` (restricts output strictly to top 3 documents)
> 3. `$lookup`: joins the `users` collection on `authorId === users._id`
> 4. `$unwind`: transforms the joined author array into an object
> 5. `$project`: projects cleaned fields with formatted author payload
> **Implementation**: Route `GET /posts/top-recent` in `src/routes/postRoutes.js` and `src/controllers/postController.js`.

### Prompt 4.3: Automated QA Test Suite
> **User/Dev**: "How do we automate end-to-end testing of our Mongoose models, CRUD routes, and aggregation pipeline?"
> **LLM Response & Architecture Decision**:
> We develop an automated Node.js test script (`test/api.test.js`) that boots an Express HTTP server instance, establishes a test connection to Mongoose, seeds relational Users and Posts, and executes 9 automated test assertions validating every route, schema validation, `.populate()` hydration, and the `$sort`/`$limit` aggregation pipeline.
> **Implementation**: `test/api.test.js`.
