# Prompts.md — AI Debugging Sessions Log

**Project:** ShopZone SPA — Sprint 06  
**Engineer:** Prodesk IT Engineering Residency  
**Mandate:** Corporate AI Policy — "Learn, Don't Copy"  
> AI (Claude/Gemini) used as a pair-programmer to explain architectural patterns or debug error logs only. All execution logic written and understood by the developer.

---

## Session 1 — Architecture Design: Context API vs Redux

**Date:** Sprint 06 Week  
**Problem:** How should global cart state be managed across multiple routes without prop drilling?

**Prompt used:**
> "Explain the difference between Context API + useReducer and Redux for managing global state in a React SPA. When should I use one over the other?"

**AI Explanation (summarized):**
- Context API + `useReducer` is sufficient for small-to-medium apps with one or two global state slices.
- Redux adds middleware (thunks, sagas), DevTools, and boilerplate — overkill for this use case.
- For ShopZone: `CartContext` with `useReducer` handles all ADD/REMOVE/INCREMENT/DECREMENT actions cleanly.

**My understanding & decision:**
Used `createContext` + `useReducer` pattern. The reducer has a `switch` statement with explicit action types. I wrote the entire reducer logic myself after understanding the pattern.

---

## Session 2 — Bug: useEffect Firing Twice in Development

**Date:** Sprint 06 Week  
**Problem:** `useEffect` in `ShopPage.jsx` was fetching the API twice on initial load.

**Prompt used:**
> "Why does useEffect fire twice on initial render in React 19? Is this a bug?"

**AI Explanation (summarized):**
- This is caused by `<React.StrictMode>` in `main.jsx`.
- In development, StrictMode intentionally mounts → unmounts → remounts components to expose side-effect bugs.
- It does NOT happen in the production Vercel build.
- Fix: Use a `cancelled` flag inside the effect and check it before setting state.

**My fix (written by me):**
```js
useEffect(() => {
  let cancelled = false
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setProducts(data.products)
    })
  return () => { cancelled = true }
}, [])
```
This is the cleanup function pattern — prevents state updates on unmounted components.

---

## Session 3 — Architecture: Protected Routes Pattern

**Date:** Sprint 06 Week  
**Problem:** How to intercept unauthorized users navigating to `/checkout` and redirect them to `/login`?

**Prompt used:**
> "Explain how to implement protected routes in React Router v6. How do I redirect the user back to their intended destination after they log in?"

**AI Explanation (summarized):**
- Create a `ProtectedRoute` wrapper component.
- Use `<Navigate to="/login" replace />` when `isLoggedIn` is false.
- To redirect back after login, pass `location` via `state` in `Navigate`, and read it in `LoginPage` using `useLocation()`.

**My implementation:**
```jsx
// ProtectedRoute.jsx
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}
```
Used `replace` to avoid broken back-button history. Understood the difference between `push` and `replace` in router history.

---

## Session 4 — Bug: Vercel 404 on Route Refresh

**Date:** Sprint 06 Week  
**Problem:** Deployed app shows 404 when refreshing `/shop` or `/product/5` on Vercel.

**Prompt used:**
> "Why does my React SPA show 404 on Vercel when I refresh a specific route like /shop?"

**AI Explanation (summarized):**
- Vercel's server looks for a physical file matching `/shop`. No such file exists — it's a client-side route.
- Fix: Create `vercel.json` with a rewrite rule that sends all requests to `/index.html`.

**My fix:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
This tells Vercel: "For any path, serve `index.html` — let React Router handle the routing client-side."

---

## Session 5 — Pattern: Duplicate Items in Cart

**Date:** Sprint 06 Week  
**Problem:** Clicking "Add to Cart" multiple times on the same product creates duplicate entries instead of incrementing quantity.

**Prompt used:**
> "In my cart useReducer, when ADD_TO_CART is dispatched, how do I check if the item already exists and increment quantity instead of pushing a duplicate?"

**AI Explanation (summarized):**
- Before pushing a new item to the array, use `state.cartItems.find(item => item.id === action.payload.id)`.
- If found → map over array and increment `quantity` key.
- If not found → spread existing array and push new item with `quantity: 1`.

**My implementation:**
```js
case 'ADD_TO_CART': {
  const existing = state.cartItems.find(item => item.id === action.payload.id)
  if (existing) {
    return {
      ...state,
      cartItems: state.cartItems.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }
  }
  return {
    ...state,
    cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
  }
}
```

---

*This file documents AI-assisted learning sessions. All code in the repository was written and understood by the developer.*
