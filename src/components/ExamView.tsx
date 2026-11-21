import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  GripVertical,
  Headphones,
  HelpCircle,
  LayoutGrid,
  Lightbulb,
  MessageSquare,
  Network,
  Play,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CCNA_DOMAINS } from '../data/curriculum';
import {
  CCNA_EXAM_QUESTIONS,
  IT_SUPPORT_DOMAINS,
  IT_SUPPORT_EXAM_QUESTIONS,
  getExamQuestionsByTrack,
} from '../data/mockExam';
import {
  ExamDifficulty,
  ExamDomainId,
  ExamDomainMeta,
  ExamQuestion,
  LearningTrackId,
  LocalProgressState,
} from '../types/ccna';

interface ExamViewProps {
  progress: LocalProgressState;
  preferredTrack?: { track: LearningTrackId; nonce: number } | null;
  onBack: () => void;
  onRecordAttempt: (
    summary: {
      trackId: LearningTrackId;
      mode: string;
      totalQuestions: number;
      correctCount: number;
      domainFilter: ExamDomainId | 'all';
    },
    questionOutcomes: Record<string, boolean>,
  ) => void;
  onAskZeroExam: (question: ExamQuestion, selectedIndices: number[]) => void;
}

type ExamStage = 'setup' | 'active' | 'review';
type DifficultyFilter = ExamDifficulty | 'all';
type OrderMode = 'progressive' | 'random';
type ReviewFilter = 'all' | 'needs-review' | 'correct';

const DIFFICULTY_RANK: Record<ExamDifficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

function getDifficulty(q: ExamQuestion): ExamDifficulty {
  return q.difficulty ?? 'medium';
}

function getDifficultyBadge(diff: ExamDifficulty) {
  if (diff === 'easy') {
    return {
      label: 'Easy',
      cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    };
  }
  if (diff === 'hard') {
    return {
      label: 'Hard',
      cls: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    };
  }
  return {
    label: 'Medium',
    cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  };
}

function getFormatLabel(q: ExamQuestion): string {
  if (q.questionType === 'scenario') return 'Scenario';
  if (q.questionType === 'simlet') return 'Exhibit Simlet';
  if (q.questionType === 'drag-drop') return 'Drag & Drop';
  if (q.multiSelect || q.questionType === 'multi') return 'Multi-Select';
  return 'Single Choice';
}

