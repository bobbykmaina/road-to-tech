import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT1_A_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.v11.1.1': {
    id: 'ccna.v11.1.1',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Fundamentals',
    topicTitle: '1.1 Role & Function of Network Components',
    code: '1.1.1',
    title: 'Routers, L2/L3 Switches, NGFWs, IPS, APs, WLCs & Endpoints',
    readMinutes: 11,
    prerequisites: ['0.1.1'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['1.1 Explain the role and function of network components'],

    learningObjectives: [
      'Explain the primary forwarding and security function of routers, Layer 2 switches, Layer 3 switches, Next-Generation Firewalls (NGFWs), and IPS appliances.',
      'Distinguish Wireless Access Points (APs) from Wireless LAN Controllers (WLCs) in enterprise Wi-Fi deployments.',
      'Differentiate endpoints (laptops, VoIP phones, IoT sensors) from network infrastructure and servers.',
      'Select the right hardware appliance when given an enterprise campus or branch requirement.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Designing a Safe 3-Floor Office Without Buying the Wrong Appliance',
      narrative:
        'Imagine a growing clinic opens a new 3-floor building and asks you why they cannot simply plug a $40 home Wi-Fi box into an ISP fiber modem for 120 staff laptops, medical tablets, VoIP phones, and guest phones. You must justify why a Layer 2/3 switch handles wire-speed desk ports and Power over Ethernet (PoE), why a dedicated router connects WAN links, why an NGFW/IPS inspects application threats at the perimeter, and why lightweight APs managed by a WLC keep guests separated from clinical records.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an Airport: Check-In Gates, Security Screening, Air Traffic Control & Runways',
      analogy:
        'A campus network runs like an airport. **Endpoints** (laptops, phones, printers) are the passengers and cargo moving through the terminal. **Layer 2 Switches** are the internal concourses connecting gates within one terminal at wire speed, while **Layer 3 Switches** add high-speed express walkways between terminals (inter-VLAN routing). **Routers** are the highway interchanges connecting the airport to the outside city and other airports (WANs). **NGFWs & IPS** are TSA security screening checkpoints inspecting baggage (deep packet inspection) and blocking suspicious passengers before they board. **Access Points (APs)** are wireless boarding radios, coordinated centrally by the **Wireless LAN Controller (WLC)** acting as air traffic control.',
      technicalDefinition:
        'Enterprise networks separate packet forwarding (L2/L3 switches and routers), security enforcement (stateful NGFWs and signature/anomaly-based IPS), wireless RF termination (APs and centralized WLCs), and end-user compute/services (endpoints and servers) into specialized devices optimized in hardware ASICs or security engines.',
      paragraphs: [
        'Beginners often blur **Layer 2 switches** and **Layer 3 switches**. Both use dedicated Application-Specific Integrated Circuits (ASICs) to switch Ethernet frames at wire speed with minimal delay. The difference is that a Layer 3 switch also contains hardware routing logic so it can act as the default gateway (via Switch Virtual Interfaces, SVIs) between internal campus VLANs much faster than sending all inter-VLAN traffic up to a WAN router.',
        'At the network perimeter, a **Next-Generation Firewall (NGFW)** goes far beyond simple port-blocking Access Control Lists (ACLs). An NGFW tracks connection state (**stateful inspection**), identifies exact applications (e.g., permitting Salesforce while blocking BitTorrent on port 443), inspects TLS-encrypted streams, and often integrates an **Intrusion Prevention System (IPS)** that actively drops exploit signatures inline.',
        'On the wireless side, enterprise deployments rarely configure 80 ceiling **Access Points (APs)** one by one. Instead, lightweight APs handle real-time RF radio signals while a **Wireless LAN Controller (WLC)** pushes SSIDs, security profiles, channel plans, and transmit power across all APs from one central dashboard.',
      ],
    },

    deepDive: {
      intro:
        'Compare each CCNA 1.1 hardware category by OSI layer, forwarding table, and primary enterprise placement.',
      steps: [
        {
          step: '1. Layer 2 Switch',
          title: 'Access-Layer Wire-Speed Frame Forwarding',
          explanation:
            'Connects endpoints (PCs, printers, APs, VoIP phones) in one or more VLANs. Uses CAM/MAC tables at Layer 2 and supplies Power over Ethernet (PoE/PoE+) over copper Cat5e/Cat6 cables.',
        },
        {
          step: '2. Layer 3 Switch & Router',
          title: 'Inter-VLAN Routing vs. WAN / Edge Routing',
          explanation:
            'Layer 3 switches route high-speed internal campus VLANs via SVIs and routed ports. Dedicated routers connect WAN circuits (MPLS, broadband, ISP BGP), terminate VPNs/NAT, and handle deep WAN queuing.',
        },
        {
          step: '3. NGFW & IPS',
          title: 'Stateful Inspection, Application Awareness & Active Threat Blocking',
          explanation:
            'Firewalls enforce security zones (Inside, DMZ, Outside) via stateful session tables. An IPS sits **inline** to inspect packet payloads against attack signatures and drop malicious traffic in real time (unlike passive IDS, which only alerts).',
        },
        {
          step: '4. APs, WLCs & Endpoints',
          title: 'Wireless Edge & Client Devices',
          explanation:
            'APs bridge 802.11 Wi-Fi radio frames onto wired Ethernet; WLCs manage AP configuration/roaming centrally; endpoints originate and consume traffic.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Where Each CCNA v1.1 Component Sits in a Campus Network',
        asciiFallback: `[Endpoints: PC, VoIP, IoT] ---> [L2 Access Switch (PoE)] ---> [L3 Distribution/Core Switch]
     ^                                                                 |
     | (Wi-Fi 802.11)                                                  v
[Lightweight AP] <---- Control/CAPWAP ---- [WLC]              [Edge Router (NAT/WAN)]
                                                                       |
                                                                       v
                                                              [NGFW + Inline IPS] ---> [Internet / WAN]`,
      },
      workedExample: {
        title: 'Placing Devices Correctly for a 200-User Campus',
        context:
          'A company has 4 VLANs (Staff, Voice, Guest, Servers), 15 ceiling APs, and a 1 Gbps fiber ISP line.',
        steps: [
          'Desk phones and 15 APs plug into PoE-capable **L2 Access Switches** so power and data ride one Cat6 cable.',
          'Internal traffic between Staff VLAN and Server VLAN routes on the **L3 Distribution Switch** at wire speed.',
          'The **WLC** pushes Corporate WPA2-Enterprise and isolated Guest SSIDs to all 15 APs.',
          'All traffic bound for the ISP fiber passes through the **NGFW/IPS** and **Edge Router** for NAT, VPN, and signature inspection.',
        ],
        outcome: 'Every appliance handles the exact OSI layer it was built for without bottlenecking internal traffic.',
      },
    },

    iosCliGuide: {
      intro: 'Verify hardware platform capabilities, PoE delivery, and routing/switching modes directly from Cisco IOS.',
      commands: [
        {
          title: 'Verify Hardware Platform & PoE Power Delivery on an Access Switch',
          promptAndCommand: 'SW1# show power inline',
          output: `Module   Available     Used     Remaining
          (Watts)     (Watts)    (Watts)
------   ---------   --------   ---------
1           370.0      46.2       323.8
Interface Admin  Oper       Power   Device              Class Max
                            (Watts)
--------- ------ ---------- ------- ------------------- ----- ----
Gi1/0/1   auto   on         15.4    AIR-AP2802I         3     30.0
Gi1/0/2   auto   on          7.0    IP Phone 8841       2     15.4`,
          lineByLine: [
            { segment: 'Available / Remaining (370W / 323.8W)', meaning: 'Total switch PoE budget minus power drawn by connected APs and VoIP phones.' },
            { segment: 'AIR-AP2802I (15.4W)', meaning: 'Access Point powered directly over Ethernet cable without a wall AC brick.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip route',
        healthyLabel: 'L3 Switch Routing Enabled (`ip routing`)',
        healthyOutput: `Gateway of last resort is 10.0.0.1 to network 0.0.0.0
C    10.10.10.0/24 is directly connected, Vlan10
C    10.10.20.0/24 is directly connected, Vlan20`,
        brokenLabel: 'L3 Switch Running as L2-Only (`no ip routing`)',
        brokenOutput: `Default gateway is 10.10.10.1
Host               Gateway           Last Use    Total Uses  Interface
ICMP redirect cache is empty`,
        diagnosis:
          'When `ip routing` is disabled on a multilayer switch, `show ip route` displays a simple default-gateway table instead of a full routing table, preventing inter-VLAN routing.',
      },
    },

    commonTraps: [
      {
        trap: 'Confusing IDS (Intrusion Detection System) with IPS (Intrusion Prevention System).',
        reality: 'IDS sits out-of-band on a mirrored port and only alerts; IPS sits **inline** in the forwarding path and actively drops malicious packets.',
      },
      {
        trap: 'Assuming a Layer 2 switch can filter applications like YouTube or inspect TLS payloads.',
        reality: 'Deep application control and threat inspection require an NGFW/IPS at Layer 4–7.',
      },
      {
        trap: 'Forgetting that WLCs do not broadcast RF signals themselves.',
        reality: 'Access Points transmit Wi-Fi radio waves; the WLC orchestrates policies, security, and roaming centrally.',
      },
      {
        trap: 'Assuming every router port supplies Power over Ethernet (PoE).',
        reality: 'Standard switch access ports provide PoE/PoE+ to APs, cameras, and VoIP phones; WAN routers normally do not.',
      },
    ],

    keyTerms: [
      {
        term: 'Next-Generation Firewall (NGFW)',
        shortDef: 'Stateful firewall adding Layer 7 application control, user identity, and threat inspection.',
        fullDef: 'Goes beyond Layer 3/4 ACLs by tracking active flows, identifying applications regardless of port, and integrating URL/IPS defense.',
      },
      {
        term: 'Intrusion Prevention System (IPS)',
        shortDef: 'Inline security engine that detects and drops attack traffic in real time.',
        fullDef: 'Inspects packet payloads against vulnerability signatures and behavioral baselines, blocking exploits before they reach targets.',
      },
      {
        term: 'Wireless LAN Controller (WLC)',
        shortDef: 'Centralized appliance managing enterprise Access Points, SSIDs, RF channels, and roaming.',
        fullDef: 'Eliminates per-AP standalone management by tunneling/coordinating lightweight APs via CAPWAP.',
      },
      {
        term: 'Layer 3 Switch',
        shortDef: 'Multilayer switch performing both MAC-based L2 switching and ASIC-accelerated IP routing.',
        fullDef: 'Routes between local campus VLANs at wire speed via Switch Virtual Interfaces (SVIs).',
      },
    ],

    checkQuestions: [
      {
        id: 'v11-11-q1',
        prompt: 'Which security component sits inline in the traffic path and actively drops exploit payloads matching known attack signatures?',
        options: ['IPS', 'Passive IDS', 'Layer 2 Switch', 'WLC'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: An Intrusion Prevention System (IPS) operates inline and actively blocks malicious packets.',
          'Incorrect: A passive IDS receives mirrored copies (SPAN) and alerts only without dropping live packets.',
          'Incorrect: A Layer 2 switch forwards Ethernet frames by MAC without payload threat inspection.',
          'Incorrect: A WLC manages wireless access points.',
        ],
        takeaway: 'IPS = Inline and Prevents (drops); IDS = Passive and Detects (alerts).',
      },
      {
        id: 'v11-11-q2',
        prompt: 'An organization wants 40 ceiling wireless radios to share seamless roaming, unified WPA2-Enterprise policies, and automatic channel adjustments from one dashboard. Which pair of components fulfills this?',
        options: [
          'Lightweight Access Points managed by a Wireless LAN Controller (WLC)',
          '40 standalone home routers chained together',
          'A single Layer 2 switch with PoE disabled',
          'An IPS without any radios',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Lightweight APs handle RF signals while the WLC centrally enforces SSIDs, security, and RF tuning.',
          'Incorrect: Standalone routers lack centralized roaming and create separate NAT islands.',
          'Incorrect: Switches provide wired ports and PoE, not 802.11 wireless RF.',
          'Incorrect: An IPS inspects traffic; it is not a wireless radio.',
        ],
        takeaway: 'Lightweight APs + WLC provide scalable centralized enterprise Wi-Fi.',
      },
      {
        id: 'v11-11-q3',
        prompt: 'What key feature separates a Layer 3 multilayer switch from a standard Layer 2 access switch?',
        options: [
          'Hardware-accelerated IP routing between local VLANs (SVIs) in addition to MAC forwarding',
          'Replacing Ethernet cables with analog phone lines',
          'Acting as an ISP BGP internet core router with no MAC table',
          'Providing cellular 5G radios',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Layer 3 switches support `ip routing` and SVIs to route between campus VLANs at ASIC speed.',
          'Incorrect: Both use Ethernet copper/fiber.',
          'Incorrect: L3 switches maintain full MAC tables for L2 switching alongside L3 routing.',
          'Incorrect: Cellular uplinks belong on WAN routers/extenders.',
        ],
        takeaway: 'Layer 3 switches combine wire-speed L2 switching with high-speed inter-VLAN IP routing.',
      },
      {
        id: 'v11-11-q4',
        prompt: 'What does a Next-Generation Firewall (NGFW) add beyond a basic router ACL?',
        options: [
          'Stateful session tracking, Layer 7 application visibility, and integrated threat inspection',
          'Only static ARP entries',
          'Higher PoE wattage on copper ports',
          'Replacing MAC addresses with IPv6 addresses',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: NGFWs track session state and inspect up through Layer 7 applications.',
          'Incorrect: ARP is a Layer 2/3 address resolution protocol.',
          'Incorrect: PoE comes from access switches.',
          'Incorrect: Firewalls enforce security policy, not MAC-to-IPv6 replacement.',
        ],
        takeaway: 'Router ACLs filter L3/L4 headers statelessly; NGFWs track state and inspect L7 apps.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect Router & Switch Roles in IOS Labs 01 & 02',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 02 (VLANs & 802.1Q Trunking) and compare `show mac address-table` on switches against `show ip route` on routers.',
      ],
      verificationCheck: 'Identify L2 MAC forwarding entries vs. L3 IP routing entries.',
    },

    summaryBullets: [
      'Endpoints generate and consume data; servers host shared applications.',
      'Layer 2 switches forward frames locally by MAC and supply PoE; Layer 3 switches add ASIC-accelerated inter-VLAN routing.',
      'Routers interconnect distinct IP/WAN networks and handle NAT/VPN uplinks.',
      'NGFWs enforce stateful Layer 7 application policy; inline IPS drops exploit payloads.',
      'Lightweight APs deliver Wi-Fi RF while WLCs centrally orchestrate wireless policy and roaming.',
    ],

    sourcesToVerify: [
      'Cisco CCNA 200-301 v1.1 Exam Topics — Domain 1.1 Network Components',
      'Cisco Press — CCNA 200-301 Official Cert Guide, Volume 1',
    ],
  },

  'ccna.v11.1.2': {
    id: 'ccna.v11.1.2',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Fundamentals',
    topicTitle: '1.2 Topology Architectures',
    code: '1.2.1',
    title: 'Two-Tier, Three-Tier, Spine-Leaf, WAN, SOHO & On-Prem vs Cloud',
    readMinutes: 11,
    prerequisites: ['1.1.1'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['1.2 Describe characteristics of network topology architectures'],

    learningObjectives: [
      'Compare Cisco three-tier (Core, Distribution, Access) and two-tier (Collapsed Core) campus designs.',
      'Explain why data centers adopt Spine-Leaf topologies for predictable East-West traffic latency.',
      'Distinguish WAN architectures, Small Office/Home Office (SOHO) setups, and on-premises vs. cloud models (IaaS/PaaS/SaaS).',
      'Recommend the best topology architecture based on campus scale, traffic flow (North-South vs. East-West), and budget.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Data Center Full of Virtual Machines Chokes on a Traditional Campus Tree',
      narrative:
        'A traditional three-tier campus design works brilliantly when 90% of traffic travels North-South—from a user’s desk laptop up to an external server or the internet. Inside a modern data center, however, web servers talk sideways to database servers and storage arrays (**East-West traffic**) constantly. Spanning Tree blocks half the redundant links in a hierarchical tree, wasting expensive 40G/100G fiber. Understanding Spine-Leaf vs. Two/Three-Tier lets you pick the right architecture immediately.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a State Highway Hierarchy vs. a Direct City Grid',
      analogy:
        'A **Three-Tier Campus** resembles roads from neighborhoods (**Access switches**) feeding into regional expressways (**Distribution switches**), which connect onto a massive cross-country interstate (**Core switches**). In a smaller town (**Two-Tier / Collapsed Core**), the regional expressway and interstate merge into one combined hub to save cost. By contrast, a data center **Spine-Leaf** topology works like a direct subway transfer grid: every Leaf station connects straight to EVERY Spine hub using active Layer 3 ECMP paths—so traveling between ANY two servers takes the exact same two hops every time with zero blocked cables.',
      technicalDefinition:
        'Campus hierarchical designs segment ports (Access), policy/routing boundaries (Distribution), and ultra-fast backbone transport (Core), whereas Data Center Spine-Leaf architectures implement a full-mesh Layer 3 Clos fabric where every Leaf connects to every Spine for deterministic hop count and East-West bandwidth scaling.',
      paragraphs: [
        'In a **Three-Tier Campus**, the **Access Layer** connects end hosts (PoE, VLANs, PortFast, port security). The **Distribution Layer** aggregates access switches, sets Layer 3 routing/ACL boundaries, and runs FHRP (HSRP/VRRP) gateways. The **Core Layer** provides non-stop, ultra-fast packet switching with zero ACLs or heavy CPU policies so traffic never slows down.',
        'When a building does not have thousands of users, merging Distribution and Core into a **Two-Tier (Collapsed Core)** design cuts hardware cost, rack space, and hop latency while keeping clean redundancy.',
        'For **On-Premises vs. Cloud**: On-prem gives total hardware control with higher upfront CapEx; **Cloud** shifts to OpEx elasticity across **IaaS** (rent virtual machines/networks), **PaaS** (rent app runtimes/databases), and **SaaS** (rent ready-made apps like Microsoft 365).',
      ],
    },

    deepDive: {
      intro: 'Review the structural rules of Campus Two/Three-Tier, Spine-Leaf, WAN/SOHO, and Cloud placement.',
      steps: [
        {
          step: '1. Three-Tier Campus',
          title: 'Access + Distribution + Core',
          explanation: 'Best for large multi-building enterprises needing a dedicated high-speed backbone connecting separate distribution blocks.',
        },
        {
          step: '2. Two-Tier (Collapsed Core)',
          title: 'Access + Combined Core/Distribution',
          explanation: 'Standard choice for single-building or mid-size campuses—full dual-link redundancy without an extra core layer.',
        },
        {
          step: '3. Spine-Leaf Fabric',
          title: 'Predictable East-West Data Center Scaling',
          explanation: 'Every Leaf switch connects to every Spine switch; Leaves never connect directly to other Leaves, and Spines never connect to other Spines. Always exactly 2 hops (`Leaf -> Spine -> Leaf`) using Layer 3 Equal-Cost Multi-Path (ECMP)!',
        },
        {
          step: '4. WAN, SOHO & Cloud',
          title: 'Branch Interconnects & Service Delivery',
          explanation: 'WAN links connect distant sites (MPLS, broadband IPsec VPN, SD-WAN); SOHO integrates router + switch + AP into one compact box; Cloud places workloads off-site.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Collapsed Core Campus vs. Data Center Spine-Leaf Fabric',
        asciiFallback: `TWO-TIER (COLLAPSED CORE)                 DATA CENTER SPINE-LEAF (2-HOP ECMP)
  [Core/Dist A] === [Core/Dist B]           [Spine 1]          [Spine 2]
     |      \\         /     |                |    \\             /    |
     |       \\       /      |                |     \\   (Mesh)  /     |
  [Access 1]   [Access 2]                   [Leaf 1] [Leaf 2] [Leaf 3]
  (PCs/APs)    (VoIP/IoT)                    (Srv A)  (Srv B)  (Srv C)`,
      },
      workedExample: {
        title: 'Matching Four Sites to the Right Architecture',
        context: 'You are advising four business units on topology upgrades.',
        steps: [
          'Unit 1: 8-person remote sales office -> **SOHO** all-in-one router/firewall + integrated Wi-Fi.',
          'Unit 2: Single 4-story HQ with 400 employees -> **Two-Tier Collapsed Core** (Access closets wired to dual Distribution/Core L3 switches).',
          'Unit 3: University with 12 buildings -> **Three-Tier** (each building has Distribution switches feeding a central campus Core).',
          'Unit 4: Private virtualization cluster running 600 microservices -> **Spine-Leaf** for flat 2-hop East-West latency.',
        ],
        outcome: 'Architecture matches scale and traffic pattern instead of overbuilding or under-provisioning.',
      },
    },

    iosCliGuide: {
      intro: 'Verify redundant dual-uplink aggregation and equal-cost Layer 3 paths used in Collapsed Core and Spine-Leaf architectures.',
      commands: [
        {
          title: 'Verify Redundant Dual Equal-Cost Uplinks in the Routing Table',
          promptAndCommand: 'LEAF1# show ip route 10.50.2.0',
          output: `Routing entry for 10.50.2.0/24
  Known via "ospf 1", distance 110, metric 2, type intra area
  Routing Descriptor Blocks:
  * 172.16.1.1, from 1.1.1.1, 00:45:12 ago, via GigabitEthernet0/1
      Route metric is 2, traffic share count is 1
    172.16.2.1, from 2.2.2.2, 00:45:12 ago, via GigabitEthernet0/2
      Route metric is 2, traffic share count is 1`,
          lineByLine: [
            { segment: 'Two identical metric paths', meaning: 'Leaf 1 load-balances East-West flows simultaneously across both Spines via ECMP.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show spanning-tree vlan 10',
        healthyLabel: 'Collapsed Core with L3 Distribution Boundary',
        healthyOutput: `VLAN0010
  Root ID    Priority    24586 (Distribution Switch A)`,
        brokenLabel: 'Uncontrolled Flat L2 Loops Blocking Uplinks',
        brokenOutput: `Gi0/2        Altn BLK 4         128.2`,
        diagnosis:
          'When Spanning Tree holds half of your core fiber uplinks in `BLK`, moving to Layer 3 ECMP (or LACP EtherChannel) unlocks full active-active bandwidth.',
      },
    },

    commonTraps: [
      {
        trap: 'Connecting Spine switches directly to other Spine switches or Leaf switches directly to other Leaf switches.',
        reality: 'Classic Spine-Leaf rules forbid Spine-to-Spine and Leaf-to-Leaf links so every cross-leaf flow stays deterministically 2 hops (`Leaf -> Spine -> Leaf`).',
      },
      {
        trap: 'Putting heavy ACLs and NAT policies on the Core layer of a Three-Tier campus.',
        reality: 'Policy belongs at the Distribution/Access edge; the Core layer exists strictly for uninterrupted speed.',
      },
      {
        trap: 'Calling a remote branch office with 5 employees a Three-Tier architecture.',
        reality: 'Small single-room branches fit SOHO or single-tier flat topologies.',
      },
      {
        trap: 'Assuming Cloud means zero network engineering.',
        reality: 'In IaaS cloud deployments, you still architect VPC subnets, route tables, security groups, and site-to-site VPNs.',
      },
    ],

    keyTerms: [
      {
        term: 'Collapsed Core (Two-Tier)',
        shortDef: 'Campus topology combining Distribution and Core layers into one redundant pair of L3 switches.',
        fullDef: 'Reduces cost and hops for small-to-medium campuses while preserving dual-homed redundancy.',
      },
      {
        term: 'Spine-Leaf',
        shortDef: 'Data center Clos topology where every Leaf switch connects to every Spine switch.',
        fullDef: 'Eliminates STP-blocked uplinks and delivers predictable two-hop East-West latency via Layer 3 ECMP.',
      },
      {
        term: 'East-West Traffic',
        shortDef: 'Server-to-server traffic moving horizontally inside a data center.',
        fullDef: 'Dominates virtualized and microservice clusters, driving Spine-Leaf adoption over North-South trees.',
      },
      {
        term: 'SOHO',
        shortDef: 'Small Office / Home Office network combining router, switch, firewall, and Wi-Fi AP.',
        fullDef: 'Compact single-box topology tailored for home workers or micro-branches.',
      },
    ],

    checkQuestions: [
      {
        id: 'v11-12-q1',
        prompt: 'Why does a modern data center running virtualized East-West workloads prefer a Spine-Leaf topology over a Three-Tier STP hierarchy?',
        options: [
          'Every Leaf connects to every Spine using active ECMP paths, giving predictable low latency without blocked redundant links.',
          'Spine-Leaf disables all IP routing and uses only Layer 1 hubs.',
          'Spine-Leaf reduces cable counts by chaining all racks in one single daisy chain.',
          'Three-Tier topologies cannot pass IPv4 traffic.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Spine-Leaf ensures deterministic 2-hop Leaf-to-Leaf paths and utilizes every parallel uplink actively.',
          'Incorrect: Spine-Leaf heavily relies on Layer 3 routing (ECMP).',
          'Incorrect: Daisy-chaining creates bottlenecks and single points of failure.',
          'Incorrect: Three-Tier handles IPv4 fine, just with less predictable East-West scaling when STP blocks links.',
        ],
        takeaway: 'Spine-Leaf = deterministic 2-hop East-West scaling across active ECMP links.',
      },
      {
        id: 'v11-12-q2',
        prompt: 'Which two layers are merged together in a Cisco Two-Tier (Collapsed Core) campus design?',
        options: [
          'Distribution and Core',
          'Access and WAN',
          'Access and Distribution',
          'Spine and SOHO',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Collapsed Core merges Distribution and Core functions into one redundant L3 tier above Access switches.',
          'Incorrect: Access remains the edge port tier for endpoints.',
          'Incorrect: Access switches still plug endpoints in separately.',
          'Incorrect: Spine belongs to data center fabrics.',
        ],
        takeaway: 'Two-Tier = Access + Collapsed Core (Distribution/Core combined).',
      },
      {
        id: 'v11-12-q3',
        prompt: 'In a Three-Tier campus architecture, which layer handles PoE desk ports, VLAN assignment, and Port Security?',
        options: ['Access Layer', 'Core Layer', 'Distribution Layer', 'Cloud SaaS Layer'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The Access layer directly connects user PCs, phones, and APs.',
          'Incorrect: The Core layer must stay pure speed without edge port features.',
          'Incorrect: Distribution aggregates Access uplinks and enforces L3 routing/ACLs.',
          'Incorrect: SaaS is cloud software.',
        ],
        takeaway: 'Access = endpoint edge; Distribution = policy/L3 boundary; Core = ultra-fast backbone.',
      },
      {
        id: 'v11-12-q4',
        prompt: 'A company rents raw virtual machines, virtual networks, and block storage from a cloud provider while managing the OS and apps themselves. Which cloud model is this?',
        options: ['IaaS (Infrastructure as a Service)', 'SaaS (Software as a Service)', 'On-Premises Core', 'SOHO'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IaaS provides virtual compute, storage, and networking while the customer manages OS and software.',
          'Incorrect: SaaS delivers complete hosted applications (like Microsoft 365) with no OS management.',
          'Incorrect: On-premises runs on customer-owned hardware.',
          'Incorrect: SOHO is a small office physical layout.',
        ],
        takeaway: 'IaaS = rent VMs/nets; PaaS = rent app platform; SaaS = rent complete software.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Explore Access-to-Core Topology Links in IOS Lab 02 & 03',
      targetTab: 'labs',
      instructions: [
        'Open IOS Labs -> Lab 03 (LACP EtherChannel & Inter-VLAN Routing) and trace how bundled access uplinks feed a Collapsed Core Layer 3 switch/router.',
      ],
      verificationCheck: 'Verify bundled redundant uplinks are forwarding without STP blocking.',
    },

    summaryBullets: [
      'Three-Tier campus = Access (endpoints), Distribution (L3 policy/aggregation), Core (pure backbone speed).',
      'Two-Tier (Collapsed Core) merges Distribution + Core for mid-size campuses.',
      'Spine-Leaf connects every Leaf to every Spine (never Leaf-Leaf or Spine-Spine) for flat East-West ECMP scaling.',
      'WAN connects distant sites; SOHO combines everything into one box for small branches.',
      'Cloud models split responsibility cleanly across On-Premises, IaaS, PaaS, and SaaS.',
    ],

    sourcesToVerify: [
      'Cisco Validated Designs — Campus LAN and Wireless LAN Design Guide',
      'Cisco CCNA 200-301 v1.1 Exam Topics — Domain 1.2 Topology Architectures',
    ],
  },

  'ccna.core.net.cabling-interfaces': {
    id: 'ccna.core.net.cabling-interfaces',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Infrastructure & Cabling',
    topicTitle: '1.1 / 1.3–1.4 Physical Interfaces, Cabling & Diagnostics',
    code: '1.1.1',
    title: 'Copper (UTP/PoE), Fiber (SMF vs MMF), Pinouts & Interface Error Diagnostics',
    readMinutes: 13,
    prerequisites: ['0.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['1.3', '1.4'],
    v20ExamTopics: ['1.1'],

    learningObjectives: [
      'Compare Single-Mode Fiber (SMF) and Multi-Mode Fiber (MMF) by core diameter, light source, distance, and SFP optic types.',
      'Explain copper UTP standards (Cat5e/Cat6/Cat6a 100m max), PoE/PoE+ power delivery, and T568A/B straight-through vs. crossover wiring + Auto-MDIX.',
      'Diagnose `show interfaces` counters (`runts`, `giants`, `CRC`, `collisions`, `late collisions`, `duplex mismatch`) accurately.',
      'Interpret SFP optical transceiver light levels (`Rx/Tx dBm`) and speed/duplex mismatches on live IOS links.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Fiber Uplink Between Buildings Flaps Every Afternoon',
      narrative:
        'A facility technician connects two buildings 1,800 meters apart using orange Multi-Mode patch cords plugged into Single-Mode optics because "the LC connectors fit." Or a desktop runs sluggishly at 10% throughput because someone forced `100/full` on the switch port while the PC stayed on auto-negotiation. Knowing physical specs and `show interfaces` error counters turns mystery slowdowns into a 30-second physical diagnosis.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Copper Pipes vs. Laser Fiber Highways (and Two-Way Traffic Lanes)',
      analogy:
        '**Copper UTP** (Unshielded Twisted Pair) sends electrical signals down twisted wire pairs—great up to **100 meters**, affordable, and able to carry **PoE** power, yet vulnerable to electrical interference (EMI). **Fiber-optic cable** carries pulses of light through ultra-pure glass, immune to EMI: **Multi-Mode Fiber (MMF)** uses wider glass (`50/62.5 µm`) and inexpensive LEDs/VCSELs where multiple light paths bounce over short campus runs (300–550m), while **Single-Mode Fiber (SMF)** uses a microscopic `9 µm` glass core and precision lasers shooting straight down the center for kilometers across cities. Meanwhile, **Duplex** governs lane direction: **Half-duplex** is a single-lane bridge controlled by walkie-talkies (CSMA/CD, collisions happen); **Full-duplex** is a divided two-lane highway where both sides transmit and receive simultaneously with zero collisions.',
      technicalDefinition:
        'Physical Layer (Layer 1) Ethernet links operate over UTP copper (100m limit; straight-through/crossover mitigated by Auto-MDIX) or SMF/MMF fiber optics, reporting physical health, speed/duplex negotiation, optical dBm levels, and frame integrity via IOS interface error counters.',
      paragraphs: [
        'On copper links (`1000BASE-T`, `10GBASE-T`), twisting pairs together cancels out electromagnetic crosstalk. Standard Ethernet cables run up to **100 meters** total (90m horizontal structured cable + 10m patch cords). **Straight-through** cables connect unlike devices (PC to Switch, Router to Switch), while **Crossover** cables swap TX/RX pairs (1-2 to 3-6) for like devices—though Gigabit Ethernet and modern Cisco switches use **Auto-MDIX** to auto-correct polarity.',
        'On fiber links, **MMF** (commonly aqua OM3/OM4 or orange OM1/OM2 jackets) supports short intra-building distances up to ~300–550m at 1G/10G, whereas **SMF** (yellow jacket) supports 10 km to 80+ km links. Always match **SMF optics (LX/LR)** to SMF glass and **MMF optics (SX/SR)** to MMF glass!',
        'The single most common Layer 1/2 bug on Cisco IOS is a **Duplex Mismatch**: if one side is hard-coded `full` duplex and the other stays on `auto`, auto-negotiation falls back to **half-duplex**! The half-duplex side logs **late collisions**, while the full-duplex side logs **FCS/CRC** and **input errors**.',
      ],
    },

    deepDive: {
      intro: 'Use this physical media comparison and IOS interface counter diagnostic matrix.',
      steps: [
        {
          step: 'Copper UTP (Cat5e/6/6a)',
          title: '100m Max Distance + PoE Support',
          explanation:
            'Cat5e = 1 Gbps (100m); Cat6 = 1 Gbps (100m) / 10 Gbps (55m); Cat6a = 10 Gbps (100m). Delivers PoE (802.3af 15.4W), PoE+ (802.3at 30W), and UPOE (60W).',
        },
        {
          step: 'Fiber (MMF vs SMF)',
          title: 'Short High-Density vs Long-Haul Laser',
          explanation:
            'MMF (`SX/SR`, 850nm, 50/62.5 µm core, up to ~300-550m) for server rooms/risers; SMF (`LX/LR`, 1310/1550nm, 9 µm core, 10+ km) for building-to-building and WAN.',
        },
        {
          step: 'Interface Error Counters',
          title: 'What Runts, Giants, CRC & Collisions Mean',
          explanation:
            '**Runts**: frames < 64 bytes (often duplex collision fragments). **Giants**: frames > 1518 bytes (MTU mismatch without jumbo frames). **CRC/FCS errors**: damaged copper cable, dirty fiber end-face, or duplex mismatch. **Late collisions**: collision after 512 bits -> classic duplex mismatch or >100m cable!',
        },
        {
          step: 'Optical Signal Levels (v2.0 1.1)',
          title: 'Checking `show interfaces transceiver` dBm',
          explanation:
            'Healthy SFP Rx optical power typically reads around `-1 dBm` to `-10 dBm`. Values like `-28 dBm` or `-40 dBm` indicate a dirty fiber connector, tight bend radius, or failing SFP laser.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Duplex Mismatch & Fiber Signal Diagnostic Signatures',
        asciiFallback: `DUPLEX MISMATCH SIGNATURE:
[Switch Gi0/1: Hard-coded 100/FULL] <=====> [Host NIC: Auto -> falls back 100/HALF]
  Logs: Input errors, CRC / FCS errors         Logs: Late collisions (transmits while SW talks!)

FIBER QUICK MATCH:
  MMF (Aqua/Orange, 50/62.5um, LED/VCSEL) <-> 1000BASE-SX / 10GBASE-SR (Short <=550m)
  SMF (Yellow, 9um, Precision Laser)      <-> 1000BASE-LX / 10GBASE-LR (Long 10km+)`,
      },
      workedExample: {
        title: 'Diagnosing a Slow File Server Port with `show interfaces`',
        context:
          'Users report 2 Mbps file transfers on a 1 Gbps switch port `Gi0/12`.',
        steps: [
          'Run `show interfaces Gi0/12`: output displays `Full-duplex, 100Mb/s`, along with `14,820 input errors, 14,812 CRC`.',
          'Check server NIC settings: server was left on `Auto`, failed duplex negotiation against a forced `duplex full` switch port, and fell back to `100/Half`!',
          'Configure `speed auto` and `duplex auto` on `Gi0/12` (or hardcode matching `1000/full` only where appropriate, though Gigabit copper requires auto-negotiation per IEEE 802.3ab).',
          'Clear counters (`clear counters Gi0/12`) and verify throughput jumps cleanly to ~940 Mbps with `0 CRC`.',
        ],
        outcome: 'CRC errors stop immediately once both ends negotiate `Full-duplex, 1000Mb/s`.',
      },
    },

    iosCliGuide: {
      intro: 'Inspect duplex/speed status, physical error counters, and SFP optical power in Cisco IOS.',
      commands: [
        {
          title: '1. Inspect Duplex, Speed & Error Counters',
          promptAndCommand: 'SW1# show interfaces GigabitEthernet0/12',
          output: `GigabitEthernet0/12 is up, line protocol is up (connected)
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX
     512840 packets input, 409281102 bytes, 0 no buffer
     0 runts, 0 giants, 0 throttles
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
     0 output errors, 0 collisions, 0 interface resets`,
          lineByLine: [
            { segment: 'Full-duplex, 1000Mb/s', meaning: 'Matched Gigabit speed and full-duplex operation.' },
            { segment: '0 runts, 0 giants, 0 CRC', meaning: 'Clean physical signal with zero frame truncation or corruption.' },
            { segment: '0 collisions', meaning: 'Full-duplex operation eliminates Ethernet collisions.' },
          ],
        },
        {
          title: '2. Inspect SFP Optical Signal Levels (DOM)',
          promptAndCommand: 'SW1# show interfaces Te1/0/1 transceiver detail',
          output: `Port      Temp    Voltage Current Optical Tx Optical Rx
          (C)     (Volts) (mA)    Power(dBm) Power(dBm)
Te1/0/1   34.2    3.29    18.4    -2.3       -3.1
  High Alarm: -1.0 dBm | Low Alarm: -18.0 dBm`,
          lineByLine: [
            { segment: 'show interfaces <port> transceiver detail', meaning: 'Displays live optical Tx/Rx dBm alongside high/low alarm and warning thresholds.' },
            { segment: 'Optical Rx Power (-3.1 dBm)', meaning: 'Strong clean light signal received from the far fiber optic transceiver.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show interfaces status',
        healthyLabel: 'Auto-Negotiated Gigabit Full-Duplex',
        healthyOutput: `Port      Name       Status       Vlan       Duplex  Speed Type
Gi0/12    SRV-01     connected    10         a-full a-1000 10/100/1000BaseTX`,
        brokenLabel: 'Forced Full on Switch Causing Duplex Mismatch (`full` vs `a-half`)',
        brokenOutput: `Port      Name       Status       Vlan       Duplex  Speed Type
Gi0/12    SRV-01     connected    10           full    100 10/100/1000BaseTX`,
        diagnosis:
          'Notice `a-full` (`a-` = auto-negotiated) vs bare `full` (manually forced). When one end forces `100/full` while the peer runs `auto`, the peer falls back to `half` duplex—fix by setting `speed auto` and `duplex auto` on both ends.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming a `full` duplex switch port causes collisions on BOTH sides.',
        reality: 'The forced `full` side reports **CRC/input errors**, while the `half`-duplex peer reports **late collisions**.',
      },
      {
        trap: 'Plugging Multi-Mode fiber patch cords into Single-Mode SFPs across a long campus run.',
        reality: 'Even though LC connectors physically fit, modal dispersion or core mismatch causes massive signal attenuation and packet loss.',
      },
      {
        trap: 'Exceeding the 100-meter Cat5e/Cat6 Ethernet distance limit.',
        reality: 'Long runs weaken electrical signals and distort timing, raising CRC errors and late collisions.',
      },
      {
        trap: 'Confusing `runts` with `giants`.',
        reality: 'Runts are undersized frames (<64 bytes); giants are oversized frames (>1518 bytes without 802.1Q/jumbo support).',
      },
    ],

    keyTerms: [
      {
        term: 'Single-Mode Fiber (SMF)',
        shortDef: '9-micron core laser fiber supporting multi-kilometer WAN and campus runs.',
        fullDef: 'Uses a single straight light path (typically yellow jacket, 1310/1550nm) with `LX/LR` optics to reach 10–80+ km.',
      },
      {
        term: 'Multi-Mode Fiber (MMF)',
        shortDef: '50/62.5-micron core fiber for short intra-building and data-center runs.',
        fullDef: 'Uses LED/VCSEL light sources (aqua/orange jacket, 850nm) with `SX/SR` optics up to ~300–550m.',
      },
      {
        term: 'Duplex Mismatch',
        shortDef: 'Fault where one link end runs Full-Duplex while the peer falls back to Half-Duplex.',
        fullDef: 'Occurs when one side hardcodes full duplex and the other uses auto-negotiation; yields severe throughput loss, CRC errors, and late collisions.',
      },
      {
        term: 'Auto-MDIX',
        shortDef: 'Automatic pinout detection eliminating manual crossover vs. straight-through cables.',
        fullDef: 'Enabled by default on modern Ethernet NICs and switches (part of 1000BASE-T specification).',
      },
    ],

    checkQuestions: [
      {
        id: 'c11-q1',
        prompt: 'Switch SW1’s `Gi0/5` is manually configured with `speed 100` and `duplex full`. Connected Server1 is left at `auto/auto`. What happens?',
        options: [
          'Server1 detects 100 Mb/s via parallel detection, falls back to half-duplex, and the link suffers a duplex mismatch (CRC errors & late collisions).',
          'Both ends automatically negotiate 1000 Mb/s full-duplex.',
          'The physical port shuts down immediately into `err-disabled`.',
          'Both ends run 100 Mb/s full-duplex cleanly.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: With auto-negotiation turned off on SW1, Server1 senses 100BASE-TX speed electrically and defaults to IEEE half-duplex fallback, creating a duplex mismatch.',
          'Incorrect: Auto-negotiation cannot complete when one side disables it.',
          'Incorrect: Duplex mismatches stay `up/up` while silently ruining performance.',
          'Incorrect: Half-duplex is the IEEE safe fallback when negotiation frames are absent.',
        ],
        takeaway: 'Never force `duplex full` on only one side; use `speed auto` and `duplex auto` on both.',
      },
      {
        id: 'c11-q2',
        prompt: 'You must link two campus buildings 2.4 kilometers apart at 10 Gbps with zero EMI vulnerability. Which physical medium and transceiver type should you choose?',
        options: [
          'Single-Mode Fiber (SMF) with 10GBASE-LR optics',
          'Multi-Mode Fiber (MMF OM3) with 10GBASE-SR optics',
          'Cat6a UTP copper cable',
          'Cat5e crossover cable',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: 2.4 km far exceeds MMF (~300–400m at 10G) and copper (100m); Single-Mode Fiber with LR optics easily reaches 10 km.',
          'Incorrect: 10GBASE-SR over OM3 MMF maxes out around 300 meters.',
          'Incorrect: UTP copper caps at 100 meters.',
          'Incorrect: Cat5e caps at 100 meters and cannot sustain 10 Gbps.',
        ],
        takeaway: 'Links beyond ~500m require Single-Mode Fiber (SMF).',
      },
      {
        id: 'c11-q3',
        prompt: 'In `show interfaces`, which counter specifically counts incoming Ethernet frames shorter than the minimum 64-byte size?',
        options: ['Runts', 'Giants', 'Throttles', 'Tx drops'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Frames under 64 bytes (usually collision fragments or failing NICs) increment `runts`.',
          'Incorrect: `Giants` are frames exceeding 1518 bytes (max MTU).',
          'Incorrect: `Throttles` count buffer slowdowns.',
          'Incorrect: `Tx drops` count outbound queue exhaustion.',
        ],
        takeaway: 'Runts < 64 bytes; Giants > 1518 bytes.',
      },
      {
        id: 'c11-q4',
        prompt: 'A fiber link between two switches shows flapping and `show interfaces transceiver` reports `Optical Rx Power: -33.5 dBm` (threshold `-18 dBm`). What is the most likely issue?',
        options: [
          'Dirty fiber connector, excessive bend, or failing far-end SFP laser causing weak optical receive signal',
          'An incompatible OSPF Area ID on the uplink',
          'A missing default gateway on the switch',
          'Wrong DNS server entry',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `-33.5 dBm` is severe optical signal loss at Layer 1—clean the fiber end-faces, inspect patch cords for tight bends, or swap the SFP.',
          'Incorrect: OSPF Area IDs operate at Layer 3 and do not weaken laser light.',
          'Incorrect: Default gateway is Layer 3.',
          'Incorrect: DNS is Layer 7.',
        ],
        takeaway: 'Check `Optical Rx/Tx Power (dBm)` when diagnosing unstable fiber uplinks.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect Physical Port Status & Speed/Duplex in IOS Lab 01 & 02',
      targetTab: 'labs',
      instructions: [
        'Run `show interfaces` on router/switch interfaces and inspect hardware address, MTU, bandwidth, and error counters.',
      ],
      verificationCheck: 'Verify `0 input errors, 0 CRC` on healthy active ports.',
    },

    summaryBullets: [
      'Copper UTP (Cat5e/6/6a) runs up to 100 meters and carries PoE/PoE+ power; Auto-MDIX removes straight/crossover guesswork.',
      'MMF (`SX/SR`, wider core) covers short intra-building links (~300–550m); SMF (`LX/LR`, 9 µm laser) covers multi-kilometer links.',
      'Duplex mismatches (`full` vs `auto`/half-fallback) produce CRC errors on the full side and late collisions on the half side.',
      '`Runts` (<64B), `Giants` (>1518B), `CRC`, and optical `dBm` readings isolate Layer 1 faults rapidly.',
      'Always keep `speed auto` and `duplex auto` consistent on both sides of Gigabit Ethernet links.',
    ],

    sourcesToVerify: [
      'Cisco Optical Transceiver Compatibility & Digital Optical Monitoring (DOM) Guides',
      'IEEE 802.3 Clause 28 & 40 — Auto-Negotiation & 1000BASE-T Standards',
    ],
  },

  'ccna.v11.1.5': {
    id: 'ccna.v11.1.5',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Fundamentals',
    topicTitle: '1.5 Compare TCP to UDP',
    code: '1.5.1',
    title: 'TCP 3-Way Handshake, Windowing & Retransmission vs UDP Best-Effort',
    readMinutes: 11,
    prerequisites: ['0.2.1'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['1.5 Compare TCP to UDP'],

    learningObjectives: [
      'Trace the TCP 3-way handshake (`SYN -> SYN-ACK -> ACK`) and 4-step graceful teardown (`FIN`).',
      'Explain how TCP achieves reliability using Sequence numbers, Acknowledgments (ACKs), Retransmission, and Flow Control (Sliding Window).',
      'Compare UDP’s 8-byte header and zero-handshake "best-effort" delivery to TCP’s 20-byte stateful overhead.',
      'Choose TCP or UDP for real applications (HTTPS/SSH/databases vs. VoIP/DNS/DHCP/SNMP/streaming).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Voice Calls Stutter Over TCP Yet File Downloads Break Over Raw UDP',
      narrative:
        'Why doesn’t a live Microsoft Teams voice call use reliable TCP so zero audio packets get lost? Because waiting for TCP to pause, retransmit a dropped syllable 200ms later, and freeze the audio stream ruins a live conversation—better to drop one tiny 20ms frame cleanly with UDP and keep talking! Conversely, dropping one byte of a banking transfer or IOS image breaks the file completely, demanding TCP. Knowing TCP vs. UDP explains firewall rules, QoS priorities, and app slowdowns.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Certified Signed Registered Mail vs. Rapid Postcards',
      analogy:
        '**TCP** works like certified registered mail with numbered pages and a signed phone call beforehand ("Hello, ready to receive?" -> "Yes, ready!" -> "Great, sending Page 1!"). If Page 4 goes missing, the sender notices no receipt arrived and re-mails Page 4, slowing down if the mailbox starts overflowing (**flow control / windowing**). **UDP** works like tossing lightweight numbered postcards straight into a mailbox without calling ahead or waiting for signatures—ultra-fast with almost zero packaging overhead, leaving recovery (if needed at all) to the application itself.',
      technicalDefinition:
        'TCP (Transmission Control Protocol, IP protocol 6, 20-byte minimum header) is a connection-oriented Layer 4 protocol guaranteeing ordered, error-checked byte delivery via handshake, sequence/ACK numbers, retransmission, and window-based flow control; UDP (User Datagram Protocol, IP protocol 17, 8-byte header) is a connectionless, low-overhead best-effort transport.',
      paragraphs: [
        'Before a single byte of application data moves over **TCP**, client and server run a **3-way handshake**: (1) Client sends **SYN** (`Seq=x`), (2) Server replies **SYN-ACK** (`Seq=y, Ack=x+1`), and (3) Client replies **ACK** (`Ack=y+1`). Both sides now agree on initial sequence numbers and **Receive Window size** (how many bytes can be sent before waiting for an acknowledgment).',
        'During transfer, **Windowing** lets TCP send multiple segments back-to-back without stopping after every single packet—shrinking the window when the receiver gets busy and growing it when buffers are free. If a segment goes missing, duplicate ACKs or a timeout trigger **retransmission**.',
        '**UDP** skips handshakes, ACKs, ordering, and windowing completely. Its header is only **8 bytes** (Source Port, Dest Port, Length, Checksum). Real-time voice/video (RTP), DHCP, TFTP, SNMP, Syslog, and standard DNS queries prefer UDP for minimal delay.',
      ],
    },

    deepDive: {
      intro: 'Compare TCP mechanics step by step against UDP and map real protocols to each transport.',
      steps: [
        {
          step: 'TCP Step 1',
          title: '3-Way Handshake (Connection Setup)',
          explanation: '`Client -> SYN` | `Server -> SYN, ACK` | `Client -> ACK`. Synchronizes sequence numbers and negotiates Maximum Segment Size (MSS) and window scale.',
        },
        {
          step: 'TCP Step 2',
          title: 'Sliding Window & Flow Control',
          explanation: 'Receiver advertises a `Window` size in bytes; sender keeps transmitting in-flight bytes up to that limit before needing updated ACKs.',
        },
        {
          step: 'TCP Step 3',
          title: 'Sequence Numbers, ACKs & Retransmission',
          explanation: 'TCP acknowledges the NEXT expected byte (`Ack = received Seq + payload length`). Missing bytes trigger retransmission; out-of-order segments are reassembled cleanly.',
        },
        {
          step: 'UDP Alternative',
          title: '8-Byte Stateless Datagram',
          explanation: 'No setup delay, no head-of-line retransmission stall, supports broadcast (`255.255.255.255` for DHCP) and multicast—ideal for real-time media and brief request/reply lookups.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'TCP 3-Way Handshake vs. Stateless UDP Transfer',
        asciiFallback: `TCP (Protocol 6 · 20B Header · Reliable)          UDP (Protocol 17 · 8B Header · Fast)
Client                      Server                Client                      Server
  | ---- SYN (Seq=100) ----> |                      | ---- UDP Datagram 1 ---> |
  | <--- SYN-ACK (Seq=500,   |                      | ---- UDP Datagram 2 ---> | (no handshake!)
  |       Ack=101) --------- |                      | <--- UDP Reply (if app) -|
  | ---- ACK (Ack=501) ----> |
  | ==== Data + Windowing == |`,
      },
      workedExample: {
        title: 'Reading a Packet Capture to Spot Why a Connection Hangs',
        context:
          'A web client fails to reach an HTTPS server (`TCP 443`). You capture traffic on the firewall.',
        steps: [
          'Client sends `TCP SYN` toward `10.50.10.20:443`.',
          'You see zero `SYN-ACK` packets returning (`SYN` retries at 1s, 2s, 4s).',
          'Contrast with a different case: `SYN` -> `SYN-ACK` -> `ACK` completes, then large data stalls with repeated `TCP Window Zero` advertisements -> receiver application buffer is overloaded (flow control issue), not a firewall block!',
        ],
        outcome: 'Understanding TCP flags (`SYN`, `ACK`, `RST`, `FIN`) isolates firewall drops from overloaded servers immediately.',
      },
    },

    iosCliGuide: {
      intro: 'IOS displays active TCP sessions and UDP sockets via `show tcp brief` and `show sockets`, plus ACL filtering via `tcp` vs `udp`.',
      commands: [
        {
          title: 'Inspect Active TCP Sessions on a Cisco Router',
          promptAndCommand: 'R1# show tcp brief',
          output: `TCB       Local Address               Foreign Address             (state)
67B21400  10.10.10.1.22               192.168.1.50.54102          ESTAB`,
          lineByLine: [
            { segment: '10.10.10.1.22', meaning: 'Router listening on local TCP port 22 (SSH server).' },
            { segment: 'ESTAB', meaning: '3-way handshake completed; stateful TCP session active.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip access-lists',
        healthyLabel: 'Correct Transport Selected per Service',
        healthyOutput: `10 permit tcp any host 10.10.5.10 eq 443
20 permit udp any host 10.10.5.20 eq 123`,
        brokenLabel: 'Blocked DHCP/NTP by Using TCP Keyword',
        brokenOutput: `10 permit tcp any host 10.10.5.20 eq 123`,
        diagnosis:
          'NTP (123), DHCP (67/68), TFTP (69), and SNMP (161/162) run exclusively over UDP. Matching `tcp` leaves those services silently blocked.',
      },
    },

    commonTraps: [
      {
        trap: 'Saying "UDP cannot be reliable at all."',
        reality: 'UDP itself is connectionless and best-effort, yet Layer 7 applications built on top (like TFTP or QUIC/HTTP3) can add their own application-level ACKs.',
      },
      {
        trap: 'Thinking TCP guarantees packets never get dropped on a bad cable.',
        reality: 'TCP cannot prevent physical drops—it detects missing sequence numbers and **retransmits** them automatically.',
      },
      {
        trap: 'Assuming TCP window size stays fixed for the whole session.',
        reality: 'TCP uses dynamic **sliding windows**—the receiver updates its window advertisement in ACKs as buffers fill or drain.',
      },
      {
        trap: 'Confusing `FIN` with `RST`.',
        reality: '`FIN` is a polite graceful close; `RST` (Reset) abruptly kills a connection (for example, hitting a closed TCP port).',
      },
    ],

    keyTerms: [
      {
        term: '3-Way Handshake',
        shortDef: 'SYN -> SYN-ACK -> ACK sequence establishing a stateful TCP session.',
        fullDef: 'Synchronizes initial sequence numbers and negotiates windowing before data flows.',
      },
      {
        term: 'Flow Control (Windowing)',
        shortDef: 'Mechanism allowing a receiver to pace how much unacknowledged data a sender transmits.',
        fullDef: 'Prevents fast senders from overwhelming slow receivers using dynamic sliding-window advertisements.',
      },
      {
        term: 'Best-Effort Delivery (UDP)',
        shortDef: 'Connectionless forwarding without handshakes, ordering, or retransmissions.',
        fullDef: 'Delivers low latency and an 8-byte header suitable for voice, video, DHCP, TFTP, and SNMP.',
      },
      {
        term: 'Sequence / ACK Numbers',
        shortDef: '32-bit counters tracking every TCP byte sent and confirming receipt.',
        fullDef: 'Enables missing-segment detection, retransmission, and in-order reassembly.',
      },
    ],

    checkQuestions: [
      {
        id: 'v11-15-q1',
        prompt: 'Which sequence of TCP flags correctly establishes a new TCP connection?',
        options: [
          'SYN -> SYN-ACK -> ACK',
          'ACK -> SYN -> FIN',
          'SYN -> ACK -> RST',
          'HELLO -> SYN -> ACK',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Client initiates with SYN, server responds with SYN-ACK, client confirms with ACK.',
          'Incorrect: ACK cannot precede SYN; FIN closes connections.',
          'Incorrect: RST aborts connections.',
          'Incorrect: HELLO is not a TCP flag.',
        ],
        takeaway: 'TCP setup = SYN -> SYN-ACK -> ACK.',
      },
      {
        id: 'v11-15-q2',
        prompt: 'Why do live VoIP audio streams (RTP) run over UDP instead of TCP?',
        options: [
          'UDP eliminates handshake overhead and avoids stalling live audio to retransmit late dropped packets.',
          'UDP has a larger 40-byte header with built-in voice encryption.',
          'UDP guarantees 100% zero packet loss on congested WAN links.',
          'Routers cannot forward TCP packets over Ethernet.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Real-time audio prefers dropping a 20ms glitch cleanly over halting playback while TCP retransmits.',
          'Incorrect: UDP has a tiny 8-byte header with no encryption.',
          'Incorrect: UDP makes zero delivery guarantees.',
          'Incorrect: Routers forward both TCP and UDP.',
        ],
        takeaway: 'Real-time voice/video chooses UDP for low latency without retransmission stalls.',
      },
      {
        id: 'v11-15-q3',
        prompt: 'How does TCP prevent a fast 10 Gbps server from overflowing the memory buffer of a slower client?',
        options: [
          'Flow control via dynamic Sliding Window advertisements',
          'Dropping the TCP header down to 8 bytes',
          'Switching automatically to UDP port 69',
          'Sending broadcast ARP requests',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The receiver advertises its remaining buffer space inside the TCP `Window` field so the sender paces transmission.',
          'Incorrect: TCP headers are at least 20 bytes.',
          'Incorrect: TCP never switches mid-stream to UDP.',
          'Incorrect: ARP resolves IP-to-MAC locally.',
        ],
        takeaway: 'TCP Windowing = receiver-driven Flow Control.',
      },
      {
        id: 'v11-15-q4',
        prompt: 'What is the minimum header size of UDP compared to TCP?',
        options: [
          'UDP = 8 bytes; TCP = 20 bytes',
          'UDP = 20 bytes; TCP = 8 bytes',
          'Both are 24 bytes',
          'UDP = 4 bytes; TCP = 64 bytes',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: UDP needs only Source Port, Dest Port, Length, and Checksum (2 bytes each = 8 bytes); TCP requires 20 bytes.',
          'Incorrect: Inverted.',
          'Incorrect: Header sizes differ significantly.',
          'Incorrect: Incorrect byte counts.',
        ],
        takeaway: 'UDP = 8B lightweight header; TCP = 20B+ stateful header.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Inspect TCP vs UDP Protocol Rules in IOS Labs & ACL Practice',
      targetTab: 'labs',
      instructions: [
        'Inspect active SSH sessions or configure extended ACLs separating TCP vs. UDP services in IOS Labs.',
      ],
      verificationCheck: 'Identify TCP (`ESTAB`) state vs. connectionless UDP services cleanly.',
    },

    summaryBullets: [
      'TCP (Protocol 6, 20B+ header) is connection-oriented and reliable via 3-way handshake, sequence/ACKs, retransmission, and windowing.',
      'UDP (Protocol 17, 8B header) is connectionless and best-effort, minimizing latency and overhead.',
      'TCP 3-way handshake order: `SYN -> SYN-ACK -> ACK`; graceful teardown uses `FIN`; abrupt abort uses `RST`.',
      'File transfers, web (HTTPS), SSH, and email use TCP; VoIP/video streams, DHCP, TFTP, SNMP, Syslog, and standard DNS queries use UDP.',
      'Windowing dynamically adjusts bytes in flight to prevent receiver buffer overflow.',
    ],

    sourcesToVerify: [
      'RFC 9293 — Transmission Control Protocol (TCP)',
      'RFC 768 — User Datagram Protocol (UDP)',
    ],
  },

  'ccna.core.ip.ipv4-subnetting': {
    id: 'ccna.core.ip.ipv4-subnetting',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Infrastructure & IPv4',
    topicTitle: '1.3 / 1.6–1.7 Troubleshoot IPv4 Addressing & Subnetting',
    code: '1.3.1',
    title: 'IPv4 Public vs Private (RFC 1918), Subnetting, VLSM & Block Sizes',
    readMinutes: 15,
    prerequisites: ['0.1.2'],
    versionScope: 'shared',
    v11ExamTopics: ['1.6', '1.7'],
    v20ExamTopics: ['1.3'],

    learningObjectives: [
      'Recognize RFC 1918 private IPv4 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and special addresses (`127.0.0.0/8`, `169.254.0.0/16`).',
      'Calculate Network ID, First Usable Host, Last Usable Host, Broadcast Address, and Usable Host Count (`2^h - 2`) for any `/prefix`.',
      'Design Variable Length Subnet Mask (VLSM) allocations from largest host requirement to smallest with zero overlap.',
      'Spot real IPv4 misconfigurations (host assigned to network/broadcast ID, wrong mask, or overlapping subnets).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Putting `.64` on a `/26` Host Port Quietly Breaks Communications',
      narrative:
        'Suppose a branch team allocates `192.168.20.0/26` subnets for two small closets. A junior tech assigns `192.168.20.64 255.255.255.192` to an IP camera and `192.168.20.63` to a printer. Neither device works—and worse, routers reject `.64` on `/26` because `.64` is the Network ID of the second subnet and `.63` is the Broadcast ID of the first! Instant mastery of block size (`256 - mask`) and VLSM catches these bugs before a single IP is ever typed.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Slicing One Pizza Into Custom Sizes Without Overlapping Crusts',
      analogy:
        'Imagine an IPv4 network (`192.168.10.0/24`) as a large 256-slice pizza. Fixed subnetting cuts it into four equal 64-slice quarters (`/26`), wasting 62 slices if a point-to-point router link only needs 2! **VLSM (Variable Length Subnet Masking)** lets you cut intelligently: give the 100-person Sales floor a half-pizza (`128` block, `/25`), give the 25-person IT team a quarter (`32` block, `/27`), and carve tiny 4-slice `/30` wedges (2 usable IPs) for router-to-router links—always cutting **largest slices first** so remaining space stays cleanly aligned on block boundaries.',
      technicalDefinition:
        'IPv4 subnetting borrows host bits into the network prefix (`/n`), creating `2^s` subnets each containing `2^h - 2` usable host addresses (reserving the all-zeros Network ID and all-ones Broadcast ID). VLSM applies differing prefix lengths across subnets of the same parent network, allocated strictly from largest host demand to smallest on power-of-two boundaries.',
      paragraphs: [
        'First, memorize the **RFC 1918 Private IPv4 Ranges** (never routable directly on the public internet, translated via NAT): **`10.0.0.0/8`** (`10.0.0.0 – 10.255.255.255`), **`172.16.0.0/12`** (`172.16.0.0 – 172.31.255.255`), and **`192.168.0.0/16`** (`192.168.0.0 – 192.168.255.255`). Also know **`127.0.0.0/8`** (loopback self-test), **`169.254.0.0/16`** (APIPA link-local when DHCP fails), and **`100.64.0.0/10`** (CGNAT shared carrier space).',
        'To subnet ANY `/25`–`/30` IPv4 address in 10 seconds, use the **Magic Number (Block Size)** in the interesting octet: **`Block Size = 256 - Subnet Mask Octet`**. For example, `/27` = `255.255.255.224` -> Block Size = `256 - 224 = 32`. Subnets step cleanly by `32`: `.0`, `.32`, `.64`, `.96`, `.128`, `.160`, `.192`, `.224`. For `/17`–`/24` masks (like `172.16.37.200/20`, mask `255.255.240.0`), apply the exact same Block Size (`256 - 240 = 16`) in the **3rd octet**: multiples `0, 16, 32, 48`, placing `.37.200` inside `172.16.32.0 – 172.16.47.255` (`4094` hosts!).',
        'Within any block `[Net .. NextNet - 1]`: **Network ID** = block start (`0`), **Broadcast ID** = `NextNet - 1` (`31`), **First Usable** = `Net + 1` (`1`), **Last Usable** = `Broadcast - 1` (`30`), and **Usable Hosts** = `2^(32 - prefix) - 2`. Watch three special masks & summarization:\n• **`/31` (RFC 3021)**: special point-to-point router mask with **2 usable host IPs** and no wasted network/broadcast IDs (`0` and `1` are both usable!).\n• **`/32` Host Route**: identifies a single exact IP (e.g., Loopback0 or IOS Local `L` route).\n• **`255.255.255.255`**: Limited Broadcast (stays strictly within the local LAN).\n• **Route Summarization (Supernetting)**: combines contiguous power-of-two networks by matching common leading bits—e.g., `192.168.0.0/24` through `192.168.3.0/24` (`00, 01, 10, 11` in the last 2 bits of the 3rd octet) share the top 22 bits -> summarize cleanly as **`192.168.0.0/22`**!',
      ],
    },

    deepDive: {
      intro: 'Learn the 4-step Magic Number method and the strict Largest-First VLSM design rule.',
      steps: [
        {
          step: 'Step 1',
          title: 'Find the Interesting Octet & Block Size',
          explanation:
            'Look at the first mask octet that is NOT `255` (e.g., `/26` = `255.255.255.192` -> 4th octet `192`). Compute `Block Size = 256 - 192 = 64`.',
        },
        {
          step: 'Step 2',
          title: 'Locate the Subnet Boundary Surrounding Your IP',
          explanation:
            'For `10.5.5.140/26`, count multiples of `64`: `0, 64, 128, 192`. `140` sits inside `128 .. 191`! So Network ID = `10.5.5.128`, Next Subnet = `10.5.5.192`.',
        },
        {
          step: 'Step 3',
          title: 'Read Off Broadcast & Usable Range',
          explanation:
            'Broadcast = `Next Subnet - 1` = `10.5.5.191`. Usable hosts = `10.5.5.129` through `10.5.5.190` (`2^6 - 2 = 62` hosts).',
        },
        {
          step: 'Step 4',
          title: 'VLSM Rule: Always Allocate Largest Host Need First!',
          explanation:
            'Pick the smallest power-of-two block where `2^h - 2 >= needed hosts`. Allocate the biggest LAN first, start the next LAN immediately at `Previous Broadcast + 1`, and finish with `/30` (2 hosts) WAN links.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '4th-Octet CIDR Cheat Sheet & Example VLSM Partition of 192.168.50.0/24',
        asciiFallback: `/25 (.128) = 126 hosts (blk 128) | /26 (.192) = 62 hosts (blk 64) | /27 (.224) = 30 hosts (blk 32)
/28 (.240) =  14 hosts (blk  16) | /29 (.248) =  6 hosts (blk  8) | /30 (.252) =  2 hosts (blk  4)

VLSM Split of 192.168.50.0/24 (100 hosts, 25 hosts, 2-host WAN):
  1. 100 hosts -> needs 128 blk (/25): 192.168.50.0/25    (.1 – .126,  bcast .127)
  2.  25 hosts -> needs  32 blk (/27): 192.168.50.128/27  (.129 – .158, bcast .159)
  3.   2 hosts -> needs   4 blk (/30): 192.168.50.160/30  (.161 – .162, bcast .163)`,
      },
      workedExample: {
        title: 'Catching an Overlapping & Host-Boundary Error on IOS',
        context:
          'An engineer tries to configure `R1 G0/0` as `172.16.10.65/26` and `R1 G0/1` as `172.16.10.120/25`.',
        steps: [
          'Check `G0/0`: `/26` = block size `64` (`0, 64, 128`). `172.16.10.65` falls in `172.16.10.64 – 172.16.10.127` (valid host `.65`!).',
          'Check `G0/1`: `/25` = block size `128` (`0, 128`). `172.16.10.120` falls inside `172.16.10.0 – 172.16.10.127`, which overlaps `G0/0` completely!',
          'Solution: Move `G0/1` to `172.16.10.129/25` (`172.16.10.128/25` range `.128–.255`) so both subnets sit cleanly side by side.',
        ],
        outcome: 'Checking block multiples exposes overlaps instantly before configuring routers.',
      },
    },

    iosCliGuide: {
      intro: 'IOS enforces subnet validity at entry time—rejecting network IDs, broadcast IDs, and overlapping ranges immediately.',
      commands: [
        {
          title: 'Verify Assigned Subnet Prefix & Overlapping Rejections',
          promptAndCommand: 'R1(config-if)# ip address 172.16.10.64 255.255.255.192',
          output: `Bad mask /26 for address 172.16.10.64`,
          lineByLine: [
            { segment: 'Bad mask /26 for address 172.16.10.64', meaning: '`.64` is an exact multiple of 64 (the Network ID of `/26`), never a valid host IP!' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip route connected',
        healthyLabel: 'Clean Non-Overlapping VLSM Subnets',
        healthyOutput: `C    192.168.50.0/25 is directly connected, GigabitEthernet0/0
C    192.168.50.128/27 is directly connected, GigabitEthernet0/1`,
        brokenLabel: 'Host Misconfigured With Wrong Mask (`192.168.50.130/25` vs Router `/27`)',
        brokenOutput: `PC treats 192.168.50.10 as LOCAL instead of sending to Gateway!`,
        diagnosis:
          'When a PC mistakenly has `/25` instead of `/27`, it ARPs locally for `.10` instead of sending to its default gateway, breaking cross-subnet reachability.',
      },
    },

    commonTraps: [
      {
        trap: 'Remembering `172.16.0.0` through `172.32.255.255` as RFC 1918 private.',
        reality: '`/12` block size in the 2nd octet is `16` (`256 - 240`), so RFC 1918 runs strictly **`172.16.0.0` – `172.31.255.255`**. `172.32.x.x` is public!',
      },
      {
        trap: 'Forgetting to subtract 2 (`2^h - 2`) when sizing subnets for host counts.',
        reality: 'Need 30 hosts? A `/27` gives `32 - 2 = 30` usable IPs (`30` fits!), whereas needing 31 hosts forces a `/26` (`62` usable).',
      },
      {
        trap: 'Allocating smallest VLSM subnets first and fracturing larger block boundaries.',
        reality: 'Always assign **largest host requirement first** so smaller blocks align cleanly on power-of-two offsets.',
      },
      {
        trap: 'Missing the 3rd-octet increment for masks like `/22` (`255.255.252.0`).',
        reality: 'In `/22`, `256 - 252 = 4` in the **3rd octet**, meaning subnets advance by `.0.0, .4.0, .8.0` (`1022` usable hosts each!).',
      },
    ],

    keyTerms: [
      {
        term: 'RFC 1918 Private IPv4',
        shortDef: 'Non-internet-routable IP ranges reserved for internal LANs (10/8, 172.16/12, 192.168/16).',
        fullDef: 'Allows every company to reuse private IP space internally, relying on NAT/PAT at the perimeter for internet access.',
      },
      {
        term: 'VLSM (Variable Length Subnet Mask)',
        shortDef: 'Subnetting subnets with different mask lengths matched to exact host counts.',
        fullDef: 'Prevents IP waste by giving large LANs `/25` or `/24` masks while giving point-to-point router links `/30` (or `/31`) masks.',
      },
      {
        term: 'Block Size (Magic Number)',
        shortDef: 'Increment between adjacent subnets equal to `256 - non-255 mask octet`.',
        fullDef: 'Lets you locate Network ID, Broadcast ID, and host range instantly without full binary conversion.',
      },
      {
        term: 'Broadcast Address',
        shortDef: 'Highest IP in a subnet (`Next Network ID - 1`) with all host bits set to 1.',
        fullDef: 'Reserved for subnet-wide traffic and cannot be assigned to any host or router interface.',
      },
    ],

    checkQuestions: [
      {
        id: 'c13-q1',
        prompt: 'Which set contains the Network ID, First Usable Host, Last Usable Host, and Broadcast Address for `192.168.40.205/27`?',
        options: [
          'Net: .192 | First: .193 | Last: .222 | Bcast: .223',
          'Net: .192 | First: .193 | Last: .223 | Bcast: .224',
          'Net: .200 | First: .201 | Last: .230 | Bcast: .231',
          'Net: .128 | First: .129 | Last: .254 | Bcast: .255',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `/27` = `255.255.255.224` -> block size `256 - 224 = 32`. Multiples of 32: `160, 192, 224`. `.205` sits in `.192–.223`.',
          'Incorrect: `.224` starts the NEXT `/27` subnet.',
          'Incorrect: `200` is not a multiple of 32.',
          'Incorrect: `.128–.255` corresponds to `/25`, not `/27`.',
        ],
        takeaway: '`/27` steps by 32: `0, 32, 64, 96, 128, 160, 192, 224`.',
      },
      {
        id: 'c13-q2',
        prompt: 'Which IP address belongs to a PUBLIC internet range rather than RFC 1918 private space?',
        options: ['172.32.5.10', '172.29.100.4', '10.250.0.1', '192.168.254.1'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `172.16.0.0/12` stops at `172.31.255.255`, making `172.32.5.10` a public IP!',
          'Incorrect: `172.29.x.x` falls inside `172.16.0.0–172.31.255.255`.',
          'Incorrect: `10.x.x.x` is private.',
          'Incorrect: `192.168.x.x` is private.',
        ],
        takeaway: 'RFC 1918 `172.16.0.0/12` spans `172.16.x.x` through `172.31.x.x` ONLY.',
      },
      {
        id: 'c13-q3',
        prompt: 'What is the Broadcast Address of subnet `10.20.4.0/22` (`255.255.252.0`)?',
        options: ['10.20.7.255', '10.20.4.255', '10.20.8.0', '10.20.5.255'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `/22` steps by `256 - 252 = 4` in the 3rd octet. Next network is `10.20.8.0`, so broadcast is one less: `10.20.7.255`.',
          'Incorrect: `10.20.4.255` is just a regular usable IP inside a `/22` block!',
          'Incorrect: `10.20.8.0` is the NEXT subnet’s Network ID.',
          'Incorrect: `.5.255` is the broadcast for `/23`, not `/22`.',
        ],
        takeaway: 'For `/17–/24`, apply `256 - mask` in the 3rd octet and end the broadcast at `.255` before the next block.',
      },
      {
        id: 'c13-q4',
        prompt: 'Using VLSM on `192.168.1.0/24`, you must assign subnets for LAN A (50 hosts), LAN B (12 hosts), and a WAN link (2 hosts). Which mask order is right?',
        options: [
          'LAN A: /26 (.0–.63), LAN B: /28 (.64–.79), WAN: /30 (.80–.83)',
          'LAN A: /27, LAN B: /28, WAN: /29',
          'WAN: /30 (.0–.3), LAN A: /26 (.4–.67) — starting smallest first',
          'LAN A: /25, LAN B: /25, WAN: /30',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: 50 hosts needs `/26` (62 usable), 12 hosts needs `/28` (14 usable), 2 hosts needs `/30` (2 usable)—allocated cleanly largest-first with zero overlap.',
          'Incorrect: `/27` only yields 30 hosts, too small for 50.',
          'Incorrect: Starting a `/26` (block 64) at `.4` violates power-of-two boundary alignment and overlaps!',
          'Incorrect: Two `/25`s consume the entire `/24`, leaving zero space for the `/30`.',
        ],
        takeaway: 'Always allocate VLSM blocks largest-to-smallest on clean power-of-two offsets.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Master Timed VLSM, Network/Broadcast & Wildcard Drills',
      targetTab: 'subnetting',
      instructions: [
        'Open the Subnetting tab and complete 5 VLSM and 5 Network/Broadcast drills in Timed Mode.',
        'Use "Show the working" only after calculating your block size (`256 - mask`) mentally.',
      ],
      verificationCheck: 'Achieve 80%+ accuracy across VLSM and Host Range drills.',
    },

    summaryBullets: [
      'Private RFC 1918 ranges: `10.0.0.0/8`, `172.16.0.0–172.31.255.255 (/12)`, and `192.168.0.0/16`.',
      'Block Size = `256 - interesting mask octet`; Network ID is the block multiple, Broadcast is `Next Subnet - 1`.',
      'Usable hosts per subnet = `2^(32 - prefix) - 2`.',
      'VLSM allocates largest host subnets first to prevent boundary collisions and wasted space.',
      'Check mask consistency when local pings succeed or fail unexpectedly across adjacent ranges.',
    ],

    sourcesToVerify: [
      'RFC 1918 — Address Allocation for Private Internets',
      'RFC 4632 — Classless Inter-domain Routing (CIDR) & RFC 3021 (/31 P2P)',
    ],
  },

  'ccna.v11.1.7': {
    id: 'ccna.v11.1.7',
    moduleId: 'ccna',
    unitTitle: 'Unit 1: Network Fundamentals',
    topicTitle: '1.7 Configure and Verify Private IPv4 Addressing',
    code: '1.7.1',
    title: 'RFC 1918 Private IPv4, CGNAT (100.64.0.0/10), APIPA & Overlapping Range Traps',
    readMinutes: 10,
    prerequisites: ['1.6.1'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['1.7 Configure and verify IPv4 addressing and subnetting (Private vs Public Boundaries)'],

    learningObjectives: [
      'Recall every RFC 1918 private range (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and explain why IPv4 exhaustion + NAT made private reuse mandatory.',
      'Differentiate RFC 1918 private LAN space from APIPA (`169.254.0.0/16`), Loopback (`127.0.0.0/8`), CGNAT (`100.64.0.0/10`), and public trap addresses like `172.32.0.1`.',
      'Identify why two merged companies both using `192.168.1.0/24` suffer Site-to-Site VPN overlap failures and how careful private IP planning prevents collisions.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Merging Two Offices Both Using `192.168.1.0/24` Breaks Site-to-Site VPNs Immediately',
      narrative:
        'Imagine Company A acquires Company B and connects both headquarters over an IPsec VPN. Both IT teams originally left their default office subnet on `192.168.1.0/24`! The moment the VPN comes up, PC `192.168.1.50` in Office A tries to reach Server `192.168.1.50` in Office B—routing tables collide and ARP resolves locally instead of crossing the tunnel! Planning unique `10.<site>.<vlan>.0/24` private blocks early saves agonizing renumbering later.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Office Extension Numbers vs Direct External Phone Numbers',
      analogy:
        'Inside any corporate building, every desk uses short internal extensions (`ext 101` to `ext 199`). Thousands of companies worldwide can all reuse `ext 101` inside their own buildings because those internal numbers never route directly across the public telephone grid—only the company’s public switchboard number (`NAT public IP`) faces outside. **RFC 1918 Private IPv4 addresses** are those reusable internal extensions; **CGNAT (`100.64.0.0/10`)** is a second private-style pool ISPs use between customer routers and carrier NAT gateways.',
      technicalDefinition:
        'RFC 1918 defines three globally non-routable private IPv4 blocks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) conserved for internal networks behind NAT/PAT, alongside special-purpose blocks `127.0.0.0/8` (host loopback), `169.254.0.0/16` (link-local APIPA), and `100.64.0.0/10` (RFC 6598 Shared Carrier-Grade NAT space).',
      paragraphs: [
        'Because IPv4 only contains ~4.3 billion total 32-bit addresses, public allocations ran out years ago. **RFC 1918 + NAT/PAT** solved exhaustion by allowing every organization worldwide to reuse private space internally while sharing a handful of public IPs externally.',
        'Memorize the exact binary boundaries so exam traps never fool you:\n• **`10.0.0.0/8`** (`10.0.0.0 – 10.255.255.255`) — 16.7M addresses (great for structured multi-site `10.<site>.<vlan>.0/24` plans).\n• **`172.16.0.0/12`** (`172.16.0.0 – 172.31.255.255`) — 1.04M addresses (16 `/16` blocks). Careful: `172.15.x.x` and **`172.32.x.x`** are PUBLIC!\n• **`192.168.0.0/16`** (`192.168.0.0 – 192.168.255.255`) — 65,536 addresses (common SOHO default—risks VPN overlaps!).\n• **`100.64.0.0/10`** (`100.64.0.0 – 100.127.255.255`) — **CGNAT (RFC 6598)** used by ISPs on subscriber WAN interfaces when public IPv4 is scarce.',
      ],
    },

    deepDive: {
      intro: 'Classify every special IPv4 address block cleanly and trace overlapping-subnet fixes.',
      steps: [
        {
          step: 'RFC 1918 Private',
          title: '10/8 · 172.16/12 · 192.168/16',
          explanation: 'Dropped by public internet BGP routers (`bogon` filters); require NAT/PAT to reach public websites.',
        },
        {
          step: 'Special Local & ISP',
          title: '127.0.0.0/8 · 169.254.0.0/16 · 100.64.0.0/10',
          explanation: '`127/8` tests local NIC/OS stack; `169.254/16` triggers automatically when DHCP times out; `100.64/10` indicates ISP Carrier-Grade NAT (explains why home port-forwarding fails!).',
        },
        {
          step: 'Overlap Prevention',
          title: 'Structured Enterprise Site Numbering',
          explanation: 'Assign Site 1 `10.1.x.0/24`, Site 2 `10.2.x.0/24`, Guest `172.20.x.0/24`—eliminating VPN overlap collisions across branches and cloud VPCs.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'IPv4 Address Classification & Private Overlap Problem',
        asciiFallback: `RFC 1918: 10.0.0.0–10.255.255.255 | 172.16.0.0–172.31.255.255 | 192.168.0.0–192.168.255.255
SPECIAL : 127.0.0.0/8 (Loopback)  | 169.254.0.0/16 (APIPA)    | 100.64.0.0/10 (ISP CGNAT)
TRAP    : 172.32.10.5 = PUBLIC!   | 192.169.1.5 = PUBLIC!`,
      },
      workedExample: {
        title: 'Diagnosing Why Port-Forwarding Fails Behind ISP CGNAT (`100.64.x.x`)',
        context: 'A branch router WAN `Gi0/0` pulls `100.72.14.99` via DHCP instead of a public static IP.',
        steps: [
          'Recognize `100.72.14.99` falls inside `100.64.0.0 – 100.127.255.255` (`/10` CGNAT!).',
          'Because the ISP shares one public IP across dozens of customers behind CGNAT, inbound IPSec VPN initiation or port-forwarding to `100.72.14.99` cannot cross the ISP NAT.',
          'Request a dedicated public IPv4 (or outbound-initiated VPN tunnel) from the ISP.',
        ],
        outcome: 'Recognizing `100.64.0.0/10` solves "why inbound VPN never reaches my WAN router" immediately.',
      },
    },

    iosCliGuide: {
      intro: 'Verify interface private/public/CGNAT assignments and NAT translation boundaries.',
      commands: [
        {
          title: 'Inspect WAN vs LAN IPv4 Scope on an Edge Router',
          promptAndCommand: 'R1# show ip interface brief',
          output: `Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     100.64.18.42    YES DHCP   up                    up
GigabitEthernet0/1     10.10.20.1      YES manual up                    up`,
          lineByLine: [
            { segment: '100.64.18.42', meaning: 'CGNAT WAN lease (ISP performs second NAT upstream!).' },
            { segment: '10.10.20.1', meaning: 'RFC 1918 internal corporate LAN gateway.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip route',
        healthyLabel: 'Unique Non-Overlapping Site Blocks Across VPN',
        healthyOutput: `C 10.1.0.0/16 (HQ) <-> IPsec Tunnel <-> S 10.2.0.0/16 (Branch)`,
        brokenLabel: 'Overlapping `192.168.1.0/24` Across Both Sides',
        brokenOutput: `HQ uses 192.168.1.0/24 AND Branch uses 192.168.1.0/24 -> ARP fails locally!`,
        diagnosis: 'Renumber one branch (or implement complex double-NAT) to eliminate private IP overlaps.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming `172.32.0.1` or `192.169.1.1` are private internal addresses.',
        reality: 'Both are public internet IPs! `172.16.0.0/12` stops strictly at `172.31.255.255`, and `192.168.0.0/16` applies only to `192.168.x.x`.',
      },
      {
        trap: 'Thinking `100.64.0.0/10` is a normal public IPv4 range you can host external servers on.',
        reality: '`100.64.0.0/10` is Carrier-Grade NAT (RFC 6598) shared ISP space—never directly reachable from the open internet.',
      },
    ],

    keyTerms: [
      {
        term: 'RFC 1918',
        shortDef: 'Standard defining non-public internal blocks: `10/8`, `172.16/12`, `192.168/16`.',
        fullDef: 'Reused globally across private LANs behind NAT/PAT gateways.',
      },
      {
        term: 'CGNAT (100.64.0.0/10)',
        shortDef: 'RFC 6598 Shared Address Space used by ISPs for Carrier-Grade NAT.',
        fullDef: 'Sits between subscriber CPE WANs and carrier NAT devices (`100.64.0.0 – 100.127.255.255`).',
      },
      {
        term: 'APIPA (169.254.0.0/16)',
        shortDef: 'Link-local self-assigned IPv4 range when DHCP fails.',
        fullDef: 'Indicates Layer 1 link exists yet DHCP DORA failed.',
      },
    ],

    checkQuestions: [
      {
        id: 'v11-17-q1',
        prompt: 'Which IPv4 address belongs to **Carrier-Grade NAT (RFC 6598)** rather than RFC 1918 private LAN space or public internet space?',
        options: ['100.88.14.2', '172.24.10.5', '172.32.10.5', '169.254.12.8'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `100.88.14.2` sits inside `100.64.0.0/10` (`100.64.0.0 – 100.127.255.255`), reserved for ISP CGNAT.',
          'Incorrect: `172.24.10.5` is RFC 1918 private.',
          'Incorrect: `172.32.10.5` is public.',
          'Incorrect: `169.254.12.8` is APIPA.',
        ],
        takeaway: '`100.64.0.0/10` = CGNAT (`100.64`–`100.127`).',
      },
      {
        id: 'v11-17-q2',
        prompt: 'Two merging companies both configured `192.168.10.0/24` on their main office LANs and now try to join over a Site-to-Site VPN. What happens?',
        options: [
          'Subnets overlap and collide—hosts treat remote `192.168.10.x` peers as local instead of routing over the VPN.',
          'OSPF automatically renumbers Office B.',
          'Both sites double throughput automatically.',
          'ARP resolves across the public internet.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Overlapping private subnets break direct routing across VPNs until renumbered or double-NATted.',
          'Incorrect: OSPF never renumbers host IPs.',
          'Incorrect: Connectivity fails rather than speeds up.',
          'Incorrect: ARP never crosses routers.',
        ],
        takeaway: 'Plan unique `10.<site>.<vlan>.0/24` private ranges to avoid future VPN/M&A overlaps.',
      },
      {
        id: 'v11-17-q3',
        prompt: 'Which set lists ALL three **RFC 1918 Private IPv4 ranges** accurately?',
        options: [
          '10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), and 192.168.0.0/16',
          '10.0.0.0/8, 172.16.0.0/16, and 192.168.0.0/24',
          '100.64.0.0/10, 169.254.0.0/16, and 127.0.0.0/8',
          '11.0.0.0/8, 172.32.0.0/12, and 192.169.0.0/16',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `10.0.0.0/8`, `172.16.0.0/12` (`172.16.0.0–172.31.255.255`), and `192.168.0.0/16` are the three RFC 1918 private blocks.',
          'Incorrect: `/12` covers `172.16–172.31`, not just `172.16/16`; `192.168.0.0` is a `/16`, not `/24`.',
          'Incorrect: Those are CGNAT, APIPA, and Loopback.',
          'Incorrect: Those are public internet ranges.',
        ],
        takeaway: 'RFC 1918 = `10/8`, `172.16/12` (`.16`–`.31`), and `192.168/16`.',
      },
      {
        id: 'v11-17-q4',
        prompt: 'A workstation shows `169.254.77.14 / 255.255.0.0` with no Default Gateway in `ipconfig`. What does this tell you immediately?',
        options: [
          'The NIC link is connected, yet DHCP DORA failed to return a lease so the OS fell back to APIPA (`169.254.0.0/16`).',
          'The workstation received a valid RFC 1918 lease from the corporate router.',
          'The ISP assigned a Carrier-Grade NAT public IP.',
          'The Ethernet cable is completely unplugged.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: APIPA (`169.254.0.0/16`) signals a working physical link with zero DHCP server reply.',
          'Incorrect: RFC 1918 is `10/8`, `172.16/12`, or `192.168/16`—not `169.254`.',
          'Incorrect: ISP CGNAT uses `100.64.0.0/10`.',
          'Incorrect: Unplugged cables report `Media disconnected` rather than APIPA.',
        ],
        takeaway: 'APIPA (`169.254.0.0/16`) = link up + DHCP timeout.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Classify Private, APIPA, CGNAT & Public Trap IPs in Subnetting Studio',
      targetTab: 'subnetting',
      instructions: [
        'Open Subnetting Studio and test `10.1.5.1`, `172.31.255.10`, `172.32.0.10`, `100.64.10.1`, and `169.254.40.2` in the interactive analyzer.',
      ],
      verificationCheck: 'Identifies RFC 1918 vs CGNAT vs APIPA vs Public Trap IPs cleanly.',
    },

    summaryBullets: [
      'RFC 1918 Private IPv4: `10.0.0.0/8`, `172.16.0.0/12` (`.16`–`.31`), `192.168.0.0/16`.',
      'Special IPv4: `127.0.0.0/8` Loopback, `169.254.0.0/16` APIPA, `100.64.0.0/10` CGNAT.',
      '`172.32.x.x` and `192.169.x.x` are public traps outside RFC 1918.',
      'Structured private IP plans prevent overlapping-subnet VPN failures.',
    ],

    sourcesToVerify: [
      'RFC 1918 (Private Internets) & RFC 6598 (CGNAT 100.64.0.0/10)',
    ],
  },
};
