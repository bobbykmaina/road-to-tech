import { matchesWildcard } from '../engine/iosSimulator';
import { CcnaLab } from '../types/ccna';

export const CCNA_LABS: CcnaLab[] = [
  {
    id: 'lab-01-basic-router',
    number: 'Lab 01',
    domainId: 'fundamentals',
    category: 'Build',
    title: 'Router Interface Bring-Up & IPv4 Gateway',
    difficulty: 'Foundational',
    estimatedMinutes: 8,
    brief:
      'R1 sits between LAN-A (192.168.10.0/24) and WAN-ISP (203.0.113.0/30). Set R1 hostname to EDGE-R1, configure G0/0 with 192.168.10.1/24 and G0/1 with 203.0.113.1/30, bring both interfaces up, and verify end-to-end reachability to ISP-GW (203.0.113.2).',
    initialDevices: {
      R1: {
        id: 'R1',
        hostname: 'Router',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 260,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            adminUp: false,
            protocolUp: false,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            adminUp: false,
            protocolUp: false,
            connectedTo: { deviceId: 'ISP', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'PC1',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '192.168.10.1',
        x: 90,
        y: 120,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '192.168.10.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      ISP: {
        id: 'ISP',
        hostname: 'ISP-GW',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 430,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '203.0.113.2',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/1' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'R1', toIf: 'Gi0/0', label: '192.168.10.0/24' },
      { fromDevice: 'R1', fromIf: 'Gi0/1', toDevice: 'ISP', toIf: 'Gi0/0', label: '203.0.113.0/30' },
    ],
    objectives: [
      {
        id: 'obj-host',
        label: 'Set R1 hostname to EDGE-R1',
        check: (d) => d.R1?.hostname === 'EDGE-R1',
      },
      {
        id: 'obj-g00',
        label: 'Assign 192.168.10.1 255.255.255.0 on R1 Gi0/0 & no shut',
        check: (d) =>
          d.R1?.interfaces['GigabitEthernet0/0']?.ip === '192.168.10.1' &&
          d.R1?.interfaces['GigabitEthernet0/0']?.mask === '255.255.255.0' &&
          d.R1?.interfaces['GigabitEthernet0/0']?.adminUp === true,
      },
      {
        id: 'obj-g01',
        label: 'Assign 203.0.113.1 255.255.255.252 on R1 Gi0/1 & no shut',
        check: (d) =>
          d.R1?.interfaces['GigabitEthernet0/1']?.ip === '203.0.113.1' &&
          d.R1?.interfaces['GigabitEthernet0/1']?.mask === '255.255.255.252' &&
          d.R1?.interfaces['GigabitEthernet0/1']?.adminUp === true,
      },
    ],
    starterHint: 'Start on R1: enable -> configure terminal -> hostname EDGE-R1 -> interface g0/0',
  },
  {
    id: 'lab-02-roas-vlans',
    number: 'Lab 02',
    domainId: 'access',
    category: 'Build',
    title: 'VLANs & 802.1Q Trunking (Router-on-a-Stick)',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    brief:
      'Create VLAN 10 (ENG) and VLAN 20 (SALES) on SW1. Assign Fa0/1 to VLAN 10, Fa0/2 to VLAN 20, and make Gi0/1 an 802.1Q trunk. Then configure R1 Gi0/0.10 (10.10.10.1/24) and Gi0/0.20 (10.10.20.1/24) with dot1Q encapsulation.',
    initialDevices: {
      SW1: {
        id: 'SW1',
        hostname: 'SW1',
        kind: 'switch',
        vlans: { 1: 'default' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 240,
        y: 130,
        interfaces: {
          'FastEthernet0/1': {
            name: 'FastEthernet0/1',
            shortName: 'Fa0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 1,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'FastEthernet0/2': {
            name: 'FastEthernet0/2',
            shortName: 'Fa0/2',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 1,
            connectedTo: { deviceId: 'PC2', interfaceName: 'Eth0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 1,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      R1: {
        id: 'R1',
        hostname: 'R1',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 420,
        y: 130,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            adminUp: false,
            protocolUp: false,
            subinterfaces: {},
            connectedTo: { deviceId: 'SW1', interfaceName: 'GigabitEthernet0/1' },
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'PC1-ENG',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '10.10.10.1',
        x: 80,
        y: 75,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.10.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/1' },
          },
        },
      },
      PC2: {
        id: 'PC2',
        hostname: 'PC2-SALES',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '10.10.20.1',
        x: 80,
        y: 185,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.20.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/2' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/1', label: 'VLAN 10' },
      { fromDevice: 'PC2', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/2', label: 'VLAN 20' },
      { fromDevice: 'SW1', fromIf: 'Gi0/1', toDevice: 'R1', toIf: 'Gi0/0', label: '802.1Q Trunk' },
    ],
    objectives: [
      {
        id: 'obj-vlans',
        label: 'Create VLAN 10 and VLAN 20 on SW1',
        check: (d) => Boolean(d.SW1?.vlans[10]) && Boolean(d.SW1?.vlans[20]),
      },
      {
        id: 'obj-access',
        label: 'Assign Fa0/1 -> VLAN 10 and Fa0/2 -> VLAN 20',
        check: (d) =>
          d.SW1?.interfaces['FastEthernet0/1']?.accessVlan === 10 &&
          d.SW1?.interfaces['FastEthernet0/2']?.accessVlan === 20,
      },
      {
        id: 'obj-trunk',
        label: 'Configure SW1 Gi0/1 as switchport mode trunk',
        check: (d) => d.SW1?.interfaces['GigabitEthernet0/1']?.switchportMode === 'trunk',
      },
      {
        id: 'obj-roas',
        label: 'Bring R1 Gi0/0 up & configure Gi0/0.10 + Gi0/0.20 dot1Q gateways',
        check: (d) => {
          const g00 = d.R1?.interfaces['GigabitEthernet0/0'];
          const subs = Object.values(g00?.subinterfaces ?? {});
          const hasV10 = subs.some(
            (s) => s.vlanId === 10 && s.ip === '10.10.10.1' && s.mask === '255.255.255.0' && s.adminUp,
          );
          const hasV20 = subs.some(
            (s) => s.vlanId === 20 && s.ip === '10.10.20.1' && s.mask === '255.255.255.0' && s.adminUp,
          );
          return Boolean(g00?.adminUp && hasV10 && hasV20);
        },
      },
    ],
    starterHint: 'Click SW1 first to create VLAN 10 & 20 and trunk Gi0/1, then switch to R1 for Gi0/0.10 & Gi0/0.20.',
  },
  {
    id: 'lab-03-ospf-area0',
    number: 'Lab 03',
    domainId: 'connectivity',
    category: 'Build',
    title: 'Single-Area OSPFv2 Adjacency & Loopback',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    brief:
      'R1 and R2 share transit link 10.0.12.0/30. Configure OSPFv2 Process 1 in Area 0 on both routers (R1 router-id 1.1.1.1, R2 router-id 2.2.2.2) advertising their transit link and R2 LAN 172.16.2.0/24. Verify FULL adjacency with "show ip ospf neighbor".',
    initialDevices: {
      R1: {
        id: 'R1',
        hostname: 'R1',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 150,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '10.0.12.1',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R2', interfaceName: 'GigabitEthernet0/0' },
          },
          'Loopback0': {
            name: 'Loopback0',
            shortName: 'Lo0',
            ip: '1.1.1.1',
            mask: '255.255.255.255',
            adminUp: true,
            protocolUp: true,
          },
        },
      },
      R2: {
        id: 'R2',
        hostname: 'R2',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 370,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '10.0.12.2',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            ip: '172.16.2.1',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
          },
        },
      },
    },
    links: [
      { fromDevice: 'R1', fromIf: 'Gi0/0', toDevice: 'R2', toIf: 'Gi0/0', label: '10.0.12.0/30 · Area 0' },
    ],
    objectives: [
      {
        id: 'obj-r1-ospf',
        label: 'Configure R1 OSPF process 1 with router-id 1.1.1.1 & transit network',
        check: (d) =>
          d.R1?.ospf.processId === 1 &&
          d.R1?.ospf.routerId === '1.1.1.1' &&
          d.R1?.ospf.networks.some(
            (n) => n.area === 0 && matchesWildcard('10.0.12.1', n.network, n.wildcard),
          ),
      },
      {
        id: 'obj-r2-ospf',
        label: 'Configure R2 OSPF process 1 with router-id 2.2.2.2, transit & 172.16.2.0',
        check: (d) =>
          d.R2?.ospf.processId === 1 &&
          d.R2?.ospf.routerId === '2.2.2.2' &&
          d.R2?.ospf.networks.some(
            (n) => n.area === 0 && matchesWildcard('10.0.12.2', n.network, n.wildcard),
          ) &&
          d.R2?.ospf.networks.some(
            (n) => n.area === 0 && matchesWildcard('172.16.2.1', n.network, n.wildcard),
          ),
      },
    ],
    starterHint: 'Use "router ospf 1", "router-id 1.1.1.1", and "network 10.0.12.0 0.0.0.3 area 0".',
  },
  {
    id: 'lab-04-floating-static',
    number: 'Lab 04',
    domainId: 'connectivity',
    category: 'Build',
    title: 'Default & Floating Static Route Failover',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    brief:
      'Configure R1 with a primary default route via ISP-PRIMARY (198.51.100.2, AD 1) and a floating static backup default route via ISP-BACKUP (203.0.113.2, AD 10). Inspect with "show ip route".',
    initialDevices: {
      R1: {
        id: 'R1',
        hostname: 'BRANCH-R1',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 150,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '198.51.100.1',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'ISP1', interfaceName: 'GigabitEthernet0/0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            ip: '203.0.113.1',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'ISP2', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      ISP1: {
        id: 'ISP1',
        hostname: 'ISP-PRIMARY',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 380,
        y: 65,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '198.51.100.2',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      ISP2: {
        id: 'ISP2',
        hostname: 'ISP-BACKUP',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 380,
        y: 180,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '203.0.113.2',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/1' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'R1', fromIf: 'Gi0/0', toDevice: 'ISP1', toIf: 'Gi0/0', label: 'Primary 198.51.100.0/30' },
      { fromDevice: 'R1', fromIf: 'Gi0/1', toDevice: 'ISP2', toIf: 'Gi0/0', label: 'Backup 203.0.113.0/30' },
    ],
    objectives: [
      {
        id: 'obj-prim',
        label: 'Configure primary default route 0.0.0.0 0.0.0.0 via 198.51.100.2 (AD 1)',
        check: (d) =>
          d.R1?.staticRoutes.some(
            (r) => r.prefix === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '198.51.100.2' && r.ad === 1,
          ),
      },
      {
        id: 'obj-float',
        label: 'Configure floating static default route via 203.0.113.2 with AD 10',
        check: (d) =>
          d.R1?.staticRoutes.some(
            (r) => r.prefix === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '203.0.113.2' && r.ad === 10,
          ),
      },
    ],
    starterHint: 'In global config: "ip route 0.0.0.0 0.0.0.0 198.51.100.2" and append AD "10" for the backup.',
  },
  {
    id: 'lab-05-extended-acl',
    number: 'Lab 05',
    domainId: 'security',
    category: 'Build',
    title: 'Extended Named ACL Traffic Filtering',
    difficulty: 'Exam-Level',
    estimatedMinutes: 10,
    brief:
      'Create extended named ACL "BLOCK_TELNET" on R1. Deny TCP port 23 from 192.168.10.0/24 to any destination, permit all other IP traffic (so you do not hit the implicit deny!), and apply it inbound on Gi0/0.',
    initialDevices: {
      R1: {
        id: 'R1',
        hostname: 'SEC-R1',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 260,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '192.168.10.1',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            ip: '10.1.1.1',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SRV', interfaceName: 'Eth0' },
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'USER-PC',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '192.168.10.1',
        x: 90,
        y: 120,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '192.168.10.50',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      SRV: {
        id: 'SRV',
        hostname: 'APP-SRV',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '10.1.1.1',
        x: 430,
        y: 120,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.1.1.2',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/1' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'R1', toIf: 'Gi0/0', label: '192.168.10.0/24' },
      { fromDevice: 'R1', fromIf: 'Gi0/1', toDevice: 'SRV', toIf: 'Eth0', label: '10.1.1.0/30' },
    ],
    objectives: [
      {
        id: 'obj-acl-def',
        label: 'Create extended ACL BLOCK_TELNET denying TCP eq 23 from 192.168.10.0 0.0.0.255',
        check: (d) => {
          const acl = d.R1?.acls['BLOCK_TELNET'];
          if (!acl || acl.type !== 'extended') return false;
          const denyIdx = acl.rules.findIndex((r) => {
            const lr = r.toLowerCase();
            return (
              lr.startsWith('deny') &&
              lr.includes('tcp') &&
              (lr.includes('eq 23') || lr.includes('eq telnet')) &&
              (lr.includes('192.168.10.0') || lr.includes('any'))
            );
          });
          const permitIdx = acl.rules.findIndex((r) => {
            const lr = r.toLowerCase();
            return (
              lr.startsWith('permit') &&
              (lr.includes('ip any any') || lr.includes('ip 192.168.10.0 0.0.0.255 any'))
            );
          });
          return denyIdx !== -1 && permitIdx > denyIdx;
        },
      },
      {
        id: 'obj-acl-apply',
        label: 'Apply ip access-group BLOCK_TELNET in on Gi0/0',
        check: (d) => d.R1?.interfaces['GigabitEthernet0/0']?.accessGroupIn === 'BLOCK_TELNET',
      },
    ],
    starterHint: 'Use "ip access-list extended BLOCK_TELNET", add deny rule + "permit ip any any", then apply on Gi0/0.',
  },
  {
    id: 'lab-06-stp-portsec',
    number: 'Lab 06',
    domainId: 'security',
    category: 'Build',
    title: 'STP Root Bridge & Switchport Port Security',
    difficulty: 'Exam-Level',
    estimatedMinutes: 9,
    brief:
      'Harden SW-CORE: elect SW-CORE as STP Root Primary for VLAN 1, configure Fa0/1 as static access mode, enable Port Security with maximum 2 MAC addresses and violation mode restrict.',
    initialDevices: {
      SW1: {
        id: 'SW1',
        hostname: 'SW-CORE',
        kind: 'switch',
        vlans: { 1: 'default' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 260,
        y: 120,
        interfaces: {
          'FastEthernet0/1': {
            name: 'FastEthernet0/1',
            shortName: 'Fa0/1',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'trunk',
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'CORP-WS1',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 100,
        y: 120,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.1.1.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/1' },
          },
        },
      },
    },
    links: [{ fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/1', label: 'Access Edge' }],
    objectives: [
      {
        id: 'obj-stp',
        label: 'Configure SW-CORE as spanning-tree vlan 1 root primary',
        check: (d) => d.SW1?.stpRootVlans.includes(1),
      },
      {
        id: 'obj-mode',
        label: 'Set Fa0/1 to switchport mode access',
        check: (d) => d.SW1?.interfaces['FastEthernet0/1']?.switchportMode === 'access',
      },
      {
        id: 'obj-psec',
        label: 'Enable port-security on Fa0/1 (max 2, violation restrict)',
        check: (d) => {
          const ps = d.SW1?.interfaces['FastEthernet0/1']?.portSecurity;
          return Boolean(ps?.enabled && ps.maximum === 2 && ps.violation === 'restrict');
        },
      },
    ],
    starterHint: 'Remember: IOS rejects port-security unless you first set "switchport mode access" on Fa0/1.',
  },
  {
    id: 'lab-07-tshoot-vlan-trunk',
    number: 'Lab 07',
    domainId: 'access',
    category: 'Troubleshoot',
    faultSummary: 'VLAN 20 missing from trunk allowed list, Native VLAN mismatch (99 vs 1), and Fa0/2 err-disabled by BPDU Guard.',
    title: 'Break/Fix: 802.1Q Trunk Mismatch & Err-Disable Recovery',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    brief:
      'Users on PC2 (VLAN 20, 10.10.20.10) cannot reach SRV1 (VLAN 20, 10.10.20.50). Inspect SW1 and SW2 with "show interfaces status" and "show interfaces trunk": recover SW1 Fa0/2 from err-disabled, align the trunk Native VLAN on SW1 Gi0/1 to 1, add VLAN 20 to SW1 Gi0/1 allowed VLANs, and verify ping from PC2 to 10.10.20.50.',
    initialDevices: {
      SW1: {
        id: 'SW1',
        hostname: 'SW1-EDGE',
        kind: 'switch',
        vlans: { 1: 'default', 10: 'DATA', 20: 'VOICE_APP', 99: 'NATIVE' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [1],
        syslogBuffer: [
          '%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Fa0/2 with BPDU Guard enabled. Disabling port.',
          '%PM-4-ERR_DISABLE: bpduguard error detected on Fa0/2, putting Fa0/2 in err-disable state',
          '%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (99), with SW2-DIST GigabitEthernet0/1 (1).',
        ],
        x: 190,
        y: 125,
        interfaces: {
          'FastEthernet0/1': {
            name: 'FastEthernet0/1',
            shortName: 'Fa0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 10,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'FastEthernet0/2': {
            name: 'FastEthernet0/2',
            shortName: 'Fa0/2',
            adminUp: true,
            protocolUp: false,
            errDisabled: true,
            errDisabledReason: 'bpduguard',
            switchportMode: 'access',
            accessVlan: 20,
            connectedTo: { deviceId: 'PC2', interfaceName: 'Eth0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'trunk',
            trunkAllowedVlans: '10',
            nativeVlan: 99,
            connectedTo: { deviceId: 'SW2', interfaceName: 'GigabitEthernet0/1' },
          },
        },
      },
      SW2: {
        id: 'SW2',
        hostname: 'SW2-DIST',
        kind: 'switch',
        vlans: { 1: 'default', 10: 'DATA', 20: 'VOICE_APP' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 360,
        y: 125,
        interfaces: {
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'trunk',
            trunkAllowedVlans: '10,20',
            nativeVlan: 1,
            connectedTo: { deviceId: 'SW1', interfaceName: 'GigabitEthernet0/1' },
          },
          'FastEthernet0/1': {
            name: 'FastEthernet0/1',
            shortName: 'Fa0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 20,
            connectedTo: { deviceId: 'SRV1', interfaceName: 'Eth0' },
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'PC1-V10',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 60,
        y: 65,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.10.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/1' },
          },
        },
      },
      PC2: {
        id: 'PC2',
        hostname: 'PC2-V20',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 60,
        y: 185,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.20.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/2' },
          },
        },
      },
      SRV1: {
        id: 'SRV1',
        hostname: 'SRV1-V20',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 475,
        y: 125,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.20.50',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW2', interfaceName: 'FastEthernet0/1' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/1', label: 'VLAN 10' },
      { fromDevice: 'PC2', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/2', label: 'VLAN 20' },
      { fromDevice: 'SW1', fromIf: 'Gi0/1', toDevice: 'SW2', toIf: 'Gi0/1', label: '802.1Q Trunk' },
      { fromDevice: 'SW2', fromIf: 'Fa0/1', toDevice: 'SRV1', toIf: 'Eth0', label: 'VLAN 20' },
    ],
    objectives: [
      {
        id: 'obj-err-recover',
        label: 'Recover SW1 Fa0/2 from err-disabled (shut / no shut)',
        check: (d) => {
          const fa2 = d.SW1?.interfaces['FastEthernet0/2'];
          return Boolean(fa2 && !fa2.errDisabled && fa2.adminUp);
        },
      },
      {
        id: 'obj-native',
        label: 'Resolve Native VLAN mismatch on SW1 Gi0/1 (native vlan 1)',
        check: (d) => (d.SW1?.interfaces['GigabitEthernet0/1']?.nativeVlan ?? 1) === (d.SW2?.interfaces['GigabitEthernet0/1']?.nativeVlan ?? 1),
      },
      {
        id: 'obj-allowed',
        label: 'Permit VLAN 20 (alongside VLAN 10) on SW1 Gi0/1 trunk',
        check: (d) => {
          const spec = d.SW1?.interfaces['GigabitEthernet0/1']?.trunkAllowedVlans ?? '1-4094';
          return spec === '1-4094' || spec === 'all' || (spec.includes('10') && spec.includes('20'));
        },
      },
    ],
    starterHint: 'On SW1: "show interfaces status" and "show logging". Fix Fa0/2 with shut/no shut, then fix Gi0/1 native & allowed VLANs.',
  },
  {
    id: 'lab-08-etherchannel-svi',
    number: 'Lab 08',
    domainId: 'access',
    category: 'Build',
    title: 'LACP EtherChannel & Layer 3 Switch SVI Routing',
    difficulty: 'Exam-Level',
    estimatedMinutes: 14,
    brief:
      'Bundle Gi0/1 and Gi0/2 between SW1 and SW2 into LACP EtherChannel Group 1 ("channel-group 1 mode active"). On Layer 3 switch SW2, enable "ip routing" and create SVI gateways Vlan10 (10.10.10.1/24) and Vlan20 (10.10.20.1/24) so PC1 and PC2 route between VLANs.',
    initialDevices: {
      SW1: {
        id: 'SW1',
        hostname: 'SW1-ACCESS',
        kind: 'switch',
        vlans: { 1: 'default', 10: 'ENG', 20: 'FIN' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 185,
        y: 120,
        interfaces: {
          'FastEthernet0/1': {
            name: 'FastEthernet0/1',
            shortName: 'Fa0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 10,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'FastEthernet0/2': {
            name: 'FastEthernet0/2',
            shortName: 'Fa0/2',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 20,
            connectedTo: { deviceId: 'PC2', interfaceName: 'Eth0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'trunk',
            trunkAllowedVlans: '10,20',
            connectedTo: { deviceId: 'SW2', interfaceName: 'GigabitEthernet0/1' },
          },
          'GigabitEthernet0/2': {
            name: 'GigabitEthernet0/2',
            shortName: 'Gi0/2',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'trunk',
            trunkAllowedVlans: '10,20',
            connectedTo: { deviceId: 'SW2', interfaceName: 'GigabitEthernet0/2' },
          },
        },
      },
      SW2: {
        id: 'SW2',
        hostname: 'SW2-CORE-L3',
        kind: 'switch',
        vlans: { 1: 'default', 10: 'ENG', 20: 'FIN' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [1],
        x: 375,
        y: 120,
        interfaces: {
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'trunk',
            trunkAllowedVlans: '10,20',
            connectedTo: { deviceId: 'SW1', interfaceName: 'GigabitEthernet0/1' },
          },
          'GigabitEthernet0/2': {
            name: 'GigabitEthernet0/2',
            shortName: 'Gi0/2',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'trunk',
            trunkAllowedVlans: '10,20',
            connectedTo: { deviceId: 'SW1', interfaceName: 'GigabitEthernet0/2' },
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'PC1-ENG',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '10.10.10.1',
        x: 65,
        y: 65,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.10.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/1' },
          },
        },
      },
      PC2: {
        id: 'PC2',
        hostname: 'PC2-FIN',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '10.10.20.1',
        x: 65,
        y: 180,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.20.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/2' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/1', label: 'VLAN 10' },
      { fromDevice: 'PC2', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/2', label: 'VLAN 20' },
      { fromDevice: 'SW1', fromIf: 'Gi0/1', toDevice: 'SW2', toIf: 'Gi0/1', label: 'Po1 LACP (x2)' },
    ],
    objectives: [
      {
        id: 'obj-sw1-lacp',
        label: 'Bundle SW1 Gi0/1 and Gi0/2 into LACP channel-group 1 mode active',
        check: (d) =>
          d.SW1?.interfaces['GigabitEthernet0/1']?.channelGroup?.id === 1 &&
          d.SW1?.interfaces['GigabitEthernet0/1']?.channelGroup?.mode === 'active' &&
          d.SW1?.interfaces['GigabitEthernet0/2']?.channelGroup?.id === 1 &&
          d.SW1?.interfaces['GigabitEthernet0/2']?.channelGroup?.mode === 'active',
      },
      {
        id: 'obj-sw2-lacp',
        label: 'Bundle SW2 Gi0/1 and Gi0/2 into LACP channel-group 1 mode active',
        check: (d) =>
          d.SW2?.interfaces['GigabitEthernet0/1']?.channelGroup?.id === 1 &&
          d.SW2?.interfaces['GigabitEthernet0/1']?.channelGroup?.mode === 'active' &&
          d.SW2?.interfaces['GigabitEthernet0/2']?.channelGroup?.id === 1 &&
          d.SW2?.interfaces['GigabitEthernet0/2']?.channelGroup?.mode === 'active',
      },
      {
        id: 'obj-l3-svi',
        label: 'Enable "ip routing" on SW2 and configure SVI Vlan10 (10.10.10.1/24) & Vlan20 (10.10.20.1/24)',
        check: (d) =>
          Boolean(d.SW2?.ipRouting) &&
          d.SW2?.interfaces['Vlan10']?.ip === '10.10.10.1' &&
          d.SW2?.interfaces['Vlan10']?.mask === '255.255.255.0' &&
          d.SW2?.interfaces['Vlan20']?.ip === '10.10.20.1' &&
          d.SW2?.interfaces['Vlan20']?.mask === '255.255.255.0',
      },
    ],
    starterHint: 'Try "interface range g0/1 - 2" then "channel-group 1 mode active". On SW2 add "ip routing" and "interface vlan 10" / "interface vlan 20".',
  },
  {
    id: 'lab-09-tshoot-ospf',
    number: 'Lab 09',
    domainId: 'connectivity',
    category: 'Troubleshoot',
    faultSummary: 'R1 passive-interface blocks hellos on Gi0/0, R2 uses mismatched Area 1 on Gi0/0, and R2 LAN Gi0/1 is admin down.',
    title: 'Break/Fix: OSPFv2 Adjacency Failure & Area Mismatch',
    difficulty: 'Exam-Level',
    estimatedMinutes: 12,
    brief:
      'R1 and R2 fail to form an OSPFv2 neighbor adjacency, and R1 cannot ping 172.16.20.1. Audit both routers with "show ip ospf interface brief" and "show running-config | section ospf". Remove passive-interface on R1 Gi0/0, move R2 transit network to Area 0, and bring R2 Gi0/1 up.',
    initialDevices: {
      R1: {
        id: 'R1',
        hostname: 'HQ-R1',
        kind: 'router',
        vlans: {},
        ospf: {
          processId: 1,
          routerId: '1.1.1.1',
          passiveInterfaces: ['GigabitEthernet0/0'],
          networks: [{ network: '10.0.12.0', wildcard: '0.0.0.3', area: 0 }],
        },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 150,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '10.0.12.1',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R2', interfaceName: 'GigabitEthernet0/0' },
          },
          Loopback0: {
            name: 'Loopback0',
            shortName: 'Lo0',
            ip: '1.1.1.1',
            mask: '255.255.255.255',
            adminUp: true,
            protocolUp: true,
          },
        },
      },
      R2: {
        id: 'R2',
        hostname: 'BR-R2',
        kind: 'router',
        vlans: {},
        ospf: {
          processId: 1,
          routerId: '2.2.2.2',
          networks: [
            { network: '10.0.12.0', wildcard: '0.0.0.3', area: 1 },
            { network: '172.16.20.0', wildcard: '0.0.0.255', area: 0 },
          ],
        },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 370,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '10.0.12.2',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            ip: '172.16.20.1',
            mask: '255.255.255.0',
            adminUp: false,
            protocolUp: false,
          },
        },
      },
    },
    links: [
      { fromDevice: 'R1', fromIf: 'Gi0/0', toDevice: 'R2', toIf: 'Gi0/0', label: '10.0.12.0/30 · Area 0' },
    ],
    objectives: [
      {
        id: 'obj-r1-nopassive',
        label: 'Remove passive-interface on R1 Gi0/0 under router ospf 1',
        check: (d) => !(d.R1?.ospf.passiveInterfaces ?? []).includes('GigabitEthernet0/0'),
      },
      {
        id: 'obj-r2-area0',
        label: 'Fix R2 transit 10.0.12.0 0.0.0.3 to Area 0 (remove Area 1)',
        check: (d) =>
          Boolean(
            d.R2?.ospf.networks.some(
              (n) => n.area === 0 && matchesWildcard('10.0.12.2', n.network, n.wildcard),
            ),
          ) &&
          !d.R2?.ospf.networks.some((n) => n.area === 1),
      },
      {
        id: 'obj-r2-g01',
        label: 'Bring R2 Gi0/1 (172.16.20.1/24) up with no shutdown',
        check: (d) => Boolean(d.R2?.interfaces['GigabitEthernet0/1']?.adminUp),
      },
    ],
    starterHint: 'On R1: "router ospf 1" -> "no passive-interface g0/0". On R2: remove "area 1" and add "area 0", then "no shut" on Gi0/1.',
  },
  {
    id: 'lab-10-nat-dhcp-relay',
    number: 'Lab 10',
    domainId: 'services',
    category: 'Build',
    title: 'PAT Overload NAT & DHCP Relay Agent',
    difficulty: 'Exam-Level',
    estimatedMinutes: 12,
    brief:
      'Configure R1 to relay client DHCP broadcasts on Gi0/0 to central server 172.16.0.10 ("ip helper-address"), configure PAT overload NAT translating ACL 1 (192.168.10.0/24) to WAN Gi0/1, and add a default route via ISP 203.0.113.2.',
    initialDevices: {
      R1: {
        id: 'R1',
        hostname: 'NAT-GW',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 260,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '192.168.10.1',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'GigabitEthernet0/1': {
            name: 'GigabitEthernet0/1',
            shortName: 'Gi0/1',
            ip: '203.0.113.1',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'ISP', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'LAN-CLIENT',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '192.168.10.1',
        x: 85,
        y: 120,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '192.168.10.25',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
        },
      },
      ISP: {
        id: 'ISP',
        hostname: 'ISP-CORE',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 435,
        y: 120,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '203.0.113.2',
            mask: '255.255.255.252',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/1' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'R1', toIf: 'Gi0/0', label: 'Inside LAN' },
      { fromDevice: 'R1', fromIf: 'Gi0/1', toDevice: 'ISP', toIf: 'Gi0/0', label: 'Outside WAN' },
    ],
    objectives: [
      {
        id: 'obj-relay',
        label: 'Configure "ip helper-address 172.16.0.10" on R1 Gi0/0',
        check: (d) => d.R1?.interfaces['GigabitEthernet0/0']?.helperAddress === '172.16.0.10',
      },
      {
        id: 'obj-nat-ifs',
        label: 'Mark Gi0/0 "ip nat inside" and Gi0/1 "ip nat outside"',
        check: (d) =>
          d.R1?.interfaces['GigabitEthernet0/0']?.natRole === 'inside' &&
          d.R1?.interfaces['GigabitEthernet0/1']?.natRole === 'outside',
      },
      {
        id: 'obj-nat-pat',
        label: 'Configure ACL 1 for 192.168.10.0/24 and "ip nat inside source list 1 interface g0/1 overload"',
        check: (d) => {
          const acl = d.R1?.acls['1'];
          const hasAcl = Boolean(acl?.rules.some((r) => r.includes('permit') && r.includes('192.168.10.0')));
          const hasPat = Boolean(
            d.R1?.natRules?.some((n) => n.aclId === '1' && n.overloadInterface === 'GigabitEthernet0/1'),
          );
          return hasAcl && hasPat;
        },
      },
      {
        id: 'obj-def-route',
        label: 'Configure default route 0.0.0.0 0.0.0.0 via 203.0.113.2',
        check: (d) =>
          Boolean(
            d.R1?.staticRoutes.some(
              (r) => r.prefix === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '203.0.113.2',
            ),
          ),
      },
    ],
    starterHint: 'Use "access-list 1 permit 192.168.10.0 0.0.0.255", then "ip nat inside source list 1 interface g0/1 overload".',
  },
  {
    id: 'lab-11-hsrp-failover',
    number: 'Lab 11',
    domainId: 'connectivity',
    category: 'Build',
    title: 'HSRP First-Hop Gateway Redundancy (Active / Standby)',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    brief:
      'PC1 uses 10.10.10.1 as its default gateway. Configure HSRP group 10 with virtual IP 10.10.10.1 on both R1 and R2 Gi0/0. Give R1 priority 110 and enable preempt so R1 always holds the Active gateway role.',
    initialDevices: {
      R1: {
        id: 'R1',
        hostname: 'GW-R1',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 380,
        y: 65,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '10.10.10.2',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/1' },
          },
        },
      },
      R2: {
        id: 'R2',
        hostname: 'GW-R2',
        kind: 'router',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 380,
        y: 180,
        interfaces: {
          'GigabitEthernet0/0': {
            name: 'GigabitEthernet0/0',
            shortName: 'Gi0/0',
            ip: '10.10.10.3',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/2' },
          },
        },
      },
      SW1: {
        id: 'SW1',
        hostname: 'SW1',
        kind: 'switch',
        vlans: { 1: 'default' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 225,
        y: 120,
        interfaces: {
          'FastEthernet0/1': {
            name: 'FastEthernet0/1',
            shortName: 'Fa0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 1,
            connectedTo: { deviceId: 'R1', interfaceName: 'GigabitEthernet0/0' },
          },
          'FastEthernet0/2': {
            name: 'FastEthernet0/2',
            shortName: 'Fa0/2',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 1,
            connectedTo: { deviceId: 'R2', interfaceName: 'GigabitEthernet0/0' },
          },
          'FastEthernet0/3': {
            name: 'FastEthernet0/3',
            shortName: 'Fa0/3',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 1,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'PC1',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        defaultGateway: '10.10.10.1',
        x: 80,
        y: 120,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '10.10.10.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/3' },
          },
        },
      },
    },
    links: [
      { fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/3', label: '10.10.10.0/24' },
      { fromDevice: 'SW1', fromIf: 'Fa0/1', toDevice: 'R1', toIf: 'Gi0/0', label: 'Primary GW' },
      { fromDevice: 'SW1', fromIf: 'Fa0/2', toDevice: 'R2', toIf: 'Gi0/0', label: 'Backup GW' },
    ],
    objectives: [
      {
        id: 'obj-r1-hsrp',
        label: 'Configure R1 Gi0/0 standby 10 ip 10.10.10.1, priority 110, and preempt',
        check: (d) => {
          const h = d.R1?.interfaces['GigabitEthernet0/0']?.hsrp;
          return Boolean(h && h.group === 10 && h.vip === '10.10.10.1' && (h.priority ?? 100) >= 110 && h.preempt);
        },
      },
      {
        id: 'obj-r2-hsrp',
        label: 'Configure R2 Gi0/0 standby 10 ip 10.10.10.1',
        check: (d) => {
          const h = d.R2?.interfaces['GigabitEthernet0/0']?.hsrp;
          return Boolean(h && h.group === 10 && h.vip === '10.10.10.1');
        },
      },
    ],
    starterHint: 'Under R1 interface g0/0: "standby 10 ip 10.10.10.1", "standby 10 priority 110", "standby 10 preempt".',
  },
  {
    id: 'lab-12-ssh-l2-hardening',
    number: 'Lab 12',
    domainId: 'security',
    category: 'Build',
    title: 'SSHv2 Management & PortFast / BPDU Guard Hardening',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    brief:
      'Secure SW1 management and edge access: configure "ip domain-name lab.local", local account "username admin secret Cisco@123", 2048-bit RSA keys, "ip ssh version 2", and restrict "line vty 0 15" to "login local" and "transport input ssh". Enable PortFast and BPDU Guard on access port Fa0/1.',
    initialDevices: {
      SW1: {
        id: 'SW1',
        hostname: 'SW1-SEC',
        kind: 'switch',
        vlans: { 1: 'default' },
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 260,
        y: 120,
        interfaces: {
          'FastEthernet0/1': {
            name: 'FastEthernet0/1',
            shortName: 'Fa0/1',
            adminUp: true,
            protocolUp: true,
            switchportMode: 'access',
            accessVlan: 1,
            connectedTo: { deviceId: 'PC1', interfaceName: 'Eth0' },
          },
          'Vlan1': {
            name: 'Vlan1',
            shortName: 'Vl1',
            ip: '192.168.1.2',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            isSvi: true,
            routedPort: true,
          },
        },
      },
      PC1: {
        id: 'PC1',
        hostname: 'ADMIN-PC',
        kind: 'host',
        vlans: {},
        ospf: { networks: [] },
        staticRoutes: [],
        acls: {},
        stpRootVlans: [],
        x: 95,
        y: 120,
        interfaces: {
          Eth0: {
            name: 'Eth0',
            shortName: 'Eth0',
            ip: '192.168.1.10',
            mask: '255.255.255.0',
            adminUp: true,
            protocolUp: true,
            connectedTo: { deviceId: 'SW1', interfaceName: 'FastEthernet0/1' },
          },
        },
      },
    },
    links: [{ fromDevice: 'PC1', fromIf: 'Eth0', toDevice: 'SW1', toIf: 'Fa0/1', label: 'Mgmt Edge' }],
    objectives: [
      {
        id: 'obj-ssh-keys',
        label: 'Configure domain lab.local, user admin, 2048-bit RSA key & SSH v2',
        check: (d) =>
          Boolean(
            d.SW1?.domainName === 'lab.local' &&
              d.SW1?.users?.admin &&
              (d.SW1?.rsaModulus ?? 0) >= 2048 &&
              d.SW1?.sshVersion === 2,
          ),
      },
      {
        id: 'obj-vty-ssh',
        label: 'Set VTY lines to "login local" and "transport input ssh"',
        check: (d) =>
          Boolean(d.SW1?.vty?.loginLocal && d.SW1?.vty?.transportInput?.includes('ssh') && !d.SW1?.vty?.transportInput?.includes('telnet')),
      },
      {
        id: 'obj-edge-stp',
        label: 'Enable PortFast & BPDU Guard on SW1 Fa0/1',
        check: (d) =>
          Boolean(
            d.SW1?.interfaces['FastEthernet0/1']?.portFast &&
              d.SW1?.interfaces['FastEthernet0/1']?.bpduGuard,
          ),
      },
    ],
    starterHint: 'Remember the SSH sequence: ip domain-name -> username admin secret ... -> crypto key generate rsa modulus 2048 -> ip ssh version 2.',
  },
];
