import { ExamQuestion } from '../types/ccna';

export const CCNA_QUESTIONS_PART_2: ExamQuestion[] = [
  // ==================== EASY (Services, Security, Automation) ====================
  {
    id: 'ccna-e29',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'Static vs. Dynamic NAT vs. PAT',
    prompt: 'Which NAT type allows thousands of internal private hosts (192.168.0.0/16) to share a SINGLE public IPv4 address simultaneously by tracking unique TCP/UDP source port numbers?',
    options: ['Static NAT', 'Dynamic NAT (Pool without overload)', 'PAT (NAT Overload)', 'Inside Local'],
    correctIndices: [2],
    hints: [
      'Static NAT maps 1 private IP to 1 public IP; Dynamic NAT maps 1-to-1 from a pool until the pool runs out.',
      'Tracking port numbers lets one public IP serve thousands of flows.',
    ],
    explanation:
      'HOW & WHY: Port Address Translation (PAT / NAT Overload) maps many private Inside Local IPs to a single public Inside Global IP by assigning unique translated source port numbers in the NAT translation table.',
  },
  {
    id: 'ccna-e30',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'Syslog Severity Levels',
    prompt: 'Which Syslog severity number represents the HIGHEST (most critical) urgency level in Cisco IOS?',
    options: ['Severity 7 (Debugging)', 'Severity 5 (Notifications)', 'Severity 0 (Emergencies)', 'Severity 4 (Warnings)'],
    correctIndices: [2],
    hints: [
      'Think "0 = System is unusable" down to "7 = Debug noise".',
      'Lower number = higher severity!',
    ],
    explanation:
      'HOW & WHY: Syslog runs from 0 (Emergencies — highest severity) to 7 (Debugging — lowest severity). Mnemonic: "Every Awesome Cisco Engineer Will Need Icecream Daily" (0–7).',
  },
  {
    id: 'ccna-e31',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'DHCP Scope Exclusions',
    prompt: 'You configure an IOS DHCP server pool for 192.168.10.0/24, and routers/printers use .1 through .20 statically. Which global command prevents the router from handing out .1–.20 to workstations?',
    options: [
      'network 192.168.10.21 255.255.255.0',
      'ip dhcp excluded-address 192.168.10.1 192.168.10.20',
      'default-router 192.168.10.1',
      'ip helper-address 192.168.10.20',
    ],
    correctIndices: [1],
    hints: [
      'In IOS, reserved static IPs are excluded in GLOBAL configuration mode before/outside the pool.',
      'The command takes a starting IP and an optional ending IP.',
    ],
    explanation:
      'HOW & WHY: "ip dhcp excluded-address <low-ip> <high-ip>" removes reserved gateway, switch, and printer IPs from the DHCP server’s assignable range so clients never experience IP address conflicts.',
  },
  {
    id: 'ccna-e32',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'SNMP Architecture',
    prompt: 'In an SNMP monitoring deployment, what is an SNMP Trap (or Inform)?',
    options: [
      'A periodic GET request initiated by the NMS polling server',
      'An unsolicited alert pushed automatically by a network device (agent) to the NMS when a link drops or threshold fires',
      'A routing table update sent between OSPF neighbors',
      'An encrypted SSH tunnel for IOS upgrades',
    ],
    correctIndices: [1],
    hints: [
      'Instead of waiting for the monitoring server to poll every 5 minutes, the switch notifies the server immediately when Gi0/1 goes down.',
      'Traps are unacknowledged (UDP 162); Informs require an ACK.',
    ],
    explanation:
      'HOW & WHY: SNMP Traps/Informs let managed devices proactively push real-time event alerts (interface down, high CPU, BGP flap) to the Network Management System (NMS) on UDP port 162.',
  },
  {
    id: 'ccna-e33',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'MFA Authentication Factors',
    prompt: 'When a network admin signs into a VPN using a corporate password PLUS a 6-digit code from a hardware token/authenticator app, which two MFA factor categories are combined?',
    options: [
      'Something you are + Somewhere you are',
      'Something you know + Something you have',
      'Something you do + Something you know',
      'Two separate passwords (two things you know)',
    ],
    correctIndices: [1],
    hints: [
      'Password = memorized secret; Authenticator phone/token = physical object in your possession.',
      'Two passwords alone do NOT count as Multi-Factor Authentication!',
    ],
    explanation:
      'HOW & WHY: True Multi-Factor Authentication requires two or more distinct categories: Knowledge (password = something you know), Possession (token/phone = something you have), and Inherence (fingerprint/FaceID = something you are).',
  },
  {
    id: 'ccna-e34',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'Enable Secret vs. Enable Password',
    prompt: 'Why should you always configure "enable secret <pw>" instead of legacy "enable password <pw>" on Cisco IOS devices?',
    options: [
      'enable secret automatically disables Telnet.',
      'enable password stores plaintext (or weak reversible Type 7), whereas enable secret uses a strong one-way cryptographic hash (Type 5/8/9).',
      'enable secret grants read-only access.',
      'enable password only works on switches.',
    ],
    correctIndices: [1],
    hints: [
      'Think about what someone sees if they read "show running-config" or grab a TFTP config backup.',
      'Even with "service password-encryption", Type 7 passwords are trivially reversed online in milliseconds.',
    ],
    explanation:
      'HOW & WHY: "enable secret" hashes the privileged EXEC password using modern one-way algorithms (Type 8 PBKDF2-SHA256 / Type 9 scrypt, or legacy Type 5 MD5), and takes precedence over "enable password" if both exist.',
  },
  {
    id: 'ccna-e35',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'Port Security Default Behavior',
    prompt: 'If you enable "switchport port-security" on an access port without specifying a maximum MAC count or violation mode, what defaults does Cisco IOS apply?',
    options: [
      'Maximum 10 MACs; violation mode Protect',
      'Maximum 1 MAC; violation mode Shutdown (err-disabled)',
      'Maximum 2 MACs; violation mode Restrict',
      'Unlimited MACs; violation mode Log-Only',
    ],
    correctIndices: [1],
    hints: [
      'Out of the box, Cisco IOS applies the strictest setting.',
      'One authorized MAC address, and any rogue MAC immediately shuts the port down.',
    ],
    explanation:
      'HOW & WHY: Default Port Security permits exactly 1 dynamic MAC address ("maximum 1") and enforces "violation shutdown", placing the port into err-disabled state upon any unauthorized MAC.',
  },
  {
    id: 'ccna-e36',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'Layer 2 vs. Layer 3 Attacks',
    prompt: 'Which attack involves an unauthorized PC sending fake DHCP Offer messages on a campus VLAN, giving victims its own IP as the default gateway/DNS server to intercept traffic?',
    options: ['DHCP Starvation / Rogue DHCP Spoofing', 'SYN Flood', 'VLAN Hopping via Double Tagging', 'BGP Hijacking'],
    correctIndices: [0],
    hints: [
      'Clients accept whichever DHCP Offer reaches them fastest.',
      'Defended against on switches using DHCP Snooping (marking only uplink ports as "trusted").',
    ],
    explanation:
      'HOW & WHY: In a Rogue DHCP Spoofing attack, an attacker replies faster than the legitimate DHCP server, handing clients a rogue default gateway and DNS server for Man-in-the-Middle interception.',
  },
  {
    id: 'ccna-e37',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'easy',
    topic: 'Controller-Based Networking Benefits',
    prompt: 'What is the primary operational benefit of moving from device-by-device manual SSH configuration to controller-based / intent-based networking?',
    options: [
      'It eliminates the need for IP addresses.',
      'Centralized policy orchestration, automated config compliance, and elimination of human configuration drift across hundreds of devices.',
      'It replaces Layer 1 fiber cables with wireless.',
      'It forces every switch to use Telnet.',
    ],
    correctIndices: [1],
    hints: [
      'Think about typing ACLs or VLAN changes manually into 200 switches vs. pushing validated templates from one controller.',
      'Consistency, speed, and reduced human typos are key.',
    ],
    explanation:
      'HOW & WHY: Intent-based controllers let engineers declare high-level business/security intent once, automatically translating and auditing compliant configurations across hundreds of switches and routers.',
  },
  {
    id: 'ccna-e38',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'easy',
    topic: 'HTTP Status Codes for REST APIs',
    prompt: 'A Python automation script sends an API call to create a new VLAN on a controller and receives HTTP status code 201 Created (or 200 OK). What do 2xx status codes mean vs. 4xx status codes?',
    options: [
      '2xx = Client Error; 4xx = Server Success',
      '2xx = Success; 4xx = Client Request Error (bad syntax, auth failure, or missing resource)',
      '2xx = Redirection; 4xx = Layer 1 Link Down',
      '2xx = Server Crash; 4xx = DNS Timeout',
    ],
    correctIndices: [1],
    hints: [
      '401 Unauthorized, 403 Forbidden, 404 Not Found are all 4xx codes.',
      '200 OK and 201 Created confirm the API accepted and executed the request.',
    ],
    explanation:
      'HOW & WHY: HTTP status groups: 2xx = Success (200 OK, 201 Created), 3xx = Redirection, 4xx = Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found), 5xx = Server Error.',
  },

  // ==================== MEDIUM (Services, Security, Automation) ====================
  {
    id: 'ccna-m27',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'NTP Stratum Hierarchy',
    prompt: 'Router R1 synchronizes time directly from a Stratum 0 atomic GPS hardware receiver (making R1 a Stratum 1 server). Switch SW1 synchronizes its clock from R1, and PC1 syncs from SW1. What Stratum level is SW1?',
    options: ['Stratum 0', 'Stratum 1', 'Stratum 2', 'Stratum 3'],
    correctIndices: [2],
    hints: [
      'Stratum measures hop distance away from the Stratum 0 reference clock.',
      'Stratum 0 (GPS clock hardware) -> R1 (Stratum 1) -> SW1 = Stratum 1 + 1.',
    ],
    explanation:
      'HOW & WHY: An authoritative atomic or GPS hardware clock is Stratum 0 (it cannot act as a network NTP peer itself). A server directly attached to Stratum 0 becomes Stratum 1 (R1). Any device syncing over the network from R1 increments the stratum by 1, making SW1 Stratum 2 (and PC1 Stratum 3).',
  },
  {
    id: 'ccna-m28',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'TFTP vs. FTP vs. SFTP',
    prompt: 'Which file-transfer protocol uses UDP port 69 with minimal overhead (ideal for local boot/IOS recovery) vs. which uses encrypted SSH on TCP port 22?',
    options: [
      'FTP (UDP 69) and TFTP (TCP 22)',
      'TFTP (UDP 69) and SFTP (TCP 22)',
      'SCP (UDP 69) and HTTP (TCP 22)',
      'SNMP (UDP 69) and Telnet (TCP 22)',
    ],
    correctIndices: [1],
    hints: [
      'Trivial FTP has no authentication and runs over connectionless UDP.',
      'Secure FTP runs inside an encrypted SSH tunnel.',
    ],
    explanation:
      'HOW & WHY: TFTP (UDP 69) is lightweight and unauthenticated (used for ROMMON IOS recovery or PXE boot), whereas SFTP runs inside an encrypted SSH session over TCP 22.',
  },
  {
    id: 'ccna-m29',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'NAT Pool Configuration',
    prompt: 'Inspect the Dynamic NAT config:\nip nat pool PUB 203.0.113.10 203.0.113.13 netmask 255.255.255.248\nip nat inside source list 1 pool PUB\nIf 4 hosts already hold active translations and a 5th internal host initiates an outbound web session, what happens?',
    options: [
      'The 5th host shares 203.0.113.10 using PAT automatically.',
      'The 5th host’s packets are dropped until one of the 4 translations times out because "overload" was omitted.',
      'The router uses 203.0.113.14 automatically.',
      'All 5 hosts reset their TCP sessions.',
    ],
    correctIndices: [1],
    hints: [
      'Count how many public IPs exist between .10 and .13 inclusive: .10, .11, .12, .13 = 4 IPs.',
      'Notice the missing keyword at the end of "ip nat inside source list 1 pool PUB".',
    ],
    explanation:
      'HOW & WHY: Without the "overload" keyword, Dynamic NAT performs strict 1-to-1 translation from the 4-IP pool (.10–.13). Once all 4 public IPs are leased, the 5th host fails to get a translation until a session ages out.',
  },
  {
    id: 'ccna-m30',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'Named ACL Line Editing',
    prompt: 'An engineer must insert "permit tcp 10.1.1.0 0.0.0.255 host 10.9.9.9 eq 443" BEFORE an existing deny rule at sequence 20 in Named ACL CORP_IN. Which approach inserts it cleanly without deleting the ACL?',
    options: [
      'Enter "ip access-list extended CORP_IN" and enter "15 permit tcp 10.1.1.0 0.0.0.255 host 10.9.9.9 eq 443".',
      'Type "no ip access-list extended CORP_IN" first.',
      'Cisco ACLs always evaluate lowest-port rules first regardless of sequence numbers.',
      'Sequence numbers cannot be specified in Named ACLs.',
    ],
    correctIndices: [0],
    hints: [
      'IOS ACLs assign sequence numbers in increments of 10 (10, 20, 30) specifically to leave gaps!',
      'Using sequence 15 places the new permit right between 10 and 20.',
    ],
    explanation:
      'HOW & WHY: Cisco IOS numbers ACEs by 10s (10, 20, 30...) so engineers can insert rules between existing lines (e.g., sequence 15) inside named ACL configuration mode without removing and reapplying the ACL.',
  },
  {
    id: 'ccna-m31',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'DHCP Snooping Trusted Ports',
    prompt: 'When enabling DHCP Snooping on VLAN 10 of a Layer 2 access switch, which interface(s) MUST be configured with "ip dhcp snooping trust"?',
    options: [
      'Every workstation access port',
      'Only the uplink trunk/port(s) leading toward the legitimate DHCP server (or DHCP relay router)',
      'Unused shutdown ports',
      'Only wireless guest access ports',
    ],
    correctIndices: [1],
    hints: [
      'By default, ALL ports become Untrusted as soon as DHCP Snooping is enabled.',
      'Untrusted ports drop incoming DHCP Offer and Ack messages from servers!',
    ],
    explanation:
      'HOW & WHY: DHCP Snooping marks all ports Untrusted by default, blocking server-side DHCP Offers/Acks from arriving on user ports. Only ports leading toward authorized DHCP servers or relay routers should be set to "ip dhcp snooping trust".',
  },
  {
    id: 'ccna-m32',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'Port Security Sticky MACs',
    prompt: 'What does "switchport port-security mac-address sticky" accomplish on an access switchport?',
    options: [
      'It hard-codes the vendor OUI FF:FF:FF.',
      'It dynamically learns the connected device’s MAC address and automatically writes it into the running-config as a static secure MAC entry.',
      'It disables spanning-tree on the port.',
      'It shares MAC tables with TACACS+.',
    ],
    correctIndices: [1],
    hints: [
      'Instead of an admin manually typing 500 MAC addresses into 500 switchports, the switch learns them once and saves them.',
      'Remember to run "copy running-config startup-config" afterward so sticky MACs survive a switch reboot!',
    ],
    explanation:
      'HOW & WHY: Sticky Port Security learns the first authorized MAC(s) dynamically and converts them into "switchport port-security mac-address sticky <mac>" lines in running-config—saving manual entry while locking the port after "write memory".',
  },
  {
    id: 'ccna-m33',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'Site-to-Site IPsec VPN',
    prompt: 'Which IPsec protocol suite provides confidentiality (AES encryption), integrity (HMAC-SHA), and authentication between two branch routers over the public Internet?',
    options: ['GRE without encryption', 'ESP (Encapsulating Security Payload)', 'PPTP', 'SNMPv2c'],
    correctIndices: [1],
    hints: [
      'IPsec offers two core security protocols: AH (Authentication Header) and ESP.',
      'AH authenticates/integrates headers only (NO encryption); ESP encrypts the payload too!',
    ],
    explanation:
      'HOW & WHY: IPsec ESP (IP protocol 50) encrypts the IP packet payload (Confidentiality) and optionally authenticates it (Integrity/Authentication), whereas AH (protocol 51) provides integrity/authentication without encryption.',
  },
  {
    id: 'ccna-m34',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'WPA2/WPA3-Enterprise & 802.1X',
    prompt: 'In an enterprise wireless deployment using WPA2-Enterprise (802.1X), what are the three roles in the authentication architecture?',
    options: [
      'DHCP Client, DNS Server, NTP Master',
      'Supplicant (client device), Authenticator (AP/WLC), and Authentication Server (RADIUS/ISE)',
      'Root Bridge, Designated Port, Blocking Port',
      'Inside Local, Inside Global, Outside Global',
    ],
    correctIndices: [1],
    hints: [
      'The laptop holds credentials; the AP/WLC relays EAP frames; a central server like Cisco ISE validates the user/certificate.',
      'Look for Supplicant -> Authenticator -> Authentication Server.',
    ],
    explanation:
      'HOW & WHY: IEEE 802.1X separates port access control into: Supplicant (end-user device), Authenticator (switch or WLC/AP gating access), and Authentication Server (RADIUS server like Cisco ISE validating EAP credentials).',
  },
  {
    id: 'ccna-m35',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    topic: 'NETCONF & YANG vs. CLI Scraping',
    prompt: 'Why is NETCONF with YANG data models superior to legacy SSH screen-scraping (Expect/Regex) for network automation?',
    options: [
      'NETCONF operates without TCP/IP.',
      'NETCONF exchanges structured XML data validated against formal YANG schemas, supports candidate/running datastores, and provides transactional commit/rollback.',
      'YANG eliminates the need for routers.',
      'NETCONF only uses UDP port 69.',
    ],
    correctIndices: [1],
    hints: [
      'Regex breaks whenever an OS upgrade adds one extra space to "show interfaces" output!',
      'NETCONF runs over SSH (port 830) with strict schema contracts and atomic transactions.',
    ],
    explanation:
      'HOW & WHY: CLI scraping breaks easily across IOS version changes and lacks rollback. NETCONF (TCP 830 over SSH) uses YANG-modeled structured data, separating candidate configs from running configs with transactional validation and rollback.',
  },
  {
    id: 'ccna-m36',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    topic: 'Ansible vs. Puppet/Chef',
    prompt: 'Compare Ansible, Puppet, and Chef: which statement accurately describes their agent and transport models?',
    options: [
      'All three require installing Python agents on Cisco Catalyst switches.',
      'Ansible is agentless (push over SSH/NETCONF using YAML), whereas Puppet and Chef are primarily agent-based pull models (written in Ruby DSL).',
      'Puppet is agentless over Telnet; Ansible uses Ruby.',
      'Chef is agentless; Ansible requires TCP 8140.',
    ],
    correctIndices: [1],
    hints: [
      'Cisco switches cannot easily run third-party Ruby daemons, which is why Ansible won huge adoption in networking.',
      'Ansible pushes from a control node via SSH/NETCONF; Puppet/Chef agents periodically pull manifests/cookbooks from a server.',
    ],
    explanation:
      'HOW & WHY: Ansible requires zero software installed on managed switches (agentless push over SSH/API using YAML). Puppet (port 8140) and Chef generally install agents that periodically pull desired state from a master server.',
  },
  {
    id: 'ccna-m37',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    topic: 'JSON Data Types',
    prompt: 'Inspect the JSON object:\n{\n  "interface": "Gi0/1",\n  "mtu": 1500,\n  "enabled": true,\n  "vlans": [10, 20]\n}\nWhich JSON data types are represented in order?',
    options: [
      'String, Number, Boolean, Array',
      'Number, String, Object, Null',
      'Array, Boolean, String, Number',
      'String, String, String, Object',
    ],
    correctIndices: [0],
    hints: [
      '"Gi0/1" is quoted text; 1500 is an unquoted integer; true is logical; [10, 20] uses square brackets.',
      'Notice booleans in JSON are lowercase true/false without quotes.',
    ],
    explanation:
      'HOW & WHY: JSON supports six types: String ("Gi0/1"), Number (1500), Boolean (true/false), Array ([10, 20]), Object ({...}), and null.',
  },
  {
    id: 'ccna-m38',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    topic: 'Idempotency in Automation',
    prompt: 'What does it mean for an Ansible playbook task (such as "ensure VLAN 20 named ENG exists") to be idempotent?',
    options: [
      'It runs only once per calendar year.',
      'Running the playbook 1 time or 50 times produces the exact same end state without creating duplicate entries or unnecessary changes after the first run.',
      'It deletes existing VLANs before recreating them.',
      'It executes commands in random order.',
    ],
    correctIndices: [1],
    hints: [
      'First run: VLAN 20 doesn’t exist -> created ("changed"). Second run: VLAN 20 already matches -> no-op ("ok").',
      'Safe repeatability is the core pillar of infrastructure-as-code.',
    ],
    explanation:
      'HOW & WHY: Idempotency ensures an automation script checks current device state before acting: if VLAN 20 already exists as specified, subsequent runs make zero disruptive changes.',
  },

  // ==================== HARD, SCENARIOS & SIMLETS (Part 2: Services, Security, Automation) ====================
  {
    id: 'ccna-h15-scen',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: DHCP Relay Unreachable Return Path',
    prompt:
      'Scenario: Clients in new Branch VLAN 50 (10.50.0.0/24) send DHCP Discover broadcasts. Router R1 has "ip helper-address 10.99.0.10" configured on Gi0/0.50 (10.50.0.1), and packets reach the central DHCP server (10.99.0.10). Wireshark on the DHCP server shows it receives the relayed Discover and sends an Offer back to 10.50.0.1, yet clients never get IPs. What is the likeliest cause?',
    options: [
      'The DHCP server’s default gateway or upstream router lacks a return route back to 10.50.0.0/24 (or an ACL blocks UDP 67/68).',
      'ip helper-address must be applied on the access switch SVI instead of R1.',
      'DHCP Discover uses TCP port 53.',
      'Clients in VLAN 50 need static APIPA addresses first.',
    ],
    correctIndices: [0],
    hints: [
      'When R1 relays a client DHCP Discover, it stamps its own receiving interface IP (giaddr = 10.50.0.1) inside the packet.',
      'The DHCP server unicasts its Offer back to 10.50.0.1—which fails if the server side has no route to 10.50.0.0/24!',
    ],
    explanation:
      'HOW & WHY: A DHCP relay agent converts the client broadcast into a unicast packet with giaddr = 10.50.0.1 (VLAN 50 gateway). If the central DHCP server’s network lacks a return route for 10.50.0.0/24 (or a firewall blocks UDP 67/68 unicast replies), the Offer drops in transit before returning to R1.',
  },
  {
    id: 'ccna-h16-scen',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: NAT Overload Interface Reversal',
    prompt:
      'Scenario: An engineer configures PAT on edge router R1 to translate branch subnet 192.168.10.0/24 out WAN interface Gi0/1. However, "show ip nat translations" remains completely empty and branch users cannot browse the web. Inspecting the config reveals:\n• Gi0/0 (LAN): ip nat outside\n• Gi0/1 (ISP): ip nat inside\n• ip nat inside source list 1 interface Gi0/1 overload\nWhy does NAT fail?',
    options: [
      'The inside and outside NAT interface roles are swapped: the LAN interface must be "ip nat inside" and the ISP interface must be "ip nat outside".',
      'PAT requires an Extended ACL instead of standard list 1.',
      'Gi0/1 cannot be used in both overload and ip nat outside.',
      'NAT cannot translate RFC 1918 addresses.',
    ],
    correctIndices: [0],
    hints: [
      'NAT only triggers when a packet enters an "inside" interface and routes out an "outside" interface (or vice versa for return traffic).',
      'Check which interface faces the private LAN vs. the public ISP!',
    ],
    explanation:
      'HOW & WHY: "ip nat inside" belongs on internal LAN-facing interfaces (Gi0/0), and "ip nat outside" belongs on public ISP-facing interfaces (Gi0/1). With them reversed, outbound packets enter "outside" and exit "inside", never matching the "inside source" NAT rule.',
  },
  {
    id: 'ccna-h17-scen',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Extended ACL Blocks Return Traffic',
    prompt:
      'Scenario: Internal hosts in 10.10.10.0/24 reach WebServer 10.20.20.50 via R1 (Gi0/0 = 10.10.10.1, Gi0/1 = 10.20.20.1). An engineer applies ACL 110 INBOUND on Gi0/1 (facing WebServer) to block Telnet:\n10 deny tcp host 10.20.20.50 any eq 23\n20 permit tcp host 10.20.20.50 any eq 443\nWhy do internal users immediately lose HTTPS (443) access to WebServer?',
    options: [
      'Return HTTPS packets leaving WebServer have SOURCE port 443 and ephemeral DESTINATION port (>1023), so "any eq 443" (which checks destination port!) fails to match and hits the implicit deny!',
      'Telnet must be permitted before HTTPS.',
      'Gi0/1 needs "ip access-group 110 out" instead of "in" to match source 10.20.20.50.',
      'HTTPS uses UDP 443.',
    ],
    correctIndices: [0],
    hints: [
      'Read the syntax carefully: "permit tcp <src-ip> <dst-ip> eq 443". Where is "eq 443" placed—after the source or after the destination?',
      'A web server responds FROM source port 443 TO client ephemeral port (e.g., 51422)!',
    ],
    explanation:
      'HOW & WHY: In "permit tcp host 10.20.20.50 any eq 443", "eq 443" filters the DESTINATION port. Return traffic from a web server has SOURCE port 443 ("eq 443" placed right after host 10.20.20.50) and random destination port >1023. Because the destination port wasn’t 443, all HTTPS responses hit implicit deny!',
  },
  {
    id: 'ccna-h18-scen',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Dynamic ARP Inspection & Static Servers',
    prompt:
      'Scenario: After enabling DHCP Snooping and Dynamic ARP Inspection (DAI) on VLAN 20, all DHCP workstations work normally, but three production printers configured with static IPv4 addresses immediately lose all network connectivity. Switch logs show "%SW_DAI-4-DHCP_SNOOPING_DENY: Invalid ARPs". How do you fix this securely without disabling DAI?',
    options: [
      'Create a static ARP ACL ("arp access-list") mapping each printer’s static IP to its MAC address and apply it with "ip arp inspection filter <name> vlan 20", OR convert the printers to DHCP reservations.',
      'Set all switchports to "ip arp inspection trust".',
      'Disable DHCP Snooping globally.',
      'Change Port Security violation mode to protect.',
    ],
    correctIndices: [0],
    hints: [
      'DAI drops ARP packets on untrusted ports unless an IP-to-MAC binding exists in the DHCP Snooping table.',
      'Static-IP devices never send DHCP requests, so they have zero entries in the DHCP Snooping binding database!',
    ],
    explanation:
      'HOW & WHY: Static hosts bypass DHCP, so DAI sees their ARP packets as unverified and drops them. Marking user ports trusted defeats DAI; instead, either bind their static IP+MAC via an ARP ACL ("ip arp inspection filter") or switch them to DHCP reservations so DHCP Snooping records their bindings.',
  },
  {
    id: 'ccna-h19-scen',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: VTY Access-Class & SSH Lockout',
    prompt:
      'Scenario: An admin secures remote SSH access on R1 using:\nline vty 0 4\n access-class MGMT_ONLY in\n transport input ssh\nwhere MGMT_ONLY permits 10.5.5.0/24. Immediately, IT admins in 10.5.5.0/24 report they CAN SSH to R1, yet a newly scripted automation server at 10.5.5.80 still gets "Connection refused by remote host" when trying Telnet on port 23. Why?',
    options: [
      '"transport input ssh" restricts the VTY lines exclusively to SSH (TCP 22) and drops Telnet (TCP 23) connections even from permitted IPs.',
      'MGMT_ONLY is missing "permit any".',
      'VTY lines 0–4 only allow 1 concurrent user.',
      'Automation servers must use VTY line 15.',
    ],
    correctIndices: [0],
    hints: [
      'Notice the automation server tried TELNET (port 23), whereas admins succeeded with SSH (port 22)!',
      'What does "transport input ssh" do on VTY lines?',
    ],
    explanation:
      'HOW & WHY: Two separate controls protect VTY lines: "access-class" restricts WHICH source IPs can connect, and "transport input ssh" restricts WHICH protocols (SSH only, blocking Telnet) VTY lines accept. Switching the automation script to SSH/NETCONF resolves it securely.',
  },
  {
    id: 'ccna-h20-scen',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: RESTCONF PUT vs. PATCH Semantics',
    prompt:
      'Scenario: Using RESTCONF against a Cisco IOS-XE router, you want to update ONLY the "description" field on GigabitEthernet2 without erasing its existing IP address, MTU, and OSPF settings. Which HTTP method should your API call use?',
    options: ['DELETE', 'GET', 'PATCH', 'PUT (sending only the description key)'],
    correctIndices: [2],
    hints: [
      'PUT replaces the ENTIRE target resource object—if you omit "ip address" in a PUT payload, you wipe the interface IP!',
      'Which HTTP verb performs a partial merge/update of only the supplied fields?',
    ],
    explanation:
      'HOW & WHY: In REST/RESTCONF APIs, PUT replaces the entire resource representation (wiping omitted fields!), whereas PATCH applies a partial modification—updating only the fields included in your JSON/XML body.',
  },
  {
    id: 'ccna-h21-sim',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: ACL Shadowing & Implicit Deny',
    prompt:
      'Guest Wi-Fi users (192.168.50.0/24) are supposed to access the Internet (HTTP/HTTPS/DNS) while being blocked from reaching internal Finance server 10.10.20.10. Instead, Guests report they CAN reach Finance 10.10.20.10 via RDP! Inspect the R1 config tabs to find out why.',
    exhibitTabs: [
      {
        title: 'R1: show ip interface Gi0/2',
        output: `GigabitEthernet0/2 is up, line protocol is up\n  Internet address is 192.168.50.1/24 (Guest Wi-Fi)\n  Inbound access list is GUEST_FILTER\n  Outgoing access list is not set`,
      },
      {
        title: 'R1: show access-lists GUEST_FILTER',
        output: `Extended IP access list GUEST_FILTER\n    10 permit ip 192.168.50.0 0.0.0.255 any (8421 matches)\n    20 deny ip 192.168.50.0 0.0.0.255 host 10.10.20.10\n    30 deny ip any any`,
      },
    ],
    options: [
      'ACLs process top-down and stop at the first match: sequence 10 ("permit ip ... any") matches ALL Guest traffic first, shadowing sequence 20 so the deny never runs!',
      'GUEST_FILTER must be applied outbound on Gi0/2.',
      '0.0.0.255 is the wrong wildcard for /24.',
      'Extended ACLs evaluate highest sequence number first.',
    ],
    correctIndices: [0],
    hints: [
      'Look at the match count on sequence 10 ("8421 matches") vs sequence 20 (zero matches!).',
      'In Cisco ACLs, most specific deny/permit rules MUST appear BEFORE broad "permit any" rules.',
    ],
    explanation:
      'HOW & WHY: IOS evaluates ACL statements strictly top-down from lowest sequence number to highest, exiting on the first match. Sequence 10 permits ALL IP destinations first, completely shadowing sequence 20. Moving the deny for 10.10.20.10 to sequence 5 fixes the leak immediately.',
  },
  {
    id: 'ccna-h22-sim',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: Ansible YAML & REST API Debug',
    prompt:
      'An engineer’s Ansible playbook fails to push a new VLAN to Catalyst Center via REST API, returning a YAML syntax error and HTTP 401 on manual curl tests. Inspect both tabs to diagnose both faults.',
    exhibitTabs: [
      {
        title: 'playbook.yml',
        output: `- name: Create Campus VLAN\n  hosts: localhost\n  tasks:\n    - name: Push VLAN 30\n      uri:\n        url: "https://dnac.corp.local/dna/intent/api/v1/vlan"\n        method: POST\n\tbody_format: json\n        headers:\n          X-Auth-Token: "{{ auth_token }}"`,
      },
      {
        title: 'curl -i Response',
        output: `HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer\n{"response":{"errorCode":"401","message":"Invalid or expired X-Auth-Token"}}`,
      },
    ],
    options: [
      'Two issues: line 8 in YAML uses a TAB character instead of spaces (illegal in YAML), and HTTP 401 indicates the X-Auth-Token expired or is invalid.',
      'JSON cannot be sent with POST requests.',
      'Ansible hosts: localhost requires Telnet.',
      'HTTP 401 means the VLAN was successfully created.',
    ],
    correctIndices: [0],
    hints: [
      'Look closely at indentation before "body_format: json" AND look at the HTTP status code in tab 2.',
      'YAML strictly forbids tab characters; 401 means authentication failed.',
    ],
    explanation:
      'HOW & WHY: Tab 1 contains a tab character before "body_format: json" (YAML requires spaces only). Tab 2 returns HTTP 401 Unauthorized, meaning the script must first POST credentials to /dna/system/api/v1/auth/token to obtain a fresh X-Auth-Token.',
  },
  {
    id: 'ccna-h23-dd',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    questionType: 'drag-drop',
    topic: 'Syslog Severity Levels Matching',
    prompt: 'Drag (or tap) each Syslog severity level to its matching severity code.',
    dragDrop: {
      items: ['Level 0 (Emergencies)', 'Level 3 (Errors)', 'Level 5 (Notifications)', 'Level 7 (Debugging)'],
      targets: [
        { id: 'sys-0', slotLabel: 'System is completely unusable (highest severity)', correctItem: 'Level 0 (Emergencies)' },
        { id: 'sys-3', slotLabel: 'Error conditions (threshold used by "logging trap 3")', correctItem: 'Level 3 (Errors)' },
        { id: 'sys-5', slotLabel: 'Normal but significant event (e.g., %LINK-5-CHANGED)', correctItem: 'Level 5 (Notifications)' },
        { id: 'sys-7', slotLabel: 'Verbose diagnostic output (lowest severity, e.g., debug ip ospf)', correctItem: 'Level 7 (Debugging)' },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      '0 is worst; 7 is verbose debugging.',
      'Notice "%LINK-5-CHANGED" literally has the "5" inside the IOS syslog tag!',
    ],
    explanation:
      'HOW & WHY: Cisco Syslog embeds the severity digit right inside log messages (e.g., %LINEPROTO-5-UPDOWN = Level 5 Notifications). Knowing 0=Emergency, 3=Error, 5=Notification, 7=Debug helps tune "logging trap" accurately.',
  },
  {
    id: 'ccna-h24-dd',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    questionType: 'drag-drop',
    topic: 'REST HTTP Methods & CRUD',
    prompt: 'Match each REST HTTP method to its network automation CRUD operation.',
    dragDrop: {
      items: ['GET', 'POST', 'PATCH', 'DELETE'],
      targets: [
        { id: 'rest-get', slotLabel: 'Retrieve current switch inventory list (Read-Only)', correctItem: 'GET' },
        { id: 'rest-post', slotLabel: 'Create a brand-new VLAN object on the controller', correctItem: 'POST' },
        { id: 'rest-patch', slotLabel: 'Update only the description field on an existing interface', correctItem: 'PATCH' },
        { id: 'rest-del', slotLabel: 'Remove an obsolete static route entry', correctItem: 'DELETE' },
      ],
    },
    options: [],
    correctIndices: [],
    hints: [
      'GET reads, POST creates, PATCH modifies partially, DELETE removes.',
      'Remember PATCH vs PUT: PATCH updates selected attributes without replacing the whole object.',
    ],
    explanation:
      'HOW & WHY: REST APIs map HTTP verbs directly to operations: GET = Read, POST = Create, PUT = Full Replace, PATCH = Partial Update, DELETE = Remove.',
  },
  // Fill out the remaining CCNA questions across Easy/Medium/Hard so CCNA >= 120 (total 125!)
  {
    id: 'ccna-m39',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'Binary & Subnet Bit Borrowing',
    prompt: 'You have 192.168.1.0/24 and need at least 6 equal subnets for separate departments. How many host bits must you borrow, and what is the new prefix length?',
    options: [
      'Borrow 2 bits -> /26 (gives 4 subnets)',
      'Borrow 3 bits -> /27 (gives 8 subnets of 30 usable hosts each)',
      'Borrow 4 bits -> /28 (gives 16 subnets)',
      'Borrow 1 bit -> /25 (gives 2 subnets)',
    ],
    correctIndices: [1],
    hints: [
      'Use formula 2^s >= required subnets, where s = borrowed bits.',
      '2^2 = 4 (too few for 6); 2^3 = 8 (>= 6)! Add 3 to /24.',
    ],
    explanation:
      'HOW & WHY: Borrowing 2 bits yields only 2^2 = 4 subnets, so you must borrow 3 bits (2^3 = 8 subnets >= 6). /24 + 3 = /27 (255.255.255.224), leaving 5 host bits (30 usable hosts per subnet).',
  },
  {
    id: 'ccna-m40',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'SLAAC vs. Stateless/Stateful DHCPv6',
    prompt: 'In IPv6, a host receives a Router Advertisement (RA) with the A=1, M=0, and O=1 flags set. How does the host obtain its IPv6 address and DNS server address?',
    options: [
      'It uses SLAAC to self-generate its IPv6 address from the RA prefix, and uses Stateless DHCPv6 solely to learn DNS servers.',
      'It ignores SLAAC and asks Stateful DHCPv6 for everything.',
      'It uses IPv4 ARP to discover the DNS server.',
      'It assigns itself 169.254.x.x.',
    ],
    correctIndices: [0],
    hints: [
      'A = Autonomous address autoconfiguration (SLAAC); M = Managed (Stateful DHCPv6); O = Other config (DNS via Stateless DHCPv6).',
      'A=1, M=0, O=1 is the classic "SLAAC + Stateless DHCPv6" combination.',
    ],
    explanation:
      'HOW & WHY: RA flags control client addressing: A=1 allows SLAAC address generation, M=0 disables Stateful DHCPv6 address leasing, and O=1 tells the client to query a Stateless DHCPv6 server for "Other" options like DNS servers.',
  },
  {
    id: 'ccna-m41',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'BPDU Guard vs. Root Guard',
    prompt: 'Access port Fa0/10 has PortFast and BPDU Guard enabled. A user accidentally plugs a small desktop switch into Fa0/10, and that switch transmits a BPDU. What happens immediately?',
    options: [
      'The user’s switch becomes Root Bridge.',
      'SW1 puts Fa0/10 into err-disabled state to protect the campus STP topology.',
      'Fa0/10 converts into an 802.1Q trunk.',
      'BPDU Guard forwards the BPDU to all VLANs.',
    ],
    correctIndices: [1],
    hints: [
      'Access ports with PortFast expect ONLY end hosts (which never send BPDUs).',
      'BPDU Guard treats any incoming BPDU on an edge port as a topology violation.',
    ],
    explanation:
      'HOW & WHY: BPDU Guard protects PortFast edge ports by immediately err-disabling any port that receives an unexpected STP BPDU—preventing unauthorized switches from triggering STP recalculations or loops.',
  },
  {
    id: 'ccna-m42',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'Switch Virtual Interface (SVI) vs. Routed Port',
    prompt: 'On a Catalyst Layer 3 switch, how do you enable Layer 3 routing on a physical switchport (e.g., Gi0/1 connecting to a WAN router) without assigning a VLAN?',
    options: [
      'switchport mode routed',
      'no switchport (followed by ip address)',
      'encapsulation dot1Q 0',
      'spanning-tree portfast',
    ],
    correctIndices: [1],
    hints: [
      'By default, Catalyst ports operate at Layer 2 ("switchport").',
      'Negate that default behavior in interface config mode to convert the port to a Layer 3 routed interface.',
    ],
    explanation:
      'HOW & WHY: Entering "no switchport" on a Layer 3 switch interface disables Layer 2 switching on that physical port so you can configure an IPv4/IPv6 address directly on it, just like a router interface.',
  },
  {
    id: 'ccna-m43',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'Wireless Interference & Channels',
    prompt: 'Why is 5 GHz (or 6 GHz) strongly preferred over 2.4 GHz in high-density enterprise offices with 20+ access points?',
    options: [
      '5 GHz travels 10x farther through concrete walls.',
      '5 GHz provides 20+ non-overlapping 20 MHz channels, dramatically reducing co-channel interference.',
      '2.4 GHz does not support WPA2.',
      '5 GHz requires no antennas.',
    ],
    correctIndices: [1],
    hints: [
      '2.4 GHz only has 3 non-overlapping channels (1, 6, 11), causing neighboring APs to step on each other.',
      'More non-overlapping channels = cleaner airtime and wider channel bonding.',
    ],
    explanation:
      'HOW & WHY: With only 3 non-overlapping channels in 2.4 GHz, dense offices suffer heavy co-channel contention. 5 GHz (and 6 GHz) supplies dozens of non-overlapping channels plus faster 802.11ac/ax data rates.',
  },
  {
    id: 'ccna-m44',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'First-Hop Redundancy Protocols',
    prompt: 'Compare HSRP, VRRP, and GLBP: which First-Hop Redundancy Protocol is open-standard (IETF RFC 5798) vs. which Cisco protocol allows active-active load balancing across multiple gateways using one virtual IP?',
    options: [
      'VRRP is open-standard; GLBP load-balances across multiple Active Virtual Forwarders (AVFs).',
      'HSRP is open-standard; VRRP load-balances across multiple gateways.',
      'GLBP is open-standard; HSRP assigns multiple MACs to one virtual IP.',
      'All three are Cisco-proprietary.',
    ],
    correctIndices: [0],
    hints: [
      'HSRP = Cisco standby protocol; VRRP = open standard; GLBP = Gateway Load Balancing Protocol.',
      'GLBP hands out different virtual forwarder MAC addresses in ARP replies!',
    ],
    explanation:
      'HOW & WHY: VRRP is the vendor-neutral IETF standard FHRP. Cisco’s GLBP elects one Active Virtual Gateway (AVG) that replies to client ARP requests with different Active Virtual Forwarder (AVF) MACs, achieving active-active gateway load balancing.',
  },
  {
    id: 'ccna-m45',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'OSPF Hello/Dead Timers',
    prompt: 'On a standard broadcast Ethernet network, what are Cisco IOS’s default OSPFv2 Hello and Dead intervals?',
    options: [
      'Hello 5s / Dead 15s',
      'Hello 10s / Dead 40s',
      'Hello 30s / Dead 120s',
      'Hello 60s / Dead 180s',
    ],
    correctIndices: [1],
    hints: [
      'The Dead interval defaults to 4x the Hello interval.',
      '10 seconds x 4 = 40 seconds on broadcast and point-to-point links (30/120 is NBMA).',
    ],
    explanation:
      'HOW & WHY: On broadcast and point-to-point links, OSPF sends Hellos every 10 seconds and declares a silent neighbor dead after 40 seconds (4x Hello). Neighbors MUST match Hello/Dead timers to form an adjacency.',
  },
  {
    id: 'ccna-m46',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'DNS vs. DHCP Options',
    prompt: 'Which two DHCP parameters must a workstation receive (besides its IPv4 address and subnet mask) to browse external websites like https://example.com?',
    multiSelect: true,
    options: [
      'Default Gateway (Router Option 3)',
      'DNS Server IP (Option 6)',
      'Syslog Collector Port',
      'SNMPv3 Auth Password',
    ],
    correctIndices: [0, 1],
    hints: [
      'How does a PC leave its local subnet, and how does it turn "example.com" into an IP?',
      'Both routing off-subnet AND name resolution are required.',
    ],
    explanation:
      'HOW & WHY: Without a Default Gateway (DHCP Option 3), traffic cannot route off the local subnet. Without a DNS Server (DHCP Option 6), domain names like example.com cannot resolve to IP addresses.',
  },
  {
    id: 'ccna-m47',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'SSH Domain & Crypto Keys',
    prompt: 'On a brand-new Cisco router, you configure "username admin secret Cisco123" and "transport input ssh" on VTY lines, but "ip ssh version 2" refuses to run. What two prerequisites are missing?',
    multiSelect: true,
    options: [
      'A non-default hostname (not "Router") and an "ip domain-name" configured',
      'Generating RSA keys via "crypto key generate rsa modulus 2048"',
      'Enabling "router ospf 1"',
      'Disabling Enable Secret',
    ],
    correctIndices: [0, 1],
    hints: [
      'IOS builds the RSA key pair name out of <hostname>.<domain-name>.',
      'No RSA (or ECDSA) key pair = SSH daemon cannot start!',
    ],
    explanation:
      'HOW & WHY: To enable SSH on Cisco IOS, the router requires: 1) a hostname and "ip domain-name <domain>", 2) an RSA key pair ("crypto key generate rsa modulus 2048"), 3) local username/AAA auth, and 4) "transport input ssh" on line vty 0 4.',
  },
  {
    id: 'ccna-h25-scen',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Inter-VLAN Routing Missing Default Gateway',
    prompt:
      'Scenario: SW1 connects PC-A (VLAN 10: 10.10.10.25/24) and PC-B (VLAN 20: 10.10.20.25/24) to Router R1 via Router-on-a-Stick. PC-A CAN ping its gateway 10.10.10.1, and R1 CAN ping 10.10.20.25. However, PC-A CANNOT ping PC-B. Inspecting PC-B reveals IP 10.10.20.25, Mask 255.255.255.0, Default Gateway: blank. Explain why R1 can ping PC-B while PC-A cannot.',
    options: [
      'R1 pings PC-B from its own directly connected VLAN 20 subinterface 10.10.20.1 (no gateway needed by PC-B to reply on the same subnet!), whereas replies to PC-A (10.10.10.25) require PC-B to know its Default Gateway.',
      'R1 blocks ICMP between subinterfaces by default.',
      'SW1 requires VTP Server mode for inter-VLAN pings.',
      'VLAN 10 and VLAN 20 cannot share the same physical trunk.',
    ],
    correctIndices: [0],
    hints: [
      'When R1 pings PC-B, what source IP does R1 use? Its VLAN 20 subinterface 10.10.20.1 — which is on PC-B’s OWN local subnet!',
      'When PC-A pings PC-B, the source IP is 10.10.10.25 (a remote subnet) — PC-B needs a Default Gateway to send the Echo Reply back.',
    ],
    explanation:
      'HOW & WHY: Classic troubleshooting insight! When R1 pings 10.10.20.25, R1 sources the packet from 10.10.20.1 (same subnet as PC-B), so PC-B replies via local ARP without needing a gateway. When PC-A (10.10.10.25) pings PC-B, the return packet is off-subnet, so PC-B drops it because its Default Gateway is blank.',
  },
  {
    id: 'ccna-h26-scen',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Port-Security Sticky Aging & Moved Laptop',
    prompt:
      'Scenario: A user unplugs their desk phone and laptop from cubicle port Fa0/14 (configured with "switchport port-security maximum 1", "mac-address sticky", and default violation "shutdown") and plugs into cubicle port Fa0/18 on the same switch. Another employee then plugs a DIFFERENT laptop into Fa0/14. What happens on BOTH ports?',
    options: [
      'Fa0/18 learns the user’s MAC cleanly (if unconfigured previously), while Fa0/14 immediately enters err-disabled state because the old sticky MAC is still locked to Fa0/14.',
      'Both Fa0/14 and Fa0/18 err-disable immediately.',
      'Fa0/14 automatically erases the sticky MAC and learns the new laptop.',
      'The switch reboots.',
    ],
    correctIndices: [0],
    hints: [
      'Sticky MAC addresses stay statically bound to Fa0/14 until manually cleared!',
      'Default violation mode on Fa0/14 is "shutdown".',
    ],
    explanation:
      'HOW & WHY: Because Fa0/14 recorded the original laptop’s MAC via sticky port-security with maximum 1 and violation shutdown, plugging a different laptop into Fa0/14 immediately triggers a security violation and puts Fa0/14 into err-disabled. Clear the old sticky MAC ("no switchport port-security mac-address sticky <old>") and bounce "shut / no shut" to recover.',
  },
  {
    id: 'ccna-h27-scen',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: QoS Trust Boundary Misconfiguration',
    prompt:
      'Scenario: An engineering workstation runs a torrent downloader that artificially tags its own outgoing packets with DSCP EF (46) to steal priority bandwidth. Why would an enterprise access switch drop or remark that traffic to DSCP 0 (Best Effort)?',
    options: [
      'Access switchports facing untrusted PCs enforce a QoS Trust Boundary ("mls qos trust" disabled on user ports), re-marking untrusted PC traffic back to DSCP 0 while trusting only verified IP phones/uplinks.',
      'DSCP 46 is illegal over Ethernet.',
      'QoS only inspects TCP port 80.',
      'Switches cannot read IPv4 headers.',
    ],
    correctIndices: [0],
    hints: [
      'Never blindly trust QoS markings generated by end-user PCs!',
      'Where does the network establish its "trust boundary"? At the IP phone or access switchport!',
    ],
    explanation:
      'HOW & WHY: A QoS Trust Boundary marks where incoming DSCP/CoS values are accepted. Untrusted PC switchports ignore or reset user-forged DSCP tags to 0 (Best Effort), while trusting only enterprise IP phones (for voice VLAN traffic) and inter-switch trunks.',
  },
  {
    id: 'ccna-h28-scen',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: ECMP Equal-Cost Routing Verification',
    prompt:
      'Scenario: R1 learns two OSPF routes to 10.70.0.0/24: via 10.0.12.2 (cost 20) and via 10.0.13.2 (cost 20). How does Cisco Express Forwarding (CEF) forward traffic across those two paths by default, and why does it matter for TCP?',
    options: [
      'CEF performs per-destination / per-flow hashing (using source/dest IP and L4 ports) so packets within one TCP flow stay in order while spreading different flows across both links.',
      'CEF sends alternating packets of the exact same TCP connection across different links (per-packet), causing severe out-of-order delivery.',
      'OSPF only installs one of the two routes in the RIB.',
      'CEF requires BGP to use two equal-cost paths.',
    ],
    correctIndices: [0],
    hints: [
      'Per-packet load balancing can cause TCP out-of-order reassembly penalties.',
      'CEF defaults to flow-based hashing so all packets of one session follow one path.',
    ],
    explanation:
      'HOW & WHY: When OSPF installs equal-cost paths into the RIB (default maximum-paths 4), CEF defaults to per-destination/flow load balancing—hashing src/dst IP (and ports) so individual flows stay strictly in-order while multiple flows share bandwidth across both links.',
  },
  {
    id: 'ccna-h29-scen',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Summarization Route Calculation',
    prompt:
      'Scenario: A campus summarizes four contiguous branch subnets (172.16.16.0/24, 172.16.17.0/24, 172.16.18.0/24, 172.16.19.0/24) into a single static summary route toward Core-R1. What is the exact summary prefix and mask?',
    options: ['172.16.16.0/22', '172.16.16.0/21', '172.16.0.0/16', '172.16.16.0/23'],
    correctIndices: [0],
    hints: [
      'Write the 3rd octets in binary: 16 = 00010000, 17 = 00010001, 18 = 00010010, 19 = 00010011.',
      'Count how many bits from the left stay identical across all four! 8 + 8 + 6 = ?',
    ],
    explanation:
      'HOW & WHY: Comparing 3rd octets 16–19 in binary: 000100|00 through 000100|11. The first 6 bits of the 3rd octet stay identical (8 + 8 + 6 = /22), and the common prefix is 172.16.16.0/22 (block size 4 in 3rd octet: 16, 17, 18, 19).',
  },
  // Adding extra targeted Easy/Medium questions to exceed 120 CCNA questions cleanly
  {
    id: 'ccna-e39',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'VLAN 1 Management Best Practice',
    prompt: 'Why is it a Cisco security best practice to move the switch management SVI and unused access ports OUT of default VLAN 1?',
    options: [
      'VLAN 1 only supports 10 Mbps half-duplex.',
      'Control protocols (CDP, DTP, STP, VTP) use VLAN 1, and leaving default ports in VLAN 1 exposes management access to any wall jack.',
      'VLAN 1 cannot be carried over 802.1Q trunks.',
      'Switches drop ARP packets in VLAN 1.',
    ],
    correctIndices: [1],
    hints: [
      'Every out-of-the-box switchport starts in VLAN 1.',
      'Separating user ports, management SVIs, and a blackhole unused-port VLAN prevents unauthorized access.',
    ],
    explanation:
      'HOW & WHY: Because all switchports default to VLAN 1 and legacy control frames traverse VLAN 1, best practice assigns a dedicated Management VLAN (e.g., VLAN 99), places active users in separate VLANs, and parks unused shutdown ports in a dead VLAN.',
  },
  {
    id: 'ccna-e40',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'easy',
    topic: 'ICMP Ping & Traceroute',
    prompt: 'Which protocol and header field does "traceroute" rely on to discover every intermediate router hop along a path?',
    options: [
      'TCP Sequence Numbers',
      'Incrementing IP TTL (1, 2, 3...) triggering ICMP Time Exceeded messages from each router along the path',
      'ARP Broadcast Requests',
      'OSPF Hello Packets',
    ],
    correctIndices: [1],
    hints: [
      'First probe leaves with TTL=1 so the very first router drops it and sends an ICMP error back.',
      'Next probe uses TTL=2, then TTL=3, until the destination responds.',
    ],
    explanation:
      'HOW & WHY: Traceroute starts with TTL=1 (so Hop 1 decrements TTL to 0 and replies with ICMP Time Exceeded), then TTL=2 (Hop 2 replies), mapping every L3 router hop until reaching the target.',
  },
  {
    id: 'ccna-e41',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'Firewall Stateful Inspection',
    prompt: 'How does a Stateful Firewall handle return traffic for an outbound HTTPS session initiated by an internal workstation?',
    options: [
      'It drops all inbound packets unless a separate static inbound permit rule exists for ephemeral ports.',
      'It records the outbound session in its state table and automatically permits matching return packets back in.',
      'It converts HTTPS to Telnet.',
      'It requires manual admin approval for every TCP ACK.',
    ],
    correctIndices: [1],
    hints: [
      'Stateless ACLs check every packet in isolation; Stateful firewalls remember active conversations!',
      'Think "connection state table".',
    ],
    explanation:
      'HOW & WHY: Stateful firewalls track active TCP/UDP flows (5-tuple + TCP flags/sequence state) in a dynamic state table, automatically permitting legitimate return packets for approved outbound connections while blocking unsolicited inbound traffic.',
  },
  {
    id: 'ccna-e42',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'easy',
    topic: 'Underlay vs. Overlay Networks',
    prompt: 'In Cisco SD-Access or VXLAN data centers, what is the "Underlay" network vs. the "Overlay" network?',
    options: [
      'Underlay = physical switches/routers/IP reachability; Overlay = virtual encapsulated tunnels (e.g., VXLAN) built on top.',
      'Underlay = Wi-Fi SSIDs; Overlay = Cat6A patch cables.',
      'Underlay = JSON; Overlay = YAML.',
      'Underlay = Control Plane; Overlay = Power Supply.',
    ],
    correctIndices: [0],
    hints: [
      'Think of physical highways as the Underlay and virtual encrypted/tunneled lanes riding across them as the Overlay.',
      'Without healthy Underlay IP routing, Overlay tunnels cannot connect.',
    ],
    explanation:
      'HOW & WHY: The Underlay comprises physical switches, fiber links, and routing (e.g., OSPF/IS-IS) providing raw IP reachability. The Overlay creates logical virtualized networks (VXLAN/LISP tunnels) decoupled from physical topology constraints.',
  },
  {
    id: 'ccna-m48',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'Local vs. AAA Authentication Fallback',
    prompt: 'When configuring "aaa authentication login default group tacacs+ local", when will the router check its local username database?',
    options: [
      'Whenever the user mistypes their password against the TACACS+ server',
      'Only if the TACACS+ server is completely unreachable (down/timed out)',
      'Before contacting TACACS+ on every login',
      'Never—local is ignored when TACACS+ is configured',
    ],
    correctIndices: [1],
    hints: [
      'If a user types the WRONG password and TACACS+ says "Reject", falling back to local would be a security hole!',
      'Fallback triggers ONLY on server ERROR/UNREACHABLE.',
    ],
    explanation:
      'HOW & WHY: In IOS AAA method lists, fallback to "local" happens ONLY when the primary TACACS+/RADIUS server fails to respond (network outage or server crash)—NEVER when the server explicitly rejects bad credentials.',
  },
  {
    id: 'ccna-m49',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'FTP Active vs. Passive Modes (Troubleshooting)',
    prompt: 'Which two TCP ports are used by standard unencrypted FTP for its Control connection and Data connection respectively?',
    options: ['TCP 21 (Control) and TCP 20 (Active Data)', 'TCP 22 and TCP 23', 'UDP 69 and UDP 161', 'TCP 80 and TCP 443'],
    correctIndices: [0],
    hints: [
      'Port 21 handles login and commands; the port right below it handles active file data.',
      'Passive FTP uses ephemeral ports >1023 for data instead of TCP 20.',
    ],
    explanation:
      'HOW & WHY: Standard FTP opens a persistent Control session on TCP 21 and transfers file payloads/directory listings on TCP 20 (in Active mode) or negotiated high ports (in Passive mode, which traverses client NAT firewalls more reliably).',
  },
  {
    id: 'ccna-m50',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'Longest Prefix Match with /32 Host Route',
    prompt: 'A router holds routes: 10.10.0.0/16 via R1, 10.10.5.0/24 via R2, and 10.10.5.42/32 via R3. Which next hop forwards a packet destined to 10.10.5.42?',
    options: ['R1', 'R2', 'R3', 'Load-balanced equally across R1, R2, and R3'],
    correctIndices: [2],
    hints: [
      'Compare prefix lengths: /16 vs /24 vs /32.',
      'Administrative Distance and Metric only break ties when prefix lengths are IDENTICAL!',
    ],
    explanation:
      'HOW & WHY: Longest Prefix Match (/32 > /24 > /16) always takes absolute priority in IP forwarding, so 10.10.5.42/32 via R3 wins.',
  },
  {
    id: 'ccna-h30-scen',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: NTP Authentication Key Mismatch',
    prompt:
      'Scenario: Company policy requires authenticated NTP so attackers cannot poison router clocks. On R1 (client), "show ntp associations" displays the server IP 10.1.0.10, yet "show ntp status" keeps saying "Clock is unsynchronized, stratum 16". Comparing configs shows R1 uses "ntp authentication-key 1 md5 SecretKey" and "ntp trusted-key 1", while the server uses key ID 2 with the same password. Why did sync fail?',
    options: [
      'Both the NTP authentication key ID number AND the MD5/SHA key string must match exactly between client and server.',
      'NTP requires Stratum 16 to synchronize.',
      'MD5 keys cannot be used with private IPs.',
      'NTP uses TCP 123 which must be opened manually on loopbacks.',
    ],
    correctIndices: [0],
    hints: [
      'Look at Key ID 1 on R1 vs. Key ID 2 on the server.',
      'Stratum 16 specifically means "unsynchronized" in NTP.',
    ],
    explanation:
      'HOW & WHY: NTP authentication checks both the Key ID integer and the shared secret string. Because R1 trusted Key ID 1 while the server signed with Key ID 2, R1 rejected the time updates and remained at Stratum 16 (unsynchronized).',
  },
  {
    id: 'ccna-h31-scen',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: TCP Established ACL vs. Stateful Inspection',
    prompt:
      'Scenario: On an IOS router without Zone-Based Firewall, you apply an inbound Extended ACL on the ISP-facing outside interface to block unsolicited inbound TCP connections while allowing replies to outbound internal HTTP/HTTPS requests. Which ACE keyword checks whether the TCP ACK or RST flag is set on incoming packets?',
    options: ['established', 'reflect', 'sticky', 'overload'],
    correctIndices: [0],
    hints: [
      'The very first packet of a brand-new inbound TCP connection (SYN) has ACK=0 and RST=0!',
      'Matching ACK=1 or RST=1 lets return traffic in while blocking new external SYNs.',
    ],
    explanation:
      'HOW & WHY: Adding the "established" keyword ("permit tcp any 192.168.10.0 0.0.0.255 established") matches TCP segments with the ACK or RST bit set—permitting return responses while blocking unsolicited initial TCP SYN packets from the Internet.',
  },
  {
    id: 'ccna-h32-scen',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Terraform / Ansible Inventory Variable Precedence',
    prompt:
      'Scenario: An Ansible inventory defines "ntp_server: 10.0.0.10" inside [all:vars], and defines "ntp_server: 10.50.0.10" inside host_vars/R1-BRANCH.yml. When the playbook runs against R1-BRANCH, which value is pushed to R1-BRANCH and why?',
    options: [
      '10.0.0.10 because group [all:vars] overrides everything.',
      '10.50.0.10 because more specific host_vars override broader group_vars/[all:vars].',
      'Both IPs are concatenated into an array.',
      'Ansible throws a fatal conflict error.',
    ],
    correctIndices: [1],
    hints: [
      'Think of specificity: global defaults vs. site group vs. individual host override.',
      'Host-specific variables win over [all] group variables.',
    ],
    explanation:
      'HOW & WHY: Ansible variable precedence favors specificity: host_vars override group_vars, and group_vars override [all:vars]—allowing global standards with clean per-branch exceptions.',
  },
  // Adding 28 more targeted CCNA questions so Part 1 (48) + Part 2 (47) + Core (30) = 125 CCNA Questions!
  {
    id: 'ccna-e43',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'easy',
    topic: 'Mac Address Format',
    prompt: 'How many bits and hexadecimal digits make up an IEEE 802.3 Ethernet MAC address, and what do the first 24 bits identify?',
    options: [
      '32 bits (8 hex digits); identifies the IPv4 subnet',
      '48 bits (12 hex digits); first 24 bits identify the Organizationally Unique Identifier (OUI / vendor)',
      '64 bits (16 hex digits); identifies the VLAN ID',
      '128 bits (32 hex digits); identifies the switch hostname',
    ],
    correctIndices: [1],
    hints: [
      'Look at a Cisco MAC like 0010.1111.aaaa: 12 hex characters x 4 bits each.',
      'OUI = manufacturer code assigned by IEEE.',
    ],
    explanation:
      'HOW & WHY: Ethernet MAC addresses are 48 bits (12 hex digits). The first 24 bits form the OUI (identifying the hardware vendor like Cisco or Intel), and the last 24 bits are assigned uniquely to the NIC.',
  },
  {
    id: 'ccna-e44',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'easy',
    topic: 'EtherChannel Benefits',
    prompt: 'Which two benefits do you gain by bundling four 1 Gbps switch links into one logical Layer 2 EtherChannel (Port-Channel)? (Choose two.)',
    multiSelect: true,
    options: [
      'Aggregate bandwidth increases up to 4 Gbps across multiple traffic flows.',
      'STP treats the bundle as one logical link, eliminating blocked links and providing instant link-failure redundancy without full STP reconvergence.',
      'It converts Layer 2 switches into BGP routers.',
      'It eliminates the need for VLAN tags.',
    ],
    correctIndices: [0, 1],
    hints: [
      'Without EtherChannel, STP blocks 3 of the 4 parallel cables!',
      'Think bandwidth aggregation + single logical STP interface.',
    ],
    explanation:
      'HOW & WHY: Without EtherChannel, STP blocks parallel links to stop loops. Bundling them into a Port-Channel lets STP treat all 4 links as one logical interface—activating aggregate throughput and sub-second failover if one cable fails.',
  },
  {
    id: 'ccna-e45',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'easy',
    topic: 'Default Gateway Function',
    prompt: 'When PC1 (192.168.10.25/24) sends a packet to web server 198.51.100.10, whose MAC address does PC1 place in the Ethernet Destination MAC field?',
    options: [
      'The remote web server’s MAC address',
      'Its Default Gateway router’s LAN interface MAC address',
      'FF:FF:FF:FF:FF:FF broadcast MAC',
      'Its own MAC address',
    ],
    correctIndices: [1],
    hints: [
      'MAC addresses never cross routers; ARP cannot reach across the Internet!',
      'PC1 compares 198.51.100.10 against its /24 mask, sees it is off-subnet, and sends the frame to its router.',
    ],
    explanation:
      'HOW & WHY: Because 198.51.100.10 is outside 192.168.10.0/24, PC1 keeps the Destination IP as 198.51.100.10 but sets the Layer 2 Destination MAC to its local Default Gateway router so the router can forward it off-subnet.',
  },
  {
    id: 'ccna-e46',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'easy',
    topic: 'Syslog Storage Targets',
    prompt: 'Where can a Cisco router send Syslog messages when "logging buffered" vs. "logging host 10.1.0.50" is configured?',
    options: [
      '"logging buffered" writes to internal RAM (lost on reboot); "logging host" sends logs over UDP 514 to a persistent remote Syslog server.',
      '"logging buffered" sends emails; "logging host" writes to flash.',
      'Both erase logs every 60 seconds.',
      '"logging host" uses TCP 23 Telnet.',
    ],
    correctIndices: [0],
    hints: [
      'What happens to logs stored only in RAM if a switch crashes and reboots?',
      'Remote Syslog uses UDP port 514 by default.',
    ],
    explanation:
      'HOW & WHY: "logging buffered" stores recent logs in volatile RAM ("show logging"), which disappears upon power loss. "logging host <ip>" ships logs off-box over UDP 514 so crash logs survive for root-cause analysis.',
  },
  {
    id: 'ccna-e47',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'easy',
    topic: 'Social Engineering Defense',
    prompt: 'An attacker calls the IT help desk pretending to be a VP on travel and pressures the technician to bypass MFA reset verification immediately. Which attack technique is this?',
    options: ['Phishing / Pretexting (Social Engineering)', 'ARP Poisoning', 'VLAN Hopping', 'SQL Injection'],
    correctIndices: [0],
    hints: [
      'Notice the attacker exploits urgency, authority, and human trust rather than software bugs.',
      'Always verify identity out-of-band before resetting passwords or MFA!',
    ],
    explanation:
      'HOW & WHY: Pretexting/impersonation is a social engineering attack using fabricated authority and urgency to bypass technical security controls. Strict out-of-band identity verification stops it.',
  },
  {
    id: 'ccna-e48',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'easy',
    topic: 'JSON vs. XML Syntax',
    prompt: 'How do XML and JSON differ structurally when representing an interface list returned by a network API?',
    options: [
      'XML uses opening and closing <tag>elements</tag>; JSON uses lightweight {"key": "value"} pairs and [arrays].',
      'XML uses spaces only; JSON uses <tags>.',
      'JSON cannot represent nested objects.',
      'XML is exclusively binary.',
    ],
    correctIndices: [0],
    hints: [
      'HTML looks like XML (<interface><name>Gi0/1</name></interface>); JavaScript objects look like JSON.',
      'REST APIs favor JSON for lower payload overhead; NETCONF uses XML.',
    ],
    explanation:
      'HOW & WHY: XML wraps every field in opening/closing <tags> (verbose, strict schema), whereas JSON uses compact key: value pairs inside {} and [] arrays.',
  },
  {
    id: 'ccna-m51',
    trackId: 'ccna',
    domainId: 'fundamentals',
    difficulty: 'medium',
    topic: 'TCP Windowing & Flow Control',
    prompt: 'What problem does the TCP Window Size field in the TCP header solve?',
    options: [
      'It chooses the OSPF shortest path.',
      'It lets the receiver dynamically control how many unacknowledged bytes the sender can transmit before pausing for an ACK (preventing buffer overflow).',
      'It encrypts the payload with AES.',
      'It translates private IPs to public IPs.',
    ],
    correctIndices: [1],
    hints: [
      'Imagine a 10 Gbps server sending data to a 100 Mbps laptop—if it waits for an ACK after every single packet, throughput crawls; if it sends infinitely, buffers drop packets.',
      'Sliding window size adapts dynamically to congestion and receiver capacity.',
    ],
    explanation:
      'HOW & WHY: TCP Flow Control uses the Sliding Window size so the receiver advertises available buffer space, maximizing throughput without overwhelming slower receivers.',
  },
  {
    id: 'ccna-m52',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'medium',
    topic: 'DTP Nonegotiate',
    prompt: 'You configure a static trunk between a Cisco Catalyst switch and a Linux KVM hypervisor (which does not speak Cisco DTP). Which command stops the switch from sending unnecessary DTP frames out the trunk?',
    options: [
      'switchport mode dynamic auto',
      'switchport nonegotiate',
      'no switchport',
      'spanning-tree bpdufilter enable',
    ],
    correctIndices: [1],
    hints: [
      'First set "switchport mode trunk", then turn off Dynamic Trunking Protocol negotiations.',
      'The command literally means "do not negotiate".',
    ],
    explanation:
      'HOW & WHY: Pairing "switchport mode trunk" with "switchport nonegotiate" locks the port as an unconditional 802.1Q trunk and suppresses proprietary DTP frames—standard hardening for trunks to servers, firewalls, and non-Cisco switches.',
  },
  {
    id: 'ccna-m53',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'medium',
    topic: 'OSPF Network Wildcard Matching',
    prompt: 'R1 has Gi0/0 at 10.1.4.1/30 and Gi0/1 at 10.1.4.5/30. Which single OSPF command activates OSPF ONLY on Gi0/0 (10.1.4.1) and NOT on Gi0/1?',
    options: [
      'network 10.1.4.0 0.0.0.255 area 0',
      'network 10.1.4.1 0.0.0.0 area 0',
      'network 10.1.4.0 0.0.0.7 area 0',
      'network 0.0.0.0 255.255.255.255 area 0',
    ],
    correctIndices: [1],
    hints: [
      'A 0.0.0.0 wildcard mask requires all 32 bits to match the exact interface IP!',
      'Using 0.0.0.255 or 0.0.0.7 would accidentally match BOTH .1 and .5.',
    ],
    explanation:
      'HOW & WHY: Entering "network 10.1.4.1 0.0.0.0 area 0" uses an all-zeros host wildcard to activate OSPF exclusively on the single interface holding 10.1.4.1—preventing accidental OSPF activation on neighboring subnets.',
  },
  {
    id: 'ccna-m54',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'medium',
    topic: 'CDP/LLDP Security Exposure',
    prompt: 'Why do security hardening baselines disable CDP ("no cdp enable") on external ISP-facing router interfaces while keeping it on internal switch uplinks?',
    options: [
      'CDP leaks IOS software version, device platform, management IP, and native VLANs to anyone connected to the wire.',
      'CDP blocks NAT translations.',
      'CDP doubles BGP bandwidth.',
      'CDP disables SSH.',
    ],
    correctIndices: [0],
    hints: [
      'Think reconnaissance: "show cdp neighbors detail" reveals exact OS version and management IP!',
      'Always disable discovery protocols toward untrusted ISPs and public guest ports.',
    ],
    explanation:
      'HOW & WHY: CDP/LLDP continuously broadcast device model, IOS version, hostname, and IP addresses at Layer 2. Disabling them on ISP-facing and untrusted access ports denies attackers free reconnaissance.',
  },
  {
    id: 'ccna-m55',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'medium',
    topic: 'Private Key vs. Shared Secret in RADIUS/TACACS+',
    prompt: 'Between RADIUS and TACACS+, which encrypts ONLY the user password inside Access-Request packets vs. which encrypts the ENTIRE packet body?',
    options: [
      'RADIUS encrypts the entire packet; TACACS+ encrypts only the password.',
      'TACACS+ encrypts the entire packet body; RADIUS encrypts only the password field.',
      'Neither encrypts passwords.',
      'Both use plaintext.',
    ],
    correctIndices: [1],
    hints: [
      'TACACS+ (TCP 49) is preferred for network admin device AAA.',
      'RADIUS leaves usernames, authorization attributes, and accounting data unencrypted inside the packet.',
    ],
    explanation:
      'HOW & WHY: TACACS+ (TCP 49) encrypts the entire payload after the header, whereas standard RADIUS (UDP 1812/1813) encrypts only the password attribute (leaving usernames and accounting payloads readable unless wrapped in RadSec/TLS).',
  },
  {
    id: 'ccna-m56',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'medium',
    topic: 'RESTCONF Media Types & Port',
    prompt: 'Which transport protocol and HTTP port does RESTCONF use by default to exchange YANG-modeled JSON/XML data with IOS-XE switches?',
    options: ['SSH over TCP 830', 'HTTPS over TCP 443', 'UDP 161', 'HTTP over TCP 8080'],
    correctIndices: [1],
    hints: [
      'NETCONF uses SSH TCP 830; RESTCONF brings RESTful HTTPS semantics!',
      'Standard HTTPS port = 443.',
    ],
    explanation:
      'HOW & WHY: RESTCONF provides a REST-like HTTP interface (HTTPS on TCP 443) for accessing YANG-modeled data with JSON or XML media types, whereas NETCONF runs over SSH TCP 830.',
  },
  {
    id: 'ccna-h33-scen',
    trackId: 'ccna',
    domainId: 'security',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Standard ACL Applied Inbound Blocking Wrong Host',
    prompt:
      'Scenario: R1 connects Sales (10.10.1.0/24 on Gi0/0) and Finance Server (10.20.2.50 on Gi0/1). An engineer writes Standard ACL 10 ("deny 10.10.1.0 0.0.0.255" / "permit any") and applies it "ip access-group 10 in" on Gi0/0 to stop Sales from reaching Finance. Immediately, Sales loses access to Finance, the Internet, DNS, and M365! Why?',
    options: [
      'Standard ACL 10 inspects only the source IP (10.10.1.0/24) and was placed inbound at the source (Gi0/0), blocking ALL outbound traffic from Sales to every destination!',
      'Standard ACLs require "established".',
      'Gi0/0 needs "ip nat inside".',
      'Standard ACL 10 blocks TCP port 443 specifically.',
    ],
    correctIndices: [0],
    hints: [
      'Look at ACL 10: does it mention 10.20.2.50 anywhere?',
      'Standard ACLs belong close to the DESTINATION (outbound on Gi0/1 toward Finance), OR use an Extended ACL at Gi0/0!',
    ],
    explanation:
      'HOW & WHY: Standard ACLs cannot specify a destination IP. Applying "deny 10.10.1.0/24" inbound on Gi0/0 drops ALL packets from Sales regardless of destination! Moving ACL 10 outbound on Gi0/1 (closest to Finance) or using an Extended ACL ("deny ip 10.10.1.0 0.0.0.255 host 10.20.2.50") fixes the outage.',
  },
  {
    id: 'ccna-h34-sim',
    trackId: 'ccna',
    domainId: 'services',
    difficulty: 'hard',
    questionType: 'simlet',
    topic: 'Simlet: DHCP Pool Exhaustion & Conflict',
    prompt:
      'Users on Floor 1 VLAN 10 report "Unable to obtain IP address" after arriving Monday morning, even though only 45 PCs are plugged into a /24 subnet (254 IPs). Inspect the IOS router outputs to determine what consumed the DHCP pool.',
    exhibitTabs: [
      {
        title: 'R1: show ip dhcp pool',
        output: `Pool VLAN10_POOL :\n Total addresses    : 254\n Leased addresses   : 234\n Excluded addresses : 20\n Pending event      : none`,
      },
      {
        title: 'R1: show ip dhcp binding | count',
        output: `Active dynamic client bindings: 45\n(Remaining 189 leases held by 7-day Guest phones/laptops from Friday conference)`,
      },
      {
        title: 'R1: show running-config | sec dhcp',
        output: `ip dhcp excluded-address 10.10.10.1 10.10.10.20\nip dhcp pool VLAN10_POOL\n network 10.10.10.0 255.255.255.0\n default-router 10.10.10.1\n lease 7`,
      },
    ],
    options: [
      'The 7-day DHCP lease duration kept 189 Friday conference/guest leases locked in the /24 pool alongside 20 excluded IPs (20 + 234 = 254), exhausting all available addresses.',
      'The /24 subnet mask only supports 45 hosts.',
      'ip helper-address is missing on R1.',
      'Excluded addresses must be placed inside the pool config.',
    ],
    correctIndices: [0],
    hints: [
      'Add Excluded (20) + Leased (234) = 254 total addresses in a /24!',
      'Look at the "lease 7" (7 days!) config vs. Friday conference guests.',
    ],
    explanation:
      'HOW & WHY: A 7-day lease ("lease 7") held 189 expired visitor/guest leases from Friday alongside 45 staff PCs and 20 excluded IPs (20 + 234 = 254 = 100% exhausted). Clear stale bindings ("clear ip dhcp binding *") and shorten leases on Wi-Fi/guest scopes (e.g., "lease 0 4" = 4 hours).',
  },
  {
    id: 'ccna-h35-scen',
    trackId: 'ccna',
    domainId: 'access',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Rogue AP Evil Twin Detection',
    prompt:
      'Scenario: Employees near the lobby complain their corporate laptops briefly disconnect from Wi-Fi and prompt them to re-enter domain credentials on an unverified captive page. The WLC flags an unauthorized AP broadcasting the exact corporate SSID "CORP-WIFI" on channel 6 with stronger signal than the ceiling AP. What attack is underway, and how does the WLC mitigate it?',
    options: [
      'An Evil Twin / Rogue AP impersonation attack; WLC Rogue Containment (or switchport shutdown via Rogue Location Discovery Protocol) isolates and suppresses the rogue.',
      'A CAPWAP UDP 5246 license expiry.',
      '802.11ax channel bonding interference from a microwave.',
      'An IPv6 EUI-64 MAC collision.',
    ],
    correctIndices: [0],
    hints: [
      'A rogue device mimicking your exact corporate SSID to steal credentials is called an "Evil Twin".',
      'Enterprise WLCs listen via off-channel scanning and locate/contain rogue APs.',
    ],
    explanation:
      'HOW & WHY: An Evil Twin mimics the legitimate SSID to lure clients into connecting and surrendering credentials. Enterprise WLCs detect matching rogue SSIDs via RLDP/AP radio scans, locate the switchport or physically suppress/contain the rogue, and enforce 802.1X server certificate validation so clients refuse untrusted APs.',
  },
  {
    id: 'ccna-h36-scen',
    trackId: 'ccna',
    domainId: 'connectivity',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: OSPF Duplicate Router ID',
    prompt:
      'Scenario: R1 and R2 both have Loopback0 configured as 1.1.1.1/32 for testing and run OSPFv2 in Area 0 across Gi0/0. Logs continually print "%OSPF-4-DUP_RTRID_DETECTED" and routes intermittently vanish from the routing table. How do you fix this permanently?',
    options: [
      'Assign unique Router IDs (e.g., 1.1.1.1 on R1 and 2.2.2.2 on R2) and run "clear ip ospf process" so the new RIDs take effect.',
      'Change R2’s OSPF Process ID from 1 to 2.',
      'Disable Loopback0 without clearing OSPF.',
      'Change the subnet mask from /30 to /29.',
    ],
    correctIndices: [0],
    hints: [
      'Every router in an OSPF domain MUST have a globally unique 32-bit Router ID to identify its LSAs!',
      'Changing "router-id" alone does not apply until the OSPF process is cleared/restarted.',
    ],
    explanation:
      'HOW & WHY: Duplicate OSPF Router IDs cause routers to overwrite and purge each other’s Router LSAs from the LSDB! Fix by giving each router a unique "router-id" (and unique Loopback0) followed by "clear ip ospf process".',
  },
  {
    id: 'ccna-h37-scen',
    trackId: 'ccna',
    domainId: 'automation',
    difficulty: 'hard',
    questionType: 'scenario',
    topic: 'Scenario: Chef vs. Puppet Terminology',
    prompt:
      'Scenario: A DevOps candidate migrating to network automation asks which configuration-management tool organizes desired device states into "Cookbooks" and "Recipes" written in Ruby vs. "Manifests" written in a declarative DSL.',
    options: [
      'Chef uses Cookbooks & Recipes; Puppet uses Manifests.',
      'Ansible uses Cookbooks; Terraform uses Manifests.',
      'Puppet uses Cookbooks; Chef uses Playbooks.',
      'Cisco DNA Center uses Recipes; Meraki uses Manifests.',
    ],
    correctIndices: [0],
    hints: [
      'Kitchen metaphor = Chef (Cookbooks, Recipes).',
      'Ansible = Playbooks/Roles; Puppet = Manifests.',
    ],
    explanation:
      'HOW & WHY: Quick CCNA exam mapping: Ansible = Playbooks (YAML, agentless SSH); Chef = Cookbooks & Recipes (Ruby DSL, Chef Workstation/Server/Client); Puppet = Manifests (Puppet Master/Agent pull).',
  },
];
