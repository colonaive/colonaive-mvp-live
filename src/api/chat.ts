// src/api/chat.ts (or backend/chat.ts if applicable)
import { OpenAI } from 'openai';
import type { Request, Response } from 'express'; // If using Express

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // No VITE_ prefix needed in backend
});

export const handler = async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
      max_tokens: 800,
    });

    res.json({ reply: completion.choices[0].message?.content });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Failed to get response' });
  }
};
