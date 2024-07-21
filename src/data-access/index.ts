import mongoose from "mongoose";
import { MONGODB_URI } from "../config";
import makeRegisterDb from "./register-db";

// Ensure MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to " + MONGODB_URI);
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

export async function makeDb(): Promise<mongoose.Connection> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  const mongoUri: string = MONGODB_URI; // Type assertion to string

  if (mongoose.connection.readyState !== 1) {
    // 1 means connected
    await mongoose.connect(mongoUri);
  }

  return mongoose.connection;
}

const registerDb = makeRegisterDb({ makeDb });
export default registerDb;
