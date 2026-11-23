import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_U7_U8_EXTRA_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.7.2.1': {
    id: 'itsup.7.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 7: Security Basics',
    topicTitle: '7.1–7.2 CIA Triad, Threat/Vuln/Risk, Defense in Depth, Zero Trust & Social Engineering',
    code: '7.2.1',
    title: 'CIA Triad, Threat/Vulnerability/Risk, Zero Trust, Phishing Variants (Spear/Whaling/Smishing/Vishing/QR/BEC), Pretexting & Tailgating',
    readMinutes: 12,
    prerequisites: ['5.3.1', '6.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Map real support incidents across the CIA triad (Confidentiality, Integrity, Availability) and separate Threat, Vulnerability, Risk, and Shadow IT.',
      'Explain Defense in Depth and Zero Trust ("never trust automatically, always verify") for frontline support.',
      'Spot phishing & social engineering variants: Spear phishing, Whaling, Smishing, Vishing, QR phishing, BEC, Pretexting, and Tailgating.',
      'Execute the exact response sequence without blame when a user confesses clicking a phish link or entering credentials.',
    ],

    whyThisMatters: {
      scenarioTitle: '"I Typed My Password Into a Fake Payroll PDF—Am I Fired?!"',
      narrative:
        'A panicked payroll assistant admits clicking a QR code PDF and typing their password; ten minutes later a caller drops by asking for a "quick bypass" on an unapproved cloud file-sharing app (**Shadow IT**), while someone tries following an analyst through the badge door (**tailgating**). Replacing user blame with calm reporting stops catastrophic breaches early.',
    },

    plainEnglish: {
      analogyTitle: 'Bank Vault Layers (Defense in Depth) & Never Letting Anyone Ride Your Badge',
      analogy:
        '**Defense in Depth** stacks locks—email filtering, MFA, endpoint detection, least privilege, and backups—so one tripped wire never opens the vault. **Zero Trust** refuses to wave anyone past security just because they plugged into an office desk! And **Shadow IT** is employees bringing unapproved personal space heaters into an office without telling facilities.',
      technicalDefinition:
        'Security governance protects Confidentiality, Integrity, and Availability by stacking layered controls under Zero Trust principles while coaching staff against targeted social engineering vectors.',
      paragraphs: [
        'Know the **CIA Triad** with real examples: **Confidentiality** (leaked HR salaries), **Integrity** (tampered bank wire invoice), **Availability** (ransomware locking hospital PCs). Separate **Threat** (what can harm), **Vulnerability** (the open weakness), and **Risk** (likelihood × impact).',
        'Spot every phishing lure: **Spear phishing** (targeted at one person), **Whaling** (targeting CEOs/CFOs), **Smishing** (SMS texts), **Vishing** (phone voice calls), **QR phishing**, and **BEC (Business Email Compromise)** requesting urgent wire transfers or gift cards.',
        'Watch physical/desk tactics too: **Pretexting** (invented urgent story) and **Tailgating** (slipping through a secure badge door behind you!). If a user typed a password on a fake page: **never scold them**—disconnect if instructed, reset password + revoke sessions, audit inbox rules, alert Security immediately, and preserve timestamps!',
      ],
    },

    deepDive: {
      intro: 'Pair CIA & Zero Trust principles with social engineering containment.',
      steps: [
        {
          step: '01',
          title: 'CIA Triad, Threat/Vuln/Risk & Zero Trust',
          explanation:
            'Every security ticket affects C, I, or A. Unapproved apps (**Shadow IT**) bypass MFA, backups, and legal compliance—redirect staff kindly to approved catalog tools.',
        },
        {
          step: '02',
          title: 'Blameless Phishing Response (4 Actions)',
          explanation:
            '1) Reassure user ("Thank you for reporting fast!"); 2) Reset password + **revoke active sessions** immediately; 3) Inspect **Outlook Inbox Rules & Forwarding** for attacker persistence; 4) Escalate exact timestamps, sender, and URL to InfoSec & click Report Phishing.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'CIA Triad + Zero Trust + Phishing Containment',
        asciiFallback: `CIA: [Confidentiality = HR Leak] | [Integrity = Tampered Invoice] | [Availability = Ransomware]
Phish Click -> Blameless Thank You -> Reset Password & Revoke Tokens -> Audit Forwarding Rules -> Alert InfoSec`,
      },
      workedExample: {
        title: 'Containing a QR-Code Payroll Phish Without Shaming the Caller',
        context: 'Assistant scanned a QR invoice lure on personal phone and signed into a fake lookalike login.',
        steps: [
          'Reassured user warmly: reporting within 4 minutes probably saved the company!',
          'Reset password, revoked Entra refresh tokens, verified MFA methods untouched, confirmed zero rogue Outlook rules, escalated URL + exact timestamps to InfoSec.',
        ],
        outcome: 'Zero attacker dwell time and strong reporting trust built with Finance.',
      },
    },

    supportWalkthrough: {
      intro: 'Encourage early reporting—punishing honest mistakes makes users hide breaches until ransomware fires.',
      steps: [
        {
          phase: 'Inspect Link Targets & Rules',
          action: 'Coach users to hover over links before clicking and use the official Report Phishing button.',
          whyItWorks: 'Feeds mail filters automatically while alerting Security.',
        },
      ],
      questionsToAsk: [
        '"What exact time did you click, and did you type your password or approve an MFA prompt afterward?"',
      ],
      sampleUserWording: [
        {
          situation: 'Reassuring an embarrassed phishing clicker',
          sayThis:
            '"Thank you so much for calling us right away—those lures are designed to look identical to real portals. Reporting quickly lets us lock the door immediately; let’s reset your password and refresh your sign-in sessions together now."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Security -> Credential Phishing Containment',
        priorityFormula: 'Impact: High (Active compromised credential) × Urgency: High = P1 Critical',
        internalNotes: `[TIMELINE] User submitted credentials to fake payroll QR page at 10:14 AM, reported 10:18 AM.
[CONTAINMENT] Reset directory password, revoked all Entra sessions, verified MFA list clean, checked Exchange inbox rules/forwarding (none added). Escalated sender, URL & screenshots to InfoSec.`,
        customerReply:
          'Thanks again for reporting this within minutes! We reset your password, signed out all old browser sessions, confirmed no mail rules were altered, and handed the link to our Security team.',
        escalationCriteria: 'Escalate EVERY confirmed credential submission or BEC wire request directly to InfoSec immediately.',
      },
    },

    commonTraps: [
      {
        trap: 'Scolding a user who clicked phishing: "Why didn’t you notice the typo?!"',
        reality: 'Blame drives users into hiding incidents—always thank early reporters warmly.',
      },
      {
        trap: 'Resetting a phished user’s password without revoking active refresh tokens or inspecting Outlook inbox forwarding rules.',
        reality: 'Attackers frequently stay signed in via stolen session cookies or leave hidden auto-forwarding rules—always revoke sessions AND audit mail rules immediately.',
      },
    ],

    keyTerms: [
      {
        term: 'CIA Triad & Zero Trust',
        shortDef: 'Confidentiality, Integrity, Availability (`CIA`) paired with continuous verification (`Zero Trust`).',
        fullDef: 'Defense in depth layers technical and human controls together.',
      },
      {
        term: 'Spear Phishing / Whaling / Smishing / Vishing / BEC',
        shortDef: 'Targeted email (`Spear`), execs (`Whaling`), SMS (`Smishing`), voice (`Vishing`), Business Email Compromise (`BEC`).',
        fullDef: 'Watch also for QR phishing, Pretexting, and physical Tailgating.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-721-q1',
        prompt: 'A user confesses they just typed their work password onto a fake Microsoft login page. What should you do?',
        options: [
          'Thank them for reporting quickly (never blame!), immediately reset their password and revoke active sessions, audit email forwarding rules, and escalate exact times to Security.',
          'Tell them they broke company rules and hang up.',
          'Wait 24 hours to see if spam appears.',
          'Only clear Chrome history.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Immediate password reset + token revocation + rule audit + InfoSec alert closes the breach fast.',
          'Incorrect: Blame ruins security reporting culture.',
          'Incorrect: Attackers move in minutes.',
          'Incorrect: Doesn’t revoke stolen tokens on attacker servers.',
        ],
        takeaway: 'Phish password entered = Blameless thanks -> Reset -> Revoke tokens -> Audit mail rules -> Escalate.',
      },
      {
        id: 'itsup-721-q2',
        prompt: 'Match these three CIA examples accurately: leaked HR file, tampered invoice dollar amount, ransomware locking all files.',
        options: [
          'Confidentiality (HR leak), Integrity (tampered invoice), Availability (ransomware).',
          'Integrity, Availability, Confidentiality.',
          'Availability, Confidentiality, Integrity.',
          'All three strictly test Integrity.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Secrets exposed = Confidentiality; unauthorized modification = Integrity; downtime = Availability.',
          'Incorrect: Scrambled.',
          'Incorrect: Scrambled.',
          'Incorrect: Covers all three pillars.',
        ],
        takeaway: 'CIA: Confidentiality (privacy), Integrity (accuracy), Availability (uptime).',
      },
      {
        id: 'itsup-721-q3',
        prompt: 'What is "Shadow IT" in frontline IT support?',
        options: [
          'Staff adopting unapproved cloud apps, personal file shares, or tools outside IT visibility and security review.',
          'Dark mode inside Windows 11 Settings.',
          'Night-shift help desk analysts.',
          'BitLocker encryption.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Shadow IT bypasses MFA, DLP, and backup governance.',
          'Incorrect: UI theme.',
          'Incorrect: Shift schedule.',
          'Incorrect: Security tool.',
        ],
        takeaway: 'Redirect Shadow IT politely toward approved, secured software options.',
      },
      {
        id: 'itsup-721-q4',
        prompt: 'What is **vishing**, **smishing**, and **tailgating**?',
        options: [
          'Voice-call phishing (`vishing`), SMS text phishing (`smishing`), and following authorized staff through secure badge doors (`tailgating`).',
          'Three Windows Repair commands.',
          'Three Wi-Fi frequencies.',
          'Three email bounce codes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Multi-channel social engineering tactics.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Defeat vishing/pretexting with verification policy; defeat tailgating with polite badge checks.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Contain Phishing Token Theft & Write Anti-Vishing Script',
      targetTab: 'simulator',
      instructions: [
        'Run INC-4044 (Phished AiTM MFA + Forwarding Rule) inside the Service Desk Simulator.',
        'Draft a polite 3-sentence phone script for challenging an unverified caller requesting an urgent reset.',
      ],
      verificationCheck: '4/4 score on INC-4044 + clean anti-vishing verification script.',
    },

    summaryBullets: [
      'CIA Triad: Confidentiality (leaked data), Integrity (altered data), Availability (uptime/ransomware).',
      'Defense in depth stacks layers; Zero Trust verifies every request continuously.',
      'Know phishing types: Spear, Whaling, Smishing, Vishing, QR phishing, BEC, plus Pretexting & Tailgating.',
      'Reassure honest phishing reporters—reset password, revoke sessions, check mail rules, preserve evidence, alert Security.',
      'Steer employees away from unapproved Shadow IT apps toward safe vetted tools.',
    ],

    sourcesToVerify: [
      'CompTIA Security+ (SY0-701) — Threats, Social Engineering & Zero Trust Concepts',
    ],
  },

  'itsup.7.3.1': {
    id: 'itsup.7.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 7: Security Basics',
    topicTitle: '7.3 & 7.5 Malware, EDR Isolation, Ransomware & Physical Device Security',
    code: '7.3.1',
    title: 'Malware Taxonomy (Virus/Worm/Trojan/Ransomware/Spyware/Rootkit/Botnet), EDR Isolation, Immutable Backups, Screen Lock (Win+L), Unknown USBs & Drive Disposal',
    readMinutes: 12,
    prerequisites: ['7.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Distinguish core malware families (virus, worm, trojan, ransomware, spyware/keylogger, adware, rootkit, botnet) and recognize early endpoint symptoms.',
      'Execute immediate containment when ransomware or malware strikes: isolate network/EDR, preserve forensic state, notify Security, never reuse uncleaned hardware, reset from clean PC, restore immutable backups.',
      'Apply everyday physical security habits: `Win + L` screen lock, clean desk, shoulder-surfing shields, escorts/badges, polite tailgater challenges, and avoiding unknown USB drives & public charging juice-jacking risks.',
      'Follow secure storage disposal (cryptographic wipe / physical shredding + disposal logs) and lost/stolen laptop workflows.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Help, Files Turned Into `.locked` With a Text Note!" & "I Found a USB Stick in the Parking Lot!"',
      narrative:
        'An accountant’s screen pops a red ransom demand while simultaneously an intern plugs a "Payroll Bonus 2026" USB stick found outside the front door into a lobby computer! Knowing **EDR network isolation**, why you don’t casually reboot/reuse infected drives, why **immutable offline backups** defeat extortion, and how to handle physical threats stops lateral network spread cold.',
    },

    plainEnglish: {
      analogyTitle: 'Quarantine Ward Isolation + Never Eating Unwrapped Candy Found in a Parking Lot',
      analogy:
        'If one hospital room shows an airborne outbreak, you close the airlock doors immediately (**Network / EDR Isolation**) rather than walking that patient into the main lobby! And plugging an unknown parking-lot USB drive into a work PC is like picking up mystery candy off the sidewalk—it can carry hidden keyloggers or disguised keyboard attack chips!',
      technicalDefinition:
        'Endpoint threat response pairs behavioral Antivirus/EDR containment and offline/immutable backup recovery with physical workspace controls (`Win+L`, media sanitization, clean-desk policies, and untrusted peripheral rejection).',
      paragraphs: [
        'Recognize malware types fast: **Virus** (attaches to files), **Worm** (self-spreads across networks!), **Trojan** (disguised as useful tool), **Ransomware** (encrypts files + demands payment), **Spyware/Keylogger** (steals keystrokes), **Adware**, **Rootkit** (hides deep in OS kernel!), **Botnet** (hijacked zombie army).',
        '**Top 3 Interview Actions on a Ransomware Screen:** (1) **Isolate immediately** from the network (unplug Ethernet / Wi-Fi off / click EDR **Isolate Device**—follow policy on leaving powered vs off so memory clues stay intact!), (2) **Notify InfoSec right away** and check if neighbors or shared drives were hit, (3) **Never pay or casually reuse the machine**—clean/reimage completely, reset credentials from a known-clean PC, and restore from **offline/immutable backups** (paying decisions belong strictly to executive leadership & legal!).',
        'Physical habits matter equally: lock every unattended terminal (`Win + L`), lock closets, challenge unescorted tailgaters kindly, shield screens in cafés, use VPN on public Wi-Fi, reject unknown USBs, and **wipe/shred retired drives with documented logs**!',
      ],
    },

    deepDive: {
      intro: 'Review malware symptoms, EDR isolation, and physical security controls.',
      steps: [
        {
          step: '01',
          title: 'Antivirus vs. EDR & Symptoms',
          explanation:
            'Classic AV checks known file signatures; **EDR (Endpoint Detection & Response)** watches live behavior (such as PowerShell spawning mass file renames!) and lets Security click **Network Isolate** remotely while keeping forensic channels open. Warning signs: crawling PC, weird browser redirects, AV turned off, strange `.locked` extensions, or ransom notes.',
        },
        {
          step: '02',
          title: 'Physical Security, Lost Laptops & Drive Disposal',
          explanation:
            'Lost laptop? Report immediately -> remote lock/wipe -> reset passwords + revoke tokens. Retiring an old desktop? **Cryptographically wipe or physically shred drives** and log serials—unwiped drives dumped in trash leak corporate secrets!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Ransomware Immediate Response vs Clean Recovery',
        asciiFallback: `[Ransom Note Seen] -> [1. ISOLATE Network/EDR NOW!] -> [2. Notify InfoSec (Check Shares/Others)]
                                                                |
[5. Restore Offline/Immutable Backup] <--- [4. Reimage / Reset Passwords on Clean PC] <--- [3. Preserve Evidence]`,
      },
      workedExample: {
        title: 'Stopping Ransomware + Handling a Found USB Safely',
        context: '(A) Workstation displays `.crypt` extensions; (B) Employee brings in a loose USB labeled "Salaries."',
        steps: [
          'Ransomware: Told caller to immediately unplug Ethernet cable + toggle Wi-Fi off (and triggered EDR isolate) -> verified mapped shared folders cleanly with Server Ops -> kept machine off network for InfoSec imaging -> wiped/reimaged fresh -> restored user files from last night’s offline immutable backup!',
          'Found USB: Praised employee for NOT plugging it in! Tagged and handed over to Security safely for air-gapped inspection.',
        ],
        outcome: 'Contained spread to a single workstation with zero ransom paid and zero shared-drive loss.',
      },
    },

    supportWalkthrough: {
      intro: 'Speed of network isolation determines whether one laptop gets wiped or 400 servers freeze.',
      steps: [
        {
          phase: 'Isolate Before Cleanup',
          action: 'Disconnect network / trigger EDR Isolate FIRST before running scans or rebooting.',
          whyItWorks: 'Stops worms and ransomware from encrypting mapped department shares while scans run.',
        },
      ],
      questionsToAsk: [
        '"Is the laptop still plugged into Ethernet or Wi-Fi—can we disconnect network / run EDR isolate immediately?"',
        '"Did anyone already plug that unknown USB stick into a work PC?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining network isolation calmly to a worried user',
          sayThis:
            '"Don’t worry—we caught this right away. First let’s turn off Wi-Fi or unplug the network cable immediately so nothing spreads to shared team folders while our Security team checks it."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Security -> Suspected Ransomware / Malware Containment',
        priorityFormula: 'Impact: High (Lateral risk) × Urgency: High = P1 Critical',
        internalNotes: `[SYMPTOM] User reported weird .locked files and README_RESTORE.txt on Desktop at 11:04 AM.
[CONTAINMENT] Executed EDR Device Isolate + confirmed Wi-Fi/LAN disconnected at 11:06 AM; did not re-open files or reboot; notified Security Ops; started checking mapped Finance share integrity; user password reset initiated from clean IT console.`,
        customerReply:
          'Hi Jordan — Thanks for calling right away! We isolated your laptop from the network immediately so nothing else is affected. We’re giving you a clean loaner laptop while our Security team clears and restores your files safely from last night’s backup.',
        escalationCriteria: 'Every active malware alert, ransomware screen, lost laptop, or unknown USB insertion escalates immediately to Security.',
      },
    },

    commonTraps: [
      {
        trap: 'Advising a ransomware victim: "Just reboot it and run a quick antivirus scan while connected to Wi-Fi!"',
        reality:
          'Keeping an active ransomware host online lets it encrypt mapped shared folders across departments, while rebooting can wipe volatile RAM evidence.',
      },
      {
        trap: 'Plugging an unknown found USB drive into your own IT workstation "just to check who owns it."',
        reality:
          'Classic USB-drop attack—can inject keystrokes or exploit drivers automatically! Hand found unknown media to Security.',
      },
    ],

    keyTerms: [
      {
        term: 'EDR (Endpoint Detection & Response)',
        shortDef: 'Behavioral security agent detecting active attacks and supporting one-click remote network isolation.',
        fullDef: 'Goes beyond static signature antivirus to stop active ransomware threads.',
      },
      {
        term: 'Rootkit vs. Worm vs. Trojan',
        shortDef: 'Deeply hidden OS takeover (`Rootkit`), network self-spreader (`Worm`), disguised lure (`Trojan`).',
        fullDef: 'Know also Virus, Ransomware, Spyware/Keylogger, Adware, and Botnet.',
      },
      {
        term: 'Immutable / Offline Backups',
        shortDef: 'Backups disconnected or write-locked so ransomware cannot encrypt or delete recovery points.',
        fullDef: 'Only reliable shield allowing clean recovery without paying attackers.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-731-q1',
        prompt: 'In an interview: "A user calls saying their laptop shows a ransom note and encrypted files. What are your first three actions?"',
        options: [
          'Immediately isolate the laptop from the network (disconnect/EDR isolate), alert Security & preserve state (check if others/shares are hit), and never reuse it until wiped/reimaged with offline backup restore.',
          'Negotiate payment with the attackers directly.',
          'Plug a personal USB backup stick straight into the infected PC.',
          'Reboot three times and ignore it.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Fast isolation halts lateral spread to shared drives while preserving forensic clues and alerting Security.',
          'Incorrect: Only executive leadership and legal counsel handle extortion policy—standard guidance is restore from clean backups.',
          'Incorrect: Spreads ransomware onto your clean backup drive!',
          'Incorrect: Wastes critical response minutes.',
        ],
        takeaway: 'Ransomware first actions: Isolate network/EDR -> Alert Security & check spread -> Clean/reimage + restore offline backups.',
      },
      {
        id: 'itsup-731-q2',
        prompt: 'How does a **worm** differ from a **trojan**?',
        options: [
          'A worm spreads automatically across networks without user help; a trojan disguises itself as useful legitimate software to trick users into running it.',
          'Worms require floppy disks; trojans only affect printers.',
          'Both mean identical hardware faults.',
          'Trojans only run on Linux routers.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Self-propagation (worm) vs deceptive disguise (trojan).',
          'Incorrect: False.',
          'Incorrect: Distinct malware behaviors.',
          'Incorrect: Cross-platform threat.',
        ],
        takeaway: 'Virus (file host), Worm (self-spreader), Trojan (disguise), Ransomware (encrypts), Rootkit (hides deep), Botnet (hijacked fleet).',
      },
      {
        id: 'itsup-731-q3',
        prompt: 'What should you do when retiring old company desktop hard drives or laptops permanently?',
        options: [
          'Cryptographically wipe or physically destroy/shred the drives and log serial numbers in asset/disposal records.',
          'Toss them straight into regular office recycling bins untouched.',
          'Format Quick in FAT32 only.',
          'Sell them on eBay with old staff files intact.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Quick formats leave recoverable data intact—certified wiping or shredding prevents post-retirement data leaks.',
          'Incorrect: Classic data-breach cause.',
          'Incorrect: Quick format leaves data sectors readable!',
          'Incorrect: Severe confidentiality violation.',
        ],
        takeaway: 'Sanitize (wipe/destroy) retired drives and maintain disposal records.',
      },
      {
        id: 'itsup-731-q4',
        prompt: 'An employee finds an unlabeled USB flash drive outside the office entrance. What is the safest guidance?',
        options: [
          'Do NOT plug it into any work or personal computer—turn it straight over to Security.',
          'Plug it into the lobby reception PC to check the files.',
          'Plug it into your own IT admin workstation.',
          'Mail it to a client.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Dropped USB drives are classic physical malware/keystroke-injection traps.',
          'Incorrect: Risks infecting the corporate LAN immediately.',
          'Incorrect: Risks infecting an elevated IT admin endpoint!',
          'Incorrect: Unhelpful.',
        ],
        takeaway: 'Never plug unknown USB sticks into corporate devices.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Contain Ransomware Isolation & Write Lost-Laptop Procedure',
      targetTab: 'simulator',
      instructions: [
        'Run both the new Ransomware Isolation ticket AND the Lost Phone / Unknown USB ticket inside the Service Desk Simulator.',
        'Draft a 1-page Lost-Laptop Immediate Response procedure covering reporting, MDM lock/wipe, password/session revocation, and BitLocker reassurance.',
      ],
      verificationCheck: '4/4 scores on security simulator tickets + complete lost-laptop checklist.',
    },

    summaryBullets: [
      'Know malware families: Virus, Worm, Trojan, Ransomware, Spyware/Keylogger, Adware, Rootkit, Botnet.',
      'Ransomware response: Isolate network/EDR immediately -> preserve evidence -> alert InfoSec -> clean/reimage -> restore immutable backups.',
      'Practice daily physical hygiene: `Win+L` screen locks, clean desks, polite tailgater checks, VPN on public Wi-Fi, no unknown USBs.',
      'Respond instantly to lost devices: report -> remote lock/wipe -> reset passwords + revoke active tokens.',
      'Sanitize retired storage via certified wipe or physical destruction and keep disposal records.',
    ],

    sourcesToVerify: [
      'CompTIA Security+ (SY0-701) — Malware Analysis, Containment & Physical Security',
      'NIST SP 800-88 — Guidelines for Media Sanitization',
    ],
  },

  'itsup.7.4.1': {
    id: 'itsup.7.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 7: Security Basics',
    topicTitle: '7.4, 7.6–7.7 Encryption, Privacy Law, 3-2-1/RPO/RTO, 6 IR Phases & Admin Ethics',
    code: '7.4.1',
    title: 'Passphrases & Encryption (`BitLocker`/`manage-bde -status`/`FileVault`/`LUKS`), DLP, GDPR & Kenya DPA, 3-2-1 + RPO/RTO, 6 IR Phases & Privileged Access Ethics',
    readMinutes: 13,
    prerequisites: ['7.2.1', '7.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Apply strong password hygiene (long passphrases, unique passwords, password managers, MFA) and compare encryption at rest (`BitLocker`, `FileVault`, `LUKS`) vs. in transit (`TLS`/`HTTPS`/`VPN`).',
      'Inspect Windows encryption via `manage-bde -status` and enforce verification before ever reading BitLocker recovery keys.',
      'Classify sensitive data (Public, Internal, Confidential, Restricted), explain DLP, and summarize privacy duties under **GDPR, UK GDPR, and Kenya’s Data Protection Act**.',
      'Apply the **3-2-1 backup rule** (plus **RPO & RTO** and restore testing), execute the **6 Incident Response phases**, and uphold strict **Privileged Access Ethics**.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Can You Peek Inside Sarah’s Emails While She’s Away?" & "Why Test Backups?"',
      narrative:
        'A team lead asks you casually to browse an absent colleague’s mailbox without HR/ticket approval, a compliance audit asks how **GDPR / UK GDPR / Kenya Data Protection Act** affect support data handling, and a sudden server crash tests whether your **3-2-1 backups** actually restore within your **RPO/RTO** promises. Knowing technical security *and* legal/ethical lines protects both the company and your career.',
    },

    plainEnglish: {
      analogyTitle: 'Sealed Safes (`BitLocker`), Fire Drills That Test the Hose (`3-2-1`) & Strict Access Logs',
      analogy:
        'Full-disk encryption (**BitLocker/FileVault/LUKS**) turns a stolen laptop drive into unreadable digital confetti unless you hold the recovery key. Backups without **test restores** are like owning fire extinguishers you’ve never inspected—you only discover the valve is rusted *after* the building catches fire! And browsing user mailboxes out of curiosity leaves giant muddy boot prints inside permanent **audit logs**.',
      technicalDefinition:
        'Information assurance integrates encryption at rest/in transit, data classification/DLP, statutory data protection compliance (GDPR, UK GDPR, Kenya DPA), resilient 3-2-1/RPO/RTO backup recovery, NIST-aligned 6-phase Incident Response, and strict administrative ethics.',
      paragraphs: [
        'Use long memorable **passphrases**, unique logins everywhere via a **password manager**, and MFA—never sticky notes! Check **encryption at rest**: **BitLocker** (Windows—inspect via **`manage-bde -status`**), **FileVault** (macOS), **LUKS** (Linux); plus **encryption in transit** (HTTPS/TLS & VPN). Verify caller identity *strictly* before reading any BitLocker key stored in AD/Entra/Intune!',
        'Classify data (**Public, Internal, Confidential, Restricted**) supported by **DLP (Data Loss Prevention)** tools. Respect data privacy statutes like **GDPR, UK GDPR, and Kenya’s Data Protection Act**: view only minimum personal data needed for an approved ticket and escalate suspected data leaks right away—Security/Legal/Compliance decide formal regulator breach notifications!',
        'Master the **3-2-1 backup rule**: **3** copies of data, on **2** different media types, **1** copy offsite (and regularly **test restores**!). Know **RPO (Recovery Point Objective)** = how much data loss time is tolerable (e.g., 1 hour since last snapshot) and **RTO (Recovery Time Objective)** = how fast service must come back online! Know the **6 Incident Response phases**: **Preparation -> Detection & Analysis -> Containment -> Eradication -> Recovery -> Lessons Learned**.',
      ],
    },

    deepDive: {
      intro: 'Unite encryption, backup/RPO/RTO math, IR phases, and admin ethics.',
      steps: [
        {
          step: '01',
          title: 'The 6 Incident Response Phases',
          explanation:
            '1) **Preparation** (playbooks, backups, tools); 2) **Detection & Analysis** (spot alert, gather exact times/logs); 3) **Containment** (isolate host, revoke tokens, keep evidence!); 4) **Eradication** (remove malware/root cause); 5) **Recovery** (clean restore, monitor closely); 6) **Lessons Learned** (blameless review improving defenses).',
        },
        {
          step: '02',
          title: 'Privileged Access Ethics (Interview Scenarios!)',
          explanation:
            'Use separate Admin accounts ONLY for admin tasks (never email/browsing!). Get consent & close private windows on remote sessions. Treat HR/Finance/Exec tickets confidentially (need-to-know). **NEVER browse mailboxes/files/chats without approved ticket authorization** (every click is audited!). And if **YOU make a mistake**—report it immediately! A quickly confessed mistake stays small; a hidden mistake blows up.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '3-2-1 + RPO/RTO Backup Rule & 6 IR Phases',
        asciiFallback: `3-2-1 RULE: [3 Copies] on [2 Media Types] with [1 Offsite/Immutable] + [TEST RESTORES!]
  RPO = Max acceptable data loss gap | RTO = Max acceptable downtime to restore

6 IR PHASES: Preparation -> Detection & Analysis -> Containment -> Eradication -> Recovery -> Lessons Learned`,
      },
      workedExample: {
        title: 'Handling Accidental Confidential Exposure & Refusing Unauthorized Snooping',
        context: '(A) While sharing screen fixing Excel, a confidential HR layoff draft flashes open on user’s desktop; (B) Manager asks you privately to read a teammate’s email.',
        steps: [
          'Confidential flash on screen: Do not pause to read it, mention it calmly or focus purely on Excel, ask user to minimize sensitive windows before continuing, and never mention what you glimpsed to coworkers.',
          'Unauthorized snooping ask: Politely decline—"I can’t open another employee’s mailbox on a verbal ask because all access is logged and requires formal HR/Legal approval on an approved ticket."',
        ],
        outcome: 'Integrity, confidentiality, and legal compliance protected completely.',
      },
    },

    supportWalkthrough: {
      intro: 'Capture `who, what, when, which systems/data, what was done, who was told` on every security incident ticket.',
      steps: [
        {
          phase: 'Never Speculate Publicly',
          action: 'Preserve raw emails/screenshots/times and hand facts quietly to InfoSec rather than gossiping.',
          whyItWorks: 'Breach laws depend on accurate verified facts—rumors create panic and legal risk.',
        },
      ],
      questionsToAsk: ['"When did the blue BitLocker screen appear—did Windows update firmware overnight?"'],
      sampleUserWording: [
        {
          situation: 'Owning an honest admin mistake immediately',
          sayThis:
            '"Team lead—I just realized I accidentally applied that test retention rule to the wrong security group two minutes ago. Here is the exact group name and time so we revert it cleanly right now."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Security -> BitLocker & Privacy Handling',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High = P2 High',
        internalNotes: `[ISSUE] Laptop triggered BitLocker recovery screen after UEFI BIOS firmware patch.
[VERIFICATION] Verified user employee ID + registered HR callback number before accessing Entra BitLocker escrow.
[CHECK] Post-boot ran manage-bde -status confirming C: Protection On (TPM + Recovery Password); no hardware tamper suspected.`,
        customerReply:
          'Hi Jordan — A routine firmware update triggered BitLocker’s built-in hardware safety lock. Once we confirmed your identity, your recovery key unlocked Windows cleanly—no files were touched!',
        escalationCriteria: 'Escalate suspected unauthorized data exposure (GDPR / UK GDPR / Kenya DPA personal data leaks) immediately to Security & Data Protection Officer.',
      },
    },

    commonTraps: [
      {
        trap: 'Hiding an accidental mistake (e.g., emailing a spreadsheet to the wrong recipient or disabling the wrong group) hoping nobody notices.',
        reality:
          'Audits catch hidden mistakes eventually, turning tiny containable errors into firing offenses and regulatory fines—report own mistakes **immediately**!',
      },
      {
        trap: 'Setting up 3-2-1 backups once and never testing an actual restore.',
        reality:
          'Countless companies discover corrupted backup tapes or missing encryption keys ONLY during an outage.',
      },
    ],

    keyTerms: [
      {
        term: '3-2-1 Rule, RPO & RTO',
        shortDef: '3 copies, 2 media, 1 offsite + restore tests; max data loss gap (`RPO`) & max restore time (`RTO`).',
        fullDef: 'Business continuity backbone protecting against hardware loss and ransomware.',
      },
      {
        term: 'GDPR, UK GDPR & Kenya DPA',
        shortDef: 'Data protection laws governing lawful personal-data handling, minimization, and prompt breach escalation.',
        fullDef: 'Support staff must view only needed data and escalate suspected leaks immediately.',
      },
      {
        term: '6 IR Phases & `manage-bde -status`',
        shortDef: 'Prep -> Detect/Analyze -> Contain -> Eradicate -> Recover -> Lessons Learned; Windows BitLocker status CLI.',
        fullDef: 'Inspects drive encryption state on local endpoints.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-741-q1',
        prompt: 'In an interview: "What is the 3-2-1 backup rule, and why must you test restores?"',
        options: [
          'Keep 3 copies of data on 2 different media types with 1 copy offsite (often immutable)—and test restores regularly to prove backups aren’t silently corrupt before an emergency.',
          'Keep 3 passwords, 2 monitors, and 1 router.',
          'Delete 3 files, move 2 to FAT32, email 1 externally.',
          'Back up only once every 321 days.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: An untested backup is only a wish—proving restores works meets RPO and RTO.',
          'Incorrect: Nonsense.',
          'Incorrect: Nonsense.',
          'Incorrect: Nonsense.',
        ],
        takeaway: '3-2-1 = 3 copies, 2 media types, 1 offsite + **tested restores** meeting RPO/RTO.',
      },
      {
        id: 'itsup-741-q2',
        prompt: 'While helping a user via remote screen share, a confidential HR salary document accidentally pops onto their monitor. What should you do?',
        options: [
          'Ignore the contents, ask the user kindly to minimize sensitive windows before continuing, never mention it to others, and never snoop.',
          'Take a screenshot and share it in the team chat.',
          'Read through the whole document once the user steps away.',
          'Ask the user to email you a copy.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Strict professional discretion & minimum-necessary principle protect privacy laws (GDPR/UK GDPR/Kenya DPA).',
          'Incorrect: Severe confidentiality violation.',
          'Incorrect: Audited abuse of remote access.',
          'Incorrect: Unauthorized data exfiltration.',
        ],
        takeaway: 'Treat incidental confidential data on screen with zero snooping and complete discretion.',
      },
      {
        id: 'itsup-741-q3',
        prompt: 'If a help desk technician accidentally makes a configuration error affecting users or exposes an email attachment, what is the golden rule?',
        options: [
          'Own and report the mistake immediately with exact times/details so the team can fix and contain it fast.',
          'Quietly hide it and blame Windows Update.',
          'Delete all audit logs.',
          'Ignore tickets until shift ends.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Prompt confession keeps small accidents trivial; hiding turns them into severe incidents.',
          'Incorrect: Dishonesty destroys trust.',
          'Incorrect: Tampering violates security ethics.',
          'Incorrect: Irresponsible.',
        ],
        takeaway: 'Own mistakes immediately—integrity matters more than pretending perfection.',
      },
      {
        id: 'itsup-741-q4',
        prompt: 'List the 6 standard Incident Response phases in correct sequence.',
        options: [
          'Preparation -> Detection & Analysis -> Containment -> Eradication -> Recovery -> Lessons Learned.',
          'Eradication -> Ignore -> Recovery -> Preparation -> Containment.',
          'Containment -> Reboot -> Blame -> Close.',
          'Detection -> Reinstall -> Guess -> Sell.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: NIST-aligned 6-phase IR lifecycle.',
          'Incorrect: Out of order.',
          'Incorrect: Invalid.',
          'Incorrect: Invalid.',
        ],
        takeaway: 'IR 6 phases: Prep -> Detect & Analyze -> Contain -> Eradicate -> Recover -> Lessons Learned.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Verify BitLocker Identity Gate & Write Code of Conduct',
      targetTab: 'simulator',
      instructions: [
        'Run INC-4010 (BitLocker Anti-Vishing Recovery) inside the Service Desk Simulator and inspect `manage-bde -status` output.',
        'Write a 6-bullet personal Privileged Access Code of Conduct covering admin accounts, consent, confidentiality, and reporting mistakes.',
      ],
      verificationCheck: '4/4 score on INC-4010 + personal conduct charter.',
    },

    summaryBullets: [
      'Use BitLocker (`manage-bde -status`), FileVault, LUKS for disks + TLS/VPN in transit; verify ID before recovery keys.',
      'Enforce Data Classification/DLP and GDPR / UK GDPR / Kenya Data Protection Act privacy handling on every ticket.',
      'Apply 3-2-1 backups (3 copies, 2 media, 1 offsite) with tested restores matching RPO & RTO goals.',
      'Follow the 6 IR phases cleanly: Prep -> Detect/Analyze -> Contain -> Eradicate -> Recover -> Lessons Learned.',
      'Use separate admin accounts, get remote consent, never snoop audited systems, and confess own mistakes right away.',
    ],

    sourcesToVerify: [
      'NIST SP 800-61 — Computer Security Incident Handling Guide (6 IR Phases)',
      'Microsoft Learn — BitLocker & manage-bde CLI; GDPR / UK GDPR / Kenya Data Protection Act Overviews',
    ],
  },

  'itsup.8.2.1': {
    id: 'itsup.8.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 8: Troubleshooting & Remote Support',
    topicTitle: '8.1–8.2 Search Strategies, Time-Boxing & Gathering Facts Cleanly',
    code: '8.2.1',
    title: '6 Search Strategies (Top-Down, Bottom-Up, Divide & Conquer, Known-Good), 15–20 Min Time-Boxing & Non-Leading Discovery Questions',
    readMinutes: 11,
    prerequisites: ['4.6.1', '7.4.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Choose among six structured search strategies: top-down, bottom-up, divide-and-conquer, follow path of data, compare working vs. broken, and known-good swap.',
      'Apply disciplined troubleshooting habits: change one thing at a time, undo dead ends, rule out simple causes first, and **time-box** at 15–20 minutes before escalating.',
      'Avoid **leading questions** ("You clicked a link, right?") while gathering exact error strings, timestamps, screenshots, OS/network context, and exported logs.',
      'Check the Knowledge Base, recent Changes, Known Issues, and Outage Notices BEFORE diving into complex debugging.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Two Hours Stuck Alone on a Typo—Because Nobody Checked Recent Changes!"',
      narrative:
        'An analyst spends 95 minutes dissecting Registry permissions because a caller simply said *"My computer is broken."* Had they started by asking non-leading questions, checking recent outage banners, copying the exact error text, and time-boxing at 18 minutes, they would have noticed a known morning certificate rotation listed right inside the Knowledge Base!',
    },

    plainEnglish: {
      analogyTitle: 'Finding a Faulty Christmas-Tree Bulb by Cutting the Strand in Half (`Divide & Conquer`)',
      analogy:
        'Testing 100 bulbs one by one takes forever. **Divide & conquer** tests the middle first—instantly throwing away half the suspects in one move! And **time-boxing** is setting a 15–20 minute kitchen timer so pride never traps a user waiting hours when a specialist already knows the shortcut.',
      technicalDefinition:
        'Structured fault isolation applies algorithmic search patterns (OSI top-down/bottom-up, binary divide-and-conquer, differential comparison) bound by explicit time-boxing and unbiased empirical evidence gathering.',
      paragraphs: [
        'Before changing anything: **check KB + recent Changes + Known Issues + Outage banners**! Keep discipline tight: **change ONE thing at a time**, undo steps that didn’t help, note everything live, and check dumb simple things first (power outlet, plug seated, Restart, right account).',
        'Interview favorite: **"What do you ask when someone simply says ‘my computer is broken’?"** Walk calmly through the non-leading set: What exact behavior/error text? Since when? Ever worked? What changed (update, new software, desk move, password reset)? Who else sees it? Urgent deadline?',
        'Never lead the witness (*"You spilled coffee or clicked spam, right?"* makes users defensive!). Copy exact error text + screenshots + hostname + OS + location (office/home/VPN) + `ipconfig`/`systeminfo` logs!',
      ],
    },

    deepDive: {
      intro: 'Pair the six cause-search methods with time-boxing discipline.',
      steps: [
        {
          step: '01',
          title: 'Six Root-Cause Search Methods',
          explanation:
            '**Top-down** (start at app settings), **Bottom-up** (start at physical cable/power), **Divide & conquer** (test middle hop like gateway first), **Follow path of data** (user click -> browser -> DNS -> proxy -> server), **Compare working vs broken** (neighbor PC / 2nd user account!), and **Known-good swap** (swap dock/cable).',
        },
        {
          step: '02',
          title: 'Time-Boxing (15–20 Minutes) & Exact Error Searches',
          explanation:
            'Always copy exact verbatim error wording (`"0x80070035 network path not found"`) rather than paraphrasing from memory. If 15–20 minutes of clean isolation yields zero breakthrough—package your notes and **warm-escalate**!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Troubleshooting Method & 6 Search Strategies',
        asciiFallback: `[Check KB/Outages First] -> [6 Steps: Identify -> Theory -> Test -> Plan/Fix -> Verify -> Document]
  Strategies: Top-Down | Bottom-Up | Divide & Conquer | Data Path | Compare Working | Known-Good Swap
  Rule: Change 1 Thing -> Undo Failed Edits -> Time-Box @ 15–20 Mins!`,
      },
      workedExample: {
        title: 'Turning "The Internet Is Broken!" Into Exact Isolation in 3 Questions',
        context: 'Caller gives vague one-line complaint with no context.',
        steps: [
          'Check Knowledge Base / Service Health first (clear).',
          'Ask unbiased questions: exact behavior ("Website prints Error DNS_PROBE"), started when ("Since switching desks 10 mins ago"), works on phone? ("Yes, mobile data works").',
          'Uses **Divide & Conquer** (Ping Ladder gateway passes, `8.8.8.8` passes, name fails) -> isolates DNS in 45 seconds instead of guessing for 30 minutes!',
        ],
        outcome: 'Vague panic converted directly into one-step resolution.',
      },
    },

    supportWalkthrough: {
      intro: 'Record what did NOT work too—saving L2 from re-running your exact failed checks.',
      steps: [
        {
          phase: 'Undo Dead-End Edits',
          action: 'Restore any temporary test setting (like disabling a firewall rule or proxy toggle) before moving on.',
          whyItWorks: 'Prevents leaving security holes or stacked confusing side effects behind.',
        },
      ],
      questionsToAsk: [
        '"What exact wording or code appears on screen—could you read or screenshot it word for word?"',
        '"Did anything change right before this—a password reset, OS update, desk move, or new app?"',
      ],
      sampleUserWording: [
        {
          situation: 'Escalating politely at the 18-minute time-box',
          sayThis:
            '"We’ve ruled out your local laptop, cables, and Wi-Fi cleanly—rather than keeping you waiting while I keep guessing, I’m sending all of these verified tests directly to our specialist team right now so they can check the server side."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Troubleshooting -> Structured Isolation & Handoff',
        priorityFormula: 'Impact: Low (1 PC) × Urgency: Medium = P3 Medium',
        internalNotes: `[EXACT ERROR] "ERR_CONNECTION_TIMED_OUT on https://erp.corp.local" (verified Chrome & Edge).
[CONTEXT] Win 11 Pro 24H2, LT-309, working from Home on Corporate VPN.
[TESTS] KB checked (no outage). Compare working vs broken: webmail works; Ping Ladder passes to VPN gateway; Test-NetConnection erp.corp.local -Port 443 -> False.
[TIME-BOX] Reached 15m; reverted temporary proxy check; warm-escalating to NetOps for VPN firewall ACL review.`,
        customerReply:
          'Hi Jordan — We narrowed the block down to the corporate VPN server path (all other websites and your local connection work fine). I’ve attached our diagnostic tests for Network Operations and they’ll update you by 3:00 PM!',
        escalationCriteria: 'Time-box at 15–20 minutes on complex L1 unknowns rather than silently stalling SLA targets.',
      },
    },

    commonTraps: [
      {
        trap: 'Asking leading questions like "You unplugged your router or clicked a bad email, didn’t you?"',
        reality: 'Leading questions sound accusatory and pressure users into guessing wrong facts—ask neutral open/factual questions.',
      },
      {
        trap: 'Changing four settings at once without keeping track of what changed.',
        reality: 'Change **one** variable at a time and revert anything that failed.',
      },
    ],

    keyTerms: [
      {
        term: 'Divide & Conquer / Known-Good Swap',
        shortDef: 'Testing midpoints to halve suspects (`Divide & Conquer`) and swapping a proven part (`Known-Good`).',
        fullDef: 'Pair with Top-Down, Bottom-Up, Follow-Data-Path, and Compare-Working-vs-Broken.',
      },
      {
        term: 'Time-Boxing',
        shortDef: 'Setting a 15–20 minute L1 isolation cap before warm-escalating with full diagnostic evidence.',
        fullDef: 'Protects SLAs and user patience without sacrificing L1 effort.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-821-q1',
        prompt: 'A user reports "My computer is broken." What neutral opening discovery approach gathers maximum clarity?',
        options: [
          'Ask unbiased questions: exact behavior/error text word-for-word, when it started, what changed recently, whether it’s reproducible, and if anyone else sees it—while checking KB/outages.',
          'Ask "You obviously spilled water on it or clicked a virus, right?"',
          'Reinstall Windows immediately.',
          'Guess it is the printer.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Converts vague frustration into concrete scope, timeline, and verbatim error facts.',
          'Incorrect: Leading and accusatory.',
          'Incorrect: Skips all diagnosis.',
          'Incorrect: Pure guessing.',
        ],
        takeaway: 'Ask non-leading questions covering exact error, start time, recent changes, scope, and reproducibility.',
      },
      {
        id: 'itsup-821-q2',
        prompt: 'Why should an L1 technician set a 15–20 minute **time-box** when debugging an unfamiliar non-outage ticket?',
        options: [
          'Prevents burning SLA clocks struggling alone past diminishing returns—letting you hand clean verified evidence to L2 quickly.',
          'So you can close unresolved tickets after 15 minutes.',
          'Because laptops overheat at 20 minutes.',
          'To avoid writing ticket notes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Time-boxing respects the user’s time and team efficiency while guaranteeing L1 tried structured basics first.',
          'Incorrect: Never close an unfixed ticket!',
          'Incorrect: False.',
          'Incorrect: Escalations still require complete notes.',
        ],
        takeaway: 'Investigate methodically for 15–20 minutes, then warm-escalate with complete notes.',
      },
      {
        id: 'itsup-821-q3',
        prompt: 'What happens if you disable Windows Firewall AND change DNS AND reinstall Outlook simultaneously, and the bug disappears?',
        options: [
          'You don’t know which change fixed it—and may have left Windows Firewall dangerously turned off!',
          'That is considered best-practice speed troubleshooting.',
          'Windows automatically restores the firewall on restart.',
          'DNS stops working.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Change ONE thing at a time and undo failed temporary tests immediately.',
          'Incorrect: Multi-variable guessing leaves hidden security risks behind.',
          'Incorrect: No.',
          'Incorrect: False.',
        ],
        takeaway: 'Change ONE thing at a time and always undo dead-end test changes.',
      },
      {
        id: 'itsup-821-q4',
        prompt: 'Why search exact error strings (e.g., `"0x80070035"`) instead of summarizing `"network broken"` from memory?',
        options: [
          'Exact codes pinpoint specific KB fixes and vendor defects accurately instead of pulling generic irrelevant noise.',
          'KB search boxes reject normal words.',
          'Error codes reveal user passwords.',
          'Users memorize hex codes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Verbatim text + exact product name finds verified causes in seconds.',
          'Incorrect: False.',
          'Incorrect: False.',
          'Incorrect: Ask users to copy/paste or screenshot exact codes.',
        ],
        takeaway: 'Never paraphrase an error from memory—copy exact text or grab a clean screenshot.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Turn 5 Vague Complaints Into Discovery Questions',
      instructions: [
        'Write 4 clear unbiased diagnostic questions for each vague complaint: (1) "It doesn’t work", (2) "The internet is slow", (3) "Email is weird", (4) "Nothing prints", (5) "My screen looks messed up."',
      ],
      verificationCheck: 'Zero leading questions; every set narrows scope, exact error, and recent changes cleanly.',
    },

    summaryBullets: [
      'Check Knowledge Base, recent Changes, Known Issues, and Outages BEFORE deep-diving.',
      'Apply the 6 search methods: Top-down, Bottom-up, Divide & Conquer, Data Path, Compare Working, Known-Good Swap.',
      'Change one variable at a time, undo failed tests, and time-box unfamiliar issues at 15–20 minutes.',
      'Copy exact error strings/screenshots and avoid leading or blaming questions.',
      'Capture OS version, hostname, network location (office/home/VPN), and exported logs in every note.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 2 — Troubleshooting Methodology & Information Gathering',
    ],
  },

  'itsup.8.3.1': {
    id: 'itsup.8.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 8: Troubleshooting & Remote Support',
    topicTitle: '8.3–8.5 Remote Tools, Phone/Chat Pacing & Complete Scenario Bank',
    code: '8.3.1',
    title: 'Attended vs Unattended Remote Access, RMMs, Support Scam Warnings, Screen-Free Phone/Chat Pacing & 9-Category Scenario Workbench',
    readMinutes: 13,
    prerequisites: ['8.1.1', '8.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Compare remote support tool categories (Quick Assist/Remote Help, RDP, TeamViewer/AnyDesk/ScreenConnect/Splashtop/Zoho Assist, Teams, Apple Screen Sharing, SSH) and RMM platforms (NinjaOne, Datto RMM, N-able, ConnectWise Automate).',
      'Enforce strict remote etiquette: attended vs. unattended consent, closing private windows, narrating actions, never typing/asking passwords, clean disconnect, and warning users against unprompted tech-support scams.',
      'Guide non-technical callers cleanly WITHOUT screen control (one plain step at a time, confirming visual output, pacing, accessibility, and knowing when to switch channels).',
      'Navigate all 9 practice scenario categories in the Service Desk Simulator (Printing, Boot/Hardware, Windows/Apps, Network, Accounts, Email/M365, Security, Mobile, Peripherals).',
    ],

    whyThisMatters: {
      scenarioTitle: '"How Do You Walk Someone Through Finding Their IP Address Without Seeing Their Screen?"',
      narrative:
        'A remote employee on slow hotel Wi-Fi cannot launch screen-sharing software, and an interviewer asks verbatim: *"How do you guide a nervous user through fixing a network setting over the phone when remote control fails?"* Equally critical: teaching employees that **legitimate IT NEVER cold-calls asking to install unapproved remote-control software** blocks common tech-support scams.',
    },

    plainEnglish: {
      analogyTitle: 'Asking Permission Before Stepping Into Someone’s Kitchen—and Closing Confidential Mail First',
      analogy:
        'Remote screen control puts your hands right on someone’s private desk! Always knock first (**ask consent**), warn them to close personal HR/banking tabs, narrate what you touch (*"I’m opening Network Settings now"*), step back when they type passwords, and close the door cleanly when done. When remote access fails, navigate calmly step-by-step like talking someone through baking a recipe purely over the phone!',
      technicalDefinition:
        'Remote support methodology governs attended vs. unattended endpoint access (including MSP RMM tooling), strict user-consent/privacy etiquette, fraud awareness against unsolicited remote-access scams, screen-free guided audio/chat pacing, and scenario-bank drills across nine service desk domains.',
      paragraphs: [
        'Know tool kinds cleanly: built-in Windows **Quick Assist / Remote Help**, **RDP**, **TeamViewer / AnyDesk / ConnectWise ScreenConnect / Splashtop / Zoho Assist**, **Teams** screen control, **Apple Screen Sharing**, and **SSH** (CLI for Linux/network gear). MSPs heavily use **RMM platforms** (**NinjaOne, Datto RMM, N-able, ConnectWise Automate**) to monitor fleets, patch, and script silently.',
        'Note **Attended** (user present approving session) vs. **Unattended** (no user present—demands strong policy, audit logs, and consent!). Troubleshoot tool hiccups too: VPN/firewall blocks, expired session codes, **UAC elevation prompts you cannot click remotely**, or laggy links (switch to phone + screenshots!).',
        'Practice across **ALL 9 Simulator Categories** in Section 8.5: **Printing, Boot & Hardware, Windows & Apps, Network, Accounts & Access, Email & M365, Security, Mobile, and Peripherals**!',
      ],
    },

    deepDive: {
      intro: 'Pair remote-session etiquette with phone-guided step-by-step mastery.',
      steps: [
        {
          step: '01',
          title: 'Before, During & After Remote Control (Interview Checklist!)',
          explanation:
            '1) **Before**: Get explicit consent, state why, ask user to close private/HR/banking windows; 2) **During**: Narrate every click, change ONLY related settings, NEVER ask for or watch passwords—let user type! 3) **After**: Close admin tools you opened, end remote session visibly, and confirm user sees the working fix.',
        },
        {
          step: '02',
          title: 'Walking a User Screen-Free (No Remote Control)',
          explanation:
            '1) Confirm device/OS/location early; 2) Give **one plain step at a time** (*"Press Windows key + R, type `cmd`, press Enter"*); 3) Ask *"Tell me what appears on your screen now"* after EVERY step; 4) Use screenshots when stuck (avoid exposing sensitive screens in public channels!); 5) Adapt pacing for nervous callers or visual/hearing/motor accessibility needs; 6) Escalate to call/on-site when steps outpace comfort.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Remote Control Etiquette & Nine Scenario Domains',
        asciiFallback: `REMOTE CONTROL: [Consent + Close Private Tabs] -> [Narrate + Don't Touch Secrets] -> [Close Session + Verify]

9 SCENARIO BANK CATEGORIES (Practice All 9 in Simulator Tab!):
  1. Printing          | 2. Boot & Hardware   | 3. Windows & Apps
  4. Network           | 5. Accounts & Access | 6. Email & Microsoft 365
  7. Security          | 8. Mobile            | 9. Peripherals`,
      },
      workedExample: {
        title: 'Guiding a Non-Technical User Blind to Run `ipconfig` & `ping`',
        context: 'Remote tool blocked by hotel portal; caller needs to read IPv4 and test `8.8.8.8`.',
        steps: [
          'Step 1: "Looking at the bottom-left row of your keyboard near Spacebar, press the key with four little squares—the Windows key—and let go. Did a Start search box pop up?" (User: "Yes!")',
          'Step 2: "Great! Now type the three letters `c m d` and press Enter. Tell me if a black window opens." (User: "Opened!")',
          'Step 3: "Awesome. Now type `ipconfig` and press Enter—read me the numbers on the line that says `IPv4 Address`." (User reads `192.168.88.14` cleanly!)',
          'Step 4: "Now type `ping 8.8.8.8` and press Enter—do you see lines saying `Reply from` or `Request timed out`?"',
        ],
        outcome: 'Diagnosed missing DNS cleanly in 3 minutes with zero anxiety or jargon.',
      },
    },

    supportWalkthrough: {
      intro: 'Treat remote control like borrowing someone’s physical office chair—polite, transparent, and clean.',
      steps: [
        {
          phase: 'UAC Screen Dimming Workaround',
          action: 'Know that Quick Assist / standard user shares pause on black Secure Desktop UAC prompts unless running an elevated service like ScreenConnect/Remote Help.',
          whyItWorks: 'Prevents confusion when your remote mouse freezes mid-admin prompt!',
        },
      ],
      questionsToAsk: [
        '"Before I share onto your screen, please minimize any personal tabs or HR documents—ready for me to connect?"',
      ],
      sampleUserWording: [
        {
          situation: 'Warning users about fake IT remote scams',
          sayThis:
            '"For your safety, remember genuine IT here will never cold-call you out of the blue asking to download TeamViewer/AnyDesk to fix a surprise virus—always check with our official desk ticket first!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Remote Support -> Guided Phone Diagnostics',
        priorityFormula: 'Impact: Low (1 PC) × Urgency: Medium = P3 Medium',
        internalNotes: `[SESSION] Attended remote tool blocked by guest hotel Wi-Fi; completed step-by-step screen-free phone guidance.
[DIAGNOSTICS] Guided user cleanly to Command Prompt -> ipconfig showed 192.168.4.22, ping 8.8.8.8 succeeded, nslookup timed out.
[RESOLUTION] Guided user through switching adapter DNS back to Automatic DHCP -> verified webmail & portal loaded cleanly; summarized closure.`,
        customerReply:
          'Hi Maya — You navigated those command steps like a pro! Switching your Wi-Fi back to automatic DNS fixed web access. Remember we only ever connect remotely on tickets you initiate or verify with us directly.',
        escalationCriteria: 'Switch to in-person Deskside dispatch if user accessibility/hardware obstacles prevent phone guidance.',
      },
    },

    commonTraps: [
      {
        trap: 'Spouting 4 steps in one breath over the phone: "Open Win+R, type cmd, run ipconfig /release && ipconfig /renew, then ping 8.8.8.8."',
        reality: 'Non-technical callers get lost on step 1—give ONE micro-step and verify screen confirmation before step 2.',
      },
      {
        trap: 'Leaving an unattended remote window open silently on someone’s desktop after hanging up.',
        reality: 'Always close admin shells, terminate the remote session explicitly, and confirm cleanly.',
      },
    ],

    keyTerms: [
      {
        term: 'RMM (Remote Monitoring & Management)',
        shortDef: 'MSP/enterprise platforms (NinjaOne, Datto RMM, N-able, ConnectWise Automate) for fleet monitoring, patching & scripting.',
        fullDef: 'Complements attended tools like Quick Assist, TeamViewer, AnyDesk, and ScreenConnect.',
      },
      {
        term: 'Attended vs. Unattended Access',
        shortDef: 'User present approving session (`Attended`) vs. background access without user present (`Unattended`—strict policy!).',
        fullDef: 'Both demand strict logging and explicit organization authorization.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-831-q1',
        prompt: 'In an interview: "What should you do BEFORE, DURING, and AFTER taking remote control of a user’s computer?"',
        options: [
          'Ask explicit consent and have them close private tabs -> narrate every click and let them type passwords -> close opened admin tools, end session visibly, and verify fix.',
          'Connect silently whenever you feel like it without notifying them.',
          'Ask the user for their password in chat so you can type it yourself.',
          'Leave the remote control window open after the call ends.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Respects user privacy, security boundaries, and clear communication.',
          'Incorrect: Unauthorized silent access destroys employee trust.',
          'Incorrect: Never ask for or type user passwords.',
          'Incorrect: Always terminate sessions cleanly.',
        ],
        takeaway: 'Remote etiquette: Consent + Close Private Windows -> Narrate + No Passwords -> Close Tools & End Session.',
      },
      {
        id: 'itsup-831-q2',
        prompt: 'How do you walk a non-technical user through finding their IP address and pinging `8.8.8.8` when you CANNOT see their screen?',
        options: [
          'Give one tiny instruction at a time in plain words ("Press Windows key, type cmd, press Enter"), confirm what they see after each step, and pace calmly.',
          'Read five PowerShell pipelines quickly without pausing.',
          'Tell them to install an unapproved freeware screen share.',
          'Give up and close the ticket.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: One step + feedback loop per turn guarantees calm, accurate success.',
          'Incorrect: Overwhelms callers immediately.',
          'Incorrect: Violates approved remote-tool security.',
          'Incorrect: Fails user ownership.',
        ],
        takeaway: 'Screen-free phone/chat troubleshooting = one small plain step -> confirm output -> next step.',
      },
      {
        id: 'itsup-831-q3',
        prompt: 'An employee calls asking if it was really IT who phoned their desk unexpectedly claiming a virus and telling them to install AnyDesk right now. What is happening?',
        options: [
          'A classic tech-support social-engineering scam—legitimate IT never cold-calls unprompted demanding remote control.',
          'Routine Windows Autopilot.',
          'A normal RMM Patch Tuesday call.',
          'Intune MDM sync.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Coach staff never to grant unsolicited remote access and alert Security immediately.',
          'Incorrect: Autopilot requires no cold calls.',
          'Incorrect: Automated patching does not cold-call.',
          'Incorrect: Intune runs silently via enrolled policy.',
        ],
        takeaway: 'Legitimate IT never cold-calls asking for remote screen control—warn users against support scams.',
      },
      {
        id: 'itsup-831-q4',
        prompt: 'What is an RMM platform (like NinjaOne, Datto RMM, or N-able) used for—especially at MSPs?',
        options: [
          'Monitoring client device health, pushing patches/scripts silently across fleets, and launching authorized remote support.',
          'Replacing Ethernet wall jacks.',
          'Printing thermal shipping labels.',
          'Managing personal iCloud photos.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: RMMs unify monitoring, patching, scripting, and remote access across hundreds of client machines.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Know remote tools (Quick Assist, ScreenConnect, TeamViewer, AnyDesk) + MSP RMMs (NinjaOne, Datto, N-able).',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Practice All 9 Categories in the Service Desk Simulator',
      targetTab: 'simulator',
      instructions: [
        'Use the Category filter inside the Service Desk Simulator to complete scenarios across Printing, Boot/Hardware, Windows/Apps, Network, Accounts, Email/M365, Security, Mobile, and Peripherals.',
        'Role-play talking a friend step by step through opening Command Prompt and running `ipconfig` without looking at their screen.',
      ],
      verificationCheck: 'Completed tickets across every major Simulator category + practiced screen-free guidance.',
    },

    summaryBullets: [
      'Know remote tools (Quick Assist, RDP, ScreenConnect, TeamViewer, AnyDesk, SSH) and RMMs (NinjaOne, Datto, N-able).',
      'Always get explicit consent, protect private windows, narrate clicks, never ask passwords, and close sessions cleanly.',
      'Teach employees that genuine IT never cold-calls asking to install remote software (stop support scams!).',
      'Walk screen-free callers through fixes ONE plain step at a time, confirming what they see after every step.',
      'Drill all 9 Simulator categories (Printing, Hardware, Windows, Network, Accounts, Email/M365, Security, Mobile, Peripherals).',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 2 — Remote Access Technologies & Communication Etiquette',
    ],
  },
};
