import { ExamQuestion } from '../types/ccna';

export const IT_SUPPORT_QUESTIONS_PART_1: ExamQuestion[] = [
  // ==================== EASY (Hardware, OS & Boot) ====================
  {
    id: 'it-e1',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Windows Task Manager Triage',
    prompt: 'A Windows laptop fan is roaring and Excel freezes. Which shortcut opens Task Manager directly so you can inspect CPU, Memory, and Disk utilization?',
    options: ['Ctrl + Shift + Esc', 'Win + L', 'Alt + F4', 'Win + R'],
    correctIndices: [0],
    hints: [
      'Win + L locks the screen; Alt + F4 closes the active window.',
      'This three-key shortcut skips the Ctrl+Alt+Del menu and jumps straight to Task Manager.',
    ],
    explanation:
      'HOW & WHY: Ctrl + Shift + Esc launches Task Manager immediately (even when Explorer is sluggish), letting Tier 1 identify runaway CPU processes or 100% disk bottlenecks in seconds.',
  },
  {
    id: 'it-e2',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'SSD Capacity & Performance',
    prompt: 'A user’s Windows PC takes 4 minutes to open Outlook and fails Windows feature updates with low-space warnings. Checking "This PC" shows the C: NVMe drive has 180 MB free out of 256 GB. Why does an almost-full SSD cripple performance?',
    options: [
      'Windows needs free SSD space for virtual memory (pagefile), update staging, Outlook OST caching, and SSD wear-leveling.',
      'SSDs lose CPU clock speed when 50% full.',
      'Full SSDs switch the Wi-Fi card to 2.4 GHz.',
      'BitLocker doubles file sizes automatically.',
    ],
    correctIndices: [0],
    hints: [
      'Think about Windows pagefile.sys, temporary folders, and Windows Update downloads.',
      'Keep at least 15–20% free space on OS SSDs for healthy paging and updates.',
    ],
    explanation:
      'HOW & WHY: When C: drops below a few gigabytes free, Windows cannot expand pagefile.sys, apps fail to write temp/OST caches, and SSD garbage collection slows dramatically. Clear %TEMP%, Recycle Bin, and old Windows Update caches via Disk Cleanup / Storage Sense.',
  },
  {
    id: 'it-e3',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'POST Beep Codes & Memory',
    prompt: 'You press power on a desktop workstation: fans spin up, the monitor remains completely blank ("No Signal"), and the motherboard emits a repeating pattern of 3 long beeps before shutting off. What component failed POST?',
    options: [
      'The USB mouse driver',
      'RAM (memory module unseated or defective)',
      'Microsoft Outlook profile',
      'DNS client service',
    ],
    correctIndices: [1],
    hints: [
      'POST (Power-On Self-Test) runs inside BIOS/UEFI BEFORE Windows or any disk OS ever loads.',
      'Reseating or testing one stick at a time resolves most memory POST errors.',
    ],
    explanation:
      'HOW & WHY: POST beep codes or amber chassis LED blink patterns signal hardware failures before video initializes—most commonly unseated or faulty RAM sticks (or GPU/PSU issues). Unplug AC power, ground yourself, and reseat/test RAM sticks individually.',
  },
  {
    id: 'it-e4',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'USB-C Power Delivery vs. Data Cables',
    prompt: 'A user reports their laptop battery drains rapidly while plugged into a USB-C dock using a spare USB-C phone charging cable they brought from home. What is the likeliest cause?',
    options: [
      'The spare USB-C cable lacks 60W–100W USB-PD wattage rating (or video Alt-Mode lanes) required by a laptop dock.',
      'Active Directory blocked laptop charging.',
      'Windows 11 disables USB-C charging on Tuesdays.',
      'The monitor refresh rate drained the AC wall outlet.',
    ],
    correctIndices: [0],
    hints: [
      'Not all USB-C cables are built equally—some cheap phone cables carry only 15W/USB 2.0!',
      'Always test with the OEM 90W/130W USB-C power adapter and certified Thunderbolt/USB-C dock cable.',
    ],
    explanation:
      'HOW & WHY: Phone USB-C cables often cap out at 15W–18W and omit high-speed DisplayPort Alt-Mode pins. A corporate laptop dock needs a certified high-wattage USB-PD / Thunderbolt cable and proper AC brick.',
  },
  {
    id: 'it-e5',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Safe Mode Boot',
    prompt: 'After installing a broken graphics or VPN driver, Windows crashes with a Blue Screen (BSOD) every time it reaches the desktop. Which startup mode loads Windows with minimal generic drivers so you can uninstall the bad driver?',
    options: ['Windows Safe Mode', 'Windows Fast Startup', 'Hibernate Mode', 'BIOS Legacy PXE Boot'],
    correctIndices: [0],
    hints: [
      'Holding Shift while clicking Restart -> Troubleshoot -> Startup Settings -> F4/F5 reaches this diagnostic mode.',
      'It skips third-party startup apps and non-essential drivers.',
    ],
    explanation:
      'HOW & WHY: Safe Mode boots Windows using only core OS files and basic display/storage drivers, allowing you to roll back drivers in Device Manager or remove faulty software via Control Panel.',
  },
  {
    id: 'it-e6',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Windows Hardware Info Command',
    prompt: 'A user calls from home and you need their exact laptop serial number/service tag, BIOS version, and installed RAM amount quickly. Which built-in Windows command retrieves hardware and OS system details in one shot?',
    options: ['msinfo32 (or systeminfo in CMD)', 'mspaint', 'calc', 'notepad'],
    correctIndices: [0],
    hints: [
      'In CMD you can also run "wmic bios get serialnumber" or "systeminfo".',
      'Win+R -> msinfo32 opens the System Information GUI.',
    ],
    explanation:
      'HOW & WHY: "msinfo32" (GUI) and "systeminfo" (CLI) immediately display OS build, system model, BIOS date/version, RAM, and hotfixes—saving guesswork before warranty dispatches.',
  },

  // ==================== EASY (Ticketing & ITSM) ====================
  {
    id: 'it-e7',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'First Contact Resolution (FCR)',
    prompt: 'What does First Contact Resolution (FCR) measure on an IT Service Desk?',
    options: [
      'How quickly a ticket is escalated to Tier 3 Engineering',
      'The percentage of user tickets completely resolved by Tier 1 during the initial call/chat without escalating or re-opening',
      'The total number of laptops purchased per quarter',
      'How many passwords expire per month',
    ],
    correctIndices: [1],
    hints: [
      'FCR improves both user happiness and Tier 2/3 productivity.',
      'Resolving the issue cleanly on the very first interaction = high FCR.',
    ],
    explanation:
      'HOW & WHY: FCR tracks tickets fully solved on initial contact. Strong Tier 1 knowledge bases, diagnostic checklists, and proper self-service tools raise FCR without sacrificing quality.',
  },
  {
    id: 'it-e8',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Knowledge Base (KB) Articles',
    prompt: 'Why should a help desk technician document a newly discovered workaround (such as clearing a corrupted Teams cache) into a shared Knowledge Base article?',
    options: [
      'So future technicians and self-service users can solve the exact issue in 2 minutes instead of re-investigating from scratch',
      'To increase ticket SLA breach rates',
      'Because KB articles delete Active Directory accounts',
      'To hide fixes from Tier 2',
    ],
    correctIndices: [0],
    hints: [
      'Think "shift left" in ITSM—turn hard-won discoveries into repeatable team playbooks.',
      'Standardizes fixes across all shifts and new hires.',
    ],
    explanation:
      'HOW & WHY: Knowledge-Centered Service (KCS) captures solutions as searchable KB articles, cutting average handle time (AHT), boosting FCR, and enabling user self-service.',
  },
  {
    id: 'it-e9',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Problem vs. Incident',
    prompt: 'Twelve different employees submit Incidents this week reporting that Outlook crashes whenever opening PDF attachments after Tuesday’s update. Which ITSM record type investigates the underlying root cause of those recurring Incidents?',
    options: ['Service Request', 'Problem Record', 'Standard Access Request', 'Asset Disposal Form'],
    correctIndices: [1],
    hints: [
      'Incidents fix the individual user right now; this record asks WHY the same issue keeps hitting dozens of people.',
      'In ITIL, linking multiple similar Incidents points to one underlying...',
    ],
    explanation:
      'HOW & WHY: In ITIL 4, an Incident restores normal service fast (workaround), while a Problem Record investigates the underlying root cause of one or more recurring Incidents to prevent future outages.',
  },
  {
    id: 'it-e10',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Active Listening & De-escalation',
    prompt: 'A frustrated executive calls yelling that their presentation laptop won’t connect to the projector 5 minutes before a board meeting. What is your best opening response?',
    options: [
      'Interrupt them and explain it is probably user error.',
      'Stay calm, acknowledge the time pressure empathetically, ask one targeted clarifying question ("Are you on HDMI or USB-C, and do you see any display on the laptop screen?"), and offer a fast fallback.',
      'Tell them to email helpdesk@corp.local and wait 24 hours.',
      'Put them on mute for 10 minutes.',
    ],
    correctIndices: [1],
    hints: [
      'Empathy + urgency ownership calms stressed users instantly.',
      'Offer immediate triage AND a quick backup plan (e.g., sharing slides to the room PC).',
    ],
    explanation:
      'HOW & WHY: Calming high-stress calls requires calm tone, brief empathy ("I know your meeting starts in 5 minutes—let’s get this up right away"), rapid physical triage, and keeping a practical Plan B ready.',
  },

  // ==================== EASY (Active Directory, Endpoint Network & M365) ====================
  {
    id: 'it-e11',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Password Reset vs. Unlock Account',
    prompt: 'A user calls saying "I mistyped my password 5 times because Caps Lock was on, and now Windows says my account is locked out—I DO remember my password!" What should you do in Active Directory Users and Computers?',
    options: [
      'Check "Unlock account" on the Account tab without forcing a password reset (after verifying identity).',
      'Delete and recreate their user account.',
      'Add them to Domain Admins.',
      'Disable their account permanently.',
    ],
    correctIndices: [0],
    hints: [
      'Unlocking clears the bad-password lockout timer while keeping their existing password intact.',
      'Always verify caller identity per security policy first!',
    ],
    explanation:
      'HOW & WHY: After verifying the caller’s identity, checking "Unlock account" in ADUC immediately clears the temporary lockout flag so they can sign in with their known password without disrupting saved credentials.',
  },
  {
    id: 'it-e12',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Workgroup vs. Active Directory Domain',
    prompt: 'Why do companies join laptops to an Active Directory / Entra ID Domain instead of leaving 200 PCs in a peer-to-peer Workgroup?',
    options: [
      'Domains enable centralized login accounts, password policies, Group Policy (GPO) / MDM configuration, and shared resource permissions from one directory.',
      'Workgroups cost more in Microsoft licensing.',
      'Domains double Wi-Fi speed.',
      'Workgroups cannot connect to printers.',
    ],
    correctIndices: [0],
    hints: [
      'Imagine managing 200 separate local user accounts on 200 different laptops whenever someone joins or leaves!',
      'Centralized identity + centralized policy = Domain.',
    ],
    explanation:
      'HOW & WHY: In a Workgroup, every PC maintains its own local user accounts and policies. A Domain centralizes authentication (Kerberos/SSO), security baselines (GPO/Intune), and instant offboarding when an employee leaves.',
  },
  {
    id: 'it-e13',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Mapped Network Drives',
    prompt: 'In Windows File Explorer, a user asks where their shared department drive (S:) points. Which path format represents a Windows SMB network share (UNC path)?',
    options: ['C:\\Users\\Shared', '\\\\fileserver01\\Sales', 'https://127.0.0.1/Sales', 'S://fileserver01'],
    correctIndices: [1],
    hints: [
      'UNC paths always begin with two backslashes.',
      'Format: \\\\servername\\sharename.',
    ],
    explanation:
      'HOW & WHY: Universal Naming Convention (UNC) paths use \\\\server\\share syntax to address SMB file shares and shared printers over TCP port 445.',
  },
  {
    id: 'it-e14',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'Default Gateway & Subnet Mask Role',
    prompt: 'A user sets a static IP on a test PC: IP 10.20.5.50, Mask 255.255.255.0, Default Gateway blank. What can this PC reach?',
    options: [
      'Public Internet websites only',
      'Only devices on the local 10.20.5.0/24 subnet (cannot route to other VLANs or the Internet)',
      'Nothing at all, not even 127.0.0.1',
      'Only DNS servers in Azure',
    ],
    correctIndices: [1],
    hints: [
      'A Default Gateway is the local router IP used to leave your own subnet.',
      'Local neighbors on 10.20.5.x use ARP directly—no router needed!',
    ],
    explanation:
      'HOW & WHY: Without a Default Gateway, a host can still ARP and communicate with other hosts on its local subnet (10.20.5.0/24), but all traffic destined off-subnet or to the Internet has nowhere to route.',
  },
  {
    id: 'it-e15',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'Wi-Fi 2.4 GHz vs. 5 GHz Triage',
    prompt: 'A warehouse worker uses a laptop inside a concrete corner far from the access point and sees weak 1-bar signal on 5 GHz with frequent drops. Switching to the 2.4 GHz SSID improves stability. Why?',
    options: [
      '2.4 GHz wavelengths penetrate walls and travel farther than 5 GHz (trading peak throughput for range).',
      '2.4 GHz bypasses corporate firewalls.',
      '5 GHz only works with Ethernet cables.',
      '2.4 GHz disables WPA2 encryption.',
    ],
    correctIndices: [0],
    hints: [
      'Lower radio frequency = longer range and better obstacle penetration.',
      'Higher radio frequency = faster speeds at shorter distances.',
    ],
    explanation:
      'HOW & WHY: 2.4 GHz signals attenuate much less through concrete, metal shelving, and drywall than 5 GHz, making 2.4 GHz more reliable at the far edge of coverage.',
  },
  {
    id: 'it-e16',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'Shared Mailbox vs. Distribution List',
    prompt: 'A support team wants an address "support@company.com" where five agents can all read, reply FROM that shared address, and see which emails have already been answered in a shared Sent/Inbox folder. What should you provision in Exchange Online?',
    options: [
      'A Distribution List',
      'A Shared Mailbox (with Full Access & Send As permissions)',
      'Five separate paid E5 licenses',
      'An Active Directory Computer object',
    ],
    correctIndices: [1],
    hints: [
      'A Distribution List just copies/forwards every message into 5 separate personal inboxes (nobody knows who replied!).',
      'A Shared Mailbox gives the team one central Inbox and Sent Items without needing a paid license under 50 GB.',
    ],
    explanation:
      'HOW & WHY: Shared Mailboxes provide a central mailbox accessible to multiple delegated users (Full Access + Send As), letting teams collaborate cleanly without duplicating emails or wasting paid M365 user licenses.',
  },
  {
    id: 'it-e17',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'Spotting Phishing Red Flags',
    prompt: 'A user forwards a suspicious email claiming "IT Helpdesk: Your password expires in 2 hours — click here to keep your account" from sender "support@micros0ft-verify-auth.com". Which clue immediately confirms phishing?',
    options: [
      'Lookalike typosquatted domain ("micros0ft-verify-auth.com") combined with artificial urgency',
      'The email contains plain English text',
      'It arrived during business hours',
      'The user has Microsoft Outlook installed',
    ],
    correctIndices: [0],
    hints: [
      'Look closely at the zero "0" in "micros0ft" and the urgency tactic!',
      'Legitimate internal IT never hosts corporate password resets on weird external domains.',
    ],
    explanation:
      'HOW & WHY: Lookalike/typosquatted domains ("micros0ft" with a zero) paired with artificial countdown urgency ("expires in 2 hours") are classic credential-harvesting phishing signatures.',
  },
  {
    id: 'it-e18',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'PowerShell Verb-Noun Syntax',
    prompt: 'PowerShell cmdlets follow a strict "Verb-Noun" naming convention. Which cmdlet retrieves running Windows services?',
    options: ['Show-Service', 'Get-Service', 'Read-Services', 'List-Service'],
    correctIndices: [1],
    hints: [
      'PowerShell uses standard approved verbs: Get, Set, New, Remove, Restart, Test.',
      'And singular nouns (Service, not Services)!',
    ],
    explanation:
      'HOW & WHY: PowerShell uses approved Verb-SingularNoun pairs: Get-Service reads services, Restart-Service bounces one, and Get-Process inspects running processes.',
  },

  // ==================== MEDIUM (All 5 IT Help Desk Domains) ====================
  {
    id: 'it-m1',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Outlook OST Rebuild & Safe Mode',
    prompt: 'Microsoft Outlook crashes immediately upon launch with "Cannot start Microsoft Outlook. Cannot open the Outlook window." Launching "outlook.exe /safe" opens cleanly. What does this prove and what are your two next checks?',
    options: [
      'A third-party COM add-in or corrupted Navigation Pane/OST cache is crashing Outlook; disable recent add-ins and/or rebuild the local .ost cache.',
      'The user’s Exchange Online mailbox was permanently deleted.',
      'The laptop RAM is dead.',
      'The network switchport is err-disabled.',
    ],
    correctIndices: [0],
    hints: [
      'Safe Mode (/safe) disables Outlook add-ins and custom UI extensions.',
      'If Safe Mode works, the core M365 mailbox and Windows OS are fine—the culprit is a local add-in or profile cache.',
    ],
    explanation:
      'HOW & WHY: "outlook.exe /safe" bypasses COM add-ins and reading-pane customizations. Success in Safe Mode immediately points to a crashing add-in (File -> Options -> Add-ins) or a corrupted local Outlook profile / .ost file.',
  },
  {
    id: 'it-m2',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Windows Update Stuck Cache Reset',
    prompt: 'A Windows 11 laptop fails cumulative updates repeatedly with error 0x80070002 even after rebooting and confirming plenty of free disk space. Which Windows service and folder are routinely stopped and renamed to rebuild the local update cache?',
    options: [
      'Stop "spooler" and delete System32',
      'Stop "wuauserv" and "bits", rename C:\\Windows\\SoftwareDistribution to .old, and restart the services',
      'Uninstall the network card driver',
      'Disable BitLocker permanently',
    ],
    correctIndices: [1],
    hints: [
      'Windows Update downloads and stages packages inside a folder named SoftwareDistribution.',
      'You cannot rename that folder while the Windows Update service (wuauserv) and BITS hold locks on it!',
    ],
    explanation:
      'HOW & WHY: Corrupt partial downloads in C:\\Windows\\SoftwareDistribution cause looping update errors. Stopping wuauserv and bits, renaming SoftwareDistribution -> SoftwareDistribution.old, and restarting those services forces Windows to fetch clean update metadata.',
  },
  {
    id: 'it-m3',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Event Viewer Log Triage',
    prompt: 'A workstation randomly reboots twice a day without warning. Which Event Viewer log and Event ID/source should you inspect first to distinguish a sudden power loss/BSOD (Kernel-Power 41) from a scheduled Windows Update restart?',
    options: [
      'Windows Logs -> System (filtering for Critical/Error around crash time, such as Kernel-Power Event ID 41 or BugCheck 1001)',
      'Windows Logs -> Setup only',
      'Microsoft Edge Browser History',
      'Task Manager Startup tab',
    ],
    correctIndices: [0],
    hints: [
      'OS crashes, driver faults, disk errors, and unexpected shutdowns live in the System log.',
      'Application log tracks crashing user apps like Outlook or Chrome.',
    ],
    explanation:
      'HOW & WHY: Windows Logs -> System captures kernel crashes (BugCheck / Kernel-Power 41), disk controller warnings, and User32 planned reboot reasons—instantly distinguishing hardware/PSU power drops or BSODs from intentional restarts.',
  },
  {
    id: 'it-m4',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'BIOS/UEFI, TPM 2.0 & BitLocker',
    prompt: 'Why does Windows 11 require UEFI Secure Boot and TPM 2.0 on enterprise laptops?',
    options: [
      'Secure Boot blocks unsigned rootkits during startup, and TPM 2.0 securely seals BitLocker disk-encryption keys in dedicated hardware.',
      'TPM 2.0 increases Ethernet speeds to 10 Gbps.',
      'Secure Boot disables all USB ports.',
      'TPM 2.0 stores Outlook email attachments.',
    ],
    correctIndices: [0],
    hints: [
      'TPM = Trusted Platform Module (hardware cryptographic chip).',
      'BitLocker binds drive decryption keys to TPM integrity measurements (PCRs).',
    ],
    explanation:
      'HOW & WHY: UEFI Secure Boot verifies cryptographic signatures of bootloaders/OS kernels against pre-boot malware, while TPM 2.0 stores BitLocker encryption keys in tamper-resistant silicon so stolen SSDs cannot be read in another machine.',
  },
  {
    id: 'it-m5',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'Parent-Child Major Incident Linking',
    prompt: 'At 9:05 AM, 35 employees call simultaneously saying the VPN gateway refuses logins. How should the Service Desk organize these incoming tickets cleanly?',
    options: [
      'Create one Major/Parent Incident ticket (P1) for the Engineering team and link all 35 user tickets as Child Incidents so updates broadcast cleanly and Engineering isn’t flooded with 35 duplicate queues.',
      'Assign all 35 tickets individually to 35 different engineers.',
      'Delete 34 of the tickets so only 1 exists.',
      'Mark all 35 as P4 Service Requests.',
    ],
    correctIndices: [0],
    hints: [
      'Linking user reports to one Master/Parent Incident preserves user communication without overwhelming Tier 2/3.',
      'When the Parent Incident resolves, all linked Child tickets can be updated/closed consistently.',
    ],
    explanation:
      'HOW & WHY: Parent-Child Incident linking keeps accurate impact metrics (35 affected users) and enables one-click bulk updates to every impacted caller while Engineering focuses on a single Major Incident record.',
  },
  {
    id: 'it-m6',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'Tier 2 Escalation Quality',
    prompt: 'Which internal escalation note will NOT be bounced back by Tier 2 Systems Administration?',
    options: [
      '"User cannot print, please fix asap."',
      '"User kpatel on MKT-LT-118 (10.30.4.22, VPN connected) gets error 0x0000011b printing to \\\\prt01\\MKT-Color. Other printers work; spooler restarted, driver updated, gpresult shows PRT GPO applied. Screenshot attached."',
      '"Tried rebooting twice, no luck."',
      '"Escalate to server team."',
    ],
    correctIndices: [1],
    hints: [
      'Good escalations include: Hostname/IP, Exact error code, Scope, and Tests already performed.',
      'Notice error 0x0000011b immediately tells Tier 2 about RPC printer hardening!',
    ],
    explanation:
      'HOW & WHY: Recording exact workstation name, IP/VPN state, exact UNC printer path, exact Windows error code (0x0000011b), scope, and completed Tier 1 steps prevents ping-ponging tickets back to Tier 1.',
  },
  {
    id: 'it-m7',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'AGDLP Role-Based Access Control',
    prompt: 'According to Microsoft’s AGDLP best practice for file server permissions, what is the cleanest way to manage folder access across 300 employees?',
    options: [
      'Add individual user accounts directly onto every NTFS folder ACL.',
      'Place User Accounts into Global Role Groups (e.g., GG_Payroll), nest those into Domain Local permission groups (DL_Payroll_Modify), and assign NTFS permissions to the groups.',
      'Give Domain Users Full Control on the C: drive.',
      'Share admin passwords per department.',
    ],
    correctIndices: [1],
    hints: [
      'AGDLP = Accounts -> Global Groups -> Domain Local Groups -> Permissions.',
      'Never stamp individual usernames onto NTFS folder permissions—use groups!',
    ],
    explanation:
      'HOW & WHY: Role-Based Access Control via groups (AGDLP) ensures that when employees change roles or leave, adjusting their group memberships updates all folder/app access automatically without editing thousands of folder ACLs.',
  },
  {
    id: 'it-m8',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Explicit Deny Precedence in NTFS',
    prompt: 'User "dlee" belongs to BOTH "SG_Engineering" (granted NTFS Modify on \\\\files01\\CAD) and "SG_Contractors" (assigned Explicit DENY on Write/Modify on \\\\files01\\CAD). What happens when dlee tries to save a file in \\\\files01\\CAD?',
    options: [
      'Modify succeeds because SG_Engineering grants Allow.',
      'Write/Modify is DENIED because Explicit Deny always overrides Allow permissions in Windows NTFS.',
      'Windows asks dlee to pick which group to use.',
      'The file server reboots.',
    ],
    correctIndices: [1],
    hints: [
      'NTFS permissions are cumulative EXCEPT for one overriding rule.',
      'Explicit Deny beats any Allow!',
    ],
    explanation:
      'HOW & WHY: Across Windows NTFS ACLs, effective permissions sum all Allow entries—EXCEPT any Explicit Deny entry always overrides Allow. (Best practice: omit unnecessary users from Allow groups rather than sprinkling Deny rules.)',
  },
  {
    id: 'it-m9',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'GPO Computer vs. User Settings',
    prompt: 'You run "gpupdate /force" to apply a new Computer Configuration GPO setting (such as a machine certificate or startup script), and Windows warns "Certain Computer policies are enabled that can only run during startup. OK to restart?" Why?',
    options: [
      'Computer Configuration startup/security policies often apply only during OS boot before a user logs in, whereas many User policies update live or on sign-out/sign-in.',
      'gpupdate /force deletes the computer from AD.',
      'Windows requires restarting for mouse movement.',
      'User policies never require re-login.',
    ],
    correctIndices: [0],
    hints: [
      'Notice the split inside Group Policy: Computer Configuration vs. User Configuration.',
      'Drive mappings and software installs often wait for next reboot/logon.',
    ],
    explanation:
      'HOW & WHY: Computer Configuration applies to the machine object (requiring reboot for startup scripts, folder redirection, or software installation), while User Configuration applies to the user object (often requiring sign-out/sign-in).',
  },
  {
    id: 'it-m10',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'Network Printer Offline After Reboot',
    prompt: 'A warehouse thermal printer stops printing every time the building loses power and reboots. Checking the Windows print server shows the printer port points to 192.168.40.88, while the printer’s front LCD now displays IP 192.168.40.142. What caused the recurring outage and how do you fix it permanently?',
    options: [
      'The printer pulls a dynamic DHCP IP that changes on reboot; assign a DHCP Reservation (or static IP outside the DHCP scope) and map the Windows printer to a Standard TCP/IP Port with that fixed IP.',
      'Replace the toner cartridge.',
      'Reinstall Microsoft Office on every PC.',
      'Flush DNS on the printer LCD.',
    ],
    correctIndices: [0],
    hints: [
      'Compare the IP configured in the Windows printer port (.88) vs. the printer’s actual IP (.142)!',
      'Infrastructure devices (printers, servers, APs) must NEVER rely on random changing DHCP leases.',
    ],
    explanation:
      'HOW & WHY: Dynamic DHCP leases can assign a printer a brand-new IP after power outages, breaking Windows Standard TCP/IP Ports pointing at the old IP. Configuring a DHCP Reservation tied to the printer’s MAC address (or a static IP outside the DHCP pool) permanently prevents IP drift.',
  },
  {
    id: 'it-m11',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'netstat Port Conflict Diagnostics',
    prompt: 'A developer says their local test web server fails to start because "Port 8080 is already in use." Which Windows CLI command identifies the exact Process ID (PID) currently listening on TCP port 8080?',
    options: [
      'netstat -ano | findstr :8080',
      'ipconfig /displaydns',
      'tracert 127.0.0.1:8080',
      'whoami /all',
    ],
    correctIndices: [0],
    hints: [
      'netstat flags: -a (all ports), -n (numeric IPs/ports), -o (owning Process ID).',
      'Then look up that PID in Task Manager -> Details!',
    ],
    explanation:
      'HOW & WHY: "netstat -ano | findstr :8080" lists every socket on port 8080 along with the owning PID (-o), letting you identify the conflicting app in Task Manager or "tasklist /fi "pid eq <PID>"".',
  },
  {
    id: 'it-m12',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'Hotel Captive Portal Blocking VPN',
    prompt: 'A traveling employee is connected to "HotelGuest" Wi-Fi with full signal bars, yet Cisco AnyConnect / GlobalProtect VPN refuses to connect and browsers show certificate warnings. What is almost always blocking the VPN?',
    options: [
      'A hotel Captive Portal login/terms web page is intercepting HTTP/HTTPS traffic until the user opens a browser to an uncached HTTP page (e.g., neverssl.com) and accepts the Wi-Fi portal.',
      'The laptop needs a new SSD.',
      'Hotel Wi-Fi blocks Kerberos passwords permanently.',
      'The user needs a Bluetooth mouse.',
    ],
    correctIndices: [0],
    hints: [
      'Before you click "Accept Terms" on airport/hotel Wi-Fi, the hotel router intercepts ALL packets!',
      'VPN clients fail until the captive portal whitelists the laptop’s MAC address.',
    ],
    explanation:
      'HOW & WHY: Captive portals hijack outbound traffic and redirect it to a Wi-Fi splash page—breaking VPN TLS handshakes and triggering HSTS cert warnings. Have the user disconnect VPN, open a plain page like http://neverssl.com or http://captive.apple.com to complete the portal login, then reconnect VPN.',
  },
  {
    id: 'it-m13',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'Temporary Access Pass (TAP) in Entra ID',
    prompt: 'A new remote hire locked themselves out before enrolling Microsoft Authenticator on day one and has no backup phone number registered. Which Microsoft Entra ID feature lets you securely issue a time-limited one-time onboarding code so they can sign in and register passwordless/MFA?',
    options: [
      'Temporary Access Pass (TAP)',
      'Disable Security Defaults tenant-wide',
      'Share the Global Admin password',
      'Use an unencrypted Telnet token',
    ],
    correctIndices: [0],
    hints: [
      'It is literally a time-bound pass valid for e.g. 1–4 hours so a user can onboard MFA/Windows Hello safely.',
      'Configured directly under the user’s Authentication Methods in Entra ID.',
    ],
    explanation:
      'HOW & WHY: Temporary Access Pass (TAP) generates a time-limited, single/multi-use code that satisfies strong MFA requirements during onboarding or lost-device recovery—allowing users to register Authenticator/FIDO2 without lowering tenant security.',
  },
  {
    id: 'it-m14',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'OneDrive Sync Pause & Unlink Triage',
    prompt: 'A user’s OneDrive tray icon shows a red "X" and reports hundreds of files stuck syncing after a large folder move. Which non-destructive troubleshooting step preserves local files while forcing OneDrive to re-index cloud sync state?',
    options: [
      'Delete the user’s C:\\Users\\<name>\\OneDrive folder immediately.',
      'Click OneDrive Settings -> Account -> "Unlink this PC", sign back in pointing to the existing local OneDrive folder, or run "onedrive.exe /reset".',
      'Format the C: drive.',
      'Uninstall Windows Defender.',
    ],
    correctIndices: [1],
    hints: [
      'NEVER delete a user’s local OneDrive folder while sync is broken—unsynced edits exist ONLY on disk!',
      'Unlinking or resetting re-scans local files against SharePoint/OneDrive safely.',
    ],
    explanation:
      'HOW & WHY: Deleting local OneDrive folders before verifying cloud upload causes permanent data loss! Running "%localappdata%\\Microsoft\\OneDrive\\onedrive.exe /reset" or unlinking/re-linking the account safely rebuilds the sync database without deleting local files.',
  },
  {
    id: 'it-m15',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'Exchange Online Message Trace',
    prompt: 'A vendor claims they emailed an urgent invoice 20 minutes ago, but the Finance user cannot see it in Inbox, Junk, or Deleted Items. Which Microsoft 365 Exchange Admin Center tool verifies whether Microsoft ever received the email, quarantined it, or delivered it to a hidden rule folder?',
    options: ['Message Trace', 'Task Manager', 'gpresult /r', 'Disk Management'],
    correctIndices: [0],
    hints: [
      'Exchange Online logs every inbound/outbound SMTP hop, spam verdict, and delivery status.',
      'It traces messages by sender, recipient, and date range.',
    ],
    explanation:
      'HOW & WHY: Exchange Online Message Trace tracks exact SMTP receipt, spam/malware quarantine holds, transport rules, and final mailbox folder delivery—immediately proving whether the issue is external sender failure, Defender quarantine, or an Outlook rule.',
  },
  {
    id: 'it-m16',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Windows Profile Corruption (TEMP Profile)',
    prompt: 'A user logs into Windows and sees a clean desktop missing all their Desktop/Documents shortcuts, along with a popup: "We can’t sign into your account." Checking C:\\Users reveals a brand-new "TEMP" folder. What happened and what must you NEVER tell the user to do?',
    options: [
      'Windows loaded a temporary profile because their profile registry/NTUSER failed to load; NEVER save important work inside the TEMP profile because Windows deletes it upon sign-out!',
      'The user was promoted to Domain Admin.',
      'All their files were encrypted by BitLocker.',
      'Tell them to store all new files on the TEMP Desktop permanently.',
    ],
    correctIndices: [0],
    hints: [
      'Everything created while logged into a TEMP profile vanishes on reboot!',
      'Check HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList for .bak keys or reboot after backing up.',
    ],
    explanation:
      'HOW & WHY: When Windows fails to load a user’s profile hive, it creates a temporary profile that wipes upon logoff. Warn the user immediately NOT to save work there; verify their real files are safe in C:\\Users\\<username>, reboot once, or repair the ProfileList .bak registry key.',
  },
  {
    id: 'it-m17',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Kerberos Time Skew Tolerance',
    prompt: 'A Windows laptop’s CMOS clock drifted 18 minutes behind the Domain Controller after sitting uncharged for months. Users suddenly fail domain logins with "Time difference between client and server" / Kerberos errors. Why does clock drift break AD logins?',
    options: [
      'Kerberos rejects authentication tickets if client and Domain Controller clocks differ by more than 5 minutes (default max clock skew) to prevent replay attacks.',
      'Active Directory only works in UTC-0 London timezone.',
      'Clock drift disables Wi-Fi drivers.',
      'Kerberos hashes passwords using the monitor refresh rate.',
    ],
    correctIndices: [0],
    hints: [
      'Kerberos timestamps every Ticket Granting Ticket (TGT) so attackers cannot replay captured packets hours later.',
      'Default Windows domain max clock skew is 5 minutes; sync with "w32tm /resync".',
    ],
    explanation:
      'HOW & WHY: Kerberos prevents ticket replay attacks by enforcing a strict 5-minute maximum clock skew between clients and Domain Controllers. Correct the BIOS/OS clock and run "w32tm /resync /force" to restore domain logins.',
  },
  {
    id: 'it-m18',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'Browser Proxy / PAC Misconfiguration',
    prompt: 'A user returned from an offshore office where a legacy manual HTTP proxy (10.88.0.5:8080) was set in Windows Internet Options. Now at HQ, ping 8.8.8.8 and nslookup both work, yet Edge and Chrome say "Unable to connect to the proxy server." Where do you fix this?',
    options: [
      'Windows Settings -> Network & Internet -> Proxy (disable stale manual proxy / check automatic PAC script) or "netsh winhttp reset proxy".',
      'Run "chkdsk /f".',
      'Reset the user’s M365 MFA.',
      'Replace the laptop Ethernet port.',
    ],
    correctIndices: [0],
    hints: [
      'CLI ping/nslookup ignore browser HTTP proxy settings—only web browsers/HTTP apps try to tunnel through the dead proxy IP!',
      'Notice the error message literally names the proxy server.',
    ],
    explanation:
      'HOW & WHY: When ping and nslookup succeed at the OS level but web browsers fail with proxy errors, a stale manual proxy IP or unreachable PAC script in Windows Proxy Settings (inetcpl.cpl / WinHTTP) is intercepting HTTP/HTTPS traffic.',
  },
  // Adding more Easy & Medium IT Support questions to keep Part 1 rich (52 questions)
  {
    id: 'it-e19',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'macOS Force Quit & Activity Monitor',
    prompt: 'On a corporate MacBook, Microsoft Word freezes with the spinning beachball. What built-in macOS shortcut opens the Force Quit Applications menu?',
    options: ['Command + Option + Escape', 'Ctrl + Shift + Esc', 'Alt + F4', 'Win + X'],
    correctIndices: [0],
    hints: [
      'Think of the Mac equivalent of Task Manager’s quick process killer.',
      'Uses Command + Option + Esc (or Spotlight -> Activity Monitor for CPU/RAM stats).',
    ],
    explanation:
      'HOW & WHY: Command + Option + Escape opens macOS Force Quit immediately, while Activity Monitor (Applications -> Utilities) is the macOS equivalent of Windows Task Manager for inspecting CPU, Memory, Energy, and Disk.',
  },
  {
    id: 'it-e20',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Ticket Lifecycle Discipline',
    prompt: 'Before marking a user’s Incident ticket "Resolved", what final verification step prevents ticket re-opens?',
    options: [
      'Confirm with the user (via chat/call/screen share) that the fix actually works in their workflow and summarize the root cause + resolution clearly in the ticket.',
      'Close the ticket silently without testing.',
      'Assign it back to New.',
      'Delete the user’s comments.',
    ],
    correctIndices: [0],
    hints: [
      'Never assume a background fix worked until the person experiencing the problem confirms it!',
      'Clear resolution notes also feed future KB searches.',
    ],
    explanation:
      'HOW & WHY: Validating resolution directly with the customer and writing a concise resolution note prevents premature closure, cuts re-open rates, and builds user confidence.',
  },
  {
    id: 'it-e21',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Least Privilege & Standard Users',
    prompt: 'Why do enterprise IT teams issue employees Standard User accounts for daily work instead of giving everyone Local Administrator rights?',
    options: [
      'Least Privilege prevents accidental malware/ransomware from silently modifying OS system files, installing unauthorized drivers, or disabling security agents.',
      'Local Admins cannot open web browsers.',
      'Standard Users get faster CPU clock speeds.',
      'Active Directory forbids Local Admin groups.',
    ],
    correctIndices: [0],
    hints: [
      'If a user clicks a malicious attachment while logged in as Local Admin, the malware inherits full Admin powers!',
      'Use separate privileged accounts or Elevation/EPM tools only when needed.',
    ],
    explanation:
      'HOW & WHY: Enforcing the Principle of Least Privilege dramatically shrinks ransomware and malware blast radius because malicious scripts run under standard user context cannot tamper with HKLM, Program Files, or EDR services.',
  },
  {
    id: 'it-e22',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'Wired vs. Wireless Link LED',
    prompt: 'You walk up to a desktop PC that shows "Network cable unplugged" in Windows. Looking at the back of the PC’s RJ-45 Ethernet port and the wall jack, the link LED is completely dark. What is your FIRST physical check?',
    options: [
      'Verify both ends of the patch cable click firmly into the NIC and wall jack, test a known-good Cat6 patch cable, or trace the wall jack number to the patch panel/switch.',
      'Reinstall Windows 11.',
      'Reset the user’s Active Directory password.',
      'Run ipconfig /flushdns.',
    ],
    correctIndices: [0],
    hints: [
      'Start at OSI Layer 1 whenever the OS says "Media disconnected / Network cable unplugged"!',
      'Dark link LED = no electrical Layer 1 link.',
    ],
    explanation:
      'HOW & WHY: A dark RJ-45 link light indicates a Layer 1 physical break: unplugged patch cord, damaged RJ-45 clip, dead wall port (unpatched at the IDF closet), or disabled switchport.',
  },
  {
    id: 'it-e23',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'Teams Audio/Device Triage',
    prompt: 'A user joins a Microsoft Teams meeting and can see everyone’s video, but nobody can hear them speak. Other apps (Voice Recorder) capture their mic fine. What should you check inside Teams first?',
    options: [
      'Teams -> Settings -> Devices (verify the active Microphone dropdown isn’t pointed to a closed laptop lid mic or disconnected Bluetooth headset, and check Mute status).',
      'Rebuild the Active Directory forest.',
      'Flash the motherboard BIOS.',
      'Run chkdsk C: /f.',
    ],
    correctIndices: [0],
    hints: [
      'Notice the mic works in Windows Voice Recorder—so the hardware driver is healthy!',
      'Teams frequently keeps an old dock/headset audio profile selected.',
    ],
    explanation:
      'HOW & WHY: When hardware works in other apps but fails in Teams, Teams’ internal Devices selection (Speaker/Microphone dropdowns) or OS app microphone privacy permission is almost always pointed at the wrong audio endpoint.',
  },
  {
    id: 'it-m19',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Remote Desktop (RDP) Port & Prerequisites',
    prompt: 'An admin tries to Remote Desktop (mstsc.exe) into an internal lab VM "LAB-WIN01" and gets "Remote Desktop can’t connect to the remote computer." Which TCP port must be reachable, and what local Windows settings must be enabled on LAB-WIN01?',
    options: [
      'TCP port 3389; Remote Desktop enabled in System Settings and allowed through Windows Defender Firewall',
      'UDP port 69; Print Spooler started',
      'TCP port 23; Telnet client installed',
      'TCP port 445; SMBv1 enabled',
    ],
    correctIndices: [0],
    hints: [
      'RDP uses a famous 4-digit TCP port (33xx).',
      'Also check whether the user belongs to the local "Remote Desktop Users" group!',
    ],
    explanation:
      'HOW & WHY: Windows RDP listens on TCP 3389 (and optionally UDP 3389). Remote connections require: RDP enabled on the host, TCP 3389 allowed by firewalls/ACLs, Network Level Authentication (NLA) support, and membership in Administrators or Remote Desktop Users.',
  },
  {
    id: 'it-m20',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'Change Request & Emergency Changes',
    prompt: 'A critical zero-day vulnerability is actively exploited in the VPN appliance at 2:00 PM Wednesday, requiring an immediate firmware patch before nightly backups. Which ITSM change category applies?',
    options: [
      'Standard Pre-Approved Change',
      'Emergency Change (expedited CAB / ECAB approval with post-implementation review)',
      'P4 Service Request',
      'Desktop Refresh',
    ],
    correctIndices: [1],
    hints: [
      'Standard Changes are low-risk routine tasks (like adding RAM); Normal Changes wait for weekly CAB.',
      'Urgent security patches or P1 outage fixes use an expedited approval path.',
    ],
    explanation:
      'HOW & WHY: ITIL defines three Change types: Standard (low-risk, pre-approved), Normal (scheduled CAB review), and Emergency (urgent break-fix or critical security patch approved by ECAB/leadership immediately with retrospective documentation).',
  },
  {
    id: 'it-m21',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Computer Account vs. User Account in AD',
    prompt: 'In Active Directory, why do workstations AND servers also have Computer objects in OUs alongside User objects?',
    options: [
      'Domain-joined PCs authenticate themselves with their own machine password, receive Computer Group Policies (BitLocker, Firewall, Wi-Fi), and establish a secure channel with Domain Controllers.',
      'Only printers have AD objects.',
      'Computer objects are purely decorative comments.',
      'Workstations use Computer objects to bypass DNS.',
    ],
    correctIndices: [0],
    hints: [
      'Think about what happens before any human logs in at the Windows lock screen!',
      'Machine certificates, Wi-Fi 802.1X machine auth, and Computer GPOs all target the Computer object.',
    ],
    explanation:
      'HOW & WHY: Domain-joined machines maintain their own computer account & auto-rotated 30-day secret with AD, allowing machine-level authentication, Computer GPO enforcement, and secure Kerberos channels before user logon.',
  },
  {
    id: 'it-m22',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'arp -a Neighbor Cache Inspection',
    prompt: 'A printer tech suspects two devices on VLAN 20 were accidentally assigned the exact same static IP 10.20.0.55. Which quick local Windows command displays the IP-to-MAC mapping table so you can spot an IP conflict?',
    options: ['arp -a', 'sfc /scannow', 'gpresult /r', 'whoami /groups'],
    correctIndices: [0],
    hints: [
      'This command inspects the Layer 3 IP to Layer 2 MAC address resolution cache on your PC.',
      'Three letters + "-a".',
    ],
    explanation:
      'HOW & WHY: "arp -a" displays resolved IPv4-to-MAC hardware addresses in your NIC’s neighbor cache. Seeing the MAC address flip for 10.20.0.55 (or comparing its OUI vendor prefix against the switch MAC table) confirms a duplicate IP conflict.',
  },
  {
    id: 'it-m23',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'PowerShell Finding Locked AD Users',
    prompt: 'Tier 1 wants a quick one-line PowerShell command (with the ActiveDirectory module loaded) to list all currently locked-out user accounts across the domain.',
    options: [
      'Search-ADAccount -LockedOut | Select-Object Name, SamAccountName',
      'Format-Volume -DriveLetter C',
      'Stop-Service Spooler',
      'Test-NetConnection -Port 80',
    ],
    correctIndices: [0],
    hints: [
      'ActiveDirectory module includes a "Search-ADAccount" cmdlet specifically built for locked, expired, or inactive accounts!',
      'Piping "|" to Select-Object keeps output readable.',
    ],
    explanation:
      'HOW & WHY: "Search-ADAccount -LockedOut" queries the domain cleanly in one command—much faster than browsing dozens of nested OUs manually in ADUC during a morning password-lockout storm.',
  },
  // Adding 15 more balanced Easy/Medium items in Part 1 so Part 1 has 52 solid questions
  {
    id: 'it-e24',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'HDMI vs. DisplayPort Daisy-Chaining',
    prompt: 'A user wants to connect two 2K office monitors to a single DisplayPort 1.4 output on a Dell dock without using a splitter box. Which DisplayPort feature supports connecting Monitor 1 -> Monitor 2 in series?',
    options: [
      'DisplayPort MST (Multi-Stream Transport / Daisy-Chaining)',
      'VGA analog passthrough',
      'HDMI ARC',
      'PS/2 multiplexing',
    ],
    correctIndices: [0],
    hints: [
      'Standard HDMI carries only one independent video stream per port.',
      'DisplayPort 1.2+ supports "DP Out" daisy-chaining (MST).',
    ],
    explanation:
      'HOW & WHY: DisplayPort Multi-Stream Transport (MST) lets Monitor 1 receive two independent video streams over one cable and pass the second stream via its DP-Out port to Monitor 2—whereas HDMI lacks daisy-chaining.',
  },
  {
    id: 'it-e25',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'SLA Breach Prevention',
    prompt: 'A P2 ticket you own has 20 minutes remaining before its Resolution SLA expires, and you are still waiting for the vendor’s firewall log analysis. What should you do right away?',
    options: [
      'Update the ticket publicly/internally with current progress, verify if "Waiting on Vendor/Customer" status applies, and notify your Service Desk Lead so SLA escalation is proactive rather than a silent miss.',
      'Close the ticket as "Won’t Fix" to beat the timer.',
      'Delete the timestamp from the database.',
      'Ignore it until tomorrow morning.',
    ],
    correctIndices: [0],
    hints: [
      'Gaming SLA metrics by closing unresolved tickets violates ITSM integrity.',
      'Proactive communication keeps stakeholders informed before a deadline passes.',
    ],
    explanation:
      'HOW & WHY: Proactive SLA management means communicating status updates early, using valid hold states per policy, and alerting leads early—never artificially closing unresolved tickets.',
  },
  {
    id: 'it-e26',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Disabled vs. Locked Out Account',
    prompt: 'In Active Directory, what is the difference between a user account that is LOCKED OUT versus one that is DISABLED?',
    options: [
      'Locked Out is an automatic temporary state after too many wrong passwords; Disabled is an intentional administrative block (e.g., terminated employee or leave of absence).',
      'Disabled accounts unlock automatically after 15 minutes.',
      'Locked Out accounts are permanently deleted from AD.',
      'There is no difference.',
    ],
    correctIndices: [0],
    hints: [
      'Think HR offboarding vs. user forgetting Caps Lock.',
      'Never re-enable a DISABLED account without verifying HR/manager authorization!',
    ],
    explanation:
      'HOW & WHY: A lockout triggers automatically from bad password attempts; a disabled account (down-arrow icon in ADUC) was intentionally turned off by an admin (such as termination or security hold) and must NEVER be casually enabled without authorization.',
  },
  {
    id: 'it-e27',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'DNS Server Purpose in ipconfig',
    prompt: 'When troubleshooting why a browser cannot open websites, why do you inspect the "DNS Servers" field in "ipconfig /all"?',
    options: [
      'To verify the PC points to reachable internal/corporate DNS servers (rather than a dead IP, 127.0.0.1, or unauthorized rogue address).',
      'To check the monitor’s screen resolution.',
      'To view the SSD serial number.',
      'To reset the BitLocker recovery key.',
    ],
    correctIndices: [0],
    hints: [
      '"ipconfig" alone shows IP, Mask, and Gateway; adding "/all" reveals DHCP server, MAC address, and DNS servers!',
      'A typo or unreachable DNS IP breaks all domain-name lookups.',
    ],
    explanation:
      'HOW & WHY: Plain "ipconfig" omits DNS server IPs. Running "ipconfig /all" reveals exact DHCP/DNS servers, lease times, and MAC addresses so you can immediately verify whether DNS is pointed correctly.',
  },
  {
    id: 'it-e28',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'M365 Passwordless & Number Matching',
    prompt: 'Why did Microsoft enable "Number Matching" in Microsoft Authenticator instead of simple one-tap "Approve / Deny" push buttons?',
    options: [
      'To defeat MFA Fatigue ("push bombing") attacks where users blindly tap Approve on an attacker’s repeated prompts.',
      'To remove passwords from Active Directory permanently without MFA.',
      'To make push notifications work without Wi-Fi or cellular data.',
      'To let multiple users share one phone.',
    ],
    correctIndices: [0],
    hints: [
      'If an attacker steals your password and spams your phone at 2 AM with 20 "Approve?" popups, tired users sometimes tap Yes just to stop the buzzing!',
      'Typing the 2-digit number displayed on the login screen proves YOU are physically looking at that screen.',
    ],
    explanation:
      'HOW & WHY: Number matching stops MFA fatigue/push-bombing because the user can only enter the 2-digit code if they are physically looking at the legitimate sign-in screen initiating the request.',
  },
  {
    id: 'it-m24',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Windows Driver Rollback',
    prompt: 'Immediately after Windows Update installs a new Wi-Fi driver overnight, a user’s ThinkPad drops Wi-Fi every 2 minutes. Where in Windows can you revert directly to the previous stable driver version?',
    options: [
      'Device Manager -> Network adapters -> Properties -> Driver tab -> Roll Back Driver',
      'Disk Cleanup -> Delete System32',
      'ADUC -> Reset Computer Account',
      'ipconfig /flushdns',
    ],
    correctIndices: [0],
    hints: [
      'devmgmt.msc manages hardware device drivers and preserves the previous driver version for quick rollback.',
      'Look inside the Driver tab of the Wi-Fi adapter properties.',
    ],
    explanation:
      'HOW & WHY: Windows retains the prior driver package on upgrade. Opening Device Manager (`devmgmt.msc`), selecting the Wi-Fi adapter -> Driver -> Roll Back Driver restores the known-good driver in under a minute.',
  },
  {
    id: 'it-m25',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'VIP & High-Urgency Prioritization Balance',
    prompt: 'A single VIP Director calls asking for a faster monitor cable while a P1 outage is actively halting all warehouse shipping scanners. How should the Service Desk handle both tickets?',
    options: [
      'Acknowledge the VIP warmly with a realistic ETA or delegate the monitor cable to an available Tier 1 peer while keeping P1 outage resources focused on restoring warehouse shipping.',
      'Stop working on the P1 warehouse outage immediately for 2 hours to shop for a cable.',
      'Tell the VIP their request is unimportant.',
      'Mark the monitor cable as P1.',
    ],
    correctIndices: [0],
    hints: [
      'Business impact still governs P1 priority, while polite communication protects VIP relationships.',
      'Team delegation solves both without breaking SLA priorities.',
    ],
    explanation:
      'HOW & WHY: Effective service desks balance high-impact outages (P1 warehouse stoppage) with courteous VIP communication—setting transparent expectations or delegating the single-user request to a peer without derailing P1 recovery.',
  },
  {
    id: 'it-m26',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Home Folder / Roaming vs. Known Folder Move',
    prompt: 'Why are modern M365 organizations replacing legacy Windows Roaming Profiles and H: network drives with OneDrive Known Folder Move (KFM)?',
    options: [
      'OneDrive KFM silently backs up Desktop, Documents, and Pictures to the cloud with offline caching, fast logins, version history, and ransomware file recovery—even when off VPN.',
      'OneDrive KFM deletes local Desktop files.',
      'Roaming Profiles work only on macOS.',
      'KFM increases login wait times by 20 minutes.',
    ],
    correctIndices: [0],
    hints: [
      'Legacy Roaming Profiles slowed down logins by copying gigabytes over LAN/VPN every sign-in!',
      'OneDrive KFM works seamlessly over any Internet connection with built-in file version rollback.',
    ],
    explanation:
      'HOW & WHY: OneDrive Known Folder Move protects Desktop/Documents/Pictures continuously over HTTPS (no VPN required), keeps instant login times via Files On-Demand, and provides 30-day ransomware version recovery.',
  },
  {
    id: 'it-m27',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'nslookup Testing Alternate DNS Servers',
    prompt: 'A user’s PC resolves "portal.corp.local" as NXDOMAIN using its default DHCP DNS server (10.10.0.5). Which command tests whether the secondary internal DNS server (10.10.0.6) has the correct record?',
    options: [
      'nslookup portal.corp.local 10.10.0.6',
      'ping portal.corp.local -dns 10.10.0.6',
      'ipconfig /all 10.10.0.6',
      'tracert 10.10.0.6',
    ],
    correctIndices: [0],
    hints: [
      'nslookup accepts an optional second argument specifying WHICH DNS server IP to query!',
      'Syntax: nslookup <hostname> <dns-server-ip>.',
    ],
    explanation:
      'HOW & WHY: Passing a specific DNS server IP as the second parameter (`nslookup portal.corp.local 10.10.0.6`) immediately isolates DNS replication failures or bad primary DNS forwarders from workstation faults.',
  },
  {
    id: 'it-m28',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'Outlook Shared Calendar & Delegate Permissions',
    prompt: 'An executive asks for their new assistant to view full meeting details and send/accept calendar invites on their behalf inside Outlook. Which minimum Exchange/Outlook calendar permission level is needed?',
    options: [
      'Availability Only (Free/Busy)',
      'Delegate access (or Editor calendar permissions with delegate meeting invite handling)',
      'Reviewer (read-only)',
      'Anonymous public sharing',
    ],
    correctIndices: [1],
    hints: [
      'Reviewer can only read items; Free/Busy hides meeting subjects.',
      'To create, edit, and reply to meeting invites ON BEHALF OF an executive requires Delegate / Editor rights.',
    ],
    explanation:
      'HOW & WHY: Outlook Delegate Access (granting Calendar Editor + optionally delivering meeting requests/responses to the delegate) lets assistants manage and respond to calendar invites cleanly on an executive’s behalf.',
  },
];
