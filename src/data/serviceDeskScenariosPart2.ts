import type { ServiceDeskScenario } from './serviceDeskScenarios';

export const SERVICE_DESK_SCENARIOS_PART_2: ServiceDeskScenario[] = [
  // ==================== BEGINNER · TIER 1 (EXTRA) ====================
  {
    id: 'sim-b4-wifi',
    ticketNumber: 'INC-1055',
    priority: 'P3 Medium',
    skillLevel: 'beginner',
    deskTier: 'tier-1',
    category: 'Network · Wi-Fi & Captive Portal',
    requesterName: 'Tariq Mensah',
    requesterRole: 'Field Sales Representative',
    department: 'Sales',
    deviceHostname: 'SALES-LT-022',
    subject: 'Hotel Wi-Fi says "Connected, no internet" before my client pitch',
    initialMessage:
      'I’m in a hotel lobby—the Wi-Fi icon says Connected to "GrandHotel_Guest", yet Outlook and Teams say offline and Chrome throws "Your connection is not private" whenever I open Google!',
    slaTarget: '1h Response / 4h Resolve',
    chatOptions: [
      {
        id: 'b4-c1',
        question: 'Did a hotel welcome / terms-and-conditions sign-in page pop up when you joined, and have you connected your corporate VPN yet?',
        userReply:
          'No welcome page popped up—I went straight to https://google.com and got a certificate error. My Always-On VPN client says "Reconnecting..." in the corner.',
        quality: 'helpful',
        feedbackNote: 'Smart discovery! HTTPS HSTS bookmarks block hotel captive portals, and VPN loops fight portal redirects.',
        unlocksClue: 'Captive portal never opened; user went straight to HTTPS site while corporate VPN client tried intercepting.',
      },
      {
        id: 'b4-c2',
        question: 'Can you run `netsh wlan show interfaces` or click a plain HTTP test page after pausing VPN briefly?',
        userReply:
          'I paused VPN and typed http://neverssl.com — the hotel room-number login screen immediately loaded!',
        quality: 'helpful',
        feedbackNote: 'Clean screen-free workaround: plain HTTP triggers the captive portal redirect safely.',
        unlocksClue: 'Opening non-HSTS HTTP URL revealed the unauthenticated hotel captive portal login page.',
      },
      {
        id: 'b4-c3',
        question: 'Your hotel router is hacked—reinstall Windows right away!',
        userReply:
          'Wait, really?! I have a client pitch in 10 minutes!',
        quality: 'poor',
        feedbackNote: 'Never panic callers or wipe OS for a normal captive portal HTTPS warning.',
      },
    ],
    cliHintCommands: ['netsh wlan show interfaces', 'ipconfig /all'],
    cliResponses: [
      {
        match: ['netsh wlan', 'wlan'],
        label: 'Inspect Wi-Fi Radio & Signal',
        output: `Name                   : Wi-Fi\nSSID                   : GrandHotel_Guest\nSignal                 : 88%\nRadio type             : 802.11ax (5 GHz)\nAuthentication         : Open (Captive Portal)`,
        isKeyFinding: true,
      },
      {
        match: ['ipconfig', 'ip'],
        label: 'Inspect IPv4 & Default Gateway',
        output: `Wireless LAN adapter Wi-Fi:\n  IPv4 Address. . . . . . . . . . . : 172.20.14.88\n  Default Gateway . . . . . . . . . : 172.20.0.1\n  DNS Servers . . . . . . . . . . . : 172.20.0.1`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Tariq Mensah',
      upn: 'tmensah@corp.local',
      department: 'Sales',
      ou: 'OU=Sales,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '31 days ago',
      groups: ['Domain Users', 'VPN_Users'],
      m365License: 'Microsoft 365 Business Premium',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Pro (23H2)',
      uptime: '1 day, 4 hours',
      ipv4: '172.20.14.88 (Guest Wi-Fi)',
      dnsServer: '172.20.0.1 (Captive Redirect Active)',
      services: [
        { name: 'WlanSvc', status: 'Running', detail: 'Associated to GrandHotel_Guest (88% signal)' },
        { name: 'CorpVPNClient', status: 'Reconnecting', detail: 'Blocked by unauthenticated hotel captive portal' },
      ],
      eventLogs: [
        {
          time: '08:42 AM',
          source: 'NCSI (Network Connectivity Status Indicator)',
          eventId: '4042',
          summary: 'DNS probe redirected to captive.grandhotel.local (No Internet until portal terms accepted).',
        },
      ],
      hardwareSummary: 'Intel Wi-Fi 6E AX211 · 5 GHz band healthy · Captive portal interception.',
    },
    consoleActions: [
      {
        id: 'b4-guide-portal',
        label: 'Guide Captive Portal Sign-In via HTTP Redirect + Reconnect VPN',
        targetTab: 'diagnostics',
        requiresChatId: 'b4-c1',
        effectSummary: 'User paused VPN, accepted hotel portal at http://neverssl.com, then reconnected corporate VPN cleanly. Internet & M365 green!',
        mutatesDiagnostics: {
          services: [
            { name: 'WlanSvc', status: 'Running', detail: 'Authenticated on GrandHotel_Guest' },
            { name: 'CorpVPNClient', status: 'Connected', detail: 'Encrypted tunnel active over hotel Wi-Fi' },
          ],
        },
      },
    ],
    expectedActionIds: ['b4-guide-portal'],
    expectedChatIds: ['b4-c1', 'b4-c2'],
    rootCauseOptions: [
      'The hotel Wi-Fi captive portal had not been signed into yet, so the hotel DNS redirected HTTPS requests and caused certificate warnings while blocking the corporate VPN handshake.',
      'The laptop Wi-Fi card burned out.',
      'Active Directory deleted the Sales OU.',
      'Microsoft 365 revoked all licenses.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Pause VPN briefly if it loops, navigate to the gateway IP or a plain HTTP trigger URL (`http://neverssl.com`) to complete the hotel captive portal login, then reconnect the corporate VPN for encrypted traffic.',
      'Disable TLS certificate validation permanently in Windows.',
      'Have the user share their domain password with the hotel front desk.',
      'Tell the user to reinstall Chrome.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Notice Wi-Fi IS connected with a valid 172.20.x.x IP—why would HTTPS Google show a certificate error at a hotel?',
      'Pause VPN briefly so the plain HTTP captive portal page can load, accept terms, then turn VPN right back on.',
    ],
    howAndWhy:
      'HOW & WHY: Modern browsers block HTTPS redirects (HSTS) when a hotel/airport captive portal hijacks Google or M365, causing "Your connection is not private" and hanging VPN tunnels. Opening a plain HTTP page (or the Default Gateway IP) loads the login splash page safely, after which the VPN reconnects cleanly.',
  },

  {
    id: 'sim-b5-webcam',
    ticketNumber: 'INC-1063',
    priority: 'P3 Medium',
    skillLevel: 'beginner',
    deskTier: 'tier-1',
    category: 'Peripherals · Audio & Camera Privacy',
    requesterName: 'Hannah Park',
    requesterRole: 'HR Specialist',
    department: 'Human Resources',
    deviceHostname: 'HR-LT-019',
    subject: 'Camera shows black square and headset is silent in candidate Teams interview',
    initialMessage:
      'I have a candidate video interview in 12 minutes! Teams shows a black camera box with a camera-slash icon, and even though my Bluetooth headset says Connected, I hear zero sound!',
    slaTarget: '1h Response / 4h Resolve',
    chatOptions: [
      {
        id: 'b5-c1',
        question: 'First quick check: is there a physical plastic privacy shutter slid across your laptop webcam lens (or an F-key camera toggle), and did Windows show any camera permission banner?',
        userReply:
          'Good catch checking—the physical shutter is open, and I noticed a tiny red badge when Windows Settings -> Privacy & security -> Camera appeared earlier when I clicked "Block" by mistake!',
        quality: 'helpful',
        feedbackNote: 'Isolated physical shutter vs OS camera privacy permission in one clear question.',
        unlocksClue: 'Physical shutter is open; Windows Camera Privacy access was previously toggled Off / Blocked.',
      },
      {
        id: 'b5-c2',
        question: 'And in Teams Device Settings / Windows Sound Output, which playback device is currently selected—dock speakers, monitor HDMI, or your Bluetooth headset?',
        userReply:
          'Oh! Windows Volume says "DELL U2722D (Intel Display Audio)"—my monitor with no speakers—and Teams had "Headset Hands-Free" selected separately!',
        quality: 'helpful',
        feedbackNote: 'Caught classic dual-monitor HDMI audio hijack + Bluetooth Hands-Free vs Stereo profile confusion.',
        unlocksClue: 'Windows default audio hijacked by DisplayPort/HDMI monitor with no speakers.',
      },
      {
        id: 'b5-c3',
        question: 'Buy a brand-new webcam at the store and reschedule the candidate.',
        userReply:
          'They join in 10 minutes—surely we can check Windows settings first?!',
        quality: 'poor',
        feedbackNote: 'Always verify OS privacy toggles, shutter, and playback device selection before hardware replacement.',
      },
    ],
    cliHintCommands: ['pnputil /enum-devices /class Camera', 'systeminfo | findstr /B /C:"OS Name"'],
    cliResponses: [
      {
        match: ['pnputil', 'camera', 'audio'],
        label: 'Inspect Camera & Audio Device Enumeration',
        output: `Instance ID: USB\\VID_04F2&PID_B729 (Integrated Webcam)\nStatus     : Started (Driver OK)\nOS Policy  : CapabilityAccessManager -> Camera = Deny\nAudio Out  : Default = DELL U2722D (Display Audio) | BT Headset = Ready`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Hannah Park',
      upn: 'hpark@corp.local',
      department: 'Human Resources',
      ou: 'OU=HR,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '19 days ago',
      groups: ['Domain Users'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Pro (23H2)',
      uptime: '2 days, 3 hours',
      ipv4: '10.10.22.41',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'Audiosrv', status: 'Running', detail: 'Default output set to DELL U2722D Monitor Audio' },
        { name: 'FrameServer (Camera)', status: 'Blocked by Privacy', detail: 'Desktop/Teams camera access set to Deny' },
      ],
      eventLogs: [
        {
          time: '09:44 AM',
          source: 'CapabilityAccessManager',
          eventId: '100',
          summary: 'Application ms-teams.exe denied access to Camera under User Privacy Settings.',
        },
      ],
      hardwareSummary: 'Integrated Webcam driver healthy · Bluetooth Jabra Evolve2 connected · Output pointing to monitor.',
    },
    consoleActions: [
      {
        id: 'b5-enable-privacy',
        label: 'Enable OS Camera & Microphone Privacy Access for Desktop Apps + Select Bluetooth Headset in Teams',
        targetTab: 'diagnostics',
        requiresChatId: 'b5-c1',
        effectSummary: 'Enabled Camera Privacy access in Settings -> Privacy & security -> Camera, switched Audio Output to Jabra Bluetooth Headset, verified live test call.',
        mutatesDiagnostics: {
          services: [
            { name: 'Audiosrv', status: 'Running', detail: 'Default output switched to Jabra Evolve2 Headset' },
            { name: 'FrameServer (Camera)', status: 'Active', detail: 'Teams webcam feed active & verified' },
          ],
        },
      },
    ],
    expectedActionIds: ['b5-enable-privacy'],
    expectedChatIds: ['b5-c1', 'b5-c2'],
    rootCauseOptions: [
      'Windows Privacy & Security blocked Camera access for apps while external monitor audio (`DELL U2722D`) stole the default Windows/Teams audio playback route.',
      'The Bluetooth headset battery ran out permanently.',
      'Active Directory GPO banned HR from using microphones.',
      'The laptop RAM failed POST.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Confirm physical camera shutter is open, re-enable Camera/Mic permissions in OS Privacy settings, select the Bluetooth headset explicitly in both OS Sound and Teams Device Settings, and run a quick Teams Test Call.',
      'Replace the laptop motherboard immediately.',
      'Tell the user to join without camera or audio.',
      'Uninstall Windows Audio service.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Check `CapabilityAccessManager` in Diagnostics and ask about both privacy toggles and monitor audio.',
      'Monitors connected over HDMI/DisplayPort frequently steal Windows default audio output, and one accidental Deny click blocks Teams camera access.',
    ],
    howAndWhy:
      'HOW & WHY: Over 70% of "broken webcam/headset" calls are three harmless settings: physical lens shutter closed, OS Privacy permission denied, or an external monitor/dock stealing default playback output. Checking these in 90 seconds saves hardware swaps and rescues live meetings.',
  },

  {
    id: 'sim-b6-printip',
    ticketNumber: 'INC-1071',
    priority: 'P2 High',
    skillLevel: 'beginner',
    deskTier: 'tier-1',
    category: 'Printing · Network IP & Thermal',
    requesterName: 'Carlos Vega',
    requesterRole: 'Warehouse Supervisor',
    department: 'Logistics',
    deviceHostname: 'WH-DESK-004',
    subject: 'Office laser printer says Offline after power outage & Zebra thermal labels come out blank',
    initialMessage:
      'Two morning warehouse headaches: our main HP laser printer (`HP-WH-01`) shows "Offline" for everyone since last night’s power blip, AND my desk thermal label printer feeds blank labels even though the print job finishes!',
    slaTarget: '30m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'b6-c1',
        question: 'On the HP laser printer screen, can you print a quick Network Configuration sheet (or tap the Wi-Fi/Network icon) to read its current IP address, and check how the Zebra thermal roll is loaded?',
        userReply:
          'HP screen says `10.10.60.148` right now! And wait—someone swapped the Zebra direct-thermal roll upside down so the shiny backing side faces the print head!',
        quality: 'helpful',
        feedbackNote: 'Great two-part Layer-1 discovery: HP DHCP IP changed from old port binding + thermal paper loaded upside down.',
        unlocksClue: 'HP-WH-01 pulled new DHCP IP `10.10.60.148` (previously `10.10.60.45`); Zebra thermal roll loaded coated-side down.',
      },
      {
        id: 'b6-c2',
        question: 'Is this affecting all warehouse PCs for the HP laser printer, or only your workstation?',
        userReply:
          'All four packing desks show `HP-WH-01` Offline since this morning!',
        quality: 'helpful',
        feedbackNote: 'Confirmed shared network printer port mismatch across all warehouse stations.',
        unlocksClue: 'Multi-user scope on HP-WH-01 confirms print server / port IP drift.',
      },
      {
        id: 'b6-c3',
        question: 'Replace the ink cartridges inside the thermal label printer.',
        userReply:
          'Thermal label printers don’t even take ink cartridges!',
        quality: 'poor',
        feedbackNote: 'Direct-thermal printers react to heat on chemically coated paper—never ink/toner.',
      },
    ],
    cliHintCommands: ['ping 10.10.60.45', 'ping 10.10.60.148', 'get-printerport'],
    cliResponses: [
      {
        match: ['10.10.60.45'],
        label: 'Ping Old Configured Printer Port IP',
        output: `Pinging 10.10.60.45 with 32 bytes of data:\nRequest timed out. (4 lost — 100% loss)`,
      },
      {
        match: ['10.10.60.148'],
        label: 'Ping Current Printer IP',
        output: `Pinging 10.10.60.148 with 32 bytes of data:\nReply from 10.10.60.148: bytes=32 time=2ms TTL=64`,
        isKeyFinding: true,
      },
      {
        match: ['get-printer', 'printerport', 'wsd'],
        label: 'Inspect Print Port Binding',
        output: `Name          : WSD-9a2b4c (or Old IP 10.10.60.45)\nPrinter       : HP-WH-01\nStatus        : Offline (Port Unreachable)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Carlos Vega',
      upn: 'cvega@corp.local',
      department: 'Logistics',
      ou: 'OU=Logistics,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '45 days ago',
      groups: ['Domain Users', 'WH_Printers'],
      m365License: 'Microsoft 365 F3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Pro (23H2)',
      uptime: '4 days, 2 hours',
      ipv4: '10.10.60.12',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'Spooler', status: 'Running', detail: 'HP-WH-01 jobs stalled targeting old WSD / 10.10.60.45 port' },
      ],
      eventLogs: [
        {
          time: '07:15 AM',
          source: 'PrintService',
          eventId: '372',
          summary: 'Document failed to print on HP-WH-01: WSD/IP endpoint 10.10.60.45 timed out.',
        },
      ],
      hardwareSummary: 'HP-WH-01 changed IP via DHCP (.45 -> .148) · Zebra ZP450 direct-thermal labels loaded reversed.',
    },
    consoleActions: [
      {
        id: 'b6-fix-tcpip-port',
        label: 'Bind Print Server Queue to Standard TCP/IP Port (10.10.60.148) + Request Static/DHCP Reservation',
        targetTab: 'diagnostics',
        requiresChatId: 'b6-c1',
        effectSummary: 'Switched HP-WH-01 from flaky WSD / old IP to Standard TCP/IP port 10.10.60.148 and filed NetOps ticket for a permanent DHCP reservation. User flipped thermal label roll right-side up; test label printed cleanly!',
        mutatesDiagnostics: {
          services: [
            { name: 'Spooler', status: 'Running', detail: 'HP-WH-01 printing over Standard TCP/IP 10.10.60.148' },
          ],
          hardwareSummary: 'HP-WH-01 online for all warehouse stations; Zebra printing crisp barcodes.',
        },
      },
    ],
    expectedActionIds: ['b6-fix-tcpip-port'],
    expectedChatIds: ['b6-c1', 'b6-c2'],
    rootCauseOptions: [
      'HP-WH-01 pulled a new DHCP IP (`10.10.60.148`) after the power outage leaving stations/WSD aimed at the stale `.45` address, while the Zebra thermal roll was loaded upside down so the print head heated the non-thermal backing.',
      'The warehouse switch blocked TCP port 443.',
      'Zebra printers require laser toner cartridges.',
      'Active Directory disabled all Logistics printers.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Flip the direct-thermal roll so the coated label face meets the print head (confirm with fingernail scratch test), bind HP-WH-01 to a Standard TCP/IP Port at `10.10.60.148` instead of flaky WSD, and add a permanent DHCP reservation so its IP never drifts again.',
      'Reboot all warehouse PCs ten times.',
      'Delete the Print Spooler permanently.',
      'Replace both printers immediately.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Compare `ping 10.10.60.45` vs `ping 10.10.60.148` and notice how WSD/dynamic IPs drift after power loss.',
      'Direct-thermal labels are heat-sensitive on ONE side only—upside-down rolls feed crisp blank sheets!',
    ],
    howAndWhy:
      'HOW & WHY: Network printers on dynamic DHCP leases frequently break after power cycles—binding them via Standard TCP/IP Port PLUS a router/DHCP Reservation stops repeat offline outages. Meanwhile, blank direct-thermal labels almost always mean upside-down paper (or wrong media type), never empty ink.',
  },

  // ==================== INTERMEDIATE · TIER 1 (EXTRA) ====================
  {
    id: 'sim-i4-onedrive',
    ticketNumber: 'INC-2041',
    priority: 'P3 Medium',
    skillLevel: 'intermediate',
    deskTier: 'tier-1',
    category: 'Email & M365 · OneDrive Sync',
    requesterName: 'Nadia Okafor',
    requesterRole: 'Grant Coordinator',
    department: 'Operations',
    deviceHostname: 'OPS-LT-031',
    subject: 'OneDrive shows red X on Desktop/Documents and files aren’t syncing!',
    initialMessage:
      'My OneDrive cloud icon in the tray has a red X, a new folder on my Desktop isn’t showing on my home laptop, and I accidentally deleted a budget spreadsheet two weeks ago—can we restore it too?',
    slaTarget: '1h Response / 4h Resolve',
    chatOptions: [
      {
        id: 'i4-c1',
        question: 'Can you click the red OneDrive cloud icon in your taskbar and tell me the exact sync error or filename it flags?',
        userReply:
          'It says: "Can’t sync `Budget: Q3 Draft?.xlsx` — file name contains invalid characters" and also warns one nested SharePoint shortcut path exceeds maximum characters!',
        quality: 'helpful',
        feedbackNote: 'Reading the exact OneDrive error banner isolates invalid characters / path length immediately.',
        unlocksClue: 'OneDrive sync stalled on illegal filename (`:` / `?`) and long nested path.',
      },
      {
        id: 'i4-c2',
        question: 'Have you checked OneDrive on the web (`onedrive.com` / office.com) -> Recycle bin for the file deleted 14 days ago?',
        userReply:
          'I hadn’t checked the web Recycle bin yet—only my laptop Desktop Recycle Bin!',
        quality: 'helpful',
        feedbackNote: 'Great catch! Cloud OneDrive files remain in the web Recycle Bin (~93 days for M365) even if cleared locally.',
        unlocksClue: 'Deleted spreadsheet from 14 days ago still falls well inside OneDrive’s ~93-day cloud retention.',
      },
      {
        id: 'i4-c3',
        question: 'Delete the entire `C:\\Users\\nokafor\\OneDrive` folder permanently to clear the red X.',
        userReply:
          'Wait—my unsynced Desktop reports are inside that folder!',
        quality: 'poor',
        feedbackNote: 'Deleting local OneDrive folders destroys unsynced local changes! Always inspect/copy unsynced files first.',
      },
    ],
    cliHintCommands: ['dir C:\\Users\\nokafor\\OneDrive* /b', 'tasklist | findstr /i OneDrive'],
    cliResponses: [
      {
        match: ['dir', 'onedrive'],
        label: 'Check OneDrive Known Folder Path & Local Status',
        output: `OneDrive - Corp (Known Folder Move: Desktop + Documents + Pictures)\nSync Blocker 1: Illegal characters (: ?) in "Budget: Q3 Draft?.xlsx"\nSync Blocker 2: Path length 289 chars in nested Grants\\2026\\Archive folder`,
        isKeyFinding: true,
      },
      {
        match: ['tasklist', 'status'],
        label: 'Check OneDrive Client Process',
        output: `OneDrive.exe   PID 6112   Running   Account: nokafor@corp.local   Quota: 18% of 1 TB`,
      },
    ],
    initialDirectory: {
      displayName: 'Nadia Okafor',
      upn: 'nokafor@corp.local',
      department: 'Operations',
      ou: 'OU=Operations,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '12 days ago',
      groups: ['Domain Users', 'SG_Grants_Team'],
      m365License: 'Microsoft 365 Business Standard',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Pro (23H2)',
      uptime: '3 days, 1 hour',
      ipv4: '10.10.30.77',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'OneDrive Sync (KFM)', status: 'Sync Error (2 items)', detail: 'Invalid filename chars & path length limit' },
      ],
      eventLogs: [
        {
          time: '10:02 AM',
          source: 'OneDrive',
          eventId: '201',
          summary: 'File sync skipped: invalid characters or path length exceeded (~260+ Windows limit).',
        },
      ],
      hardwareSummary: 'OneDrive quota healthy (180 GB / 1 TB) · Known Folder Move enabled on Desktop & Documents.',
    },
    consoleActions: [
      {
        id: 'i4-fix-sync-recycle',
        label: 'Rename Invalid Filename / Shorten Folder Path & Restore File from Web Recycle Bin',
        targetTab: 'diagnostics',
        requiresChatId: 'i4-c1',
        effectSummary: 'Renamed file to Budget_Q3_Draft.xlsx, shortened nested folder path, verified green checkmark sync, and restored the 14-day-old spreadsheet from OneDrive Web Recycle Bin.',
        mutatesDiagnostics: {
          services: [
            { name: 'OneDrive Sync (KFM)', status: 'Up to date', detail: 'All Desktop/Documents files synced cleanly' },
          ],
        },
      },
    ],
    expectedActionIds: ['i4-fix-sync-recycle'],
    expectedChatIds: ['i4-c1', 'i4-c2'],
    rootCauseOptions: [
      'OneDrive sync stalled on illegal filename characters (`:`/`?`) and an overly long nested path, while the deleted spreadsheet remained recoverable inside the M365 OneDrive Web Recycle Bin.',
      'OneDrive storage is permanently capped at 10 MB.',
      'Syncing OneDrive automatically serves as an immutable offline backup forever.',
      'Active Directory deleted Nadia’s Desktop folder.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Rename the file to remove restricted characters (`? : * " < > | / \\`), flatten the deep folder nesting, confirm green OneDrive sync status, and restore the deleted file from the OneDrive Web Recycle Bin (and remind the user Sync is not a permanent backup).',
      'Wipe the user profile and reimage the machine.',
      'Reinstall Windows 11 Home.',
      'Tell the user deleted OneDrive files disappear after 24 hours.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Click the red X clue in Chat: Windows/OneDrive refuses characters like `?` or `:` and deeply nested folder paths.',
      'Where do M365 OneDrive deleted files live for up to ~93 days (plus Second-stage recycle bin)?',
    ],
    howAndWhy:
      'HOW & WHY: OneDrive Known Folder Move backs Desktop/Documents to the cloud—yet illegal filename characters (`?`, `:`, `*`), paused sync, or long nested paths stall uploads silently. Meanwhile, the M365 web Recycle Bin (~93 days total retention) rescues accidental deletes fast, though Sync alone is never a substitute for true versioned backups.',
  },

  {
    id: 'sim-i5-outlook-safe',
    ticketNumber: 'INC-2058',
    priority: 'P2 High',
    skillLevel: 'intermediate',
    deskTier: 'tier-1',
    category: 'Email & M365 · Outlook Crash',
    requesterName: 'Derek Hollis',
    requesterRole: 'Procurement Lead',
    department: 'Procurement',
    deviceHostname: 'PROC-WS-011',
    subject: 'Desktop Outlook freezes and crashes every time I click an email with a PDF',
    initialMessage:
      'Every time I open an invoice email in desktop Outlook it hangs on "Not Responding" and crashes! I can’t approve vendor POs!',
    slaTarget: '30m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'i5-c1',
        question: 'First quick workaround & clue: if you sign into Outlook on the web (`outlook.office.com`), do those same PDF emails open cleanly without crashing?',
        userReply:
          'Yes! Webmail opened the invoice PDFs immediately—only the desktop Outlook app freezes!',
        quality: 'helpful',
        feedbackNote: 'Proved the mailbox & server are healthy AND gave the user a working workaround for urgent POs.',
        unlocksClue: 'OWA / Webmail opens PDFs fine; crash isolates strictly to local desktop Outlook client.',
      },
      {
        id: 'i5-c2',
        question: 'Have you noticed any third-party PDF or CRM add-in installed recently, and can we test `outlook.exe /safe`?',
        userReply:
          'Good idea! Yesterday I installed a third-party "FastPDF Previewer" utility, and launching `outlook.exe /safe` didn’t crash at all!',
        quality: 'helpful',
        feedbackNote: 'Safe Mode isolated a faulty COM add-in cleanly without touching OST data prematurely.',
        unlocksClue: 'Outlook runs smoothly in `/safe` mode; `FastPDFPreview.dll` COM add-in installed yesterday.',
      },
      {
        id: 'i5-c3',
        question: 'Delete your entire mailbox from Exchange Online to start fresh.',
        userReply:
          'What?! That holds five years of vendor contracts!',
        quality: 'poor',
        feedbackNote: 'Never wipe cloud mailboxes for a local desktop crash when Webmail works.',
      },
    ],
    cliHintCommands: ['outlook.exe /safe', 'wevtutil qe Application /c:3 /f:text'],
    cliResponses: [
      {
        match: ['outlook.exe /safe', 'safe'],
        label: 'Test Outlook Safe Mode Launch',
        output: `Launching OUTLOOK.EXE /safe (COM Add-ins & custom toolbars disabled)...\nResult: PDF preview & folder switching stable — zero hangs after 3 minutes.`,
        isKeyFinding: true,
      },
      {
        match: ['wevtutil', 'event', 'application'],
        label: 'Inspect Application Event Log',
        output: `Event ID 1000 (Application Error):\n  Faulting app : OUTLOOK.EXE\n  Faulting mod : FastPDFPreview.dll (v2.1.0)\n  Exception    : 0xc0000005 Access Violation`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Derek Hollis',
      upn: 'dhollis@corp.local',
      department: 'Procurement',
      ou: 'OU=Procurement,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '40 days ago',
      groups: ['Domain Users'],
      m365License: 'Microsoft 365 Business Premium',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Pro (23H2)',
      uptime: '2 days, 8 hours',
      ipv4: '10.10.25.62',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'Microsoft Outlook (Desktop)', status: 'Crashing on PDF Preview', detail: 'COM Add-in FastPDFPreview.dll active' },
      ],
      eventLogs: [
        {
          time: '09:18 AM',
          source: 'Application Error',
          eventId: '1000',
          summary: 'OUTLOOK.EXE crashed inside faulting module FastPDFPreview.dll.',
        },
      ],
      hardwareSummary: 'Local OST size normal (4.2 GB) · OWA healthy · Faulting COM Add-in detected.',
    },
    consoleActions: [
      {
        id: 'i5-disable-addin',
        label: 'Disable Faulty FastPDFPreview COM Add-in & Verify Normal Outlook Launch',
        targetTab: 'diagnostics',
        requiresChatId: 'i5-c2',
        effectSummary: 'Disabled FastPDFPreview COM Add-in inside File -> Options -> Add-ins; restarted Outlook normally and verified PDF previews work with zero crashes.',
        mutatesDiagnostics: {
          services: [
            { name: 'Microsoft Outlook (Desktop)', status: 'Healthy', detail: 'Faulty COM Add-in disabled; PDF preview stable' },
          ],
        },
      },
    ],
    expectedActionIds: ['i5-disable-addin'],
    expectedChatIds: ['i5-c1', 'i5-c2'],
    rootCauseOptions: [
      'A newly installed third-party COM add-in (`FastPDFPreview.dll`) caused Access Violation crashes (`Event ID 1000`) inside desktop Outlook whenever previewing PDFs.',
      'Exchange Online discontinued PDF attachments worldwide.',
      'Derek’s Active Directory password expired.',
      'His Ethernet cable was unplugged.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Provide OWA (`outlook.office.com`) as an immediate continuity workaround, confirm stability in `outlook.exe /safe` + Event ID 1000, and disable/remove the faulting `FastPDFPreview.dll` COM add-in.',
      'Reimage the desktop immediately without testing Webmail or Safe Mode.',
      'Tell Derek to permanently keep Outlook closed and disable Windows Updates.',
      'Delete his Active Directory user object.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Always test Webmail (`OWA`) first to separate server/mailbox trouble from local desktop Outlook crashes, then test `outlook.exe /safe`!',
      'Inspect Event ID 1000 in Endpoint CLI / Diagnostics to spot the exact faulting `.dll`.',
    ],
    howAndWhy:
      'HOW & WHY: Testing Webmail first gives the user immediate productivity while proving the cloud mailbox is intact. Launching `outlook.exe /safe` disables COM add-ins and corrupted pane customizations in seconds—revealing bad PDF/CRM plug-ins before anyone wastes hours rebuilding OST caches unnecessarily.',
  },

  {
    id: 'sim-i6-mfa-clock',
    ticketNumber: 'INC-2074',
    priority: 'P2 High',
    skillLevel: 'intermediate',
    deskTier: 'tier-1',
    category: 'Accounts & Access · MFA & Verification',
    requesterName: 'Samira Hassan',
    requesterRole: 'Project Manager',
    department: 'PMO',
    deviceHostname: 'PMO-LT-014',
    subject: 'Microsoft Authenticator 6-digit codes keep saying Invalid Code since my trip!',
    initialMessage:
      'I flew to Nairobi last night, and my Authenticator 6-digit codes keep getting rejected! Also a colleague says his old phone died and he needs MFA reset—let’s fix my codes first please!',
    slaTarget: '30m Response / 2h Resolve',
    chatOptions: [
      {
        id: 'i6-c1',
        question: 'Before we adjust any MFA method or issue a Temporary Access Pass, let’s verify your identity using our strong policy: employee ID plus callback to your verified HR manager/phone on file.',
        userReply:
          'Sure! Employee ID #4109—I just answered your callback on my verified corporate mobile number and confirmed my hire month.',
        quality: 'helpful',
        feedbackNote: 'Passed mandatory strong out-of-band identity verification before any MFA troubleshooting/changes.',
        unlocksClue: 'Caller strongly verified via approved phone callback & HR employee check.',
      },
      {
        id: 'i6-c2',
        question: 'When you check Date & Time settings on your phone right now, is "Set time automatically" turned ON—or was the clock manually offset for travel?',
        userReply:
          'Aha! I set my phone clock manually yesterday instead of using Automatic Time Zone—it’s off by 4 minutes from network time!',
        quality: 'helpful',
        feedbackNote: 'Nailed it! TOTP 6-digit codes expire every 30 seconds based on exact UTC timestamps.',
        unlocksClue: 'Phone clock drifted 4 minutes due to manual Date & Time setting, breaking 30-second TOTP codes.',
      },
      {
        id: 'i6-c3',
        question: 'I’ll just turn off MFA permanently on your entire account so it never bothers you again.',
        userReply:
          'Wait—isn’t MFA mandatory for Microsoft 365 logins?',
        quality: 'poor',
        feedbackNote: 'Security violation: never disable MFA permanently to dodge a fixable TOTP clock or re-enrollment task.',
      },
    ],
    cliHintCommands: ['w32tm /query /status', 'Get-EntraAuditSignIn'],
    cliResponses: [
      {
        match: ['w32tm', 'time', 'entra', 'audit'],
        label: 'Check Entra MFA Audit & Time Sync Reference',
        output: `Entra Sign-in Log for shassan@corp.local:\n  Error Code : 500121 (Authentication failed during strong auth request)\n  Detail     : OTP code mismatch (TOTP window +/- 30s exceeded due to client device clock drift).`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Samira Hassan',
      upn: 'shassan@corp.local',
      department: 'PMO',
      ou: 'OU=PMO,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '18 days ago',
      groups: ['Domain Users', 'SG_PMO_Leads'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator TOTP failing — Error 500121)',
      activeSessions: 'Blocked at MFA prompt',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Pro · iOS Companion Phone',
      uptime: '1 day, 11 hours',
      ipv4: '197.232.14.88',
      dnsServer: '8.8.8.8',
      services: [
        { name: 'Entra MFA Validation', status: 'Error 500121', detail: 'TOTP clock drift > 30s on user phone' },
      ],
      eventLogs: [
        {
          time: '09:05 AM',
          source: 'Entra ID Sign-in',
          eventId: '500121',
          summary: 'TOTP verification rejected — phone system clock skewed by ~4 minutes.',
        },
      ],
      hardwareSummary: 'Laptop & Entra account healthy · Phone manual time disabled accurate UTC sync.',
    },
    consoleActions: [
      {
        id: 'i6-sync-clock',
        label: 'Guide Automatic Network Time Sync on Phone (Fix TOTP Drift) & Verify Clean Sign-In',
        targetTab: 'directory',
        requiresChatId: 'i6-c1',
        effectSummary: 'User re-enabled Automatic Date & Time on phone, syncing UTC clock cleanly. Next 6-digit Authenticator code succeeded immediately (note: lost/dead phones would require strong ID check + Require Re-register MFA / Temporary Access Pass).',
        mutatesDirectory: {
          mfaStatus: 'Healthy (Authenticator TOTP synced)',
          activeSessions: 'Authenticated cleanly from Nairobi',
        },
      },
    ],
    expectedActionIds: ['i6-sync-clock'],
    expectedChatIds: ['i6-c1', 'i6-c2'],
    rootCauseOptions: [
      'Manual phone time settings skewed the device clock by ~4 minutes, invalidating 30-second time-based (`TOTP`) Authenticator codes against Entra ID UTC time.',
      'Microsoft stops Authenticator from working outside one city.',
      'Samira needs a new laptop motherboard.',
      'Print Spooler crashed on her laptop.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Complete strong caller verification first, instruct Samira to turn on Automatic Date & Time (network sync) on her phone so UTC TOTP windows align again, confirm login succeeds, and log the fix without weakening MFA policy.',
      'Disable MFA permanently for the PMO department.',
      'Reset Samira’s password ten times without checking clock sync.',
      'Issue a Temporary Access Pass to an unverified caller.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Why do 6-digit Authenticator codes break right after travel when a clock is set manually?',
      'Verify the caller strongly first (`i6-c1`), then check phone Automatic Date & Time (`i6-c2`).',
    ],
    howAndWhy:
      'HOW & WHY: Time-based One-Time Passwords (`TOTP`) hash a shared secret with the exact current UTC 30-second window. Even a 2–4 minute manual clock skew breaks every 6-digit code (`Error 500121`). Note too: if a phone is genuinely lost/wiped, NEVER lower MFA—verify identity strictly out-of-band, revoke old sessions/methods, and use Require Re-register MFA or a short-lived Temporary Access Pass.',
  },

  {
    id: 'sim-i7-profile',
    ticketNumber: 'INC-2089',
    priority: 'P3 Medium',
    skillLevel: 'intermediate',
    deskTier: 'tier-1',
    category: 'Windows & Apps · Profile & Disk',
    requesterName: 'Lucas Meyer',
    requesterRole: 'Data Analyst',
    department: 'Analytics',
    deviceHostname: 'ANA-WS-018',
    subject: 'My Desktop icons vanished and Windows says "You have been signed in with a temporary profile"',
    initialMessage:
      'I turned on my PC this morning, saw "We can’t sign into your account — signed in with a temporary profile", all my Desktop shortcuts are gone, and C: drive shows an angry red bar with 200 MB free!',
    slaTarget: '1h Response / 4h Resolve',
    chatOptions: [
      {
        id: 'i7-c1',
        question: 'Please DO NOT save any new important files onto this temporary Desktop—anything saved right now disappears when you sign out! Let’s check `C:\\Users` and disk free space first.',
        userReply:
          'Phew, glad you warned me right away! I haven’t saved new work onto the Desktop yet.',
        quality: 'helpful',
        feedbackNote: 'Crucial data-safety warning! Users frequently save hours of work into TEMP profiles only to lose it on reboot.',
        unlocksClue: 'User warned not to save inside temporary profile; C: drive nearly 100% full (200 MB free).',
      },
      {
        id: 'i7-c2',
        question: 'Did Windows updates run recently, and if another test account signs into this PC, does it load cleanly without the temporary profile error?',
        userReply:
          'A huge 24H2 feature update downloaded yesterday, and yes—my coworker’s test login on this same PC loaded in 5 seconds with zero errors!',
        quality: 'helpful',
        feedbackNote: 'Proved the fault is isolated to Lucas’s local profile / full C: drive rather than a broken OS!',
        unlocksClue: 'Test account loads normally—confirming isolated damaged/locked user profile + C: drive exhaustion.',
      },
      {
        id: 'i7-c3',
        question: 'Save your quarterly spreadsheets right onto the temporary Desktop and reboot.',
        userReply:
          'Wait—when I rebooted earlier, everything I saved during the temp session vanished!',
        quality: 'poor',
        feedbackNote: 'Everything stored inside `C:\\Users\\TEMP` is wiped upon sign-out!',
      },
    ],
    cliHintCommands: ['wmic logicaldisk get caption,freespace,size', 'dir C:\\Users'],
    cliResponses: [
      {
        match: ['logicaldisk', 'disk', 'free'],
        label: 'Check Drive Free Space',
        output: `Caption  FreeSpace (MB)   Size (GB)\nC:       198 MB (0.1%)    256 GB  <-- CRITICAL: Temp caches/ISOs filling C:\\Users\\lmeyer\\Downloads`,
        isKeyFinding: true,
      },
      {
        match: ['c:\\users', 'users', 'profile'],
        label: 'Inspect C:\\Users Profile Folders',
        output: `C:\\Users\\lmeyer        (98 GB in Downloads/Temp — NTUSER.DAT locked)\nC:\\Users\\TEMP           (Active temporary profile!)\nC:\\Users\\it_test_acct   (Loaded cleanly during test)`,
        isKeyFinding: true,
      },
    ],
    initialDirectory: {
      displayName: 'Lucas Meyer',
      upn: 'lmeyer@corp.local',
      department: 'Analytics',
      ou: 'OU=Analytics,OU=Users,DC=corp,DC=local',
      accountEnabled: true,
      lockedOut: false,
      badPwdCount: 0,
      passwordLastSet: '29 days ago',
      groups: ['Domain Users', 'SG_Analytics'],
      m365License: 'Microsoft 365 E3',
      mfaStatus: 'Enforced (Authenticator)',
      activeSessions: 'Normal',
      inboxRules: 'None',
      bitlockerKey: 'Escrowed in Entra ID',
    },
    initialDiagnostics: {
      hostOs: 'Windows 11 Pro (23H2)',
      uptime: '0 days, 1 hour',
      ipv4: '10.10.35.91',
      dnsServer: '10.10.0.50',
      services: [
        { name: 'ProfSvc (User Profile Service)', status: 'Warning', detail: 'Fallback to C:\\Users\\TEMP (Event ID 1511)' },
      ],
      eventLogs: [
        {
          time: '08:12 AM',
          source: 'User Profile Service',
          eventId: '1511',
          summary: 'Windows cannot find/load the local profile for lmeyer (`C:` critically low at 198 MB free) and logged user on with a temporary profile.',
        },
      ],
      hardwareSummary: '256 GB NVMe SSD at 99.9% capacity (68 GB old VM ISOs in Downloads) · Profile load blocked.',
    },
    consoleActions: [
      {
        id: 'i7-free-space-profile',
        label: 'Safely Back Up User Data, Clear Old Cache/ISOs to Free 65 GB & Repair/Recreate Local Profile',
        targetTab: 'diagnostics',
        requiresChatId: 'i7-c1',
        effectSummary: 'Archived/verified OneDrive & data outside C:\\Users\\lmeyer, freed 68 GB space (old temp/ISOs), repaired ProfileList / rebuilt clean profile, and confirmed Lucas’s real Desktop & OneDrive KFM restored cleanly!',
        mutatesDiagnostics: {
          services: [
            { name: 'ProfSvc (User Profile Service)', status: 'Running', detail: 'Real profile C:\\Users\\lmeyer loaded cleanly' },
          ],
          hardwareSummary: '68 GB free on C: · Real user profile restored with full OneDrive & Desktop files.',
        },
      },
    ],
    expectedActionIds: ['i7-free-space-profile'],
    expectedChatIds: ['i7-c1', 'i7-c2'],
    rootCauseOptions: [
      'Critical `C:` drive exhaustion (198 MB free) and a locked/corrupted `NTUSER.DAT` caused User Profile Service (`Event ID 1511`) to fall back to `C:\\Users\\TEMP`, while a test login confirmed the OS itself was healthy.',
      'OneDrive permanently deleted all Analytics user accounts.',
      'DHCP stopped assigning IPv4 addresses.',
      'BitLocker encrypted the monitor.',
    ],
    correctRootCauseIdx: 0,
    resolutionOptions: [
      'Warn the user immediately not to save files in the temporary profile, prove OS health via a second account sign-in, free disk space safely after backing up user data, and repair/recreate the damaged local profile (`Event ID 1511`) before re-verifying sign-in.',
      'Tell Lucas to keep working inside `C:\\Users\\TEMP` permanently.',
      'Reset Lucas’s Entra MFA token.',
      'Disable Windows Defender.',
    ],
    correctResolutionIdx: 0,
    hints: [
      'Warn Lucas immediately NOT to save files inside a TEMP profile, and compare his login against a test account!',
      'Check `C:` free space and `Event ID 1511` (`User Profile Service`) in Diagnostics/CLI.',
    ],
    howAndWhy:
      'HOW & WHY: A temporary profile sign-in means Windows failed to load `C:\\Users\\<user>\\NTUSER.DAT` (often triggered by zero free disk space or a mid-update crash). Warning the user NOT to save new files in `TEMP`, freeing space/preserving original `C:\\Users\\<user>` files first, and proving OS health with a second account avoids catastrophic data loss.',
  },
];
