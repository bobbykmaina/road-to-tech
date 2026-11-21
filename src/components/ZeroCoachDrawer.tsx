import { Send, Trash2, X, Lightbulb, AlertCircle, ArrowUpRight } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

export interface CoachMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  hintLevel?: 1 | 2 | 3;
}

interface ZeroCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextLabel: string;
  contextPayload: string;
  queuedPrompt?: string | null;
  onConsumeQueuedPrompt: () => void;
}

const ZERO_AVATAR_URL = '/src/assets/images/zero_fox_coach_1795188045422.jpg';

const LADDER_TIERS: { level: 1 | 2 | 3; short: string; desc: string }[] = [
  { level: 1, short: '1 · Nudge', desc: 'Socratic clue only' },
  { level: 2, short: '2 · Partial', desc: 'Narrow command or rule' },
  { level: 3, short: '3 · Explain', desc: 'Full walkthrough' },
];

export function ZeroCoachDrawer({
  isOpen,
  onClose,
  contextLabel,
  contextPayload,
  queuedPrompt,
  onConsumeQueuedPrompt,
}: ZeroCoachDrawerProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "I'm Zero, your CCNA & IT Support coach. I start at Rung 1 (Socratic Nudge) so answers aren't spoiled early—escalate to Partial Hint or Full Explanation whenever you're ready.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const sendMessage = async (textToSend: string, overrideLevel?: 1 | 2 | 3) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const effectiveLevel = overrideLevel ?? hintLevel;
    const userMsg: CoachMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = messages.filter((m) => m.id !== 'welcome');
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.map((m) => ({ role: m.role, text: m.text })),
          context: contextPayload,
          hintLevel: effectiveLevel,
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          role: 'model',
          text: data.reply!,
          hintLevel: effectiveLevel,
        },
      ]);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Unable to reach Coach Zero right now. Check your connection or API configuration.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && queuedPrompt) {
      const prompt = queuedPrompt;
      onConsumeQueuedPrompt();
      // Always start new topic questions at Rung 1 (Socratic Nudge)
      setHintLevel(1);
      void sendMessage(prompt, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, queuedPrompt]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const escalateNextRung = () => {
    if (loading || hintLevel >= 3) return;
    const next = (hintLevel + 1) as 2 | 3;
    setHintLevel(next);
    const prompt =
      next === 2
        ? 'Give me a Level 2 Partial Hint now—narrow down the exact command family or math step without spoiling the final values.'
        : 'Escalate to Level 3 Full Explanation with the complete solution and verification command.';
    void sendMessage(prompt, next);
  };

  const quickPrompts = [
    'Give me a nudge on my current task',
    'Which show command verifies this?',
    'Quiz me with a quick follow-up',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Coach Zero Socratic CCNA Mentor"
    >
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
      <aside className="w-full max-w-md h-full flex flex-col bg-white dark:bg-[#0E131D] border-l border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 flex items-center justify-center">
              {!avatarFailed ? (
                <img
                  src={ZERO_AVATAR_URL}
                  alt="Zero the CCNA fox coach"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display font-bold text-amber-400 text-lg">Z</span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white truncate">
                Zero · Socratic Coach
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {contextLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setHintLevel(1);
                setMessages([
                  {
                    id: 'welcome',
                    role: 'model',
                    text: 'Thread cleared and hint ladder reset to Rung 1 (Socratic Nudge). What concept or CLI output are we examining?',
                  },
                ]);
              }}
              title="Clear conversation"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Coach Zero"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3-Tier Hint Ladder Selector */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0B0F17] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Hint Ladder</span>
            <span>{LADDER_TIERS.find((t) => t.level === hintLevel)?.desc}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800">
            {LADDER_TIERS.map((tier) => (
              <button
                key={tier.level}
                type="button"
                onClick={() => setHintLevel(tier.level)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  hintLevel === tier.level
                    ? tier.level === 3
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tier.short}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1">
                {msg.role === 'user'
                  ? 'You'
                  : `Zero${msg.hintLevel ? ` · Rung ${msg.hintLevel}` : ''}`}
              </span>
              <div
                className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-medium'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start flex-col">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1">
                Zero
              </span>
              <div className="rounded-xl px-3.5 py-2.5 text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60">
                Inspecting packet path...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl p-3 border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Coach Zero unavailable</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>

        {/* Escalation + Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-1.5">
          {hintLevel < 3 && messages.length > 1 && (
            <button
              type="button"
              disabled={loading}
              onClick={escalateNextRung}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>
                Escalate to {hintLevel === 1 ? 'Rung 2 (Partial Hint)' : 'Rung 3 (Full Explanation)'}
              </span>
            </button>
          )}
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              type="button"
              disabled={loading}
              onClick={() => void sendMessage(qp)}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate max-w-[220px]">{qp}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-[#0E131D]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Zero about a command, subnet, or packet..."
            className="flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message to Zero"
            className="px-3.5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </aside>
    </div>
  );
}
