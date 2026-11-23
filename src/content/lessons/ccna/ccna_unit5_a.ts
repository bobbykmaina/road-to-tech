import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT5_A_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.v11.5.1': {
    id: 'ccna.v11.5.1',
    moduleId: 'ccna',
    unitTitle: 'Unit 5: Security Fundamentals (v1.1)',
    topicTitle: '5.1 Key Security Concepts',
    code: '5.1.1',
    title: 'Key Security Concepts: Threats, Vulnerabilities, Exploits & Mitigation Techniques',
    readMinutes: 10,
    prerequisites: ['What a Network Is'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['5.1 Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques)'],

    learningObjectives: [
      'Define and cleanly distinguish a **Threat**, a **Vulnerability**, an **Exploit**, and a **Mitigation** technique.',
      'Explain the **CIA Triad** (Confidentiality, Integrity, Availability) as the foundation of every security control.',
      'Categorize common enterprise attacks including phishing, social engineering, ransomware, DDoS, Man-in-the-Middle (MitM), and credential stuffing.',
      'Select layered **Defense-in-Depth** mitigations spanning patching, MFA, segmentation, and least privilege.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why One Unpatched VPN Gateway Exposes an Entire Corporate Network',
      narrative:
        'A company runs an older VPN firewall whose firmware has not been patched in 14 months. Two weeks later, attackers publish automated code on the internet that bypasses login on that exact firmware version, and overnight ransomware encrypts the file server. Every security incident breaks down into four terms tested relentlessly: the **vulnerability** (the unpatched firmware bug), the **threat** (ransomware operators), the **exploit** (the automated bypass script), and the **mitigation** (timely patching, MFA, and network segmentation).',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Broken Window Latch, a Burglar, a Crowbar, and Motion-Sensor Deadbolts',
      analogy:
        'A rusted latch on a ground-floor window is a **Vulnerability** (an existing weakness). A neighborhood burglar hoping to break in is a **Threat** (potential danger). The crowbar method used to pop that weak latch is the **Exploit** (the technique abusing the weakness). Installing reinforced locks, deadbolts, and alarm sensors creates layered **Mitigation** so no single weak spot compromises the whole building.',
      technicalDefinition:
        'In network security, **Risk** emerges where a **Threat** (any actor or event capable of causing harm) discovers a **Vulnerability** (a design, code, or configuration flaw) and executes an **Exploit** (code or technique leveraging that flaw) against Confidentiality, Integrity, or Availability (**CIA Triad**). **Mitigation** reduces likelihood or impact through layered administrative, technical, and physical controls.',
      paragraphs: [
        'Do not blur **Vulnerability** and **Exploit** together: a vulnerability sits passively inside software or config *even before anyone attacks it* (for instance, leaving Telnet open or running outdated IOS XE software). An **Exploit** is the active weapon or command sequence an attacker launches against that weakness.',
        'Every security architecture defends three pillars called the **CIA Triad**: **Confidentiality** (only authorized parties read data—protected via encryption & ACLs), **Integrity** (data is not silently altered in transit—protected via SHA-256/HMAC hashes), and **Availability** (authorized users can reach services reliably—protected via redundancy, FHRP, and DDoS filtering).',
        'Relying on one perimeter firewall fails the instant an employee clicks a phishing email inside the building. **Defense-in-Depth** stacks independent layers—MFA at identity, VLAN segmentation and DAI at switches, ACLs/IPS at routing boundaries, and immutable offline backups for recovery.',
      ],
    },

    deepDive: {
      intro:
        'Map the threat-to-mitigation vocabulary alongside major attack families tested on CCNA v1.1 Domain 5.1.',
      steps: [
        {
          step: 'Concept 1',
          title: 'Threat vs. Vulnerability vs. Exploit vs. Risk',
          explanation:
            '**Threat**: external hacker, malicious insider, malware, or disaster. **Vulnerability**: unpatched CVE, default password, open unused port. **Exploit**: malicious payload abusing that flaw. **Mitigation**: control removing the flaw or containing blast radius.',
        },
        {
          step: 'Concept 2',
          title: 'Human-Targeted Threats: Phishing, Vishing & Social Engineering',
          explanation:
            'Attackers trick humans instead of cracking AES-256 encryption: email **phishing**, SMS **smishing**, voice **vishing** (impersonating executives to bypass password checks), and targeted **spear phishing**.',
        },
        {
          step: 'Concept 3',
          title: 'Network & Availability Threats: MitM, Spoofing, Malware & DDoS',
          explanation:
            '**Man-in-the-Middle (MitM)** intercepts frames silently (e.g., ARP spoofing); **DDoS** floods links/CPUs from botnets to break Availability; **Ransomware** encrypts files and demands extortion.',
        },
        {
          step: 'Concept 4',
          title: 'Defense-in-Depth Mitigation Toolkit',
          explanation:
            'Enforce **Least Privilege**, patch management, **MFA**, VLAN + firewall segmentation, L2 switch security (DAI/DHCP snooping), immutable **3-2-1 backups**, and staff security training.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Threat Risk Chain & Defense-in-Depth Mitigation Layers',
        asciiFallback: `[Threat: Adversary / Malware]  +  [Vulnerability: Unpatched App / Plaintext / Human]
            |
            v  (Leverages)
     [Exploit / Attack]  --->  Threatens CIA Triad (Confidentiality / Integrity / Availability)
            ^
            |  (Blocked or Minimized by Defense-in-Depth)
  [Perimeter NGFW/IPS] -> [VLANs & L2 Security] -> [Endpoint EDR & Patching] -> [MFA & Least Privilege]`,
      },
      workedExample: {
        title: 'Worked Classification Drill: Deconstructing a LAN Incident',
        context:
          'A branch switch leaves Telnet open on TCP 23 with default password `cisco`. An unauthorized contractor plugs into an open conference-room jack, runs Wireshark, captures the admin login, and deletes VLAN 10.',
        steps: [
          'Identify **Vulnerability**: Open unencrypted Telnet (`TCP 23`), weak default credential (`cisco`), and active unauthenticated wall-jack switch port.',
          'Identify **Threat**: Unauthorized contractor insider.',
          'Identify **Exploit**: Passive LAN sniffing + logging in with captured plaintext credentials.',
          'Apply **Mitigations**: Disable Telnet (`transport input ssh`), shut down unused jacks + Port Security/802.1X, switch to strong hashed/AAA credentials (`TACACS+`).',
        ],
        outcome:
          'Separating weakness, actor, technique, and countermeasure turns a breach story into an exact engineering checklist.',
      },
    },

    iosCliGuide: {
      intro:
        'Apply baseline hardening commands on Cisco IOS devices to close common local vulnerabilities.',
      commands: [
        {
          title: 'Baseline Hardening Checks on Cisco IOS',
          promptAndCommand: `SW1(config)# no ip http server
SW1(config)# ip http secure-server
SW1(config)# interface range GigabitEthernet0/10 - 24
SW1(config-if-range)# shutdown`,
          output: `SW1# show ip interface brief | include administratively down
GigabitEthernet0/10   unassigned  YES unset  administratively down down`,
          lineByLine: [
            { segment: 'no ip http server', meaning: 'Closes plaintext HTTP management to preserve Confidentiality.' },
            { segment: 'shutdown', meaning: 'Disables unused conference/hallway ports so attackers cannot plug in freely.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show running-config | include http|transport input',
        healthyLabel: 'Reduced Attack Surface',
        healthyOutput: `no ip http server
ip http secure-server
transport input ssh`,
        brokenLabel: 'Unencrypted Management Vulnerabilities',
        brokenOutput: `ip http server
transport input telnet`,
        diagnosis:
          'Running cleartext `http` or `telnet` exposes every credential on the wire—turning routine administration into a sniffing exploit.',
      },
    },

    commonTraps: [
      {
        trap: 'Calling a missing software patch an "Exploit".',
        reality: 'An unpatched bug or weak setting is a **Vulnerability**; the malicious payload or technique abusing it is the **Exploit**.',
      },
      {
        trap: 'Confusing **Confidentiality** with **Integrity** inside the CIA Triad.',
        reality: '**Confidentiality** stops unauthorized *reading* (encryption); **Integrity** stops unauthorized/undetected *modification* (hashes/signatures).',
      },
      {
        trap: 'Thinking a perimeter firewall alone stops insider threats or phished employee credentials.',
        reality: 'Once an attacker holds valid user credentials or plugs into an open jack, Defense-in-Depth (MFA, segmentation, least privilege) is mandatory.',
      },
    ],

    keyTerms: [
      {
        term: 'Vulnerability',
        shortDef: 'Any flaw, bug, misconfiguration, or weak control that could be abused.',
        fullDef: 'Exists inside software, hardware, or human procedures prior to any active attack.',
      },
      {
        term: 'Threat vs. Exploit',
        shortDef: 'Threat = potential source of harm; Exploit = specific tool/method abusing a vulnerability.',
        fullDef: 'Eliminating vulnerabilities closes off exploits before threat actors can use them.',
      },
      {
        term: 'CIA Triad',
        shortDef: 'Confidentiality (secrecy), Integrity (untampered accuracy), Availability (uptime).',
        fullDef: 'Three core security properties balanced by every enterprise control.',
      },
      {
        term: 'Defense-in-Depth',
        shortDef: 'Stacking independent security controls across perimeter, network, host, and identity layers.',
        fullDef: 'Ensures failure of any single barrier does not expose critical assets.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1151-q1',
        prompt: 'A switch leaves Telnet open on VTY lines with a weak password. An attacker runs a tool to sniff the password off the LAN and gain CLI access. Which term describes the **open Telnet configuration** itself?',
        options: ['Vulnerability', 'Exploit', 'Threat actor', 'DDoS mitigation'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The weak plaintext Telnet config is an existing flaw (**Vulnerability**).',
          'Incorrect: The sniffing tool taking advantage of Telnet is the **Exploit**.',
          'Incorrect: The attacker is the **Threat**.',
          'Incorrect: Mitigation removes or reduces the weakness.',
        ],
        takeaway: 'Weakness = Vulnerability; weapon/action = Exploit; actor = Threat.',
      },
      {
        id: 'c1151-q2',
        prompt: 'Validating a downloaded IOS image with `verify /sha512` before upgrading ensures nobody tampered with or corrupted the binary. Which pillar of the **CIA Triad** does cryptographic hashing verify?',
        options: ['Integrity', 'Confidentiality', 'Availability', 'Non-repudiation only'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Hashing guarantees data has not been modified or corrupted—**Integrity**.',
          'Incorrect: Encryption provides Confidentiality (secrecy).',
          'Incorrect: Redundancy and uptime protect Availability.',
          'Incorrect: File checksums specifically verify Integrity.',
        ],
        takeaway: 'Encryption = Confidentiality; Hashing = Integrity; Redundancy = Availability.',
      },
      {
        id: 'c1151-q3',
        prompt: 'Which attack overwhelms a public web portal using thousands of compromised botnet devices until legitimate customers cannot reach the service?',
        options: ['Distributed Denial of Service (DDoS)', 'Privilege escalation', 'SQL injection', 'Port security violation'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Botnet traffic floods exhaust bandwidth/CPU to break **Availability** via DDoS.',
          'Incorrect: Privilege escalation upgrades local permissions rather than flooding availability.',
          'Incorrect: SQL injection targets backend database queries.',
          'Incorrect: Port security blocks unauthorized MAC addresses on a switch.',
        ],
        takeaway: 'DDoS directly targets the **Availability** pillar of the CIA Triad.',
      },
      {
        id: 'c1151-q4',
        prompt: 'Why does enterprise security rely on **Defense-in-Depth** instead of buying only one expensive perimeter firewall?',
        options: [
          'Attackers bypass single perimeters via phishing, USBs, or stolen credentials, so independent internal layers contain damage.',
          'Firewalls cannot filter IPv4 traffic.',
          'Defense-in-Depth removes the need to patch OS vulnerabilities.',
          'Switches do not support VLANs alongside firewalls.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Layered MFA, endpoint EDR, switch security, and segmentation stop lateral movement when outer barriers fail.',
          'Incorrect: Firewalls filter IPv4/IPv6 traffic cleanly.',
          'Incorrect: Patching remains an essential layer inside Defense-in-Depth.',
          'Incorrect: Switches run VLANs alongside firewalls.',
        ],
        takeaway: 'Defense-in-Depth assumes any single control can fail and stacks overlapping layers.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'CIA & Attack Surface Audit',
      instructions: [
        'Classify 4 office network risks into Threat, Vulnerability, Exploit, and Mitigation.',
        'Map each mitigation to Confidentiality, Integrity, or Availability.',
      ],
      verificationCheck: 'Clearly distinguishes Threat vs Vulnerability vs Exploit and maps controls to CIA.',
    },

    summaryBullets: [
      'Security risk sits at the intersection of **Threats**, **Vulnerabilities**, and **Exploits**.',
      'Controls defend the **CIA Triad**: Confidentiality (encryption), Integrity (hashing), and Availability (redundancy/DDoS protection).',
      'Human attacks (phishing, vishing) and network attacks (MitM, ransomware, DDoS) bypass naive single-wall defenses.',
      '**Defense-in-Depth** layers firewalls, VLAN segmentation, L2 security, MFA, patching, and immutable backups.',
      'Close easy vulnerabilities immediately: disable Telnet/HTTP, shut down unused switch ports, and patch CVEs.',
    ],

    sourcesToVerify: [
      'NIST SP 800-30 — Guide for Conducting Risk Assessments',
      'Cisco CCNA Security Fundamentals Curriculum Guidelines',
    ],
  },

  'ccna.v11.5.2': {
    id: 'ccna.v11.5.2',
    moduleId: 'ccna',
    unitTitle: 'Unit 5: Security Fundamentals (v1.1)',
    topicTitle: '5.2 Security Program Elements',
    code: '5.2.1',
    title: 'Security Program Elements: User Awareness, Training & Physical Access Control',
    readMinutes: 9,
    prerequisites: ['5.1.1 Key Security Concepts'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['5.2 Describe security program elements (user awareness, training, and physical access control)'],

    learningObjectives: [
      'Explain why technical controls fail without continuous **User Security Awareness** and **Role-Based Training**.',
      'Distinguish **awareness** (daily vigilance against phishing and tailgating) from **training** (hands-on job skills like incident triage).',
      'Identify core **Physical Access Controls** protecting IDF/MDF wiring closets, server rooms, and data centers (badges, mantraps, CCTV, cable locks).',
      'Recognize physical social engineering vectors (tailgating, piggybacking, shoulder surfing).',
    ],

    whyThisMatters: {
      scenarioTitle: 'A $200,000 Firewall Bypassed Because Someone Held the Wiring Closet Door Open',
      narrative:
        'A hospital invests heavily in encrypted VPNs and next-generation firewalls. One morning, a stranger carrying heavy boxes smiles near the locked IT corridor—and a polite employee holds the badge door open! Inside the unlocked switch closet, the intruder snaps a tiny hidden cellular drop-box directly onto an active RJ45 jack. That real-world trick bypasses perimeter firewalls completely unless an organization pairs **user awareness** with strict **physical access control**.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Bank Vault Steel Plus Teller Drills Against Smooth-Talking Visitors',
      analogy:
        'A bank can install thick steel vault doors, yet lose money if staff prop open the back door or hand keys to an impostor. **Security Awareness** keeps every staff member alert ("Wait—let me verify your badge and check sender domains before clicking!"). **Training** gives IT staff exact hands-on drills for incident containment and backups. **Physical Access Control** locks buildings, wiring closets, and equipment racks so nobody touches console ports unchecked.',
      technicalDefinition:
        'An enterprise **Security Program** blends administrative, technical, and physical safeguards: continuous **User Awareness** (phishing drills, clean-desk rules, visitor challenges), **Technical Training** (role-specific operational playbooks), and **Physical Access Controls** (RFID badges, biometric mantraps, CCTV logs, locked MDF/IDF cabinets) preventing hardware tampering or rogue LAN insertion.',
      paragraphs: [
        'CCNA Domain 5.2 highlights three pillars side-by-side: **User Awareness**, **Training**, and **Physical Access Control**. Awareness reminders alone never teach an L1 analyst *how* to isolate an infected workstation—that requires structured **Training**.',
        'Never underestimate **physical console access**: anyone standing in front of an unlocked switch with a console cable can observe screens, unplug uplinks, or attempt ROMMON password recovery unless racks are locked and console lines require authentication + idle timeouts.',
        'Remember the difference between **Tailgating** (slipping through a closing badge door behind an unaware employee) and **Piggybacking** (tricking an employee into knowingly holding the door open).',
      ],
    },

    deepDive: {
      intro:
        'Review how awareness, training, and physical security barriers work together.',
      steps: [
        {
          step: 'Element 1',
          title: 'Security Awareness (Every Employee, Year-Round)',
          explanation:
            'Builds everyday instincts: verify lookalike email domains, ignore random USB sticks, lock screens (`Win+L`), protect paper printouts, and refuse unbadged visitors.',
        },
        {
          step: 'Element 2',
          title: 'Role-Based Training (Job-Specific Skills)',
          explanation:
            'Help desk teams rehearse anti-vishing identity verification; network engineers practice encrypted config backups and switch security enforcement.',
        },
        {
          step: 'Element 3',
          title: 'Physical Access Layers (Perimeter -> Door -> Mantrap -> Rack)',
          explanation:
            'Deploy badge readers, **mantraps** (interlocking double doors admitting one verified person at a time), CCTV cameras, locked IDF closets, and console timeouts.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Onion Model of Physical Security Around Core Switches & Servers',
        asciiFallback: `[Site Perimeter: Fence + Guard + CCTV]
  --> [Building Lobby: Visitor Sign-in + Escort Policy]
        --> [Data Center / IDF Door: Badge + Biometric Mantrap (Stops Tailgating!)]
              --> [Locked Equipment Rack: Keyed Cabinet + Console Timeout + Unused Ports Shutdown]`,
      },
      workedExample: {
        title: 'Worked Program Upgrade After a Physical Security Audit',
        context:
          'Auditors find contractors following employees into `IDF-3` and network IP sheets taped above desks.',
        steps: [
          'Install badge readers with door-forced-open alarms and CCTV coverage on `IDF-3`.',
          'Roll out quarterly **Awareness** modules on clean-desk rules, screen locking, and refusing piggybacking.',
          'Hold **Training** for IT/Facilities on visitor escorting and hardware serial logging.',
        ],
        outcome:
          'Every wiring-closet entry generates an auditable badge + video record.',
      },
    },

    iosCliGuide: {
      intro:
        'Pair locked cabinets with console idle timeouts (`exec-timeout`) so unattended sessions auto-close.',
      commands: [
        {
          title: 'Set Console Idle Timeout & Legal Banner',
          promptAndCommand: `SW1(config)# banner motd # Authorized Personnel Only - Access Logged #
SW1(config)# line console 0
SW1(config-line)# exec-timeout 5 0
SW1(config-line)# login local`,
          output: `SW1# show running-config | section line con
line con 0
 exec-timeout 5 0
 login local`,
          lineByLine: [
            { segment: 'exec-timeout 5 0', meaning: 'Automatically logs out an idle console session after 5 minutes.' },
            { segment: 'banner motd', meaning: 'Displays authorized-use notice before authentication.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show running-config | section line con 0',
        healthyLabel: 'Auto-Timeout Protected',
        healthyOutput: `line con 0
 exec-timeout 5 0
 login local`,
        brokenLabel: 'Unattended Open Console Risk',
        brokenOutput: `line con 0
 exec-timeout 0 0
 no login`,
        diagnosis:
          '`exec-timeout 0 0` disables idle logout forever; combined with `no login`, anyone touching an unlocked rack gains instant CLI access.',
      },
    },

    commonTraps: [
      {
        trap: 'Treating **Awareness** and **Training** as identical.',
        reality: '**Awareness** builds company-wide caution; **Training** teaches concrete job procedures for specific teams.',
      },
      {
        trap: 'Assuming physical security belongs solely to Facilities.',
        reality: 'Uncontrolled physical access lets intruders attach console cables, drop boxes, or rogue APs straight onto LAN trunks.',
      },
      {
        trap: 'Leaving `exec-timeout 0 0` on production console/VTY lines.',
        reality: '`0 0` never times out—leaving an open terminal ready for anyone walking past.',
      },
    ],

    keyTerms: [
      {
        term: 'Security Awareness',
        shortDef: 'Organization-wide habit building against phishing, social engineering, and unsafe shortcuts.',
        fullDef: 'Keeps staff vigilant toward suspicious links, unknown USBs, tailgating, and screen locking.',
      },
      {
        term: 'Physical Access Control',
        shortDef: 'Locks, badges, mantraps, CCTV, and locked IDF/MDF closets protecting physical hardware.',
        fullDef: 'Stops unauthorized console attachment, drive theft, and rogue LAN devices.',
      },
      {
        term: 'Mantrap & Tailgating',
        shortDef: 'Double-door security vestibule stopping an intruder from slipping in behind an authorized badge holder.',
        fullDef: 'First door latches shut before second door opens—preventing tailgating/piggybacking.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1152-q1',
        prompt: 'An intruder carrying heavy boxes smiles and asks an employee entering the data center to hold the RFID-locked door open. Which physical vector is this?',
        options: ['Piggybacking (social-engineered physical entry)', 'DDoS amplification', 'BGP hijacking', 'VLAN hopping'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Convincing a badge-holder to knowingly hold open a secured door is piggybacking.',
          'Incorrect: DDoS is a remote network flood.',
          'Incorrect: BGP hijacking affects internet routing.',
          'Incorrect: VLAN hopping exploits trunk ports.',
        ],
        takeaway: 'Never hold badge doors open for anyone without verifying access or using a mantrap.',
      },
      {
        id: 'c1152-q2',
        prompt: 'Which physical mechanism ensures Door A closes and verifies one occupant before Door B unlocks into a server room?',
        options: ['A mantrap', 'A laptop cable lock', 'Exterior bollards', 'A privacy screen'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Interlocking two-door mantraps physically defeat tailgating behind badge holders.',
          'Incorrect: Cable locks tether individual laptops.',
          'Incorrect: Bollards stop vehicles outside buildings.',
          'Incorrect: Privacy screens block shoulder surfing.',
        ],
        takeaway: 'Mantraps neutralize tailgating at high-security rooms.',
      },
      {
        id: 'c1152-q3',
        prompt: 'Why is `exec-timeout 0 0` dangerous on a switch `line console 0`?',
        options: [
          'An unattended console session remains logged in forever until someone types `exit`.',
          'It wipes VLANs after 0 seconds.',
          'It shuts down GigabitEthernet uplinks.',
          'It disables SSHv2.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `0 0` disables idle session expiration permanently.',
          'Incorrect: `exec-timeout` controls terminal idle timeout only.',
          'Incorrect: It never disables network interfaces.',
          'Incorrect: It applies to the configured terminal line.',
        ],
        takeaway: 'Always set a finite `exec-timeout` (e.g., `5 0`) on console and VTY lines.',
      },
      {
        id: 'c1152-q4',
        prompt: 'How does **User Awareness** differ from **Role-Based Training**?',
        options: [
          'Awareness reinforces everyday security habits for all employees, while Training teaches specific technical procedures for job roles.',
          'Awareness applies only to executives.',
          'Training removes the need for door locks.',
          'Awareness is configuring switch ACLs.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Awareness reaches 100% of employees daily; Training builds operational job skills.',
          'Incorrect: Awareness targets everyone.',
          'Incorrect: Technical, human, and physical controls reinforce one another.',
          'Incorrect: ACLs are technical configuration.',
        ],
        takeaway: 'Effective security programs combine Awareness + Training + Physical Controls.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Physical & Human Checklist Audit',
      instructions: [
        'Draft a 5-point IDF closet checklist (badges, locks, CCTV, `exec-timeout`, unused ports `shutdown`).',
        'Practice polite scripts for refusing piggybacking requests.',
      ],
      verificationCheck: 'Distinguishes awareness vs training and lists 4+ physical hardening controls.',
    },

    summaryBullets: [
      'A complete program unites human **Awareness**, role-based **Training**, and **Physical Access Controls**.',
      '**Awareness** targets everyone (phishing, clean-desk, screen locks); **Training** teaches job skills.',
      'Physical controls stop walk-up compromises: badges, **mantraps**, CCTV logs, locked MDF/IDF racks.',
      'Polite verification stops **tailgating** and **piggybacking**.',
      'Set finite `exec-timeout` values on Cisco console/VTY lines.',
    ],

    sourcesToVerify: [
      'NIST SP 800-50 — Security Awareness and Training Program Guide',
      'Cisco IOS Security Configuration Guide — Console & VTY Line Hardening',
    ],
  },

  'ccna.v11.5.3': {
    id: 'ccna.v11.5.3',
    moduleId: 'ccna',
    unitTitle: 'Unit 5: Security Fundamentals (v1.1)',
    topicTitle: '5.3 Device Access Control Using Local Passwords',
    code: '5.3.1',
    title: 'Configuring & Verifying Device Access Control Using Local Passwords & Secrets',
    readMinutes: 10,
    prerequisites: ['IOS CLI Basics', '4.8.1 SSH Remote Access'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['5.3 Configure and verify device access control using local passwords'],

    learningObjectives: [
      'Contrast plaintext (`enable password`), weak reversible obfuscation (`service password-encryption` Type 7), and one-way cryptographic hashes (`secret` Types 5, 8, 9).',
      'Configure console, VTY, and local user accounts using `algorithm-type scrypt` / `sha256` (`Type 8`/`9`) or `secret`.',
      'Explain why `enable secret` overrides `enable password` completely.',
      'Audit `show running-config` password storage prefixes safely.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Sharing One `show running-config` Cracked Every Switch in Seconds',
      narrative:
        'A teammate shares a `running-config` snippet showing `enable password 7 0822455D0A16`. Many beginners think `Type 7` means encrypted—yet free decoders reverse Cisco Type 7 back to cleartext in 0.01 seconds! Using **`enable secret`** and **`username ... secret`** stores one-way salted hashes (`Type 5`, `Type 8`, `Type 9`) so exposed configs never leak plaintext secrets.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Simple Letter-Shift Code (Type 7) vs Blending Fruit into a Smoothie (Type 8/9 Hash)',
      analogy:
        'Using `service password-encryption` (**Type 7**) is like shifting letters (`A -> D`): anyone who knows the simple formula reverses it instantly. Using `secret` (**Type 5/8/9 hashing**) blends your password one-way like a smoothie—IOS checks future logins by hashing what you type and matching the hash, so nobody reading the config can ever extract the original password.',
      technicalDefinition:
        'Cisco IOS local access protects Privileged EXEC (`enable`), Console (`line con 0`), VTY (`line vty 0 15`), and `username` accounts. Legacy `password` stores cleartext (`Type 0`) or reversible Vigenère (`Type 7` via `service password-encryption`), while **`secret`** stores one-way salted hashes: `Type 5` (MD5), `Type 8` (PBKDF2-SHA256), or `Type 9` (scrypt).',
      paragraphs: [
        'Inspect the type digit right inside `show running-config`: **`0`** = plaintext, **`7`** = reversible weak Vigenère, **`5`** = MD5 hash, **`8`** = SHA-256 hash, **`9`** = scrypt (strongest default on modern IOS XE).',
        'If both `enable password` and `enable secret` appear together, IOS ignores `enable password` and enforces `enable secret`. Always remove legacy `enable password` lines.',
        'Bind local accounts (`username netadmin secret ...`) cleanly with `login local` under both `line con 0` and `line vty 0 15`.',
      ],
    },

    deepDive: {
      intro:
        'Review Cisco password hash tiers and safe local-access CLI templates.',
      steps: [
        {
          step: 'Rank 1',
          title: 'Cleartext (`0`) & Reversible Type 7 (`service password-encryption`)',
          explanation:
            '`password cisco` writes Type `0`. Global `service password-encryption` converts Type `0` strings into Type `7` solely to hide them from casual over-the-shoulder reading.',
        },
        {
          step: 'Rank 2',
          title: 'One-Way Hashes: Type 5 (`MD5`), Type 8 (`SHA-256`), Type 9 (`scrypt`)',
          explanation:
            '`enable secret` and `username ... secret` compute salted one-way hashes. Use `algorithm-type scrypt secret <pass>` (`Type 9`) or `sha256` (`Type 8`) on modern IOS XE.',
        },
        {
          step: 'Rank 3',
          title: 'Enforcing `login local` on Lines',
          explanation:
            'Apply `login local` under `line console 0` and `line vty 0 15` so every session prompts for a personal `username` + `secret`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Cisco IOS Password Storage Types (Weakest to Strongest)',
        asciiFallback: `[Type 0: password cisco]         --> Cleartext in config! Never use.
[Type 7: service password-enc]   --> Reversible cipher (cracks in 1ms!)
[Type 5: enable secret]          --> Salted MD5 one-way hash
[Type 8: algorithm-type sha256]  --> Strong PBKDF2-SHA256 hash
[Type 9: algorithm-type scrypt]  --> Strongest memory-hard scrypt hash`,
      },
      workedExample: {
        title: 'Worked Local Password Audit & Upgrade',
        context:
          '`SW3` shows `enable password 7 094F471A1A0A` and `username ops password 7 121A0C0411`.',
        steps: [
          'Remove weak Type 7 entries (`no enable password`, `no username ops`).',
          'Add `enable algorithm-type scrypt secret CoreAdmin#9` and `username ops privilege 15 algorithm-type scrypt secret OpsStrong#9`.',
          'Apply `login local` on `line con 0` and `line vty 0 15`.',
        ],
        outcome:
          '`show running-config` now reveals irreversible `$9$` hashes instead of reversible `7` strings.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure modern local secrets and verify hash types in running-config.',
      commands: [
        {
          title: 'Configure Modern Local Secrets & Inspect Output',
          promptAndCommand: `R1(config)# enable algorithm-type scrypt secret SuperSecret!1
R1(config)# username alice algorithm-type scrypt secret AlicePass!2
R1(config)# line console 0
R1(config-line)# login local`,
          output: `R1# show running-config | include secret|username
enable secret 9 $9$xYz8Q1...
username alice secret 9 $9$kLm2R4...`,
          lineByLine: [
            { segment: 'secret 9 $9$...', meaning: '`9` identifies a memory-hard **scrypt** one-way hash.' },
            { segment: 'login local', meaning: 'Requires authenticating against `username ... secret` accounts.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show running-config | include enable|username',
        healthyLabel: 'One-Way Hashes Only',
        healthyOutput: `enable secret 9 $9$...
username alice secret 9 $9$...`,
        brokenLabel: 'Cleartext / Reversible Type 7 Exposure',
        brokenOutput: `enable password 7 0822455D0A16
username alice password 0 Winter2026`,
        diagnosis:
          '`password 0` is literal plaintext and `password 7` decodes instantly; replace both with `secret`.',
      },
    },

    commonTraps: [
      {
        trap: 'Believing `service password-encryption` secures `enable password`.',
        reality: 'Type 7 is trivially reversible. Always use **`secret`**!',
      },
      {
        trap: 'Configuring `username alice password 0` thinking `0` means maximum security.',
        reality: '`0` means plaintext; `7` means weak reversible cipher; `5/8/9` are cryptographic hashes.',
      },
      {
        trap: 'Using `login` instead of `login local` on VTY/console lines.',
        reality: '`login` checks a single shared line password; `login local` checks individual `username ... secret` entries.',
      },
    ],

    keyTerms: [
      {
        term: 'Type 7 (`service password-encryption`)',
        shortDef: 'Reversible encoding protecting against casual screen reading only.',
        fullDef: 'Converts Type 0 `password` entries into Type 7 in config output; easily reversed.',
      },
      {
        term: 'enable secret (Type 5 / 8 / 9)',
        shortDef: 'One-way cryptographic hash protecting Privileged EXEC (`#`) mode.',
        fullDef: 'Supports Type 5 (MD5), Type 8 (PBKDF2-SHA256), and Type 9 (scrypt).',
      },
      {
        term: 'login local',
        shortDef: 'Line command authenticating against local `username ... secret` entries.',
        fullDef: 'Enforces individual user accounts on console and VTY lines.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1153-q1',
        prompt: 'You inspect `show running-config` and see `enable secret 9 $9$...`, `username ops secret 5 $1$...`, and `password 7 04580215`. Which entry reverses back to plaintext in milliseconds?',
        options: ['The `password 7` entry', 'The `enable secret 9` entry', 'The `username ops secret 5` entry', 'All three reverse identically'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Type 7 is a weak reversible cipher created by `service password-encryption`.',
          'Incorrect: Type 9 (scrypt) is a strong one-way hash.',
          'Incorrect: Type 5 (MD5) is a salted one-way hash.',
          'Incorrect: Only Type 7 is symmetrically reversible.',
        ],
        takeaway: 'Type 7 = reversible cipher (weak); Types 5/8/9 = one-way hashes (`secret`).',
      },
      {
        id: 'c1153-q2',
        prompt: 'A switch has BOTH `enable password cisco` and `enable secret Str0ng!` configured. Which password works at the `enable` prompt?',
        options: ['`Str0ng!` (`enable secret`) only', '`cisco` (`enable password`) only', 'Either works', 'IOS locks the CLI'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Whenever `enable secret` exists, IOS ignores `enable password`.',
          'Incorrect: `enable password` is superseded.',
          'Incorrect: Only `enable secret` is honored.',
          'Incorrect: No lockout occurs.',
        ],
        takeaway: '`enable secret` always overrides `enable password`.',
      },
      {
        id: 'c1153-q3',
        prompt: 'Which algorithm produces the strongest brute-force-resistant local secret on modern Cisco IOS XE?',
        options: ['`algorithm-type scrypt` (Type 9)', '`service password-encryption` (Type 7)', '`algorithm-type md5` (Type 5)', 'Cleartext `password 0`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Memory-hard `scrypt` (`Type 9`) resists GPU cracking far better than MD5 or SHA-256.',
          'Incorrect: Type 7 reverses without brute force.',
          'Incorrect: MD5 (`Type 5`) is fast to brute-force.',
          'Incorrect: Type 0 is plaintext.',
        ],
        takeaway: 'Rank: Type 9 (`scrypt`) > Type 8 (`sha256`) > Type 5 (`md5`) >>> Type 7 > Type 0.',
      },
      {
        id: 'c1153-q4',
        prompt: 'You created `username bob secret BobPass99`, yet VTY logins keep prompting ONLY `Password:` without `Username:`. What line command is missing?',
        options: ['`login local`', '`service password-encryption`', '`enable secret`', '`ip domain name`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `login local` tells the line to prompt for local `username` credentials.',
          'Incorrect: `service password-encryption` only obfuscates config output.',
          'Incorrect: `enable secret` protects `#` escalation after login.',
          'Incorrect: `ip domain name` supports RSA keys.',
        ],
        takeaway: 'Use `login local` on console and VTY lines for local `username ... secret` logins.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Audit & Upgrade Weak Passwords to Local Secrets',
      targetTab: 'labs',
      instructions: [
        'Configure `enable secret`, `username admin privilege 15 secret ...`, and `login local` on console + VTY.',
        'Inspect `show running-config` to confirm no Type `0` or `7` admin credentials remain.',
      ],
      verificationCheck: 'Only `secret` hashes appear on enable and user entries.',
    },

    summaryBullets: [
      'Never leave device admin secrets in plaintext (`0`) or reversible Type `7` (`service password-encryption`).',
      'Always use **`enable secret`** and **`username ... secret`** for one-way hashing.',
      'Password ranks: **9 (scrypt)** > **8 (PBKDF2-SHA256)** > **5 (MD5)** >>> **7 (reversible)** > **0 (cleartext)**.',
      '`enable secret` completely supersedes `enable password`—delete legacy `enable password` lines.',
      'Use `login local` on `line con 0` and `line vty 0 15` for individual local accounts.',
    ],

    sourcesToVerify: [
      'Cisco IOS Security Configuration Guide — Passwords & Type 8/9 Secret Hashes',
    ],
  },

  'ccna.v11.5.4': {
    id: 'ccna.v11.5.4',
    moduleId: 'ccna',
    unitTitle: 'Unit 5: Security Fundamentals (v1.1)',
    topicTitle: '5.4 Password Policies, MFA & Biometrics',
    code: '5.4.1',
    title: 'Security Password Policies, Complexity Alternatives, Multifactor Authentication & Biometrics',
    readMinutes: 10,
    prerequisites: ['5.3.1 Local Password Control'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['5.4 Describe security password policies elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics)'],
    verifyFlag: 'Cross-check v1.1 blueprint PDF sub-number ordering (5.4 vs 5.5).',

    learningObjectives: [
      'Evaluate modern password policy elements: length over forced bizarre complexity, password managers, lockout thresholds, and breach screening.',
      'Classify all three **Multifactor Authentication (MFA)** factors: Knowledge, Possession, and Inherence.',
      'Explain how passwordless **Digital Certificates** (X.509/PKI), FIDO2 hardware keys, and **Biometrics** reduce credential theft.',
      'Recognize why two items from the same factor category (e.g., Password + PIN) do not qualify as true MFA.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Mandatory "90-Day Complex Symbols" Actually Weakened Logins',
      narrative:
        'Forcing staff to pick tricky 8-character passwords every 90 days simply produced `Spring2026!` -> `Summer2026!` sticky notes under keyboards! Modern NIST and Cisco guidelines focus on **long unique passphrases**, **password managers**, and **Multifactor Authentication (MFA)** pairing hardware keys, X.509 certificates, and biometrics.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Entering a Club with Your Phrase, Your Keycard, and Your Fingerprint',
      analogy:
        'Asking for a password AND a mother’s maiden name only tests one category: **Something You Know**. True **MFA** blends at least **two independent categories**: (1) **Knowledge** (passphrase/PIN), (2) **Possession** (FIDO2 USB key, smart card, authenticator app, or device X.509 certificate), and (3) **Inherence** (fingerprint or facial scan). Stolen passwords alone fail without your physical key or thumb.',
      technicalDefinition:
        'Enterprise **Authentication Policy** governs credential length, uniqueness, breach screening, lockout thresholds, and **password alternatives** including **MFA** across independent factors (Knowledge, Possession, Inherence), **X.509 PKI Digital Certificates**, and **Biometric authentication**.',
      paragraphs: [
        'Modern complexity guidelines favor **14+ character passphrases** and **password managers** over short cryptic passwords.',
        'True MFA requires distinct categories: Knowledge + Possession, or Possession + Inherence. **X.509 Certificates** authenticate endpoints (`EAP-TLS`, HTTPS, IPsec) automatically via asymmetric keys signed by a Certificate Authority (**CA**).',
        'Biometric accuracy balances **FAR (False Acceptance Rate)**—letting an impostor in—against **FRR (False Rejection Rate)**—blocking an authorized user.',
      ],
    },

    deepDive: {
      intro:
        'Review password policy pillars alongside the three MFA factor categories.',
      steps: [
        {
          step: 'Pillar 1',
          title: 'Password Management & Modern Complexity Rules',
          explanation:
            'Prioritize **length** (>= 14 chars), uniqueness via Password Managers, leaked-password blocking, and brute-force throttling (`login block-for`).',
        },
        {
          step: 'Pillar 2',
          title: 'Three MFA Categories (Must Mix Independent Categories!)',
          explanation:
            '**Knowledge** (know: password/PIN), **Possession** (have: FIDO2 key, smart card, TOTP app), **Inherence** (are: fingerprint, iris, face). Password + PIN = Single-Factor (both Knowledge)!',
        },
        {
          step: 'Pillar 3',
          title: 'X.509 Certificates & Hardware Keys',
          explanation:
            'Device/user certificates (`EAP-TLS`) and FIDO2 keys eliminate phishable static passwords altogether.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'True Multifactor Authentication (MFA) Combines Independent Factor Categories',
        asciiFallback: `[1. KNOWLEDGE: "What You Know"]  ---> Passphrase / PIN
          +  (Must combine at least TWO DIFFERENT columns!)
[2. POSSESSION: "What You Have"] ---> FIDO2 YubiKey / Smart Card / TOTP App / Device Cert
          +
[3. INHERENCE: "What You Are"]   ---> Fingerprint / FaceID / Iris Biometric`,
      },
      workedExample: {
        title: 'Worked Policy Upgrade: Securing Remote VPN',
        context:
          'A company replaces 60-day passwords with phishing-resistant MFA.',
        steps: [
          'Require 14+ character unique passphrases inside a managed vault.',
          'Enforce FIDO2 hardware tap (Possession) + biometric/PIN, plus `login block-for 180 attempts 5 within 60` on IOS gateways.',
        ],
        outcome:
          'Credential-stuffing breaches drop to zero.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure IOS minimum password lengths and brute-force quiet mode.',
      commands: [
        {
          title: 'Configure Minimum Password Length & Brute-Force Lockout',
          promptAndCommand: `R1(config)# security passwords min-length 12
R1(config)# login block-for 180 attempts 5 within 60
R1(config)# login on-failure log`,
          output: `R1# show login
If more than 5 login failures occur in 60 seconds or less,
logins will be quieted for 180 seconds.`,
          lineByLine: [
            { segment: 'security passwords min-length 12', meaning: 'Rejects new passwords shorter than 12 characters.' },
            { segment: 'login block-for 180 attempts 5 within 60', meaning: 'Blocks brute-force attempts for 180s after 5 failures in 60s.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show login',
        healthyLabel: 'Brute-Force Protection Active',
        healthyOutput: `If more than 5 login failures occur in 60 seconds, logins quieted for 180 seconds.`,
        brokenLabel: 'Unthrottled Password Guessing',
        brokenOutput: `No quiet-mode configured — unlimited rapid guesses permitted.`,
        diagnosis:
          'Without `login block-for`, bots can hammer VTY lines nonstop.',
      },
    },

    commonTraps: [
      {
        trap: 'Calling "Password + Secret Question" true MFA.',
        reality: 'Both are Knowledge factors—true MFA mixes distinct categories (e.g., Knowledge + Possession).',
      },
      {
        trap: 'Assuming forced 30-day rotation beats long passphrases + MFA.',
        reality: 'Arbitrary rotation creates predictable patterns; length + uniqueness + MFA is far stronger.',
      },
      {
        trap: 'Assuming leaked biometrics can be rotated like a password.',
        reality: 'You cannot reset a leaked fingerprint; use biometrics inside MFA or local hardware key unlock.',
      },
    ],

    keyTerms: [
      {
        term: 'Multifactor Authentication (MFA)',
        shortDef: 'Requiring proof from 2+ distinct categories: Knowledge, Possession, and Inherence.',
        fullDef: 'Defeats stolen-password attacks because attackers still lack the physical device or biometric.',
      },
      {
        term: 'X.509 Digital Certificate',
        shortDef: 'Cryptographic credential signed by a trusted Certificate Authority (CA).',
        fullDef: 'Enables passwordless device/user auth (`EAP-TLS`, VPNs, HTTPS).',
      },
      {
        term: 'Biometrics (Inherence)',
        shortDef: 'Authentication using physiological traits like fingerprints, iris, or facial geometry.',
        fullDef: 'Proves "Something You Are".',
      },
    ],

    checkQuestions: [
      {
        id: 'c1154-q1',
        prompt: 'An app asks for your password AND your mother’s maiden name. Why is this **Single-Factor**, not true MFA?',
        options: [
          'Both belong to the same factor category (**Knowledge / Something You Know**).',
          'Passwords cannot participate in MFA.',
          'Security questions count as Biometrics.',
          'MFA requires 4 checks.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: True MFA mixes 2+ independent categories (Knowledge, Possession, Inherence).',
          'Incorrect: Passwords often pair with a Possession token.',
          'Incorrect: Biometrics verify physical traits.',
          'Incorrect: Two distinct categories form 2FA/MFA.',
        ],
        takeaway: 'True MFA combines independent factor categories.',
      },
      {
        id: 'c1154-q2',
        prompt: 'Which combination represents **Possession + Inherence** authentication?',
        options: [
          'Tapping a hardware FIDO2 USB key after scanning your fingerprint',
          'Typing a password plus a PIN',
          'Entering an email plus password',
          'Scanning two different fingers',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: FIDO2 key = **Possession**; fingerprint = **Inherence**.',
          'Incorrect: Both are Knowledge.',
          'Incorrect: Username + password is single-factor Knowledge.',
          'Incorrect: Two fingers remain one Inherence factor.',
        ],
        takeaway: 'Hardware key / Cert = Possession; Fingerprint = Inherence.',
      },
      {
        id: 'c1154-q3',
        prompt: 'How do **X.509 Certificates** strengthen Wi-Fi or VPN authentication compared to static passwords?',
        options: [
          'They prove identity mathematically using private keys signed by a CA, leaving no typed password to phish.',
          'They send credentials in UDP broadcasts.',
          'They remove IP addressing.',
          'They turn passwords into Type 7.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: PKI certificate auth (`EAP-TLS`) relies on asymmetric keys signed by a trusted CA.',
          'Incorrect: Certificates use encrypted TLS/IKEv2.',
          'Incorrect: IP routing remains unchanged.',
          'Incorrect: Unrelated to Type 7.',
        ],
        takeaway: 'Certificates verify endpoints cryptographically with no phishable password.',
      },
      {
        id: 'c1154-q4',
        prompt: 'Which Cisco IOS command rejects new local passwords shorter than 12 characters?',
        options: ['`security passwords min-length 12`', '`login block-for 12`', '`service password-encryption 12`', '`enable secret length 12`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `security passwords min-length <n>` sets minimum local password length globally.',
          'Incorrect: `login block-for` sets quiet-mode seconds.',
          'Incorrect: No length argument.',
          'Incorrect: Invalid syntax.',
        ],
        takeaway: '`security passwords min-length` enforces length; `login block-for` throttles guesses.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'MFA Factor Classification Drill',
      instructions: [
        'Classify 5 login pairs into Single-Factor vs True MFA (naming each factor category).',
        'Practice `security passwords min-length` and `login block-for` CLI commands.',
      ],
      verificationCheck: 'Distinguishes Knowledge, Possession, and Inherence accurately.',
    },

    summaryBullets: [
      'Modern policies prioritize **passphrase length**, uniqueness via password managers, breach checks, and lockouts.',
      'True **MFA** combines 2+ distinct categories: Knowledge, Possession, and Inherence.',
      'Two Knowledge items (Password + PIN) are still Single-Factor.',
      '**X.509 Certificates** and **FIDO2 tokens** stop phishing attacks.',
      'IOS uses `security passwords min-length` and `login block-for` to harden local logins.',
    ],

    sourcesToVerify: [
      'NIST SP 800-63B — Digital Identity Guidelines',
      'Cisco IOS Security Configuration Guide — Login Enhancements',
    ],
  },

  'ccna.core.sec.aaa-tacacs-radius': {
    id: 'ccna.core.sec.aaa-tacacs-radius',
    moduleId: 'ccna',
    unitTitle: 'Unit 5 / Unit 4: Device Management Security',
    topicTitle: 'Local Usernames & AAA (TACACS+ & RADIUS)',
    code: '4.1.1',
    title: 'Device Management Access: Local Usernames vs AAA (TACACS+ and RADIUS)',
    readMinutes: 12,
    prerequisites: ['IOS CLI Basics', 'SSH Remote Access'],
    versionScope: 'shared',
    v11ExamTopics: ['5.8 Describe AAA concepts (TACACS+ vs RADIUS)'],
    v20ExamTopics: ['4.1 Configure and verify device management access using local usernames and AAA client (TACACS+, RADIUS)'],
    verifyFlag: 'Verify Cisco v1.1 official bullet number for AAA (5.8 vs 5.9 depending on revision).',

    learningObjectives: [
      'Define the three **AAA** pillars: **Authentication** ("Who are you?"), **Authorization** ("What can you run?"), and **Accounting** ("What did you run and when?").',
      'Contrast **TACACS+** (**TCP port 49**, encrypts **entire payload**, separates A-A-A for per-command authorization) against **RADIUS** (**UDP ports 1812/1813**, encrypts **password only**, merges AuthN+AuthZ).',
      'Configure Cisco IOS XE as a TACACS+/RADIUS AAA client **with `local` fallback** so AAA server outages never lock out administrators.',
      'Verify AAA authentication live using `test aaa group`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'An Engineer Leaves Friday—and Holds Local Passwords on 400 Switches',
      narrative:
        'Updating local passwords across 400 switches manually takes days and leaves blind spots in audit logs. Centralizing device access through **AAA** (**TACACS+** via Cisco ISE) lets one Active Directory disable cut off access everywhere instantly, restricts junior admins to `show` commands, and logs every config line typed.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Hotel Electronic Keycards Verified at One Central Front Desk',
      analogy:
        '**Local passwords** are handwritten guest lists taped to 400 room doors. **AAA** wires every door to one **Front Desk Server**: **Authentication** verifies ID; **Authorization** decides which floors/commands you may access (`show` yes, `reload` no); **Accounting** stamps the logbook with timestamps.',
      technicalDefinition:
        '**AAA (Authentication, Authorization, Accounting)** centralizes access control using **TACACS+** (**TCP 49**, encrypts entire body, decouples Authentication and Authorization for per-command CLI control) or **RADIUS** (**UDP 1812/1813**, encrypts only password field, bundles Authentication + Authorization for Wi-Fi/VPN access).',
      paragraphs: [
        'Memorize the four TACACS+ vs RADIUS exam contrasts:\n1. **Transport**: TACACS+ = **TCP 49**; RADIUS = **UDP 1812/1813** (legacy `1645/1646`).\n2. **Encryption**: TACACS+ encrypts the **entire body**; RADIUS encrypts **only the password**.\n3. **Architecture**: TACACS+ **separates** AuthN/AuthZ/Acct (**per-command CLI control**); RADIUS **combines** AuthN+AuthZ.\n4. **Use Case**: **TACACS+** for router/switch CLI administration; **RADIUS** for **IEEE 802.1X** wired/Wi-Fi and VPN client access. In **802.1X**, learn the three roles: **Supplicant** (endpoint/laptop client), **Authenticator** (Switch or WLC forwarding EAPoL to RADIUS), and **Authentication Server** (RADIUS/ISE verifying credentials).',
        'Always include **`local`** at the end of `aaa authentication login default group ISE_GRP local`—and create a fallback `username ... privilege 15 secret` FIRST! Without `local`, losing the AAA server locks engineers out.',
        'Watch the subtle rule: IOS uses **`local`** **ONLY when the AAA server is unreachable/timed out**. If TACACS+ is online and returns an explicit password reject, fallback does NOT run.',
      ],
    },

    deepDive: {
      intro:
        'Configure modern IOS XE TACACS+ AAA safely step by step.',
      steps: [
        {
          step: 'Step 1',
          title: 'Stage Local Fallback User Before `aaa new-model`',
          explanation:
            'Configure `username emergency privilege 15 secret FallBack!99` before enabling `aaa new-model`.',
        },
        {
          step: 'Step 2',
          title: 'Define TACACS+ / RADIUS Server & Server Group',
          explanation:
            'Define `tacacs server ISE-01` (`address ipv4`, `key`) and bundle inside `aaa group server tacacs+ ISE_GRP`.',
        },
        {
          step: 'Step 3',
          title: 'Create Method Lists With `local` Fallback & Accounting',
          explanation:
            '`aaa authentication login default group ISE_GRP local`, `aaa authorization exec default group ISE_GRP local`, and `aaa accounting exec default start-stop group ISE_GRP` (plus `commands 15 default start-stop` for full command audit trails).',
        },
        {
          step: 'Step 4',
          title: 'Test Safely With `test aaa`',
          explanation:
            'Run `test aaa group ISE_GRP netops <pass> legacy` before closing your existing CLI session.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'TACACS+ (TCP 49) vs RADIUS (UDP 1812/1813) Architecture',
        asciiFallback: `TACACS+ (Device Admin — TCP port 49)
  [Switch] <=== Entire Payload Encrypted ===> [ISE / TACACS+ Server]
  • Splits AuthN / AuthZ / Acct -> Per-command CLI authorization

RADIUS (802.1X Wi-Fi & VPN — UDP ports 1812/1813)
  [WLC/Switch] <-- Only Password Encrypted --> [RADIUS Server]
  • Combines AuthN + AuthZ into single Access-Accept + VLAN/ACL`,
      },
      workedExample: {
        title: 'Worked AAA Fallback Incident: WAN Link Down',
        context:
          'WAN drops between Branch-SW1 and HQ TACACS+ `10.10.0.20`.',
        steps: [
          'Switch sends TCP 49 SYN to `10.10.0.20` -> times out.',
          'Because server returned **Unreachable** (not Password Reject), IOS checks the next method in `group ISE_GRP local`: `local`!',
          'Technician authenticates via local `emergency` account and repairs WAN.',
        ],
        outcome:
          'Proper `group ... local` fallback prevented a site management lockout.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure modern IOS XE TACACS+ objects, method lists, and test verification.',
      commands: [
        {
          title: 'Modern IOS XE TACACS+ AAA Client Setup',
          promptAndCommand: `SW1(config)# username emergency privilege 15 secret FallBack!99
SW1(config)# aaa new-model
SW1(config)# tacacs server ISE-PRIMARY
SW1(config-server-tacacs)# address ipv4 10.10.0.20
SW1(config-server-tacacs)# key SharedKey
SW1(config)# aaa group server tacacs+ ISE_GRP
SW1(config-sg-tacacs+)# server name ISE-PRIMARY
SW1(config)# aaa authentication login default group ISE_GRP local
SW1(config)# aaa authorization exec default group ISE_GRP local
SW1(config)# aaa accounting exec default start-stop group ISE_GRP`,
          output: `SW1# test aaa group ISE_GRP netops TestPass legacy
User was successfully authenticated.`,
          lineByLine: [
            { segment: 'tacacs server ISE-PRIMARY', meaning: 'Modern named TACACS+ server definition.' },
            { segment: 'group ISE_GRP local', meaning: 'Queries ISE first; uses local DB only if ISE times out.' },
            { segment: 'test aaa group', meaning: 'Verifies AAA reachability and shared key safely.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'test aaa group ISE_GRP netops <pass> legacy',
        healthyLabel: 'TACACS+ Server Responding & Key Matched',
        healthyOutput: `User was successfully authenticated.`,
        brokenLabel: 'Unreachable Server or Key Mismatch',
        brokenOutput: `User authentication failed — No response / Key mismatch`,
        diagnosis:
          'Verify IP routing, TCP 49 firewall rules, and exact case-sensitive shared `key`.',
      },
    },

    commonTraps: [
      {
        trap: 'Expecting AAA to fall back to `local` when a user types a wrong password while TACACS+ is online.',
        reality: '`local` fallback runs ONLY when the AAA server is unreachable/down.',
      },
      {
        trap: 'Swapping TACACS+ and RADIUS ports/encryption rules.',
        reality: 'TACACS+ = TCP 49, full body encrypted; RADIUS = UDP 1812/1813, password only encrypted.',
      },
      {
        trap: 'Enabling `aaa new-model` without `local` fallback.',
        reality: 'An AAA outage immediately locks all engineers out of switches.',
      },
    ],

    keyTerms: [
      {
        term: 'AAA',
        shortDef: 'Authentication (identity), Authorization (permissions), Accounting (audit trail).',
        fullDef: 'Centralizes device CLI administration and user network access.',
      },
      {
        term: 'TACACS+',
        shortDef: 'TCP 49 AAA protocol encrypting full body with per-command CLI authorization.',
        fullDef: 'Standard choice for Cisco router/switch management logins.',
      },
      {
        term: 'RADIUS & IEEE 802.1X Roles',
        shortDef: 'UDP 1812/1813 AAA protocol powering 802.1X Supplicant (client), Authenticator (Switch/WLC), and Authentication Server (ISE/RADIUS).',
        fullDef: 'RADIUS encrypts passwords only and merges AuthN + AuthZ; standard choice for 802.1X wired/Wi-Fi and VPN client logins.',
      },
    ],

    checkQuestions: [
      {
        id: 'c41-q1',
        prompt: 'You need per-command CLI authorization (`show` allowed, `reload` denied) plus central command accounting logs on Cisco switches. Which protocol fits best?',
        options: ['TACACS+ (TCP 49)', 'RADIUS (UDP 1812/1813)', 'Local `enable secret`', 'TFTP (UDP 69)'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: TACACS+ decouples AuthN, AuthZ, and Acct cleanly for granular CLI command authorization.',
          'Incorrect: RADIUS merges AuthN+AuthZ without native per-command IOS checking.',
          'Incorrect: Local passwords lack central logs/command filtering.',
          'Incorrect: TFTP transfers files.',
        ],
        takeaway: 'Device CLI admin & per-command authorization = **TACACS+ (TCP 49)**.',
      },
      {
        id: 'c41-q2',
        prompt: 'What key encryption difference separates **TACACS+** from **RADIUS**?',
        options: [
          'TACACS+ encrypts the entire packet body; RADIUS encrypts only the password field.',
          'RADIUS encrypts the entire packet; TACACS+ is plaintext.',
          'Neither uses encryption.',
          'Both run on UDP 69.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: TACACS+ encrypts usernames, commands, and attributes; standard RADIUS encrypts only the password.',
          'Incorrect: Exact opposite.',
          'Incorrect: Both use shared keys.',
          'Incorrect: TACACS+ = TCP 49; RADIUS = UDP 1812/1813.',
        ],
        takeaway: 'TACACS+ encrypts full body; RADIUS encrypts password only.',
      },
      {
        id: 'c41-q3',
        prompt: 'A router runs `aaa authentication login default group TAC_GRP local`. TACACS+ is **online**, and a tech enters a **wrong** TACACS+ password—even though a `local` user with that password exists. What happens?',
        options: [
          'Login is rejected immediately because `local` fallback triggers only when TACACS+ is unreachable.',
          'IOS automatically succeeds via the local database.',
          'IOS switches to RADIUS automatically.',
          'The router reloads.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Explicit server rejections do NOT trigger `local` fallback.',
          'Incorrect: That would let attackers bypass centralized disablement.',
          'Incorrect: Only configured servers are tried.',
          'Incorrect: Rejections never reboot routers.',
        ],
        takeaway: '`local` fallback runs on **server timeout/unreachable**, never on **bad password**.',
      },
      {
        id: 'c41-q4',
        prompt: 'Which AAA pillar records **who** ran `interface Gi0/1` and **when**?',
        options: ['Accounting', 'Authentication', 'Authorization', 'Encryption'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Accounting** logs user actions and session timestamps.',
          'Incorrect: Authentication checks identity.',
          'Incorrect: Authorization checks permissions.',
          'Incorrect: Encryption hides payloads.',
        ],
        takeaway: 'AuthN = Who; AuthZ = Permitted actions; Accounting = Audit trail.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'AAA Method List & TACACS+ Client Drill',
      targetTab: 'labs',
      instructions: [
        'Write a full `aaa new-model` TACACS+ client block with `username ... privilege 15 secret` and `group ISE_GRP local`.',
        'Verify with `test aaa group` logic.',
      ],
      verificationCheck: 'Recalls TCP 49 vs UDP 1812/1813, encryption scope, and unreachable fallback rules.',
    },

    summaryBullets: [
      '**AAA** separates **Authentication**, **Authorization**, and **Accounting**.',
      '**TACACS+** (TCP 49): encrypts full body, splits A-A-A -> best for device admin CLI.',
      '**RADIUS** (UDP 1812/1813): encrypts password only, merges AuthN+AuthZ -> best for 802.1X Wi-Fi/VPN.',
      'Always stage a local Priv-15 user and end method lists with `local`.',
      '`local` triggers only when AAA servers are unreachable—never on rejected wrong passwords.',
    ],

    sourcesToVerify: [
      'Cisco IOS Security Configuration Guide — Configuring AAA',
      'RFC 8907 (TACACS+) & RFC 2865 / 2866 (RADIUS)',
    ],
  },
};
