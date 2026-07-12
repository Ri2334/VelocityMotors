const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables for tests
dotenv.config({ path: '.env.test' });

let mongoServer;

beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Overwrite environment MONGODB_URI for mongoose connection
  process.env.MONGODB_URI = mongoUri;

  // Avoid warning logs from mongoose
  mongoose.set('strictQuery', false);

  // Connect Mongoose to the memory server
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  // Clear all database collections to ensure test isolation
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // Disconnect mongoose and shut down the memory server
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
