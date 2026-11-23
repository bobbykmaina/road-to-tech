import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardCopy,
  Compass,
  FileText,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  RotateCcw,
  Sparkles,
  Terminal,
  Wrench,
  XCircle,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { QuizAttemptRecord, WorkspaceTab } from '../types/ccna';
import {
  DeepLessonDocument,
  GlossaryEntry,
  LessonProgressStatus,
  VersionAddendum,
} from '../types/curriculum';

interface DeepLessonRendererProps {
  lesson: DeepLessonDocument;
  status: LessonProgressStatus;
  bookmarked: boolean;
  savedNote: string;
  savedCheck?: QuizAttemptRecord;
  comfortableReadingMode: boolean;
  versionAddendum?: VersionAddendum;
  onSetStatus: (status: LessonProgressStatus) => void;
  onToggleBookmark: () => void;
  onSaveNote: (note: string) => void;
  onSaveCheck: (record: QuizAttemptRecord) => void;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onAskPing: (label: string, payload: string, prompt: string) => void;
}

function OspfStateMachineSvg() {
  return (
    <svg
      viewBox="0 0 820 230"
      className="w-full h-auto text-slate-800 dark:text-slate-100"
      role="img"
      aria-label="OSPFv2 neighbor state machine from Down to Full and DROTHER 2-Way branch"
    >
      <defs>
        <marker
          id="ospf-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" className="text-sky-500" />
        </marker>
      </defs>

      {/* Main row boxes */}
      {[
        { x: 16, y: 36, w: 86, h: 48, title: '1. Down', sub: 'No Hellos' },
        { x: 126, y: 36, w: 92, h: 48, title: '2. Init', sub: '1-Way Hello' },
        { x: 242, y: 36, w: 106, h: 48, title: '3. 2-Way', sub: 'DR/BDR Elect' },
        { x: 374, y: 36, w: 100, h: 48, title: '4. ExStart', sub: 'RID + MTU' },
        { x: 498, y: 36, w: 96, h: 48, title: '5. Exchange', sub: 'DBD Headers' },
        { x: 618, y: 36, w: 92, h: 48, title: '6. Loading', sub: 'LSR / LSU' },
        { x: 732, y: 36, w: 74, h: 48, title: '7. Full', sub: 'SPF Ready' },
      ].map((box, idx) => (
        <g key={box.title}>
          <rect
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            rx="8"
            fill="currentColor"
            className={
              idx === 6
                ? 'text-emerald-500/15 stroke-emerald-500'
                : idx === 2
                  ? 'text-sky-500/15 stroke-sky-500'
                  : 'text-slate-100 dark:text-slate-800/90 stroke-slate-300 dark:stroke-slate-700'
            }
            strokeWidth="1.5"
          />
          <text
            x={box.x + box.w / 2}
            y={box.y + 21}
            textAnchor="middle"
            className="fill-slate-900 dark:fill-white text-[12px] font-bold"
          >
            {box.title}
          </text>
          <text
            x={box.x + box.w / 2}
            y={box.y + 37}
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
          >
            {box.sub}
          </text>
        </g>
      ))}

      {/* Arrows */}
      {[
        [102, 60, 124, 60],
        [218, 60, 240, 60],
        [348, 60, 372, 60],
        [474, 60, 496, 60],
        [594, 60, 616, 60],
        [710, 60, 730, 60],
      ].map(([x1, y1, x2, y2], idx) => (
        <line
          key={idx}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          className="text-sky-500"
          strokeWidth="1.75"
          markerEnd="url(#ospf-arrow)"
        />
      ))}

      {/* DROTHER branch below 2-Way */}
      <line
        x1="295"
        y1="84"
        x2="295"
        y2="132"
        stroke="currentColor"
        className="text-amber-500"
        strokeWidth="1.75"
        strokeDasharray="4 3"
        markerEnd="url(#ospf-arrow)"
      />
      <rect
        x="160"
        y="136"
        width="270"
        height="64"
        rx="8"
        fill="currentColor"
        className="text-amber-500/10 stroke-amber-500"
        strokeWidth="1.5"
      />
      <text
        x="295"
        y="159"
        textAnchor="middle"
        className="fill-amber-700 dark:fill-amber-300 text-[12px] font-bold"
      >
        DROTHER ↔ DROTHER (Broadcast LAN)
      </text>
      <text
        x="295"
        y="177"
        textAnchor="middle"
        className="fill-slate-600 dark:fill-slate-300 text-[11px]"
      >
        Intentionally stay at 2WAY/DROTHER — sync via DR &amp; BDR
      </text>
      <text
        x="295"
        y="192"
        textAnchor="middle"
        className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
      >
        Healthy Steady State (No LSA flooding waste)
      </text>

      {/* MTU Gate callout under ExStart */}
      <rect
        x="488"
        y="136"
        width="280"
        height="64"
        rx="8"
        fill="currentColor"
        className="text-rose-500/10 stroke-rose-500/70"
        strokeWidth="1.25"
      />
      <text
        x="628"
        y="159"
        textAnchor="middle"
        className="fill-rose-700 dark:fill-rose-300 text-[12px] font-bold"
      >
        Stuck in ExStart? Check IP MTU!
      </text>
      <text
        x="628"
        y="177"
        textAnchor="middle"
        className="fill-slate-600 dark:fill-slate-300 text-[11px]"
      >
        Reaching ExStart proves Hello rules matched.
      </text>
      <text
        x="628"
        y="192"
        textAnchor="middle"
        className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
      >
        GRE/Tunnel MTU mismatch freezes DBD sync.
      </text>
    </svg>
  );
}

