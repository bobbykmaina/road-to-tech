import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT2_A_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.core.sw.switching-fundamentals': {
    id: 'ccna.core.sw.switching-fundamentals',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Switching and Network Access',
    topicTitle: 'How Ethernet Switches Work (Prerequisite)',
    code: '2.0.1',
    title: 'MAC Learning, Aging, Flooding, Forwarding & Collision vs Broadcast Domains',
    readMinutes: 11,
    prerequisites: ['0.2.1', '1.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['1.13'],
    v20ExamTopics: ['Domain 2 Prereq'],

    learningObjectives: [
      'Explain the three core actions of every Layer 2 Ethernet switch: Learn (Source MAC), Forward/Flood (Destination MAC), and Age.',
      'Predict exactly when a switch forwards a frame out ONE port versus flooding it out ALL other ports in the same VLAN.',
      'Distinguish **Collision Domains** (every switch port separates them) from **Broadcast Domains** (routers/VLANs separate them).',
      'Read `show mac address-table` to trace which port an endpoint sits on.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Adding More Switches Never Shrinks Broadcast Storms',
      narrative:
        'A company plugs 300 laptops, printers, and cameras into six switches daisy-chained together—all left in default VLAN 1. Users complain of slow logins and noisy ARP traffic everywhere. A beginner assumes adding switches isolated each floor, yet every Ethernet **broadcast** still floods every single port across all six switches! Only VLANs (and Layer 3 routers) split **Broadcast Domains**, whereas each switch port splits only **Collision Domains**. Mastering MAC learning and domain boundaries is mandatory before VLANs or Spanning Tree.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Smart Hotel Concierge Building a Room Directory on the Fly',
      analogy:
        'Imagine a brand-new switch turning on with a completely blank **MAC Address Table**. When Laptop A on Port `Gi0/1` sends a frame addressed to Server B, the concierge first writes down **"Laptop A (`AA:AA`) lives at Door `Gi0/1`"** (Learning the **Source MAC**). Next, the concierge checks the directory for **Destination MAC `BB:BB`**: if Server B isn’t listed yet—or if the frame is a **Broadcast (`FF:FF:FF:FF:FF:FF`)**—the concierge copies the message to **every other open door in the same VLAN except `Gi0/1`** (Unknown Unicast **Flooding**). Once Server B replies from `Gi0/24`, the concierge learns `BB:BB -> Gi0/24` and forwards all future traffic directly **Port-to-Port** without bothering anyone else!',
      technicalDefinition:
        'An Ethernet switch operates at OSI Layer 2 by learning incoming **Source MAC** addresses + VLANs into a hardware CAM (Content Addressable Memory) table (default 300-second aging timer), **forwarding** known unicasts out a single egress port, and **flooding** broadcasts, multicasts, and unknown unicasts out all other forwarding ports in the same VLAN.',
      paragraphs: [
        'Remember the golden asymmetry of switching: **Switches LEARN from the SOURCE MAC address, and FORWARD using the DESTINATION MAC address.** Never backwards! And a switch NEVER floods a frame back out the exact same ingress port it arrived on (preventing echo loops).',
        'Separating **Collision Domains** from **Broadcast Domains** is a classic CCNA exam staple: Every port on a modern full-duplex switch is its OWN tiny **collision domain** (1 port = 1 collision domain; hubs combine ports into 1 shared collision domain). However, an unsegmented switch puts ALL ports inside ONE shared **broadcast domain**. Only a **router interface** or creating separate **VLANs** splits a broadcast domain.',
        'Whenever a MAC entry sees zero incoming frames for **300 seconds (5 minutes)** by default, it ages out cleanly so moved laptops don’t leave stale entries forever.',
      ],
    },

    deepDive: {
      intro: 'Trace MAC table population and compare domain counts across hubs, switches, VLANs, and routers.',
      steps: [
        {
          step: 'Action 1: Learn',
          title: 'Inspect Source MAC + Ingress Port + VLAN',
          explanation: 'Every frame entering `Gi0/1` adds or refreshes `Source MAC -> Gi0/1` (resetting the 300s aging timer) in the MAC table.',
        },
        {
          step: 'Action 2: Forward vs Flood',
          title: 'Inspect Destination MAC',
          explanation:
            'If Destination MAC = `FFFF.FFFF.FFFF` (broadcast) OR unknown unicast (not in CAM table) -> **Flood** out all other ports in that VLAN. If known -> **Forward** strictly out that one mapped port.',
        },
        {
          step: 'Action 3: Filter',
          title: 'Same-Port Filtering',
          explanation: 'If Destination MAC lives on the SAME port the frame arrived from (e.g., via an old downstream hub/repeater), the switch quietly drops (filters) it.',
        },
        {
          step: 'Domains',
          title: 'Count Collision vs. Broadcast Domains',
          explanation:
            'Each active switch port = 1 Collision Domain. Each VLAN (or router interface boundary) = 1 Broadcast Domain.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Switch Decision Flow & Collision vs. Broadcast Domain Boundaries',
        asciiFallback: `Frame arrives on Gi0/1 (Src=AA:AA, Dst=BB:BB, VLAN 10)
  1. LEARN:   CAM[VLAN 10, AA:AA] = Gi0/1 (reset 300s timer)
  2. LOOKUP:  Is BB:BB in CAM[VLAN 10]?
     |-- YES (say Gi0/24) ---> FORWARD solely out Gi0/24!
     |-- NO (or FFFF.FFFF.FFFF) ---> FLOOD out all OTHER VLAN 10 ports (never Gi0/1!)

DOMAIN BOUNDARIES:
  [PC1]--[Hub]--[PC2]----(Gi0/1)[Switch 24-port](Gi0/24)----[Router G0/0]----(WAN)
   ^--- 1 Shared Collision Domain on Hub port!                ^ Router splits BROADCAST Domain!`,
      },
      workedExample: {
        title: 'Counting Collision & Broadcast Domains in a Topology',
        context:
          'A router connects via `G0/0` to Switch1 (`Gi0/1`). Switch1 connects to PC1 (`Gi0/2`), PC2 (`Gi0/3`), and a 4-port Hub (`Gi0/4`) holding 3 PCs. All switch ports are in VLAN 1.',
        steps: [
          'Broadcast Domains: 1 on the LAN side of Router `G0/0` (all ports in VLAN 1 share broadcasts) + 1 per other router port.',
          'Collision Domains on Switch1: `Gi0/1` (to Router) = 1; `Gi0/2` (PC1) = 1; `Gi0/3` (PC2) = 1; `Gi0/4` (to Hub + 3 PCs) = 1 combined! Total = **4 collision domains**.',
        ],
        outcome: 'Each switch link creates an isolated collision domain, while VLANs/routers isolate broadcast domains.',
      },
    },

    iosCliGuide: {
      intro: 'Inspect live dynamic MAC learning, port mappings, and aging timers on Cisco Catalyst switches.',
      commands: [
        {
          title: 'Inspect MAC Address Table & Aging Timer',
          promptAndCommand: 'SW1# show mac address-table',
          output: `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    001a.2b3c.0001    DYNAMIC     Gi0/1
  10    001a.2b3c.0002    DYNAMIC     Gi0/2
  20    aabb.cc00.1000    DYNAMIC     Gi0/24`,
          lineByLine: [
            { segment: 'DYNAMIC', meaning: 'Learned automatically from incoming Source MAC headers; ages out after 300s of inactivity.' },
            { segment: 'Gi0/24', meaning: 'Single trunk uplink can hold dozens of remote MAC addresses learned from upstream switches.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show mac address-table count',
        healthyLabel: 'Stable Dynamic Entries on Normal Ports',
        healthyOutput: `Mac Entries for Vlan 10: Dynamic Address Count: 42`,
        brokenLabel: 'MAC Flapping Log (`MACFLAP_NOTIF`)',
        brokenOutput: `%SW_MATM-4-MACFLAP_NOTIF: Host 001a.2b3c.0001 in vlan 10 is flapping between port Gi0/1 and port Gi0/2`,
        diagnosis:
          'When the exact same Source MAC keeps arriving on two switch ports rapidly (`MACFLAP`), either a Layer 2 switching loop exists (STP down/disabled!) or two devices share a cloned MAC.',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking switches learn from Destination MACs.',
        reality: 'Switches ALWAYS learn from **Source MAC** and forward using **Destination MAC**.',
      },
      {
        trap: 'Believing a switch stops broadcast traffic (`FF:FF:FF:FF:FF:FF`) by default.',
        reality: 'Switches **flood** broadcasts out every other port in that VLAN; only routers or separate VLANs stop broadcasts.',
      },
      {
        trap: 'Assuming a single trunk port (`Gi0/24`) can hold only ONE MAC address.',
        reality: 'An uplink/trunk port naturally learns hundreds of MAC addresses belonging to devices on downstream switches.',
      },
      {
        trap: 'Forgetting what happens to unknown unicasts.',
        reality: 'If the Destination MAC isn’t in the CAM table yet, the switch floods it just like a broadcast within that VLAN.',
      },
    ],

    keyTerms: [
      {
        term: 'MAC Address Table (CAM Table)',
        shortDef: 'Switch lookup table mapping VLAN + MAC address to egress switch port.',
        fullDef: 'Populated dynamically from incoming Source MACs with a 300-second default aging timer.',
      },
      {
        term: 'Unknown Unicast Flooding',
        shortDef: 'Sending a frame out all other ports in the VLAN when the destination MAC is not in the CAM table.',
        fullDef: 'Stops as soon as the destination host replies and its Source MAC is learned.',
      },
      {
        term: 'Collision Domain',
        shortDef: 'Network segment where simultaneous frames could collide if half-duplex.',
        fullDef: 'Every switch port isolates its own collision domain; hubs merge all ports into one shared domain.',
      },
      {
        term: 'Broadcast Domain',
        shortDef: 'Set of all ports that receive a Layer 2 broadcast frame (`FFFF.FFFF.FFFF`).',
        fullDef: 'Bounded by VLANs and Layer 3 router interfaces.',
      },
    ],

    checkQuestions: [
      {
        id: 'c20-q1',
        prompt: 'Switch SW1’s MAC table is empty. PC1 (`MAC AA:AA`) on `Gi0/1` sends a frame to PC2 (`MAC BB:BB`) on `Gi0/5` (all ports VLAN 1). What two actions does SW1 take immediately?',
        options: [
          'Adds `AA:AA -> Gi0/1` to the MAC table and floods the frame out every VLAN 1 port except `Gi0/1`.',
          'Adds `BB:BB -> Gi0/5` and forwards solely to `Gi0/5`.',
          'Drops the frame until ARP completes.',
          'Floods the frame back out `Gi0/1` as well as `Gi0/2–Gi0/24`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SW1 learns Source MAC `AA:AA` on `Gi0/1` and floods the unknown Destination MAC `BB:BB` out all other VLAN 1 ports.',
          'Incorrect: SW1 cannot know `BB:BB` is on `Gi0/5` until PC2 transmits a frame.',
          'Incorrect: Switches never wait on ARP; they flood unknown unicasts immediately.',
          'Incorrect: Switches never flood a frame back out the ingress port (`Gi0/1`).',
        ],
        takeaway: 'Learn Source MAC -> Flood Unknown Unicast out all OTHER ports in that VLAN.',
      },
      {
        id: 'c20-q2',
        prompt: 'Which device breaks up **Broadcast Domains** cleanly?',
        options: ['A Layer 3 Router (or separate VLANs)', 'An Ethernet Hub', 'A Media Converter', 'A straight-through Cat6 cable'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Routers never forward Layer 2 broadcasts between interfaces, and VLANs create isolated broadcast domains.',
          'Incorrect: Hubs repeat everything out all ports.',
          'Incorrect: Media converters translate copper <-> fiber at Layer 1.',
          'Incorrect: Cables are passive Layer 1.',
        ],
        takeaway: 'Switches break Collision Domains per port; Routers/VLANs break Broadcast Domains.',
      },
      {
        id: 'c20-q3',
        prompt: 'What triggers `%SW_MATM-4-MACFLAP_NOTIF` syslog warnings on a Cisco switch?',
        options: [
          'The same Source MAC address arriving rapidly on two different switch ports (often a Layer 2 loop)',
          'Normal 300-second MAC table aging',
          'A user unplugging a desktop PC',
          'Enabling SSH on VTY lines',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Rapidly moving a MAC between two ports signals a Layer 2 loop or duplicate MAC address.',
          'Incorrect: Aging removes silent entries quietly without flap alerts.',
          'Incorrect: Unplugging simply stops traffic.',
          'Incorrect: SSH affects management plane only.',
        ],
        takeaway: 'MAC flapping = suspect a Layer 2 switching loop immediately.',
      },
      {
        id: 'c20-q4',
        prompt: 'How many Collision Domains exist on an 8-port Layer 2 switch if 6 ports connect directly to individual PCs and 1 port connects to a 4-port hub holding 3 servers?',
        options: ['7 collision domains', '10 collision domains', '1 collision domain', '2 collision domains'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Each of the 6 PC switch ports is 1 collision domain (6), and the single switch port wired to the hub shares 1 collision domain across all 3 servers (1) -> `6 + 1 = 7`.',
          'Incorrect: Hubs do not isolate collision domains per hub port.',
          'Incorrect: Only a standalone hub has 1 total.',
          'Incorrect: Switches separate every switch port.',
        ],
        takeaway: 'Count active switch ports (each hub behind 1 switch port counts as 1 shared domain).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect Live CAM Tables in IOS Lab 02',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 02 and run `show mac address-table` to verify dynamic learning across access and trunk ports.',
      ],
      verificationCheck: 'Identify local access MACs vs. trunk-learned MACs.',
    },

    summaryBullets: [
      'Switches learn **Source MAC + ingress port + VLAN** into the CAM table (300s default aging).',
      'Known Destination MACs forward strictly out one port; broadcasts, multicasts, and unknown unicasts flood out all other ports in that VLAN.',
      'Switches never send a flooded frame back out the port it arrived on.',
      'Each switch port = 1 **Collision Domain**; each VLAN / router subnet = 1 **Broadcast Domain**.',
      'MAC flapping alerts signal a Layer 2 switching loop or cloned MAC address.',
    ],

    sourcesToVerify: [
      'Cisco Press — CCNA 200-301 Official Cert Guide, Volume 1 (Ethernet LAN Switching)',
    ],
  },

  'ccna.core.sw.access-edge-ports': {
    id: 'ccna.core.sw.access-edge-ports',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Switching and Network Access',
    topicTitle: '2.1 / 2.2 Configure L2 Port Attributes for Edge Hosts',
    code: '2.2.1',
    title: 'Access VLANs, Voice VLANs, PoE Budgets & Edge Ports for APs, VoIP & IoT',
    readMinutes: 13,
    prerequisites: ['2.0.1'],
    versionScope: 'shared',
    v11ExamTopics: ['2.1'],
    v20ExamTopics: ['2.2'],

    learningObjectives: [
      'Create normal-range VLANs (`2–1001`) and assign switch ports statically with `switchport mode access` and `switchport access vlan <id>`.',
      'Configure dual-VLAN desk ports for IP phones + daisy-chained PCs using `switchport voice vlan <id>`.',
      'Verify Power over Ethernet (`show power inline`) budgets and troubleshoot PoE denial when connecting APs, VoIP phones, and IoT sensors.',
      'Choose access ports vs. trunk ports accurately for APs (lightweight vs. local bridge) and multi-VLAN IoT gateways.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Plugging a VoIP Phone + PC Into One Wall Jack Needs Two VLANs on One Access Port',
      narrative:
        'At a modern cubicle, there is often only ONE Ethernet wall jack—so the Cisco IP Phone plugs into the wall, and the user’s Windows PC plugs into the back of the phone! If you put both devices in the same data VLAN, file downloads starve voice quality and expose phone SIP traffic. Putting `switchport access vlan 10` + `switchport voice vlan 20` lets the switch deliver PoE power, tag voice packets in VLAN 20 cleanly via CDP/LLDP, and keep PC traffic untagged in VLAN 10.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Partitioned Floors Inside One Office Building',
      analogy:
        '**VLANs (Virtual LANs)** take one physical 48-port switch and logically slice it into separate mini-switches (Engineering VLAN 10, Voice VLAN 20, Guest Wi-Fi VLAN 30, IoT Cameras VLAN 40). Even though all cables plug into the exact same chassis, traffic in VLAN 10 NEVER broadcasts into VLAN 20—it must pass through a router or L3 switch just as if they sat in different buildings! And on a VoIP desk port, the switch acts like a smart concierge who hands the phone a VIP color-coded pass (**Voice VLAN 20** + PoE electrical power) while giving the PC sitting behind the phone a standard untagged badge (**Data VLAN 10**).',
      technicalDefinition:
        'An access port (`switchport mode access`) belongs to a single untagged Data VLAN (`switchport access vlan <id>`) and optionally one tagged Voice VLAN (`switchport voice vlan <id>`) negotiated via CDP/LLDP-MED, while Power over Ethernet (802.3af/at/bt) supplies DC wattage up to the switch chassis PoE power budget.',
      paragraphs: [
        'Always create VLANs cleanly (`vlan 10` -> `name STAFF`) and explicitly set `switchport mode access` (disabling Dynamic Trunking Protocol `DTP` negotiation!) alongside `switchport access vlan 10`. Remember: **VLAN 1** is the default factory VLAN, and **VLANs 1002–1005** are reserved legacy defaults.',
        'Note what happens when you assign an access port to a VLAN that doesn’t exist yet on Cisco IOS (`% Access VLAN does not exist. Creating vlan 20`): IOS usually auto-creates it with a default name (`VLAN0020`), though best practice is defining named VLANs first (`vlan 20 / name VOICE`). Watch out when **deleting** a VLAN (`no vlan 20`): any ports still assigned to VLAN 20 go dead (orphaned!) until reassigned!',
        'On edge ports feeding **Access Points**, **VoIP phones**, or **IoT cameras**, monitor `show power inline`: 802.3af PoE delivers up to **15.4W**, 802.3at PoE+ delivers up to **30W**, and 802.3bt UPOE delivers **60–90W**. Once total connected draw hits the switch PSU limit, the next AP plugged in fails to power on (`power-deny`)!',
      ],
    },

    deepDive: {
      intro: 'Step through normal access VLAN config, Voice VLAN + PC port sharing, and PoE budget verification.',
      steps: [
        {
          step: 'Step 1',
          title: 'Define Named VLANs (2–1001 Normal Range)',
          explanation: '`vlan 10 / name DATA`, `vlan 20 / name VOICE`, `vlan 40 / name IOT`. Stored in `vlan.dat` on flash (for VTP server/client) or `running-config` (transparent).',
        },
        {
          step: 'Step 2',
          title: 'Configure Desk Access + Voice VLAN Port',
          explanation:
            '`interface range Gi1/0/1 - 24` -> `switchport mode access` -> `switchport access vlan 10` -> `switchport voice vlan 20` -> `spanning-tree portfast`.',
        },
        {
          step: 'Step 3',
          title: 'AP & IoT Edge Considerations (v2.0 2.2)',
          explanation:
            'Lightweight CAPWAP APs tunneling all traffic back to a WLC typically use an **access port** (plus PoE+); FlexConnect/bridge APs mapping SSIDs straight to local VLANs use a **trunk port**!',
        },
        {
          step: 'Step 4',
          title: 'Verify PoE Power Budget',
          explanation:
            'Run `show power inline` to check Remaining Watts. If an AP or PTZ camera needs 25W (`PoE+`), an old 15.4W PoE switch cannot boot its radios reliably.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Dual-VLAN Desk Port (PC Untagged VLAN 10 + Phone 802.1Q Tagged VLAN 20 + PoE)',
        asciiFallback: `[PC] ---(Untagged VLAN 10)---> [Cisco IP Phone] ---(VLAN 10 untagged + VLAN 20 tagged + PoE)--> [SW1 Gi1/0/5]
                                    ^ Phone learns Voice VLAN 20 via CDP / LLDP-MED!`,
      },
      workedExample: {
        title: 'Fixing Orphaned Ports & PoE Starvation on an Edge Switch',
        context:
          'Ten desk jacks (`Gi1/0/1–10`) stop passing traffic after a cleanup, and a new Wi-Fi 6 AP on `Gi1/0/11` will not power up.',
        steps: [
          'Run `show interfaces Gi1/0/1 status`: VLAN column shows `10` yet `show vlan brief` shows VLAN 10 is MISSING (someone ran `no vlan 10`!). Re-create `vlan 10` -> `name STAFF` and all 10 ports instantly restore.',
          'Run `show power inline`: Remaining Watts = `3.2 W` on a 185W switch powering 10 legacy 15.4W cameras + phones! Move heavy PoE+ APs to a 370W/740W PoE+ switch or add a redundant PSU.',
        ],
        outcome: 'Restoring the deleted VLAN recovers orphaned ports; balancing PoE wattage boots the AP.',
      },
    },

    iosCliGuide: {
      intro: 'Configure and audit access VLANs, voice VLANs, and PoE allocations cleanly.',
      commands: [
        {
          title: 'Configure Access + Voice VLAN Port & Verify',
          promptAndCommand: 'SW1# show vlan brief',
          output: `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi1/0/23, Gi1/0/24
10   STAFF                            active    Gi1/0/1, Gi1/0/2
20   VOICE                            active    Gi1/0/1, Gi1/0/2`,
          lineByLine: [
            { segment: 'Gi1/0/1 in both 10 & 20', meaning: 'Normal! `Gi1/0/1` carries untagged Data (VLAN 10) and tagged Voice (VLAN 20) simultaneously.' },
            { segment: 'Status: active', meaning: 'Confirms the VLAN actually exists and is un-suspended.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show interfaces Gi1/0/1 switchport',
        healthyLabel: 'Static Access + Voice VLAN (DTP Disabled)',
        healthyOutput: `Administrative Mode: static access
Operational Mode: static access
Access Mode VLAN: 10 (STAFF)
Voice VLAN: 20 (VOICE)`,
        brokenLabel: 'Orphaned Port (Assigned VLAN Deleted) or Dynamic Auto Trunk',
        brokenOutput: `Access Mode VLAN: 10 (Inactive)`,
        diagnosis:
          '`(Inactive)` means VLAN 10 was deleted or shut down! Recreate `vlan 10` (`state active`, `no shutdown`) immediately.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming a Voice VLAN turns an access port into a full trunk carrying all VLANs.',
        reality: 'An access+voice port stays `Operational Mode: static access`, tagging ONLY the single configured Voice VLAN while keeping Data untagged.',
      },
      {
        trap: 'Forgetting `switchport mode access` on user-facing ports.',
        reality: 'Leaving DTP enabled (`dynamic desirable/auto`) invites rogue switches to negotiate unauthorized trunk links!',
      },
      {
        trap: 'Deleting a VLAN without moving ports off it first.',
        reality: 'Ports in a deleted VLAN become inactive (`Inactive` in `show interfaces switchport`) and drop all traffic until the VLAN returns or ports move.',
      },
      {
        trap: 'Confusing PoE standards (802.3af 15.4W vs 802.3at 30W PoE+).',
        reality: 'Modern dual/tri-band Wi-Fi 6/6E APs typically demand 802.3at (30W) or 802.3bt (60W) to run all radios at full chains.',
      },
    ],

    keyTerms: [
      {
        term: 'Access Port',
        shortDef: 'Switch port assigned to a single untagged Data VLAN (plus optional Voice VLAN).',
        fullDef: 'Connects end hosts like PCs, printers, and cameras; configured with `switchport mode access`.',
      },
      {
        term: 'Voice VLAN',
        shortDef: 'Dedicated tagged VLAN separating IP phone RTP/SIP audio from PC data on one jack.',
        fullDef: 'Advertised to IP phones via CDP/LLDP-MED so phone traffic receives priority marking and clean isolation.',
      },
      {
        term: 'PoE / PoE+ (802.3af / 802.3at)',
        shortDef: 'Delivering DC electrical power (15.4W / 30W) over standard Cat5e/6 data cables.',
        fullDef: 'Powers IP phones, ceiling APs, and security cameras without separate AC outlets.',
      },
      {
        term: 'Inactive / Orphaned VLAN Port',
        shortDef: 'Access port assigned to a VLAN ID that has been deleted from `vlan.dat`.',
        fullDef: 'Port drops frames until the VLAN is recreated or reassigned to an active VLAN.',
      },
    ],

    checkQuestions: [
      {
        id: 'c22-q1',
        prompt: 'A user’s desktop PC plugs into the back of a Cisco IP Phone wired to `Gi1/0/6`. Which configuration properly separates PC data (VLAN 10) from VoIP audio (VLAN 20)?',
        options: [
          '`switchport mode access`, `switchport access vlan 10`, `switchport voice vlan 20`',
          '`switchport mode trunk`, `switchport trunk native vlan 20`',
          '`switchport access vlan 10,20`',
          'Put both PC and phone into VLAN 1',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `access vlan 10` handles untagged PC frames while `voice vlan 20` instructs the phone (via CDP/LLDP) to tag voice frames in VLAN 20.',
          'Incorrect: Desk jacks should never run open trunk mode toward end users.',
          'Incorrect: Invalid IOS syntax.',
          'Incorrect: Mixes voice and data into one broadcast domain.',
        ],
        takeaway: 'Use `switchport mode access` + `switchport access vlan <data>` + `switchport voice vlan <voice>` for phone+PC ports.',
      },
      {
        id: 'c22-q2',
        prompt: 'You run `show interfaces Gi1/0/9 switchport` and see `Access Mode VLAN: 30 (Inactive)`. Why is the user unable to pass traffic?',
        options: [
          'VLAN 30 was deleted or suspended on the switch, stranding the port.',
          'The user’s PC sent IPv6 packets.',
          'PoE+ wattage exceeded 15.4W.',
          'DTP converted the port to an access port.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `(Inactive)` indicates the assigned access VLAN does not exist in the active VLAN database.',
          'Incorrect: VLAN status is independent of IPv4 vs IPv6.',
          'Incorrect: PoE affects power, not VLAN existence.',
          'Incorrect: Static access is intended.',
        ],
        takeaway: '`(Inactive)` access VLAN = recreate/unsuspend that VLAN in global config.',
      },
      {
        id: 'c22-q3',
        prompt: 'An engineer needs to power a Wi-Fi 6 ceiling Access Point requiring 24 Watts over Cat6 cabling. Which PoE standard minimum is required?',
        options: ['IEEE 802.3at (PoE+ up to 30W)', 'IEEE 802.3af (PoE up to 15.4W)', '802.1Q', '802.1w'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: 802.3at (PoE+) delivers up to 30W per port, covering a 24W AP cleanly.',
          'Incorrect: 802.3af maxes out at 15.4W (leaving ~12.95W at the PD), insufficient for 24W.',
          'Incorrect: 802.1Q is VLAN trunking.',
          'Incorrect: 802.1w is Rapid Spanning Tree.',
        ],
        takeaway: '802.3af = 15.4W; 802.3at (PoE+) = 30W; 802.3bt (UPOE) = 60–90W.',
      },
      {
        id: 'c22-q4',
        prompt: 'Which command displays total switch PoE wattage, remaining available watts, and per-port power draw?',
        options: ['show power inline', 'show vlan brief', 'show spanning-tree', 'show ip route'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `show power inline` lists total PoE budget, remaining watts, and attached powered devices.',
          'Incorrect: `show vlan brief` lists VLAN-to-port mappings.',
          'Incorrect: `show spanning-tree` lists STP states.',
          'Incorrect: `show ip route` lists L3 routes.',
        ],
        takeaway: 'Use `show power inline` to diagnose PoE starvation and AP/phone power faults.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Create VLANs & Configure Access Ports in IOS Lab 02',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 02 (VLANs & 802.1Q Trunking) and assign named VLANs to access ports cleanly.',
      ],
      verificationCheck: '`show vlan brief` shows the newly created VLANs mapped to the target access ports.',
    },

    summaryBullets: [
      'Normal-range VLANs run `1–1001` (2–1001 user-configurable); VLANs segment broadcast domains at Layer 2.',
      'Configure edge ports explicitly with `switchport mode access` and `switchport access vlan <id>`.',
      'Combine `switchport voice vlan <id>` with `access vlan` for IP Phone + PC single-jack sharing.',
      'Deleting a VLAN leaves attached access ports `(Inactive)` until recreated or reassigned.',
      'Check `show power inline` when edge APs, phones, or IoT devices fail to power up (802.3af 15.4W vs 802.3at 30W).',
    ],

    sourcesToVerify: [
      'Cisco Catalyst Switch Configuration Guide — Configuring VLANs, Voice VLAN & Power over Ethernet',
    ],
  },

  'ccna.core.sw.trunks-8021q': {
    id: 'ccna.core.sw.trunks-8021q',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Switching and Network Access',
    topicTitle: '2.1 / 2.2 Switch-to-Switch & Switch-to-Router Links',
    code: '2.1.1',
    title: '802.1Q Trunks, Native VLANs, Routed Ports & Inter-VLAN SVIs',
    readMinutes: 14,
    prerequisites: ['2.2.1'],
    versionScope: 'shared',
    v11ExamTopics: ['2.2'],
    v20ExamTopics: ['2.1'],

    learningObjectives: [
      'Explain how IEEE 802.1Q inserts a 4-byte VLAN tag into Ethernet frames and why the Native VLAN travels untagged.',
      'Configure static 802.1Q trunks (`switchport mode trunk`), restrict `allowed vlan` lists, and prevent Native VLAN mismatches & DTP attacks.',
      'Compare the two inter-VLAN routing designs: **Router-on-a-Stick (ROAS subinterfaces)** vs. **Layer 3 Switch SVIs (`interface Vlan<id>`)** and routed ports (`no switchport`).',
      'Diagnose Native VLAN mismatches, missing allowed VLANs, and missing `ip routing` on L3 switches.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why VLAN 20 Works on Switch 1 Yet Dies Crossing the Uplink to Switch 2',
      narrative:
        'You configure VLAN 10 and VLAN 20 cleanly on SW1 and SW2, connect `Gi0/24` between them, and test. VLAN 10 pings fine across the building, yet VLAN 20 fails completely! Looking at `show interfaces trunk`, someone left `switchport trunk allowed vlan 1,10` (forgetting to add `,20`!), OR left SW1 in Native VLAN 1 while SW2 used Native VLAN 99—causing untagged traffic to leak across VLANs! Knowing 802.1Q trunks, Native VLANs, and inter-VLAN SVIs/ROAS solves 90% of campus switching tickets.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Color-Coded Shipping Containers Sharing One Bridge',
      analogy:
        'If two switches have VLAN 10, VLAN 20, and VLAN 30, running three separate cables between buildings wastes ports. Instead, an **802.1Q Trunk** turns ONE high-speed link into a shared bridge carrying traffic for all three VLANs simultaneously: as each Ethernet frame steps onto the trunk, the switch slaps a **4-byte color-coded sticker (802.1Q tag)** onto it saying `"VLAN 20"`, and the far switch peels off the sticker before handing it to a VLAN 20 desk! One single **Native VLAN** (default VLAN 1, best moved to an unused VLAN like 999) crosses the bridge **without any sticker**—which is why both sides of a trunk MUST agree on the exact same Native VLAN or frames land in the wrong department!',
      technicalDefinition:
        'IEEE 802.1Q inserts a 4-byte tag (TPID `0x8100` + PCP/DEI + 12-bit VID) into Ethernet frames traversing multi-VLAN trunk links, leaving only the configured Native VLAN untagged. Inter-VLAN routing interconnects separate VLAN broadcast domains via Router-on-a-Stick (`encapsulation dot1Q` subinterfaces) or Layer 3 switch SVIs (`interface Vlan<id>` with `ip routing`) and routed switch ports (`no switchport`).',
      paragraphs: [
        'On Cisco switches, older platforms (and L3 switches) support two trunk encapsulations (`ISL` legacy Cisco vs `802.1Q` industry standard), so you may need `switchport trunk encapsulation dot1q` before `switchport mode trunk`. Always disable DTP negotiation on trunks with `switchport nonegotiate` and explicitly match `switchport trunk native vlan <id>` on both ends.',
        'To route packets **between** VLAN 10 and VLAN 20, you need Layer 3: **(A) Router-on-a-Stick (ROAS)** connects one physical router interface to a switch trunk and creates virtual subinterfaces (`interface GigabitEthernet0/0.10` with `encapsulation dot1Q 10` + `ip address ...`). **(B) Layer 3 Multilayer Switch (SVI)** enables `ip routing` globally and assigns gateways directly onto `interface Vlan10` and `interface Vlan20` at ASIC wire speed!',
        'Need a switch port to behave like a pure point-to-point router interface (for connecting to a WAN router or firewall with a `/30` subnet)? Type **`no switchport`** under the interface to turn it into a **Routed Port** (`ip address ...`)!',
      ],
    },

    deepDive: {
      intro: 'Walk through 802.1Q tagging, ROAS vs. L3 SVI routing, and trunk troubleshooting.',
      steps: [
        {
          step: '1. 802.1Q Tagging & Native VLAN',
          title: 'Tagged vs. Untagged Trunk Frames',
          explanation: 'Tagged frames carry a 4-byte `0x8100` + 12-bit VLAN ID (`1–4094`). Native VLAN frames travel untagged unless `vlan dot1q tag native` is enabled. Mismatched Native VLANs trigger CDP warnings and leak traffic!',
        },
        {
          step: '2. Allowed VLAN Pruning',
          title: 'Adding vs. Overwriting Allowed VLANs',
          explanation: 'WARNING: Typing `switchport trunk allowed vlan 20` **overwrites** existing VLANs! Always use `switchport trunk allowed vlan add 20`.',
        },
        {
          step: '3. ROAS (Router-on-a-Stick)',
          title: 'Subinterfaces Over One Trunk',
          explanation: 'Keep physical `G0/0` un-addressed + `no shutdown`; configure `G0/0.10` (`encapsulation dot1Q 10`) and `G0/0.20` (`encapsulation dot1Q 20`). (Add `native` keyword if subinterface matches the trunk’s native VLAN!)',
        },
        {
          step: '4. L3 Switch SVIs & Routed Ports',
          title: 'Hardware-Speed Inter-VLAN Routing',
          explanation: 'Run `ip routing`; configure `interface Vlan10` + `ip address ...` + `no shutdown`. Note: An SVI stays `down/down` unless that VLAN exists in the database AND at least one active port/trunk carries it (`up/up`)!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '802.1Q Trunk Link & Router-on-a-Stick vs. Layer 3 Switch SVI',
        asciiFallback: `ROUTER-ON-A-STICK (ROAS):                  LAYER 3 SWITCH SVI:
[R1 G0/0.10 (10.10.10.1) + .20]            [L3 SW1: ip routing]
         | (802.1Q Trunk)                    |- interface Vlan10 (10.10.10.1)
    [SW1 Gi0/24]                             |- interface Vlan20 (10.10.20.1)
   /            \\                            |- interface Gi0/24: no switchport (to WAN!)
[V10 PC]      [V20 PC]`,
      },
      workedExample: {
        title: 'Troubleshooting an SVI Stuck in `up / down` + Native VLAN Warning',
        context:
          'You create `interface Vlan30` on an L3 switch (`10.30.30.1/24`), yet `show ip interface brief` shows `Vlan30 ... up ... down`, and syslog prints `%CDP-4-NATIVE_VLAN_MISMATCH`.',
        steps: [
          'Check `show vlan brief`: VLAN 30 was never created in the VLAN database (or no port/trunk in VLAN 30 is `up`)! Run `vlan 30 / name GUEST` and assign an active port or forwarding trunk.',
          'Check `show interfaces trunk` on both switches: SW1 Native VLAN = `99`, SW2 Native VLAN = `1`. Set `switchport trunk native vlan 99` on SW2’s trunk port.',
        ],
        outcome: '`Vlan30` transitions to `up/up` immediately and CDP Native VLAN warnings stop.',
      },
    },

    iosCliGuide: {
      intro: 'Verify trunk mode, Native VLAN, allowed VLANs, and ROAS/SVI routing state.',
      commands: [
        {
          title: 'Verify Active 802.1Q Trunk & Allowed VLANs',
          promptAndCommand: 'SW1# show interfaces trunk',
          output: `Port        Mode             Encapsulation  Status        Native vlan
Gi0/24      on               802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/24      10,20,30,99

Port        Vlans allowed and active in management domain
Gi0/24      10,20,30,99`,
          lineByLine: [
            { segment: 'Mode: on / Status: trunking', meaning: 'Statically configured 802.1Q trunk without fragile DTP negotiation.' },
            { segment: 'Native vlan: 99', meaning: 'Must match the peer switch’s Native VLAN identically.' },
            { segment: 'Vlans allowed and active', meaning: 'Any VLAN missing here CANNOT traverse this trunk.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show interfaces Gi0/24 trunk',
        healthyLabel: 'Both Sides Matched (`on`, `802.1q`, `Native 99`)',
        healthyOutput: `Gi0/24      on               802.1q         trunking      99`,
        brokenLabel: 'Native VLAN Mismatch + Missing Allowed VLAN',
        brokenOutput: `%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/24 (99), with SW2 GigabitEthernet0/24 (1).`,
        diagnosis:
          'Always match `switchport trunk native vlan` across both ends and use `allowed vlan add <id>` instead of overwriting the allowed list.',
      },
    },

    commonTraps: [
      {
        trap: 'Typing `switchport trunk allowed vlan 30` when you meant to ADD VLAN 30.',
        reality: 'Omitting **`add`** replaces the entire allowed list with ONLY VLAN 30, dropping VLANs 10 and 20 instantly!',
      },
      {
        trap: 'Configuring `switchport mode access` on BOTH ends vs `dynamic auto` on BOTH ends.',
        reality: 'Two `dynamic auto` ports NEVER form a trunk—they remain access ports! Set trunks explicitly with `switchport mode trunk`.',
      },
      {
        trap: 'Forgetting `no shutdown` on the physical parent interface (`G0/0`) of a Router-on-a-Stick.',
        reality: 'Even if `G0/0.10` and `G0/0.20` are configured, all subinterfaces stay `down/down` until physical `G0/0` has `no shutdown`.',
      },
      {
        trap: 'Trying to assign an IP address directly onto a physical switch port without `no switchport`.',
        reality: 'Switch interfaces default to Layer 2 (`switchport`); enter `no switchport` first to make it a Layer 3 routed port.',
      },
    ],

    keyTerms: [
      {
        term: 'IEEE 802.1Q',
        shortDef: 'Standard 4-byte VLAN tagging protocol (`0x8100`) used on Ethernet trunks.',
        fullDef: 'Inserts a 12-bit VLAN ID inside frames crossing shared inter-switch links while leaving the Native VLAN untagged.',
      },
      {
        term: 'Native VLAN',
        shortDef: 'Single VLAN carried untagged across an 802.1Q trunk (default VLAN 1).',
        fullDef: 'Best moved to an unused dummy VLAN (e.g., 999) and matched identically on both link ends to block VLAN hopping and traffic leaks.',
      },
      {
        term: 'Router-on-a-Stick (ROAS)',
        shortDef: 'Inter-VLAN routing using 802.1Q subinterfaces (`G0/0.10`) over a single router trunk.',
        fullDef: 'Cost-effective for small branches; shares one physical uplink bandwidth across all VLANs.',
      },
      {
        term: 'SVI (Switch Virtual Interface)',
        shortDef: 'Logical Layer 3 VLAN gateway (`interface Vlan10`) on a Layer 3 switch.',
        fullDef: 'Routes inter-VLAN traffic at wire speed inside switch ASICs when `ip routing` is enabled.',
      },
    ],

    checkQuestions: [
      {
        id: 'c211-q1',
        prompt: 'An engineer needs to add VLAN 40 to an existing trunk `Gi0/24` currently carrying VLANs 10, 20, and 30 without interrupting traffic. Which command is safe?',
        options: [
          'switchport trunk allowed vlan add 40',
          'switchport trunk allowed vlan 40',
          'switchport access vlan 40',
          'no switchport',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Using the `add` keyword appends VLAN 40 while preserving VLANs 10, 20, and 30.',
          'Incorrect: Leaving out `add` overwrites the list and immediately cuts off VLANs 10, 20, and 30!',
          'Incorrect: Sets an access VLAN rather than trunk allowed list.',
          'Incorrect: Turns the trunk into a Layer 3 routed port.',
        ],
        takeaway: 'ALWAYS use `switchport trunk allowed vlan add <id>` when expanding an active trunk.',
      },
      {
        id: 'c211-q2',
        prompt: 'SW1 connects to SW2 over `Gi0/1`. SW1 logs `%CDP-4-NATIVE_VLAN_MISMATCH`. What is misconfigured?',
        options: [
          'SW1 and SW2 have different Native VLAN IDs configured on their connected trunk interfaces.',
          'Both switches share identical VLAN 10 IP addresses.',
          'Auto-MDIX failed on fiber.',
          'PortFast is enabled on an access port.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: 802.1Q sends the Native VLAN untagged, so mismatched Native VLAN IDs cross-contaminate VLAN traffic and trigger CDP alarms.',
          'Incorrect: Duplicate IPs do not trigger Native VLAN mismatch warnings.',
          'Incorrect: Unrelated to Layer 1 pinouts.',
          'Incorrect: PortFast does not trigger Native VLAN mismatch.',
        ],
        takeaway: 'Match `switchport trunk native vlan <id>` identically on both sides of every trunk.',
      },
      {
        id: 'c211-q3',
        prompt: 'On a Layer 3 switch, how do you convert physical port `Gi1/0/24` from a Layer 2 switchport into a pure Layer 3 point-to-point interface for a WAN router uplink (`10.0.0.1/30`)?',
        options: [
          'Enter `no switchport` under `interface Gi1/0/24`, then configure `ip address 10.0.0.1 255.255.255.252`.',
          'Enter `switchport mode routed`.',
          'Assign `switchport access vlan 30`.',
          'Create `interface Gi1/0/24.10`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `no switchport` disables Layer 2 switching on that port so it acts as a dedicated Layer 3 routed port.',
          'Incorrect: Invalid IOS keyword.',
          'Incorrect: Keeps the port at Layer 2.',
          'Incorrect: Layer 2 switchports do not become routed interfaces via subinterfaces without `no switchport`.',
        ],
        takeaway: 'Use `no switchport` to turn a Catalyst switch interface into a Layer 3 routed port.',
      },
      {
        id: 'c211-q4',
        prompt: 'What happens to a switch-to-switch link if BOTH sides are left in `switchport mode dynamic auto`?',
        options: [
          'Neither side initiates trunking, so the link operates strictly as a single-VLAN access link.',
          'They automatically negotiate an 802.1Q trunk.',
          'The ports shut down into `err-disabled`.',
          'They form a Layer 3 EtherChannel.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `auto + auto` stays passive on both ends, never negotiating a trunk. At least one end must be `trunk` or `desirable` (best practice: static `switchport mode trunk`).',
          'Incorrect: DTP needs at least one active initiator.',
          'Incorrect: No error-disable occurs.',
          'Incorrect: DTP never builds EtherChannels.',
        ],
        takeaway: 'Avoid `dynamic auto/auto`; hardcode `switchport mode trunk` + `switchport nonegotiate`.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Configure 802.1Q Trunks & Inter-VLAN Routing in IOS Labs 02 & 03',
      targetTab: 'labs',
      instructions: [
        'Complete Lab 02 (VLANs & 802.1Q Trunking) and Lab 03 (Inter-VLAN Routing & EtherChannel) inside IOS Labs.',
      ],
      verificationCheck: 'Verify `show interfaces trunk` and cross-VLAN ping succeed.',
    },

    summaryBullets: [
      'IEEE 802.1Q inserts a 4-byte VLAN tag on trunks; only the **Native VLAN** travels untagged (match it on both ends!).',
      'Hardcode `switchport mode trunk` and use `switchport trunk allowed vlan add <id>` to avoid wiping existing VLANs.',
      'Router-on-a-Stick uses `encapsulation dot1Q <id>` subinterfaces under one un-addressed, `no shutdown` physical port.',
      'Layer 3 switches route inter-VLAN traffic at wire speed via `ip routing` + `interface Vlan<id>` SVIs.',
      'Use `no switchport` to configure a Layer 3 routed switch port.',
    ],

    sourcesToVerify: [
      'IEEE 802.1Q Standard & Cisco Catalyst Inter-VLAN Routing Configuration Guide',
    ],
  },

  'ccna.core.sw.etherchannel-lacp': {
    id: 'ccna.core.sw.etherchannel-lacp',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Switching and Network Access',
    topicTitle: '2.1 / 2.4 L2 & L3 EtherChannel Bundling with LACP',
    code: '2.1.2',
    title: 'L2 & L3 EtherChannel Bundling with LACP',
    readMinutes: 12,
    prerequisites: ['2.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['2.4'],
    v20ExamTopics: ['2.1'],

    learningObjectives: [
      'Explain why EtherChannel bundles 2–8 physical ports into one logical `Port-channel` interface (increasing aggregate bandwidth, fault tolerance, and preventing STP blocking).',
      'Compare LACP (`active` / `passive`, IEEE 802.3ad/802.1AX) against Cisco PAgP (`desirable` / `auto`) and static `on` mode.',
      'Configure both **Layer 2 trunk EtherChannels** and **Layer 3 routed EtherChannels** (`no switchport`).',
      'Diagnose EtherChannel bundle failures caused by mismatched speed/duplex, trunk mode, Native VLAN, or `active/passive` pairing.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Plugging Two Cables Between Two Switches Gives Zero Extra Speed Without EtherChannel',
      narrative:
        'Suppose you wire TWO 1 Gbps links between Core Switch A and Access Switch B expecting 2 Gbps of uplink throughput. Instead, Spanning Tree Protocol sees a physical loop and **blocks the second cable completely**, giving you just 1 Gbps! Bundling those cables into an **EtherChannel (`Port-channel 1`)** tricks Spanning Tree into seeing ONE single 2 Gbps logical pipe—doubling usable bandwidth while providing instant sub-second failover if one cable breaks.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Tying Parallel Ferry Boats Into One Wide Car Bridge',
      analogy:
        'Two separate bridges side by side make city traffic controllers nervous about cars looping around in circles, so they close one bridge completely (**Spanning Tree blocking**). **EtherChannel** bolts up to **8 identical physical ports** together into a single logical **Port-Channel** highway (`Po1`). Because Spanning Tree sees only ONE logical link, it leaves every cable open! **LACP (Link Aggregation Control Protocol)** acts like safety inspectors on both ends verifying every bolt matches (identical speed, duplex, VLANs, trunk settings) before opening a lane—setting `active` (actively sends checks) or `passive` (waits politely to reply).',
      technicalDefinition:
        'EtherChannel (IEEE 802.3ad / 802.1AX LACP) aggregates up to 8 active physical links (plus up to 8 standby with LACP) into one logical `Port-channel` interface at Layer 2 (access/trunk) or Layer 3 (`no switchport` routed IP), load-balancing flows across member links via source/destination MAC/IP hashing.',
      paragraphs: [
        'Memorize the exact negotiation modes: **LACP (open standard)** uses **`active`** (initiates LACPDU packets) and **`passive`** (listens and responds). **`active + active`** works; **`active + passive`** works; **`passive + passive`** NEVER forms a channel! Avoid mixing static **`on`** with `active/passive`—`on` sends zero negotiation packets and leaves the bundle broken or suspended.',
        'For any two ports to join a Port-Channel, ALL physical and Layer 2 parameters must match identically: **Speed**, **Duplex**, **Access vs Trunk mode**, **Native VLAN**, and **Allowed VLANs**. If one member mismatches, IOS forces it into `(I)` individual/standalone or `(s)` suspended state!',
        'When configuring a **Layer 3 EtherChannel** between two distribution switches, apply `no switchport` FIRST on both the physical member ports AND `interface Port-channel 1`, assigning the IP address strictly onto `interface Port-channel 1`—never on individual physical cables!',
      ],
    },

    deepDive: {
      intro: 'Step through L2 vs L3 EtherChannel setup and the 5 compatibility rules.',
      steps: [
        {
          step: 'Rule 1',
          title: 'LACP Mode Compatibility Matrix',
          explanation: '`active + active` = UP. `active + passive` = UP. `passive + passive` = DOWN. `on + on` = UP (no check). `on + active` = BROKEN!',
        },
        {
          step: 'Rule 2',
          title: 'All Member Ports Must Match Identically',
          explanation: 'Speed, duplex, switchport mode (access vs trunk), access VLAN, native VLAN, and allowed VLAN list must match across all bundled ports.',
        },
        {
          step: 'L2 Setup',
          title: 'Configure Trunk on `Port-channel`, Assign Members via `channel-group`',
          explanation: 'Best practice: shut member interfaces (`shut`), create `interface range Gi0/1 - 2` -> `channel-group 1 mode active`, configure `interface Port-channel 1` as `switchport mode trunk` + allowed/native VLANs, then `no shut` members.',
        },
        {
          step: 'L3 Setup',
          title: 'Routed Port-Channel (`no switchport`)',
          explanation: '`interface range Gi0/1 - 2` -> `no switchport` -> `channel-group 1 mode active` -> `interface Port-channel 1` -> `no switchport` -> `ip address 10.0.0.1 255.255.255.252`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'LACP Bundling & `show etherchannel summary` Flag Decoder',
        asciiFallback: `[SW1] === Gi0/1 (active) === [Po1] === Gi0/1 (passive) === [SW2]
      === Gi0/2 (active) ===       === Gi0/2 (passive) ===
       (STP sees 1 logical link Po1 — zero blocked uplinks!)

FLAGS IN 'show etherchannel summary':
  SU = Layer 2 & In Use (HEALTHY!)     RU = Layer 3 & In Use (HEALTHY!)
  (P) = Bundled in port-channel (GOOD)  (I) = Stand-alone (MISMATCH!)  (D) = Down`,
      },
      workedExample: {
        title: 'Diagnosing a Broken EtherChannel Showing `SD` and `(I)` Flags',
        context:
          'You wire `Gi0/1–2` between SW1 and SW2 using LACP, yet `show etherchannel summary` shows `Po1(SD)` and `Gi0/1(I) Gi0/2(I)`.',
        steps: [
          'Check `show running-config interface Gi0/1` on both switches: SW1 uses `channel-group 1 mode passive`, and SW2 ALSO uses `mode passive`!',
          'Even after fixing SW1 to `mode active`, `Gi0/2` stays `(s)` suspended because `Gi0/2` is missing VLAN 20 in its `allowed vlan` list compared to `Gi0/1`.',
          'Apply matching trunk settings on `interface Port-channel 1` (and confirm `Gi0/1–2` match) -> `show etherchannel summary` immediately displays `Po1(SU)  LACP  Gi0/1(P) Gi0/2(P)`.',
        ],
        outcome: 'Both links bundle cleanly into `SU` + `(P)` and load-balance across flows.',
      },
    },

    iosCliGuide: {
      intro: 'Verify EtherChannel bundle status and member port flags with `show etherchannel summary`.',
      commands: [
        {
          title: 'Verify Healthy Layer 2 LACP Port-Channel',
          promptAndCommand: 'SW1# show etherchannel summary',
          output: `Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)`,
          lineByLine: [
            { segment: 'Po1(SU)', meaning: '`S` = Layer 2, `U` = In Use. (For L3 routed EtherChannels, look for `RU`!).' },
            { segment: 'LACP', meaning: 'Confirms IEEE 802.3ad/802.1AX LACP rather than proprietary PAgP or static `on` (`-`).' },
            { segment: 'Gi0/1(P) Gi0/2(P)', meaning: '`(P)` = Bundled actively inside the Port-Channel.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show etherchannel summary',
        healthyLabel: 'Healthy LACP Bundle (`SU` + `P`)',
        healthyOutput: `1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)`,
        brokenLabel: 'Mode Mismatch (`passive/passive` or `on/active`) Showing `SD` + `(I)`',
        brokenOutput: `1      Po1(SD)         LACP      Gi0/1(I)    Gi0/2(I)`,
        diagnosis:
          '`(I)` means standalone (LACP saw zero compatible peer LACPDUs), while `(D)`/`(s)` means down or suspended due to trunk/speed/VLAN parameter mismatch.',
      },
    },

    commonTraps: [
      {
        trap: 'Setting `channel-group 1 mode passive` on BOTH switches.',
        reality: 'Two `passive` interfaces never initiate LACP frames (`SD`/`(I)`); configure at least one side (or both!) as `mode active`.',
      },
      {
        trap: 'Mixing `mode on` on SW1 with `mode active` on SW2.',
        reality: '`mode on` sends zero LACP frames, so SW2 never bundles and links may end up down or looping.',
      },
      {
        trap: 'Assigning an IP address to `Gi0/1` or `Gi0/2` inside a Layer 3 EtherChannel.',
        reality: 'Assign the IP strictly on `interface Port-channel 1` after putting `no switchport` on both physical ports and the Port-Channel.',
      },
      {
        trap: 'Expecting a single large file download (`1 TCP flow`) to double speed over a 2-port EtherChannel.',
        reality: 'EtherChannel hashes **per flow** (Src/Dst MAC, IP, or L4 Port configured via global `port-channel load-balance <method>`, verified with `show etherchannel load-balance`) to prevent out-of-order packets—one flow uses one cable, while multiple concurrent flows spread across all bundled links.',
      },
    ],

    keyTerms: [
      {
        term: 'LACP (802.3ad / 802.1AX)',
        shortDef: 'Open-standard protocol negotiating dynamic EtherChannel link bundles (`active`/`passive`).',
        fullDef: 'Supports up to 16 configured links (8 active + 8 hot-standby) and detects broken unidirectional links safely.',
      },
      {
        term: 'PAgP',
        shortDef: 'Cisco-proprietary link aggregation protocol using `desirable` and `auto` modes.',
        fullDef: 'Functions similarly to LACP on Cisco-only hardware; avoid mixing PAgP with LACP.',
      },
      {
        term: 'Port-Channel (`Po1`)',
        shortDef: 'Logical bundled interface combining multiple physical cables for STP and routing.',
        fullDef: 'Receives trunk/access/IP settings (`SU` for L2, `RU` for L3) while member links carry `(P)` flags.',
      },
    ],

    checkQuestions: [
      {
        id: 'c212-q1',
        prompt: 'Which pair of LACP settings on SW1 and SW2 WILL successfully form an EtherChannel?',
        options: [
          'SW1 = `active`, SW2 = `passive`',
          'SW1 = `passive`, SW2 = `passive`',
          'SW1 = `on`, SW2 = `active`',
          'SW1 = `desirable` (PAgP), SW2 = `active` (LACP)',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `active` initiates LACP negotiation and `passive` responds cleanly.',
          'Incorrect: `passive + passive` waits silently on both sides.',
          'Incorrect: `on` disables LACP completely, breaking negotiation with `active`.',
          'Incorrect: PAgP (`desirable/auto`) and LACP (`active/passive`) are incompatible protocols.',
        ],
        takeaway: 'LACP needs `active + active` or `active + passive`; never mix `on`, `passive+passive`, or PAgP+LACP.',
      },
      {
        id: 'c212-q2',
        prompt: 'In `show etherchannel summary`, what does `Po1(SU)  LACP  Gi0/1(P) Gi0/2(P)` confirm?',
        options: [
          'Port-channel 1 is Layer 2 (`S`), up and in use (`U`), with both ports actively bundled (`P`).',
          'Port-channel 1 is shut down (`D`) and suspended.',
          'Port-channel 1 is a Layer 3 routed interface (`R`).',
          'Both ports failed LACP and are acting standalone (`I`).',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `SU` = Layer 2 Switched + In Use; `(P)` = Bundled in port-channel.',
          'Incorrect: Shutdown/down reports `SD` or `RD`.',
          'Incorrect: Layer 3 routed bundles report `RU`.',
          'Incorrect: Failed LACP reports `(I)` standalone.',
        ],
        takeaway: '`SU` + `(P)` = healthy Layer 2 EtherChannel; `RU` + `(P)` = healthy Layer 3 EtherChannel.',
      },
      {
        id: 'c212-q3',
        prompt: 'An engineer wires two 1 Gbps links into `Po1` (`2 Gbps` aggregate). Why does a single laptop FTP transfer still peak at 1 Gbps?',
        options: [
          'EtherChannel load-balances per flow using MAC/IP hashing so all packets of one flow stay in order on one cable.',
          'The second cable is always blocked by Spanning Tree.',
          'LACP limits total bundle speed to 1 Gbps.',
          'FTP runs over UDP port 69.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Hashing keeps each single TCP flow on one physical link to preserve packet ordering, while spreading *different* users/flows across all cables.',
          'Incorrect: STP treats `Po1` as one logical link and blocks neither cable.',
          'Incorrect: Aggregate capacity across multiple flows is 2 Gbps.',
          'Incorrect: FTP uses TCP 20/21.',
        ],
        takeaway: 'EtherChannel provides multi-flow aggregate bandwidth rather than splitting a single TCP stream across cables.',
      },
      {
        id: 'c212-q4',
        prompt: 'When creating a Layer 3 EtherChannel between two distribution switches, where is the IP address configured?',
        options: [
          'On `interface Port-channel <num>` after entering `no switchport` on both physical ports and the Port-Channel',
          'On `Gi0/1` only',
          'On `Gi0/1` and `Gi0/2` with identical IPs',
          'Layer 3 switches cannot run EtherChannel',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Physical member ports act purely as L3 bundle slaves; the IP belongs strictly on `interface Port-channel`.',
          'Incorrect: Putting an IP on physical members violates bundle consistency.',
          'Incorrect: Causes duplicate IP errors.',
          'Incorrect: Catalyst L3 switches support `RU` routed EtherChannels natively.',
        ],
        takeaway: 'Layer 3 EtherChannel = `no switchport` on members & Po interface, IP strictly on `Port-channel`.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Configure LACP EtherChannel in IOS Lab 03',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 03 (LACP EtherChannel & Inter-VLAN Routing) and bundle the redundant links using `channel-group 1 mode active`.',
      ],
      verificationCheck: '`show etherchannel summary` displays `Po1(SU)` and `(P)` on all bundled ports.',
    },

    summaryBullets: [
      'EtherChannel combines 2–8 physical cables into one logical `Port-channel` so STP does not block parallel links.',
      'Use open-standard **LACP (`active` / `passive`)**; `active + active` or `active + passive` works, whereas `passive + passive` or mixing `on` fails.',
      'Every member port must share identical speed, duplex, switchport mode, native VLAN, and allowed VLANs.',
      'Look for `SU` (L2) or `RU` (L3) plus `(P)` in `show etherchannel summary`.',
      'EtherChannel hashes per flow to avoid out-of-order packets while scaling aggregate throughput across users.',
    ],

    sourcesToVerify: [
      'IEEE 802.1AX Link Aggregation & Cisco EtherChannel Configuration Guide',
    ],
  },

  'ccna.core.sw.rapid-pvst': {
    id: 'ccna.core.sw.rapid-pvst',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Switching and Network Access',
    topicTitle: '2.5 Rapid PVST+ & Spanning-Tree Guards',
    code: '2.5.1',
    title: 'Rapid PVST+ Root Election, Port States/Roles, PortFast, Root/Loop & BPDU Guard',
    readMinutes: 15,
    prerequisites: ['2.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['2.5'],
    v20ExamTopics: ['2.5'],

    learningObjectives: [
      'Explain why Ethernet switches fail catastrophically during physical Layer 2 loops (broadcast storms, MAC flapping) without Spanning Tree.',
      'Calculate **Root Bridge** election (lowest Bridge ID = Priority + Extended System ID + MAC) and select **Root Ports**, **Designated Ports**, and **Alternate/Blocking Ports**.',
      'Compare Rapid PVST+ (802.1w) states (`Discarding`, `Learning`, `Forwarding`) and roles (`Root`, `Designated`, `Alternate`, `Backup`).',
      'Configure and verify **PortFast**, **BPDU Guard**, **Root Guard**, and **Loop Guard** on edge vs. core links.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Plugging Both Ends of a Patch Cord Into Two Wall Jacks Can Take Down an Entire Floor',
      narrative:
        'Because Layer 2 Ethernet frames have **NO Time-to-Live (TTL)** counter like IP packets do, a single accidental loop between two switch ports multiplies broadcasts exponentially until every switch CPU hits 100% in seconds (**Broadcast Storm**)! **Rapid PVST+** prevents loops automatically by electing one Root Bridge and blocking redundant paths—AND pairing **PortFast + BPDU Guard** on desk ports lets PCs get DHCP immediately while shutting down any unauthorized switch someone plugs under a desk.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Electing One Town Square Hub and Putting Traffic Gates on Back Roads',
      analogy:
        'To guarantee traffic never drives in endless circles on a road map with redundant loops, every switch exchanges polite status cards called **BPDUs (Bridge Protocol Data Units)** every 2 seconds. First, all switches compare IDs and elect one **Root Bridge** (lowest Priority number—think of picking the Core distribution switch as Town Hall by lowering its priority to `4096` or `24576` instead of leaving default `32768`!). Every other switch picks its single shortest path back to Town Hall (**Root Port**), puts one forwarding gatekeeper on each shared cable (**Designated Port**), and locks extra redundant gates shut (**Alternate / Discarding**). Meanwhile, **PortFast** tells desk ports "Only a laptop lives here—skip the 30-second STP waiting room," and **BPDU Guard** stands watch: "If a rogue switch ever sends a BPDU on this laptop port, lock it down instantly (`err-disabled`)!"',
      technicalDefinition:
        'Rapid PVST+ (Cisco per-VLAN implementation of IEEE 802.1w RSTP) builds a loop-free Layer 2 forwarding tree per VLAN in sub-second convergence using 3 port states (`Discarding`, `Learning`, `Forwarding`), electing the lowest Bridge ID as Root Bridge and assigning Root, Designated, Alternate, and Backup roles based on cumulative path cost.',
      paragraphs: [
        'Every switch Bridge ID (BID) equals **`Priority (default 32768, steps of 4096) + VLAN ID (Extended System ID) + Switch Base MAC`**. Lowest BID wins! Leaving default priority `32768` everywhere often accidentally elects the oldest low-MAC closet switch as Root Bridge—forcing all campus traffic through slow access links. Always set `spanning-tree vlan 10 root primary` (`24576`) on Core A and `root secondary` (`28672`) on Core B!',
        'On every non-root switch: pick **ONE Root Port (RP)**—lowest cumulative root path cost toward the Root Bridge (tie-breakers: lowest sender BID -> lowest sender Port ID). On every network segment/cable: pick **ONE Designated Port (DP)** (all ports on the Root Bridge are Designated!). Any remaining link ports enter **Alternate / Discarding** (`BLK`).',
        'Know the four **STP Protection Features**: **(1) PortFast** (`spanning-tree portfast`) transitions host access ports straight to Forwarding; **(2) BPDU Guard** (`spanning-tree bpduguard enable`) puts a PortFast port into `err-disabled` if ANY BPDU arrives; **(3) Root Guard** (`spanning-tree guard root`) goes on Distribution ports facing untrusted access switches so no rogue switch can claim Root Bridge (`root-inconsistent`); **(4) Loop Guard** (`spanning-tree guard loop`) prevents an Alternate/Blocking port from blindly going Forwarding if fiber breaks unidirectionally and stops receiving BPDUs (`loop-inconsistent`).',
      ],
    },

    deepDive: {
      intro: 'Walk through BID Root election, STP cost math, Rapid PVST+ states, and STP Guard placement.',
      steps: [
        {
          step: '1. Elect Root Bridge',
          title: 'Lowest Bridge ID Wins (Priority + SysID + MAC)',
          explanation: 'Compare Priorities first (default `32768 + VLAN`). Lower Priority wins immediately. If tied, lowest base MAC wins.',
        },
        {
          step: '2. Elect Root Ports & Designated Ports',
          title: 'Path Cost -> Sender BID -> Sender Port ID',
          explanation: 'Standard short STP costs: 10M=`100`, 100M=`19`, 1G=`4`, 10G=`2`. Each non-root switch picks its single lowest-cost port to Root as Root Port (`FWD`). Every cable gets one Designated Port (`FWD`); leftovers become Alternate (`BLK` / Discarding).',
        },
        {
          step: '3. Rapid PVST+ States vs 802.1D',
          title: '3 States Instead of 5',
          explanation: '802.1D had `Disabled, Blocking, Listening, Learning, Forwarding` (30–50s!). Rapid PVST+ (802.1w) uses only **`Discarding`**, **`Learning`**, and **`Forwarding`**—converging in < 1 second via Sync/Proposal-Agreement handshakes.',
        },
        {
          step: '4. Guards Placement (v2.0 2.5)',
          title: 'PortFast + BPDU Guard (Access) | Root Guard (Downlinks) | Loop Guard (Uplinks)',
          explanation: 'Never put BPDU Guard on switch-to-switch trunks! Put PortFast + BPDU Guard on edge host ports, Root Guard on distribution downlinks, and Loop Guard on non-designated/redundant fiber uplinks.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Rapid PVST+ Triangle Election & STP Guard Placement Map',
        asciiFallback: `        [SW1: CORE ROOT (Pri 24586)]
           DP(Gi0/1,cost 4)     DP(Gi0/2,cost 4)
             /                       \\
   RP(Gi0/1) /                         \\ RP(Gi0/2)
  [SW2: Access A] ----------------- [SW3: Access B]
   DP(Gi0/3)         (1G link)       ALT/BLK(Gi0/3) <-- Higher BID loses & blocks!
     | (Edge PC)
  PortFast + BPDU Guard! (Root Guard goes on SW1 -> SW2/SW3 if untrusted)`,
      },
      workedExample: {
        title: 'Picking the Blocked Port in a 3-Switch Ring & Recovering `err-disabled`',
        context:
          'SW1 (Pri 24576) is Root. SW2 (Pri 32768, MAC `0000.2222`) and SW3 (Pri 32768, MAC `0000.3333`) have 1 Gbps links to SW1 and to each other.',
        steps: [
          'SW1 has lowest BID -> All SW1 ports are **Designated (Forwarding)**.',
          'SW2 and SW3 reach SW1 directly in 1G (`cost = 4`), so their ports toward SW1 become **Root Ports (Forwarding)**.',
          'On the cable between SW2 and SW3: both have equal cost `4` to the Root, so compare Sender BID -> SW2’s MAC (`0000.2222`) beats SW3’s MAC (`0000.3333`)! Thus SW2 keeps **Designated (FWD)** and SW3’s port becomes **Alternate (BLK/Discarding)**.',
          'Meanwhile, a user plugs a mini-hub/switch into `SW2 Gi0/10` (PortFast + BPDU Guard): `Gi0/10` receives a BPDU and goes `err-disabled`. Unplug the rogue switch, then run `shut` / `no shut` on `Gi0/10` to recover.',
        ],
        outcome: 'Zero loops exist, deterministic Root stays on SW1, and rogue access switches are blocked cleanly.',
      },
    },

    iosCliGuide: {
      intro: 'Inspect Root Bridge identity, per-port roles/states, and BPDU/Root Guard settings in Cisco IOS.',
      commands: [
        {
          title: 'Inspect Spanning Tree Roles, Cost & Root Identity',
          promptAndCommand: 'SW3# show spanning-tree vlan 10',
          output: `VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586
             Address     aabb.cc00.1000
             Cost        4
             Port        1 (GigabitEthernet0/1)
  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     aabb.cc00.3000
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Root FWD 4         128.1    P2p
Gi0/2               Altn BLK 4         128.2    P2p
Gi0/10              Desg FWD 4         128.10   P2p Edge`,
          lineByLine: [
            { segment: 'protocol rstp', meaning: 'Confirms Rapid PVST+ (`mode rapid-pvst`) is running.' },
            { segment: 'Root ID Priority 24586', meaning: '24576 + VLAN 10 = 24586 (`root primary` on SW1).' },
            { segment: 'Gi0/2 Altn BLK', meaning: 'Alternate port sitting cleanly in Discarding/Blocking state to break the loop.' },
            { segment: 'P2p Edge', meaning: '`Edge` confirms `spanning-tree portfast` is active on host port `Gi0/10`.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show interfaces status err-disabled',
        healthyLabel: 'Clean Access Port With PortFast + BPDU Guard',
        healthyOutput: `Gi0/10    DESK-PC1     connected    10         a-full a-1000`,
        brokenLabel: 'BPDU Guard Tripped by Rogue Switch on Edge Port',
        brokenOutput: `Gi0/10    DESK-PC1     err-disabled 10         auto   auto`,
        diagnosis:
          'Check `show interfaces status err-disabled` (`bpduguard` reason). Remove the unauthorized switch/looped cable on `Gi0/10`, then bounce the port (`shutdown` followed by `no shutdown`).',
      },
    },

    commonTraps: [
      {
        trap: 'Enabling `spanning-tree portfast` on switch-to-switch trunk ports.',
        reality: 'PortFast skips STP checks and can cause temporary loops between switches; keep PortFast strictly on host edge ports (or use `portfast edge`).',
      },
      {
        trap: 'Confusing **Root Guard** and **BPDU Guard**.',
        reality: '**BPDU Guard** shuts down (`err-disabled`) an edge port on ANY incoming BPDU; **Root Guard** goes on inter-switch downlinks and blocks (`root-inconsistent`) ONLY if a neighbor advertises a *superior* BPDU trying to steal Root.',
      },
      {
        trap: 'Forgetting that Extended System ID adds the VLAN number to the Bridge Priority (`32768 + 10 = 32778`).',
        reality: 'Every VLAN runs its own Rapid PVST+ instance, so VLAN 10 default priority reads `32778`.',
      },
      {
        trap: 'Assuming a `Blocking / Discarding` port is broken.',
        reality: '`Altn BLK` is STP’s normal, healthy safety lock preventing broadcast storms on redundant links!',
      },
    ],

    keyTerms: [
      {
        term: 'Root Bridge',
        shortDef: 'Central reference switch with the lowest Bridge ID (`Priority + VLAN + MAC`).',
        fullDef: 'Should always be placed intentionally at the Core/Distribution layer via `spanning-tree vlan <id> root primary`.',
      },
      {
        term: 'PortFast',
        shortDef: 'Feature moving access host ports straight to Forwarding without 30s STP delay.',
        fullDef: 'Prevents DHCP timeouts on booting PCs; always pair with BPDU Guard on user jacks.',
      },
      {
        term: 'BPDU Guard',
        shortDef: 'Forces an edge PortFast port into `err-disabled` if any BPDU arrives.',
        fullDef: 'Blocks rogue desktop switches and accidental patch-cord loops cleanly.',
      },
      {
        term: 'Root Guard / Loop Guard',
        shortDef: 'Protects Root Bridge placement (`Root Guard`) and prevents unidirectional blocking failures (`Loop Guard`).',
        fullDef: 'Root Guard puts superior-BPDU ports in `root-inconsistent`; Loop Guard puts silent non-designated ports in `loop-inconsistent`.',
      },
    ],

    checkQuestions: [
      {
        id: 'c25-q1',
        prompt: 'What are the three port states used by Rapid PVST+ (IEEE 802.1w)?',
        options: [
          'Discarding, Learning, Forwarding',
          'Blocking, Listening, Learning, Forwarding, Disabled',
          'Down, Init, 2-Way, Full',
          'Access, Trunk, Dynamic',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Rapid PVST+ merges Disabled, Blocking, and Listening into one `Discarding` state alongside `Learning` and `Forwarding`.',
          'Incorrect: Those five belong to legacy 802.1D Spanning Tree.',
          'Incorrect: Those are OSPFv2 neighbor states.',
          'Incorrect: Those are switchport modes.',
        ],
        takeaway: 'Rapid PVST+ (802.1w) = Discarding, Learning, Forwarding.',
      },
      {
        id: 'c25-q2',
        prompt: 'A user plugs an unmanaged 5-port mini-switch into desk port `Gi0/14` configured with `portfast` and `bpduguard enable`. What happens if the mini-switch emits a BPDU?',
        options: [
          '`Gi0/14` immediately transitions into `err-disabled` state and drops all frames.',
          '`Gi0/14` turns into an 802.1Q trunk automatically.',
          'The mini-switch becomes the campus Root Bridge.',
          '`Gi0/14` enters `root-inconsistent` until BPDUs stop, then auto-recovers.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: BPDU Guard immediately shuts the port down into `err-disabled` upon receiving any BPDU.',
          'Incorrect: BPDU Guard shuts the port down, never trunks.',
          'Incorrect: Blocked before any election can happen.',
          'Incorrect: Auto-recovery on superior-BPDU silence describes **Root Guard** (`root-inconsistent`), whereas **BPDU Guard** enters `err-disabled`.',
        ],
        takeaway: 'BPDU Guard -> `err-disabled` on any BPDU; Root Guard -> `root-inconsistent` on superior BPDU.',
      },
      {
        id: 'c25-q3',
        prompt: 'Three switches use default STP priority `32768` for VLAN 1:\n• SW-A MAC `0011.1111.1111`\n• SW-B MAC `0000.aaaa.bbbb`\n• SW-C MAC `0022.2222.2222`\nWhich switch wins Root Bridge election?',
        options: ['SW-B', 'SW-A', 'SW-C', 'None — ties stay down'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: All three tie on Priority `32769` (`32768 + 1`), so the numerically lowest base MAC (`0000.aaaa.bbbb`) wins Root Bridge.',
          'Incorrect: `0011` > `0000`.',
          'Incorrect: `0022` > `0000`.',
          'Incorrect: MAC addresses are unique and always break ties.',
        ],
        takeaway: 'Lowest Priority wins first; lowest base MAC breaks Priority ties.',
      },
      {
        id: 'c25-q4',
        prompt: 'Which STP guard prevents an Alternate/Blocking port from mistakenly transitioning to Forwarding if a unidirectional fiber break stops incoming BPDUs?',
        options: ['Loop Guard', 'PortFast', 'BPDU Filter', 'VTP Pruning'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Loop Guard transitions a silent Alternate/Root port into `loop-inconsistent` blocking instead of Forwarding, preventing unidirectional loops.',
          'Incorrect: PortFast skips blocking on edge host ports.',
          'Incorrect: BPDU Filter suppresses BPDUs (dangerous on inter-switch links!).',
          'Incorrect: VTP Pruning trims unused VLANs.',
        ],
        takeaway: 'Loop Guard protects against silent unidirectional link failures on redundant switch uplinks.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Verify Rapid PVST+ & PortFast Status in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Inspect `show spanning-tree` in IOS Labs to read Root ID vs. local Bridge ID, port roles, and forwarding/blocking states.',
      ],
      verificationCheck: 'Identify the Root Bridge and trace Root vs. Designated vs. Alternate ports cleanly.',
    },

    summaryBullets: [
      'STP prevents Ethernet broadcast storms and MAC flapping caused by physical Layer 2 loops.',
      'Lowest Bridge ID (`Priority + VLAN + MAC`) becomes **Root Bridge**; set Core priority explicitly instead of leaving default `32768`.',
      'Rapid PVST+ uses 3 states (**Discarding, Learning, Forwarding**) and 4 roles (**Root, Designated, Alternate, Backup**).',
      '**PortFast + BPDU Guard** belongs on access host ports (`err-disabled` on unexpected BPDUs).',
      '**Root Guard** blocks superior BPDUs (`root-inconsistent`); **Loop Guard** blocks missing-BPDU unidirectional faults (`loop-inconsistent`).',
    ],

    sourcesToVerify: [
      'IEEE 802.1w RSTP & Cisco Catalyst Rapid PVST+ Configuration Guide',
    ],
  },
};
