import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT1_B_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.core.ip.ipv6-addressing': {
    id: 'ccna.core.ip.ipv6-addressing',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Infrastructure & IPv6',
    topicTitle: '1.4 / 1.8–1.9 Troubleshoot IPv6 Addressing & Prefix Sizing',
    code: '1.4.1',
    title: 'IPv6 Compression, GUA/ULA/Link-Local/Anycast, SLAAC & Modified EUI-64',
    readMinutes: 14,
    prerequisites: ['0.1.2'],
    versionScope: 'shared',
    v11ExamTopics: ['1.8', '1.9'],
    v20ExamTopics: ['1.4'],

    learningObjectives: [
      'Compress and expand 128-bit IPv6 addresses cleanly using the two zero-compression rules (leading-zero omission + single `::`).',
      'Classify IPv6 address types on sight: Global Unicast (`2000::/3`), Unique Local (`FC00::/7`), Link-Local (`FE80::/10`), Multicast (`FF00::/8`), and Anycast.',
      'Calculate a 64-bit Interface ID using Modified EUI-64 (inserting `FFFE` and inverting the 7th U/L bit).',
      'Explain how IPv6 hosts learn addresses and gateways without ARP or broadcast via NDP (RS/RA/NS/NA) and SLAAC.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why IPv6 Routing Works Across `FE80::` Link-Local Next Hops',
      narrative:
        'A network engineer opens `show ipv6 route` on an enterprise router and sees `S  ::/0 [1/0] via FE80::1, GigabitEthernet0/0`—with no global IPv6 address listed as the next hop! Beginners often panic thinking `FE80::` is broken, or they accidentally write `::` twice when typing an IPv6 address on IOS and get `% Invalid input`. Mastering IPv6 compression rules, Link-Local vs. Global Unicast, and EUI-64 unlocks modern dual-stack networks and OSPFv3.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Global Phone Numbers vs. Building Intercoms (Without Shouting Broadcasts)',
      analogy:
        'An IPv6 **Global Unicast Address (`2000::/3`)** is like an international phone number—unique worldwide and routable everywhere. A **Link-Local Address (`FE80::/10`)** is like an apartment’s internal door buzzer: valid ONLY on that one hallway (wire), never forwarded past a router, yet automatically active on every IPv6 interface so routers can talk OSPF and deliver Neighbor Discovery messages even before global prefixes exist. Unlike IPv4, IPv6 has **zero broadcasts**—instead, targeted **Multicast (`FF00::/8`)** reaches only devices listening to a specific group.',
      technicalDefinition:
        'IPv6 expands address space to 128 bits written as eight 16-bit hexadecimal hextets separated by colons (`x:x:x:x:x:x:x:x`), usually split `/64` Network Prefix + `64`-bit Interface ID. Address resolution and gateway discovery run over ICMPv6 Neighbor Discovery Protocol (NDP) rather than IPv4 ARP.',
      paragraphs: [
        'Two strict rules govern IPv6 shortening: **(1) Drop leading zeros** inside any 16-bit hextet (`0db8` -> `db8`, `0000` -> `0`, never drop trailing zeros like `1000` -> `1`!), and **(2) Replace ONE contiguous run of all-zero hextets with `::`**. Never use `::` twice in one address, because a parser would not know how many zero groups belong in each gap.',
        'Recognize the five core IPv6 prefixes immediately: **Global Unicast (GUA)** = `2000::/3` (starts with `2` or `3`), **Unique Local (ULA)** = `FC00::/7` (usually `FD00::/8`, private internal routing), **Link-Local (LLA)** = `FE80::/10` (auto-created on every IPv6 port, mandatory for routing protocols and NDP), **Multicast** = `FF00::/8` (`FF02::1` all nodes, `FF02::2` all routers, `FF02::5` OSPF), **Loopback** = `::1/128`, and **Unspecified** = `::/128`.',
        '**Anycast** uses a standard Global Unicast IP assigned to *multiple* geographically distributed servers—routers simply deliver packets to the topologically nearest instance. Meanwhile, **Modified EUI-64** builds a 64-bit Interface ID automatically from a 48-bit MAC address by splitting the MAC in half, inserting **`FFFE`** in the middle, and flipping the **7th bit from the left** (Universal/Local bit, `2` bit of the first byte).',
      ],
    },

    deepDive: {
      intro: 'Practice compressing IPv6, building Modified EUI-64, and tracing Stateless Address Autoconfiguration (SLAAC).',
      steps: [
        {
          step: 'Rule 1 & 2',
          title: 'Shortening `2001:0db8:0000:0000:0042:0000:0000:0001`',
          explanation:
            'Drop leading zeros -> `2001:db8:0:0:42:0:0:1`. Both zero runs are 2 hextets long; compress the first (or longest) run once with `::` -> `2001:db8::42:0:0:1`.',
        },
        {
          step: 'EUI-64 Math',
          title: 'Convert MAC `001A.2B3C.4D5E` to Interface ID',
          explanation:
            '1) Split: `001A:2B` and `3C:4D5E`. 2) Insert `FFFE`: `001A:2BFF:FE3C:4D5E`. 3) Flip 7th bit of first byte (`0x00` = `0000 0000` -> `0000 0010` = `0x02`): Result = `021A:2BFF:FE3C:4D5E`!',
        },
        {
          step: 'NDP & SLAAC',
          title: 'How Hosts Auto-Configure Without DHCPv6',
          explanation:
            'Host boots -> creates `FE80::...` link-local -> runs DAD (Duplicate Address Detection) -> sends Router Solicitation (`RS` to `FF02::2`) -> Router replies Router Advertisement (`RA` with `/64` prefix + default gateway `FE80::...`) -> Host forms full `/64` GUA!',
        },
        {
          step: 'Prefix Sizing',
          title: 'Subnets Inside a `/48` Enterprise Allocation',
          explanation:
            'ISPs typically assign a `/48` site block while LANs always use `/64`—leaving **16 bits (`65,536` `/64` subnets)** (`2001:db8:acad:0000::/64` through `:ffff::/64`)!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Modified EUI-64 Bit Flip & SLAAC Router Advertisement Exchange',
        asciiFallback: `MODIFIED EUI-64 FROM MAC 001A:2B3C:4D5E:
  [00 1A : 2B]  +  [FF:FE]  +  [3C : 4D 5E]
   ^ 0x00 = 0000 00[0]0  --> flip 7th bit --> 0000 00[1]0 = 0x02
  Result: 021A:2BFF:FE3C:4D5E  (Link-Local: FE80::21A:2BFF:FE3C:4D5E)

SLAAC AUTO-CONFIG:
  [Host] --- ICMPv6 RS (Dst FF02::2) ---> [R1]
  [Host] <-- ICMPv6 RA (Prefix 2001:DB8:1::/64 + Gateway FE80::1) --- [R1]`,
      },
      workedExample: {
        title: 'Configuring Dual-Stack IPv6 + EUI-64 on Cisco IOS',
        context: 'You need `G0/0` on R1 to route `2001:db8:10:1::/64` using link-local `FE80::1` and auto-generated EUI-64.',
        steps: [
          'Enable IPv6 routing globally first: `ipv6 unicast-routing` (without this, the router acts only as a host and stops sending RAs!).',
          'Under `interface GigabitEthernet0/0`: configure predictable link-local `ipv6 address fe80::1 link-local`.',
          'Assign global unicast with EUI-64: `ipv6 address 2001:db8:10:1::/64 eui-64`.',
          'Verify with `show ipv6 interface brief` and `show ipv6 neighbors` (replaces `show ip arp`).',
        ],
        outcome: 'Hosts on `G0/0` receive RA prefixes automatically and reach `FE80::1` as their IPv6 default gateway.',
      },
    },

    iosCliGuide: {
      intro: 'Verify global/link-local addresses, Neighbor Discovery cache, and `ipv6 unicast-routing` on IOS.',
      commands: [
        {
          title: 'Verify IPv6 Interfaces and NDP Neighbor Cache',
          promptAndCommand: 'R1# show ipv6 interface brief',
          output: `GigabitEthernet0/0     [up/up]
    FE80::1
    2001:DB8:10:1::21A:2BFF:FE3C:4D5E`,
          lineByLine: [
            { segment: 'FE80::1', meaning: 'Explicit clean link-local address used for gateways and OSPFv3 next hops.' },
            { segment: '2001:DB8:10:1::21A:2BFF:FE3C:4D5E', meaning: 'Global Unicast `/64` address with EUI-64 interface ID.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show running-config | include ipv6 unicast-routing',
        healthyLabel: 'IPv6 Routing Enabled (`ipv6 unicast-routing`)',
        healthyOutput: `ipv6 unicast-routing`,
        brokenLabel: 'Forgot Global `ipv6 unicast-routing` Command',
        brokenOutput: `(empty output — router drops transit IPv6 packets & sends no RAs!)`,
        diagnosis:
          'Cisco IOS routers have IPv6 packet forwarding disabled by default even after assigning `ipv6 address` on interfaces. Always configure `ipv6 unicast-routing`.',
      },
    },

    commonTraps: [
      {
        trap: 'Writing `::` twice in one IPv6 address (e.g., `2001::10::5`).',
        reality: 'Illegal syntax—`::` can appear **at most once** per address.',
      },
      {
        trap: 'Deleting trailing zeros like turning `2001:0db8:0100::1` into `2001:db8:1::1`.',
        reality: 'Only **leading** zeros drop (`0100` -> `100`, NEVER `1`!).',
      },
      {
        trap: 'Forgetting `ipv6 unicast-routing` on a Cisco router.',
        reality: 'Without `ipv6 unicast-routing`, the router neither routes IPv6 packets nor sends Router Advertisements for SLAAC.',
      },
      {
        trap: 'Adding `FFFE` without flipping the 7th U/L bit during EUI-64 calculations.',
        reality: 'Check the first byte carefully (`00 -> 02`, `02 -> 00`, `AA -> A8`).',
      },
    ],

    keyTerms: [
      {
        term: 'Global Unicast Address (GUA)',
        shortDef: 'Publicly routable IPv6 address starting with `2000::/3`.',
        fullDef: 'Equivalent to public IPv4 addresses—uniquely routed across the global IPv6 internet.',
      },
      {
        term: 'Link-Local Address (FE80::/10)',
        shortDef: 'Non-routable local-link IPv6 address required on every IPv6-enabled interface.',
        fullDef: 'Automatically generated (or manually set like `FE80::1`), used for NDP, default gateways, and OSPFv3 next hops.',
      },
      {
        term: 'Unique Local Address (ULA)',
        shortDef: 'Private internal IPv6 range (`FC00::/7`, typically `FD00::/8`).',
        fullDef: 'Used for private site-local routing without internet reachability, similar in concept to RFC 1918.',
      },
      {
        term: 'Modified EUI-64',
        shortDef: 'Method generating a 64-bit IPv6 Interface ID from a 48-bit MAC + `FFFE` + 7th-bit flip.',
        fullDef: 'Splits the MAC in two, inserts `FFFE`, and inverts the Universal/Local bit (2nd bit from right of first byte).',
      },
    ],

    checkQuestions: [
      {
        id: 'c14-q1',
        prompt: 'What is the shortest valid compressed form of `2001:0db8:0000:0000:0010:0000:0000:0005`?',
        options: [
          '2001:db8::10:0:0:5',
          '2001:db8::10::5',
          '2001:db8::1:0:0:5',
          '2001:0db8::10:0:0:5',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Drop leading zeros (`0010` -> `10`), compress one zero run with `::`, and leave the second zero run as `:0:0:`.',
          'Incorrect: `::` cannot appear twice.',
          'Incorrect: Dropped a trailing zero (`0010` became `1` instead of `10`).',
          'Incorrect: Leading zero in `0db8` was not dropped.',
        ],
        takeaway: 'Drop leading zeros only; use `::` at most once.',
      },
      {
        id: 'c14-q2',
        prompt: 'Convert the 48-bit MAC address `00:24:9B:10:20:30` into a 64-bit Modified EUI-64 Interface ID.',
        options: [
          '0224:9BFF:FE10:2030',
          '0024:9BFF:FE10:2030',
          '0224:9BFE:FF10:2030',
          'FE80:0224:9BFF:FE10',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Insert `FFFE` in the middle (`0024:9BFF:FE10:2030`) and flip the 7th bit (`0x00` -> `0x02`).',
          'Incorrect: Forgot to invert the 7th U/L bit (`00` -> `02`).',
          'Incorrect: Inserted `FEFF` instead of `FFFE`.',
          'Incorrect: Prepended `FE80` into the 64-bit Interface ID itself.',
        ],
        takeaway: 'Modified EUI-64 = split MAC + insert `FFFE` + flip 7th bit from left.',
      },
      {
        id: 'c14-q3',
        prompt: 'Which IPv6 address type is assigned to multiple servers across regions so routers deliver traffic to the topologically closest server?',
        options: ['Anycast', 'Multicast (`FF02::1`)', 'Link-Local (`FE80::/10`)', 'Loopback (`::1`)'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Anycast configures an identical unicast address on multiple nodes; routing metrics forward packets to the nearest one.',
          'Incorrect: Multicast delivers to ALL group members simultaneously.',
          'Incorrect: Link-local stays on one local segment.',
          'Incorrect: `::1` tests the local host stack only.',
        ],
        takeaway: 'Anycast = one-to-nearest delivery using shared Global Unicast IPv6 addresses.',
      },
      {
        id: 'c14-q4',
        prompt: 'An engineer assigns `ipv6 address 2001:db8:1::1/64` on R1 `G0/0` and `2001:db8:2::1/64` on `G0/1`, yet R1 refuses to route IPv6 packets between subnets. Which global command was missed?',
        options: [
          'ipv6 unicast-routing',
          'ip routing',
          'ipv6 enable',
          'no shutdown',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `ipv6 unicast-routing` enables the IPv6 forwarding engine globally on Cisco IOS routers.',
          'Incorrect: `ip routing` is for IPv4.',
          'Incorrect: `ipv6 enable` enables link-local IPv6 on an interface, not global routing.',
          'Incorrect: Interface admin state alone does not turn on global IPv6 routing.',
        ],
        takeaway: 'Always configure `ipv6 unicast-routing` before IPv6 routing or SLAAC works on IOS.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Solve IPv6 Compression & EUI-64 Drills in Subnetting Lab',
      targetTab: 'subnetting',
      instructions: [
        'Open the Subnetting tab and switch Mode to `IPv6 Compression & Prefix`.',
        'Complete 5 consecutive drills covering `::` compression, EUI-64 bit flips, and `/48` -> `/64` subnetting.',
      ],
      verificationCheck: 'Score 5/5 on IPv6 mode drills.',
    },

    summaryBullets: [
      'IPv6 uses 128 bits (eight 16-bit hex groups); omit leading zeros and use `::` at most once per address.',
      'Core prefixes: GUA `2000::/3`, ULA `FC00::/7`, Link-Local `FE80::/10`, Multicast `FF00::/8`, Loopback `::1/128`.',
      'Anycast delivers to the nearest node sharing a unicast IP; IPv6 uses zero broadcasts.',
      'Modified EUI-64 inserts `FFFE` in the middle of the MAC and flips the 7th U/L bit.',
      'ICMPv6 NDP (RS/RA/NS/NA) handles SLAAC and Layer 2 address resolution; routers require `ipv6 unicast-routing`.',
    ],

    sourcesToVerify: [
      'RFC 4291 — IP Version 6 Addressing Architecture',
      'RFC 5952 — A Recommendation for IPv6 Address Text Representation',
    ],
  },

  'ccna.core.wl.wireless-principles': {
    id: 'ccna.core.wl.wireless-principles',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Infrastructure & Wireless',
    topicTitle: '1.5 / 1.11 Explain Wireless Principles',
    code: '1.5.1',
    title: 'Wi-Fi Bands (2.4/5/6 GHz), Non-Overlapping Channels, RF Interference & Security',
    readMinutes: 13,
    prerequisites: ['0.2.1'],
    versionScope: 'shared',
    v11ExamTopics: ['1.11'],
    v20ExamTopics: ['1.5'],

    learningObjectives: [
      'Compare 2.4 GHz, 5 GHz, and 6 GHz bands by channel width, range, wall penetration, and non-overlapping channel counts.',
      'Explain why only channels **1, 6, and 11** are non-overlapping in 2.4 GHz (North America) and how co-channel interference degrades throughput.',
      'Identify RF phenomena (reflection, refraction, absorption, scattering, attenuation) and physical interference sources.',
      'Compare Wi-Fi encryption standards (Open/WEP vs. WPA2-AES/CCMP vs. WPA3-SAE) and Personal (PSK) vs. Enterprise (802.1X/RADIUS).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Setting 2.4 GHz Radios to Channel 3 & Full Power Breaks Conference Room Wi-Fi',
      narrative:
        'A facility puts 12 Access Points on full power, picks Channel 3 because "1 and 6 sounded crowded," and wonders why laptops drop Zoom calls despite showing 5 bars of signal! In 2.4 GHz, Channel 3 overlaps BOTH Channel 1 and Channel 6, forcing every AP to fight overlapping noise instead of sharing airtime cleanly. Understanding channels, RSSI/SNR, and WPA2/WPA3 turns wireless guesswork into disciplined RF engineering.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Radio Stations on Narrow vs. Wide Highways',
      analogy:
        '2.4 GHz Wi-Fi is like a short 3-lane bridge (**Channels 1, 6, 11**) where cars travel slowly through walls (**longer range**) yet share space with microwaves, Bluetooth, and neighboring offices (**crowded spectrum**). Putting an AP on Channel 3 parks a truck sideways across Lanes 1 and 6! **5 GHz** opens a 20+ lane expressway with zero microwave interference and wider 40/80 MHz lanes, though walls absorb it faster (**shorter cell radius**). **6 GHz (Wi-Fi 6E/7)** adds a brand-new multi-gigabit highway strictly for modern WPA3 clients.',
      technicalDefinition:
        'IEEE 802.11 wireless LANs operate over unlicensed ISM/U-NII RF spectrum using half-duplex CSMA/CA airtime arbitration; 2.4 GHz provides three 20 MHz non-overlapping channels (1, 6, 11), while 5 GHz and 6 GHz offer two dozen+ non-overlapping channels, optional channel bonding, and modern CCMP/GCMP + SAE/802.1X security.',
      paragraphs: [
        'In **2.4 GHz**, channels are spaced just 5 MHz apart while each Wi-Fi channel occupies 20–22 MHz of bandwidth. That means only **Channels 1, 6, and 11** do not overlap each other! Picking Channel 2, 3, 4, or 8 creates **Adjacent-Channel Interference (ACI)**—corrupting transmissions on neighboring APs without even coordinating properly.',
        'In **5 GHz** (802.11a/n/ac/ax), every 20 MHz channel is non-overlapping (20+ channels depending on region, though DFS channels 52–144 must yield to weather/airport radar). **6 GHz** mandates **WPA3** security—legacy Open or WPA2-only devices cannot join 6 GHz.',
        'For security: **WPA2-Personal (PSK)** uses a shared passphrase with **AES-CCMP** encryption. **WPA2/WPA3-Enterprise** uses **802.1X / EAP + RADIUS** so every user gets unique credentials and per-session keys. **WPA3-Personal** replaces vulnerable PSK handshakes with **SAE (Simultaneous Authentication of Equals)** to block offline dictionary cracking.',
      ],
    },

    deepDive: {
      intro: 'Compare RF bands, interference behaviors, and wireless encryption tiers cleanly.',
      steps: [
        {
          step: '1. Band Comparison',
          title: '2.4 GHz vs 5 GHz vs 6 GHz',
          explanation:
            '2.4 GHz: 3 non-overlapping channels (1, 6, 11), best penetration, slowest & noisiest. 5 GHz: ~24 non-overlapping 20 MHz channels, higher throughput, shorter range. 6 GHz (Wi-Fi 6E/7): ultra-clean wide channels (80/160 MHz), requires WPA3.',
        },
        {
          step: '2. RF Physics',
          title: 'Attenuation, Absorption, Reflection & Scattering',
          explanation:
            'Concrete/water/elevator shafts **absorb** signal (**attenuation**); metal/glass causes **reflection** (multipath); edges cause **diffraction/scattering**. Measure usable signal via **SNR (Signal-to-Noise Ratio)**, targeting ≥ 20–25 dB and minimum cell-edge **RSSI of `-67 dBm`** (especially for enterprise voice/video!) against a typical `-92 dBm` noise floor.',
        },
        {
          step: '3. SSIDs, BSSIDs & Roaming',
          title: 'ESSID vs BSSID',
          explanation:
            '**SSID** is the human-readable network name (`Corp-WiFi`); **BSSID** is the exact radio MAC address of a single AP radio; an **ESS** links multiple APs broadcasting the same SSID so clients roam smoothly.',
        },
        {
          step: '4. Wireless Security Modes',
          title: 'PSK vs 802.1X & WPA2 vs WPA3',
          explanation:
            'Never deploy WEP/TKIP. Use **WPA2-AES-CCMP** or **WPA3-SAE** for PSK/IoT, and **WPA2/WPA3-Enterprise (802.1X + RADIUS)** + Management Frame Protection (802.11w) for corporate staff.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '2.4 GHz Non-Overlapping Channels (1, 6, 11) vs. 5 GHz Clean Spacing',
        asciiFallback: `2.4 GHz SPECTRUM (20/22 MHz wide per channel, 5 MHz spacing):
  [=== Ch 1 ===]    [=== Ch 6 ===]    [=== Ch 11 ===]
  2401-2423 MHz     2426-2448 MHz     2451-2473 MHz   (Ch 3 overlaps BOTH 1 & 6!)

5 GHz SPECTRUM (20 MHz clean non-overlapping channels):
  [Ch 36] [Ch 40] [Ch 44] [Ch 48] | [DFS Ch 52..144] | [Ch 149] [Ch 153] [Ch 157] [Ch 161]`,
      },
      workedExample: {
        title: 'Fixing Sticky Clients & Interference in an Office Floor',
        context:
          'Users walk from the lobby to Conference Room B, yet laptops stay stuck on the distant Lobby AP (`-83 dBm`, 5 Mbps) while sitting 3 meters under AP-ConfB.',
        steps: [
          'Check AP transmit power: all APs were set to maximum `20 dBm`, blasting too far across floors.',
          'Check 2.4 GHz channel plan: Lobby AP used Ch 2 and ConfB AP used Ch 4 (severe Adjacent-Channel Interference!).',
          'Set 2.4 GHz strictly to `1, 6, 11` (or disable 2.4 GHz on alternating dense APs), lower Tx power so cells overlap ~15–20% cleanly, and enable 5 GHz band steering.',
        ],
        outcome: 'Clients roam cleanly to the nearest AP (`-58 dBm`) with zero adjacent-channel interference.',
      },
    },

    iosCliGuide: {
      intro: 'Inspect wireless radio states, connected BSSIDs, and WLC/AP operational summaries on Cisco platforms.',
      commands: [
        {
          title: 'Inspect Autonomous/Controller AP Radio Channels & Client Associations',
          promptAndCommand: 'WLC# show ap dot11 24ghz summary',
          output: `AP Name         Mac Address        Slot  Admin   Oper    Chan   TxPower
AP-Lobby-01     aabb.cc11.2200     0     Enabled Up      1      4/8 (14 dBm)
AP-ConfB-02     aabb.cc11.2210     0     Enabled Up      6      4/8 (14 dBm)
AP-Sales-03     aabb.cc11.2220     0     Enabled Up      11     4/8 (14 dBm)`,
          lineByLine: [
            { segment: 'Chan 1 / 6 / 11', meaning: 'Clean non-overlapping 2.4 GHz channel reuse pattern across adjacent rooms.' },
            { segment: 'TxPower 4/8 (14 dBm)', meaning: 'Balanced medium transmit power preventing sticky-client roaming delays.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show wlan summary',
        healthyLabel: 'Corporate Enterprise Security (802.1X + AES)',
        healthyOutput: `1   Corp-Staff     Corp-Staff   Enabled   [WPA2][Auth(802.1X)][AES]`,
        brokenLabel: 'Deprecated Weak Security (WEP/TKIP) or Open Corporate SSID',
        brokenOutput: `1   Corp-Staff     Corp-Staff   Enabled   [WPA][TKIP]`,
        diagnosis:
          'WPA/TKIP and WEP are cryptographically broken and cap Wi-Fi rates at 54 Mbps (802.11a/g speeds). Upgrade to WPA2-AES (`CCMP`) or WPA3 (`SAE` / Enterprise).',
      },
    },

    commonTraps: [
      {
        trap: 'Putting neighboring 2.4 GHz APs on Channels 1, 3, 5, 7, 9 to "use more channels."',
        reality: 'Every odd channel in between overlaps heavily; ONLY **1, 6, and 11** provide clean non-overlapping 2.4 GHz channels.',
      },
      {
        trap: 'Cranking AP transmit power to 100% to fix dead spots.',
        reality: 'High AP power creates asymmetric links (the laptop hears the AP, yet the laptop’s weaker radio cannot reach back) and causes sticky clients + co-channel interference.',
      },
      {
        trap: 'Assuming 5 GHz penetrates concrete walls better than 2.4 GHz.',
        reality: 'Higher frequencies (5 GHz, 6 GHz) attenuate faster through walls—they offer more clean channels and higher speeds at shorter range.',
      },
      {
        trap: 'Thinking WPA2-Personal protects users from coworkers sharing the same PSK.',
        reality: 'Only **WPA2/WPA3-Enterprise (802.1X)** gives per-user authentication and unique session encryption keys.',
      },
    ],

    keyTerms: [
      {
        term: 'Non-Overlapping Channels (1, 6, 11)',
        shortDef: 'The only three 20 MHz 2.4 GHz Wi-Fi channels that do not collide spectrally.',
        fullDef: 'Centered at 2412, 2437, and 2462 MHz with 25 MHz separation—preventing adjacent-channel corruption.',
      },
      {
        term: 'SNR (Signal-to-Noise Ratio)',
        shortDef: 'Difference in decibels between desired signal (RSSI) and background RF noise.',
        fullDef: 'Strong RSSI (`-55 dBm`) is useless if noise is `-60 dBm` (`5 dB SNR`); reliable enterprise data/voice targets ≥ 20–25 dB SNR.',
      },
      {
        term: 'CSMA/CA',
        shortDef: 'Carrier Sense Multiple Access with Collision Avoidance used on half-duplex Wi-Fi.',
        fullDef: 'Radios listen for clear airtime and wait random backoff timers before transmitting because Wi-Fi cannot detect collisions while transmitting.',
      },
      {
        term: 'WPA3-SAE',
        shortDef: 'Simultaneous Authentication of Equals replacing vulnerable WPA2-PSK 4-way handshake.',
        fullDef: 'Defeats offline dictionary attacks and enforces forward secrecy + Protected Management Frames (802.11w).',
      },
    ],

    checkQuestions: [
      {
        id: 'c15-q1',
        prompt: 'Three Access Points sit in adjacent 2.4 GHz coverage cells. Which channel set completely avoids overlapping frequency interference?',
        options: [
          'Channels 1, 6, and 11',
          'Channels 1, 4, and 8',
          'Channels 2, 7, and 10',
          'Channels 1, 2, and 3',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Channels 1, 6, and 11 are spaced 25 MHz apart, avoiding overlap for 20/22 MHz Wi-Fi signals.',
          'Incorrect: Channel 4 overlaps Channel 1 heavily.',
          'Incorrect: Channels 7 and 10 overlap each other.',
          'Incorrect: Channels 1, 2, and 3 overlap directly on top of one another.',
        ],
        takeaway: 'In 2.4 GHz, ALWAYS pick from 1, 6, and 11.',
      },
      {
        id: 'c15-q2',
        prompt: 'Why is 5 GHz preferred over 2.4 GHz in high-density enterprise offices?',
        options: [
          '5 GHz provides ~24 non-overlapping 20 MHz channels with far less microwave/Bluetooth interference.',
          '5 GHz travels three times farther through concrete walls.',
          '5 GHz uses full-duplex Ethernet instead of CSMA/CA.',
          '5 GHz requires no security configuration.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Many clean non-overlapping channels let dense APs operate without crushing each other’s airtime.',
          'Incorrect: 2.4 GHz penetrates walls farther than 5 GHz.',
          'Incorrect: Wi-Fi on both bands operates half-duplex over shared RF.',
          'Incorrect: Both require WPA2/WPA3.',
        ],
        takeaway: '5 GHz = clean high capacity and dense channel reuse; 2.4 GHz = longer reach, noisy, only 3 channels.',
      },
      {
        id: 'c15-q3',
        prompt: 'What key security improvement does WPA3-Personal (SAE) provide over WPA2-Personal (PSK)?',
        options: [
          'Prevents attackers from capturing a handshake and running offline dictionary password cracking.',
          'Eliminates the need for any SSID name.',
          'Forces every client to install a physical smartcard.',
          'Runs unencrypted over UDP port 69.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SAE (Dragonfly key exchange) defeats offline brute-force guessing against captured 4-way handshakes.',
          'Incorrect: SSIDs are still broadcast normally.',
          'Incorrect: Smartcards/certificates belong to EAP-TLS Enterprise.',
          'Incorrect: WPA3 encrypts frames with AES-CCMP/GCMP.',
        ],
        takeaway: 'WPA3-SAE stops offline dictionary cracking and requires Protected Management Frames.',
      },
      {
        id: 'c15-q4',
        prompt: 'An AP radio reports RSSI `-65 dBm` and background Noise `-90 dBm`. What is the SNR, and is it healthy for voice/data?',
        options: [
          'SNR is 25 dB — healthy for enterprise voice and high-rate data.',
          'SNR is -155 dB — completely unusable.',
          'SNR is 5 dB — severely degraded.',
          'SNR cannot be computed from dBm values.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `SNR = Signal - Noise = -65 - (-90) = 25 dB`, meeting the ≥25 dB voice/enterprise guideline.',
          'Incorrect: Subtract noise from signal (`-65 - (-90)`), do not add.',
          'Incorrect: Arithmetic error.',
          'Incorrect: SNR in dB is literally Signal(dBm) minus Noise(dBm).',
        ],
        takeaway: 'SNR(dB) = RSSI(dBm) - Noise(dBm); aim for ≥ 20–25 dB.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Audit Wireless Channel & Security Mock Questions in Exam Lab',
      targetTab: 'exam',
      instructions: [
        'Open Mock Exams -> Cisco CCNA and answer 10 Domain 1 wireless and infrastructure questions.',
      ],
      verificationCheck: 'Identify 2.4 vs 5 vs 6 GHz channels and WPA2 vs WPA3 requirements accurately.',
    },

    summaryBullets: [
      '2.4 GHz penetrates farther yet has only three non-overlapping 20 MHz channels: **1, 6, and 11**.',
      '5 GHz provides 20+ non-overlapping channels (some DFS) for high-density offices; 6 GHz (Wi-Fi 6E/7) mandates WPA3.',
      'Wi-Fi uses half-duplex CSMA/CA; aim for ≥ 20–25 dB SNR and balanced medium AP transmit power.',
      'WPA2-Personal uses PSK + AES-CCMP; WPA3-Personal adds SAE + PMF; Enterprise adds 802.1X + RADIUS.',
      'Avoid WEP/TKIP completely—both are insecure and limit wireless throughput.',
    ],

    sourcesToVerify: [
      'Cisco Enterprise Wireless Design Guide & Wi-Fi Alliance WPA3 Specification',
      'IEEE 802.11 Wireless LAN Standards',
    ],
  },

  'ccna.core.svc.dhcpv4': {
    id: 'ccna.core.svc.dhcpv4',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Infrastructure & Services',
    topicTitle: '1.7 / 4.3, 4.6 Troubleshoot DHCPv4 Client, Server & Relay',
    code: '1.7.1',
    title: 'DHCPv4 DORA, IOS DHCP Pools, APIPA & ip helper-address Relay Faults',
    readMinutes: 13,
    prerequisites: ['1.3.1'],
    versionScope: 'shared',
    v11ExamTopics: ['4.3', '4.6'],
    v20ExamTopics: ['1.7'],

    learningObjectives: [
      'Trace the 4-step DHCPv4 DORA exchange (Discover, Offer, Request, Acknowledge) and exact UDP ports (67/68).',
      'Configure and verify a Cisco IOS DHCPv4 server (`excluded-address`, `ip dhcp pool`, `network`, `default-router`, `dns-server`).',
      'Explain why routers drop DHCP broadcasts by default and configure `ip helper-address` on the **client-facing** gateway interface.',
      'Troubleshoot APIPA (`169.254.x.x`), exhausted DHCP pools, and missing excluded-address reservations.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Every Workstation on VLAN 20 Suddenly Boots With `169.254.x.x`',
      narrative:
        'A company moves its DHCP server into the centralized Data Center (`10.50.10.25`) instead of running DHCP on every branch router. Monday morning, every PC on `10.20.20.0/24` gets `169.254.x.x` (APIPA) even though the server is online and reachable by ping! Because routers block Layer 2 broadcasts (`255.255.255.255`) at subnet edges, DHCP Discover packets never leave VLAN 20 until you configure `ip helper-address 10.50.10.25` on the exact gateway facing those clients.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Front-Desk Hotel Check-In vs. a Branch Messenger Forwarding Forms',
      analogy:
        'When a laptop plugs into Ethernet without an IP address, it shouts across the lobby (`255.255.255.255` Broadcast): **"DISCOVER: Anyone got a room (IP)?"** A local DHCP server replies: **"OFFER: Try 192.168.10.50 for 24 hours!"** The laptop yells back: **"REQUEST: Great, I accept .50!"** (telling any competing servers they can put their offers away), and the server stamps **"ACK: Confirmed—here are your keycard, gateway, and DNS!"** If the central front desk lives in another building (across a router), your floor router acts as a **DHCP Relay Agent (`ip helper-address`)**: it catches your local broadcast shout, stamps your floor’s return address (**giaddr**) on the form, and mails it as a **unicast** straight to the central DHCP server so it knows which floor’s pool to pull from!',
      technicalDefinition:
        'DHCPv4 (RFC 2131) dynamically leases IPv4 addresses, masks, default gateways, and DNS servers over UDP ports 67 (server) and 68 (client) using the 4-message DORA exchange. Across routed boundaries, `ip helper-address <server-ip>` converts client broadcasts into unicast relays stamped with the client-facing gateway IP (`giaddr`).',
      paragraphs: [
        'Notice the exact ports and direction in **DORA**: Client sends from **UDP 68** -> Server **UDP 67** (`Discover` and `Request`), and Server replies from **UDP 67** -> Client **UDP 68** (`Offer` and `Ack`). When a DHCP client receives zero Offer within seconds, Windows/macOS/Linux assigns an **APIPA (`169.254.0.0/16`)** address so the NIC isn’t dead—immediately signaling a DHCP failure. Once leased, clients renew silently via two lease timers: at **T1 (50% of lease time)** the client sends a **unicast** Request to the leasing DHCP server; if unanswered, at **T2 (87.5% of lease time)** it **broadcasts** a Rebind Request so any reachable server can extend it!',
        'When configuring DHCP directly on a Cisco IOS router, ALWAYS configure **`ip dhcp excluded-address <start> [end]`** in global config *before* creating the pool (or at least exclude the router’s own gateway IP, printers, and switches!) so IOS never hands out `.1` to a laptop.',
        'For **DHCP Relay (`ip helper-address`)**: place `ip helper-address <DHCP-server-IP>` ONLY on the **inbound client-facing interface** (physical or SVI `interface Vlan20`), NEVER on the WAN link facing the DHCP server! Also check that the router has a valid route to the DHCP server and any ACLs permit UDP 67/68.',
      ],
    },

    deepDive: {
      intro: 'Trace DORA, IOS local pool syntax, and centralized DHCP relay forwarding.',
      steps: [
        {
          step: 'D - Discover',
          title: 'Client Broadcast (`0.0.0.0:68 -> 255.255.255.255:67`)',
          explanation: 'Client has no IP yet and discovers available DHCP servers on its local broadcast domain.',
        },
        {
          step: 'O - Offer & R - Request',
          title: 'Lease Proposal & Formal Acceptance',
          explanation: 'Server offers an unused IP + lease time; client broadcasts Request specifying which server’s offer it chose (releasing unused offers).',
        },
        {
          step: 'A - Acknowledge',
          title: 'Final Binding & Options',
          explanation: 'Server commits the lease in its binding table (`show ip dhcp binding`) and confirms subnet mask, default router, and DNS server.',
        },
        {
          step: 'Relay Agent',
          title: 'Crossing Routers with `ip helper-address`',
          explanation: 'Router gateway receives broadcast on `G0/0` (`10.20.20.1`), sets `giaddr = 10.20.20.1`, and unicasts to DHCP server `10.50.10.25`. Server matches `giaddr` against its `10.20.20.0/24` scope!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'DHCPv4 Relay Across Router Gateway (`ip helper-address`)',
        asciiFallback: `[PC1: 0.0.0.0:68] -- Broadcast Discover --> [R1 Gi0/0: 10.20.20.1]
                                              (ip helper-address 10.50.10.25)
                                                      |
                            Unicast Relay (giaddr=10.20.20.1, UDP 67)
                                                      v
                                              [DHCP Server: 10.50.10.25]`,
      },
      workedExample: {
        title: 'Building a Clean IOS DHCP Pool + Fixing a Broken Relay',
        context: 'VLAN 10 (`192.168.10.0/24`, GW `.1`, DNS `10.1.1.10`) uses local IOS DHCP; VLAN 20 (`192.168.20.0/24`) relays to `10.1.1.25`.',
        steps: [
          'Reserve static infrastructure IPs first: `ip dhcp excluded-address 192.168.10.1 192.168.10.20`.',
          'Create pool: `ip dhcp pool LAN_10` -> `network 192.168.10.0 255.255.255.0` -> `default-router 192.168.10.1` -> `dns-server 10.1.1.10`.',
          'For VLAN 20 gateway interface (`Gi0/1` or `Vlan20`): add `ip helper-address 10.1.1.25` directly under that interface.',
          'Also allow a router interface itself to act as a DHCP client (e.g., ISP uplink) via `ip address dhcp`.',
        ],
        outcome: 'VLAN 10 leases IPs `.21+` cleanly, and VLAN 20 broadcasts relay seamlessly to `10.1.1.25`.',
      },
    },

    iosCliGuide: {
      intro: 'Verify active leases, pool exhaustion, and interface helper-address placement.',
      commands: [
        {
          title: '1. Verify Active DHCP Leases & Binding Table',
          promptAndCommand: 'R1# show ip dhcp binding',
          output: `IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.10.21    0100.1a2b.3c4d.5e       Nov 23 2026 03:15 AM    Automatic`,
          lineByLine: [
            { segment: '192.168.10.21', meaning: 'First leased IP right after the `.1–.20` excluded range.' },
            { segment: '0100.1a2b.3c4d.5e', meaning: 'Client identifier (`01` = Ethernet + MAC address).' },
          ],
        },
        {
          title: '2. Verify DHCP Pool Utilization & Conflicts',
          promptAndCommand: 'R1# show ip dhcp pool',
          output: `Pool LAN_10 :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0
 Total addresses                : 254
 Leased addresses               : 14
 Excluded addresses             : 20`,
          lineByLine: [
            { segment: 'Leased + Excluded vs Total', meaning: 'If `Leased + Excluded == Total`, the pool is exhausted and new clients hit APIPA!' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip interface GigabitEthernet0/1',
        healthyLabel: 'Relay Configured on Client-Facing Gateway',
        healthyOutput: `GigabitEthernet0/1 is up, line protocol is up
  Internet address is 192.168.20.1/24
  Helper address is 10.1.1.25`,
        brokenLabel: 'Helper Address Accidentally Put on Server-Facing Port or Missing',
        brokenOutput: `Helper address is not set`,
        diagnosis:
          'If `Helper address is not set` on the client gateway interface, local DHCP Discover broadcasts die at Layer 2 and clients receive `169.254.x.x` APIPA.',
      },
    },

    commonTraps: [
      {
        trap: 'Putting `ip helper-address` on the router interface pointing TO the DHCP server instead of the interface facing CLIENTS.',
        reality: 'The helper catches broadcasts coming **into** the client gateway interface and forwards them toward the server.',
      },
      {
        trap: 'Forgetting `ip dhcp excluded-address` for `.1` (the gateway) and static servers.',
        reality: 'IOS will happily hand out `.1` to a laptop, creating an IP conflict that knocks the whole subnet offline!',
      },
      {
        trap: 'Assuming `ip helper-address` forwards ONLY DHCP.',
        reality: 'By default on IOS, `ip helper-address` relays 8 UDP broadcast ports including TFTP (69), DNS (53), Time (37), NetBIOS (137/138), and BOOTP/DHCP (67/68).',
      },
      {
        trap: 'Assuming APIPA (`169.254.x.x`) means the network card is unplugged.',
        reality: 'Windows only assigns `169.254.x.x` when the link IS physically up (`connected`), yet DHCP DORA failed to complete.',
      },
    ],

    keyTerms: [
      {
        term: 'DORA',
        shortDef: 'Four-step DHCPv4 handshake: Discover, Offer, Request, Acknowledge.',
        fullDef: 'Uses UDP 67 (server) and UDP 68 (client) to lease IP, mask, gateway, and DNS options dynamically.',
      },
      {
        term: 'APIPA (169.254.0.0/16)',
        shortDef: 'Automatic self-assigned link-local IPv4 range when DHCP fails.',
        fullDef: 'Allows local link communication only; cannot route off-subnet and signals a broken DHCP server, pool, VLAN, or relay.',
      },
      {
        term: 'ip helper-address',
        shortDef: 'Cisco IOS interface command enabling DHCP Relay across routed subnets.',
        fullDef: 'Placed on the client-facing gateway to forward UDP broadcasts as unicast packets to a remote DHCP server.',
      },
      {
        term: 'Excluded Address Range',
        shortDef: 'Static IPs withheld from an IOS DHCP pool (`ip dhcp excluded-address`).',
        fullDef: 'Protects gateways, switches, printers, and servers from duplicate-IP conflicts.',
      },
    ],

    checkQuestions: [
      {
        id: 'c17-q1',
        prompt: 'A PC on VLAN 30 (`10.30.30.0/24`) boots up and displays IP `169.254.42.19`. The central DHCP server resides at `10.1.1.50` behind router R1 (`G0/0` = `10.30.30.1`, `G0/1` = `10.1.1.1`). Where must `ip helper-address 10.1.1.50` be configured?',
        options: [
          'Under R1 `interface GigabitEthernet0/0` (the client-facing VLAN 30 gateway)',
          'Under R1 `interface GigabitEthernet0/1` (facing the DHCP server)',
          'In Global Configuration mode on the Layer 2 switch',
          'Under `ip dhcp pool` on the PC',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `ip helper-address` listens for inbound client broadcasts on the client-facing gateway (`G0/0`) and relays them via unicast toward `10.1.1.50`.',
          'Incorrect: Putting the helper on `G0/1` does not capture broadcasts on `G0/0`.',
          'Incorrect: `ip helper-address` is an interface-level router/SVI command.',
          'Incorrect: PCs act as DHCP clients, not IOS pools.',
        ],
        takeaway: 'Always put `ip helper-address <DHCP-server-IP>` on the client-facing Layer 3 interface.',
      },
      {
        id: 'c17-q2',
        prompt: 'What is the exact sequence and port usage of the DHCPv4 lease negotiation?',
        options: [
          'Discover -> Offer -> Request -> Acknowledge (UDP ports 67 & 68)',
          'Discover -> Request -> Offer -> Confirm (TCP ports 67 & 68)',
          'Request -> Offer -> Discover -> Acknowledge (UDP port 53)',
          'SYN -> Offer -> ACK -> Lease (TCP port 68)',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: DORA runs over UDP 68 (client) and UDP 67 (server).',
          'Incorrect: DHCP uses UDP, not TCP, and Offer precedes Request.',
          'Incorrect: Port 53 is DNS, and Discover starts the sequence.',
          'Incorrect: TCP SYN belongs to TCP handshakes, not DHCP.',
        ],
        takeaway: 'DORA = Discover -> Offer -> Request -> Acknowledge over UDP 67/68.',
      },
      {
        id: 'c17-q3',
        prompt: 'An IOS DHCP server has `network 192.168.5.0 255.255.255.0` and `default-router 192.168.5.1`, yet no `ip dhcp excluded-address` statements. What immediate problem can occur?',
        options: [
          'The router may lease `192.168.5.1` to the first client, causing a duplicate IP conflict with the gateway.',
          'Clients will automatically use IPv6 instead.',
          'The pool will refuse to activate until 50 addresses are excluded.',
          'OSPF will drop all routes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Without `ip dhcp excluded-address 192.168.5.1`, IOS begins assigning from `.1` upward and hands out its own gateway IP!',
          'Incorrect: IPv4 DHCP does not fall back to IPv6.',
          'Incorrect: IOS activates the pool without exclusions—creating the conflict risk.',
          'Incorrect: Unrelated to OSPF.',
        ],
        takeaway: 'Always exclude gateway and static IPs with `ip dhcp excluded-address`.',
      },
      {
        id: 'c17-q4',
        prompt: 'Which IOS command configures a router’s ISP-facing Ethernet port to obtain its own IPv4 address automatically from the ISP?',
        options: [
          'ip address dhcp',
          'ip helper-address dhcp',
          'ip dhcp pool WAN',
          'dhcp client enable',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `ip address dhcp` under `(config-if)#` makes the IOS interface act as a DHCPv4 client.',
          'Incorrect: `ip helper-address` takes an IP to relay broadcasts.',
          'Incorrect: `ip dhcp pool` turns the router into a DHCP server.',
          'Incorrect: Not valid IOS syntax.',
        ],
        takeaway: '`ip address dhcp` configures an IOS interface as a DHCP client.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Check DHCP Relay & Interface Configuration in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Inspect `show ip interface` and `show running-config` in IOS Labs to practice verifying gateway IP addresses and helper-address placements.',
      ],
      verificationCheck: 'Confirm gateway IPs are excluded and client-facing interfaces hold correct IP/helper settings.',
    },

    summaryBullets: [
      'DHCPv4 negotiates leases in 4 steps (**DORA**: Discover, Offer, Request, Acknowledge) over **UDP 67/68**.',
      'Clients receiving no DHCP Offer assign **APIPA (`169.254.0.0/16`)**.',
      'Always define `ip dhcp excluded-address` for gateways, printers, and switches before handing out pool IPs.',
      'Use `ip helper-address <DHCP-server-IP>` on the **client-facing** router/SVI gateway to relay broadcasts across Layer 3.',
      'Use `ip address dhcp` on a router WAN port to acquire an ISP lease dynamically.',
    ],

    sourcesToVerify: [
      'RFC 2131 — Dynamic Host Configuration Protocol',
      'Cisco IOS IP Addressing Services Configuration Guide — Configuring DHCP',
    ],
  },

  'ccna.core.net.client-connectivity': {
    id: 'ccna.core.net.client-connectivity',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Infrastructure & Clients',
    topicTitle: '1.6 / 1.10 Client Connectivity Diagnostics',
    code: '1.6.1',
    title: 'Diagnosing Client Connectivity Across Windows, macOS & Linux',
    readMinutes: 13,
    prerequisites: ['1.3.1', '1.5.1', '1.7.1'],
    versionScope: 'shared',
    v11ExamTopics: ['1.10'],
    v20ExamTopics: ['1.6'],

    learningObjectives: [
      'Inspect IP, subnet mask, default gateway, DNS, and wireless link parameters across Windows, macOS, and Linux.',
      'Use built-in OS tools (`ipconfig`, `ip addr`, `ifconfig`, `ping`, `tracert`/`traceroute`, `nslookup`/`dig`, `arp -a`, `route print`) systematically.',
      'Separate client-side OS faults (wrong DNS, proxy, local firewall, Wi-Fi profile, stale ARP/DNS cache) from upstream network faults.',
      'Verify wired vs. wireless client association, link speed, and gateway reachability on endpoints.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Knowing Endpoint CLI Commands Saves Network Engineers From Chasing Phantom Router Outages',
      narrative:
        'A remote user claims "The office router is broken because my MacBook cannot open internal apps." Before tearing apart core OSPF or firewall ACLs, you check the laptop directly (`ifconfig en0`, `networksetup`, `scutil --dns`, `ping` gateway) and discover the MacBook has a stale manual DNS entry (`192.168.99.99`) left over from a hotel lab, while its IP and gateway are completely healthy! CCNA v2.0 explicitly tests wired and wireless client troubleshooting across Windows, macOS, and Linux.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Checking a Car’s Dashboard Before Tearing Up the Highway',
      analogy:
        'When a driver says "The highway is closed," you check their dashboard first: Is the engine on (NIC up)? Is there gas in the tank (valid IP, not `169.254.x.x`)? Does the GPS know the exit ramp (Default Gateway)? And does the address book match (DNS)? Running four 5-second OS commands reveals whether the problem lives inside the laptop or out on the switch/router.',
      technicalDefinition:
        'Client connectivity diagnostics validate Layer 1–7 endpoint state across Windows (`ipconfig /all`, `route print`, `tracert`, `nslookup`), Linux (`ip addr`, `ip route`, `ss`, `traceroute`, `dig`), and macOS (`ifconfig`, `netstat -nr`, `scutil --dns`, `networksetup`), isolating NIC link, DHCP/IP mask, gateway reachability, routing, DNS, and Wi-Fi RF issues.',
      paragraphs: [
        'Keep the **cross-OS command equivalents** memorized cleanly: To view IP + MAC + DNS on **Windows**, run `ipconfig /all` (renew DHCP with `ipconfig /release` then `ipconfig /renew`; clear DNS cache with `ipconfig /flushdns`). On **Linux**, run `ip addr show` (or `ip a`) and `ip route show` (older tool: `ifconfig` / `netstat`). On **macOS**, run `ifconfig en0`, `ipconfig getifaddr en0`, `netstat -nr`, and `scutil --dns`.',
        'Follow the **5-Step Endpoint Isolation Order**: (1) Loopback `ping 127.0.0.1` (TCP/IP stack works), (2) Check own IP/Mask (is it APIPA `169.254.x.x` or duplicate IP?), (3) `ping <default gateway>` (L1/L2 switch + VLAN + ARP healthy), (4) `ping 8.8.8.8` or remote server IP (L3 routing + NAT working), (5) `nslookup <hostname>` (DNS UDP 53 working).',
        'On **wireless clients**, check Wi-Fi signal/RSSI (`netsh wlan show interfaces` on Windows, `iw dev wlan0 link` on Linux, Option-click Wi-Fi icon on macOS) and ensure the client didn’t auto-join a captive-portal guest SSID instead of the corporate SSID.',
      ],
    },

    deepDive: {
      intro: 'Reference the cross-OS client diagnostic matrix and walk through a 3-OS triage scenario.',
      steps: [
        {
          step: 'Windows CLI',
          title: 'ipconfig, netsh, tracert, route print',
          explanation:
            '`ipconfig /all` (IP/mask/GW/DNS/DHCP), `ipconfig /flushdns`, `netsh wlan show interfaces` (SSID/BSSID/Signal%), `tracert <dest>`, `arp -a`.',
        },
        {
          step: 'macOS CLI',
          title: 'ifconfig, networksetup, scutil, traceroute',
          explanation:
            '`ifconfig en0` (MAC/IP), `netstat -nr` (routing table & default gateway), `scutil --dns` (active DNS resolvers per domain), `networksetup -listallhardwareports`.',
        },
        {
          step: 'Linux CLI',
          title: 'ip addr, ip route, ss, dig/resolvectl',
          explanation:
            '`ip -br addr` (concise link + IP), `ip route` (`default via ...`), `resolvectl status` or `cat /etc/resolv.conf`, `nmcli dev wifi` (wireless status).',
        },
        {
          step: 'Isolation Ladder',
          title: 'Narrow Fault to Single Layer in < 60s',
          explanation:
            'If Gateway ping fails -> L1/L2/VLAN/APIPA/Wi-Fi. If Gateway passes & `1.1.1.1` passes & `example.com` fails -> DNS! If `1.1.1.1` passes & HTTPS fails -> local proxy/firewall/port ACL.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '5-Step Endpoint Isolation Ladder (Windows / macOS / Linux)',
        asciiFallback: `1. Stack Check : ping 127.0.0.1        (Fail -> OS TCP/IP stack fault)
2. IP / Mask   : ipconfig /all | ip a  (169.254.x.x -> DHCP/VLAN fault!)
3. Gateway L2  : ping <Default-GW>     (Fail -> Cable/Wi-Fi/VLAN/ARP/FW)
4. Remote IP   : ping <Remote-Server>  (Fail -> Routing / NAT / WAN ACL)
5. Name Lookup : nslookup / dig        (Fail -> DNS IP, UDP/TCP 53, cache)`,
      },
      workedExample: {
        title: 'Solving "No Internet" on Windows vs. Linux Endpoints',
        context:
          'User A (Windows) gets `169.254.12.88`; User B (Linux) gets `10.20.10.45/24`, can ping `10.20.10.1` and `8.8.8.8`, yet browsers fail on `portal.company.com`.',
        steps: [
          'User A (`ipconfig /all`): `169.254.12.88` + `Autoconfiguration IPv4` -> NIC connected, DHCP failed! Check switch VLAN assignment or `ip helper-address`.',
          'User B (`ip route` + `resolvectl status`): `default via 10.20.10.1` works (`ping 8.8.8.8` succeeds), yet `dig portal.company.com` times out because `/etc/resolv.conf` points to an unreachable old DNS `10.99.99.5`!',
          'Update User B’s DNS to `10.20.1.10` (or renew DHCP lease via `nmcli` / `dhclient`) -> browser loads immediately.',
        ],
        outcome: 'Two completely different root causes (VLAN/DHCP vs. DNS) separated in under a minute.',
      },
    },

    iosCliGuide: {
      intro: 'Pair client OS outputs with switch/router verification to prove whether the endpoint or network broke.',
      commands: [
        {
          title: 'Correlate Client MAC/IP Against Switch ARP & Port Status',
          promptAndCommand: 'SW1# show mac address-table address 001a.2b3c.4d5e',
          output: `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  20    001a.2b3c.4d5e    DYNAMIC     Gi1/0/14`,
          lineByLine: [
            { segment: 'Vlan 20 / Gi1/0/14', meaning: 'Confirms which switch port and VLAN the endpoint actually sits in when troubleshooting APIPA or wrong subnet.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'ipconfig /all (Client) vs show interface Gi1/0/14 switchport (Switch)',
        healthyLabel: 'Client & Port on Matching VLAN 20 (`10.20.20.x`)',
        healthyOutput: `IPv4 Address: 10.20.20.44 | Default Gateway: 10.20.20.1 | Switch Access VLAN: 20`,
        brokenLabel: 'Switch Port Left in Unconfigured VLAN 1 (`169.254.x.x`)',
        brokenOutput: `Autoconfiguration IPv4 Address: 169.254.81.14 | Switch Access VLAN: 1`,
        diagnosis:
          'When `ipconfig /all` shows APIPA and `show mac address-table` places the client in VLAN 1 instead of VLAN 20, assign `switchport access vlan 20` on the switch port and run `ipconfig /renew`.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming `ping` failing means the server is definitely offline.',
        reality: 'Windows Defender Firewall and edge routers frequently block ICMP Echo Requests while TCP 443 web apps work fine.',
      },
      {
        trap: 'Running `ipconfig` on Linux or `ip addr` on macOS.',
        reality: 'Know each OS: Windows = `ipconfig /all` + `route print`; Linux = `ip addr` + `ip route`; macOS = `ifconfig` + `netstat -nr` + `scutil --dns`.',
      },
      {
        trap: 'Ignoring wireless signal/SSID checks when troubleshooting slow laptops.',
        reality: 'Check `netsh wlan show interfaces` (Windows) or Wi-Fi status—a laptop may have roamed onto a guest network or weak 2.4 GHz AP.',
      },
      {
        trap: 'Running `ipconfig /renew` before checking whether the port is even connected (`Media disconnected`).',
        reality: 'If `Media state . . . . . . . . . . . : Media disconnected`, no DHCP command can help until Layer 1 cable/port link comes up.',
      },
    ],

    keyTerms: [
      {
        term: 'ipconfig /all (Windows)',
        shortDef: 'Displays IPv4/IPv6, subnet mask, gateway, MAC, DHCP server, and DNS servers.',
        fullDef: 'Primary Windows CLI diagnostic command; pair with `/release`, `/renew`, and `/flushdns`.',
      },
      {
        term: 'ip addr / ip route (Linux)',
        shortDef: 'Modern `iproute2` commands showing interface IPs, link state, and kernel routes.',
        fullDef: 'Replaces legacy `ifconfig` and `route` utilities on modern Linux distributions.',
      },
      {
        term: 'scutil --dns / netstat -nr (macOS)',
        shortDef: 'macOS commands inspecting active per-domain DNS resolvers and routing table.',
        fullDef: 'Essential for isolating macOS VPN split-DNS and gateway routing issues.',
      },
      {
        term: 'netsh wlan show interfaces',
        shortDef: 'Windows command displaying Wi-Fi SSID, BSSID, channel, band, and signal percentage.',
        fullDef: 'Quickly reveals whether a Windows client connected to 2.4 vs. 5 GHz and a strong vs. weak AP.',
      },
    ],

    checkQuestions: [
      {
        id: 'c16-q1',
        prompt: 'A Windows laptop can ping `10.10.20.1` (gateway) and `8.8.8.8` successfully, yet fails to open `https://intranet.corp`. What is the next logical check?',
        options: [
          'Run `nslookup intranet.corp` and check DNS server settings in `ipconfig /all`.',
          'Replace the Cat6 patch cord immediately.',
          'Configure `ip helper-address` on the laptop.',
          'Run `ping 127.0.0.1` to test the NIC driver.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Successful ping to `8.8.8.8` proves Layer 1–3 routing and internet gateway work; failure on domain names points straight to DNS (or proxy/TCP 443).',
          'Incorrect: Layer 1 cable already passed traffic to `8.8.8.8`.',
          'Incorrect: `ip helper-address` is a router DHCP relay command.',
          'Incorrect: Loopback already works if external pings succeed.',
        ],
        takeaway: 'Can ping IP (`8.8.8.8`) + cannot load hostname -> test DNS immediately (`nslookup`/`dig`).',
      },
      {
        id: 'c16-q2',
        prompt: 'Which Linux command displays interface IP addresses and up/down link states cleanly on modern distributions?',
        options: ['ip addr show', 'ipconfig /all', 'show ip interface brief', 'netsh int ip show'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `ip addr show` (`ip a`) is the standard modern Linux `iproute2` command.',
          'Incorrect: `ipconfig` is Windows (and a different DHCP utility on macOS).',
          'Incorrect: `show ip interface brief` is Cisco IOS.',
          'Incorrect: `netsh` is Windows.',
        ],
        takeaway: 'Linux = `ip addr` & `ip route`; Windows = `ipconfig /all` & `route print`; macOS = `ifconfig` & `netstat -nr`.',
      },
      {
        id: 'c16-q3',
        prompt: 'On Windows, `ipconfig /all` prints `Media State . . . : Media disconnected`. What does this prove?',
        options: [
          'Layer 1 physical link is down (unplugged cable, disabled Wi-Fi radio, or shutdown switch port).',
          'The DHCP server pool is exhausted.',
          'DNS server `8.8.8.8` is unreachable.',
          'The user typed an expired password.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `Media disconnected` means no electrical/optical/radio Layer 1 carrier exists on that adapter.',
          'Incorrect: Exhausted DHCP produces APIPA (`169.254.x.x`) while media is connected.',
          'Incorrect: DNS is Layer 7.',
          'Incorrect: Account passwords do not disconnect Layer 1 media.',
        ],
        takeaway: '`Media disconnected` = Layer 1 physical/port fault; `169.254.x.x` = Layer 1 connected, DHCP failed.',
      },
      {
        id: 'c16-q4',
        prompt: 'Which Windows command reveals the exact wireless SSID, BSSID, radio band, channel, and signal percentage a laptop is currently connected to?',
        options: [
          'netsh wlan show interfaces',
          'ipconfig /displaydns',
          'arp -a',
          'route print',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `netsh wlan show interfaces` outputs complete live Wi-Fi radio & association telemetry.',
          'Incorrect: `/displaydns` prints cached DNS records.',
          'Incorrect: `arp -a` prints the IP-to-MAC ARP table.',
          'Incorrect: `route print` prints the IPv4/IPv6 routing table.',
        ],
        takeaway: 'Use `netsh wlan show interfaces` on Windows to audit SSID, BSSID, channel, and signal strength.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Practice Endpoint & DNS Triage in the Service Desk Simulator',
      targetTab: 'simulator',
      instructions: [
        'Open the Simulator tab (or Exam Lab) and trace `ipconfig`, `ping`, and `nslookup` outputs to isolate client-side vs. network-side faults.',
      ],
      verificationCheck: 'Correctly diagnose APIPA vs. DNS vs. gateway failures across endpoint diagnostics.',
    },

    summaryBullets: [
      'Isolate client connectivity bottom-up: Stack (`127.0.0.1`) -> IP/Mask (check APIPA) -> Gateway -> Remote IP -> DNS.',
      'Windows CLI: `ipconfig /all`, `/release`, `/renew`, `/flushdns`, `netsh wlan show interfaces`, `route print`, `tracert`.',
      'Linux CLI: `ip addr`, `ip route`, `resolvectl` / `dig`, `traceroute`, `nmcli`.',
      'macOS CLI: `ifconfig`, `netstat -nr`, `scutil --dns`, `networksetup`.',
      'Always correlate endpoint MAC/VLAN with switch `show mac address-table` when diagnosing local dropouts.',
    ],

    sourcesToVerify: [
      'CCNA 200-301 v2.0 Exam Topics — Domain 1.6 (Client Connectivity Troubleshooting)',
      'Microsoft Learn / Linux iproute2 / Apple macOS Network Utility Documentation',
    ],
  },

  'ccna.core.net.virtualization-containers': {
    id: 'ccna.core.net.virtualization-containers',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Infrastructure & Virtualization',
    topicTitle: '1.2 / 1.12 Hypervisors, Virtual Machines & Containers',
    code: '1.2.1',
    title: 'Type-1/Type-2 Hypervisors, Virtual Switches, VMs & Containers',
    readMinutes: 11,
    prerequisites: ['0.2.1'],
    versionScope: 'shared',
    v11ExamTopics: ['1.12'],
    v20ExamTopics: ['1.2'],

    learningObjectives: [
      'Differentiate Type-1 (bare-metal) hypervisors from Type-2 (hosted) hypervisors and their enterprise vs. lab roles.',
      'Explain how Virtual Machines (VMs) virtualize full hardware + Guest OS while Containers share the host OS kernel.',
      'Describe how Virtual Switches (vSwitches) bridge virtual NICs (vNICs) onto physical NICs and 802.1Q VLAN trunks.',
      'Choose VMs vs. Containers appropriately for server workloads and cloud-native network services.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Physical Switch Trunk Port Needs `switchport mode trunk` for One Server Cable',
      narrative:
        'A server team plugs ONE fiber uplink from a physical ESXi host server into switch `Gi1/0/5`. Running inside that single physical server are 30 Virtual Machines across VLAN 10 (Web), VLAN 20 (App), and VLAN 30 (Database), plus Docker containers! Because the server runs an internal **Virtual Switch (vSwitch)** tagging Ethernet frames per VM, leaving the physical switch port as a single access VLAN breaks 20 of those VMs immediately. Understanding hypervisors, vSwitches, and containers prevents data-center misconfigurations.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Building Standalone Houses (VMs) vs. Apartments Sharing One Foundation (Containers)',
      analogy:
        'A **Virtual Machine (VM)** is like building separate standalone houses on one shared plot of land: every house brings its own full plumbing, kitchen, roof, and Guest Operating System—total isolation, even running Windows next to Linux, yet heavy on RAM, disk, and boot time. A **Container** (like Docker) is like apartments inside one building: every tenant has their own locked rooms, apps, and libraries, yet all apartments share the building’s single underlying water, electricity, and Linux **Host OS Kernel**—so containers start in milliseconds and pack 10x denser on the same server!',
      technicalDefinition:
        'Server virtualization abstracts physical compute, memory, and networking via a Hypervisor (Type-1 bare-metal or Type-2 hosted), running isolated Virtual Machines (each with a full Guest OS) wired through software Virtual Switches (vSwitches); OS-level virtualization (Containers) isolates application namespaces and libraries while sharing a single underlying host kernel.',
      paragraphs: [
        '**Type-1 (Bare-Metal) Hypervisors** (such as VMware ESXi, Microsoft Hyper-V bare-metal, KVM) install directly onto physical server hardware with zero general-purpose OS underneath—delivering maximum speed, security, and scalability for production data centers.',
        '**Type-2 (Hosted) Hypervisors** (such as VirtualBox, VMware Workstation, Parallels) run as software applications inside an existing Windows or macOS desktop OS—great for personal study labs, yet slower due to host OS overhead.',
        'Inside a hypervisor or container host, software **Virtual Switches (vSwitches)** connect VM virtual network cards (**vNICs**) to physical server ports (**pNICs**). A vSwitch behaves like an internal Ethernet switch capable of tagging **802.1Q VLANs**, which means the physical switch port wired to a virtualization host normally runs as an **802.1Q trunk**!',
        'Just as **VLANs virtualize Layer 2 switches** into separate broadcast domains, **VRFs (Virtual Routing and Forwarding)** virtualize a single physical Layer 3 router into multiple completely independent routing tables! A router running `vrf definition RED` and `vrf definition BLUE` can even route identical overlapping `10.1.1.0/24` customer subnets safely on the same box (`vrf forwarding RED` on an interface, verified via `show ip route vrf RED`).',
      ],
    },

    deepDive: {
      intro: 'Compare Type-1, Type-2, VMs, Containers, and Layer 3 VRF isolation side by side.',
      steps: [
        {
          step: 'Type-1 vs Type-2',
          title: 'Bare-Metal Production vs Hosted Lab',
          explanation: 'Type-1 sits straight on CPU/RAM hardware (ESXi, KVM, Hyper-V); Type-2 sits atop Windows/macOS (VirtualBox, VMware Workstation).',
        },
        {
          step: 'VMs vs Containers',
          title: 'Full Guest OS vs Shared Kernel',
          explanation: 'VMs virtualize hardware + run full Guest OSes (GBs of RAM, minute boot, mixed Windows/Linux). Containers package only the app + dependencies over a shared Host Kernel (MBs, millisecond start, ultra-dense).',
        },
        {
          step: 'Virtual Networking',
          title: 'vNIC -> vSwitch Port Group -> pNIC -> Physical Trunk',
          explanation: 'VMs on different VLANs attach to vSwitch Port Groups (e.g., VLAN 10, VLAN 20); the server’s pNIC connects to a physical switch trunk carrying VLANs 10 and 20.',
        },
        {
          step: 'VRFs (L3 Virtualization)',
          title: 'VLAN = Virtual L2 Switch | VRF = Virtual L3 Router',
          explanation: 'Configure `vrf definition CORP` + `address-family ipv4`, assign interfaces with `vrf forwarding CORP` (note: re-apply IP afterward because Cisco IOS strips the old IP when changing VRF!), and verify with `show ip route vrf CORP` and `ping vrf CORP <ip>`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'VMs (Type-1 Hypervisor) vs. Containers & Virtual Switch Trunking',
        asciiFallback: `VIRTUAL MACHINES (Full Guest OS)            CONTAINERS (Shared Host Kernel)
 [App A]        [App B]                      [App A+Libs]   [App B+Libs]
 [Win OS]       [Linux OS]                   [Docker / Container Runtime]
 [vNIC:V10]     [vNIC:V20]                   [   Host Linux OS Kernel   ]
 ----\\------------/-------
   [ vSwitch (802.1Q Tag) ]
             | pNIC (Trunk V10, V20)
   [ Physical Switch Trunk ]`,
      },
      workedExample: {
        title: 'Trunking a Physical Switch Port for a Virtualization Server',
        context: 'An ESXi host runs VMs in VLAN 10, VLAN 20, and Management VLAN 99 over uplink `Gi1/0/8`.',
        steps: [
          'Configure `Gi1/0/8` on the physical switch as an 802.1Q trunk (`switchport mode trunk`).',
          'Restrict allowed VLANs (`switchport trunk allowed vlan 10,20,99`) and match native VLAN cleanly (`switchport trunk native vlan 99` or tagged management).',
          'Enable `spanning-tree portfast trunk` carefully ONLY toward non-bridging server NICs (never toward switches!) so host reboots start forwarding immediately.',
        ],
        outcome: 'All three VM VLANs communicate over a single physical uplink with clean L2 segmentation.',
      },
    },

    iosCliGuide: {
      intro: 'Configure physical switch trunk ports connecting virtualization servers running vSwitches.',
      commands: [
        {
          title: 'Configure an 802.1Q Trunk Port for a Hypervisor Host',
          promptAndCommand: 'SW1(config)# interface GigabitEthernet1/0/8',
          output: `SW1(config-if)# description ESXI-HOST-01-PNIC0
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10,20,99
SW1(config-if)# no shutdown`,
          lineByLine: [
            { segment: 'switchport mode trunk', meaning: 'Carries multiple tagged VLANs required by VMs sitting behind the host’s internal vSwitch.' },
            { segment: 'allowed vlan 10,20,99', meaning: 'Limits broadcast/STP traffic to only the VLANs needed on that server.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show interfaces trunk',
        healthyLabel: 'Hypervisor Trunk Carrying VM VLANs',
        healthyOutput: `Port        Mode             Encapsulation  Status        Native vlan
Gi1/0/8     on               802.1q         trunking      1
Port        Vlans allowed on trunk
Gi1/0/8     10,20,99`,
        brokenLabel: 'Switch Port Accidentally Left in Access Mode',
        brokenOutput: `(Gi1/0/8 missing from trunk table — tagged VM frames dropped!)`,
        diagnosis:
          'When a hypervisor vSwitch tags frames with VLAN 10/20 yet the physical switch port stays in `access` mode, the physical switch drops every tagged frame.',
      },
    },

    commonTraps: [
      {
        trap: 'Saying containers need their own complete Guest OS like VMs.',
        reality: 'Containers share the underlying **host OS kernel**, packaging only application binaries and dependencies.',
      },
      {
        trap: 'Calling VMware ESXi a Type-2 hypervisor.',
        reality: 'ESXi, Hyper-V (Server bare-metal), and KVM are **Type-1 bare-metal** hypervisors; VirtualBox and VMware Workstation are **Type-2 hosted**.',
      },
      {
        trap: 'Putting a hypervisor uplink carrying multiple VM VLANs into `switchport mode access`.',
        reality: 'Multi-VLAN hypervisor uplinks require `switchport mode trunk` so 802.1Q tags pass cleanly.',
      },
      {
        trap: 'Assuming VMs have zero security isolation benefits over containers.',
        reality: 'Because each VM isolates its own kernel and virtualized hardware, VMs provide stronger multi-tenant boundary isolation (often running containers *inside* cloud VMs!).',
      },
    ],

    keyTerms: [
      {
        term: 'Type-1 Hypervisor',
        shortDef: 'Bare-metal virtualization layer running directly on physical server hardware.',
        fullDef: 'Examples include VMware ESXi, KVM, and Microsoft Hyper-V; standard in production data centers.',
      },
      {
        term: 'Type-2 Hypervisor',
        shortDef: 'Hosted virtualization app running atop an existing desktop OS.',
        fullDef: 'Examples include VirtualBox and VMware Workstation; ideal for student labs and testing.',
      },
      {
        term: 'Container',
        shortDef: 'Lightweight OS-level virtualized workload sharing the host OS kernel.',
        fullDef: 'Packages code, runtime, and libraries cleanly (e.g., Docker/Kubernetes pods) with sub-second startup and minimal RAM.',
      },
      {
        term: 'Virtual Switch (vSwitch)',
        shortDef: 'Software Layer 2 switch inside a hypervisor bridging VM vNICs to physical NICs.',
        fullDef: 'Supports port groups, VLAN tagging, and traffic policies across virtual workloads on one physical server.',
      },
    ],

    checkQuestions: [
      {
        id: 'c12-q1',
        prompt: 'What is the fundamental architectural difference between a Virtual Machine and a Container?',
        options: [
          'A VM includes a complete Guest OS on virtual hardware, whereas a Container shares the underlying host OS kernel.',
          'Containers run directly on bare metal with zero OS anywhere.',
          'VMs cannot use Ethernet networking or VLANs.',
          'Containers require 10x more RAM and minutes to boot.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Sharing the host kernel makes containers tiny and ultra-fast to start compared to full-OS VMs.',
          'Incorrect: Containers rely directly on a host OS kernel (typically Linux).',
          'Incorrect: VMs use virtual NICs and vSwitches to support full VLAN/IP networking.',
          'Incorrect: VMs consume more RAM and take longer to boot; containers start in milliseconds.',
        ],
        takeaway: 'VMs virtualize hardware (full Guest OS); Containers share the host kernel.',
      },
      {
        id: 'c12-q2',
        prompt: 'Which hypervisor is classified as Type-1 (bare-metal)?',
        options: ['VMware ESXi', 'Oracle VirtualBox', 'VMware Workstation Player', 'Parallels Desktop'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: ESXi installs directly on server hardware without a host OS.',
          'Incorrect: VirtualBox runs inside Windows/macOS/Linux (Type-2).',
          'Incorrect: Workstation runs atop a host desktop OS (Type-2).',
          'Incorrect: Parallels Desktop runs inside macOS (Type-2).',
        ],
        takeaway: 'Type-1 = ESXi, KVM, bare-metal Hyper-V; Type-2 = VirtualBox, Workstation, Parallels.',
      },
      {
        id: 'c12-q3',
        prompt: 'An ESXi server hosts VMs in VLAN 10, VLAN 20, and VLAN 30 connected via one physical NIC to switch port `Gi1/0/4`. How must `Gi1/0/4` be configured?',
        options: [
          'As an 802.1Q trunk (`switchport mode trunk`) allowing VLANs 10, 20, and 30',
          'As an access port in VLAN 10 only',
          'With `no switchport` and no IP address',
          'With `shutdown`',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The server’s vSwitch sends 802.1Q-tagged frames for all three VLANs across that shared physical link, requiring trunk mode.',
          'Incorrect: An access port drops tagged frames and limits the host to a single VLAN.',
          'Incorrect: A routed port lacks Layer 2 VLAN trunking unless configured with subinterfaces.',
          'Incorrect: Disables the server completely.',
        ],
        takeaway: 'Multi-VLAN hypervisor pNICs connect to 802.1Q trunk ports on physical switches.',
      },
      {
        id: 'c12-q4',
        prompt: 'How do virtualized workloads inside a hypervisor connect to physical Ethernet switches?',
        options: [
          'Through vNICs wired to a software Virtual Switch (vSwitch) mapped to a physical server NIC (pNIC)',
          'By passing USB cables from each VM',
          'By bypassing Layer 2 MAC addresses completely',
          'Only via serial console ports',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: vNIC -> vSwitch -> pNIC bridges virtual machines cleanly onto physical switch fabrics.',
          'Incorrect: Not how server networking functions.',
          'Incorrect: Every vNIC carries a real virtual MAC address and Ethernet frames.',
          'Incorrect: Console ports are for out-of-band CLI management.',
        ],
        takeaway: 'Virtual NIC -> vSwitch -> physical NIC -> physical switch.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Configure an 802.1Q Server Trunk in IOS Lab 02',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 02 and practice configuring `switchport mode trunk` and `allowed vlan` lists for multi-VLAN uplinks.',
      ],
      verificationCheck: '`show interfaces trunk` displays active trunking for the allowed VLANs.',
    },

    summaryBullets: [
      'Type-1 hypervisors (ESXi, KVM, Hyper-V) run directly on bare metal; Type-2 (VirtualBox, Workstation) run atop a host OS.',
      'VMs bundle a complete Guest OS (high isolation, heavier); Containers share the host kernel (millisecond startup, high density).',
      'vSwitches bridge VM vNICs to physical pNICs and tag traffic with 802.1Q VLANs.',
      'Physical switch ports wired to multi-VLAN hypervisors normally require `switchport mode trunk`.',
      'Cloud-native deployments often run containers inside cloud Type-1 VMs for both density and tenant isolation.',
    ],

    sourcesToVerify: [
      'CCNA 200-301 v2.0 Topic 1.2 & v1.1 Topic 1.12 Official Exam Objectives',
      'Docker & VMware vSphere Networking Fundamentals Documentation',
    ],
  },
};
