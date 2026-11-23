import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  Download,
  Layers,
  Moon,
  Network,
  RefreshCw,
  RotateCcw,
  Sun,
  Upload,
} from 'lucide-react';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { CCNA_TOPICS } from '../data/ccnaPath';
import { IT_SUPPORT_TOPICS } from '../data/itSupportPath';
import { CCNA_LABS } from '../data/labs';
import { CCNA_EXAM_QUESTIONS, IT_SUPPORT_EXAM_QUESTIONS } from '../data/mockExam';
import { SERVICE_DESK_SCENARIOS } from '../data/serviceDeskScenarios';
import { LearningTrackId, LocalProgressState, WorkspaceTab } from '../types/ccna';
import {
  computeBlueprintReadiness,
  computeItSupportReadiness,
  getDueSpacedReviews,
} from '../utils/blueprintProgress';

interface OverviewViewProps {
  progress: LocalProgressState;
  onBack: () => void;
  onNavigate: (tab: WorkspaceTab) => void;
  onSelectTrack: (track: LearningTrackId) => void;
  onOpenTrackExam: (track: LearningTrackId) => void;
  onJumpToTopic: (topicId: string, subtopicId?: string, trackId?: LearningTrackId) => void;
  onOpenCoach: (prompt?: string) => void;
  onToggleTheme: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonText: string) => boolean;
  onResetProgress: () => void;
}

const HERO_IMAGE = '/src/assets/images/hero_rack_workbench_1795188046945.jpg';
const OSI_IMAGE = '/src/assets/images/diagram_osi_layers_1795188046206.jpg';

const OSI_LAYERS = [
  {
    layer: 7,
    name: 'Application',
    tcpIp: 'Application',
    pdu: 'Data',
    protocols: 'HTTP/S, SSH, DNS, DHCP, SNMP, NTP, REST',
    hardware: 'End hosts, L7 Firewalls',
    encap: 'Generates application payload & HTTP/REST or SSH message headers.',
  },
  {
    layer: 6,
    name: 'Presentation',
    tcpIp: 'Application',
    pdu: 'Data',
    protocols: 'TLS/SSL, JSON, XML, ASCII',
    hardware: 'End hosts',
    encap: 'Serializes data structures (JSON/YAML) and negotiates encryption.',
  },
  {
    layer: 5,
    name: 'Session',
    tcpIp: 'Application',
    pdu: 'Data',
    protocols: 'RPC, NetBIOS, SIP',
    hardware: 'End hosts',
    encap: 'Establishes, checkpoints, and tears down logical session dialogues.',
  },
  {
    layer: 4,
    name: 'Transport',
    tcpIp: 'Transport',
    pdu: 'Segment / Datagram',
    protocols: 'TCP (Ports, Windowing, Seq/ACK), UDP',
    hardware: 'Load balancers, Stateful Firewalls',
    encap: 'Prepends 20-byte TCP (or 8-byte UDP) header with Source & Destination Ports.',
  },
  {
    layer: 3,
    name: 'Network',
    tcpIp: 'Internet',
    pdu: 'Packet',
    protocols: 'IPv4, IPv6, ICMP, OSPF, HSRP, IPsec',
    hardware: 'Routers, Layer 3 Switches',
    encap: 'Prepends 20-byte IPv4 (or 40-byte IPv6) header with Src/Dst IP and TTL.',
  },
  {
    layer: 2,
    name: 'Data Link',
    tcpIp: 'Network Access',
    pdu: 'Frame',
    protocols: 'Ethernet (802.3), 802.1Q VLAN Tag, ARP, STP, CDP/LLDP',
    hardware: 'Switches, Bridges, Wireless APs',
    encap: 'Adds Dst/Src MAC addresses, optional 4-byte 802.1Q tag, and trailing 4-byte FCS.',
  },
  {
    layer: 1,
    name: 'Physical',
    tcpIp: 'Network Access',
    pdu: 'Bits',
    protocols: '1000BASE-T, 10GBASE-SR/LR, PoE (802.3af/at/bt)',
    hardware: 'Cat6A Copper, SMF/MMF Fiber, SFP+ Transceivers',
    encap: 'Encodes frame bits onto electrical voltage pulses or laser light wavelengths.',
  },
];

