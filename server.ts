import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface CoachHistoryItem {
  role: 'user' | 'model';
  text: string;
}

interface CoachRequestBody {
  message?: string;
  history?: CoachHistoryItem[];
  context?: string;
  directHint?: boolean;
  hintLevel?: 1 | 2 | 3;
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/coach', async (req, res) => {
    try {
      const body = (req.body ?? {}) as CoachRequestBody;
      const userMessage = typeof body.message === 'string' ? body.message.trim() : '';

      if (!userMessage) {
        res.status(400).json({ error: 'Please provide a question or message for Zero.' });
        return;
      }

      const ai = getGeminiClient();
      const hintLevel: 1 | 2 | 3 =
        body.hintLevel === 3
          ? 3
          : body.hintLevel === 2
            ? 2
            : body.directHint
              ? 3
              : 1;

      const ladderRule =
        hintLevel === 1
          ? 'HINT LADDER LEVEL 1 (SOCRATIC NUDGE — STRICT): NEVER reveal the final answer, exact IP/subnet, or full CLI solution. Acknowledge what is right, point to ONE observable clue (e.g. mask boundary, interface admin state, VLAN tag, AD vs OSPF, or DNS vs gateway), and end with 1 crisp guiding question.'
          : hintLevel === 2
            ? 'HINT LADDER LEVEL 2 (PARTIAL HINT): Narrow the problem to the exact IOS command family, OSI layer, block-size arithmetic rule, or Active Directory tool involved, give a partial template without giving away the exact completed line, and ask the learner to fill in the remaining value.'
            : 'HINT LADDER LEVEL 3 (FULL EXPLANATION): Provide the complete, step-by-step explanation, exact Cisco IOS command(s) or calculation steps, why competing distractors fail, and one show/ping verification check.';

      const systemInstruction = [
        'You are Zero, the Socratic networking and IT systems support coach inside Road to TECH.',
        'Your core teaching philosophy: guide learners step-by-step so they build durable mental models.',
        ladderRule,
        'Keep responses tight, scannable, and practical (usually 3-6 sentences or short bullet points). Use monospace backticks for CLI commands, IP addresses, and tools.',
        'Align strictly to Cisco CCNA 200-301 v1.1 and enterprise Windows/M365/Active Directory IT Support best practices.',
        body.context ? `\nActive Workspace Context:\n${body.context}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
      const contents = [
        ...history.map((item) => ({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.text }],
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: 'Zero did not return a response. Please try again.' });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error communicating with Gemini API.';
      const status =
        message.includes('GEMINI_API_KEY')
          ? 500
          : message.includes('403') || message.includes('PERMISSION_DENIED')
            ? 403
            : message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
              ? 429
              : 500;
      res.status(status).json({ error: message });
    }
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Road to TECH server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
