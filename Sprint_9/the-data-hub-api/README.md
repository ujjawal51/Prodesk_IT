# ⚡ The Data Hub | RESTful API Server (Sprint 09 Track B)

Enterprise Node.js & Express RESTful API server implementing standard REST architecture, in-memory CRUD operations, custom timestamped request logging middleware, and mock JWT authentication.

---

## 🎯 Architecture Highlights

- **Framework**: Express.js with Node.js
- **Port**: `5000` (configurable via `.env`)
- **Persistence**: In-memory data store (`let blogPosts = [...]`)
- **Middleware**:
  - Global `express.json()` payload parsing
  - Custom Request Logger: outputs `[METHOD] /path - HH:MM:SS AM/PM` on every incoming request
  - CORS enablement
- **Authentication**: `POST /login` producing mock RFC 7519 JSON Web Tokens (JWT)

---

## 📡 REST API Specification

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | System health check & endpoint index | No |
| `GET` | `/posts` | Fetch all posts (filters: `?category`, `?tag`, `?search`, `?author`) | No |
| `GET` | `/posts/:id` | Fetch single post by ID (returns `404` if not found) | No |
| `POST` | `/posts` | Create new blog post (`title`, `content`, `author`) | No |
| `PUT` | `/posts/:id` | Update existing post by ID | No |
| `DELETE` | `/posts/:id` | Remove post by ID | No |
| `POST` | `/login` | Authenticate and issue mock JWT token | No |

---

## 🚀 Quickstart & Running Locally

1. **Install Dependencies**:
   ```bash
   cd the-data-hub-api
   npm install
   ```

2. **Start Server with Hot-Reload (Nodemon)**:
   ```bash
   npm run dev
   ```
   Or standard node:
   ```bash
   npm start
   ```

3. **Run Automated Test Suite**:
   ```bash
   npm test
   ```

---

## 🧪 Postman & Thunder Client QA Verification

Import `thunder-tests/data_hub_collection.json` into Postman or VS Code Thunder Client extension.

### Example cURL Commands:

**1. Create Post:**
```bash
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Exploring Next.js 15 SSR","content":"Deep dive into Server Components.","author":"Alex R.","category":"Web"}'
```

**2. Get All Posts:**
```bash
curl http://localhost:5000/posts
```

**3. Filter by Tag:**
```bash
curl http://localhost:5000/posts?tag=nextjs
```

**4. Update Post:**
```bash
curl -X PUT http://localhost:5000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"likes":99}'
```

**5. Delete Post:**
```bash
curl -X DELETE http://localhost:5000/posts/1
```

**6. Authenticate & Obtain Mock JWT:**
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"engineer@prodesk.io","password":"secretPassword"}'
```
