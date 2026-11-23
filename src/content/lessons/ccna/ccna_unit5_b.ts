import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT5_B_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.core.sec.ipsec-vpn': {
    id: 'ccna.core.sec.ipsec-vpn',
    moduleId: 'ccna',
    unitTitle: 'Unit 5 / Unit 4: Network Security',
    topicTitle: 'IPsec Remote-Access & Site-to-Site VPNs',
    code: '4.5.1',
    title: 'IPsec Remote-Access & Site-to-Site VPNs (IKEv1/IKEv2, ESP Tunnel Mode & Split Tunneling)',
    readMinutes: 12,
    prerequisites: ['Routing Tables', 'IPv4 Access Control Lists'],
    versionScope: 'shared',
    v11ExamTopics: ['5.5 Describe remote access and site-to-site VPNs'],
    v20ExamTopics: ['4.5 Explain IPsec remote-access and site-to-site VPNs'],

    learningObjectives: [
      'Compare **Site-to-Site IPsec VPNs** (router/firewall-to-router/firewall connecting branch LANs seamlessly) with **Remote-Access VPNs** (laptop client connecting on demand).',
      'Explain the two-stage **IKE Phase 1** (secure control channel) and **IKE Phase 2** (IPsec data Security Associations) handshake.',
      'Contrast **ESP** (Encapsulating Security Payload — IP protocol `50`, encrypts + authenticates) with **AH** (Authentication Header — IP protocol `51`, authenticates only, no encryption).',
      'Distinguish **Tunnel Mode** vs **Transport Mode** and **Full Tunneling** vs **Split Tunneling** for remote workers.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Connecting 14 Branch Warehouses Safely Over Cheap Public Broadband',
      narrative:
        'Leasing private dark fiber across 14 cities costs tens of thousands monthly. Using **Site-to-Site IPsec VPNs**, routers encapsulate internal `10.x.x.x` RFC 1918 packets inside encrypted AES-GCM wrappers over ordinary broadband ISPs—while **Remote-Access VPNs** let traveling employees reach internal ERP servers from airport Wi-Fi without sniffing.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Welding Sealed Steel Tubes Inside Public Postal Trucks',
      analogy:
        'Sending plain office packets over the public internet is like driving open-bed pickup trucks full of confidential folders. **IPsec Tunnel Mode** puts the entire internal IP truck inside an armored, locked steel container (**new outer public IP header + AES encryption**) before driving over public ISP highways. Nobody watching the ISP wire can read who inside HQ is talking to whom, or alter a single byte without breaking the cryptographic seal (**HMAC/GCM integrity**).',
      technicalDefinition:
        'Internet Protocol Security (**IPsec**) is an IETF suite securing Layer 3 IP traffic with confidentiality (AES), integrity (SHA-256/HMAC), authentication (PSK or X.509 certificates), and anti-replay sequence numbers. **IKE** (**UDP 500**, or **UDP 4500** for NAT-Traversal) negotiates keys in Phase 1 and establishes **ESP** (**IP protocol 50**) **Tunnel Mode** Security Associations in Phase 2.',
      paragraphs: [
        '**Site-to-Site VPN**: always-on gateway-to-gateway tunnel linking `10.10.0.0/24` at HQ to `10.20.0.0/24` at a branch; workstations need zero VPN software.',
        '**Remote-Access VPN**: on-demand laptop/mobile client (Cisco Secure Client / AnyConnect) establishing a tunnel via IPsec IKEv2 or TLS/DTLS (TCP/UDP 443) back to an enterprise firewall.',
        'Always pick **ESP (IP protocol 50)** over **AH (IP protocol 51)** because **ESP encrypts payloads** (plus authenticates headers), whereas **AH does NOT encrypt** and breaks across NAT!',
        'Watch the remote-access routing choice: **Full Tunnel** routes *all* traffic (including YouTube/Teams) back through HQ for deep firewall inspection; **Split Tunnel** routes only corporate `10.0.0.0/8` prefixes through the VPN and sends general internet direct out the user’s home ISP.',
      ],
    },

    deepDive: {
      intro:
        'Trace the IKE Phase 1 -> Phase 2 lifecycle and compare Tunnel vs Transport headers.',
      steps: [
        {
          step: 'Phase 1',
          title: 'IKE Phase 1 (ISAKMP / IKEv2 Control Channel)',
          explanation:
            'Peers authenticate each other (Pre-Shared Key or RSA Certificates) and perform Diffie-Hellman (DH) key exchange over **UDP 500** (or **UDP 4500** if NAT sits in the path) to protect Phase 2 negotiations.',
        },
        {
          step: 'Phase 2',
          title: 'IKE Phase 2 (IPsec Data SAs)',
          explanation:
            'Inside the Phase 1 tunnel, peers agree on **ESP** encryption (AES-128/256-GCM) and "interesting traffic" subnets (Crypto ACL or VTI). Unidirectional **Security Associations (SAs)** are built (one inbound, one outbound).',
        },
        {
          step: 'Modes',
          title: 'Tunnel Mode vs. Transport Mode',
          explanation:
            '**Tunnel Mode** (standard for Site-to-Site & Remote-Access): wraps the *entire original IP packet* inside a brand-new outer public IP header. **Transport Mode**: keeps the original IP header and encrypts only the Layer 4 payload (used for GRE-over-IPsec or host-to-host).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'IPsec ESP Tunnel Mode Packet Structure Across the Public Internet',
        asciiFallback: `Internal Packet:  [Orig IP: 10.10.1.5 -> 10.20.1.8] [TCP + Confidential Data]
                                    |  (Wrapped by Branch Router R1!)
Public Internet:  [New Outer IP: 198.51.100.2 -> 203.0.113.2] [ESP Hdr] | ENCRYPTED (Orig IP + Data) | [ESP Auth Trailer]`,
      },
      workedExample: {
        title: 'Worked Troubleshooting: Site-to-Site Tunnel Stuck After NAT Firewall',
        context:
          'HQ (`203.0.113.2`) and Branch (`192.168.1.5` behind an ISP NAT router) fail Phase 2.',
        steps: [
          'Notice Branch firewall sits behind NAT (`192.168.1.5` -> ISP NAT `198.51.100.9`).',
          'Ensure **NAT-Traversal (`NAT-T`)** encapsulates ESP inside **UDP port 4500** because raw IP protocol 50 lacks TCP/UDP ports for PAT routers.',
          'Verify matching **Proxy IDs / Crypto ACLs** on both ends (`10.10.0.0/24 <-> 10.20.0.0/24` mirrored exactly!)—mismatched subnets are the #1 Phase 2 failure.',
        ],
        outcome:
          '`show crypto isakmp sa` displays `QM_IDLE` and `show crypto ipsec sa` shows incrementing `#pkts encaps` and `#pkts decaps`.',
      },
    },

    iosCliGuide: {
      intro:
        'Interpret `show crypto` commands on Cisco IOS gateways to verify healthy Phase 1 and Phase 2 tunnels.',
      commands: [
        {
          title: 'Verify IKE Phase 1 & IPsec ESP Phase 2 Counters',
          promptAndCommand: `R1# show crypto isakmp sa
R1# show crypto ipsec sa | include encaps|decaps`,
          output: `dst             src             state          conn-id status
203.0.113.2     198.51.100.2    QM_IDLE           1002 ACTIVE
   #pkts encaps: 412, #pkts encrypt: 412
   #pkts decaps: 409, #pkts decrypt: 409`,
          lineByLine: [
            { segment: 'QM_IDLE / ACTIVE', meaning: 'Healthy completed Phase 1 ISAKMP Security Association.' },
            { segment: '#pkts encaps & #pkts decaps', meaning: 'Both outbound encryption AND inbound decryption counters rising proves bidirectional tunnel flow!' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show crypto ipsec sa',
        healthyLabel: 'Bidirectional Encrypted Tunnel',
        healthyOutput: `#pkts encaps: 412, #pkts decaps: 409`,
        brokenLabel: 'One-Way Firewall Block / Routing Leak',
        brokenOutput: `#pkts encaps: 185, #pkts decaps: 0`,
        diagnosis:
          '`encaps` rising with `decaps: 0` proves packets leave toward the tunnel but return ESP (`IP proto 50`) or UDP 4500 replies are blocked or misrouted.',
      },
    },

    commonTraps: [
      {
        trap: 'Thinking IPsec **AH (Protocol 51)** encrypts traffic.',
        reality: 'AH provides integrity/authentication ONLY (zero confidentiality!). **ESP (Protocol 50)** encrypts payloads.',
      },
      {
        trap: 'Confusing **Site-to-Site VPN** with **Remote-Access VPN**.',
        reality: 'Site-to-Site connects entire LAN subnets gateway-to-gateway; Remote-Access runs client software on laptops for mobile users.',
      },
      {
        trap: 'Forgetting that **Tunnel Mode** creates a brand-new outer IP header while **Transport Mode** keeps the original IP header.',
        reality: 'Site-to-site RFC 1918 tunnels ALWAYS require **Tunnel Mode** so private `10.x` headers stay hidden inside public outer IPs.',
      },
    ],

    keyTerms: [
      {
        term: 'ESP (Encapsulating Security Payload)',
        shortDef: 'IPsec protocol (IP proto 50) providing encryption, integrity, and anti-replay.',
        fullDef: 'Core data-plane encapsulation for both Site-to-Site and Remote-Access IPsec tunnels.',
      },
      {
        term: 'IKE (UDP 500 / 4500)',
        shortDef: 'Two-phase key negotiation protocol building IPsec Security Associations.',
        fullDef: 'Phase 1 secures the control channel; Phase 2 creates ESP data keys; NAT-T switches to UDP 4500.',
      },
      {
        term: 'Full vs Split Tunneling',
        shortDef: 'Full sends all client traffic into VPN; Split sends only corporate prefixes into VPN.',
        fullDef: 'Balances central security inspection (Full) against HQ WAN bandwidth load (Split).',
      },
    ],

    checkQuestions: [
      {
        id: 'c45-q1',
        prompt: 'Which IPsec component provides BOTH packet payload **encryption** (Confidentiality) and **integrity** across an untrusted public internet link?',
        options: ['ESP (Encapsulating Security Payload — IP protocol 50)', 'AH (Authentication Header — IP protocol 51)', 'TFTP (UDP 69)', 'GRE without crypto'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **ESP** encrypts payloads and provides integrity/authentication.',
          'Incorrect: **AH** provides integrity and authentication only—payloads remain unencrypted!',
          'Incorrect: TFTP transfers files in cleartext.',
          'Incorrect: Plain GRE encapsulates without encryption.',
        ],
        takeaway: 'ESP = Encryption + Integrity; AH = Integrity ONLY (no encryption).',
      },
      {
        id: 'c45-q2',
        prompt: 'What does `QM_IDLE` alongside incrementing `#pkts encaps` AND `#pkts decaps` confirm during VPN troubleshooting?',
        options: [
          'IKE Phase 1 completed cleanly and encrypted traffic flows in both directions.',
          'Phase 1 stalled waiting for keys.',
          'Only outbound traffic works while return packets drop.',
          'The tunnel switched to plaintext AH.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `QM_IDLE` means healthy Phase 1, and non-zero rising `encaps` + `decaps` confirms bidirectional Phase 2 ESP.',
          'Incorrect: Stalled Phase 1 shows `MM_NO_STATE` or `MM_WAIT_MSG*`.',
          'Incorrect: One-way traffic shows `encaps > 0` with `decaps = 0`.',
          'Incorrect: Encapsulation/encryption counters show ESP operation.',
        ],
        takeaway: 'Verify `QM_IDLE` + BOTH `encaps` and `decaps` incrementing.',
      },
      {
        id: 'c45-q3',
        prompt: 'Why must **IPsec Tunnel Mode** (not Transport Mode) be used when connecting two RFC 1918 private branch LANs (`10.1.0.0/24` and `10.2.0.0/24`) over the public internet?',
        options: [
          'Tunnel Mode encrypts the entire original RFC 1918 IP header inside a new routable outer public IP header.',
          'Transport Mode doubles encryption strength automatically.',
          'Tunnel Mode eliminates the need for Phase 1.',
          'Transport Mode uses TCP port 80.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Public ISP routers drop RFC 1918 packets unless wrapped inside a new outer public IP header via Tunnel Mode.',
          'Incorrect: AES strength does not depend on Tunnel vs Transport mode.',
          'Incorrect: Both modes use IKE Phase 1/2.',
          'Incorrect: IPsec Transport Mode uses ESP/AH directly.',
        ],
        takeaway: 'Site-to-Site RFC 1918 VPNs require **Tunnel Mode** (new outer IP header).',
      },
      {
        id: 'c45-q4',
        prompt: 'A company wants remote employees’ corporate ERP traffic encrypted back to HQ while allowing Microsoft 365 video calls to exit directly out home broadband without congesting HQ’s WAN circuit. Which configuration meets this goal?',
        options: ['Remote-Access VPN with **Split Tunneling**', 'Remote-Access VPN with **Full Tunneling**', 'Static site-to-site AH tunnel', 'Disabling ESP encryption'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Split Tunneling** sends only specified corporate prefixes into the VPN tunnel while sending general SaaS/internet traffic directly local.',
          'Incorrect: Full Tunneling hairpins 100% of internet/video traffic through HQ.',
          'Incorrect: Site-to-site connects fixed branches, and AH does not encrypt.',
          'Incorrect: Never disable encryption on remote VPNs.',
        ],
        takeaway: 'Split Tunnel saves HQ WAN bandwidth; Full Tunnel enforces central security on all traffic.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Site-to-Site vs Remote-Access & Header Sketch',
      instructions: [
        'Draw an ESP Tunnel Mode packet showing Outer Public IP + ESP Header + Encrypted Inner Private IP + Payload.',
        'Compare Full Tunnel vs Split Tunnel trade-offs for hybrid workers.',
      ],
      verificationCheck: 'Explains IKE Phase 1 vs Phase 2, ESP vs AH, and Tunnel vs Transport cleanly.',
    },

    summaryBullets: [
      '**Site-to-Site VPNs** link permanent office LANs gateway-to-gateway; **Remote-Access VPNs** connect individual roaming devices.',
      'IKE negotiates Phase 1 (UDP `500`/`4500` control channel) then Phase 2 (unidirectional **ESP** Security Associations).',
      '**ESP (IP 50)** encrypts and authenticates payloads; **AH (IP 51)** authenticates only without encryption.',
      '**Tunnel Mode** wraps the entire original IP packet inside a new public outer IP header (mandatory across internet RFC 1918 links).',
      '**Split Tunneling** tunnels only corporate prefixes; **Full Tunneling** forces all traffic through HQ.',
    ],

    sourcesToVerify: [
      'Cisco IOS Security Configuration Guide — IPsec Data Plane & IKEv2 VPNs',
      'RFC 4303 — IP Encapsulating Security Payload (ESP)',
    ],
  },

  'ccna.core.sec.acls': {
    id: 'ccna.core.sec.acls',
    moduleId: 'ccna',
    unitTitle: 'Unit 5 / Unit 4: Network Services and Security',
    topicTitle: 'IPv4 Access Control Lists (ACLs)',
    code: '4.6.1',
    title: 'Configuring & Verifying Standard & Extended IPv4 ACLs (Wildcard Masks & Implicit Deny)',
    readMinutes: 14,
    prerequisites: ['IPv4 Subnetting'],
    versionScope: 'shared',
    v11ExamTopics: ['5.6 Configure and verify access control lists'],
    v20ExamTopics: ['4.6 Configure and verify IPv4 ACLs (standard, extended, numbered, named)'],

    learningObjectives: [
      'Compute **Wildcard Masks** cleanly (`255.255.255.255 - Subnet Mask`) and recognize special shortcuts (`host` = `0.0.0.0`, `any` = `255.255.255.255`).',
      'Explain **top-down first-match processing** and the invisible **`implicit deny any`** at the bottom of every Cisco ACL.',
      'Contrast **Standard ACLs** (source IP only, `1–99` / `1300–1999`, placed **closest to destination**) with **Extended ACLs** (source, destination, protocol, Layer 4 port, `100–199` / `2000–2699`, placed **closest to source**).',
      'Apply and reorder Named ACL rules cleanly via sequence numbers and verify live hit counts with `show access-lists`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'One `deny` ACL Without a Final `permit any` Silently Drops the Whole Subnet',
      narrative:
        'A junior engineer is asked: "Block Guest subnet `192.168.99.0/24` from reaching Finance server `10.10.20.50`, but allow everything else." They write a one-line ACL: `deny ip 192.168.99.0 0.0.0.255 host 10.10.20.50` and apply `ip access-group GUEST_IN in`. Within 5 seconds, Guest Wi-Fi stops reaching Google, DHCP, DNS—everything! Why? Every Cisco ACL ends with an invisible **`deny ip any any`**. Unless you add `permit ip any any` after specific denies, the ACL blocks 100% of remaining traffic!',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Nightclub Guest List Read Strict Top-to-Bottom by a Bouncer',
      analogy:
        'An **Access Control List (ACL)** is a numbered checklist held by a bouncer standing at a router interface door (**`in`** entering the router or **`out`** leaving the router). For every arriving packet, the bouncer reads line 10, then line 20, then line 30. **The instant ONE line matches, the bouncer stops reading** ("Permit" or "Deny") and never checks later lines! If the bouncer reaches the very bottom of the clipboard with zero matches, the invisible house rule at the bottom says: **"Not on the list? Denied!" (`implicit deny any`)**.',
      technicalDefinition:
        'Cisco IPv4 Access Control Lists filter packets sequentially top-down using Access Control Entries (ACEs) matched against **wildcard masks** (`0` = bit must match strictly; `1` = don’t care). **Standard ACLs** inspect source IPv4 addresses only and belong near the **destination**; **Extended ACLs** inspect Layer 3 source/destination plus Layer 4 protocol/ports (`eq 443`, `eq 22`) and belong near the **source**; every ACL terminates with an implicit `deny any`.',
      paragraphs: [
        'Wildcard math takes 3 seconds using subtraction from `255.255.255.255`: for `/24` (`255.255.255.0`), wildcard = `0.0.0.255`. For `/26` (`255.255.255.192`), wildcard = `0.0.0.63`. For a single host `/32`, wildcard = `0.0.0.0` (shortcut keyword: **`host 10.10.20.50`**).',
        'Memorize **Placement Rules**: **Standard ACLs** filter *only* by source IP, so putting a Standard `deny 192.168.10.0` close to the PC breaks *everything* that PC tries to reach! Place Standard ACLs **close to the destination**. **Extended ACLs** check *both* source + destination + TCP/UDP port, so place Extended ACLs **close to the source** to drop unwanted packets early without wasting WAN bandwidth.',
        'Note two huge operational rules: (1) Router-generated traffic (traffic originated by the router itself) is NOT filtered by an **outbound** ACL on that router; (2) Because standard Cisco IOS ACLs are **stateless** (unlike NGFWs), filtering return TCP traffic inbound on a WAN link can use **`permit tcp any any established`** (matching packets with `ACK` or `RST` flags set so only replies to outbound-initiated sessions pass, blocking unsolicited `SYN` connections); (3) Using **Named ACLs** (`ip access-list extended WEB_FILTER`) lets you insert, delete, or adjust single lines by **sequence number** (`10`, `20`, `30`) without wiping the whole ACL!',
      ],
    },

    deepDive: {
      intro:
        'Master ACL syntax, wildcard calculations, sequence editing, and directional `in` vs `out` verification.',
      steps: [
        {
          step: 'Rule 1',
          title: 'Standard vs. Extended Number Ranges & Fields',
          explanation:
            'Standard: `1–99` or `1300–1999` (Source IP only). Extended: `100–199` or `2000–2699` (Protocol `ip/tcp/udp/icmp`, Source IP/Wildcard, Source port optional, Dest IP/Wildcard, Dest port e.g. `eq 80` / `eq 443` / `eq 22`). Named ACLs (`ip access-list standard/extended NAME`) support both cleanly.',
        },
        {
          step: 'Rule 2',
          title: 'Top-Down Most-Specific-First Ordering & Sequence Numbers',
          explanation:
            'If line 10 says `permit ip 10.1.0.0 0.0.255.255 any` and line 20 says `deny host 10.1.5.5 any`, line 20 NEVER executes because line 10 already matched! Always place specific host/port `deny` rules **above** broader `permit` summaries.',
        },
        {
          step: 'Rule 3',
          title: 'Binding Direction: `ip access-group NAME in|out` vs VTY `access-class`',
          explanation:
            'On routed ports/SVIs, use `ip access-group NAME in` (checked before routing!) or `out` (checked after routing). On VTY management lines (`line vty 0 15`), ALWAYS use **`access-class ADMIN_NET in`** (not `ip access-group`!).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Top-Down ACL Evaluation Flow & Interface Direction Placement',
        asciiFallback: `Packet enters Gi0/0 (ip access-group LAN_IN in):
   |--> Line 10: deny tcp 10.1.2.0 0.0.0.255 host 10.9.9.5 eq 22  (Match -> DROP!)
   |--> Line 20: permit ip 10.1.2.0 0.0.0.255 any                (Match -> ROUTE!)
   |--> [Implicit End]: deny ip any any                          (No match above -> DROP!)`,
      },
      workedExample: {
        title: 'Worked Named Extended ACL Design & Sequence Edit',
        context:
          'Allow HR (`10.10.20.0/26`) to reach HTTPS (`443`) on ERP server `172.16.1.10`, block SSH (`22`) from HR to `172.16.1.0/24`, and allow all other IP traffic.',
        steps: [
          'Compute `/26` wildcard: `255.255.255.255 - 255.255.255.192 = 0.0.0.63`.',
          'Write Named Extended ACL (most specific first):\n  `ip access-list extended HR_FILTER`\n  `10 permit tcp 10.10.20.0 0.0.0.63 host 172.16.1.10 eq 443`\n  `20 deny tcp 10.10.20.0 0.0.0.63 172.16.1.0 0.0.0.255 eq 22`\n  `30 permit ip any any`',
          'Place **closest to HR source**: on HR’s ingress router interface `Gi0/0`, run `ip access-group HR_FILTER in`.',
          'Later need to insert a block on Telnet (`23`) before line 30? Enter `ip access-list extended HR_FILTER` and run `25 deny tcp 10.10.20.0 0.0.0.63 172.16.1.0 0.0.0.255 eq 23`!',
        ],
        outcome:
          'HR users access ERP HTTPS normally, SSH/Telnet to servers are dropped immediately at HR’s edge without crossing the core, and `show access-lists` tracks live match counters.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure Named Extended ACLs, edit by sequence number, and inspect live hit counters.',
      commands: [
        {
          title: 'Configure Named Extended ACL & Verify Hit Counters',
          promptAndCommand: `R1(config)# ip access-list extended HR_FILTER
R1(config-ext-nacl)# 10 permit tcp 10.10.20.0 0.0.0.63 host 172.16.1.10 eq 443
R1(config-ext-nacl)# 20 deny tcp 10.10.20.0 0.0.0.63 172.16.1.0 0.0.0.255 eq 22
R1(config-ext-nacl)# 30 permit ip any any
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip access-group HR_FILTER in`,
          output: `R1# show access-lists HR_FILTER
Extended IP access list HR_FILTER
    10 permit tcp 10.10.20.0 0.0.0.63 host 172.16.1.10 eq 443 (248 matches)
    20 deny tcp 10.10.20.0 0.0.0.63 172.16.1.0 0.0.0.255 eq 22 (14 matches)
    30 permit ip any any (1920 matches)`,
          lineByLine: [
            { segment: '0.0.0.63', meaning: 'Wildcard mask for `/26` (`255.255.255.192`): last 6 bits don’t care.' },
            { segment: 'host 172.16.1.10', meaning: 'Shortcut equal to `172.16.1.10 0.0.0.0` (exact single IP).' },
            { segment: '(14 matches)', meaning: 'Proves line 20 actively matched and dropped 14 unauthorized SSH packets.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show access-lists',
        healthyLabel: 'Specific Rules Matching Above Permit Any',
        healthyOutput: `10 deny tcp 10.10.20.0 0.0.0.63 any eq 23 (12 matches)
20 permit ip any any (890 matches)`,
        brokenLabel: 'Shadowed Rule / Missing Explicit Permit',
        brokenOutput: `10 permit ip 10.10.20.0 0.0.0.63 any (902 matches)
20 deny tcp 10.10.20.0 0.0.0.63 any eq 23 (0 matches!)`,
        diagnosis:
          'When `0 matches` stays stuck below a broad `permit`, top-down order matched line 10 first—swap sequence numbers so specific `deny` sits *above* broad `permit`.',
      },
    },

    commonTraps: [
      {
        trap: 'Forgetting the invisible `implicit deny any` at the end of every ACL.',
        reality: 'An ACL containing only `deny` statements drops 100% of traffic unless followed by an explicit `permit ip any any` (or `permit any`).',
      },
      {
        trap: 'Confusing **Standard** vs **Extended** placement.',
        reality: '**Standard** = close to **Destination** (only inspects source IP); **Extended** = close to **Source** (drops bad flows before crossing the network).',
      },
      {
        trap: 'Applying an interface ACL with `access-class` or a VTY filter with `ip access-group`.',
        reality: 'Interfaces use **`ip access-group <name> in|out`**; VTY lines use **`access-class <name> in`**!',
      },
      {
        trap: 'Putting a subnet mask (`255.255.255.0`) instead of a wildcard (`0.0.0.255`) into an IPv4 ACL.',
        reality: 'IOS expects a **wildcard mask** where `0` = must match and `1` = ignore (`255.255.255.255 - subnet mask`).',
      },
    ],

    keyTerms: [
      {
        term: 'Wildcard Mask',
        shortDef: '32-bit inverse mask where `0` means bit must match and `1` means ignore.',
        fullDef: 'Computed via `255.255.255.255 - Subnet Mask` (e.g., `/24` -> `0.0.0.255`, `/27` -> `0.0.0.31`).',
      },
      {
        term: 'Implicit Deny',
        shortDef: 'Invisible `deny ip any any` appended automatically to the bottom of every ACL.',
        fullDef: 'Drops any packet matching zero prior ACE lines; remember to add explicit `permit` if needed.',
      },
      {
        term: 'ip access-group vs access-class',
        shortDef: '`ip access-group` binds ACLs to interfaces; `access-class` binds ACLs to VTY lines.',
        fullDef: 'Always verify active interface ACLs with `show ip interface <int>` and hit counts with `show access-lists`.',
      },
    ],

    checkQuestions: [
      {
        id: 'c46-q1',
        prompt: 'What is the correct Cisco IPv4 **wildcard mask** matching subnet `192.168.50.128/27` (`255.255.255.224`)?',
        options: ['`0.0.0.31`', '`0.0.0.224`', '`0.0.0.63`', '`0.0.0.255`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `255.255.255.255 - 255.255.255.224 = 0.0.0.31` (32 addresses total in a `/27`, block size - 1 = 31).',
          'Incorrect: `.224` is the subnet mask itself, not the wildcard mask.',
          'Incorrect: `0.0.0.63` corresponds to `/26` (`255.255.255.192`).',
          'Incorrect: `0.0.0.255` corresponds to `/24`.',
        ],
        takeaway: 'Wildcard mask = `255.255.255.255 - Subnet Mask` (always Block Size - 1).',
      },
      {
        id: 'c46-q2',
        prompt: 'You configure Extended ACL `BLOCK_SSH`:\n`10 permit ip 10.1.0.0 0.0.255.255 any`\n`20 deny tcp host 10.1.5.10 any eq 22`\nWhy can `10.1.5.10` STILL open SSH sessions?',
        options: [
          'ACLs evaluate top-down and stop on the first match—line 10 permits all `10.1.x.x` traffic before line 20 is ever reached.',
          'Extended ACLs cannot filter TCP port 22.',
          '`host 10.1.5.10` requires wildcard `255.255.255.255`.',
          'The implicit deny overrides line 20.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Top-down first-match logic stops at line 10 (`10.1.5.10` matches `10.1.0.0 0.0.255.255`). Put `deny` at sequence `5` above line `10`!',
          'Incorrect: Extended ACLs routinely match TCP/UDP port 22.',
          'Incorrect: `host` equals `0.0.0.0`.',
          'Incorrect: Implicit deny only runs at the bottom if nothing matched.',
        ],
        takeaway: 'Place specific `deny` statements **above** general `permit` rules.',
      },
      {
        id: 'c46-q3',
        prompt: 'Where should a **Standard IPv4 ACL** (`1–99`) ideally be placed, and why?',
        options: [
          'Closest to the **destination**, because it filters only on source IP and placing it near the source would block unintended destinations.',
          'Closest to the **source**, to save WAN bandwidth.',
          'Strictly on Loopback interfaces.',
          'Inside `line vty 0 15` using `ip access-group`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Because Standard ACLs only check source IP (no destination/port matching), placing them near the destination limits collateral blocking.',
          'Incorrect: Closest to source is the rule for **Extended** ACLs.',
          'Incorrect: Traffic ACLs attach to transit interfaces.',
          'Incorrect: VTY lines use `access-class`, not `ip access-group`.',
        ],
        takeaway: 'Standard = near Destination; Extended = near Source.',
      },
      {
        id: 'c46-q4',
        prompt: 'An engineer writes a single-line ACL `access-list 10 deny 192.168.4.5` and binds `ip access-group 10 in` on `Gi0/0`. Suddenly EVERY host on `Gi0/0` loses all connectivity. Why?',
        options: [
          'The invisible **`implicit deny any`** at the bottom drops every packet that did not match `192.168.4.5`.',
          'Standard ACLs block DHCP automatically.',
          'Access-list 10 requires `overload`.',
          'Binding `in` shuts down the interface.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: An ACL with zero `permit` entries ends in `implicit deny any`, dropping 100% of other hosts until `access-list 10 permit any` is added.',
          'Incorrect: Only the missing `permit any` caused the full drop.',
          'Incorrect: `overload` applies to NAT, not packet filtering.',
          'Incorrect: `in` is standard inbound filtering.',
        ],
        takeaway: 'Never write an ACL containing only `deny` rules without a trailing `permit` rule.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Author & Debug Named Extended ACLs',
      targetTab: 'labs',
      instructions: [
        'Practice converting `/25`, `/26`, `/27`, `/28`, `/30` subnet masks into wildcard masks mentally.',
        'Build a Named Extended ACL permitting HTTPS while denying Telnet/SSH to a server subnet, plus explicit `permit ip any any`.',
      ],
      verificationCheck: 'Uses sequence numbers cleanly, verifies `show access-lists` hit counts, and obeys Standard/Extended placement.',
    },

    summaryBullets: [
      'Wildcard masks invert subnet masks (`255.255.255.255 - Mask`): `0` = must match, `1` = ignore.',
      'ACLs evaluate **top-down** and stop at the **first matching line**; place specific rules above broad summaries.',
      'Every ACL ends with an invisible **`implicit deny any`**—include explicit `permit` lines when needed.',
      '**Standard ACLs** (source IP only) belong near the **destination**; **Extended ACLs** (src/dst/protocol/port) belong near the **source**.',
      'Interfaces bind via `ip access-group NAME in|out`; VTY management uses `access-class NAME in`.',
    ],

    sourcesToVerify: [
      'Cisco IOS XE Security Configuration Guide — Configuring IPv4 Access Control Lists',
    ],
  },

  'ccna.core.sec.layer2-security': {
    id: 'ccna.core.sec.layer2-security',
    moduleId: 'ccna',
    unitTitle: 'Unit 5 / Unit 4: Layer 2 Switch Security',
    topicTitle: 'L2 Switch Security (DHCP Snooping, DAI, Port Security, Storm Control, RA Guard)',
    code: '4.7.1',
    title: 'Layer 2 Security: DHCP Snooping, Dynamic ARP Inspection, Port Security, Storm Control & IPv6 RA Guard',
    readMinutes: 14,
    prerequisites: ['DHCPv4', 'Edge Host Ports'],
    versionScope: 'shared',
    v11ExamTopics: ['5.7 Configure and verify Layer 2 security features (DHCP snooping, dynamic ARP inspection, and port security)'],
    v20ExamTopics: ['4.7 Configure and verify Layer 2 security features (DHCP snooping, dynamic ARP inspection, storm control, RA guard, port security)'],

    learningObjectives: [
      'Configure **Port Security** (`maximum`, `mac-address sticky`, and violation modes `shutdown` vs `restrict` vs `protect`) to block MAC flooding and unauthorized switch-port plugs.',
      'Configure **DHCP Snooping** (**Trusted** uplinks vs **Untrusted** edge ports) to block rogue DHCP servers and build the **DHCP Snooping Binding Table**.',
      'Configure **Dynamic ARP Inspection (DAI)** relying on the DHCP Snooping table to stop ARP poisoning / Man-in-the-Middle attacks.',
      'Configure **Storm Control** broadcast/multicast thresholds and **IPv6 RA Guard** (`ipv6 nd raguard`, CCNA v2.0) to prevent rogue IPv6 gateways and L2 floods.',
    ],

    whyThisMatters: {
      scenarioTitle: 'A Plug-In Laptop Hijacks Every PC’s Default Gateway in 30 Seconds',
      narrative:
        'An employee plugs a personal travel router backward into an office desk jack. Immediately it answers DHCP offers faster than headquarters—handing nearby PCs itself as their default gateway! Meanwhile another malware host sends forged gratuitous ARPs ("I am 10.10.1.1!") to intercept every workstation’s traffic (**ARP poisoning**), or blasts 100,000 broadcast frames/sec (**broadcast storm**). Layer 3 firewalls cannot see traffic bouncing inside the same VLAN—only **Layer 2 Switch Security** stops these LAN-side attacks right at the access port.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Building Security Guarding the Lobby Directory, Keycards & Megaphones',
      analogy:
        'Inside a shared floor (VLAN), normal Ethernet switches trust everyone completely. Layer 2 security installs five strict rules on user desk ports: (1) **Port Security** checks IDs ("Only 1 registered laptop MAC allowed on Desk 4!"); (2) **DHCP Snooping** enforces "Only the official uplink closet (`trust`) may hand out IP leases; desk ports (`untrusted`) cannot pretend to be DHCP servers!"; (3) **Dynamic ARP Inspection (DAI)** cross-checks every ARP reply against that official DHCP ledger—catching ARP impersonators cold; (4) **Storm Control** mutes anyone screaming into a megaphone above 80% bandwidth; (5) **IPv6 RA Guard** stops rogue laptops from announcing fake IPv6 default gateways.',
      technicalDefinition:
        'Cisco Catalyst Layer 2 access security binds five complementary controls to `switchport mode access` ports: **Port Security** limits learned source MAC counts and reacts via `protect`, `restrict`, or `shutdown` (`err-disabled`); **DHCP Snooping** separates `ip dhcp snooping trust` uplinks from untrusted edge ports while building an IP-to-MAC-to-VLAN binding database; **DAI (`ip arp inspection`)** validates ARP packets against that binding database; **Storm Control** suppresses excessive broadcast/multicast/unicast storms; **IPv6 RA Guard** filters Router Advertisement messages on host-facing ports.',
      paragraphs: [
        'Notice the critical dependency between **DHCP Snooping** and **Dynamic ARP Inspection (DAI)**: **ALWAYS configure DHCP Snooping FIRST!** DAI reads the DHCP Snooping Binding Table (`show ip dhcp snooping binding`) to verify whether the PC sending an ARP for `10.10.1.25` actually owns `10.10.1.25`. (Static-IP servers need manual ARP ACLs or `ip arp inspection trust`.)',
        'For BOTH DHCP Snooping and DAI: **all access ports default to `untrusted` automatically**! You ONLY add `ip dhcp snooping trust` and `ip arp inspection trust` on **uplink trunks leading toward legitimate DHCP servers and routers**—never on user desk ports!',
        'Compare all three **Port Security violation modes**:\n• **`shutdown`** (default): immediately disables the port (`err-disabled`), sends SNMP/syslog alert, increments counter. Recover with `shutdown` -> `no shutdown`.\n• **`restrict`**: drops rogue MAC frames, leaves port up, **sends syslog/SNMP alert + increments security-violation counter**.\n• **`protect`**: silently drops rogue frames with **no syslog alert and no counter increment**.',
      ],
    },

    deepDive: {
      intro:
        'Assemble the full Catalyst Layer 2 hardening playbook across edge ports and uplinks.',
      steps: [
        {
          step: 'Feature 1',
          title: 'Port Security (`switchport port-security`)',
          explanation:
            'Requires port to be explicitly static `switchport mode access` (or trunk), NOT dynamic auto/desirable. Enable `switchport port-security`, set `maximum 2` (e.g., 1 PC + 1 IP Phone), optional `mac-address sticky` (dynamically saves learned MACs into running-config), and violation mode (`shutdown` default, `restrict`, or `protect`).',
        },
        {
          step: 'Feature 2',
          title: 'DHCP Snooping (`ip dhcp snooping`)',
          explanation:
            'Enable globally (`ip dhcp snooping`), specify target VLANs (`ip dhcp snooping vlan 10,20`), and optionally disable Option 82 insertion (`no ip dhcp snooping information option`) if upstream DHCP servers reject Option 82 from L2 switches. Trust ONLY uplinks toward real DHCP servers (`ip dhcp snooping trust`).',
        },
        {
          step: 'Feature 3',
          title: 'Dynamic ARP Inspection (`ip arp inspection`)',
          explanation:
            'Enable per VLAN (`ip arp inspection vlan 10,20`). Untrusted edge ports drop any ARP packet whose Sender IP + Sender MAC disagrees with the DHCP Snooping Binding Table. Mark router/switch uplinks with `ip arp inspection trust`.',
        },
        {
          step: 'Feature 4',
          title: 'Storm Control & IPv6 RA Guard (v2.0 4.7)',
          explanation:
            'On access ports: `storm-control broadcast level 50.00` (throttles broadcast storms exceeding 50% port bandwidth; optional `storm-control action shutdown/trap`). To block rogue IPv6 Router Advertisements on IPv6-capable VLANs: define `ipv6 nd raguard policy HOST_POLICY` (default host role blocks RAs) and attach `ipv6 nd raguard attach-policy HOST_POLICY` on edge ports!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Trusted Uplinks vs Hardened Untrusted Edge Ports',
        asciiFallback: `[Legit DHCP Server & Router]
         |
   [Gi0/1: TRUSTED Uplink]  --> ip dhcp snooping trust + ip arp inspection trust
         |
   [Access Switch SW1]  (ip dhcp snooping vlan 10 + ip arp inspection vlan 10)
         |
   [Gi0/5: UNTRUSTED Edge]  --> Port Security (max 1, sticky), Storm Control (50%),
                                DHCP Snooping Untrusted (Drops rogue DHCP Offers!),
                                DAI Untrusted (Drops forged ARPs!), IPv6 RA Guard`,
      },
      workedExample: {
        title: 'Worked L2 Hardening Rollout on Access Port `Gi0/5` & Uplink `Gi0/1`',
        context:
          'Users on VLAN 10 (`Gi0/5–24`) connect to a distribution switch over trunk `Gi0/1`. Lock down the switch without breaking legitimate DHCP.',
        steps: [
          'Global config: `ip dhcp snooping`, `ip dhcp snooping vlan 10`, `no ip dhcp snooping information option`, and `ip arp inspection vlan 10`.',
          'Uplink `Gi0/1`: configure `ip dhcp snooping trust` AND `ip arp inspection trust`.',
          'Edge ports `Gi0/5–24`: `switchport mode access`, `switchport access vlan 10`, `switchport port-security`, `switchport port-security maximum 2`, `switchport port-security mac-address sticky`, `switchport port-security violation restrict`.',
          'Add Storm Control & RA Guard: `storm-control broadcast level 40`, `ipv6 nd raguard attach-policy HOST_RA_BLOCK`.',
        ],
        outcome:
          'Rogue DHCP servers, ARP poisoners, unauthorized laptops, broadcast loops, and fake IPv6 gateways are all stopped at the wire.',
      },
    },

    iosCliGuide: {
      intro:
        'Configure and inspect Port Security, DHCP Snooping bindings, DAI drops, Storm Control, and IPv6 RA Guard.',
      commands: [
        {
          title: 'Configure L2 Hardening & Verify Live Tables',
          promptAndCommand: `SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10
SW1(config)# ip arp inspection vlan 10
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# ip dhcp snooping trust
SW1(config-if)# ip arp inspection trust
SW1(config)# interface GigabitEthernet0/5
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security violation restrict
SW1(config-if)# storm-control broadcast level 40`,
          output: `SW1# show ip dhcp snooping binding
MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface
------------------  ---------------  ----------  -------------  ----  --------------------
0050.56AB.1122      10.10.10.42      86310       dhcp-snooping   10    GigabitEthernet0/5`,
          lineByLine: [
            { segment: 'ip dhcp snooping trust', meaning: 'Mandatory on uplinks so legitimate DHCP Offers/ACKs are permitted.' },
            { segment: 'show ip dhcp snooping binding', meaning: 'Displays verified MAC-to-IP leases powering Dynamic ARP Inspection (DAI).' },
            { segment: 'violation restrict', meaning: 'Drops unauthorized MAC packets and logs alerts without err-disabling the port.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show port-security interface GigabitEthernet0/5',
        healthyLabel: 'Active Port Security (Up)',
        healthyOutput: `Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Shutdown
Security Violation Count   : 0`,
        brokenLabel: 'Err-Disabled / Rogue MAC Triggered',
        brokenOutput: `Port Security              : Enabled
Port Status                : Secure-shutdown
Security Violation Count   : 1 (Line protocol down err-disabled)`,
        diagnosis:
          'When `Secure-shutdown` triggers, inspect logs (`show interface status err-disabled`), unplug the unauthorized device, and run `shutdown` followed by `no shutdown` on the port.',
      },
    },

    commonTraps: [
      {
        trap: 'Enabling `ip dhcp snooping vlan 10` and forgetting `ip dhcp snooping trust` on the uplink trunk!',
        reality: 'Every port defaults to **untrusted**—forgetting `trust` on the uplink drops ALL legitimate DHCP Offers from your corporate server!',
      },
      {
        trap: 'Putting `switchport port-security` on a port still set to `dynamic auto`.',
        reality: 'IOS rejects Port Security until the port is explicitly set to `switchport mode access` (or `trunk`).',
      },
      {
        trap: 'Mixing up **`protect`** vs **`restrict`** violation modes.',
        reality: 'Both drop bad frames and keep the link up, yet ONLY **`restrict`** increments the violation counter and sends syslog/SNMP traps (`protect` stays completely silent).',
      },
      {
        trap: 'Enabling **DAI** before **DHCP Snooping** or forgetting static-IP hosts.',
        reality: 'Without DHCP Snooping entries (or manual ARP ACLs for static servers), DAI drops all ARP packets on untrusted ports.',
      },
    ],

    keyTerms: [
      {
        term: 'Port Security',
        shortDef: 'Limits authorized source MAC addresses per switch port (`shutdown`, `restrict`, `protect`).',
        fullDef: 'Defeats CAM table overflow (MAC flooding) and unauthorized device swaps on access jacks.',
      },
      {
        term: 'DHCP Snooping',
        shortDef: 'Drops DHCP Server Offers/ACKs on untrusted ports and builds the IP-MAC binding table.',
        fullDef: 'Requires both global `ip dhcp snooping` + `vlan <id>` and `trust` on uplinks.',
      },
      {
        term: 'DAI (Dynamic ARP Inspection)',
        shortDef: 'Validates ARP requests/replies against the DHCP Snooping binding table to defeat MitM.',
        fullDef: 'Drops spoofed gratuitous ARPs attempting ARP cache poisoning.',
      },
      {
        term: 'Storm Control & IPv6 RA Guard',
        shortDef: 'Storm Control throttles broadcast floods; RA Guard drops rogue IPv6 Router Advertisements.',
        fullDef: 'Added explicitly to CCNA v2.0 Domain 4.7 to contain L2 saturation and rogue IPv6 SLAAC gateways.',
      },
    ],

    checkQuestions: [
      {
        id: 'c47-q1',
        prompt: 'An engineer enables `ip dhcp snooping` and `ip dhcp snooping vlan 20` on Switch SW1. Immediately afterward, NO client in VLAN 20 can obtain an IP address from the central DHCP server reachable over trunk `Gi0/1`. What step was missed?',
        options: [
          'Configuring `ip dhcp snooping trust` on uplink trunk `Gi0/1`',
          'Configuring `ip dhcp snooping trust` on every user access port',
          'Disabling Port Security on `Gi0/1`',
          'Enabling `ip helper-address` on `Gi0/1`',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: All ports default to untrusted once DHCP snooping starts; the uplink trunk toward the real DHCP server MUST have `ip dhcp snooping trust`.',
          'Incorrect: Never mark user access ports trusted, or a user can run a rogue DHCP server.',
          'Incorrect: Port security isn’t blocking DHCP here.',
          'Incorrect: If `Gi0/1` is an L2 uplink in the same broadcast path toward the router/server, trust is the missing L2 snooping directive.',
        ],
        takeaway: 'With DHCP Snooping enabled, ALWAYS trust the uplink toward legitimate DHCP servers (`ip dhcp snooping trust`).',
      },
      {
        id: 'c47-q2',
        prompt: 'Which **Port Security violation mode** drops frames from an unauthorized MAC address, keeps the port `up/up` so the existing user stays online, AND logs syslog alerts / increments the violation counter?',
        options: ['`restrict`', '`protect`', '`shutdown`', '`err-disable`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **`restrict`** keeps the port up, drops unauthorized frames, sends syslog/SNMP notifications, and increments the violation counter.',
          'Incorrect: **`protect`** drops frames quietly with NO syslog alert and NO counter increment.',
          'Incorrect: **`shutdown`** (default) takes the entire port offline into `err-disabled`.',
          'Incorrect: `err-disabled` is the resulting state of `shutdown`, not a mode keyword.',
        ],
        takeaway: '`shutdown` = port down; `restrict` = port up + drop + log; `protect` = port up + silent drop.',
      },
      {
        id: 'c47-q3',
        prompt: 'On which Layer 2 database does **Dynamic ARP Inspection (DAI)** primarily rely to verify whether an incoming ARP packet is legitimate?',
        options: [
          'The **DHCP Snooping Binding Table**',
          'The OSPFv2 Link-State Database',
          'The Spanning-Tree Root Bridge ID',
          'The DNS reverse PTR cache',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: DAI matches incoming ARP Sender IP + MAC against verified leases in `show ip dhcp snooping binding` (plus optional ARP ACLs for static hosts).',
          'Incorrect: OSPF LSDB holds Layer 3 routing topology.',
          'Incorrect: STP tracks loop-free forwarding paths.',
          'Incorrect: DNS maps hostnames, not L2 ARP validation.',
        ],
        takeaway: 'Configure **DHCP Snooping** cleanly BEFORE turning on **Dynamic ARP Inspection (DAI)**.',
      },
      {
        id: 'c47-q4',
        prompt: 'Which CCNA v2.0 Layer 2 security control blocks a malicious employee’s laptop on an access port from impersonating an IPv6 default gateway via SLAAC messages?',
        options: ['**IPv6 RA Guard** (`ipv6 nd raguard`)', 'Storm Control', 'DTP desirable mode', 'TFTP filtering'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **IPv6 RA Guard** drops unauthorized ICMPv6 Router Advertisement (`RA`) packets on host-facing switch ports.',
          'Incorrect: Storm Control limits high traffic rates (broadcast/multicast/unicast), not forged RA content.',
          'Incorrect: DTP negotiates 802.1Q trunking.',
          'Incorrect: TFTP has nothing to do with ICMPv6 neighbor discovery.',
        ],
        takeaway: '**IPv6 RA Guard** stops rogue IPv6 Router Advertisements on untrusted access ports.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Switch Access Hardening Bundle (Port Security + Snooping + DAI)',
      targetTab: 'labs',
      instructions: [
        'Configure `switchport mode access`, `switchport port-security`, `ip dhcp snooping` + `vlan`, and `ip arp inspection` on edge ports, plus `trust` on uplinks.',
        'Practice recovering an `err-disabled` port cleanly with `shutdown` -> `no shutdown`.',
      ],
      verificationCheck: 'Separates trusted uplinks from untrusted access ports across Snooping, DAI, Port Security, Storm Control, and RA Guard.',
    },

    summaryBullets: [
      '**Port Security** caps MAC addresses per access port; violation modes are `shutdown` (err-disable), `restrict` (drop + log), and `protect` (silent drop).',
      '**DHCP Snooping** blocks rogue DHCP offers on untrusted ports and builds the verified IP-MAC binding database.',
      '**DAI (Dynamic ARP Inspection)** checks untrusted ARP packets against the DHCP Snooping binding database.',
      'Mark ONLY uplinks toward real servers/routers with `ip dhcp snooping trust` and `ip arp inspection trust`.',
      '**Storm Control** caps excessive L2 floods while **IPv6 RA Guard** (`ipv6 nd raguard`) drops rogue IPv6 Router Advertisements.',
    ],

    sourcesToVerify: [
      'Cisco Catalyst IOS XE Security Configuration Guide — Port Security, DHCP Snooping, DAI, Storm Control & RA Guard',
    ],
  },

  'ccna.v11.5.9': {
    id: 'ccna.v11.5.9',
    moduleId: 'ccna',
    unitTitle: 'Unit 5: Security Fundamentals (v1.1)',
    topicTitle: '5.9 Wireless Security Protocols (WPA, WPA2, WPA3)',
    code: '5.9.1',
    title: 'Wireless Security Evolution: TKIP vs AES-CCMP vs GCMP & SAE (WPA -> WPA2 -> WPA3)',
    readMinutes: 11,
    prerequisites: ['1.11.1 Wireless Principles'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['5.9 Describe wireless security protocols (WPA, WPA2, and WPA3)'],

    learningObjectives: [
      'Compare encryption ciphers and key protocols across **WEP** (broken RC4), **WPA** (**TKIP**, deprecated), **WPA2** (**AES-CCMP**, 4-way handshake), and **WPA3** (**SAE** + **AES-GCMP** / **PMF**).',
      'Distinguish **Personal (PSK / SAE)** authentication from **Enterprise (802.1X / EAP + RADIUS)** authentication.',
      'Explain why **WPA3-Personal Simultaneous Authentication of Equals (SAE)** defeats offline dictionary brute-force attacks and provides forward secrecy.',
      'Explain **Protected Management Frames (PMF / 802.11w)** and **Opportunistic Wireless Encryption (OWE)** on open hotspots.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Capturing a 4-Way Handshake in a Parking Lot Cracks Weak WPA2-PSK Passwords',
      narrative:
        'Because Wi-Fi travels invisibly through walls and parking lots, an attacker sitting outside your office never needs a wall jack to sniff frames! Under legacy **WPA2-PSK**, an attacker simply records the 4-way handshake when a laptop joins and runs GPU dictionary software offline—testing millions of guesses per second silently! Upgrading to **WPA3-Personal (SAE)** or **WPA2/WPA3-Enterprise (802.1X + RADIUS)** completely shuts down offline guessing.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Trading a Shared Locker Combo vs Private One-Time Math Challenges',
      analogy:
        'Under **WPA2-PSK**, everyone shares one static passphrase, and during login the airwaves carry predictable puzzle clues derived from that passphrase—allowing an eavesdropper sitting in a car to drive home and test millions of guesses offline on a fast computer! **WPA3-Personal (SAE / "Dragonfly")** forces the laptop and AP to run a live, interactive cryptographic handshake so the eavesdropper gets **one guess per live connection attempt**—making offline dictionary cracking useless.',
      technicalDefinition:
        'IEEE 802.11 / Wi-Fi Alliance security matured across three generations: **WPA** introduced **TKIP** (RC4 wrapper, deprecated); **WPA2** mandated **AES-CCMP** block encryption with 4-way PSK or 802.1X/EAP keys; **WPA3** adds **SAE (Simultaneous Authentication of Equals)** for forward-secret personal auth, mandatory **Protected Management Frames (PMF / 802.11w)** preventing forged deauth attacks, **OWE** encryption for open networks, and optional **192-bit CNSA suite (AES-GCMP-256)** in WPA3-Enterprise.',
      paragraphs: [
        'For CCNA v1.1 Topic 5.9, memorize the exact cipher mapping:\n• **WPA** = **TKIP** (vulnerable, legacy RC4 compatibility—avoid!)\n• **WPA2** = **AES-CCMP** (128-bit AES; solid encryption, yet PSK mode vulnerable to offline dictionary attacks if passphrase is weak)\n• **WPA3** = **AES-CCMP** / **AES-GCMP** + **SAE** (stops offline password cracking!) + mandatory **PMF**.',
        'Also know **Personal vs Enterprise**: **Personal** (`PSK` in WPA2, `SAE` in WPA3) shares one passphrase across every user—simple for guests/home, risky if one employee leaves. **Enterprise (`802.1X / EAP`)** authenticates *each user or device uniquely* against a central **RADIUS** server (e.g., Cisco ISE) via **PEAP** or certificate-based **EAP-TLS**.',
      ],
    },

    deepDive: {
      intro:
        'Compare WPA, WPA2, and WPA3 security capabilities across ciphers, handshakes, and enterprise modes.',
      steps: [
        {
          step: 'Gen 1',
          title: 'WPA (TKIP — Deprecated)',
          explanation:
            'Emergency bridge replacing broken WEP by wrapping RC4 with Temporal Key Integrity Protocol (`TKIP`) + Michael MIC. Slows modern 802.11n/ac/ax down to 54 Mbps and carries known cryptographic weaknesses.',
        },
        {
          step: 'Gen 2',
          title: 'WPA2 (AES-CCMP — PSK & 802.1X Enterprise)',
          explanation:
            'Replaces TKIP with strong **AES-CCMP** hardware encryption. WPA2-PSK creates keys from SSID + shared passphrase during a 4-way handshake; WPA2-Enterprise integrates **802.1X/EAP** with **RADIUS** for per-user credentials/certificates.',
        },
        {
          step: 'Gen 3',
          title: 'WPA3 (SAE, PMF Mandatory, OWE, 192-bit Enterprise)',
          explanation:
            '1) **SAE** replaces PSK 4-way handshake, eliminating offline dictionary guessing and adding **Forward Secrecy**.\n2) **PMF (802.11w)** authenticates management frames (stopping spoofed deauthentication DoS).\n3) **OWE** encrypts "Open" café/guest Wi-Fi silently.\n4) **WPA3-Enterprise 192-bit** uses **AES-GCMP-256**.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Wi-Fi Security Comparison Matrix (WPA -> WPA2 -> WPA3)',
        asciiFallback: `WPA  (Legacy)  -> Cipher: TKIP (RC4)      | Personal: PSK | Enterprise: 802.1X/EAP  | Deprecated
WPA2 (Standard)-> Cipher: AES-CCMP       | Personal: PSK | Enterprise: 802.1X/EAP  | PMF Optional
WPA3 (Modern)  -> Cipher: AES-CCMP/GCMP  | Personal: SAE | Enterprise: 802.1X+192b | PMF Mandatory + OWE`,
      },
      workedExample: {
        title: 'Worked Enterprise WLAN Upgrade Decision',
        context:
          'A university campus currently runs one corporate SSID using `WPA2-PSK` (shared passphrase handed to 2,000 students) and one guest SSID completely unencrypted.',
        steps: [
          'Replace `WPA2-PSK` on the main corporate/student SSID with **WPA2/WPA3-Enterprise (`802.1X`)** backed by RADIUS + individual Active Directory/X.509 credentials so one departing student cannot compromise the network.',
          'Enable **Protected Management Frames (PMF)** to block rogue deauth flooding.',
          'Upgrade the open guest SSID to **OWE (Enhanced Open)** or captive-portal WPA3 so coffee-shop traffic is encrypted over the air.',
        ],
        outcome:
          'Individual accountability, per-session keys, and encryption on both corporate and guest Wi-Fi.',
      },
    },

    iosCliGuide: {
      intro:
        'Check active WLAN cipher and authentication flags using Cisco WLC CLI / IOS XE wireless commands.',
      commands: [
        {
          title: 'Verify Configured WLAN Security on WLC CLI',
          promptAndCommand: `(Cisco Controller) > show wlan 1`,
          output: `WLAN Identifier.................................. 1
Profile Name..................................... CORP-WIFI
Security
   802.11 Authentication:........................ Open System
   Static WEP Keys............................... Disabled
   802.1X........................................ Enabled
   Wi-Fi Protected Access (WPA/WPA2)............. Enabled
      WPA2 Encryption............................ AES
      Authentication Key Management
         802.1X.................................. Enabled`,
          lineByLine: [
            { segment: 'WPA2 Encryption: AES', meaning: 'Confirms modern AES-CCMP cipher rather than legacy TKIP.' },
            { segment: '802.1X: Enabled', meaning: 'Authenticates individual users/devices via RADIUS instead of a shared PSK.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show wlan <id>',
        healthyLabel: 'AES + 802.1X / WPA3',
        healthyOutput: `WPA2 Encryption: AES | Auth Key Mgmt: 802.1X (or SAE) | PMF: Enabled/Required`,
        brokenLabel: 'Legacy TKIP / Open Unencrypted',
        brokenOutput: `WPA/TKIP Enabled (throttles throughput & weak RC4!) OR No L2/L3 Security`,
        diagnosis:
          'Legacy TKIP forces modern 802.11n/ac/ax clients down to legacy rates and exposes weak ciphers—disable TKIP and enforce AES-CCMP/GCMP.',
      },
    },

    commonTraps: [
      {
        trap: 'Confusing **TKIP** with **AES-CCMP**.',
        reality: '**TKIP** belongs to legacy **WPA**; **AES-CCMP** belongs to **WPA2/WPA3** (with optional **AES-GCMP** in WPA3).',
      },
      {
        trap: 'Assuming **WPA2-PSK** stops attackers from brute-forcing a captured Wi-Fi handshake offline.',
        reality: 'An attacker sniffing a WPA2-PSK 4-way handshake can run dictionary tools offline. **WPA3 SAE** fixes this!',
      },
      {
        trap: 'Confusing **RADIUS** with **TACACS+** inside 802.1X Wireless Enterprise authentication.',
        reality: '802.1X wireless controllers use **RADIUS** (UDP 1812/1813), never TACACS+.',
      },
    ],

    keyTerms: [
      {
        term: 'AES-CCMP & AES-GCMP',
        shortDef: 'Modern block-cipher encryption standards powering WPA2 and WPA3.',
        fullDef: 'Replaced legacy RC4-based TKIP; GCMP-256 powers high-security WPA3-Enterprise 192-bit mode.',
      },
      {
        term: 'SAE (Simultaneous Authentication of Equals)',
        shortDef: 'WPA3-Personal handshake defeating offline dictionary brute-force attacks.',
        fullDef: 'Replaces WPA2-PSK 4-way passphrase hashing with interactive Diffie-Hellman-based Dragonfly exchange + forward secrecy.',
      },
      {
        term: 'PMF (Protected Management Frames / 802.11w)',
        shortDef: 'Cryptographically signs Wi-Fi management frames like deauthentication.',
        fullDef: 'Mandatory in WPA3 to stop spoofed deauth Denial-of-Service attacks.',
      },
    ],

    checkQuestions: [
      {
        id: 'c1159-q1',
        prompt: 'Which wireless handshake introduced in **WPA3-Personal** prevents an eavesdropper from capturing a Wi-Fi login handshake and cracking the passphrase offline?',
        options: ['SAE (Simultaneous Authentication of Equals)', 'TKIP', 'WEP IV', '4-way PSK'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **SAE** performs live interactive zero-knowledge key establishment with forward secrecy, rendering offline dictionary cracking useless.',
          'Incorrect: TKIP is a legacy WPA encryption wrapper, not WPA3 key exchange.',
          'Incorrect: WEP uses severely broken static RC4 IVs.',
          'Incorrect: The legacy WPA2-PSK 4-way handshake is specifically what allows offline cracking.',
        ],
        takeaway: 'WPA3-Personal replaces vulnerable PSK with **SAE**.',
      },
      {
        id: 'c1159-q2',
        prompt: 'Which encryption cipher is mandated by **WPA2** (and legacy-incompatible with TKIP speed caps)?',
        options: ['AES-CCMP', 'TKIP (RC4)', 'DES', 'SHA-1 only'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: WPA2 introduced **AES-CCMP**, delivering strong encryption and full 802.11n/ac/ax throughput.',
          'Incorrect: TKIP was WPA’s legacy RC4 wrapper and caps modern high-throughput Wi-Fi rates.',
          'Incorrect: DES is obsolete and not used by WPA2.',
          'Incorrect: SHA-1 is a hash, not an encryption cipher.',
        ],
        takeaway: 'WPA = TKIP; WPA2 = **AES-CCMP**; WPA3 = AES-CCMP/GCMP + SAE.',
      },
      {
        id: 'c1159-q3',
        prompt: 'An organization wants each employee to log onto corporate Wi-Fi using their personal Active Directory / certificate identity so firing one employee revokes their access without retyping a PSK on 300 devices. Which wireless mode should they deploy?',
        options: ['WPA2/WPA3-**Enterprise** (802.1X + RADIUS)', 'WPA2-Personal (PSK)', 'Open SSID with MAC filtering', 'WPA-TKIP'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **Enterprise mode** uses **802.1X/EAP** with a **RADIUS** server for per-user/per-device credentials and instant revocation.',
          'Incorrect: Shared PSK requires changing and re-entering the passphrase across all remaining 299 devices.',
          'Incorrect: Open Wi-Fi is unencrypted and MAC addresses are trivial to spoof.',
          'Incorrect: TKIP is insecure and slow.',
        ],
        takeaway: 'Per-user Wi-Fi login & instant revocation = **Enterprise (802.1X + RADIUS)**.',
      },
      {
        id: 'c1159-q4',
        prompt: 'What threat does **PMF (Protected Management Frames / 802.11w)**, mandatory in WPA3, directly mitigate?',
        options: [
          'Forged wireless deauthentication and disassociation DoS attacks',
          'BGP route hijacking',
          'IPv4 subnet exhaustion',
          'Switch trunk native VLAN mismatches',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Without PMF, management frames travel unauthenticated, letting attackers blast spoofed deauth frames to kick clients off Wi-Fi.',
          'Incorrect: BGP is WAN Layer 3 routing.',
          'Incorrect: Subnet exhaustion is IPv4 addressing.',
          'Incorrect: Trunk mismatches occur on wired switch trunks.',
        ],
        takeaway: 'PMF (802.11w) protects Wi-Fi management frames against forged deauth attacks.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Wi-Fi Cipher & Authentication Matrix Review',
      instructions: [
        'Write out WPA vs WPA2 vs WPA3 side-by-side showing Cipher, Personal Auth, Enterprise Auth, and PMF requirement.',
        'Explain why disabling TKIP restores full 802.11ac/ax speeds.',
      ],
      verificationCheck: 'Identifies TKIP vs AES-CCMP vs AES-GCMP and PSK vs SAE vs 802.1X cleanly.',
    },

    summaryBullets: [
      '**WPA** used **TKIP** (legacy RC4, deprecated); **WPA2** introduced **AES-CCMP**; **WPA3** adds **SAE**, **PMF**, **OWE**, and **AES-GCMP-256**.',
      '**Personal** (`PSK` / `SAE`) uses a single shared passphrase; **Enterprise** (`802.1X/EAP`) validates unique user/certificate logins via **RADIUS**.',
      '**SAE** stops offline dictionary brute-forcing and adds Forward Secrecy.',
      '**PMF (802.11w)** stops spoofed wireless deauth Denial-of-Service attacks (mandatory in WPA3).',
      '**OWE** encrypts open public Wi-Fi without needing a login password.',
    ],

    sourcesToVerify: [
      'Wi-Fi Alliance — WPA3 Specification & Security Considerations',
      'Cisco Wireless LAN Controller Configuration Guide — Wireless Security',
    ],
  },

  'ccna.v11.5.10': {
    id: 'ccna.v11.5.10',
    moduleId: 'ccna',
    unitTitle: 'Unit 5: Security Fundamentals (v1.1)',
    topicTitle: '5.10 Configure WLAN Access Using WPA2 PSK via GUI',
    code: '5.10.1',
    title: 'Applying Layer 2 WPA2/AES-CCMP & Pre-Shared Key on Cisco WLC GUI',
    readMinutes: 10,
    prerequisites: ['2.9.1 WLC GUI WLAN Setup', '5.9.1 Wireless Security Protocols'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['5.10 Configure WLAN access using WPA2 PSK using the GUI'],

    learningObjectives: [
      'Navigate the Cisco WLC GUI **WLANs -> Security -> Layer 2** and **AAA** tabs to secure a brand-new SSID.',
      'Select **WPA+WPA2** Layer 2 security, enforce **WPA2 Policy** with **AES** encryption (no TKIP!), and configure **PSK** ASCII passphrase.',
      'Verify why **Authentication Key Management (AKM)** must switch from default **802.1X** to **PSK** when deploying WPA2-PSK.',
      'Enable the WLAN cleanly (`Status: Enabled`) and verify connected client security state.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Brand-New WLC SSID Rejects Everyone’s Pre-Shared Key',
      narrative:
        'You created `GUEST-CORP` in the Cisco WLC GUI (`2.9.1`), turned on WPA2 Policy, typed a shared key... yet phones keep prompting for a username and password instead of accepting the shared passphrase! Why? On Cisco WLCs, **802.1X** is checked by default under **Authentication Key Management (AKM)**. Unless you explicitly uncheck `802.1X` and check **`PSK`**, the controller tries sending users to a nonexistent RADIUS server!',
    },

    plainEnglish: {
      analogyTitle: 'Think of Flipping Both Locks on a Two-Switch Panel: Encryption Type + Key Mode',
      analogy:
        'Configuring **WPA2-PSK** in the Cisco WLC GUI is like setting a safe door with two separate dials: Dial 1 (**WPA2 Policy + AES**) sets the cipher strength, while Dial 2 (**Auth Key Management = `PSK`**) decides *how* guests unlock the door (shared secret passphrase vs individual 802.1X username badges). Forgetting to flip Dial 2 from `802.1X` to `PSK` leaves guests trapped at a badge reader that does not exist.',
      technicalDefinition:
        'On Cisco AireOS / Catalyst WLC GUIs, configuring **WPA2-PSK** requires: `WLANs -> <WLAN ID> -> Security -> Layer 2` -> `Layer 2 Security = WPA+WPA2` -> check `WPA2 Policy` + `WPA2 Encryption = AES` -> under `Authentication Key Management`, uncheck `802.1X`, check `PSK`, set `PSK Format = ASCII` + passphrase -> check `Enabled` on the General tab and click `Apply`.',
      paragraphs: [
        'Walk through the exact 6 clicks inside the Cisco AireOS WLC GUI (heavily tested in CCNA v1.1 Domain 5.10 screenshot questions!):\n1. Go to **WLANs -> Edit WLAN**.\n2. Open **Security -> Layer 2**.\n3. Set **Layer 2 Security** dropdown to **`WPA+WPA2`**.\n4. In **WPA Parameters**, check **`WPA2 Policy`** and check **`AES`** (leave WPA1/TKIP unchecked!).\n5. In **Authentication Key Management (AKM)**, **uncheck `802.1X`** and **check `PSK`**.\n6. Set **PSK Format = `ASCII`** (or Hex), enter the passphrase, click **Apply**, and ensure **General -> Status = `Enabled`**!',
        'Watch the subtle **Security -> Layer 3** trap: unless you are building a captive web splash page, leave **Layer 3 Security = None**! Leaving Web Auth turned on forces users onto a secondary web login page after joining Wi-Fi.',
      ],
    },

    deepDive: {
      intro:
        'Follow the exact screen-by-screen WLC GUI flow for WPA2-PSK security.',
      steps: [
        {
          step: 'Tab 1',
          title: 'WLANs -> General Tab (`Status: Enabled` & Interface Mapping)',
          explanation:
            'Verify SSID string (case-sensitive!), bind **Interface/Interface Group** to the target VLAN dynamic interface (`VLAN_20`), and verify **Status = Enabled**.',
        },
        {
          step: 'Tab 2',
          title: 'Security -> Layer 2 Tab (`WPA+WPA2` + `WPA2 Policy` + `AES`)',
          explanation:
            'Select `WPA+WPA2` in the dropdown. Under WPA2 Parameters, check **`WPA2 Policy`** and **`AES`** (AES-CCMP). Never check `TKIP` unless ancient scanners require it.',
        },
        {
          step: 'Tab 3',
          title: 'Auth Key Management (`PSK`, NOT `802.1X`) & Passphrase',
          explanation:
            'Uncheck **`802.1X`** and check **`PSK`**. Choose `ASCII` (8–63 readable characters) and type the pre-shared key, then click **Apply** in the top-right corner.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Cisco WLC GUI Screen Map: Security -> Layer 2 (WPA2-PSK)',
        asciiFallback: `[WLC GUI: WLANs -> CORP-PSK -> Security -> Layer 2]
  Layer 2 Security:     [ WPA+WPA2 v ]
  WPA Parameters:       [x] WPA2 Policy   |   WPA2 Encryption: [x] AES  [ ] TKIP
  Auth Key Management:  [ ] 802.1X        |   [x] PSK
  PSK Format:           [ ASCII v ]       |   Key: [ BranchWiFi#2026 ]   --> [Apply]`,
      },
      workedExample: {
        title: 'Worked WLC GUI Troubleshooting: Wrong AKM Checkbox',
        context:
          'A junior admin configured `WLAN 3 (WAREHOUSE)`, selected `WPA+WPA2`, checked `WPA2 Policy + AES`, typed a PSK... yet Android scanners show "Identity / CA Certificate" prompts and fail to connect.',
        steps: [
          'Open `WLANs -> 3 (WAREHOUSE) -> Security -> Layer 2`.',
          'Inspect **Authentication Key Management**: notice `802.1X` is still checked alongside (or instead of) `PSK`!',
          'Uncheck `802.1X`, leave only `PSK` checked, verify `Status = Enabled` on General, and click **Apply**.',
        ],
        outcome:
          'Scanners immediately prompt for the simple PSK passphrase and associate cleanly.',
      },
    },

    iosCliGuide: {
      intro:
        'Verify the exact equivalent settings from WLC CLI / Catalyst 9800 IOS XE CLI after clicking Apply in the GUI.',
      commands: [
        {
          title: 'Verify Applied WPA2-PSK Policy via WLC CLI',
          promptAndCommand: `(Cisco Controller) > show wlan 3`,
          output: `WLAN Identifier.................................. 3
SSID............................................. WAREHOUSE
Status........................................... Enabled
Interface........................................ vlan30_wh
Security
   Wi-Fi Protected Access (WPA/WPA2)............. Enabled
      WPA2 Encryption............................ AES
      Authentication Key Management
         802.1X.................................. Disabled
         PSK..................................... Enabled`,
          lineByLine: [
            { segment: 'Status: Enabled', meaning: 'SSID broadcasts and accepts client associations.' },
            { segment: 'WPA2 Encryption: AES', meaning: 'Enforces AES-CCMP cipher cleanly.' },
            { segment: '802.1X: Disabled / PSK: Enabled', meaning: 'Confirms pre-shared key mode rather than RADIUS 802.1X.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show wlan 3',
        healthyLabel: 'Clean WPA2-PSK Config',
        healthyOutput: `Status: Enabled | WPA2 Encryption: AES | 802.1X: Disabled | PSK: Enabled`,
        brokenLabel: 'Unapplied / 802.1X Left Checked',
        brokenOutput: `Status: Disabled (OR 802.1X: Enabled -> clients prompt for Username/EAP!)`,
        diagnosis:
          'Always verify `Status: Enabled`, `WPA2 Encryption: AES`, `802.1X: Disabled`, and `PSK: Enabled`.',
      },
    },

    commonTraps: [
      {
        trap: 'Leaving **`802.1X` checked** under Authentication Key Management when setting up WPA2-PSK.',
        reality: 'Uncheck `802.1X` and check **`PSK`**—otherwise clients receive EAP enterprise prompts instead of password-only PSK.',
      },
      {
        trap: 'Forgetting to click **Apply** and leaving **General -> Status** unchecked (`Disabled`).',
        reality: 'New Cisco WLC WLANs default to Disabled until explicitly enabled and applied.',
      },
      {
        trap: 'Checking **TKIP** alongside or instead of **AES**.',
        reality: 'Use **WPA2 Policy + AES** only; TKIP degrades modern Wi-Fi performance and weakens encryption.',
      },
    ],

    keyTerms: [
      {
        term: 'Authentication Key Management (AKM)',
        shortDef: 'WLC Security -> Layer 2 setting selecting `PSK` vs `802.1X` vs `FT/SAE`.',
        fullDef: 'Determines how keys are negotiated: pre-shared key (`PSK`) or enterprise RADIUS (`802.1X`).',
      },
      {
        term: 'PSK Format (ASCII vs Hex)',
        shortDef: 'Passphrase encoding option (8–63 readable ASCII characters vs 64 hex digits).',
        fullDef: 'ASCII lets users type normal phrases cleanly when joining.',
      },
    ],

    checkQuestions: [
      {
        id: 'c11510-q1',
        prompt: 'In the Cisco WLC GUI (`Security -> Layer 2`), you select `WPA+WPA2` and check `WPA2 Policy` + `AES`. Under **Authentication Key Management**, what must you configure for **WPA2-PSK**?',
        options: [
          'Uncheck `802.1X` and check `PSK`, then enter the passphrase in ASCII/Hex',
          'Keep `802.1X` checked and leave `PSK` unchecked',
          'Set Layer 3 Security to Web Auth',
          'Enable Static WEP keys',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Default `802.1X` must be unchecked and **`PSK`** checked for pre-shared key Wi-Fi.',
          'Incorrect: Leaving `802.1X` active triggers enterprise username/EAP authentication.',
          'Incorrect: Layer 3 Web Auth adds a captive web splash page rather than L2 PSK.',
          'Incorrect: WEP is legacy broken security and mutually exclusive with WPA2.',
        ],
        takeaway: 'WLC WPA2-PSK = `WPA+WPA2` -> `WPA2 Policy` -> `AES` -> uncheck `802.1X` -> check `PSK`.',
      },
      {
        id: 'c11510-q2',
        prompt: 'Which encryption setting should you check inside **WPA2 Parameters** for maximum throughput and security on modern Wi-Fi clients?',
        options: ['`AES`', '`TKIP` only', '`RC4`', '`None`'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: **AES** (AES-CCMP) provides strong encryption and full 802.11n/ac/ax speeds.',
          'Incorrect: TKIP throttles Wi-Fi data rates to legacy 54 Mbps.',
          'Incorrect: RC4 is used by broken WEP/TKIP.',
          'Incorrect: Leaves wireless frames unencrypted.',
        ],
        takeaway: 'Always select **AES** under WPA2 Parameters.',
      },
      {
        id: 'c11510-q3',
        prompt: 'What valid character length range applies when entering a **WPA2-PSK** passphrase in **ASCII** format?',
        options: ['8 to 63 ASCII characters', 'Exactly 4 digits', '1 to 5 ASCII characters', 'Minimum 128 characters'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: IEEE 802.11 standard WPA2-PSK ASCII passphrases must be 8–63 characters (or 64 hex digits).',
          'Incorrect: 4 digits is rejected by WLC GUI.',
          'Incorrect: Under 8 characters is invalid.',
          'Incorrect: Maximum ASCII PSK length is 63.',
        ],
        takeaway: 'WPA2-PSK ASCII length = `8–63` characters.',
      },
      {
        id: 'c11510-q4',
        prompt: 'After clicking Apply on **Security -> Layer 2**, nobody can see your new `CORP-PSK` SSID in the airwaves. Which setting on the **General** tab was likely missed?',
        options: [
          'The **`Status`** checkbox (WLAN defaults to Disabled until enabled)',
          'Setting DHCP Option 82',
          'Configuring `ip nat outside`',
          'Enabling Telnet on the controller',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Newly created WLANs start disabled until `Status -> Enabled` is checked and applied.',
          'Incorrect: Option 82 is wired DHCP snooping.',
          'Incorrect: NAT runs on edge routers.',
          'Incorrect: Telnet does not affect SSID broadcasting.',
        ],
        takeaway: 'Always verify `General -> Status: Enabled` and correct VLAN Dynamic Interface.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'WLC GUI Security Tab Walkthrough',
      instructions: [
        'Write down the 6-step WLC GUI sequence from `WLANs -> Create New` through `Security -> Layer 2 -> WPA2/AES/PSK -> Apply`.',
        'Verify what happens if `802.1X` remains checked accidentally.',
      ],
      verificationCheck: 'Can configure WPA2-PSK cleanly on Cisco WLC GUI without missing `PSK` AKM or `Status: Enabled`.',
    },

    summaryBullets: [
      'In WLC GUI: open `WLANs -> Security -> Layer 2` and choose `WPA+WPA2`.',
      'Check **`WPA2 Policy`** and **`AES`** encryption (avoid legacy TKIP).',
      'Under **Authentication Key Management**, uncheck `802.1X` and check **`PSK`**, then enter an 8–63 char `ASCII` passphrase.',
      'Ensure **`General -> Status`** is **`Enabled`** and bound to the right VLAN dynamic interface.',
      'Click **Apply** and verify `show wlan <id>` shows `AES`, `PSK: Enabled`, and `Status: Enabled`.',
    ],

    sourcesToVerify: [
      'Cisco Wireless LAN Controller Configuration Guide — Configuring WPA2-PSK via GUI',
    ],
  },
};
