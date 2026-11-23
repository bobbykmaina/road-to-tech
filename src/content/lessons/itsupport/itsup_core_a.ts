import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_CORE_A_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.0.1.2': {
    id: 'itsup.0.1.2',
    moduleId: 'it-support',
    unitTitle: 'Unit 0: What IT Support Is',
    topicTitle: '0.1 Service Desk Roles & Communication',
    code: '0.1.2',
    title: 'How Help Desk Fits Into IT Operations & Phone/Chat/Email Etiquette',
    readMinutes: 10,
    prerequisites: ['0.1.1 Support Tiers & Empathy'],
    versionScope: 'shared',

    learningObjectives: [
      'Explain how the frontline Help Desk coordinates with Systems Administration, Network Operations, Cybersecurity, and Application owners inside IT Operations.',
      'Translate intimidating technical acronyms (DNS, DHCP, cached token, latency) into reassuring, jargon-free user explanations.',
      'Manage multi-channel etiquette cleanly across synchronous **Phone calls**, semi-synchronous **Chat messages**, and asynchronous **Email/Portal tickets**.',
      'Handle high-volume queue spikes calmly by setting clear expectations, avoiding false promises, and protecting SLA clocks.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Saying "Just Flush Your DNS Cache and Check Event 10016" Terrifies Accounting Staff',
      narrative:
        'Imagine an Accounts Payable specialist missing a payroll deadline because a browser shortcut won’t open. You quickly fix the issue in 90 seconds—yet if your reply reads *"Cleared corrupted ARP/DNS resolver cache and reset TLS session state,"* the user feels confused, talked down to, and nervous to call again! Worse yet, leaving a chat user staring at silent "typing..." dots for 6 minutes makes a 6-minute wait feel like an hour. Mastering plain-English translation and channel etiquette separates trusted IT pros from robotic command typers.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an ER Concierge & Nurse Translating Doctor Chart Notes for Patients',
      analogy:
        'Doctors talk to each other in Latin medical Latin ("acute myocardial infarction"); they talk to families in calm, clear English ("Your dad had a heart blockage, we cleared it safely, and here is what happens next"). In IT Operations, your **Help Desk** sits at the exact center of the organization—talking to SysAdmins and Network Engineers in technical evidence inside **internal ticket notes**, while translating the exact same situation into clear, respectful everyday language for employees on phone, chat, or email.',
      technicalDefinition:
        'IT Operations divides infrastructure maintenance across Systems/Cloud Administration, Network Operations (NetOps), Information Security (InfoSec), and Application Support, with the **Service Desk** acting as the Single Point of Contact (SPOC). Effective omnichannel communication matches cadence to medium: concise reassurance on live voice, frequent micro-updates on chat, and scannable action summaries on email/portal replies.',
      paragraphs: [
        'Know the **Single Point of Contact (SPOC)** role of Help Desk: employees shouldn’t have to guess whether an Outlook glitch belongs to Server Ops, Networking, or Licensing. Every request flows cleanly through the Service Desk intake hub so patterns (like 8 people calling about the same floor switch!) get caught immediately.',
        'Respect **Channel Cadence**:\n• **Phone**: Never put someone on dead silence while typing! Narrate gently ("I’m checking your account status now—give me about 20 seconds") and ask permission before putting them on hold.\n• **Chat / Slack / Teams**: Never leave someone hanging for 5 minutes in silence! Acknowledge within 30 seconds and ping brief status check-ins every 2–3 minutes.\n• **Email / Portal**: Put the key answer or next action in the **very first two lines**—busy staff skim emails on phones and miss instructions buried in paragraph four.',
      ],
    },

    deepDive: {
      intro:
        'Follow how the Service Desk interacts across IT teams and formats clear messages for each support channel.',
      steps: [
        {
          step: 'Role Map',
          title: 'Service Desk Inside Modern IT Operations',
          explanation:
            'Help Desk fields L1 faults directly and routes verified escalations to **SysAdmins** (servers/accounts/deployments), **NetOps** (switches/Wi-Fi/VPNs/firewalls), **InfoSec** (phishing/compromise containment), and **App Owners** (ERP/CRM software bugs).',
        },
        {
          step: 'Translation',
          title: 'The "No-Jargon" User Translation Filter',
          explanation:
            'Replace internal diagnostics (*"Your DHCP lease expired in APIPA `169.254`"* -> *"Your laptop temporarily lost its automatic network address from the office server; reconnecting refreshed it cleanly"*). Keep precise technical proof strictly in **Internal Notes**!',
        },
        {
          step: 'Expectations',
          title: 'Setting Honest Timeframes (Under-Promise, Over-Deliver)',
          explanation:
            'Never say *"It’ll be fixed in 5 minutes"* unless you control the fix directly. Say *"I’m escalating your verified findings to our Network team right now; you can expect an update by 2:00 PM at the latest, and here is your temporary workaround meanwhile."*',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Service Desk as Single Point of Contact (SPOC) Across IT Operations',
        asciiFallback: `[Employees: Finance, Sales, HR, Execs]
         |  (Phone / Chat / Portal Email)
         v
[IT SERVICE DESK (SPOC)]  <--- Plain-English empathy & updates outward!
   |         |          |          |
   v         v          v          v  (Technical internal escalation notes!)
[SysAdmin] [NetOps]  [InfoSec]  [App Owners]`,
      },
      workedExample: {
        title: 'Worked Translation: Rewriting a Technical Note Into a Warm Email Reply',
        context:
          'Internal fix: "Killed stuck `winword.exe` process consuming 94% CPU, cleared corrupt `Normal.dotm` template, verified clean relaunch."',
        steps: [
          'Do NOT send the raw internal note above to an anxious HR coordinator.',
          'Put result first in friendly plain English: *"Hi Priya — your Microsoft Word documents are opening smoothly again! A background Word process had frozen and was blocking new files from launching, so we closed the stuck session and reset your blank document template (no saved files were touched)."*',
          'Close warmly with prevention: *"If Word ever pauses on launch again, give your laptop a quick Restart first, or ping us anytime!"*',
        ],
        outcome:
          'The internal ticket preserves exact forensic facts for technicians while the user feels respected and informed.',
      },
    },

    supportWalkthrough: {
      intro:
        'Keep these channel etiquette scripts ready during busy shift queues.',
      steps: [
        {
          phase: 'Phone Calls',
          action: 'Speak clearly, use the caller’s name, ask permission before hold/mute, and narrate pauses.',
          whyItWorks: 'Eliminates dead-air anxiety and builds immediate rapport over voice.',
        },
        {
          phase: 'Live Chat',
          action: 'Send immediate receipt acknowledgment, break questions into 1–2 short lines, and check in every 2 minutes during checks.',
          whyItWorks: 'Users multi-task during chat; short clear lines prevent unread walls of text.',
        },
        {
          phase: 'Email / Portal',
          action: 'Lead with the summary answer/action in sentence one, bullet numbered steps cleanly, and state exact follow-up time.',
          whyItWorks: 'Matches mobile skimming habits and slashes back-and-forth clarification replies.',
        },
      ],
      questionsToAsk: [
        '"May I place you on a brief 60-second hold while I verify your printer queue status?"',
        '"Just checking—did those steps restore access on your screen, or are you still seeing any prompt?"',
        '"Which time window today works best for a quick 5-minute remote session so I don’t interrupt your meetings?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a server/network outage during morning rush without panic',
          sayThis:
            '"We’re currently seeing a regional Wi-Fi login delay affecting Building B, and our Network engineers are actively working on it now. While they restore full Wi-Fi, plugging an Ethernet cable into your desk dock gets you online right away—I’ll update your ticket as soon as Building B clears."',
        },
        {
          situation: 'Wrapping up a chat cleanly',
          sayThis:
            '"Awesome—glad that spreadsheet opened cleanly! I’ll mark this ticket resolved now, and if anything freezes again today just reply right here to reopen it immediately."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Desktop Applications -> Freezing / Hung Process',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium (Work delayed, partial workaround available) = P3 Normal',
        internalNotes: `[SYMPTOM] Word hanging on splash screen on HR-LT-112.
[CHECKS] Confirmed other Office apps (Excel/Outlook) functional; 1.8 GB RAM free. Task Manager showed orphan winword.exe process stuck in suspended state.
[ACTION] Ended hung process, renamed corrupted Normal.dotm backup, verified 3 test docs open cleanly with user watching.`,
        customerReply:
          'Hi Priya — Everything is back to normal and your saved documents are safe. A background Word task had stalled silently; clearing that stuck task fixed the launch freeze. Let us know anytime if you need anything else!',
        escalationCriteria:
          'Escalate to Tier 2 Desktop Engineering only if template corruption repeats across multiple HR laptops after today’s Office update.',
      },
    },

    commonTraps: [
      {
        trap: 'Pasting raw technical jargon (`DNS`, `APIPA`, `GPO`, `LSA`) straight into user-facing replies.',
        reality: 'Keep technical precision in **Internal Notes** and translate into calm, plain everyday outcomes for **Customer Replies**.',
      },
      {
        trap: 'Putting callers on silent mute/hold for 3 minutes without warning.',
        reality: 'Silent phone gaps sound like a dropped call—ask before holding and give brief narration updates.',
      },
      {
        trap: 'Promising *"Tier 2 will call you in 10 minutes"* when you don’t control Tier 2’s emergency queue.',
        reality: 'Quote honest SLA expectations rather than guessing timelines you cannot guarantee.',
      },
    ],

    keyTerms: [
      {
        term: 'Single Point of Contact (SPOC)',
        shortDef: 'Central Service Desk hub routing and coordinating all user requests across IT Operations.',
        fullDef: 'Prevents users from guessing which specialist team owns an issue and catches multi-user patterns early.',
      },
      {
        term: 'Jargon Translation',
        shortDef: 'Converting technical root causes into clear, respectful user explanations without condescending tone.',
        fullDef: 'Balances precision in Internal Notes against readability in Customer Replies.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-012-q1',
        prompt: 'Which customer reply best applies plain-English jargon translation after fixing a laptop that pulled an invalid `169.254.x.x` address because DHCP timed out?',
        options: [
          '"Your laptop didn’t receive an automatic office network address when waking up; refreshing the connection restored internet access cleanly."',
          '"Your NIC failed DORA UDP 67/68 negotiation and sat in APIPA until `ipconfig /renew`."',
          '"The router broke and we fixed TCP/IP Layer 3."',
          '"Issue resolved."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Explains clearly what happened in reassuring plain language without patronizing jargon or empty mystery.',
          'Incorrect: Dumps confusing acronyms (`NIC`, `DORA`, `APIPA`) best reserved for Internal Notes.',
          'Incorrect: Inaccurate and overly technical blame.',
          'Incorrect: Far too terse; leaves the user unsure whether anything was checked.',
        ],
        takeaway: 'Technical evidence belongs in Internal Notes; plain, respectful English belongs in Customer Replies.',
      },
      {
        id: 'itsup-012-q2',
        prompt: 'During a live support call, you need 45 seconds to pull up the user’s account logs in your admin console. What is the best phone etiquette?',
        options: [
          'Tell the user briefly what you’re checking ("Let me pull up your login logs—this will take about 30 seconds") or ask permission before a brief hold.',
          'Put the caller straight on mute silently without saying anything.',
          'Hang up and send an email next hour.',
          'Say "Stop talking so I can type faster."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Narrating pauses or asking politely before holding eliminates awkward silence.',
          'Incorrect: Dead silence makes callers think the phone disconnected.',
          'Incorrect: Hanging up breaks service trust completely.',
          'Incorrect: Rude phrasing escalates frustration immediately.',
        ],
        takeaway: 'Narrate brief delays and always ask before placing callers on hold.',
      },
      {
        id: 'itsup-012-q3',
        prompt: 'Why is an enterprise Service Desk positioned as a **Single Point of Contact (SPOC)** for all employee tech issues?',
        options: [
          'Employees get one clear place to report problems, while the desk spots multi-user outages early and routes verified tickets cleanly across IT teams.',
          'So Help Desk technicians must personally rewrite core firewall firmware themselves.',
          'To hide outages from Network Engineers.',
          'So emails never need ticket numbers.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SPOC centralizes intake, spots site-wide trends immediately, and coordinates SysAdmin/NetOps/InfoSec handoffs cleanly.',
          'Incorrect: Core infrastructure changes stay with specialist teams via warm escalation.',
          'Incorrect: SPOC improves visibility across teams.',
          'Incorrect: Tracking every interaction in a ticketing system is core SPOC discipline.',
        ],
        takeaway: 'SPOC = one clear intake doorway for employees and coordinated triage across IT Operations.',
      },
      {
        id: 'itsup-012-q4',
        prompt: 'When writing an email reply explaining two diagnostic steps an employee should try, where should the key takeaway and requested action appear?',
        options: [
          'Right in the opening 1–2 sentences at the top, followed by short numbered bullets.',
          'Buried in the final paragraph after full command-line output.',
          'Inside a 400-word single unbroken paragraph.',
          'Nowhere—let the user guess.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Putting the answer/action up top respects busy employees reading on phones.',
          'Incorrect: Long command logs upfront cause readers to miss actual instructions.',
          'Incorrect: Walls of text rarely get read carefully.',
          'Incorrect: Always make next steps unmistakable.',
        ],
        takeaway: 'Lead emails with the outcome or requested action first, then short numbered bullets.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Practice Plain-English Customer Replies in the Simulator',
      targetTab: 'simulator',
      instructions: [
        'Open Simulator and practice separating crisp **Internal Notes** from jargon-free **Customer Replies** on any Tier 1 ticket.',
        'Check your phrasing aloud to verify zero unexplained acronyms slip into user updates.',
      ],
      verificationCheck: 'Internal Notes carry technical facts while Customer Replies read warmly in everyday English.',
    },

    summaryBullets: [
      'The Service Desk serves as IT Operations’ **Single Point of Contact (SPOC)** alongside SysAdmins, NetOps, InfoSec, and App teams.',
      'Separate audiences strictly: technical evidence in **Internal Notes**; friendly plain English in **Customer Replies**.',
      'Narrate brief phone pauses and ask permission before putting callers on hold.',
      'Keep chat updates short and frequent (every 2–3 minutes); lead emails with the answer/action first.',
      'Set honest, realistic SLA timeframes rather than guessing instant fixes.',
    ],

    sourcesToVerify: [
      'ITIL 4 Practice Guide — Service Desk Communication & Stakeholder Management',
      'CompTIA A+ Core 2 — Domain 4.0 Operational Procedures (Communication Best Practices)',
    ],
  },

  'itsup.core.tickets.lifecycle': {
    id: 'itsup.core.tickets.lifecycle',
    moduleId: 'it-support',
    unitTitle: 'Unit 1: Tickets and the Support Process',
    topicTitle: '1.1 Ticket Lifecycle & Priority',
    code: '1.1.1',
    title: 'What a Ticket Is: Fields, Queues, Categories, Impact × Urgency Priority & SLAs',
    readMinutes: 13,
    prerequisites: ['0.1.1 Support Tiers & Empathy'],
    versionScope: 'shared',

    learningObjectives: [
      'Explain why every support interaction—even a 60-second hallway fix—requires a recorded **Ticket** inside the ticketing system.',
      'Distinguish the four core ITSM record types: **Incident** (something broken), **Service Request** (planned standard ask), **Problem** (underlying root cause of recurring incidents), and **Change** (controlled system modification).',
      'Trace every **Ticket Lifecycle State** cleanly (`New` -> `Triaged` -> `In Progress` -> `Waiting on Customer` -> `Resolved` -> `Closed`) and understand when SLA timers pause.',
      'Calculate Priority (`P1–P4`) objectively via **Impact × Urgency** and protect **Response** vs **Resolution SLAs**.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Can You Just Reset My Access Quickly Without Logging a Ticket?"',
      narrative:
        'A friendly coworker stops you in the kitchen: *"Hey, could you give me access to the Finance shared folder real quick? No need to make a ticket!"* Two problems strike immediately if you skip the ticketing system: (1) Next month’s security audit asks who approved Finance access—and there is zero paper trail; (2) If 15 other users have the exact same broken printer driver this morning, undocumented "quick favors" hide a building-wide pattern! Tickets create accountability, SLA fairness, trend visibility, and legal audit proof.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Commercial Kitchen Order Ticket Rail Keeping 50 Orders Sorted Safely',
      analogy:
        'Imagine a busy diner without printed order tickets—guests just shout requests across the counter! Meals get forgotten, allergies get missed, and VIP tables skip ahead unfairly. Every **Support Ticket** is a structured order slip moving across a tracked rail: it captures **Who** needs help, **What** broke or is requested, **How urgent** it is relative to every other order (**Priority = Impact × Urgency**), **Who owns it** (**Assignee & Queue**), and **Every check performed** so anyone stepping onto the shift picks up seamlessly.',
      technicalDefinition:
        'A **Ticket** is a structured transactional record tracking an IT interaction from intake to closure. Modern ITSM workflows separate unplanned interruptions (**Incidents**) from standard pre-approved provisions (**Service Requests**), recurring root-cause investigations (**Problems**), and controlled production modifications (**Changes**), routing work through queues governed by **Impact × Urgency Priority Matrices** and contractual **Service Level Agreements (SLAs)**.',
      paragraphs: [
        'Learn the universal **Ticketing Fields** shared by practically every help desk platform on earth:\n• **Requester / Affected User**: Who is experiencing the issue.\n• **Category / Subcategory**: e.g., `Hardware -> Printer` or `Access -> Password/Lockout`.\n• **Queue / Assignment Group**: Which team currently owns the next action (`L1 Service Desk`, `L2 Desktop`, `NetOps`).\n• **Status / Lifecycle Stage**: Where the ticket sits (`New`, `In Progress`, `Pending Customer`, `Escalated`, `Resolved`, `Closed`).\n• **Priority (`P1–P4`)**: Computed from **Impact × Urgency**.',
        'Watch the vital difference between **Waiting on Customer (`Pending`)** vs leaving a ticket **`In Progress`**: when you email a user *"Please reboot and let me know if Excel opens,"* switch status to **`Waiting on Customer`**! Why? In most ticketing systems, `Waiting on Customer` **pauses the SLA resolution clock** cleanly so a user taking 3 days to reply doesn’t cause false SLA breaches on your metrics.',
        'Finally, remember **Resolved vs Closed**: **`Resolved`** means you fixed the problem and await the user’s confirmation (if it breaks again tomorrow, the user can usually reply to reopen it). **`Closed`** means the confirmation window (e.g., 48–72 hours) passed peacefully and the record is permanently archived.',
      ],
    },

    deepDive: {
      intro:
        'Walk step-by-step through record types, ticket statuses, and Impact × Urgency priority calculation.',
      steps: [
        {
          step: 'Record Types',
          title: 'Incident vs. Service Request vs. Problem vs. Change',
          explanation:
            '• **Incident**: Unplanned break/degradation (*"Wi-Fi keeps dropping on Floor 2"* -> restore fast!).\n• **Service Request**: Planned standard ask (*"New monitor stand"*, *"Access to Marketing folder"*).\n• **Problem**: Root-cause investigation linking 12 recurring printer Incidents.\n• **Change**: Planned firewall or server upgrade scheduled cleanly with rollback.',
        },
        {
          step: 'Priority Matrix',
          title: 'Objective Priority (`P1 Critical` to `P4 Low`)',
          explanation:
            '**Impact** measures blast radius (Enterprise-wide -> High; Department -> Medium; Single User -> Low). **Urgency** measures time criticality (Work halted completely -> High; Workaround exists -> Medium; Cosmetic -> Low).\n• `High × High` = **P1 Critical** (All-hands outage -> 15m response).\n• `Medium × High` / `High × Med` = **P2 High** (Department/critical executive deadline).\n• `Low × Med` / `Med × Low` = **P3 Normal** (Standard single-user issue).\n• `Low × Low` = **P4 Low** (Minor cosmetic or future request).',
        },
        {
          step: 'Lifecycle',
          title: 'The 6 Standard Ticket States & SLA Clocks',
          explanation:
            '`New` (clock starts!) -> `Triaged / Assigned` (first response SLA met!) -> `In Progress` -> `Waiting on Customer` (SLA paused fairly while awaiting user reply!) -> `Resolved` (fix delivered, awaiting confirmation) -> `Closed` (archived).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Standard Vendor-Neutral Ticket Lifecycle & SLA Clock Flow',
        asciiFallback: `[New] --(L1 Intake: Categorize + Impact x Urgency Priority)--> [Assigned / In Progress]
                                                               |               ^
     (Need user reply/screenshot -> PAUSES SLA!) --------------+               | (User replies!)
     v                                                                         |
[Waiting on Customer] ---------------------------------------------------------+
     |
     v (Fix verified / Warm Escalation resolved)
[Resolved] --(Confirm working / 48h window)--> [Closed]`,
      },
      workedExample: {
        title: 'Worked Classification & Priority Check: Three Morning Calls',
        context:
          'You receive three tickets at 9:05 AM inside your practice ticketing workbench:',
        steps: [
          'Call A: *"Nobody on the entire 4th floor (60 staff) can connect to corporate Wi-Fi or shared drives!"* -> **Incident**, Impact High × Urgency High = **P1 Critical** -> Escalate immediately as Major Incident!',
          'Call B: *"Hi, our new marketing intern starts next Monday and needs Adobe Creative Cloud installed."* -> **Service Request** (nothing is broken!), Impact Low × Urgency Low = **P4 Low** -> Route through software approval workflow.',
          'Call C: *"My desktop Outlook won’t sync, though webmail works fine for now."* -> **Incident**, Impact Low (1 user) × Urgency Low/Medium (has clean workaround) = **P3 Normal**.',
        ],
        outcome:
          'Separating Incidents from Service Requests and scoring Impact × Urgency prevents minor asks from starving real outages.',
      },
    },

    supportWalkthrough: {
      intro:
        'Follow this vendor-neutral checklist every time a ticket arrives in your queue.',
      steps: [
        {
          phase: '1. Classify Record',
          action: 'Pick Incident (broken service) vs Service Request (new item/access) immediately.',
          whyItWorks: 'Prevents planned provisioning asks from distorting Incident outage metrics.',
        },
        {
          phase: '2. Score Priority Honestly',
          action: 'Check blast radius (Impact) and workaround availability (Urgency) to pick P1–P4.',
          whyItWorks: 'Protects genuine P1/P2 emergencies from getting drowned by squeaky-wheel P3s.',
        },
        {
          phase: '3. Manage Ticket State',
          action: 'Move to `In Progress` when working, `Waiting on Customer` when awaiting user action, and `Resolved` only after delivering a verified fix.',
          whyItWorks: 'Keeps SLA reporting fair and prevents stalled queues.',
        },
      ],
      questionsToAsk: [
        '"Are coworkers around you experiencing this too, or only your workstation?"',
        '"Is there a working backup path right now (like webmail or another printer) while we fix your primary setup?"',
        '"Could you share your computer hostname/asset tag on the sticker underneath?"',
      ],
      sampleUserWording: [
        {
          situation: 'Politely declining an untracked hallway "quick favor" for permission changes',
          sayThis:
            '"I’d love to help get that folder access set up! Because Finance folder access requires a logged approval trail for audits, let’s drop a quick 30-second portal request right now so I can process and track it safely for you."',
        },
        {
          situation: 'Putting a ticket into Waiting on Customer cleanly',
          sayThis:
            '"Whenever you have a free minute between meetings, please restart once and reply with whether that error box disappears—I’ll pause this ticket on your reply so it stays right on my radar!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Network / Connectivity -> Wireless Floor Outage',
        priorityFormula: 'Impact: High (60 Finance/Ops staff on Floor 4) × Urgency: High (Core work halted) = P1 Critical',
        internalNotes: `[RECORD TYPE] Incident
[SCOPE] 4th Floor North Wing (approx. 60 users offline on corporate SSID; wired docks still operational).
[SYMPTOMS] APs FL4-AP01..04 flashing amber; users fail IP acquisition.
[ACTION] Confirmed P1 scope -> Paged Network Operations on-call with switch uplink details (IDF-4A).`,
        customerReply:
          'Hi Team — We have confirmed a wireless issue affecting the 4th Floor North area and marked it Critical priority with our Network engineers actively investigating now. Wired Ethernet desks remain online as an immediate workaround, and we will update everyone at 10:00 AM.',
        escalationCriteria:
          'Immediate P1 Major Incident warm handoff to Network Operations upon confirming 2+ APs / entire floor affected.',
      },
    },

    commonTraps: [
      {
        trap: 'Resolving hallway "quick favors" involving permissions or hardware without logging a ticket.',
        reality: 'No ticket = no audit trail, no credit for your desk workload, and hidden recurring Problems never surface.',
      },
      {
        trap: 'Classifying a new software installation or monitor ask as an **Incident**.',
        reality: 'If nothing broke—the user simply wants something new—it is a **Service Request**, not an Incident.',
      },
      {
        trap: 'Leaving a ticket in `In Progress` while waiting 4 days for a user to reply.',
        reality: 'Switch to **`Waiting on Customer`** so SLA resolution timers pause accurately.',
      },
    ],

    keyTerms: [
      {
        term: 'Incident vs Service Request',
        shortDef: 'Incident = unplanned outage/error; Service Request = pre-approved standard user ask.',
        fullDef: 'Two distinct ticket types with separate workflows, approvals, and SLAs.',
      },
      {
        term: 'Problem vs Change',
        shortDef: 'Problem = root cause behind repeated incidents; Change = controlled production update.',
        fullDef: 'Fixing a Problem permanently prevents future Incidents from recurring.',
      },
      {
        term: 'SLA (Service Level Agreement)',
        shortDef: 'Target response and resolution deadlines bound to ticket Priority (`P1–P4`).',
        fullDef: 'Tracks First Response Time and Time to Resolution; pauses cleanly during `Waiting on Customer`.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-111-q1',
        prompt: 'A marketing employee asks IT to install Visio on their laptop because their new project starts next Monday. Nothing on their laptop is malfunctioning. How should this ticket be classified?',
        options: ['Service Request', 'P1 Critical Incident', 'Problem Record', 'Emergency Change'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Requests for new software, hardware, or standard permissions when nothing broke are **Service Requests**.',
          'Incorrect: Incidents apply only when an existing IT service stops or degrades.',
          'Incorrect: Problem records investigate recurring infrastructure root causes.',
          'Incorrect: Emergency Changes patch urgent production risks, not individual software installs.',
        ],
        takeaway: 'Broken service = **Incident**; standard new ask = **Service Request**.',
      },
      {
        id: 'itsup-111-q2',
        prompt: 'An employee stops you at lunch and asks for access to a restricted payroll folder "real quick without opening a ticket." What is the right response?',
        options: [
          'Politely explain that access changes require a logged ticket for audit and approval tracking, and help submit it cleanly.',
          'Grant the access immediately from your phone without any record.',
          'Ignore the user completely.',
          'File it as a P1 outage.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: "No ticket, no change"—every permission grant needs an auditable approval trail.',
          'Incorrect: Granting untracked payroll permissions violates security and compliance.',
          'Incorrect: Help them log the request graciously.',
          'Incorrect: Access asks are Service Requests, not outages.',
        ],
        takeaway: 'Never skip ticketing for convenience, especially on security or permission requests.',
      },
      {
        id: 'itsup-111-q3',
        prompt: 'You send troubleshooting steps to a traveling salesperson and need them to confirm whether the fix worked before resolving. Which ticket status stops the SLA resolution clock unfairly ticking down while they sit on an airplane?',
        options: ['`Waiting on Customer` (Pending User)', '`New`', '`P1 Critical`', '`Closed`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **`Waiting on Customer`** pauses SLA resolution clocks while awaiting user reply/confirmation.',
          'Incorrect: `New` runs the initial Response SLA clock.',
          'Incorrect: Priority increases SLA urgency rather than pausing.',
          'Incorrect: Never close a ticket prematurely before checking if the user is actually fixed!',
        ],
        takeaway: 'Use **`Waiting on Customer`** whenever the ball is strictly in the user’s court.',
      },
      {
        id: 'itsup-111-q4',
        prompt: 'Fourteen separate Incidents arrive this week for `Branch Printer B2` jamming and dropping off the network. Which ITSM record investigates and eliminates the shared **underlying root cause** permanently?',
        options: ['Problem', 'Service Request', 'SLA Waiver', 'Waiting on Customer'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Problem Management** links recurring Incidents together to cure the permanent root cause (e.g., faulty print server firmware).',
          'Incorrect: Service Requests deliver standard items.',
          'Incorrect: Not an ITSM record lifecycle stage.',
          'Incorrect: Ticket status.',
        ],
        takeaway: 'Recurring Incidents get linked into a **Problem** to fix root cause permanently.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Triage Priority & Ticket Lifecycle in Simulator',
      targetTab: 'simulator',
      instructions: [
        'Open Simulator and practice scoring Blast Radius (Impact) × Urgency accurately on beginner & intermediate scenarios.',
        'Note the difference between Incident, Request, Problem, and Change across queues.',
      ],
      verificationCheck: 'Scores Impact × Urgency objectively without assigning P1 to single-user inconveniences.',
    },

    summaryBullets: [
      'Every support interaction belongs in a **Ticket** for SLA tracking, trend detection, and security auditability.',
      'Separate **Incidents** (broken), **Service Requests** (standard asks), **Problems** (root cause of repeat incidents), and **Changes** (controlled edits).',
      'Calculate Priority objectively using **Impact (blast radius) × Urgency (time criticality)**.',
      'Move tickets to **`Waiting on Customer`** when awaiting user input so SLA clocks pause fairly.',
      '`Resolved` awaits confirmation/auto-close; `Closed` permanently archives the finished record.',
    ],

    sourcesToVerify: [
      'ITIL 4 Foundation — Incident, Service Request, Problem & Change Enablement Practices',
    ],
  },

  'itsup.core.tickets.notes-kb': {
    id: 'itsup.core.tickets.notes-kb',
    moduleId: 'it-support',
    unitTitle: 'Unit 1: Tickets and the Support Process',
    topicTitle: '1.1 Internal Notes, Customer Replies & Knowledge Base',
    code: '1.1.2',
    title: 'Writing Actionable Internal Notes, Customer Replies, Warm Escalations & KB Basics',
    readMinutes: 12,
    prerequisites: ['1.1.1 Ticket Lifecycle & Priority'],
    versionScope: 'shared',

    learningObjectives: [
      'Write crisp, structured **Internal Notes** using the **5-Part Evidence Pattern** (`Symptom`, `Scope`, `Device/IP`, `Checks Run`, `Next Action`) without venting or guesswork.',
      'Draft respectful **Customer Replies** visible to end users—and NEVER accidentally leak private internal speculation into public reply boxes!',
      'Prepare a complete **Warm Escalation** packet that saves Tier 2 engineers 20 minutes of duplicate troubleshooting.',
      'Recognize when a repeatable fix should be turned into a clean **Knowledge Base (KB)** article so Tier 1 resolves future calls in 2 minutes.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why One Sloppy "User Mad, Network Probably Broken" Note Embarrassed the Whole Desk',
      narrative:
        'Imagine a busy Friday afternoon when a tired technician accidentally types *"This user never reads instructions and our firewall team broke VPN again—passing to NetOps"* directly into the **Customer-Visible Reply** box instead of **Internal Notes**! Within 3 minutes, the client’s VP sees that message via email notification. Worse yet, NetOps rejects the ticket back because no hostname, IP, error code, or test results were attached. Clean ticket writing protects your professionalism, builds instant credibility with Tier 2, and turns chaos into searchable company knowledge.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Detective’s Evidence Locker vs the Family Update Letter',
      analogy:
        'Every ticket contains two strictly separate writing pads:\n1. **Internal Notes** (private — ONLY IT staff see this): This is the forensic evidence chart. Write exact timestamps, error codes, hostnames, commands tried, and exact failure results cleanly so another technician stepping in 3 hours later knows *everything* without asking the user twice.\n2. **Customer Reply** (public — emailed straight to the user!): Warm, clear, blame-free status updates in plain English.\nNever cross those two streams—never put casual frustration inside ANY ticket field, because managers, HR, and audits can read Internal Notes too!',
      technicalDefinition:
        'Effective ITSM documentation separates **Internal Work Notes** (chronological technical diagnostics, asset IDs, scope, and verified results) from **Customer-Visible Replies** (plain-English empathy, workarounds, and actions), feeding clean **Warm Escalations** to specialist queues and repeatable **Knowledge Base (KB)** articles for permanent First Contact Resolution uplift.',
      paragraphs: [
        'Use the **Factual 5-Line Internal Note Standard** on every single ticket:\n• **`[SYMPTOM]`**: Exact error text / broken behavior.\n• **`[SCOPE]`**: Single user vs floor/department vs company-wide.\n• **`[DEVICE/ACCOUNT]`**: Hostname, OS, IP/subnet, username.\n• **`[CHECKS RUN]`**: Exact tests executed and their *exact* outputs (`ping`, `nslookup`, logs, safe reboots).\n• **`[NEXT ACTION / RESULT]`**: What fixed it, or why it requires Tier 2 access.',
        'Treat every ticket as a **permanent legal/HR record**: never write snarky remarks (*"PEBCAK"*, *"User being dramatic"*) even in private Internal Notes! Stay objective: *"User attempted login 4x with updated password; Event 4740 traced bad retries to secondary iPad Mail client."* ',
        'Spot **KB (Knowledge Base)** gold: whenever you figure out a quirky fix that took 25 minutes—or solve the same printer error 3 times this week—write a short 4-step **KB article** (*Symptom -> Quick Check -> Fix -> Verify*) so the entire team resolves it in 90 seconds tomorrow!',
      ],
    },

    deepDive: {
      intro:
        'Compare weak vs exemplary ticket notes, Warm Escalations, and KB structure inside a vendor-neutral workbench.',
      steps: [
        {
          step: 'Rule 1',
          title: 'Internal Notes vs. Public Customer Replies',
          explanation:
            'Double-check which tab/box you are typing into **every single time** before clicking Save! Technical commands, screenshots of Event Logs, and AD/network specifics stay in **Internal Notes**; polite plain outcomes live in **Customer Replies**.',
        },
        {
          step: 'Rule 2',
          title: 'The Warm Escalation Standard (Anti-"Cold Transfer")',
          explanation:
            'A **Cold Transfer** (*"VPN broken, please check"*) forces Tier 2 to restart triage from zero. A **Warm Escalation** attaches Symptom + Scope + Asset + Verified Tests + Exact Permissions Missing so Tier 2 fixes it in minutes.',
        },
        {
          step: 'Rule 3',
          title: 'Capturing Knowledge Base (KB) Articles',
          explanation:
            'Every strong KB doc has four crisp blocks: **Title** (searchable using user wording!), **Applies To** (OS/App), **Symptoms**, and **Step-by-Step Resolution**.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Ticket Documentation Flow: Internal Evidence vs Public Reply vs KB Capture',
        asciiFallback: `[Ticket Open]
  |--> [INTERNAL NOTE (IT Only)]   : [SYMPTOM] [SCOPE] [HOST/IP] [TESTS + OUTPUTS] [NEXT STEP]
  |--> [CUSTOMER REPLY (Emailed!)] : Polite plain-English update + workaround + next update time
  |--> (If Escalating)             : Warm Handoff Packet -> Tier 2 fixes on first touch!
  |--> (If Repeatable Fix)         : Publish 4-line KB Article -> Team FCR jumps!`,
      },
      workedExample: {
        title: 'Worked Rewrite: Turning a Terrible Cold Note Into an Exemplary Warm Escalation',
        context:
          'Bad original note: *"Bob says shared drive doesn’t work. Rebooted his PC, didn’t help. Sending to SysAdmins."*',
        steps: [
          'Ask 3 basic triage checks before escalating: Does it happen for neighbors? Can Bob ping/resolve `filesrv02`? What exact Windows error code appears?',
          'Rewrite Internal Note cleanly:\n  `[SYMPTOM] Access to \\\\filesrv02\\Finance fails with "0x80070035 The network path was not found".`\n  `[SCOPE] Bob (FIN-LT-08) AND 4 neighboring Finance users on Floor 2 VLAN 20 fail identically; Floor 1 IT test PC connects cleanly.`\n  `[CHECKS] DNS resolves filesrv02 -> 10.10.2.25; ICMP ping succeeds (2ms); Test-NetConnection -Port 445 times out from FIN-LT-08.`\n  `[ESCALATION] Suspected firewall/ACL block on TCP 445 between VLAN 20 and Server VLAN 100. Routing to NetOps/Tier 2.`',
          'Send brief warm Customer Reply letting Bob know engineering is checking a Floor 2 folder connection rule.',
        ],
        outcome:
          'NetOps spots the missing TCP 445 permit rule on the Floor 2 ACL in 4 minutes instead of bouncing the ticket back.',
      },
    },

    supportWalkthrough: {
      intro:
        'Practice this clean Internal Note & KB rhythm inside every lab and practice ticket.',
      steps: [
        {
          phase: '1. Verify Audience Tab',
          action: 'Confirm Internal Note vs Customer Reply BEFORE typing a single character.',
          whyItWorks: 'Eliminates embarrassing accidental emails carrying internal debug guesses.',
        },
        {
          phase: '2. Log Exact Errors & Tests',
          action: 'Copy exact error strings (`0x80070035`, `NXDOMAIN`) and command outputs rather than paraphrasing ("weird error").',
          whyItWorks: 'Exact error codes match KB search instantly and save escalation engineers hours.',
        },
        {
          phase: '3. Summarize Fix & Root Cause at Close',
          action: 'Never resolve with `"Fixed"`; write `"Root Cause + Exact Fix + User Confirmed"` cleanly.',
          whyItWorks: 'Turns closed tickets into reliable history if the problem recurs next quarter.',
        },
      ],
      questionsToAsk: [
        '"Could you read or screenshot the exact error code number in that popup?"',
        '"After applying that change, can you confirm your test file opened normally?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a warm escalation without making the user feel passed off',
          sayThis:
            '"I’ve verified your network connection and DNS lookup are healthy, and narrowed this down to a server folder rule that requires our Network Infrastructure team. I’ve packaged all our test results onto your ticket so you won’t have to repeat anything, and you’ll hear an update by 2:30 PM."',
        },
      ],
      ticketNoteTemplate: {
        category: 'File Shares / Network Access -> SMB Error 0x80070035',
        priorityFormula: 'Impact: Medium (5 Finance users) × Urgency: High (Month-end close blocked) = P2 High',
        internalNotes: `[SYMPTOM] Error 0x80070035 reaching \\\\filesrv02\\Finance.
[SCOPE] 5 Floor-2 Finance workstations (VLAN 20); Floor-1 unaffected.
[DEVICE] FIN-LT-08 (10.20.20.14).
[CHECKS] nslookup filesrv02 = 10.10.2.25 OK; ping 10.10.2.25 = 2ms OK; Test-NetConnection 10.10.2.25 -Port 445 = TcpTestSucceeded: False.
[ACTION] Escalating to Tier 2 / NetOps to inspect VLAN 20 <-> Server VLAN ACL for TCP/445.`,
        customerReply:
          'Hi Bob — Thank you for running those quick checks with me. I confirmed your workstation is reaching our network normally, and traced the block specifically to a Floor 2 file-server port rule. I’ve passed every test result directly to our Network Engineering team on P2 priority so you won’t have to repeat a single step, and we’ll update you shortly.',
        escalationCriteria:
          'Verified TCP 445 blocked exclusively from VLAN 20; L1 lacks firewall/ACL edit permissions.',
      },
    },

    commonTraps: [
      {
        trap: 'Resolving tickets with a one-word closure like `"Done"` or `"Fixed"`.',
        reality: 'Provides zero value to future analysts when the issue returns and fails every help desk QA audit.',
      },
      {
        trap: 'Typing venting or blame about users ("User doesn’t listen") into Internal Notes.',
        reality: 'Internal Notes are permanent corporate records visible to supervisors, legal/HR audits, and sometimes accidental toggles.',
      },
      {
        trap: 'Repeating questions the user already answered in their portal form because you didn’t read the ticket description first.',
        reality: 'Read existing ticket notes and screenshots thoroughly before calling or replying.',
      },
    ],

    keyTerms: [
      {
        term: 'Internal Work Note vs Customer Reply',
        shortDef: 'Private IT-only technical evidence log vs public user-facing status message.',
        fullDef: 'Separates raw forensic facts/hostnames/IPs from warm plain-English user communication.',
      },
      {
        term: 'Knowledge Base (KB)',
        shortDef: 'Searchable library of verified symptom-to-fix runbooks written by support teams.',
        fullDef: 'Boosts First Contact Resolution (FCR) and trains new Tier 1 hires rapidly.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-112-q1',
        prompt: 'You tried resetting a user’s Outlook profile and checked DNS, and still need to escalate to Tier 2. Which **Internal Note** gives Tier 2 the most actionable Warm Escalation?',
        options: [
          'Includes affected hostname (`FIN-LT-14`), exact error code (`0x80040115`), scope (`single user; webmail works`), and verified checks (`ping/nslookup OK, new Outlook profile tested`).',
          '"User says Outlook doesn’t work, tried some stuff, please fix."',
          '"User seems annoyed, escalating to Tier 2 immediately."',
          '"Fixed user issue—reopening to Tier 2 anyway."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Gives Tier 2 complete factual context, eliminating redundant callbacks.',
          'Incorrect: Classic cold transfer lacking asset, error code, and tests already tried.',
          'Incorrect: Emotion without diagnostics cannot help Tier 2 troubleshoot.',
          'Incorrect: Contradictory closure phrasing.',
        ],
        takeaway: 'Every Warm Escalation answers: Symptom + Scope + Asset + Checks Already Run + Why Escalated.',
      },
      {
        id: 'itsup-112-q2',
        prompt: 'Why must technicians remain strictly factual and respectful even inside **private Internal Notes**?',
        options: [
          'Internal Notes are permanent, auditable company records reviewed by managers, QA, legal, and compliance teams—and careless notes can leak.',
          'Users always receive Internal Notes automatically by SMS.',
          'Ticketing systems delete Internal Notes every midnight.',
          'Only AI bots read Internal Notes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Supervisors, peers, HR/legal audits, and accidental toggle mistakes expose unprofessional remarks permanently.',
          'Incorrect: Internal Notes stay hidden from normal user notifications, though accidental copy-paste or audits happen.',
          'Incorrect: Tickets are retained long-term for compliance.',
          'Incorrect: Human managers, auditors, and Tier 2 engineers read them daily.',
        ],
        takeaway: 'Write every Internal Note as if your manager and the user’s director could read it tomorrow.',
      },
      {
        id: 'itsup-112-q3',
        prompt: 'You notice five separate tickets this week for a new macOS printer driver conflict, and you document a reliable 4-step workaround. Where should you publish those steps so teammates solve tomorrow’s calls in 2 minutes?',
        options: [
          'Inside the team’s **Knowledge Base (KB)** linked to the incident category',
          'On a sticky note under your monitor',
          'Inside a P1 outage broadcast email to all 800 employees',
          'Nowhere—keep solutions secret so your stats look higher',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Turning repeat resolutions into clear **KB articles** lifts the entire team’s FCR and speed.',
          'Incorrect: Sticky notes help nobody else on the team.',
          'Incorrect: All-company P1 emails waste attention on minor macOS driver tips.',
          'Incorrect: Hoarding tribal knowledge harms team reliability and fails interviews.',
        ],
        takeaway: 'Turn repeat fixes into clean, searchable **Knowledge Base (KB)** articles.',
      },
      {
        id: 'itsup-112-q4',
        prompt: 'Which closure resolution note meets enterprise QA standards?',
        options: [
          '"Root Cause: Expired Wi-Fi cert on HR-LT-09. Fix: Renewed device cert via portal and verified corporate SSID connectivity with user. Confirmed fixed."',
          '"Fixed."',
          '"Called user, resolved."',
          '"Sent to user."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Captures Root Cause + Exact Action + Verification clearly.',
          'Incorrect: One-word closures fail QA audits completely.',
          'Incorrect: Missing what broke and what changed.',
          'Incorrect: Incomplete note.',
        ],
        takeaway: 'Good closure notes always include **Root Cause + Fix Applied + User Verification**.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Draft Structured Notes in Simulator Workbench',
      targetTab: 'simulator',
      instructions: [
        'Run any Scenario in Simulator and format your final Resolution submission using `[SYMPTOM]`, `[DIAGNOSTICS]`, and `[FIX & VERIFICATION]`.',
        'Check your rubric feedback to verify zero missing evidence.',
      ],
      verificationCheck: 'Produces factual Internal Notes, polite plain-English Customer Replies, and Warm Escalations.',
    },

    summaryBullets: [
      'Use the 5-part Internal Note formula: `[SYMPTOM]`, `[SCOPE]`, `[DEVICE]`, `[CHECKS RUN]`, `[NEXT ACTION]`.',
      'Always verify Internal Note vs Customer Reply before hitting Send—never mix internal guesses into public replies.',
      'Stay strictly professional and factual in all ticket fields; Internal Notes are permanent company records.',
      'Pair every **Warm Escalation** with exact error strings, scope, hostname, and tests already completed.',
      'Convert recurring fixes into searchable **Knowledge Base (KB)** articles to lift team FCR.',
    ],

    sourcesToVerify: [
      'ITIL 4 Practice Guide — Knowledge Management & Service Desk Documentation',
      'KCS (Knowledge-Centered Service) Fundamentals — Capture & Reuse Workflow',
    ],
  },

  'itsup.core.hw.workstation-triage': {
    id: 'itsup.core.hw.workstation-triage',
    moduleId: 'it-support',
    unitTitle: 'Unit 2: Hardware',
    topicTitle: '2.1 Workstation Hardware, Docking Stations & Peripherals',
    code: '2.1.1',
    title: 'CPU, RAM, NVMe Storage, POST Beep Codes, USB-C Docks & Network Printers',
    readMinutes: 14,
    prerequisites: ['1.1.2 Ticket Notes & KB'],
    versionScope: 'shared',

    learningObjectives: [
      'Explain the core roles and failure symptoms of **PSU/Battery**, **Motherboard/UEFI**, **CPU**, **RAM**, and **NVMe/SSD Storage**.',
      'Distinguish **No Power** (dead PSU/outlet/battery) from **No POST** (fans spin, black screen, diagnostic beep/LED codes) and **OS Boot Failure** (`No Bootable Device`).',
      'Troubleshoot common enterprise **USB-C / Thunderbolt Docking Station** glitches (under-wattage chargers, dual-display drops, MAC pass-through Ethernet disconnects).',
      'Isolate **Network Printer** faults cleanly (`Offline` state, jammed **Print Spooler**, wrong TCP/IP port, tray mismatch) and support corporate smartphones/tablets.',
    ],

    whyThisMatters: {
      scenarioTitle: '"My Laptop Is Completely Dead—Replace It Before My Flight!" (It Was a 65W Phone Charger)',
      narrative:
        'Monday 8:15 AM: a manager drops a laptop on the help desk shouting that the motherboard fried overnight and both monitors on their desk dock went black! Before blindly ordering a $1,600 replacement or mailing a depot ticket, a sharp L1 technician checks two things in 45 seconds: (1) They plugged a tiny 20W/45W phone USB-C cord into a workstation dock needing **90W–130W Power Delivery**, AND (2) holding the power button 15 seconds for a **static flea-power drain** plus reseating the Thunderbolt cable brings both 4K displays straight back to life!',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Workshop Desk: Power Outlet, Brain (CPU), Workbench (RAM) & Filing Cabinet (NVMe)',
      analogy:
        'Inside every computer:\n• **PSU / Battery** = electrical breaker box feeding stable DC watts.\n• **CPU** = the fast worker doing calculations.\n• **RAM** = the open **desktop surface** holding active apps right now (fast, temporary—clears on power off!).\n• **NVMe / SSD** = the **filing cabinet** holding Windows, macOS, and saved files permanently (slow if nearly full or failing SMART!).\nWhen you press Power, a tiny chip runs **POST (Power-On Self-Test)**—checking CPU, RAM, and display before ever loading Windows. If RAM popped loose in a backpack, the fans spin yet POST flashes diagnostic LEDs and refuses to light the screen!',
      technicalDefinition:
        'Workstation Layer-1 triage isolates power delivery (**AC/DC PSU & USB-C PD wattage**), firmware initialization (**UEFI/BIOS POST** diagnostics), volatile memory (**RAM** seating/ECC faults), solid-state storage (**NVMe M.2 / SMART health**), **USB-C/Thunderbolt dock** bandwidth/PD/driver faults, and enterprise **network printing** (TCP/IP port 9100/IPP, Print Spooler service, and driver isolation).',
      paragraphs: [
        'Use the three-bucket **Boot Fault Split** on every "Computer won’t turn on" ticket:\n1. **No Power**: Zero fans, zero charging LEDs -> test wall outlet, try a known-good AC brick, remove USB-C dock, perform **flea-power drain** (unplug AC, hold power button 15–20 seconds).\n2. **Power, No POST**: Fans spin / keyboard lights flicker, screen black, amber/white **diagnostic blink codes or beeps** -> look up vendor LED blink pattern (commonly **RAM** or **System Board**), test external monitor (`Win+P`) first to rule out dead laptop panel!\n3. **POST Passes, No OS Boot**: Vendor logo shows, then `No Bootable Device` or BitLocker recovery -> check UEFI boot order, unplug forgotten USB flash drives, or inspect NVMe SSD health (`CrystalDisk` / vendor diagnostics).',
        'Enterprise **USB-C / Thunderbolt Docks** cause massive Tier 1 ticket volume. Remember **Power Delivery (PD) watts**: plugging a 45W phone brick into a 130W workstation dock causes flickering monitors and random USB drops! Also check **DisplayPort Alt-Mode**—cheap charge-only USB-C cables carry zero video!',
        'For **Network Printers** showing `"Offline"` when 10 users scream before a deadline: verify physical LCD/paper first, `ping <printer-IP>`, confirm the Windows **Standard TCP/IP Port** matches the printer’s static/reserved IP (never WSD dynamic ports if possible!), and clear hung jobs by restarting the Windows **Print Spooler (`spooler`)** service!',
      ],
    },

    deepDive: {
      intro:
        'Walk step-by-step through boot isolation, USB-C dock checks, and network printer spooler recovery.',
      steps: [
        {
          step: 'Boot Stage',
          title: 'Isolating No Power vs No POST vs No Boot',
          explanation:
            'Always strip external docks and USB drives first! Verify LED blink codes (e.g., `2 amber, 4 white` = RAM fault on Dell; beep codes on desktops) against official vendor documentation before swapping hardware.',
        },
        {
          step: 'Storage/Heat',
          title: 'Thermal Throttling, Fan Noise & SSD Warning Signs',
          explanation:
            'Sudden random shutdowns under Zoom calls + roaring fans = blocked dust vents or dried thermal paste. Sluggish performance + 99% full `C:` drive + SMART errors = imminent NVMe failure—back up user data to OneDrive immediately!',
        },
        {
          step: 'USB-C Docks',
          title: 'USB-C / Thunderbolt Dock Verification',
          explanation:
            '1) Verify genuine OEM power brick plugged into dock (90W–130W+).\n2) Confirm cable is full-featured USB-C DP Alt-Mode / Thunderbolt (not a cheap phone charging cord).\n3) Update **Dock Firmware + DisplayLink/Thunderbolt drivers** via vendor updater.',
        },
        {
          step: 'Printers & Mobile',
          title: 'Network Printers & Mobile Device Hardware',
          explanation:
            'Clear stuck print queues by stopping **Print Spooler**, emptying `C:\\Windows\\System32\\spool\\PRINTERS`, and restarting Spooler. Replace flaky Windows **WSD** auto-ports with static **Standard TCP/IP Port** (`RAW 9100`). For phones/tablets: check battery swelling (safety hazard—stop charging immediately!), cracked digitizers, and Lightning/USB-C lint buildup.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Workstation Boot & Peripheral Fault Isolation Decision Tree',
        asciiFallback: `[Press Power Button]
  |-- Zero LEDs / No Fan? --------> [NO POWER]   -> Bypass Dock, check Wall/Brick, 15s Flea-Power Drain
  |-- Fans Spin + Blink Codes? ---> [NO POST]    -> Check Vendor Blink/Beep Table (RAM/Board) + Ext Monitor
  |-- Logo -> "No Boot Device"? --> [NO BOOT]    -> Unplug USB sticks, check UEFI NVMe detection & SMART
  |-- Boots Fine, Dock Dead? -----> [DOCK FAULT] -> Check 90W+ PD brick, DP Alt-Mode cable, Dock Firmware`,
      },
      workedExample: {
        title: 'Worked Ticket: Warehouse Printer Stuck "Offline" With 19 Queued Labels',
        context:
          'Shipping staff report `SHIP-PRN-02` shows "Offline" in Windows, blocking parcel labels.',
        steps: [
          'Check physical printer panel: powered on, solid green Ready LED, paper loaded, IP on screen reads `10.20.4.55`.',
          'From workstation CMD: `ping 10.20.4.55` replies in `< 2ms`—so network cabling and printer NIC are 100% online!',
          'Inspect Windows Printer Properties -> Ports: port was auto-created as a flaky **WSD Port** (`WSD-9f2a...`) after a router reboot!',
          'Fix cleanly: switch port to **Standard TCP/IP Port (`10.20.4.55`)**, uncheck SNMP Status Enabled if printer blocks SNMPv1, restart **Print Spooler**, and verify test label prints immediately.',
        ],
        outcome:
          'Queue flushes 19 labels in 5 seconds and WSD disconnects never recur.',
      },
    },

    supportWalkthrough: {
      intro:
        'Apply these physical-layer checks before ordering replacement laptops or dispatching field techs.',
      steps: [
        {
          phase: '1. Strip External Docks',
          action: 'Unplug USB-C docks, dongles, and flash drives immediately when debugging boot or display faults.',
          whyItWorks: 'Faulty docks and bootable USB sticks cause over 40% of apparent "dead laptop" tickets.',
        },
        {
          phase: '2. Read Physical Clues',
          action: 'Count LED blink sequences, listen for beeps, feel chassis heat, and test a direct AC charger + external HDMI monitor.',
          whyItWorks: 'Separates screen backlight faults, RAM unseating, and motherboard failure in under 2 minutes.',
        },
        {
          phase: '3. Log Asset & Serial Cleanly',
          action: 'Record Service Tag / Serial Number, exact blink code, and tests passed inside Internal Notes before hardware warranty escalation.',
          whyItWorks: 'Depot/warranty teams reject dispatches lacking diagnostic proof and serial tags.',
        },
      ],
      questionsToAsk: [
        '"When you press the power button, do you see any keyboard backlight, fan spin, or blinking white/amber LEDs near the charger port?"',
        '"Is your charger plugged directly into the laptop, or going through a desk docking station?"',
        '"If you plug an HDMI cable directly into the laptop, does anything appear on the monitor?"',
      ],
      sampleUserWording: [
        {
          situation: 'Guiding a remote user through a quick flea-power drain safely',
          sayThis:
            '"Let’s unplug the dock and power cord completely for a moment, then press and hold the power button down firmly for 15 full seconds to clear any stuck static charge—then plug ONLY the main wall charger back in and tap power once."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Hardware -> Laptop Docking & Display',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High (User unable to view screens) = P2/P3',
        internalNotes: `[SYMPTOM] Dual monitors black via USB-C dock on MKT-LT-41.
[DEVICE] Asset MKT-LT-41 (SN: 8X92K1), Dock: Dell WD19TB.
[CHECKS] User plugged 45W phone charger into dock; laptop showed slow-charge warning and dropped DP Alt-Mode video. Swapped to 130W OEM brick, reseated Thunderbolt cord, updated dock firmware.
[RESULT] Both 1080p monitors + Gigabit dock NIC restored cleanly.`,
        customerReply:
          'Hi Maya — Both desk monitors are back online! The docking station needs the larger 130W power brick to drive dual screens and charge your laptop simultaneously (the smaller travel cord didn’t supply enough power for video). Everything is updated and verified—enjoy your afternoon!',
        escalationCriteria:
          'Escalate to Tier 2 / Vendor Warranty if laptop displays amber/white RAM or system-board POST blink codes even directly on AC power with dock removed.',
      },
    },

    commonTraps: [
      {
        trap: 'Ordering a warranty motherboard replacement before unplugging the USB-C dock and trying a direct OEM AC brick.',
        reality: 'Under-wattage docks and hung Thunderbolt controllers masquerade as dead laptops daily.',
      },
      {
        trap: 'Swapping Windows Print Spooler restarts blindly when the physical printer itself has an error (`Paper Jam` / `Offline` / wrong IP).',
        reality: 'Check physical readiness and `ping <printer-IP>` FIRST—if WSD broke, switch to a Standard TCP/IP Port (`9100`).',
      },
      {
        trap: 'Ignoring a **swollen laptop battery** pushing up the trackpad.',
        reality: 'A swollen Li-ion battery is an acute **fire/rupture hazard**—stop charging, power off immediately, do NOT puncture, and handle per hardware safety policy.',
      },
    ],

    keyTerms: [
      {
        term: 'POST (Power-On Self-Test)',
        shortDef: 'UEFI/BIOS hardware pre-check of CPU, RAM, and display before booting any operating system.',
        fullDef: 'Failures emit audible beep patterns or chassis LED blink codes identifying the failing component.',
      },
      {
        term: 'USB-C Power Delivery (PD) & DP Alt-Mode',
        shortDef: 'USB-C standards carrying high-wattage laptop power (65–130W+) and video signals over one cable.',
        fullDef: 'Charge-only phone cords lack DP Alt-Mode video lanes and wattage needed for enterprise docks.',
      },
      {
        term: 'Windows Print Spooler (`spooler`)',
        shortDef: 'OS background service queuing print jobs cleanly before sending to local or TCP/IP network printers.',
        fullDef: 'Clearing stuck files in `System32\\spool\\PRINTERS` and restarting `spooler` fixes hung queues fast.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-211-q1',
        prompt: 'A user presses Power on their laptop: the fans spin up, the capslock/charging LED blinks **2 amber, 4 white**, and the screen stays completely black. Which boot stage failed?',
        options: ['No POST (Hardware initialization fault, e.g., RAM/board)', 'No Power (Dead wall outlet)', 'Corrupted Windows User Profile', 'Wrong Print Spooler driver'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Fans spinning + diagnostic LED blink codes + black screen means power exists, yet **POST** failed before loading the OS.',
          'Incorrect: No Power exhibits zero fans and zero LEDs.',
          'Incorrect: User profiles load *after* Windows finishes booting past POST.',
          'Incorrect: Print drivers load inside the running OS.',
        ],
        takeaway: 'Zero fans/LEDs = **No Power**; fans + blink/beep codes = **No POST**; logo -> error = **No OS Boot**.',
      },
      {
        id: 'itsup-211-q2',
        prompt: 'After moving desks, a user’s two desk monitors and wired Ethernet drop randomly through their USB-C dock, and Windows warns "Slow charger." What is the most likely Layer-1 cause?',
        options: [
          'An under-wattage travel charger or charge-only USB-C cable was plugged in instead of the dock’s high-wattage PD power brick and full-featured cable.',
          'Active Directory locked the user’s monitors.',
          'The NVMe SSD is 20% used.',
          'SNMP traps were disabled.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Enterprise docks require full 90W–130W+ Power Delivery bricks and DP Alt-Mode/Thunderbolt cables to sustain dual displays + peripherals.',
          'Incorrect: Active Directory does not power off desk monitors.',
          'Incorrect: 20% SSD utilization is completely healthy.',
          'Incorrect: SNMP does not drive local USB-C display lanes.',
        ],
        takeaway: 'Check genuine OEM PD wattage and DP Alt-Mode cables first on USB-C dock tickets.',
      },
      {
        id: 'itsup-211-q3',
        prompt: 'A shared warehouse printer shows `"Offline"` in Windows, yet its physical screen says `Ready` and `ping 10.20.4.55` answers in `1 ms`. What common port configuration change fixes flaky Windows auto-discovery disconnects permanently?',
        options: [
          'Switch the printer from a dynamic **WSD Port** to a **Standard TCP/IP Port** pointing directly to `10.20.4.55`',
          'Format the workstation’s NVMe drive',
          'Disable Ethernet on the printer',
          'Unplug the laptop’s RAM',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Windows **WSD** auto-discovery ports frequently lose track of printers after IP/router refreshes; pinning a **Standard TCP/IP Port** stabilizes printing.',
          'Incorrect: Destructive and completely unnecessary.',
          'Incorrect: Disconnecting the printer breaks printing for everyone.',
          'Incorrect: RAM has nothing to do with network print ports.',
        ],
        takeaway: 'When a network printer pings cleanly yet shows `"Offline"`, check for flaky WSD ports and hung Print Spooler queues.',
      },
      {
        id: 'itsup-211-q4',
        prompt: 'A user brings in an older laptop whose bottom case is bulging upward and pushing the trackpad out of its frame. What should you do IMMEDIATELY?',
        options: [
          'Stop charging immediately, power down cleanly, treat the swollen lithium battery as a fire/safety hazard per company e-waste policy, and migrate user data safely.',
          'Press hard on the trackpad to snap the swollen battery flat again.',
          'Leave it plugged into a fast 130W charger overnight.',
          'Puncture the bulge with a SIM tool to release pressure.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Never compress, puncture, or keep charging a swollen lithium-ion battery—thermal runaway fires happen fast.',
          'Incorrect: Mechanical pressure risks rupturing battery cells.',
          'Incorrect: Continued charging increases heat and fire risk.',
          'Incorrect: Puncturing lithium cells triggers immediate fire/toxic venting.',
        ],
        takeaway: 'Swollen batteries = unplug immediately, never squeeze/puncture, isolate safely.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Diagnose Hardware, Printer & Dock Incidents',
      targetTab: 'simulator',
      instructions: [
        'Run Beginner/Intermediate hardware & printer incidents in Simulator to practice checking physical power, ping/spooler status, and recording serial tags cleanly.',
        'Verify your ticket notes specify exact diagnostic LED/ping results before escalating warranty swaps.',
      ],
      verificationCheck: 'Separates No Power, No POST, No Boot, USB-C PD faults, and WSD printer issues cleanly.',
    },

    summaryBullets: [
      'Divide boot problems cleanly: **No Power** (outlet/brick/flea-drain), **No POST** (fans + blink/beep codes -> RAM/board), **No Boot** (UEFI/USB/NVMe).',
      '**RAM** holds active workspace memory cleanly; **NVMe/SSD** stores OS and files permanently (watch 95%+ full drives and SMART warnings!).',
      'USB-C / Thunderbolt docks depend on genuine high-wattage **Power Delivery (90–130W)** bricks, **DP Alt-Mode** cords, and updated firmware.',
      'For `"Offline"` network printers that ping cleanly, clear **Print Spooler** (`spooler`) and replace flaky **WSD** ports with **Standard TCP/IP Ports**.',
      'Always handle **swollen batteries** as urgent safety hazards—unplug immediately, never puncture or squeeze.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 1 (220-1101) Domain 3.0 Hardware & Printing Troubleshooting',
      'Microsoft Learn — Troubleshoot Known Issues for Printing & WSD Ports',
    ],
  },

  'itsup.core.os.windows-cli-logs': {
    id: 'itsup.core.os.windows-cli-logs',
    moduleId: 'it-support',
    unitTitle: 'Unit 3: Operating Systems',
    topicTitle: '3.1 OS Diagnostics, Permissions & Support CLI',
    code: '3.1.1',
    title: 'Event Viewer, Services, Task Manager, NTFS Share vs Security Permissions & PowerShell Basics',
    readMinutes: 14,
    prerequisites: ['2.1.1 Hardware Triage'],
    versionScope: 'shared',

    learningObjectives: [
      'Use **Task Manager / Activity Monitor / `top`**, **Services (`services.msc`)**, and **Device Manager** cleanly to diagnose sluggish PCs and crashed background daemons.',
      'Navigate **Windows Event Viewer** (`Application`, `System`, `Security`) and locate exact faulting module / time-correlated Errors instead of guessing blindly.',
      'Solve the classic **NTFS vs SMB Share Permissions** rule (*Effective Access = Most Restrictive Intersection* + *Explicit Deny ALWAYS wins*).',
      'Run essential **Windows CMD / PowerShell** (`sfc /scannow`, `Get-Process`, `Get-Service`, `gpresult /r`, `whoami /groups`) and recognize macOS/Linux equivalents (`chmod`, `ls -l`, `ps`, `sudo`).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Your PC Is Just Slow, Let’s Reimage It" — When One Hung Service Took 10 Seconds to Fix',
      narrative:
        'A tired analyst sees an Excel crash or sluggish laptop and recommends wiping Windows cleanly (costing an engineer 5 hours of lost setup!). A skilled Tier 1 analyst opens **Task Manager**, spots Windows Search indexer or a runaway browser tab pinning Disk/CPU at 100%, inspects **Event Viewer -> Application** to see the exact crashing `.dll` add-in, or checks **`whoami /groups`** when someone complains *"IT gave me Read-Write on Share, why does Windows still say Access Denied?!"* (Hint: SMB Share Permission was left at `Read`!).',
    },

    plainEnglish: {
      analogyTitle: 'Think of Task Manager as the Car Dashboard, Services as Under-Hood Pumps, and Event Viewer as the Black Box',
      analogy:
        'When a car sputters, you don’t throw the engine away! **Task Manager** shows your RPMs right now (CPU, Memory, Disk, Startup impact). **Services (`services.msc`)** are silent background fuel/water pumps (Print Spooler, Windows Audio, VPN Agent) that sometimes stall and just need a Restart. **Event Viewer** is the airplane Black Box recording every warning and crash with timestamps. And **Share vs NTFS Permissions** works like **two locked security doors in a row**: even if Door 2 (NTFS) says `Modify`, if Door 1 (Network Share) only gives you `Read`, you can only read across the network!',
      technicalDefinition:
        'Endpoint OS administration pairs live telemetry (**Task Manager** / `Get-Process` / `ps`), service control (**Services.msc** / `Restart-Service` / `systemctl`), diagnostic logging (**Event Viewer** System/Application/Security logs), file integrity repair (**DISM** & `sfc /scannow`), and **ACL permissions** where network folder effective access equals the **most restrictive intersection** of SMB Share permissions and underlying **NTFS Security** permissions (and explicit `Deny` overrides `Allow`).',
      paragraphs: [
        'Master the **Two-Door Network Folder Rule** (favorite help desk interview question!):\n• **SMB Share Permissions**: Apply ONLY when accessing the folder **over the network** (`\\\\srv\\Sales`). If Share says `Everyone = Read` and NTFS says `Alice = Full Control`, over the network Alice gets **`Read`** (most restrictive!). Best practice: set Share to `Authenticated Users = Change` (or `Full Control`) and enforce fine-grained access on **NTFS Security**!\n• **Local Sign-In**: Share permissions are bypassed locally—only **NTFS Security** applies.\n• **Explicit `Deny` Rule**: An explicit `Deny` ACE overrides every `Allow` membership.',
        'Keep the **3 Core Windows Health Commands** ready in an elevated Admin terminal:\n1. `sfc /scannow` — scans & repairs corrupted Windows protected system files.\n2. `DISM /Online /Cleanup-Image /RestoreHealth` — repairs the Windows component store before running `sfc` if `sfc` fails.\n3. `chkdsk C: /f` — checks NTFS filesystem metadata integrity on next reboot.',
        'Don’t ignore **macOS & Linux** basics when supporting designers/developers:\n• macOS Activity Monitor (`Cmd+Space` -> Activity Monitor), Console.app logs, Finder `Cmd+Shift+G` Go to Folder, `ls -la`, `chmod 755`, `sudo`.\n• Linux `systemctl status <svc>`, `journalctl -xe`, `df -h` (disk full!), `free -m`, `chmod`/`chown`.',
      ],
    },

    deepDive: {
      intro:
        'Practice correlating Task Manager bottlenecks, Event Viewer crash IDs, and NTFS/Share intersection math.',
      steps: [
        {
          step: 'Triage 1',
          title: 'Task Manager: CPU vs RAM vs 100% Disk vs Uptime Trap',
          explanation:
            'Check **Performance -> CPU -> Up time** FIRST! Windows **Fast Startup** preserves kernel state across normal "Shut Down" clicks—many users say *"I turned it off every night!"* while Uptime reads **`42:11:05:18` (42 days!)**. Click **Restart** to perform a clean kernel reboot!',
        },
        {
          step: 'Triage 2',
          title: 'Event Viewer (`eventvwr.msc`) Correlation',
          explanation:
            'Match the exact minute the app froze inside **Windows Logs -> Application** (`Event 1000` Application Error showing exact Faulting Module e.g. `adobe_addin.dll`!) or **System** (`Event 41` Kernel-Power unexpected crash, `Disk` bad block warnings).',
        },
        {
          step: 'Triage 3',
          title: 'Services & Device Manager (`services.msc` / `devmgmt.msc`)',
          explanation:
            'Restart stalled daemons (`Print Spooler`, `Windows Audio`, VPN service) or inspect **Device Manager** yellow triangles (missing driver, Code 43 GPU crash, disabled webcam/Wi-Fi).',
        },
        {
          step: 'Triage 4',
          title: 'Share + NTFS Permission Intersection & PowerShell',
          explanation:
            'Compute User’s combined **NTFS** group allows (additive union across groups, minus any explicit `Deny`), compute **Share** allows, and take the **minimum (most restrictive)** of the two over the network! Inspect user group tokens live via `whoami /groups` (remember: new AD group memberships require **sign out + sign back in** to refresh the Kerberos TGT token!).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Two-Door Permission Model: Network Share + NTFS Security Intersection',
        asciiFallback: `[User Over Network \\\\filesrv\\Finance]
   |
   +--> [Door 1: SMB Share Permission = Read]   \
                                                 +--> EFFECTIVE ACCESS = MOST RESTRICTIVE (Read Only!)
   +--> [Door 2: NTFS Security      = Modify]   /

* Exception: Explicit DENY anywhere ALWAYS wins over ALLOW!
* Tip: Local login at keyboard skips Door 1 (uses NTFS only).`,
      },
      workedExample: {
        title: 'Worked Ticket: New Analyst Added to `MKT_Edit` Still Gets "Access Denied"',
        context:
          'SysAdmin added Maya to Active Directory group `MKT_Edit` (which has NTFS `Modify` on `\\\\srv01\\Marketing`). Maya still gets Access Denied saving files!',
        steps: [
          'Check Step A (Token Refresh): Run `whoami /groups` in Maya’s CMD -> `MKT_Edit` is MISSING! Why? Maya never signed out/locked+reauthenticated after the group was added, so her session holds a stale Kerberos token! Wait—what if `MKT_Edit` IS present?',
          'Check Step B (Two-Door Check): Inspect `\\\\srv01\\Marketing` **Share Permissions** -> Share says `Everyone = Read` only! Even though NTFS grants `Modify`, `Min(Share Read, NTFS Modify) = Read Only`!',
          'Update Share Permission to `Authenticated Users = Change` (keeping granular security on NTFS) and have Maya sign out/in.',
        ],
        outcome:
          'Maya saves files cleanly immediately and understands why group changes require a fresh logon token.',
      },
    },

    supportWalkthrough: {
      intro:
        'Keep these Windows / PowerShell / macOS commands beside every OS workstation call.',
      steps: [
        {
          phase: '1. Check Real Uptime',
          action: 'Open Task Manager -> Performance -> CPU -> Up time (`Restart` clears kernel hangs that `Shut Down` + Fast Startup leaves behind!).',
          whyItWorks: 'Resolves dozens of flaky audio, dock, driver, and update-pending hangs immediately.',
        },
        {
          phase: '2. Read Event Viewer Timestamp',
          action: 'Filter `Application` and `System` logs to Critical/Error around the exact failure time.',
          whyItWorks: 'Reveals exact crashing add-in DLLs (`Event 1000`) or failing disks instead of blind guessing.',
        },
        {
          phase: '3. Check Permissions & Token',
          action: 'Run `whoami /groups`, inspect both **Sharing** and **Security** tabs, and verify disk space (`df -h` / `Get-PSDrive`).',
          whyItWorks: 'Catches missing group token refreshes, Share-vs-NTFS bottlenecks, and zero-bytes-free errors in 60 seconds.',
        },
      ],
      questionsToAsk: [
        '"When did you last use **Restart** rather than Shut Down—could we glance at Task Manager uptime quickly?"',
        '"Did that app crash leave a popup module name, or happen right after a new add-in or Windows Update?"',
        '"Have you signed out and back in since IT added your new department folder permissions?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining why Windows Restart fixes what Shut Down didn’t',
          sayThis:
            '"Windows uses a feature called Fast Startup where normal Shut Down actually saves a snapshot rather than fully resetting drivers. Doing a quick **Restart** gives your system a completely fresh start—let’s run one now and re-test."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Operating Systems & Permissions -> Shared Folder Access',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium (Blocked editing folder) = P3 Normal',
        internalNotes: `[SYMPTOM] Access Denied saving files in \\\\srv01\\Marketing on MKT-PC-22.
[CHECKS] whoami /groups confirmed MKT_Edit missing from active session token + Share tab capped Everyone=Read.
[ACTION] User signed out/in to refresh Kerberos token; verified Share=Change + NTFS MKT_Edit=Modify. Confirmed user saved test doc cleanly.`,
        customerReply:
          'Hi Maya — Your folder edit permissions are working now! Your session needed a quick sign-out refresh to pick up your new group membership, plus we updated a folder network permission rule. Give saving your presentation another try and reach back out anytime!',
        escalationCriteria:
          'Escalate to Tier 2 Server Admin if `MKT_Edit` shows cleanly in `whoami /groups`, both Share + NTFS grant `Modify`, yet explicit Access Denied persists (possible DFSR/storage lock or ACL corruption).',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming pressing **Shut Down** fully resets Windows drivers and kernel memory.',
        reality: 'Windows **Fast Startup** hibernates kernel state on Shut Down—always click **Restart** during troubleshooting!',
      },
      {
        trap: 'Checking ONLY the **Security (NTFS)** tab on a network share and ignoring the **Sharing** tab.',
        reality: 'Network access enforces the **most restrictive intersection** of Share AND NTFS permissions.',
      },
      {
        trap: 'Running `sfc /scannow` without **Administrator** elevation, or skipping `DISM /RestoreHealth` when `sfc` reports unfixable corruption.',
        reality: 'Run Command Prompt / PowerShell **as Administrator** (`DISM` -> `sfc /scannow`).',
      },
    ],

    keyTerms: [
      {
        term: 'Effective Access (Share vs NTFS)',
        shortDef: 'Network folder permission equals the most restrictive combination of Share and NTFS; Explicit Deny wins.',
        fullDef: 'Local logins apply NTFS only; network UNC paths (`\\\\srv\\share`) enforce both layers.',
      },
      {
        term: 'Windows Event Viewer',
        shortDef: 'Central OS log viewer (`eventvwr.msc`) separating Application, System, and Security events.',
        fullDef: 'Correlates exact app crashes (`1000`), power/disk faults (`41`), and account lockouts (`4740`).',
      },
      {
        term: 'SFC & DISM',
        shortDef: '`sfc /scannow` repairs protected Windows OS files; `DISM` repairs the underlying image store.',
        fullDef: 'Essential elevated CLI tools avoiding unnecessary full OS wipes.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-311-q1',
        prompt: 'A user accesses `\\\\filesrv01\\Projects` over the corporate network. The **SMB Share** permission gives `Sales = Read`, while the **NTFS Security** tab gives `Sales = Full Control`. What effective access does a Sales user have over the network?',
        options: ['Read only', 'Full Control', 'Modify', 'Write only'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Over the network, effective access is the **most restrictive intersection** of Share (`Read`) and NTFS (`Full Control`) = **Read**.',
          'Incorrect: Full Control would only apply if logged in locally at the server console (bypassing SMB Share).',
          'Incorrect: Still limited by Share `Read`.',
          'Incorrect: Read only.',
        ],
        takeaway: 'Over the network: `Min(Share Permission, NTFS Security)` wins (and Explicit `Deny` always overrides `Allow`).',
      },
      {
        id: 'itsup-311-q2',
        prompt: 'An employee insists *"I shut down my Windows laptop every night!"* yet Task Manager -> Performance -> CPU displays **Up time: 28:04:12:09** (28 days!). Why didn’t Shut Down reset kernel state, and what should they click?',
        options: [
          'Windows **Fast Startup** hibernates kernel state during Shut Down; click **Restart** for a true clean kernel/driver boot.',
          'The CPU clock is permanently broken.',
          'They must uninstall Excel.',
          'Only unplugging the monitor resets Windows uptime.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Restart** bypasses Fast Startup hibernation and performs a clean kernel/driver reinitialization.',
          'Incorrect: Task Manager accurately counts time since the last true kernel boot.',
          'Incorrect: Excel does not hold OS uptime across restarts.',
          'Incorrect: Monitor power has zero effect on OS uptime.',
        ],
        takeaway: 'Always use **Restart** (not Shut Down) to reset Windows kernel/drivers cleanly.',
      },
      {
        id: 'itsup-311-q3',
        prompt: 'You add a user to an Active Directory security group granting folder access, yet they still receive Access Denied—and `whoami /groups` on their PC does not list the new group yet. What immediate step refreshes their token?',
        options: [
          'Have the user **Sign out and Sign back in** (or reboot) to obtain a fresh Kerberos security token',
          'Run `sfc /scannow`',
          'Restart Print Spooler',
          'Swap their USB-C dock cable',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Windows builds a user’s group SID token at logon; new AD group memberships take effect after signing out and signing back in.',
          'Incorrect: `sfc` repairs OS system files, not Kerberos logon tokens.',
          'Incorrect: Print Spooler handles printing only.',
          'Incorrect: Dock cables don’t control AD group tokens.',
        ],
        takeaway: 'New AD/Entra group permissions normally require **sign out -> sign in** to refresh session tokens.',
      },
      {
        id: 'itsup-311-q4',
        prompt: 'Which built-in Windows administrative tool lets you examine timestamped Application crash module errors (`Event ID 1000`) and unexpected Kernel-Power reboots (`Event ID 41`)?',
        options: ['Event Viewer (`eventvwr.msc`)', 'Disk Cleanup', 'Device Manager', 'Credential Manager'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Event Viewer** stores `Application`, `System`, and `Security` OS/app logs with event IDs and stack clues.',
          'Incorrect: Disk Cleanup removes temporary files.',
          'Incorrect: Device Manager inspects hardware drivers.',
          'Incorrect: Credential Manager stores cached logins.',
        ],
        takeaway: 'Check **Event Viewer** (`Application` + `System`) with exact failure timestamps before guessing.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Run OS Logs & Permissions Triage in Simulator',
      targetTab: 'simulator',
      instructions: [
        'Run an OS/Permissions ticket in Simulator (`INC-1002` / `INC-3005` or similar) to inspect Service status, Event logs, and Share/NTFS clues.',
        'Record `whoami /groups` and exact Event ID evidence in Internal Notes.',
      ],
      verificationCheck: 'Diagnoses hung services, Fast Startup uptime traps, Event Viewer crashes, and Share/NTFS conflicts cleanly.',
    },

    summaryBullets: [
      'Use **Task Manager** (`Up time` check + **Restart** beats Fast Startup Shut Down!) and **Services** (`services.msc`) before wiping OS installs.',
      'Correlate exact crash timestamps inside **Event Viewer** (`Application` / `System` / `Security`).',
      'Over a network share, **Effective Access = Most Restrictive Intersection** of **Share Permissions** and **NTFS Security** (`Explicit Deny` always wins!).',
      'Run `whoami /groups` to check group tokens (sign out/in refreshes new AD groups) and elevated `DISM` -> `sfc /scannow` for OS file repair.',
      'Know cross-platform basics: macOS Activity Monitor / `Cmd+Shift+G`, Linux `systemctl`, `journalctl`, `df -h`, and `chmod`.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Share and NTFS Permissions Overview',
      'Microsoft Learn — Use the System File Checker Tool (`SFC.exe`) and `DISM`',
    ],
  },
};
