import { LearningTopic } from '../types/ccna';

export const CCNA_TOPICS: LearningTopic[] = [
  {
    id: 'ccna-t1-foundations',
    trackId: 'ccna',
    number: '01',
    title: 'How Networks Actually Work',
    levelTag: 'beginner',
    domainRef: 'Domain 1 · Network Fundamentals (20%)',
    summary:
      'Start from zero prior networking knowledge: understand what switches, routers, MAC addresses, IP addresses, and the OSI model actually do.',
    subtopics: [
      {
        id: 'ccna-1-1',
        code: '1.1',
        title: 'What Is a Network? MAC Addresses, IP Addresses & Devices',
        levelTag: 'beginner',
        readMinutes: 6,
        summary:
          'Learn why computers need both a permanent physical hardware address (MAC) and a changeable logical location address (IP), and what hubs, switches, and routers do.',
        beginnerMentalModel:
          'Think of a MAC address like your fingerprint—it is burned into your network card at the factory and never changes wherever you travel. Think of an IP address like your street mailing address—when you move from home to a coffee shop, your street address changes so mail (packets) can reach your current neighborhood.',
        sections: [
          {
            heading: 'Switches vs. Routers in Plain English',
            body: 'A Switch connects devices inside the SAME local network (like laptops, printers, and Wi-Fi access points in one office). It reads Layer 2 MAC addresses and sends frames only to the exact port where that device lives. A Router connects DIFFERENT networks together (like your office LAN to the Internet). It reads Layer 3 IP addresses to pick the best path across networks.',
          },
          {
            heading: 'Inside a MAC Address and an IPv4 Address',
            body: 'A MAC address is 48 bits long written as 12 hexadecimal digits (for example, 00:1A:2B:3C:4D:5E). The first half identifies the manufacturer (OUI). An IPv4 address is 32 bits long written as four decimal numbers separated by dots (for example, 192.168.10.25), where each number ranges from 0 to 255.',
            bullets: [
              'Switch = Local neighborhood delivery using 48-bit MAC addresses.',
              'Router = Cross-city highway routing using 32-bit IPv4 (or 128-bit IPv6) addresses.',
              'Default Gateway = The router interface IP that your computer sends traffic to whenever the destination is outside its local subnet.',
            ],
          },
        ],
        commands: [
          {
            command: 'show mac address-table',
            mode: 'Switch Privileged EXEC',
            purpose: 'Display which MAC address is learned on each physical switchport',
          },
          {
            command: 'show arp',
            mode: 'Router Privileged EXEC',
            purpose: 'Show the IP-to-MAC lookup table on a router',
          },
        ],
        takeaway:
          'Switches forward locally using MAC addresses; routers forward between networks using IP addresses.',
        knowledgeCheck: [
          {
            id: 'ccna-1-1-q1',
            prompt:
              'You move your laptop from your home Wi-Fi to a campus network. Which address changes so campus routers can deliver traffic to you, and which stays permanently burned into your NIC?',
            options: [
              'IP address changes; MAC address stays the same',
              'MAC address changes; IP address stays the same',
              'Both MAC and IP addresses remain permanently fixed',
              'Default gateway stays identical across every network',
            ],
            correctIndex: 0,
            optionDetails: [
              'Correct: Your IP address is logical and assigned by the local network (usually via DHCP), whereas your 48-bit MAC address is burned into the NIC hardware.',
              'Incorrect: MAC addresses are hardware identifiers assigned by the vendor; moving networks does not rewrite your hardware NIC address.',
              'Incorrect: If your IP never changed on a foreign network, routers on that network would have no route back to your laptop.',
              'Incorrect: Each local subnet has its own router gateway IP address matching that subnet.',
            ],
            deepExplanation:
              'Networking separates identity from location. Layer 2 MAC addresses identify the hardware interface on a local wire, while Layer 3 IP addresses describe topological location so routers can forward packets to the right subnet.',
          },
          {
            id: 'ccna-1-1-q2',
            prompt:
              'A host at 192.168.1.50/24 wants to load a webpage hosted at 8.8.8.8. Where does the host send its Ethernet frame first?',
            options: [
              'Directly to 8.8.8.8 using an ARP broadcast',
              'To its configured Default Gateway router MAC address',
              'To every switchport as an unknown multicast flood',
              'To the DNS root server at Layer 2',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: ARP broadcasts cannot cross routers! 8.8.8.8 is on a remote network, so the host cannot ARP for 8.8.8.8 directly.',
              'Correct: Because 8.8.8.8 is outside 192.168.1.0/24, the host ARPs for its Default Gateway IP and puts the router MAC as the Layer 2 destination.',
              'Incorrect: Hosts do not send unknown multicast floods to reach remote IPs; they look up their subnet mask and hand off remote traffic to the gateway.',
              'Incorrect: DNS servers resolve names to IPs; they do not act as Layer 2 Ethernet forwarders.',
            ],
            deepExplanation:
              'Before sending any packet, a host compares the destination IP against its own IP and subnet mask. Same subnet -> ARP for the target IP. Remote subnet -> ARP for the Default Gateway IP and let the router take over.',
          },
        ],
      },
      {
        id: 'ccna-1-2',
        code: '1.2',
        title: 'The OSI & TCP/IP Models: Tracing Data Encapsulation',
        levelTag: 'beginner',
        readMinutes: 7,
        summary:
          'Understand why engineers split networking into 7 layers, what headers are added at each step, and how TCP differs from UDP.',
        beginnerMentalModel:
          'Encapsulation works like nested shipping envelopes: your letter (Application Data) goes into an inner envelope labeled with the recipient office suite (Layer 4 TCP/UDP Port), then into a padded mailer with street addresses (Layer 3 IP Packet), then into a local courier tote (Layer 2 Ethernet Frame).',
        sections: [
          {
            heading: 'The 7 OSI Layers & Their Data Units (PDUs)',
            body: 'From top to bottom: 7-Application, 6-Presentation, 5-Session (combined as Application in TCP/IP), 4-Transport (Segment / Datagram), 3-Network (Packet), 2-Data Link (Frame), 1-Physical (Bits). Remember the top-down mnemonic: "All People Seem To Need Data Processing".',
          },
          {
            heading: 'TCP vs. UDP at Layer 4',
            body: 'TCP (Transmission Control Protocol) establishes a reliable connection using a 3-way handshake (SYN -> SYN-ACK -> ACK), tracks sequence numbers, and retransmits lost segments (used by HTTPS 443, SSH 22, BGP 179). UDP (User Datagram Protocol) skips handshakes for speed and low jitter (used by DNS 53, DHCP 67/68, TFTP 69, NTP 123, SNMP 161, VoIP media).',
            bullets: [
              'De-encapsulation happens in reverse on the receiving host: Bits -> Frame -> Packet -> Segment -> Data.',
              'At every router hop, the Layer 2 Frame header is stripped and rebuilt with new MACs, while the Layer 3 IP addresses stay intact.',
            ],
          },
        ],
        commands: [
          {
            command: 'show interfaces GigabitEthernet0/0',
            mode: 'Privileged EXEC',
            purpose: 'Inspect Layer 1 electrical/optical status, Layer 2 line protocol, MTU, and packet counters',
          },
        ],
        takeaway:
          'Memorize the 4 transport PDUs (Data, Segment, Packet, Frame, Bits) and which protocols use TCP vs. UDP.',
        knowledgeCheck: [
          {
            id: 'ccna-1-2-q1',
            prompt:
              'As a packet travels through three routers from your laptop to a cloud server, what happens to its Layer 2 MAC addresses and Layer 3 IP addresses at each router hop?',
            options: [
              'Layer 2 MACs stay the same; Layer 3 IPs are rewritten at every router',
              'Layer 2 MACs are rewritten at every router hop; Layer 3 IPs stay end-to-end (without NAT)',
              'Both MACs and IPs are stripped and replaced at every switch',
              'Neither header changes anywhere along the path',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: This reverses Layer 2 and Layer 3 roles. Routers never leave the original source/destination MAC untouched across hops.',
              'Correct: Each router strips the arriving Layer 2 Ethernet header, decrements IP TTL, looks up the destination IP, and builds a fresh Layer 2 frame for the next hop.',
              'Incorrect: Layer 2 switches forward frames without modifying MAC or IP headers.',
              'Incorrect: Frame MAC addresses are strictly link-local to each wire segment and must change at every router.',
            ],
            deepExplanation:
              'Layer 2 addresses are hop-by-hop (valid only on one broadcast segment), while Layer 3 IP addresses are end-to-end (identifying original sender and final receiver across the internetwork).',
          },
          {
            id: 'ccna-1-2-q2',
            prompt:
              'Which pair of protocols uses UDP for low-overhead transport rather than a TCP 3-way handshake?',
            options: [
              'SSH (22) and HTTPS (443)',
              'TFTP (69) and NTP (123)',
              'BGP (179) and Telnet (23)',
              'SMTP (25) and SSH (22)',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: SSH and HTTPS require guaranteed, ordered delivery over TCP.',
              'Correct: TFTP (UDP 69) and NTP (UDP 123) both run over UDP because they prioritize simplicity and low timing overhead.',
              'Incorrect: BGP uses TCP 179 to keep routing updates reliable, and Telnet uses TCP 23.',
              'Incorrect: SMTP (TCP 25) and SSH (TCP 22) are both TCP-based protocols.',
            ],
            deepExplanation:
              'CCNA 200-301 expects instant recall of TCP vs. UDP transport ports: TCP (22 SSH, 23 Telnet, 25 SMTP, 80 HTTP, 179 BGP, 443 HTTPS) vs. UDP (53 DNS queries, 67/68 DHCP, 69 TFTP, 123 NTP, 161/162 SNMP).',
          },
        ],
      },
      {
        id: 'ccna-1-3',
        code: '1.3',
        title: 'Cabling, Fiber Optics, PoE & Interface Errors',
        levelTag: 'beginner',
        readMinutes: 6,
        summary:
          'Identify copper vs. single-mode/multimode fiber cables, Power over Ethernet classes, and diagnose duplex mismatches on Cisco interfaces.',
        beginnerMentalModel:
          'Imagine two people on walkie-talkies vs. a phone call. Half-duplex is a walkie-talkie (only one person talks at a time or they collide). Full-duplex is a phone call (both talk simultaneously). If one side uses a phone rule and the other uses walkie-talkie rules, you get constant garbled collisions!',
        sections: [
          {
            heading: 'Copper & Fiber Media Specs',
            body: 'Twisted-pair copper (Cat5e/Cat6/Cat6A) maxes out at 100 meters per run. Multimode Fiber (MMF, aqua/orange jacket, LED/VCSEL) reaches ~300–550 meters inside buildings. Single-Mode Fiber (SMF, yellow jacket, laser) spans kilometers between campuses.',
          },
          {
            heading: 'Reading Cisco Interface Status & Errors',
            body: 'When you run "show ip interface brief", you see Status (Layer 1) and Protocol (Layer 2). "administratively down / down" means someone ran "shutdown". "down / down" means no cable or dead peer. "up / down" means physical signal exists, but Layer 2 framing/encapsulation failed.',
            bullets: [
              '802.3af (PoE) = 15.4W, 802.3at (PoE+) = 30W, 802.3bt (PoE++/UPoE) = 60–90W.',
              'Duplex mismatch: half-duplex side logs Late Collisions; full-duplex side logs CRC/FCS errors.',
            ],
          },
        ],
        commands: [
          {
            command: 'show ip interface brief',
            mode: 'Privileged EXEC',
            purpose: 'Quickly check L1 Status, L2 Protocol, and IP address of every interface',
          },
          {
            command: 'no shutdown',
            mode: 'Interface Config',
            purpose: 'Administratively enable a router or switch interface',
          },
        ],
        takeaway:
          'Always check L1/L2 state first ("up/up") and look for duplex mismatches when CRC or late collision counters climb.',
        knowledgeCheck: [
          {
            id: 'ccna-1-3-q1',
            prompt:
              'You run "show ip interface brief" on R1 and see GigabitEthernet0/1 listed as "administratively down / down". What does this tell you?',
            options: [
              'The Cat6 patch cable is unplugged at the wall jack.',
              'The interface has the "shutdown" command active in its configuration.',
              'There is a subnet mask mismatch with the neighboring router.',
              'OSPF Hello timers do not match on that link.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: An unplugged cable shows "down / down", not "administratively down".',
              'Correct: Cisco router interfaces default to "shutdown" out of the box, producing "administratively down / down" until you enter "no shutdown".',
              'Incorrect: Subnet masks are Layer 3; they do not bring Layer 1 down.',
              'Incorrect: OSPF timers only affect Layer 3 routing adjacencies, never physical L1 interface status.',
            ],
            deepExplanation:
              'Cisco routers ship with physical interfaces administratively shut down for safety, whereas Cisco Catalyst switches ship with ports enabled ("no shutdown" by default).',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'ccna-t1-ex1',
        prompt:
          'A support technician needs to connect two campus buildings 1.8 kilometers apart at 10 Gbps with zero EMI interference. Which medium should be installed?',
        options: [
          'Cat6A shielded twisted-pair copper',
          'Multimode fiber (OM3/OM4)',
          'Single-mode fiber (OS2)',
          'Rollover console cable',
        ],
        correctIndex: 2,
        optionDetails: [
          'Incorrect: Cat6A copper is limited to 100 meters and cannot span 1.8 km.',
          'Incorrect: Multimode fiber at 10 Gbps typically tops out around 300–400 meters.',
          'Correct: Single-mode fiber uses a narrow ~9-micron core and laser optics to carry 10G+ signals for kilometers.',
          'Incorrect: Rollover cables are strictly for local RS-232 serial console management.',
        ],
        deepExplanation:
          'Distance and bandwidth dictate cabling choice: <=100m -> UTP copper; <=400m inside a building -> Multimode fiber; >500m to kilometers -> Single-mode fiber.',
      },
      {
        id: 'ccna-t1-ex2',
        prompt:
          'Which Layer 4 protocol establishes a reliable session with SYN, SYN-ACK, and ACK packets before transmitting application data?',
        options: ['UDP', 'ICMP', 'TCP', 'ARP'],
        correctIndex: 2,
        optionDetails: [
          'Incorrect: UDP is connectionless and performs no handshake.',
          'Incorrect: ICMP is a Layer 3 diagnostic/control protocol (ping/traceroute), not a Layer 4 transport session protocol.',
          'Correct: TCP initiates every reliable connection with the three-way handshake (SYN -> SYN-ACK -> ACK).',
          'Incorrect: ARP resolves Layer 3 IPs to Layer 2 MAC addresses locally.',
        ],
        deepExplanation:
          'TCP reliability relies on the 3-way handshake to synchronize sequence numbers and negotiate window sizes before data flows.',
      },
      {
        id: 'ccna-t1-ex3',
        prompt:
          'On a Cisco switch interface, counters show rapidly increasing "late collisions" while the connected server NIC reports "FCS/CRC errors". What happened?',
        options: [
          'One side is forced to full-duplex while the other side auto-negotiated to half-duplex.',
          'The server is missing its default gateway IP.',
          'The switch has PortFast enabled.',
          'The fiber optic cable has single-mode and multimode mixed.',
        ],
        correctIndex: 0,
        optionDetails: [
          'Correct: Forcing full-duplex disables auto-negotiation, forcing the peer to fall back to half-duplex—causing late collisions on the half side and CRC errors on the full side.',
          'Incorrect: Missing gateways affect Layer 3 routing, not Layer 1/2 collision/FCS hardware counters.',
          'Incorrect: PortFast accelerates Spanning Tree edge forwarding without causing collisions.',
          'Incorrect: Mixing SMF and MMF generally breaks physical link light altogether rather than creating classic duplex collision counters.',
        ],
        deepExplanation:
          'Best practice in Cisco networks: enable auto-negotiation on BOTH ends, or hardcode identical speed/duplex on BOTH ends—never mix hardcoded and auto.',
      },
    ],
  },
  {
    id: 'ccna-t2-subnetting',
    trackId: 'ccna',
    number: '02',
    title: 'IPv4 Binary, Subnetting & IPv6',
    levelTag: 'beginner',
    domainRef: 'Domain 1 · IPv4 & IPv6 Addressing',
    summary:
      'Demystify binary math, master CIDR block sizes (/24 to /30), design overlap-free VLSM plans, and read compressed IPv6 addresses.',
    subtopics: [
      {
        id: 'ccna-2-1',
        code: '2.1',
        title: 'Binary Made Simple & RFC 1918 Private IPv4 Space',
        levelTag: 'beginner',
        readMinutes: 6,
        summary:
          'Convert decimal octets to 8-bit binary in seconds and recognize private, loopback, and APIPA addresses.',
        beginnerMentalModel:
          'Imagine 8 light switches in a row labeled 128, 64, 32, 16, 8, 4, 2, 1. To make any decimal number from 0 to 255, just flip ON the switches whose values add up to your number!',
        sections: [
          {
            heading: 'The 8-Bit Power-of-Two Row',
            body: 'Every IPv4 octet is 8 bits: [128 | 64 | 32 | 16 | 8 | 4 | 2 | 1]. For example, 192 = 128 + 64 = 11000000. 224 = 128 + 64 + 32 = 11100000.',
          },
          {
            heading: 'Special IPv4 Ranges You Must Recognize',
            body: 'Public IPv4 addresses are globally routable on the Internet. Private RFC 1918 addresses are free to use inside internal corporate networks (and translated via NAT at the edge).',
            bullets: [
              'RFC 1918 Private: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 – 172.31.255.255), and 192.168.0.0/16.',
              '127.0.0.0/8 = Loopback (self-test). 169.254.0.0/16 = APIPA (Windows/macOS fallback when DHCP fails).',
            ],
          },
        ],
        commands: [
          {
            command: 'ip address 192.168.10.1 255.255.255.0',
            mode: 'Interface Config',
            purpose: 'Assign a /24 IPv4 address and mask to a router interface',
          },
        ],
        takeaway:
          '172.32.0.1 is PUBLIC (outside 172.16.0.0–172.31.255.255!), while 172.16–172.31 is private.',
        knowledgeCheck: [
          {
            id: 'ccna-2-1-q1',
            prompt:
              'A user reports no internet access and their workstation shows IP 169.254.44.12. What happened?',
            options: [
              'The workstation successfully received a private RFC 1918 lease.',
              'The workstation failed to reach a DHCP server and self-assigned an APIPA link-local IP.',
              'The router assigned a static loopback address.',
              'NAT translated the user IP into a multicast address.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: 169.254.0.0/16 is NOT an RFC 1918 routable private range.',
              'Correct: When DHCP Discover receives no Offer, OS clients fall back to APIPA (169.254.0.0/16), which only talks locally and cannot route.',
              'Incorrect: Loopback is 127.0.0.0/8 (127.0.0.1).',
              'Incorrect: Multicast addresses start in 224.0.0.0–239.255.255.255.',
            ],
            deepExplanation:
              'Seeing 169.254.x.x on a help desk call or CCNA scenario immediately points to a DHCP failure (down server, missing VLAN, or missing ip helper-address).',
          },
        ],
      },
      {
        id: 'ccna-2-2',
        code: '2.2',
        title: 'Subnet Masks, Block Sizes & Usable Host Ranges',
        levelTag: 'intermediate',
        readMinutes: 8,
        summary:
          'Find the Network ID, First Usable, Last Usable, and Broadcast Address of any /24 to /30 subnet in under 15 seconds.',
        beginnerMentalModel:
          'A subnet mask is a fence divider: 1-bits mark the street name (Network portion) and 0-bits mark the house numbers on that street (Host portion). The very first house number (.0 in a /24) names the street itself, and the very last house number (.255 in a /24) shouts to every house on the street (Broadcast).',
        sections: [
          {
            heading: 'The Magic Block-Size Formula (256 - Mask Octet)',
            body: 'Look at the first octet in the subnet mask that is NOT 255 (called the interesting octet). Subtract that mask octet from 256 to get the subnet jump/block size! Example: for 192.168.10.75/26, mask is 255.255.255.192. Block size = 256 - 192 = 64. Subnets start at 0, 64, 128, 192. Since 75 falls between 64 and 128, Network = .64, Broadcast = .127, Usable = .65 to .126.',
          },
          {
            heading: 'Memorize /25 through /30',
            body: 'Every extra borrowed host bit halves the subnet size: /24 = 256 (254 usable), /25 = 128 (126 usable), /26 = 64 (62 usable), /27 = 32 (30 usable), /28 = 16 (14 usable), /29 = 8 (6 usable), /30 = 4 (2 usable).',
          },
        ],
        commands: [
          {
            command: 'show ip interface GigabitEthernet0/0',
            mode: 'Privileged EXEC',
            purpose: 'Verify both the IP address and calculated broadcast/subnet mask',
          },
        ],
        takeaway:
          'Usable hosts = 2^(host bits) - 2. Always verify you counted the router gateway inside your host requirement!',
        knowledgeCheck: [
          {
            id: 'ccna-2-2-q1',
            prompt: 'What is the Broadcast Address for host 10.20.4.100/27?',
            options: ['10.20.4.95', '10.20.4.127', '10.20.4.128', '10.20.4.255'],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: .95 is the broadcast address of the preceding subnet (10.20.4.64/27).',
              'Correct: /27 = 255.255.255.224 -> block size = 256 - 224 = 32. Multiples: 0, 32, 64, 96, 128. 100 sits inside 96–127, so Broadcast is 10.20.4.127.',
              'Incorrect: .128 is the Network ID of the NEXT /27 subnet.',
              'Incorrect: .255 would only be the broadcast if the mask were /24 (block size 256).',
            ],
            deepExplanation:
              'Finding the block size (256 - interesting mask octet) turns every subnetting problem into counting multiples until you bracket the given IP.',
          },
        ],
      },
      {
        id: 'ccna-2-3',
        code: '2.3',
        title: 'VLSM Planning & IPv6 Addressing Basics',
        levelTag: 'intermediate',
        readMinutes: 7,
        summary:
          'Allocate Variable Length Subnet Masks without overlap and read/compress 128-bit IPv6 hexadecimal addresses.',
        beginnerMentalModel:
          'Packing VLSM subnets into a big IP block is like packing luggage: put the biggest suitcase (largest host subnet) in first, then fit medium bags and small pouches (/30 router links) into the remaining gaps so nothing overlaps.',
        sections: [
          {
            heading: 'VLSM Allocation Order',
            body: 'Always sort department host requirements from LARGEST to SMALLEST before assigning prefixes. If Engineering needs 50 hosts (/26 = 62 usable), Sales needs 20 (/27 = 30 usable), and a WAN link needs 2 (/30), assign /26 at .0–.63, /27 at .64–.95, and /30 at .96–.99.',
          },
          {
            heading: 'IPv6 Compression & Address Scopes',
            body: 'IPv6 uses 128 bits written as 8 colon-separated hexadecimal hextets. Rule 1: drop leading zeros inside each hextet (0042 -> 42). Rule 2: replace ONE longest contiguous run of 0000 hextets with "::". Global Unicast starts with 2000::/3; Link-Local starts with FE80::/10; Unique Local starts with FC00::/7 (FD00::/8).',
          },
        ],
        commands: [
          {
            command: 'ipv6 unicast-routing',
            mode: 'Global Config',
            purpose: 'Mandatory command to enable IPv6 forwarding on a Cisco router',
          },
          {
            command: 'show ipv6 interface brief',
            mode: 'Privileged EXEC',
            purpose: 'Display FE80:: link-local and global IPv6 addresses',
          },
        ],
        takeaway:
          'You can only use "::" ONCE in an IPv6 address—using it twice makes the zero count ambiguous.',
        knowledgeCheck: [
          {
            id: 'ccna-2-3-q1',
            prompt: 'Which compressed IPv6 address is equivalent to 2001:0db8:0000:0000:0000:00a1:0000:0001?',
            options: [
              '2001:db8::a1::1',
              '2001:db8::a1:0:1',
              '2001:db8:0:a1::1',
              '2001:db8::a1:000:1',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: "::" can NEVER appear twice in one IPv6 address.',
              'Correct: The three consecutive zero hextets compress to "::", the isolated zero hextet compresses to "0", and leading zeros in "00a1" and "0001" drop cleanly.',
              'Incorrect: That omits two zero hextets from the first block and shifts the position of "a1".',
              'Incorrect: Leading zeros in "0000" compress to a single "0", not "000".',
            ],
            deepExplanation:
              'When multiple zero runs exist, compress the longest contiguous run to "::" and shorten any remaining single zero hextet to "0".',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'ccna-t2-ex1',
        prompt:
          'A branch office needs 29 host IPs for employee laptops plus 1 IP for the router gateway. Which subnet mask is the smallest fit?',
        options: ['/28 (255.255.255.240)', '/27 (255.255.255.224)', '/26 (255.255.255.192)', '/29 (255.255.255.248)'],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: /28 only yields 14 usable addresses—far short of 30.',
          'Correct: 29 laptops + 1 router gateway = 30 usable IPs needed. /27 gives 2^5 - 2 = 30 usable hosts.',
          'Incorrect: /26 gives 62 usable addresses—it works, but wastes 32 addresses and is not the smallest fit.',
          'Incorrect: /29 only yields 6 usable addresses.',
        ],
        deepExplanation:
          'Always add 1 for the router gateway to user host counts before picking a CIDR prefix.',
      },
      {
        id: 'ccna-t2-ex2',
        prompt: 'Which IPv4 address belongs to a PUBLIC internet block rather than RFC 1918 private space?',
        options: ['10.254.1.5', '172.32.10.1', '192.168.99.254', '172.16.200.5'],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: 10.0.0.0/8 is private RFC 1918.',
          'Correct: Private Class B RFC 1918 stops at 172.31.255.255 (/12). 172.32.10.1 is public!',
          'Incorrect: 192.168.0.0/16 is private RFC 1918.',
          'Incorrect: 172.16.200.5 sits inside 172.16.0.0 – 172.31.255.255.',
        ],
        deepExplanation:
          'The 172.16.0.0/12 boundary (172.16 through 172.31 in the second octet) is one of the most tested subnet recognition traps on CCNA.',
      },
    ],
  },
  {
    id: 'ccna-t3-switching',
    trackId: 'ccna',
    number: '03',
    title: 'Layer 2 Switching, VLANs & Spanning Tree',
    levelTag: 'intermediate',
    domainRef: 'Domain 2 · Network Access (20%)',
    summary:
      'Segment broadcast domains with VLANs, carry multiple VLANs across 802.1Q trunks, prevent Layer 2 loops with Rapid PVST+, and bundle links with EtherChannel.',
    subtopics: [
      {
        id: 'ccna-3-1',
        code: '3.1',
        title: 'Switch MAC Learning & VLAN Segmentation',
        levelTag: 'intermediate',
        readMinutes: 6,
        summary:
          'Trace unknown unicast flooding vs. known unicast forwarding and split large switches into isolated Layer 2 VLANs.',
        beginnerMentalModel:
          'Without VLANs, every device plugged into a switch hears everyone else’s broadcasts—like 200 people yelling in one giant cafeteria. VLANs build invisible soundproof walls inside the same physical switch so Engineering, Guests, and Voice phones never hear each other’s broadcasts.',
        sections: [
          {
            heading: 'How a Switch Processes Every Frame',
            body: '1. Learn: look at the SOURCE MAC and record (MAC, VLAN, Port) in the CAM table. 2. Forward/Flood: look up the DESTINATION MAC. If known on another port, forward only there; if unknown or broadcast (FF:FF:FF:FF:FF:FF), flood out all other ports in that SAME VLAN.',
          },
          {
            heading: 'Creating & Assigning Access VLANs',
            body: 'Access ports carry traffic for a single data VLAN (and optionally one Voice VLAN for an IP phone). Always create the VLAN globally or let IOS auto-create it when assigning an access port.',
          },
        ],
        commands: [
          { command: 'vlan 10 / name ENG', mode: 'Global / VLAN Config', purpose: 'Create and name VLAN 10' },
          { command: 'switchport mode access / switchport access vlan 10', mode: 'Interface Config', purpose: 'Pin an edge switchport to VLAN 10' },
          { command: 'show vlan brief', mode: 'Privileged EXEC', purpose: 'Verify active VLANs and assigned access ports' },
        ],
        takeaway:
          'One VLAN = one broadcast domain = one IP subnet. Two devices in different VLANs require a Layer 3 router to communicate.',
        knowledgeCheck: [
          {
            id: 'ccna-3-1-q1',
            prompt:
              'PC-A sends a frame whose destination MAC is NOT yet in SW1’s MAC address table. How does SW1 handle the frame?',
            options: [
              'Drops the frame and sends an ICMP unreachable error',
              'Floods the frame out every port in PC-A’s VLAN except the ingress port',
              'Forwards the frame out the default gateway port only',
              'Rewrites the destination MAC to FF:FF:FF:FF:FF:FF',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: Switches do not drop unknown unicast frames or send Layer 3 ICMP messages.',
              'Correct: Unknown unicast frames are flooded out all active ports belonging to the same VLAN (excluding the arrival port).',
              'Incorrect: A switch does not know which port leads to a default gateway unless that MAC is already learned.',
              'Incorrect: Switches never rewrite frame MAC addresses.',
            ],
            deepExplanation:
              'Unknown unicast flooding is completely normal in Layer 2 Ethernet until the destination host replies and the switch learns its source MAC.',
          },
        ],
      },
      {
        id: 'ccna-3-2',
        code: '3.2',
        title: '802.1Q Trunks, Native VLANs & Router-on-a-Stick',
        levelTag: 'intermediate',
        readMinutes: 7,
        summary:
          'Tag frames across inter-switch links with IEEE 802.1Q and route between VLANs using router subinterfaces.',
        beginnerMentalModel:
          'An 802.1Q trunk is a multi-lane highway bridge between switches: before a frame crosses the bridge, the switch clips a color-coded 4-byte VLAN wristband onto the frame so the receiving switch knows which VLAN room to deliver it into.',
        sections: [
          {
            heading: '802.1Q Tagging & The Native VLAN',
            body: 'IEEE 802.1Q inserts a 4-byte tag inside the Ethernet header carrying the 12-bit VLAN ID. One VLAN—the Native VLAN (VLAN 1 by default)—crosses the trunk UNTAGGED. Both ends of a trunk MUST agree on the Native VLAN.',
          },
          {
            heading: 'Router-on-a-Stick (ROAS)',
            body: 'To route between VLAN 10 and VLAN 20 over a single physical router cable, trunk the switchport to the router and split the router interface into subinterfaces (Gi0/0.10 and Gi0/0.20), each configured with "encapsulation dot1Q <vlan-id>" and an IP gateway.',
          },
        ],
        commands: [
          { command: 'switchport mode trunk', mode: 'Interface Config', purpose: 'Force an interface into 802.1Q trunking' },
          { command: 'encapsulation dot1Q 10', mode: 'Router Subinterface', purpose: 'Bind subinterface to VLAN 10 802.1Q tags' },
          { command: 'show interfaces trunk', mode: 'Privileged EXEC', purpose: 'Verify trunk status, native VLAN, and allowed VLANs' },
        ],
        takeaway:
          'Avoid "dynamic auto" + "dynamic auto" DTP traps—explicitly configure "switchport mode trunk" and "switchport nonegotiate".',
        knowledgeCheck: [
          {
            id: 'ccna-3-2-q1',
            prompt:
              'Why is a trunk port NEVER shown under "Ports" in the output of "show vlan brief"?',
            options: [
              'Trunk ports are disabled until spanning-tree runs.',
              '"show vlan brief" only displays access ports assigned to single VLANs; trunks appear in "show interfaces trunk".',
              'Trunk ports belong to VLAN 0 only.',
              '802.1Q strips all VLAN memberships from the switch.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: Trunks can be completely up and forwarding while absent from "show vlan brief".',
              'Correct: Because trunks carry multiple VLANs rather than belonging to one access VLAN, Cisco IOS lists them under "show interfaces trunk".',
              'Incorrect: VLAN 0 is reserved and not an operational switch VLAN.',
              'Incorrect: 802.1Q tags preserve VLAN IDs across the link.',
            ],
            deepExplanation:
              'This trips up beginners constantly during labs: if a port disappears from "show vlan brief" right after configuring trunking, check "show interfaces trunk"!',
          },
        ],
      },
      {
        id: 'ccna-3-3',
        code: '3.3',
        title: 'Rapid PVST+ Spanning Tree & EtherChannel',
        levelTag: 'intermediate',
        readMinutes: 7,
        summary:
          'Stop broadcast storms on redundant switch triangles using Root Bridge elections and combine links cleanly with LACP EtherChannel.',
        beginnerMentalModel:
          'Because Ethernet frames have no TTL (hop limit), a triangle of three switches will spin broadcasts around in an infinite circle within milliseconds. Spanning Tree intentionally puts one redundant path on standby like an emergency fire exit.',
        sections: [
          {
            heading: 'Root Bridge & Port Roles',
            body: 'Switches exchange BPDUs every 2 seconds to elect ONE Root Bridge with the lowest Bridge ID (Priority + SysIDExt + MAC). Every non-root switch picks ONE Root Port (best path to Root). Every cable elects ONE Designated Port; leftover redundant ports enter Blocking/Discarding state.',
          },
          {
            heading: 'EtherChannel (LACP vs. PAgP)',
            body: 'Instead of letting STP block a second parallel uplink, bundle up to 8 identical links into one logical Port-Channel. Use IEEE LACP ("active"/"passive") or Cisco PAgP ("desirable"/"auto").',
          },
        ],
        commands: [
          { command: 'spanning-tree vlan 1 root primary', mode: 'Global Config', purpose: 'Ensure switch wins Root Bridge election' },
          { command: 'channel-group 1 mode active', mode: 'Interface Config', purpose: 'Bundle ports into Port-Channel 1 via LACP' },
        ],
        takeaway:
          'Enable "spanning-tree portfast" + "bpduguard enable" on access ports facing PCs so ports jump to Forwarding immediately while blocking rogue switches.',
        knowledgeCheck: [
          {
            id: 'ccna-3-3-q1',
            prompt:
              'SW1 port Gi0/1 is configured with "channel-group 1 mode active". Which configuration on SW2 Gi0/1 forms a working LACP EtherChannel?',
            options: [
              'channel-group 1 mode desirable',
              'channel-group 1 mode passive',
              'channel-group 1 mode auto',
              'channel-group 1 mode on',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: "desirable" is Cisco PAgP, which is incompatible with LACP.',
              'Correct: LACP "active" successfully negotiates with either LACP "active" or LACP "passive".',
              'Incorrect: "auto" belongs to PAgP, not LACP.',
              'Incorrect: Mode "on" disables LACP negotiation completely and only pairs with "on".',
            ],
            deepExplanation:
              'Remember the pairs: LACP (open standard 802.3ad) = active/passive; PAgP (Cisco) = desirable/auto.',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'ccna-t3-ex1',
        prompt:
          'Two switches are connected via Gi0/1. SW1 has "switchport mode dynamic auto" and SW2 has "switchport mode dynamic auto". What happens?',
        options: [
          'They negotiate an 802.1Q trunk.',
          'They remain an access link because neither side actively sends DTP trunk proposals.',
          'Both ports go err-disabled.',
          'They form an LACP EtherChannel.',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: At least one side must be "dynamic desirable" or static "trunk" to negotiate.',
          'Correct: Both "dynamic auto" ports passively wait for the peer, so the link stays in access mode.',
          'Incorrect: DTP passive-passive does not trigger err-disabled.',
          'Incorrect: DTP handles VLAN trunking, whereas LACP handles link aggregation.',
        ],
        deepExplanation:
          'Think of "auto" as waiting to be asked and "desirable" as actively asking.',
      },
      {
        id: 'ccna-t3-ex2',
        prompt:
          'Why should "spanning-tree bpduguard enable" always accompany "spanning-tree portfast" on user edge ports?',
        options: [
          'It doubles link speed from 1 Gbps to 2 Gbps.',
          'It immediately shuts down (err-disables) the port if someone plugs in an unauthorized switch sending BPDUs.',
          'It encrypts 802.1Q VLAN tags.',
          'It automatically assigns the switch as Root Bridge.',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: BPDU Guard is a loop-prevention safeguard, not a bandwidth multiplier.',
          'Correct: PortFast skips STP listening/learning states; BPDU Guard ensures no switch loop can form by err-disabling the port the moment a BPDU arrives.',
          'Incorrect: BPDU Guard does not perform encryption.',
          'Incorrect: Root Bridge priority is controlled via "spanning-tree vlan <id> root primary".',
        ],
        deepExplanation:
          'PortFast + BPDU Guard is standard Cisco campus access-layer hardening.',
      },
    ],
  },
  {
    id: 'ccna-t4-routing',
    trackId: 'ccna',
    number: '04',
    title: 'IP Routing, Static Routes & Single-Area OSPFv2',
    levelTag: 'intermediate',
    domainRef: 'Domain 3 · IP Connectivity (25%)',
    summary:
      'Master the #1 highest-weighted CCNA domain: routing table tie-breakers, floating static failover, single-area OSPFv2, and HSRP gateway redundancy.',
    subtopics: [
      {
        id: 'ccna-4-1',
        code: '4.1',
        title: 'Longest Prefix Match, Administrative Distance & Metric',
        levelTag: 'intermediate',
        readMinutes: 6,
        summary:
          'Predict with 100% certainty which route a Cisco router chooses when forwarding packets or installing competing routing sources.',
        beginnerMentalModel:
          'When forwarding a letter, a router always picks the MOST SPECIFIC address match first (a /26 street beats a /24 neighborhood, which beats a /16 city, which beats a 0.0.0.0/0 "everything else" default). Only when two sources advertise the EXACT same prefix length does Administrative Distance break the tie.',
        sections: [
          {
            heading: 'The Golden Forwarding Order',
            body: '1. Longest Prefix Match (forwarding time): /28 beats /24 beats /16 beats /0 regardless of protocol! 2. Administrative Distance (RIB installation time for identical prefixes): Connected (0) < Static (1) < eBGP (20) < EIGRP (90) < OSPF (110) < RIP (120). 3. Metric (within the same protocol, e.g., lowest OSPF Cost).',
          },
        ],
        commands: [
          { command: 'show ip route', mode: 'Privileged EXEC', purpose: 'Inspect Connected (C), Static (S), and OSPF (O) routes' },
        ],
        takeaway:
          'Longest Prefix Match ALWAYS wins packet forwarding—never compare Administrative Distance between a /24 and a /26!',
        knowledgeCheck: [
          {
            id: 'ccna-4-1-q1',
            prompt:
              'A router has Static route 10.1.0.0/16 (AD 1) and OSPF route 10.1.4.0/24 (AD 110). Which route forwards a packet destined to 10.1.4.20?',
            options: [
              'The Static route (AD 1 beats AD 110)',
              'The OSPF route (/24 is more specific than /16)',
              'Both routes load-balance 50/50',
              'The packet is dropped due to AD conflict',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: AD only compares identical prefix/mask lengths (/24 vs /24), never /16 vs /24.',
              'Correct: 10.1.4.0/24 is a longer prefix match for 10.1.4.20 than 10.1.0.0/16.',
              'Incorrect: Equal-cost load balancing only happens on identical prefix lengths with equal AD and metric.',
              'Incorrect: Both routes coexist peacefully in the routing table because their prefix lengths differ.',
            ],
            deepExplanation:
              'Separating RIB installation (AD) from packet forwarding (Longest Prefix Match) is essential for every CCNA routing exam question.',
          },
        ],
      },
      {
        id: 'ccna-4-2',
        code: '4.2',
        title: 'Static, Default & Floating Static Routes',
        levelTag: 'intermediate',
        readMinutes: 6,
        summary:
          'Write manual static routes, configure 0.0.0.0/0 default gateways, and engineer automatic backup paths using higher Administrative Distance.',
        beginnerMentalModel:
          'A floating static route is a spare key kept in a drawer: as long as your primary OSPF route (AD 110) is alive, the router ignores the floating static (AD 120). The instant OSPF goes down, the floating route floats into the routing table automatically.',
        sections: [
          {
            heading: 'Syntax & Floating AD Trick',
            body: 'Syntax: "ip route <prefix> <mask> <next-hop-ip> [AD]". For a default route ("Gateway of last resort"), use 0.0.0.0 0.0.0.0. To float a backup route behind OSPF (AD 110), assign an AD above 110 (e.g., 120).',
          },
        ],
        commands: [
          { command: 'ip route 0.0.0.0 0.0.0.0 203.0.113.2', mode: 'Global Config', purpose: 'Set default route via ISP gateway' },
          { command: 'ip route 192.168.50.0 255.255.255.0 10.0.0.2 120', mode: 'Global Config', purpose: 'Floating static backup behind OSPF (AD 110)' },
        ],
        takeaway:
          'A floating static route stays hidden from "show ip route" until the primary lower-AD route disappears.',
        knowledgeCheck: [
          {
            id: 'ccna-4-2-q1',
            prompt:
              'You configure "ip route 10.50.0.0 255.255.0.0 172.16.1.2 115" on a router already learning 10.50.0.0/16 via OSPF. Why is the static route NOT visible in "show ip route"?',
            options: [
              'The next-hop IP syntax is invalid.',
              'OSPF has AD 110, which beats the static route’s configured AD of 115.',
              'Floating static routes only appear in "show vlan brief".',
              '10.50.0.0/16 is an invalid private prefix.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: The syntax is completely valid for a floating static route.',
              'Correct: Since 110 < 115, IOS prefers the OSPF route and keeps the AD 115 static route in standby until OSPF drops.',
              'Incorrect: "show vlan brief" is a Layer 2 switch command.',
              'Incorrect: 10.50.0.0/16 is a valid RFC 1918 subnet.',
            ],
            deepExplanation:
              'That is the exact intended behavior of a floating static route—stand by quietly until the primary route fails.',
          },
        ],
      },
      {
        id: 'ccna-4-3',
        code: '4.3',
        title: 'Single-Area OSPFv2 & HSRP Gateway Redundancy',
        levelTag: 'advanced',
        readMinutes: 8,
        summary:
          'Form OSPFv2 Area 0 neighbor adjacencies, understand DR/BDR election, tune reference bandwidth, and configure HSRP virtual gateways.',
        beginnerMentalModel:
          'OSPF routers build a shared Google Map of the entire Area 0 network (LSDB) and run Dijkstra’s SPF algorithm to pick the fastest road. HSRP gives workstations TWO redundant routers sharing ONE virtual IP/MAC so a dead router never breaks user gateways.',
        sections: [
          {
            heading: 'OSPF Neighbor Requirements & Cost',
            body: 'OSPF neighbors MUST match: Area ID, Subnet/Mask, Hello/Dead timers (10s/40s), Authentication, and MTU. Router ID order: manual "router-id" > highest Loopback IP > highest active physical IP. Adjust "auto-cost reference-bandwidth 10000" so 1G (cost 10) beats 100M (cost 100) and 10G (cost 1) beats 1G.',
          },
          {
            heading: 'HSRP Active/Standby Failover',
            body: 'Configure "standby 1 ip <VIP>", "standby 1 priority 110", and "standby 1 preempt" on the preferred Active router. Without "preempt", a rebooted higher-priority router stays Standby!',
          },
        ],
        commands: [
          { command: 'router ospf 1 / router-id 1.1.1.1 / network 10.0.0.0 0.0.0.255 area 0', mode: 'Router OSPF Config', purpose: 'Advertise matching interfaces into OSPF Area 0' },
          { command: 'show ip ospf neighbor', mode: 'Privileged EXEC', purpose: 'Confirm FULL/DR or FULL/BDR adjacency' },
        ],
        takeaway:
          'Remember OSPF wildcard masks are the INVERSE of subnet masks (/24 = 0.0.0.255, /30 = 0.0.0.3).',
        knowledgeCheck: [
          {
            id: 'ccna-4-3-q1',
            prompt:
              'Two OSPF routers on a shared Ethernet link show "2WAY/DROTHER" in "show ip ospf neighbor". Should you troubleshoot this?',
            options: [
              'Yes—timers are mismatched.',
              'No—DROTHER routers normally stay in 2-Way state with each other and form FULL only with the DR and BDR.',
              'Yes—the subnet masks do not match.',
              'Yes—one router is missing a static default route.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: Timer mismatches keep neighbors stuck in INIT or DOWN, not 2WAY.',
              'Correct: On multi-access Ethernet segments, non-DR/non-BDR routers (DROTHERs) intentionally stop at 2-Way with each other to avoid redundant flooding.',
              'Incorrect: Mismatched masks prevent Hello acceptance completely.',
              'Incorrect: Default routes do not block OSPF neighbor state transitions.',
            ],
            deepExplanation:
              'Seeing 2WAY/DROTHER between two non-designated routers on a shared switch is healthy OSPF operation—only FULL is expected with the DR and BDR.',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'ccna-t4-ex1',
        prompt:
          'R1 has OSPF process 10 and R2 has OSPF process 20 on the same 10.0.12.0/30 link in Area 0. Can they become FULL OSPF neighbors?',
        options: [
          'No—OSPF Process IDs must match globally.',
          'Yes—the OSPF Process ID is locally significant and does not need to match.',
          'Only if HSRP is configured.',
          'Only if RIP is redistributed.',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: Area IDs must match, NOT Process IDs.',
          'Correct: Process IDs are local to each router; Area ID, timers, subnet mask, and MTU must match.',
          'Incorrect: HSRP is unrelated to OSPF neighbor formation.',
          'Incorrect: RIP redistribution has nothing to do with OSPF Hello negotiation.',
        ],
        deepExplanation:
          'Do not confuse OSPF Process ID (locally significant) with OSPF Area ID (must match across neighbors on a link).',
      },
      {
        id: 'ccna-t4-ex2',
        prompt:
          'Which command ensures an HSRP router with priority 120 reclaims the Active role after rebooting?',
        options: ['standby 1 preempt', 'standby 1 timers 1 3', 'ip route 0.0.0.0 0.0.0.0', 'passive-interface g0/0'],
        correctIndex: 0,
        optionDetails: [
          'Correct: Preemption is disabled by default in HSRP and must be enabled explicitly with "standby <grp> preempt".',
          'Incorrect: Timers speed up failure detection but do not enable preemption.',
          'Incorrect: Default routes do not trigger HSRP takeover.',
          'Incorrect: Passive-interface belongs to OSPF/EIGRP, not HSRP.',
        ],
        deepExplanation:
          'Without "preempt", HSRP prevents flapping by leaving the current Active router in charge until it fails.',
      },
    ],
  },
  {
    id: 'ccna-t5-services',
    trackId: 'ccna',
    number: '05',
    title: 'IP Services: NAT, DHCP, DNS, NTP & Syslog',
    levelTag: 'advanced',
    domainRef: 'Domain 4 · IP Services (10%)',
    summary:
      'Translate private LANs to public IPs with PAT, relay DHCP across routers, align timestamps with NTP, and collect alerts via Syslog and SNMPv3.',
    subtopics: [
      {
        id: 'ccna-5-1',
        code: '5.1',
        title: 'NAT & PAT (Overload) Address Translation',
        levelTag: 'advanced',
        readMinutes: 6,
        summary:
          'Distinguish Inside Local vs. Inside Global addresses and configure PAT overload on an edge router.',
        beginnerMentalModel:
          'PAT works like a corporate reception desk: 500 employees inside (Inside Local 192.168.x.x) share ONE public company phone number (Inside Global 203.0.113.5), while the receptionist tracks unique extension numbers (TCP/UDP source ports) so return replies reach the right desk.',
        sections: [
          {
            heading: 'Four NAT Terms & Configuration Steps',
            body: 'Inside Local = private IP of internal PC. Inside Global = public IP after NAT. Step 1: Mark LAN interface "ip nat inside" and WAN interface "ip nat outside". Step 2: Create an ACL matching private IPs. Step 3: Bind with "ip nat inside source list 1 interface G0/1 overload".',
          },
        ],
        commands: [
          { command: 'ip nat inside / ip nat outside', mode: 'Interface Config', purpose: 'Define internal vs. external NAT boundaries' },
          { command: 'show ip nat translations', mode: 'Privileged EXEC', purpose: 'Inspect active Inside/Outside Local and Global mappings' },
        ],
        takeaway:
          'Forgetting "ip nat inside" or "ip nat outside" is the #1 reason NAT stops translating.',
        knowledgeCheck: [
          {
            id: 'ccna-5-1-q1',
            prompt:
              'PC 10.1.1.50 connects to 8.8.8.8. The edge router translates 10.1.1.50 to public IP 198.51.100.10. What is 10.1.1.50 called?',
            options: ['Inside Global', 'Inside Local', 'Outside Local', 'Outside Global'],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: 198.51.100.10 is the Inside Global.',
              'Correct: Inside Local is the private internal IP address assigned to the host before NAT translation.',
              'Incorrect: Outside addresses refer to the remote server.',
              'Incorrect: 8.8.8.8 is the Outside Global.',
            ],
            deepExplanation:
              'Think: "Inside" = your device; "Local" = before translation (private); "Global" = after translation (public).',
          },
        ],
      },
      {
        id: 'ccna-5-2',
        code: '5.2',
        title: 'DHCP DORA, Relay Agents, NTP & Syslog',
        levelTag: 'advanced',
        readMinutes: 6,
        summary:
          'Forward DHCP broadcasts across routed VLANs with ip helper-address, synchronize clocks with NTP, and read Syslog 0–7 severity levels.',
        beginnerMentalModel:
          'DHCP clients shout a broadcast ("Is any DHCP server here?!") that stops at the router wall. Adding "ip helper-address" turns the router into a polite courier who catches that shout and delivers it directly as unicast to your central DHCP server.',
        sections: [
          {
            heading: 'DHCP DORA & Excluded Ranges',
            body: 'DORA = Discover -> Offer -> Request -> Acknowledge. Always configure "ip dhcp excluded-address" for router gateways and printers so DHCP never hands them out to laptops.',
          },
          {
            heading: 'NTP & Syslog 0–7',
            body: 'NTP Stratum 1 syncs from an atomic/GPS clock (Stratum 0); Stratum 16 = unsynchronized. Syslog levels run 0 (Emergencies, worst) down to 7 (Debugging, noisiest). "logging trap 4" sends levels 0–4.',
          },
        ],
        commands: [
          { command: 'ip helper-address 10.10.50.10', mode: 'Interface Config', purpose: 'Relay client DHCP broadcasts to remote DHCP server' },
          { command: 'logging trap warnings', mode: 'Global Config', purpose: 'Send Syslog severity 0–4 to collector' },
        ],
        takeaway:
          'Put "ip helper-address" on the router interface facing the CLIENTS, never on the interface facing the DHCP server.',
        knowledgeCheck: [
          {
            id: 'ccna-5-2-q1',
            prompt: 'Which Syslog severity levels are transmitted when "logging trap 2" is configured?',
            options: [
              'Only level 2',
              'Levels 0, 1, and 2 (Emergencies, Alerts, Critical)',
              'Levels 2 through 7',
              'Levels 5, 6, and 7',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: Syslog trap sets a ceiling threshold, not a single isolated level.',
              'Correct: Lower Syslog numbers are higher severity; setting 2 sends 0, 1, and 2.',
              'Incorrect: 7 is Debugging, the lowest severity.',
              'Incorrect: 5–7 are informational/debugging levels excluded by trap 2.',
            ],
            deepExplanation:
              'Mnemonic: Every Awesome Cisco Engineer Will Need Icecream Daily (0-Emergencies, 1-Alerts, 2-Critical, 3-Errors, 4-Warnings, 5-Notifications, 6-Informational, 7-Debugging).',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'ccna-t5-ex1',
        prompt:
          'Clients in VLAN 30 cannot get IP addresses from the DHCP server in VLAN 100. Which command fixes this on the VLAN 30 router gateway?',
        options: [
          'ip nat inside',
          'ip helper-address <vlan100-dhcp-ip>',
          'ip dhcp excluded-address',
          'ntp server <vlan100-dhcp-ip>',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: NAT translates private/public IPs, not DHCP broadcasts.',
          'Correct: ip helper-address forwards UDP 67/68 DHCP broadcasts as unicast to the central server.',
          'Incorrect: Excluded-address reserves IPs on a local router DHCP server; it does not relay packets.',
          'Incorrect: NTP synchronizes clocks.',
        ],
        deepExplanation:
          'Routers block Layer 2/3 broadcasts by default, making DHCP Relay (ip helper-address) mandatory in centralized enterprise designs.',
      },
    ],
  },
  {
    id: 'ccna-t6-security',
    trackId: 'ccna',
    number: '06',
    title: 'Network & Layer 2 Security Fundamentals',
    levelTag: 'advanced',
    domainRef: 'Domain 5 · Security Fundamentals (15%)',
    summary:
      'Filter packets with Standard/Extended ACLs, lock down switchports with Port Security + DHCP Snooping + DAI, and compare TACACS+ vs. RADIUS.',
    subtopics: [
      {
        id: 'ccna-6-1',
        code: '6.1',
        title: 'Standard & Extended Access Control Lists (ACLs)',
        levelTag: 'advanced',
        readMinutes: 7,
        summary:
          'Place Standard vs. Extended ACLs correctly, write wildcard masks, and avoid the implicit deny trap.',
        beginnerMentalModel:
          'Think of an ACL like a nightclub bouncer reading a guest list strictly from top to bottom. The moment a line matches your packet, the bouncer stops reading—and if you reach the bottom of the list without a match, the invisible rule "deny ip any any" kicks you out!',
        sections: [
          {
            heading: 'Standard vs. Extended Placement Rule',
            body: 'Standard ACLs (1–99) only check SOURCE IP -> place closest to the DESTINATION so you do not accidentally block valid traffic to other servers. Extended ACLs (100–199, named) check Source IP, Destination IP, Protocol, and Ports -> place closest to the SOURCE to drop unwanted traffic early.',
          },
        ],
        commands: [
          { command: 'ip access-list extended BLOCK_SSH', mode: 'Global Config', purpose: 'Define a named extended ACL' },
          { command: 'ip access-group BLOCK_SSH in', mode: 'Interface Config', purpose: 'Bind ACL inbound on an interface' },
        ],
        takeaway:
          'An ACL with ONLY "deny" statements drops 100% of traffic because of the invisible "deny ip any any" at the end.',
        knowledgeCheck: [
          {
            id: 'ccna-6-1-q1',
            prompt:
              'You add "deny tcp 10.1.1.0 0.0.0.255 any eq 23" as the only line in an ACL and apply it inbound on Gi0/0. What happens to HTTPS (443) traffic?',
            options: [
              'HTTPS is allowed because only Telnet 23 was denied.',
              'HTTPS is blocked by the implicit "deny ip any any" at the end of the ACL.',
              'HTTPS is redirected to port 80.',
              'Only ICMP is blocked.',
            ],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: There must be an explicit "permit" line for other traffic to pass.',
              'Correct: Every Cisco ACL terminates with an invisible "deny ip any any"; without "permit ip any any", nothing passes.',
              'Incorrect: ACLs permit or drop; they do not rewrite TCP ports.',
              'Incorrect: All IP protocols hit the implicit deny.',
            ],
            deepExplanation:
              'Always verify your ACL ends with an explicit permit rule when your goal is blocking only specific ports/hosts.',
          },
        ],
      },
      {
        id: 'ccna-6-2',
        code: '6.2',
        title: 'Port Security, DHCP Snooping, DAI & AAA',
        levelTag: 'expert',
        readMinutes: 7,
        summary:
          'Defend Catalyst switches against MAC flooding, rogue DHCP servers, ARP poisoning, and compare TACACS+ vs. RADIUS.',
        beginnerMentalModel:
          'Port Security caps how many MACs can plug into a wall jack. DHCP Snooping makes a trusted notebook of real IP-to-MAC leases, and Dynamic ARP Inspection (DAI) checks every ARP packet against that notebook so attackers cannot spoof your gateway.',
        sections: [
          {
            heading: 'Layer 2 Switch Hardening',
            body: 'Port Security violation modes: shutdown (err-disables port, default), restrict (drops + logs + increments counter, port stays up), protect (silently drops). DHCP Snooping trusts uplinks ("ip dhcp snooping trust") and blocks rogue DHCP servers on untrusted edge ports.',
          },
          {
            heading: 'TACACS+ vs. RADIUS',
            body: 'TACACS+ (TCP 49) encrypts the entire packet and separates Authentication, Authorization, and Accounting (best for router/switch CLI admin). RADIUS (UDP 1812/1813) encrypts only the password and combines Auth + Authz (common for 802.1X wireless/user access).',
          },
        ],
        commands: [
          { command: 'switchport port-security maximum 2 / violation restrict', mode: 'Interface Config', purpose: 'Cap learned MACs and drop/log excess without shutting port' },
          { command: 'ip dhcp snooping trust', mode: 'Interface Config', purpose: 'Mark uplink toward legitimate DHCP server as trusted' },
        ],
        takeaway:
          'DAI depends directly on the DHCP Snooping binding table to validate untrusted ARP packets.',
        knowledgeCheck: [
          {
            id: 'ccna-6-2-q1',
            prompt:
              'Which protocol uses TCP port 49, encrypts the entire payload, and provides per-command CLI authorization for network engineers?',
            options: ['RADIUS', 'TACACS+', 'SNMPv2c', 'WPA3-SAE'],
            correctIndex: 1,
            optionDetails: [
              'Incorrect: RADIUS uses UDP 1812/1813 and only encrypts the password.',
              'Correct: TACACS+ uses TCP 49, encrypts the full packet, and decouples Authentication, Authorization, and Accounting.',
              'Incorrect: SNMPv2c uses cleartext community strings over UDP 161.',
              'Incorrect: WPA3-SAE is a Wi-Fi pre-shared key handshake.',
            ],
            deepExplanation:
              'Device administration -> TACACS+ (TCP 49). Network access / 802.1X -> RADIUS (UDP 1812/1813).',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'ccna-t6-ex1',
        prompt:
          'Where should an Extended ACL blocking 192.168.10.0/24 from reaching TCP 445 on Server 10.99.0.10 be applied?',
        options: [
          'As close to the source (192.168.10.0/24) as possible',
          'As close to the destination server as possible',
          'Only on the WAN loopback interface',
          'Extended ACLs cannot match TCP ports',
        ],
        correctIndex: 0,
        optionDetails: [
          'Correct: Extended ACLs check both source and destination, so placing them near the source drops unwanted traffic before it wastes network bandwidth.',
          'Incorrect: Closest-to-destination is the rule for Standard ACLs (which only check source IP).',
          'Incorrect: Loopback interfaces do not sit inline in client-to-server traffic paths.',
          'Incorrect: Matching TCP/UDP ports is the core strength of Extended ACLs.',
        ],
        deepExplanation:
          'Standard = closest to Destination; Extended = closest to Source.',
      },
    ],
  },
  {
    id: 'ccna-t7-automation',
    trackId: 'ccna',
    number: '07',
    title: 'Wireless Architecture & Network Automation',
    levelTag: 'expert',
    domainRef: 'Domain 2 & 6 · Wireless + Automation (10%)',
    summary:
      'Complete your journey to CCNA 200-301 mastery with CAPWAP split-MAC wireless, SDN control/data planes, REST APIs, JSON, and Ansible/Puppet/Chef.',
    subtopics: [
      {
        id: 'ccna-7-1',
        code: '7.1',
        title: 'Wireless Split-MAC, CAPWAP & SDN Architectures',
        levelTag: 'expert',
        readMinutes: 6,
        summary:
          'Understand how Lightweight APs tunnel to Wireless LAN Controllers and how SDN controllers separate Control Plane from Data Plane.',
        beginnerMentalModel:
          'In traditional networking, every switch and router had its own brain (Control Plane) and muscles (Data Plane). SDN moves the brain into one central software controller (like Cisco Catalyst Center) so engineers program intent once and push it everywhere.',
        sections: [
          {
            heading: 'CAPWAP & Control/Data Planes',
            body: 'Lightweight APs build CAPWAP tunnels (UDP 5246 control, UDP 5247 data) to a central WLC. In SDN, the Data Plane forwards packets via ASICs/CEF; the Control Plane computes paths/policies; the Management Plane handles SSH/SNMP/REST.',
          },
        ],
        commands: [
          { command: 'GET /dna/intent/api/v1/network-device', mode: 'Northbound REST API', purpose: 'Retrieve switch/router inventory from Catalyst Center' },
        ],
        takeaway:
          'Northbound APIs connect apps/scripts to the SDN controller (REST + JSON); Southbound APIs connect the controller down to switches (NETCONF/OpenFlow/SSH).',
        knowledgeCheck: [
          {
            id: 'ccna-7-1-q1',
            prompt:
              'Which pair of HTTP methods maps to Reading an inventory list and Creating a new VLAN policy via a REST API?',
            options: [
              'GET and POST',
              'PUT and DELETE',
              'PATCH and HEAD',
              'POST and DELETE',
            ],
            correctIndex: 0,
            optionDetails: [
              'Correct: In RESTful CRUD mapping, GET reads resources and POST creates new resources.',
              'Incorrect: PUT replaces/updates and DELETE removes.',
              'Incorrect: PATCH partially updates; HEAD retrieves headers only.',
              'Incorrect: DELETE removes resources rather than reading them.',
            ],
            deepExplanation:
              'CRUD = Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).',
          },
        ],
      },
      {
        id: 'ccna-7-2',
        code: '7.2',
        title: 'JSON, Ansible, Puppet, Chef & Terraform',
        levelTag: 'expert',
        readMinutes: 6,
        summary:
          'Spot invalid JSON payloads and compare agentless push (Ansible) vs. agent-based pull (Puppet/Chef) automation.',
        beginnerMentalModel:
          'Ansible is like a teacher walking up to each desk over SSH with a YAML checklist (no software needs to be installed on the router). Puppet and Chef install a helper agent on each server that periodically calls home to pull updates.',
        sections: [
          {
            heading: 'Automation Tool Matrix',
            body: 'Ansible = Agentless, Push model, SSH/NETCONF, YAML playbooks. Puppet = Agent-based, Pull model (TCP 8140), Ruby DSL manifests. Chef = Agent-based, Pull model, Ruby cookbooks. Terraform = Declarative infrastructure provisioning with HCL.',
          },
        ],
        commands: [
          { command: 'ansible-playbook -i inventory.ini vlans.yml', mode: 'Control Node', purpose: 'Push YAML configuration to Cisco IOS devices via SSH' },
        ],
        takeaway:
          'JSON requires double quotes on all keys/strings and forbids trailing commas after the final item.',
        knowledgeCheck: [
          {
            id: 'ccna-7-2-q1',
            prompt:
              'Why is Ansible preferred for automating traditional Cisco IOS switches compared to Puppet or Chef?',
            options: [
              'Ansible is agentless and pushes YAML playbooks directly over SSH/NETCONF.',
              'Cisco IOS natively runs Ruby Chef cookbooks.',
              'Ansible uses TCP 8140 pull agents on every switch.',
              'Ansible requires zero network connectivity.',
            ],
            correctIndex: 0,
            optionDetails: [
              'Correct: Traditional IOS devices cannot run third-party agents, making Ansible’s agentless SSH push model ideal.',
              'Incorrect: Classic Cisco IOS does not execute native Ruby Chef agents.',
              'Incorrect: TCP 8140 pull agents describe Puppet, not Ansible.',
              'Incorrect: Control nodes still require IP reachability via SSH/NETCONF.',
            ],
            deepExplanation:
              'Expect at least one 200-301 Domain 6 question comparing Ansible (agentless, push, YAML) against Puppet/Chef (agent-based, pull, Ruby).',
          },
        ],
      },
    ],
    topicExam: [
      {
        id: 'ccna-t7-ex1',
        prompt:
          'An API request to Cisco Catalyst Center returns HTTP 401 Unauthorized. What should the engineer check first?',
        options: [
          'The API URI path spelling',
          'Authentication credentials or X-Auth-Token header',
          'Trailing commas in the JSON response',
          'Spanning Tree Root Bridge priority',
        ],
        correctIndex: 1,
        optionDetails: [
          'Incorrect: A wrong URI returns 404 Not Found, not 401.',
          'Correct: 401 Unauthorized indicates missing, invalid, or expired authentication credentials/token.',
          'Incorrect: Malformed JSON from the client returns 400 Bad Request.',
          'Incorrect: STP is Layer 2 and unrelated to HTTP REST API status codes.',
        ],
        deepExplanation:
          'Key HTTP codes for CCNA: 200/201 Success, 400 Bad Request, 401 Unauthorized (bad/missing token), 403 Forbidden (lacks permission), 404 Not Found.',
      },
    ],
  },
];
