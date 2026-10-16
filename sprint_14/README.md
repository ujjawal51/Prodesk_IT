# 🔐 Sprint 14 — Walking Skeleton: Authentication System

> **Engineering Objective**: Implement a secure, end-to-end authentication pipeline using JWT, bcryptjs, MongoDB, Next.js App Router, and Zustand state management.

---

## 📁 Project Structure

```
sprint_14/
├── track-a-frontend/          # Next.js 14 — Track A (Frontend Specialists)
│   ├── app/
│   │   ├── layout.js          # Root layout with Inter font
│   │   ├── globals.css        # Premium dark theme CSS
│   │   ├── page.js            # Landing page (/)
│   │   ├── login/
│   │   │   └── page.js        # Login form (/login)
│   │   ├── register/
│   │   │   └── page.js        # Register form (/register)
│   │   └── dashboard/
│   │       └── page.js        # Protected dashboard (/dashboard)
│   ├── store/
│   │   └── authStore.js       # Zustand global auth store
│   ├── lib/
│   │   └── api.js             # Axios API service + interceptors
│   ├── middleware.js           # Next.js route guard middleware
│   ├── next.config.js
│   └── package.json
│
└── track-b-backend/           # Node.js + Express — Track B (Fullstack)
    ├── src/
    │   ├── models/
    │   │   └── User.js        # Mongoose schema + bcryptjs hashing
    │   ├── controllers/
    │   │   └── authController.js  # register, login, getMe, logout
    │   ├── routes/
    │   │   └── authRoutes.js  # /api/auth/* routes
    │   ├── middleware/
    │   │   ├── authMiddleware.js  # JWT protect + RBAC authorize
    │   │   └── errorMiddleware.js # Global error handler
    │   └── utils/
    │       └── jwtUtils.js    # generateToken, verifyToken
    ├── server.js              # Express app entry point
    ├── .env.example
    └── package.json
```

---

## 🚀 How to Run

### Backend (Track B)
```bash
cd track-b-backend

# 1. Install dependencies
npm install

# 2. Create .env file (copy from .env.example)
copy .env.example .env
# Edit .env → add your MongoDB URI

# 3. Start development server
npm run dev
# Server runs on: http://localhost:5000
```

### Frontend (Track A)
```bash
cd track-a-frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# App runs on: http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET`  | `/api/health` | Public | Server health check |
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login + get JWT |
| `GET`  | `/api/auth/me` | 🔒 Private | Get current user |
| `POST` | `/api/auth/logout` | 🔒 Private | Logout |

---

## 🗺️ Frontend Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Guest only | Login form |
| `/register` | Guest only | Registration form |
| `/dashboard` | 🔒 Protected | User dashboard |

---

## ✅ Phase Completion Checklist

### Track B — Backend (Fullstack)
- [x] **P0** — User schema: Email, Password, Name (Mongoose)
- [x] **P0** — bcryptjs: Salt + hash password in `pre('save')` hook
- [x] **P1** — `POST /api/auth/register` endpoint
- [x] **P1** — `POST /api/auth/login` endpoint with JWT response
- [x] **P2** — Express middleware: parse Bearer header, verify JWT
- [x] **P2** — Protected routes with `protect` middleware

### Track A — Frontend (Next.js)
- [x] **P0** — `/login`, `/register`, `/dashboard` routes (App Router)
- [x] **P0** — Login and Register forms with state management
- [x] **P1** — POST to backend API via Axios
- [x] **P1** — JWT persisted in localStorage via Zustand
- [x] **P2** — Next.js middleware: unauthenticated → redirect to `/login`
- [x] **P2** — Zustand global store: Name, Email, UID serialized

---

## 🔒 Security Notes

- Passwords are **NEVER stored in plain text** (bcrypt salt factor: 12)
- JWT tokens include `issuer` and `audience` claims
- Expired/invalid tokens trigger automatic redirect to `/login`
- Password field uses `select: false` in Mongoose (never returned in queries)
- CORS configured to allow only the frontend origin

---

## 👥 Tracks

| Track | Target | Theme |
|-------|--------|-------|
| **Track A** | Frontend Specialists | Next.js Auth Architecture & Route Guards |
| **Track B** | Fullstack Developers | Node.js Secure Auth & JWT Integration |
