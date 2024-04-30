import express from "express";
import { createChatBot, getChatBotById } from "../data/chatBots-dao.js";
import checkToken from "./checkToken.js";

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
router.get("chatbot/:id", checkToken, async (req, res) => {
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

export default router;
