# 🎬 Cine-Stream | Next.js 15 Migration (Sprint 09 Track A)

Enterprise-grade migration of the Cine-Stream SPA from React/Vite (CSR) to **Next.js 15 App Router** featuring Server-Side Rendering (SSR), Server/Client Component isolation, dynamic route handling (`/movie/[id]`), dynamic `generateMetadata` SEO optimization, and TMDB image security whitelisting.

---

## 🌟 Key Technical Architecture

### 1. Server vs. Client Component Delineation
- **Server Components (Default - Zero Client JS bundle)**:
  - `src/app/page.jsx`: Executes direct server-side data fetching (`fetchPopularMoviesServer`) on initial hydration. Completely eliminates `useEffect` waterfall and CSR crawl delays for search engines.
  - `src/app/movie/[id]/page.jsx`: Executes dynamic server-side detail fetching with runtime caching and direct HTML document injection.
- **Client Components (`"use client"`)**:
  - `MovieExplorerClient.jsx`, `SearchBar.jsx` (500ms debounce), `MovieCard.jsx` (favoriting), `MoodMatcher.jsx` (AI emotion synthesis), and `FavoritesPage.jsx` (localStorage persistence).

### 2. Dynamic Routing & SEO Optimization
- **Route**: `app/movie/[id]/page.jsx`
- **Dynamic SEO Metadata**:
  ```javascript
  export async function generateMetadata({ params }) {
    const { id } = await params;
    const movie = await fetchMovieDetailsServer(id);
    return {
      title: `${movie.title} (${getYear(movie.release_date)}) | Cine-Stream`,
      description: movie.overview.substring(0, 160),
      openGraph: {
        title: movie.title,
        images: [{ url: getPosterUrl(movie.poster_path) }]
      }
    };
  }
  ```

### 3. Next.js Image Optimization
- Whitelisted `image.tmdb.org` in `next.config.mjs`:
  ```javascript
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }
    ]
  }
  ```
- Uses `<Image />` component with `sizes`, `priority`, and responsive breakpoints to guarantee zero layout shift.

---

## 🛠️ Running Locally

1. **Install Dependencies**:
   ```bash
   cd cine-stream-next
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build & Test Production Bundle**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🚀 Vercel Deployment

Deploy seamlessly to Vercel:
```bash
npx vercel
```
Or import GitHub repository into the Vercel Dashboard with Root Directory set to `Sprint_9/cine-stream-next`.
