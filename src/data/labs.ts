import { matchesWildcard } from '../engine/iosSimulator';
import { CcnaLab } from '../types/ccna';

export const CCNA_LABS: CcnaLab[] = [
  {
    id: 'lab-01-basic-router',
    number: 'Lab 01',
    domainId: 'fundamentals',
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
];
