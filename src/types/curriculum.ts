export type CcnaVersionId = 'v1.1' | 'v2.0';

export type ActiveStudyTrackId = 'ccna-v1.1' | 'ccna-v2.0' | 'it-support';

export type LessonVersionScope = 'shared' | 'v1.1-only' | 'v2.0-only';

export type LessonProgressStatus = 'not-started' | 'in-progress' | 'mastered';

export interface BlueprintDomainSpec {
  id: string;
  number: string;
  title: string;
  weightPct: number;
  summary: string;
  officialTopics: {
    code: string;
    title: string;
  }[];
}

export interface VersionAddendum {
  title: string;
  summary: string;
  points: string[];
  cliOrWorkflowDiff?: string;
}

export interface TrackLessonEntry {
  entryId: string;
  contentId: string;
  trackId: ActiveStudyTrackId;
  moduleId: 'ccna' | 'it-support';
  unitId: string;
  unitNumber: string;
  unitTitle: string;
  topicId: string;
  topicNumber: string;
  topicTitle: string;
  code: string;
  title: string;
  readMinutes: number;
  prerequisites: string[];
  relation: LessonVersionScope;
  officialTopicIds: string[];
  domainId?: string;
  verifyFlag?: string;
  summary: string;
  available: boolean;
  versionAddendum?: VersionAddendum;
}

export interface TrackTopicPlan {
  id: string;
  number: string;
  title: string;
  officialTopicIds: string[];
  lessons: TrackLessonEntry[];
}

export interface TrackUnitPlan {
  id: string;
  trackId: ActiveStudyTrackId;
  moduleId: 'ccna' | 'it-support';
  number: string;
  title: string;
  description: string;
  topics: TrackTopicPlan[];
}

export interface SharedContentMapRow {
  contentId: string;
  canonicalTitle: string;
  v11TopicIds: string;
  v20TopicIds: string;
  relation: LessonVersionScope;
  notes: string;
  verifyFlag?: string;
}

// Kept for any legacy callers while transitioning cleanly
export interface LessonMeta {
  id: string;
  moduleId: 'ccna' | 'it-support';
  unitId: string;
  unitNumber: string;
  unitTitle: string;
  topicId: string;
  topicNumber: string;
  topicTitle: string;
  code: string;
  title: string;
  readMinutes: number;
  prerequisites: string[];
  versionScope: LessonVersionScope;
  v11ExamTopics?: string[];
  v20ExamTopics?: string[];
  v11DomainId?: string;
  v20DomainId?: string;
  verifyFlag?: string;
  summary: string;
  available: boolean;
}

export interface CurriculumUnitPlan {
  id: string;
  moduleId: 'ccna' | 'it-support';
  number: string;
  title: string;
  description: string;
  versionScope: LessonVersionScope;
  topics: {
    id: string;
    number: string;
    title: string;
    lessons: LessonMeta[];
  }[];
}

export interface LessonIosCommandExample {
  title: string;
  promptAndCommand: string;
  output: string;
  lineByLine: {
    segment: string;
    meaning: string;
  }[];
}

export interface LessonCheckQuestion {
  id: string;
  prompt: string;
  exhibit?: string;
  options: string[];
  correctIndex: number;
  optionExplanations: string[];
  takeaway: string;
}

export interface GlossaryEntry {
  term: string;
  shortDef: string;
  fullDef: string;
  lessonId?: string;
  moduleId?: 'ccna' | 'it-support' | 'shared';
}

export interface DeepLessonDocument {
  id: string;
  moduleId: 'ccna' | 'it-support';
  unitTitle: string;
  topicTitle: string;
  code: string;
  title: string;
  readMinutes: number;
  prerequisites: string[];
  versionScope: LessonVersionScope;
  v11ExamTopics?: string[];
  v20ExamTopics?: string[];
  verifyFlag?: string;

  // 1. Learning objectives (3-5 measurable)
  learningObjectives: string[];

  // 2. Why this matters (real-world network or user situation)
  whyThisMatters: {
    scenarioTitle: string;
    narrative: string;
  };

  // 3. Plain-English explanation with everyday analogy + precise technical definition
  plainEnglish: {
    analogyTitle: string;
    analogy: string;
    technicalDefinition: string;
    paragraphs: string[];
  };

  // 4. Deep dive: mechanism step-by-step + diagram + worked example
  deepDive: {
    intro: string;
    steps: {
      step: string;
      title: string;
      explanation: string;
    }[];
    diagram: {
      kind: 'svg-ospf-states' | 'svg-support-tiers' | 'ascii';
      caption: string;
      asciiFallback: string;
    };
    workedExample: {
      title: string;
      context: string;
      steps: string[];
      outcome: string;
    };
  };

  // 5a. CCNA IOS CLI examples, verification & optional Agentic AI review
  iosCliGuide?: {
    intro: string;
    commands: LessonIosCommandExample[];
    healthyVsBroken: {
      checkCommand: string;
      healthyLabel: string;
      healthyOutput: string;
      brokenLabel: string;
      brokenOutput: string;
      diagnosis: string;
    };
    aiAssistantReview?: {
      scenario: string;
      aiSuggestion: string;
      verdict: 'correct' | 'partly-correct' | 'wrong';
      explanation: string;
    };
  };

  // 5b. IT Support troubleshooting walkthrough, user wording & ticket notes
  supportWalkthrough?: {
    intro: string;
    steps: {
      phase: string;
      action: string;
      whyItWorks: string;
    }[];
    questionsToAsk: string[];
    sampleUserWording: {
      situation: string;
      sayThis: string;
    }[];
    ticketNoteTemplate: {
      category: string;
      priorityFormula: string;
      internalNotes: string;
      customerReply: string;
      escalationCriteria: string;
    };
  };

  // 6. Common mistakes & exam/interview traps
  commonTraps: {
    trap: string;
    reality: string;
  }[];

  // 7. Key terms (feeds searchable glossary with inline definitions)
  keyTerms: GlossaryEntry[];

  // 8. Check your understanding (4-6 questions, explains why every wrong option is wrong)
  checkQuestions: LessonCheckQuestion[];

  // 9. Hands-on activity
  handsOnActivity: {
    kind: 'cli-lab' | 'ticket-sim' | 'exercise';
    title: string;
    targetTab?: 'labs' | 'subnetting' | 'simulator' | 'exam';
    instructions: string[];
    verificationCheck: string;
  };

  // 10. Summary (5 bullets)
  summaryBullets: string[];

  // 11. Sources to verify (official docs or RFC titles, no invented URLs)
  sourcesToVerify: string[];
}
