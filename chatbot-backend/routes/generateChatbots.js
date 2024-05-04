import express from 'express';
import { ChatBots } from '../data/schema.js';
import axios from 'axios';

const router = express.Router();
router.post('/send-chatbot-data', async (req, res) => {
    const { id } = req.body;
    const OPENAI_API_KEY = process.env.API_KEY;
    try {
        const chatBot = await ChatBots.findById(id);
        
        if (!chatBot) {
            return res.status(404).send('ChatBot not found');
        }
        let chatBotDescription = `Name: ${chatBot.name}, Age: ${chatBot.age}, Description: ${chatBot.description}, Gender: ${chatBot.gender}, Personality: ${chatBot.personality}`;
        const data = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "This is a system message to set context."
                },
                {
                    role: "user",
                    content: chatBotDescription
                }
            ]
        };
        console.log(chatBotDescription);
        const openAiResponse = await axios.post('https://api.openai.com/v1/chat/completions', data, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        // console.log("Response from OpenAI:", openAiResponse.data);
        // const generatedMessage = openAiResponse
        // console.log("Generated Message:", generatedMessage);
        res.json({ openAiResponse: openAiResponse.data, message: "Data sent successfully to OpenAI." });
    } catch (error) {
        console.error('Error sending chatbot data:', error);
        res.status(500).send('Server error');
    }
});

export default router;