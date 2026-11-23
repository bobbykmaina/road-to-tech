import { ArrowRight, CheckCircle2, RotateCcw, RotateCw } from 'lucide-react';
import { TrackLessonEntry } from '../types/curriculum';

export type NextBarBoundaryKind =
  | 'next-lesson-in-topic'
  | 'next-topic-in-unit'
  | 'next-unit'
  | 'track-complete';

export interface BottomNextBarProps {
  visible: boolean;
  currentEntry: TrackLessonEntry;
  boundaryKind: NextBarBoundaryKind;
  nextEntry: TrackLessonEntry | null;
  nextIsRevision: boolean;
  nextUnitTitle?: string;
  topicCompleted: boolean;
  checkAttempted: boolean;
  checkScorePct: number | null;
  onContinue: () => void;
  onReviewTopic: () => void;
  onRetryCheck: () => void;
  onTakeUnitTest: () => void;
  onTakeMockExam: () => void;
}

export function BottomNextBar({
  visible,
  currentEntry,
  boundaryKind,
  nextEntry,
  nextIsRevision,
  nextUnitTitle,
  topicCompleted,
  checkAttempted,
  checkScorePct,
  onContinue,
  onReviewTopic,
  onRetryCheck,
  onTakeUnitTest,
  onTakeMockExam,
}: BottomNextBarProps) {
  if (!visible) return null;

  const isBelowThreshold = checkAttempted && checkScorePct !== null && checkScorePct < 70;

  let headline = '';
  let subline = '';

  if (boundaryKind === 'next-lesson-in-topic' && nextEntry) {
    headline = nextIsRevision
      ? `Next (revision): ${nextEntry.title}`
      : `Next lesson: ${nextEntry.title}`;
    subline = `Topic ${currentEntry.topicNumber} · Lesson ${nextEntry.code}`;
  } else if (boundaryKind === 'next-topic-in-unit' && nextEntry) {
    headline = nextIsRevision
      ? `${topicCompleted ? '✓ Topic complete · ' : ''}Next (revision): ${nextEntry.title} (${nextEntry.unitNumber})`
      : `${topicCompleted ? '✓ Topic complete · ' : ''}Next: ${nextEntry.title} (${nextEntry.unitNumber})`;
    subline = `Moving to Topic ${nextEntry.topicNumber} in ${nextEntry.unitTitle}`;
  } else if (boundaryKind === 'next-unit' && nextEntry) {
    headline = `✓ Unit complete → take the unit test or start ${nextUnitTitle ?? nextEntry.unitNumber}`;
    subline = nextIsRevision
      ? `Next unit opens with (revision): ${nextEntry.title}`
      : `Next unit starts with ${nextEntry.code} ${nextEntry.title}`;
  } else {
    headline = '✓ Track complete → take the full mock exam';
    subline = `Finished ${currentEntry.unitNumber}: ${currentEntry.topicTitle}`;
  }

  return (
    <div
      role="region"
      aria-label="Lesson progression bar"
      className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-950 dark:text-white truncate">
            {nextIsRevision && <RotateCw className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
            {!nextIsRevision && topicCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
            <span className="truncate">{headline}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {isBelowThreshold
              ? `Check score ${checkScorePct}% (under 70% suggested) — review or continue anyway.`
              : subline}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onReviewTopic}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 whitespace-nowrap"
          >
            Review this topic
          </button>

          {isBelowThreshold && (
            <button
              type="button"
              onClick={onRetryCheck}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-amber-500/60 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry check</span>
            </button>
          )}

          {boundaryKind === 'next-unit' && (
            <button
              type="button"
              onClick={onTakeUnitTest}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-sky-500/50 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 whitespace-nowrap"
            >
              Unit Test / Review
            </button>
          )}

          {boundaryKind === 'track-complete' ? (
            <button
              type="button"
              onClick={onTakeMockExam}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 whitespace-nowrap"
            >
              <span>Take Full Mock Exam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 whitespace-nowrap"
            >
              <span>{isBelowThreshold ? 'Continue anyway' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
