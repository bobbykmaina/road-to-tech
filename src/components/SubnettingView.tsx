import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { intToIp, ipToInt, isValidIpv4, networkOf } from '../engine/iosSimulator';
import { LocalProgressState, SubnetDrillMode } from '../types/ccna';

interface SubnettingViewProps {
  progress: LocalProgressState;
  onBack: () => void;
  onRecordResult: (mode: SubnetDrillMode, correct: boolean, elapsedMs: number) => void;
  onAskPingSubnet: (contextText: string) => void;
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
  { id: 'binary-hex', label: 'Binary & Hex' },
  { id: 'network-broadcast', label: 'Network & Bcast' },
  { id: 'host-range', label: 'Usable Hosts' },
  { id: 'wildcard', label: 'Wildcard Mask' },
  { id: 'vlsm', label: 'VLSM Planning' },
  { id: 'triage-mask', label: 'Triage & Traps' },
  { id: 'summarize', label: 'Summarization' },
  { id: 'ipv6', label: 'IPv6 & EUI-64' },
];

const QUICK_PREFIX_PRESETS = [
  { cidr: 24, tag: '/24' },
  { cidr: 25, tag: '/25' },
  { cidr: 26, tag: '/26' },
  { cidr: 27, tag: '/27' },
  { cidr: 28, tag: '/28' },
  { cidr: 29, tag: '/29' },
  { cidr: 30, tag: '/30' },
  { cidr: 31, tag: '/31 P2P' },
  { cidr: 32, tag: '/32 Host' },
];

function expandIpv6Address(raw: string): string | null {
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned || cleaned.includes(':::')) return null;
  const parts = cleaned.split('::');
  if (parts.length > 2) return null;

  const left = parts[0] ? parts[0].split(':').filter((x) => x.length > 0) : [];
  const right = parts[1] ? parts[1].split(':').filter((x) => x.length > 0) : [];
  const totalProvided = left.length + right.length;
  if (parts.length === 1 && totalProvided !== 8) return null;
  if (parts.length === 2 && totalProvided >= 8) return null;

  const zerosNeeded = parts.length === 2 ? 8 - totalProvided : 0;
  const all = [...left, ...Array(zerosNeeded).fill('0'), ...right];
  if (all.length !== 8 || all.some((h) => !/^[0-9a-f]{1,4}$/.test(h))) return null;
  return all.map((h) => h.padStart(4, '0')).join(':');
}

function normalizeIpv6WithPrefix(raw: string): string {
  const cleaned = raw.trim().toLowerCase();
  const [addrPart, prefixPart] = cleaned.split('/');
  const expanded = expandIpv6Address(addrPart);
  if (!expanded) return cleaned;
  return prefixPart !== undefined ? `${expanded}/${prefixPart}` : expanded;
}

function classifyIpv4Scope(ipInt: number): { label: string; tone: 'sky' | 'amber' | 'emerald' | 'rose' } {
  const b0 = (ipInt >>> 24) & 255;
  const b1 = (ipInt >>> 16) & 255;
  if (b0 === 10) return { label: 'RFC 1918 Private (10.0.0.0/8)', tone: 'emerald' };
  if (b0 === 172 && b1 >= 16 && b1 <= 31) return { label: 'RFC 1918 Private (172.16.0.0/12)', tone: 'emerald' };
  if (b0 === 192 && b1 === 168) return { label: 'RFC 1918 Private (192.168.0.0/16)', tone: 'emerald' };
  if (b0 === 100 && b1 >= 64 && b1 <= 127) return { label: 'CGNAT Shared (RFC 6598: 100.64.0.0/10)', tone: 'amber' };
  if (b0 === 169 && b1 === 254) return { label: 'APIPA / Link-Local (169.254.0.0/16)', tone: 'amber' };
  if (b0 === 127) return { label: 'Loopback Host Testing (127.0.0.0/8)', tone: 'sky' };
  if (b0 >= 224 && b0 <= 239) return { label: 'IPv4 Multicast (224.0.0.0/4)', tone: 'sky' };
  if (b0 === 172 && b1 === 32) return { label: 'PUBLIC IPv4 (Trap: outside 172.16–172.31!)', tone: 'rose' };
  return { label: 'Public Routable IPv4 Address', tone: 'sky' };
}

