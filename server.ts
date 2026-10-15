import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Health check endpoint for Cloud Run and monitoring
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'namma-kannada-ai' });
});

// Curriculum Tutor API route - restricted strictly to Kannada language learning & grammar
app.post('/api/curriculum-tutor', async (req, res) => {
  const { question, language, level } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Return null so frontend uses its built-in expert linguistic rule engine
    return res.json({ answer: null });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const isHindi = language === 'hi';
    const systemInstruction = `You are the expert Kannada Language Curriculum Tutor for the NAMMA KANNADA AI learning platform (Problem Statement 1: Kannada for Everyone).
Your sole purpose is to explain Kannada language learning, grammar rules, script/vowels, polite vs informal registers (such as Nīvu vs Nīnu, -rā honorific), verb endings (-ಬೇಕು, -ಬೇಡಿ), and practical situational phrasing to English and Hindi speaking beginners.
Do NOT act as a general conversational chatbot, translator, or discuss non-Kannada topics. Keep explanations concise, pedagogically crystal clear, and structured.
The learner's preferred explanation language is: ${isHindi ? 'Hindi' : 'English'}.
The learner's level is: ${level || 'beginner'}.
Always provide the Kannada script, Roman transliteration, and ${isHindi ? 'Hindi' : 'English'} translation when giving examples.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Explain this Kannada language learning or grammar question: "${question}"` }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Gemini curriculum tutor error:', err);
    res.json({ answer: null });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NAMMA KANNADA AI server running on port ${port}`);
  });
}

startServer();
