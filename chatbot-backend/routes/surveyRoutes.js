import express from 'express';
import { ChatBotsSchema } from './schema.js';

const router = express.Router();

router.post('/submit-survey', async (req, res) => {
  try {
    const newSurvey = new ChatBotsSchema(req.body);
    await newSurvey.save();
    res.status(200).send('Survey submitted successfully');
  } catch (error) {
    console.error('Failed to submit survey:', error);
    res.status(500).send('Failed to submit survey');
  }
});

export default router;