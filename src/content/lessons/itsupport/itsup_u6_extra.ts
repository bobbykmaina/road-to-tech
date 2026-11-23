import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_U6_EXTRA_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.6.2.1': {
    id: 'itsup.6.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 6: Microsoft 365 and Cloud',
    topicTitle: '6.1–6.2 Cloud Fundamentals, Shared Responsibility & M365 RBAC Portals',
    code: '6.2.1',
    title: 'Cloud & SaaS Models (IaaS/PaaS/SaaS, Public/Private/Hybrid), Tenants, Shared Responsibility, M365 Licensing & Admin Centers',
    readMinutes: 12,
    prerequisites: ['5.2.1', '5.5.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Contrast SaaS (M365, Google Workspace, Salesforce), PaaS, and IaaS alongside Public, Private, and Hybrid clouds and cloud Tenants.',
      'Apply the Shared Responsibility Model—explaining why account/configuration mistakes drive most cloud incidents.',
      'Check provider Service Health pages early and explain how SaaS licensing controls mailboxes, Teams, and cloud apps.',
      'Navigate the five core Microsoft 365 admin portals and enforce least-privilege RBAC roles (`Helpdesk Admin` vs `Global Admin`).',
    ],

    whyThisMatters: {
      scenarioTitle: '"New Starter Has No Mailbox—And 20 Staff Think Our Office Router Broke Teams!"',
      narrative:
        'A Monday new starter signs into `office.com` and finds zero Outlook email tile, while twenty minutes later staff across three cities cannot send Teams messages. Checking **M365 Licensing** first and **Service Health** before debugging local PCs saves hours.',
    },

    plainEnglish: {
      analogyTitle: 'Renting a Furnished Apartment Inside a Mega-Complex',
      analogy:
        'Microsoft maintains the building power, roof, and elevators (**cloud infrastructure**), while **your company** still locks your apartment door, manages spare keys, and keeps files off the balcony (**accounts, MFA, licenses, permissions** = Shared Responsibility!).',
      technicalDefinition:
        'Cloud administration distinguishes IaaS/PaaS/SaaS delivery models and Public/Private/Hybrid deployments across isolated organization tenants, enforcing Shared Responsibility through SKU licensing and RBAC portals.',
      paragraphs: [
        'Three cloud layers: **IaaS** (rented virtual servers/disks), **PaaS** (app hosting runtime), **SaaS** (ready-to-use cloud apps like M365, Google Workspace, Salesforce). Deployments run Public, Private, or Hybrid inside a company’s private **Tenant**.',
        '**New user has no mailbox?** Check their assigned **M365 License** first! Assign **Helpdesk Admin** or **User Admin** rather than routine **Global Admin** across the M365, Entra, Exchange, Teams, and Intune Admin Centers.',
      ],
    },

    deepDive: {
      intro: 'Learn the five M365 Admin Portals, RBAC tiers, and SaaS troubleshooting differences.',
      steps: [
        {
          step: '01',
          title: 'How Supporting SaaS Differs From Installed PC Apps',
          explanation:
            'Updates arrive silently; licenses turn features on/off; outages can originate on the vendor side—always check **M365 / Google Service Health** early!',
        },
        {
          step: '02',
          title: 'Five M365 Portals & RBAC Roles',
          explanation:
            'M365 Admin Center (users, licenses, Service Health), Entra (sign-in logs, MFA), Exchange (mailboxes, Message Trace), Teams (audio/policies), Intune (compliance, remote lock/wipe). Follow least privilege!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Shared Responsibility & Microsoft 365 Five-Portal Map',
        asciiFallback: `Provider: Datacenters, Hardware, Uptime | Customer: Accounts, MFA, Licenses, Sharing, Data
Portals:  [M365 Admin] [Entra] [Exchange] [Teams] [Intune]`,
      },
      workedExample: {
        title: 'Fixing a Missing New-Hire Mailbox & Spotting a Cloud Outage',
        context: 'New starter sees "No mailbox"; 15 staff report slow Teams.',
        steps: [
          'Assigned Microsoft 365 license via security group in M365 Admin Center -> Exchange provisioned mailbox.',
          'Checked Service Health -> spotted active Microsoft advisory TM-90142 -> briefed staff with browser/email workaround.',
        ],
        outcome: 'Saved hours of unnecessary laptop reboots.',
      },
    },

    supportWalkthrough: {
      intro: 'Check Service Health and Licenses in the M365 Admin Center early.',
      steps: [
        {
          phase: 'Check Service Health Early',
          action: 'Inspect M365 Service Health whenever >2 users report cloud failures together.',
          whyItWorks: 'Prevents troubleshooting healthy laptops during a Microsoft outage.',
        },
      ],
      questionsToAsk: ['"When you sign into portal.office.com, which app icons show up?"'],
      sampleUserWording: [
        {
          situation: 'Communicating a cloud vendor advisory calmly',
          sayThis:
            '"Microsoft confirmed an active regional Teams advisory right now—your laptop is healthy, and we’ll update you as soon as Microsoft resolves it."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Microsoft 365 -> License Provisioning',
        priorityFormula: 'Impact: Low (1 new hire) × Urgency: High = P2 High',
        internalNotes: `[CHECK] Active User lacked M365 license SKU. Assigned group-based Business license; verified Exchange mailbox + OWA live.`,
        customerReply: 'Welcome aboard! Your M365 license synced and your mailbox is now ready at portal.office.com.',
        escalationCriteria: 'Escalate empty license pools to Procurement; tenant-wide configs to L2 Cloud Admins.',
      },
    },

    commonTraps: [
      {
        trap: 'Making every Tier 1 analyst a **Global Administrator**.',
        reality: 'Use scoped **Helpdesk Admin** / **User Admin** RBAC roles to contain compromise risk.',
      },
      {
        trap: 'Spending 30 minutes wiping Outlook caches on one laptop when 15 colleagues in another office hit the exact same Teams error.',
        reality: 'Check **M365 / Google Service Health** immediately whenever multiple users experience cloud failures simultaneously.',
      },
    ],

    keyTerms: [
      {
        term: 'SaaS / PaaS / IaaS & Tenant',
        shortDef: 'Finished web software (`SaaS`), app platform (`PaaS`), virtual infrastructure (`IaaS`) inside an org `Tenant`.',
        fullDef: 'Microsoft 365 and Google Workspace are classic SaaS suites.',
      },
      {
        term: 'Shared Responsibility & RBAC',
        shortDef: 'Provider runs infra; customer owns accounts/licenses/data under scoped Helpdesk/User/Exchange Admin roles.',
        fullDef: 'Check Service Health pages early when multi-user SaaS issues hit.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-621-q1',
        prompt: 'A new starter can sign into Microsoft 365 yet has NO mailbox. What do you check first?',
        options: [
          'Verify whether an M365 license containing Exchange Online is assigned to the user.',
          'Reinstall Windows.',
          'Swap their dock.',
          'Flush DNS.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: No license = no Exchange mailbox provisioned.',
          'Incorrect: OS unrelated.',
          'Incorrect: Hardware unrelated.',
          'Incorrect: DNS unrelated.',
        ],
        takeaway: 'No mailbox / missing Teams = check **License** first!',
      },
      {
        id: 'itsup-621-q2',
        prompt: 'Under the Shared Responsibility Model for SaaS (like M365), what does the CUSTOMER own?',
        options: [
          'Accounts, MFA, licenses, least-privilege roles, sharing rules, and data hygiene.',
          'Microsoft data center cooling.',
          'Server disk swaps in Azure.',
          'Building physical power generators.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Customers always own identity, access configuration, and data.',
          'Incorrect: Provider infra.',
          'Incorrect: Provider hardware.',
          'Incorrect: Provider facility.',
        ],
        takeaway: 'Provider secures cloud platform; customer secures identities and configurations.',
      },
      {
        id: 'itsup-621-q3',
        prompt: 'Fifteen staff across three cities lose Teams messaging at once. What should you check first?',
        options: [
          'M365 Admin Center -> Service Health dashboard for an active provider incident.',
          'Tell all 15 to replace home routers.',
          'Format 15 laptops.',
          'Rewire the office.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Multi-location simultaneous drops indicate vendor cloud advisory.',
          'Incorrect: Unlikely.',
          'Incorrect: Destructive.',
          'Incorrect: Remote staff aren’t on office wires.',
        ],
        takeaway: 'Check SaaS Service Health before blaming endpoints during simultaneous drops.',
      },
      {
        id: 'itsup-621-q4',
        prompt: 'Why grant Helpdesk Admin instead of Global Admin to frontline support staff?',
        options: [
          'Enforces least privilege for password resets/health checks without exposing tenant-wide billing and wipes.',
          'Global Admins cannot view health.',
          'Helpdesk Admins skip tickets.',
          'Banned by Microsoft.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Scoped RBAC limits compromise blast radius.',
          'Incorrect: False.',
          'Incorrect: False.',
          'Incorrect: False.',
        ],
        takeaway: 'Assign minimal RBAC roles (Helpdesk Admin, User Admin) instead of Global Admin.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Inspect Service Health & Map M365 Portals',
      instructions: [
        'Compare the 5 portals (M365 Admin, Entra, Exchange, Teams, Intune) and list which handles licenses, sign-in logs, message trace, call quality, and device wipe.',
      ],
      verificationCheck: 'All 5 portals mapped accurately.',
    },

    summaryBullets: [
      'SaaS rents web software in a Tenant; Shared Responsibility puts accounts/licenses/config on IT.',
      'Check Service Health early whenever multiple users hit cloud failures together.',
      'Missing new-hire mailbox -> check assigned M365 License first.',
      'Enforce RBAC least privilege across M365, Entra, Exchange, Teams, and Intune Admin Centers.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Shared Responsibility, M365 Admin Roles & Service Health',
    ],
  },

  'itsup.6.3.1': {
    id: 'itsup.6.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 6: Microsoft 365 and Cloud',
    topicTitle: '6.3 Email: Exchange Online and Outlook',
    code: '6.3.1',
    title: 'SMTP & MX Delivery, Mailboxes (User/Shared/Room), Outlook Safe Mode & OST, NDR Codes (550/552/554), Message Trace & SPF/DKIM/DMARC',
    readMinutes: 14,
    prerequisites: ['4.2.1', '6.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Trace email delivery via SMTP + domain `MX` records and compare User, Shared, Room/Equipment mailboxes, and Distribution Lists.',
      'Troubleshoot Outlook cleanly: OWA webmail check, `outlook.exe /safe`, `.ost` cached mode, Credential Manager, and fresh profile.',
      'Decode critical bounce codes (NDRs): `550 5.1.1` (bad recipient), `552` (full/too big), and `554 5.7.1` (blocked/rejected).',
      'Use Exchange **Message Trace** and explain **SPF, DKIM, and DMARC** email authentication.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Client Sent Our Contract Twice—We Never Got It! Plus Outlook Crashes!"',
      narrative:
        'A partner receives a `554 5.7.1` bounce while desktop Outlook freezes opening attachments. Testing **Outlook on the web** separates desktop issues from cloud mail immediately, while **Message Trace** + **SPF/DKIM/DMARC** pinpoints blocked or quarantined mail.',
    },

    plainEnglish: {
      analogyTitle: 'Postal Sorting (`MX`), Cryptographic Wax Seals (`SPF/DKIM/DMARC`) & Tracking (`Message Trace`)',
      analogy:
        'Email looks up the recipient’s **`MX` DNS record** and ships over **SMTP**. **SPF** publishes approved post offices allowed to send for your domain, **DKIM** adds a cryptographic wax seal proving nobody forged it, and **DMARC** decides whether failed mail goes to Junk or bounces! **Message Trace** tracks whether mail arrived, quarantined, or never hit your server.',
      technicalDefinition:
        'Exchange Online triage pairs mailbox models and Outlook client isolation (`outlook.exe /safe`, OWA) with NDR bounce interpretation (`550`, `552`, `554`), Message Trace logs, and SPF/DKIM/DMARC DNS alignment.',
      paragraphs: [
        'Mailbox types: User, **Shared Mailbox** (team inbox, usually no license needed up to 50 GB!), Room/Equipment, and Distribution Lists. Classic Outlook keeps an `.ost` local cache; New Outlook shares the same Exchange backend.',
        'If **"Never got an important email"**: check Junk & Quarantine -> check Outlook Rules/Forwarding -> verify sender spelling -> run **Message Trace** in Exchange Admin Center! Fix crashing desktop Outlook via OWA check -> **`outlook.exe /safe`** -> disable broken add-in -> Credential Manager / fresh profile.',
      ],
    },

    deepDive: {
      intro: 'Walk through Outlook client fixes, NDR codes, Message Trace, and SPF/DKIM/DMARC.',
      steps: [
        {
          step: '01',
          title: 'Five Outlook Repairs & NDRs',
          explanation:
            'Test OWA -> run `outlook.exe /safe` -> disable add-in -> check quota/archive -> recreate mail profile. Read bounces: `550 5.1.1` (no such address), `552` (mailbox full / oversized), `554 5.7.1` (blocked/DMARC/policy).',
        },
        {
          step: '02',
          title: 'SPF, DKIM & DMARC Authentication',
          explanation:
            'SPF lists authorized sender IPs in DNS TXT; DKIM cryptographically signs headers/body; DMARC enforces Quarantine/Reject on unaligned mail (why unconfigured 3rd-party CRMs land in Junk!).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Exchange Delivery, SPF/DKIM/DMARC & Message Trace',
        asciiFallback: `[SMTP + DKIM] -> [DNS Checks MX, SPF, DMARC] -> [Exchange Message Trace: Delivered / Quarantined / Bounced 550/552/554]`,
      },
      workedExample: {
        title: 'Diagnosing Missing Client Mail & Crashing Outlook',
        context: 'HR SaaS bounces `554 5.7.1 DMARC fail`; Outlook crashes on PDF attachments.',
        steps: [
          'Message Trace caught `554`/Quarantine due to missing SPF/DKIM DNS setup for new SaaS mailer -> coordinated DNS fix.',
          'OWA worked fine -> `outlook.exe /safe` ran clean -> disabled bad PDF COM add-in.',
        ],
        outcome: 'Restored client mail deliverability and desktop Outlook stability in minutes.',
      },
    },

    supportWalkthrough: {
      intro: 'Always test OWA (`outlook.office.com`) and check Message Trace early.',
      steps: [
        {
          phase: 'Test OWA First',
          action: 'Check webmail before deleting desktop `.ost` caches or reinstalling Office.',
          whyItWorks: 'Splits cloud delivery vs desktop bug in 15 seconds.',
        },
      ],
      questionsToAsk: [
        '"Does outlook.office.com in your browser show the email or open smoothly?"',
        '"Did the sender get a bounce code like 550 or 554?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining Safe Mode isolation simply',
          sayThis:
            '"Running Outlook in Safe Mode pauses extra plugins—since it works there, we know a PDF plugin caused the crash rather than your mailbox!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Email & M365 -> Outlook Crash / Message Trace',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium = P3 Medium',
        internalNotes: `[CHECKS] OWA OK -> outlook.exe /safe OK -> disabled defective PDF add-in. Message Trace located quarantined client invoice; verified sender & released safely.`,
        customerReply:
          'Hi Jordan — Disabling a faulty PDF plugin stopped Outlook’s crashes, and we located and delivered your client’s quarantined invoice safely!',
        escalationCriteria: 'Escalate DNS SPF/DKIM/DMARC edits to L2 Exchange/Messaging.',
      },
    },

    commonTraps: [
      {
        trap: 'Reinstalling Microsoft Office before running `outlook.exe /safe` and testing OWA.',
        reality: 'Damaged add-ins and profiles survive full reinstalls.',
      },
      {
        trap: 'Telling a sender "the email never arrived anywhere" without running Exchange **Message Trace**.',
        reality: 'Message Trace proves in seconds whether the message was Delivered, Quarantined, Filtered to Junk, or Bounced (`550`/`552`/`554`).',
      },
    ],

    keyTerms: [
      {
        term: 'NDRs (`550 5.1.1`, `552`, `554 5.7.1`)',
        shortDef: 'Bad recipient (`550 5.1.1`), mailbox full (`552`), blocked/rejected (`554 5.7.1`).',
        fullDef: 'Always request exact NDR diagnostic lines.',
      },
      {
        term: 'SPF, DKIM & DMARC',
        shortDef: 'DNS authorized sender list (`SPF`), crypto signature (`DKIM`), fail action (`DMARC`).',
        fullDef: 'Stops spoofing while keeping legitimate mail out of Junk.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-631-q1',
        prompt: 'A user never received an important external email. What should you check?',
        options: [
          'Check Junk/Quarantine, inspect Outlook rules/forwarding, verify sender address, and run Exchange Message Trace.',
          'Delete their `.ost` and reboot router.',
          'Upgrade Windows Home to Pro.',
          'Grant Global Admin.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Message Trace proves delivered, quarantined, delayed, or never received.',
          'Incorrect: Doesn’t inspect server mail flow.',
          'Incorrect: Unrelated.',
          'Incorrect: Security risk.',
        ],
        takeaway: 'Missing mail = Junk/Quarantine -> Rules -> Address check -> Exchange Message Trace.',
      },
      {
        id: 'itsup-631-q2',
        prompt: 'Which command opens desktop Outlook with all add-ins disabled for crash isolation?',
        options: [
          'outlook.exe /safe',
          'outlook.exe /flushdns',
          'sfc /outlook',
          'net use',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Disables add-ins cleanly.',
          'Incorrect: Invalid.',
          'Incorrect: Invalid.',
          'Incorrect: Network share.',
        ],
        takeaway: 'Test webmail and `outlook.exe /safe` early.',
      },
      {
        id: 'itsup-631-q3',
        prompt: 'Match bounce codes `550 5.1.1`, `552`, and `554 5.7.1`:',
        options: [
          '`550 5.1.1` = unknown recipient; `552` = mailbox full/too big; `554 5.7.1` = blocked/policy/auth reject.',
          'All mean wrong Windows PIN.',
          '`554` means delivered.',
          'Printer jams.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Classic SMTP NDR codes.',
          'Incorrect: False.',
          'Incorrect: `5xx` is permanent failure.',
          'Incorrect: Unrelated.',
        ],
        takeaway: '`550 5.1.1` = bad address; `552` = full/size; `554 5.7.1` = rejected.',
      },
      {
        id: 'itsup-631-q4',
        prompt: 'Why might mail from a company’s new CRM tool land in Junk or fail DMARC?',
        options: [
          'Missing DNS SPF/DKIM configuration authorizing that CRM to send for your domain.',
          '5 GHz Wi-Fi.',
          'Shared Mailbox.',
          'exFAT USB.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SPF/DKIM alignment is required to pass DMARC.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Configure SPF + DKIM properly so legitimate SaaS senders pass DMARC.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Solve Outlook Safe Mode Crashes & SPF/DMARC Bounces',
      targetTab: 'simulator',
      instructions: [
        'Run both the Outlook `/safe` Add-In scenario AND the NDR 554 / DMARC Message Trace scenario in the Service Desk Simulator.',
      ],
      verificationCheck: '4/4 scores on both scenarios.',
    },

    summaryBullets: [
      'Email routes via SMTP to `MX` DNS records; Shared Mailboxes require no extra base license.',
      'Check OWA and `outlook.exe /safe` before rebuilding profiles.',
      'Read NDR codes: `550 5.1.1` (bad address), `552` (full), `554 5.7.1` (blocked).',
      'Use Message Trace to track missing mail; align SPF, DKIM, and DMARC via DNS.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Message Trace, Outlook Safe Mode & SPF/DKIM/DMARC',
    ],
  },

  'itsup.6.4.1': {
    id: 'itsup.6.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 6: Microsoft 365 and Cloud',
    topicTitle: '6.4–6.5 Teams, OneDrive, SharePoint & M365 Service Desk Tasks',
    code: '6.4.1',
    title: 'Teams Cache & Audio/Lobby Faults, OneDrive Known Folder Move & 93-Day Recycle, SharePoint Sharing Links & Graph PowerShell License Caution',
    readMinutes: 13,
    prerequisites: ['6.2.1', '6.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Troubleshoot Microsoft Teams audio/video, lobby/guest issues, sign-in loops, stale app cache, and browser fallback.',
      'Support OneDrive Known Folder Move, Files On-Demand, sync blockers (quota, illegal characters, long paths), and Recycle Bin (~93 days).',
      'Manage SharePoint groups (Owners/Members/Visitors), Version History, and Specific People vs Anyone sharing links.',
      'Apply Microsoft Graph PowerShell safety and prevent accidental data deletion when removing departed-user licenses.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Help, Formulas Got Overwritten!" & "Don’t Strip That Ex-Employee’s License Yet!"',
      narrative:
        'A user overwrites a critical shared Teams Excel sheet, OneDrive flashes red on an invalid filename character, and a trainee almost removes an ex-employee’s license before converting/retaining data. Clean Version History, path triage, and offboarding discipline prevent data loss.',
    },

    plainEnglish: {
      analogyTitle: 'Personal Cloud Backpack (OneDrive) vs. Shared Filing Room (SharePoint + Teams)',
      analogy:
        '**OneDrive** backs up Desktop/Documents/Pictures automatically (**Known Folder Move**) while **SharePoint** powers **Teams** team folders under **Owners, Members, Visitors**. Prefer **"Specific People"** links over wide-open **"Anyone"** keys!',
      technicalDefinition:
        'M365 collaboration support isolates Teams client vs browser paths, resolves OneDrive path/quota sync stalls, restores SharePoint versions/recycle bins, and safeguards tenant retention during license edits.',
      paragraphs: [
        'For Teams calls failing 2 minutes before meetings: open **Teams in Browser (`teams.microsoft.com`)** immediately, then check OS Mic/Camera privacy and clear client cache later.',
        'OneDrive sync breaks on: auth expiry, Paused sync, Full quota, or **invalid characters (`? * : < >`) / >400-char paths**. Deleted items enter Recycle Bins (commonly ~93 days across stages). SharePoint **Version History** rescues overwritten files in 15 seconds.',
        'Test **Microsoft Graph PowerShell** scripts on one test user first—and **NEVER remove a leaver’s M365 license** before converting mailbox / preserving OneDrive data (unlicensing starts a hard deletion countdown!).',
      ],
    },

    deepDive: {
      intro: 'Diagnose Teams, OneDrive, SharePoint sharing, and license-deletion traps cleanly.',
      steps: [
        {
          step: '01',
          title: 'Teams, OneDrive & SharePoint Checklists',
          explanation:
            'Teams -> check browser fallback + OS audio/camera privacy + cache. OneDrive -> check sign-in, pause, quota, illegal chars/long paths. SharePoint -> check group membership + Specific People links + Version History.',
        },
        {
          step: '02',
          title: 'Graph PowerShell & License-Removal Grace Warning',
          explanation:
            'Always convert/retain departed staff data BEFORE stripping licenses so Microsoft’s ~30-day hard delete timer doesn’t purge corporate records.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'OneDrive vs SharePoint vs Teams Collaboration Map',
        asciiFallback: `[Teams Channel] == [M365 Group] == [SharePoint (Owners/Members/Visitors + Version History)]
[PC Desktop/Docs] ==(KFM)==> [OneDrive Personal Cloud] ---> 93-Day Recycle Bin`,
      },
      workedExample: {
        title: 'Restoring Overwritten Excel Sheet + Clearing OneDrive Sync Block',
        context: 'Overwritten `Q4_Budget.xlsx` + red-X OneDrive path containing `?`.',
        steps: [
          'Used SharePoint Version History to restore the 10:15 AM pre-edit copy cleanly.',
          'Removed `?` and shortened nested path -> OneDrive synced green.',
        ],
        outcome: 'Saved hours of lost spreadsheet work in 3 minutes.',
      },
    },

    supportWalkthrough: {
      intro: 'Teach users Version History and browser Teams fallback.',
      steps: [
        {
          phase: 'Inspect Tray Error Text',
          action: 'Read the exact red filename/path banner inside the taskbar OneDrive cloud icon.',
          whyItWorks: 'Points straight to the single illegal character or full quota stopping the entire folder.',
        },
      ],
      questionsToAsk: ['"When you click the blue OneDrive icon near the clock, what exact red message appears?"'],
      sampleUserWording: [
        {
          situation: 'Explaining Specific People links simply',
          sayThis:
            '"Using Specific People links guarantees only the named recipients can open that file—even if someone forwards the URL."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Microsoft 365 -> OneDrive Sync & SharePoint Recovery',
        priorityFormula: 'Impact: Medium (Team budget) × Urgency: High = P2 High',
        internalNotes: `[RESOLUTION] Restored overwritten Q4_Budget.xlsx via SharePoint Version History. Removed illegal '?' character and shortened >400-char folder nesting -> OneDrive synced cleanly.`,
        customerReply: 'Hi Maya — Your morning version of Q4_Budget.xlsx is restored via Version History, and OneDrive is syncing green again!',
        escalationCriteria: 'Escalate permanently purged files past 93-day Recycle Bins to L2 Backup Recovery.',
      },
    },

    commonTraps: [
      {
        trap: 'Removing a departing user’s M365 license immediately before retention/mailbox conversion.',
        reality: 'Starts permanent deletion countdowns—convert/retain first!',
      },
      {
        trap: 'Defaulting external confidential folders to `"Anyone with the link"` for convenience.',
        reality: 'Anyone-with-link URLs can be forwarded freely—default to `"Specific people"` authenticated sharing links.',
      },
    ],

    keyTerms: [
      {
        term: 'Known Folder Move & Files On-Demand',
        shortDef: 'Syncing Desktop/Docs/Pictures (`KFM`) with cloud-only space saving (`Files On-Demand`).',
        fullDef: 'Deleted items enter ~93-day Recycle Bins (check tenant policy).',
      },
      {
        term: 'SharePoint Version History & Specific People',
        shortDef: 'One-click file rollback (`Version History`) and authenticated external links (`Specific People`).',
        fullDef: 'Avoid wide-open "Anyone with link" permissions on confidential docs.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-641-q1',
        prompt: 'A user’s OneDrive stopped syncing. What should you check?',
        options: [
          'Sign-in state, paused sync, storage quota, illegal characters or long paths, and restart the client.',
          'Format C: immediately.',
          'Disable BitLocker.',
          'Switch to Bluetooth.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Addresses all primary OneDrive sync culprits cleanly.',
          'Incorrect: Deletes unsynced local work.',
          'Incorrect: Unrelated.',
          'Incorrect: Invalid.',
        ],
        takeaway: 'OneDrive sync checks: Sign-in -> Pause -> Quota -> Filename/Path length -> Client restart.',
      },
      {
        id: 'itsup-641-q2',
        prompt: 'What happens if you strip a departing employee’s M365 license right away before converting their mailbox or securing data?',
        options: [
          'Removing the license can start a deletion timer permanently purging their mailbox/OneDrive data after the grace period.',
          'Teams breaks globally.',
          'Laptop battery swells.',
          'AD deletes instantly.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Follow offboarding data conversion/retention BEFORE unlicensing.',
          'Incorrect: False.',
          'Incorrect: False.',
          'Incorrect: False.',
        ],
        takeaway: 'Never unlicense leavers before preserving mailbox/OneDrive data.',
      },
      {
        id: 'itsup-641-q3',
        prompt: 'A team spreadsheet in SharePoint/Teams was accidentally saved over two hours ago. Fastest fix?',
        options: [
          'Open SharePoint Version History on the file and restore the copy from two hours ago.',
          'Restore firewall from tape.',
          'Run `chkdsk /f`.',
          'Retype from memory.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Instant non-destructive rollback via Version History.',
          'Incorrect: Irrelevant.',
          'Incorrect: Disk tool.',
          'Incorrect: Unnecessary.',
        ],
        takeaway: 'Use SharePoint Version History for accidental overwrites.',
      },
      {
        id: 'itsup-641-q4',
        prompt: 'Which external sharing link option is safest for confidential files when policy permits sharing?',
        options: [
          '"Specific people" (requires authenticating as named recipients).',
          '"Anyone with the link" editable.',
          'Anonymous public website.',
          'Plaintext passwords in chat.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Blocks anonymous link forwarding.',
          'Incorrect: Exposed if URL leaks.',
          'Incorrect: Severe breach.',
          'Incorrect: Policy violation.',
        ],
        takeaway: 'Default to "Specific people" sharing links for confidential documents.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Resolve OneDrive Sync & Check Version History',
      targetTab: 'simulator',
      instructions: [
        'Run the OneDrive Known Folder Move / Sync Stall ticket inside the Service Desk Simulator.',
      ],
      verificationCheck: '4/4 score on the OneDrive simulator ticket.',
    },

    summaryBullets: [
      'Use browser Teams as an instant fallback; check OS permissions and clear Teams cache.',
      'Fix OneDrive via sign-in, pause toggle, quota, and filename/path rules (~93-day recycle bin).',
      'Use SharePoint Version History for edits and Specific People for confidential external links.',
      'Test Microsoft Graph scripts on one account first and never unlicense leavers before data retention.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — OneDrive KFM, SharePoint Versioning & Graph PowerShell',
    ],
  },

  'itsup.6.6.1': {
    id: 'itsup.6.6.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 6: Microsoft 365 and Cloud',
    topicTitle: '6.6–6.7 Intune MDM, Multi-Vendor Endpoint Tools, Google Workspace & SaaS Backups',
    code: '6.6.1',
    title: 'Endpoint Management (Intune, Jamf/Kandji, Workspace ONE, Autopilot), Compliance Locking Email, Retire vs Wipe & Google Workspace Parity',
    readMinutes: 12,
    prerequisites: ['5.3.1', '6.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Explain MDM lifecycle: Enrollment, Compliance Policies (encryption/PIN/OS patch), Configuration Profiles, and Company Portal apps.',
      'Compare Intune alongside Jamf & Kandji (Apple), Workspace ONE, ManageEngine Endpoint Central, and ConfigMgr.',
      'Distinguish remote actions cleanly: Sync, Restart, Lock, Reset Passcode, **Retire** (work data only) vs. **Wipe** (full factory reset), plus Windows Autopilot.',
      'Diagnose overnight email lockouts via Intune Compliance + Conditional Access, map Google Workspace parity, and prove why Sync != Backup.',
    ],

    whyThisMatters: {
      scenarioTitle: '"My Work Email Stopped Overnight!" & "Don’t Factory-Wipe That Personal Phone!"',
      narrative:
        'A consultant loses Outlook overnight because a missed update failed **Intune Compliance + Conditional Access**, while a leaver asks IT to disconnect work email from their personal phone. Picking **Retire** instead of **Wipe** protects personal family photos while clearing work data cleanly.',
    },

    plainEnglish: {
      analogyTitle: 'Garage Inspection Sticker (Compliance) & Peeling Off a Parking Pass vs Scrapping the Car',
      analogy:
        '**Intune** checks each laptop’s safety sticker (BitLocker, PIN, OS patches). If an update misses its deadline overnight, **Conditional Access** keeps the email gate closed until you update and sync! Meanwhile, **Retire** peels only the work pass off a personal BYOD phone; **Wipe** factory-resets the entire stolen corporate device.',
      technicalDefinition:
        'Unified Endpoint Management enforces Autopilot provisioning, compliance-gated Conditional Access, selective BYOD Retire vs full Corporate Wipe, and multi-cloud administration backed by independent SaaS backups.',
      paragraphs: [
        'Know the fleet tools: **Intune** (cross-platform cloud), **Jamf / Kandji** (Apple specialists), **Workspace ONE**, **Endpoint Central**, and older on-prem **ConfigMgr**. Users grab approved software from **Company Portal**.',
        'Check **Google Workspace** (Gmail/Drive/Meet Admin Console) for identical admin workflows, check provider status pages during outages, and remember: **OneDrive/Google Drive Sync is NOT a backup!** Use true third-party SaaS backups.',
      ],
    },

    deepDive: {
      intro: 'Master Intune compliance diagnosis, Retire vs. Wipe boundaries, and multi-cloud habits.',
      steps: [
        {
          step: '01',
          title: 'Compliance Lockouts, Autopilot & Company Portal',
          explanation:
            'Lost email overnight? Check Intune Device Compliance for red rules (missed patch, disabled BitLocker) + Entra Sign-in logs + password/MFA status. Autopilot ships fresh laptops straight to staff for automatic cloud setup.',
        },
        {
          step: '02',
          title: 'Retire vs. Wipe & SaaS Backups',
          explanation:
            'BYOD leave = **Retire** (company apps/data only!). Stolen corporate device = **Wipe** (full factory reset!). Always maintain isolated SaaS backups because sync mirrors deletions/ransomware.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Intune Compliance Gate & Retire vs Wipe Decision',
        asciiFallback: `[Device] -> [Intune Compliance OK?] --NO--> [Conditional Access Blocks Email Overnight!]
BYOD Phone Leaves ---> RETIRE (Company Data Only) | Stolen Corp Device ---> WIPE (Factory Reset)`,
      },
      workedExample: {
        title: 'Unblocking Non-Compliant Laptop & Safely Retiring a BYOD Phone',
        context: 'Consultant laptop blocked overnight; leaver turns in badge with personal iPhone.',
        steps: [
          'Intune Compliance flagged missed OS update -> updated Windows + synced Company Portal -> Compliant -> email unlocked.',
          'Verified personal phone ownership -> triggered **Retire** (sparing personal photos completely).',
        ],
        outcome: 'Consultant back in email; zero personal data harmed.',
      },
    },

    supportWalkthrough: {
      intro: 'Verify Ownership (`Corporate` vs `Personal`) twice before clicking Wipe!',
      steps: [
        {
          phase: 'Read Exact Compliance Red Flag',
          action: 'Check Intune Device Compliance detail rather than guessing.',
          whyItWorks: 'Users usually just need one pending OS patch or BitLocker resume.',
        },
      ],
      questionsToAsk: ['"Is this device corporate-owned hardware or your personal BYOD phone?"'],
      sampleUserWording: [
        {
          situation: 'Explaining overnight compliance hold kindly',
          sayThis:
            '"Our security check paused email because a required update passed its grace deadline overnight—installing it and clicking Sync in Company Portal unlocks Outlook right back!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Endpoint Management (Intune) -> Compliance Lockout',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High = P2 High',
        internalNotes: `[DIAGNOSIS] Intune Device Compliance red on Minimum OS Patch Level -> Conditional Access blocked Outlook.
[RESOLUTION] Installed OS update, synced Company Portal -> Compliant -> verified email resumed.`,
        customerReply: 'Hi Jordan — Installing the overdue OS update and syncing Company Portal restored your compliance and unlocked Outlook!',
        escalationCriteria: 'Escalate Autopilot hash or tenant Conditional Access errors to L2 Endpoint Engineers.',
      },
    },

    commonTraps: [
      {
        trap: 'Clicking **Wipe** on a departing user’s personal BYOD smartphone.',
        reality: '**Wipe** factory-resets the whole phone! Use **Retire** on BYOD devices.',
      },
      {
        trap: 'Assuming OneDrive or Google Drive file sync replaces true SaaS backups.',
        reality: 'Sync replicates accidental deletions and ransomware encryption straight to the cloud—maintain isolated third-party SaaS backups.',
      },
    ],

    keyTerms: [
      {
        term: 'MDM Compliance & Retire vs. Wipe',
        shortDef: 'Security state (`Compliance`), work-only removal (`Retire`), and factory reset (`Wipe`).',
        fullDef: 'Enforced by Intune, Jamf/Kandji, Workspace ONE, and Endpoint Central.',
      },
      {
        term: 'Sync != Backup & Google Workspace Parity',
        shortDef: 'True backups protect against sync deletions; Google Workspace mirrors M365 user/group/license workflows.',
        fullDef: 'Always check provider status pages first during SaaS outages.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-661-q1',
        prompt: 'A user’s laptop lost email overnight without anyone resetting their password. What likely caused it?',
        options: [
          'Intune marked the laptop Non-Compliant (e.g., overdue update/encryption), triggering Conditional Access to block email (or password expired/MFA reset).',
          'VGA cable failed.',
          'NTFS turned into FAT32.',
          '60 Hz refresh rate.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Check Intune Compliance + Entra sign-in logs right away.',
          'Incorrect: Display.',
          'Incorrect: False.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Overnight email block = check Intune Compliance + Entra Sign-in logs.',
      },
      {
        id: 'itsup-661-q2',
        prompt: 'Which Intune action removes corporate email/apps cleanly from a departing employee’s PERSONAL phone without wiping personal photos?',
        options: [
          'Retire.',
          'Full Wipe.',
          'Change their Apple ID.',
          'Run `sfc /scannow`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Retire removes managed work profiles only.',
          'Incorrect: Wipe erases the whole personal device.',
          'Incorrect: Never touch personal Apple IDs.',
          'Incorrect: Windows command.',
        ],
        takeaway: 'BYOD leave = **Retire**; Lost/stolen corporate device = **Wipe**.',
      },
      {
        id: 'itsup-661-q3',
        prompt: 'Why is OneDrive or Google Drive sync NOT a complete replacement for dedicated SaaS backups?',
        options: [
          'Sync mirrors deletions and ransomware encryption to the cloud, and Recycle Bins expire.',
          'Sync converts NTFS to FAT32.',
          'Blocks PDFs.',
          'Deletes every Friday.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Dedicated SaaS backups keep isolated snapshots immune to local sync.',
          'Incorrect: False.',
          'Incorrect: False.',
          'Incorrect: False.',
        ],
        takeaway: 'Sync != Backup—separate SaaS backups protect cloud data.',
      },
      {
        id: 'itsup-661-q4',
        prompt: 'Which two MDM tools focus specifically on Apple macOS and iOS fleets?',
        options: [
          'Jamf and Kandji.',
          'osTicket and GLPI.',
          'Nagios and Zabbix.',
          'Disk Utility and `apt`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Alongside multi-OS Intune, Workspace ONE, and Endpoint Central.',
          'Incorrect: Open-source ticketing.',
          'Incorrect: Network monitors.',
          'Incorrect: Local disk/package tools.',
        ],
        takeaway: 'Know Intune, Jamf/Kandji (Apple), Workspace ONE, Endpoint Central, ConfigMgr.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Unblock Non-Compliant Device & Compare Cloud Admin Consoles',
      targetTab: 'simulator',
      instructions: [
        'Run the Intune Compliance Overnight Lockout ticket inside the Service Desk Simulator.',
      ],
      verificationCheck: '4/4 simulator score.',
    },

    summaryBullets: [
      'MDMs (Intune, Jamf, Kandji, Workspace ONE, Endpoint Central) control enrollment, compliance, configs, and Company Portal apps.',
      'Intune Non-Compliance triggers Conditional Access overnight email blocks.',
      'Autopilot provisions sealed Windows PCs straight from the cloud.',
      'Use **Retire** for personal BYOD phones; use **Wipe** for lost/stolen corporate devices.',
      'Remember Google Workspace parity, status pages during outages, and why Sync != Backup.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Intune Compliance, Retire vs Wipe & Autopilot',
      'Google Workspace Admin Help — User & Group Administration',
    ],
  },
};
