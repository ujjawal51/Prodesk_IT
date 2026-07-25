# ShopZone — E-Commerce Single Page Application (SPA)

A modern, fast, responsive E-Commerce Single Page Application built with **React**, **Vite**, **React Router v6**, and **Context API**.

---

## 📌 Project Overview

ShopZone is designed to give users a seamless online shopping experience without any browser page reloads. It fetches real-time product inventory from the DummyJSON REST API, supports category filtering and search, manages a persistent cart with INR currency conversion, and enforces client-side route protection.

- **Ticket / Sprint:** Sprint 06 — Engineering Residency
- **Tech Stack:** Vite + React + React Router DOM v6 + Context API + Vanilla CSS
- **Data Source:** [DummyJSON Products API](https://dummyjson.com/products)

---

## ✨ Features

### Phase 1: Base Routing Architecture (P0 - Mandatory)
- **Static Routing:**
  - `/` — Homepage featuring hero section, stats, and key highlights.
  - `/shop` — Product inventory grid with search & category filtering.
  - `/contact` — Interactive contact form with field validation.
- **Dynamic Routing:**
  - `/product/:id` — Product detail view using `useParams()` hook to fetch and display specific item details (gallery, rating, description, stock status).

### Phase 2: Global State Management (Priority 1)
- **Context API (`CartContext`):** Replaced prop drilling with a global state tree managing shopping cart operations.
- **Duplicate Prevention:** Automatically increments quantity if an item is added multiple times.
- **Navbar Integration:** Persistent Navbar across all routes with a dynamic cart badge that re-renders live on state updates.
- **Cart Page (`/cart`):** Detailed breakdown of items, unit prices (in ₹ INR), quantity controls, shipping thresholds, and tax calculation.

### Phase 3: Auth & Protection (Priority 2)
- **State Persistence:** Cart payload is automatically synced with `localStorage`, surviving hard browser refreshes.
- **Mock Authentication (`/login`):** Includes a "Login as Guest" flow toggling global user state.
- **Protected Routes (`/checkout`):** Route guard (`ProtectedRoute`) intercepts unauthorized access and redirects users to `/login`, preserving intended destination.
- **SPA Deployment Ready:** Configured with `vercel.json` rewrite rules to prevent 404 errors on direct route refreshes.

---

## 🗂️ Project Structure

```
sprint_6/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json           # SPA rewrite rules for Vercel deployment
├── Prompts.md            # AI prompt engineering & session logs
├── README.md
└── src/
    ├── main.jsx          # Entry point with BrowserRouter & Providers
    ├── App.jsx           # Route definitions & global layout
    ├── index.css         # Complete design system & custom tokens
    │
    ├── context/
    │   ├── CartContext.jsx   # Cart state & localStorage sync
    │   └── AuthContext.jsx   # Mock authentication state
    │
    ├── components/
    │   ├── Navbar.jsx        # Persistent navigation header
    │   ├── ProductCard.jsx   # Shop grid item card
    │   └── ProtectedRoute.jsx# Auth route guard wrapper
    │
    ├── utils/
    │   └── currency.js       # USD to INR conversion & formatting
    │
    └── pages/
        ├── HomePage.jsx
        ├── ShopPage.jsx
        ├── ProductPage.jsx
        ├── CartPage.jsx
        ├── ContactPage.jsx
        ├── LoginPage.jsx
        ├── CheckoutPage.jsx
        └── NotFoundPage.jsx
```

---

## 🚀 Getting Started

```bash
# 1. Clone or navigate to project directory
cd sprint_6

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

Dev server runs locally at: `http://localhost:5173`

---

## 🔧 Technical Details & Decisions

| Requirement | Solution |
|-------------|----------|
| Client-Side Routing | `<BrowserRouter>` with `<Routes>`, `<Route>`, `<Link>`, and `<NavLink>` |
| State Management | React Context API + `useReducer` (no Redux per sprint guidelines) |
| Currency | USD prices converted to INR (`₹`) using custom utility |
| Form Validation | Client-side check functions with inline error alerts |
| Vercel Deployment | `vercel.json` rewrite (`/* -> /index.html`) |

---

## 📑 Documentation

Per corporate residency guidelines, detailed prompt engineering & debugging logs are documented in [Prompts.md](./Prompts.md).