function getQuestionHints(q: ExamQuestion): [string, string] {
  if (q.hints && q.hints.length >= 2) {
    return [q.hints[0], q.hints[1]];
  }
  const cleanExp = q.explanation.replace(/^HOW & WHY:\s*/i, '');
  const firstSentence = cleanExp.split(/(?<=[.!?])\s+/)[0] || cleanExp;
  return [
    `Focus on the core rule behind "${q.topic}" and eliminate options that violate standard protocol or OS behavior.`,
    `Method clue: ${firstSentence}`,
  ];
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildSessionQuestions(
  pool: ExamQuestion[],
  requestedCount: number,
  orderMode: OrderMode,
): ExamQuestion[] {
  const targetCount = Math.min(requestedCount, pool.length);

  if (orderMode === 'random') {
    return shuffleArray(pool).slice(0, targetCount);
  }

  // Progressive (Easy -> Medium -> Hard):
  // If taking the entire pool, shuffle within each tier and concatenate easy -> medium -> hard.
  // If taking a subset, sample proportionally across easy, medium, and hard tiers, then order easy -> hard.
  const easyPool = shuffleArray(pool.filter((q) => getDifficulty(q) === 'easy'));
  const medPool = shuffleArray(pool.filter((q) => getDifficulty(q) === 'medium'));
  const hardPool = shuffleArray(pool.filter((q) => getDifficulty(q) === 'hard'));

  if (targetCount >= pool.length) {
    return [...easyPool, ...medPool, ...hardPool];
  }

  const ratioEasy = easyPool.length / Math.max(1, pool.length);
  const ratioMed = medPool.length / Math.max(1, pool.length);

  let takeEasy = Math.min(easyPool.length, Math.round(targetCount * ratioEasy));
  let takeMed = Math.min(medPool.length, Math.round(targetCount * ratioMed));
  let takeHard = Math.min(hardPool.length, Math.max(0, targetCount - takeEasy - takeMed));

  // Top up any shortfall cleanly while preserving tiers
  let remaining = targetCount - (takeEasy + takeMed + takeHard);
  while (remaining > 0) {
    if (takeEasy < easyPool.length) {
      takeEasy++;
      remaining--;
    } else if (takeMed < medPool.length) {
      takeMed++;
      remaining--;
    } else if (takeHard < hardPool.length) {
      takeHard++;
      remaining--;
    } else {
      break;
    }
  }

  return [
    ...easyPool.slice(0, takeEasy),
    ...medPool.slice(0, takeMed),
    ...hardPool.slice(0, takeHard),
  ].sort((a, b) => DIFFICULTY_RANK[getDifficulty(a)] - DIFFICULTY_RANK[getDifficulty(b)]);
}

function isMcqCorrect(q: ExamQuestion, selected: number[]): boolean {
  if (selected.length !== q.correctIndices.length) return false;
  const sortedSel = [...selected].sort((a, b) => a - b);
  const sortedCor = [...q.correctIndices].sort((a, b) => a - b);
  return sortedSel.every((v, idx) => v === sortedCor[idx]);
}

function isDragDropCorrect(q: ExamQuestion, slotMap: Record<string, string>): boolean {
  if (!q.dragDrop) return false;
  return q.dragDrop.targets.every((t) => slotMap[t.id] === t.correctItem);
}

function isQuestionAnswered(
  q: ExamQuestion,
  answers: Record<string, number[]>,
  dragAnswers: Record<string, Record<string, string>>,
): boolean {
  if (q.questionType === 'drag-drop' && q.dragDrop) {
    const slots = dragAnswers[q.id] ?? {};
    return q.dragDrop.targets.every((t) => Boolean(slots[t.id]));
  }
  return (answers[q.id]?.length ?? 0) > 0;
}

export function ExamView({
  progress,
  preferredTrack,
  onBack,
  onRecordAttempt,
  onAskZeroExam,
}: ExamViewProps) {
  const [selectedTrack, setSelectedTrack] = useState<LearningTrackId>(() =>
    preferredTrack?.track ?? (progress.activeTrack === 'it-support' ? 'it-support' : 'ccna'),
  );
  const [stage, setStage] = useState<ExamStage>('setup');

  useEffect(() => {
    if (preferredTrack) {
      setSelectedTrack(preferredTrack.track);
      setDomainFilter('all');
      setDifficultyFilter('all');
      setStage('setup');
    }
  }, [preferredTrack]);
  const [domainFilter, setDomainFilter] = useState<ExamDomainId | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [orderMode, setOrderMode] = useState<OrderMode>('progressive');
  const [questionCount, setQuestionCount] = useState<number>(120);
  const [timedMode, setTimedMode] = useState<boolean>(false);

  const [sessionQuestions, setSessionQuestions] = useState<ExamQuestion[]>([]);
  const [activeExamTrack, setActiveExamTrack] = useState<LearningTrackId>('ccna');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [dragAnswers, setDragAnswers] = useState<Record<string, Record<string, string>>>({});
  const [pickedDragItem, setPickedDragItem] = useState<string | null>(null);
  const [activeExhibitTab, setActiveExhibitTab] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Guided "How & Why" learning states
  const [hintLevelByQ, setHintLevelByQ] = useState<Record<string, 0 | 1 | 2>>({});
  const [checkedByQ, setCheckedByQ] = useState<Record<string, boolean>>({});
  const [guidedRevealByQ, setGuidedRevealByQ] = useState<Record<string, boolean>>({});
  const [showNavGrid, setShowNavGrid] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [reviewExhibitTabs, setReviewExhibitTabs] = useState<Record<string, number>>({});

  const trackDomains: ExamDomainMeta[] = useMemo(
    () => (selectedTrack === 'it-support' ? IT_SUPPORT_DOMAINS : CCNA_DOMAINS),
    [selectedTrack],
  );

  const trackQuestions = useMemo(
    () => getExamQuestionsByTrack(selectedTrack),
    [selectedTrack],
  );

  const domainScopedPool = useMemo(() => {
    if (domainFilter === 'all') return trackQuestions;
    return trackQuestions.filter((q) => q.domainId === domainFilter);
  }, [domainFilter, trackQuestions]);

  const availablePool = useMemo(() => {
    if (difficultyFilter === 'all') return domainScopedPool;
    return domainScopedPool.filter((q) => getDifficulty(q) === difficultyFilter);
  }, [domainScopedPool, difficultyFilter]);

  const tierCounts = useMemo(() => {
    return {
      easy: domainScopedPool.filter((q) => getDifficulty(q) === 'easy').length,
      medium: domainScopedPool.filter((q) => getDifficulty(q) === 'medium').length,
      hard: domainScopedPool.filter((q) => getDifficulty(q) === 'hard').length,
      scenario: domainScopedPool.filter((q) => q.questionType === 'scenario').length,
    };
  }, [domainScopedPool]);

  const ccnaStats = useMemo(
    () => ({
      total: CCNA_EXAM_QUESTIONS.length,
      scenarios: CCNA_EXAM_QUESTIONS.filter((q) => q.questionType === 'scenario').length,
    }),
    [],
  );

  const itStats = useMemo(
    () => ({
      total: IT_SUPPORT_EXAM_QUESTIONS.length,
      scenarios: IT_SUPPORT_EXAM_QUESTIONS.filter((q) => q.questionType === 'scenario').length,
    }),
    [],
  );

  useEffect(() => {
    setActiveExhibitTab(0);
    setPickedDragItem(null);
  }, [currentIdx, stage]);

  useEffect(() => {
    if (stage !== 'active' || !timedMode) return;
    if (secondsLeft <= 0) {
      finishExam();
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timedMode, secondsLeft]);

  const handleSelectExamTrack = (track: LearningTrackId) => {
    setSelectedTrack(track);
    setDomainFilter('all');
    setDifficultyFilter('all');
  };

  const startExam = () => {
    if (availablePool.length === 0) return;
    const chosen = buildSessionQuestions(availablePool, questionCount, orderMode);
    setSessionQuestions(chosen);
    setActiveExamTrack(selectedTrack);
    setCurrentIdx(0);
    setAnswers({});
    setDragAnswers({});
    setHintLevelByQ({});
    setCheckedByQ({});
    setGuidedRevealByQ({});
    setShowNavGrid(false);
    setReviewFilter('all');
    setReviewExhibitTabs({});
    setPickedDragItem(null);
    setActiveExhibitTab(0);
    setSecondsLeft(chosen.length * 75);
    setStage('active');
  };

  const evaluateQuestion = (q: ExamQuestion): boolean => {
    if (guidedRevealByQ[q.id]) return false;
    if (q.questionType === 'drag-drop') {
      return isDragDropCorrect(q, dragAnswers[q.id] ?? {});
    }
    return isMcqCorrect(q, answers[q.id] ?? []);
  };

  const finishExam = () => {
    const outcomes: Record<string, boolean> = {};
    let correctCount = 0;
    for (const q of sessionQuestions) {
      const ok = evaluateQuestion(q);
      outcomes[q.id] = ok;
      if (ok) correctCount++;
    }
    const modeLabel = `${timedMode ? 'Timed' : 'Study'} · ${
      orderMode === 'progressive' ? 'Easy→Hard' : 'Random'
    }`;
    onRecordAttempt(
      {
        trackId: activeExamTrack,
        mode: modeLabel,
        totalQuestions: sessionQuestions.length,
        correctCount,
        domainFilter,
      },
      outcomes,
    );
    setStage('review');
  };

  const toggleChoice = (q: ExamQuestion, optIdx: number) => {
    if (checkedByQ[q.id] || guidedRevealByQ[q.id]) return;
    setAnswers((prev) => {
      const existing = prev[q.id] ?? [];
      if (!q.multiSelect) {
        return { ...prev, [q.id]: [optIdx] };
      }
      const next = existing.includes(optIdx)
        ? existing.filter((i) => i !== optIdx)
        : [...existing, optIdx];
      return { ...prev, [q.id]: next };
    });
  };

  const assignDragItem = (qId: string, targetId: string, itemText: string) => {
    if (checkedByQ[qId] || guidedRevealByQ[qId]) return;
    setDragAnswers((prev) => {
      const currentSlots = { ...(prev[qId] ?? {}) };
      for (const key of Object.keys(currentSlots)) {
        if (currentSlots[key] === itemText) {
          delete currentSlots[key];
        }
      }
      currentSlots[targetId] = itemText;
      return { ...prev, [qId]: currentSlots };
    });
    setPickedDragItem(null);
  };

  const clearDragSlot = (qId: string, targetId: string) => {
    if (checkedByQ[qId] || guidedRevealByQ[qId]) return;
    setDragAnswers((prev) => {
      const currentSlots = { ...(prev[qId] ?? {}) };
      delete currentSlots[targetId];
      return { ...prev, [qId]: currentSlots };
    });
  };

  const revealHint = (qId: string, level: 1 | 2) => {
    setHintLevelByQ((prev) => ({
      ...prev,
      [qId]: Math.max(prev[qId] ?? 0, level) as 0 | 1 | 2,
    }));
  };

  const checkCurrentAnswer = (qId: string) => {
    setCheckedByQ((prev) => ({ ...prev, [qId]: true }));
  };

  const revealGuidedWalkthrough = (qId: string) => {
    setHintLevelByQ((prev) => ({ ...prev, [qId]: 2 }));
    setGuidedRevealByQ((prev) => ({ ...prev, [qId]: true }));
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeExamLabel =
    activeExamTrack === 'it-support'
      ? 'IT Help Desk & Systems Support'
      : 'Cisco CCNA 200-301';

  const activeDomainList: ExamDomainMeta[] =
    activeExamTrack === 'it-support' ? IT_SUPPORT_DOMAINS : CCNA_DOMAINS;

  if (stage === 'setup') {
    const allCountValue = availablePool.length;
    const countChoices = Array.from(
      new Set([15, 30, 60, 120, allCountValue].filter((n) => n > 0 && n <= allCountValue)),
    ).sort((a, b) => a - b);
    if (countChoices.length === 0 && allCountValue > 0) {
      countChoices.push(allCountValue);
    }
    const effectiveCount = Math.min(questionCount, allCountValue);

    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            Mock Exam Simulators
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Two full-length 120+ question mock exams (Cisco CCNA 200-301 and IT Help Desk &amp;
            Systems Support) progressing from Easy to Hard, with real-world scenarios, multi-tab
            simlets, progressive hints, and guided How &amp; Why walkthroughs whenever you get stuck.
          </p>
        </div>

        {/* Two Mock Exams Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSelectExamTrack('ccna')}
            className={`text-left p-5 rounded-xl border transition-colors flex items-start gap-4 ${
              selectedTrack === 'ccna'
                ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                selectedTrack === 'ccna'
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Network className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Cisco CCNA 200-301 Mock Exam
                </h2>
                <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {ccnaStats.total} Qs
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Easy → Hard progression covering VLSM subnetting, STP/VLANs, OSPF, NAT/PAT, ACLs,
                security, automation, {ccnaStats.scenarios}+ scenarios, and IOS CLI simlets.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectExamTrack('it-support')}
            className={`text-left p-5 rounded-xl border transition-colors flex items-start gap-4 ${
              selectedTrack === 'it-support'
                ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                selectedTrack === 'it-support'
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Headphones className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  IT Help Desk &amp; Systems Support Mock Exam
                </h2>
                <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {itStats.total} Qs
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Easy → Hard progression covering hardware/OS triage, ITSM SLAs, Active Directory &amp;
                GPOs, VPN/DNS, M365 MFA containment, {itStats.scenarios}+ scenarios, and PowerShell simlets.
              </p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                1. Focus Domain ({selectedTrack === 'it-support' ? 'IT Help Desk' : 'CCNA 200-301'})
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDomainFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    domainFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                  }`}
                >
                  All Domains ({trackQuestions.length})
                </button>
                {trackDomains.map((dom) => {
                  const count = trackQuestions.filter((q) => q.domainId === dom.id).length;
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => setDomainFilter(dom.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        domainFilter === dom.id
                          ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                      }`}
                    >
                      {dom.number}. {dom.title} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty & Sequence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  2. Difficulty Filter
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      difficultyFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    All ({domainScopedPool.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('easy')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      difficultyFilter === 'easy'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    Easy ({tierCounts.easy})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('medium')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      difficultyFilter === 'medium'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    Medium ({tierCounts.medium})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('hard')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      difficultyFilter === 'hard'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    Hard ({tierCounts.hard})
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  3. Difficulty Progression
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOrderMode('progressive')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      orderMode === 'progressive'
                        ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    Easy → Hard (Guided Ramp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderMode('random')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      orderMode === 'random'
                        ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    Mixed Shuffle
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  4. Question Count
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {countChoices.map((cnt) => {
                    const isAll = cnt === allCountValue;
                    const isSelected =
                      questionCount === cnt || (isAll && questionCount >= allCountValue);
                    return (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`px-3 py-2 text-xs font-mono font-semibold rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                        }`}
                      >
                        {isAll ? `All (${allCountValue})` : `${cnt} Qs`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  5. Pacing &amp; Guidance Mode
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimedMode(false)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      !timedMode
                        ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    Untimed Guided Study
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimedMode(true)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      timedMode
                        ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    Timed Exam (75s/Q)
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-sky-500/20 bg-sky-500/5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span>
                Every question includes a two-step <strong>Hint Ladder</strong> plus an{' '}
                <strong>Unable to Answer? Reveal &amp; Explain How &amp; Why</strong> walkthrough so
                you never get stuck without understanding the reasoning.
              </span>
            </div>

            <div className="pt-1">
              <button
                type="button"
                disabled={availablePool.length === 0}
                onClick={startExam}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>
                  Start {selectedTrack === 'it-support' ? 'IT Help Desk' : 'CCNA'} Mock Exam (
                  {effectiveCount} Questions)
                </span>
              </button>
            </div>
          </div>

          {/* Local Exam History Table */}
          <div className="lg:col-span-5 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-4">
            <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              Recent Local Attempts
            </h2>
            {progress.examHistory.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No exam runs logged yet. Complete either the CCNA 200-301 or IT Help Desk mock exam
                to track readiness locally.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Exam</th>
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 pr-3 font-medium">Filter</th>
                      <th className="py-2 text-right font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
                    {progress.examHistory.slice(0, 8).map((att) => {
                      const pct = Math.round(
                        (att.correctCount / Math.max(1, att.totalQuestions)) * 100,
                      );
                      const trackLabel =
                        att.trackId === 'it-support' ? 'IT Help Desk' : 'CCNA 200-301';
                      return (
                        <tr key={att.id}>
                          <td className="py-2.5 pr-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            {trackLabel}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-600 dark:text-slate-300 tabular-nums">
                            {new Date(att.dateIso).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-500 dark:text-slate-400 capitalize">
                            {att.domainFilter}
                          </td>
                          <td className="py-2.5 text-right font-mono font-semibold text-slate-950 dark:text-white tabular-nums">
                            {att.correctCount}/{att.totalQuestions} ({pct}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'active') {
    const q = sessionQuestions[currentIdx];
    const selected = answers[q.id] ?? [];
    const currentDragMap = dragAnswers[q.id] ?? {};
    const assignedItems = new Set(Object.values(currentDragMap));
    const domainMeta =
      activeDomainList.find((d) => d.id === q.domainId) ?? activeDomainList[0];
    const diff = getDifficulty(q);
    const diffBadge = getDifficultyBadge(diff);
    const formatLabel = getFormatLabel(q);
    const hints = getQuestionHints(q);
    const hintLevel = hintLevelByQ[q.id] ?? 0;
    const isChecked = Boolean(checkedByQ[q.id]);
    const isGuidedRevealed = Boolean(guidedRevealByQ[q.id]);
    const hasAnsweredCurrent = isQuestionAnswered(q, answers, dragAnswers);
    const isLocked = isChecked || isGuidedRevealed;
    const currentCheckCorrect =
      q.questionType === 'drag-drop'
        ? isDragDropCorrect(q, currentDragMap)
        : isMcqCorrect(q, selected);
    const answeredTotal = sessionQuestions.filter((sq) =>
      isQuestionAnswered(sq, answers, dragAnswers),
    ).length;

    return (
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <button
            type="button"
            onClick={() => setStage('setup')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Exam Setup</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {activeExamLabel}
            </span>{' '}
            · Q {currentIdx + 1} / {sessionQuestions.length} · Answered {answeredTotal} · Domain{' '}
            {domainMeta.number}: {domainMeta.title}
          </div>

          <div className="flex items-center gap-3">
            {timedMode && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                {formatTimer(secondsLeft)}
              </span>
            )}
            <button
              type="button"
              onClick={finishExam}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0"
            >
              Finish &amp; Score
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded border font-semibold ${diffBadge.cls}`}>
                {diffBadge.label}
              </span>
              <span className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
                {formatLabel}
              </span>
              <span className="font-medium text-sky-600 dark:text-sky-400">{q.topic}</span>
            </div>
            <h2 className="text-base sm:text-lg font-medium text-slate-950 dark:text-white leading-relaxed whitespace-pre-line">
              {q.prompt}
            </h2>
          </div>

          {q.exhibit && (
            <pre className="p-4 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs overflow-x-auto border border-slate-800">
              {q.exhibit}
            </pre>
          )}

          {/* Multi-tab Simlet Exhibits */}
          {q.exhibitTabs && q.exhibitTabs.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-[#090D14] overflow-hidden">
              <div className="flex items-center gap-1 px-3 pt-2.5 bg-[#0E1420] border-b border-slate-800 overflow-x-auto">
                {q.exhibitTabs.map((tab, tIdx) => (
                  <button
                    key={tab.title}
                    type="button"
                    onClick={() => setActiveExhibitTab(tIdx)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-t-md transition-colors whitespace-nowrap shrink-0 ${
                      activeExhibitTab === tIdx
                        ? 'bg-[#090D14] text-sky-300 font-semibold border-t border-x border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
              <pre className="p-4 text-sky-200 font-mono text-xs overflow-x-auto leading-relaxed">
                {q.exhibitTabs[activeExhibitTab]?.output}
              </pre>
            </div>
          )}

          {/* Drag-and-Drop / Tap-to-Place UI */}
          {q.questionType === 'drag-drop' && q.dragDrop ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-5 space-y-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Available Items (Drag or Tap)
                </div>
                <div className="space-y-2">
                  {q.dragDrop.items.map((item) => {
                    const isUsed = assignedItems.has(item);
                    const isPicked = pickedDragItem === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={isLocked}
                        draggable={!isLocked}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', item);
                          setPickedDragItem(item);
                        }}
                        onClick={() => setPickedDragItem(isPicked ? null : item)}
                        className={`w-full flex items-center gap-2 p-3 rounded-lg border text-left font-mono text-xs transition-colors ${
                          isLocked ? 'cursor-default opacity-80' : 'cursor-grab active:cursor-grabbing'
                        } ${
                          isPicked
                            ? 'border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300 font-semibold'
                            : isUsed
                              ? 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 text-slate-400'
                              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 hover:border-sky-500/60'
                        }`}
                      >
                        <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-7 space-y-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Target Definitions (Drop Here or Tap Slot)
                </div>
                <div className="space-y-2.5">
                  {q.dragDrop.targets.map((target) => {
                    const placed = currentDragMap[target.id];
                    const showCorrectReveal = isLocked;
                    const slotMatched = placed === target.correctItem;
                    return (
                      <div
                        key={target.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dropped = e.dataTransfer.getData('text/plain') || pickedDragItem;
                          if (dropped) assignDragItem(q.id, target.id, dropped);
                        }}
                        onClick={() => {
                          if (isLocked) return;
                          if (pickedDragItem) {
                            assignDragItem(q.id, target.id, pickedDragItem);
                          } else if (placed) {
                            clearDragSlot(q.id, target.id);
                          }
                        }}
                        className={`p-3.5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          isLocked ? 'cursor-default' : 'cursor-pointer'
                        } ${
                          showCorrectReveal
                            ? slotMatched
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-amber-500/70 bg-amber-500/5'
                            : placed
                              ? 'border-sky-500/60 bg-sky-500/5'
                              : pickedDragItem
                                ? 'border-dashed border-sky-500 bg-sky-500/5'
                                : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0B0F17]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                          {target.slotLabel}
                        </span>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={`px-3 py-1.5 rounded-md font-mono text-xs ${
                              placed
                                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {placed ?? (isLocked ? 'Unplaced' : 'Drop / Tap')}
                          </span>
                          {showCorrectReveal && !slotMatched && (
                            <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              Answer: {target.correctItem}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                const checked = selected.includes(idx);
                const isCorrectOption = q.correctIndices.includes(idx);

                let styleCls =
                  'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                if (isLocked) {
                  if (isCorrectOption) {
                    styleCls =
                      'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-medium';
                  } else if (checked) {
                    styleCls =
                      'border-rose-500 bg-rose-500/10 text-rose-950 dark:text-rose-200';
                  } else {
                    styleCls =
                      'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#0B0F17]/60 text-slate-500 dark:text-slate-500';
                  }
                } else if (checked) {
                  styleCls =
                    'border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white font-medium';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLocked}
                    onClick={() => toggleChoice(q, idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-colors flex items-start justify-between gap-3 ${styleCls}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-semibold mt-0.5 text-slate-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isLocked && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {isLocked && !isCorrectOption && checked && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Step-by-Step Guidance & "How & Why" Assistant */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0B0F17] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Compass className="w-4 h-4 text-sky-500" />
                <span>Stuck or Want to Verify? Guided Help (How &amp; Why)</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isLocked && hintLevel < 1 && (
                  <button
                    type="button"
                    onClick={() => revealHint(q.id, 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Hint 1: Gentle Nudge</span>
                  </button>
                )}

                {!isLocked && hintLevel === 1 && (
                  <button
                    type="button"
                    onClick={() => revealHint(q.id, 2)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hint 2: How to Solve</span>
                  </button>
                )}

                {!isLocked && hasAnsweredCurrent && (
                  <button
                    type="button"
                    onClick={() => checkCurrentAnswer(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Check Answer &amp; Explain Why</span>
                  </button>
                )}

                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => revealGuidedWalkthrough(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/60 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Unable to Answer? Show How &amp; Why</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onAskZeroExam(q, selected)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Coach Zero</span>
                </button>
              </div>
            </div>

            {hintLevel >= 1 && !isLocked && (
              <div className="p-3 rounded-lg border border-sky-500/30 bg-sky-500/5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                <strong className="text-sky-700 dark:text-sky-300">Hint 1 (Nudge): </strong>
                {hints[0]}
              </div>
            )}

            {hintLevel >= 2 && !isLocked && (
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                <strong className="text-amber-700 dark:text-amber-300">Hint 2 (How to Solve): </strong>
                {hints[1]}
              </div>
            )}

            {isLocked && (
              <div
                className={`p-4 rounded-lg border space-y-2.5 text-xs leading-relaxed ${
                  isGuidedRevealed
                    ? 'border-amber-500/40 bg-amber-500/5 text-slate-800 dark:text-slate-100'
                    : currentCheckCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-950 dark:text-rose-100'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <BookOpen className="w-4 h-4" />
                    {isGuidedRevealed
                      ? 'Guided Walkthrough — Understanding the How & Why'
                      : currentCheckCorrect
                        ? 'Correct! Here is the How & Why Breakdown'
                        : 'Not Quite — Here is How & Why the Right Answer Works'}
                  </span>
                  <span className="text-[11px] opacity-80">
                    {isGuidedRevealed
                      ? 'Logged as Guided Walkthrough'
                      : 'Choice locked for this attempt'}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-200">{q.explanation}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => setShowNavGrid((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/60 transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-sky-500" />
                <span>
                  Jump Map ({currentIdx + 1}/{sessionQuestions.length})
                </span>
              </button>

              {currentIdx < sessionQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.min(sessionQuestions.length - 1, i + 1))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishExam}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  Submit Exam
                </button>
              )}
            </div>

            {showNavGrid && (
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Click any question number to jump directly:</span>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" /> Current
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-slate-600 inline-block" />{' '}
                      Answered
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Guided
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-1 max-h-48 overflow-y-auto pr-1">
                  {sessionQuestions.map((sq, idx) => {
                    const hasAns = isQuestionAnswered(sq, answers, dragAnswers);
                    const wasGuided = Boolean(guidedRevealByQ[sq.id]);
                    return (
                      <button
                        key={sq.id}
                        type="button"
                        onClick={() => {
                          setCurrentIdx(idx);
                          setShowNavGrid(false);
                        }}
                        className={`h-7 rounded text-[11px] font-mono tabular-nums transition-colors ${
                          idx === currentIdx
                            ? 'bg-sky-500 text-slate-950 font-bold'
                            : wasGuided
                              ? 'bg-amber-500/80 text-slate-950 font-semibold'
                              : hasAns
                                ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                                : 'bg-slate-200/70 dark:bg-slate-800/70 text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Review Stage
  const correctTotal = sessionQuestions.filter((q) => evaluateQuestion(q)).length;
  const guidedTotal = sessionQuestions.filter((q) => Boolean(guidedRevealByQ[q.id])).length;
  const missedTotal = sessionQuestions.length - correctTotal - guidedTotal;
  const scorePct = Math.round((correctTotal / Math.max(1, sessionQuestions.length)) * 100);

  const byDiff = (tier: ExamDifficulty) => {
    const items = sessionQuestions.filter((q) => getDifficulty(q) === tier);
    const ok = items.filter((q) => evaluateQuestion(q)).length;
    return { ok, total: items.length };
  };

  const easyStats = byDiff('easy');
  const medStats = byDiff('medium');
  const hardStats = byDiff('hard');

  const filteredReviewQuestions = sessionQuestions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => {
      const ok = evaluateQuestion(q);
      if (reviewFilter === 'correct') return ok;
      if (reviewFilter === 'needs-review') return !ok;
      return true;
    });

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <button
          type="button"
          onClick={() => setStage('setup')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Exam Setup</span>
        </button>
      </div>

      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {activeExamLabel} · Mock Exam Results
            </p>
            <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white mt-1 tabular-nums">
              {correctTotal} / {sessionQuestions.length} Correct Independently ({scorePct}%)
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {scorePct >= 82
                ? activeExamTrack === 'it-support'
                  ? 'Strong IT Help Desk readiness across this question set.'
                  : 'Strong CCNA readiness across this question set.'
                : 'Review the How & Why rationales below—especially guided and missed questions—to lock in every concept.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStage('setup')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Exam Run</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400">Easy Accuracy</div>
            <div className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
              {easyStats.ok}/{easyStats.total}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400">Medium Accuracy</div>
            <div className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400 mt-0.5 tabular-nums">
              {medStats.ok}/{medStats.total}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400">Hard Accuracy</div>
            <div className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400 mt-0.5 tabular-nums">
              {hardStats.ok}/{hardStats.total}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400">Guided Walkthroughs</div>
            <div className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400 mt-0.5 tabular-nums">
              {guidedTotal}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400">Missed</div>
            <div className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400 mt-0.5 tabular-nums">
              {missedTotal}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setReviewFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              reviewFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
            }`}
          >
            All ({sessionQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setReviewFilter('needs-review')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              reviewFilter === 'needs-review'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
            }`}
          >
            Missed &amp; Guided ({sessionQuestions.length - correctTotal})
          </button>
          <button
            type="button"
            onClick={() => setReviewFilter('correct')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              reviewFilter === 'correct'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'
            }`}
          >
            Correct ({correctTotal})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviewQuestions.map(({ q, idx }) => {
          const sel = answers[q.id] ?? [];
          const ok = evaluateQuestion(q);
          const wasGuided = Boolean(guidedRevealByQ[q.id]);
          const diffBadge = getDifficultyBadge(getDifficulty(q));
          const activeRevTab = reviewExhibitTabs[q.id] ?? 0;

          return (
            <div
              key={q.id}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  {ok ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Question {idx + 1} · Correct
                    </span>
                  ) : wasGuided ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <HelpCircle className="w-4 h-4" />
                      Question {idx + 1} · Guided Walkthrough
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-4 h-4" />
                      Question {idx + 1} · Incorrect
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded border font-semibold ${diffBadge.cls}`}>
                    {diffBadge.label}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{q.topic}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onAskZeroExam(q, sel)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discuss with Zero</span>
                </button>
              </div>

              <p className="text-sm font-medium text-slate-950 dark:text-white whitespace-pre-line">
                {q.prompt}
              </p>

              {q.exhibit && (
                <pre className="p-3 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs overflow-x-auto">
                  {q.exhibit}
                </pre>
              )}

              {q.exhibitTabs && q.exhibitTabs.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-[#090D14] overflow-hidden">
                  <div className="flex items-center gap-1 px-3 pt-2 bg-[#0E1420] border-b border-slate-800 overflow-x-auto">
                    {q.exhibitTabs.map((tab, tIdx) => (
                      <button
                        key={tab.title}
                        type="button"
                        onClick={() =>
                          setReviewExhibitTabs((prev) => ({ ...prev, [q.id]: tIdx }))
                        }
                        className={`px-2.5 py-1 text-[11px] font-mono rounded-t-md whitespace-nowrap shrink-0 ${
                          activeRevTab === tIdx
                            ? 'bg-[#090D14] text-sky-300 font-semibold border-t border-x border-slate-700'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>
                  <pre className="p-3 text-sky-200 font-mono text-xs overflow-x-auto leading-relaxed">
                    {q.exhibitTabs[activeRevTab]?.output}
                  </pre>
                </div>
              )}

              {q.questionType === 'drag-drop' && q.dragDrop ? (
                <div className="space-y-1.5 text-xs">
                  {q.dragDrop.targets.map((target) => {
                    const userVal = dragAnswers[q.id]?.[target.id] ?? 'Unassigned';
                    const slotRight = userVal === target.correctItem;
                    return (
                      <div
                        key={target.id}
                        className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-2 ${
                          slotRight
                            ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                            : 'border-rose-400/70 bg-rose-500/10 text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        <span>{target.slotLabel}</span>
                        <span className="font-mono font-semibold">
                          Yours: {userVal} · Correct: {target.correctItem}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isRight = q.correctIndices.includes(optIdx);
                    const isPicked = sel.includes(optIdx);
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border ${
                          isRight
                            ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-medium'
                            : isPicked
                              ? 'border-rose-400/70 bg-rose-500/10 text-rose-900 dark:text-rose-200'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}{' '}
                        {isRight ? '(Correct Answer)' : isPicked ? '(Your Choice)' : ''}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <strong className="text-slate-900 dark:text-white">How &amp; Why:</strong>{' '}
                {q.explanation.replace(/^HOW & WHY:\s*/i, '')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
