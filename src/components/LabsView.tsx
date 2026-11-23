import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  HelpCircle,
  MessageSquare,
  RotateCcw,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CCNA_LABS } from '../data/labs';
import {
  autocompleteIosInput,
  CliSessionState,
  executeIosCommand,
  getPrompt,
  isLinkOperational,
} from '../engine/iosSimulator';
import { CcnaLab, LocalProgressState, SimDevice } from '../types/ccna';

interface LabsViewProps {
  progress: LocalProgressState;
  onBack: () => void;
  onMarkLabCompleted: (labId: string) => void;
  onAskPingLab: (lab: CcnaLab, devices: Record<string, SimDevice>, activeDeviceId: string) => void;
}

interface TerminalLine {
  id: string;
  kind: 'prompt' | 'output' | 'system';
  text: string;
}

type LabFilter = 'all' | 'Build' | 'Troubleshoot';

function cloneDevices(d: Record<string, SimDevice>): Record<string, SimDevice> {
  return JSON.parse(JSON.stringify(d)) as Record<string, SimDevice>;
}

export function LabsView({ progress, onBack, onMarkLabCompleted, onAskPingLab }: LabsViewProps) {
  const [labFilter, setLabFilter] = useState<LabFilter>('all');
  const [activeLabId, setActiveLabId] = useState<string>(CCNA_LABS[0].id);

  const filteredLabs = useMemo(() => {
    if (labFilter === 'all') return CCNA_LABS;
    return CCNA_LABS.filter((l) => (l.category ?? 'Build') === labFilter);
  }, [labFilter]);

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
      text: `Connected to ${Object.values(activeLab.initialDevices)[0].hostname} console. Type "enable" or press "?" for commands.`,
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
    if (rawCmd.trim() && !rawCmd.trim().endsWith('?')) {
      setCmdHistory((prev) => [rawCmd.trim(), ...prev].slice(0, 40));
    }
    setHistoryIndex(-1);
    setCommandInput('');
  };

  const triggerContextHelp = () => {
    const lineIdBase = `help_${Date.now()}`;
    const result = executeIosCommand(`${commandInput}?`, session, devices);
    setTerminalLines((prev) => [
      ...prev,
      { id: `${lineIdBase}_p`, kind: 'prompt', text: `${promptText} ${commandInput}?` },
      ...result.output.map((out, idx) => ({
        id: `${lineIdBase}_o_${idx}`,
        kind: 'output' as const,
        text: out,
      })),
    ]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '?') {
      e.preventDefault();
      triggerContextHelp();
      return;
    }

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
      const res = autocompleteIosInput(commandInput, session, activeDevice);
      if (res.completed) {
        setCommandInput(res.completed);
      } else if (res.candidates && res.candidates.length > 0) {
        const lineIdBase = `tab_${Date.now()}`;
        setTerminalLines((prev) => [
          ...prev,
          { id: `${lineIdBase}_p`, kind: 'prompt', text: `${promptText} ${commandInput}` },
          { id: `${lineIdBase}_o`, kind: 'output', text: res.candidates!.join('   ') },
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

  const quickShowCommands = useMemo(() => {
    const base = ['show ip int br', 'show running-config'];
    if (activeDevice.kind === 'switch') {
      base.push('show interfaces status', 'show vlan br', 'show interfaces trunk', 'show etherchannel summary');
    } else if (activeDevice.kind === 'router') {
      base.push('show ip route', 'show ip ospf neighbor', 'show ip nat translations', 'show standby brief');
    }
    if ((activeLab.category ?? 'Build') === 'Troubleshoot') {
      base.push('show logging');
    }
    return base;
  }, [activeDevice.kind, activeLab.category]);

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

      {/* Header & Lab Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              Cisco IOS CLI Lab Workbench
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 tabular-nums">
              {progress.completedLabs.length}/{CCNA_LABS.length} Completed
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Click any device in the topology, run real Cisco IOS build and break/fix commands (with
            pipes, tab completion, and live &quot;?&quot; context help), and verify end-to-end reachability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0E1420] p-0.5">
            {(['all', 'Build', 'Troubleshoot'] as LabFilter[]).map((f) => {
              const count =
                f === 'all'
                  ? CCNA_LABS.length
                  : CCNA_LABS.filter((l) => (l.category ?? 'Build') === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLabFilter(f)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    labFilter === f
                      ? 'bg-white dark:bg-sky-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All' : f} ({count})
                </button>
              );
            })}
          </div>
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
            onClick={() => onAskPingLab(activeLab, devices, activeDevice.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Ping to Debug</span>
          </button>
        </div>
      </div>

      {/* Lab Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filteredLabs.map((lab) => {
          const active = lab.id === activeLab.id;
          const passed = progress.completedLabs.includes(lab.id);
          const isTshoot = lab.category === 'Troubleshoot';
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
              {isTshoot && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                    active
                      ? 'bg-white/20 dark:bg-slate-950/20'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  FIX
                </span>
              )}
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
        {/* Left: Topology + Port Inspector + Brief + Live Objectives */}
        <div className="lg:col-span-5 space-y-5">
          {/* Interactive SVG Topology & Port Inspector */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Live Network Topology
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Click node to attach console
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-[#090D14] border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <svg viewBox="0 0 540 240" className="w-full h-56 select-none">
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
                  const hasErrDisabled = Boolean(ifA?.errDisabled || ifB?.errDisabled);
                  const linkUp = Boolean(
                    ifA &&
                      ifB &&
                      isLinkOperational(devA.id, ifA, devices) &&
                      isLinkOperational(devB.id, ifB, devices),
                  );

                  const mx = (devA.x + devB.x) / 2;
                  const my = (devA.y + devB.y) / 2;

                  return (
                    <g key={`${link.fromDevice}-${link.toDevice}-${link.fromIf}`}>
                      <line
                        x1={devA.x}
                        y1={devA.y}
                        x2={devB.x}
                        y2={devB.y}
                        stroke={
                          pingFlash === 'ok'
                            ? '#38BDF8'
                            : hasErrDisabled
                              ? '#F43F5E'
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
                          hasErrDisabled
                            ? 'fill-rose-500'
                            : linkUp
                              ? 'fill-emerald-600 dark:fill-emerald-400'
                              : 'fill-amber-600 dark:fill-amber-400'
                        }`}
                      >
                        {hasErrDisabled ? 'ERR-DIS' : linkUp ? 'UP/UP' : 'DOWN'}
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

            {/* Active Device Port & State Inspector */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0B0F17] p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">
                  {activeDevice.hostname} Interfaces
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {activeDevice.kind === 'switch' && activeDevice.ipRouting ? 'L3 Routing On' : activeDevice.kind.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {Object.values(activeDevice.interfaces).map((iface) => {
                  const op = isLinkOperational(activeDevice.id, iface, devices);
                  const stateLabel = iface.errDisabled
                    ? 'ERR-DIS'
                    : !iface.adminUp
                      ? 'ADMIN DN'
                      : op
                        ? 'UP'
                        : 'DOWN';
                  const badgeCls = iface.errDisabled
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                    : op
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-500/10';
                  const infoParts: string[] = [];
                  if (iface.ip) infoParts.push(iface.ip);
                  if (iface.switchportMode === 'trunk') infoParts.push(`Trunk(N:${iface.nativeVlan ?? 1})`);
                  else if (iface.switchportMode === 'access') infoParts.push(`V${iface.accessVlan ?? 1}`);
                  if (iface.channelGroup) infoParts.push(`Po${iface.channelGroup.id}`);
                  if (iface.hsrp?.vip) infoParts.push(`VIP ${iface.hsrp.vip}`);
                  if (iface.natRole) infoParts.push(`NAT-${iface.natRole}`);
                  if (iface.helperAddress) infoParts.push(`Relay`);
                  return (
                    <div
                      key={iface.name}
                      className="flex items-center justify-between gap-2 text-[11px] font-mono py-0.5"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                        {iface.shortName}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 truncate">
                        {infoParts.join(' · ') || 'unassigned'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${badgeCls}`}>
                        {stateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scenario Brief & Objectives */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] p-5 space-y-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                <span>
                  {activeLab.number} · {activeLab.difficulty} · ~{activeLab.estimatedMinutes} min
                </span>
                {activeLab.category === 'Troubleshoot' && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
                    Break/Fix
                  </span>
                )}
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
            className="h-[460px] sm:h-[520px] overflow-y-auto p-4 font-mono text-xs sm:text-[13px] leading-relaxed space-y-1 cursor-text"
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
                placeholder="Type IOS command (Tab to complete, ? for live help)..."
                className="flex-1 min-w-0 bg-transparent text-white placeholder:text-slate-600 focus:outline-none font-mono text-xs sm:text-[13px]"
              />
            </div>
          </div>

          {/* Quick IOS Verification Actions */}
          <div className="px-4 py-2.5 bg-[#0E1420] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={triggerContextHelp}
                className="px-2 py-1 text-[11px] font-mono rounded border border-sky-700/70 text-sky-300 hover:bg-sky-950/60 transition-colors whitespace-nowrap shrink-0"
                title="Show mode commands (?)"
              >
                ? help
              </button>
              {quickShowCommands.map((quickCmd) => (
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
              ))}
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Tab: complete · ?: help · Ctrl+Z: end
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