function SupportTiersSvg() {
  return (
    <svg
      viewBox="0 0 820 220"
      className="w-full h-auto text-slate-800 dark:text-slate-100"
      role="img"
      aria-label="IT Support Tier 1, Tier 2, and Tier 3 triage and warm escalation workflow"
    >
      <defs>
        <marker
          id="sup-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" className="text-sky-500" />
        </marker>
      </defs>

      {/* Intake */}
      <rect
        x="16"
        y="50"
        width="136"
        height="88"
        rx="8"
        fill="currentColor"
        className="text-slate-100 dark:text-slate-800 stroke-slate-300 dark:stroke-slate-700"
        strokeWidth="1.5"
      />
      <text x="84" y="76" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[12px] font-bold">
        User Ticket / Call
      </text>
      <text x="84" y="96" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10.5px]">
        Portal · Phone · Chat
      </text>
      <text x="84" y="114" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono">
        Vague symptom
      </text>

      {/* Tier 1 */}
      <rect
        x="186"
        y="34"
        width="210"
        height="120"
        rx="8"
        fill="currentColor"
        className="text-sky-500/12 stroke-sky-500"
        strokeWidth="1.6"
      />
      <text x="291" y="58" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300 text-[12.5px] font-bold">
        Tier 1 (L1 Service Desk)
      </text>
      <text x="291" y="79" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10.5px]">
        1. Empathize &amp; Verify Identity
      </text>
      <text x="291" y="96" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10.5px]">
        2. Scope + Impact × Urgency Priority
      </text>
      <text x="291" y="113" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10.5px]">
        3. Run L1 Checks (AD, ipconfig, Logs)
      </text>
      <text x="291" y="135" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 text-[10.5px] font-semibold">
        ~65–75% Resolved Direct (FCR)
      </text>

      {/* Tier 2 */}
      <rect
        x="442"
        y="34"
        width="176"
        height="120"
        rx="8"
        fill="currentColor"
        className="text-amber-500/10 stroke-amber-500"
        strokeWidth="1.5"
      />
      <text x="530" y="58" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 text-[12.5px] font-bold">
        Tier 2 (Sys / Desktop)
      </text>
      <text x="530" y="80" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10.5px]">
        GPO, Intune, VPN Routes,
      </text>
      <text x="530" y="97" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10.5px]">
        Exchange &amp; Endpoint Deep Fix
      </text>
      <text x="530" y="128" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono">
        Receives Warm Escalation
      </text>

      {/* Tier 3 */}
      <rect
        x="658"
        y="50"
        width="146"
        height="88"
        rx="8"
        fill="currentColor"
        className="text-slate-100 dark:text-slate-800 stroke-slate-300 dark:stroke-slate-700"
        strokeWidth="1.5"
      />
      <text x="731" y="76" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[12px] font-bold">
        Tier 3 (Architects)
      </text>
      <text x="731" y="96" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10.5px]">
        Core Infra · Vendor ·
      </text>
      <text x="731" y="114" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10.5px]">
        Cloud / Schema Bugs
      </text>

      {/* Arrows */}
      <line x1="152" y1="94" x2="184" y2="94" stroke="currentColor" className="text-sky-500" strokeWidth="1.75" markerEnd="url(#sup-arrow)" />
      <line x1="396" y1="94" x2="440" y2="94" stroke="currentColor" className="text-sky-500" strokeWidth="1.75" markerEnd="url(#sup-arrow)" />
      <line x1="618" y1="94" x2="656" y2="94" stroke="currentColor" className="text-sky-500" strokeWidth="1.75" markerEnd="url(#sup-arrow)" />

      {/* Warm Escalation label */}
      <text x="418" y="178" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10.5px]">
        Never cold-transfer blank tickets — attach Hostname + Scope + Exact Error + L1 Checks Run
      </text>
    </svg>
  );
}

