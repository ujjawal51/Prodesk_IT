/**
 * Automated End-to-End REST API Test Suite for Sprint 09 Track B
 * Uses Node.js native fetch and assertions
 */
const http = require('http');
const assert = require('assert');
const app = require('../server');

const TEST_PORT = 5055;
let server;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  console.log("=================================================");
  console.log("🧪 STARTING SPRINT 09 TRACK B API AUTOMATED TESTS");
  console.log("=================================================");

  let passed = 0;
  let failed = 0;

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

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));

  try {
    // Test 1: Root status endpoint
    await test("GET / should return 200 and API status", async () => {
      const res = await fetch(`${BASE_URL}/`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.status, "online");
      assert.strictEqual(json.sprint, "Sprint 09 - Fullstack Track B");
    });

    // Test 2: GET /posts
    await test("GET /posts should return list of posts with status 200", async () => {
      const res = await fetch(`${BASE_URL}/posts`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data));
      assert.ok(json.data.length >= 4);
    });

    // Test 3: GET /posts/:id valid
    await test("GET /posts/1 should return single post", async () => {
      const res = await fetch(`${BASE_URL}/posts/1`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.id, "1");
    });

    // Test 4: GET /posts/:id invalid
    await test("GET /posts/99999 should return 404 Not Found", async () => {
      const res = await fetch(`${BASE_URL}/posts/99999`);
      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.strictEqual(json.success, false);
    });

    // Test 5: POST /posts
    let createdPostId;
    await test("POST /posts should create a new post with status 201", async () => {
      const payload = {
        title: "Test Automated Post for Sprint 09",
        content: "This is a comprehensive test payload verifying CRUD operations on in-memory DB.",
        author: "Antigravity Test Runner",
        category: "QA Testing",
        tags: ["qa", "testing", "express"]
      };

      const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.title, payload.title);
      assert.ok(json.data.id);
      createdPostId = json.data.id;
    });

    // Test 6: PUT /posts/:id
    await test("PUT /posts/:id should update existing post with status 200", async () => {
      const updatePayload = {
        title: "Updated Post Title via PUT",
        likes: 100
      };

      const res = await fetch(`${BASE_URL}/posts/${createdPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.title, updatePayload.title);
      assert.strictEqual(json.data.likes, 100);
    });

    // Test 7: DELETE /posts/:id
    await test("DELETE /posts/:id should delete post with status 200", async () => {
      const res = await fetch(`${BASE_URL}/posts/${createdPostId}`, {
        method: "DELETE"
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);

      // Verify it's actually removed
      const checkRes = await fetch(`${BASE_URL}/posts/${createdPostId}`);
      assert.strictEqual(checkRes.status, 404);
    });

    // Test 8: POST /login for mock JWT auth
    await test("POST /login should issue mock JWT token", async () => {
      const credentials = {
        email: "fullstack.engineer@prodesk.io",
        password: "securePassword123"
      };

      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.token);
      assert.strictEqual(json.token_type, "Bearer");
      assert.strictEqual(json.user.email, credentials.email);
    });

    // Test 9: Query filtering GET /posts?tag=nextjs
    await test("GET /posts?tag=nextjs should filter correctly", async () => {
      const res = await fetch(`${BASE_URL}/posts?tag=nextjs`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.data.length > 0);
      assert.ok(json.data[0].tags.includes("nextjs"));
    });

  } finally {
    server.close();
  }

  console.log("=================================================");
  console.log(`🏁 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
