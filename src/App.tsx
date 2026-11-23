/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ExamView } from './components/ExamView';
import { GuidedCurriculumView } from './components/GuidedCurriculumView';
import { LabsView } from './components/LabsView';
import { LaunchView } from './components/LaunchView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OverviewView } from './components/OverviewView';
import { ServiceDeskSimulatorView } from './components/ServiceDeskSimulatorView';
import { SubnettingView } from './components/SubnettingView';
import { TopBar } from './components/TopBar';
import { PingCoachDrawer } from './components/PingCoachDrawer';
import { ServiceDeskScenario } from './data/serviceDeskScenarios';
import { useLocalProgress } from './store/useLocalProgress';
import {
  CcnaLab,
  ExamQuestion,
  LearningTrackId,
  SimDevice,
  SkillLevelId,
  WorkspaceTab,
} from './types/ccna';
import { ActiveStudyTrackId } from './types/curriculum';

interface NavHistoryState {
  tab: WorkspaceTab;
  launchTrack: LearningTrackId | null;
}

function buildHash(state: NavHistoryState): string {
  if (state.tab === 'launch') {
    return state.launchTrack ? `#launch/${state.launchTrack}` : '#launch';
  }
  return `#${state.tab}`;
}

function parseHash(): NavHistoryState {
  const h = window.location.hash.replace(/^#/, '');
  if (!h || h === 'launch') return { tab: 'launch', launchTrack: null };
  if (h === 'launch/ccna') return { tab: 'launch', launchTrack: 'ccna' };
  if (h === 'launch/it-support') return { tab: 'launch', launchTrack: 'it-support' };
  const validTabs: WorkspaceTab[] = [
    'overview',
    'curriculum',
    'labs',
    'subnetting',
    'simulator',
    'exam',
  ];
  if (validTabs.includes(h as WorkspaceTab)) {
    return { tab: h as WorkspaceTab, launchTrack: null };
  }
  return { tab: 'launch', launchTrack: null };
}

export default function App() {
  const {
    progress,
    toggleTheme,
    setStudyTrack,
    selectTrackAndLevel,
    selectTrack,
    setLastLessonForTrack,
    setLessonStatus,
    markAddendumRead,
    completeRevisionForTrack,
    saveRevisionCheck,
    toggleBookmarkLesson,
    toggleComfortableReadingMode,
    saveDeepLessonCheck,
    saveLessonNote,
    markLabCompleted,
    recordSubnetResult,
    recordExamResult,
    recordSimTicketResult,
    exportBackupJson,
    importBackupJson,
    resetProgress,
  } = useLocalProgress();

  const initialNav = parseHash();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialNav.tab);
  const [launchTrack, setLaunchTrack] = useState<LearningTrackId | null>(initialNav.launchTrack);
  const [jumpTarget, setJumpTarget] = useState<{
    topicId: string;
    subtopicId?: string;
    nonce: number;
  } | null>(null);
  const [preferredExamTrack, setPreferredExamTrack] = useState<{
    track: LearningTrackId;
    studyTrack?: ActiveStudyTrackId;
    nonce: number;
  } | null>(null);

  const [coachOpen, setCoachOpen] = useState(false);
  const [coachContextLabel, setCoachContextLabel] = useState('Road to TECH · Ping & Patch Coaching');
  const [coachContextPayload, setCoachContextPayload] = useState(
    'Learner is on the Road to TECH launch page.',
  );
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);
  const [coachPersonaOverride, setCoachPersonaOverride] = useState<'ping' | 'patch' | null>(null);

  const navRef = useRef<NavHistoryState>(initialNav);
  navRef.current = { tab: activeTab, launchTrack };
  const navStackRef = useRef<NavHistoryState[]>([initialNav]);

  useEffect(() => {
    window.history.replaceState(navRef.current, '', buildHash(navRef.current));

    const handlePopState = (e: PopStateEvent) => {
      const state = (e.state as NavHistoryState | null) ?? parseHash();
      setActiveTab(state.tab);
      setLaunchTrack(state.launchTrack ?? null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((next: NavHistoryState) => {
    const prev = navRef.current;
    if (prev.tab === next.tab && prev.launchTrack === next.launchTrack) {
      return;
    }
    navStackRef.current.push(next);
    setActiveTab(next.tab);
    setLaunchTrack(next.launchTrack);
    window.history.pushState(next, '', buildHash(next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    const stack = navStackRef.current;
    if (stack.length > 1) {
      stack.pop();
      const prev = stack[stack.length - 1];
      setActiveTab(prev.tab);
      setLaunchTrack(prev.launchTrack);
      window.history.replaceState(prev, '', buildHash(prev));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const homeState: NavHistoryState = { tab: 'launch', launchTrack: null };
    if (navRef.current.tab !== 'launch' || navRef.current.launchTrack !== null) {
      navStackRef.current = [homeState];
      setActiveTab('launch');
      setLaunchTrack(null);
      window.history.replaceState(homeState, '', buildHash(homeState));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const openCoachWithContext = (
    label: string,
    payload: string,
    prompt?: string,
    persona?: 'ping' | 'patch',
  ) => {
    setCoachContextLabel(label);
    setCoachContextPayload(payload);
    setCoachPersonaOverride(persona ?? null);
    if (prompt) setQueuedPrompt(prompt);
    setCoachOpen(true);
  };

  const goToLaunchTracks = () => {
    setJumpTarget(null);
    navigateTo({ tab: 'launch', launchTrack: null });
  };

  const handleSelectLaunchTrack = (track: LearningTrackId | null) => {
    setJumpTarget(null);
    navigateTo({ tab: 'launch', launchTrack: track });
  };

  const handleStartTrack = (
    track: LearningTrackId,
    level: SkillLevelId,
    studyTrack: ActiveStudyTrackId,
    startEntryId: string,
  ) => {
    selectTrackAndLevel(track, level, studyTrack);
    setLastLessonForTrack(studyTrack, startEntryId);
    setJumpTarget({
      topicId: startEntryId,
      subtopicId: startEntryId,
      nonce: Date.now(),
    });
    navigateTo({ tab: 'curriculum', launchTrack: null });
  };

  const handleJumpToEntry = (
    _track: LearningTrackId,
    studyTrack: ActiveStudyTrackId,
    entryId: string,
  ) => {
    setStudyTrack(studyTrack);
    setLastLessonForTrack(studyTrack, entryId);
    setJumpTarget({
      topicId: entryId,
      subtopicId: entryId,
      nonce: Date.now(),
    });
    navigateTo({ tab: 'curriculum', launchTrack: null });
  };

  const handleJumpToTopic = (
    topicId: string,
    subtopicId?: string,
    trackId?: LearningTrackId,
  ) => {
    const resolvedTrack: LearningTrackId =
      trackId ?? (topicId.startsWith('it-') ? 'it-support' : 'ccna');
    selectTrack(resolvedTrack);
    setJumpTarget({ topicId, subtopicId, nonce: Date.now() });
    navigateTo({ tab: 'curriculum', launchTrack: null });
  };

  const handleOpenTrackExam = (track: LearningTrackId) => {
    selectTrack(track);
    const derivedStudyTrack: ActiveStudyTrackId =
      track === 'it-support'
        ? 'it-support'
        : progress.ccnaVersion === 'v1.1'
          ? 'ccna-v1.1'
          : 'ccna-v2.0';
    setPreferredExamTrack({ track, studyTrack: derivedStudyTrack, nonce: Date.now() });
    navigateTo({ tab: 'exam', launchTrack: null });
  };

  const handleAskPingLab = (
    lab: CcnaLab,
    devices: Record<string, SimDevice>,
    activeDeviceId: string,
  ) => {
    const dev = devices[activeDeviceId];
    const objectiveSummary = lab.objectives
      .map((o) => `- [${o.check(devices) ? 'PASS' : 'PENDING'}] ${o.label}`)
      .join('\n');
    const ifSummary = dev
      ? Object.values(dev.interfaces)
          .map(
            (i) =>
              `${i.name}: ip=${i.ip ?? 'unset'} mask=${i.mask ?? '-'} adminUp=${i.adminUp} mode=${i.switchportMode ?? 'routed'} vlan=${i.accessVlan ?? '-'}`,
          )
          .join('\n')
      : '';
    openCoachWithContext(
      `${lab.number} · ${dev?.hostname ?? activeDeviceId}`,
      `Lab: ${lab.title}\nBrief: ${lab.brief}\nCurrent Objective Status:\n${objectiveSummary}\nActive Device (${dev?.hostname}) Interfaces:\n${ifSummary}`,
      `Look at my current ${lab.number} progress on ${dev?.hostname ?? activeDeviceId}. Use Step 1 (Predict): ask me what I expect to see before giving me a command.`,
    );
  };

  const handleAskPingSubnet = (contextText: string) => {
    openCoachWithContext(
      'Subnetting & VLSM Drill',
      contextText,
      'Give me a Step 1 (Predict) nudge on this subnetting problem without revealing the answer.',
    );
  };

  const handleAskPingExam = (q: ExamQuestion, selectedIndices: number[]) => {
    const chosenText =
      q.questionType === 'drag-drop'
        ? 'Drag-and-drop matching review'
        : selectedIndices.length > 0
          ? selectedIndices.map((i) => q.options[i]).join('; ')
          : 'No option selected';
    const trackLabel =
      q.trackId === 'it-support' ? 'IT Help Desk & Systems Support' : 'Cisco CCNA 200-301';
    const persona = q.trackId === 'it-support' ? 'patch' : 'ping';
    openCoachWithContext(
      `${trackLabel} Exam Review · ${q.topic}`,
      `Track: ${trackLabel}\nQuestion: ${q.prompt}\n${q.exhibit ? `Exhibit:\n${q.exhibit}\n` : ''}Learner selected: ${chosenText}\nCorrect answer rationale: ${q.explanation}`,
      'Walk me through why the right answer works and why each wrong option fails.',
      persona,
    );
  };

  const handleAskPingSimTicket = (scenario: ServiceDeskScenario, notes: string) => {
    openCoachWithContext(
      `${scenario.ticketNumber} · ${scenario.category}`,
      `Ticket: ${scenario.ticketNumber} (${scenario.priority}, ${scenario.skillLevel}, ${scenario.deskTier})\nSubject: ${scenario.subject}\nRequester: ${scenario.requesterName} (${scenario.requesterRole})\nHost: ${scenario.deviceHostname}\nInitial User Message: ${scenario.initialMessage}\nCurrent Investigation Notes: ${notes}`,
      `Use your Predict → Verify → Explain loop on ${scenario.ticketNumber}: help me decide what to verify next without spoiling the resolution.`,
      'patch',
    );
  };

  // TopBar shows IOS Labs & Subnetting for CCNA, and Simulator before Mock Exams for IT Support
  const activeNavTrack: LearningTrackId | null =
    activeTab === 'launch'
      ? launchTrack
      : activeTab === 'labs' || activeTab === 'subnetting'
        ? 'ccna'
        : activeTab === 'simulator'
          ? 'it-support'
          : progress.activeTrack;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100">
      <OfflineIndicator />
      <TopBar
        activeTab={activeTab}
        activeNavTrack={activeNavTrack}
        onSelectTab={(tab) => {
          if (tab === 'launch') {
            goToLaunchTracks();
          } else {
            if (tab === 'curriculum') setJumpTarget(null);
            navigateTo({ tab, launchTrack: null });
          }
        }}
        onOpenCoach={() => {
          setCoachPersonaOverride(null);
          if (!coachOpen) {
            setCoachContextLabel(`Workspace · ${activeTab.toUpperCase()}`);
          }
          setCoachOpen(true);
        }}
      />

      <main className="flex-1">
        {activeTab === 'launch' && (
          <LaunchView
            progress={progress}
            chosenTrack={launchTrack}
            onSelectTrack={handleSelectLaunchTrack}
            onStartTrack={handleStartTrack}
            onJumpToLesson={handleJumpToEntry}
            onResumePrevious={(studyTrack) => {
              setStudyTrack(studyTrack);
              setJumpTarget(null);
              navigateTo({ tab: 'curriculum', launchTrack: null });
            }}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewView
            progress={progress}
            onBack={handleBack}
            onNavigate={(tab) => {
              if (tab === 'launch') {
                goToLaunchTracks();
              } else {
                if (tab === 'curriculum') setJumpTarget(null);
                navigateTo({ tab, launchTrack: null });
              }
            }}
            onSelectTrack={(track) => selectTrack(track)}
            onOpenTrackExam={handleOpenTrackExam}
            onJumpToTopic={handleJumpToTopic}
            onOpenCoach={(prompt) =>
              openCoachWithContext(
                'Study Strategy · CCNA & IT Support',
                `Track: ${progress.activeTrack ?? 'unselected'}, Version: ${progress.ccnaVersion}, Level: ${progress.selectedLevel ?? 'unselected'}, Mastered lessons: ${progress.completedLessons.length}, Completed labs: ${progress.completedLabs.length}`,
                prompt,
                prompt?.includes('IT Help Desk') ? 'patch' : 'ping',
              )
            }
            onToggleTheme={toggleTheme}
            onExportBackup={exportBackupJson}
            onImportBackup={importBackupJson}
            onResetProgress={resetProgress}
          />
        )}

        {activeTab === 'curriculum' && (
          <GuidedCurriculumView
            progress={progress}
            jumpTarget={jumpTarget}
            onBack={handleBack}
            onSetStudyTrack={(t) => {
              setJumpTarget(null);
              setStudyTrack(t);
            }}
            onSetLastLesson={setLastLessonForTrack}
            onSetLessonStatus={setLessonStatus}
            onMarkAddendumRead={markAddendumRead}
            onCompleteRevision={completeRevisionForTrack}
            onSaveRevisionCheck={saveRevisionCheck}
            onToggleBookmark={toggleBookmarkLesson}
            onToggleReadingMode={toggleComfortableReadingMode}
            onSaveDeepCheck={saveDeepLessonCheck}
            onSaveNote={saveLessonNote}
            onNavigateTab={(tab) => navigateTo({ tab, launchTrack: null })}
            onOpenTrackExam={(studyTrack) => {
              setStudyTrack(studyTrack);
              setPreferredExamTrack({
                track: studyTrack === 'it-support' ? 'it-support' : 'ccna',
                studyTrack,
                nonce: Date.now(),
              });
              navigateTo({ tab: 'exam', launchTrack: null });
            }}
            onSwitchTrackOrLevel={goToLaunchTracks}
            onAskPing={(label, payload, prompt) =>
              openCoachWithContext(
                label,
                payload,
                prompt,
                activeNavTrack === 'it-support' ? 'patch' : 'ping',
              )
            }
          />
        )}

        {activeTab === 'labs' && (
          <LabsView
            progress={progress}
            onBack={handleBack}
            onMarkLabCompleted={markLabCompleted}
            onAskPingLab={handleAskPingLab}
          />
        )}

        {activeTab === 'subnetting' && (
          <SubnettingView
            progress={progress}
            onBack={handleBack}
            onRecordResult={recordSubnetResult}
            onAskPingSubnet={handleAskPingSubnet}
          />
        )}

        {activeTab === 'simulator' && (
          <ServiceDeskSimulatorView
            progress={progress}
            onBack={handleBack}
            onRecordTicket={recordSimTicketResult}
            onAskPingTicket={handleAskPingSimTicket}
          />
        )}

        {activeTab === 'exam' && (
          <ExamView
            progress={progress}
            preferredTrack={preferredExamTrack}
            onBack={handleBack}
            onRecordAttempt={recordExamResult}
            onAskPingExam={handleAskPingExam}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Road to TECH · Local-First CCNA 200-301 &amp; IT Support Workbench · Independent study
            tool. Not affiliated with or endorsed by Cisco.
          </span>
          <span>Progress saved locally in IndexedDB · Export JSON anytime</span>
        </div>
      </footer>

      <PingCoachDrawer
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        coachPersona={coachPersonaOverride ?? (activeNavTrack === 'it-support' ? 'patch' : 'ping')}
        contextLabel={coachContextLabel}
        contextPayload={coachContextPayload}
        queuedPrompt={queuedPrompt}
        onConsumeQueuedPrompt={() => setQueuedPrompt(null)}
      />
    </div>
  );
}
