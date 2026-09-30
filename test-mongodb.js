require("dotenv").config({ path: ".env" });

const { MongoClient } = require("mongodb");

const uri = process.env.BETTER_AUTH_DB_URL;

if (!uri) {
  console.error("BETTER_AUTH_DB_URL is missing");
  process.exit(1);
}

console.log("MongoDB URI found");

const client = new MongoClient(uri);

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");

    await client.connect();

    console.log("Connected successfully!");

    const result = await client.db("betterauth").command({
      ping: 1,
    });

    console.log("Ping successful:", result);
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
  } finally {
    await client.close();
  }
}

testConnection();