import { SimDevice, SimInterface } from '../types/ccna';

export type CliMode =
  | 'user'
  | 'priv'
  | 'config'
  | 'if'
  | 'if-range'
  | 'subif'
  | 'router-ospf'
  | 'vlan'
  | 'acl'
  | 'line'
  | 'dhcp-pool';

export interface CliSessionState {
  deviceId: string;
  mode: CliMode;
  activeIf?: string;
  activeRange?: string[];
  activeSubIf?: string;
  activeVlan?: number;
  activeAcl?: string;
  activeLine?: string;
  activePool?: string;
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
    case 'if-range':
      return `${h}(config-if-range)#`;
    case 'subif':
      return `${h}(config-subif)#`;
    case 'router-ospf':
      return `${h}(config-router)#`;
    case 'vlan':
      return `${h}(config-vlan)#`;
    case 'acl':
      return `${h}(config-ext-nacl)#`;
    case 'line':
      return `${h}(config-line)#`;
    case 'dhcp-pool':
      return `${h}(dhcp-config)#`;
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
): { ifName: string; subName?: string; created?: boolean } | null {
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, '');
  const [basePart, subPart] = cleaned.split('.');

  // Support creating VLAN SVIs dynamically: interface vlan <id>
  const vlanMatch = basePart.match(/^v(?:l(?:an)?)?(\d+)$/);
  if (vlanMatch && subPart === undefined) {
    const vid = Number(vlanMatch[1]);
    if (vid >= 1 && vid <= 4094) {
      const canonical = `Vlan${vid}`;
      if (!device.interfaces[canonical]) {
        device.interfaces[canonical] = {
          name: canonical,
          shortName: `Vl${vid}`,
          adminUp: true,
          protocolUp: true,
          isSvi: true,
          routedPort: true,
        };
        if (!device.vlans[vid]) {
          device.vlans[vid] = `VLAN${String(vid).padStart(4, '0')}`;
        }
        return { ifName: canonical, created: true };
      }
      return { ifName: canonical };
    }
  }

  // Support Port-channel creation/lookup: interface port-channel <id>
  const poMatch = basePart.match(/^p(?:o(?:rt-?channel)?)?(\d+)$/);
  if (poMatch && subPart === undefined) {
    const poId = Number(poMatch[1]);
    if (poId >= 1 && poId <= 64) {
      const canonical = `Port-channel${poId}`;
      if (!device.interfaces[canonical]) {
        device.interfaces[canonical] = {
          name: canonical,
          shortName: `Po${poId}`,
          adminUp: true,
          protocolUp: true,
        };
        return { ifName: canonical, created: true };
      }
      return { ifName: canonical };
    }
  }

  let matchedKey: string | undefined;
  for (const key of Object.keys(device.interfaces)) {
    const lk = key.toLowerCase();
    const ls = device.interfaces[key].shortName.toLowerCase();
    const prefixInput = basePart.replace(/[\d/]+$/, '');
    const prefixKey = lk.replace(/[\d/]+$/, '');
    const prefixShort = ls.replace(/[\d/]+$/, '');
    const numSuffixInput = basePart.replace(/^[a-z-]+/, '');
    const numSuffixKey = lk.replace(/^[a-z-]+/, '');

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

function parseInterfaceRange(rawSpec: string, device: SimDevice): string[] | null {
  const parts = rawSpec
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;

  const collected: string[] = [];
  for (const part of parts) {
    const rangeMatch = part.replace(/\s*-\s*/g, '-').match(/^([a-zA-Z-]+[\d/]*\/)(\d+)-(\d+)$/);
    if (rangeMatch) {
      const [, prefix, startStr, endStr] = rangeMatch;
      const start = Number(startStr);
      const end = Number(endStr);
      if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
      for (let i = start; i <= end; i++) {
        const parsed = normalizeInterfaceInput(`${prefix}${i}`, device);
        if (!parsed) return null;
        if (!collected.includes(parsed.ifName)) collected.push(parsed.ifName);
      }
    } else {
      const parsed = normalizeInterfaceInput(part, device);
      if (!parsed || parsed.subName) return null;
      if (!collected.includes(parsed.ifName)) collected.push(parsed.ifName);
    }
  }

  return collected.length > 0 ? collected : null;
}

export function isLinkOperational(
  deviceId: string,
  iface: SimInterface,
  devices: Record<string, SimDevice>,
): boolean {
  if (!iface.adminUp || iface.errDisabled) return false;
  if (iface.name.startsWith('Loopback')) return true;
  const dev = devices[deviceId];
  if (iface.isSvi) {
    const vid = Number(iface.name.replace('Vlan', ''));
    return Boolean(dev && dev.vlans[vid]);
  }
  if (iface.name.startsWith('Port-channel')) {
    const poId = Number(iface.name.replace('Port-channel', ''));
    if (!dev) return false;
    return Object.values(dev.interfaces).some(
      (member) =>
        member.channelGroup?.id === poId &&
        member.name !== iface.name &&
        isLinkOperational(deviceId, member, devices),
    );
  }
  if (!iface.connectedTo) {
    return iface.protocolUp;
  }
  const peer = devices[iface.connectedTo.deviceId];
  const peerIf = peer?.interfaces[iface.connectedTo.interfaceName];
  if (!peerIf) return false;
  return peerIf.adminUp && !peerIf.errDisabled;
}

function parseAllowedVlans(spec?: string): Set<number> | 'all' {
  if (!spec || spec.trim().toLowerCase() === 'all') return 'all';
  const set = new Set<number>();
  for (const part of spec.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const range = trimmed.match(/^(\d+)-(\d+)$/);
    if (range) {
      const a = Number(range[1]);
      const b = Number(range[2]);
      for (let v = Math.min(a, b); v <= Math.max(a, b); v++) set.add(v);
    } else if (/^\d+$/.test(trimmed)) {
      set.add(Number(trimmed));
    }
  }
  return set;
}

function isTrunkVlanAllowed(iface: SimInterface, vlanId: number): boolean {
  const allowed = parseAllowedVlans(iface.trunkAllowedVlans);
  return allowed === 'all' || allowed.has(vlanId);
}

function formatAllowedVlans(vlans: Set<number>): string {
  const sorted = Array.from(vlans).sort((a, b) => a - b);
  if (sorted.length === 0) return 'none';
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = sorted[i];
      prev = sorted[i];
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(',');
}

function isOspfPassive(dev: SimDevice, ifName: string): boolean {
  const passives = dev.ospf.passiveInterfaces ?? [];
  return passives.includes('default') || passives.includes(ifName);
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
    if (isOspfPassive(dev, iface.name)) continue;

    const localMatch = dev.ospf.networks.find((n) => matchesWildcard(iface.ip!, n.network, n.wildcard));
    if (!localMatch || !iface.connectedTo) continue;

    const peer = devices[iface.connectedTo.deviceId];
    const peerIf = peer?.interfaces[iface.connectedTo.interfaceName];
    if (!peer || !peerIf || !peerIf.ip || !peerIf.mask || !isLinkOperational(peer.id, peerIf, devices)) continue;
    if (!peer.ospf.processId || isOspfPassive(peer, peerIf.name)) continue;

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
  if (dev.kind === 'switch' && !dev.ipRouting) return [];

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
  const refBw = dev.ospf.referenceBandwidthMbps ?? 100;
  const gigCost = Math.max(1, Math.floor(refBw / 1000));

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
        const linkCost = outIface.ospfCost ?? gigCost;
        const dstCost = pIf.name.startsWith('Loopback') ? 1 : pIf.ospfCost ?? gigCost;
        routes.push({
          code: 'O',
          prefix: net,
          cidr,
          ad: 110,
          metric: linkCost + dstCost,
          nextHop: nei.address,
          outIf: nei.iface,
        });
      }
    }

    if (peer.ospf.defaultOriginate) {
      const hasDefault = routes.some((r) => r.prefix === '0.0.0.0' && r.cidr === 0);
      if (!hasDefault) {
        routes.push({
          code: 'O*E2',
          prefix: '0.0.0.0',
          cidr: 0,
          ad: 110,
          metric: 1,
          nextHop: nei.address,
          outIf: nei.iface,
        });
      }
    }
  }

  return routes;
}

function checkAclRuleEndpoint(ip: string, tokens: string[], startIndex: number): { matched: boolean; nextIdx: number } {
  const tok = tokens[startIndex]?.toLowerCase();
  if (!tok) return { matched: false, nextIdx: startIndex };
  if (tok === 'any') return { matched: true, nextIdx: startIndex + 1 };
  if (tok === 'host' && tokens[startIndex + 1]) {
    return { matched: ip === tokens[startIndex + 1], nextIdx: startIndex + 2 };
  }
  if (isValidIpv4(tok) && tokens[startIndex + 1] && isValidIpv4(tokens[startIndex + 1])) {
    return {
      matched: matchesWildcard(ip, tok, tokens[startIndex + 1]),
      nextIdx: startIndex + 2,
    };
  }
  return { matched: false, nextIdx: startIndex + 1 };
}

function checkAclPermitsIcmp(dev: SimDevice, aclId: string | undefined, srcIp: string, dstIp: string): boolean {
  if (!aclId) return true;
  const acl = dev.acls[aclId];
  if (!acl) return true;

  for (const rule of acl.rules) {
    const tokens = rule.trim().split(/\s+/);
    const action = tokens[0]?.toLowerCase();
    if (action !== 'permit' && action !== 'deny') continue;

    if (acl.type === 'standard') {
      const res = checkAclRuleEndpoint(srcIp, tokens, 1);
      if (res.matched) return action === 'permit';
      continue;
    }

    const proto = tokens[1]?.toLowerCase();
    if (proto !== 'ip' && proto !== 'icmp') continue;

    const srcRes = checkAclRuleEndpoint(srcIp, tokens, 2);
    if (!srcRes.matched) continue;
    const dstRes = checkAclRuleEndpoint(dstIp, tokens, srcRes.nextIdx);
    if (!dstRes.matched) continue;

    return action === 'permit';
  }

  // Implicit deny at the end of every ACL
  return false;
}

function findPrimarySourceIp(dev: SimDevice, sourceSpec?: string): string | undefined {
  if (sourceSpec) {
    if (isValidIpv4(sourceSpec)) return sourceSpec;
    const parsed = normalizeInterfaceInput(sourceSpec, dev);
    if (parsed) {
      const iface = dev.interfaces[parsed.ifName];
      if (iface?.ip) return iface.ip;
    }
  }
  for (const iface of Object.values(dev.interfaces)) {
    if (iface.ip && isLinkOperational(dev.id, iface, { [dev.id]: dev })) return iface.ip;
  }
  return Object.values(dev.interfaces).find((i) => i.ip)?.ip;
}

