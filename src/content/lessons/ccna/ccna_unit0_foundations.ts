import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT0_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.core.0.1': {
    id: 'ccna.core.0.1',
    moduleId: 'ccna',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.1 How Networks Move Data & Binary/Hex Math',
    code: '0.1.1',
    title: 'What a Computer Network Is, Switches vs Routers & Encapsulation',
    readMinutes: 11,
    prerequisites: ['None — beginner entry point'],
    versionScope: 'shared',
    v11ExamTopics: ['Unit 0 (supports 1.1)'],
    v20ExamTopics: ['Unit 0 (supports 1.1)'],

    learningObjectives: [
      'Define a computer network in plain English as interconnected endpoints sharing data over a local area network (LAN) or wide area network (WAN).',
      'Distinguish the exact job of an Ethernet switch (local Layer 2 forwarding by MAC address) from a router (inter-network Layer 3 forwarding by IP address).',
      'Trace encapsulation and de-encapsulation step by step as application data is wrapped into segments, packets, and frames.',
      'Predict what happens to Layer 2 MAC addresses versus Layer 3 IP addresses across every hop from client to server.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Your Laptop Can Ping Its Switch Neighbor Yet Fail to Reach the Cloud',
      narrative:
        'Imagine a newly onboarded junior technician plugs a laptop into a desk jack on the second floor. Shared drives inside the same office work immediately, yet websites outside the building time out. If you do not clearly separate what the floor switch handles versus what the office router (default gateway) handles, you will waste time swapping working cables instead of checking the gateway IP or router path. Every later CCNA topic—VLANs, OSPF, ACLs, NAT—rests on knowing which device reads which header at every hop.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Inter-Office Mail Inside a Building vs. the City Postal Hub',
      analogy:
        'Inside a single office building (a Local Area Network, or LAN), an internal mail cart carrier (the Ethernet switch) knows every employee’s desk number (the permanent hardware MAC address stamped on the network card) and hands envelopes directly from desk to desk on the same floor. When an envelope needs to leave the building and travel to another city (another IP network across a Wide Area Network, or WAN), the desk carrier hands it to the building’s outgoing mailroom (the Router, or Default Gateway). The mailroom checks the street and zip code (the logical IP address) and puts the letter inside a brand-new courier pouch addressed to the next city’s hub—without ever rewriting the original sender and destination IP addresses inside.',
      technicalDefinition:
        'A computer network moves structured protocol data units (PDUs) between endpoints using layered headers: switches forward Layer 2 Ethernet frames inside a single broadcast domain using destination MAC addresses, whereas routers forward Layer 3 IP packets across distinct network boundaries using destination IP addresses while rewriting Layer 2 frame headers at every hop.',
      paragraphs: [
        'Two foundational terms appear immediately in networking: **MAC address** (Media Access Control address) and **IP address** (Internet Protocol address). A MAC address is a 48-bit physical identifier burned into a network interface card (NIC) by its manufacturer (written as 12 hex digits like `00:1A:2B:3C:4D:5E`), used only for hop-by-hop delivery on the local link. An IP address is a logical, location-based address (such as `192.168.10.25`) assigned to a host so routers across the world know which network neighborhood that host lives in.',
        '**Encapsulation** is simply wrapping data inside nested envelopes as it moves down the sender’s protocol stack: the application creates data, Layer 4 adds port numbers to form a **TCP segment** (or **UDP datagram**), Layer 3 (IP) adds source and destination IP addresses to form a **packet**, Layer 2 (Ethernet) adds source and destination MAC addresses plus a Frame Check Sequence (FCS) trailer to form a **frame**, and Layer 1 turns those bits into electrical pulses, light flashes, or radio waves.',
        'At the receiving host, **de-encapsulation** opens those envelopes in reverse order: Layer 1 captures bits, Layer 2 checks the FCS for corruption and strips the Ethernet header, Layer 3 verifies the destination IP matches itself and strips the IP header, and Layer 4 delivers the payload to the matching application port.',
        'Also separate five core link-health terms right away: **Bandwidth** is a link’s theoretical maximum capacity (e.g., 1 Gbps), while **Throughput** is actual measured data delivered after overhead and congestion. **Latency** is one-way or round-trip delay (ms), **Jitter** is variation in packet arrival timing (critical for live VoIP/video), and **Packet Loss** is the percentage of packets dropped before arrival. Traffic flows as **Unicast** (one-to-one), **Broadcast** (one-to-all in the local subnet/VLAN, never forwarded by routers), or **Multicast** (one-to-interested-group, e.g., OSPF `224.0.0.5`).',
      ],
    },

    deepDive: {
      intro:
        'Follow one real HTTP request leaving Laptop A (`192.168.1.10`, MAC `AA:AA`) across Switch S1 and Router R1 to Web Server B (`10.20.30.50`, MAC `BB:BB`).',
      steps: [
        {
          step: 'Step 1',
          title: 'Application & Layer 4 Segmentation',
          explanation:
            'Your browser sends an HTTP GET request. TCP (Transmission Control Protocol) attaches Source Port `51422` (ephemeral client port) and Destination Port `443` (HTTPS), creating a Layer 4 **segment**.',
        },
        {
          step: 'Step 2',
          title: 'Layer 3 IP Packet Creation (End-to-End Addresses Stay Fixed)',
          explanation:
            'The OS adds Source IP `192.168.1.10` and Destination IP `10.20.30.50`. Laptop A compares its subnet mask (`255.255.255.0`) and sees `10.20.30.50` is on a remote network—so it resolves the MAC of its **default gateway** (`192.168.1.1`, Router R1) using ARP (Address Resolution Protocol).',
        },
        {
          step: 'Step 3',
          title: 'Layer 2 Ethernet Frame on Hop 1 (Laptop A -> S1 -> R1)',
          explanation:
            'Laptop A wraps the packet in an Ethernet frame: Source MAC = `AA:AA`, Destination MAC = R1’s G0/0 MAC (`11:11`). Switch S1 reads ONLY the Ethernet header (`11:11`), looks up `11:11` in its MAC address table, and forwards the frame out the port wired to R1 without touching the IP header.',
        },
        {
          step: 'Step 4',
          title: 'Router R1 Re-Encapsulates at Layer 2 (Hop 2: R1 -> Server B)',
          explanation:
            'R1 strips the old Ethernet frame, inspects Destination IP `10.20.30.50`, decrements the IP Time-to-Live (TTL) by 1, looks up `10.20.30.0/24` in its routing table, and builds a BRAND-NEW Ethernet frame: Source MAC = R1’s G0/1 MAC (`22:22`), Destination MAC = Server B’s MAC (`BB:BB`). Notice the IP addresses (`192.168.1.10` -> `10.20.30.50`) stayed untouched!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'End-to-End IP Preservation vs. Hop-by-Hop MAC Rewriting',
        asciiFallback: `[Laptop A]            [Switch S1]             [Router R1]             [Server B]
IP: 192.168.1.10      Reads L2 MAC only       Strips Hop-1 L2 frame   IP: 10.20.30.50
MAC: AA:AA            Forwards AA->11         Looks up 10.20.30.50    MAC: BB:BB
   |                      |                   Builds new L2 frame        |
   +-- Frame 1 ---------> + ----------------> + ---- Frame 2 ----------> +
   SrcMAC: AA:AA                              SrcMAC: 22:22
   DstMAC: 11:11 (R1)                         DstMAC: BB:BB (Server B)
   SrcIP : 192.168.1.10  (UNCHANGED!)         SrcIP : 192.168.1.10 (UNCHANGED!)
   DstIP : 10.20.30.50   (UNCHANGED!)         DstIP : 10.20.30.50  (UNCHANGED!)`,
      },
      workedExample: {
        title: 'Tracing Why a Wrong Default Gateway Stops Remote Traffic Only',
        context:
          'Host PC1 has IP `192.168.10.20/24`, Gateway mistakenly typed as `192.168.10.254` (actual router G0/0 is `192.168.10.1`). File Server FS1 is `192.168.10.50/24` on the same switch; Cloud DNS is `8.8.8.8`.',
        steps: [
          'PC1 pings `192.168.10.50`: both are in `192.168.10.0/24`, so PC1 ARPs directly for `192.168.10.50`, Switch S1 forwards the frame, and the ping SUCCEEDS.',
          'PC1 pings `8.8.8.8`: remote subnet! PC1 sends an ARP request asking "Who has `192.168.10.254`?" Nobody owns `.254`, so ARP fails and encapsulation never even finishes.',
          'Changing the default gateway on PC1 to `192.168.10.1` lets ARP resolve R1’s MAC immediately, and remote traffic flows.',
        ],
        outcome:
          'Local LAN communication needs only a valid IP, matching subnet mask, and Layer 2 switching; crossing subnets requires a reachable default gateway router.',
      },
    },

    iosCliGuide: {
      intro:
        'Observe how a Cisco switch displays Layer 2 MAC addresses while a Cisco router maps Layer 3 IP addresses to next-hop interfaces.',
      commands: [
        {
          title: '1. Inspect Switch Forwarding Table (Layer 2 MACs)',
          promptAndCommand: 'SW1# show mac address-table dynamic',
          output: `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    001a.2b3c.4d5e    DYNAMIC     Gi0/1
  10    aabb.cc00.1111    DYNAMIC     Gi0/24`,
          lineByLine: [
            { segment: 'Vlan 10', meaning: 'Broadcast domain / virtual LAN segment where the MAC was learned.' },
            { segment: '001a.2b3c.4d5e', meaning: '48-bit MAC address learned from an incoming Ethernet frame source address.' },
            { segment: 'Gi0/1', meaning: 'Physical switch port used to reach that endpoint locally.' },
          ],
        },
        {
          title: '2. Inspect Router ARP & Interface Status (Layer 3 to Layer 2 Glue)',
          promptAndCommand: 'R1# show ip arp',
          output: `Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.10.1            -   aabb.cc00.1111  ARPA   GigabitEthernet0/0
Internet  192.168.10.20           4   001a.2b3c.4d5e  ARPA   GigabitEthernet0/0`,
          lineByLine: [
            { segment: '192.168.10.20', meaning: 'Layer 3 IPv4 host address on the directly attached subnet.' },
            { segment: '001a.2b3c.4d5e', meaning: 'Resolved Layer 2 MAC address used to build Ethernet frames toward that host.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip interface brief',
        healthyLabel: 'Healthy Gateway Interface Up/Up',
        healthyOutput: `GigabitEthernet0/0     192.168.10.1    YES manual up                    up`,
        brokenLabel: 'Administratively Shutdown Gateway (Remote Subnets Unreachable)',
        brokenOutput: `GigabitEthernet0/0     192.168.10.1    YES manual administratively down down`,
        diagnosis:
          'Local PCs plugged into SW1 still ping each other across Gi0/1–Gi0/23, but because R1’s Gi0/0 is `administratively down`, no traffic leaves the LAN until `no shutdown` is configured.',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking routers rewrite source and destination IP addresses at every hop (outside of NAT).',
        reality: 'Standard IP routing leaves source and destination IP addresses untouched end-to-end; only the Layer 2 frame header (source/destination MAC) and IP TTL change per hop.',
      },
      {
        trap: 'Assuming a switch needs an IP address on every VLAN to forward frames inside that VLAN.',
        reality: 'Layer 2 switching works purely on MAC addresses; switches only need an IP address (SVI) for remote management or when acting as a Layer 3 router.',
      },
      {
        trap: 'Confusing a hub with a switch.',
        reality: 'Legacy hubs repeat electrical signals out every port (one shared collision domain); modern switches read destination MACs and build dedicated collision-free point-to-point links per port.',
      },
      {
        trap: 'Forgetting the exact PDU names across layers.',
        reality: 'Memorize the chain: Application Data -> Layer 4 Segment -> Layer 3 Packet -> Layer 2 Frame -> Layer 1 Bits.',
      },
    ],

    keyTerms: [
      {
        term: 'Local Area Network (LAN)',
        shortDef: 'Network connecting endpoints within a single building, floor, or campus site.',
        fullDef: 'A high-speed network spanning a limited physical area—usually interconnected by Ethernet switches and wireless access points sharing local broadcast domains.',
      },
      {
        term: 'MAC Address',
        shortDef: '48-bit physical Layer 2 hardware address burned into a network interface.',
        fullDef: 'A hexadecimal identifier (e.g., 00:1A:2B:3C:4D:5E) consisting of a 24-bit vendor OUI and 24-bit device ID used by switches for hop-by-hop frame delivery.',
      },
      {
        term: 'IP Address',
        shortDef: 'Logical Layer 3 address identifying a host and its network location.',
        fullDef: 'A hierarchical 32-bit (IPv4) or 128-bit (IPv6) logical address used by routers to forward packets across multiple networks.',
      },
      {
        term: 'Encapsulation',
        shortDef: 'Wrapping protocol payloads inside outer layer headers down the stack.',
        fullDef: 'The process where each layer adds its own control header (and trailer at Layer 2) around the upper-layer PDU before transmission.',
      },
      {
        term: 'Default Gateway',
        shortDef: 'Local router IP address where hosts send packets destined for remote networks.',
        fullDef: 'The Layer 3 interface on the local subnet that receives off-net packets and routes them toward other subnets or the internet.',
      },
    ],

    checkQuestions: [
      {
        id: 'c011-q1',
        prompt: 'As an IP packet travels from Laptop A across three routers (R1 -> R2 -> R3) to Web Server B (with no NAT), what happens to the addresses inside the packet and frame?',
        options: [
          'The Source and Destination IP addresses stay unchanged end-to-end, while Source and Destination MAC addresses are rewritten at every router hop.',
          'The Source and Destination MAC addresses stay unchanged end-to-end, while IP addresses rewrite at every hop.',
          'Both IP and MAC addresses stay identical from Laptop A all the way to Server B.',
          'Switches rewrite the Destination IP address before forwarding frames to R1.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IP provides end-to-end logical addressing, whereas Ethernet MAC frames operate strictly hop-by-hop on each physical link.',
          'Incorrect: MAC addresses are local to a single Layer 2 link and are stripped/rebuilt by every router.',
          'Incorrect: R1 strips Laptop A’s Ethernet frame and generates a new frame toward R2.',
          'Incorrect: Layer 2 switches inspect MAC headers only and never rewrite IP addresses.',
        ],
        takeaway: 'IP stays end-to-end (without NAT); Layer 2 MAC headers change at every Layer 3 hop.',
      },
      {
        id: 'c011-q2',
        prompt: 'Which Protocol Data Unit (PDU) order correctly reflects encapsulation moving DOWN from Layer 4 to Layer 1?',
        options: [
          'Segment -> Packet -> Frame -> Bits',
          'Frame -> Packet -> Segment -> Bits',
          'Packet -> Segment -> Frame -> Bits',
          'Bits -> Frame -> Packet -> Segment',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Layer 4 builds Segments (TCP), Layer 3 builds Packets (IP), Layer 2 builds Frames (Ethernet), and Layer 1 transmits Bits.',
          'Incorrect: Frame is Layer 2, below Packet (Layer 3) and Segment (Layer 4).',
          'Incorrect: Layer 4 Segments come before Layer 3 Packets.',
          'Incorrect: Bits -> Frame -> Packet -> Segment describes de-encapsulation moving UP the stack.',
        ],
        takeaway: 'Down the stack: Data -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).',
      },
      {
        id: 'c011-q3',
        prompt: 'PC1 (`192.168.5.10/24`) can ping PC2 (`192.168.5.11/24`) on the same switch, but gets zero reply pinging `10.1.1.50`. Which device is responsible for moving traffic off `192.168.5.0/24`?',
        options: [
          'The local router acting as PC1’s Default Gateway',
          'The Layer 2 access switch MAC address table',
          'The Ethernet patch panel inside the wiring closet',
          'The remote DNS server',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Moving packets between different IP subnets requires a Layer 3 router configured as the host’s Default Gateway.',
          'Incorrect: A Layer 2 switch forwards frames within the same local VLAN/subnet only.',
          'Incorrect: A patch panel is passive physical Layer 1 copper termination.',
          'Incorrect: DNS translates names to IPs; pinging raw `10.1.1.50` bypasses DNS.',
        ],
        takeaway: 'Same-subnet peers talk via Layer 2 switches; cross-subnet traffic requires a Layer 3 router gateway.',
      },
      {
        id: 'c011-q4',
        prompt: 'What does a Layer 2 Ethernet switch inspect in an incoming frame to decide which port to forward it out?',
        options: [
          'The Destination MAC address in the Ethernet header',
          'The Destination IP address in the IPv4 header',
          'The Destination TCP port number',
          'The IP Time-to-Live (TTL) field',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Switches learn Source MACs into their CAM/MAC table and forward frames using the Destination MAC address.',
          'Incorrect: Routers inspect Destination IP addresses; pure Layer 2 switches do not route by IP.',
          'Incorrect: TCP ports are Layer 4 transport identifiers.',
          'Incorrect: TTL is decremented by Layer 3 routers, not Layer 2 switches.',
        ],
        takeaway: 'Switches forward using Destination MAC addresses; routers forward using Destination IP addresses.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect Interfaces & MAC/Routing Separation in IOS Lab 01',
      targetTab: 'labs',
      instructions: [
        'Open the IOS Labs tab and launch Lab 01 (Basic Router Interface & Hostname Configuration).',
        'Run `show ip interface brief` and identify which ports are Layer 3 routed ports.',
        'Bring up `GigabitEthernet0/0` with an IP address and `no shutdown` so hosts on that LAN have a working Default Gateway.',
      ],
      verificationCheck: 'Target router interface reports `up / up` with the assigned gateway IP in `show ip interface brief`.',
    },

    summaryBullets: [
      'A LAN connects nearby devices via Ethernet switches; routers interconnect separate LANs across WAN or campus boundaries.',
      'Layer 2 switches forward frames locally by Destination MAC address; Layer 3 routers forward packets between subnets by Destination IP address.',
      'Encapsulation wraps Data -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).',
      'Without NAT, IP addresses stay unchanged end-to-end while Ethernet MAC headers are stripped and rebuilt at every router hop.',
      'When local peers work but remote networks fail, suspect Default Gateway configuration, ARP resolution, or Layer 3 routing first.',
    ],

    sourcesToVerify: [
      'Cisco Networking Academy — Introduction to Networks (Modules 1–3: Network Components & Protocols)',
      'IEEE 802.3 Ethernet Standard & RFC 1122 (Requirements for Internet Hosts — Communication Layers)',
    ],
  },

  'ccna.core.0.2': {
    id: 'ccna.core.0.2',
    moduleId: 'ccna',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.1 How Networks Move Data & Binary/Hex Math',
    code: '0.1.2',
    title: 'Binary, Decimal & Hexadecimal Conversion by Hand',
    readMinutes: 12,
    prerequisites: ['0.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['Unit 0 (supports 1.6, 1.8)'],
    v20ExamTopics: ['Unit 0 (supports 1.3, 1.4)'],

    learningObjectives: [
      'Convert any 8-bit binary octet (00000000–11111111) into decimal and back in under 15 seconds using powers of two.',
      'Translate between 4-bit binary nibbles and hexadecimal digits (0–9, A–F) for MAC addresses and IPv6 blocks.',
      'Recognize the 9 recurring CIDR mask octets (0, 128, 192, 224, 240, 248, 252, 254, 255) on sight.',
      'Apply bitwise ANDing to calculate a network address from any IPv4 address and subnet mask.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Subnetting & IPv6 Feel Impossible Until Binary Clicks',
      narrative:
        'Humans read IPv4 addresses like `192.168.40.193` and subnet masks like `255.255.255.224` in base-10 decimal, while routers never see dots or decimal numbers—they compare raw 32-bit binary strings. Similarly, MAC addresses and IPv6 addresses look scary (`fe80::21a:2bff:fe3c:4d5e`) until you realize each hex character is simply a compact shortcut for exactly four binary bits. Learning these two small lookup tables once eliminates guesswork across every subnetting, wildcard ACL, and IPv6 exam question.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Eight Light Switches Worth Different Dollar Bills',
      analogy:
        'Imagine a row of eight light switches labeled from left to right with values `128, 64, 32, 16, 8, 4, 2, 1`. Turning a switch ON (`1`) adds that value to your total; leaving it OFF (`0`) adds nothing. Every number from `0` (all switches off) to `255` (all switches on) has exactly ONE unique combination of switches. Hexadecimal simply groups switches into four-switch blocks (`8, 4, 2, 1`), labeling totals `10–15` with letters `A–F` so a 48-bit MAC address shrinks from 48 messy `0`s and `1`s down to 12 neat characters.',
      technicalDefinition:
        'Binary (base-2) represents values using bits (0 or 1) weighted by powers of two (2^7 down to 2^0 per byte/octet). Hexadecimal (base-16) groups 4 bits (one nibble, 0–15) into a single symbol (0–9, A–F), enabling exact lossless alignment with 8-bit octets (2 hex digits) and 16-bit IPv6 hextets (4 hex digits).',
      paragraphs: [
        'In IPv4, every address consists of **4 octets** (each octet = 8 bits = 32 bits total). Memorize the 8 column weights from left to right: **128 | 64 | 32 | 16 | 8 | 4 | 2 | 1**. Aim to convert any octet under **10 seconds** (`192 = 128+64 = 11000000` -> `0xC0`; `168 = 128+32+8 = 10101000` -> `0xA8`). Notice each column is double the column to its right, and any column’s value equals the sum of all columns to its right plus 1 (`64 = 32+16+8+4+2+1 + 1`).',
        'Subnet masks always pack all `1` bits on the left and all `0` bits on the right with zero gaps. That means a single subnet mask octet can ONLY ever be one of nine numbers: `0` (zero 1s), `128` (one 1), `192` (two 1s), `224` (three 1s), `240` (four 1s), `248` (five 1s), `252` (six 1s), `254` (seven 1s), or `255` (eight 1s).',
        'For hexadecimal (base-16), only four bit weights exist per digit: **8 | 4 | 2 | 1**. Values 0–9 stay `0–9`; `10=A`, `11=B`, `12=C`, `13=D`, `14=E`, `15=F`. Because 4 bits fit cleanly into 1 hex digit, `1111 1111` in binary equals `FF` (255 in decimal).',
      ],
    },

    deepDive: {
      intro:
        'Master the three conversions every CCNA exam tests: Decimal-to-Binary, Binary-to-Hex, and Bitwise ANDing.',
      steps: [
        {
          step: 'Step 1',
          title: 'Decimal to 8-Bit Binary (Subtraction Method)',
          explanation:
            'Write `128  64  32  16  8  4  2  1`. Start at `128`: if the weight fits inside your number, write `1` and subtract it; otherwise write `0`. Example for `193`: `128` fits (`193-128=65`) -> `1`; `64` fits (`65-64=1`) -> `1`; `32,16,8,4,2` do not fit -> `00000`; `1` fits (`1-1=0`) -> `1`. Result: `11000001`.',
        },
        {
          step: 'Step 2',
          title: 'Binary to Decimal (Addition Method)',
          explanation:
            'Add ONLY the column weights that have a `1` underneath. Example for `11100000`: `128 + 64 + 32 = 224`.',
        },
        {
          step: 'Step 3',
          title: '8-Bit Binary to 2-Digit Hexadecimal',
          explanation:
            'Split the 8 bits cleanly down the middle into two 4-bit nibbles (`8 4 2 1` each). Example for `1010 1111`: left nibble `8+2 = 10 = A`; right nibble `8+4+2+1 = 15 = F`. Hex = `0xAF`.',
        },
        {
          step: 'Step 4',
          title: 'Bitwise ANDing (How Routers Find the Network ID)',
          explanation:
            'Compare each IP bit with its matching Mask bit: `1 AND 1 = 1`; any pair with a `0` equals `0`. Wherever the mask has `1`s, the IP bits pass straight through; wherever the mask has `0`s, the host bits become `0`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Bit Weights, Subnet Mask Table & Hex Nibble Reference',
        asciiFallback: `8-BIT OCTET WEIGHTS:   128 |  64 |  32 |  16 |   8 |   4 |   2 |   1
Example (193):           1 |   1 |   0 |   0 |   0 |   0 |   0 |   1  (128+64+1=193)
Mask /27 (.224):         1 |   1 |   1 |   0 |   0 |   0 |   0 |   0  (128+64+32=224)
--------------------------------------------------------------------------
AND Result (Network):    1 |   1 |   0 |   0 |   0 |   0 |   0 |   0  = 192!

HEX NIBBLE (8 4 2 1):  1010 -> 10 (A)   1011 -> 11 (B)   1100 -> 12 (C)
                       1101 -> 13 (D)   1110 -> 14 (E)   1111 -> 15 (F)`,
      },
      workedExample: {
        title: 'Converted in Action: IPv4 Subnet ANDing + IPv6 EUI-64 Flip',
        context:
          'Find the network ID of `172.16.45.200` with mask `255.255.255.240` (`/28`), AND flip the 7th bit of MAC byte `00` (`0x00`) for IPv6 Modified EUI-64.',
        steps: [
          'First three octets of mask are `255`, so `172.16.45` copies unchanged.',
          'Fourth octet `200` in binary: `128+64+8` = `11001000`. Mask `240` = `11110000`.',
          'Bitwise AND: keep the top 4 bits (`1100`), zero the bottom 4 (`0000`) -> `11000000` = `192`. Network ID = `172.16.45.192/28`.',
          'For EUI-64 on first MAC byte `0x00` (`0000 0000`): invert the 7th bit from left (value `2` in the second nibble): `0000 0010` -> `0x02`!',
        ],
        outcome: 'Mastering 8-bit weights and 4-bit nibbles makes both IPv4 subnetting and IPv6 EUI-64 automatic.',
      },
    },

    iosCliGuide: {
      intro:
        'Cisco IOS displays subnet masks in dotted decimal or `/prefix` notation, while MAC addresses and IPv6 interface IDs appear in hexadecimal.',
      commands: [
        {
          title: 'Verify Mask Notation & Hex MAC/IPv6 Output on IOS',
          promptAndCommand: 'R1# show ipv6 interface GigabitEthernet0/0',
          output: `GigabitEthernet0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::201:42FF:FE8A:1001
  Global unicast address(es):
    2001:DB8:ACAD:1::1, subnet is 2001:DB8:ACAD:1::/64`,
          lineByLine: [
            { segment: 'FE80::201:42FF:FE8A:1001', meaning: 'Link-local IPv6 address rendered in 16-bit hexadecimal groups (hextets); `::` compresses consecutive zero groups.' },
            { segment: '201 (vs 001)', meaning: 'Notice the MAC started with `0001`, and flipping the 7th binary bit turned `0x00` into `0x02` (`201`).' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip route',
        healthyLabel: 'Correct Mask Alignment (/27 = 255.255.255.224)',
        healthyOutput: `C    192.168.10.192/27 is directly connected, GigabitEthernet0/1`,
        brokenLabel: 'Overlapping Subnet Typing Mistake',
        brokenOutput: `% 192.168.10.200 overlaps with GigabitEthernet0/0`,
        diagnosis:
          'IOS automatically runs binary ANDing on every IP + mask you configure. If two router interfaces AND to overlapping ranges, IOS blocks the second IP immediately.',
      },
    },

    commonTraps: [
      {
        trap: 'Trying to convert decimal `192` by dividing blindly instead of checking the `128, 64, 32...` bit chart.',
        reality: 'Using `128 + 64 = 192` takes 2 seconds and immediately shows `11000000`.',
      },
      {
        trap: 'Treating `0x10` in hexadecimal as decimal `10`.',
        reality: 'In hex, `0x0A` is decimal `10`, whereas `0x10` means `1 × 16 + 0 = 16` in decimal.',
      },
      {
        trap: 'Writing invalid subnet mask numbers like `255.255.255.230`.',
        reality: 'Contiguous `1`s from the left can ONLY produce `0, 128, 192, 224, 240, 248, 252, 254, 255`. Anything else is invalid.',
      },
      {
        trap: 'Forgetting which bit is inverted in IPv6 Modified EUI-64.',
        reality: 'Count 7 bits from the left of the first MAC byte (which is the `2`-weight bit of the second hex digit): e.g., `00` becomes `02`, `02` becomes `00`, `FC` becomes `FE`.',
      },
    ],

    keyTerms: [
      {
        term: 'Octet (Byte)',
        shortDef: 'Group of 8 binary bits representing values 0 through 255.',
        fullDef: 'IPv4 addresses contain four 8-bit octets separated by dots (32 bits total).',
      },
      {
        term: 'Hexadecimal (Base-16)',
        shortDef: 'Number system using digits 0–9 and letters A–F where each digit equals 4 bits.',
        fullDef: 'Used for Ethernet MAC addresses (12 hex digits = 48 bits) and IPv6 addresses (32 hex digits = 128 bits).',
      },
      {
        term: 'Nibble',
        shortDef: '4 binary bits represented cleanly by a single hexadecimal digit.',
        fullDef: 'Half an octet (values 0–15), making binary-to-hex conversion purely table-based without long division.',
      },
      {
        term: 'Bitwise AND',
        shortDef: 'Boolean operation returning 1 only when both compared bits are 1.',
        fullDef: 'Used by routers and hosts to mask out host bits from an IPv4 address and reveal the exact Network ID.',
      },
    ],

    checkQuestions: [
      {
        id: 'c012-q1',
        prompt: 'What is the decimal value of the binary octet `11111000`?',
        options: ['248', '240', '252', '224'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `128 + 64 + 32 + 16 + 8 = 248` (equivalently `255 - 7 = 248`), corresponding to a `/29` subnet mask.',
          'Incorrect: `240` is four 1s (`11110000`).',
          'Incorrect: `252` is six 1s (`11111100`).',
          'Incorrect: `224` is three 1s (`11100000`).',
        ],
        takeaway: 'Five leading 1s = 248 (`/29` mask in the fourth octet).',
      },
      {
        id: 'c012-q2',
        prompt: 'Convert the binary byte `1011 1101` into two hexadecimal digits.',
        options: ['BD', 'AD', 'B9', 'CE'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `1011` = `8+2+1 = 11 (B)`, and `1101` = `8+4+1 = 13 (D)` -> `BD`.',
          'Incorrect: `A` is `1010` (10), not `1011` (11).',
          'Incorrect: `9` is `1001`, not `1101`.',
          'Incorrect: `C` is `1100` and `E` is `1110`.',
        ],
        takeaway: 'Split bytes into two 4-bit `8-4-2-1` nibbles for instant binary <-> hex conversion.',
      },
      {
        id: 'c012-q3',
        prompt: 'Applying bitwise AND to IP `192.168.12.77` and Subnet Mask `255.255.255.240` yields which Network ID?',
        options: ['192.168.12.64', '192.168.12.72', '192.168.12.0', '192.168.12.80'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `77 = 01001101`, `240 = 11110000`. AND keeps the top 4 bits `01000000` = `64`.',
          'Incorrect: `72` has the `8` bit set (`01001000`), which the mask `11110000` zeroes out.',
          'Incorrect: `240` keeps the top 4 bits of the 4th octet (`64`), not 0.',
          'Incorrect: `80` (`01010000`) is the NEXT subnet block (64 + 16 = 80).',
        ],
        takeaway: 'ANDing masks out every bit aligned with a `0` in the subnet mask.',
      },
      {
        id: 'c012-q4',
        prompt: 'Which number can NEVER appear inside a valid contiguous IPv4 subnet mask octet?',
        options: ['216', '192', '252', '128'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Valid mask octets must have consecutive `1` bits from the left (`0, 128, 192, 224, 240, 248, 252, 254, 255`). `216` (`11011000`) has a `0` gap.',
          'Incorrect: `192` (`11000000`) is valid (`/2` bits).',
          'Incorrect: `252` (`11111100`) is valid (`/6` bits).',
          'Incorrect: `128` (`10000000`) is valid (`/1` bit).',
        ],
        takeaway: 'Only 9 values exist for any valid IPv4 subnet mask octet.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Practice Instant Binary-to-Decimal Mask Conversion in Subnetting Lab',
      targetTab: 'subnetting',
      instructions: [
        'Open the Subnetting tab and pick Network & Broadcast mode.',
        'For 5 consecutive `/25` to `/30` questions, identify the increment (`256 - mask octet`) and network boundary using binary weights before revealing the working.',
      ],
      verificationCheck: 'Solve 5 consecutive questions accurately under 30 seconds each.',
    },

    summaryBullets: [
      'Every IPv4 octet uses eight powers of two from left to right: `128, 64, 32, 16, 8, 4, 2, 1`.',
      'Contiguous left-aligned subnet mask `1`s yield only nine legal octet values: `0, 128, 192, 224, 240, 248, 252, 254, 255`.',
      'Hexadecimal maps each 4-bit nibble (`8, 4, 2, 1`) directly to `0–9` and `A–F` (`10–15`).',
      'Bitwise ANDing an IP with its subnet mask produces the exact Network ID.',
      'Binary and hex fluency eliminates guesswork in IPv4 VLSM, wildcard masks, MAC tables, and IPv6 addressing.',
    ],

    sourcesToVerify: [
      'Cisco Press — CCNA 200-301 Official Cert Guide, Volume 1 (Binary & IPv4 Addressing Fundamentals)',
      'RFC 4291 — IP Version 6 Addressing Architecture (Modified EUI-64 Format)',
    ],
  },

  'ccna.core.0.3': {
    id: 'ccna.core.0.3',
    moduleId: 'ccna',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.2 OSI/TCP-IP Models, Ports & Cisco IOS CLI Basics',
    code: '0.2.1',
    title: 'OSI & TCP/IP Models, Ethernet Frames & Well-Known Ports',
    readMinutes: 12,
    prerequisites: ['0.1.1', '0.1.2'],
    versionScope: 'shared',
    v11ExamTopics: ['Unit 0 (supports 1.5, 1.13)'],
    v20ExamTopics: ['Unit 0 (supports 2.1, 2.4)'],

    learningObjectives: [
      'Map all 7 layers of the OSI reference model cleanly onto the 4-layer TCP/IP protocol suite.',
      'Identify the key fields inside an Ethernet II frame, including Preamble, MACs, 802.1Q EtherType (`0x8100`), IPv4 (`0x0800`), and FCS.',
      'Match essential transport protocol numbers and well-known ports (20/21, 22, 23, 25, 53, 67/68, 69, 80, 123, 161/162, 443, 514) to their protocols.',
      'Use layered troubleshooting (bottom-up or divide-and-conquer) to narrow down outages quickly.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Engineers Always Say "Check Layer 1" or "Block TCP Port 23"',
      narrative:
        'Network engineers rarely troubleshoot in vague English—they speak in OSI layers and port numbers. When someone says "Layer 1 and Layer 2 are clean, it’s a Layer 3 ACL blocking TCP 443," you immediately know the cable and switch port are fine and an access-list is dropping HTTPS web traffic. Understanding the OSI model, Ethernet frames, and common ports turns cryptic packet captures and IOS firewall configs into readable stories.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an Assembly Line Where Each Station Speaks Only to Its Counterpart',
      analogy:
        'The 7-layer OSI model works like an international shipping assembly line. Station 7 (Application) writes the letter; Stations 6 and 5 format/encrypt it and manage the conversation session; Station 4 (Transport) chooses reliable registered delivery (TCP) or fast postcard delivery (UDP) and labels the apartment mailbox (Port Number); Station 3 (Network) puts the street and city address (IP) on the envelope; Station 2 (Data Link) puts it into a local truck marked with the neighbor’s license plate (MAC) and error check; and Station 1 (Physical) puts wheels on the road. Even though modern TCP/IP merges Stations 5–7 into one Application layer and Stations 1–2 into Link/Network Access, engineers still number troubles `Layer 1` through `Layer 7`.',
      technicalDefinition:
        'The OSI (Open Systems Interconnection) 7-layer model (Physical, Data Link, Network, Transport, Session, Presentation, Application) provides a conceptual framework for interoperability and troubleshooting, whereas the practical TCP/IP model (Network Access, Internet, Transport, Application) governs real-world Ethernet/IP packet headers and L4 TCP/UDP port multiplexing.',
      paragraphs: [
        'Each OSI layer performs a clean job. **Layer 1 (Physical)** defines connectors, pinouts, voltage, fiber wavelengths, and bit rates. **Layer 2 (Data Link)** handles framing, MAC addressing, VLAN tags (`0x8100`), and Frame Check Sequence (FCS) CRC error detection. **Layer 3 (Network)** handles IP addressing and routing across subnets. **Layer 4 (Transport)** handles end-to-end session reliability (TCP) or low-overhead datagrams (UDP) plus port multiplexing.',
        'At Layer 4, **well-known ports (0–1023)** identify standard server services so one server IP can run SSH, DNS, and HTTPS simultaneously without mixing up replies. Registered ports run `1024–49151`, and ephemeral client source ports run `49152–65535`.',
        'Notice that some protocols run over **TCP** (SSH 22, Telnet 23, HTTP 80, HTTPS 443, FTP 20/21), some over **UDP** (DHCP 67/68, TFTP 69, NTP 123, SNMP 161/162, Syslog 514), and **DNS (53)** uses UDP for normal queries and TCP for large responses or zone transfers.',
        'Engineers apply three classic layered troubleshooting flows depending on symptoms: **Bottom-Up** (start at Layer 1 cables/link lights -> Layer 2 MAC/VLAN -> Layer 3 IP/route -> Layer 7 app; safest for single-host outages), **Top-Down** (check app/DNS first when Layer 1–3 already look healthy for other apps), and **Divide-and-Conquer** (start right in the middle at Layer 3 `ping`—if `ping` passes, climb up to L4–L7; if `ping` fails, drop down to L1–L2!).',
      ],
    },

    deepDive: {
      intro:
        'Compare the OSI and TCP/IP stacks side by side, examine an Ethernet II frame layout, and memorize the CCNA port quick-reference.',
      steps: [
        {
          step: 'Layers 7–5',
          title: 'OSI Layers 7–5 -> TCP/IP Application',
          explanation:
            'Application (L7: HTTP, DNS, SSH, SNMP, DHCP), Presentation (L6: TLS encryption, JSON/UTF-8 encoding), Session (L5: dialog setup/teardown).',
        },
        {
          step: 'Layer 4',
          title: 'OSI Layer 4 -> TCP/IP Transport',
          explanation:
            'TCP (Protocol 6: connection-oriented, ordered, ACK/retransmit) and UDP (Protocol 17: connectionless, low-latency). Uses 16-bit source/destination ports.',
        },
        {
          step: 'Layer 3',
          title: 'OSI Layer 3 -> TCP/IP Internet',
          explanation:
            'IPv4 (`0x0800`), IPv6 (`0x86DD`), ICMP (Protocol 1: ping/traceroute errors), and OSPF (Protocol 89).',
        },
        {
          step: 'Layers 2–1',
          title: 'OSI Layers 2–1 -> TCP/IP Network Access',
          explanation:
            'Ethernet II Frame: Preamble/SFD (8B) | Dest MAC (6B) | Src MAC (6B) | [Optional 802.1Q Tag 4B] | Type (2B) | Payload (46–1500B) | FCS CRC (4B).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'OSI vs. TCP/IP Stack & Ethernet II Frame Structure',
        asciiFallback: `OSI 7 Layers              TCP/IP 4 Layers         Key Protocols & Ports
7 Application  \\
6 Presentation  }-------> Application             HTTPS(TCP 443) SSH(TCP 22) DNS(53) DHCP(UDP 67/68)
5 Session      /
4 Transport    ---------> Transport               TCP(6) / UDP(17) -> Segments & Port Numbers
3 Network      ---------> Internet                IPv4, IPv6, ICMP(1), OSPF(89) -> Packets
2 Data Link    \\
1 Physical     /--------> Network Access          Ethernet II MAC, 802.1Q, Wi-Fi, Copper/Fiber

ETHERNET II FRAME:
[ Preamble/SFD 8B ][ Dst MAC 6B ][ Src MAC 6B ][ Type 2B ][ IP Packet 46-1500B ][ FCS 4B ]`,
      },
      workedExample: {
        title: 'Layered Triage: Diagnosing a Blocked Web App in 60 Seconds',
        context:
          'A user says "The internal HR portal `https://hr.corp.local` refuses to load."',
        steps: [
          'Layer 1/2: Check NIC link light and `show interface` — `up/up`, zero CRC errors (L1 & L2 clean).',
          'Layer 3: `ping 10.20.5.10` (the HR server IP) succeeds in 2ms (L3 routing works).',
          'Layer 7/DNS: `nslookup hr.corp.local` resolves cleanly to `10.20.5.10` (DNS UDP 53 works).',
          'Layer 4/ACL: Testing TCP 443 fails (`Connection timed out`), whereas port 80 responds or an IOS ACL drops `permit tcp any host 10.20.5.10 eq 443`. Fault isolated strictly to Layer 4 TCP port 443 filtering!',
        ],
        outcome:
          'By checking each layer methodically instead of guessing, you proved L1, L2, L3, and DNS worked and immediately isolated the TCP 443 block.',
      },
    },

    iosCliGuide: {
      intro:
        'IOS uses layer indicators in `show interface` and port keywords inside Extended ACLs—making Layer 1–4 knowledge practical daily.',
      commands: [
        {
          title: '1. Read Layer 1 vs Layer 2 Status & FCS Errors',
          promptAndCommand: 'SW1# show interfaces GigabitEthernet0/1',
          output: `GigabitEthernet0/1 is up, line protocol is up (connected)
  Hardware is Gigabit Ethernet, address is 001a.2b3c.0001 (bia 001a.2b3c.0001)
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored`,
          lineByLine: [
            { segment: 'GigabitEthernet0/1 is up', meaning: 'Layer 1 Physical status (carrier signal detected, cable connected).' },
            { segment: 'line protocol is up', meaning: 'Layer 2 Data Link status (keepalives/framing healthy).' },
            { segment: '0 CRC', meaning: 'Layer 2 FCS trailer checks passed with zero corrupted frames.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip access-lists',
        healthyLabel: 'Permitting HTTPS (TCP 443) + DNS (UDP 53)',
        healthyOutput: `Extended IP access list BRANCH_OUT
    10 permit tcp 192.168.10.0 0.0.0.255 any eq 443 (142 matches)
    20 permit udp 192.168.10.0 0.0.0.255 any eq domain (89 matches)`,
        brokenLabel: 'Wrong Transport Protocol Selected for DNS (TCP-only instead of UDP)',
        brokenOutput: `Extended IP access list BRANCH_OUT
    10 permit tcp 192.168.10.0 0.0.0.255 any eq domain (0 matches)`,
        diagnosis:
          'Standard DNS lookups travel over UDP port 53 (`permit udp ... eq domain`). Filtering only TCP port 53 leaves clients unable to resolve names while raw IP pings still work.',
      },
    },

    commonTraps: [
      {
        trap: 'Confusing `line protocol` (Layer 2) with `interface status` (Layer 1).',
        reality: '`up / down` means Layer 1 physical signal is present, but Layer 2 framing/encapsulation/keepalives failed.',
      },
      {
        trap: 'Thinking DNS uses ONLY TCP or ONLY UDP.',
        reality: 'Standard DNS queries use UDP port 53; oversized DNS replies (>512 bytes / DNSSEC) and zone transfers use TCP port 53.',
      },
      {
        trap: 'Mixing up Telnet (23) and SSH (22) or TFTP (69) and SFTP (22).',
        reality: 'SSH and SFTP both share secure encrypted TCP port 22; Telnet (TCP 23) and TFTP (UDP 69) send unencrypted traffic.',
      },
      {
        trap: 'Assuming switches drop frames with bad FCS silently is a software bug.',
        reality: 'Dropping frames whose 4-byte FCS CRC fails is expected Layer 2 hardware behavior; watch the `CRC` counter rising to spot bad cables or duplex mismatches.',
      },
    ],

    keyTerms: [
      {
        term: 'OSI Model',
        shortDef: '7-layer conceptual reference model separating networking functions.',
        fullDef: 'Layers 1 Physical, 2 Data Link, 3 Network, 4 Transport, 5 Session, 6 Presentation, 7 Application.',
      },
      {
        term: 'Ethernet II Frame',
        shortDef: 'Standard IEEE 802.3/Ethernet Layer 2 frame format carrying MACs, Type, and FCS.',
        fullDef: 'Encapsulates Layer 3 packets for local LAN delivery with 6-byte Destination/Source MACs, 2-byte EtherType, and 4-byte CRC FCS trailer.',
      },
      {
        term: 'Well-Known Ports (0–1023)',
        shortDef: 'Standardized TCP/UDP numbers identifying server services.',
        fullDef: 'Includes 20/21 FTP, 22 SSH/SCP/SFTP, 23 Telnet, 53 DNS, 67/68 DHCP, 69 TFTP, 80 HTTP, 123 NTP, 161/162 SNMP, 443 HTTPS, and 514 Syslog.',
      },
      {
        term: 'Frame Check Sequence (FCS)',
        shortDef: '4-byte CRC trailer detecting corrupted Ethernet frames at Layer 2.',
        fullDef: 'Receiving interfaces recalculate the Cyclic Redundancy Check; if it disagrees with the FCS trailer, the frame is discarded and `CRC` increments.',
      },
    ],

    checkQuestions: [
      {
        id: 'c021-q1',
        prompt: 'Which combination correctly pairs protocols with their transport protocol and port number?',
        options: [
          'SSH = TCP 22; DHCP = UDP 67/68; HTTPS = TCP 443; SNMP = UDP 161/162',
          'SSH = UDP 22; TFTP = TCP 69; HTTPS = UDP 443; Syslog = TCP 514',
          'Telnet = TCP 22; FTP = UDP 21; NTP = TCP 123; DNS = UDP 53 only',
          'SFTP = UDP 69; HTTPS = TCP 80; DHCP = TCP 67; SNMP = TCP 161',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SSH uses TCP 22, DHCP uses UDP 67/68, HTTPS uses TCP 443, and SNMP polling/traps use UDP 161/162.',
          'Incorrect: SSH and HTTPS run over TCP (never UDP), TFTP uses UDP 69, and Syslog defaults to UDP 514.',
          'Incorrect: Telnet is TCP 23 (SSH is 22), FTP uses TCP 20/21, NTP uses UDP 123, and DNS uses both UDP and TCP 53.',
          'Incorrect: SFTP runs over SSH (TCP 22), not UDP 69 (TFTP).',
        ],
        takeaway: 'Know TCP (20/21, 22, 23, 80, 443) vs. UDP (67/68, 69, 123, 161/162, 514) vs. Both (53).',
      },
      {
        id: 'c021-q2',
        prompt: 'On a Cisco router, `show ip interface brief` reads `GigabitEthernet0/0 ... up ... down`. Which OSI layer is working and which is failing?',
        options: [
          'Layer 1 (Physical) is up; Layer 2 (Data Link) is down.',
          'Layer 2 (Data Link) is up; Layer 1 (Physical) is down.',
          'Layer 3 (Network) is up; Layer 4 (Transport) is down.',
          'The port is administratively shut down at Layer 1.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The first status column represents Layer 1 Physical link/signal; the second (`line protocol`) represents Layer 2 framing/keepalives.',
          'Incorrect: The order is always Layer 1 first, Layer 2 second.',
          'Incorrect: `show ip interface brief` reports Layer 1 and Layer 2 interface health, not Layer 4.',
          'Incorrect: Administrative shutdown reads `administratively down / down`.',
        ],
        takeaway: 'Status/Protocol = Layer 1 / Layer 2.',
      },
      {
        id: 'c021-q3',
        prompt: 'Which field inside an Ethernet II frame lets the receiving switch or host detect transmission bit corruption?',
        options: [
          'Frame Check Sequence (FCS) trailer',
          'Time to Live (TTL)',
          'Sequence Number',
          'Preamble',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The 4-byte FCS holds a CRC checksum calculated across the frame; mismatches increment CRC errors and discard the damaged frame.',
          'Incorrect: TTL lives inside the Layer 3 IP header to prevent infinite routing loops.',
          'Incorrect: Sequence numbers live inside Layer 4 TCP headers.',
          'Incorrect: Preamble synchronizes Layer 1 clock timing before the Start Frame Delimiter.',
        ],
        takeaway: 'Ethernet uses the 4-byte FCS CRC trailer for Layer 2 error detection.',
      },
      {
        id: 'c021-q4',
        prompt: 'Which 4 layers make up the practical TCP/IP model?',
        options: [
          'Network Access, Internet, Transport, Application',
          'Physical, Data Link, Network, Transport',
          'Session, Presentation, Application, Link',
          'Hardware, Routing, Framing, Encryption',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: TCP/IP combines OSI L1–2 into Network Access, keeps L3 as Internet and L4 as Transport, and combines L5–7 into Application.',
          'Incorrect: Physical, Data Link, Network, Transport are the lower four layers of the 7-layer OSI model.',
          'Incorrect: Missing Internet and Transport.',
          'Incorrect: Not official TCP/IP model names.',
        ],
        takeaway: 'TCP/IP = Network Access (OSI 1–2), Internet (OSI 3), Transport (OSI 4), Application (OSI 5–7).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect L1/L2 Status Indicators & Interface Counters in IOS Lab 01',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 01.',
        'Run `show interfaces` and compare `is up, line protocol is up` against shutdown interfaces (`administratively down, line protocol is down`).',
      ],
      verificationCheck: 'Identify Layer 1 status vs. Layer 2 line protocol status across all router interfaces.',
    },

    summaryBullets: [
      'The 7-layer OSI model maps onto the 4-layer TCP/IP stack and provides the common troubleshooting vocabulary (L1–L7).',
      'Layer 1 = status/cables/bits; Layer 2 = line protocol/MACs/Ethernet frames/FCS; Layer 3 = IPs/routing; Layer 4 = TCP/UDP ports.',
      'TCP provides reliable ordered delivery (SSH 22, Telnet 23, HTTP 80, HTTPS 443); UDP provides fast connectionless datagrams (DHCP 67/68, TFTP 69, NTP 123, SNMP 161/162, Syslog 514).',
      'DNS (53) uses UDP for standard lookups and TCP for large responses/zone transfers.',
      'Checking layers systematically prevents wasted effort on the wrong OSI layer.',
    ],

    sourcesToVerify: [
      'RFC 1122 — Requirements for Internet Hosts (TCP/IP Architecture)',
      'Cisco Press — CCNA 200-301 Official Cert Guide, Volume 1 (Chapter 1–2: TCP/IP and Ethernet LANs)',
    ],
  },

  'ccna.core.0.4': {
    id: 'ccna.core.0.4',
    moduleId: 'ccna',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.6 Cisco IOS CLI Basics',
    code: '0.6.1',
    title: 'Cisco IOS CLI Modes, Output Pipes, Banners & RAM vs NVRAM Persistence',
    readMinutes: 12,
    prerequisites: ['0.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['Unit 0 (CLI prerequisite)'],
    v20ExamTopics: ['Unit 0 (CLI prerequisite)'],

    learningObjectives: [
      'Identify the four primary Cisco IOS CLI prompt modes (`>`, `#`, `(config)#`, `(config-if)#`) and move smoothly between them.',
      'Use `?` context-sensitive help, `Tab` completion, unique command abbreviations (`sh ip int br`), and `do` from config modes.',
      'Read Cisco IOS error messages (`% Incomplete command`, `% Invalid input detected at ^ marker`, `% Ambiguous command`) accurately.',
      'Save running changes safely (`copy running-config startup-config` / `wr`) and prevent console disconnects with `no ip domain-lookup` and `logging synchronous`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Typing the Right Command in the Wrong Prompt Mode Breaks Lab Momentum',
      narrative:
        'A beginner opens a router console, types `interface GigabitEthernet0/0` directly at `Router>`, and sees `% Invalid input detected at ^ marker`. Or they configure an entire VLAN and IP plan, reboot the switch, and lose every change because `running-config` (RAM) was never saved to `startup-config` (NVRAM). Becoming comfortable with Cisco IOS prompts, `?` help, and `copy run start` turns the CLI from intimidating into a guided, self-documenting tool.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Building Security Badges: Lobby Visitor, Manager, Architect, and Room Electrician',
      analogy:
        'Cisco IOS protects routers and switches with stepped security badges shown right in the prompt. At **User EXEC (`Router>`)**, you are a lobby visitor—you can look at basic status (`show version`, `ping`) but cannot change anything. Typing `enable` puts you in **Privileged EXEC (`Router#`)**—the building manager who can inspect full configurations, debug, and save files. Typing `configure terminal` enters **Global Configuration (`Router(config)#`)**—the architect editing system-wide rules like hostnames and routing protocols. Typing `interface g0/0` steps into **Interface Sub-Configuration (`Router(config-if)#`)**—the electrician wiring one specific port.',
      technicalDefinition:
        'Cisco IOS CLI implements a hierarchical modal parser distinguishing read-only inspection modes (`User EXEC >` and `Privileged EXEC #`) from volatile configuration modes (`Global (config)#` and sub-modes like `(config-if)#`, `(config-line)#`, `(config-router)#`), writing live changes immediately into RAM (`running-config`) until explicitly persisted to NVRAM (`startup-config`).',
      paragraphs: [
        'Two built-in keyboard helpers save hours in both exams and real work: **question mark (`?`)** lists every valid command or parameter at your cursor position without pressing Enter, and **Tab** auto-completes unambiguous command keywords. You don’t even need Tab to run abbreviated commands—IOS accepts any shortest unique prefix, such as `conf t` for `configure terminal` or `sh ip int br` for `show ip interface brief`. Typing a prefix that matches multiple commands returns `% Ambiguous command`, while stopping early without required parameters returns `% Incomplete command`.',
        'Whenever you sit inside `(config)#` or `(config-if)#` and want to check a `show` or `ping` command without dropping back to `#`, prefix it with **`do`** (for example, `do show ip int br`). Use output pipe filters (`show running-config | section ospf`, `show running-config | include hostname`, `show ip route | begin Gateway`) to jump straight to relevant lines, and inspect IOS image storage on flash with **`show flash:`** or **`dir flash:`**.',
        'Configure a legal warning banner with a non-appearing delimiter character (**`banner motd #Authorized access only#`**) and remember the two configuration memories: **`running-config`** sits in volatile **RAM** (takes effect immediately, lost on reboot), while **`startup-config`** sits in persistent **NVRAM** (survives power loss). Save verified work with **`copy running-config startup-config`** (or `wr`) before any **`reload`**!',
      ],
    },

    deepDive: {
      intro:
        'Walk through the IOS mode hierarchy, essential navigation shortcuts, and safe lab startup habits.',
      steps: [
        {
          step: 'Mode 1',
          title: 'User EXEC (`Router>`) -> Privileged EXEC (`Router#`)',
          explanation:
            'Connect via console/SSH into `Router>`. Type `enable` (or `en`) to enter `Router#`. Type `disable` to step back down.',
        },
        {
          step: 'Mode 2',
          title: 'Global Config (`Router(config)#`)',
          explanation:
            'From `Router#`, type `configure terminal` (`conf t`). Here you set `hostname`, `enable secret`, static routes, and enter sub-modes.',
        },
        {
          step: 'Mode 3',
          title: 'Sub-Modes (`(config-if)#`, `(config-line)#`, `(config-router)#`)',
          explanation:
            'Commands like `interface GigabitEthernet0/0`, `line vty 0 4`, or `router ospf 1` narrow your scope to that interface, terminal line, or routing process.',
        },
        {
          step: 'Mode 4',
          title: 'Context Help, Error Markers & Saving Config',
          explanation:
            'Use `show ?` or `ip address ?` to inspect arguments. Read `% Invalid input detected at ^ marker`—the caret `^` points directly to the first invalid character or wrong mode. Save with `copy running-config startup-config`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Cisco IOS CLI Mode Hierarchy & Transitions',
        asciiFallback: `Router>                 (User EXEC: limited show/ping)
  |  enable (en)
  v
Router#                 (Privileged EXEC: full show, copy run start, debug)
  |  configure terminal (conf t)
  v
Router(config)#         (Global Config: hostname, ip route, enable secret)
  |-- interface g0/0   --> Router(config-if)#     (ip address, no shutdown)
  |-- line vty 0 4     --> Router(config-line)#   (login local, transport input ssh)
  |-- router ospf 1    --> Router(config-router)# (network, router-id)
        (Use 'exit' to climb 1 level, 'end' or Ctrl+Z to return to #, 'do <cmd>' to run show)`,
      },
      workedExample: {
        title: 'Reading & Fixing Three Classic IOS CLI Errors Live',
        context:
          'A learner attempts to configure `GigabitEthernet0/0` on R1 and hits three consecutive errors.',
        steps: [
          '`R1> conf t` -> `% Invalid input detected at ^ marker` (Tried entering config mode from User EXEC `>` without typing `enable` first!).',
          '`R1(config)# interface g0/0` -> `R1(config-if)# ip address 10.1.1.1` -> `% Incomplete command.` (Forgot the subnet mask argument—typing `ip address 10.1.1.1 ?` shows `<A.B.C.D> IP subnet mask`).',
          '`R1(config-if)# sh ip int br` -> `% Invalid input...` (Ran a Privileged EXEC `show` command inside config-if without `do`). Typing `do sh ip int br` works immediately!',
        ],
        outcome:
          'Checking the prompt prefix (`>` vs `#` vs `(config-if)#`) and reading the `^` marker solves 90% of beginner CLI errors immediately.',
      },
    },

    iosCliGuide: {
      intro:
        'Apply these safe lab baseline commands on every fresh router/switch so console logs never interrupt your typing and typos never hang for 30 seconds.',
      commands: [
        {
          title: '1. Configure Safe Lab Console & Save Running Config to NVRAM',
          promptAndCommand: 'Router# configure terminal',
          output: `Router(config)# hostname R1
R1(config)# no ip domain-lookup
R1(config)# line console 0
R1(config-line)# logging synchronous
R1(config-line)# exec-timeout 15 0
R1(config-line)# end
R1# copy running-config startup-config
Destination filename [startup-config]? 
Building configuration...
[OK]`,
          lineByLine: [
            { segment: 'no ip domain-lookup', meaning: 'Stops IOS from wasting 30 seconds trying to DNS-resolve a mistyped command.' },
            { segment: 'logging synchronous', meaning: 'Keeps syslog console messages from splitting the middle of the command you are typing.' },
            { segment: 'copy running-config startup-config', meaning: 'Writes active RAM configuration to persistent NVRAM so changes survive a reload.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show startup-config',
        healthyLabel: 'Configuration Saved to NVRAM',
        healthyOutput: `Using 1428 out of 262136 bytes
hostname R1`,
        brokenLabel: 'Forgot to Save After Lab Edits',
        brokenOutput: `startup-config is not present`,
        diagnosis:
          'Any reload right now will boot a blank device. Run `copy running-config startup-config` (or `wr`) before closing a lab.',
      },
    },

    commonTraps: [
      {
        trap: 'Typing `show` commands directly inside `(config)#` or `(config-if)#` without `do`.',
        reality: 'Global and sub-config modes only accept configuration commands unless you prefix EXEC commands with `do` (e.g., `do show run`).',
      },
      {
        trap: 'Assuming pressing Enter after `hostname R1` permanently saves it across power cycles.',
        reality: 'Changes apply instantly to `running-config` in RAM only; you must execute `copy running-config startup-config` to persist to NVRAM.',
      },
      {
        trap: 'Using `reload` to clear a mistake without checking whether changes were saved.',
        reality: 'If you saved broken commands, `reload` boots right back into them; remove mistakes cleanly with `no <exact command>`.',
      },
      {
        trap: 'Waiting frozen when mistyping `shwo` at `R1#`.',
        reality: 'IOS tries DNS lookup on unknown words (`Translating "shwo"...domain server`). Prevent it with `no ip domain-lookup` (or abort with `Ctrl+Shift+6`).',
      },
    ],

    keyTerms: [
      {
        term: 'User EXEC Mode (`>`)',
        shortDef: 'Initial read-only CLI prompt allowing basic monitoring and ping.',
        fullDef: 'Entry-level IOS mode offering limited non-destructive commands (`ping`, `traceroute`, `show version`); cannot configure or view `running-config`.',
      },
      {
        term: 'Privileged EXEC Mode (`#`)',
        shortDef: 'Elevated administrative prompt unlocked with `enable`.',
        fullDef: 'Allows full inspection (`show running-config`, `debug`), file transfers, reloads, and entry into `configure terminal`.',
      },
      {
        term: 'running-config vs. startup-config',
        shortDef: 'Active volatile RAM config versus persistent NVRAM boot config.',
        fullDef: 'IOS executes live edits immediately in `running-config` (RAM) and boots from `startup-config` (NVRAM); sync them with `copy running-config startup-config`.',
      },
      {
        term: '`do` Prefix',
        shortDef: 'Modifier letting you run EXEC `show`/`ping` commands inside configuration modes.',
        fullDef: 'Saves backing out of `(config-if)#` or `(config-router)#` just to verify an IP or routing table.',
      },
    ],

    checkQuestions: [
      {
        id: 'c022-q1',
        prompt: 'You are sitting at `SW1(config-if)#` and want to check `show vlan brief` without leaving interface configuration mode. Which command works?',
        options: [
          'do show vlan brief',
          'show vlan brief',
          'enable show vlan brief',
          'run show vlan brief',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Prefixing any EXEC-level command with `do` lets you run it from Global or any sub-configuration mode.',
          'Incorrect: Bare `show` commands fail with `% Invalid input detected` inside `(config-if)#`.',
          'Incorrect: `enable` is not a modifier prefix.',
          'Incorrect: `run` is not a valid IOS EXEC prefix.',
        ],
        takeaway: 'Use `do <exec-command>` from any `(config*)#` prompt to inspect state without losing your place.',
      },
      {
        id: 'c022-q2',
        prompt: 'What does `% Incomplete command.` mean in Cisco IOS?',
        options: [
          'The command syntax entered so far is valid, but required arguments are missing at the end.',
          'You typed a misspelled word at the `^` marker.',
          'You typed too short an abbreviation that matches two different commands.',
          'The router CPU is too busy to process the command.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IOS recognized every word typed so far, yet needs additional parameters (check with `<command> ?`).',
          'Incorrect: Misspelled words or wrong modes trigger `% Invalid input detected at ^ marker`.',
          'Incorrect: Short prefixes matching multiple commands trigger `% Ambiguous command`.',
          'Incorrect: It is strictly a CLI parser message.',
        ],
        takeaway: '`% Incomplete command` -> append ` ?` to see the required missing arguments.',
      },
      {
        id: 'c022-q3',
        prompt: 'An engineer configures 20 VLANs on a switch, then trips the power cord before running `copy running-config startup-config`. What happens when the switch boots back up?',
        options: [
          'All 20 unsaved VLANs vanish because `running-config` resides in volatile RAM rather than NVRAM.',
          'All 20 VLANs stay intact automatically because IOS writes every Enter keystroke straight to flash.',
          'Only VLAN 10 survives.',
          'The switch fails POST and refuses to boot.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `running-config` lives in RAM; only `copy running-config startup-config` writes the active config to persistent NVRAM (and note normal VLANs also live in `vlan.dat` on flash on physical switches, though interface `switchport access vlan` assignments in RAM vanish!).',
          'Incorrect: IOS does not auto-save `running-config` to `startup-config`.',
          'Incorrect: Unsaved RAM changes are lost uniformly on power cycle.',
          'Incorrect: Missing `startup-config` boots cleanly into initial setup/blank config.',
        ],
        takeaway: 'Always run `copy running-config startup-config` after verifying changes.',
      },
      {
        id: 'c022-q4',
        prompt: 'Which prompt indicates you are inside Privileged EXEC mode?',
        options: ['R1#', 'R1>', 'R1(config)#', 'R1(config-if)#'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `#` without `(config)` indicates Privileged EXEC mode.',
          'Incorrect: `>` indicates read-only User EXEC mode.',
          'Incorrect: `(config)#` indicates Global Configuration mode.',
          'Incorrect: `(config-if)#` indicates Interface Configuration mode.',
        ],
        takeaway: '`>` = User EXEC, `#` = Privileged EXEC, `(config)#` = Global Config, `(config-if)#` = Interface Config.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Test Tab Completion, ? Help, Abbreviations & Copy Run Start in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 01.',
        'Use `?`, `Tab`, `conf t`, `do sh ip int br`, and `copy running-config startup-config` inside the simulated Cisco IOS terminal.',
      ],
      verificationCheck: 'Complete Lab 01 objectives using abbreviated IOS syntax and verify `startup-config` is saved.',
    },

    summaryBullets: [
      'IOS uses four core hierarchical prompts: `>` (User EXEC), `#` (Privileged EXEC), `(config)#` (Global Config), and sub-modes like `(config-if)#`.',
      'Use `?` for live syntax hints, `Tab` to auto-complete, and unique prefixes like `sh ip int br` for speed.',
      'Prefix EXEC commands with `do` inside config modes; use `exit` (up one level) or `end` / `Ctrl+Z` (straight to `#`).',
      'Read parser feedback cleanly: `% Incomplete command` (needs arguments), `% Invalid input` (wrong syntax/mode at `^`), `% Ambiguous command` (too short).',
      'RAM holds `running-config`; NVRAM holds `startup-config`. Save verified work with `copy running-config startup-config`.',
    ],

    sourcesToVerify: [
      'Cisco IOS Configuration Fundamentals Command Reference (CLI Basics & Configuration Files)',
    ],
  },

  'ccna.core.0.4.eth': {
    id: 'ccna.core.0.4.eth',
    moduleId: 'ccna',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.4 Ethernet and MAC Addresses',
    code: '0.4.1',
    title: 'Ethernet II Frame Fields, MAC Structure (OUI + Device) & Half vs Full Duplex',
    readMinutes: 11,
    prerequisites: ['0.3.1'],
    versionScope: 'shared',
    v11ExamTopics: ['Unit 0 (supports 1.3, 1.13, 2.1)'],
    v20ExamTopics: ['Unit 0 (supports 1.1, 2.1)'],

    learningObjectives: [
      'Identify all Ethernet II frame fields (Preamble/SFD, Destination MAC, Source MAC, EtherType, 46–1500B Payload, 4B FCS) and standard 64B–1518B (1522B with 802.1Q tag) frame sizes.',
      'Decode a 48-bit (12-hex) MAC address into its 24-bit vendor OUI and 24-bit device identifier, and recognize the Layer 2 broadcast MAC (`FFFF.FFFF.FFFF`).',
      'Distinguish half-duplex CSMA/CD shared collision domains from collision-free full-duplex modern switched links.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Undersized Frames (`Runts`), Bad `FCS`, and `FFFF.FFFF.FFFF` Storms Point Straight to Layer 2',
      narrative:
        'Every time you look at `show interfaces`, `show mac address-table`, or Wireshark, you are reading Ethernet frames. Knowing why `0x0800` means IPv4, `0x0806` means ARP, `0x86DD` means IPv6, and `0x8100` means an 802.1Q VLAN tag—and knowing why Ethernet enforces a 64-byte minimum and 1518-byte (1522-byte tagged) maximum—explains runts, giants, MTU fragmentation, and switch flooding instantly.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Standardized Shipping Envelopes With Fixed Labels and Tamper Seals',
      analogy:
        'Before any IP packet can ride a copper wire or fiber strand inside a LAN, Ethernet places it inside a standardized shipping sleeve. The front carries two 6-byte hardware stickers (**Destination MAC** first so switches route it fast, then **Source MAC** so switches learn where you live), a 2-byte **EtherType** sticker telling the receiver which protocol lies inside (`IPv4`, `IPv6`, or `ARP`), the IP payload (`46–1500` bytes), and a 4-byte **FCS** tamper seal at the back so damaged frames get tossed cleanly.',
      technicalDefinition:
        'IEEE 802.3 / Ethernet II encapsulates Layer 3 PDUs inside frames carrying a 7-byte Preamble + 1-byte SFD, 6-byte Destination and Source MAC addresses (24-bit OUI + 24-bit NIC ID), optional 4-byte 802.1Q tag (`0x8100`), 2-byte EtherType (`0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6), 46–1500-byte payload, and 4-byte CRC FCS trailer (64–1518 bytes untagged; up to 1522 bytes tagged).',
      paragraphs: [
        'Every **MAC address** is **48 bits** (6 bytes = **12 hexadecimal digits**, written by Cisco switches in dot-grouped quads like `aabb.cc00.1234` or on Windows/Linux as `aa:bb:cc:00:12:34`). The first 24 bits (6 hex characters) are the **OUI (Organizationally Unique Identifier)** assigned to the hardware manufacturer (Intel, Cisco, Apple), and the last 24 bits uniquely number that specific card.',
        'Memorize the key Layer 2 addresses and EtherTypes: **`FFFF.FFFF.FFFF`** is the **Ethernet Broadcast MAC** (switches flood it out every port in that VLAN except the arrival port). Multicast MACs for IPv4 start with **`0100.5e...`**. Key EtherTypes: **`0x0800` = IPv4**, **`0x0806` = ARP**, **`0x86DD` = IPv6**, and **`0x8100` = 802.1Q VLAN tag**.',
        'Legacy half-duplex links over hubs/coax shared one collision domain using **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection—listen, transmit, stop and wait random backoff if a collision happens). Modern twisted-pair/fiber switches run **full-duplex**, giving separate transmit and receive paths per port so CSMA/CD collisions disappear completely.',
      ],
    },

    deepDive: {
      intro: 'Inspect Ethernet II frame byte sizes, EtherType identifiers, and MAC notation formats.',
      steps: [
        {
          step: 'Header Fields',
          title: 'Destination MAC Before Source MAC',
          explanation: 'Switches read Destination MAC first (`bytes 1–6`) to make immediate cut-through/forwarding lookups, followed by Source MAC (`bytes 7–12`) to populate the CAM table.',
        },
        {
          step: 'EtherTypes',
          title: '`0x0800` (IPv4), `0x0806` (ARP), `0x86DD` (IPv6), `0x8100` (802.1Q)',
          explanation: 'Identifies the encapsulated upper payload so the receiver hands the packet to the right stack (IPv4, ARP, or IPv6).',
        },
        {
          step: 'Frame Sizes',
          title: '64B Minimum (Runts) & 1518B / 1522B Maximum (Giants)',
          explanation: 'Excluding the 8B Preamble/SFD: `6 Dst + 6 Src + 2 Type + 46..1500 Payload + 4 FCS = 64..1518 bytes` (or `1522 bytes` with a 4B 802.1Q tag!).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Ethernet II Frame Sizes & 48-Bit MAC Breakdown',
        asciiFallback: `[Preamble 7B + SFD 1B] | [Dst MAC 6B] [Src MAC 6B] [802.1Q 4B*] [Type 2B] [Payload 46-1500B] [FCS 4B]
  (Layer 1 sync)         |<------------- 64 to 1518 bytes (1522 bytes if 802.1Q tagged) ------------>|

48-BIT MAC ADDRESS (12 Hex Digits):
  [ OUI: 24 bits (6 hex) ] . [ Vendor Serial / NIC ID: 24 bits (6 hex) ]
  e.g., 0050.56AB.1122 (Cisco format)  ==  00:50:56:AB:11:22 (VMware OUI = 00:50:56)`,
      },
      workedExample: {
        title: 'Reading MACs & Frame Types in Switch Verification',
        context: 'You examine a switch CAM table and see `001a.2b3c.4d5e` on `Gi0/1` and an incoming ARP broadcast.',
        steps: [
          'Notice Destination MAC is `ffff.ffff.ffff` and EtherType is `0x0806` -> **ARP Request** broadcast across the local VLAN only.',
          'Switch records Source MAC `001a.2b3c.4d5e` -> `Gi0/1` into its MAC address table and floods the broadcast out all other ports in that VLAN.',
          'The target replies via unicast Destination MAC `001a.2b3c.4d5e`, which the switch forwards strictly to `Gi0/1`!',
        ],
        outcome: 'MAC learning + EtherType framing explain both switch flooding and unicast precision.',
      },
    },

    iosCliGuide: {
      intro: 'Inspect burned-in MAC addresses (`bia`), duplex mode, and MAC address table entries in IOS.',
      commands: [
        {
          title: 'Inspect Physical MAC (BIA) and Frame Counters on IOS',
          promptAndCommand: 'SW1# show interfaces GigabitEthernet0/1 | include address|duplex|CRC',
          output: `  Hardware is Gigabit Ethernet, address is 001a.2b3c.0001 (bia 001a.2b3c.0001)
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored`,
          lineByLine: [
            { segment: 'bia 001a.2b3c.0001', meaning: '48-bit Burned-In Address (first 24 bits `001a.2b` = Cisco OUI).' },
            { segment: 'Full-duplex', meaning: 'Simultaneous Tx/Rx with CSMA/CD collisions eliminated.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show interfaces GigabitEthernet0/1',
        healthyLabel: 'Clean Full-Duplex Framing',
        healthyOutput: `Full-duplex, 1000Mb/s | 0 runts, 0 giants, 0 CRC, 0 collisions`,
        brokenLabel: 'Duplex Mismatch / Bad Cable Symptoms',
        brokenOutput: `Half-duplex | 412 runts, 890 CRC, 319 late collisions`,
        diagnosis: 'Rising `CRC` or `runts`/`late collisions` signals Layer 1 cable damage or a half/full duplex mismatch.',
      },
    },

    commonTraps: [
      {
        trap: 'Including the 8-byte Preamble/SFD inside the standard `1518` (or `1522` tagged) Ethernet frame size.',
        reality: 'Layer 2 frame size (`64–1518` bytes untagged, `1522` with 802.1Q) counts from **Destination MAC through FCS**, excluding Preamble/SFD.',
      },
      {
        trap: 'Thinking `FFFF.FFFF.FFFF` crosses routers to reach remote subnets.',
        reality: 'Routers NEVER forward Layer 2 broadcast frames (`FFFF.FFFF.FFFF`) across subnet boundaries unless explicitly proxied/relayed (e.g., DHCP `ip helper-address`).',
      },
    ],

    keyTerms: [
      {
        term: 'OUI (Organizationally Unique Identifier)',
        shortDef: 'First 24 bits (6 hex chars) of a 48-bit MAC identifying the hardware vendor.',
        fullDef: 'Assigned globally by IEEE so NIC manufacturers never produce colliding MAC addresses.',
      },
      {
        term: 'EtherType',
        shortDef: '2-byte Ethernet II header field naming the encapsulated protocol (`0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6).',
        fullDef: 'Tells the receiving OS network stack which Layer 3 parser handles the payload.',
      },
      {
        term: 'CSMA/CD',
        shortDef: 'Legacy half-duplex Ethernet collision-handling protocol.',
        fullDef: 'Required only on shared hubs or half-duplex links; obsolete on full-duplex switched links.',
      },
    ],

    checkQuestions: [
      {
        id: 'c04eth-q1',
        prompt: 'What is the maximum standard Layer 2 Ethernet frame size INCLUDING an 802.1Q VLAN tag (with a standard 1500-byte IP MTU)?',
        options: ['1522 bytes', '1518 bytes', '1500 bytes', '64 bytes'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `14B header + 4B 802.1Q tag + 1500B payload + 4B FCS = 1522 bytes`.',
          'Incorrect: `1518 bytes` is the untagged Ethernet II maximum.',
          'Incorrect: `1500 bytes` is the Layer 3 IP MTU payload limit alone.',
          'Incorrect: `64 bytes` is the minimum Ethernet frame size.',
        ],
        takeaway: 'Standard Ethernet = `64–1518B` untagged; **`1522B`** with a 4B 802.1Q tag.',
      },
      {
        id: 'c04eth-q2',
        prompt: 'In an Ethernet II frame carrying an ARP Request, which **Destination MAC** and **EtherType** appear?',
        options: [
          'Destination MAC `FFFF.FFFF.FFFF` and EtherType `0x0806`',
          'Destination MAC `0000.0000.0000` and EtherType `0x0800`',
          'Destination MAC `0100.5E00.0005` and EtherType `0x86DD`',
          'Destination MAC `FFFF.FFFF.FFFF` and EtherType `0x8100` only',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: ARP Requests broadcast on Layer 2 (`FFFF.FFFF.FFFF`) with EtherType `0x0806`.',
          'Incorrect: `0x0800` is IPv4.',
          'Incorrect: `0100.5E00.0005` is OSPF multicast and `0x86DD` is IPv6.',
          'Incorrect: `0x8100` is an 802.1Q VLAN tag outer EtherType.',
        ],
        takeaway: '`0x0800` = IPv4, `0x0806` = ARP, `0x86DD` = IPv6, `0x8100` = 802.1Q.',
      },
      {
        id: 'c04eth-q3',
        prompt: 'In the 48-bit MAC address `0050.56AB.1122`, which portion represents the IEEE-assigned **OUI (vendor identifier)**?',
        options: [
          'The first 24 bits (`0050.56`)',
          'The last 24 bits (`AB.1122`)',
          'Only the final hex digit (`2`)',
          'All 48 bits belong solely to Cisco',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The leading 24 bits (first 6 hex digits `0050.56`) identify the manufacturer (OUI); the trailing 24 bits uniquely identify the card.',
          'Incorrect: The trailing 24 bits are the vendor-assigned NIC serial portion.',
          'Incorrect: 4 bits cannot hold an OUI.',
          'Incorrect: IEEE allocates OUIs across every NIC vendor worldwide (`00:50:56` belongs to VMware).',
        ],
        takeaway: '48-bit MAC = **24-bit OUI** + **24-bit Device ID**.',
      },
      {
        id: 'c04eth-q4',
        prompt: 'Why do modern switched **full-duplex** Gigabit Ethernet links never experience CSMA/CD collisions?',
        options: [
          'Transmit and receive wire pairs operate simultaneously over a dedicated point-to-point link to the switch port.',
          'Full-duplex links broadcast `FFFF.FFFF.FFFF` before every packet.',
          'Switches disable Layer 2 framing on Gigabit interfaces.',
          'Full-duplex forces all hosts to take turns with token passing.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Full-duplex separates send and receive paths on dedicated switched links so collisions cannot occur and CSMA/CD is disabled.',
          'Incorrect: Broadcast MACs do not prevent collisions.',
          'Incorrect: Switches forward standard Ethernet II frames.',
          'Incorrect: Ethernet does not use Token Ring token passing.',
        ],
        takeaway: 'Dedicated switched **full-duplex** links eliminate CSMA/CD collisions.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect Burned-In MACs & Interface Framing in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Run `show interfaces` and `show mac address-table` inside any switch lab to observe 12-hex dotted MAC notation and duplex state.',
      ],
      verificationCheck: 'Identifies OUI prefix, duplex status, and zero CRC errors.',
    },

    summaryBullets: [
      'A MAC address is 48 bits / 12 hex digits = 24-bit vendor OUI + 24-bit device ID (`FFFF.FFFF.FFFF` = L2 broadcast).',
      'Ethernet II frames span `64–1518B` (`1522B` with 4B 802.1Q VLAN tag).',
      'Key EtherTypes: `0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6, `0x8100` 802.1Q.',
      'Full-duplex dedicated links eliminate legacy CSMA/CD collisions.',
    ],

    sourcesToVerify: [
      'IEEE 802.3 Ethernet Standard & IEEE 802.1Q Tagging',
    ],
  },

  'ccna.core.0.5': {
    id: 'ccna.core.0.5',
    moduleId: 'ccna',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.5 IP, ARP, Ports & Life of a Packet',
    code: '0.5.1',
    title: 'ARP Resolution, Local vs Gateway Decisions, TTL & Full Laptop-to-Website Packet Walk',
    readMinutes: 12,
    prerequisites: ['0.4.1'],
    versionScope: 'shared',
    v11ExamTopics: ['Unit 0 (supports 1.5, 3.1)'],
    v20ExamTopics: ['Unit 0 (supports 1.3, 2.4, 3.1)'],

    learningObjectives: [
      'Trace how a host uses its IP + subnet mask to decide "local ARP directly for target IP" versus "ARP for Default Gateway MAC".',
      'Explain ARP Request (Layer 2 broadcast `FFFF.FFFF.FFFF`) vs ARP Reply (Layer 2 unicast) and inspect ARP caches (`arp -a`, `show ip arp`).',
      'Walk chronologically through an entire Laptop-to-HTTPS-Website flow: DNS lookup -> ARP gateway -> hop-by-hop MAC rewrite & TTL decrement -> TCP 3-way handshake -> HTTPS.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Seeing All Four Layers Click Together in One Continuous Packet Journey',
      narrative:
        'Beginners often learn DNS, ARP, switching, routing, and TCP in isolated silos—then freeze when troubleshooting a broken webpage. Tracing a single packet from browser click to server reply cements the exact dependency chain: if DNS fails, you never even look up an IP; if ARP for the default gateway fails, no packet leaves your desk; if any intermediate router lacks a return route, the TCP SYN-ACK never returns!',
    },

    plainEnglish: {
      analogyTitle: 'Think of Looking Up a Phone Number, Calling a Cab to the Airport, and Checking Boarding Passes',
      analogy:
        'Opening `https://shop.example.com` follows an exact choreography: (1) **DNS** looks up `"shop.example.com"` in the directory and returns IP `93.184.216.34`. (2) Your laptop checks its subnet mask: is `93.184.216.34` inside my room? No—it’s remote! So **ARP** shouts across the room (`FFFF.FFFF.FFFF`): `"Who owns Default Gateway IP 192.168.1.1? Tell me your MAC!"` The router whispers back via **unicast ARP Reply** with its MAC. (3) Your laptop addresses the Layer 2 envelope to the **Router’s MAC** while writing `93.184.216.34` on the inside Layer 3 IP envelope. (4) Each router decrements **TTL by 1**, swaps the outside MAC sleeve for the next hop, and delivers your **TCP SYN** so the 3-way handshake and **TLS/HTTPS** transfer can begin.',
      technicalDefinition:
        'End-to-end packet delivery integrates Layer 7 name resolution (DNS UDP 53), Layer 3 subnet locality evaluation, Layer 2/3 Address Resolution Protocol (ARP: L2 broadcast request -> L2 unicast reply), hop-by-hop Ethernet frame rewriting paired with IP TTL decrement across routers, and Layer 4 TCP 3-way session establishment.',
      paragraphs: [
        'Watch carefully how **ARP** works: because you cannot build an Ethernet frame without a Destination MAC, your host checks whether the Destination IP is in the **same subnet**. If **same subnet**, ARP asks directly: `"Who has <Destination IP>?"` If **different subnet**, ARP asks ONLY: `"Who has <Default Gateway IP>?"`—your host NEVER sends an ARP request for a remote server’s IP!',
        'Every router hop inspects the IP header, **decrements TTL by 1** (dropping at `TTL = 0` and returning ICMP Time Exceeded—which is exactly how `traceroute` works!), strips the old Layer 2 Ethernet header, and wraps the unchanged IP packet in a fresh Ethernet frame addressed to the next hop’s MAC.',
      ],
    },

    deepDive: {
      intro: 'Follow every step of a laptop loading `https://app.example.com` from a cold cache.',
      steps: [
        {
          step: '1. DNS (UDP 53)',
          title: 'Resolve Hostname to IPv4 Address',
          explanation: 'Laptop checks local DNS cache, then queries configured DNS server (`UDP 53`) to obtain `203.0.113.50`.',
        },
        {
          step: '2. Local vs Remote + ARP',
          title: 'Subnet Check & ARP Broadcast -> Unicast Reply',
          explanation: '`203.0.113.50` is outside `192.168.10.0/24`, so laptop sends an ARP Request (`Dst MAC = FFFF.FFFF.FFFF`) asking for Gateway `192.168.10.1`. Router R1 replies with a unicast ARP Reply containing R1’s `Gi0/0` MAC.',
        },
        {
          step: '3. L3 Hop-by-Hop Routing',
          title: 'IP Fixed, MAC Rewritten, TTL Decremented',
          explanation: 'Laptop sends Frame 1 (`SrcIP=192.168.10.20, DstIP=203.0.113.50 | SrcMAC=Laptop, DstMAC=R1`). R1 strips Frame 1, decrements TTL (`64 -> 63`), forwards Frame 2 toward ISP/next hop.',
        },
        {
          step: '4. TCP 3-Way Handshake & HTTPS',
          title: 'SYN -> SYN-ACK -> ACK -> TLS 443',
          explanation: 'Once `SYN / SYN-ACK / ACK` completes on `TCP 443`, TLS negotiates encryption keys and HTTP GET/200 OK exchanges app data.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Cold-Cache Packet Walk: DNS -> ARP -> L3 Routing -> TCP 443',
        asciiFallback: `1. DNS Query  : UDP 53  -> "app.example.com?" -> Answer: 203.0.113.50
2. ARP Request: L2 Bcast FFFF.FFFF.FFFF -> "Who has GW 192.168.10.1?"
   ARP Reply  : L2 Unicast -> "192.168.10.1 is at R1-MAC"
3. TCP SYN    : [L2: Laptop->R1] [L3: 192.168.10.20->203.0.113.50, TTL=64] [L4: Sport->443]
4. At Router  : Strips L2, TTL=63, wraps NEW L2 [R1->NextHop] (IP stays 192.168.10.20->203.0.113.50)
5. Server Ack : SYN-ACK -> ACK -> TLS Handshake -> HTTPS Data`,
      },
      workedExample: {
        title: 'Inspecting `arp -a` & `show ip arp` After Reaching a Gateway',
        context: 'PC1 (`192.168.10.20/24`, Gateway `192.168.10.1`) opens a connection to `8.8.8.8`.',
        steps: [
          'Run `arp -a` on PC1: you see ONLY local neighbor IPs such as `192.168.10.1` mapped to a MAC—NEVER `8.8.8.8`!',
          'Run `show ip arp` on Gateway R1: lists `192.168.10.20` -> `PC1 MAC` with `ARPA` encapsulation and Age timer.',
        ],
        outcome: 'Proves ARP resolves ONLY same-link IP-to-MAC pairs (local hosts or your Default Gateway).',
      },
    },

    iosCliGuide: {
      intro: 'Verify live ARP resolution and troubleshoot missing ARP replies in IOS.',
      commands: [
        {
          title: 'Inspect Router ARP Cache & Clear Stale Entries',
          promptAndCommand: 'R1# show ip arp',
          output: `Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.10.1            -   001a.2b3c.0001  ARPA   GigabitEthernet0/0
Internet  192.168.10.20           2   aabb.cc00.1020  ARPA   GigabitEthernet0/0`,
          lineByLine: [
            { segment: 'Age -', meaning: 'Router’s own local interface IP never ages out.' },
            { segment: 'Age 2', meaning: 'Learned dynamically via ARP; clears if idle or via `clear arp-cache`.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip arp',
        healthyLabel: 'Complete Resolved Hardware MAC',
        healthyOutput: `Internet  192.168.10.20   2   aabb.cc00.1020  ARPA   GigabitEthernet0/0`,
        brokenLabel: 'Unanswered ARP (`Incomplete`)',
        brokenOutput: `Internet  192.168.10.99   0   Incomplete      ARPA`,
        diagnosis:
          '`Incomplete` means the router sent an ARP Request for `192.168.10.99` and received zero ARP Reply (host offline, wrong VLAN, or wrong IP). Notice why the very first ping packet sometimes times out (`.!!!!`): packet 1 waited for ARP!',
      },
    },

    commonTraps: [
      {
        trap: 'Expecting `8.8.8.8` or remote server MAC addresses to appear inside a PC’s `arp -a` table.',
        reality: 'ARP only works inside the local broadcast domain—remote destinations use the **Default Gateway’s MAC** in `arp -a`.',
      },
      {
        trap: 'Worrying when the very first ping packet prints `.` followed by `!!!!` (`.!!!!` = 80%).',
        reality: 'On a cold cache, packet #1 often triggers ARP resolution and expires before ARP finishes; packets #2–#5 succeed cleanly!',
      },
    ],

    keyTerms: [
      {
        term: 'ARP (Address Resolution Protocol)',
        shortDef: 'Resolves an IPv4 address on the local link to its 48-bit MAC address.',
        fullDef: 'Uses Layer 2 Broadcast Request (`FFFF.FFFF.FFFF`) and Layer 2 Unicast Reply (`0x0806`).',
      },
      {
        term: 'TTL (Time to Live)',
        shortDef: '8-bit IP header hop counter decremented by 1 at every router.',
        fullDef: 'Prevents infinite routing loops; packets reaching `TTL = 0` are discarded with ICMP Time Exceeded.',
      },
      {
        term: 'Default Gateway',
        shortDef: 'Local router IP address on a host’s own subnet used to reach external networks.',
        fullDef: 'Hosts compare Destination IP + Subnet Mask; any remote destination triggers ARP for the Default Gateway MAC.',
      },
    ],

    checkQuestions: [
      {
        id: 'c05pkt-q1',
        prompt: 'Host PC1 (`192.168.1.50/24`, Gateway `192.168.1.1`) sends a packet to Web Server `198.51.100.10` with an empty ARP cache. For WHICH IP address does PC1 broadcast an ARP Request?',
        options: ['192.168.1.1 (its Default Gateway)', '198.51.100.10 (the remote Web Server)', '255.255.255.255', '127.0.0.1'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `198.51.100.10` is off-subnet, so PC1 ARPs solely for its Default Gateway (`192.168.1.1`).',
          'Incorrect: ARP broadcasts cannot cross routers to reach `198.51.100.10`.',
          'Incorrect: Hosts never ARP for the limited broadcast IP.',
          'Incorrect: Loopback is internal to the host OS.',
        ],
        takeaway: 'Off-subnet destination -> ARP for **Default Gateway**; same-subnet destination -> ARP for **Target Host IP**.',
      },
      {
        id: 'c05pkt-q2',
        prompt: 'What happens to a packet’s IP **TTL** value and **MAC addresses** each time it crosses a router?',
        options: [
          'TTL decrements by 1; Source and Destination MAC addresses are rewritten for the next link.',
          'TTL stays identical; MAC addresses stay unchanged end-to-end.',
          'TTL increments by 1; Source and Destination IP addresses reverse.',
          'TTL becomes 255; MAC addresses are stripped permanently.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Every router decrements IP TTL by 1 and builds a brand-new Layer 2 Ethernet frame for the outbound link.',
          'Incorrect: Only switches keep MACs/TTL untouched.',
          'Incorrect: TTL always counts down.',
          'Incorrect: Frame headers are replaced, not removed.',
        ],
        takeaway: 'At every router hop: `TTL - 1`, new `Src/Dst MAC`, original `Src/Dst IP` preserved (without NAT).',
      },
      {
        id: 'c05pkt-q3',
        prompt: 'On a freshly booted lab router, you ping a newly connected peer `10.10.10.2` and Cisco IOS prints `.!!!!` (`Success rate is 80 percent`). Why did the very first dot fail?',
        options: [
          'Packet #1 waited for cold ARP resolution (`FFFF.FFFF.FFFF` -> Unicast Reply) before timing out; packets #2–#5 succeeded once cached.',
          'An access-list blocked exactly 20% of ICMP packets randomly.',
          'The router had a half-duplex cable mismatch.',
          'OSPF dropped every fifth packet.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: When `show ip arp` has no cached MAC entry yet, packet 1 pauses for ARP (`Incomplete`) and times out while packets 2–5 forward normally.',
          'Incorrect: Standard ACLs do not drop 20% randomly.',
          'Incorrect: Repeat pings after ARP populates show `!!!!!` (100%).',
          'Incorrect: Unrelated to OSPF.',
        ],
        takeaway: '`.!!!!` on the first ping almost always indicates normal cold **ARP resolution** delay.',
      },
      {
        id: 'c05pkt-q4',
        prompt: 'With completely empty caches on a user’s browser PC, what is the exact chronological order before HTTPS web traffic transfers?',
        options: [
          'DNS lookup (UDP 53) -> ARP for Default Gateway -> L3 routed TCP SYN -> SYN-ACK -> ACK -> TLS/HTTPS',
          'ARP for Web Server Public IP -> TCP SYN -> DNS lookup -> DHCP Discover',
          'TCP SYN -> DNS lookup -> ARP for 8.8.8.8 -> HTTPS',
          'TLS handshake -> ARP -> DNS -> TCP SYN',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: You need the server IP via DNS first, then the gateway’s MAC via ARP to send the TCP SYN packet, then complete 3-way handshake + TLS.',
          'Incorrect: Hosts never ARP for off-subnet public IPs, and TCP cannot open without an IP from DNS.',
          'Incorrect: Cannot send TCP SYN without destination IP from DNS.',
          'Incorrect: TLS runs atop an already established TCP session.',
        ],
        takeaway: 'Order: **DNS** -> **ARP (Gateway)** -> **L3 Routing** -> **TCP 3-Way** -> **TLS/HTTPS**.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect Cold ARP Resolution & Pings in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Run `ping` followed by `show ip arp` on a router in IOS Labs to verify resolved `ARPA` entries.',
      ],
      verificationCheck: 'Verifies local peer MAC entries appear in `show ip arp`.',
    },

    summaryBullets: [
      'Hosts compare Destination IP + Subnet Mask to choose Direct Local ARP vs Default Gateway ARP.',
      'ARP Requests use Layer 2 broadcast (`FFFF.FFFF.FFFF`); ARP Replies use Layer 2 unicast.',
      'Life of a Packet order: DNS (`UDP 53`) -> ARP Gateway -> L3 Routing (`TTL - 1`, MAC rewrite) -> TCP 3-way handshake -> HTTPS.',
      '`show ip arp` (`Incomplete`) explains `.!!!!` first-packet cold-ARP delays.',
    ],

    sourcesToVerify: [
      'RFC 826 — An Ethernet Address Resolution Protocol (ARP)',
      'RFC 791 — Internet Protocol (TTL & Hop Forwarding)',
    ],
  },

  'ccna.core.0.7': {
    id: 'ccna.core.0.7',
    moduleId: 'ccna',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.7 Lab Habits, Key Numbers Appendix & v1.1/v2.0 Map',
    code: '0.7.1',
    title: 'Lab Environments, Study Habits, Key Numbers Appendix & v1.1/v2.0 Crossover Guide',
    readMinutes: 14,
    prerequisites: ['0.6.1'],
    versionScope: 'shared',
    v11ExamTopics: ['Unit 0 Reference Appendix'],
    v20ExamTopics: ['Unit 0 Reference Appendix'],

    learningObjectives: [
      'Follow disciplined lab engineering habits: draw topology & IP plan first, change one thing at a time, verify after every change, save configs, and read error messages carefully.',
      'Recall critical CCNA exam constants on sight (Administrative Distance, RFC 1918 & special IPv4 ranges, Ports, STP/OSPF timers & priorities, Syslog levels, VLANs, PoE, Wi-Fi channels).',
      'Understand which CCNA v1.1 foundation topics remain essential background on CCNA v2.0 (OSI/TCP-IP, TCP vs UDP, Campus Topologies, WLC GUI/AP Modes, Terraform/Chef/Puppet context).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Good Lab Habits & Knowing Key Constants Double Your Exam Speed',
      narrative:
        'Whether you practice inside Cisco Packet Tracer, Cisco Modeling Labs (CML), GNS3/EVE-NG, or our built-in IOS Lab Simulator, beginners waste hours when they type 30 config lines blindly without saving or verifying step by step. Pair rock-solid lab discipline with instant recall of AD values, well-known ports, special IPv4 ranges, and STP/OSPF defaults—and both lab simulations and multi-choice questions become second nature.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an Aircraft Pre-Flight Checklist and Cockpit Reference Card',
      analogy:
        'Pilots don’t guess checklist items from memory under pressure—they verify step by step and keep critical numbers (stall speeds, transponder codes) memorized cold. In networking, your **six lab habits** stop accidental loops and lost configs, while the **Key Numbers Appendix** below acts as your single cockpit reference sheet across all domains.',
      technicalDefinition:
        'Effective Cisco lab methodology enforces declarative topology/IP planning, atomic single-change verification, NVRAM config persistence (`copy running-config startup-config`), and rapid recall of IETF/IEEE/Cisco defaults alongside v1.1-to-v2.0 blueprint deltas.',
      paragraphs: [
        'Use the right simulator for each stage: **our built-in IOS Workbench** for rapid CLI muscle memory, **Cisco Packet Tracer** for beginner multi-device labs, and **Cisco Modeling Labs (CML) / EVE-NG / GNS3** for real virtual IOS XE images.',
        'Practice these **Six Golden Lab Habits** on every exercise:\n1. **Draw the topology & IP/VLAN plan FIRST** before typing a line.\n2. **Make ONE change at a time** (never paste 40 unverified lines across 3 boxes).\n3. **Verify after every step** (`show ip int br`, `show vlan br`, `show ip ospf neighbor`, `ping`).\n4. **Save configurations (`copy run start` / `wr`)** before finishing or testing reloads.\n5. **Read IOS error lines** (`^` caret, `% Incomplete`, `% Ambiguous`, `Overlaps`).\n6. **Reset to a known clean baseline** whenever a topology gets hopelessly tangled.',
        '**v1.1 Topics Removed from v2.0 (Still Useful Background)**: Notice that CCNA v2.0 trimmed explicit standalone bullets for `1.1 Network Components`, `1.2 Topologies`, `1.5 TCP vs UDP`, `2.6–2.9 WLC GUI / AP Modes`, `4.2/4.8/4.9 QoS/TFTP/FTP`, `5.9 Wireless Security`, and `6.6 Terraform/Chef/Puppet`—yet **all of those concepts still underpin v2.0 troubleshooting and security questions**! If you take v2.0, keep them as quick background awareness.',
      ],
    },

    deepDive: {
      intro: 'Bookmark this master CCNA Key Numbers Reference Sheet across every domain.',
      steps: [
        {
          step: 'Routing & IPv4',
          title: 'Administrative Distance & Special IPv4 Blocks',
          explanation:
            '• **AD**: Connected `0` | Static `1` | eBGP `20` | EIGRP `90` | OSPF `110` | IS-IS `115` | RIP `120` | iBGP `200` | Unknown `255`.\n• **Private RFC 1918**: `10.0.0.0/8`, `172.16.0.0/12` (`.16`–`.31`), `192.168.0.0/16`.\n• **Special IPv4**: `127.0.0.0/8` Loopback | `169.254.0.0/16` APIPA | `100.64.0.0/10` CGNAT (RFC 6598) | `224.0.0.0/4` Multicast | `255.255.255.255` Limited Broadcast.',
        },
        {
          step: 'Ports & Protocols',
          title: 'TCP/UDP Well-Known & Wireless/Tunnel Ports',
          explanation:
            '• **TCP**: `20/21` FTP, `22` SSH/SFTP/SCP, `23` Telnet, `25` SMTP, `49` TACACS+, `53` DNS zone/large, `80` HTTP, `443` HTTPS/RESTCONF.\n• **UDP**: `53` DNS queries, `67/68` DHCP, `69` TFTP, `123` NTP, `161/162` SNMP, `514` Syslog, `1812/1813` RADIUS, `5246/5247` CAPWAP.',
        },
        {
          step: 'Switching & STP',
          title: 'VLANs, STP Costs/Timers, MAC & EtherChannel',
          explanation:
            '• **VLANs**: Normal `1–1005` (`1002–1005` legacy), Extended `1006–4094`, `802.1Q` Tag = **4 bytes** (`0x8100`).\n• **MAC aging**: `300s` (5 min).\n• **STP**: Default priority `32768` (steps of `4096`), Hello `2s` / Forward Delay `15s` / Max Age `20s`; Cost: 10M=`100`, 100M=`19`, 1G=`4`, 10G=`2`.\n• **EtherChannel**: Max `8` active (`16` LACP w/ standby); **PoE**: `802.3af` `15.4W`, `802.3at` `30W`, `802.3bt` `60–90W`.',
        },
        {
          step: 'OSPF, ACLs, Syslog & Wi-Fi',
          title: 'OSPF Multicast, Syslog 0–7, ACL Ranges & 2.4 GHz Channels',
          explanation:
            '• **OSPF**: AllSPFRouters `224.0.0.5`, AllDRouters `224.0.0.6`; Hello `10s` / Dead `40s` (broadcast/P2P), Hello `30s` / Dead `120s` (NBMA); Ref BW `100 Mbps`.\n• **ACL Numbers**: Standard `1–99, 1300–1999`; Extended `100–199, 2000–2699`.\n• **Syslog 0–7**: `0` Emerg, `1` Alert, `2` Crit, `3` Error, `4` Warn, `5` Notice, `6` Info, `7` Debug.\n• **Wi-Fi 2.4 GHz Non-Overlapping**: Channels **`1, 6, 11`**.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Rapid Exam Constants Card (AD | STP Costs | Syslog | Ports)',
        asciiFallback: `AD:    C=0  S=1  eBGP=20  EIGRP=90  OSPF=110  IS-IS=115  RIP=120  iBGP=200
STP:   10M=100  100M=19  1G=4  10G=2  |  Prio=32768 (+4096)  |  Timers=2/15/20s
OSPF:  224.0.0.5 / 224.0.0.6  |  Hello/Dead=10/40s  |  Default Ref BW=100 Mbps
SYSLOG: 0-Emerg 1-Alert 2-Crit 3-Err 4-Warn 5-Notice 6-Info 7-Debug`,
      },
      workedExample: {
        title: 'Using the Six Lab Habits to Build a Multi-Device OSPF Lab Cleanly',
        context: 'You launch IOS Lab 05 (Single-Area OSPF Adjacency & Router ID).',
        steps: [
          'Read the IP/Loopback plan first -> verify interfaces with `show ip int br` BEFORE typing `router ospf 1`.',
          'Bring up links (`no shut`) -> ping direct neighbors FIRST.',
          'Configure OSPF on R1 -> verify `show ip ospf interface brief` -> configure R2 -> verify `FULL` in `show ip ospf neighbor`.',
          'Save with `copy running-config startup-config` (`wr`).',
        ],
        outcome: 'Zero wild guessing; every single layer is confirmed before advancing.',
      },
    },

    iosCliGuide: {
      intro: 'Keep these 5 high-frequency diagnostic commands ready on every Cisco device.',
      commands: [
        {
          title: 'Five-Command Lab Baseline & Save Sequence',
          promptAndCommand: 'R1# show ip interface brief',
          output: `R1# show vlan brief              ! L2 VLANs & access ports
R1# show interfaces trunk        ! 802.1Q tagged trunks & native VLAN
R1# show ip ospf neighbor        ! OSPF FULL/2WAY adjacency checks
R1# show ip route                ! Final forwarding & AD verification
R1# copy running-config startup-config`,
          lineByLine: [
            { segment: 'Layer-by-layer show suite', meaning: 'Verifies physical/IP up status, L2 VLAN/trunks, L3 neighbor state, and final RIB paths.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show startup-config',
        healthyLabel: 'Baseline Config Saved After Verification',
        healthyOutput: `Using 1680 out of 262136 bytes [OK]`,
        brokenLabel: 'Untested Mega-Paste + Unsaved RAM',
        brokenOutput: `% Overlapping / bad syntax halfway through paste -> half-configured box`,
        diagnosis: 'Verify one logical block at a time and always save working checkpoints.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming OSPF Default Reference Bandwidth (`100 Mbps`) treats 1G and 10G links differently.',
        reality: 'At default `100 Mbps`, BOTH 1G and 10G compute Cost = `1`! Change `auto-cost reference-bandwidth 10000` (or `100000`) consistently on all OSPF routers.',
      },
      {
        trap: 'Forgetting `100.64.0.0/10` (CGNAT) and `169.254.0.0/16` (APIPA) alongside RFC 1918.',
        reality: 'Know every special IPv4 range (`10/8`, `172.16/12`, `192.168/16`, `127/8`, `169.254/16`, `100.64/10`) by sight.',
      },
    ],

    keyTerms: [
      {
        term: 'Cisco Packet Tracer / CML / GNS3',
        shortDef: 'Primary CCNA desktop & virtualized network lab platforms.',
        fullDef: 'Packet Tracer simulates Cisco hardware simply; CML, GNS3, and EVE-NG run real virtual Cisco IOS XE images.',
      },
      {
        term: '100.64.0.0/10 (RFC 6598 CGNAT)',
        shortDef: 'Shared address space (`100.64.0.0–100.127.255.255`) reserved for ISP Carrier-Grade NAT.',
        fullDef: 'Neither public internet nor private enterprise LAN RFC 1918 space.',
      },
      {
        term: 'Administrative Distance (AD)',
        shortDef: 'Route source trustworthiness (`C=0, S=1, eBGP=20, EIGRP=90, OSPF=110, RIP=120, iBGP=200`).',
        fullDef: 'Lowest AD wins when multiple protocols learn the exact same prefix and mask.',
      },
    ],

    checkQuestions: [
      {
        id: 'c07ref-q1',
        prompt: 'Which set lists the correct Cisco default **Administrative Distances** for Connected, Static, eBGP, EIGRP, and OSPF?',
        options: [
          'Connected 0, Static 1, eBGP 20, EIGRP 90, OSPF 110',
          'Connected 1, Static 0, eBGP 200, EIGRP 110, OSPF 90',
          'Connected 0, Static 1, eBGP 110, EIGRP 90, OSPF 120',
          'Connected 0, Static 5, eBGP 20, EIGRP 100, OSPF 110',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `C=0, S=1, eBGP=20, EIGRP=90, OSPF=110` (plus `IS-IS=115, RIP=120, iBGP=200`).',
          'Incorrect: Inverted Connected/Static and EIGRP/OSPF.',
          'Incorrect: eBGP is 20 (iBGP is 200) and RIP is 120.',
          'Incorrect: Standard static route AD is 1.',
        ],
        takeaway: 'Memorize `0 / 1 / 20 / 90 / 110 / 115 / 120 / 200`.',
      },
      {
        id: 'c07ref-q2',
        prompt: 'What is `100.64.0.0/10` (`100.64.0.0 – 100.127.255.255`) officially reserved for?',
        options: [
          'Carrier-Grade NAT (CGNAT) shared ISP address space (RFC 6598)',
          'Automatic Private IP Addressing (APIPA) DHCP fallback',
          'Enterprise RFC 1918 internal corporate LANs',
          'OSPF All-Routers multicast',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: RFC 6598 assigns `100.64.0.0/10` exclusively for ISP Carrier-Grade NAT.',
          'Incorrect: APIPA is `169.254.0.0/16`.',
          'Incorrect: RFC 1918 covers `10/8`, `172.16/12`, `192.168/16`.',
          'Incorrect: OSPF uses `224.0.0.5` / `224.0.0.6`.',
        ],
        takeaway: '`100.64.0.0/10` = CGNAT; `169.254.0.0/16` = APIPA; `127.0.0.0/8` = Loopback.',
      },
      {
        id: 'c07ref-q3',
        prompt: 'Which set correctly pairs IEEE STP port path costs (`100M / 1G / 10G`) and Syslog severities (`0` vs `7`)?',
        options: [
          'STP Cost: 100M=19, 1G=4, 10G=2 | Syslog 0=Emergency, 7=Debugging',
          'STP Cost: 100M=4, 1G=19, 10G=100 | Syslog 0=Debugging, 7=Emergency',
          'STP Cost: 100M=1, 1G=1, 10G=1 | Syslog 0=Info, 7=Alert',
          'STP Cost: 100M=50, 1G=20, 10G=10 | Syslog 0=Warn, 7=Error',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Faster links earn lower STP costs (`10M=100, 100M=19, 1G=4, 10G=2`), and Syslog `0` is highest Emergency down to `7` Debugging.',
          'Incorrect: Costs and severities are inverted.',
          'Incorrect: `1` across 100M/1G/10G is un-tuned OSPF reference bandwidth, not STP cost.',
          'Incorrect: Invalid STP cost and Syslog values.',
        ],
        takeaway: 'STP Costs: `100M=19, 1G=4, 10G=2` | Syslog: `0=Emergency -> 7=Debug`.',
      },
      {
        id: 'c07ref-q4',
        prompt: 'When troubleshooting a messy multi-switch lab where 30 pasted lines half-failed, which Golden Lab Habit fixes root mistakes fastest?',
        options: [
          'Change one logical setting at a time, run `show` verification after each step, and save clean baselines with `copy run start`.',
          'Paste 50 more lines rapidly without checking `show` outputs.',
          'Never save startup-config so switches wipe on every reboot.',
          'Ignore IOS `^` caret syntax errors.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Atomic one-step edits paired with immediate `show` verification and baseline saves prevent cascading lab confusion.',
          'Incorrect: Blind mega-pastes multiply broken config lines.',
          'Incorrect: Forgetting `copy run start` loses working checkpoints.',
          'Incorrect: The `^` caret points directly at the invalid syntax token.',
        ],
        takeaway: 'Plan first -> edit one block -> verify with `show` -> save (`copy run start`).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Apply Disciplined Lab Habits in IOS Labs 01–12',
      targetTab: 'labs',
      instructions: [
        'Complete any lab inside IOS Labs by running baseline `show` checks first, applying one configuration block at a time, and saving with `copy running-config startup-config`.',
      ],
      verificationCheck: 'Builds clean verified topologies and persists running changes cleanly.',
    },

    summaryBullets: [
      'Practice in Packet Tracer, CML, GNS3/EVE-NG, or our IOS Lab Workbench using one-change-at-a-time verification.',
      'Memorize AD (`0, 1, 20, 90, 110, 120, 200`), special IPv4 blocks (`1918`, `127/8`, `169.254/16`, `100.64/10`), and STP/OSPF timers.',
      'Even when v2.0 drops standalone v1.1 bullets (WLC GUI, TCP/UDP comparison, Terraform), those fundamentals remain crucial context.',
    ],

    sourcesToVerify: [
      'RFC 6598 (CGNAT 100.64.0.0/10), RFC 1918 & Cisco CCNA 200-301 v1.1/v2.0 Blueprints',
    ],
  },
};
