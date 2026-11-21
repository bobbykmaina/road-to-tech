import { useCallback, useEffect, useState } from 'react';
import {
  LearningTrackId,
  LocalProgressState,
  QuizAttemptRecord,
  SkillLevelId,
  SrsReviewRecord,
  SubnetDrillMode,
  SubnetModeStat,
} from '../types/ccna';

const STORAGE_KEY = 'road_to_ccna_state_v2';

const DEFAULT_SUBNET_STATS: Record<SubnetDrillMode, SubnetModeStat> = {
  'network-broadcast': { attempts: 0, solved: 0, totalMs: 0 },
  'host-range': { attempts: 0, solved: 0, totalMs: 0 },
  wildcard: { attempts: 0, solved: 0, totalMs: 0 },
  vlsm: { attempts: 0, solved: 0, totalMs: 0 },
  ipv6: { attempts: 0, solved: 0, totalMs: 0 },
};

const DEFAULT_STATE: LocalProgressState = {
  theme: 'dark',
  activeTrack: null,
  selectedLevel: null,
  completedLessons: [],
  completedLabs: [],
  lessonNotes: {},
  subtopicChecks: {},
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
  const modes: SubnetDrillMode[] = ['network-broadcast', 'host-range', 'wildcard', 'vlsm', 'ipv6'];
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

  // Needs spaced-repetition reinforcement soon (due immediately / same day)
  return {
    ease: Math.max(1.3, Number((prevEase - 0.25).toFixed(2))),
    intervalDays: 0,
    nextReviewAt: now.toISOString(),
    lastScore: score,
    total,
    lastReviewedAt: now.toISOString(),
  };
}

function readInitialState(): LocalProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<LocalProgressState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      activeTrack:
        parsed.activeTrack === 'ccna' || parsed.activeTrack === 'it-support'
          ? parsed.activeTrack
          : null,
      selectedLevel: parsed.selectedLevel ?? null,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedLabs: Array.isArray(parsed.completedLabs) ? parsed.completedLabs : [],
      lessonNotes:
        parsed.lessonNotes && typeof parsed.lessonNotes === 'object' ? parsed.lessonNotes : {},
      subtopicChecks:
        parsed.subtopicChecks && typeof parsed.subtopicChecks === 'object'
          ? parsed.subtopicChecks
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
  } catch {
    return DEFAULT_STATE;
  }
}

export function useLocalProgress() {
  const [state, setState] = useState<LocalProgressState>(() => readInitialState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors gracefully
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

  const selectTrackAndLevel = useCallback(
    (track: LearningTrackId, level: SkillLevelId) => {
      setState((prev) => ({
        ...prev,
        activeTrack: track,
        selectedLevel: level,
      }));
    },
    [],
  );

  const selectTrack = useCallback((track: LearningTrackId | null) => {
    setState((prev) => ({
      ...prev,
      activeTrack: track,
      selectedLevel: track ? prev.selectedLevel ?? 'beginner' : prev.selectedLevel,
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
      };
    });
  }, []);

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
      if (!parsed || typeof parsed !== 'object') return false;
      setState({
        ...DEFAULT_STATE,
        ...parsed,
        theme: parsed.theme === 'light' ? 'light' : 'dark',
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
        completedLabs: Array.isArray(parsed.completedLabs) ? parsed.completedLabs : [],
        lessonNotes:
          parsed.lessonNotes && typeof parsed.lessonNotes === 'object' ? parsed.lessonNotes : {},
        subtopicChecks:
          parsed.subtopicChecks && typeof parsed.subtopicChecks === 'object'
            ? parsed.subtopicChecks
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
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      theme: prev.theme,
    }));
  }, []);

  return {
    progress: state,
    toggleTheme,
    selectTrackAndLevel,
    selectTrack,
    toggleLessonComplete,
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
