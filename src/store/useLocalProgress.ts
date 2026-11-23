import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LearningTrackId,
  LocalProgressState,
  QuizAttemptRecord,
  SkillLevelId,
  SrsReviewRecord,
  SubnetDrillMode,
  SubnetModeStat,
} from '../types/ccna';
import {
  ActiveStudyTrackId,
  CcnaVersionId,
  LessonProgressStatus,
} from '../types/curriculum';
import { loadProgressFromIdb, saveProgressToIdb } from './idbStorage';

const STORAGE_KEY = 'road_to_ccna_state_v2';

const DEFAULT_SUBNET_STATS: Record<SubnetDrillMode, SubnetModeStat> = {
  'binary-hex': { attempts: 0, solved: 0, totalMs: 0 },
  'network-broadcast': { attempts: 0, solved: 0, totalMs: 0 },
  'host-range': { attempts: 0, solved: 0, totalMs: 0 },
  wildcard: { attempts: 0, solved: 0, totalMs: 0 },
  vlsm: { attempts: 0, solved: 0, totalMs: 0 },
  'triage-mask': { attempts: 0, solved: 0, totalMs: 0 },
  summarize: { attempts: 0, solved: 0, totalMs: 0 },
  ipv6: { attempts: 0, solved: 0, totalMs: 0 },
};

const DEFAULT_STATE: LocalProgressState = {
  theme: 'dark',
  activeTrack: null,
  activeStudyTrack: null,
  selectedLevel: null,
  ccnaVersion: 'v2.0',
  completedLessons: [],
  completedInTrack: {},
  revisionCompletedByTrack: {},
  addendumReadByTrack: {},
  lastLessonByTrack: {},
  completedLabs: [],
  lessonStatusById: {},
  bookmarkedLessons: [],
  comfortableReadingMode: false,
  lessonNotes: {},
  subtopicChecks: {},
  deepCheckResults: {},
  revisionCheckResults: {},
  topicExams: {},
  subtopicSrs: {},
  subnetSolved: 0,
  subnetAttempts: 0,
  subnetStreak: 0,
  subnetBestStreak: 0,
  subnetStatsByMode: DEFAULT_SUBNET_STATS,
  examHistory: [],
  answeredQuestions: {},
  completedSimTickets: {},
};

function mergeSubnetStats(
  raw: Partial<Record<SubnetDrillMode, Partial<SubnetModeStat>>> | undefined,
): Record<SubnetDrillMode, SubnetModeStat> {
  const modes: SubnetDrillMode[] = [
    'binary-hex',
    'network-broadcast',
    'host-range',
    'wildcard',
    'vlsm',
    'triage-mask',
    'summarize',
    'ipv6',
  ];
  const result = { ...DEFAULT_SUBNET_STATS };
  if (!raw || typeof raw !== 'object') return result;
  for (const mode of modes) {
    const entry = raw[mode];
    result[mode] = {
      attempts: typeof entry?.attempts === 'number' ? entry.attempts : 0,
      solved: typeof entry?.solved === 'number' ? entry.solved : 0,
      totalMs: typeof entry?.totalMs === 'number' ? entry.totalMs : 0,
    };
  }
  return result;
}

function deriveStudyTrack(
  rawStudy: unknown,
  rawTrack: LearningTrackId | null,
  version: CcnaVersionId,
): ActiveStudyTrackId | null {
  if (rawStudy === 'ccna-v1.1' || rawStudy === 'ccna-v2.0' || rawStudy === 'it-support') {
    return rawStudy;
  }
  if (rawTrack === 'it-support') return 'it-support';
  if (rawTrack === 'ccna') return version === 'v1.1' ? 'ccna-v1.1' : 'ccna-v2.0';
  return null;
}

