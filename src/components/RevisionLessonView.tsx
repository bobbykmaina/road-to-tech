import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  RotateCcw,
  RotateCw,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { QuizAttemptRecord } from '../types/ccna';
import {
  ActiveStudyTrackId,
  DeepLessonDocument,
  TrackLessonEntry,
} from '../types/curriculum';

interface RevisionLessonViewProps {
  entry: TrackLessonEntry;
  lesson: DeepLessonDocument;
  completedOriginTrack: ActiveStudyTrackId;
  addendumRead: boolean;
  revisionCompleted: boolean;
  savedRevisionCheck?: QuizAttemptRecord;
  onMarkAddendumRead: () => void;
  onSaveRevisionCheck: (record: QuizAttemptRecord, markRevisionDone: boolean) => void;
  onCompleteRevisionManual: () => void;
  onShowFullLesson: () => void;
  onAskPing: (label: string, payload: string, prompt: string) => void;
}

export function RevisionLessonView({
  entry,
  lesson,
  completedOriginTrack,
  addendumRead,
  revisionCompleted,
  savedRevisionCheck,
  onMarkAddendumRead,
  onSaveRevisionCheck,
  onCompleteRevisionManual,
  onShowFullLesson,
  onAskPing,
}: RevisionLessonViewProps) {
  const quickQuestions = lesson.checkQuestions.slice(0, 3);
  const [selected, setSelected] = useState<Record<string, number>>(
    savedRevisionCheck?.selected ?? {},
  );
  const [submitted, setSubmitted] = useState<boolean>(Boolean(savedRevisionCheck));

  useEffect(() => {
    setSelected(savedRevisionCheck?.selected ?? {});
    setSubmitted(Boolean(savedRevisionCheck));
  }, [entry.entryId, savedRevisionCheck]);

  const hasAddendum = Boolean(entry.versionAddendum);
  const canCompleteRevision = !hasAddendum || addendumRead;

  const allAnswered = quickQuestions.every((q) => selected[q.id] !== undefined);
  const score = quickQuestions.filter((q) => selected[q.id] === q.correctIndex).length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    onSaveRevisionCheck(
      {
        score,
        total: quickQuestions.length,
        selected,
        completedAt: new Date().toISOString(),
      },
      canCompleteRevision,
    );
  };

  const originLabel =
    completedOriginTrack === 'ccna-v1.1'
      ? 'CCNA v1.1'
      : completedOriginTrack === 'ccna-v2.0'
        ? 'CCNA v2.0'
        : 'IT Support';

  return (
    <div className="space-y-6">
      {/* Revision Mode Header */}
      <header className="p-6 rounded-xl border border-sky-500/40 bg-sky-500/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-sky-700 dark:text-sky-300 font-semibold">
            <RotateCw className="w-4 h-4 shrink-0" />
            <span>Revision Mode</span>
            <span aria-hidden="true">·</span>
            <span>Mastered earlier in {originLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Topics: {entry.officialTopicIds.join(', ')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onShowFullLesson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101622] text-slate-800 dark:text-slate-100 hover:border-sky-500 transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Show full lesson</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onAskPing(
                  `Revision · ${entry.code} ${entry.title}`,
                  `Canonical ID: ${entry.contentId}\nTrack: ${entry.trackId}\nOrigin: ${originLabel}\nSummary: ${entry.summary}`,
                  `Quiz me rapidly on "${entry.title}" with one realistic exam scenario using Predict → Verify.`,
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Rapid Review with Ping</span>
            </button>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white leading-tight">
          {entry.code} {entry.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Because you already completed this shared core lesson in <strong>{originLabel}</strong>,
          your notes below are condensed for fast revision: key points, key commands, common traps,
          any version-specific addendum, and a 3-question check.
        </p>

        {revisionCompleted && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>↻ Revision completed for this track</span>
          </div>
        )}
      </header>

      {/* Version Addendum (Required when present!) */}
      {entry.versionAddendum && (
        <section className="p-6 rounded-xl border border-amber-500/50 bg-amber-500/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>New for this version · Required to complete revision</span>
            </div>

            <button
              type="button"
              onClick={onMarkAddendumRead}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                addendumRead
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white hover:bg-amber-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{addendumRead ? 'Addendum Read' : 'Mark Addendum Read'}</span>
            </button>
          </div>

          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
            {entry.versionAddendum.title}
          </h2>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {entry.versionAddendum.summary}
          </p>
          <ul className="space-y-1.5 text-sm text-slate-800 dark:text-slate-200 list-disc list-inside">
            {entry.versionAddendum.points.map((pt, idx) => (
              <li key={idx} className="leading-relaxed">
                {pt}
              </li>
            ))}
          </ul>
          {entry.versionAddendum.cliOrWorkflowDiff && (
            <div className="p-3 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs">
              {entry.versionAddendum.cliOrWorkflowDiff}
            </div>
          )}
        </section>
      )}

      {/* Condensed Recap Grid: Key Points, Key Commands, Common Traps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Key Points */}
        <section className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3">
          <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
            Key Revision Points
          </h2>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {lesson.summaryBullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 mt-1">
                  0{idx + 1}.
                </span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Key Commands or Triage Steps */}
        <section className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-500" />
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
              {lesson.iosCliGuide ? 'Key IOS Commands to Recall' : 'Key Verification Steps'}
            </h2>
          </div>

          {lesson.iosCliGuide ? (
            <div className="space-y-2.5">
              {lesson.iosCliGuide.commands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#090D14] text-sky-200 font-mono text-xs space-y-1"
                >
                  <div className="text-slate-400">{cmd.title}</div>
                  <div>{cmd.promptAndCommand}</div>
                </div>
              ))}
            </div>
          ) : lesson.supportWalkthrough ? (
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {lesson.supportWalkthrough.steps.map((st, idx) => (
                <li key={idx}>
                  <strong className="text-slate-900 dark:text-white">{st.phase}: </strong>
                  {st.action}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      {/* Common Traps Recap */}
      <section className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
            Exam &amp; Interview Traps to Watch For
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lesson.commonTraps.slice(0, 4).map((t, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] space-y-1 text-xs"
            >
              <div className="font-semibold text-rose-700 dark:text-rose-400">Trap: {t.trap}</div>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Fix: {t.reality}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Question Quick Revision Check */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
            Quick Revision Check ({quickQuestions.length} Questions)
          </h2>
          {submitted && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {score}/{quickQuestions.length} (
                {Math.round((score / Math.max(1, quickQuestions.length)) * 100)}%)
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelected({});
                  setSubmitted(false);
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
          {quickQuestions.map((q, idx) => {
            const picked = selected[q.id];
            const isCorrect = picked === q.correctIndex;
            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white whitespace-pre-line">
                    <span className="font-mono text-sky-600 dark:text-sky-400 mr-2">
                      Q{idx + 1}.
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

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const chosen = picked === optIdx;
                    const right = optIdx === q.correctIndex;
                    return (
                      <div key={optIdx} className="space-y-1">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => setSelected((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors ${
                            submitted
                              ? right
                                ? 'border-emerald-500 bg-emerald-500/10 text-slate-950 dark:text-white font-medium'
                                : chosen
                                  ? 'border-rose-500 bg-rose-500/10 text-slate-900 dark:text-slate-100'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                              : chosen
                                ? 'border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white font-medium'
                                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                        {submitted && q.optionExplanations[optIdx] && (
                          <div className="pl-3 text-xs text-slate-600 dark:text-slate-400">
                            {q.optionExplanations[optIdx]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!submitted && (
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 disabled:opacity-40 transition-colors"
            >
              Submit Revision Check
            </button>
          )}

          {!revisionCompleted && (
            <button
              type="button"
              disabled={!canCompleteRevision}
              onClick={onCompleteRevisionManual}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg border border-sky-500/50 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10 disabled:opacity-40 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>
                {canCompleteRevision
                  ? 'Mark Revision Complete (↻)'
                  : 'Read Version Addendum Above First'}
              </span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
