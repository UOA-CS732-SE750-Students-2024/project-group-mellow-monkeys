import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectWithRetry } from "./data/init-db.js";
import userRoutes from "./routes/users.js";
import chatBotRoutes from "./routes/chatbots.js";
import openAIRoutes from "./routes/openAI.js";

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use("/", chatBotRoutes);
app.use("/", openAIRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API!" });
});

connectWithRetry()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// app.use(express.json());
// app.use(cors());

// const { connectWithRetry } = require("./data/init-db.js");
// const userRoutes = require("./routes/users.js");
// const chatBotRoutes = require("./routes/chatbots.js");
// const openAIRoutes = require("./routes/openAI.js");

// app.use(userRoutes);
// app.use(chatBotRoutes);
// app.use(openAIRoutes);

// // OPEN ROUTE - PUBLIC ROUTE
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Welcome to the API!" });
// });

// connectWithRetry().then(() => {
//   app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
// });
