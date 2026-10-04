# 🏆 Sprint 12: Enterprise Tooling — Component-Driven Design Systems & Real-Time Bidirectional Pipelines

Welcome to **Sprint 12**, the final technical milestone of the engineering sprint cycle prior to the Capstone Phase. This sprint introduces enterprise-grade tooling utilized by Senior Software Engineers across two dedicated tracks:

- **🎨 Track A: Frontend Specialists** — Component-Driven Development (CDD) and isolated design systems utilizing **Storybook** within **Next.js**.
- **⚡ Track B: Real-Time Developers** — Persistent, bidirectional WebSocket pipelines utilizing **Socket.IO**, strict **React 18** lifecycle cleanup, room routing, and broadcasting architectures.

---

## 📂 Project Architecture

```
Sprint_12/
├── README.md                            # Master Sprint 12 technical documentation & execution guide
├── Prompts.md                           # Corporate AI engineering interaction & prompt log
│
├── track-a-storybook/                   # 🎨 TRACK A: Isolated Component Library (Storybook + Next.js)
│   ├── package.json                     # Next.js 14, React 18, Storybook 8, Tailwind CSS
│   ├── next.config.mjs                  # Next.js configuration (unoptimized image runtime)
│   ├── tailwind.config.js               # Design system typography, colors, and layout tokens
│   ├── postcss.config.js                # PostCSS autoprefixer pipeline
│   ├── .storybook/
│   │   ├── main.js                      # Storybook Next.js framework & stories pattern
│   │   └── preview.js                   # Global CSS stylesheet import (FAQ Q4) & theme parameters
│   ├── public/
│   │   └── products/
│   │       ├── headphones.jpg           # AeroTune Pro ANC Headphones photography
│   │       └── smartwatch.jpg           # Vanguard Chrono Titanium Smartwatch photography
│   ├── styles/
│   │   └── globals.css                  # Enterprise design tokens, utilities & glassmorphism
│   └── src/
│       ├── app/
│       │   ├── layout.jsx               # Next.js root layout with typography & metadata
│       │   └── page.jsx                 # Live interactive Component Library Catalog showcase
│       └── components/
│           ├── Button.jsx               # Enterprise Button (variants, sizes, loading, disabled)
│           ├── Button.stories.jsx       # Storybook stories for Button component
│           ├── Input.jsx                # Input field (password reveal toggle, search, error, helper)
│           ├── Input.stories.jsx        # Storybook stories for Input component
│           ├── ProductCard.jsx          # Product Card with image preview, stock & cart triggers
│           └── ProductCard.stories.jsx  # Storybook stories for ProductCard component
│
└── track-b-realtime/                    # ⚡ TRACK B: Bi-directional WebSocket / Socket.IO Pipeline
    │
    ├── server/                          # 🚀 Node.js + Express + Socket.IO Gateway Server
    │   ├── package.json                 # Express, Socket.IO 4.x, CORS, Dotenv
    │   ├── package-lock.json            # Installed dependency lockfile
    │   ├── server.js                    # HTTP server, Socket.IO binding, REST health endpoints
    │   ├── .env                         # Local runtime environment
    │   ├── .env.example                 # Environment variables blueprint
    │   ├── src/
    │   │   ├── config/
    │   │   │   └── cors.js              # Explicit WebSocket CORS configuration (FAQ Q7)
    │   │   ├── store/
    │   │   │   └── chatStore.js         # In-memory store for active users, rooms & message buffer
    │   │   ├── socket/
    │   │   │   └── socketHandler.js     # Bi-directional event handlers (FAQ Q9 broadcasting)
    │   │   └── utils/
    │   │       └── messageFormatter.js  # Payload schema, timestamps & UUID generation
    │   └── test/
    │       └── socket.test.js           # Automated integration test suite (5/5 tests passing)
    │
    └── client/                          # ⚡ React 18 + Vite Real-Time Dashboard
        ├── package.json                 # React 18, Vite 5, Lucide-React, Socket.IO-Client
        ├── vite.config.js               # Vite development server configuration
        ├── index.html                   # HTML shell with Google Fonts
        └── src/
            ├── index.css                # Cyberpunk dark mode design system & animations
            ├── main.jsx                 # React root wrapped in React.StrictMode
            ├── App.jsx                  # Master real-time workspace orchestrator
            ├── hooks/
            │   └── useSocket.js         # StrictMode cleanup socket hook (FAQ Q8)
            └── components/
                ├── Navbar.jsx           # Gateway status, RTT latency & Postman modal trigger
                ├── RoomSelector.jsx     # Active channels (#general, #dev-ops, #leads)
                ├── ActiveUsers.jsx      # Live room members & cluster node presence
                ├── ChatWindow.jsx       # Real-time message bubbles & typing indicators
                ├── MessageInput.jsx     # Payload dispatcher with selective/global actions
                └── PostmanGuide.jsx     # Interactive Postman WebSocket audit modal (FAQ Q10)
```

