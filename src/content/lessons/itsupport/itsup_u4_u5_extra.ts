import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_U4_U5_EXTRA_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.4.2.1': {
    id: 'itsup.4.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 4: Networking for Support Staff',
    topicTitle: '4.1–4.2 Network Building Blocks, DHCP Leases & DNS Records',
    code: '4.2.1',
    title: 'LAN/WAN Devices, Private vs Public IPs, Ports (80/443/22/3389/53/25/587), DHCP Leases & DNS Records (A/AAAA/CNAME/MX/PTR & hosts)',
    readMinutes: 13,
    prerequisites: ['3.7.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Identify everyday network pieces (LAN, WAN, switch, access point, router, modem, firewall) and how a webpage loads step by step.',
      'Contrast private RFC 1918 addresses (192.168.x.x, 10.x.x.x), public IPs, IPv4 vs IPv6, subnet masks, default gateways, MAC addresses, and key service ports.',
      'Troubleshoot DHCP lease problems (169.254 APIPA, full scope, wrong network, rogue DHCP) vs. static/reserved addresses.',
      'Explain DNS records (`A`, `AAAA`, `CNAME`, `MX`, `PTR`), internal vs. external DNS split, and when a local `hosts` file override breaks one machine.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Only MY Laptop Opens the Old Test Site While Everyone Else Sees Production!"',
      narrative:
        'A finance manager gets `169.254.44.19` right after plugging into a new floor hub; five minutes later a developer reports `portal.corp.local` loads a defunct staging server ONLY on their workstation despite `ipconfig /flushdns`. Understanding DHCP leases, DNS record types (`A/AAAA/CNAME/MX/PTR`), internal corporate DNS vs. internet DNS, and the local Windows `hosts` file resolves mysterious one-PC network weirdness effortlessly.',
    },

    plainEnglish: {
      analogyTitle: 'Street Addresses, Zip Codes, Phone Books & a Sticky Note Taped Over Your Speed Dial',
      analogy:
        'Your **IP address** is your apartment mailing number, the **subnet mask** tells mail carriers which houses share your same street (**LAN**), and the **default gateway** is the neighborhood post office that routes letters leaving your building (**Router**). **DHCP** is the apartment manager handing out temporary parking passes (**leases**), while **DNS** is the company phone book translating `"portal.company.com"` into numbers. A stray **`hosts` file** entry is a handwritten sticky note taped right over the phone book—so *only that one computer* dials the wrong number!',
      technicalDefinition:
        'Support networking traces IPv4/IPv6 endpoint assignment (DHCP leases vs static reservations), Layer-2 MAC vs Layer-3 IP addressing, gateway routing, well-known TCP/UDP application ports, and hierarchical DNS resolution (including local `hosts` file precedence).',
      paragraphs: [
        'Know your core devices: **Switch** connects wired LAN ports inside a building (forwarding by **MAC address**); **Access Point (AP)** bridges Wi-Fi; **Router** connects different IP networks; **Modem** links to your ISP; **Firewall** filters traffic by rules and **Ports** (`80 HTTP`, `443 HTTPS`, `22 SSH`, `3389 RDP`, `53 DNS`, `25 & 587 Email sending`).',
        '**DHCP** automatically leases IP + subnet mask + gateway + DNS for a set lease time. Servers and printers keep **static or DHCP-reserved** addresses so their numbers never wander; laptops and phones stay dynamic.',
        'Know five **DNS records**: **`A`** (name -> IPv4), **`AAAA`** (name -> IPv6), **`CNAME`** (alias name -> canonical name), **`MX`** (domain -> mail exchange server!), and **`PTR`** (reverse lookup: IP -> name). Plus **internal corporate DNS** resolves names like `intranet.corp.local` that public DNS like `8.8.8.8` has zero clue about!',
      ],
    },

    deepDive: {
      intro: 'Walk through the exact browser webpage sequence alongside DHCP and DNS failures.',
      steps: [
        {
          step: '01',
          title: 'What Happens When You Type `https://example.com` (Interview Classic!)',
          explanation:
            '1) Device checks local cache / `hosts` file -> asks configured **DNS server** (Port 53) for an **`A`/`AAAA` record** IP; 2) If off-subnet, device sends packets to **Default Gateway** router MAC; 3) Connects to web server IP on **Port 443 (HTTPS)**; 4) Completes **TLS encryption handshake**; 5) Exchanges encrypted webpage HTML/data.',
        },
        {
          step: '02',
          title: 'Four Root Causes of DHCP Failures (`169.254.x.x`)',
          explanation:
            'When a PC self-assigns **`169.254.x.x` (APIPA)**, DHCP failed due to: (1) dead cable / wrong Wi-Fi / wrong VLAN, (2) **DHCP IP pool exhausted**, (3) **Rogue DHCP server** (someone plugged a cheap home router backwards into an office wall jack!), or (4) downed DHCP service. Fix start: `ipconfig /release` -> `ipconfig /renew`.',
        },
        {
          step: '03',
          title: 'DNS Failures & `hosts` File Overrides',
          explanation:
            'Symptom: `ping 8.8.8.8` works yet browsing by domain name fails! Test `nslookup example.com`, flush cache via `ipconfig /flushdns`, check which DNS server `ipconfig /all` lists. If *only one PC* resolves a site differently, inspect **`C:\\Windows\\System32\\drivers\\etc\\hosts`** (`/etc/hosts` on Mac/Linux) for old manual test overrides!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Browser Resolution Flow & DNS Record Reference',
        asciiFallback: `[User Types URL] -> [1. Local hosts file / cache?] -> [2. Query DNS Server (Port 53)]
       |                                                         |
[5. Load HTTPS (443)] <--- [4. Gateway Router] <--- [3. Returns A (IPv4) / AAAA (IPv6)]

Records: A (Name->IPv4) | AAAA (Name->IPv6) | CNAME (Alias) | MX (Mail Server) | PTR (IP->Name)`,
      },
      workedExample: {
        title: 'Catching a Rogue `hosts` Override & Explaining Split DNS',
        context: 'Single developer sees old QA login page at `app.company.com`; meanwhile remote employee can’t reach `hr.corp.local`.',
        steps: [
          'Developer PC: `nslookup app.company.com` returns `203.0.113.50`, yet `ping app.company.com` tries `10.1.99.50`! Open `C:\\Windows\\System32\\drivers\\etc\\hosts` -> remove hardcoded `10.1.99.50 app.company.com` line & run `ipconfig /flushdns`.',
          'Remote HR caller: Works on office Wi-Fi, fails off VPN -> explain `.corp.local` resolves strictly via **internal DNS** over VPN.',
        ],
        outcome: 'Both puzzling DNS tickets fixed cleanly in under 5 minutes.',
      },
    },

    supportWalkthrough: {
      intro: 'Collect full `ipconfig /all` output before resetting TCP/IP stacks blindly.',
      steps: [
        {
          phase: 'Inspect `ipconfig /all` Completely',
          action: 'Read DHCP Enabled, IPv4 Address, Subnet Mask, Default Gateway, Lease Times, and DNS Servers.',
          whyItWorks: 'Every clue (`169.254`, missing gateway, wrong DNS) appears in ten lines.',
        },
      ],
      questionsToAsk: [
        '"Has anyone recently plugged a personal travel router or hub into the office wall jack?"',
        '"Can you reach external sites normally, or is it strictly `.corp.local` internal names off VPN?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining DHCP vs static reservations simply',
          sayThis:
            '"Your laptop borrows a temporary office network address automatically via DHCP each day, while our floor printers use reserved permanent addresses so computers never lose track of where to print."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Networking -> DNS / hosts Override',
        priorityFormula: 'Impact: Low (1 PC) × Urgency: Medium = P3 Medium',
        internalNotes: `[SYMPTOM] Single workstation resolving app.company.com to decommissioned QA server IP 10.1.99.50.
[CHECK] nslookup returned live prod IP 203.0.113.50 while ping resolved 10.1.99.50 (hosts override indicator).
[FIX] Removed stale entry in C:\\Windows\\System32\\drivers\\etc\\hosts and ran ipconfig /flushdns; browser verified live production portal.`,
        customerReply:
          'Hi Alex — Your laptop had an old manual test entry saved inside its local `hosts` file overriding the real company address. We removed that old line and refreshed your DNS cache—you’re connecting straight to production now!',
        escalationCriteria:
          'Escalate immediately to Network Team if multiple users receive wrong `192.168.0.x` IPs (rogue DHCP port locate) or pool exhaustion.',
      },
    },

    commonTraps: [
      {
        trap: 'Trusting `nslookup` alone to verify how Chrome resolves a hostname.',
        reality:
          '`nslookup` queries the DNS server directly and **skips the local `hosts` file**! Always compare `nslookup` against `ping <hostname>` when hunting stale `hosts` entries.',
      },
      {
        trap: 'Looking up internal `.corp.local` hostnames against `8.8.8.8` and declaring DNS dead.',
        reality:
          'Public resolvers like `8.8.8.8` have zero knowledge of private internal DNS zones—test against the corporate internal DNS server over office Wi-Fi or VPN.',
      },
    ],

    keyTerms: [
      {
        term: 'DNS Record Types (`A`, `AAAA`, `CNAME`, `MX`, `PTR`)',
        shortDef: 'IPv4 (`A`), IPv6 (`AAAA`), Alias (`CNAME`), Email server (`MX`), Reverse IP-to-name (`PTR`).',
        fullDef:
          'Knowing `MX` is vital in Unit 6 when diagnosing bounced emails.',
      },
      {
        term: '`hosts` File',
        shortDef: 'Local plain-text file overriding DNS resolution on one specific computer.',
        fullDef:
          'Lives at `C:\\Windows\\System32\\drivers\\etc\\hosts` (Windows) and `/etc/hosts` (macOS/Linux).',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-421-q1',
        prompt: 'In an interview: "Explain what happens step by step when a user types `https://portal.example.com` into a browser." Which sequence is accurate?',
        options: [
          'Check local cache/hosts -> ask DNS (Port 53) for A/AAAA IP -> route via Default Gateway if remote -> connect on TCP Port 443 -> set up TLS encryption -> load webpage.',
          'Send a print spooler job -> assign 169.254 APIPA -> download BIOS.',
          'Connect directly on Port 25 -> look up MX record -> skip gateway.',
          'Switch NIC to FAT32 -> run `sfc /scannow`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Cleanly links DNS lookup, IP/gateway routing, Port 443 HTTPS, and TLS encryption.',
          'Incorrect: Unrelated subsystems.',
          'Incorrect: Port 25 + MX belong to SMTP email delivery, not HTTPS websites.',
          'Incorrect: Disk/OS tools.',
        ],
        takeaway: 'Web flow: hosts/cache -> DNS A/AAAA (53) -> Gateway -> TCP 443 + TLS -> HTTP exchange.',
      },
      {
        id: 'itsup-421-q2',
        prompt: 'What does an `MX` DNS record specify, and what does `CNAME` do?',
        options: [
          '`MX` specifies which mail servers receive email for a domain; `CNAME` maps an alias hostname to another canonical hostname.',
          '`MX` sets Wi-Fi password length; `CNAME` maps MAC addresses.',
          '`MX` resolves IPv6; `CNAME` replaces DHCP leases.',
          'Both disable local network firewalls.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Mail servers rely on MX records; aliases like `www` often point via CNAME.',
          'Incorrect: Unrelated.',
          'Incorrect: `AAAA` maps IPv6 addresses.',
          'Incorrect: DNS records do not toggle local firewalls.',
        ],
        takeaway: '`A`=IPv4, `AAAA`=IPv6, `CNAME`=Alias, `MX`=Mail exchange, `PTR`=Reverse lookup.',
      },
      {
        id: 'itsup-421-q3',
        prompt: 'Only ONE workstation loads an obsolete test IP for `hr.company.com`, while `nslookup` prints the real public IP and coworkers open production fine. Where should you look next?',
        options: [
          'Inspect `C:\\Windows\\System32\\drivers\\etc\\hosts` on that one machine for an old hardcoded override.',
          'Replace the building’s core firewall.',
          'Reinstall Microsoft Word.',
          'Restart the floor’s network printer.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `nslookup` ignores the `hosts` file while browsers obey it—classic `hosts` file override fingerprint!',
          'Incorrect: Coworkers work normally, proving core network/DNS is fine.',
          'Incorrect: Unrelated application.',
          'Incorrect: Unrelated peripheral.',
        ],
        takeaway: 'When one PC resolves differently from `nslookup` and neighbors, inspect its local `hosts` file.',
      },
      {
        id: 'itsup-421-q4',
        prompt: 'Besides a disconnected cable, what can cause office desktops to receive wrong IP addresses like `192.168.0.55` that lose company network access?',
        options: [
          'A rogue DHCP server (such as an unauthorized home router plugged into an office wall jack) handing out conflicting leases.',
          'Running PowerShell as Administrator.',
          'Enabling Windows Fast Startup.',
          'Switching a monitor from HDMI to DisplayPort.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Rogue DHCP devices race the real corporate DHCP server and hand staff dead private subnets.',
          'Incorrect: Local shell elevation has no DHCP effect.',
          'Incorrect: Boot setting.',
          'Incorrect: Display port.',
        ],
        takeaway: 'Wrong subnet IPs (`192.168.0.x`) across a desk row point to rogue DHCP; `169.254.x.x` points to unreachable/exhausted DHCP.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Map Your Network & Inspect IP/Gateway/DNS/hosts',
      instructions: [
        'Run `ipconfig /all` (or `ip addr` / `ifconfig`) on your computer and write down your IPv4, Subnet Mask, Default Gateway, and DNS server(s).',
        'View (read-only!) `C:\\Windows\\System32\\drivers\\etc\\hosts` (or `/etc/hosts`) to confirm clean entries.',
      ],
      verificationCheck: 'Can explain every number returned by `ipconfig /all` cleanly.',
    },

    summaryBullets: [
      'Switches forward inside a LAN by MAC address; routers (Default Gateways) connect different IP networks.',
      'Memorize essential ports: 22 (SSH), 25 & 587 (SMTP), 53 (DNS), 67/68 (DHCP), 80 (HTTP), 443 (HTTPS), 3389 (RDP).',
      'DHCP faults yield `169.254.x.x` APIPA (dead link, full pool, wrong VLAN) or wrong IPs from rogue DHCP devices.',
      'Know DNS records: `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `MX` (mail), `PTR` (reverse IP->name).',
      'Check the local `hosts` file (`etc\\hosts`) whenever one single computer ignores live DNS updates.',
    ],

    sourcesToVerify: [
      'CompTIA Network+ / A+ Core 1 — TCP/IP, Ports, DHCP & DNS Fundamentals',
      'Microsoft Learn — Windows hosts File & DHCP Client Troubleshooting',
    ],
  },

  'itsup.4.3.1': {
    id: 'itsup.4.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 4: Networking for Support Staff',
    topicTitle: '4.3 Network Troubleshooting Commands & The Ping Ladder',
    code: '4.3.1',
    title: 'Mastering the Ping Ladder (`127.0.0.1` -> Host -> Gateway -> `8.8.8.8` -> DNS), Timeout vs Unreachable, `tracert`, `arp -a`, `netstat -ano` & `route print`',
    readMinutes: 12,
    prerequisites: ['4.1.1', '4.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Execute the 5-step Ping Ladder in exact order to pinpoint local stack, NIC, gateway link, WAN routing, or DNS failure.',
      'Distinguish "Request timed out" vs. "Destination host unreachable" cleanly and recognize when firewalls simply drop ICMP pings.',
      'Use `tracert`/`traceroute`, `nslookup`/`dig`, `arp -a`, `netstat -ano`, `route print`, and PowerShell `Test-NetConnection` purposefully.',
      'Trace active listening/outbound sockets back to running executables using `netstat -ano` process IDs (PIDs).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Internet Dead!" — Guessing Randomly vs. Isolating the Exact Broken Hop in 60 Seconds',
      narrative:
        'An interviewer asks: *"A user says the internet is down. Which commands do you run first, and in what order?"* Meanwhile on shift, a workstation reports `"Destination host unreachable"` on ping, and a local web tool claims its port is already stolen by another program. Walking the **Ping Ladder** plus `arp -a`, `tracert`, `route print`, and `netstat -ano` answers both cleanly.',
    },

    plainEnglish: {
      analogyTitle: 'Testing Phone Service Step-by-Step: Mouthpiece -> Room Jack -> Lobby Desk -> City Line -> Directory',
      analogy:
        'When you can’t reach an overseas client by phone, test inside-out: (1) Mouthpiece (`127.0.0.1`), (2) Your own extension (own IP), (3) Building lobby desk (Default Gateway), (4) Direct outside number (`8.8.8.8`), (5) Directory name lookup (DNS). The first step that breaks tells you where to look!',
      technicalDefinition:
        'Methodical endpoint network diagnostics verify local TCP/IP stack integrity, Layer-2 ARP resolution, default gateway reachability, Layer-3 path hops (`tracert`), socket/PID bindings (`netstat -ano`), routing tables (`route print`), and application port handshakes (`Test-NetConnection`).',
      paragraphs: [
        'Watch `ping` wording carefully: **"Request timed out"** = no reply returned (host offline, firewall dropping ICMP, or missing return route—a blocked ping is a clue, not proof!). **"Destination host unreachable"** = *a router or your own PC* explicitly reports zero ARP/route path.',
        'Pair `ipconfig /all` and `ping` with **`tracert`/`traceroute`** (hop path), **`dig`/`nslookup`** (DNS resolver), **`arp -a`** (local MAC cache), **`route print`** (Windows routing table), **`netstat -ano`** (open ports + owning PIDs), and PowerShell **`Test-NetConnection -Port`**!',
      ],
    },

    deepDive: {
      intro: 'Memorize the 5-rung Ping Ladder and pair every network command with the exact question it answers.',
      steps: [
        {
          step: '01',
          title: 'The 5-Rung Ping Ladder (Strict Sequence)',
          explanation:
            '1) `ping 127.0.0.1` (OS TCP/IP stack); 2) `ping <own IP>` (NIC/driver); 3) `ping <default gateway>` (local cable/Wi-Fi/VLAN/switch); 4) `ping 8.8.8.8` (router/firewall/ISP beyond gateway); 5) `ping example.com` (DNS failure if 8.8.8.8 passed!).',
        },
        {
          step: '02',
          title: 'Path & Routing (`tracert`, `route print`, `arp -a`)',
          explanation:
            '`tracert 8.8.8.8` spots failing WAN hops; `route print` exposes broken VPN `0.0.0.0` routes; `arp -a` confirms local gateway MAC discovery.',
        },
        {
          step: '03',
          title: 'Ports & Processes (`netstat -ano` & `Test-NetConnection`)',
          explanation:
            '`netstat -ano` maps open sockets to PIDs -> inspect PID in Task Manager or `tasklist`; `Test-NetConnection <host> -Port 443` tests real application ports when ICMP ping is blocked.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'The 5-Rung Ping Ladder Diagnosis Map',
        asciiFallback: `[1] ping 127.0.0.1 -> [2] Own IP -> [3] Default Gateway -> [4] 8.8.8.8 -> [5] Hostname (DNS)`,
      },
      workedExample: {
        title: 'Debugging a Broken Gateway Using the Ladder',
        context: 'User gets "Destination host unreachable" pinging `8.8.8.8`.',
        steps: [
          '`ipconfig /all` reveals stale manual gateway `10.10.99.1` on a `10.10.2.x` subnet.',
          'Ladder passes `127.0.0.1` and own IP, then fails at `10.10.99.1` immediately.',
          'Enable automatic DHCP -> obtains valid `10.10.2.1` gateway -> ladder passes 5/5.',
        ],
        outcome: 'Pinpointed misconfigured static gateway in 45 seconds.',
      },
    },

    supportWalkthrough: {
      intro: 'Never declare a server offline just because ICMP ping timed out—verify the actual application port.',
      steps: [
        {
          phase: 'Ping Blocked != Server Dead',
          action: 'Run PowerShell `Test-NetConnection -Port 443` whenever ICMP ping drops against cloud servers.',
          whyItWorks: 'Cloud firewalls frequently drop ICMP while serving HTTPS cleanly.',
        },
      ],
      questionsToAsk: ['"Between your gateway, `8.8.8.8`, and a domain name, which rung fails first?"'],
      sampleUserWording: [
        {
          situation: 'Guiding a caller to run `ping` calmly',
          sayThis:
            '"Press Start, type `cmd`, press Enter, and run `ping 8.8.8.8`—let me know if it says Reply or Request timed out."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Networking -> Endpoint Connectivity Triage',
        priorityFormula: 'Impact: Low (1 PC) × Urgency: High = P2 High',
        internalNotes: `[PING LADDER] 127.0.0.1 OK -> Own IP OK -> Gateway OK -> 8.8.8.8 OK -> portal.company.com FAIL.
[RESOLUTION] Switched IPv4 DNS to Obtain Automatically (DHCP); ipconfig /flushdns -> ladder 5/5 passed.`,
        customerReply:
          'Hi Maya — Everything passed once we cleared an old manual DNS setting so your laptop receives the live office directory automatically.',
        escalationCriteria:
          'Escalate `tracert` drops occurring inside WAN/core hops beyond the local gateway directly to Network Operations.',
      },
    },

    commonTraps: [
      {
        trap: 'Seeing "Request timed out" on `ping corp.com` and immediately writing "Server is crashed!"',
        reality:
          'Firewalls routinely drop ICMP pings (`ping`)—test actual TCP service ports (`Test-NetConnection -Port 443`) first.',
      },
      {
        trap: 'Guessing `ipconfig /flushdns` will fix an issue where `ping 8.8.8.8` already fails.',
        reality:
          'Walking the Ping Ladder prevents wasted effort: if `8.8.8.8` or your default gateway fails, Layer-3 routing or link connectivity is broken—not DNS.',
      },
    ],

    keyTerms: [
      {
        term: 'Ping Ladder',
        shortDef: 'Ordered 5-step isolation: `127.0.0.1` -> own IP -> gateway -> `8.8.8.8` -> hostname.',
        fullDef: 'Separates local stack, NIC, gateway link, WAN routing, and DNS cleanly.',
      },
      {
        term: '`netstat -ano` & `arp -a`',
        shortDef: 'Active socket/port list with process PIDs (`netstat -ano`) and local IP-to-MAC cache (`arp -a`).',
        fullDef: 'Essential for hunting port conflicts and local gateway ARP resolution.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-431-q1',
        prompt: 'In an interview: "Which network test order do you use when a user says the internet is down?" Which sequence matches the Ping Ladder?',
        options: [
          'Check `ipconfig /all`, then ping `127.0.0.1` -> own IP -> default gateway -> `8.8.8.8` -> a domain name like `example.com`.',
          'Ping `example.com` -> reinstall NIC -> check `127.0.0.1`.',
          'Run `netstat -ano` -> reboot printer -> run `chkdsk`.',
          'Flush DNS -> swap laptop battery -> ping `169.254.0.1`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Works systematically inside-out from local OS stack to external DNS names.',
          'Incorrect: Starting with names fails to isolate DNS vs link vs gateway.',
          'Incorrect: Unordered diagnostics.',
          'Incorrect: Never ping APIPA.',
        ],
        takeaway: 'Know the Ping Ladder cold: `ipconfig /all` -> `127.0.0.1` -> own IP -> gateway -> `8.8.8.8` -> hostname.',
      },
      {
        id: 'itsup-431-q2',
        prompt: 'What does `netstat -ano` reveal that `ping` and `ipconfig` cannot?',
        options: [
          'Active TCP/UDP connections, local listening ports, and the owning Windows Process ID (PID) on that machine.',
          'The physical Wi-Fi signal strength in dBm.',
          'Which wall jack connects to which patch panel.',
          'The BitLocker recovery key.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Maps active sockets and ports straight to Task Manager PIDs.',
          'Incorrect: Use `netsh wlan show interfaces`.',
          'Incorrect: Physical tracing uses link lights.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Use `netstat -ano` when identifying which local program holds a port.',
      },
      {
        id: 'itsup-431-q3',
        prompt: 'Why is a failed `ping` ("Request timed out") to a public website NOT definitive proof the site is down?',
        options: [
          'Firewalls often intentionally block ICMP echo requests (`ping`) while still allowing HTTPS on port 443.',
          '`ping` only works on macOS.',
          '`ping` requires Domain Admin rights.',
          'Timeouts always mean your keyboard failed.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Verify TCP 443 directly with `Test-NetConnection -Port 443`.',
          'Incorrect: `ping` is cross-platform.',
          'Incorrect: Standard users can run `ping`.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Failed ICMP ping is a clue, not proof—verify real service ports via `Test-NetConnection`.',
      },
      {
        id: 'itsup-431-q4',
        prompt: 'Which two commands inspect router hops along a WAN path and the workstation’s local routing table?',
        options: [
          '`tracert` (`traceroute`) and `route print`.',
          '`sfc /scannow` and `winver`.',
          '`tasklist` and `diskmgmt.msc`.',
          '`gpresult /r` and `whoami`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `tracert` tracks router hops; `route print` shows local routing entries.',
          'Incorrect: System/OS version tools.',
          'Incorrect: Process/disk tools.',
          'Incorrect: GPO/user tools.',
        ],
        takeaway: 'Use `tracert` for hop drops and `route print` for VPN/gateway routing.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Execute the Ping Ladder & Inspect `netstat -ano`',
      targetTab: 'simulator',
      instructions: [
        'Run INC-2041 inside the Service Desk Simulator and step through `ipconfig` and the Ping Ladder.',
        'On your terminal, inspect `ipconfig /all`, `arp -a`, `route print`, and `netstat -ano`.',
      ],
      verificationCheck: '4/4 score on INC-2041 and full command familiarity.',
    },

    summaryBullets: [
      'Walk the Ping Ladder inside-out: `127.0.0.1` -> own IP -> default gateway -> `8.8.8.8` -> hostname.',
      'Differentiate "Request timed out" (silent drop/offline) vs "Destination host unreachable" (explicit no-route/ARP failure).',
      'Confirm TCP service ports via `Test-NetConnection -Port` when ICMP ping is blocked.',
      'Use `tracert` for WAN hops, `arp -a` for local neighbors, `route print` for routes, and `dig`/`nslookup` for DNS.',
      'Use `netstat -ano` + Task Manager PID lookup to tie open listening/outbound ports to executables.',
    ],

    sourcesToVerify: [
      'CompTIA Network+ / A+ — Command-Line Network Troubleshooting Tools',
      'Microsoft Learn — ping, tracert, route, arp, netstat & Test-NetConnection Docs',
    ],
  },

  'itsup.4.4.1': {
    id: 'itsup.4.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 4: Networking for Support Staff',
    topicTitle: '4.4–4.5 Wi-Fi Troubleshooting & VPN / RDP Connectivity',
    code: '4.4.1',
    title: 'Wi-Fi Bands (2.4/5/6 GHz), WPA2/WPA3 & Captive Portals (`netsh wlan`), Full vs Split VPN Tunnels, Certs/Clock & RDP (3389)',
    readMinutes: 12,
    prerequisites: ['4.1.1', '4.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Compare 2.4 GHz (farther reach, crowded), 5 GHz (faster, shorter range), and 6 GHz (cleanest) bands plus WPA2/WPA3 personal vs. enterprise auth.',
      'Diagnose "Connected, no internet" (captive portals, 169.254, DNS/outage) and inspect Windows Wi-Fi telemetry via `netsh wlan show interfaces`.',
      'Contrast Full-Tunnel vs. Split-Tunnel vs. Site-to-Site VPNs and isolate classic VPN blockers (no base internet, MFA missed, hotel blocks, expired certs, wrong clock).',
      'Explain Remote Desktop (RDP, TCP Port 3389) safety rules (reach via VPN, never expose raw 3389 to the public internet).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Hotel Wi-Fi Connects With No Internet—And My VPN Crashes With a Certificate Error!"',
      narrative:
        'A traveling director stays at a conference hotel: Wi-Fi shows `"Connected, no internet"`, then once online, the corporate VPN rejects login due to a drifted laptop clock, AND a contractor asks why IT won’t open port 3389 straight to their office PC without VPN. Mastering Wi-Fi bands, captive portals, VPN tunnel modes, clock drift, and safe RDP handling solves travel tickets fast.',
    },

    plainEnglish: {
      analogyTitle: 'Three Radio Channels, a Hotel Lobby Sign-In Gate & an Armored Private Tunnel',
      analogy:
        '**2.4 GHz** penetrates walls best yet is crowded; **5 GHz** is faster with shorter range; **6 GHz** is newest and cleanest! A **captive portal** is a hotel front desk blocking internet until you click Accept in a browser. A **VPN** builds an encrypted tunnel to HQ: **full tunnel** sends everything through HQ, whereas **split tunnel** sends only work subnets through HQ.',
      technicalDefinition:
        'Wireless and remote connectivity diagnostics evaluate RF propagation (`netsh wlan show interfaces`), 802.11 security modes (WPA2/WPA3 PSK/Enterprise, captive portals), VPN tunneling topologies (full vs split vs site-to-site), PKI certificate/clock dependencies, and encrypted RDP (3389) boundaries.',
      paragraphs: [
        'On Wi-Fi calls: check Airplane Mode/hardware switches, check `"Connected, no internet"` for **`169.254`** or an unclicked **captive portal**, run **`netsh wlan show interfaces`** for signal % and band, and remember corporate Wi-Fi drops after a **password change** until re-authenticated!',
        'On **VPN calls**: prove base internet works *first*, verify credentials/MFA/client version/hotel port blocks, and check **system date/time/clock** (wrong clocks break TLS certs immediately!). Tunnel **RDP (Port 3389)** strictly over VPN—never expose raw 3389 publicly.',
      ],
    },

    deepDive: {
      intro: 'Isolate Wi-Fi drops and remote VPN/RDP blocks systematically.',
      steps: [
        {
          step: '01',
          title: 'Meeting Room Wi-Fi Drops',
          explanation:
            'Ask whether everyone in that room drops (dead/overloaded AP or thick wall interference) vs. one laptop (forget & rejoin SSID, driver update, check `netsh wlan show interfaces` band/signal %).',
        },
        {
          step: '02',
          title: '"Connected, No Internet" Checklist',
          explanation:
            'Check `169.254` DHCP failure -> open non-HSTS HTTP URL (`http://neverssl.com`) to pop captive portals -> check DNS (`ping 8.8.8.8`).',
        },
        {
          step: '03',
          title: 'Full vs Split VPN & Clock/Cert Faults',
          explanation:
            'Full tunnel encrypts all traffic via HQ; Split tunnel routes only internal traffic (watch split DNS!). Check system clock, expired cert, client update, and hotel firewall blocks.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Full-Tunnel vs Split-Tunnel VPN & RDP Path',
        asciiFallback: `FULL TUNNEL:  [Remote Laptop] ===(All Traffic)===> [HQ Firewall] ---> Internet & Intranet/RDP (3389)
SPLIT TUNNEL: [Remote Laptop] ===(Corp Only)=====> [HQ Firewall] ---> Intranet / RDP (3389)`,
      },
      workedExample: {
        title: 'Fixing Airport Captive Portal + Stale System Clock VPN Error',
        context: 'Traveler hits "Connected, no internet" on airport Wi-Fi, then "Certificate not yet valid" on VPN.',
        steps: [
          'Opened plain HTTP trigger in browser -> accepted airport captive portal -> internet online.',
          'Synced Windows clock (had drifted 4 years behind) -> VPN TLS certificate validated cleanly -> RDP over port 3389 connected.',
        ],
        outcome: 'Fixed both travel roadblocks in 4 minutes.',
      },
    },

    supportWalkthrough: {
      intro: 'Verify base internet FIRST before touching any VPN configuration.',
      steps: [
        {
          phase: 'Base Internet Before VPN',
          action: 'Ask user to load an external news site before pressing VPN Connect.',
          whyItWorks: 'Cannot build a VPN tunnel over dead local Wi-Fi or unclicked captive portals.',
        },
      ],
      questionsToAsk: [
        '"Before turning on VPN, can your browser open a normal public webpage?"',
        '"Does the date and time on your taskbar match today?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining why RDP requires VPN cleanly',
          sayThis:
            '"Connecting RDP (port 3389) straight from the open internet invites automated attacks—turning on VPN first wraps it inside our encrypted corporate tunnel."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Networking -> Wi-Fi / VPN Remote Connectivity',
        priorityFormula: 'Impact: Low (1 traveling user) × Urgency: High = P2 High',
        internalNotes: `[FIX] Cleared airport captive portal via HTTP redirect, synced out-of-date Windows clock fixing TLS validation, verified VPN & RDP (3389) access.`,
        customerReply:
          'Hi Maya — Clicking the airport welcome portal and syncing your laptop clock cleared the certificate check—your VPN and Remote Desktop are active!',
        escalationCriteria: 'Escalate valid-clock multi-user VPN gateway handshake failures to NetOps.',
      },
    },

    commonTraps: [
      {
        trap: 'Exposing TCP Port 3389 directly onto the public internet without VPN.',
        reality: 'Open public RDP 3389 is one of the #1 entry points for ransomware attacks.',
      },
      {
        trap: 'Debugging VPN tunnel errors before confirming whether normal browser web pages load at all.',
        reality: 'VPN cannot connect across dead Wi-Fi or an unclicked hotel captive portal—always confirm base internet first.',
      },
    ],

    keyTerms: [
      {
        term: '2.4 GHz vs. 5 GHz vs. 6 GHz',
        shortDef: 'Longer wall reach/crowded (2.4), faster/shorter range (5), newest cleanest band (6).',
        fullDef: 'Inspect Windows connection stats via `netsh wlan show interfaces`.',
      },
      {
        term: 'Captive Portal & Full/Split Tunnel VPN',
        shortDef: 'Browser login wall on public Wi-Fi (`Captive Portal`) vs. all-traffic (`Full`) or corp-only (`Split`) VPN routing.',
        fullDef: 'Always verify base internet and accurate system clocks during VPN troubleshooting.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-441-q1',
        prompt: 'A salesperson on hotel Wi-Fi shows "Connected, no internet" and VPN fails. What two checks come first?',
        options: [
          'Check for a hotel captive-portal login page AND verify whether Windows got a `169.254` address instead of valid DHCP/DNS.',
          'Reinstall Windows 11.',
          'Replace the laptop SSD.',
          'Delete the mailbox.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Captive portals and DHCP/DNS drops explain virtually all "Connected, no internet" tickets.',
          'Incorrect: Irrelevant.',
          'Incorrect: Hardware fine.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Verify base internet, captive portals, and DHCP BEFORE debugging VPN clients.',
      },
      {
        id: 'itsup-441-q2',
        prompt: 'Why does a wrong system clock break VPN TLS certificates and TOTP MFA?',
        options: [
          'Certificates and TOTP codes rely strictly on current synchronized timestamps—wrong clocks make valid certificates appear expired or invalid.',
          'Wrong clocks turn off the Wi-Fi antenna.',
          'VPNs disable after 5 PM.',
          'Clocks pick 2.4 vs 5 GHz.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Always check OS date/time early on cert/auth errors.',
          'Incorrect: Hardware unrelated.',
          'Incorrect: False.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Sync system time whenever TLS cert errors or 6-digit MFA codes fail unexpectedly.',
      },
      {
        id: 'itsup-441-q3',
        prompt: 'How do 2.4 GHz and 5 GHz Wi-Fi bands compare?',
        options: [
          '2.4 GHz reaches farther through walls yet is slower and more crowded; 5 GHz is faster over shorter range (and 6 GHz is cleaner still).',
          '2.4 GHz is strictly faster than 5 GHz.',
          '5 GHz penetrates thick concrete much farther.',
          '6 GHz requires Ethernet cables.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Standard RF tradeoff across 2.4 / 5 / 6 GHz.',
          'Incorrect: Reversed.',
          'Incorrect: Higher frequencies attenuate faster.',
          'Incorrect: Wi-Fi 6E/7 is wireless.',
        ],
        takeaway: '2.4 GHz = range/crowded; 5 GHz = faster/shorter; 6 GHz = newest/cleanest.',
      },
      {
        id: 'itsup-441-q4',
        prompt: 'Which Windows command prints Wi-Fi SSID, band, signal %, and speed?',
        options: [
          'netsh wlan show interfaces',
          'ipconfig /flushdns',
          'sfc /wlancheck',
          'diskutil list',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Exposes full Windows wireless link metrics cleanly.',
          'Incorrect: Clears DNS cache.',
          'Incorrect: Invalid.',
          'Incorrect: macOS tool.',
        ],
        takeaway: 'Use `netsh wlan show interfaces` on Windows Wi-Fi calls.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Solve Split-Tunnel VPN DNS & Wi-Fi Captive Portals',
      targetTab: 'simulator',
      instructions: [
        'Run INC-3012 (Split-Tunnel VPN DNS) AND the Beginner Wi-Fi / Captive Portal ticket inside the Service Desk Simulator.',
      ],
      verificationCheck: '4/4 scores on both Wi-Fi and VPN simulator scenarios.',
    },

    summaryBullets: [
      '2.4 GHz penetrates farther (crowded); 5 GHz runs faster (shorter reach); 6 GHz offers clean modern capacity.',
      'Check Airplane mode, captive portals, DHCP (`169.254`), expired passwords, and `netsh wlan show interfaces`.',
      'Prove base internet BEFORE debugging VPN tunnels and check wrong clocks whenever TLS certs fail.',
      'Full-tunnel VPN routes all traffic via HQ; split-tunnel routes corporate subnets only.',
      'Tunnel Remote Desktop (port 3389) over VPN rather than exposing port 3389 directly online.',
    ],

    sourcesToVerify: [
      'CompTIA Network+ / A+ — Wireless Standards, VPN Topologies & Remote Access Ports',
      'Microsoft Learn — netsh wlan Commands & Remote Desktop Security Best Practices',
    ],
  },

  'itsup.4.6.1': {
    id: 'itsup.4.6.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 4: Networking for Support Staff',
    topicTitle: '4.6–4.7 Outage Scope Flowchart & Physical Network Gear',
    code: '4.6.1',
    title: 'Scope Decision Flowchart ("Internet Is Down") & Network Closet Basics (Patch Panels, VLANs, PoE, Link Lights & Closet Rules)',
    readMinutes: 11,
    prerequisites: ['4.1.1', '4.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Apply a rapid scope decision flow to classify "internet is down" calls across 1 device, 1 switch/floor, whole site/ISP, or 1 website/DNS.',
      'Identify physical closet gear: patch panel, patch cables, switch, router, firewall, access point, and modem.',
      'Explain how VLAN mismatches isolate desk PCs and how PoE powers VoIP desk phones and Wi-Fi access points over Ethernet.',
      'Read link/activity LEDs safely and follow network-closet rules (keep tidy, label everything, never edit switches unauthorized).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Floor 2 Lost Wired Access—And Desk 2B-19’s VoIP Phone Is Completely Dark!"',
      narrative:
        'Eight desks along Floor 2 West drop off simultaneously, while a moved employee’s VoIP desk phone stays dark and their laptop pulls Guest Wi-Fi range instead of Staff network. Mastering scope flowcharts, **link lights**, **PoE**, **patch panels**, and **VLANs** resolves both cleanly.',
    },

    plainEnglish: {
      analogyTitle: 'Apartment Breakers vs. City Power Grid + Virtual Highway Lanes (VLANs)',
      analogy:
        'One broken lamp = local cord; one dark room = floor switch/breaker; black street = site router/ISP! A **VLAN** separates Staff, Phones, and Guests invisibly on one switch—plugging into a **Guest VLAN wall jack** traps you outside internal servers even when link lights glow green!',
      technicalDefinition:
        'Site-level network triage pairs blast-radius scoping with Layer-1/2 infrastructure concepts: structured patch panels, 802.1Q VLAN isolation, PoE power delivery, and Ethernet link/activity LEDs.',
      paragraphs: [
        'Classify scope fast: **1 PC** (local NIC/IP/DNS) -> **1 Floor/Switch** (switch/VLAN/breaker) -> **Whole Site** (router/firewall/ISP) -> **1 Website** (DNS/proxy/block).',
        'In the closet: permanent wall runs end on **patch panels** linked via **patch cables** to switches. **PoE** sends power + data to phones/APs; **link/activity LEDs** prove Layer-1 physical continuity. Keep closets tidy, label cables, and never alter switch configs without NetOps approval.',
      ],
    },

    deepDive: {
      intro: 'Walk through the scope flowchart and physical closet inspection checklist.',
      steps: [
        {
          step: '01',
          title: 'Four-Branch Scope Flowchart',
          explanation:
            '1 PC? -> NIC/IP/DNS. Multiple desks on one wing/switch? -> Local switch/VLAN/power. Whole office? -> Core router/firewall/ISP. Only certain sites? -> DNS/proxy/block.',
        },
        {
          step: '02',
          title: 'VLAN Mismatches & PoE Power',
          explanation:
            'Different VLANs cannot talk without a router/ACL; moving to a Guest VLAN jack breaks internal access! Non-PoE switch ports leave VoIP phones and APs dark.',
        },
        {
          step: '03',
          title: 'Closet Rules & Escalation Evidence',
          explanation:
            'Record wall-jack faceplate label (`FL2-W19`), start time, affected desk count, wired vs Wi-Fi status, and LED state before escalating cleanly to Network Operations.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Wall Jack -> Patch Panel -> PoE / VLAN Switch Path',
        asciiFallback: `[PC / PoE Phone] ==(Jack 2B-14)==> [Patch Panel #14] --(Patch Cord)--> [Switch Port (VLAN 10 + PoE)]`,
      },
      workedExample: {
        title: 'Tracing a Dead Desk Phone & Guest-Trapped Laptop After a Desk Move',
        context: 'Desk 2B-19 phone stays dark and wired PC gets `172.30.99.44` (Guest VLAN).',
        steps: [
          'Swapped known-good Cat6 cord; laptop Ethernet green link light confirmed physical copper OK.',
          'Read faceplate label `FL2-W19` and escalated cleanly to NetOps requesting switch port update from Guest VLAN 99 to Staff Data + PoE Voice VLAN.',
        ],
        outcome: 'NetOps re-configured the exact port remotely in 2 minutes.',
      },
    },

    supportWalkthrough: {
      intro: 'Always capture the wall-jack label before escalating desk port faults.',
      steps: [
        {
          phase: 'Read Wall Jack Label',
          action: 'Record exact faceplate label (e.g., `FL2-W19`) inside physical move tickets.',
          whyItWorks: 'Maps directly to the closet patch panel port so NetOps never walks the floor tracing wires.',
        },
      ],
      questionsToAsk: [
        '"Is there a printed code label on the wall network faceplate?"',
        '"Do you see green/amber link lights where the cable plugs into your PC?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a floor switch outage calmly',
          sayThis:
            '"Multiple colleagues near you just lost wired access at once, pointing to the floor switch rather than your laptop. I’ve escalated all desk details to Network Operations and will update you in 20 minutes."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Networking -> Floor Switch / VLAN & PoE Port',
        priorityFormula: 'Impact: Medium (Desk move) × Urgency: High = P2 High',
        internalNotes: `[SYMPTOM] Wall Jack FL2-W19: PoE phone unpowered; PC receives 172.30.99.44 (Guest VLAN).
[ESCALATION] To NetOps: Reassign switch port mapped to patch panel FL2-W19 to Staff Data + PoE Voice VLAN.`,
        customerReply:
          'Hi Jordan — That unused wall port was still configured for Guest access without phone power. Our Network Team has the port number now and is flipping it over for you shortly!',
        escalationCriteria: 'Never edit switch configs or pull unlabeled closet cables without NetOps authorization.',
      },
    },

    commonTraps: [
      {
        trap: 'Unplugging random closet patch cables without checking labels.',
        reality: 'Pulling an unlabeled trunk drops an entire floor—always trace labels cleanly.',
      },
      {
        trap: 'Ignoring solid green Ethernet link lights while an employee has a `172.30.99.x` Guest IP instead of corporate servers.',
        reality: 'Physical link lights only prove Layer-1 cable continuity—a switch port left on a Guest VLAN without PoE still isolates the desk.',
      },
    ],

    keyTerms: [
      {
        term: 'Patch Panel & Link Lights',
        shortDef: 'Numbered wall-cable rack (`Patch Panel`) and Layer-1 continuity LEDs (`Link/Activity`).',
        fullDef: 'Solid link + blinking activity confirms copper/fiber continuity.',
      },
      {
        term: 'VLAN & PoE',
        shortDef: 'Logical network isolation (`VLAN`) and Ethernet power delivery (`PoE`) for phones/APs.',
        fullDef: 'Misassigned ports explain dark PoE phones and unreachable internal servers.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-461-q1',
        prompt: 'Multiple users on Floor 2 lose wired access at once while Floor 1 works fine. What do you do?',
        options: [
          'Confirm affected scope/time/ports, link duplicate tickets, check Wi-Fi/power there, and escalate urgently to NetOps with wall-port details.',
          'Reinstall Windows on all Floor 2 laptops.',
          'Factory-reset closet switches yourself without approval.',
          'Replace user mice.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Simultaneous wing failure points to local switch/uplink/power—escalate cleanly with scope.',
          'Incorrect: Pointless.',
          'Incorrect: Unauthorized switch resets cause huge outages.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Wing outage = confirm scope + link tickets + gather port/power clues + escalate cleanly to NetOps.',
      },
      {
        id: 'itsup-461-q2',
        prompt: 'A moved PC pulls a Guest internet-only IP and its VoIP phone stays completely dark. Why?',
        options: [
          'The wall jack connects to a switch port left on the isolated Guest VLAN without PoE enabled.',
          'Outlook OST file corrupted.',
          'Windows Home lacks PoE drivers.',
          'Bluetooth died.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Guest VLAN isolates internal access; missing PoE leaves VoIP phones dark.',
          'Incorrect: Unrelated.',
          'Incorrect: PoE is hardware electrical power from the switch.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Wrong VLAN breaks internal reachability; missing PoE leaves phones/APs unpowered.',
      },
      {
        id: 'itsup-461-q3',
        prompt: 'What does a patch panel do inside a network closet?',
        options: [
          'Terminates permanent in-wall wiring cleanly at numbered ports for patch cords leading to switches.',
          'Generates SSL certificates.',
          'Encrypts hard drives.',
          'Stores shared mailboxes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Organizes permanent wall jacks cleanly into switch patch cords.',
          'Incorrect: PKI.',
          'Incorrect: BitLocker.',
          'Incorrect: Exchange.',
        ],
        takeaway: 'Patch panels bridge permanent wall cables cleanly into numbered switch ports.',
      },
      {
        id: 'itsup-461-q4',
        prompt: 'What do a lit link LED and flashing activity LED indicate on an Ethernet port?',
        options: [
          'Valid Layer-1 physical link and active traffic transmission.',
          'Drive formatting in progress.',
          'Ransomware encryption.',
          'Unplugged cable.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Dark link LEDs signal dead cables, disabled NICs, or unpatched ports.',
          'Incorrect: False.',
          'Incorrect: False.',
          'Incorrect: Dark when unplugged.',
        ],
        takeaway: 'Check link/activity lights early on every wired outage.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Diagnose Wall-Jack VLAN / PoE & Scope Flowcharts',
      targetTab: 'simulator',
      instructions: [
        'Run the Network Closet / VLAN & PoE Desk Move scenario inside the Service Desk Simulator.',
      ],
      verificationCheck: '4/4 simulator score.',
    },

    summaryBullets: [
      'Scope outages fast: 1 PC vs 1 Wing/Switch vs Whole Site/ISP vs 1 Website.',
      'Patch panels neatly terminate permanent wall cables for short switch patch cords.',
      'Wrong VLANs block internal servers even when link lights glow green.',
      'PoE supplies power + data over Ethernet to VoIP phones and Wi-Fi APs.',
      'Keep network closets tidy/labeled and never modify switch configs without authorization.',
    ],

    sourcesToVerify: [
      'CompTIA Network+ — Physical Infrastructure, PoE & VLAN Concepts',
    ],
  },

  'itsup.5.2.1': {
    id: 'itsup.5.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 5: Identity and Access',
    topicTitle: '5.1–5.2 Identity Foundations & Directory Systems',
    code: '5.2.1',
    title: 'AuthN vs AuthZ, Account Types (Avoid Shared!), AD DS (DCs, OUs, ADUC), Microsoft Entra ID, Hybrid Joins & Okta / Google / JumpCloud',
    readMinutes: 13,
    prerequisites: ['4.6.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Distinguish Authentication (who you are) from Authorization (what you are permitted to do) and enforce Least Privilege via groups.',
      'Compare five enterprise account types (User, separate Admin, Service, avoided Shared/Generic, Guest) plus Joiner-Mover-Leaver stages.',
      'Explain Active Directory DS components: Domain, Domain Controller, OU, Security vs Distribution groups, `DOMAIN\\user` vs UPN, ADUC & AD PowerShell.',
      'Compare AD DS, Microsoft Entra ID, Hybrid device states (Domain/Entra/Hybrid joined/Registered), and alternatives (Okta, Google Workspace, JumpCloud, OpenLDAP).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Should We Share One `IT_Admin` Login Across Front Desk Staff?"',
      narrative:
        'A branch asks for one shared `"reception@"` login for three rotating temps, while new field laptops don’t appear in on-prem Active Directory. Knowing **AuthN vs AuthZ**, why **shared generic logins break audits**, and how **AD DS**, **Entra ID**, **Hybrid Join**, and **Okta/JumpCloud** fit together makes you clear from Day 1.',
    },

    plainEnglish: {
      analogyTitle: 'Showing Your Passport (AuthN) vs. Boarding Pass Class (AuthZ)',
      analogy:
        'Your passport proves *who you are* (**Authentication**); your boarding pass decides *where you may sit* (**Authorization**). Sharing one generic login among four people is like four drivers sharing one unmarked badge—nobody can audit who deleted payroll!',
      technicalDefinition:
        'Enterprise IAM separates credential proofing (AuthN) from group-driven access control (AuthZ) across on-premises directories (AD DS), cloud IdPs (Entra ID, Okta, Google Workspace, JumpCloud, OpenLDAP), and hybrid sync.',
      paragraphs: [
        'Five account types: **Standard User**, **Separate Admin** (never browse email with it!), **Service Account**, **Guest Account**, and **Shared/Generic (AVOID—use individual logins + Shared Mailbox!)**.',
        '**AD DS** uses Domain Controllers + Organizational Units (OUs) managed in **ADUC** or AD PowerShell (`CORP\\user` or UPN `user@corp.com`). Remember: **Security Groups** grant permissions; **Distribution Groups** only forward email!',
        '**Microsoft Entra ID** is cloud identity (often **Hybrid** synced from AD DS), alongside Okta, Google Workspace, JumpCloud, and OpenLDAP.',
      ],
    },

    deepDive: {
      intro: 'Compare directory types, device join states, and group-based authorization.',
      steps: [
        {
          step: '01',
          title: 'Active Directory DS & ADUC / PowerShell',
          explanation:
            'Handle daily resets, unlocks, group adds, and OU moves in **ADUC**, or bulk automation in **AD PowerShell**.',
        },
        {
          step: '02',
          title: 'Four Device States',
          explanation:
            'Domain Joined (on-prem AD), Entra Joined (cloud-native), Hybrid Joined (both AD + Entra), Registered (BYOD).',
        },
        {
          step: '03',
          title: 'Security vs. Distribution & Least Privilege',
          explanation:
            'Assign folder/app permissions purely to **Security Groups** (never directly to users) matching **Least Privilege** across Joiner-Mover-Leaver.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Hybrid Identity Architecture: AD DS <-> Entra ID',
        asciiFallback: `[On-Prem AD DS (DCs + OUs + ADUC)] --(Sync)--> [Microsoft Entra ID / Okta / Cloud IdP]`,
      },
      workedExample: {
        title: 'Replacing a Shared Front-Desk Login Safely',
        context: 'Three receptionists share one `frontdesk@` password.',
        steps: [
          'Provision 3 individual standard logins using Least Privilege.',
          'Grant a Security Group holding all 3 staff access to a single `reception@` **Shared Mailbox**.',
        ],
        outcome: 'Clean personal auditing with zero shared passwords and zero extra mailbox license cost.',
      },
    },

    supportWalkthrough: {
      intro: 'Identify whether on-prem AD DS or cloud Entra ID is the authoritative source of truth first.',
      steps: [
        {
          phase: 'Check Source of Truth',
          action: 'In synced hybrid environments, edit attributes in on-prem ADUC so cloud sync doesn’t overwrite cloud edits.',
          whyItWorks: 'Avoids mystery reverts every 30 minutes.',
        },
      ],
      questionsToAsk: [
        '"Are you signing in with `DOMAIN\\username` or `user@company.com`?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining Least Privilege warmly',
          sayThis:
            '"Least privilege ensures every account holds only what its role genuinely needs, limiting blast radius if a password is ever phished."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Identity & Access -> Group & Shared Mailbox Setup',
        priorityFormula: 'Impact: Medium (3 staff) × Urgency: Low = P4 Low',
        internalNotes: `[ACTION] Created 3 individual standard accounts + SG-Reception security group linked to reception@ Shared Mailbox (eliminated shared login risk).`,
        customerReply:
          'Hi Maya — Each receptionist now has an individual login tied cleanly to the single reception@ shared inbox—convenient and secure!',
        escalationCriteria: 'Escalate AD <-> Entra directory sync stalls to L2 Systems.',
      },
    },

    commonTraps: [
      {
        trap: 'Adding users to a **Distribution Group** expecting shared-folder NTFS access.',
        reality: 'Distribution lists only route email; permissions require **Security Groups**.',
      },
      {
        trap: 'Using an everyday **Global/Domain Admin** account to read email and browse the web.',
        reality: 'Separate Standard User and Admin accounts so a single phishing click cannot immediately compromise directory infrastructure.',
      },
    ],

    keyTerms: [
      {
        term: 'AuthN vs. AuthZ & Least Privilege',
        shortDef: 'Who you are (`AuthN`) vs. what you can access (`AuthZ`) at minimum required privilege.',
        fullDef: 'Foundation of secure directory governance.',
      },
      {
        term: 'AD DS, Entra ID & Alternatives',
        shortDef: 'On-prem Windows AD DS, cloud Entra ID (formerly Azure AD), plus Okta, Google Workspace, JumpCloud, OpenLDAP.',
        fullDef: 'Four device join states: Domain joined, Entra joined, Hybrid joined, Registered.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-521-q1',
        prompt: 'Why must a service desk avoid shared/generic logins like `reception_shared`?',
        options: [
          'Shared logins destroy audit accountability and break clean offboarding when one user leaves—use individual accounts + groups/shared mailboxes.',
          'Shared logins slow CPU clocks.',
          'AD limits usernames to 5 letters.',
          'Shared logins double electricity.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Individual accountability is essential for security and auditing.',
          'Incorrect: False.',
          'Incorrect: False.',
          'Incorrect: False.',
        ],
        takeaway: 'Never share generic user logins—use individual logins grouped onto shared mailboxes/folders.',
      },
      {
        id: 'itsup-521-q2',
        prompt: 'In Active Directory, how do Security Groups and Distribution Groups differ?',
        options: [
          'Security groups grant folder/app permissions; Distribution groups only route email lists.',
          'Distribution groups grant admin rights.',
          'Both assign NTFS permissions identically.',
          'Distribution groups are Linux-only.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Use Security Groups for permissions; Distribution lists for mail blasts.',
          'Incorrect: Reversed.',
          'Incorrect: Distribution lists have no access SID.',
          'Incorrect: Both live in AD/Exchange.',
        ],
        takeaway: 'Security Groups = permissions; Distribution Groups = email lists.',
      },
      {
        id: 'itsup-521-q3',
        prompt: 'What does Least Privilege require?',
        options: [
          'Granting only the minimum access needed to perform a user’s current job role.',
          'Giving everyone Domain Admin.',
          'Denying every request.',
          'Using 4-character passwords.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Minimizes accidental errors and breach blast radius.',
          'Incorrect: Unsafe.',
          'Incorrect: Unhelpful.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Least privilege = minimum permissions necessary for the job.',
      },
      {
        id: 'itsup-521-q4',
        prompt: 'Which list contains genuine directory/identity alternatives alongside Microsoft AD & Entra ID?',
        options: [
          'Okta, Google Workspace, JumpCloud, and OpenLDAP.',
          'HDMI, VGA, DisplayPort, USB4.',
          'POST, S.M.A.R.T., UEFI, BIOS.',
          'FAT32, exFAT, NTFS, APFS.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Widely used cloud and open-source directories.',
          'Incorrect: Video/bus interfaces.',
          'Incorrect: Firmware/disk health.',
          'Incorrect: File systems.',
        ],
        takeaway: 'Know AD DS, Entra ID, Okta, Google Workspace, JumpCloud, OpenLDAP.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Classify 5 Company Accounts & Design Group Access',
      instructions: [
        'Define allowed vs denied access for 5 sample accounts (Sales, Payroll, Helpdesk Tech, Service Account, External Guest) with zero shared logins.',
      ],
      verificationCheck: 'Separate admin accounts exist and all permissions route via Security Groups.',
    },

    summaryBullets: [
      'AuthN proves identity; AuthZ governs access via group-based Least Privilege.',
      'Separate User, Admin, Service, and Guest accounts; avoid Shared logins.',
      'AD DS organizes Users/Computers/Groups in Domains and OUs (`ADUC` & AD PowerShell).',
      'Security groups assign permissions; Distribution groups distribute mail.',
      'Know cloud/hybrid directories: Entra ID, Hybrid Join, Okta, Google Workspace, JumpCloud, OpenLDAP.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Active Directory DS & Microsoft Entra ID Fundamentals',
    ],
  },

  'itsup.5.3.1': {
    id: 'itsup.5.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 5: Identity and Access',
    topicTitle: '5.3–5.4 Account Resets, Trust Errors, MFA Fatigue, SSO & Passkeys',
    code: '5.3.1',
    title: 'Strict Caller Verification, Password/Lockout/Trust-Relationship Fixes & MFA (Number Matching, Fatigue, FIDO2, SSO, Conditional Access & Passkeys)',
    readMinutes: 13,
    prerequisites: ['5.1.1', '5.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Enforce multi-point identity verification (never trusting casual emails or unverified third-party asks) and use Change-at-Next-Login + SSPR safely.',
      'Distinguish lockouts from expired passwords, disabled accounts, expiry dates, and workstation Trust Relationship failures.',
      'Compare MFA factors (know/have/are), methods (Number Matching, OTP, SMS risk, FIDO2), and stop MFA Fatigue attacks.',
      'Explain SSO, Conditional Access, phone clock-drift breaking TOTP codes, Windows Hello, and passwordless passkeys.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Reset My Traveling Manager’s Password!" & "Workstation Trust Failed!"',
      narrative:
        'An assistant begs for a password reset for their traveling manager; a sabbatical returnee hits `"The trust relationship between this workstation and the domain failed"`; and an engineer sees 14 rapid midnight MFA prompts (**MFA Fatigue**). Holding verification boundaries and diagnosing trust/MFA cleanly protects the company.',
    },

    plainEnglish: {
      analogyTitle: 'Bank Teller Checking Two IDs + Synchronized Secret Handshake',
      analogy:
        'A teller never unlocks an executive’s vault on an assistant’s unverified say-so. Meanwhile, a **Domain Trust failure** simply means an offline laptop’s hidden computer-account handshake drifted out of sync with the Domain Controller—rejoining refreshes the handshake!',
      technicalDefinition:
        'Operational identity support enforces out-of-band proofing before resets, isolates machine-channel trust drift from account locks, and manages SSO, Conditional Access, and phishing-resistant MFA (FIDO2/passkeys/number matching).',
      paragraphs: [
        'Always verify identity per policy (employee ID, manager/HR callback, enrolled device prompt) before resets; require change at next login; promote **Self-Service Password Reset (SSPR)**.',
        'Fix `"trust relationship between this workstation and the domain failed"`: check clock & DC/VPN path -> sign in local admin -> reset machine password / unjoin-rejoin domain.',
        'Coach users on **MFA Fatigue** (unexpected push prompts = password ALREADY stolen! Deny, reset password, revoke tokens!) and fix **wrong phone clocks** breaking 6-digit TOTP codes!',
      ],
    },

    deepDive: {
      intro: 'Handle verification, directory states, trust errors, and modern MFA cleanly.',
      steps: [
        {
          step: '01',
          title: 'Account Flags & Trust Relationship',
          explanation:
            'Check Locked, Expired Password, Disabled, Account Expiration Date (contractors!), and Conditional Access. For Trust Relationship errors, verify network path + clock -> repair secure channel or rejoin.',
        },
        {
          step: '02',
          title: 'MFA Fatigue, Lost Phones & SSO Outages',
          explanation:
            'Prefer Number Matching, FIDO2 keys, and Windows Hello / Passkeys over SMS. On lost phones, complete high-bar ID verification before re-registering MFA. If many SSO apps drop at once, suspect the central IdP.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'MFA Fatigue & Workstation Trust Repair',
        asciiFallback: `Unexpected MFA Push -> Password ALREADY Compromised! -> DENY -> Reset Password -> Revoke Sessions!
Trust Failed        -> Local Admin + Sync Clock/DC    -> Repair Secure Channel / Rejoin Domain`,
      },
      workedExample: {
        title: 'Refusing Third-Party Reset & Fixing Lost Phone + TOTP Drift',
        context: 'Assistant requests manager reset; traveler’s 6-digit TOTP codes fail after crossing time zones.',
        steps: [
          'Politely refuse manager reset via third party -> require direct HR/registered-callback verification.',
          'Traveler synced phone Date & Time to Automatic -> 6-digit TOTP codes matched immediately!',
        ],
        outcome: 'Zero social engineering bypass; traveler back in within 2 minutes.',
      },
    },

    supportWalkthrough: {
      intro: 'Never bend verification policies for third-party urgency or casual emails.',
      steps: [
        {
          phase: 'Never Read Temp Passwords in Public',
          action: 'Use approved private delivery channels and require change on first sign-in.',
          whyItWorks: 'Protects temporary credentials from eavesdropping.',
        },
      ],
      questionsToAsk: ['"Is your phone’s clock set to Automatic time sync?"'],
      sampleUserWording: [
        {
          situation: 'Declining a third-party password reset kindly',
          sayThis:
            '"Security policy requires verifying directly with the account owner on their registered phone or approved escalation before resetting passwords."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Identity & Access -> MFA Recovery & Trust Fix',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High = P2 High',
        internalNotes: `[VERIFICATION] Verified user via registered callback + manager confirmation. Cleared lost-phone MFA method and enrolled Number Matching cleanly.`,
        customerReply: 'Hi Taylor — Your new phone’s Authenticator app is now enrolled cleanly!',
        escalationCriteria: 'Escalate confirmed MFA fatigue attacks straight to InfoSec.',
      },
    },

    commonTraps: [
      {
        trap: 'Telling a user getting midnight MFA prompts to "tap Approve so it stops buzzing."',
        reality: 'Unexpected prompts mean their password is stolen—Deny, Reset Password, Revoke Sessions!',
      },
      {
        trap: 'Resetting an executive’s password or MFA device because an assistant or urgent caller asked without formal verification.',
        reality: 'Pretexting attackers impersonate assistants and managers—always verify identity out-of-band per company policy.',
      },
    ],

    keyTerms: [
      {
        term: 'Trust Relationship Failure',
        shortDef: 'Workstation computer-account password desynced from Domain Controller.',
        fullDef: 'Fixed by syncing clock/DC network and repairing channel or rejoining.',
      },
      {
        term: 'MFA Fatigue, Number Matching & FIDO2',
        shortDef: 'Spamming approval pushes (Fatigue), mitigated by Number Matching, FIDO2 keys & passkeys.',
        fullDef: 'Combine with Conditional Access & SSO.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-531-q1',
        prompt: 'A caller asks you to reset their traveling manager’s password because the manager is unavailable. What do you do?',
        options: [
          'Politely decline—follow direct identity verification or formal escalation rather than resetting on an unverified third-party request.',
          'Reset it right away and give the caller the password.',
          'Disable MFA.',
          'Hang up silently.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Prevents pretexting social engineering.',
          'Incorrect: Severe breach risk.',
          'Incorrect: Weakens security.',
          'Incorrect: Unprofessional.',
        ],
        takeaway: 'Never reset credentials or MFA via unverified third-party callers.',
      },
      {
        id: 'itsup-531-q2',
        prompt: 'A user receives 10 unexpected MFA approval prompts at midnight while asleep. What does that indicate?',
        options: [
          'An attacker already holds their valid password (MFA Fatigue)—deny, immediately reset password, revoke tokens, and alert Security.',
          'Windows Update is checking disk space.',
          'Tap Approve once to quiet it.',
          'Normal night maintenance.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Push prompts fire only AFTER valid password entry.',
          'Incorrect: False.',
          'Incorrect: Lets attacker in!',
          'Incorrect: False.',
        ],
        takeaway: 'Unexpected MFA prompts = stolen password -> Deny, Reset, Revoke, Report!',
      },
      {
        id: 'itsup-531-q3',
        prompt: 'A returned remote laptop says "The trust relationship between this workstation and the domain failed." What happened?',
        options: [
          'The laptop’s computer-account domain password drifted out of sync with the Domain Controller and needs channel repair or domain rejoin.',
          'Monitor cable came loose.',
          'User lacks an Office license.',
          'Chrome needs an update.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Repair secure channel or rejoin domain once clock & DC line of sight are restored.',
          'Incorrect: Display OK.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Trust relationship failure = computer password desynced from DC.',
      },
      {
        id: 'itsup-531-q4',
        prompt: 'Every 6-digit authenticator TOTP code fails after travel even with the right phone. What setting commonly breaks TOTP?',
        options: [
          'The phone’s clock drifted out of automatic network time sync.',
          'Screen brightness.',
          'Browser choice.',
          'Bluetooth enabled.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: TOTP codes depend strictly on UTC clock alignment.',
          'Incorrect: Irrelevant.',
          'Incorrect: Irrelevant.',
          'Incorrect: Irrelevant.',
        ],
        takeaway: 'Set phone Date & Time to Automatic if 6-digit TOTP codes reject.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Handle Lost MFA Phone, Clock Drift & Trust Relationship',
      targetTab: 'simulator',
      instructions: [
        'Run both the Lost-Phone MFA Clock Drift scenario AND Domain Trust Relationship scenario in the Service Desk Simulator.',
      ],
      verificationCheck: '4/4 scores with zero premature MFA resets.',
    },

    summaryBullets: [
      'Enforce policy verification before every reset or MFA swap.',
      'Inspect locked, expired, disabled, account-expiration, and Conditional Access states.',
      'Repair "trust relationship failed" errors by syncing clock/DC network and repairing/rejoining domain.',
      'Prefer Number Matching, FIDO2, Windows Hello, and Passkeys; treat MFA fatigue as a password breach.',
      'Suspect central IdP SSO outages when multiple SaaS apps reject login together.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Domain Trust Repair & Entra ID Authentication Methods',
    ],
  },

  'itsup.5.5.1': {
    id: 'itsup.5.5.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 5: Identity and Access',
    topicTitle: '5.5–5.8 Access Approvals, GPO, JML Lifecycle & Sign-In Patterns',
    code: '5.5.1',
    title: 'Access Requests & Separation of Duties, Group Policy (`gpresult`), Joiner / Mover (Privilege Creep!) / Involuntary Leaver Checklists & Browser vs Desktop Auth Loops',
    readMinutes: 13,
    prerequisites: ['5.1.1', '5.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Process access requests properly (manager/owner approval, group assignment, Separation of Duties checks, refusing unapproved requests).',
      'Diagnose why a GPO didn’t apply (`gpupdate /force`, `gpresult /r`, wrong OU, off VPN/no DC reachability).',
      'Execute clean Joiner, Mover (add new AND remove old to stop privilege creep!), and Leaver checklists (including immediate involuntary termination!).',
      'Resolve the "works in browser, fails in desktop app" stale-token loop via sign-out + Windows Credential Manager.',
    ],

    whyThisMatters: {
      scenarioTitle: '"She Left Sales Months Ago—Why Can She Still Open Sales Commissions?"',
      narrative:
        'A former Sales rep who moved to HR keeps all Sales folders (**privilege creep!**), desktop Outlook loops passwords while webmail works, and a laptop in the wrong OU misses firewall GPOs. Clean JML lifecycles, SoD checks, `gpresult /r`, and token resets close every gap.',
    },

    plainEnglish: {
      analogyTitle: 'Returning Old Dept Keys on Promotion + Refreshing Stale App Badges',
      analogy:
        'If you transfer from Warehouse to Accounting without handing back your old keycard, you accumulate building keys forever (**privilege creep**)! Meanwhile, when webmail opens cleanly while desktop Outlook loops passwords, the server loves you—your desktop app is simply holding a stale expired badge (**Windows Credential Manager**)!',
      technicalDefinition:
        'Identity governance pairs approval-gated group provisioning and Segregation of Duties with OU-scoped GPO debugging (`gpresult /r`), Joiner/Mover/Leaver checklists, and endpoint token cleanup.',
      paragraphs: [
        'Access workflow: formal request -> manager/owner approval -> verify **Separation of Duties** -> add **Security Group** -> user signs out/back in for fresh token.',
        '**Joiner** (before Day 1!), **Mover** (+new AND -old!), **Leaver** (**Disable** immediately—never Delete at once! Reset password, revoke sessions/MFA, preserve/handover data, recover hardware; **for involuntary leavers, execute at the exact moment of notice!**).',
        'Check **Group Policy** via `gpupdate /force` and `gpresult /r` (OU + DC reachability). Check **Entra Sign-in Logs**, **Security Event Viewer**, and **ADUC** on stubborn auth loops.',
      ],
    },

    deepDive: {
      intro: 'Review JML checklists, GPO checks, and the 4 identity troubleshooting patterns.',
      steps: [
        {
          step: '01',
          title: 'Joiner / Mover / Involuntary Leaver Discipline',
          explanation:
            'Pre-provision Joiners cleanly; strip old groups from Movers; disable (don’t delete!) Leavers, revoke refresh tokens & MFA immediately for involuntary exits, convert mailbox per legal policy, reclaim laptops.',
        },
        {
          step: '02',
          title: 'GPO & Sign-In Pattern Matrix',
          explanation:
            'GPO missed? Run `gpresult /r` and check OU + VPN. Browser works / desktop fails? Sign out + clear Windows Credential Manager.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'JML Lifecycle & Browser-vs-Desktop Loop',
        asciiFallback: `[JOINER before Day 1] -> [MOVER: +New AND -Old Groups] -> [LEAVER: Disable + Revoke Sessions]
Web works / Desktop app fails? ---> Clear Stale Cache / Windows Credential Manager!`,
      },
      workedExample: {
        title: 'Refusing Unapproved Access + Clearing Outlook Auth Loop',
        context: 'Intern asks for Finance payroll without manager approval; rep signs into OWA fine while desktop Outlook loops.',
        steps: [
          'Held payroll request Pending Resource Owner written approval + SoD check.',
          'Cleared cached Office tokens in Windows Credential Manager -> desktop Outlook synced instantly.',
        ],
        outcome: 'Payroll stayed compliant and desktop Outlook resumed in 3 minutes.',
      },
    },

    supportWalkthrough: {
      intro: 'Never delete a departing user on termination day—disable, revoke, convert, retain.',
      steps: [
        {
          phase: 'Sign-Out After Group Change',
          action: 'Tell users added to new folder groups to sign out/in or reconnect VPN.',
          whyItWorks: 'Refreshes Kerberos/Entra group tokens immediately.',
        },
      ],
      questionsToAsk: ['"Does the web browser version sign in cleanly right now?"'],
      sampleUserWording: [
        {
          situation: 'Explaining why manager approval is mandatory',
          sayThis:
            '"To satisfy security audits, I just need your manager’s quick Approved reply on this ticket before adding the Finance group!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Identity & Access -> Involuntary Offboarding',
        priorityFormula: 'Impact: High (Security) × Urgency: High = P1 Critical',
        internalNotes: `[CHECKLIST] HR involuntary termination notice 14:02 -> AD & Entra accounts DISABLED (retained), password scrambled, Entra sessions & MFA revoked, groups stripped, hardware flagged for pickup.`,
        customerReply: 'Hi HR Team — All immediate offboarding lockouts and session revocations completed cleanly within 5 minutes of notice.',
        escalationCriteria: 'Escalate active suspicious downloads after termination notice straight to InfoSec.',
      },
    },

    commonTraps: [
      {
        trap: 'Clicking Delete instead of Disable on termination day.',
        reality: 'Breaks SID trails and triggers irreversible data loss timers—always Disable, Revoke, Retain first.',
      },
      {
        trap: 'Granting a newly added Security Group and wondering why "Access Denied" persists 30 seconds later.',
        reality: 'Existing Windows/Entra sign-in tokens cache old group memberships—have the user sign out and sign back in (or reconnect VPN) to mint a fresh token.',
      },
    ],

    keyTerms: [
      {
        term: 'Separation of Duties & Privilege Creep',
        shortDef: 'Preventing single-person control (`SoD`) and leftover Mover permissions (`Privilege Creep`).',
        fullDef: 'Enforced through approvals and Mover cleanup.',
      },
      {
        term: '`gpresult /r`',
        shortDef: 'Command verifying applied Group Policies and exact computer/user OU.',
        fullDef: 'Pairs with `gpupdate /force` when debugging missing GPO settings.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-551-q1',
        prompt: 'A user signs into M365 cleanly in the web browser yet desktop Outlook keeps asking for a password. Where do you start?',
        options: [
          'Since web sign-in works, clear stale desktop tokens: sign out, clear Windows Credential Manager, or rebuild the Outlook profile.',
          'Delete their AD account.',
          'Disable Conditional Access globally.',
          'Swap the motherboard.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Browser success isolates the glitch cleanly to stale local desktop cache/credentials.',
          'Incorrect: Destructive.',
          'Incorrect: Unsafe.',
          'Incorrect: Hardware fine.',
        ],
        takeaway: 'Works in browser, fails in app = stale desktop token / Credential Manager!',
      },
      {
        id: 'itsup-551-q2',
        prompt: 'Why disable (rather than immediately delete) a departing employee’s account during offboarding?',
        options: [
          'Disabling plus revoking sessions/MFA blocks access cleanly while preserving data retention and audit history.',
          'Deleting emails every client.',
          'AD blocks deletions.',
          'Unrelated.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Disable -> scramble password -> revoke tokens/MFA -> hand over/retain data.',
          'Incorrect: False.',
          'Incorrect: False.',
          'Incorrect: False.',
        ],
        takeaway: 'Never delete leavers prematurely—Disable, Revoke, Retain.',
      },
      {
        id: 'itsup-551-q3',
        prompt: 'A moved employee still opens confidential files from their previous department months later. What went wrong?',
        options: [
          'Mover privilege creep—new permissions were added without removing old role groups.',
          'Fast Startup.',
          'Split-tunnel DNS.',
          'BitLocker expired.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Always pair +new groups with -old group removal.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Mover workflow = add new AND remove old access.',
      },
      {
        id: 'itsup-551-q4',
        prompt: 'Which command displays applied Group Policies and current OU membership to debug a missing GPO?',
        options: [
          'gpresult /r',
          'chkdsk /f',
          'netstat -ano',
          'arp -a',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Shows applied/filtered GPOs and OU.',
          'Incorrect: Disk.',
          'Incorrect: Sockets.',
          'Incorrect: MAC cache.',
        ],
        takeaway: 'Check `gpresult /r` + DC reachability whenever GPOs fail to apply.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Run GPO Troubleshooting & Offboarding Scenarios',
      targetTab: 'simulator',
      instructions: [
        'Run INC-3088 (Group Policy OU mismatch), REQ-1061 (Onboarding), and the Domain Trust / Offboarding ticket in the Simulator.',
      ],
      verificationCheck: '4/4 scores across all three identity scenarios.',
    },

    summaryBullets: [
      'Enforce manager/owner approval + Separation of Duties before adding Security Groups.',
      'Users added to new groups must sign out/back in for fresh access tokens.',
      'Debug GPO misses via `gpupdate /force`, `gpresult /r`, OU placement, and DC/VPN connectivity.',
      'Run full Joiner, Mover (strip old!), and Involuntary Leaver (disable + revoke immediately) checklists.',
      'Web works / Desktop fails = clear Windows Credential Manager / stale app token.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Group Policy (`gpresult`), Offboarding & Windows Credential Manager',
    ],
  },
};
