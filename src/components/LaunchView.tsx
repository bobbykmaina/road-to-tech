import { ArrowLeft, ArrowRight, Cpu, Network, RotateCw } from 'lucide-react';
import { CCNA_TOPICS } from '../data/ccnaPath';
import { IT_SUPPORT_TOPICS } from '../data/itSupportPath';
import { LearningTrackId, LocalProgressState, SkillLevelId } from '../types/ccna';

interface LaunchViewProps {
  progress: LocalProgressState;
  chosenTrack: LearningTrackId | null;
  onSelectTrack: (track: LearningTrackId | null) => void;
  onStartTrack: (track: LearningTrackId, level: SkillLevelId) => void;
  onResumePrevious: () => void;
}

const LEVEL_CARDS: {
  id: SkillLevelId;
  title: string;
  subtitle: string;
  ccnaStart: string;
  itStart: string;
}[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'Zero prior experience. Plain-English analogies, fundamentals, and step-by-step checks.',
    ccnaStart: 'Starts at Topic 01: How Networks Actually Work',
    itStart: 'Starts at Topic 01: Hardware, OS & Boot Triage',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Know the basics and ready for core VLANs, trunking, routing, or AD & ticketing.',
    ccnaStart: 'Starts at Topic 03: Switching, VLANs & STP',
    itStart: 'Starts at Topic 02: Ticketing, SLAs & Active Directory',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'Comfortable with fundamentals; focus on OSPF, NAT, ACLs, or client network diagnostics.',
    ccnaStart: 'Starts at Topic 04/05: Routing, OSPF & IP Services',
    itStart: 'Starts at Topic 04: Endpoint Networking, DNS & VPNs',
  },
  {
    id: 'expert',
    title: 'Expert',
    subtitle: 'Ready for enterprise security, wireless CAPWAP, SDN/Ansible, M365 security, and PowerShell.',
    ccnaStart: 'Starts at Topic 06/07: Security, Wireless & Automation',
    itStart: 'Starts at Topic 05: M365 Security & PowerShell',
  },
  {
    id: 'refresh',
    title: 'Refresh Yourself',
    subtitle: 'Rapidly review key concepts, test yourself with topic exams, and sharpen weak spots.',
    ccnaStart: 'Opens full CCNA roadmap in Rapid Review mode',
    itStart: 'Opens full IT Support roadmap in Rapid Review mode',
  },
];

export function LaunchView({
  progress,
  chosenTrack,
  onSelectTrack,
  onStartTrack,
  onResumePrevious,
}: LaunchViewProps) {
  const hasSavedProgress =
    progress.activeTrack !== null &&
    progress.selectedLevel !== null &&
    (progress.completedLessons.length > 0 ||
      progress.completedLabs.length > 0 ||
      Object.keys(progress.subtopicChecks).length > 0);

  // Page 2: Dedicated Level Selection Screen after picking CCNA or IT Help Desk
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
              {isCcna ? 'Track 01 · Cisco CCNA (200-301)' : 'Track 02 · IT Help Desk & Systems Support'}
            </div>
            <h1
              className="font-display font-bold tracking-tight text-slate-950 dark:text-white leading-[1.1]"
              style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)', textWrap: 'balance' }}
            >
              Choose where you are most comfortable starting.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Pick your current skill tier below. All topics and subtopics remain accessible
              anytime, and every check gives a complete breakdown of every answer.
            </p>
          </div>
        </div>

        <section
          aria-label="Comfort level selection"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {LEVEL_CARDS.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onStartTrack(chosenTrack, lvl.id)}
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
                {isCcna ? lvl.ccnaStart : lvl.itStart}
              </div>
            </button>
          ))}
        </section>
      </div>
    );
  }

  // Page 1: Clean Two-Choice Landing Page (CCNA & IT Help Desk only)
  return (
    <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <section className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Road to TECH</span>
          <span aria-hidden="true">·</span>
          <span>CCNA 200-301 Workbench</span>
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
          spaced-repetition subtopic exams. Expand next into IT Systems Support—with CCNP, ISTQB,
          and ITIL 4 tracks ahead.
        </p>

        {hasSavedProgress && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onResumePrevious}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>
                Resume {progress.activeTrack === 'ccna' ? 'CCNA 200-301' : 'IT Help Desk'} (
                {progress.selectedLevel}) · {progress.completedLessons.length} subtopics completed
              </span>
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
              <span>Track 01 · Primary Certification Path</span>
              <Network className="w-4 h-4 text-sky-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Cisco CCNA (200-301)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Go from zero networking background to full 200-301 readiness: OSI layers, binary
              subnetting, VLANs, STP, OSPF, NAT, ACLs, Wireless, and SDN automation—paired with
              live IOS CLI labs.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
            <span>
              {CCNA_TOPICS.length} Topics ·{' '}
              {CCNA_TOPICS.reduce((acc, t) => acc + t.subtopics.length, 0)} Subtopics · 6 IOS Labs
            </span>
            <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
              <span>Choose Level</span>
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
              <span>Track 02 · Expansion Track</span>
              <Cpu className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              IT Help Desk &amp; Systems Support
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Built for learners moving from fundamentals into real Help Desk operations: hardware/OS
              triage, ticketing &amp; SLAs, Microsoft Active Directory &amp; Entra ID, Group Policy,
              NTFS permissions, DNS/DHCP client troubleshooting, and Microsoft 365.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
            <span>
              {IT_SUPPORT_TOPICS.length} Topics ·{' '}
              {IT_SUPPORT_TOPICS.reduce((acc, t) => acc + t.subtopics.length, 0)} Subtopics ·
              End-of-Topic Exams
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
