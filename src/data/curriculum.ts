import { CurriculumLesson, DomainMeta } from '../types/ccna';

export const CCNA_DOMAINS: DomainMeta[] = [
  {
    id: 'fundamentals',
    number: '01',
    title: 'Network Fundamentals',
    examWeight: 20,
    summary: 'OSI & TCP/IP encapsulation, cabling, physical interface errors, IPv4/IPv6 addressing, and VLSM subnetting.',
  },
  {
    id: 'access',
    number: '02',
    title: 'Network Access',
    examWeight: 20,
    summary: 'VLANs, 802.1Q trunking, CDP/LLDP discovery, EtherChannel (LACP/PAgP), Rapid PVST+, and Cisco wireless architectures.',
  },
  {
    id: 'connectivity',
    number: '03',
    title: 'IP Connectivity',
    examWeight: 25,
    summary: 'Routing table decision logic, longest prefix match, static/floating routes, single-area OSPFv2, and HSRP.',
  },
  {
    id: 'services',
    number: '04',
    title: 'IP Services',
    examWeight: 10,
    summary: 'NAT/PAT translation, DHCP relay, DNS, NTP stratum hierarchy, SNMP, Syslog severity levels, and QoS.',
  },
  {
    id: 'security',
    number: '05',
    title: 'Security Fundamentals',
    examWeight: 15,
    summary: 'Standard & Extended ACLs, Port Security, DHCP Snooping, Dynamic ARP Inspection, AAA, VPNs, and WPA3.',
  },
  {
    id: 'automation',
    number: '06',
    title: 'Automation & Programmability',
    examWeight: 10,
    summary: 'REST APIs, JSON encoding, SDN control/data planes, Catalyst Center, and Ansible/Terraform workflows.',
  },
];

