const fs = require('fs');

async function testApi() {
  console.log('--- Testing API Server ---');

  // 1. Root health check
  try {
    const rootRes = await fetch('http://127.0.0.1:5000/');
    const rootJson = await rootRes.json();
    console.log('1. Root Status Endpoint:', rootRes.status, rootJson.status, rootJson.database);
  } catch (e) {
    console.error('Root health check failed:', e.message);
    return;
  }

  // 2. GET /api/posts (Phase 1 Hydration)
  let initialPosts = [];
  try {
    const postsRes = await fetch('http://127.0.0.1:5000/api/posts');
    const postsJson = await postsRes.json();
    initialPosts = postsJson.data;
    console.log('2. GET /api/posts (Hydration):', postsRes.status, `Retrieved ${postsJson.count} posts`);
  } catch (e) {
    console.error('GET /api/posts failed:', e.message);
  }

  // 3. POST /api/posts with Multipart FormData (Phase 2 & Phase 3)
  let createdPostId = null;
  try {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const form = new FormData();
    form.append('title', 'Automated Verification Article');
    form.append('content', 'Testing Multer parsing, Cloudinary streaming, and MongoDB document injection.');
    form.append('author', 'QA Pipeline');
    form.append('category', 'Architecture');
    form.append('tags', 'Verification,Multer,Cloudinary');

    // Create a dummy image blob
    const dummyBlob = new Blob(['sample image content'], { type: 'image/png' });
    form.append('thumbnail', dummyBlob, 'test_thumb.png');

    const postRes = await fetch('http://127.0.0.1:5000/api/posts', {
      method: 'POST',
      body: form
    });
    const postJson = await postRes.json();
    createdPostId = postJson.data?._id;
    console.log('3. POST /api/posts (Multipart Injection):', postRes.status, postJson.message);
    console.log('   Stored Thumbnail URL String in DB:', postJson.data?.thumbnailUrl);
    console.log('   Strict Constraint Verified (Not Base64):', !postJson.data?.thumbnailUrl.startsWith('data:'));
  } catch (e) {
    console.error('POST /api/posts failed:', e.message);
  }

  // 4. DELETE /api/posts/:id (Phase 2 Data Deletion)
  if (createdPostId) {
    try {
      const delRes = await fetch(`http://127.0.0.1:5000/api/posts/${createdPostId}`, {
        method: 'DELETE'
      });
      const delJson = await delRes.json();
      console.log('4. DELETE /api/posts/:id (Data Deletion):', delRes.status, delJson.message);
    } catch (e) {
      console.error('DELETE failed:', e.message);
    }
  }

  console.log('--- API Verification Complete ---');
}

testApi();
