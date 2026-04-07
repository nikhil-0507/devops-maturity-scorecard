export interface TeamInfo {
  teamName: string;
  assessorName: string;
  teamSize: string;
  assessorRole: string;
}

export interface QuestionOption {
  label: string;
  description: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  helperText: string;
  options: QuestionOption[];
}

export interface Pillar {
  id: string;
  name: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Answers {
  [questionId: string]: number;
}

export interface PillarScore {
  pillar: string;
  score: number;
  percentage: number;
}

export interface Scores {
  pillars: PillarScore[];
  overall: number;
  maturityLevel: string;
}

export interface Assessment {
  id?: string;
  teamInfo: TeamInfo;
  answers: Answers;
  scores?: Scores;
  aiAnalysis?: AIAnalysis;
  createdAt?: string;
}

export interface PillarAnalysis {
  pillar: string;
  strength: string;
  opportunity: string;
}

export interface ActionItem {
  questionId: string;
  problem: string;
  action: string;
  timeline: string;
  impact: string;
}

export interface AIAnalysis {
  pillarAnalyses: PillarAnalysis[];
  topActions: ActionItem[];
  quickWin: string;
  doraComparison: string;
}
