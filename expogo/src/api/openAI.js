import axios from 'axios';
import {apiKey} from '../constants';

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';

export const apiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});

    console.log('data: ', res.data.choices[0].message);
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return {success: false, msg: err.message};
  }
};
