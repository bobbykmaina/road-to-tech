import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_TOOLS_A_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.core.tools.landscape': {
    id: 'itsup.core.tools.landscape',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.1 Tool Categories & Translation Table',
    code: '9.1.1',
    title: 'The Help Desk Tool Landscape by Category (ITSM, RMM, Remote, Identity, MDM, KB, Asset, Chat)',
    readMinutes: 12,
    prerequisites: ['1.1.2 Writing Actionable Internal Notes & KB', '8.1.1 Troubleshooting & Remote Tools'],
    versionScope: 'shared',

    learningObjectives: [
      'Map the **8 distinct software categories** a real IT Support team touches daily—never confusing a ticketing portal with an RMM agent or an identity directory.',
      'Name real commercial and open-source tools inside each category (ITSM/Ticketing, RMM, Remote Support, Identity/SSO, MDM/UEM, Knowledge Base, ITAM/CMDB, Team Chat).',
      'Explain how Managed Service Providers (**MSPs**) stack tools differently from **in-house enterprise IT** departments.',
      'Avoid the beginner trap of thinking "IT support software" means only one app.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Walking Into Your First Help Desk Shift With 7 Browser Tabs Open',
      narrative:
        'Job listings drop dozens of brand names at once: *"Must know ServiceNow or Jira Service Management, Intune, NinjaOne, Duo, TeamViewer, Confluence, and Slack."* To a beginner, that sounds like 15 completely unrelated careers! In reality, every IT Support team simply picks **one tool from each of 8 predictable categories**. Once you see the 8-category blueprint, unfamiliar company tech stacks snap into focus in 5 minutes flat.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Running an Auto Repair Shop With 8 Distinct Stations',
      analogy:
        'No mechanic tries to tighten bolts with a cash register! An auto shop has a **front work-order desk** (Ticketing/ITSM), a **diagnostic OBD scanner** checking fleet engines remotely (**RMM**), a **key & employee badge safe** (**Identity/SSO**), a **maintenance binder** (**Knowledge Base**), and an **inventory ledger** (**Asset/ITAM**). Modern IT Help Desks work the exact same way—8 clear jobs, 1 tool (sometimes bundled) per job.',
      technicalDefinition:
        'Modern Help Desk operations compose an 8-category software stack: (1) **ITSM/Ticketing** (work queues & SLAs), (2) **RMM** (Remote Monitoring & Management endpoint agents), (3) **Remote Support** (interactive screen control), (4) **Identity & SSO/MFA** (directories & authentication), (5) **MDM/UEM** (device compliance & app push), (6) **Knowledge Base (KB)** (internal/self-service docs), (7) **ITAM/CMDB** (hardware/license lifecycle & configuration relationships), and (8) **Team Chat / ChatOps** (real-time alert & escalation channels).',
      paragraphs: [
        'Spot how **In-House IT** differs from **MSPs (Managed Service Providers)**: In-house IT supports one company, often pairing **Microsoft Entra ID + Intune + ServiceNow or Jira Service Management + Confluence**. An MSP manages 40 small-to-midsize client companies simultaneously, relying heavily on multi-tenant **RMM tools** (like NinjaOne, ConnectWise Automate, Datto RMM) paired with PSA ticketing (ConnectWise PSA, Autotask, HaloPSA) to patch thousands of client PCs across different offices.',
        'Notice that Units 0–8 intentionally taught you **how every workflow works underneath** before naming vendors. Starting right here in Unit 9, we connect those exact vendor-neutral habits to the real platforms hiring managers list on job postings.',
      ],
    },

    deepDive: {
      intro:
        'Study all 8 core Help Desk software categories, what each one does, and the leading brands in each bucket.',
      steps: [
        {
          step: 'Categories 1–2',
          title: 'ITSM / Ticketing vs. RMM (Remote Monitoring & Management)',
          explanation:
            '**ITSM / Ticketing** (Jira Service Management, ServiceNow, Zendesk, Freshservice, ManageEngine ServiceDesk Plus, osTicket) tracks requests, SLAs, and communications. **RMM** (NinjaOne, Datto RMM, ConnectWise Automate, Atera) runs silent background agents on endpoints to monitor disk space, run PowerShell scripts silently, and push OS patches across fleets.',
        },
        {
          step: 'Categories 3–4',
          title: 'Remote Support vs. Identity / SSO / MFA',
          explanation:
            '**Remote Support** (Quick Assist, TeamViewer, AnyDesk, ScreenConnect, Splashtop, BeyondTrust) shares live user screens with consent. **Identity & Access** (Active Directory, Microsoft Entra ID, Okta, JumpCloud, Duo, Ping Identity) controls passwords, Single Sign-On, and MFA prompts.',
        },
        {
          step: 'Categories 5–6',
          title: 'MDM / UEM vs. Knowledge Base (KB)',
          explanation:
            '**MDM / UEM** (Microsoft Intune, Jamf Pro for macOS/iOS, Kandji, Workspace ONE) enforces disk encryption, Wi-Fi profiles, and remote device wipes. **Knowledge Bases** (Confluence, Notion, SharePoint, ServiceNow Knowledge, IT Glue for MSPs) store SOPs, error fixes, and user self-help guides.',
        },
        {
          step: 'Categories 7–8',
          title: 'ITAM / CMDB vs. Team Chat & Incident Bridge',
          explanation:
            '**ITAM / CMDB** (Snipe-IT, GLPI, Freshservice Assets, ServiceNow CMDB, Lansweeper) tracks who holds Laptop `#A-441`, warranty dates, and which servers depend on which switches. **Team Chat** (Microsoft Teams, Slack, Zoom Team Chat) powers real-time triage rooms (`#it-escalations`, `#major-incident`) and intake bots.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'The 8-Category Modern Help Desk Tool Stack',
        asciiFallback: `[Employee Issue]
   |
   +--> (8) Chat / Portal (Teams, Slack, Portal)
   |        v
   +--> (1) ITSM / Ticketing (JSM, ServiceNow, Zendesk, Freshservice, SDP, GLPI)
   |        |--- links ---> (6) Knowledge Base (Confluence, IT Glue, Notion)
   |        |--- links ---> (7) ITAM / CMDB (Snipe-IT, GLPI, CMDB)
   |
   +--> Technician Diagnostic Console:
        |--- (2) RMM Agent (NinjaOne, Datto, Atera) -> background scripts/patches
        |--- (3) Remote Control (Quick Assist, ScreenConnect, TeamViewer, AnyDesk)
        |--- (4) Identity / MFA (AD, Entra ID, Okta, Duo)
        |--- (5) MDM / UEM (Intune, Jamf Pro, Kandji)`,
      },
      workedExample: {
        title: 'Worked Tool-Stack Mapping: Decoding a Real Job Description in 30 Seconds',
        context:
          'Job posting asks for: "Experience with Freshservice, Okta, Jamf Pro, Splashtop, Confluence, and Slack."',
        steps: [
          'Ticket Queue -> **Freshservice** (Category 1: ITSM/Ticketing + built-in ITAM).',
          'Passwords & MFA -> **Okta** (Category 4: Identity/SSO).',
          'MacBook Fleet Policies -> **Jamf Pro** (Category 5: Apple MDM).',
          'Screen Sharing -> **Splashtop** (Category 3: Remote Support).',
          'SOPs & Internal Docs -> **Confluence** (Category 6: Knowledge Base) + **Slack** (Category 8: Team Chat).',
        ],
        outcome:
          'Every single tool drops neatly into an exact category you already understand conceptually.',
      },
    },

    supportWalkthrough: {
      intro:
        'Use this orientation checklist on Week 1 at any new IT Support job.',
      steps: [
        {
          phase: 'Ask for the 8-Tool Map',
          action: 'During onboarding, write down which product your employer uses for each of the 8 categories.',
          whyItWorks: 'Prevents mixing up where passwords live (Identity) vs where laptop serials live (ITAM) vs where tickets live (ITSM).',
        },
        {
          phase: 'Bookmark Core Consoles',
          action: 'Pin Ticketing, Identity, Remote Support, MDM, and Knowledge Base in one clean browser folder.',
          whyItWorks: 'Cuts triage scramble time in half on live phone calls.',
        },
        {
          phase: 'Keep Data in the Right System',
          action: 'Never store passwords in ticket comments or Confluence plain text—keep secrets strictly in your team password vault (1Password, Bitwarden, IT Glue).',
          whyItWorks: 'Ticket logs are audited and widely readable; passwords never belong in tickets.',
        },
      ],
      questionsToAsk: [
        '"Which ticketing system is our source of truth, and where do our SOP/Knowledge Base docs live?"',
        '"Which remote control tool do users already have pre-installed via MDM/RMM?"',
        '"If I need to look up who owns a laptop by serial number, do we check Intune/Jamf or a separate ITAM asset tracker?"',
      ],
      sampleUserWording: [
        {
          situation: 'Guiding a user smoothly between Portal and Remote Support',
          sayThis:
            '"Go ahead and grab that 6-digit screen-share code from our Remote Support app—meanwhile I’ve pulled up your open ticket and laptop record on my screen so you won’t have to repeat anything."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Internal Onboarding -> 8-Category Tool Map Verified',
        priorityFormula: 'N/A — Service Desk Tooling Orientation',
        internalNotes: `[STACK MAP] ITSM: Company Ticket Portal | RMM: Endpoint Patch Agent | Remote: Quick Assist / ScreenConnect | Identity: Entra ID + Duo | MDM: Intune/Jamf | KB: Confluence | ITAM: Snipe-IT | Chat: Slack.`,
        customerReply:
          'Internal readiness checklist — no end-user reply required.',
        escalationCriteria:
          'Request missing read/triage RBAC permissions from Service Desk Lead via Standard Access Request.',
      },
    },

    commonTraps: [
      {
        trap: 'Confusing an **RMM tool** (NinjaOne/Datto) with a **Ticketing/ITSM tool** (ServiceNow/JSM/Zendesk).',
        reality: 'RMMs watch hardware health, run background patches/scripts, and trigger alerts; ITSM platforms track human tickets, SLAs, workflows, and approvals.',
      },
      {
        trap: 'Putting sensitive temporary credentials or BitLocker keys into unencrypted team chat or public ticket notes.',
        reality: 'Store shared IT secrets strictly in an audited password/documentation vault and share sensitive one-time passcodes only via secure approved channels.',
      },
      {
        trap: 'Assuming MDM (Intune/Jamf) replaces Identity (Entra/Okta).',
        reality: 'Identity governs *who the user is* (accounts, SSO, MFA); MDM governs *how healthy the device is* (encryption, OS patches, app deployment).',
      },
    ],

    keyTerms: [
      {
        term: 'ITSM (IT Service Management)',
        shortDef: 'Platforms managing tickets, incidents, service requests, changes, and SLAs (e.g., JSM, ServiceNow, Freshservice).',
        fullDef: 'Central workflow hub connecting users, frontline queues, and escalation teams.',
      },
      {
        term: 'RMM (Remote Monitoring & Management)',
        shortDef: 'Background agent software used especially by MSPs to monitor health, run scripts, and deploy OS patches.',
        fullDef: 'Examples include NinjaOne, Datto RMM, ConnectWise Automate, and Atera.',
      },
      {
        term: 'ITAM / CMDB',
        shortDef: 'IT Asset Management / Configuration Management Database tracking hardware, software licenses, and dependencies.',
        fullDef: 'Links user laptops, warranties, and servers cleanly inside tickets (e.g., Snipe-IT, GLPI, ServiceNow CMDB).',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-911-q1',
        prompt: 'A job posting mentions "NinjaOne, ScreenConnect, Okta, and Jira Service Management." Which tool handles **Single Sign-On and user identities**?',
        options: [
          'Okta',
          'NinjaOne',
          'ScreenConnect',
          'Jira Service Management',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Okta is an Identity & Access Management (IAM / SSO / MFA) platform.',
          'Incorrect: NinjaOne is an RMM (endpoint monitoring, patching, scripting).',
          'Incorrect: ScreenConnect is an interactive Remote Support screen-control tool.',
          'Incorrect: Jira Service Management is an ITSM ticketing platform.',
        ],
        takeaway: 'Know the job of each category so mixed brand stacks become instantly readable.',
      },
      {
        id: 'itsup-911-q2',
        prompt: 'What is the main difference between an **MDM tool** (like Microsoft Intune or Jamf Pro) and an **ITSM ticketing tool** (like Zendesk or ServiceNow)?',
        options: [
          'MDM enforces device security/configuration/app installs on laptops and phones; ITSM tracks user tickets, SLAs, and support workflows.',
          'MDM is only for writing chat messages.',
          'ITSM formats hard drives remotely.',
          'There is no difference—they are identical products.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: MDM controls endpoint hardware/OS compliance; ITSM orchestrates support tickets and workflows.',
          'Incorrect: Chat tools (Teams/Slack) handle messaging.',
          'Incorrect: Ticketing systems manage workflows, not direct OS imaging.',
          'Incorrect: Distinct software categories that often integrate together.',
        ],
        takeaway: 'MDM manages devices; Identity manages accounts; ITSM manages tickets and processes.',
      },
      {
        id: 'itsup-911-q3',
        prompt: 'Why do **Managed Service Providers (MSPs)** rely heavily on **RMM** platforms compared to a single-building help desk?',
        options: [
          'MSPs monitor health, deploy patches, and run maintenance scripts across dozens of separate client companies from one multi-tenant dashboard.',
          'MSPs are forbidden from using ticketing systems.',
          'RMM tools replace Ethernet cables physically.',
          'MSPs never support Windows PCs.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: RMM gives MSP technicians visibility and automated patching across many independent client environments.',
          'Incorrect: MSPs pair RMM with PSA/ticketing tools closely.',
          'Incorrect: RMM is software over network connections.',
          'Incorrect: RMM heavily monitors Windows, macOS, and servers.',
        ],
        takeaway: 'RMM = multi-endpoint monitoring, silent patching, and remote script execution at scale.',
      },
      {
        id: 'itsup-911-q4',
        prompt: 'Which category stores laptop serial numbers, purchase/warranty dates, and which employee currently has Device `#LT-204` checked out?',
        options: [
          'ITAM / CMDB (Asset Management)',
          'MFA Authenticator App',
          'Team Chat',
          'DNS Resolver',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IT Asset Management (ITAM) and CMDB systems track hardware lifecycle, custody, and warranty records.',
          'Incorrect: MFA verifies sign-in identity.',
          'Incorrect: Chat is ephemeral communication, not asset inventory.',
          'Incorrect: DNS translates hostnames to IP addresses.',
        ],
        takeaway: 'Look to ITAM/CMDB (or MDM hardware inventory) whenever tracking who owns which physical asset.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Map Your Target Employer’s 8-Category Tool Stack',
      instructions: [
        'Search 3 live Help Desk / Service Desk job postings near you and list every software name mentioned.',
        'Sort each tool cleanly into the 8 categories: ITSM, RMM, Remote Support, Identity/MFA, MDM, KB, ITAM/CMDB, and Chat.',
      ],
      verificationCheck: 'Every brand name maps cleanly to one of the 8 functional jobs with zero confusion.',
    },

    summaryBullets: [
      'Every IT Help Desk operates an **8-category software stack**, simply swapping vendor logos per employer.',
      '**ITSM** manages tickets/SLAs; **RMM** monitors endpoints and runs background patches/scripts.',
      '**Remote Support** handles live user screen sharing with consent; **Identity/SSO** controls logins and MFA.',
      '**MDM/UEM** enforces device compliance/apps; **KB** stores SOPs; **ITAM/CMDB** tracks hardware and dependencies.',
      'In-house teams emphasize Entra/Intune + enterprise ITSM, while MSPs rely heavily on multi-tenant RMM + PSA.',
    ],

    sourcesToVerify: [
      'ITIL 4 Practice Guides — Service Desk & Asset Management Tool Categories',
      'Atlassian, ServiceNow, Microsoft Learn & Jamf — Official Product Category Documentation',
    ],
  },

  'itsup.core.tools.translation': {
    id: 'itsup.core.tools.translation',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.1 Tool Categories & Translation Table',
    code: '9.1.2',
    title: 'Same Ideas, Different Names: Ticket / Incident / Issue / Case Translation Table',
    readMinutes: 11,
    prerequisites: ['9.1.1 The Help Desk Tool Landscape by Category'],
    versionScope: 'shared',

    learningObjectives: [
      'Translate the **8 universal ticketing concepts** seamlessly across **Jira Service Management, ServiceNow, Zendesk, Freshservice, and ManageEngine ServiceDesk Plus**.',
      'Spot the single highest-stakes naming pitfall in daily support: confusing **private internal technician notes** with **customer-visible public replies**.',
      'Map Queue vs View vs Filter, Request Type vs Catalog Item vs Macro, and Workflow State names quickly on any unfamiliar platform.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Never Accidentally Email Your Private "User Forgot Password 4 Times This Week" Note to the Customer!',
      narrative:
        'Almost every terrible rookie mistake in a new ticketing tool happens because two platforms use opposite-sounding labels for **private notes vs. public replies**—or slightly different names for queues and request templates. Knowing the universal translation map guarantees you walk into Jira Service Management, ServiceNow, Zendesk, Freshservice, or ManageEngine on Day 1 without sending a private diagnostic note straight to an executive’s inbox!',
    },

    plainEnglish: {
      analogyTitle: 'Think of Driving Any Rental Car After Learning on One Sedan',
      analogy:
        'A Ford, Toyota, and Volkswagen might place the windshield wipers on a slightly different stalk or label the trunk button "Boot"—yet every single car still has a steering wheel, brake, gas pedal, speedometer, and turn signal! Ticketing tools are identical: once you learned **Ticket, Queue, Status, Internal Note, Customer Reply, SLA, Service Request, and KB** in Unit 1, learning a new vendor platform is simply a 10-minute vocabulary swap.',
      technicalDefinition:
        'Cross-platform ITSM literacy maps vendor-neutral support abstractions—work unit (**Ticket/Issue/Incident/Case**), filtered inbox (**Queue/View**), lifecycle stage (**Status/State**), private vs. public audit log (**Internal Note / Work Note** vs. **Public Reply / Additional Comments**), SLA timer (**SLA Policy**), intake form (**Request Type / Catalog Item**), and reusable template (**Canned Response / Macro**)—across major enterprise platforms.',
      paragraphs: [
        '**Watch the #1 Visual Safety Check on Every Platform**: Look at the comment box color and tab label *before* pressing Submit!\n• **Jira Service Management**: **Add internal note** vs. **Reply to customer**.\n• **ServiceNow**: **Work notes** (yellow border = private) vs. **Additional comments** (customer visible!).\n• **Zendesk**: **Internal note** (yellow box) vs. **Public reply** (white box).\n• **Freshservice / ManageEngine**: **Add note (Private)** vs. **Reply**.',
        'Whenever you switch jobs or test a new portal, spend your first 2 minutes building a personal 6-line cheat sheet using the exact Translation Table below.',
      ],
    },

    deepDive: {
      intro:
        'Keep this side-by-side Rosetta Stone of Help Desk terminology handy for interviews and first-week onboarding.',
      steps: [
        {
          step: 'Work Record',
          title: 'What Is a "Ticket" Called?',
          explanation:
            '**Jira Service Management:** Issue (categorized as Incident, Service Request, Problem, Change) · **ServiceNow:** Incident / Requested Item (`RITM`) / Catalog Task (`SCTASK`) · **Zendesk:** Ticket · **Freshservice:** Ticket (Incident / Service Request) · **ManageEngine:** Request.',
        },
        {
          step: 'Filtered Inbox',
          title: 'Where Do Agents Pick Work From?',
          explanation:
            '**Jira Service Management:** Queues (powered by JQL filters) · **ServiceNow:** List Views / Workspaces (`My Groups Work`) · **Zendesk:** Views · **Freshservice:** Ticket List Views · **ManageEngine:** Request Views / Filters.',
        },
        {
          step: 'Private vs Public',
          title: 'Private Technician Notes vs Customer Replies (CRITICAL!)',
          explanation:
            '**JSM:** Internal Note vs Reply to Customer · **ServiceNow:** Work Notes (yellow) vs Additional Comments (customer visible) · **Zendesk:** Internal Note (yellow) vs Public Reply · **Freshservice:** Add Note (Private toggle) vs Reply · **ManageEngine:** Add Note (Private) vs Reply.',
        },
        {
          step: 'Intake & Speed',
          title: 'Forms, Quick Replies & SLAs',
          explanation:
            'Intake forms = **Request Types** (JSM) / **Catalog Items** (ServiceNow & Freshservice) / **Ticket Forms** (Zendesk) / **Service Templates** (ManageEngine). Quick actions = **Macros** (Zendesk/JSM/Freshservice) or **Templates** (ServiceNow/ManageEngine).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Cross-Platform Ticketing Rosetta Stone (Same Concept, Vendor Label)',
        asciiFallback: `CONCEPT          | JSM               | SERVICENOW          | ZENDESK         | FRESHSERVICE     | MANAGEENGINE SDP
-----------------|-------------------|---------------------|-----------------|------------------|------------------
Work Item        | Issue             | Incident / RITM     | Ticket          | Ticket           | Request
Agent Inbox      | Queue             | List / Workspace    | View            | Ticket View      | Request Filter
Private Log      | Internal note     | Work notes (yellow) | Internal note   | Private Note     | Private Note
User Email/Msg   | Reply to customer | Additional comments | Public reply    | Reply            | Reply
Intake Form      | Request Type      | Catalog Item        | Ticket Form     | Service Item     | Template
Quick Shortcut   | Canned / Macro    | Response Template   | Macro           | Canned Response  | Resolution Templ.
Automation Rule  | Automation Rules  | Flow / Business Rule| Trigger / Autom.| Workflow Autom.  | Business Rules`,
      },
      workedExample: {
        title: 'Worked Translation: Moving an L1 Technician From ServiceNow to Zendesk Overnight',
        context:
          'You trained on ServiceNow in one role and your new employer runs Zendesk Support.',
        steps: [
          'Looking for `"My Groups Work"` list -> Click **Views** in Zendesk left sidebar.',
          'Looking for yellow `"Work notes"` -> Toggle **Internal note** (yellow highlight) above the Zendesk editor.',
          'Looking for `"Additional comments"` -> Toggle **Public reply**.',
          'Looking for reusable reset instructions -> Click **Apply macro** at the bottom toolbar.',
        ],
        outcome:
          'Zero panic, zero leaked internal notes, full productivity inside 15 minutes.',
      },
    },

    supportWalkthrough: {
      intro:
        'Follow these quick safety checks anytime you touch an unfamiliar ticketing console.',
      steps: [
        {
          phase: 'Check Comment Mode First',
          action: 'Before typing even one word in a new platform, identify which tab/color means Private Internal Note vs Public Customer Reply.',
          whyItWorks: 'Prevents embarrassing or policy-violating leaks of raw diagnostic suspicions to customers.',
        },
        {
          phase: 'Verify State Transitions',
          action: 'Check which status pauses the SLA clock ("Waiting for customer" / "Pending" / "On Hold") vs closes the ticket ("Resolved" vs "Closed").',
          whyItWorks: 'Keeps SLA clocks honest while waiting for users to reply.',
        },
        {
          phase: 'Use Intake Forms Properly',
          action: 'Select the matching Request Type / Catalog Item when logging phone tickets so automation and SLA timers attach accurately.',
          whyItWorks: 'Generic blank tickets often miss routing rules and SLA policies.',
        },
      ],
      questionsToAsk: [
        '"On this platform, which status pauses the SLA timer while we wait for a user reply—Waiting for Customer, Pending, or On Hold?"',
        '"Which status is our final agent step (Resolved) vs auto-closing later (Closed)?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a translated status cleanly to a user',
          sayThis:
            '"I’ve moved your request into Pending / Waiting on Your Confirmation while you test that VPN icon on your next break—just reply anytime to bring it right back to the top of my queue!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Cross-Platform Translation Check -> Verified',
        priorityFormula: 'Impact × Urgency translates identically across JSM, ServiceNow, Zendesk, Freshservice & ManageEngine',
        internalNotes: `[PLATFORM CHECK] Confirmed Private note mode active (yellow/Internal toggle) before logging diagnostic hypotheses and user IP details.`,
        customerReply:
          'Verified Public Reply channel active before sending clean, jargon-free user summary.',
        escalationCriteria:
          'Route to Queue/Assignment Group owning the failing service with complete Work/Internal Notes attached.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming ServiceNow `"Additional comments"` are private technician comments because `"Work notes"` sounds formal.',
        reality: 'In **ServiceNow**, **Work notes** (yellow) are private to IT; **Additional comments** get emailed straight to the user!',
      },
      {
        trap: 'Believing you have to start from scratch if a job uses Freshservice instead of Jira Service Management.',
        reality: 'Workflows, SLAs, prioritization, and internal-vs-public hygiene are 90% identical—only button names move.',
      },
    ],

    keyTerms: [
      {
        term: 'Work Notes / Internal Note',
        shortDef: 'Private technician-only ticket log hidden from end users.',
        fullDef: 'Known as "Work notes" in ServiceNow and "Internal note" in JSM and Zendesk.',
      },
      {
        term: 'Additional Comments / Public Reply',
        shortDef: 'Customer-visible ticket message emailed/shown directly to the requester.',
        fullDef: 'Known as "Additional comments" in ServiceNow, "Reply to customer" in JSM, and "Public reply" in Zendesk.',
      },
      {
        term: 'Queue / View',
        shortDef: 'Filtered live list grouping open tickets by team, priority, or SLA status.',
        fullDef: 'Called Queues in JSM, Views in Zendesk/Freshservice, and List Views/Workspaces in ServiceNow.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-912-q1',
        prompt: 'You are working inside **ServiceNow** for the first time and want to record a **private technical note** visible only to fellow technicians—NOT emailed to the caller. Which field must you type into?',
        options: [
          'Work notes',
          'Additional comments',
          'Short description',
          'Caller email subject',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: ServiceNow "Work notes" (yellow bar) remain strictly internal to technicians.',
          'Incorrect: "Additional comments" are customer-facing and trigger notifications to the caller!',
          'Incorrect: Short description is the public ticket summary title.',
          'Incorrect: Customer-visible header.',
        ],
        takeaway: 'In ServiceNow: Work notes = private IT log; Additional comments = customer-visible reply.',
      },
      {
        id: 'itsup-912-q2',
        prompt: 'Your old job used **Queues** in Jira Service Management. In **Zendesk Support**, what is the equivalent sidebar feature showing filtered groups of tickets?',
        options: [
          'Views',
          'Macros',
          'Triggers',
          'Organizations',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Zendesk Views group tickets dynamically by status, group, or SLA just like JSM Queues.',
          'Incorrect: Macros are one-click canned replies/actions, not filtered ticket lists.',
          'Incorrect: Triggers are event-driven background automation rules.',
          'Incorrect: Organizations group customer companies.',
        ],
        takeaway: 'JSM Queues = Zendesk Views = ServiceNow List Views.',
      },
      {
        id: 'itsup-912-q3',
        prompt: 'An employee wants to request a new laptop dock via an automated approval form. What is that self-service form called in **Jira Service Management** vs. **ServiceNow**?',
        options: [
          'Request Type (JSM) vs. Catalog Item (ServiceNow)',
          'Problem Record (JSM) vs. Work Note (ServiceNow)',
          'Macro (JSM) vs. Trigger (ServiceNow)',
          'JQL (JSM) vs. CMDB (ServiceNow)',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: JSM maps portal forms to Request Types; ServiceNow groups standard service request forms as Service Catalog Items.',
          'Incorrect: Problem records investigate recurring incidents; Work notes log internal progress.',
          'Incorrect: Automation/template helpers, not portal intake forms.',
          'Incorrect: JQL is query language; CMDB tracks assets/CIs.',
        ],
        takeaway: 'Portal request forms = Request Types (JSM) = Catalog Items (ServiceNow/Freshservice).',
      },
      {
        id: 'itsup-912-q4',
        prompt: 'Why is learning cross-platform terminology ("Translation Table") a superpower in Help Desk job interviews?',
        options: [
          'It lets you prove honestly that even if you haven’t clicked their specific brand UI in production, you already master every underlying ITSM workflow and only need a quick label mapping.',
          'It lets you claim you have 10 years of experience in tools you never opened.',
          'It eliminates the need to write internal notes.',
          'All ticketing systems use identical source code.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Hiring managers love candidates who understand workflows conceptually and translate fast without faking tool names.',
          'Incorrect: Lying on resumes fails technical probes instantly.',
          'Incorrect: Clear internal notes are required on every tool.',
          'Incorrect: Different vendors built distinct codebases sharing common ITIL concepts.',
        ],
        takeaway: 'Master the concept once, then translate labels effortlessly across any brand.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Build Your Personal 2-Minute Tool Cheat Sheet',
      instructions: [
        'Pick two platforms from the Rosetta Stone diagram (for instance, Jira Service Management and ServiceNow).',
        'Practice saying aloud how you check the queue, record a private note, send a public reply, and apply a template in both.',
      ],
      verificationCheck: 'You never confuse Work Notes / Internal Notes with customer-facing comments across platforms.',
    },

    summaryBullets: [
      'Every major ITSM tool shares the same 8 core building blocks—only screen labels differ.',
      'Always double-check **private vs. public** comment modes before submitting (ServiceNow `Work notes` vs `Additional comments`; JSM/Zendesk `Internal note` vs `Reply`).',
      'Filtered agent inboxes go by **Queues** (JSM), **Views** (Zendesk/Freshservice), and **List Views / Workspace** (ServiceNow).',
      'Self-service portal forms are **Request Types** (JSM), **Catalog Items** (ServiceNow/Freshservice), or **Templates** (ManageEngine).',
      'Cross-platform vocabulary lets you switch tools on a new job inside a single afternoon.',
    ],

    sourcesToVerify: [
      'Atlassian Documentation — Jira Service Management Key Concepts & Queues',
      'ServiceNow Product Documentation — Incident Management, Work Notes & Service Catalog',
      'Zendesk, Freshservice & ManageEngine ServiceDesk Plus — Official Agent Workspace Guides',
    ],
  },

  'itsup.core.tools.jsm': {
    id: 'itsup.core.tools.jsm',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.2 Major ITSM & Ticketing Platforms',
    code: '9.2.1',
    title: 'Jira Service Management (From Zero: Jira Software vs JSM vs Confluence, JQL & Queues)',
    readMinutes: 14,
    prerequisites: ['9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',
    verifyFlag: 'Verify current Atlassian naming (Jira Service Management Cloud UI labels & Atlassian Intelligence features).',

    learningObjectives: [
      'Clarify the **Atlassian suite from zero**: distinguish **Jira Software** (developer sprints/boards), **Jira Service Management (JSM)** (IT support portal, queues, SLAs), and **Confluence** (Knowledge Base & SOP wiki).',
      'Trace how an external **Request Type** (e.g., *"Reset MFA / Report VPN Broken"*) maps onto an internal **Issue Type** (`[System] Incident`, `[System] Service request`) inside a JSM **Service Project**.',
      'Use **Queues**, **Workflows**, **SLA timers**, **Automation rules**, **Assets (CMDB)**, and **Reply to customer vs. Add internal note** safely.',
      'Write practical **JQL (Jira Query Language)** searches to find stale tickets, breached SLAs, or your team’s unassigned P1s.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Beginners Get Confused Opening "Jira" for the First Time',
      narrative:
        'A candidate hears *"We use Jira for IT support"*—so they Google Jira and land on software-developer Scrum sprint boards full of story points! That causes huge confusion. **Atlassian** builds **Jira Software** for developers, **Jira Service Management (JSM)** specifically for IT Help Desks, and **Confluence** for the linked Knowledge Base. Understanding JSM’s exact anatomy (Portal -> Request Type -> Issue -> Queue -> Workflow -> JQL) makes you immediately effective on one of the world’s most popular ITSM tools.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Restaurant Menu Front (Portal) Connected to a Kitchen Ticket Rail (Queue)',
      analogy:
        'At a restaurant, customers never read chef shorthand like *"STATION-2 FIRE-HIGH."* Customers order from a friendly menu (**Help Center Portal / Request Type**: *"My laptop won’t connect to Wi-Fi"*). Behind the kitchen doors, that exact order lands on a structured chef ticket (**JSM Issue** with an **Issue Type** like `Incident`, **Priority**, **Workflow status**, and countdown timer **SLA**) hanging on the **Queue** rail!',
      technicalDefinition:
        '**Jira Service Management (JSM)** is Atlassian’s ITIL-aligned ITSM platform built atop Jira’s **Issue** engine, pairing a customer-friendly **Help Center Portal** (**Request Types** backed by Jira **Issue Types**) with agent **Queues**, customizable **Workflows**, countdown **SLA metrics**, no-code **Automation rules**, linked **Confluence** Knowledge Base articles, and **JQL (Jira Query Language)** filtering.',
      paragraphs: [
        '**Start With the Three Atlassian Siblings**:\n1. **Jira Software**: Developer project tracking (bugs, sprints, Kanban boards).\n2. **Jira Service Management (JSM)**: Frontline IT Help Desk, HR service desk, SLA timers, Customer Portal, Incidents/Changes/Assets.\n3. **Confluence**: Linked wiki storing troubleshooting SOPs—when a user types `"VPN not working"` into JSM’s portal, JSM automatically suggests matching **Confluence KB** pages *before* they even submit a ticket (ticket deflection!).',
        '**Know Request Type vs. Issue Type**: Users see **Request Types** (*"Get IT help"*, *"Request new laptop"*, *"Report broken Wi-Fi"*). Agents and reports classify the underlying **Issue Type** (`[System] Service request`, `[System] Incident`, `[System] Problem`, `[System] Change`). Keeping that split clean gives non-technical staff an easy portal while giving IT clean ITIL metrics!',
      ],
    },

    deepDive: {
      intro:
        'Walk through a JSM Service Project screen-by-screen—and learn 4 real JQL queries every JSM agent uses daily.',
      steps: [
        {
          step: 'Portal -> Issue',
          title: 'Customer Portal, Request Types & Issue Types',
          explanation:
            'Employee visits the JSM Portal -> picks **Request Type** (*"Report a system problem"*) -> JSM creates an **Issue** key like `ITSD-1482` backed by Issue Type `[System] Incident`, attaches SLA goals (*Time to first response*, *Time to resolution*), and drops it into **All open** / **Unassigned** Queues.',
        },
        {
          step: 'Agent Screen',
          title: 'Queues, Workflows & Add Internal Note vs. Reply to Customer',
          explanation:
            'Inside `ITSD-1482`, the left pane displays description, linked **Confluence KB**, and **Assets**; the right pane holds Status (`Waiting for support` -> `In progress` -> `Waiting for customer` -> `Resolved`), Assignee, Request Participants, and live **SLA countdown bars**. Above the comment box sit two tabs: **Reply to customer** (sends email/portal notification!) and **Add internal note** (locked amber/gray box visible only to licensed agents!).',
        },
        {
          step: 'Automation & SLAs',
          title: 'SLAs & No-Code Automation Rules',
          explanation:
            'When Status switches to `Waiting for customer`, SLA **Time to resolution** pauses automatically. JSM **Automation Rules** (*When Issue Created + Priority = Highest -> Post alert to #it-p1 Slack channel & auto-assign Tier 2 On-Call*) eliminate manual busywork.',
        },
        {
          step: 'JQL Search',
          title: 'Jira Query Language (JQL) Daily Searches',
          explanation:
            'JSM Queues are literally saved **JQL** filters! Learn to read and write simple JQL:\n• `project = ITSD AND assignee is EMPTY AND status != Resolved ORDER BY created ASC` (unassigned backlog oldest-first)\n• `assignee = currentUser() AND resolution = Unresolved` (my active tickets)\n• `"Time to resolution" = breached() AND status != Resolved` (SLA fires needing immediate rescue)',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Atlassian Suite & JSM Ticket Flow (Portal -> Queue -> SLA -> Confluence)',
        asciiFallback: `[Confluence KB] <--- Auto-suggests self-help ---> [JSM Help Center Portal]
                                                        | (User submits Request Type)
                                                        v
[JSM Service Project Queue (JQL Filter)] ---> Issue: ITSD-1482 ([System] Incident)
   |-- Workflow: Waiting for support -> In progress -> Waiting for customer (SLA Paused) -> Resolved
   |-- Comment Tabs: [Reply to customer]  vs  [Add internal note (Agents only!)]
   |-- Automation: Auto-route / Ping Slack / Reopen if customer replies`,
      },
      workedExample: {
        title: 'Worked JSM Walkthrough: Triaging `ITSD-1482` From Unassigned Queue to Clean Resolution',
        context:
          'User submits `"Report a system problem"` complaining Outlook won’t sync on office Wi-Fi.',
        steps: [
          'Open **Unassigned issues** Queue in Project `ITSD`; click `ITSD-1482`.',
          'Click **Assign to me** and transition Status from `Waiting for support` to `In progress` (notice **Time to first response** SLA marks met once you reply to customer!).',
          'Check linked **Assets** device (`LT-409`) and open **Add internal note** to log your `ipconfig /all` findings safely away from user view.',
          'Switch deliberately to **Reply to customer**, type your plain-English fix or troubleshooting step, link a **Confluence** how-to guide using the Knowledge Base search panel, and set Status to `Waiting for customer` (pausing SLA) or `Resolved`.',
        ],
        outcome:
          'Meets First Response SLA cleanly, keeps technical logs internal, and attaches a Confluence KB article to boost deflection metrics.',
      },
    },

    supportWalkthrough: {
      intro:
        'Follow these JSM-specific habits to avoid the classic rookie slip-ups inside Atlassian projects.',
      steps: [
        {
          phase: 'Check Both Tabs',
          action: 'Always glance at **Reply to customer** vs. **Add internal note** before clicking Save.',
          whyItWorks: 'Clicking Reply to customer does NOT just message them—it also stops the Time to First Response SLA clock while exposing every word you wrote!',
        },
        {
          phase: 'Use Waiting for Customer',
          action: 'Whenever you ask the user a question or confirm a fix, transition Status to `Waiting for customer`.',
          whyItWorks: 'Prevents your Resolution SLA timer from bleeding red while the user takes 3 days to reply.',
        },
        {
          phase: 'Link Confluence KBs',
          action: 'Search and attach relevant Confluence articles from the Knowledge Base panel before resolving.',
          whyItWorks: 'Teaches JSM’s portal search to suggest that article automatically to future users.',
        },
      ],
      questionsToAsk: [
        '"In our JSM project, does transitioning to `Waiting for customer` also auto-trigger on `Reply to customer`, or do agents move the status manually?"',
        '"Which Request Type should I choose when logging a walk-up desk ticket manually via the + Create button?"',
      ],
      sampleUserWording: [
        {
          situation: 'Sending a helpful Reply to customer with a linked Confluence KB step',
          sayThis:
            '"Hi Alex — I’ve attached our 3-step VPN refresh guide right inside this ticket so you can test the reconnect on your desk. I’ve set the ticket to Waiting for customer—just reply here if it still gives an error!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'JSM Issue Type: [System] Incident | Request Type: Report a system problem',
        priorityFormula: 'JSM Priority: High -> SLA: 30m First Response / 4h Resolution',
        internalNotes: `[JSM INTERNAL NOTE] Verified Request Type mapped correctly. Linked Asset LT-409. Ran ipconfig /all -> DNS suffix stale after subnet move; cleared via ipconfig /flushdns & VPN reconnect.`,
        customerReply:
          'Hi Alex — Refreshing your VPN DNS settings fixed the connection drop! Let us know anytime if you notice Outlook pausing again.',
        escalationCriteria:
          'Reassign or add Escalation Group / Request Participants via internal note and update Status to Escalated per JSM workflow.',
      },
    },

    commonTraps: [
      {
        trap: 'Adding a quick `Add internal note` and wondering why the "Time to First Response" SLA clock keeps ticking down.',
        reality: 'In JSM, **Time to First Response** normally stops only upon a **Reply to customer** (a public agent comment), NOT an internal note!',
      },
      {
        trap: 'Confusing **Jira Software** Sprint/Kanban projects with **Jira Service Management** customer portals and SLAs.',
        reality: 'Jira Software tracks engineering work; JSM adds the Customer Portal, Request Types, Queues, SLAs, and external customer accounts (no extra license fee for portal customers!).',
      },
      {
        trap: 'Writing JQL searches with `=` when checking empty assignees (`assignee = NULL` error-prone habits).',
        reality: 'Clean JQL uses `assignee is EMPTY` and `"Time to resolution" = breached()`.',
      },
    ],

    keyTerms: [
      {
        term: 'Jira Service Management (JSM)',
        shortDef: 'Atlassian’s ITIL service desk platform featuring Customer Portals, Queues, SLAs, Assets, and Confluence integration.',
        fullDef: 'Distinct from Jira Software (developer sprint tracking) and Confluence (team wiki/KB).',
      },
      {
        term: 'Request Type vs. Issue Type',
        shortDef: 'Customer-facing portal form label vs. underlying ITIL classification (`Incident`, `Service Request`, `Change`).',
        fullDef: 'Decouples friendly user wording on the portal from structured reporting queues for IT.',
      },
      {
        term: 'JQL (Jira Query Language)',
        shortDef: 'Structured query syntax powering JSM Queues and advanced issue searches.',
        fullDef: 'Example: `project = ITSD AND assignee is EMPTY AND priority = Highest`.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-921-q1',
        prompt: 'What is the cleanest way to explain the three Atlassian tools (**Jira Software**, **Jira Service Management**, and **Confluence**) to a teammate?',
        options: [
          'Jira Software tracks engineering/dev sprints, Jira Service Management runs the IT Help Desk portal/queues/SLAs, and Confluence stores the Knowledge Base documentation.',
          'All three are identical renames of Microsoft Excel.',
          'Confluence assigns Windows passwords while JSM compiles code.',
          'Jira Software is required for every end user just to submit an IT ticket.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Each Atlassian product owns a clear slice—Dev projects, IT Service Desk, and Knowledge Base wiki.',
          'Incorrect: Completely wrong domain.',
          'Incorrect: Confluence is a collaborative wiki/KB, not an identity provider.',
          'Incorrect: Portal customers submit JSM tickets cleanly without needing paid Jira agent seats.',
        ],
        takeaway: 'Jira Software = Dev teams · JSM = IT Service Desk · Confluence = Knowledge Base.',
      },
      {
        id: 'itsup-921-q2',
        prompt: 'You open an unassigned JSM ticket `ITSD-412`, type a diagnostic note under **Add internal note**, and wait 40 minutes before messaging the user. Why did your **Time to First Response** SLA still breach?',
        options: [
          'First Response SLAs measure public communication with the customer (**Reply to customer**), so internal notes alone do not stop the response clock.',
          'JSM SLAs ignore Tuesdays.',
          'Only deleting the ticket stops First Response timers.',
          'Confluence blocked the clock.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: In standard JSM SLA rules, the timer stops only when a public **Reply to customer** is posted (or status shifts per project rules).',
          'Incorrect: SLAs follow configured business-hour calendars consistently.',
          'Incorrect: Deleting tickets breaks audit history.',
          'Incorrect: Confluence has no control over SLA clocks.',
        ],
        takeaway: 'Internal notes inform teammates; only **Reply to customer** acknowledges the user and satisfies Time to First Response.',
      },
      {
        id: 'itsup-921-q3',
        prompt: 'Which JQL query finds **unassigned, unresolved tickets** in project `ITSD` so you can triage the shared backlog?',
        options: [
          '`project = ITSD AND assignee is EMPTY AND resolution = Unresolved ORDER BY created ASC`',
          '`SELECT * FROM ITSD WHERE user = NONE`',
          '`ping ITSD /unassigned`',
          '`project == ITSD && assignee == ""`',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Valid JQL syntax (`is EMPTY`, `= Unresolved`, `ORDER BY created ASC`).',
          'Incorrect: SQL syntax, not JQL.',
          'Incorrect: Windows network command, not JQL.',
          'Incorrect: Programming equality syntax (`==`, `&&`) fails JQL parser checks.',
        ],
        takeaway: 'Use `is EMPTY`, `AND`, `OR`, and `ORDER BY` cleanly in JQL queue filters.',
      },
      {
        id: 'itsup-921-q4',
        prompt: 'Why does JSM separate a **Request Type** (*"My laptop won’t connect to VPN"*) from an **Issue Type** (`[System] Incident`)?',
        options: [
          'Employees get simple plain-English portal forms while IT gets clean ITIL classification (`Incident`, `Service Request`, `Change`) for reporting and SLAs.',
          'Because JSM forbids users from picking incidents.',
          'So every ticket creates two duplicate bills.',
          'To hide tickets from the Help Desk.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Users don’t need to know ITIL jargon to get help, while IT teams still keep accurate Incident vs Request metrics.',
          'Incorrect: Multiple Request Types map smoothly into Incidents and Service Requests.',
          'Incorrect: One single Issue backs the Request Type.',
          'Incorrect: Both surface directly in agent Queues.',
        ],
        takeaway: 'Request Type = user-friendly portal doorway; Issue Type = structured internal ITIL classification.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Practice JSM Field Mapping & JQL Filtering',
      instructions: [
        'Write down 3 JQL queries by hand: (1) your unresolved tickets, (2) unassigned Highest-priority tickets, (3) tickets waiting on customer.',
        'Trace on a practice ticket which action triggers Time to First Response vs pauses Time to Resolution.',
      ],
      verificationCheck: 'All 3 JQL queries use valid syntax (`is EMPTY`, `currentUser()`, `ORDER BY`) and accurately separate Internal Notes from Customer Replies.',
    },

    summaryBullets: [
      'Understand the Atlassian trio: **Jira Software** (Dev) · **Jira Service Management** (ITSM) · **Confluence** (Knowledge Base).',
      'Users pick friendly **Request Types** on the portal; agents work the backing **Issues** inside **Queues** powered by **JQL**.',
      '**Add internal note** stays private to agents; **Reply to customer** notifies the requester and stops Time to First Response.',
      'Move Status to `Waiting for customer` when awaiting user replies so Resolution SLA clocks pause cleanly.',
      'Link **Confluence KB** articles inside tickets to boost self-service ticket deflection.',
    ],

    sourcesToVerify: [
      'Atlassian Documentation — What is Jira Service Management? & Request Types vs Issue Types',
      'Atlassian Documentation — Advanced Search Reference (JQL Fields & Operators) & JSM SLAs',
    ],
  },

  'itsup.core.tools.servicenow': {
    id: 'itsup.core.tools.servicenow',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.2 Major ITSM & Ticketing Platforms',
    code: '9.2.2',
    title: 'ServiceNow ITSM Tour (Incidents, Service Catalog, Assignment Groups, CMDB & Work Notes)',
    readMinutes: 13,
    prerequisites: ['9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',
    verifyFlag: 'Verify current ServiceNow Next Experience / Service Operations Workspace screen terminology.',

    learningObjectives: [
      'Navigate core **ServiceNow ITSM** records: **Incident (`INC`)**, **Service Catalog Request (`REQ` -> `RITM` -> `SCTASK`)**, **Problem (`PRB`)**, and **Change (`CHG`)**.',
      'Use **Caller**, **Short description**, **Category/Subcategory**, **Configuration Item (CI)** from the **CMDB**, **Impact × Urgency -> Priority**, and **Assignment Group vs. Assigned To** accurately.',
      'Maintain strict separation between yellow **Work notes** (internal IT only) and **Additional comments** (customer-visible) inside Service Operations Workspace / classic form views.',
      'Explain why **ServiceNow** dominates Fortune 500 enterprises and large healthcare/government IT environments.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Enterprise Help Desks Love ServiceNow—and Why One Wrong Click Leaks Notes',
      narrative:
        'If you apply to large banks, hospitals, universities, or Fortune 500 enterprises, there is an overwhelming chance their IT department runs on **ServiceNow**. Walking into a live Incident record (`INC0014920`) feels intimidating at first because ServiceNow packs dozens of enterprise fields onto one screen: `Caller`, `Configuration item`, `Assignment group`, `State`, `Work notes`, and `Additional comments`. Mastering those core fields—plus the **REQ -> RITM -> SCTASK** Service Catalog chain—turns ServiceNow from an intimidating wall of boxes into home turf.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Hospital Chart Linked to Pharmacy Orders and Building Rooms',
      analogy:
        'At a huge hospital, every patient chart links cleanly to the exact room and MRI machine involved (**Configuration Item in the CMDB**), routes smoothly from Front Triage to Cardiology (**Assignment Group**), keeps doctor-to-doctor diagnostic notes strictly on yellow internal sheets (**Work notes**), sends clear discharge updates to the patient (**Additional comments**), and splits a broken-bone ER visit (**Incident `INC`**) from a scheduled physical-therapy equipment order (**Request `REQ` -> `RITM` -> `SCTASK`**).',
      technicalDefinition:
        '**ServiceNow ITSM** is an enterprise SaaS workflow platform built around a unified **Configuration Management Database (CMDB)**, separating unplanned outages (**Incidents `INC`**) from fulfilled catalog orders (**`REQ` -> Requested Item `RITM` -> Catalog Task `SCTASK`**), routing work via **Assignment Groups**, calculating Priority automatically from **Impact × Urgency**, and enforcing private **Work notes** vs. customer-visible **Additional comments**.',
      paragraphs: [
        '**Decode the Classic ServiceNow 3-Tier Request Chain (`REQ -> RITM -> SCTASK`)**:\nSuppose a manager orders a new hire’s laptop AND Adobe Pro license in one checkout cart (**Request `REQ0010200`**). Inside that cart sit two **Requested Items (`RITM`)**: one for the laptop, one for Adobe Pro. Each `RITM` spawns concrete **Catalog Tasks (`SCTASK`)** assigned to different teams (Desktop Imaging images the laptop; License Admins provision Adobe). When all `SCTASK`s close, the `RITM` and `REQ` close cleanly!',
        '**Always Populate Configuration Item (CI)**: Linking the exact laptop, printer, or application (`Configuration item`) inside every ServiceNow Incident feeds live outage maps—so if `SAP-ERP-PROD` shows 40 linked `INC` records in 5 minutes, Major Incident Management sees the pattern instantly!',
      ],
    },

    deepDive: {
      intro:
        'Walk step-by-step through the ServiceNow Incident form and Service Operations Workspace workflow.',
      steps: [
        {
          step: 'Header & Caller',
          title: 'Number (`INC...`), Caller, Contact Type & Configuration Item (CI)',
          explanation:
            'Enter the **Caller** (the affected employee), choose **Contact type** (`Phone`, `Self-service`, `Walk-in`, `Chat`), and link the exact **Configuration item (CI)** (e.g., `WIN-LT-8841` or `Microsoft Outlook`) from the **CMDB**.',
        },
        {
          step: 'State & Priority',
          title: 'State Lifecycle & Automatic Impact × Urgency Priority',
          explanation:
            'ServiceNow computes **Priority (`1 - Critical` .. `5 - Planning`)** automatically from **Impact** + **Urgency**—agents rarely override Priority manually. States progress cleanly: `New` -> `In Progress` -> `On Hold` (choose Hold Reason: *Awaiting Caller*, *Awaiting Vendor*, *Awaiting Change*) -> `Resolved` -> `Closed`.',
        },
        {
          step: 'Routing',
          title: 'Assignment Group vs. Assigned To',
          explanation:
            'Always pick **Assignment group** first (e.g., `Service Desk L1`, `Network Operations`, `Endpoint Engineering`). Leave **Assigned to** blank when escalating to another team unless a specific named engineer agreed to take it—that way their team queue sees it immediately!',
        },
        {
          step: 'Notes Box',
          title: 'Work Notes (Yellow) vs. Additional Comments (Customer Visible)',
          explanation:
            'In ServiceNow, clicking the checkbox or tab for **Work notes** turns the box yellow (IT internal log ONLY). Unchecked **Additional comments** posts straight to the employee portal and emails the Caller. **Work notes** = internal forensic log; **Additional comments** = user-friendly updates.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'ServiceNow Record Types & Incident Form Key Fields',
        asciiFallback: `UNPLANNED BREAKAGE                   | STANDARD ORDER / ACCESS REQUEST
-------------------------------------|---------------------------------------
[INC] Incident                       | [REQ] Shopping Cart Request
  - Caller, Configuration Item (CMDB)|   +-- [RITM] Requested Item (e.g. Laptop)
  - Impact x Urgency -> Priority     |         +-- [SCTASK] Image & Ship Task
  - Assignment group + Assigned to   |   +-- [RITM] Requested Item (e.g. App)
  - State: New -> In Progress ->     |         +-- [SCTASK] Provision License
    On Hold (Awaiting Caller) ->     |
    Resolved -> Closed               |
                                     |
COMMENT BOX RULE: [x] Work notes (YELLOW = IT Private)  vs  Additional comments (USER VISIBLE!)`,
      },
      workedExample: {
        title: 'Worked ServiceNow Escalation: Routing a Switch-Port Outage to NetOps',
        context:
          'Caller reports their desk Ethernet jack on Floor 4 fails (`Media Disconnected`), while neighboring jacks work.',
        steps: [
          'Open new **Incident `INC0041205`**; set **Caller**, **Contact type: Phone**, and **Configuration item: Wall-Jack / Floor-4-Switch** (or user laptop CI).',
          'Set **State: In Progress**, **Assignment group: Service Desk Tier 1**, **Assigned to: [You]** while testing known-good patch cord and laptop Wi-Fi workaround.',
          'Record verified test results under **Work notes (yellow)**: `"Tested known-good Cat6 patch cord on Wall Jack 4-19; still no link light. Wi-Fi fallback confirmed working for user."`',
          'Switch **Assignment group** to `Network Operations`, **clear Assigned to** so NetOps dispatch sees it in their unassigned group queue, and post a reassuring **Additional comment** telling the Caller NetOps is checking the floor closet while they use Wi-Fi.',
        ],
        outcome:
          'NetOps gets an immediately actionable `INC` with zero wasted L1 questions, and the Caller never feels left in the dark.',
      },
    },

    supportWalkthrough: {
      intro:
        'Use these ServiceNow workspace disciplines on every shift.',
      steps: [
        {
          phase: 'Clear Assigned To on Escalation',
          action: 'When transferring `Assignment group` to another team, clear `Assigned to` unless handed off to a specific engineer.',
          whyItWorks: 'Prevents escalated tickets from sitting unseen under your old L1 personal filter while the new team checks unassigned group work.',
        },
        {
          phase: 'Pick Accurate Hold Reasons',
          action: 'Set `State = On Hold` and pick `Awaiting Caller` whenever waiting for user testing/replies.',
          whyItWorks: 'Pauses resolution SLAs cleanly and triggers automatic reminder/auto-close rules if configured.',
        },
        {
          phase: 'Check Related Search Results',
          action: 'Scan ServiceNow’s built-in Related Search / Agent Assist panel beside Short Description for matching KB articles or active Major Incidents.',
          whyItWorks: 'Catches known outages and one-click resolution KBs immediately.',
        },
      ],
      questionsToAsk: [
        '"Is there an active Parent Incident / Major Incident already linked to this outage that I should attach callers to?"',
        '"Which Assignment Group owns VPN vs. Active Directory lockouts in our ServiceNow directory?"',
      ],
      sampleUserWording: [
        {
          situation: 'Posting an Additional Comment before escalating a ServiceNow Incident',
          sayThis:
            '"Hi Jordan — Since replacing the desk patch cord didn’t restore link lights on Wall Jack 4-19, I’ve set up your laptop on corporate Wi-Fi so you can keep working uninterrupted and routed this to our Network Operations team to inspect the closet port."',
        },
      ],
      ticketNoteTemplate: {
        category: 'ServiceNow Category: Network | Subcategory: Wired / Wall Port',
        priorityFormula: 'Impact: 3 - Low × Urgency: 2 - Medium = Priority: 4 - Low (workaround active via Wi-Fi)',
        internalNotes: `[SERVICENOW WORK NOTES - YELLOW/INTERNAL] Caller on Floor 4 desk 19 reports wired link down. Confirmed known-good Cat6 cord tested; link LED dead. Verified corporate Wi-Fi active as interim workaround. Clearing Assigned To and routing Assignment Group -> Network Operations.`,
        customerReply:
          'Posted via Additional Comments (Customer Visible) confirming Wi-Fi workaround active and Network Operations inspecting Desk 4-19.',
        escalationCriteria:
          'Route Assignment Group to Network Operations with Work Notes + Wall Jack ID + confirmed workaround.',
      },
    },

    commonTraps: [
      {
        trap: 'Typing raw troubleshooting frustration or unverified suspicions into **Additional comments** instead of **Work notes**.',
        reality: '**Additional comments** go straight to the customer by email! Double-check the yellow **Work notes** indicator every single time.',
      },
      {
        trap: 'Changing `Assignment group` to `Network Operations` while leaving **your own name** inside `Assigned to`.',
        reality: 'If `Assigned to` still holds an L1 agent’s name, NetOps filters looking for unassigned group tickets can miss the escalation completely.',
      },
      {
        trap: 'Logging a brand-new employee laptop order as an `INC` (Incident) instead of a Service Catalog `REQ/RITM`.',
        reality: 'Nothing broke—new hardware/software orders belong in the **Service Catalog** so procurement approvals (`REQ -> RITM -> SCTASK`) trigger properly.',
      },
    ],

    keyTerms: [
      {
        term: 'CMDB & Configuration Item (CI)',
        shortDef: 'Central asset/service map inside ServiceNow linking Incidents to affected laptops, servers, or apps.',
        fullDef: 'Enables impact analysis and rapid detection when 30 incidents suddenly hit the same server CI.',
      },
      {
        term: 'REQ -> RITM -> SCTASK',
        shortDef: 'ServiceNow’s 3-tier fulfillment hierarchy: Cart Request -> Requested Item -> Fulfillment Tasks.',
        fullDef: 'Breaks one employee order smoothly across Imaging, Licensing, and Access teams.',
      },
      {
        term: 'Assignment Group',
        shortDef: 'Responsible IT queue owning an Incident or Catalog Task (e.g., `Service Desk L1`, `Network Ops`).',
        fullDef: 'Paired with `Assigned to` for individual accountability inside the owning team.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-922-q1',
        prompt: 'A new marketing coordinator needs Adobe Creative Cloud installed and approved by their manager. Which ServiceNow record hierarchy handles this standard service fulfillment?',
        options: [
          'Service Catalog Request (`REQ`) -> Requested Item (`RITM`) -> Catalog Task (`SCTASK`)',
          'Major Incident (`INC`) -> Post-Incident Review',
          'Problem Record (`PRB`) -> Known Error',
          'Emergency Change (`CHG`)',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Standard catalog software/hardware requests follow `REQ` (order) -> `RITM` (item) -> `SCTASK` (fulfillment task).',
          'Incorrect: Incidents track unplanned service interruptions, not planned approved orders.',
          'Incorrect: Problem records investigate recurring root causes.',
          'Incorrect: Emergency changes fix critical production infrastructure outages.',
        ],
        takeaway: 'Broken service = Incident (`INC`); planned catalog order = `REQ -> RITM -> SCTASK`.',
      },
      {
        id: 'itsup-922-q2',
        prompt: 'You escalate a ServiceNow Incident by changing **Assignment group** from `Service Desk L1` to `Messaging & M365`. What else should you normally check about the **Assigned to** field?',
        options: [
          'Clear **Assigned to** (unless a specific Tier 2 engineer agreed to take it) so the new group’s unassigned dispatch queue spots it immediately.',
          'Put the CEO’s name in Assigned to.',
          'Always leave your own L1 name inside Assigned to permanently.',
          'Delete the Caller field.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Clearing `Assigned to` ensures the ticket appears in the receiving group’s unassigned inbox instead of hiding under your personal name.',
          'Incorrect: Nonsense.',
          'Incorrect: Leaving an L1 agent in `Assigned to` often prevents Tier 2 triage queues from noticing the handoff.',
          'Incorrect: Never wipe out who reported the issue.',
        ],
        takeaway: 'When transferring Assignment Group, clear `Assigned to` unless coordinating directly with a named specialist.',
      },
      {
        id: 'itsup-922-q3',
        prompt: 'Why should agents consistently fill in the **Configuration item (CI)** field on ServiceNow Incidents?',
        options: [
          'It links the Incident to the exact asset or service in the CMDB so teams spot patterns, change collisions, and recurring device faults fast.',
          'It automatically buys a replacement laptop.',
          'It resets the caller’s Active Directory password.',
          'It turns Work notes into Additional comments.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Linking CIs connects Incidents to infrastructure changes, Problem records, and outage heatmaps inside the CMDB.',
          'Incorrect: Procurement goes through Catalog Requests.',
          'Incorrect: CI selection does not alter AD credentials.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Populate Configuration Item (CI) to connect tickets to real CMDB outage and asset analytics.',
      },
      {
        id: 'itsup-922-q4',
        prompt: 'In ServiceNow, you mark a waiting Incident **State = On Hold** because the user hasn’t replied to your troubleshooting email yet. Which **On Hold Reason** should you choose?',
        options: [
          'Awaiting Caller',
          'Awaiting Vendor',
          'Resolved Permanently',
          'Closed Complete',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `Awaiting Caller` accurately documents why work is paused and cleanly pauses SLA clocks.',
          'Incorrect: Use `Awaiting Vendor` only when an external third party (ISP, hardware warranty) owns the delay.',
          'Incorrect: Wait for verified resolution before moving to Resolved.',
          'Incorrect: Closed is final post-resolution lock.',
        ],
        takeaway: 'Match `On Hold Reason` (`Awaiting Caller`, `Awaiting Vendor`, `Awaiting Change`) accurately to keep SLA metrics truthful.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Walk Through a ServiceNow INC + REQ Escalation Flow',
      instructions: [
        'Draft a mock ServiceNow Incident (`Caller`, `CI`, `Assignment group`, `State`, yellow `Work notes`, `Additional comments`) for a broken conference-room projector.',
        'Trace how a new-hire monitor request flows separately as `REQ -> RITM -> SCTASK`.',
      ],
      verificationCheck: 'Clear split between `INC` vs `REQ/RITM/SCTASK`, `Assignment group` handoff clears `Assigned to`, and private logs sit strictly in `Work notes`.',
    },

    summaryBullets: [
      '**ServiceNow** anchors IT workflows on a unified **CMDB**, linking Incidents (`INC`) directly to **Configuration Items (CIs)**.',
      'Standard catalog orders flow cleanly through **Request (`REQ`) -> Requested Item (`RITM`) -> Catalog Task (`SCTASK`)**.',
      '**Work notes** (yellow) stay strictly internal; **Additional comments** email and display directly to the Caller.',
      'When transferring **Assignment group**, clear **Assigned to** unless handing off to a named specialist.',
      'Use **On Hold (`Awaiting Caller` / `Awaiting Vendor`)** accurately so SLAs stay honest.',
    ],

    sourcesToVerify: [
      'ServiceNow Product Documentation — Incident Management Lifecycle & Service Operations Workspace',
      'ServiceNow Product Documentation — Service Catalog (REQ, RITM, SCTASK) & CMDB Fundamentals',
    ],
  },

  'itsup.core.tools.zendesk': {
    id: 'itsup.core.tools.zendesk',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.2 Major ITSM & Ticketing Platforms',
    code: '9.2.3',
    title: 'Zendesk Support Tour (Tickets, Views, Macros, Triggers, Automations & Help Center)',
    readMinutes: 12,
    prerequisites: ['9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',

    learningObjectives: [
      'Navigate the **Zendesk Support** agent workspace cleanly: **Tickets**, **Views**, **Requester vs. Assignee**, **CCs/Followers**, and **Tags**.',
      'Apply **Public reply** (white editor) vs. **Internal note** (yellow editor) accurately and track Zendesk’s four classic statuses (`New`, `Open`, `Pending`, `On-hold`, `Solved`, `Closed`).',
      'Distinguish **Macros** (manual one-click agent shortcuts), **Triggers** (instant event-driven rules), and **Automations** (time-based background sweeps).',
      'Connect the **Zendesk Guide / Help Center** Knowledge Base to fast ticket resolution.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Fast-Growing Tech Companies, SaaS Support Teams & Lean Internal Desks Run on Zendesk',
      narrative:
        'Whereas giant banks love ServiceNow, fast-moving tech firms, ecommerce companies, and customer-facing SaaS support desks overwhelmingly choose **Zendesk Support**. Interviewers love asking Zendesk candidates a classic distinction question: *"What is the difference between a Macro, a Trigger, and an Automation?"* Answering that in 15 crisp seconds—plus mastering **Pending vs. On-hold** and **Public reply vs. Internal note**—sets you ahead of 90% of entry-level applicants.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Email on Steroids With Stamp Shortcuts, Motion Sensors, and Alarm Clocks',
      analogy:
        '**Zendesk Support** feels like a supercharged shared inbox designed so teammates never collide on replies. **Macros** are pre-built rubber stamps an agent clicks by hand (*insert password-reset steps + tag + set Pending in one click*). **Triggers** are instant motion sensors (*the exact second a ticket arrives with "VPN", assign Network Group*). **Automations** are time-based alarm clocks (*if a ticket stays in Pending with no customer reply for 72 hours, send a gentle nudge!*).',
      technicalDefinition:
        '**Zendesk Support** organizes customer and employee tickets into filtered **Views**, enforces distinct **Public reply** vs. **Internal note** channels, tracks lifecycle via **New / Open / Pending / On-hold / Solved / Closed**, and accelerates operations with **Macros** (agent-triggered templates), **Triggers** (event-based business rules), **Automations** (hourly time-based business rules), and **Zendesk Guide** Help Center articles.',
      paragraphs: [
        '**Watch Zendesk’s Unique Status Meanings (`Pending` vs. `On-hold` vs. `Solved`)**:\n• **New**: Unassigned, untouched ticket.\n• **Open**: Assigned to an agent—the ball is in **IT’s court**!\n• **Pending**: Waiting on the **Customer/Requester** (automatically shifts right back to `Open` the second the user replies!).\n• **On-hold**: Waiting on an **external third party/vendor** (not the customer).\n• **Solved**: Agent marked it fixed (can reopen if user replies within the grace period before locking permanently as **Closed**).',
        '**Prevent Agent Collisions**: Zendesk shows live eye-icon presence right inside a ticket when another agent has the same ticket open—never submit a reply over someone actively typing!',
      ],
    },

    deepDive: {
      intro:
        'Explore the Zendesk Support Workspace, Status rules, and the classic Macro vs Trigger vs Automation trio.',
      steps: [
        {
          step: 'Workspace & Views',
          title: 'Ticket Canvas, Views & Collision Indicators',
          explanation:
            'Left sidebar holds **Views** (*Your unsolved tickets*, *Unassigned tickets*). Inside a ticket, left panel displays **Requester**, **Assignee**, **Tags**, and **Form fields**; center panel shows chronological comments (**White = Public reply**, **Yellow = Internal note**); right panel holds **Knowledge (Zendesk Guide)** lookup.',
        },
        {
          step: 'Status Discipline',
          title: 'Mastering Open vs. Pending vs. On-hold vs. Solved',
          explanation:
            'Never leave a ticket in `Open` after asking the customer a question—submit it as **Pending** so your queue stays clean and SLAs pause properly. Use **On-hold** only when an ISP or hardware vendor owns the wait. Submit as **Solved** once verified.',
        },
        {
          step: 'The Rule Trio',
          title: 'Macros vs. Triggers vs. Automations',
          explanation:
            '1. **Macro**: Agent manually clicks it (inserts canned text + sets tags/status, previewable before Submit).\n2. **Trigger**: Fires **immediately upon ticket creation or update** (*IF Priority = Urgent -> Notify Slack*).\n3. **Automation**: Runs on a **hourly timer** (*IF Status = Pending for > 48 hours -> Send reminder email*).',
        },
        {
          step: 'Tags & Help Center',
          title: 'Reporting Tags & Knowledge Capture',
          explanation:
            'Zendesk relies heavily on **Tags** (`vpn_drop`, `mfa_reset`, `mac_os`) applied via Forms or Macros to power executive reports and Triggers. Agents also insert **Help Center** links directly into public replies in two clicks.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Zendesk Status Flow + Macro vs Trigger vs Automation',
        asciiFallback: `[New] ---> [Open (IT's turn)] ---> [Pending (Waiting on Customer)]
                   |      ^                  | (User replies -> back to Open!)
                   |      +------------------+
                   |---> [On-hold (Waiting on 3rd Party Vendor)]
                   |---> [Solved] ---> (Auto-locks after X days) ---> [Closed]

RULE TYPE    | WHEN DOES IT RUN?
-------------|----------------------------------------------------------------
MACRO        | Manually clicked by an Agent inside a ticket (speed + tags)
TRIGGER      | Instantly whenever a ticket is created or updated (event-based)
AUTOMATION   | Every hour when time-elapsed conditions match (time-based)`,
      },
      workedExample: {
        title: 'Worked Zendesk Flow: Resolving a Mac Password/SSO Ticket Using a Macro & Pending Status',
        context:
          'User emails `helpdesk@` saying their Okta session keeps prompting after a Mac password change.',
        steps: [
          'Open ticket from **Unassigned tickets** View; assign to yourself (`Open`).',
          'Run quick triage and type diagnostic summary inside the yellow **Internal note** tab.',
          'Click **Apply macro** -> select `Identity :: Okta Verify Re-sync` (populates warm numbered instructions, adds `okta_mfa` tag, and switches submit button to **Submit as Pending**).',
          'Customize the greeting personally so it never reads robotic, check the white **Public reply** border, and click **Submit as Pending**.',
          'When user replies `"Worked cleanly, thanks!"`, Zendesk pops ticket back to `Open`; mark **Submit as Solved**.',
        ],
        outcome:
          'Blazingly fast response without robotic copy-paste feel, accurate reporting tags, and clean SLA pause while waiting.',
      },
    },

    supportWalkthrough: {
      intro:
        'Follow these practical Zendesk Support best practices every day.',
      steps: [
        {
          phase: 'Personalize Macros',
          action: 'After applying a Zendesk Macro, always customize the greeting and reference the user’s specific context.',
          whyItWorks: 'Macros save typing errors—personalizing two words keeps CSAT scores warm and human.',
        },
        {
          phase: 'Respect Collision Detection',
          action: 'If you see a coworker’s avatar/eye icon viewing or typing in the same ticket, ping them in chat or grab the next ticket.',
          whyItWorks: 'Prevents two agents sending conflicting replies seconds apart.',
        },
        {
          phase: 'Check Tags Before Solving',
          action: 'Confirm Category/Issue fields and Tags are accurate before clicking **Submit as Solved**.',
          whyItWorks: 'Once a ticket transitions from Solved to **Closed**, Zendesk permanently locks it against edits.',
        },
      ],
      questionsToAsk: [
        '"If we’re waiting on Dell warranty shipping, should we submit the ticket as `On-hold` rather than `Pending`?"',
        '"Which shared Views should I monitor first at the start of my shift?"',
      ],
      sampleUserWording: [
        {
          situation: 'Sending a personalized Macro response cleanly',
          sayThis:
            '"Hi Devon — Thanks for flagging that Mac Okta loop right away! The quick 3-step refresh below usually clears cached keychain tokens cleanly—give it a quick try and let me know right here if it still prompts."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Zendesk Form: Identity & Access | Tag: okta_keychain_loop',
        priorityFormula: 'Priority: Normal | Status flow: New -> Open -> Pending -> Solved',
        internalNotes: `[ZENDESK INTERNAL NOTE - YELLOW] Checked Okta System Log: MacBook Safari holding stale session after AD password rotation. Sent personalized Okta re-sync instructions via Macro; tagged okta_keychain_loop.`,
        customerReply:
          'Posted via Public Reply (white tab) + Submit as Pending while Devon verifies clean Okta tile login.',
        escalationCriteria:
          'Reassign Group to Tier 2 Identity Engineering if Okta System Log shows device trust certificate mismatch.',
      },
    },

    commonTraps: [
      {
        trap: 'Putting a ticket in `Pending` when waiting for an external vendor (Dell, ISP) instead of the customer.',
        reality: 'In Zendesk, **Pending** means *waiting on the customer* (and may auto-nudge the customer via Automations!); use **On-hold** when waiting on a 3rd-party vendor.',
      },
      {
        trap: 'Mixing up **Triggers** and **Automations** in Zendesk admin interviews.',
        reality: '**Triggers** fire instantaneously on an event (created/updated); **Automations** run on a time-based hourly schedule (*"48 hours since solved"*).',
      },
      {
        trap: 'Trying to edit tags or add a missing field after Zendesk moves a ticket from **Solved** to **Closed**.',
        reality: '**Closed** tickets in Zendesk are immutable permanently; finish all fields while still `Open` or `Solved`.',
      },
    ],

    keyTerms: [
      {
        term: 'Macro (Zendesk)',
        shortDef: 'Reusable agent-clicked action bundling canned response text, tags, and field/status updates.',
        fullDef: 'Triggered manually by an agent; always customizable before submitting.',
      },
      {
        term: 'Trigger vs. Automation (Zendesk)',
        shortDef: 'Trigger = instant event-driven rule on create/update; Automation = hourly time-based rule.',
        fullDef: 'Classic Zendesk interview question separating reactive rules from time-elapsed sweeps.',
      },
      {
        term: 'Pending vs. On-hold',
        shortDef: 'Pending = waiting on requester/customer; On-hold = waiting on an external third party.',
        fullDef: 'Keeps customer auto-nudges accurate and IT queues uncluttered.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-923-q1',
        prompt: 'In **Zendesk Support**, what is the exact difference between a **Macro**, a **Trigger**, and an **Automation**?',
        options: [
          'A Macro is clicked manually by an agent; a Trigger fires instantly when a ticket is created/updated; an Automation runs on a time-based schedule.',
          'All three run exclusively once per year on December 31.',
          'Macros delete tickets, Triggers edit Active Directory, and Automations screen-share.',
          'Triggers require human clicks while Macros run in the background without agents.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Agent manual action (Macro) vs instant event rule (Trigger) vs scheduled time condition (Automation).',
          'Incorrect: Triggers are real-time and Automations sweep hourly.',
          'Incorrect: Completely inaccurate.',
          'Incorrect: Reversed definitions.',
        ],
        takeaway: 'Macro = manual click · Trigger = instant event · Automation = time elapsed.',
      },
      {
        id: 'itsup-923-q2',
        prompt: 'You ordered a replacement SSD from Dell Support on behalf of an employee and must wait 3 business days for the courier to deliver it. Which Zendesk ticket status fits best?',
        options: [
          'On-hold',
          'Pending',
          'Closed',
          'New',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `On-hold` specifically indicates waiting on an external third party rather than the requester.',
          'Incorrect: `Pending` means waiting on the customer and often sends customer follow-up reminders.',
          'Incorrect: Ticket is actively waiting for parts delivery, not finished.',
          'Incorrect: `New` means completely untriaged.',
        ],
        takeaway: 'Customer turn = `Pending` · External vendor turn = `On-hold`.',
      },
      {
        id: 'itsup-923-q3',
        prompt: 'An agent opens a Zendesk ticket to write a private note about suspicious sign-in logs. How does Zendesk visually confirm the comment stays hidden from the requester?',
        options: [
          'Selecting the **Internal note** tab turns the comment box **yellow** (whereas **Public reply** stays white).',
          'Typing the word PRIVATE at the top of a Public reply.',
          'Adding the requester in the CC box.',
          'Submitting the ticket as New.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Zendesk highlights Internal notes in unmistakable yellow and disables customer email delivery.',
          'Incorrect: Public replies ALWAYS email the requester regardless of words typed inside.',
          'Incorrect: Adding someone to CC emails them public updates!',
          'Incorrect: Doesn’t hide Public replies.',
        ],
        takeaway: 'In Zendesk, Yellow = Internal note (safe private log); White = Public reply (emails requester).',
      },
      {
        id: 'itsup-923-q4',
        prompt: 'Why is it important to finalize tags and category fields *before* a Solved Zendesk ticket automatically transitions to **Closed**?',
        options: [
          'Once a ticket moves to **Closed**, Zendesk permanently locks it so no further edits or tags can be added.',
          'Closed tickets delete the requester’s email account.',
          'Zendesk charges $50 to open a Closed ticket.',
          'Closed tickets immediately become public on Google.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `Closed` is an immutable archival state in Zendesk; only `Solved` tickets can still be updated or reopened.',
          'Incorrect: Does not touch user email accounts.',
          'Incorrect: No such fee.',
          'Incorrect: Tickets stay scoped to authorized workspace users.',
        ],
        takeaway: '`Solved` can still reopen or accept edits; `Closed` is permanently locked.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Design a Zendesk Macro + Automation Pair',
      instructions: [
        'Write down the text and status/tag actions for a `Password Reset Confirmed` Macro.',
        'Describe one Trigger (e.g., VIP tag escalation) and one Automation (48h Pending nudge) in plain English.',
      ],
      verificationCheck: 'Macro sets tags + `Pending`/`Solved` cleanly, Trigger reacts to instant create/update events, and Automation triggers on elapsed hours.',
    },

    summaryBullets: [
      '**Zendesk** groups tickets into **Views**, separates **Public reply** (white) from **Internal note** (yellow), and uses **Tags** for reporting.',
      'Master the 6 statuses: **New** (untouched), **Open** (IT’s turn), **Pending** (waiting on customer), **On-hold** (waiting on 3rd party), **Solved**, **Closed** (locked).',
      '**Macros** are agent-clicked templates; **Triggers** fire instantly on events; **Automations** fire on hourly timers.',
      'Always personalize Macros lightly and watch live agent-collision presence icons before submitting.',
      '**Zendesk Guide** connects Help Center articles directly into the agent reply sidebar for quick sharing.',
    ],

    sourcesToVerify: [
      'Zendesk Support Documentation — Understanding Ticket Statuses, Views, Macros, Triggers & Automations',
    ],
  },
};
