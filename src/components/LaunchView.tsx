import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cpu,
  Network,
  RotateCw,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getAllEntriesForStudyTrack,
  getUnitsForStudyTrack,
} from '../content/curriculumCatalog';
import { CCNA_TOPICS } from '../data/ccnaPath';
import { IT_SUPPORT_TOPICS } from '../data/itSupportPath';
import { LearningTrackId, LocalProgressState, SkillLevelId } from '../types/ccna';
import { ActiveStudyTrackId, TrackLessonEntry } from '../types/curriculum';

interface LaunchViewProps {
  progress: LocalProgressState;
  chosenTrack: LearningTrackId | null;
  onSelectTrack: (track: LearningTrackId | null) => void;
  onStartTrack: (
    track: LearningTrackId,
    level: SkillLevelId,
    studyTrack: ActiveStudyTrackId,
    startEntryId: string,
  ) => void;
  onJumpToLesson: (
    track: LearningTrackId,
    studyTrack: ActiveStudyTrackId,
    entryId: string,
  ) => void;
  onResumePrevious: (studyTrack: ActiveStudyTrackId) => void;
}

const LEVEL_START_ENTRY: Record<ActiveStudyTrackId, Record<SkillLevelId, string>> = {
  'ccna-v2.0': {
    beginner: 'v20.0.1.1',
    intermediate: 'v20.2.0.1',
    advanced: 'v20.3.1.1',
    expert: 'v20.5.3.1',
    refresh: 'v20.3.3.2',
  },
  'ccna-v1.1': {
    beginner: 'v11.0.1.1',
    intermediate: 'v11.2.1.1',
    advanced: 'v11.3.1.1',
    expert: 'v11.6.1.1',
    refresh: 'v11.3.4.2',
  },
  'it-support': {
    beginner: 'itsup.0.1.1',
    intermediate: 'itsup.2.1.1',
    advanced: 'itsup.4.1.1',
    expert: 'itsup.8.1.1',
    refresh: 'itsup.11.1.1',
  },
};

const LEVEL_CARDS: {
  id: SkillLevelId;
  title: string;
  subtitle: string;
  startLabel: Record<ActiveStudyTrackId, string>;
}[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle:
      'No prior experience required. Starts from Unit 0 foundations regardless of prior progress.',
    startLabel: {
      'ccna-v2.0': 'Starts at Unit 0: Foundations (What a Network Is & IOS CLI)',
      'ccna-v1.1': 'Starts at Unit 0: Foundations (What a Network Is & IOS CLI)',
      'it-support': 'Starts at Unit 0: What IT Support Is & Service Desk Triage',
    },
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle:
      'Know the basics and ready for VLANs, trunking, Rapid PVST+, or Hardware & Boot triage.',
    startLabel: {
      'ccna-v2.0': 'Starts at Unit 2: Switching, VLANs & Rapid PVST+',
      'ccna-v1.1': 'Starts at Unit 2: Switching, VLANs & Rapid PVST+',
      'it-support': 'Starts at Unit 2: Hardware, Docking & Boot Triage',
    },
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle:
      'Comfortable with fundamentals; jump straight into Routing/OSPF or Endpoint Networking & DNS.',
    startLabel: {
      'ccna-v2.0': 'Starts at Unit 3: IP Routing, OSPFv2/v3 & HSRP/VRRP',
      'ccna-v1.1': 'Starts at Unit 3: IP Routing, Static Routes & OSPFv2',
      'it-support': 'Starts at Unit 4: Endpoint Networking, DNS, DHCP & VPNs',
    },
  },
  {
    id: 'expert',
    title: 'Expert',
    subtitle:
      'Ready for Agentic AI operations, Ansible/REST automation, or Tier 2 remote troubleshooting.',
    startLabel: {
      'ccna-v2.0': 'Starts at Unit 5: AI Operations, NetOps & Ansible',
      'ccna-v1.1': 'Starts at Unit 6: Automation, REST APIs & JSON',
      'it-support': 'Starts at Unit 8: Remote Troubleshooting & Tier 2 Escalation',
    },
  },
  {
    id: 'refresh',
    title: 'Refresh Yourself',
    subtitle:
      'Jump straight to the built Model Lesson or Interview Review hub for rapid knowledge checks.',
    startLabel: {
      'ccna-v2.0': 'Opens Unit 3: OSPFv2 Model Lesson & Rapid Review',
      'ccna-v1.1': 'Opens Unit 3: OSPFv2 Model Lesson & Rapid Review',
      'it-support': 'Opens Unit 11: Interview Readiness & Mock Review',
    },
  },
];

