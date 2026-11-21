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
import { ZeroCoachDrawer } from './components/ZeroCoachDrawer';
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
    selectTrackAndLevel,
    selectTrack,
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
    nonce: number;
  } | null>(null);

  const [coachOpen, setCoachOpen] = useState(false);
  const [coachContextLabel, setCoachContextLabel] = useState('Road to TECH · Study Coach');
  const [coachContextPayload, setCoachContextPayload] = useState(
    'Learner is on the Road to TECH launch page.',
  );
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);

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

  const openCoachWithContext = (label: string, payload: string, prompt?: string) => {
    setCoachContextLabel(label);
    setCoachContextPayload(payload);
    if (prompt) setQueuedPrompt(prompt);
    setCoachOpen(true);
  };

  const goToLaunchTracks = () => {
    navigateTo({ tab: 'launch', launchTrack: null });
  };

  const handleSelectLaunchTrack = (track: LearningTrackId | null) => {
    navigateTo({ tab: 'launch', launchTrack: track });
  };

  const handleStartTrack = (track: LearningTrackId, level: SkillLevelId) => {
    selectTrackAndLevel(track, level);
    setJumpTarget(null);
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
    setPreferredExamTrack({ track, nonce: Date.now() });
    navigateTo({ tab: 'exam', launchTrack: null });
  };

  const handleAskZeroLab = (
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
      `Look at my current ${lab.number} progress on ${dev?.hostname ?? activeDeviceId}. Give me a Tier 1 Socratic nudge on what to check next.`,
    );
  };

  const handleAskZeroSubnet = (contextText: string) => {
    openCoachWithContext(
      'Subnetting & VLSM Drill',
      contextText,
      'Give me a Tier 1 Socratic nudge on this subnetting problem.',
    );
  };

  const handleAskZeroExam = (q: ExamQuestion, selectedIndices: number[]) => {
    const chosenText =
      q.questionType === 'drag-drop'
        ? 'Drag-and-drop matching review'
        : selectedIndices.length > 0
          ? selectedIndices.map((i) => q.options[i]).join('; ')
          : 'No option selected';
    const trackLabel =
      q.trackId === 'it-support' ? 'IT Help Desk & Systems Support' : 'Cisco CCNA 200-301';
    openCoachWithContext(
      `${trackLabel} Exam Review · ${q.topic}`,
      `Track: ${trackLabel}\nQuestion: ${q.prompt}\n${q.exhibit ? `Exhibit:\n${q.exhibit}\n` : ''}Learner selected: ${chosenText}\nCorrect answer rationale: ${q.explanation}`,
      'Give me a nudge on why the right answer works and why any wrong choice fails.',
    );
  };

  const handleAskZeroSimTicket = (scenario: ServiceDeskScenario, notes: string) => {
    openCoachWithContext(
      `${scenario.ticketNumber} · ${scenario.category}`,
      `Ticket: ${scenario.ticketNumber} (${scenario.priority}, ${scenario.skillLevel}, ${scenario.deskTier})\nSubject: ${scenario.subject}\nRequester: ${scenario.requesterName} (${scenario.requesterRole})\nHost: ${scenario.deviceHostname}\nInitial User Message: ${scenario.initialMessage}\nCurrent Investigation Notes: ${notes}`,
      `Give me a practical Tier 1 Socratic nudge on what to verify or check next for ${scenario.ticketNumber} without giving away the final answer right away.`,
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
            navigateTo({ tab, launchTrack: null });
          }
        }}
        onOpenCoach={() => {
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
            onResumePrevious={() => navigateTo({ tab: 'curriculum', launchTrack: null })}
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
                navigateTo({ tab, launchTrack: null });
              }
            }}
            onSelectTrack={(track) => selectTrack(track)}
            onOpenTrackExam={handleOpenTrackExam}
            onJumpToTopic={handleJumpToTopic}
            onOpenCoach={(prompt) =>
              openCoachWithContext(
                'Study Strategy · CCNA & IT Support',
                `Track: ${progress.activeTrack ?? 'unselected'}, Level: ${progress.selectedLevel ?? 'unselected'}, Subtopics checked: ${Object.keys(progress.subtopicChecks).length}, Completed labs: ${progress.completedLabs.length}`,
                prompt,
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
            onSelectTrack={(track) => selectTrack(track)}
            onSaveSubtopicCheck={saveSubtopicCheck}
            onSaveTopicExam={saveTopicExam}
            onSaveNote={saveLessonNote}
            onSwitchTrackOrLevel={goToLaunchTracks}
            onAskZero={(label, payload, prompt) => openCoachWithContext(label, payload, prompt)}
          />
        )}

        {activeTab === 'labs' && (
          <LabsView
            progress={progress}
            onBack={handleBack}
            onMarkLabCompleted={markLabCompleted}
            onAskZeroLab={handleAskZeroLab}
          />
        )}

        {activeTab === 'subnetting' && (
          <SubnettingView
            progress={progress}
            onBack={handleBack}
            onRecordResult={recordSubnetResult}
            onAskZeroSubnet={handleAskZeroSubnet}
          />
        )}

        {activeTab === 'simulator' && (
          <ServiceDeskSimulatorView
            progress={progress}
            onBack={handleBack}
            onRecordTicket={recordSimTicketResult}
            onAskZeroTicket={handleAskZeroSimTicket}
          />
        )}

        {activeTab === 'exam' && (
          <ExamView
            progress={progress}
            preferredTrack={preferredExamTrack}
            onBack={handleBack}
            onRecordAttempt={recordExamResult}
            onAskZeroExam={handleAskZeroExam}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Local-First CCNA 200-301 &amp; IT Support Workbench</span>
          <span>Progress stored locally in your browser · Export JSON anytime</span>
        </div>
      </footer>

      <ZeroCoachDrawer
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        contextLabel={coachContextLabel}
        contextPayload={coachContextPayload}
        queuedPrompt={queuedPrompt}
        onConsumeQueuedPrompt={() => setQueuedPrompt(null)}
      />
    </div>
  );
}