function GlossaryHighlightText({
  text,
  terms,
  onSelectTerm,
}: {
  text: string;
  terms: GlossaryEntry[];
  onSelectTerm: (term: GlossaryEntry) => void;
}) {
  if (!terms.length) return <>{text}</>;
  const lookup = terms.slice(0, 6);
  // Highlight first appearance of one matching glossary term cleanly
  for (const entry of lookup) {
    const baseWord = entry.term.split('(')[0].trim();
    if (baseWord.length < 4) continue;
    const idx = text.toLowerCase().indexOf(baseWord.toLowerCase());
    if (idx !== -1) {
      const before = text.slice(0, idx);
      const match = text.slice(idx, idx + baseWord.length);
      const after = text.slice(idx + baseWord.length);
      return (
        <>
          {before}
          <button
            type="button"
            onClick={() => onSelectTerm(entry)}
            title={`${entry.term}: ${entry.shortDef}`}
            className="underline decoration-dotted decoration-sky-500/80 underline-offset-4 text-sky-700 dark:text-sky-300 hover:text-sky-500 font-medium"
          >
            {match}
          </button>
          {after}
        </>
      );
    }
  }
  return <>{text}</>;
}

export function DeepLessonRenderer({
  lesson,
  status,
  bookmarked,
  savedNote,
  savedCheck,
  comfortableReadingMode,
  versionAddendum,
  onSetStatus,
  onToggleBookmark,
  onSaveNote,
  onSaveCheck,
  onNavigateTab,
  onAskPing,
}: DeepLessonRendererProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    savedCheck?.selected ?? {},
  );
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(Boolean(savedCheck));
  const [activeTerm, setActiveTerm] = useState<GlossaryEntry | null>(null);
  const [showAscii, setShowAscii] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);

  useEffect(() => {
    setSelectedAnswers(savedCheck?.selected ?? {});
    setQuizSubmitted(Boolean(savedCheck));
    setActiveTerm(null);
    setShowAscii(false);
  }, [lesson.id, savedCheck]);

  const allAnswered = lesson.checkQuestions.every((q) => selectedAnswers[q.id] !== undefined);
  const checkScore = lesson.checkQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex,
  ).length;

  const handleQuizSubmit = () => {
    if (!allAnswered) return;
    setQuizSubmitted(true);
    onSaveCheck({
      score: checkScore,
      total: lesson.checkQuestions.length,
      selected: selectedAnswers,
      completedAt: new Date().toISOString(),
    });
  };

  const renderSectionHeading = (num: string, title: string, icon?: ReactNode) => (
    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
      {icon}
      <h2 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
        {num}. {title}
      </h2>
    </div>
  );

  const scopeLabel =
    lesson.versionScope === 'shared'
      ? 'Shared (CCNA v1.1 & v2.0)'
      : lesson.versionScope === 'v2.0-only'
        ? 'CCNA v2.0 Exclusive'
        : 'CCNA v1.1 Exclusive';

  return (
    <article
      className={`space-y-9 ${
        comfortableReadingMode ? 'max-w-[74ch] mx-auto leading-relaxed' : 'max-w-none'
      }`}
    >
      {/* Lesson Top Header */}
      <header className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span className="font-mono font-semibold text-sky-600 dark:text-sky-400">
              {lesson.id}
            </span>
            <span aria-hidden="true">·</span>
            <span>{lesson.unitTitle}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.readMinutes} min read</span>
            {lesson.moduleId === 'ccna' && (
              <>
                <span aria-hidden="true">·</span>
                <span>{scopeLabel}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                bookmarked
                  ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onAskPing(
                  `${lesson.code} · ${lesson.title}`,
                  `Lesson ID: ${lesson.id}\nModule: ${lesson.moduleId}\nTopic: ${lesson.topicTitle}\nSummary: ${lesson.plainEnglish.technicalDefinition}`,
                  `Walk me through "${lesson.title}" using your Predict → Verify → Explain loop—start by giving me one concrete scenario and asking me to predict what happens!`,
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>
                Practice with {lesson.moduleId === 'it-support' ? 'Patch' : 'Ping'}
              </span>
            </button>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white leading-tight">
          {lesson.code} {lesson.title}
        </h1>

        {/* Prerequisites & Exam Mapping Metadata */}
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Prerequisites: </span>
            <span>{lesson.prerequisites.join(' · ')}</span>
          </div>
          {lesson.v20ExamTopics && (
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                CCNA v2.0 Blueprint:{' '}
              </span>
              <span>{lesson.v20ExamTopics.join('; ')}</span>
            </div>
          )}
          {lesson.v11ExamTopics && (
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                CCNA v1.1 Blueprint:{' '}
              </span>
              <span>{lesson.v11ExamTopics.join('; ')}</span>
            </div>
          )}
        </div>

        {/* Interactive Progress Status Switch */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Lesson Progress Status
          </span>
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0B0F17]">
            {(
              [
                { id: 'not-started', label: 'Not Started' },
                { id: 'in-progress', label: 'In Progress' },
                { id: 'mastered', label: 'Mastered' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSetStatus(opt.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  status === opt.id
                    ? opt.id === 'mastered'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Track-specific Version Addendum (kept cleanly separate from shared notes) */}
      {versionAddendum && (
        <section className="p-5 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Version-Specific Addendum · Separate from Shared Core Notes</span>
          </div>
          <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
            {versionAddendum.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {versionAddendum.summary}
          </p>
          <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-disc list-inside">
            {versionAddendum.points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
          {versionAddendum.cliOrWorkflowDiff && (
            <div className="p-3 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs">
              {versionAddendum.cliOrWorkflowDiff}
            </div>
          )}
        </section>
      )}

      {/* Inline Glossary Popup Banner when a highlighted term is clicked */}
      {activeTerm && (
        <div className="p-4 rounded-xl border border-sky-500/40 bg-sky-500/10 flex items-start justify-between gap-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <div className="font-display font-bold text-sky-800 dark:text-sky-300">
              Glossary Definition: {activeTerm.term}
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {activeTerm.fullDef}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTerm(null)}
            className="text-xs font-semibold text-sky-700 dark:text-sky-300 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Learning Objectives */}
      <section className="space-y-3">
        {renderSectionHeading(
          '1',
          'Learning Objectives',
          <Compass className="w-5 h-5 text-sky-500 shrink-0" />,
        )}
        <p className="text-sm text-slate-600 dark:text-slate-400">
          By the end of this lesson, you will be able to:
        </p>
        <ul className="space-y-2 text-sm sm:text-base text-slate-800 dark:text-slate-200">
          {lesson.learningObjectives.map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 mt-1 tabular-nums">
                0{idx + 1}.
              </span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Why This Matters */}
      <section className="space-y-3">
        {renderSectionHeading(
          '2',
          'Why This Matters in Practice',
          <BookOpen className="w-5 h-5 text-amber-500 shrink-0" />,
        )}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-2">
          <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
            {lesson.whyThisMatters.scenarioTitle}
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {lesson.whyThisMatters.narrative}
          </p>
        </div>
      </section>

      {/* 3. Plain-English Explanation + Everyday Analogy */}
      <section className="space-y-4">
        {renderSectionHeading(
          '3',
          'Plain-English Explanation',
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />,
        )}

        <div className="p-5 rounded-xl border border-sky-500/30 bg-sky-500/5 space-y-2">
          <div className="text-xs font-semibold text-sky-700 dark:text-sky-300">
            Everyday Analogy · {lesson.plainEnglish.analogyTitle}
          </div>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
            {lesson.plainEnglish.analogy}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Precise Technical Definition
          </div>
          <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
            <GlossaryHighlightText
              text={lesson.plainEnglish.technicalDefinition}
              terms={lesson.keyTerms}
              onSelectTerm={setActiveTerm}
            />
          </p>
        </div>

        <div className="space-y-3">
          {lesson.plainEnglish.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              <GlossaryHighlightText
                text={para}
                terms={lesson.keyTerms}
                onSelectTerm={setActiveTerm}
              />
            </p>
          ))}
        </div>
      </section>

      {/* 4. Deep Dive: Mechanism, Diagram & Worked Example */}
      <section className="space-y-5">
        {renderSectionHeading(
          '4',
          'Deep Dive: Step-by-Step Mechanism & Worked Trace',
          <Wrench className="w-5 h-5 text-sky-500 shrink-0" />,
        )}

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {lesson.deepDive.intro}
        </p>

        {/* Mechanism Steps */}
        <div className="space-y-3">
          {lesson.deepDive.steps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-1"
            >
              <div className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">
                {s.step} · {s.title}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {s.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Diagram (SVG + ASCII toggle) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Visual Reference Diagram
            </span>
            <button
              type="button"
              onClick={() => setShowAscii((v) => !v)}
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
            >
              {showAscii ? 'Show Vector Diagram' : 'Show Plain ASCII Diagram'}
            </button>
          </div>

          {!showAscii && lesson.deepDive.diagram.kind === 'svg-ospf-states' ? (
            <OspfStateMachineSvg />
          ) : !showAscii && lesson.deepDive.diagram.kind === 'svg-support-tiers' ? (
            <SupportTiersSvg />
          ) : (
            <pre className="p-4 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs overflow-x-auto leading-relaxed">
              {lesson.deepDive.diagram.asciiFallback}
            </pre>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lesson.deepDive.diagram.caption}
          </p>
        </div>

        {/* Worked Example */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
          <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
            Worked Example: {lesson.deepDive.workedExample.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line font-mono leading-relaxed">
            {lesson.deepDive.workedExample.context}
          </p>
          <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {lesson.deepDive.workedExample.steps.map((st, idx) => (
              <li key={idx} className="leading-relaxed">
                {st}
              </li>
            ))}
          </ol>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Result: {lesson.deepDive.workedExample.outcome}
          </div>
        </div>
      </section>

      {/* 5a. CCNA IOS CLI Examples & AI Recommendation Audit */}
      {lesson.iosCliGuide && (
        <section className="space-y-5">
          {renderSectionHeading(
            '5',
            'Cisco IOS CLI Verification, Healthy vs Broken Output & AI Audit',
            <Terminal className="w-5 h-5 text-sky-500 shrink-0" />,
          )}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {lesson.iosCliGuide.intro}
          </p>

          {lesson.iosCliGuide.commands.map((cmd, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] text-xs font-semibold text-slate-700 dark:text-slate-200">
                {cmd.title}
              </div>
              <pre className="p-4 bg-[#090D14] text-sky-200 font-mono text-xs overflow-x-auto leading-relaxed">
                {`${cmd.promptAndCommand}\n${cmd.output}`}
              </pre>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2 pr-4 font-semibold">Output Field / Command</th>
                      <th className="py-2 font-semibold">What It Means</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
                    {cmd.lineByLine.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="py-2.5 pr-4 font-mono text-sky-700 dark:text-sky-300 whitespace-nowrap">
                          {row.segment}
                        </td>
                        <td className="py-2.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {row.meaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Healthy vs Broken */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/40 bg-white dark:bg-[#101622] overflow-hidden">
              <div className="px-4 py-2.5 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {lesson.iosCliGuide.healthyVsBroken.healthyLabel}
              </div>
              <pre className="p-4 bg-[#090D14] text-emerald-200 font-mono text-xs overflow-x-auto">
                {lesson.iosCliGuide.healthyVsBroken.healthyOutput}
              </pre>
            </div>

            <div className="rounded-xl border border-rose-500/40 bg-white dark:bg-[#101622] overflow-hidden">
              <div className="px-4 py-2.5 bg-rose-500/10 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {lesson.iosCliGuide.healthyVsBroken.brokenLabel}
              </div>
              <pre className="p-4 bg-[#090D14] text-rose-200 font-mono text-xs overflow-x-auto">
                {lesson.iosCliGuide.healthyVsBroken.brokenOutput}
              </pre>
            </div>
          </div>

          <p className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>How to Diagnose the Fault: </strong>
            {lesson.iosCliGuide.healthyVsBroken.diagnosis}
          </p>

          {/* v2.0 Agentic AI Assistant Evaluation */}
          {lesson.iosCliGuide.aiAssistantReview && (
            <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Bot className="w-4 h-4" />
                <span>CCNA v2.0 Skill Check: Evaluate an AI Assistant’s Troubleshooting Advice</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {lesson.iosCliGuide.aiAssistantReview.scenario}
              </p>
              <div className="p-3.5 rounded-lg bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200">
                {lesson.iosCliGuide.aiAssistantReview.aiSuggestion}
              </div>
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                <span className="font-bold uppercase text-rose-600 dark:text-rose-400 mr-2">
                  Verdict: {lesson.iosCliGuide.aiAssistantReview.verdict}
                </span>
                {lesson.iosCliGuide.aiAssistantReview.explanation}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5b. IT Support Walkthrough, Sample User Wording & Ticket Notes */}
      {lesson.supportWalkthrough && (
        <section className="space-y-5">
          {renderSectionHeading(
            '5',
            'Support Walkthrough, User Communication & Ticket Documentation',
            <FileText className="w-5 h-5 text-amber-500 shrink-0" />,
          )}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {lesson.supportWalkthrough.intro}
          </p>

          <div className="space-y-2.5">
            {lesson.supportWalkthrough.steps.map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-1"
              >
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {st.phase}
                </div>
                <div className="text-sm font-medium text-slate-950 dark:text-white">
                  {st.action}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Why this works: {st.whyItWorks}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-2.5">
              <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                What to Ask the User
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                {lesson.supportWalkthrough.questionsToAsk.map((q, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-2.5">
              <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                Sample Wording to Say to the User
              </h3>
              <div className="space-y-3 text-xs">
                {lesson.supportWalkthrough.sampleUserWording.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="font-semibold text-slate-500 dark:text-slate-400">
                      {item.situation}
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
                      {item.sayThis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Template */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                Model Jira Service Management Ticket Record
              </h3>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(
                    lesson.supportWalkthrough!.ticketNoteTemplate.internalNotes,
                  );
                  setCopiedTicket(true);
                  setTimeout(() => setCopiedTicket(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <ClipboardCopy className="w-3.5 h-3.5" />
                <span>{copiedTicket ? 'Copied Notes' : 'Copy Internal Notes'}</span>
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Category: </strong>
              {lesson.supportWalkthrough.ticketNoteTemplate.category} ·{' '}
              <strong>Priority: </strong>
              {lesson.supportWalkthrough.ticketNoteTemplate.priorityFormula}
            </div>
            <pre className="p-3.5 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {lesson.supportWalkthrough.ticketNoteTemplate.internalNotes}
            </pre>
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <strong>Customer Resolution Reply: </strong>
              {lesson.supportWalkthrough.ticketNoteTemplate.customerReply}
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <strong>When to Escalate to Tier 2: </strong>
              {lesson.supportWalkthrough.ticketNoteTemplate.escalationCriteria}
            </div>
          </div>
        </section>
      )}

      {/* 6. Common Mistakes & Exam / Interview Traps */}
      <section className="space-y-3">
        {renderSectionHeading(
          '6',
          'Common Mistakes & Exam / Interview Traps',
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
        )}
        <div className="space-y-2.5">
          {lesson.commonTraps.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-1.5"
            >
              <div className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                Trap: {item.trap}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Reality: {item.reality}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Key Terms (Searchable Glossary Feed) */}
      <section className="space-y-3">
        {renderSectionHeading('7', 'Key Terms & Glossary Definitions')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lesson.keyTerms.map((term) => (
            <div
              key={term.term}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-1"
            >
              <div className="font-display text-sm font-bold text-sky-700 dark:text-sky-300">
                {term.term}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {term.fullDef}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Personal Notes */}
      <section className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor={`deep-note-${lesson.id}`}
            className="font-display text-sm font-bold text-slate-950 dark:text-white"
          >
            Your Personal Notes (Saved in IndexedDB)
          </label>
          <span className="text-slate-400">Included in JSON export</span>
        </div>
        <textarea
          id={`deep-note-${lesson.id}`}
          rows={3}
          value={savedNote}
          onChange={(e) => onSaveNote(e.target.value)}
          placeholder="Summarize this mechanism in your own words..."
          className="w-full p-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101622] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </section>

      {/* 8. Check Your Understanding */}
      <section id="check-your-understanding" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
            8. Check Your Understanding ({lesson.checkQuestions.length} Questions)
          </h2>
          {quizSubmitted && (
            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-xs font-bold tabular-nums ${
                  checkScore >= Math.ceil(lesson.checkQuestions.length * 0.8)
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {checkScore}/{lesson.checkQuestions.length} (
                {Math.round((checkScore / lesson.checkQuestions.length) * 100)}%)
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {lesson.checkQuestions.map((q, qIdx) => {
            const picked = selectedAnswers[q.id];
            const isCorrect = picked === q.correctIndex;
            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white whitespace-pre-line leading-relaxed">
                    <span className="font-mono text-sky-600 dark:text-sky-400 mr-2">
                      Q{qIdx + 1}.
                    </span>
                    {q.prompt}
                  </p>
                  {quizSubmitted && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
                        isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Review</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const chosen = picked === optIdx;
                    const right = optIdx === q.correctIndex;
                    let cls =
                      'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';
                    if (!quizSubmitted && chosen) {
                      cls = 'border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white font-medium';
                    } else if (quizSubmitted) {
                      if (right) {
                        cls =
                          'border-emerald-500/60 bg-emerald-500/10 text-slate-950 dark:text-emerald-100';
                      } else if (chosen) {
                        cls = 'border-rose-500/60 bg-rose-500/10 text-slate-950 dark:text-rose-100';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={quizSubmitted}
                        onClick={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [q.id]: optIdx,
                          }))
                        }
                        className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-colors space-y-1 ${cls}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium">
                            <span className="font-mono text-xs opacity-70 mr-2">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </span>
                        </div>
                        {quizSubmitted && q.optionExplanations[optIdx] && (
                          <p className="pl-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {q.optionExplanations[optIdx]}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-700 dark:text-slate-200">
                      <strong>Key Takeaway: </strong>
                      {q.takeaway}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onAskPing(
                          `${lesson.code} Check Q${qIdx + 1}`,
                          `Question: ${q.prompt}\nLearner answered: ${picked !== undefined ? q.options[picked] : 'None'}\nCorrect answer: ${q.options[q.correctIndex]}\nTakeaway: ${q.takeaway}`,
                          'Let me explain this in my own words and ask me a "Break It" twist question!',
                        )
                      }
                      className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 hover:underline shrink-0"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>
                        Explore with {lesson.moduleId === 'it-support' ? 'Patch' : 'Ping'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!quizSubmitted && (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleQuizSubmit}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 disabled:opacity-40 transition-colors"
          >
            Submit Check &amp; Inspect Every Option
          </button>
        )}
      </section>

      {/* 9. Hands-On Activity */}
      <section className="space-y-3">
        {renderSectionHeading('9', 'Hands-On Activity')}
        <div className="p-5 rounded-xl border border-sky-500/40 bg-sky-500/5 space-y-3">
          <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
            {lesson.handsOnActivity.title}
          </h3>
          <ol className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200 list-decimal list-inside">
            {lesson.handsOnActivity.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sky-500/20">
            <span className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Pass Criteria: </strong>
              {lesson.handsOnActivity.verificationCheck}
            </span>
            {lesson.handsOnActivity.targetTab && (
              <button
                type="button"
                onClick={() => onNavigateTab(lesson.handsOnActivity.targetTab!)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 whitespace-nowrap shrink-0"
              >
                <span>
                  Open{' '}
                  {lesson.handsOnActivity.targetTab === 'labs'
                    ? 'IOS Labs Workbench'
                    : lesson.handsOnActivity.targetTab === 'simulator'
                      ? 'Service Desk Simulator'
                      : 'Interactive Workbench'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 10. Summary (5 bullets) */}
      <section className="space-y-3">
        {renderSectionHeading('10', 'Lesson Summary')}
        <ul className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {lesson.summaryBullets.map((b, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 mt-1">
                0{idx + 1}.
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 11. Sources to Verify */}
      <section className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="font-semibold text-slate-700 dark:text-slate-300">
          Sources to Verify (Official Documentation &amp; Standards)
        </div>
        <ul className="list-disc list-inside space-y-1">
          {lesson.sourcesToVerify.map((src, idx) => (
            <li key={idx}>{src}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
