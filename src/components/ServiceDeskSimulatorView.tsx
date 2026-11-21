import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Terminal,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  SERVICE_DESK_SCENARIOS,
  ServiceDeskScenario,
  SimConsoleAction,
  SimDeskTier,
  SimDirectoryState,
  SimDiagnosticsState,
  SimSkillLevel,
} from '../data/serviceDeskScenarios';
import { LocalProgressState } from '../types/ccna';

interface ServiceDeskSimulatorViewProps {
  progress: LocalProgressState;
  onBack: () => void;
  onRecordTicket: (ticketId: string, score: number, maxScore: number) => void;
  onAskZeroTicket: (scenario: ServiceDeskScenario, notes: string) => void;
}

type WorkbenchTab = 'chat' | 'cli' | 'directory' | 'diagnostics' | 'resolve';

interface ChatMessage {
  id: string;
  sender: 'requester' | 'tech' | 'system';
  text: string;
  note?: string;
  quality?: 'helpful' | 'neutral' | 'poor';
}

interface CliEntry {
  id: string;
  command: string;
  output: string;
  isKeyFinding?: boolean;
}

interface TicketSubmissionResult {
  score: number;
  maxScore: number;
  breakdown: {
    label: string;
    passed: boolean;
    detail: string;
  }[];
}

const LEVEL_FILTERS: { id: 'all' | SimSkillLevel; label: string }[] = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' },
];

const TIER_FILTERS: { id: 'all' | SimDeskTier; label: string }[] = [
  { id: 'all', label: 'All Tiers' },
  { id: 'tier-1', label: 'Tier 1' },
  { id: 'tier-2', label: 'Tier 2' },
];

