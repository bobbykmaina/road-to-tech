import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  Eye,
  EyeOff,
  Layers,
  ListTree,
  MessageSquare,
  Network,
  RotateCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CCNA_V11_DOMAINS,
  CCNA_V20_DOMAINS,
  EXISTING_LESSON_MIGRATION_AUDIT,
  SHARED_CONTENT_MAP,
  WHAT_CHANGED_V20_NOTES,
  getAllEntriesForStudyTrack,
  getAllSearchableTrackEntries,
  getUnitsForStudyTrack,
} from '../content/curriculumCatalog';
import { GLOBAL_GLOSSARY_TERMS } from '../content/glossaryData';
import { loadDeepLesson } from '../content/lessonLoader';
import { LocalProgressState, QuizAttemptRecord, WorkspaceTab } from '../types/ccna';
import {
  ActiveStudyTrackId,
  DeepLessonDocument,
  LessonProgressStatus,
  TrackLessonEntry,
  TrackUnitPlan,
} from '../types/curriculum';
import { BottomNextBar, NextBarBoundaryKind } from './BottomNextBar';
import { DeepLessonRenderer } from './DeepLessonRenderer';
import { RevisionLessonView } from './RevisionLessonView';

interface GuidedCurriculumViewProps {
  progress: LocalProgressState;
  jumpTarget?: { topicId: string; subtopicId?: string; nonce: number } | null;
  onBack: () => void;
  onSetStudyTrack: (track: ActiveStudyTrackId | null) => void;
  onSetLastLesson: (trackId: ActiveStudyTrackId, entryId: string) => void;
  onSetLessonStatus: (
    contentId: string,
    status: LessonProgressStatus,
    completedTrack?: ActiveStudyTrackId,
  ) => void;
  onMarkAddendumRead: (trackId: ActiveStudyTrackId, entryId: string) => void;
  onCompleteRevision: (trackId: ActiveStudyTrackId, contentId: string) => void;
  onSaveRevisionCheck: (
    trackId: ActiveStudyTrackId,
    contentId: string,
    record: QuizAttemptRecord,
    markRevisionDone: boolean,
  ) => void;
  onToggleBookmark: (contentId: string) => void;
  onToggleReadingMode: () => void;
  onSaveDeepCheck: (
    contentId: string,
    record: QuizAttemptRecord,
    trackId?: ActiveStudyTrackId,
  ) => void;
  onSaveNote: (contentId: string, note: string) => void;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onOpenTrackExam: (studyTrack: ActiveStudyTrackId) => void;
  onSwitchTrackOrLevel: () => void;
  onAskPing: (contextLabel: string, contextPayload: string, prompt: string) => void;
}

type LearnSubView = 'lessons' | 'blueprint' | 'search';
type TreeFilter = 'all' | 'ready' | 'bookmarked';

const DEFAULT_ENTRY_BY_TRACK: Record<ActiveStudyTrackId, string> = {
  'ccna-v2.0': 'v20.0.1.1',
  'ccna-v1.1': 'v11.0.1.1',
  'it-support': 'itsup.0.1.1',
};

function getTrackDisplayName(trackId: ActiveStudyTrackId): string {
  if (trackId === 'ccna-v1.1') return 'CCNA v1.1 (through Feb 2, 2027)';
  if (trackId === 'ccna-v2.0') return 'CCNA v2.0 (from Feb 3, 2027)';
  return 'IT Help Desk & Support';
}

function getShortTrackName(trackId: ActiveStudyTrackId): string {
  if (trackId === 'ccna-v1.1') return 'CCNA v1.1';
  if (trackId === 'ccna-v2.0') return 'CCNA v2.0';
  return 'IT Support';
}

function getContentStatus(progress: LocalProgressState, contentId: string): LessonProgressStatus {
  const explicit = progress.lessonStatusById[contentId];
  if (explicit) return explicit;
  if (progress.completedLessons.includes(contentId)) return 'mastered';
  return 'not-started';
}

function getEntryProgressState(
  progress: LocalProgressState,
  trackId: ActiveStudyTrackId,
  entry: TrackLessonEntry,
): {
  kind: 'new-mastered' | 'revised' | 'needs-revision' | 'in-progress' | 'not-started';
  originTrack: ActiveStudyTrackId | null;
} {
  const status = getContentStatus(progress, entry.contentId);
  const originTrack = progress.completedInTrack[entry.contentId] ?? null;
  const revDoneList = progress.revisionCompletedByTrack[trackId] ?? [];
  const isRevisedInCurrent = revDoneList.includes(entry.contentId);

  if (status === 'mastered') {
    if (entry.relation === 'shared' && originTrack && originTrack !== trackId) {
      return isRevisedInCurrent
        ? { kind: 'revised', originTrack }
        : { kind: 'needs-revision', originTrack };
    }
    return { kind: 'new-mastered', originTrack: originTrack ?? trackId };
  }
  if (status === 'in-progress') {
    return { kind: 'in-progress', originTrack };
  }
  return { kind: 'not-started', originTrack };
}

function getRelationLabel(relation: TrackLessonEntry['relation']): string {
  if (relation === 'v1.1-only') return 'v1.1 Only';
  if (relation === 'v2.0-only') return 'v2.0 Only';
  return 'Shared';
}

