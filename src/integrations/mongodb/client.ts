
import { MongoClient, ServerApiVersion } from 'mongodb';

// The MongoDB connection string (this should ideally be in an environment variable)
const MONGODB_URI = "mongodb+srv://memorykeeper:memorykeeper2024@cluster0.mongodb.net/memorykeeper?retryWrites=true&w=majority";

// Create a MongoClient instance
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to the MongoDB server
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export { client, connectToMongoDB };
