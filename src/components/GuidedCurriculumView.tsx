import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Cpu,
  Lightbulb,
  MessageSquare,
  Network,
  RotateCcw,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CCNA_TOPICS } from '../data/ccnaPath';
import { IT_SUPPORT_TOPICS } from '../data/itSupportPath';
import {
  DetailedCheckQuestion,
  LearningTopic,
  LearningTrackId,
  LocalProgressState,
  QuizAttemptRecord,
  SkillLevelId,
  SubtopicNode,
} from '../types/ccna';
import { getDueSpacedReviews } from '../utils/blueprintProgress';

interface GuidedCurriculumViewProps {
  progress: LocalProgressState;
  jumpTarget?: { topicId: string; subtopicId?: string; nonce: number } | null;
  onBack: () => void;
  onSelectTrack: (track: LearningTrackId | null) => void;
  onSaveSubtopicCheck: (subtopicId: string, record: QuizAttemptRecord) => void;
  onSaveTopicExam: (topicId: string, record: QuizAttemptRecord) => void;
  onSaveNote: (lessonId: string, note: string) => void;
  onSwitchTrackOrLevel: () => void;
  onAskZero: (contextLabel: string, contextPayload: string, prompt: string) => void;
}

type DrawerMode =
  | { kind: 'subtopic'; subtopicId: string }
  | { kind: 'topic-exam' };

function getInitialOpenState(
  topics: LearningTopic[],
  level: SkillLevelId | null,
): { topicId: string; mode: DrawerMode } {
  if (!level || level === 'beginner' || level === 'refresh') {
    return {
      topicId: topics[0].id,
      mode: { kind: 'subtopic', subtopicId: topics[0].subtopics[0].id },
    };
  }
  const matchingTopic =
    topics.find((t) => t.levelTag === level) ??
    topics.find((t) => t.subtopics.some((s) => s.levelTag === level)) ??
    topics[topics.length - 1];

  const matchingSub =
    matchingTopic.subtopics.find((s) => s.levelTag === level) ?? matchingTopic.subtopics[0];

  return {
    topicId: matchingTopic.id,
    mode: { kind: 'subtopic', subtopicId: matchingSub.id },
  };
}

interface InteractiveQuizPanelProps {
  title: string;
  subtitle: string;
  questions: DetailedCheckQuestion[];
  savedRecord?: QuizAttemptRecord;
  submitLabel: string;
  onSubmitAttempt: (record: QuizAttemptRecord) => void;
  onAskZeroQuestion: (q: DetailedCheckQuestion, chosenIdx?: number) => void;
  nextActionLabel?: string;
  onNextAction?: () => void;
}

