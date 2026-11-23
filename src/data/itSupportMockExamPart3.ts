import { ExamQuestion } from '../types/ccna';

export const IT_SUPPORT_QUESTIONS_PART_3: ExamQuestion[] = [
  {
    id: 'it-p3-1',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'In-House IT vs MSP & Follow-the-Sun Support',
    prompt:
      'An analyst joins a Managed Service Provider (MSP) instead of an in-house IT department. What key difference shapes daily ticket work at an MSP?',
    options: [
      'MSPs support multiple external client organizations across varying SLAs, billing agreements, and environments simultaneously.',
      'MSPs only ever support one company building during daytime lunch hours.',
      'MSPs prohibit logging tickets or using remote monitoring tools.',
      'MSPs eliminate Tier 2 and Tier 3 escalations entirely.',
    ],
    correctIndices: [0],
    hints: [
      'Compare serving a single employer vs serving dozens of contracted client companies.',
      'Each MSP client often maintains separate documentation, SLAs, and RMM tenant scopes.',
    ],
    explanation:
      'HOW & WHY: An MSP supports multiple separate customer businesses under distinct contracts and SLAs, whereas in-house IT serves internal employees within one organization.',
  },
  {
    id: 'it-p3-2',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'OLA vs UC vs Pending SLA Pause Clock',
    prompt:
      'Which statement accurately distinguishes an SLA, an OLA, and when a Pending-Customer SLA clock pauses?',
    options: [
      'An SLA binds IT to the customer, an OLA sets internal team handoff targets, and the Pending clock pauses only after asking a clear specific question to the user.',
      'An OLA applies to external hardware vendors, while an SLA applies to internal colleagues.',
      'Agents should mark tickets Pending immediately without messaging the user just to pause SLA timers.',
      'Underpinning Contracts (UCs) govern only internal printer paper stock.',
    ],
    correctIndices: [0],
    hints: [
      'SLA = customer-facing promise; OLA = internal team target; UC = external supplier contract.',
      'Never abuse Pending status silently to hide backlog.',
    ],
    explanation:
      'HOW & WHY: SLAs promise response/resolution times to the business; OLAs align internal teams (e.g., Service Desk to Network Ops) so the SLA holds; UCs bind external vendors. Setting Pending pauses the clock fairly only when waiting on explicit user/vendor input.',
  },
  {
    id: 'it-p3-3',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Secure Boot, TPM 2.0 & Windows 11 Requirements',
    prompt:
      'Why do modern enterprise laptops require UEFI Secure Boot and TPM 2.0 before deploying Windows 11 or BitLocker automatically?',
    options: [
      'Secure Boot verifies signed bootloaders against rootkits, while TPM 2.0 stores cryptographic BitLocker keys and hardware health measurements.',
      'Secure Boot doubles monitor refresh rates above 144 Hz.',
      'TPM 2.0 replaces the laptop SSD storage completely.',
      'Windows 11 runs exclusively in 32-bit x86 mode without TPM.',
    ],
    correctIndices: [0],
    hints: [
      'Think pre-OS boot integrity and cryptographic hardware key storage.',
      'Firmware/BIOS updates changing PCR registers can trigger BitLocker recovery!',
    ],
    explanation:
      'HOW & WHY: Secure Boot checks cryptographic bootloader signatures before the OS starts, while TPM 2.0 hardware-seals BitLocker volume encryption keys and validates boot state.',
  },
  {
    id: 'it-p3-4',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'ESD Safety, Power Supplies & Hardware RMA',
    prompt:
      'A desktop workstation smells faintly burnt and trips its breaker. What safety and warranty procedure must a support technician follow?',
    options: [
      'Never open a sealed Power Supply Unit (PSU capacitors hold lethal charge); isolate external power, document serial/Service Tag for RMA, back up/protect data, and wear ESD protection if authorized inside the chassis.',
      'Pry open the sealed PSU casing with a metal screwdriver while plugged in.',
      'Clean the PSU capacitors with tap water and reboot.',
      'Throw away the SSD without recording asset retirement or backup status.',
    ],
    correctIndices: [0],
    hints: [
      'Sealed PSUs are strictly field-replaceable units—never open them!',
      'Always capture serial number/Service Tag and protect user data before RMA shipping.',
    ],
    explanation:
      'HOW & WHY: Internal PSU capacitors store dangerous high-voltage charge even unplugged. Technicians swap or RMA the whole sealed unit safely, record serial numbers, guard user storage, and follow ESD wrist-strap grounding inside open cases.',
  },
  {
    id: 'it-p3-5',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Windows Home vs Pro vs Enterprise & Windows 10 EOS',
    prompt:
      'A small clinic bought 5 laptops running Windows 11 Home. Which enterprise features will be MISSING compared to Windows 11 Pro?',
    options: [
      'Active Directory Domain Join, full managed BitLocker policy/Group Policy, and hosting Remote Desktop (RDP).',
      'Web browsing and USB mouse support.',
      'Ability to connect to 5 GHz Wi-Fi.',
      '64-bit program execution.',
    ],
    correctIndices: [0],
    hints: [
      'Why do IT departments insist on Pro/Enterprise rather than retail Home SKUs?',
      'Note also that Windows 10 mainstream support ended October 2025 unless covered by ESU.',
    ],
    explanation:
      'HOW & WHY: Windows Home lacks Active Directory Domain Join, full managed BitLocker/GPO controls, and Remote Desktop hosting—making Windows 11 Pro/Enterprise standard in managed IT environments.',
  },
  {
    id: 'it-p3-6',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'macOS & Linux Frontline Diagnostics',
    prompt:
      'A shared Ubuntu Linux print-relay host refuses to start its daemon with "No space left on device", and you need to inspect usage, daemon logs, and set `config.json` owner-rw/world-read (`-rw-r--r--`). Which command trio handles this?',
    options: [
      '`df -h`, `journalctl -u <service>`, and `chmod 644 config.json`',
      '`free -h`, `ipconfig /flushdns`, and `chmod 777`',
      '`sfc /scannow`, `gpresult /r`, and `manage-bde -status`',
      '`regedit`, `taskkill`, and `chkdsk`',
    ],
    correctIndices: [0],
    hints: [
      '`df -h` checks mounted filesystem disk space; `journalctl` reads systemd service logs.',
      '`644` = `rw-r--r--`; `755` = `rwxr-xr-x`. Never lazily apply `777`!',
    ],
    explanation:
      'HOW & WHY: In Linux support, `df -h` checks full disks (`/var/log`), `journalctl -u` / `systemctl status` inspect service crashes, and `chmod 644` grants safe read-only access without risky world-writable `777` exposure.',
  },
  {
    id: 'it-p3-7',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'FAT32 vs exFAT vs NTFS File Limits',
    prompt:
      'A marketing designer tries copying a 6.4 GB video export onto a 64 GB USB drive with 50 GB free, yet Windows says "The file is too large for the destination file system." Why?',
    options: [
      'The USB stick is formatted `FAT32`, which enforces a hard 4 GB maximum single-file size limit; back up contents and reformat to `exFAT` (cross-OS) or `NTFS` (Windows).',
      'BitLocker limits all USB sticks to 4 GB.',
      'USB 2.0 cables block files over 4 GB.',
      'Chrome deleted the file extension.',
    ],
    correctIndices: [0],
    hints: [
      'Remember the classic `FAT32` single-file ceiling.',
      'Reformatting erases existing files—always copy existing data off first!',
    ],
    explanation:
      'HOW & WHY: `FAT32` cannot hold any single file larger than 4 GB minus 1 byte regardless of total free drive space. Reformatting (after backing up existing drive contents!) to `exFAT` (Mac+Windows) or `NTFS` (Windows) solves it immediately.',
  },
  {
    id: 'it-p3-8',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Patch Tuesday, DISM & Windows Update Repair',
    prompt:
      'Monthly Windows quality updates keep failing (`0x800f081f`), and `sfc /scannow` says it found corrupt files it could not repair. What exact repair command restores the Windows Component Store BEFORE re-running `sfc`?',
    options: [
      '`DISM /Online /Cleanup-Image /RestoreHealth`',
      '`gpupdate /force`',
      '`ipconfig /release`',
      '`net user /domain`',
    ],
    correctIndices: [0],
    hints: [
      '`DISM` fixes the underlying component image cache that `sfc /scannow` pulls clean copies from.',
      'Run `DISM ... /RestoreHealth` as Administrator first, then re-run `sfc /scannow`.',
    ],
    explanation:
      'HOW & WHY: `sfc /scannow` compares and repairs system files using the local Windows Component Store—if that store itself is damaged, running `DISM /Online /Cleanup-Image /RestoreHealth` repairs the source first.',
  },
  {
    id: 'it-p3-9',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'The 5-Rung Ping Ladder & Request Timed Out vs Host Unreachable',
    prompt:
      'When troubleshooting an offline endpoint using the Ping Ladder, what does a ping to `127.0.0.1` prove vs why might `Destination Host Unreachable` differ from `Request Timed Out`?',
    options: [
      '`127.0.0.1` verifies the local TCP/IP stack; `Destination Host Unreachable` indicates no ARP/local route exists, whereas `Request Timed Out` means the packet left but no reply returned (firewall drop or offline host).',
      '`127.0.0.1` pings Google Public DNS directly.',
      '`Destination Host Unreachable` always proves DNS failed.',
      'Both errors mean the monitor is unplugged.',
    ],
    correctIndices: [0],
    hints: [
      'Step 1: `127.0.0.1` (Loopback) -> Own IP -> Gateway -> `8.8.8.8` -> Domain Name.',
      'Firewall silent drops return `Request timed out`; local ARP/routing misses often return `Destination host unreachable`.',
    ],
    explanation:
      'HOW & WHY: Walking the Ping Ladder isolates exactly where traffic stops: local stack (`127.0.0.1`), local interface, local gateway, external IP (`8.8.8.8`), and DNS resolution.',
  },
  {
    id: 'it-p3-10',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'DNS Record Types & Hosts File Overrides',
    prompt:
      'A developer complains a single PC resolves `portal.corp.local` to `127.0.0.1` even though `nslookup portal.corp.local` returns the real `10.10.0.25` server IP for every other workstation. Where should you inspect next?',
    options: [
      'Check `C:\\Windows\\System32\\drivers\\etc\\hosts` (or `/etc/hosts`) for a leftover local override line, since `nslookup` bypasses the `hosts` file and queries DNS directly.',
      'Replace the office core router.',
      'Clear the Print Spooler.',
      'Change the domain MX record.',
    ],
    correctIndices: [0],
    hints: [
      '`nslookup` talks straight to DNS, whereas browsers read the OS `hosts` file first!',
      'Developers frequently add temporary localhost test entries in `hosts`.',
    ],
    explanation:
      'HOW & WHY: Windows checks the local `hosts` file before querying DNS—so `nslookup` shows the true DNS `A` record while Chrome/Edge obeys a forgotten `hosts` file override on that one machine.',
  },
  {
    id: 'it-p3-11',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'Wi-Fi 2.4 / 5 / 6 GHz & Captive Portals',
    prompt:
      'A traveling salesperson sits at a hotel where Wi-Fi says "Connected, no internet" and Chrome throws an HTTPS warning on Google. Meanwhile, their VPN client spins endlessly. What is the clean fix?',
    options: [
      'Pause VPN briefly, open a plain HTTP URL (such as `http://neverssl.com` or the gateway IP) to complete the hotel captive portal sign-in, then reconnect the VPN.',
      'Disable TLS/HTTPS security checks across the entire laptop.',
      'Force the hotel Wi-Fi card to 2.4 GHz channel 99.',
      'Reimage Windows from a hotel lobby.',
    ],
    correctIndices: [0],
    hints: [
      'HSTS blocks HTTPS sites from redirecting to a hotel captive login page.',
      'VPN loops cannot establish tunnels before captive portal terms are accepted.',
    ],
    explanation:
      'HOW & WHY: Unauthenticated captive portals intercept traffic and trigger HSTS TLS warnings on HTTPS URLs while starving VPN handshakes. Pausing VPN briefly and opening a plain HTTP page completes portal login safely.',
  },
  {
    id: 'it-p3-12',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'hard',
    topic: 'Wall Jacks, VLANs & PoE Closets',
    prompt:
      'After moving desks, a VoIP desk phone stays completely unpowered and a laptop plugged into wall jack `FL3-W08` pulls `172.30.99.55` (Guest subnet) instead of `10.10.20.x` (Finance). The same phone boots fine at neighbor jack `FL3-W07`. What is your escalation diagnosis?',
    options: [
      'Jack `FL3-W08` maps to a switchport configured on the Guest VLAN with PoE disabled; escalate to NetOps with faceplate ID `FL3-W08`, known-good test on `FL3-W07`, and wrong IP `172.30.99.55`.',
      'Tell the user to unlock the IDF switch closet and swap fiber cables randomly.',
      'Order a new VoIP phone immediately.',
      'Run `sfc /scannow` on the VoIP handset.',
    ],
    correctIndices: [0],
    hints: [
      'Known-good test proved the phone works; wrong IP + dark PoE proves switchport config mismatch!',
      'Never send users into locked wiring closets.',
    ],
    explanation:
      'HOW & WHY: Switchports missing PoE leave IP phones dark, and ports tagged to a Visitor/Guest VLAN starve corporate subnet reachability. Recording the exact wall plate ID and known-good swap lets NetOps fix the switchport cleanly.',
  },
  {
    id: 'it-p3-13',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    topic: 'MFA Fatigue vs Number Matching & FIDO2',
    prompt:
      'At 2:14 AM, an employee receives 14 repeated push-notification MFA prompts on her phone while asleep. Which security defense stops "MFA Fatigue" attacks most effectively?',
    options: [
      'Number-matching MFA prompts (requiring the exact number displayed on the login screen) or phishing-resistant FIDO2 security keys / Passkeys—plus immediate password reset + session revocation if any prompt was tapped.',
      'Turning off MFA at night between midnight and 6 AM.',
      'Asking users to approve push prompts quickly so they stop ringing.',
      'Sharing one generic service account across the whole team.',
    ],
    correctIndices: [0],
    hints: [
      'Simple "Approve / Deny" push alerts can be spammed until a sleepy user taps Approve by mistake.',
      'If a user DID approve an unknown push, treat it as an active compromise immediately!',
    ],
    explanation:
      'HOW & WHY: **Number matching** forces the user to see and enter the session number on the live sign-in screen, while **FIDO2 / Passkeys** cryptographically bind auth to the true domain—defeating both MFA push fatigue and lookalike phishing.',
  },
  {
    id: 'it-p3-14',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    topic: 'Joiner / Mover Privilege Creep & Involuntary Offboarding',
    prompt:
      'An employee transfers from Accounting to Customer Success (a Mover), and separately HR requests an immediate involuntary termination for another staff member. What two critical rules apply?',
    options: [
      'For the Mover, audit and remove old Accounting permissions (**prevent privilege creep**); for the involuntary Leaver, disable AD/Entra accounts, revoke all sessions/VPN/badges immediately at the HR trigger time while preserving/converting data per policy.',
      'Leave all Accounting groups forever so the Mover feels appreciated, and delay the Leaver’s disable until next week.',
      'Delete the Leaver’s mailbox permanently within 30 seconds without checking HR/Legal retention.',
      'Share the Leaver’s password with their manager.',
    ],
    correctIndices: [0],
    hints: [
      'Internal role transfers silently accumulate dangerous permissions if old groups are never stripped!',
      'Involuntary terminations require zero-lag session revocation.',
    ],
    explanation:
      'HOW & WHY: **Movers** require removing old access alongside granting new access to prevent privilege creep; **Involuntary Leavers** require immediate account disablement + token/VPN/badge revocation synchronized with HR while preserving mailbox/OneDrive data safely.',
  },
  {
    id: 'it-p3-15',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    topic: 'Workstation AD Trust Relationship Failed',
    prompt:
      'A field laptop sitting in a closet for four months displays: `"The trust relationship between this workstation and the primary domain failed."` How can Tier 2 restore login cleanly without wiping local files?',
    options: [
      'Sign in using a cached local administrator (`LAPS`) account and run `Test-ComputerSecureChannel -Repair` (or unjoin to a workgroup and rejoin the domain).',
      'Delete `C:\\Windows\\System32`.',
      'Reimage the laptop without checking local files first.',
      'Change the monitor DisplayPort cable.',
    ],
    correctIndices: [0],
    hints: [
      'Think computer-account password rotation between the workstation and the Domain Controller.',
      'Local admin accounts don’t depend on the broken DC secure channel!',
    ],
    explanation:
      'HOW & WHY: Domain-joined PCs rotate an internal machine password every ~30 days. Prolonged offline storage desynchronizes that secret; signing in locally (`LAPS`) and running `Test-ComputerSecureChannel -Repair` (or rejoining the domain) preserves every user file intact.',
  },
  {
    id: 'it-p3-16',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'Exchange NDR Codes (550, 552, 554) & SPF/DKIM/DMARC',
    prompt:
      'Match these three Non-Delivery Report (NDR) bounce codes to their true causes: `550 5.1.1`, `552`, and `554 5.7.1 DMARC`.',
    options: [
      '`550 5.1.1` = recipient address does not exist; `552` = mailbox/attachment size limit exceeded; `554 5.7.1 DMARC` = blocked by policy / failed SPF & DKIM authentication.',
      '`550 5.1.1` = Wi-Fi disconnected; `552` = BitLocker triggered; `554` = USB printer jam.',
      'All three mean the user forgot their Windows PIN.',
      '`552` = valid delivery confirmation receipt.',
    ],
    correctIndices: [0],
    hints: [
      'Notice the 5xx permanent SMTP failure class.',
      'DMARC failures happen when new SaaS/CRM tools send mail without published SPF/DKIM DNS records.',
    ],
    explanation:
      'HOW & WHY: Reading SMTP NDR codes saves massive guesswork: `550 5.1.1` catches typos/missing addresses, `552` flags attachment/quota ceilings, and `554 5.7.1 DMARC` points straight to missing SPF/DKIM DNS authorization.',
  },
  {
    id: 'it-p3-17',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'OneDrive Recycle Bin & M365 License Removal Warning',
    prompt:
      'A junior admin plans to remove a Microsoft 365 license from a departed employee’s account right away to save money without converting the mailbox or setting Legal Hold. What happens?',
    options: [
      'Removing the Exchange/M365 license places the user’s mailbox and OneDrive into soft-delete countdown (~30 days by default), risking permanent data loss unless converted to Shared Mailbox or held first.',
      'Shared Mailboxes immediately charge double Enterprise E5 licensing.',
      'OneDrive stores all deleted files permanently for 99 years automatically.',
      'Removing the license wipes the user’s laptop BIOS.',
    ],
    correctIndices: [0],
    hints: [
      'Always convert to Shared Mailbox / export / apply retention BEFORE stripping paid M365 licenses!',
      'Inside active accounts, OneDrive’s web Recycle Bin + Second-stage bin gives ~93 days total recovery.',
    ],
    explanation:
      'HOW & WHY: Stripping an M365 license starts Exchange’s ~30-day soft-delete clock on the user mailbox. Offboarding playbooks either convert mailboxes to free (<50 GB) Shared Mailboxes or enable Litigation/Retention Hold before reclaiming licenses.',
  },
  {
    id: 'it-p3-18',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'Intune BYOD Retire vs Corporate Wipe',
    prompt:
      'An employee leaves the company while using their personal BYOD iPhone enrolled in Microsoft Intune for work Outlook and Teams. Which MDM action should IT execute?',
    options: [
      '**Retire** (removes ONLY company-managed email, apps, and corporate data while leaving personal photos, texts, and apps untouched).',
      '**Wipe** (factory-resets the entire personal phone to out-of-box state).',
      'Ask the employee to hand over their personal Apple ID password.',
      'Do nothing and leave corporate emails cached on the personal device indefinitely.',
    ],
    correctIndices: [0],
    hints: [
      'Contrast **Retire** (app/work profile cleanup) vs **Wipe** (full factory reset).',
      'Full `Wipe` is reserved for lost/reassigned company-owned devices!',
    ],
    explanation:
      'HOW & WHY: Intune **Retire** selectively strips managed corporate accounts, email caches, and company policy apps from personal BYOD devices without destroying personal family photos or private data.',
  },
  {
    id: 'it-p3-19',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'Privacy Law (GDPR / Kenya DPA) & 3-2-1 Backup Rule + RPO/RTO',
    prompt:
      'Which combination accurately defines Data Minimization under GDPR / Kenya Data Protection Act AND the 3-2-1 backup standard with RPO/RTO?',
    options: [
      'Collect/keep only strictly necessary personal data; maintain 3 copies on 2 media types with 1 offsite/immutable copy—balancing RPO (max acceptable data loss time) and RTO (max acceptable recovery downtime), verified by regular restore tests.',
      'Copy every customer spreadsheet onto personal USB sticks and never run test restores.',
      'RPO measures monitor brightness; RTO counts ticket reopens.',
      'Cloud sync (like OneDrive alone) replaces immutable 3-2-1 backups completely.',
    ],
    correctIndices: [0],
    hints: [
      'Cloud Sync replicates accidental deletions & ransomware encryption immediately unless protected by immutable snapshots!',
      'An untested backup is not a proven backup.',
    ],
    explanation:
      'HOW & WHY: Privacy regulations (GDPR, UK GDPR, Kenya DPA) demand lawful minimal retention and fast breach reporting; **3-2-1** backups (especially immutable/offline copies) plus tested **RPO** (how much data can be lost) and **RTO** (how fast service must return) protect business survival.',
  },
  {
    id: 'it-p3-20',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    topic: 'Ransomware Containment & 6 Incident Response Phases',
    prompt:
      'A user opens an attachment and a ransom note appears while local Excel files turn to `.locked`. What is the exact safe sequence?',
    options: [
      'Preparation -> Identification -> **Containment FIRST** (EDR network isolation / disconnect LAN & Wi-Fi while preserving machine state, check shared drives, alert Security) -> Eradication -> Recovery (clean reimage/hardware + tested immutable backups) -> Lessons Learned.',
      'Reboot the infected machine onto the office LAN five times, plug a USB drive in to copy files, and restore straight onto the infected OS.',
      'Scold the user publicly in Teams chat before disconnecting Ethernet.',
      'Pay the Bitcoin ransom silently without telling InfoSec.',
    ],
    correctIndices: [0],
    hints: [
      'Isolate BEFORE erasing forensic evidence or restoring backups—never reuse an uncleaned infected workstation!',
      'Remember mapped shares (`Z:`) spread ransomware laterally in seconds.',
    ],
    explanation:
      'HOW & WHY: Immediate network/EDR isolation halts lateral share encryption while preserving forensic clues for InfoSec. Never reuse infected OS installations—rebuild cleanly from known-good media and restore verified immutable backups.',
  },
  {
    id: 'it-p3-21',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'JQL, Zendesk Triggers vs Automations & Cross-Tool Notes',
    prompt:
      'What separates a Zendesk **Trigger** from an **Automation**, AND which ServiceNow/JSM field prevents private troubleshooting drafts from emailing the user?',
    options: [
      'A **Trigger** runs immediately on ticket events/changes while an **Automation** runs on time schedules; keep private diagnostics strictly in **Work notes** (ServiceNow) or **Internal note** (JSM/Zendesk).',
      'Triggers cost extra per click while Automations only send SMS.',
      'ServiceNow **Additional comments** stay strictly invisible to the caller.',
      'JQL can only sort closed tickets from last year.',
    ],
    correctIndices: [0],
    hints: [
      'Event-based vs Time-based!',
      'Always double-check **Work notes** (ServiceNow) vs **Additional comments** (public).',
    ],
    explanation:
      'HOW & WHY: Interviewers frequently test Zendesk (`Trigger = event` vs `Automation = timer`) and safe audience controls (`Work notes` / `Internal note` = private vs `Additional comments` / `Reply to customer` = customer-visible).',
  },
  {
    id: 'it-p3-22',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'ITIL 4 Guiding Principles & 5 Whys Problem RCA',
    prompt:
      'Third-floor Wi-Fi disconnects 18 times over two weeks across multiple laptops. Help desk analysts reset Wi-Fi drivers per call, yet tickets keep returning. What ITIL 4 approach breaks the cycle permanently?',
    options: [
      'Open a **Problem** record linking the 18 incidents, apply **5 Whys / Fishbone RCA**, record a temporary **Known Error (KEDB)** workaround, and deploy the permanent AP firmware fix through **Change Enablement**.',
      'Tell staff never to use laptops on the third floor.',
      'Close all 18 incidents quickly with `AHT` timers disabled.',
      'Reboot each employee’s mouse.',
    ],
    correctIndices: [0],
    hints: [
      'Incident Management restores quick service; Problem Management hunts root cause permanently.',
      'Permanent infrastructure updates still move through Change Enablement (with rollback plans outside freeze windows).',
    ],
    explanation:
      'HOW & WHY: Logging a **Problem** record links recurring incidents, captures a fast **KEDB** workaround for L1, uncovers root cause (`5 Whys`), and closes permanently once an approved **Change** fixes the underlying fault.',
  },
  {
    id: 'it-p3-23',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'hard',
    topic: 'Major Incident Bridge Roles, Change Freezes & Blameless PIR',
    prompt:
      'During a company-wide P1 email outage, a change freeze is active for quarterly finance close. Who coordinates the Major Incident bridge, how should L1 handle incoming duplicate calls, and what follows recovery?',
    options: [
      'An **Incident Commander** leads technical leads, a **Comms Lead** posts scheduled non-speculative updates, and a **Scribe** logs timestamps; L1 links child tickets to the Master P1 and shares the approved workaround; afterward teams hold a **blameless Post-Incident Review (PIR)**.',
      'Every analyst sends their own private theory to all staff and skips documentation.',
      'Fire whichever engineer touched DNS last during the PIR meeting.',
      'Deploy unapproved schema edits straight to production during the month-end freeze without rollback notes.',
    ],
    correctIndices: [0],
    hints: [
      'Child-ticket linking + one approved status voice stops bridge chaos.',
      'Blameless PIRs fix system gaps rather than punishing humans.',
    ],
    explanation:
      'HOW & WHY: Coordinated Major Incident bridges rely on clear role separation (Commander, Tech Leads, Comms Lead, Scribe), child-ticket linking at L1, zero unconfirmed speculation, and blameless PIR action items.',
  },
  {
    id: 'it-p3-24',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'Service Desk Metrics (ASA, AHT, Reopen Rate) & Metric Gaming',
    prompt:
      'A manager notices Average Handle Time (`AHT`) dropped 28% this month, yet `Reopen Rate` jumped from 4% to 17% and `CSAT` dipped. What is the most likely operational cause?',
    options: [
      'Analysts are prematurely marking tickets Resolved/Closed without confirming permanent fixes (**metric gaming** driven by speed-only targets).',
      'Automated CMDB discovery added five new monitors.',
      'Average Speed to Answer (ASA) automatically increases CSAT.',
      'Users stopped using passwords.',
    ],
    correctIndices: [0],
    hints: [
      'Speed metrics (`AHT`, `MTTR`) must always be read alongside quality metrics (`Reopen Rate`, `CSAT`, `FCR`).',
      'Look at rising Reopen Rates as a classic symptom of rushed closures!',
    ],
    explanation:
      'HOW & WHY: Optimizing purely for fast ticket closure causes premature "Resolved" clicks, forcing frustrated users to reopen the same issue later. Healthy dashboards balance speed (`ASA`/`MTTR`) with true verified resolution (`FCR`, low `Reopen Rate`, high `CSAT`).',
  },
  {
    id: 'it-p3-25',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Interview Readiness: STAR Method, Honest Tool Framing & Cert Order',
    prompt:
      'In a first IT Support interview, you are asked about a ticketing tool you have not used in production, plus a behavioral question about handling an angry caller. Which strategy scores highest?',
    options: [
      'Use a 90-second **STAR** story (`"I"` actions + measurable result) for the caller question, honestly state what tool you practiced, explain how queues/SLAs/public-vs-internal notes transfer, and map growth along A+ -> M365 -> ITIL 4 -> Network+/CCNA -> Security+.',
      'Claim expert mastery in every enterprise tool on the job ad hoping they won’t ask follow-up questions.',
      'Say "WE fixed it" vaguely for five minutes without any outcome or lesson.',
      'Decline to ask any questions at the end because "everything looks fine."',
    ],
    correctIndices: [0],
    hints: [
      'Bluffing fails technical interviews fast; transferable mental models + STAR precision + thoughtful closing questions stand out.',
      'Verify live exam codes before booking any certification.',
    ],
    explanation:
      'HOW & WHY: Hiring managers prize integrity, clear 1–2 minute **STAR** ownership stories (`"I"` rather than `"we"`), structured troubleshooting, honest transferable tool understanding, and intentional certification sequencing.',
  },
];