function generateBinaryHexQuestion(): SubnetQuestion {
  const variant = Math.floor(Math.random() * 3);
  const commonOctets = [192, 168, 172, 198, 224, 240, 248, 252, 128, 64, 96, 17, 42, 130, 211];
  const val = commonOctets[Math.floor(Math.random() * commonOctets.length)];
  const bin = val.toString(2).padStart(8, '0');
  const hex = val.toString(16).toUpperCase().padStart(2, '0');
  const activeWeights = [128, 64, 32, 16, 8, 4, 2, 1].filter((_, idx) => bin[idx] === '1');

  if (variant === 0) {
    return {
      mode: 'binary-hex',
      prompt: `Speed Target (<10s): Convert the decimal octet ${val} into 8-bit binary and 2-digit Hex (e.g. 0x${hex}).`,
      ip: `${val}.0.0.0`,
      cidr: 8,
      labelA: '8-Bit Binary',
      labelB: 'Hex (without 0x or with 0x)',
      placeholderA: '11000000',
      placeholderB: hex,
      expectedA: bin,
      expectedB: hex,
      explanation: `${val} = ${activeWeights.join(' + ') || '0'} = ${bin} binary = 0x${hex} hex.`,
      workingSteps: [
        `1. Decompose ${val} across 128 64 32 16 8 4 2 1 -> ${activeWeights.join(' + ') || '0'}.`,
        `2. 8-bit binary: ${bin}.`,
        `3. Split into two 4-bit nibbles (${bin.slice(0, 4)} and ${bin.slice(4)}): 0x${hex}.`,
      ],
      acceptNormalizer: (v) => v.trim().replace(/\s+/g, ''),
    };
  }

  if (variant === 1) {
    return {
      mode: 'binary-hex',
      prompt: `Speed Target (<10s): Convert 8-bit binary ${bin.slice(0, 4)} ${bin.slice(4)} to decimal.`,
      ip: `${val}.0.0.0`,
      cidr: 8,
      labelA: 'Decimal Value (0-255)',
      placeholderA: String(val),
      expectedA: String(val),
      explanation: `Add the bit weights where 1 appears (${activeWeights.join(' + ') || '0'}) = ${val}.`,
      workingSteps: [
        `1. Align ${bin} beneath bit weights 128, 64, 32, 16, 8, 4, 2, 1.`,
        `2. Sum active bits: ${activeWeights.join(' + ') || '0'} = ${val}.`,
      ],
    };
  }

  return {
    mode: 'binary-hex',
    prompt: `Convert hexadecimal byte 0x${hex} (as seen in MAC / Wireshark / IPv6 nibbles) to decimal and 8-bit binary.`,
    ip: `${val}.0.0.0`,
    cidr: 8,
    labelA: 'Decimal (0-255)',
    labelB: '8-Bit Binary',
    placeholderA: String(val),
    placeholderB: bin,
    expectedA: String(val),
    expectedB: bin,
    explanation: `Upper nibble ${hex[0]} (${parseInt(hex[0], 16) * 16}) + lower nibble ${hex[1]} (${parseInt(hex[1], 16)}) = ${val} (${bin}).`,
    workingSteps: [
      `1. Convert each hex digit to a 4-bit nibble: ${hex[0]} -> ${bin.slice(0, 4)}, ${hex[1]} -> ${bin.slice(4)}.`,
      `2. Concatenate -> ${bin}.`,
      `3. Decimal: (${parseInt(hex[0], 16)} x 16) + ${parseInt(hex[1], 16)} = ${val}.`,
    ],
  };
}