function formatSkillLabel(level: SimSkillLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function formatDeskTierLabel(tier: SimDeskTier): string {
  return tier === 'tier-1' ? 'Tier 1' : 'Tier 2';
}

export function ServiceDeskSimulatorView({
  progress,
  onBack,
  onRecordTicket,
  onAskZeroTicket,
}: ServiceDeskSimulatorViewProps) {
  const [levelFilter, setLevelFilter] = useState<'all' | SimSkillLevel>('all');
  const [tierFilter, setTierFilter] = useState<'all' | SimDeskTier>('all');
  const [selectedId, setSelectedId] = useState<string>(SERVICE_DESK_SCENARIOS[0].id);
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('chat');

  // Per-ticket interactive session state
  const [askedChatIds, setAskedChatIds] = useState<string[]>([]);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [unlockedClues, setUnlockedClues] = useState<string[]>([]);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<CliEntry[]>([]);
  const [ranKeyCli, setRanKeyCli] = useState(false);

  const [dirState, setDirState] = useState<SimDirectoryState>(
    SERVICE_DESK_SCENARIOS[0].initialDirectory,
  );
  const [diagState, setDiagState] = useState<SimDiagnosticsState>(
    SERVICE_DESK_SCENARIOS[0].initialDiagnostics,
  );
  const [executedActionIds, setExecutedActionIds] = useState<string[]>([]);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [actionWarning, setActionWarning] = useState<string | null>(null);

  const [selectedRootCause, setSelectedRootCause] = useState<number | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<number | null>(null);
  const [submission, setSubmission] = useState<TicketSubmissionResult | null>(null);

  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [hintStep, setHintStep] = useState<0 | 1 | 2 | 3>(0);

  const filteredScenarios = useMemo(() => {
    return SERVICE_DESK_SCENARIOS.filter((s) => {
      if (levelFilter !== 'all' && s.skillLevel !== levelFilter) return false;
      if (tierFilter !== 'all' && s.deskTier !== tierFilter) return false;
      return true;
    });
  }, [levelFilter, tierFilter]);

  const activeScenario = useMemo(() => {
    return (
      filteredScenarios.find((s) => s.id === selectedId) ??
      filteredScenarios[0] ??
      SERVICE_DESK_SCENARIOS[0]
    );
  }, [filteredScenarios, selectedId]);

  const resetTicketState = (scenario: ServiceDeskScenario) => {
    setAskedChatIds([]);
    setChatLog([
      {
        id: 'initial',
        sender: 'requester',
        text: scenario.initialMessage,
      },
    ]);
    setUnlockedClues([]);
    setCliInput('');
    setCliHistory([]);
    setRanKeyCli(false);
    setDirState(scenario.initialDirectory);
    setDiagState(scenario.initialDiagnostics);
    setExecutedActionIds([]);
    setActionLog([]);
    setActionWarning(null);
    setSelectedRootCause(null);
    setSelectedResolution(null);
    setSubmission(null);
    setHintStep(0);
    setWorkbenchTab('chat');
  };

  useEffect(() => {
    resetTicketState(activeScenario);
  }, [activeScenario.id]);

  const solvedCount = useMemo(
    () =>
      SERVICE_DESK_SCENARIOS.filter(
        (s) => (progress.completedSimTickets[s.id]?.score ?? 0) >= 3,
      ).length,
    [progress.completedSimTickets],
  );

  const handleAskChat = (optionId: string) => {
    const opt = activeScenario.chatOptions.find((c) => c.id === optionId);
    if (!opt || askedChatIds.includes(optionId)) return;

    setAskedChatIds((prev) => [...prev, optionId]);
    setActionWarning(null);
    setChatLog((prev) => [
      ...prev,
      { id: `${optionId}-q`, sender: 'tech', text: opt.question },
      {
        id: `${optionId}-r`,
        sender: 'requester',
        text: opt.userReply,
        note: opt.feedbackNote,
        quality: opt.quality,
      },
    ]);

    if (opt.unlocksClue) {
      setUnlockedClues((prev) =>
        prev.includes(opt.unlocksClue!) ? prev : [...prev, opt.unlocksClue!],
      );
    }
  };

  const executeCliCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setCliHistory([]);
      setCliInput('');
      return;
    }

    if (lower === 'help' || lower === '?') {
      const hintList = activeScenario.cliHintCommands.map((c) => `  - ${c}`).join('\n');
      setCliHistory((prev) => [
        ...prev,
        {
          id: `cli-${Date.now()}`,
          command: trimmed,
          output: `Available diagnostic commands on ${activeScenario.deviceHostname}:\n${hintList}\n  - clear`,
        },
      ]);
      setCliInput('');
      return;
    }

    const matched = activeScenario.cliResponses.find((resp) =>
      resp.match.some((token) => lower.includes(token.toLowerCase())),
    );

    if (matched) {
      if (matched.isKeyFinding) {
        setRanKeyCli(true);
      }
      setCliHistory((prev) => [
        ...prev,
        {
          id: `cli-${Date.now()}`,
          command: trimmed,
          output: matched.output,
          isKeyFinding: matched.isKeyFinding,
        },
      ]);
    } else {
      setCliHistory((prev) => [
        ...prev,
        {
          id: `cli-${Date.now()}`,
          command: trimmed,
          output: `'${trimmed}' returned no actionable diagnostic delta in this simulated endpoint. Try 'help' or click a suggested diagnostic command above.`,
        },
      ]);
    }
    setCliInput('');
  };

  const handleCliSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeCliCommand(cliInput);
  };

  const handleConsoleAction = (action: SimConsoleAction) => {
    if (executedActionIds.includes(action.id)) return;

    if (action.requiresChatId && !askedChatIds.includes(action.requiresChatId)) {
      setActionWarning(
        action.warningIfPremature ??
          'Verify required information in User Chat before executing this administrative change.',
      );
      return;
    }

    setActionWarning(null);
    setExecutedActionIds((prev) => [...prev, action.id]);
    setActionLog((prev) => [...prev, action.effectSummary]);

    if (action.mutatesDirectory) {
      setDirState((prev) => ({ ...prev, ...action.mutatesDirectory }));
    }
    if (action.mutatesDiagnostics) {
      setDiagState((prev) => ({ ...prev, ...action.mutatesDiagnostics }));
    }
  };

  const handleSubmitResolution = () => {
    if (selectedRootCause === null || selectedResolution === null) return;

    const askedExpectedChat =
      activeScenario.expectedChatIds.length === 0 ||
      activeScenario.expectedChatIds.every((id) => askedChatIds.includes(id));

    const poorChatCount = chatLog.filter((m) => m.quality === 'poor').length;
    const investigatedCliOrConsole =
      ranKeyCli || cliHistory.length > 0 || askedChatIds.length > 0;

    const actionsCompleted = activeScenario.expectedActionIds.every((id) =>
      executedActionIds.includes(id),
    );

    const rootCauseCorrect = selectedRootCause === activeScenario.correctRootCauseIdx;
    const resolutionCorrect = selectedResolution === activeScenario.correctResolutionIdx;

    const breakdown = [
      {
        label: '1. Intake & User Triage',
        passed: askedExpectedChat && poorChatCount === 0,
        detail:
          askedExpectedChat && poorChatCount === 0
            ? 'Asked key clarifying / verification questions without premature assumptions.'
            : poorChatCount > 0
              ? 'Avoid poor or premature technician remarks in User Chat before isolating the fault.'
              : 'Missed a required diagnostic or identity verification question in User Chat.',
      },
      {
        label: '2. Evidence Gathering & CLI Diagnostics',
        passed: investigatedCliOrConsole && (ranKeyCli || cliHistory.length > 0),
        detail:
          ranKeyCli || cliHistory.length > 0
            ? 'Verified endpoint state using Endpoint CLI or console logs prior to closing.'
            : 'Run at least one diagnostic inspection command in Endpoint CLI to confirm technical evidence.',
      },
      {
        label: '3. Safe Remediation & Escalation Execution',
        passed: actionsCompleted,
        detail: actionsCompleted
          ? 'Completed all required AD/Entra, endpoint, or escalation actions cleanly.'
          : 'One or more required remediation/escalation actions in AD/Entra or Diagnostics were not executed.',
      },
      {
        label: '4. Root Cause & Resolution Accuracy',
        passed: rootCauseCorrect && resolutionCorrect,
        detail:
          rootCauseCorrect && resolutionCorrect
            ? 'Correctly identified root cause and selected the policy-compliant resolution plan.'
            : !rootCauseCorrect && !resolutionCorrect
              ? 'Both the selected Root Cause and Resolution Plan need revision.'
              : !rootCauseCorrect
                ? 'Resolution plan is close, but the Root Cause selection is inaccurate.'
                : 'Root Cause is right, but the Resolution Plan choice is incomplete or risky.',
      },
    ];

    const score = breakdown.filter((b) => b.passed).length;
    setSubmission({ score, maxScore: 4, breakdown });
    onRecordTicket(activeScenario.id, score, 4);
  };

  const handleNextTicket = () => {
    const idx = filteredScenarios.findIndex((s) => s.id === activeScenario.id);
    if (idx >= 0 && idx + 1 < filteredScenarios.length) {
      setSelectedId(filteredScenarios[idx + 1].id);
    } else if (filteredScenarios.length > 0) {
      setSelectedId(filteredScenarios[0].id);
    }
  };

  const directoryActions = activeScenario.consoleActions.filter(
    (a) => a.targetTab === 'directory',
  );
  const diagnosticActions = activeScenario.consoleActions.filter(
    (a) => a.targetTab === 'diagnostics',
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header & Back */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            IT Service Desk Simulator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Triage realistic Tier 1 &amp; Tier 2 incidents across User Chat, Endpoint CLI, Active
            Directory / Entra ID, and Event Diagnostics.
          </p>
        </div>

        <div className="text-right space-y-1">
          <div className="font-display text-xl font-bold text-slate-950 dark:text-white tabular-nums">
            {solvedCount} / {SERVICE_DESK_SCENARIOS.length} Tickets Solved
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            3+ / 4 Rubric Score Marks Resolved
          </div>
        </div>
      </div>

      {/* Filter Bar: Skill Level & Support Tier */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1.5">
            Level:
          </span>
          {LEVEL_FILTERS.map((f) => {
            const active = levelFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setLevelFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1.5">
            Desk Tier:
          </span>
          {TIER_FILTERS.map((t) => {
            const active = tierFilter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTierFilter(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Zone Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Queue */}
        <aside className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Ticket Queue ({filteredScenarios.length})</span>
            <span>Select Incident</span>
          </div>

          {filteredScenarios.length === 0 ? (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] text-sm text-slate-500 dark:text-slate-400">
              No tickets match this Level + Desk Tier combination. Try switching to All Levels or
              All Tiers.
            </div>
          ) : (
            <div className="space-y-2 max-h-[760px] overflow-y-auto pr-0.5">
              {filteredScenarios.map((ticket) => {
                const selected = ticket.id === activeScenario.id;
                const saved = progress.completedSimTickets[ticket.id];
                const passed = (saved?.score ?? 0) >= 3;

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedId(ticket.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      selected
                        ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>
                        {ticket.ticketNumber} · {ticket.priority}
                      </span>
                      <span
                        className={
                          passed
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }
                      >
                        {saved ? `${saved.score}/${saved.maxScore}` : formatDeskTierLabel(ticket.deskTier)}
                      </span>
                    </div>

                    <div className="mt-1.5 text-sm font-semibold text-slate-950 dark:text-white leading-snug">
                      {ticket.subject}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        {ticket.requesterName} · {ticket.department}
                      </span>
                      <span className="font-medium text-sky-600 dark:text-sky-400">
                        {formatSkillLabel(ticket.skillLevel)} · {formatDeskTierLabel(ticket.deskTier)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right Active Ticket Workbench */}
        <section className="lg:col-span-8 space-y-5">
          {/* Active Incident Summary Header */}
          <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-sky-600 dark:text-sky-400">
                    {activeScenario.ticketNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScenario.priority}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatSkillLabel(activeScenario.skillLevel)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDeskTierLabel(activeScenario.deskTier)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScenario.category}</span>
                </div>

                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  {activeScenario.subject}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Requester: {activeScenario.requesterName} ({activeScenario.requesterRole},{' '}
                  {activeScenario.department}) · Host: {activeScenario.deviceHostname} · SLA:{' '}
                  {activeScenario.slaTarget}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => resetTicketState(activeScenario)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAskZeroTicket(
                      activeScenario,
                      `Clues uncovered: ${unlockedClues.join(' | ') || 'None yet'}. CLI findings: ${
                        cliHistory.map((c) => c.command).join(', ') || 'None yet'
                      }. Actions run: ${executedActionIds.join(', ') || 'None yet'}.`,
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 whitespace-nowrap shrink-0"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask Coach Zero</span>
                </button>
              </div>
            </div>

            {/* Uncovered Clues Strip */}
            {unlockedClues.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Investigation Findings Log ({unlockedClues.length})
                </div>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {unlockedClues.map((clue, idx) => (
                    <li key={idx}>{clue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Premature / Security Guard Warning */}
            {actionWarning && (
              <div className="p-3.5 rounded-lg border border-amber-500/50 bg-amber-500/10 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <span className="font-semibold">Procedure / Security Gate: </span>
                  <span>{actionWarning}</span>
                </div>
              </div>
            )}

            {/* Workbench Sub-Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {(
                [
                  { id: 'chat', label: 'User Chat', icon: MessageSquare },
                  { id: 'cli', label: 'Endpoint CLI', icon: Terminal },
                  { id: 'directory', label: 'AD / Entra Console', icon: UserCheck },
                  { id: 'diagnostics', label: 'System Diagnostics', icon: Wrench },
                  { id: 'resolve', label: 'Resolve & Grade', icon: ShieldCheck },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = workbenchTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setWorkbenchTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Workbench Tab Panel */}
          <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-5">
            {workbenchTab === 'chat' && (
              <div className="space-y-5">
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {chatLog.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl text-sm ${
                        msg.sender === 'tech'
                          ? 'bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 ml-6'
                          : 'bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 mr-6'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        {msg.sender === 'tech' ? 'You (IT Support)' : activeScenario.requesterName}
                      </div>
                      <p className="text-slate-900 dark:text-slate-100 leading-relaxed">
                        {msg.text}
                      </p>
                      {msg.note && (
                        <p
                          className={`mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs ${
                            msg.quality === 'poor'
                              ? 'text-rose-600 dark:text-rose-400 font-medium'
                              : msg.quality === 'helpful'
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Coach Note: {msg.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Choose Your Response / Clarifying Question
                  </div>
                  <div className="space-y-2">
                    {activeScenario.chatOptions.map((opt) => {
                      const alreadyAsked = askedChatIds.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={alreadyAsked}
                          onClick={() => handleAskChat(opt.id)}
                          className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-colors ${
                            alreadyAsked
                              ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                              : 'border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-500 hover:bg-sky-50/40 dark:hover:bg-sky-500/10'
                          }`}
                        >
                          {opt.question}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {workbenchTab === 'cli' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Remote PowerShell / Endpoint Shell · Target: {activeScenario.deviceHostname}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Type &apos;help&apos; or &apos;clear&apos;
                  </span>
                </div>

                {/* Suggested Diagnostic Commands */}
                <div className="flex flex-wrap gap-1.5">
                  {activeScenario.cliHintCommands.map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => executeCliCommand(cmd)}
                      className="px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>

                {/* Terminal Output */}
                <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed min-h-[240px] max-h-[360px] overflow-y-auto space-y-3 border border-slate-800">
                  <div className="text-slate-400">
                    PS C:\Users\itadmin&gt; Connected to \\{activeScenario.deviceHostname} (WinRM)
                  </div>

                  {cliHistory.map((entry) => (
                    <div key={entry.id} className="space-y-1">
                      <div className="text-sky-400">
                        PS C:\&gt; {entry.command}
                      </div>
                      <pre className="whitespace-pre-wrap break-words text-slate-200 font-mono">
                        {entry.output}
                      </pre>
                      {entry.isKeyFinding && (
                        <div className="text-emerald-400">
                          [Key diagnostic clue observed]
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCliSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder="Enter diagnostic command (e.g. ipconfig /all, systeminfo, gpresult /r)..."
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 whitespace-nowrap shrink-0"
                  >
                    Run Command
                  </button>
                </form>
              </div>
            )}

            {workbenchTab === 'directory' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-slate-500 dark:text-slate-400">User &amp; UPN</div>
                    <div className="font-semibold text-slate-950 dark:text-white">
                      {dirState.displayName} ({dirState.upn})
                    </div>
                    <div className="font-mono text-slate-500 dark:text-slate-400 break-all">
                      {dirState.ou}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-slate-500 dark:text-slate-400">Account &amp; Lockout</div>
                    <div className="font-semibold text-slate-950 dark:text-white">
                      Enabled: {dirState.accountEnabled ? 'Yes' : 'No'} · Locked Out:{' '}
                      <span
                        className={
                          dirState.lockedOut
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }
                      >
                        {dirState.lockedOut ? 'YES' : 'No'}
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Bad Pwd Count: {dirState.badPwdCount} · Last Set: {dirState.passwordLastSet}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-slate-500 dark:text-slate-400">
                      M365 License &amp; MFA Status
                    </div>
                    <div className="font-semibold text-slate-950 dark:text-white">
                      {dirState.m365License}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      MFA: {dirState.mfaStatus}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-slate-500 dark:text-slate-400">
                      Active Sessions &amp; Inbox Rules
                    </div>
                    <div className="font-semibold text-slate-950 dark:text-white">
                      {dirState.activeSessions}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Inbox Rules: {dirState.inboxRules}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="text-slate-500 dark:text-slate-400">
                    Security Groups &amp; BitLocker Recovery Key
                  </div>
                  <div className="font-mono text-slate-900 dark:text-slate-100">
                    Groups: {dirState.groups.length > 0 ? dirState.groups.join(', ') : 'None'}
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-300">
                    BitLocker Key: {dirState.bitlockerKey}
                  </div>
                </div>

                {/* AD / Entra Remediation Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    AD / Entra ID Administrative Actions
                  </div>
                  {directoryActions.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No Active Directory or Entra ID changes are required for this ticket. Inspect
                      System Diagnostics or Endpoint CLI.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {directoryActions.map((act) => {
                        const done = executedActionIds.includes(act.id);
                        return (
                          <button
                            key={act.id}
                            type="button"
                            disabled={done}
                            onClick={() => handleConsoleAction(act)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                              done
                                ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 cursor-default'
                                : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400'
                            }`}
                          >
                            {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>{act.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {workbenchTab === 'diagnostics' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-slate-500 dark:text-slate-400">OS &amp; Uptime</div>
                    <div className="font-semibold text-slate-950 dark:text-white">
                      {diagState.hostOs}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Uptime: {diagState.uptime}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-slate-500 dark:text-slate-400">Network Config</div>
                    <div className="font-mono font-semibold text-slate-950 dark:text-white">
                      IPv4: {diagState.ipv4}
                    </div>
                    <div className="font-mono text-slate-500 dark:text-slate-400">
                      DNS: {diagState.dnsServer}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="text-slate-500 dark:text-slate-400">Hardware / Environment</div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {diagState.hardwareSummary}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Services &amp; Subsystems
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {diagState.services.map((svc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-950 dark:text-white">
                          <span>{svc.name}</span>
                          <span className="font-mono text-sky-600 dark:text-sky-400">
                            {svc.status}
                          </span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">{svc.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Recent Event Viewer / Telemetry Logs
                  </div>
                  <div className="space-y-1.5">
                    {diagState.eventLogs.map((ev, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <div className="font-mono text-slate-500 dark:text-slate-400">
                          {ev.time} · {ev.source} · Event ID {ev.eventId}
                        </div>
                        <div className="mt-1 text-slate-900 dark:text-slate-100">{ev.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Endpoint Diagnostics & Escalation Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Endpoint Remediation &amp; Escalation Actions
                  </div>
                  {diagnosticActions.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No local diagnostics actions required on this ticket. Check AD / Entra Console.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {diagnosticActions.map((act) => {
                        const done = executedActionIds.includes(act.id);
                        return (
                          <button
                            key={act.id}
                            type="button"
                            disabled={done}
                            onClick={() => handleConsoleAction(act)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                              done
                                ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 cursor-default'
                                : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400'
                            }`}
                          >
                            {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>{act.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {workbenchTab === 'resolve' && (
              <div className="space-y-6">
                {actionLog.length > 0 && (
                  <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-1">
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Executed Remediation Actions ({actionLog.length})
                    </div>
                    <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                      {actionLog.map((entry, idx) => (
                        <li key={idx}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Root Cause Choice */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    1. Select Confirmed Root Cause
                  </div>
                  <div className="space-y-2">
                    {activeScenario.rootCauseOptions.map((opt, idx) => {
                      const selected = selectedRootCause === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedRootCause(idx)}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-colors ${
                            selected
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-slate-950 dark:text-white font-medium'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resolution / Escalation Plan */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    2. Select Resolution / Escalation Plan
                  </div>
                  <div className="space-y-2">
                    {activeScenario.resolutionOptions.map((opt, idx) => {
                      const selected = selectedResolution === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedResolution(idx)}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-colors ${
                            selected
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-slate-950 dark:text-white font-medium'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={selectedRootCause === null || selectedResolution === null}
                    onClick={handleSubmitResolution}
                    className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 whitespace-nowrap shrink-0 transition-colors"
                  >
                    Submit Ticket Resolution
                  </button>
                </div>

                {/* Grader Rubric Results */}
                {submission && (
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                        Ticket Evaluation: {submission.score} / {submission.maxScore}
                      </h3>
                      <span
                        className={`text-xs font-semibold ${
                          submission.score >= 3
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {submission.score === 4
                          ? 'Gold Standard Resolution'
                          : submission.score >= 3
                            ? 'Ticket Resolved (Acceptable)'
                            : 'Needs Review — Check Missed Steps Below'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {submission.breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-white dark:bg-[#101622] border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-slate-900 dark:text-white">{item.label}</span>
                            <span
                              className={
                                item.passed
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }
                            >
                              {item.passed ? 'PASS' : 'NEEDS WORK'}
                            </span>
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-400">{item.detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-lg bg-sky-500/5 border border-sky-500/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeScenario.howAndWhy}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => resetTicketState(activeScenario)}
                        className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Retry Ticket
                      </button>

                      <button
                        type="button"
                        onClick={handleNextTicket}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                      >
                        <span>Next Ticket</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Collapsible Hint Ladder & How/Why Walkthrough */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] overflow-hidden">
            <button
              type="button"
              onClick={() => setGuidanceOpen((v) => !v)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span>Stuck on this ticket? Open Guided Hint Ladder &amp; How / Why</span>
              {guidanceOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {guidanceOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs sm:text-sm">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setHintStep(1)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Reveal Hint 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setHintStep(2)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Reveal Hint 2
                  </button>
                  <button
                    type="button"
                    onClick={() => setHintStep(3)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                  >
                    Show Full How &amp; Why
                  </button>
                </div>

                {hintStep >= 1 && (
                  <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Hint 1: </span>
                    {activeScenario.hints[0]}
                  </p>
                )}

                {hintStep >= 2 && (
                  <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Hint 2: </span>
                    {activeScenario.hints[1]}
                  </p>
                )}

                {hintStep >= 3 && (
                  <p className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/30 text-slate-800 dark:text-slate-200 leading-relaxed">
                    {activeScenario.howAndWhy}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
