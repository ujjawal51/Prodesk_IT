# 🤖 Sprint 09 AI Prompt & Engineering Protocol Log

As mandated by corporate engineering policy, all LLM interactions, architectural validations, and debugging queries for Sprint 09 are cataloged below.

---

## 📋 Session 1: Next.js 15 App Router & Server/Client Delineation (Track A)

### Prompt 1.1: Server Component Initial Hydration
> **User/Dev**: "How do we execute the initial TMDB Popular Movies fetch directly within a Server Component without utilizing `useEffect`?"
> **LLM Response & Architecture Decision**:
> In Next.js 15 App Router, any component inside `app/` is by default an `async` Server Component. Data can be fetched asynchronously directly inside the component body using native `await fetch()`. Next.js executes this logic exclusively on the server before transmitting ready HTML and React Server Component (RSC) payloads to the client. This eliminates the classic client-side "fetch waterfall" and enables immediate search engine crawler indexing.
> **Implementation**: `src/app/page.jsx` declared as `async function HomePage()` calling `fetchPopularMoviesServer(1)`.

### Prompt 1.2: Dynamic Routing & `generateMetadata` in Next.js 15
> **User/Dev**: "How should dynamic metadata for `/movie/[id]` be generated in Next.js 15?"
> **LLM Response & Architecture Decision**:
> In Next.js 15, `params` passed to page components and `generateMetadata` is a Promise and must be resolved (`const { id } = await params`). The `generateMetadata` function queries `fetchMovieDetailsServer(id)` and returns a metadata descriptor with dynamic `<title>`, `<meta name="description">`, and OpenGraph media tags.
> **Implementation**: Created `src/app/movie/[id]/page.jsx` exporting `generateMetadata({ params })`.

### Prompt 1.3: Image Security Whitelisting
> **User/Dev**: "Why do TMDB images fail to load in Next.js `<Image />` component?"
> **LLM Response & Architecture Decision**:
> Next.js enforces strict domain security to prevent unauthorized image optimization attacks. Remote hostnames must be explicitly configured under `images.remotePatterns` inside `next.config.mjs`.
> **Implementation**: Added `image.tmdb.org` and `images.unsplash.com` to `next.config.mjs`.

---

## 📋 Session 2: Express RESTful Server Architecture & Middleware (Track B)

### Prompt 2.1: JSON Body Parsing in Express
> **User/Dev**: "Why is `req.body` undefined on incoming POST requests?"
> **LLM Response & Architecture Decision**:
> Node.js receives HTTP request payloads as incoming stream chunks. Express requires the built-in `express.json()` middleware to buffer and parse incoming `application/json` streams into JavaScript objects before hitting route handlers.
> **Implementation**: Mounted `app.use(express.json())` as global middleware in `server.js`.

### Prompt 2.2: Custom Timestamped Logger Interceptor
> **User/Dev**: "How do we architect custom middleware that logs `[METHOD] /path - HH:MM:SS AM/PM` to console?"
> **LLM Response & Architecture Decision**:
> Middleware interceptors in Express receive `(req, res, next)`. By inspecting `req.method`, `req.originalUrl`, and formatting `new Date().toLocaleTimeString('en-US')`, we log the exact timestamped request and then call `next()` to hand off control.
> **Implementation**: Implemented `src/middleware/logger.js` and mounted globally before route definitions.

### Prompt 2.3: Mock JWT Authentication Scaffolding
> **User/Dev**: "How do we build a mock JWT token issuer on `POST /login` without heavy database dependencies?"
> **LLM Response & Architecture Decision**:
> Architected a 3-part RFC 7519 compliant Base64Url token generator (`Header.Payload.Signature`) that accepts credentials and returns a signed-like Bearer token with user ID, role, and expiration timestamp.
> **Implementation**: `src/controllers/authController.js` and `src/middleware/auth.js`.
