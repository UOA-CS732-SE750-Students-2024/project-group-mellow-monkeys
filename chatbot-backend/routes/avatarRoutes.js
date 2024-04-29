const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate-avatar', async (req, res) => {
  const { description } = req.body;
  const OPENAI_API_KEY = process.env.API_KEY;

  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: description,
      n: 1,
      size: "1024x1024"
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const imageURL = response.data.data[0].url;
    res.json({ imageURL });
  } catch (error) {
    console.error('Failed to generate avatar:', error);
    res.status(500).send('Error generating avatar: ' + error.message);
  }
});

module.exports = router;
