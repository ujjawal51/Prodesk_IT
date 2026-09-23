/**
 * Automated End-to-End Test Suite for Sprint 10 Track B
 * Tests Mongoose CRUD operations, Schema Validations, Relational Population, and Aggregation Pipeline
 */
const http = require('http');
const assert = require('assert');
const mongoose = require('mongoose');
const { app } = require('../server');
const { connectDB } = require('../src/config/db');
const seedDatabase = require('../src/utils/seedDb');
const Post = require('../src/models/Post');
const User = require('../src/models/User');

const TEST_PORT = 5058;
let server;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  console.log("\n=======================================================");
  console.log("🧪 STARTING SPRINT 10 TRACK B API AUTOMATED TESTS");
  console.log("   Mongoose ODM, Cloud Relational Modeling & Aggregation");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;
  let testPostId = null;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // Connect to DB and seed
  try {
    await connectDB();
    await seedDatabase();
  } catch (dbErr) {
    console.warn("⚠️ Database connection issue during test setup:", dbErr.message);
  }

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));

  try {
    // Test 1: Root status endpoint
    await test("GET / should return 200 and online database info", async () => {
      const res = await fetch(`${BASE_URL}/`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.status, "online");
      assert.strictEqual(json.sprint, "Sprint 10 - Fullstack Track B (Persistent Cloud Storage & Relational ODM)");
    });

    // Test 2: GET /users
    await test("GET /users should return list of authors", async () => {
      const res = await fetch(`${BASE_URL}/users`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data));
      assert.ok(json.data.length >= 1, "Should have at least 1 seeded user");
    });

    // Test 3: Phase 2 CRUD Injection - POST /posts (Post.create)
    await test("POST /posts executes Post.create() with relational author", async () => {
      const usersRes = await fetch(`${BASE_URL}/users`);
      const usersJson = await usersRes.json();
      const authorId = usersJson.data[0]._id;

      const newPostPayload = {
        title: "Test Injected Post via Post.create()",
        content: "Testing Mongoose schema injection and validation in Sprint 10 pipeline.",
        authorId: authorId,
        category: "Testing",
        tags: ["qa", "mongoose", "automation"]
      };

      const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostPayload)
      });

      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.title, newPostPayload.title);
      assert.ok(json.data._id, "Created post should have a valid MongoDB _id");
      assert.ok(json.data.authorId && json.data.authorId.name, "Author should be populated");
      testPostId = json.data._id;
    });

    // Test 4: Phase 2 & 3 - GET /posts with .populate()
    await test("GET /posts executes Post.find() and hydrates authorId via .populate()", async () => {
      const res = await fetch(`${BASE_URL}/posts`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data));
      assert.ok(json.data.length > 0);

      // Verify hydration: authorId should be an object containing name & email, not just a raw string
      const firstPost = json.data[0];
      assert.ok(firstPost.authorId, "authorId field should be populated");
      assert.ok(typeof firstPost.authorId === 'object', "authorId should be hydrated object");
      assert.ok(firstPost.authorId.name, "authorId should contain author name");
    });

    // Test 5: Phase 3 Aggregation - GET /posts/top-recent
    await test("GET /posts/top-recent executes MongoDB Aggregation Pipeline returning Top 3 Most Recent", async () => {
      const res = await fetch(`${BASE_URL}/posts/top-recent`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data));
      assert.ok(json.data.length <= 3, "Pipeline limit must restrict to at most 3 posts");
      assert.ok(json.pipeline.includes("Aggregation Pipeline"), "Response verifies aggregation pipeline usage");

      // Verify descending order
      if (json.data.length >= 2) {
        const d1 = new Date(json.data[0].createdAt).getTime();
        const d2 = new Date(json.data[1].createdAt).getTime();
        assert.ok(d1 >= d2, "Posts must be sorted descending by createdAt");
      }
    });

    // Test 6: GET /posts/:id
    await test("GET /posts/:id queries single post by ObjectId", async () => {
      assert.ok(testPostId, "Test post ID must exist from test 3");
      const res = await fetch(`${BASE_URL}/posts/${testPostId}`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data._id, testPostId);
    });

    // Test 7: PUT /posts/:id
    await test("PUT /posts/:id updates post in MongoDB", async () => {
      assert.ok(testPostId);
      const res = await fetch(`${BASE_URL}/posts/${testPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Updated Title for Automated Test",
          likes: 99
        })
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.title, "Updated Title for Automated Test");
      assert.strictEqual(json.data.likes, 99);
    });

    // Test 8: Phase 2 CRUD Deletion - DELETE /posts/:id (Post.findByIdAndDelete)
    await test("DELETE /posts/:id executes Post.findByIdAndDelete()", async () => {
      assert.ok(testPostId);
      const res = await fetch(`${BASE_URL}/posts/${testPostId}`, {
        method: "DELETE"
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);

      // Verify post no longer exists
      const verifyRes = await fetch(`${BASE_URL}/posts/${testPostId}`);
      assert.strictEqual(verifyRes.status, 404);
    });

    // Test 9: Strict Validation - POST /posts without title fails with 400
    await test("POST /posts without title fails with status 400", async () => {
      const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Missing title text" })
      });

      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
    });

  } finally {
    server.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    console.log("\n=======================================================");
    console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log("=======================================================\n");
  }
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error("Fatal test runner error:", err);
    process.exit(1);
  });
}

module.exports = runTests;