function normalizeState(parsed: Partial<LocalProgressState> | null | undefined): LocalProgressState {
  if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE;
  const activeTrack =
    parsed.activeTrack === 'ccna' || parsed.activeTrack === 'it-support'
      ? parsed.activeTrack
      : null;
  const ccnaVersion: CcnaVersionId = parsed.ccnaVersion === 'v1.1' ? 'v1.1' : 'v2.0';
  const activeStudyTrack = deriveStudyTrack(parsed.activeStudyTrack, activeTrack, ccnaVersion);

  return {
    ...DEFAULT_STATE,
    ...parsed,
    theme: parsed.theme === 'light' ? 'light' : 'dark',
    activeTrack,
    activeStudyTrack,
    selectedLevel: parsed.selectedLevel ?? null,
    ccnaVersion,
    completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
    completedInTrack:
      parsed.completedInTrack && typeof parsed.completedInTrack === 'object'
        ? parsed.completedInTrack
        : {},
    revisionCompletedByTrack:
      parsed.revisionCompletedByTrack && typeof parsed.revisionCompletedByTrack === 'object'
        ? parsed.revisionCompletedByTrack
        : {},
    addendumReadByTrack:
      parsed.addendumReadByTrack && typeof parsed.addendumReadByTrack === 'object'
        ? parsed.addendumReadByTrack
        : {},
    lastLessonByTrack:
      parsed.lastLessonByTrack && typeof parsed.lastLessonByTrack === 'object'
        ? parsed.lastLessonByTrack
        : {},
    completedLabs: Array.isArray(parsed.completedLabs) ? parsed.completedLabs : [],
    lessonStatusById:
      parsed.lessonStatusById && typeof parsed.lessonStatusById === 'object'
        ? parsed.lessonStatusById
        : {},
    bookmarkedLessons: Array.isArray(parsed.bookmarkedLessons) ? parsed.bookmarkedLessons : [],
    comfortableReadingMode: Boolean(parsed.comfortableReadingMode),
    lessonNotes:
      parsed.lessonNotes && typeof parsed.lessonNotes === 'object' ? parsed.lessonNotes : {},
    subtopicChecks:
      parsed.subtopicChecks && typeof parsed.subtopicChecks === 'object'
        ? parsed.subtopicChecks
        : {},
    deepCheckResults:
      parsed.deepCheckResults && typeof parsed.deepCheckResults === 'object'
        ? parsed.deepCheckResults
        : {},
    revisionCheckResults:
      parsed.revisionCheckResults && typeof parsed.revisionCheckResults === 'object'
        ? parsed.revisionCheckResults
        : {},
    topicExams:
      parsed.topicExams && typeof parsed.topicExams === 'object' ? parsed.topicExams : {},
    subtopicSrs:
      parsed.subtopicSrs && typeof parsed.subtopicSrs === 'object' ? parsed.subtopicSrs : {},
    subnetStatsByMode: mergeSubnetStats(parsed.subnetStatsByMode),
    examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : [],
    answeredQuestions:
      parsed.answeredQuestions && typeof parsed.answeredQuestions === 'object'
        ? parsed.answeredQuestions
        : {},
    completedSimTickets:
      parsed.completedSimTickets && typeof parsed.completedSimTickets === 'object'
        ? parsed.completedSimTickets
        : {},
  };
}

function computeNextSrs(
  prev: SrsReviewRecord | undefined,
  score: number,
  total: number,
): SrsReviewRecord {
  const now = new Date();
  const ratio = total > 0 ? score / total : 0;
  const prevEase = prev?.ease ?? 2.0;

  if (ratio >= 1) {
    const nextInterval =
      !prev || prev.intervalDays <= 0
        ? 3
        : Math.min(30, Math.max(2, Math.round(prev.intervalDays * prevEase)));
    const nextDate = new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000);
    return {
      ease: Math.min(2.6, Number((prevEase + 0.1).toFixed(2))),
      intervalDays: nextInterval,
      nextReviewAt: nextDate.toISOString(),
      lastScore: score,
      total,
      lastReviewedAt: now.toISOString(),
    };
  }

  return {
    ease: Math.max(1.3, Number((prevEase - 0.25).toFixed(2))),
    intervalDays: 0,
    nextReviewAt: now.toISOString(),
    lastScore: score,
    total,
    lastReviewedAt: now.toISOString(),
  };
}

function readInitialSync(): LocalProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return normalizeState(JSON.parse(raw) as Partial<LocalProgressState>);
  } catch {
    return DEFAULT_STATE;
  }
}

