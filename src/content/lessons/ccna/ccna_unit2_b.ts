import { DeepLessonDocument } from '../../../types/curriculum';

export const CCNA_UNIT2_B_LESSONS: Record<string, DeepLessonDocument> = {
  'ccna.core.sw.cdp-lldp': {
    id: 'ccna.core.sw.cdp-lldp',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Switching and Network Access',
    topicTitle: '2.3 Validate Documentation with CDP & LLDP',
    code: '2.3.1',
    title: 'Auditing Physical/Logical Topologies Using CDP & LLDP',
    readMinutes: 10,
    prerequisites: ['2.1.1'],
    versionScope: 'shared',
    v11ExamTopics: ['2.3'],
    v20ExamTopics: ['2.3'],

    learningObjectives: [
      'Explain how Layer 2 discovery protocols (Cisco-proprietary CDP and IEEE 802.1AB LLDP) advertise neighbor hostnames, ports, capabilities, and management IPs directly over local links.',
      'Compare CDP (default ON on Cisco, 60s timer / 180s holdtime) vs. LLDP (vendor-neutral, default OFF on many older IOS releases, 30s timer / 120s holdtime).',
      'Reconstruct an undocumented wiring closet diagram from `show cdp neighbors detail` and `show lldp neighbors detail`.',
      'Harden security by disabling CDP/LLDP (`no cdp enable`, `no lldp transmit`) on untrusted WAN or public-facing edge ports.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Mapping an Unlabeled Wiring Closet Without Tracing Cables by Hand',
      narrative:
        'You walk into an inherited branch office with zero cable labels and a tangle of 40 patch cords. Before unplugging anything or trusting an outdated spreadsheet from 2021, you SSH into Core-SW1 and run `show cdp neighbors detail` and `show lldp neighbors detail`. Instantly you see every neighboring Cisco switch, VoIP phone, Arista/Juniper switch, and Wireless AP—complete with exact port pairings, management IPs, and Native VLAN alerts—allowing you to validate documentation cleanly in two minutes.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Devices Introducing Themselves Across Every Direct Cable With Name Badges',
      analogy:
        'Every time two directly cabled switches, routers, or IP phones connect, **CDP** and **LLDP** act like polite neighbors leaning over the fence every 30–60 seconds to swap business cards: `"Hi, I’m SW-Floor2, you’re plugged into my Gi0/24, my management IP is 10.10.99.12, and I’m a Catalyst Switch!"` Because these Layer 2 frames stay strictly on that one wire (routers never forward them!), you see **only your direct physical neighbors**—which is exact truth for checking wiring diagrams. Just remember NOT to hand your business card out the front gate facing the ISP or public lobby jacks (`no cdp enable`!).',
      technicalDefinition:
        'CDP (Cisco Discovery Protocol) and LLDP (IEEE 802.1AB Link Layer Discovery Protocol) operate strictly at Layer 2 using link-local multicast MAC addresses (`01:00:0c:cc:cc:cc` for CDP; `01:80:c2:00:00:0e` for LLDP) to share Device ID, Local/Remote Port IDs, Management IPs, Capabilities, Platform, and Native VLAN / Voice VLAN TLVs.',
      paragraphs: [
        'Use **CDP** across Cisco-only equipment (enabled by default globally on most IOS platforms; broadcasts every **60s**, holds entries for **180s**). Use **LLDP** in multi-vendor networks (HP/Aruba, Juniper, Palo Alto, Linux servers, non-Cisco VoIP phones)—enable globally with **`lldp run`** (hello **30s**, holdtime **120s**), and toggle per-port with `lldp transmit` / `lldp receive`.',
        'Notice the difference between `show cdp neighbors` (one-line summary showing Device ID, Local Interface, Holdtime, Capability, Platform, Remote Port ID) and **`show cdp neighbors detail`** (adds the peer’s **Management IP address**, **IOS version**, and **Native VLAN**!).',
        'From a security perspective, CDP/LLDP leaks hardware model, OS version, and management IPs to anyone sniffing a port—so always disable them on untrusted ISP WAN links (`no cdp enable`, `no lldp transmit`, `no lldp receive`) or public guest ports.',
      ],
    },

    deepDive: {
      intro: 'Compare CDP vs. LLDP defaults and learn how to read every column of `show cdp neighbors`.',
      steps: [
        {
          step: 'CDP Defaults',
          title: 'Cisco Proprietary · Multicast `01:00:0c:cc:cc:cc`',
          explanation: 'Default ON. Timer: `60s`, Holdtime: `180s`. Disable globally (`no cdp run`) or per-interface (`no cdp enable`).',
        },
        {
          step: 'LLDP Defaults',
          title: 'Open Standard IEEE 802.1AB · Multicast `01:80:c2:00:00:0e`',
          explanation: 'Often disabled by default on older IOS; enable globally via `lldp run`. Timer: `30s`, Holdtime: `120s`. Supports granular `lldp transmit` / `lldp receive` per port.',
        },
        {
          step: 'Reading Output',
          title: 'Local Intrfce vs. Port ID',
          explanation: '`Local Intrfce` is YOUR port on this switch; `Port ID` on the far right is the NEIGHBOR’S port! Capability codes: `R`=Router, `S`=Switch, `B`=Bridge, `H`=Host/Phone.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Link-Local Discovery Boundaries & CDP Output Mapping',
        asciiFallback: `[SW1] (Gi0/24) <====== Layer 2 Link Only ======> (Gi0/1) [R1]
  CDP/LLDP frames NEVER cross R1 out onto Gi0/0!
  On SW1: Local Intrfce = Gi0/24  |  Device ID = R1  |  Port ID = Gi0/1`,
      },
      workedExample: {
        title: 'Catching a Miswired Diagram & Mismatched IP Using `detail`',
        context:
          'Your documentation claims `SW1 Gi0/24` connects to `R1 Gi0/0` (`10.1.1.1`), yet `ping 10.1.1.1` fails.',
        steps: [
          'Run `show cdp neighbors detail` on SW1.',
          'Output reveals `Gi0/24` actually connects to `R1 Port ID: GigabitEthernet0/1`, whose management IP is `10.1.2.1` (someone swapped cables at the rack)!',
          'Update either the physical cable back to `R1 Gi0/0` or update the wiring diagram + subnet.',
        ],
        outcome: 'Physical topology verified objectively in 10 seconds without walking across buildings.',
      },
    },

    iosCliGuide: {
      intro: 'Enable LLDP globally, inspect CDP/LLDP tables, and disable discovery on ISP links.',
      commands: [
        {
          title: '1. Inspect Summary & Detail Discovery Tables',
          promptAndCommand: 'SW1# show cdp neighbors',
          output: `Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R1.corp.local    Gig 0/24          154              R B   ISR4331   Gig 0/0/0
SW2.corp.local   Gig 0/23          142             S I    WS-C2960  Gig 0/1`,
          lineByLine: [
            { segment: 'Local Intrfce (Gig 0/24)', meaning: 'Port on SW1 where the cable is plugged.' },
            { segment: 'Capability (R / S)', meaning: '`R` = Router, `S` = Switch, `I` = IGMP.' },
            { segment: 'Port ID (Gig 0/0/0)', meaning: 'Exact physical interface on remote neighbor R1.' },
          ],
        },
        {
          title: '2. Enable Vendor-Neutral LLDP & Disable on Untrusted WAN Port',
          promptAndCommand: 'SW1(config)# lldp run',
          output: `SW1(config)# interface GigabitEthernet0/10
SW1(config-if)# no cdp enable
SW1(config-if)# no lldp transmit
SW1(config-if)# no lldp receive`,
          lineByLine: [
            { segment: 'lldp run', meaning: 'Activates IEEE 802.1AB LLDP globally on the switch.' },
            { segment: 'no cdp enable / no lldp transmit', meaning: 'Stops leaking internal hostnames, IOS versions, and IPs out an untrusted edge port.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show lldp neighbors',
        healthyLabel: 'Multi-Vendor Neighbor Visible After `lldp run`',
        healthyOutput: `Device ID           Local Intf     Hold-time  Capability      Port ID
ARUBA-SW2           Gi0/22         120        B,R             1/1/48`,
        brokenLabel: 'LLDP Disabled Globally',
        brokenOutput: `% LLDP is not enabled`,
        diagnosis:
          'When non-Cisco switches or third-party VoIP phones do not appear in `show cdp neighbors`, enable `lldp run` globally and verify `show lldp neighbors`.',
      },
    },

    commonTraps: [
      {
        trap: 'Expecting `show cdp neighbors` to show devices two or three hops away.',
        reality: 'CDP and LLDP operate strictly link-local at Layer 2—routers drop them without forwarding.',
      },
      {
        trap: 'Mixing up `Local Intrfce` and `Port ID`.',
        reality: '`Local Intrfce` is YOUR port; `Port ID` (last column) is the NEIGHBOR’S port.',
      },
      {
        trap: 'Thinking `show cdp neighbors` shows neighbor IP addresses.',
        reality: 'Only `show cdp neighbors detail` (or `show lldp neighbors detail`) prints the peer’s IP address and OS version.',
      },
      {
        trap: 'Leaving CDP/LLDP running on internet-facing ISP interfaces.',
        reality: 'Disable discovery (`no cdp enable`, `no lldp transmit`) on untrusted external/guest links.',
      },
    ],

    keyTerms: [
      {
        term: 'CDP (Cisco Discovery Protocol)',
        shortDef: 'Cisco-proprietary Layer 2 neighbor discovery protocol (60s hello / 180s hold).',
        fullDef: 'Enabled by default on Cisco IOS devices to advertise device IDs, ports, capabilities, native VLAN, and management IPs.',
      },
      {
        term: 'LLDP (IEEE 802.1AB)',
        shortDef: 'Vendor-neutral open-standard Layer 2 discovery protocol (30s hello / 120s hold).',
        fullDef: 'Activated globally on Cisco IOS with `lldp run` to discover multi-vendor switches, servers, and VoIP phones.',
      },
    ],

    checkQuestions: [
      {
        id: 'c23-q1',
        prompt: 'You connect a Cisco Catalyst switch to an Aruba switch over `Gi0/12`. Why does `show cdp neighbors` show nothing, and how do you discover the Aruba port ID?',
        options: [
          'CDP is Cisco-proprietary; enable vendor-neutral LLDP (`lldp run`) and run `show lldp neighbors`.',
          'Routers block Layer 2 switches across the same cable.',
          'Run `show cdp neighbors detail` twice.',
          'Configure OSPF on `Gi0/12`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Non-Cisco switches do not speak CDP; enabling `lldp run` discovers IEEE 802.1AB LLDP neighbors cleanly.',
          'Incorrect: Direct switch-to-switch links pass Layer 2 discovery unless disabled.',
          'Incorrect: Aruba won’t reply to CDP regardless of `detail`.',
          'Incorrect: OSPF is Layer 3 routing.',
        ],
        takeaway: 'Use LLDP (`lldp run`) in multi-vendor environments.',
      },
      {
        id: 'c23-q2',
        prompt: 'Which command displays the remote neighbor’s **IP address**, **IOS version**, and **Native VLAN** via CDP?',
        options: [
          'show cdp neighbors detail',
          'show cdp neighbors',
          'show cdp interface',
          'show ip arp',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Adding `detail` reveals management IP addresses, software version, and Native VLAN.',
          'Incorrect: Summary view omits IP addresses and software strings.',
          'Incorrect: Shows local timer intervals per port.',
          'Incorrect: Shows local ARP IP-to-MAC mappings only.',
        ],
        takeaway: '`show cdp neighbors detail` shows peer IPs and OS versions.',
      },
      {
        id: 'c23-q3',
        prompt: 'Why should security engineers disable CDP and LLDP on an internet-facing router port (`Gi0/0`)?',
        options: [
          'To prevent leaking internal hostnames, OS software versions, and management IPs to untrusted external networks',
          'Because CDP stops packets larger than 64 bytes',
          'Because ISP fiber cables burn out if CDP runs',
          'Because LLDP disables NAT overload',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Discovery frames expose reconnaissance metadata (device model, IOS version, IP); harden untrusted edges with `no cdp enable` / `no lldp transmit`.',
          'Incorrect: CDP frames do not block data plane MTU.',
          'Incorrect: Pure software recon concern.',
          'Incorrect: Unrelated to NAT.',
        ],
        takeaway: 'Disable CDP/LLDP (`no cdp enable`, `no lldp transmit`) on untrusted edge/WAN links.',
      },
      {
        id: 'c23-q4',
        prompt: 'What are the default LLDP hello and holdtime timers on Cisco IOS?',
        options: ['30s hello / 120s holdtime', '60s hello / 180s holdtime', '10s hello / 40s dead', '2s hello / 20s max-age'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: LLDP defaults to 30s advertise interval and 120s holdtime (whereas CDP defaults to 60s / 180s).',
          'Incorrect: 60s / 180s are CDP defaults.',
          'Incorrect: 10s / 40s are OSPFv2 Ethernet defaults.',
          'Incorrect: 2s / 20s are STP BPDU defaults.',
        ],
        takeaway: 'CDP = 60/180s; LLDP = 30/120s.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Audit Topology Connections with CDP/LLDP in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Run `show cdp neighbors` and `show cdp neighbors detail` inside IOS Labs to verify neighbor port connections and IPs.',
      ],
      verificationCheck: 'Map every directly attached device and remote port ID accurately.',
    },

    summaryBullets: [
      'CDP (Cisco-proprietary, default ON, 60/180s) and LLDP (IEEE 802.1AB open standard, `lldp run`, 30/120s) discover direct Layer 2 neighbors.',
      '`show cdp neighbors detail` / `show lldp neighbors detail` reveals neighbor IPs, IOS versions, and Native VLANs.',
      'Discovery frames never cross routers—making them ideal ground truth for physical wiring documentation.',
      '`Local Intrfce` = your port; `Port ID` = neighbor’s port.',
      'Disable CDP/LLDP on untrusted WAN or public-facing ports to prevent information leakage.',
    ],

    sourcesToVerify: [
      'Cisco IOS Network Management Guide — Configuring CDP and LLDP (IEEE 802.1AB)',
    ],
  },

  'ccna.v2.2.4': {
    id: 'ccna.v2.2.4',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Switching and Network Access',
    topicTitle: '2.4 Troubleshoot L2/L3 Connectivity',
    code: '2.4.1',
    title: 'Isolating L2/L3 Outages with show Commands, Logs, Extended Ping, Traceroute & Captures',
    readMinutes: 14,
    prerequisites: ['2.1.1', '2.3.1'],
    versionScope: 'v2.0-only',
    v20ExamTopics: ['2.4'],

    learningObjectives: [
      'Select the right IOS/client verification tool (`show` commands, `show logging`, extended `ping`, `traceroute`, and packet captures/SPAN) for any L2/L3 outage.',
      'Use **Extended Ping** (`ping <dest> source <interface>`) to test return routing and VLAN-to-VLAN reachability accurately.',
      'Interpret `traceroute` hops, `* * *` timeouts, and asymmetric path drops.',
      'Capture packets safely using Switched Port Analyzer (`SPAN`) or IOS Embedded Packet Capture (`EPC`) without overloading switch CPUs.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why a Plain `ping` From Router R1 Passes Even When Branch Users Are Completely Down',
      narrative:
        'Suppose R1 can `ping 10.50.1.10` cleanly from the CLI—yet every user in VLAN 20 (`10.20.20.0/24`) fails! Why? Because a plain router `ping` sources from R1’s closest WAN exit interface (`172.16.0.1`), which the remote server knows how to reach, whereas `10.20.20.0/24` was forgotten in OSPF or NAT! Running **Extended Ping (`ping 10.50.1.10 source Gi0/1`)** tests the *exact user subnet*, exposing return-path routing and ACL bugs instantly.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Tracing a Package With Checkpoints, Security Logs & a Wiretap Camera',
      analogy:
        'When deliveries vanish between cities, you don’t just throw another empty box down the chute. First you check the **checkpoint logs (`show logging`)** to see if a port flapped or an ACL dropped something. Next, you mail a test parcel stamped with the **customer’s real return address (`Extended Ping` with `source`)** instead of the post office’s address so you test the return road too! Then **`traceroute`** sends parcels stamped `Expire after 1 hop, 2 hops, 3 hops` so every router along the path signs a receipt—revealing the exact hop where packets disappear. Finally, **Packet Capture (SPAN / Wireshark)** acts like a transparent security camera copying real traffic onto an analyzer port without stopping live service.',
      technicalDefinition:
        'Structured L2/L3 fault isolation combines control/data-plane `show` inspection, buffered syslog correlation (`show logging`), source-specific `extended ping` and TTL-incrementing `traceroute` probes, and non-disruptive frame mirroring (`SPAN`/`RSPAN`) or Embedded Packet Capture.',
      paragraphs: [
        'Always start with **`show logging`** and **`show ip interface brief` / `show interfaces status`**: buffered logs immediately reveal `%CDP-4-NATIVE_VLAN_MISMATCH`, `%LINK-3-UPDOWN`, `%SPANTREE-2-BLOCK_BPDUGUARD`, or `%OSPF-5-ADJCHG` state drops.',
        'Master **Extended Ping** (`ping` at Privileged EXEC `#` without arguments enters interactive mode, or inline `ping 10.50.1.10 source 10.20.20.1`). Specifying `source` proves whether **both** forward routing AND reverse return routing + firewall ACLs work for that LAN subnet. Decode Cisco ping result symbols instantly: **`!`** = Echo Reply received (success), **`.`** = Timeout (no reply within 2s), **`U`** = Destination Unreachable (no route or ACL drop), **`N`** = Network Unreachable, **`M`** = Could not fragment (`df-bit` exceeded path MTU!). Meanwhile, standard Cisco IOS `traceroute` sends **UDP probes starting at port 33434** with TTL=1, 2, 3..., receiving ICMP `Time Exceeded` at each hop and `Port Unreachable` at the final host (Windows `tracert` uses ICMP Echo instead).',
        'When pings and logs aren’t enough—for instance, suspecting a silent DHCP NAK, missing 802.1Q tag, or TLS handshake reset—use **SPAN (`monitor session 1 source ...` / `destination interface ...`)** on a Catalyst switch to mirror live frames into a laptop running Wireshark, then apply **Wireshark display filters** such as `ip.addr == 10.1.1.5`, `tcp.port == 443`, `arp`, `bootp || dhcp`, or `icmp` to isolate the exact flow.',
      ],
    },

    deepDive: {
      intro: 'Follow the 5-tool CCNA v2.0 2.4 troubleshooting toolkit from fastest CLI check to packet capture.',
      steps: [
        {
          step: 'Tool 1: Show & Logs',
          title: 'Correlate Interface, VLAN, STP & Syslog Evidence',
          explanation: '`show logging` + `show ip int br` + `show interfaces trunk` + `show mac address-table` + `show ip route`. Always check timestamps in logs!',
        },
        {
          step: 'Tool 2: Extended Ping',
          title: 'Test Exact Source Subnet & MTU (`df-bit`)',
          explanation: '`ping 10.99.1.10 source Vlan20 size 1500 df-bit` tests BOTH return routing for VLAN 20 AND whether an unfragmented 1500-byte frame crosses tunnels intact!',
        },
        {
          step: 'Tool 3: Traceroute',
          title: 'Isolate Exact Hop Drop (`* * *`) or Routing Loop',
          explanation: 'If Hop 1 and Hop 2 reply and Hop 3 prints `* * *`, inspect Hop 2’s routing table AND Hop 3’s return path / ACLs. Repeating Hop A -> Hop B -> Hop A signals a routing loop!',
        },
        {
          step: 'Tool 4: Packet Captures (SPAN / EPC)',
          title: 'Verify Real Wire Headers (802.1Q, TCP SYN, DHCP)',
          explanation: '`monitor session 1 source interface Gi1/0/1` + `monitor session 1 destination interface Gi1/0/24` mirrors Rx+Tx traffic cleanly to your Wireshark port (`Gi1/0/24` stops normal forwarding while acting as destination!).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Extended Ping Return-Path Check & SPAN Mirroring Architecture',
        asciiFallback: `EXTENDED PING:
  [R1 Vlan20: 10.20.20.1] -- Src=10.20.20.1 --> [R2] --> [Server 10.50.1.10]
  Tests BOTH forward path AND whether Server/R2 know route back to 10.20.20.0/24!

SWITCH SPAN CAPTURE:
  [Target Port Gi1/0/1] ===(Normal Traffic)===> [Uplink Gi1/0/24]
         | (ASIC hardware copy, zero delay)
         v
  [SPAN Dest Gi1/0/12] ---> [Laptop / Wireshark Analyzer]`,
      },
      workedExample: {
        title: 'Solving Asymmetric Drop With Extended Ping & Traceroute',
        context:
          'Users in VLAN 20 (`10.20.20.0/24`) cannot reach Data Center server `10.99.1.50`. From R1, plain `ping 10.99.1.50` prints `!!!!!`.',
        steps: [
          'Run `ping 10.99.1.50 source 10.20.20.1` on R1 -> `.....` (0% success!).',
          'Run `traceroute 10.99.1.50 source 10.20.20.1`: reaches R2 (`172.16.0.2`), then `* * *`.',
          'Log into R2 and run `show ip route 10.20.20.0`: `% Subnet not in table`! R1 forgot to advertise `10.20.20.0/24` into OSPF, so R2 dropped the return replies.',
        ],
        outcome: 'Extended ping with `source` caught the missing return route in 15 seconds.',
      },
    },

    iosCliGuide: {
      intro: 'Run extended ping tests, buffered log inspections, and SPAN port mirroring safely.',
      commands: [
        {
          title: '1. Extended Ping With Source & DF-Bit MTU Test',
          promptAndCommand: 'R1# ping 10.99.1.50 source 10.20.20.1 size 1500 df-bit',
          output: `Type escape sequence to abort.
Sending 5, 1500-byte ICMP Echos to 10.99.1.50, timeout is 2 seconds:
Packet sent with a source address of 10.20.20.1
Packet sent with the DF bit set
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 2/3/4 ms`,
          lineByLine: [
            { segment: 'source 10.20.20.1', meaning: 'Simulates a real VLAN 20 client IP rather than the router’s outbound WAN IP.' },
            { segment: 'size 1500 df-bit', meaning: 'Verifies end-to-end 1500-byte MTU without silent tunnel fragmentation drops.' },
          ],
        },
        {
          title: '2. Configure Local SPAN Session for Packet Capture',
          promptAndCommand: 'SW1(config)# monitor session 1 source interface Gi1/0/5',
          output: `SW1(config)# monitor session 1 destination interface Gi1/0/24`,
          lineByLine: [
            { segment: 'source interface Gi1/0/5', meaning: 'Mirrors both Rx and Tx frames of target port `Gi1/0/5`.' },
            { segment: 'destination interface Gi1/0/24', meaning: 'Connects to Wireshark analyzer (do NOT plug normal users here—it no longer forwards normal traffic!).' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'traceroute 10.99.1.50 source 10.20.20.1',
        healthyLabel: 'Clean Hop-by-Hop Progression to Destination',
        healthyOutput: `  1 172.16.0.2 1 msec 1 msec 1 msec
  2 10.99.1.50 2 msec 2 msec 2 msec`,
        brokenLabel: 'TTL Loop Between Two Misconfigured Static Routes',
        brokenOutput: `  1 172.16.0.2 1 msec 1 msec 1 msec
  2 172.16.0.1 2 msec 1 msec 2 msec
  3 172.16.0.2 2 msec 2 msec 2 msec`,
        diagnosis:
          'Repeating alternating hops in `traceroute` confirms a Layer 3 routing loop—check conflicting static default routes between R1 and R2.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming a plain router `ping <dest>` proves end-user VLANs can reach `<dest>`.',
        reality: 'Plain ping sources from the closest outbound WAN interface—always test `ping <dest> source <LAN-SVI/IP>`.',
      },
      {
        trap: 'Panicking when ONE middle hop in `traceroute` prints `* * *` even though later hops reach the target cleanly.',
        reality: 'If Hop 3 shows `* * *` yet Hop 4 and final destination reply cleanly, Hop 3 simply rate-limits or blocks ICMP Time Exceeded generation—transit forwarding is healthy!',
      },
      {
        trap: 'Plugging a production server or uplink into a SPAN `destination interface`.',
        reality: 'A SPAN destination port stops participating in normal L2 switching/CDP/STP by default and acts strictly as a monitor output.',
      },
      {
        trap: 'Running heavy `debug ip packet` on a busy production router without an ACL.',
        reality: 'Unfiltered `debug` floods the CPU and can crash a router—use `show logging`, `SPAN`, or ACL-filtered debugging instead.',
      },
    ],

    keyTerms: [
      {
        term: 'Extended Ping',
        shortDef: 'IOS ping allowing custom source IP/interface, packet size, repeat count, and DF-bit.',
        fullDef: 'Essential for verifying return routing from specific LAN subnets and testing end-to-end Path MTU.',
      },
      {
        term: 'SPAN (Switched Port Analyzer)',
        shortDef: 'Cisco Catalyst port mirroring sending copies of frames from source ports/VLANs to an analyzer.',
        fullDef: 'Allows live Wireshark packet capture with zero impact on hardware-switched forwarding.',
      },
      {
        term: 'Traceroute',
        shortDef: 'TTL-incrementing path probe revealing every Layer 3 hop between source and destination.',
        fullDef: 'Cisco IOS uses UDP probes (`33434+`); Windows `tracert` uses ICMP Echo Requests.',
      },
    ],

    checkQuestions: [
      {
        id: 'v2-24-q1',
        prompt: 'A plain `ping 10.80.1.10` from R1’s CLI succeeds, yet hosts on R1’s LAN (`192.168.50.0/24` on `Gi0/1`) get zero reply. Which command best tests whether return routing works for the LAN?',
        options: [
          'ping 10.80.1.10 source 192.168.50.1',
          'ping 127.0.0.1',
          'show cdp neighbors',
          'monitor session 1',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Sourcing the ping from `192.168.50.1` tests whether downstream routers/firewalls allow AND route traffic back to `192.168.50.0/24`.',
          'Incorrect: Tests local stack only.',
          'Incorrect: Shows L2 directly connected Cisco neighbors only.',
          'Incorrect: Configures SPAN mirroring rather than testing return routing.',
        ],
        takeaway: 'Use `ping <dest> source <LAN-IP>` to isolate missing return routes and source-based ACLs.',
      },
      {
        id: 'v2-24-q2',
        prompt: 'During a `traceroute` to a cloud endpoint, Hop 3 displays `* * *`, while Hops 4, 5, and the final destination reply with low 12ms latency. What does `* * *` at Hop 3 indicate?',
        options: [
          'Hop 3 simply ignores/blocks generating ICMP Time Exceeded replies while still forwarding transit packets normally.',
          'The fiber cable at Hop 3 is unplugged.',
          'There is a Layer 2 switching storm at Hop 3.',
          'DNS failed at Hop 3.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Intermediate ISP/firewall hops frequently deprioritize or filter control-plane ICMP Time Exceeded replies while still forwarding data-plane traffic.',
          'Incorrect: Unplugged cable would kill Hops 4, 5, and destination.',
          'Incorrect: Switching storm breaks downstream hops.',
          'Incorrect: Traceroute tests numeric IP hops.',
        ],
        takeaway: '`* * *` at a middle hop with clean replies afterward = ICMP control-plane rate-limiting, NOT an outage.',
      },
      {
        id: 'v2-24-q3',
        prompt: 'An engineer wants to capture packets entering switch port `Gi1/0/3` onto a Wireshark laptop plugged into `Gi1/0/20`. Which technology copies frames cleanly without breaking `Gi1/0/3` forwarding?',
        options: [
          'Local SPAN (`monitor session 1 source int Gi1/0/3` / `destination int Gi1/0/20`)',
          'PortFast + BPDU Guard',
          'DHCP Snooping',
          'LACP EtherChannel',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SPAN copies frames in ASIC hardware to the monitoring destination interface.',
          'Incorrect: STP features.',
          'Incorrect: L2 security feature.',
          'Incorrect: Link bundling protocol.',
        ],
        takeaway: 'Use SPAN (`monitor session`) to mirror switch traffic cleanly to a packet analyzer.',
      },
      {
        id: 'v2-24-q4',
        prompt: 'Which `traceroute` output pattern signals an active Layer 3 routing loop between two routers?',
        options: [
          'Two router IPs alternating repeatedly across increasing hop numbers (A -> B -> A -> B)',
          'All hops replying once cleanly in 1ms',
          'First hop timing out and zero replies afterward',
          'Immediate `U` (Unreachable) at hop 1',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Packets bouncing back and forth between A and B decrement TTL at each hop until TTL expires, showing A -> B -> A -> B.',
          'Incorrect: Normal healthy path.',
          'Incorrect: Path drop after hop 1.',
          'Incorrect: No route / host unreachable.',
        ],
        takeaway: 'Alternating hop pairs in `traceroute` = Layer 3 routing loop.',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Isolate & Fix Broken L2/L3 Paths in IOS Labs',
      targetTab: 'labs',
      instructions: [
        'Use `show ip int br`, `show interfaces trunk`, `show ip route`, and `ping` inside IOS Labs 03–06 to practice end-to-end fault isolation.',
      ],
      verificationCheck: 'Pinpoint broken VLAN, trunk, passive interface, or ACL rules using CLI diagnostics.',
    },

    summaryBullets: [
      'Start L2/L3 triage with `show logging`, `show ip interface brief`, `show interfaces status`, and `show mac address-table`.',
      'Always use **Extended Ping (`source` + optional `size`/`df-bit`)** to validate user VLAN return paths and MTU.',
      'Cisco `traceroute` uses UDP `33434+` with incrementing TTL; `* * *` mid-path with healthy final hops is just ICMP filtering, whereas `A -> B -> A -> B` reveals a routing loop.',
      'Use **SPAN (`monitor session`)** to mirror live traffic safely to Wireshark without touching production data flow.',
      'Avoid unfiltered `debug` commands on busy production routers.',
    ],

    sourcesToVerify: [
      'CCNA 200-301 v2.0 Topic 2.4 & Cisco Catalyst SPAN Configuration Guide',
    ],
  },

  'ccna.v11.2.6': {
    id: 'ccna.v11.2.6',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Network Access (Wireless)',
    topicTitle: '2.6–2.7 Wireless Architectures & AP Modes',
    code: '2.6.1',
    title: 'Split-MAC Architecture, CAPWAP Tunnels & AP Modes (Local, FlexConnect)',
    readMinutes: 12,
    prerequisites: ['1.11.1', '2.2.1'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['2.6', '2.7'],

    learningObjectives: [
      'Explain Cisco **Split-MAC** architecture dividing real-time RF duties (AP) from management/control duties (WLC).',
      'Identify the two **CAPWAP** UDP tunnels between Lightweight APs and a WLC: Control (`UDP 5246`, DTLS encrypted) and Data (`UDP 5247`).',
      'Compare Cisco wireless deployment models: Autonomous, Centralized WLC, Embedded, and Cloud-managed (Meraki).',
      'Distinguish AP modes—especially **Local Mode** (tunnels all client traffic to WLC) vs. **FlexConnect** (switches local branch VLANs locally if WAN fails)—plus Monitor, Sniffer, and Rogue Detector.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Branch Office Wi-Fi Goes Down When the WAN Drops—Unless FlexConnect Is Enabled',
      narrative:
        'A company puts Lightweight APs at a remote retail branch managed by a central WLC back at HQ. Everything works—until the branch WAN ISP line drops for 20 minutes. Even though the local printer and point-of-sale server sit right inside the branch store, every Wi-Fi tablet freezes completely because **Local Mode** APs tunnel 100% of client traffic via CAPWAP up to HQ and back! Switching those branch APs to **FlexConnect** keeps local branch traffic switching locally even when the WAN goes offline.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Store Cashiers Calling HQ vs. Local Branch Autonomy',
      analogy:
        'In Cisco **Split-MAC**, an **Access Point** handles fast split-second RF radio handshakes (beacons, ACKs, encryption), while the central **WLC** handles policies, security authentication, roaming, and channel tuning—connected over two **CAPWAP** tunnels (**Control UDP 5246** for orders/stats, **Data UDP 5247** for user traffic). In **Local Mode**, every branch letter goes up the Data tunnel to HQ before returning; in **FlexConnect Mode**, the AP stays managed by HQ yet drops local branch mail straight into the branch switch locally—even if the HQ highway washes out!',
      technicalDefinition:
        'Cisco Unified Wireless Split-MAC architecture splits 802.11 functions across Lightweight APs (real-time MAC) and a WLC (management/control MAC) linked over CAPWAP Control (`UDP 5246`) and Data (`UDP 5247`) tunnels; AP operational modes include Local (centralized switching), FlexConnect (local switching + WAN survivability), Monitor, Rogue Detector, and Sniffer.',
      paragraphs: [
        'Remember both CAPWAP ports cleanly: **UDP 5246** = CAPWAP **Control** (always DTLS encrypted for AP join, config, stats), and **UDP 5247** = CAPWAP **Data** (carries tunneled wireless client frames; DTLS optional). Notice this means a **Local Mode** AP only needs a simple **access switch port** in the AP management VLAN because every client SSID VLAN is wrapped inside CAPWAP back to the WLC!',
        'By contrast, **FlexConnect (formerly H-REAP)** APs at remote branches switch selected SSIDs **locally** onto branch VLANs—meaning the switch port connected to a FlexConnect local-switching AP must normally be an **802.1Q trunk** carrying the AP management VLAN plus local client VLANs!',
        'Also recognize specialized non-client AP modes: **Monitor** (dedicated RF scanning for IDS/rogues/location—serves zero clients), **Sniffer** (captures raw 802.11 RF frames and streams to Wireshark/Omnipeek), and **Rogue Detector** (sits on wired trunks listening for ARP/MACs matching rogue wireless sightings).',
      ],
    },

    deepDive: {
      intro: 'Compare Split-MAC duties, CAPWAP tunnels, and AP operational modes.',
      steps: [
        {
          step: 'Split-MAC',
          title: 'AP (Real-Time) vs WLC (Control/Management)',
          explanation: 'AP sends beacons, handles 802.11 ACKs, and encrypts frames; WLC handles 802.1X/AAA, roaming tables, RRM channels, and QoS policies.',
        },
        {
          step: 'CAPWAP Tunnels',
          title: 'UDP 5246 (Control) & UDP 5247 (Data)',
          explanation: 'AP discovers WLC (via DHCP Option 43, DNS `CISCO-CAPWAP-CONTROLLER`, or local broadcast), establishes DTLS Control tunnel (5246), then Data tunnel (5247).',
        },
        {
          step: 'Local vs FlexConnect',
          title: 'Central Switching vs Branch Switching',
          explanation: 'Local Mode = central switching at WLC (AP plugs into switch **access** port). FlexConnect = local switching at branch + survives WAN outage (AP plugs into **trunk** port).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'CAPWAP Split-MAC Tunnels & Local Mode vs. FlexConnect Switching',
        asciiFallback: `[AP: Local Mode] === CAPWAP Control (UDP 5246) + Data (UDP 5247) ===> [Central WLC]
  (Clients tunnel all traffic to HQ WLC; AP uses switch ACCESS port)

[AP: FlexConnect] --- Control (UDP 5246) ---> [HQ WLC]
       | (Local Switching: survives WAN outage!)
  [Branch Switch Trunk (VLAN 10, 20)]`,
      },
      workedExample: {
        title: 'Debugging Why a New Lightweight AP Fails to Join Its WLC',
        context: 'A newly mounted AP boots on VLAN 99 at a remote site, gets a DHCP IP, yet never shows up on the HQ WLC.',
        steps: [
          'Check firewall ACLs between remote site and HQ WLC: ensure **UDP 5246** and **UDP 5247** are permitted!',
          'Verify WLC discovery: without DHCP Option 43 or `CISCO-CAPWAP-CONTROLLER.<domain>` DNS A record, the AP cannot locate a remote Layer 3 WLC IP.',
          'Check NTP clock on WLC and AP: CAPWAP uses X.509 certificates inside DTLS—if the WLC clock is years off, certificate validation fails and the AP drops before joining!',
        ],
        outcome: 'Opening UDP 5246/5247, setting Option 43/DNS, and syncing NTP brings the AP online immediately.',
      },
    },

    iosCliGuide: {
      intro: 'Verify AP mode, CAPWAP join status, and FlexConnect configuration on WLC/IOS XE controllers.',
      commands: [
        {
          title: 'Inspect AP Operational Modes & CAPWAP Status',
          promptAndCommand: 'WLC# show ap summary',
          output: `AP Name         Slots  AP Model         Ethernet MAC       Location          Mode
AP-HQ-01        2      AIR-AP2802I      aabb.cc10.0001     HQ-Floor1         Local
AP-Branch-01    2      AIR-AP2802I      aabb.cc10.0020     Branch-East       FlexConnect`,
          lineByLine: [
            { segment: 'Mode: Local', meaning: 'All wireless traffic tunnels via CAPWAP UDP 5247 straight back to the WLC.' },
            { segment: 'Mode: FlexConnect', meaning: 'Supports local branch switching and continues authenticating/forwarding when WAN drops.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show ap config general AP-Branch-01',
        healthyLabel: 'FlexConnect Enabled With Local Switching',
        healthyOutput: `AP Mode : FlexConnect | FlexConnect Switching : Local`,
        brokenLabel: 'Remote Branch Left in Default Local Mode Over Slow/Unstable WAN',
        brokenOutput: `AP Mode : Local | All branch-to-branch Wi-Fi hairpins across WAN!`,
        diagnosis:
          'Switching remote branch APs to `FlexConnect` keeps local printer/file traffic on the branch LAN and keeps branch Wi-Fi alive during WAN outages.',
      },
    },

    commonTraps: [
      {
        trap: 'Swapping CAPWAP Control (`5246`) and Data (`5247`) port numbers or assuming they use TCP.',
        reality: 'Both CAPWAP Control (`5246`) and Data (`5247`) run over **UDP**.',
      },
      {
        trap: 'Thinking a **Monitor Mode** AP serves wireless clients while scanning for rogues.',
        reality: 'Monitor Mode APs spend 100% of radio time scanning channels for IDS/rogues/location and serve **zero clients**.',
      },
      {
        trap: 'Connecting a FlexConnect local-switching AP to a single-VLAN access switch port.',
        reality: 'Locally switched branch SSIDs need an **802.1Q trunk** to drop different SSIDs onto their local branch VLANs.',
      },
    ],

    keyTerms: [
      {
        term: 'Split-MAC',
        shortDef: 'Wireless architecture dividing real-time RF framing (AP) from central policy/control (WLC).',
        fullDef: 'Allows centralized zero-touch management across hundreds or thousands of lightweight APs.',
      },
      {
        term: 'CAPWAP',
        shortDef: 'Control and Provisioning of Wireless Access Points protocol (UDP 5246 Control / UDP 5247 Data).',
        fullDef: 'Encapsulates WLC-to-AP management (DTLS encrypted) and optionally client user frames.',
      },
      {
        term: 'FlexConnect',
        shortDef: 'Branch AP mode switching local SSID traffic directly onto branch VLANs with WAN survivability.',
        fullDef: 'Prevents local Wi-Fi from dying when the WAN link to the central WLC disconnects.',
      },
    ],

    checkQuestions: [
      {
        id: 'v11-26-q1',
        prompt: 'Which protocol and UDP ports carry CAPWAP Control and Data tunnels between a Cisco Lightweight AP and a WLC?',
        options: [
          'UDP 5246 (Control) and UDP 5247 (Data)',
          'TCP 5246 (Control) and TCP 5247 (Data)',
          'UDP 161 (Control) and UDP 162 (Data)',
          'TCP 22 (Control) and TCP 443 (Data)',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: CAPWAP uses UDP 5246 for DTLS-encrypted control and UDP 5247 for data.',
          'Incorrect: CAPWAP runs over UDP, not TCP.',
          'Incorrect: UDP 161/162 are SNMP.',
          'Incorrect: SSH and HTTPS.',
        ],
        takeaway: 'CAPWAP = UDP 5246 (Control) + UDP 5247 (Data).',
      },
      {
        id: 'v11-26-q2',
        prompt: 'A remote branch has 12 Lightweight APs controlled by a central HQ WLC. Which AP mode ensures local Wi-Fi users can still reach local branch printers even if the WAN link to HQ goes down?',
        options: ['FlexConnect Mode', 'Local Mode', 'Monitor Mode', 'Sniffer Mode'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: FlexConnect supports local switching and standalone branch survivability during WAN outages.',
          'Incorrect: Local Mode tunnels all data to the HQ WLC and stops forwarding if CAPWAP drops.',
          'Incorrect: Monitor Mode serves no clients.',
          'Incorrect: Sniffer Mode captures packets only.',
        ],
        takeaway: 'Use FlexConnect for remote sites needing local switching and WAN outage survivability.',
      },
      {
        id: 'v11-26-q3',
        prompt: 'In Cisco Split-MAC architecture, which task runs directly on the Access Point rather than the WLC?',
        options: [
          'Real-time 802.11 beacons, probe responses, and frame ACKs',
          'Cross-AP roaming coordination and RRM channel planning',
          'Centralized RADIUS 802.1X policy enforcement',
          'Dynamic VLAN/ACL database storage',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Microsecond RF timing tasks (beacons, ACKs, encryption) must execute directly at the AP radio.',
          'Incorrect: RRM, roaming, and centralized AAA run on the WLC.',
          'Incorrect: Handled by WLC.',
          'Incorrect: Handled by WLC.',
        ],
        takeaway: 'AP = real-time RF MAC; WLC = management, security, RRM, and roaming.',
      },
      {
        id: 'v11-26-q4',
        prompt: 'What switch port configuration is normally sufficient for a **Local Mode** AP connected to a campus access switch?',
        options: [
          'A single-VLAN **access** port (`switchport mode access`) with PoE+',
          'A Layer 3 routed port (`no switchport`) with OSPF',
          'An 802.1Q trunk carrying every guest/staff VLAN manually',
          'Half-duplex 10 Mbps hub port',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Because Local Mode encapsulates ALL client VLANs inside its CAPWAP tunnel back to the WLC, the AP itself only needs one management IP on an access switch port!',
          'Incorrect: No OSPF needed on AP ports.',
          'Incorrect: Trunks are needed for FlexConnect local switching or autonomous APs, not Local Mode.',
          'Incorrect: Far too slow and wrong duplex.',
        ],
        takeaway: 'Local Mode AP -> Switch Access port; FlexConnect local-switching AP -> Switch Trunk port.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Review Wireless Architecture & CAPWAP Questions in Exam Mode',
      targetTab: 'exam',
      instructions: [
        'Open Mock Exams -> Cisco CCNA and filter/review Domain 2 Wireless Architecture questions.',
      ],
      verificationCheck: 'Score 100% on Split-MAC, CAPWAP ports, and FlexConnect vs. Local Mode.',
    },

    summaryBullets: [
      'Split-MAC puts real-time RF framing (beacons, ACKs) on APs and management/control (RRM, security, roaming) on WLCs.',
      'CAPWAP uses **UDP 5246** (DTLS Control) and **UDP 5247** (Data).',
      'Local Mode tunnels all traffic to the WLC (uses switch **access** port); **FlexConnect** switches branch traffic locally and survives WAN drops (uses switch **trunk** port).',
      'Monitor, Sniffer, and Rogue Detector APs provide dedicated RF security/capture without serving clients.',
      'Ensure DHCP Option 43 / DNS discovery and synchronized NTP clocks for smooth AP joins.',
    ],

    sourcesToVerify: [
      'Cisco Wireless LAN Controller Configuration Guide — CAPWAP & FlexConnect Design',
    ],
  },

  'ccna.v11.2.8': {
    id: 'ccna.v11.2.8',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Network Access (Wireless)',
    topicTitle: '2.8 AP/WLC Access Connections',
    code: '2.8.1',
    title: 'Management Ports, Service Ports, Telnet/SSH & HTTP/HTTPS Access',
    readMinutes: 10,
    prerequisites: ['2.6.1'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['2.8'],

    learningObjectives: [
      'Describe the physical and logical interfaces on a Cisco WLC: **Service Port** (out-of-band management), **Distribution System / Management Interface** (in-band CAPWAP + RADIUS + GUI/SSH), and **Redundancy Port**.',
      'Explain how a switch trunk port connects to a WLC’s distribution ports via **LAG (Link Aggregation)** carrying multiple Dynamic Interfaces (VLANs).',
      'Compare management protocols (Console, Telnet, SSH, HTTP, HTTPS) and enforce secure CLI/GUI access.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Plugging a WLC Management Port Into an Access Switch Port Breaks All Wireless VLANs',
      narrative:
        'A junior engineer connects a Cisco 9800 or 3504 WLC uplink into a switch port left in `switchport mode access` instead of `switchport mode trunk`. Suddenly the WLC itself answers ping, yet clients connecting to Corporate VLAN 10 or Guest VLAN 30 cannot reach DHCP! Because the WLC maps multiple SSIDs onto multiple **Dynamic Interfaces** over its distribution ports, the switch-to-WLC uplink MUST be an **802.1Q trunk** carrying all wireless VLANs.',
    },

    plainEnglish: {
      analogyTitle: 'Think of a Building’s Emergency Back Door (Service Port) vs. Main Freight Dock (Distribution Trunk)',
      analogy:
        'A hardware WLC separates its doors cleanly: the **Service Port** is a small out-of-band emergency back door used solely for initial setup, crash recovery, or dedicated management—it never carries live Wi-Fi user traffic. The main **Distribution System (DS) Ports** are wide multi-lane freight docks plugged into an **802.1Q trunk** on your core switch, carrying both the **Management Interface** (CAPWAP tunnels to APs, RADIUS, GUI/SSH) and every client **Dynamic Interface** (Staff VLAN 10, Guest VLAN 30).',
      technicalDefinition:
        'Cisco WLC connectivity separates out-of-band management (Service Port, non-routable/isolated management subnet), in-band control and user traffic (Distribution System physical ports configured as 802.1Q trunks / LAG hosting Management and Dynamic Interfaces), and high-availability state sync (Redundancy Port), administered via Console, SSH, or HTTPS.',
      paragraphs: [
        'Keep the three WLC logical/physical roles straight: **(1) Service Port** = out-of-band management/recovery only (`no CAPWAP` and `no wireless client data` ever flow here); **(2) Distribution System (DS) Ports** = carry ALL in-band Management (`AP CAPWAP termination`, `RADIUS`, `SNMP`, `SSH/HTTPS`) plus all wireless **Dynamic Interfaces** over an **802.1Q trunk**; **(3) Redundancy Port (RP)** = direct link between Active/Standby HA controllers.',
        'On AireOS controllers (and LAG-enabled switches), bundling the WLC’s physical DS ports via **LAG** connects to a switch **EtherChannel (`mode on`)** trunk—giving fault tolerance without Spanning Tree loops.',
        'Just like routers/switches, disable insecure **Telnet** and **HTTP**, enforcing **SSH** and **HTTPS** for remote WLC management alongside **Console (9600-8-N-1)** for out-of-band recovery.',
      ],
    },

    deepDive: {
      intro: 'Review switch-to-WLC trunking requirements and management interface isolation.',
      steps: [
        {
          step: 'WLC Service Port',
          title: 'Out-of-Band Management Only',
          explanation: 'Connects to a switch **access port** in an out-of-band management VLAN. Must sit on a DIFFERENT subnet from the in-band Management Interface!',
        },
        {
          step: 'WLC DS / Trunk Ports',
          title: '802.1Q Trunk + LAG to Core Switch',
          explanation: 'Carries Management Interface (CAPWAP termination) + Virtual Interface (mobility/DHCP relay) + Dynamic Interfaces (client VLANs 10, 20, 30).',
        },
        {
          step: 'Management Protocols',
          title: 'SSH / HTTPS vs Telnet / HTTP',
          explanation: 'Disable unencrypted HTTP/Telnet; permit SSH and HTTPS strictly from authorized IT management subnets.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'WLC Physical Switch Connectivity: Service Port vs. Distribution Trunk',
        asciiFallback: `[Core Switch]
  |-- Gi1/0/10 (Access OOB Mgmt) --------> [WLC Service Port] (OOB Admin/Recovery only)
  |-- Po1 (802.1Q Trunk: V99,10,20,30) ==> [WLC DS Ports / LAG] (CAPWAP + Client VLANs!)`,
      },
      workedExample: {
        title: 'Fixing Missing Guest DHCP on a Newly Wired WLC',
        context: 'WLC Management (`VLAN 99`) works, yet Guest SSID (`VLAN 30`) clients fail DHCP.',
        steps: [
          'Inspect switch trunk connected to WLC DS ports (`show interfaces Po1 trunk`): VLAN 30 was omitted from `switchport trunk allowed vlan`!',
          'Run `switchport trunk allowed vlan add 30` on `interface Port-channel 1`.',
        ],
        outcome: 'WLC Dynamic Interface for VLAN 30 reaches the branch/core switch immediately.',
      },
    },

    iosCliGuide: {
      intro: 'Configure the switch side of a WLC uplink cleanly.',
      commands: [
        {
          title: 'Configure Switch Trunk Uplink Feeding a WLC',
          promptAndCommand: 'SW1(config)# interface GigabitEthernet1/0/20',
          output: `SW1(config-if)# description WLC-DS-TRUNK
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,30,99
SW1(config-if)# no shutdown`,
          lineByLine: [
            { segment: 'switchport mode trunk', meaning: 'Required so the WLC’s Management Interface and every client Dynamic Interface share the wire via 802.1Q.' },
            { segment: 'allowed vlan 10,20,30,99', meaning: 'Must include both Management/CAPWAP VLAN (99) and every client WLAN VLAN (10, 20, 30).' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show interfaces Gi1/0/20 trunk',
        healthyLabel: 'All WLC Management + Dynamic VLANs Permitted',
        healthyOutput: `Gi1/0/20    on               802.1q         trunking      99  (10,20,30,99)`,
        brokenLabel: 'Switch Port Left in Access Mode',
        brokenOutput: `(Gi1/0/20 absent from trunk output — Dynamic VLANs fail!)`,
        diagnosis:
          'WLC distribution ports must land on an 802.1Q trunk carrying every VLAN mapped to SSIDs.',
      },
    },

    commonTraps: [
      {
        trap: 'Trying to terminate CAPWAP AP tunnels on the WLC Service Port.',
        reality: 'The Service Port handles out-of-band GUI/CLI recovery ONLY—AP CAPWAP traffic always terminates on the **Management Interface** over the Distribution trunk.',
      },
      {
        trap: 'Putting the Service Port in the same IP subnet as the Management Interface.',
        reality: 'WLCs require the out-of-band Service Port and in-band Management Interface to reside on distinct subnets.',
      },
      {
        trap: 'Leaving HTTP and Telnet enabled on the WLC management plane.',
        reality: 'Disable HTTP and Telnet; manage via **HTTPS** and **SSH** only.',
      },
    ],

    keyTerms: [
      {
        term: 'WLC Service Port',
        shortDef: 'Dedicated out-of-band WLC Ethernet interface for emergency recovery/admin.',
        fullDef: 'Connects to a switch access port on a separate subnet and never carries CAPWAP or client traffic.',
      },
      {
        term: 'WLC Management Interface',
        shortDef: 'Primary in-band IP interface terminating AP CAPWAP tunnels, RADIUS, and admin GUI/SSH.',
        fullDef: 'Shares the 802.1Q Distribution trunk alongside client Dynamic Interfaces.',
      },
      {
        term: 'Dynamic Interface',
        shortDef: 'Logical WLC interface mapping a specific WLAN/SSID to its corresponding wired VLAN.',
        fullDef: 'Connects wireless clients cleanly onto specific 802.1Q VLANs across the Distribution trunk.',
      },
    ],

    checkQuestions: [
      {
        id: 'v11-28-q1',
        prompt: 'Which switch port mode is required for the physical switch ports connected to a WLC’s Distribution System ports serving three different SSID VLANs?',
        options: [
          '802.1Q Trunk (`switchport mode trunk`) allowing Management and all three client VLANs',
          'Static Access (`switchport mode access`) in VLAN 1',
          'Shutdown with BPDU Guard',
          'Half-duplex access port',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The WLC tags each WLAN’s Dynamic Interface onto its VLAN over the 802.1Q trunk.',
          'Incorrect: Access ports pass only one untagged VLAN.',
          'Incorrect: Disables the WLC.',
          'Incorrect: Half-duplex cannot carry high-speed trunk traffic.',
        ],
        takeaway: 'WLC Distribution ports connect to switch 802.1Q trunk ports.',
      },
      {
        id: 'v11-28-q2',
        prompt: 'What is the sole purpose of a hardware WLC’s **Service Port**?',
        options: [
          'Out-of-band administration and system recovery (never CAPWAP or wireless client data)',
          'Terminating AP CAPWAP Data tunnels',
          'Serving DHCP to guest wireless phones',
          'Connecting HA Standby traffic',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: The Service Port provides isolated OOB recovery/management and carries zero CAPWAP/client frames.',
          'Incorrect: CAPWAP terminates on the in-band Management Interface.',
          'Incorrect: Dynamic Interfaces handle client traffic.',
          'Incorrect: Redundancy Port (RP) handles HA state sync.',
        ],
        takeaway: 'Service Port = OOB admin/recovery; Management Interface = in-band CAPWAP + admin.',
      },
      {
        id: 'v11-28-q3',
        prompt: 'Which pair of remote management protocols should be enabled on a production WLC while disabling their unencrypted counterparts?',
        options: ['SSH and HTTPS', 'Telnet and HTTP', 'TFTP and HTTP', 'Telnet and SNMPv1'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: SSH (encrypted CLI) and HTTPS (TLS-encrypted Web GUI) protect admin credentials in transit.',
          'Incorrect: Both send passwords in plaintext.',
          'Incorrect: Unencrypted.',
          'Incorrect: Plaintext protocols.',
        ],
        takeaway: 'Enforce SSH + HTTPS; disable Telnet + HTTP.',
      },
      {
        id: 'v11-28-q4',
        prompt: 'When bundling multiple WLC Distribution System ports to a Catalyst switch using LAG, which switch EtherChannel mode is standard on AireOS LAG?',
        options: ['Static `mode on` (no PAgP/LACP)', 'PAgP `auto`', 'Dynamic desirable', 'Disabled'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Traditional AireOS WLC LAG uses static EtherChannel (`channel-group <n> mode on`) on the Catalyst switch (while Catalyst 9800 IOS XE supports LACP too!).',
          'Incorrect: AireOS WLCs do not run PAgP.',
          'Incorrect: PAgP desirable is unsupported on AireOS.',
          'Incorrect: Individual links without LAG risk loops or single-port limits.',
        ],
        takeaway: 'Know AireOS WLC LAG (`mode on`) vs. Catalyst 9800 IOS XE (supports LACP).',
      },
    ],

    handsOnActivity: {
      kind: 'cli-lab',
      title: 'Configure WLC-Ready 802.1Q Trunks in IOS Lab 02',
      targetTab: 'labs',
      instructions: [
        'Practice configuring `switchport mode trunk`, `native vlan`, and `allowed vlan` lists matching multi-VLAN WLC uplinks.',
      ],
      verificationCheck: 'Verify trunk operational state and allowed VLAN list.',
    },

    summaryBullets: [
      'Service Port = isolated out-of-band management/recovery on a separate subnet (no CAPWAP/client traffic).',
      'Distribution System ports carry the Management Interface (CAPWAP/RADIUS/admin) + client Dynamic Interfaces over an **802.1Q trunk** (often bundled with LAG).',
      'Always manage WLCs securely via **SSH** and **HTTPS** rather than Telnet/HTTP.',
      'Missing client VLANs on the switch-to-WLC trunk is a top cause of Wi-Fi DHCP failures.',
    ],

    sourcesToVerify: [
      'Cisco Wireless LAN Controller Interface Configuration & LAG Best Practices Guide',
    ],
  },

  'ccna.v11.2.9': {
    id: 'ccna.v11.2.9',
    moduleId: 'ccna',
    unitTitle: 'Unit 2: Network Access (Wireless)',
    topicTitle: '2.9 WLC GUI WLAN Setup',
    code: '2.9.1',
    title: 'Creating Dynamic Interfaces, WLANs, Security & QoS Profiles in WLC GUI',
    readMinutes: 12,
    prerequisites: ['2.8.1'],
    versionScope: 'v1.1-only',
    v11ExamTopics: ['2.9'],

    learningObjectives: [
      'Trace the end-to-end WLC GUI workflow to launch a new enterprise WLAN from scratch.',
      'Create a **Dynamic Interface** (`Controller -> Interfaces -> New`) binding a VLAN ID, IP/gateway, and DHCP server IP.',
      'Configure a **WLAN** (`WLANs -> Create New`), bind its Interface, enable Status, configure **Security** (L2 WPA2/WPA3 + AAA RADIUS), and tune **QoS** (Platinum/Voice vs Bronze/Guest) and **Advanced** settings.',
      'Verify why enabling a WLAN requires BOTH `Status = Enabled` AND mapping the correct Dynamic Interface.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Why Creating an SSID in a WLC Leaves Clients Without IP Addresses Until Bound to a Dynamic Interface',
      narrative:
        'Suppose you create a brand-new SSID called `Corp-Voice` in the WLC GUI, set WPA2-Enterprise, and click Apply—only to realize phones join the Management VLAN 99 instead of Voice VLAN 20, AND have zero QoS voice priority! A WLC WLAN is only half built until you bind it to its **Dynamic Interface** (VLAN 20), set **Status = Enabled**, assign **Platinum QoS**, and attach the **RADIUS server** under Security -> AAA Servers.',
    },

    plainEnglish: {
      analogyTitle: 'Think of Creating a Hotel Conference Room: Door Sign (WLAN) + Wired Utility Hookup (Dynamic Interface)',
      analogy:
        'Creating a wireless network on a WLC has two halves: first, go to **Controller -> Interfaces** to wire the **Dynamic Interface** (giving it the VLAN number, IP gateway, and DHCP relay address—like hooking up power and plumbing to Room 20). Second, go to **WLANs -> Create New** to hang the **SSID sign** (`Corp-Staff`), flip the **`Enabled`** switch ON, map it to Room 20’s Dynamic Interface, lock the door under **Security** (WPA2/WPA3 + RADIUS), and set traffic priority under **QoS** (Platinum for Voice, Silver for Staff, Bronze for Guests).',
      technicalDefinition:
        'Provisioning a wireless network on a Cisco WLC GUI links a wired **Dynamic Interface** (VLAN ID, IP/mask, gateway, primary DHCP server) to a **WLAN Profile** (Profile Name, SSID, Status=Enabled, Security L2/L3/AAA policies, QoS profile Platinum/Gold/Silver/Bronze, and Advanced FlexConnect/Aironet IE options).',
      paragraphs: [
        'Walk through the exact WLC GUI tabs in order: **(1) Controller -> Interfaces -> New**: name it cleanly (`vlan20_voice`), assign the physical port/LAG, set the **VLAN Identifier**, assign the WLC’s unused IP on that subnet, netmask, default gateway, and **Primary DHCP Server IP** so the WLC proxies/relays DHCP cleanly.',
        '**(2) Security -> AAA -> RADIUS -> Authentication** (if using 802.1X Enterprise): add your ISE/NPS RADIUS server IP + Shared Secret (`UDP 1812`).',
        '**(3) WLANs -> Create New -> Go**: assign **Profile Name** + broadcast **SSID**, check **`Status: Enabled`**, pick the new **Dynamic Interface** from the dropdown, open **Security Tab** (`Layer 2 = WPA+WPA2` with `WPA2 Policy + AES` and `802.1X` or `PSK`), open **QoS Tab** (set `Platinum` for Voice, `Gold` for Video, `Silver` for Best Effort Staff, `Bronze` for Guest background), and click **Apply**!',
      ],
    },

    deepDive: {
      intro: 'Follow the 4-tab WLC GUI deployment checklist cleanly.',
      steps: [
        {
          step: 'Step 1: Controller -> Interfaces',
          title: 'Build the Dynamic Interface for the Target VLAN',
          explanation: 'Set Interface Name, VLAN ID (e.g., `20`), WLC IP/Netmask/Gateway inside VLAN 20, Primary DHCP Server IP, and physical port/LAG.',
        },
        {
          step: 'Step 2: WLANs -> General Tab',
          title: 'Enable Status & Bind Interface',
          explanation: 'Set Profile Name, SSID string, check **Status: Enabled** (often forgotten!), and select the VLAN 20 Dynamic Interface.',
        },
        {
          step: 'Step 3: WLANs -> Security Tab',
          title: 'Layer 2 WPA2/WPA3 + AAA Servers',
          explanation: 'Layer 2: WPA2 Policy + AES-CCMP (`802.1X` for corporate + select RADIUS server under AAA Servers tab, OR `PSK` for IoT/simple SSIDs). Layer 3: optional WebAuth captive portal for Guest.',
        },
        {
          step: 'Step 4: WLANs -> QoS & Advanced Tabs',
          title: 'Set Platinum/Gold/Silver/Bronze + FlexConnect',
          explanation: 'Platinum = Voice (DSCP EF), Gold = Video (AF41), Silver = Best Effort (default), Bronze = Background/Guest. Check FlexConnect Local Switching under Advanced if deploying at remote branches!',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'WLC GUI Configuration Dependency Flow',
        asciiFallback: `[1. Controller -> Interfaces] (VLAN 20, IP, Gateway, DHCP Server)
            | (bound via Interface dropdown)
            v
[2. WLANs -> General (Status: Enabled)] -> [3. Security (WPA2-AES + AAA)] -> [4. QoS (Platinum..Bronze) + Advanced]`,
      },
      workedExample: {
        title: 'Diagnosing Why a New Guest SSID Broadcasts Yet Never Opens Captive Portal or DHCP',
        context: 'You created `Corp-Guest` on the WLC, clients see the SSID, yet fail to pull an IP.',
        steps: [
          'Open `WLANs -> Corp-Guest -> General`: Interface/Interface Group was left on `management` instead of `vlan30_guest`!',
          'Open `Controller -> Interfaces -> vlan30_guest`: Primary DHCP Server field was left blank (`0.0.0.0`) while `DHCP Addr. Assignment Required` was enabled!',
          'Bind `vlan30_guest` cleanly and enter the DHCP Server IP -> Guest phones pull `10.30.30.x` leases immediately.',
        ],
        outcome: 'Every WLAN requires both a valid Dynamic Interface and matching DHCP configuration.',
      },
    },

    iosCliGuide: {
      intro: 'Verify GUI-created WLAN profiles, mapped VLAN interfaces, and QoS levels from CLI too.',
      commands: [
        {
          title: 'Audit Configured WLANs, Interfaces & Security on WLC',
          promptAndCommand: 'WLC# show wlan summary',
          output: `Number of WLANs.................................. 3

WLAN ID  WLAN Profile Name / SSID               Status    Interface Name        PMIPv6 Mobility
-------  -------------------------------------  --------  --------------------  ---------------
1        Corp-Staff / Corp-Staff                Enabled   vlan10_staff          none
2        Corp-Voice / Corp-Voice                Enabled   vlan20_voice          none
3        Corp-Guest / Corp-Guest                Enabled   vlan30_guest          none`,
          lineByLine: [
            { segment: 'Status: Enabled', meaning: 'SSID actively advertises on joined APs in its AP Group.' },
            { segment: 'Interface Name (vlan20_voice)', meaning: 'Confirms each WLAN maps cleanly to its dedicated wired VLAN Dynamic Interface.' },
          ],
        },
      ],
      healthyVsBroken: {
        checkCommand: 'show wlan 3',
        healthyLabel: 'WLAN Enabled & Mapped to Dedicated Guest Dynamic Interface',
        healthyOutput: `WLAN Identifier: 3 | Status: Enabled | Interface: vlan30_guest | QoS: Bronze`,
        brokenLabel: 'WLAN Left Disabled or Mapped to Management Interface',
        brokenOutput: `WLAN Identifier: 3 | Status: Disabled | Interface: management`,
        diagnosis:
          'Never leave a production or guest SSID mapped to the `management` interface—create a dedicated Dynamic Interface for each user VLAN and confirm `Status: Enabled`.',
      },
    },

    commonTraps: [
      {
        trap: 'Clicking Apply after creating a WLAN while forgetting to tick the **`Status: Enabled`** checkbox.',
        reality: 'New WLANs default to **Disabled** on Cisco WLCs—APs never broadcast the SSID until enabled.',
      },
      {
        trap: 'Leaving the WLAN Interface set to `management`.',
        reality: 'Placing wireless users straight onto the AP/WLC Management VLAN exposes infrastructure IPs to end users!',
      },
      {
        trap: 'Forgetting to select the configured RADIUS server inside the WLAN’s `Security -> AAA Servers` sub-tab.',
        reality: 'Defining a global RADIUS server under the main `Security` menu isn’t enough—you must attach it to that specific WLAN.',
      },
      {
        trap: 'Mixing up WLC QoS profile rankings (`Platinum` vs `Gold` vs `Silver` vs `Bronze`).',
        reality: 'Order from highest to lowest priority: **Platinum (Voice)** > **Gold (Video)** > **Silver (Best Effort/Default)** > **Bronze (Background/Guest)**.',
      },
    ],

    keyTerms: [
      {
        term: 'WLC QoS Profiles',
        shortDef: 'Four WLC wireless priority tiers: Platinum (Voice), Gold (Video), Silver (Best Effort), Bronze (Background).',
        fullDef: 'Maps wireless 802.11e WMM UP values cleanly to wired DSCP markings across the network.',
      },
      {
        term: 'WLAN Profile',
        shortDef: 'Named WLC configuration combining SSID, Dynamic Interface, Security, QoS, and Advanced parameters.',
        fullDef: 'Allows different internal Profile Names even when broadcasting matching or policy-grouped SSIDs.',
      },
      {
        term: 'AAA Server Mapping',
        shortDef: 'Linking an external RADIUS server (UDP 1812) directly inside a WLAN’s Security -> AAA tab.',
        fullDef: 'Required for WPA2/WPA3-Enterprise (`802.1X`) per-user authentication.',
      },
    ],

    checkQuestions: [
      {
        id: 'v11-29-q1',
        prompt: 'Which WLC QoS profile should an administrator assign on the `WLANs -> QoS` tab for a dedicated wireless VoIP phone SSID?',
        options: ['Platinum', 'Gold', 'Silver', 'Bronze'],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Platinum provides top voice-grade WMM/DSCP EF prioritization.',
          'Incorrect: Gold is designed for Video.',
          'Incorrect: Silver is default Best Effort data.',
          'Incorrect: Bronze throttles/deprioritizes guest or background traffic.',
        ],
        takeaway: 'Platinum = Voice; Gold = Video; Silver = Best Effort; Bronze = Background/Guest.',
      },
      {
        id: 'v11-29-q2',
        prompt: 'You create a new Dynamic Interface (`vlan40_iot`) and a new WLAN (`IoT-Sensors`) on a Cisco WLC, yet users report they cannot see the SSID anywhere. What common General tab step was most likely missed?',
        options: [
          'Checking the `Status: Enabled` box inside the WLAN General tab',
          'Changing the QoS tab from Silver to Bronze',
          'Enabling HTTP instead of HTTPS',
          'Connecting the Service Port to an 802.1Q trunk',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Newly created WLC WLANs default to `Disabled` until `Status` is explicitly ticked and applied.',
          'Incorrect: QoS never hides an SSID.',
          'Incorrect: Admin GUI protocol does not affect wireless beacons.',
          'Incorrect: Service Port never carries wireless beacons.',
        ],
        takeaway: 'Verify `Status: Enabled` + Dynamic Interface binding + AP Group membership when an SSID isn’t broadcasting.',
      },
      {
        id: 'v11-29-q3',
        prompt: 'In the WLC GUI, where do you bind a specific VLAN ID, gateway IP, and Primary DHCP Server for a new wireless subnet?',
        options: [
          'Controller -> Interfaces (create a Dynamic Interface)',
          'WLANs -> QoS tab',
          'Monitor -> Clients',
          'Management -> HTTP/HTTPS',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Dynamic Interfaces live under `Controller -> Interfaces` and map wireless traffic to wired VLANs and DHCP servers.',
          'Incorrect: QoS configures traffic priority only.',
          'Incorrect: Shows connected client status.',
          'Incorrect: Configures GUI access.',
        ],
        takeaway: 'Create the Dynamic Interface under `Controller -> Interfaces` first, then bind it inside `WLANs`.',
      },
      {
        id: 'v11-29-q4',
        prompt: 'After adding your company ISE RADIUS server under `Security -> AAA -> RADIUS -> Authentication`, why does an 802.1X WLAN still fail to authenticate users?',
        options: [
          'You must also select that RADIUS server under the specific WLAN’s `Security -> AAA Servers` tab.',
          'RADIUS requires Bronze QoS.',
          'Dynamic Interfaces cannot carry 802.1X traffic.',
          'RADIUS only works over the Service Port.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Global RADIUS definitions must be explicitly attached inside each Enterprise WLAN’s `AAA Servers` tab.',
          'Incorrect: Unrelated to QoS.',
          'Incorrect: Dynamic Interfaces carry all client VLAN traffic.',
          'Incorrect: RADIUS travels via the Management Interface.',
        ],
        takeaway: 'Two-step RADIUS on WLC: (1) Define server under global Security -> AAA, (2) Attach under WLAN -> Security -> AAA Servers.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Test WLC GUI Workflow Knowledge in Exam Lab',
      targetTab: 'exam',
      instructions: [
        'Open Mock Exams -> Cisco CCNA and test yourself on Domain 2 WLC WLAN setup and QoS tier questions.',
      ],
      verificationCheck: 'Score 100% on Dynamic Interface -> WLAN -> Security -> QoS workflow order.',
    },

    summaryBullets: [
      'Create Dynamic Interfaces (`Controller -> Interfaces`) first with VLAN ID, WLC IP/mask/gateway, and Primary DHCP Server.',
      'Create the WLAN (`WLANs -> Create New`), tick **`Status: Enabled`**, and bind its dedicated Dynamic Interface (never leave on `management`).',
      'Configure Layer 2 Security (WPA2/WPA3-AES + PSK or 802.1X) and attach global RADIUS servers inside the WLAN `AAA Servers` tab.',
      'Assign QoS profiles cleanly: **Platinum (Voice) > Gold (Video) > Silver (Best Effort) > Bronze (Background)**.',
      'Enable FlexConnect Local Switching under `Advanced` for remote branch WLANs.',
    ],

    sourcesToVerify: [
      'Cisco Wireless LAN Controller (AireOS / Catalyst 9800) GUI WLAN Configuration Guide',
    ],
  },
};