function checkSwitchTransit(
  sw: SimDevice,
  inIf: SimInterface,
  vlanId: number,
  targetIp: string,
  devices: Record<string, SimDevice>,
  visitedSwitches: Set<string>,
): { reachedDeviceId?: string; directHit?: boolean } {
  if (visitedSwitches.has(sw.id)) return {};
  visitedSwitches.add(sw.id);

  // Check L3 SVI on this switch if ip routing is enabled
  if (sw.ipRouting) {
    const svi = sw.interfaces[`Vlan${vlanId}`];
    if (svi && svi.ip && svi.mask && isLinkOperational(sw.id, svi, devices)) {
      if (svi.ip === targetIp || sameSubnet(svi.ip, svi.mask, targetIp)) {
        return { reachedDeviceId: sw.id };
      }
    }
  }

  // Check if any other access port on this switch reaches the target or another switch/router
  for (const outIf of Object.values(sw.interfaces)) {
    if (outIf.name === inIf.name || outIf.isSvi || outIf.name.startsWith('Port-channel')) continue;
    if (!isLinkOperational(sw.id, outIf, devices) || !outIf.connectedTo) continue;

    const peer = devices[outIf.connectedTo.deviceId];
    const peerIf = peer?.interfaces[outIf.connectedTo.interfaceName];
    if (!peer || !peerIf) continue;

    if (outIf.switchportMode === 'trunk') {
      if (!isTrunkVlanAllowed(outIf, vlanId)) continue;

      if (peer.kind === 'switch') {
        if (peerIf.switchportMode !== 'trunk') continue;
        if ((outIf.nativeVlan ?? 1) !== (peerIf.nativeVlan ?? 1)) continue;
        if (!isTrunkVlanAllowed(peerIf, vlanId)) continue;
        // EtherChannel check if configured
        if (outIf.channelGroup) {
          const poIf = sw.interfaces[`Port-channel${outIf.channelGroup.id}`];
          if (poIf && poIf.switchportMode === 'trunk' && !isTrunkVlanAllowed(poIf, vlanId)) continue;
        }
        const deep = checkSwitchTransit(peer, peerIf, vlanId, targetIp, devices, visitedSwitches);
        if (deep.directHit || deep.reachedDeviceId) return deep;
      } else if (peer.kind === 'router') {
        if (peerIf.subinterfaces) {
          for (const sub of Object.values(peerIf.subinterfaces)) {
            if (sub.vlanId === vlanId && sub.adminUp && sub.ip && sub.mask) {
              if (sub.ip === targetIp || sameSubnet(sub.ip, sub.mask, targetIp)) {
                return { reachedDeviceId: peer.id };
              }
            }
          }
        }
      }
    } else {
      // Access port on same VLAN
      const outVlan = outIf.accessVlan ?? 1;
      if (outVlan !== vlanId) continue;
      if (peer.kind === 'host' && peerIf.ip === targetIp && isLinkOperational(peer.id, peerIf, devices)) {
        return { directHit: true };
      }
      if (peer.kind === 'router' && peerIf.ip && isLinkOperational(peer.id, peerIf, devices)) {
        if (peerIf.ip === targetIp || (peerIf.mask && sameSubnet(peerIf.ip, peerIf.mask, targetIp))) {
          return { reachedDeviceId: peer.id };
        }
      }
    }
  }

  return {};
}

function pingSuccessLines(targetIp: string): string[] {
  return [
    `Type escape sequence to abort.`,
    `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
    `!!!!!`,
    `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
  ];
}

