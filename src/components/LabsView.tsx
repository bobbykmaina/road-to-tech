import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  MessageSquare,
  RotateCcw,
  Terminal as TerminalIcon,
  HelpCircle,
} from 'lucide-react';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CCNA_LABS } from '../data/labs';
import {
  CliSessionState,
  executeIosCommand,
  getModeCompletions,
  getPrompt,
} from '../engine/iosSimulator';
import { CcnaLab, LocalProgressState, SimDevice } from '../types/ccna';

interface LabsViewProps {
  progress: LocalProgressState;
  onBack: () => void;
  onMarkLabCompleted: (labId: string) => void;
  onAskZeroLab: (lab: CcnaLab, devices: Record<string, SimDevice>, activeDeviceId: string) => void;
}

interface TerminalLine {
  id: string;
  kind: 'prompt' | 'output' | 'system';
  text: string;
}

function cloneDevices(d: Record<string, SimDevice>): Record<string, SimDevice> {
  return JSON.parse(JSON.stringify(d)) as Record<string, SimDevice>;
}

export function LabsView({ progress, onBack, onMarkLabCompleted, onAskZeroLab }: LabsViewProps) {
  const [activeLabId, setActiveLabId] = useState<string>(CCNA_LABS[0].id);
  const activeLab = useMemo(
    () => CCNA_LABS.find((l) => l.id === activeLabId) ?? CCNA_LABS[0],
    [activeLabId],
  );

  const [devices, setDevices] = useState<Record<string, SimDevice>>(() =>
    cloneDevices(activeLab.initialDevices),
  );
  const [session, setSession] = useState<CliSessionState>(() => ({
    deviceId: Object.keys(activeLab.initialDevices)[0],
    mode: 'user',
  }));
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      kind: 'system',
      text: `Connected to ${Object.values(activeLab.initialDevices)[0].hostname} console. Type "enable" or "?" for commands.`,
    },
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHint, setShowHint] = useState(false);
  const [pingFlash, setPingFlash] = useState<'ok' | 'fail' | null>(null);

  const termScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadLab = (lab: CcnaLab) => {
    const fresh = cloneDevices(lab.initialDevices);
    const firstDevId = Object.keys(fresh)[0];
    setActiveLabId(lab.id);
    setDevices(fresh);
    setSession({ deviceId: firstDevId, mode: 'user' });
    setTerminalLines([
      {
        id: `init_${Date.now()}`,
        kind: 'system',
        text: `Loaded ${lab.number}: ${lab.title}. Console attached to ${fresh[firstDevId].hostname}.`,
      },
    ]);
    setCommandInput('');
    setCmdHistory([]);
    setHistoryIndex(-1);
    setShowHint(false);
  };

  const switchDevice = (deviceId: string) => {
    if (!devices[deviceId] || deviceId === session.deviceId) return;
    setSession({ deviceId, mode: 'user' });
    setTerminalLines((prev) => [
      ...prev,
      {
        id: `sw_${Date.now()}`,
        kind: 'system',
        text: `--- Console switched to ${devices[deviceId].hostname} (${deviceId}) ---`,
      },
    ]);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (termScrollRef.current) {
      termScrollRef.current.scrollTop = termScrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const objectiveResults = useMemo(() => {
    return activeLab.objectives.map((obj) => ({
      ...obj,
      passed: obj.check(devices),
    }));
  }, [activeLab, devices]);

  const allObjectivesPassed = objectiveResults.every((o) => o.passed);

  useEffect(() => {
    if (allObjectivesPassed) {
      onMarkLabCompleted(activeLab.id);
    }
  }, [allObjectivesPassed, activeLab.id, onMarkLabCompleted]);

  const activeDevice = devices[session.deviceId] ?? Object.values(devices)[0];
  const promptText = getPrompt(activeDevice, session);

  const runCommand = (rawCmd: string) => {
    const lineIdBase = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const result = executeIosCommand(rawCmd, session, devices);

    if (result.clearTerminal) {
      setTerminalLines([]);
    } else {
      const nextEntries: TerminalLine[] = [
        { id: `${lineIdBase}_p`, kind: 'prompt', text: `${promptText} ${rawCmd}` },
        ...result.output.map((out, idx) => ({
          id: `${lineIdBase}_o_${idx}`,
          kind: 'output' as const,
          text: out,
        })),
      ];
      setTerminalLines((prev) => [...prev, ...nextEntries]);
    }

    if (result.pingTargetIp) {
      setPingFlash(result.pingSuccess ? 'ok' : 'fail');
      setTimeout(() => setPingFlash(null), 1800);
    }

    setDevices(result.devices);
    setSession(result.nextSession);
    if (rawCmd.trim()) {
      setCmdHistory((prev) => [rawCmd.trim(), ...prev].slice(0, 40));
    }
    setHistoryIndex(-1);
    setCommandInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(commandInput);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(nextIdx);
      setCommandInput(cmdHistory[nextIdx]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      } else {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCommandInput(cmdHistory[nextIdx]);
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const val = commandInput.trimStart().toLowerCase();
      if (!val) return;
      const candidates = getModeCompletions(session.mode, activeDevice.kind);
      const matches = candidates.filter((c) => c.toLowerCase().startsWith(val));
      if (matches.length === 1) {
        setCommandInput(`${matches[0]} `);
      } else if (matches.length > 1) {
        const lineIdBase = `tab_${Date.now()}`;
        setTerminalLines((prev) => [
          ...prev,
          { id: `${lineIdBase}_p`, kind: 'prompt', text: `${promptText} ${commandInput}` },
          { id: `${lineIdBase}_o`, kind: 'output', text: matches.join('   ') },
        ]);
      }
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (session.mode !== 'user' && session.mode !== 'priv') {
        runCommand('end');
      }
    }
  };

  const configurableDevices = Object.values(devices);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 space-y-6">
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

      {/* Header & Lab Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            Cisco IOS CLI Lab Workbench
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Click any router or switch in the topology, configure real IOS commands, and verify
            connectivity live.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => loadLab(activeLab)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Lab</span>
          </button>
          <button
            type="button"
            onClick={() => onAskZeroLab(activeLab, devices, activeDevice.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Zero to Debug</span>
          </button>
        </div>
      </div>

      {/* Lab Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CCNA_LABS.map((lab) => {
          const active = lab.id === activeLab.id;
          const passed = progress.completedLabs.includes(lab.id);
          return (
            <button
              key={lab.id}
              type="button"
              onClick={() => loadLab(lab)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                active
                  ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <span>
                {lab.number}: {lab.title}
              </span>
              {passed && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    active ? 'text-white dark:text-slate-950' : 'text-emerald-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Lab Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Topology + Brief + Live Objectives */}
        <div className="lg:col-span-5 space-y-5">
          {/* Interactive SVG Topology */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Live Network Topology
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Click node to switch console
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-[#090D14] border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <svg viewBox="0 0 520 240" className="w-full h-56 select-none">
                {/* Links */}
                {activeLab.links.map((link) => {
                  const devA = devices[link.fromDevice];
                  const devB = devices[link.toDevice];
                  if (!devA || !devB) return null;

                  const ifA = Object.values(devA.interfaces).find(
                    (i) => i.shortName === link.fromIf || i.name === link.fromIf,
                  );
                  const ifB = Object.values(devB.interfaces).find(
                    (i) => i.shortName === link.toIf || i.name === link.toIf,
                  );
                  const linkUp = Boolean(ifA?.adminUp && ifB?.adminUp);

                  const mx = (devA.x + devB.x) / 2;
                  const my = (devA.y + devB.y) / 2;

                  return (
                    <g key={`${link.fromDevice}-${link.toDevice}`}>
                      <line
                        x1={devA.x}
                        y1={devA.y}
                        x2={devB.x}
                        y2={devB.y}
                        stroke={
                          pingFlash === 'ok'
                            ? '#38BDF8'
                            : linkUp
                              ? '#10B981'
                              : '#F59E0B'
                        }
                        strokeWidth={pingFlash === 'ok' ? 3 : 2}
                        strokeDasharray={linkUp ? undefined : '5 4'}
                      />
                      {link.label && (
                        <text
                          x={mx}
                          y={my - 8}
                          textAnchor="middle"
                          className="fill-slate-500 dark:fill-slate-400 font-mono text-[10px]"
                        >
                          {link.label}
                        </text>
                      )}
                      <text
                        x={mx}
                        y={my + 13}
                        textAnchor="middle"
                        className={`font-mono text-[9px] font-semibold ${
                          linkUp ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-amber-600 dark:fill-amber-400'
                        }`}
                      >
                        {linkUp ? 'UP/UP' : 'DOWN'}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {configurableDevices.map((dev) => {
                  const isSelected = dev.id === activeDevice.id;
                  return (
                    <g
                      key={dev.id}
                      onClick={() => switchDevice(dev.id)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={dev.x - 42}
                        y={dev.y - 22}
                        width={84}
                        height={44}
                        rx={8}
                        className={
                          isSelected
                            ? 'fill-sky-600 dark:fill-sky-500 stroke-sky-300'
                            : 'fill-white dark:fill-[#161E2E] stroke-slate-300 dark:stroke-slate-700'
                        }
                        strokeWidth={isSelected ? 2 : 1.25}
                      />
                      <text
                        x={dev.x}
                        y={dev.y - 2}
                        textAnchor="middle"
                        className={`font-mono text-[11px] font-semibold ${
                          isSelected
                            ? 'fill-white dark:fill-slate-950'
                            : 'fill-slate-900 dark:fill-slate-100'
                        }`}
                      >
                        {dev.hostname}
                      </text>
                      <text
                        x={dev.x}
                        y={dev.y + 13}
                        textAnchor="middle"
                        className={`font-sans text-[9px] uppercase tracking-wider ${
                          isSelected
                            ? 'fill-sky-100 dark:fill-slate-900'
                            : 'fill-slate-500 dark:fill-slate-400'
                        }`}
                      >
                        {dev.kind}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Scenario Brief & Objectives */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] p-5 space-y-4">
            <div className="space-y-1.5">
              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {activeLab.number} · {activeLab.difficulty} · ~{activeLab.estimatedMinutes} min
              </div>
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                {activeLab.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeLab.brief}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Lab Verification Checks
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {objectiveResults.filter((o) => o.passed).length}/{objectiveResults.length} passed
                </span>
              </div>

              <ul className="space-y-2">
                {objectiveResults.map((obj) => (
                  <li
                    key={obj.id}
                    className={`flex items-start gap-2.5 text-xs p-2.5 rounded-lg border ${
                      obj.passed
                        ? 'border-emerald-300/80 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {obj.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{obj.label}</span>
                  </li>
                ))}
              </ul>

              {allObjectivesPassed && (
                <div className="p-3 rounded-lg bg-emerald-600/10 border border-emerald-500/40 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  All lab objectives verified. Lab recorded in local progress.
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Starter Hint' : 'Show Starter Hint'}</span>
              </button>
              {showHint && (
                <p className="mt-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] font-mono text-xs text-slate-700 dark:text-slate-300">
                  {activeLab.starterHint}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Cisco IOS Terminal */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-300 dark:border-slate-800 bg-[#090D14] text-slate-100 overflow-hidden shadow-lg">
          {/* Terminal Top Bar */}
          <div className="px-4 py-2.5 bg-[#0E1420] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <TerminalIcon className="w-4 h-4 text-sky-400" />
              <span>IOSv Console · {activeDevice.hostname}</span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {configurableDevices.map((dev) => (
                <button
                  key={dev.id}
                  type="button"
                  onClick={() => switchDevice(dev.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    dev.id === activeDevice.id
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {dev.hostname}
                </button>
              ))}
            </div>
          </div>

          {/* Output Buffer */}
          <div
            ref={termScrollRef}
            onClick={() => inputRef.current?.focus()}
            className="h-[420px] sm:h-[460px] overflow-y-auto p-4 font-mono text-xs sm:text-[13px] leading-relaxed space-y-1 cursor-text"
          >
            {terminalLines.map((line) => (
              <div
                key={line.id}
                className={
                  line.kind === 'prompt'
                    ? 'text-sky-300 font-medium whitespace-pre-wrap'
                    : line.kind === 'system'
                      ? 'text-amber-300/90 italic whitespace-pre-wrap'
                      : 'text-slate-200 whitespace-pre-wrap'
                }
              >
                {line.text}
              </div>
            ))}

            {/* Active Command Line */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-emerald-400 font-semibold shrink-0">{promptText}</span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                aria-label="Cisco IOS command input"
                placeholder="Type IOS command (Tab to complete, ? for help)..."
                className="flex-1 min-w-0 bg-transparent text-white placeholder:text-slate-600 focus:outline-none font-mono text-xs sm:text-[13px]"
              />
            </div>
          </div>

          {/* Quick IOS Verification Actions */}
          <div className="px-4 py-2.5 bg-[#0E1420] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {['show ip int br', 'show running-config', 'show ip route', 'show vlan br', 'show ip ospf neighbor'].map(
                (quickCmd) => (
                  <button
                    key={quickCmd}
                    type="button"
                    onClick={() =>
                      runCommand(
                        session.mode === 'user' || session.mode === 'priv'
                          ? quickCmd
                          : `do ${quickCmd}`,
                      )
                    }
                    className="px-2 py-1 text-[11px] font-mono rounded border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    {quickCmd}
                  </button>
                ),
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Tab: autocomplete · Up/Down: history
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
