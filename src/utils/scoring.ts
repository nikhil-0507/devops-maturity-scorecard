import { Answers, Scores, PillarScore } from '../types/assessment';
import { pillars } from '../data/questions';

export function calculateScores(answers: Answers): Scores {
  const pillarScores: PillarScore[] = pillars.map(pillar => {
    const questionIds = pillar.questions.map(q => q.id);
    const scores = questionIds.map(id => answers[id] || 0);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const percentage = Math.round((average / 4) * 100);

    return {
      pillar: pillar.name,
      score: average,
      percentage
    };
  });

  const overall = Math.round(
    pillarScores.reduce((sum, p) => sum + p.percentage, 0) / pillarScores.length
  );

  let maturityLevel = '';
  if (overall <= 40) {
    maturityLevel = 'Crawling';
  } else if (overall <= 60) {
    maturityLevel = 'Walking';
  } else if (overall <= 80) {
    maturityLevel = 'Running';
  } else {
    maturityLevel = 'Flying';
  }

  return {
    pillars: pillarScores,
    overall,
    maturityLevel
  };
}

export function getMaturityDescription(level: string): string {
  const descriptions: Record<string, string> = {
    'Crawling': 'You\'re in the early stages. Foundational work is needed but every improvement matters.',
    'Walking': 'You have the basics in place. Now it\'s about consistency and removing manual steps.',
    'Running': 'You\'re operating at a high level. Focus on reliability, speed, and culture.',
    'Flying': 'Elite performance. You\'re among the top engineering organisations in the world.'
  };
  return descriptions[level] || '';
}

export function getScoreColor(percentage: number): string {
  if (percentage < 50) return 'bg-red-500';
  if (percentage < 70) return 'bg-amber-500';
  return 'bg-green-500';
}

export function getTextColor(percentage: number): string {
  if (percentage < 50) return 'text-red-600';
  if (percentage < 70) return 'text-amber-600';
  return 'text-green-600';
}
