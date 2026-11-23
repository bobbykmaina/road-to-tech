import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT4_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.core.svc.dns': {
    id: 'ccna.core.svc.dns',
    moduleId: 'ccna',
    unitTitle: 'Unit 4: Network Services and Security',
    topicTitle: 'DNS Operations & Record Diagnostics',
    code: '4.4.1',
    title: 'DNS Name Resolution, Hierarchy & Record Diagnostics (A, AAAA, CNAME, MX, NS, PTR)',
    readMinutes: 12,
    prerequisites: ['IPv4 Subnetting', 'IPv6 Addressing'],
    versionScope: 'shared',
    v11ExamTopics: ['4.3 Explain the role of DHCP and DNS within the network'],
    v20ExamTopics: ['4.4 Diagnose DNS records (A, AAAA, CNAME, MX, NS, PTR)'],

    learningObjectives: [
      'Trace the step-by-step Domain Name System (DNS) resolution chain from local browser cache to recursive resolver, root server, TLD server, and authoritative nameserver.',
      'Explain why DNS uses UDP port 53 for standard short queries and switches to TCP port 53 for zone transfers and large responses.',
      'Differentiate the six essential DNS record types (`A`, `AAAA`, `CNAME`, `MX`, `NS`, and `PTR`) and spot misconfigurations in zone tables.',
      'Diagnose real DNS outages using `nslookup` and `dig` outputs when `ping 8.8.8.8` succeeds but hostnames fail.',
    ],

    whyThisMatters: {
      scenarioTitle: '"The Whole Internet Is Down" — Yet Slack Calls and Direct IP Pings Still Work',
      narrative:
        'At 9:10 AM a frantic ticket lands in your queue: "Every website in Chrome says DNS_PROBE_FINISHED_NXDOMAIN, nobody can open the ERP portal, and external mail stopped!" You open a terminal and `ping 8.8.8.8` — zero packet loss! Immediately you know Layer 1, switching, DHCP IP assignment, and Layer 3 default routing are all healthy; the phonebook itself is broken. Whether an internal recursive resolver crashed, an `A` record points to a retired server IP, or a missing `MX` priority breaks inbound email, reading DNS records cleanly resolves half of "network outages" in under five minutes.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Calling Directory Assistance to Look Up a Friend’s Street Address',
      analogy:
        'Humans remember friendly names like `portal.acme.com`, while routers and switches forward packets strictly using numeric IP addresses like `198.51.100.42`. The Domain Name System (DNS) works like an organized global phonebook system. When you ask your local recursive resolver ("directory operator") for `www.cisco.com`, the operator checks its sticky-note cache first. If missing, it asks a global Root operator (`.`): "Who handles `.com`?" The Root points to `.com` (Top-Level Domain server). The `.com` server points to Cisco’s authoritative Nameserver (`NS`), which finally hands back the official `A` or `AAAA` address.',
      technicalDefinition:
        'The Domain Name System (DNS) is a hierarchical, distributed naming database defined in RFC 1034 and RFC 1035. Clients send queries over UDP port 53 (or TCP port 53 when payloads exceed standard UDP size or during AXFR/IXFR zone transfers) to a recursive resolver, which walks Root (`.`), Top-Level Domain (TLD), and Authoritative Nameserver delegations to return resource records (`A`, `AAAA`, `CNAME`, `MX`, `NS`, `PTR`) cached until their Time-to-Live (TTL) expires.',
      paragraphs: [
        'Complete beginners frequently confuse **DHCP** (which leases an endpoint its own IP address, subnet mask, default gateway, and DNS server address) with **DNS** (which translates hostnames into IP addresses). Even if a PC receives a valid IP from DHCP, if the DNS server option points to a dead IP—or a firewall blocks UDP/TCP port 53—web browsing fails completely while numeric IP pings succeed.',
        'Every DNS record lives inside a **zone file** on an authoritative server and carries a **TTL (Time-to-Live)** measured in seconds. A short TTL (like `300` seconds) tells recursive resolvers to refresh quickly during planned server migrations; a long TTL (like `86400` seconds = 24 hours) reduces query load when servers rarely move.',
        'Notice the strict distinction between forward and reverse records: **Forward lookup** translates a hostname into an IP (`A` for IPv4 32-bit addresses, `AAAA` for IPv6 128-bit addresses). **Reverse lookup** (`PTR` pointer record inside `in-addr.arpa` or `ip6.arpa`) translates an IP back into a hostname, heavily relied upon by spam filters and logging tools.',
      ],
    },

    deepDive: {
      intro:
        'Follow the exact lookup path for a brand-new hostname query and inspect how each of the six exam-critical DNS record types functions.',
      steps: [
        {
          step: 'Step 1',
          title: 'Local Hosts File & Stub Resolver Cache',
          explanation:
            'Before sending a single packet on the wire, your operating system checks its local memory DNS cache and static `hosts` file (`C:\\Windows\\System32\\drivers\\etc\\hosts` or `/etc/hosts`). Only a cache miss triggers an outbound UDP port 53 query toward the configured recursive DNS server.',
        },
        {
          step: 'Step 2',
          title: 'Iterative Hierarchy: Root (.) -> TLD (.com) -> Authoritative NS',
          explanation:
            'If the corporate or ISP recursive resolver does not have `api.example.com` cached, it starts at one of the 13 logical Root Server clusters, which refers it to the `.com` TLD server, which in turn returns the `NS` (Nameserver) glue pointing to `ns1.example.com`.',
        },
        {
          step: 'Step 3',
          title: 'Resource Record Types (`A`, `AAAA`, `CNAME`)',
          explanation:
            'An **`A` record** maps a FQDN directly to an IPv4 address (`web01.acme.com -> 203.0.113.10`). A **`AAAA` ("quad-A") record** maps a FQDN to an IPv6 address (`2001:db8::10`). A **`CNAME` (Canonical Name)** creates an alias pointing one hostname to another hostname (`www.acme.com -> edge.cdnprovider.net`), NEVER directly to an IP address.',
        },
        {
          step: 'Step 4',
          title: 'Routing Email & Zone Authority (`MX` and `NS`)',
          explanation:
            'An **`MX` (Mail Exchanger)** record tells sending mail servers which hostname accepts email for a domain (`acme.com MX 10 mail1.acme.com`). Lower numeric preference (`10`) wins over higher values (`20`). **`NS` (Name Server)** records identify which authoritative DNS servers own the zone—never point `MX` or `NS` targets to a `CNAME` alias (RFC rule).',
        },
        {
          step: 'Step 5',
          title: 'Reverse Lookups (`PTR`) & NXDOMAIN vs SERVFAIL',
          explanation:
            'A **`PTR` record** maps `10.113.0.203.in-addr.arpa` back to `mail1.acme.com`. During troubleshooting, **`NXDOMAIN`** means the authoritative server confirmed the name does not exist (typo or missing record), whereas **`SERVFAIL`** or **`timed out`** means the resolver could not reach the authoritative server or encountered a broken DNSSEC/zone config.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Recursive DNS Lookup Walk & Core Record Relationships',
        asciiFallback: `[Client PC] --(1. Recursive Query: www.acme.com? UDP/53)--> [Corporate Recursive Resolver]
                                                                  |  |  ^
   (2. Root . -> "Ask .com") <------------------------------------+  |  |
   (3. TLD .com -> NS: ns1.acme.com) <-------------------------------+  |
   (4. Authoritative ns1.acme.com -> CNAME/A: 203.0.113.10) <-----------+

Zone Table Cheat Sheet:
  acme.com.           IN  NS    ns1.acme.com.          (Authoritative zone owner)
  ns1.acme.com.       IN  A     203.0.113.5            (IPv4 glue address)
  mail1.acme.com.     IN  A     203.0.113.25           (IPv4 mail host)
  acme.com.           IN  MX 10 mail1.acme.com.        (Lowest number 10 = primary mail)
  www.acme.com.       IN  CNAME acme-cdn.example.net.  (Alias -> canonical hostname)
  25.113.0.203.in-addr.arpa. IN PTR mail1.acme.com.    (Reverse IP -> hostname)`,
      },
      workedExample: {
        title: 'Worked DNS Diagnostic: Inbound Email Fails After Website CDN Cutover',
        context:
          'A junior admin updated DNS records for `acme.com` while moving the website behind a cloud CDN. Immediately afterward, external customers receive bounce-back emails claiming `acme.com` has no valid mail destination, and `ping -6 ipv6.acme.com` fails.',
        steps: [
          'Inspect the zone excerpt:\n  `acme.com. IN MX 10 mail.acme.com.`\n  `mail.acme.com. IN CNAME edge.cloudcdn.net.`\n  `ipv6.acme.com. IN A 203.0.113.44`',
          'Spot Defect 1 (Broken MX target): `MX` points to `mail.acme.com`, which was mistakenly changed to a `CNAME` pointing to the web CDN! Mail servers expect `MX` targets to resolve cleanly to an `A` or `AAAA` record belonging to the actual SMTP gateway, not a web CDN alias.',
          'Spot Defect 2 (Wrong record type for IPv6): `ipv6.acme.com` carries an `A` record (`203.0.113.44` IPv4) rather than a `AAAA` record with the server’s `2001:db8::/64` IPv6 address.',
          'Remedy: Restore `mail.acme.com. IN A 203.0.113.25` (plus matching `25.113.0.203.in-addr.arpa IN PTR mail.acme.com.`) and add `ipv6.acme.com. IN AAAA 2001:db8:10::44`.',
        ],
        outcome:
          'Mail delivery resumes as soon as cached TTLs expire, and both IPv4 (`A`) and IPv6 (`AAAA`) lookups resolve accurately.',
      },
    },

    iosCliGuide: {
      intro:
        'Cisco IOS routers can act as DNS clients (for `ping` hostname lookups or NTP pools) or lightweight DNS forwarders, and `nslookup` verifies records directly from any workstation.',
      commands: [
        {
          title: 'Configure Cisco IOS Domain Lookup & DNS Name Server',
          promptAndCommand: `R1(config)# ip domain lookup
R1(config)# ip domain name acme.local
R1(config)# ip name-server 10.10.0.53`,
          output: `R1# show hosts
Default domain is acme.local
Name/address lookup uses domain service
Name servers are 10.10.0.53`,
          lineByLine: [
            { segment: 'ip domain lookup', meaning: 'Enables DNS resolution on IOS (sometimes disabled with `no ip domain-lookup` in isolated labs).' },
            { segment: 'ip domain name acme.local', meaning: 'Appends default suffix when typing unqualified short names like `ping srv01`.' },
            { segment: 'ip name-server 10.10.0.53', meaning: 'Sets the recursive DNS server IP the router queries over UDP port 53.' },
          ],
        },
        {
          title: 'Query Specific DNS Record Types with `nslookup`',
          promptAndCommand: `C:\\> nslookup -type=mx acme.com 10.10.0.53`,
          output: `Server:  dns01.acme.local
Address: 10.10.0.53

acme.com        MX preference = 10, mail exchanger = mail1.acme.com
acme.com        MX preference = 20, mail exchanger = mail2.acme.com
mail1.acme.com  internet address = 203.0.113.25`,
          lineByLine: [
            { segment: '-type=mx', meaning: 'Filters query to Mail Exchanger records (swap for `a`, `aaaa`, `cname`, `ns`, or `ptr`).' },
            { segment: 'MX preference = 10', meaning: 'Sending SMTP servers try lowest preference (`10`, `mail1`) before fallback (`20`, `mail2`).' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'nslookup portal.acme.com',
        healthyLabel: 'Healthy Resolution (Recursive Cached Answer)',
        healthyOutput: `Server:  dns01.acme.local
Address: 10.10.0.53

Non-authoritative answer:
Name:    edge.acme-lb.net
Address: 203.0.113.80
Aliases: portal.acme.com`,
        brokenLabel: 'Missing Record or Dead Resolver',
        brokenOutput: `*** dns01.acme.local can't find portal.acme.com: Non-existent domain
(OR: DNS request timed out. timeout was 2 seconds.)`,
        diagnosis:
          '`Non-authoritative answer:` is completely **normal**—it simply means your recursive resolver (`dns01.acme.local`) returned a valid cached copy rather than answering as the domain’s primary zone owner. `Non-existent domain` (`NXDOMAIN`) proves the DNS server answered and said the record is missing/typoed; `timed out` proves the client cannot reach UDP/TCP 53 on the configured resolver.',
      },
    },

    commonTraps: [
      {
        trap: 'Pointing a `CNAME` record directly to an IP address (`www -> 203.0.113.10`).',
        reality: 'A `CNAME` ONLY aliases one domain name to another domain name (`www.acme.com -> app.cloudhost.net`). Host-to-IP mappings require `A` (IPv4) or `AAAA` (IPv6).',
      },
      {
        trap: 'Assuming higher `MX` preference numbers have higher priority.',
        reality: 'Lower numeric preference wins in `MX` records: `MX 10` is primary; `MX 20` or `MX 50` are backups tried only if `10` is unreachable.',
      },
      {
        trap: 'Assuming DNS always uses UDP port 53 and never TCP port 53.',
        reality: 'Standard lookups use UDP/53, while DNS zone transfers (`AXFR`/`IXFR`) and oversized/DNSSEC responses fall back to TCP/53—blocking TCP 53 breaks secondary DNS sync.',
      },
      {
        trap: 'Confusing `NXDOMAIN` ("name does not exist") with network/routing failure.',
        reality: '`NXDOMAIN` means you successfully reached DNS over the network and got a valid negative reply; a routing or firewall block causes `timed out`.',
      },
    ],

    keyTerms: [
      {
        term: 'A / AAAA Record',
        shortDef: 'Forward DNS records mapping a hostname to an IPv4 (`A`) or IPv6 (`AAAA`) address.',
        fullDef: 'Core host address resource records: `A` stores a 32-bit IPv4 address; `AAAA` stores a 128-bit IPv6 address.',
      },
      {
        term: 'CNAME (Canonical Name)',
        shortDef: 'DNS alias mapping one hostname to another target hostname.',
        fullDef: 'Cannot coexist with other records at the zone apex and cannot point directly to a raw IP address.',
      },
      {
        term: 'MX (Mail Exchanger)',
        shortDef: 'Directs inbound email for a domain to designated mail servers ordered by lowest preference.',
        fullDef: 'Returns the hostname and numeric priority (`0–65535`, lowest tried first) of SMTP servers handling mail for a domain.',
      },
      {
        term: 'NS & PTR Records',
        shortDef: '`NS` delegates zone authority; `PTR` performs reverse IP-to-hostname lookups.',
        fullDef: '`NS` specifies authoritative nameservers for a DNS zone; `PTR` inside `.in-addr.arpa` or `.ip6.arpa` resolves an IP back to its verified hostname.',
      },
    ],

    checkQuestions: [
      {
        id: 'c44-q1',
        prompt: 'External partners report that inbound emails to `@acme.com` are bouncing, and the DNS zone shows two Mail Exchanger entries: `MX 10 mail-west.acme.com` and `MX 30 mail-east.acme.com`. Which server do sending MTAs try FIRST?',
        options: ['mail-west.acme.com (preference 10)', 'mail-east.acme.com (preference 30)', 'Round-robin equally across both', 'Whichever comes first alphabetically'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: In DNS `MX` records, the lowest preference value (`10`) has highest priority and is attempted first.',
          'Incorrect: Preference `30` is only used as a secondary fallback if `mail-west` is unreachable.',
          'Incorrect: Round-robin occurs only when multiple `MX` records share the exact same lowest preference.',
          'Incorrect: DNS mail routing uses explicit numeric preference values, not alphabetical order.',
        ],
        takeaway: 'In `MX` records, lowest numeric priority wins first.',
      },
      {
        id: 'c44-q2',
        prompt: 'A user can `ping 198.51.100.12` with 0% loss, but opening `https://erp.acme.local` fails with `NXDOMAIN` (`can\'t find erp.acme.local: Non-existent domain`). What is the most accurate diagnosis?',
        options: [
          'The recursive DNS server is reachable, and either the hostname was mistyped or its `A`/`CNAME` record is missing from DNS.',
          'The user’s default gateway is missing.',
          'Firewall UDP port 53 is blocking all traffic to the DNS server.',
          'The switch VLAN trunk between PC and router is down.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Receiving `NXDOMAIN` proves the DNS server responded over UDP 53—it simply has no matching record for `erp.acme.local`.',
          'Incorrect: `ping 198.51.100.12` succeeded, proving default gateway routing works.',
          'Incorrect: Blocking UDP 53 produces `DNS request timed out`, not an explicit `NXDOMAIN` reply.',
          'Incorrect: A down L2 trunk would break IP pings as well.',
        ],
        takeaway: '`NXDOMAIN` = DNS server answered and says the record doesn’t exist; `timed out` = transport/reachability failure.',
      },
      {
        id: 'c44-q3',
        prompt: 'Which DNS record type maps an IPv4 address (`203.0.113.25`) back to its canonical hostname (`mail1.acme.com`) for mail anti-spam verification?',
        options: ['PTR', 'CNAME', 'AAAA', 'NS'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `PTR` (Pointer) records live in `.in-addr.arpa` / `.ip6.arpa` zones to perform reverse IP-to-hostname lookups.',
          'Incorrect: `CNAME` aliases one hostname to another hostname.',
          'Incorrect: `AAAA` maps a hostname forward to a 128-bit IPv6 address.',
          'Incorrect: `NS` designates the authoritative nameserver for a domain zone.',
        ],
        takeaway: 'Forward IP = `A`/`AAAA`; Reverse IP -> Name = `PTR`.',
      },
      {
        id: 'c44-q4',
        prompt: 'When does DNS legitimately require TCP port 53 instead of UDP port 53?',
        options: [
          'Full zone transfers (`AXFR`) between primary/secondary DNS servers and large responses exceeding UDP packet limits',
          'Every single web browser lookup for an `A` record',
          'Only when translating IPv4 to MAC addresses via ARP',
          'Only for DHCPv4 DORA broadcasts',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Zone transfers (`AXFR`/`IXFR`) and oversized DNS responses (such as DNSSEC chains) require reliable TCP/53 connections.',
          'Incorrect: Routine client queries use connectionless UDP/53 for speed and low overhead.',
          'Incorrect: ARP operates at Layer 2 using broadcast frames, not DNS or TCP.',
          'Incorrect: DHCPv4 uses UDP ports 67 and 68.',
        ],
        takeaway: 'DNS uses UDP/53 for normal lookups and TCP/53 for zone transfers & truncated oversized replies.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'DNS Zone Audit & Reverse Record Drill',
      instructions: [
        'Trace a lookup for `intranet.branch.acme.com` through Root (`.`) -> `.com` -> `acme.com` NS -> `A` record and note what changes if its TTL is 60s vs 86400s.',
        'Audit this broken zone: `app IN A 2001:db8::5` and `www IN CNAME 192.0.2.10`—rewrite both lines with valid DNS record types.',
        'Open Mock Exam (CCNA) to test DNS & DHCP diagnostic scenarios under timed pressure.',
      ],
      verificationCheck: 'Identify all 6 record types (`A`, `AAAA`, `CNAME`, `MX`, `NS`, `PTR`) cleanly without confusing `CNAME` targets or `MX` preferences.',
    },

    summaryBullets: [
      'DNS resolves human names to numeric IP addresses recursively via Root (`.`) -> TLD -> Authoritative `NS` servers.',
      '`A` maps hostname -> IPv4; `AAAA` maps hostname -> IPv6; `CNAME` aliases hostname -> hostname (never raw IP).',
      '`MX` directs mail to target hostnames ordered by lowest numeric preference (`10` before `20`).',
      '`PTR` performs reverse IP-to-hostname lookups; `NS` declares authoritative nameservers for a zone.',
      '`NXDOMAIN` means the DNS server replied that the record is absent; `timeout` points to firewall/routing/port 53 blocks.',
    ],

    sourcesToVerify: [
      'RFC 1034 / RFC 1035 — Domain Names: Concepts, Facilities & Implementation',
      'Cisco IOS IP Addressing Services Configuration Guide — Configuring DNS',
    ],
  },

  'ccna.core.svc.nat-pat': {
    id: 'ccna.core.svc.nat-pat',
    moduleId: 'ccna',
    unitTitle: 'Unit 4: Network Services and Security',
    topicTitle: 'NAT & PAT on Cisco IOS XE',
    code: '4.3.1',
    title: 'Inside Source NAT (Static, Dynamic Pools & PAT Overload) Configuration & Verification',
    readMinutes: 13,
    prerequisites: ['IPv4 Subnetting', 'Routing Tables'],
    versionScope: 'shared',
    v11ExamTopics: ['4.1 Configure and verify inside source NAT using static and pools'],
    v20ExamTopics: ['4.3 Configure and verify NAT/PAT on IOS XE'],

    learningObjectives: [
      'Distinguish all four Cisco NAT address terms (`Inside Local`, `Inside Global`, `Outside Local`, `Outside Global`).',
      'Configure Static 1:1 NAT, Dynamic Pool NAT, and PAT Overload (`overload`) cleanly on Cisco IOS/IOS XE edge routers.',
      'Explain how PAT uses TCP/UDP source port numbers to share a single public IP across thousands of internal hosts.',
      'Troubleshoot missing `ip nat inside` / `ip nat outside` direction tags and ACL permit mismatches with `show ip nat translations` and `show ip nat statistics`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'A New Branch Router Can Ping the ISP, Yet 80 Staff PCs Cannot Browse the Web',
      narrative:
        'Imagine commissioning a branch edge router R1 connecting `192.168.10.0/24` LAN users to an ISP link `203.0.113.2/30`. From R1 itself, `ping 8.8.8.8` works! Yet every workstation hangs. Why? Because RFC 1918 private addresses (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) are unroutable on the public internet—ISP edge routers drop them silently. Without **PAT Overload** translating internal private IPs into R1’s public outside IP (`203.0.113.2`) plus unique port numbers—or if an engineer forgets `ip nat outside` on the WAN port—outbound internet dies instantly.',
    },

    plainEnglish: {
      analogyTitle: 'Think of an Office Switchboard Sharing One Public Phone Number with 500 Desk Extensions',
      analogy:
        'Inside your office building, 500 employees have private internal extensions like `x101`, `x102`, and `x204` (Private RFC 1918 IPs). Those extensions make zero sense to the city telephone company outside! So when Alice at `x101` dials a supplier outside, the front-desk receptionist (the NAT router) replaces her caller ID with the company’s single public phone number `555-0100` AND scribbles on a clipboard: "Outbound call using temp slot `:40001` belongs to Alice `x101`." When the supplier replies to `555-0100:40001`, the receptionist checks the clipboard and routes the call right back to `x101`. That port-clipboard trick is **PAT (Port Address Translation)**.',
      technicalDefinition:
        'Network Address Translation (NAT, RFC 3022) modifies IPv4 packet headers at an administrative boundary—typically translating private RFC 1918 `Inside Local` addresses into routable `Inside Global` public addresses. Static NAT maps one-to-one permanently; Dynamic Pool NAT maps one-to-one dynamically from a pool of public IPs; Port Address Translation (PAT / NAT Overload) maps many private hosts onto a single public IP simultaneously by tracking unique Layer 4 TCP/UDP source port numbers or ICMP query IDs.',
      paragraphs: [
        'Before touching CLI commands, lock down Cisco’s four NAT perspective terms. **Inside** = your enterprise network under your control; **Outside** = external networks like the internet; **Local** = the IP address seen on the inside network; **Global** = the IP address seen on the outside network.',
        'In 99% of exams and real troubleshooting: **`Inside Local`** = private PC IP before NAT (`192.168.10.50`); **`Inside Global`** = public IP representing that PC after NAT (`203.0.113.2`); **`Outside Global`** = real public server IP on the internet (`198.51.100.80`); **`Outside Local`** = usually identical to Outside Global unless doing destination NAT.',
        'Watch the subtle configuration rule beginners miss constantly: NAT will do **nothing** unless BOTH (1) every LAN-facing interface (or SVI/subinterface) carries `ip nat inside`, AND (2) the WAN-facing interface carries `ip nat outside`, AND (3) the referenced standard ACL `permit`s the inside local source subnet!',
      ],
    },

    deepDive: {
      intro:
        'Examine the three inside-source NAT modes in Cisco IOS XE and trace how packets rewrite headers going outbound and inbound.',
      steps: [
        {
          step: 'Mode 1',
          title: 'Static NAT (Permanent 1-to-1 Mapping)',
          explanation:
            'Command: `ip nat inside source static 192.168.10.25 203.0.113.10`. Reserves one dedicated public IP permanently for one internal server (e.g., an inbound DMZ web or VPN server) so outside users can initiate connections toward `203.0.113.10` at any time.',
        },
        {
          step: 'Mode 2',
          title: 'Dynamic Pool NAT (Temporary 1-to-1 Pool)',
          explanation:
            'Defines an ACL matching internal subnets plus `ip nat pool PUB_POOL 203.0.113.16 203.0.113.30 netmask 255.255.255.240`, bound with `ip nat inside source list 10 pool PUB_POOL` (NO `overload`). Once all 15 public IPs are leased simultaneously, the 16th user is dropped!',
        },
        {
          step: 'Mode 3',
          title: 'PAT Overload (Many-to-One via Interface or Pool)',
          explanation:
            'Adding `overload` (`ip nat inside source list 10 interface GigabitEthernet0/1 overload` or `... pool PUB_POOL overload`) enables Layer 4 source-port multiplexing (up to ~65,535 ports per IP!). If two inside hosts both choose source port `51000`, the router rewrites the second host’s Inside Global port to `51001` so return traffic never collides.',
        },
        {
          step: 'Order',
          title: 'IOS NAT vs Routing Order of Operations',
          explanation:
            'Crucial detail: for **Inside-to-Outside** packets, IOS checks **routing FIRST** (to confirm egress is `ip nat outside`) and applies inside source NAT afterward. For **Outside-to-Inside** return packets, IOS checks the **NAT table FIRST** (translating `Inside Global -> Inside Local`) and then routes the packet toward the LAN.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'PAT Overload Translation Lifecycle (RFC 1918 Inside Local -> Public Inside Global)',
        asciiFallback: `[PC-A 192.168.10.10:51000] --+
                              | (ip nat inside: G0/0)
[PC-B 192.168.10.11:51000] --+--> [R1 NAT Engine] --> (ip nat outside: G0/1 = 203.0.113.2) --> [Web 8.8.8.8:443]

R1 NAT Translation Table (show ip nat translations):
Pro   Inside global         Inside local          Outside local        Outside global
tcp   203.0.113.2:51000     192.168.10.10:51000   8.8.8.8:443          8.8.8.8:443
tcp   203.0.113.2:1024      192.168.10.11:51000   8.8.8.8:443          8.8.8.8:443  <-- Port collision avoided!`,
      },
      workedExample: {
        title: 'Worked IOS XE PAT Overload Deployment',
        context:
          'Branch R1 serves LAN `10.20.0.0/24` on `Gi0/0/0` and connects to the ISP via `Gi0/0/1` (`198.51.100.2/30`). Configure PAT overloading R1’s `Gi0/0/1` public IP, and leave `10.20.0.50` reachable from outside via dedicated `198.51.100.5` static NAT.',
        steps: [
          'Tag interface directions: `int gi0/0/0` -> `ip nat inside`; `int gi0/0/1` -> `ip nat outside`.',
          'Write standard ACL matching only the LAN: `ip access-list standard NAT_LAN` -> `permit 10.20.0.0 0.0.0.255`.',
          'Enable PAT Overload: `ip nat inside source list NAT_LAN interface GigabitEthernet0/0/1 overload`.',
          'Add Static 1:1 DMZ/host entry: `ip nat inside source static 10.20.0.50 198.51.100.5`.',
          'Verify using `show ip nat translations` while PCs browse and `show ip nat statistics` to confirm hits > 0 and misses = 0.',
        ],
        outcome:
          'All LAN users share `198.51.100.2` via unique TCP/UDP ports while `10.20.0.50` maps deterministically 1:1 to `198.51.100.5`.',
      },
    },

    iosCliGuide: {
      intro:
        'Practice configuring PAT Overload and diagnosing broken translations with Cisco’s two core `show ip nat` inspection commands.',
      commands: [
        {
          title: 'Configure Interface-Based PAT Overload on IOS XE',
          promptAndCommand: `R1(config)# interface GigabitEthernet0/0/0
R1(config-if)# ip nat inside
R1(config-if)# interface GigabitEthernet0/0/1
R1(config-if)# ip nat outside
R1(config)# ip access-list standard NAT_ACL
R1(config-std-nacl)# permit 192.168.10.0 0.0.0.255
R1(config)# ip nat inside source list NAT_ACL interface GigabitEthernet0/0/1 overload`,
          output: `R1# show ip nat translations
Pro  Inside global         Inside local         Outside local      Outside global
tcp  203.0.113.2:52410     192.168.10.12:52410  198.51.100.80:443  198.51.100.80:443
udp  203.0.113.2:61002     192.168.10.12:61002  8.8.8.8:53         8.8.8.8:53`,
          lineByLine: [
            { segment: 'ip nat inside / outside', meaning: 'Mandatory direction markers; missing either stops ALL translation silently.' },
            { segment: 'overload', meaning: 'Turns 1:1 dynamic NAT into N:1 PAT by multiplexing TCP/UDP ports.' },
            { segment: 'Inside global vs local', meaning: '`203.0.113.2` is public; `192.168.10.12` is private internal IP.' },
          ],
        },
        {
          title: 'Check NAT Pool Exhaustion & Hit Counters',
          promptAndCommand: `R1# show ip nat statistics`,
          output: `Total active translations: 42 (1 static, 41 dynamic; 41 extended)
Outside interfaces:
  GigabitEthernet0/0/1
Inside interfaces:
  GigabitEthernet0/0/0
Hits: 18420  Misses: 12
Expired translations: 309`,
          lineByLine: [
            { segment: 'extended', meaning: 'Indicates PAT entries tracking Layer 4 port numbers alongside IP addresses.' },
            { segment: 'Outside / Inside interfaces', meaning: 'Instantly verifies whether an engineer swapped or omitted `ip nat inside/outside`.' },
            { segment: 'Hits / Misses', meaning: 'Hits confirm packets matching active entries; growing `Dynamic mappings` misses indicate exhausted non-overload pools.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip nat statistics & show ip nat translations',
        healthyLabel: 'Healthy PAT Translations Active',
        healthyOutput: `Inside interfaces: GigabitEthernet0/0/0
Outside interfaces: GigabitEthernet0/0/1
Hits: 1450  Misses: 12  (Dynamic active: 28 extended)`,
        brokenLabel: 'Missing Direction / ACL / Overload Trap',
        brokenOutput: `Inside interfaces: [empty!]
Outside interfaces: GigabitEthernet0/0/1
Hits: 0  Misses: 0`,
        diagnosis:
          'When `Inside interfaces` or `Outside interfaces` is blank—or `NAT_ACL` has an inverted wildcard mask—zero NAT translations ever trigger (`Hits: 0`) and private IPs leak out to the ISP.',
      },
    },

    commonTraps: [
      {
        trap: 'Swapping `Inside Global` and `Outside Local` on CCNA exam exhibits.',
        reality: 'Remember `Inside` = your host (`Inside Local` = private, `Inside Global` = your host’s translated public IP). `Outside` = remote server (`Outside Global` = real remote public IP).',
      },
      {
        trap: 'Omitting `overload` on a single-IP pool or `ip nat inside source list 1 interface Gi0/1`.',
        reality: 'Without `overload`, only ONE internal host can talk at a time—every second host fails once the single public IP is occupied!',
      },
      {
        trap: 'Trying `clear ip nat translation *` fails or breaks active static NAT? Wait: dynamic entries clear cleanly, whereas static entries remain in config.',
        reality: 'Note: To modify an active dynamic NAT rule in IOS, you often must run `clear ip nat translation *` first because IOS blocks altering rules currently in use.',
      },
      {
        trap: 'Forgetting `ip nat inside` on newly added VLAN SVIs or router subinterfaces.',
        reality: 'Every internal VLAN subinterface (`Gi0/0.20`) or SVI (`interface Vlan20`) routing toward the outside link must individually carry `ip nat inside`.',
      },
    ],

    keyTerms: [
      {
        term: 'Inside Local',
        shortDef: 'Private IPv4 address assigned to an internal host before translation.',
        fullDef: 'Typically an RFC 1918 address (such as `192.168.10.12`) visible inside the enterprise LAN.',
      },
      {
        term: 'Inside Global',
        shortDef: 'Public routable IPv4 address representing an internal host to the outside network.',
        fullDef: 'Written into the source IP header by the NAT router as traffic exits toward the ISP.',
      },
      {
        term: 'PAT (Port Address Translation)',
        shortDef: 'Many-to-one NAT (`overload`) tracking Layer 4 source ports so thousands of hosts share one public IP.',
        fullDef: 'Mapped as "extended" entries in `show ip nat translations` pairing IP + TCP/UDP port.',
      },
      {
        term: 'NAT Pool',
        shortDef: 'Range of public `Inside Global` addresses allocated dynamically (`ip nat pool`).',
        fullDef: 'Can run 1:1 dynamic NAT without `overload` or multiplex multiple public IPs with `overload`.',
      },
    ],

    checkQuestions: [
      {
        id: 'c43-q1',
        prompt: 'An internal host `10.1.5.22` connects to public web server `198.51.100.40:443`. R1 translates `10.1.5.22` to `203.0.113.5:41002`. In Cisco NAT terminology, what is `203.0.113.5`?',
        options: ['Inside Global', 'Inside Local', 'Outside Global', 'Outside Local'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `203.0.113.5` is the public address representing your *inside* host to the *global* outside world (`Inside Global`).',
          'Incorrect: `Inside Local` is the untranslated private IP (`10.1.5.22`).',
          'Incorrect: `Outside Global` is the remote server’s public IP (`198.51.100.40`).',
          'Incorrect: `Outside Local` refers to the remote server’s IP as viewed inside the LAN.',
        ],
        takeaway: 'Your host’s private IP = Inside Local; your host’s translated public IP = Inside Global.',
      },
      {
        id: 'c43-q2',
        prompt: 'You configure `ip nat pool MYPOOL 203.0.113.10 203.0.113.12 netmask 255.255.255.248` and `ip nat inside source list 1 pool MYPOOL`. Only three users can reach the internet simultaneously while the fourth user times out. Why?',
        options: [
          'The `overload` keyword was omitted, so Dynamic NAT limits concurrent users to the 3 public IPs in the pool.',
          'The pool netmask must be `/32`.',
          'Static NAT is required before Dynamic NAT can work.',
          'TCP port 443 is incompatible with NAT pools.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Without `overload` (PAT), each internal host consumes one entire public IP (`203.0.113.10`, `.11`, `.12`), starving the 4th host.',
          'Incorrect: `/29` (`255.255.255.248`) correctly covers `.10–.12`.',
          'Incorrect: Dynamic NAT/PAT runs completely independently without Static NAT.',
          'Incorrect: PAT supports TCP, UDP, and ICMP cleanly.',
        ],
        takeaway: 'Without `overload`, a NAT pool supports only as many simultaneous hosts as public IPs in the pool.',
      },
      {
        id: 'c43-q3',
        prompt: 'What happens if an engineer configures the NAT ACL and `ip nat inside source list 1 interface Gi0/1 overload` correctly, puts `ip nat inside` on `Gi0/0`, but forgets `ip nat outside` on `Gi0/1`?',
        options: [
          'No NAT translations occur; packets exit `Gi0/1` with untranslated private source IPs and return traffic fails.',
          'IOS automatically detects the default route and enables `ip nat outside`.',
          'The router falls back to Static NAT automatically.',
          'The interface `Gi0/1` enters err-disabled state.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Both `ip nat inside` (ingress) and `ip nat outside` (egress) are mandatory before IOS executes NAT translation.',
          'Incorrect: IOS never auto-tags NAT interface directions.',
          'Incorrect: Static NAT also requires `ip nat inside` and `ip nat outside`.',
          'Incorrect: Missing a NAT command does not err-disable an Ethernet port.',
        ],
        takeaway: 'Always verify BOTH `Inside interfaces` AND `Outside interfaces` in `show ip nat statistics`.',
      },
      {
        id: 'c43-q4',
        prompt: 'Why might `clear ip nat translation *` be necessary during a NAT troubleshooting session?',
        options: [
          'Active dynamic/PAT translation entries persist in RAM until timeout and can block removing an ACL or pool change.',
          'It saves running-config to NVRAM startup-config.',
          'It restarts the OSPF process on WAN links.',
          'It upgrades an IOS XE router from Static NAT to IPv6.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IOS often rejects removing `ip nat pool` or `ip nat inside source` while dynamic entries remain cached in RAM; clearing active translations frees them.',
          'Incorrect: Saving config uses `copy running-config startup-config` or `write memory`.',
          'Incorrect: Clearing NAT state never touches OSPF.',
          'Incorrect: NAT clearing affects IPv4 translation table entries only.',
        ],
        takeaway: 'Run `clear ip nat translation *` to flush stale dynamic/PAT bindings before modifying NAT rules.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Configure & Verify PAT Overload on Edge Router R1',
      targetTab: 'labs',
      instructions: [
        'Trace packet headers on a 2-PC + 1-router WAN diagram: write down `Inside Local`, `Inside Global`, `Outside Local`, and `Outside Global` for an HTTPS flow.',
        'Practice tagging `ip nat inside` on LAN/SVI ports and `ip nat outside` on WAN ports.',
        'Inspect `show ip nat translations` vs `show ip nat statistics` in Exam Simulator NAT exhibits.',
      ],
      verificationCheck: 'Identify every NAT role accurately and spot missing `overload` or `ip nat inside/outside` errors on first glance.',
    },

    summaryBullets: [
      'NAT translates internal private RFC 1918 addresses (`Inside Local`) to routable public addresses (`Inside Global`).',
      'Static NAT maps 1:1 permanently; Dynamic Pool maps 1:1 from a range; PAT (`overload`) multiplexes thousands of hosts onto one public IP using L4 source ports.',
      'Every inside-facing routed/SVI interface needs `ip nat inside`, and the WAN interface needs `ip nat outside`.',
      'Standard ACLs referenced in `ip nat inside source list` define WHICH inside local hosts qualify for translation.',
      'Use `show ip nat translations` for live IP:port pairs and `show ip nat statistics` for pool exhaustion & interface direction checks.',
    ],

    sourcesToVerify: [
      'Cisco IOS XE IP Addressing Services Configuration Guide — Configuring NAT for IP Address Conservation',
      'RFC 3022 — Traditional IP Network Address Translator (Traditional NAT)',
    ],
  },

  'ccna.v11.4.2': {
    id: 'ccna.v11.4.2',
    moduleId: 'ccna',
    unitTitle: 'Unit 4: IP Services (v1.1)',
    topicTitle: '4.2 NTP Client & Server Mode',
    code: '4.2.1',
    title: 'Configuring & Verifying Network Time Protocol (NTP) Client/Server Mode',
    readMinutes: 10,
    prerequisites: ['Routing Tables & Forwarding'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['4.2 Configure and verify NTP operating in a client/server mode'],

    learningObjectives: [
      'Explain why synchronized clocks across routers, switches, and firewalls are essential for syslog correlation, Kerberos/MFA, and digital certificates.',
      'Describe the NTP Stratum hierarchy (`Stratum 0` atomic/GPS clocks down to `Stratum 15`, with `16` = unsynchronized).',
      'Configure a Cisco IOS router as an NTP client (`ntp server`), local authoritative fallback (`ntp master`), and peer.',
      'Interpret `show ntp associations` (`*` synchronized vs `~` configured) and `show ntp status` (`Clock is synchronized`).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Investigating a Breach When Firewall Logs Are 6 Hours Behind Switch Logs',
      narrative:
        'Imagine piecing together a midnight ransomware breach across three switches, a firewall, and an Active Directory domain controller. Switch S1 logged an intruder MAC address at `02:14:09`, while Core Router R1 logged the suspicious BGP flap at `08:13:55` because R1’s battery-backed clock drifted years ago—or was never pointed to an NTP server. Worse yet, certificates and Kerberos logins reject connections when clocks drift more than 5 minutes! Synchronizing every infrastructure device via **NTP** guarantees one unified timeline across the entire network.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Studio Crew Synchronizing Watches to One Atomic Master Clock',
      analogy:
        'Imagine filming a heist movie across five cameras in different rooms. If every camera operator guesses the time from their own wristwatch, editors can never splice the footage cleanly in order. Instead, everyone syncs to one official Master Timekeeper before rolling. In networking, **Stratum 0** is an atomic clock or GPS receiver. **Stratum 1** is the time server wired directly to that GPS antenna. Your core switch is **Stratum 2** (one hop away), and your access switch is **Stratum 3**. The lower the Stratum number, the closer you are to true atomic time.',
      technicalDefinition:
        'Network Time Protocol (NTP, RFC 5905) runs over **UDP port 123** to synchronize system clocks across packet-switched networks within milliseconds. NTP uses a hierarchical distance metric called **Stratum** (`1` to `15`, where `16` denotes unsynchronized), preferring lower Stratum sources and measuring round-trip network delay to compensate for latency.',
      paragraphs: [
        'Do not confuse **NTP Stratum** with Spanning-Tree or OSPF priority: in NTP, **lower Stratum = closer to the primary GPS/atomic source**. A Stratum 1 server is directly wired to a Stratum 0 clock; a router syncing from a Stratum 1 server advertises itself as Stratum 2.',
        'If an entire branch or lab is isolated from the internet without a GPS appliance, a core router can be configured with `ntp master [stratum]` (default stratum 8 if omitted, though engineers often pick `4` or `5`) so downstream switches have a steady local clock source.',
        'Always remember NTP operates over **UDP port 123**. Because synchronization performs statistical delay filtering over multiple poll intervals, initial sync (`*`) on real Cisco hardware can take 1–5 minutes—do not panic if `*` does not appear two seconds after pressing Enter!',
      ],
    },

    deepDive: {
      intro:
        'Walk through NTP hierarchy, packet transport, IOS configuration syntax, and reading symbol flags in `show ntp associations`.',
      steps: [
        {
          step: 'Step 1',
          title: 'The Stratum Hierarchy (0 through 15, Max 16)',
          explanation:
            'Stratum 0 = physical atomic/GPS hardware (never sends IP packets itself). Stratum 1 = primary network server attached directly to Stratum 0. Every downstream NTP hop increments Stratum by +1 up to `15`. Stratum `16` means the clock is unsynchronized/unusable.',
        },
        {
          step: 'Step 2',
          title: 'Client/Server Configuration & Source Loopback',
          explanation:
            'Use `ntp server 10.10.0.10 [prefer]` in global config. Best practice on multi-link routers is `ntp source Loopback0` so NTP queries use one stable IP regardless of which WAN link flaps.',
        },
        {
          step: 'Step 3',
          title: 'Optional Authentication & Local `ntp master`',
          explanation:
            'In lab or isolated environments, configure `ntp master 5` on a distribution router so it serves time as Stratum 5 even without upstream servers. Optional MD5/SHA key verification (`ntp authenticate`) prevents rogue time-spoofing attacks.',
        },
        {
          step: 'Step 4',
          title: 'Decoding `show ntp associations` Flags (`*` vs `+` vs `~`)',
          explanation:
            '`*` (asterisk) = currently selected system peer (synchronized!). `~` (tilde) = statically configured server (`ntp server`). `+` = healthy backup candidate; `-` = discarded outlier. Blank first column + `16` stratum means unreachable or still converging.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'NTP Stratum Hierarchy & UDP/123 Sync Flow',
        asciiFallback: `[GPS / Atomic Clock]  (Stratum 0 hardware)
         |
[Enterprise Time Srv] (Stratum 1 — pool/GPS server)
         |  UDP port 123
[Core Router R1]      (Stratum 2 — ntp server 10.10.0.10)
         |  UDP port 123
[Access Switch SW1]   (Stratum 3 — ntp server 10.10.1.1)`,
      },
      workedExample: {
        title: 'Worked NTP Client Verification on Switch SW1',
        context:
          'You point `SW1` at core router `R1` (`10.10.1.1`), which syncs from a corporate Stratum 1 server (`10.10.0.10`). Verify clock alignment.',
        steps: [
          'On R1: configure `ntp server 10.10.0.10` and `ntp source Loopback0`. R1 locks onto `10.10.0.10` (`st 1`) and becomes Stratum 2.',
          'On SW1: configure `ntp server 10.10.1.1` (and `clock timezone EST -5 0` + `service timestamps log datetime msec` so syslog uses local time!).',
          'Run `show ntp associations` on SW1: look for `*~10.10.1.1` (`*` synced, `~` configured) showing `st 2` in the reference column.',
          'Run `show ntp status`: verify line 1 prints `Clock is synchronized, stratum 3, reference is 10.10.1.1`.',
        ],
        outcome:
          'Every syslog message across R1 and SW1 now shares millisecond-accurate timestamps.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure NTP client/server mode and read the two essential verification commands.',
      commands: [
        {
          title: 'Configure & Verify NTP Client on IOS',
          promptAndCommand: `SW1(config)# ntp server 10.10.1.1
SW1(config)# service timestamps log datetime msec localtime show-timezone`,
          output: `SW1# show ntp associations
  address         ref clock       st   when   poll reach  delay  offset   disp
*~10.10.1.1       10.10.0.10       2     18     64   377  1.420   0.312  0.941

SW1# show ntp status
Clock is synchronized, stratum 3, reference is 10.10.1.1
nominal freq is 250.0000 Hz, actual freq is 250.0000 Hz, precision is 2**10`,
          lineByLine: [
            { segment: '*~10.10.1.1', meaning: '`*` = synchronized active master peer; `~` = statically configured (`ntp server`).' },
            { segment: 'st 2', meaning: 'The upstream server `10.10.1.1` is Stratum 2, making this switch (`SW1`) Stratum 3.' },
            { segment: 'reach 377', meaning: 'Octal bitmask (`111 111 111` = 8 out of last 8 UDP/123 polls succeeded!). `0` means blocked/unreachable.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ntp associations',
        healthyLabel: 'Healthy Synchronized Peer',
        healthyOutput: `*~10.10.1.1   10.10.0.10   2   18   64   377   1.42   0.31   0.94`,
        brokenLabel: 'Unreachable or Blocked UDP 123',
        brokenOutput: ` ~10.10.1.1   .INIT.       16   -    64    0    0.00   0.00  15937`,
        diagnosis:
          'Notice missing `*`, `.INIT.`, `st 16` (unsynchronized), and `reach 0`! Check IP routing, ACLs blocking UDP port 123, or whether the target server actually has `ntp master` / NTP daemon enabled.',
      },
    },

    commonTraps: [
      {
        trap: 'Confusing `reach 377` as milliseconds of latency or packet errors.',
        reality: '`377` is octal (`11 111 111` binary = all 8 most recent NTP polls succeeded)—`377` is the **best possible** reachability score!',
      },
      {
        trap: 'Assuming `ntp server` automatically updates syslog timestamps without `service timestamps log datetime`.',
        reality: 'NTP keeps the system clock accurate, while `service timestamps log datetime` tells IOS to stamp syslog entries using that synced wall clock instead of uptime.',
      },
      {
        trap: 'Thinking Stratum 16 is a valid distant backup tier.',
        reality: 'Max usable NTP Stratum is `15`; Stratum `16` strictly means **unsynchronized**.',
      },
      {
        trap: 'Remembering the wrong transport protocol/port for NTP.',
        reality: 'NTP runs over **UDP port 123**, never TCP.',
      },
    ],

    keyTerms: [
      {
        term: 'NTP (Network Time Protocol)',
        shortDef: 'UDP port 123 protocol synchronizing clocks across routers, switches, and servers.',
        fullDef: 'Maintains millisecond clock consistency for log correlation, TLS certificate validity, and Kerberos authentication.',
      },
      {
        term: 'Stratum (0–15 / 16)',
        shortDef: 'Hop count distance from an authoritative reference clock (`1` best; `16` unsynchronized).',
        fullDef: 'Stratum 0 = GPS/atomic clock; Stratum 1 = primary time server; clients add +1 per hop.',
      },
      {
        term: 'reach 377',
        shortDef: 'Octal history bitmask showing all last 8 NTP polls succeeded.',
        fullDef: 'A `0` in `reach` indicates UDP/123 packets are blocked or unroutable; `377` means steady bidirectional polling.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1142-q1',
        prompt: 'A switch receives NTP synchronization directly from a core router whose `show ntp status` reports `stratum 3`. What stratum does the switch report once synchronized?',
        options: ['Stratum 4', 'Stratum 2', 'Stratum 3', 'Stratum 16'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Each NTP hop increments Stratum by +1 (`3 + 1 = 4`).',
          'Incorrect: Stratum decreases only toward GPS/atomic sources (`0`/`1`), never downstream.',
          'Incorrect: Downstream clients do not stay at the same stratum as their server.',
          'Incorrect: Stratum 16 means unsynchronized.',
        ],
        takeaway: 'Every NTP hop downstream increases the Stratum number by 1.',
      },
      {
        id: 'c1142-q2',
        prompt: 'In `show ntp associations`, you see `*~10.10.1.1` with `reach 377` and `st 2`. What does the leading asterisk (`*`) confirm?',
        options: [
          'This device is actively synchronized to `10.10.1.1` as its system peer.',
          'The peer is configured only as a disabled backup.',
          'NTP packets are being dropped by an ACL.',
          'The peer clock is at Stratum 16.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `*` denotes the currently selected, synchronized primary peer (`~` denotes statically configured).',
          'Incorrect: `+` denotes an eligible backup candidate; blank means unsynchronized.',
          'Incorrect: `reach 377` proves 8/8 recent polls succeeded.',
          'Incorrect: Output explicitly lists `st 2`.',
        ],
        takeaway: 'Look for `*` AND `reach 377` + `Clock is synchronized` to confirm healthy NTP.',
      },
      {
        id: 'c1142-q3',
        prompt: 'Which Layer 4 protocol and port number must be permitted through firewall ACLs for Cisco IOS routers to synchronize via NTP?',
        options: ['UDP port 123', 'TCP port 123', 'UDP port 161', 'TCP port 22'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: NTP operates strictly over UDP port 123.',
          'Incorrect: NTP does not use TCP.',
          'Incorrect: UDP 161 is SNMP polling.',
          'Incorrect: TCP 22 is SSH.',
        ],
        takeaway: 'NTP = UDP/123.',
      },
      {
        id: 'c1142-q4',
        prompt: 'An air-gapped lab router with no GPS clock or internet access must act as an authoritative NTP time source for five switches. Which global command achieves this?',
        options: ['`ntp master 5`', '`ntp passive 5`', '`ntp server 127.0.0.16`', '`clock sync master`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `ntp master [stratum]` lets a Cisco IOS router serve its local clock as an authoritative NTP source in isolated networks.',
          'Incorrect: `ntp passive` is not an authoritative server command.',
          'Incorrect: Manually pointing to an invalid IP or Stratum 16 fails sync.',
          'Incorrect: `clock sync master` is invalid IOS syntax.',
        ],
        takeaway: '`ntp master [stratum]` turns an isolated IOS router into a local NTP time server.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Sync Two Routers with `ntp master` & `ntp server`',
      targetTab: 'labs',
      instructions: [
        'Run `ntp master 4` on a distribution router and `ntp server <IP>` on an access device.',
        'Check `show ntp associations` and wait until `*` and `reach 377` replace `.INIT.` and `st 16`.',
        'Verify `service timestamps log datetime msec` stamps syslog entries with synced clock time.',
      ],
      verificationCheck: '`show ntp status` prints `Clock is synchronized` and stratum equals upstream + 1.',
    },

    summaryBullets: [
      'NTP uses **UDP port 123** to keep infrastructure clocks aligned for syslog correlation, certificates, and authentication.',
      'Stratum runs `1–15` downstream from Stratum `0` GPS/atomic clocks; `16` means **unsynchronized**.',
      'Configure clients with `ntp server <IP>` (optionally `ntp source Loopback0`) and isolated labs with `ntp master`.',
      'In `show ntp associations`, `*` means currently synced, `~` means configured, and `reach 377` means 8/8 polls passed.',
      'Pair NTP with `service timestamps log datetime msec` so logs carry accurate timestamps.',
    ],

    sourcesToVerify: [
      'Cisco IOS Basic System Management Configuration Guide — Configuring NTP',
      'RFC 5905 — Network Time Protocol Version 4',
    ],
  },

  'ccna.v11.4.8': {
    id: 'ccna.v11.4.8',
    moduleId: 'ccna',
    unitTitle: 'Unit 4: IP Services (v1.1)',
    topicTitle: '4.8 Configuring Remote Access Using SSH',
    code: '4.8.1',
    title: 'Configuring Cisco IOS Devices for Encrypted Remote Access Using SSHv2',
    readMinutes: 11,
    prerequisites: ['IOS CLI Basics', 'TCP vs UDP'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['4.8 Configure network devices for remote access using SSH'],

    learningObjectives: [
      'Explain why Telnet (TCP 23) sends usernames, passwords, and configs in plaintext and must be disabled on production VTY lines.',
      'List all four mandatory prerequisites required before Cisco IOS enables SSHv2 (`hostname`, `ip domain name`, RSA keypair >= 1024 bits, and `ip ssh version 2`).',
      'Configure VTY lines with `login local` and `transport input ssh` cleanly without locking yourself out.',
      'Verify active SSH version, key modulus, and connected sessions via `show ip ssh` and `show ssh`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Single Telnet Login Hands Your Entire Network to Anyone with Wireshark',
      narrative:
        'When a switch sits down the hall or across town, you manage it over the network using its Virtual Teletype (**VTY**) lines. If those VTY lines accept **Telnet** (TCP port 23), every single keystroke—including your enable password and local admin credentials—travels across the wire in readable ASCII plaintext! Any packet sniffer on the path captures your admin login in three seconds. Enabling **SSHv2 (Secure Shell)** over TCP port 22 and locking VTYs with `transport input ssh` wraps the entire management session in strong encryption.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Mailing a Postcard vs Sending a Locked Armored Envelope',
      analogy:
        'Using **Telnet** to configure a switch is like writing your bank PIN on an open postcard: every postal worker and bystander along the route can read every character. **SSH (Secure Shell)** puts the same message inside a locked envelope that only you and the switch can open. First, the switch proves its identity using a cryptographic key pair (generated locally via `crypto key generate rsa`); then both sides agree on encrypted symmetric keys over TCP port 22 before a single password ever crosses the cable.',
      technicalDefinition:
        'Secure Shell version 2 (SSHv2, RFC 4251) provides encrypted, authenticated remote CLI access over **TCP port 22**. Cisco IOS requires a non-default device `hostname`, an `ip domain name`, an asymmetric RSA (or ECDSA) host keypair (`>= 1024` bits recommended; mandatory `>= 768` for SSHv2), local or AAA credentials (`login local`), and `transport input ssh` on `line vty 0 15`.',
      paragraphs: [
        'Complete beginners consistently stumble on one hidden detail in Cisco IOS: **if you try running `crypto key generate rsa` while the hostname is still the factory default `Router` or `Switch`, IOS refuses with an error!** Likewise, you MUST set an `ip domain name` (for example `ip domain name acme.local`) so IOS can combine `hostname.domain` into the RSA key label.',
        'Second common stumble: `transport input ssh` stops the switch from *listening* for Telnet, while `ip ssh version 2` explicitly upgrades from vulnerable SSHv1 fallback to SSHv2.',
        'Finally, remember **credentials rule**: standard SSH cannot log in with just an anonymous line `password`! Always create a local user (`username netadmin secret ...` or AAA) AND apply `login local` under `line vty 0 15`.',
      ],
    },

    deepDive: {
      intro:
        'Follow the exact 5-step Cisco IOS SSHv2 hardening sequence from scratch.',
      steps: [
        {
          step: 'Step 1',
          title: 'Set Non-Default Hostname & IP Domain Name',
          explanation:
            'Run `hostname SW-CORE-1` and `ip domain name lab.local`. Together these form `SW-CORE-1.lab.local`, required before RSA key generation succeeds.',
        },
        {
          step: 'Step 2',
          title: 'Generate RSA Keypair (1024 or 2048 Bits) & Enforce SSHv2',
          explanation:
            'Run `crypto key generate rsa modulus 2048` (IOS XE defaults or prompts for key size; use `1024` minimum or `2048` standard for SSHv2). Then execute `ip ssh version 2` so SSHv1 is disabled.',
        },
        {
          step: 'Step 3',
          title: 'Create Encrypted Local User Accounts',
          explanation:
            'Run `username admin privilege 15 secret StrongPass!23`. Always use `secret` (salted hash) rather than plaintext/Type-7 `password`.',
        },
        {
          step: 'Step 4',
          title: 'Lock VTY Lines to Local Auth & SSH-Only Transport',
          explanation:
            'Enter `line vty 0 15`, configure `login local` (tells IOS to prompt for username+password from local database), and `transport input ssh` (blocks Telnet completely!). Optionally add `access-class ADMIN_ONLY in` to restrict which source IPs can even reach TCP/22.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Mandatory 4-Ingredient Checklist Before IOS Opens TCP Port 22 SSHv2',
        asciiFallback: `[1. Custom hostname] + [2. ip domain name] ---> crypto key generate rsa modulus 2048
                                                         |
[3. username X secret Y] + [4. line vty 0 15]            v
    -> login local                              [SSHv2 Server Ready on TCP/22]
    -> transport input ssh (Blocks Telnet!)     --> Check with show ip ssh & show ssh`,
      },
      workedExample: {
        title: 'Worked SSHv2 Cutover on Access Switch SW2',
        context:
          'Security audit flags SW2 because admins currently Telnet in with only a shared VTY password (`cisco`). Harden SW2 to SSHv2 only.',
        steps: [
          'Set `hostname SW2` and `ip domain name corp.internal`.',
          'Generate keys: `crypto key generate rsa modulus 2048` and enforce `ip ssh version 2`.',
          'Configure `username netadmin privilege 15 secret Vault#Key99` plus `enable secret Enable#Vault99`.',
          'Under `line vty 0 15`: remove old `password cisco`, apply `login local`, and apply `transport input ssh`.',
          'Verify from an upstream router or PC via `ssh -l netadmin 10.10.1.2` before closing your console cable!',
        ],
        outcome:
          'Telnet on port 23 immediately refuses connections (`Connection refused`), while `show ip ssh` displays `SSH Enabled - version 2.0`.',
      },
    },

    iosCliGuide: {
      intro:
        'Execute and verify the full Cisco IOS SSHv2 configuration block below.',
      commands: [
        {
          title: 'Complete IOS SSHv2 Configuration & Verification',
          promptAndCommand: `SW2(config)# hostname SW2
SW2(config)# ip domain name corp.internal
SW2(config)# crypto key generate rsa modulus 2048
SW2(config)# ip ssh version 2
SW2(config)# username netadmin secret Vault#Key99
SW2(config)# line vty 0 15
SW2(config-line)# login local
SW2(config-line)# transport input ssh`,
          output: `SW2# show ip ssh
SSH Enabled - version 2.0
Authentication methods:publickey,keyboard-interactive,password
Authentication timeout: 120 secs; Authentication retries: 3

SW2# show ssh
Connection Version Mode Encryption  Hmac         State                 Username
0          2.0     IN   aes128-ctr  hmac-sha2-256 Session started      netadmin`,
          lineByLine: [
            { segment: 'crypto key generate rsa modulus 2048', meaning: 'Generates asymmetric key pair; fails unless both `hostname` and `ip domain name` are set.' },
            { segment: 'transport input ssh', meaning: 'Replaces default `all` / `telnet` on VTYs so plaintext Telnet is rejected.' },
            { segment: 'show ip ssh vs show ssh', meaning: '`show ip ssh` checks global SSH daemon status/version; `show ssh` lists currently connected sessions.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ip ssh',
        healthyLabel: 'SSHv2 Active & Hardened',
        healthyOutput: `SSH Enabled - version 2.0
Authentication timeout: 120 secs; Authentication retries: 3`,
        brokenLabel: 'SSH Disabled / Telnet Exposed',
        brokenOutput: `SSH Disabled - version 1.99
%Please create RSA keys to enable SSH (and check transport input ssh on VTY)`,
        diagnosis:
          'IOS prints `SSH Disabled` if RSA keys were never generated or hostname/domain were missing; `version 1.99` means `ip ssh version 2` was omitted so vulnerable v1 fallback remains open.',
      },
    },

    commonTraps: [
      {
        trap: 'Trying `crypto key generate rsa` before changing default `Router` hostname or setting `ip domain name`.',
        reality: 'IOS explicitly throws an error and refuses key generation until both custom `hostname` and `ip domain name` exist.',
      },
      {
        trap: 'Configuring `transport input ssh` WITHOUT `login local` (or creating no `username`).',
        reality: 'SSH requires user authentication (`login local` or AAA). Leaving plain `login` without a local user database locks remote admins out.',
      },
      {
        trap: 'Using `transport input ssh telnet` instead of `transport input ssh`.',
        reality: 'Leaving `telnet` permitted defeats the entire security benefit of SSH because an attacker or careless admin can still transmit plaintext credentials on port 23.',
      },
      {
        trap: 'Mixing up `show ip ssh` and `show ssh`.',
        reality: '`show ip ssh` shows daemon config/version/timers; `show ssh` shows live active inbound sessions.',
      },
    ],

    keyTerms: [
      {
        term: 'SSHv2 (Secure Shell v2)',
        shortDef: 'Encrypted remote terminal protocol operating over TCP port 22.',
        fullDef: 'Replaces plaintext Telnet (TCP 23) by encrypting authentication and all management commands.',
      },
      {
        term: 'VTY Lines (`line vty 0 15`)',
        shortDef: 'Virtual Teletype software interfaces handling incoming remote SSH/Telnet CLI sessions.',
        fullDef: 'Cisco switches commonly provide 16 VTY lines (`0 15`) configured with `login local` and `transport input ssh`.',
      },
      {
        term: 'transport input ssh',
        shortDef: 'VTY command permitting ONLY SSH connections and blocking Telnet.',
        fullDef: 'Crucial hardening directive preventing plaintext management sessions.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1148-q1',
        prompt: 'You type `crypto key generate rsa modulus 2048` on a brand-new switch named `Switch`, and IOS prints `% Please define a domain-name first.` What two prerequisites must exist before generating RSA keys for SSH?',
        options: [
          'A non-default `hostname` and a configured `ip domain name`',
          'A loopback interface and OSPF Area 0',
          'An active Telnet session and `enable password`',
          'SNMPv3 and DHCP snooping',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Cisco IOS requires both a modified `hostname` (not default Router/Switch) and `ip domain name` to name the RSA keypair.',
          'Incorrect: Routing protocols are unrelated to generating host RSA keys.',
          'Incorrect: Console/SSH setup does not depend on Telnet or insecure `enable password`.',
          'Incorrect: SNMPv3 and L2 security are independent features.',
        ],
        takeaway: 'Set `hostname` + `ip domain name` BEFORE `crypto key generate rsa`.',
      },
      {
        id: 'c1148-q2',
        prompt: 'Which VTY subcommand guarantees that remote users MUST use SSH and cannot fall back to plaintext Telnet on TCP port 23?',
        options: ['`transport input ssh`', '`ip ssh version 2`', '`login local`', '`transport output ssh`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `transport input ssh` under `line vty` restricts incoming management connections strictly to SSH.',
          'Incorrect: `ip ssh version 2` blocks SSHv1 fallback, not inbound Telnet connections on VTY lines.',
          'Incorrect: `login local` selects local username authentication, not the transport protocol.',
          'Incorrect: `transport output` controls outbound sessions initiated *from* the switch.',
        ],
        takeaway: '`transport input ssh` blocks inbound Telnet; `ip ssh version 2` blocks SSHv1.',
      },
      {
        id: 'c1148-q3',
        prompt: 'While checking `show ip ssh`, you read `SSH Enabled - version 1.99`. Which global command updates this to enforce strict version 2.0?',
        options: ['`ip ssh version 2`', '`crypto key zeroize rsa`', '`line vty 0 4`', '`service password-encryption`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `1.99` means both v1.5 and v2 are accepted; `ip ssh version 2` enforces strictly `version 2.0`.',
          'Incorrect: `zeroize` deletes your RSA keys and disables SSH completely!',
          'Incorrect: `line vty 0 4` simply enters line configuration mode.',
          'Incorrect: `service password-encryption` merely obfuscates plaintext passwords with weak Type-7 encoding.',
        ],
        takeaway: '`version 1.99` allows SSHv1 downgrade; always run `ip ssh version 2`.',
      },
      {
        id: 'c1148-q4',
        prompt: 'Which command displays the **currently connected active SSH users** and their encryption cipher, rather than global server settings?',
        options: ['`show ssh`', '`show ip ssh`', '`show sessions`', '`show crypto key mypubkey rsa`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `show ssh` lists live inbound SSH sessions, username, cipher, HMAC, and connection state.',
          'Incorrect: `show ip ssh` displays global SSH daemon version and timeout timers.',
          'Incorrect: `show sessions` lists outbound Telnet/SSH sessions initiated *from* the CLI.',
          'Incorrect: `show crypto key mypubkey rsa` displays the router’s public RSA key material.',
        ],
        takeaway: '`show ip ssh` = daemon status; `show ssh` = active incoming connections.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Harden Management VTYs with SSHv2',
      targetTab: 'labs',
      instructions: [
        'Configure `hostname`, `ip domain name`, `crypto key generate rsa modulus 1024` (or `2048`), `ip ssh version 2`, `username ... secret`, and `line vty 0 15` (`login local` + `transport input ssh`).',
        'Test `show ip ssh` and confirm `SSH Enabled - version 2.0`.',
      ],
      verificationCheck: 'Both `show ip ssh` (version 2.0) and `show running-config | section line vty` confirm `login local` and `transport input ssh`.',
    },

    summaryBullets: [
      'SSHv2 uses **TCP port 22** to encrypt remote device administration, replacing plaintext Telnet (TCP 23).',
      'Prerequisites order: custom `hostname` -> `ip domain name` -> `crypto key generate rsa` -> `ip ssh version 2`.',
      'Always create local credentials (`username admin secret ...`) and set `login local` on `line vty 0 15`.',
      'Apply `transport input ssh` on VTY lines to block Telnet completely.',
      'Verify daemon status with `show ip ssh` and live active sessions with `show ssh`.',
    ],

    sourcesToVerify: [
      'Cisco IOS Security Configuration Guide — Configuring Secure Shell (SSH)',
      'RFC 4251 — The Secure Shell (SSH) Protocol Architecture',
    ],
  },

  'ccna.v11.4.9': {
    id: 'ccna.v11.4.9',
    moduleId: 'ccna',
    unitTitle: 'Unit 4: IP Services (v1.1)',
    topicTitle: '4.9 Capabilities & Functions of TFTP and FTP',
    code: '4.9.1',
    title: 'Capabilities & Functions of TFTP and FTP for IOS Images and Configs',
    readMinutes: 9,
    prerequisites: ['TCP vs UDP'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['4.9 Describe the capabilities and functions of TFTP/FTP in the network'],

    learningObjectives: [
      'Contrast Trivial File Transfer Protocol (**TFTP**, UDP port 69) with File Transfer Protocol (**FTP**, TCP ports 20 & 21).',
      'Identify when an engineer uses TFTP (ROMMON recovery, minimal overhead) vs FTP (larger IOS image downloads with reliability and credentials).',
      'Explain Active vs Passive FTP data channels and why both protocols are unencrypted on modern networks.',
      'Execute `copy tftp: flash:` and `copy running-config tftp:` verification syntax accurately.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Recovering a Corrupted IOS Switch Stuck at `switch:` ROMMON Prompt',
      narrative:
        'A power flicker during an upgrade corrupted the Cisco IOS image on a remote warehouse switch. It boots into `switch:` ROMMON recovery mode—no SSH, no HTTPS web UI, barely enough tiny code in firmware to send simple UDP packets! In that bare-bones recovery state, **TFTP** (Trivial File Transfer Protocol) is often the only lightweight mechanism available to copy a clean OS image back into flash memory. Meanwhile, in production day-to-day transfers of 800 MB Catalyst IOS XE packages, understanding how **FTP** handles TCP reliability (and why v2.0 transitions to encrypted **SFTP/SCP**) keeps you sharp across both exam versions.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Tossing Small Postcards vs Signing for Freight Boxes',
      analogy:
        '**TFTP** is like sending small unnumbered cards one at a time where you simply shout "Got box 1! Send box 2!" There is no login booth, no folder browsing, and no fancy error windowing—so tiny firmware programs (like ROMMON bootloaders or IP phones grabbing config XMLs) run it effortlessly. **FTP** is a full shipping depot with a front desk (**TCP 21** control channel) where you show a username/password, list directories, and open a dedicated freight bay (**TCP 20** or negotiated high port) to haul huge OS packages reliably using TCP windowing.',
      technicalDefinition:
        'TFTP (RFC 1350) is an unauthenticated, lock-step UDP port 69 file transfer protocol suited to tiny transfers and ROMMON/PXE boot recovery. FTP (RFC 959) is a stateful TCP protocol separating a persistent control connection (`TCP port 21`) from a separate data connection (`TCP port 20` in Active mode, or a dynamic server high port in Passive mode), adding authentication, directory navigation, and TCP flow control—though both TFTP and standard FTP transmit payloads and passwords in cleartext.',
      paragraphs: [
        'For CCNA v1.1 Topic 4.9, memorize the exact Layer 4 ports and differences: **TFTP = UDP port 69** (no username/password, no directory listing, 512-byte default blocks). **FTP = TCP port 21 (Control) + TCP port 20 (Data in Active mode)** (supports username/password, directory listing `dir`/`ls`, and fast TCP sliding windows).',
        'Why does Active vs Passive FTP trip up beginners behind home routers or firewalls? In **Active FTP**, the server tries to initiate a *new* inbound TCP connection from server port `20` back to the client—which NAT firewalls block! **Passive FTP (`PASV`)** reverses the direction: the client initiates BOTH connections outbound toward the server, passing cleanly through client-side NAT.',
        'Security note: Because neither TFTP nor plain FTP encrypts traffic (FTP even sends passwords in cleartext!), enterprises never expose TFTP or FTP across the internet, shifting to **SCP/SFTP** over SSH (TCP 22) whenever possible.',
      ],
    },

    deepDive: {
      intro:
        'Compare TFTP, Active FTP, and Passive FTP side-by-side at the protocol and CLI levels.',
      steps: [
        {
          step: 'Protocol 1',
          title: 'TFTP Mechanics (UDP 69 Lock-Step)',
          explanation:
            'Client sends Read Request (`RRQ`) or Write Request (`WRQ`) to server UDP port 69. Every 512-byte DATA packet waits for an explicit TFTP `ACK` before the next block leaves—making TFTP ultra-simple (~10 KB code footprint) yet slow across high-latency WAN links.',
        },
        {
          step: 'Protocol 2',
          title: 'FTP Control & Data Channels (TCP 21 & 20)',
          explanation:
            'Client connects to server **TCP port 21** for authentication (`USER`/`PASS`) and commands (`RETR`, `STOR`, `LIST`). Separate TCP connection carries actual file bytes: **Active mode** opens server source `TCP 20 -> client high port`; **Passive mode (`PASV`)** opens `client high port -> server negotiated high port`.',
        },
        {
          step: 'CLI',
          title: 'IOS File Transfer Syntax (`copy` + optional `ip ftp username`)',
          explanation:
            'Back up running config via `copy running-config tftp:`. For FTP transfers without typing credentials interactively each time, pre-stage `ip ftp username netadmin` and `ip ftp password ...`, then run `copy ftp://10.10.0.50/c2960-lanbasek9.bin flash:`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'TFTP (UDP/69) vs FTP (TCP/21 Control + Data Channel)',
        asciiFallback: `TFTP: [IOS Device] <-- UDP 69 (No Auth, 1 block + ACK at a time) --> [TFTP Server]

FTP Active:
  1. Control: [Client:high] -------- TCP 21 --------> [Server:21]
  2. Data:    [Client:high+1] <------ TCP 20 -------- [Server:20]  (Blocked by client NAT!)

FTP Passive (Firewall-Friendly):
  1. Control: [Client:high] -------- TCP 21 --------> [Server:21]
  2. Data:    [Client:high+1] ---- TCP PASV high ---> [Server:high] (Client initiates both!)`,
      },
      workedExample: {
        title: 'Worked TFTP Backup & FTP Image Pre-Staging',
        context:
          'You need to back up `R1` startup config to a local jumpbox (`10.10.5.5`) and pull a 450 MB IOS XE image from a campus repository.',
        steps: [
          'For the tiny 4 KB config backup inside a trusted management VLAN: run `copy running-config tftp://10.10.5.5/r1-cfg.txt`.',
          'For the 450 MB IOS XE `.bin` file: configure `ip ftp username svc_ios` and `ip ftp password ...` (and verify `ip ftp passive` if behind NAT).',
          'Run `copy ftp://10.10.5.5/isr4300-universalk9.bin bootflash:` and verify MD5/SHA2 hash via `verify /md5 bootflash:isr4300-universalk9.bin` before reloading.',
        ],
        outcome:
          'Small config backups take 1 second via TFTP while the large 450 MB OS binary transfers fast over TCP sliding windows.',
      },
    },

    iosCliGuide: {
      intro:
        'Check file copy commands and pre-configured FTP client parameters on Cisco IOS.',
      commands: [
        {
          title: 'Backup Config via TFTP & Configure Passive FTP Client',
          promptAndCommand: `R1# copy running-config tftp://10.10.5.5/r1-backup.txt
R1(config)# ip ftp username netops
R1(config)# ip ftp password TempFtpPass
R1(config)# ip ftp passive`,
          output: `Writing r1-backup.txt !!
[OK - 2418 bytes]
2418 bytes copied in 0.140 secs (17271 bytes/sec)`,
          lineByLine: [
            { segment: '!!', meaning: 'Each exclamation mark (`!`) indicates TFTP UDP blocks sent and acknowledged cleanly.' },
            { segment: 'ip ftp passive', meaning: 'Makes client initiate data channel outbound so NAT/stateful firewalls allow transfer.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'copy tftp: running-config (or copy ftp: flash:)',
        healthyLabel: 'Successful Transfer',
        healthyOutput: `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
[OK - 482012 bytes]`,
        brokenLabel: 'TFTP Blocked / Timeout',
        brokenOutput: `.....
%Error opening tftp://10.10.5.5/r1-backup.txt (Timed out)`,
        diagnosis:
          'Dots (`.....`) indicate timeouts: check `ping 10.10.5.5`, confirm Windows/Linux firewall permits inbound **UDP 69**, and verify the TFTP daemon root directory permissions.',
      },
    },

    commonTraps: [
      {
        trap: 'Mixing up FTP ports (`20/21`) with SSH (`22`) or TFTP (`69`).',
        reality: 'FTP = TCP `21` (Control) & TCP `20` (Data); SSH/SFTP/SCP = TCP `22`; TFTP = UDP `69`.',
      },
      {
        trap: 'Assuming TFTP prompts for a username and password.',
        reality: 'TFTP has **zero** built-in authentication and **zero** directory listing capability—anyone able to reach UDP 69 can transfer permitted files.',
      },
      {
        trap: 'Thinking FTP encrypts data because it requires a login.',
        reality: 'Standard FTP sends BOTH credentials (`USER`/`PASS`) and file payloads in cleartext! Only **SFTP** (SSH) or **FTPS** (TLS) encrypts.',
      },
    ],

    keyTerms: [
      {
        term: 'TFTP (Trivial File Transfer Protocol)',
        shortDef: 'Minimalist, unauthenticated UDP port 69 file transfer protocol.',
        fullDef: 'Used heavily by ROMMON image recovery, PXE network booting, and VoIP phone config downloads.',
      },
      {
        term: 'FTP (File Transfer Protocol)',
        shortDef: 'Stateful TCP file transfer protocol using TCP 21 (Control) and TCP 20 (Active Data).',
        fullDef: 'Supports user authentication, directory navigation, and TCP sliding-window throughput without encryption.',
      },
      {
        term: 'Passive FTP',
        shortDef: 'FTP mode where the client initiates both control (TCP 21) and data connections outbound.',
        fullDef: 'Solves Active FTP firewall/NAT drops caused when a remote server tries connecting inbound from port 20.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1149-q1',
        prompt: 'Which combination of Layer 4 protocol and port number does **TFTP** use by default?',
        options: ['UDP port 69', 'TCP port 21', 'TCP port 22', 'UDP port 123'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: TFTP uses lightweight connectionless UDP port 69.',
          'Incorrect: TCP 21 is FTP Control.',
          'Incorrect: TCP 22 is SSH/SFTP/SCP.',
          'Incorrect: UDP 123 is NTP.',
        ],
        takeaway: 'TFTP = UDP/69.',
      },
      {
        id: 'c1149-q2',
        prompt: 'Why does **Passive FTP** succeed behind most NAT firewalls when **Active FTP** hangs during `dir` or file transfer?',
        options: [
          'In Passive mode, the client initiates both the TCP 21 control connection and the high-port data connection outbound.',
          'Passive FTP switches transport to UDP port 69.',
          'Passive FTP encrypts packets inside SSH tunnels.',
          'Active FTP forbids usernames and passwords.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Stateful firewalls permit outbound client-initiated connections automatically, whereas Active mode forces the server to initiate a connection *back* toward the client.',
          'Incorrect: Both Active and Passive FTP run over TCP.',
          'Incorrect: Neither standard Active nor Passive FTP uses SSH encryption.',
          'Incorrect: Both Active and Passive FTP support authentication.',
        ],
        takeaway: 'Passive FTP makes the client initiate BOTH TCP connections outbound.',
      },
      {
        id: 'c1149-q3',
        prompt: 'Which capability exists in **FTP** that does NOT exist in **TFTP**?',
        options: [
          'User authentication (`USER`/`PASS`), directory listing, and TCP reliability',
          'Transferring files smaller than 1 MB',
          'Running inside an IPv4 LAN',
          'Copying Cisco IOS configuration files',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: FTP supports user login, directory browsing, and TCP sliding windows; TFTP has no auth or directory browsing.',
          'Incorrect: Both protocols can transfer small files.',
          'Incorrect: Both operate over IPv4 networks.',
          'Incorrect: Both copy IOS configs and images.',
        ],
        takeaway: 'FTP adds login auth, directory commands, and TCP sliding windows; TFTP strips everything down to UDP/69.',
      },
      {
        id: 'c1149-q4',
        prompt: 'What is the main security risk shared by BOTH standard TFTP and standard FTP when transferring configs across shared networks?',
        options: [
          'Both transmit files (and FTP credentials) in unencrypted cleartext.',
          'Both force switches into half-duplex 10 Mbps.',
          'Both wipe flash memory before copying.',
          'Both operate exclusively over IPv6.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Neither TFTP nor plain FTP encrypts payloads or credentials, exposing sensitive secrets to packet sniffers.',
          'Incorrect: Transfer protocols do not modify physical Ethernet duplex.',
          'Incorrect: Copying onto flash checks free space first rather than wiping blindly.',
          'Incorrect: Both run fine on IPv4.',
        ],
        takeaway: 'Prefer SFTP/SCP over TFTP/FTP whenever transferring sensitive configs across untrusted links.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Port & Packet Flow Comparison Drill',
      instructions: [
        'Draw TFTP (`UDP/69`) vs Active FTP (`TCP/21 + TCP/20 inbound`) vs Passive FTP (`TCP/21 + TCP/high outbound`).',
        'Practice memorizing exact command syntax for `copy running-config tftp:` and `ip ftp passive`.',
      ],
      verificationCheck: 'Recall UDP 69, TCP 20/21, Passive vs Active direction, and cleartext risks cleanly.',
    },

    summaryBullets: [
      '**TFTP (UDP port 69)**: unauthenticated, no directory listing, tiny footprint—ideal for ROMMON boot recovery and local VoIP/PXE.',
      '**FTP (TCP port 21 control, port 20 active data)**: supports credentials, directory browsing, and TCP throughput.',
      'Active FTP has the server initiate data back from port `20`; **Passive FTP** lets the client initiate outbound—passing firewalls/NAT.',
      'In IOS transfers, exclamation marks (`!`) show progress while dots (`.....`) signal timeouts.',
      'Both TFTP and standard FTP lack encryption; enterprises migrate toward **SFTP/SCP** over SSH (TCP 22).',
    ],

    sourcesToVerify: [
      'RFC 1350 — The TFTP Protocol (Revision 2)',
      'RFC 959 — File Transfer Protocol (FTP)',
    ],
  },

  'ccna.v11.4.7': {
    id: 'ccna.v11.4.7',
    moduleId: 'ccna',
    unitTitle: 'Unit 4: IP Services (v1.1)',
    topicTitle: '4.7 QoS Per-Hop Behavior (PHB)',
    code: '4.7.1',
    title: 'QoS Per-Hop Behavior: Classification, Marking (DSCP/CoS), Queuing, Congestion, Policing & Shaping',
    readMinutes: 12,
    prerequisites: ['VLANs & Access/Voice Ports'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['4.7 Explain the forwarding per-hop behavior (PHB) for QoS, such as classification, marking, queuing, congestion, policing, and shaping'],

    learningObjectives: [
      'Explain why delay, jitter, and packet loss destroy real-time voice/video calls during brief network micro-bursts.',
      'Describe all six Quality of Service (QoS) Per-Hop Behavior (PHB) building blocks: classification, marking (`CoS` vs `DSCP`), queuing, congestion avoidance, policing, and shaping.',
      'Compare **Traffic Policing** (drops/remarks excess immediately -> jagged rate) against **Traffic Shaping** (buffers excess in memory -> smooth rate, adds slight delay).',
      'Recognize standard VoIP (`EF` / `DSCP 46`) and voice signaling (`AF31` / `CS3`) markings.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Single 10 GB File Backup Makes Everyone’s Teams Voice Call Sound Like a Robot',
      narrative:
        'Without Quality of Service (QoS), routers and switches run **FIFO (First-In, First-Out)** queues—meaning a giant 1500-byte backup packet and a tiny 200-byte real-time VoIP audio packet get treated identically! During a 2-second uplink spike, audio packets sit trapped behind giant file transfers, creating robotic stutter (**jitter**) and dropped syllables (**loss**). **QoS Per-Hop Behavior (PHB)** gives each router and switch clear rules to identify critical voice/video traffic, tag it cleanly, jump it to the front of the egress queue, and tame greedy bulk downloads.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Airport TSA Priority Lanes vs Holding Overflow Trucks at the Loading Dock',
      analogy:
        'Every router port is a single highway tollgate. **Classification** checks the driver’s badge ("Are you an Ambulance/VoIP call or a Dump Truck/Backup?"). **Marking** slaps a bright VIP sticker (`DSCP 46` / `EF`) onto the ambulance so the *next* town down the road doesn’t have to re-inspect cargo from scratch. **Queuing** opens a dedicated Express Priority Lane (`LLQ`) so ambulances never wait behind dump trucks during rush hour (**congestion**). Finally, if a contractor sends too many dump trucks at once: **Policing** immediately turns extra trucks away at the gate (drops them!), while **Shaping** parks them neatly in a holding lot and releases them evenly every second.',
      technicalDefinition:
        'Quality of Service (QoS) Per-Hop Behavior (PHB, RFC 2474/2475) defines the packet-forwarding treatment an individual network node applies to a traffic class: identifying flows (**classification**), stamping priority bits at Layer 2 (`CoS` 3-bit 802.1p in 802.1Q tags) or Layer 3 (`DSCP` 6-bit Differentiated Services Code Point in IP headers) (**marking**), scheduling prioritized egress queues such as **LLQ** (**queuing**), preventing tail-drop synchronization (**WRED congestion avoidance**), and enforcing bandwidth caps via **policing** (drop/re-mark) or **shaping** (buffer/delay).',
      paragraphs: [
        'Notice the exact boundary rule between **CoS** and **DSCP**: Layer 2 **CoS** (`0–7`, 3 bits) ONLY exists inside an **802.1Q VLAN trunk tag**! The instant a frame hits a Layer 3 router or an untagged access port, the 802.1Q tag disappears. **DSCP** (`0–63`, 6 bits inside the IPv4/IPv6 header) survives end-to-end across every router hop on earth.',
        'Always establish a **Trust Boundary**: never blindly trust QoS markings sent by user laptops (or gamers would mark torrents as `EF 46`!). Trust markings from corporate IP phones (`mls qos trust cos` / `auto qos`) or classify/mark cleanly at the access switch ingress port.',
        'Memorize the most tested comparison on CCNA v1.1: **Policing vs Shaping**. Policing drops (or lowers marking on) excess packets immediately—used by ISPs at ingress or egress—causing TCP retransmissions. Shaping buffers excess packets in RAM and releases them smoothly at the Committed Information Rate (`CIR`)—ideal when matching a faster enterprise router port (`1 Gbps`) to a slower ISP WAN circuit (`200 Mbps`).',
      ],
    },

    deepDive: {
      intro:
        'Walk step-by-step through the six QoS PHB mechanisms inside a Cisco switch or router.',
      steps: [
        {
          step: 'Stage 1',
          title: 'Classification & Trust Boundaries',
          explanation:
            'Inspect ACLs, NBAR application signatures, incoming port, or VLAN to group packets into classes (Voice, Video, Critical Apps, Best-Effort, Scavenger). Apply classification and trust as close to the source edge (access switch) as possible.',
        },
        {
          step: 'Stage 2',
          title: 'Marking (`CoS 0–7` vs `DSCP 0–63`)',
          explanation:
            'Stamp Layer 2 frames with `CoS 5` (Voice) or Layer 3 IP headers with `DSCP EF` (`46` = Expedited Forwarding for Voice), `AF41` (Interactive Video), `CS3` (Call Signaling), `DF/0` (Default Best-Effort).',
        },
        {
          step: 'Stage 3',
          title: 'Queuing & Congestion Avoidance (CBWFQ, LLQ, WRED)',
          explanation:
            'Only activates when an egress interface saturates! **CBWFQ** guarantees minimum bandwidth percentages per class; **LLQ (Low Latency Queuing)** adds a strict-priority lane inside CBWFQ so voice packets always transmit first—yet policed so voice cannot starve routing protocols. **WRED** drops random packets early before queues fill completely, avoiding simultaneous TCP "global synchronization" drops.',
        },
        {
          step: 'Stage 4',
          title: 'Policing vs. Shaping',
          explanation:
            '**Policing** (ingress or egress): zero buffering, excess packets are immediately **dropped** or **marked down**—saves RAM and adds zero delay, creating saw-tooth TCP drops. **Shaping** (egress only): holds excess packets in a buffer queue and paces them out cleanly at target rate—avoids drops at the cost of slight buffer delay (bad for VoIP if over-buffered!).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Policing (Drop Excess Immediately) vs Shaping (Buffer & Smooth Burst)',
        asciiFallback: `Incoming Burst: [||||||]  (exceeds 100 Mbps limit)
   |
   +--> POLICER (Drop/Remark): [|||...X...X...] -> Jagged sawtooth, zero added latency, drops excess!
   +--> SHAPER  (Buffer):      [|||||||||||||]  -> Smooth flat 100 Mbps stream, uses RAM, slight delay`,
      },
      workedExample: {
        title: 'Worked QoS Policy Design: Branch WAN Bottleneck',
        context:
          'A branch router connects to its carrier CPE over a `1 Gbps` Ethernet port, but the ISP polices the SLA at `100 Mbps`. Staff report choppy Teams voice whenever someone uploads backups.',
        steps: [
          'Classify VoIP RTP (`EF / DSCP 46`) into strict-priority **LLQ** capped at 20 Mbps, and business ERP (`AF21`) into **CBWFQ** guaranteed 40 Mbps.',
          'Apply **Traffic Shaping (`shape average 100000000`)** on the router’s `1 Gbps` WAN egress port *above* the queuing policy (hierarchical QoS).',
          'Why? Because without shaping, the router thinks it has `1000 Mbps` free, never queues, blasts `300 Mbps` at the ISP, and lets the ISP’s blind Policer randomly drop voice calls!',
          'With router shaping at `100 Mbps`, congestion occurs inside YOUR router where LLQ guarantees voice jumps ahead of backups cleanly.',
        ],
        outcome:
          'ISP policer drops hit zero, and Teams audio stays crystal clear even during massive cloud uploads.',
      },
    },

    iosCliGuide: {
      intro:
        'Recognize standard Cisco MQC (Modular QoS CLI) `class-map` and `policy-map` verification syntax.',
      commands: [
        {
          title: 'Inspect MQC Policy Map & Interface Queue Drops',
          promptAndCommand: `R1# show policy-map interface GigabitEthernet0/1`,
          output: `GigabitEthernet0/1
  Service-policy output: WAN_QOS_OUT
    Class-map: VOICE_EF (match-any)
      Match: dscp ef (46)
      Priority: 20% (20000 kbps), burst bytes 500000
      (total drops) 0
    Class-map: class-default (match-any)
      Traffic Shaping: Target/Average 100000000 bps`,
          lineByLine: [
            { segment: 'Match: dscp ef (46)', meaning: 'Identifies VoIP audio packets tagged Expedited Forwarding (`46`).' },
            { segment: 'Priority: 20%', meaning: 'Strict-priority LLQ queue guarantees instant transmission ahead of bulk data.' },
            { segment: '(total drops) 0', meaning: 'Confirms zero voice packets were dropped under congestion.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show policy-map interface',
        healthyLabel: 'Voice Protected Under Load',
        healthyOutput: `Class-map: VOICE_EF -> Priority: 20% -> (total drops) 0
Class-map: class-default -> (queueing/shaping active, tail drops absorbed by bulk)`,
        brokenLabel: 'FIFO / Untrusted Edge Drops',
        brokenOutput: `No service-policy attached (FIFO queue) -> Input/Output queue drops increment during uploads`,
        diagnosis:
          'When `show policy-map interface` shows zero matched voice packets (`0 packets`) or missing egress policy, check whether access switches preserved or overwrote `DSCP 46` at ingress.',
      },
    },

    commonTraps: [
      {
        trap: 'Confusing **Policing** and **Shaping** on exam questions.',
        reality: 'Remember **P**olicing = **P**unish/Drop immediately (can run ingress or egress); **S**haping = **S**mooth by buffering in RAM (egress only).',
      },
      {
        trap: 'Expecting Layer 2 `CoS` markings to survive routing across a WAN router.',
        reality: '`CoS` lives strictly inside the Layer 2 802.1Q trunk header, which routers strip off at every Layer 3 hop. Use Layer 3 **`DSCP`** for end-to-end WAN QoS.',
      },
      {
        trap: 'Assuming QoS increases physical link speed beyond 100 Mbps or 1 Gbps.',
        reality: 'QoS creates zero extra bandwidth—it decides *which* critical packets survive and go first during momentary congestion.',
      },
    ],

    keyTerms: [
      {
        term: 'DSCP (Differentiated Services Code Point)',
        shortDef: '6-bit priority field (`0–63`) inside IPv4/IPv6 headers surviving end-to-end Layer 3 routing.',
        fullDef: 'Common exam values: `EF` (`46`) for VoIP voice, `CS3` (`24`) for voice signaling, `DF` (`0`) for best effort.',
      },
      {
        term: 'CoS (Class of Service / 802.1p)',
        shortDef: '3-bit priority field (`0–7`) inside Ethernet 802.1Q trunk headers.',
        fullDef: 'Only exists on tagged 802.1Q Layer 2 frames; stripped on untagged access ports and L3 routed hops.',
      },
      {
        term: 'Traffic Policing vs. Shaping',
        shortDef: 'Policing drops/re-marks excess immediately; Shaping buffers excess to smooth bursts.',
        fullDef: 'Policing adds zero buffer delay but triggers TCP retransmissions; Shaping runs egress-only to match slower CIR circuits cleanly.',
      },
      {
        term: 'LLQ (Low Latency Queuing)',
        shortDef: 'Strict-priority egress queue inside CBWFQ protecting voice/video from jitter.',
        fullDef: 'Serves real-time audio packets first while capping their maximum burst so they never starve other traffic.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1147-q1',
        prompt: 'An enterprise connects a `1 Gbps` router interface to a carrier link policed at `150 Mbps`. Which QoS mechanism buffers bursts on your router and outputs a smooth `150 Mbps` stream so the carrier stops dropping packets?',
        options: ['Traffic Shaping (egress)', 'Traffic Policing (ingress)', '802.1p CoS', 'FIFO'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Traffic Shaping runs egress-only, buffers bursts in RAM, and paces packets out smoothly at the committed rate.',
          'Incorrect: Policing drops excess immediately instead of buffering smoothly.',
          'Incorrect: CoS only marks priority bits inside 802.1Q frames; it does not pace link bitrates.',
          'Incorrect: FIFO sends bursts at full 1 Gbps line rate straight into the carrier policer.',
        ],
        takeaway: 'Shaping buffers & smooths bursts outbound; Policing drops excess immediately.',
      },
      {
        id: 'c1147-q2',
        prompt: 'Why is **DSCP** preferred over **CoS** when carrying QoS priority markings across multiple routed enterprise WAN sites?',
        options: [
          'DSCP sits inside the Layer 3 IP header and survives across routers, whereas CoS exists only inside 802.1Q Layer 2 trunk headers.',
          'CoS cannot mark VoIP packets.',
          'DSCP adds physical bandwidth to WAN links.',
          'CoS works only over Wi-Fi.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Routers strip Layer 2 headers at every hop, erasing 802.1Q CoS bits unless translated/preserved via IP DSCP.',
          'Incorrect: IP phones mark `CoS 5` on voice VLAN trunks on L2 switches.',
          'Incorrect: Neither CoS nor DSCP increases raw link speed.',
          'Incorrect: CoS is IEEE 802.1Q Ethernet.',
        ],
        takeaway: 'L2 trunk = `CoS` (3 bits); L3 IP end-to-end = `DSCP` (6 bits).',
      },
      {
        id: 'c1147-q3',
        prompt: 'Which DSCP marking represents **Expedited Forwarding (EF / decimal 46)** specifically reserved for low-latency, low-jitter VoIP voice packets?',
        options: ['DSCP EF (46)', 'DSCP DF (0)', 'DSCP AF11 (10)', 'DSCP CS1 (8)'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `EF` (`46`) maps directly into strict-priority Low Latency Queuing (`LLQ`) for VoIP RTP audio.',
          'Incorrect: `0` (`DF`) is unprioritized Best Effort default.',
          'Incorrect: `AF11` (`10`) is low-priority Assured Forwarding bulk data.',
          'Incorrect: `CS1` (`8`) is commonly assigned to low-priority Scavenger traffic.',
        ],
        takeaway: 'Remember `DSCP 46 = EF` = VoIP strict priority (`CoS 5`).',
      },
      {
        id: 'c1147-q4',
        prompt: 'What is the goal of **WRED (Weighted Random Early Detection)** congestion avoidance?',
        options: [
          'Selectively drop low-priority TCP packets before queues hit 100% full, avoiding global synchronization tail drops.',
          'Encrypt all QoS headers with AES-256.',
          'Disable Ethernet auto-negotiation on access ports.',
          'Forward every frame even when the queue is overflowing.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Dropping a few low-priority TCP flows early triggers gradual backoff rather than everyone overflowing and slowing down simultaneously.',
          'Incorrect: WRED has nothing to do with encryption.',
          'Incorrect: WRED does not touch physical speed/duplex.',
          'Incorrect: Once buffers saturate, drops are mathematically unavoidable; WRED drops intelligently early.',
        ],
        takeaway: 'WRED drops early & selectively so TCP flows avoid synchronized crashes.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'QoS PHB Pipeline Mapping Exercise',
      instructions: [
        'Trace a VoIP call from an IP phone on Access Switch SW1 -> Core Router R1 -> WAN link: note where `CoS 5` exists (`802.1Q` switch link) vs where `DSCP 46 (EF)` carries priority end-to-end.',
        'Compare how a `Policer` vs `Shaper` reacts when a `200 Mbps` burst enters a `100 Mbps` limit.',
      ],
      verificationCheck: 'Define Classification, Marking (`CoS` vs `DSCP`), LLQ Queuing, WRED, Policing, and Shaping clearly in your own words.',
    },

    summaryBullets: [
      'QoS Per-Hop Behavior protects latency/jitter-sensitive apps (Voice/Video) during link congestion without adding raw bandwidth.',
      '**Classification & Marking**: tag trusted edge traffic with Layer 2 `CoS` (0–7) inside 802.1Q frames and Layer 3 `DSCP` (e.g., `EF 46`) inside IP packets.',
      '**LLQ** gives real-time voice a strict-priority lane inside **CBWFQ**, while **WRED** prevents synchronized tail drops.',
      '**Policing** drops/remarks excess immediately (zero added delay, ingress or egress); **Shaping** buffers bursts to match slower circuits (egress only).',
      'Always establish a Trust Boundary at the access switch so endpoints cannot spoof VIP priority.',
    ],

    sourcesToVerify: [
      'Cisco IOS Quality of Service Solutions Configuration Guide — DiffServ & Modular QoS CLI',
      'RFC 2474 / RFC 3246 — Differentiated Services & Expedited Forwarding PHB',
    ],
  },

  'ccna.v2.4.2': {
    id: 'ccna.v2.4.2',
    moduleId: 'ccna',
    unitTitle: 'Unit 4: Network Services and Security (v2.0)',
    topicTitle: '4.2 Secure File Transfer with SFTP and SCP',
    code: '4.2.1',
    title: 'Transferring IOS XE Images & Configs Securely Over SFTP and SCP',
    readMinutes: 11,
    prerequisites: ['Local Usernames & AAA Client'],
    versionScope: 'v2.0-only',
    v20ExamTopics: ['4.2 Configure and verify secure file transfer using SFTP and SCP'],

    learningObjectives: [
      'Explain why CCNA v2.0 replaces unencrypted TFTP/FTP file transfers with **SCP** (Secure Copy Protocol) and **SFTP** (SSH File Transfer Protocol) over encrypted TCP port 22.',
      'Enable the Cisco IOS XE SCP server (`ip scp server enable`) alongside mandatory SSHv2 and Privilege 15 authentication.',
      'Execute secure outbound and inbound transfers (`copy scp:`, `copy ... sftp:`) from IOS XE CLI and workstations.',
      'Diagnose common SCP/SFTP failures including missing `ip scp server enable`, missing Privilege 15 authorization, and SHA256 image hash verification.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Zero Cleartext Credentials on the Wire During IOS Upgrades',
      narrative:
        'Every `running-config` holds SNMPv3 strings, VPN peers, local password hashes, and internal topology details. In older labs, engineers copied configs over TFTP or FTP—transmitting the entire configuration and admin password across management links in cleartext! Under CCNA v2.0 Domain 4.2, modern IOS XE networks move OS images and config backups exclusively over **SSH (TCP port 22)** via **SCP** and **SFTP**, wrapping authentication, integrity checks, and file bytes inside one encrypted session.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Sending Files Inside the Same Armored Van as Your Admin Remote Login',
      analogy:
        'If SSH is an armored courier truck driving between your workstation and the switch over TCP port 22, **SCP** and **SFTP** simply place your config files and OS software packages inside the back of that exact same armored truck! Unlike FTP (which required opening extra clear firewall ports like TCP 20 and 21), both SCP and SFTP ride cleanly inside a single authenticated TCP port 22 tunnel. **SCP** works like a straightforward one-shot file copy command, while **SFTP** offers an interactive file manager inside SSH (allowing pause/resume and remote directory browsing).',
      technicalDefinition:
        'SCP (Secure Copy Protocol) and SFTP (SSH File Transfer Protocol) are encrypted file-transfer protocols tunneled inside **SSHv2 (TCP port 22)**. On Cisco IOS XE, SCP/SFTP client commands (`copy running-config scp:` or `copy sftp: flash:`) use existing SSH transport, while acting as an inbound **SCP Server** explicitly requires enabling SSHv2 (`ip ssh version 2`), **AAA authorization** (`aaa new-model` + `aaa authorization exec default local` or Privilege 15 user), and `ip scp server enable`.',
      paragraphs: [
        'One of the biggest practical gotchas on Cisco IOS XE is enabling **SCP Server mode** so your laptop can push an IOS image *to* the switch (`scp ios.bin admin@10.10.1.2:flash:`). Simply turning on SSH is **not** enough! Without `ip scp server enable`, IOS silently refuses SCP file copy requests from remote clients.',
        'Second crucial gotcha: by default, even with `ip scp server enable` configured, Cisco IOS requires the authenticating user to land directly in **Privilege Level 15** (`username admin privilege 15 secret ...`) AND have exec authorization (e.g., `aaa new-model` + `aaa authorization exec default local`), otherwise the SCP transfer aborts with `Privilege denied`!',
        'Compare **SCP vs SFTP**: SCP runs fast one-line pushes/pulls (`copy scp: flash:`) with minimal protocol overhead; SFTP is a richer interactive subsystem supporting directory listing, deleting, and resuming interrupted multi-gigabyte upgrades.',
      ],
    },

    deepDive: {
      intro:
        'Follow the exact IOS XE server/client commands and troubleshooting checklist for SCP and SFTP.',
      steps: [
        {
          step: 'Step 1',
          title: 'Prerequisites: Working SSHv2 + Priv-15 Account',
          explanation:
            'Confirm `hostname`, `ip domain name`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`, and `username netops privilege 15 secret ...` are active so TCP port 22 SSH works.',
        },
        {
          step: 'Step 2',
          title: 'Enable Inbound SCP Server on IOS XE',
          explanation:
            'Run `ip scp server enable` (and `aaa new-model` + `aaa authentication login default local` + `aaa authorization exec default local` if using local accounts). Without exec authorization to Priv 15, external `scp` pushes fail.',
        },
        {
          step: 'Step 3',
          title: 'Outbound Pull/Push Using IOS CLI (`scp:` or `sftp:`)',
          explanation:
            'From the switch CLI directly, push configs out (`copy running-config scp://netops@10.10.5.50/backups/sw1.cfg`) or pull signed OS packages in (`copy sftp://netops@10.10.5.50/images/cat9k.bin flash:`).',
        },
        {
          step: 'Step 4',
          title: 'Verify Cryptographic Image Integrity (`verify /sha2` or `/md5`)',
          explanation:
            'Encryption protects files *in transit*; running `verify /md5 flash:cat9k.bin` (or `verify /sha512`) verifies zero disk corruption occurred before reloading.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Single Encrypted TCP/22 Tunnel Carrying Both SSH CLI + SCP/SFTP Payloads',
        asciiFallback: `[Admin Workstation]  <====== ONE Encrypted SSHv2 Tunnel (TCP port 22) ======>  [IOS XE Switch]
   |- CLI session (show / config)                                                 |- ip ssh version 2
   |- SCP one-shot copy (scp image.bin netops@switch:image.bin)                 |- ip scp server enable
   |- SFTP interactive transfer (copy sftp://netops@srv/img.bin flash:)         |- username netops priv 15`,
      },
      workedExample: {
        title: 'Worked IOS XE SCP Server Setup & Outbound SFTP Backup',
        context:
          'You are replacing legacy TFTP/FTP transfers across a Catalyst 9300 (`SW-CORE`) with encrypted SCP and SFTP.',
        steps: [
          'Verify SSHv2 is live (`show ip ssh` displays `SSH Enabled - version 2.0`).',
          'Configure `aaa new-model`, `aaa authentication login default local`, `aaa authorization exec default local`, `username secops privilege 15 secret StrongKey!99`, and `ip scp server enable`.',
          'Test inbound push from jumpbox: `scp cat9k_lite.bin secops@10.10.1.2:cat9k_lite.bin`.',
          'Test outbound backup from SW-CORE via SFTP: `copy running-config sftp://secops@10.10.5.50/sw-core.cfg`.',
          'Confirm image integrity via `verify /md5 flash:cat9k_lite.bin`.',
        ],
        outcome:
          'Only TCP port 22 needs to be permitted through management firewalls, and every credential and config file stays fully encrypted.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure IOS XE to act as both an SCP server and SFTP/SCP client cleanly.',
      commands: [
        {
          title: 'Enable IOS XE SCP Server & Push Encrypted Backup',
          promptAndCommand: `SW1(config)# aaa new-model
SW1(config)# aaa authentication login default local
SW1(config)# aaa authorization exec default local
SW1(config)# username secops privilege 15 secret StrongKey!99
SW1(config)# ip scp server enable
SW1# copy running-config sftp://secops@10.10.5.50/sw1-cfg.txt`,
          output: `Destination filename [sw1-cfg.txt]?
Password:
!
2940 bytes copied in 0.420 secs (7000 bytes/sec)
SW1# show ip ssh | include SCP|version
SSH Enabled - version 2.0`,
          lineByLine: [
            { segment: 'ip scp server enable', meaning: 'Explicitly activates inbound SCP server processing inside IOS XE SSH.' },
            { segment: 'aaa authorization exec default local', meaning: 'Grants Privilege 15 EXEC access cleanly to `secops` so remote SCP sessions aren’t rejected.' },
            { segment: 'copy ... sftp://', meaning: 'Initiates outbound encrypted transfer to an SFTP server over TCP port 22.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'scp file secops@10.10.1.2:file',
        healthyLabel: 'Authorized SCP Server Session',
        healthyOutput: `Password: ********
cat9k.bin      100%   420MB  14.2MB/s   00:29`,
        brokenLabel: 'Missing `ip scp server enable` or Priv 15',
        brokenOutput: `Administratively disabled. / Privilege denied.`,
        diagnosis:
          '`Administratively disabled` means `ip scp server enable` is missing; `Privilege denied` means the user lacks Privilege 15 or `aaa authorization exec default local`.',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking enabling SSHv2 automatically enables inbound SCP file uploads.',
        reality: 'SSH remote CLI works automatically, whereas inbound SCP requires explicitly running `ip scp server enable` plus Privilege 15 user access.',
      },
      {
        trap: 'Confusing **FTPS** with **SFTP**.',
        reality: '**FTPS** wraps legacy FTP (ports 21/data) inside SSL/TLS certificates; **SFTP** runs natively over a single **SSHv2 (TCP 22)** channel.',
      },
      {
        trap: 'Logging in as a Privilege Level 1 user during an inbound SCP file push.',
        reality: 'Cisco IOS XE requires Privilege 15 directly at login (`username X privilege 15 ...`) because SCP cannot type `enable` interactively.',
      },
    ],

    keyTerms: [
      {
        term: 'SFTP (SSH File Transfer Protocol)',
        shortDef: 'Interactive, encrypted file transfer subsystem operating inside SSHv2 (TCP 22).',
        fullDef: 'Supports directory browsing, resuming interrupted uploads, and encrypted credentials over a single port.',
      },
      {
        term: 'SCP (Secure Copy Protocol)',
        shortDef: 'Lightweight one-shot encrypted file transfer built over SSHv2 (TCP 22).',
        fullDef: 'Activated on Cisco IOS XE server side with `ip scp server enable` and Privilege 15 authorization.',
      },
      {
        term: 'ip scp server enable',
        shortDef: 'Mandatory IOS XE global command allowing remote hosts to push/pull files via SCP.',
        fullDef: 'Must be paired with SSHv2 and a Privilege 15 user account.',
      },
    ],

    checkQuestions: [
      {
        id: 'c2042-q1',
        prompt: 'An engineer enables SSHv2 on an IOS XE switch and creates `username ops privilege 15 secret P@ss`. When copying an image *from* a laptop *to* the switch with `scp`, the switch immediately returns `Administratively disabled`. What command is missing?',
        options: ['`ip scp server enable`', '`ip ftp passive`', '`transport input scp`', '`service scp-server`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Inbound SCP transfers require explicitly running `ip scp server enable` on Cisco IOS XE.',
          'Incorrect: `ip ftp passive` applies only to unencrypted FTP.',
          'Incorrect: VTY lines accept `transport input ssh` (there is no `scp` option).',
          'Incorrect: Invalid IOS syntax.',
        ],
        takeaway: 'Always configure `ip scp server enable` for inbound SCP file transfers to IOS XE.',
      },
      {
        id: 'c2042-q2',
        prompt: 'Which TCP/UDP port must be open through a management firewall to permit BOTH **SFTP** and **SCP** transfers?',
        options: ['TCP port 22', 'TCP ports 20 and 21', 'UDP port 69', 'TCP port 443'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Both SCP and SFTP tunnel completely inside SSHv2 over TCP port 22.',
          'Incorrect: TCP 20/21 belong to unencrypted FTP.',
          'Incorrect: UDP 69 belongs to unencrypted TFTP.',
          'Incorrect: TCP 443 is HTTPS.',
        ],
        takeaway: 'SSH, SCP, and SFTP all share **TCP port 22**.',
      },
      {
        id: 'c2042-q3',
        prompt: 'Why does an inbound SCP upload to an IOS XE router fail with `Privilege denied` even though SSH login succeeds?',
        options: [
          'The user account is at Privilege Level 1 or lacks `aaa authorization exec` granting Privilege 15 directly upon login.',
          'SCP only supports IPv6 transport.',
          'TFTP must be started first before SCP can run.',
          'RSA keys exceed 1024 bits.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SCP has no interactive `enable` prompt—the account must enter Privilege 15 immediately at login.',
          'Incorrect: SCP runs identically over IPv4 and IPv6.',
          'Incorrect: TFTP has no dependency with SCP.',
          'Incorrect: Larger RSA keys (2048+ bits) are recommended for SSHv2.',
        ],
        takeaway: 'SCP server logins require direct Privilege 15 authorization (`privilege 15` + `aaa authorization exec`).',
      },
      {
        id: 'c2042-q4',
        prompt: 'What key architectural advantage makes **SFTP** generally easier to harden across enterprise firewalls than **FTPS**?',
        options: [
          'SFTP uses one single TCP port (22) with SSH authentication, whereas FTPS relies on FTP’s separate control and dynamic data ports.',
          'SFTP runs faster because it uses UDP without acknowledgments.',
          'SFTP transmits files without requiring any credentials.',
          'FTPS cannot transfer binary IOS images.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SFTP consolidates control and data cleanly inside one TCP 22 SSH stream.',
          'Incorrect: SFTP runs reliably over TCP, not UDP.',
          'Incorrect: SFTP authenticates via SSH passwords or public keys.',
          'Incorrect: FTPS can transfer binaries, though dynamic data ports complicate firewalls.',
        ],
        takeaway: 'SFTP = SSH over single TCP port 22 (not FTPS over FTP/TLS).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Enable IOS XE SCP Server & Verify Secure Backup',
      targetTab: 'labs',
      instructions: [
        'Trace the required config block: SSHv2 prerequisites -> `aaa new-model` / `aaa authorization exec default local` -> `username ... privilege 15 secret ...` -> `ip scp server enable`.',
        'Verify `copy running-config sftp://...` syntax and `verify /md5 flash:` checksum habits.',
      ],
      verificationCheck: 'Can state all 3 inbound SCP prerequisites (SSHv2, `ip scp server enable`, direct Priv 15) from memory.',
    },

    summaryBullets: [
      '**SCP** and **SFTP** encrypt configs, IOS images, and credentials inside **SSHv2 (TCP port 22)**.',
      'Cisco IOS XE can act as an SFTP/SCP client natively via `copy running-config sftp://...` or `copy scp://... flash:`.',
      'Acting as an inbound SCP Server requires: working SSHv2 + `ip scp server enable` + Privilege 15 authorization (`aaa authorization exec`).',
      '**SFTP** (SSH TCP 22) differs completely from **FTPS** (FTP + TLS control/data channels).',
      'Always verify downloaded IOS binaries with `verify /md5` or `/sha512` before rebooting production gear.',
    ],

    sourcesToVerify: [
      'Cisco IOS XE Security Configuration Guide — Configuring Secure Copy (SCP)',
      'Cisco IOS XE Configuration Fundamentals — Managing Configuration Files via SFTP',
    ],
  },
};
