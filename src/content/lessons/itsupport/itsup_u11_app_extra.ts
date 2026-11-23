import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_U11_APP_EXTRA_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.11.2.1': {
    id: 'itsup.11.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 11: Interview Readiness',
    topicTitle: '11.1–11.4 Interview Stages, Behavioral STAR Stories & Role-Play Scoring Rubric',
    code: '11.2.1',
    title: 'Help Desk Interview Stages, 5 Polished STAR Stories (With Non-IT Transferable Examples), Red Flags & 30-Minute Mock Role-Play Rubric',
    readMinutes: 13,
    prerequisites: ['itsup.core.career.interview-prep'],
    versionScope: 'shared',

    learningObjectives: [
      'Prepare for every standard interview stage (HR screen, technical screen, panel/practical ticket note exercise, hiring manager final) without bluffing.',
      'Structure 5 high-impact **STAR** stories (difficult customer, honest mistake, competing urgent tasks, fast learning, technical translation) including non-IT transferable examples.',
      'Rehearse timed 30-minute mock interviews and user role-plays (calm, rushed, or angry) against a 6-part scoring rubric with Coach Patch.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Tell Me About a Time You Handled an Angry Person While Three Urgent Things Broke at Once!"',
      narrative:
        'Entry-level help desk interviews hire for calm attitude, structured troubleshooting, and coachability first. Candidates who ramble for five minutes or bluff technical guesses fail early, while career switchers using sharp 90-second retail, hospitality, healthcare, or home-lab **STAR** stories land offers quickly.',
    },

    plainEnglish: {
      analogyTitle: '90-Second Movie Trailer Rather Than Reading the Whole Novel',
      analogy:
        'Interviewers ask behavioral questions to see how you act under pressure—not to hear a meandering backstory. **STAR** keeps your story tight like a trailer: **S**ituation (15 sec), **T**ask (10 sec), **A**ction saying *"I"* (45 sec), **R**esult with a metric + 1-line lesson (20 sec).',
      technicalDefinition:
        'Structured behavioral interviewing evaluates empathy, prioritization, ownership, and diagnostic reasoning through timed STAR narratives and live scenario role-plays.',
      paragraphs: [
        'Typical **11.1 interview stages**: (1) Recruiter/HR screen, (2) Phone/video technical screen, (3) Panel or in-person interview—sometimes with a practical test like writing a ticket note or diagnosing a broken printer—and (4) Final manager chat. Always test camera/mic early and send a concise same-day thank-you note.',
        'Avoid **red flags**: bluffing technical answers, blaming past bosses, rambling without structure, drowning non-technical listeners in acronyms, or having zero questions to ask.',
        'Build **5 transferable STAR stories** even without prior IT titles (retail, hospitality, call center, shift lead, student lab): (1) De-escalating an upset customer, (2) Owning & fixing a mistake, (3) Prioritizing competing urgent deadlines, (4) Learning a new system fast, (5) Explaining technical details plainly.',
      ],
    },

    deepDive: {
      intro: 'Pair the 5 STAR templates with the 11.4 30-minute mock interview & role-play rubric.',
      steps: [
        {
          step: '01',
          title: 'Worked Difficult-Customer STAR Story (~90 Seconds)',
          explanation:
            '**S:** User yelled that laptop dropped Wi-Fi 5 minutes before board slides. **T:** Restore presentation access fast while calming them down. **A:** I acknowledged their deadline stress, verified Wi-Fi passphrase rotation, reconnected wireless, and offered a wired Ethernet backup. **R:** Presented on time and emailed my manager positive feedback. **Lesson:** Calm empathy unlocks cooperation faster than debating policies.',
        },
        {
          step: '02',
          title: '30-Minute Timed Mock Rubric (11.4)',
          explanation:
            'Score yourself across 6 dimensions: (1) Clarity, (2) Methodical 6-step troubleshooting, (3) Empathy, (4) Technical accuracy, (5) Honesty about knowledge gaps, and (6) Documentation & user follow-up. Think aloud so interviewers hear your reasoning!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '30-Minute Interview Flow & 6-Point Rubric',
        asciiFallback: `[0–4m Intro] -> [5–14m Behavioral STAR] -> [15–25m Technical & Role-Play] -> [26–30m Your Questions]
Rubric: Clarity | Method | Empathy | Technical Accuracy | Honesty on Gaps | Documentation & Follow-Up`,
      },
      workedExample: {
        title: 'Using Non-IT Shift Experience Honestly',
        context: 'Career switcher with 3 years in busy retail pharmacy.',
        steps: [
          'Map retail peak queues directly to SLA triage: "During Friday rush, I triaged urgent prescription blockers separately from routine pickups while explaining accurate wait times."',
          'Pair with home-lab proof: Active Directory user creation, Service Desk Simulator tickets, and JSM sandbox screenshots.',
        ],
        outcome: 'Demonstrates poise, customer care, and real initiative.',
      },
    },

    supportWalkthrough: {
      intro: 'Practice thinking aloud calmly during technical role-plays.',
      steps: [
        {
          phase: 'Think Aloud & Ask Clarifying Questions',
          action: 'Never silently stare or leap to conclusions—state your hypothesis and ask scope/recent-change questions out loud.',
          whyItWorks: 'Interviewers award points for diagnostic process even before you know a company-specific quirk.',
        },
      ],
      questionsToAsk: ['"Is this happening only on your laptop or to teammates around you as well?"'],
      sampleUserWording: [
        {
          situation: 'Handling a question you genuinely do not know',
          sayThis:
            '"I haven’t administered that exact feature in production yet—here is how I’d isolate the symptoms first, verify the vendor’s documentation and event logs safely, and escalate with clean evidence if needed."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Interview Prep -> Behavioral & Role-Play Rehearsal',
        priorityFormula: 'Impact: High (Job Readiness) × Urgency: Medium = P2 Prep',
        internalNotes: 'Rehearsed 5 STAR stories (avg 85 sec each) and completed angry-caller printer role-play with Coach Patch following 6-step method.',
        customerReply: 'I summarized next steps clearly before ending the simulated support call.',
        escalationCriteria: 'Ask Coach Patch to replay weak behavioral or technical answers with tightened STAR results.',
      },
    },

    commonTraps: [
      {
        trap: 'Saying "WE fixed the issue" throughout every STAR answer.',
        reality: 'Interviewers need to hear what **YOU** specifically said, checked, and documented—use *"I"* for your actions.',
      },
      {
        trap: 'Trying to bluff through an unfamiliar tool or OS question instead of explaining how you’d isolate it.',
        reality: 'Bluffing gets caught immediately in technical interviews; saying "I haven’t administered X yet, here is how I’d verify logs and documentation safely" earns trust.',
      },
    ],

    keyTerms: [
      {
        term: 'STAR Method (Situation, Task, Action, Result)',
        shortDef: '1–2 minute story framework emphasizing personal Action (`"I"`) and measurable Result + lesson learned.',
        fullDef: 'Works cleanly with retail, customer service, volunteering, and home-lab projects.',
      },
      {
        term: 'Transferable Customer Experience',
        shortDef: 'Mapping retail, hospitality, healthcare, or call-center de-escalation and prioritization directly onto Tier 1 SLA triage.',
        fullDef: 'Proves calm demeanor and queue discipline even without prior paid IT job titles.',
      },
      {
        term: '6-Part Mock Role-Play Rubric',
        shortDef: 'Scores Clarity, 6-Step Method, Empathy, Technical Accuracy, Honesty on Gaps, and Documentation/Follow-up.',
        fullDef: 'Guides realistic rehearsal under 30-minute interview pressure.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-1121-q1',
        prompt: 'During a technical interview, you are asked about a Windows service or tool quirk you genuinely do not know. What is the strongest response?',
        options: [
          'State honestly that you haven’t used it yet, walk through the troubleshooting principles you’d apply, and explain how you would verify documentation or escalate cleanly.',
          'Guess confidently and hope the interviewer doesn’t notice.',
          'Say "I only handle easy tickets."',
          'Go silent until they move to the next question.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Integrity + structured problem-solving is a top hiring signal on help desks.',
          'Incorrect: Bluffing fails technical screens immediately and signals security risk.',
          'Incorrect: Shows low ownership.',
          'Incorrect: Thinking aloud demonstrates method.',
        ],
        takeaway: 'Never bluff—combine honesty with structured next steps.',
      },
      {
        id: 'itsup-1121-q2',
        prompt: 'When delivering a behavioral STAR answer from your previous retail or call-center job, what mistake weakens the `Action` portion most?',
        options: [
          'Saying "we always fixed it" for 3 minutes instead of explaining clearly what *you* personally said, verified, and achieved in ~90 seconds.',
          'Sharing a concrete metric such as cutting wait times or resolving a rush backlog.',
          'Explaining how customer de-escalation translates directly to IT help desk tickets.',
          'Ending with one brief sentence about what you learned.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Hiring panels hire *you*, not your former team—always highlight your personal `"I"` actions concisely.',
          'Incorrect: Concrete metrics make STAR stories memorable.',
          'Incorrect: Connecting transferable skills helps career switchers stand out.',
          'Incorrect: Brief lessons learned show self-awareness.',
        ],
        takeaway: 'Keep STAR stories near 90 seconds, use `"I"` for Actions, and include a clear Result.',
      },
      {
        id: 'itsup-1121-q3',
        prompt: 'In an angry-caller role-play ("My slides won’t load and my VP meeting starts in 5 minutes!"), what earns top marks on the 6-part rubric?',
        options: [
          'Acknowledge their urgency calmly, ask targeted scope/workaround questions out loud, verify one quick path first, and close with documented follow-up.',
          'Lecture the user for waiting until 5 minutes before the meeting.',
          'Mumble silently for two minutes while guessing random menus.',
          'Disconnect the call and mark it resolved.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Empathy + structured thinking aloud + quick workaround restores trust and scores highly across all 6 rubric categories.',
          'Incorrect: Blaming users escalates anger immediately.',
          'Incorrect: Interviewers grade your reasoning process—always narrate steps calmly.',
          'Incorrect: Fails both empathy and technical ownership.',
        ],
        takeaway: 'Validate emotion first, think aloud methodically, and check for a fast workaround.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Run a 30-Min Mock Interview & Difficult-User Role-Play',
      instructions: [
        'Write and time 5 personal STAR stories aloud (target 75–110 seconds each).',
        'Ask Coach Patch to play both an interviewer and a rushed/upset caller for one scenario category.',
      ],
      verificationCheck: 'Completed 5 timed STAR stories + 1 live Coach Patch role-play.',
    },

    summaryBullets: [
      'Prepare across all 4 interview stages; test audio/video early and follow up same day.',
      'Rehearse 5 concise 1–2 min STAR stories using "I" statements and measurable results.',
      'Never bluff—think aloud, ask clarifying questions, and grade mock runs against the 6-part rubric.',
    ],

    sourcesToVerify: ['HDI Entry-Level Support Analyst Competency Framework'],
  },

  'itsup.11.6.1': {
    id: 'itsup.11.6.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 11: Interview Readiness',
    topicTitle: '11.5–11.8 Questions to Ask, Results CV & Cover Letter, 30-60-90 Plan & Cert Roadmap',
    code: '11.6.1',
    title: 'Smart Questions for Interviewers, Results-Driven CV / Cover Letter / Profile, Your First 90 Days & Certification Order',
    readMinutes: 13,
    prerequisites: ['itsup.11.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Ask thoughtful closing questions covering team tier splits, tooling/SLAs, shift expectations, training growth, and final background clarifications.',
      'Convert passive CV bullet tasks into measurable **results-driven achievements** (1–2 pages, 3-paragraph cover letter, aligned online profile + home-lab links).',
      'Execute a structured **30-60-90 Day Plan** and prioritize certifications in beginner order (A+/Google IT -> M365 Fundamentals -> ITIL 4 -> Network+/CCNA -> Security+/Endpoint Admin).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Do You Have Any Questions for Us?" + "Why Does Your CV Only List Job Duties?"',
      narrative:
        'Saying *"No, you answered everything"* signals low curiosity. Meanwhile, CVs stuffed with *"Responsible for answering phones"* get skipped while candidates showing *"Resolved 25 tickets/day with 95%+ CSAT and built a home AD + JSM lab"* get called back for interviews.',
    },

    plainEnglish: {
      analogyTitle: 'Proof-of-Work Brochure Rather Than a Laundry List of Chores',
      analogy:
        'A list of chores (*"Cleaned counter"*) tells nobody how well you performed. Showing outcomes (*"Cut customer wait time 30% during peak weekend shifts"*) paired with a clear **30-60-90 day ramp plan** makes managers picture you already thriving on their team.',
      technicalDefinition:
        'Career packaging combines measurable impact statements, honest keyword alignment, three-paragraph targeted cover letters, structured onboarding milestones, and sequenced vendor certifications.',
      paragraphs: [
        'In **11.5 Questions to Ask**, cover four buckets plus a strong closer: Team & tiers, Tools & SLAs, Typical volume/on-call expectations, Training/cert support—and finish with *"Is there anything on my background you’d like me to clarify?"*',
        'In **11.6 CV, Cover Letter & Profile**, keep the CV **1–2 pages** with clear sections (Summary, Grouped Skills, Work History **with numbers/results**, Home-Lab Projects, Education/Certs), keep cover letters to **3 crisp paragraphs** (why this role, 2–3 backed strengths, polite close), and match job-ad keywords honestly (never list tools you cannot discuss!).',
        'In **11.7 First 90 Days**, **Days 1–30: Learn** (tools, KB, shadowing, escalation paths); **Days 31–60: Own** (solo tickets, improving a KB article); **Days 61–90: Contribute** (harder tickets, data-backed improvement suggestion). In **11.8 Certification Roadmap**, start with **CompTIA A+ / Google IT Support** -> **Microsoft 365 Fundamentals** -> **ITIL 4 Foundation** -> **Network+ or CCNA** -> **Security+ or Endpoint Administrator** (always verify live vendor exam codes before booking).',
      ],
    },

    deepDive: {
      intro: 'Transform task bullets into results and sequence your career roadmap cleanly.',
      steps: [
        {
          step: '01',
          title: 'Converting Task Bullets Into Result Bullets',
          explanation:
            'Weak: *"Answered customer calls and fixed computer issues."* -> Strong: *"Handled 30+ daily inquiries across phone and chat while maintaining 96% satisfaction and authoring 4 step-by-step troubleshooting guides."* Transferable retail/ops roles work identically!',
        },
        {
          step: '02',
          title: 'Beginner Certification Sequencing (11.8)',
          explanation:
            'Step 1: **CompTIA A+** or **Google IT Support** -> Step 2: **Microsoft 365 Fundamentals** -> Step 3: **ITIL 4 Foundation** -> Step 4: **Network+ or Cisco CCNA** -> Step 5: **CompTIA Security+ or Microsoft Endpoint Admin** -> Tool certs (ServiceNow/Atlassian/Zendesk) once hired on that stack.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '30-60-90 Day Ramp & Certification Ladder',
        asciiFallback: `Days 1-30 (LEARN: KB, Shadows, Notes) -> Days 31-60 (OWN: Solo Queue, Edit KB) -> Days 61-90 (CONTRIBUTE: Trends, Mentor)
Cert Path: [A+ / Google IT] -> [M365 Fundamentals] -> [ITIL 4] -> [Network+ / CCNA] -> [Security+ / Endpoint Admin]`,
      },
      workedExample: {
        title: '3-Paragraph Targeted Cover Letter Outline',
        context: 'Applying for Junior Service Desk Analyst at a 200-person hybrid firm.',
        steps: [
          'Para 1: Why this company & role (mention their M365 + hybrid support focus).',
          'Para 2: Two backed strengths (3 years high-volume customer de-escalation + home lab covering AD lockouts, DNS/DHCP, M365 & Service Desk Simulator).',
          'Para 3: Enthusiasm to contribute in first 90 days + polite close.',
        ],
        outcome: 'Concise, readable in 30 seconds, zero fluff.',
      },
    },

    supportWalkthrough: {
      intro: 'Walk into every final manager interview with smart questions and a concrete 30-60-90 plan.',
      steps: [
        {
          phase: 'Align Honest Keywords Before Applying',
          action: 'Highlight required tools in the job post; showcase exact lab skills you built while leaving unfamiliar platforms off your CV until studied.',
          whyItWorks: 'Passes ATS keyword checks without failing live technical follow-ups.',
        },
      ],
      questionsToAsk: ['"How does your team define success for a new analyst at the 30-, 60-, and 90-day marks?"'],
      sampleUserWording: [
        {
          situation: 'Closing an interview memorably',
          sayThis:
            '"Thank you—two quick questions: how is work split between Tier 1 and Tier 2 here, and is there anything in my background I can clarify further?"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Career Launch -> CV, 90-Day Plan & Certs',
        priorityFormula: 'Impact: High × Urgency: Low = P3 Career Milestone',
        internalNotes: 'Converted 4 task bullets into measurable result bullets; drafted 30-60-90 plan; mapped cert track starting with CompTIA A+ / M365 Fundamentals.',
        customerReply: 'Portfolio, aligned CV, and 3-paragraph cover letter template ready for applications.',
        escalationCriteria: 'Verify current exam numbers (e.g., CompTIA A+ Core 1/2, MS-900/MD-102) directly on vendor certification sites before purchasing vouchers.',
      },
    },

    commonTraps: [
      {
        trap: 'Booking five expensive advanced certifications before applying for your first Tier 1 job.',
        reality: 'Pair foundational cert prep (A+/Google IT) + practical simulator/home-lab proof with active job applications—hands-on employers value triage clarity right away.',
      },
      {
        trap: 'Answering "No, you answered everything" when interviewers ask if you have questions at the end.',
        reality: 'Asking thoughtful questions about Tier 1/Tier 2 splits, SLAs, on-call rotation, and onboarding expectations demonstrates genuine readiness.',
      },
    ],

    keyTerms: [
      {
        term: '30-60-90 Day Plan & Certification Sequence',
        shortDef: 'Days 1–30 Learn -> 31–60 Own -> 61–90 Contribute; A+/Google IT -> M365 -> ITIL 4 -> Net+/CCNA -> Sec+.',
        fullDef: 'Always verify live exam codes on CompTIA, Microsoft Learn, PeopleCert, and Cisco pages.',
      },
      {
        term: 'Results-Driven CV Bullets',
        shortDef: 'Replacing passive duty lists with measurable outcomes, customer volume/CSAT, and documented home-lab builds.',
        fullDef: 'Keeps entry-level IT resumes scannable in 1–2 pages.',
      },
      {
        term: '3-Paragraph Targeted Cover Letter',
        shortDef: 'Concise structure: (1) Why this role/company, (2) 2–3 backed strengths, (3) Enthusiastic 90-day close.',
        fullDef: 'Avoids generic multi-page essays that recruiters skip.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-1161-q1',
        prompt: 'Which CV bullet demonstrates strongest help desk readiness for a career switcher?',
        options: [
          '"Handled 35+ daily customer escalations in a fast-paced team while maintaining 96% satisfaction, and documented AD, DNS, and M365 triage labs."',
          '"Helped people with stuff and watched IT videos."',
          '"Expert in ServiceNow, JSM, Cisco, Intune, Linux, Azure, and Security" (without lab experience).',
          'Five-page biography of every class since high school.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Measurable results + relevant transferable customer focus + honest hands-on lab evidence.',
          'Incorrect: Too vague.',
          'Incorrect: Overclaiming tools leads straight to failure in technical follow-up questions.',
          'Incorrect: Keep IT support CVs tight at 1–2 pages.',
        ],
        takeaway: 'Measurable results + honest keywords + lab projects beat generic chore lists.',
      },
      {
        id: 'itsup-1161-q2',
        prompt: 'Under a healthy **30-60-90 Day Plan** for a newly hired Tier 1 analyst, what is the primary focus during **Days 1–30**?',
        options: [
          'Learning internal ticketing workflows, KB articles, escalation paths, shadowing experienced analysts, and writing clean accurate notes.',
          'Rewriting company-wide firewall rules unilaterally during Week 1.',
          'Refusing to ask questions so nobody knows you are new.',
          'Skipping documentation to maximize solo ticket count on Day 2.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Days 1–30 = Learn systems/KB/process safely; 31–60 = Own routine queues; 61–90 = Contribute improvements.',
          'Incorrect: Unilateral firewall edits cause production outages.',
          'Incorrect: Asking thoughtful clarifying questions prevents avoidable mistakes.',
          'Incorrect: Speed without clean documentation hurts the whole desk.',
        ],
        takeaway: '30-60-90 Ramp: Learn (1–30) -> Own (31–60) -> Contribute (61–90).',
      },
      {
        id: 'itsup-1161-q3',
        prompt: 'At the end of an interview, the hiring manager asks "Do you have any questions for us?" Which question set best signals Tier 1 readiness?',
        options: [
          'Asking how Tier 1/Tier 2 escalations split, what SLA/ticket metrics matter most, and whether there is anything on your background to clarify.',
          'Saying "Nope, I just want to know how long lunch breaks are."',
          'Asking only "Did I pass?" before they leave the room.',
          'Silence.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Shows genuine interest in team workflow, expectations, and gives a final chance to address any unspoken concern.',
          'Incorrect: Misses the chance to demonstrate curiosity and professionalism.',
          'Incorrect: Too transactional without evaluating team fit.',
          'Incorrect: Signals passive disinterest.',
        ],
        takeaway: 'Bring 3–4 smart workflow/expectation questions plus "Anything on my background I can clarify?"',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Rewrite 1 CV Bullet & Draft Your 30-60-90 Plan',
      instructions: [
        'Rewrite one task-based CV bullet into a measurable result bullet.',
        'Outline 3 bullet goals each for Days 1–30, Days 31–60, and Days 61–90.',
      ],
      verificationCheck: 'Measurable CV bullet + complete 30-60-90 onboarding checklist.',
    },

    summaryBullets: [
      'Ask targeted questions about team tiers, SLAs, shift expectations, growth, and final clarifications.',
      'Keep CVs 1–2 pages with measurable achievements and honest skills; cover letters 3 crisp paragraphs.',
      'Follow Learn (30) -> Own (60) -> Contribute (90) and verify live certification exam details before booking.',
    ],

    sourcesToVerify: ['CompTIA, Microsoft Learn, PeopleCert ITIL 4 & Cisco Official Certification Pages'],
  },

  'itsup.appendix.quickref': {
    id: 'itsup.appendix.quickref',
    moduleId: 'it-support',
    unitTitle: 'Appendix: Quick Reference',
    topicTitle: 'Field Pocket Cheat Sheet: Templates, Priority Matrix, 19 Windows Commands & 8 Ports',
    code: 'APP.1',
    title: 'Pocket Reference: Ticket & Escalation Templates, Phone Scripts, 6-Step Triage, 19 Essential Windows Commands & 8 Ports',
    readMinutes: 10,
    prerequisites: ['itsup.11.6.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Copy clean, complete templates for Ticket Notes, Escalation Handoffs, Phone Opening/Closing, and Major Outage Status Updates.',
      'Recall the 6-Step Troubleshooting Loop and Illustrative Impact × Urgency Priority Matrix instantly under call pressure.',
      'Reference all 19 essential Windows support commands and 8 core TCP/UDP support ports accurately (while verifying vendor UI/OS details live).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Day 1 on the Live Desk: Everything You Need in One Single-Screen Cheat Sheet',
      narrative:
        'When your first live user calls with a stalled print queue, an expired password, or a sudden VPN disconnect, scanning one clean pocket sheet keeps your tone polite, your commands accurate, and your ticket handoffs airtight.',
    },

    plainEnglish: {
      analogyTitle: 'Pilot’s Laminated Cockpit Checklist',
      analogy:
        'Experienced pilots still read the laminated pre-flight card every morning—not because they forgot how planes fly, but so speed and stress never skip a critical step.',
      technicalDefinition:
        'Consolidated operational reference uniting structured documentation templates, troubleshooting order, CLI diagnostics, and foundational port numbers.',
      paragraphs: [
        '**Phone Opening:** *"Hello, [Company] IT Support, this is [Your Name]—how can I help you today?"* **Phone Closing:** Summarize exact actions taken & next steps, confirm resolution or follow-up time, and ask *"Is there anything else I can help you with today?"*',
        '**6 Troubleshooting Steps:** (1) Identify the problem (gather info & changes), (2) Form a theory, (3) Test the theory, (4) Plan & apply the fix, (5) Verify full functionality & prevent recurrence, (6) Document clearly.',
        '**Priority Matrix (Illustrative):** High Impact × High Urgency = **P1**; High Impact/Lower Urgency OR Low Impact/High Urgency = **P2/P3**; Low Impact × Low Urgency = **P4**. Always verify exact vendor command flags or OS updates against live documentation.',
      ],
    },

    deepDive: {
      intro: 'Bookmark this appendix for rapid desk & interview review.',
      steps: [
        {
          step: '01',
          title: 'Ticket Note, Escalation & Status Update Templates',
          explanation:
            '**Ticket Note:** Issue | Impact | Environment (device, OS, location) | Steps Taken | Result | Next Action. **Escalation Note:** User report | Impact/Urgency | Tried steps & results | Evidence (exact errors, screenshots, timestamps) | Callback info | What user was told. **Status Update:** Affected | Known | Doing | Workaround | Next update time.',
        },
        {
          step: '02',
          title: '19 Windows Commands & 8 Essential Ports',
          explanation:
            '**Commands:** `ipconfig /all`, `ipconfig /release`, `ipconfig /renew`, `ipconfig /flushdns`, `ping`, `tracert`, `nslookup`, `netstat -ano`, `sfc /scannow`, `DISM /Online /Cleanup-Image /RestoreHealth`, `chkdsk`, `gpupdate /force`, `gpresult /r`, `whoami`, `systeminfo`, `tasklist`, `taskkill`, `net use`, `shutdown /r /t 0`. **Ports:** `22` SSH, `25`/`587` email sending (SMTP), `53` DNS, `67`/`68` DHCP, `80` HTTP, `443` HTTPS, `3389` Remote Desktop (RDP).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Pocket Reference Card (Commands + Ports)',
        asciiFallback: `NET CLI : ipconfig (/all|/release|/renew|/flushdns) | ping | tracert | nslookup | netstat -ano | net use
SYS CLI : sfc /scannow | DISM /Online /Cleanup-Image /RestoreHealth | chkdsk | gpupdate /force | gpresult /r
ADMIN   : whoami | systeminfo | tasklist | taskkill | shutdown /r /t 0
PORTS   : 22 SSH | 25 & 587 SMTP | 53 DNS | 67 & 68 DHCP | 80 HTTP | 443 HTTPS | 3389 RDP`,
      },
      workedExample: {
        title: 'Using the Escalation Template in 60 Seconds',
        context: 'Tier 1 confirmed single-building PoE switch loss affecting 12 VoIP phones.',
        steps: [
          'Include wall jack IDs (`FL2-W12..W23`), confirmed dead link LEDs, known-good laptop swap test result, timestamps, and user notification status.',
        ],
        outcome: 'Tier 2 NetOps dispatches immediately with zero bounce-back.',
      },
    },

    supportWalkthrough: {
      intro: 'Pair every quick command with clear plain-English notes.',
      steps: [
        {
          phase: 'Never Paste Passwords or Keys in Notes',
          action: 'Audit every ticket field before saving to exclude temporary passwords, MFA seeds, or BitLocker recovery keys.',
          whyItWorks: 'Protects credential security inside shared ticketing audit logs.',
        },
      ],
      questionsToAsk: ['"Is there anything else I can help you with today before I send your summary note?"'],
      sampleUserWording: [
        {
          situation: 'Standard warm phone greeting & closing',
          sayThis:
            '"Hi, Acme IT Service Desk, this is Maya speaking—how can I help you today?" ... "Great, your printer is working and I’ve noted your ticket ID INC-1099. Is there anything else I can help you with?"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Reference Template -> Standard Ticket',
        priorityFormula: 'Impact × Urgency Matrix (P1 Critical -> P4 Low)',
        internalNotes: `Issue: [1-sentence symptom] | Impact: [Who/how many blocked] | Env: [Hostname, OS, Location]
Steps & Result: [Exact commands/tests & outputs] | Next Action: [Follow-up / Escalation owner]`,
        customerReply: 'Summary of steps verified, confirmed working status, and your ticket reference number.',
        escalationCriteria: 'Attach exact error text, timestamps, screenshots, and steps tried before transferring queues.',
      },
    },

    commonTraps: [
      {
        trap: 'Memorizing commands without checking whether the issue affects 1 user or 50 users first.',
        reality: 'Always check Scope & Impact first—a command won’t fix a building-wide switch outage.',
      },
      {
        trap: 'Pasting temporary passwords, MFA seeds, or BitLocker recovery keys inside shared ticket notes.',
        reality: 'Ticketing databases persist permanently across wide staff teams—keep secrets out of comments and escalations.',
      },
    ],

    keyTerms: [
      {
        term: '8 Core Ports (22, 25/587, 53, 67/68, 80, 443, 3389)',
        shortDef: 'SSH (22), SMTP (25/587), DNS (53), DHCP (67/68), HTTP (80), HTTPS (443), RDP (3389).',
        fullDef: 'Essential endpoints for firewall, VPN, mail, and connectivity verification.',
      },
      {
        term: '6-Step Pocket Loop',
        shortDef: '1 Identify -> 2 Theorize -> 3 Test -> 4 Plan/Fix -> 5 Verify Full Function -> 6 Document.',
        fullDef: 'Universal diagnostic checklist across hardware, Windows, macOS, network, and cloud issues.',
      },
      {
        term: 'Standard Escalation Note',
        shortDef: 'User report, Impact/Urgency, Tried steps + results, Exact errors/timestamps, Callback info, User expectation set.',
        fullDef: 'Eliminates Tier 2 bounce-backs.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-app-q1',
        prompt: 'Which set accurately matches three essential support ports from the Pocket Reference?',
        options: [
          '53 = DNS, 67/68 = DHCP, 3389 = Remote Desktop (RDP)',
          '53 = RDP, 67/68 = SSH, 3389 = DNS',
          '22 = HTTPS, 80 = SMTP, 443 = DHCP',
          '25 = RDP, 587 = DNS, 443 = HTTP',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: DNS=53, DHCP=67/68, RDP=3389 (plus 22=SSH, 25/587=SMTP, 80=HTTP, 443=HTTPS).',
          'Incorrect: Scrambled.',
          'Incorrect: Scrambled.',
          'Incorrect: Scrambled.',
        ],
        takeaway: '22 SSH | 25 & 587 SMTP | 53 DNS | 67 & 68 DHCP | 80 HTTP | 443 HTTPS | 3389 RDP.',
      },
      {
        id: 'itsup-app-q2',
        prompt: 'A user moved buildings, still holds a stale cached DNS lookup, and needs Group Policy refreshed without rebooting immediately. Which Windows command pair targets DNS cache + GPO refresh?',
        options: [
          '`ipconfig /flushdns` followed by `gpupdate /force`',
          '`chkdsk` followed by `taskkill`',
          '`shutdown /r /t 0` followed by `whoami`',
          '`sfc /scannow` followed by `netstat -ano`',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `ipconfig /flushdns` clears stale local resolver entries and `gpupdate /force` reapplies Computer/User Group Policy.',
          'Incorrect: `chkdsk` scans disk corruption and `taskkill` stops processes.',
          'Incorrect: `shutdown /r /t 0` forces an immediate reboot.',
          'Incorrect: `sfc /scannow` repairs protected OS files and `netstat -ano` lists open sockets/PIDs.',
        ],
        takeaway: 'Know what each of the 19 Windows pocket commands actually changes before running it.',
      },
      {
        id: 'itsup-app-q3',
        prompt: 'Before transferring a stubborn ticket to Tier 2, which six elements belong in the Standard Escalation Template?',
        options: [
          'User report, Impact/Urgency, Tried steps & results, Exact evidence/timestamps, Callback contact, and What the user was told.',
          'Only "Doesn’t work, please check."',
          'The user’s plaintext BitLocker recovery key and current password.',
          'A blank Work Note so Tier 2 starts from scratch.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Complete escalation context avoids ping-pong bounce-backs and protects security.',
          'Incorrect: Unusable one-liners get bounced back to Tier 1.',
          'Incorrect: Never paste secrets or recovery keys inside ticket notes.',
          'Incorrect: Wastes Tier 2 time repeating basic Tier 1 triage.',
        ],
        takeaway: 'Clean escalations = Report + Impact/Urgency + Tried + Evidence + Callback + Expectation set.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Run & Log 5 Windows Pocket Commands in Your Lab',
      instructions: [
        'Run `whoami`, `systeminfo`, `ipconfig /all`, `nslookup`, and `netstat -ano` on a test Windows PC or sandbox.',
        'Practice filling one full Escalation Note template from memory.',
      ],
      verificationCheck: 'Can explain each of the 19 commands and 8 ports without notes.',
    },

    summaryBullets: [
      'Use the Ticket Note, Escalation, Status Update, and Phone Greeting/Closing templates consistently.',
      'Know all 6 Troubleshooting Steps, Impact × Urgency Matrix, 19 Windows commands, and 8 core ports.',
      'Always verify live product documentation, exam codes, and OS screens as tools evolve.',
    ],

    sourcesToVerify: ['Microsoft Windows Command-Line Reference', 'IANA Service Name and Transport Protocol Port Numbers'],
  },
};
