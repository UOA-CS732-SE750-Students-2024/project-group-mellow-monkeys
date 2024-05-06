import express from "express";
import axios from "axios";
import fs from "fs";

const router = express.Router();

router.post("/generate-avatar", async (req, res) => {
  const { description } = req.body;
  const OPENAI_API_KEY = process.env.API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: description,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imageURL = response.data.data[0].url;
    const imageResponse = await axios.get(imageURL, { responseType: "stream" });
    const imageName = `avatar${Date.now()}.png`;
    const imagePath = `./public/${imageName}`;
    const imageFile = fs.createWriteStream(imagePath);
    imageResponse.data.pipe(imageFile);

    res.status(200).json({ imagePath });
  } catch (error) {
    console.error("Failed to generate avatar:", error);
    res.status(500).send("Error generating avatar: " + error.message);
  }
});

export default router;
