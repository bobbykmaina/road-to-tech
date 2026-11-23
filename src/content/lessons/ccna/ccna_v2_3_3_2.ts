import { DeepLessonDocument } from '../../../types/curriculum';

export const LESSON_CCNA_V2_3_3_2: DeepLessonDocument = {
  id: 'ccna.v2.3.3.2',
  moduleId: 'ccna',
  unitTitle: 'Unit 3: IP Routing',
  topicTitle: '3.3 Single-Area OSPFv2 and OSPFv3',
  code: '3.3.2',
  title: 'OSPFv2 Neighbor States, Adjacency Requirements & DR/BDR Election',
  readMinutes: 14,
  prerequisites: ['0.2.1 (IP Addressing & Masks)', '3.1.1 (Interpreting Routing Tables)', '3.3.1 (Link-State vs Distance-Vector Concepts)'],
  versionScope: 'shared',
  v11ExamTopics: ['3.4 Configure and verify single area OSPFv2 (Neighbor adjacencies, Point-to-point, Broadcast DR/BDR, Router ID)'],
  v20ExamTopics: ['3.3 Configure and verify single-area OSPFv2 and OSPFv3 (Neighbor adjacencies without authentication, Point-to-point, Broadcast with DR/BDR, Router ID)'],

  learningObjectives: [
    'Trace every OSPFv2 neighbor state from Down through Full and distinguish transient states from healthy steady states.',
    'Predict whether two routers will form an adjacency by checking Router ID uniqueness and the five mandatory Hello/interface parameters.',
    'Determine the Designated Router (DR), Backup Designated Router (BDR), and DROTHER roles on an Ethernet broadcast segment using OSPF priority and Router ID.',
    'Diagnose stuck neighbor states (stuck in Init, 2-Way, or ExStart) and partial `point-to-point` network-type mismatches using Cisco IOS show commands.',
  ],

  whyThisMatters: {
    scenarioTitle: 'Two Newly Cabled Branch Routers Cannot See Each Other’s Subnets',
    narrative:
      'Imagine you are on shift as a junior network engineer at a regional logistics company. A technician racks a new branch router (R4) and plugs it into the campus core switch VLAN 20, alongside three existing routers (R1, R2, and R3). Five minutes later, warehouse scanners behind R4 still cannot reach the ERP server. You log into R4 and run "show ip ospf neighbor". To your surprise, R4 lists "2WAY/DROTHER" next to R3, shows "EXSTART" next to R2, and does not list R1 at all. Is everything broken, or is one of those states completely normal? Knowing the exact difference between a healthy 2-Way peering on a broadcast LAN, a stuck ExStart MTU mismatch, and a missing Hello parameter lets you pinpoint the real fault in two minutes instead of blindly rebooting core routers.',
  },

  plainEnglish: {
    analogyTitle: 'Think of a Neighborhood Watch Captain Before Sharing Street Maps',
    analogy:
      'Before two routers share their full road maps (Link-State Advertisements, or LSAs), they perform a polite hallway introduction called a Hello handshake. Think of four neighbors standing in a hallway with street maps. If all four neighbors shouted every street change to every other neighbor directly, you would get six messy conversations at once—and with twenty neighbors, hundreds of duplicate updates. Instead, the neighborhood elects one Captain (the Designated Router, or DR) and one Vice-Captain (the Backup Designated Router, or BDR). Every neighbor forms a full, deep map-syncing relationship ONLY with the Captain and Vice-Captain. Regular neighbors still nod hello to each other across the hallway—they recognize each other ("2-Way")—but they deliberately stop short of swapping full map binders with each other so nobody wastes bandwidth.',
    technicalDefinition:
      'Open Shortest Path First version 2 (OSPFv2) is an open-standard (RFC 2328) link-state Interior Gateway Protocol that runs directly over IP protocol 89. Routers discover neighbors via multicast Hello packets (224.0.0.5), verify compatibility parameters before exchanging Link-State Databases (LSDBs), elect a DR and BDR on multi-access broadcast networks to reduce LSA flooding from O(n^2) to O(n), and progress eligible peers to the FULL state before running Dijkstra’s Shortest Path First (SPF) algorithm.',
    paragraphs: [
      'A complete beginner often assumes two routers are "neighbors" as soon as a cable connects them, or assumes that "FULL" is the only acceptable state on "show ip ospf neighbor". Both assumptions cause real mistakes in labs and production outages. In OSPF, a **neighbor** (two routers exchanging Hello packets and seeing each other’s Router IDs) is different from an **adjacent** router (two neighbors that have synchronized their entire Link-State Databases and sit in the FULL state).',
      'Why does OSPF separate those two stages? Because exchanging link-state databases requires CPU, memory, and bandwidth. If two routers disagree on basic rules—such as which Area they belong to, how often they send Hellos, or the subnet mask on a shared Ethernet link—syncing maps would produce loops or broken forwarding tables. So OSPF enforces a strict state-machine gatekeeper before any route updates ever travel across the wire.',
      'Even after parameters match, OSPF checks the **network type**. On a direct link between two routers (such as a serial cable or an Ethernet link explicitly configured as `ip ospf network point-to-point`), there is no crowd—only two routers—so no Captain is needed, and both routers advance straight to FULL. On a standard Ethernet LAN (`broadcast` network type), multiple routers can sit on the same switch VLAN, so OSPF elects a DR and BDR. All other routers become DROTHERs, form FULL adjacencies only with the DR and BDR, and stay cleanly parked at `2WAY/DROTHER` with one another.',
    ],
  },

  deepDive: {
    intro:
      'Follow the exact seven-step state progression every OSPFv2 interface walks through when forming a relationship with a peer, along with the mandatory compatibility checks and DR/BDR election rules.',
    steps: [
      {
        step: 'State 1',
        title: 'Down',
        explanation:
          'No recent Hello packets have been received from the neighbor within the Dead Interval (default 40 seconds on broadcast/point-to-point links, 4x the 10-second Hello Interval). The local router still sends periodic multicast Hello packets out OSPF-enabled interfaces toward AllSPFRouters (224.0.0.5).',
      },
      {
        step: 'State 2',
        title: 'Init',
        explanation:
          'Router A receives a Hello packet from Router B, so A knows B exists—but Router A does NOT yet see its own Router ID listed inside the "Active Neighbor" field of B’s Hello packet. Communication is currently one-way (either B hasn’t processed A’s Hello yet, or an ACL/cable/VLAN filter is blocking return traffic).',
      },
      {
        step: 'State 3',
        title: '2-Way (Bidirectional Communication Achieved)',
        explanation:
          'Router A receives a Hello from Router B that explicitly lists A’s own Router ID inside the neighbor list. Bidirectional reachability is confirmed! At this exact moment on broadcast/NBMA segments, routers wait up to the Wait Timer (40s) and run the DR/BDR election. If both routers end up as DROTHERs, they intentionally STOP advancing here and remain permanently in 2WAY/DROTHER—which is healthy and expected.',
      },
      {
        step: 'State 4',
        title: 'ExStart (Database Sync Preparation)',
        explanation:
          'Adjacent routers (point-to-point peers, or peers connecting to a DR/BDR) negotiate who initiates database exchange (primary/subordinate based on highest Router ID) using empty Database Description (DBD) packets. Critically, each DBD packet carries the interface MTU. If the two sides disagree on IP MTU (for example 1500 vs 1400 bytes across a tunnel), routers freeze permanently in EXSTART or EXCHANGE.',
      },
      {
        step: 'State 5',
        title: 'Exchange',
        explanation:
          'Routers send Database Description (DBD) packets containing ONLY the summary headers (LSA types, IDs, sequence numbers) of their Link-State Databases—like comparing table-of-contents pages without mailing whole books yet.',
      },
      {
        step: 'State 6',
        title: 'Loading',
        explanation:
          'After comparing table-of-contents summaries, any missing or newer LSA is requested via Link-State Request (LSR) packets. The neighbor responds with full details inside Link-State Update (LSU) packets, acknowledged reliably via Link-State Acknowledgment (LSAck) packets.',
      },
      {
        step: 'State 7',
        title: 'Full (Adjacency Complete)',
        explanation:
          'Both routers hold identical copies of the area’s Link-State Database. The adjacency is established, each router independently executes Dijkstra’s SPF algorithm using cost metrics (reference bandwidth / interface bandwidth), and the best loop-free OSPF routes (AD 110) enter the IP routing table.',
      },
    ],
    diagram: {
      kind: 'svg-ospf-states',
      caption:
        'OSPFv2 Neighbor State Machine & Multi-Access DR/BDR Branching (DROTHER pairs stop cleanly at 2-Way; DR/BDR adjacencies advance to Full).',
      asciiFallback: `[Down] --> (Hello rx, own RID absent) --> [Init]
  --> (Hello rx, own RID present) --> [2-Way]
        |-- DROTHER <-> DROTHER on Broadcast LAN: STAY IN 2-WAY (Healthy)
        |-- Point-to-Point OR Peer <-> DR/BDR:
              --> [ExStart] (RID negotiates primary, MTU checked!)
              --> [Exchange] (DBD summary headers exchanged)
              --> [Loading]  (LSR / LSU / LSAck fill missing LSAs)
              --> [Full]     (LSDB synchronized -> Run SPF -> Install routes)`,
    },
    workedExample: {
      title: 'Worked Multi-Access Election & Adjacency Trace on VLAN 20 (10.10.20.0/28)',
      context:
        'Four routers plug into the same Ethernet switch on 10.10.20.0/28 (Broadcast network type). No router is configured with "ip ospf network point-to-point". Their interfaces and loopback settings are:\n• R1: G0/0 IP = 10.10.20.1/28, Loopback0 = 1.1.1.1, ospf priority = 1 (default)\n• R2: G0/0 IP = 10.10.20.2/28, Loopback0 = 2.2.2.2, ospf priority = 200\n• R3: G0/0 IP = 10.10.20.3/28, no loopback (highest physical IP 10.10.20.3), ospf priority = 1\n• R4: G0/0 IP = 10.10.20.4/28, router-id 4.4.4.4, ospf priority = 0',
      steps: [
        'Step 1 — Determine each router’s OSPFv2 Router ID (RID) in strict priority order: (a) manual "router-id", (b) highest active Loopback IP, (c) highest active physical interface IP. Result: R1 = 1.1.1.1, R2 = 2.2.2.2, R3 = 10.10.20.3 (higher numerically than 2.2.2.2!), R4 = 4.4.4.4.',
        'Step 2 — Compare OSPF Interface Priorities (0–255; highest wins; 0 means ineligible to become DR or BDR). R2 has Priority 200, so R2 wins DR immediately—even though R3 has a numerically higher RID (10.10.20.3).',
        'Step 3 — Elect the BDR from the remaining eligible routers (Priority > 0): R4 has Priority 0 so R4 is disqualified from ever becoming DR or BDR. Between R1 (Pri 1, RID 1.1.1.1) and R3 (Pri 1, RID 10.10.20.3), priorities tie at 1, so the highest Router ID wins BDR: R3 becomes BDR.',
        'Step 4 — Resulting steady-state table on R1 (a DROTHER): R2 (DR) = FULL/DR, R3 (BDR) = FULL/BDR, R4 (DROTHER) = 2WAY/DROTHER.',
        'Step 5 — Non-preemption reminder: If a new router R5 boots later with Priority 255, R5 will NOT steal DR from R2! DR/BDR elections in OSPF are non-preemptive until the current DR fails or OSPF processes reset.',
      ],
      outcome:
        'R2 = DR, R3 = BDR, R1 & R4 = DROTHER. Only 5 FULL adjacencies form on the switch instead of all 6 pairwise meshes, and R1 <-> R4 stay healthy at 2WAY/DROTHER.',
    },
  },

  iosCliGuide: {
    intro:
      'Use these verification commands on Cisco IOS/IOS XE routers to inspect neighbor states, interface timers, Router IDs, and DR/BDR roles directly.',
    commands: [
      {
        title: '1. Verify Neighbor States and Roles',
        promptAndCommand: 'R1# show ip ospf neighbor',
        output: `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2         200   FULL/DR         00:00:34    10.10.20.2      GigabitEthernet0/0
10.10.20.3        1   FULL/BDR        00:00:38    10.10.20.3      GigabitEthernet0/0
4.4.4.4           0   2WAY/DROTHER    00:00:31    10.10.20.4      GigabitEthernet0/0`,
        lineByLine: [
          {
            segment: 'Neighbor ID (2.2.2.2)',
            meaning: 'The peer router’s OSPF Router ID—NOT necessarily the interface IP address on this wire.',
          },
          {
            segment: 'Pri (200 / 1 / 0)',
            meaning: 'Interface OSPF priority advertised in that neighbor’s Hello packet. 0 means never elect as DR/BDR.',
          },
          {
            segment: 'State (FULL/DR, 2WAY/DROTHER)',
            meaning: 'Left of "/" = adjacency state with that neighbor. Right of "/" = THAT neighbor’s role on the segment. 2WAY/DROTHER between two DROTHERs is completely healthy.',
          },
          {
            segment: 'Dead Time (00:00:34)',
            meaning: 'Countdown timer remaining before R1 declares the peer Dead. Normally resets back to 40s every 10s when a fresh Hello arrives.',
          },
          {
            segment: 'Address (10.10.20.2)',
            meaning: 'Actual source IP address of the peer’s interface on this shared link (used as next-hop IP).',
          },
        ],
      },
      {
        title: '2. Inspect Local Interface Parameters, Timers, and Network Type',
        promptAndCommand: 'R1# show ip ospf interface GigabitEthernet0/0',
        output: `GigabitEthernet0/0 is up, line protocol is up
  Internet Address 10.10.20.1/28, Area 0, Attached via Network Statement
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DROTHER, Priority 1
  Designated Router (ID) 2.2.2.2, Interface address 10.10.20.2
  Backup Designated router (ID) 10.10.20.3, Interface address 10.10.20.3
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5`,
        lineByLine: [
          {
            segment: 'Internet Address 10.10.20.1/28, Area 0',
            meaning: 'Both prefix mask (/28) AND Area ID (0) must match the neighbor on broadcast/point-to-point Ethernet links.',
          },
          {
            segment: 'Network Type BROADCAST, Cost: 1',
            meaning: 'Default for Ethernet interfaces. Triggers DR/BDR election. Cost 1 comes from 100 Mbps reference / 1000 Mbps link (capped at 1 unless auto-cost reference-bandwidth increases).',
          },
          {
            segment: 'State DROTHER, Priority 1',
            meaning: 'Indicates THIS local router’s own role (R1 is a DROTHER) and local priority (1).',
          },
          {
            segment: 'Hello 10, Dead 40',
            meaning: 'Timers must match identically on both neighbors or the adjacency will never form.',
          },
        ],
      },
    ],
    healthyVsBroken: {
      checkCommand: 'show ip ospf neighbor',
      healthyLabel: 'Healthy Multi-Access Peering (R1 <-> R2 DR)',
      healthyOutput: `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2         200   FULL/DR         00:00:36    10.10.20.2      GigabitEthernet0/0`,
      brokenLabel: 'Broken MTU Mismatch (Stuck Alternating Down / EXSTART)',
      brokenOutput: `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2         200   EXSTART/DR      00:00:33    10.10.20.2      GigabitEthernet0/0`,
      diagnosis:
        'When a neighbor stalls in EXSTART (instead of finishing Exchange/Loading), Hello checks already passed (Area, Mask, Timers, RID all matched!). Almost always, one interface has a mismatched IP MTU (e.g., 1400 vs 1500) or duplicate Router ID. Verify with "show interface G0/0 | include MTU" on both sides (or "ip ospf mtu-ignore" as an emergency diagnostic check before fixing underlying MTU).',
    },
  },

  commonTraps: [
    {
      trap: 'Assuming "2WAY/DROTHER" in `show ip ospf neighbor` is a failure.',
      reality:
        'Two DROTHER routers on the same Ethernet switch ALWAYS remain at 2WAY/DROTHER with each other. Check whether BOTH routers show FULL to the DR and BDR—if yes, routing is completely healthy.',
    },
    {
      trap: 'Expecting a new router with `ip ospf priority 255` to take over as DR immediately.',
      reality:
        'OSPF DR/BDR election is strictly NON-PREEMPTIVE. A higher priority only wins during an initial cold election or after the current DR (and BDR) fail or `clear ip ospf process` is run.',
    },
    {
      trap: 'Forgetting the subnet mask match rule on broadcast links vs. assuming `network 10.10.20.0 0.0.0.255` enforces the mask.',
      reality:
        'The `network` statement wildcard only selects WHICH interfaces run OSPF. The actual IP subnet mask configured under `interface G0/0` (`ip address ...`) is sent inside Hello packets and must match the peer on Ethernet segments.',
    },
    {
      trap: 'Thinking Router ID changes take effect the instant you add a Loopback or type `router-id`.',
      reality:
        'OSPF picks its Router ID once when the process starts. Changing it later requires `clear ip ospf process` (or reload) before the new Router ID takes effect.',
    },
    {
      trap: 'Confusing `ExStart` hangs with Hello-timer mismatches.',
      reality:
        'If two routers had mismatched Area IDs, Subnet Masks, Authentication, or Hello/Dead timers, they would NEVER even enter Init or 2-Way. Reaching ExStart proves all Hello rules passed—suspect an IP MTU mismatch first.',
    },
  ],

  keyTerms: [
    {
      term: 'Router ID (RID)',
      shortDef: '32-bit unique identifier for an OSPF router.',
      fullDef:
        'A 32-bit value written in dotted-decimal form that uniquely identifies a router inside an OSPF autonomous system. Selected in order: 1) manual `router-id` command, 2) highest IP of any up/up Loopback interface, 3) highest IP of any up/up non-loopback interface.',
    },
    {
      term: 'Hello Packet',
      shortDef: 'Periodic multicast packet (224.0.0.5) used to discover and maintain neighbors.',
      fullDef:
        'OSPF Type 1 packet sent every Hello Interval (10s default on Ethernet/point-to-point) containing Router ID, Area ID, subnet mask, Hello/Dead timers, priority, DR/BDR IPs, and list of seen neighbors.',
    },
    {
      term: 'Designated Router (DR)',
      shortDef: 'Elected hub router on a multi-access segment that manages LSA flooding.',
      fullDef:
        'On broadcast and NBMA multi-access networks, all routers form FULL adjacencies with the DR (listening on 224.0.0.6) so updates flood cleanly via one central router rather than an O(n^2) full mesh.',
    },
    {
      term: 'Backup Designated Router (BDR)',
      shortDef: 'Warm standby router ready to promote to DR if the DR fails.',
      fullDef:
        'Maintains FULL adjacencies with every router on the segment alongside the DR and immediately promotes to DR without waiting for a new election if the primary DR goes down.',
    },
    {
      term: '2-Way State',
      shortDef: 'Bidirectional Hello communication confirmed (normal steady state between DROTHERs).',
      fullDef:
        'Reached when a router receives a Hello packet from a peer that includes its own Router ID in the neighbor list. Point-to-point links pass straight through 2-Way to ExStart; DROTHER pairs remain in 2-Way.',
    },
    {
      term: 'ExStart State',
      shortDef: 'Initial DBD handshake state where primary/subordinate and MTU are checked.',
      fullDef:
        'The first step of database synchronization. Routers negotiate who starts sequence numbering (highest Router ID) and validate matching interface IP MTU inside DBD packets.',
    },
    {
      term: 'Link-State Advertisement (LSA)',
      shortDef: 'Structured topology update describing a router’s links, prefixes, and costs.',
      fullDef:
        'Individual records stored in the OSPF Link-State Database (LSDB). All routers in the same area must hold an identical LSDB so Dijkstra SPF computes loop-free paths consistently.',
    },
    {
      term: 'Non-Preemptive Election',
      shortDef: 'Rule preventing a newly joined higher-priority router from replacing an active DR.',
      fullDef:
        'Once a DR and BDR are elected on a segment, a new router with a higher OSPF priority stays DROTHER until the current DR and BDR go down or OSPF processes are reset.',
    },
  ],

  checkQuestions: [
    {
      id: 'ospf-q1',
      prompt:
        'You run `show ip ospf neighbor` on R1 (a DROTHER on VLAN 10) and see `4.4.4.4  0  2WAY/DROTHER  00:00:34  10.10.20.4  Gi0/0`, while R1 shows `FULL/DR` to R2 and `FULL/BDR` to R3. What is the status of OSPF on VLAN 10?',
      options: [
        'OSPF is operating normally; two DROTHER routers intentionally remain in 2WAY/DROTHER on a broadcast Ethernet segment.',
        'R1 and R4 have mismatched Hello/Dead timers preventing them from advancing past 2WAY.',
        'R4 has an MTU mismatch with R1 and needs `ip ospf mtu-ignore` configured immediately.',
        'R1 and R4 share a duplicate Router ID and are blocking SPF calculation.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: On multi-access Ethernet (`BROADCAST`) segments, routers only form FULL adjacencies with the DR and BDR. DROTHER-to-DROTHER pairs stop deliberately at `2WAY/DROTHER`.',
        'Incorrect: Mismatched Hello or Dead timers reject Hellos before any neighbor entry is created—you would see zero entry for 4.4.4.4.',
        'Incorrect: An MTU mismatch happens later during Database Description exchange and leaves neighbors stalled in `EXSTART` or `EXCHANGE`, never `2WAY`.',
        'Incorrect: Duplicate Router IDs prevent clean adjacency and trigger console warnings or ExStart resets; Priority 0 on 4.4.4.4 simply confirms R4 is a configured DROTHER.',
      ],
      takeaway: '2WAY/DROTHER between two non-DR/BDR peers on Ethernet is normal and prevents wasted flooding.',
    },
    {
      id: 'ospf-q2',
      prompt:
        'Three routers connect to a single Layer 2 switch in Area 0 using default broadcast mode. No manual `router-id` is configured:\n• Router A: Pri 1, Loopback0 = 10.1.1.1, G0/0 = 192.168.1.1/24\n• Router B: Pri 50, Loopback0 = none, G0/0 = 192.168.1.2/24\n• Router C: Pri 1, Loopback0 = none, G0/0 = 192.168.1.254/24\nWhich router becomes DR and which becomes BDR?',
      options: [
        'Router B becomes DR; Router C becomes BDR.',
        'Router C becomes DR; Router B becomes BDR.',
        'Router B becomes DR; Router A becomes BDR.',
        'Router A becomes DR; Router C becomes BDR.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Highest OSPF priority always wins first—Router B has Priority 50, winning DR immediately. Remaining eligible routers (A and C) tie at Priority 1, so highest RID wins BDR: Router C’s RID (192.168.1.254) beats Router A’s Loopback RID (10.1.1.1).',
        'Incorrect: Priority always overrides Router ID. Router C (Pri 1) cannot beat Router B (Pri 50).',
        'Incorrect: Router A uses Loopback0 (10.1.1.1) as its RID (Loopbacks outrank physical interfaces on the same router), which is numerically lower than Router C’s RID (192.168.1.254).',
        'Incorrect: Router A has both lower priority than B and lower RID than C.',
      ],
      takeaway: 'DR election compares Priority first (highest > 0 wins), then highest Router ID (where Loopbacks determine RID before physical IPs).',
    },
    {
      id: 'ospf-q3',
      prompt:
        'On `show ip ospf neighbor`, a newly deployed branch router stays stuck alternating between `EXSTART` and `DOWN` with its hub peer over an encrypted GRE/IPsec tunnel. What is the most likely root cause?',
      options: [
        'Interface IP MTU mismatch between the local tunnel interface and the remote hub.',
        'The two interfaces were accidentally assigned different OSPF Area IDs.',
        'One side has `passive-interface` enabled on the tunnel.',
        'Both interfaces have OSPF priority set to 0.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Reaching `EXSTART` confirms bidirectional Hellos already succeeded. DBD packets carry interface MTU, and GRE/IPsec overhead often shrinks tunnel MTU (e.g., 1400 vs 1500), stalling `EXSTART`.',
        'Incorrect: Different Area IDs fail the Hello check immediately—the peer would never appear in `EXSTART`.',
        'Incorrect: `passive-interface` suppresses sending OSPF Hellos completely, so the neighbor would never leave `DOWN`.',
        'Incorrect: Setting priority to 0 on both ends of a broadcast segment leaves them stuck in `2WAY/DROTHER` (no DR elected), not `EXSTART`.',
      ],
      takeaway: 'Stuck in EXSTART = Hello checks passed, suspect MTU mismatch (common on tunnels) or duplicate Router ID.',
    },
    {
      id: 'ospf-q4',
      prompt:
        'Which five items MUST match inside OSPFv2 Hello packets (or interface settings) before two Ethernet-connected routers will pass compatibility checks and advance past Down?',
      options: [
        'Area ID, Subnet Mask, Hello/Dead Timers, Authentication settings, and Stub area flag (plus unique Router IDs).',
        'Process ID, Hostname, OSPF Priority, Reference Bandwidth, and Loopback IP.',
        'Process ID, Area ID, Cost Metric, Interface Bandwidth, and Router ID.',
        'Interface Cost, OSPF Priority, MTU, MAC Address, and Process ID.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Area ID, subnet mask (on multi-access links), Hello/Dead intervals, authentication type/key, and stub flags are checked on every Hello, and Router IDs must be unique.',
        'Incorrect: OSPF Process ID (`router ospf 1` vs `router ospf 99`) is strictly locally significant and does NOT have to match between neighbors; Priority does not prevent adjacency (unless both are 0 on broadcast).',
        'Incorrect: Process ID and Cost Metric do NOT need to match between neighbors to form an adjacency.',
        'Incorrect: Cost and Priority do not block Hello acceptance (except both Priority=0 on multi-access preventing a DR election).',
      ],
      takeaway: 'Process ID is local only! Area ID, Subnet Mask, Hello/Dead Timers, Auth, and Stub Flag must match.',
    },
    {
      id: 'ospf-q5',
      prompt:
        'A teammate proposes speeding up convergence on a two-router Ethernet link (currently spending 40 seconds waiting on DR/BDR election during bootup) by adding `ip ospf network point-to-point` on ONLY R1 while leaving R2 at default `BROADCAST`. How should you evaluate that change?',
      options: [
        'Partly right concept, broken config: `point-to-point` removes the 40s DR wait on a 2-router Ethernet link, yet BOTH R1 and R2 must be configured identically or network-type mismatches break SPF/LSAs.',
        'Completely correct: R2 automatically converts its network type when R1 sends point-to-point Hellos.',
        'Completely wrong: Ethernet interfaces never support `ip ospf network point-to-point`.',
        'Wrong because OSPF requires a DR on every link type, including serial links.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Two-router Ethernet links DO benefit from `ip ospf network point-to-point` (no DR/BDR, faster convergence), ONLY when configured consistently on BOTH ends.',
        'Incorrect: OSPF does not auto-negotiate interface network types; mixing Broadcast and Point-to-Point breaks LSA interpretation even if Hellos share 10/40 timers.',
        'Incorrect: Cisco IOS explicitly supports `ip ospf network point-to-point` on GigabitEthernet point-to-point trunks.',
        'Incorrect: Point-to-point links never elect a DR or BDR.',
      ],
      takeaway: 'Configure `ip ospf network point-to-point` on BOTH ends of a 2-router Ethernet link—never on one side alone.',
    },
  ],

  handsOnActivity: {
    kind: 'cli-lab',
    title: 'Launch IOS Lab 04: Diagnose & Fix Single-Area OSPFv2 Adjacency',
    targetTab: 'labs',
    instructions: [
      'Open the IOS Labs tab and select Lab 04 (Single-Area OSPF Adjacency & Passive Interface).',
      'Run `show ip ospf neighbor` and `show ip ospf interface` on both routers to verify Area ID, Hello/Dead timers, and passive interfaces.',
      'Check which interface was accidentally silenced or missing from the OSPF network statement, fix it, and verify `FULL` state and installed `O` routes in `show ip route`.',
    ],
    verificationCheck: 'Both routers reach FULL state and `show ip route` installs the remote LAN prefix with `[110/...]` AD.',
  },

  summaryBullets: [
    'OSPFv2 neighbors pass through Down -> Init -> 2-Way before eligible peers synchronize databases via ExStart -> Exchange -> Loading -> Full.',
    'Area ID, subnet mask (multi-access), Hello/Dead timers, authentication, and stub flags must match (and Router IDs must be unique), whereas Process ID is strictly local.',
    'On broadcast Ethernet segments, routers elect a non-preemptive DR and BDR (highest Priority > 0, tie-broken by highest Router ID); DROTHER pairs intentionally stop at 2WAY/DROTHER.',
    'If a peer stalls in EXSTART/EXCHANGE, Hello checks passed—verify interface IP MTU and duplicate Router IDs first.',
    'Always apply matching interface network types (`broadcast` vs `point-to-point`) on BOTH ends of a link.',
  ],

  sourcesToVerify: [
    'Cisco IOS IP Routing: OSPF Configuration Guide — Configuring OSPF',
    'RFC 2328 — OSPF Version 2 (Section 10: The Neighbor Data Structure & Neighbor State Machine)',
    'Cisco Support TechNote — OSPF Neighbor Problems Explained (Stuck in Init, 2-Way, ExStart)',
  ],
};