export function OverviewView({
  progress,
  onBack,
  onNavigate,
  onSelectTrack,
  onOpenTrackExam,
  onJumpToTopic,
  onOpenCoach,
  onToggleTheme,
  onExportBackup,
  onImportBackup,
  onResetProgress,
}: OverviewViewProps) {
  const [heroImgErr, setHeroImgErr] = useState(false);
  const [osiImgErr, setOsiImgErr] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(4);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeOsi = OSI_LAYERS.find((l) => l.layer === selectedLayer) ?? OSI_LAYERS[3];

  const { domains: ccnaDomains, weightedOverallPct: ccnaWeightedPct } = useMemo(
    () => computeBlueprintReadiness(progress),
    [progress],
  );

  const { domains: itDomains, overallPct: itOverallPct } = useMemo(
    () => computeItSupportReadiness(progress),
    [progress],
  );

  const dueReviews = useMemo(() => getDueSpacedReviews(progress, 'all'), [progress]);

  const ccnaSubtotals = useMemo(() => {
    const subs = CCNA_TOPICS.flatMap((t) => t.subtopics);
    return {
      total: subs.length,
      done: subs.filter((s) => Boolean(progress.subtopicChecks[s.id])).length,
    };
  }, [progress.subtopicChecks]);

  const itSubtotals = useMemo(() => {
    const subs = IT_SUPPORT_TOPICS.flatMap((t) => t.subtopics);
    const simSolved = SERVICE_DESK_SCENARIOS.filter(
      (s) => (progress.completedSimTickets[s.id]?.score ?? 0) >= 3,
    ).length;
    return {
      total: subs.length,
      done: subs.filter((s) => Boolean(progress.subtopicChecks[s.id])).length,
      examsDone: IT_SUPPORT_TOPICS.filter((t) => Boolean(progress.topicExams[t.id])).length,
      simSolved,
    };
  }, [progress.subtopicChecks, progress.topicExams, progress.completedSimTickets]);

  const subnetAccuracy =
    progress.subnetAttempts > 0
      ? `${Math.round((progress.subnetSolved / progress.subnetAttempts) * 100)}%`
      : '—';

  const bestExamScore =
    progress.examHistory.length > 0
      ? `${Math.max(
          ...progress.examHistory.map((e) =>
            Math.round((e.correctCount / Math.max(1, e.totalQuestions)) * 100),
          ),
        )}%`
      : '—';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImportBackup(String(reader.result ?? ''));
      setImportNotice(
        ok ? 'Progress backup imported cleanly.' : 'Invalid backup JSON file.',
      );
      setTimeout(() => setImportNotice(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
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

      {/* Whole-App Split Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Cisco CCNA 200-301 ({ccnaWeightedPct}% Ready)</span>
            <span aria-hidden="true">·</span>
            <span>IT Help Desk &amp; Systems Support ({itOverallPct}% Ready)</span>
            <span aria-hidden="true">·</span>
            <span>
              {CCNA_EXAM_QUESTIONS.length + IT_SUPPORT_EXAM_QUESTIONS.length} Mock Questions
            </span>
          </div>

          <h1
            className="font-display font-bold tracking-tight text-slate-950 dark:text-white leading-[1.08] max-w-2xl"
            style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.35rem)', textWrap: 'balance' }}
          >
            Complete CCNA &amp; IT Systems Support workbench, locally.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            Study topic-by-topic across both Cisco CCNA 200-301 and IT Help Desk operations—each
            with guided knowledge checks, end-of-topic exams, 120+–170+ Easy-to-Hard mock exam banks,
            plus interactive Cisco IOS CLI labs and VLSM/IPv6 subnetting when studying CCNA.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('curriculum')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <span>Open Learn Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('exam')}
              className="px-4 py-3 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              Open Mock Exams
            </button>

            <button
              type="button"
              onClick={() => onNavigate('launch')}
              className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap shrink-0"
            >
              Switch Track / Level
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative h-64 sm:h-80 lg:h-full min-h-[290px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
            {!heroImgErr ? (
              <img
                src={HERO_IMAGE}
                alt="Enterprise Cisco-style network switch and router chassis with Cat6A and fiber patch cables"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgErr(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300 p-6 text-center">
                <Network className="w-10 h-10 text-sky-400 mb-3" />
                <span className="font-display font-semibold text-sm">
                  CCNA 200-301 &amp; IT Help Desk Workbench
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-sky-300">Dual-Track Engineering &amp; Support Hub</p>
                <p className="text-sm font-medium text-white mt-0.5">
                  CCNA IOS Labs, VLSM Studio, IT Help Desk Triage &amp; 318 Mock Exam Qs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Whole-App Progress Strip */}
      <section aria-label="Whole-app study progress" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            CCNA 200-301 Progress
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
            {ccnaSubtotals.done}{' '}
            <span className="text-base font-normal text-slate-400">/ {ccnaSubtotals.total}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {progress.completedLabs.length}/{CCNA_LABS.length} IOS Labs · {ccnaWeightedPct}% Ready
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            IT Help Desk Progress
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
            {itSubtotals.done}{' '}
            <span className="text-base font-normal text-slate-400">/ {itSubtotals.total}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {itSubtotals.simSolved}/{SERVICE_DESK_SCENARIOS.length} Sim Tickets ·{' '}
            {itSubtotals.examsDone}/{IT_SUPPORT_TOPICS.length} Topic Exams · {itOverallPct}% Ready
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            CCNA Subnetting Accuracy
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
            {subnetAccuracy}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({progress.subnetSolved}/{progress.subnetAttempts})
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Streak {progress.subnetStreak} · Best {progress.subnetBestStreak}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Mock Exam Readiness
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
            {bestExamScore}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({progress.examHistory.length} runs)
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {CCNA_EXAM_QUESTIONS.length} CCNA + {IT_SUPPORT_EXAM_QUESTIONS.length} IT Support Qs
          </p>
        </div>
      </section>

      {/* Inside the Whole App: Two Track Launchers */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
            Tracks &amp; Tools Inside This Workspace
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Jump into either track directly—selecting CCNA unlocks IOS CLI Labs and Subnetting in
            the top navigation bar, while IT Help Desk keeps your workspace focused on ticketing,
            Active Directory, endpoint triage, and M365 security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CCNA Card */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  Track 01 · Cisco CCNA (200-301)
                </span>
                <Network className="w-4 h-4 text-sky-500" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Networking, Routing, Switching &amp; Automation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {CCNA_TOPICS.length} guided topics ({ccnaSubtotals.total} subtopics), 6 interactive
                Cisco IOS CLI topology labs, VLSM &amp; IPv6 subnetting studio, and a{' '}
                {CCNA_EXAM_QUESTIONS.length}-question Easy → Hard mock exam.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  onSelectTrack('ccna');
                  onNavigate('curriculum');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors"
              >
                <span>Learn CCNA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTrack('ccna');
                  onNavigate('labs');
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                IOS Labs
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTrack('ccna');
                  onNavigate('subnetting');
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Subnetting
              </button>
              <button
                type="button"
                onClick={() => onOpenTrackExam('ccna')}
                className="px-3 py-2 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                CCNA Mock Exam
              </button>
            </div>
          </div>

          {/* IT Support Card */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  Track 02 · IT Help Desk &amp; Systems Support
                </span>
                <Cpu className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Hardware, Ticketing, Active Directory &amp; M365
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {IT_SUPPORT_TOPICS.length} job-ready topics ({itSubtotals.total} subtopics),{' '}
                {SERVICE_DESK_SCENARIOS.length} interactive Tier 1 &amp; Tier 2 Service Desk
                Simulator tickets (AD/Entra, Endpoint CLI, Diagnostics), and a{' '}
                {IT_SUPPORT_EXAM_QUESTIONS.length}-question Easy → Hard mock exam.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  onSelectTrack('it-support');
                  onNavigate('curriculum');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors"
              >
                <span>Learn IT Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTrack('it-support');
                  onNavigate('simulator');
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-colors"
              >
                Service Desk Simulator
              </button>
              <button
                type="button"
                onClick={() => onOpenTrackExam('it-support')}
                className="px-3 py-2 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                IT Support Mock Exam ({IT_SUPPORT_EXAM_QUESTIONS.length} Qs)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spaced Repetition Due Queue (Both Tracks) */}
      {dueReviews.length > 0 && (
        <section className="p-6 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" />
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                Spaced Repetition Queue ({dueReviews.length} Due Across Both Tracks)
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Weak or elapsed subtopics resurface automatically so mastery sticks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueReviews.slice(0, 6).map((item) => (
              <button
                key={item.subtopic.id}
                type="button"
                onClick={() => onJumpToTopic(item.topic.id, item.subtopic.id, item.trackId)}
                className="text-left p-4 rounded-xl border border-amber-500/30 bg-white dark:bg-[#101622] hover:border-sky-500 transition-colors flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-mono text-amber-600 dark:text-amber-400">
                    {item.trackId === 'it-support' ? 'IT Support' : 'CCNA'} · Subtopic{' '}
                    {item.subtopic.code}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.reason}
                  </div>
                  <div className="text-sm font-semibold text-slate-950 dark:text-white mt-1">
                    {item.subtopic.title}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400">
                  <span>Review Now</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* IT Help Desk & Systems Support Readiness Matrix */}
      <section className="border-t border-slate-200 dark:border-slate-800/80 pt-10 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              IT Help Desk &amp; Systems Support Matrix ({itOverallPct}% Ready)
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Covers all 5 core help desk competency domains across guided subtopics, end-of-topic
              exams, and the {IT_SUPPORT_EXAM_QUESTIONS.length}-question IT Support mock bank.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenCoach(
                'Help me build a practical study plan for an IT Help Desk & Systems Support role covering AD, ticketing, OS triage, and M365.',
              )
            }
            className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap shrink-0"
          >
            Ask Patch for an IT Support plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itDomains.map((dom) => (
            <button
              key={dom.domainId}
              type="button"
              onClick={() => onJumpToTopic(dom.targetTopicId, undefined, 'it-support')}
              className="text-left p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-amber-500/60 dark:hover:border-amber-500/60 transition-colors duration-150 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5 w-full">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  <span>IT Domain {dom.number}</span>
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                    {dom.readinessPct}% Ready
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  {dom.title}
                </h3>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${dom.readinessPct}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {dom.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                <span>
                  {dom.subtopicsDone}/{dom.subtopicsTotal} subtopics ·{' '}
                  {dom.topicExamDone ? 'Topic exam done' : 'Topic exam pending'}
                  {dom.examAttempted > 0 ? ` · ${dom.examCorrect}/${dom.examAttempted} mock` : ''}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CCNA 200-301 Official Weighted Blueprint Matrix */}
      <section className="border-t border-slate-200 dark:border-slate-800/80 pt-10 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              CCNA 200-301 Official Blueprint Mapping ({ccnaWeightedPct}% Weighted)
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Each domain tracks subtopic checks, matching CLI labs, and mock exam accuracy
              weighted by Cisco&apos;s official blueprint percentages.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenCoach(
                'Help me build a 4-week CCNA 200-301 study plan focusing on the highest-weight exam domains.',
              )
            }
            className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap shrink-0"
          >
            Ask Ping for a CCNA plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ccnaDomains.map((dom) => (
            <button
              key={dom.domainId}
              type="button"
              onClick={() => onJumpToTopic(dom.targetTopicId, undefined, 'ccna')}
              className="text-left p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] hover:border-sky-500/60 dark:hover:border-sky-500/60 transition-colors duration-150 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5 w-full">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  <span>Domain {dom.number}</span>
                  <span className="font-mono font-semibold text-sky-600 dark:text-sky-400">
                    {dom.examWeight}% Weight · {dom.readinessPct}% Ready
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  {dom.title}
                </h3>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all"
                    style={{ width: `${dom.readinessPct}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {dom.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                <span>
                  {dom.subtopicsDone}/{dom.subtopicsTotal} subtopics · {dom.labsDone}/{dom.labsTotal}{' '}
                  labs
                  {dom.examAttempted > 0 ? ` · ${dom.examCorrect}/${dom.examAttempted} mock` : ''}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Interactive OSI Encapsulation Stepper */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-t border-slate-200 dark:border-slate-800/80 pt-10">
        <div className="lg:col-span-5">
          <div className="relative h-64 lg:h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
            {!osiImgErr ? (
              <img
                src={OSI_IMAGE}
                alt="Isometric 7-layer network protocol encapsulation diagram"
                referrerPolicy="no-referrer"
                onError={() => setOsiImgErr(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-6 text-center">
                <Layers className="w-10 h-10 text-sky-400 mb-3" />
                <span className="font-display font-semibold text-sm">
                  7-Layer OSI Encapsulation Stack
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs font-medium text-amber-300">Shared Networking Reference</p>
              <p className="text-sm font-medium text-white mt-0.5">
                Inspect headers, PDUs, and troubleshooting layers for CCNA &amp; Help Desk
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              OSI Encapsulation Explorer
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Select a layer to trace how application data becomes segments, packets, frames, and
              bits—core for both CCNA routing and Help Desk endpoint troubleshooting.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
            {OSI_LAYERS.map((item) => {
              const active = item.layer === selectedLayer;
              return (
                <button
                  key={item.layer}
                  type="button"
                  onClick={() => setSelectedLayer(item.layer)}
                  className={`px-2.5 py-2.5 rounded-lg border text-left transition-colors duration-150 ${
                    active
                      ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold tabular-nums">L{item.layer}</div>
                  <div className="text-xs font-medium truncate mt-0.5">{item.name}</div>
                </button>
              );
            })}
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                Layer {activeOsi.layer}: {activeOsi.name}
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                TCP/IP: {activeOsi.tcpIp} · PDU: {activeOsi.pdu}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeOsi.encap}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
              <div>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Key Protocols
                </span>
                <p className="mt-1 font-mono text-slate-800 dark:text-slate-200">
                  {activeOsi.protocols}
                </p>
              </div>
              <div>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Primary Hardware
                </span>
                <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                  {activeOsi.hardware}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local-First Data & Workspace Controls */}
      <section className="border-t border-slate-200 dark:border-slate-800/80 pt-8 pb-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-950 dark:text-white">
              Local-First Backup &amp; Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browser storage can be cleared when clearing site data. Export a JSON snapshot
              regularly so you never lose weeks of study progress.
            </p>
            {importNotice && (
              <p className="text-xs font-medium text-sky-600 dark:text-sky-400 mt-1.5">
                {importNotice}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              {progress.theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors whitespace-nowrap shrink-0"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-2 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
