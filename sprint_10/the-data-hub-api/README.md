# ⚡ The Data Hub RESTful API Server (Sprint 10 Track B)

Enterprise-grade Node.js and Express backend interfaced with **MongoDB Atlas** using the **Mongoose ODM (Object Data Modeling)**. Deprecates volatile in-memory arrays from Sprint 09 and introduces persistent cloud storage, relational schemas with `.populate()`, and multi-stage Aggregation Pipelines.

---

## 🎯 Engineering Objectives Achieved

### Phase 1: Cloud Provisioning & ODM Setup (P0 - Mandatory)
- **MongoDB Atlas Integration**: Connects securely to MongoDB Atlas M0 cluster via `process.env.MONGO_URI`.
- **Strict Schema Typing**: Architected `Post` and `User` models enforcing type safety, field validations, and default timestamps.
- **Credential Protection**: Connection credentials secured via `.env` and strictly guarded in `.gitignore`.

### Phase 2: Live Database CRUD Logic (P1 - Priority)
- **`POST /posts`**: Executes `Post.create()` to inject structured documents into the cloud.
- **`GET /posts`**: Executes `Post.find()` with relational hydration via `.populate('authorId')`.
- **`GET /posts/:id`**: Fetches a single post by MongoDB `_id` with author populated.
- **`PUT /posts/:id`**: Executes `Post.findByIdAndUpdate()`.
- **`DELETE /posts/:id`**: Executes `Post.findByIdAndDelete()` to delete records.
- **QA Automation**: End-to-end integration test suite (`test/api.test.js`) and Postman/Thunder Client collection (`thunder-tests/sprint10_collection.json`).

### Phase 3: Relational Modeling & Aggregation (P2 - Advanced)
- **Relational Schema**: Architected `User` schema (`name`, `email`, `role`, `avatar`, `bio`).
- **Referenced Mutation**: `Post` schema defines `authorId: { type: ObjectId, ref: 'User' }`. Upon querying, `.populate('authorId')` hydrates the complete author profile.
- **Aggregation Pipeline**: Custom endpoint `GET /posts/top-recent` queries, sorts, and limits documents to return the **Top 3 Most Recent Posts** with joined author information using `$sort`, `$limit`, `$lookup`, and `$project`.

---

## 📂 Project Architecture

```
sprint_10/the-data-hub-api/
├── .env.example               # Safe environment variable template
├── .env                       # Local secrets (never committed to Git)
├── .gitignore                 # Enforces security exclusions (.env)
├── package.json               # Express, Mongoose, Dotenv, Cors
├── server.js                  # Express application root & lifecycle
├── README.md                  # This file
├── test/
│   └── api.test.js            # Automated integration test suite
├── thunder-tests/
│   └── sprint10_collection.json # Postman / Thunder Client ready-to-run collection
└── src/
    ├── config/
    │   ├── db.js              # Mongoose Atlas connection manager
    │   └── initialSeed.js     # Rich initial seed dataset
    ├── controllers/
    │   ├── authController.js  # JWT Bearer token generation
    │   ├── postController.js  # Live Mongoose CRUD & Aggregation pipeline
    │   └── userController.js  # Author profile management
    ├── middleware/
    │   ├── auth.js            # JWT Bearer verification
    │   ├── errorHandler.js    # Mongoose error interceptor
    │   └── logger.js          # Timestamped request logger
    ├── models/
    │   ├── Post.js            # Strict Post schema with authorId ref
    │   └── User.js            # Relational User author schema
    ├── routes/
    │   ├── authRoutes.js      # /login
    │   ├── postRoutes.js      # /posts CRUD & /posts/top-recent
    │   └── userRoutes.js      # /users
    └── utils/
        └── seedDb.js          # Relational database seeder
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
cd sprint_10/the-data-hub-api
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`, configure your MongoDB Atlas connection string:
```ini
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/the_data_hub_sprint10?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

### 3. Seed Database
Populate your MongoDB database with authors and posts linked via `authorId`:
```bash
npm run seed
```

### 4. Run Server
```bash
# Production mode
npm start

# Development mode (auto-reload)
npm run dev
```

### 5. Run Automated Tests
```bash
npm test
```

---

## 🌐 API Route Specifications

| Method | Endpoint | Description | Mongoose Implementation |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API health check & DB status | `mongoose.connection.readyState` |
| `POST` | `/seed` | Reseeds Users and Posts | `User.insertMany()` + `Post.insertMany()` |
| `POST` | `/login` | Issues RFC 7519 JWT token | User verification |
| `GET` | `/users` | List all registered authors | `User.find().sort({ createdAt: -1 })` |
| `POST` | `/users` | Create a new author profile | `User.create()` |
| `GET` | `/posts` | List posts (hydrates author) | `Post.find().populate('authorId')` |
| `GET` | `/posts/:id` | Fetch single post with author | `Post.findById().populate('authorId')` |
| `POST` | `/posts` | Ingest new post into cloud DB | `Post.create()` |
| `PUT` | `/posts/:id` | Update post by ID | `Post.findByIdAndUpdate()` |
| `DELETE`| `/posts/:id` | Delete post by ID | `Post.findByIdAndDelete()` |
| `GET` | `/posts/top-recent`| Return **Top 3 Most Recent Posts** | `Post.aggregate([$sort, $limit: 3, $lookup, $unwind, $project])` |

---

## 🧪 Postman & QA Verification

1. Import `thunder-tests/sprint10_collection.json` into **Postman** or **Thunder Client**.
2. Run `1. Health & DB Status` to verify connection to MongoDB Atlas.
3. Run `7. Phase 2 CRUD Injection: Post.create()` to inject a document into your cloud database.
4. Open your **MongoDB Atlas Dashboard** -> Collections -> `posts` to verify real-time persistence.
5. Run `6. Phase 3 Aggregation: Top 3 Most Recent Posts` to verify the multi-stage aggregation pipeline results.
