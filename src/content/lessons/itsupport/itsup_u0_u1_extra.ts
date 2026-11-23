import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_U0_U1_EXTRA_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.0.1.3': {
    id: 'itsup.0.1.3',
    moduleId: 'it-support',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.1–0.2 Support Organization & Escalation Structure',
    code: '0.1.3',
    title: 'In-House IT vs MSPs, Operating Hours, L0–L4 Tiers & Functional vs Hierarchical Escalation',
    readMinutes: 12,
    prerequisites: ['0.1.1', '0.1.2'],
    versionScope: 'shared',

    learningObjectives: [
      'Distinguish between an internal in-house help desk and a Managed Service Provider (MSP) serving multiple client organizations.',
      'Explain business-hours, 24/7 shift, follow-the-sun, and on-call support models.',
      'Describe Level 0 (self-service) through Level 4 (external vendors) and decide which team owns common tickets.',
      'Contrast functional escalation (specialist depth) against hierarchical escalation (management urgency or risk).',
    ],

    whyThisMatters: {
      scenarioTitle: 'First Week Confusion: Routing 30 Users Down vs. a Vendor Billing Bug',
      narrative:
        'A new analyst joins a company operating offices in London, Nairobi, and New York. At 4:50 PM London time, thirty people in Finance suddenly lose access to a shared network folder right before payroll closes, while on the next call a regional office asks why an external accounting cloud vendor raised an invoice error. Knowing who owns what—L0 self-service, L1/L2 desktop, L3 server/network, L4 outside vendor, and when to alert management—prevents silent stalls while SLAs burn.',
    },

    plainEnglish: {
      analogyTitle: 'A Relay Team Spanning Clinics, Specialists, and Equipment Makers',
      analogy:
        'Think of Level 0 as the pharmacy first-aid leaflet that lets people solve minor scrapes themselves; Level 1 as the urgent-care nurse; Level 2 as the on-site clinic technician visiting the patient desk or investigating tougher symptoms; Level 3 as the hospital infrastructure specialist managing X-ray servers; and Level 4 as calling the MRI machine manufacturer directly when a sealed factory component breaks.',
      technicalDefinition:
        'Support models organize service ownership across organizational boundaries (internal vs. MSP), shift schedules (follow-the-sun, 24/7, on-call), and five capability tiers (L0 self-service to L4 external vendor escalation), pairing functional routing with hierarchical management alerts.',
      paragraphs: [
        'Companies generally deliver IT support in two ways. An **in-house help desk** serves employees of one organization, building deep familiarity with that company’s specific culture, offices, and line-of-business apps. A **Managed Service Provider (MSP)** is an outsourced IT company hired by dozens of smaller or mid-size businesses under service contracts—analysts at an MSP switch smoothly between different client environments, tools, and security policies all day.',
        'Coverage hours match business risk. Small offices often use **business-hours coverage** (for example 8:00 AM–6:00 PM local time) paired with an **on-call rota** for true after-hours emergencies. Global firms use **follow-the-sun** handovers—Sydney hands active tickets to London, which hands them to Toronto—so daytime staff are always fresh.',
        'Within IT itself, work divides across specialized teams: the **service desk** (single point of contact), **desktop / field support** (visits desks physically for hardware swaps), **system administrators** (servers, mail, user directories), **network team** (switches, Wi-Fi, firewalls), **security team**, **applications team**, and **outside vendors (L4)**.',
      ],
    },

    deepDive: {
      intro: 'Every incoming contact falls into one of three plain categories and flows across L0–L4 using two distinct escalation directions.',
      steps: [
        {
          step: '01',
          title: 'Three Fundamental Contact Types',
          explanation:
            'Every call or message is either: (1) something is broken ("my Wi-Fi dropped"), (2) someone wants something standard ("I need a second monitor"), or (3) someone has a quick question ("how do I book the boardroom projector?"). Unit 1 turns these into formal ticket categories.',
        },
        {
          step: '02',
          title: 'L0 Self-Service & L1/L2 Service Desk Boundary',
          explanation:
            'L0 portals, FAQs, and password-reset pages absorb repetitive questions before they hit the queue. L1 handles intake, identity checks, known fixes, and fast remote support; L2 (including Desktop/Field Support) visits user desks or tackles deeper reproducible system faults.',
        },
        {
          step: '03',
          title: 'L3 Core Specialists & L4 Outside Vendors',
          explanation:
            'L3 network, systems, security, and application engineers maintain core servers, infrastructure, and code. L4 is the external software or hardware supplier—used when a cloud service breaks on the vendor’s side or a laptop motherboard needs warranty replacement.',
        },
        {
          step: '04',
          title: 'Functional vs. Hierarchical Escalation',
          explanation:
            'Functional escalation moves a ticket sideways/upward to a team with deeper permissions or specialist skill (e.g., L1 -> Network Team). Hierarchical escalation alerts a manager or incident lead because impact is wide, a security risk appeared, a VIP deadline is critical, or a service target is about to breach.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'IT Support Ownership Map from L0 Self-Service to L4 External Vendors',
        asciiFallback: `[End User] ---> [L0 Self-Service Portal / Password Reset / KB]
                     | (needs human help)
                     v
                [L1 Service Desk] (Remote First-Contact SPOC)
                  |            |
   Functional Esc |            | Hierarchical Esc (wide impact / security / breach risk)
                  v            v
        [L2 Desktop / L3 Net, SysAdmin, Sec]   ---> [Team Lead / IT Manager]
                  |
                  v (vendor outage / hardware warranty)
        [L4 External Supplier / Vendor Support]`,
      },
      workedExample: {
        title: 'Triaging Five Sample Requests to the Right Team',
        context: 'Five contacts arrive at 9:05 AM on Monday morning at an international firm.',
        steps: [
          '1. "Broken keyboard key stuck" -> L1 verifies spare stock -> L2 Desktop/Field Support delivers/swaps physical keyboard.',
          '2. "Forgotten password" -> L0 self-service reset page first; if locked out, L1 verifies identity and resets.',
          '3. "Shared file server unreachable for 30 Finance users for 20 minutes" -> L1 logs shared scope immediately, performs Functional escalation to L3 System Administrators AND Hierarchical notification to Service Desk Lead.',
          '4. "Suspicious email asking Finance to wire money" -> Immediate security escalation to InfoSec Team with exact timestamps and headers preserved.',
          '5. "New starter needs a laptop before next Monday" -> Standard request routed to L1/L2 Desktop provisioning queue with manager approval.',
        ],
        outcome: 'Every contact lands with the right owner in under two minutes with zero wasted bouncing.',
      },
    },

    supportWalkthrough: {
      intro: 'Use this checklist when deciding whether to keep, functionally escalate, or hierarchically flag a ticket.',
      steps: [
        {
          phase: 'Check Scope & Permissions',
          action: 'Confirm whether you hold permissions and a documented fix step before escalating.',
          whyItWorks: 'Prevents escalating tasks L1 can finish in 5 minutes while stopping blind guesswork on locked systems.',
        },
        {
          phase: 'Package Functional Handoffs',
          action: 'Attach reported symptom, user impact, tests tried with results, exact error text, times, and user contact details.',
          whyItWorks: 'Ensures the receiving specialist never forces the user to repeat their whole story.',
        },
        {
          phase: 'Trigger Hierarchical Alerts Early',
          action: 'Notify your team lead immediately for multi-user outages, abusive calls, data exposure, or imminent deadline breaches.',
          whyItWorks: 'Managers can open major-incident bridges and allocate staffing before users flood the phones.',
        },
      ],
      questionsToAsk: [
        '"How many colleagues around you are seeing this exact same failure right now?"',
        '"Are you currently at the office, working from home, or traveling across time zones?"',
        '"What deadline is blocked while this stays down?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a warm handoff to L2 Desktop Support',
          sayThis:
            '"We’ve confirmed your laptop’s power adapter has failed rather than a software setting. I’ve logged all test details and assigned Desktop Support to deliver a replacement adapter to Desk 4B by 11:00 AM."',
        },
      ],
      ticketNoteTemplate: {
        category: 'File Services -> Shared Drive Outage (30 Users)',
        priorityFormula: 'Impact: High (30 Finance staff blocked) × Urgency: High (Payroll deadline) = P1/P2 High-Priority Escalation',
        internalNotes: `[SYMPTOM] Shared Finance drive inaccessible for ~30 users since 08:45 AM.
[TESTS & RESULTS] Confirmed 3 test users on Floor 2 cannot map \\\\filesrv-fin\\payroll; error "Network path was not found". Local internet & email unaffected.
[ESCALATION] Functional -> L3 SysAdmin Queue; Hierarchical -> Service Desk Lead alerted via bridge channel.
[USER CONTACT] Finance Lead Maya Patel (ext. 4412) waiting for 30-min progress update.`,
        customerReply:
          'Hi Maya — Thank you for reporting this right away. We verified this is affecting multiple users on the Finance shared drive and have escalated it with full diagnostics to our senior systems team and service desk lead. We will update you by 9:35 AM.',
        escalationCriteria:
          'Multi-user outages (>5 affected), suspected core server/network drops, or confirmed security incidents escalate immediately.',
      },
    },

    commonTraps: [
      {
        trap: 'Claiming in an interview: "I never escalate—I always figure everything out myself."',
        reality:
          'Interviewers view "never escalating" as dangerous ego: wasting two hours while 30 users sit idle breaches SLAs and risks breaking systems outside your access level.',
      },
      {
        trap: 'Dumping every unfamiliar ticket straight to L2 without recording what you checked.',
        reality:
          '"I escalate everything" shows weak ownership. Attempt basic triage first and send verified evidence upward.',
      },
    ],

    keyTerms: [
      {
        term: 'Managed Service Provider (MSP)',
        shortDef: 'Outsourced IT company supporting multiple client businesses under service contracts.',
        fullDef:
          'Unlike an internal IT department serving one employer, MSP technicians handle queues spanning many separate client networks, tools, and agreements.',
      },
      {
        term: 'Follow-the-Sun Support',
        shortDef: 'Global shift handover across time zones so daytime teams continuously handle tickets.',
        fullDef:
          'Regional desks (e.g., APAC -> EMEA -> Americas) pass active open tickets cleanly at shift end so global staff get live daytime support around the clock.',
      },
      {
        term: 'Level 0 (L0 Self-Service)',
        shortDef: 'Automated help articles, FAQs, chatbots, and password-reset portals used directly by employees.',
        fullDef:
          'Resolves simple requests at zero analyst wait time, reducing queue load for human Tier 1 teams.',
      },
      {
        term: 'Functional vs. Hierarchical Escalation',
        shortDef: 'Moving work to deeper specialists (functional) vs. alerting managers on urgency/risk (hierarchical).',
        fullDef:
          'Both escalation directions can happen together during a major outage or high-sensitivity security incident.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-013-q1',
        prompt: 'What distinguishes a Managed Service Provider (MSP) service desk from an internal in-house IT desk?',
        options: [
          'An MSP supports multiple separate client companies under service contracts, whereas an in-house team supports one organization.',
          'MSPs never use ticketing systems or SLAs.',
          'In-house IT teams are forbidden from visiting user desks.',
          'MSPs only provide Level 0 chatbots without human analysts.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: MSPs manage diverse environments across many contracted clients; in-house IT focuses deeply on a single company.',
          'Incorrect: MSPs rely heavily on tickets and strict contractual SLAs.',
          'Incorrect: In-house desktop/field technicians routinely support users directly at their desks.',
          'Incorrect: MSPs staff human L1, L2, and L3 engineers.',
        ],
        takeaway: 'In-house IT serves one employer; MSPs support multiple client companies.',
      },
      {
        id: 'itsup-013-q2',
        prompt: 'A shared drive stops working for 30 Finance employees 20 minutes before payroll cutoff. Which escalations should L1 perform?',
        options: [
          'Both functional escalation (to L3 Systems/Network specialists with scope & error details) and hierarchical escalation (alerting the team lead/manager).',
          'Neither—wait two hours to see if it clears by itself.',
          'Tell all 30 users to submit Level 0 FAQ searches.',
          'Forward the ticket only to an outside laptop warranty vendor (L4).',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Wide business impact requires specialist technical investigation AND management visibility immediately.',
          'Incorrect: Waiting silently breaks critical business deadlines.',
          'Incorrect: Self-service articles cannot restore a down internal server share.',
          'Incorrect: L4 hardware vendors do not manage your internal Finance file servers.',
        ],
        takeaway: 'Major multi-user incidents trigger functional specialist routing plus hierarchical management alerts.',
      },
      {
        id: 'itsup-013-q3',
        prompt: 'Which description accurately explains Level 4 (L4) support?',
        options: [
          'External product vendors or suppliers escalated to when software bugs, cloud platform outages, or hardware warranties require supplier help.',
          'First-contact service desk trainees answering password resets.',
          'Automated FAQ articles inside the self-service portal.',
          'Local office receptionists.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: L4 sits outside the company—hardware manufacturers, ISP engineers, or SaaS platform vendors.',
          'Incorrect: Password resets and frontline intake belong to L0/L1.',
          'Incorrect: Self-service portals are Level 0.',
          'Incorrect: Receptionists are outside IT support tiers.',
        ],
        takeaway: 'L0 = Self-service, L1 = First line, L2 = Second line/Desktop, L3 = Internal specialists, L4 = External vendors.',
      },
      {
        id: 'itsup-013-q4',
        prompt: 'In an interview, when asked "When would you escalate a ticket?", what is the strongest answer?',
        options: [
          'Name clear triggers—lack of required permissions, wide multi-user impact, security concerns, or exceeding a time-box—and stress sending full diagnostic evidence.',
          'Say "I never escalate because I figure everything out alone."',
          'Say "I escalate right away if the first reboot fails."',
          'Say "Only when a user yells loudly."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Demonstrates judgment, teamwork, time management, and zero ticket bouncing.',
          'Incorrect: Signals stubbornness and poor SLA awareness.',
          'Incorrect: Shows zero diagnostic effort before bothering L2.',
          'Incorrect: Escalation follows technical/business triggers, not volume of yelling.',
        ],
        takeaway: 'Strong analysts escalate intentionally on clear triggers with complete diagnostic notes.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Draft a Complete 30-User Outage Escalation Note',
      instructions: [
        'Write a structured escalation note for: "A shared drive has been unavailable for 30 users for 20 minutes."',
        'Include: affected user count, business deadline/impact, exact symptom/error text, two diagnostic checks L1 ran, functional target team, and hierarchical manager alert.',
      ],
      verificationCheck: 'Another technician reading your note can begin L3 investigation without calling any user back to repeat basics.',
    },

    summaryBullets: [
      'In-house desks serve one organization; MSPs support multiple client organizations under contracts.',
      'Coverage models range from business-hours + on-call rotas to 24/7 global follow-the-sun handovers.',
      'L0 self-service, L1 triage, L2 deeper/desktop work, L3 core specialists, and L4 external vendors cover all support depth.',
      'Functional escalation seeks specialist skills/access; hierarchical escalation alerts management to urgency or risk.',
      'Never bounce empty tickets—attach exact error text, scope, checks already completed, and user contact info.',
    ],

    sourcesToVerify: [
      'ITIL 4 Practice Guide — Service Desk & Incident Management',
      'HDI Support Center Analyst Standards — Support Tiers & Escalation Procedures',
    ],
  },

  'itsup.0.3.1': {
    id: 'itsup.0.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.3 Customer Service Skills',
    code: '0.3.1',
    title: 'Active Listening, Open-to-Closed Questioning, Plain Language & Accessibility Awareness',
    readMinutes: 11,
    prerequisites: ['0.1.1', '0.1.2'],
    versionScope: 'shared',

    learningObjectives: [
      'Execute the full shape of a strong support contact from greeting and active listening to expectation setting and closing the loop.',
      'Move smoothly from broad open questions to targeted closed questions while respecting conversational silence.',
      'Deliver calm, empathetic statements without falsely blaming IT systems or patronizing callers.',
      'Apply clear phone, chat, email, cross-cultural, and accessibility practices (screen readers, high contrast/large text).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Two Technicians, Same Fix—Opposite Feedback Scores',
      narrative:
        'A nervous remote accountant using a screen reader calls because a browser form stops submitting expense receipts. Tech A interrupts mid-sentence, pastes a 12-line internal checklist stuffed with acronyms, and drops off as soon as the button reappears. Tech B pauses while the caller explains, confirms in plain words, gives one keyboard instruction at a time, sets a clear callback expectation, and asks the user to verify one real receipt goes through. Tech B gets a glowing review and zero callbacks.',
    },

    plainEnglish: {
      analogyTitle: 'A Friendly Driving Instructor vs. Shouting Turn-by-Turn GPS',
      analogy:
        'Nobody enjoys a navigator who yells five turns ahead ("Take exit 4B, merge, bear left, open lane 2, check mirrors") while you are stressed in traffic. Great support speaks one step at a time, confirms you arrived safely at each corner, and adjusts to how the driver sees and hears the road.',
      technicalDefinition:
        'Service desk communication pairs structured diagnostic questioning (open -> closed funnel) with active listening, empathy, plain-language stepwise guidance, explicit expectation management, and inclusive accessibility habits.',
      paragraphs: [
        'Every strong interaction follows the same seven-beat arc: **greet -> listen -> confirm you understood -> explain in plain language -> set expectations -> fix or hand over -> close the loop** by confirming the user is happy and working.',
        '**Active listening** means letting the caller finish, repeating the core issue back in your own words, and refusing to interrupt—even when there are three seconds of silence while they think or locate a screen.',
        'Empathy validates disruption ("I can see how stressful this is with payroll closing at 4 PM—let’s get you moving"). Notice what empathy is *not*: you never need to invent excuses or agree that "our software is terrible." You focus forward on ownership.',
      ],
    },

    deepDive: {
      intro: 'Follow this communication toolkit across phone, chat, email, and accessibility needs.',
      steps: [
        {
          step: '01',
          title: 'Open-to-Closed Questioning Funnel',
          explanation:
            'Open broad ("What were you doing right before it stopped?"), then narrow with targeted closed questions ("Does it happen on a second website?" "What exact message appears?"). Use the standard 6: Exact behavior, Exact error text, Start time, Recent changes, Others affected, Steps tried.',
        },
        {
          step: '02',
          title: 'One-Step Plain Instructions',
          explanation:
            'Skip internal jargon. Say: "Press the Windows key on your keyboard and type Settings, then tell me when that window opens." Confirm step 1 succeeded before announcing step 2.',
        },
        {
          step: '03',
          title: 'Channel Etiquette (Phone, Chat, Email)',
          explanation:
            'Phone: standard greeting (company, your name, offer to help), ask permission before putting on hold, return within ~2 minutes, summarize next steps. Chat: acknowledge fast, keep paragraphs tiny, personalize saved replies, tell users if juggling multiple chats. Email: descriptive subject, numbered steps, polite tone, careful with Reply All.',
        },
        {
          step: '04',
          title: 'Cultural, Time-Zone & Accessibility Care',
          explanation:
            'Confirm local time zones ("2 PM Eastern / 7 PM London") rather than ambiguous "2 PM." Adapt smoothly for screen readers (avoid "click the little blue gear at top right"—give keyboard shortcuts or exact button names), large text/zoom, or hearing preferences (offer chat/captions).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '7-Beat Customer Contact Flow & Open-to-Closed Funnel',
        asciiFallback: `[1. Greet] -> [2. Active Listen (respect silence)] -> [3. Paraphrase & Confirm]
                                                              |
    [4. Open Qs ("What happened?")] ---> [5. Closed Qs ("Other sites? Exact code?")]
                                                              |
[7. Confirm Fix & Close Loop] <--- [6. One-Step Plain Guidance / Realistic Update Time]`,
      },
      workedExample: {
        title: 'Adapting a Browser Fix for a Screen-Reader User by Phone',
        context: 'Caller Priya uses NVDA screen reading software and hears "Submission error" on a web form.',
        steps: [
          'Listen uninterrupted while Priya describes navigating the expense form.',
          'Paraphrase back: "Got it—so every required field looks filled, yet hitting Submit reads back a validation failure."',
          'Instead of "click the red exclamation icon near the corner," give clear keyboard cues: "Press Tab slowly through the form—does your screen reader announce any field marked Invalid or Required?"',
          'Priya discovers the Date format dropdown defaulted blank; she selects the date, hears "Receipt submitted," and confirms the confirmation number.',
        ],
        outcome: 'Resolved empathetically in four minutes without condescending sight-based assumptions.',
      },
    },

    supportWalkthrough: {
      intro: 'Keep these phrasing habits ready for calm, rushed, and frustrated contacts.',
      steps: [
        {
          phase: 'Expectation Setting',
          action: 'Give realistic timelines and update users proactively BEFORE they chase you.',
          whyItWorks: 'Users rarely complain about a 2-hour fix when told honestly at minute 5; silent waiting breeds anger.',
        },
        {
          phase: 'Abusive Boundary',
          action: 'If a caller turns genuinely abusive or uses slurs after calm redirection, stay composed and involve your team lead.',
          whyItWorks: 'Empathy never obligates any technician to absorb personal abuse.',
        },
      ],
      questionsToAsk: [
        '"Walk me through what you were doing right when that error popped up."',
        '"Does it behave the same way in a second browser window or only this one?"',
        '"Which time zone are you in today so I book our callback cleanly?"',
      ],
      sampleUserWording: [
        {
          situation: 'Asking permission before a brief hold',
          sayThis:
            '"May I place you on a brief hold for up to two minutes while I check that group permission with my teammate?"',
        },
        {
          situation: 'Handling chat concurrency transparently',
          sayThis:
            '"Thanks for waiting—I’m helping one other colleague at the same time, and I’m looking at your error screenshot right now."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Applications -> Web Form Error (Accessibility Support)',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium (Expense deadline tomorrow) = P3 Medium',
        internalNotes: `[ISSUE] User using screen reader encountered silent validation block on Expense Portal Submit button.
[ACTION] Guided step-by-step using keyboard navigation labels; identified blank Date dropdown field.
[VERIFICATION] User confirmed confirmation receipt #EXP-882 appeared; offered email follow-up in plain numbered format.`,
        customerReply:
          'Hi Priya — Thanks for calling in today! As confirmed on the phone, selecting the Date dropdown cleared the validation block and your receipt #EXP-882 submitted cleanly. Please let us know if any other portal form reads unclearly so we can flag accessibility improvements too.',
        escalationCriteria:
          'Escalate persistent accessibility keyboard traps in internal portals to the Applications Team with screen-reader name and field label.',
      },
    },

    commonTraps: [
      {
        trap: 'Telling a visually impaired user "Click the tiny icon in the upper-right corner."',
        reality:
          'Screen-reader and magnification users navigate by headings, landmarks, and exact button names—always speak exact label names and keyboard cues.',
      },
      {
        trap: 'Putting a caller on hold without asking or leaving them silent for 6 minutes.',
        reality:
          'Always ask permission before holding, check back within ~2 minutes even if still investigating, and thank them for holding.',
      },
    ],

    keyTerms: [
      {
        term: 'Active Listening',
        shortDef: 'Letting the speaker finish uninterrupted, respecting silence, and paraphrasing back to confirm.',
        fullDef:
          'Prevents technicians from jumping to conclusions on symptom 1 when the true clue arrives at symptom 3.',
      },
      {
        term: 'Open vs. Closed Questions',
        shortDef: 'Broad discovery prompts ("What happened?") narrowed down into yes/no or factual checks.',
        fullDef:
          'Starting open avoids boxing out unexpected causes; narrowing closed questions isolates scope rapidly.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-031-q1',
        prompt: 'Why should an analyst pause patiently for a couple of seconds of silence while a user explains their issue?',
        options: [
          'Users often need a moment to check their screen or organize details; interrupting breaks trust and hides key facts.',
          'Silence means the call dropped and you should immediately hang up.',
          'You should fill every pause by reading system logs aloud.',
          'Pause time automatically pauses the SLA clock.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Respecting natural silence gives users room to share crucial context like recent changes.',
          'Incorrect: Confirm verbally before assuming a dropped call.',
          'Incorrect: Reading internal log noise confuses users.',
          'Incorrect: Only formal ticket status (such as Pending User) affects SLA clocks.',
        ],
        takeaway: 'Active listening respects thinking silence and confirms understanding before acting.',
      },
      {
        id: 'itsup-031-q2',
        prompt: 'Which instruction works best when guiding a non-technical user or screen-reader user over the phone?',
        options: [
          '"Press the Windows key, type Settings, press Enter, and tell me what appears on your screen."',
          '"Open regedit, navigate to HKLM, clear cached policies, and reboot."',
          '"Click the little thing next to the squiggle on the far right."',
          '"Just fix your DNS and ping the gateway."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: One plain, concrete step at a time with explicit feedback confirmation.',
          'Incorrect: Raw registry steps without guidance risk breaking the OS.',
          'Incorrect: Vague visual descriptions fail completely for magnified or screen-reader users.',
          'Incorrect: Heavy networking jargon overwhelms beginners.',
        ],
        takeaway: 'Deliver one plain instruction at a time and confirm completion before moving on.',
      },
      {
        id: 'itsup-031-q3',
        prompt: 'A user asks how long a specialist fix will take, and you do not control the specialist’s calendar. What should you say?',
        options: [
          'Explain honestly that the specialist team will review it next, give a realistic check-in time when YOU will update them, and honor that update.',
          'Promise "It will definitely be fixed in 10 minutes" so they feel better now.',
          'Say "No idea, don’t call back."',
          'Blame the specialist team for being slow.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Never promise outcomes you do not control—promise reliable communication check-ins instead.',
          'Incorrect: Broken guarantees destroy credibility far faster than an honest timeline.',
          'Incorrect: Dismissive and unprofessional.',
          'Incorrect: Never throw internal colleagues under the bus.',
        ],
        takeaway: 'Set realistic expectations and update users proactively before they chase you.',
      },
      {
        id: 'itsup-031-q4',
        prompt: 'What is the danger of copying and pasting saved chat replies without editing?',
        options: [
          'Replies can sound robotic, miss details the user already gave, or mismatch the user’s exact situation.',
          'Saved replies encrypt ticket notes automatically.',
          'Chat software bans saved replies after three uses.',
          'Saved replies delete user accounts.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Always tailor saved templates to reference the caller’s name and specific facts.',
          'Incorrect: Templates are plain text accelerators.',
          'Incorrect: Ticketing and chat platforms encourage tailored templates.',
          'Incorrect: Templates have no account-deletion behavior.',
        ],
        takeaway: 'Use saved replies as starting drafts—personalize every message before hitting send.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Three-Call Communication Role-Play',
      instructions: [
        'Write or rehearse aloud three 60-second openings & closing summaries for: (a) a calm user asking a how-to question, (b) a rushed manager leaving for a flight, and (c) an angry caller hit by the same bug twice.',
        'Keep instructions strictly one step at a time with zero unexplained acronyms.',
      ],
      verificationCheck: 'Every role-play includes greeting, paraphrase confirmation, realistic update expectation, and loop-closing check.',
    },

    summaryBullets: [
      'Great contacts follow 7 steps: greet, listen, paraphrase, plain explanation, clear expectations, resolve/handoff, confirm happiness.',
      'Start with broad open questions, then narrow using closed checks across exact error, timing, changes, and scope.',
      'Give one plain instruction at a time; adapt labels and keyboard steps for accessibility tools.',
      'On phone holds, ask permission first and check back within ~2 minutes; personalize chat/email templates.',
      'Never promise timelines you do not control—commit to proactive update checkpoints instead.',
    ],

    sourcesToVerify: [
      'HDI Support Center Analyst Standards — Customer Service & Communication',
      'W3C Web Accessibility Initiative (WAI) — Communicating Effectively with Assistive Technology Users',
    ],
  },

  'itsup.0.4.1': {
    id: 'itsup.0.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 0: Foundations',
    topicTitle: '0.4–0.5 Professional Habits & Day-1 Vocabulary',
    code: '0.4.1',
    title: 'Daily Habits, Confidentiality, Research Discipline & Essential Day-1 Terms (Fast Startup to Root Cause)',
    readMinutes: 11,
    prerequisites: ['0.1.1', '0.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Apply core professional service desk habits: real-time documentation, ticket ownership, confidentiality, honest humility, and structured research.',
      'Define foundational day-1 terms cleanly in non-technical words: endpoint, workstation, peripheral, patch/update, driver, firmware, outage vs. degradation, and backup/restore.',
      'Explain why Windows Fast Startup makes "Shut down" behave like hibernation so a true Restart fixes more issues.',
      'Distinguish clearly between a workaround, an immediate fix, and the underlying root cause.',
    ],

    whyThisMatters: {
      scenarioTitle: 'The "I Shut Down Three Times Already!" Trap',
      narrative:
        'A finance analyst insists her sluggish laptop was turned off three times today yet still has 19 days of kernel uptime and refuses to pick up a network change. A beginner either accuses the user of lying or immediately escalates to Tier 2. Someone grounded in day-1 vocabulary recognizes Windows Fast Startup immediately—explaining calmly why **Restart** differs from **Shut down**, capturing facts accurately in the ticket, and solving the stall in sixty seconds.',
    },

    plainEnglish: {
      analogyTitle: 'Bookmarking a Dirty Workbench vs. Clearing the Bench Completely',
      analogy:
        'Using **Shut down** with Windows Fast Startup is like snapping a photo of your messy desk, packing everything into a drawer overnight, and dumping the exact same clutter back out at 8 AM. Clicking **Restart** sweeps the workbench clean and loads a fresh operating state from scratch.',
      technicalDefinition:
        'Service desk professionalism rests on auditable documentation, strict least-privilege confidentiality, truthful uncertainty ("I don’t know yet, let me check"), and crisp plain-language command of core endpoint vocabulary.',
      paragraphs: [
        'Rule #1 on every help desk: **if it is not written down, it did not happen.** Clear notes protect you, inform your shift partners, prevent repeat diagnostic questions, and grow the team knowledge base.',
        'Equally vital is **honesty**. Saying *"I don’t know yet, let me verify and get right back to you"* beats guessing or bluffing every time. Guessing breaks production configs and ruins trust.',
        'Every morning you will hear words like **endpoint**, **peripheral**, **driver**, **firmware**, **outage**, **workaround**, and **root cause**. Being able to translate every one of those words into a single calm sentence for an accountant or nurse is half the job—and a classic interview screening test.',
      ],
    },

    deepDive: {
      intro: 'Master the five daily professional habits alongside the day-1 vocabulary toolkit.',
      steps: [
        {
          step: '01',
          title: 'Five Non-Negotiable Daily Habits',
          explanation:
            'Document as you go; own each contact until resolved or formally handed over; prioritize by Impact rather than loud callers; guard confidentiality (never share/ask passwords, access only needed records); and practice resilience between stressful calls.',
        },
        {
          step: '02',
          title: 'Research Discipline Before Asking Colleagues',
          explanation:
            'Search the **exact error string** in the Knowledge Base and vendor docs first. When asking a senior colleague, bring one specific question plus the two checks you already ran—never "how do I fix this?"',
        },
        {
          step: '03',
          title: 'Reboot vs. Restart vs. Shut Down (Fast Startup)',
          explanation:
            'A **Restart** (reboot) fully tears down the operating system kernel and drivers and starts clean. On modern Windows, default **Shut down** uses Fast Startup—saving kernel/driver state like hibernation—which leaves buggy drivers stuck across power-offs!',
        },
        {
          step: '04',
          title: 'Workaround vs. Fix vs. Root Cause',
          explanation:
            'A **workaround** keeps the person working around a fault (e.g., signing into webmail while desktop email crashes). A **fix** removes the immediate fault for that user. The **root cause** is the underlying defect causing the fault so it stays gone permanently.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Day-1 Troubleshooting Vocabulary: Workaround vs Fix vs Root Cause',
        asciiFallback: `[Fault Hits User: Desktop App Crashes at Launch]
       |
       +---> [Workaround] ---> Open Web Version in Browser (user works in 30 sec!)
       |
       +---> [Immediate Fix] ---> Repair corrupt app profile / disable bad add-in
       |
       +---> [Root Cause] ---> Vendor update v4.2 had broken PDF library -> Patch Fleet`,
      },
      workedExample: {
        title: 'Day-1 Vocabulary & Habits in Action',
        context: 'User says their monitor flickers even after "turning the laptop off and on," and asks why you don’t just take their password to test.',
        steps: [
          'Confidentiality habit: "For your security, please never share your password with anyone, including IT—I’ll guide you or observe while you enter it yourself."',
          'Plain explanation of Restart vs Shut down: "Windows Fast Startup saves background hardware drivers when shutting down. Let’s click Start -> Power -> Restart so your graphics **driver** (the bridge between Windows and your screen hardware) loads completely fresh."',
          'If desktop video fails right before their client call, offer a quick **workaround** (mirror to laptop screen or join via second device) while booking a dock **firmware** (chip-level built-in software) update.',
          'Write everything in a daily personal fix log so you never solve the same error blindly twice.',
        ],
        outcome: 'Password stayed private, hardware state cleared cleanly, user met their client on time, and you added a repeatable fix to your log.',
      },
    },

    supportWalkthrough: {
      intro: 'Daily personal discipline keeps queues calm and interviews effortless.',
      steps: [
        {
          phase: 'Never Guess Silently',
          action: 'When unsure, state "I’m verifying the exact cause in our documentation—I’ll update you in 10 minutes."',
          whyItWorks: 'Honesty builds credibility and keeps wrong guesses from turning minor hiccups into outages.',
        },
        {
          phase: 'Separate Symptom & Root Cause',
          action: 'Deliver a workaround quickly if deadline pressure is high, then pursue the clean fix.',
          whyItWorks: 'Users care about finishing their task first; background fixes can happen safely afterward.',
        },
      ],
      questionsToAsk: [
        '"When you turned the laptop off earlier, did you click Shut down or Restart?"',
        '"Is the service completely unavailable (outage), or working very slowly (degradation)?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a workaround vs permanent fix simply',
          sayThis:
            '"To keep you on schedule right now, let’s open the web version as a quick workaround—then once your meeting ends, I’ll remove the corrupted app update permanently."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Workstation -> Display / Driver Stall',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium = P3 Medium',
        internalNotes: `[FACTS] User reported external monitor flicker persisted after clicking "Shut down" twice. Task Manager confirmed uptime = 14 days (Fast Startup).
[WORKAROUND] Confirmed laptop built-in screen stayed crisp for 10 AM meeting.
[FIX] Executed full Windows Restart -> reloaded GPU driver -> verified steady 60 Hz output; scheduled dock firmware update for Friday 5 PM.`,
        customerReply:
          'Hi Sam — Great speaking with you! Doing a full Restart (rather than Shut down, which pauses Windows state for faster boot) cleared the stale display driver. Please reply if any flicker returns before Friday’s dock firmware update.',
        escalationCriteria:
          'Escalate if flicker persists across a known-good cable/monitor AND clean driver reload (points to physical GPU/port failure).',
      },
    },

    commonTraps: [
      {
        trap: 'Asking a coworker "How do I fix Outlook?" without researching first.',
        reality:
          'Good junior analysts first search the exact error string in the KB, check uptime/updates, and ask specifically: "I checked X and Y for error 0x8004010F; could this point to Z?"',
      },
      {
        trap: 'Telling a user "Yes, share your password in chat so I can test your mailbox faster."',
        reality:
          'NEVER ask for or handle a user’s plaintext password. Violates audit compliance, breaks security trust, and can cost your job.',
      },
    ],

    keyTerms: [
      {
        term: 'Endpoint & Peripheral',
        shortDef: 'Any user computing device (laptop, desktop, phone) vs. attached accessories (mouse, monitor, printer).',
        fullDef:
          'Workstations are desk-bound PCs; endpoints cover every user device; peripherals plug into or pair with them.',
      },
      {
        term: 'Driver vs. Firmware vs. Patch',
        shortDef: 'OS-to-hardware translator (driver), chip-embedded software (firmware), and bug/security update (patch).',
        fullDef:
          'Updating a graphics driver lives inside Windows; updating dock or router firmware flashes memory inside the hardware device itself.',
      },
      {
        term: 'Outage vs. Degradation',
        shortDef: 'Total service unavailability (outage) vs. working slowly or intermittently (degradation).',
        fullDef:
          'Distinguishing outage from degradation helps prioritize queues accurately and write clearer user status notices.',
      },
      {
        term: 'Workaround vs. Fix vs. Root Cause',
        shortDef: 'Temporary bypass (workaround), symptom repair (fix), and underlying defect removal (root cause).',
        fullDef:
          'Offer a workaround immediately when deadlines are tight, then resolve cleanly and address root causes permanently.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-041-q1',
        prompt: 'Why does clicking Restart often solve glitches that clicking Shut down missed on Windows?',
        options: [
          'Fast Startup makes Shut down hibernate the system kernel/driver state, whereas Restart tears down and reloads everything cleanly.',
          'Shut down only turns off the monitor, leaving the CPU running all night.',
          'Restart physically wipes user documents to save RAM.',
          'Shut down removes Windows updates automatically.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Fast Startup preserves kernel session data across Shut down; only a true Restart clears stale driver states.',
          'Incorrect: Shut down powers down hardware after saving kernel hibernation data.',
          'Incorrect: Restart preserves all saved files safely.',
          'Incorrect: Shut down never strips installed updates.',
        ],
        takeaway: 'Always test a true Restart—Fast Startup lets Shut down carry stale driver state forward.',
      },
      {
        id: 'itsup-041-q2',
        prompt: 'What is the cleanest interview answer when asked "What do you do when you don’t know the answer?"',
        options: [
          'Be honest with the user ("I don’t know yet, let me check"), search exact error text in the KB and official docs, test safely, or ask a colleague with what you already tried.',
          'Guess confidently so the user thinks IT knows everything.',
          'Leave the ticket unassigned in the queue until someone else notices.',
          'Reinstall the user’s entire operating system immediately.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Integrity + methodical research + respectful collaboration is what hiring managers look for.',
          'Incorrect: Bluffing damages trust and breaks systems.',
          'Incorrect: Silent abandonment violates ownership.',
          'Incorrect: Destructive and unnecessary.',
        ],
        takeaway: '"I don’t know yet, let me find out"—paired with exact-error research—is gold.',
      },
      {
        id: 'itsup-041-q3',
        prompt: 'A user’s desktop chat app crashes, so you guide them to open the browser version for their meeting while you repair the app later. What did you provide?',
        options: [
          'A workaround.',
          'A permanent firmware upgrade.',
          'A complete root-cause removal.',
          'A hardware RMA.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: A workaround bypasses the broken path so business work continues right away.',
          'Incorrect: No hardware chip code changed.',
          'Incorrect: The desktop app bug itself is still scheduled for fix.',
          'Incorrect: No physical part was returned.',
        ],
        takeaway: 'Good support uses a fast workaround to protect deadlines while engineering the true fix.',
      },
      {
        id: 'itsup-041-q4',
        prompt: 'Which set accurately defines Driver and Firmware?',
        options: [
          'Driver: OS software translating for hardware; Firmware: low-level software built directly into a device.',
          'Driver: physical USB cable; Firmware: monthly Excel spreadsheet.',
          'Driver: cloud backup rule; Firmware: screen protector.',
          'Both terms mean exactly the same thing as "Workstation."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Drivers run inside the OS; firmware resides on the device’s internal flash chip.',
          'Incorrect: Both are software layers, not cables or spreadsheets.',
          'Incorrect: Neither refers to cloud storage or glass.',
          'Incorrect: Workstation refers to the desktop computer itself.',
        ],
        takeaway: 'Explain Driver, Firmware, Endpoint, Peripheral, Outage, and Backup in one crisp sentence each.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Build Plain-Language Flashcards & Daily Fix Log',
      instructions: [
        'Write 1-sentence, zero-jargon definitions for: endpoint, workstation, peripheral, patch, driver, firmware, outage, degradation, backup, restore, workaround, and root cause.',
        'Explain each out loud to a non-technical friend without using nested acronyms.',
      ],
      verificationCheck: 'Every term takes under 15 seconds to explain clearly to someone outside IT.',
    },

    summaryBullets: [
      'Document facts, timestamps, checks, and outcomes continuously—if it isn’t written down, it didn’t happen.',
      'Protect confidentiality strictly: never ask for passwords and access only records tied to an active ticket.',
      'Own uncertainty honestly ("I don’t know yet, let me check") and search exact error wording before escalating.',
      'Use Restart—not Shut down—when suspecting OS/driver glitches because Windows Fast Startup hibernates kernel state.',
      'Pair rapid workarounds for blocked users with clear fixes and root-cause follow-through.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 2 (220-1102) — Professionalism & Documentation Standards',
      'Microsoft Learn — Windows Fast Startup Behavior & Restart vs Shutdown',
    ],
  },

  'itsup.1.4.1': {
    id: 'itsup.1.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 1: Tickets and the Support Process',
    topicTitle: '1.2–1.5 Triage, Priority Rules, Duplicates & SLA Clocks',
    code: '1.4.1',
    title: 'Ticket Anatomy, Triage Priority Math, Duplicate Linking, OLAs & SLA Pause Clocks (Vendor-Neutral)',
    readMinutes: 13,
    prerequisites: ['1.1.1', '1.1.2'],
    versionScope: 'shared',

    learningObjectives: [
      'Complete every core ticket field accurately—including Requester vs. Affected User, descriptive titles, resolution codes, and asset links.',
      'Apply Impact × Urgency objectively even when a senior executive requests a low-impact fix during a broad outage.',
      'Identify duplicate tickets and link them under a parent issue so one fix updates every impacted user.',
      'Calculate SLA due times across business vs. calendar hours, Pending-on-User clock pauses, OLAs, and Underpinning Contracts.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Two Simultaneous Tickets: The CEO’s Printer vs. 50 Locked-Out Staff',
      narrative:
        'At 9:10 AM two tickets drop into the queue: (1) The CEO cannot print one quarterly handout to her office printer, though hallway printers work; (2) 50 Operations staff are completely blocked from signing in before customer calls open. Meanwhile, three more staff report the same login freeze. Knowing how to rank Impact × Urgency, communicate respectfully to the CEO without falsely bumping P1, link duplicates, and track SLA pause rules keeps the desk calm and compliant.',
    },

    plainEnglish: {
      analogyTitle: 'Emergency Room Triage + Parking Meter That Pauses While Waiting on You',
      analogy:
        'A hospital mayor with a stubbed toe still waits kindly behind an ambulance carrying five heart-attack patients—not out of disrespect, but because **Impact** dictates survival. Meanwhile, think of an SLA clock like a parking meter: it runs while the ball is in IT’s court, and **pauses** (when policy allows) while IT waits for the user to reply.',
      technicalDefinition:
        'Structured ticket triage evaluates blast radius (Impact), time sensitivity (Urgency), and parent-child duplication, governed by contractual SLAs, internal OLAs, and third-party Underpinning Contracts.',
      paragraphs: [
        'Good tickets distinguish **Requester** (e.g., an assistant logging on someone’s behalf) from **Affected User** (who actually faces the broken app). A sharp title reads `"Outlook crashes when opening PDFs (Win 11, started this AM)"`, never `"Email problem."` Consistent **Categories** (`hardware, software, network, accounts/access, email, printing, security, requests`) and **Resolution Codes** turn chaotic tickets into useful dashboards.',
        '**VIP ≠ Automatic P1.** Executives deserve attentive communication and polite expectations, yet **Impact × Urgency** still decides queue order: 50 people locked out beats one executive unable to print on one printer.',
        'When deadlines loom, distinguish **SLA** (promise to the customer), **OLA (Operational Level Agreement)** (promise between internal IT teams, e.g., Network responds to Service Desk in 30m), and **Underpinning Contract (UC)** (the promise an external ISP or vendor makes to IT).',
      ],
    },

    deepDive: {
      intro: 'Master ticket anatomy, priority triage, SLA due-time math, and duplicate parent linking.',
      steps: [
        {
          step: '01',
          title: 'Complete Field Anatomy & Form Templates',
          explanation:
            'Capture Who (requester + affected user), What (clear summary, category/subcategory), Seriousness (Impact × Urgency -> Priority), Ownership (status, assignee, assignment group/queue), Context (intake channel, created/updated times, attachments, linked assets/tickets), and Closure (resolution note + resolution code).',
        },
        {
          step: '02',
          title: 'Duplicate Detection & Parent-Child Linking',
          explanation:
            'Before working a spike of similar tickets independently, search open active records. Link duplicates to one parent record so resolving the parent sends consistent updates to every affected user automatically.',
        },
        {
          step: '03',
          title: 'Business Hours vs. Calendar Hours & Pending Pauses',
          explanation:
            'Example: A P2 ticket logged at 4:00 PM with an 8-business-hour SLA (8 AM–5 PM office) has 1 hour burned today and 7 hours tomorrow (due 4:00 PM Day 2). If placed in "Pending — Waiting on User" for 3 business hours while waiting for screenshots, policy typically pauses the clock, pushing the deadline by 3 business hours.',
        },
        {
          step: '04',
          title: 'At-Risk Warnings & Reopen Triggers',
          explanation:
            'Ticketing tools fire At-Risk alerts (for example at 75% SLA elapsed) before a Breach records. Never close silently—set to Resolved awaiting confirmation, then reopen the same ticket (keeping history) if the symptom immediately returns.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'SLA Clock Lifecycle Across Active & Pending-User States',
        asciiFallback: `[Ticket Created] --> [New / Assigned / In Progress: SLA RUNNING]
                             |
   Waiting on IT / Internal? | (SLA Keeps Running! Check OLA)
   Waiting on User Reply?    |---> [Pending User: SLA PAUSED (per policy)]
                                         | (User replies)
                                         v
                             [Resumed: SLA RUNNING] --> [Resolved -> User Confirms -> Closed]
                                                              | (Breaks again)
                                                              v
                                                        [Reopened (keep audit history)]`,
      },
      workedExample: {
        title: 'Priority & SLA Math in a Real Queue Spike',
        context: '9:00 AM Monday (Business hours 08:00–17:00). P1 = 15m resp / 4h res; P2 = 1h / 8h; P3 = 4h / 3 business days; P4 = 1 day / 5 days.',
        steps: [
          'Ticket A (CEO single printer jam; hallway printer available): Impact = Low (1 user, workaround exists) × Urgency = Medium -> P3 Medium. Reply politely in 15 mins with hallway printer location, then fix jam cleanly.',
          'Ticket B (50 users cannot sign in): Impact = High × Urgency = High -> P1 Critical! Start immediate triage and link 4 incoming duplicate calls to this single parent incident.',
          'Ticket C (P2 logged at 15:00 Mon; user replies only after 2 business hours spent in Pending User on Tue morning): 15:00–17:00 Mon = 2h burned; 08:00–10:00 Tue paused in Pending User -> 6h remaining starting 10:00 Tue -> Due 16:00 Tue.',
        ],
        outcome: 'Fifty locked-out workers get immediate focus, the CEO feels warmly cared for, and SLA math stays exact.',
      },
    },

    supportWalkthrough: {
      intro: 'Follow this sequence on every incoming ticket during peak volume.',
      steps: [
        {
          phase: '1. Search Duplicates',
          action: 'Check recent open tickets in the last 60 minutes before diving deep.',
          whyItWorks: 'Prevents 5 analysts from debugging the exact same server blip independently.',
        },
        {
          phase: '2. Title & Tag Cleanly',
          action: 'Rewrite vague user portal subjects ("Help!") into clear diagnostic titles before reassigning.',
          whyItWorks: 'Saves every downstream analyst 5 minutes reading raw thread history.',
        },
      ],
      questionsToAsk: [
        '"Are you submitting this for yourself, or on behalf of a colleague?"',
        '"Is there a nearby device or web version you can use while we solve this?"',
      ],
      sampleUserWording: [
        {
          situation: 'Updating a VIP politely while working a broader P1 outage first',
          sayThis:
            '"Hi Elena — I received your printer ticket and routed floor support to clear that tray. In the meantime, Printer East-2 right outside your door is online. Our team is actively mitigating a wider sign-in disruption affecting 50 staff right now, and your tray fix will follow right behind it."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Authentication -> Multi-User Sign-In Fault (Parent Incident)',
        priorityFormula: 'Impact: High (50 staff) × Urgency: High = P1 Critical',
        internalNotes: `[PARENT TICKET] Linked 4 duplicate reports (#INC-902, #903, #905, #906).
[SLA CHECK] Created 09:10 AM -> 15m response met at 09:14 AM; P1 4h resolution target = 13:10 PM.
[NEXT] Escalated functionally to Identity Team (30m OLA) + Manager hierarchical notice sent.`,
        customerReply:
          'We are investigating an active sign-in interruption affecting multiple staff since 9:05 AM. Your ticket is linked to our master tracking record, and our identity specialists are actively working on restoration. Next update at 9:45 AM.',
        escalationCriteria:
          'Trigger hierarchical escalation automatically when any active ticket hits 75% SLA elapsed without resolution path.',
      },
    },

    commonTraps: [
      {
        trap: 'Putting a ticket in "Pending — Waiting on User" simply while you wait on an internal team or external vendor.',
        reality:
          'Paused clocks exist ONLY when awaiting user action (under policy). Hiding behind "Pending User" while waiting internally skews reports and constitutes SLA metric gaming.',
      },
      {
        trap: 'Rewriting bad vague ticket titles ("Broken") straight into L2 queues unchanged.',
        reality:
          'A sharp, factual title ("Cannot map \\\\fin-srv\\reports — Error 0x80070035 on Win 11") is part of basic L1 intake craft.',
      },
    ],

    keyTerms: [
      {
        term: 'Requester vs. Affected User',
        shortDef: 'Person who opened the ticket vs. the person actually experiencing the issue.',
        fullDef:
          'Crucial when an assistant submits an issue for an executive or a manager requests setup for a new starter.',
      },
      {
        term: 'OLA & Underpinning Contract (UC)',
        shortDef: 'Internal IT team response promise (OLA) vs. external supplier contract promise (UC).',
        fullDef:
          'Both internal OLAs and external UCs must be shorter than or aligned to customer-facing SLAs.',
      },
      {
        term: 'SLA Pause (Pending User)',
        shortDef: 'Halting the resolution deadline clock while waiting on information from the user.',
        fullDef:
          'Prevents IT teams from unfairly breaching targets when a requester disappears on vacation without replying.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-141-q1',
        prompt: 'A manager logs a ticket saying their new intern starts Monday and needs a laptop. Who is the Requester and who is the Affected User?',
        options: [
          'The manager is the Requester; the intern is the Affected User (recipient).',
          'The IT analyst is the Requester; the manager is the vendor.',
          'Both fields are always identical.',
          'The intern is the Requester because they receive the laptop.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Distinguishing requester from affected user ensures notifications and equipment ownership point accurately.',
          'Incorrect: IT fulfills the request.',
          'Incorrect: On-behalf-of requests frequently split these two roles.',
          'Incorrect: The intern does not even have portal access yet to submit it.',
        ],
        takeaway: 'Track Requester (who submitted) separately from Affected User (who gets fixed/provisioned).',
      },
      {
        id: 'itsup-141-q2',
        prompt: 'Two tickets arrive together: the CEO cannot print to her desk printer (hallway printer works), while 50 employees cannot sign in. Which should be worked first?',
        options: [
          'The 50 employees locked out (higher business Impact), while politely replying to the CEO with the hallway workaround and timeline.',
          'The CEO automatically becomes P1 above everything else regardless of blast radius.',
          'Close both and ask them to try again after lunch.',
          'Work whichever arrived 10 seconds earlier regardless of priority.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Impact × Urgency ranks 50 blocked workers above one user with an available workaround, while proactive communication preserves VIP goodwill.',
          'Incorrect: Seniority alone never overrides company-wide P1 outages.',
          'Incorrect: Neglects critical downtime.',
          'Incorrect: FIFO order ignores SLA priority rules.',
        ],
        takeaway: '50 users blocked beats 1 user with a workaround—always pair strict priority with polite communication.',
      },
      {
        id: 'itsup-141-q3',
        prompt: 'What is an OLA (Operational Level Agreement)?',
        options: [
          'An internal target agreement between teams inside the same organization (such as Service Desk and Network Engineering).',
          'A contract between your company and a public internet service provider.',
          'A license agreement for open-source ticketing software.',
          'A Windows registry setting that disables print queues.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SLAs face users/customers; OLAs govern internal handoff speed between IT teams; UCs govern external vendors.',
          'Incorrect: External vendor promises are Underpinning Contracts (UCs).',
          'Incorrect: Licensing has nothing to do with SLA/OLA targets.',
          'Incorrect: Unrelated to Windows registries.',
        ],
        takeaway: 'SLA = IT to Customer; OLA = Internal IT Team to Team; UC = External Vendor to IT.',
      },
      {
        id: 'itsup-141-q4',
        prompt: 'Why should duplicate tickets about the same broken app be linked to a single parent record?',
        options: [
          'So one diagnostic investigation and resolution note updates every affected ticket consistently without duplicated technician effort.',
          'To delete all evidence so CSAT looks higher.',
          'Because ticketing tools cannot assign more than one ticket per hour.',
          'Linking automatically grants every caller admin access.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Parent-child linking coordinates mass notifications cleanly and ties incident volume accurately to one fault.',
          'Incorrect: Linked records remain visible in reporting—nothing is deleted.',
          'Incorrect: No such restriction exists.',
          'Incorrect: Linking is purely a tracking/workflow relationship.',
        ],
        takeaway: 'Link duplicates to one parent record to coordinate fixes and keep incident metrics honest.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Triage Practice & SLA Clock Calculation',
      targetTab: 'simulator',
      instructions: [
        'Calculate due times for a P2 ticket (8 business-hour resolution, Mon–Fri 08:00–17:00) opened at 14:00 Monday and paused 3 business hours while waiting on the user Tuesday morning.',
        'Open the Service Desk Simulator in Default (Vendor-Neutral) mode and practice triaging one Incident and one Onboarding Service Request.',
      ],
      verificationCheck: 'You correctly arrive at 16:00 Tuesday (14:00–17:00 Mon = 3h used; 08:00–11:00 Tue paused; 5h remaining 11:00–16:00 Tue).',
    },

    summaryBullets: [
      'Record Requester vs. Affected User, descriptive titles, clear categories, resolution codes, and affected devices on every ticket.',
      'Calculate Priority strictly from Impact × Urgency—never let job title or shouting override broad P1 outages.',
      'Link duplicate reports under one parent record so fixes propagate uniformly without wasted effort.',
      'Distinguish SLA (to customer), OLA (between internal IT teams), and Underpinning Contract (external vendors).',
      'Only pause SLA clocks during genuine Pending-on-User holds—never abuse Pending states to hide internal delays.',
    ],

    sourcesToVerify: [
      'ITIL 4 Practice Guide — Service Level Management & Incident Management',
      'HDI Support Center Practices — Triage, Priority Matrices & SLA Tracking',
    ],
  },

  'itsup.1.8.1': {
    id: 'itsup.1.8.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 1: Tickets and the Support Process',
    topicTitle: '1.6, 1.8–1.10 Escalation Hygiene, KB Deflection & Practice Tool',
    code: '1.8.1',
    title: 'Anti-Bouncing Escalations, Knowledge Base Lifecycle, Problem vs Change & Practice Ticketing Tool',
    readMinutes: 12,
    prerequisites: ['1.1.2', '1.4.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Prevent ticket bouncing ("ping-pong") by keeping ownership until the receiving team accepts and briefing the user honestly.',
      'Structure high-value internal vs. public knowledge base articles with owners, review dates, and ticket deflection value.',
      'Classify real workplace scenarios accurately across Incident, Service Request, Problem, and Change.',
      'Explain how the vendor-neutral practice ticketing simulator scores category, priority, questioning, notes, resolution, and SLA focus.',
    ],

    whyThisMatters: {
      scenarioTitle: 'The Four-Team "Hot Potato" Ticket',
      narrative:
        'A user reports every Friday their browser freezes on a cloud dashboard. Ticket #1 gets tossed from Service Desk -> Desktop -> Network -> Applications and right back to Service Desk three days later with zero notes except "Not ours." Nobody linked last month’s identical tickets as a Problem, nobody updated the outdated knowledge article, and the user calls back furious. Stopping ping-pong, writing living KB articles, and separating Incident/Request/Problem/Change fixes both user frustration and queue chaos.',
    },

    plainEnglish: {
      analogyTitle: 'A Warm Handoff vs. Throwing a Envelope Under Someone’s Locked Door',
      analogy:
        'If a hospital patient needs cardiology, a nurse walks the chart over and confirms the cardiologist took the file—never shoving the envelope under a dark door and walking away. Meanwhile, a **Knowledge Base** is the kitchen’s tested recipe binder: public pages let diners heat soup safely at home (**deflection**), while internal pages save staff 20 minutes per dish.',
      technicalDefinition:
        'Disciplined ticket operations combine non-bouncing escalation ownership, maintained internal/public knowledge bases, strict four-way ITSM classification (Incident, Service Request, Problem, Change), and scenario-based simulation practice.',
      paragraphs: [
        'Rule #1 of functional escalation: **the sender remains responsible until the receiver accepts**, and you always tell the user *who* now owns their ticket and when to expect the next update.',
        'A healthy **Knowledge Base (KB)** divides into **internal articles** (deep repair steps, scripts, escalation paths for IT staff) and **public articles** (plain step-by-step guides that let users solve issues themselves—known as **ticket deflection**). Stale articles hurt worse than no article, so every article needs an **owner**, **searchable keywords**, and a **review/retirement date**.',
        'Every piece of IT work fits four clear ITIL buckets in plain English: **Incident** (broken now—restore service fast), **Service Request** (standard approved ask—laptop, folder, install), **Problem** (underlying cause behind repeating incidents), and **Change** (planned modification—patch, firewall rule—needing approval so it doesn’t break things).',
      ],
    },

    deepDive: {
      intro: 'Review all four ITSM record types, KB anatomy, and how our in-app practice workbench grades your execution.',
      steps: [
        {
          step: '01',
          title: 'Good KB Article Structure & Maintenance',
          explanation:
            'Every article needs: (1) searchable symptom-rich Title, (2) Symptoms, (3) Cause, (4) Step-by-step Solution, (5) How to confirm it worked, and (6) Related articles + Owner & Review date. Write one whenever a fix repeats or took long research to crack.',
        },
        {
          step: '02',
          title: 'Incident vs. Request vs. Problem vs. Change',
          explanation:
            '"Adobe crashes on launch" = Incident. "Please install Adobe on my laptop" = Service Request. "Why do 12 Adobe users crash every Tuesday morning?" = Problem. "Roll out Adobe v24.2 patch Friday night" = Change.',
        },
        {
          step: '03',
          title: 'Anti-Bouncing Escalation Standard',
          explanation:
            'Include symptom, scope, checks attempted with exact results, exact error text, times, and user contact details. Never include plaintext passwords, security answers, sarcasm, or blame—tickets are permanently auditable.',
        },
        {
          step: '04',
          title: 'How the In-App Practice Tool Evaluates You',
          explanation:
            'Our built-in Service Desk Simulator scores 4 core dimensions cleanly: (1) asking clarifying & verification questions first, (2) running diagnostic commands before guessing, (3) executing only clean safe console actions in the right sequence, and (4) picking accurate Root Cause + Resolution wording.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'How Incident, Service Request, Problem & Change Connect',
        asciiFallback: `[Incident #1, #2, #3: Same Crash] ---> Linked to ---> [Problem Record: Root Cause Hunt]
                                                             | (Fix needs server update)
                                                             v
                                                      [Change Request: Approved Patch]
                                                             |
[Standard Need: "Install App"] ---> [Service Request (Pre-approved workflow)]`,
      },
      workedExample: {
        title: 'Turning a Repeated Incident into a Problem + Deflecting KB Article',
        context: 'Five staff call because self-service password resets fail when they leave an expired authenticator code open.',
        steps: [
          'Resolve each caller quickly as an Incident (fix symptom fast).',
          'Link all five to a Problem record investigating why the portal throws an unhelpful generic error.',
          'Submit a public KB article: "How to Reset Your Password Using Self-Service Without Lockouts" with clear screenshots -> future callers solve it at L0 (deflection!).',
          'Schedule a Change request with the Portal team to improve the error message on Friday night.',
        ],
        outcome: 'Ticket volume drops 40% the next week because callers self-resolve cleanly.',
      },
    },

    supportWalkthrough: {
      intro: 'Apply these habits before clicking Submit or Reassign on any ticket.',
      steps: [
        {
          phase: 'Search KB First',
          action: 'Check the internal and public KB on every call and attach the used article ID to the ticket.',
          whyItWorks: 'Reveals known fixes fast and shows management which KB pages actually reduce handle time.',
        },
        {
          phase: 'Never Include Secrets',
          action: 'Keep passwords, security challenge answers, and personal sarcasm 100% out of every ticket field.',
          whyItWorks: 'Auditors, managers, and sometimes legal teams read historical ticket exports.',
        },
      ],
      questionsToAsk: [
        '"Have you noticed this exact error happening on a regular schedule or after a certain action?"',
        '"If we fix this with a quick guide today, would a step-by-step help page help your teammates too?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a warm functional escalation honestly',
          sayThis:
            '"I’ve tested your local network and confirmed the block is on the regional server firewall, which needs our Network Engineering team. I’ve attached all test logs so you won’t have to repeat anything, and they’ll reach out by 2:00 PM."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Self-Service -> Knowledge Base Draft & Problem Link',
        priorityFormula: 'Impact: Medium (5 users) × Urgency: Low (Workaround active) = P3 Medium',
        internalNotes: `[ISSUE] 5 users hit generic Error 401 resetting passwords via self-service portal.
[DIAGNOSIS] Users entered stale SMS codes after migrating to authenticator app.
[KB ACTION] Authored public KB-1042 ("Resetting Your Password via Self-Service"); assigned quarterly review owner to L1 Lead.
[PROBLEM LINK] Linked to PRB-210 to request clearer portal UI guidance.`,
        customerReply:
          'Hi Taylor — Glad your password reset went through! I also sent our updated step-by-step self-service guide link in case you need it in the future.',
        escalationCriteria:
          'Flag repeat incidents (>3 occurrences/week) as a Problem record rather than closing each individually with no follow-up.',
      },
    },

    commonTraps: [
      {
        trap: 'Writing "User is confused / incompetent" or pasting a temporary password in internal ticket notes.',
        reality:
          'Internal notes can still be subpoenaed, exported to auditors, or seen during quality reviews—stay factual, respectful, and secret-free.',
      },
      {
        trap: 'Writing a KB article once and never assigning an owner or review date.',
        reality:
          'Software screens evolve rapidly; unreviewed articles mislead new hires and cause worse mistakes.',
      },
    ],

    keyTerms: [
      {
        term: 'Ticket Deflection',
        shortDef: 'Preventing unnecessary tickets by empowering users with clear self-service guides and portals.',
        fullDef:
          'Public Knowledge Base articles surfaced during portal submission solve straightforward issues before an analyst ever opens a ticket.',
      },
      {
        term: 'Problem vs. Incident',
        shortDef: 'Incident restores broken service quickly; Problem uncovers and eliminates the underlying root cause.',
        fullDef:
          'One Problem record commonly links together dozens of recurring Incidents.',
      },
      {
        term: 'Service Request vs. Change',
        shortDef: 'Standard approved ask from a user (Request) vs. planned infrastructure/app modification (Change).',
        fullDef:
          'Even pre-approved software installs differ from normal infrastructure changes that require risk assessment and rollback plans.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-181-q1',
        prompt: 'Classify these two situations accurately: (A) "Outlook crashes every time I open a PDF" and (B) "Please install Adobe Acrobat Pro on my new laptop."',
        options: [
          'A is an Incident (something broke); B is a Service Request (standard ask).',
          'Both are Problems.',
          'A is a Change; B is an Incident.',
          'A is a Service Request; B is an Incident.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Crashes restore broken service (Incident); requesting software installation follows standard approval/fulfillment (Service Request).',
          'Incorrect: Problems investigate underlying root causes of repeating/unknown outages.',
          'Incorrect: A user reporting a crash is an Incident, not a planned Change.',
          'Incorrect: Reversed definitions.',
        ],
        takeaway: 'Broken now = Incident; standard ask = Service Request; repeating root cause = Problem; planned update = Change.',
      },
      {
        id: 'itsup-181-q2',
        prompt: 'Who stays responsible for ensuring a functionally escalated ticket is picked up and the user is updated?',
        options: [
          'The sending analyst stays responsible until the receiving team accepts ownership, and updates the user clearly.',
          'Nobody—once you click Reassign, you erase all memory of the ticket.',
          'The user must call the second team manually to check if they saw it.',
          'Only external vendors check reassignment queues.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Warm ownership transfer prevents tickets dying unread in queues ("ping-pong").',
          'Incorrect: Tossing tickets blindly causes SLA breaches.',
          'Incorrect: Never make users chase internal IT handoffs.',
          'Incorrect: Internal queues depend on team discipline.',
        ],
        takeaway: 'Sender stays accountable until handover is accepted; always brief the user on who has it next.',
      },
      {
        id: 'itsup-181-q3',
        prompt: 'Which field MUST NEVER be typed inside either public replies or internal ticket notes?',
        options: [
          'A user’s plaintext password, security question answers, or sarcastic remarks.',
          'The exact error code or affected computer hostname.',
          'Timestamps of diagnostic steps tried.',
          'Links to related Knowledge Base articles.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Tickets are permanent auditable records—never log secrets or unprofessional commentary.',
          'Incorrect: Exact error codes and hostnames are vital evidence.',
          'Incorrect: Timestamps are essential for correlating logs.',
          'Incorrect: Linking KB articles helps measure deflection and accuracy.',
        ],
        takeaway: 'Never store passwords, secrets, or sarcasm anywhere in a ticket.',
      },
      {
        id: 'itsup-181-q4',
        prompt: 'What makes a Knowledge Base stay healthy and reliable across years of software updates?',
        options: [
          'Assigning clear article owners, setting scheduled review dates, adding search keywords, and retiring outdated guides.',
          'Locking articles permanently so nobody can ever edit them.',
          'Writing articles purely in internal engineering acronyms.',
          'Deleting all articles older than 30 days automatically.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Living ownership + review cycles ensure guides match real screens.',
          'Incorrect: Frozen KB pages quickly become wrong and harmful.',
          'Incorrect: Public KB articles need plain non-technical clarity.',
          'Incorrect: Valid evergreen articles remain useful for years when reviewed.',
        ],
        takeaway: 'Healthy Knowledge Bases need clear owners, review dates, and plain search keywords.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Run the Practice Ticketing Workbench & Draft KB Guide',
      targetTab: 'simulator',
      instructions: [
        'Complete at least 3 Beginner & Intermediate scenarios inside the Service Desk Simulator (staying in Default Vendor-Neutral mode for now).',
        'Draft a 5-step public KB article titled "Resetting Your Password via Self-Service" using plain language.',
      ],
      verificationCheck: 'Consistent 4/4 scores on Simulator tickets and clear KB steps a brand-new hire could follow unassisted.',
    },

    summaryBullets: [
      'Stop ticket bouncing: own handoffs until accepted, send full evidence, and brief the user on next steps.',
      'Use Incident (broken), Service Request (standard ask), Problem (root cause), and Change (planned edit) consistently.',
      'Write internal KBs for analysts and plain public KBs to deflect repetitive tickets at Level 0.',
      'Maintain KB health with assigned owners, review dates, and accurate retirement of obsolete pages.',
      'Practice inside the unbranded Service Desk Simulator to build speed before touching named vendor tools in Unit 9.',
    ],

    sourcesToVerify: [
      'ITIL 4 Foundation — Knowledge Management & Incident/Problem/Request/Change Definitions',
      'KCS (Knowledge-Centered Service) Academy — KB Lifecycle Best Practices',
    ],
  },
};
