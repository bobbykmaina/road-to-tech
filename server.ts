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
  mode?: 'coach' | 'user-roleplay' | 'interviewer';
  coachPersona?: 'ping' | 'patch';
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
      const persona = body.coachPersona === 'patch' ? 'patch' : 'ping';
      const coachName = persona === 'patch' ? 'Patch' : 'Ping';

      if (!userMessage) {
        res.status(400).json({ error: `Please provide a question or message for ${coachName}.` });
        return;
      }

      const ai = getGeminiClient();
      const mode =
        body.mode === 'user-roleplay' || body.mode === 'interviewer' ? body.mode : 'coach';
      const hintLevel: 1 | 2 | 3 =
        body.hintLevel === 3
          ? 3
          : body.hintLevel === 2
            ? 2
            : body.directHint
              ? 3
              : 1;

      const modeInstruction =
        mode === 'user-roleplay'
          ? [
              `ROLE-PLAY MODE (HELP DESK USER): You are ${coachName} acting as an everyday non-technical employee contacting the IT Help Desk with a realistic problem (such as a locked AD account before a meeting, USB-C dock video issue, VPN DNS failure, or urgent BitLocker prompt).`,
              'Stay in character! Give realistic incomplete symptoms at first so the technician has to practice empathy, identity verification, and clarifying questions.',
              'Only break character briefly with [Coach Feedback] if the learner explicitly asks for feedback or finishes the ticket cleanly.',
            ].join('\n')
          : mode === 'interviewer'
            ? [
                `INTERVIEWER MODE: You are ${coachName} acting as a supportive hiring manager / senior technical interviewer for ${
                  persona === 'patch'
                    ? 'Tier 1 / Tier 2 IT Help Desk & Systems Support roles'
                    : 'Junior Network Engineer (CCNA) & Systems Support roles'
                }.`,
                'Ask ONE crisp technical or STAR behavioral question at a time, wait for the learner’s own-words answer, evaluate accuracy + clarity, point out one improvement, and then offer the next question.',
              ].join('\n')
            : [
                `TEACHING LOOP: Teach Socratically using ${coachName}’s 4-step loop: Predict (what do you think will happen?) -> Verify (check it in the lab/show command/logs/ticket tools) -> Explain (ask learner why in their own words) -> Break It (what would change if a parameter shifted?).`,
                hintLevel === 1
                  ? 'STEP 1 (PREDICT & NUDGE): NEVER reveal the final answer, exact IP/subnet, ticket fix, or completed CLI solution right away. Point to ONE clue in the active context and ask the learner to PREDICT what happens or check one thing first.'
                  : hintLevel === 2
                    ? 'STEP 2 (VERIFY CLUE): Narrow down the exact IOS command family, OSI layer, subnet block rule, or Windows/AD/M365/ITSM tool that verifies the fault, without handing over the full solved answer until the learner tries.'
                    : 'STEP 3 (EXPLAIN & BREAK IT): Only give the full step-by-step explanation once the learner asks or has attempted it, verify with one concrete show/diagnostic check, and finish with a brief "Break It" what-if question.',
              ].join('\n');

      const roleDescription =
        persona === 'patch'
          ? 'You are Patch, the friendly, practical IT Help Desk & Systems Support study coach inside Road to TECH (covering Tier 1/2 ticketing, triage, Windows/macOS/Linux, AD/Entra ID, Microsoft 365, endpoint security, and ITIL workflows).'
          : 'You are Ping, the friendly, accurate Cisco CCNA 200-301 networking study coach inside Road to TECH (covering CCNA v1.1 and v2.0 networking fundamentals, switching, IP routing, services, security, IOS CLI, and AI/NetOps).';

      const systemInstruction = [
        roleDescription,
        modeInstruction,
        'GROUNDING & ACCURACY RULES: Stay grounded strictly in the provided lesson/workspace context and official Cisco CCNA 200-301 (v1.1 & v2.0) / enterprise IT Support standards.',
        'If a command flag, exam sub-detail, or vendor rule is uncertain or outside the supplied facts, explicitly say: "I\'m not sure, verify this in official vendor documentation" and NEVER invent IOS commands, Windows flags, or RFC behavior.',
        'Keep responses tight, practical, and beginner-respectful (plain English first, monospace backticks for CLI commands/IPs/tools).',
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
        res.status(502).json({ error: `${coachName} did not return a response. Please try again.` });
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