---

## 🎨 Track A: Frontend Specialists (Storybook Component Library)

### Engineering Theme: Component Driven Development & Design Systems
In enterprise engineering teams (e.g., Spotify, Airbnb), UI components are constructed in complete isolation from the main application matrix to guarantee reusability, testability, and visual consistency.

### Phase 1: Environment Configuration & Base MVP (P0 - Mandatory)
1. **Storybook Configuration**:
   - Initialized `.storybook/` with `main.js` and `preview.js`.
   - Enabled `@storybook/nextjs` framework integration.
   - Decoupled Storybook development server binds to `http://localhost:6006`.
2. **Three Core Isolated Components**:
   - **`Button.jsx` & `Button.stories.jsx`**:
     - *Variants*: `primary`, `secondary`, `outline`, `danger`, `ghost`
     - *Sizes*: `sm`, `md`, `lg`
     - *States*: `isLoading` (animated spinner), `disabled`, `icon`
     - *Controls*: Full interactive controls table with action logger.
   - **`Input.jsx` & `Input.stories.jsx`**:
     - *Variants*: Standard text, search field with prefix icon, password with show/hide toggle, number.
     - *States*: `default`, `focused`, `error` (validation error feedback), `disabled`, `helperText`.
   - **`ProductCard.jsx` & `ProductCard.stories.jsx`**:
     - *Photography*: Integrates real photography (`/products/headphones.jpg`, `/products/smartwatch.jpg`).
     - *Features*: Promotional ribbons (`BESTSELLER`, `20% OFF`, `LIMITED`), star ratings, dynamic discount calculation, stock indicators (`In Stock`, `Sold Out`), and interactive "Add to Cart" action with delivery ack.

### How to Run Track A:
```bash
# 1. Launch Storybook Component Explorer (Port 6006)
cd Sprint_12/track-a-storybook
npm run storybook

# 2. Launch Next.js Showcase Application (Port 3000)
npm run dev
```

---

## ⚡ Track B: Real-Time Developers (WebSockets & Socket.IO Pipeline)

### Engineering Theme: Persistent Bi-directional Event-Driven Systems
Standard HTTP request/response polling creates latency and excessive server overhead. Track B replaces polling with persistent, duplex TCP connections.

### Key Architectural Solutions:
1. **FAQ Q7: Explicit CORS Configuration**:
   WebSocket CORS policies are distinct from Express HTTP middleware policies. The Socket server is instantiated with an explicit CORS configuration:
   ```javascript
   const io = new Server(httpServer, {
     cors: {
       origin: ['http://localhost:3000', 'http://localhost:5173', '*'],
       methods: ['GET', 'POST']
     }
   });
   ```
2. **FAQ Q8: StrictMode Duplicate Payload Elimination**:
   React 18 `StrictMode` invokes effects twice in development. To prevent duplicate connections and double message rendering, `useSocket.js` enforces a strict cleanup return:
   ```javascript
   useEffect(() => {
     const socketInstance = io(SERVER_URL, ...);
     ...
     return () => {
       socketInstance.disconnect(); // Strict cleanup kills ghost socket
     };
   }, []);
   ```
3. **FAQ Q9: Selective vs. Global Broadcasting**:
   - **Exclude Sender**: `socket.broadcast.emit('event', payload)` (or `socket.to(room).emit(...)`) used for typing indicators and member join/leave notifications.
   - **Include Sender**: `io.emit('event', payload)` (or `io.to(room).emit(...)`) used for room chat messages, active user counts, and cluster-wide alerts.
4. **FAQ Q10: Postman WebSocket Auditing**:
   - Postman (v8.5+) supports native WebSocket connections.
   - URL: `ws://localhost:5000/socket.io/?EIO=4&transport=websocket`
   - Initial handshake: Send packet `40`.
   - Message dispatch: Send packet `42["send_message", {"text": "Auditing", "room": "general"}]`.

