export type SimSkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SimDeskTier = 'tier-1' | 'tier-2';

export interface SimChatOption {
  id: string;
  question: string;
  userReply: string;
  quality: 'helpful' | 'neutral' | 'poor';
  feedbackNote: string;
  unlocksClue?: string;
}

export interface SimCliResponse {
  match: string[];
  label: string;
  output: string;
  isKeyFinding?: boolean;
}

export interface SimConsoleAction {
  id: string;
  label: string;
  targetTab: 'directory' | 'diagnostics';
  effectSummary: string;
  mutatesDirectory?: Partial<SimDirectoryState>;
  mutatesDiagnostics?: Partial<SimDiagnosticsState>;
  requiresChatId?: string;
  warningIfPremature?: string;
}

export interface SimDirectoryState {
  displayName: string;
  upn: string;
  department: string;
  ou: string;
  accountEnabled: boolean;
  lockedOut: boolean;
  badPwdCount: number;
  passwordLastSet: string;
  groups: string[];
  m365License: string;
  mfaStatus: string;
  activeSessions: string;
  inboxRules: string;
  bitlockerKey: string;
}

export interface SimDiagnosticsState {
  hostOs: string;
  uptime: string;
  ipv4: string;
  dnsServer: string;
  services: { name: string; status: string; detail: string }[];
  eventLogs: { time: string; source: string; eventId: string; summary: string }[];
  hardwareSummary: string;
}

export interface ServiceDeskScenario {
  id: string;
  ticketNumber: string;
  priority: 'P1 Critical' | 'P2 High' | 'P3 Medium' | 'P4 Low';
  skillLevel: SimSkillLevel;
  deskTier: SimDeskTier;
  category: string;
  requesterName: string;
  requesterRole: string;
  department: string;
  deviceHostname: string;
  subject: string;
  initialMessage: string;
  slaTarget: string;
  chatOptions: SimChatOption[];
  cliHintCommands: string[];
  cliResponses: SimCliResponse[];
  initialDirectory: SimDirectoryState;
  initialDiagnostics: SimDiagnosticsState;
  consoleActions: SimConsoleAction[];
  expectedActionIds: string[];
  expectedChatIds: string[];
  rootCauseOptions: string[];
  correctRootCauseIdx: number;
  resolutionOptions: string[];
  correctResolutionIdx: number;
  hints: [string, string];
  howAndWhy: string;
}