function formatStudyTrackName(trackId: ActiveStudyTrackId): string {
  if (trackId === 'ccna-v1.1') return 'CCNA v1.1 (through Feb 2, 2027)';
  if (trackId === 'ccna-v2.0') return 'CCNA v2.0 (from Feb 3, 2027)';
  return 'IT Help Desk & Systems Support';
}

export function LaunchView({
  progress,
  chosenTrack,
  onSelectTrack,
  onStartTrack,
  onJumpToLesson,
  onResumePrevious,
}: LaunchViewProps) {
  const [selectedCcnaStudyTrack, setSelectedCcnaStudyTrack] = useState<
    'ccna-v2.0' | 'ccna-v1.1'
  >(() => (progress.ccnaVersion === 'v1.1' ? 'ccna-v1.1' : 'ccna-v2.0'));

  const [jumpDrawerOpen, setJumpDrawerOpen] = useState(false);
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const targetStudyTrack: ActiveStudyTrackId =
    chosenTrack === 'it-support' ? 'it-support' : selectedCcnaStudyTrack;

  const trackUnits = useMemo(
    () => getUnitsForStudyTrack(targetStudyTrack),
    [targetStudyTrack],
  );

  const trackTopics = useMemo(
    () =>
      trackUnits.flatMap((u) =>
        u.topics.map((t) => ({
          ...t,
          unitNumber: u.number,
          unitTitle: u.title,
        })),
      ),
    [trackUnits],
  );

  const activeHoveredTopic = useMemo(
    () => trackTopics.find((t) => t.id === hoveredTopicId) ?? trackTopics[0] ?? null,
    [trackTopics, hoveredTopicId],
  );

  // Close drawer cleanly when switching between CCNA / IT tracks or pressing Escape
  useEffect(() => {
    setJumpDrawerOpen(false);
    setHoveredTopicId(trackTopics[0]?.id ?? null);
  }, [chosenTrack, targetStudyTrack, trackTopics]);

  useEffect(() => {
    if (!jumpDrawerOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setJumpDrawerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [jumpDrawerOpen]);

  const cancelCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleCloseDrawer = () => {
    cancelCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setJumpDrawerOpen(false);
    }, 120);
  };

  const resumeStudyTrack: ActiveStudyTrackId | null =
    progress.activeStudyTrack ??
    (progress.activeTrack === 'it-support'
      ? 'it-support'
      : progress.activeTrack === 'ccna'
        ? progress.ccnaVersion === 'v1.1'
          ? 'ccna-v1.1'
          : 'ccna-v2.0'
        : null);

  const rememberedEntryId = resumeStudyTrack
    ? progress.lastLessonByTrack[resumeStudyTrack]
    : undefined;
  const rememberedEntry =
    resumeStudyTrack && rememberedEntryId
      ? getAllEntriesForStudyTrack(resumeStudyTrack).find((e) => e.entryId === rememberedEntryId)
      : undefined;

  const hasSavedProgress =
    resumeStudyTrack !== null &&
    (Boolean(rememberedEntry) ||
      progress.completedLessons.length > 0 ||
      progress.completedLabs.length > 0 ||
      Object.keys(progress.subtopicChecks).length > 0 ||
      Object.keys(progress.deepCheckResults).length > 0);

  // Saved position specifically for the currently chosen Page-2 track
  const trackRememberedId = progress.lastLessonByTrack[targetStudyTrack];
  const trackRememberedEntry: TrackLessonEntry | undefined = trackRememberedId
    ? getAllEntriesForStudyTrack(targetStudyTrack).find((e) => e.entryId === trackRememberedId)
    : undefined;

  // Page 2: Track & Comfort Level Selection
  if (chosenTrack !== null) {
    const isCcna = chosenTrack === 'ccna';

    return (
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => onSelectTrack(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tracks</span>
          </button>

          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-medium text-sky-600 dark:text-sky-400">
              {isCcna
                ? 'Module A · Cisco CCNA (200-301)'
                : 'Module B · IT Help Desk & Systems Support'}
            </div>
            <h1
              className="font-display font-bold tracking-tight text-slate-950 dark:text-white leading-[1.1]"
              style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)', textWrap: 'balance' }}
            >
              {isCcna
                ? 'Choose your CCNA exam version & comfort level.'
                : 'Choose where you are most comfortable starting.'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isCcna
                ? 'CCNA v1.1 and CCNA v2.0 are completely separate tracks with their own sidebars, teaching order, progress bars, and mock exams. Picking a level below always opens that exact unit.'
                : 'IT Support teaches vendor-neutral ticketing in Unit 1 right after Unit 0, followed by Hardware, OS, Networking, AD/Entra, M365, and all major platform tours in Unit 9.'}
            </p>
          </div>

          {/* Separate CCNA v2.0 vs v1.1 Track Picker */}
          {isCcna && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCcnaStudyTrack('ccna-v2.0')}
                className={`text-left p-5 rounded-xl border transition-colors space-y-1.5 ${
                  selectedCcnaStudyTrack === 'ccna-v2.0'
                    ? 'border-sky-500 bg-sky-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">
                  Track A2 · Exam from Feb 3, 2027
                </div>
                <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  CCNA v2.0 (200-301)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  5 domains (25/25/20/20/10%): client OS diagnostics, OSPFv3, HSRP/VRRP status,
                  SFTP/SCP, Storm Control/RA Guard, Ansible &amp; Agentic AI operations.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCcnaStudyTrack('ccna-v1.1')}
                className={`text-left p-5 rounded-xl border transition-colors space-y-1.5 ${
                  selectedCcnaStudyTrack === 'ccna-v1.1'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                  Track A1 · Exam through Feb 2, 2027
                </div>
                <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  CCNA v1.1 (200-301)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  6 domains (20/20/25/10/15/10%): WLC GUI/CAPWAP, TCP vs UDP, NTP, QoS PHB, SSH,
                  TFTP/FTP, Catalyst Center, REST APIs &amp; JSON.
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Continue / Quick Topic & Subtopic Hover Drawer Button right ABOVE Beginner */}
        <div
          className="relative inline-flex flex-col items-start max-w-full"
          onMouseEnter={cancelCloseTimer}
          onMouseLeave={scheduleCloseDrawer}
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-expanded={jumpDrawerOpen}
              onClick={() => setJumpDrawerOpen((open) => !open)}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-colors ${
                jumpDrawerOpen
                  ? 'border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300'
                  : 'border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20'
              }`}
            >
              <RotateCw className="w-4 h-4 shrink-0" />
              <span>
                {trackRememberedEntry
                  ? `Continue Where You Left Off (${trackRememberedEntry.code}) · Choose Topic & Subtopic`
                  : 'Continue Where You Left Off / Jump to Topic & Subtopic'}
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                  jumpDrawerOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Press to browse units &amp; hover any topic to open its subtopics (closes when cursor leaves)
            </span>
          </div>

          {jumpDrawerOpen && (
            <div className="pt-2 md:absolute md:left-0 md:top-full z-40 max-w-full">
              <div
                role="region"
                aria-label="Topic and Subtopic Quick Navigation Drawer"
                className="w-[min(92vw,780px)] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101622] shadow-2xl overflow-hidden"
              >
                {/* Top Resume Bar inside Drawer */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {formatStudyTrackName(targetStudyTrack)} · Hover a Topic to inspect Subtopics
                  </div>
                  {trackRememberedEntry && (
                    <button
                      type="button"
                      onClick={() => {
                        setJumpDrawerOpen(false);
                        onJumpToLesson(
                          chosenTrack,
                          targetStudyTrack,
                          trackRememberedEntry.entryId,
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>
                        Resume Last: {trackRememberedEntry.code} {trackRememberedEntry.title}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Two-column Hover Selector: Topics (Left) -> Subtopics (Right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                  {/* Left: Topics List (hover switches subtopics immediately) */}
                  <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
                    <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      1. Hover Unit / Topic ({trackTopics.length})
                    </div>
                    {trackTopics.map((topic) => {
                      const isHovered = activeHoveredTopic?.id === topic.id;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onMouseEnter={() => setHoveredTopicId(topic.id)}
                          onFocus={() => setHoveredTopicId(topic.id)}
                          onClick={() => {
                            const firstSub = topic.lessons[0];
                            if (firstSub) {
                              setJumpDrawerOpen(false);
                              onJumpToLesson(chosenTrack, targetStudyTrack, firstSub.entryId);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-2 text-xs transition-colors ${
                            isHovered
                              ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              {topic.unitNumber} · Topic {topic.number} ({topic.officialTopicIds.join(', ')})
                            </div>
                            <div className="truncate">{topic.title}</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Subtopics / Lessons for Hovered Topic */}
                  <div className="max-h-[340px] overflow-y-auto p-2 space-y-1 bg-slate-50/50 dark:bg-[#0B0F17]/50">
                    <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      2. Select Subtopic ({activeHoveredTopic?.lessons.length ?? 0})
                    </div>
                    {activeHoveredTopic?.lessons.map((lesson) => {
                      const isDone =
                        progress.lessonStatusById[lesson.contentId] === 'mastered' ||
                        progress.completedLessons.includes(lesson.contentId);
                      return (
                        <button
                          key={lesson.entryId}
                          type="button"
                          onClick={() => {
                            setJumpDrawerOpen(false);
                            onJumpToLesson(chosenTrack, targetStudyTrack, lesson.entryId);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-lg border border-transparent hover:border-sky-500/50 hover:bg-white dark:hover:bg-slate-800/90 transition-colors space-y-1 group"
                        >
                          <div className="flex items-start justify-between gap-2 text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                            <span>
                              {lesson.code} {lesson.title}
                            </span>
                            {isDone && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                            <span>{lesson.readMinutes}m</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={
                                lesson.available ? 'text-sky-600 dark:text-sky-400 font-medium' : ''
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
              </div>
            </div>
          )}
        </div>

        <section
          aria-label="Comfort level selection"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {LEVEL_CARDS.map((lvl) => {
            const startEntryId = LEVEL_START_ENTRY[targetStudyTrack][lvl.id];
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onStartTrack(chosenTrack, lvl.id, targetStudyTrack, startEntryId)}
                className="text-left p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-sky-500 dark:hover:border-sky-500 transition-colors duration-150 flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-slate-950 dark:text-white">
                      {lvl.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lvl.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-medium text-sky-600 dark:text-sky-400 leading-snug">
                  {lvl.startLabel[targetStudyTrack]}
                </div>
              </button>
            );
          })}
        </section>
      </div>
    );
  }

  // Page 1: Clean Two-Choice Landing Page + "Continue where you left off"
  return (
    <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <section className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Road to TECH</span>
          <span aria-hidden="true">·</span>
          <span>CCNA v1.1 &amp; v2.0 + IT Support</span>
          <span aria-hidden="true">·</span>
          <span>Offline-Capable PWA</span>
        </div>

        <h1
          className="font-display font-bold tracking-tight text-slate-950 dark:text-white leading-[1.08]"
          style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.25rem)', textWrap: 'balance' }}
        >
          Master Cisco CCNA 200-301—and grow across enterprise IT.
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Start with hands-on Cisco IOS CLI labs, timed VLSM &amp; IPv6 subnetting drills, and
          separate CCNA v1.1 / v2.0 revision-aware learning tracks—or train for real Service Desk
          support roles from vendor-neutral ticketing through Jira Service Management, ServiceNow,
          and Active Directory.
        </p>

        {hasSavedProgress && resumeStudyTrack && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onResumePrevious(resumeStudyTrack)}
              className="inline-flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-colors text-left"
            >
              <RotateCw className="w-4 h-4 shrink-0" />
              <span>
                Continue where you left off · {formatStudyTrackName(resumeStudyTrack)}
                {rememberedEntry ? ` · ${rememberedEntry.code} ${rememberedEntry.title}` : ''}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </section>

      <section aria-label="Track selection" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Track 1: CCNA */}
        <button
          type="button"
          onClick={() => onSelectTrack('ccna')}
          className="text-left p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-sky-500 dark:hover:border-sky-500 transition-colors duration-150 flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Module A · CCNA v1.1 &amp; v2.0 Separate Tracks</span>
              <Network className="w-4 h-4 text-sky-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Cisco CCNA (200-301)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pick v1.1 (through Feb 2, 2027) or v2.0 (from Feb 3, 2027) in prerequisite-first
              teaching order—with live IOS CLI labs, VLSM drills, and condensed Revision Mode
              between tracks.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
            <span>
              {CCNA_TOPICS.length} Blueprint Units · 6 IOS Labs · Separate v1.1 / v2.0 Exams
            </span>
            <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
              <span>Choose Version &amp; Level</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </button>

        {/* Track 2: IT Help Desk */}
        <button
          type="button"
          onClick={() => onSelectTrack('it-support')}
          className="text-left p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-sky-500 dark:hover:border-sky-500 transition-colors duration-150 flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Module B · Reordered U0–U11 Track</span>
              <Cpu className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              IT Help Desk &amp; Systems Support
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Starts with vendor-neutral ticketing in Unit 1, builds hardware, OS, networking,
              Active Directory, and M365 skills, then tours Jira Service Management, ServiceNow,
              Zendesk &amp; Freshservice in Unit 9.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
            <span>
              {IT_SUPPORT_TOPICS.length} Practice Topics · Service Desk Simulator · 170+ Exam Qs
            </span>
            <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
              <span>Choose Level</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </button>
      </section>
    </div>
  );
}