### Automated WebSocket Test Suite Results:
Run the integration test suite in `server/`:
```bash
cd Sprint_12/track-b-realtime/server
npm test
```
**Test Results:**
```
🧪 Starting Sprint 12 WebSocket / Socket.IO Integration Tests...

▶ Test 1: Bi-directional Persistent Handshake (Client A & Client B)
  ✓ Both Client A and Client B connected via WebSockets.

▶ Test 2: Latency Ping-Pong Roundtrip
  ✓ Roundtrip latency verified: 5ms

▶ Test 3: Global Broadcast (io.emit) across Room
  ✓ io.emit verified: Both sender and receiver received chat payload.

▶ Test 4: Selective Broadcast (socket.broadcast.emit / typing indicator)
  ✓ socket.broadcast verified: Client B received typing event, sender Client A was excluded.

▶ Test 5: Clean Disconnection & React 18 Cleanup Simulation
  ✓ Clean disconnect validated: Server notified room: "Engineer_Alpha disconnected."

====================================================
✅ All 5/5 WebSocket Integration Tests Passed Successfully!
====================================================
```

### How to Run Track B:
```bash
# 1. Launch Gateway Server (Port 5000)
cd Sprint_12/track-b-realtime/server
npm start

# 2. Launch React 18 Client (Port 5173)
cd Sprint_12/track-b-realtime/client
npm run dev
```

---

## ❓ Sprint 12 Technical FAQ (Master Reference)

| # | Question | Engineering Answer & Implementation |
|---|---|---|
| **1** | What exactly is the Storybook runtime? | A decoupled development environment for UI components. It executes entirely outside of your primary application runtime, serving as an isolated catalog for UI modules. |
| **2** | Do I need to initialize a completely new repository? | No. Execute `npx storybook@latest init` directly within your existing Next.js directory. It generates a `.storybook/` configuration directory. |
| **3** | What constitutes a `.stories.jsx` file? | A configuration file dictating how Storybook renders a specific component. Every UI component (e.g., `Button.jsx`) requires a sibling stories file (e.g., `Button.stories.jsx`). |
| **4** | How does Storybook interpret Tailwind CSS? | Storybook renders components in an isolated iframe detached from global CSS. You must explicitly import your stylesheet (`import '../styles/globals.css';`) in `.storybook/preview.js`. |
| **5** | Next.js `<Image>` components are throwing errors in Storybook. | Next.js images rely on specific server-side optimization runtimes. Configure the `@storybook/nextjs` framework addon and enable `unoptimized: true` in `next.config.mjs`. |
| **6** | What distinguishes WebSockets from standard HTTP? | WebSockets maintain a persistent, open TCP connection between client and server, enabling real-time, bi-directional data flow without requiring continuous polling. |
| **7** | I am facing a CORS block utilizing Socket.io. | Pass an explicit CORS configuration object during Socket server instantiation: `const io = new Server(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });`. |
| **8** | My React client is rendering duplicate chat payloads. | React 18 `StrictMode` double-invokes effects in dev. Implement a strict `useEffect` cleanup function: `return () => socket.disconnect();`. |
| **9** | How do I broadcast payloads to all clients except the sender? | Use `socket.broadcast.emit('event', payload)` (or `socket.to(room).emit`). To broadcast globally including the sender, execute `io.emit('event', payload)`. |
| **10** | Can WebSocket endpoints be audited via Postman? | Yes. Configure a "New WebSocket Request" in Postman and connect directly to your server URI: `ws://localhost:5000/socket.io/?EIO=4&transport=websocket`. |

---

## ✅ Quality & Verification Checklist
- [x] `.storybook/main.js` and `.storybook/preview.js` configured with Next.js framework
- [x] Tailwind CSS imported in `.storybook/preview.js` for isolated iframe rendering
- [x] Next.js `<Image>` asset handling verified without runtime exceptions
- [x] 3 Core UI Components engineered (`Button`, `Input`, `ProductCard`)
- [x] 3 Sibling `.stories.jsx` files created with comprehensive variants, args & controls
- [x] Real product assets utilized (`headphones.jpg`, `smartwatch.jpg`)
- [x] Next.js interactive showcase catalog built in `src/app/page.jsx`
- [x] Node.js + Express + Socket.IO server configured with explicit CORS
- [x] `socket.broadcast.emit` verified (selective peer broadcast excluding sender)
- [x] `io.emit` verified (global cluster broadcast including sender)
- [x] Custom `useSocket` React hook created with strict React 18 cleanup
- [x] Interactive Postman WebSocket audit guide modal built into client
- [x] Automated WebSocket test suite written in `test/socket.test.js` (5/5 tests passing)
- [x] Client production build verified (`npm run build` succeeds in < 60s)
