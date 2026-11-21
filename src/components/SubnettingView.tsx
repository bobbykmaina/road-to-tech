import { ArrowLeft, CheckCircle2, Clock, Eye, MessageSquare, RefreshCw, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { intToIp, ipToInt, isValidIpv4 } from '../engine/iosSimulator';
import { LocalProgressState, SubnetDrillMode } from '../types/ccna';

interface SubnettingViewProps {
  progress: LocalProgressState;
  onBack: () => void;
  onRecordResult: (mode: SubnetDrillMode, correct: boolean, elapsedMs: number) => void;
  onAskZeroSubnet: (contextText: string) => void;
}

interface SubnetQuestion {
  mode: SubnetDrillMode;
  prompt: string;
  ip: string;
  cidr: number;
  expectedA: string;
  expectedB?: string;
  labelA: string;
  labelB?: string;
  placeholderA: string;
  placeholderB?: string;
  explanation: string;
  workingSteps: string[];
  acceptNormalizer?: (val: string) => string;
}

const MODE_LABELS: { id: SubnetDrillMode; label: string }[] = [
  { id: 'network-broadcast', label: 'Network & Broadcast' },
  { id: 'host-range', label: 'Usable Hosts' },
  { id: 'wildcard', label: 'Wildcard Mask' },
  { id: 'vlsm', label: 'VLSM Sizing' },
  { id: 'ipv6', label: 'IPv6 & EUI-64' },
];

function normalizeIpv6(raw: string): string {
  return raw.trim().toLowerCase().replace(/^0+:/, ':');
}

function generateIpv6Question(): SubnetQuestion {
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
    // Zero compression RFC 5952
    const samples = [
      {
        full: '2001:0db8:0000:0000:0000:0000:004a:0001',
        compressed: '2001:db8::4a:1',
        steps: [
          '1. Strip leading zeros inside each hextet: 0db8 -> db8, 004a -> 4a, 0001 -> 1.',
          '2. Locate the longest contiguous run of all-zero hextets (four 0000 blocks in the middle).',
          '3. Collapse that longest run once into "::" -> 2001:db8::4a:1.',
        ],
      },
      {
        full: 'fe80:0000:0000:0000:020c:29ff:fe4a:00c0',
        compressed: 'fe80::20c:29ff:fe4a:c0',
        steps: [
          '1. Collapse the three consecutive 0000 hextets into "::".',
          '2. Remove leading zeros from each remaining hextet: 020c -> 20c, 00c0 -> c0 (keep trailing zeros!).',
          '3. Result: fe80::20c:29ff:fe4a:c0.',
        ],
      },
      {
        full: '2001:0db8:0a10:0000:0000:0000:0000:0010',
        compressed: '2001:db8:a10::10',
        steps: [
          '1. Remove leading zeros in each group: 0db8 -> db8, 0a10 -> a10, 0010 -> 10.',
          '2. Replace the four consecutive 0000 blocks with "::".',
          '3. Result: 2001:db8:a10::10.',
        ],
      },
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    return {
      mode: 'ipv6',
      prompt: `Compress this IPv6 address into its shortest RFC 5952 notation:\n${pick.full}`,
      ip: pick.full,
      cidr: 64,
      labelA: 'Compressed IPv6 Address',
      placeholderA: 'e.g. 2001:db8::4a:1',
      expectedA: pick.compressed,
      explanation: `RFC 5952 drops leading zeros in every hextet and collapses the longest run of 0000 blocks once into "::" -> ${pick.compressed}.`,
      workingSteps: pick.steps,
      acceptNormalizer: (v) => v.trim().toLowerCase(),
    };
  }

  if (variant === 1) {
    // EUI-64 Interface ID from MAC
    const euiSamples = [
      {
        mac: '00:1A:2B:3C:4D:5E',
        iid: '021a:2bff:fe3c:4d5e',
        flippedFirstByte: '02',
        origFirstByte: '00',
        steps: [
          '1. Split the 48-bit MAC in half and insert FF:FE in the center -> 001A:2BFF:FE3C:4D5E.',
          '2. Inspect the 1st byte (00 hex = 0000 0000 binary). Flip the 7th bit (U/L bit, +2): 0000 0010 = 02 hex.',
          '3. Assemble and strip leading zeros if abbreviated -> 021a:2bff:fe3c:4d5e (or 21a:2bff:fe3c:4d5e).',
        ],
      },
      {
        mac: '02:50:56:AA:BB:CC',
        iid: '0050:56ff:feaa:bbcc',
        flippedFirstByte: '00',
        origFirstByte: '02',
        steps: [
          '1. Split MAC and insert FFFE -> 0250:56FF:FEAA:BBCC.',
          '2. Flip the 7th bit of first byte 02 hex (0000 0010 -> 0000 0000 = 00 hex).',
          '3. Combine into 64-bit interface ID -> 0050:56ff:feaa:bbcc.',
        ],
      },
      {
        mac: '0C:29:11:22:33:44',
        iid: '0e29:11ff:fe22:3344',
        flippedFirstByte: '0E',
        origFirstByte: '0C',
        steps: [
          '1. Insert FFFE in the middle of the MAC -> 0C29:11FF:FE22:3344.',
          '2. Flip 7th bit of 0C hex (0000 1100 -> 0000 1110 = 0E hex).',
          '3. Final 64-bit EUI-64 interface ID -> 0e29:11ff:fe22:3344.',
        ],
      },
    ];
    const pick = euiSamples[Math.floor(Math.random() * euiSamples.length)];
    return {
      mode: 'ipv6',
      prompt: `Derive the 64-bit EUI-64 Interface ID (4 hextets, e.g. 021a:2bff:fe3c:4d5e) for Ethernet MAC ${pick.mac}.`,
      ip: pick.mac,
      cidr: 64,
      labelA: 'EUI-64 Interface ID',
      placeholderA: 'e.g. 021a:2bff:fe3c:4d5e',
      expectedA: pick.iid,
      explanation: `Insert FFFE between the OUI and NIC halves and invert the 7th (U/L) bit of ${pick.origFirstByte} -> ${pick.flippedFirstByte}, giving ${pick.iid}.`,
      workingSteps: pick.steps,
      acceptNormalizer: (v) =>
        normalizeIpv6(v)
          .split(':')
          .map((h) => h.padStart(4, '0'))
          .join(':'),
    };
  }

  // IPv6 subnet prefix identification (/48, /56, /64)
  const prefixSamples = [
    {
      addr: '2001:db8:4021:0a88::55/56',
      net: '2001:db8:4021:0a00::/56',
      steps: [
        '1. /56 locks the first 3 hextets (48 bits) plus the upper 8 bits (first 2 hex digits) of the 4th hextet.',
        '2. Keep 2001:db8:4021 and the first 2 hex chars of 0a88 ("0a"), zeroing the rest -> 2001:db8:4021:0a00::/56.',
      ],
    },
    {
      addr: '2001:db8:1200:3456:ab12::9/64',
      net: '2001:db8:1200:3456::/64',
      steps: [
        '1. A /64 prefix boundary aligns cleanly with the first 4 hextets (4 x 16 = 64 bits).',
        '2. Zero out hextets 5–8 and compress -> 2001:db8:1200:3456::/64.',
      ],
    },
  ];
  const pick = prefixSamples[Math.floor(Math.random() * prefixSamples.length)];
  return {
    mode: 'ipv6',
    prompt: `Write the IPv6 network prefix (including /prefix length) for host ${pick.addr}.`,
    ip: pick.addr,
    cidr: 64,
    labelA: 'IPv6 Subnet Prefix',
    placeholderA: 'e.g. 2001:db8:4021:0a00::/56',
    expectedA: pick.net,
    explanation: `Zero all host bits beyond the prefix boundary and compress trailing zero hextets to get ${pick.net}.`,
    workingSteps: pick.steps,
    acceptNormalizer: (v) => v.trim().toLowerCase().replace(':a00::', ':0a00::'),
  };
}

function generateSubnetQuestion(mode: SubnetDrillMode): SubnetQuestion {
  if (mode === 'ipv6') {
    return generateIpv6Question();
  }

  const oct1 = [10, 172, 192][Math.floor(Math.random() * 3)];
  const oct2 =
    oct1 === 172
      ? 16 + Math.floor(Math.random() * 15)
      : oct1 === 192
        ? 168
        : Math.floor(Math.random() * 250);
  const oct3 = Math.floor(Math.random() * 250);
  const oct4 = 1 + Math.floor(Math.random() * 250);
  const ip = `${oct1}.${oct2}.${oct3}.${oct4}`;

  if (mode === 'vlsm') {
    const hostsNeeded = [14, 28, 55, 110, 220][Math.floor(Math.random() * 5)];
    let bestCidr = 24;
    for (let c = 30; c >= 20; c--) {
      if (Math.pow(2, 32 - c) - 2 >= hostsNeeded) {
        bestCidr = c;
        break;
      }
    }
    const hostBits = 32 - bestCidr;
    const maskInt = (0xffffffff << hostBits) >>> 0;
    const maskStr = intToIp(maskInt);
    return {
      mode,
      prompt: `A branch office requires ${hostsNeeded} usable host IPv4 addresses (including the router gateway). What is the smallest CIDR prefix length (e.g. /26) and dotted-decimal mask?`,
      ip,
      cidr: bestCidr,
      labelA: 'Prefix (e.g. /26)',
      labelB: 'Subnet Mask',
      placeholderA: '/26',
      placeholderB: '255.255.255.192',
      expectedA: `/${bestCidr}`,
      expectedB: maskStr,
      explanation: `2^${hostBits} - 2 = ${Math.pow(2, hostBits) - 2} usable hosts >= ${hostsNeeded}. That corresponds to /${bestCidr} (${maskStr}).`,
      workingSteps: [
        `1. Find smallest power of 2 where (2^h - 2) >= ${hostsNeeded}: 2^${hostBits} - 2 = ${Math.pow(2, hostBits) - 2} usable hosts.`,
        `2. Subtract host bits from 32: 32 - ${hostBits} = /${bestCidr} network bits.`,
        `3. Convert /${bestCidr} to dotted decimal -> ${maskStr}.`,
      ],
    };
  }

  const cidr = 20 + Math.floor(Math.random() * 11);
  const maskInt = (0xffffffff << (32 - cidr)) >>> 0;
  const maskStr = intToIp(maskInt);
  const ipInt = ipToInt(ip);
  const netInt = (ipInt & maskInt) >>> 0;
  const bcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
  const firstInt = (netInt + 1) >>> 0;
  const lastInt = (bcastInt - 1) >>> 0;

  const interestingOctet = cidr >= 24 ? 3 : 2;
  const maskOctet = (maskInt >>> (24 - interestingOctet * 8)) & 255;
  const blockSize = 256 - maskOctet;
  const ipOctet = interestingOctet === 3 ? oct4 : oct3;
  const netOctet = Math.floor(ipOctet / blockSize) * blockSize;

  const blockSteps = [
    `1. /${cidr} = ${maskStr}. Interesting octet is #${interestingOctet + 1} (mask value ${maskOctet}).`,
    `2. Block size = 256 - ${maskOctet} = ${blockSize}.`,
    `3. Highest multiple of ${blockSize} <= ${ipOctet} is ${netOctet} -> Network ${intToIp(netInt)}, next subnet starts at +${blockSize}, so Broadcast is ${intToIp(bcastInt)}.`,
  ];

  if (mode === 'network-broadcast') {
    return {
      mode,
      prompt: `Given IPv4 host ${ip}/${cidr}, calculate the Network Address and Broadcast Address.`,
      ip,
      cidr,
      labelA: 'Network Address',
      labelB: 'Broadcast Address',
      placeholderA: 'e.g. 192.168.10.64',
      placeholderB: 'e.g. 192.168.10.127',
      expectedA: intToIp(netInt),
      expectedB: intToIp(bcastInt),
      explanation: `Mask /${cidr} is ${maskStr}. Network is ${intToIp(netInt)} and Broadcast is ${intToIp(bcastInt)}.`,
      workingSteps: blockSteps,
    };
  }

  if (mode === 'host-range') {
    return {
      mode,
      prompt: `Given IPv4 host ${ip}/${cidr}, determine the First Usable and Last Usable host addresses.`,
      ip,
      cidr,
      labelA: 'First Usable Host',
      labelB: 'Last Usable Host',
      placeholderA: 'e.g. 192.168.10.65',
      placeholderB: 'e.g. 192.168.10.126',
      expectedA: intToIp(firstInt),
      expectedB: intToIp(lastInt),
      explanation: `Network is ${intToIp(netInt)} (+1 = ${intToIp(firstInt)}) and Broadcast is ${intToIp(bcastInt)} (-1 = ${intToIp(lastInt)}).`,
      workingSteps: [
        ...blockSteps,
        `4. First Usable = Network + 1 (${intToIp(firstInt)}); Last Usable = Broadcast - 1 (${intToIp(lastInt)}).`,
      ],
    };
  }

  const wcInt = (~maskInt) >>> 0;
  return {
    mode,
    prompt: `Convert CIDR prefix /${cidr} (${maskStr}) into a Cisco OSPF/ACL Wildcard Mask.`,
    ip,
    cidr,
    labelA: 'Wildcard Mask',
    placeholderA: 'e.g. 0.0.0.63',
    expectedA: intToIp(wcInt),
    explanation: `Subtract each octet of ${maskStr} from 255.255.255.255 to obtain wildcard ${intToIp(wcInt)}.`,
    workingSteps: [
      `1. Write 255.255.255.255 stacked above subnet mask ${maskStr}.`,
      `2. Subtract octet by octet: 255 - ${maskStr.split('.')[0]}, 255 - ${maskStr.split('.')[1]}, 255 - ${maskStr.split('.')[2]}, 255 - ${maskStr.split('.')[3]}.`,
      `3. Wildcard Mask = ${intToIp(wcInt)}.`,
    ],
  };
}

export function SubnettingView({
  progress,
  onBack,
  onRecordResult,
  onAskZeroSubnet,
}: SubnettingViewProps) {
  const [sampleIp, setSampleIp] = useState('192.168.10.75');
  const [cidr, setCidr] = useState(26);

  const [drillMode, setDrillMode] = useState<SubnetDrillMode>('network-broadcast');
  const [question, setQuestion] = useState<SubnetQuestion>(() =>
    generateSubnetQuestion('network-broadcast'),
  );
  const [ansA, setAnsA] = useState('');
  const [ansB, setAnsB] = useState('');
  const [showWorking, setShowWorking] = useState(false);
  const [timedMode, setTimedMode] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(0);
  const questionStartRef = useRef<number>(Date.now());
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!timedMode || feedback) return;
    const id = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - questionStartRef.current) / 1000));
    }, 500);
    return () => window.clearInterval(id);
  }, [timedMode, feedback, question]);

  const calc = useMemo(() => {
    const valid = isValidIpv4(sampleIp);
    const ipInt = valid ? ipToInt(sampleIp) : ipToInt('192.168.10.75');
    const maskInt = (0xffffffff << (32 - cidr)) >>> 0;
    const wcInt = (~maskInt) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | wcInt) >>> 0;
    const hostBits = 32 - cidr;
    const totalAddrs = Math.pow(2, hostBits);
    const usableHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.max(0, totalAddrs - 2);

    const binaryOctets = [0, 1, 2, 3].map((octIdx) => {
      const byte = (ipInt >>> (24 - octIdx * 8)) & 255;
      return byte.toString(2).padStart(8, '0').split('');
    });

    const interestingOctet = Math.min(3, Math.floor(cidr / 8));
    const maskOctetVal = (maskInt >>> (24 - interestingOctet * 8)) & 255;
    const blockSize = 256 - maskOctetVal;

    return {
      valid,
      mask: intToIp(maskInt),
      wildcard: intToIp(wcInt),
      network: intToIp(netInt),
      broadcast: intToIp(bcastInt),
      firstUsable: cidr >= 31 ? intToIp(netInt) : intToIp((netInt + 1) >>> 0),
      lastUsable: cidr >= 31 ? intToIp(bcastInt) : intToIp((bcastInt - 1) >>> 0),
      usableHosts,
      blockSize,
      binaryOctets,
    };
  }, [sampleIp, cidr]);

  const loadNewQuestion = (mode: SubnetDrillMode) => {
    setDrillMode(mode);
    setQuestion(generateSubnetQuestion(mode));
    setAnsA('');
    setAnsB('');
    setShowWorking(false);
    setFeedback(null);
    questionStartRef.current = Date.now();
    setElapsedSec(0);
  };

  const handleCheck = (e: FormEvent) => {
    e.preventDefault();
    const normA = question.acceptNormalizer ? question.acceptNormalizer(ansA) : ansA.trim();
    const normB = ansB.trim();
    const expectedA = question.acceptNormalizer
      ? question.acceptNormalizer(question.expectedA)
      : question.expectedA;

    const aMatches =
      question.mode === 'vlsm'
        ? normA.replace('/', '') === expectedA.replace('/', '')
        : normA === expectedA;
    const bMatches = !question.expectedB || normB === question.expectedB;
    const isCorrect = aMatches && bMatches;

    const elapsedMs = Date.now() - questionStartRef.current;
    onRecordResult(question.mode, isCorrect, elapsedMs);
    setShowWorking(true);
    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? `Exact match in ${(elapsedMs / 1000).toFixed(1)}s. ${question.explanation}`
        : `Not quite (${(elapsedMs / 1000).toFixed(1)}s). Expected ${question.expectedA}${question.expectedB ? ` and ${question.expectedB}` : ''}. ${question.explanation}`,
    });
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 space-y-8">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            IPv4 / IPv6 &amp; VLSM Subnetting Studio
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Inspect the 32-bit network/host boundary interactively and drill timed CIDR, wildcard,
            VLSM, and IPv6 EUI-64 math with step-by-step working.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
          <div>
            Solved:{' '}
            <span className="font-semibold text-slate-950 dark:text-white">
              {progress.subnetSolved}/{progress.subnetAttempts}
            </span>
          </div>
          <div>
            Streak:{' '}
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {progress.subnetStreak}
            </span>{' '}
            (Best {progress.subnetBestStreak})
          </div>
        </div>
      </div>

      {/* Interactive Binary Bitmask Visualizer */}
      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-4 space-y-1.5">
            <label
              htmlFor="subnet-ip-input"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              IPv4 Address
            </label>
            <input
              id="subnet-ip-input"
              type="text"
              value={sampleIp}
              onChange={(e) => setSampleIp(e.target.value)}
              className={`w-full px-3.5 py-2.5 font-mono text-sm rounded-lg border bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                calc.valid
                  ? 'border-slate-300 dark:border-slate-700'
                  : 'border-rose-500 dark:border-rose-500'
              }`}
            />
          </div>

          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="cidr-slider"
                className="font-semibold text-slate-600 dark:text-slate-400"
              >
                CIDR Prefix Length:{' '}
                <span className="font-mono text-sky-600 dark:text-sky-400">/{cidr}</span>
              </label>
              <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                {cidr} Network Bits · {32 - cidr} Host Bits
              </span>
            </div>
            <input
              id="cidr-slider"
              type="range"
              min={8}
              max={32}
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 32-Bit Binary Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>32-Bit Binary Decomposition</span>
            <div className="flex items-center gap-4">
              <span className="text-sky-600 dark:text-sky-400 font-medium">
                Network Bits ({cidr})
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Host Bits ({32 - cidr})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {calc.binaryOctets.map((bits, octIdx) => (
              <div
                key={octIdx}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] flex items-center justify-between gap-1"
              >
                {bits.map((bit, bitIdx) => {
                  const globalIdx = octIdx * 8 + bitIdx;
                  const isNetwork = globalIdx < cidr;
                  return (
                    <span
                      key={bitIdx}
                      className={`w-6 h-7 rounded flex items-center justify-center font-mono text-xs font-semibold tabular-nums ${
                        isNetwork
                          ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {bit}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Calculated Output Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono">
          <div>
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400">
              Subnet Mask
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white tabular-nums">
              {calc.mask}
            </p>
          </div>
          <div>
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400">
              Wildcard Mask
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white tabular-nums">
              {calc.wildcard}
            </p>
          </div>
          <div>
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400">
              Network / Broadcast
            </span>
            <p className="mt-1 text-sm font-semibold text-sky-700 dark:text-sky-300 tabular-nums">
              {calc.network} / {calc.broadcast.split('.')[3]}
            </p>
          </div>
          <div>
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400">
              Usable Range ({calc.usableHosts.toLocaleString()} hosts)
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white tabular-nums">
              {calc.firstUsable} – {calc.lastUsable}
            </p>
          </div>
        </div>
      </section>

      {/* Practice Drill Generator */}
      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              Timed-Speed Subnetting Drill
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track solve latency and accuracy per category to pinpoint slow spots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTimedMode((t) => !t)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors ${
                timedMode
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                  : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timedMode ? `Timer: ${elapsedSec}s` : 'Timer Off'}</span>
            </button>

            <div className="flex flex-wrap items-center gap-1.5">
              {MODE_LABELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => loadNewQuestion(m.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    drillMode === m.id
                      ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800/70 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Per-Category Timing & Accuracy Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {MODE_LABELS.map((m) => {
            const st = progress.subnetStatsByMode?.[m.id] ?? { attempts: 0, solved: 0, totalMs: 0 };
            const acc = st.attempts > 0 ? `${Math.round((st.solved / st.attempts) * 100)}%` : '—';
            const avgSec = st.attempts > 0 ? `${(st.totalMs / st.attempts / 1000).toFixed(1)}s` : '—';
            return (
              <div
                key={m.id}
                className={`p-3 rounded-lg border text-xs ${
                  drillMode === m.id
                    ? 'border-sky-500/50 bg-sky-500/5'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0F17]'
                }`}
              >
                <div className="font-medium text-slate-700 dark:text-slate-300 truncate">
                  {m.label}
                </div>
                <div className="mt-1 font-mono tabular-nums flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>{acc}</span>
                  <span>avg {avgSec}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F17] space-y-4">
          <p className="text-base font-medium text-slate-950 dark:text-white whitespace-pre-line">
            {question.prompt}
          </p>

          <form onSubmit={handleCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label
                htmlFor="drill-ans-a"
                className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
              >
                {question.labelA}
              </label>
              <input
                id="drill-ans-a"
                type="text"
                value={ansA}
                onChange={(e) => setAnsA(e.target.value)}
                placeholder={question.placeholderA}
                className="w-full px-3 py-2 font-mono text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101622] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {question.labelB && (
              <div>
                <label
                  htmlFor="drill-ans-b"
                  className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
                >
                  {question.labelB}
                </label>
                <input
                  id="drill-ans-b"
                  type="text"
                  value={ansB}
                  onChange={(e) => setAnsB(e.target.value)}
                  placeholder={question.placeholderB ?? ''}
                  className="w-full px-3 py-2 font-mono text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101622] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0"
              >
                Check Answer
              </button>
              <button
                type="button"
                onClick={() => loadNewQuestion(drillMode)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Next</span>
              </button>
              <button
                type="button"
                onClick={() => setShowWorking((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-sky-500" />
                <span>{showWorking ? 'Hide Working' : 'Show Working'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onAskZeroSubnet(
                    `Subnetting Drill Question: "${question.prompt}". Learner current draft answers: "${ansA}" / "${ansB}". Start with a Tier 1 nudge; do not dump the final answer immediately.`,
                  )
                }
                title="Ask Zero for a Socratic nudge"
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </form>

          {showWorking && (
            <div className="p-4 rounded-lg border border-sky-500/30 bg-sky-500/5 space-y-2 text-xs text-slate-700 dark:text-slate-200">
              <div className="font-semibold text-sky-700 dark:text-sky-300">
                Step-by-Step Working
              </div>
              <ul className="space-y-1.5 font-mono leading-relaxed">
                {question.workingSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback && (
            <div
              className={`p-3.5 rounded-lg border flex items-start gap-2.5 text-sm ${
                feedback.correct
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                  : 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
              }`}
            >
              {feedback.correct ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
