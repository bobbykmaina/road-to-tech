import { CCNA_TOPICS } from '../data/ccnaPath';
import { CCNA_DOMAINS } from '../data/curriculum';
import { IT_SUPPORT_TOPICS } from '../data/itSupportPath';
import { CCNA_LABS } from '../data/labs';
import { EXAM_QUESTIONS, IT_SUPPORT_DOMAINS, IT_SUPPORT_EXAM_QUESTIONS } from '../data/mockExam';
import {
  DomainId,
  ItSupportDomainId,
  LearningTopic,
  LearningTrackId,
  LocalProgressState,
  SubtopicNode,
} from '../types/ccna';

const CCNA_TOPIC_DOMAIN_MAP: Record<string, DomainId> = {
  'ccna-t1-foundations': 'fundamentals',
  'ccna-t2-subnetting': 'fundamentals',
  'ccna-t3-switching': 'access',
  'ccna-t4-routing': 'connectivity',
  'ccna-t5-services': 'services',
  'ccna-t6-security': 'security',
  'ccna-t7-automation': 'automation',
};

const IT_SUPPORT_TOPIC_DOMAIN_MAP: Record<string, ItSupportDomainId> = {
  'it-t1-hardware-os': 'hardware-os',
  'it-t2-ticketing': 'ticketing-itsm',
  'it-t3-active-directory': 'identity-ad',
  'it-t4-network-support': 'endpoint-network',
  'it-t5-m365-security': 'm365-security',
};

export interface DomainReadinessSummary {
  domainId: DomainId;
  number: string;
  title: string;
  examWeight: number;
  summary: string;
  subtopicsTotal: number;
  subtopicsDone: number;
  labsTotal: number;
  labsDone: number;
  examCorrect: number;
  examAttempted: number;
  readinessPct: number;
  targetTopicId: string;
}

export interface ItSupportDomainReadinessSummary {
  domainId: ItSupportDomainId;
  number: string;
  title: string;
  summary: string;
  subtopicsTotal: number;
  subtopicsDone: number;
  topicExamDone: boolean;
  examCorrect: number;
  examAttempted: number;
  readinessPct: number;
  targetTopicId: string;
}

export interface DueReviewItem {
  trackId: LearningTrackId;
  topic: LearningTopic;
  subtopic: SubtopicNode;
  reason: string;
  lastScore: number;
  total: number;
}

export function computeBlueprintReadiness(progress: LocalProgressState): {
  domains: DomainReadinessSummary[];
  weightedOverallPct: number;
} {
  const domains: DomainReadinessSummary[] = CCNA_DOMAINS.map((dom) => {
    const matchingTopics = CCNA_TOPICS.filter((t) => CCNA_TOPIC_DOMAIN_MAP[t.id] === dom.id);
    const subtopics = matchingTopics.flatMap((t) => t.subtopics);
    const subtopicsDone = subtopics.filter((s) => Boolean(progress.subtopicChecks[s.id])).length;

    const subtopicScoreSum = subtopics.reduce((acc, s) => {
      const rec = progress.subtopicChecks[s.id];
      if (!rec || rec.total === 0) return acc;
      return acc + rec.score / rec.total;
    }, 0);

    const domLabs = CCNA_LABS.filter((l) => l.domainId === dom.id);
    const labsDone = domLabs.filter((l) => progress.completedLabs.includes(l.id)).length;

    const domQuestions = EXAM_QUESTIONS.filter((q) => q.domainId === dom.id);
    const attemptedQs = domQuestions.filter((q) => progress.answeredQuestions[q.id] !== undefined);
    const correctQs = attemptedQs.filter((q) => progress.answeredQuestions[q.id] === true);

    const subFactor = subtopics.length > 0 ? subtopicScoreSum / subtopics.length : 0;
    const labFactor = domLabs.length > 0 ? labsDone / domLabs.length : subFactor;
    const examFactor = attemptedQs.length > 0 ? correctQs.length / attemptedQs.length : subFactor;

    const readinessPct = Math.round((subFactor * 0.5 + labFactor * 0.25 + examFactor * 0.25) * 100);

    return {
      domainId: dom.id,
      number: dom.number,
      title: dom.title,
      examWeight: dom.examWeight,
      summary: dom.summary,
      subtopicsTotal: subtopics.length,
      subtopicsDone,
      labsTotal: domLabs.length,
      labsDone,
      examCorrect: correctQs.length,
      examAttempted: attemptedQs.length,
      readinessPct,
      targetTopicId: matchingTopics[0]?.id ?? CCNA_TOPICS[0].id,
    };
  });

  const weightedOverallPct = Math.round(
    domains.reduce((sum, d) => sum + d.readinessPct * (d.examWeight / 100), 0),
  );

  return { domains, weightedOverallPct };
}