export function useLocalProgress() {
  const [state, setState] = useState<LocalProgressState>(() => readInitialSync());
  const idbHydratedRef = useRef(false);

  // Hydrate from IndexedDB on mount (preferring IndexedDB if present)
  useEffect(() => {
    let active = true;
    void loadProgressFromIdb<Partial<LocalProgressState>>().then((idbData) => {
      if (!active) return;
      idbHydratedRef.current = true;
      if (idbData && typeof idbData === 'object') {
        setState(normalizeState(idbData));
      } else {
        void saveProgressToIdb(state);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors gracefully
    }
    if (idbHydratedRef.current) {
      void saveProgressToIdb(state);
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const setStudyTrack = useCallback((studyTrack: ActiveStudyTrackId | null) => {
    setState((prev) => {
      if (!studyTrack) {
        return {
          ...prev,
          activeTrack: null,
          activeStudyTrack: null,
        };
      }
      const nextTrack: LearningTrackId = studyTrack === 'it-support' ? 'it-support' : 'ccna';
      const nextVersion: CcnaVersionId =
        studyTrack === 'ccna-v1.1'
          ? 'v1.1'
          : studyTrack === 'ccna-v2.0'
            ? 'v2.0'
            : prev.ccnaVersion;
      return {
        ...prev,
        activeTrack: nextTrack,
        activeStudyTrack: studyTrack,
        ccnaVersion: nextVersion,
        selectedLevel: prev.selectedLevel ?? 'beginner',
      };
    });
  }, []);

  const setCcnaVersion = useCallback((version: CcnaVersionId) => {
    setState((prev) => ({
      ...prev,
      ccnaVersion: version,
      activeStudyTrack:
        prev.activeTrack === 'it-support'
          ? prev.activeStudyTrack
          : version === 'v1.1'
            ? 'ccna-v1.1'
            : 'ccna-v2.0',
    }));
  }, []);

  const selectTrackAndLevel = useCallback(
    (track: LearningTrackId, level: SkillLevelId, explicitStudyTrack?: ActiveStudyTrackId) => {
      setState((prev) => {
        const resolvedStudy: ActiveStudyTrackId =
          explicitStudyTrack ??
          (track === 'it-support'
            ? 'it-support'
            : prev.ccnaVersion === 'v1.1'
              ? 'ccna-v1.1'
              : 'ccna-v2.0');
        return {
          ...prev,
          activeTrack: track,
          activeStudyTrack: resolvedStudy,
          ccnaVersion:
            resolvedStudy === 'ccna-v1.1'
              ? 'v1.1'
              : resolvedStudy === 'ccna-v2.0'
                ? 'v2.0'
                : prev.ccnaVersion,
          selectedLevel: level,
        };
      });
    },
    [],
  );

  const selectTrack = useCallback((track: LearningTrackId | null) => {
    setState((prev) => ({
      ...prev,
      activeTrack: track,
      activeStudyTrack:
        track === null
          ? null
          : track === 'it-support'
            ? 'it-support'
            : prev.ccnaVersion === 'v1.1'
              ? 'ccna-v1.1'
              : 'ccna-v2.0',
      selectedLevel: track ? prev.selectedLevel ?? 'beginner' : prev.selectedLevel,
    }));
  }, []);

  const setLastLessonForTrack = useCallback((trackId: ActiveStudyTrackId, entryId: string) => {
    setState((prev) => {
      if (prev.lastLessonByTrack[trackId] === entryId) return prev;
      return {
        ...prev,
        lastLessonByTrack: {
          ...prev.lastLessonByTrack,
          [trackId]: entryId,
        },
      };
    });
  }, []);

  const setLessonStatus = useCallback(
    (contentId: string, status: LessonProgressStatus, completedTrack?: ActiveStudyTrackId) => {
      setState((prev) => {
        const nextCompleted =
          status === 'mastered'
            ? prev.completedLessons.includes(contentId)
              ? prev.completedLessons
              : [...prev.completedLessons, contentId]
            : prev.completedLessons.filter((id) => id !== contentId);

        const nextCompletedInTrack = { ...prev.completedInTrack };
        if (status === 'mastered') {
          if (!nextCompletedInTrack[contentId] && completedTrack) {
            nextCompletedInTrack[contentId] = completedTrack;
          }
        } else {
          delete nextCompletedInTrack[contentId];
        }

        return {
          ...prev,
          completedLessons: nextCompleted,
          completedInTrack: nextCompletedInTrack,
          lessonStatusById: {
            ...prev.lessonStatusById,
            [contentId]: status,
          },
        };
      });
    },
    [],
  );

  const markAddendumRead = useCallback((trackId: ActiveStudyTrackId, entryId: string) => {
    setState((prev) => {
      const existing = prev.addendumReadByTrack[trackId] ?? [];
      if (existing.includes(entryId)) return prev;
      return {
        ...prev,
        addendumReadByTrack: {
          ...prev.addendumReadByTrack,
          [trackId]: [...existing, entryId],
        },
      };
    });
  }, []);

  const completeRevisionForTrack = useCallback(
    (trackId: ActiveStudyTrackId, contentId: string) => {
      setState((prev) => {
        const existing = prev.revisionCompletedByTrack[trackId] ?? [];
        if (existing.includes(contentId)) return prev;
        return {
          ...prev,
          revisionCompletedByTrack: {
            ...prev.revisionCompletedByTrack,
            [trackId]: [...existing, contentId],
          },
        };
      });
    },
    [],
  );

  const saveRevisionCheck = useCallback(
    (
      trackId: ActiveStudyTrackId,
      contentId: string,
      record: QuizAttemptRecord,
      markRevisionDone: boolean,
    ) => {
      setState((prev) => {
        const revKey = `${trackId}:${contentId}`;
        const prevList = prev.revisionCompletedByTrack[trackId] ?? [];
        const nextList =
          markRevisionDone && !prevList.includes(contentId)
            ? [...prevList, contentId]
            : prevList;
        return {
          ...prev,
          revisionCheckResults: {
            ...prev.revisionCheckResults,
            [revKey]: record,
          },
          revisionCompletedByTrack: {
            ...prev.revisionCompletedByTrack,
            [trackId]: nextList,
          },
          subtopicSrs: {
            ...prev.subtopicSrs,
            [contentId]: computeNextSrs(prev.subtopicSrs[contentId], record.score, record.total),
          },
        };
      });
    },
    [],
  );

  const toggleBookmarkLesson = useCallback((contentId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedLessons.includes(contentId);
      return {
        ...prev,
        bookmarkedLessons: exists
          ? prev.bookmarkedLessons.filter((id) => id !== contentId)
          : [...prev.bookmarkedLessons, contentId],
      };
    });
  }, []);

  const toggleComfortableReadingMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      comfortableReadingMode: !prev.comfortableReadingMode,
    }));
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    setState((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: exists
          ? prev.completedLessons.filter((id) => id !== lessonId)
          : [...prev.completedLessons, lessonId],
        lessonStatusById: {
          ...prev.lessonStatusById,
          [lessonId]: exists ? 'in-progress' : 'mastered',
        },
      };
    });
  }, []);

  const saveDeepLessonCheck = useCallback(
    (contentId: string, record: QuizAttemptRecord, trackId?: ActiveStudyTrackId) => {
      setState((prev) => {
        const passed = record.total > 0 && record.score / record.total >= 0.7;
        const nextCompletedInTrack = { ...prev.completedInTrack };
        if (passed && !nextCompletedInTrack[contentId] && trackId) {
          nextCompletedInTrack[contentId] = trackId;
        }
        return {
          ...prev,
          deepCheckResults: {
            ...prev.deepCheckResults,
            [contentId]: record,
          },
          subtopicSrs: {
            ...prev.subtopicSrs,
            [contentId]: computeNextSrs(prev.subtopicSrs[contentId], record.score, record.total),
          },
          lessonStatusById: {
            ...prev.lessonStatusById,
            [contentId]: passed ? 'mastered' : 'in-progress',
          },
          completedInTrack: nextCompletedInTrack,
          completedLessons:
            passed && !prev.completedLessons.includes(contentId)
              ? [...prev.completedLessons, contentId]
              : prev.completedLessons,
        };
      });
    },
    [],
  );

  const saveSubtopicCheck = useCallback((subtopicId: string, record: QuizAttemptRecord) => {
    setState((prev) => ({
      ...prev,
      subtopicChecks: {
        ...prev.subtopicChecks,
        [subtopicId]: record,
      },
      subtopicSrs: {
        ...prev.subtopicSrs,
        [subtopicId]: computeNextSrs(prev.subtopicSrs[subtopicId], record.score, record.total),
      },
      lessonStatusById: {
        ...prev.lessonStatusById,
        [subtopicId]: record.score >= record.total ? 'mastered' : 'in-progress',
      },
      completedLessons: prev.completedLessons.includes(subtopicId)
        ? prev.completedLessons
        : [...prev.completedLessons, subtopicId],
    }));
  }, []);

  const saveTopicExam = useCallback((topicId: string, record: QuizAttemptRecord) => {
    setState((prev) => ({
      ...prev,
      topicExams: {
        ...prev.topicExams,
        [topicId]: record,
      },
    }));
  }, []);

  const saveLessonNote = useCallback((lessonId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      lessonNotes: {
        ...prev.lessonNotes,
        [lessonId]: note,
      },
    }));
  }, []);

  const markLabCompleted = useCallback((labId: string) => {
    setState((prev) => {
      if (prev.completedLabs.includes(labId)) return prev;
      return {
        ...prev,
        completedLabs: [...prev.completedLabs, labId],
      };
    });
  }, []);

  const recordSubnetResult = useCallback(
    (mode: SubnetDrillMode, correct: boolean, elapsedMs: number) => {
      setState((prev) => {
        const nextStreak = correct ? prev.subnetStreak + 1 : 0;
        const prevMode = prev.subnetStatsByMode[mode] ?? { attempts: 0, solved: 0, totalMs: 0 };
        const clampedMs = Math.max(0, Math.min(elapsedMs, 300_000));
        return {
          ...prev,
          subnetAttempts: prev.subnetAttempts + 1,
          subnetSolved: prev.subnetSolved + (correct ? 1 : 0),
          subnetStreak: nextStreak,
          subnetBestStreak: Math.max(prev.subnetBestStreak, nextStreak),
          subnetStatsByMode: {
            ...prev.subnetStatsByMode,
            [mode]: {
              attempts: prevMode.attempts + 1,
              solved: prevMode.solved + (correct ? 1 : 0),
              totalMs: prevMode.totalMs + clampedMs,
            },
          },
        };
      });
    },
    [],
  );

  const recordExamResult = useCallback(
    (
      summary: {
        trackId?: LearningTrackId;
        mode: string;
        totalQuestions: number;
        correctCount: number;
        domainFilter: LocalProgressState['examHistory'][number]['domainFilter'];
      },
      questionOutcomes: Record<string, boolean>,
    ) => {
      setState((prev) => ({
        ...prev,
        examHistory: [
          {
            id: `exam_${Date.now()}`,
            dateIso: new Date().toISOString(),
            ...summary,
          },
          ...prev.examHistory,
        ].slice(0, 20),
        answeredQuestions: {
          ...prev.answeredQuestions,
          ...questionOutcomes,
        },
      }));
    },
    [],
  );

  const recordSimTicketResult = useCallback(
    (ticketId: string, score: number, maxScore: number) => {
      setState((prev) => {
        const existing = prev.completedSimTickets[ticketId];
        return {
          ...prev,
          completedSimTickets: {
            ...prev.completedSimTickets,
            [ticketId]: {
              score: Math.max(existing?.score ?? 0, score),
              maxScore,
              attempts: (existing?.attempts ?? 0) + 1,
              completedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [],
  );

  const exportBackupJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `road-to-tech-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importBackupJson = useCallback((jsonText: string): boolean => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<LocalProgressState>;
      const normalized = normalizeState(parsed);
      setState(normalized);
      void saveProgressToIdb(normalized);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setState((prev) => {
      const next = { ...DEFAULT_STATE, theme: prev.theme };
      void saveProgressToIdb(next);
      return next;
    });
  }, []);

  return {
    progress: state,
    toggleTheme,
    setStudyTrack,
    setCcnaVersion,
    selectTrackAndLevel,
    selectTrack,
    setLastLessonForTrack,
    setLessonStatus,
    markAddendumRead,
    completeRevisionForTrack,
    saveRevisionCheck,
    toggleBookmarkLesson,
    toggleComfortableReadingMode,
    toggleLessonComplete,
    saveDeepLessonCheck,
    saveSubtopicCheck,
    saveTopicExam,
    saveLessonNote,
    markLabCompleted,
    recordSubnetResult,
    recordExamResult,
    recordSimTicketResult,
    exportBackupJson,
    importBackupJson,
    resetProgress,
  };
}
