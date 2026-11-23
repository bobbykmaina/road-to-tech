import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_CORE_B_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.core.net.endpoint-triage': {
    id: 'itsup.core.net.endpoint-triage',
    moduleId: 'it-support',
    unitTitle: 'Unit 4: Networking for Support Staff',
    topicTitle: '4.1 Endpoint Networking, Wi-Fi & VPN Diagnostics',
    code: '4.1.1',
    title: 'Fixing "The Internet Is Down" with ipconfig, ping, nslookup & VPN Routing Checks',
    readMinutes: 14,
    prerequisites: ['3.1.1 OS Diagnostics & Support CLI'],
    versionScope: 'shared',

    learningObjectives: [
      'Separate a dead physical/Wi-Fi link, a DHCP lease failure (`169.254.x.x`), a gateway outage, and a DNS name-lookup failure in under three minutes.',
      'Interpret key lines in `ipconfig /all` (IPv4 address, Subnet Mask, Default Gateway, DHCP Server, DNS Servers) and equivalent macOS/Linux checks.',
      'Run sequential `ping` tests (loopback `127.0.0.1` -> Default Gateway -> public IP `8.8.8.8` -> domain `nslookup`) to isolate the exact breaking hop.',
      'Diagnose common VPN split-tunneling faults where public websites work fine yet internal company apps fail—or vice versa.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why "The Internet Is Down" Means Five Completely Different Things to Help Desk',
      narrative:
        'A remote account executive calls saying *"Nothing works! The office internet and CRM are completely dead!"* Without structured endpoint checks, an agent either asks them to reboot three times blindly or escalates a simple DNS or VPN glitch straight to Network Engineering (who immediately bounces the ticket back). With four rapid command-line checks, you know within 90 seconds whether the laptop lost its automatic address (`169.254.x.x`), whether Wi-Fi dropped packets, whether DNS can’t translate names, or whether the VPN tunnel disconnected silently.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Driving a Delivery Van Out of Your Driveway to a Named Storefront',
      analogy:
        'To reach *"Acme Warehouse"* by van: (1) your van needs tires on the road (**physical/Wi-Fi link**), (2) the city has to assign you a valid license plate (**DHCP IP address**—otherwise you get stuck with an invalid temporary neighborhood sticker `169.254.x.x`), (3) you need an open neighborhood exit road (**Default Gateway**), and (4) you need a working GPS directory that converts the street name *"Acme Warehouse"* into GPS coordinates (**DNS**). Checking those four steps in order stops guessing immediately.',
      technicalDefinition:
        'Endpoint network troubleshooting walks bottom-up through physical/link association, **DHCP** (Dynamic Host Configuration Protocol) IP lease acquisition, **Default Gateway** Layer-3 reachability via **ICMP `ping`**, and **DNS** (Domain Name System) name resolution via `nslookup`—plus inspection of **VPN split-tunnel** routing when remote users access internal corporate subnets.',
      paragraphs: [
        'Watch out for **APIPA (`169.254.x.x`)**: Automatic Private IP Addressing is a Windows/macOS fallback address assigned when a computer broadcasts *"Can a DHCP server give me an IP?"* and hears silence. An endpoint holding `169.254.x.x` has zero Default Gateway and can talk to nobody beyond the local switch/subnet.',
        'Understand **Split Tunneling vs. Full Tunneling** on corporate **VPNs** (Virtual Private Networks—encrypted tunnels connecting remote laptops back to company networks): in **split tunnel** mode, only corporate internal traffic goes through the VPN while normal web browsing uses home Wi-Fi directly; in **full tunnel** mode, 100% of traffic rides through headquarters. If a remote user’s Google searches work on home Wi-Fi yet the internal HR portal times out, the VPN tunnel or internal DNS suffix—not their home ISP—is broken!',
      ],
    },

    deepDive: {
      intro:
        'Use this exact 4-step command ladder on every "no internet / can’t reach site" ticket before touching browser caches or escalating.',
      steps: [
        {
          step: 'Step 1',
          title: 'Inspect Adapter & Lease State (`ipconfig /all`)',
          explanation:
            'Look at the active adapter (Wi-Fi or Ethernet): Is Media State disconnected? Does IPv4 start with `169.254.` (DHCP failure)? Are Default Gateway and DNS Servers populated?',
        },
        {
          step: 'Step 2',
          title: 'Ping Gateway vs. External IP (`ping`)',
          explanation:
            'Ping the **Default Gateway** IP from `ipconfig`. If that fails, the fault is local Wi-Fi/cable/AP/switch. If Gateway replies, ping an external IP like `8.8.8.8` or `1.1.1.1` to confirm raw internet routing works.',
        },
        {
          step: 'Step 3',
          title: 'Test Name Resolution (`nslookup`)',
          explanation:
            'If `ping 8.8.8.8` works yet opening `portal.company.com` fails, run `nslookup portal.company.com`. Timeout or wrong IP points directly to **DNS**, not internet routing.',
        },
        {
          step: 'Step 4',
          title: 'Check Wi-Fi Signal / VPN Tunnel Routes',
          explanation:
            'Run `netsh wlan show interfaces` on Windows for weak Wi-Fi signal/channel drops, or inspect VPN client status and `route print` / `ipconfig /flushdns` for stale corporate DNS suffixes.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: '4-Step Endpoint Network Fault Isolation Ladder',
        asciiFallback: `[1] ipconfig /all
     |-- Media Disconnected? -----> Check cable / Wi-Fi toggle / airplane mode
     |-- 169.254.x.x (APIPA)? ----> DHCP failure! Try: ipconfig /release && /renew
     |-- Valid IP + Gateway? -----> Proceed to [2]
          v
[2] ping <Default Gateway>
     |-- Request Timed Out? ------> Local LAN / Wi-Fi / AP / Port fault
     |-- Replies OK? -------------> Proceed to [3]
          v
[3] ping 8.8.8.8  vs  nslookup company.com
     |-- 8.8.8.8 OK, nslookup fails? -> DNS failure! Check VPN DNS / flushdns
     |-- 8.8.8.8 fails internally? ---> Check ISP / Firewall / VPN Full Tunnel`,
      },
      workedExample: {
        title: 'Worked Ticket: Remote User Can Open YouTube Yet Internal Intranet Fails',
        context:
          'Sales rep working from a hotel says "The company intranet is down!" Yet they are actively chatting with you on cloud video/chat.',
        steps: [
          'Notice clue #1 immediately: they are talking to you online—meaning home/hotel Wi-Fi and public internet work.',
          'Ask them to run `ipconfig /all` and check the corporate VPN client icon. Output shows Wi-Fi IP `192.168.12.44`, VPN adapter disconnected ("Reconnecting..."), and `nslookup intranet.corp.local` resolves to `Non-existent domain` using the hotel router’s DNS.',
          'Guide user to sign back into the VPN client (completing MFA prompt that timed out silently behind another window).',
          'Re-run `ipconfig /all` (corporate VPN tunnel IP `10.90.4.18` and corporate DNS `10.10.0.53` appear) and test `intranet.corp.local` -> loads cleanly.',
        ],
        outcome:
          'Resolved in 4 minutes without falsely escalating an "intranet server outage" ticket.',
      },
    },

    supportWalkthrough: {
      intro:
        'Follow this crisp live triage checklist before logging an escalation.',
      steps: [
        {
          phase: 'Check Scope',
          action: 'Ask whether other devices on the same Wi-Fi/floor work and whether external websites open.',
          whyItWorks: 'Instantly separates single-laptop faults from building-wide outages or VPN issues.',
        },
        {
          phase: 'Capture `ipconfig /all`',
          action: 'Record IPv4, Subnet Mask, Gateway, and DNS servers inside Internal Notes before running `/renew` or `/flushdns`.',
          whyItWorks: 'Proves root cause (e.g., APIPA vs stale DNS) rather than wiping evidence.',
        },
        {
          phase: 'Verify Split/Full VPN',
          action: 'Confirm VPN client connection state and whether internal DNS suffixes resolve over the tunnel.',
          whyItWorks: 'Most remote "site down" tickets are unauthenticated VPN or local captive-portal Wi-Fi blocks.',
        },
      ],
      questionsToAsk: [
        '"Are you currently working from the office, home Wi-Fi, or a hotel/public hotspot?"',
        '"Can you open a public news site in your browser, or are only internal company pages failing?"',
        '"Does your VPN icon in the system tray show Connected, Connecting, or Disconnected?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a `169.254.x.x` DHCP refresh plainly',
          sayThis:
            '"Your laptop didn’t pick up an automatic network address when waking up from sleep, so it stayed on a temporary placeholder address. Let’s refresh your Wi-Fi connection so it requests a fresh office address."',
        },
        {
          situation: 'Explaining VPN vs public internet cleanly',
          sayThis:
            '"Your home internet is working great—what timed out was the secure company tunnel that reaches internal pages. Let’s reconnect your VPN sign-in and refresh your page."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Networking -> Remote VPN / DNS Resolution',
        priorityFormula: 'Impact: Low (1 remote user) × Urgency: Medium (Internal intranet blocked) = P3 Normal',
        internalNotes: `[SYMPTOM] User reported internal intranet.corp.local unreachable from hotel Wi-Fi while public internet worked.
[CHECKS] ipconfig /all confirmed Wi-Fi IP 192.168.12.44 OK; VPN tunnel adapter disconnected. nslookup intranet.corp.local hit external hotel DNS (NXDOMAIN).
[ACTION] Guided user to re-authenticate VPN client + approve MFA push; ran ipconfig /flushdns; verified corporate DNS 10.10.0.53 active and intranet.corp.local loaded cleanly.`,
        customerReply:
          'Hi Jordan — Glad we got the company intranet loading again! Your hotel Wi-Fi was working fine, but the secure company VPN tunnel had signed out silently and needed a fresh login confirmation. Reach back out anytime if you see that prompt again.',
        escalationCriteria:
          'Escalate to NetOps with `ipconfig /all`, `tracert`, and VPN client logs if corporate tunnel connects cleanly yet internal subnets drop packets.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming `ping 8.8.8.8` working means "everything is fine with the user’s network."',
        reality: 'If `ping 8.8.8.8` works yet `nslookup company.com` fails, **DNS is broken**—users cannot reach any site by name.',
      },
      {
        trap: 'Ignoring `169.254.x.x` and clearing browser cookies for 15 minutes.',
        reality: 'Any address starting with `169.254.` means **DHCP failed** completely; no website or server will load until a real IP lease is obtained.',
      },
      {
        trap: 'Telling a remote user to unplug their home router before checking whether only VPN-protected sites are failing.',
        reality: 'If public sites open fast and only internal company tools fail, check the **VPN connection and DNS** first.',
      },
    ],

    keyTerms: [
      {
        term: 'APIPA (169.254.x.x)',
        shortDef: 'Automatic Private IP Addressing fallback assigned when DHCP fails to respond.',
        fullDef: 'Signals an endpoint failed to lease a real IP/gateway/DNS configuration from a DHCP server.',
      },
      {
        term: 'Default Gateway',
        shortDef: 'The router IP address that forwards traffic leaving the local network.',
        fullDef: 'First hop checked with `ping` during endpoint isolation after confirming a valid non-APIPA IP.',
      },
      {
        term: 'DNS (Domain Name System)',
        shortDef: 'Internet phonebook translating human hostnames like `portal.company.com` into IP addresses.',
        fullDef: 'Tested cleanly using `nslookup` whenever raw IP pings succeed yet named URLs fail.',
      },
      {
        term: 'VPN Split Tunneling',
        shortDef: 'Routing only corporate internal traffic through the VPN while public web traffic exits directly.',
        fullDef: 'Explains why external websites can work normally while internal company apps stall when VPN drops.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-411-q1',
        prompt: 'You run `ipconfig /all` on a user’s Windows laptop after they report "no internet on office Ethernet." It shows `IPv4 Address: 169.254.42.19`, `Subnet Mask: 255.255.0.0`, and **Default Gateway is blank**. What does this prove?',
        options: [
          'The laptop failed to obtain an IP lease from a DHCP server (APIPA fallback).',
          'DNS translated the wrong website name.',
          'The user entered the wrong Outlook password.',
          'The monitor cable is loose.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `169.254.x.x` with no Default Gateway is textbook APIPA from an unanswered DHCP request.',
          'Incorrect: DNS cannot even run without a valid routable IP and DNS server assignment.',
          'Incorrect: Application passwords do not assign IPv4 leases.',
          'Incorrect: Physical video cables do not alter Windows IP stack leases.',
        ],
        takeaway: 'Seeing `169.254.x.x` immediately pinpoints a DHCP lease failure or blocked switch port.',
      },
      {
        id: 'itsup-411-q2',
        prompt: 'A user says "Nothing opens in Edge or Chrome." You run `ping 8.8.8.8` and receive 4 clean replies, but `nslookup portal.acme.com` times out. Where is the fault?',
        options: [
          'DNS name resolution is failing even though raw IP routing works.',
          'The Ethernet cable is unplugged.',
          'The CPU overheated.',
          'APIPA `169.254.x.x` is active.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Successful ICMP echo to `8.8.8.8` proves Layer-3 connectivity works; failing `nslookup` isolates the break to DNS.',
          'Incorrect: An unplugged cable would fail `ping 8.8.8.8` immediately.',
          'Incorrect: Thermal issues do not selectively break DNS queries while passing ICMP.',
          'Incorrect: APIPA addresses cannot route packets out to `8.8.8.8`.',
        ],
        takeaway: 'When `ping <IP>` succeeds and `nslookup <hostname>` fails, investigate DNS servers or VPN DNS suffix routing.',
      },
      {
        id: 'itsup-411-q3',
        prompt: 'A remote worker using a split-tunnel VPN reports they can watch YouTube and join external video calls fine, yet `\\\\fileserver01\\finance` and `intranet.internal` fail to load. What should you check first?',
        options: [
          'Whether the corporate VPN client disconnected or timed out on MFA, and whether internal DNS servers appear in `ipconfig /all`.',
          'Whether their monitor refresh rate is 60 Hz.',
          'Ask them to buy a new home Wi-Fi router.',
          'Reformat their hard drive.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Public internet works over home ISP in split-tunnel mode, so disconnected VPN/corporate DNS is the primary suspect.',
          'Incorrect: Monitor settings do not block SMB shares or internal DNS.',
          'Incorrect: Home ISP routing is visibly working for external sites.',
          'Incorrect: Never wipe a device over a simple VPN/DNS check.',
        ],
        takeaway: 'External access OK + internal company resources failing = verify VPN tunnel state and internal DNS first.',
      },
      {
        id: 'itsup-411-q4',
        prompt: 'Which sequence tests endpoint connectivity in logical isolation order (closest to farthest)?',
        options: [
          '`ipconfig /all` -> `ping <Default Gateway>` -> `ping 8.8.8.8` -> `nslookup <hostname>`',
          'Reinstall Windows -> `nslookup` -> `ping 127.0.0.1` -> check power cord',
          'Escalate to NetOps -> open ticket -> delete Outlook profile',
          'Flush DNS -> replace motherboard -> ping gateway',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Verifies local lease first, then local hop (gateway), then internet IP routing, then DNS name lookup.',
          'Incorrect: Out of order and wildly destructive.',
          'Incorrect: Escalating without gathering basic `ipconfig`/`ping`/`nslookup` evidence violates L1 triage.',
          'Incorrect: Hardware replacement before basic network checks wastes time.',
        ],
        takeaway: 'Lease (`ipconfig`) -> Gateway (`ping`) -> External IP (`ping 8.8.8.8`) -> Name (`nslookup`).',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Run Endpoint Network Triage in the Simulator',
      targetTab: 'simulator',
      instructions: [
        'Open the Help Desk Simulator and tackle a networking or VPN connectivity ticket.',
        'Document the exact `ipconfig /all`, `ping`, and `nslookup` results in Internal Notes before sending your plain-English Customer Reply.',
      ],
      verificationCheck: 'Internal Notes pinpoint whether DHCP, Gateway, DNS, or VPN failed rather than guessing "internet broken."',
    },

    summaryBullets: [
      'Run `ipconfig /all`, `ping <Gateway>`, `ping 8.8.8.8`, and `nslookup` in order to pinpoint where traffic breaks.',
      'An IPv4 address in `169.254.x.x` (APIPA) means DHCP failed—not a DNS or browser bug.',
      'Raw IP `ping 8.8.8.8` working while `nslookup` fails isolates the issue strictly to **DNS**.',
      'On remote **split-tunnel VPNs**, public websites working while internal tools fail usually points to a dropped VPN tunnel or missing internal DNS.',
      'Always log diagnostic command outputs inside Internal Notes before renewing leases or escalating to NetOps.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Windows Networking Commands (ipconfig, ping, nslookup, tracert, route)',
      'CompTIA A+ Core 1 & Core 2 — Network Troubleshooting Methodology',
    ],
  },

  'itsup.core.iam.ad-entra-gpo': {
    id: 'itsup.core.iam.ad-entra-gpo',
    moduleId: 'it-support',
    unitTitle: 'Unit 5: Identity and Access',
    topicTitle: '5.1 Directory Accounts, Lockouts, GPOs & User Lifecycle',
    code: '5.1.1',
    title: 'Active Directory Lockouts (Event 4740), Entra ID MFA, Group Policy & Offboarding',
    readMinutes: 15,
    prerequisites: ['3.1.1 OS Diagnostics & Support CLI', '4.1.1 Endpoint Networking & VPN Triage'],
    versionScope: 'shared',

    learningObjectives: [
      'Define **Active Directory (AD)** (on-premises domain directory for computers, users, and security groups) and **Microsoft Entra ID** (cloud identity & SSO directory, formerly Azure AD) cleanly from zero.',
      'Explain why unlocking an AD account without clearing cached stale passwords (on phones, Credential Manager, or mapped drives) triggers repeated lockouts—and how **Event ID 4740** identifies the exact Caller Computer Name.',
      'Reset or re-register **MFA** (Multi-Factor Authentication) safely after verifying caller identity out-of-band.',
      'Verify **Group Policy** (`gpupdate /force`, `gpresult /r`) and execute disciplined **Onboarding & Offboarding** security checklists.',
    ],

    whyThisMatters: {
      scenarioTitle: 'The "Ghost Lockout" That Locks a VP Out Every 4 Minutes After Every Password Change',
      narrative:
        'At 8:05 AM, a VP changes their Windows password—and by 8:10 AM they’re locked out again! An inexperienced agent simply clicks "Unlock account" and closes the ticket. Five minutes later, the VP calls back angrier because they’re locked out *again*! Why? Their work iPhone, an old mapped drive, or Windows Credential Manager keeps retrying the **old password** silently until the bad-password threshold triggers another lockout. Knowing how to read **Event ID 4740** and check **Entra ID Sign-in logs** fixes the root cause permanently on the first call.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Company Badge Office (AD) Plus a Cloud Keycard App (Entra ID)',
      analogy:
        '**Active Directory (AD)** is the traditional in-building security office that keeps track of every employee badge, office desktop PC, shared folder permission group, and building rule (**Group Policy / GPO**). **Microsoft Entra ID** is the modern cloud equivalent that issues digital keycards (**SSO / MFA tokens**) so that same employee can sign into cloud email, chat, and HR apps from anywhere. When someone forgets their new badge code and their phone wallet still auto-taps the old code 5 times in a row, the security door locks the whole badge (**Account Lockout**).',
      technicalDefinition:
        '**Active Directory Domain Services (AD DS)** provides centralized Kerberos/LDAP authentication, **OU** (Organizational Unit) hierarchy, security groups, and **Group Policy Objects (GPOs)** for Windows endpoints, while **Microsoft Entra ID** manages cloud identity, **Conditional Access**, **MFA**, and hybrid synchronization. **Event ID 4740** on Domain Controllers logs account lockouts alongside the **Caller Computer Name** source.',
      paragraphs: [
        '**Group Policy Objects (GPOs)** let admins push standardized settings (password complexity, screen-lock timers, mapped network drives, browser policies) automatically across hundreds of AD-joined PCs. On a laptop, `gpupdate /force` refreshes policies immediately while `gpresult /r` shows which GPOs actually applied.',
        '**Onboarding & Offboarding Are Audit Events, Not Casual Favors**: When an employee leaves (offboarding), missing one step—like disabling AD yet forgetting to **revoke active cloud sessions**, remove forwarding rules, or disable VPN access—creates a major security breach. Never act on an offboarding or MFA-reset request without formal manager/HR ticket authorization and caller identity checks.',
      ],
    },

    deepDive: {
      intro:
        'Walk step-by-step through recurring account lockouts, MFA lockouts, Group Policy checks, and lifecycle checklists.',
      steps: [
        {
          step: '1. Verify Caller First',
          title: 'Identity Check Before Any Reset',
          explanation:
            'Never read temporary passwords or reset MFA without out-of-band verification (callback to HR-listed phone, supervisor approval, or live video badge check). Attackers routinely social-engineer help desks into resetting MFA!',
        },
        {
          step: '2. Trace Event ID 4740',
          title: 'Find the Device Causing Repeated AD Lockouts',
          explanation:
            'Inspect Security Logs on the PDC Emulator Domain Controller for **Event ID 4740** ("A user account was locked out"). Read the **Caller Computer Name** field—it points straight to the rogue workstation, terminal server, or Exchange sync phone retrying old credentials.',
        },
        {
          step: '3. Purge Cached Stale Credentials',
          title: 'Clean Credential Manager, Wi-Fi & Mobile Mail',
          explanation:
            'After unlocking in AD Users & Computers (ADUC), remove stale saved passwords in **Windows Credential Manager**, disconnect/re-authenticate corporate Wi-Fi (`802.1X`), update saved phone mail passwords, and check Entra ID Sign-in logs for failed legacy-auth probes.',
        },
        {
          step: '4. GPO & Lifecycle Hygiene',
          title: 'Apply Policies (`gpresult`) & Complete Offboarding',
          explanation:
            'For missing mapped drives or desktop settings, run `gpupdate /force` and `gpresult /r`. For departures: disable AD/Entra sign-in -> **revoke active refresh tokens/sessions** -> convert mailbox / forward per HR -> reclaim hardware.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Tracing a Recurring Account Lockout (Event ID 4740) to Its Source',
        asciiFallback: `[User changes password @ 8:05 AM]
       |
       +--> Phone email / Old RDP / Saved Credential Manager retries OLD password 5x
               |
               v
     [Domain Controller locks account] ---> Logs Event ID 4740
                                            Caller Computer Name: SALES-PC-04
                                            (or MobileSync / Radius server)
               |
               v
     [Help Desk Check] -> Unlock account + clear stale credentials on Caller Computer`,
      },
      workedExample: {
        title: 'Worked Case: Stopping a Repeating Lockout Loop for a Travelling Manager',
        context:
          'User says "Support unlocked me twice already this morning and 3 minutes later I’m locked out again!"',
        steps: [
          'Verify identity via registered mobile callback.',
          'Check Domain Controller Security Log for **Event ID 4740**; `Caller Computer Name` reads `SRV-RDS-02` (Remote Desktop server where the user left a minimized session open yesterday before changing their password!).',
          'Sign off the disconnected orphaned session on `SRV-RDS-02`, clear saved entries in local **Windows Credential Manager**, and then unlock the AD account.',
          'Have user lock/unlock laptop once and confirm 15 minutes pass with zero bad-password count increments.',
        ],
        outcome:
          'Eliminates the hidden cached-credential loop instead of playing whack-a-mole with the Unlock checkbox.',
      },
    },

    supportWalkthrough: {
      intro:
        'Use these safe verification, lockout-hunting, and offboarding routines every day.',
      steps: [
        {
          phase: 'Identity Proof',
          action: 'Verify caller out-of-band before unlocking, changing passwords, or resetting MFA methods.',
          whyItWorks: 'Prevents attacker account takeover disguised as an urgent lockout call.',
        },
        {
          phase: 'Root-Cause Lockouts',
          action: 'Check Event ID 4740 (AD) and Entra ID Sign-in Logs whenever a user locks out more than once.',
          whyItWorks: 'Identifies stale phones, orphaned RDP sessions, scheduled tasks, or external brute-force sprays.',
        },
        {
          phase: 'Clean Offboarding',
          action: 'Follow exact order: disable account -> revoke active sessions -> remove MFA devices -> remove group/license per HR -> log every action.',
          whyItWorks: 'Disabling an account alone can leave active cloud browser tokens alive up to an hour unless revoked.',
        },
      ],
      questionsToAsk: [
        '"Did you recently change your password on any device, phone, or tablet in the last 24 hours?"',
        '"Are you signed into any virtual desktop, shared terminal, or secondary office PC?"',
        '"Which MFA method do you currently see prompted—Authenticator app push, SMS, or hardware key?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining why a caller must verify identity before an MFA reset',
          sayThis:
            '"To protect your account against unauthorized logins, our security policy requires me to confirm a quick callback to your registered phone / manager check before resetting MFA. It takes just one minute!"',
        },
        {
          situation: 'Explaining a repeating lockout simply',
          sayThis:
            '"Your account wasn’t hacked—an older session saved on the remote server was still automatically trying yesterday’s password! We closed that stale session and unlocked your account, so you’re good to go cleanly."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Identity & Access -> Account Lockout / Cached Credentials',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High (User completely blocked from sign-in) = P2 High',
        internalNotes: `[VERIFICATION] Confirmed caller identity via HR-registered phone callback.
[CHECKS] ADUC confirmed account locked. DC Security Log Event ID 4740 showed Caller Computer Name: SRV-RDS-02 (stale disconnected RDP session).
[ACTION] Logged off orphaned session on SRV-RDS-02, cleared stale saved Windows Credential Manager entries on user laptop, unlocked AD account, verified clean sign-in & zero new badPwdCount increments.`,
        customerReply:
          'Hi Elena — Your account is unlocked and should stay unlocked! A disconnected remote session from yesterday was automatically retrying your previous password in the background. We cleared that session out so your new password works cleanly across all apps.',
        escalationCriteria:
          'Escalate immediately to InfoSec / Tier 2 Identity if Event ID 4740 or Entra Sign-in logs reveal repeated bad-password bursts from unfamiliar foreign IPs (password spray attack).',
      },
    },

    commonTraps: [
      {
        trap: 'Clicking "Unlock Account" over and over without hunting down what is retrying the old password.',
        reality: 'Repeated lockouts within minutes almost always point to cached credentials (phone email, mapped drive, Credential Manager, or orphaned RDP)—check **Event ID 4740**.',
      },
      {
        trap: 'Accepting a panicked Slack DM from an unknown number or unverified caller to "reset my MFA right now."',
        reality: 'Bypassing out-of-band identity verification is the #1 way attackers breach corporate accounts via the Help Desk.',
      },
      {
        trap: 'Assuming disabling an AD user instantly logs them out of every open browser tab in Microsoft 365.',
        reality: 'Always click **Revoke active sessions / refresh tokens** in Entra ID alongside disabling the account.',
      },
    ],

    keyTerms: [
      {
        term: 'Active Directory (AD)',
        shortDef: 'On-premises Microsoft directory storing domain users, computers, security groups, and Group Policies.',
        fullDef: 'Authenticates domain-joined Windows devices via Kerberos/LDAP and manages centralized computer/user controls.',
      },
      {
        term: 'Microsoft Entra ID',
        shortDef: 'Microsoft’s cloud identity directory (formerly Azure AD) governing SaaS SSO, Conditional Access, and MFA.',
        fullDef: 'Works standalone or synced with on-premises AD to authenticate cloud apps like Microsoft 365.',
      },
      {
        term: 'Event ID 4740',
        shortDef: 'Windows Security log event recorded on a Domain Controller whenever a user account locks out.',
        fullDef: 'Crucial because its "Caller Computer Name" field names the machine submitting bad passwords.',
      },
      {
        term: 'Group Policy Object (GPO)',
        shortDef: 'Centralized configuration profile pushed by Active Directory to domain users and computers.',
        fullDef: 'Refreshed manually via `gpupdate /force` and audited via `gpresult /r`.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-511-q1',
        prompt: 'A user changed their password at 9:00 AM and keeps getting locked out every 5 minutes despite being unlocked twice. Which Domain Controller Security Event ID identifies the computer name sending the bad passwords?',
        options: [
          'Event ID 4740',
          'Event ID 1000',
          'Event ID 404',
          'Event ID 8021',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Event ID 4740 records AD account lockouts and shows the Caller Computer Name triggering them.',
          'Incorrect: Event 1000 is typically an Application Crash error on a client workstation.',
          'Incorrect: 404 is an HTTP Not Found web status code, not an AD lockout event.',
          'Incorrect: Not the Windows Security lockout event.',
        ],
        takeaway: 'Use Event ID 4740 (Caller Computer Name) to hunt down ghost lockout sources fast.',
      },
      {
        id: 'itsup-511-q2',
        prompt: 'A caller claims to be a travelling executive who broke their phone and demands you reset their MFA right now so they can join a board meeting. What MUST you do first?',
        options: [
          'Perform strict out-of-band identity verification (e.g., callback to HR-listed phone or manager verification) per company policy before touching MFA.',
          'Immediately disable MFA for 48 hours to avoid delaying them.',
          'Read them a Temporary Access Pass over an unverified call.',
          'Ask them to verify their own date of birth only without checking an authoritative callback.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: High-pressure "travelling executive broken phone" urgency is a classic social engineering pretext for MFA takeover.',
          'Incorrect: Disabling MFA removes core security protection.',
          'Incorrect: Handing out bypass codes without verified out-of-band proof compromises the account.',
          'Incorrect: Personal trivia can be scraped online; follow strict company out-of-band verification.',
        ],
        takeaway: 'Never bypass out-of-band identity verification for MFA resets—especially under urgent executive pressure.',
      },
      {
        id: 'itsup-511-q3',
        prompt: 'An admin just added a new shared printer policy via Group Policy, and a user at their desk hasn’t received it yet. Which command forces an immediate policy refresh on Windows?',
        options: [
          '`gpupdate /force` (followed by `gpresult /r` to verify applied GPOs)',
          '`ipconfig /flushdns`',
          '`nslookup /gpo`',
          '`sfc /scannow`',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `gpupdate /force` reapplies all user/computer Group Policies, and `gpresult /r` shows what applied.',
          'Incorrect: `ipconfig /flushdns` clears DNS cache only.',
          'Incorrect: Invalid `nslookup` flag.',
          'Incorrect: `sfc /scannow` repairs corrupt Windows OS files, not Group Policy.',
        ],
        takeaway: '`gpupdate /force` refreshes Group Policy; `gpresult /r` verifies which GPOs won.',
      },
      {
        id: 'itsup-511-q4',
        prompt: 'During an urgent employee offboarding, why is clicking "Block sign-in / Disable AD account" alone NOT enough?',
        options: [
          'Existing cloud browser/OAuth refresh tokens can stay active unless you explicitly revoke user sessions in Entra ID.',
          'AD automatically emails the terminated user a spare password.',
          'Disabling an account deletes every email in the company.',
          'Windows Defender turns off automatically.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Revoking active Entra ID/cloud sessions forces immediate sign-out everywhere instead of waiting for token expiry.',
          'Incorrect: AD does not send spare passwords on disable.',
          'Incorrect: Disabling preserves mailbox data until archived/deleted separately.',
          'Incorrect: Defender stays active regardless of user account status.',
        ],
        takeaway: 'Offboarding checklist: Disable account + Revoke active sessions/tokens + Audit forwarding/delegates + Reclaim hardware.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Solve Identity & Lockout Tickets in the Simulator',
      targetTab: 'simulator',
      instructions: [
        'Launch a Tier 1 or Tier 2 identity/lockout ticket inside the Simulator.',
        'Verify identity before acting, check for stale cached sessions, and log clean audit notes in Internal Notes.',
      ],
      verificationCheck: 'Ticket notes record identity verification, Event/sign-in log findings, and root-cause remediation.',
    },

    summaryBullets: [
      '**Active Directory (AD)** manages on-prem users, computers, groups, and **GPOs**; **Microsoft Entra ID** manages cloud SSO, MFA, and Conditional Access.',
      'Repeated lockouts stem from cached old passwords—trace **Event ID 4740** (Caller Computer Name) and clear Credential Manager/stale sessions.',
      'Always enforce strict out-of-band identity verification before resetting passwords or MFA methods.',
      'Use `gpupdate /force` to refresh Group Policy and `gpresult /r` to verify which GPOs applied.',
      'Effective offboarding requires disabling the account **plus** revoking active cloud tokens/sessions immediately.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Windows Security Auditing Event ID 4740 & Microsoft Entra ID Sign-in Logs',
      'Microsoft Learn — Active Directory Users, Groups, and Group Policy Fundamentals (gpupdate / gpresult)',
    ],
  },

  'itsup.core.cloud.m365-admin': {
    id: 'itsup.core.cloud.m365-admin',
    moduleId: 'it-support',
    unitTitle: 'Unit 6: Microsoft 365 and Cloud Administration',
    topicTitle: '6.1 M365 Collaboration, Licensing & Endpoint MDM',
    code: '6.1.1',
    title: 'Outlook Auth Loops, Shared Mailboxes, Licensing, OneDrive & Intune/Workspace Overview',
    readMinutes: 14,
    prerequisites: ['5.1.1 Active Directory, Entra ID & GPO'],
    versionScope: 'shared',

    learningObjectives: [
      'Diagnose and resolve common **Microsoft 365 (M365)** collaboration faults: Outlook endless password prompts, Teams audio/cache issues, and OneDrive sync pauses.',
      'Distinguish **User Mailboxes** (require a paid Exchange license) from **Shared Mailboxes** (`support@`, `billing@` — up to 50 GB without needing their own license) and Distribution Lists vs M365 Groups.',
      'Inspect licensing SKUs in the **Microsoft 365 Admin Center** when newly hired employees cannot sign into Outlook or Teams.',
      'Explain the core role of **Microsoft Intune (MDM)** for laptop compliance/app pushes and recognize parallel **Google Workspace** Admin concepts (Gmail, Drive, Workspace licensing).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why "New Hire Has No Email!" and "Outlook Keeps Popping Up a Login Box" Dominate Daily Queues',
      narrative:
        'Roughly 30–40% of real corporate L1 tickets live inside cloud productivity suites—especially **Microsoft 365** (and **Google Workspace** in cloud-native startups). Knowing within seconds whether an email failure is caused by a missing Exchange Online license SKU, an Outlook modern-authentication token loop in Credential Manager, a full OneDrive sync cache, or an unapproved Intune compliance device turns 45-minute guesswork into confident 5-minute resolutions.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an Apartment Building Key (License), Shared Lobby Mailbox, and Cloud Locker (OneDrive)',
      analogy:
        'Even if a new tenant has a building ID badge (**Entra ID account**), they still cannot unlock Apartment 4B (**Outlook/Teams**) unless management activated their Apartment Key (**M365 License SKU**). A **Shared Mailbox** like `invoices@company.com` is a shared lobby drop-box that licensed staff members can open together without paying for an extra tenant seat. Meanwhile, **Microsoft Intune** acts like the building inspector verifying every tenant’s laptop has working locks (encryption + antivirus) before granting full access.',
      technicalDefinition:
        '**Microsoft 365 Administration** spans user license assignment (Exchange Online, Teams, Office Desktop Apps), mail routing (User vs. Shared Mailboxes, Distribution Lists, Message Trace), **OneDrive** client sync remediation, and **Microsoft Intune** Mobile Device Management (**MDM**) compliance checks. Comparable suites such as **Google Workspace** mirror this pattern via Admin Console, Organizational Units, Workspace licenses, Shared Drives, and Chrome/Endpoint policies.',
      paragraphs: [
        '**Watch Out for the Top M365 "Gotcha": Missing License = No Mailbox!** Creating a user in Active Directory or Entra ID gives them a username—it does NOT automatically provision an Exchange Online mailbox until a paid **M365 Business/Enterprise license** (such as Business Premium or E3) is assigned and propagates.',
        '**Google Workspace Parity**: If an employer uses Google Workspace instead of M365, the exact same troubleshooting pattern applies with different labels: Google Workspace Admin Console -> check License assignment, Groups (`support@` Collaborative Inbox vs Distribution), Gmail Routing/Logs, Google Drive desktop cache, and Context-Aware Access/Endpoint Verification.',
      ],
    },

    deepDive: {
      intro:
        'Master the four everyday M365/Cloud triage workflows you will run constantly on the desk.',
      steps: [
        {
          step: '1. Licensing Check',
          title: 'M365 Admin Center -> Active Users -> Licenses & Apps',
          explanation:
            'Whenever a new user gets *"Something went wrong / No mailbox found"* in Outlook or Teams, check Licenses first. Ensure the right SKU (including Exchange Online & Teams sub-toggles) is checked and saved (allow 5–15 minutes for initial mailbox provisioning).',
        },
        {
          step: '2. Outlook Auth Loops',
          title: 'Clearing Broken Tokens Instead of Reinstalling Office',
          explanation:
            'If Outlook keeps demanding a password endlessly without accepting the correct one: sign out of Office account -> clear `MicrosoftOffice` / `ADAL` entries in Windows Credential Manager -> clear OneAuth/Identity cache or rebuild the Outlook Mail Profile (`.ost` resyncs safely from Exchange Online).',
        },
        {
          step: '3. Shared Mailboxes & Traces',
          title: 'Delegates vs Distribution Lists & Message Trace',
          explanation:
            'Use **Shared Mailboxes** when teams need shared Sent/Inbox tracking (`helpdesk@`); use **Distribution Lists** for pure broadcast aliases. Use **Exchange Admin Center -> Message Trace** to prove whether a "missing email" was delivered, quarantined as spam, or blocked.',
        },
        {
          step: '4. OneDrive & Intune Compliance',
          title: 'Sync Health (`onedrive.exe /reset`) & MDM Sync',
          explanation:
            'Stuck OneDrive red X icons often resolve by pausing/resuming sync, checking illegal file characters/path lengths, or running `onedrive.exe /reset`. If Conditional Access blocks work apps, open **Company Portal -> Sync** to refresh **Microsoft Intune** compliance (BitLocker, Defender, OS version).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Microsoft 365 & Endpoint MDM Triage Flow',
        asciiFallback: `[User reports Cloud App fault]
  |-- "No mailbox / Teams missing" -----> Check M365 Admin License SKU + provisioning wait
  |-- "Outlook loops password prompt" --> Clear Credential Mgr tokens / rebuild Outlook profile
  |-- "Never received client email" ----> Run Exchange Message Trace (Delivered / Quarantine / Failed?)
  |-- "OneDrive won't sync red X" ------> Check quota / filename / run: %localappdata%\\..\\onedrive.exe /reset
  |-- "Blocked: Device not compliant" --> Check Intune Company Portal (Encryption/OS) & trigger Sync`,
      },
      workedExample: {
        title: 'Worked Ticket: "My Shared Billing Mailbox Vanished & Client Says We Never Got Their Invoice"',
        context:
          'Finance coordinator reports `billing@company.com` stopped appearing in Outlook and an important vendor claims they emailed an invoice at 9:15 AM.',
        steps: [
          'Check Exchange Admin Center -> Shared Mailboxes -> `billing@company.com` -> confirm Finance user still has **Full Access + Send As** permissions (recently re-added after group cleanup).',
          'Check **Message Trace** for `vendor@supplier.com` -> `billing@company.com`: Trace reveals email arrived at 9:16 AM and was **Quarantined (High Confidence Phish)** due to a mismatched sender SPF record.',
          'Escalate quarantine release review cleanly per Security policy instead of telling the vendor to resend 5 times, and wait 15 minutes for Outlook Automapping (or add the shared mailbox manually in Account Settings -> More Settings -> Advanced).',
        ],
        outcome:
          'Proved exact mail flow via Message Trace in 3 minutes and restored shared mailbox visibility cleanly.',
      },
    },

    supportWalkthrough: {
      intro:
        'Follow these quick cloud admin habits to solve M365 & Workspace tickets without guesswork.',
      steps: [
        {
          phase: 'Check Health & License First',
          action: 'Scan M365 Service Health dashboard (to catch global Microsoft outages) and user license SKUs before touching the laptop.',
          whyItWorks: 'Prevents spending 40 minutes troubleshooting a local PC during a regional Exchange Online incident.',
        },
        {
          phase: 'Use Message Trace',
          action: 'Run Message Trace in Exchange Admin Center (or Email Log Search in Google Workspace) for any "missing email" ticket.',
          whyItWorks: 'Gives definitive timestamps: Received, Delivered, Quarantined, or Dropped—zero speculation.',
        },
        {
          phase: 'Never Delete Only Copy Data',
          action: 'Before rebuilding an Outlook profile or resetting OneDrive, confirm user mail/files are synced in webmail (`outlook.office.com`) or OneDrive web.',
          whyItWorks: 'Webmail is the source of truth; `.ost` files simply cache cloud data locally.',
        },
      ],
      questionsToAsk: [
        '"If you sign into webmail (`outlook.office.com` or `mail.google.com`) in a browser, do you see the emails there?"',
        '"Is this affecting only your desktop Outlook app, or also your mobile mail app?"',
        '"For the missing email, what is the exact sender address and approximate time it was sent?"',
      ],
      sampleUserWording: [
        {
          situation: 'Directing user to webmail as instant workaround during Outlook fix',
          sayThis:
            '"Your actual emails are completely safe in the cloud! While I refresh your desktop Outlook profile over the next 5 minutes, you can read and reply to everything right away at `outlook.office.com`."',
        },
        {
          situation: 'Explaining an Intune compliance block calmly',
          sayThis:
            '"Our security system paused Outlook briefly because your laptop hadn’t checked in after yesterday’s Windows update. Let’s tap Sync in Company Portal so it confirms everything is healthy and unlocks access."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Cloud Productivity -> Exchange Online / Shared Mailbox & Trace',
        priorityFormula: 'Impact: Medium (Shared Finance mailbox missing email) × Urgency: Medium = P3 Normal',
        internalNotes: `[SYMPTOM] Finance user missing billing@company.com in desktop Outlook and missing vendor invoice from 09:15.
[CHECKS] Confirmed user holds Business Premium SKU; billing@ mailbox permissions missing after yesterday's security group edit. Exchange Message Trace confirmed vendor email arrived 09:16 and held in Defender Quarantine.
[ACTION] Restored Full Access/Send As delegation on billing@; guided user to outlook.office.com workaround while Outlook automapping refreshes; submitted quarantine review ticket to InfoSec for vendor email release.`,
        customerReply:
          'Hi Marcus — Good news: we found the missing vendor email safely held in our spam quarantine filter and have requested its release. We also restored your shared access to the billing mailbox—it should reappear in desktop Outlook shortly, and is ready right now in webmail!',
        escalationCriteria:
          'Escalate to M365 Cloud Admin / InfoSec for tenant-wide DKIM/SPF mail-flow changes or releasing high-confidence quarantined attachments.',
      },
    },

    commonTraps: [
      {
        trap: 'Assigning an expensive full user license to every Shared Mailbox like `info@` or `support@`.',
        reality: 'Standard Shared Mailboxes up to 50 GB require **no separate license**—only the humans accessing them need licenses (and shared-mailbox direct sign-in stays disabled).',
      },
      {
        trap: 'Reinstalling the entire Microsoft 365 desktop suite (45 minutes) to fix an Outlook password loop.',
        reality: 'Clearing stale tokens in **Windows Credential Manager** or creating a fresh Outlook Mail Profile usually fixes auth loops in under 5 minutes.',
      },
      {
        trap: 'Forgetting to test `outlook.office.com` webmail to separate a broken desktop app from a real mail-server or account block.',
        reality: 'Webmail working proves credentials, mailbox, and cloud service are healthy—narrowing the fault strictly to the local desktop client.',
      },
    ],

    keyTerms: [
      {
        term: 'Shared Mailbox',
        shortDef: 'Team mailbox (`support@`, `billing@`) accessed by delegated licensed users without its own user license.',
        fullDef: 'Supports shared inbox/sent tracking and typically needs no separate M365 license up to 50 GB.',
      },
      {
        term: 'Message Trace',
        shortDef: 'Exchange Online audit tool showing the exact delivery, quarantine, or rejection path of an email.',
        fullDef: 'Eliminates guessing when users report sent or received messages never arrived.',
      },
      {
        term: 'Microsoft Intune (MDM)',
        shortDef: 'Cloud Mobile Device Management service enforcing encryption, patching, app deployment, and compliance.',
        fullDef: 'Feeds device health status into Entra ID Conditional Access before allowing corporate resource sign-ins.',
      },
      {
        term: 'Google Workspace Admin Console',
        shortDef: 'Central cloud admin hub for Gmail, Google Drive, Workspace licenses, and device policies.',
        fullDef: 'Performs the same organizational identity, mail-trace, and license duties for Google-first organizations.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-611-q1',
        prompt: 'A new employee’s Entra ID account was created 2 hours ago, they can sign into their laptop, yet opening Outlook/Teams fails with *"Mailbox does not exist / You are not licensed."* What is the fastest fix?',
        options: [
          'Open Microsoft 365 Admin Center -> assign the required M365 license SKU (including Exchange Online & Teams) and allow a few minutes for provisioning.',
          'Run `ipconfig /flushdns` ten times.',
          'Create a second AD account with a different spelling.',
          'Replace the laptop’s NVMe drive.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: An identity account alone does not create an Exchange mailbox or Teams entitlement without an active license SKU.',
          'Incorrect: DNS flushing will not provision cloud mailboxes.',
          'Incorrect: Creating duplicate accounts creates severe identity messes without fixing licensing.',
          'Incorrect: Hardware drives have zero relation to cloud licensing.',
        ],
        takeaway: 'No license SKU = no Exchange Online mailbox or Teams entitlement.',
      },
      {
        id: 'itsup-611-q2',
        prompt: 'A user says *"I sent an email to an external client an hour ago and they claim it never landed."* Which M365 tool gives definitive delivery evidence?',
        options: [
          'Exchange Admin Center -> Message Trace',
          'Windows Device Manager',
          'OneDrive Sync Settings',
          'Task Manager Performance tab',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Message Trace logs timestamps, transport rules, quarantine holds, and external handoff status.',
          'Incorrect: Device Manager tracks local hardware drivers only.',
          'Incorrect: OneDrive manages cloud file syncing.',
          'Incorrect: Task Manager measures local CPU/RAM.',
        ],
        takeaway: 'Use Message Trace (or Workspace Email Log Search) to prove exactly what happened to any email.',
      },
      {
        id: 'itsup-611-q3',
        prompt: 'What is a major advantage of a **Shared Mailbox** (`helpdesk@company.com`) compared to an ordinary Distribution List?',
        options: [
          'Multiple delegated licensed staff share a single inbox/sent-items history (showing who already replied) without buying a separate license for the shared mailbox.',
          'Shared Mailboxes allow anyone on the internet to bypass MFA.',
          'Distribution Lists store 50 GB of shared folders by default.',
          'Shared Mailboxes work without any internet connection.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Shared Mailboxes preserve centralized Inbox/Sent visibility for teams while requiring zero dedicated license under 50 GB.',
          'Incorrect: Shared Mailboxes inherit authenticated user MFA via delegation.',
          'Incorrect: Distribution Lists simply forward copies to member inboxes with no shared state.',
          'Incorrect: Cloud mail still requires connectivity to sync.',
        ],
        takeaway: 'Use Shared Mailboxes for collaborative team inboxes; use Distribution Lists for simple broadcast forwarding.',
      },
      {
        id: 'itsup-611-q4',
        prompt: 'When Conditional Access blocks a remote laptop with *"Your device does not meet organization compliance requirements,"* which tool on the endpoint checks encryption/patch health and reports back to Entra ID?',
        options: [
          'Microsoft Intune (via the Company Portal sync check)',
          'Microsoft Paint',
          'Windows Calculator',
          'Notepad++',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Intune MDM evaluates BitLocker encryption, OS version, and Defender state before marking the device compliant.',
          'Incorrect: Unrelated utility.',
          'Incorrect: Unrelated utility.',
          'Incorrect: Text editor with no MDM function.',
        ],
        takeaway: 'Intune enforces device compliance (encryption, updates, AV) required by Conditional Access.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Handle an M365 Access / Email Ticket in the Simulator',
      targetTab: 'simulator',
      instructions: [
        'Pick an Exchange/Outlook/M365 or Google Workspace ticket in the Help Desk Simulator.',
        'Include webmail check, license/permission verification, and Message Trace evidence in Internal Notes.',
      ],
      verificationCheck: 'Ticket resolves root cause cleanly while offering webmail as an immediate interim workaround.',
    },

    summaryBullets: [
      'Always verify **M365 / Google Workspace license assignment** when new hires cannot access email or chat.',
      'Check **webmail** early to separate local desktop Outlook bugs from cloud account/service faults.',
      'Use **Shared Mailboxes** (no separate license up to 50 GB) for team inboxes and **Message Trace** for missing-email proof.',
      'Fix Outlook auth loops by clearing stale tokens/profiles before attempting slow software reinstalls.',
      '**Microsoft Intune (MDM)** enforces compliance policies (BitLocker, OS patches, Defender) checked by Conditional Access.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Microsoft 365 Admin Center, Shared Mailboxes, and Exchange Message Trace',
      'Microsoft Learn — Microsoft Intune Device Compliance & OneDrive Sync Troubleshooting',
    ],
  },

  'itsup.core.sec.containment-bitlocker': {
    id: 'itsup.core.sec.containment-bitlocker',
    moduleId: 'it-support',
    unitTitle: 'Unit 7: Security Basics for Frontline Support',
    topicTitle: '7.1 Phishing Containment, BitLocker & Least Privilege',
    code: '7.1.1',
    title: 'Containing Phished Accounts (Revoke Tokens, Audit Forwarding Rules) & BitLocker Policy',
    readMinutes: 14,
    prerequisites: ['5.1.1 Active Directory, Entra ID & GPO', '6.1.1 M365, Intune & Google Workspace'],
    versionScope: 'shared',

    learningObjectives: [
      'Apply the **CIA Triad** (Confidentiality, Integrity, Availability) and **Principle of Least Privilege** directly to daily Help Desk access decisions.',
      'Execute rapid containment on an **AiTM** (Adversary-in-the-Middle) phished cloud account: **revoke active sessions/tokens FIRST**, reset credentials, audit **inbox forwarding rules** and malicious **MFA devices**, and notify InfoSec.',
      'Protect **BitLocker** (Windows full-disk encryption) recovery keys against **vishing** (voice phishing) and social engineering by requiring strict identity verification and asset ownership checks.',
      'Verify **3-2-1 Backup** integrity (3 copies, 2 media types, 1 offsite/immutable) and safe ransomware-isolation reflexes ("isolate network, do NOT wipe evidence").',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Resetting Only the Password on a Phished Account Leaves the Attacker Logged Right In',
      narrative:
        'An employee clicks a fake Microsoft login link and enters both their password AND approves an MFA prompt (**AiTM phishing** captures the live session cookie!). Two minutes later, they call Help Desk panicked. If an agent *only* changes the password without clicking **Revoke active sessions** and checking **Inbox Rules**, the attacker keeps reading emails, silently auto-forwarding wire-transfer invoices to Gmail, and adding their own authenticator app to stay inside for weeks!',
    },

    plainEnglish: {
      analogyTitle: 'Think of Changing Your House Locks While the Burglar Is Still Standing Inside the Living Room',
      analogy:
        'Resetting a password without revoking active login tokens is like putting a shiny new padlock on your front door while an intruder is already sitting inside your kitchen! **Containment** means kicking everyone out of the house immediately (**Revoke Sessions**), changing the lock (**Password Reset**), checking whether they unlocked a back window (**Inbox Forwarding Rules & rogue MFA methods**), and calling Security (**InfoSec escalation**).',
      technicalDefinition:
        'Frontline incident containment neutralizes compromised credentials—especially session-stealing **Adversary-in-the-Middle (AiTM)** phishing—through immediate token revocation, credential rotation, persistence sweeping (inbox rules, OAuth app consents, MFA registration), and endpoint isolation, paired with strict **BitLocker** recovery-key verification and **Least Privilege** enforcement.',
      paragraphs: [
        'Know why **BitLocker Recovery Keys** are high-value targets: If a thief steals a company laptop from an airport, the hard drive is encrypted gibberish—useless unless they trick a friendly Help Desk agent into reading the 48-digit BitLocker recovery key over the phone (**vishing**)! Always verify the caller’s identity out-of-band AND confirm the laptop serial/BitLocker Key ID matches their assigned asset before ever sharing recovery digits.',
        'Respect **Least Privilege** & **3-2-1 Backups**: Never grant permanent Domain Admin or Local Admin rights just to silence an occasional software prompt. And if ransomware hits an endpoint, **disconnect it from Wi-Fi/Ethernet immediately** (do not power off hastily or wipe the drive, which destroys forensic memory/encryption keys) and escalate to InfoSec as a **P1 Security Incident**.',
      ],
    },

    deepDive: {
      intro:
        'Memorize this exact 5-step phishing containment sequence and BitLocker security gate.',
      steps: [
        {
          step: '1. Revoke Tokens FIRST',
          title: 'Disable / Revoke Active Cloud Sessions Immediately',
          explanation:
            'In Entra ID / M365 (or Google Workspace), click **Revoke Sessions** (and temporarily block sign-in if unauthorized activity is ongoing). This invalidates stolen AiTM session cookies right away.',
        },
        {
          step: '2. Rotate Credentials & Clean MFA',
          title: 'Reset Password & Audit Registered MFA Methods',
          explanation:
            'Reset the password cleanly, then check **Authentication Methods** inside the user’s profile—delete any unfamiliar phone numbers, hardware keys, or extra Authenticator apps added by the attacker during the breach window.',
        },
        {
          step: '3. Sweep Persistence',
          title: 'Check Inbox Forwarding Rules, Delegates & OAuth Apps',
          explanation:
            'Attackers routinely create hidden Outlook rules (`Move all emails containing "invoice" to RSS Feeds and forward to external@gmail.com`) or grant rogue OAuth third-party apps. Inspect and purge all unauthorized rules and Sent Items abuse.',
        },
        {
          step: '4. Isolate & Escalate',
          title: 'Network-Isolate Infected PCs & Page InfoSec',
          explanation:
            'If malware/ransomware ran locally, disconnect the PC from the network (or trigger EDR network containment), preserve state for forensics, and escalate to **InfoSec** with exact timestamps and IPs.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Account Compromise Containment Order (Speed Stops Persistence)',
        asciiFallback: `[User clicked AiTM phish link & entered MFA]
   |
   +--> [1] REVOKE ACTIVE SESSIONS (Kills stolen cookie immediately!)
   +--> [2] RESET PASSWORD + AUDIT MFA METHODS (Remove attacker phone/app!)
   +--> [3] SWEEP PERSISTENCE (Inbox forwarding rules, delegates, OAuth apps)
   +--> [4] CHECK SENT ITEMS / SIGN-IN LOGS -> Escalate full timeline to InfoSec`,
      },
      workedExample: {
        title: 'Worked Security Incident: Catching an Attacker’s Hidden Inbox Rule After Phishing',
        context:
          'Accounts Receivable clerk clicks a "Shared PDF Document" link, enters M365 credentials + approves one MFA prompt, then notices weird sent emails 10 minutes later.',
        steps: [
          'Immediately trigger **Revoke Sessions** in Entra ID and temporarily block sign-in.',
          'Check Entra ID Sign-in Logs: confirm an unfamiliar IP signed in 8 minutes ago.',
          'Reset password and inspect Authentication Methods -> discover an unknown Authenticator app registered 6 minutes ago -> **delete it** and require verified re-registration.',
          'Check Exchange Inbox Rules (`Get-InboxRule`) -> find a hidden rule named `"."` forwarding all emails with `"wire"` or `"payment"` to an external free-mail address and deleting notifications -> **remove rule** and escalate full audit log to InfoSec.',
        ],
        outcome:
          'Prevented potential invoice-fraud wire compromise by sweeping persistence, not just changing the password.',
      },
    },

    supportWalkthrough: {
      intro:
        'Keep these security response scripts and hard safety gates non-negotiable.',
      steps: [
        {
          phase: 'Phishing Triage',
          action: 'Revoke sessions -> Reset password -> Remove rogue MFA -> Purge Inbox rules & OAuth grants -> Escalate to InfoSec.',
          whyItWorks: 'Removes both current stolen cookies and quiet persistence backdoors.',
        },
        {
          phase: 'BitLocker Gate',
          action: 'Require out-of-band caller verification AND verify matching Asset Tag + Recovery Key ID prefix on screen.',
          whyItWorks: 'Prevents thieves holding stolen laptops from social-engineering decryption keys.',
        },
        {
          phase: 'Malware / Ransomware',
          action: 'Isolate endpoint from Wi-Fi/Ethernet immediately without rebooting/wiping, then page InfoSec.',
          whyItWorks: 'Stops lateral spread across shared network drives while preserving forensic evidence.',
        },
      ],
      questionsToAsk: [
        '"Did you only open the email, or did you click the link and type your password or approve an MFA prompt?"',
        '"For your BitLocker screen, can you read back the 8-character Key ID shown near the top so I verify we’re looking at your assigned laptop?"',
        '"Did anyone else in your department receive that same email or attachment?"',
      ],
      sampleUserWording: [
        {
          situation: 'Reassuring an embarrassed employee who fell for a phish',
          sayThis:
            '"Thank you for telling us right away—reporting it within minutes is the best thing you could do! I’ve already locked out all active web sessions so no one else can stay signed in. Next, we’ll reset your password and review your account settings together."',
        },
        {
          situation: 'Enforcing BitLocker key verification politely',
          sayThis:
            '"Because BitLocker protects sensitive company data on your drive, I just need to verify your identity with a quick callback and confirm the short Key ID on your blue screen before reading the recovery code."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Security Incident -> Suspected Account Compromise (AiTM Phish)',
        priorityFormula: 'Impact: Medium/High (Active credential exposure) × Urgency: Critical = P1/P2 Security Escalation',
        internalNotes: `[SYMPTOM] User reported entering M365 creds + MFA on spoofed PDF login page at ~14:05.
[CONTAINMENT] 14:12 Revoked all Entra ID refresh tokens/sessions; 14:13 Reset password; 14:15 Audited MFA methods (removed 1 unrecognized Authenticator added 14:07); 14:17 Swept Exchange Inbox Rules (removed unauthorized external forwarding rule ".").
[ESCALATION] Escalated P1 packet (sign-in IP, timestamps, rule details, suspicious sender URL) to InfoSec SOC for tenant-wide phishing hunt.`,
        customerReply:
          'Hi Taylor — Thank you again for catching and reporting that suspicious login page immediately. We revoked all active sessions, updated your password, and cleaned up unauthorized settings on your account. Our Security team is taking a quick look behind the scenes, and I’ll stay on hand if you need help signing back in.',
        escalationCriteria:
          'Mandatory immediate escalation to InfoSec for EVERY confirmed credential/MFA compromise, unauthorized inbox rule, or suspected malware execution.',
      },
    },

    commonTraps: [
      {
        trap: 'Resetting a phished user’s password and closing the ticket without revoking sessions or checking Inbox rules.',
        reality: 'Stolen AiTM session tokens survive simple password resets and allow attackers to keep reading mail and planting forwarding rules.',
      },
      {
        trap: 'Reading a BitLocker recovery key purely because someone in chat claims "I’m locked out of my laptop before a flight!"',
        reality: 'Strict out-of-band identity + assigned asset verification must happen before disclosing any BitLocker key.',
      },
      {
        trap: 'Formatting/reimaging a ransomware-infected PC immediately to "get the user working faster" without telling InfoSec.',
        reality: 'Wiping destroys forensic proof and ignores lateral spread across shared drives—isolate network first and alert InfoSec.',
      },
    ],

    keyTerms: [
      {
        term: 'CIA Triad',
        shortDef: 'Security pillars: Confidentiality (privacy), Integrity (uncorrupted data), Availability (uptime).',
        fullDef: 'Guides every trade-off on the desk—for example, BitLocker protects Confidentiality while 3-2-1 backups protect Availability.',
      },
      {
        term: 'AiTM Phishing (Adversary-in-the-Middle)',
        shortDef: 'Reverse-proxy phishing attack that steals live session cookies alongside passwords and MFA approvals.',
        fullDef: 'Requires immediate session/token revocation, not just a password change.',
      },
      {
        term: 'BitLocker',
        shortDef: 'Built-in Windows full-disk encryption protecting lost or stolen laptops from offline disk reading.',
        fullDef: 'Recovery keys require strict out-of-band identity & asset verification before disclosure.',
      },
      {
        term: '3-2-1 Backup Rule',
        shortDef: '3 data copies, on 2 different media types, with at least 1 copy stored offsite/immutable.',
        fullDef: 'Protects organizations from ransomware encryption and local hardware disasters.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-711-q1',
        prompt: 'An employee just realized they typed their password and approved an MFA push on a fake Microsoft 365 login page 5 minutes ago. Why is simply changing their password NOT enough?',
        options: [
          'AiTM phishing captures active session cookies; you must **revoke active sessions**, audit MFA methods, and check Exchange **inbox forwarding rules** too.',
          'Passwords cannot be changed on Tuesdays.',
          'Only unplugging the monitor clears browser tokens.',
          'Changing the password automatically deletes all Inbox rules.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Stolen session tokens and planted persistence (rogue MFA or hidden forwarding rules) survive a standalone password reset.',
          'Incorrect: Nonsense.',
          'Incorrect: Display cables have zero effect on cloud sessions.',
          'Incorrect: Inbox rules persist unless explicitly audited and removed.',
        ],
        takeaway: 'Containment order: Revoke Sessions -> Reset Password -> Clean MFA Methods -> Audit Inbox Rules/OAuth -> Alert InfoSec.',
      },
      {
        id: 'itsup-711-q2',
        prompt: 'A caller with a blocked caller ID asks for the 48-digit BitLocker recovery key for laptop `FIN-LT-088`, claiming they forgot their PIN at an airport. What MUST you enforce first?',
        options: [
          'Verify caller identity out-of-band (HR-listed phone callback/manager check) AND confirm asset ownership + matching Key ID prefix before releasing the key.',
          'Read the 48 digits immediately so they don’t miss their flight.',
          'Disable BitLocker permanently across Finance laptops.',
          'Email the recovery key to their personal Gmail address.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Prevents thieves or vishing attackers from decrypting a stolen corporate drive.',
          'Incorrect: Skipping verification defeats the entire purpose of full-disk encryption.',
          'Incorrect: Violates enterprise security policy.',
          'Incorrect: Sending corporate recovery secrets to unverified personal email risks leakage.',
        ],
        takeaway: 'Never hand out BitLocker recovery keys without verified out-of-band identity and asset matching.',
      },
      {
        id: 'itsup-711-q3',
        prompt: 'A user’s screen suddenly displays a ransomware demand note and files on their desktop show `.locked` extensions. What is your immediate FIRST technical instruction?',
        options: [
          'Disconnect/isolate the computer from the network (unplug Ethernet / turn off Wi-Fi or isolate via EDR) immediately without wiping the disk, and escalate P1 to InfoSec.',
          'Map every other department’s shared drive to check if they open.',
          'Reformat and reinstall Windows right away without telling Security.',
          'Send Bitcoin immediately using a corporate card.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Immediate network isolation halts ransomware from encrypting shared network folders while keeping evidence intact for InfoSec.',
          'Incorrect: Accessing other shares can help spread malware.',
          'Incorrect: Wiping destroys forensic artifacts and doesn’t catch how the attacker entered.',
          'Incorrect: Never pay ransoms without executive/legal/InfoSec crisis response.',
        ],
        takeaway: 'Ransomware reflex: Isolate network immediately, preserve state, escalate P1 to InfoSec.',
      },
      {
        id: 'itsup-711-q4',
        prompt: 'A developer asks for permanent Domain Administrator rights so they never get UAC prompts installing test utilities. Which security principle argues against granting Domain Admin?',
        options: [
          'Principle of Least Privilege (grant only the minimum scope needed, such as scoped local admin/elevation tooling, never Domain Admin).',
          '3-2-1 Backup Rule',
          'Half-duplex Ethernet negotiation',
          'Split-tunnel DNS',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Least Privilege limits blast radius if a single developer laptop gets phished or infected.',
          'Incorrect: 3-2-1 covers backup resilience.',
          'Incorrect: Network Layer 1/2 duplexing.',
          'Incorrect: VPN DNS routing.',
        ],
        takeaway: 'Apply Least Privilege everywhere—even convenient admin shortcuts become catastrophic if an account is phished.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Respond to Security & Phishing Scenarios in the Simulator',
      targetTab: 'simulator',
      instructions: [
        'Run a security, BitLocker, or phishing triage ticket inside the Help Desk Simulator.',
        'Check your response order: out-of-band verification or immediate token revocation before closing.',
      ],
      verificationCheck: 'Security tickets log containment steps in exact order plus InfoSec escalation details.',
    },

    summaryBullets: [
      'Protect **Confidentiality, Integrity, and Availability (CIA)** and strictly apply **Least Privilege** on every access request.',
      'Contain phished cloud accounts in order: **Revoke active sessions FIRST** -> Reset password -> Remove rogue MFA -> Purge Inbox forwarding rules -> Escalate to InfoSec.',
      'Require out-of-band identity + asset ownership checks before releasing **BitLocker recovery keys**.',
      'For suspected ransomware: **isolate from the network immediately**, do not wipe evidence, and page InfoSec P1.',
      'Back up critical data under the **3-2-1 rule** (3 copies, 2 media types, 1 offsite/immutable).',
    ],

    sourcesToVerify: [
      'NIST Cybersecurity Framework / CISA Phishing Containment Best Practices',
      'Microsoft Learn — Respond to a Compromised Cloud Account & BitLocker Recovery Policy',
    ],
  },

  'itsup.core.ops.troubleshooting-remote': {
    id: 'itsup.core.ops.troubleshooting-remote',
    moduleId: 'it-support',
    unitTitle: 'Unit 8: Troubleshooting Method & Remote Support',
    topicTitle: '8.1 Structured Method, Remote Support & 60-Scenario Playbook',
    code: '8.1.1',
    title: '6-Step Triage, Remote Support Etiquette (TeamViewer/AnyDesk/Quick Assist) & Top 60 Scenarios',
    readMinutes: 16,
    prerequisites: ['2.1.1 Workstation Hardware & Docking', '3.1.1 OS Diagnostics & Support CLI', '4.1.1 Endpoint Networking & VPN Triage'],
    versionScope: 'shared',

    learningObjectives: [
      'Apply the industry-standard **6-Step Troubleshooting Methodology** consistently under time pressure instead of random trial-and-error.',
      'Introduce **Remote Support Tools** as a vendor-neutral software category (with practical awareness of **Windows Quick Assist**, **TeamViewer**, **AnyDesk**, and **RMM unattended agents**), enforcing explicit user consent and privacy protection.',
      'Diagnose subtle multi-symptom issues using **divide-and-conquer** ("What changed recently? Does it follow the user or stay with the PC?").',
      'Navigate the top recurring frontline help desk failure patterns across hardware, OS, networking, identity, and cloud apps.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Junior Techs Panic on Unfamiliar Software While Experienced Techs Solve Errors They’ve Never Seen',
      narrative:
        'No one memorizes every obscure ERP error code on Earth. What makes a Tier 1/Tier 2 technician valuable on Day 1 is an unshakeable **process**: gathering exact facts (*"Does this fail on web too?"*), forming a simple testable guess, changing **one thing at a time**, verifying the fix, and writing a note that prevents tomorrow’s teammate from repeating your work. Paired with respectful remote screen-sharing etiquette—never seizing a stranger’s mouse without permission—you handle almost any desk ticket smoothly.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Detective Securing a Crime Scene Before Moving Any Furniture',
      analogy:
        'Amateurs sprint into a room and start rearranging chairs before taking photos (**changing 5 settings at once**—so even if it starts working, nobody knows why!). Great detectives follow a calm checklist: interview the witness, inspect what changed since yesterday, test one clue at a time, double-check the alarm actually works afterward, and file a crisp case report (**Internal Notes + KB**).',
      technicalDefinition:
        'Structured frontline remediation combines the **6-Step Troubleshooting Methodology** (Identify, Theorize, Test, Plan/Implement, Verify Full System Functionality, Document) with **Remote Desktop Support Tools**—screen-sharing and control utilities (such as built-in Windows Quick Assist or cross-platform agents like TeamViewer and AnyDesk) governed by explicit user consent, session privacy, and least-privilege elevation.',
      paragraphs: [
        '**The Two Most Powerful Questions in IT Support**:\n1. *"Does the problem follow the **user** (happens on another laptop too -> account/cloud/profile issue) or stay with the **machine** (works for a coworker on this same desk -> local OS/hardware/port issue)?"*\n2. *"When did it last work cleanly, and what changed since then (Windows update, password change, new dock, office move)?"*',
        '**Remote Support Tool Etiquette (Category Before Brand)**: Remote support software lets technicians view screens or control keyboards securely over encrypted sessions. **Golden Rule**: ALWAYS ask explicit permission before taking mouse/keyboard control (*"May I view your screen and click through Settings together?"*), ask the user to minimize sensitive HR/payroll/personal banking windows first, and announce visibly when you disconnect!',
      ],
    },

    deepDive: {
      intro:
        'Follow the 6-Step Troubleshooting Loop alongside a practical frontline playbook covering the highest-frequency desk scenarios.',
      steps: [
        {
          step: 'Steps 1–2',
          title: '1. Identify the Problem -> 2. Establish Theory of Probable Cause',
          explanation:
            'Gather exact error text, ask *"User vs Machine?"* and *"What changed?"*, duplicate safely if possible, and pick the simplest likely cause first (cable/power/service/license before motherboard replacement).',
        },
        {
          step: 'Steps 3–4',
          title: '3. Test Theory -> 4. Establish Plan & Implement Solution',
          explanation:
            'Test ONE variable at a time! If your guess fails, rule it out cleanly and adjust your theory (or escalate with solid findings). Before rebooting or changing system settings, make sure no unsaved work gets lost.',
        },
        {
          step: 'Steps 5–6',
          title: '5. Verify Full System Functionality -> 6. Document Findings',
          explanation:
            'Never close on *"Try now"*: watch the user successfully save a file, print a page, or send a test email. Then log root cause, exact commands/fixes, and KB updates in Internal Notes.',
        },
        {
          step: 'Remote + Playbook',
          title: 'Remote Session Etiquette & Core Triage Matrix',
          explanation:
            'Built-in **Quick Assist**, **TeamViewer**, **AnyDesk**, or managed **RMM remote agents** bridge physical distance—but never hijack the cursor unannounced. Apply divide-and-conquer across the top 6 desk buckets: Boot/Dock (Hardware), Print Spooler/Permissions (OS), APIPA/DNS/VPN (Network), Lockout/MFA (Identity), Auth Loop/License (Cloud), and Phish/BitLocker (Security).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'The 6-Step Troubleshooting Loop + Divide-and-Conquer Matrix',
        asciiFallback: `[1. IDENTIFY] -> Gather exact error, scope (1 user vs many?), User vs Machine, what changed?
      |
[2. THEORIZE] -> Simplest/most probable cause first (Layer 1 -> Layer 7)
      |
[3. TEST 1 CHANGE] --(False?)--> Back to [2] with new evidence!
      | (True!)
[4. PLAN & FIX] -----> Save user files first -> Apply minimal safe fix
      |
[5. VERIFY] ---------> User tests real workflow + preventive check
      |
[6. DOCUMENT] -------> Crisp Internal Notes + Customer Reply + KB link`,
      },
      workedExample: {
        title: 'Worked Divide-and-Conquer: "Accounting Can’t Open the Shared Budget Folder Anymore!"',
        context:
          'User says the shared `\\\\FS01\\Finance` shortcut throws "Network path not found" after moving desks across the hall.',
        steps: [
          'Step 1 (Identify): Only this 1 user moved desks; coworker next to them opens `\\\\FS01\\Finance` fine -> **Machine/Port issue**, not a File Server outage!',
          'Step 2 (Theorize): New desk wall jack might be patched to a guest VLAN or disconnected.',
          'Step 3 (Test via Remote Assist with explicit consent): Run `ipconfig /all` -> IP is `192.168.99.45` (Guest Wi-Fi!) and Ethernet says `Media Disconnected`.',
          'Step 4–5 (Fix & Verify): Plugged Ethernet firmly into dock wall jack -> Ethernet received office `10.20.4.55` -> verified `\\\\FS01\\Finance` opened cleanly.',
          'Step 6 (Document): Logged exact wall jack & Guest Wi-Fi cause in Internal Notes.',
        ],
        outcome:
          'Two quick questions ("1 user or whole team? What changed?") solved the ticket in 4 minutes without bothering File Server admins.',
      },
    },

    supportWalkthrough: {
      intro:
        'Anchor every live call and remote screen-share session with these rules and top scenario patterns.',
      steps: [
        {
          phase: 'Before Remote Control',
          action: 'Ask user to close private tabs/payroll docs, explain clearly how to revoke control anytime, and ask explicit permission before clicking.',
          whyItWorks: 'Protects employee privacy and builds immediate trust during remote sessions.',
        },
        {
          phase: 'Change 1 Thing at a Time',
          action: 'Test one hypothesis and verify its result before stacking additional tweaks.',
          whyItWorks: 'Reveals the true fix and prevents creating two new bugs while fixing one.',
        },
        {
          phase: 'Rapid Top-Scenarios Check',
          action: 'Check the 6 quick categories: (1) Hardware/Dock power & cables, (2) OS hung service/disk space/permissions, (3) Network `169.254`/DNS/VPN, (4) Identity Event 4740/MFA, (5) Cloud license/webmail/auth token, (6) Security revoke/isolate.',
          whyItWorks: 'Covers the vast majority of real frontline help desk queues systematically.',
        },
      ],
      questionsToAsk: [
        '"Before I start a remote screen share, would you like a moment to minimize any confidential or personal windows?"',
        '"Is it alright if I request mouse control now so I can check your network settings?"',
        '"Does this error also happen if you sign into another computer, or only on this specific laptop?"',
      ],
      sampleUserWording: [
        {
          situation: 'Starting a Quick Assist / remote support session politely',
          sayThis:
            '"I’d love to look at that error together—let’s start a quick screen share using Quick Assist. You stay in full control the whole time and can end the session with one click whenever you’d like. Go ahead and let me know when you’re ready for the 6-digit code!"',
        },
        {
          situation: 'Closing a verified remote session cleanly',
          sayThis:
            '"Looks like your spreadsheet and printer are both working smoothly now! I’m closing our remote screen-share connection on my end—you’ll see the green border disappear. Have a great rest of your day!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Desk Moves & Connectivity -> Workstation Port / Network Profile',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium (Shared drive inaccessible) = P3 Normal',
        internalNotes: `[SYMPTOM] User unable to reach \\\\FS01\\Finance after moving to Desk 3B.
[CHECKS] Confirmed other Finance team members unaffected (isolated to local PC). With user consent via remote support, verified ipconfig /all showed PC on Guest Wi-Fi 192.168.99.x and Ethernet Media Disconnected.
[ACTION] Guided user to reseat Ethernet cable into Desk 3B wall port; confirmed office IP 10.20.4.55 assigned and \\\\FS01\\Finance opened cleanly.
[OUTCOME] Closed remote session visibly; user confirmed full access.`,
        customerReply:
          'Hi Sam — All set! When you moved to Desk 3B, your laptop hopped onto Guest Wi-Fi instead of the office network, which blocked internal shared folders. Clicking the desk cable firmly into the port restored full access right away.',
        escalationCriteria:
          'Escalate to NetOps / Facilities cabling if Ethernet stays `Media Disconnected` after testing with a known-good patch cord.',
      },
    },

    commonTraps: [
      {
        trap: 'Taking remote mouse control silently or snooping around unrelated folders while a user watches.',
        reality: 'Always get explicit permission first, explain every step aloud/in chat, and stick strictly to diagnostic paths.',
      },
      {
        trap: 'Rebooting, clearing caches, reinstalling drivers, and resetting profiles all in one giant rush without testing between steps.',
        reality: 'Changing one variable at a time proves what actually resolved the bug and teaches you repeatable patterns.',
      },
      {
        trap: 'Marking a ticket Resolved the instant you click Save without confirming the user can complete their real task.',
        reality: 'Step 5 (**Verify Full System Functionality**) catches half-fixed permissions and silent second errors before the user calls back.',
      },
    ],

    keyTerms: [
      {
        term: '6-Step Troubleshooting Methodology',
        shortDef: 'Identify -> Theorize -> Test -> Plan/Implement -> Verify Functionality -> Document.',
        fullDef: 'Industry-standard framework turning guesswork into calm, repeatable incident resolution.',
      },
      {
        term: 'Remote Support Tool',
        shortDef: 'Encrypted screen-sharing and remote-control software (e.g., Quick Assist, TeamViewer, AnyDesk, RMM agents).',
        fullDef: 'Requires explicit user consent, privacy hygiene, and clear session termination notice.',
      },
      {
        term: 'Follow-the-User vs. Stay-with-Machine',
        shortDef: 'Diagnostic split asking whether a bug tracks the user’s account everywhere or stays tied to one PC.',
        fullDef: 'Separates cloud/profile/AD permission faults from local OS, driver, or hardware issues in 10 seconds.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-811-q1',
        prompt: 'A user reports Outlook freezes every time they click Send. Following the **6-Step Troubleshooting Methodology**, what should you do immediately *after* implementing your fix?',
        options: [
          'Verify full system functionality (confirm a real test email sends cleanly) and check preventive measures before documenting and closing.',
          'Hang up instantly so handle time stays low.',
          'Delete the documentation step.',
          'Upgrade the user’s RAM.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Step 5 verifies the full end-to-end workflow works under real conditions before Step 6 documents the resolution.',
          'Incorrect: Rushing off causes repeat callbacks.',
          'Incorrect: Step 6 (Document) preserves root cause for teammates and KB search.',
          'Incorrect: Hardware swap is unrelated after a fix.',
        ],
        takeaway: 'Never skip Step 5 (Verify Full System Functionality) or Step 6 (Document Findings).',
      },
      {
        id: 'itsup-811-q2',
        prompt: 'Before taking mouse and keyboard control during a remote support session (Quick Assist, TeamViewer, or AnyDesk), what is the single most important rule?',
        options: [
          'Ask explicit user permission, give them a moment to close private windows, and narrate actions clearly.',
          'Hide the remote cursor so they don’t notice you’re connected.',
          'Read their personal email drafts first.',
          'Change their desktop wallpaper as a joke.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Consent and privacy hygiene are mandatory in professional remote support.',
          'Incorrect: Unattended sneaky control destroys user trust and violates policy.',
          'Incorrect: Unauthorized snooping is a firing/compliance offense.',
          'Incorrect: Unprofessional.',
        ],
        takeaway: 'Explicit user consent + privacy reminder + narrated actions = trustworthy remote support.',
      },
      {
        id: 'itsup-811-q3',
        prompt: 'A sales rep cannot open their CRM dashboard on Laptop A. You have them sign into a spare loaner Laptop B, and the **exact same error** appears right away. What does this divide-and-conquer test prove?',
        options: [
          'The problem follows the **user account / cloud permission / license**, NOT Laptop A’s local hardware.',
          'Laptop A’s SSD is dying.',
          'The USB-C dock needs firmware.',
          'Laptop A’s screen brightness is too low.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Reproducing on a completely different endpoint rules out local PC hardware/OS and points to identity, license, or server side.',
          'Incorrect: A fresh laptop wouldn’t share Laptop A’s SSD fault.',
          'Incorrect: Dock hardware stays on Laptop A.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'If a bug follows the user across two different PCs, investigate accounts, licenses, or cloud services—not local hardware.',
      },
      {
        id: 'itsup-811-q4',
        prompt: 'Why should you test **one change at a time** when troubleshooting a stubborn workstation error?',
        options: [
          'Changing five settings simultaneously makes it impossible to know which edit fixed the issue—or which edit introduced a brand-new problem.',
          'Windows only allows one click per minute.',
          'Ticketing systems crash if you write two steps.',
          'To intentionally stretch call times longer.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Single-variable testing isolates true root cause cleanly and keeps rollback safe.',
          'Incorrect: No such OS limit exists.',
          'Incorrect: Ticketing systems track many steps cleanly.',
          'Incorrect: Structured isolation actually makes resolution *faster* overall.',
        ],
        takeaway: 'Test one hypothesis at a time so you know exactly what fixed—or broke—the system.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Apply the 6-Step Loop Across Tier 1 & Tier 2 Tickets',
      targetTab: 'simulator',
      instructions: [
        'Open the Help Desk Simulator and complete one Tier 1 and one Tier 2 multi-symptom ticket.',
        'Trace your steps explicitly through Identify -> Theorize -> Test 1 Variable -> Verify -> Document.',
      ],
      verificationCheck: 'Every Simulator resolution verifies full workflow success and includes clean Internal Notes.',
    },

    summaryBullets: [
      'Follow the **6-Step Method**: Identify -> Theorize -> Test -> Implement -> Verify Full Functionality -> Document.',
      'Ask early: *"Does this follow the user or stay with the machine?"* and *"What changed since it last worked?"*',
      'Change **one variable at a time** so fixes stay clear, verifiable, and safe to roll back.',
      'Always request explicit user consent, protect private windows, and announce disconnect during **remote support** sessions.',
      'Mastery across the 6 core desk domains prepares you to translate skills effortlessly into specific enterprise **Help Desk Tools** next in Unit 9.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 2 (220-1102) — Six-Step Troubleshooting Methodology & Remote Access Etiquette',
      'Microsoft Learn — Windows Quick Assist Security & Remote Support Best Practices',
    ],
  },
};