function simulatePing(
  sourceDeviceId: string,
  targetIp: string,
  devices: Record<string, SimDevice>,
  sourceSpec?: string,
): { success: boolean; lines: string[]; hops: string[] } {
  const srcDev = devices[sourceDeviceId];
  const srcIp = (srcDev ? findPrimarySourceIp(srcDev, sourceSpec) : undefined) ?? '0.0.0.0';
  const visited = new Set<string>();
  const hops: string[] = [];
  let currentId = sourceDeviceId;

  for (let hop = 0; hop < 10; hop++) {
    if (visited.has(currentId)) break;
    visited.add(currentId);
    const dev = devices[currentId];
    if (!dev) break;

    // Self IP / SVI / HSRP VIP check
    for (const iface of Object.values(dev.interfaces)) {
      if ((iface.ip === targetIp || iface.hsrp?.vip === targetIp) && isLinkOperational(currentId, iface, devices)) {
        hops.push(iface.ip ?? targetIp);
        return { success: true, lines: pingSuccessLines(targetIp), hops };
      }
      if (iface.subinterfaces && isLinkOperational(currentId, iface, devices)) {
        for (const sub of Object.values(iface.subinterfaces)) {
          if (sub.ip === targetIp && sub.adminUp) {
            hops.push(sub.ip);
            return { success: true, lines: pingSuccessLines(targetIp), hops };
          }
        }
      }
    }

    if (dev.kind === 'host') {
      const eth = Object.values(dev.interfaces)[0];
      if (!eth || !eth.ip || !eth.mask || !isLinkOperational(currentId, eth, devices)) break;

      if (eth.connectedTo) {
        const peer = devices[eth.connectedTo.deviceId];
        const peerIf = peer?.interfaces[eth.connectedTo.interfaceName];
        if (peer?.kind === 'switch' && peerIf) {
          const vlanId = peerIf.accessVlan ?? 1;
          const transit = checkSwitchTransit(
            peer,
            peerIf,
            vlanId,
            sameSubnet(eth.ip, eth.mask, targetIp) ? targetIp : dev.defaultGateway ?? targetIp,
            devices,
            new Set<string>(),
          );
          if (transit.directHit) {
            hops.push(targetIp);
            return { success: true, lines: pingSuccessLines(targetIp), hops };
          }
          if (transit.reachedDeviceId) {
            const nextDev = devices[transit.reachedDeviceId];
            const firstIp = Object.values(nextDev.interfaces).find((i) => i.ip)?.ip ?? dev.defaultGateway ?? transit.reachedDeviceId;
            hops.push(firstIp);
            currentId = transit.reachedDeviceId;
            continue;
          }
          break;
        }
      }

      if (sameSubnet(eth.ip, eth.mask, targetIp)) {
        for (const other of Object.values(devices)) {
          if (other.id === currentId || other.kind !== 'host') continue;
          const oEth = Object.values(other.interfaces)[0];
          if (oEth?.ip === targetIp && isLinkOperational(other.id, oEth, devices)) {
            hops.push(targetIp);
            return { success: true, lines: pingSuccessLines(targetIp), hops };
          }
        }
      }

      if (!dev.defaultGateway) break;
      let nextRouterId: string | undefined;
      for (const candidate of Object.values(devices)) {
        if (candidate.kind === 'host') continue;
        for (const cif of Object.values(candidate.interfaces)) {
          if ((cif.ip === dev.defaultGateway || cif.hsrp?.vip === dev.defaultGateway) && isLinkOperational(candidate.id, cif, devices)) {
            if (!checkAclPermitsIcmp(candidate, cif.accessGroupIn, srcIp, targetIp)) {
              return {
                success: false,
                hops,
                lines: [
                  `Type escape sequence to abort.`,
                  `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
                  `U.U.U`,
                  `Success rate is 0 percent (0/5)`,
                ],
              };
            }
            nextRouterId = candidate.id;
          }
        }
      }
      if (!nextRouterId) break;
      hops.push(dev.defaultGateway);
      currentId = nextRouterId;
      continue;
    }

    if (dev.kind === 'switch' && !dev.ipRouting) {
      break;
    }

    const routes = computeRoutingTable(currentId, devices).sort((a, b) => b.cidr - a.cidr);
    const targetInt = ipToInt(targetIp);
    const best = routes.find((r) => {
      if (r.cidr === 0) return true;
      const maskInt = (0xffffffff << (32 - r.cidr)) >>> 0;
      return ((targetInt & maskInt) >>> 0) === ipToInt(r.prefix);
    });

    if (!best) break;

    const outIfBase = best.outIf.split('.')[0];
    const outIfaceObj = dev.interfaces[outIfBase];
    if (outIfaceObj && !checkAclPermitsIcmp(dev, outIfaceObj.accessGroupOut, srcIp, targetIp)) {
      return {
        success: false,
        hops,
        lines: [
          `Type escape sequence to abort.`,
          `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
          `U.U.U`,
          `Success rate is 0 percent (0/5)`,
        ],
      };
    }

    if (best.code === 'C') {
      // Check connected host directly or through switch
      if (outIfaceObj?.connectedTo) {
        const peer = devices[outIfaceObj.connectedTo.deviceId];
        const peerIf = peer?.interfaces[outIfaceObj.connectedTo.interfaceName];
        if (peer?.kind === 'switch' && peerIf) {
          const vlanId = best.outIf.includes('.')
            ? outIfaceObj.subinterfaces?.[best.outIf]?.vlanId ?? 1
            : 1;
          const hit = checkSwitchTransit(peer, peerIf, vlanId, targetIp, devices, new Set<string>());
          if (hit.directHit) {
            hops.push(targetIp);
            return { success: true, lines: pingSuccessLines(targetIp), hops };
          }
        }
      }

      if (outIfaceObj?.isSvi) {
        const sviVlan = Number(outIfaceObj.name.replace('Vlan', ''));
        for (const swIf of Object.values(dev.interfaces)) {
          if (swIf.isSvi || !swIf.connectedTo || !isLinkOperational(dev.id, swIf, devices)) continue;
          const peer = devices[swIf.connectedTo.deviceId];
          const peerIf = peer?.interfaces[swIf.connectedTo.interfaceName];
          if (!peer || !peerIf) continue;
          if (swIf.switchportMode !== 'trunk' && (swIf.accessVlan ?? 1) === sviVlan) {
            if (peer.kind === 'host' && peerIf.ip === targetIp && isLinkOperational(peer.id, peerIf, devices)) {
              hops.push(targetIp);
              return { success: true, lines: pingSuccessLines(targetIp), hops };
            }
          } else if (swIf.switchportMode === 'trunk' && peer.kind === 'switch') {
            const deep = checkSwitchTransit(peer, peerIf, sviVlan, targetIp, devices, new Set<string>([dev.id]));
            if (deep.directHit) {
              hops.push(targetIp);
              return { success: true, lines: pingSuccessLines(targetIp), hops };
            }
          }
        }
      }

      for (const other of Object.values(devices)) {
        if (other.id === currentId) continue;
        for (const oif of Object.values(other.interfaces)) {
          if (oif.ip === targetIp && isLinkOperational(other.id, oif, devices)) {
            hops.push(targetIp);
            return { success: true, lines: pingSuccessLines(targetIp), hops };
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
            if (!checkAclPermitsIcmp(candidate, cif.accessGroupIn, srcIp, targetIp)) {
              return {
                success: false,
                hops,
                lines: [
                  `Type escape sequence to abort.`,
                  `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
                  `U.U.U`,
                  `Success rate is 0 percent (0/5)`,
                ],
              };
            }
            nextDevId = candidate.id;
          }
        }
      }
      if (!nextDevId) break;
      hops.push(best.nextHop);
      currentId = nextDevId;
    } else {
      break;
    }
  }

  return {
    success: false,
    hops,
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
    'Current configuration : 1480 bytes',
    '!',
    `hostname ${dev.hostname}`,
  ];
  if (dev.enableSecret) lines.push(`enable secret 5 $1$mERr$${dev.enableSecret}`);
  if (dev.domainName) lines.push(`ip domain-name ${dev.domainName}`);
  if (dev.sshVersion) lines.push(`ip ssh version ${dev.sshVersion}`);
  if (dev.ipRouting) lines.push('ip routing');
  if (dev.lldpEnabled) lines.push('lldp run');
  if (dev.users) {
    for (const [u, p] of Object.entries(dev.users)) {
      lines.push(`username ${u} secret 5 $1$usr$${p.slice(0, 4)}***`);
    }
  }
  if (dev.dhcpExcluded) {
    for (const ex of dev.dhcpExcluded) {
      lines.push(`ip dhcp excluded-address ${ex}`);
    }
  }
  if (dev.dhcpPools) {
    for (const [name, pool] of Object.entries(dev.dhcpPools)) {
      lines.push(`ip dhcp pool ${name}`);
      lines.push(` network ${pool.network} ${pool.mask}`);
      if (pool.defaultRouter) lines.push(` default-router ${pool.defaultRouter}`);
      if (pool.dnsServer) lines.push(` dns-server ${pool.dnsServer}`);
    }
  }
  if (dev.bannerMotd) lines.push(`banner motd ^C${dev.bannerMotd}^C`);
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
    if (iface.description) lines.push(` description ${iface.description}`);
    if (iface.routedPort && !iface.isSvi && dev.kind === 'switch') lines.push(' no switchport');
    if (iface.ip && iface.mask) {
      lines.push(` ip address ${iface.ip} ${iface.mask}`);
    }
    if (iface.helperAddress) lines.push(` ip helper-address ${iface.helperAddress}`);
    if (iface.natRole) lines.push(` ip nat ${iface.natRole}`);
    if (iface.hsrp) {
      lines.push(` standby ${iface.hsrp.group} ip ${iface.hsrp.vip}`);
      if (iface.hsrp.priority !== undefined) lines.push(` standby ${iface.hsrp.group} priority ${iface.hsrp.priority}`);
      if (iface.hsrp.preempt) lines.push(` standby ${iface.hsrp.group} preempt`);
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
    if (iface.channelGroup) {
      lines.push(` channel-group ${iface.channelGroup.id} mode ${iface.channelGroup.mode}`);
    }
    if (iface.portFast) lines.push(' spanning-tree portfast');
    if (iface.bpduGuard) lines.push(' spanning-tree bpduguard enable');
    if (iface.speed && iface.speed !== 'auto') lines.push(` speed ${iface.speed}`);
    if (iface.duplex && iface.duplex !== 'auto') lines.push(` duplex ${iface.duplex}`);
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
    if (dev.ospf.referenceBandwidthMbps) {
      lines.push(` auto-cost reference-bandwidth ${dev.ospf.referenceBandwidthMbps}`);
    }
    for (const p of dev.ospf.passiveInterfaces ?? []) {
      lines.push(` passive-interface ${p}`);
    }
    for (const net of dev.ospf.networks) {
      lines.push(` network ${net.network} ${net.wildcard} area ${net.area}`);
    }
    if (dev.ospf.defaultOriginate) lines.push(' default-information originate');
    lines.push('!');
  }

  for (const st of dev.staticRoutes) {
    lines.push(
      `ip route ${st.prefix} ${st.mask} ${st.nextHop}${st.ad !== 1 ? ` ${st.ad}` : ''}`,
    );
  }

  for (const nat of dev.natRules ?? []) {
    lines.push(`ip nat inside source list ${nat.aclId} interface ${nat.overloadInterface} overload`);
  }

  for (const acl of Object.values(dev.acls)) {
    lines.push(`ip access-list ${acl.type} ${acl.id}`);
    for (const rule of acl.rules) {
      lines.push(` ${rule}`);
    }
    lines.push('!');
  }

  if (dev.vty) {
    lines.push('line vty 0 15');
    if (dev.vty.accessClass) lines.push(` access-class ${dev.vty.accessClass} in`);
    if (dev.vty.loginLocal) lines.push(' login local');
    if (dev.vty.transportInput?.length) lines.push(` transport input ${dev.vty.transportInput.join(' ')}`);
    lines.push('!');
  }

  lines.push('end');
  return lines;
}

function applyPipeFilter(lines: string[], pipeClause?: string): string[] {
  if (!pipeClause) return lines;
  const parts = pipeClause.trim().split(/\s+/);
  const op = parts[0]?.toLowerCase() ?? '';
  const pattern = parts.slice(1).join(' ');
  if (!pattern) return lines;
  const lowerPattern = pattern.toLowerCase();

  if ('include'.startsWith(op)) {
    return lines.filter((l) => l.toLowerCase().includes(lowerPattern));
  }
  if ('exclude'.startsWith(op)) {
    return lines.filter((l) => !l.toLowerCase().includes(lowerPattern));
  }
  if ('begin'.startsWith(op)) {
    const idx = lines.findIndex((l) => l.toLowerCase().includes(lowerPattern));
    return idx === -1 ? [] : lines.slice(idx);
  }
  if ('section'.startsWith(op)) {
    const out: string[] = [];
    let capturing = false;
    for (const line of lines) {
      const indented = line.startsWith(' ');
      if (!indented) {
        if (line.toLowerCase().includes(lowerPattern)) {
          capturing = true;
          out.push(line);
        } else {
          capturing = false;
        }
      } else if (capturing) {
        out.push(line);
      }
    }
    return out;
  }
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

  if ('version'.startsWith(a0)) {
    return {
      status: 'ok',
      lines: [
        'Cisco IOS XE Software, Version 17.09.04a',
        `Technical Support: Road to TECH IOSv Lab Engine`,
        `${dev.hostname} uptime is 4 hours, 18 minutes`,
        `System image file is "flash:c2900-universalk9-mz.SPA.157-3.M.bin"`,
        `Processor board ID FTX1842A09B`,
        `${Object.keys(dev.interfaces).length} Ethernet interfaces`,
        'Configuration register is 0x2102',
      ],
    };
  }

  if (a0 === 'flash:' || 'flash'.startsWith(a0)) {
    return {
      status: 'ok',
      lines: [
        'Directory of flash:/',
        '',
        '    1  -rw-    98541200  Jan 15 2026 08:12:00 +00:00  c2900-universalk9-mz.SPA.157-3.M.bin',
        '    2  -rw-        1480  Jan 15 2026 09:44:12 +00:00  config.text',
        '    3  -rw-         616  Jan 15 2026 09:44:12 +00:00  vlan.dat',
        '',
        '255744000 bytes total (157198704 bytes free)',
      ],
    };
  }

  if ('logging'.startsWith(a0)) {
    const logs = dev.syslogBuffer ?? [
      '%SYS-5-RESTART: System restarted -- Cisco IOS Software',
    ];
    return {
      status: 'ok',
      lines: ['Syslog logging: enabled (0 messages dropped)', '', ...logs],
    };
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
          const status = iface.errDisabled
            ? 'err-disabled'
            : !iface.adminUp
              ? 'administratively down'
              : op
                ? 'up'
                : 'down';
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
      if (dev.kind === 'switch' && !dev.ipRouting) {
        return {
          status: 'ok',
          lines: [
            'Default gateway is ' + (dev.defaultGateway ?? 'not set'),
            '(Layer 3 routing disabled; enable with "ip routing" in global config.)',
          ],
        };
      }
      const routes = computeRoutingTable(dev.id, devices);
      const lines = [
        'Codes: C - connected, S - static, O - OSPF, IA - OSPF inter area, E2 - OSPF external type 2, * - candidate default',
        '',
      ];
      if (routes.length === 0) {
        lines.push('Gateway of last resort is not set (no active L3 interfaces).');
        return { status: 'ok', lines };
      }
      const def = routes.find((r) => r.prefix === '0.0.0.0');
      lines.push(
        def
          ? `Gateway of last resort is ${def.nextHop} to network 0.0.0.0`
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
      if ('interface'.startsWith(a2)) {
        const lines = [
          'Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C',
        ];
        for (const iface of Object.values(dev.interfaces)) {
          if (!iface.ip || !iface.mask) continue;
          const match = dev.ospf.networks.find((n) => matchesWildcard(iface.ip!, n.network, n.wildcard));
          if (!match) continue;
          const passive = isOspfPassive(dev, iface.name);
          const up = isLinkOperational(dev.id, iface, devices);
          lines.push(
            `${iface.shortName.padEnd(13)}${String(dev.ospf.processId ?? 1).padEnd(6)}${String(match.area).padEnd(16)}${`${iface.ip}/${maskToCidr(iface.mask)}`.padEnd(19)}${String(iface.ospfCost ?? 1).padEnd(6)}${!up ? 'DOWN' : passive ? 'PASSIVE' : 'DR'}    ${passive || !up ? '0/0' : '1/1'}`,
          );
        }
        return { status: 'ok', lines };
      }
      return { status: 'invalid', token: args[2] };
    }

    if ('arp'.startsWith(a1)) {
      const lines = ['Protocol  Address          Age (min)  Hardware Addr   Type   Interface'];
      for (const iface of Object.values(dev.interfaces)) {
        if (iface.ip && isLinkOperational(dev.id, iface, devices)) {
          lines.push(
            `Internet  ${iface.ip.padEnd(17)}-          0050.56ab.${iface.shortName.toLowerCase().replace(/[^a-z0-9]/g, '').padEnd(4, '0')}  ARPA   ${iface.name}`,
          );
        }
      }
      return { status: 'ok', lines };
    }

    if ('ssh'.startsWith(a1)) {
      const enabled = Boolean(dev.domainName && (dev.rsaModulus ?? 0) >= 768);
      return {
        status: 'ok',
        lines: [
          `SSH ${enabled ? 'Enabled' : 'Disabled'} - version ${dev.sshVersion ?? 1.99}`,
          `Domain-name: ${dev.domainName ?? 'not configured'}`,
          `RSA Key Modulus: ${dev.rsaModulus ? `${dev.rsaModulus} bits` : 'not generated'}`,
          `Authentication timeout: 120 secs; Authentication retries: 3`,
        ],
      };
    }

    if ('nat'.startsWith(a1)) {
      if (!a2 || 'translations'.startsWith(a2)) {
        const hasNat = (dev.natRules?.length ?? 0) > 0;
        if (!hasNat) return { status: 'ok', lines: ['No active NAT translations configured.'] };
        const outIf = dev.interfaces[dev.natRules![0].overloadInterface];
        const pubIp = outIf?.ip ?? '203.0.113.1';
        return {
          status: 'ok',
          lines: [
            'Pro Inside global         Inside local          Outside local         Outside global',
            `tcp ${pubIp}:1024     192.168.10.10:51422   198.51.100.10:443     198.51.100.10:443`,
          ],
        };
      }
      return { status: 'invalid', token: args[2] };
    }

    if ('dhcp'.startsWith(a1)) {
      if (!a2 || 'pool'.startsWith(a2)) {
        const pools = Object.entries(dev.dhcpPools ?? {});
        if (pools.length === 0) return { status: 'ok', lines: ['No DHCP pools configured.'] };
        const lines: string[] = [];
        for (const [name, p] of pools) {
          lines.push(`Pool ${name} :`);
          lines.push(` Utilization mark (high/low)    : 100 / 0`);
          lines.push(` Subnet size (first/next)       : 0 / 0`);
          lines.push(` Current index        IP address range                    Leased/Excluded/Total`);
          lines.push(` ${p.network.padEnd(20)} ${p.network} - ${p.mask}`);
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
        .filter((i) => !i.isSvi && !i.routedPort && i.switchportMode !== 'trunk' && (i.accessVlan ?? 1) === vid)
        .map((i) => i.shortName)
        .join(', ');
      lines.push(`${vidStr.padEnd(5)}${vname.padEnd(33)}active    ${ports}`);
    }
    return { status: 'ok', lines };
  }

  if ('interfaces'.startsWith(a0)) {
    if (!a1) {
      const lines: string[] = [];
      for (const iface of Object.values(dev.interfaces)) {
        const op = isLinkOperational(dev.id, iface, devices);
        const stateText = iface.errDisabled
          ? 'down (err-disabled)'
          : !iface.adminUp
            ? 'administratively down'
            : op
              ? 'up'
              : 'down';
        lines.push(`${iface.name} is ${stateText}, line protocol is ${op ? 'up (connected)' : 'down'}`);
        if (iface.description) lines.push(`  Description: ${iface.description}`);
        if (iface.ip && iface.mask) lines.push(`  Internet address is ${iface.ip}/${maskToCidr(iface.mask)}`);
        lines.push(`  ${iface.duplex ?? 'auto'}-duplex, ${iface.speed ?? 'auto'}-speed, media type is 10/100/1000BaseTX`);
      }
      return { status: 'ok', lines };
    }
    if ('status'.startsWith(a1)) {
      const lines = ['Port      Name               Status       Vlan       Duplex  Speed Type'];
      for (const iface of Object.values(dev.interfaces)) {
        if (iface.isSvi) continue;
        const op = isLinkOperational(dev.id, iface, devices);
        const status = iface.errDisabled
          ? 'err-disabled'
          : !iface.adminUp
            ? 'disabled'
            : op
              ? 'connected'
              : 'notconnect';
        const vlanCol = iface.routedPort
          ? 'routed'
          : iface.switchportMode === 'trunk'
            ? 'trunk'
            : String(iface.accessVlan ?? 1);
        lines.push(
          `${iface.shortName.padEnd(10)}${(iface.description ?? '').slice(0, 18).padEnd(19)}${status.padEnd(13)}${vlanCol.padEnd(11)}${(iface.duplex ?? 'auto').padEnd(8)}${(iface.speed ?? 'auto').padEnd(6)}10/100/1000`,
        );
      }
      return { status: 'ok', lines };
    }
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
    if ('counters'.startsWith(a1)) {
      const lines = ['Port        Align-Err    FCS-Err   Xmit-Err    Rcv-Err  UnderSize'];
      for (const iface of Object.values(dev.interfaces)) {
        const err = iface.errDisabled ? '14' : '0';
        lines.push(`${iface.shortName.padEnd(12)}0            ${err.padEnd(10)}0           ${err.padEnd(9)}0`);
      }
      return { status: 'ok', lines };
    }
    if ('switchport'.startsWith(a1)) {
      const lines: string[] = [];
      for (const iface of Object.values(dev.interfaces)) {
        if (iface.isSvi) continue;
        lines.push(`Name: ${iface.shortName}`);
        lines.push(`Switchport: ${iface.routedPort ? 'Disabled' : 'Enabled'}`);
        if (!iface.routedPort) {
          lines.push(`Administrative Mode: ${iface.switchportMode ?? 'dynamic auto'}`);
          lines.push(`Access Mode VLAN: ${iface.accessVlan ?? 1}`);
          lines.push(`Trunking Native Mode VLAN: ${iface.nativeVlan ?? 1}`);
          lines.push(`Trunking VLANs Enabled: ${iface.trunkAllowedVlans ?? 'ALL'}`);
        }
        lines.push('');
      }
      return { status: 'ok', lines };
    }
    const singleIf = normalizeInterfaceInput(args[1], dev);
    if (singleIf) {
      const iface = dev.interfaces[singleIf.ifName];
      const op = isLinkOperational(dev.id, iface, devices);
      return {
        status: 'ok',
        lines: [
          `${iface.name} is ${iface.errDisabled ? 'down (err-disabled)' : !iface.adminUp ? 'administratively down' : op ? 'up' : 'down'}, line protocol is ${op ? 'up (connected)' : 'down'}`,
          ...(iface.description ? [`  Description: ${iface.description}`] : []),
          ...(iface.ip && iface.mask ? [`  Internet address is ${iface.ip}/${maskToCidr(iface.mask)}`] : []),
          ...(iface.errDisabledReason ? [`  Error disabled reason: ${iface.errDisabledReason}`] : []),
          `  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec`,
          `  ${iface.duplex ?? 'auto'}-duplex, ${iface.speed ?? 'auto'}-speed`,
        ],
      };
    }
    return { status: 'invalid', token: args[1] };
  }

  if ('etherchannel'.startsWith(a0)) {
    if (a1 && !'summary'.startsWith(a1)) return { status: 'invalid', token: args[1] };
    const poGroups = new Map<number, SimInterface[]>();
    for (const iface of Object.values(dev.interfaces)) {
      if (iface.channelGroup) {
        const list = poGroups.get(iface.channelGroup.id) ?? [];
        list.push(iface);
        poGroups.set(iface.channelGroup.id, list);
      }
    }
    if (poGroups.size === 0) {
      return { status: 'ok', lines: ['No EtherChannel port-channels configured.'] };
    }
    const lines = [
      'Flags:  D - down        P - bundled in port-channel',
      '        I - stand-alone s - suspended',
      '        U - in use      N - not in use, no control',
      '',
      'Group  Port-channel  Protocol    Ports',
      '------+-------------+-----------+-----------------------------------------------',
    ];
    for (const [gid, members] of poGroups.entries()) {
      const mode = members[0]?.channelGroup?.mode ?? 'active';
      const proto = mode === 'on' ? '-' : 'LACP';
      const anyUp = members.some((m) => isLinkOperational(dev.id, m, devices));
      const portStr = members
        .map((m) => `${m.shortName}(${isLinkOperational(dev.id, m, devices) ? 'P' : 'D'})`)
        .join(' ');
      lines.push(
        `${String(gid).padEnd(7)}${`Po${gid}(${anyUp ? 'SU' : 'SD'})`.padEnd(14)}${proto.padEnd(12)}${portStr}`,
      );
    }
    return { status: 'ok', lines };
  }

  if ('mac'.startsWith(a0)) {
    const lines = [
      '          Mac Address Table',
      '-------------------------------------------',
      'Vlan    Mac Address       Type        Ports',
      '----    -----------       --------    -----',
    ];
    let idx = 1;
    for (const iface of Object.values(dev.interfaces)) {
      if (iface.isSvi || iface.switchportMode === 'trunk') continue;
      if (isLinkOperational(dev.id, iface, devices)) {
        const vid = String(iface.accessVlan ?? 1).padStart(4);
        lines.push(`${vid}    0050.7966.680${idx}    DYNAMIC     ${iface.shortName}`);
        idx++;
      }
    }
    return { status: 'ok', lines };
  }

  if ('standby'.startsWith(a0)) {
    const hsrpIfs = Object.values(dev.interfaces).filter((i) => i.hsrp);
    if (hsrpIfs.length === 0) return { status: 'ok', lines: ['No HSRP groups configured.'] };
    const lines = [
      '                     P indicates configured to preempt.',
      'Interface   Grp  Pri P State   Active          Standby         Virtual IP',
    ];
    for (const i of hsrpIfs) {
      const pri = i.hsrp!.priority ?? 100;
      const isActive = pri > 100;
      lines.push(
        `${i.shortName.padEnd(12)}${String(i.hsrp!.group).padEnd(5)}${String(pri).padEnd(4)}${i.hsrp!.preempt ? 'P ' : '  '}${(isActive ? 'Active' : 'Standby').padEnd(8)}${(isActive ? 'local' : '10.10.10.2').padEnd(16)}${(isActive ? '10.10.10.3' : 'local').padEnd(16)}${i.hsrp!.vip}`,
      );
    }
    return { status: 'ok', lines };
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
        ...Object.values(dev.interfaces)
          .filter((i) => !i.isSvi)
          .map((i) => {
            const up = isLinkOperational(dev.id, i, devices);
            return `${i.shortName.padEnd(20)}${isRoot ? 'Desg' : 'Root'} ${up ? 'FWD' : 'BLK'} 4         128.1    P2p${i.portFast ? ' Edge' : ''}`;
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

  if ('cdp'.startsWith(a0) || 'lldp'.startsWith(a0)) {
    if (!a1) return { status: 'incomplete' };
    if (a0.startsWith('l') && !dev.lldpEnabled) {
      return { status: 'ok', lines: ['% LLDP is not enabled'] };
    }
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
      return ['enable', 'ping', 'traceroute', 'show ip interface brief', 'show running-config', 'exit'];
    case 'priv':
      return [
        'configure terminal',
        'show ip interface brief',
        'show interfaces status',
        'show interfaces trunk',
        'show running-config',
        'show ip route',
        'show vlan brief',
        'show etherchannel summary',
        'show ip ospf neighbor',
        'show ip ospf interface brief',
        'show spanning-tree',
        'show access-lists',
        'show port-security',
        'show cdp neighbors',
        'show lldp neighbors',
        'show ip nat translations',
        'show standby brief',
        'show ip ssh',
        'show mac address-table',
        'show logging',
        'show version',
        'ping',
        'traceroute',
        'copy running-config startup-config',
        'clear',
      ];
    case 'config':
      return [
        'hostname',
        'enable secret',
        'banner motd',
        'interface',
        'interface range',
        'interface vlan',
        'interface port-channel',
        'ip route',
        'ip domain-name',
        'ip ssh version 2',
        'ip dhcp excluded-address',
        'ip dhcp pool',
        'ip nat inside source list',
        'username',
        'crypto key generate rsa modulus 2048',
        'router ospf 1',
        'ip access-list extended',
        'access-list',
        'line vty 0 15',
        'lldp run',
        ...(deviceKind === 'switch' ? ['ip routing', 'vlan', 'spanning-tree vlan 1 root primary'] : []),
        'end',
        'exit',
      ];
    case 'if':
    case 'if-range':
      return [
        'description',
        'ip address',
        'no shutdown',
        'shutdown',
        'speed',
        'duplex',
        'standby',
        'ip helper-address',
        'ip nat inside',
        'ip nat outside',
        'ip ospf cost',
        ...(deviceKind === 'switch'
          ? [
              'no switchport',
              'switchport mode access',
              'switchport access vlan',
              'switchport mode trunk',
              'switchport trunk allowed vlan',
              'switchport trunk native vlan',
              'channel-group 1 mode active',
              'spanning-tree portfast',
              'spanning-tree bpduguard enable',
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
      return [
        'router-id',
        'network',
        'passive-interface',
        'no passive-interface',
        'default-information originate',
        'auto-cost reference-bandwidth',
        'exit',
        'end',
      ];
    case 'vlan':
      return ['name', 'exit', 'end'];
    case 'acl':
      return ['permit', 'deny', 'exit', 'end'];
    case 'line':
      return ['login local', 'transport input ssh', 'access-class', 'logging synchronous', 'exec-timeout', 'exit', 'end'];
    case 'dhcp-pool':
      return ['network', 'default-router', 'dns-server', 'exit', 'end'];
  }
}

export function autocompleteIosInput(
  raw: string,
  session: CliSessionState,
  dev: SimDevice,
): { completed?: string; candidates?: string[] } {
  const trimmedLeft = raw.trimStart();
  if (!trimmedLeft) return {};
  const lower = trimmedLeft.toLowerCase();

  // Interface completion when typing "interface <prefix>"
  if (session.mode === 'config' && /^int(?:erface)?\s+([^\s]+)$/i.test(trimmedLeft)) {
    const ifPart = trimmedLeft.split(/\s+/)[1].toLowerCase();
    const ifMatches = Object.keys(dev.interfaces).filter((name) =>
      name.toLowerCase().startsWith(ifPart) || dev.interfaces[name].shortName.toLowerCase().startsWith(ifPart),
    );
    if (ifMatches.length === 1) return { completed: `interface ${ifMatches[0]}` };
    if (ifMatches.length > 1) return { candidates: ifMatches };
  }

  const cmds = getModeCompletions(session.mode, dev.kind);
  // Direct prefix match against full candidate list
  const directMatches = cmds.filter((c) => c.toLowerCase().startsWith(lower));
  if (directMatches.length === 1) {
    return { completed: `${directMatches[0]} ` };
  }

  // Word-by-word prefix match (e.g. "sh ip int b" -> "show ip interface brief")
  const tokens = lower.split(/\s+/);
  const tokenMatches = cmds.filter((c) => {
    const cTokens = c.toLowerCase().split(/\s+/);
    if (tokens.length > cTokens.length) return false;
    return tokens.every((t, idx) => cTokens[idx].startsWith(t));
  });

  if (tokenMatches.length === 1) {
    return { completed: `${tokenMatches[0]} ` };
  }
  if (tokenMatches.length > 1) {
    return { candidates: tokenMatches };
  }
  if (directMatches.length > 1) {
    return { candidates: directMatches };
  }
  return {};
}

export function getContextHelp(
  rawBeforeQuestion: string,
  session: CliSessionState,
  dev: SimDevice,
): string[] {
  const clean = rawBeforeQuestion.trim().toLowerCase();
  const cmds = getModeCompletions(session.mode, dev.kind);
  if (!clean) {
    return ['Available commands:', ...cmds.map((c) => `  ${c}`)];
  }
  const tokens = clean.split(/\s+/);
  if (tokens[0] === 'show' || 'show'.startsWith(tokens[0])) {
    if (tokens.length === 1) {
      return [
        'Show options:',
        '  access-lists          List IP access lists',
        '  cdp neighbors         CDP neighbor summary',
        '  etherchannel summary  EtherChannel / LACP port-channel status',
        '  interfaces [status|trunk] Interface & trunk details',
        '  ip <int|route|ospf|nat|ssh|arp> IP operational tables',
        '  lldp neighbors        LLDP neighbor summary',
        '  mac address-table     Dynamic MAC table',
        '  port-security         Port-security status',
        '  running-config        Current active configuration',
        '  spanning-tree         Spanning tree topology',
        '  standby brief         HSRP active/standby summary',
        '  vlan brief            VLAN status summary',
      ];
    }
    if (tokens[1] === 'ip') {
      return [
        'Show IP options:',
        '  arp                   IP ARP table',
        '  dhcp pool             DHCP server pool usage',
        '  interface brief       Brief status and configuration',
        '  nat translations      NAT overload table',
        '  ospf neighbor         OSPF neighbor table',
        '  ospf interface brief  OSPF interface area & passive state',
        '  route                 IP routing table',
        '  ssh                   SSH version & RSA status',
      ];
    }
  }
  if ((session.mode === 'if' || session.mode === 'if-range') && 'switchport'.startsWith(tokens[0])) {
    return [
      'Switchport options:',
      '  access vlan <1-4094>          Set VLAN when in access mode',
      '  mode <access|trunk>           Set trunking mode unconditionally',
      '  port-security                 Enable Layer 2 port security',
      '  trunk allowed vlan <list>     Set allowed VLANs on trunk',
      '  trunk native vlan <id>        Set native VLAN on trunk',
    ];
  }
  const matching = cmds.filter((c) => {
    const cTokens = c.toLowerCase().split(/\s+/);
    return tokens.every((t, idx) => cTokens[idx]?.startsWith(t)) || c.toLowerCase().startsWith(clean);
  });
  if (matching.length > 0) {
    return matching.map((m) => `  ${m}`);
  }
  return ['% Unrecognized command'];
}

function applySingleInterfaceCommand(
  cmd: string,
  rest: string[],
  trimmed: string,
  iface: SimInterface,
  dev: SimDevice,
  devices: Record<string, SimDevice>,
): { ok: true; output: string[] } | { ok: false; output: string[] } {
  const resolved = matchPrefix(cmd, [
    'no',
    'shutdown',
    'description',
    'speed',
    'duplex',
    'ip',
    'switchport',
    'channel-group',
    'spanning-tree',
    'standby',
  ]);
  if (resolved.ambiguous) {
    return { ok: false, output: [`% Ambiguous command: "${trimmed}"`] };
  }

  if (resolved.match === 'description') {
    if (rest.length === 0) return { ok: false, output: ['% Incomplete command.'] };
    iface.description = rest.join(' ');
    return { ok: true, output: [] };
  }

  if (resolved.match === 'speed') {
    const val = rest[0]?.toLowerCase();
    if (val === 'auto' || val === '100' || val === '1000') {
      iface.speed = val;
      return { ok: true, output: [] };
    }
    return { ok: false, output: invalidInputLines(trimmed, rest[0]) };
  }

  if (resolved.match === 'duplex') {
    const val = rest[0]?.toLowerCase();
    if (val === 'auto' || val === 'half' || val === 'full') {
      iface.duplex = val;
      return { ok: true, output: [] };
    }
    return { ok: false, output: invalidInputLines(trimmed, rest[0]) };
  }

  if (resolved.match === 'no') {
    if (!rest[0]) return { ok: false, output: ['% Incomplete command.'] };
    const sub = rest[0].toLowerCase();
    if ('shutdown'.startsWith(sub)) {
      const wasErrDisabled = Boolean(iface.errDisabled);
      iface.adminUp = true;
      iface.protocolUp = true;
      iface.errDisabled = false;
      iface.errDisabledReason = undefined;
      const op = isLinkOperational(dev.id, iface, devices);
      const msgs = [`%LINK-3-UPDOWN: Interface ${iface.name}, changed state to ${op ? 'up' : 'down'}`];
      if (wasErrDisabled) {
        msgs.unshift(`%PM-4-ERR_RECOVER: Attempting to recover from err-disable state on ${iface.shortName}`);
      }
      return { ok: true, output: msgs };
    }
    if ('switchport'.startsWith(sub)) {
      iface.routedPort = true;
      iface.switchportMode = undefined;
      return { ok: true, output: [] };
    }
    if (sub === 'ip' && rest[1]?.toLowerCase().startsWith('access-group')) {
      const dir = rest[3]?.toLowerCase();
      if (dir === 'in') iface.accessGroupIn = undefined;
      else if (dir === 'out') iface.accessGroupOut = undefined;
      else {
        iface.accessGroupIn = undefined;
        iface.accessGroupOut = undefined;
      }
      return { ok: true, output: [] };
    }
    return { ok: false, output: invalidInputLines(trimmed, rest[0]) };
  }

  if (resolved.match === 'shutdown') {
    iface.adminUp = false;
    iface.protocolUp = false;
    iface.errDisabled = false;
    iface.errDisabledReason = undefined;
    return {
      ok: true,
      output: [`%LINK-5-CHANGED: Interface ${iface.name}, changed state to administratively down`],
    };
  }

  if (resolved.match === 'channel-group') {
    if (rest.length < 3 || rest[1].toLowerCase() !== 'mode') {
      return { ok: false, output: ['% Incomplete command.'] };
    }
    const gid = Number(rest[0]);
    const mode = rest[2].toLowerCase();
    if (Number.isNaN(gid) || (mode !== 'active' && mode !== 'passive' && mode !== 'on')) {
      return { ok: false, output: invalidInputLines(trimmed, rest[2]) };
    }
    iface.channelGroup = { id: gid, mode };
    const poName = `Port-channel${gid}`;
    if (!dev.interfaces[poName]) {
      dev.interfaces[poName] = {
        name: poName,
        shortName: `Po${gid}`,
        adminUp: true,
        protocolUp: true,
        switchportMode: iface.switchportMode,
        trunkAllowedVlans: iface.trunkAllowedVlans,
        nativeVlan: iface.nativeVlan,
      };
    }
    return { ok: true, output: [`Creating a port-channel interface Port-channel ${gid}`] };
  }

  if (resolved.match === 'spanning-tree') {
    if (!rest[0]) return { ok: false, output: ['% Incomplete command.'] };
    const stSub = rest[0].toLowerCase();
    if ('portfast'.startsWith(stSub)) {
      iface.portFast = true;
      return { ok: true, output: [] };
    }
    if ('bpduguard'.startsWith(stSub) && rest[1]?.toLowerCase().startsWith('en')) {
      iface.bpduGuard = true;
      return { ok: true, output: [] };
    }
    return { ok: false, output: invalidInputLines(trimmed, rest[0]) };
  }

  if (resolved.match === 'standby') {
    if (rest.length < 2) return { ok: false, output: ['% Incomplete command.'] };
    const grp = Number(rest[0]);
    if (Number.isNaN(grp)) return { ok: false, output: invalidInputLines(trimmed, rest[0]) };
    iface.hsrp = iface.hsrp ?? { group: grp, vip: '' };
    const key = rest[1].toLowerCase();
    if (key === 'ip') {
      if (!rest[2] || !isValidIpv4(rest[2])) return { ok: false, output: invalidInputLines(trimmed, rest[2]) };
      iface.hsrp.group = grp;
      iface.hsrp.vip = rest[2];
      return { ok: true, output: [] };
    }
    if ('priority'.startsWith(key)) {
      const pri = Number(rest[2]);
      if (Number.isNaN(pri)) return { ok: false, output: invalidInputLines(trimmed, rest[2]) };
      iface.hsrp.priority = pri;
      return { ok: true, output: [] };
    }
    if ('preempt'.startsWith(key)) {
      iface.hsrp.preempt = true;
      return { ok: true, output: [] };
    }
    return { ok: false, output: invalidInputLines(trimmed, rest[1]) };
  }

  if (resolved.match === 'ip') {
    if (!rest[0]) return { ok: false, output: ['% Incomplete command.'] };
    const sub = rest[0].toLowerCase();
    if ('address'.startsWith(sub)) {
      if (!rest[1] || !rest[2]) return { ok: false, output: ['% Incomplete command.'] };
      if (!isValidIpv4(rest[1]) || !isValidIpv4(rest[2])) {
        return { ok: false, output: invalidInputLines(trimmed, rest[1]) };
      }
      iface.ip = rest[1];
      iface.mask = rest[2];
      return { ok: true, output: [] };
    }
    if ('access-group'.startsWith(sub)) {
      if (!rest[1] || !rest[2]) return { ok: false, output: ['% Incomplete command.'] };
      const dir = rest[2].toLowerCase();
      if (dir === 'in') iface.accessGroupIn = rest[1];
      else if (dir === 'out') iface.accessGroupOut = rest[1];
      else return { ok: false, output: invalidInputLines(trimmed, rest[2]) };
      return { ok: true, output: [] };
    }
    if ('helper-address'.startsWith(sub)) {
      if (!rest[1] || !isValidIpv4(rest[1])) return { ok: false, output: invalidInputLines(trimmed, rest[1]) };
      iface.helperAddress = rest[1];
      return { ok: true, output: [] };
    }
    if ('nat'.startsWith(sub)) {
      const role = rest[1]?.toLowerCase();
      if (role === 'inside' || role === 'outside') {
        iface.natRole = role;
        return { ok: true, output: [] };
      }
      return { ok: false, output: invalidInputLines(trimmed, rest[1]) };
    }
    if ('ospf'.startsWith(sub) && rest[1]?.toLowerCase() === 'cost') {
      const c = Number(rest[2]);
      if (Number.isNaN(c) || c < 1) return { ok: false, output: invalidInputLines(trimmed, rest[2]) };
      iface.ospfCost = c;
      return { ok: true, output: [] };
    }
    return { ok: false, output: invalidInputLines(trimmed, rest[0]) };
  }

  if (resolved.match === 'switchport') {
    if (!rest[0]) return { ok: false, output: ['% Incomplete command.'] };
    const sub = rest[0].toLowerCase();
    if ('mode'.startsWith(sub)) {
      if (!rest[1]) return { ok: false, output: ['% Incomplete command.'] };
      const m = rest[1].toLowerCase();
      if ('access'.startsWith(m)) {
        iface.switchportMode = 'access';
        return { ok: true, output: [] };
      }
      if ('trunk'.startsWith(m)) {
        iface.switchportMode = 'trunk';
        if (!iface.trunkAllowedVlans) iface.trunkAllowedVlans = '1-4094';
        return { ok: true, output: [] };
      }
      return { ok: false, output: invalidInputLines(trimmed, rest[1]) };
    }
    if ('access'.startsWith(sub)) {
      if (!rest[1] || !rest[2]) return { ok: false, output: ['% Incomplete command.'] };
      if ('vlan'.startsWith(rest[1].toLowerCase()) && /^\d+$/.test(rest[2])) {
        const vid = Number(rest[2]);
        iface.accessVlan = vid;
        if (!dev.vlans[vid]) dev.vlans[vid] = `VLAN${String(vid).padStart(4, '0')}`;
        return { ok: true, output: [] };
      }
      return { ok: false, output: invalidInputLines(trimmed, rest[2]) };
    }
    if ('trunk'.startsWith(sub)) {
      if (!rest[1] || !rest[2] || !rest[3]) {
        return { ok: false, output: ['% Incomplete command.'] };
      }
      if ('allowed'.startsWith(rest[1].toLowerCase()) && 'vlan'.startsWith(rest[2].toLowerCase())) {
        const arg3 = rest[3].toLowerCase();
        if (arg3 === 'add' && rest[4]) {
          const cur = parseAllowedVlans(iface.trunkAllowedVlans);
          const toAdd = parseAllowedVlans(rest[4]);
          if (cur === 'all' || toAdd === 'all') {
            iface.trunkAllowedVlans = '1-4094';
          } else {
            toAdd.forEach((v) => cur.add(v));
            iface.trunkAllowedVlans = formatAllowedVlans(cur);
          }
          return { ok: true, output: [] };
        }
        iface.trunkAllowedVlans = rest[3];
        return { ok: true, output: [] };
      }
      if ('native'.startsWith(rest[1].toLowerCase()) && 'vlan'.startsWith(rest[2].toLowerCase())) {
        iface.nativeVlan = Number(rest[3]);
        return { ok: true, output: [] };
      }
      return { ok: false, output: invalidInputLines(trimmed, rest[1]) };
    }
    if ('port-security'.startsWith(sub)) {
      if (iface.switchportMode !== 'access') {
        return {
          ok: false,
          output: [`Command rejected: ${iface.name} is a dynamic port. Set "switchport mode access" first.`],
        };
      }
      iface.portSecurity = iface.portSecurity ?? { enabled: true, maximum: 1, violation: 'shutdown' };
      iface.portSecurity.enabled = true;
      if (rest[1]) {
        const pSub = rest[1].toLowerCase();
        if ('maximum'.startsWith(pSub)) {
          if (!rest[2]) return { ok: false, output: ['% Incomplete command.'] };
          iface.portSecurity.maximum = Number(rest[2]) || 1;
        } else if ('violation'.startsWith(pSub)) {
          if (!rest[2]) return { ok: false, output: ['% Incomplete command.'] };
          const v = rest[2].toLowerCase();
          if ('shutdown'.startsWith(v)) iface.portSecurity.violation = 'shutdown';
          else if ('restrict'.startsWith(v)) iface.portSecurity.violation = 'restrict';
          else if ('protect'.startsWith(v)) iface.portSecurity.violation = 'protect';
          else return { ok: false, output: invalidInputLines(trimmed, rest[2]) };
        } else if ('mac-address'.startsWith(pSub)) {
          if (!rest[2]) return { ok: false, output: ['% Incomplete command.'] };
          if ('sticky'.startsWith(rest[2].toLowerCase())) iface.portSecurity.macSticky = true;
        } else {
          return { ok: false, output: invalidInputLines(trimmed, rest[1]) };
        }
      }
      return { ok: true, output: [] };
    }
    return { ok: false, output: invalidInputLines(trimmed, rest[0]) };
  }

  return { ok: false, output: invalidInputLines(trimmed, cmd) };
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

  // Split optional output pipe ("show ... | include ...")
  const pipeIdx = trimmed.indexOf('|');
  const mainPart = pipeIdx !== -1 ? trimmed.slice(0, pipeIdx).trim() : trimmed;
  const pipeClause = pipeIdx !== -1 ? trimmed.slice(pipeIdx + 1).trim() : undefined;

  const tokens = mainPart.split(/\s+/);
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
    const reconstructed = pipeClause ? `${rest.join(' ')} | ${pipeClause}` : rest.join(' ');
    const subRes = executeIosCommand(reconstructed, { ...session, mode: 'priv' }, devices);
    return {
      ...subRes,
      nextSession: session,
    };
  }

  // USER EXEC
  if (session.mode === 'user') {
    const resolved = matchPrefix(cmd, ['enable', 'ping', 'traceroute', 'show', 'exit']);
    if (resolved.ambiguous) {
      return { output: [`% Ambiguous command: "${trimmed}"`], nextSession: session, devices };
    }
    if (resolved.match === 'enable') {
      return { output: [], nextSession: { deviceId: session.deviceId, mode: 'priv' }, devices };
    }
    if (resolved.match === 'ping') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (!isValidIpv4(rest[0])) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      }
      const sourceIdx = rest.findIndex((t) => t.toLowerCase() === 'source');
      const sourceSpec = sourceIdx !== -1 ? rest[sourceIdx + 1] : undefined;
      const res = simulatePing(dev.id, rest[0], devices, sourceSpec);
      return {
        output: res.lines,
        nextSession: session,
        devices,
        pingTargetIp: rest[0],
        pingSuccess: res.success,
      };
    }
    if (resolved.match === 'traceroute') {
      if (!rest[0] || !isValidIpv4(rest[0])) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      }
      const res = simulatePing(dev.id, rest[0], devices);
      const lines = [
        `Type escape sequence to abort.`,
        `Tracing the route to ${rest[0]}`,
        ...(res.hops.length > 0
          ? res.hops.map((h, i) => `  ${i + 1} ${h} 2 msec 1 msec 2 msec`)
          : [`  1  *  *  *`]),
      ];
      return { output: lines, nextSession: session, devices };
    }
    if (resolved.match === 'show') {
      const res = handleShowCommand(rest, dev, devices);
      if (res.status === 'ok') return { output: applyPipeFilter(res.lines, pipeClause), nextSession: session, devices };
      if (res.status === 'incomplete') return { output: ['% Incomplete command.'], nextSession: session, devices };
      return { output: invalidInputLines(mainPart, res.token), nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // PRIVILEGED EXEC
  if (session.mode === 'priv') {
    const resolved = matchPrefix(cmd, ['configure', 'show', 'ping', 'traceroute', 'write', 'copy', 'disable']);
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
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }
    if (resolved.match === 'show') {
      const res = handleShowCommand(rest, dev, devices);
      if (res.status === 'ok') return { output: applyPipeFilter(res.lines, pipeClause), nextSession: session, devices };
      if (res.status === 'incomplete') return { output: ['% Incomplete command.'], nextSession: session, devices };
      return { output: invalidInputLines(mainPart, res.token), nextSession: session, devices };
    }
    if (resolved.match === 'ping') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (!isValidIpv4(rest[0])) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      }
      const sourceIdx = rest.findIndex((t) => t.toLowerCase() === 'source');
      const sourceSpec = sourceIdx !== -1 ? rest[sourceIdx + 1] : undefined;
      const res = simulatePing(dev.id, rest[0], devices, sourceSpec);
      return {
        output: res.lines,
        nextSession: session,
        devices,
        pingTargetIp: rest[0],
        pingSuccess: res.success,
      };
    }
    if (resolved.match === 'traceroute') {
      if (!rest[0] || !isValidIpv4(rest[0])) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      }
      const res = simulatePing(dev.id, rest[0], devices);
      const lines = [
        `Type escape sequence to abort.`,
        `Tracing the route to ${rest[0]}`,
        ...(res.hops.length > 0
          ? res.hops.map((h, i) => `  ${i + 1} ${h} 2 msec 1 msec 2 msec`)
          : [`  1  *  *  *`]),
      ];
      return { output: lines, nextSession: session, devices };
    }
    if (resolved.match === 'write' || resolved.match === 'copy') {
      if (resolved.match === 'copy' && !rest[0]) {
        return { output: ['% Incomplete command.'], nextSession: session, devices };
      }
      return { output: ['Building configuration...', '[OK]'], nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // Allow jumping directly between config submodes (matching real Cisco IOS)
  if (session.mode !== 'config') {
    const r0 = rest[0]?.toLowerCase() ?? '';
    const r1 = rest[1]?.toLowerCase() ?? '';
    const isGlobalJump =
      ('interface'.startsWith(cmd) && cmd.length >= 3) ||
      ('router'.startsWith(cmd) && cmd.length >= 3) ||
      ('line'.startsWith(cmd) && cmd.length >= 3) ||
      ('vlan'.startsWith(cmd) && cmd.length >= 2 && /^\d+$/.test(r0)) ||
      ('access-list'.startsWith(cmd) && cmd.length >= 6) ||
      ('hostname'.startsWith(cmd) && cmd.length >= 4) ||
      ('banner'.startsWith(cmd) && cmd.length >= 3) ||
      ('username'.startsWith(cmd) && cmd.length >= 4) ||
      ('crypto'.startsWith(cmd) && cmd.length >= 3) ||
      (cmd === 'lldp' && r0 === 'run') ||
      (cmd === 'ip' &&
        ('route'.startsWith(r0) ||
          'routing'.startsWith(r0) ||
          'access-list'.startsWith(r0) ||
          'domain-name'.startsWith(r0) ||
          r0 === 'domain' ||
          r0 === 'ssh' ||
          r0 === 'dhcp' ||
          ('nat'.startsWith(r0) && r1 === 'inside' && rest[2]?.toLowerCase() === 'source')));
    if (isGlobalJump) {
      return executeIosCommand(rawInput, { deviceId: session.deviceId, mode: 'config' }, inputDevices);
    }
  }

  // GLOBAL CONFIG
  if (session.mode === 'config') {
    const resolved = matchPrefix(cmd, [
      'hostname',
      'enable',
      'banner',
      'username',
      'crypto',
      'line',
      'lldp',
      'no',
      'interface',
      'vlan',
      'router',
      'ip',
      'access-list',
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

    if (resolved.match === 'banner') {
      if (rest.length < 2 || rest[0].toLowerCase() !== 'motd') {
        return { output: ['% Incomplete command.'], nextSession: session, devices };
      }
      const rawBanner = rest.slice(1).join(' ');
      const delim = rawBanner[0];
      const stripped =
        rawBanner.length >= 2 && rawBanner.endsWith(delim)
          ? rawBanner.slice(1, -1)
          : rawBanner.replace(/^[#^~]/, '').replace(/[#^~]$/, '');
      dev.bannerMotd = stripped.trim();
      return { output: [], nextSession: session, devices };
    }

    if (resolved.match === 'username') {
      if (rest.length < 3) return { output: ['% Incomplete command.'], nextSession: session, devices };
      const [user, kind, secretVal] = rest;
      if (!'secret'.startsWith(kind.toLowerCase()) && !'password'.startsWith(kind.toLowerCase())) {
        return { output: invalidInputLines(mainPart, kind), nextSession: session, devices };
      }
      dev.users = dev.users ?? {};
      dev.users[user] = secretVal;
      return { output: [], nextSession: session, devices };
    }

    if (resolved.match === 'crypto') {
      if (rest[0]?.toLowerCase() === 'key' && rest[1]?.toLowerCase().startsWith('gen') && rest[2]?.toLowerCase() === 'rsa') {
        if (!dev.domainName) {
          return {
            output: ['% Please define a domain-name first (ip domain-name <domain>).'],
            nextSession: session,
            devices,
          };
        }
        const modIdx = rest.findIndex((t) => 'modulus'.startsWith(t.toLowerCase()));
        const modulus = modIdx !== -1 && rest[modIdx + 1] ? Number(rest[modIdx + 1]) || 2048 : 2048;
        dev.rsaModulus = modulus;
        return {
          output: [
            `The name for the keys will be: ${dev.hostname}.${dev.domainName}`,
            `% The key modulus size is ${modulus} bits`,
            `% Generating ${modulus} bit RSA keys, keys will be non-exportable...[OK]`,
          ],
          nextSession: session,
          devices,
        };
      }
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }

    if (resolved.match === 'line') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      return {
        output: [],
        nextSession: { deviceId: dev.id, mode: 'line', activeLine: rest.join(' ') },
        devices,
      };
    }

    if (resolved.match === 'lldp') {
      if (rest[0]?.toLowerCase() === 'run') {
        dev.lldpEnabled = true;
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }

    if (resolved.match === 'no') {
      if (rest[0]?.toLowerCase() === 'ip' && rest[1]?.toLowerCase() === 'routing') {
        dev.ipRouting = false;
        return { output: [], nextSession: session, devices };
      }
      if (rest[0]?.toLowerCase() === 'lldp' && rest[1]?.toLowerCase() === 'run') {
        dev.lldpEnabled = false;
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }

    if (resolved.match === 'enable') {
      if (!rest[0] || !rest[1]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('secret'.startsWith(rest[0].toLowerCase())) {
        dev.enableSecret = rest[1];
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }

    if (resolved.match === 'interface') {
      if (rest.length === 0) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('range'.startsWith(rest[0].toLowerCase())) {
        const rangeSpec = rest.slice(1).join(' ');
        if (!rangeSpec) return { output: ['% Incomplete command.'], nextSession: session, devices };
        const matchedRange = parseInterfaceRange(rangeSpec, dev);
        if (!matchedRange) {
          return { output: invalidInputLines(mainPart, rest[1]), nextSession: session, devices };
        }
        return {
          output: [],
          nextSession: { deviceId: dev.id, mode: 'if-range', activeRange: matchedRange },
          devices,
        };
      }
      const parsed = normalizeInterfaceInput(rest.join(' '), dev);
      if (!parsed) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
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
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
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
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }

    if (resolved.match === 'access-list') {
      if (rest.length < 3 || !/^\d+$/.test(rest[0])) {
        return { output: ['% Incomplete command.'], nextSession: session, devices };
      }
      const aclNum = Number(rest[0]);
      const aclType = aclNum >= 100 ? 'extended' : 'standard';
      const aclId = rest[0];
      dev.acls[aclId] = dev.acls[aclId] ?? { id: aclId, type: aclType, rules: [] };
      dev.acls[aclId].rules.push(rest.slice(1).join(' '));
      return { output: [], nextSession: session, devices };
    }

    if (resolved.match === 'ip') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      const sub = rest[0].toLowerCase();
      if ('routing'.startsWith(sub)) {
        dev.ipRouting = true;
        return { output: [], nextSession: session, devices };
      }
      if ('domain-name'.startsWith(sub) || (sub === 'domain' && rest[1]?.toLowerCase() === 'name')) {
        const dom = sub === 'domain' ? rest[2] : rest[1];
        if (!dom) return { output: ['% Incomplete command.'], nextSession: session, devices };
        dev.domainName = dom;
        return { output: [], nextSession: session, devices };
      }
      if ('ssh'.startsWith(sub) && rest[1]?.toLowerCase() === 'version') {
        const ver = Number(rest[2]);
        if (ver !== 1 && ver !== 2) return { output: invalidInputLines(mainPart, rest[2]), nextSession: session, devices };
        dev.sshVersion = ver;
        return { output: [], nextSession: session, devices };
      }
      if ('dhcp'.startsWith(sub)) {
        const dSub = rest[1]?.toLowerCase() ?? '';
        if ('excluded-address'.startsWith(dSub)) {
          if (!rest[2] || !isValidIpv4(rest[2])) return { output: invalidInputLines(mainPart, rest[2]), nextSession: session, devices };
          dev.dhcpExcluded = dev.dhcpExcluded ?? [];
          dev.dhcpExcluded.push(rest.slice(2).join(' '));
          return { output: [], nextSession: session, devices };
        }
        if ('pool'.startsWith(dSub)) {
          if (!rest[2]) return { output: ['% Incomplete command.'], nextSession: session, devices };
          dev.dhcpPools = dev.dhcpPools ?? {};
          dev.dhcpPools[rest[2]] = dev.dhcpPools[rest[2]] ?? { network: '0.0.0.0', mask: '0.0.0.0' };
          return {
            output: [],
            nextSession: { deviceId: dev.id, mode: 'dhcp-pool', activePool: rest[2] },
            devices,
          };
        }
        if ('snooping'.startsWith(dSub)) {
          dev.dhcpSnooping = dev.dhcpSnooping ?? { enabled: true, vlans: [] };
          dev.dhcpSnooping.enabled = true;
          if (rest[2]?.toLowerCase() === 'vlan' && rest[3]) {
            const vids = rest[3]
              .split(',')
              .map((v) => Number(v.trim()))
              .filter((v) => !Number.isNaN(v));
            dev.dhcpSnooping.vlans = Array.from(new Set([...dev.dhcpSnooping.vlans, ...vids]));
          }
          return { output: [], nextSession: session, devices };
        }
      }
      if ('nat'.startsWith(sub)) {
        // ip nat inside source list <aclId> interface <if> overload
        const listIdx = rest.findIndex((t) => t.toLowerCase() === 'list');
        const intIdx = rest.findIndex((t) => 'interface'.startsWith(t.toLowerCase()));
        if (listIdx === -1 || intIdx === -1 || !rest[listIdx + 1] || !rest[intIdx + 1]) {
          return { output: ['% Incomplete command.'], nextSession: session, devices };
        }
        const aclId = rest[listIdx + 1];
        const parsedIf = normalizeInterfaceInput(rest[intIdx + 1], dev);
        if (!parsedIf) return { output: invalidInputLines(mainPart, rest[intIdx + 1]), nextSession: session, devices };
        dev.natRules = dev.natRules ?? [];
        dev.natRules.push({ aclId, overloadInterface: parsedIf.ifName });
        return { output: [], nextSession: session, devices };
      }
      if ('route'.startsWith(sub)) {
        if (rest.length < 4) return { output: ['% Incomplete command.'], nextSession: session, devices };
        const [, prefix, mask, nextHop, adRaw] = rest;
        if (!isValidIpv4(prefix) || !isValidIpv4(mask) || !isValidIpv4(nextHop)) {
          return { output: invalidInputLines(mainPart, prefix), nextSession: session, devices };
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
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
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
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // INTERFACE CONFIG
  if (session.mode === 'if' && session.activeIf) {
    const iface = dev.interfaces[session.activeIf];
    if (!iface) return { output: ['% Interface not found'], nextSession: session, devices };
    const res = applySingleInterfaceCommand(cmd, rest, mainPart, iface, dev, devices);
    return { output: res.output, nextSession: session, devices };
  }

  // INTERFACE RANGE CONFIG
  if (session.mode === 'if-range' && session.activeRange) {
    const combinedOutput: string[] = [];
    for (const ifKey of session.activeRange) {
      const iface = dev.interfaces[ifKey];
      if (!iface) continue;
      const res = applySingleInterfaceCommand(cmd, rest, mainPart, iface, dev, devices);
      if (!res.ok) {
        return { output: res.output, nextSession: session, devices };
      }
      combinedOutput.push(...res.output);
    }
    return { output: combinedOutput, nextSession: session, devices };
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
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }
    if (cmd === 'ip') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if ('address'.startsWith(rest[0].toLowerCase())) {
        if (!rest[1] || !rest[2]) return { output: ['% Incomplete command.'], nextSession: session, devices };
        if (!isValidIpv4(rest[1]) || !isValidIpv4(rest[2])) {
          return { output: invalidInputLines(mainPart, rest[1]), nextSession: session, devices };
        }
        sub.ip = rest[1];
        sub.mask = rest[2];
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }
    if (cmd === 'no' && rest[0]?.toLowerCase().startsWith('shut')) {
      sub.adminUp = true;
      return { output: [], nextSession: session, devices };
    }
    if (cmd === 'no' && !rest[0]) {
      return { output: ['% Incomplete command.'], nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // OSPF ROUTER CONFIG
  if (session.mode === 'router-ospf') {
    if (cmd === 'no') {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      const nSub = rest[0].toLowerCase();
      if ('passive-interface'.startsWith(nSub)) {
        const target = rest[1];
        if (!target) return { output: ['% Incomplete command.'], nextSession: session, devices };
        const parsedIf = target.toLowerCase() === 'default' ? null : normalizeInterfaceInput(target, dev);
        const matchKey = parsedIf?.ifName ?? target.toLowerCase();
        dev.ospf.passiveInterfaces = (dev.ospf.passiveInterfaces ?? []).filter(
          (p) => p.toLowerCase() !== matchKey.toLowerCase(),
        );
        return { output: [], nextSession: session, devices };
      }
      if ('network'.startsWith(nSub) && rest.length >= 5) {
        const [, network, wildcard, , areaRaw] = rest;
        const area = Number(areaRaw);
        dev.ospf.networks = dev.ospf.networks.filter(
          (n) => !(n.network === network && n.wildcard === wildcard && n.area === area),
        );
        return { output: [], nextSession: session, devices };
      }
      return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
    }
    if ('router-id'.startsWith(cmd)) {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (!isValidIpv4(rest[0])) return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      dev.ospf.routerId = rest[0];
      return { output: [], nextSession: session, devices };
    }
    if ('passive-interface'.startsWith(cmd)) {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      const parsedIf = rest[0].toLowerCase() === 'default' ? null : normalizeInterfaceInput(rest[0], dev);
      const val = parsedIf?.ifName ?? rest[0].toLowerCase();
      dev.ospf.passiveInterfaces = Array.from(new Set([...(dev.ospf.passiveInterfaces ?? []), val]));
      return { output: [], nextSession: session, devices };
    }
    if ('default-information'.startsWith(cmd) && rest[0]?.toLowerCase().startsWith('orig')) {
      dev.ospf.defaultOriginate = true;
      return { output: [], nextSession: session, devices };
    }
    if ('auto-cost'.startsWith(cmd) && rest[0]?.toLowerCase().startsWith('ref') && rest[1]) {
      const bw = Number(rest[1]);
      if (Number.isNaN(bw) || bw < 1) return { output: invalidInputLines(mainPart, rest[1]), nextSession: session, devices };
      dev.ospf.referenceBandwidthMbps = bw;
      return { output: [], nextSession: session, devices };
    }
    if ('network'.startsWith(cmd)) {
      if (rest.length < 4) return { output: ['% Incomplete command.'], nextSession: session, devices };
      if (rest[2]?.toLowerCase() !== 'area') {
        return { output: invalidInputLines(mainPart, rest[2]), nextSession: session, devices };
      }
      const [network, wildcard, , areaRaw] = rest;
      if (!isValidIpv4(network) || !isValidIpv4(wildcard)) {
        return { output: invalidInputLines(mainPart, network), nextSession: session, devices };
      }
      const area = Number(areaRaw);
      if (Number.isNaN(area)) return { output: invalidInputLines(mainPart, areaRaw), nextSession: session, devices };
      const exists = dev.ospf.networks.some(
        (n) => n.network === network && n.wildcard === wildcard && n.area === area,
      );
      if (!exists) dev.ospf.networks.push({ network, wildcard, area });
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // VLAN CONFIG
  if (session.mode === 'vlan' && session.activeVlan !== undefined) {
    if ('name'.startsWith(cmd)) {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      dev.vlans[session.activeVlan] = rest.join('_');
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // ACL CONFIG
  if (session.mode === 'acl' && session.activeAcl) {
    const acl = dev.acls[session.activeAcl];
    if (acl && (cmd === 'permit' || cmd === 'deny')) {
      if (rest.length === 0) return { output: ['% Incomplete command.'], nextSession: session, devices };
      acl.rules.push(`${cmd} ${rest.join(' ')}`);
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // LINE CONFIG
  if (session.mode === 'line') {
    dev.vty = dev.vty ?? {};
    if ('login'.startsWith(cmd)) {
      if (rest[0]?.toLowerCase() === 'local') {
        dev.vty.loginLocal = true;
      }
      return { output: [], nextSession: session, devices };
    }
    if ('transport'.startsWith(cmd) && rest[0]?.toLowerCase() === 'input') {
      if (!rest[1]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      dev.vty.transportInput = rest.slice(1).map((t) => t.toLowerCase());
      return { output: [], nextSession: session, devices };
    }
    if ('access-class'.startsWith(cmd)) {
      if (!rest[0]) return { output: ['% Incomplete command.'], nextSession: session, devices };
      dev.vty.accessClass = rest[0];
      return { output: [], nextSession: session, devices };
    }
    if ('logging'.startsWith(cmd) || 'exec-timeout'.startsWith(cmd)) {
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  // DHCP POOL CONFIG
  if (session.mode === 'dhcp-pool' && session.activePool) {
    const pool = dev.dhcpPools?.[session.activePool];
    if (!pool) return { output: ['% DHCP pool not found'], nextSession: session, devices };
    if ('network'.startsWith(cmd)) {
      if (!rest[0] || !rest[1] || !isValidIpv4(rest[0]) || !isValidIpv4(rest[1])) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      }
      pool.network = rest[0];
      pool.mask = rest[1];
      return { output: [], nextSession: session, devices };
    }
    if ('default-router'.startsWith(cmd)) {
      if (!rest[0] || !isValidIpv4(rest[0])) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      }
      pool.defaultRouter = rest[0];
      return { output: [], nextSession: session, devices };
    }
    if ('dns-server'.startsWith(cmd)) {
      if (!rest[0] || !isValidIpv4(rest[0])) {
        return { output: invalidInputLines(mainPart, rest[0]), nextSession: session, devices };
      }
      pool.dnsServer = rest[0];
      return { output: [], nextSession: session, devices };
    }
    return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
  }

  return { output: invalidInputLines(mainPart, tokens[0]), nextSession: session, devices };
}