function generateTriageMaskQuestion(): SubnetQuestion {
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
    // Same subnet or different subnet?
    const pairs = [
      { ipA: '172.16.18.44', ipB: '172.16.21.9', cidr: 21, same: false },
      { ipA: '172.16.18.44', ipB: '172.16.23.200', cidr: 21, same: true },
      { ipA: '192.168.10.62', ipB: '192.168.10.65', cidr: 26, same: false },
      { ipA: '192.168.10.130', ipB: '192.168.10.188', cidr: 26, same: true },
    ];
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const maskInt = (0xffffffff << (32 - p.cidr)) >>> 0;
    const maskStr = intToIp(maskInt);
    const netA = networkOf(p.ipA, maskStr);
    const netB = networkOf(p.ipB, maskStr);
    return {
      mode: 'triage-mask',
      prompt: `Triage: Can ${p.ipA}/${p.cidr} communicate directly at Layer 2 with ${p.ipB}/${p.cidr} without a router? Answer "same" or "different".`,
      ip: p.ipA,
      cidr: p.cidr,
      labelA: 'Subnet Relationship ("same" or "different")',
      placeholderA: 'same or different',
      expectedA: p.same ? 'same' : 'different',
      explanation: `Mask /${p.cidr} (${maskStr}) places ${p.ipA} in ${netA} and ${p.ipB} in ${netB} -> ${p.same ? 'same subnet' : 'different subnets (needs a router)'}.`,
      workingSteps: [
        `1. /${p.cidr} = ${maskStr}.`,
        `2. ${p.ipA} & ${maskStr} = ${netA}.`,
        `3. ${p.ipB} & ${maskStr} = ${netB}.`,
        `4. ${netA === netB ? 'Identical network IDs -> same subnet.' : 'Different network IDs -> traffic must traverse a default gateway.'}`,
      ],
      acceptNormalizer: (v) => v.trim().toLowerCase(),
    };
  }

  if (variant === 1) {
    // RFC 1918 vs Public / CGNAT / APIPA trap
    const traps = [
      { ip: '172.32.10.5', kind: 'public', why: '172.16.0.0/12 ends at 172.31.255.255, so 172.32.x.x is PUBLIC!' },
      { ip: '172.15.200.1', kind: 'public', why: '172.16.0.0/12 starts at 172.16.0.0, so 172.15.x.x is PUBLIC!' },
      { ip: '100.64.12.5', kind: 'cgnat', why: '100.64.0.0/10 (100.64–100.127) is RFC 6598 Carrier-Grade NAT.' },
      { ip: '169.254.44.10', kind: 'apipa', why: '169.254.0.0/16 is APIPA / link-local (DHCP failure fallback).' },
      { ip: '172.24.88.12', kind: 'private', why: '172.24 falls inside 172.16.0.0–172.31.255.255 (RFC 1918 Private).' },
    ];
    const t = traps[Math.floor(Math.random() * traps.length)];
    return {
      mode: 'triage-mask',
      prompt: `Address Classification: Classify ${t.ip}. Type one of: private, public, cgnat, apipa.`,
      ip: t.ip,
      cidr: 24,
      labelA: 'Scope ("private", "public", "cgnat", or "apipa")',
      placeholderA: 'private | public | cgnat | apipa',
      expectedA: t.kind,
      explanation: t.why,
      workingSteps: [
        `1. Check RFC 1918 ranges: 10.0.0.0/8, 172.16.0.0–172.31.255.255, 192.168.0.0/16.`,
        `2. Check special blocks: 100.64.0.0/10 (CGNAT) and 169.254.0.0/16 (APIPA).`,
        `3. ${t.why}`,
      ],
      acceptNormalizer: (v) => v.trim().toLowerCase(),
    };
  }

  // Host assigned invalid network or broadcast IP detection
  const badHosts = [
    { ip: '192.168.5.64/26', role: 'network', why: '64 is a multiple of block size 64 -> Network ID (unusable as host IP).' },
    { ip: '192.168.5.127/26', role: 'broadcast', why: '127 is one below next subnet 128 -> Broadcast address (unusable).' },
    { ip: '10.1.1.32/27', role: 'network', why: '32 is a multiple of block size 32 -> Network ID (unusable).' },
    { ip: '10.1.1.62/27', role: 'valid', why: 'Usable range for 10.1.1.32/27 is .33–.62 (.63 is broadcast).' },
  ];
  const pick = badHosts[Math.floor(Math.random() * badHosts.length)];
  return {
    mode: 'triage-mask',
    prompt: `A technician tries to assign ${pick.ip} to a server NIC. Is this address "valid", "network", or "broadcast"?`,
    ip: pick.ip.split('/')[0],
    cidr: Number(pick.ip.split('/')[1]),
    labelA: 'Result ("valid", "network", or "broadcast")',
    placeholderA: 'valid | network | broadcast',
    expectedA: pick.role,
    explanation: pick.why,
    workingSteps: [
      `1. Calculate the block size in the 4th octet from the CIDR mask.`,
      `2. ${pick.why}`,
    ],
    acceptNormalizer: (v) => v.trim().toLowerCase(),
  };
}

