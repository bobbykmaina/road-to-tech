import { GlossaryEntry } from '../types/curriculum';

export const GLOBAL_GLOSSARY_TERMS: GlossaryEntry[] = [
  // CCNA OSPF Model Lesson & Core Networking Terms
  {
    term: 'Router ID (RID)',
    shortDef: '32-bit unique identifier for an OSPF router.',
    fullDef:
      'A 32-bit value written in dotted-decimal form that uniquely identifies a router inside an OSPF autonomous system. Selected in order: 1) manual `router-id` command, 2) highest IP of any up/up Loopback interface, 3) highest IP of any up/up non-loopback interface.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: 'Hello Packet',
    shortDef: 'Periodic multicast packet (224.0.0.5) used to discover and maintain OSPF neighbors.',
    fullDef:
      'OSPF Type 1 packet sent every Hello Interval (10s default on Ethernet/point-to-point) containing Router ID, Area ID, subnet mask, Hello/Dead timers, priority, DR/BDR IPs, and list of seen neighbors.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: 'Designated Router (DR)',
    shortDef: 'Elected hub router on a multi-access segment managing LSA flooding.',
    fullDef:
      'On broadcast and NBMA multi-access networks, all routers form FULL adjacencies with the DR (listening on 224.0.0.6) so updates flood cleanly via one central router rather than an O(n^2) full mesh.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: 'Backup Designated Router (BDR)',
    shortDef: 'Warm standby router ready to promote to DR if the DR fails.',
    fullDef:
      'Maintains FULL adjacencies with every router on the segment alongside the DR and immediately promotes to DR without waiting for a new election if the primary DR goes down.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: '2-Way State',
    shortDef: 'Bidirectional Hello communication confirmed (normal steady state between DROTHERs).',
    fullDef:
      'Reached when a router receives a Hello packet from a peer that includes its own Router ID in the neighbor list. Point-to-point links pass straight through 2-Way to ExStart; DROTHER pairs remain in 2-Way.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: 'ExStart State',
    shortDef: 'Initial DBD handshake state where primary/subordinate and MTU are checked.',
    fullDef:
      'The first step of database synchronization. Routers negotiate who starts sequence numbering (highest Router ID) and validate matching interface IP MTU inside DBD packets.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: 'Link-State Advertisement (LSA)',
    shortDef: 'Structured topology update describing a router’s links, prefixes, and costs.',
    fullDef:
      'Individual records stored in the OSPF Link-State Database (LSDB). All routers in the same area must hold an identical LSDB so Dijkstra SPF computes loop-free paths consistently.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: 'Non-Preemptive Election',
    shortDef: 'Rule preventing a newly joined higher-priority router from replacing an active DR.',
    fullDef:
      'Once a DR and BDR are elected on a segment, a new router with a higher OSPF priority stays DROTHER until the current DR and BDR go down or OSPF processes are reset.',
    lessonId: 'ccna.v2.3.3.2',
    moduleId: 'ccna',
  },
  {
    term: 'Administrative Distance (AD)',
    shortDef: 'Trustworthiness ranking of a routing protocol (Connected=0, Static=1, OSPF=110).',
    fullDef:
      'Local router metric (0–255; lower is preferred) used to decide which routing source installs into the routing table when two different protocols learn the exact same prefix and mask.',
    lessonId: 'ccna.core.rt.routing-table',
    moduleId: 'ccna',
  },
  {
    term: '802.1Q Trunk',
    shortDef: 'Switch link carrying traffic for multiple VLANs using 4-byte VLAN frame tags.',
    fullDef:
      'IEEE standard Ethernet encapsulation that inserts a 4-byte Tag Protocol Identifier + VLAN ID header on frames crossing inter-switch links (except the untagged Native VLAN).',
    lessonId: 'ccna.core.sw.trunks-8021q',
    moduleId: 'ccna',
  },
  {
    term: 'Rapid PVST+ (802.1w)',
    shortDef: 'Per-VLAN Rapid Spanning Tree preventing Layer 2 switching loops cleanly.',
    fullDef:
      'Cisco enhancement to IEEE 802.1w that runs a fast-converging spanning-tree instance per VLAN with Discarding, Learning, and Forwarding port states.',
    lessonId: 'ccna.core.sw.rapid-pvst',
    moduleId: 'ccna',
  },
  {
    term: 'Subnet Mask & CIDR (/n)',
    shortDef: 'Defines which bits of an IPv4 address identify the network vs individual hosts.',
    fullDef:
      'Continuous binary 1s mark the network portion and 0s mark host bits (e.g., `/24` = `255.255.255.0`), letting a host determine whether a peer is local or requires its Default Gateway.',
    lessonId: 'ccna.core.ip.ipv4-subnetting',
    moduleId: 'ccna',
  },
  {
    term: 'NAT / PAT (Network Address Translation)',
    shortDef: 'Translates private RFC 1918 LAN addresses into routable public IPv4 addresses.',
    fullDef:
      'PAT (NAT Overload) maps thousands of internal hosts onto a single public outside IP using unique TCP/UDP source port numbers.',
    lessonId: 'ccna.core.svc.nat-pat',
    moduleId: 'ccna',
  },
  {
    term: 'Agentic AI (NetOps)',
    shortDef: 'Autonomous AI workflow that inspects telemetry, reasons step-by-step, and proposes actions.',
    fullDef:
      'On CCNA v2.0 (Domain 5.0), refers to AI assistants that analyze logs/show output and propose remediation plans—requiring network engineers to audit prompts, data classification, and verify proposed commands before trusting output.',
    lessonId: 'ccna.core.ops.ai-netops',
    moduleId: 'ccna',
  },

  // IT Support Model Lesson & Core Service Desk Terms
  {
    term: 'Tier 1 (L1 Support)',
    shortDef: 'Frontline help desk handling intake, triage, priority, and standard resolutions.',
    fullDef:
      'The primary point of contact for users via phone, chat, or ticket portal. Responsible for empathetic communication, identity verification, Priority assignment, troubleshooting documented workstation/account issues, and gathering evidence for escalations.',
    lessonId: 'itsup.0.1.1',
    moduleId: 'it-support',
  },
  {
    term: 'Tier 2 (L2 Support)',
    shortDef: 'Escalation specialists handling deeper OS, AD/GPO, endpoint, and network tickets.',
    fullDef:
      'Handles complex troubleshooting beyond Tier 1 runbooks or permissions—such as Group Policy debugging, VPN/firewall ACL checks, Intune policy fixes, and multi-device hardware patterns.',
    lessonId: 'itsup.0.1.1',
    moduleId: 'it-support',
  },
  {
    term: 'Tier 3 (L3 Support)',
    shortDef: 'Subject-matter architects and vendor engineering for root infrastructure faults.',
    fullDef:
      'Senior network engineers, cloud/identity architects, database administrators, and third-party vendor support resolving core outages, code bugs, or architectural design changes.',
    lessonId: 'itsup.0.1.1',
    moduleId: 'it-support',
  },
  {
    term: 'First Contact Resolution (FCR)',
    shortDef: 'Percentage of tickets resolved accurately during the initial support interaction.',
    fullDef:
      'A core help desk KPI measuring how often Tier 1 resolves a user’s issue on the first touch without needing callbacks or escalations—balanced against accuracy so issues do not bounce back.',
    lessonId: 'itsup.core.itsm.itil4-metrics',
    moduleId: 'it-support',
  },
  {
    term: 'Priority Matrix (Impact × Urgency)',
    shortDef: 'ITSM formula combining blast radius (Impact) and time sensitivity (Urgency).',
    fullDef:
      'Standard ITIL method for assigning SLA priority (P1–P4) objectively rather than reacting to whoever shouts loudest.',
    lessonId: 'itsup.0.1.1',
    moduleId: 'it-support',
  },
  {
    term: 'Warm Escalation',
    shortDef: 'Handing a ticket to Tier 2 with full diagnostics, error text, and steps already tried.',
    fullDef:
      'Contrast with a cold transfer: a warm escalation includes confirmed scope, hostname, exact error messages, user availability, and every L1 test already eliminated.',
    lessonId: 'itsup.0.1.1',
    moduleId: 'it-support',
  },
  {
    term: 'Work Notes vs Additional Comments',
    shortDef: 'ServiceNow audience split: Work Notes stay internal; Additional Comments reach the caller.',
    fullDef:
      'Mirrors Internal Note vs Reply to Customer in Jira Service Management (JSM), Zendesk, and Freshservice—critical for keeping internal diagnostics private.',
    lessonId: 'itsup.core.tools.servicenow',
    moduleId: 'it-support',
  },
  {
    term: 'Request Type vs Queue (JSM)',
    shortDef: 'Customer-friendly portal form (Request Type) feeding an agent worklist (Queue).',
    fullDef:
      'In Jira Service Management, end users submit portal Request Types that create work items filtered by JQL inside agent Queues.',
    lessonId: 'itsup.core.tools.jsm',
    moduleId: 'it-support',
  },
  {
    term: 'Event ID 4740',
    shortDef: 'Windows Security log event recorded on a Domain Controller when an AD account locks.',
    fullDef:
      'Crucial L1/L2 triage event showing which user locked out and the "Caller Computer Name" (source workstation or gateway) sending failed password attempts.',
    lessonId: 'itsup.0.1.1',
    moduleId: 'it-support',
  },
  {
    term: 'BitLocker Recovery Key',
    shortDef: '48-digit key protecting encrypted Windows OS drives upon hardware or BIOS changes.',
    fullDef:
      'Stored in Entra ID, AD, or Intune; released ONLY after strict out-of-band identity verification so stolen drives stay unreadable.',
    lessonId: 'itsup.core.sec.containment-bitlocker',
    moduleId: 'it-support',
  },
  {
    term: 'Service Level Agreement (SLA)',
    shortDef: 'Contractual target times for first response and full incident resolution.',
    fullDef:
      'Defines measurable response and resolution windows tied to Priority (e.g., P1: 15m response / 2h resolve; P3: 2h response / 8h resolve).',
    lessonId: 'itsup.core.itsm.itil4-metrics',
    moduleId: 'it-support',
  },
  {
    term: 'ARP (Address Resolution Protocol)',
    shortDef: 'Resolves a local-link IPv4 address into its 48-bit Ethernet MAC address.',
    fullDef:
      'Uses Layer 2 broadcast requests (`FFFF.FFFF.FFFF`) and unicast replies; hosts ARP only for same-subnet peers or their Default Gateway.',
    lessonId: 'ccna.core.0.5',
    moduleId: 'shared',
  },
  {
    term: 'DNS (Domain Name System)',
    shortDef: 'Translates human hostnames into IP addresses over UDP/TCP port 53.',
    fullDef:
      'Core record types include `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `MX` (mail), `NS` (authority), and `PTR` (reverse IP lookup).',
    lessonId: 'ccna.core.svc.dns',
    moduleId: 'shared',
  },
  {
    term: 'APIPA (169.254.0.0/16)',
    shortDef: 'Fallback link-local IPv4 address assigned when DHCP discovery receives no response.',
    fullDef:
      'Automatic Private IP Addressing indicates a host’s NIC is physically connected (or attempting Wi-Fi) but never received a DHCP Offer—check VLAN, DHCP server pool, or `ip helper-address` relay.',
    lessonId: 'ccna.core.svc.dhcpv4',
    moduleId: 'shared',
  },
];
