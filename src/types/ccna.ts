import type { ActiveStudyTrackId, CcnaVersionId, LessonProgressStatus } from './curriculum';

export type WorkspaceTab =
  | 'launch'
  | 'overview'
  | 'curriculum'
  | 'labs'
  | 'subnetting'
  | 'simulator'
  | 'exam';

export type LearningTrackId = 'ccna' | 'it-support';

export type SkillLevelId = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'refresh';

export type DomainId =
  | 'fundamentals'
  | 'access'
  | 'connectivity'
  | 'services'
  | 'security'
  | 'automation';

export type SubnetDrillMode =
  | 'binary-hex'
  | 'network-broadcast'
  | 'host-range'
  | 'wildcard'
  | 'vlsm'
  | 'triage-mask'
  | 'summarize'
  | 'ipv6';

export interface SubnetModeStat {
  attempts: number;
  solved: number;
  totalMs: number;
}

export interface SrsReviewRecord {
  ease: number;
  intervalDays: number;
  nextReviewAt: string;
  lastScore: number;
  total: number;
  lastReviewedAt: string;
}

export interface DomainMeta {
  id: DomainId;
  number: string;
  title: string;
  examWeight: number;
  summary: string;
}

export interface CommandRef {
  command: string;
  mode: string;
  purpose: string;
}

export interface CurriculumLesson {
  id: string;
  domainId: DomainId;
  code: string;
  title: string;
  readMinutes: number;
  summary: string;
  keyPoints: string[];
  deepDive: {
    heading: string;
    body: string;
  }[];
  commands: CommandRef[];
  examTrap: string;
}

export interface DetailedCheckQuestion {
  id: string;
  prompt: string;
  exhibit?: string;
  options: string[];
  correctIndex: number;
  optionDetails: string[];
  deepExplanation: string;
}

export interface SubtopicNode {
  id: string;
  code: string;
  title: string;
  levelTag: Exclude<SkillLevelId, 'refresh'>;
  readMinutes: number;
  summary: string;
  beginnerMentalModel: string;
  sections: {
    heading: string;
    body: string;
    bullets?: string[];
  }[];
  commands: CommandRef[];
  takeaway: string;
  knowledgeCheck: DetailedCheckQuestion[];
}

export interface LearningTopic {
  id: string;
  trackId: LearningTrackId;
  number: string;
  title: string;
  levelTag: Exclude<SkillLevelId, 'refresh'>;
  domainRef?: string;
  summary: string;
  subtopics: SubtopicNode[];
  topicExam: DetailedCheckQuestion[];
}

export interface QuizAttemptRecord {
  score: number;
  total: number;
  selected: Record<string, number>;
  completedAt: string;
}

export type DeviceKind = 'router' | 'switch' | 'host';

export interface SimInterface {
  name: string;
  shortName: string;
  description?: string;
  ip?: string;
  mask?: string;
  adminUp: boolean;
  protocolUp: boolean;
  errDisabled?: boolean;
  errDisabledReason?: string;
  speed?: 'auto' | '100' | '1000';
  duplex?: 'auto' | 'half' | 'full';
  routedPort?: boolean;
  isSvi?: boolean;
  switchportMode?: 'access' | 'trunk';
  accessVlan?: number;
  trunkAllowedVlans?: string;
  nativeVlan?: number;
  channelGroup?: {
    id: number;
    mode: 'active' | 'passive' | 'on';
  };
  portFast?: boolean;
  bpduGuard?: boolean;
  helperAddress?: string;
  natRole?: 'inside' | 'outside';
  hsrp?: {
    group: number;
    vip: string;
    priority?: number;
    preempt?: boolean;
  };
  subinterfaces?: Record<
    string,
    {
      vlanId: number;
      ip?: string;
      mask?: string;
      adminUp: boolean;
    }
  >;
  ospfCost?: number;
  accessGroupIn?: string;
  accessGroupOut?: string;
  portSecurity?: {
    enabled: boolean;
    maximum: number;
    violation: 'shutdown' | 'restrict' | 'protect';
    macSticky?: boolean;
  };
  connectedTo?: {
    deviceId: string;
    interfaceName: string;
  };
}

export interface OspfConfig {
  processId?: number;
  routerId?: string;
  passiveInterfaces?: string[];
  defaultOriginate?: boolean;
  referenceBandwidthMbps?: number;
  networks: {
    network: string;
    wildcard: string;
    area: number;
  }[];
}

export interface StaticRouteEntry {
  prefix: string;
  mask: string;
  nextHop: string;
  ad: number;
}

export interface AclEntry {
  id: string;
  type: 'standard' | 'extended';
  rules: string[];
}

export interface DhcpPoolConfig {
  network: string;
  mask: string;
  defaultRouter?: string;
  dnsServer?: string;
}