export function computeItSupportReadiness(progress: LocalProgressState): {
  domains: ItSupportDomainReadinessSummary[];
  overallPct: number;
} {
  const domains: ItSupportDomainReadinessSummary[] = IT_SUPPORT_DOMAINS.map((dom) => {
    const domId = dom.id as ItSupportDomainId;
    const matchingTopics = IT_SUPPORT_TOPICS.filter(
      (t) => IT_SUPPORT_TOPIC_DOMAIN_MAP[t.id] === domId,
    );
    const subtopics = matchingTopics.flatMap((t) => t.subtopics);
    const subtopicsDone = subtopics.filter((s) => Boolean(progress.subtopicChecks[s.id])).length;

    const subtopicScoreSum = subtopics.reduce((acc, s) => {
      const rec = progress.subtopicChecks[s.id];
      if (!rec || rec.total === 0) return acc;
      return acc + rec.score / rec.total;
    }, 0);

    const topicExamRecords = matchingTopics
      .map((t) => progress.topicExams[t.id])
      .filter((r): r is NonNullable<typeof r> => Boolean(r));
    const topicExamFactor =
      topicExamRecords.length > 0
        ? topicExamRecords.reduce((acc, r) => acc + (r.total > 0 ? r.score / r.total : 0), 0) /
          matchingTopics.length
        : subtopics.length > 0
          ? subtopicScoreSum / subtopics.length
          : 0;

    const domQuestions = IT_SUPPORT_EXAM_QUESTIONS.filter((q) => q.domainId === domId);
    const attemptedQs = domQuestions.filter((q) => progress.answeredQuestions[q.id] !== undefined);
    const correctQs = attemptedQs.filter((q) => progress.answeredQuestions[q.id] === true);

    const subFactor = subtopics.length > 0 ? subtopicScoreSum / subtopics.length : 0;
    const examFactor = attemptedQs.length > 0 ? correctQs.length / attemptedQs.length : subFactor;

    const readinessPct = Math.round(
      (subFactor * 0.5 + topicExamFactor * 0.25 + examFactor * 0.25) * 100,
    );

    return {
      domainId: domId,
      number: dom.number,
      title: dom.title,
      summary: dom.summary,
      subtopicsTotal: subtopics.length,
      subtopicsDone,
      topicExamDone: topicExamRecords.length > 0,
      examCorrect: correctQs.length,
      examAttempted: attemptedQs.length,
      readinessPct,
      targetTopicId: matchingTopics[0]?.id ?? IT_SUPPORT_TOPICS[0].id,
    };
  });

  const overallPct = Math.round(
    domains.reduce((sum, d) => sum + d.readinessPct, 0) / Math.max(1, domains.length),
  );

  return { domains, overallPct };
}

export function getDueSpacedReviews(
  progress: LocalProgressState,
  scope: 'active' | 'all' = 'active',
): DueReviewItem[] {
  const topics =
    scope === 'all'
      ? [...CCNA_TOPICS, ...IT_SUPPORT_TOPICS]
      : progress.activeTrack === 'it-support'
        ? IT_SUPPORT_TOPICS
        : CCNA_TOPICS;
  const nowMs = Date.now();
  const due: DueReviewItem[] = [];

  for (const topic of topics) {
    for (const sub of topic.subtopics) {
      const check = progress.subtopicChecks[sub.id];
      const srs = progress.subtopicSrs?.[sub.id];
      if (!check && !srs) continue;

      if (srs) {
        const nextMs = Date.parse(srs.nextReviewAt);
        const missedSome = srs.lastScore < srs.total;
        if (missedSome || (!Number.isNaN(nextMs) && nextMs <= nowMs)) {
          due.push({
            trackId: topic.trackId,
            topic,
            subtopic: sub,
            reason: missedSome
              ? `Missed items (${srs.lastScore}/${srs.total}) — reinforce now`
              : `Interval (${srs.intervalDays}d) elapsed`,
            lastScore: srs.lastScore,
            total: srs.total,
          });
        }
      } else if (check && check.score < check.total) {
        due.push({
          trackId: topic.trackId,
          topic,
          subtopic: sub,
          reason: `Missed items (${check.score}/${check.total}) — reinforce now`,
          lastScore: check.score,
          total: check.total,
        });
      }
    }
  }

  return due;
}
