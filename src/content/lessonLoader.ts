import { DeepLessonDocument } from '../types/curriculum';

type LessonModuleMap = Record<string, DeepLessonDocument>;
type LessonImporter = () => Promise<DeepLessonDocument>;

function createUnitImporter(
  loadModule: () => Promise<LessonModuleMap>,
  lessonId: string,
): LessonImporter {
  let modPromise: Promise<LessonModuleMap> | null = null;
  return async () => {
    if (!modPromise) {
      modPromise = loadModule();
    }
    const map = await modPromise;
    return map[lessonId];
  };
}

function registerUnitEntries(
  registry: Record<string, LessonImporter>,
  ids: string[],
  loadModule: () => Promise<LessonModuleMap>,
): void {
  let sharedModulePromise: Promise<LessonModuleMap> | null = null;
  const cachedLoader = () => {
    if (!sharedModulePromise) {
      sharedModulePromise = loadModule();
    }
    return sharedModulePromise;
  };
  for (const id of ids) {
    registry[id] = createUnitImporter(cachedLoader, id);
  }
}

const LESSON_IMPORTERS: Record<string, LessonImporter> = {
  'ccna.v2.3.3.2': async () => {
    const mod = await import('./lessons/ccna/ccna_v2_3_3_2');
    return mod.LESSON_CCNA_V2_3_3_2;
  },
  'itsup.0.1.1': async () => {
    const mod = await import('./lessons/itsupport/itsup_0_1_1');
    return mod.LESSON_ITSUP_0_1_1;
  },
};

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.core.0.1',
    'ccna.core.0.2',
    'ccna.core.0.3',
    'ccna.core.0.4.eth',
    'ccna.core.0.5',
    'ccna.core.0.4',
    'ccna.core.0.7',
  ],
  () => import('./lessons/ccna/ccna_unit0_foundations').then((m) => m.CCNA_UNIT0_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.v11.1.1',
    'ccna.v11.1.2',
    'ccna.core.net.cabling-interfaces',
    'ccna.v11.1.5',
    'ccna.core.ip.ipv4-subnetting',
    'ccna.v11.1.7',
  ],
  () => import('./lessons/ccna/ccna_unit1_a').then((m) => m.CCNA_UNIT1_A_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.core.ip.ipv6-addressing',
    'ccna.core.wl.wireless-principles',
    'ccna.core.svc.dhcpv4',
    'ccna.core.net.client-connectivity',
    'ccna.core.net.virtualization-containers',
  ],
  () => import('./lessons/ccna/ccna_unit1_b').then((m) => m.CCNA_UNIT1_B_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.core.sw.switching-fundamentals',
    'ccna.core.sw.access-edge-ports',
    'ccna.core.sw.trunks-8021q',
    'ccna.core.sw.etherchannel-lacp',
    'ccna.core.sw.rapid-pvst',
  ],
  () => import('./lessons/ccna/ccna_unit2_a').then((m) => m.CCNA_UNIT2_A_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  ['ccna.core.sw.cdp-lldp', 'ccna.v2.2.4', 'ccna.v11.2.6', 'ccna.v11.2.8', 'ccna.v11.2.9'],
  () => import('./lessons/ccna/ccna_unit2_b').then((m) => m.CCNA_UNIT2_B_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.core.rt.routing-table',
    'ccna.core.rt.static-routing',
    'ccna.core.rt.ospf-concepts',
    'ccna.v2.3.3.3',
    'ccna.core.rt.fhrp-hsrp-vrrp',
  ],
  () => import('./lessons/ccna/ccna_unit3_routing').then((m) => m.CCNA_UNIT3_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.core.svc.dns',
    'ccna.core.svc.nat-pat',
    'ccna.v11.4.2',
    'ccna.v11.4.8',
    'ccna.v11.4.9',
    'ccna.v11.4.7',
    'ccna.v2.4.2',
  ],
  () => import('./lessons/ccna/ccna_unit4_services').then((m) => m.CCNA_UNIT4_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.v11.5.1',
    'ccna.v11.5.2',
    'ccna.v11.5.3',
    'ccna.v11.5.4',
    'ccna.core.sec.aaa-tacacs-radius',
  ],
  () => import('./lessons/ccna/ccna_unit5_a').then((m) => m.CCNA_UNIT5_A_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.core.sec.ipsec-vpn',
    'ccna.core.sec.acls',
    'ccna.core.sec.layer2-security',
    'ccna.v11.5.9',
    'ccna.v11.5.10',
  ],
  () => import('./lessons/ccna/ccna_unit5_b').then((m) => m.CCNA_UNIT5_B_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'ccna.v11.6.1',
    'ccna.core.ops.management-approaches',
    'ccna.core.ops.snmp',
    'ccna.core.ops.syslog',
    'ccna.core.ops.ansible',
  ],
  () => import('./lessons/ccna/ccna_unit6_a').then((m) => m.CCNA_UNIT6_A_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  ['ccna.core.ops.ai-netops', 'ccna.v2.5.2', 'ccna.v11.6.5', 'ccna.v11.6.7'],
  () => import('./lessons/ccna/ccna_unit6_b').then((m) => m.CCNA_UNIT6_B_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'itsup.0.1.2',
    'itsup.core.tickets.lifecycle',
    'itsup.core.tickets.notes-kb',
    'itsup.core.hw.workstation-triage',
    'itsup.core.os.windows-cli-logs',
  ],
  () => import('./lessons/itsupport/itsup_core_a').then((m) => m.ITSUP_CORE_A_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'itsup.core.net.endpoint-triage',
    'itsup.core.iam.ad-entra-gpo',
    'itsup.core.cloud.m365-admin',
    'itsup.core.sec.containment-bitlocker',
    'itsup.core.ops.troubleshooting-remote',
  ],
  () => import('./lessons/itsupport/itsup_core_b').then((m) => m.ITSUP_CORE_B_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'itsup.core.tools.landscape',
    'itsup.core.tools.translation',
    'itsup.core.tools.jsm',
    'itsup.core.tools.servicenow',
    'itsup.core.tools.zendesk',
  ],
  () => import('./lessons/itsupport/itsup_tools_a').then((m) => m.ITSUP_TOOLS_A_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'itsup.core.tools.freshservice',
    'itsup.core.tools.manageengine',
    'itsup.core.tools.opensource',
    'itsup.core.itsm.itil4-metrics',
    'itsup.core.career.interview-prep',
  ],
  () => import('./lessons/itsupport/itsup_tools_b').then((m) => m.ITSUP_TOOLS_B_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  ['itsup.0.1.3', 'itsup.0.3.1', 'itsup.0.4.1', 'itsup.1.4.1', 'itsup.1.8.1'],
  () => import('./lessons/itsupport/itsup_u0_u1_extra').then((m) => m.ITSUP_U0_U1_EXTRA_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'itsup.2.2.1',
    'itsup.2.3.1',
    'itsup.2.4.1',
    'itsup.2.6.1',
    'itsup.3.1.2',
    'itsup.3.2.1',
    'itsup.3.4.1',
    'itsup.3.5.1',
    'itsup.3.6.1',
    'itsup.3.7.1',
  ],
  () => import('./lessons/itsupport/itsup_u2_u3_extra').then((m) => m.ITSUP_U2_U3_EXTRA_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  [
    'itsup.4.2.1',
    'itsup.4.3.1',
    'itsup.4.4.1',
    'itsup.4.6.1',
    'itsup.5.2.1',
    'itsup.5.3.1',
    'itsup.5.5.1',
  ],
  () => import('./lessons/itsupport/itsup_u4_u5_extra').then((m) => m.ITSUP_U4_U5_EXTRA_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  ['itsup.6.2.1', 'itsup.6.3.1', 'itsup.6.4.1', 'itsup.6.6.1'],
  () => import('./lessons/itsupport/itsup_u6_extra').then((m) => m.ITSUP_U6_EXTRA_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  ['itsup.7.2.1', 'itsup.7.3.1', 'itsup.7.4.1', 'itsup.8.2.1', 'itsup.8.3.1'],
  () => import('./lessons/itsupport/itsup_u7_u8_extra').then((m) => m.ITSUP_U7_U8_EXTRA_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  ['itsup.9.3.1', 'itsup.9.9.1', 'itsup.10.2.1', 'itsup.10.4.1', 'itsup.10.8.1'],
  () => import('./lessons/itsupport/itsup_u9_u10_extra').then((m) => m.ITSUP_U9_U10_EXTRA_LESSONS),
);

registerUnitEntries(
  LESSON_IMPORTERS,
  ['itsup.11.2.1', 'itsup.11.6.1', 'itsup.appendix.quickref'],
  () => import('./lessons/itsupport/itsup_u11_app_extra').then((m) => m.ITSUP_U11_APP_EXTRA_LESSONS),
);

const cache = new Map<string, DeepLessonDocument>();

export async function loadDeepLesson(lessonId: string): Promise<DeepLessonDocument | null> {
  if (cache.has(lessonId)) {
    return cache.get(lessonId)!;
  }
  const loader = LESSON_IMPORTERS[lessonId];
  if (!loader) {
    return null;
  }
  const doc = await loader();
  if (!doc) {
    return null;
  }
  cache.set(lessonId, doc);
  return doc;
}

export function isDeepLessonBuilt(lessonId: string): boolean {
  return Boolean(LESSON_IMPORTERS[lessonId]);
}
