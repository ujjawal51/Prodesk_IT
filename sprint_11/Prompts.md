# 🤖 Sprint 11: Corporate AI Interaction & Engineering Log

## Overview
This document logs the engineering prompts, architectural decisions, and verification steps conducted during Sprint 11 in compliance with residency standards.

---

## 📌 Prompt 1: Track A Testing Suite Configuration
- **Objective**: Configure Jest 29, jsdom, and React Testing Library within a Next.js environment.
- **Action**: Configured `jest.config.js` with `testEnvironment: 'jest-environment-jsdom'`, mapping module aliases and setting up `@testing-library/jest-dom` in `jest.setup.js`.
- **Validation**: Executed unit tests for `Button`, `Card`, and `Input` to confirm mounting without crashing and accurate text payload rendering.

---

## 📌 Prompt 2: Phase 2 Interaction & Event Testing
- **Objective**: Verify that user actions mutate the DOM correctly.
- **Criteria**:
  - Does the DOM correctly render the mutated integer upon clicking "Increment"?
  - Does the input field state update upon simulated keystrokes?
- **Action**: Authored `Counter.test.jsx` testing increment, decrement, reset, and boundary constraints; authored `Input.test.jsx` simulating typing events.

---

## 📌 Prompt 3: Phase 3 Explicit Network Layer Mocking
- **Objective**: Test asynchronous data hydration offline without requiring active internet connectivity.
- **Action**: Created `AsyncDataList.jsx` and mocked `global.fetch` in `AsyncDataList.test.jsx`. Verified dynamic loading state, successful JSON payload resolution, and error state handling on HTTP 500.

---

## 📌 Prompt 4: Track B Fullstack MERN System Integration
- **Objective**: Connect React/Vite SPA to Node.js/MongoDB REST API.
- **CORS Resolution**: Configured `cors` middleware package within Express to authorize client origin (`http://localhost:5173`).
- **Data Hydration**: Swapped dummy API endpoints with `http://localhost:5000/api/posts` fetched via `useEffect`.
- **Full CRUD Pipeline**: Implemented POST data injection form, PUT edit modal, and DELETE action with optimistic local DOM mutation.
- **State Management**: Built `LoadingSkeleton.jsx` and `ErrorBoundary.jsx`.

---

## 📌 Prompt 5: Multipart Architecture with Multer & Cloudinary
- **Strict Constraint**: "Do not save Base64 strings or binary files directly into MongoDB. Store the returned Cloudinary URL string in your database schema."
- **Frontend**: Dispatched `FormData` object with text fields and thumbnail image.
- **Backend**: Configured `multer` with `memoryStorage()` and streamed buffer via `cloudinary.uploader.upload_stream` using native Node `Readable.from(buffer)`.
- **Database**: Mongoose schema persists only the HTTPS Cloudinary CDN asset URL string with validation rejecting any Base64 strings.
