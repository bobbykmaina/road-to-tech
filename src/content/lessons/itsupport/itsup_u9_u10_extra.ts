import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_U9_U10_EXTRA_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.9.3.1': {
    id: 'itsup.9.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.3 Practice Tool Terminology Switch & Cross-Platform Field Mapping',
    code: '9.3.1',
    title: 'Using the Practice Tool’s Terminology Switch & Translating Live Queues, Public Replies and Internal Notes',
    readMinutes: 10,
    prerequisites: ['itsup.core.tools.landscape', 'itsup.core.tools.translation'],
    versionScope: 'shared',

    learningObjectives: [
      'Switch live terminology inside the Service Desk Simulator across Vendor-Neutral, Jira (JSM), ServiceNow, Zendesk, and Freshservice profiles.',
      'Identify the exact public-versus-internal comment label in each major ITSM tool so sensitive investigation notes never leak to end users.',
      'Map queue/view names, request types/catalog items, and state models seamlessly during interviews or first-week onboarding.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Your Resume Mentions ServiceNow—Here We Run Jira Service Management & Zendesk!"',
      narrative:
        'A hiring manager tests whether your ticketing habits depend on memorizing one button color or on transferable service desk concepts. Posting a root-cause escalation draft into **Additional Comments** (ServiceNow) or **Public Reply** (Zendesk/JSM) exposes private infrastructure notes directly to the customer—so knowing each tool’s exact label keeps both workflows and privacy safe.',
    },

    plainEnglish: {
      analogyTitle: 'Same Car Controls, Different Dashboard Badges',
      analogy:
        'Rental cars put the windshield wipers on a slightly different stalk, yet steering, braking, and turn signals never change. Every help desk platform still routes a **record** inside a **queue/view** through **workflow states** with separate **public replies** and **private work notes**.',
      technicalDefinition:
        'Cross-platform ITSM literacy maps universal service desk primitives—record identity, queue filtering, SLA clock triggers, and public/private audience separation—onto vendor-specific UI labels.',
      paragraphs: [
        'In the **Service Desk Simulator**, use the **Terminology Toggle** bar after each platform tour. Watch **Ticket** morph into **Issue** (Jira), **Incident** (ServiceNow), or **Ticket** (Zendesk/Freshservice), while **Ticket Queue** shifts to **JSM Queue**, **Assignment Queue**, **Agent View**, or **Ticket View**.',
        'Always verify the comment audience toggle before clicking submit: in **ServiceNow**, **Additional comments** email the Caller while **Work notes** remain internal; in **JSM**, **Reply to customer** is public vs **Internal note**; in **Zendesk** and **Freshservice**, **Public reply** vs **Internal/Private note** guards internal triage notes.',
      ],
    },

    deepDive: {
      intro: 'Cross-reference every major platform against the Simulator terminology switcher.',
      steps: [
        {
          step: '01',
          title: 'Public Reply vs Internal Note Safety Check',
          explanation:
            'Before pasting Active Directory lockouts, BitLocker verification status, or Tier 2 suspicions, check the field header and background color (yellow/amber work notes in ServiceNow/JSM/Zendesk indicate private visibility).',
        },
        {
          step: '02',
          title: 'Rework One Ticket Across 3 Profiles',
          explanation:
            'Open a ticket in the Simulator under **Generic**, switch to **ServiceNow**, verify Caller/Work Notes/Incident State, then switch to **Jira (JSM)** to match Reporter/Request Type/Internal Note.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Universal Comment & Queue Translation',
        asciiFallback: `Concept          | Jira (JSM)       | ServiceNow          | Zendesk         | Freshservice
-----------------+------------------+---------------------+-----------------+----------------
Record           | Issue / Request  | Incident / Request  | Ticket          | Ticket
Work List        | Queue            | List / Filter       | View            | Ticket View
Customer Visible | Reply to cust.   | Additional comments | Public reply    | Reply
Team-Only Note   | Internal note    | Work notes          | Internal note   | Private note`,
      },
      workedExample: {
        title: 'Translating an AD Lockout Investigation Note Safely',
        context: 'You traced a user lockout to a saved password on an old tablet.',
        steps: [
          'Record the technical Event 4740 Caller Computer Name inside Work Notes / Internal Note.',
          'Send a friendly Additional Comment / Public Reply asking the user to update the tablet Wi-Fi or email password.',
        ],
        outcome: 'Customer receives clean instructions without confusing server logs.',
      },
    },

    supportWalkthrough: {
      intro: 'Use terminology translation during tool transitions and interviews.',
      steps: [
        {
          phase: 'Check Visibility Toggle',
          action: 'Read the reply tab label twice before typing sensitive diagnostics or vendor blame.',
          whyItWorks: 'Prevents accidental exposure of internal escalation chatter.',
        },
      ],
      questionsToAsk: ['"Which ticketing platform does your desk use, and how do agents flag internal work notes vs user replies?"'],
      sampleUserWording: [
        {
          situation: 'Explaining cross-tool experience in an interview',
          sayThis:
            '"I practiced on Jira Service Management and ServiceNow-style queues using a terminology switcher—so whether your team calls them Views, Queues, Additional Comments, or Work Notes, the triage lifecycle is identical."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Service Desk Operations -> Tool Workflow',
        priorityFormula: 'Impact: Low × Urgency: Low = P4 Standard Practice',
        internalNotes: 'Verified queue filters, SLA pause state transitions, and Internal/Work Note field separation across JSM, ServiceNow, Zendesk & Freshservice profiles.',
        customerReply: 'We updated your request status and logged full next steps in your ticket timeline.',
        escalationCriteria: 'Verify permissions with ITSM Admin if a custom workflow transition or private note visibility breaks.',
      },
    },

    commonTraps: [
      {
        trap: 'Writing "User didn’t reboot for 34 days again!" inside ServiceNow Additional Comments.',
        reality: 'Additional Comments notify the Caller directly—use Work Notes for internal observations and empathetic wording for public replies.',
      },
      {
        trap: 'Assuming changing ticketing software means re-learning help desk work from zero.',
        reality: 'Only UI labels change (Issue vs Incident, Queue vs View, Internal note vs Work notes); triage workflow, SLA pause discipline, and clear notes stay identical.',
      },
    ],

    keyTerms: [
      {
        term: 'Work Notes vs Additional Comments',
        shortDef: 'ServiceNow labels: `Work notes` stay team-internal; `Additional comments` notify the requester.',
        fullDef: 'Equivalent to Internal Note vs Reply to Customer in JSM, Zendesk, and Freshservice.',
      },
      {
        term: 'Queue / View / Assignment Filter',
        shortDef: 'Filtered live lists sorting tickets by team ownership, priority, and SLA breach urgency.',
        fullDef: 'Called Queues in JSM, Assignment Groups/Lists in ServiceNow, Views in Zendesk, and Ticket Views in Freshservice.',
      },
      {
        term: 'Public vs Internal Audience Toggle',
        shortDef: 'UI control deciding whether a saved comment emails the user or stays visible strictly to IT agents.',
        fullDef: 'Check the header and amber/yellow background highlight before posting escalation drafts or technical logs.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-931-q1',
        prompt: 'In ServiceNow, which comment box is visible ONLY to internal IT staff and hidden from the caller?',
        options: ['Work notes', 'Additional comments', 'Caller banner', 'Catalog description'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Work notes are strictly internal; Additional comments go to the customer.',
          'Incorrect: Additional comments are customer-facing.',
          'Incorrect: Not a comment box.',
          'Incorrect: Static catalog text.',
        ],
        takeaway: 'ServiceNow: Work notes = private; Additional comments = public.',
      },
      {
        id: 'itsup-931-q2',
        prompt: 'You switch from a Freshservice desk to a Jira Service Management (JSM) desk and need to leave an internal Tier 2 handoff with AD Event ID 4740 details. Which tab should you select?',
        options: ['Internal note', 'Reply to customer', 'Reporter email banner', 'Portal announcement'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: JSM labels private agent-only comments as `Internal note` (equivalent to ServiceNow `Work notes` and Freshservice `Private note`).',
          'Incorrect: `Reply to customer` emails the end user immediately.',
          'Incorrect: Displays the requester identity rather than storing technical escalation notes.',
          'Incorrect: Public portal banners broadcast across all users.',
        ],
        takeaway: 'JSM Internal note = ServiceNow Work notes = Zendesk Internal note = Freshservice Private note.',
      },
      {
        id: 'itsup-931-q3',
        prompt: 'During an interview, you are asked "We use Zendesk, but your lab notes mention ServiceNow—won’t you be lost on Day 1?" What is the strongest answer?',
        options: [
          '"The UI labels shift—for instance Incident becomes Ticket and Work Notes become Internal Notes—but triage, SLA timers, and public vs private discipline transfer directly."',
          '"I will need six months of classroom training before answering a single ticket."',
          '"Ticket queues only exist in ServiceNow, so Zendesk works completely differently."',
          '"I would copy internal escalation notes into Public Reply so users can read them too."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Demonstrates cross-platform ITSM fluency and immediate Day 1 readiness.',
          'Incorrect: Signals inflexible memorization instead of conceptual understanding.',
          'Incorrect: Zendesk uses Views for the exact same filtered queue workflow.',
          'Incorrect: Leaking internal notes publicly breaches professionalism and security.',
        ],
        takeaway: 'Learn universal ITSM mechanics first, then map each platform’s labels cleanly.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Work One Ticket Across 4 Terminology Profiles',
      targetTab: 'simulator',
      instructions: [
        'Open the Service Desk Simulator and solve one ticket using Jira (JSM) labels.',
        'Switch the Terminology Toggle to ServiceNow, Zendesk, and Freshservice and identify each public reply vs internal note label.',
      ],
      verificationCheck: 'Can state public vs internal note labels cleanly for JSM, ServiceNow, Zendesk, and Freshservice.',
    },

    summaryBullets: [
      'Every ticketing tool shares the same core engine: record, queue/view, state workflow, SLA clock, and public/internal notes.',
      'Always verify Internal Note / Work Notes before saving private diagnostics or escalations.',
    ],

    sourcesToVerify: ['ServiceNow Work Notes & Additional Comments Docs', 'Atlassian Jira Service Management Documentation'],
  },

  'itsup.9.9.1': {
    id: 'itsup.9.9.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.9–9.10 Commercial & MSP Platform Cards + Mini Service Desk Portfolio Lab',
    code: '9.9.1',
    title: 'HaloITSM, TOPdesk, Zoho Desk, Enterprise & MSP RMM Platforms (Atera/NinjaOne/Datto), Starter Shared Mailboxes & Building a Mini Service Desk Lab',
    readMinutes: 13,
    prerequisites: ['itsup.9.3.1', 'itsup.core.tools.opensource'],
    versionScope: 'shared',

    learningObjectives: [
      'Compare broader commercial, European, enterprise, and MSP ticketing platforms (HaloITSM, TOPdesk, Zoho Desk, SolarWinds Service Desk, Ivanti, BMC Helix, Atera, NinjaOne, Datto) plus starter shared mailboxes.',
      'Recommend an appropriate ticketing platform for a 30-person team based on budget, process formality, RMM pairing, and asset needs.',
      'Execute the 9.10 Hands-On Mini Service Desk Lab to produce screenshots and write-ups for your IT portfolio.',
    ],

    whyThisMatters: {
      scenarioTitle: '"What Tool Should Our 30-Person Company Pick—and How Would You Learn Ours Quickly?"',
      narrative:
        'Outside the big four brands, MSPs frequently run **HaloITSM**, **NinjaOne**, **Atera**, or **Datto** paired with remote monitoring, European organizations love **TOPdesk**, Zoho shops pick **Zoho Desk**, and tiny teams start on a shared mailbox plus tracking list. Knowing how to evaluate tools—and prove you configured one in a portfolio lab—sets beginners apart immediately.',
    },

    plainEnglish: {
      analogyTitle: 'Choosing Between a Pickup Truck, a Van Fleet, and a Swiss Army Knife',
      analogy:
        'A 10-person shop does not need a 200-seat enterprise rig—they drown in configuration overhead. Meanwhile an MSP supporting 40 clients needs ticketing wired straight to automated endpoint patching and remote access.',
      technicalDefinition:
        'Platform selection balances team size, ITIL process maturity, asset/RMM integration, hosting model, and total licensing cost, while always verifying current vendor roadmaps.',
      paragraphs: [
        'Quick market cards: **HaloITSM** is flexible and beloved by MSPs; **TOPdesk** excels in European/public-sector service management; **Zoho Desk** fits teams already running Zoho Workspace/CRM; **SolarWinds Service Desk**, **Ivanti**, and **BMC Helix** serve larger enterprise estates.',
        'MSP-centric suites (**Atera**, **NinjaOne**, **Datto**) unify ticketing with RMM alerts and one-click unattended remote sessions. Very small startups often begin with a **shared mailbox + structured tracking list** until SLAs and volume justify dedicated ticketing.',
        'Always verify current vendor licensing and product mergers before recommending software, and apply your **9.10 Mini Service Desk Lab** blueprint in any free cloud trial to showcase real portal forms, SLAs, queues, automations, and KB articles.',
      ],
    },

    deepDive: {
      intro: 'Pair market comparison criteria with the 6-piece 9.10 Mini Service Desk Portfolio Lab.',
      steps: [
        {
          step: '01',
          title: '5-Factor Tool Recommendation Framework',
          explanation:
            'Evaluate: 1) Team headcount & external vs internal users; 2) Budget & per-agent licensing; 3) Needed integrations (AD/Entra, RMM, Slack/Teams); 4) ITIL formality (Change/Problem/CMDB needed?); 5) Admin maintenance capacity.',
        },
        {
          step: '02',
          title: '9.10 Mini Service Desk Lab Blueprint',
          explanation:
            'In one free trial (e.g., JSM/Freshservice/Zendesk) build: 1 portal form + 3 request types, 1 priority queue, 1 SLA goal with Pending pause, 1 auto-assignment rule, and 1 KB article—then replicate two pieces in a second tool and capture clean screenshots!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Platform Fit Spectrum',
        asciiFallback: `[Shared Mailbox] -> [osTicket/GLPI/Zoho] -> [Freshservice/Zendesk/JSM] -> [HaloITSM/NinjaOne/Atera (MSP)] -> [ServiceNow/Ivanti/BMC Helix (Enterprise)]`,
      },
      workedExample: {
        title: 'Recommending a Tool for a 30-Person Company',
        context: 'A 30-person architectural firm with 1 IT generalist wants hardware tracking and fast user forms.',
        steps: [
          'Rule out heavy enterprise suites (too expensive and complex for 1 admin) and bare shared mailboxes (no asset tracking).',
          'Recommend Freshservice Starter, JSM free/standard tier, or self-hosted GLPI for lightweight portal + built-in asset inventory.',
        ],
        outcome: 'Delivers fast setup, Microsoft 365 email sync, and clean laptop serial tracking.',
      },
    },

    supportWalkthrough: {
      intro: 'Use transferable workflow mapping whenever hired onto an unfamiliar platform.',
      steps: [
        {
          phase: 'Week-One Tool Ramp Plan',
          action: 'Ask for read-only queue tour, map local labels to Unit 1 concepts, bookmark vendor admin docs, and shadow 5 live tickets.',
          whyItWorks: 'Eliminates tool anxiety in days rather than months.',
        },
      ],
      questionsToAsk: ['"Do you integrate remote monitoring/MDM alerts directly into your ticketing queue?"'],
      sampleUserWording: [
        {
          situation: 'Answering "How would you learn a new ticketing tool quickly?"',
          sayThis:
            '"I map the new tool’s terms onto the universal concepts I know—record types, views/queues, status transitions, public vs internal notes, and SLA pause rules—review the vendor’s quick-start guide, and practice inside a sandbox."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Service Desk Portfolio -> Platform Evaluation',
        priorityFormula: 'Impact: Low × Urgency: Low = P4 Documentation',
        internalNotes: 'Configured 9.10 Mini Service Desk Lab: portal form, 3 request types, SLA timer, auto-triage rule & KB deflection article; documented screenshots for portfolio.',
        customerReply: 'Here is our 5-line platform recommendation comparing setup effort, asset integration, and SLA reporting for a 30-person team.',
        escalationCriteria: 'Verify vendor security compliance (SOC 2 / GDPR) and live pricing with Procurement before signing contracts.',
      },
    },

    commonTraps: [
      {
        trap: 'Listing five ticketing tools on a CV after watching a 2-minute YouTube overview.',
        reality: 'Highlight the specific tool you actually built a lab in, and explain how the transferable ideas carry across others.',
      },
      {
        trap: 'Recommending a heavy enterprise suite (like ServiceNow or BMC Helix) to a 25-person startup with 1 IT admin.',
        reality: 'Oversized platforms drain months of admin time and budget; match tool complexity and RMM integration to actual team headcount and asset needs.',
      },
    ],

    keyTerms: [
      {
        term: 'HaloITSM / TOPdesk / Zoho Desk / Atera / NinjaOne / Datto',
        shortDef: 'Leading MSP, European ITSM, suite-integrated, and RMM-bundled ticketing platforms alongside enterprise Ivanti/BMC/SolarWinds.',
        fullDef: 'Evaluate current licensing and vendor support before deploying.',
      },
      {
        term: 'RMM (Remote Monitoring & Management)',
        shortDef: 'MSP agent suite handling automated patching, disk/CPU alerts, scripts, and unattended remote sessions.',
        fullDef: 'Paired tightly with ticketing in platforms like NinjaOne, Atera, Datto, and HaloITSM.',
      },
      {
        term: 'Mini Service Desk Lab Portfolio',
        shortDef: 'Hands-on sandbox build containing portal forms, request types, SLA pause rules, auto-routing, and KB articles.',
        fullDef: 'Gives entry-level candidates concrete proof of workflow configuration during interviews.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-991-q1',
        prompt: 'Which family of platforms specifically combines MSP ticketing with built-in remote monitoring, patching, and unattended remote control?',
        options: [
          'Atera, NinjaOne, and Datto (often paired with HaloITSM)',
          'Notepad++ and Paint',
          'Static shared mailboxes with Excel',
          'Local Print Spooler',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: RMM-integrated MSP suites bundle endpoint telemetry, remote control, and service tickets.',
          'Incorrect: Desktop editors.',
          'Incorrect: Lacks monitoring or patching.',
          'Incorrect: OS printing service.',
        ],
        takeaway: 'MSPs favor integrated RMM + ticketing platforms like NinjaOne, Atera, Datto, and HaloITSM.',
      },
      {
        id: 'itsup-991-q2',
        prompt: 'A 30-person growing design studio has 1 IT generalist, needs clean laptop serial tracking, Microsoft 365 email-to-ticket sync, and easy request forms on a modest budget. Which recommendation makes the most practical sense?',
        options: [
          'A right-sized ITSM/asset tool such as Freshservice Starter, JSM Cloud, or self-hosted GLPI rather than a complex multi-month enterprise rollout.',
          'Spending six figures deploying custom BMC Helix + an 8-person ServiceNow developer team.',
          'Deleting ticketing completely and tracking laptop serials on sticky notes.',
          'Using an unmonitored public chat channel with zero SLAs or asset tags.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Matches team size (30 users, 1 admin), asset tracking needs, M365 intake, and realistic cost.',
          'Incorrect: Massive over-engineering for 1 admin and 30 staff.',
          'Incorrect: Sticky notes lose serials, warranty dates, and BitLocker history.',
          'Incorrect: No accountability, prioritization, or asset traceability.',
        ],
        takeaway: 'Always size platform recommendations to headcount, admin bandwidth, and asset/integration needs.',
      },
      {
        id: 'itsup-991-q3',
        prompt: 'Why is completing a small sandbox Mini Service Desk Lab (portal form, SLA timer, routing rule, KB article) valuable for someone without prior paid IT experience?',
        options: [
          'It creates tangible screenshots and real configuration stories proving you understand how ticketing queues, SLAs, and knowledge deflection actually operate.',
          'It automatically grants a lifetime ServiceNow Administrator license.',
          'It replaces the need to communicate politely with end users.',
          'It bypasses all security background checks.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Demonstrating an actual configured workflow separates hands-on learners from passive theory-only applicants.',
          'Incorrect: Free trials demonstrate capability, not official vendor certification.',
          'Incorrect: Soft skills and documentation still matter equally.',
          'Incorrect: Unrelated to employment screening.',
        ],
        takeaway: 'Turn theory into portfolio proof by building 1 portal, 1 SLA rule, 1 automation, and 1 KB article in a free sandbox.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: '9.10 Mini Service Desk Portfolio Build',
      targetTab: 'simulator',
      instructions: [
        'Recommend a ticketing platform for a 30-person company in 5 concise lines covering cost, assets, and ease of use.',
        'Build a free sandbox portal with 3 request types, an SLA policy, an automation rule, and 1 KB article—save redacted screenshots for your portfolio.',
      ],
      verificationCheck: 'Written 5-line tool comparison + sandbox build notes ready for interviews.',
    },

    summaryBullets: [
      'Know the wider ecosystem: HaloITSM, TOPdesk, Zoho Desk, SolarWinds/Ivanti/BMC Helix, MSP RMMs (Atera/NinjaOne/Datto), and shared mailbox starters.',
      'Build the 9.10 Mini Service Desk Lab to turn conceptual knowledge into verifiable portfolio screenshots.',
    ],

    sourcesToVerify: ['Vendor Product Documentation (HaloITSM, NinjaOne, TOPdesk, GLPI)'],
  },

  'itsup.10.2.1': {
    id: 'itsup.10.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 10: ITSM in Practice',
    topicTitle: '10.1–10.3 ITIL 4 SVS, Guiding Principles, Incident Cadence & Service Catalog',
    code: '10.2.1',
    title: 'ITIL 4 Service Value System, 7 Guiding Principles, Value Chain, COBIT/ISO 20000, Incident Models & Service Catalog Fulfillment',
    readMinutes: 14,
    prerequisites: ['itsup.core.itsm.itil4-metrics'],
    versionScope: 'shared',

    learningObjectives: [
      'Explain the ITIL 4 Service Value System (SVS), Service Value Chain activities, and all 7 ITIL 4 Guiding Principles in plain language.',
      'Recognize complementary governance standards (COBIT, ISO/IEC 20000) without over-complicating frontline work.',
      'Apply standardized Incident Models, priority-driven communication cadence, and multi-task Service Catalog fulfillment workflows (such as onboarding).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Tell Me What ITIL Means in Plain English—Not Textbook Acronyms!"',
      narrative:
        'Interviewers ask how ITIL shapes your daily desk decisions: knowing when to apply a workaround so business resumes fast (**Focus on Value**), picking the right **Service Catalog** item with manager approval instead of logging a broken-fix **Incident**, and sending timed P1 updates every 30 minutes makes your team look calm and reliable.',
    },

    plainEnglish: {
      analogyTitle: 'Restaurant Kitchen Playbook vs Making Up Every Order From Scratch',
      analogy:
        '**ITSM** is how an IT kitchen reliably delivers meals so the company runs smoothly; **ITIL 4** is the world’s best-known playbook for running that kitchen—complete with a menu (**Service Catalog**), prep checklists (**Incident Models**), and principles like *"Keep it simple and practical"*.',
      technicalDefinition:
        'ITIL 4 organizes IT service management around the Service Value System—connecting Opportunity/Demand to Value through Governance, Guiding Principles, the 6-activity Service Value Chain, Practices, and Continual Improvement.',
      paragraphs: [
        'Memorize the **7 ITIL 4 Guiding Principles**: (1) *Focus on value*, (2) *Start where you are*, (3) *Progress iteratively with feedback*, (4) *Collaborate and promote visibility*, (5) *Think and work holistically*, (6) *Keep it simple and practical*, (7) *Optimize and automate*.',
        'The **Service Value Chain** turns demand into value across six activities: **Plan, Improve, Engage, Design & Transition, Obtain/Build, and Deliver & Support** (where the Service Desk lives daily). Other frameworks you may hear namedropped are **COBIT** (enterprise IT governance) and **ISO/IEC 20000** (auditable ITSM standard).',
        'In **10.2 Incident Management**, follow **Incident Models** (pre-built steps for recurring incidents) and enforce **Communication Cadence** (e.g., P1 updates every 30 min; P3 on status change)—and separate **Resolved -> User Confirmed -> Closed**. In **10.3 Service Requests**, bundle multi-team onboarding tasks cleanly from a **Service Catalog** with clear pre-approvals or manager sign-off.',
      ],
    },

    deepDive: {
      intro: 'Connect ITIL 4 principles directly to frontline Incident and Request execution.',
      steps: [
        {
          step: '01',
          title: 'Incident Models & Status Rhythm',
          explanation:
            'Predefined diagnostic checklists keep analysts consistent under pressure. Set explicit P1/P2 update timers so stakeholders never have to chase the desk asking "any update?"',
        },
        {
          step: '02',
          title: 'Designing a "New Laptop" Service Catalog Item',
          explanation:
            'A clean catalog form gathers: Role/Department, Hardware tier, Shipping address, Needed date, Required software -> Triggers Manager Approval -> Spawns parallel Procurement, MDM Autopilot prep, and Delivery tasks.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'ITIL 4 Service Value System & Request Fulfillment Flow',
        asciiFallback: `Demand -> [SVS: Guiding Principles + Governance + Value Chain + Practices + Improvement] -> Value
New Laptop Catalog Request -> Form Fields -> Manager Approval -> Procurement Task -> IT Setup Task -> Confirm & Close`,
      },
      workedExample: {
        title: 'Explaining ITIL 4 to a Non-Technical Manager in 45 Seconds',
        context: 'Interviewer asks how ITIL affects your day-to-day shift.',
        steps: [
          'Define ITIL simply: "A practical playbook that separates fixing broken things fast (Incidents), fulfilling standard requests safely (Service Requests), stopping repeat outages (Problems), and testing updates carefully (Changes)."',
          'Cite a Guiding Principle: "Focus on value and keep it simple—give users a clean workaround first so payroll runs, then fix the root cause permanently."',
        ],
        outcome: 'Clear, grounded answer without robotic jargon.',
      },
    },

    supportWalkthrough: {
      intro: 'Classify cleanly between broken-fix Incidents and repeatable Service Requests.',
      steps: [
        {
          phase: 'Audit Incident vs Request Boundary',
          action: '"Adobe Reader keeps crashing" = Incident. "Please install Adobe Pro for my new role" = Service Request.',
          whyItWorks: 'Routes approvals, SLAs, and automation cleanly without distorting incident metrics.',
        },
      ],
      questionsToAsk: ['"Do you have a manager-approved catalog request ID for this licensed software or hardware order?"'],
      sampleUserWording: [
        {
          situation: 'Sending a scheduled P1/P2 interim incident update',
          sayThis:
            '"Quick 30-minute update: we confirmed the VPN gateway timeout affects East Wing users only, have engineers applying a routing fix now, and our temporary browser link works in the meantime. Next update at 10:30 AM."',
        },
      ],
      ticketNoteTemplate: {
        category: 'ITSM Practice -> Service Catalog Fulfillment',
        priorityFormula: 'Impact: Medium × Urgency: Low = P3 Standard Request',
        internalNotes: 'Submitted New Laptop catalog request; manager approval recorded; spawned Procurement + Autopilot pre-staging tasks.',
        customerReply: 'Your manager approved the New Laptop request! Device preparation is underway with an estimated delivery target of Thursday.',
        escalationCriteria: 'Escalate stalled approvals after 48 hours to the requester’s department lead.',
      },
    },

    commonTraps: [
      {
        trap: 'Closing an incident immediately upon deploying a fix without waiting for user confirmation or auto-close window.',
        reality: 'Move to Resolved first, share clear verification steps, and allow confirmation or the configured auto-close grace period.',
      },
      {
        trap: 'Logging "New hire needs Adobe Pro + laptop" as a broken-fix Incident instead of a Service Catalog Request.',
        reality: 'Planned requests require manager approvals, standard SLAs, and procurement tasks; mixing them into Incident counts skews outage metrics.',
      },
    ],

    keyTerms: [
      {
        term: 'ITIL 4 Guiding Principles & Service Value Chain',
        shortDef: '7 practical rules (Focus on value, Keep it simple, Optimize & automate...) + 6 Value Chain activities.',
        fullDef: 'COBIT covers enterprise governance; ISO/IEC 20000 is an external ITSM certification standard.',
      },
      {
        term: 'Incident Model & Communication Cadence',
        shortDef: 'Predefined triage checklist + priority-based update schedule (e.g., every 30 min for P1 outages).',
        fullDef: 'Prevents forgotten stakeholders and repeated "any update?" calls during outages.',
      },
      {
        term: 'Service Catalog Fulfillment',
        shortDef: 'Pre-defined request menu routing intake forms, approvals, and parallel multi-team sub-tasks automatically.',
        fullDef: 'Ideal for hardware orders, software licenses, and employee onboarding.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-1021-q1',
        prompt: 'Which two requests classify correctly under ITIL 4 as Incident vs Service Request?',
        options: [
          '"Teams crashes whenever I share my screen" = Incident; "Please set up a laptop for Monday’s new hire" = Service Request.',
          'Both are Emergency Changes.',
          'Both are Problem Records.',
          'Both are Incidents because both involve laptops.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Unplanned disruption = Incident; pre-defined standard ask = Service Request.',
          'Incorrect: Neither modifies shared live infrastructure.',
          'Incorrect: A Problem investigates root cause of recurring/major incidents.',
          'Incorrect: Service Requests follow approval/fulfillment workflows, not outage recovery.',
        ],
        takeaway: 'Broken now = Incident; standard repeatable ask = Service Request.',
      },
      {
        id: 'itsup-1021-q2',
        prompt: 'Payroll software crashes for Finance 20 minutes before payday submission. You discover a temporary browser link lets Finance submit payroll cleanly while engineering investigates the desktop app bug. Which ITIL 4 Guiding Principle does applying that workaround first demonstrate?',
        options: [
          'Focus on value (restore business continuity quickly before deep-diving permanent fixes)',
          'Optimize and automate by deleting Payroll immediately',
          'Ignore stakeholders until root cause is 100% finished next week',
          'Treat every individual user ticket as an undocumented Emergency Change',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Prioritizing business outcomes with a safe workaround embodies "Focus on value" while keeping users productive.',
          'Incorrect: Deleting production apps violates basic service continuity.',
          'Incorrect: Waiting days misses payroll deadlines when a safe workaround exists.',
          'Incorrect: Workarounds restore service rapidly without reckless undocumented changes.',
        ],
        takeaway: 'Restore user value fast with a safe workaround, then pursue permanent root cause.',
      },
      {
        id: 'itsup-1021-q3',
        prompt: 'An analyst finishes patching a user’s broken Outlook profile while the user is away from their desk. What should the analyst do with the ticket status?',
        options: [
          'Set the ticket to `Resolved`, explain clearly what was done and how to test, and wait for user confirmation or the auto-close window before marking `Closed`.',
          'Immediately mark it `Closed` with zero notes so it cannot reopen.',
          'Delete the ticket so MTTR looks faster.',
          'Reclassify the outage as a New Hire Service Request.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Separating `Resolved` from `Closed` gives the user a chance to verify the fix before permanent closure.',
          'Incorrect: Premature closure frustrates users if the issue returns.',
          'Incorrect: Deleting tickets breaks audit trails and SLA integrity.',
          'Incorrect: Broken Outlook is an Incident, not a Catalog Request.',
        ],
        takeaway: 'Resolved = fix applied; Closed = user confirmed (or clean grace period elapsed).',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Design a "New Laptop" Service Catalog Item',
      instructions: [
        'List the 5 form fields, approval rule, and 3 fulfillment sub-tasks for a "New Laptop" catalog item.',
        'Explain ITIL 4 to a non-technical friend in under two minutes using Incident vs Request vs Problem vs Change.',
      ],
      verificationCheck: 'Written New Laptop catalog spec + 2-minute plain-English ITIL explanation.',
    },

    summaryBullets: [
      'ITIL 4’s Service Value System aligns 7 Guiding Principles and the 6-activity Service Value Chain around user value.',
      'Use Incident Models and predictable update cadence; move Resolved -> Confirmed -> Closed.',
      'Route repeatable tasks through Service Catalog approvals and automated fulfillment workflows.',
    ],

    sourcesToVerify: ['AXELOS ITIL 4 Foundation Official Syllabus'],
  },

  'itsup.10.4.1': {
    id: 'itsup.10.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 10: ITSM in Practice',
    topicTitle: '10.4–10.6 Problem Management (RCA), Change Enablement (CAB) & Major Incidents',
    code: '10.4.1',
    title: 'Proactive vs Reactive Problems, 5 Whys & Fishbone RCA, KEDB, Change Types & Freeze Windows, Major Incident Bridge Roles & Blameless PIR',
    readMinutes: 14,
    prerequisites: ['itsup.10.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Separate Reactive vs Proactive Problem Management, use **5 Whys** / **Fishbone** / timeline analysis, and leverage the **KEDB (Known Error Database)**.',
      'Distinguish **Standard**, **Normal (CAB)**, and **Emergency** changes, assemble a complete change plan with a **rollback (back-out) plan**, and respect **Freeze Periods**.',
      'Execute disciplined **Major Incident** bridge roles (Commander, Technical Lead, Communications Lead, Scribe) and conduct a **blameless Post-Incident Review (PIR)**.',
    ],

    whyThisMatters: {
      scenarioTitle: '"The Third-Floor Wi-Fi Dropped 14 Times This Month—and Nobody Rolled Back Last Night’s Update!"',
      narrative:
        'Closing individual Wi-Fi disconnects hides an underlying firmware bug; pushing an untested firewall rule during month-end payroll triggers a company-wide outage! Structured Problem Management, CAB Change approvals, and calm Major Incident command turn firefighting into measurable reliability.',
    },

    plainEnglish: {
      analogyTitle: 'Mopping Water vs Fixing the Burst Pipe, and Air-Traffic Control During a Storm',
      analogy:
        'Incident Management mops the floor fast so customers don’t slip; **Problem Management** climbs into the ceiling with **5 Whys** to fix the cracked pipe permanently. **Change Enablement** is the safety checklist before modifying live pipelines, and a **Major Incident Bridge** works like air-traffic control—one **Commander**, one **Scribe**, one **Comms Lead**, zero shouting.',
      technicalDefinition:
        'ITSM separates root-cause eradication (Problem Management + KEDB), risk-managed modification (Standard/Normal/Emergency Change + CAB + Back-out Plans), and high-impact outage coordination (Major Incident Bridge + Blameless PIR).',
      paragraphs: [
        '**Problem Management (10.4)** runs **reactively** (after major/repeat incidents) and **proactively** (spotting upward ticket trends). Once root cause is found and a workaround documented, it becomes a **Known Error** in the **KEDB** until a permanent fix rolls out via a Change.',
        '**Change Enablement (10.5)** guards live services: **Standard** (pre-approved low risk, e.g., approved app deploy), **Normal** (assessed, often by the **CAB — Change Advisory Board**), and **Emergency** (urgent production recovery via fast-track approval). Respect **Freeze Periods** (payroll/Black Friday/launches) and NEVER proceed without a tested **Back-out (Rollback) Plan**!',
        'During a **P1 Major Incident (10.6)**, link duplicate user tickets to the Master Major Incident instead of working them separately, post approved status-page wording on schedule (**Affected / Known / Action / Workaround / Next Update**), and run a **blameless Post-Incident Review (PIR)** afterward.',
      ],
    },

    deepDive: {
      intro: 'Master the 5 Whys, Change checklist, and Major Incident command template.',
      steps: [
        {
          step: '01',
          title: 'Worked 5 Whys on a Repeat Floor-3 Wi-Fi Drop',
          explanation:
            'Why 1: Laptops lost DHCP? AP crashed -> Why 2: AP crashed under >35 clients -> Why 3: Memory leak in AP firmware v8.2 -> Why 4: Lab tested only 5 clients -> Why 5: Pre-prod testing lacked load criteria -> Fix: Roll out patched firmware via Normal Change + update test gate!',
        },
        {
          step: '02',
          title: 'Major Incident 5-Part Update Template',
          explanation:
            'Every bridge update covers: (1) **What is affected**, (2) **What we know**, (3) **What we are doing**, (4) **Workaround if any**, (5) **Exact next update time**—never speculate on unconfirmed causes.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Incident -> Problem -> Change -> KEDB Lifecycle & Major Incident Bridge',
        asciiFallback: `14 Wi-Fi Incidents -> Link to Problem PRB-019 -> Workaround in KEDB -> Normal Change (CAB + Rollback Plan) -> Fix Verified -> Close Linked Incidents
P1 Bridge: [Commander Leads] + [Tech Leads Diagnose] + [Comms Lead Posts Updates] + [Scribe Logs Timeline] -> Blameless PIR`,
      },
      workedExample: {
        title: 'Change Request for 200-Laptop Security Patch Rollout',
        context: 'Preparing a Normal Change ahead of Tuesday’s maintenance window.',
        steps: [
          'Document Reason, Risk Assessment, Pilot Ring (20 test laptops), Implementation Steps, Verification Test, Rollback Plan (uninstall KB / pause Intune ring), and Maintenance Window outside month-end Freeze.',
        ],
        outcome: 'CAB approves smoothly because risk is bounded and rollback is ready.',
      },
    },

    supportWalkthrough: {
      intro: 'Handle major outages calmly without overwhelming engineering bridges.',
      steps: [
        {
          phase: 'Link & Deflect Flood Calls',
          action: 'Update login banner / IVR notice, link every incoming user ticket to the Parent Major Incident, and share the approved workaround.',
          whyItWorks: 'Protects technical leads on the bridge from redundant pings and ensures every user receives the final recovery notice automatically.',
        },
      ],
      questionsToAsk: ['"Are you seeing the same issue since 9:10 AM? I’m linking your ticket to our active P1 outreach so you get instant updates."'],
      sampleUserWording: [
        {
          situation: 'Posting an approved P1 progress update during an email outage',
          sayThis:
            '"Update (10:00 AM): Cloud mail clients are intermittently failing to load across Finance and HR. Engineering isolated a misrouted authentication rule and is deploying a rollback now. Workaround: Webmail remains operational for urgent messages. Next update at 10:30 AM."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Major Incident -> Linked Child Ticket',
        priorityFormula: 'Impact: High (Multi-dept outage) × Urgency: High = P1 Major Incident',
        internalNotes: 'Linked user ticket to Master P1 INC-9000. Confirmed workaround (Webmail) delivered; zero unauthorized changes made.',
        customerReply: 'Your ticket is linked to our active email outage response. Please use Webmail temporarily—our next scheduled update posts at 10:30 AM.',
        escalationCriteria: 'Route confirmed systemic findings to the Major Incident Commander & Scribe immediately.',
      },
    },

    commonTraps: [
      {
        trap: 'Speculating "Maybe someone deleted a server!" in a company-wide P1 status message, or blaming an engineer during a PIR.',
        reality: 'Share ONLY verified facts in public outage comms, and run PIRs strictly **blamelessly** to fix processes and safeguards.',
      },
      {
        trap: 'Deploying a Normal Change during a Change Freeze without an approved Back-out (Rollback) Plan.',
        reality: 'Freeze periods protect critical business events (payroll/tax/launches), and untested changes without rollback turn minor glitches into hours-long outages.',
      },
    ],

    keyTerms: [
      {
        term: 'KEDB & 5 Whys / Fishbone',
        shortDef: 'Known Error Database (`KEDB`) stores root causes + workarounds; `5 Whys` & `Fishbone` isolate systemic causes.',
        fullDef: 'Separates quick incident recovery from permanent problem removal.',
      },
      {
        term: 'CAB & Back-out Plan',
        shortDef: 'Change Advisory Board (`CAB`) reviews Normal Changes; Back-out Plan safely reverses failed edits.',
        fullDef: 'Respect Change Freeze windows (month-end, major launches).',
      },
      {
        term: 'Blameless Post-Incident Review (PIR)',
        shortDef: 'Structured post-outage review documenting timeline, triggers, safeguards, and action items without shaming individuals.',
        fullDef: 'Encourages honest root-cause reporting and prevents repeat failures.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-1041-q1',
        prompt: 'During a P1 outage bridge, what is the help desk analyst’s #1 priority when 40 users call at once?',
        options: [
          'Link child tickets to the Master Major Incident, deliver the approved status wording and workaround, and avoid starting conflicting independent fixes.',
          'Restart servers personally without a Change record.',
          'Tell every caller a personal guess about who broke the network.',
          'Close all 40 tickets as duplicates with no notification.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Linking child tickets + consistent approved messaging scales comms cleanly.',
          'Incorrect: Unauthorized changes worsen outages.',
          'Incorrect: Never speculate unconfirmed root causes.',
          'Incorrect: Users still need closure confirmation once resolved.',
        ],
        takeaway: 'Major Incident = Link tickets, share approved status + workaround, preserve timeline.',
      },
      {
        id: 'itsup-1041-q2',
        prompt: 'Over the past three weeks, 18 users reported Floor-3 Wi-Fi dropping every afternoon at 2:00 PM. Tier 1 reboots laptops to restore temporary access, but the pattern keeps returning. Which ITSM record and database should now be updated?',
        options: [
          'Open a **Problem** record to run root-cause analysis (`5 Whys`), and document the temporary recovery steps inside the **KEDB (Known Error Database)**.',
          'Close all 18 tickets permanently with no escalation because rebooting works briefly.',
          'Ask Finance for an Emergency Change to replace every user’s laptop.',
          'Delete Wi-Fi monitoring alerts so the trend disappears.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Recurring incidents trigger a **Problem** investigation for permanent fix, while **KEDB** shares known workarounds across the desk.',
          'Incorrect: Symptom-only fixes leave users disrupted daily.',
          'Incorrect: Unverified hardware swaps waste budget without finding the true root cause.',
          'Incorrect: Hiding telemetry worsens reliability.',
        ],
        takeaway: 'Repeat incidents -> Problem record + 5 Whys + Known Error Database (`KEDB`) workaround.',
      },
      {
        id: 'itsup-1041-q3',
        prompt: 'An admin prepares a Normal Change to upgrade firewall firmware during quarter-end financial close (a scheduled Freeze Period), and leaves the Back-out Plan field blank. Why should the CAB reject or defer this change?',
        options: [
          'Normal Changes require both respect for Change Freeze windows and a verified Back-out (Rollback) Plan in case the upgrade fails.',
          'Firewalls never require change tickets.',
          'Normal Changes are only for resetting individual user passwords.',
          'Back-out Plans are only written after an outage finishes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Risk-managed Change Enablement prevents unapproved outages during critical business windows and guarantees recovery steps before deployment.',
          'Incorrect: Shared core firewalls carry high business blast radius and must go through Change review.',
          'Incorrect: Routine password resets are standard fulfillment/service requests.',
          'Incorrect: Rollback plans MUST exist before touching production.',
        ],
        takeaway: 'Every Normal Change needs risk review, Freeze-window compliance, and a ready Back-out Plan.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Run a 5 Whys RCA & 3-Stage Outage Notice',
      instructions: [
        'Write a 5 Whys root-cause chain for a printer or Wi-Fi failure that happened 4 times this month.',
        'Draft three short outage notices (Initial, Progress, Resolved) using the 5-part Major Incident update template.',
      ],
      verificationCheck: 'Complete 5 Whys + 3 outage updates + rollback section.',
    },

    summaryBullets: [
      'Problem Management uses 5 Whys / Fishbone / timelines and KEDB workarounds until a Change fixes root cause.',
      'Every Normal Change needs testing, approvals (CAB), maintenance timing outside Freeze windows, and a Back-out Plan.',
      'Major Incidents rely on Commander/Comms/Scribe discipline, child-ticket linking, and blameless PIRs.',
    ],

    sourcesToVerify: ['ITIL 4 Problem Management, Change Enablement & Incident Management Practice Guides'],
  },

  'itsup.10.8.1': {
    id: 'itsup.10.8.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 10: ITSM in Practice',
    topicTitle: '10.7–10.9 CMDB Discovery, Full KPI Suite, Metric Gaming & Shift Handovers',
    code: '10.8.1',
    title: 'CMDB Relationships & Automated Discovery, Phone & Queue KPIs (ASA/AHT/Abandonment/Backlog/Reopen), Metric Gaming Risks & Shift Handovers / On-Call',
    readMinutes: 13,
    prerequisites: ['itsup.10.4.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Maintain accurate asset lifecycles (Procure -> Deploy -> Maintain -> Retire) and explain why **CMDB** discovery and Configuration Item (`CI`) dependency mapping matter.',
      'Interpret full service desk & telephony KPIs—including **ASA**, **AHT**, **Abandonment Rate**, **FCR**, **MTTR**, **Backlog Age**, **Reopen Rate**, **Escalation Rate**, and **CSAT**—and guard against metric gaming.',
      'Execute disciplined shift queuing, fair priority picking (no cherry-picking), crisp **shift handover notes**, and compliant **on-call** workflows.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Our Average Handle Time Dropped 30%—Why Did Reopen Rate & Angry Callbacks Double?!"',
      narrative:
        'Managers love fast handle times until someone notices agents closing unfinished tickets just to beat the clock (**metric gaming**)! Meanwhile, an outdated **CMDB** hides which file server supports Payroll, and sloppy Friday shift handovers leave overnight P2 tickets abandoned until Monday morning.',
    },

    plainEnglish: {
      analogyTitle: 'Hospital Shift Handover Chart + Not Gaming the Wait-Time Clock',
      analogy:
        'An ER team never celebrates "2-minute patient discharges" if half those patients collapse in the parking lot an hour later! Good metrics pair **speed** (ASA, MTTR) with **quality** (FCR, low Reopen Rate, high CSAT)—and crisp shift handovers pass the baton cleanly.',
      technicalDefinition:
        'Operational excellence combines accurate Configuration Management Database (`CMDB`) dependency tracking, balanced efficiency-versus-quality telemetry, and disciplined queue triage and shift-change handoffs.',
      paragraphs: [
        'In **10.7 Asset & CMDB Management**, every device moves through **Procure -> Deploy -> Maintain -> Retire** alongside software license reclamation. A **CMDB** tracks **Configuration Items (CIs)** and their dependency links (*"If Switch SW-2 goes down for maintenance, which apps break?"*)—only reliable when automated **discovery tools** and analyst swap updates keep it fresh.',
        'In **10.8 Metrics & Phone KPIs**, pair volume/speed indicators—**Average Speed to Answer (ASA)**, **Average Handle Time (AHT)**, **Abandonment Rate** (hang-ups before answer), **MTTR**, **Backlog Age**, **Escalation Rate**, and **Cost per Ticket**—with quality checks like **FCR**, **CSAT**, and **Reopen Rate** (spiking reopens reveal rushed fixes!).',
        'In **10.9 Working Shifts & Queues**, tackle oldest **Priority + SLA risk** tickets first rather than cherry-picking easy password resets, swarm urgent incidents, write explicit **Handover Notes** (open high-priority items, tried steps, pending blockers, scheduled callbacks), and document every **on-call** intervention cleanly.',
      ],
    },

    deepDive: {
      intro: 'Read dashboards holistically and format shift handovers like a pro.',
      steps: [
        {
          step: '01',
          title: 'Spotting Metric Gaming Across Dashboard Pairs',
          explanation:
            'Look at pairs, not single KPIs: Fast **AHT** + rising **Reopen Rate** = premature closures; High **FCR** + low **CSAT** = rushed or dismissive attitude; Low **Escalation Rate** + soaring **Ticket Age** = analysts hoarding tough tickets too long.',
        },
        {
          step: '02',
          title: '5-Line Shift Handover Format',
          explanation:
            'Include per open urgent ticket: 1) Ticket ID + Priority/SLA due time; 2) Current summary; 3) Exact diagnostics completed; 4) What we are waiting on; 5) Who owns the next user callback and when.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Balanced KPI Scorecard + Shift Handover Baton',
        asciiFallback: `SPEED KPIs (ASA, AHT, MTTR, SLA %)  <== BALANCE ==>  QUALITY KPIs (FCR, CSAT, Low Reopen Rate)
Outdated Asset / CMDB? -> Broken Impact Analysis during Changes & Outages
Shift End -> Summary of Open P1/P2 + Tried Steps + Waiting On + Next Callback -> Smooth Next-Shift Takeoff`,
      },
      workedExample: {
        title: 'Diagnosing a Deceptive Dashboard in Team Standup',
        context: 'Weekly dashboard shows MTTR dropped 22%, yet CSAT dipped 8 points and Reopen Rate jumped from 4% to 16%.',
        steps: [
          'Spot the gaming signature: tickets are being moved to Resolved before verifying the fix with users.',
          'Recommend tracking verified FCR + 7-day Reopen Rate side-by-side and reinforcing user confirmation before resolution.',
        ],
        outcome: 'Eliminates ping-pong reopen frustration and restores CSAT.',
      },
    },

    supportWalkthrough: {
      intro: 'Prioritize SLA deadlines fairly and hand off cleanly at end of shift.',
      steps: [
        {
          phase: 'Never Cherry-Pick the Queue',
          action: 'Work highest Priority × nearest SLA breach first, even when easy wins tempt you.',
          whyItWorks: 'Protects business-critical workflows and team SLA compliance.',
        },
      ],
      questionsToAsk: ['"Have all three swapped laptops had their asset tags and assigned users updated in Asset Inventory?"'],
      sampleUserWording: [
        {
          situation: 'Answering "How do you prioritize when the queue has 25 tickets?"',
          sayThis:
            '"I sort by Priority and remaining SLA clock rather than cherry-picking easy tickets—handling P1/P2 blockers or multi-user issues first, updating waiting users proactively, and swarming with teammates when an SLA nears breach."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Shift Handover -> End-of-Shift Summary',
        priorityFormula: 'Impact: High × Urgency: Medium = P2 Handover Priority',
        internalNotes: '[HANDOVER] INC-2088 (P2 VPN drop, SLA due 11:00 AM tomorrow): Verified ipconfig/DNS ok; escalated tunnel log to NetOps; promised Elena Martinez callback at 9:00 AM.',
        customerReply: 'Our incoming morning analyst has full notes on your case and will follow up with our Network team’s update at 9:00 AM.',
        escalationCriteria: 'Alert incoming Shift Lead verbally + in team channel for any active P1/P2 breaching overnight.',
      },
    },

    commonTraps: [
      {
        trap: 'Swapping a damaged laptop from spare stock without updating the asset/CMDB record.',
        reality: 'Unrecorded swaps break warranty claims, software license counts, and BitLocker key lookups months later.',
      },
      {
        trap: 'Cherry-picking easy 2-minute password resets while P2 tickets approach SLA breach at the bottom of the queue.',
        reality: 'Work strictly by Priority × nearest SLA risk, swarm tough tickets together, and write structured handover notes at shift end.',
      },
    ],

    keyTerms: [
      {
        term: 'ASA, AHT & Abandonment Rate',
        shortDef: 'Phone KPIs: Average Speed to Answer (`ASA`), Average Handle Time (`AHT`), and caller hang-ups (`Abandonment Rate`).',
        fullDef: 'Always balance call speed metrics against FCR, CSAT, and Reopen Rate.',
      },
      {
        term: 'Configuration Item (CI) & CMDB Accuracy',
        shortDef: 'Track servers/apps/links (`CI`s) via discovery tools + disciplined analyst updates.',
        fullDef: 'Enables rapid outage impact analysis and safe CAB change checks.',
      },
      {
        term: 'Shift Handover Note',
        shortDef: 'Concise end-of-shift transfer listing open urgent tickets, tried steps, pending blockers, and promised callback times.',
        fullDef: 'Ensures seamless continuity across shifts and on-call rotations without repeating questions.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-1081-q1',
        prompt: 'Average Handle Time dropped sharply this month, while Reopen Rate tripled from 5% to 15%. What likely happened?',
        options: [
          'Analysts are prematurely marking tickets Resolved before confirming permanent fixes (metric gaming).',
          'The CMDB discovered two extra printers.',
          'Users stopped submitting password resets.',
          'Abandonment rate improved FCR.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Rushing tickets off the queue lowers AHT artificially while inflating reopen rates and hurting CSAT.',
          'Incorrect: Unrelated to ticket reopens.',
          'Incorrect: Doesn’t cause closed tickets to reopen.',
          'Incorrect: Abandoned calls don’t raise FCR.',
        ],
        takeaway: 'Spiking Reopen Rate reveals rushed or incomplete ticket closures.',
      },
      {
        id: 'itsup-1081-q2',
        prompt: 'You swap a broken laptop for a spare Latitude 5440 from stock so a Finance analyst can keep working. What must happen in Asset / CMDB tracking before closing the ticket?',
        options: [
          'Reassign the spare’s serial/asset tag to the Finance user, mark the damaged unit In Repair/Retired, and ensure BitLocker & software licenses stay linked.',
          'Leave the old laptop assigned forever so nobody notices.',
          'Delete both serial numbers from the database.',
          'Wait until next year’s audit.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Accurate asset lifecycle and CMDB records preserve warranty support, license compliance, and BitLocker key retrieval.',
          'Incorrect: Breaks audit accuracy and BitLocker recovery lookups later.',
          'Incorrect: Destroys financial and security asset visibility.',
          'Incorrect: Unlogged swaps create ghost assets immediately.',
        ],
        takeaway: 'Every physical device swap requires an immediate Asset/CMDB owner update.',
      },
      {
        id: 'itsup-1081-q3',
        prompt: 'Your 8-hour shift ends in 15 minutes and you have an active P2 VPN ticket awaiting a Network Engineer callback for a remote director. What belongs in your Shift Handover Note?',
        options: [
          'Ticket ID & SLA due time, exact diagnostics already tested, current escalation owner/blocker, and the promised callback time for the incoming analyst.',
          'A single word: "Pending."',
          'Reassigning the ticket back to New without comments.',
          'Closing the ticket as Resolved so your queue looks empty at 5:00 PM.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Prevents repeating `ipconfig`/`nslookup` questions and protects promised user callback times.',
          'Incorrect: Forces the next shift to waste 20 minutes digging through logs.',
          'Incorrect: Drops SLA ownership and annoys the requester.',
          'Incorrect: Metric gaming that causes an immediate angry callback.',
        ],
        takeaway: 'Great shift handovers list Ticket ID/SLA, tried steps, pending dependency, and promised callback.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Write a 3-Ticket Shift Handover & Asset Record Exercise',
      instructions: [
        'Write a crisp 5-line shift handover covering 3 sample open tickets (one waiting on user, one escalated to Tier 2, one VIP hardware swap).',
        'Draft 5 sample asset records showing Asset Tag, Serial, Assigned User, Warranty Date & Lifecycle Status.',
      ],
      verificationCheck: 'Clean 3-ticket handover note + 5-device asset table.',
    },

    summaryBullets: [
      'Keep CMDB and asset lifecycles accurate whenever deploying, swapping, or retiring hardware.',
      'Pair speed metrics (ASA, AHT, MTTR) with quality checks (FCR, Reopen Rate, CSAT) to avoid gaming.',
      'Work by Priority + SLA clock, avoid cherry-picking, and write actionable shift handovers.',
    ],

    sourcesToVerify: ['HDI Service Desk Metrics & KPI Benchmarks', 'ITIL 4 IT Asset & Service Configuration Management'],
  },
};
