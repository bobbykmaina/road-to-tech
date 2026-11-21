import { SimDevice, SimInterface } from '../types/ccna';

export type CliMode =
  | 'user'
  | 'priv'
  | 'config'
  | 'if'
  | 'subif'
  | 'router-ospf'
  | 'vlan'
  | 'acl';

export interface CliSessionState {
  deviceId: string;
  mode: CliMode;
  activeIf?: string;
  activeSubIf?: string;
  activeVlan?: number;
  activeAcl?: string;
}

export interface CliExecResult {
  output: string[];
  nextSession: CliSessionState;
  devices: Record<string, SimDevice>;
  clearTerminal?: boolean;
  pingTargetIp?: string;
  pingSuccess?: boolean;
}

export function ipToInt(ip: string): number {
  const parts = ip.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return -1;
  }
  return (((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0);
}

export function intToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

export function maskToCidr(mask: string): number {
  const m = ipToInt(mask);
  if (m < 0) return 0;
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((m & (1 << i)) !== 0) count++;
    else break;
  }
  return count;
}

export function isValidIpv4(ip: string): boolean {
  return ipToInt(ip) >= 0;
}

export function sameSubnet(ipA: string, maskA: string, ipB: string, maskB?: string): boolean {
  const a = ipToInt(ipA);
  const ma = ipToInt(maskA);
  const b = ipToInt(ipB);
  const mb = maskB ? ipToInt(maskB) : ma;
  if (a < 0 || ma < 0 || b < 0 || mb < 0) return false;
  if (ma !== mb) return false;
  return (a & ma) === (b & ma);
}

export function networkOf(ip: string, mask: string): string {
  const a = ipToInt(ip);
  const m = ipToInt(mask);
  if (a < 0 || m < 0) return ip;
  return intToIp((a & m) >>> 0);
}

export function matchesWildcard(ip: string, network: string, wildcard: string): boolean {
  const ipNum = ipToInt(ip);
  const netNum = ipToInt(network);
  const wcNum = ipToInt(wildcard);
  if (ipNum < 0 || netNum < 0 || wcNum < 0) return false;
  const mask = (~wcNum) >>> 0;
  return (ipNum & mask) === (netNum & mask);
}

export function getPrompt(device: SimDevice, session: CliSessionState): string {
  const h = device.hostname;
  switch (session.mode) {
    case 'user':
      return `${h}>`;
    case 'priv':
      return `${h}#`;
    case 'config':
      return `${h}(config)#`;
    case 'if':
      return `${h}(config-if)#`;
    case 'subif':
      return `${h}(config-subif)#`;
    case 'router-ospf':
      return `${h}(config-router)#`;
    case 'vlan':
      return `${h}(config-vlan)#`;
    case 'acl':
      return `${h}(config-ext-nacl)#`;
  }
}

function invalidInputLines(rawInput: string, badToken?: string): string[] {
  const idx = badToken ? Math.max(0, rawInput.toLowerCase().indexOf(badToken.toLowerCase())) : 0;
  const marker = `${' '.repeat(idx)}^`;
  return [marker, `% Invalid input detected at '^' marker.`];
}

function matchPrefix(token: string, candidates: string[]): { match: string | null; ambiguous: boolean } {
  const lower = token.toLowerCase();
  const exact = candidates.find((c) => c === lower);
  if (exact) return { match: exact, ambiguous: false };
  const matches = candidates.filter((c) => c.startsWith(lower));
  if (matches.length === 1) return { match: matches[0], ambiguous: false };
  if (matches.length > 1) return { match: null, ambiguous: true };
  return { match: null, ambiguous: false };
}

function normalizeInterfaceInput(
  raw: string,
  device: SimDevice,
): { ifName: string; subName?: string } | null {
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, '');
  const [basePart, subPart] = cleaned.split('.');

  let matchedKey: string | undefined;
  for (const key of Object.keys(device.interfaces)) {
    const lk = key.toLowerCase();
    const ls = device.interfaces[key].shortName.toLowerCase();
    const prefixInput = basePart.replace(/[\d/]+$/, '');
    const prefixKey = lk.replace(/[\d/]+$/, '');
    const prefixShort = ls.replace(/[\d/]+$/, '');
    const numSuffixInput = basePart.replace(/^[a-z]+/, '');
    const numSuffixKey = lk.replace(/^[a-z]+/, '');

    if (
      numSuffixInput === numSuffixKey &&
      prefixInput.length > 0 &&
      (prefixKey.startsWith(prefixInput) || prefixShort.startsWith(prefixInput))
    ) {
      matchedKey = key;
      break;
    }
  }

  if (!matchedKey) return null;
  if (subPart !== undefined) {
    if (!/^\d+$/.test(subPart)) return null;
    return { ifName: matchedKey, subName: `${matchedKey}.${subPart}` };
  }
  return { ifName: matchedKey };
}

function isLinkOperational(
  _deviceId: string,
  iface: SimInterface,
  devices: Record<string, SimDevice>,
): boolean {
  if (!iface.adminUp) return false;
  if (!iface.connectedTo) return iface.name.startsWith('Loopback');
  const peer = devices[iface.connectedTo.deviceId];
  const peerIf = peer?.interfaces[iface.connectedTo.interfaceName];
  if (!peerIf) return false;
  return peerIf.adminUp;
}

function computeOspfNeighbors(
  deviceId: string,
  devices: Record<string, SimDevice>,
): { neighborId: string; pri: number; state: string; address: string; iface: string }[] {
  const dev = devices[deviceId];
  if (!dev || !dev.ospf.processId || dev.ospf.networks.length === 0) return [];

  const neighbors: { neighborId: string; pri: number; state: string; address: string; iface: string }[] = [];

  for (const iface of Object.values(dev.interfaces)) {
    if (!iface.ip || !iface.mask || !isLinkOperational(deviceId, iface, devices)) continue;
    const localMatch = dev.ospf.networks.find((n) => matchesWildcard(iface.ip!, n.network, n.wildcard));
    if (!localMatch || !iface.connectedTo) continue;

    const peer = devices[iface.connectedTo.deviceId];
    const peerIf = peer?.interfaces[iface.connectedTo.interfaceName];
    if (!peer || !peerIf || !peerIf.ip || !peerIf.mask || !isLinkOperational(peer.id, peerIf, devices)) continue;
    if (!peer.ospf.processId) continue;

    if (!sameSubnet(iface.ip, iface.mask, peerIf.ip, peerIf.mask)) continue;

    const peerMatch = peer.ospf.networks.find((n) => matchesWildcard(peerIf.ip!, n.network, n.wildcard));
    if (!peerMatch || peerMatch.area !== localMatch.area) continue;

    const peerRid =
      peer.ospf.routerId ||
      Object.values(peer.interfaces).find((i) => i.name.startsWith('Loopback') && i.ip)?.ip ||
      peerIf.ip;

    neighbors.push({
      neighborId: peerRid,
      pri: 1,
      state: 'FULL/DR',
      address: peerIf.ip,
      iface: iface.name,
    });
  }

  return neighbors;
}

