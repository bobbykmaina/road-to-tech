import { ExamQuestion } from '../types/ccna';

export const IT_SUPPORT_QUESTIONS_PART_2: ExamQuestion[] = [
  // ==================== MEDIUM & HARD SCENARIOS (Hardware, OS & Boot) ====================
  {
    id: 'it-h1-scen',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: BitLocker Recovery Screen After BIOS Update',
    prompt:
      'Scenario: After a scheduled Dell/Lenovo BIOS firmware update pushes overnight, an executive’s laptop boots straight to a blue "BitLocker Recovery: Enter the recovery key to get going again" screen instead of Windows 11. Why did this trigger, and where do you retrieve the 48-digit key?',
    options: [
      'The BIOS update altered TPM Platform Configuration Register (PCR) measurements, causing TPM to withhold the drive key; verify user identity and retrieve the 48-digit BitLocker Recovery Key from Microsoft Entra ID (or Intune / AD BitLocker tab).',
      'The NVMe SSD is permanently erased and must be wiped.',
      'The user’s AD password changed.',
      'Tell the user to enter their 6-digit PIN 20 times until it bypasses.',
    ],
    correctIndices: [0],
    hints: [
      'BitLocker seals its key to firmware/boot integrity measurements inside the TPM chip!',
      'Enterprises back up 48-digit BitLocker recovery keys automatically to Entra ID / Intune / AD.',
    ],
    explanation:
      'HOW & WHY: Firmware/BIOS updates or toggling Secure Boot change TPM PCR hashes, so TPM refuses to auto-unlock the OS volume as an anti-tampering measure. Look up the device’s 48-digit recovery key in Entra ID / Intune / ADUC (after strict caller verification) to unlock Windows—and remember to suspend BitLocker before future manual BIOS flashes.',
  },
  {
    id: 'it-h2-scen',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: BSOD Loop & Driver Verifier / Minidump Triage',
    prompt:
      'Scenario: Six Dell laptops from the same batch started crashing with BSOD "SYSTEM_THREAD_EXCEPTION_NOT_HANDLED (igdkmdn64.sys)" right after Monday’s driver deployment. What does "igdkmdn64.sys" tell you immediately, and what is your fastest mitigation?',
    options: [
      'igdkmdn64.sys is the Intel Integrated Graphics kernel driver; roll back the Intel Graphics driver on affected machines and alert Tier 2 to pause/pull that driver package from Intune/WSUS.',
      'The laptops all suffered simultaneous RAM failure.',
      'Active Directory deleted the users’ accounts.',
      'The office switches need Spanning Tree enabled.',
    ],
    correctIndices: [0],
    hints: [
      'Look at the filename inside the BSOD parentheses: "igdkmdn64.sys" ("ig" = Intel Graphics Kernel Mode Driver).',
      'Notice 6 laptops crashed simultaneously after a Monday deployment -> Problem / bad driver update!',
    ],
    explanation:
      'HOW & WHY: Windows BSOD stop codes frequently name the faulting `.sys` kernel driver (`igdkmdn64.sys` = Intel Graphics, `nvlddmkm.sys` = NVIDIA, `Netwtw10.sys` = Intel Wi-Fi). Rolling back the driver in Device Manager/Safe Mode and notifying Endpoint Engineering to halt the bad deployment stops the fleet-wide crash.',
  },
  {
    id: 'it-h3-scen',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Virtual Memory Exhaustion & Memory Leak',
    prompt:
      'Scenario: A finance analyst with 16 GB RAM reports Chrome tabs turning black ("Out of Memory") and Excel crashing, even though Task Manager -> Performance shows only 65% RAM used at first glance. Checking Task Manager -> Performance -> Memory shows "Committed: 31.8 / 32.0 GB" while "C:" has only 200 MB free. What happened?',
    options: [
      'The Windows Pagefile is prevented from expanding because C: is out of disk space, hitting the Commit Limit (RAM + Pagefile) and starving applications of virtual memory allocations.',
      'Chrome cannot run on laptops with 16 GB RAM.',
      'The CPU thermal-throttled the HDMI port.',
      'DNS cache filled up RAM.',
    ],
    correctIndices: [0],
    hints: [
      'Look at "Committed: 31.8 / 32.0 GB" AND "C: has only 200 MB free"!',
      'Windows Commit Limit = Physical RAM + Pagefile size on C:.',
    ],
    explanation:
      'HOW & WHY: Windows applications reserve virtual memory against the Commit Limit (RAM + pagefile.sys). When C: fills up, the pagefile cannot grow, so apps hit the Commit Limit ceiling and crash with "Out of Memory" even before physical RAM looks 100% full. Freeing disk space on C: and closing memory-leaking apps resolves it.',
  },
  {
    id: 'it-h4-scen',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    questionType: 'scenario',
    topic: 'Scenario: macOS FileVault & Password Desync',
    prompt: 'Scenario: After a MacBook user resets their corporate Active Directory / Okta password from another computer, their MacBook still expects their OLD password at the FileVault boot screen and prompts "Login Keychain cannot be unlocked." Why?',
    options: [
      'FileVault pre-boot decryption and the local macOS Keychain are still encrypted with the user’s previous local Mac password until synchronized on desktop login.',
      'macOS cannot use Wi-Fi.',
      'Microsoft Outlook changed the Mac serial number.',
      'FileVault deletes local user accounts every 30 days.',
    ],
    correctIndices: [0],
    hints: [
      'Changing a cloud/AD password off-device doesn’t update FileVault’s offline pre-boot disk key automatically!',
      'Signing in at FileVault with the old password first (or using MDM Escrow Recovery Key / Platform SSO) lets macOS sync.',
    ],
    explanation:
      'HOW & WHY: When passwords change off-machine, FileVault and macOS Login Keychain still expect the old password until the Mac syncs with the identity provider (via Jamf Connect / Platform SSO) or the user unlocks with the old password and updates their Keychain.',
  },

  // ==================== SCENARIOS & HARD (Ticketing & ITSM) ====================
  {
    id: 'it-h5-scen',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Morning Queue Triage Under SLA Pressure',
    prompt:
      'Scenario: You open the morning queue and see four new unassigned tickets:\n1) Warehouse label printer server offline halting all outbound shipments (40 workers idle)\n2) New hire starting next Monday needs Adobe Pro license\n3) Single sales rep reports laptop battery wears down faster than last year\n4) Accounting manager cannot access payroll portal 2 hours before bank cutoff (no workaround)\nIn what priority order should you act?',
    options: [
      'Ticket #1 (P1 site-wide operational stoppage) & Ticket #4 (P1/P2 urgent business-critical payroll deadline), then Ticket #3 (P3 Incident), then Ticket #2 (P4 scheduled Service Request).',
      'Ticket #2 first because onboarding is easy.',
      'Ticket #3 first because it came in 2 minutes earlier.',
      'Process all four strictly in alphabetical order by last name.',
    ],
    correctIndices: [0],
    hints: [
      'Evaluate Impact (how many users/critical processes stopped) x Urgency (deadline/workaround).',
      '40-person shipping stoppage and imminent payroll cutoff beat Monday’s future license request!',
    ],
    explanation:
      'HOW & WHY: Service Desk triage never runs strictly First-In-First-Out! Impact x Urgency puts #1 (site-wide shipping outage) and #4 (time-critical payroll stoppage) at immediate top priority, followed by single-user #3, and scheduled onboarding #2 well ahead of Monday.',
  },
  {
    id: 'it-h6-scen',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Detecting a Hidden Problem Behind Repeated Fixes',
    prompt:
      'Scenario: Over the past 10 days, Tier 1 closed 18 separate tickets where different remote users couldn’t map the Accounting drive, each time resolving it by running "ipconfig /flushdns" and restarting VPN. What ITSM mistake is happening, and what action should you take?',
    options: [
      'Treat the 18 recurring Incidents as symptoms of an unresolved root cause: open a Problem Record, link the 18 Incidents, and escalate to Network/Systems Engineering to fix the underlying VPN DNS issue.',
      'Keep celebrating high FCR numbers and say nothing.',
      'Write a script that flushes DNS every 10 seconds forever.',
      'Delete the 18 closed tickets.',
    ],
    correctIndices: [0],
    hints: [
      'Fixing the exact same symptom 18 times is firefighting, not solving the root cause!',
      'Remember ITIL Problem Management: connect recurring Incidents into one Problem investigation.',
    ],
    explanation:
      'HOW & WHY: Repeatedly applying temporary workarounds inflates ticket volume and frustrates users. Opening a Problem Record backed by the 18 linked Incidents gives Infrastructure Engineering the pattern needed to eliminate the root DNS/VPN defect permanently.',
  },
  {
    id: 'it-h7-scen',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    questionType: 'scenario',
    topic: 'Scenario: Handling Unapproved Shadow IT Software Requests',
    prompt:
      'Scenario: A marketing analyst opens a ticket saying "I downloaded a free PDF converter from a random website and need the admin password so I can install it right now." What is the secure and helpful response?',
    options: [
      'Politely decline entering admin credentials for unvetted third-party downloads, explain the security policy, and offer the approved corporate PDF tool (or submit a Software Approval/Service Request).',
      'Read them the local Administrator password over the phone.',
      'Temporarily make them a Domain Admin for 1 hour.',
      'Close the ticket with "No" and zero explanation.',
    ],
    correctIndices: [0],
    hints: [
      'Free "PDF converter" sites are one of the #1 enterprise malware vectors!',
      'Say "No" to the risky path while offering a clear, safe "Yes" path (approved software catalog).',
    ],
    explanation:
      'HOW & WHY: Never elevate unvetted internet downloads—free converter sites frequently bundle trojans/adware. Explain the risk respectfully and immediately point the user to the company’s approved tool (e.g., Company Portal / Adobe / Edge PDF) or software-vetting request form.',
  },

  // ==================== SCENARIOS & HARD (Active Directory & GPO) ====================
  {
    id: 'it-h8-scen',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Domain Trust Relationship Failed',
    prompt:
      'Scenario: A laptop returns to the office after sitting offline in a closet for 90 days. When the user tries to sign in with their domain account, Windows displays: "The trust relationship between this workstation and the primary domain failed." How do you repair it cleanly without wiping user data?',
    options: [
      'Sign in using a local administrator account (or disconnect network temporarily if cached credentials work), then run PowerShell "Test-ComputerSecureChannel -Repair -Credential (Get-Credential)" (or disjoin/rejoin the domain).',
      'Format the SSD and reinstall Windows.',
      'Run "ipconfig /flushdns".',
      'Reset the user’s M365 MFA.',
    ],
    correctIndices: [0],
    hints: [
      'Workstations auto-rotate their AD machine account password every 30 days; if offline or restored from an old snapshot, the laptop’s machine password no longer matches AD!',
      'PowerShell has a built-in cmdlet to test and repair the domain secure channel.',
    ],
    explanation:
      'HOW & WHY: Domain trust breaks when a PC’s machine password falls out of sync with AD (e.g., long offline storage, VM snapshot rollback, or duplicate computer name). Logging in locally and running `Test-ComputerSecureChannel -Repair` (or rejoining the domain after resetting the computer object) restores the machine channel with zero data loss.',
  },
  {
    id: 'it-h9-scen',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Tracing Recurring Lockout Caller (Event 4740)',
    prompt:
      'Scenario: A sales manager’s AD account locks out every 12 minutes even after changing their password and clearing Windows Credential Manager on their laptop. Inspecting Event ID 4740 on the PDC Emulator Domain Controller shows: "Caller Computer Name: EXCH-CAS-01". What does "Caller Computer Name: EXCH-CAS-01" pinpoint?',
    options: [
      'The bad password attempts are arriving via the Exchange/ActiveSync mail gateway—meaning a mobile phone Mail app, tablet, or legacy email client still holds the user’s old password!',
      'The user’s laptop keyboard is broken.',
      'The Domain Controller’s hard drive failed.',
      'Someone unplugged the switch in Building B.',
    ],
    correctIndices: [0],
    hints: [
      'Event ID 4740 on the PDC Emulator records WHICH server or workstation submitted the failed password!',
      'If Caller Computer Name = EXCH-CAS-01 or NPS-RADIUS, look at phone mail apps or saved Wi-Fi 802.1X profiles!',
    ],
    explanation:
      'HOW & WHY: Security Event ID 4740 ("A user account was locked out") identifies the exact Caller Computer Name forwarding the bad credentials. Seeing an Exchange/mail/RADIUS server immediately tells Tier 1/2 to have the user update their password inside their iPhone/Android Mail app or saved corporate Wi-Fi profile.',
  },
  {
    id: 'it-h10-scen',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: GPO Placed on Wrong OU / Scope',
    prompt:
      'Scenario: An admin creates a new User Configuration GPO setting Chrome’s corporate homepage and links it to the "Workstations_Laptops" OU (which holds Computer objects, while User accounts live in "Corp_Users" OU). Users logging into those laptops never receive the Chrome homepage! Why?',
    options: [
      'User Configuration GPO settings only apply to User objects located inside the linked OU (unless Loopback Processing is configured); linking a User GPO to a Computer-only OU has no User objects in scope.',
      'Chrome ignores all Windows GPOs.',
      'gpupdate /force only works on servers.',
      'User accounts must be Domain Admins for GPOs to apply.',
    ],
    correctIndices: [0],
    hints: [
      'Always match GPO section (Computer vs. User) to the AD object type living inside that OU!',
      'If User accounts live in Corp_Users and only Computer objects live in Workstations_Laptops, who receives a User policy linked to Workstations_Laptops? Nobody!',
    ],
    explanation:
      'HOW & WHY: By default, Computer Configuration sections target Computer objects in an OU, and User Configuration sections target User objects in an OU. Linking a User GPO to a Computer-only OU misses all users—either link the GPO to the User OU or enable GPO Loopback Processing.',
  },
  {
    id: 'it-h11-scen',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Hybrid AD -> Entra ID Connect Sync Delay',
    prompt:
      'Scenario: You create a brand-new user in on-premises ADUC and assign them an M365 license script, yet 5 minutes later they do not appear in the Microsoft 365 / Entra Admin Center. Why, and how does Tier 2 expedite it?',
    options: [
      'In a hybrid AD environment, Microsoft Entra Connect runs delta synchronization cycles every 30 minutes by default; wait for the cycle or trigger "Start-ADSyncSyncCycle -PolicyType Delta" on the sync server.',
      'On-premises AD users can never use Microsoft 365.',
      'You must recreate the account manually in M365 with a different UPN.',
      'Run "ipconfig /release" on the user’s laptop.',
    ],
    correctIndices: [0],
    hints: [
      'Hybrid organizations sync on-premises AD users UP to cloud Entra ID on a scheduled interval.',
      'Default Entra Connect sync interval = 30 minutes.',
    ],
    explanation:
      'HOW & WHY: Hybrid identities originate in on-prem AD and replicate to Entra ID via Microsoft Entra Connect every 30 minutes by default. Creating a duplicate cloud-only user would break sync; either wait ~30 minutes or have Tier 2 run a manual Delta Sync.',
  },

  // ==================== SCENARIOS & HARD (Endpoint Networking & M365) ====================
  {
    id: 'it-h12-scen',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: 802.1X Wired Port Blocked After Reimage',
    prompt:
      'Scenario: An IT intern replaces a desktop PC’s motherboard/NIC, joins it to the domain, and connects it to a conference-room wall port—yet the PC gets NO DHCP lease (169.254.x.x) while a second laptop works fine on the same wall jack. Switch logs show "dot1x auth-fail" on that port. Why?',
    options: [
      'The port enforces IEEE 802.1X NAC (Cisco ISE/NPS), and the newly imaged machine either lacks its domain machine authentication certificate or the Wired AutoConfig (dot3svc) service is not running.',
      'Cat6 cables stop carrying DHCP after motherboard swaps.',
      '169.254.x.x is a corporate VPN IP.',
      'The conference room switch needs a reboot.',
    ],
    correctIndices: [0],
    hints: [
      'Notice a DIFFERENT domain laptop works on that exact same wall jack!',
      'Look at the switch log clue: "dot1x auth-fail" -> 802.1X port security / NAC.',
    ],
    explanation:
      'HOW & WHY: On 802.1X-protected switchports, the switch drops DHCP and data frames until the PC authenticates via EAP-TLS/PEAP. After a fresh image or motherboard swap, missing machine certificates or a disabled Windows "Wired AutoConfig" service causes 802.1X auth failure and APIPA fallback.',
  },
  {
    id: 'it-h13-scen',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Public Wi-Fi DNS Hijack / Hotel Routing',
    prompt:
      'Scenario: A user’s Windows laptop connects to "CoffeeShop_Free" Wi-Fi, gets IP 192.168.10.44, and can ping 8.8.8.8—yet opening https://google.com fails unless they type https://142.250.72.14. Running "ipconfig /all" shows DNS Server = 10.10.0.5 (an unreachable internal HQ server hard-coded statically on the Wi-Fi adapter!). Why did that break outside HQ?',
    options: [
      'A static internal DNS IP (10.10.0.5) was manually entered in Windows IPv4 adapter settings; switching DNS back to "Obtain DNS server address automatically" lets public Wi-Fi assign a reachable DNS server.',
      'Public Wi-Fi blocks HTTPS port 443.',
      'Google stopped supporting DNS names.',
      'The laptop needs more RAM.',
    ],
    correctIndices: [0],
    hints: [
      '10.10.0.5 is only reachable inside HQ or over VPN!',
      'Always check "Obtain IP/DNS automatically" in ncpa.cpl when travelers lose DNS off-site.',
    ],
    explanation:
      'HOW & WHY: Someone previously hard-coded an internal RFC 1918 DNS IP (10.10.0.5) on the Wi-Fi adapter properties. Off the corporate network without VPN, 10.10.0.5 is unreachable—breaking all hostname lookups even though raw IP connectivity to 8.8.8.8 works.',
  },
  {
    id: 'it-h14-scen',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Hidden Attacker Outlook Exfiltration Rule',
    prompt:
      'Scenario: Two weeks after a user briefly fell for a phishing email and reset their password (without revoking sessions at the time), an external vendor says they received strange fake invoice replies from that user’s email—yet the user sees NOTHING in their Inbox or Sent Items! Where did the attacker hide?',
    options: [
      'The attacker added a malicious Outlook Inbox Rule that auto-deletes/archives vendor replies to RSS Feeds/Deleted Items (hiding the thread) and forwards mail externally, or registered a rogue OAuth app/MFA method.',
      'The user’s monitor brightness is too low.',
      'Windows Fast Startup duplicated the emails.',
      'Active Directory automatically deletes Sent Items every hour.',
    ],
    correctIndices: [0],
    hints: [
      'Classic BEC (Business Email Compromise) persistence: hide incoming replies from the victim so the victim never notices the conversation!',
      'Inspect Outlook Rules ("Get-InboxRule"), external forwarding, Entra ID Sign-in Logs, and Registered MFA methods.',
    ],
    explanation:
      'HOW & WHY: In Business Email Compromise (BEC), attackers create hidden Inbox Rules (e.g., "Move replies containing ‘invoice’ to RSS Subscriptions / Deleted Items and mark as read") and forward copies out. Containment requires revoking all Entra sessions, resetting password, auditing/deleting malicious Inbox Rules & OAuth apps, and purging unauthorized MFA methods.',
  },
  {
    id: 'it-h15-scen',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: MFA Push Bombing Incident Response',
    prompt:
      'Scenario: At 11:40 PM, an employee calls the after-hours desk saying "Microsoft Authenticator pinged my phone 12 times in a row while I was asleep—I accidentally hit Approve on the last one to make it stop!" What two immediate actions are mandatory?',
    multiSelect: true,
    options: [
      'Revoke all active Entra ID sessions and reset the user’s password immediately (since the attacker already had the valid password to trigger MFA!).',
      'Inspect Entra ID Sign-in Logs for suspicious foreign IPs / newly registered MFA methods / Outlook rules and escalate to SecOps.',
      'Tell the user to turn off their phone and check back next Monday.',
      'Disable MFA completely for the user.',
    ],
    correctIndices: [0, 1],
    hints: [
      'An MFA prompt ONLY fires AFTER the attacker already entered the correct username AND password!',
      'And once the user tapped Approve, the attacker received an active authenticated session token!',
    ],
    explanation:
      'HOW & WHY: Receiving an unexpected MFA prompt proves the user’s password is already compromised; tapping Approve grants the attacker an active token. Immediately revoke all cloud sessions, reset the password, audit sign-in logs/MFA devices/inbox rules, and alert SecOps.',
  },

  // ==================== MULTI-TAB SIMLETS & DRAG-AND-DROP (IT Help Desk) ====================
  {
    id: 'it-h16-sim',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: Laptop Sluggish + Update Loop Triage',
    prompt:
      'A remote user reports their laptop freezes every afternoon and fails Windows Updates. Inspect all three diagnostic tabs to determine the primary root cause and fix.',
    exhibitTabs: [
      {
        title: 'Task Manager: CPU & Disk',
        output: `CPU Utilization: 18% | Up time: 42:14:08:19 (42 days!)\nMemory: 14.9 / 16.0 GB (Committed 29.8 / 30.0 GB)\nDisk 0 (C: NVMe): 100% Active Time`,
      },
      {
        title: 'Storage: C: Drive',
        output: `Drive C: 237.0 GB total | 140 MB free (0.05% free)\nLargest folders: C:\\Users\\jsmith\\Downloads (92 GB), C:\\Windows\\Temp (48 GB)`,
      },
      {
        title: 'User Note',
        output: `User: "I shut down my laptop every Friday evening, so I don't know why IT says it needs a reboot."`,
      },
    ],
    options: [
      'Replace the motherboard immediately.',
      'Two compound issues: C: is critically full (140 MB free, pinning disk/commit memory at 100%) AND Windows Fast Startup prevented a true reboot for 42 days—clear Downloads/Temp space and perform a full "Restart".',
      'Reset the user’s M365 password.',
      'Switch Wi-Fi from 5 GHz to 2.4 GHz.',
    ],
    correctIndices: [1],
    hints: [
      'Check Uptime (42 days despite Friday "Shut down"!) AND free disk space (140 MB free!).',
      'Both Disk space cleanup + Start -> Restart address the root causes cleanly.',
    ],
    explanation:
      'HOW & WHY: Tab 1 reveals 42 days uptime (Fast Startup ignored "Shut down") plus 100% Disk / near-max Commit memory. Tab 2 shows C: at 140 MB free with 48 GB in Windows\\Temp and 92 GB in Downloads. Clearing temp/Downloads space and clicking Restart resolves both bottlenecks.',
  },
  {
    id: 'it-h17-sim',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: GPO Printer Missing + Security Filtering',
    prompt:
      'Finance user "lchen" on FIN-PC-08 moved to Floor 3, yet the new Floor 3 printer GPO never maps on her PC even after "gpupdate /force" and rebooting. Inspect the three tabs to find the misconfiguration.',
    exhibitTabs: [
      {
        title: 'ADUC: FIN-PC-08 Location',
        output: `DistinguishedName: CN=FIN-PC-08,OU=Finance,OU=Workstations,DC=corp,DC=local`,
      },
      {
        title: 'GPMC: GPO_Floor3_Printers Scope',
        output: `Linked OU: OU=Finance,OU=Workstations,DC=corp,DC=local\nSecurity Filtering:\n - SG_Floor3_Printers (Read + Apply Group Policy)\n(Note: Authenticated Users was REMOVED from Security Filtering)`,
      },
      {
        title: 'FIN-PC-08: gpresult /r',
        output: `COMPUTER SETTINGS\n  Filtered Out GPOs (Denied):\n    GPO_Floor3_Printers — Reason: Security Filtering Denied`,
      },
    ],
    options: [
      'FIN-PC-08 is not powered on.',
      'Authenticated Users was removed from Security Filtering without giving "Domain Computers" (or FIN-PC-08) Read access to the Computer GPO, causing gpresult to reject it as Filtered Out.',
      'Printers cannot be mapped via GPO.',
      'gpresult /r disables Group Policy.',
    ],
    correctIndices: [1],
    hints: [
      'Look at Tab 3: "Filtered Out GPOs ... Reason: Security Filtering Denied"!',
      'Since MS16-072, Computer GPOs MUST grant "Read" permission to Authenticated Users or Domain Computers so the machine account can read the GPO!',
    ],
    explanation:
      'HOW & WHY: When an admin removes "Authenticated Users" from a GPO’s Security Filtering and adds only a user group (without keeping Read permission for Authenticated Users or Domain Computers), the workstation’s machine account cannot read the GPO! Re-adding "Authenticated Users" with Read-only (not Apply) or adding Domain Computers fixes it immediately.',
  },
  {
    id: 'it-h18-sim',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: Conditional Access Sign-In Failure',
    prompt:
      'Remote contractor "tnguyen" says M365 Outlook stopped syncing this morning with "Your sign-in was successful but does not meet the criteria to access this resource." Inspect the Entra ID Sign-in Log and Conditional Access tabs.',
    exhibitTabs: [
      {
        title: 'Entra ID: Sign-in Log',
        output: `User: tnguyen@corp.com | App: Office 365 Exchange Online\nLocation: London, UK (IP 185.x.x.x)\nDevice State: Unmanaged Personal Windows 11 PC (Not Compliant / Not Hybrid Joined)\nAuthentication: Password + Authenticator MFA Passed\nStatus: Failure (Error 53003 — Blocked by Conditional Access)`,
      },
      {
        title: 'Conditional Access Policy: CA-Corp-Mail',
        output: `Target: All Users | Cloud App: Office 365 Exchange Online\nGrant Control: Require MFA AND Require device to be marked as Compliant (Intune)`,
      },
    ],
    options: [
      'tnguyen’s password is wrong.',
      'The user passed password + MFA, but Conditional Access Policy CA-Corp-Mail blocks unmanaged personal devices because Intune Device Compliance is required—enroll the device in Intune or verify approved contractor BYOD policy.',
      'Microsoft Authenticator is down globally.',
      'The user needs a new Cat6 cable.',
    ],
    correctIndices: [1],
    hints: [
      'Notice Authentication PASSED (Password + MFA succeeded)!',
      'Look at Error 53003 and the Grant Control in CA-Corp-Mail: "Require device to be marked as Compliant".',
    ],
    explanation:
      'HOW & WHY: Error 53003 in Entra ID means Conditional Access blocked the session AFTER password/MFA succeeded. Here, CA-Corp-Mail enforces "Require Compliant Device", and tnguyen signed in from an unmanaged personal PC. Either enroll the device into Intune/MAM per policy or guide the user to their corporate-managed laptop.',
  },
  {
    id: 'it-h19-dd',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    questionType: 'drag-drop',
    topic: 'Windows Admin Consoles & Commands',
    prompt: 'Drag (or tap) each Windows administrative command/console to its matching IT Support action.',
    dragDrop: {
      items: ['dsa.msc', 'services.msc', 'eventvwr.msc', 'devmgmt.msc'],
      targets: [
        { id: 'win-aduc', slotLabel: 'Unlock user accounts & edit Security Groups (ADUC)', correctItem: 'dsa.msc' },
        { id: 'win-svc', slotLabel: 'Restart Print Spooler or Windows Update daemon', correctItem: 'services.msc' },
        { id: 'win-ev', slotLabel: 'Inspect System crash logs & Kernel-Power events', correctItem: 'eventvwr.msc' },
        { id: 'win-dev', slotLabel: 'Roll back a buggy Wi-Fi or GPU driver', correctItem: 'devmgmt.msc' },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      'dsa = Directory Service Agent (ADUC); devmgmt = Device Management.',
      'services = Services; eventvwr = Event Viewer.',
    ],
    explanation:
      'HOW & WHY: Knowing Microsoft Management Console (.msc) shortcuts (`dsa.msc`, `services.msc`, `eventvwr.msc`, `devmgmt.msc`) lets support engineers launch consoles cleanly from Win+R or remote shells.',
  },
  {
    id: 'it-h20-dd',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    questionType: 'drag-drop',
    topic: '4-Step Endpoint Network Triage Order',
    prompt: 'Order the 4-step endpoint network diagnostic sequence by matching each step number to the exact test.',
    dragDrop: {
      items: [
        'ipconfig /all (verify valid IP, mask, gateway & DNS)',
        'ping <default-gateway> (verify local LAN/Wi-Fi link)',
        'ping 8.8.8.8 (verify Internet IP routing)',
        'nslookup portal.corp.com (verify DNS name resolution)',
      ],
      targets: [
        { id: 'net-1', slotLabel: 'Step 1: Confirm PC has a non-APIPA IP & config', correctItem: 'ipconfig /all (verify valid IP, mask, gateway & DNS)' },
        { id: 'net-2', slotLabel: 'Step 2: Confirm local switch/Wi-Fi reaches router', correctItem: 'ping <default-gateway> (verify local LAN/Wi-Fi link)' },
        { id: 'net-3', slotLabel: 'Step 3: Confirm upstream WAN routing works by IP', correctItem: 'ping 8.8.8.8 (verify Internet IP routing)' },
        { id: 'net-4', slotLabel: 'Step 4: Isolate DNS hostname resolution separately', correctItem: 'nslookup portal.corp.com (verify DNS name resolution)' },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      'Troubleshoot from closest (your own NIC) -> local gateway -> external IP -> hostname lookup!',
      'Never blame DNS before checking if you even have a valid IP address.',
    ],
    explanation:
      'HOW & WHY: Following Step 1 (`ipconfig /all`) -> Step 2 (`ping gateway`) -> Step 3 (`ping 8.8.8.8`) -> Step 4 (`nslookup`) isolates whether an outage is NIC/DHCP, Wi-Fi/switch, ISP routing, or DNS in under 60 seconds.',
  },

  // ==================== ADDITIONAL EASY, MEDIUM & HARD QUESTIONS TO REACH >= 125 IT SUPPORT Qs ====================
  {
    id: 'it-e29',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Hard Power Drain Reset',
    prompt: 'A user’s laptop refuses to power on or light up charging LEDs after an electrical brownout. Before ordering a replacement motherboard, what safe 15-second hardware reset should you guide them through?',
    options: [
      'Unplug AC power and dock, hold the Power button down for 15–20 seconds to drain residual capacitors, reconnect OEM AC power, and test.',
      'Open the chassis with a kitchen knife while plugged in.',
      'Put the laptop in a freezer.',
      'Delete System32.',
    ],
    correctIndices: [0],
    hints: [
      'Static/EC (Embedded Controller) lockups frequently recover after discharging residual motherboard power.',
      'Always disconnect the AC brick and USB-C dock first!',
    ],
    explanation:
      'HOW & WHY: Holding the power button for 15–20 seconds with AC and peripherals disconnected discharges Embedded Controller (EC) latches, reviving "no power / no POST" laptops roughly 30% of the time without replacing hardware.',
  },
  {
    id: 'it-e30',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Windows File Explorer Hidden Extensions',
    prompt: 'Why should IT Support advise caution when a user receives an email attachment named "invoice.pdf.exe" while Windows hides known file extensions by default?',
    options: [
      'With extensions hidden, Windows displays "invoice.pdf" while hiding the real ".exe" executable extension, tricking users into running malware.',
      '.exe files are harmless text notes.',
      '.pdf files cannot open in Edge.',
      'Hiding extensions doubles disk speed.',
    ],
    correctIndices: [0],
    hints: [
      'Double-extension spoofing hides the dangerous executable suffix.',
      'Turning on "File name extensions" in Explorer View exposes ".exe", ".scr", and ".js" payloads.',
    ],
    explanation:
      'HOW & WHY: Attackers name malware "Invoice_2026.pdf.exe". Because Windows hides ".exe" by default, victims see "Invoice_2026.pdf" and double-click an executable program.',
  },
  {
    id: 'it-e31',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Scope Question in Triage',
    prompt: 'When a user reports "The ERP website won’t load!", what single triage question immediately tells you whether it is a P1 outage or a single-PC glitch?',
    options: [
      '"Is anyone else near you or on your team seeing the same error, or is it happening only on your laptop?"',
      '"What color is your office chair?"',
      '"How long have you worked at the company?"',
      '"Have you tried turning your monitor off?"',
    ],
    correctIndices: [0],
    hints: [
      'Impact = number of affected users/departments.',
      '1 user = check laptop/DNS/cache; 20 users = check server/network/Major Incident!',
    ],
    explanation:
      'HOW & WHY: Asking "Is this affecting just you or multiple people?" immediately establishes Impact scope, preventing wasted time rebooting one PC during a datacenter outage (or escalating a single user’s stale browser cache as a P1 outage).',
  },
  {
    id: 'it-e32',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Organizational Unit (OU) Purpose',
    prompt: 'What are the two main uses of Organizational Units (OUs) inside Active Directory?',
    options: [
      'Applying Group Policy Objects (GPOs) to specific groups of computers/users AND delegating administrative control (e.g., letting Help Desk reset passwords for Sales OU only).',
      'Assigning IPv4 DHCP leases.',
      'Storing Outlook PST files.',
      'Encrypting Ethernet switches.',
    ],
    correctIndices: [0],
    hints: [
      'Security Groups grant access to folders/apps; OUs organize directory structure for policy and delegation!',
      'Think "GPO linking + Admin delegation".',
    ],
    explanation:
      'HOW & WHY: OUs act like directory containers where admins link GPOs (e.g., locking down Kiosk PCs differently from Developer PCs) and delegate scoped help desk permissions.',
  },
  {
    id: 'it-e33',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'Localhost Ping Test',
    prompt: 'What does running "ping 127.0.0.1" verify on a user’s computer?',
    options: [
      'That the local OS TCP/IP software stack is functioning properly (even without Wi-Fi or an Ethernet cable)',
      'That the ISP fiber router is online',
      'That Active Directory replication succeeded',
      'That Google DNS is reachable',
    ],
    correctIndices: [0],
    hints: [
      '127.0.0.1 is the IPv4 loopback address.',
      'It never sends frames onto the network wire.',
    ],
    explanation:
      'HOW & WHY: Pinging 127.0.0.1 (or ::1 in IPv6) loops back inside the local OS kernel, proving TCP/IP software works independently of physical cables or Wi-Fi.',
  },
  {
    id: 'it-e34',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'Outlook Web (OWA) Isolation Test',
    prompt: 'A user’s Outlook desktop app keeps hanging on "Trying to connect...", while their internet works. You ask them to open https://outlook.office.com in Chrome/Edge and their mail loads instantly! What did that single test prove?',
    options: [
      'Their M365 mailbox, account password, and Exchange Online cloud service are healthy—the fault sits strictly in the local Outlook desktop client/profile/add-ins.',
      'The Exchange server is completely down.',
      'Their DNS server failed.',
      'Their laptop monitor needs replacement.',
    ],
    correctIndices: [0],
    hints: [
      'Comparing Outlook Desktop vs. Outlook on the Web (OWA) separates cloud mailbox outages from local desktop app bugs in 10 seconds!',
      'Also gives the user an immediate workaround to keep working while you fix Outlook desktop.',
    ],
    explanation:
      'HOW & WHY: Testing Outlook on the Web (`outlook.office.com`) immediately splits cloud/account faults from local Outlook desktop profile/OST/credential corruption—AND unblocks the user right away.',
  },
  {
    id: 'it-m29',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Windows Print Spooler Hardening (Point and Print / 0x0000011b)',
    prompt: 'After a monthly Windows security patch, multiple Windows 11 PCs fail connecting to a shared Windows print server with error 0x0000011b. What caused this well-known issue?',
    options: [
      'Microsoft RPC authentication hardening (PrintNightmare mitigation) enforced stronger RPC privacy levels between client and print server; both print server and clients must align patch/registry RPC privacy settings.',
      'The printer ran out of cyan ink.',
      'USB cables exceeded 50 meters.',
      'The user’s AD password expired.',
    ],
    correctIndices: [0],
    hints: [
      'Remember Windows PrintNightmare security updates?',
      'Error 0x0000011b specifically signals an RPC authentication privacy mismatch on shared Windows printers.',
    ],
    explanation:
      'HOW & WHY: Error 0x0000011b arises when Windows Print Server RPC encryption hardening mismatches client settings (or the print server wasn’t patched consistently). Aligning OS patches / Enterprise Print GPO policies resolves it cleanly.',
  },
  {
    id: 'it-m30',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'USB Selective Suspend & Dock Disconnects',
    prompt: 'A user complains their USB headset and wired dock Ethernet randomly drop for 3 seconds every time their laptop sits idle for a few minutes on battery. Which Windows power setting commonly causes this?',
    options: [
      'USB Selective Suspend (or NIC "Allow the computer to turn off this device to save power") in Power Options / Device Manager',
      'BitLocker drive encryption',
      'Active Directory Kerberos ticket lifetime',
      'Outlook Cached Exchange Mode',
    ],
    correctIndices: [0],
    hints: [
      'Windows aggressively powers down idle USB root hubs and NICs to save battery!',
      'Check Power Plan -> USB selective suspend AND Device Manager -> Power Management tab.',
    ],
    explanation:
      'HOW & WHY: Windows USB Selective Suspend and NIC Power Management put dock controllers to sleep to conserve battery, causing random disconnects on headsets and Ethernet. Disabling power-saving shutoff on the USB Hub / NIC restores stable connections.',
  },
  {
    id: 'it-m31',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'Standardized Offboarding Checklist',
    prompt: 'HR notifies the Service Desk that an employee leaves at 5:00 PM Friday. Which three actions form a complete, secure offboarding checklist? (Choose two critical IT actions below.)',
    multiSelect: true,
    options: [
      'Disable AD/Entra ID account, revoke all active M365/VPN sessions, and remove MFA tokens at the exact scheduled cutoff time',
      'Convert mailbox to Shared Mailbox / grant manager access per HR approval and arrange laptop return (or remote wipe via Intune if unreturned)',
      'Leave their VPN account active for 60 days as a courtesy',
      'Post their old password in a public Teams channel',
    ],
    correctIndices: [0, 1],
    hints: [
      'Remember: disabling an account alone doesn’t always kill active cloud tokens immediately unless you click Revoke Sessions!',
      'Preserve business emails/files safely before ever removing licenses.',
    ],
    explanation:
      'HOW & WHY: Secure offboarding disables the account, revokes active Entra/VPN sessions, converts the mailbox to Shared (preserving mail without paying a license) per HR/legal policy, and tracks asset recovery via Intune.',
  },
  {
    id: 'it-m32',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Service Accounts & Password Rotation Risk',
    prompt: 'Why should an IT team NEVER run critical scheduled tasks, backups, or printers using an individual employee’s personal Active Directory login account?',
    options: [
      'When that employee changes their password or leaves the company and gets disabled, every critical backup and service silently breaks.',
      'Personal accounts cannot authenticate over TCP/IP.',
      'Active Directory limits personal accounts to 1 login per week.',
      'Service accounts cannot belong to groups.',
    ],
    correctIndices: [0],
    hints: [
      'Think about what happens 6 months later when "jdoe" resigns!',
      'Use dedicated Least-Privilege Service Accounts (or Group Managed Service Accounts — gMSA).',
    ],
    explanation:
      'HOW & WHY: Tying services or SMTP relays to a human user’s credentials guarantees an outage the day they rotate their password or leave. Dedicated service accounts (ideally password-auto-rotating gMSAs) isolate services cleanly.',
  },
  {
    id: 'it-m33',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'Tracert Hop Loss vs. End-to-End Loss',
    prompt: 'Running "tracert 8.8.8.8" shows "* * * Request timed out" at Hop 4, yet Hops 5 through 9 complete cleanly with 18 ms latency and "ping 8.8.8.8" succeeds with 0% loss. Is Hop 4 broken?',
    options: [
      'No—Hop 4’s router simply deprioritizes or drops ICMP TTL-Exceeded control-plane replies while forwarding transit packets normally.',
      'Yes—100% of traffic is dropping at Hop 4.',
      'Yes—your laptop NIC needs replacement.',
      'No—Hop 4 means DNS failed.',
    ],
    correctIndices: [0],
    hints: [
      'Look at Hops 5–9 AND final ping 8.8.8.8: 0% packet loss!',
      'ISP core routers commonly rate-limit generating ICMP Time Exceeded messages to protect their CPU.',
    ],
    explanation:
      'HOW & WHY: A single `* * *` hop in traceroute followed by healthy downstream hops and 0% end-to-end loss is normal router control-plane rate-limiting (ICMP deprioritization), NOT packet loss! True packet loss persists across all subsequent hops to the destination.',
  },
  {
    id: 'it-m34',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'Wi-Fi Driver / Profile Corruption Reset',
    prompt: 'A Windows laptop shows "Can’t connect to this network" on the corporate SSID right after a RADIUS certificate update, while nearby laptops connect fine. What quick Wi-Fi profile fix clears cached stale auth credentials on Windows?',
    options: [
      'Forget the corporate SSID ("netsh wlan delete profile name=<SSID>"), reconnect freshly (or run gpupdate /force), and test.',
      'Change the laptop’s hostname to "Router".',
      'Uninstall Microsoft Excel.',
      'Disable BitLocker.',
    ],
    correctIndices: [0],
    hints: [
      'Windows caches old EAP/PEAP server thumbprints and cached credentials inside the saved WLAN profile!',
      '"Forget" the network in Wi-Fi settings and reconnect cleanly.',
    ],
    explanation:
      'HOW & WHY: Forgetting a saved Wi-Fi profile (`netsh wlan delete profile`) clears stale cached 802.1X user credentials or outdated RADIUS certificate selections so the laptop negotiates a fresh connection.',
  },
  {
    id: 'it-m35',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'PowerShell Pipeline Filtering',
    prompt: 'In PowerShell, you want to find ONLY stopped Windows services whose name starts with "spool" or "wua". What does the pipeline symbol "|" accomplish in "Get-Service | Where-Object {$_.Status -eq \'Stopped\'}"?',
    options: [
      'It passes live structured .NET service objects from Get-Service directly into Where-Object for accurate filtering without fragile text parsing.',
      'It saves the output to a printer.',
      'It restarts all services automatically.',
      'It runs the command on Linux only.',
    ],
    correctIndices: [0],
    hints: [
      'Unlike plain text pipes in CMD, PowerShell passes full objects with properties like .Status and .Name!',
      '"$_" represents the current object flowing through the pipe.',
    ],
    explanation:
      'HOW & WHY: PowerShell’s object pipeline passes structured objects (not raw strings) between cmdlets, making filtering (`Where-Object`), sorting (`Sort-Object`), and exporting (`Export-Csv`) reliable and exact.',
  },
  {
    id: 'it-m36',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'Exchange Quarantine vs. Junk Mail',
    prompt: 'A user cannot find an important external PDF contract in Inbox or Junk Email, and Message Trace shows "Quarantined by Microsoft Defender for Office 365 (High Confidence Phish/Malware)". Can the user release High Confidence Malware themselves?',
    options: [
      'No—by default only IT/Security Admins can inspect and release (or reject) Defender Quarantine holds after verifying the attachment is genuinely safe.',
      'Yes—it moves automatically to Inbox after 5 minutes.',
      'Yes—running ipconfig /flushdns releases quarantined emails.',
      'Yes—restarting Outlook bypasses Defender.',
    ],
    correctIndices: [0],
    hints: [
      'Standard Junk Email goes to the user’s Junk folder; high-risk threats are held centrally in Defender Quarantine.',
      'Admins must verify it isn’t actually malware/phishing before releasing!',
    ],
    explanation:
      'HOW & WHY: Microsoft Defender Quarantine intercepts suspicious attachments and high-confidence phishing before reaching the mailbox. Tier 1/SecOps inspect the message headers/payload in the Defender portal before releasing verified false positives.',
  },
  {
    id: 'it-h21-scen',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Windows Boot BCD / EFI Repair',
    prompt:
      'Scenario: After an unexpected power outage during a feature update, a desktop PC fails to boot Windows and displays "Boot Configuration Data (BCD) file is missing or contains errors (0xc000000f)". Booting from a Windows Recovery USB opens Command Prompt. Which repair sequence rebuilds the boot records without wiping user files?',
    options: [
      'Run "bootrec /fixmbr", "bootrec /fixboot", and "bootrec /rebuildbcd" (or "bcdboot C:\\Windows" for UEFI systems).',
      'Run "diskpart -> clean" (which wipes the entire drive!).',
      'Run "ipconfig /release".',
      'Swap the HDMI cable to DisplayPort.',
    ],
    correctIndices: [0],
    hints: [
      'NEVER run "diskpart clean" unless you want to erase all user data!',
      'Think Boot Configuration Data recovery tools in WinRE.',
    ],
    explanation:
      'HOW & WHY: `bootrec /rebuildbcd` (and `bcdboot C:\\Windows` on UEFI GPT disks) repairs damaged Windows Boot Manager pointers cleanly while keeping OS and user files intact—whereas `diskpart clean` destroys the partition table.',
  },
  {
    id: 'it-h22-scen',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: VPN Split-Tunnel vs. Full-Tunnel Routing Conflict',
    prompt:
      'Scenario: An employee at home uses local subnet 192.168.1.0/24 from their ISP router. When they connect to a remote branch printer subnet that ALSO happens to use 192.168.1.0/24 over VPN, packets never cross the VPN tunnel! Running "route print" shows local Wi-Fi 192.168.1.0/24 has a lower metric/on-link route than the VPN. Why?',
    options: [
      'IP subnet overlap (RFC 1918 collision): both the user’s home LAN and the corporate subnet use 192.168.1.0/24, so Windows routes 192.168.1.x locally onto home Wi-Fi instead of into the VPN tunnel.',
      'VPNs cannot carry TCP port 9100.',
      'The home router blocked DNS.',
      'Windows requires IPv6 to use 192.168.1.0/24.',
    ],
    correctIndices: [0],
    hints: [
      'Home routers almost always default to 192.168.1.0/24 or 192.168.0.0/24!',
      'Directly connected local Wi-Fi subnets beat remote VPN routes for the exact same prefix.',
    ],
    explanation:
      'HOW & WHY: One of the classic remote-work support traps: RFC 1918 subnet overlap between a home ISP router (192.168.1.0/24) and a corporate VLAN (192.168.1.0/24). Windows treats 192.168.1.x as directly connected on Wi-Fi and never sends it over VPN—solved long-term by numbering corporate subnets in 10.x.x.x/172.16-31.x.x or changing the home router LAN.',
  },
  {
    id: 'it-h23-scen',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: LAPS (Local Administrator Password Solution)',
    prompt:
      'Scenario: A field technician needs the local Administrator password on a single offline laptop to repair a broken VPN client, without using a shared universal password across 1,000 company laptops. Which Microsoft enterprise feature stores a unique, auto-rotated local admin password per machine inside AD / Entra ID?',
    options: [
      'Windows LAPS (Local Administrator Password Solution)',
      'Universal hardcoded BIOS password',
      'Enabling the Guest account',
      'Disabling BitLocker',
    ],
    correctIndices: [0],
    hints: [
      'Sharing one identical local admin password across 1,000 PCs lets ransomware move laterally everywhere!',
      'This 4-letter Microsoft solution rotates a unique random local admin password per workstation.',
    ],
    explanation:
      'HOW & WHY: Windows LAPS gives every workstation its own unique, periodically rotated local Administrator password stored securely in AD or Entra ID (with RBAC auditing)—so compromising one laptop never unlocks the rest of the fleet.',
  },
  {
    id: 'it-h24-scen',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: PowerShell Bulk Diagnostic Script Output',
    prompt:
      'Scenario: An IT Support admin runs a PowerShell triage check across 10 servers:\n`Get-Content servers.txt | ForEach-Object { Test-NetConnection $_ -Port 3389 -InformationLevel Quiet }`\nWhat will this pipeline output for each server, and what does it verify?',
    options: [
      'It outputs True or False per server, testing whether TCP port 3389 (RDP) is accepting connections on each host.',
      'It reboots all 10 servers immediately.',
      'It resets RDP passwords on all 10 servers.',
      'It deletes servers.txt.',
    ],
    correctIndices: [0],
    hints: [
      '`-InformationLevel Quiet` suppresses verbose banner text and returns a clean boolean (`True`/`False`)!',
      'Port 3389 = Windows Remote Desktop (RDP).',
    ],
    explanation:
      'HOW & WHY: Piping a server list into `Test-NetConnection $_ -Port 3389 -InformationLevel Quiet` checks RDP TCP reachability across dozens of servers in seconds, returning clean `True`/`False` boolean health results.',
  },
  {
    id: 'it-h25-sim',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: APIPA + Switchport Diagnostic',
    prompt:
      'A desktop workstation in Room 204 lost access to all internal servers and the Internet after someone plugged a different wall jack in. Inspect all three tabs to diagnose the exact fault.',
    exhibitTabs: [
      {
        title: 'PC: ipconfig /all',
        output: `Ethernet adapter Ethernet0:\n   Media State . . . . . . . . . . . : Connected\n   DHCP Enabled. . . . . . . . . . . : Yes\n   Autoconfiguration IPv4 Address. . : 169.254.41.109\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . :`,
      },
      {
        title: 'PC: ping & arp',
        output: `C:\\> ping 10.20.4.1\nPING: transmit failed. General failure.\n\nC:\\> arp -a\nNo ARP Entries Found.`,
      },
      {
        title: 'Tier 1 Physical Note',
        output: `Green link LED is lit on PC NIC.\nNeighboring PC in Room 204 (wall jack 204-A) has IP 10.20.4.35/24 and works normally.\nThis PC moved to unmarked wall jack 204-D.`,
      },
    ],
    options: [
      'The PC has Layer 1 physical link (green LED) and DHCP enabled, yet fell back to APIPA (169.254.41.109) after moving to wall jack 204-D; escalate to Networking with jack ID 204-D to check VLAN/Port-Security/DHCP Snooping or patch connection on that port.',
      'DNS cache needs flushing on the PC.',
      '169.254.41.109 is a valid corporate VLAN.',
      'Reinstall Microsoft Office.',
    ],
    correctIndices: [0],
    hints: [
      'Notice: Media State is Connected + Link LED is green (so Layer 1 is NOT unplugged!), AND 169.254.x.x = APIPA (DHCP Discover failed!).',
      'What changed? The PC moved to unmarked wall jack 204-D!',
    ],
    explanation:
      'HOW & WHY: Media Connected + green LED proves Layer 1 link exists, while 169.254.x.x proves DHCP Discover never received an Offer—and moving to unmarked jack 204-D correlates directly (often an unconfigured/wrong VLAN, err-disabled Port-Security, or 802.1X quarantine port). Escalating with jack ID 204-D and PC MAC gives Networking everything needed.',
  },
  // Adding 28 more targeted Easy/Medium/Hard questions to exceed 120 IT Support questions (total 125!)
  {
    id: 'it-e35',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Windows Snipping Tool & Error Screenshots',
    prompt: 'What built-in Windows shortcut lets a user capture a clean screenshot of an error dialog box to attach to their help desk ticket?',
    options: ['Win + Shift + S', 'Ctrl + Z', 'Win + D', 'Alt + Tab'],
    correctIndices: [0],
    hints: [
      'Opens the modern Snip & Sketch / Snipping Tool overlay cleanly.',
      'Copies the selected region straight to clipboard so they can Ctrl+V into chat or email!',
    ],
    explanation:
      'HOW & WHY: Guiding non-technical users with `Win + Shift + S` captures crisp screenshots of exact error codes in seconds instead of blurry phone photos.',
  },
  {
    id: 'it-e36',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Ticket Categorization & Routing',
    prompt: 'Why is accurately selecting Ticket Category and Subcategory (e.g., Network -> VPN -> Split-Tunnel DNS) valuable beyond just routing the single ticket?',
    options: [
      'Accurate categorization powers management trend reporting so IT can spot top recurring pain points and fund permanent fixes or self-service automation.',
      'It boosts laptop CPU frequency.',
      'It automatically resets passwords.',
      'It hides SLA timers.',
    ],
    correctIndices: [0],
    hints: [
      'Think quarterly IT leadership reviews: how do they know 40% of calls came from VPN or Printers?',
      'Data-driven continuous service improvement relies on clean ticket tagging.',
    ],
    explanation:
      'HOW & WHY: Clean ticket categorization exposes systemic trends (e.g., 300 VPN tickets/month), justifying infrastructure upgrades, KB guides, and automation investments.',
  },
  {
    id: 'it-e37',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Password Expiration vs. Account Expiration',
    prompt: 'In ADUC, a contractor says they can no longer sign in today even though they remember their password and aren’t locked out. Inspecting the Account tab shows "Account expires: End of yesterday". What is the difference between Password Expired and Account Expires?',
    options: [
      'Password Expired prompts the user to pick a new password; Account Expires permanently blocks all sign-ins after a contractor’s end date until extended by authorized HR/manager request.',
      'Both mean the exact same thing.',
      'Account Expires locks out only Wi-Fi.',
      'Password Expired deletes the mailbox.',
    ],
    correctIndices: [0],
    hints: [
      'Contractors and interns get an Account Expiration date matching their contract end date!',
      'Never extend an expired contractor account without verifying manager/HR extension approval.',
    ],
    explanation:
      'HOW & WHY: Contractor/temp accounts routinely carry an AD Account Expiration date. Once passed, logins fail until HR or the sponsoring manager formally approves a contract extension.',
  },
  {
    id: 'it-e38',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'DHCP Release vs. Renew',
    prompt: 'Which two Windows commands drop a workstation’s stale IPv4 lease and immediately request a fresh lease from the DHCP server?',
    options: [
      'ipconfig /release followed by ipconfig /renew',
      'ipconfig /flushdns followed by sfc /scannow',
      'ping 127.0.0.1 followed by arp -a',
      'net stop spooler followed by net start spooler',
    ],
    correctIndices: [0],
    hints: [
      'Think "let go of old IP" -> "ask DHCP for a new IP".',
      'Useful right after a switchport VLAN change or DHCP scope update!',
    ],
    explanation:
      'HOW & WHY: `ipconfig /release` sends a DHCP Release clearing the current IPv4 binding, and `ipconfig /renew` initiates a fresh DHCP request so the client picks up updated subnet/gateway/DNS options.',
  },
  {
    id: 'it-e39',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'M365 Recycle Bin Recovery',
    prompt: 'A user accidentally deleted an important SharePoint/OneDrive spreadsheet yesterday and cleared it from their Windows Desktop. Where can IT/the user check first for self-service recovery?',
    options: [
      'OneDrive / SharePoint Web Recycle Bin (and Second-Stage Recycle Bin, which retains deleted items up to 93 days by default)',
      'Windows Event Viewer',
      'Device Manager',
      'BIOS Setup',
    ],
    correctIndices: [0],
    hints: [
      'Cloud storage keeps two layers of Recycle Bin safety nets!',
      '93-day retention from initial deletion.',
    ],
    explanation:
      'HOW & WHY: OneDrive and SharePoint retain deleted files in the First-Stage and Second-Stage Recycle Bins for 93 days by default—and Version History lets users roll back corrupted or overwritten spreadsheets in seconds.',
  },
  {
    id: 'it-m37',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'Windows Registry vs. Control Panel Caution',
    prompt: 'Before modifying a key in Windows Registry Editor (`regedit.exe`) to fix a broken Outlook or TEMP profile issue, what mandatory safety step prevents turning a minor bug into an unbootable OS?',
    options: [
      'Right-click the target registry branch and select "Export" to save a `.reg` backup file (and/or create a System Restore point) before editing.',
      'Delete HKEY_LOCAL_MACHINE first.',
      'Turn off the PC mid-edit.',
      'Disable BitLocker.',
    ],
    correctIndices: [0],
    hints: [
      'Registry edits apply live with ZERO "Undo" button!',
      'Exporting the specific branch lets you double-click to restore it instantly if needed.',
    ],
    explanation:
      'HOW & WHY: Registry edits take effect immediately without a save prompt. Always export the target registry key to a `.reg` backup first so any mistake can be reverted cleanly.',
  },
  {
    id: 'it-m38',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'Remote Support Privacy & Consent',
    prompt: 'Before initiating a screen-share or remote-control session (TeamViewer, Quick Assist, Intune Remote Help) onto an employee’s laptop, what etiquette and compliance rule must Tier 1 follow?',
    options: [
      'Obtain explicit user permission first, announce when taking control, and ask the user to close/minimize confidential HR, payroll, or personal windows before connecting.',
      'Connect silently whenever you want without telling the user.',
      'Record their personal banking passwords.',
      'Leave the remote session open overnight.',
    ],
    correctIndices: [0],
    hints: [
      'Corporate compliance and user trust require transparent consent before viewing someone’s screen.',
      'Verbal or chat confirmation + privacy reminder protects both user and technician.',
    ],
    explanation:
      'HOW & WHY: Unannounced remote takeovers violate privacy policies and startle users. Always get explicit consent, ask them to close sensitive windows, and state clearly before moving their mouse.',
  },
  {
    id: 'it-m39',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'UPN vs. sAMAccountName Login Formats',
    prompt: 'An employee tries signing into Microsoft 365 using "CORP\\jdoe" (legacy pre-Windows 2000 domain\\username), and Entra ID rejects it. Which modern login format should they enter for M365 and Entra SSO?',
    options: [
      'Their User Principal Name (UPN), formatted like an email address (e.g., jdoe@corp.com)',
      'Their laptop MAC address',
      'Their local IPv4 address',
      'Their printer serial number',
    ],
    correctIndices: [0],
    hints: [
      'Legacy on-prem apps used DOMAIN\\user (sAMAccountName); cloud SSO expects user@domain.com!',
      'Called UPN (User Principal Name).',
    ],
    explanation:
      'HOW & WHY: On-premises Windows supports `DOMAIN\\sAMAccountName` (`CORP\\jdoe`), whereas cloud Entra ID / M365 / SAML SSO require the User Principal Name (`jdoe@corp.com`).',
  },
  {
    id: 'it-m40',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'SMB Share Access vs. Firewall Blocks',
    prompt: 'A user on corporate Wi-Fi can ping file server `files01.corp` by name and IP, yet `\\\\files01.corp\\Data` hangs and times out. What two network/service checks isolate the SMB failure?',
    multiSelect: true,
    options: [
      'Test TCP port 445 reachability (`Test-NetConnection files01.corp -Port 445`) to rule out firewall/ACL blocks',
      'Verify the "Server" service (`LanmanServer`) on files01 and "Workstation" service (`LanmanWorkstation`) on the client are running',
      'Check the user’s screen brightness',
      'Clear Chrome browser cookies',
    ],
    correctIndices: [0, 1],
    hints: [
      'Windows file sharing (SMB) runs over TCP 445 and depends on Workstation/Server Windows services.',
      'Ping only tests ICMP, NOT TCP 445!',
    ],
    explanation:
      'HOW & WHY: Ping only confirms ICMP reachability. SMB share failures when ping works point directly to TCP 445 firewall/ACL blocking or stopped Workstation/Server Windows services.',
  },
  {
    id: 'it-m41',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'AutoDiscover & Outlook Profile Recreation',
    prompt: 'After migrating a user’s mailbox or repairing stubborn Outlook authentication loops, why does creating a brand-new Outlook Mail Profile (via Control Panel -> Mail -> Show Profiles) often fix the app cleanly without losing server emails?',
    options: [
      'Exchange Online stores all mail/calendar/contacts in the cloud; creating a fresh Outlook profile forces clean AutoDiscover, OAuth token refresh, and a fresh local OST cache.',
      'Creating a new profile deletes all cloud emails.',
      'Mail profiles upgrade the laptop CPU.',
      'It disables MFA.',
    ],
    correctIndices: [0],
    hints: [
      'Outlook caches stale Exchange endpoint URLs and MAPI tokens inside the local Windows Outlook profile!',
      'Because Exchange is server-hosted, rebuilding the local profile/OST re-downloads mail cleanly.',
    ],
    explanation:
      'HOW & WHY: Recreating a fresh Outlook profile in `mlcfg32.cpl` (Control Panel -> Mail) leaves the cloud mailbox untouched while resetting corrupted MAPI/AutoDiscover settings and generating a clean `.ost` cache (just back up any local-only `.pst` archives first).',
  },
  {
    id: 'it-h26-scen',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: OAuth App Consent Phishing (Illicit Consent Grant)',
    prompt:
      'Scenario: A user receives an email inviting them to view a shared document via a third-party app called "DocuSign-Viewer-Pro". Instead of asking for a password, Microsoft shows an authentic Entra ID permissions screen requesting "Read and write your mail and access files on your behalf", and the user clicks "Accept". Even after resetting their password, an attacker still reads their emails! Why?',
    options: [
      'Illicit Consent Grant: the user authorized a malicious third-party OAuth Enterprise Application token in Entra ID that accesses Mail/Files via Microsoft Graph API independently of the user’s password; an admin must revoke the rogue Enterprise Application consent/permissions in Entra ID.',
      'The user’s Ethernet cable is leaking packets.',
      'Windows Fast Startup cached the PDF.',
      'Changing passwords automatically revokes third-party Graph API app permissions.',
    ],
    correctIndices: [0],
    hints: [
      'Notice the user didn’t type their password into a fake page—they clicked "Accept" on a real Microsoft OAuth permissions prompt!',
      'OAuth refresh tokens granted to Enterprise Apps survive password resets!',
    ],
    explanation:
      'HOW & WHY: In an Illicit Consent Grant attack, the victim authorizes a malicious OAuth app to read Mail/OneDrive via Graph API tokens—completely bypassing passwords and MFA afterward! Containment requires deleting/revoking the rogue Enterprise Application permission in Entra ID alongside revoking user sessions.',
  },
  {
    id: 'it-h27-scen',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Escalating vs. Owning Complex Tickets',
    prompt:
      'Scenario: A Tier 1 technician has spent 45 minutes troubleshooting a single user’s complex intermittent SQL ODBC driver crash while 8 other P2/P3 tickets sit untouched in the queue. What ITSM escalation guideline applies?',
    options: [
      'Follow the Service Desk time-box rule (typically 15–20 minutes on complex Tier 1 investigation): document all diagnostic findings cleanly and escalate to Tier 2 Application Support so queue SLAs stay healthy.',
      'Spend 4 more hours on the single ticket and ignore the 8 waiting users.',
      'Assign all 8 waiting tickets to random closed queues.',
      'Reboot the SQL database server without telling anyone.',
    ],
    correctIndices: [0],
    hints: [
      'Tier 1’s superpower is fast triage + solving common issues, not spending half a shift stuck on one Tier 2 app bug while the queue burns.',
      'Time-boxing + high-quality handoff notes keeps the whole desk effective.',
    ],
    explanation:
      'HOW & WHY: Time-boxing Tier 1 troubleshooting (usually 15–20 minutes) prevents a single obscure defect from starving the rest of the queue. Escalate with complete error logs, steps tried, and affected app versions so Tier 2 resolves it quickly.',
  },
  {
    id: 'it-h28-scen',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Outlook PST / Archive Corruption & Scanpst',
    prompt:
      'Scenario: A long-tenured legal employee keeps 18 GB of archived local emails inside a legacy `archive2019.pst` file stored on a network shared drive (`\\\\files01\\Home`). Outlook hangs constantly and throws "Errors have been detected in file archive2019.pst." What caused the corruption and how do you repair it?',
    options: [
      'Storing live `.pst` files over SMB network shares causes lock/latency corruption (unsupported by Microsoft); copy the `.pst` locally, run Inbox Repair Tool (`SCANPST.EXE`), and migrate old mail into Exchange Online In-Place Archive.',
      'PST files over 10 MB always self-destruct.',
      'Flush DNS to repair the PST.',
      'Enable Windows Fast Startup.',
    ],
    correctIndices: [0],
    hints: [
      'Microsoft explicitly warns against opening live `.pst` files over a WAN/LAN SMB share!',
      'Outlook ships with a built-in `.pst` repair utility (`SCANPST.EXE`).',
    ],
    explanation:
      'HOW & WHY: Concurrent SMB file locking and brief Wi-Fi/network drops corrupt live `.pst` files stored on network shares. Back up the `.pst` to local SSD, repair errors using `SCANPST.EXE`, and move archival mail into Exchange Online In-Place Archive.',
  },
  {
    id: 'it-h29-scen',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: IPv6 DNS Preference Breaking Legacy Local App',
    prompt:
      'Scenario: A workstation has IPv6 enabled on its NIC while the local office router provides only IPv4 DHCP. An internal web app (`billing.corp.local`) fails to load in browsers until IPv4 is forced, and `ping billing.corp.local` resolves to `::1` or an unreachable IPv6 AAAA record registered accidentally in AD DNS. What happened?',
    options: [
      'Windows prefers IPv6 (AAAA records) over IPv4 (A records) by default; a stale or wrong AAAA record in DNS made the PC try unreachable IPv6 instead of the working IPv4 A record.',
      'IPv4 addresses expired globally.',
      'Browsers cannot parse ".local" domains.',
      'The Print Spooler hijacked port 80.',
    ],
    correctIndices: [0],
    hints: [
      'Look at what `ping billing.corp.local` returned: `::1` or an IPv6 address!',
      'Modern OSes try AAAA (IPv6) ahead of A (IPv4) whenever DNS returns an IPv6 record.',
    ],
    explanation:
      'HOW & WHY: Windows prefers IPv6 over IPv4 by RFC 6724. If internal AD DNS holds a stale or loopback AAAA record (`ping -4` works while plain `ping` hits IPv6), clean up the bad AAAA record on the DNS server so clients resolve the valid IPv4 A record.',
  },
  {
    id: 'it-h30-scen',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Orphaned SID vs. Recreated User Account',
    prompt:
      'Scenario: A returning contractor re-joins the company. Instead of re-enabling their previous disabled AD account, an intern deletes the old AD object and creates a brand-new user with the exact same username `mross`. Suddenly `mross` gets "Access Denied" on all their old personal NTFS folders even though the username looks identical! Why?',
    options: [
      'Windows security identifies accounts by their unique Security Identifier (SID), NOT by username text; deleting and recreating `mross` generated a brand-new SID that doesn’t match the old folder ACLs.',
      'Usernames cannot contain 5 letters.',
      'ADUC takes 30 days to recognize new users.',
      'NTFS permissions expire every Friday.',
    ],
    correctIndices: [0],
    hints: [
      'Under the hood, NTFS ACLs and AD groups never store "mross"—they store `S-1-5-21-...`!',
      'Deleting an account destroys its SID forever (unless restored from AD Recycle Bin).',
    ],
    explanation:
      'HOW & WHY: Windows stores immutable Security Identifiers (SIDs) inside NTFS ACLs and group memberships. Recreating an account with the same name creates a brand-new SID—which is why orgs disable accounts on leave and re-enable (rather than delete/recreate) returning staff.',
  },
  // Adding 15 more balanced IT Support questions so total is 125+!
  {
    id: 'it-e40',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'External Monitor Display Projection Modes',
    prompt: 'A presenter plugs in a projector via HDMI and wants to show slides on the projector while keeping speaker notes private on their laptop screen. Which Windows shortcut switches between Duplicate and Extend display modes?',
    options: ['Win + P', 'Win + L', 'Ctrl + C', 'Alt + F4'],
    correctIndices: [0],
    hints: [
      '"P" stands for Project!',
      'Lets you toggle PC screen only, Duplicate, Extend, and Second screen only.',
    ],
    explanation:
      'HOW & WHY: `Win + P` opens Windows Project settings immediately—choosing "Extend" turns the projector into a separate second display for PowerPoint Presenter View.',
  },
  {
    id: 'it-e41',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Plain-Language User Instructions',
    prompt: 'When emailing a non-technical employee steps to restart their router or clear Outlook cache, which writing style works best?',
    options: [
      'Short numbered steps using plain English and exact button names (avoiding unexplained acronyms like DNS/Kerberos/OST).',
      'A dense 4-paragraph engineering essay full of hex codes.',
      'Only writing "Reboot NIC and purge TGT."',
      'Sending zero instructions and closing the ticket.',
    ],
    correctIndices: [0],
    hints: [
      'Match technical depth to your audience: internal Tier 2 notes use CLI details; user emails use crisp step-by-step actions!',
      'Numbered lists reduce back-and-forth replies.',
    ],
    explanation:
      'HOW & WHY: Clear, jargon-free numbered steps let non-technical users follow instructions accurately on the first try, cutting resolution time and improving CSAT scores.',
  },
  {
    id: 'it-e42',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Password Complexity & Passphrases',
    prompt: 'Why do modern NIST and Microsoft Entra password guidelines recommend long passphrases (e.g., 14+ characters) paired with MFA over short 8-character passwords rotated every 30 days?',
    options: [
      'Forced 30-day rotation leads to predictable patterns ("Spring2026!"), whereas longer passphrases + MFA dramatically increase brute-force resistance.',
      'Short 8-character passwords cannot include numbers.',
      'Active Directory stops supporting passwords over 8 chars.',
      '30-day rotation disables Kerberos.',
    ],
    correctIndices: [0],
    hints: [
      'Think about how users behave when forced to invent a new password every month ("Summer1!" -> "Summer2!").',
      'Length + banned-password lists + MFA beat frequent arbitrary expiry.',
    ],
    explanation:
      'HOW & WHY: NIST SP 800-63B and Microsoft found frequent forced rotation produces weak predictable sequences. Longer passphrases, leaked-password filtering, and MFA provide vastly stronger protection.',
  },
  {
    id: 'it-e43',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'Ethernet Cable Categories',
    prompt: 'What is the maximum standard copper cable run length (including patch cords) for 1000BASE-T Gigabit Ethernet over Cat5e/Cat6?',
    options: ['10 meters', '100 meters (328 feet)', '1,000 meters', '5 kilometers'],
    correctIndices: [1],
    hints: [
      'Standard horizontal structured cabling spec across TIA/EIA-568.',
      '90 m permanent wall run + 10 m patch cords = 100 m.',
    ],
    explanation:
      'HOW & WHY: Twisted-pair copper Ethernet (Cat5e/Cat6/Cat6A) supports a maximum channel length of 100 meters (328 feet); longer runs require fiber or intermediate IDF switches.',
  },
  {
    id: 'it-e44',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'Teams Cache Clear Fix',
    prompt: 'A user’s Microsoft Teams displays outdated profile photos, fails to load calendar tabs, or crashes repeatedly after an update while Teams Web works fine. What common local fix resolves client glitches?',
    options: [
      'Quit Teams completely from the system tray, clear the local Teams cache folder (or Reset app in Windows Installed Apps -> Teams -> Repair/Reset), and relaunch.',
      'Delete their Entra ID user account.',
      'Disable BitLocker.',
      'Format the USB-C dock.',
    ],
    correctIndices: [0],
    hints: [
      'Electron/WebView2 desktop apps frequently cache corrupt UI tokens locally.',
      'Windows Settings -> Apps -> Microsoft Teams -> Advanced options -> Reset cleans local app cache cleanly.',
    ],
    explanation:
      'HOW & WHY: When Teams Web works cleanly while Desktop Teams freezes or shows stale state, quitting Teams completely and clearing/resetting the local Teams cache restores normal behavior in 2 minutes.',
  },
  {
    id: 'it-m42',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    topic: 'NVMe / SSD SMART Health Triage',
    prompt: 'A 3-year-old laptop slows to a crawl, freezes for 20 seconds at a time, and Event Viewer -> System logs repeated "The device, \\Device\\Harddisk0\\DR0, has a bad block" and "Reset to device, \\Device\\RaidPort0, was issued." What is failing?',
    options: [
      'The SSD/NVMe storage drive (or controller) is physically failing—back up unsynced local data to OneDrive/network immediately and schedule hardware replacement.',
      'The user needs a new browser theme.',
      'Print Spooler crashed.',
      'A Group Policy needs gpupdate.',
    ],
    correctIndices: [0],
    hints: [
      'Repeated "bad block" + "Disk" / "RaidPort0 reset" errors in System Event Viewer are urgent warning signs!',
      'Data backup FIRST before running heavy disk scans that might push a dying SSD over the edge!',
    ],
    explanation:
      'HOW & WHY: Bad block and storage reset events in System logs signal imminent SSD/NVMe failure. Immediately secure unsynced local files (OneDrive/backup) before running `chkdsk` or replacing the drive.',
  },
  {
    id: 'it-m43',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'Post-Incident Review (Blameless Postmortem)',
    prompt: 'After a P1 outage caused by an engineer accidentally pushing a bad firewall script is resolved, what is the goal of a Blameless Post-Incident Review (PIR)?',
    options: [
      'Understand the timeline, identify missing safeguards/peer checks/automation tests, and improve systems so no human error can trigger an outage again—without scapegoating.',
      'Publicly shame the engineer in a company newsletter.',
      'Hide the root cause from stakeholders.',
      'Delete all monitoring alerts.',
    ],
    correctIndices: [0],
    hints: [
      'Blameless postmortems encourage honest reporting so teams actually fix systemic guardrails.',
      'Focus on process/tooling gaps rather than punishing individuals.',
    ],
    explanation:
      'HOW & WHY: Blameless postmortems examine why existing peer review, staging tests, or guardrails allowed a human typo to cause an outage, turning mistakes into stronger engineering controls.',
  },
  {
    id: 'it-m44',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Local Administrator vs. Domain Admin Blast Radius',
    prompt: 'Why should Tier 1 IT Support technicians NEVER sign into compromised/infected user workstations using a Domain Admin account?',
    options: [
      'Signing into an infected PC caches Domain Admin credentials/Kerberos TGTs in LSASS memory on that machine, allowing attackers to dump them and compromise the entire Active Directory domain!',
      'Domain Admins cannot open Task Manager.',
      'Local PCs reject Domain Admin logins.',
      'Domain Admin logins disable antivirus automatically.',
    ],
    correctIndices: [0],
    hints: [
      'Credential-dumping tools like Mimikatz extract cached Kerberos tickets and hashes from workstation memory (LSASS)!',
      'Always use tiered workstation-admin accounts (NEVER Domain Admin) on endpoints.',
    ],
    explanation:
      'HOW & WHY: Tiered Administration prohibits Domain Admins from ever logging onto user workstations or member servers. Using a Domain Admin on an infected laptop exposes domain-wide keys in memory; use LAPS or scoped Workstation Admin accounts instead.',
  },
  {
    id: 'it-m45',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'medium',
    topic: 'Wi-Fi Band Steering & Roaming Drops',
    prompt: 'A user walking between conference rooms complains their Teams voice call drops for 5 seconds every time they walk down the hall while their laptop clings weakly to the distant AP. Which client Wi-Fi driver setting helps laptops roam sooner?',
    options: [
      'Adjusting "Roaming Aggressiveness" from Lowest to Medium-High in the Wi-Fi adapter Advanced Driver Properties (plus ensuring overlapping 5 GHz cell coverage).',
      'Setting static IP 169.254.1.1.',
      'Disabling DNS Client service.',
      'Running sfc /scannow.',
    ],
    correctIndices: [0],
    hints: [
      'Laptops, not APs, decide when to roam ("sticky client" problem)!',
      'Look inside Device Manager -> Wi-Fi Adapter -> Advanced tab.',
    ],
    explanation:
      'HOW & WHY: Clients decide when to roam between APs. Sticky Wi-Fi drivers hold onto a -82 dBm distant AP until packets drop; raising Roaming Aggressiveness (alongside proper AP minimum data rates) triggers smooth early handoffs.',
  },
  {
    id: 'it-m46',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'PowerShell Get-WinEvent Querying Security/System Logs',
    prompt: 'Which modern PowerShell cmdlet efficiently filters Windows Event Logs (System, Application, Security) remotely or locally using FilterHashtable?',
    options: ['Get-WinEvent', 'Get-NetAdapter', 'ipconfig /all', 'Format-Disk'],
    correctIndices: [0],
    hints: [
      'Replaces the older slower `Get-EventLog` cmdlet and accesses modern Applications & Services logs too!',
      'Starts with `Get-Win...`.',
    ],
    explanation:
      'HOW & WHY: `Get-WinEvent -FilterHashtable @{LogName="Security"; ID=4740}` queries Windows Event Logs rapidly (including modern Microsoft-Windows-* operational logs) far faster than legacy `Get-EventLog`.',
  },
  {
    id: 'it-h31-scen',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Intune Compliance Grace Period & App Protection',
    prompt:
      'Scenario: A user ignored Intune Company Portal warnings for 14 days to install a critical Windows OS security patch. This morning, Outlook and Teams on their laptop stopped signing in because Conditional Access marks the device "Non-Compliant". What is the cleanest fix?',
    options: [
      'Have the user install all pending Windows Updates, reboot, open Company Portal -> Settings -> "Sync" (Check status), and wait 5–15 minutes for Intune to recalculate device compliance.',
      'Disable Conditional Access for the entire company.',
      'Issue them a second Active Directory username.',
      'Uninstall Company Portal.',
    ],
    correctIndices: [0],
    hints: [
      'Why was the device marked Non-Compliant? Missing critical OS patch past the 14-day grace period!',
      'Once patched, triggering a Company Portal sync updates Entra ID immediately.',
    ],
    explanation:
      'HOW & WHY: Intune Device Compliance enforces minimum OS patch levels before Conditional Access issues cloud tokens. Installing pending OS updates, rebooting, and clicking "Check Status / Sync" in Intune Company Portal restores compliance cleanly without lowering security.',
  },
  {
    id: 'it-h32-scen',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: USB-C Dock MAC Pass-Through & Static IP Conflict',
    prompt:
      'Scenario: A hot-desking floor shares 10 USB-C docks across 40 employees. Every time two different Dell laptops plug into Dock #4 sequentially, the DHCP scope shows strange MAC conflicts or NAC port-security violations unless MAC Pass-Through is enabled. What does BIOS "MAC Address Pass-Through" solve?',
    options: [
      'It forces the shared USB-C dock to present the laptop’s unique internal system MAC address instead of the dock’s own built-in Realtek MAC, keeping DHCP leases, Asset Inventory, and 802.1X/NAC accurate per laptop.',
      'It boosts USB-C video resolution to 8K.',
      'It disables Ethernet completely.',
      'It stores BitLocker keys inside the dock.',
    ],
    correctIndices: [0],
    hints: [
      'Without MAC Pass-Through, 40 different laptops plugging into Dock #4 all look like the exact same MAC address to DHCP and Cisco ISE!',
      'Pass-Through passes the LAPTOP’s identity through the shared dock.',
    ],
    explanation:
      'HOW & WHY: Shared hot-desk docks create MAC collision and DHCP/NAC confusion because every laptop inherits the dock’s hardware MAC. Enabling BIOS MAC Address Pass-Through presents each laptop’s unique system MAC across the dock NIC.',
  },
  {
    id: 'it-h33-scen',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Port Exhaustion / Ephemeral NAT on Office Firewall',
    prompt:
      'Scenario: Every Monday at 9:15 AM when 150 employees open browsers simultaneously, random staff lose new HTTPS connections for 60 seconds while existing Teams calls keep running. Checking the office edge firewall reveals a single public IPv4 PAT address hitting 64,000 concurrent NAT translations due to heavy telemetry/cloud apps. What explains existing calls surviving while new pages fail?',
    options: [
      'PAT port exhaustion: existing established UDP/TCP sessions keep their NAT table entries, while brand-new outbound flows fail because no free ephemeral source ports remain on the single public IP.',
      'The office Cat6 cables overheated at 9:15 AM.',
      'DNS servers only work after noon.',
      'Active Directory limits logins to 100 per Monday.',
    ],
    correctIndices: [0],
    hints: [
      'A single public IPv4 address has ~64k usable TCP/UDP port numbers!',
      'Existing sessions already hold ports; NEW sessions need fresh ports.',
    ],
    explanation:
      'HOW & WHY: Single-IP PAT overload caps out near ~64,000 simultaneous port mappings per protocol. Existing sessions continue using their allocated entries while new flows fail until sessions time out or Engineering adds a multi-IP NAT pool.',
  },
  {
    id: 'it-h34-scen',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Security Incident vs. Standard Help Desk Ticket',
    prompt:
      'Scenario: A user submits a seemingly routine ticket: "My PC slowed down and all my shared Excel files suddenly got renamed to `.locked` with a `HOW_TO_DECRYPT.txt` file on Desktop." What immediate emergency protocol must Tier 1 execute?',
    options: [
      'Recognize active ransomware: immediately tell the user to UNPLUG Ethernet / disable Wi-Fi (DO NOT reboot or wipe yet for forensics!), disable their AD/M365 account to halt spread, and escalate as a P1 Security Incident to SecOps.',
      'Run "sfc /scannow" and tell the user to keep working.',
      'Pay the Bitcoin ransom from corporate funds.',
      'Copy the `.locked` folder onto every other department’s shared drive.',
    ],
    correctIndices: [0],
    hints: [
      'Isolate the endpoint from the network IMMEDIATELY so ransomware stops encrypting SMB network shares!',
      'Leaving power on (just network-isolated) preserves volatile RAM forensics for SecOps.',
    ],
    explanation:
      'HOW & WHY: Active ransomware requires instant network containment: disconnect Ethernet/Wi-Fi right away (stop SMB share encryption spread), disable the user’s account/sessions, preserve the machine powered-on/offline for SecOps forensics, and trigger P1 Incident Response.',
  },
  {
    id: 'it-h35-sim',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: Multi-Source Escalation Triage',
    prompt:
      'A P2 ticket was bounced back to Tier 1 because "insufficient evidence." Inspect the user chat, PC CLI check, and ADUC snippet to choose the right next step before re-escalating.',
    exhibitTabs: [
      {
        title: 'User Chat',
        output: `User (rgarcia): "I can't open the Accounting app at https://acct.corp.local:8443 from the office."`,
      },
      {
        title: 'PC Diagnostics (ACCT-PC-12)',
        output: `IP: 10.30.12.44/24 | GW: 10.30.12.1\nnslookup acct.corp.local -> 10.99.5.10\nping 10.99.5.10 -> Reply in 1ms\nTest-NetConnection 10.99.5.10 -Port 8443 -> TcpTestSucceeded : False`,
      },
      {
        title: 'ADUC Group Check',
        output: `rgarcia Member Of: Domain Users, SG_Accounting_Users (unchanged since last year)`,
      },
    ],
    options: [
      'Flush DNS and unlock rgarcia’s AD account.',
      'DNS (10.99.5.10) and ICMP ping succeed, while TCP port 8443 fails (`TcpTestSucceeded: False`); attach the `nslookup`, `ping`, and `Test-NetConnection -Port 8443` outputs and escalate to Server/Network Ops to inspect the acct.corp.local web service (port 8443) or VLAN 30 firewall ACL.',
      'Reimage ACCT-PC-12 immediately.',
      'Have rgarcia install Chrome extensions.',
    ],
    correctIndices: [1],
    hints: [
      'Look closely at Tab 2: DNS works, IP routing works, ONLY TCP port 8443 handshake fails!',
      'Is this a DNS/AD problem or an application-service/firewall problem on port 8443?',
    ],
    explanation:
      'HOW & WHY: Tab 2 proves DNS (`10.99.5.10`) and L3 ICMP reachability are healthy, isolating the fault cleanly to TCP 8443 (either the web daemon on `acct.corp.local` stopped listening on 8443 or an ACL/firewall blocks port 8443). Escalating with that exact proof gets immediate Tier 2 resolution.',
  },
];