export function GuidedCurriculumView({
  progress,
  jumpTarget,
  onBack,
  onSetStudyTrack,
  onSetLastLesson,
  onSetLessonStatus,
  onMarkAddendumRead,
  onCompleteRevision,
  onSaveRevisionCheck,
  onToggleBookmark,
  onToggleReadingMode,
  onSaveDeepCheck,
  onSaveNote,
  onNavigateTab,
  onOpenTrackExam,
  onSwitchTrackOrLevel,
  onAskPing,
}: GuidedCurriculumViewProps) {
  const rawStudyTrack = progress.activeStudyTrack;
  const activeStudyTrack: ActiveStudyTrackId = rawStudyTrack ?? 'ccna-v2.0';

  const units: TrackUnitPlan[] = useMemo(
    () => getUnitsForStudyTrack(activeStudyTrack),
    [activeStudyTrack],
  );

  const trackEntries: TrackLessonEntry[] = useMemo(
    () => getAllEntriesForStudyTrack(activeStudyTrack),
    [activeStudyTrack],
  );

  const [subView, setSubView] = useState<LearnSubView>('lessons');
  const [treeFilter, setTreeFilter] = useState<TreeFilter>('all');
  const [mobileTreeOpen, setMobileTreeOpen] = useState<boolean>(false);
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullLessonOverride, setShowFullLessonOverride] = useState<Record<string, boolean>>({});

  // Determine initial/current entry: honor explicit jumpTarget first, then saved lastLessonByTrack, then Unit 0
  const resolveInitialEntryId = (): string => {
    if (jumpTarget) {
      if (jumpTarget.subtopicId) {
        const matchSub = trackEntries.find(
          (e) => e.entryId === jumpTarget.subtopicId || e.contentId === jumpTarget.subtopicId,
        );
        if (matchSub) return matchSub.entryId;
      }
      const matchTopic = trackEntries.find(
        (e) => e.topicId === jumpTarget.topicId || e.entryId === jumpTarget.topicId,
      );
      if (matchTopic) return matchTopic.entryId;
      const matchUnit = units.find((u) => u.id === jumpTarget.topicId);
      if (matchUnit?.topics[0]?.lessons[0]) return matchUnit.topics[0].lessons[0].entryId;
    }
    const savedLastEntryId = progress.lastLessonByTrack[activeStudyTrack];
    if (savedLastEntryId && trackEntries.some((e) => e.entryId === savedLastEntryId)) {
      return savedLastEntryId;
    }
    return DEFAULT_ENTRY_BY_TRACK[activeStudyTrack];
  };

  const [selectedEntryId, setSelectedEntryId] = useState<string>(resolveInitialEntryId);

  const [loadedLesson, setLoadedLesson] = useState<DeepLessonDocument | null>(null);
  const [loadingLesson, setLoadingLesson] = useState<boolean>(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Scroll sentinel state for BottomNextBar
  const [scrolledToEnd, setScrolledToEnd] = useState<boolean>(false);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync selectedEntryId when switching between CCNA v1.1, CCNA v2.0, and IT Support tracks
  useEffect(() => {
    if (trackEntries.length === 0) return;
    if (jumpTarget) {
      const targetHit =
        (jumpTarget.subtopicId &&
          trackEntries.some(
            (e) => e.entryId === jumpTarget.subtopicId || e.contentId === jumpTarget.subtopicId,
          )) ||
        trackEntries.some(
          (e) => e.topicId === jumpTarget.topicId || e.entryId === jumpTarget.topicId,
        ) ||
        units.some((u) => u.id === jumpTarget.topicId);
      if (targetHit) return;
    }
    const existsInCurrent = trackEntries.some((e) => e.entryId === selectedEntryId);
    if (!existsInCurrent) {
      const remembered = progress.lastLessonByTrack[activeStudyTrack];
      const hasRemembered = remembered && trackEntries.some((e) => e.entryId === remembered);
      const fallback = DEFAULT_ENTRY_BY_TRACK[activeStudyTrack];
      const nextId = hasRemembered
        ? remembered
        : trackEntries.some((e) => e.entryId === fallback)
          ? fallback
          : trackEntries[0].entryId;
      setSelectedEntryId(nextId);
    }
  }, [activeStudyTrack, trackEntries, selectedEntryId, progress.lastLessonByTrack, jumpTarget, units]);

  // Persist last visited entry for the active track
  useEffect(() => {
    if (!rawStudyTrack) return;
    const valid = trackEntries.some((e) => e.entryId === selectedEntryId);
    if (valid) {
      onSetLastLesson(activeStudyTrack, selectedEntryId);
    }
  }, [rawStudyTrack, activeStudyTrack, selectedEntryId, trackEntries, onSetLastLesson]);

  const selectedEntry: TrackLessonEntry | undefined = useMemo(
    () => trackEntries.find((e) => e.entryId === selectedEntryId) ?? trackEntries[0],
    [trackEntries, selectedEntryId],
  );

  // Expand unit holding selected entry automatically
  useEffect(() => {
    if (selectedEntry) {
      setExpandedUnits((prev) => ({ ...prev, [selectedEntry.unitId]: true }));
    }
  }, [selectedEntry]);

  // Honor external jumpTarget (from Overview or Spaced Repetition)
  useEffect(() => {
    if (!jumpTarget) return;
    setSubView('lessons');
    if (jumpTarget.subtopicId) {
      const matchEntry = trackEntries.find(
        (e) => e.entryId === jumpTarget.subtopicId || e.contentId === jumpTarget.subtopicId,
      );
      if (matchEntry) {
        setSelectedEntryId(matchEntry.entryId);
        return;
      }
    }
    const matchTopic = trackEntries.find(
      (e) => e.topicId === jumpTarget.topicId || e.entryId === jumpTarget.topicId,
    );
    if (matchTopic) {
      setSelectedEntryId(matchTopic.entryId);
      return;
    }
    const matchUnit = units.find((u) => u.id === jumpTarget.topicId);
    if (matchUnit && matchUnit.topics[0]?.lessons[0]) {
      setSelectedEntryId(matchUnit.topics[0].lessons[0].entryId);
    }
  }, [jumpTarget, trackEntries, units]);

  // Load canonical deep lesson document by contentId (stored once across tracks!)
  useEffect(() => {
    let cancelled = false;
    setScrolledToEnd(false);
    if (!selectedEntry || !selectedEntry.available) {
      setLoadedLesson(null);
      setLoadingLesson(false);
      setLessonError(null);
      return;
    }
    setLoadingLesson(true);
    setLessonError(null);
    void loadDeepLesson(selectedEntry.contentId)
      .then((doc) => {
        if (cancelled) return;
        setLoadedLesson(doc);
        setLoadingLesson(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLessonError(err instanceof Error ? err.message : 'Unable to load lesson module.');
        setLoadingLesson(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedEntry]);

  // IntersectionObserver for end-of-lesson BottomNextBar
  useEffect(() => {
    if (subView !== 'lessons' || !bottomSentinelRef.current) return;
    const node = bottomSentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setScrolledToEnd(true);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [subView, selectedEntry?.entryId, loadingLesson]);

  const allSearchEntries = useMemo(() => getAllSearchableTrackEntries(), []);

  const filteredSearchEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allSearchEntries;
    return allSearchEntries.filter((l) => {
      const hay = [
        l.entryId,
        l.contentId,
        l.code,
        l.title,
        l.summary,
        l.unitTitle,
        l.topicTitle,
        ...l.officialTopicIds,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [allSearchEntries, searchQuery]);

  const filteredGlossary = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GLOBAL_GLOSSARY_TERMS;
    return GLOBAL_GLOSSARY_TERMS.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.shortDef.toLowerCase().includes(q) ||
        g.fullDef.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const selectTrackAndOpenEntry = (trackId: ActiveStudyTrackId, entryId?: string) => {
    onSetStudyTrack(trackId);
    const targetEntries = getAllEntriesForStudyTrack(trackId);
    if (entryId && targetEntries.some((e) => e.entryId === entryId)) {
      setSelectedEntryId(entryId);
    } else {
      const remembered = progress.lastLessonByTrack[trackId];
      const hasRemembered = remembered && targetEntries.some((e) => e.entryId === remembered);
      setSelectedEntryId(
        hasRemembered ? remembered : DEFAULT_ENTRY_BY_TRACK[trackId] ?? targetEntries[0].entryId,
      );
    }
    setSubView('lessons');
    setMobileTreeOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEntryFromSearchOrBlueprint = (entry: TrackLessonEntry) => {
    selectTrackAndOpenEntry(entry.trackId, entry.entryId);
  };

  // Inline 3-Track Chooser if no track selected yet
  if (rawStudyTrack === null) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="space-y-2 max-w-3xl">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            Choose Your Study Track
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            CCNA v1.1 and CCNA v2.0 are completely separate tracks with independent sidebars,
            prerequisite teaching orders, and mock exams. Shared lessons are stored once and
            automatically open in condensed Revision Mode across tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CCNA v2.0 */}
          <button
            type="button"
            onClick={() => selectTrackAndOpenEntry('ccna-v2.0')}
            className="text-left p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-sky-500 transition-colors flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 font-semibold">
                <span>Module A · Exam from Feb 3, 2027</span>
                <Network className="w-4 h-4 shrink-0" />
              </div>
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                CCNA v2.0 (200-301)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                5 domains in prerequisite teaching order: Foundations, Infrastructure (25%), Switching
                (25%), Routing/OSPFv3 (20%), Services/Sec (20%), Agentic AI &amp; Ops (10%).
              </p>
            </div>
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 inline-flex items-center gap-1">
              <span>Open CCNA v2.0 Track</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* CCNA v1.1 */}
          <button
            type="button"
            onClick={() => selectTrackAndOpenEntry('ccna-v1.1')}
            className="text-left p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-amber-500 transition-colors flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold">
                <span>Module A · Exam through Feb 2, 2027</span>
                <Network className="w-4 h-4 shrink-0" />
              </div>
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                CCNA v1.1 (200-301)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                6 domains in prerequisite teaching order: Foundations, Fundamentals (20%), Access
                (20%), IP Connectivity (25%), IP Services (10%), Security (15%), Automation (10%).
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
              <span>Open CCNA v1.1 Track</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* IT Support */}
          <button
            type="button"
            onClick={() => selectTrackAndOpenEntry('it-support')}
            className="text-left p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-emerald-500 transition-colors flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Module B · 12 Units (U0–U11)</span>
                <Cpu className="w-4 h-4 shrink-0" />
              </div>
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                IT Help Desk &amp; Systems Support
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Vendor-neutral U1 ticketing first, then Hardware, OS, Networking, AD/Entra, M365,
                Security, U9 Tools Tour (JSM, ServiceNow, Zendesk, Freshservice), ITSM &amp; Interviews.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
              <span>Open IT Support Track</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Compute 3-part segmented progress counts (New / Revised / Remaining)
  let newMasteredCount = 0;
  let revisedCount = 0;
  for (const e of trackEntries) {
    const pState = getEntryProgressState(progress, activeStudyTrack, e);
    if (pState.kind === 'new-mastered') newMasteredCount++;
    else if (pState.kind === 'revised') revisedCount++;
  }
  const totalTrackEntries = trackEntries.length;
  const remainingCount = Math.max(0, totalTrackEntries - newMasteredCount - revisedCount);
  const newPct = totalTrackEntries > 0 ? (newMasteredCount / totalTrackEntries) * 100 : 0;
  const revPct = totalTrackEntries > 0 ? (revisedCount / totalTrackEntries) * 100 : 0;

  // Next entry & boundary computation for BottomNextBar
  const currentIdx = selectedEntry
    ? trackEntries.findIndex((e) => e.entryId === selectedEntry.entryId)
    : -1;
  const nextEntry =
    currentIdx >= 0 && currentIdx + 1 < trackEntries.length ? trackEntries[currentIdx + 1] : null;

  let boundaryKind: NextBarBoundaryKind = 'track-complete';
  if (selectedEntry && nextEntry) {
    if (nextEntry.topicId === selectedEntry.topicId) {
      boundaryKind = 'next-lesson-in-topic';
    } else if (nextEntry.unitId === selectedEntry.unitId) {
      boundaryKind = 'next-topic-in-unit';
    } else {
      boundaryKind = 'next-unit';
    }
  }

  const nextEntryState = nextEntry
    ? getEntryProgressState(progress, activeStudyTrack, nextEntry)
    : null;
  const nextIsRevision =
    nextEntryState?.kind === 'needs-revision' || nextEntryState?.kind === 'revised';

  // Selected entry state & revision check logic
  const selectedEntryState = selectedEntry
    ? getEntryProgressState(progress, activeStudyTrack, selectedEntry)
    : null;
  const isSharedMasteredElsewhere =
    Boolean(selectedEntry) &&
    selectedEntry?.relation === 'shared' &&
    Boolean(selectedEntryState?.originTrack) &&
    selectedEntryState?.originTrack !== activeStudyTrack;

  const isRevisionModeActive =
    isSharedMasteredElsewhere && !showFullLessonOverride[selectedEntry?.entryId ?? ''];

  const addendumReadList = progress.addendumReadByTrack[activeStudyTrack] ?? [];
  const addendumRead = selectedEntry ? addendumReadList.includes(selectedEntry.entryId) : false;

  const revCheckKey = selectedEntry ? `${activeStudyTrack}:${selectedEntry.contentId}` : '';
  const savedRevisionCheck = revCheckKey ? progress.revisionCheckResults[revCheckKey] : undefined;
  const savedDeepCheck = selectedEntry
    ? progress.deepCheckResults[selectedEntry.contentId]
    : undefined;

  const activeCheckRecord = isRevisionModeActive ? savedRevisionCheck : savedDeepCheck;
  const checkAttempted = Boolean(activeCheckRecord);
  const checkScorePct =
    activeCheckRecord && activeCheckRecord.total > 0
      ? Math.round((activeCheckRecord.score / activeCheckRecord.total) * 100)
      : null;

  // Topic completion check for BottomNextBar copy
  const currentTopicEntries = selectedEntry
    ? trackEntries.filter((e) => e.topicId === selectedEntry.topicId)
    : [];
  const topicCompleted =
    currentTopicEntries.length > 0 &&
    currentTopicEntries.every((e) => {
      const k = getEntryProgressState(progress, activeStudyTrack, e).kind;
      return k === 'new-mastered' || k === 'revised';
    });

  const filteredTreeUnits = units
    .map((unit) => ({
      ...unit,
      topics: unit.topics
        .map((topic) => ({
          ...topic,
          lessons: topic.lessons.filter((lesson) => {
            if (treeFilter === 'ready') return lesson.available;
            if (treeFilter === 'bookmarked') {
              return progress.bookmarkedLessons.includes(lesson.contentId);
            }
            return true;
          }),
        }))
        .filter((t) => t.lessons.length > 0),
    }))
    .filter((u) => u.topics.length > 0);

  const toggleUnitExpanded = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const domainSpecs = activeStudyTrack === 'ccna-v1.1' ? CCNA_V11_DOMAINS : CCNA_V20_DOMAINS;

  const renderSidebarTree = () => (
    <aside className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] p-4 space-y-4">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-display font-bold text-slate-950 dark:text-white">
            {getShortTrackName(activeStudyTrack)} Tree
          </span>
          <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            {newMasteredCount + revisedCount}/{totalTrackEntries} done
          </span>
        </div>

        {/* 3-segment Progress Bar (New / Revised / Remaining) */}
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            {newPct > 0 && (
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${newPct}%` }}
                title={`New Mastered: ${newMasteredCount}`}
              />
            )}
            {revPct > 0 && (
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{ width: `${revPct}%` }}
                title={`Revised: ${revisedCount}`}
              />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {newMasteredCount} New
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-semibold">
              {revisedCount} Revised (↻)
            </span>
            <span>{remainingCount} Left</span>
          </div>
        </div>

        {/* Filter segmented tabs */}
        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-[#0B0F17] text-[11px]">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'ready', label: 'Lesson Ready' },
              { id: 'bookmarked', label: 'Saved' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTreeFilter(f.id)}
              className={`px-2 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                treeFilter === f.id
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTreeUnits.length === 0 ? (
        <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">
          No lessons match this filter yet.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTreeUnits.map((unit) => {
            const unitLessons = unit.topics.flatMap((t) => t.lessons);
            const unitDone = unitLessons.filter((l) => {
              const k = getEntryProgressState(progress, activeStudyTrack, l).kind;
              return k === 'new-mastered' || k === 'revised';
            }).length;
            const isExpanded = expandedUnits[unit.id] ?? unit.id === selectedEntry?.unitId;

            return (
              <div
                key={unit.id}
                className="border border-slate-200/80 dark:border-slate-800/80 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleUnitExpanded(unit.id)}
                  className="w-full px-3 py-2.5 flex items-start justify-between gap-2 text-left bg-slate-50 dark:bg-[#0B0F17] hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono font-semibold text-sky-600 dark:text-sky-400 tabular-nums">
                      {unit.number} · {unitDone}/{unitLessons.length}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                      {unit.title}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-2 space-y-2.5 bg-white dark:bg-[#101622]">
                    {unit.topics.map((topic) => (
                      <div key={topic.id} className="space-y-1">
                        <div className="px-2 pt-1 flex items-baseline justify-between gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <span className="truncate">
                            {topic.number} · {topic.title}
                          </span>
                          <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 shrink-0">
                            {topic.officialTopicIds.join(',')}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {topic.lessons.map((lesson) => {
                            const pState = getEntryProgressState(
                              progress,
                              activeStudyTrack,
                              lesson,
                            );
                            const isCurrent = selectedEntry?.entryId === lesson.entryId;
                            const isBookmarked = progress.bookmarkedLessons.includes(
                              lesson.contentId,
                            );

                            return (
                              <button
                                key={lesson.entryId}
                                type="button"
                                onClick={() => {
                                  setSelectedEntryId(lesson.entryId);
                                  setMobileTreeOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-2 rounded-lg border transition-colors ${
                                  isCurrent
                                    ? 'border-sky-500 bg-sky-500/10'
                                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                                    {lesson.code} {lesson.title}
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                    {pState.kind === 'revised' && (
                                      <RotateCw
                                        className="w-3.5 h-3.5 text-sky-500"
                                        aria-label="Revised"
                                      />
                                    )}
                                    {pState.kind === 'new-mastered' && (
                                      <CheckCircle2
                                        className="w-3.5 h-3.5 text-emerald-500"
                                        aria-label="Mastered"
                                      />
                                    )}
                                    {isBookmarked && (
                                      <Bookmark className="w-3 h-3 text-amber-500" />
                                    )}
                                  </div>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                                  {pState.kind === 'needs-revision' ? (
                                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                                      Revision
                                    </span>
                                  ) : pState.kind === 'revised' ? (
                                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                                      Revised ↻
                                    </span>
                                  ) : pState.kind === 'new-mastered' ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                      Mastered
                                    </span>
                                  ) : pState.kind === 'in-progress' ? (
                                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                      In Progress
                                    </span>
                                  ) : (
                                    <span>Not Started</span>
                                  )}
                                  <span aria-hidden="true">·</span>
                                  <span>{lesson.readMinutes}m</span>
                                  <span aria-hidden="true">·</span>
                                  <span
                                    className={
                                      lesson.available
                                        ? 'text-sky-600 dark:text-sky-400 font-semibold'
                                        : ''
                                    }
                                  >
                                    {lesson.available ? 'Lesson Ready' : 'Coming Soon'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 space-y-6">
      {/* Top Navigation & Separate Track Controls */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={onSwitchTrackOrLevel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Skill Level: {progress.selectedLevel ?? 'beginner'}</span>
            </button>
          </div>

          {/* Three Completely Separate Track Switchers */}
          <div
            role="group"
            aria-label="Study Tracks"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800/80"
          >
            <button
              type="button"
              onClick={() => selectTrackAndOpenEntry('ccna-v2.0')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeStudyTrack === 'ccna-v2.0'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>CCNA v2.0 (from Feb 3, 2027)</span>
            </button>

            <button
              type="button"
              onClick={() => selectTrackAndOpenEntry('ccna-v1.1')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeStudyTrack === 'ccna-v1.1'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>CCNA v1.1 (through Feb 2, 2027)</span>
            </button>

            <button
              type="button"
              onClick={() => selectTrackAndOpenEntry('it-support')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeStudyTrack === 'it-support'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>IT Help Desk &amp; Support</span>
            </button>
          </div>
        </div>

        {/* Second Toolbar Row: Sub-views & Reading Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#101622] border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSubView('lessons')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  subView === 'lessons'
                    ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lessons</span>
              </button>
              <button
                type="button"
                onClick={() => setSubView('blueprint')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  subView === 'blueprint'
                    ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Blueprint &amp; Shared Map</span>
              </button>
              <button
                type="button"
                onClick={() => setSubView('search')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  subView === 'search'
                    ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search &amp; Glossary</span>
              </button>
            </div>

            {subView === 'lessons' && (
              <button
                type="button"
                onClick={() => setMobileTreeOpen((v) => !v)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>{mobileTreeOpen ? 'Hide Tree' : 'Browse Units'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {subView === 'lessons' && (
              <button
                type="button"
                onClick={onToggleReadingMode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                {progress.comfortableReadingMode ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    <span>Show Sidebar Tree</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Focus Reading Mode</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Status summary line */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {getTrackDisplayName(activeStudyTrack)}
          </span>
          <span aria-hidden="true">·</span>
          <span>{units.length} Units</span>
          <span aria-hidden="true">·</span>
          <span>{totalTrackEntries} Track Lessons</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {newMasteredCount} New Mastered
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-sky-600 dark:text-sky-400 font-semibold">
            {revisedCount} Revised (↻)
          </span>
          <span aria-hidden="true">·</span>
          <span>{remainingCount} Remaining</span>
        </div>
      </div>

      {/* SUBVIEW 1: LESSONS WORKSPACE */}
      {subView === 'lessons' && (
        <div
          className={`grid grid-cols-1 gap-6 items-start ${
            progress.comfortableReadingMode ? '' : 'lg:grid-cols-[320px_minmax(0,1fr)]'
          }`}
        >
          {/* Mobile expandable tree */}
          {mobileTreeOpen && !progress.comfortableReadingMode && (
            <div className="lg:hidden">{renderSidebarTree()}</div>
          )}

          {/* Desktop persistent sidebar tree */}
          {!progress.comfortableReadingMode && (
            <div className="hidden lg:block lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              {renderSidebarTree()}
            </div>
          )}

          {/* Lesson Reader Pane */}
          <div className="min-w-0 space-y-6">
            {loadingLesson && (
              <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] text-sm text-slate-500 dark:text-slate-400">
                Loading lesson module...
              </div>
            )}

            {lessonError && (
              <div className="p-6 rounded-xl border border-rose-500/40 bg-rose-500/10 text-sm text-rose-700 dark:text-rose-300">
                {lessonError}
              </div>
            )}

            {/* Shared Lesson in Revision Mode (Model Lesson Built) */}
            {!loadingLesson &&
              !lessonError &&
              selectedEntry &&
              selectedEntry.available &&
              loadedLesson &&
              isRevisionModeActive &&
              selectedEntryState?.originTrack && (
                <RevisionLessonView
                  entry={selectedEntry}
                  lesson={loadedLesson}
                  completedOriginTrack={selectedEntryState.originTrack}
                  addendumRead={addendumRead}
                  revisionCompleted={selectedEntryState.kind === 'revised'}
                  savedRevisionCheck={savedRevisionCheck}
                  onMarkAddendumRead={() =>
                    onMarkAddendumRead(activeStudyTrack, selectedEntry.entryId)
                  }
                  onSaveRevisionCheck={(rec, markRevDone) =>
                    onSaveRevisionCheck(activeStudyTrack, selectedEntry.contentId, rec, markRevDone)
                  }
                  onCompleteRevisionManual={() =>
                    onCompleteRevision(activeStudyTrack, selectedEntry.contentId)
                  }
                  onShowFullLesson={() =>
                    setShowFullLessonOverride((prev) => ({
                      ...prev,
                      [selectedEntry.entryId]: true,
                    }))
                  }
                  onAskPing={onAskPing}
                />
              )}

            {/* Full Deep Lesson View */}
            {!loadingLesson &&
              !lessonError &&
              selectedEntry &&
              selectedEntry.available &&
              loadedLesson &&
              !isRevisionModeActive && (
                <div className="space-y-4">
                  {isSharedMasteredElsewhere && (
                    <div className="p-3.5 rounded-xl border border-sky-500/40 bg-sky-500/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-sky-700 dark:text-sky-300 font-medium">
                        Viewing full shared core lesson (mastered earlier in{' '}
                        {getShortTrackName(selectedEntryState!.originTrack!)}).
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setShowFullLessonOverride((prev) => ({
                            ...prev,
                            [selectedEntry.entryId]: false,
                          }))
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-sky-500/40 font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-500/10"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Return to Revision View</span>
                      </button>
                    </div>
                  )}

                  <DeepLessonRenderer
                    lesson={loadedLesson}
                    status={getContentStatus(progress, selectedEntry.contentId)}
                    bookmarked={progress.bookmarkedLessons.includes(selectedEntry.contentId)}
                    savedNote={progress.lessonNotes[selectedEntry.contentId] ?? ''}
                    savedCheck={progress.deepCheckResults[selectedEntry.contentId]}
                    comfortableReadingMode={progress.comfortableReadingMode}
                    versionAddendum={selectedEntry.versionAddendum}
                    onSetStatus={(st) =>
                      onSetLessonStatus(selectedEntry.contentId, st, activeStudyTrack)
                    }
                    onToggleBookmark={() => onToggleBookmark(selectedEntry.contentId)}
                    onSaveNote={(note) => onSaveNote(selectedEntry.contentId, note)}
                    onSaveCheck={(rec) =>
                      onSaveDeepCheck(selectedEntry.contentId, rec, activeStudyTrack)
                    }
                    onNavigateTab={onNavigateTab}
                    onAskPing={onAskPing}
                  />
                </div>
              )}

            {/* Phase 2 Slot Preview (Supports Revision Mode Flag & Version Addendum cleanly!) */}
            {!loadingLesson && selectedEntry && !selectedEntry.available && (
              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-mono font-semibold text-sky-600 dark:text-sky-400">
                      {selectedEntry.entryId} · content: {selectedEntry.contentId}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {selectedEntry.unitNumber}: {selectedEntry.unitTitle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedEntry.readMinutes} min est.
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{getRelationLabel(selectedEntry.relation)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleBookmark(selectedEntry.contentId)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                      progress.bookmarkedLessons.includes(selectedEntry.contentId)
                        ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>
                      {progress.bookmarkedLessons.includes(selectedEntry.contentId)
                        ? 'Bookmarked'
                        : 'Bookmark'}
                    </span>
                  </button>
                </div>

                {isSharedMasteredElsewhere && selectedEntryState?.originTrack && (
                  <div className="p-4 rounded-xl border border-sky-500/40 bg-sky-500/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-semibold">
                      <RotateCw className="w-4 h-4 shrink-0" />
                      <span>
                        Revision Slot · Mastered earlier in{' '}
                        {getShortTrackName(selectedEntryState.originTrack)}
                      </span>
                    </div>
                    {selectedEntryState.kind !== 'revised' ? (
                      <button
                        type="button"
                        disabled={Boolean(selectedEntry.versionAddendum) && !addendumRead}
                        onClick={() =>
                          onCompleteRevision(activeStudyTrack, selectedEntry.contentId)
                        }
                        className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-500 disabled:opacity-40"
                      >
                        {selectedEntry.versionAddendum && !addendumRead
                          ? 'Mark Addendum Read Below First'
                          : 'Mark Revision Complete (↻)'}
                      </button>
                    ) : (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ↻ Revision Completed
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lesson Preview · Overview Slot</span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white leading-tight">
                    {selectedEntry.code} {selectedEntry.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedEntry.summary}
                  </p>
                </div>

                {/* Separated Version Addendum if applicable */}
                {selectedEntry.versionAddendum && (
                  <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                        Version-Specific Addendum · Separate from Shared Notes
                      </span>
                      {isSharedMasteredElsewhere && (
                        <button
                          type="button"
                          onClick={() =>
                            onMarkAddendumRead(activeStudyTrack, selectedEntry.entryId)
                          }
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                            addendumRead
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 text-white hover:bg-amber-500'
                          }`}
                        >
                          {addendumRead ? 'Addendum Read' : 'Mark Addendum Read'}
                        </button>
                      )}
                    </div>
                    <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
                      {selectedEntry.versionAddendum.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                      {selectedEntry.versionAddendum.summary}
                    </p>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-1">
                      {selectedEntry.versionAddendum.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-100">Official Topic IDs: </strong>
                    {selectedEntry.officialTopicIds.join(', ')}
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-100">Prerequisites: </strong>
                    {selectedEntry.prerequisites.join(' · ')}
                  </div>
                  {selectedEntry.verifyFlag && (
                    <div className="text-amber-700 dark:text-amber-300">
                      <strong>Verification Note: </strong>
                      {selectedEntry.verifyFlag}
                    </div>
                  )}
                </div>

                {/* Quick Status Setter (keyed by contentId!) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Track Study Status (saved per shared contentId)
                  </span>
                  <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0B0F17]">
                    {(
                      [
                        { id: 'not-started', label: 'Not Started' },
                        { id: 'in-progress', label: 'In Progress' },
                        { id: 'mastered', label: 'Mastered' },
                      ] as const
                    ).map((opt) => {
                      const st = getContentStatus(progress, selectedEntry.contentId);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            onSetLessonStatus(selectedEntry.contentId, opt.id, activeStudyTrack)
                          }
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                            st === opt.id
                              ? opt.id === 'mastered'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Practice Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const fallbackId = DEFAULT_ENTRY_BY_TRACK[activeStudyTrack];
                      setSelectedEntryId(fallbackId);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      Open{' '}
                      {activeStudyTrack === 'it-support'
                        ? 'IT Support Model Lesson'
                        : 'CCNA Model Lesson (OSPFv2)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onAskPing(
                        `${selectedEntry.code} · ${selectedEntry.title}`,
                        `Entry: ${selectedEntry.entryId}\nContent ID: ${selectedEntry.contentId}\nSummary: ${selectedEntry.summary}`,
                        `Teach me "${selectedEntry.title}" step-by-step using your Predict → Verify → Explain loop.`,
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageSquare
                      className={`w-3.5 h-3.5 ${
                        activeStudyTrack === 'it-support' ? 'text-emerald-500' : 'text-sky-500'
                      }`}
                    />
                    <span>
                      {activeStudyTrack === 'it-support' ? 'Study with Patch' : 'Study with Ping'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onNavigateTab(activeStudyTrack === 'it-support' ? 'simulator' : 'labs')
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>
                      {activeStudyTrack === 'it-support'
                        ? 'Open Practice Ticket Workbench'
                        : 'Open IOS CLI Labs'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* End-of-page scroll sentinel for Sticky Bottom Next Bar */}
            <div ref={bottomSentinelRef} className="h-4 w-full" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* SUBVIEW 2: BLUEPRINT COVERAGE, SHARED MAP & MIGRATION AUDIT */}
      {subView === 'blueprint' && (
        <div className="space-y-10">
          {activeStudyTrack !== 'it-support' ? (
            <>
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  Cisco CCNA 200-301 ({activeStudyTrack === 'ccna-v1.1' ? 'v1.1' : 'v2.0'}) Blueprint
                  Coverage
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  {activeStudyTrack === 'ccna-v2.0'
                    ? 'Official CCNA v2.0 exam blueprint (from Feb 3, 2027) across 5 weighted domains, taught in prerequisite-first order.'
                    : 'Official CCNA v1.1 exam blueprint (through Feb 2, 2027) across 6 weighted domains, taught in prerequisite-first order.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domainSpecs.map((dom) => {
                  const mapped = trackEntries.filter((e) => e.domainId === dom.id);
                  const domDone = mapped.filter((e) => {
                    const k = getEntryProgressState(progress, activeStudyTrack, e).kind;
                    return k === 'new-mastered' || k === 'revised';
                  }).length;
                  const pct = mapped.length > 0 ? Math.round((domDone / mapped.length) * 100) : 0;

                  return (
                    <div
                      key={dom.id}
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 tabular-nums">
                            Domain {dom.number} · {dom.weightPct}% Exam Weight
                          </div>
                          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                            {dom.title}
                          </h2>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                          {domDone}/{mapped.length} ({pct}%)
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-sky-500 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {dom.summary}
                      </p>

                      {mapped.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {mapped.map((entry) => {
                            const st = getEntryProgressState(progress, activeStudyTrack, entry).kind;
                            return (
                              <button
                                key={entry.entryId}
                                type="button"
                                onClick={() => openEntryFromSearchOrBlueprint(entry)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:border-sky-500 text-slate-700 dark:text-slate-200 transition-colors"
                              >
                                {st === 'new-mastered' && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                )}
                                {st === 'revised' && (
                                  <RotateCw className="w-3 h-3 text-sky-500" />
                                )}
                                <span>
                                  {entry.officialTopicIds.join('/')}
                                  {entry.available ? ' (Model)' : ''}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Verified Shared Content Map Table */}
              <section className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <Layers className="w-4 h-4" />
                    <span>Single-Source Shared Content Map (v1.1 ↔ v2.0)</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                    Canonical Lesson Mapping Table ({SHARED_CONTENT_MAP.length} Entries)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                    Shared content is stored once by <code className="font-mono">contentId</code>.
                    Completing a shared lesson in either CCNA track flips the matching entry in the
                    other track into Revision Mode with separated version addenda.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#0B0F17] text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">contentId</th>
                        <th className="py-3 px-4 font-semibold">Canonical Topic</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">v1.1 IDs</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">v2.0 IDs</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Relation</th>
                        <th className="py-3 px-4 font-semibold">Version Boundary Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                      {SHARED_CONTENT_MAP.map((row) => (
                        <tr
                          key={row.contentId}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40"
                        >
                          <td className="py-2.5 px-4 font-mono text-[11px] text-sky-600 dark:text-sky-400 whitespace-nowrap">
                            {row.contentId}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                            {row.canonicalTitle}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-amber-700 dark:text-amber-300 whitespace-nowrap">
                            {row.v11TopicIds}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-sky-700 dark:text-sky-300 whitespace-nowrap">
                            {row.v20TopicIds}
                          </td>
                          <td className="py-2.5 px-4 whitespace-nowrap font-semibold">
                            <span
                              className={
                                row.relation === 'shared'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : row.relation === 'v1.1-only'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-sky-600 dark:text-sky-400'
                              }
                            >
                              {row.relation}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                            {row.notes}
                            {row.verifyFlag && (
                              <span className="block mt-0.5 text-amber-600 dark:text-amber-400 font-medium">
                                Verify flag: {row.verifyFlag}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* What Changed in v2.0 Panel */}
              <section className="p-6 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <Layers className="w-4 h-4" />
                  <span>What Changed Between CCNA v1.1 &amp; v2.0</span>
                </div>
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  {WHAT_CHANGED_V20_NOTES.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WHAT_CHANGED_V20_NOTES.highlights.map((item) => (
                    <div
                      key={item.area}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-1"
                    >
                      <div className="text-xs font-bold text-slate-950 dark:text-white">
                        {item.area}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  IT Help Desk &amp; Systems Support · Reordered U0–U11 Tree
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  Ticketing and ticket notes now appear right after Unit 0 in generic, vendor-neutral
                  form (U1), before hardware, OS, networking, AD, M365, and security—with the full
                  platform tours (JSM from zero, ServiceNow, Zendesk, Freshservice, ManageEngine,
                  osTicket/GLPI) unified in U9.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {units.map((unit) => {
                  const uLessons = unit.topics.flatMap((t) => t.lessons);
                  const uDone = uLessons.filter(
                    (l) => getContentStatus(progress, l.contentId) === 'mastered',
                  ).length;
                  const pct = uLessons.length > 0 ? Math.round((uDone / uLessons.length) * 100) : 0;

                  return (
                    <div
                      key={unit.id}
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs tabular-nums">
                          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {unit.number}
                          </span>
                          <span className="font-mono text-slate-500 dark:text-slate-400">
                            {uDone}/{uLessons.length} mastered
                          </span>
                        </div>
                        <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
                          {unit.title}
                        </h2>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {unit.description}
                        </p>
                      </div>

                      {uLessons[0] && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => openEntryFromSearchOrBlueprint(uLessons[0])}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            <span>
                              Open {uLessons[0].available ? 'Model Lesson' : 'Unit Slot'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Existing Lesson Migration Audit List */}
          {EXISTING_LESSON_MIGRATION_AUDIT.length > 0 && (
            <section className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Migration Audit · Existing Content Queued for Next Pass</span>
              </div>
              <div className="space-y-3">
                {EXISTING_LESSON_MIGRATION_AUDIT.map((item) => (
                  <div
                    key={item.file}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-1.5 text-xs"
                  >
                    <div className="font-mono font-bold text-slate-950 dark:text-white">
                      {item.lessonId} ·{' '}
                      <span className="text-sky-600 dark:text-sky-400">{item.file}</span>
                    </div>
                    <p className="text-rose-700 dark:text-rose-300">
                      <strong>Reorder Issue: </strong>
                      {item.issue}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Planned Fix: </strong>
                      {item.requiredAction}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* SUBVIEW 3: SEARCH & GLOSSARY */}
      {subView === 'search' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Search Tracks &amp; Technical Glossary
            </h1>
            <div className="relative max-w-2xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search v1.1, v2.0, IT Support, OSPF, ServiceNow, JSM, VLANs..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101622] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Matching Track Lessons */}
            <section className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                Track Entries ({filteredSearchEntries.length})
              </div>
              <div className="space-y-2.5">
                {filteredSearchEntries.map((entry) => (
                  <div
                    key={entry.entryId}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-mono text-sky-600 dark:text-sky-400">
                        {getShortTrackName(entry.trackId)} · {entry.entryId} (
                        {entry.officialTopicIds.join(', ')})
                        {entry.available ? ' · Ready' : ''}
                      </div>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {entry.readMinutes}m
                      </span>
                    </div>
                    <h2 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                      {entry.code} {entry.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {entry.summary}
                    </p>
                    <button
                      type="button"
                      onClick={() => openEntryFromSearchOrBlueprint(entry)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <span>Open in {getShortTrackName(entry.trackId)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Matching Glossary Terms */}
            <section className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                Technical Glossary ({filteredGlossary.length})
              </div>
              <div className="space-y-2.5">
                {filteredGlossary.map((entry) => (
                  <div
                    key={entry.term}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                        {entry.term}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {entry.moduleId === 'ccna'
                          ? 'CCNA'
                          : entry.moduleId === 'it-support'
                            ? 'IT Support'
                            : 'Shared'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-sky-700 dark:text-sky-300">
                      {entry.shortDef}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {entry.fullDef}
                    </p>
                    {entry.lessonId && (
                      <button
                        type="button"
                        onClick={() => {
                          const hit = allSearchEntries.find(
                            (s) => s.contentId === entry.lessonId || s.entryId === entry.lessonId,
                          );
                          if (hit) openEntryFromSearchOrBlueprint(hit);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline pt-1"
                      >
                        <span>Jump to Source Lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM "NEXT" BAR */}
      {selectedEntry && (
        <BottomNextBar
          visible={subView === 'lessons' && (scrolledToEnd || checkAttempted)}
          currentEntry={selectedEntry}
          boundaryKind={boundaryKind}
          nextEntry={nextEntry}
          nextIsRevision={nextIsRevision}
          nextUnitTitle={nextEntry?.unitTitle}
          topicCompleted={topicCompleted}
          checkAttempted={checkAttempted}
          checkScorePct={checkScorePct}
          onContinue={() => {
            if (!nextEntry) return;
            setSelectedEntryId(nextEntry.entryId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReviewTopic={() => {
            if (currentTopicEntries[0]) {
              setSelectedEntryId(currentTopicEntries[0].entryId);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRetryCheck={() => {
            const checkEl = document.getElementById('check-your-understanding');
            if (checkEl) {
              checkEl.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onTakeUnitTest={() => {
            setSubView('blueprint');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onTakeMockExam={() => onOpenTrackExam(activeStudyTrack)}
        />
      )}
    </div>
  );
}