function InteractiveQuizPanel({
  title,
  subtitle,
  questions,
  savedRecord,
  submitLabel,
  onSubmitAttempt,
  onAskZeroQuestion,
  nextActionLabel,
  onNextAction,
}: InteractiveQuizPanelProps) {
  const [selected, setSelected] = useState<Record<string, number>>(
    savedRecord?.selected ?? {},
  );
  const [submitted, setSubmitted] = useState<boolean>(Boolean(savedRecord));

  useEffect(() => {
    setSelected(savedRecord?.selected ?? {});
    setSubmitted(Boolean(savedRecord));
  }, [savedRecord, questions]);

  const allAnswered = questions.every((q) => selected[q.id] !== undefined);
  const score = questions.filter((q) => selected[q.id] === q.correctIndex).length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    const record: QuizAttemptRecord = {
      score,
      total: questions.length,
      selected,
      completedAt: new Date().toISOString(),
    };
    setSubmitted(true);
    onSubmitAttempt(record);
  };

  const handleRetake = () => {
    setSelected({});
    setSubmitted(false);
  };

  return (
    <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg font-bold text-slate-950 dark:text-white">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {submitted && (
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`font-mono text-xs font-bold tabular-nums ${
                score === questions.length
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retake</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const pickedIdx = selected[q.id];
          const isCorrect = pickedIdx === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0F17] space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950 dark:text-white leading-relaxed">
                  <span className="font-mono text-sky-600 dark:text-sky-400 mr-2">
                    Q{qIdx + 1}.
                  </span>
                  {q.prompt}
                </p>

                {submitted && (
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

              {q.exhibit && (
                <pre className="p-3 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs overflow-x-auto border border-slate-800">
                  {q.exhibit}
                </pre>
              )}

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const chosen = pickedIdx === optIdx;
                  const rightOption = optIdx === q.correctIndex;

                  let rowClass =
                    'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                  if (!submitted && chosen) {
                    rowClass =
                      'border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white font-medium';
                  } else if (submitted) {
                    if (rightOption) {
                      rowClass =
                        'border-emerald-500/60 bg-emerald-500/10 text-slate-950 dark:text-emerald-100';
                    } else if (chosen && !rightOption) {
                      rowClass =
                        'border-rose-500/60 bg-rose-500/10 text-slate-950 dark:text-rose-100';
                    } else {
                      rowClass =
                        'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#101622]/70 text-slate-600 dark:text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() =>
                        setSelected((prev) => ({
                          ...prev,
                          [q.id]: optIdx,
                        }))
                      }
                      className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-colors space-y-1.5 ${rowClass}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="font-mono text-xs font-semibold mt-0.5 opacity-70">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="font-medium">{opt}</span>
                        </div>
                        {submitted && rightOption && (
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                            Correct Answer
                          </span>
                        )}
                        {submitted && chosen && !rightOption && (
                          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 shrink-0">
                            Your Choice
                          </span>
                        )}
                      </div>

                      {submitted && q.optionDetails[optIdx] && (
                        <p className="pl-5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          {q.optionDetails[optIdx]}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3.5 rounded-lg border border-sky-500/30 bg-sky-500/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                      Deep Breakdown (Why Every Detail Matters)
                    </span>
                    <button
                      type="button"
                      onClick={() => onAskZeroQuestion(q, pickedIdx)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Explore with Zero</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {q.deepExplanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 disabled:opacity-40 transition-colors"
          >
            {submitLabel}
          </button>
        ) : (
          nextActionLabel &&
          onNextAction && (
            <button
              type="button"
              onClick={onNextAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors"
            >
              <span>{nextActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )
        )}
      </div>
    </section>
  );
}

export function GuidedCurriculumView({
  progress,
  jumpTarget,
  onBack,
  onSelectTrack,
  onSaveSubtopicCheck,
  onSaveTopicExam,
  onSaveNote,
  onSwitchTrackOrLevel,
  onAskZero,
}: GuidedCurriculumViewProps) {
  const [enteredViaInlineChooser, setEnteredViaInlineChooser] = useState(false);

  const track: LearningTrackId = progress.activeTrack ?? 'ccna';
  const level: SkillLevelId = progress.selectedLevel ?? 'beginner';
  const topics = track === 'ccna' ? CCNA_TOPICS : IT_SUPPORT_TOPICS;

  const initial = getInitialOpenState(topics, level);
  const [openTopicId, setOpenTopicId] = useState<string | null>(initial.topicId);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(initial.mode);

  useEffect(() => {
    if (jumpTarget) {
      const targetTopic = topics.find((t) => t.id === jumpTarget.topicId);
      if (targetTopic) {
        const subId = jumpTarget.subtopicId ?? targetTopic.subtopics[0].id;
        setOpenTopicId(targetTopic.id);
        setDrawerMode({ kind: 'subtopic', subtopicId: subId });
        return;
      }
    }
    const next = getInitialOpenState(topics, level);
    setOpenTopicId(next.topicId);
    setDrawerMode(next.mode);
  }, [track, level, topics, jumpTarget]);

  if (progress.activeTrack === null) {
    return (
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-8 space-y-8">
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

        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-medium text-sky-600 dark:text-sky-400">
            Guided Learn Hub
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            Choose a track to study topic by topic.
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Pick Cisco CCNA (200-301) or IT Help Desk &amp; Systems Support below. You can use the
            Back button anytime to return here and explore the other track.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => {
              setEnteredViaInlineChooser(true);
              onSelectTrack('ccna');
            }}
            className="text-left p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-sky-500 transition-colors flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Track 01 · Cisco CCNA (200-301)</span>
                <Network className="w-4 h-4 text-sky-500" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Cisco CCNA (200-301)
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {CCNA_TOPICS.length} Topics ·{' '}
                {CCNA_TOPICS.reduce((acc, t) => acc + t.subtopics.length, 0)} Subtopics · Unlocks
                IOS Labs &amp; Subnetting in the top bar.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Open CCNA Topics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEnteredViaInlineChooser(true);
              onSelectTrack('it-support');
            }}
            className="text-left p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-sky-500 transition-colors flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Track 02 · IT Support</span>
                <Cpu className="w-4 h-4 text-amber-500" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                IT Help Desk &amp; Systems Support
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {IT_SUPPORT_TOPICS.length} Topics ·{' '}
                {IT_SUPPORT_TOPICS.reduce((acc, t) => acc + t.subtopics.length, 0)} Subtopics ·
                Hardware/OS triage, ticketing, AD, DNS/VPN &amp; M365 security.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Open IT Support Topics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  const dueReviews = getDueSpacedReviews(progress);
  const totalSubtopics = topics.reduce((sum, t) => sum + t.subtopics.length, 0);
  const completedInTrack = topics.reduce(
    (sum, t) =>
      sum + t.subtopics.filter((s) => Boolean(progress.subtopicChecks[s.id])).length,
    0,
  );

  const openTopicWithSubtopic = (topic: LearningTopic, subtopicId: string) => {
    setOpenTopicId(topic.id);
    setDrawerMode({ kind: 'subtopic', subtopicId });
  };

  const openTopicExam = (topic: LearningTopic) => {
    setOpenTopicId(topic.id);
    setDrawerMode({ kind: 'topic-exam' });
  };

  const handleBackFromTrack = () => {
    if (enteredViaInlineChooser) {
      setEnteredViaInlineChooser(false);
      onSelectTrack(null);
      return;
    }
    onBack();
  };

  return (
    <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Back & Track Switch Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBackFromTrack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{enteredViaInlineChooser ? 'Back to Track Selection' : 'Back'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectTrack('ccna')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              track === 'ccna'
                ? 'border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300'
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Cisco CCNA (200-301)
          </button>
          <button
            type="button"
            onClick={() => onSelectTrack('it-support')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              track === 'it-support'
                ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            IT Help Desk &amp; Support
          </button>
        </div>
      </div>

      {/* Workspace Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {track === 'ccna' ? 'Cisco CCNA (200-301) Path' : 'IT Help Desk & Systems Support Path'}{' '}
            · Level: <span className="capitalize text-sky-600 dark:text-sky-400">{level}</span> ·{' '}
            <span className="tabular-nums">
              {completedInTrack}/{totalSubtopics} subtopics checked
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
            Topic-by-Topic Guided Study
          </h1>
        </div>

        <button
          type="button"
          onClick={onSwitchTrackOrLevel}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
        >
          <Compass className="w-3.5 h-3.5 text-sky-500" />
          <span>Choose Comfort Level</span>
        </button>
      </div>

      {dueReviews.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            <strong className="text-amber-700 dark:text-amber-300">
              Spaced Repetition Due ({dueReviews.length}):
            </strong>{' '}
            {dueReviews[0].subtopic.code} {dueReviews[0].subtopic.title} ({dueReviews[0].reason})
          </div>
          <button
            type="button"
            onClick={() => openTopicWithSubtopic(dueReviews[0].topic, dueReviews[0].subtopic.id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Jump to Review
          </button>
        </div>
      )}

      {level === 'refresh' && (
        <div className="p-4 rounded-xl border border-sky-500/40 bg-sky-500/5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <strong>Refresh Mode Active:</strong> Open any topic below to jump straight to its
          End-of-Topic Exam or skim its subtopic command tables and mental models.
        </div>
      )}

      {/* Single-Column Inline Topic Accordion: Each topic's drawer of notes opens IMMEDIATELY below that topic */}
      <div className="space-y-4">
        {topics.map((topic, topicIdx) => {
          const isOpen = openTopicId === topic.id;
          const topicExamRec = progress.topicExams[topic.id];
          const doneSubs = topic.subtopics.filter((s) =>
            Boolean(progress.subtopicChecks[s.id]),
          ).length;
          const nextTopic = topics[topicIdx + 1];

          const activeSubtopic: SubtopicNode =
            drawerMode.kind === 'subtopic'
              ? topic.subtopics.find((s) => s.id === drawerMode.subtopicId) ??
                topic.subtopics[0]
              : topic.subtopics[0];

          const getNextAfterSubtopic = (sub: SubtopicNode) => {
            const idx = topic.subtopics.findIndex((s) => s.id === sub.id);
            const nextSub = topic.subtopics[idx + 1];
            if (nextSub) {
              return {
                label: `Next Subtopic: ${nextSub.code} ${nextSub.title}`,
                action: () => setDrawerMode({ kind: 'subtopic', subtopicId: nextSub.id }),
              };
            }
            return {
              label: `Take Topic ${topic.number} End Exam`,
              action: () => setDrawerMode({ kind: 'topic-exam' }),
            };
          };

          return (
            <section
              key={topic.id}
              className={`rounded-xl border transition-colors ${
                isOpen
                  ? 'border-sky-500/60 bg-white dark:bg-[#101622]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Topic Header Row */}
              <button
                type="button"
                onClick={() => {
                  if (isOpen) {
                    setOpenTopicId(null);
                  } else {
                    openTopicWithSubtopic(topic, topic.subtopics[0].id);
                  }
                }}
                aria-expanded={isOpen}
                className="w-full text-left p-5 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-mono font-semibold text-sky-600 dark:text-sky-400">
                      Topic {topic.number}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{topic.levelTag}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {doneSubs}/{topic.subtopics.length} subtopics checked
                    </span>
                    {topicExamRec && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Exam {topicExamRec.score}/{topicExamRec.total}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
                    {topic.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {topic.summary}
                  </p>
                </div>

                <span className="p-2 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>

              {/* Inline Notes Drawer — Opens IMMEDIATELY below this topic */}
              {isOpen && (
                <div className="border-t border-slate-200 dark:border-slate-800 px-5 sm:px-7 py-6 space-y-7">
                  {/* Subtopic & End-Exam Switcher Strip */}
                  <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-slate-200 dark:border-slate-800/80">
                    {topic.subtopics.map((sub) => {
                      const active =
                        drawerMode.kind === 'subtopic' && activeSubtopic.id === sub.id;
                      const checked = Boolean(progress.subtopicChecks[sub.id]);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => openTopicWithSubtopic(topic, sub.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>
                            {sub.code} {sub.title}
                          </span>
                          {checked && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                active ? 'text-white dark:text-slate-950' : 'text-emerald-500'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => openTopicExam(topic)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        drawerMode.kind === 'topic-exam'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Topic {topic.number} End Exam</span>
                    </button>
                  </div>

                  {drawerMode.kind === 'subtopic' ? (
                    <div className="space-y-6">
                      {/* Subtopic Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                            Subtopic {activeSubtopic.code} ·{' '}
                            <span className="capitalize">{activeSubtopic.levelTag}</span> ·{' '}
                            {activeSubtopic.readMinutes} min read
                          </div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                            {activeSubtopic.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                            {activeSubtopic.summary}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onAskZero(
                              `Subtopic ${activeSubtopic.code}: ${activeSubtopic.title}`,
                              `Topic: ${topic.title}\nSubtopic: ${activeSubtopic.title}\nMental model: ${activeSubtopic.beginnerMentalModel}`,
                              `Explain "${activeSubtopic.title}" with an extra beginner-friendly example and ask me one check question!`,
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                          <span>Ask Zero</span>
                        </button>
                      </div>

                      {/* Plain-English Mental Model */}
                      <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Start Here: Plain-English Mental Model</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                          {activeSubtopic.beginnerMentalModel}
                        </p>
                      </div>

                      {/* Structured Notes */}
                      <div className="space-y-5">
                        {activeSubtopic.sections.map((sec) => (
                          <div key={sec.heading} className="space-y-2">
                            <h4 className="font-display text-base font-semibold text-slate-950 dark:text-white">
                              {sec.heading}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-[75ch]">
                              {sec.body}
                            </p>
                            {sec.bullets && sec.bullets.length > 0 && (
                              <ul className="space-y-2 pt-1 text-sm text-slate-700 dark:text-slate-300">
                                {sec.bullets.map((b, i) => (
                                  <li key={i} className="flex items-start gap-2.5">
                                    <span className="font-mono text-xs text-sky-600 dark:text-sky-400 mt-1 tabular-nums">
                                      0{i + 1}.
                                    </span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Command / Workflow Reference */}
                      {activeSubtopic.commands.length > 0 && (
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-sky-500" />
                            <h4 className="font-display text-base font-semibold text-slate-950 dark:text-white">
                              {track === 'ccna'
                                ? 'Cisco IOS Command Reference'
                                : 'Help Desk Commands & Tools'}
                            </h4>
                          </div>
                          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 dark:bg-[#0B0F17] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                  <th className="py-2.5 px-3 font-semibold">Command / Tool</th>
                                  <th className="py-2.5 px-3 font-semibold">Context</th>
                                  <th className="py-2.5 px-3 font-semibold">Purpose</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                                {activeSubtopic.commands.map((cmd) => (
                                  <tr key={cmd.command}>
                                    <td className="py-2.5 px-3 font-mono text-sky-700 dark:text-sky-300 whitespace-nowrap">
                                      {cmd.command}
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                      {cmd.mode}
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                                      {cmd.purpose}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Key Rule */}
                      <div className="p-4 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/20 space-y-1">
                        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                          Subtopic Key Rule
                        </p>
                        <p className="text-sm text-amber-950 dark:text-amber-100/90 leading-relaxed">
                          {activeSubtopic.takeaway}
                        </p>
                      </div>

                      {/* Personal Notes */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={`note-${activeSubtopic.id}`}
                            className="font-display text-sm font-semibold text-slate-950 dark:text-white"
                          >
                            Your Notes for Subtopic {activeSubtopic.code}
                          </label>
                          <span className="text-xs text-slate-400">Saved locally</span>
                        </div>
                        <textarea
                          id={`note-${activeSubtopic.id}`}
                          rows={2}
                          value={progress.lessonNotes[activeSubtopic.id] ?? ''}
                          onChange={(e) => onSaveNote(activeSubtopic.id, e.target.value)}
                          placeholder="Jot down your own summary or reminder..."
                          className="w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>

                      {/* Subtopic Knowledge Check */}
                      <InteractiveQuizPanel
                        title={`Subtopic ${activeSubtopic.code} Knowledge Check`}
                        subtitle="Answer all questions to unlock a detailed breakdown of every option—even if you score 100%."
                        questions={activeSubtopic.knowledgeCheck}
                        savedRecord={progress.subtopicChecks[activeSubtopic.id]}
                        submitLabel="Submit Knowledge Check & View Full Details"
                        onSubmitAttempt={(rec) => onSaveSubtopicCheck(activeSubtopic.id, rec)}
                        onAskZeroQuestion={(q, chosenIdx) =>
                          onAskZero(
                            `Subtopic ${activeSubtopic.code} Check`,
                            `Question: ${q.prompt}\nLearner selected: ${chosenIdx !== undefined ? q.options[chosenIdx] : 'None'}\nCorrect answer: ${q.options[q.correctIndex]}\nExplanation: ${q.deepExplanation}`,
                            'Break down every technical detail in this question and test me with a slight twist!',
                          )
                        }
                        nextActionLabel={getNextAfterSubtopic(activeSubtopic).label}
                        onNextAction={getNextAfterSubtopic(activeSubtopic).action}
                      />
                    </div>
                  ) : (
                    /* Inline End-of-Topic Exam */
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            End-of-Topic Mastery Assessment · Topic {topic.number}
                          </div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                            Topic {topic.number} Exam: {topic.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                            Verify everything you learned across Topic {topic.number}. Submitting
                            unlocks full option-by-option explanations—even when you score 100%.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openTopicWithSubtopic(topic, topic.subtopics[0].id)}
                          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                        >
                          Back to Topic {topic.number} Notes
                        </button>
                      </div>

                      <InteractiveQuizPanel
                        title={`Topic ${topic.number} Comprehensive Exam (${topic.topicExam.length} Questions)`}
                        subtitle="Full detail breakdown unlocks immediately upon submission."
                        questions={topic.topicExam}
                        savedRecord={progress.topicExams[topic.id]}
                        submitLabel="Submit Topic Exam & Inspect Every Detail"
                        onSubmitAttempt={(rec) => onSaveTopicExam(topic.id, rec)}
                        onAskZeroQuestion={(q, chosenIdx) =>
                          onAskZero(
                            `Topic ${topic.number} Exam`,
                            `Question: ${q.prompt}\nLearner selected: ${chosenIdx !== undefined ? q.options[chosenIdx] : 'None'}\nCorrect answer: ${q.options[q.correctIndex]}\nExplanation: ${q.deepExplanation}`,
                            'Walk me deeper into the networking or systems behavior behind this exam question.',
                          )
                        }
                        nextActionLabel={
                          nextTopic
                            ? `Open Topic ${nextTopic.number}: ${nextTopic.title}`
                            : undefined
                        }
                        onNextAction={
                          nextTopic
                            ? () => openTopicWithSubtopic(nextTopic, nextTopic.subtopics[0].id)
                            : undefined
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