export const SERVICE_DESK_SCENARIOS: ServiceDeskScenario[] = [
  // ==================== BEGINNER · TIER 1 ====================
  {
    id: 'sim-b1-dock',
    ticketNumber: 'INC-1042',
    priority: 'P2 High',
    skillLevel: 'beginner',
    deskTier: 'tier-1',
    category: 'Hardware & Peripherals',
    requesterName: 'Jordan Vance',
    requesterRole: 'Account Executive',
    department: 'Sales',
    deviceHostname: 'SLS-LT-204',
    subject: 'My desk monitors are completely black before my client demo!',
    initialMessage:
      'Hi IT, I just got to my desk and plugged in my laptop. Both of my desk monitors are completely black. My client demo starts in 15 minutes—please help!',
    slaTarget: '15m First Response / 2h Resolve',
    chatOptions: [
      {
        id: 'b1-c1',
        question: 'Is your laptop charging through the USB-C dock, and do your USB mouse/keyboard still work?',
        userReply:
          'Yes! The charging light is on and my wireless mouse dongle plugged into the dock works fine. Just the two DisplayPort monitors say "No Signal".',
        quality: 'helpful',
        feedbackNote: 'Confirmed power delivery and USB data work—isolates the fault to video signaling (DP Alt-Mode / dock / cables).',
        unlocksClue: 'Dock provides power + USB data; only video output is failing.',
      },
      {
        id: 'b1-c2',
        question: 'Could you unplug one monitor from the dock and plug it directly into your laptop HDMI port as a 10-second test?',
        userReply:
          'Hold on... plugging monitor #1 straight into the laptop HDMI port worked immediately! The screen lit right up!',
        quality: 'helpful',
        feedbackNote: 'Layer-1 divide-and-conquer test proved the laptop GPU and monitor work—fault sits inside the dock or USB-C video link.',
        unlocksClue: 'Direct HDMI works immediately -> Laptop & Monitor are healthy; Dock video path is stuck.',
      },
      {
        id: 'b1-c3',
        question: 'Did you try reinstalling Windows yet? Usually black screens mean a corrupted OS.',
        userReply:
          'Reinstalling Windows?! My demo is in 12 minutes! Can we please check the cables before wiping my PC?',
        quality: 'poor',
        feedbackNote: 'Never jump to reimaging before basic Layer-1 cable/dock isolation.',
      },
    ],
    cliHintCommands: ['systeminfo', 'pnputil /enum-devices /class Display'],
    cliResponses: [
      {
        match: ['systeminfo', 'uptime'],
        label: 'Check System Uptime & OS',
        output: `Host Name:                 SLS-LT-204\nOS Name:                   Microsoft Windows 11 Enterprise\nSystem Boot Time:          34 days, 6 hours, 12 minutes ago (Fast Startup active)\nSystem Model:              Latitude 7440`,
        isKeyFinding: true,
      },
      {
        match: ['pnputil', 'display', 'device'],
        label: 'Inspect Display & Dock Drivers',
        output: `Instance ID: DISPLAY\\DEL4120\\... Status: Disconnected\nInstance ID: USB\\VID_413C&PID_B06E (WD19TB Dock) Status: Started (Warning: DP MST hub reset required)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Jordan Vance',
      upn: 'jvance@corp.local',
      department: 'Sales',
      ou: 'OU=Sales,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '18 days ago',
      groups: ['Domain Users', 'SG_Sales_All'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal (Office IP)',
      inboxRules: 'None',
      bitlockerKey: '482910-112044-998123-774120-558291-663201-440192-881203',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise 23H2',
      uptime: '34 days, 6 hours (Shut down used daily with Fast Startup)',
      ipv4: '10.20.14.88',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'DisplayPolicyService', status: 'Running', detail: 'Active' },
        { name: 'Print Spooler', status: 'Running', detail: '0 jobs' },
      ],
      eventLogs: [
        {
          time: '08:42 AM',
          source: 'DisplayLink / UCSI',
          eventId: '4101',
          summary: 'USB-C Type-C PD Alt-Mode negotiation timed out on external MST hub.',
        },
      ],
      hardwareSummary: 'Dock: Dell WD19TB · Laptop HDMI tested OK · Dock power-cycle pending.',
    },
    consoleActions: [
      {
        id: 'b1-powercycle-dock',
        label: 'Guide User: Power-Cycle Dock (Unplug AC 15s) & Restart Windows',
        targetTab: 'diagnostics',
        effectSummary: 'User unplugged dock AC for 15s and clicked Windows Restart (clearing 34-day Fast Startup session). Both monitors restored!',
        mutatesDiagnostics: {
          uptime: '0 days, 0 hours (Clean Restart)',
          hardwareSummary: 'Dock power-cycled cleanly; DP Alt-Mode MST hub active on 2 external displays.',
        },
      },
    ],
    expectedActionIds: ['b1-powercycle-dock'],
    expectedChatIds: ['b1-c1', 'b1-c2'],
    rootCauseOptions: [
      'The USB-C dock’s DisplayPort MST video controller hung (plus 34-day Fast Startup stale driver state), while laptop GPU and monitors work.',
      'The user’s Active Directory password expired.',
      'Both Dell monitors suffered simultaneous hardware power failure.',
      'DNS resolution failed for external websites.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Power-cycle the USB-C dock (remove AC + laptop cable 15s) and have the user run Restart (not Shut down) to reload display/USB-C drivers, keeping HDMI backup ready for the demo.',
      'Escalate immediately as a P1 server outage to Network Engineering.',
      'Reset the user’s Microsoft 365 MFA token and password.',
      'Order two replacement monitors and tell the user to cancel the client demo.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Start with Layer-1 physical isolation in Chat: separate whether the laptop/monitors work from whether the dock’s video hub is hung.',
      'Run `systeminfo` in the CLI too—notice the 34-day uptime caused by Fast Startup! Power-cycling the dock + Windows Restart solves it before the demo.',
    ],
    howAndWhy:
      'HOW & WHY: When USB power/mouse work on a dock but monitors are black, plugging one monitor directly into the laptop HDMI isolates the dock in 10 seconds. USB-C docks frequently hang DP Alt-Mode negotiation when laptops hibernate via Windows Fast Startup for weeks. A 15-second AC power-cycle of the dock plus a clean Windows Restart resolves the issue immediately.',
  },
  {
    id: 'sim-b2-spooler',
    ticketNumber: 'INC-1055',
    priority: 'P3 Medium',
    skillLevel: 'beginner',
    deskTier: 'tier-1',
    category: 'OS & Printing',
    requesterName: 'Elena Rostova',
    requesterRole: 'Legal Coordinator',
    department: 'Legal',
    deviceHostname: 'LGL-WS-019',
    subject: 'Printer stuck on "Deleting" and blocking all documents',
    initialMessage:
      'Every time I try to print a contract PDF, nothing comes out. I tried canceling the first job an hour ago and now 4 jobs say "Deleting - Printing" forever.',
    slaTarget: '1h Response / 4h Resolve',
    chatOptions: [
      {
        id: 'b2-c1',
        question: 'Can other people on your floor still print to that same office printer normally?',
        userReply:
          'Yes! My coworker right next to me just printed 10 pages to the exact same copier. Only my PC is jammed.',
        quality: 'helpful',
        feedbackNote: 'Isolated the fault to the local workstation print queue rather than the shared printer hardware or print server.',
        unlocksClue: 'Coworkers print fine -> issue is strictly in LGL-WS-019 local Windows Print Spooler.',
      },
      {
        id: 'b2-c2',
        question: 'Have you opened the printer tray to check for a paper jam?',
        userReply:
          'The copier itself has no error lights and everyone else is printing to it.',
        quality: 'neutral',
        feedbackNote: 'Fair physical check, though queue "Deleting" across a single workstation usually points to a wedged local spooler.',
      },
    ],
    cliHintCommands: ['sc query spooler', 'net stop spooler', 'del /q /f C:\\Windows\\System32\\spool\\PRINTERS\\*', 'net start spooler'],
    cliResponses: [
      {
        match: ['sc query spooler', 'get-service spooler'],
        label: 'Check Print Spooler Service',
        output: `SERVICE_NAME: spooler\n        STATE              : 4  RUNNING (4 stalled .SPL/.SHD files locked in spool\\PRINTERS)`,
        isKeyFinding: true,
      },
      {
        match: ['net stop spooler', 'stop-service spooler'],
        label: 'Stop Print Spooler',
        output: `The Print Spooler service is stopping.\nThe Print Spooler service was stopped successfully.`,
      },
      {
        match: ['del ', 'printers', 'clear'],
        label: 'Clear Stuck Spool Files',
        output: `Deleted 4 orphaned spool files from C:\\Windows\\System32\\spool\\PRINTERS\\.`,
      },
      {
        match: ['net start spooler', 'start-service spooler'],
        label: 'Restart Print Spooler',
        output: `The Print Spooler service is starting.\nThe Print Spooler service was started successfully. Queue count: 0.`,
      },
    ],
    initialDirectory: {
      displayName: 'Elena Rostova',
      upn: 'erostova@corp.local',
      department: 'Legal',
      ou: 'OU=Legal,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '41 days ago',
      groups: ['Domain Users', 'SG_Legal_Staff'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '119204-552910-883102-449182-102938-448192-774819-992011',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise 22H2',
      uptime: '4 days, 2 hours',
      ipv4: '10.20.8.41',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'Print Spooler (spooler)', status: 'Running (Jammed)', detail: '4 jobs stuck in "Deleting" state' },
        { name: 'BITS', status: 'Running', detail: 'Idle' },
      ],
      eventLogs: [
        {
          time: '09:15 AM',
          source: 'PrintService',
          eventId: '372',
          summary: 'The document Contract_v4.pdf failed to print; orphaned .SPL/.SHD shadow file locking spooler queue.',
        },
      ],
      hardwareSummary: 'Network Printer: HP-LGL-MFP01 (Online; other users printing normally).',
    },
    consoleActions: [
      {
        id: 'b2-clear-spooler',
        label: 'Stop Print Spooler -> Purge \\spool\\PRINTERS -> Start Spooler',
        targetTab: 'diagnostics',
        effectSummary: 'Stopped spooler, deleted 4 corrupted .SPL/.SHD files, and restarted Print Spooler cleanly.',
        mutatesDiagnostics: {
          services: [
            { name: 'Print Spooler (spooler)', status: 'Running (Healthy)', detail: '0 jobs queued' },
            { name: 'BITS', status: 'Running', detail: 'Idle' },
          ],
        },
      },
    ],
    expectedActionIds: ['b2-clear-spooler'],
    expectedChatIds: ['b2-c1'],
    rootCauseOptions: [
      'A corrupted .SPL/.SHD spool file locked the local Windows Print Spooler service on LGL-WS-019.',
      'The office HP copier ran out of network IP addresses.',
      'Elena was removed from Active Directory.',
      'The Ethernet cable on LGL-WS-019 is unplugged.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Stop the Print Spooler service, delete the stuck .SPL/.SHD files in C:\\Windows\\System32\\spool\\PRINTERS, restart Print Spooler, and test a print page with Elena.',
      'Replace the office copier hardware fuser unit.',
      'Reset Elena’s Active Directory password and revoke M365 tokens.',
      'Uninstall Microsoft Office from LGL-WS-019.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'First ask in Chat if coworkers can print—if yes, the fault is strictly local to Elena’s PC.',
      'Use the Diagnostics console (or CLI `net stop spooler` -> clear `spool\\PRINTERS` -> `net start spooler`) to purge the wedged queue.',
    ],
    howAndWhy:
      'HOW & WHY: When Windows print jobs freeze on "Deleting", an application or corrupted PDF left an orphaned `.SPL`/`.SHD` file locked inside `C:\\Windows\\System32\\spool\\PRINTERS`. Stopping the `spooler` service releases the file lock so you can delete the stuck files and restart the service cleanly.',
  },
  {
    id: 'sim-b3-onboarding',
    ticketNumber: 'REQ-1061',
    priority: 'P3 Medium',
    skillLevel: 'beginner',
    deskTier: 'tier-1',
    category: 'Service Request & Onboarding',
    requesterName: 'Marcus Chen',
    requesterRole: 'Marketing Director',
    department: 'Marketing',
    deviceHostname: 'New Hire Provisioning',
    subject: 'New Hire Access Setup: Maya Lin starts Monday',
    initialMessage:
      'Hi Help Desk, Maya Lin (mlin@corp.local) starts Monday in Marketing. Please get her account ready so she can access Marketing files and remote VPN.',
    slaTarget: 'Standard Request (24h)',
    chatOptions: [
      {
        id: 'b3-c1',
        question: 'Please confirm your HR Onboarding Approval ID and which specific Marketing folder/VPN access Maya requires.',
        userReply:
          'HR Approval ID is #HR-9921. She needs Marketing SharePoint/Shared Drive Read-Write (SG_Marketing_RW), Remote VPN access (SG_VPN_Users), and a standard Microsoft 365 E3 license.',
        quality: 'helpful',
        feedbackNote: 'Proper access-control hygiene: confirmed manager/HR authorization and exact least-privilege security groups.',
        unlocksClue: 'Approved via #HR-9921: Enable AD account, place in OU=Marketing, add SG_Marketing_RW + SG_VPN_Users, assign M365 E3.',
      },
      {
        id: 'b3-c2',
        question: 'Should I just add Maya to Domain Admins so she never runs into any permission errors?',
        userReply:
          'Definitely NOT! Please follow standard least privilege—she is a Marketing Coordinator, not an administrator.',
        quality: 'poor',
        feedbackNote: 'Violates Principle of Least Privilege—never grant administrative groups for standard department onboarding.',
      },
    ],
    cliHintCommands: ['whoami /groups'],
    cliResponses: [
      {
        match: ['whoami', 'net user'],
        label: 'Verify AD Provisioning Template',
        output: `Standard Marketing Onboarding Checklist:\n1. Account Status: Enabled (Must change password at first logon)\n2. OU: OU=Marketing,OU=Users,DC=corp,DC=local\n3. Groups: Domain Users, SG_Marketing_RW, SG_VPN_Users\n4. License: Microsoft 365 E3`,
      },
    ],
    initialDirectory: {
      displayName: 'Maya Lin',
      upn: 'mlin@corp.local',
      department: 'Marketing',
      ou: 'OU=Staging,DC=corp,DC=local',
      accountEnabled: false,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: 'Never (Temp password pending)',
      groups: ['Domain Users'],
      m365License: 'Unlicensed',
      mfaStatus: 'Pending First Sign-In Registration',
      activeSessions: 'None',
      inboxRules: 'None',
      bitlockerKey: 'Pending laptop enrollment',
    },
    initialDiagnostics: {
      hostOs: 'Provisioning Staging Object',
      uptime: 'N/A',
      ipv4: 'N/A',
      dnsServer: 'N/A',
      services: [{ name: 'AD Connect Sync', status: 'Running', detail: 'Syncs every 30 min' }],
      eventLogs: [
        {
          time: '08:00 AM',
          source: 'HR-Webhook',
          eventId: '100',
          summary: 'Pre-staged user mlin@corp.local in OU=Staging awaiting Tier 1 onboarding fulfillment.',
        },
      ],
      hardwareSummary: 'Laptop MKT-LT-088 assigned for Monday pickup.',
    },
    consoleActions: [
      {
        id: 'b3-enable-ad',
        label: 'Enable AD Account & Move to OU=Marketing',
        targetTab: 'directory',
        requiresChatId: 'b3-c1',
        warningIfPremature: 'Verify HR Approval & exact group requirements with Marcus in Chat before provisioning access!',
        effectSummary: 'Enabled Maya Lin account and moved object from Staging to OU=Marketing.',
        mutatesDirectory: {
          accountEnabled: true,
          ou: 'OU=Marketing,OU=Users,DC=corp,DC=local',
        },
      },
      {
        id: 'b3-add-groups',
        label: 'Add Security Groups: SG_Marketing_RW & SG_VPN_Users',
        targetTab: 'directory',
        requiresChatId: 'b3-c1',
        warningIfPremature: 'Confirm approved security groups with Marcus in Chat first.',
        effectSummary: 'Added SG_Marketing_RW and SG_VPN_Users to Maya Lin.',
        mutatesDirectory: {
          groups: ['Domain Users', 'SG_Marketing_RW', 'SG_VPN_Users'],
        },
      },
      {
        id: 'b3-assign-m365',
        label: 'Assign License: Microsoft 365 E3',
        targetTab: 'directory',
        requiresChatId: 'b3-c1',
        warningIfPremature: 'Confirm license tier with Marcus in Chat before assigning paid seats.',
        effectSummary: 'Assigned Microsoft 365 E3 license to mlin@corp.local.',
        mutatesDirectory: {
          m365License: 'Microsoft 365 E3',
        },
      },
    ],
    expectedActionIds: ['b3-enable-ad', 'b3-add-groups', 'b3-assign-m365'],
    expectedChatIds: ['b3-c1'],
    rootCauseOptions: [
      'Planned Service Request: Pre-staged new hire account requires enabling, OU placement, least-privilege group membership, and M365 license assignment.',
      'Major P1 Incident: Active Directory domain controller crashed.',
      'Hardware failure on Maya Lin’s laptop motherboard.',
      'Phishing compromise requiring session revocation.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Confirm HR approval #HR-9921, enable the account in OU=Marketing, add SG_Marketing_RW + SG_VPN_Users, assign Microsoft 365 E3, and share secure onboarding instructions with Marcus.',
      'Add Maya Lin to Domain Admins and close the ticket without replying.',
      'Tell Marcus that Marketing employees do not get email accounts.',
      'Escalate this routine Tier 1 Service Request to Tier 3 Firewall Engineering.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'First ask Marcus in Chat to confirm HR approval and the exact groups/license required.',
      'Open the AD / Entra Console tab and execute all three provisioning steps: Enable + OU, Add Groups, Assign M365 E3.',
    ],
    howAndWhy:
      'HOW & WHY: New-hire provisioning is a classic Tier 1 Service Request. Always confirm documented manager/HR approval first, apply least-privilege security groups (`SG_Marketing_RW`, `SG_VPN_Users`—never admin groups), assign the licensed M365 seat, and force password change + MFA setup at first login.',
  },

  // ==================== INTERMEDIATE · TIER 1 ====================
  {
    id: 'sim-i1-lockout',
    ticketNumber: 'INC-2014',
    priority: 'P2 High',
    skillLevel: 'intermediate',
    deskTier: 'tier-1',
    category: 'Active Directory & Identity',
    requesterName: 'Devon Brooks',
    requesterRole: 'Senior Financial Analyst',
    department: 'Finance',
    deviceHostname: 'FIN-LT-112',
    subject: 'My account keeps locking out every 15 minutes since this morning!',
    initialMessage:
      'Someone unlocked my account twice already today, and every 15 minutes Windows kicks me out saying "The referenced account is currently locked out." I cannot get any work done!',
    slaTarget: '15m Response / 1h Resolve',
    chatOptions: [
      {
        id: 'i1-c1',
        question: 'Did you change your corporate password recently, and do you have company email or Wi-Fi signed in on a phone or secondary device?',
        userReply:
          'Yes! I changed my password at 8:00 AM today, and I have Outlook/Apple Mail synced on my iPhone plus a mapped drive saved on my desktop.',
        quality: 'helpful',
        feedbackNote: 'Classic lockout pattern: password change leaves stale cached credentials retrying in the background.',
        unlocksClue: 'Password changed at 8:00 AM; iPhone Mail + saved Windows Credential Manager entries are likely retrying the old password.',
      },
      {
        id: 'i1-c2',
        question: 'Are you typing Caps Lock by mistake?',
        userReply:
          'No, it locks out even while I am not touching my keyboard!',
        quality: 'neutral',
        feedbackNote: 'Lockouts occurring hands-off confirm automated background credential retries.',
      },
    ],
    cliHintCommands: ['cmdkey /list', 'net user dbrooks /domain'],
    cliResponses: [
      {
        match: ['cmdkey', 'credential'],
        label: 'List Cached Windows Credentials',
        output: `Currently stored credentials:\n  Target: LegacyGeneric:target=files01.corp.local\n  User: CORP\\dbrooks (Password Saved 92 days ago - STALE!)\n  Target: MicrosoftOffice16_Data:ADAL`,
        isKeyFinding: true,
      },
      {
        match: ['net user', 'dbrooks'],
        label: 'Query AD Account Status',
        output: `User name                    dbrooks\nAccount active               Locked\nPassword last set            Today 08:01 AM\nBad password count           5 (Threshold: 5)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Devon Brooks',
      upn: 'dbrooks@corp.local',
      department: 'Finance',
      ou: 'OU=Finance,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: true,
      badPwdCount: 5,
      passwordLastSet: 'Today 08:01 AM',
      groups: ['Domain Users', 'SG_Finance_RW'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '994812-330192-448120-559201-664812-772910-881234-112904',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '2 days, 1 hour',
      ipv4: '10.20.30.18',
      dnsServer: '10.10.0.50',
      services: [{ name: 'Netlogon', status: 'Running', detail: 'Domain joined' }],
      eventLogs: [
        {
          time: '09:42 AM',
          source: 'Microsoft-Windows-Security-Auditing (DC01)',
          eventId: '4740',
          summary: 'A user account was locked out. Target: dbrooks | Caller Computer Name: EXCH-ACTIVESYNC-GW & FIN-LT-112.',
        },
        {
          time: '09:41 AM',
          source: 'Security Auditing',
          eventId: '4625',
          summary: 'An account failed to log on (Bad password). Source: Apple-iPhone-Mail & SMB Credential Manager.',
        },
      ],
      hardwareSummary: 'FIN-LT-112 + iPhone Mail ActiveSync profile holding old password.',
    },
    consoleActions: [
      {
        id: 'i1-unlock-ad',
        label: 'Unlock Active Directory Account (dbrooks)',
        targetTab: 'directory',
        effectSummary: 'Cleared lockout flag on dbrooks in ADUC (BadPwdCount reset to 0).',
        mutatesDirectory: {
          lockedOut: false,
          badPwdCount: 0,
        },
      },
      {
        id: 'i1-clear-credman',
        label: 'Purge Stale Credential Manager Entries & Guide iPhone Password Update',
        targetTab: 'diagnostics',
        effectSummary: 'Removed stale files01.corp.local credential from Windows Credential Manager and walked user through updating iPhone Mail password.',
        mutatesDiagnostics: {
          hardwareSummary: 'FIN-LT-112 Credential Manager cleared; iPhone Mail updated to new password.',
        },
      },
    ],
    expectedActionIds: ['i1-unlock-ad', 'i1-clear-credman'],
    expectedChatIds: ['i1-c1'],
    rootCauseOptions: [
      'Background apps holding the pre-8:00 AM password (iPhone Mail ActiveSync + stale Windows Credential Manager entry) repeatedly hit the 5-attempt lockout threshold.',
      'Someone physically unplugged the domain controller network cable.',
      'The Print Spooler crashed on FIN-LT-112.',
      'Devon needs a new Ethernet patch cable.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Inspect Event ID 4740, unlock the AD account, purge stale entries in Windows Credential Manager (`cmdkey`), and guide Devon to update the password on their iPhone Mail/Wi-Fi profile so it stops re-locking.',
      'Unlock the AD account only and close the ticket without checking what caused the lockouts.',
      'Disable the company’s Active Directory account lockout policy globally.',
      'Reimage FIN-LT-112 immediately.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Simply clicking Unlock without finding the source means the account will lock again in 15 minutes!',
      'Check Event ID 4740 in Diagnostics and `cmdkey /list` in CLI—both point to iPhone ActiveSync + cached Credential Manager.',
    ],
    howAndWhy:
      'HOW & WHY: Recurring lockouts right after a password reset almost always come from cached old passwords retrying silently in the background. Domain Controller Security Event ID `4740` identifies the Caller Computer Name triggering the lockout. Unlocking AD alone is temporary—you MUST clear stale Windows Credential Manager entries and update mobile Mail/Wi-Fi profiles.',
  },
  {
    id: 'sim-i2-kerberos',
    ticketNumber: 'INC-2029',
    priority: 'P3 Medium',
    skillLevel: 'intermediate',
    deskTier: 'tier-1',
    category: 'Active Directory & Permissions',
    requesterName: 'Aria Rivera',
    requesterRole: 'Budget Analyst',
    department: 'Finance',
    deviceHostname: 'FIN-WS-019',
    subject: 'Still getting Access Denied to \\\\files01\\Finance after you added me!',
    initialMessage:
      'Someone on the desk told me they gave me access to the Finance shared folder 15 minutes ago. I closed File Explorer and reopened it, and it STILL says Access Denied!',
    slaTarget: '30m Response / 4h Resolve',
    chatOptions: [
      {
        id: 'i2-c1',
        question: 'Did you completely sign out of Windows (or restart) after the permission was added, or only close File Explorer?',
        userReply:
          'I only closed File Explorer and reopened it! I have been signed into Windows since 7:30 AM.',
        quality: 'helpful',
        feedbackNote: 'Closing File Explorer does NOT update a Windows Kerberos logon token.',
        unlocksClue: 'User has stayed logged in continuously since 7:30 AM before the group change.',
      },
    ],
    cliHintCommands: ['whoami /groups', 'klist purge', 'icacls \\\\files01\\Finance'],
    cliResponses: [
      {
        match: ['whoami /groups', 'whoami'],
        label: 'Inspect Active Kerberos Logon Token',
        output: `GROUP INFORMATION\n-----------------\nGroup Name                       Type    SID\nCORP\\Domain Users                Group   S-1-5-21-...-513\nCORP\\SG_AllStaff                 Group   S-1-5-21-...-1402\n[!] SG_Finance_RW IS MISSING FROM ACTIVE LOGON TOKEN`,
        isKeyFinding: true,
      },
      {
        match: ['klist purge', 'klist'],
        label: 'Purge Kerberos Tickets',
        output: `Current LogonId is 0:0x4a21c\nDeleting all tickets:\nCached Tickets: (4) purged. Instruct user to lock/unlock or sign out & sign back in.`,
      },
      {
        match: ['icacls', 'share'],
        label: 'Check Folder Share & NTFS Permissions',
        output: `Share Permissions: Authenticated Users -> Change\nNTFS Permissions: CORP\\SG_Finance_RW -> Modify (No Deny rules present)`,
      },
    ],
    initialDirectory: {
      displayName: 'Aria Rivera',
      upn: 'arivera@corp.local',
      department: 'Finance',
      ou: 'OU=Finance,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '22 days ago',
      groups: ['Domain Users', 'SG_AllStaff', 'SG_Finance_RW'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '771293-882910-445120-991029-338192-441209-661209-330192',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '1 day, 4 hours',
      ipv4: '10.20.30.55',
      dnsServer: '10.10.0.50',
      services: [{ name: 'Workstation (LanmanWorkstation)', status: 'Running', detail: 'SMB client active' }],
      eventLogs: [
        {
          time: '10:12 AM',
          source: 'SMBClient',
          eventId: '30803',
          summary: 'Access denied opening \\\\files01\\Finance — client Kerberos ticket lacks SG_Finance_RW SID.',
        },
      ],
      hardwareSummary: 'ADUC shows SG_Finance_RW present; active workstation token stale.',
    },
    consoleActions: [
      {
        id: 'i2-refresh-token',
        label: 'Verify Token Refresh (klist purge + Sign Out / Sign Back In)',
        targetTab: 'diagnostics',
        effectSummary: 'Aria signed out and back in; fresh Kerberos TGT includes SG_Finance_RW. \\\\files01\\Finance opened cleanly.',
        mutatesDiagnostics: {
          hardwareSummary: 'Kerberos TGT refreshed; SG_Finance_RW confirmed in whoami /groups; Finance share accessible.',
        },
      },
    ],
    expectedActionIds: ['i2-refresh-token'],
    expectedChatIds: ['i2-c1'],
    rootCauseOptions: [
      'Windows builds the user’s Kerberos group membership token only at logon; Aria stayed signed in since 7:30 AM so SG_Finance_RW was absent from her active token.',
      'NTFS permissions prohibit Finance members from viewing shared folders.',
      'Aria’s Active Directory account is locked out.',
      'The file server hard drive is completely full.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Confirm SG_Finance_RW in ADUC and Share/NTFS permissions, prove the missing SID via `whoami /groups`, and have Aria sign out and back in (or run `klist purge` + lock/unlock) to mint a fresh Kerberos token.',
      'Add Aria to Domain Admins so she bypasses NTFS permissions.',
      'Delete and recreate Aria’s Active Directory account.',
      'Escalate to Tier 3 Storage Engineering to rebuild the NAS.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Check ADUC first—you’ll notice `SG_Finance_RW` is ALREADY there! Then check `whoami /groups` in the Endpoint CLI.',
      'Because `whoami /groups` reflects the logon token created at sign-in, closing File Explorer never refreshes it.',
    ],
    howAndWhy:
      'HOW & WHY: Windows issues a user’s Kerberos Ticket Granting Ticket (TGT) and security token containing group SIDs at logon time. Adding a user to an AD Security Group does not update existing desktop sessions until they sign out and back in (or purge cached tickets with `klist purge` and re-authenticate).',
  },
  {
    id: 'sim-i3-apipa',
    ticketNumber: 'INC-2041',
    priority: 'P1 Critical',
    skillLevel: 'intermediate',
    deskTier: 'tier-1',
    category: 'Endpoint Networking',
    requesterName: 'Tessa Okafor',
    requesterRole: 'Support Team Lead',
    department: 'Customer Care',
    deviceHostname: 'CC-WS-204',
    subject: 'Internet is completely dead on my PC—and 8 coworkers next to me too!',
    initialMessage:
      'None of our wired desk PCs on Floor 2 East can open Outlook, Slack, or any website. Everything just spins and says "No Internet".',
    slaTarget: '10m Response / 1h Escalation',
    chatOptions: [
      {
        id: 'i3-c1',
        question: 'Can you confirm whether laptops on corporate Wi-Fi work, or is it specifically the wired desks on Floor 2 East?',
        userReply:
          'Wi-Fi on my phone and laptop still works fine! It’s specifically the 9 wired desktops plugged into Floor 2 East wall jacks.',
        quality: 'helpful',
        feedbackNote: 'Scope isolation: multi-user wired VLAN/DHCP outage vs single-PC failure.',
        unlocksClue: '9 wired PCs on Floor 2 East down while Wi-Fi works -> Switchport VLAN / DHCP relay / DHCP scope exhaustion on Floor 2 VLAN.',
      },
    ],
    cliHintCommands: ['ipconfig /all', 'ipconfig /renew', 'ping 127.0.0.1'],
    cliResponses: [
      {
        match: ['ipconfig /all', 'ipconfig'],
        label: 'Inspect IP Configuration',
        output: `Ethernet adapter Ethernet0:\n   Media State . . . . . . . . . . . : Media connected (1 Gbps)\n   DHCP Enabled. . . . . . . . . . . : Yes\n   Autoconfiguration IPv4 Address. . : 169.254.88.14(Preferred)\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . :\n   DNS Servers . . . . . . . . . . . :`,
        isKeyFinding: true,
      },
      {
        match: ['ipconfig /renew', 'renew'],
        label: 'Attempt DHCP Renewal',
        output: `An error occurred while renewing interface Ethernet0 : unable to contact your DHCP server. Request has timed out.`,
        isKeyFinding: true,
      },
      {
        match: ['ping 127.0.0.1', 'ping localhost'],
        label: 'Test Local TCP/IP Stack',
        output: `Reply from 127.0.0.1: bytes=32 time<1ms TTL=128 (Local NIC TCP/IP stack healthy)`,
      },
    ],
    initialDirectory: {
      displayName: 'Tessa Okafor',
      upn: 'tokafor@corp.local',
      department: 'Customer Care',
      ou: 'OU=Support,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '12 days ago',
      groups: ['Domain Users', 'SG_Care_Leads'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '551203-661920-112938-445102-881293-772819-330192-441209',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '3 days',
      ipv4: '169.254.88.14 (APIPA)',
      dnsServer: 'None assigned',
      services: [{ name: 'DHCP Client', status: 'Running', detail: 'No DHCPOFFER received' }],
      eventLogs: [
        {
          time: '10:30 AM',
          source: 'Dhcp-Client',
          eventId: '1001',
          summary: 'Your computer was not assigned an address from the network (DHCP Server). Assigned APIPA 169.254.88.14.',
        },
      ],
      hardwareSummary: 'Link light UP (1 Gbps) · 9 Floor 2 East wired endpoints all pulling 169.254.x.x.',
    },
    consoleActions: [
      {
        id: 'i3-escalate-netops',
        label: 'Package Evidence & Escalate P1/P2 to Network / Infrastructure Team',
        targetTab: 'diagnostics',
        requiresChatId: 'i3-c1',
        warningIfPremature: 'Confirm impact scope (single PC vs Floor 2 East wired group) in Chat before escalating!',
        effectSummary: 'Escalated to Network Team with 169.254.88.14 ipconfig proof, DHCP timeout logs, and Floor 2 East switchport scope. NetOps resolved exhausted DHCP pool / missing ip helper-address!',
        mutatesDiagnostics: {
          ipv4: '10.20.2.114 (DHCP Restored)',
          dnsServer: '10.10.0.50',
          hardwareSummary: 'Escalation accepted cleanly; Network Team fixed Floor 2 DHCP relay/scope.',
        },
      },
    ],
    expectedActionIds: ['i3-escalate-netops'],
    expectedChatIds: ['i3-c1'],
    rootCauseOptions: [
      'Multiple Floor 2 wired desktops are falling back to APIPA (169.254.0.0/16) because DHCP Discover packets receive no Offer (DHCP scope exhaustion or missing `ip helper-address` relay on that VLAN).',
      'Tessa’s local Chrome browser cache needs clearing.',
      'All 9 desktop network cards burned out simultaneously.',
      'Windows Fast Startup disabled Ethernet.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Verify scope (9 wired PCs affected while Wi-Fi works), capture `ipconfig /all` showing APIPA `169.254.88.14` and `ipconfig /renew` timeout, and escalate promptly with evidence to Network/Sysadmin to inspect the Floor 2 DHCP scope & relay.',
      'Manually assign random static IPs on 1 PC and close the ticket.',
      'Tell all 9 users to reboot 10 times without escalating.',
      'Flush DNS on Tessa’s PC and resolve the ticket.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Run `ipconfig /all` in CLI—look closely at the IPv4 address (`169.254.x.x`) and blank Default Gateway!',
      'Tier 1 cannot reconfigure switch VLAN helpers or server DHCP scopes, so gathering scope + `ipconfig` proof and escalating cleanly IS the winning move.',
    ],
    howAndWhy:
      'HOW & WHY: `169.254.0.0/16` is APIPA (Automatic Private IP Addressing), assigned when Windows gets zero response to DHCP Discover broadcasts. Seeing APIPA across 9 wired PCs on one floor while Wi-Fi works immediately rules out individual NIC hardware and points straight to the floor switch VLAN, `ip helper-address`, or an exhausted DHCP pool—requiring a crisp Tier 2/NetOps escalation with proof.',
  },

  // ==================== ADVANCED · TIER 2 ====================
  {
    id: 'sim-a1-vpn-dns',
    ticketNumber: 'INC-3012',
    priority: 'P2 High',
    skillLevel: 'advanced',
    deskTier: 'tier-2',
    category: 'VPN & Split-Tunnel DNS',
    requesterName: 'Mei-Ling Zhou',
    requesterRole: 'Product Manager',
    department: 'Product',
    deviceHostname: 'PRD-LT-077',
    subject: 'On VPN: Google & Slack work, but intranet.corp.local won’t load!',
    initialMessage:
      'I’m working from home on Cisco AnyConnect VPN. Google, Figma, and Slack all load super fast, but https://intranet.corp.local gives ERR_NAME_NOT_RESOLVED.',
    slaTarget: '15m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'a1-c1',
        question: 'Does the AnyConnect icon in your system tray show "Connected", and did this ever work on this home router before?',
        userReply:
          'Yes, AnyConnect says Connected (VPN IP 10.240.12.44). Actually I switched home ISPs yesterday to a new fiber router.',
        quality: 'helpful',
        feedbackNote: 'New home router confirms split-tunnel local ISP DNS binding interference.',
        unlocksClue: 'VPN tunnel is up; home ISP router changed yesterday.',
      },
    ],
    cliHintCommands: ['ipconfig /all', 'ping 10.10.20.80', 'nslookup intranet.corp.local', 'nslookup intranet.corp.local 10.10.0.50'],
    cliResponses: [
      {
        match: ['ipconfig /all', 'ipconfig'],
        label: 'Inspect VPN & Wi-Fi Adapters',
        output: `Cisco AnyConnect VPN Adapter:\n   IPv4 Address: 10.240.12.44\n   DNS Servers : 10.10.0.50\n\nWireless LAN adapter Wi-Fi:\n   IPv4 Address: 192.168.1.23\n   Default Gateway: 192.168.1.1\n   DNS Servers : 192.168.1.1 (Interface Metric: 15 - HIGHER PRIORITY!)`,
        isKeyFinding: true,
      },
      {
        match: ['ping 10.10.20.80'],
        label: 'Ping Intranet Server IP Directly',
        output: `Pinging 10.10.20.80 with 32 bytes of data:\nReply from 10.10.20.80: bytes=32 time=26ms TTL=126\n(VPN routing to internal server IP works!)`,
        isKeyFinding: true,
      },
      {
        match: ['nslookup intranet.corp.local 10.10.0.50'],
        label: 'Test Query Directly Against Corporate DNS',
        output: `Server:  dc-dns01.corp.local\nAddress:  10.10.0.50\n\nName:    intranet.corp.local\nAddress:  10.10.20.80`,
        isKeyFinding: true,
      },
      {
        match: ['nslookup intranet.corp.local'],
        label: 'Default nslookup Query',
        output: `Server:  home-router.lan\nAddress:  192.168.1.1\n\n*** home-router.lan can't find intranet.corp.local: Non-existent domain`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Mei-Ling Zhou',
      upn: 'mzhou@corp.local',
      department: 'Product',
      ou: 'OU=Product,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '14 days ago',
      groups: ['Domain Users', 'SG_VPN_Users', 'SG_Product'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '221904-882910-554120-991827-112904-663819-440192-772819',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '1 day',
      ipv4: '10.240.12.44 (VPN) / 192.168.1.23 (Wi-Fi)',
      dnsServer: '192.168.1.1 winning over 10.10.0.50',
      services: [{ name: 'Cisco AnyConnect Agent', status: 'Running', detail: 'Split-Tunnel Enabled' }],
      eventLogs: [
        {
          time: '11:04 AM',
          source: 'DNS Client Events',
          eventId: '1014',
          summary: 'Name resolution for intranet.corp.local fell back to Wi-Fi interface DNS 192.168.1.1.',
        },
      ],
      hardwareSummary: 'VPN Adapter interface metric (35) higher than Wi-Fi metric (15) causing DNS leak.',
    },
    consoleActions: [
      {
        id: 'a1-fix-vpn-dns',
        label: 'Apply NRPT Split-DNS Rule (.corp.local -> 10.10.0.50) & Lower VPN Interface Metric',
        targetTab: 'diagnostics',
        effectSummary: 'Set AnyConnect adapter metric to 5 and applied Name Resolution Policy Table rule for *.corp.local -> 10.10.0.50. Flushed DNS; intranet.corp.local loads cleanly.',
        mutatesDiagnostics: {
          dnsServer: '10.10.0.50 (Primary for *.corp.local)',
          hardwareSummary: 'VPN DNS binding fixed (Metric 5); intranet.corp.local resolves to 10.10.20.80.',
        },
      },
    ],
    expectedActionIds: ['a1-fix-vpn-dns'],
    expectedChatIds: ['a1-c1'],
    rootCauseOptions: [
      'VPN routing works (`ping 10.10.20.80` succeeds), but Windows sent DNS queries to the home ISP router (`192.168.1.1`) instead of internal DNS (`10.10.0.50`), so private `.corp.local` names fail.',
      'Mei-Ling is not in `SG_VPN_Users`.',
      'The corporate intranet server is powered off.',
      'Google.com blocked port 443.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Prove IP routing (`ping 10.10.20.80`) and corporate DNS (`nslookup intranet.corp.local 10.10.0.50`), lower the VPN adapter interface metric / enforce NRPT `.corp.local` -> `10.10.0.50`, and run `ipconfig /flushdns`.',
      'Tell the user to disable VPN permanently.',
      'Reset Mei-Ling’s Active Directory password.',
      'Replace the laptop’s SSD.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Compare `ping 10.10.20.80` vs `nslookup intranet.corp.local` in CLI—can the PC reach the server by IP?',
      'Look at which DNS server answered `nslookup`: the home router `192.168.1.1` knows nothing about private `.corp.local` records!',
    ],
    howAndWhy:
      'HOW & WHY: On split-tunnel VPNs, Windows sometimes prioritizes the home Wi-Fi adapter’s DNS (`192.168.1.1`) due to lower interface metrics or IPv6/DoH smart multi-homed name resolution. Testing `ping 10.10.20.80` separates routing from DNS, and `nslookup intranet.corp.local 10.10.0.50` proves internal DNS works—fixed via lower VPN adapter metric and NRPT split-DNS policy.',
  },
  {
    id: 'sim-a2-smb-acl',
    ticketNumber: 'INC-3044',
    priority: 'P2 High',
    skillLevel: 'advanced',
    deskTier: 'tier-2',
    category: 'Firewall / Port Diagnostics',
    requesterName: 'Carlos Mendez',
    requesterRole: 'Sales Operations',
    department: 'Sales',
    deviceHostname: 'SLS-WS-044',
    subject: 'Mapped drive S: (\\\\srv-app02\\Sales) stopped opening for Floor 2',
    initialMessage:
      'All four of us on Floor 2 lost access to mapped drive S: right after lunch. Strange thing—I can still ping srv-app02, and Floor 3 says their S: drive works fine!',
    slaTarget: '15m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'a2-c1',
        question: 'Did anyone on Floor 2 receive an "Access Denied" permission popup, or does Windows say the network path was not found / timed out?',
        userReply:
          'It hangs for 20 seconds and then says "Windows cannot access \\\\srv-app02\\Sales — Network path not found." No login or Access Denied prompt at all.',
        quality: 'helpful',
        feedbackNote: 'Timeout (rather than instant Access Denied) points to TCP port 445 connectivity/firewall filtering rather than NTFS permissions.',
        unlocksClue: 'Connection times out rather than denying credentials -> TCP 445 SMB transport blocked for Floor 2.',
      },
    ],
    cliHintCommands: ['ipconfig', 'ping srv-app02.corp', 'Test-NetConnection srv-app02.corp -Port 445'],
    cliResponses: [
      {
        match: ['ipconfig'],
        label: 'Verify Floor 2 Subnet',
        output: `IPv4 Address: 10.20.2.45\nSubnet Mask : 255.255.255.0\nGateway     : 10.20.2.1 (Floor 2 VLAN 20)`,
      },
      {
        match: ['ping srv-app02'],
        label: 'Test DNS & ICMP Reachability',
        output: `Pinging srv-app02.corp [10.99.4.20] with 32 bytes of data:\nReply from 10.99.4.20: bytes=32 time=2ms TTL=127`,
        isKeyFinding: true,
      },
      {
        match: ['test-netconnection', '445', 'tnc'],
        label: 'Test TCP Port 445 (SMB)',
        output: `ComputerName     : srv-app02.corp\nRemoteAddress    : 10.99.4.20\nRemotePort       : 445\nInterfaceAlias   : Ethernet0\nSourceAddress    : 10.20.2.45\nTcpTestSucceeded : False`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Carlos Mendez',
      upn: 'cmendez@corp.local',
      department: 'Sales',
      ou: 'OU=Sales,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '30 days ago',
      groups: ['Domain Users', 'SG_Sales_RW'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '882910-441209-772819-330192-554120-991827-112904-663819',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '5 days',
      ipv4: '10.20.2.45',
      dnsServer: '10.10.0.50',
      services: [{ name: 'LanmanWorkstation', status: 'Running', detail: 'Active' }],
      eventLogs: [
        {
          time: '12:45 PM',
          source: 'Firewall Change Audit',
          eventId: '5152',
          summary: 'Lunch firewall policy push modified VLAN 20 (10.20.2.0/24) outbound SMB TCP/445 rule.',
        },
      ],
      hardwareSummary: 'Ping to 10.99.4.20 succeeds; TCP 445 fails ONLY from 10.20.2.0/24 (Floor 3 works).',
    },
    consoleActions: [
      {
        id: 'a2-escalate-fw',
        label: 'Escalate to Network/Firewall Ops with Test-NetConnection Port 445 Proof',
        targetTab: 'diagnostics',
        requiresChatId: 'a2-c1',
        effectSummary: 'Submitted Tier 2 firewall escalation showing DNS + ICMP OK to 10.99.4.20 while TCP 445 fails specifically from 10.20.2.0/24. NetOps reverted the lunchtime ACL block!',
        mutatesDiagnostics: {
          hardwareSummary: 'Firewall rule restored for 10.20.2.0/24 -> TCP 445 TcpTestSucceeded: True; S: drive back online.',
        },
      },
    ],
    expectedActionIds: ['a2-escalate-fw'],
    expectedChatIds: ['a2-c1'],
    rootCauseOptions: [
      'DNS and ICMP to `10.99.4.20` work, but a lunchtime firewall/ACL change blocked TCP port 445 (SMB) specifically from Floor 2 (`10.20.2.0/24`) while Floor 3 (`10.20.3.0/24`) remains permitted.',
      'Carlos forgot his password and locked out his account.',
      'The DNS server has a stale IP for srv-app02.corp.',
      'All four Floor 2 monitors need HDMI cables replaced.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Prove DNS/ICMP work while `Test-NetConnection srv-app02.corp -Port 445` fails only for `10.20.2.0/24`, and escalate to Network/Firewall Ops with that exact source/destination/port evidence to restore the SMB rule.',
      'Flush DNS and tell Carlos it will fix itself overnight.',
      'Add Carlos to Domain Admins.',
      'Reimage all four Floor 2 workstations.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'ICMP (`ping`) succeeding does NOT mean SMB (`TCP 445`) is open! Run `Test-NetConnection srv-app02.corp -Port 445` in PowerShell/CLI.',
      'Notice Floor 3 works and Floor 2 fails right after lunch -> subnet ACL/firewall block on `10.20.2.0/24`.',
    ],
    howAndWhy:
      'HOW & WHY: Ping tests ICMP, whereas mapped Windows file shares require TCP port 445 (SMB). Using PowerShell `Test-NetConnection <host> -Port 445` isolates L3 reachability from L4 firewall/ACL filtering. Providing Tier 2/NetOps exact source subnet (`10.20.2.0/24`), destination (`10.99.4.20`), and failed port (`TCP 445`) slashes resolution time.',
  },
  {
    id: 'sim-a3-gpo',
    ticketNumber: 'INC-3088',
    priority: 'P3 Medium',
    skillLevel: 'advanced',
    deskTier: 'tier-2',
    category: 'Active Directory & Group Policy',
    requesterName: 'Priya Nair',
    requesterRole: 'Site Operations Lead',
    department: 'Finance',
    deviceHostname: 'FIN-WS-105',
    subject: 'New Finance Printer GPO is not applying after moving PCs to new OU',
    initialMessage:
      'We moved FIN-WS-105 into OU=Finance_Workstations so it would receive our new `GPO_Finance_Printers` policy. Even after rebooting, the policy is missing!',
    slaTarget: '1h Response / 4h Resolve',
    chatOptions: [
      {
        id: 'a3-c1',
        question: 'Did you restrict Security Filtering on `GPO_Finance_Printers` to a custom group instead of Authenticated Users?',
        userReply:
          'Yes! I removed "Authenticated Users" from Security Filtering and added only "SG_Finance_Users" so only Finance staff get it.',
        quality: 'helpful',
        feedbackNote: 'Critical clue! MS16-072 requires Read permissions for Computer objects (`Authenticated Users` or `Domain Computers`) on User GPOs.',
        unlocksClue: 'Authenticated Users removed from GPO Security Filtering -> Computer account cannot read the GPO!',
      },
    ],
    cliHintCommands: ['gpresult /r', 'gpupdate /force'],
    cliResponses: [
      {
        match: ['gpresult', 'rsop'],
        label: 'Inspect Applied & Filtered GPOs',
        output: `USER SETTINGS\n  Applied Group Policy Objects\n  ----------------------------\n    Default Domain Policy\n\n  The following GPOs were not applied because they were filtered out\n  -------------------------------------------------------------------\n    GPO_Finance_Printers\n      Filtering:  Not Applied (Inaccessible / Access Denied by Computer Account)`,
        isKeyFinding: true,
      },
      {
        match: ['gpupdate'],
        label: 'Force Group Policy Refresh',
        output: `Updating policy...\nComputer Policy update has completed successfully.\nUser Policy update has completed successfully.`,
      },
    ],
    initialDirectory: {
      displayName: 'FIN-WS-105$ / Priya Nair',
      upn: 'pnair@corp.local',
      department: 'Finance',
      ou: 'OU=Finance_Workstations,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '19 days ago',
      groups: ['Domain Users', 'SG_Finance_Users'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '330192-441209-882910-554120-663819-772819-112904-991827',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '0 days, 2 hours',
      ipv4: '10.20.30.105',
      dnsServer: '10.10.0.50',
      services: [{ name: 'Group Policy Client (gpsvc)', status: 'Running', detail: 'Active' }],
      eventLogs: [
        {
          time: '01:15 PM',
          source: 'Microsoft-Windows-GroupPolicy',
          eventId: '1058',
          summary: 'The processing of Group Policy failed. Windows attempted to read GPO_Finance_Printers in SYSVOL under machine context and was denied.',
        },
      ],
      hardwareSummary: 'GPO_Finance_Printers missing Authenticated Users / Domain Computers Read permission.',
    },
    consoleActions: [
      {
        id: 'a3-fix-gpo',
        label: 'Restore "Authenticated Users: Read" (Delegation) & Run gpupdate /force',
        targetTab: 'diagnostics',
        requiresChatId: 'a3-c1',
        effectSummary: 'Added Read permission for Authenticated Users / Domain Computers while keeping Apply Group Policy scoped to SG_Finance_Users. gpresult /r now shows GPO_Finance_Printers Applied!',
        mutatesDiagnostics: {
          hardwareSummary: 'GPO_Finance_Printers successfully read and applied on FIN-WS-105.',
        },
      },
    ],
    expectedActionIds: ['a3-fix-gpo'],
    expectedChatIds: ['a3-c1'],
    rootCauseOptions: [
      'Removing `Authenticated Users` from GPO Security Filtering stripped Read access from the computer account (`FIN-WS-105$`), so Windows couldn’t fetch `GPO_Finance_Printers` from SYSVOL (MS16-072).',
      'Group Policy requires `sfc /scannow` before any GPO applies.',
      'Windows 11 does not support printer GPOs.',
      'The workstation IP address changed.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Inspect `gpresult /r` (`Filtered out: Inaccessible`), restore `Read` permission for `Authenticated Users` (or `Domain Computers`) on the GPO Delegation tab while keeping `Apply Group Policy` scoped to `SG_Finance_Users`, then run `gpupdate /force`.',
      'Move every workstation in the company back into Default Users.',
      'Disable the Group Policy Client service.',
      'Give Priya local Administrator and close the ticket.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Run `gpresult /r` in CLI and ask Priya in Chat how she configured Security Filtering!',
      'Since Microsoft patch MS16-072, User GPOs are fetched using the Computer’s security context—so removing `Authenticated Users` without adding `Domain Computers: Read` blocks the GPO.',
    ],
    howAndWhy:
      'HOW & WHY: Under Microsoft security update MS16-072, Group Policy reads policy files from SYSVOL under the Computer account context. If an admin removes `Authenticated Users` from Security Filtering to target a user group, the GPO becomes unreadable unless `Domain Computers` or `Authenticated Users` is granted `Read` permission on the Delegation tab.',
  },

  // ==================== EXPERT · TIER 2 ====================
  {
    id: 'sim-e1-bitlocker',
    ticketNumber: 'INC-4010',
    priority: 'P1 Critical',
    skillLevel: 'expert',
    deskTier: 'tier-2',
    category: 'Security & Endpoint Encryption',
    requesterName: 'Victoria Sterling',
    requesterRole: 'Chief Financial Officer (CFO)',
    department: 'Executive',
    deviceHostname: 'EXEC-CFO-01',
    subject: 'URGENT: Blue BitLocker Recovery screen locked my laptop!',
    initialMessage:
      'I’m calling from an unknown hotel cell number because my laptop updated overnight and now shows a blue "BitLocker Recovery — Enter the 48-digit recovery key" screen! Read me the key fast—I have a board call!',
    slaTarget: '10m Response / 30m Resolve',
    chatOptions: [
      {
        id: 'e1-c1',
        question: 'For executive security, I must verify your identity before accessing BitLocker keys. Let me call your verified phone on file (or send an Entra MFA number-match prompt) and confirm the 8-character Key ID shown on screen.',
        userReply:
          'Smart—good security practice! I just approved the MFA prompt on my enrolled phone. My Key ID on screen starts with `4A9F21C0` and my employee ID is #0014.',
        quality: 'helpful',
        feedbackNote: 'Passed mandatory anti-social-engineering check before touching BitLocker keys.',
        unlocksClue: 'Caller identity verified via enrolled phone callback / MFA + BitLocker Key ID `4A9F21C0` confirmed.',
      },
      {
        id: 'e1-c2',
        question: 'Sure, let me read the 48-digit BitLocker recovery key right away without verifying—since you sound urgent!',
        userReply:
          '[Security Audit Warning] Never disclose BitLocker recovery keys to an unverified caller! That is a classic vishing social-engineering trap.',
        quality: 'poor',
        feedbackNote: 'Critical security violation: urgent executive impersonation is the #1 social-engineering pretext.',
      },
    ],
    cliHintCommands: ['manage-bde -status'],
    cliResponses: [
      {
        match: ['manage-bde', 'bitlocker', 'tpm'],
        label: 'Check BitLocker & TPM Status Reference',
        output: `BitLocker Recovery Triggered:\n  Key ID: 4A9F21C0-...\n  Cause : TPM Platform Configuration Register (PCR 0/2/7) changed after overnight UEFI/BIOS update.`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Victoria Sterling',
      upn: 'vsterling@corp.local',
      department: 'Executive',
      ou: 'OU=Executives,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '25 days ago',
      groups: ['Domain Users', 'SG_Exec_Board'],
      m365License: 'Microsoft 365 E5',
      mfaStatus: 'Enforced (FIDO2 + Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '482910-774120-558291-663201-440192-881203-112044-998123 (Key ID: 4A9F21C0)',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise (Locked at Pre-Boot)',
      uptime: 'Pre-Boot Recovery',
      ipv4: 'Offline (Pre-Boot)',
      dnsServer: 'N/A',
      services: [{ name: 'TPM 2.0 Attestation', status: 'PCR Mismatch', detail: 'UEFI BIOS flashed overnight' }],
      eventLogs: [
        {
          time: '03:15 AM',
          source: 'Intune Update Ring',
          eventId: '24601',
          summary: 'Dell UEFI BIOS 1.18.0 installed automatically without suspending BitLocker protectors.',
        },
      ],
      hardwareSummary: 'BitLocker Key ID 4A9F21C0 backed up in Entra ID / Intune Devices.',
    },
    consoleActions: [
      {
        id: 'e1-retrieve-key',
        label: 'Verify Key ID 4A9F21C0 & Deliver 48-Digit BitLocker Recovery Key',
        targetTab: 'directory',
        requiresChatId: 'e1-c1',
        warningIfPremature: 'STOP! Verify the caller’s identity via enrolled callback/MFA and Key ID in Chat BEFORE releasing BitLocker recovery keys!',
        effectSummary: 'Verified CFO identity + Key ID 4A9F21C0, delivered 48-digit BitLocker recovery key cleanly, laptop unlocked and booted into Windows 11.',
        mutatesDiagnostics: {
          hostOs: 'Windows 11 Enterprise (Unlocked & Booted)',
          hardwareSummary: 'BitLocker unlocked; TPM PCRs re-sealed cleanly on boot.',
        },
      },
    ],
    expectedActionIds: ['e1-retrieve-key'],
    expectedChatIds: ['e1-c1'],
    rootCauseOptions: [
      'The overnight BIOS/UEFI firmware update altered TPM PCR integrity measurements, causing TPM to withhold the drive key until verified recovery unlock.',
      'The NVMe SSD failed permanently and wiped all financial spreadsheets.',
      'Victoria’s Active Directory account was deleted.',
      'Home Wi-Fi DNS failed.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Verify Victoria’s identity via trusted callback/MFA first, match Key ID `4A9F21C0`, retrieve and provide the 48-digit BitLocker recovery key from Entra ID/Intune, and log a follow-up to ensure future BIOS updates suspend BitLocker protectors.',
      'Immediately read out the BitLocker key to the unknown cell number without verification.',
      'Format the C: drive and tell the CFO to recreate her board slides.',
      'Unlock her AD account without checking BitLocker.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'NEVER hand over a BitLocker recovery key to an unverified caller—use Chat to run strict identity verification + Key ID matching first!',
      'Once verified in Chat, retrieve the 48-digit key from the AD / Entra Console tab.',
    ],
    howAndWhy:
      'HOW & WHY: BitLocker seals its encryption key to TPM Platform Configuration Registers (PCRs). UEFI/BIOS updates modify firmware hashes, so TPM pauses at the blue recovery screen to guard against physical tampering. Tier 2 must ALWAYS verify caller identity via trusted out-of-band callback/MFA before retrieving the 48-digit recovery key from Entra ID/Intune/AD.',
  },
  {
    id: 'sim-e2-phishing',
    ticketNumber: 'INC-4044',
    priority: 'P1 Critical',
    skillLevel: 'expert',
    deskTier: 'tier-2',
    category: 'M365 Security & Incident Containment',
    requesterName: 'Liam Gallagher',
    requesterRole: 'Payroll Specialist',
    department: 'HR & Payroll',
    deviceHostname: 'HR-LT-031',
    subject: 'I clicked a DocuSign link and approved an MFA prompt I didn’t start!',
    initialMessage:
      'I think I messed up. Five minutes ago I typed my Microsoft 365 password into a fake DocuSign page and accidentally tapped Approve on an MFA prompt. What do I do?!',
    slaTarget: '5m Immediate Containment',
    chatOptions: [
      {
        id: 'e2-c1',
        question: 'Thank you for reporting immediately! Do NOT worry—did you enter anything else, and please stay off Outlook while I lock down your active sessions right now.',
        userReply:
          'Thank you—nothing else entered, just my M365 email, password, and that one MFA push.',
        quality: 'helpful',
        feedbackNote: 'Blameless, reassuring communication encourages fast incident reporting while keeping containment moving.',
        unlocksClue: 'Confirmed AiTM phishing login + MFA approval 5 minutes ago -> active attacker OAuth session likely live!',
      },
      {
        id: 'e2-c2',
        question: 'Just change your password yourself and forget about it—nobody can stay logged in after a password change.',
        userReply:
          'Wait, are you sure? My coworker said hackers can still read my emails even after changing a password...',
        quality: 'poor',
        feedbackNote: 'Dangerous misconception! Password resets do NOT revoke existing OAuth/refresh tokens or delete attacker mailbox rules.',
      },
    ],
    cliHintCommands: ['Get-InboxRule -Mailbox lgallagher', 'Get-MgUserAuthenticationMethod'],
    cliResponses: [
      {
        match: ['inboxrule', 'inbox', 'rule'],
        label: 'Audit Outlook Inbox Rules',
        output: `Name: "." (Hidden Rule)\nEnabled: True\nCondition: Subject/Body contains "Wire" OR "Invoice" OR "Direct Deposit"\nAction: Move to RSS Feeds AND ForwardTo -> external-drop99@proton.me`,
        isKeyFinding: true,
      },
      {
        match: ['authenticationmethod', 'mfa', 'mguser'],
        label: 'Audit Registered MFA Methods',
        output: `Method 1: Microsoft Authenticator (Liam iPhone 15 - Enrolled 8 months ago)\nMethod 2: [SUSPICIOUS!] Authenticator App (Unknown Android Pixel - Added 3 minutes ago!)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Liam Gallagher',
      upn: 'lgallagher@corp.local',
      department: 'HR & Payroll',
      ou: 'OU=HR,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '40 days ago',
      groups: ['Domain Users', 'SG_Payroll_Team'],
      m365License: 'Microsoft 365 E5',
      mfaStatus: 'COMPROMISED: Rogue Android MFA Added!',
      activeSessions: 'ALERT: Active token from Foreign IP 185.220.x.x',
      inboxRules: 'ALERT: Hidden forwarding rule -> external-drop99@proton.me',
      bitlockerKey: '663819-440192-881203-112044-998123-482910-774120-558291',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '2 days',
      ipv4: '10.20.12.31',
      dnsServer: '10.10.0.50',
      services: [{ name: 'Microsoft Defender', status: 'Running', detail: 'No local malware' }],
      eventLogs: [
        {
          time: '01:55 PM',
          source: 'Entra ID Sign-In Logs',
          eventId: 'SignIn-AiTM',
          summary: 'Successful sign-in + MFA from unfamiliar IP 185.220.101.44 (Frankfurt Proxy); new MFA device & Inbox rule created 2m later.',
        },
      ],
      hardwareSummary: 'Account Compromise Active: Foreign OAuth session + Rogue MFA + Exfil Inbox Rule.',
    },
    consoleActions: [
      {
        id: 'e2-revoke-sessions',
        label: '1. Revoke All Active Entra ID / M365 Sessions & Reset Password',
        targetTab: 'directory',
        effectSummary: 'Revoked all active OAuth/refresh tokens (terminating 185.220.x.x session immediately) and forced password reset.',
        mutatesDirectory: {
          activeSessions: 'Revoked (0 active tokens)',
          passwordLastSet: 'Just now (Reset)',
        },
      },
      {
        id: 'e2-remove-rogue-mfa',
        label: '2. Delete Rogue Android MFA Method & Require MFA Re-Registration',
        targetTab: 'directory',
        effectSummary: 'Removed attacker-enrolled Android Pixel authenticator; kept Liam’s MFA enforced.',
        mutatesDirectory: {
          mfaStatus: 'Clean (Rogue method removed; re-registration enforced)',
        },
      },
      {
        id: 'e2-delete-rule',
        label: '3. Delete Malicious External Inbox Forwarding Rule',
        targetTab: 'directory',
        effectSummary: 'Deleted hidden rule forwarding Wire/Payroll emails to external-drop99@proton.me and notified SOC.',
        mutatesDirectory: {
          inboxRules: 'Clean (Malicious rule deleted)',
        },
      },
    ],
    expectedActionIds: ['e2-revoke-sessions', 'e2-remove-rogue-mfa', 'e2-delete-rule'],
    expectedChatIds: ['e2-c1'],
    rootCauseOptions: [
      'Adversary-in-the-Middle (AiTM) phishing captured Liam’s password and MFA session token; the attacker already used that live token to enroll a rogue MFA device and create a hidden email-forwarding rule.',
      'Liam’s USB-C dock driver crashed.',
      'Print Spooler locked up HR-LT-031.',
      'Home DNS cached an old IP.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Reassure Liam for quick reporting, then execute full containment in Entra/Exchange: Revoke ALL active sessions + Reset Password, delete the rogue Android MFA method, delete the hidden forwarding rule, and escalate to SOC/SecOps for BEC audit.',
      'Only reset the password and close the ticket without checking MFA methods or Inbox rules.',
      'Disable MFA permanently on Liam’s payroll account.',
      'Ignore the incident for 24 hours to see if payroll fraud happens.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Run `Get-InboxRule -Mailbox lgallagher` and `Get-MgUserAuthenticationMethod` in the CLI, or inspect the Entra ID tab closely!',
      'Resetting a password does NOT kill active OAuth sessions or remove persistence! You must execute all 3 containment actions in the Directory Console.',
    ],
    howAndWhy:
      'HOW & WHY: Modern AiTM phishing captures live OAuth refresh tokens that survive a simple password change. Proper Business Email Compromise (BEC) containment requires ALL FOUR pillars: (1) Revoke all active sign-in sessions immediately, (2) Reset the password, (3) Remove any attacker-added MFA methods, and (4) Purge hidden Outlook forwarding/delete rules and alert Security.',
  },
  {
    id: 'sim-e3-bsod-fleet',
    ticketNumber: 'INC-4090',
    priority: 'P1 Critical',
    skillLevel: 'expert',
    deskTier: 'tier-2',
    category: 'BSOD Triage & Problem Management',
    requesterName: 'Hannah Park',
    requesterRole: 'Engineering Operations',
    department: 'Engineering',
    deviceHostname: 'ENG-LT-305 (6 Laptops Affected)',
    subject: 'Six Dell laptops crashed with Blue Screen after yesterday’s updates!',
    initialMessage:
      'Six engineers with the same Dell Latitude model all hit a Blue Screen crash loop this morning right when opening video calls or CAD viewers!',
    slaTarget: '10m Response / 1h Mitigation',
    chatOptions: [
      {
        id: 'e3-c1',
        question: 'Can you share the exact Stop Code or filename inside parentheses on the Blue Screen (or send a photo)?',
        userReply:
          'Yes! Every single laptop shows: `SYSTEM_THREAD_EXCEPTION_NOT_HANDLED (igdkmdn64.sys)`. It started right after Windows Updates ran last night.',
        quality: 'helpful',
        feedbackNote: 'Filename `igdkmdn64.sys` immediately pinpoints the Intel Integrated Graphics kernel driver.',
        unlocksClue: 'Stop code across 6 identical Dells: `igdkmdn64.sys` (Intel Graphics driver pushed overnight).',
      },
    ],
    cliHintCommands: ['Get-EventLog -LogName System -Newest 5', 'pnputil /enum-drivers | findstr igdkmdn'],
    cliResponses: [
      {
        match: ['eventlog', 'bugcheck', 'dump'],
        label: 'Inspect Windows BugCheck Logs',
        output: `EventID 1001 (BugCheck): 0x1000007e caused by driver igdkmdn64.sys+0x14820\nDriver Update Installed Last Night: Intel(R) Iris(R) Xe Graphics v31.0.101.5522 (via Intune Ring 1)`,
        isKeyFinding: true,
      },
      {
        match: ['pnputil', 'driver', 'igdkmdn'],
        label: 'Check Faulting Kernel Driver Version',
        output: `Original Name: igdkmdn64.sys\nProvider: Intel Corporation\nFaulting Version: 31.0.101.5522 | Previous Stable Version: 31.0.101.4953`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Hannah Park',
      upn: 'hpark@corp.local',
      department: 'Engineering',
      ou: 'OU=Engineering,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '11 days ago',
      groups: ['Domain Users', 'SG_Engineering'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: '112904-663819-440192-881203-482910-774120-558291-663201',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise 23H2',
      uptime: 'Crash Loop (6 Devices)',
      ipv4: '10.20.40.82',
      dnsServer: '10.10.0.50',
      services: [{ name: 'Intune Management Extension', status: 'Running', detail: 'Pushed Intel Graphics 31.0.101.5522' }],
      eventLogs: [
        {
          time: '07:50 AM',
          source: 'Windows Error Reporting / BugCheck',
          eventId: '1001',
          summary: '6 Latitude laptops crashed with SYSTEM_THREAD_EXCEPTION_NOT_HANDLED (igdkmdn64.sys v31.0.101.5522).',
        },
      ],
      hardwareSummary: 'Faulting Driver: Intel Graphics igdkmdn64.sys v31.0.101.5522 · Stable Rollback: v31.0.101.4953.',
    },
    consoleActions: [
      {
        id: 'e3-rollback-driver',
        label: 'Roll Back Intel Graphics Driver to v31.0.101.4953 (Safe Mode / Device Mgr)',
        targetTab: 'diagnostics',
        effectSummary: 'Rolled back igdkmdn64.sys to stable v31.0.101.4953 on affected laptops; BSOD crash loop stopped.',
        mutatesDiagnostics: {
          uptime: '0 days, 1 hour (Stable)',
          hardwareSummary: 'Rolled back to igdkmdn64.sys v31.0.101.4953; zero crashes during Teams/CAD stress test.',
        },
      },
      {
        id: 'e3-problem-record',
        label: 'Open Problem Record & Alert Endpoint Eng to Pause Intune Driver Ring',
        targetTab: 'diagnostics',
        requiresChatId: 'e3-c1',
        effectSummary: 'Linked all 6 incidents under a Problem Record and notified Endpoint Engineering to halt Intune deployment of Intel Graphics v31.0.101.5522.',
      },
    ],
    expectedActionIds: ['e3-rollback-driver', 'e3-problem-record'],
    expectedChatIds: ['e3-c1'],
    rootCauseOptions: [
      'A defective Intel Integrated Graphics kernel driver (`igdkmdn64.sys` v31.0.101.5522) pushed via Intune overnight crashes when hardware video acceleration starts.',
      'All 6 engineers accidentally dropped their laptops simultaneously.',
      'The corporate DHCP server assigned duplicate IPs.',
      'Active Directory locked out all 6 accounts.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Identify `igdkmdn64.sys` from the BSOD/BugCheck log, roll back the Intel Graphics driver to `v31.0.101.4953` on affected laptops, open a Problem Record linking all 6 incidents, and escalate to Endpoint Engineering to pause the faulty Intune driver ring.',
      'Replace the motherboards on all 6 laptops one by one without alerting Endpoint Engineering.',
      'Run `ipconfig /flushdns` and close the ticket.',
      'Tell all 6 engineers never to join video calls again.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Ask Hannah in Chat for the exact filename inside the BSOD parentheses, and check BugCheck Event ID 1001 in CLI/Diagnostics.',
      'Fixing 1 laptop isn’t enough when 6 fail after an update: roll back the driver AND file a Problem Record to pause the fleet rollout!',
    ],
    howAndWhy:
      'HOW & WHY: Windows BSOD stop screens often name the exact faulting `.sys` kernel driver (`igdkmdn64.sys` = Intel Graphics, `nvlddmkm.sys` = NVIDIA, `Netwtw10.sys` = Intel Wi-Fi). When multiple identical models fail after an update window, Tier 2 rolls back the driver immediately for business continuity and creates an ITSM Problem Record to halt the bad Intune/WSUS deployment before the rest of the fleet crashes.',
  },
];
