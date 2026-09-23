require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const { initialUsers, initialPostsData } = require('../config/initialSeed');
const { connectDB } = require('../config/db');

/**
 * Seed Database with Relational Users and Posts
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Purging existing collections...');
    await Post.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Seeding Users...');
    const createdUsers = await User.insertMany(initialUsers);
    console.log(`✅ Seeded ${createdUsers.length} Users successfully.`);

    // Map email to ObjectId
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u._id;
    });

    console.log('📝 Seeding Posts with Relational authorId references...');
    const postsToInsert = initialPostsData.map((post) => {
      const authorId = userMap[post.authorEmail] || createdUsers[0]._id;
      return {
        title: post.title,
        content: post.content,
        authorId: authorId,
        category: post.category,
        tags: post.tags,
        readTime: post.readTime,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.createdAt
      };
    });

    const createdPosts = await Post.insertMany(postsToInsert);
    console.log(`✅ Seeded ${createdPosts.length} Posts successfully.`);

    console.log('\n🎉 Sprint 10 Database Seeding Completed!');
    return { users: createdUsers, posts: createdPosts };
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Closing database connection...');
      mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