function generateSummarizeQuestion(): SubnetQuestion {
  const cases = [
    {
      subnets: ['192.168.0.0/24', '192.168.1.0/24', '192.168.2.0/24', '192.168.3.0/24'],
      summary: '192.168.0.0/22',
      steps: [
        '1. All 4 networks share 192.168 in octets 1–2.',
        '2. 3rd octets in binary: 0=00000000, 1=00000001, 2=00000010, 3=00000011.',
        '3. The first 6 bits of the 3rd octet are identical (000000xx) -> 16 + 6 = /22 -> 192.168.0.0/22.',
      ],
    },
    {
      subnets: ['172.16.16.0/24', '172.16.17.0/24', '172.16.18.0/24', '172.16.19.0/24'],
      summary: '172.16.16.0/22',
      steps: [
        '1. 4 contiguous /24 networks start at multiple of 4 (16): 16, 17, 18, 19.',
        '2. 4 x /24 steals 2 bits left from /24 -> /22.',
        '3. Summary route: 172.16.16.0/22.',
      ],
    },
    {
      subnets: ['10.20.8.0/24', '10.20.9.0/24'],
      summary: '10.20.8.0/23',
      steps: [
        '1. Two contiguous /24 networks starting on even octet 8 (00001000) and 9 (00001001).',
        '2. First 7 bits of octet 3 match -> 16 + 7 = /23.',
        '3. Summary route: 10.20.8.0/23.',
      ],
    },
    {
      subnets: ['192.168.40.0/26', '192.168.40.64/26'],
      summary: '192.168.40.0/25',
      steps: [
        '1. Two contiguous /26 blocks (.0–.63 and .64–.127) combine into one /25 block (.0–.127).',
        '2. Summary route: 192.168.40.0/25.',
      ],
    },
  ];
  const pick = cases[Math.floor(Math.random() * cases.length)];
  return {
    mode: 'summarize',
    prompt: `Summarize these contiguous routes into a single CIDR summary prefix:\n${pick.subnets.join('   ')}`,
    ip: pick.summary.split('/')[0],
    cidr: Number(pick.summary.split('/')[1]),
    labelA: 'Summary CIDR Route (e.g. 192.168.0.0/22)',
    placeholderA: 'e.g. 192.168.0.0/22',
    expectedA: pick.summary,
    explanation: `All ${pick.subnets.length} contiguous prefixes collapse cleanly into ${pick.summary}.`,
    workingSteps: pick.steps,
    acceptNormalizer: (v) => v.trim().replace(/\s+/g, ''),
  };
}

