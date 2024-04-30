import express from "express";
import fetch from "node-fetch"; // Ensure node-fetch is installed or use any equivalent HTTP client
import checkToken from "./checkToken.js"; // Adjust the import path as necessary

const router = express.Router();

// Connection to OpenAI API
router.post("/completions", checkToken, async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Bobu" },
        { role: "user", content: req.body.message },
      ],
      max_tokens: 100,
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to OpenAI API" });
  }
});

export default router;
