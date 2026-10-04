# 🤖 Sprint 12: Corporate AI Interaction & Engineering Log

## Overview
This document logs the engineering prompts, architectural decisions, and verification steps conducted during **Sprint 12** in compliance with senior residency standards.

---

## 📌 Prompt 1: Track A Storybook Environment & Component Isolation
- **Theme**: Component Driven Development & Design Systems.
- **Objective**: Architect an isolated component library utilizing Storybook decoupled entirely from the primary Next.js runtime.
- **Action**:
  - Initialized `.storybook/` configuration directory with `main.js` and `preview.js`.
  - Configured `@storybook/nextjs` framework and static directory mapping to `../public`.
  - Solved **FAQ Q4** (Tailwind CSS in Storybook): Explicitly imported `../styles/globals.css` in `.storybook/preview.js` to hydrate styles inside the isolated Storybook iframe.
  - Solved **FAQ Q5** (Next.js Image errors in Storybook): Designed safe asset rendering supporting public assets (`/products/headphones.jpg`, `/products/smartwatch.jpg`) and configured `images.unoptimized` in `next.config.mjs`.
  - Architected three core isolated UI components and their sibling `.stories.jsx` files:
    1. `Button.jsx` & `Button.stories.jsx` (variants: primary, secondary, outline, danger, ghost; sizes: sm, md, lg; states: loading spinner, disabled, withIcon).
    2. `Input.jsx` & `Input.stories.jsx` (types: text, password with eye reveal/hide toggle, search, number; states: default, error, disabled, helperText).
    3. `ProductCard.jsx` & `ProductCard.stories.jsx` (real product imagery, discount badges, ratings, stock indicators, interactive cart actions).
- **Validation**: Next.js showcase app rendered on `:3000` and Storybook configured on `:6006`.

---

## 📌 Prompt 2: Track B Persistent Bi-directional WebSocket Architecture
- **Theme**: Real-Time Bidirectional Communication Pipelines.
- **Objective**: Replace standard client-polling HTTP requests with persistent bi-directional WebSockets utilizing Socket.IO.
- **Solved FAQ Q6 (WebSockets vs standard HTTP)**:
  - Configured persistent open TCP connection allowing instantaneous client/server duplex communication.
- **Solved FAQ Q7 (Explicit CORS Configuration)**:
  - WebSocket CORS policies differ from Express HTTP middleware policies.
  - Implemented explicit CORS instantiation in Socket.IO server:
    ```javascript
    const io = new Server(server, {
      cors: { origin: ['http://localhost:3000', 'http://localhost:5173'], methods: ['GET', 'POST'] }
    });
    ```
- **Solved FAQ Q8 (React 18 StrictMode Duplicate Payloads)**:
  - React 18 StrictMode double-invokes effects in development.
  - Implemented strict cleanup function in `useSocket.js`:
    ```javascript
    useEffect(() => {
      const socket = io(...);
      ...
      return () => {
        socket.disconnect();
      };
    }, []);
    ```
- **Solved FAQ Q9 (Selective vs Global Broadcasting)**:
  - Broadcast to all clients except sender: `socket.broadcast.emit('event', payload)` / `socket.to(room).emit(...)` (used for typing indicators and join/leave notices).
  - Broadcast globally including sender: `io.emit('event', payload)` / `io.to(room).emit(...)` (used for chat messages, active stats, and announcements).
- **Solved FAQ Q10 (Postman WebSocket Auditing)**:
  - Built interactive in-app audit modal documenting exact WebSocket connection URIs (`ws://localhost:5000/socket.io/?EIO=4&transport=websocket`) and Engine.IO handshake packets (`40` connect, `42["send_message", {...}]`).
- **Validation**: Created automated integration test suite in `test/socket.test.js` validating 5/5 criteria (handshake, ping-pong latency, global broadcast, selective broadcast, and disconnect cleanup).

---

## 📌 Prompt 3: Production Builds & Quality Assurance
- **Objective**: Ensure zero build failures, proper type hygiene, and consistent UI aesthetics.
- **Action**:
  - Ran automated integration test suite in `track-b-realtime/server` (5/5 tests passed).
  - Executed Vite production build in `track-b-realtime/client` (bundled in < 60s with 0 errors).
  - Formatted responsive, dark-mode cyberpunk design tokens adhering to high aesthetic standards.
