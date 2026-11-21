import { ExamDomainMeta, ExamQuestion } from '../types/ccna';
import { IT_SUPPORT_QUESTIONS_PART_1 } from './itSupportMockExamPart1';
import { IT_SUPPORT_QUESTIONS_PART_2 } from './itSupportMockExamPart2';

export const IT_SUPPORT_DOMAINS: ExamDomainMeta[] = [
  {
    id: 'hardware-os',
    number: '1',
    title: 'Hardware, OS & Boot',
    summary: 'Docking stations, POST/BSODs, Fast Startup uptime, Services, SFC/DISM, and Event Viewer triage.',
  },
  {
    id: 'ticketing-itsm',
    number: '2',
    title: 'Ticketing & SLAs',
    summary: 'Incident vs. Service Request classification, Impact x Urgency priority matrix, and Tier 2 handoffs.',
  },
  {
    id: 'identity-ad',
    number: '3',
    title: 'Active Directory & GPO',
    summary: 'ADUC, Security Groups, Kerberos tokens, account lockouts, GPO refresh, and Share/NTFS permissions.',
  },
  {
    id: 'endpoint-network',
    number: '4',
    title: 'Endpoint Networking',
    summary: 'Client DHCP/APIPA triage, DNS cache flushing, nslookup, tracert, VPN split-tunneling, and network printers.',
  },
  {
    id: 'm365-security',
    number: '5',
    title: 'M365, MFA & PowerShell',
    summary: 'Microsoft Entra ID MFA resets, phishing session revocation, inbox rules, and PowerShell diagnostics.',
  },
];

