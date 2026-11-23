import { AlertCircle, ArrowUpRight, LifeBuoy, Lightbulb, Radio, Send, Trash2, WifiOff, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export type PingCoachMode = 'coach' | 'user-roleplay' | 'interviewer';
export type CoachPersonaId = 'ping' | 'patch';

export interface CoachMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  hintLevel?: 1 | 2 | 3;
}

interface PingCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  coachPersona?: CoachPersonaId;
  contextLabel: string;
  contextPayload: string;
  queuedPrompt?: string | null;
  onConsumeQueuedPrompt: () => void;
}

const LADDER_TIERS: { level: 1 | 2 | 3; short: string; desc: string }[] = [
  { level: 1, short: '1 · Predict', desc: 'Predict & Socratic nudge' },
  { level: 2, short: '2 · Verify', desc: 'Narrow command or test' },
  { level: 3, short: '3 · Explain', desc: 'Full walkthrough + Break It' },
];

function getCoachModes(persona: CoachPersonaId): { id: PingCoachMode; label: string; welcome: string }[] {
  if (persona === 'patch') {
    return [
      {
        id: 'coach',
        label: 'Support Coach',
        welcome:
          "Hi, I'm Patch, your IT Help Desk & Systems Support coach! I teach with a Predict → Verify → Explain → Break It loop so troubleshooting habits, ticket notes, and escalation judgment stick cleanly. Tell me what ticket or topic you're working on below.",
      },
      {
        id: 'user-roleplay',
        label: 'User Role-Play',
        welcome:
          'Role-Play Mode active: I am now an everyday employee calling the IT help desk. Say "Ready for a call" (or pick a ticket scenario), practice greeting me calmly, verify my identity, and isolate what is broken!',
      },
      {
        id: 'interviewer',
        label: 'Interviewer',
        welcome:
          'Interview Mode active: I am Patch acting as your Tier 1 / Tier 2 Service Desk hiring interviewer. Say "Start technical question" or "Start STAR behavioral question" and answer in your own words for live feedback.',
      },
    ];
  }
  return [
    {
      id: 'coach',
      label: 'Study Coach',
      welcome:
        "Hi, I'm Ping, your Cisco CCNA networking coach! I teach with a Predict → Verify → Explain → Break It loop so packet walks, IOS CLI checks, and subnetting click instead of spoiling answers. Tell me what you're looking at or click a prompt below.",
    },
    {
      id: 'user-roleplay',
      label: 'User Role-Play',
      welcome:
        'Role-Play Mode active: I am now an everyday employee calling the IT desk about a network outage. Say "Ready for a call" to practice narrowing down Layer 1–3 symptoms calmly!',
    },
    {
      id: 'interviewer',
      label: 'Interviewer',
      welcome:
        'Interview Mode active: I am Ping acting as your Network Engineer / CCNA technical interviewer. Say "Start technical question" or "Start STAR behavioral question" and answer in your own words for live feedback.',
    },
  ];
}

