import { LearningTopic } from '../types/ccna';

export const IT_SUPPORT_TOPICS: LearningTopic[] = [
  {
    id: 'it-t1-hardware-os',
    trackId: 'it-support',
    number: '01',
    title: 'Hardware, OS & Boot Troubleshooting',
    levelTag: 'beginner',
    domainRef: 'Help Desk Foundations',
    summary:
      'Start from the basics of workplace computers: diagnose CPU/RAM/SSD/peripheral issues, use Task Manager, and troubleshoot Windows & macOS startup failures.',
    subtopics: [
      {
        id: 'it-1-1',
        code: '1.1',
        title: 'PC Hardware, Docking Stations & Peripheral Triage',
        levelTag: 'beginner',
        readMinutes: 5,
        summary:
          'Isolate power, display, USB-C dock, RAM, and storage issues quickly before ordering parts.',
        beginnerMentalModel:
          'Always troubleshoot from the outside in (Layer 1 first!): check the wall power outlet, dock USB-C cable, and monitor input source before opening the laptop or blaming the motherboard.',
        sections: [
          {
            heading: 'Fast Hardware Triage Checklist',
            body: 'No power? Check AC adapter LED, wall outlet, and perform a hard power drain (hold power button 15 seconds). External monitors black on a USB-C dock? Verify the laptop is plugged into a Thunderbolt/DisplayPort-capable USB-C port and test bypassing the dock directly via HDMI.',
            bullets: [
              'RAM issues often cause random BSODs (Blue Screen of Death) or beep codes on POST.',
              'SSD at 99% full causes severe slowdowns, failed Windows Updates, and Outlook cache errors.',
            ],
          },
        ],
        commands: [
          { command: 'msinfo32 / systeminfo', mode: 'Windows Run / CMD', purpose: 'View BIOS version, RAM, OS build, and uptime' },
          { command: 'chkdsk C: /f', mode: 'Admin CMD', purpose: 'Scan and repair NTFS file system errors' },
        ],
        takeaway:
          'Checking uptime in Task Manager ("Performance -> CPU") catches laptops that haven’t had a real reboot in 45 days due to Windows Fast Startup.',
        knowledgeCheck: [
          {
            id: 'it-1-1-q1',
            prompt:
              'A user says "I restarted my Windows laptop three times today, but it’s still sluggish." In Task Manager -> CPU, Uptime shows 28 days. Why?',
            options: [
              'The CPU clock battery is dead.',
              'Windows Fast Startup hibernates the kernel on "Shut down", whereas "Restart" performs a full clean kernel reload.',
              'The laptop has too much RAM.',
              'Active Directory blocked the reboot.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: A CMOS battery affects BIOS time/settings, not Task Manager uptime.',
              'Correct: Users often click "Shut down" thinking it clears memory, but Windows Fast Startup saves the kernel session to disk. Clicking "Restart" forces a true fresh boot.',
              'Incorrect: Extra RAM improves multitasking and does not inflate uptime.',
              'Incorrect: Active Directory does not prevent local restarts.',
            ],
            deepExplanation:
              'One of the highest-yield Tier 1 help desk habits: always check Task Manager CPU Uptime! If it says 15+ days, instruct the user to click Start -> Power -> Restart (not Shut down).',
          },
        ],
      },
      {
        id: 'it-1-2',
        code: '1.2',
        title: 'OS Processes, Services & Driver Recovery',
        levelTag: 'beginner',
        readMinutes: 5,
        summary:
          'Diagnose runaway CPU/disk usage, restart stuck Windows services, and repair corrupted OS system files.',
        beginnerMentalModel:
          'Applications run in the foreground for users; Services (like Print Spooler or Windows Update) run silently in the background. When printing breaks for everyone on one PC, restarting the single Print Spooler service beats rebooting the whole machine.',
        sections: [
          {
            heading: 'Essential Windows Repair Tools',
            body: 'Use "sfc /scannow" to verify and repair protected Windows OS files, and "DISM /Online /Cleanup-Image /RestoreHealth" if the component store itself is damaged. Use "services.msc" to restart stuck services like Spooler or wuauserv.',
          },
        ],
        commands: [
          { command: 'sfc /scannow', mode: 'Admin CMD', purpose: 'Scan and restore corrupted Windows system files' },
          { command: 'net stop spooler && net start spooler', mode: 'Admin CMD', purpose: 'Restart stuck Windows Print Spooler service' },
        ],
        takeaway:
          'Check Event Viewer ("System" and "Application" logs) whenever an app crashes without an error message.',
        knowledgeCheck: [
          {
            id: 'it-1-2-q1',
            prompt:
              'A user’s print queue shows three stuck jobs that refuse to cancel. Which Windows service should you restart from an elevated prompt?',
            options: ['BITS', 'Spooler', 'DHCP Client', 'Netlogon'],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: BITS transfers background Windows Updates and SCCM packages.',
              'Correct: The Print Spooler ("spooler") manages all local and network print queues; restarting it (and clearing C:\\Windows\\System32\\spool\\PRINTERS if needed) unblocks stuck jobs.',
              'Incorrect: DHCP Client handles IP address leases.',
              'Incorrect: Netlogon handles domain controller authentication channels.',
            ],
            deepExplanation:
              'Stopping Spooler, deleting orphaned files in System32\\spool\\PRINTERS, and starting Spooler resolves 80% of single-PC stuck print tickets.',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'it-t1-ex1',
        prompt:
          'A user’s two external monitors connected to a USB-C dock remain black after an overnight update, though the laptop screen works. What is your fastest isolation test?',
        options: [
          'Reinstall Windows immediately.',
          'Plug one monitor directly into the laptop HDMI port (or power-cycle the dock) to isolate dock vs. monitor.',
          'Reset the user’s Active Directory password.',
          'Run "sfc /scannow" before checking any cables.',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: Wiping the OS before checking hardware wastes hours and destroys user workflow.',
          'Correct: Divide-and-conquer hardware isolation immediately separates a bad dock/cable from a monitor or GPU driver issue.',
          'Incorrect: AD passwords have no impact on DisplayPort/HDMI video signals.',
          'Incorrect: Always test physical bypass/cables before running 15-minute OS file scans.',
        ],
        deepExplanation:
          'Great IT support engineers isolate variables in 30 seconds: bypass the dock, test another known-good cable, or test the dock on a second laptop.',
      },
    ],
  },
  {
    id: 'it-t2-ticketing',
    trackId: 'it-support',
    number: '02',
    title: 'Ticketing Systems, SLAs & Triage',
    levelTag: 'beginner',
    domainRef: 'ITSM & Service Desk Workflows',
    summary:
      'Operate inside Jira Service Management, ServiceNow, or Freshservice: classify Incidents vs. Service Requests, calculate Priority from Impact + Urgency, and write crisp escalation notes.',
    subtopics: [
      {
        id: 'it-2-1',
        code: '2.1',
        title: 'Incidents vs. Requests, SLAs & Priority Matrix',
        levelTag: 'beginner',
        readMinutes: 6,
        summary:
          'Learn how help desks measure Response vs. Resolution SLAs and prioritize P1 outages over P4 requests.',
        beginnerMentalModel:
          'An Incident is "something that worked yesterday is broken today" (Wi-Fi down, Outlook crashing). A Service Request is "I need something new or standard" (new software license, access to a shared folder, new laptop).',
        sections: [
          {
            heading: 'Priority = Impact x Urgency',
            body: 'Impact measures how many users or business-critical systems are affected (1 user vs. entire warehouse). Urgency measures how quickly a workaround is needed (has workaround vs. complete work stoppage). A P1 Critical Incident triggers immediate war-room escalation; a P3 single-user issue with a workaround follows standard SLA (e.g., 8–24 hours).',
            bullets: [
              'SLA Response Time = how fast you acknowledge and begin triaging the ticket.',
              'SLA Resolution Time = total clock time to restore service (clock pauses only in "Waiting on Customer" if policy allows).',
            ],
          },
        ],
        commands: [
          { command: 'Incident (Break/Fix)', mode: 'ITSM Category', purpose: 'Unplanned interruption or degradation of an IT service' },
          { command: 'Service Request', mode: 'ITSM Category', purpose: 'Standard pre-approved request (access, hardware, password)' },
        ],
        takeaway:
          'Never leave a ticket sitting silent near SLA breach—update the customer even if the fix is still in progress.',
        knowledgeCheck: [
          {
            id: 'it-2-1-q1',
            prompt:
              'The entire finance department (45 people) cannot access the payroll ERP right before Friday payroll cutoff. How should this ticket be classified?',
            options: [
              'P4 Service Request',
              'P1 Critical Incident (High Impact + High Urgency)',
              'P3 Low-Priority Change Request',
              'Close as duplicate without notifying anyone',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: A broken production ERP is an unplanned outage (Incident), not a Service Request.',
              'Correct: Department-wide stoppage on a time-critical payroll deadline equals High Impact + High Urgency -> P1 Critical Incident.',
              'Incorrect: Change Requests are planned future upgrades, not active outages.',
              'Incorrect: Silent closure violates SLA and customer trust.',
            ],
            deepExplanation:
              'Using Impact x Urgency prevents "whoever yells loudest gets P1" chaos and keeps critical outages visible to Tier 2/3 teams.',
          },
        ],
      },
      {
        id: 'it-2-2',
        code: '2.2',
        title: 'Structured Troubleshooting & Tier 2 Escalation Notes',
        levelTag: 'intermediate',
        readMinutes: 5,
        summary:
          'Write escalation notes that Tier 2 sysadmins and network engineers actually appreciate.',
        beginnerMentalModel:
          'Escalating a ticket that just says "VPN broken, please fix" forces Tier 2 to start from zero. Good escalation notes act like a pilot handoff: exact error message, affected hostname/IP, what you already tested, and timestamps.',
        sections: [
          {
            heading: 'The 5-Line Escalation Template',
            body: 'Before assigning a ticket to Tier 2 or Networking, always include: (1) User + Hostname + Location/VPN, (2) Exact error text or screenshot, (3) Scope (1 user vs. multiple), (4) Troubleshooting steps & outputs already run (ipconfig, ping, gpresult), and (5) Best callback time.',
          },
        ],
        commands: [
          { command: 'hostname & whoami', mode: 'CMD / Terminal', purpose: 'Capture exact machine name and signed-in username for the ticket' },
        ],
        takeaway:
          'Documenting exact commands already tested cuts Tier 2 resolution time in half.',
        knowledgeCheck: [
          {
            id: 'it-2-2-q1',
            prompt:
              'Which internal work note is ready for escalation to the Network Team?',
            options: [
              '"User cannot reach shared drive. Escalating to networking."',
              '"User jdoe on FIN-LT-042 (10.20.4.18) cannot reach \\\\files01.corp (10.99.0.15). Ping to gateway 10.20.4.1 succeeds; tracert stops at 10.20.4.1. Other VLAN 20 users report the same issue since 09:15 EST."',
              '"Tried rebooting, still broken."',
              '"Please check the server."',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: Missing hostname, IPs, scope, and test results.',
              'Correct: It provides exact host/IP, target IP, confirmed local gateway reachability, tracert drop point, scope (VLAN-wide), and start time.',
              'Incorrect: Gives zero diagnostic evidence.',
              'Incorrect: Doesn’t specify which server, user, or symptom.',
            ],
            deepExplanation:
              'Notice how your CCNA fundamentals directly supercharge your IT Support escalations—reporting gateway ping vs. tracert hop stops instantly pinpoints the fault.',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'it-t2-ex1',
        prompt: 'Which ticket is a Service Request rather than an Incident?',
        options: [
          'Outlook crashes every time a user opens attachments.',
          'A newly hired analyst needs read/write access to the Marketing SharePoint site.',
          'Conference room Wi-Fi drops every 5 minutes.',
          'The accounting printer displays a paper jam sensor fault.',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: App crash = broken service (Incident).',
          'Correct: Requesting standard access or provisioning for a new employee is a planned Service Request.',
          'Incorrect: Wi-Fi drops = service degradation (Incident).',
          'Incorrect: Hardware fault = Incident.',
        ],
        deepExplanation:
          'Distinguishing Incidents (restore broken service) from Service Requests (fulfill standard asks) keeps SLA reporting accurate.',
      },
    ],
  },
  {
    id: 'it-t3-active-directory',
    trackId: 'it-support',
    number: '03',
    title: 'Microsoft Active Directory, Entra ID & GPOs',
    levelTag: 'intermediate',
    domainRef: 'Identity & Access Management',
    summary:
      'Manage domain users, Organizational Units (OUs), Security Groups, account lockouts, Group Policy (GPO) refreshes, and NTFS permissions.',
    subtopics: [
      {
        id: 'it-3-1',
        code: '3.1',
        title: 'Active Directory Structure: Domains, OUs, Users & Groups',
        levelTag: 'intermediate',
        readMinutes: 6,
        summary:
          'Navigate Active Directory Users and Computers (ADUC), understand Entra ID hybrid sync, and apply RBAC using Security Groups.',
        beginnerMentalModel:
          'Active Directory is the master phonebook and keycard system of a Windows company. Organizational Units (OUs) are folders used to organize departments and apply settings (GPOs), while Security Groups are keycards that grant access to shared folders and printers.',
        sections: [
          {
            heading: 'AGDLP & Least Privilege',
            body: 'Never assign folder permissions directly to individual user accounts! Put User Accounts into Role Security Groups (e.g., SG_Finance_RW), and grant permissions to the Group. When an employee leaves Finance, removing them from the group revokes all Finance access cleanly.',
            bullets: [
              'Active Directory (on-prem) handles Kerberos domain sign-in, OUs, and Group Policy.',
              'Microsoft Entra ID (formerly Azure AD) handles cloud SSO, Conditional Access, MFA, and M365.',
            ],
          },
        ],
        commands: [
          { command: 'dsa.msc', mode: 'Windows Run', purpose: 'Launch Active Directory Users and Computers (ADUC)' },
          { command: 'whoami /groups', mode: 'CMD', purpose: 'Verify which Security Groups are in the user’s active Kerberos token' },
        ],
        takeaway:
          'After adding a user to a new Security Group, the user MUST sign out and sign back in (or refresh Kerberos tickets) so their token updates!',
        knowledgeCheck: [
          {
            id: 'it-3-1-q1',
            prompt:
              'You add Sarah to the "SG_HR_Shares" Active Directory group, but she still gets "Access Denied" on the HR folder two minutes later. What is the most common reason?',
            options: [
              'NTFS permissions take 7 days to replicate.',
              'Sarah has not signed out and back in yet, so her current Windows login token does not include the new group.',
              'Active Directory requires a full server reboot for every group change.',
              'Security Groups only work on Linux.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: NTFS permissions evaluate immediately against the user’s token.',
              'Correct: Windows builds a user’s Kerberos security token at logon time. She must lock/unlock (sometimes) or sign out and sign back in to refresh her group memberships.',
              'Incorrect: Domain controllers never need rebooting for group edits.',
              'Incorrect: Active Directory Security Groups are native to Windows.',
            ],
            deepExplanation:
              'The #1 "I just added you to the group!" follow-up step on any help desk: ask the user to sign out and back in (or run "klist purge" + lock/unlock) to refresh their Kerberos TGT/token.',
          },
        ],
      },
      {
        id: 'it-3-2',
        code: '3.2',
        title: 'Account Lockouts, Group Policy (GPO) & NTFS Permissions',
        levelTag: 'intermediate',
        readMinutes: 6,
        summary:
          'Fix recurring account lockouts caused by cached credentials, force GPO updates, and understand Deny overrides Allow.',
        beginnerMentalModel:
          'When a user changes their AD password on Monday morning and gets locked out every 15 minutes afterward, their phone Mail app or saved Windows Credential Manager is still hammering the server with Friday’s old password!',
        sections: [
          {
            heading: 'Lockout Troubleshooting & GPO Commands',
            body: 'Always unlock the account in ADUC AND check Credential Manager ("control keymgr.dll"), mobile email clients, and mapped drives for stale passwords. Run "gpupdate /force" to pull updated policies and "gpresult /r" to verify which GPOs actually applied.',
            bullets: [
              'NTFS Rule: Explicit DENY always overrides ALLOW; when Share and NTFS permissions combine, the MOST RESTRICTIVE permission wins.',
            ],
          },
        ],
        commands: [
          { command: 'gpupdate /force', mode: 'CMD', purpose: 'Force immediate refresh of Computer and User Group Policies' },
          { command: 'gpresult /r', mode: 'CMD', purpose: 'Display Resultant Set of Policy (applied GPOs)' },
        ],
        takeaway:
          'In Windows permissions, Explicit Deny beats Allow, and Share + NTFS intersect to the most restrictive level.',
        knowledgeCheck: [
          {
            id: 'it-3-2-q1',
            prompt:
              'A shared folder has Share Permission = "Everyone: Full Control" and NTFS Security Permission = "SG_Sales: Read". What can a member of SG_Sales do over the network?',
            options: [
              'Full Control (delete and modify files)',
              'Read only (most restrictive of Share vs. NTFS applies)',
              'Access Denied completely',
              'Modify permissions only',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: Share Full Control does not bypass tighter NTFS Read permissions.',
              'Correct: When accessing a folder over SMB, Windows takes the effective Share permission AND the effective NTFS permission and enforces the most restrictive combination (Read).',
              'Incorrect: Read is permitted by both Share and NTFS.',
              'Incorrect: Changing permissions requires Full Control on NTFS.',
            ],
            deepExplanation:
              'Best practice in Windows File Servers: set Share Permissions to "Authenticated Users: Change/Full" and control granular access strictly with NTFS Security Groups.',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'it-t3-ex1',
        prompt:
          'A user’s AD account locks out again 10 minutes after every time you unlock it, right after they changed their password. What is the likeliest culprit?',
        options: [
          'Their monitor cable is loose.',
          'A mobile device, mapped drive, or Windows Credential Manager entry is retrying their old cached password.',
          'Group Policy disabled their NIC.',
          'The DHCP lease expired.',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: Display cables do not generate failed Kerberos/NTLM logons.',
          'Correct: Background apps (phone ActiveSync/Mail, Outlook, Credential Manager, Wi-Fi 802.1X profile) keep sending the old password and trigger the AD bad-password lockout threshold.',
          'Incorrect: Disabled NICs cannot send auth attempts.',
          'Incorrect: DHCP lease expiry breaks IP connectivity, not AD bad-password counters.',
        ],
        deepExplanation:
          'Clearing Windows Credential Manager and re-authenticating work email/Wi-Fi on the user’s phone stops recurring post-password-change lockouts.',
      },
    ],
  },
  {
    id: 'it-t4-network-support',
    trackId: 'it-support',
    number: '04',
    title: 'Endpoint Networking, DNS, VPN & Printers',
    levelTag: 'advanced',
    domainRef: 'Help Desk Network Diagnostics',
    summary:
      'Use Windows/macOS CLI network tools to separate local Wi-Fi, DHCP, DNS, VPN split-tunneling, and network printer issues.',
    subtopics: [
      {
        id: 'it-4-1',
        code: '4.1',
        title: 'Client Network Triage: ipconfig, ping, nslookup & tracert',
        levelTag: 'advanced',
        readMinutes: 6,
        summary:
          'Follow a repeatable 4-step network isolation sequence on any user laptop.',
        beginnerMentalModel:
          'Never guess whether "the internet is down" is Wi-Fi, IP, or DNS. Test in order: (1) ipconfig /all (Do I have a real IP and gateway?), (2) ping gateway (Can I reach my local router?), (3) ping 8.8.8.8 (Can I reach the internet by IP?), (4) nslookup (Does DNS resolve names?).',
        sections: [
          {
            heading: 'What Each Test Proves',
            body: 'If you can ping 8.8.8.8 successfully, but browsing google.com fails and nslookup times out, the network routing is healthy—ONLY DNS is broken! Run "ipconfig /flushdns" and check the DNS server IP.',
          },
        ],
        commands: [
          { command: 'ipconfig /all', mode: 'Windows CMD', purpose: 'Inspect IPv4, Subnet Mask, Default Gateway, DHCP & DNS servers' },
          { command: 'ipconfig /release && ipconfig /renew', mode: 'Windows CMD', purpose: 'Request a fresh DHCP lease' },
          { command: 'ipconfig /flushdns', mode: 'Windows CMD', purpose: 'Clear stale cached DNS records' },
        ],
        takeaway:
          'Ping IP works + website name fails = DNS problem, not a firewall or cable problem.',
        knowledgeCheck: [
          {
            id: 'it-4-1-q1',
            prompt:
              'A user can ping 1.1.1.1 with 12ms latency, but Chrome says "DNS_PROBE_FINISHED_NXDOMAIN" for every website. What failed?',
            options: [
              'The laptop Ethernet cable is unplugged.',
              'DNS name resolution is failing or pointing to an unreachable DNS server.',
              'The Default Gateway is shut down.',
              'APIPA blocked HTTPS.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: Pinging 1.1.1.1 proves Layer 1, Layer 2, and Layer 3 routing all work!',
              'Correct: Raw IP routing works, so the fault sits strictly with DNS resolution.',
              'Incorrect: Reaching 1.1.1.1 proves the Default Gateway forwarded the packet.',
              'Incorrect: APIPA addresses cannot route to 1.1.1.1.',
            ],
            deepExplanation:
              'Testing "ping 1.1.1.1" (or 8.8.8.8) vs. "nslookup" immediately separates routing failures from DNS failures.',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'it-t4-ex1',
        prompt:
          'After a DNS cutover, one user’s PC still resolves "intranet.corp" to the old decommissioned server IP while everyone else reaches the new IP. What command fixes this locally?',
        options: ['net stop spooler', 'ipconfig /flushdns', 'gpresult /r', 'sfc /scannow'],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: Spooler only manages printing.',
          'Correct: "ipconfig /flushdns" purges the local Windows DNS resolver cache so the PC queries the DNS server for the fresh IP.',
          'Incorrect: gpresult only displays Group Policy.',
          'Incorrect: sfc repairs OS files, not DNS cache.',
        ],
        deepExplanation:
          'Local DNS caching speeds up browsing, so flushing stale entries is a classic post-migration help desk fix.',
      },
    ],
  },
  {
    id: 'it-t5-m365-security',
    trackId: 'it-support',
    number: '05',
    title: 'Microsoft 365, MFA Security & PowerShell',
    levelTag: 'expert',
    domainRef: 'Systems Support & Escalation',
    summary:
      'Administer M365 shared mailboxes, reset MFA securely, triage phishing emails, and automate repetitive lookups with PowerShell.',
    subtopics: [
      {
        id: 'it-5-1',
        code: '5.1',
        title: 'M365 Mailboxes, MFA Resets & Phishing Triage',
        levelTag: 'expert',
        readMinutes: 6,
        summary:
          'Handle Microsoft 365 day-to-day administration safely without weakening identity security.',
        beginnerMentalModel:
          'When an employee gets a new iPhone and loses Microsoft Authenticator, never disable MFA completely—use "Require re-register MFA" in Entra ID after verifying their identity via HR/manager callback!',
        sections: [
          {
            heading: 'Identity Verification & Compromise Response',
            body: 'If a user reports clicking a suspicious phishing link and entering their password: (1) Revoke all active M365/Entra sessions immediately, (2) Reset password, (3) Check Outlook Inbox Rules for hidden attacker forwarding rules, and (4) Escalate to SecOps.',
          },
        ],
        commands: [
          { command: 'Get-ADUser -Identity jdoe -Properties LockedOut,PasswordLastSet', mode: 'PowerShell', purpose: 'Inspect AD lockout & password age via CLI' },
          { command: 'Test-NetConnection files01.corp -Port 445', mode: 'PowerShell', purpose: 'Verify TCP port 445 SMB reachability from client' },
        ],
        takeaway:
          'Always inspect Outlook inbox forwarding rules after any suspected email compromise!',
        knowledgeCheck: [
          {
            id: 'it-5-1-q1',
            prompt:
              'A user accidentally typed their M365 password into a fake login page 3 minutes ago. What is your FIRST containment action after resetting their password?',
            options: [
              'Revoke active sign-in sessions and inspect for malicious inbox forwarding rules / MFA registrations.',
              'Delete their user account completely.',
              'Restart their printer.',
              'Wait 24 hours to see if emails bounce.',
            ],
            correctIndex: 0,
            optionDetails: [
              'Correct: Resetting a password alone does NOT kill existing OAuth/session tokens! You must revoke active sessions and check for persistence (inbox rules, rogue MFA methods).',
              'Incorrect: Deleting the account destroys business continuity and forensic logs.',
              'Incorrect: Printers are unrelated to M365 cloud session tokens.',
              'Incorrect: Attackers exfiltrate data within minutes—waiting 24 hours is dangerous.',
            ],
            deepExplanation:
              'Modern cloud account compromise containment = Reset password + Revoke sessions + Audit MFA methods + Audit Inbox Rules.',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'it-t5-ex1',
        prompt:
          'Which PowerShell cmdlet tests whether a client workstation can reach TCP port 445 (SMB) on a file server?',
        options: [
          'Test-NetConnection server01 -Port 445',
          'ipconfig /flushdns 445',
          'Get-PrinterPort 445',
          'ping server01:445',
        ],
        correctIndex: 0,
        optionDetails: [
          'Correct: PowerShell’s Test-NetConnection tests both ICMP reachability and specific TCP port handshakes.',
          'Incorrect: ipconfig /flushdns takes no port parameter.',
          'Incorrect: Get-PrinterPort lists local printer ports.',
          'Incorrect: Standard ping uses ICMP and cannot test TCP ports.',
        ],
        deepExplanation:
          'Test-NetConnection <host> -Port <port> is a superpower for IT Systems Support when checking SMB (445), RDP (3389), or HTTPS (443) firewall blocks.',
      },
    ],
  },
];
