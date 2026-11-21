import { ExamQuestion } from '../types/ccna';

export const CCNA_QUESTIONS_PART_1: ExamQuestion[] = [
  // ==================== EASY (Network Fundamentals) ====================
  {
    id: 'ccna-e1',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'OSI Model & PDUs',
    prompt: 'Which Protocol Data Unit (PDU) name is associated with Layer 2 (Data Link) of the OSI model?',
    options: ['Segment', 'Packet', 'Frame', 'Bits'],
    correctIndices: [2],
    hints: [
      'Think about Ethernet headers (MAC addresses) and trailers (FCS) added just before bits hit the wire.',
      'Layer 4 = Segment, Layer 3 = Packet, Layer 2 = ?, Layer 1 = Bits.',
    ],
    explanation:
      'HOW & WHY: At Layer 2 (Data Link), switches and NICs encapsulate Layer 3 IP packets with source/destination MAC addresses and an FCS trailer, forming a Frame. Segments belong to Layer 4 (TCP) and Packets belong to Layer 3 (IP).',
  },
  {
    id: 'ccna-e2',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'Collision vs. Broadcast Domains',
    prompt: 'A 24-port Cisco Catalyst Layer 2 switch has all ports active in VLAN 1 with one workstation per port. How many collision domains and broadcast domains exist?',
    options: [
      '1 collision domain, 24 broadcast domains',
      '24 collision domains, 1 broadcast domain',
      '24 collision domains, 24 broadcast domains',
      '1 collision domain, 1 broadcast domain',
    ],
    correctIndices: [1],
    hints: [
      'Each switch port breaks up collisions, while broadcasts still flood across all ports in the same VLAN.',
      'Remember the rule: Switches separate collision domains per port; Routers (and VLANs) separate broadcast domains.',
    ],
    explanation:
      'HOW & WHY: Every individual port on a Layer 2 switch is its own collision domain (24 total). However, switches flood Layer 2 broadcasts out all ports in the same VLAN, so all 24 ports in VLAN 1 share 1 single broadcast domain.',
  },
  {
    id: 'ccna-e3',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'Copper & Fiber Cabling',
    prompt: 'You need to connect two campus buildings 1.8 kilometers apart at 10 Gbps with immunity to electromagnetic interference (EMI). Which cabling media should you choose?',
    options: [
      'Cat6A UTP copper cable',
      'Multimode fiber (OM3)',
      'Single-mode fiber (OS2)',
      'Cat5e STP copper cable',
    ],
    correctIndices: [2],
    hints: [
      'Copper UTP/STP tops out at 100 meters, and multimode fiber at 10 Gbps tops out around 300–400 meters.',
      'Only single-mode optical fiber carries laser light over multi-kilometer distances.',
    ],
    explanation:
      'HOW & WHY: Copper twisted-pair is limited to 100 m and multimode fiber (OM3/OM4) at 10 Gbps reaches 300–400 m. Single-mode fiber (SMF) uses a narrow 9-micron core with laser transceivers to reach 10 km+ without EMI.',
  },
  {
    id: 'ccna-e4',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'RFC 1918 Private IPv4',
    prompt: 'Which IPv4 address belongs to the RFC 1918 Class B private address range?',
    options: ['192.168.10.5', '172.32.1.10', '172.18.45.9', '169.254.12.8'],
    correctIndices: [2],
    hints: [
      'RFC 1918 private ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.',
      'The Class B private block 172.16.0.0/12 spans 172.16.0.0 through 172.31.255.255.',
    ],
    explanation:
      'HOW & WHY: 172.16.0.0/12 covers second octets 16–31 (172.16.0.0 – 172.31.255.255), so 172.18.45.9 is private. 172.32.1.10 is public, 192.168.10.5 is Class C private, and 169.254.12.8 is APIPA.',
  },
  {
    id: 'ccna-e5',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'TCP Three-Way Handshake',
    prompt: 'What is the exact sequence of TCP control flags exchanged to establish a reliable TCP session?',
    options: ['SYN -> ACK -> FIN', 'SYN -> SYN-ACK -> ACK', 'ACK -> SYN -> RST', 'SYN -> RST -> ACK'],
    correctIndices: [1],
    hints: [
      'The client initiates with a Synchronize flag, and the server replies with both Synchronize and Acknowledge.',
      'Three steps: Client sends SYN, Server sends SYN+ACK, Client confirms with ACK.',
    ],
    explanation:
      'HOW & WHY: TCP uses a three-way handshake (SYN -> SYN-ACK -> ACK) so both hosts synchronize initial sequence numbers and verify bidirectional reachability before exchanging application bytes.',
  },
  {
    id: 'ccna-e6',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'IPv4 Loopback Testing',
    prompt: 'Which IPv4 address block is reserved for local host loopback testing of the TCP/IP stack?',
    options: ['0.0.0.0/8', '127.0.0.0/8', '169.254.0.0/16', '224.0.0.0/4'],
    correctIndices: [1],
    hints: [
      'Pinging 127.0.0.1 never leaves your NIC onto the physical wire.',
      '169.254.0.0/16 is APIPA and 224.0.0.0/4 is Multicast.',
    ],
    explanation:
      'HOW & WHY: 127.0.0.0/8 (commonly 127.0.0.1) loops traffic internally back up the local OS TCP/IP stack to verify local network software without needing an active cable.',
  },
  {
    id: 'ccna-e7',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'Power over Ethernet (PoE)',
    prompt: 'Which IEEE PoE standard delivers up to 30W per port (PoE+) to power enterprise dual-radio Wi-Fi access points and PTZ cameras?',
    options: ['IEEE 802.3af', 'IEEE 802.3at', 'IEEE 802.1Q', 'IEEE 802.11ax'],
    correctIndices: [1],
    hints: [
      '802.3af is standard PoE (15.4W); the next letter up provides PoE+ (30W).',
      '802.1Q is VLAN tagging and 802.11ax is Wi-Fi 6.',
    ],
    explanation:
      'HOW & WHY: IEEE 802.3af (PoE) supplies up to 15.4W, IEEE 802.3at (PoE+) supplies up to 30W, and IEEE 802.3bt (UPoE/PoE++) scales to 60W–90W.',
  },
  {
    id: 'ccna-e8',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'IPv6 Address Basics',
    prompt: 'How many total bits are in an IPv6 address, and how are its groups written?',
    options: [
      '32 bits written as 4 decimal octets',
      '64 bits written as 6 hexadecimal pairs',
      '128 bits written as 8 colon-separated 16-bit hexadecimal groups',
      '256 bits written in binary',
    ],
    correctIndices: [2],
    hints: [
      'IPv4 is 32 bits; IPv6 quadruples that size.',
      'Each hexadecimal digit equals 4 bits, and there are 32 hex digits (8 groups x 4 hex digits).',
    ],
    explanation:
      'HOW & WHY: IPv6 addresses are 128 bits long (8 groups of 4 hexadecimal digits separated by colons, 8 x 16 = 128 bits), vastly expanding address space beyond IPv4’s 32 bits.',
  },
  {
    id: 'ccna-e9',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'ARP Resolution',
    prompt: 'What is the primary purpose of the Address Resolution Protocol (ARP) on an IPv4 Ethernet LAN?',
    options: [
      'Resolve a DNS hostname into an IPv4 address',
      'Resolve a known IPv4 address into its Layer 2 MAC address',
      'Assign an automatic IPv4 address to a booting laptop',
      'Prevent switching loops between redundant switches',
    ],
    correctIndices: [1],
    hints: [
      'A host knows the destination IP (or gateway IP) but needs the hardware address to build the Ethernet frame.',
      'ARP broadcasts "Who has 192.168.1.1?" and receives a Layer 2 MAC reply.',
    ],
    explanation:
      'HOW & WHY: Ethernet switches forward frames using MAC addresses, not IPs. ARP broadcasts an ARP Request to FF:FF:FF:FF:FF:FF asking which device owns a target IPv4 address so the sender can learn its MAC address.',
  },
  {
    id: 'ccna-e10',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'Well-Known Ports',
    prompt: 'Which TCP port numbers are used by HTTP and HTTPS respectively?',
    options: ['TCP 20 and TCP 21', 'TCP 22 and TCP 23', 'TCP 80 and TCP 443', 'UDP 53 and UDP 67'],
    correctIndices: [2],
    hints: [
      'Unencrypted web traffic uses port 80.',
      'TLS-encrypted web traffic uses port 443.',
    ],
    explanation:
      'HOW & WHY: HTTP operates on TCP 80 and HTTPS (HTTP over TLS) operates on TCP 443. Ports 20/21 are FTP, 22/23 are SSH/Telnet, and UDP 53/67 are DNS/DHCP.',
  },

  // ==================== EASY (Network Access) ====================
  {
    id: 'ccna-e11',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'Switch MAC Learning',
    prompt: 'When a Catalyst switch receives an Ethernet frame whose destination MAC address is NOT in its MAC address table (and is not a broadcast), what action does it take?',
    options: [
      'Drops the frame immediately',
      'Sends an ICMP unreachable message back to the sender',
      'Floods the frame out all active ports in that VLAN except the ingress port',
      'Forwards the frame only to the default gateway',
    ],
    correctIndices: [2],
    hints: [
      'Layer 2 switches handle unknown unicast frames the same way they handle broadcasts.',
      'It never sends a frame back out the exact port it arrived on (split-horizon flooding).',
    ],
    explanation:
      'HOW & WHY: Unknown unicast flooding ensures the frame reaches the destination if it exists anywhere in that VLAN. When the destination replies, the switch learns its source MAC and port from the return frame.',
  },
  {
    id: 'ccna-e12',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'Access vs. Trunk Ports',
    prompt: 'You connect an end-user desktop PC to switch interface Fa0/5 in VLAN 30. Which two commands properly configure Fa0/5 as an access port in VLAN 30?',
    options: [
      'switchport mode trunk / switchport trunk native vlan 30',
      'switchport mode access / switchport access vlan 30',
      'encapsulation dot1Q 30 / ip address 10.0.30.1 255.255.255.0',
      'no switchport / channel-group 30 mode active',
    ],
    correctIndices: [1],
    hints: [
      'End hosts expect untagged Ethernet frames on a single VLAN.',
      'Use "switchport mode access" followed by "switchport access vlan <id>".',
    ],
    explanation:
      'HOW & WHY: Access ports belong to a single data VLAN and strip 802.1Q tags before delivering frames to end hosts like PCs or printers.',
  },
  {
    id: 'ccna-e13',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'Spanning Tree Purpose',
    prompt: 'What network hazard does Spanning Tree Protocol (STP) prevent when switches are wired in a redundant triangle?',
    options: [
      'IPv4 address exhaustion',
      'Broadcast storms, MAC table flapping, and duplicate frame delivery',
      'Unauthorized SSH logins',
      'TCP window starvation',
    ],
    correctIndices: [1],
    hints: [
      'Layer 2 Ethernet headers have no TTL field like Layer 3 IP headers.',
      'Without blocking one redundant path, broadcast frames circulate infinitely.',
    ],
    explanation:
      'HOW & WHY: Unlike IP packets (which have a TTL), Ethernet frames have no loop-expiration timer. A physical switch loop causes broadcast frames to multiply endlessly (broadcast storm) and continually overwrite switch MAC tables.',
  },
  {
    id: 'ccna-e14',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'CDP & LLDP',
    prompt: 'You want to discover the hostname, port ID, and platform of a non-Cisco (Aruba/Juniper) switch connected directly to your Cisco Catalyst switch. Which vendor-neutral protocol should you enable?',
    options: ['CDP', 'LLDP', 'VTP', 'PAgP'],
    correctIndices: [1],
    hints: [
      'CDP is Cisco-proprietary; look for the IEEE 802.1AB open standard.',
      'Link Layer Discovery Protocol is abbreviated LLDP.',
    ],
    explanation:
      'HOW & WHY: CDP works only between Cisco (and select licensed) devices. IEEE 802.1AB LLDP is the vendor-neutral Layer 2 neighbor discovery protocol supported across Cisco, Juniper, Aruba, and Linux servers.',
  },
  {
    id: 'ccna-e15',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'Wireless Frequency Bands',
    prompt: 'Which wireless frequency band offers the longest range and best wall penetration, though with only three non-overlapping 20 MHz channels (1, 6, 11) in North America?',
    options: ['2.4 GHz', '5 GHz', '6 GHz', '60 GHz'],
    correctIndices: [0],
    hints: [
      'Lower frequencies travel farther through drywall and concrete.',
      'Channels 1, 6, and 11 are classic non-overlapping channels in the legacy band.',
    ],
    explanation:
      'HOW & WHY: 2.4 GHz penetrates obstacles better and travels farther than 5 GHz or 6 GHz, but suffers from severe crowding because only channels 1, 6, and 11 do not overlap.',
  },
  {
    id: 'ccna-e16',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'STP PortFast',
    prompt: 'Why should "spanning-tree portfast" be enabled ONLY on access ports connected to workstations/printers and NEVER on switch-to-switch uplinks?',
    options: [
      'PortFast disables PoE power on uplink ports.',
      'PortFast bypasses Listening/Learning states straight to Forwarding, which prevents DHCP timeouts on PCs—but could create a transient Layer 2 loop if connected to another switch.',
      'PortFast converts access ports into 802.1Q trunks.',
      'PortFast increases the STP Hello timer to 60 seconds.',
    ],
    correctIndices: [1],
    hints: [
      'Normal STP takes 30–50 seconds before forwarding traffic, causing PC DHCP requests to time out.',
      'Skipping Listening/Learning on an inter-switch link risks a brief bridging loop.',
    ],
    explanation:
      'HOW & WHY: PortFast transitions an edge port immediately to Forwarding so booting PCs get DHCP leases without waiting 30 seconds. Pair it with BPDU Guard on access ports so if someone plugs in a switch, the port safely err-disables.',
  },
  {
    id: 'ccna-e17',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'Wireless Security Standards',
    prompt: 'Which wireless security protocol introduces Simultaneous Authentication of Equals (SAE) to defeat offline dictionary attacks on pre-shared keys?',
    options: ['WEP', 'WPA-TKIP', 'WPA2-PSK', 'WPA3-Personal'],
    correctIndices: [3],
    hints: [
      'WPA2-PSK uses a 4-way handshake vulnerable to offline brute-force if captured.',
      'The newest Wi-Fi Alliance standard replaces PSK with Dragonfly/SAE.',
    ],
    explanation:
      'HOW & WHY: WPA3-Personal replaces WPA2’s 4-way PSK handshake with SAE (Simultaneous Authentication of Equals), preventing attackers who sniff an authentication exchange from running offline password-cracking attacks.',
  },

  // ==================== EASY (IP Connectivity & Services & Security & Automation) ====================
  {
    id: 'ccna-e18',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'easy',
    topic: 'Routing Table Codes',
    prompt: 'In Cisco IOS "show ip route" output, what does the route code "L" next to 192.168.1.1/32 represent?',
    options: [
      'A static route learned via LLDP',
      'A Local host route representing the exact IP address configured on the router’s own interface',
      'A load-balanced EIGRP route',
      'A legacy RIP route',
    ],
    correctIndices: [1],
    hints: [
      'Since IOS 15, configuring an interface IP automatically installs two entries: a "C" subnet route and an "L" /32 route.',
      '"C" = Connected network; "L" = Local interface IP.',
    ],
    explanation:
      'HOW & WHY: "C" identifies the directly connected subnet (e.g., 192.168.1.0/24), while "L" identifies the exact /32 IP address assigned to the router’s local interface (e.g., 192.168.1.1/32) so packets destined to the router itself hit the CPU.',
  },
  {
    id: 'ccna-e19',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'easy',
    topic: 'Default Route Syntax',
    prompt: 'Which Cisco IOS static route command configures a default route (gateway of last resort) pointing to ISP next-hop 203.0.113.1?',
    options: [
      'ip route 255.255.255.255 0.0.0.0 203.0.113.1',
      'ip route 0.0.0.0 0.0.0.0 203.0.113.1',
      'ip default-gateway 0.0.0.0 203.0.113.1',
      'router ospf default 203.0.113.1',
    ],
    correctIndices: [1],
    hints: [
      'A default route matches all destination networks with a zero prefix and zero mask.',
      'In IOS global config, static routes always start with "ip route <prefix> <mask> <next-hop>".',
    ],
    explanation:
      'HOW & WHY: "ip route 0.0.0.0 0.0.0.0 203.0.113.1" creates a 0.0.0.0/0 static route (marked S* in the routing table) that matches any destination lacking a more specific route.',
  },
  {
    id: 'ccna-e20',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'easy',
    topic: 'OSPF Backbone Area',
    prompt: 'In a multi-area OSPFv2 network, which area number MUST act as the backbone area to which all other non-backbone areas connect?',
    options: ['Area 1', 'Area 0', 'Area 100', 'Area 255'],
    correctIndices: [1],
    hints: [
      'Inter-area traffic in OSPF cannot flow directly between Area 1 and Area 2 without crossing this central area.',
      'It is the very first integer.',
    ],
    explanation:
      'HOW & WHY: Area 0 (0.0.0.0) is the mandatory OSPF backbone area. All standard areas must connect directly to Area 0 through an Area Border Router (ABR) to exchange inter-area routes loop-free.',
  },
  {
    id: 'ccna-e21',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'DHCP DORA Sequence',
    prompt: 'In what exact order are the four DHCPv4 messages exchanged when a client leases an IPv4 address from a server?',
    options: [
      'Offer -> Discover -> Ack -> Request',
      'Discover -> Offer -> Request -> Ack',
      'Request -> Discover -> Offer -> Ack',
      'Discover -> Request -> Offer -> Ack',
    ],
    correctIndices: [1],
    hints: [
      'Use the classic four-letter acronym D-O-R-A.',
      'Client broadcasts Discover, Server sends Offer, Client broadcasts Request, Server confirms with Ack.',
    ],
    explanation:
      'HOW & WHY: DHCP follows DORA: Client broadcasts Discover (UDP 67), Server responds with Offer (UDP 68), Client broadcasts Request accepting a specific Offer, and Server finalizes the lease with an Ack.',
  },
  {
    id: 'ccna-e22',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'SSH vs. Telnet',
    prompt: 'Why do security policies mandate SSH instead of Telnet for remote management of Cisco routers and switches?',
    options: [
      'SSH uses UDP, which is faster than Telnet.',
      'Telnet sends usernames, passwords, and commands in clear text, whereas SSH encrypts the entire session.',
      'Telnet does not support IPv4.',
      'SSH works without an IP address on the switch.',
    ],
    correctIndices: [1],
    hints: [
      'Think about what a packet sniffer (Wireshark) captures during a Telnet login.',
      'SSH runs on TCP 22 with strong symmetric/asymmetric encryption.',
    ],
    explanation:
      'HOW & WHY: Anyone capturing traffic on a Telnet path (TCP 23) can read the enable secret and configuration commands in plain ASCII. SSH (TCP 22) encrypts authentication and all CLI traffic.',
  },
  {
    id: 'ccna-e23',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'NTP Purpose',
    prompt: 'Why is configuring Network Time Protocol (NTP) critical across all enterprise routers, switches, and firewalls?',
    options: [
      'It increases interface Gigabit throughput.',
      'It keeps Syslog timestamps synchronized so engineers can accurately correlate security events and outages across devices.',
      'It replaces DNS name resolution.',
      'It automatically backs up running-config to TFTP.',
    ],
    correctIndices: [1],
    hints: [
      'Imagine debugging an outage when R1 logs 09:14, SW1 logs 03:02, and your firewall logs 2019-01-01.',
      'Accurate clocks are also required for TLS certificate validity checks.',
    ],
    explanation:
      'HOW & WHY: Without NTP synchronization, Syslog forensics and security investigations fail because log timestamps do not align across devices—and TLS/PKI certificates can falsely appear expired.',
  },
  {
    id: 'ccna-e24',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'CIA Triad',
    prompt: 'Which pillar of the CIA triad ensures that sensitive payroll data has NOT been altered or tampered with during transmission?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Authorization'],
    correctIndices: [1],
    hints: [
      'Confidentiality = privacy (encryption); Availability = uptime; what verifies data wasn’t modified?',
      'Hashing algorithms like SHA-256 verify this pillar.',
    ],
    explanation:
      'HOW & WHY: Integrity guarantees data accuracy and trustworthiness—proving it was not modified in transit or at rest (often verified via cryptographic hashes/HMACs). Confidentiality prevents unauthorized reading, and Availability ensures authorized access.',
  },
  {
    id: 'ccna-e25',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'Standard vs. Extended ACL Numbers',
    prompt: 'Which Cisco numbered Access Control List (ACL) range corresponds to Standard IPv4 ACLs (matching source IP only)?',
    options: ['1–99 (and 1300–1999)', '100–199 (and 2000–2699)', '300–399', '1000–1099'],
    correctIndices: [0],
    hints: [
      'Standard ACLs came first with lower numbers.',
      '100–199 are Extended ACLs (which match protocol, ports, source, and destination).',
    ],
    explanation:
      'HOW & WHY: Numbered Standard IPv4 ACLs use 1–99 (expanded 1300–1999) and filter solely by source IPv4 address. Extended ACLs use 100–199 (expanded 2000–2699) and match protocol, TCP/UDP ports, source IP, and destination IP.',
  },
  {
    id: 'ccna-e26',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'easy',
    topic: 'Data Serialization Formats',
    prompt: 'Which data serialization format relies strictly on spaces for indentation (never tabs) and dashes (-) for list items, making it popular for Ansible playbooks?',
    options: ['JSON', 'XML', 'YAML', 'CSV'],
    correctIndices: [2],
    hints: [
      'JSON uses curly braces {} and square brackets []; XML uses <tags>.',
      'Its recursive acronym stands for "YAML Ain’t Markup Language".',
    ],
    explanation:
      'HOW & WHY: YAML uses human-readable key: value pairs, strict space-based indentation for hierarchy, and leading hyphens (-) for arrays/lists—making it standard for Ansible playbooks and Kubernetes manifests.',
  },

  // ==================== MEDIUM (Fundamentals, Access & Connectivity) ====================
  {
    id: 'ccna-m1',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'Subnet Broadcast & Range',
    prompt: 'A server is configured with IPv4 address 172.16.35.78/20. What are the network address and broadcast address of this subnet?',
    options: [
      'Network: 172.16.35.0 | Broadcast: 172.16.35.255',
      'Network: 172.16.32.0 | Broadcast: 172.16.47.255',
      'Network: 172.16.16.0 | Broadcast: 172.16.31.255',
      'Network: 172.16.0.0 | Broadcast: 172.16.255.255',
    ],
    correctIndices: [1],
    hints: [
      'A /20 mask is 255.255.240.0—meaning the interesting octet is the 3rd octet with a block size of 256 - 240 = 16.',
      'List multiples of 16 in the 3rd octet: 0, 16, 32, 48... Where does 35 fall?',
    ],
    explanation:
      'HOW & WHY: /20 = 255.255.240.0, block size = 16 in the 3rd octet. Multiples of 16 are 0, 16, 32, 48. Since 35 lies between 32 and 47, the Network ID is 172.16.32.0 and the Broadcast ID (one before 172.16.48.0) is 172.16.47.255.',
  },
  {
    id: 'ccna-m2',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'IPv6 Zero Compression',
    prompt: 'Which compressed IPv6 address is the valid shortest representation of 2001:0DB8:0000:0000:0042:0000:0000:0001?',
    options: [
      '2001:DB8::42::1',
      '2001:DB8::42:0:0:1',
      '2001:DB8:0:0:42::1',
      '2001:0DB8::42:0000:0000:1',
    ],
    correctIndices: [1],
    hints: [
      'Rule 1: Omit leading zeros in each hextet. Rule 2: You may use "::" ONLY ONCE per address.',
      'Both "0000:0000" runs have 2 groups; RFC 5952 prefers compressing the leftmost longest run.',
    ],
    explanation:
      'HOW & WHY: You can never use "::" twice (so Option A is illegal). Stripping leading zeros gives 2001:DB8:0:0:42:0:0:1, and compressing the leftmost longest run of consecutive zero hextets yields 2001:DB8::42:0:0:1.',
  },
  {
    id: 'ccna-m3',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'EUI-64 Interface ID Calculation',
    prompt: 'A router interface has MAC address 00:1A:2B:3C:4D:5E and generates an IPv6 link-local address using EUI-64. What are the last 64 bits (Interface ID)?',
    options: [
      '001A:2BFF:FE3C:4D5E',
      '021A:2BFF:FE3C:4D5E',
      '021A:2BFE:FF3C:4D5E',
      '001A:2B3C:FFFE:4D5E',
    ],
    correctIndices: [1],
    hints: [
      'Step 1: Split the 48-bit MAC in half and insert FFFE in the middle. Step 2: Invert the 7th bit (Universal/Local bit) of the first byte.',
      'First byte is 0x00 (0000 0000). Flipping the 7th bit from the left gives 0000 0010 = 0x02.',
    ],
    explanation:
      'HOW & WHY: EUI-64 splits 001A.2B | 3C.4D5E, inserts FFFE -> 001A:2BFF:FE3C:4D5E, and flips the 7th (U/L) bit of the first byte (0x00 -> 0x02), producing 021A:2BFF:FE3C:4D5E.',
  },
  {
    id: 'ccna-m4',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'Point-to-Point Subnetting',
    prompt: 'How many usable host IPv4 addresses are available on a WAN point-to-point link configured with a /30 (255.255.255.252) subnet mask?',
    options: ['1', '2', '4', '6'],
    correctIndices: [1],
    hints: [
      'A /30 leaves 32 - 30 = 2 host bits.',
      'Use 2^h - 2 (subtracting network ID and broadcast ID).',
    ],
    explanation:
      'HOW & WHY: With 2 host bits, total addresses = 2^2 = 4. Subtracting the network address and broadcast address leaves 2 usable host IPs—ideal for a two-router serial or point-to-point Ethernet link.',
  },
  {
    id: 'ccna-m5',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'IPv6 Neighbor Discovery',
    prompt: 'In IPv6, which ICMPv6 message types replace IPv4 ARP to resolve a next-hop IPv6 address to its Layer 2 MAC address?',
    options: [
      'Router Solicitation (RS) and Router Advertisement (RA)',
      'Neighbor Solicitation (NS) and Neighbor Advertisement (NA)',
      'Echo Request and Echo Reply',
      'DHCPv6 Solicit and Advertise',
    ],
    correctIndices: [1],
    hints: [
      'IPv6 eliminates Layer 2 broadcast ARP completely and uses multicast ICMPv6 Neighbor Discovery (NDP).',
      'RS/RA discover default gateways and prefixes; what pair resolves link-layer MAC addresses?',
    ],
    explanation:
      'HOW & WHY: IPv6 Neighbor Discovery uses ICMPv6 Neighbor Solicitation (type 135, sent to a Solicited-Node Multicast address) and Neighbor Advertisement (type 136) to map IPv6 addresses to MAC addresses without broadcast flooding.',
  },
  {
    id: 'ccna-m6',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'Native VLAN & Unmarked Frames',
    prompt: 'On an 802.1Q trunk between SW1 and SW2, VLAN 99 is configured as the Native VLAN on both sides. How does SW1 transmit VLAN 99 frames across the trunk?',
    options: [
      'With an 802.1Q tag containing VID 99',
      'Untagged (no 802.1Q header inserted)',
      'Encapsulated in ISL headers',
      'Dropped unless VTP is enabled',
    ],
    correctIndices: [1],
    hints: [
      'The Native VLAN is the single special VLAN on an 802.1Q trunk that avoids tagging.',
      'If both ends disagree on which VLAN is native, traffic crosses into the wrong VLAN!',
    ],
    explanation:
      'HOW & WHY: By IEEE 802.1Q specification, frames belonging to the Native VLAN leave a trunk port untagged, and incoming untagged frames on a trunk are placed into the configured Native VLAN.',
  },
  {
    id: 'ccna-m7',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'Rapid PVST+ Port Roles',
    prompt: 'In Rapid PVST+ (802.1w), what is the name of the non-root port role that provides a backup path toward the Root Bridge and immediately transitions to Forwarding if the primary Root Port fails?',
    options: ['Backup Port', 'Alternate Port', 'Designated Port', 'Disabled Port'],
    correctIndices: [1],
    hints: [
      'An Alternate Port receives superior BPDUs from ANOTHER switch; a Backup Port receives them from the SAME switch via a hub.',
      'This role replaces the legacy 802.1D Blocking role for alternate upstream paths.',
    ],
    explanation:
      'HOW & WHY: In RSTP/Rapid PVST+, an Alternate Port holds a discarded backup path to the Root Bridge learned from a different upstream switch, allowing sub-second failover if the Root Port goes down.',
  },
  {
    id: 'ccna-m8',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'Voice + Data VLAN Access Port',
    prompt: 'An engineer plugs a Cisco IP Phone into SW1 Fa0/12 and connects a PC behind the phone. Which two commands configure Fa0/12 to tag voice traffic in VLAN 50 while keeping PC traffic untagged in VLAN 10?',
    options: [
      'switchport mode trunk / switchport trunk native vlan 10',
      'switchport access vlan 10 / switchport voice vlan 50',
      'switchport access vlan 50 / switchport voice vlan 10',
      'switchport mode dynamic auto / spanning-tree portfast',
    ],
    correctIndices: [1],
    hints: [
      'Access ports supporting a Cisco IP Phone remain "switchport mode access" and use a dedicated voice VLAN command.',
      'Data VLAN (PC) = "switchport access vlan 10"; IP Phone = "switchport voice vlan 50".',
    ],
    explanation:
      'HOW & WHY: Pairing "switchport access vlan 10" with "switchport voice vlan 50" creates a special mini-trunk: CDP/LLDP tells the phone to tag voice frames with 802.1Q VLAN 50 while forwarding untagged PC frames on VLAN 10.',
  },
  {
    id: 'ccna-m9',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'EtherChannel Compatibility',
    prompt: 'Which condition will prevent two Catalyst switches from bundling Gi0/1 and Gi0/2 into a Layer 2 EtherChannel?',
    options: [
      'Both ports run at 1000 Mbps Full Duplex.',
      'Gi0/1 is configured for VLAN 10 access while Gi0/2 is configured for VLAN 20 access.',
      'Both switches use LACP mode active.',
      'The port-channel numbers (channel-group 1 on SW1 vs. channel-group 5 on SW2) differ.',
    ],
    correctIndices: [1],
    hints: [
      'Channel-group numbers are locally significant on each switch.',
      'Every member port in a bundle must share identical speed, duplex, trunk/access mode, and VLAN configuration.',
    ],
    explanation:
      'HOW & WHY: EtherChannel requires all member interfaces on a switch to match in speed, duplex, STP cost, switchport mode, and allowed/access VLANs. Mismatched VLANs (10 vs 20) prevent bundling and often err-disable the port.',
  },
  {
    id: 'ccna-m10',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'WLC Split-MAC vs. FlexConnect',
    prompt: 'A branch office has 15 wireless users and a slow WAN link back to HQ where the central Cisco WLC resides. How should you configure the branch Lightweight APs so local wireless traffic stays on the branch LAN even if the WAN drops?',
    options: [
      'Local Mode with CAPWAP encryption disabled',
      'FlexConnect Mode with Local Switching enabled',
      'Monitor Mode',
      'Sniffer Mode',
    ],
    correctIndices: [1],
    hints: [
      'In standard Local Mode, ALL client packets tunnel back to the HQ WLC over CAPWAP.',
      'This mode specifically bridges branch SSID traffic locally while keeping WLC management over the WAN.',
    ],
    explanation:
      'HOW & WHY: FlexConnect Mode allows Lightweight APs at remote branches to switch client data traffic locally onto branch VLANs (Local Switching) instead of hair-pinning every packet across the WAN to the HQ WLC, and keeps local SSIDs alive during WAN outages.',
  },
  {
    id: 'ccna-m11',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'OSPFv2 DR/BDR Election',
    prompt: 'Four routers (R1–R4) share a multi-access Ethernet segment in OSPF Area 0. All routers use default OSPF priority 1, except R4 has "ip ospf priority 0" on its interface. Which statement is true?',
    options: [
      'R4 automatically becomes the DR because 0 is the lowest priority.',
      'R4 will never become DR or BDR and remains DROTHER.',
      'R4 cannot form an OSPF neighbor relationship at all.',
      'R4 forces all neighbors to use Point-to-Point network type.',
    ],
    correctIndices: [1],
    hints: [
      'Higher OSPF interface priority wins DR election (default = 1, max = 255).',
      'Priority 0 has a special meaning: opt out of DR/BDR candidacy completely.',
    ],
    explanation:
      'HOW & WHY: In OSPF DR/BDR elections, highest interface priority wins (then highest Router ID). Setting "ip ospf priority 0" explicitly disqualifies a router from ever becoming DR or BDR while still allowing normal neighbor adjacencies.',
  },
  {
    id: 'ccna-m12',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'OSPF Router ID Selection',
    prompt: 'R1 has no manual "router-id" configured under "router ospf 1". Its active interfaces are Gi0/0 (10.1.1.1/30), Gi0/1 (192.168.50.1/24), and Loopback0 (172.16.1.1/32). Which IPv4 address becomes R1’s OSPF Router ID?',
    options: ['192.168.50.1', '172.16.1.1', '10.1.1.1', '0.0.0.0'],
    correctIndices: [1],
    hints: [
      'OSPF RID priority order: 1) Manual router-id command, 2) Highest UP Loopback IP, 3) Highest UP Physical IP.',
      'Loopback interfaces ALWAYS beat physical interfaces regardless of numerical IP value.',
    ],
    explanation:
      'HOW & WHY: OSPF selects its 32-bit Router ID in strict precedence: manual "router-id" first, then highest active Loopback IP (172.16.1.1), and only uses physical interfaces (192.168.50.1) if no Loopbacks are up.',
  },
  {
    id: 'ccna-m13',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'IPv6 Static Route with Link-Local',
    prompt: 'When configuring an IPv6 static route using the neighbor router’s Link-Local address (fe80::2) as the next hop, what additional parameter MUST Cisco IOS include?',
    options: [
      'Administrative Distance 110',
      'The local router’s outgoing exit interface (e.g., GigabitEthernet0/0)',
      'An IPv4 loopback address',
      'The neighbor’s EUI-64 MAC address',
    ],
    correctIndices: [1],
    hints: [
      'Every interface on a router uses the exact same FE80::/10 Link-Local prefix!',
      'Without naming which wire to exit, the router wouldn’t know which link fe80::2 lives on.',
    ],
    explanation:
      'HOW & WHY: Because fe80::/10 is valid on every link simultaneously, a router cannot resolve a Link-Local next hop without specifying the outgoing exit interface (e.g., "ipv6 route 2001:db8:2::/64 GigabitEthernet0/0 fe80::2").',
  },
  {
    id: 'ccna-m14',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'HSRP Virtual MAC Address',
    prompt: 'Two gateways run HSRPv1 Group 15 (0x0F in hex) for VLAN 10. What virtual MAC address do clients learn via ARP for their default gateway?',
    options: [
      '0000.0c07.ac15',
      '0000.0c07.ac0f',
      '0000.5e00.010f',
      'ffff.ffff.ffff',
    ],
    correctIndices: [1],
    hints: [
      'HSRPv1 virtual MAC format is 0000.0c07.acXX where XX is the group number in hexadecimal.',
      'Decimal 15 converted to two-digit hexadecimal is 0F (not 15!).',
    ],
    explanation:
      'HOW & WHY: HSRPv1 uses MAC 0000.0c07.acXX where XX = hex group ID. Decimal 15 = 0x0F, yielding 0000.0c07.ac0f. (0000.5e00.01XX is VRRP).',
  },
  {
    id: 'ccna-m15',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'OSPF Passive Interface',
    prompt: 'Why should you configure "passive-interface GigabitEthernet0/1" inside "router ospf 1" when Gi0/1 faces an end-user LAN?',
    options: [
      'It removes the 192.168.10.0/24 subnet from OSPF advertisements completely.',
      'It stops sending/receiving OSPF Hello packets toward user PCs while still advertising the LAN subnet into OSPF.',
      'It halves the OSPF cost of Gi0/1.',
      'It blocks user DHCP traffic on Gi0/1.',
    ],
    correctIndices: [1],
    hints: [
      'Workstations have no need to receive OSPF Hello multicasts (224.0.0.5) every 10 seconds.',
      'Preventing rogue OSPF adjacencies on user-facing ports does NOT stop the router from advertising that subnet to upstream OSPF neighbors.',
    ],
    explanation:
      'HOW & WHY: "passive-interface" suppresses OSPF Hello generation and neighbor formation on user-facing LAN ports (hardening against rogue router injection), while continuing to advertise that interface’s subnet via the router’s Router LSA.',
  },
  {
    id: 'ccna-m16',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'SNMPv3 Security Modes',
    prompt: 'Which SNMPv3 security level provides both SHA/MD5 message authentication AND AES payload encryption?',
    options: ['noAuthNoPriv', 'authNoPriv', 'authPriv', 'v2c-community'],
    correctIndices: [2],
    hints: [
      'In SNMPv3 naming: "auth" = authentication/integrity, "priv" = privacy/encryption.',
      'Look for the option enabling both Auth and Priv.',
    ],
    explanation:
      'HOW & WHY: SNMPv3 offers three levels: noAuthNoPriv (username only), authNoPriv (hashed authentication without encryption), and authPriv (both cryptographic authentication and AES/DES payload encryption).',
  },
  {
    id: 'ccna-m17',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'QoS Per-Hop Behavior',
    prompt: 'In an enterprise DiffServ QoS policy, which DSCP value is standard for Low Latency Queuing (LLQ) of real-time VoIP bearer packets?',
    options: ['CS0 (Best Effort)', 'EF (Expedited Forwarding - DSCP 46)', 'AF11', 'CS1 (Scavenger)'],
    correctIndices: [1],
    hints: [
      'Voice needs minimal jitter and strict priority queuing.',
      'EF = Expedited Forwarding (46) is reserved specifically for real-time voice.',
    ],
    explanation:
      'HOW & WHY: Expedited Forwarding (EF, DSCP 46) marks delay-sensitive VoIP RTP audio so routers/switches place it in a strict-priority hardware queue (LLQ) ahead of bulk data.',
  },
  {
    id: 'ccna-m18',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'Wildcard Mask Math',
    prompt: 'An Extended ACL must match the entire subnet 172.16.32.0/21 in a single ACE. Which wildcard mask is correct?',
    options: ['0.0.3.255', '0.0.7.255', '0.0.15.255', '255.255.248.0'],
    correctIndices: [1],
    hints: [
      'First convert /21 to a subnet mask: 255.255.248.0.',
      'Subtract every octet of the subnet mask from 255.255.255.255.',
    ],
    explanation:
      'HOW & WHY: /21 = 255.255.248.0. Subtracting from 255.255.255.255 gives (255-255).(255-255).(255-248).(255-0) = 0.0.7.255.',
  },
  {
    id: 'ccna-m19',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'ACL Placement Strategy',
    prompt: 'Why does Cisco best practice recommend placing Extended ACLs as close to the TRAFFIC SOURCE as possible, while placing Standard ACLs close to the DESTINATION?',
    options: [
      'Extended ACLs cannot inspect source IP addresses.',
      'Extended ACLs match both source and destination/port, so placing them near the source drops unwanted traffic immediately without wasting bandwidth; Standard ACLs only match source IP, so placing them near the source would break access to everything else.',
      'Standard ACLs only work on outbound interfaces.',
      'Extended ACLs consume double the subnet mask bits.',
    ],
    correctIndices: [1],
    hints: [
      'Think about blast radius: if a Standard ACL denies source 10.1.1.0/24 near the source, ALL destinations are blocked!',
      'Extended ACLs can say "deny 10.1.1.0/24 ONLY to Server X port 22".',
    ],
    explanation:
      'HOW & WHY: Because Extended ACLs filter granularly (src + dst + port), placing them near the source saves WAN/LAN bandwidth immediately. Standard ACLs can only filter by source IP, so placing them near the destination prevents accidentally blocking that source from reaching unrelated servers.',
  },
  {
    id: 'ccna-m20',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    topic: 'Cisco Catalyst Center vs. Meraki',
    prompt: 'How does the Cisco Meraki management architecture differ fundamentally from an on-premises Cisco Catalyst Center (DNA Center) controller deployment?',
    options: [
      'Meraki switches require manual per-switch CLI configuration over SSH.',
      'Meraki devices are managed via a cloud-hosted dashboard controller using out-of-band TLS tunnels, whereas Catalyst Center is typically an on-premises network controller appliance.',
      'Meraki does not support VLANs or SSIDs.',
      'Catalyst Center manages devices exclusively without REST APIs.',
    ],
    correctIndices: [1],
    hints: [
      'Where does the Meraki controller live vs. the Catalyst Center hardware appliance?',
      'Meraki APs/switches phone home automatically over HTTPS/TLS to Meraki cloud.',
    ],
    explanation:
      'HOW & WHY: Cisco Meraki is cloud-managed—devices securely connect to the Meraki cloud dashboard for zero-touch provisioning and policy updates—whereas Catalyst Center runs on-premises (or virtual/cloud appliance) inside the enterprise network for intent-based automation.',
  },
  {
    id: 'ccna-m21',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    topic: 'Southbound vs. Northbound APIs',
    prompt: 'In an SDN architecture, an application script calls a REST API on the SDN Controller to request a new campus QoS policy, and the controller then pushes YANG-modeled changes to switches using NETCONF. Which APIs are Northbound and Southbound?',
    options: [
      'NETCONF is Northbound; REST is Southbound.',
      'REST (app-to-controller) is Northbound; NETCONF (controller-to-switches) is Southbound.',
      'Both REST and NETCONF are Southbound APIs.',
      'SSH CLI is the only Northbound API.',
    ],
    correctIndices: [1],
    hints: [
      'Think vertically from the SDN Controller’s perspective: Apps sit "north" (above) the controller; network switches sit "south" (below) the controller.',
      'Apps -> Controller = Northbound; Controller -> Switches = Southbound.',
    ],
    explanation:
      'HOW & WHY: Northbound APIs (typically REST/JSON) let external orchestration apps talk UP to the SDN controller. Southbound APIs (NETCONF, RESTCONF, OpenFlow, OpFlex) let the controller program DOWN to physical/virtual network switches.',
  },

  // ==================== SCENARIO-BASED & HARD (Part 1: Fundamentals, Access, Connectivity) ====================
  {
    id: 'ccna-h1-scen',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: VLSM Subnet Overlap & Sizing',
    prompt:
      'Scenario: You are assigned the block 192.168.100.0/24 for a new branch:\n• Engineering LAN needs 100 hosts\n• Sales LAN needs 45 hosts\n• Guest Wi-Fi needs 25 hosts\n• WAN Point-to-Point link needs 2 hosts\nUsing optimal VLSM (largest subnet first), what network address and mask should be assigned to the Guest Wi-Fi subnet?',
    options: [
      '192.168.100.128/26',
      '192.168.100.192/27',
      '192.168.100.192/26',
      '192.168.100.224/27',
    ],
    correctIndices: [1],
    hints: [
      'Allocate largest first: Engineering (100 hosts) needs /25 (128 IPs: .0–.127). Sales (45 hosts) needs /26 (64 IPs: .128–.191).',
      'Now Guest Wi-Fi needs 25 hosts (plus gateway = 26 -> /27 provides 30 usable hosts) starting right after .191!',
    ],
    explanation:
      'HOW & WHY: Step-by-step VLSM: 1) Engineering (100 hosts -> /25 = 126 usable): 192.168.100.0 – .127. 2) Sales (45 hosts -> /26 = 62 usable): 192.168.100.128 – .191. 3) Guest Wi-Fi (25 hosts -> /27 = 30 usable): starts at 192.168.100.192/27 (.192 – .223), leaving .224/30 for the WAN link.',
  },
  {
    id: 'ccna-h2-scen',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: MTU Path Blackhole',
    prompt:
      'Scenario: Branch users connected over an IPsec GRE tunnel can ping remote servers with default 56-byte packets and open lightweight login pages, but HTTPS file downloads and large database queries hang indefinitely. Checking router interfaces shows GRE tunnel MTU is 1476, and hosts send 1500-byte packets with the DF (Don’t Fragment) bit set while an upstream firewall drops ICMP Type 3 Code 4. What caused the hang?',
    options: [
      'ARP cache timeout on the branch switch',
      'Path MTU Discovery (PMTUD) blackhole: 1500-byte DF packets exceed the 1476 GRE MTU and ICMP "Fragmentation Needed" messages are blocked',
      'Duplicate MAC addresses on VLAN 1',
      'OSPF Hello timer mismatch',
    ],
    correctIndices: [1],
    hints: [
      'Small pings succeed, large transfers stall—always suspect MTU/fragmentation!',
      'IPsec + GRE headers reduce available payload MTU below 1500 bytes, and DF=1 prevents routers from fragmenting.',
    ],
    explanation:
      'HOW & WHY: When DF=1 is set on 1500-byte TCP segments hitting a 1476-byte GRE tunnel, the router drops the packet and sends ICMP Type 3 Code 4 ("Fragmentation Needed"). If a firewall blocks ICMP, the sender never lowers its MSS/MTU, causing large transfers to hang ("PMTUD blackhole"). Fix via "ip tcp adjust-mss 1360".',
  },
  {
    id: 'ccna-h3-scen',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Suboptimal STP Root Bridge',
    prompt:
      'Scenario: Core-SW1 and Core-SW2 are dual 10 Gbps distribution switches. Access-SW9 on Floor 4 was accidentally replaced with an old switch carrying STP priority 4096 for VLAN 10 while Core-SW1/SW2 run default priority 32768. Immediately, Floor 1–3 VLAN 10 traffic begins routing all the way up to Floor 4 over a 1 Gbps uplink and back down. What happened and how do you fix it cleanly?',
    options: [
      'Access-SW9 became the VLAN 10 Root Bridge because 4096 < 32768; set Core-SW1 priority to 0 (or root primary) and Core-SW2 to 4096 (root secondary) with Root Guard on core downlinks.',
      'Enable PortFast on the 10 Gbps core-to-core link.',
      'Disable Spanning Tree globally on Access-SW9.',
      'Change VLAN 10 Native VLAN to 99.',
    ],
    correctIndices: [0],
    hints: [
      'Lowest Bridge Priority wins Root Bridge election in STP.',
      'Both fixing core priorities AND protecting core ports against rogue lower BPDUs prevent recurrence.',
    ],
    explanation:
      'HOW & WHY: Because 4096 beats default 32768, Access-SW9 hijacked the Root Bridge role, pulling the active forwarding tree through its slow 1 Gbps uplink. Setting Core-SW1 as primary root (priority 24576 or 4096/0), Core-SW2 as secondary, and enabling "spanning-tree guard root" on access-facing core ports restores deterministic forwarding.',
  },
  {
    id: 'ccna-h4-scen',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: EtherChannel Err-Disable',
    prompt:
      'Scenario: After an intern cables Gi0/3 and Gi0/4 into a new switch and configures "channel-group 2 mode on" on SW-DIST, the remote switch SW-EDGE was left in "channel-group 2 mode active". Seconds later, SW-DIST logs "%PM-4-ERR_DISABLE: channel-misconfig error detected on Gi0/3, putting Po2 in err-disable state." Why did STP/EtherChannel guard err-disable the bundle?',
    options: [
      'LACP "active" (negotiated) cannot form a bundle with static "on" (non-negotiated), causing one side to treat them as two separate loops with mismatched BPDUs.',
      'Channel-group 2 is reserved exclusively for Gigabit uplinks.',
      'LACP requires PAgP desirable on the partner switch.',
      'Port-channel interfaces cannot carry VLAN 1.',
    ],
    correctIndices: [0],
    hints: [
      'Look at the two modes paired together: static "on" sends ZERO LACP PDUs.',
      'When SW-EDGE doesn’t receive LACP responses, it keeps ports as standalone links, triggering EtherChannel misconfig guard.',
    ],
    explanation:
      'HOW & WHY: Mode "on" forces EtherChannel without sending LACP/PAgP packets. Meanwhile, mode "active" sends LACP PDUs and expects a reply; getting none, it leaves ports unbundled, which triggers STP/EtherChannel misconfig guard to err-disable the link to prevent a Layer 2 loop. Both sides must use LACP (active+active or active+passive).',
  },
  {
    id: 'ccna-h5-scen',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Remote Branch AP WLC Discovery',
    prompt:
      'Scenario: You ship 10 brand-new Cisco Lightweight APs to a branch subnet 10.40.0.0/24 where there is no local WLC. The central WLC sits at HQ (10.1.0.50) across a routed WAN, and broadcast CAPWAP discovery packets do not cross routers. Which two mechanisms allow the APs to discover 10.1.0.50 automatically out of the box? (Choose two.)',
    multiSelect: true,
    options: [
      'DHCP Option 43 configured on the branch DHCP scope with the WLC IP 10.1.0.50',
      'An internal DNS A record resolving "CISCO-CAPWAP-CONTROLLER.<domain>" to 10.1.0.50',
      'Enabling PortFast on the branch switchports',
      'Configuring "ip helper-address 10.1.0.50" on VLAN 1 only for CAPWAP',
    ],
    correctIndices: [0, 1],
    hints: [
      'Cisco Lightweight APs follow a strict Layer 3 discovery order when on a different subnet from the WLC.',
      'Think of DHCP vendor options and automatic DNS hostname lookup!',
    ],
    explanation:
      'HOW & WHY: Because Layer 3 broadcasts stop at routers, Cisco Lightweight APs check: 1) previously stored WLC IPs, 2) DHCP Option 43 (vendor-specific controller IP), and 3) DNS lookup for CISCO-CAPWAP-CONTROLLER.<local-domain>. Option 43 and DNS are the two standard zero-touch L3 discovery methods.',
  },
  {
    id: 'ccna-h6-scen',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: OSPF Asymmetric Path & Reference Bandwidth',
    prompt:
      'Scenario: R1 has two paths to HQ subnet 10.99.0.0/24: Path A over two 10 Gbps dark-fiber links (R1 -> R2 -> HQ), and Path B over a single direct 100 Mbps backup circuit (R1 -> HQ). All routers run default OSPF settings ("auto-cost reference-bandwidth 100"). Traffic unexpectedly takes the slower 100 Mbps Path B! Why, and what single change fixes all routers?',
    options: [
      'Default reference bandwidth 100 Mbps gives 100M, 1G, and 10G links the exact same cost of 1—so 1 hop (cost 1) beats 2 hops (cost 2). Raise "auto-cost reference-bandwidth 100000" on all OSPF routers.',
      'OSPF always prefers directly connected routers regardless of bandwidth.',
      '10 Gbps links require OSPF Area 10.',
      'Lowering Hello timers to 1 second changes OSPF path cost.',
    ],
    correctIndices: [0],
    hints: [
      'Calculate OSPF cost with default ref-bw = 100: 100/100 = 1; 100/10000 = 0.01 -> rounded up to 1!',
      'So 1 hop of 100M = cost 1, while 2 hops of 10G = 1 + 1 = cost 2!',
    ],
    explanation:
      'HOW & WHY: OSPF cost = Reference Bandwidth / Interface Bandwidth (minimum 1). With default 100 Mbps reference bandwidth, both 100 Mbps and 10 Gbps compute to cost 1—making 1 hop of 100M (total cost 1) look "cheaper" than 2 hops of 10G (total cost 2). Configuring "auto-cost reference-bandwidth 100000" (100 Gbps) across every OSPF router makes 10G cost 10 and 100M cost 1000.',
  },
  {
    id: 'ccna-h7-scen',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: HSRP Split-Brain / Interface Tracking',
    prompt:
      'Scenario: R1 (HSRP Priority 110, preempt enabled) is Active for VLAN 10, while R2 (Priority 100, preempt enabled) is Standby. R1’s LAN interface Gi0/1 stays UP, but R1’s WAN ISP uplink Gi0/0 goes DOWN! Because Gi0/1 is still up, R1 continues claiming Active HSRP status and blackholes all VLAN 10 Internet traffic. Which HSRP configuration prevents this?',
    options: [
      'Configure HSRP interface/object tracking on R1 to decrement R1’s priority by 20 when Gi0/0 goes down so R1 drops from 110 to 90 and R2 (100) preempts Active.',
      'Disable HSRP preemption on R2.',
      'Set R2 priority to 50.',
      'Change HSRP timers to 30 seconds.',
    ],
    correctIndices: [0],
    hints: [
      'HSRP Hello packets only monitor the LAN interface unless told to watch the WAN uplink!',
      'R2 has priority 100 and preempt enabled—so R1’s priority must drop BELOW 100 when its WAN link fails.',
    ],
    explanation:
      'HOW & WHY: By default, HSRP only fails over if the LAN interface dies or R1 loses power. Configuring "standby 10 track 1 decrement 20" (tracking Gi0/0 line-protocol) drops R1 from 110 to 90 when the WAN dies, allowing R2 (100 + preempt) to take over Active forwarding immediately.',
  },
  {
    id: 'ccna-h8-sim',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: Interface Speed/Duplex & Cable Fault',
    prompt:
      'Users on Floor 3 report excruciatingly slow file transfers to AppServer-01 connected on SW2 Gi0/8. Inspect the three switch/server tabs and pinpoint the exact Layer 1/2 fault.',
    exhibitTabs: [
      {
        title: 'SW2: show interfaces Gi0/8',
        output: `GigabitEthernet0/8 is up, line protocol is up (connected)\n  Full-duplex, 100Mb/s, media type is 10/100/1000BaseTX\n  0 runts, 0 giants, 0 throttles\n  4821 input errors, 4819 CRC, 0 frame, 0 overrun, 0 ignored\n  0 output errors, 0 collisions, 0 interface resets`,
      },
      {
        title: 'SW2: show running-config int Gi0/8',
        output: `interface GigabitEthernet0/8\n description AppServer-01\n switchport access vlan 20\n switchport mode access\n speed 100\n duplex full`,
      },
      {
        title: 'AppServer-01 NIC Status',
        output: `Link Speed: 100 Mbps | Duplex: HALF-DUPLEX (Auto-Negotiation fell back because peer disabled auto-neg)`,
      },
    ],
    options: [
      'SW2 Gi0/8 is in the wrong VLAN.',
      'SW2 hard-coded "speed 100 / duplex full" (disabling auto-negotiation), causing AppServer-01 to fall back to 100/Half-Duplex—creating a duplex mismatch logged as CRC errors on SW2.',
      'The SFP transceiver on Gi0/8 is missing.',
      'Port Security shut down Gi0/8.',
    ],
    correctIndices: [1],
    hints: [
      'Compare SW2’s duplex ("Full-duplex") with AppServer-01’s NIC Status ("HALF-DUPLEX").',
      'When one side hard-codes speed/duplex and turns off auto-negotiation, IEEE 802.3 parallel detection forces the auto-neg partner to half-duplex!',
    ],
    explanation:
      'HOW & WHY: Hard-coding "speed 100" and "duplex full" on SW2 disables IEEE 802.3 auto-negotiation. AppServer-01 detects 100 Mbps link pulses via parallel detection but cannot negotiate duplex, so it defaults to Half-Duplex. SW2 (Full) then logs thousands of CRC/input errors whenever both transmit simultaneously. Fix: configure "speed auto" and "duplex auto" on both ends.',
  },
  {
    id: 'ccna-h9-sim',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: STP & Trunk Loop Investigation',
    prompt:
      'SW1 and SW2 were recently upgraded, and now VLAN 40 hosts cannot reach their gateway on SW1 despite Gi0/1 showing "trunking". Inspect the outputs carefully.',
    exhibitTabs: [
      {
        title: 'SW1: show interfaces trunk',
        output: `Port        Mode         Encapsulation  Status        Native vlan\nGi0/1       on           802.1q         trunking      99\n\nPort        Vlans in spanning tree forwarding state and not pruned\nGi0/1       1,10,20,40`,
      },
      {
        title: 'SW2: show interfaces trunk',
        output: `Port        Mode         Encapsulation  Status        Native vlan\nGi0/1       on           802.1q         trunking      1\n\nPort        Vlans in spanning tree forwarding state and not pruned\nGi0/1       1,10,20`,
      },
      {
        title: 'SW2: show logging (last 3 lines)',
        output: `%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with SW1 GigabitEthernet0/1 (99).\n%SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id 99 on GigabitEthernet0/1 VLAN1.\n%SPANTREE-2-BLOCK_PVID_PEER: Blocking GigabitEthernet0/1 on VLAN0099. Inconsistent peer vlan.`,
      },
    ],
    options: [
      'Two faults exist: Native VLAN mismatch (99 vs. 1) blocking STP PVID, AND VLAN 40 is missing/not allowed on SW2 Gi0/1.',
      'SW1 Gi0/1 must be set to "switchport mode access".',
      'CDP caused the link to lose power.',
      'STP Root Bridge MAC addresses cannot end in 0.',
    ],
    correctIndices: [0],
    hints: [
      'Check three things across SW1 and SW2: Native VLAN column, allowed VLANs list, and the STP syslog lines.',
      'SW1 has Native VLAN 99 and allows VLAN 40; SW2 has Native VLAN 1 and stops at VLAN 20!',
    ],
    explanation:
      'HOW & WHY: Inspecting both trunk tables and logs reveals two distinct faults: 1) Native VLAN mismatch (SW1=99, SW2=1) triggers %SPANTREE-2-BLOCK_PVID_PEER, and 2) SW2’s trunk list omits VLAN 40 ("Vlans forwarding: 1,10,20"). Both must be aligned ("switchport trunk native vlan 99" and creating/allowing VLAN 40 on SW2).',
  },
  {
    id: 'ccna-h10-dd',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    questionType: 'drag-drop',
    topic: 'STP Port States & Rapid PVST+',
    prompt: 'Match each Rapid PVST+ (802.1w) port state to its exact frame and MAC-learning behavior.',
    dragDrop: {
      items: ['Discarding', 'Learning', 'Forwarding'],
      targets: [
        {
          id: 'rstp-disc',
          slotLabel: 'Drops data frames, does NOT learn MACs, listens to BPDUs (combines Disabled/Blocking/Listening)',
          correctItem: 'Discarding',
        },
        {
          id: 'rstp-learn',
          slotLabel: 'Still drops user data frames, but begins populating the MAC address table',
          correctItem: 'Learning',
        },
        {
          id: 'rstp-fwd',
          slotLabel: 'Normal active state: learns MACs and forwards user frames',
          correctItem: 'Forwarding',
        },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      'Legacy 802.1D had 5 states; Rapid PVST+ collapsed Disabled, Blocking, and Listening into one.',
      'Learning prepares the MAC table right before Forwarding opens user traffic.',
    ],
    explanation:
      'HOW & WHY: Rapid PVST+ (802.1w) uses only 3 port states: Discarding (no user traffic, no MAC learning), Learning (no user traffic yet, populates MAC table to prevent initial flooding), and Forwarding (full operation).',
  },
  {
    id: 'ccna-h11-dd',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    questionType: 'drag-drop',
    topic: 'IPv6 Prefix Classification',
    prompt: 'Match each IPv6 prefix to its official IPv6 address category.',
    dragDrop: {
      items: ['2000::/3', 'FC00::/7', 'FE80::/10', 'FF00::/8'],
      targets: [
        { id: 'v6-gua', slotLabel: 'Global Unicast Address (public Internet routable)', correctItem: '2000::/3' },
        { id: 'v6-ula', slotLabel: 'Unique Local Address (private internal routing)', correctItem: 'FC00::/7' },
        { id: 'v6-ll', slotLabel: 'Link-Local Unicast (valid only on single wire/segment)', correctItem: 'FE80::/10' },
        { id: 'v6-mc', slotLabel: 'IPv6 Multicast (e.g., FF02::1 All-Nodes)', correctItem: 'FF00::/8' },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      '2xxx/3xxx = Global; FE80 = Link-Local; FF = Multicast.',
      'FC00::/7 (practically FD00::/8) serves the same private-network role as IPv4 RFC 1918.',
    ],
    explanation:
      'HOW & WHY: Knowing these four prefixes instantly identifies any IPv6 address: 2000::/3 = Global Unicast, FC00::/7 = Unique Local (private), FE80::/10 = Link-Local, and FF00::/8 = Multicast.',
  },
  // Additional Easy/Medium/Hard CCNA Qs in Part 1 to hit 48 new items
  {
    id: 'ccna-e27',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'Switch vs. Router Forwarding',
    prompt: 'Which hardware address does a router rewrite at every Layer 3 hop while keeping the source and destination IP addresses intact (assuming no NAT)?',
    options: [
      'The IPv4 TTL field stays unchanged while the hostname changes.',
      'The Layer 2 source and destination MAC addresses inside the Ethernet header',
      'The TCP source port number',
      'The DNS domain suffix',
    ],
    correctIndices: [1],
    hints: [
      'IP addresses are end-to-end; MAC addresses are hop-to-hop.',
      'Each router strips the incoming Ethernet frame, decrements TTL, and builds a new frame with its own exit MAC and the next hop’s MAC.',
    ],
    explanation:
      'HOW & WHY: Layer 3 IP addresses stay end-to-end across the path (unless NAT runs), whereas Layer 2 MAC addresses are rewritten on every single link hop.',
  },
  {
    id: 'ccna-e28',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'DNS Purpose',
    prompt: 'Which protocol translates human-friendly domain names like "portal.cisco.com" into IPv4 (A record) or IPv6 (AAAA record) addresses?',
    options: ['DHCP', 'DNS', 'ICMP', 'ARP'],
    correctIndices: [1],
    hints: [
      'A = IPv4 address; AAAA (quad-A) = IPv6 address.',
      'Uses UDP/TCP port 53.',
    ],
    explanation:
      'HOW & WHY: Domain Name System (DNS) on port 53 resolves names to IPv4 (A) and IPv6 (AAAA) addresses.',
  },
  {
    id: 'ccna-m22',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'OSPF Default Route Injection',
    prompt: 'Edge router R1 has a working static default route "ip route 0.0.0.0 0.0.0.0 203.0.113.1" toward the ISP. Which command under "router ospf 1" advertises that default route to all internal OSPF routers?',
    options: [
      'network 0.0.0.0 255.255.255.255 area 0',
      'default-information originate',
      'redistribute connected subnets',
      'ip ospf default-gateway',
    ],
    correctIndices: [1],
    hints: [
      'OSPF does not advertise 0.0.0.0/0 via a standard "network" statement.',
      'Think "originate default information" inside OSPF process configuration.',
    ],
    explanation:
      'HOW & WHY: "default-information originate" instructs an ASBR to inject an OSPF External Type-2 (O*E2) 0.0.0.0/0 route into the OSPF domain, provided a default route already exists in R1’s routing table (or add "always" to advertise unconditionally).',
  },
  {
    id: 'ccna-m23',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'Floating Static Route Verification',
    prompt: 'R1 learns 10.50.0.0/24 via OSPF (AD 110) and also has a static route "ip route 10.50.0.0 255.255.255.0 172.16.1.2 130". Why does the static route NOT appear in "show ip route" right now?',
    options: [
      'Because AD 130 is worse (higher) than OSPF AD 110, so the router keeps the floating static as a standby backup.',
      'Because static routes must have AD 0.',
      'Because 172.16.1.2 is a private IP.',
      'Because OSPF always blocks static routes.',
    ],
    correctIndices: [0],
    hints: [
      'Lower Administrative Distance = more trustworthy.',
      'The routing table shows only the single best-AD routing source per exact prefix.',
    ],
    explanation:
      'HOW & WHY: Floating static routes deliberately use an AD higher than the primary routing protocol (130 > OSPF 110). While OSPF is healthy, OSPF stays in the RIB; if OSPF loses the route, the AD 130 static route activates automatically.',
  },
  {
    id: 'ccna-m24',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: '802.1Q Tag Size & TPID',
    prompt: 'When an 802.1Q VLAN tag is inserted into an Ethernet frame on a trunk link, how many bytes are added and what EtherType (TPID) identifies the tag?',
    options: [
      '2 bytes; TPID 0x0800',
      '4 bytes; TPID 0x8100',
      '8 bytes; TPID 0x86DD',
      '20 bytes; TPID 0x0806',
    ],
    correctIndices: [1],
    hints: [
      'TPID (2 bytes) + TCI (2 bytes, holding 3-bit PCP, 1-bit DEI, and 12-bit VLAN ID) = total tag length.',
      '0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6, 0x8100 = 802.1Q.',
    ],
    explanation:
      'HOW & WHY: IEEE 802.1Q inserts a 4-byte tag right after the Source MAC address, starting with TPID 0x8100 and containing the 12-bit VLAN ID (supporting VLANs 1–4094).',
  },
  {
    id: 'ccna-m25',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'Trunk Allowed VLANs Pitfall',
    prompt: 'On SW1 Gi0/1 (already carrying VLANs 10, 20, and 30 on its trunk), an engineer types "switchport trunk allowed vlan 40". What happens to users in VLANs 10, 20, and 30 across Gi0/1?',
    options: [
      'VLAN 40 is safely appended alongside 10, 20, and 30.',
      'VLANs 10, 20, and 30 are immediately dropped from the trunk because the "add" keyword was omitted!',
      'Gi0/1 converts to an access port.',
      'Only VLAN 10 is affected.',
    ],
    correctIndices: [1],
    hints: [
      'Cisco IOS replaces the entire allowed-VLAN list unless you explicitly include one keyword.',
      'Always use "switchport trunk allowed vlan add 40" on live trunks!',
    ],
    explanation:
      'HOW & WHY: One of the most common live-network outages: typing "switchport trunk allowed vlan 40" overwrites the entire list with ONLY 40, severing VLANs 10, 20, and 30. Always use "add" ("switchport trunk allowed vlan add 40").',
  },
  {
    id: 'ccna-m26',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'OSPF Neighbor States',
    prompt: 'During OSPFv2 neighbor startup on a broadcast Ethernet segment, two DROTHER routers (R3 and R4) stop progressing and remain permanently in which normal OSPF state with each other?',
    options: ['DOWN', 'INIT', '2-WAY', 'EXSTART'],
    correctIndices: [2],
    hints: [
      'DROTHER routers form FULL adjacencies ONLY with the DR and BDR.',
      'With fellow DROTHERs, they exchange Hellos and stop right after seeing their own RID in each other’s Hello.',
    ],
    explanation:
      'HOW & WHY: On broadcast networks, DROTHERs only build FULL adjacencies with the DR and BDR to prevent O(n^2) LSA flooding. Between two DROTHERs, remaining in "2-WAY/DROTHER" is completely normal and healthy.',
  },
  {
    id: 'ccna-h12-sim',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: Suboptimal Routing & AD Clash',
    prompt:
      'Traffic from R1 to HQ subnet 10.88.0.0/24 is flowing across an expensive metered LTE backup link (172.16.99.2) instead of the primary 1 Gbps MPLS fiber link learned via OSPF (10.0.12.2). Inspect R1’s routing table and config tabs to identify why.',
    exhibitTabs: [
      {
        title: 'R1: show ip route 10.88.0.0',
        output: `Routing entry for 10.88.0.0/24\n  Known via "static", distance 1, metric 0\n  Routing Descriptor Blocks:\n  * 172.16.99.2\n      Route metric is 0, traffic share count is 1`,
      },
      {
        title: 'R1: show ip ospf database',
        output: `Router Link States (Area 0): 10.88.0.0/24 advertised by 2.2.2.2 (Cost: 11) via 10.0.12.2`,
      },
      {
        title: 'R1: show running-config | inc ip route',
        output: `ip route 10.88.0.0 255.255.255.0 172.16.99.2`,
      },
    ],
    options: [
      'OSPF Area 0 cannot advertise 10.88.0.0/24.',
      'The backup static route uses default AD 1 instead of a floating AD > 110, so it always overrides OSPF (AD 110).',
      '10.0.12.2 has a higher OSPF Router ID.',
      'The static route needs a /32 mask.',
    ],
    correctIndices: [1],
    hints: [
      'Look at "Known via static, distance 1" vs. OSPF distance 110.',
      'Without a trailing AD argument like 150, a static route has AD 1 and beats OSPF even when MPLS is healthy!',
    ],
    explanation:
      'HOW & WHY: A static route with no Administrative Distance specified defaults to AD 1, beating OSPF (AD 110) permanently. Adding a higher AD (e.g., "ip route 10.88.0.0 255.255.255.0 172.16.99.2 150") turns it into a true floating backup route so OSPF over MPLS carries primary traffic.',
  },
  {
    id: 'ccna-h13-scen',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: OSPF Stalled at EXSTART/EXCHANGE',
    prompt:
      'Scenario: R1 and R2 see each other’s OSPF Hellos, elect DR/BDR, and enter EXSTART—but "show ip ospf neighbor" repeatedly resets between EXSTART and DOWN without ever reaching FULL. Ping with "df-bit size 1500" fails between R1 and R2. What is causing OSPF to stall at EXSTART?',
    options: [
      'An IP MTU mismatch between R1 and R2 interfaces prevents large Database Description (DBD) packets from completing exchange.',
      'Their OSPF Process IDs do not match.',
      'Both routers are in Area 0.',
      'Passive-interface is enabled on R1’s loopback.',
    ],
    correctIndices: [0],
    hints: [
      'Hellos are tiny (~80 bytes), so they pass! Where do OSPF neighbors first exchange MTU values and larger DBD packets?',
      'Notice the clue: "ping df-bit size 1500 fails" across the link.',
    ],
    explanation:
      'HOW & WHY: During OSPF EXSTART/EXCHANGE, neighbors verify interface IP MTU inside Database Description (DBD) packets. If one side has MTU 1500 and the other has MTU 1400 (or jumbo 9000), DBD negotiation stalls in EXSTART/EXCHANGE indefinitely until MTUs match (or "ip ospf mtu-ignore" is applied carefully after fixing the underlying L2/L3 MTU).',
  },
  {
    id: 'ccna-h14-scen',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Campus Spine-Leaf vs. 3-Tier Design',
    prompt:
      'Scenario: A cloud-hosted data center experiences heavy east-west traffic between hundreds of virtualization servers across 12 racks and requires predictable latency (always two hops between any two servers) with zero STP-blocked links. Which physical/logical topology best fits?',
    options: [
      'Legacy 3-tier Core/Distribution/Access with Spanning Tree blocking half the uplinks',
      'Two-tier Spine-and-Leaf Layer 3 ECMP fabric (every Leaf connects to every Spine)',
      'A flat daisy-chained ring of 12 access switches',
      'Hub-and-spoke Frame Relay',
    ],
    correctIndices: [1],
    hints: [
      'Traditional 3-tier trees are optimized for north-south user-to-internet traffic and rely on STP.',
      'Spine-Leaf fabrics place every server leaf exactly 1 spine hop away from any other leaf using L3 Equal-Cost Multi-Pathing.',
    ],
    explanation:
      'HOW & WHY: A Spine-and-Leaf topology uses Layer 3 routed ECMP uplinks so every leaf connects directly to every spine—eliminating STP-blocked ports and guaranteeing consistent deterministic latency (Leaf -> Spine -> Leaf) for high-volume east-west server traffic.',
  },
];
