import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_TOOLS_B_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.core.tools.freshservice': {
    id: 'itsup.core.tools.freshservice',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.2 Major ITSM & Ticketing Platforms',
    code: '9.2.4',
    title: 'Freshservice Tour (Tickets, Service Catalog, Asset Inventory & Workflow Automator)',
    readMinutes: 12,
    prerequisites: ['9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',

    learningObjectives: [
      'Navigate **Freshservice** (Freshworks’ cloud ITSM platform) cleanly across the **Requester Self-Service Portal**, **Agent Ticket Views**, **Service Catalog**, and **Asset Inventory (CMDB)**.',
      'Separate **Add Note (Private)** from **Reply (Public)** and **Forward** inside a Freshservice ticket thread.',
      'Link physical laptops (`LT-218`) directly from Freshservice’s built-in **Asset Inventory / Discovery** into Incidents and Service Requests.',
      'Understand how visual no-code **Workflow Automator** blocks auto-route, seek manager approval, and trigger onboarding bundles.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Mid-Market Companies Choose Freshservice When ServiceNow Feels Too Heavy',
      narrative:
        'Thousands of 200-to-3,000-employee companies outgrow bare email/Zendesk queues yet want a modern ITIL service desk with built-in laptop asset tracking and approval workflows without needing three full-time consultants to maintain it. That exact sweet spot is **Freshservice**. Knowing how Freshservice links **Tickets -> Service Catalog -> Asset Inventory -> Workflow Automator** makes you productive on Day 1 at modern cloud-first IT teams.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an All-in-One Boutique Hotel Front Desk With Asset Tagging Built Straight Into the Register',
      analogy:
        'Instead of bolting a separate CMDB onto a separate help desk, **Freshservice** puts the user self-service menu (**Service Catalog**), front ticket board (**Tickets**), hardware closet ledger (**Asset Inventory**), and visual "if-this-then-that" rules (**Workflow Automator**) neatly inside one clean browser workspace.',
      technicalDefinition:
        '**Freshservice** is a cloud-native ITIL v4 ITSM suite pairing **Incident & Service Request Tickets** with an integrated **Service Catalog**, agent/agentless **IT Asset Management (ITAM / CMDB)**, **Canned Responses**, **Solutions (Knowledge Base)**, and visual drag-and-drop **Workflow Automator** orchestration.',
      paragraphs: [
        '**Watch the Freshservice Comment Buttons Carefully**: At the top of every Freshservice ticket sit three distinct buttons: **Reply** (emails the requester publicly), **Add note** (choose *Private note*—highlighted light yellow—versus *Public note*), and **Forward** (loops in an external vendor like ISP/warranty support without emailing the requester on every back-and-forth!).',
        '**Built-In Asset Linking Saves Huge Triage Time**: Because Freshservice includes native Discovery Agent / Intune / Jamf connectors, opening a ticket from `maya@company.com` lets you glance straight at the **Assets** card on the right sidebar—seeing Maya’s MacBook serial number, OS build, last check-in date, and warranty expiration without opening a second tab!',
      ],
    },

    deepDive: {
      intro:
        'Explore the four core Freshservice modules a frontline agent uses on every shift.',
      steps: [
        {
          step: '1. Ticket Workspace',
          title: 'Ticket Views, Reply vs. Private Note, Forward & Canned Responses',
          explanation:
            'Filter queues via **Ticket Views** (*All Unresolved*, *My Open & Pending*). Inside a ticket: use **Add note (Private)** for technical evidence, **Reply** + **Insert Canned Response** + **Insert Solution Article** for fast user updates, and **Forward** for external vendor repair threads.',
        },
        {
          step: '2. Service Catalog',
          title: 'Service Items, Manager Approvals & Multi-Department Onboarding',
          explanation:
            'Instead of messy free-text emails (*"Need stuff for new guy"*), users pick **Service Catalog** items (*"Request Monitor"*, *"Onboarding Bundle"*). Freshservice sends manager approval clicks directly inside email/Teams before spawning fulfillment tasks across IT, HR, and Facilities.',
        },
        {
          step: '3. Asset Inventory & CMDB',
          title: 'Attaching Assets Directly Inside Tickets',
          explanation:
            'Click **Associate Assets** on the right ticket panel to link the failing laptop, printer, or cloud SaaS app. Every future technician viewing that laptop’s Asset record sees its full repair history immediately (*"3rd dock replacement in 4 months -> swap motherboard"*).',
        },
        {
          step: '4. Workflow Automator',
          title: 'Visual Event -> Condition -> Action Flows',
          explanation:
            'Admins build drag-and-drop flows: *Event: Service Request raised -> Condition: Cost > $500 -> Action: Send Approval to Department Head -> If Approved: Assign Desktop Team & order via ITAM*. Agents see active workflow progress cleanly in the ticket activity log.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Freshservice All-in-One Workspace (Tickets + Assets + Service Catalog + Automator)',
        asciiFallback: `[Requester Portal] ---> Service Catalog Item / Incident
                              |
                              v
                 [Workflow Automator] (Auto-Route / Manager Approval)
                              |
                              v
[Freshservice Ticket] <---> [Built-In Asset Inventory / CMDB]
   |-- Reply (Customer)      |-- Laptop Serial / OS / Warranty / History
   |-- Add Note (Private!)   |-- Linked SaaS & Cloud Apps
   |-- Forward (3rd Party)   |-- Solutions KB & Canned Responses`,
      },
      workedExample: {
        title: 'Worked Freshservice Flow: Catching a Repeat Hardware Lemon via Asset Linking',
        context:
          'User submits a Freshservice ticket saying their laptop battery died again.',
        steps: [
          'Open the ticket and inspect the right-hand **Assets** panel—attach `LT-4412 (Dell Latitude)`.',
          'Click `LT-4412` to inspect its **Tickets / Impacted History** tab: discover two prior battery/motherboard tickets closed over the last 90 days!',
          'Document the pattern in **Add note (Private)**, click **Forward** to open a warranty escalation with Dell ProSupport without spamming the user, and send a warm **Reply** offering a pre-imaged loaner laptop while warranty repair proceeds.',
        ],
        outcome:
          'Built-in Asset history immediately surfaced a repeat lemon laptop instead of replacing a fourth battery blindly.',
      },
    },

    supportWalkthrough: {
      intro:
        'Keep these Freshservice shortcuts ready during live queues.',
      steps: [
        {
          phase: 'Associate the Asset',
          action: 'Always link the affected Asset (`LT-...`, printer, monitor) in the right panel before resolving.',
          whyItWorks: 'Builds accurate lifecycle failure tracking across the hardware fleet.',
        },
        {
          phase: 'Use Forward for Vendors',
          action: 'Use Freshservice **Forward** (not Reply) when chasing Dell, Apple, or ISP support on a user’s ticket.',
          whyItWorks: 'Keeps vendor troubleshooting replies organized inside one ticket thread without flooding the employee.',
        },
        {
          phase: 'Check Private vs Public Note',
          action: 'When clicking **Add note**, verify the toggle stays on **Private note** before typing sensitive internal checks.',
          whyItWorks: 'Freshservice lets agents create Public notes inside Add note too—always confirm the lock/Private badge.',
        },
      ],
      questionsToAsk: [
        '"Has our Freshservice Asset Inventory synced automatically from Intune/Jamf, or do we link serial numbers manually on walk-ups?"',
        '"Which Freshservice Canned Responses and Solution categories are our team’s gold standard?"',
      ],
      sampleUserWording: [
        {
          situation: 'Updating a user cleanly while waiting on forwarded Dell warranty repair',
          sayThis:
            '"Hi Priya — Because your laptop has already had two battery alerts recently, I’ve opened a warranty repair directly with the manufacturer on this same ticket and reserved a clean loaner laptop for you today so you won’t lose any work time."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Freshservice Category: Hardware | Subcategory: Laptop Battery / Power',
        priorityFormula: 'Impact: Low × Urgency: High (Primary workstation unusable) = High Priority',
        internalNotes: `[FRESHSERVICE PRIVATE NOTE] Linked Asset LT-4412. Asset history shows 2 prior power/battery replacements in 90 days. Forwarded warranty claim #DELL-88412 directly from ticket; preparing loaner LT-5008 via Desktop Support.`,
        customerReply:
          'Sent via Reply confirming loaner pickup ready and manufacturer warranty case underway.',
        escalationCriteria:
          'Assign Group -> Endpoint / Warranty Hardware Team if loaner imaging or asset retirement is required.',
      },
    },

    commonTraps: [
      {
        trap: 'Resolving hardware tickets in Freshservice without associating the physical **Asset** record.',
        reality: 'Unlinked tickets make it impossible for IT managers to spot failing laptop models or repeated dock defects during refresh budgeting.',
      },
      {
        trap: 'Clicking **Add note** and accidentally toggling **Notify requester / Public** instead of keeping it **Private**.',
        reality: 'Double-check the Private lock indicator every time before posting diagnostic comments.',
      },
    ],

    keyTerms: [
      {
        term: 'Freshservice Asset Inventory',
        shortDef: 'Built-in ITAM/CMDB ledger linking hardware serials, Intune/Jamf telemetry, and repair history inside tickets.',
        fullDef: 'Helps technicians catch repeat failing devices and manage warranties without jumping to a separate spreadsheet.',
      },
      {
        term: 'Workflow Automator',
        shortDef: 'Freshservice’s drag-and-drop Event -> Condition -> Action automation builder.',
        fullDef: 'Automates approvals, assignment rules, and multi-team onboarding tasks.',
      },
      {
        term: 'Forward (Freshservice)',
        shortDef: 'Loops external vendors (ISP, OEM warranty) into a ticket thread privately without spamming the requester.',
        fullDef: 'Keeps vendor correspondence anchored cleanly to the parent ticket.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-924-q1',
        prompt: 'Why should a technician always **Associate the Asset** (`LT-4412`) inside a Freshservice hardware ticket?',
        options: [
          'It ties the incident directly to the device’s serial number, warranty dates, and prior repair history so repeat failures stand out immediately.',
          'It voids the laptop’s warranty automatically.',
          'It resets the user’s Wi-Fi password.',
          'Freshservice deletes tickets without attached assets.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Asset linking powers repair-history visibility, repeat-lemon detection, and refresh budgeting.',
          'Incorrect: Linking protects warranty tracking rather than voiding it.',
          'Incorrect: Asset records do not change Wi-Fi credentials.',
          'Incorrect: Tickets save cleanly either way, yet lose vital lifecycle history.',
        ],
        takeaway: 'Link the failing laptop, printer, or app asset on every Freshservice ticket to build living hardware history.',
      },
      {
        id: 'itsup-924-q2',
        prompt: 'You need to email Dell ProSupport about a defective laptop motherboard from inside a Freshservice ticket *without* copying the end user on every technical vendor reply. Which button fits best?',
        options: [
          'Forward',
          'Public Reply to All',
          'Delete Ticket',
          'Resolve Immediately',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `Forward` tracks third-party vendor threads directly inside the ticket log cleanly.',
          'Incorrect: Public Reply emails the employee directly.',
          'Incorrect: Destroys ticket history.',
          'Incorrect: Issue is still waiting on parts.',
        ],
        takeaway: 'Use `Reply` for the customer, `Add note (Private)` for internal IT, and `Forward` for external vendors.',
      },
      {
        id: 'itsup-924-q3',
        prompt: 'In Freshservice, which visual tool lets IT admins automate *"When a software request costs over $300 -> require manager approval -> assign Procurement"* without writing code?',
        options: [
          'Workflow Automator',
          'Event Viewer',
          'Windows Registry',
          'Traceroute',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Freshservice’s drag-and-drop Workflow Automator handles Event -> Condition -> Action orchestration.',
          'Incorrect: Local Windows log viewer.',
          'Incorrect: Windows OS settings database.',
          'Incorrect: Network hop diagnostic CLI tool.',
        ],
        takeaway: 'Freshservice automates approvals and routing via its visual Workflow Automator.',
      },
      {
        id: 'itsup-924-q4',
        prompt: 'What helps Freshservice appeal strongly to mid-sized organizations moving up from basic email support?',
        options: [
          'It bundles ITIL ticketing, Service Catalog, built-in Asset Inventory/CMDB, and low-code automation inside one unified cloud interface.',
          'It works only on Windows 95.',
          'It forces every ticket to be written in raw C++.',
          'It prohibits Self-Service Knowledge Base articles.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Freshservice balances full ITIL + Asset Management capabilities with fast, accessible cloud setup.',
          'Incorrect: Browser-based SaaS platform.',
          'Incorrect: No-code UI + visual automator.',
          'Incorrect: Includes full Solutions KB self-service portal.',
        ],
        takeaway: 'Freshservice shines as an approachable all-in-one cloud ITSM + Asset Management suite.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Trace a Freshservice Multi-Team Onboarding Flow',
      instructions: [
        'Sketch how a single `"New Hire Bundle"` submission in Freshservice Service Catalog triggers manager approval, creates a laptop Asset task for IT, and opens a badge request for Facilities.',
      ],
      verificationCheck: 'Flow includes Service Catalog item -> Workflow Automator approval -> parallel department fulfillment tasks + Asset assignment.',
    },

    summaryBullets: [
      '**Freshservice** combines ITIL ticketing, **Service Catalog**, **Solutions KB**, built-in **Asset Inventory/CMDB**, and **Workflow Automator**.',
      'Keep communication channels straight: **Reply** (customer), **Add note -> Private** (IT internal), **Forward** (external vendor).',
      'Always **Associate Assets** on hardware/software tickets to surface warranty status and repeat-failure patterns.',
      'Use **Canned Responses** and **Solution Articles** to accelerate consistent L1 answers without sounding robotic.',
      'Visual **Workflow Automator** handles approvals and ticket routing cleanly across IT, HR, and Facilities.',
    ],

    sourcesToVerify: [
      'Freshworks Freshservice Documentation — Ticketing, Asset Management (ITAM/CMDB) & Workflow Automator',
    ],
  },

  'itsup.core.tools.manageengine': {
    id: 'itsup.core.tools.manageengine',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.2 Major ITSM & Ticketing Platforms',
    code: '9.2.5',
    title: 'ManageEngine ServiceDesk Plus Tour (Requests, Technicians, AD Integration & CMDB)',
    readMinutes: 12,
    prerequisites: ['9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',
    verifyFlag: 'Verify current ServiceDesk Plus Cloud vs On-Premises module labels.',

    learningObjectives: [
      'Navigate **ManageEngine ServiceDesk Plus (SDP)** across its core tabs: **Requests**, **Problems**, **Changes**, **Assets/CMDB**, and **Solutions**.',
      'Understand why Windows/Active Directory-centric schools, hospitals, and mid-size enterprises favor **ServiceDesk Plus** (especially its **On-Premises** and **ADManager/ADSelfService Plus** integrations).',
      'Use **Incident & Service Request Templates**, **Technician Groups**, **Requester self-service AD resets**, **Business Rules**, and **Private Notes vs. Reply** accurately.',
      'Note key practical differences between **ServiceDesk Plus Cloud** and **ServiceDesk Plus On-Premises** builds.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Local Governments, Manufacturing Plants, Schools & Hospitals Run ManageEngine On-Premises',
      narrative:
        'Not every IT shop wants—or is legally allowed—to push every internal ticket and workstation inventory record into multi-tenant public cloud SaaS. **ManageEngine ServiceDesk Plus (SDP)** is a powerhouse across K-12 districts, healthcare networks, factories, and mid-size Windows-heavy IT departments specifically because it offers BOTH Cloud and hardened **On-Premises** installations integrated tightly with **Active Directory** and **Endpoint Central**.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an On-Site IT Command Center Wired Directly Into Your Active Directory Server',
      analogy:
        'Whereas pure cloud tools sit outside your office firewall, **ManageEngine ServiceDesk Plus** (especially On-Premises) can sit right inside your company’s own data center next to Active Directory—meaning **Tickets ("Requests")**, **Technician Groups**, **Hardware Scans**, **Patch Management**, and **AD Password Self-Service** all share one familiar Windows-friendly ecosystem.',
      technicalDefinition:
        '**ManageEngine ServiceDesk Plus (SDP)** is an ITIL-certified ITSM suite (available **On-Premises** or **Cloud**) organizing work as **Requests** (Incidents and Service Catalog items) assigned to **Technicians** and **Support Groups**, paired tightly with **ADManager Plus / ADSelfService Plus**, **Endpoint Central** UEM, **Templates**, **SLAs**, **Business Rules**, and a built-in **CMDB**.',
      paragraphs: [
        '**Watch ManageEngine’s Vocabulary (`Request`, `Technician`, `Requester`)**: What ServiceNow calls `Caller` and `Incident`, SDP universally calls **Requester** and **Request** inside the top **Requests** module—separated cleanly into **Incident Templates** vs. **Service Templates** inside the Self-Service Portal.',
        '**Cloud vs. On-Premises Note**: In **ServiceDesk Plus On-Premises**, IT hosts the application server and database locally behind company firewalls (often requiring VPN access for remote techs); in **ServiceDesk Plus Cloud** (Zoho/ManageEngine hosted), IT accesses SDP via HTTPS anywhere and uses lightweight cloud probes/integrations to talk back to AD.',
      ],
    },

    deepDive: {
      intro:
        'Tour the core screens of ManageEngine ServiceDesk Plus and its tight Active Directory integration.',
      steps: [
        {
          step: '1. Requests Module',
          title: 'Request List Views, Incident vs. Service Templates & Conversations',
          explanation:
            'Frontline techs live inside the **Requests** tab, sorting by Views (*Unassigned*, *My Open Requests*, *Due Today*). Every ticket opens into **Details** (Requester, Site, Impact/Urgency, **Technician Group**, **Technician**), **Conversations** (**Reply** vs. **Add Note** [Private vs Notify]), **Tasks**, and **Resolution** tab.',
        },
        {
          step: '2. Templates & Field Rules',
          title: 'Standardizing Intake With Request Templates & Form Rules',
          explanation:
            'SDP **Incident Templates** and **Service Templates** pre-fill Category, Technician Group, Priority, and Checklist Tasks (e.g., *New Employee Onboarding Template* auto-generates 5 sub-tasks: Create AD User, Assign M365 License, Image Laptop, Issue Badge, Desk Setup).',
        },
        {
          step: '3. AD & Endpoint Ecosystem',
          title: 'Active Directory Self-Service & Endpoint Central Links',
          explanation:
            'When paired with ManageEngine **ADSelfService Plus** / **ADManager Plus** and **Endpoint Central**, agents can launch remote desktop control, view installed software, trigger password resets/unlocks, and inspect Windows AD attributes directly from inside the Request sidebar.',
        },
        {
          step: '4. Assets & CMDB',
          title: 'Built-In Network Scanning & Relationship Mapping',
          explanation:
            'SDP scans local subnets (via WMI/SSH/SNMP or endpoint agents) to populate **Assets** and build **CMDB** dependency maps (*Switch-Floor2 -> FileServer-01 -> Finance Shares*) linked straight to Requests and Changes.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'ManageEngine ServiceDesk Plus Core Flow & Windows/AD Integration',
        asciiFallback: `[Requester] ---> Picks Incident / Service Template (Self-Service Portal)
                      |
                      v
[Requests Queue] -> Technician Group -> Technician + Checklist Tasks
   |-- Conversations Tab: [Reply (Customer)] vs [Add Note (Private!)]
   |-- Resolution Tab: Root Cause Summary + Link to Solutions KB
   |
   +--> Integrated Ecosystem (ADManager / ADSelfService / Endpoint Central / CMDB)`,
      },
      workedExample: {
        title: 'Worked SDP Case: Completing a Multi-Task Onboarding Service Template',
        context:
          'HR submits a Service Request using the *"New Employee Onboarding"* template for a Finance Analyst starting Monday.',
        steps: [
          'Open the **Request** inside **Requests** queue; notice SDP’s Template already assigned **Technician Group: Identity & Desktop** and attached 4 structured **Tasks**.',
          'Complete Task 1 (AD + M365 provisioning via integrated AD console) and Task 2 (assign imaged laptop Asset `FIN-LT-310` in the **Assets** link).',
          'Log exact username/asset tag confirmations inside **Add Note (Show to requester: OFF / Private)**.',
          'Fill the **Resolution** tab cleanly with onboarding completion summary and transition Status to **Resolved** (notifying HR + hiring manager via **Reply**).',
        ],
        outcome:
          'Zero missed onboarding steps thanks to Template checklists, clean Asset custody tracking, and private internal verification logs.',
      },
    },

    supportWalkthrough: {
      intro:
        'Follow these practical ManageEngine ServiceDesk Plus habits.',
      steps: [
        {
          phase: 'Pick Specific Templates',
          action: 'When logging phone tickets manually (+ New Request), choose the matching Incident or Service Template rather than Default Request.',
          whyItWorks: 'Templates fire proper Technician Group routing, SLAs, and subtask checklists automatically.',
        },
        {
          phase: 'Fill the Resolution Tab',
          action: 'Record clean root-cause resolution summaries inside the dedicated **Resolution** tab before closing.',
          whyItWorks: 'SDP lets technicians convert strong Resolutions directly into **Solutions (Knowledge Base)** articles with one click!',
        },
        {
          phase: 'Watch Private Note Checkboxes',
          action: 'Confirm **Show this note to requester** remains UNCHECKED on internal **Add Note** entries.',
          whyItWorks: 'Keeps internal technician hypotheses hidden safely from end users.',
        },
      ],
      questionsToAsk: [
        '"Do we run ServiceDesk Plus On-Premises behind VPN or Cloud—and is Endpoint Central / ADManager linked directly in the Request sidebar?"',
        '"Which Resolution Codes are mandatory before marking a Request Resolved?"',
      ],
      sampleUserWording: [
        {
          situation: 'Confirming a completed SDP Service Request cleanly to the hiring manager',
          sayThis:
            '"Hi Jordan — All onboarding tasks for your new Finance Analyst are complete! Laptop `FIN-LT-310` is imaged and ready for Monday pickup, and login instructions have been queued per HR policy."',
        },
      ],
      ticketNoteTemplate: {
        category: 'SDP Service Template: Employee Onboarding | Group: Service Desk / Identity',
        priorityFormula: 'SLA: Standard 3-Business-Day Onboarding Fulfillment',
        internalNotes: `[SDP PRIVATE NOTE - SHOW TO REQUESTER: OFF] Verified all 4 template subtasks complete. Assigned Asset FIN-LT-310 in SDP CMDB; confirmed AD OU placement + MFA enrollment readiness.`,
        customerReply:
          'Sent via Reply + Resolution summary confirming Monday Day-1 hardware & account readiness.',
        escalationCriteria:
          'Assign missing App Access subtask to ERP Application Owner Technician Group.',
      },
    },

    commonTraps: [
      {
        trap: 'Accidentally ticking **"Show this note to requester"** inside `Add Note` when writing technical or sensitive observations.',
        reality: 'Checking that box turns a private internal note into a customer-visible comment.',
      },
      {
        trap: 'Resolving a Request with `"Fixed"` in the **Resolution** tab instead of writing a reusable summary.',
        reality: 'Clean **Resolution** notes feed ManageEngine’s one-click **Convert to Solution (KB)** workflow.',
      },
    ],

    keyTerms: [
      {
        term: 'ManageEngine ServiceDesk Plus (SDP)',
        shortDef: 'ITIL service desk suite (Cloud or On-Premises) known for tight Windows Active Directory and Endpoint Central integration.',
        fullDef: 'Uses Requests, Technicians, Technician Groups, Incident/Service Templates, and built-in CMDB scanning.',
      },
      {
        term: 'Incident vs. Service Template (SDP)',
        shortDef: 'Pre-configured intake forms separating unplanned break/fix faults from multi-task planned service requests.',
        fullDef: 'Automatically enforces SLAs, mandatory fields, approvals, and fulfillment sub-tasks.',
      },
      {
        term: 'Resolution Tab (SDP)',
        shortDef: 'Dedicated structured summary panel documenting root cause/fix and convertible directly into Solutions KB articles.',
        fullDef: 'Keeps final verified fixes cleanly separated from noisy back-and-forth troubleshooting chats.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-925-q1',
        prompt: 'Why do many school districts, hospitals, and Windows-centric enterprises specifically choose **ManageEngine ServiceDesk Plus**?',
        options: [
          'It offers both Cloud and **On-Premises** deployment options with tight integration into **Active Directory** and Endpoint Central.',
          'It runs exclusively without any database or tickets.',
          'It replaces Microsoft Windows itself.',
          'It prohibits Asset/CMDB tracking.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: On-Premises hosting control plus deep AD/Endpoint integration are ServiceDesk Plus’s signature strengths.',
          'Incorrect: Full relational database ITSM tool.',
          'Incorrect: Runs atop Windows/Linux servers to support Windows/macOS/Linux fleets.',
          'Incorrect: Includes native asset scanning and CMDB.',
        ],
        takeaway: 'ServiceDesk Plus shines in Windows/AD-heavy environments and organizations requiring On-Premises hosting.',
      },
      {
        id: 'itsup-925-q2',
        prompt: 'When recording a private internal note inside ManageEngine ServiceDesk Plus (`Add Note`), which checkbox setting ensures the end user CANNOT read it?',
        options: [
          'Leave **"Show this note to requester"** UNCHECKED.',
          'Add the requester to CC.',
          'Use the **Reply** button instead.',
          'Put `"INTERNAL"` in the ticket Subject line.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Unchecked `"Show this note to requester"` keeps the note strictly private to technicians.',
          'Incorrect: CC emails users publicly.',
          'Incorrect: `Reply` sends email straight to the requester.',
          'Incorrect: Subject lines are always public.',
        ],
        takeaway: 'Always verify `"Show this note to requester"` is OFF for private technician notes in SDP.',
      },
      {
        id: 'itsup-925-q3',
        prompt: 'Why should technicians write clear, accurate steps inside ServiceDesk Plus’s **Resolution** tab rather than burying the final fix inside random comments?',
        options: [
          'SDP isolates the final verified fix cleanly and allows one-click conversion into a **Solutions (Knowledge Base)** article.',
          'Comments are deleted after 24 hours.',
          'Only Resolution text can contain numbers.',
          'Resolution text automatically orders replacement hardware.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Clean Resolution tabs feed future ticket search and direct Solutions KB publishing.',
          'Incorrect: Conversation threads remain archived.',
          'Incorrect: Any text field accepts numbers.',
          'Incorrect: Hardware orders follow Service Templates.',
        ],
        takeaway: 'Write crisp Resolution summaries in SDP so teammates find the answer in 5 seconds—and publish great ones to Solutions KB.',
      },
      {
        id: 'itsup-925-q4',
        prompt: 'What is a key difference a support technician notices between **ServiceDesk Plus Cloud** and **ServiceDesk Plus On-Premises**?',
        options: [
          'On-Premises runs on an internal company server (often requiring VPN/LAN access for techs), while Cloud runs on hosted HTTPS SaaS accessible from anywhere.',
          'On-Premises only works on Android phones.',
          'Cloud does not support Request templates.',
          'On-Premises prohibits Active Directory integration.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Hosting location affects remote access paths (VPN vs HTTPS) and how AD/endpoint probes communicate.',
          'Incorrect: Full web browser UI on both.',
          'Incorrect: Both support Incident and Service Templates.',
          'Incorrect: On-Premises integrates especially directly with local AD.',
        ],
        takeaway: 'Know whether your employer hosts SDP On-Premises (behind VPN/firewall) or Cloud (SaaS HTTPS).',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Convert a ServiceDesk Plus Resolution Note Into a Solutions KB Draft',
      instructions: [
        'Take any resolved printer or Wi-Fi fix from earlier units and write a clean 4-line **Resolution tab** entry (Symptom -> Root Cause -> Exact Fix -> Verification) suitable for promoting straight into a Solutions KB.',
      ],
      verificationCheck: 'Resolution entry is scannable in 15 seconds and clearly separates root cause from troubleshooting chatter.',
    },

    summaryBullets: [
      '**ManageEngine ServiceDesk Plus (SDP)** organizes tickets as **Requests** assigned to **Technicians** and **Technician Groups**.',
      'Available in both **On-Premises** (popular in schools, hospitals, government) and **Cloud** deployments.',
      'Uses **Incident Templates** and **Service Templates** to standardize fields, SLAs, approvals, and multi-task checklists.',
      'Tight integration with **ADManager/ADSelfService Plus**, **Endpoint Central**, and built-in **Asset/CMDB** scanning streamlines Windows admin work.',
      'Verify `"Show this note to requester"` stays unchecked on private notes and write clear **Resolution** tabs ready for Solutions KB.',
    ],

    sourcesToVerify: [
      'ManageEngine ServiceDesk Plus Documentation — Requests, Incident/Service Templates, Notes, Resolution & CMDB',
    ],
  },

  'itsup.core.tools.opensource': {
    id: 'itsup.core.tools.opensource',
    moduleId: 'it-support',
    unitTitle: 'Unit 9: Help Desk Tools Tour',
    topicTitle: '9.2 Major ITSM & Ticketing Platforms',
    code: '9.2.6',
    title: 'Open-Source Comparison Cards: osTicket & GLPI',
    readMinutes: 10,
    prerequisites: ['9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',

    learningObjectives: [
      'Compare two widely deployed open-source help desk platforms side by side: **osTicket** (lightweight email-to-ticket queue) and **GLPI** (full ITIL ITSM + automated hardware/software asset & CMDB powerhouse).',
      'Identify when a small business, nonprofit, school, or budget-conscious IT team chooses **osTicket** vs. **GLPI**—or builds a home lab on them for zero licensing cost!',
      'Translate internal notes (`Post Internal Note` in osTicket; `Private Followup / Task` in GLPI) cleanly without slipping.',
    ],

    whyThisMatters: {
      scenarioTitle: 'No Expensive License Required: How Open-Source Tools Power Real IT Shops—and Your Home Study Lab',
      narrative:
        'Big enterprise tools like ServiceNow or Jira Service Management can cost thousands of dollars a year—too steep for a 40-person nonprofit, local clinic, or growing startup. That’s where open-source tools like **osTicket** and **GLPI** shine! Even better: you can install **osTicket** or **GLPI** on a spare laptop or Docker container at home for free to practice real ticket routing and asset tracking before an interview.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Simple Digital Clipboard (osTicket) vs. a Full Workshop ERP (GLPI)',
      analogy:
        '**osTicket** is like a clean, fast clipboard that turns messy emails into numbered tickets routed cleanly to departments with zero bloat. **GLPI** is a full free workshop management suite: not only does it track full ITIL Incidents, Changes, Problems, and SLAs, its built-in **GLPI Agent** automatically scans every office PC to record exact CPU, RAM, serial number, installed apps, and software licenses into its own free **CMDB**!',
      technicalDefinition:
        '**osTicket** is a lightweight PHP/MySQL open-source ticketing system centered on email piping, custom Help Topics, Departments, Teams, and **Post Internal Note** vs **Post Reply**. **GLPI** (*Gestionnaire Libre de Parc Informatique*) is a comprehensive open-source **ITAM + ITIL ITSM** platform featuring automated hardware/software inventory via **GLPI Agent**, **CMDB**, **Incident/Problem/Change** tracking, and **Private Followups**.',
      paragraphs: [
        '**osTicket Card (Simple, Fast, Email-First)**:\n• **Best for**: Small IT teams (< 15 techs), nonprofits, schools, or customer-support desks graduating out of a shared Outlook inbox.\n• **Core Concepts**: **Help Topics** (*"Wi-Fi Issue"*, *"New Account"*) route tickets to **Departments** (`IT Support`, `Facilities`). Inside every ticket sit crisp **Post Reply** (green) vs. **Post Internal Note** (yellow) tabs, plus **Canned Responses** and SLA plans.',
        '**GLPI Card (Full Free ITAM + ITIL Suite)**:\n• **Best for**: Organizations wanting **free automated PC/Mac inventory + software license auditing + ITIL ticketing** together (often replacing expensive paid CMDBs).\n• **Core Concepts**: Install **GLPI Agent** (or FusionInventory) across PCs -> computers auto-populate in **Assets** -> link tickets straight to exact computers (`Monitors`, `Printers`, `Network Devices`), track **Private Followups** (lock icon), and audit Problem/Change lifecycles.',
      ],
    },

    deepDive: {
      intro:
        'Compare osTicket and GLPI head-to-head across setup weight, asset tracking, and daily agent workflows.',
      steps: [
        {
          step: 'Card 1: osTicket',
          title: 'osTicket — Lightweight Ticketing & Help Topics',
          explanation:
            'Turns incoming `support@` emails or web-portal **Help Topics** into tracked tickets -> routes to **Departments / Teams / Agents** -> tracks SLAs cleanly -> separates green **Post Reply** from yellow **Post Internal Note** -> zero complex CMDB overhead.',
        },
        {
          step: 'Card 2: GLPI',
          title: 'GLPI — Deep Asset Inventory (ITAM) + Full ITIL Service Desk',
          explanation:
            'Combines native **GLPI Agent** endpoint scanning (CPU, BIOS serial, installed software, BitLocker status, network SNMP discovery) with **Incidents**, **Requests**, **Problems**, **Changes**, **Contracts/Warranties**, and a built-in Knowledge Base.',
        },
        {
          step: 'Decision Guide',
          title: 'Choosing Between osTicket, GLPI & Commercial SaaS',
          explanation:
            'Pick **osTicket** when you just need clean, zero-cost ticket queues fast. Pick **GLPI** when you need automated hardware/license inventory (`"Which 14 laptops still have 8 GB RAM?"`) tied directly to ITIL tickets. Note: self-hosted open source eliminates per-agent SaaS fees yet requires your IT team to handle server backups, PHP/DB patching, and SSL certificates.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Open-Source Comparison Cards: osTicket vs. GLPI',
        asciiFallback: `+------------------------------------+---------------------------------------+
|            osTicket                |                 GLPI                  |
+------------------------------------+---------------------------------------+
| Focus: Clean Email/Portal Tickets  | Focus: Full ITAM/CMDB + ITIL ITSM     |
| Routing: Help Topics -> Departments| Routing: Categories -> Groups/ITIL    |
| Assets: None built-in (needs extra)| Assets: Native GLPI Agent auto-scan!  |
| Private: Post Internal Note (Yell.)| Private: Followup -> Private lock ON  |
| Sweet Spot: Small teams escaping   | Sweet Spot: Budget-lean orgs needing  |
|   shared email inboxes fast        |   free asset inventory + full ITIL    |
+------------------------------------+---------------------------------------+`,
      },
      workedExample: {
        title: 'Worked Comparison: Answering "Which Open-Source Tool Should Our 120-PC School District Deploy?"',
        context:
          'A school IT coordinator has zero SaaS budget and needs both teacher help tickets AND automatic tracking of 120 lab desktops and projectors.',
        steps: [
          'Evaluate **osTicket**: Solves teacher email-to-ticket queues cleanly in 1 hour, yet leaves the 120 PCs tracked manually in a separate spreadsheet.',
          'Evaluate **GLPI**: Installing **GLPI Agent** on the 120 lab PCs auto-discovers serial numbers, RAM, OS patches, and installed apps directly into **Assets**, linking every teacher ticket straight to the exact failing PC.',
          'Verify maintenance plan: schedule automated nightly VM/MySQL backups and security patching on the Linux server hosting GLPI.',
        ],
        outcome:
          'Recommended **GLPI** cleanly because integrated hardware asset discovery eliminated duplicate spreadsheet upkeep.',
      },
    },

    supportWalkthrough: {
      intro:
        'Keep these habits sharp when working in osTicket, GLPI, or building your own home practice lab.',
      steps: [
        {
          phase: 'Check Private Toggle',
          action: 'In **osTicket**, pick the yellow **Post Internal Note** tab; in **GLPI**, click the **Private padlock icon** on Followups/Tasks.',
          whyItWorks: 'Prevents internal observations from emailing out to requesters.',
        },
        {
          phase: 'Link Hardware in GLPI',
          action: 'Always attach the associated PC/Printer item under **Items** inside a GLPI ticket.',
          whyItWorks: 'Creates full repair-cost and failure-rate history per machine.',
        },
        {
          phase: 'Build a Home Lab Copy',
          action: 'Spin up osTicket or GLPI locally via Docker/VM and practice walking through 5 mock tickets end to end.',
          whyItWorks: 'Gives you real hands-on screen familiarity you can discuss honestly in interviews.',
        },
      ],
      questionsToAsk: [
        '"If we host open-source GLPI/osTicket internally, who owns server OS patching and automated database backups?"',
        '"Is GLPI Agent deployed across all endpoints so Assets update automatically?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining self-service portal use on osTicket or GLPI simply to staff',
          sayThis:
            '"Instead of emailing IT directly where requests can get buried, pick your exact issue from the Help Topic dropdown on our support portal—it routes straight to the right technician with all the details we need to help fast!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'GLPI Type: Incident | Linked Asset: LAB-PC-042 | Category: Hardware -> Storage',
        priorityFormula: 'Medium Urgency × Low Impact = Priority: Low/Medium',
        internalNotes: `[GLPI PRIVATE FOLLOWUP - PADLOCK ON] GLPI Agent hardware scan confirmed SMART SSD wear warning on LAB-PC-042 (Serial 9X42Q). Scheduled spare NVMe swap after 3:30 PM class bell.`,
        customerReply:
          'Public Followup sent to teacher confirming after-school SSD swap window at 3:30 PM so zero class time is interrupted.',
        escalationCriteria:
          'Convert to Problem Record in GLPI if GLPI Agent flags identical SSD SMART failures across the same classroom batch.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming "free open-source software" means zero ongoing engineering cost.',
        reality: 'No per-seat license fee is real, yet internal IT still owns server hosting, backups, TLS certs, and security updates.',
      },
      {
        trap: 'Forgetting to click the **Private** padlock on a GLPI Followup before typing internal notes.',
        reality: 'By default, GLPI Followups may be public unless Private is toggled ON—check the lock icon every time.',
      },
    ],

    keyTerms: [
      {
        term: 'osTicket',
        shortDef: 'Lightweight PHP/MySQL open-source ticketing platform turning emails and Help Topics into queued tickets.',
        fullDef: 'Great fit for smaller teams graduating beyond shared email inboxes without complex CMDB needs.',
      },
      {
        term: 'GLPI',
        shortDef: 'Full open-source ITAM (Asset Management) + ITIL ITSM suite powered by automatic endpoint discovery.',
        fullDef: 'Links Incidents/Problems/Changes straight to hardware & software records scanned by GLPI Agent.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-926-q1',
        prompt: 'A 150-person organization with zero software licensing budget wants **both** an ITIL ticketing desk **and** automated endpoint hardware/software inventory scanning. Which open-source tool matches best?',
        options: [
          'GLPI (with GLPI Agent)',
          'osTicket alone (without external asset plugins)',
          'Microsoft Notepad',
          'Ping utility',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: GLPI natively combines ITIL Incidents/Problems/Changes with automated ITAM/CMDB hardware and software discovery.',
          'Incorrect: osTicket focuses purely on lightweight ticketing/queues and lacks native endpoint hardware scanning.',
          'Incorrect: Plain text editor.',
          'Incorrect: Network reachability diagnostic tool.',
        ],
        takeaway: 'osTicket = lightweight ticket queues · GLPI = full free ITAM/CMDB + ITIL service desk.',
      },
      {
        id: 'itsup-926-q2',
        prompt: 'In **osTicket**, how do you keep diagnostic troubleshooting steps hidden from the ticket requester?',
        options: [
          'Select the yellow **Post Internal Note** tab instead of **Post Reply**.',
          'Use **Post Reply** in uppercase letters.',
          'Put the ticket in Overdue status.',
          'Email the user directly.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `Post Internal Note` stays strictly inside the agent/team thread without notifying the requester.',
          'Incorrect: `Post Reply` always sends externally.',
          'Incorrect: Status alone does not hide public replies.',
          'Incorrect: Direct email exposes text to the user.',
        ],
        takeaway: 'osTicket: green `Post Reply` = customer · yellow `Post Internal Note` = internal IT.',
      },
      {
        id: 'itsup-926-q3',
        prompt: 'What operational responsibility MUST an IT team plan for when self-hosting open-source tools like **osTicket** or **GLPI** compared to SaaS tools?',
        options: [
          'Managing server uptime, database backups, TLS certificates, and PHP/OS security patching internally.',
          'Paying per-ticket SaaS fees to Atlassian.',
          'Asking end users to write SQL queries manually.',
          'Disabling MFA across the whole company.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Self-hosted open source eliminates subscription fees while shifting hosting, patching, and backup duties to your team.',
          'Incorrect: No Atlassian fees apply.',
          'Incorrect: Portal forms hide database complexity cleanly.',
          'Incorrect: Self-hosted tools should still integrate SSO/MFA cleanly.',
        ],
        takeaway: '"Free open source" saves license spend—never skip server backups and security patching.',
      },
      {
        id: 'itsup-926-q4',
        prompt: 'How can an aspiring Help Desk candidate with zero enterprise job experience use **osTicket** or **GLPI** to stand out ethically before interviews?',
        options: [
          'Install osTicket or GLPI in a local home lab, simulate real intake/SLAs/asset linking, and explain the live workflow you built honestly.',
          'Lie on your resume claiming you administrated GLPI at a Fortune 100 firm.',
          'Avoid touching any ticketing interface until hired.',
          'Memorize random SQL passwords.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Building a real home-lab ticketing/asset server proves initiative, honest hands-on skill, and solid ITSM workflow fluency.',
          'Incorrect: Resume fabrication destroys trust fast.',
          'Incorrect: Hands-on home labs build immediate confidence.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Spinning up osTicket or GLPI in a home lab turns theory into real hands-on workflow confidence.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Home Lab Choice: Draft Your Local ITSM + Asset Practice Setup',
      instructions: [
        'Compare osTicket vs. GLPI for a personal home lab: list 3 ticket categories (`Password Reset`, `Wi-Fi Drop`, `Broken Hardware`) and note whether you want integrated asset tracking (`GLPI`) or pure queue speed (`osTicket`).',
      ],
      verificationCheck: 'Clear trade-off comparison linking business needs (pure ticketing vs integrated ITAM/CMDB + hosting upkeep).',
    },

    summaryBullets: [
      '**osTicket** excels as a fast, lightweight open-source ticket queue (Help Topics -> Departments; **Post Internal Note** vs **Post Reply**).',
      '**GLPI** delivers a complete free **ITAM + ITIL ITSM** suite with automated **GLPI Agent** hardware/software inventory and CMDB.',
      'Self-hosted open-source saves SaaS seat licenses while requiring internal server patching, TLS, and backups.',
      'Across all Unit 9 tools—JSM, ServiceNow, Zendesk, Freshservice, ManageEngine, osTicket, GLPI—the core habits from Units 0–8 transfer cleanly.',
      'Home-labbing osTicket or GLPI gives beginners verifiable hands-on ITSM experience before Day 1.',
    ],

    sourcesToVerify: [
      'osTicket Official Documentation — Agent Panel, Help Topics, Replies & Internal Notes',
      'GLPI Project Official Documentation — ITIL Service Desk, Inventory Agents & Asset Management',
    ],
  },

  'itsup.core.itsm.itil4-metrics': {
    id: 'itsup.core.itsm.itil4-metrics',
    moduleId: 'it-support',
    unitTitle: 'Unit 10: ITSM in Practice',
    topicTitle: '10.1 ITIL 4 Practices, CMDB & Service Desk Metrics',
    code: '10.1.1',
    title: 'ITIL 4 Change/Problem Management, CMDB Asset Lifecycle, Major Incidents & FCR/TTR KPIs',
    readMinutes: 14,
    prerequisites: ['1.1.1 What a Ticket Is & SLAs', '9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',

    learningObjectives: [
      'Explain **ITIL 4** (IT Infrastructure Library v4) and its **Service Value Chain** in plain language as shared guardrails for reliable IT operations.',
      'Distinguish **Incident Management** (restore service fast!), **Problem Management** (eliminate recurring root cause + Known Error Database **KEDB**), and **Change Enablement** (**Standard** pre-approved, **Normal** CAB-reviewed, **Emergency** fast-tracked).',
      'Trace the complete **IT Asset Lifecycle** (Procure -> Deploy -> Track in **CMDB** -> Patch/Repair -> Secure Wipe & Retire) and join a calm **Major Incident** bridge call.',
      'Interpret core Help Desk KPIs (**FCR**, **MTTR/TTR**, **CSAT**, **First Response SLA**) cleanly—and recognize dangerous **vanity-metric gaming** that hurts users.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Fixing the Same Broken VPN Client 40 Times a Month Means Your Desk Has Zero Problem Management',
      narrative:
        'A busy Service Desk boasts high ticket closure counts because agents spend all day restarting the Finance payroll service every morning at 9:00 AM. That looks busy on paper—yet Finance loses 30 minutes daily! **ITIL 4** teaches teams to link those 40 repetitive **Incidents** into one **Problem Record**, hunt down the memory leak once, file an approved **Change Request** to patch it permanently, and measure true success by **First Contact Resolution (FCR)** and user **Customer Satisfaction (CSAT)** instead of blindly chasing speed.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Mopping a Wet Floor (Incident) vs. Fixing the Leaking Pipe (Problem) With Building Approval (Change)',
      analogy:
        'If a pipe bursts over the lobby carpet, you grab towels right away so nobody slips (**Incident Management**—restore normal service fast!). If you mop that exact spot every Tuesday for a month without inspecting the ceiling, you’re missing **Problem Management** (finding the cracked valve and logging a **Known Error** workaround until repaired). Shutting off main building water for 20 minutes Sunday night to solder the new valve requires coordinating with tenants first (**Change Enablement / CAB**).',
      technicalDefinition:
        '**ITIL 4** aligns IT support practices around value co-creation via the **Service Value System**: **Incident Management** restores service rapidly; **Problem Management** investigates recurring incidents to publish workarounds in a **KEDB** and remove root causes; **Change Enablement** assesses risk across **Standard, Normal, and Emergency Changes**; and **KPIs** (**FCR**, **MTTR**, **CSAT**, **SLA compliance**) measure service outcomes across the **CMDB/Asset lifecycle**.',
      paragraphs: [
        '**Three Types of ITIL Changes Every Tech Must Know**:\n1. **Standard Change**: Low-risk, repeatable, pre-approved (e.g., deploying a tested laptop, adding user to standard printer group—no meeting required!).\n2. **Normal Change**: Needs risk/rollback review by a **Change Authority / CAB** (Change Advisory Board) before execution (e.g., upgrading core firewall firmware Saturday night).\n3. **Emergency Change**: Urgent fix for an active critical P1 outage or zero-day exploit (expedited Emergency CAB approval with fast post-implementation review).',
        '**Goodhart’s Law on Help Desk Metrics**: *"When a measure becomes a target, it ceases to be a good measure."* If managers punish technicians solely for **Average Handle Time (AHT)** or raw ticket count, weak agents rush callers off the phone without actually fixing root issues—causing **FCR** and **CSAT** to tank as users call back twice! Great desks balance **FCR** (fixed cleanly on first contact), **MTTR** (Mean Time to Resolve), **SLA adherence**, and genuine **CSAT** feedback.',
      ],
    },

    deepDive: {
      intro:
        'Connect Incident, Problem, Change, CMDB, Major Incidents, and KPIs into one coherent operational picture.',
      steps: [
        {
          step: 'Incident vs Problem',
          title: 'Linking Recurring Incidents -> Problem -> KEDB -> Change',
          explanation:
            'When 5+ users report the exact same Outlook freeze, link child Incidents to a **Parent/Major Incident** or **Problem Record**. Document the temporary workaround inside the **Known Error Database (KEDB)** so L1 keeps users working cleanly until Engineering pushes the permanent patch.',
        },
        {
          step: 'Change Enablement',
          title: 'Standard vs. Normal vs. Emergency Changes & Backout Plans',
          explanation:
            'Every risky **Normal Change** must answer three questions before **CAB** approval: *What is the business reason? Who is impacted? What is the tested **Rollback/Backout Plan** if it fails?* On Help Desk, always check today’s **Change Calendar** at shift start—if Finance breaks at 8:05 AM right after a midnight server patch, you spot the correlation immediately!',
        },
        {
          step: 'Major Incident Role',
          title: 'P1 Major Incident Bridge Etiquette',
          explanation:
            'During a site-wide P1 outage, L1 becomes **Communications & Scribe Support**: link incoming callers cleanly to the single Master Major Incident ticket, post agreed status banner updates every 30 minutes, and keep non-essential noise off the engineering bridge call.',
        },
        {
          step: 'KPIs & CMDB',
          title: 'FCR, MTTR, CSAT & Asset Lifecycle (Cradle to Grave)',
          explanation:
            '• **FCR (First Contact Resolution)**: % solved completely on first interaction without reopening or escalating.\n• **MTTR (Mean Time to Resolve)**: Average clock time from ticket open to verified fix.\n• **CSAT**: User satisfaction rating.\n• **Asset Lifecycle**: Procure -> Receive/Tag -> Deploy -> Maintain/CMDB -> Reclaim -> **Certified Wipe (NIST 800-88) & Dispose**.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'ITIL 4 Value Flow: Incident -> Problem -> Change -> KEDB & Metrics',
        asciiFallback: `[Recurring User Incidents x12] ---> Restore fast via Workaround!
         |
         v (Pattern spotted!)
[Problem Management] ---> Finds Root Cause -> Logs workaround in [KEDB]
         |
         v (Needs production fix!)
[Change Enablement] -> Standard (Pre-approved) | Normal (CAB + Rollback) | Emergency
         |
         v
[Healthier CMDB + Higher FCR + Lower MTTR + Happier CSAT!]`,
      },
      workedExample: {
        title: 'Worked ITIL Case: Turning a Monday Morning Printer Chaos Into a Clean Change & Problem Win',
        context:
          'Every Monday after weekend Windows patches, Floor 3’s network printer driver crashes on 18 Accounting laptops.',
        steps: [
          'Week 1: L1 fixes callers quickly via workaround (restart Print Spooler) and notes the pattern.',
          'Week 2: L1 links 12 child **Incidents** to a **Problem Record (`PRB-019`)** and publishes the 2-step **Known Error (KEDB)** script so every agent solves Monday calls in 60 seconds.',
          'Desktop Engineering identifies a bad vendor print-driver update, builds a **Normal Change Request (`CHG-402`)** with a tested rollback package, gains **CAB approval**, and deploys the fixed driver via MDM Friday night.',
          'Next Monday: Zero printer crashes—FCR stays high and monthly ticket noise drops by 18 tickets permanently.',
        ],
        outcome:
          'Moved from firefighting repetitive incidents into true root-cause elimination.',
      },
    },

    supportWalkthrough: {
      intro:
        'Apply ITIL 4 habits on the desk without drowning in bureaucracy.',
      steps: [
        {
          phase: 'Check Change Calendar',
          action: 'Scan last night’s completed Changes at the start of your morning shift.',
          whyItWorks: 'Up to half of sudden morning outages trace straight back to an overnight network, DNS, or OS change.',
        },
        {
          phase: 'Tag Recurring Patterns',
          action: 'When you fix the exact same weird bug for the 3rd user in 48 hours, flag a supervisor to open or link a Problem record.',
          whyItWorks: 'Frontline agents see emerging trends hours before monitoring dashboards alert.',
        },
        {
          phase: 'Never Game Metrics',
          action: 'Never split one real problem into 3 fake tickets or coerce users into "5-star CSAT" before verifying their fix holds.',
          whyItWorks: 'Metric integrity protects team staffing justifications and builds durable user trust.',
        },
      ],
      questionsToAsk: [
        '"Where can our desk view last night’s approved Normal and Emergency Changes before morning rush?"',
        '"Which single Master/Major Incident ticket should we attach duplicate caller tickets to during an outage?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a Major Incident update calmly while avoiding technical speculation',
          sayThis:
            '"Thanks for reporting this—we’ve confirmed a wider authentication outage affecting East Wing logins right now, and our core infrastructure team is actively working on it under our top-priority incident. I’ve linked your ticket so you’ll get our next status update automatically within 30 minutes."',
        },
      ],
      ticketNoteTemplate: {
        category: 'ITIL Practice -> Parent/Problem Escalation Pattern',
        priorityFormula: 'Recurring multi-user fault -> Linked to Problem Record PRB-019 + KEDB Workaround',
        internalNotes: `[PATTERN DETECTED] 6th Finance laptop today with identical print-spooler crash after KB503-update. Applied verified KEDB workaround (spooler restart + v4 driver swap); linked Incident to Problem PRB-019 for permanent MDM Normal Change.`,
        customerReply:
          'Confirmed printing restored cleanly! Also flagged this recurring pattern internally so Engineering prevents it from happening after future updates.',
        escalationCriteria:
          'Escalate to Problem Owner / Endpoint Engineering once >= 3 identical post-patch incidents occur across distinct users.',
      },
    },

    commonTraps: [
      {
        trap: 'Closing 50 repetitive Incidents cleanly every week without ever creating a **Problem** record.',
        reality: 'High incident volume for the exact same fault signals missing **Problem Management**—fix the pipe, don’t just mop faster!',
      },
      {
        trap: 'Pushing an untested router or server upgrade straight to production at 2:00 PM on Tuesday without a **Change Request** or **Rollback Plan**.',
        reality: 'Unapproved changes cause avoidable Major Incidents; **Normal Changes** require peer risk review and tested backout steps.',
      },
      {
        trap: 'Optimizing **Average Handle Time (AHT)** by rushing calls and closing tickets before verifying fixes—tanking **FCR**.',
        reality: 'An extra 90 seconds to confirm the fix prevents a second frustrated callback and boosts **First Contact Resolution (FCR)** and **CSAT**.',
      },
    ],

    keyTerms: [
      {
        term: 'ITIL 4',
        shortDef: 'Widely adopted IT Service Management framework connecting practices (Incident, Problem, Change, Asset) around business value.',
        fullDef: 'Emphasizes practical, value-focused workflows rather than rigid red tape.',
      },
      {
        term: 'Problem Management & KEDB',
        shortDef: 'Investigating root causes behind recurring incidents and publishing proven workarounds in a Known Error Database.',
        fullDef: 'Reduces long-term ticket volume by fixing systemic defects permanently.',
      },
      {
        term: 'Change Enablement (Standard / Normal / Emergency)',
        shortDef: 'Risk-balanced governance over infrastructure changes—pre-approved Standard, CAB-reviewed Normal, expedited Emergency.',
        fullDef: 'Protects production stability with documented testing and rollback plans.',
      },
      {
        term: 'FCR & MTTR',
        shortDef: 'First Contact Resolution (% solved completely on first touch) and Mean Time to Resolve (average fix duration).',
        fullDef: 'Core service desk KPIs paired with CSAT to measure both effectiveness and speed.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-1011-q1',
        prompt: 'What is the cleanest distinction between **Incident Management** and **Problem Management** in ITIL 4?',
        options: [
          'Incident Management restores disrupted service as fast as possible (even with a workaround); Problem Management investigates and eliminates the underlying root cause behind recurring incidents.',
          'Incident Management is only for hardware; Problem Management is only for HR.',
          'Problem Management happens before any computer exists.',
          'There is no difference—they are synonyms.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Incident = restore user fast; Problem = stop it from ever coming back.',
          'Incorrect: Both apply across hardware, software, cloud, and networks.',
          'Incorrect: Problems often emerge after repeated Incidents.',
          'Incorrect: Distinct ITIL 4 practices with separate goals.',
        ],
        takeaway: 'Incident = get the user back to work fast · Problem = fix the root cause permanently.',
      },
      {
        id: 'itsup-1011-q2',
        prompt: 'A Network Engineer needs to upgrade core firewall firmware during a Sunday maintenance window, carrying moderate outage risk and needing peer review + a rollback plan. Which ITIL **Change** type is this?',
        options: [
          'Normal Change',
          'Standard Change',
          'Emergency Change',
          'Password Reset Request',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Non-routine risky changes requiring Change Authority/CAB review and documented backout steps are Normal Changes.',
          'Incorrect: Standard Changes are low-risk, frequent, pre-approved procedures.',
          'Incorrect: Emergency Changes bypass normal scheduling only during active urgent crises/zero-day outages.',
          'Incorrect: Standard service request.',
        ],
        takeaway: 'Standard = pre-approved routine · Normal = CAB/peer review + rollback plan · Emergency = urgent active crisis.',
      },
      {
        id: 'itsup-1011-q3',
        prompt: 'A Service Desk manager notices Technician A resolves calls in 3 minutes flat (**very low handle time**), yet 45% of Technician A’s users call back the next morning with the exact same broken printer. Which metric immediately exposes this bad habit?',
        options: [
          'Low **FCR (First Contact Resolution)** paired with dropping **CSAT**.',
          'High monitor refresh rate.',
          'High gigabit switch throughput.',
          'Large hard-drive capacity.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Rushing callers off without verifying root fixes inflates handle speed superficially while crashing FCR and user satisfaction.',
          'Incorrect: Unrelated display spec.',
          'Incorrect: Unrelated network speed.',
          'Incorrect: Unrelated storage spec.',
        ],
        takeaway: 'Never sacrifice First Contact Resolution (FCR) and genuine user verification to chase rushed call-time targets.',
      },
      {
        id: 'itsup-1011-q4',
        prompt: 'At the final **Retire / Dispose** stage of an enterprise laptop’s IT Asset Lifecycle, what must happen before sending the machine to an IT recycling vendor?',
        options: [
          'Perform certified media sanitization/wipe (e.g., NIST 800-88) or physical destruction, clear MDM/Autopilot enrollment, and update the CMDB/Asset state to Retired/Disposed.',
          'Leave company files intact and give it away to a passerby.',
          'Only peel off the asset sticker without wiping the SSD.',
          'Create a new Active Directory admin account on it.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Clean disposal protects confidential company data, frees cloud MDM enrollment locks, and closes audit books cleanly.',
          'Incorrect: Severe data-breach risk.',
          'Incorrect: SSDs retain corporate data unless cryptographically erased/wiped.',
          'Incorrect: Nonsense.',
        ],
        takeaway: 'Asset lifecycle isn’t finished until the drive is certified-wiped, MDM enrollment cleared, and CMDB updated to Retired.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Draft a Standard vs. Normal Change & KEDB Entry',
      instructions: [
        'Write a short **Known Error (KEDB)** entry for a recurring post-update audio driver bug, plus the **Backout/Rollback Plan** you would attach to a Normal Change deploying the permanent fix.',
      ],
      verificationCheck: 'KEDB documents symptom + safe workaround cleanly; Normal Change defines test validation and exact rollback steps.',
    },

    summaryBullets: [
      '**ITIL 4** connects Incident, Problem, Change, and Asset practices around measurable user and business value.',
      '**Incident Management** restores service rapidly; **Problem Management** finds root causes and publishes **KEDB** workarounds.',
      '**Change Enablement** splits **Standard** (pre-approved), **Normal** (assessed + rollback plan), and **Emergency** changes.',
      'Track balanced KPIs: **FCR** (fixed cleanly first time), **MTTR**, **SLA compliance**, and **CSAT**—never game handle times.',
      'Manage the full **Asset Lifecycle** through **CMDB** tracking all the way to certified drive wipe and disposal.',
    ],

    sourcesToVerify: [
      'AXELOS ITIL 4 Foundation — Service Value System, Incident, Problem, Change Enablement & IT Asset Management Practices',
      'NIST SP 800-88 Rev. 1 — Guidelines for Media Sanitization',
    ],
  },

  'itsup.core.career.interview-prep': {
    id: 'itsup.core.career.interview-prep',
    moduleId: 'it-support',
    unitTitle: 'Unit 11: Interview Readiness, Tool Honesty & First 90 Days',
    topicTitle: '11.1 Technical & Behavioral Interviews + Tool Honesty',
    code: '11.1.1',
    title: '150+ Interview Q&A, STAR Stories, Explaining Unfamiliar Tools & First 90 Days',
    readMinutes: 16,
    prerequisites: ['0.1.1 Support Tiers & Empathy', '9.1.2 Same Ideas, Different Names Translation Table'],
    versionScope: 'shared',

    learningObjectives: [
      'Answer core **technical Help Desk interview questions** smoothly—from *"Walk me through fixing `No Internet`"* and *"What happens when you type a URL?"* to *"How do you contain a phished user?"*',
      'Structure crisp **STAR** (**Situation, Task, Action, Result**) behavioral answers for angry callers, conflicting VIP priorities, and owning an honest mistake.',
      'Answer **"We use ServiceNow / Freshservice / JSM here — have you used it before?"** with rock-solid honesty AND confidence using **transferable workflow translation** instead of bluffing.',
      'Execute a high-impact **CV / Resume Blueprint** and **30 / 60 / 90-Day Onboarding Plan** that makes hiring managers eager to promote you.',
    ],

    whyThisMatters: {
      scenarioTitle: 'The Moment Every Self-Taught Applicant Freezes—and How Honesty Plus Translation Wins the Offer',
      narrative:
        'You aced every technical question in the interview—`ipconfig`, DNS, Event 4740, phishing containment—and then the hiring manager leans forward: *"Great. By the way, we run **Freshservice** (or **ServiceNow / JSM**) here. Have you used it?"* Beginners either panic (*"No, sorry..."* and stop talking) OR try to bluff (*"Yes, tons!"*—then freeze the moment asked about Work Notes vs Catalog Items). This final capstone gives you the exact script to turn an unfamiliar brand name into proof of how fast you learn.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Saying "I Learned Safe Driving in a Sedan—Here’s How I Map Any Rental Dashboard in 10 Minutes"',
      analogy:
        'Hiring managers aren’t hiring you because you memorized where a blue button sits in one vendor’s 2026 UI—buttons move every quarter! They hire people who **stay calm with stressed humans**, **isolate problems logically without guessing**, **document clearly**, and **never pretend to know something they don’t**. Showing you understand the universal workflows underneath makes any unfamiliar ticketing UI look easy.',
      technicalDefinition:
        'Interview mastery pairs crisp **structured technical walkthroughs** (OSI/troubleshooting steps, AD/M365/security triage), **STAR behavioral storytelling** (`Situation -> Task -> Action -> Result`), transparent **transferable ITSM mapping** when asked about unfamiliar software brands, and an actionable **30-60-90-Day Service Desk Onboarding Plan**.',
      paragraphs: [
        '**The Exact Word-for-Word "Tool Honesty + Transfer" Answer**:\n*"I haven’t worked in [Company’s Tool X] in a production enterprise environment yet—my hands-on practice has been with [standard ticket queues / osTicket / GLPI / this simulator]. Because I know core ticketing workflows thoroughly—Request Types/Catalog forms, Impact × Urgency SLAs, strictly separating Internal/Work Notes from Public Replies, Queue filtering, and escalation handoffs—I can map Tool X’s screen labels on Day 1 cleanly. For example, I already know what you call [Tool X term] works the same way as [standard concept]."* **Zero bluffing. Maximum competence!**',
        '**Build Your Practice Bank (150+ Questions Framework)**: Group your interview prep cleanly across 6 buckets (25+ drills each): (1) **Triage Walkthroughs** (*"No internet"*, *"Slow PC"*, *"Printer won’t print"*, *"URL lifecycle"*), (2) **Windows/OS & CLI** (Event Viewer, Services, NTFS, `ipconfig`/`ping`/`nslookup`/`gpresult`), (3) **Identity & M365** (Event 4740 lockouts, MFA verification, Shared Mailboxes, Message Trace), (4) **Security & Containment** (AiTM revoke tokens + rules, BitLocker vishing check, ransomware network isolation), (5) **ITSM & Tools** (Incident vs Request vs Problem vs Change, Work Notes vs Comments, FCR/MTTR), and (6) **STAR Behavioral** (angry caller, competing VIPs, admitting a mistake, saying *"I don’t know yet—here’s how I’ll find out safely"*).',
      ],
    },

    deepDive: {
      intro:
        'Master the 4 interview superpowers: Technical Walkthroughs, STAR Stories, CV Structure, and Your First 90 Days.',
      steps: [
        {
          step: '1. Technical Framing',
          title: 'How to Answer Any "User Calls With Problem X" Question',
          explanation:
            'Always open with **empathy + scope** before rattling off CLI commands! *"First I acknowledge their deadline calmly and verify identity if account-related. Next I ask two scoping questions: Does it happen for teammates too, and what changed recently? Then I test bottom-up (`ipconfig` -> gateway -> DNS / webmail), document findings in Internal Notes, confirm the fix works end-to-end with the user, and send a jargon-free summary."*',
        },
        {
          step: '2. STAR Behavioral Bank',
          title: 'Situation · Task · Action · Result (Keep Under 90 Seconds!)',
          explanation:
            'Pick 5 adaptable stories before any interview (works even from retail, hospitality, call centers, or home-lab builds!): (1) De-escalating an upset customer, (2) Juggling 3 urgent tasks at once, (3) Catching a subtle pattern that fixed a repeat issue, (4) Admitting an error quickly and fixing it cleanly, (5) Learning an unfamiliar system fast under pressure.',
        },
        {
          step: '3. Honest Resume / CV Blueprint',
          title: 'Show Skills & Projects Clearly Without Keyword Spam',
          explanation:
            'Include: **Summary** (1–2 lines: *"Customer-focused IT Support specialist trained in Windows/AD, M365, endpoint networking, security containment, and ITIL workflows"*), **Core Technical Skills** (grouped cleanly by OS, Networking, Identity/Cloud, ITSM Concepts), **Hands-On Projects / Home Lab** (e.g., built AD/GPO lab + practiced multi-tier ticket triage & SLA prioritization), and **Transferable Customer/Ops Experience** quantified with outcomes.',
        },
        {
          step: '4. Your First 30 / 60 / 90 Days',
          title: 'How Top New Hires Ramp Up Quietly and Steadily',
          explanation:
            '• **Days 1–30**: Learn the 8 company tools, shadow L1/L2 calls, read the top 20 KB articles, hit clean ticket documentation & out-of-band security checks.\n• **Days 31–60**: Handle full solo queues steadily, raise **FCR**, update outdated KB screenshots whenever you spot stale docs.\n• **Days 61–90**: Spot recurring incident patterns worth **Problem** records, automate repetitive checks safely, mentor newer hires.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'The Winning Interview Answer Arc + 30/60/90-Day Blueprint',
        asciiFallback: `[TECHNICAL QUESTION] -> Empathy/Auth -> Scope (1 vs many? User vs PC?)
                     -> Bottom-Up Test -> Verify Fix -> Document + KB

[TOOL HONESTY RULE]  -> State honestly: "Not in production yet"
                     -> Prove workflow mastery (Internal vs Public, SLAs, Queues)
                     -> Map labels to their specific platform cleanly!

[FIRST 90 DAYS]      -> 30d: Learn stack + spotless notes & security checks
                     -> 60d: Solo queue consistency + improve stale KB docs
                     -> 90d: Catch recurring Problems + elevate FCR/CSAT`,
      },
      workedExample: {
        title: 'Worked Interview Role-Play: Answering Two Classic Curveballs Back-to-Back',
        context:
          'Interviewer asks: (A) "What happens when someone says they can’t open `crm.company.com`?" and (B) "Wait—have you ever actually used ServiceNow?"',
        steps: [
          'Answer (A) cleanly: Start with scope (*"Just you or whole floor? Are you remote on VPN?"*), test `ipconfig /all` (rule out `169.254` APIPA), `ping` gateway & `8.8.8.8`, run `nslookup crm.company.com` (separate DNS vs routing), verify VPN auth if remote, and log crisp Internal Notes before giving a plain-English update.',
          'Answer (B) honestly: *"I haven’t administered ServiceNow in a paid enterprise role yet—I’ve practiced end-to-end ITSM ticketing in structured simulations and local labs. Because ServiceNow’s Incident form maps directly to concepts I’ve drilled—Caller, CI in the CMDB, Assignment Group, State/Hold reasons, and strictly keeping private yellow Work Notes separate from customer-visible Additional Comments—I’d be comfortable working live tickets right away with minimal ramp-up."*',
        ],
        outcome:
          'Demonstrates real competence, mature integrity, and zero wasted fluff—turning what looks like a weakness into your strongest selling point.',
      },
    },

    supportWalkthrough: {
      intro:
        'Use **Patch** (your built-in IT Support Socratic study coach) and these interview prep habits before real calls.',
      steps: [
        {
          phase: 'Rehearse Aloud',
          action: 'Practice speaking your "Tool Honesty" and "I don’t know—here’s how I’d check safely" scripts out loud twice.',
          whyItWorks: 'Under interview nerves, rehearsed structure stops rambling immediately.',
        },
        {
          phase: 'Always Mention Security Verification',
          action: 'When interviewers throw any password, MFA, or BitLocker question, mention **out-of-band identity verification** right in sentence two.',
          whyItWorks: 'Security instincts instantly separate pros from careless script-readers.',
        },
        {
          phase: 'Ask Smart Closing Questions',
          action: 'Bring 2 thoughtful questions: *"What are the top 3 recurring tickets hitting L1 right now?"* and *"What makes a technician succeed in their first 90 days on your desk?"*',
          whyItWorks: 'Shows genuine operational curiosity and team mindset.',
        },
      ],
      questionsToAsk: [
        '"What are the top three ticket categories your Tier 1 team handles most each week?"',
        '"How does escalation work between Tier 1 and Tier 2 / SysAdmin here, and what makes an escalation note truly helpful to your senior team?"',
        '"Where are your Knowledge Base docs stored, and are L1 technicians encouraged to update outdated guides?"',
      ],
      sampleUserWording: [
        {
          situation: 'Saying "I don’t know" honestly to an interviewer without losing momentum',
          sayThis:
            '"I haven’t hit that exact error code before, so I wouldn’t guess blindly on a live user’s machine. First I’d check our internal Knowledge Base and recent ticket history for that app, pull the exact wording from Event Viewer or vendor docs, isolate whether it follows the user or stays on one PC, and escalate cleanly with evidence if needed."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Career Capstone -> Interview & Day-1 Readiness Verified',
        priorityFormula: 'Honesty + Structured Method + Empathy = Hireable Service Desk Pro',
        internalNotes: `[INTERVIEW PREP AUDIT] Mastered 6-step troubleshooting, endpoint CLI, AD/Entra lockouts, M365 triage, AiTM phishing containment, cross-platform ITSM translation (JSM/ServiceNow/Zendesk/Freshservice/ManageEngine/osTicket/GLPI), ITIL 4 metrics, and STAR stories.`,
        customerReply:
          'Ready to bring calm empathy, crisp ticket notes, and strong technical curiosity to your first—or next—IT Support role!',
        escalationCriteria:
          'Use Mock Exam & Simulator practice modes weekly to keep both technical accuracy and ticket tone razor-sharp.',
      },
    },

    commonTraps: [
      {
        trap: 'Claiming hands-on production expertise in ServiceNow or Jira Service Management when you have only watched a 5-minute YouTube tour.',
        reality: 'Two follow-up questions expose exaggeration instantly and end candidacy—honest transferable workflow knowledge builds massive trust.',
      },
      {
        trap: 'Dumping 12 random technical words (*"I’d reinstall Windows, flush DNS, swap RAM, and check BGP!"*) instead of walking step-by-step.',
        reality: 'Interviewers grade **structured thinking and user empathy**, not throwing commands at the wall.',
      },
      {
        trap: 'Writing a 3-page CV packed with buzzwords you cannot explain on a whiteboard.',
        reality: 'Keep your CV clean (1–2 pages max) and only list skills you can comfortably walk through for 60 seconds.',
      },
    ],

    keyTerms: [
      {
        term: 'STAR Method',
        shortDef: 'Behavioral interview structure: Situation, Task, Action, Result.',
        fullDef: 'Keeps real customer/teamwork stories tight (60–90 seconds) with measurable outcomes.',
      },
      {
        term: 'Transferable ITSM Fluency',
        shortDef: 'Mapping universal ticketing workflows honestly onto any unfamiliar vendor UI without bluffing.',
        fullDef: 'Proves Day-1 adaptability across JSM, ServiceNow, Zendesk, Freshservice, ManageEngine, osTicket, and GLPI.',
      },
      {
        term: '30-60-90-Day Plan',
        shortDef: 'Structured onboarding roadmap covering initial learning (30d), solo consistency (60d), and proactive KB/Problem wins (90d).',
        fullDef: 'Demonstrates maturity and career ownership in interviews and early check-ins.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-1111-q1',
        prompt: 'An interviewer says: *"We use Freshservice here. Have you worked with Freshservice before?"* You have NOT used Freshservice yet, though you master core ticketing concepts. What is the strongest answer?',
        options: [
          'Be honest that you haven’t used Freshservice in production yet, then immediately map how your mastery of core workflows (Internal/Private Notes vs Replies, SLAs, Asset linking, Queue views) lets you ramp up on Freshservice rapidly.',
          'Say "Yes, 5 years!" and hope they don’t ask follow-up questions.',
          'Say "No" and stay completely silent.',
          'Tell them Freshservice is terrible and they should delete it.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Integrity plus transferable workflow translation is the gold-standard response hiring managers respect.',
          'Incorrect: Bluffing gets exposed immediately on follow-ups and breaks trust.',
          'Incorrect: Stopping at bare "No" misses the chance to prove workflow mastery.',
          'Incorrect: Insulting a team’s tool stack loses the job on the spot.',
        ],
        takeaway: 'Never fake tool familiarity—pair total honesty with clear transferable workflow mapping.',
      },
      {
        id: 'itsup-1111-q2',
        prompt: 'In an interview technical role-play, a stressed caller claims `"Nothing works!"` What should you say or ask **first**?',
        options: [
          'Acknowledge their urgency calmly, ask clarifying scope questions (what specific app/error appears, does it affect coworkers too, what changed recently) before jumping into fixes.',
          'Tell them to immediately wipe their hard drive.',
          'Say "Calm down, everyone says that" and put them on silent hold.',
          'Recite all 7 OSI layers from memory without asking what failed.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Empathy + structured scope questions pinpoint the fault fast while lowering the caller’s stress.',
          'Incorrect: Reckless and destructive.',
          'Incorrect: Saying "calm down" escalates frustration; silent holds sound broken.',
          'Incorrect: Academic lecturing doesn’t solve the user’s problem.',
        ],
        takeaway: 'Lead every live triage with calm empathy and sharp scope questions before guessing commands.',
      },
      {
        id: 'itsup-1111-q3',
        prompt: 'Which behavioral answer follows the **STAR** framework cleanly?',
        options: [
          'Briefly set the **Situation & Task**, spend most of your time on **Actions YOU personally took**, and finish with a concrete **Result** (e.g., solved in 6 mins, updated KB so team saved time).',
          'Talk for 8 minutes straight about how annoying your former manager was.',
          'Answer "I’m always great with everyone" with no specific real example.',
          'Invent a fake story about hacking NASA.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Crisp Situation/Task setup -> clear personal Actions -> measurable positive Result.',
          'Incorrect: Badmouthing past coworkers is a giant red flag.',
          'Incorrect: Vague claims without specific examples fail behavioral scoring.',
          'Incorrect: Dishonesty and irrelevance.',
        ],
        takeaway: 'Keep STAR stories under 90 seconds, focus on YOUR specific actions, and end with a concrete outcome.',
      },
      {
        id: 'itsup-1111-q4',
        prompt: 'During your **First 30 Days** at a new Help Desk job, which habit builds the fastest reputation with senior engineers?',
        options: [
          'Writing thorough, verified Internal Notes (exact errors, tests run, asset tags, out-of-band ID checks completed) before escalating anything.',
          'Escalating vague one-line tickets (*"User broke Outlook, plz fix"*) straight to Tier 2.',
          'Skipping the Knowledge Base and asking the exact same question in Slack five times.',
          'Sharing admin passwords in public chat.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Senior engineers remember—and mentor—junior techs whose escalation notes save them 20 minutes of detective work.',
          'Incorrect: "Ticket ping-pong" frustrates escalation teams fast.',
          'Incorrect: Always check KB/ticket history first, then ask smart targeted questions.',
          'Incorrect: Serious security violation.',
        ],
        takeaway: 'Clean triage notes + KB curiosity + security discipline earn Tier 2 respect in your first 30 days.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Test Your Complete Readiness in Simulator & IT Help Desk Mock Exam',
      targetTab: 'exam',
      instructions: [
        'Launch the **IT Help Desk & Support Mock Exam** and aim for 85%+ across scenario questions, troubleshooting order, security containment, and tool workflows.',
        'Revisit the **Simulator** (Tier 1 & Tier 2) and practice explaining your reasoning out loud as if interviewing live.',
      ],
      verificationCheck: 'Consistent 85%+ mock exam accuracy paired with crisp, jargon-free Customer Replies and thorough Internal Notes.',
    },

    summaryBullets: [
      'Lead technical interview walkthroughs with **empathy + scope** (*User vs Machine? What changed?*) before listing CLI tests.',
      'Use **STAR** stories (Situation, Task, Action, Result) from past support, retail, or home labs—under 90 seconds.',
      'Handle unfamiliar ticketing brands with **100% honesty + transferable workflow mapping** instead of bluffing.',
      'List only verifiable skills on a crisp 1–2 page CV, backed by real hands-on lab/simulator examples.',
      'Win your **First 90 Days** via clean escalation notes, security verification discipline, KB updates, and pattern spotting.',
    ],

    sourcesToVerify: [
      'ITIL 4 Service Desk Practices & CompTIA A+ Operational Procedures / Professionalism Standards',
      'Road to TECH Internal Competency Rubric — Tier 1/Tier 2 Readiness & Interview Framework',
    ],
  },
};