export function PingCoachDrawer({
  isOpen,
  onClose,
  coachPersona = 'ping',
  contextLabel,
  contextPayload,
  queuedPrompt,
  onConsumeQueuedPrompt,
}: PingCoachDrawerProps) {
  const isOnline = useOnlineStatus();
  const coachName = coachPersona === 'patch' ? 'Patch' : 'Ping';
  const coachModes = useMemo(() => getCoachModes(coachPersona), [coachPersona]);

  const [mode, setMode] = useState<PingCoachMode>('coach');
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: coachModes[0].welcome,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);

  const listRef = useRef<HTMLDivElement>(null);

  // Reset idle welcome banner when switching between CCNA (Ping) and IT Support (Patch)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        const meta = coachModes.find((m) => m.id === mode) ?? coachModes[0];
        return [{ id: 'welcome', role: 'model', text: meta.welcome }];
      }
      return prev;
    });
  }, [coachModes, mode]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const sendMessage = async (
    textToSend: string,
    overrideLevel?: 1 | 2 | 3,
    overrideMode?: PingCoachMode,
  ) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    if (!isOnline) {
      setErrorMsg(
        `${coachName} requires an internet connection. Your lessons, IOS labs, subnetting studio, ticket simulator, and mock exams still work fully offline.`,
      );
      return;
    }

    const effectiveLevel = overrideLevel ?? hintLevel;
    const effectiveMode = overrideMode ?? mode;

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
          mode: effectiveMode,
          coachPersona,
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
          : `${coachName} is unavailable right now. Check your internet connection or API settings.`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && queuedPrompt) {
      const prompt = queuedPrompt;
      onConsumeQueuedPrompt();
      setHintLevel(1);
      setMode('coach');
      void sendMessage(prompt, 1, 'coach');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, queuedPrompt]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleSwitchMode = (nextMode: PingCoachMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setHintLevel(1);
    setErrorMsg(null);
    const meta = coachModes.find((m) => m.id === nextMode) ?? coachModes[0];
    setMessages([{ id: 'welcome', role: 'model', text: meta.welcome }]);
  };

  const escalateNextRung = () => {
    if (loading || hintLevel >= 3) return;
    const next = (hintLevel + 1) as 2 | 3;
    setHintLevel(next);
    const prompt =
      next === 2
        ? 'Move to Step 2 (Verify): Narrow down which exact show command, log, or diagnostic step checks my prediction—without spoiling the answer yet.'
        : 'Move to Step 3 (Explain & Break It): Give the complete explanation now and follow up with one "what would change if..." twist.';
    void sendMessage(prompt, next);
  };

  const quickPrompts =
    mode === 'user-roleplay'
      ? [
          'Ready for a frustrated caller role-play',
          'Start an urgent BitLocker verification test call',
          'Grade how I handled this call so far',
        ]
      : mode === 'interviewer'
        ? coachPersona === 'patch'
          ? [
              'Ask me a Tier 1 IT help desk scenario question',
              'Ask me an Active Directory / M365 support question',
              'Ask a STAR behavioral interview question',
            ]
          : [
              'Ask me a CCNA OSPF / VLAN technical question',
              'Ask me an IPv4 subnetting or ACL troubleshooting question',
              'Ask a STAR behavioral interview question',
            ]
        : coachPersona === 'patch'
          ? [
              'Help me isolate what happens first',
              'Which Windows/M365 check or log verifies this?',
              'Test me with a "Break It" what-if twist',
            ]
          : [
              'Help me predict what happens next',
              'Which show or CLI command verifies this?',
              'Test me with a "Break It" what-if question',
            ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={`${coachName} AI Study Coach`}
    >
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
      <aside className="w-full max-w-md h-full flex flex-col bg-white dark:bg-[#0E131D] border-l border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-lg border shrink-0 flex items-center justify-center ${
                coachPersona === 'patch'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400'
              }`}
            >
              {coachPersona === 'patch' ? (
                <LifeBuoy className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Radio className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white truncate">
                {coachPersona === 'patch' ? 'Patch · IT Support Coach' : 'Ping · CCNA Coach'}
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
                const meta = coachModes.find((m) => m.id === mode) ?? coachModes[0];
                setMessages([{ id: 'welcome', role: 'model', text: meta.welcome }]);
              }}
              title="Clear conversation"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${coachName} Coach`}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Coach Mode Switcher */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0B0F17] space-y-2">
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800">
            {coachModes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSwitchMode(m.id)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === m.id
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'coach' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Predict → Verify → Explain Loop</span>
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
          )}
        </div>

        {/* Offline Graceful Fallback Notice */}
        {!isOnline && (
          <div className="mx-4 mt-3 p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <WifiOff className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Offline Mode Active</p>
              <p className="mt-0.5 leading-relaxed">
                {coachName} needs an active internet connection. You can still read downloaded
                lessons, search the glossary, run IOS CLI labs, practice subnetting, solve service
                desk tickets, and take mock exams offline.
              </p>
            </div>
          </div>
        )}

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
                  : `${coachName}${msg.hintLevel && mode === 'coach' ? ` · Step ${msg.hintLevel}` : ''}`}
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
                {coachName}
              </span>
              <div className="rounded-xl px-3.5 py-2.5 text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60">
                {coachPersona === 'patch'
                  ? 'Reviewing ticket & troubleshooting clues...'
                  : 'Tracing packet path...'}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl p-3 border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{coachName} unavailable</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>

        {/* Escalation + Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-1.5">
          {mode === 'coach' && hintLevel < 3 && messages.length > 1 && (
            <button
              type="button"
              disabled={loading || !isOnline}
              onClick={escalateNextRung}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>
                Advance to {hintLevel === 1 ? 'Step 2 (Verify Clue)' : 'Step 3 (Full Explain)'}
              </span>
            </button>
          )}
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              type="button"
              disabled={loading || !isOnline}
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
            placeholder={
              isOnline
                ? `Ask ${coachName}, share your prediction, or reply...`
                : `Offline — reconnect to chat with ${coachName}`
            }
            className="flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !isOnline}
            aria-label={`Send message to ${coachName}`}
            className="px-3.5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </aside>
    </div>
  );
}
