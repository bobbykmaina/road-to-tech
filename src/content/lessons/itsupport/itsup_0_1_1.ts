import { DeepLessonDocument } from '../../../types/curriculum';

export const LESSON_ITSUP_0_1_1: DeepLessonDocument = {
  id: 'itsup.0.1.1',
  moduleId: 'it-support',
  unitTitle: 'Unit 0: Foundations',
  topicTitle: '0.1 How Enterprise IT Support Works',
  code: '0.1.1',
  title: 'Support Tiers (L1/L2/L3), First-Contact Triage & Handling Frustrated Users',
  readMinutes: 13,
  prerequisites: ['None — complete beginner starting lesson'],
  versionScope: 'shared',

  learningObjectives: [
    'Explain how Level 1 (L1), Level 2 (L2), and Level 3 (L3) support tiers divide responsibility inside a modern IT service desk.',
    'Execute a structured 6-step first-contact triage workflow without jumping straight to guesswork or premature escalation.',
    'Respond calmly to an angry or panicked employee using empathetic phrasing that de-escalates stress and earns cooperation.',
    'Write complete, actionable ticketing system notes—including impact/urgency priority, verified scope, and a warm-handoff summary.',
  ],

  whyThisMatters: {
    scenarioTitle: 'Monday 8:48 AM: A Furious Director Locked Out Before a Board Briefing',
    narrative:
      'It is your second week on an enterprise IT help desk. The phone rings and Jordan—a Regional Sales Director—says loudly: "Your garbage system locked me out again! My board presentation starts in twelve minutes, I already reset my password three times on my phone, and nothing works. Fix this right now or transfer me to somebody who actually knows IT!" A panicked beginner makes one of two mistakes: either arguing back defensively ("Sir, please calm down, we didn’t break it") or dumping an empty one-line ticket straight onto Tier 2 ("User cannot log in, please help"). Both mistakes fail the user and anger the escalation team. Mastering structured triage and calm communication turns you into the calm anchor every company wants to hire.',
  },

  plainEnglish: {
    analogyTitle: 'Think of a Hospital Emergency Department: Triage Nurse, Specialist, and Surgeon',
    analogy:
      'When you walk into a hospital ER with a sharp pain, a surgeon does not sprint out into the lobby with a scalpel on minute one. First, a Triage Nurse greets you calmly, lowers your panic, checks your vitals (temperature, blood pressure, exact symptoms), determines how urgent the injury is compared to everyone else in the waiting room, and treats straightforward cases immediately. Complex internal issues get handed to an ER Specialist with full vitals already recorded on the chart; rare surgical cases go to the Lead Surgeon. In IT support, **Tier 1 (L1)** is that skilled Triage & Frontline Clinician, **Tier 2 (L2)** is the Systems/Network Specialist, and **Tier 3 (L3)** is the Infrastructure Architect or Vendor Engineer. Nobody ever sends a patient upstairs with a blank chart—and you never escalate a ticket with blank diagnostics.',
    technicalDefinition:
      'IT Service Desk tiering organizes incident resolution by scope, privilege, and specialist depth: Tier 1 handles initial intake, categorization, priority assignment, identity verification, standard service requests, and documented workstation/account fixes; Tier 2 handles escalated endpoint engineering, server/network fault isolation, Active Directory/Group Policy issues, and SaaS tenant admin; Tier 3 resolves architectural bugs, core infrastructure outages, and vendor escalations.',
    paragraphs: [
      'A complete beginner often believes IT support is purely memorizing computer errors—like knowing which Registry key fixes Outlook or how to clear a Windows print queue. Technical skill matters, of course, yet hiring managers consistently rank **structured triage and communication** above raw trivia. Why? Because 70% of incoming tickets start vague: "The internet is broken," "My laptop died," or "Excel won’t open." Without methodical questioning, even a brilliant engineer wastes twenty minutes troubleshooting the wrong device.',
      'Your job on Tier 1 is **not** simply to pass tickets along like a human receptionist, nor is it to spend four hours struggling alone on a server outage you lack permission to touch. Great L1 analysts achieve a high **First Contact Resolution (FCR)** rate on everything within L1 scope while feeding crystal-clear, verified evidence upward whenever true escalation is warranted.',
      'Just as importantly, remember that users rarely take frustration out on you personally—they are stressed because a deadline, paycheck run, or client meeting just collided with technology they cannot control. Separating the **emotion** ("I’m frustrated") from the **facts** ("Only Outlook on Windows rejects MFA after a password reset") lets you validate their urgency in ten seconds and move seamlessly into collecting diagnostic proof.',
    ],
  },

  deepDive: {
    intro:
      'Every incoming call, chat, or service portal ticket follows the six-step First-Contact Triage Loop below before you either resolve it at Tier 1 or execute a Warm Escalation to Tier 2.',
    steps: [
      {
        step: 'Step 1',
        title: 'Acknowledge & De-Escalate Immediately (First 15 Seconds)',
        explanation:
          'Lower the temperature before asking technical questions. Never defend the system, never say "calm down," and never interrupt while the user vents for the first sentence. Acknowledge their deadline ("I hear that your board briefing starts in 12 minutes—let’s focus right on getting you back in"), use their name, and take ownership of the next step.',
      },
      {
        step: 'Step 2',
        title: 'Verify Caller Identity (Security Before Convenience)',
        explanation:
          'Urgent callers sometimes turn out to be attackers using social engineering ("vishing"). Before unlocking an account, resetting MFA (multi-factor authentication), or issuing a BitLocker recovery key (the emergency code that unlocks an encrypted Windows drive), ALWAYS follow company verification policy: verify employee ID, manager callback on file, or out-of-band verification to a registered device—never reset access solely on a voice claiming to be an executive.',
      },
      {
        step: 'Step 3',
        title: 'Establish Scope: Single User vs. Department vs. Site-Wide',
        explanation:
          'Before changing anything on Jordan’s laptop, determine blast radius. Ask whether coworkers on the same floor or in the same app see the exact same error, and whether the issue happens on webmail vs. desktop Outlook. One broken user = P3/P2 endpoint or account issue; 40 users down = P1 Major Incident requiring immediate escalation.',
      },
      {
        step: 'Step 4',
        title: 'Assign Priority Using Impact × Urgency (ITSM Rule)',
        explanation:
          'Priority is never "whatever the user yells loudest." In standard IT service management, Priority = Impact (how many people or critical business services are halted) × Urgency (how soon the work breaks if unfixed). One user with a workaround (e.g., webmail works while desktop email stalls) is lower priority than an entire finance team locked out of payroll.',
      },
      {
        step: 'Step 5',
        title: 'Gather Reproducible Facts & Check Recent Changes',
        explanation:
          'Read the exact error message word-for-word, check "What changed right before this started?" (a password reset 5 minutes ago! OS update! a new VPN client!), and run basic Tier 1 checks (network configuration `ipconfig`, company directory lockout status, sign-in logs, or saved credentials). Often a user’s phone still has the OLD password cached, locking the account every 60 seconds!',
      },
      {
        step: 'Step 6',
        title: 'Resolve with Confirmation—OR Warm-Escalate with Complete Chart',
        explanation:
          'If Tier 1 tools resolve it, ask the user to reproduce a working login/test before closing, document root cause in the KB/ticket, and follow up politely. If the root cause requires Tier 2/3 access (e.g., AD replication fault, firewall block, tenant Conditional Access policy), write a structured Warm Escalation note summarizing: Symptoms, Scope, Checks Already Run, Exact Error Text, and Hostname/IP.',
      },
    ],
    diagram: {
      kind: 'svg-support-tiers',
      caption:
        'Enterprise IT Support Tier Flow: Intake & Triage at L1 resolves 65–75% directly (FCR) and hands verified diagnostics upward when L2/L3 privileges are needed.',
      asciiFallback: `[User Issue: Call / Chat / Self-Service Portal]
        |
        v
[TIER 1 (L1 Service Desk)] -- Empathize -> Verify ID -> Scope & Priority -> Check AD/OS/Logs
        |---> Resolved at L1? (65-75% FCR) ---> Confirm User Works -> Close Ticket + Update KB
        |---> Needs Server/Net/Policy Access?
                | (Warm Escalation: Scope + Exact Error + Hostname + Steps Tried)
                v
[TIER 2 (L2 Desktop/SysAdmin)] -- Deep AD/GPO, Intune, Endpoint/VPN Engineering
        |---> Needs Core Infra / Vendor / Bug Fix?
                v
[TIER 3 (L3 Architects / NetOps / Vendor)] -- Core Routers, AD Schema, SaaS Outages`,
    },
    workedExample: {
      title: 'Worked Triage Trace: Resolving Jordan’s Pre-Briefing Lockout (INC-2014)',
      context:
        'Jordan Vance calls at 8:48 AM yelling that Microsoft 365 keeps locking him out minutes after every password reset, with a board meeting at 9:00 AM.',
      steps: [
        'Minute 0:20 (Empathy + Ownership): "Jordan, I completely understand your board briefing is in twelve minutes—let’s get you back into your slides right now. First, for security before I check your account, can you confirm your employee ID and approve a verification prompt or give me your registered callback number?"',
        'Minute 1:15 (Identity Verified + Clarifying Question): Identity confirmed via registered callback/manager match. You ask: "When you changed your password earlier, did you sign into email or Wi-Fi on an iPhone, iPad, or second laptop?" Jordan replies: "Oh—my iPad is sitting in my bag with Mail open!"',
        'Minute 2:10 (Verify Evidence in Company Directory): You check Active Directory (the central company database of staff accounts and computers) -> Account shows `Locked Out = Yes`, `BadPwdCount = 12`. Domain login security record Event ID `4740` (Windows’ built-in audit entry for a locked account) points to the wireless mobile mail gateway retrying stale credentials.',
        'Minute 3:00 (Clean Fix + Prevention): You have Jordan toggle Airplane Mode on the iPad temporarily (stopping the retry loop), unlock the account, confirm Jordan signs cleanly into email and chat on his primary presentation laptop (`SLS-LT-204`), and then update his saved password in iPad Settings -> Mail.',
        'Minute 4:30 (Document in the Ticketing System): Priority set to P2 High (Executive deadline, single user with workaround unavailable until unlocked), Root Cause = Cached stale password on iPad Mail app triggering repeated lockout policy threshold, Status = Resolved with customer confirmation.',
      ],
      outcome:
        'Jordan enters his 9:00 AM board briefing seven minutes early, Tier 2 was never interrupted with a vague ticket, and the recurring lockout is permanently cured rather than merely unlocked once.',
    },
  },

  supportWalkthrough: {
    intro:
      'Keep this practical field reference beside you during live support calls, chats, and ticketing system queues.',
    steps: [
      {
        phase: '1. Calm Opening',
        action: 'Greet by name, mirror the urgency without panicking, and state one immediate next action.',
        whyItWorks: 'Users escalate verbally when they feel unheard; proving you grasp their deadline shifts them from adversary to teammate.',
      },
      {
        phase: '2. Security Check',
        action: 'Verify caller identity using approved company channels BEFORE reading sensitive attributes or resetting passwords/MFA.',
        whyItWorks: 'Prevents high-pressure social engineering (vishing) attacks where attackers impersonate executives before meetings.',
      },
      {
        phase: '3. Five-Question Scope',
        action: 'Ask what changed recently, exact error text, affected devices, coworkers affected, and whether webmail/alternate path works.',
        whyItWorks: 'Immediately separates local client bugs, single-user account locks, and multi-user P1 infrastructure outages.',
      },
      {
        phase: '4. Targeted Check',
        action: 'Inspect directory account status, system logs, network configuration (`ipconfig /all`), or remote screen before rebooting blindly.',
        whyItWorks: 'Preserves forensic clues—rebooting first often hides error dialogs and wastes the user’s remaining minutes.',
      },
      {
        phase: '5. Confirm & Record',
        action: 'Watch the user succeed on their primary task, then record concise Facts -> Root Cause -> Action -> Verification in the ticket.',
        whyItWorks: 'Eliminates "reopened tickets" and builds a searchable Knowledge Base for the entire desk.',
      },
    ],
    questionsToAsk: [
      '"What exact wording or error code appears on your screen right now?"',
      '"Did anything change right before this started—such as a password reset, OS update, new dock, or VPN switch?"',
      '"Is this happening only on your laptop, or also on webmail / your phone / a coworker’s computer nearby?"',
      '"For our security verification before I touch your account, can you confirm your registered employee ID / approve the verification check?"',
      '"When did it last work completely normally?"',
    ],
    sampleUserWording: [
      {
        situation: 'User is angry about repeated IT glitches before a deadline',
        sayThis:
          '"I hear how frustrating it is to hit a lockout right before a major presentation, Jordan. I’m taking ownership of this with you right now—let’s run two quick checks so we get you back in before 9:00."',
      },
      {
        situation: 'Enforcing identity verification with an impatient executive',
        sayThis:
          '"I want to get you unlocked as fast as possible, and our security policy requires a quick 15-second identity check so nobody can ever lock or access your executive account falsely. Once confirmed, I can unlock it immediately."',
      },
      {
        situation: 'Offering an immediate workaround while Tier 2 investigates deeper',
        sayThis:
          '"While our Tier 2 messaging engineer inspects why desktop Outlook is stalling, let’s confirm you can open Outlook on the web at portal.office.com so your board deck isn’t delayed."',
      },
      {
        situation: 'Closing cleanly after fixing a cached-password lockout',
        sayThis:
          '"Your account is unlocked and we verified your laptop signs in cleanly. Just so it doesn’t lock again mid-meeting, let’s update that saved password on your iPad now before we hang up."',
      },
    ],
    ticketNoteTemplate: {
      category: 'Identity & Access -> Account Lockout (Active Directory / M365)',
      priorityFormula: 'Impact: Low (1 user) × Urgency: High (Executive presentation < 15m) = P2 High',
      internalNotes: `[SUMMARY] User locked out repeatedly following self-service password reset at 08:35 AM.
[VERIFICATION] Caller identity verified via HR callback number + employee ID check.
[SCOPE] Single user only (SLS-LT-204); other Sales users unaffected.
[DIAGNOSTICS] ADUC showed LockedOut=True, BadPwdCount=12. DC Security Log Event ID 4740 showed stale auth retries from user's iPad Mail client.
[RESOLUTION] Placed iPad in Airplane Mode to stop auth loop -> Unlocked AD account -> Verified live login on primary laptop -> Updated saved password on iPad Mail -> Confirmed no new bad password increments after 3 minutes.`,
      customerReply:
        'Hi Jordan — Glad we got you into your briefing ahead of schedule! As we saw on the call, your iPad Mail app was still holding your previous password and retrying in the background, which triggered our security lockout policy. Now that the new password is saved on both your laptop and iPad, you’re all set. Reach back out anytime if anything else pops up.',
      escalationCriteria:
        'Escalate to Tier 2 ONLY if lockouts persist with all personal devices offline, or if Event 4740 points to an unknown external IP / service principal (possible brute-force or compromised token). Include Event 4740 timestamp, Caller Computer Name, and Entra Sign-in Correlation ID.',
    },
  },

  commonTraps: [
    {
      trap: 'Unlocking a caller’s account or reading out BitLocker/MFA resets simply because they sound senior and urgent.',
      reality:
        'Social-engineering attackers routinely impersonate upset executives ("I’m the CFO at the airport!"). Identity verification policy NEVER bends for urgency—verify out-of-band every time.',
    },
    {
      trap: 'Simply clicking "Unlock Account" in AD without asking what caused the lockout.',
      reality:
        'If a phone, mapped drive, Windows Credential Manager entry, or scheduled task still holds an old password, the account will lock again within minutes and bounce straight back as a reopened ticket.',
    },
    {
      trap: 'Writing "Fixed user login" in ticket resolution notes.',
      reality:
        'Vague closure notes ruin metrics, prevent teammates from learning, and leave the next technician blind if the user calls back tomorrow. Record Cause + Diagnostic Proof + Exact Fix + Confirmation.',
    },
    {
      trap: 'Escalating immediately to Tier 2 ("Please check user login") without checking scope or error text.',
      reality:
        'Cold transfers ("ticket ping-pong") waste Tier 2 engineering hours and hurt your desk’s credibility. Check blast radius, verify credentials/network basics, and attach concrete evidence before escalating.',
    },
    {
      trap: 'Setting every urgent caller’s ticket to P1 Critical.',
      reality:
        'Priority = Impact × Urgency. P1 Critical is reserved for severe multi-user or revenue-halting outages (e.g., email server down for 500 staff). Marking one user’s mouse issue P1 breaks SLA reporting and triggers unnecessary emergency pages.',
    },
  ],

  keyTerms: [
    {
      term: 'Tier 1 (L1 Support)',
      shortDef: 'Frontline help desk handling intake, triage, priority, and standard resolutions.',
      fullDef:
        'The primary point of contact for users via phone, chat, or ticket portal. Responsible for empathetic communication, identity verification, Priority assignment, troubleshooting documented workstation/account issues, and gathering evidence for escalations.',
    },
    {
      term: 'Tier 2 (L2 Support)',
      shortDef: 'Escalation specialists handling deeper OS, AD/GPO, endpoint, and network tickets.',
      fullDef:
        'Handles complex troubleshooting that goes beyond Tier 1 runbooks or permissions—such as Group Policy debugging, VPN/firewall ACL checks, Intune policy fixes, and multi-device hardware patterns.',
    },
    {
      term: 'Tier 3 (L3 Support)',
      shortDef: 'Subject-matter architects and vendor engineering for root infrastructure faults.',
      fullDef:
        'Senior network engineers, cloud/identity architects, database administrators, and third-party vendor support resolving core outages, code bugs, or architectural design changes.',
    },
    {
      term: 'First Contact Resolution (FCR)',
      shortDef: 'Percentage of tickets completely resolved during the initial support interaction.',
      fullDef:
        'A core help desk KPI measuring how often Tier 1 resolves a user’s issue accurately on the first touch without needing callbacks or escalations—balanced carefully against quality so issues aren’t rushed.',
    },
    {
      term: 'Priority Matrix (Impact × Urgency)',
      shortDef: 'ITSM formula combining blast radius (Impact) and time sensitivity (Urgency).',
      fullDef:
        'Standard ITIL method for assigning SLA priority (P1–P4) objectively rather than reacting to whoever shouts loudest.',
    },
    {
      term: 'Warm Escalation',
      shortDef: 'Handing a ticket to Tier 2 with full diagnostics, error text, and steps already tried.',
      fullDef:
        'Contrast with a "cold transfer": a warm escalation includes confirmed scope, hostname, exact error messages, user availability, and every L1 test already eliminated.',
    },
    {
      term: 'Event ID 4740',
      shortDef: 'Windows Security log event recorded on a Domain Controller when an AD account locks.',
      fullDef:
        'Crucial L1/L2 triage event showing which user locked out and the "Caller Computer Name" (source workstation or gateway) sending the bad password attempts.',
    },
    {
      term: 'Service Level Agreement (SLA)',
      shortDef: 'Contractual target times for first response and full incident resolution.',
      fullDef:
        'Defines measurable response and resolution windows tied to Priority (e.g., P1: 15m response / 2h resolve; P3: 2h response / 8h resolve).',
    },
  ],

  checkQuestions: [
    {
      id: 'itsup-011-q1',
      prompt:
        'An angry caller claims to be a VP traveling at an airport and demands you immediately read back their BitLocker recovery key over the phone without completing any verification steps because their flight boards in 5 minutes. What should you do first?',
      options: [
        'Acknowledge their time crunch politely, explain that security policy requires out-of-band identity verification before any key or account reset is released, and complete verification first.',
        'Provide the BitLocker key immediately so an executive is not delayed.',
        'Tell the caller to calm down and hang up because urgent callers are suspicious.',
        'Escalate the blank ticket straight to Tier 3 Security Architects.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Empathy + strict security enforcement together! Recognizing urgency de-escalates emotion while holding the verification boundary prevents vishing/impersonation breaches.',
        'Incorrect: Skipping verification under fake urgency is the #1 way attackers socially engineer help desks.',
        'Incorrect: Telling a stressed user to "calm down" or hanging up escalates conflict unnecessarily; follow verification calmly.',
        'Incorrect: Verifying caller identity is a core Tier 1 responsibility, not a Tier 3 escalation.',
      ],
      takeaway: 'Never bypass identity verification for urgency—pair calm empathy with mandatory out-of-band verification.',
    },
    {
      id: 'itsup-011-q2',
      prompt:
        'Under vendor-neutral IT service management best practices, how is ticket Priority calculated?',
      options: [
        'By multiplying or cross-referencing Impact (how many users/services are affected) and Urgency (how quickly the business suffers).',
        'Strictly by the caller’s job title (VPs always get P1, interns always get P4).',
        'Strictly by whichever channel the user chose (phone calls are P1, emails are P4).',
        'By estimating how many minutes the technician thinks the fix will take.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Priority = Impact × Urgency. A single user who has a webmail workaround is NOT a P1 outage even if they call by phone.',
        'Incorrect: Job title can influence Urgency slightly when a major business event is blocked, but Impact (blast radius) still determines whether an incident is P1 Critical.',
        'Incorrect: Intake channel affects SLA workflow slightly, not the core Impact × Urgency priority calculation.',
        'Incorrect: Resolution effort determines complexity/tier, not business Priority.',
      ],
      takeaway: 'Priority = Impact × Urgency—never confuse quick fix effort or loud callers with P1 Critical.',
    },
    {
      id: 'itsup-011-q3',
      prompt:
        'A user calls saying "I reset my password 20 minutes ago, and now my account locks back out every few minutes." You unlock the account in Active Directory once without checking anything else. Two minutes later it locks again. What diagnostic step did you skip?',
      options: [
        'Checking where the bad password attempts originate (asking about phones/tablets/other sessions and inspecting Domain Controller Event ID 4740).',
        'Asking the user to reinstall Microsoft Windows immediately.',
        'Deleting the user’s Active Directory account and creating a brand-new mailbox.',
        'Replacing the user’s Cat6 Ethernet patch cable.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Recurring post-reset lockouts almost always come from cached old credentials on a mobile device, mapped drive, Credential Manager, or background service—identifiable via clarifying questions and Event 4740.',
        'Incorrect: Reimaging Windows destroys productivity without touching the real source (often a mobile device or saved credential).',
        'Incorrect: Deleting an AD object breaks SIDs, file permissions, and Exchange mailbox history.',
        'Incorrect: Ethernet cabling does not generate failed Kerberos/NTLM password attempts.',
      ],
      takeaway: 'Never just click Unlock—find the Caller Computer / cached credential source causing the bad password count.',
    },
    {
      id: 'itsup-011-q4',
      prompt:
        'You confirmed that an issue requires Tier 2 firewall changes beyond Tier 1 permissions. Which escalation note represents a proper "Warm Escalation"?',
      options: [
        'Hostname SLS-PC-44, 12 Sales floor users blocked reaching \\\\filesrv01 on TCP 445 while Floor 1 works, exact error "0x80070035 network path not found", verified DNS resolves 10.10.2.20 and ping succeeds.',
        '"User cannot open shared folder, please fix ASAP. Sent to Tier 2."',
        '"Escalating because user is very angry and asking for a manager."',
        '"I think the server might be down, didn’t check DNS or other users yet."',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Gives Tier 2 exact blast radius (12 Floor 2 users vs Floor 1 working), hostname, exact error code, DNS check, and ICMP verification so they can inspect TCP 445 firewall ACLs immediately.',
        'Incorrect: A classic "cold transfer" with zero diagnostic evidence—Tier 2 would have to call the user back from scratch.',
        'Incorrect: Emotional frustration without technical evidence does not help Tier 2 fix the technical block.',
        'Incorrect: Skipping basic L1 DNS and scope checks wastes escalation time.',
      ],
      takeaway: 'A Warm Escalation hands Tier 2 exact scope, exact errors, hostnames, and eliminated causes.',
    },
    {
      id: 'itsup-011-q5',
      prompt:
        'In an IT help desk interview, you are asked: "Tell me about a time you handled an upset customer or user." Which answer approach leaves the strongest impression?',
      options: [
        'Use the STAR method (Situation, Task, Action, Result): show how you validated their frustration calmly, verified identity, isolated the issue systematically, fixed or gave a workaround before their deadline, and documented the fix.',
        'Say "I never get upset callers because I immediately transfer them to my supervisor."',
        'Explain that you tell angry users they must stop yelling before you will listen to their ticket.',
        'Recite definitions of OSI Layer 3 routing instead of addressing communication.',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct: Behavioral interview answers structured with STAR prove real customer empathy paired with structured technical execution.',
        'Incorrect: Dumping every upset user onto a supervisor signals inability to handle frontline L1 duties.',
        'Incorrect: Confrontational ultimatums escalate anger instead of resolving tickets.',
        'Incorrect: Dodging a behavioral customer-service question with unrelated networking trivia fails the interviewer’s soft-skills check.',
      ],
      takeaway: 'Combine STAR storytelling with empathy + verification + structured technical resolution in every interview.',
    },
  ],

  handsOnActivity: {
    kind: 'ticket-sim',
    title: 'Practice Live Intake & Lockout Triage in the IT Service Desk Simulator',
    targetTab: 'simulator',
    instructions: [
      'Open the Simulator tab (visible when IT Help Desk & Systems Support is active) and select INC-2014 (Intermediate · Tier 1 Account Lockout) or INC-4010 (Expert · Anti-Vishing BitLocker Verification).',
      'Use User Chat to ask clarifying scope and identity verification questions BEFORE executing directory actions.',
      'Inspect System Diagnostics / AD Console to confirm Event ID 4740 or security evidence, execute the clean fix, and submit your Root Cause & Resolution for Rubric scoring.',
    ],
    verificationCheck: 'Score 4/4 on the Service Desk Rubric without triggering any security or premature-action warnings.',
  },

  summaryBullets: [
    'IT support tiers (L1, L2, L3) split work by frontline triage/FCR, systems/endpoint engineering, and core architecture/vendor escalation.',
    'Always open stressful calls with empathy and ownership ("I hear your deadline—let’s tackle this together"), never defensiveness.',
    'Security beats urgency: complete approved identity verification every time before resetting MFA, unlocking accounts, or sharing BitLocker keys.',
    'Calculate Priority objectively via Impact × Urgency, establish blast radius early, and investigate root cause (like cached device credentials) rather than clicking Unlock blindly.',
    'Document every resolved or escalated ticket with clear facts, verified checks, and exact error text—Warm Escalations accelerate Tier 2 fixes and build team trust.',
  ],

  sourcesToVerify: [
    'ITIL 4 Practice Guide — Service Desk & Incident Management',
    'CompTIA A+ Core 2 (220-1102) Exam Objectives — Domain 4.0 Operational Procedures (Communication & Professionalism)',
    'Microsoft Learn — Windows Security Auditing Event ID 4740 (A user account was locked out)',
    'HDI Support Center Analyst Standards — First-Contact Triage & Customer Communication',
  ],
};