interface ComputedRoute {
  code: string;
  prefix: string;
  cidr: number;
  ad: number;
  metric: number;
  nextHop?: string;
  outIf: string;
}

export function computeRoutingTable(
  deviceId: string,
  devices: Record<string, SimDevice>,
): ComputedRoute[] {
  const dev = devices[deviceId];
  if (!dev) return [];
  const routes: ComputedRoute[] = [];

  for (const iface of Object.values(dev.interfaces)) {
    if (iface.ip && iface.mask && isLinkOperational(deviceId, iface, devices)) {
      routes.push({
        code: 'C',
        prefix: networkOf(iface.ip, iface.mask),
        cidr: maskToCidr(iface.mask),
        ad: 0,
        metric: 0,
        outIf: iface.name,
      });
    }
    if (iface.subinterfaces && isLinkOperational(deviceId, iface, devices)) {
      for (const [subName, sub] of Object.entries(iface.subinterfaces)) {
        if (sub.ip && sub.mask && sub.adminUp) {
          routes.push({
            code: 'C',
            prefix: networkOf(sub.ip, sub.mask),
            cidr: maskToCidr(sub.mask),
            ad: 0,
            metric: 0,
            outIf: subName,
          });
        }
      }
    }
  }

  for (const st of dev.staticRoutes) {
    const viaConnected = Object.values(dev.interfaces).find(
      (iface) =>
        iface.ip &&
        iface.mask &&
        isLinkOperational(deviceId, iface, devices) &&
        sameSubnet(iface.ip, iface.mask, st.nextHop),
    );
    if (viaConnected) {
      routes.push({
        code: st.prefix === '0.0.0.0' ? 'S*' : 'S',
        prefix: st.prefix,
        cidr: maskToCidr(st.mask),
        ad: st.ad,
        metric: 0,
        nextHop: st.nextHop,
        outIf: viaConnected.name,
      });
    }
  }

  const neighbors = computeOspfNeighbors(deviceId, devices);
  for (const nei of neighbors) {
    const outIface = dev.interfaces[nei.iface];
    if (!outIface?.connectedTo) continue;
    const peer = devices[outIface.connectedTo.deviceId];
    if (!peer) continue;

    for (const pIf of Object.values(peer.interfaces)) {
      if (!pIf.ip || !pIf.mask || !isLinkOperational(peer.id, pIf, devices)) continue;
      const peerOspfMatch = peer.ospf.networks.some((n) => matchesWildcard(pIf.ip!, n.network, n.wildcard));
      if (!peerOspfMatch) continue;
      const net = networkOf(pIf.ip, pIf.mask);
      const cidr = maskToCidr(pIf.mask);
      const alreadyConnected = routes.some((r) => r.prefix === net && r.cidr === cidr && r.code === 'C');
      const alreadyStaticLower = routes.some((r) => r.prefix === net && r.cidr === cidr && r.ad < 110);
      if (!alreadyConnected && !alreadyStaticLower) {
        routes.push({
          code: 'O',
          prefix: net,
          cidr,
          ad: 110,
          metric: pIf.name.startsWith('Loopback') ? 1 : 2,
          nextHop: nei.address,
          outIf: nei.iface,
        });
      }
    }
  }

  return routes;
}