const CORE_IT_SUPPORT_QUESTIONS: ExamQuestion[] = [
  {
    id: 'it-q1',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Windows Fast Startup & Uptime',
    prompt:
      'A user insists they shut down their Windows 11 laptop every evening, yet applications remain sluggish and pending updates fail to finalize. Task Manager -> Performance -> CPU shows an Uptime of 34 days. What is the fastest explanation and fix?',
    options: [
      'The motherboard CMOS battery is failing and requires replacement.',
      'Windows Fast Startup hibernates the kernel on "Shut down"; instruct the user to select "Restart" for a clean kernel reload.',
      'The SSD is write-protected by BitLocker.',
      'Active Directory Group Policy resets Task Manager uptime every 60 days.',
    ],
    correctIndices: [1],
    hints: [
      'Why does Task Manager CPU Uptime stay at 34 days even after clicking "Shut down"?',
      'Windows Fast Startup saves the kernel session to hiberfil.sys on Shut down—only "Restart" clears uptime to 0.',
    ],
    explanation:
      'HOW & WHY: With Fast Startup enabled, clicking "Shut down" hibernates the kernel session to hiberfil.sys rather than performing a cold reload. Clicking "Restart" forces a full clean kernel and driver initialization, resetting uptime to 0.',
  },
  {
    id: 'it-q2',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'USB-C Dock & Display Isolation',
    prompt:
      'After arriving at the office, a user plugs their laptop into a USB-C docking station. The laptop charges and the USB mouse works, but both external monitors stay black. What is your fastest physical isolation step?',
    options: [
      'Reimage the laptop from MDT/Intune immediately.',
      'Connect one monitor directly to the laptop HDMI port (or power-cycle the dock) to isolate the dock from the monitors/GPU.',
      'Reset the user’s Active Directory password.',
      'Disable Windows Defender Firewall.',
    ],
    correctIndices: [1],
    hints: [
      'Always isolate Layer 1 (cables/dock) before making invasive OS or account changes.',
      'Bypassing the dock with a direct monitor connection proves immediately whether the dock or the laptop/monitor is at fault.',
    ],
    explanation:
      'HOW & WHY: Layer-1 divide-and-conquer triage isolates whether the fault sits in the dock/USB-C DP Alt-Mode cable or in the monitor/OS display driver in under 30 seconds.',
  },
  {
    id: 'it-q3',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'easy',
    topic: 'Windows Services & Printing',
    prompt:
      'A workstation has four stalled jobs in the print queue that display "Deleting" indefinitely and block all new printouts. Which Windows service should you stop, clear orphaned spool files for, and restart?',
    options: ['BITS', 'Print Spooler (spooler)', 'WinRM', 'Netlogon'],
    correctIndices: [1],
    hints: [
      'Which service manages C:\\Windows\\System32\\spool\\PRINTERS?',
      'BITS handles background downloads, WinRM handles remote PowerShell, and Print Spooler manages print queues.',
    ],
    explanation:
      'HOW & WHY: Stopping the Print Spooler ("net stop spooler"), deleting stuck files in C:\\Windows\\System32\\spool\\PRINTERS, and running "net start spooler" clears jammed local queues immediately.',
  },
  {
    id: 'it-q4',
    trackId: 'it-support',
    domainId: 'hardware-os',
    difficulty: 'medium',
    questionType: 'multi',
    topic: 'Windows OS Repair Commands',
    prompt:
      'Which two elevated Windows commands verify and repair corrupted system files and the Windows component store image? (Choose two.)',
    multiSelect: true,
    options: [
      'sfc /scannow',
      'ipconfig /flushdns',
      'DISM /Online /Cleanup-Image /RestoreHealth',
      'gpresult /r',
    ],
    correctIndices: [0, 2],
    hints: [
      'ipconfig is for DNS/IP networking, and gpresult is for Group Policy.',
      'One command repairs the Windows component store image (DISM) and the other scans/restores protected system files (SFC).',
    ],
    explanation:
      'HOW & WHY: DISM /RestoreHealth repairs the underlying Windows component store image, and sfc /scannow scans and restores protected OS system files from that healthy store.',
  },
  {
    id: 'it-q5',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'Incident vs. Service Request',
    prompt:
      'Which user ticket should be classified as a Service Request rather than an Incident?',
    options: [
      'Outlook crashes with error 0x8004010F whenever a user sends mail.',
      'A newly promoted team lead requests access to the Finance SharePoint library and a Visio license.',
      'Warehouse handheld scanners lose Wi-Fi connectivity every 10 minutes.',
      'The third-floor multifunction printer throws a fuser hardware error.',
    ],
    correctIndices: [1],
    hints: [
      'Incidents = something broken/degraded; Service Requests = standard pre-approved asks for access, hardware, or software.',
      'Look for the option where nothing is broken—someone is simply requesting new access and software.',
    ],
    explanation:
      'HOW & WHY: An Incident restores an unplanned interruption or degradation of an existing service. Provisioning standard access or software licenses for an employee is a planned Service Request.',
  },
  {
    id: 'it-q6',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'easy',
    topic: 'ITSM Priority Matrix',
    prompt:
      'All 60 customer-support agents on the call floor are unable to open the CRM phone queue during peak business hours, and no workaround exists. How should this ticket be prioritized?',
    options: [
      'P4 Low Service Request',
      'P3 Single-User Incident',
      'P1 Critical Incident (High Impact + High Urgency)',
      'Scheduled Standard Change',
    ],
    correctIndices: [2],
    hints: [
      'Priority = Impact (how many users/business functions affected) × Urgency (time sensitivity + workaround availability).',
      '60 agents down at peak hours with NO workaround = High Impact + High Urgency.',
    ],
    explanation:
      'HOW & WHY: Priority = Impact × Urgency. Complete department-wide stoppage of a revenue-critical system with no workaround qualifies as a P1 Critical Incident requiring immediate escalation.',
  },
  {
    id: 'it-q7',
    trackId: 'it-support',
    domainId: 'ticketing-itsm',
    difficulty: 'medium',
    topic: 'SLA Clock Management',
    prompt:
      'You responded to a P3 ticket within 15 minutes and emailed the user asking which asset tag and error code they see on screen. Under standard ITIL service desk workflows, which ticket status pauses the Resolution SLA clock while awaiting their reply?',
    options: ['In Progress', 'Waiting on Customer / Pending User', 'Closed Resolved', 'Escalated to Tier 3'],
    correctIndices: [1],
    hints: [
      'You shouldn’t close a ticket before solving it, yet the SLA timer shouldn’t penalize IT while waiting days for the user to reply.',
      'Pick the status explicitly indicating the ball is in the requester’s court.',
    ],
    explanation:
      'HOW & WHY: Moving a ticket to "Waiting on Customer" (or Pending) records that the desk responded within SLA and pauses the resolution SLA clock until the user replies.',
  },
  {
    id: 'it-q8',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Security Group Token Refresh',
    prompt:
      'You add an employee to the "SG_Marketing_RW" Active Directory Security Group so they can access a shared folder, but 3 minutes later they still receive "Access Denied." What is the most common cause?',
    options: [
      'NTFS permissions take 48 hours to replicate to workstations.',
      'The user has not signed out and back in yet, so their active Kerberos logon token does not contain the new group SID.',
      'Active Directory groups only grant permissions to Linux servers.',
      'The user must reinstall Microsoft Edge first.',
    ],
    correctIndices: [1],
    hints: [
      'Windows builds a user’s list of Security Group SIDs only at one specific moment.',
      'That token is assembled at Windows logon—adding someone in ADUC does not inject the SID into an existing active session.',
    ],
    explanation:
      'HOW & WHY: Windows constructs a user’s Kerberos access token at sign-in time. Until the user signs out and back in (or purges Kerberos tickets via klist purge and re-authenticates), the new group SID is absent from their active session.',
  },
  {
    id: 'it-q9',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    topic: 'Share vs. NTFS Permissions',
    prompt:
      'A Windows file share has Share Permissions set to "Authenticated Users: Change" and NTFS Security Permissions set to "SG_Audit: Read & Execute" (with no Deny entries). What effective access does a member of SG_Audit have when opening the share over the network?',
    options: [
      'Full Control',
      'Change (Modify)',
      'Read & Execute (most restrictive of Share vs. NTFS applies)',
      'No Access',
    ],
    correctIndices: [2],
    hints: [
      'When combining SMB Share permissions and NTFS Security permissions over a network, does the broader or stricter rule win?',
      'Always compare the effective Share level (Change) against the effective NTFS level (Read & Execute) and pick the MORE restrictive one.',
    ],
    explanation:
      'HOW & WHY: When accessing files remotely over SMB, Windows evaluates effective Share permissions and effective NTFS permissions separately, then enforces the MOST restrictive intersection—here Read & Execute.',
  },
  {
    id: 'it-q10',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'medium',
    questionType: 'multi',
    topic: 'Recurring Account Lockouts',
    prompt:
      'A user changed their corporate AD password at 8:30 AM. Every 15 minutes since then, their account locks out again even right after you unlock it in ADUC. Which two sources most commonly trigger recurring lockouts after a password change? (Choose two.)',
    multiSelect: true,
    options: [
      'Stale saved credentials in Windows Credential Manager or mapped network drives',
      'A mobile phone Mail / ActiveSync / Wi-Fi 802.1X profile still retrying the old password',
      'A disconnected DisplayPort monitor cable',
      'Running "gpupdate /force" from an elevated prompt',
    ],
    correctIndices: [0, 1],
    hints: [
      'Account lockouts happen when something repeatedly submits bad-password authentication attempts in the background.',
      'Think of cached credentials on the workstation and background sync/Wi-Fi profiles on the user’s phone.',
    ],
    explanation:
      'HOW & WHY: Background apps holding cached old passwords (mobile mail/ActiveSync, corporate 802.1X Wi-Fi profiles, Windows Credential Manager, or scheduled tasks) silently retry the old password until the bad-password lockout threshold triggers again.',
  },
  {
    id: 'it-q11',
    trackId: 'it-support',
    domainId: 'identity-ad',
    difficulty: 'easy',
    topic: 'Group Policy Verification',
    prompt:
      'You moved a workstation into a new Organizational Unit (OU) that pushes a mapped printer GPO. Which commands force a policy refresh and verify which GPOs actually applied to the PC?',
    options: [
      'sfc /scannow and chkdsk /f',
      'gpupdate /force and gpresult /r',
      'netstat -ano and arp -a',
      'nslookup and tracert',
    ],
    correctIndices: [1],
    hints: [
      '"gp" stands for Group Policy.',
      'One command updates Group Policy immediately, and the other prints the Resultant Set of Policy.',
    ],
    explanation:
      'HOW & WHY: "gpupdate /force" forces an immediate Computer and User Group Policy refresh, and "gpresult /r" prints the Resultant Set of Policy showing which GPOs applied or were filtered.',
  },
  {
    id: 'it-q12',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'APIPA & DHCP Failures',
    prompt:
      'A remote office user reports "No Internet access" over wired Ethernet. Running "ipconfig /all" displays IPv4 Address 169.254.88.14 with Subnet Mask 255.255.0.0 and no Default Gateway. What happened?',
    options: [
      'The workstation assigned itself an APIPA address because it could not reach a DHCP server.',
      'The workstation was assigned a public static IP by the ISP.',
      'DNS resolved google.com to the wrong IPv6 address.',
      'The local Print Spooler crashed.',
    ],
    correctIndices: [0],
    hints: [
      'Look closely at the IPv4 range 169.254.x.x paired with zero Default Gateway.',
      '169.254.0.0/16 is Windows Automatic Private IP Addressing (APIPA), triggered when DHCP fails.',
    ],
    explanation:
      'HOW & WHY: 169.254.0.0/16 is APIPA. Windows auto-assigns an APIPA IP when DHCP Discover broadcasts receive no Offer—indicating a dead switchport/VLAN misconfiguration or an unreachable/exhausted DHCP server.',
  },
  {
    id: 'it-q13',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'DNS vs. Routing Isolation',
    prompt:
      'A user can successfully run "ping 8.8.8.8" with 14ms latency, yet opening https://portal.company.com fails immediately with "ERR_NAME_NOT_RESOLVED". What layer/service failed?',
    options: [
      'The laptop Ethernet cable is unplugged.',
      'The Default Gateway is down.',
      'DNS name resolution is failing or pointing to an unreachable DNS server.',
      'Layer 2 spanning-tree blocked the port.',
    ],
    correctIndices: [2],
    hints: [
      'If pinging an external IP address (8.8.8.8) works, your cable, Wi-Fi, gateway, and Internet routing ALL work.',
      '"ERR_NAME_NOT_RESOLVED" specifically points to translating a hostname into an IP.',
    ],
    explanation:
      'HOW & WHY: Reaching 8.8.8.8 proves Layer 1/2 link, DHCP IP, default gateway, and upstream routing work cleanly. Only DNS hostname-to-IP resolution is broken.',
  },
  {
    id: 'it-q14',
    trackId: 'it-support',
    domainId: 'endpoint-network',
    difficulty: 'easy',
    topic: 'DNS Cache Cutover Fix',
    prompt:
      'The infrastructure team migrated "hr.corp.local" to a new server IP 10.50.0.22 an hour ago. Every other user reaches the new server, but one laptop still connects to the old IP 10.50.0.10. Which command clears the laptop’s stale entry?',
    options: ['ipconfig /flushdns', 'net stop spooler', 'whoami /groups', 'diskpart'],
    correctIndices: [0],
    hints: [
      'Windows caches DNS answers locally until their TTL expires.',
      'Use an ipconfig switch that purges the local DNS resolver cache.',
    ],
    explanation:
      'HOW & WHY: "ipconfig /flushdns" clears the Windows local DNS resolver cache so the next request queries the authoritative internal DNS server for the updated A record (10.50.0.22).',
  },
  {
    id: 'it-q15',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'easy',
    topic: 'MFA Hardware Replacement',
    prompt:
      'A sales director replaced their lost iPhone and can no longer approve Microsoft Authenticator MFA prompts. After verifying their identity per company policy, what is the secure Entra ID action?',
    options: [
      'Disable MFA permanently for their account.',
      'Share your own admin Authenticator code with them.',
      'Select "Require re-register multifactor authentication" in Microsoft Entra ID so they enroll their new phone cleanly.',
      'Delete their Microsoft 365 mailbox and recreate it.',
    ],
    correctIndices: [2],
    hints: [
      'Never disable MFA permanently—you only want to clear the lost phone’s binding and enroll the new phone.',
      'Entra ID Authentication Methods includes a button specifically to force fresh MFA enrollment on next login.',
    ],
    explanation:
      'HOW & WHY: "Require re-register MFA" clears old device methods while preserving MFA policy enforcement, guiding the verified user to register Microsoft Authenticator on their new iPhone at next sign-in.',
  },
  {
    id: 'it-q16',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'hard',
    questionType: 'multi',
    topic: 'Phishing Compromise Containment',
    prompt:
      'An employee admits they entered their M365 credentials and approved an unexpected MFA push on a phishing site 5 minutes ago. Which two actions are critical alongside resetting the password? (Choose two.)',
    multiSelect: true,
    options: [
      'Revoke all active Entra ID / M365 sign-in sessions immediately',
      'Audit Outlook Inbox Rules & registered MFA methods for attacker persistence',
      'Uninstall Microsoft Word from the user’s PC',
      'Ignore it for 24 hours to monitor outbound mail',
    ],
    correctIndices: [0, 1],
    hints: [
      'Does simply changing a password immediately kick out an attacker holding a stolen OAuth refresh token?',
      'Think containment (kill active tokens) + persistence hunt (mailbox forwarding rules & attacker-added MFA phones).',
    ],
    explanation:
      'HOW & WHY: Resetting the password alone does NOT invalidate existing active OAuth/refresh tokens. Immediately click "Revoke sessions" in Entra ID and inspect Outlook Inbox forwarding/delete rules plus registered MFA methods so the attacker cannot stay inside.',
  },
  {
    id: 'it-q17',
    trackId: 'it-support',
    domainId: 'm365-security',
    difficulty: 'medium',
    topic: 'PowerShell TCP Port Diagnostics',
    prompt:
      'A user on VPN cannot map \\\\files01.corp\\finance. Standard ping fails because ICMP is blocked by policy. Which PowerShell command tests whether TCP port 445 (SMB) actually completes a handshake?',
    options: [
      'Test-NetConnection files01.corp -Port 445',
      'ping files01.corp:445',
      'ipconfig /all 445',
      'Get-Process -Port 445',
    ],
    correctIndices: [0],
    hints: [
      'Standard ping uses ICMP, not TCP ports, and cannot accept `:445`.',
      'PowerShell’s modern networking cmdlet replaces telnet for port reachability tests.',
    ],
    explanation:
      'HOW & WHY: "Test-NetConnection files01.corp -Port 445" executes a real TCP 3-way handshake against port 445 and returns TcpTestSucceeded: True or False, proving whether SMB traffic is permitted.',
  },
  {
    id: 'it-q18-dd-tools',
    domainId: 'hardware-os',
    trackId: 'it-support',
    difficulty: 'easy',
    topic: 'Help Desk CLI Tool Matching',
    questionType: 'drag-drop',
    prompt: 'Drag (or tap) each Windows/AD command on the left into its matching help desk troubleshooting task.',
    dragDrop: {
      items: ['sfc /scannow', 'gpresult /r', 'ipconfig /flushdns', 'dsa.msc'],
      targets: [
        { id: 'hd-sfc', slotLabel: 'Scan and restore corrupted Windows OS files', correctItem: 'sfc /scannow' },
        { id: 'hd-gpo', slotLabel: 'Inspect which Group Policy Objects applied to a PC', correctItem: 'gpresult /r' },
        { id: 'hd-dns', slotLabel: 'Clear stale local DNS hostname resolution cache', correctItem: 'ipconfig /flushdns' },
        { id: 'hd-aduc', slotLabel: 'Open Active Directory Users and Computers console', correctItem: 'dsa.msc' },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      'Match prefixes: sfc = System File Checker, gp = Group Policy, dns = ipconfig, dsa.msc = Directory Service Administration (ADUC).',
      'OS files -> sfc /scannow; GPOs -> gpresult /r; DNS cache -> ipconfig /flushdns; ADUC -> dsa.msc.',
    ],
    explanation:
      'HOW & WHY: sfc /scannow repairs protected OS files, gpresult /r prints Resultant Set of Policy, ipconfig /flushdns purges local DNS cache, and dsa.msc opens Active Directory Users and Computers.',
  },
  {
    id: 'it-q19-dd-itsm',
    domainId: 'ticketing-itsm',
    trackId: 'it-support',
    difficulty: 'medium',
    topic: 'ITSM Ticket Classification',
    questionType: 'drag-drop',
    prompt: 'Match each workplace scenario to its proper ITSM ticket classification.',
    dragDrop: {
      items: ['P1 Critical Incident', 'Service Request', 'Problem Record', 'Change Request'],
      targets: [
        {
          id: 'itsm-p1',
          slotLabel: 'Company-wide email outage halting all departments with no workaround',
          correctItem: 'P1 Critical Incident',
        },
        {
          id: 'itsm-sr',
          slotLabel: 'Onboarding task requesting Adobe Acrobat license and shared drive access',
          correctItem: 'Service Request',
        },
        {
          id: 'itsm-prob',
          slotLabel: 'Root-cause investigation into why 12 laptops crashed after Patch Tuesday',
          correctItem: 'Problem Record',
        },
        {
          id: 'itsm-chg',
          slotLabel: 'Scheduled weekend maintenance window to upgrade the core firewall',
          correctItem: 'Change Request',
        },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      'Incident = restore service fast; Problem = find recurring root cause; Change = planned maintenance; Service Request = standard fulfillment.',
      '12 crashes -> Problem Record; firewall upgrade -> Change Request; Adobe access -> Service Request.',
    ],
    explanation:
      'HOW & WHY: Incidents restore unplanned outages (P1 for company-wide stoppage), Service Requests fulfill standard requests, Problem Records uncover recurring root causes across multiple incidents, and Change Requests govern planned system changes.',
  },
  {
    id: 'it-q20-sim-dns',
    domainId: 'endpoint-network',
    trackId: 'it-support',
    difficulty: 'hard',
    topic: 'Simlet: VPN Split-Tunnel & DNS Triage',
    questionType: 'simlet',
    prompt:
      'A remote employee connected to corporate VPN cannot open https://intranet.corp.local, though public websites like google.com load normally. Inspect all three ticket/CLI tabs to identify the root cause.',
    exhibitTabs: [
      {
        title: 'Ticket #INC-4812',
        output: `User: mchen (Remote - Home Wi-Fi + AnyConnect VPN)\nSymptom: "I connected to VPN and can browse Google/Slack, but intranet.corp.local says site can't be reached."`,
      },
      {
        title: 'Endpoint: ipconfig /all',
        output: `Ethernet adapter Cisco AnyConnect VPN:\n   IPv4 Address. . . . . . . . . . . : 10.240.12.44\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . :\n   DNS Servers . . . . . . . . . . . : 10.10.0.50\n\nWireless LAN adapter Wi-Fi:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.23\n   Default Gateway . . . . . . . . . : 192.168.1.1\n   DNS Servers . . . . . . . . . . . : 192.168.1.1`,
      },
      {
        title: 'Endpoint: ping & nslookup',
        output: `C:\\> ping 10.10.20.80\nReply from 10.10.20.80: bytes=32 time=28ms TTL=126\n\nC:\\> nslookup intranet.corp.local\nServer:  home-router.lan\nAddress:  192.168.1.1\n\n*** home-router.lan can't find intranet.corp.local: Non-existent domain`,
      },
    ],
    options: [
      'The user’s home Wi-Fi has no internet connectivity.',
      'The VPN tunnel failed to assign an internal 10.240.x.x IP address.',
      'Windows queried the home router DNS (192.168.1.1) instead of the internal corporate DNS (10.10.0.50), so internal ".corp.local" names fail to resolve even though VPN IP routing works.',
      'Port 443 is blocked on Google.com.',
    ],
    correctIndices: [2],
    hints: [
      'Compare Tab 2 and Tab 3: can the PC reach internal server IP 10.10.20.80? And WHICH DNS server answered nslookup?',
      'Ping to 10.10.20.80 succeeded! Yet nslookup asked 192.168.1.1 (home router) instead of corporate DNS 10.10.0.50.',
    ],
    explanation:
      'HOW & WHY: Pinging the intranet server IP (10.10.20.80) succeeds over the VPN tunnel, proving routing works. However, nslookup queried 192.168.1.1 (the home ISP router), which has no knowledge of private ".corp.local" records instead of corporate DNS 10.10.0.50.',
  },
  {
    id: 'it-q21-sim-ad',
    domainId: 'identity-ad',
    trackId: 'it-support',
    difficulty: 'hard',
    topic: 'Simlet: Shared Folder Access Denied',
    questionType: 'simlet',
    prompt:
      'User "arivera" was added to the Finance shared drive group 10 minutes ago by Tier 1, yet still sees "Access Denied" when browsing \\\\files01\\Finance. Inspect the three tabs to determine the exact fix.',
    exhibitTabs: [
      {
        title: 'Ticket #INC-5109',
        output: `User: arivera | Host: FIN-WS-019\nNote: "Added arivera to SG_Finance_RW in ADUC 10 mins ago. User closed and reopened File Explorer, still gets Access Denied."`,
      },
      {
        title: 'ADUC: Member Of (arivera)',
        output: `Account status: Enabled (Not Locked)\nMember Of:\n - Domain Users\n - SG_AllStaff\n - SG_Finance_RW`,
      },
      {
        title: 'FIN-WS-019: whoami /groups',
        output: `GROUP INFORMATION\n-----------------\nGroup Name                       Type    SID\nCORP\\Domain Users                Group   S-1-5-21-...-513\nCORP\\SG_AllStaff                 Group   S-1-5-21-...-1402\n(SG_Finance_RW NOT PRESENT IN CURRENT LOGON TOKEN)`,
      },
    ],
    options: [
      'Delete arivera from Domain Users.',
      'The user’s active Windows Kerberos session token was built before the group change—have arivera sign out and sign back in (or run klist purge + lock/unlock) to refresh the token.',
      'Run sfc /scannow on FIN-WS-019.',
      'Restart the corporate domain controller.',
    ],
    correctIndices: [1],
    hints: [
      'Tab 2 confirms ADUC already shows SG_Finance_RW. Now inspect Tab 3 ("whoami /groups") on the user’s workstation.',
      'SG_Finance_RW is missing from the local logon session because the user never signed out and back in.',
    ],
    explanation:
      'HOW & WHY: Closing File Explorer does NOT refresh a Windows security token. "whoami /groups" proves SG_Finance_RW is missing from the current Kerberos logon session; signing out and signing back in acquires a fresh TGT containing the new group SID.',
  },
  {
    id: 'it-q22-sim-printer',
    domainId: 'm365-security',
    trackId: 'it-support',
    difficulty: 'hard',
    topic: 'Simlet: Multi-User SMB Share Outage Escalation',
    questionType: 'simlet',
    prompt:
      'Four users on Floor 2 suddenly cannot open mapped drive S: (\\\\srv-app02\\Sales). Inspect the diagnostic tabs to decide the right next step and escalation note.',
    exhibitTabs: [
      {
        title: 'User Endpoint: ipconfig & ping',
        output: `IPv4 Address: 10.20.2.45 | Gateway: 10.20.2.1\n\nC:\\> ping srv-app02.corp\nPinging srv-app02.corp [10.99.4.20] with 32 bytes of data:\nReply from 10.99.4.20: bytes=32 time=2ms TTL=127`,
      },
      {
        title: 'PowerShell: Test-NetConnection',
        output: `PS C:\\> Test-NetConnection srv-app02.corp -Port 445\nComputerName     : srv-app02.corp\nRemoteAddress    : 10.99.4.20\nRemotePort       : 445\nTcpTestSucceeded : False`,
      },
      {
        title: 'Ticket Queue Note',
        output: `Affected users: 4 users in Subnet 10.20.2.0/24 (Floor 2)\nFloor 3 users (10.20.3.0/24) report S: drive works normally.`,
      },
    ],
    options: [
      'Replace all four users’ laptops because their NICs failed.',
      'Flush DNS on one user’s PC because DNS is broken.',
      'DNS and IP routing to 10.99.4.20 work, but TCP 445 (SMB) fails specifically from 10.20.2.0/24; escalate to Network/Sysadmin with Test-NetConnection proof to inspect firewall/ACL rules between Floor 2 and srv-app02.',
      'Reset all four users’ M365 MFA tokens.',
    ],
    correctIndices: [2],
    hints: [
      'Tab 1 shows ping resolves srv-app02.corp to 10.99.4.20 AND gets replies! Tab 2 tests TCP 445 (SMB). Tab 3 compares Floor 2 vs Floor 3.',
      'Since DNS & ping work while SMB port 445 fails ONLY for Floor 2 (10.20.2.0/24), an ACL or firewall rule is blocking Floor 2.',
    ],
    explanation:
      'HOW & WHY: Name resolution (10.99.4.20) and ICMP reachability both succeed, while TCP 445 (SMB) fails specifically from Floor 2 (10.20.2.0/24) even as Floor 3 works normally. Escalating with Test-NetConnection evidence pinpoints a subnet ACL/firewall block for Tier 2/Network Engineering.',
  },
];

export const IT_SUPPORT_EXAM_QUESTIONS: ExamQuestion[] = [
  ...CORE_IT_SUPPORT_QUESTIONS,
  ...IT_SUPPORT_QUESTIONS_PART_1,
  ...IT_SUPPORT_QUESTIONS_PART_2,
];
