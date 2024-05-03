import express from "express";
import {
  createChatBot,
  getChatBotById,
  deleteSingleChatBot,
  getChatBotsByUserId,
} from "../data/chatBots-dao.js";
import checkToken from "./checkToken.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create chatbot
router.post("/createChatbot", checkToken, async (req, res) => {
  try {
    const chatBot = await createChatBot(req.body);
    res.status(201).json(chatBot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create chatbot" });
  }
});

// Get chatbot by ID
router.get("/chatbot/:id", checkToken, async (req, res) => {
  try {
    const chatBot = await getChatBotById(req.params.id);
    if (!chatBot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }
    res.json(chatBot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all chatbots by user ID
router.get("/chatbots/user/:userId", checkToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const chatBots = await getChatBotsByUserId(userId);
    if (!chatBots.length) {
      return res.status(404).json({ error: "No chatbots found for this user" });
    }
    res.json(chatBots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete chatbot by ID
// router.delete("/deleteSingleChatbot/:id", checkToken, async (req, res) => {
//   try {
//     const deleted = await deleteSingleChatBot(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: "Chatbot not found" });
//     }
//     res.status(200).json({ message: "Chatbot deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete chatbot" });
//   }
// });

router.delete("/deleteSingleChatbot/:id", checkToken, async (req, res) => {
  try {
    const chatbot = await getChatBotById(req.params.id);
    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    const deleted = await deleteSingleChatBot(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    const url = new URL(chatbot.avatar);
    const filename = path.basename(url.pathname);
    const filePath = path.join(__dirname, "..", "public", filename);

    fs.unlink(filePath, (error) => {
      if (error) {
        console.error("Failed to delete file:", error);
      } else {
        console.log("File deleted successfully");
      }
    });

    res.status(200).json({ message: "Chatbot deleted successfully" });
  } catch (error) {
    console.error("Unhandled error:", error);
    res.status(500).json({ error: "Failed to delete chatbot" });
  }
});

export default router;
