
export enum RiskLevel {
  HIGH = 'HIGH',
  MODERATE = 'MODERATE',
  SAFE = 'SAFE'
}

export interface AnalysisResult {
  id: string;
  documentTitle: string;
  summary: string;
  riskLevel: RiskLevel;
  clauses: AnalyzedClause[];
  suggestedAction: string;
  createdAt: string;
}

export interface AnalyzedClause {
  originalText: string;
  simplifiedText: string;
  relevantLaws: string[];
  riskRating: RiskLevel;
}

export interface LawReference {
  id: string;
  section: string;
  act: string;
  category: string;
  title: string;
  description: string;
  punishment?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserSession {
  id: string;
  name: string;
  isGuest: boolean;
}
