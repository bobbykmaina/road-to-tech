import type { ServiceDeskScenario } from './serviceDeskScenarios';

export const SERVICE_DESK_SCENARIOS_PART_3: ServiceDeskScenario[] = [
  // ==================== ADVANCED · TIER 2 (EXTRA) ====================
  {
    id: 'sim-a4-dmarc',
    ticketNumber: 'INC-3044',
    priority: 'P2 High',
    skillLevel: 'advanced',
    deskTier: 'tier-2',
    category: 'Email & M365 · NDR & DMARC',
    requesterName: 'Clara Vance',
    requesterRole: 'Marketing Operations Manager',
    department: 'Marketing',
    deviceHostname: 'MKT-WS-009',
    subject: 'Automated customer invoices from new cloud CRM keep bouncing with 554 5.7.1 DMARC Reject!',
    initialMessage:
      'External clients aren’t receiving renewal quotes sent from our new Marketing CRM tool! Exchange Message Trace shows NDR `554 5.7.1 DMARC policy check failed`, though regular Outlook emails arrive fine!',
    slaTarget: '30m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'a4-c1',
        question: 'Can you share the exact NDR bounce code and confirm whether normal Outlook emails from `@corp.local` deliver to that same external client?',
        userReply:
          'Yes! Outlook email arrives immediately, while CRM-dispatched mail bounces with `554 5.7.1: Unauthenticated email from corp.local is not accepted due to DMARC p=reject`!',
        quality: 'helpful',
        feedbackNote: 'Isolated CRM authorized-sender DNS configuration from core M365 Exchange health.',
        unlocksClue: 'Outlook M365 mail passes SPF/DKIM/DMARC; new cloud CRM fails SPF/DKIM authorization.',
      },
      {
        id: 'a4-c2',
        question: 'Did Marketing complete the DNS `TXT` (`SPF` include + `DKIM` CNAME) onboarding steps requested by the CRM vendor before go-live?',
        userReply:
          'Oh! We enabled sending inside the CRM portal last night without asking IT/DNS to publish the vendor’s SPF include or DKIM records!',
        quality: 'helpful',
        feedbackNote: 'Clean confirmation of unauthorized spoof-like sending blocked legitimately by DMARC `p=reject`.',
        unlocksClue: 'New CRM sending servers missing from domain SPF TXT record and lacking aligned DKIM signing CNAMEs.',
      },
      {
        id: 'a4-c3',
        question: 'Delete the company’s DMARC and SPF DNS records so any server on the internet can spoof our domain.',
        userReply:
          'Wouldn’t that leave our customers exposed to phishing pretending to come from us?!',
        quality: 'poor',
        feedbackNote: 'Never weaken domain DMARC/SPF security—authorize legitimate senders cleanly via SPF/DKIM.',
      },
    ],
    cliHintCommands: ['nslookup -type=txt corp.local', 'nslookup -type=txt _dmarc.corp.local'],
    cliResponses: [
      {
        match: ['_dmarc'],
        label: 'Query DMARC Policy TXT Record',
        output: `_dmarc.corp.local  TXT = "v=DMARC1; p=reject; rua=mailto:dmarc@corp.local; adkim=r; aspf=r"`,
        isKeyFinding: true,
      },
      {
        match: ['nslookup', 'txt', 'spf'],
        label: 'Query Domain SPF TXT Record',
        output: `corp.local  TXT = "v=spf1 include:spf.protection.outlook.com -all"\n(Note: New CRM vendor IP range / include domain NOT listed; DKIM CNAME absent.)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Clara Vance',
      upn: 'cvance@corp.local',
      department: 'Marketing',
      ou: 'OU=Marketing,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '17 days ago',
      groups: ['Domain Users', 'SG_Marketing'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Exchange Online Message Trace / External DNS',
      uptime: 'Cloud Service Active',
      ipv4: '40.97.x.x (EXO)',
      dnsServer: 'Public Authoritative DNS',
      services: [
        { name: 'Exchange Online Mail Flow', status: 'Healthy', detail: 'Microsoft 365 outbound SPF/DKIM aligned' },
        { name: 'Cloud CRM SMTP Relay', status: 'Blocked (554 5.7.1)', detail: 'Fails SPF & DKIM alignment under DMARC p=reject' },
      ],
      eventLogs: [
        {
          time: '09:10 AM',
          source: 'Exchange Message Trace',
          eventId: '554',
          summary: '554 5.7.1: Recipient gateway rejected CRM email — SPF hardfail (-all) and missing aligned DKIM.',
        },
      ],
      hardwareSummary: 'SPF missing CRM include; DKIM CNAMEs missing; DMARC set to p=reject.',
    },
    consoleActions: [
      {
        id: 'a4-publish-spf-dkim',
        label: 'Verify CRM Vendor Ownership & Submit Approved Change to Publish DKIM CNAMEs + SPF Include',
        targetTab: 'diagnostics',
        requiresChatId: 'a4-c2',
        effectSummary: 'Submitted CAB-approved DNS change publishing vendor DKIM selector CNAMEs and SPF include; verified DKIM + DMARC Pass on test quote inside Exchange Message Trace!',
        mutatesDiagnostics: {
          services: [
            { name: 'Exchange Online Mail Flow', status: 'Healthy', detail: 'SPF/DKIM aligned' },
            { name: 'Cloud CRM SMTP Relay', status: 'Delivering (DMARC Pass)', detail: 'Verified via Message Trace & recipient header' },
          ],
        },
      },
    ],
    expectedActionIds: ['a4-publish-spf-dkim'],
    expectedChatIds: ['a4-c1', 'a4-c2'],
    rootCauseOptions: [
      'Marketing began sending `@corp.local` mail from a new cloud CRM without publishing its authorized DKIM CNAMEs and SPF include in public DNS, so external gateways rejected the mail (`554 5.7.1`) under `p=reject` DMARC.',
      'Clara’s Outlook OST file on her workstation grew too large.',
      'TCP port 443 failed on her desktop.',
      'Her AD password was locked out.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Confirm normal M365 mail works, verify `nslookup -type=txt` SPF/DMARC records, temporarily pause CRM bulk blasts, submit an approved Change to add the CRM’s DKIM CNAMEs and SPF `include:` in public DNS, and re-test via Message Trace.',
      'Change the corporate DMARC record to `p=none` and delete SPF.',
      'Rebuild Clara’s Windows profile.',
      'Clear Chrome cookies.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Run both `nslookup -type=txt corp.local` and `nslookup -type=txt _dmarc.corp.local` in CLI!',
      'Notice DMARC `p=reject` is working exactly as designed to stop unauthorized third-party senders until SPF/DKIM DNS records are published.',
    ],
    howAndWhy:
      'HOW & WHY: **SPF** lists which IP servers may send as your domain, **DKIM** attaches cryptographic header signatures, and **DMARC** (`p=reject`) commands recipients to block messages failing aligned SPF+DKIM. Adding a new cloud SaaS sender always requires DNS SPF/DKIM onboarding via an approved Change—never lowering DMARC!',
  },

  {
    id: 'sim-a5-intune',
    ticketNumber: 'INC-3052',
    priority: 'P2 High',
    skillLevel: 'advanced',
    deskTier: 'tier-2',
    category: 'Mobile · Intune MDM Compliance',
    requesterName: 'Maya Patel',
    requesterRole: 'Regional Account Director',
    department: 'Sales',
    deviceHostname: 'iPhone-MPatel-BYOD',
    subject: 'Work Outlook & Teams on my personal iPhone blocked overnight (`AADSTS53000` Non-Compliant!)',
    initialMessage:
      'My personal BYOD iPhone stopped syncing work Outlook and Teams this morning with "Your device does not meet your organization’s compliance policy (`AADSTS53000`)". Do NOT wipe my family photos on this personal phone!!',
    slaTarget: '30m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'a5-c1',
        question: 'First, let me reassure you: we will NEVER full-wipe a personal BYOD phone! Let’s check your Intune Company Portal status—did an iOS security update get postponed recently?',
        userReply:
          'Thank goodness! Yes—Company Portal shows "Your iOS version (16.4) is below the minimum required iOS 17.5" because I kept hitting Remind Me Later!',
        quality: 'helpful',
        feedbackNote: 'Calmed BYOD wipe fears immediately and pinpointed the exact Intune compliance rule.',
        unlocksClue: 'Personal BYOD iPhone marked Non-Compliant in Intune due to outdated iOS 16.4 (minimum iOS 17.5).',
      },
      {
        id: 'a5-c2',
        question: 'If you ever leave the company or sell this phone, notice we use `Retire` (removes corporate mail/apps only) rather than `Wipe` (factory reset for company-owned phones). Ready to run the iOS update and tap Check Status in Company Portal?',
        userReply:
          'Makes total sense! I’m plugging into Wi-Fi and power to install iOS 17.6 now.',
        quality: 'helpful',
        feedbackNote: 'Clearly contrasted BYOD `Retire` vs Corporate `Wipe` while guiding the compliance remediation.',
        unlocksClue: 'User agreed to update iOS and trigger Intune Company Portal compliance re-check.',
      },
      {
        id: 'a5-c3',
        question: 'Let’s trigger an Intune Factory Wipe on your personal iPhone right now to clear the error!',
        userReply:
          'STOP! All my personal family photos and bank apps are on here!!',
        quality: 'poor',
        feedbackNote: 'Catastrophic mistake: `Wipe` erases the entire device! Use `Retire` for BYOD or update OS compliance first.',
      },
    ],
    cliHintCommands: ['Get-IntuneManagedDevice -Filter "user eq mpatel"', 'Get-EntraConditionalAccessError 53000'],
    cliResponses: [
      {
        match: ['intune', 'device', '53000', 'compliance'],
        label: 'Inspect Intune Device Compliance & Conditional Access',
        output: `Device     : iPhone-MPatel-BYOD (Ownership: Personal / BYOD)\nCompliance : Non-Compliant (OS Version 16.4 < Required Minimum 17.5)\nCA Policy  : CA04-Require-Compliant-Mobile -> Blocked Outlook/Teams (` + 'AADSTS53000' + `)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Maya Patel',
      upn: 'mpatel@corp.local',
      department: 'Sales',
      ou: 'OU=Sales,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '14 days ago',
      groups: ['Domain Users', 'SG_Sales_Mobile'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Blocked on BYOD phone (`AADSTS53000`)',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'iOS 16.4 (BYOD Personal Phone)',
      uptime: '4 days',
      ipv4: 'Wi-Fi / Cellular',
      dnsServer: 'Carrier / Home DNS',
      services: [
        { name: 'Intune Compliance Engine', status: 'Non-Compliant', detail: 'OS version below minimum 17.5 security baseline' },
        { name: 'Conditional Access (CA04)', status: 'Blocking M365', detail: 'AADSTS53000 awaiting compliant device check-in' },
      ],
      eventLogs: [
        {
          time: '06:30 AM',
          source: 'Entra Conditional Access',
          eventId: '53000',
          summary: 'Access to Exchange Online denied: Device failed Intune OS Minimum Version compliance policy.',
        },
      ],
      hardwareSummary: 'BYOD Personal iPhone · Minimum OS compliance policy updated overnight.',
    },
    consoleActions: [
      {
        id: 'a5-recheck-compliance',
        label: 'Guide iOS Update -> Trigger Intune Sync / Company Portal Check-In (Do NOT Full Wipe BYOD)',
        targetTab: 'diagnostics',
        requiresChatId: 'a5-c1',
        effectSummary: 'User updated iOS to 17.6, tapped "Check Settings" inside Intune Company Portal, Intune flipped status to Compliant, and Conditional Access immediately restored Outlook/Teams sync with zero personal data loss.',
        mutatesDirectory: {
          activeSessions: 'Healthy (Mobile Compliant)',
        },
        mutatesDiagnostics: {
          hostOs: 'iOS 17.6 (BYOD Personal Phone)',
          services: [
            { name: 'Intune Compliance Engine', status: 'Compliant', detail: 'OS 17.6 verified on check-in' },
            { name: 'Conditional Access (CA04)', status: 'Granted', detail: 'Outlook & Teams syncing normally' },
          ],
        },
      },
    ],
    expectedActionIds: ['a5-recheck-compliance'],
    expectedChatIds: ['a5-c1', 'a5-c2'],
    rootCauseOptions: [
      'Conditional Access (`AADSTS53000`) blocked M365 access because the BYOD iPhone fell below Intune’s minimum iOS version compliance policy (`16.4 < 17.5`).',
      'Maya needed a factory `Wipe` to fix Outlook.',
      'DNS port 53 failed across the internet.',
      'Her AD account was deleted.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Reassure the user no personal wipe will happen, confirm the failing compliance rule in Intune/Company Portal, have her install the iOS update and tap Check Status to re-sync Intune compliance (`Retire` only removes corporate data on BYOD; `Wipe` is strictly for company-owned resets).',
      'Issue a remote Factory `Wipe` on her personal phone.',
      'Disable Conditional Access for all Sales users permanently.',
      'Reset her Active Directory password five times.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Inspect `AADSTS53000` in CLI/Diagnostics: Conditional Access blocks email when an enrolled phone turns Non-Compliant.',
      'Remember Intune MDM: `Retire` removes corporate apps/data ONLY on BYOD; `Wipe` factory-resets an entire company-owned device!',
    ],
    howAndWhy:
      'HOW & WHY: Conditional Access (`AADSTS53000`) ties cloud login permission directly to live Intune MDM compliance (OS patch level, passcode, no jailbreak/root). Updating the phone OS and triggering a Company Portal check-in restores access minutes later—while understanding **Retire** vs **Wipe** prevents devastating personal data wipes on BYOD phones.',
  },

  {
    id: 'sim-a6-vlan-poe',
    ticketNumber: 'INC-3068',
    priority: 'P2 High',
    skillLevel: 'advanced',
    deskTier: 'tier-2',
    category: 'Network · VLAN & PoE Port',
    requesterName: 'Kevin Wu',
    requesterRole: 'Finance Coordinator',
    department: 'Finance',
    deviceHostname: 'FIN-LT-044',
    subject: 'After desk move, desk VoIP phone is completely dark & laptop at jack FL2-W19 pulls 172.30.99.x!',
    initialMessage:
      'Facilities moved me to cubicles by the south window (`Wall Jack FL2-W19`). My VoIP desk phone screen stays dead black with no lights, and when I plug my laptop straight into `FL2-W19` it can’t reach Finance file shares!',
    slaTarget: '30m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'a6-c1',
        question: 'Can you read the exact label printed on the wall faceplate (e.g. `FL2-W19`) and confirm whether your desk phone works on a coworker’s neighboring jack?',
        userReply:
          'Wall plate clearly reads `FL2-W19`! When I carried my phone one cubicle over to `FL2-W18`, its screen powered right up and booted!',
        quality: 'helpful',
        feedbackNote: 'Known-good jack swap proved the VoIP phone is healthy and isolated the problem strictly to jack `FL2-W19`!',
        unlocksClue: 'Wall jack `FL2-W19` confirmed; known-good test at `FL2-W18` proves phone hardware works.',
      },
      {
        id: 'a6-c2',
        question: 'Can you run `ipconfig /all` on your laptop plugged into `FL2-W19` so we can verify which VLAN subnet it landed on?',
        userReply:
          'Sure—it pulled `172.30.99.41` with gateway `172.30.99.1` instead of my usual `10.10.20.x` Finance IP!',
        quality: 'helpful',
        feedbackNote: 'Caught an isolated Guest/Lobby VLAN assignment AND missing PoE on switchport feeding `FL2-W19`!',
        unlocksClue: '`FL2-W19` laptop gets `172.30.99.41` (Guest/Lobby VLAN 99) instead of Corporate Finance VLAN 20.',
      },
      {
        id: 'a6-c3',
        question: 'Walk into the locked network closet yourself and start unplugging random orange patch cables until it lights up.',
        userReply:
          'Wait—the closet has a badge lock and warning sign!',
        quality: 'poor',
        feedbackNote: 'Never tell users (or unbriefed staff) to enter MDF/IDF closets or pull unknown patch cables!',
      },
    ],
    cliHintCommands: ['ipconfig /all', 'ping 10.10.0.50', 'lldp-check'],
    cliResponses: [
      {
        match: ['ipconfig'],
        label: 'Inspect Wall Jack FL2-W19 DHCP Lease',
        output: `Ethernet adapter Ethernet:\n  IPv4 Address. . . . . . . . . . . : 172.30.99.41 (Guest/Visitor VLAN 99!)\n  Default Gateway . . . . . . . . . : 172.30.99.1\n  (Expected Corp Finance Subnet: 10.10.20.0/24)`,
        isKeyFinding: true,
      },
      {
        match: ['ping', 'lldp'],
        label: 'Check Internal Reachability & Switch Port Telemetry',
        output: `Ping 10.10.0.50 -> Request timed out (Guest VLAN 99 isolated from Corp LAN).\nIDF-FL2 Switch Port Gi1/0/19 (patched to FL2-W19):\n  Access VLAN : 99 (Guest)  | Voice VLAN: None | PoE Inline: Disabled (Shut)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Kevin Wu',
      upn: 'kwu@corp.local',
      department: 'Finance',
      ou: 'OU=Finance,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '20 days ago',
      groups: ['Domain Users', 'SG_Finance_Share'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '1 day, 2 hours',
      ipv4: '172.30.99.41 (WRONG: Guest VLAN 99)',
      dnsServer: '1.1.1.1 (Guest DNS)',
      services: [
        { name: 'Switchport Gi1/0/19 (FL2-W19)', status: 'Misconfigured', detail: 'Access VLAN 99 (Guest) & PoE Disabled' },
      ],
      eventLogs: [
        {
          time: '08:50 AM',
          source: 'NetLogon',
          eventId: '5719',
          summary: 'No Domain Controller reachable on isolated Guest VLAN 172.30.99.0/24.',
        },
      ],
      hardwareSummary: 'VoIP phone healthy (verified on FL2-W18) · Patch jack FL2-W19 wired to non-PoE Guest port.',
    },
    consoleActions: [
      {
        id: 'a6-escalate-netops-vlan',
        label: 'Escalate Closet Patch & Switchport Config (FL2-W19 -> Gi1/0/19: VLAN 20 + Voice VLAN + PoE) to NetOps',
        targetTab: 'diagnostics',
        requiresChatId: 'a6-c1',
        effectSummary: 'Logged complete NetOps escalation (Wall jack FL2-W19, known-good FL2-W18 proof, wrong 172.30.99.41 lease & PoE off); NetOps flipped switchport Gi1/0/19 to Finance VLAN 20 + Voice VLAN + PoE Auto. Phone booted & laptop pulled 10.10.20.x!',
        mutatesDiagnostics: {
          ipv4: '10.10.20.44 (Corp Finance VLAN 20)',
          dnsServer: '10.10.0.50',
          services: [
            { name: 'Switchport Gi1/0/19 (FL2-W19)', status: 'Healthy', detail: 'VLAN 20 + Voice VLAN + PoE Active' },
          ],
        },
      },
    ],
    expectedActionIds: ['a6-escalate-netops-vlan'],
    expectedChatIds: ['a6-c1', 'a6-c2'],
    rootCauseOptions: [
      'Wall jack `FL2-W19` is terminated to a switchport configured on the isolated Guest VLAN (`172.30.99.x`) with Power over Ethernet (`PoE`) disabled, leaving the phone dark and blocking Finance corporate subnets.',
      'Kevin’s laptop Wi-Fi card disabled Ethernet permanently.',
      'Active Directory banned Kevin from Finance.',
      'The phone lacked a Print Spooler.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Verify the wall jack label (`FL2-W19`), prove the phone works on a known-good jack (`FL2-W18`), capture the wrong `172.30.99.x` DHCP subnet, and escalate cleanly to NetOps to configure Data VLAN 20, Voice VLAN, and PoE on the corresponding closet switchport.',
      'Send the user into the locked IDF wiring closet to move patch cords blindly.',
      'Replace Kevin’s laptop and desk phone.',
      'Run `sfc /scannow` on Kevin’s laptop.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Ask for the wall jack label + known-good neighbor jack test, AND inspect the `172.30.99.41` IP in `ipconfig /all`!',
      'Desk phones without a wall brick rely on switch `PoE`, and wrong wall-jack VLANs block corporate file shares completely.',
    ],
    howAndWhy:
      'HOW & WHY: Desk moves frequently uncover stale wall-jack patch configurations: an old visitor/printer port might lack `PoE` (leaving VoIP phones dead black) and sit in an isolated Guest `VLAN` (`172.30.99.x`). Documenting the exact wall faceplate ID (`FL2-W19`), known-good neighbor check, and wrong subnet lets NetOps fix the switchport remotely in two minutes without guessing.',
  },

  {
    id: 'sim-a7-linux-disk',
    ticketNumber: 'INC-3081',
    priority: 'P2 High',
    skillLevel: 'advanced',
    deskTier: 'tier-2',
    category: 'Windows & Apps · Linux Log Disk Full',
    requesterName: 'Samir Rao',
    requesterRole: 'QA Lab Lead',
    department: 'Engineering',
    deviceHostname: 'QA-UBU-01',
    subject: 'Ubuntu lab print/status service `cups` & internal web dashboard won’t start ("No space left on device")',
    initialMessage:
      'Our shared Ubuntu workstation (`QA-UBU-01`) rebooted and now its web status daemon won’t start via `systemctl`—everything throws "No space left on device" or permission errors!',
    slaTarget: '30m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'a7-c1',
        question: 'Did a verbose test job run over the weekend inside `/var/log`, or did anyone change permissions on `/opt/labstatus/config.json`?',
        userReply:
          'We left debug logging turned ON all weekend for a stress test, AND a junior tester ran `chmod 000` by accident while trying to hide an API file!',
        quality: 'helpful',
        feedbackNote: 'Uncovered both classic Linux faults cleanly: runaway debug log filling `/` AND broken `chmod` permissions!',
        unlocksClue: 'Debug stress log likely filled `/var/log`; junior tester altered file permissions with `chmod`.',
      },
      {
        id: 'a7-c2',
        question: 'Have you rebooted the Ubuntu box five times in a row hoping space magically returns?',
        userReply:
          'We tried rebooting once—it didn’t free any disk space.',
        quality: 'neutral',
        feedbackNote: 'Reboots clear RAM (`free -h`), never full disk logs (`df -h`).',
      },
      {
        id: 'a7-c3',
        question: 'Run `sudo rm -rf /` immediately to clear the entire drive!',
        userReply:
          'Whoa—isn’t that going to wipe the entire Linux operating system?!',
        quality: 'poor',
        feedbackNote: 'Critical danger: NEVER run destructive root deletes!',
      },
    ],
    cliHintCommands: ['df -h', 'journalctl -u labstatus -n 5', 'ls -l /var/log/labstatus'],
    cliResponses: [
      {
        match: ['df -h', 'df'],
        label: 'Check Linux Filesystem Disk Usage',
        output: `Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p2  100G  100G     0 100% /   <-- CRITICAL: 82G inside /var/log/labstatus-debug.log`,
        isKeyFinding: true,
      },
      {
        match: ['journalctl', 'systemctl', 'ls -l'],
        label: 'Inspect Service Logs & Config Permissions',
        output: `systemd: labstatus.service failed (exit-code).\nError 1: Failed writing temp PID file — No space left on device (/ 100%)\nError 2: ls -l /opt/labstatus/config.json -> ---------- (chmod 000! Should be 644)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Samir Rao',
      upn: 'srao@corp.local',
      department: 'Engineering',
      ou: 'OU=Engineering,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '33 days ago',
      groups: ['Domain Users', 'SG_QA_Ubuntu_Admins'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'LUKS FDE Enabled',
    },
    initialDiagnostics: {
      hostOs: 'Ubuntu 24.04 LTS',
      uptime: '0 days, 2 hours',
      ipv4: '10.10.50.33',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'labstatus.service (systemd)', status: 'Failed (Dead)', detail: 'Root / 100% full & config.json mode 000' },
      ],
      eventLogs: [
        {
          time: '08:05 AM',
          source: 'journalctl / systemd',
          eventId: 'ENOSPC',
          summary: 'labstatus.service exited: No space left on /dev/nvme0n1p2 and Permission denied on /opt/labstatus/config.json.',
        },
      ],
      hardwareSummary: 'Root partition / at 100% (82 GB runaway debug log) · Broken chmod 000 on service config.',
    },
    consoleActions: [
      {
        id: 'a7-clean-chmod-restart',
        label: 'Truncate Oversized Debug Log, Restore `chmod 644` & `systemctl restart labstatus`',
        targetTab: 'diagnostics',
        requiresChatId: 'a7-c1',
        effectSummary: 'Rotated/truncated 82 GB debug log (`df -h` dropped from 100% to 18%), restored `chmod 644 /opt/labstatus/config.json`, disabled verbose debug mode, and verified `systemctl status labstatus` = active (running)!',
        mutatesDiagnostics: {
          services: [
            { name: 'labstatus.service (systemd)', status: 'Active (Running)', detail: 'Root / at 18% used; config.json 644' },
          ],
          hardwareSummary: 'Root partition / healthy at 18% used · labstatus daemon running cleanly.',
        },
      },
    ],
    expectedActionIds: ['a7-clean-chmod-restart'],
    expectedChatIds: ['a7-c1'],
    rootCauseOptions: [
      'A runaway weekend debug log (`/var/log/labstatus-debug.log`) consumed 100% of `/` (`df -h`), while an accidental `chmod 000` stripped read permissions on `/opt/labstatus/config.json`.',
      'Ubuntu 24.04 stopped supporting `systemctl`.',
      'Active Directory deleted the Linux box.',
      'The workstation monitor cable came loose.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Inspect disk & logs via `df -h` and `journalctl`, safely archive/truncate the 82 GB debug log, disable debug logging / configure logrotate, restore `chmod 644` on `config.json`, and run `systemctl restart labstatus`.',
      'Run `rm -rf /` on the Ubuntu workstation.',
      'Install Microsoft Word on Ubuntu.',
      'Ignore the 100% disk warning and reboot repeatedly.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Run `df -h` and `journalctl -u labstatus -n 5` in Endpoint CLI!',
      'Look at BOTH findings: `/` is 100% full AND `config.json` got set to `----------` (`000`) instead of `644`.',
    ],
    howAndWhy:
      'HOW & WHY: On Linux workstations/appliances, `df -h` spots full disks instantly, `journalctl` reveals systemd startup failures, and `ls -l` catches broken `chmod` permissions (`644` for readable config files vs `755` for executables). Safely truncating/rotating oversized `/var/log` files and turning off runaway debug logging fixes root-partition lockouts cleanly.',
  },

  // ==================== EXPERT · TIER 2 (EXTRA) ====================
  {
    id: 'sim-e4-ransomware',
    ticketNumber: 'INC-4051',
    priority: 'P1 Critical',
    skillLevel: 'expert',
    deskTier: 'tier-2',
    category: 'Security · Ransomware Containment',
    requesterName: 'Evelyn Brooks',
    requesterRole: 'Accounts Payable Clerk',
    department: 'Finance',
    deviceHostname: 'FIN-AP-007',
    subject: 'URGENT: Desktop turned red with `README_RESTORE.txt` and all Excel files renamed `.locked`!',
    initialMessage:
      'Something terrifying just happened—my screen background turned red saying "Your files are encrypted, pay Bitcoin in 24h", all my local and Finance shared folders look like `.locked`! Should I pull the power cord and immediately run a backup restore onto this same PC?',
    slaTarget: '10m Response / 30m Resolve',
    chatOptions: [
      {
        id: 'e4-c1',
        question: 'Please stop touching files immediately and do NOT reboot or run repairs—disconnect Wi-Fi/Ethernet (or let me isolate via EDR right now!) and tell me what exact time this appeared and which shared folders you had open.',
        userReply:
          'Hands off the mouse! It started 4 minutes ago after I opened an attached `.zip` shipping invoice, and I had `\\\\filesrv\\Finance_AP` mapped as my Z: drive!',
        quality: 'helpful',
        feedbackNote: 'Textbook first-60-second ransomware triage: froze user changes, preserved memory/forensic state, checked mapped shares, and prepared immediate network isolation.',
        unlocksClue: 'Suspected ZIP invoice ransomware started 4m ago; Z: drive (`\\\\filesrv\\Finance_AP`) was mounted.',
      },
      {
        id: 'e4-c2',
        question: 'Are any coworkers near you seeing `.locked` extensions in Finance_AP, and did you leave the system powered ON (isolated off network) rather than hard-wiping yet?',
        userReply:
          'Yes—it’s isolated off Wi-Fi/LAN now while still powered on, and two teammates say `Z:\\2026_Invoices` has weird `.locked` files appearing!',
        quality: 'helpful',
        feedbackNote: 'Critical escalation evidence: active lateral encryption hitting shared network drive `Z:`.',
        unlocksClue: 'Confirmed shared server impact on `\\\\filesrv\\Finance_AP` (`Z:`)—requires immediate Security + Server snapshot/backup check.',
      },
      {
        id: 'e4-c3',
        question: 'Leave it plugged into the office network and copy your files onto a USB thumb drive to save them!',
        userReply:
          'Wait—won’t plugging a USB stick and staying on LAN spread the ransomware everywhere?!',
        quality: 'poor',
        feedbackNote: 'Fatal containment error: active ransomware spreads across mounted shares, LAN, and attached USB drives!',
      },
    ],
    cliHintCommands: ['Get-NetAdapter | select Name,Status', 'net use'],
    cliResponses: [
      {
        match: ['netadapter', 'edr', 'network'],
        label: 'Inspect Endpoint Adapter & EDR Containment State',
        output: `EDR Alert [HIGH]: Process encryptor.exe spawned from Downloads\\Invoice.zip\nHost Status: Connected -> Pending EDR Network Containment!`,
        isKeyFinding: true,
      },
      {
        match: ['net use', 'share', 'z:'],
        label: 'Inspect Mounted Network Shares',
        output: `Local    Remote\n----------------------------------\nZ:       \\\\filesrv\\Finance_AP  <-- Encrypted objects detected!`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Evelyn Brooks',
      upn: 'ebrooks@corp.local',
      department: 'Finance',
      ou: 'OU=Finance,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '38 days ago',
      groups: ['Domain Users', 'SG_Finance_AP'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Risky — Compromised Endpoint Active',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise',
      uptime: '3 days, 7 hours',
      ipv4: '10.10.20.88 (ACTIVE ON LAN — MUST ISOLATE!)',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'Defender EDR Sensor', status: 'CRITICAL ALERT', detail: 'Active file encryption detected on FIN-AP-007 & Z:' },
        { name: 'Offline Immutable Backup (filesrv)', status: 'Verified Clean (06:00 AM)', detail: 'Immutable air-gapped snapshot intact' },
      ],
      eventLogs: [
        {
          time: '10:19 AM',
          source: 'Microsoft Defender for Endpoint',
          eventId: '1116',
          summary: 'Ransomware behavior detected (`README_RESTORE.txt` + rapid `.locked` file renames touching `Z:\\`).',
        },
      ],
      hardwareSummary: 'Active Ransomware Containment Required · Do NOT reuse PC without full clean wipe/reimage after InfoSec sign-off.',
    },
    consoleActions: [
      {
        id: 'e4-edr-isolate-revoke',
        label: 'Trigger EDR Network Isolation on FIN-AP-007 + Revoke User Sessions & Escalate to InfoSec / Infra',
        targetTab: 'diagnostics',
        requiresChatId: 'e4-c1',
        effectSummary: 'Isolated FIN-AP-007 immediately via EDR (network cut while preserving forensic RAM/disk state), revoked Evelyn’s Entra/AD sessions, notified InfoSec + Server team to lock `\\\\filesrv\\Finance_AP` & verify clean 06:00 AM immutable 3-2-1 backup before clean machine replacement/wipe.',
        mutatesDirectory: {
          activeSessions: 'All sessions revoked; awaiting clean device & InfoSec clearance',
        },
        mutatesDiagnostics: {
          ipv4: 'EDR ISOLATED (Quarantined)',
          services: [
            { name: 'Defender EDR Sensor', status: 'CONTAINED (Isolated)', detail: 'FIN-AP-007 quarantined; InfoSec forensic capture active' },
            { name: 'Offline Immutable Backup (filesrv)', status: 'Restore Initiated', detail: 'Restoring Finance_AP to clean snapshot' },
          ],
        },
      },
    ],
    expectedActionIds: ['e4-edr-isolate-revoke'],
    expectedChatIds: ['e4-c1', 'e4-c2'],
    rootCauseOptions: [
      'A malicious invoice `.zip` executed ransomware on `FIN-AP-007`, encrypting local files and beginning lateral encryption across the mounted `\\\\filesrv\\Finance_AP` (`Z:`) network share.',
      'Monitor color profile switched to red accidentally.',
      'Print Spooler renamed all Excel files to `.locked`.',
      'DHCP lease expiration encrypted the SSD.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Isolate the host from the network immediately via EDR (and unplug Ethernet/Wi-Fi), keep the machine powered for forensics rather than blindly erasing/reusing it, revoke credentials, alert InfoSec + Server team to check shared drives (`Z:`), reimage/replace from a clean system, and restore Finance_AP from tested immutable 3-2-1 backups.',
      'Pay the ransom immediately out of petty cash and keep using the same PC.',
      'Reboot FIN-AP-007 onto the LAN and restore backups straight onto the infected Windows OS.',
      'Plug a personal USB drive into FIN-AP-007 to copy files.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Think Incident Response phases: Containment FIRST (EDR / network isolate), check blast radius (`Z:` drive via `net use`), preserve evidence, NEVER reuse an uncleaned infected machine!',
      'Why do **immutable 3-2-1 backups** matter here? Once containment stops spread, Server Ops restores from tested clean offline/immutable snapshots.',
    ],
    howAndWhy:
      'HOW & WHY: Every second of network connection during ransomware costs hundreds more encrypted files across mapped SMB shares (`Z:`). Frontline Tier 2 isolates the endpoint via **EDR Network Containment** immediately, preserves forensic state for Security, revokes account tokens, checks shared drives for sibling infections, and recovers cleanly from **immutable 3-2-1 backups**—never casually reusing an infected PC without clean wipe/reimage.',
  },

  {
    id: 'sim-e5-trust-leaver',
    ticketNumber: 'INC-4066',
    priority: 'P1 Critical',
    skillLevel: 'expert',
    deskTier: 'tier-2',
    category: 'Accounts & Access · Trust & Involuntary Offboarding',
    requesterName: 'Rachel Kim',
    requesterRole: 'HR Director & Field Operations Liaison',
    department: 'Human Resources',
    deviceHostname: 'FLD-LT-002',
    subject: 'URGENT: Returned field laptop shows "Trust relationship failed" + Immediate involuntary offboarding for same user!',
    initialMessage:
      'HR just completed an immediate involuntary termination for Marcus Vance (`mvance@corp.local`), and we need his access cut RIGHT NOW before anything leaks! Also, the field laptop he dropped off shows "The trust relationship between this workstation and the primary domain failed" when IT tried signing into his profile to recover his project folder.',
    slaTarget: '10m Response / 30m Resolve',
    chatOptions: [
      {
        id: 'e5-c1',
        question: 'First confirm HR authorization: is this involuntary offboarding approved with exact effective time ("Immediate"), and who should receive ownership of Marcus’s mailbox/OneDrive files?',
        userReply:
          'Confirmed—written HR termination ticket HR-9910 approved effective IMMEDIATELY! Please transfer project files and mailbox access strictly to his director, Jordan Hayes (`jhayes@corp.local`).',
        quality: 'helpful',
        feedbackNote: 'Confirmed immediate termination timing and manager authorization before touching any data or accounts.',
        unlocksClue: 'HR involuntary termination confirmed effective IMMEDIATELY; data recipient = Jordan Hayes (`jhayes`).',
      },
      {
        id: 'e5-c2',
        question: 'Notice for the returned laptop: we do NOT re-enable Marcus’s account to log in! How do we fix "trust relationship failed" safely so IT can inspect local data?',
        userReply:
          'Exactly—can we sign in with a cached local administrator account (`LAPS`), disconnect/unplug network or verify offboarding first, or use `Test-ComputerSecureChannel -Repair`?',
        quality: 'helpful',
        feedbackNote: 'Never re-enable an involuntary leaver’s AD account! Use local admin (`LAPS`) / offline recovery for the machine while cutting all access immediately.',
        unlocksClue: 'Use local LAPS admin (never re-enable terminated user) to repair domain trust / capture local files cleanly.',
      },
      {
        id: 'e5-c3',
        question: 'I’ll leave his VPN and Microsoft 365 sessions active until Friday so the broken laptop trust relationship repairs itself first.',
        userReply:
          'No!! This is an involuntary termination—any live session is a massive security breach risk!',
        quality: 'poor',
        feedbackNote: 'Involuntary offboarding requires immediate account disable + session token revocation—zero delay!',
      },
    ],
    cliHintCommands: ['Test-ComputerSecureChannel -Repair -Credential corp\\itadmin', 'Get-EntraUserSession mvance'],
    cliResponses: [
      {
        match: ['securechannel', 'trust', 'test-computer'],
        label: 'Repair Workstation AD Computer Trust Channel',
        output: `On FLD-LT-002 (signed in via Local LAPS Admin):\n  Before: Test-ComputerSecureChannel -> False (Machine password stale after 90d offline)\n  After : Test-ComputerSecureChannel -Repair -> True (Domain trust restored cleanly without reimaging!)`,
        isKeyFinding: true,
      },
      {
        match: ['session', 'entra', 'mvance'],
        label: 'Inspect Active Directory & Entra Session State',
        output: `User: mvance@corp.local\nAD Enabled: True (STILL ACTIVE!)\nEntra Refresh Tokens: 3 Active (Phone Outlook, Home Browser, VPN)\nMailbox / OneDrive: 42 GB`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Marcus Vance',
      upn: 'mvance@corp.local',
      department: 'Field Ops',
      ou: 'OU=FieldOps,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '41 days ago',
      groups: ['Domain Users', 'VPN_Users', 'SG_Field_Projects'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'WARNING: 3 active sessions on personal phone & home browser!',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID (Key ID: 88C1F200)',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Enterprise (Domain Trust Broken)',
      uptime: '0 days, 1 hour',
      ipv4: '10.10.15.70',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'Netlogon (Computer Secure Channel)', status: 'Failed', detail: 'Machine password out of sync with DC after extended travel' },
      ],
      eventLogs: [
        {
          time: '11:02 AM',
          source: 'Netlogon',
          eventId: '3210',
          summary: 'Failed to authenticate machine account FLD-LT-002$ against Domain Controller (Trust relationship failed).',
        },
      ],
      hardwareSummary: 'HR-9910 Involuntary Leaver Active · FLD-LT-002 machine trust stale.',
    },
    consoleActions: [
      {
        id: 'e5-offboard-immediate',
        label: 'Run Immediate Involuntary Leaver Checklist (Disable AD/Entra, Revoke Sessions/VPN, Retire BYOD, Shared/Hold Data -> Manager)',
        targetTab: 'directory',
        requiresChatId: 'e5-c1',
        effectSummary: 'Disabled mvance in AD & Entra, revoked all refresh tokens/VPN/MFA, triggered Intune Retire on personal BYOD phone, confirmed badge deactivation with Facilities, preserved data/converted mailbox for Jordan Hayes, and verified zero forwarding rules.',
        mutatesDirectory: {
          accountEnabled: false,
          ou: 'OU=Disabled_Leavers,DC=corp,DC=local',
          groups: [],
          activeSessions: 'ALL REVOKED · Account Disabled · BYOD Retired',
        },
      },
      {
        id: 'e5-repair-trust',
        label: 'Sign Into FLD-LT-002 via Local LAPS Admin & Run `Test-ComputerSecureChannel -Repair`',
        targetTab: 'diagnostics',
        requiresChatId: 'e5-c2',
        effectSummary: 'Logged into FLD-LT-002 via local LAPS admin (never re-enabling mvance!), repaired domain computer trust (`Test-ComputerSecureChannel -Repair`), verified BitLocker recovery key escrowed, and archived local desktop files for manager Jordan Hayes.',
        mutatesDiagnostics: {
          services: [
            { name: 'Netlogon (Computer Secure Channel)', status: 'Healthy', detail: 'Trust relationship repaired cleanly via LAPS' },
          ],
        },
      },
    ],
    expectedActionIds: ['e5-offboard-immediate', 'e5-repair-trust'],
    expectedChatIds: ['e5-c1', 'e5-c2'],
    rootCauseOptions: [
      'Marcus Vance’s active sessions required immediate involuntary termination lockout, while `FLD-LT-002` failed domain login because its computer account machine password went out of sync with the Domain Controller during prolonged offline travel.',
      'Reimaging FLD-LT-002 wipes all unbacked local project files first.',
      'Print Spooler broke the domain trust.',
      'Involuntary leavers stay active for 30 days before revocation.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Confirm written HR authorization (`HR-9910`) and execute the **involuntary leaver checklist immediately** (disable AD/Entra, revoke all tokens & VPN, retire BYOD, coordinate badge deactivation, preserve/convert mailbox/OneDrive for approved manager), then use local `LAPS` admin on `FLD-LT-002` to run `Test-ComputerSecureChannel -Repair` (or rejoin domain) and recover local data.',
      'Re-enable Marcus’s account so he can log in and transfer files personally.',
      'Wait until next month’s maintenance window to revoke VPN tokens.',
      'Discard `FLD-LT-002` without checking local files or BitLocker keys.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Run BOTH console actions: execute the immediate involuntary offboarding checklist in AD/Entra AND repair the computer trust channel using Local LAPS Admin (`Test-ComputerSecureChannel -Repair`)!',
      'Notice: NEVER delete a leaver’s mailbox or wipe an unbacked-up laptop before verifying retention/manager handover!',
    ],
    howAndWhy:
      'HOW & WHY: An involuntary termination is a synchronized security race: **disable accounts, revoke refresh tokens/VPN, retire BYOD, and alert badge security immediately** while preserving data safely (Shared Mailbox / Legal Hold / OneDrive manager access). Meanwhile, `"The trust relationship between this workstation and the primary domain failed"` occurs when a laptop stays offline past its 30-day AD computer-account password rotation—fixed cleanly in 30 seconds via Local Admin (`LAPS`) + `Test-ComputerSecureChannel -Repair` (or unjoin/rejoin workgroup->domain) without touching user files.',
  },

  {
    id: 'sim-e6-usb-lostphone',
    ticketNumber: 'INC-4079',
    priority: 'P1 Critical',
    skillLevel: 'expert',
    deskTier: 'tier-2',
    category: 'Mobile & Security · Lost Phone & Unknown USB',
    requesterName: 'David Osei',
    requesterRole: 'VP of Client Delivery & Lobby Reception',
    department: 'Executive / Facilities',
    deviceHostname: 'iPhone-DOsei-Corp',
    subject: 'P1 Security Double-Hit: Corporate phone stolen at airport + someone found an unknown "2026 Bonus" USB in our lobby!',
    initialMessage:
      'Two urgent calls within two minutes: (1) VP David Osei left his corporate-owned iPhone in an airport taxi with Outlook & Authenticator signed in! (2) Receptionist Zoe found a loose USB drive labeled "Executive Bonus 2026" outside the lobby door and asks if she should plug it into her PC to see who owns it!',
    slaTarget: '10m Response / 30m Resolve',
    chatOptions: [
      {
        id: 'e6-c1',
        question: 'First to Reception (Zoe): STOP—please do NOT plug that unknown USB stick into ANY computer! Lock it in a sealed envelope for Security immediately. Second, let’s verify David Osei out-of-band before locking/wiping his stolen corporate phone.',
        userReply:
          'Zoe sealed the unknown USB untouched! And David just answered callback on his verified hotel landline confirming his employee ID #0029 and authorizing full wipe on his stolen corporate-owned phone!',
        quality: 'helpful',
        feedbackNote: 'Stopped classic "USB drop" malware execution immediately AND verified VP identity cleanly before destructive MDM actions.',
        unlocksClue: 'Lobby USB quarantined untouched for InfoSec; VP strongly verified authorizing Wipe + Token Revoke on stolen corporate iPhone.',
      },
      {
        id: 'e6-c2',
        question: 'Since David used Microsoft Authenticator on that stolen phone, should we simply wipe the phone—or ALSO revoke all Entra sessions, suspend/remove the old phone’s MFA method, and audit sign-in logs?',
        userReply:
          'Good thinking! What if the thief grabbed an active token before the wipe command hit cellular?',
        quality: 'helpful',
        feedbackNote: 'Caught the hidden gap! Offline devices don’t receive MDM Wipe until reconnected—token revocation + MFA method removal closes access server-side instantly.',
        unlocksClue: 'Server-side Entra session revocation + removing stolen Authenticator registration closes offline exposure immediately.',
      },
      {
        id: 'e6-c3',
        question: 'Tell Zoe to plug the "Executive Bonus 2026" USB stick into her reception PC so she can read the filename and find its owner.',
        userReply:
          'Wait—what if it installs a keylogger or BadUSB keyboard injector?!',
        quality: 'poor',
        feedbackNote: 'Never plug unknown found USB drives into corporate systems ("baiting" / BadUSB malware).',
      },
    ],
    cliHintCommands: ['Get-EntraUserAuthMethod dosei', 'Invoke-IntuneDeviceWipe iPhone-DOsei-Corp'],
    cliResponses: [
      {
        match: ['authmethod', 'entra', 'dosei'],
        label: 'Inspect VP MFA & Active Refresh Tokens',
        output: `User: dosei@corp.local\nMFA Device: iPhone-DOsei-Corp (Authenticator Push + TOTP — STOLEN!)\nActive Refresh Tokens: 4 (Mobile Outlook, Teams, SharePoint, Web)`,
        isKeyFinding: true,
      },
      {
        match: ['wipe', 'intune', 'iphone'],
        label: 'Check Corporate MDM Ownership & Wipe Status',
        output: `Device: iPhone-DOsei-Corp | Ownership: Corporate-Owned | Encryption: FileVault/Hardware AES\nStatus: Pending remote Wipe (executes immediately upon cellular/Wi-Fi check-in).`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'David Osei',
      upn: 'dosei@corp.local',
      department: 'Executive',
      ou: 'OU=Executives,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '11 days ago',
      groups: ['Domain Users', 'SG_Exec_Board'],
      m365License: 'Microsoft 365 E5',
      mfaStatus: 'EXPOSED — Stolen phone holds Authenticator registration',
      activeSessions: '4 active refresh tokens (MUST REVOKE)',
      inboxRules: 'None',
      bitlockerKey: 'Hardware Encrypted iOS + BitLocker on laptop',
    },
    initialDiagnostics: {
      hostOs: 'Corporate iOS 17 (Lost/Stolen) + Physical Security Lobby USB Drop',
      uptime: 'Lost 25 minutes ago',
      ipv4: 'Cellular Pending Check-in',
      dnsServer: 'N/A',
      services: [
        { name: 'Intune Corporate MDM', status: 'Wipe Queued Needed', detail: 'Corp-owned iPhone eligible for full Factory Wipe' },
        { name: 'Physical USB Drop Incident', status: 'Quarantined Untouched', detail: 'Unknown "Executive Bonus 2026" USB sealed for InfoSec' },
      ],
      eventLogs: [
        {
          time: '11:18 AM',
          source: 'IT Security Intake',
          eventId: '701',
          summary: 'Lost corporate mobile device (dosei) + suspicious USB stick found in main reception lobby.',
        },
      ],
      hardwareSummary: 'Corporate-owned iPhone eligible for Intune Wipe; unknown USB quarantined untouched.',
    },
    consoleActions: [
      {
        id: 'e6-wipe-revoke-mfa',
        label: 'Revoke Entra Sessions, Remove Stolen Phone MFA Method & Trigger Intune Wipe (Corp Phone)',
        targetTab: 'directory',
        requiresChatId: 'e6-c1',
        effectSummary: 'Revoked all Entra tokens server-side, removed stolen iPhone from David’s MFA methods (issued verified Temporary Access Pass for replacement phone), and queued full Intune Factory Wipe on corporate device iPhone-DOsei-Corp.',
        mutatesDirectory: {
          mfaStatus: 'Old phone removed · Verified replacement pending via TAP',
          activeSessions: 'ALL 4 TOKENS REVOKED SERVER-SIDE',
        },
      },
      {
        id: 'e6-log-usb-infosec',
        label: 'Confirm Lobby USB Sealed Untouched & Escalate Physical Baiting Incident to InfoSec',
        targetTab: 'diagnostics',
        requiresChatId: 'e6-c1',
        effectSummary: 'Logged P1 physical security incident for the untouched "Executive Bonus 2026" lobby USB stick, thanked Reception for not plugging it in, and handed chain-of-custody to InfoSec.',
        mutatesDiagnostics: {
          services: [
            { name: 'Intune Corporate MDM', status: 'Wipe Issued + Tokens Cut', detail: 'Server-side sessions dead immediately; phone wipes on contact' },
            { name: 'Physical USB Drop Incident', status: 'Handed to InfoSec', detail: 'Zero endpoints touched unknown USB drive' },
          ],
        },
      },
    ],
    expectedActionIds: ['e6-wipe-revoke-mfa', 'e6-log-usb-infosec'],
    expectedChatIds: ['e6-c1', 'e6-c2'],
    rootCauseOptions: [
      'A stolen corporate iPhone created cloud-session and MFA token exposure requiring server-side revocation + Intune Wipe, while the enticingly labeled lobby USB is a classic physical social-engineering bait drop.',
      'Reception should always open unknown USB files on an HR computer first.',
      'Only personal BYOD phones ever need token revocation.',
      'Intune Wipe works instantly even when a phone is powered off in a Faraday bag without revoking cloud sessions.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Stop Reception immediately from plugging in the unknown USB and hand it untouched to InfoSec; verify the VP strongly out-of-band, revoke all Entra sessions and delete the stolen phone’s MFA method immediately server-side, trigger a full Intune `Wipe` on the corporate-owned iPhone, and audit sign-in logs.',
      'Plug the unknown USB into an accounting laptop to check who owns it, and tell David to wait 3 days to see if his phone turns up.',
      'Only send an Intune Wipe without revoking Entra tokens or removing the Authenticator app.',
      'Turn off MFA permanently on the VP’s account.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Never trust a "lost bonus" USB drive found in a lobby—classic physical malware baiting!',
      'Why isn’t queuing an Intune Wipe enough by itself? If the thief toggles Airplane Mode, revoking Entra tokens + removing the old MFA device stops cloud access RIGHT NOW.',
    ],
    howAndWhy:
      'HOW & WHY: Lost mobile devices require two simultaneous layers: **server-side immediate denial** (revoke Entra refresh tokens, remove stolen Authenticator/FIDO registration, audit recent sign-ins) plus **device-side MDM Wipe** (corporate) or **Retire** (BYOD). Meanwhile, never plug unverified found USB drives into any work device—report physical baiting drops directly to Security.',
  },
];