export const CURRICULUM_LESSONS: CurriculumLesson[] = [
  // Domain 1: Fundamentals
  {
    id: 'fund-osi-encap',
    domainId: 'fundamentals',
    code: '1.1',
    title: 'OSI Model, TCP/IP & Data Encapsulation',
    readMinutes: 6,
    summary: 'Trace how application payloads are encapsulated into segments, packets, frames, and electrical or optical bits across switches and routers.',
    keyPoints: [
      'Layer 4 Segments (TCP/UDP) carry source and destination port numbers for process multiplexing.',
      'Layer 3 Packets carry logical IP addresses; routers inspect and forward based on destination IP without altering source/destination IP.',
      'Layer 2 Frames carry hardware MAC addresses; switches forward frames using the MAC address table, while routers rewrite L2 headers on every hop.',
      'TCP provides three-way handshake (SYN, SYN-ACK, ACK), sequence numbers, and windowing; UDP provides low-overhead stateless delivery.',
    ],
    deepDive: [
      {
        heading: 'Hop-by-Hop Frame Rewrite vs. End-to-End IP',
        body: 'When PC-A sends traffic to a remote server across two routers, the source and destination IPv4 addresses remain fixed end-to-end (assuming no NAT). However, at each router hop, the incoming Ethernet frame header and FCS trailer are stripped, the TTL is decremented by 1, and a brand-new Layer 2 frame is built using the router egress MAC as source and the next-hop MAC as destination.',
      },
      {
        heading: 'TCP vs. UDP Selection',
        body: 'Expect exam scenarios pairing protocols to transport layers: SSH (TCP 22), HTTPS (TCP 443), BGP (TCP 179) vs. TFTP (UDP 69), SNMP (UDP 161/162), NTP (UDP 123), DHCP (UDP 67/68). DNS uses UDP 53 for standard queries and TCP 53 for zone transfers or large responses.',
      },
    ],
    commands: [
      { command: 'show interfaces GigabitEthernet0/0', mode: 'Privileged EXEC', purpose: 'Inspect L1/L2 status, MTU, duplex, CRC, and input/output errors' },
      { command: 'show arp', mode: 'Privileged EXEC', purpose: 'View IP-to-MAC address resolution cache' },
    ],
    examTrap: 'A router interface showing "up/down" (Layer 1 up, Layer 2 down) indicates a Layer 2 framing mismatch, encapsulation mismatch, or missing keepalive—not an unplugged cable.',
  },
  {
    id: 'fund-cabling-interfaces',
    domainId: 'fundamentals',
    code: '1.2',
    title: 'Copper, Fiber Media & Interface Troubleshooting',
    readMinutes: 5,
    summary: 'Distinguish straight-through vs. crossover UTP pinouts, single-mode vs. multimode fiber, PoE standards, and duplex mismatch symptoms.',
    keyPoints: [
      'Single-mode fiber (SMF, yellow jacket, ~9 micron core, laser) spans kilometers; Multimode fiber (MMF, aqua/orange, 50/62.5 micron, LED/VCSEL) serves campus buildings up to ~300-550m.',
      'Half-duplex causes late collisions when a duplex mismatch exists (one side auto-negotiated to half, the other forced full-duplex).',
      'Runts (<64 bytes), Giants (>1518 bytes), and CRC errors point to bad cabling, EMI, or failing SFPs.',
      '802.3af (PoE 15.4W), 802.3at (PoE+ 30W), 802.3bt (UPoE/PoE++ 60-90W).',
    ],
    deepDive: [
      {
        heading: 'Diagnosing Duplex Mismatch on Cisco IOS',
        body: 'If one end of an Ethernet link is hardcoded to 100/full and the opposite end is set to auto-negotiation, the auto end falls back to 100/half (because it receives no FLP auto-negotiation bursts). The half-duplex side logs late collisions while the full-duplex side accumulates FCS/CRC errors.',
      },
    ],
    commands: [
      { command: 'speed 1000 / duplex full', mode: 'Interface Config', purpose: 'Manually pin interface speed and duplex' },
      { command: 'show controllers', mode: 'Privileged EXEC', purpose: 'Inspect low-level hardware interface and clock/cable details' },
    ],
    examTrap: 'Auto-MDIX resolves straight-through vs. crossover mismatches automatically on modern switches, but only when speed and duplex are left on auto.',
  },
  {
    id: 'fund-ipv4-vlsm',
    domainId: 'fundamentals',
    code: '1.3',
    title: 'IPv4 Private Ranges, Subnetting & VLSM',
    readMinutes: 8,
    summary: 'Master block-size math, RFC 1918 private blocks, APIPA, loopback ranges, and Variable Length Subnet Masking.',
    keyPoints: [
      'RFC 1918 private spaces: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0–172.31.255.255), and 192.168.0.0/16.',
      'Special blocks: 127.0.0.0/8 (loopback), 169.254.0.0/16 (APIPA link-local), 224.0.0.0/4 (multicast).',
      'Block size in the interesting octet equals 256 minus the subnet mask octet (e.g., 255.255.255.224 -> block size 32).',
      'Always allocate VLSM subnets from the largest host requirement down to the smallest to prevent overlapping address spaces.',
    ],
    deepDive: [
      {
        heading: 'Fast /25 through /30 Mental Table',
        body: 'Memorize the powers of two in the last octet: /25 = .128 (126 hosts), /26 = .192 (62 hosts), /27 = .224 (30 hosts), /28 = .240 (14 hosts), /29 = .248 (6 hosts), /30 = .252 (2 hosts for point-to-point links). For /31 (RFC 3021) point-to-point router links, both addresses are usable.',
      },
    ],
    commands: [
      { command: 'ip address 192.168.10.1 255.255.255.192', mode: 'Interface Config', purpose: 'Assign a /26 IPv4 address to an interface' },
      { command: 'show ip interface brief', mode: 'Privileged EXEC', purpose: 'Verify assigned IPv4 addresses and Layer 1/2 states' },
    ],
    examTrap: 'Remember to include the router gateway IP when counting required usable hosts! A LAN with 29 PCs plus 1 router gateway needs 30 usable hosts -> /27 (30 usable), not /28.',
  },
  {
    id: 'fund-ipv6',
    domainId: 'fundamentals',
    code: '1.4',
    title: 'IPv6 Addressing, Compression & EUI-64',
    readMinutes: 7,
    summary: 'Compress 128-bit hexadecimal addresses, identify Global Unicast, Unique Local, Link-Local, and Anycast types, and compute EUI-64.',
    keyPoints: [
      'Global Unicast (2000::/3), Unique Local (FC00::/7, commonly FD00::/8), Link-Local (FE80::/10), Multicast (FF00::/8).',
      'Compression rules: drop leading zeros in each 16-bit hextet, and replace the longest contiguous block of all-zero hextets with :: (only once per address).',
      'EUI-64 inserts FF:FE in the middle of the 48-bit MAC address and flips the 7th bit (Universal/Local bit) of the first byte.',
      'IPv6 uses NDP (ICMPv6 Neighbor Solicitation / Advertisement) instead of ARP, and SLAAC via Router Advertisements.',
    ],
    deepDive: [
      {
        heading: 'Essential IPv6 Multicast Addresses',
        body: 'FF02::1 reaches all IPv6 nodes on the local link; FF02::2 reaches all routers on the link; FF02::5 and FF02::6 are OSPFv3 all-routers and DR/BDR routers; FF02::1:FFxx:xxxx is the Solicited-Node multicast used by Neighbor Discovery.',
      },
    ],
    commands: [
      { command: 'ipv6 unicast-routing', mode: 'Global Config', purpose: 'Enable IPv6 packet forwarding on a Cisco router' },
      { command: 'ipv6 address 2001:db8:1::/64 eui-64', mode: 'Interface Config', purpose: 'Auto-generate the 64-bit host ID using EUI-64' },
      { command: 'show ipv6 interface brief', mode: 'Privileged EXEC', purpose: 'Inspect link-local and global IPv6 addresses' },
    ],
    examTrap: 'A Cisco router will NOT route IPv6 packets or send Router Advertisements until you globally configure "ipv6 unicast-routing".',
  },

  // Domain 2: Network Access
  {
    id: 'access-vlans-trunks',
    domainId: 'access',
    code: '2.1',
    title: 'VLANs, 802.1Q Trunking & Voice VLANs',
    readMinutes: 7,
    summary: 'Segment broadcast domains with VLANs, carry tagged traffic across IEEE 802.1Q trunks, and avoid native VLAN mismatches.',
    keyPoints: [
      'Each VLAN equals a separate Layer 2 broadcast domain and typically maps 1-to-1 with an IP subnet.',
      'IEEE 802.1Q inserts a 4-byte tag (including 12-bit VLAN ID and 3-bit CoS priority) into the Ethernet frame; the native VLAN (default VLAN 1) travels untagged.',
      'DTP modes: dynamic desirable actively sends DTP frames; dynamic auto passively waits; best practice is "switchport mode trunk" plus "switchport nonegotiate".',
      'Voice VLANs allow an IP phone and attached PC to share one switchport using separate VLAN tags.',
    ],
    deepDive: [
      {
        heading: 'Native VLAN Security & Mismatch Symptoms',
        body: 'If Switch A sets native VLAN 99 on a trunk and Switch B keeps native VLAN 1, CDP logs native VLAN mismatch warnings and traffic leaks across VLANs. Best practice: change the native VLAN to an unused VLAN ID and shut down unused access ports.',
      },
    ],
    commands: [
      { command: 'switchport mode access / switchport access vlan 10', mode: 'Interface Config', purpose: 'Assign an access port to VLAN 10' },
      { command: 'switchport mode trunk / switchport trunk allowed vlan 10,20', mode: 'Interface Config', purpose: 'Configure an 802.1Q trunk with allowed VLANs' },
      { command: 'show interfaces trunk', mode: 'Privileged EXEC', purpose: 'Verify active trunks, native VLAN, and allowed VLAN list' },
    ],
    examTrap: 'Two ports set to "switchport mode dynamic auto" will NEVER form a trunk—both sit passively waiting for the other to initiate DTP.',
  },
  {
    id: 'access-stp',
    domainId: 'access',
    code: '2.2',
    title: 'Rapid PVST+ Spanning Tree Protocol',
    readMinutes: 8,
    summary: 'Prevent Layer 2 switching loops via Root Bridge election, Root/Designated/Alternate port roles, PortFast, and BPDU Guard.',
    keyPoints: [
      'Root Bridge election chooses the switch with the lowest Bridge ID (Priority + Extended System ID + Base MAC). Default priority is 32768.',
      'Each non-root switch picks exactly ONE Root Port (lowest cumulative root path cost -> lowest upstream BID -> lowest upstream Port ID).',
      'Every network segment elects ONE Designated Port; remaining redundant ports enter Discarding/Blocking state.',
      'Rapid PVST+ (802.1w) reduces convergence from 30–50 seconds to ~1–2 seconds using Proposal/Agreement handshakes.',
    ],
    deepDive: [
      {
        heading: 'PortFast and BPDU Guard',
        body: 'Edge ports connected to PCs or servers should enable "spanning-tree portfast" so they jump immediately to Forwarding without waiting through Listening/Learning. Always pair PortFast with "spanning-tree bpduguard enable" so that if someone plugs in a rogue switch, the port immediately enters err-disabled state.',
      },
    ],
    commands: [
      { command: 'spanning-tree vlan 1 root primary', mode: 'Global Config', purpose: 'Lower switch priority so it wins the Root Bridge election' },
      { command: 'spanning-tree portfast / spanning-tree bpduguard enable', mode: 'Interface Config', purpose: 'Immediate edge forwarding with rogue-switch protection' },
      { command: 'show spanning-tree', mode: 'Privileged EXEC', purpose: 'Inspect Root ID, Bridge ID, port roles, and port states' },
    ],
    examTrap: 'Port cost in classic 802.1D/PVST+ is 100 Mbps = 19, 1 Gbps = 4, 10 Gbps = 2. If cumulative cost ties, check the sender Bridge ID BEFORE checking local or sender port priority.',
  },
  {
    id: 'access-etherchannel',
    domainId: 'access',
    code: '2.3',
    title: 'EtherChannel (LACP & PAgP) Aggregation',
    readMinutes: 5,
    summary: 'Bundle up to 8 physical links into one logical Port-Channel so Spanning Tree treats the bundle as a single loop-free link.',
    keyPoints: [
      'LACP (IEEE 802.3ad): active / passive modes. Active+Active or Active+Passive forms a bundle; Passive+Passive does not.',
      'PAgP (Cisco proprietary): desirable / auto modes. Desirable+Desirable or Desirable+Auto forms a bundle.',
      'Mode "on" forces static EtherChannel without negotiation—must match "on" on the peer.',
      'All member interfaces must match speed, duplex, VLAN mode (access/trunk), native VLAN, and allowed VLAN list.',
    ],
    deepDive: [
      {
        heading: 'Layer 2 vs. Layer 3 EtherChannel',
        body: 'On multilayer switches, running "no switchport" on the physical interfaces and Port-Channel interface converts the bundle into a routed Layer 3 EtherChannel capable of holding an IP address directly.',
      },
    ],
    commands: [
      { command: 'channel-group 1 mode active', mode: 'Interface Config', purpose: 'Bind physical interfaces into Port-Channel 1 using LACP' },
      { command: 'show etherchannel summary', mode: 'Privileged EXEC', purpose: 'Verify flags (SU = Layer 2 in use, RU = Layer 3 in use, P = bundled)' },
    ],
    examTrap: 'Never mix LACP ("active"/"passive") on one side with PAgP ("desirable"/"auto") or static ("on") on the opposite switch—the channel will stay suspended.',
  },
  {
    id: 'access-wireless',
    domainId: 'access',
    code: '2.4',
    title: 'Cisco Wireless Architectures & CAPWAP',
    readMinutes: 6,
    summary: 'Understand Split-MAC architecture, CAPWAP control/data tunnels, WLC management interfaces, and 2.4/5 GHz non-overlapping channels.',
    keyPoints: [
      'Autonomous APs manage RF and switching locally; Lightweight APs (LAPs) use CAPWAP (UDP 5246 control, UDP 5247 data) to connect to a Wireless LAN Controller (WLC).',
      'Split-MAC divides real-time 802.11 beacons/ACKs on the AP from authentication, roaming, and VLAN mapping on the WLC.',
      '2.4 GHz non-overlapping 20 MHz channels: 1, 6, and 11.',
      'FlexConnect APs can switch client data traffic locally at branch sites even if the WAN link to the central WLC goes down.',
    ],
    deepDive: [
      {
        heading: 'WLC Dynamic Interfaces & Switch Trunking',
        body: 'In a centralized WLC deployment, the switch port connected to the WLC carries multiple wireless client VLANs over an 802.1Q trunk. Inside the WLC, each SSID maps to a Dynamic Interface tied to its corresponding VLAN ID.',
      },
    ],
    commands: [
      { command: 'show ap summary', mode: 'WLC CLI', purpose: 'List lightweight APs joined to the controller via CAPWAP' },
      { command: 'show cdp neighbors / show lldp neighbors', mode: 'Privileged EXEC', purpose: 'Discover directly connected APs, phones, and switches' },
    ],
    examTrap: 'Switchports connecting directly to a Lightweight AP in Local Mode operate as normal ACCESS ports in the AP management VLAN—the CAPWAP tunnel encapsulates all client VLAN traffic inside IP packets to the WLC.',
  },

  // Domain 3: IP Connectivity
  {
    id: 'conn-routing-logic',
    domainId: 'connectivity',
    code: '3.1',
    title: 'Routing Table Logic & Longest Prefix Match',
    readMinutes: 6,
    summary: 'Evaluate how Cisco routers choose forwarding paths using Longest Prefix Match first, then Administrative Distance, then Metric.',
    keyPoints: [
      'Step 1 (Forwarding): Longest Prefix Match (/28 beats /24 beats /16 beats 0.0.0.0/0) ALWAYS wins regardless of routing protocol or AD.',
      'Step 2 (Installing into RIB): If two sources advertise the EXACT same prefix/mask, the router installs the one with the lowest Administrative Distance (AD).',
      'Key AD values: Connected = 0, Static = 1, eBGP = 20, EIGRP = 90, OSPF = 110, IS-IS = 115, RIP = 120, iBGP = 200.',
      'Step 3 (Tie-breaker): Within the same routing protocol, lowest metric wins (OSPF Cost, EIGRP composite metric).',
    ],
    deepDive: [
      {
        heading: 'Why Longest Prefix Match Overrides AD',
        body: 'Suppose a router learns 10.1.0.0/16 via Static route (AD 1) and 10.1.2.0/24 via OSPF (AD 110). Both routes coexist in the routing table because their prefix lengths differ. A packet destined for 10.1.2.50 matches /24 over /16 and takes the OSPF path.',
      },
    ],
    commands: [
      { command: 'show ip route', mode: 'Privileged EXEC', purpose: 'Display installed Connected, Static, and Dynamic routes' },
      { command: 'ip route 0.0.0.0 0.0.0.0 203.0.113.1 5', mode: 'Global Config', purpose: 'Configure a floating static default route with AD 5' },
    ],
    examTrap: 'AD is ONLY compared when two routes have the exact same network prefix AND subnet mask length. Never compare AD between a /24 and a /25.',
  },
  {
    id: 'conn-ospf',
    domainId: 'connectivity',
    code: '3.2',
    title: 'Single-Area OSPFv2 Configuration & Neighbor States',
    readMinutes: 8,
    summary: 'Form OSPF adjacencies, elect DR/BDR on multi-access segments, tune reference bandwidth, and verify Hello/Dead requirements.',
    keyPoints: [
      'Router ID precedence: manual "router-id" command > highest loopback IP > highest active physical IP.',
      'OSPF Neighbor match criteria: Area ID, Hello/Dead timers (10s/40s on broadcast), Subnet/Mask, Authentication, and MTU.',
      'DR/BDR election occurs on broadcast/multi-access Ethernet segments (highest priority, default 1, then highest Router ID). Point-to-point links skip DR/BDR.',
      'OSPF cost = Reference Bandwidth (default 100 Mbps) / Interface Bandwidth; set "auto-cost reference-bandwidth 10000" to differentiate 1G vs. 10G links.',
    ],
    deepDive: [
      {
        heading: 'Decoding "show ip ospf neighbor" States',
        body: 'FULL/DR or FULL/BDR means full LSDB adjacency with the designated routers. 2WAY/DROTHER on a shared Ethernet segment between two non-DR routers is completely normal—DROTHERs stay in 2-Way with each other and only form FULL with the DR and BDR.',
      },
    ],
    commands: [
      { command: 'router ospf 1 / router-id 1.1.1.1', mode: 'Global Config', purpose: 'Start OSPF process 1 and pin Router ID' },
      { command: 'network 10.0.0.0 0.0.0.255 area 0', mode: 'Router Config', purpose: 'Enable OSPF on matching interfaces into Area 0' },
      { command: 'passive-interface GigabitEthernet0/1', mode: 'Router Config', purpose: 'Advertise LAN subnet without sending Hellos to end hosts' },
    ],
    examTrap: 'Using "passive-interface default" stops Hellos everywhere; you must follow with "no passive-interface" on router-to-router links so OSPF neighbors can form.',
  },
  {
    id: 'conn-hsrp',
    domainId: 'connectivity',
    code: '3.3',
    title: 'First Hop Redundancy Protocol (HSRP)',
    readMinutes: 5,
    summary: 'Provide seamless default-gateway failover across redundant Layer 3 routers using a shared virtual IP and virtual MAC.',
    keyPoints: [
      'Hosts point their default gateway to the HSRP Virtual IP (VIP), never to a physical router IP.',
      'Active router forwards traffic; Standby router monitors Hellos (every 3s, Hold 10s) and takes over automatically on failure.',
      'Default HSRP priority is 100 (highest wins); preemption is disabled by default and requires the "standby <grp> preempt" command.',
      'HSRP v1 virtual MAC: 0000.0c07.acXX; HSRP v2 virtual MAC: 0000.0c9f.fXXX (supports IPv6).',
    ],
    deepDive: [
      {
        heading: 'Preemption and Interface Tracking',
        body: 'Without "standby 1 preempt", a higher-priority router that reboots will stay Standby until the current Active router fails. Interface tracking ("standby 1 track G0/0 30") decrements priority if the WAN uplink drops so the healthy backup takes over.',
      },
    ],
    commands: [
      { command: 'standby 1 ip 192.168.10.1 / standby 1 priority 110 / standby 1 preempt', mode: 'Interface Config', purpose: 'Configure Active HSRP router with preemption' },
      { command: 'show standby brief', mode: 'Privileged EXEC', purpose: 'Verify Active/Standby roles, priority, and Virtual IP' },
    ],
    examTrap: 'HSRP is Cisco-proprietary (Active/Standby), whereas VRRP (Virtual Router Redundancy Protocol) is the open standard (Master/Backup).',
  },

  // Domain 4: IP Services
  {
    id: 'serv-nat-pat',
    domainId: 'services',
    code: '4.1',
    title: 'Static NAT, Dynamic NAT & PAT (Overload)',
    readMinutes: 6,
    summary: 'Translate RFC 1918 private addresses to public IPv4 addresses and multiplex thousands of sessions with Port Address Translation.',
    keyPoints: [
      'Inside Local = private source IP before NAT; Inside Global = public IP representing the inside host to the internet.',
      'Outside Local / Outside Global describe the destination server from inside vs. outside perspectives.',
      'Static NAT maps 1 private IP to 1 public IP permanently (ideal for public web servers).',
      'PAT ("overload") uses source TCP/UDP port numbers to share a single public IP across an entire internal subnet.',
    ],
    deepDive: [
      {
        heading: 'The #1 NAT Configuration Mistake',
        body: 'Even if your ACL and "ip nat inside source list 1 interface G0/0 overload" rule are flawless, zero translations will occur if you forget to mark "ip nat inside" on the LAN interface and "ip nat outside" on the WAN interface.',
      },
    ],
    commands: [
      { command: 'ip nat inside source list 1 interface G0/0 overload', mode: 'Global Config', purpose: 'Configure PAT using the WAN interface public IP' },
      { command: 'show ip nat translations', mode: 'Privileged EXEC', purpose: 'Inspect Inside/Outside Local and Global mappings' },
    ],
    examTrap: 'If "show ip nat statistics" shows zero hits, check "ip nat inside" / "ip nat outside" interface roles and ensure the referenced ACL matches the inside private subnet.',
  },
  {
    id: 'serv-dhcp-dns-ntp',
    domainId: 'services',
    code: '4.2',
    title: 'DHCP, Relay Agent, DNS & NTP Synchronization',
    readMinutes: 6,
    summary: 'Trace DORA broadcast discovery across routers with ip helper-address, and align network logs with NTP strata.',
    keyPoints: [
      'DHCP DORA sequence: Discover (Client broadcast), Offer (Server), Request (Client broadcast), Acknowledge (Server).',
      'Because routers block L2/L3 broadcasts, "ip helper-address <dhcp-server-ip>" on the client gateway interface converts DHCP broadcasts into unicast packets.',
      'Always configure "ip dhcp excluded-address" BEFORE creating or activating a DHCP pool to prevent assigning router/server static IPs.',
      'NTP Stratum 0 = atomic/GPS clock; Stratum 1 = server attached to Stratum 0; Cisco devices support Stratum 1–15 (16 = unsynchronized).',
    ],
    deepDive: [
      {
        heading: 'Configuring a Router as a DHCP Server',
        body: 'Define excluded ranges globally ("ip dhcp excluded-address 192.168.10.1 192.168.10.10"), create the pool ("ip dhcp pool CORP"), and set "network", "default-router", and "dns-server".',
      },
    ],
    commands: [
      { command: 'ip helper-address 10.10.50.10', mode: 'Interface Config', purpose: 'Forward DHCP broadcasts across routed subnets' },
      { command: 'ntp server 10.10.50.20', mode: 'Global Config', purpose: 'Synchronize system clock with an authoritative NTP server' },
      { command: 'show ntp associations', mode: 'Privileged EXEC', purpose: 'Verify stratum level and clock synchronization (*)' },
    ],
    examTrap: 'Always place "ip helper-address" on the incoming LAN gateway interface closest to the DHCP clients—never on the interface facing the DHCP server.',
  },
  {
    id: 'serv-syslog-snmp-qos',
    domainId: 'services',
    code: '4.3',
    title: 'Syslog Levels, SNMPv3, SSH & QoS PHB',
    readMinutes: 6,
    summary: 'Interpret Syslog severity levels 0–7, secure device monitoring with SNMPv3, and prioritize latency-sensitive voice traffic with QoS.',
    keyPoints: [
      'Syslog levels (0 = Emergencies, 1 = Alerts, 2 = Critical, 3 = Errors, 4 = Warnings, 5 = Notifications, 6 = Informational, 7 = Debugging). Lower number = more severe.',
      'Configuring "logging trap 4" sends levels 0 through 4 (Emergencies up to Warnings) to the Syslog server.',
      'SNMPv3 replaces cleartext v1/v2c community strings with authentication (SHA) and encryption (AES) via authPriv.',
      'QoS DSCP EF (46) marks VoIP media for Expedited Forwarding (Low Latency Queueing); AF classes mark prioritized data.',
    ],
    deepDive: [
      {
        heading: 'Mnemonic for Syslog 0–7',
        body: '"Every Awesome Cisco Engineer Will Need Icecream Daily": 0-Emergencies, 1-Alerts, 2-Critical, 3-Errors, 4-Warnings, 5-Notifications, 6-Informational, 7-Debugging.',
      },
    ],
    commands: [
      { command: 'logging host 10.10.50.30 / logging trap warnings', mode: 'Global Config', purpose: 'Stream severity 0–4 logs to remote Syslog server' },
      { command: 'transport input ssh', mode: 'Line VTY Config', purpose: 'Block insecure Telnet and allow only encrypted SSH' },
    ],
    examTrap: 'For SSH to activate on Cisco IOS, you must configure a hostname, an IP domain-name, RSA keys ("crypto key generate rsa"), local credentials, and "transport input ssh" on line vty 0 4.',
  },

  // Domain 5: Security Fundamentals
  {
    id: 'sec-acls',
    domainId: 'security',
    code: '5.1',
    title: 'Standard & Extended Access Control Lists',
    readMinutes: 7,
    summary: 'Filter traffic with wildcard masks, place Standard vs. Extended ACLs accurately, and respect top-down evaluation plus implicit deny.',
    keyPoints: [
      'Standard ACLs (1–99, 1300–1999) match ONLY source IP address -> place closest to the DESTINATION.',
      'Extended ACLs (100–199, 2000–2699) match source IP, destination IP, protocol, and L4 ports -> place closest to the SOURCE.',
      'Wildcard mask: 0 = must match exact bit, 255 = ignore octet ("host x.x.x.x" = 0.0.0.0; "any" = 255.255.255.255).',
      'Every ACL ends with an invisible "deny ip any any" statement; an ACL with only deny lines drops ALL traffic unless at least one permit line exists.',
    ],
    deepDive: [
      {
        heading: 'Top-Down First-Match Processing',
        body: 'IOS evaluates Access Control Entries (ACEs) strictly in sequence order (10, 20, 30...). As soon as a packet matches an entry, evaluation stops and the permit/deny action executes. Putting "permit ip any any" at sequence 10 neutralizes every rule below it.',
      },
    ],
    commands: [
      { command: 'ip access-list extended BLOCK_TELNET', mode: 'Global Config', purpose: 'Create a named extended ACL' },
      { command: 'deny tcp 192.168.10.0 0.0.0.255 any eq 23', mode: 'Ext-NACL Config', purpose: 'Block Telnet from 192.168.10.0/24' },
      { command: 'ip access-group BLOCK_TELNET in', mode: 'Interface Config', purpose: 'Apply ACL inbound on an interface' },
    ],
    examTrap: 'Wait for the direction ("in" vs. "out") relative to the router! Traffic entering an interface from a LAN is filtered with "in"; traffic leaving toward a server is filtered with "out".',
  },
  {
    id: 'sec-l2-security',
    domainId: 'security',
    code: '5.2',
    title: 'Port Security, DHCP Snooping & Dynamic ARP Inspection',
    readMinutes: 7,
    summary: 'Stop MAC flooding, rogue DHCP servers, and ARP spoofing attacks using Catalyst Layer 2 defense features.',
    keyPoints: [
      'Port Security requires static access or trunk mode ("switchport mode access") before enabling "switchport port-security".',
      'Violation modes: shutdown (err-disable + SNMP/Syslog, default), restrict (drops frames + increments counter + logs), protect (silently drops frames).',
      'DHCP Snooping marks uplinks toward the legitimate DHCP server as "trust"; all client ports default to untrusted and drop rogue DHCP Offer/Ack packets.',
      'Dynamic ARP Inspection (DAI) relies on the DHCP Snooping binding table to validate IP-to-MAC bindings in ARP packets.',
    ],
    deepDive: [
      {
        heading: 'Layer 2 Defense Chain',
        body: 'Port Security defends the CAM table from MAC overflow. DHCP Snooping builds a trusted IP-MAC-VLAN-Port binding database while blocking rogue servers. DAI then consults that database to stop Man-in-the-Middle ARP poisoning.',
      },
    ],
    commands: [
      { command: 'switchport port-security maximum 2 / violation restrict', mode: 'Interface Config', purpose: 'Cap learned MACs at 2 and log violations without shutting port' },
      { command: 'ip dhcp snooping / ip dhcp snooping vlan 10', mode: 'Global Config', purpose: 'Enable DHCP Snooping on VLAN 10' },
      { command: 'ip dhcp snooping trust', mode: 'Interface Config', purpose: 'Trust uplink interface connected to real DHCP server' },
    ],
    examTrap: 'A switchport in "dynamic auto" or "dynamic desirable" will reject "switchport port-security" until you first force "switchport mode access" (or trunk).',
  },
  {
    id: 'sec-aaa-vpn-wifi',
    domainId: 'security',
    code: '5.3',
    title: 'AAA (RADIUS/TACACS+), VPNs & WPA2/WPA3',
    readMinutes: 6,
    summary: 'Contrast TACACS+ vs. RADIUS for administrative AAA, site-to-site IPsec tunnels, and WPA2/WPA3 wireless encryption.',
    keyPoints: [
      'TACACS+ (TCP 49): Cisco-preferred for device admin AAA; encrypts the entire packet and separates Authentication, Authorization, and Accounting.',
      'RADIUS (UDP 1812/1813): Open standard widely used for network access/wireless 802.1X; encrypts only the password field and combines Authentication + Authorization.',
      'Site-to-site IPsec VPNs connect branch offices over the internet; Remote Access VPNs connect mobile users.',
      'WPA3 uses SAE (Simultaneous Authentication of Equals) to prevent offline dictionary attacks against pre-shared keys.',
    ],
    deepDive: [
      {
        heading: '802.1X Enterprise Wireless Authentication',
        body: 'In WPA2/WPA3-Enterprise, the wireless client (Supplicant) authenticates via EAP through the AP/WLC (Authenticator) to a central RADIUS server (Authentication Server, such as Cisco ISE).',
      },
    ],
    commands: [
      { command: 'aaa new-model', mode: 'Global Config', purpose: 'Enable AAA services globally on Cisco IOS' },
      { command: 'show aaa sessions', mode: 'Privileged EXEC', purpose: 'Inspect active authenticated AAA sessions' },
    ],
    examTrap: 'Watch out for transport ports on the exam: TACACS+ uses TCP port 49, while RADIUS uses UDP ports 1812/1813 (or legacy 1645/1646).',
  },

  // Domain 6: Automation & Programmability
  {
    id: 'auto-sdn-rest',
    domainId: 'automation',
    code: '6.1',
    title: 'SDN Control/Data Planes, REST APIs & JSON',
    readMinutes: 6,
    summary: 'Separate network control and data planes, read JSON data structures, and map HTTP verbs to CRUD API operations.',
    keyPoints: [
      'Control Plane decides how traffic should flow (OSPF, STP, routing tables); Data Plane forwards packets/frames at wire speed (CEF, ASICs); Management Plane handles SSH/SNMP/REST.',
      'SDN moves the Control Plane into a centralized controller (e.g., Cisco Catalyst Center / DNA Center) using Northbound REST APIs and Southbound protocols (OpenFlow, NETCONF, SSH).',
      'CRUD to HTTP mapping: Create = POST, Read = GET, Update = PUT (replace) / PATCH (partial), Delete = DELETE.',
      'JSON rules: double-quoted string keys, curly braces {} for objects, square brackets [] for arrays, comma-separated pairs with NO trailing comma.',
    ],
    deepDive: [
      {
        heading: 'Northbound vs. Southbound APIs',
        body: 'Applications and scripts talk to the SDN controller over Northbound REST APIs (HTTP/HTTPS + JSON). The controller pushes intent down to switches and routers over Southbound APIs (NETCONF/YANG, RESTCONF, OpenFlow, or CLI/SSH).',
      },
    ],
    commands: [
      { command: 'GET /dna/intent/api/v1/network-device', mode: 'Northbound REST', purpose: 'Query inventory from Cisco Catalyst Center API' },
      { command: 'netconf-yang', mode: 'Global Config', purpose: 'Enable Southbound NETCONF/YANG management on IOS XE' },
    ],
    examTrap: 'HTTP 200 OK / 201 Created = success; 401 Unauthorized = missing/bad auth token; 403 Forbidden = valid auth but insufficient role; 404 Not Found = wrong URI endpoint.',
  },
  {
    id: 'auto-config-mgmt',
    domainId: 'automation',
    code: '6.2',
    title: 'Ansible, Puppet, Chef & Terraform Comparison',
    readMinutes: 5,
    summary: 'Differentiate agentless push vs. agent-based pull configuration management tools for network automation.',
    keyPoints: [
      'Ansible: Agentless (uses SSH/NETCONF), Push model, Playbooks written in YAML, Inventory + Tasks.',
      'Puppet: Agent-based (requires agent on managed node, except proxy), Pull model (TCP 8140), Manifests written in Ruby-like DSL.',
      'Chef: Agent-based, Pull model (TCP 10002/443), Recipes & Cookbooks written in Ruby.',
      'Terraform: Infrastructure-as-Code provisioning tool using HCL (HashiCorp Configuration Language) and declarative state files.',
    ],
    deepDive: [
      {
        heading: 'Why Ansible Dominates Cisco IOS Automation',
        body: 'Traditional Cisco IOS switches cannot easily run third-party Ruby/Python agents natively. Because Ansible is agentless and pushes configuration over standard SSH or NETCONF directly from a control node, it works natively with Cisco IOS and IOS XE devices.',
      },
    ],
    commands: [
      { command: 'ansible-playbook -i hosts.ini configure_vlans.yml', mode: 'Control Node CLI', purpose: 'Push declarative YAML VLAN config across switches via SSH' },
    ],
    examTrap: 'Exam questions routinely test the 2x2 matrix: Ansible = Agentless + Push + YAML; Puppet & Chef = Agent-based + Pull + Ruby/DSL.',
  },
];
