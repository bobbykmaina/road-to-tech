import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT6_A_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.v11.6.1': {
    id: 'ccna.v11.6.1',
    moduleId: 'ccna',
    unitTitle: 'Unit 6: Automation and Programmability (v1.1)',
    topicTitle: '6.1 How Automation Impacts Network Management',
    code: '6.1.1',
    title: 'Why Manual CLI Fails at Scale: Consistency, Speed & Zero-Touch Provisioning',
    readMinutes: 9,
    prerequisites: ['0.2.2 Cisco IOS CLI Basics'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['6.1 Explain how automation impacts network management'],

    learningObjectives: [
      'Identify why human-typed SSH CLI changes introduce **configuration drift**, outages, and slow rollouts across dozens or hundreds of devices.',
      'Explain four concrete benefits of **Network Automation**: configuration consistency, faster deployment speed, reduced human error, and automated compliance auditing.',
      'Describe **Zero-Touch Provisioning (ZTP)** / **Plug and Play (PnP)** for bringing new branch switches online automatically.',
      'Recognize the cultural shift from pet-like manual boxes ("craftsman CLI") toward software-defined templates and Version Control (Git).',
    ],

    whyThisMatters: {
      scenarioTitle: 'One Mistyped `switchport trunk allowed vlan 50` (Forgetting `add`) Drops an Entire Floor',
      narrative:
        'Suppose a security rule requires adding VLAN 50 across 80 switch uplinks tonight. At switch #47 around midnight, a tired engineer types `switchport trunk allowed vlan 50` instead of `switchport trunk allowed vlan add 50`—wiping VLANs 10, 20, and 30 and taking down 300 phones! Humans get tired and make typos; automated scripts and playbooks apply the *identical tested template* to all 80 switches in 20 seconds with zero typos.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Hand-Painting 100 Cars vs Stamping Every Frame on an Automated Assembly Line',
      analogy:
        'Hand-painting one custom bicycle is easy. Hand-painting 500 identical delivery trucks by midnight guarantees uneven stripes, missed bolts, and exhausted painters. **Network Automation** replaces repetitive manual SSH typing with software blueprints checked into **Version Control (Git)** and executed consistently by computers—shrinking a 3-day weekend maintenance window into a repeatable 3-minute check.',
      technicalDefinition:
        'Network automation uses software scripts, APIs, controllers, and configuration-management engines to provision, validate, and monitor network devices programmatically—reducing human-induced **configuration drift**, lowering Mean Time to Deploy (**MTTD**), supporting **Zero-Touch Provisioning (ZTP)**, and keeping desired state under auditable version control.',
      paragraphs: [
        'CCNA Domain 6.1 examines *why* networks moved beyond pure CLI: **human CLI edits don’t scale**. Typing NTP, syslog, ACLs, and VLANs box-by-box creates subtle mismatches (**configuration drift**) where Switch 14 slowly diverges from Switch 15 until an outage hits.',
        'Automation does **not** eliminate network engineers—you still must deeply understand VLANs, STP, OSPF, and ACLs! Instead of typing repetitive commands 200 times, you capture verified engineering designs into templates (YAML/JSON/Python) and focus on architecture and validation.',
        '**Zero-Touch Provisioning (ZTP)** lets a factory-fresh switch boot out of the box, request DHCP + Option 67/150 or Cisco PnP cloud discovery, download its verified IOS XE image + baseline config automatically, and join production with zero console cable needed.',
      ],
    },

    deepDive: {
      intro:
        'Compare manual box-by-box operations against automated, template-driven workflows.',
      steps: [
        {
          step: 'Benefit 1',
          title: 'Eliminating Configuration Drift & Human Typos',
          explanation:
            'Automated templates guarantee identical NTP, SNMPv3, ACL, and trunk syntax across every device—no forgotten `add` keywords or inverted wildcards.',
        },
        {
          step: 'Benefit 2',
          title: 'Speed, Repeatability & Pre/Post Validation',
          explanation:
            'Software pushes verified updates to 500 switches in minutes and immediately validates OSPF neighbors and interface errors programmatically afterward.',
        },
        {
          step: 'Benefit 3',
          title: 'Zero-Touch Provisioning (ZTP) & Compliance Audits',
          explanation:
            'New branch gear self-provisions upon power-up, while scheduled automation jobs flag unauthorized manual edits ("drift") within minutes.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Manual CLI Typing vs Automated Intent-Driven Workflow',
        asciiFallback: `Manual CLI: [Engineer] --(SSH 200 times, tired at 1AM)--> [200 Switches: Typos + Config Drift!]

Automated:  [Git Blueprint] -> [CI Review] -> [Automation Engine / Controller] --(API/SSH)--> [200 Identical Switches]`,
      },
      workedExample: {
        title: 'Worked Rollout Comparison: Updating DNS & NTP Across 120 Branches',
        context:
          'Security requires migrating 120 branch switches to a new NTP server (`10.50.0.10`) and removing an old syslog IP.',
        steps: [
          'Manual approach: log into 120 switches individually (~4 hours), risk fat-fingering `no ntp` or forgetting `write memory` on 6 switches.',
          'Automated approach: update 2 lines in a single Git-tracked playbook, run against test lab switch first, deploy to 120 switches in 90 seconds, and verify `show ntp status` output automatically.',
        ],
        outcome:
          'Zero drift, 100% `write memory` persistence, and instant Git history proving who approved the change.',
      },
    },

    iosCliGuide: {
      intro:
        'Notice how `archive` / `configure replace` on Cisco IOS enables clean automated diffs and safe rollbacks.',
      commands: [
        {
          title: 'Compare Live Running Config Against Saved Golden Baseline',
          promptAndCommand: `SW1# show archive config differences nvram:startup-config system:running-config`,
          output: `Contextual Config Diffs:
+ntp server 10.50.0.10
-ntp server 10.10.0.10`,
          lineByLine: [
            { segment: 'show archive config differences', meaning: 'Instantly highlights configuration drift between saved startup baseline and live RAM.' },
            { segment: '+ / - lines', meaning: 'Shows exact added (`+`) and removed (`-`) IOS lines cleanly.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show archive config differences',
        healthyLabel: 'Zero Unplanned Drift',
        healthyOutput: `!No changes were found`,
        brokenLabel: 'Undocumented Manual Drift',
        brokenOutput: `+no ip access-group CORP_IN in  (Unauthorized manual edit left in RAM!)`,
        diagnosis:
          'Automated compliance audits catch unplanned edits immediately before outages or security gaps grow.',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking automation replaces understanding networking fundamentals (OSPF, STP, subnetting).',
        reality: 'Automation only scales your existing skill—pushing a broken OSPF area mask via Ansible breaks 100 routers faster than typing by hand!',
      },
      {
        trap: 'Assuming **Zero-Touch Provisioning (ZTP)** skips all network security.',
        reality: 'ZTP typically relies on DHCP/PnP verification, certificates, and serial-number allowlists before handing out configs.',
      },
    ],

    keyTerms: [
      {
        term: 'Configuration Drift',
        shortDef: 'Gradual mismatch across devices caused by ad-hoc manual CLI tweaks over time.',
        fullDef: 'Eliminated when desired config lives in a single automated source of truth.',
      },
      {
        term: 'Zero-Touch Provisioning (ZTP)',
        shortDef: 'Automatic bootstrap letting unconfigured switches fetch OS + config on initial boot.',
        fullDef: 'Cuts truck rolls and onsite console cabling for branch deployments.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1161-q1',
        prompt: 'What operational risk occurs over time when 12 engineers SSH into switches individually and make ad-hoc fixes without central templates?',
        options: ['Configuration drift', 'Spanning-Tree root aging', 'MAC address learning', 'ARP caching'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Configuration drift** occurs when manual edits cause switches that should match to diverge unexpectedly.',
          'Incorrect: STP root aging is unrelated to manual CLI variance.',
          'Incorrect: MAC learning is normal Ethernet switch forwarding.',
          'Incorrect: ARP caching maps IPs to MACs.',
        ],
        takeaway: 'Manual ad-hoc CLI tweaks produce **configuration drift**.',
      },
      {
        id: 'c1161-q2',
        prompt: 'Which capability allows a brand-new branch switch shipped straight from the factory to plug in, acquire an IP, download its OS/config automatically, and join production with zero local CLI typing?',
        options: ['Zero-Touch Provisioning (ZTP / PnP)', 'Split-Horizon Poison Reverse', 'TFTP manual ROMMON recovery', 'Telnet VTY access'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **ZTP** automates bootstrap image and golden config provisioning upon initial power-on.',
          'Incorrect: Split horizon is a distance-vector loop prevention rule.',
          'Incorrect: ROMMON TFTP requires manual console typing.',
          'Incorrect: Telnet is manual insecure remote CLI.',
        ],
        takeaway: 'ZTP ships unconfigured boxes directly to branches for automatic bootstrapping.',
      },
      {
        id: 'c1161-q3',
        prompt: 'Why is storing network configuration templates inside **Git** (version control) before running automation superior to ad-hoc SSH?',
        options: [
          'Every change gets peer-reviewed history, author blame, and rapid rollback to prior working commits.',
          'Git replaces Ethernet switches with routers.',
          'Git eliminates the need for IP addressing.',
          'Git converts TCP traffic into UDP.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Version control gives teams change history, peer review, and known-good rollback.',
          'Incorrect: Git manages source code/config files, not L2 forwarding.',
          'Incorrect: Devices still require valid IP plans.',
          'Incorrect: Git does not modify L4 protocols.',
        ],
        takeaway: 'Version-controlled blueprints give auditable history and instant rollback.',
      },
      {
        id: 'c1161-q4',
        prompt: 'What is the biggest danger if an engineer automates a **flawed** routing or ACL template without testing in staging first?',
        options: [
          'Automation deploys the mistake across hundreds of devices simultaneously at machine speed.',
          'Automation automatically rewrites bad subnet masks into valid ones.',
          'Switches reject all automated SSH connections.',
          'Only one interface goes down.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Scale amplifies mistakes too—testing in staging + automated validation checks remain vital.',
          'Incorrect: Tools execute the exact config you specify unless explicitly validated.',
          'Incorrect: Valid syntax executes regardless of flawed logic.',
          'Incorrect: Fleet-wide runs affect every targeted device.',
        ],
        takeaway: 'Automation scales speed AND mistakes—always validate in staging first.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Drift Check & Automation Business Case',
      instructions: [
        'List 3 repetitive tasks in a 50-switch network (NTP updates, SNMPv3 rotation, VLAN additions) and note how manual CLI risks drift.',
        'Trace `show archive config differences` to see how drift diffs work on IOS.',
      ],
      verificationCheck: 'Explains config drift, ZTP, and why automation still demands strong foundational networking.',
    },

    summaryBullets: [
      'Manual CLI management slows rollouts, invites human typos, and creates **configuration drift**.',
      'Automation brings speed, identical repeatable configs, compliance checks, and rapid validation.',
      '**Zero-Touch Provisioning (ZTP)** boots factory switches straight onto golden configs.',
      'Pairing **Git version control** with automation adds peer review and clean rollback.',
      'Automation multiplies engineering skill—never skip testing templates in staging first.',
    ],

    sourcesToVerify: [
      'Cisco Network Automation & Programmability Overview',
    ],
  },

  'ccna.core.ops.management-approaches': {
    id: 'ccna.core.ops.management-approaches',
    moduleId: 'ccna',
    unitTitle: 'Unit 6 / Unit 5: Network Management & SDN',
    topicTitle: 'Network Management Approaches & SDN Controllers',
    code: '5.3.1',
    title: 'Compare Management Approaches: Device CLI vs Cloud vs Controller (Catalyst Center) vs IaC',
    readMinutes: 12,
    prerequisites: ['0.2.2 IOS CLI Basics'],
    versionScope: 'shared',
    v11ExamTopics: ['6.2 Compare traditional networks with controller-based networking', '6.3 Describe controller-based, software defined architecture (overlay, underlay, fabric), Cisco Catalyst Center'],
    v20ExamTopics: ['5.3 Compare network management approaches (device-based, cloud-managed, controller-based, automation and IaC)'],

    learningObjectives: [
      'Compare all four management models tested in CCNA v2.0 5.3: **Device-Based (box-by-box)**, **Cloud-Managed (e.g., Meraki)**, **Controller-Based On-Prem (e.g., Cisco Catalyst Center / SDN)**, and **Automation / Infrastructure as Code (IaC)**.',
      'Separate the **Control Plane** (routing/forwarding decisions), **Data Plane** (forwarding user packets), and **Management Plane** (SSH/SNMP/API monitoring & config).',
      'Distinguish **Northbound APIs** (Apps/Terraform -> Controller via REST/JSON) from **Southbound APIs** (Controller -> Switches via NETCONF/RESTCONF/OpenFlow) and **Underlay** vs **Overlay** fabric.',
      'Explain how **Declarative IaC** (defining desired end state in code) prevents drift compared to **Imperative** step-by-step commands.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Choosing the Right Operating Model for 3 Branches vs a 200-Switch Hospital Campus',
      narrative:
        'A startup with two routers manages them straight via SSH (**Device-Based**). A retail chain opening 500 pop-up stores plugs in **Cloud-Managed** APs that pull policies automatically over HTTPS. Meanwhile, a massive hospital campus deploys an on-prem **SDN Controller (Cisco Catalyst Center)** separating **Underlay** routed links from **Overlay** encrypted micro-segmentation—or manages multi-cloud VPCs with **Declarative IaC**. Understanding each plane and model lets you answer architecture interviews and CCNA blueprint scenarios cleanly.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Individual Drivers (Device) vs Central Air Traffic Control (Controller) vs Blueprint Code (IaC)',
      analogy:
        'In **Device-Based** networking, every car driver (router) reads local signs individually via box-by-box SSH. In **Controller-Based (SDN)** networking, a central Air Traffic Control tower holds the map of every plane, computes optimal policies centrally, and pushes instructions down (**Southbound**) while exposing friendly flight-scheduling forms upward (**Northbound**). **Cloud-Managed** moves that control tower into the vendor’s hosted cloud dashboard, while **IaC** defines your entire desired airport layout in versioned text blueprints so software keeps reality matched automatically.',
      technicalDefinition:
        'Modern network operations span four management paradigms: **Device-Based** (distributed autonomous control/data/management planes per device via SSH/WebUI), **Cloud-Managed** (SaaS dashboard control/management planes over TLS tunnels), **Controller-Based / SDN** (centralized **Cisco Catalyst Center** decoupling **Underlay** IP reachability from **Overlay** VXLAN/LISP fabrics via **Northbound REST APIs** and **Southbound NETCONF/RESTCONF**), and **Automation / IaC** (declarative state management stored in version control).',
      paragraphs: [
        'Start by mastering the **Three Planes** inside every switch or router:\n1. **Data Plane**: forwards actual user packets/frames at hardware line speed (MAC table lookups, CEF IP routing, ACL drops).\n2. **Control Plane**: learns topology and calculates forwarding paths (OSPF, BGP, STP, ARP).\n3. **Management Plane**: configures and monitors the box (SSH, SNMP, Syslog, RESTCONF).',
        'In **Cisco Software-Defined Access (SD-Access) / Catalyst Center (formerly DNA Center)**:\n• **Underlay**: physical switches/routers running routed OSPF/IS-IS providing reliable IP reachability.\n• **Overlay**: virtual **VXLAN** (data plane) + **LISP** (control plane) fabric stretching logical policies/segments smoothly across any physical rack!\n• **Northbound API**: REST APIs facing scripts/ITSM tools.\n• **Southbound API**: NETCONF, RESTCONF, SSH, or SNMP pushing config down to switches.',
        'For **CCNA v2.0 5.3**: know **Imperative vs Declarative IaC**. Imperative scripts say *step-by-step commands* ("create VLAN 10, then interface..."). **Declarative IaC** declares the *final desired state* ("switch MUST have exactly VLAN 10 and 20—fix whatever drifted!").',
      ],
    },

    deepDive: {
      intro:
        'Contrast the 4 management approaches and map Northbound/Southbound controller planes.',
      steps: [
        {
          step: 'Approach 1',
          title: 'Device-Based (Traditional Autonomous CLI/GUI)',
          explanation:
            'Each switch/router runs its own local Control, Data, and Management plane via SSH/console. Zero external controller needed; high manual effort and drift at scale.',
        },
        {
          step: 'Approach 2',
          title: 'Cloud-Managed (e.g., Cisco Meraki)',
          explanation:
            'Management & policy live in a multi-tenant SaaS web dashboard; devices phone home automatically via secure cloud tunnels. Ultra-fast branch scaling; requires subscription licensing.',
        },
        {
          step: 'Approach 3',
          title: 'Controller-Based On-Premises (SDN / Cisco Catalyst Center)',
          explanation:
            'Centralizes intent policy, ZTP, and telemetry inside your data center/campus. Exposes **Northbound REST APIs** to external apps and uses **Southbound** protocols (`NETCONF`, `RESTCONF`, `SSH`) toward physical **Underlay** + **Overlay** switches.',
        },
        {
          step: 'Approach 4',
          title: 'Automation & Infrastructure as Code (IaC — Ansible/Terraform)',
          explanation:
            'Stores desired infrastructure state inside Git code files (**Declarative** state = drift prevention) and applies updates consistently via SSH/API pipelines.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'SDN Controller Architecture (Northbound APIs vs Southbound Protocols)',
        asciiFallback: `[Ops Apps / Jira / Terraform / AI Tools]
          ^
          |  Northbound API (REST + JSON over HTTPS)
          v
[SDN Controller — e.g., Cisco Catalyst Center]
          ^
          |  Southbound APIs (NETCONF / RESTCONF / OpenFlow / SSH)
          v
[Underlay Switches & Routers]  ===>  Carries Virtual [VXLAN Overlay Fabric]`,
      },
      workedExample: {
        title: 'Worked Plane & Architecture Triage',
        context:
          'Suppose a Catalyst Center appliance reboots for patching at 2:00 AM, while campus switches keep running.',
        steps: [
          'Ask: Can users still reach servers while the controller is offline for 15 minutes?',
          '**Yes!** Because the **Data Plane** (and local fast **Control Plane** forwarding tables on switches) runs right in switch ASIC hardware—only the **Management Plane** (pushing *new* policy changes) pauses briefly!',
          'Confirm Northbound vs Southbound: external ServiceNow tickets hitting Catalyst Center use the **Northbound REST API**; Catalyst Center configuring Switch SW4 uses **Southbound NETCONF/SSH**.',
        ],
        outcome:
          'Separating Management, Control, and Data planes makes resilient enterprise operations crystal clear.',
      },
    },

    iosCliGuide: {
      intro:
        'Check how modern IOS XE exposes **NETCONF** (`TCP 830`) and **RESTCONF** (`TCP 443`) for Southbound controller & automation management.',
      commands: [
        {
          title: 'Enable NETCONF & RESTCONF Management Interfaces on IOS XE',
          promptAndCommand: `R1(config)# netconf-yang
R1(config)# restconf
R1(config)# ip http secure-server`,
          output: `R1# show platform software yang-management process
confd            : Running
nesd             : Running
restconfd        : Running`,
          lineByLine: [
            { segment: 'netconf-yang', meaning: 'Activates XML/YANG structured configuration management over SSH TCP port 830.' },
            { segment: 'restconf', meaning: 'Activates HTTPS REST API access (`TCP 443`) using YANG data models.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show platform software yang-management process',
        healthyLabel: 'API Southbound Daemons Active',
        healthyOutput: `confd : Running | nesd : Running | restconfd : Running`,
        brokenLabel: 'API Services Stopped',
        brokenOutput: `restconfd : Not Running (forgot ip http secure-server or restconf!)`,
        diagnosis:
          'RESTCONF requires both `restconf` AND `ip http secure-server` active to accept controller HTTPS API calls.',
      },
    },

    commonTraps: [
      {
        trap: 'Swapping **Northbound** and **Southbound** API directions on SDN controllers.',
        reality: '**Northbound** talks *up* to apps/scripts/admins (`REST/JSON`); **Southbound** talks *down* to physical/virtual switches (`NETCONF`, `RESTCONF`, `OpenFlow`, `SSH`).',
      },
      {
        trap: 'Confusing **Underlay** and **Overlay** in Cisco SD-Access / Catalyst Center.',
        reality: '**Underlay** = physical cables/switches/IP routing; **Overlay** = virtual **VXLAN/LISP** logical fabric riding on top of the underlay.',
      },
      {
        trap: 'Mixing up the **Data Plane** vs **Control Plane** vs **Management Plane**.',
        reality: 'User traffic forwarding = **Data Plane**; OSPF/STP route learning = **Control Plane**; SSH/SNMP/Syslog admin = **Management Plane**.',
      },
    ],

    keyTerms: [
      {
        term: 'Control / Data / Management Planes',
        shortDef: 'Topology computation (Control), packet forwarding (Data), and admin/monitoring (Management).',
        fullDef: 'SDN centralizes management/control intelligence while keeping wire-speed Data Plane forwarding on switch ASICs.',
      },
      {
        term: 'Northbound vs Southbound API',
        shortDef: 'Northbound connects apps/humans to controller; Southbound connects controller to network devices.',
        fullDef: 'Northbound commonly uses REST/JSON; Southbound uses NETCONF (`830`), RESTCONF (`443`), OpenFlow, or CLI.',
      },
      {
        term: 'Infrastructure as Code (IaC)',
        shortDef: 'Managing infrastructure declaratively via version-controlled code blueprints.',
        fullDef: 'Prevents drift by reconciling live state continuously against Git-stored declarations.',
      },
    ],

    checkQuestions: [
      {
        id: 'c53-q1',
        prompt: 'An automation engineer writes a Python script calling **Cisco Catalyst Center** over HTTPS REST APIs to pull campus device inventory. Which SDN controller interface is the script using?',
        options: ['Northbound API', 'Southbound API', 'Data Plane ASIC', 'Spanning-Tree BPDUs'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: External applications, scripts, and orchestration tools communicate *down into* the SDN controller via its **Northbound API**.',
          'Incorrect: Southbound APIs run *between* the controller and managed switches/routers.',
          'Incorrect: Data plane forwards user packets across switch hardware.',
          'Incorrect: STP operates at Layer 2 Ethernet links.',
        ],
        takeaway: 'Apps <-> Controller = **Northbound**; Controller <-> Devices = **Southbound**.',
      },
      {
        id: 'c53-q2',
        prompt: 'In Cisco Catalyst Center / SD-Access terminology, what distinguishes the **Underlay** from the **Overlay**?',
        options: [
          'The Underlay is the physical switches/IP routing providing reachability, while the Overlay is the virtual VXLAN/LISP fabric built on top.',
          'The Overlay is physical fiber cables, while the Underlay is REST APIs.',
          'The Underlay uses Wi-Fi only.',
          'They mean the exact same thing.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Physical switches/OSPF/IS-IS form the **Underlay** transport, carrying **Overlay** VXLAN user segments and LISP mappings.',
          'Incorrect: Inverted.',
          'Incorrect: Underlay spans wired physical campus routing.',
          'Incorrect: Separate architectural layers.',
        ],
        takeaway: '**Underlay** = physical IP reachability; **Overlay** = virtual VXLAN/LISP tunnels above.',
      },
      {
        id: 'c53-q3',
        prompt: 'Which plane is responsible for SSH administration, SNMP monitoring, and RESTCONF configuration updates—distinct from routing protocol exchange and packet switching?',
        options: ['Management Plane', 'Data Plane', 'Control Plane', 'Physical Media Plane'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SSH, SNMP, Syslog, and RESTCONF belong to the **Management Plane**.',
          'Incorrect: Data Plane forwards user packets.',
          'Incorrect: Control Plane learns routes/MACs/STP.',
          'Incorrect: Standard SDN defines Data, Control, and Management planes.',
        ],
        takeaway: 'Forwarding = Data; OSPF/STP = Control; SSH/SNMP/API = Management.',
      },
      {
        id: 'c53-q4',
        prompt: 'How does **Declarative IaC** differ from **Imperative CLI scripting** when preventing configuration drift?',
        options: [
          'Declarative IaC defines the desired end state ("ensure VLAN 10 & 20 exist") so tools enforce compliance rather than blindly re-running step commands.',
          'Declarative IaC requires logging into each switch console port manually.',
          'Imperative scripts forbid SSH.',
          'Declarative IaC disables encryption.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Declarative tools model target state and remediate any mismatch (**drift**) idempotently.',
          'Incorrect: IaC runs remotely via APIs/SSH.',
          'Incorrect: Imperative tools commonly run over SSH.',
          'Incorrect: IaC uses encrypted SSH/HTTPS transports.',
        ],
        takeaway: 'Declarative IaC specifies *what* state should exist; Imperative specifies step-by-step *how*.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Management Approach Selection Matrix',
      instructions: [
        'Compare Device CLI vs Cloud-Managed (Meraki) vs On-Prem Controller (Catalyst Center) vs IaC across Scale, Hardware Lock-in, and Drift Control.',
        'Trace Northbound (`REST/JSON`) and Southbound (`NETCONF 830 / RESTCONF 443`) flows.',
      ],
      verificationCheck: 'Separates 3 planes, North/South APIs, Underlay/Overlay, and all 4 management paradigms.',
    },

    summaryBullets: [
      'Four management approaches: **Device-Based** (manual CLI), **Cloud-Managed** (SaaS), **Controller-Based** (SDN/Catalyst Center), and **IaC/Automation**.',
      '**Data Plane** forwards packets; **Control Plane** computes routes; **Management Plane** monitors/configures.',
      '**Northbound APIs** connect apps to the controller; **Southbound APIs** (`NETCONF`/`RESTCONF`/`SSH`) push config to switches.',
      '**Underlay** = physical IP routing; **Overlay** = virtual VXLAN/LISP fabric riding across it.',
      '**Declarative IaC** declares desired state to eliminate configuration drift.',
    ],

    sourcesToVerify: [
      'Cisco Catalyst Center Architecture & SD-Access Design Guide',
      'Cisco IOS XE Programmability Configuration Guide — NETCONF & RESTCONF',
    ],
  },

  'ccna.core.ops.snmp': {
    id: 'ccna.core.ops.snmp',
    moduleId: 'ccna',
    unitTitle: 'Unit 6 / Unit 4: Network Monitoring',
    topicTitle: 'SNMP Operations & Configuration',
    code: '5.4.1',
    title: 'Configuring & Verifying SNMP (v2c vs v3, MIB/OIDs, Polling UDP 161 & Traps UDP 162)',
    readMinutes: 12,
    prerequisites: ['5.3.1 Management Approaches'],
    versionScope: 'shared',
    v11ExamTopics: ['4.4 Explain the function of SNMP in network operations'],
    v20ExamTopics: ['5.4 Configure and verify SNMP'],

    learningObjectives: [
      'Explain the four **SNMP** components: **SNMP Manager** (NMS), **SNMP Agent** (router/switch), **MIB** (Management Information Base), and **OID** (Object Identifier).',
      'Contrast **Polling** (`GET` / `GET-NEXT` / `SET` over **UDP 161**) with asynchronous **Notifications** (**Traps** unacknowledged vs **Informs** acknowledged over **UDP 162**).',
      'Compare **SNMPv1/v2c** (cleartext community strings!) against **SNMPv3** security levels (`noAuthNoPriv`, `authNoPriv`, `authPriv` using SHA + AES encryption).',
      'Configure and verify **SNMPv3 `authPriv`** views, groups, and users on Cisco IOS XE.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why `public` Community Strings Exposed Entire Routing Tables on the Wire',
      narrative:
        'Your monitoring server graphs interface bandwidth and alerts you at 3:00 AM the second a WAN link crosses 85% CPU. Under **SNMPv2c**, the community password `public` or `private` travels unencrypted over UDP port 161—letting any packet sniffer hijack `read-write` access! Upgrading to **SNMPv3 `authPriv`** hashes authentication (SHA) and encrypts payloads (AES), while **SNMP Traps/Informs** let switches push urgent link-down alerts immediately over **UDP 162**.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Calling a Store for Hourly Counts (Poll UDP 161) vs an Instant Fire Alarm (Trap UDP 162)',
      analogy:
        'An **SNMP Manager** checks branch health in two ways. First, every 5 minutes it calls the branch **SNMP Agent** ("Hey, check shelf bin `1.3.6.1.2.1.2.2`—how many bytes exited `Gi0/1`?")—that’s **Polling (`GET`, UDP 161)** reading structured **OID** rows from the device’s **MIB** catalog. Second, if a power supply suddenly fails mid-minute, the switch cannot wait 5 minutes! It immediately rings the Manager’s fire bell over **UDP 162**—that’s a **Trap** (fire-and-forget alert) or an **Inform** (alert demanding a receipt!).',
      technicalDefinition:
        'Simple Network Management Protocol (**SNMP**, RFC 3411–3418) exchanges structured telemetry between an **NMS Manager** and managed **Agents** organized as hierarchical **OID** trees inside **MIB** files. Managers send `GET`/`SET` polls over **UDP 161**; Agents emit asynchronous **Traps** or reliable **Informs** to **UDP 162**. **SNMPv1/v2c** authenticate via plaintext community strings (`RO`/`RW`), while **SNMPv3** provides USM user security via `noAuthNoPriv`, `authNoPriv` (MD5/SHA integrity), and **`authPriv`** (SHA auth + AES/3DES encryption).',
      paragraphs: [
        'Memorize the two SNMP UDP ports strictly:\n• **UDP 161**: **Manager -> Agent** (`GET`, `GET-NEXT`, `GET-BULK`, `SET` polling).\n• **UDP 162**: **Agent -> Manager** (`Trap` unacknowledged, `Inform` acknowledged!).',
        'Why pick **Inform** over **Trap**? An SNMP **Trap** sends one UDP datagram and never asks if the Manager received it—if a WAN spike drops it, the alert vanishes. An **Inform** causes the Manager to reply with an acknowledgment receipt, so the switch retries if lost!',
        'Always verify **SNMPv3 security levels**:\n1. `noAuthNoPriv`: username only (no hash, no encryption).\n2. `authNoPriv`: HMAC-SHA/MD5 authentication (no encryption).\n3. **`authPriv`**: **HMAC-SHA authentication + AES encryption**—the enterprise security gold standard!',
      ],
    },

    deepDive: {
      intro:
        'Configure both SNMPv2c (lab recognition) and SNMPv3 `authPriv` (v2.0 5.4 exam skill) cleanly on Cisco IOS XE.',
      steps: [
        {
          step: 'Concept',
          title: 'MIB Hierarchy & OID Addressing',
          explanation:
            'Every counter (hostname, uptime, interface Rx bytes) lives at a unique dotted numeric address called an **OID** inside a tree-structured dictionary called a **MIB**.',
        },
        {
          step: 'SNMPv2c',
          title: 'Legacy Community Strings (Plaintext!)',
          explanation:
            '`snmp-server community MON_READ RO` grants Read-Only polling; `RW` allows `SET` modifications (dangerous if leaked!). Always protect with an ACL (`snmp-server community MON_READ RO NMS_ACL`).',
        },
        {
          step: 'SNMPv3',
          title: 'Secure `authPriv` Configuration (Group -> User -> Host)',
          explanation:
            'Define a view (`snmp-server view ISO_VIEW iso included` if customizing), create group (`snmp-server group OPS_GRP v3 priv read ISO_VIEW`), add user (`snmp-server user monadmin OPS_GRP v3 auth sha <AuthPass> priv aes 128 <PrivKey>`), and optionally point Traps (`snmp-server host 10.10.0.60 version 3 priv monadmin`).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'SNMP Polling (UDP 161) vs Traps/Informs (UDP 162)',
        asciiFallback: `[NMS Manager 10.10.0.60]  ---- GET / SET Poll (UDP port 161) ---->  [Router/Switch SNMP Agent]
                          <--- Reply (OID values from MIB) -------      (Contains MIB & OID tree)

[NMS Manager 10.10.0.60]  <--- Trap / Inform Alert (UDP port 162) --  [Switch: Power Supply Down!]
                          ---- Ack (ONLY if Inform, NOT Trap!) --->`,
      },
      workedExample: {
        title: 'Worked SNMPv3 `authPriv` Cutover on Core Switch',
        context:
          'Security flags cleartext `snmp-server community public RO`. Migrate NMS monitoring (`10.10.0.60`) to SNMPv3 `authPriv` using SHA + AES-128.',
        steps: [
          'Remove insecure v2c strings: `no snmp-server community public`.',
          'Create SNMPv3 group enforcing privacy (`priv` = auth + encrypt): `snmp-server group NMS_V3 v3 priv`.',
          'Create user: `snmp-server user solarwinds NMS_V3 v3 auth sha AuthKey!23 priv aes 128 EncKey!45`.',
          'Configure authenticated encrypted Inform destination: `snmp-server host 10.10.0.60 informs version 3 priv solarwinds`.',
          'Verify locally with `show snmp group` and `show snmp user`.',
        ],
        outcome:
          'Credentials and telemetry travel SHA-authenticated and AES-128 encrypted, while `informs` guarantee critical hardware alerts arrive.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure and inspect SNMPv3 `authPriv` groups, users, and engine counters on IOS XE.',
      commands: [
        {
          title: 'Configure & Verify SNMPv3 `authPriv` on IOS XE',
          promptAndCommand: `SW1(config)# snmp-server group NMS_V3 v3 priv
SW1(config)# snmp-server user monuser NMS_V3 v3 auth sha AuthPass!1 priv aes 128 PrivPass!2
SW1(config)# snmp-server host 10.10.0.60 version 3 priv monuser`,
          output: `SW1# show snmp user
User name: monuser
Engine ID: 8000000903005056AB1122
storage-type: nonvolatile        active
Authentication Protocol: SHA
Privacy Protocol: AES128
Group-name: NMS_V3`,
          lineByLine: [
            { segment: 'v3 priv', meaning: 'Enforces `authPriv` (both authentication and encryption) for the group.' },
            { segment: 'auth sha ... priv aes 128 ...', meaning: 'Uses SHA hashing for auth/integrity and AES-128 for payload secrecy.' },
            { segment: 'show snmp user', meaning: 'Confirms active v3 authentication/privacy ciphers (note: v3 users do NOT print back into `show running-config`!).' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show snmp user & show snmp',
        healthyLabel: 'SNMPv3 `authPriv` Active',
        healthyOutput: `Authentication Protocol: SHA | Privacy Protocol: AES128 | Group-name: NMS_V3`,
        brokenLabel: 'Missing User in Running-Config Surprise / Mismatched Priv Level',
        brokenOutput: `Group set to v3 noauth while NMS polls with priv -> Packet dropped (authorizationError)!`,
        diagnosis:
          'Reminder: Cisco IOS hides SNMPv3 users from `show running-config` deliberately—ALWAYS use **`show snmp user`** (and copy startup config) to verify v3 users!',
      },
    },

    commonTraps: [
      {
        trap: 'Panicking when `show running-config` shows NO `snmp-server user` line!',
        reality: 'For security, IOS deliberately omits `snmp-server user` from `show running-config`—inspect configured v3 accounts with **`show snmp user`**!',
      },
      {
        trap: 'Swapping UDP 161 (Polling) and UDP 162 (Traps/Informs).',
        reality: 'NMS polling `GET/SET` targets Agent **UDP 161**; Agent `Trap/Inform` alerts target Manager **UDP 162**.',
      },
      {
        trap: 'Leaving `snmp-server community private RW` without an ACL.',
        reality: 'Cleartext `RW` lets anyone modify configs and routes via `SET`! Never expose v1/v2c RW; prefer SNMPv3 `authPriv`.',
      },
    ],

    keyTerms: [
      {
        term: 'MIB & OID',
        shortDef: 'MIB = structured tree database of device metrics; OID = dotted numeric address of one metric.',
        fullDef: 'Lets any multi-vendor NMS poll CPU, interface bytes, temperature, or routing counts consistently.',
      },
      {
        term: 'SNMP Trap vs Inform (UDP 162)',
        shortDef: 'Trap = unacknowledged Agent alert; Inform = acknowledged alert with retry.',
        fullDef: 'Both push immediate asynchronous alerts from device to NMS over UDP port 162.',
      },
      {
        term: 'SNMPv3 `authPriv`',
        shortDef: 'Highest SNMPv3 mode combining HMAC-SHA authentication and AES payload encryption.',
        fullDef: 'Eliminates plaintext community string leaks present in SNMPv1/v2c.',
      },
    ],

    checkQuestions: [
      {
        id: 'c54-q1',
        prompt: 'Which SNMP security configuration provides BOTH cryptographic authentication (SHA) AND payload encryption (AES-128)?',
        options: ['SNMPv3 `authPriv` (`priv`)', 'SNMPv3 `authNoPriv`', 'SNMPv2c `RW` community string', 'SNMPv3 `noAuthNoPriv`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **`authPriv`** (`priv`) authenticates messages via SHA/MD5 AND encrypts payloads via AES.',
          'Incorrect: `authNoPriv` authenticates without encrypting payloads.',
          'Incorrect: SNMPv2c sends community strings and MIB values in cleartext.',
          'Incorrect: `noAuthNoPriv` has neither authentication nor encryption.',
        ],
        takeaway: 'SNMPv3 `authPriv` = SHA authentication + AES encryption.',
      },
      {
        id: 'c54-q2',
        prompt: 'Why might an enterprise switch configure `snmp-server host 10.10.0.60 informs version 3 priv monuser` instead of a standard **Trap**?',
        options: [
          'Informs require the NMS Manager to send an acknowledgment receipt, ensuring critical failure alerts aren’t silently lost.',
          'Informs run over TCP port 22.',
          'Traps cannot report interface down events.',
          'Informs bypass the MIB.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Informs** add reliable acknowledgment over UDP 162 so agents retry if an alert drops; **Traps** are fire-and-forget.',
          'Incorrect: Both Traps and Informs use UDP port 162.',
          'Incorrect: Traps routinely report link-down events, just without guaranteed delivery.',
          'Incorrect: Both reference MIB OIDs.',
        ],
        takeaway: 'Trap = unacknowledged UDP 162; **Inform** = acknowledged UDP 162.',
      },
      {
        id: 'c54-q3',
        prompt: 'You configured `snmp-server user ops NMS_V3 v3 auth sha Pass1 priv aes 128 Pass2`, then ran `show running-config | include snmp-server user` and got zero output! What should you run to confirm the user actually exists?',
        options: ['`show snmp user`', '`show ip interface brief`', '`show access-lists`', '`show logging`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IOS intentionally hides SNMPv3 users from `show running-config`; **`show snmp user`** confirms active users and algorithms.',
          'Incorrect: Displays interface IPs.',
          'Incorrect: Displays ACL hits.',
          'Incorrect: Displays syslog buffer.',
        ],
        takeaway: 'Verify SNMPv3 accounts with **`show snmp user`** (never visible in `show running-config`).',
      },
      {
        id: 'c54-q4',
        prompt: 'An NMS server polls switch CPU counters every 60 seconds, while the switch sends urgent fan-failure notifications immediately. Which UDP ports correspond to **Polling** vs **Notifications**?',
        options: [
          'Polling = UDP 161; Notifications (Traps/Informs) = UDP 162',
          'Polling = UDP 162; Notifications = UDP 161',
          'Both use TCP 49',
          'Polling = UDP 514; Notifications = UDP 123',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Manager-to-Agent polling uses **UDP 161**; Agent-to-Manager Traps/Informs use **UDP 162**.',
          'Incorrect: Ports are swapped.',
          'Incorrect: TCP 49 is TACACS+.',
          'Incorrect: UDP 514 is Syslog; UDP 123 is NTP.',
        ],
        takeaway: 'Poll -> **UDP 161**; Trap/Inform -> **UDP 162**.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Deploy SNMPv3 `authPriv` & Inspect `show snmp user`',
      targetTab: 'labs',
      instructions: [
        'Configure an SNMPv3 `priv` group and SHA + AES-128 user, plus an Informs host target.',
        'Verify output via `show snmp group` and `show snmp user`.',
      ],
      verificationCheck: 'Can configure SNMPv3 `authPriv`, explain UDP 161 vs 162, and recall why `show snmp user` is required.',
    },

    summaryBullets: [
      'SNMP pairs an **NMS Manager**, managed **Agent**, **MIB** dictionary, and dotted numeric **OID** counters.',
      '**Polling (`GET`/`SET`)** runs Manager -> Agent over **UDP 161**; **Traps/Informs** run Agent -> Manager over **UDP 162**.',
      '**Informs** request an NMS receipt acknowledgment whereas **Traps** are fire-and-forget.',
      '**SNMPv1/v2c** use cleartext community strings; **SNMPv3 `authPriv`** adds SHA authentication and AES encryption.',
      'Check configured v3 users with **`show snmp user`** (IOS hides them from `show running-config`).',
    ],

    sourcesToVerify: [
      'Cisco IOS XE Network Management Configuration Guide — Configuring SNMPv3',
      'RFC 3414 — User-based Security Model (USM) for SNMPv3',
    ],
  },

  'ccna.core.ops.syslog': {
    id: 'ccna.core.ops.syslog',
    moduleId: 'ccna',
    unitTitle: 'Unit 6 / Unit 4: Network Operations & Logging',
    topicTitle: 'Syslog Messages, Facilities & Severity Levels',
    code: '5.6.1',
    title: 'Interpreting Syslog Message Anatomy, Facilities & Severity Levels (0–7)',
    readMinutes: 11,
    prerequisites: ['5.3.1 Management Approaches'],
    versionScope: 'shared',
    v11ExamTopics: ['4.5 Describe syslog features including facilities and levels'],
    v20ExamTopics: ['5.6 Interpret syslog message content, severity levels, and facilities'],

    learningObjectives: [
      'Decode every field of a Cisco IOS syslog line (`timestamp`, `%FACILITY-SEVERITY-MNEMONIC: description`).',
      'Memorize all eight **Syslog Severity Levels (`0` Emergency down to `7` Debugging)** using clean mnemonics (`Every Awesome Cisco Engineer Will Need Icecream Daily`).',
      'Predict which messages reach a central server (`logging trap <level>`) or console/RAM buffer (`logging buffered <level>`), because setting a level logs that number **and all lower/more severe numbers**.',
      'Configure external central syslog export (`logging host`, **UDP port 514**) paired with accurate `service timestamps log datetime msec`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Decoding `%LINK-3-UPDOWN` vs `%OSPF-5-ADJCHG` at 2:00 AM During an Outage',
      narrative:
        'A core switch loses power or flaps an uplink overnight—wiping volatile RAM buffers if logs lived only locally! When logs stream to a central **Syslog Server (UDP 514)** with accurate NTP timestamps, you immediately see `%LINEPROTO-5-UPDOWN`, `%CDP-4-NATIVE_VLAN_MISMATCH`, `%PM-4-ERR_DISABLE` (e.g., `psecure-violation`), or `%SPANTREE-2-BLOCK_BPDUGUARD`. Reading that single `%FACILITY-SEVERITY-MNEMONIC` tag instantly reveals *which feature fired* and *how bad it is* (`0` catastrophic down to `7` verbose debug).',
    },

    plainEnglish: {
      analogyTitle: 'Think of Hospital Pager Alerts Ranked Priority 0 (Code Blue) to 7 (Lab Chatter)',
      analogy:
        'Every Cisco switch writes running diary entries whenever cables unplug, OSPF peers connect, or ACLs drop packets. Those diary entries are **Syslog messages**. Each line wears an exact **0–7 urgency badge**: **Level 0** means "Building on fire—system unusable!"; **Level 3** means an interface error; **Level 5** means normal big milestone (like OSPF reaching Full!); **Level 7** means hyper-detailed troubleshooting chatter. Best rule to remember: if you subscribe to **Level 4 (Warnings)**, you automatically receive **0, 1, 2, 3, AND 4**—everything as bad or worse!',
      technicalDefinition:
        'Syslog (RFC 5424 / Cisco format) standardizes event logging to console, VTY (`terminal monitor`), RAM (`logging buffered`), or external collectors over **UDP port 514** (optionally TCP/TLS 6514). Cisco messages follow `seq#: *timestamp: %FACILITY-SEVERITY-MNEMONIC: message text`, spanning severity **0 (Emergency)** through **7 (Debugging)**, where setting threshold `N` exports levels `0` through `N`.',
      paragraphs: [
        'Memorize the exact **0–7 Severity Ladder** (every CCNA exam tests these numbers!):\n• **0 = Emergencies** (System unusable)\n• **1 = Alerts** (Immediate action needed)\n• **2 = Critical** (Critical hardware/software fault)\n• **3 = Errors** (e.g., `%LINK-3-UPDOWN` interface down)\n• **4 = Warnings** (e.g., `%CDP-4-NATIVE_VLAN_MISMATCH`)\n• **5 = Notifications** (Normal significant event, e.g., `%OSPF-5-ADJCHG`)\n• **6 = Informational** (Normal operational state, e.g., `%SYS-6-LOGGINGHOST_STARTSTOP`)\n• **7 = Debugging** (`debug` command output)\n*Mnemonic: "**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**cecream **D**aily" (0–7).*',
        'Two subtle syslog gotchas catch beginners constantly:\n1. **SSH VTY sessions hide console logs by default!** If you SSH into a switch and run `debug` or watch interfaces flap, you see nothing unless you type **`terminal monitor`** in Privileged EXEC (`#`)!\n2. Always include `service timestamps log datetime msec` + NTP so `%SYS-5-CONFIG_I` carries real calendar time instead of arbitrary uptime (`*Mar 1 00:04:12`).',
      ],
    },

    deepDive: {
      intro:
        'Dissect a real Cisco syslog entry field-by-field and configure centralized external logging.',
      steps: [
        {
          step: 'Anatomy',
          title: 'Dissecting `%FACILITY-SEVERITY-MNEMONIC: description` & `local0`–`local7` Facilities',
          explanation:
            'Example: `*Oct 14 09:22:11.402 UTC: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down` (or `%PM-4-ERR_DISABLE: psecure-violation error detected on Gi0/5`).\n• **Timestamp**: `*Oct 14 09:22:11.402 UTC` (leading `*` means unsynced clock if NTP missing!)\n• **Facility**: `LINK` or `PM` (IOS subsystem tag). When sending remotely, `logging facility local7` tags packets with standardized **`local0`–`local7`** buckets (default **`local7`** on Cisco IOS) so external SIEM/Syslog servers can sort routers/switches into separate log files.\n• **Severity**: `3` (Errors) or `4` (Warnings).\n• **Mnemonic**: `UPDOWN` or `ERR_DISABLE` (exact event code).',
        },
        {
          step: 'Filtering',
          title: 'Cumulative Thresholds (`0` to `N`)',
          explanation:
            'Configuring `logging trap warnings` (`4`) sends levels **0, 1, 2, 3, and 4** to the Syslog server while silently ignoring `5` (Notifications), `6` (Informational), and `7` (Debugging) so storage isn’t flooded.',
        },
        {
          step: 'Destinations',
          title: 'Four Syslog Outputs & `terminal monitor`',
          explanation:
            '1) **Console** (`logging console`) — always on locally.\n2) **VTY Monitor** (`logging monitor` + user types `terminal monitor` per SSH session).\n3) **RAM Buffer** (`logging buffered 16384` -> viewed via `show logging`).\n4) **External Server** (`logging host 10.10.0.70`, UDP `514`, survives power loss!).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Cisco Syslog Anatomy & 0–7 Severity Filter Behavior',
        asciiFallback: `*Oct 14 09:22:11.402: %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on Gi0/0 from LOADING to FULL
 |___________________|  |___| | |____|  |________________________________________________________|
       Timestamp       Facil Sev Mnemonic                     Human Message

Filter example: logging trap 4 (warnings)
  Logs sent:  [0:Emerg] [1:Alert] [2:Crit] [3:Error] [4:Warn]   ---> UDP/514 ---> [Syslog Server]
  Ignored:    [5:Notice] [6:Info] [7:Debug]`,
      },
      workedExample: {
        title: 'Worked Syslog Triage: Missing OSPF Notification After Setting `logging trap 3`',
        context:
          'An engineer sets `logging trap errors` (`3`) on R1, then wonders why `%OSPF-5-ADJCHG` neighbor Full messages never appear on the Syslog server.',
        steps: [
          'Inspect the severity digit inside `%OSPF-5-ADJCHG`: severity is **`5` (Notifications)**.',
          'Recall cumulative rule: `logging trap 3` forwards ONLY levels `0, 1, 2, and 3`—dropping `4`, `5`, `6`, `7`!',
          'Update config to `logging trap informational` (`6`) or `notifications` (`5`), plus `service timestamps log datetime msec`.',
        ],
        outcome:
          '`%OSPF-5-ADJCHG` and `%CDP-4-NATIVE_VLAN_MISMATCH` now stream cleanly to `10.10.0.70:514`.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure reliable external syslog export and view active logging thresholds.',
      commands: [
        {
          title: 'Configure Syslog Host, Buffer, Source & Timestamps',
          promptAndCommand: `R1(config)# service timestamps log datetime msec localtime show-timezone
R1(config)# logging host 10.10.0.70
R1(config)# logging trap notifications
R1(config)# logging source-interface Loopback0
R1(config)# logging buffered 32768 informational`,
          output: `R1# show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited)
    Console logging: level debugging, 48 messages logged
    Monitor logging: level debugging, 0 messages logged
    Buffer logging:  level informational, 48 messages logged
    Trap logging:    level notifications, 42 message lines logged
        Logging to 10.10.0.70  (udp port 514, link up)`,
          lineByLine: [
            { segment: 'logging trap notifications', meaning: 'Sends severity levels `0–5` to `10.10.0.70` over UDP 514.' },
            { segment: 'logging source-interface Loopback0', meaning: 'Stamps every syslog packet with stable Loopback0 IP so SIEM/Syslog rules always match.' },
            { segment: 'Monitor logging', meaning: 'Remember: active SSH users must run `terminal monitor` to see live logs!' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show logging',
        healthyLabel: 'External Server Active & Timestamped',
        healthyOutput: `Trap logging: level informational, 142 message lines logged
Logging to 10.10.0.70 (udp port 514, link up)`,
        brokenLabel: 'Unsent / Missing SSH Logs',
        brokenOutput: `Trap logging: level emergencies (only level 0!) OR user forgot terminal monitor`,
        diagnosis:
          'Always check `Trap logging: level ...` (`notifications`/`informational`) and remember `terminal monitor` when logged in via SSH.',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking Severity `7` is the most urgent emergency level.',
        reality: 'Backwards! **`0` (Emergency)** = catastrophic crash; **`7` (Debugging)** = lowest urgency verbose chatter.',
      },
      {
        trap: 'Assuming `logging trap 4` logs *only* level 4.',
        reality: 'Setting `logging trap 4` logs **levels 0, 1, 2, 3, AND 4** cumulatively!',
      },
      {
        trap: 'Running `debug ip ospf adj` over SSH and thinking nothing is happening because nothing prints.',
        reality: 'Console shows logs automatically, whereas SSH VTY sessions suppress live logs until you type **`terminal monitor`**!',
      },
    ],

    keyTerms: [
      {
        term: 'Syslog Facility & Mnemonic',
        shortDef: 'System component (`%LINK`, `%OSPF`, `%SYS`) and exact event label (`UPDOWN`, `ADJCHG`).',
        fullDef: 'Lets engineers and SIEM tools identify which subsystem generated an alert immediately.',
      },
      {
        term: 'Syslog Severity (0–7)',
        shortDef: '0 Emerg, 1 Alert, 2 Crit, 3 Error, 4 Warn, 5 Notice, 6 Info, 7 Debug.',
        fullDef: 'Lower numeric value = higher criticality; threshold `N` exports `0..N`.',
      },
      {
        term: 'terminal monitor',
        shortDef: 'Privileged EXEC command enabling live syslog/debug display on an SSH/Telnet VTY session.',
        fullDef: 'Disable afterward with `terminal no monitor` (and `undebug all`) before disconnecting.',
      },
    ],

    checkQuestions: [
      {
        id: 'c56-q1',
        prompt: 'While inspecting `show logging`, you see:\n`%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1`\nWhat do **`4`** and **`CDP`** identify?',
        options: [
          '`CDP` is the reporting Facility; `4` is Severity Level Warnings.',
          '`4` means 4 VLANs are broken; `CDP` is the Mnemonic.',
          '`4` is Emergency Priority; `CDP` is the server IP.',
          '`4` is Debugging; `CDP` is Severity.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Cisco syslog syntax is `%FACILITY-SEVERITY-MNEMONIC` -> Facility = `CDP`, Severity = `4` (Warnings), Mnemonic = `NATIVE_VLAN_MISMATCH`.',
          'Incorrect: `NATIVE_VLAN_MISMATCH` is the mnemonic; `4` is severity.',
          'Incorrect: Level 0 is Emergency; level 4 is Warnings.',
          'Incorrect: Level 7 is Debugging.',
        ],
        takeaway: 'Format is always `%FACILITY-SEVERITY-MNEMONIC` (and `4` = Warnings).',
      },
      {
        id: 'c56-q2',
        prompt: 'An engineer configures `logging trap errors` (`level 3`) on Switch SW1. Which severity levels are sent to the central Syslog server?',
        options: ['Levels 0, 1, 2, and 3', 'Level 3 only', 'Levels 3, 4, 5, 6, and 7', 'Level 7 only'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Syslog thresholds capture the specified level plus **all more severe (lower numeric) levels (`0–3`)**.',
          'Incorrect: Thresholds are cumulative from `0` up to `N`.',
          'Incorrect: `4–7` are *less* severe than Errors and are filtered out.',
          'Incorrect: Debugging (`7`) is excluded unless `debugging` is configured.',
        ],
        takeaway: '`logging trap <N>` exports levels `0` through `N`.',
      },
      {
        id: 'c56-q3',
        prompt: 'You SSH into Core Router R1 and see zero syslog output when an interface bounces—even though someone sitting on the physical console sees `%LINK-3-UPDOWN` messages. Which command turns live logs on for your SSH session?',
        options: ['`terminal monitor`', '`logging trap 7`', '`logging console`', '`service timestamps`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Remote VTY sessions require **`terminal monitor`** in Privileged EXEC to print live syslog/debug output.',
          'Incorrect: `logging trap` sends logs to an external UDP 514 server.',
          'Incorrect: `logging console` controls the physical serial console port only.',
          'Incorrect: `service timestamps` formats timestamps on log entries.',
        ],
        takeaway: 'In SSH sessions, run **`terminal monitor`** to view live console logs.',
      },
      {
        id: 'c56-q4',
        prompt: 'Match the Syslog severity levels in order from `0` to `7`: which pair correctly identifies **Level 0** and **Level 5**?',
        options: [
          'Level 0 = Emergencies; Level 5 = Notifications',
          'Level 0 = Debugging; Level 5 = Critical',
          'Level 0 = Informational; Level 5 = Errors',
          'Level 0 = Warnings; Level 5 = Alerts',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: 0 Emerg, 1 Alert, 2 Crit, 3 Error, 4 Warn, **5 Notice (Notifications)**, 6 Info, 7 Debug.',
          'Incorrect: Debugging is 7; Critical is 2.',
          'Incorrect: Informational is 6; Errors is 3.',
          'Incorrect: Warnings is 4; Alerts is 1.',
        ],
        takeaway: 'Every Awesome Cisco Engineer Will Need Icecream Daily (0–7).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Syslog Thresholds & Message Decoding Drill',
      targetTab: 'labs',
      instructions: [
        'Configure `logging host 10.10.0.70`, `logging trap notifications`, `logging source-interface Loopback0`, and `service timestamps log datetime msec`.',
        'Practice translating `logging trap warnings` into exact included levels (`0–4`) vs excluded (`5–7`).',
      ],
      verificationCheck: 'Decodes `%FACILITY-SEVERITY-MNEMONIC`, recalls UDP 514, and memorizes 0–7 severity order.',
    },

    summaryBullets: [
      'Syslog sends structured event logs to console, VTY (`terminal monitor`), RAM (`show logging`), or servers (**UDP port 514**).',
      'Cisco log structure: `timestamp: %FACILITY-SEVERITY-MNEMONIC: description`.',
      'Severity levels `0–7`: **0 Emerg, 1 Alert, 2 Crit, 3 Error, 4 Warn, 5 Notice, 6 Info, 7 Debug**.',
      'Configuring `logging trap <N>` forwards levels `0` through `N` (most severe down to `N`).',
      'Pair Syslog with **NTP** and `service timestamps log datetime msec` so cross-device outage timelines align.',
    ],

    sourcesToVerify: [
      'Cisco IOS XE System Message Logging Configuration Guide',
      'RFC 5424 — The Syslog Protocol',
    ],
  },

  'ccna.core.ops.ansible': {
    id: 'ccna.core.ops.ansible',
    moduleId: 'ccna',
    unitTitle: 'Unit 6 / Unit 5: Configuration Management & IaC',
    topicTitle: 'Configuration Management with Ansible',
    code: '5.5.1',
    title: 'Configuration Management with Ansible: Agentless SSH, YAML Playbooks, Inventory & Idempotency',
    readMinutes: 13,
    prerequisites: ['5.3.1 Management Approaches'],
    versionScope: 'shared',
    v11ExamTopics: ['6.6 Recognize capabilities of configuration management mechanisms (Terraform and Ansible)'],
    v20ExamTopics: ['5.5 Configuration management with Ansible'],

    learningObjectives: [
      'Explain why **Ansible** fits Cisco routers/switches natively: **agentless** execution pushing config over **SSH** or **NETCONF/RESTCONF** (no Linux agent installed on Catalyst switches!).',
      'Identify the four core Ansible building blocks: **Control Node**, **Inventory** (`hosts` INI/YAML), **Playbook** (YAML tasks), and **Modules** (`cisco.ios.ios_vlans` / `ios_config`).',
      'Define **Idempotency**: running the exact same Ansible playbook twice leaves devices in the exact same desired state (`changed=0` on run 2) with zero duplicate side effects.',
      'Contrast Ansible (procedural/desired-config tasks, agentless push over SSH, YAML) with Terraform (infrastructure provisioning & `.tfstate` lifecycle, HCL) for v1.1 revision.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Installing Agents on Switch Hardware Fails—and Why Agentless Ansible Won Networking',
      narrative:
        'Traditional server tools like Chef and Puppet expected you to install a software agent daemon right on top of Ubuntu or Windows. You cannot simply `apt install` a Ruby agent onto a closed Cisco Catalyst switch OS! **Ansible** solved network automation immediately because it is **100% agentless**: a central Linux **Control Node** simply reads a YAML **Playbook** and pushes structured modules directly to your switches over ordinary **SSH (TCP 22)** or **NETCONF**.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Conductor Reading Sheet Music Over Radio vs Installing Musicians Inside Every Instrument',
      analogy:
        'Agent-based server automation places a resident technician inside every building permanently. **Ansible** leaves zero extra software inside your switches! One central **Control Node** reads your **Inventory** (the phonebook listing Switch IPs and groups like `[access_switches]`) and executes a **Playbook** written in human-readable **YAML** (indentation-driven key-value lists). Best of all, Ansible checks before changing: if VLAN 20 *already* exists, Ansible says **`ok`** instead of duplicating commands—a superpower called **Idempotency**.',
      technicalDefinition:
        'Ansible is an open-source, **agentless** configuration management and automation engine executed from a Linux/WSL **Control Node** over **SSH** or APIs (`NETCONF`/`HTTPAPI`). Desired configurations are written in human-readable **YAML Playbooks** targeting managed hosts grouped inside an **Inventory** file using vendor **Modules** (e.g., `cisco.ios.ios_config`, `cisco.ios.ios_vlans`), enforcing **idempotent** execution so repeated runs leave unchanged compliant targets untouched (`ok` vs `changed`).',
      paragraphs: [
        'For **CCNA v2.0 Topic 5.5**, recognize every Ansible file and concept on sight:\n• **Control Node**: Linux workstation/server running `ansible-playbook` (Windows cannot be a native Control Node without WSL).\n• **Inventory**: lists managed switch/router IPs or FQDNs grouped cleanly (`[campus_switches]`, `[branch_routers]`) plus connection vars (`ansible_network_os: cisco.ios.ios`).\n• **Playbook**: **YAML** file (`.yml`) starting with `---`, containing Plays (`hosts:`, `gather_facts: false`, `tasks:`). Careful: **YAML strictly forbids TAB characters**—use 2-space indentation!\n• **Idempotency**: Run 1 creates VLAN 30 (`changed=1`); Run 2 sees VLAN 30 already exists (`changed=0`, `ok=1`).',
        'Notice **CCNA v1.1 addendum note**: v1.1 Topic 6.6 pairs **Ansible** with **Terraform**. **Terraform** uses **HCL** syntax and maintains a **`.tfstate`** file tracking provisioned cloud/controller infrastructure lifecycle (`plan` -> `apply` -> `destroy`), whereas **Ansible** excels at configuring OS/CLI/API device settings day-to-day agentlessly.',
      ],
    },

    deepDive: {
      intro:
        'Read a real Cisco IOS XE Ansible Inventory + YAML Playbook line by line.',
      steps: [
        {
          step: 'File 1',
          title: 'The Inventory File (`inventory.ini`)',
          explanation:
            'Defines host groups and device metadata:\n`[core_switches]`\n`sw1 ansible_host=10.10.1.11`\n`sw2 ansible_host=10.10.1.12`\n`[core_switches:vars]`\n`ansible_connection=ansible.netcommon.network_cli`\n`ansible_network_os=cisco.ios.ios`',
        },
        {
          step: 'File 2',
          title: 'The YAML Playbook, Jinja2 Templates (`.j2`) & Core `cisco.ios` Modules',
          explanation:
            'Uses `- name:` list items (2-space indented, NO tabs!), `hosts: core_switches`, `gather_facts: false`, and invokes idempotent modules such as **`cisco.ios.ios_command`** (run read-only `show` checks), **`cisco.ios.ios_config`** (push/verify CLI blocks), **`cisco.ios.ios_facts`** (gather structured inventory/IOS telemetry), and **`cisco.ios.ios_vlans`**. Pair playbooks with **Jinja2 templates (`.j2`)** (`ansible.builtin.template` / `src` templates) so one reusable skeleton renders per-site configs from YAML `group_vars`/`host_vars` automatically! Protect inventory passwords/SSH keys cleanly using **`ansible-vault`** (`ansible-vault encrypt group_vars/all/vault.yml`) rather than plaintext in Git!',
        },
        {
          step: 'Concept',
          title: 'Idempotency & Check Mode (`--check`)',
          explanation:
            'Running `ansible-playbook -i inventory.ini configure_vlans.yml --check --diff` previews *exact* diffs without touching switches! Executing normally runs Run 1 (`changed=2`) and Run 2 (`ok=2, changed=0`).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Agentless Ansible Control Node Executing Playbook Against Cisco Fleet',
        asciiFallback: `[Linux Control Node]  (Reads inventory.ini + playbook.yml + Git)
   |
   |--- SSH / NETCONF (NO agent installed on switches!) ---> [SW1: cisco.ios.ios_vlans -> changed=1]
   |--- SSH / NETCONF -------------------------------------> [SW2: already has VLAN 20 -> ok=1, changed=0]`,
      },
      workedExample: {
        title: 'Worked Playbook Trace: Idempotent VLAN Deployment',
        context:
          'You run `ansible-playbook -i hosts.ini vlans.yml` across `sw1` (missing VLAN 20) and `sw2` (already has VLAN 20 `STAFF_DATA`).',
        steps: [
          'Ansible connects via SSH (`network_cli`) to both switches simultaneously.',
          'Before pushing blindly, `cisco.ios.ios_vlans` inspects existing `show vlan` state on each box.',
          'On `sw1`, VLAN 20 is absent -> pushes `vlan 20 / name STAFF_DATA` -> reports **`changed: [sw1]`**.',
          'On `sw2`, VLAN 20 `STAFF_DATA` matches already -> pushes zero config -> reports **`ok: [sw2]`** (`changed=0`!).',
        ],
        outcome:
          'Zero duplicate disruptions on compliant switches and instant remediation on non-compliant ones.',
      },
    },

    iosCliGuide: {
      intro:
        'Recognize valid Ansible YAML Playbook + Inventory syntax and IOS output diffs cleanly.',
      commands: [
        {
          title: 'Sample Idempotent Cisco IOS Ansible Playbook (`vlans.yml`)',
          promptAndCommand: `---
- name: Ensure campus VLANs exist
  hosts: core_switches
  gather_facts: false
  tasks:
    - name: Configure VLAN 20
      cisco.ios.ios_vlans:
        config:
          - name: STAFF_DATA
            vlan_id: 20
        state: merged`,
          output: `$ ansible-playbook -i hosts.ini vlans.yml
PLAY RECAP *****************************************************
sw1  : ok=1  changed=1  unreachable=0  failed=0
sw2  : ok=1  changed=0  unreachable=0  failed=0`,
          lineByLine: [
            { segment: '---', meaning: 'Standard YAML document header.' },
            { segment: 'gather_facts: false', meaning: 'Skips Linux OS fact gathering (faster & avoids errors on network CLI).' },
            { segment: 'changed=1 vs changed=0', meaning: 'Demonstrates idempotency: `sw1` updated, already-compliant `sw2` skipped safely.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'ansible-playbook -i hosts.ini vlans.yml --syntax-check',
        healthyLabel: 'Clean YAML Spaces & Valid Playbook',
        healthyOutput: `playbook: vlans.yml (Syntax OK — 2-space indentation, valid module)`,
        brokenLabel: 'Tab Character / Indentation Error',
        brokenOutput: `ERROR! Syntax Error while loading YAML: found character '\\t' that cannot start any token`,
        diagnosis:
          'YAML parsers reject TAB characters immediately—always configure editors to insert spaces (typically 2 spaces per level).',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking Cisco switches require installing an Ansible daemon/agent locally on IOS XE.',
        reality: '**Ansible is agentless**—the Control Node communicates over standard SSH (`network_cli`) or NETCONF/RESTCONF.',
      },
      {
        trap: 'Confusing YAML (Ansible) with HCL (Terraform) or thinking Terraform is agentless-stateless.',
        reality: '**Ansible** uses **YAML** and is stateless/push-based; **Terraform** uses **HCL** and tracks resources inside a **state file** (`.tfstate`).',
      },
      {
        trap: 'Using TAB characters inside Ansible YAML playbooks.',
        reality: 'YAML strictly forbids tabs for indentation—always use consistent spaces.',
      },
    ],

    keyTerms: [
      {
        term: 'Agentless Architecture',
        shortDef: 'Automation model requiring zero client software installed on managed switches/routers.',
        fullDef: 'Ansible connects from the Control Node over SSH/NETCONF natively supported by Cisco IOS.',
      },
      {
        term: 'YAML Playbook & Inventory',
        shortDef: 'Inventory lists managed targets/groups; Playbook lists YAML automation tasks.',
        fullDef: 'Uses 2-space indentation (`---`) and Cisco resource modules (`cisco.ios.ios_vlans`).',
      },
      {
        term: 'Idempotency',
        shortDef: 'Property ensuring repeated execution produces the exact same end state without re-applying changes.',
        fullDef: 'Guarantees `changed=0` on already-compliant devices.',
      },
    ],

    checkQuestions: [
      {
        id: 'c55-q1',
        prompt: 'Why can Ansible manage standard Cisco IOS switches immediately without installing extra agent software onto switch flash memory?',
        options: [
          'Ansible is **agentless**, connecting from the Control Node directly over SSH/NETCONF.',
          'Cisco IOS runs a built-in Ansible agent in ROMMON.',
          'Ansible broadcasts changes using ARP frames.',
          'Switches download a Puppet Master kernel automatically.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Ansible pushes tasks agentlessly over standard SSH or NETCONF/API transports.',
          'Incorrect: Switches have no preinstalled Ansible agent.',
          'Incorrect: Ansible uses IP SSH/APIs, not ARP.',
          'Incorrect: Puppet is traditionally agent-based on servers.',
        ],
        takeaway: 'Ansible = **agentless** (SSH / NETCONF from a Linux Control Node).',
      },
      {
        id: 'c55-q2',
        prompt: 'An engineer runs an Ansible playbook configuring `vlan 20` on 10 switches and sees `changed=10`. Five minutes later, nobody touched the switches and they run the exact same playbook again—seeing `ok=10, changed=0`. Which property does this illustrate?',
        options: ['Idempotency', 'Polymorphism', 'Split-Horizon', 'Dynamic NAT Overload'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Idempotency** ensures re-running a playbook verifies current state and skips redundant edits when reality already matches desired config.',
          'Incorrect: Object-oriented programming term.',
          'Incorrect: Distance-vector routing loop prevention rule.',
          'Incorrect: IPv4 address translation.',
        ],
        takeaway: 'Running the same playbook twice gives `changed=0` on run 2 = **Idempotency**.',
      },
      {
        id: 'c55-q3',
        prompt: 'In Ansible automation, which file defines the IP addresses, groups (such as `[branch_routers]`), and `ansible_network_os` values of managed devices?',
        options: ['Inventory file', 'YAML Playbook', '`show running-config`', 'DHCP binding table'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The **Inventory** lists managed hosts, groups, and connection variables (`-i hosts.ini`).',
          'Incorrect: Playbooks define *tasks* executed against hosts listed in the Inventory.',
          'Incorrect: IOS device config.',
          'Incorrect: Switch L2 snooping table.',
        ],
        takeaway: 'Inventory = *Who* to manage; Playbook (YAML) = *What* tasks to apply.',
      },
      {
        id: 'c55-q4',
        prompt: 'Which data serialization language are Ansible Playbooks written in, and what whitespace rule triggers a syntax error if violated?',
        options: [
          '**YAML** — tabs are forbidden; use consistent spaces for indentation',
          '**HCL** — semicolons required on every line',
          '**JSON** — comments required starting with `#`',
          '**XML** — unclosed brackets ignored',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Ansible playbooks use **YAML** (`.yml`), which relies on consistent spaces and throws parser errors on TAB characters.',
          'Incorrect: HCL is Terraform’s language.',
          'Incorrect: JSON uses braces/brackets and doesn’t support `#` comments.',
          'Incorrect: XML requires matching closing tags and isn’t Ansible’s playbook format.',
        ],
        takeaway: 'Ansible Playbooks = **YAML** (spaces only, no tabs!).',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Read & Debug an Ansible Playbook Snippet',
      instructions: [
        'Inspect a 12-line `hosts.ini` + `vlans.yml` playbook and identify Control Node, Inventory, Module, and Playbook parts.',
        'Explain what `--check --diff` outputs before live execution.',
      ],
      verificationCheck: 'Explains agentless SSH push, Inventory vs YAML Playbook, and Idempotency cleanly.',
    },

    summaryBullets: [
      '**Ansible** is **agentless**—running from a Linux Control Node over SSH/NETCONF without agents installed on switches.',
      'Core pieces: **Control Node**, **Inventory** (device lists/groups), **YAML Playbooks** (tasks), and **Modules** (`cisco.ios.*`).',
      '**YAML** relies on consistent spaces (no TABs!).',
      '**Idempotency** ensures re-running playbooks leaves already-compliant switches untouched (`changed=0`).',
      'Compare with Terraform (v1.1): Ansible pushes config via YAML; Terraform provisions infra via HCL + `.tfstate`.',
    ],

    sourcesToVerify: [
      'Ansible Documentation — Network Automation & Cisco IOS Collection (`cisco.ios`)',
      'Cisco DevNet — Automating Cisco IOS XE with Ansible',
    ],
  },
};
