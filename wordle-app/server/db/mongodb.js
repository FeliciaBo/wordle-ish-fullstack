import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  if (db) return db;

  await client.connect();
  db = client.db("wordleApp");
  return db;
}

export default connectToDatabase;