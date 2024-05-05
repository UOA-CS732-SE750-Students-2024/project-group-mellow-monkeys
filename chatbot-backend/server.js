import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectWithRetry } from "./data/init-db.js";
import userRoutes from "./routes/users.js";
import chatBotRoutes from "./routes/chatbots.js";
import openAIRoutes from "./routes/openAI.js";

import avatarRoutes from "./routes/avatarRoutes.js";

const app = express();
const PORT = process.env.PORT || 8001;
app.use(express.static("public"));

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use("/", chatBotRoutes);
app.use("/", openAIRoutes);
app.use("/", avatarRoutes);

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

export default app;