function generateIpv6Question(): SubnetQuestion {
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
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
    const euiSamples = [
      {
        mac: '00:1A:2B:3C:4D:5E',
        iid: '021a:2bff:fe3c:4d5e',
        flippedFirstByte: '02',
        origFirstByte: '00',
        steps: [
          '1. Split the 48-bit MAC in half and insert FF:FE in the center -> 001A:2BFF:FE3C:4D5E.',
          '2. Inspect the 1st byte (00 hex = 0000 0000 binary). Flip the 7th bit (U/L bit, +2): 0000 0010 = 02 hex.',
          '3. Assemble -> 021a:2bff:fe3c:4d5e (or 21a:2bff:fe3c:4d5e).',
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
        v
          .trim()
          .toLowerCase()
          .split(':')
          .map((h) => h.padStart(4, '0'))
          .join(':'),
    };
  }

  const prefixSamples = [
    {
      addr: '2001:db8:4021:0a88::55/56',
      net: '2001:db8:4021:a00::/56',
      steps: [
        '1. /56 locks the first 3 hextets (48 bits) plus the upper 8 bits (first 2 hex digits) of the 4th hextet.',
        '2. Keep 2001:db8:4021 and "0a", zeroing the rest -> 2001:db8:4021:a00::/56 (or 0a00::/56).',
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
    {
      addr: '2001:db8:ac10:0042::1/48',
      net: '2001:db8:ac10::/48',
      steps: [
        '1. /48 locks the first 3 hextets (48 bits): 2001:db8:ac10.',
        '2. Zero out hextets 4–8 and compress -> 2001:db8:ac10::/48.',
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
    placeholderA: 'e.g. 2001:db8:4021:a00::/56',
    expectedA: pick.net,
    explanation: `Zero all host bits beyond the prefix boundary and compress trailing zero hextets to get ${pick.net}.`,
    workingSteps: pick.steps,
    acceptNormalizer: normalizeIpv6WithPrefix,
  };
}

export function generateSubnetQuestion(mode: SubnetDrillMode): SubnetQuestion {
  if (mode === 'binary-hex') return generateBinaryHexQuestion();
  if (mode === 'triage-mask') return generateTriageMaskQuestion();
  if (mode === 'summarize') return generateSummarizeQuestion();
  if (mode === 'ipv6') return generateIpv6Question();

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
    const multiVlsm = Math.random() > 0.5;
    if (multiVlsm) {
      // Multi-department largest-first VLSM split
      const scenarios = [
        {
          base: '192.168.10.0/24',
          deptA: 'Dept A (100 hosts)',
          deptB: 'Dept B (45 hosts)',
          ansNet: '192.168.10.128',
          ansPrefix: '/26',
          steps: [
            '1. Order largest first: Dept A needs 100 hosts -> 128 block (/25) -> 192.168.10.0/25 (.0–.127).',
            '2. Dept B starts right after at 192.168.10.128. It needs 45 hosts -> 64 block (/26, 62 usable).',
            '3. Dept B allocation: Network 192.168.10.128, Prefix /26.',
          ],
        },
        {
          base: '172.16.50.0/24',
          deptA: 'Staff (50 hosts)',
          deptB: 'VoIP (25 hosts)',
          ansNet: '172.16.50.64',
          ansPrefix: '/27',
          steps: [
            '1. Staff needs 50 hosts -> 64 block (/26) -> 172.16.50.0/26 (.0–.63).',
            '2. VoIP starts next at 172.16.50.64 and needs 25 hosts -> 32 block (/27, 30 usable).',
            '3. VoIP allocation: Network 172.16.50.64, Prefix /27.',
          ],
        },
        {
          base: '10.10.20.0/24',
          deptA: 'WLAN (110 hosts)',
          deptB: 'Servers (20 hosts)',
          ansNet: '10.10.20.128',
          ansPrefix: '/27',
          steps: [
            '1. WLAN needs 110 hosts -> /25 block (.0–.127).',
            '2. Servers start at 10.10.20.128 and need 20 hosts -> /27 block (30 usable).',
            '3. Servers allocation: Network 10.10.20.128, Prefix /27.',
          ],
        },
      ];
      const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
      return {
        mode: 'vlsm',
        prompt: `VLSM Allocation: Starting from ${sc.base} (allocate largest first), assign ${sc.deptA} then ${sc.deptB}. What is ${sc.deptB}'s Network ID and CIDR prefix?`,
        ip: sc.base.split('/')[0],
        cidr: 24,
        labelA: 'CIDR Prefix (e.g. /26)',
        labelB: 'Network ID (e.g. 192.168.10.128)',
        placeholderA: '/26',
        placeholderB: '192.168.10.128',
        expectedA: sc.ansPrefix,
        expectedB: sc.ansNet,
        explanation: `After allocating ${sc.deptA}, ${sc.deptB} takes ${sc.ansNet}${sc.ansPrefix}.`,
        workingSteps: sc.steps,
      };
    }

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

  // Include /17 through /30 so 3rd-octet math (/17-/23) is genuinely drilled alongside /24-/30
  const cidr = 17 + Math.floor(Math.random() * 14);
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
      placeholderA: 'e.g. 172.16.32.0',
      placeholderB: 'e.g. 172.16.47.255',
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
  onAskPingSubnet,
}: SubnettingViewProps) {
  const [sampleIp, setSampleIp] = useState('192.168.10.75');
  const [cidr, setCidr] = useState(26);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const [drillMode, setDrillMode] = useState<SubnetDrillMode>('binary-hex');
  const [question, setQuestion] = useState<SubnetQuestion>(() =>
    generateSubnetQuestion('binary-hex'),
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

    const bytes = [0, 1, 2, 3].map((octIdx) => (ipInt >>> (24 - octIdx * 8)) & 255);
    const binaryOctets = bytes.map((byte) => byte.toString(2).padStart(8, '0').split(''));
    const hexOctets = bytes.map((byte) => `0x${byte.toString(16).toUpperCase().padStart(2, '0')}`);

    const interestingOctet = Math.min(3, Math.floor(cidr / 8));
    const maskOctetVal = (maskInt >>> (24 - interestingOctet * 8)) & 255;
    const blockSize = 256 - maskOctetVal;
    const scope = classifyIpv4Scope(ipInt);

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
      interestingOctet: interestingOctet + 1,
      maskOctetVal,
      binaryOctets,
      hexOctets,
      scope,
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
    const normB = ansB.trim().toUpperCase().replace(/^0X/, '');
    const expectedA = question.acceptNormalizer
      ? question.acceptNormalizer(question.expectedA)
      : question.expectedA;

    const aMatches =
      question.mode === 'vlsm'
        ? normA.replace('/', '') === expectedA.replace('/', '')
        : normA === expectedA;
    const expectedB = question.expectedB?.toUpperCase() ?? '';
    const bMatches = !question.expectedB || normB === expectedB;
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
            Inspect the 32-bit binary/hex boundary, RFC address scopes, and block sizes interactively,
            then train across 8 timed CCNA drill categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => setShowCheatSheet((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-sans font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>{showCheatSheet ? 'Hide Cheat Sheet' : 'Reference Cheat Sheet'}</span>
          </button>
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

      {/* Collapsible CCNA Cheat Sheet */}
      {showCheatSheet && (
        <section className="p-5 rounded-xl border border-sky-500/30 bg-sky-500/5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="space-y-1.5">
              <div className="font-sans font-semibold text-slate-900 dark:text-white">
                Powers of 2 &amp; Valid Mask Octets
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Bits: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Masks: 128 · 192 · 224 · 240 · 248 · 252 · 254 · 255
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-sans font-semibold text-slate-900 dark:text-white">
                CIDR /24–/32 Block Size &amp; Wildcard
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                /25:128 (.127) · /26:64 (.63) · /27:32 (.31)
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                /28:16 (.15) · /29:8 (.7) · /30:4 (.3) · /31:2 P2P
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-sans font-semibold text-slate-900 dark:text-white">
                Special IPv4 &amp; IPv6 Prefixes
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                RFC1918: 10/8, 172.16–31/12, 192.168/16
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                CGNAT: 100.64/10 · APIPA: 169.254/16 · LLA: fe80::/10
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Binary Bitmask Visualizer */}
      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-4 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="subnet-ip-input"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                IPv4 Address
              </label>
              <span
                className={`text-[11px] font-mono font-semibold ${
                  calc.scope.tone === 'emerald'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : calc.scope.tone === 'amber'
                      ? 'text-amber-600 dark:text-amber-400'
                      : calc.scope.tone === 'rose'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-sky-600 dark:text-sky-400'
                }`}
              >
                {calc.scope.label}
              </span>
            </div>
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
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label
                htmlFor="cidr-slider"
                className="font-semibold text-slate-600 dark:text-slate-400"
              >
                CIDR Prefix Length:{' '}
                <span className="font-mono text-sky-600 dark:text-sky-400">/{cidr}</span>
              </label>
              <div className="flex flex-wrap items-center gap-1">
                {QUICK_PREFIX_PRESETS.map((p) => (
                  <button
                    key={p.cidr}
                    type="button"
                    onClick={() => setCidr(p.cidr)}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                      cidr === p.cidr
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {p.tag}
                  </button>
                ))}
              </div>
              <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                Octet #{calc.interestingOctet} Block Size: 256 - {calc.maskOctetVal} ={' '}
                <strong className="text-slate-900 dark:text-white">{calc.blockSize}</strong>
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

        {/* 32-Bit Binary + Hex Decomposition */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              32-Bit Binary &amp; Hex Decomposition:{' '}
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {calc.hexOctets.join('.')}
              </span>
            </span>
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
              Usable Range ({calc.usableHosts.toLocaleString()} {cidr === 31 ? 'P2P' : 'hosts'})
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white tabular-nums">
              {calc.firstUsable} – {calc.lastUsable}
            </p>
          </div>
        </div>
      </section>

      {/* Practice Drill Generator */}
      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] space-y-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Timed-Speed Subnetting Drill
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                8 CCNA categories including Binary/Hex speed, Multi-Dept VLSM, Triage Traps, and Summarization.
              </p>
            </div>

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
          </div>

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

        {/* Per-Category Timing & Accuracy Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {MODE_LABELS.map((m) => {
            const st = progress.subnetStatsByMode?.[m.id] ?? { attempts: 0, solved: 0, totalMs: 0 };
            const acc = st.attempts > 0 ? `${Math.round((st.solved / st.attempts) * 100)}%` : '—';
            const avgSec = st.attempts > 0 ? `${(st.totalMs / st.attempts / 1000).toFixed(1)}s` : '—';
            return (
              <div
                key={m.id}
                className={`p-2.5 rounded-lg border text-xs ${
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
                  <span>{avgSec}</span>
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
                  onAskPingSubnet(
                    `Subnetting Drill Question: "${question.prompt}". Learner current draft answers: "${ansA}" / "${ansB}". Start with Step 1 (Predict & Nudge); do not spoil the final answer right away.`,
                  )
                }
                title="Ask Ping for a Socratic nudge"
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