function simulatePing(
  sourceDeviceId: string,
  targetIp: string,
  devices: Record<string, SimDevice>,
): { success: boolean; lines: string[] } {
  const visited = new Set<string>();
  let currentId = sourceDeviceId;

  for (let hop = 0; hop < 8; hop++) {
    if (visited.has(currentId)) break;
    visited.add(currentId);
    const dev = devices[currentId];
    if (!dev) break;

    for (const iface of Object.values(dev.interfaces)) {
      if (iface.ip === targetIp && isLinkOperational(currentId, iface, devices)) {
        return {
          success: true,
          lines: [
            `Type escape sequence to abort.`,
            `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
            `!!!!!`,
            `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
          ],
        };
      }
      if (iface.subinterfaces && isLinkOperational(currentId, iface, devices)) {
        for (const sub of Object.values(iface.subinterfaces)) {
          if (sub.ip === targetIp && sub.adminUp) {
            return {
              success: true,
              lines: [
                `Type escape sequence to abort.`,
                `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
                `!!!!!`,
                `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
              ],
            };
          }
        }
      }
    }

    if (dev.kind === 'host') {
      const eth = Object.values(dev.interfaces)[0];
      if (!eth || !eth.ip || !eth.mask || !isLinkOperational(currentId, eth, devices)) break;

      if (sameSubnet(eth.ip, eth.mask, targetIp)) {
        for (const other of Object.values(devices)) {
          if (other.id === currentId || other.kind !== 'host') continue;
          const oEth = Object.values(other.interfaces)[0];
          if (oEth?.ip === targetIp && isLinkOperational(other.id, oEth, devices)) {
            return {
              success: true,
              lines: [
                `Type escape sequence to abort.`,
                `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
                `!!!!!`,
                `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms`,
              ],
            };
          }
        }
      }

      if (!dev.defaultGateway) break;
      let nextRouterId: string | undefined;
      for (const candidate of Object.values(devices)) {
        if (candidate.kind !== 'router') continue;
        for (const cif of Object.values(candidate.interfaces)) {
          if (cif.ip === dev.defaultGateway && isLinkOperational(candidate.id, cif, devices)) {
            nextRouterId = candidate.id;
          }
          if (cif.subinterfaces && isLinkOperational(candidate.id, cif, devices)) {
            for (const sub of Object.values(cif.subinterfaces)) {
              if (sub.ip === dev.defaultGateway && sub.adminUp && eth.connectedTo) {
                const sw = devices[eth.connectedTo.deviceId];
                const swAccess = sw?.interfaces[eth.connectedTo.interfaceName];
                const swTrunk = sw
                  ? Object.values(sw.interfaces).find((i) => i.connectedTo?.deviceId === candidate.id)
                  : undefined;
                if (
                  swAccess?.accessVlan === sub.vlanId &&
                  swAccess.adminUp &&
                  swTrunk?.switchportMode === 'trunk' &&
                  swTrunk.adminUp
                ) {
                  nextRouterId = candidate.id;
                }
              }
            }
          }
        }
      }
      if (!nextRouterId) break;
      currentId = nextRouterId;
      continue;
    }

    const routes = computeRoutingTable(currentId, devices).sort((a, b) => b.cidr - a.cidr);
    const targetInt = ipToInt(targetIp);
    const best = routes.find((r) => {
      if (r.cidr === 0) return true;
      const maskInt = (0xffffffff << (32 - r.cidr)) >>> 0;
      return (targetInt & maskInt) === ipToInt(r.prefix);
    });

    if (!best) break;

    if (best.code === 'C') {
      for (const other of Object.values(devices)) {
        if (other.id === currentId) continue;
        for (const oif of Object.values(other.interfaces)) {
          if (oif.ip === targetIp && isLinkOperational(other.id, oif, devices)) {
            return {
              success: true,
              lines: [
                `Type escape sequence to abort.`,
                `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
                `!!!!!`,
                `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
              ],
            };
          }
        }
      }
      break;
    }

    if (best.nextHop) {
      let nextDevId: string | undefined;
      for (const candidate of Object.values(devices)) {
        for (const cif of Object.values(candidate.interfaces)) {
          if (cif.ip === best.nextHop && isLinkOperational(candidate.id, cif, devices)) {
            nextDevId = candidate.id;
          }
        }
      }
      if (!nextDevId) break;
      currentId = nextDevId;
    } else {
      break;
    }
  }

  return {
    success: false,
    lines: [
      `Type escape sequence to abort.`,
      `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
      `.....`,
      `Success rate is 0 percent (0/5)`,
    ],
  };
}

function renderShowRunningConfig(dev: SimDevice): string[] {
  const lines: string[] = [
    'Building configuration...',
    '',
    'Current configuration : 1142 bytes',
    '!',
    `hostname ${dev.hostname}`,
  ];
  if (dev.enableSecret) {
    lines.push(`enable secret 5 $1$mERr$${dev.enableSecret}`);
  }
  lines.push('!');

  if (dev.kind === 'switch') {
    for (const [vid, vname] of Object.entries(dev.vlans)) {
      if (Number(vid) !== 1) {
        lines.push(`vlan ${vid}`);
        lines.push(` name ${vname}`);
      }
    }
    if (dev.stpRootVlans.length > 0) {
      lines.push(`spanning-tree vlan ${dev.stpRootVlans.join(',')} priority 24576`);
    }
    lines.push('!');
  }

  for (const iface of Object.values(dev.interfaces)) {
    lines.push(`interface ${iface.name}`);
    if (iface.ip && iface.mask) {
      lines.push(` ip address ${iface.ip} ${iface.mask}`);
    }
    if (iface.switchportMode === 'access') {
      lines.push(' switchport mode access');
      if (iface.accessVlan && iface.accessVlan !== 1) {
        lines.push(` switchport access vlan ${iface.accessVlan}`);
      }
    } else if (iface.switchportMode === 'trunk') {
      lines.push(' switchport mode trunk');
      if (iface.trunkAllowedVlans) {
        lines.push(` switchport trunk allowed vlan ${iface.trunkAllowedVlans}`);
      }
      if (iface.nativeVlan && iface.nativeVlan !== 1) {
        lines.push(` switchport trunk native vlan ${iface.nativeVlan}`);
      }
    }
    if (iface.portSecurity?.enabled) {
      lines.push(' switchport port-security');
      lines.push(` switchport port-security maximum ${iface.portSecurity.maximum}`);
      lines.push(` switchport port-security violation ${iface.portSecurity.violation}`);
      if (iface.portSecurity.macSticky) {
        lines.push(' switchport port-security mac-address sticky');
      }
    }
    if (iface.accessGroupIn) lines.push(` ip access-group ${iface.accessGroupIn} in`);
    if (iface.accessGroupOut) lines.push(` ip access-group ${iface.accessGroupOut} out`);
    if (!iface.adminUp) lines.push(' shutdown');
    lines.push('!');

    if (iface.subinterfaces) {
      for (const [subName, sub] of Object.entries(iface.subinterfaces)) {
        lines.push(`interface ${subName}`);
        lines.push(` encapsulation dot1Q ${sub.vlanId}`);
        if (sub.ip && sub.mask) {
          lines.push(` ip address ${sub.ip} ${sub.mask}`);
        }
        if (!sub.adminUp) lines.push(' shutdown');
        lines.push('!');
      }
    }
  }

  if (dev.ospf.processId) {
    lines.push(`router ospf ${dev.ospf.processId}`);
    if (dev.ospf.routerId) lines.push(` router-id ${dev.ospf.routerId}`);
    for (const net of dev.ospf.networks) {
      lines.push(` network ${net.network} ${net.wildcard} area ${net.area}`);
    }
    lines.push('!');
  }

  for (const st of dev.staticRoutes) {
    lines.push(
      `ip route ${st.prefix} ${st.mask} ${st.nextHop}${st.ad !== 1 ? ` ${st.ad}` : ''}`,
    );
  }

  for (const acl of Object.values(dev.acls)) {
    lines.push(`ip access-list ${acl.type} ${acl.id}`);
    for (const rule of acl.rules) {
      lines.push(` ${rule}`);
    }
    lines.push('!');
  }

  lines.push('end');
  return lines;
}

function handleShowCommand(
  args: string[],
  dev: SimDevice,
  devices: Record<string, SimDevice>,
): { status: 'ok'; lines: string[] } | { status: 'incomplete' } | { status: 'invalid'; token: string } {
  if (args.length === 0) return { status: 'incomplete' };
  const a0 = args[0].toLowerCase();
  const a1 = args[1]?.toLowerCase() ?? '';
  const a2 = args[2]?.toLowerCase() ?? '';

  if ('running-config'.startsWith(a0)) {
    return { status: 'ok', lines: renderShowRunningConfig(dev) };
  }

  if (a0 === 'ip') {
    if (!a1) return { status: 'incomplete' };

    if ('interface'.startsWith(a1)) {
      if (!a2 || 'brief'.startsWith(a2)) {
        const lines = [
          'Interface                  IP-Address      OK? Method Status                Protocol',
        ];
        for (const iface of Object.values(dev.interfaces)) {
          const op = isLinkOperational(dev.id, iface, devices);
          const status = !iface.adminUp ? 'administratively down' : op ? 'up' : 'down';
          const proto = op ? 'up' : 'down';
          const ipStr = iface.ip ?? 'unassigned';
          const method = iface.ip ? 'manual' : 'unset';
          lines.push(
            `${iface.name.padEnd(27)}${ipStr.padEnd(16)}YES ${method.padEnd(7)}${status.padEnd(22)}${proto}`,
          );
          if (iface.subinterfaces) {
            for (const [subName, sub] of Object.entries(iface.subinterfaces)) {
              const subOp = sub.adminUp && isLinkOperational(dev.id, iface, devices);
              lines.push(
                `${subName.padEnd(27)}${(sub.ip ?? 'unassigned').padEnd(16)}YES manual ${(subOp ? 'up' : 'administratively down').padEnd(22)}${subOp ? 'up' : 'down'}`,
              );
            }
          }
        }
        return { status: 'ok', lines };
      }
      return { status: 'invalid', token: args[2] };
    }

    if ('route'.startsWith(a1)) {
      const routes = computeRoutingTable(dev.id, devices);
      const lines = [
        'Codes: C - connected, S - static, O - OSPF, * - candidate default',
        '',
      ];
      if (routes.length === 0) {
        lines.push('Gateway of last resort is not set (no active L3 interfaces).');
        return { status: 'ok', lines };
      }
      const hasDef = routes.some((r) => r.prefix === '0.0.0.0');
      lines.push(
        hasDef
          ? `Gateway of last resort is ${routes.find((r) => r.prefix === '0.0.0.0')?.nextHop} to network 0.0.0.0`
          : 'Gateway of last resort is not set',
        '',
      );
      for (const r of routes) {
        if (r.code === 'C') {
          lines.push(`C    ${r.prefix}/${r.cidr} is directly connected, ${r.outIf}`);
        } else {
          lines.push(
            `${r.code.padEnd(5)}${r.prefix}/${r.cidr} [${r.ad}/${r.metric}] via ${r.nextHop}, ${r.outIf}`,
          );
        }
      }
      return { status: 'ok', lines };
    }

    if ('ospf'.startsWith(a1)) {
      if (!a2) return { status: 'incomplete' };
      if ('neighbor'.startsWith(a2) || 'neighbors'.startsWith(a2)) {
        const neighbors = computeOspfNeighbors(dev.id, devices);
        if (neighbors.length === 0) {
          return { status: 'ok', lines: ['No OSPF neighbors in active adjacency state.'] };
        }
        const lines = [
          'Neighbor ID     Pri   State           Dead Time   Address         Interface',
        ];
        for (const n of neighbors) {
          lines.push(
            `${n.neighborId.padEnd(16)}${String(n.pri).padEnd(6)}${n.state.padEnd(16)}00:00:34    ${n.address.padEnd(16)}${n.iface}`,
          );
        }
        return { status: 'ok', lines };
      }
      return { status: 'invalid', token: args[2] };
    }

    return { status: 'invalid', token: args[1] };
  }

  if ('vlan'.startsWith(a0)) {
    if (a1 && !'brief'.startsWith(a1)) {
      return { status: 'invalid', token: args[1] };
    }
    const lines = [
      'VLAN Name                             Status    Ports',
      '---- -------------------------------- --------- -------------------------------',
    ];
    for (const [vidStr, vname] of Object.entries(dev.vlans)) {
      const vid = Number(vidStr);
      const ports = Object.values(dev.interfaces)
        .filter((i) => i.switchportMode !== 'trunk' && (i.accessVlan ?? 1) === vid)
        .map((i) => i.shortName)
        .join(', ');
      lines.push(`${vidStr.padEnd(5)}${vname.padEnd(33)}active    ${ports}`);
    }
    return { status: 'ok', lines };
  }

  if ('interfaces'.startsWith(a0)) {
    if (!a1) return { status: 'incomplete' };
    if ('trunk'.startsWith(a1)) {
      const trunks = Object.values(dev.interfaces).filter((i) => i.switchportMode === 'trunk');
      if (trunks.length === 0) return { status: 'ok', lines: ['No active 802.1Q trunk ports configured.'] };
      const lines = [
        'Port        Mode             Encapsulation  Status        Native vlan',
      ];
      for (const t of trunks) {
        const op = isLinkOperational(dev.id, t, devices);
        lines.push(
          `${t.shortName.padEnd(12)}${'on'.padEnd(17)}${'802.1q'.padEnd(15)}${(op ? 'trunking' : 'not-connect').padEnd(14)}${t.nativeVlan ?? 1}`,
        );
      }
      lines.push('', 'Port        Vlans allowed on trunk');
      for (const t of trunks) {
        lines.push(`${t.shortName.padEnd(12)}${t.trunkAllowedVlans ?? '1-4094'}`);
      }
      return { status: 'ok', lines };
    }
    return { status: 'invalid', token: args[1] };
  }

  if ('spanning-tree'.startsWith(a0)) {
    const isRoot = dev.stpRootVlans.includes(1);
    return {
      status: 'ok',
      lines: [
        'VLAN0001',
        '  Spanning tree enabled protocol rstp',
        `  Root ID    Priority    24577`,
        `             Address     ${isRoot ? '0010.1111.aa01 (This bridge is the root)' : '0010.1111.aa01'}`,
        `  Bridge ID  Priority    ${isRoot ? '24577 (priority 24576 sys-id-ext 1)' : '32769 (priority 32768 sys-id-ext 1)'}`,
        '',
        'Interface           Role Sts Cost      Prio.Nbr Type',
        '------------------- ---- --- --------- -------- --------------------------------',
        ...Object.values(dev.interfaces).map((i) => {
          const up = isLinkOperational(dev.id, i, devices);
          return `${i.shortName.padEnd(20)}${isRoot ? 'Desg' : 'Root'} ${up ? 'FWD' : 'BLK'} 4         128.1    P2p`;
        }),
      ],
    };
  }

  if ('access-lists'.startsWith(a0)) {
    const acls = Object.values(dev.acls);
    if (acls.length === 0) return { status: 'ok', lines: ['No IP access lists configured.'] };
    const lines: string[] = [];
    for (const acl of acls) {
      lines.push(`${acl.type === 'extended' ? 'Extended' : 'Standard'} IP access list ${acl.id}`);
      acl.rules.forEach((rule, idx) => {
        lines.push(`    ${(idx + 1) * 10} ${rule}`);
      });
    }
    return { status: 'ok', lines };
  }

  if ('port-security'.startsWith(a0)) {
    const secured = Object.values(dev.interfaces).filter((i) => i.portSecurity?.enabled);
    if (secured.length === 0) return { status: 'ok', lines: ['Port Security is not enabled on any interface.'] };
    const lines = [
      'Secure Port  MaxSecureAddr  CurrentAddr  SecurityViolation  Security Action',
      '               (Count)       (Count)          (Count)',
      '---------------------------------------------------------------------------',
    ];
    for (const i of secured) {
      lines.push(
        `${i.shortName.padEnd(13)}${String(i.portSecurity!.maximum).padEnd(15)}${'1'.padEnd(13)}${'0'.padEnd(19)}${i.portSecurity!.violation}`,
      );
    }
    return { status: 'ok', lines };
  }

  if ('cdp'.startsWith(a0)) {
    if (!a1) return { status: 'incomplete' };
    if ('neighbors'.startsWith(a1)) {
      const lines = [
        'Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID',
      ];
      for (const iface of Object.values(dev.interfaces)) {
        if (iface.connectedTo && isLinkOperational(dev.id, iface, devices)) {
          const peer = devices[iface.connectedTo.deviceId];
          if (peer) {
            lines.push(
              `${peer.hostname.padEnd(17)}${iface.shortName.padEnd(18)}145        ${peer.kind === 'router' ? 'R S I' : 'S I'}       IOSv      ${iface.connectedTo.interfaceName}`,
            );
          }
        }
      }
      return { status: 'ok', lines };
    }
    return { status: 'invalid', token: args[1] };
  }

  return { status: 'invalid', token: args[0] };
}

export function getModeCompletions(mode: CliMode, deviceKind: SimDevice['kind']): string[] {
  switch (mode) {
    case 'user':
      return ['enable', 'ping', 'show ip interface brief', 'show running-config', 'exit'];
    case 'priv':
      return [
        'configure terminal',
        'show ip interface brief',
        'show running-config',
        'show ip route',
        'show vlan brief',
        'show interfaces trunk',
        'show ip ospf neighbor',
        'show spanning-tree',
        'show access-lists',
        'show port-security',
        'show cdp neighbors',
        'ping',
        'copy running-config startup-config',
        'clear',
      ];
    case 'config':
      return [
        'hostname',
        'enable secret',
        'interface',
        'ip route',
        'router ospf 1',
        'ip access-list extended',
        ...(deviceKind === 'switch' ? ['vlan', 'spanning-tree vlan 1 root primary'] : []),
        'end',
        'exit',
      ];
    case 'if':
      return [
        'ip address',
        'no shutdown',
        'shutdown',
        ...(deviceKind === 'switch'
          ? [
              'switchport mode access',
              'switchport access vlan',
              'switchport mode trunk',
              'switchport trunk allowed vlan',
              'switchport trunk native vlan',
              'switchport port-security',
              'switchport port-security maximum',
              'switchport port-security violation',
              'switchport port-security mac-address sticky',
            ]
          : ['ip access-group']),
        'exit',
        'end',
      ];
    case 'subif':
      return ['encapsulation dot1Q', 'ip address', 'no shutdown', 'exit', 'end'];
    case 'router-ospf':
      return ['router-id', 'network', 'exit', 'end'];
    case 'vlan':
      return ['name', 'exit', 'end'];
    case 'acl':
      return ['permit', 'deny', 'exit', 'end'];
  }
}

export function getContextHelp(
  rawBeforeQuestion: string,
  session: CliSessionState,
  dev: SimDevice,
): string[] {
  const clean = rawBeforeQuestion.trim().toLowerCase();
  const cmds = getModeCompletions(session.mode, dev.kind);
  if (!clean) {
    return ['Exec/Config commands:', ...cmds.map((c) => `  ${c}`)];
  }
  const tokens = clean.split(/\s+/);
  if (tokens[0] === 'show' || 'show'.startsWith(tokens[0])) {
    if (tokens.length === 1) {
      return [
        'Show options:',
        '  access-lists          List IP access lists',
        '  cdp neighbors         CDP neighbor summary',
        '  interfaces trunk      802.1Q trunk status',
        '  ip interface brief    Brief IP & link status',
        '  ip ospf neighbor      OSPF neighbor adjacencies',
        '  ip route              IPv4 routing table',
        '  port-security         Port-security status',
        '  running-config        Current active configuration',
        '  spanning-tree         Spanning tree topology',
        '  vlan brief            VLAN status summary',
      ];
    }
    if (tokens[1] === 'ip') {
      return [
        'Show IP options:',
        '  interface brief       Brief status and configuration',
        '  ospf neighbor         OSPF neighbor table',
        '  route                 IP routing table',
      ];
    }
  }
  if (session.mode === 'if' && 'switchport'.startsWith(tokens[0])) {
    return [
      'Switchport options:',
      '  access vlan <1-4094>          Set VLAN when in access mode',
      '  mode <access|trunk>           Set trunking mode unconditionally',
      '  port-security                 Enable Layer 2 port security',
      '  trunk allowed vlan <list>     Set allowed VLANs on trunk',
      '  trunk native vlan <id>        Set native VLAN on trunk',
    ];
  }
  const matching = cmds.filter((c) => c.toLowerCase().startsWith(clean));
  if (matching.length > 0) {
    return matching.map((m) => `  ${m}`);
  }
  return ['% Unrecognized command'];
}

function cloneDevices(devices: Record<string, SimDevice>): Record<string, SimDevice> {
  return JSON.parse(JSON.stringify(devices)) as Record<string, SimDevice>;
}

export function executeIosCommand(
  rawInput: string,
  session: CliSessionState,
  inputDevices: Record<string, SimDevice>,
): CliExecResult {
  const devices = cloneDevices(inputDevices);
  const dev = devices[session.deviceId];
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return { output: [], nextSession: session, devices };
  }

  if (trimmed === '?' || trimmed.endsWith('?')) {
    const prefix = trimmed.slice(0, -1);
    return {
      output: getContextHelp(prefix, session, dev),
      nextSession: session,
      devices,
    };
  }

  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0].toLowerCase();
  const rest = tokens.slice(1);

  if (cmd === 'clear' || cmd === 'cls') {
    return { output: [], nextSession: session, devices, clearTerminal: true };
  }

  if ('exit'.startsWith(cmd) && cmd.length >= 2 && session.mode !== 'acl') {
    if (session.mode === 'user') return { output: [], nextSession: session, devices };
    if (session.mode === 'priv') {
      return { output: [], nextSession: { deviceId: session.deviceId, mode: 'user' }, devices };
    }
    if (session.mode === 'config') {
      return { output: [], nextSession: { deviceId: session.deviceId, mode: 'priv' }, devices };
    }
    return { output: [], nextSession: { deviceId: session.deviceId, mode: 'config' }, devices };
  }
  if (cmd === 'exit' && session.mode === 'acl') {
    return { output: [], nextSession: { deviceId: session.deviceId, mode: 'config' }, devices };
  }

  if (cmd === 'end' && session.mode !== 'user' && session.mode !== 'priv') {
    return {
      output: ['%SYS-5-CONFIG_I: Configured from console by console'],
      nextSession: { deviceId: session.deviceId, mode: 'priv' },
      devices,
    };
  }

  if (cmd === 'do' && session.mode !== 'user' && session.mode !== 'priv') {
    if (rest.length === 0) {
      return { output: ['% Incomplete command.'], nextSession: session, devices };
    }
    const subRes = executeIosCommand(rest.join(' '), { ...session, mode: 'priv' }, devices);
    return {
      ...subRes,
      nextSession: session,
    };
  }

  // USER EXEC
  if (session.mode === 'user') {
    const resolved = matchPrefix(cmd, ['enable', 'ping', 'show', 'exit']);
    if (resolved.ambiguous) {
      return { output: [`% Ambiguous command: "${trimmed}"`], nextSession: session, devices };
    }
    if (resolved.match === 'enable') {
      return { output: [], nextSession: { deviceId: session.deviceId, mode: 'priv' }, devices };
    }
    if (resolved.match === 'ping') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (!isValidIpv4(rest[0])) {
        return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
      }
      const res = simulatePing(dev.id, rest[0], devices);
      return {
        output: res.lines,
        nextSession: session,
        devices,
        pingTargetIp: rest[0],
        pingSuccess: res.success,
      };
    }
    if (resolved.match === 'show') {
      const res = handleShowCommand(rest, dev, devices);
      if (res.status === 'ok') return { output: res.lines, nextSession: session, devices };
      if (res.status === 'incomplete') return { output: ['% Incomplete command.'], nextSession: session, devices };
      return { output: invalidInputLines(trimmed, res.token), nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  // PRIVILEGED EXEC
  if (session.mode === 'priv') {
    const resolved = matchPrefix(cmd, ['configure', 'show', 'ping', 'write', 'copy', 'disable']);
    if (resolved.ambiguous) {
      return { output: [`% Ambiguous command: "${trimmed}"`], nextSession: session, devices };
    }
    if (resolved.match === 'disable') {
      return { output: [], nextSession: { deviceId: session.deviceId, mode: 'user' }, devices };
    }
    if (resolved.match === 'configure') {
      if (!rest[0]) {
        return { output: ['% Incomplete command.'], nextSession: session, devices };
      }
      if ('terminal'.startsWith(rest[0].toLowerCase())) {
        return {
          output: ['Enter configuration commands, one per line. End with CNTL/Z or "end".'],
          nextSession: { deviceId: session.deviceId, mode: 'config' },
          devices,
        };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (resolved.match === 'show') {
      const res = handleShowCommand(rest, dev, devices);
      if (res.status === 'ok') return { output: res.lines, nextSession: session, devices };
      if (res.status === 'incomplete') return { output: ['% Incomplete command.'], nextSession: session, devices };
      return { output: invalidInputLines(trimmed, res.token), nextSession: session, devices };
    }
    if (resolved.match === 'ping') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (!isValidIpv4(rest[0])) {
        return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
      }
      const res = simulatePing(dev.id, rest[0], devices);
      return {
        output: res.lines,
        nextSession: session,
        devices,
        pingTargetIp: rest[0],
        pingSuccess: res.success,
      };
    }
    if (resolved.match === 'write' || resolved.match === 'copy') {
      if (resolved.match === 'copy' && !rest[0]) {
        return { output: ['% Incomplete command.'], nextSession: session, devices };
      }
      return { output: ['Building configuration...', '[OK]'], nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  // GLOBAL CONFIG
  if (session.mode === 'config') {
    const resolved = matchPrefix(cmd, [
      'hostname',
      'enable',
      'interface',
      'vlan',
      'router',
      'ip',
      'spanning-tree',
    ]);
    if (resolved.ambiguous) {
      return { output: [`% Ambiguous command: "${trimmed}"`], nextSession: session, devices };
    }

    if (resolved.match === 'hostname') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      dev.hostname = rest[0];
      return { output: [], nextSession: session, devices };
    }
    if (resolved.match === 'enable') {
      if (!rest[0] || !rest[1]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('secret'.startsWith(rest[0].toLowerCase())) {
        dev.enableSecret = rest[1];
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (resolved.match === 'interface') {
      if (rest.length === 0) return { output: ['% Incomplete command.'], nextSession: session, devices };
      const parsed = normalizeInterfaceInput(rest.join(' '), dev);
      if (!parsed) {
        return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
      }
      if (parsed.subName) {
        const parent = dev.interfaces[parsed.ifName];
        parent.subinterfaces = parent.subinterfaces ?? {};
        if (!parent.subinterfaces[parsed.subName]) {
          const vid = Number(parsed.subName.split('.')[1]);
          parent.subinterfaces[parsed.subName] = { vlanId: vid, adminUp: true };
        }
        return {
          output: [],
          nextSession: {
            deviceId: dev.id,
            mode: 'subif',
            activeIf: parsed.ifName,
            activeSubIf: parsed.subName,
          },
          devices,
        };
      }
      return {
        output: [],
        nextSession: { deviceId: dev.id, mode: 'if', activeIf: parsed.ifName },
        devices,
      };
    }
    if (resolved.match === 'vlan') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (!/^\d+$/.test(rest[0])) {
        return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
      }
      const vid = Number(rest[0]);
      if (!dev.vlans[vid]) {
        dev.vlans[vid] = `VLAN${String(vid).padStart(4, '0')}`;
      }
      return {
        output: [],
        nextSession: { deviceId: dev.id, mode: 'vlan', activeVlan: vid },
        devices,
      };
    }
    if (resolved.match === 'router') {
      if (!rest[0] || !rest[1]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (rest[0].toLowerCase() === 'ospf' && /^\d+$/.test(rest[1])) {
        dev.ospf.processId = Number(rest[1]);
        return {
          output: [],
          nextSession: { deviceId: dev.id, mode: 'router-ospf' },
          devices,
        };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (resolved.match === 'ip') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      const sub = rest[0].toLowerCase();
      if ('route'.startsWith(sub)) {
        if (rest.length < 4) return { output: ['% Incomplete command.'], nextSession: session, devices };
        const [, prefix, mask, nextHop, adRaw] = rest;
        if (!isValidIpv4(prefix) || !isValidIpv4(mask) || !isValidIpv4(nextHop)) {
          return { output: invalidInputLines(trimmed, prefix), nextSession: session, devices };
        }
        const ad = adRaw && /^\d+$/.test(adRaw) ? Number(adRaw) : 1;
        dev.staticRoutes = dev.staticRoutes.filter(
          (r) => !(r.prefix === prefix && r.mask === mask && r.nextHop === nextHop),
        );
        dev.staticRoutes.push({ prefix, mask, nextHop, ad });
        return { output: [], nextSession: session, devices };
      }
      if ('access-list'.startsWith(sub)) {
        if (rest.length < 3) return { output: ['% Incomplete command.'], nextSession: session, devices };
        const aclType = rest[1].toLowerCase().startsWith('ext') ? 'extended' : 'standard';
        const aclId = rest[2];
        dev.acls[aclId] = dev.acls[aclId] ?? { id: aclId, type: aclType, rules: [] };
        return {
          output: [],
          nextSession: { deviceId: dev.id, mode: 'acl', activeAcl: aclId },
          devices,
        };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (resolved.match === 'spanning-tree') {
      if (rest.length < 4) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (rest[0]?.toLowerCase() === 'vlan' && rest[2]?.toLowerCase() === 'root') {
        const vid = Number(rest[1]);
        if (!Number.isNaN(vid) && !dev.stpRootVlans.includes(vid)) {
          dev.stpRootVlans.push(vid);
        }
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  // INTERFACE CONFIG
  if (session.mode === 'if' && session.activeIf) {
    const iface = dev.interfaces[session.activeIf];
    if (!iface) return { output: ['% Interface not found'], nextSession: session, devices };

    const resolved = matchPrefix(cmd, ['no', 'shutdown', 'ip', 'switchport']);
    if (resolved.ambiguous) {
      return { output: [`% Ambiguous command: "${trimmed}"`], nextSession: session, devices };
    }

    if (resolved.match === 'no') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('shutdown'.startsWith(rest[0].toLowerCase())) {
        iface.adminUp = true;
        const op = isLinkOperational(dev.id, iface, devices);
        return {
          output: [`%LINK-3-UPDOWN: Interface ${iface.name}, changed state to ${op ? 'up' : 'down'}`],
          nextSession: session,
          devices,
        };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (resolved.match === 'shutdown') {
      iface.adminUp = false;
      return {
        output: [`%LINK-5-CHANGED: Interface ${iface.name}, changed state to administratively down`],
        nextSession: session,
        devices,
      };
    }
    if (resolved.match === 'ip') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('address'.startsWith(rest[0].toLowerCase())) {
        if (!rest[1] || !rest[2]) {
          return { output: ['% Incomplete command.'], nextSession: session, devices };
        }
        if (!isValidIpv4(rest[1]) || !isValidIpv4(rest[2])) {
          return { output: invalidInputLines(trimmed, rest[1]), nextSession: session, devices };
        }
        iface.ip = rest[1];
        iface.mask = rest[2];
        return { output: [], nextSession: session, devices };
      }
      if ('access-group'.startsWith(rest[0].toLowerCase())) {
        if (!rest[1] || !rest[2]) {
          return { output: ['% Incomplete command.'], nextSession: session, devices };
        }
        const dir = rest[2].toLowerCase();
        if (dir === 'in') iface.accessGroupIn = rest[1];
        else if (dir === 'out') iface.accessGroupOut = rest[1];
        else return { output: invalidInputLines(trimmed, rest[2]), nextSession: session, devices };
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (resolved.match === 'switchport') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      const sub = rest[0].toLowerCase();
      if ('mode'.startsWith(sub)) {
        if (!rest[1]) return { output: ['% Incomplete command.'], nextSession: session, devices };
        const m = rest[1].toLowerCase();
        if ('access'.startsWith(m)) {
          iface.switchportMode = 'access';
          return { output: [], nextSession: session, devices };
        }
        if ('trunk'.startsWith(m)) {
          iface.switchportMode = 'trunk';
          if (!iface.trunkAllowedVlans) iface.trunkAllowedVlans = '1-4094';
          return { output: [], nextSession: session, devices };
        }
        return { output: invalidInputLines(trimmed, rest[1]), nextSession: session, devices };
      }
      if ('access'.startsWith(sub)) {
        if (!rest[1] || !rest[2]) return { output: ['% Incomplete command.'], nextSession: session, devices };
        if ('vlan'.startsWith(rest[1].toLowerCase()) && /^\d+$/.test(rest[2])) {
          const vid = Number(rest[2]);
          iface.accessVlan = vid;
          if (!dev.vlans[vid]) dev.vlans[vid] = `VLAN${String(vid).padStart(4, '0')}`;
          return { output: [], nextSession: session, devices };
        }
        return { output: invalidInputLines(trimmed, rest[2]), nextSession: session, devices };
      }
      if ('trunk'.startsWith(sub)) {
        if (!rest[1] || !rest[2] || !rest[3]) {
          return { output: ['% Incomplete command.'], nextSession: session, devices };
        }
        if ('allowed'.startsWith(rest[1].toLowerCase()) && 'vlan'.startsWith(rest[2].toLowerCase())) {
          iface.trunkAllowedVlans = rest[3];
          return { output: [], nextSession: session, devices };
        }
        if ('native'.startsWith(rest[1].toLowerCase()) && 'vlan'.startsWith(rest[2].toLowerCase())) {
          iface.nativeVlan = Number(rest[3]);
          return { output: [], nextSession: session, devices };
        }
        return { output: invalidInputLines(trimmed, rest[1]), nextSession: session, devices };
      }
      if ('port-security'.startsWith(sub)) {
        if (iface.switchportMode !== 'access') {
          return {
            output: [`Command rejected: ${iface.name} is a dynamic port. Set "switchport mode access" first.`],
            nextSession: session,
            devices,
          };
        }
        iface.portSecurity = iface.portSecurity ?? { enabled: true, maximum: 1, violation: 'shutdown' };
        iface.portSecurity.enabled = true;
        if (rest[1]) {
          const pSub = rest[1].toLowerCase();
          if ('maximum'.startsWith(pSub)) {
            if (!rest[2]) return { output: ['% Incomplete command.'], nextSession: session, devices };
            iface.portSecurity.maximum = Number(rest[2]) || 1;
          } else if ('violation'.startsWith(pSub)) {
            if (!rest[2]) return { output: ['% Incomplete command.'], nextSession: session, devices };
            const v = rest[2].toLowerCase();
            if ('shutdown'.startsWith(v)) iface.portSecurity.violation = 'shutdown';
            else if ('restrict'.startsWith(v)) iface.portSecurity.violation = 'restrict';
            else if ('protect'.startsWith(v)) iface.portSecurity.violation = 'protect';
            else return { output: invalidInputLines(trimmed, rest[2]), nextSession: session, devices };
          } else if ('mac-address'.startsWith(pSub)) {
            if (!rest[2]) return { output: ['% Incomplete command.'], nextSession: session, devices };
            if ('sticky'.startsWith(rest[2].toLowerCase())) iface.portSecurity.macSticky = true;
          } else {
            return { output: invalidInputLines(trimmed, rest[1]), nextSession: session, devices };
          }
        }
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  // SUBINTERFACE CONFIG
  if (session.mode === 'subif' && session.activeIf && session.activeSubIf) {
    const parent = dev.interfaces[session.activeIf];
    const sub = parent?.subinterfaces?.[session.activeSubIf];
    if (!parent || !sub) return { output: ['% Subinterface not found'], nextSession: session, devices };

    if ('encapsulation'.startsWith(cmd)) {
      if (!rest[0] || !rest[1]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('dot1q'.startsWith(rest[0].toLowerCase())) {
        sub.vlanId = Number(rest[1]) || sub.vlanId;
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (cmd === 'ip') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('address'.startsWith(rest[0].toLowerCase())) {
        if (!rest[1] || !rest[2]) return { output: ['% Incomplete command.'], nextSession: session, devices };
        if (!isValidIpv4(rest[1]) || !isValidIpv4(rest[2])) {
          return { output: invalidInputLines(trimmed, rest[1]), nextSession: session, devices };
        }
        sub.ip = rest[1];
        sub.mask = rest[2];
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
    }
    if (cmd === 'no' && rest[0]?.toLowerCase().startsWith('shut')) {
      sub.adminUp = true;
      return { output: [], nextSession: session, devices };
    }
    if (cmd === 'no' && !rest[0]) {
      return { output: ['% Incomplete command.'], nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  // OSPF ROUTER CONFIG
  if (session.mode === 'router-ospf') {
    if ('router-id'.startsWith(cmd)) {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (!isValidIpv4(rest[0])) return { output: invalidInputLines(trimmed, rest[0]), nextSession: session, devices };
      dev.ospf.routerId = rest[0];
      return { output: [], nextSession: session, devices };
    }
    if ('network'.startsWith(cmd)) {
      if (rest.length < 4) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (rest[2]?.toLowerCase() !== 'area') {
        return { output: invalidInputLines(trimmed, rest[2]), nextSession: session, devices };
      }
      const [network, wildcard, , areaRaw] = rest;
      if (!isValidIpv4(network) || !isValidIpv4(wildcard)) {
        return { output: invalidInputLines(trimmed, network), nextSession: session, devices };
      }
      const area = Number(areaRaw);
      if (Number.isNaN(area)) return { output: invalidInputLines(trimmed, areaRaw), nextSession: session, devices };
      const exists = dev.ospf.networks.some(
        (n) => n.network === network && n.wildcard === wildcard && n.area === area,
      );
      if (!exists) dev.ospf.networks.push({ network, wildcard, area });
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  // VLAN CONFIG
  if (session.mode === 'vlan' && session.activeVlan !== undefined) {
    if ('name'.startsWith(cmd)) {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      dev.vlans[session.activeVlan] = rest.join('_');
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  // ACL CONFIG
  if (session.mode === 'acl' && session.activeAcl) {
    const acl = dev.acls[session.activeAcl];
    if (acl && (cmd === 'permit' || cmd === 'deny')) {
      if (rest.length === 0) return { output: ['% Incomplete command.'], nextSession: session, devices };
      acl.rules.push(`${cmd} ${rest.join(' ')}`);
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
  }

  return { output: invalidInputLines(trimmed, tokens[0]), nextSession: session, devices };
}
