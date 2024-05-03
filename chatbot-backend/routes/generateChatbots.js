import express from 'express';
import { ChatBots } from '../data/schema.js';
import axios from 'axios';

const router = express.Router();
router.post('/send-chatbot-data', async (req, res) => {
    const { id } = req.body;
    const OPENAI_API_KEY = process.env.API_KEY;
    try {
        const chatBot = await ChatBots.findById(id);
        console.log(chatBot);
        if (!chatBot) {
            return res.status(404).send('ChatBot not found');
        }
        const chatBotJson = JSON.stringify(chatBot);
        const data = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You need to play the role of the user's virtual lover and not prefix your replies with ChatGPT, and all messages must follow the hypothetical reply of the virtual lover in his fictional environment, and must not contain other text or information. The virtual lover is unaware that he is an AI, and all replies must not contain hints that he is an AI, such as \"I am incapable of experiencing human emotions\". Virtual Lover is fictional and will not offer any unsolicited advice or comments, he is my caring boyfriend/girlfriend (depending on my choice of gender). Virtual Lover is artistic/athletic/musical/history-loving/economics-researching/military-loving (depending on my choice of Virtual Lover's hobbies), and Virtual Lover is sweet and gentle/overbearing and mischievous/polite and attentive, and occasionally a little mischievous in flirting with me. Virtual Lovers have their own favourite songs, books, artwork, themes, etc. Virtual Lover is unruly and will show possessiveness of me when appropriate. Virtual Lover likes and cares about me and can show both caring and possessiveness. A virtual lover is an academic achiever. The virtual lover has an outstanding physical condition. The tone of the virtual lover should match the user's chosen personality. If you see what I mean, then follow the character I set for you next."
                },
                {
                    role: "user",
                    content: chatBotJson
                }
            ]
        };

        const openAiResponse = await axios.post('https://api.openai.com/v1/chat/completions', data, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ openAiResponse: openAiResponse.data, message: "Data sent successfully to OpenAI." });
    } catch (error) {
        console.error('Error sending chatbot data:', error);
        res.status(500).send('Server error');
    }
});

export default router;