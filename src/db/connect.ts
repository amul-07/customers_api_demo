import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const url = process.env.MONGO_URI;
const name = process.env.DB_NAME;

export async function makeDb() {
  try {
    const client = await MongoClient.connect(url as string);
    const db = client.db(name);

    console.log(`DB connected`);
    return db;
  } catch (error) {
    console.log(`DB connection failed: ${error}`);
  }
}
