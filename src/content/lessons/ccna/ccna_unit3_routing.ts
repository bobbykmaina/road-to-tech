import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT3_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.core.rt.routing-table': {
    id: 'ccna.core.rt.routing-table',
    moduleId: 'ccna',
    unitTitle: 'Unit 3: IP Routing',
    topicTitle: '3.1 / 3.1–3.2 Interpret a Routing Table',
    code: '3.1.1',
    title: 'Longest Prefix Match, Administrative Distance, Metric & Gateway of Last Resort',
    readMinutes: 13,
    prerequisites: ['1.3.1', '2.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['3.1', '3.2'],
    v20ExamTopics: ['3.1'],

    learningObjectives: [
      'Read every column of `show ip route`: Route Source Code (`C`, `L`, `S`, `O`, `D`, `*`), Prefix/Mask, `[AD/Metric]`, Next-Hop IP, and Outbound Interface.',
      'Apply the strict **Longest Prefix Match (LPM)** rule FIRST when multiple routes overlap a destination IP.',
      'Use **Administrative Distance (AD)** (`Connected=0`, `Static=1`, `eBGP=20`, `EIGRP=90`, `OSPF=110`, `RIP=120`, `iBGP=200`) when two protocols advertise the exact same prefix & mask.',
      'Use **Metric** only to compare equal-AD paths within the same routing protocol (supporting ECMP load balancing on ties).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a `/26` OSPF Route Beats a `/24` Static Route Every Single Time',
      narrative:
        'A classic CCNA exam trap—and real production surprise—happens when someone adds a static route `ip route 10.10.10.0 255.255.255.0 192.168.1.2` (`AD 1`) thinking it will override an OSPF route `10.10.10.64/26` (`AD 110`)! When test packets head to `10.10.10.70`, the router STILL sends them via OSPF! Why? Because **Longest Prefix Match (`/26` vs `/24`) ALWAYS executes BEFORE Administrative Distance!** Knowing the exact precedence order (`LPM -> AD -> Metric`) makes every `show ip route` output 100% predictable.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Choosing the Most Specific Street Sign Before Arguing Who Printed It',
      analogy:
        'Imagine looking up directions to `10.10.10.70`. Your routing table holds three signs: (1) `"Everything in the country -> Highway East"` (`0.0.0.0/0` Static), (2) `"10.10.10.0/24 -> Bridge 2"` (Static, AD 1), and (3) `"10.10.10.64/26 -> Gate 9"` (OSPF, AD 110). A router NEVER asks "Do I trust Static (`AD 1`) more than OSPF (`AD 110`)?" across *different* prefix lengths! It ALWAYS picks the **most specific matching address (`Longest Prefix Match`: `/26` beats `/24` beats `/0`)**. Administrative Distance ONLY settles arguments when two different informants give directions to the **EXACT SAME prefix and mask** (e.g., Static `/24` vs. OSPF `/24`)!',
      technicalDefinition:
        'IP forwarding selects the single best egress path via Longest Prefix Match (largest matching subnet mask length `/n`). Routing table installation chooses between competing protocol sources for the identical prefix/mask via lowest Administrative Distance (AD, 0–255), and compares candidate paths within the same protocol using lowest protocol Metric (ECMP on exact ties).',
      paragraphs: [
        'Keep the three decision rules strictly separated: **(1) Forwarding Decision (which route forwards this packet right now?)** -> **Longest Prefix Match** wins (`/32` > `/26` > `/24` > `/16` > `/0` default). **(2) Route Installation (two protocols learned the exact same `10.10.10.0/24`—which enters the RIB?)** -> **Lowest Administrative Distance** wins (`C=0, S=1, eBGP=20, EIGRP=90, OSPF=110, IS-IS=115, RIP=120`). **(3) Tie within the same protocol** -> **Lowest Metric** wins (e.g., OSPF cumulative interface cost).',
        'In `show ip route`, notice every source code: **`C` (Connected)** shows the subnet (`192.168.10.0/24`), **`L` (Local)** shows the router’s exact own interface IP as a **`/32` host route (`192.168.10.1/32`)**, **`S`** = Static, **`O`** = OSPF intra-area, **`O IA`** = OSPF inter-area, **`O E1 / O E2`** = OSPF external redistributed routes, and **`D`** = EIGRP. Also verify the hardware forwarding FIB (`show ip cef`) built from `show ip route` for wire-speed ASIC switching.',
        'When no more-specific route matches, the router falls back to the **Gateway of Last Resort (`0.0.0.0/0`, marked `S*` or `O*E2`)**. If even `0.0.0.0/0` is absent (`Gateway of last resort is not set`), the router drops the packet and returns ICMP Destination Unreachable. Also recognize **`Null0`** summary entries (e.g., `O 10.10.0.0/22 is a summary, ... Null0`): routers install an automatic `Null0` discard route for summarized ranges so any traffic matching an unused gap inside the summary drops safely instead of looping up a default route!',
      ],
    },

    deepDive: {
      intro: 'Trace `show ip route` codes, AD rankings, and LPM packet lookup order.',
      steps: [
        {
          step: 'Rule 1: Forwarding',
          title: 'Longest Prefix Match (LPM) Always Wins First',
          explanation: 'Compare all matching routes for destination IP `D`: pick the route with the highest prefix length (`/32` beats `/28` beats `/24` beats `/0`).',
        },
        {
          step: 'Rule 2: Trust',
          title: 'Administrative Distance (Exact Prefix + Mask Ties Only)',
          explanation: '`Connected=0` | `Static=1` | `eBGP=20` | `EIGRP=90` | `OSPF=110` | `RIP=120` | `iBGP=200` | `Unknown=255` (never installed).',
        },
        {
          step: 'Rule 3: Metric & ECMP',
          title: 'Lowest Cost Inside Same Protocol',
          explanation: 'OSPF uses Cost (bandwidth); EIGRP uses composite metric; RIP uses Hop Count. Identical AD + Metric install up to **4 equal-cost paths by default** (`maximum-paths` in OSPF) for **ECMP load balancing**.',
        },
        {
          step: 'Gateway of Last Resort',
          title: 'Default Route `0.0.0.0/0` (`*`)',
          explanation: 'Catches any destination IP with no more-specific match (least specific `/0` prefix length).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Anatomy of a Cisco IOS Routing Table Entry & Lookup Precedence',
        asciiFallback: `O    10.20.30.0/24 [110/20] via 172.16.1.2, 01:12:04, GigabitEthernet0/0
^         ^         ^   ^         ^                     ^
|         |         |   |         |                     +-- Outbound interface
|         |         |   |         +-- Next-hop router IP
|         |         |   +-- OSPF Cost Metric (20)
|         |         +-- Administrative Distance (110)
|         +-- Prefix & Mask Length (checked FIRST via Longest Prefix Match!)
+-- Protocol Code (C=Connected, L=Local /32, S=Static, O=OSPF, *=Default candidate)`,
      },
      workedExample: {
        title: 'Tracing Which Route Handles `10.10.5.70` Across 4 Contenders',
        context:
          'R1’s routing table holds:\n• `S* 0.0.0.0/0 [1/0] via 192.0.2.1`\n• `S 10.10.5.0/24 [1/0] via 172.16.1.2`\n• `O 10.10.5.64/26 [110/15] via 172.16.2.2`\n• `D 10.10.5.64/27 [90/30720] via 172.16.3.2`',
        steps: [
          'Check binary match for `10.10.5.70`: `0.0.0.0/0` matches; `10.10.5.0/24` matches; `10.10.5.64/26` (`.64–.127`) matches; `10.10.5.64/27` (`.64–.95`) ALSO matches!',
          'Ignore AD (`1` vs `110` vs `90`) because prefix lengths differ!',
          'Select longest prefix length: `/27` > `/26` > `/24` > `/0` -> Packet forwards out `172.16.3.2` via EIGRP `/27`!',
        ],
        outcome: 'Longest Prefix Match overrides Static AD 1 whenever masks differ.',
      },
    },

    iosCliGuide: {
      intro: 'Read `show ip route` outputs cleanly and test exact forwarding matches using `show ip route <dest-ip>`.',
      commands: [
        {
          title: 'Inspect Full Routing Table & Specific Prefix Lookup',
          promptAndCommand: 'R1# show ip route',
          output: `Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
C        10.10.1.0/24 is directly connected, GigabitEthernet0/0
L        10.10.1.1/32 is directly connected, GigabitEthernet0/0
O        10.10.2.0/24 [110/2] via 10.10.99.2, 02:14:11, GigabitEthernet0/1`,
          lineByLine: [
            { segment: 'S* 0.0.0.0/0 [1/0]', meaning: 'Static Gateway of Last Resort (`*`), AD 1, Metric 0.' },
            { segment: 'L 10.10.1.1/32', meaning: 'Local host route representing R1’s own `G0/0` IP address (destined to the router CPU itself).' },
            { segment: 'O 10.10.2.0/24 [110/2]', meaning: 'OSPF-learned route with AD 110 and cumulative cost metric 2.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip route 8.8.8.8',
        healthyLabel: 'Default Route Available (`0.0.0.0/0`)',
        healthyOutput: `Routing entry for 0.0.0.0/0, supernet | Known via "static", distance 1, metric 0`,
        brokenLabel: 'Missing Gateway of Last Resort',
        brokenOutput: `% Network not in table`,
        diagnosis:
          'When `show ip route` says `Gateway of last resort is not set`, any packet to an unlisted internet/WAN IP drops immediately until a default static route (`ip route 0.0.0.0 0.0.0.0 <next-hop>`) or dynamic default is added.',
      },
    },

    commonTraps: [
      {
        trap: 'Comparing Administrative Distance BEFORE Longest Prefix Match.',
        reality: '**Longest Prefix Match ALWAYS comes first** during packet forwarding; AD ONLY settles ties between identical prefix + mask routes.',
      },
      {
        trap: 'Thinking `L` (`10.10.1.1/32`) in `show ip route` is a loopback or error.',
        reality: 'IOS 15+ automatically adds a `/32` `L` (Local) route for every up/up router interface IP so traffic addressed to the router goes straight to its CPU.',
      },
      {
        trap: 'Thinking OSPF (`110`) beats EIGRP (`90`) because `110 > 90`.',
        reality: '**LOWER** Administrative Distance is more trustworthy: EIGRP (`90`) beats OSPF (`110`), and Static (`1`) beats both.',
      },
      {
        trap: 'Expecting a higher-AD floating static route (`AD 120`) to appear inside `show ip route` while OSPF (`AD 110`) is up.',
        reality: 'Only the winning lowest-AD route installs in `show ip route`; the higher-AD backup stays hidden in `running-config` until the primary route fails!',
      },
    ],

    keyTerms: [
      {
        term: 'Longest Prefix Match (LPM)',
        shortDef: 'Rule choosing the routing entry with the most matching network prefix bits (`/n`).',
        fullDef: 'A `/28` match always beats a `/24` match, which beats `/0`, regardless of AD or protocol.',
      },
      {
        term: 'Administrative Distance (AD)',
        shortDef: 'Trust ranking (`0–255`, lower wins) deciding which protocol installs an identical prefix/mask.',
        fullDef: 'Defaults: Connected=0, Static=1, eBGP=20, EIGRP=90, OSPF=110, IS-IS=115, RIP=120, iBGP=200.',
      },
      {
        term: 'Metric',
        shortDef: 'Protocol-specific path cost (e.g., OSPF bandwidth cost) breaking ties inside the same protocol.',
        fullDef: 'Never compared across different protocols (OSPF cost vs. RIP hops have incompatible units).',
      },
      {
        term: 'Gateway of Last Resort',
        shortDef: 'Fallback `0.0.0.0/0` (`::/0`) route matched when no more-specific route exists.',
        fullDef: 'Marked with `*` in `show ip route`.',
      },
    ],

    checkQuestions: [
      {
        id: 'c31-q1',
        prompt: 'R1’s routing table contains all four routes below. Which next-hop will R1 choose for a packet destined to `172.16.20.15`?\n1) `S* 0.0.0.0/0 via 10.0.0.1`\n2) `S 172.16.20.0/24 via 10.0.0.2`\n3) `O 172.16.20.0/26 [110/5] via 10.0.0.3`\n4) `D 172.16.20.32/28 [90/2000] via 10.0.0.4`',
        options: ['10.0.0.3 (OSPF /26)', '10.0.0.4 (EIGRP /28)', '10.0.0.2 (Static /24)', '10.0.0.1 (Default /0)'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `172.16.20.0/26` covers `.0–.63` (which includes `.15`). Because `.32/28` only covers `.32–.47`, `/26` is the longest matching prefix (`10.0.0.3`), beating both Static `/24` and Default `/0`.',
          'Incorrect: `172.16.20.32/28` only matches `.32` through `.47`, so `.15` is outside that range.',
          'Incorrect: `/24` matches `.15`, but `/26` has more matching prefix bits (`26 > 24`) and wins under Longest Prefix Match even though Static has lower AD.',
          'Incorrect: The default `/0` route is only used when no more-specific matching prefix exists.',
        ],
        takeaway: 'Check exact subnet boundaries first, then pick the longest matching prefix (`/26` > `/24` > `/0`) regardless of AD.',
      },
      {
        id: 'c31-q2',
        prompt: 'Wait—let’s test that exact habit cleanly: R1 has `S 192.168.10.0/24 via 10.1.1.2` (`AD 1`) and `O 192.168.10.128/25 [110/4] via 10.2.2.2` (`AD 110`). Which next hop wins for destination `192.168.10.150`?',
        options: ['10.2.2.2 (OSPF /25)', '10.1.1.2 (Static /24)', 'Load-balanced across both', 'Packet dropped'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `.150` sits inside `192.168.10.128/25` (`.128–.255`), and `/25` is longer than `/24`—Longest Prefix Match beats Static’s lower AD 1!',
          'Incorrect: Static AD 1 only wins when both routes advertise the exact same `/24` prefix.',
          'Incorrect: ECMP never load-balances across differing prefix lengths.',
          'Incorrect: Both match, `/25` wins.',
        ],
        takeaway: 'Longest Prefix Match ALWAYS executes before Administrative Distance.',
      },
      {
        id: 'c31-q3',
        prompt: 'R1 learns the EXACT same prefix `10.50.0.0/24` via both OSPF (`[110/2]`) and EIGRP (`[90/30720]`), plus a Static route (`[1/0]`). Which single route installs into the routing table?',
        options: ['Static (`AD 1`)', 'EIGRP (`AD 90`)', 'OSPF (`AD 110`)', 'All three via ECMP'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: With identical prefix/mask (`/24`), lowest Administrative Distance wins: Static (`1`) < EIGRP (`90`) < OSPF (`110`).',
          'Incorrect: EIGRP (`90`) loses to Static (`1`).',
          'Incorrect: OSPF (`110`) loses to both Static and EIGRP.',
          'Incorrect: ECMP only occurs within the same protocol when AD and metric tie.',
        ],
        takeaway: 'Identical prefix & mask -> Lowest Administrative Distance wins (`C=0 < S=1 < eBGP=20 < EIGRP=90 < OSPF=110`).',
      },
      {
        id: 'c31-q4',
        prompt: 'In `show ip route`, what does `L 192.168.10.1/32 is directly connected, GigabitEthernet0/0` represent?',
        options: [
          'A Local host route for the router’s own interface IP address',
          'A Loopback 0 route',
          'A Link-State OSPF external route',
          'A Layer 2 MAC address entry',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IOS creates a `/32` `L` (Local) host route for each configured up/up IPv4 interface address.',
          'Incorrect: Loopback subnets appear as `C` + `L` too, while this `L` specifically matches `Gi0/0`.',
          'Incorrect: OSPF external routes appear as `O E1` / `O E2`.',
          'Incorrect: MAC addresses live in switches’ CAM tables.',
        ],
        takeaway: '`C` = attached subnet; `L` = exact `/32` local router interface IP.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect Routing Tables & LPM Lookups in IOS Lab 04',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 04 and run `show ip route` to distinguish `C`, `L`, `S`, and `O` routes along with `[AD/Metric]`.',
      ],
      verificationCheck: 'Identify protocol, AD, metric, and next-hop for every prefix in `show ip route`.',
    },

    summaryBullets: [
      'Packet forwarding uses **Longest Prefix Match (LPM)** first—higher `/n` always wins regardless of protocol or AD.',
      'When two sources advertise the identical prefix + mask, **lowest Administrative Distance** wins (`C=0, S=1, eBGP=20, EIGRP=90, OSPF=110, RIP=120`).',
      'Equal AD + Metric within the same protocol creates **ECMP** load balancing.',
      '`C` = directly connected subnet; `L` = router’s own `/32` local interface IP; `*` = Gateway of Last Resort (`0.0.0.0/0`).',
      'If no specific route and no `0.0.0.0/0` exist, packets drop cleanly.',
    ],

    sourcesToVerify: [
      'Cisco IOS IP Routing Configuration Guide — Routing Table Selection & Administrative Distance',
    ],
  },

  'ccna.core.rt.static-routing': {
    id: 'ccna.core.rt.static-routing',
    moduleId: 'ccna',
    unitTitle: 'Unit 3: IP Routing',
    topicTitle: '3.2 / 3.3 Troubleshoot IPv4 & IPv6 Static Routing',
    code: '3.2.1',
    title: 'Default, Network, Host & Floating Static Routes (IPv4/IPv6)',
    readMinutes: 13,
    prerequisites: ['1.4.1', '3.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['3.3'],
    v20ExamTopics: ['3.2'],

    learningObjectives: [
      'Configure and read all four static route types in IPv4 (`ip route`) and IPv6 (`ipv6 route`): **Default**, **Network**, **Host (`/32` / `/128`)**, and **Floating Static**.',
      'Explain why **next-hop IP** (or fully specified `exit-interface + next-hop IP`) prevents ARP flooding on multi-access Ethernet links.',
      'Build automatic WAN failover using a **Floating Static Route** whose AD exceeds the primary protocol (e.g., `AD 115` > OSPF `110`, or `AD 5` > primary static `1`).',
      'Diagnose common static routing faults: one-way routing (missing return route!), wrong next-hop, and unreachable next-hop.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Floating Static Backup Fails If Its AD Is Set to 100 Instead of 115',
      narrative:
        'A branch office runs OSPF (`AD 110`) over primary fiber and keeps a slow cellular LTE backup link (`ip route 0.0.0.0 0.0.0.0 203.0.113.99 <AD>`). If the engineer accidentally types AD `100` (lower than OSPF’s `110`!) instead of `115` or `200`, the router immediately abandons the fast fiber link and pushes 100% of company traffic onto the metered LTE backup! And if they forget the return static route back to the branch LAN at HQ, pings vanish mid-flight.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Hand-Written Road Signs, Express Lanes & Emergency Detours',
      analogy:
        'Dynamic protocols like OSPF automatically recalculate maps when roads close, whereas **Static Routes** are hand-bolted road signs you write yourself: **(1) Network Route** points to an entire remote subnet (`10.20.0.0/24`); **(2) Host Route** (`/32` or `/128`) pins traffic to ONE exact server IP (`10.20.5.99/32`); **(3) Default Route** (`0.0.0.0/0` or `::/0`) says "All unknown destinations head out to the ISP"; and **(4) Floating Static Route** is an emergency detour sign kept hidden inside the trunk (`AD 115` or `200`)—invisible while OSPF (`AD 110`) works, then automatically popping into `show ip route` the second the primary link dies!',
      technicalDefinition:
        'Static routes (`ip route <prefix> <mask> {<next-hop> | <exit-if> [<next-hop>]} [ad]`, and IPv6 `ipv6 route <prefix>/<len> ...`) manually inject deterministic paths with default AD `1`, supporting `/32` (`/128`) host precision, `/0` default fallback, and configurable Administrative Distance (`1–254`) for backup floating failover.',
      paragraphs: [
        'For **Ethernet multi-access interfaces**, ALWAYS specify a **next-hop IP** (e.g., `ip route 10.50.0.0 255.255.255.0 172.16.1.2`)—or both interface + next-hop (`Gi0/0 172.16.1.2`). Specifying *only* an Ethernet exit interface (`ip route 10.50.0.0 255.255.255.0 Gi0/0`) forces the router to ARP for every external IP on the wire (relying on Proxy ARP!). On IPv6, if your next hop is a Link-Local address (`FE80::2`), IOS **requires** including the outbound interface (`ipv6 route 2001:db8:2::/64 GigabitEthernet0/0 fe80::2`) because `FE80::2` could exist on multiple ports!',
        'The #1 static routing mistake is **forgetting the return path**: Router A knows how to reach `10.20.0.0/24` via Router B, yet Router B has zero route back to Router A’s LAN (`10.10.0.0/24`). Every ping reaches the far PC and dies silently on the way home!',
        'For **Floating Static Routes**, pick an AD strictly **higher** than the primary route (`AD 5` beats primary static `1`; `AD 115` or `200` floats safely behind OSPF `110` or EIGRP `90`).',
      ],
    },

    deepDive: {
      intro: 'Review exact IPv4 and IPv6 syntax for all four static route forms.',
      steps: [
        {
          step: '1. Network & Default',
          title: 'Standard Subnet & `0.0.0.0/0` / `::/0`',
          explanation: '`ip route 10.20.0.0 255.255.255.0 172.16.0.2` | `ip route 0.0.0.0 0.0.0.0 203.0.113.1` | `ipv6 route ::/0 GigabitEthernet0/1 fe80::1`.',
        },
        {
          step: '2. Host Route',
          title: 'Pinning a Single Server (`/32` / `/128`)',
          explanation: '`ip route 198.51.100.10 255.255.255.255 172.16.0.2` | `ipv6 route 2001:db8:99::10/128 2001:db8:1::2`. Wins via LPM over any `/24` or `/64`!',
        },
        {
          step: '3. Floating Static',
          title: 'Primary Down -> Backup Floats Into RIB',
          explanation: '`ip route 10.20.0.0 255.255.255.0 172.16.99.2 150`. Hidden while OSPF (`AD 110`) is active; activates immediately if OSPF withdraws the route.',
        },
        {
          step: '4. Recursive Lookup',
          title: 'Next-Hop Must Be Reachable!',
          explanation: 'A static route only enters `show ip route` if its next-hop IP is currently reachable via an up/up interface or another active route.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Floating Static Backup Behavior & Link-Local IPv6 Rule',
        asciiFallback: `Primary Path (OSPF AD 110):   [R1] === Fiber ===> [HQ]   <-- Active in 'show ip route'
Backup Path (Static AD 150):  [R1] --- LTE -----> [HQ]   <-- Hidden until OSPF drops!

IPv6 Link-Local Next-Hop Rule:
  ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2   (MUST include interface with FE80::!)`,
      },
      workedExample: {
        title: 'Fixing a Missing Floating Static + IPv6 Link-Local Syntax Error',
        context:
          'R1 has `ip route 10.50.0.0 255.255.255.0 192.168.99.2 95` alongside OSPF (`AD 110`), AND rejects `ipv6 route ::/0 fe80::1`.',
        steps: [
          'Fix IPv4 AD: `95 < 110` causes the backup route to hijack primary OSPF traffic! Remove `no ip route ... 95` and replace with AD `120` (`> 110`).',
          'Fix IPv6 syntax: include the exit interface before `fe80::1`: `ipv6 route ::/0 GigabitEthernet0/1 fe80::1`.',
        ],
        outcome: 'Primary OSPF handles all normal traffic while LTE/IPv6 failover works deterministically.',
      },
    },

    iosCliGuide: {
      intro: 'Verify installed static routes vs. hidden floating static routes.',
      commands: [
        {
          title: 'Configure IPv4/IPv6 Static, Host & Floating Backup Routes',
          promptAndCommand: 'R1(config)# ip route 10.50.0.0 255.255.255.0 172.16.1.2',
          output: `R1(config)# ip route 10.50.0.99 255.255.255.255 172.16.2.2
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1 150
R1(config)# ipv6 route 2001:db8:50::/64 Gi0/1 fe80::2`,
          lineByLine: [
            { segment: '255.255.255.255', meaning: '`/32` Host route—matches only `10.50.0.99` and overrides `/24` via LPM.' },
            { segment: '150 (trailing AD)', meaning: 'Floating static default route that stays standby behind OSPF (`110`) or primary static (`1`).' },
            { segment: 'Gi0/1 fe80::2', meaning: 'Explicit exit interface required whenever an IPv6 static next-hop is Link-Local (`FE80::`).' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip route static',
        healthyLabel: 'Primary Static Installed (`[1/0]`), Floating Backup Waiting Standby',
        healthyOutput: `S    10.50.0.0/24 [1/0] via 172.16.1.2
S    10.50.0.99/32 [1/0] via 172.16.2.2`,
        brokenLabel: 'Next-Hop Interface Down or Wrong AD Causing Backup Hijack',
        brokenOutput: `S    10.50.0.0/24 [95/0] via 172.16.99.2  <-- Hijacked OSPF (110)!`,
        diagnosis:
          'Check `show running-config | include ip route` to verify AD values—remember floating routes do NOT show in `show ip route` until the primary fails.',
      },
    },

    commonTraps: [
      {
        trap: 'Setting a floating static AD lower than the primary routing protocol (`90` vs EIGRP `90` or `100` vs OSPF `110`).',
        reality: 'Floating AD MUST be strictly **higher** than the primary protocol (e.g., `5` over Static `1`, `120` over OSPF `110`).',
      },
      {
        trap: 'Typing `ipv6 route ::/0 fe80::1` without the outbound interface name.',
        reality: 'Link-local addresses are identical across every link, so IOS requires `exit-interface + fe80::...`.',
      },
      {
        trap: 'Adding a static route on R1 toward R2’s LAN and forgetting the return static route on R2.',
        reality: 'IP routing is strictly unidirectional per router—both ends need paths in each direction.',
      },
      {
        trap: 'Expecting a static route to work if its own outbound interface stays `up/up` while the far-end ISP gateway dies.',
        reality: 'Exit-interface static routes stay installed as long as the local port has link; prefer next-hop IPs (or IP SLA tracking in enterprise) for cleaner failover.',
      },
    ],

    keyTerms: [
      {
        term: 'Floating Static Route',
        shortDef: 'Backup static route configured with a higher Administrative Distance than the primary route.',
        fullDef: 'Stays invisible in the routing table while the lower-AD primary route is healthy, taking over automatically on outage.',
      },
      {
        term: 'Host Route (`/32` / `/128`)',
        shortDef: 'Static route matching a single IPv4 (`/32`) or IPv6 (`/128`) destination.',
        fullDef: 'Wins over broader subnet routes via Longest Prefix Match.',
      },
      {
        term: 'Default Static Route (`0.0.0.0/0` / `::/0`)',
        shortDef: 'Catch-all route matching any destination with zero more-specific entries.',
        fullDef: 'Typically points toward an edge ISP or core hub.',
      },
    ],

    checkQuestions: [
      {
        id: 'c32-q1',
        prompt: 'A branch router learns `10.40.0.0/24` via OSPF (`AD 110`). You want to configure a backup static route via `192.168.99.2` that activates ONLY if OSPF drops. Which command works?',
        options: [
          'ip route 10.40.0.0 255.255.255.0 192.168.99.2 120',
          'ip route 10.40.0.0 255.255.255.0 192.168.99.2 100',
          'ip route 10.40.0.0 255.255.255.0 192.168.99.2',
          'ip route 10.40.0.0 255.255.255.0 192.168.99.2 1',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: AD `120` is higher than OSPF `110`, so it remains standby until OSPF withdraws the route.',
          'Incorrect: `100 < 110`, so it immediately overrides OSPF.',
          'Incorrect: Default static AD is `1`, immediately overriding OSPF.',
          'Incorrect: Explicit AD `1` overrides OSPF.',
        ],
        takeaway: 'Floating static AD must exceed the primary route’s AD (`> 110` for OSPF).',
      },
      {
        id: 'c32-q2',
        prompt: 'Which command correctly configures an IPv6 default static route pointing to an ISP neighbor whose Link-Local IP is `FE80::1` off `GigabitEthernet0/1`?',
        options: [
          'ipv6 route ::/0 GigabitEthernet0/1 fe80::1',
          'ipv6 route ::/0 fe80::1',
          'ipv6 route 0.0.0.0/0 GigabitEthernet0/1 fe80::1',
          'ip route ::/0 fe80::1',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Link-local next hops require BOTH the outbound interface and the `FE80::` address.',
          'Incorrect: IOS rejects link-local next hops without an exit interface.',
          'Incorrect: `0.0.0.0/0` is IPv4.',
          'Incorrect: `ip route` is IPv4.',
        ],
        takeaway: 'IPv6 static route + `FE80::` next-hop = MUST include exit interface.',
      },
      {
        id: 'c32-q3',
        prompt: 'Which static route forces traffic ONLY for server `10.10.20.55` across link `172.16.5.2`, while all other hosts in `10.10.20.0/24` follow OSPF?',
        options: [
          'ip route 10.10.20.55 255.255.255.255 172.16.5.2',
          'ip route 10.10.20.55 255.255.255.0 172.16.5.2',
          'ip route 10.10.20.0 255.255.255.255 172.16.5.2',
          'ip route 0.0.0.0 0.0.0.0 172.16.5.2',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `/32` (`255.255.255.255`) creates a Host Route for `.55` alone, beating `/24` via LPM.',
          'Incorrect: `.255.255.255.0` covers the entire `/24` subnet (and `.55` is an invalid network prefix with `/24`).',
          'Incorrect: Targets `.0` instead of `.55`.',
          'Incorrect: Changes the default route for all networks.',
        ],
        takeaway: 'Use `255.255.255.255` (`/32`) or `/128` for exact single-host static routes.',
      },
      {
        id: 'c32-q4',
        prompt: 'R1 has `ip route 192.168.2.0 255.255.255.0 10.0.0.2` toward R2. R1’s LAN (`192.168.1.0/24`) pings `192.168.2.10` and fails, while R2 CAN ping `192.168.2.10`. What is missing?',
        options: [
          'A return route on R2 pointing `192.168.1.0/24` back to R1 (`10.0.0.1`)',
          'PortFast on R1',
          'A `/32` broadcast mask',
          'An SSH key on R2',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Packets reach `192.168.2.10`, yet R2 drops the replies because R2 lacks a route back to `192.168.1.0/24`.',
          'Incorrect: Unrelated to static L3 routing.',
          'Incorrect: Invalid concept.',
          'Incorrect: SSH is management plane.',
        ],
        takeaway: 'Always verify static routes in BOTH directions (forward and return!).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Verify Static & Connected Routes in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Inspect `show ip route` and test static/floating static failover concepts in IOS Labs.',
      ],
      verificationCheck: 'Verify static route installation and AD behavior.',
    },

    summaryBullets: [
      'Four static route types: **Network**, **Default (`0.0.0.0/0` / `::/0`)**, **Host (`/32` / `/128`)**, and **Floating Static (AD > primary)**.',
      'Prefer **next-hop IP** (or `interface + next-hop`) on Ethernet links; IPv6 Link-Local (`FE80::`) next-hops require `interface + FE80::...`.',
      'Floating static routes hide out of `show ip route` until the lower-AD primary route drops.',
      'Always verify **both forward and return routes** across routers.',
      'Next-hop IPs must be recursively reachable for a static route to stay installed.',
    ],

    sourcesToVerify: [
      'Cisco IOS IP Routing Configuration Guide — Static Routing & IPv6 Static Routes',
    ],
  },

  'ccna.core.rt.ospf-concepts': {
    id: 'ccna.core.rt.ospf-concepts',
    moduleId: 'ccna',
    unitTitle: 'Unit 3: IP Routing',
    topicTitle: '3.3 / 3.4 Single-Area OSPFv2 and OSPFv3',
    code: '3.3.1',
    title: 'How Link-State Routing, LSAs & Dijkstra SPF Work',
    readMinutes: 11,
    prerequisites: ['3.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['3.4'],
    v20ExamTopics: ['3.3'],

    learningObjectives: [
      'Contrast **Link-State** protocols (OSPF: full shared topology map + independent Dijkstra SPF) against **Distance-Vector** ("routing by rumor").',
      'Explain the three OSPF data structures: **Neighbor Table**, **Link-State Database (LSDB)**, and **Routing Table (RIB)**.',
      'Calculate OSPFv2 interface cost (`Reference Bandwidth / Interface Bandwidth`) and explain why default `100 Mbps` fails to distinguish 1G vs 10G links until adjusted (`auto-cost reference-bandwidth`).',
      'Configure single-area OSPFv2 cleanly using `router ospf <pid>`, `router-id`, `network ... area 0`, `ip ospf <pid> area 0`, and `passive-interface`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Default OSPF Cost Treats a 10 Gbps Fiber Link Identically to a 100 Mbps Wire',
      narrative:
        'Suppose you upgrade your core uplink from 1 Gbps to 10 Gbps while leaving a slow 100 Mbps backup path active in OSPF. By default, Cisco OSPF divides `100 Mbps` by interface bandwidth—clamping ANY link `>= 100 Mbps` to **Cost = 1**! Unless you tune `auto-cost reference-bandwidth` uniformly across every router (e.g., `10000` for 10G or `100000` for 100G), OSPF thinks 100M, 1G, and 10G links are equally fast! Understanding LSDBs, SPF cost, and `passive-interface` prepares you for OSPF states and OSPFv3 next.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Passing Around Rumors vs. Everyone Holding an Identical Street Atlas',
      analogy:
        'Legacy Distance-Vector protocols work like asking a stranger at an intersection: "How many miles to Main Street?"—you trust their word without seeing the rest of the map (**routing by rumor**). **OSPF (Link-State)** gives EVERY router in Area 0 the exact same **blank-checked street atlas (the LSDB)** built from puzzle pieces called **LSAs (Link-State Advertisements)** describing every road and speed limit! Once every router holds the **exact same atlas**, each router independently runs **Dijkstra’s Shortest Path First (SPF)** math from its own front door to pick the fastest loop-free routes.',
      technicalDefinition:
        'OSPF (Open Shortest Path First) is a classless, standards-based Link-State IGP (`AD 110`) maintaining a Neighbor Table (`show ip ospf neighbor`), synchronized Area LSDB (`show ip ospf database`), and SPF-computed Routing Table (`show ip route ospf`) weighted by cumulative interface Cost (`Reference-BW / Interface-BW`).',
      paragraphs: [
        'Every OSPF router keeps three distinct tables: **(1) Neighbor Table** (verified Hello peers), **(2) Topology / Link-State Database (LSDB)** (identical across every router in Area 0!), and **(3) Routing Table** (that router’s own best loop-free paths chosen by Dijkstra SPF).',
        'OSPF chooses best paths strictly by lowest **cumulative Cost**, NOT hop count! Default `Reference Bandwidth` = `100 Mbps` (`10^8 bps`). `Cost = Reference / BW`: a `10 Mbps` link = `10`, `100 Mbps` = `1`, `1 Gbps` = `100/1000 = 0.1 -> rounds up to 1`, `10 Gbps` = `1`! Running `auto-cost reference-bandwidth 10000` (in Mbps = 10 Gbps) on ALL routers spreads costs cleanly: 10G=`1`, 1G=`10`, 100M=`100`.',
        'On user LAN ports where no other OSPF router lives (like `Gi0/0` facing PCs), configure **`passive-interface GigabitEthernet0/0`** (or `passive-interface default` + `no passive-interface` on router uplinks). Passive interfaces still advertise their subnet into OSPF while blocking unnecessary Hello packets toward user laptops!',
      ],
    },

    deepDive: {
      intro: 'Walk through the 3 OSPF tables, cost math, and clean single-area Area 0 configuration.',
      steps: [
        {
          step: '1. Three Tables',
          title: 'Neighbor -> LSDB -> Routing Table',
          explanation: 'Hello packets build Neighbor Table -> DBD/LSU packets sync LSDB -> Dijkstra SPF populates Routing Table (`O` routes).',
        },
        {
          step: '2. Cost Tuning',
          title: '`auto-cost reference-bandwidth <Mbps>` Consistency',
          explanation: 'Set uniformly across ALL OSPF routers (e.g., `10000` for 10G networks or `100000` for 100G) or manually adjust a single link via `ip ospf cost <val>`.',
        },
        {
          step: '3. Enabling Interfaces',
          title: 'Wildcard `network` Statement vs. Interface-Level `ip ospf`',
          explanation: '`router ospf 1` -> `network 10.10.1.0 0.0.0.255 area 0` OR exact host wildcard `network 10.10.1.1 0.0.0.0 area 0` OR modern clean interface command `ip ospf 1 area 0`!',
        },
        {
          step: '4. Passive Interfaces',
          title: 'Security & Noise Reduction on User LANs',
          explanation: '`passive-interface Gi0/0` stops sending OSPF Hellos to user PCs (preventing rogue OSPF injection) while still advertising `Gi0/0`’s subnet!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'OSPF Cost Formula & Clean Single-Area Passive-Interface Layout',
        asciiFallback: `Cost = Reference Bandwidth (default 100 Mbps) / Interface Bandwidth
  With 'auto-cost reference-bandwidth 10000' (10 Gbps):
    10G = Cost 1  |  1G = Cost 10  |  100M = Cost 100

[User LAN Gi0/0: passive-interface!] --- [R1 (Area 0)] ===(Active OSPF Gi0/1)===> [R2 (Area 0)]
   (Subnet advertised in LSAs, NO Hellos sent toward users!)`,
      },
      workedExample: {
        title: 'Fixing a Suboptimal 100M vs 1G Path & Securing User Ports',
        context: 'R1 prefers a 100 Mbps direct link over a 2-hop 1 Gbps path because all three links show Cost=1!',
        steps: [
          'Configure `auto-cost reference-bandwidth 1000` (1G) or `10000` (10G) under `router ospf 1` on EVERY router in Area 0.',
          'Now 1G links have Cost `10` (`2 hops = 20`), whereas the 100M link has Cost `100` -> SPF shifts cleanly onto the 2-hop 1G path!',
          'Add `passive-interface default`, then `no passive-interface Gi0/1` on router-to-router uplinks only.',
        ],
        outcome: 'Traffic takes the fastest multi-gigabit path and user LANs never receive OSPF Hellos.',
      },
    },

    iosCliGuide: {
      intro: 'Verify OSPF process settings, passive interfaces, and calculated interface costs.',
      commands: [
        {
          title: 'Configure Clean Single-Area OSPFv2 & Verify Cost',
          promptAndCommand: 'R1# show ip protocols',
          output: `Routing Protocol is "ospf 1"
  Router ID 1.1.1.1
  Reference bandwidth unit is 10000 mbps
  Passive Interface(s):
    GigabitEthernet0/0
  Routing for Networks:
    10.10.1.1 0.0.0.0 area 0
    172.16.0.1 0.0.0.0 area 0`,
          lineByLine: [
            { segment: 'Reference bandwidth unit is 10000 mbps', meaning: 'Confirms `auto-cost reference-bandwidth 10000` is active so 1G = Cost 10 and 10G = Cost 1.' },
            { segment: 'Passive Interface(s): GigabitEthernet0/0', meaning: 'LAN advertised into Area 0 without emitting Hello packets to PCs.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip ospf interface brief',
        healthyLabel: 'Correct Area 0 Interfaces & Tuned Cost',
        healthyOutput: `Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/1        1     0               172.16.0.1/30      10    DR    1/1`,
        brokenLabel: 'Accidentally Marked Uplink `Gi0/1` as Passive',
        brokenOutput: `Gi0/1        1     0               172.16.0.1/30      10    DR    0/0  (No Hellos!)`,
        diagnosis:
          'When `passive-interface` sits on a router-to-router uplink (`Gi0/1`), Hellos stop and the OSPF neighbor drops (`0/0`). Keep `passive-interface` strictly on host LANs!',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking `passive-interface` stops OSPF from advertising that interface’s subnet.',
        reality: 'Passive interfaces **STILL advertise** their subnet in LSAs—they simply stop sending/accepting Hello packets on that port.',
      },
      {
        trap: 'Changing `auto-cost reference-bandwidth` on ONLY one router.',
        reality: 'Configure the exact same reference bandwidth on **every router** in the OSPF domain so cost math stays consistent.',
      },
      {
        trap: 'Assuming OSPF Process ID (`router ospf 1` vs `router ospf 99`) must match between neighbors.',
        reality: 'Process ID is strictly local; Area ID (`area 0`) must match.',
      },
      {
        trap: 'Thinking the `network 10.10.1.0 0.0.0.255 area 0` mask controls the subnet mask advertised to neighbors.',
        reality: 'The `network` statement wildcard only selects **which local interfaces** activate OSPF; the interface’s real `ip address` mask is advertised in LSAs.',
      },
    ],

    keyTerms: [
      {
        term: 'Link-State Database (LSDB)',
        shortDef: 'Shared area topology map built from LSAs; identical on all routers in an area.',
        fullDef: 'Inspectable via `show ip ospf database`; feeds Dijkstra SPF to build each router’s unique routing table.',
      },
      {
        term: 'OSPF Cost Metric',
        shortDef: 'Cumulative interface metric (`Reference BW / Interface BW`, default Ref = 100 Mbps).',
        fullDef: 'Lower total cost wins; tune with `auto-cost reference-bandwidth` for 1G/10G/100G networks.',
      },
      {
        term: 'passive-interface',
        shortDef: 'Blocks sending/receiving OSPF Hellos on a port while still advertising its subnet.',
        fullDef: 'Best practice on all user/server access LANs to prevent rogue OSPF peering.',
      },
    ],

    checkQuestions: [
      {
        id: 'c331-q1',
        prompt: 'Why do 100 Mbps, 1 Gbps, and 10 Gbps Ethernet ports ALL receive an identical OSPF default cost of `1` on Cisco IOS?',
        options: [
          'Default OSPF Reference Bandwidth is 100 Mbps, and any `100 / BW` result below 1 rounds up to 1.',
          'OSPF only supports hop count up to 15.',
          'All Ethernet cables run at 100 Mbps under OSPF.',
          'Cost defaults to 1 only on Loopback ports.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `100 / 100 = 1`, `100 / 1000 = 0.1 -> 1`, `100 / 10000 = 0.01 -> 1`. Raise `auto-cost reference-bandwidth` across all routers to separate 1G/10G speeds.',
          'Incorrect: Hop count up to 15 belongs to legacy RIP.',
          'Incorrect: Ethernet runs at 1G/10G+; only the math reference defaults to 100M.',
          'Incorrect: Loopbacks also default to Cost 1.',
        ],
        takeaway: 'Tune `auto-cost reference-bandwidth` on ALL OSPF routers in modern 1G/10G+ networks.',
      },
      {
        id: 'c331-q2',
        prompt: 'What happens when you apply `passive-interface GigabitEthernet0/0` under `router ospf 1`?',
        options: [
          'R1 stops sending/accepting OSPF Hellos on `Gi0/0`, yet still advertises `Gi0/0`’s subnet into Area 0.',
          'R1 stops advertising `Gi0/0`’s subnet completely.',
          'R1 shuts down `Gi0/0` at Layer 1.',
          'R1 resets its Router ID.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Passive interfaces advertise their connected network cleanly while preventing OSPF adjacencies on that port.',
          'Incorrect: The subnet stays advertised in Type-1 Router LSAs.',
          'Incorrect: Interface remains `up/up` for user data.',
          'Incorrect: Router ID stays unchanged.',
        ],
        takeaway: '`passive-interface` = advertise subnet + block Hello neighbor formation.',
      },
      {
        id: 'c331-q3',
        prompt: 'Which three data tables does every OSPF router maintain?',
        options: [
          'Neighbor Table, Link-State Database (LSDB), and Routing Table',
          'MAC Table, Spanning-Tree Table, and NAT Table',
          'DHCP Binding Table, ARP Table, and Syslog Buffer',
          'Neighbor Table, Hop-Count Rumor Table, and BGP ASN Table',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Neighbor Table (`show ip ospf neighbor`), LSDB (`show ip ospf database`), and Routing Table (`show ip route`).',
          'Incorrect: Switch/NAT tables.',
          'Incorrect: Services/host tables.',
          'Incorrect: Hop-count rumor describes RIP.',
        ],
        takeaway: 'OSPF runs Neighbor Table -> Identical Area LSDB -> Dijkstra SPF -> Routing Table.',
      },
      {
        id: 'c331-q4',
        prompt: 'On a router with `auto-cost reference-bandwidth 10000` (10 Gbps), what OSPF cost does a 1 Gbps (`1000 Mbps`) interface receive?',
        options: ['10', '1', '100', '1000'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `10,000 Mbps / 1,000 Mbps = Cost 10`.',
          'Incorrect: `Cost 1` corresponds to 10 Gbps here.',
          'Incorrect: `Cost 100` corresponds to 100 Mbps.',
          'Incorrect: `Cost 1000` corresponds to 10 Mbps.',
        ],
        takeaway: 'Cost = Reference Bandwidth (Mbps) / Interface Bandwidth (Mbps).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Fix Passive Interface & Area OSPF Cost in IOS Lab 04',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 04 (Single-Area OSPF Adjacency & Passive Interface) and inspect `show ip ospf interface` and `show ip protocols`.',
      ],
      verificationCheck: 'Remove erroneous passive-interface on router uplinks while keeping user LANs passive.',
    },

    summaryBullets: [
      'OSPF (`AD 110`) is an open-standard Link-State IGP using Dijkstra SPF over an identical Area LSDB.',
      'Three OSPF tables: Neighbor Table (`show ip ospf neighbor`), LSDB (`show ip ospf database`), Routing Table (`show ip route`).',
      'Cost = `Reference BW / Interface BW`; tune `auto-cost reference-bandwidth` uniformly across all routers for 1G/10G differentiation.',
      'Use `passive-interface` on user LANs so subnets advertise without emitting OSPF Hellos.',
      'Next lesson (`3.3.2`) traces every OSPF neighbor state (`Down -> Full`) and DR/BDR election.',
    ],

    sourcesToVerify: [
      'RFC 2328 — OSPF Version 2 & Cisco IOS OSPF Configuration Guide',
    ],
  },

  'ccna.v2.3.3.3': {
    id: 'ccna.v2.3.3.3',
    moduleId: 'ccna',
    unitTitle: 'Unit 3: IP Routing',
    topicTitle: '3.3 Single-Area OSPFv2 and OSPFv3',
    code: '3.3.3',
    title: 'Configuring & Verifying Single-Area OSPFv3 for IPv6',
    readMinutes: 12,
    prerequisites: ['1.4.1', '3.3.2'],
    versionScope: 'v2.0-only',
    v20ExamTopics: ['3.3'],

    learningObjectives: [
      'Explain how **OSPFv3 (RFC 5340)** adapts OSPFv2 to IPv6 while preserving core concepts (Router ID, Areas, Hello timers, DR/BDR, SPF).',
      'Identify key differences: **32-bit dotted-decimal Router ID** is still required, Hellos target **`FF02::5` / `FF02::6`**, and interfaces enable OSPFv3 directly (**no `network` statement!**) using **Link-Local (`FE80::`) next hops**.',
      'Configure single-area OSPFv3 on Cisco IOS (`ipv6 unicast-routing`, `ipv6 router ospf <pid>`, `router-id`, and `ipv6 ospf <pid> area 0` per interface).',
      'Verify OSPFv3 neighbors and routes with `show ipv6 ospf neighbor` and `show ipv6 route ospf`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why `ipv6 router ospf 1` Fails With Zero Router ID on an IPv6-Only Router',
      narrative:
        'CCNA v2.0 explicitly brings single-area **OSPFv3** into Topic 3.3! An engineer sets up an IPv6-only router with clean `2001:db8::/64` addresses and zero IPv4 addresses anywhere, types `ipv6 router ospf 1`, and gets `% OSPFv3: Router ID could not be chosen`! Because OSPFv3 STILL identifies routers using a **32-bit IPv4-formatted Router ID** (e.g., `1.1.1.1`), you MUST configure `router-id 1.1.1.1` manually when no IPv4 address exists—AND enable OSPFv3 per interface (`ipv6 ospf 1 area 0`) since `network` statements no longer exist!',
    },

    plainEnglish: {
      analogyTitle: 'Think of the Exact Same OSPF Engine Upgraded for IPv6 Roads',
      analogy:
        'If OSPFv2 is a well-tested delivery engine built for IPv4 addresses, **OSPFv3** keeps the exact same engine underneath—same states (`Down -> Full`), same 10/40s Hello/Dead timers, same DR/BDR election, and the exact same **32-bit `x.x.x.x` Router ID badge**—while changing three external hookups for IPv6: **(1)** It speaks directly over **`FE80::` Link-Local addresses** (`FF02::5` AllSPFRouters, `FF02::6` AllDRouters); **(2)** You turn it on directly under each interface (`ipv6 ospf 1 area 0`) instead of typing `network` statements; and **(3)** Because an IPv6-only router has no IPv4 addresses to auto-borrow for its Router ID, always set `router-id 1.1.1.1` explicitly!',
      technicalDefinition:
        'OSPFv3 (RFC 5340) routes IPv6 prefixes over IP protocol 89 using link-local next-hop addresses (`FE80::`) and IPv6 multicast destinations (`FF02::5` / `FF02::6`), configured per interface (`ipv6 ospf <pid> area <id>`) with a mandatory 32-bit dotted-decimal Router ID.',
      paragraphs: [
        'Compare **OSPFv2 vs. OSPFv3** cleanly for the exam: Both use IP protocol 89, `AD 110`, Dijkstra SPF, 10s/40s default timers, DR/BDR election, and 32-bit Router IDs. What changes? OSPFv3 removes `network` statements completely—every interface joins via **`ipv6 ospf 1 area 0`** under `(config-if)#`!',
        'Notice another huge difference: OSPFv3 **neighbors over `FE80::` Link-Local addresses**, NOT Global Unicast `2001:db8::` addresses—meaning `show ipv6 route ospf` installs remote `2001:db8::/64` prefixes pointing `via FE80::2, GigabitEthernet0/1`!',
        'Classic OSPFv3 does NOT include built-in MD5/plaintext auth inside OSPF headers—it relies on IPv6 IPsec (ESP/AH) if needed—and remember **`ipv6 unicast-routing`** must be enabled globally before `ipv6 router ospf 1` or IPv6 forwarding will work!',
      ],
    },

    deepDive: {
      intro: 'Walk through OSPFv3 setup commands and compare OSPFv2 vs. OSPFv3 verification outputs.',
      steps: [
        {
          step: 'Step 1: Global Prereqs',
          title: 'Enable `ipv6 unicast-routing` + Process + 32-Bit `router-id`',
          explanation: '`ipv6 unicast-routing` -> `ipv6 router ospf 1` -> `router-id 1.1.1.1` (always set explicitly!).',
        },
        {
          step: 'Step 2: Per-Interface Activation',
          title: 'Use `ipv6 ospf <pid> area 0` (No `network` Command!)',
          explanation: 'Under `(config-if)#`: `ipv6 address 2001:db8:1::1/64` -> `ipv6 ospf 1 area 0`. Optionally add `ipv6 ospf network point-to-point` on 2-router Ethernet links!',
        },
        {
          step: 'Step 3: Passive & Verification',
          title: 'Check `show ipv6 ospf neighbor` & `show ipv6 route ospf`',
          explanation: 'Set `passive-interface GigabitEthernet0/0` under `ipv6 router ospf 1` for user LANs. Verify neighbors reach `FULL` and routes list `FE80::` next-hops.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'OSPFv2 vs. OSPFv3 Key Differences Summary',
        asciiFallback: `Feature           OSPFv2 (IPv4)                     OSPFv3 (IPv6)
Multicast Dest:   224.0.0.5 / 224.0.0.6             FF02::5 / FF02::6
Next-Hop Peering: Interface IPv4 Address            Link-Local (FE80::) Address
Interface Config: 'network' stmt OR 'ip ospf'       Per-Interface ONLY ('ipv6 ospf 1 area 0')
Router ID:        32-bit (auto IPv4 or manual)      32-bit (MUST configure manual if IPv6-only!)
Show Commands:    show ip ospf neighbor             show ipv6 ospf neighbor`,
      },
      workedExample: {
        title: 'Bringing Up OSPFv3 Between R1 and R2 on an IPv6-Only Segment',
        context: 'R1 and R2 share `2001:db8:12::/64` on `G0/1`, with zero IPv4 interfaces.',
        steps: [
          'On R1: `ipv6 unicast-routing` -> `ipv6 router ospf 1` -> `router-id 1.1.1.1` -> `interface G0/1` -> `ipv6 address 2001:db8:12::1/64` -> `ipv6 ospf 1 area 0`.',
          'On R2: same steps with `router-id 2.2.2.2` and `2001:db8:12::2/64`.',
          'Run `show ipv6 ospf neighbor`: R1 displays Neighbor ID `2.2.2.2` in `FULL/DR` with Interface `G0/1`, and `show ipv6 route ospf` installs remote IPv6 LANs `via FE80::..., G0/1`.',
        ],
        outcome: 'Clean single-area IPv6 OSPF routing with zero IPv4 dependency once manual 32-bit RIDs are set.',
      },
    },

    iosCliGuide: {
      intro: 'Verify OSPFv3 neighbors and installed IPv6 OSPF routes (`O`).',
      commands: [
        {
          title: 'Verify OSPFv3 Neighbor Table & IPv6 Route Table',
          promptAndCommand: 'R1# show ipv6 ospf neighbor',
          output: `            OSPFv3 Router with ID (1.1.1.1) (Process ID 1)

Neighbor ID     Pri   State           Dead Time   Interface ID    Interface
2.2.2.2           1   FULL/DR         00:00:36    3               GigabitEthernet0/1`,
          lineByLine: [
            { segment: 'Router with ID (1.1.1.1)', meaning: '32-bit dotted-decimal Router ID—configured manually on IPv6-only routers.' },
            { segment: 'FULL/DR', meaning: 'Identical state machine and DR/BDR roles as OSPFv2.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ipv6 route ospf',
        healthyLabel: 'OSPFv3 Route Installed via Neighbor Link-Local (`FE80::`)',
        healthyOutput: `O   2001:DB8:20::/64 [110/2]
     via FE80::202:42FF:FE00:2, GigabitEthernet0/1`,
        brokenLabel: 'Missing `router-id` on IPv6-Only Router',
        brokenOutput: `% OSPFv3: Router ID could not be chosen`,
        diagnosis:
          'Always configure `router-id x.x.x.x` under `ipv6 router ospf <pid>` and ensure `ipv6 unicast-routing` is present globally.',
      },
    },

    commonTraps: [
      {
        trap: 'Looking for a `network 2001:db8::/64 area 0` command under `ipv6 router ospf 1`.',
        reality: 'OSPFv3 has **NO `network` command**; activate interfaces directly via `ipv6 ospf <pid> area 0` under `(config-if)#`.',
      },
      {
        trap: 'Trying to set an IPv6 address as the OSPFv3 Router ID (`router-id 2001:db8::1`).',
        reality: 'Router IDs in BOTH OSPFv2 and OSPFv3 remain **32-bit IPv4-formatted values** (`1.1.1.1`).',
      },
      {
        trap: 'Assuming a `via FE80::...` next-hop in `show ipv6 route ospf` is a misconfiguration.',
        reality: 'OSPFv3 intentionally exchanges updates and sets next hops using **Link-Local (`FE80::`)** addresses.',
      },
      {
        trap: 'Forgetting `ipv6 unicast-routing` globally.',
        reality: 'OSPFv3 won’t route IPv6 traffic across interfaces until `ipv6 unicast-routing` is enabled.',
      },
    ],

    keyTerms: [
      {
        term: 'OSPFv3 (RFC 5340)',
        shortDef: 'IPv6 version of OSPF enabled per-interface (`ipv6 ospf <pid> area <id>`) using `FF02::5`/`6`.',
        fullDef: 'Uses 32-bit Router IDs and Link-Local (`FE80::`) next-hops while retaining OSPF’s state machine, areas, and SPF math.',
      },
      {
        term: 'FF02::5 & FF02::6',
        shortDef: 'IPv6 link-local multicast destinations for AllSPFRouters (`FF02::5`) and AllDRouters (`FF02::6`).',
        fullDef: 'Direct IPv6 equivalents of OSPFv2’s `224.0.0.5` and `224.0.0.6`.',
      },
      {
        term: 'Link-Local Next-Hop (`FE80::`)',
        shortDef: 'Automatic per-link IPv6 address used by OSPFv3 peers for neighbor communication and route next-hops.',
        fullDef: 'Appears cleanly in `show ipv6 route ospf` (`via FE80::..., Gi0/1`).',
      },
      {
        term: '32-Bit Router ID in OSPFv3',
        shortDef: 'Mandatory IPv4-formatted (`x.x.x.x`) router identifier configured manually on IPv6-only routers.',
        fullDef: 'Set under `ipv6 router ospf <pid>` -> `router-id 1.1.1.1` when no IPv4 interfaces exist.',
      },
    ],

    checkQuestions: [
      {
        id: 'v2-333-q1',
        prompt: 'You configure `ipv6 router ospf 1` on a new router that has ONLY IPv6 addresses assigned and zero IPv4 addresses. IOS throws `% OSPFv3: Router ID could not be chosen`. How do you resolve it?',
        options: [
          'Configure a 32-bit dotted-decimal `router-id` (e.g., `router-id 1.1.1.1`) under `ipv6 router ospf 1`.',
          'Configure `router-id 2001:db8::1` using an IPv6 address.',
          'Add `network ::/0 area 0` under `ipv6 router ospf 1`.',
          'Switch to OSPFv2.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: OSPFv3 requires a 32-bit IPv4-style Router ID (`x.x.x.x`), which cannot be auto-selected when zero IPv4 addresses exist.',
          'Incorrect: Router IDs are strictly 32-bit dotted-decimal, never 128-bit IPv6.',
          'Incorrect: OSPFv3 does not use `network` commands.',
          'Incorrect: OSPFv2 routes IPv4 only.',
        ],
        takeaway: 'Always configure a 32-bit `router-id x.x.x.x` on OSPFv3 routers.',
      },
      {
        id: 'v2-333-q2',
        prompt: 'How do you enable OSPFv3 Area 0 on interface `GigabitEthernet0/1`?',
        options: [
          'Enter `interface GigabitEthernet0/1` and run `ipv6 ospf 1 area 0`.',
          'Enter `ipv6 router ospf 1` and run `network 2001:db8:1::/64 area 0`.',
          'Enter `router ospf 1` and run `ipv6 enable`.',
          'Enter `interface GigabitEthernet0/1` and run `ip ospf 1 area 0`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: OSPFv3 enables per-interface using `ipv6 ospf <process-id> area <area-id>`.',
          'Incorrect: OSPFv3 removed `network` statements.',
          'Incorrect: `router ospf 1` is IPv4 OSPFv2.',
          'Incorrect: `ip ospf` is IPv4 OSPFv2.',
        ],
        takeaway: 'OSPFv3 = per-interface `ipv6 ospf <pid> area <id>`.',
      },
      {
        id: 'v2-333-q3',
        prompt: 'Which IPv6 multicast addresses does OSPFv3 use for AllSPFRouters and AllDRouters?',
        options: [
          'FF02::5 and FF02::6',
          '224.0.0.5 and 224.0.0.6',
          'FF02::1 and FF02::2',
          'FE80::5 and FE80::6',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `FF02::5` (AllSPFRouters) and `FF02::6` (AllDRouters) mirror IPv4’s `224.0.0.5` and `224.0.0.6`.',
          'Incorrect: Those are IPv4 OSPFv2 addresses.',
          'Incorrect: All-Nodes and All-Routers NDP addresses.',
          'Incorrect: `FE80::` is unicast Link-Local.',
        ],
        takeaway: 'OSPFv3 multicasts on `FF02::5` and `FF02::6`.',
      },
      {
        id: 'v2-333-q4',
        prompt: 'Why does `show ipv6 route ospf` list `via FE80::...` instead of `via 2001:db8::...` as the next hop?',
        options: [
          'OSPFv3 forms adjacencies and advertises next-hops using each neighbor’s Link-Local (`FE80::`) address.',
          'Global Unicast addresses are invalid in OSPFv3.',
          'The neighbor has a misconfigured subnet mask.',
          'NDP failed.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: OSPFv3 explicitly uses Link-Local (`FE80::`) addresses as next-hop pointers across shared links.',
          'Incorrect: GUAs are the destination prefixes routed inside `show ipv6 route`.',
          'Incorrect: Normal healthy OSPFv3 behavior.',
          'Incorrect: NDP resolves `FE80::` to MAC smoothly.',
        ],
        takeaway: 'OSPFv3 next-hops are `FE80::` Link-Local addresses—100% normal.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Test OSPFv2 vs. OSPFv3 Exam Readiness',
      targetTab: 'exam',
      instructions: [
        'Open Mock Exams -> Cisco CCNA and review Domain 3 OSPFv2/OSPFv3 adjacency and configuration questions.',
      ],
      verificationCheck: 'Score 100% on OSPFv3 RID, `ipv6 ospf <pid> area`, and `FF02::5/6` questions.',
    },

    summaryBullets: [
      'OSPFv3 (`AD 110`, IPv6) retains OSPF’s Down->Full state machine, 10/40s timers, DR/BDR election, and 32-bit dotted-decimal **Router ID**.',
      'Enable `ipv6 unicast-routing` globally, set explicit `router-id x.x.x.x` under `ipv6 router ospf <pid>`, and activate per interface via `ipv6 ospf <pid> area 0`.',
      'OSPFv3 has **no `network` statement** and communicates over `FF02::5`/`FF02::6` using **`FE80::` Link-Local** next hops.',
      'Verify with `show ipv6 ospf neighbor` and `show ipv6 route ospf`.',
    ],

    sourcesToVerify: [
      'RFC 5340 — OSPF for IPv6 & CCNA 200-301 v2.0 Topic 3.3 Exam Objectives',
    ],
  },

  'ccna.core.rt.fhrp-hsrp-vrrp': {
    id: 'ccna.core.rt.fhrp-hsrp-vrrp',
    moduleId: 'ccna',
    unitTitle: 'Unit 3: IP Routing',
    topicTitle: '3.4 / 3.5 First Hop Redundancy Protocols (HSRP & VRRP)',
    code: '3.4.1',
    title: 'HSRP & VRRP Active/Standby Status, Virtual MACs & Preemption',
    readMinutes: 12,
    prerequisites: ['2.1.1', '3.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['3.5'],
    v20ExamTopics: ['3.4'],

    learningObjectives: [
      'Explain why hosts with a single static/DHCP Default Gateway need **FHRPs (HSRP, VRRP, GLBP)** to survive router or core switch failure.',
      'Compare **HSRP** (Cisco, Active/Standby, virtual MAC `0000.0c07.acXX` / `0000.0c9f.fXXX`, default priority `100`, **preempt OFF by default**) vs. **VRRP** (open standard RFC, Master/Backup, virtual MAC `0000.5e00.01XX`, **preempt ON by default**).',
      'Interpret **`show standby brief`** (HSRP) and **`show vrrp brief`** (VRRP) operational output—identifying Active/Master router, Standby/Backup router, Virtual IP, and Priority/Preemption.',
      'Explain how FHRP **Interface Tracking** automatically lowers priority if an upstream WAN link drops so the healthy backup takes over.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Dual Core Routers Still Leave Users Offline Without a Virtual Gateway IP',
      narrative:
        'A company buys two expensive Core routers (R1 `.2` and R2 `.3`) on VLAN 10 for redundancy—yet every PC only accepts ONE Default Gateway IP! If DHCP hands out R1 (`.2`) and R1 loses power, PCs keep trying to ARP for `.2` forever instead of automatically switching to `.3`. **HSRP / VRRP** solves this cleanly by creating ONE shared **Virtual IP (`.1`) and Virtual MAC**: R1 and R2 guard `.1` together, and if R1 crashes, R2 seamlessly inherits `.1` and its exact Virtual MAC in seconds without a single PC changing settings!',
    },

    plainEnglish: {
      analogyTitle: 'Think of Two Co-Pilots Sharing One Radio Callsign',
      analogy:
        'Air traffic control wants to call `"Flight 10"` (`Virtual IP 10.10.10.1`), not keep track of whether Captain Alice (`R1 .2`) or First Officer Bob (`R2 .3`) currently holds the yoke. Together, Alice and Bob share the **Virtual IP (`.1`)** and **Virtual MAC** seamlessly: Alice flies as **Active** (`Master` in VRRP) while Bob monitors silently as **Standby** (`Backup` in VRRP). If Alice’s radio dies—or if her forward windshield clouds over (**WAN Interface Tracking** lowers her priority)—Bob immediately picks up the exact same `"Flight 10"` callsign (`Virtual IP + Virtual MAC`) so traffic flows uninterrupted!',
      technicalDefinition:
        'First Hop Redundancy Protocols (FHRPs) share a single Virtual IP and Virtual MAC across multiple Layer 3 gateways so endpoints keep one static gateway across hardware or uplink failures. HSRP (`Active/Standby`, Cisco proprietary, preempt disabled by default) and VRRP (`Master/Backup`, IEEE/IETF open standard, preempt enabled by default) elect the forwarding router by highest Priority (default 100, tie-broken by highest interface IP), while GLBP adds active-active multi-gateway load balancing via virtual MAC distribution.',
      paragraphs: [
        'Memorize the key operational contrasts between **HSRP** and **VRRP**: **(1) Ownership & Roles:** HSRP is Cisco-proprietary (`Active` and `Standby`); VRRP is open-standard (`Master` and `Backup`, IP protocol 112). **(2) Virtual MACs:** HSRPv1 = `0000.0c07.acXX` (group hex `XX`), HSRPv2 = `0000.0c9f.fXXX`, VRRP = `0000.5e00.01XX`. **(3) Preemption Default:** HSRP has **`preempt` DISABLED by default** (must add `standby 10 preempt` so a recovered higher-priority router takes Active back); VRRP has **`preempt` ENABLED by default**! **(4) Gateway IP:** VRRP allows the Virtual IP to match a router’s real interface IP (making that router Priority 255 Master); HSRP requires a separate Virtual IP distinct from both real interface IPs.',
        'Notice why **Preemption + Interface Tracking** go together: suppose R1 (`Pri 110`) loses its WAN fiber (`Gi0/0`). With `standby 10 track 1 decrement 20`, R1’s HSRP priority drops from `110` down to **`90`**, letting R2 (`Pri 100`, with `preempt`) seize the Active gateway role immediately instead of letting R1 black-hole user traffic into a dead WAN!',
        'Also mention **GLBP (Gateway Load Balancing Protocol)** (Cisco): unlike HSRP/VRRP where Standby sits idle for a single group, GLBP elects one AVG (Active Virtual Gateway) that hands up to 4 different Virtual MACs to different clients so multiple routers forward simultaneously.',
      ],
    },

    deepDive: {
      intro: 'Compare HSRP vs. VRRP operational states and read `show standby brief` / `show vrrp brief`.',
      steps: [
        {
          step: 'Election Rule',
          title: 'Highest Priority Wins (Default 100; Tie -> Highest IP)',
          explanation: 'Configure primary Active/Master with `priority 110` and `preempt` (explicitly needed in HSRP!). Leave backup at default `100`.',
        },
        {
          step: 'HSRP States',
          title: 'Initial -> Learn -> Listen -> Speak -> Standby -> Active',
          explanation: 'Active sends Hellos (default every `3s`, Hold `10s`; v1 multicast `224.0.0.2`, v2 `224.0.0.102`). Wait for `Speak` -> `Standby` / `Active` in `show standby`.',
        },
        {
          step: 'VRRP Status',
          title: 'Master vs. Backup (Multicast `224.0.0.18`, Preempt ON)',
          explanation: 'Master sends advertisements every `1s` by default. Preemption is ON by default; group numbers run `1–255`.',
        },
        {
          step: 'Tracking',
          title: 'Preventing Black Holes on Upstream WAN Drops',
          explanation: 'If R1’s WAN port drops while its LAN port stays up, HSRP/VRRP keeps R1 Active unless object/interface tracking decrements R1’s priority below R2’s (`110 - 20 = 90 < 100`).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'HSRP Virtual Gateway (`10.10.10.1`) & Upstream Tracking Failover',
        asciiFallback: `   [WAN ISP 1]                [WAN ISP 2]
        | (Tracked!)               |
[R1: .2, Pri 110, Preempt]   [R2: .3, Pri 100, Preempt]
        \\   Active!            Standby   /
         \\--- Virtual IP: 10.10.10.1 ---/
              Virtual MAC: 0000.0c9f.f00a (Group 10)
                        |
                 [LAN Clients GW=.1]`,
      },
      workedExample: {
        title: 'Reading `show standby brief` to Spot Why R1 Failed to Reclaim Active',
        context:
          'R1 (`Pri 110`) rebooted after maintenance; R2 (`Pri 100`) became Active. R1 is now back online, yet `show standby brief` on R1 STILL shows `State: Standby`!',
        steps: [
          'Run `show standby` on R1: output reads `Preemption disabled`!',
          'Because HSRP defaults to **preempt OFF**, R1 politely lets R2 remain Active until you add `standby 10 preempt` on R1.',
          'Apply `standby 10 preempt` -> R1 (`110 > 100`) immediately reclaims `Active` and R2 steps back cleanly to `Standby`.',
        ],
        outcome: 'Understanding HSRP’s default `preempt OFF` behavior prevents post-maintenance surprises.',
      },
    },

    iosCliGuide: {
      intro: 'Interpret HSRP (`show standby brief`) and VRRP (`show vrrp brief`) operational status directly (CCNA v2.0 Topic 3.4).',
      commands: [
        {
          title: '1. Interpret HSRP Operational Output',
          promptAndCommand: 'R1# show standby brief',
          output: `                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0       10   110 P Active  local           10.10.10.3      10.10.10.1`,
          lineByLine: [
            { segment: 'P', meaning: '`standby 10 preempt` is enabled (critical—without `P`, R1 won’t reclaim Active after recovery!).' },
            { segment: 'State: Active / Active: local', meaning: 'This router (R1) currently owns Virtual IP `10.10.10.1` and forwards client packets.' },
            { segment: 'Standby: 10.10.10.3', meaning: 'Backup router R2 ready to take over if R1 fails.' },
          ],
        },
        {
          title: '2. Interpret VRRP Operational Output',
          promptAndCommand: 'R2# show vrrp brief',
          output: `Interface          Grp Pri Time  Own Pre State   Master addr     Group addr
Gi0/0              10  100 3609       Y  Backup  10.10.10.2      10.10.10.1`,
          lineByLine: [
            { segment: 'Pre: Y', meaning: 'VRRP has preemption enabled (`Y`) by default.' },
            { segment: 'State: Backup / Master addr: 10.10.10.2', meaning: 'R2 is in Backup state while R1 (`10.10.10.2`) acts as VRRP Master for `10.10.10.1`.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show standby brief',
        healthyLabel: 'One Active + One Standby Peer (`10.10.10.3`)',
        healthyOutput: `Gi0/0       10   110 P Active  local           10.10.10.3      10.10.10.1`,
        brokenLabel: 'Split-Brain (`Active: local | Standby: unknown`) Caused by Mismatched Group/VLAN/ACL',
        brokenOutput: `Gi0/0       10   110 P Active  local           unknown         10.10.10.1`,
        diagnosis:
          '`Standby: unknown` means R1 and R2 cannot see each other’s HSRP Hellos (`224.0.0.2` / `224.0.0.102`, UDP 1985)—usually caused by mismatched VLANs, missing trunk VLAN, mismatched HSRP version/group, or an ACL dropping multicast Hellos! Both routers become Active, breaking ARP and traffic.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming HSRP automatically preempts when you set `standby 10 priority 150`.',
        reality: 'HSRP requires **`standby 10 preempt`** explicitly; VRRP enables preemption by default.',
      },
      {
        trap: 'Confusing HSRP Virtual MAC (`0000.0c07.acXX` / `0000.0c9f.fXXX`) with VRRP Virtual MAC (`0000.5e00.01XX`).',
        reality: 'Notice **`ac`** = HSRP v1, **`9f.f`** = HSRP v2, and **`5e00.01`** = IANA open-standard VRRP.',
      },
      {
        trap: 'Seeing `Standby: unknown` on BOTH HSRP routers and thinking redundancy is healthy.',
        reality: '`Standby: unknown` on both means BOTH routers think they are Active simultaneously (split-brain)—check VLAN, trunking, group ID, version (v1 vs v2), or multicast ACLs immediately!',
      },
      {
        trap: 'Setting identical Virtual IP to a router’s real IP in HSRP.',
        reality: 'HSRP requires a separate unused Virtual IP (e.g., VIP `.1`, R1 `.2`, R2 `.3`); only VRRP lets a Master own the VIP directly (`Pri 255`).',
      },
    ],

    keyTerms: [
      {
        term: 'HSRP (Hot Standby Router Protocol)',
        shortDef: 'Cisco FHRP electing one Active and one Standby router sharing a Virtual IP/MAC.',
        fullDef: 'Default priority 100, preemption OFF by default, Hello 3s / Hold 10s (UDP 1985).',
      },
      {
        term: 'VRRP (Virtual Router Redundancy Protocol)',
        shortDef: 'Open-standard FHRP electing one Master and Backup router(s) sharing a Virtual IP/MAC.',
        fullDef: 'Default priority 100, preemption ON by default, IP protocol 112 (`224.0.0.18`), virtual MAC `0000.5e00.01XX`.',
      },
      {
        term: 'Preemption',
        shortDef: 'Allows a higher-priority router to reclaim the Active/Master gateway role after recovering.',
        fullDef: 'Required in HSRP via `standby <grp> preempt`; active by default in VRRP.',
      },
    ],

    checkQuestions: [
      {
        id: 'c34-q1',
        prompt: 'You inspect `show standby brief` on R1 (`Pri 120`, rebooted 5 minutes ago) and see `Gi0/0  10  120  Standby  10.1.1.3  local  10.1.1.1` while R2 (`10.1.1.3`, `Pri 100`) remains Active. Why hasn’t R1 taken back the Active role?',
        options: [
          'HSRP disables preemption by default (`P` is missing), so `standby 10 preempt` must be configured on R1.',
          'Priority 120 is lower than Priority 100.',
          'VRRP is blocking HSRP.',
          'R1’s Virtual IP must match R1’s physical IP.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Without the `P` (`preempt`) flag in `show standby brief`, HSRP never takes Active back from an already-Active lower-priority peer.',
          'Incorrect: Higher priority wins (`120 > 100`) ONLY when preemption is enabled.',
          'Incorrect: Unrelated.',
          'Incorrect: HSRP Virtual IP must stay distinct from physical IPs.',
        ],
        takeaway: 'Look for the `P` column in `show standby brief`—HSRP requires explicit `preempt`.',
      },
      {
        id: 'c34-q2',
        prompt: 'Which FHRP virtual MAC address belongs to **VRRP** rather than Cisco HSRP?',
        options: ['0000.5e00.010a', '0000.0c07.ac0a', '0000.0c9f.f00a', '0007.b400.0a01'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `0000.5e00.01XX` is the standard IANA VRRP virtual MAC (`0a` = group 10).',
          'Incorrect: `0000.0c07.acXX` is Cisco HSRPv1.',
          'Incorrect: `0000.0c9f.fXXX` is Cisco HSRPv2.',
          'Incorrect: `0007.b400.XXYY` is Cisco GLBP.',
        ],
        takeaway: '`5e00.01` = VRRP; `0c07.ac` = HSRPv1; `0c9f.f` = HSRPv2; `07b4` = GLBP.',
      },
      {
        id: 'c34-q3',
        prompt: 'On BOTH HSRP routers R1 and R2, `show standby brief` prints `State: Active`, `Active: local`, and `Standby: unknown`. What does this indicate?',
        options: [
          'R1 and R2 cannot receive each other’s HSRP Hello packets (VLAN mismatch, trunk filter, version mismatch, or ACL blocking multicast), creating an Active/Active split-brain.',
          'HSRP is working at double speed via GLBP.',
          'Preemption succeeded cleanly.',
          'Standby router is sleeping normally.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: When peers fail to hear Hellos, both assume the other is dead and claim Active (`Standby: unknown`), breaking ARP stability.',
          'Incorrect: Dual Active in HSRP is a fault.',
          'Incorrect: Healthy state shows the peer IP in `Standby`, never `unknown`.',
          'Incorrect: Standby sends periodic Hellos and shows its IP.',
        ],
        takeaway: '`Standby: unknown` on active HSRP routers = broken L2/multicast communication between peers.',
      },
      {
        id: 'c34-q4',
        prompt: 'How do you ensure HSRP fails over cleanly if R1’s LAN port stays `up/up` while its upstream WAN interface (`Gi0/1`) goes down?',
        options: [
          'Configure interface/object tracking (`standby 10 track ... decrement ...`) so R1’s HSRP priority drops below R2’s priority.',
          'Lower R1’s priority manually to 0 permanently.',
          'Disable preemption on R2.',
          'Remove the Virtual IP.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Tracking drops R1’s effective priority (e.g., `110 - 20 = 90 < 100`) when the WAN drops, triggering R2 (with `preempt`) to take over immediately.',
          'Incorrect: Permanent 0 disables R1 even when WAN is healthy.',
          'Incorrect: R2 needs `preempt` ON to seize Active during a priority drop.',
          'Incorrect: Breaks gateway.',
        ],
        takeaway: 'Pair FHRP WAN tracking + `preempt` on the Standby router to prevent upstream black-holes.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Test HSRP & VRRP Operational Interpretation in Mock Exams',
      targetTab: 'exam',
      instructions: [
        'Open Mock Exams -> Cisco CCNA and review Domain 3 FHRP questions (`show standby brief` & `show vrrp brief`).',
      ],
      verificationCheck: 'Identify Active/Standby/Master/Backup, preempt flags, and Virtual MACs accurately.',
    },

    summaryBullets: [
      'FHRPs give endpoints one constant **Virtual IP** and **Virtual MAC** backed by multiple physical routers/L3 switches.',
      '**HSRP** (Cisco): `Active`/`Standby`, preempt **OFF** by default, virtual MAC `0000.0c07.acXX` (v1) / `0000.0c9f.fXXX` (v2).',
      '**VRRP** (Open Standard): `Master`/`Backup`, preempt **ON** by default, virtual MAC `0000.5e00.01XX`.',
      'Watch `show standby brief` (`P` flag, `Active`, `Standby`) and `show vrrp brief` (`Pre`, `State`, `Master addr`).',
      'Use **WAN interface/IP-SLA tracking** + **`preempt`** so upstream link failures trigger instant gateway failover.',
    ],

    sourcesToVerify: [
      'RFC 5798 — VRRPv3 & Cisco IOS First Hop Redundancy Protocols Configuration Guide',
    ],
  },
};
