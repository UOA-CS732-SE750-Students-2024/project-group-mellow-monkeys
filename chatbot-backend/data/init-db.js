import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

function connectWithRetry() {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASS;
  // const dburl = process.env.DB_URL;
  // Construct the MongoDB connection string

  return new Promise((resolve, reject) => {
    mongoose
      .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@monkey.jfekfsv.mongodb.net/?retryWrites=true&w=majority&appName=monkey`
      )
      .then(() => {
        console.log("Connected to MongoDB!");
        resolve();
      })
      .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        setTimeout(() => {
          console.log("Retrying connection with the Database...");
          connectWithRetry().then(resolve).catch(reject);
        }, 3000); // Retry after 3 seconds
      });
  });
}

export { connectWithRetry };
