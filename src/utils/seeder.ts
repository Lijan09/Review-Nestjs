import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { PostSchema } from '../post/entities/post.entity';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/review-app';

const NUM_POSTS = 20;

async function seedPosts() {
  try {
    await mongoose.connect(MONGO_URI);
    const Post = mongoose.model('Post', PostSchema);

    await Post.deleteMany({}); // Optional: Clear existing posts

    const fakeAuthorId = new mongoose.Types.ObjectId(); // Replace with real user IDs in production

    const posts = Array.from({ length: NUM_POSTS }, (_, i) => ({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      authorId: fakeAuthorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Post.insertMany(posts);
    console.log(`${posts.length} posts seeded successfully.`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding posts:', err);
    process.exit(1);
  }
}

seedPosts().catch((err) => {
  console.error('Unhandled error in seeding:', err);
  process.exit(1);
});