export interface SimDevice {
  id: string;
  hostname: string;
  kind: DeviceKind;
  enableSecret?: string;
  bannerMotd?: string;
  domainName?: string;
  sshVersion?: number;
  rsaModulus?: number;
  users?: Record<string, string>;
  vty?: {
    loginLocal?: boolean;
    transportInput?: string[];
    accessClass?: string;
  };
  ipRouting?: boolean;
  lldpEnabled?: boolean;
  dhcpSnooping?: {
    enabled: boolean;
    vlans: number[];
  };
  dhcpPools?: Record<string, DhcpPoolConfig>;
  dhcpExcluded?: string[];
  natRules?: {
    aclId: string;
    overloadInterface: string;
  }[];
  syslogBuffer?: string[];
  vlans: Record<number, string>;
  interfaces: Record<string, SimInterface>;
  ospf: OspfConfig;
  staticRoutes: StaticRouteEntry[];
  acls: Record<string, AclEntry>;
  stpRootVlans: number[];
  defaultGateway?: string;
  x: number;
  y: number;
}

export interface LabObjective {
  id: string;
  label: string;
  check: (devices: Record<string, SimDevice>) => boolean;
}

export interface TopologyLink {
  fromDevice: string;
  fromIf: string;
  toDevice: string;
  toIf: string;
  label?: string;
}

export interface CcnaLab {
  id: string;
  number: string;
  domainId: DomainId;
  category?: 'Build' | 'Troubleshoot';
  faultSummary?: string;
  title: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Exam-Level';
  estimatedMinutes: number;
  brief: string;
  initialDevices: Record<string, SimDevice>;
  links: TopologyLink[];
  objectives: LabObjective[];
  starterHint: string;
}

export interface DragDropConfig {
  items: string[];
  targets: {
    id: string;
    slotLabel: string;
    correctItem: string;
  }[];
}

export interface ExamExhibitTab {
  title: string;
  output: string;
}

export type ItSupportDomainId =
  | 'hardware-os'
  | 'ticketing-itsm'
  | 'identity-ad'
  | 'endpoint-network'
  | 'm365-security';

export type ExamDomainId = DomainId | ItSupportDomainId;

export interface ExamDomainMeta {
  id: ExamDomainId;
  number: string;
  title: string;
  summary: string;
}

export type ExamDifficulty = 'easy' | 'medium' | 'hard';

export interface ExamQuestion {
  id: string;
  trackId?: LearningTrackId;
  domainId: ExamDomainId;
  difficulty?: ExamDifficulty;
  topic: string;
  questionType?: 'single' | 'multi' | 'drag-drop' | 'simlet' | 'scenario';
  multiSelect?: boolean;
  prompt: string;
  exhibit?: string;
  exhibitTabs?: ExamExhibitTab[];
  dragDrop?: DragDropConfig;
  options: string[];
  correctIndices: number[];
  hints?: [string, string];
  explanation: string;
}

export interface ExamAttemptSummary {
  id: string;
  dateIso: string;
  trackId?: LearningTrackId;
  mode: string;
  totalQuestions: number;
  correctCount: number;
  domainFilter: ExamDomainId | 'all';
}

export interface SimTicketAttempt {
  score: number;
  maxScore: number;
  attempts: number;
  completedAt: string;
}

export interface LocalProgressState {
  theme: 'dark' | 'light';
  activeTrack: LearningTrackId | null;
  activeStudyTrack: ActiveStudyTrackId | null;
  selectedLevel: SkillLevelId | null;
  ccnaVersion: CcnaVersionId;
  completedLessons: string[];
  completedInTrack: Record<string, ActiveStudyTrackId>;
  revisionCompletedByTrack: Record<string, string[]>;
  addendumReadByTrack: Record<string, string[]>;
  lastLessonByTrack: Record<string, string>;
  completedLabs: string[];
  lessonStatusById: Record<string, LessonProgressStatus>;
  bookmarkedLessons: string[];
  comfortableReadingMode: boolean;
  lessonNotes: Record<string, string>;
  subtopicChecks: Record<string, QuizAttemptRecord>;
  deepCheckResults: Record<string, QuizAttemptRecord>;
  revisionCheckResults: Record<string, QuizAttemptRecord>;
  topicExams: Record<string, QuizAttemptRecord>;
  subtopicSrs: Record<string, SrsReviewRecord>;
  subnetSolved: number;
  subnetAttempts: number;
  subnetStreak: number;
  subnetBestStreak: number;
  subnetStatsByMode: Record<SubnetDrillMode, SubnetModeStat>;
  examHistory: ExamAttemptSummary[];
  answeredQuestions: Record<string, boolean>;
  completedSimTickets: Record<string, SimTicketAttempt>;
}
